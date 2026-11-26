"""Run with:  python -m unittest discover -s tests   (no ffmpeg or whisper needed)"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from aiedit import config
from aiedit.cuts import Timeline, Word, keep_ranges, mark_keep
from aiedit.draft import build_draft_json, validate, write_draft
from aiedit.media import MediaInfo
from aiedit.plan import load_plan, make_plan, save_plan
from aiedit.transcribe import _from_subtitles


def say(text, start, gap=0.12, per=0.3):
    out, t = [], start
    for tok in text.split():
        out.append(Word(tok, t, t + per))
        t += per + gap
    return out, t


def raw_take():
    """Restart, filler, long pause, stutter. Roughly what a real raw take looks like."""
    words = []
    w, t = say("So today I want to", 0.5); words += w          # false start
    w, t = say("So today I want to talk about 3 mistakes I made.", t + 1.4); words += w  # restart (last take wins)
    words.append(Word("um", t + 0.05, t + 0.45)); t += 0.6
    w, t = say("The first one was the the pricing", t + 0.05); words += w
    w, t = say("and nobody told me.", t + 2.5); words += w     # 2.5s dead air
    return words, t


class Cuts(unittest.TestCase):
    def setUp(self):
        self.words, self.end = raw_take()
        self.keep = mark_keep(self.words)

    def test_earlier_take_dropped(self):
        kept = [w.text for w, k in zip(self.words, self.keep) if k]
        self.assertEqual(kept[:3], ["So", "today", "I"])
        self.assertEqual(kept.count("So"), 1)

    def test_filler_and_stutter_dropped(self):
        kept = [w.text for w, k in zip(self.words, self.keep) if k]
        self.assertNotIn("um", kept)
        # "The first one was the the pricing": the doubled "the" collapses to one
        self.assertEqual([k.lower() for k in kept].count("the"), 2)

    def test_long_pause_cut_and_filler_forces_cut(self):
        ranges = keep_ranges(self.words, self.keep, self.end + 1)
        self.assertGreaterEqual(len(ranges), 3)
        total = sum(e - s for s, e in ranges)
        self.assertLess(total, self.end - 3.0)
        for (s1, e1), (s2, e2) in zip(ranges, ranges[1:]):
            self.assertLessEqual(e1, s2)

    def test_stretched_word_exposes_the_pause(self):
        from aiedit.cuts import clamp_words
        words = [Word("crying", 1.0, 3.0), Word("and", 3.1, 3.3)]  # whisper stretched "crying" over silence
        c = clamp_words(words)
        self.assertLess(c[0].end - c[0].start, 1.0)
        ranges = keep_ranges(c, mark_keep(c), 5.0)
        self.assertGreaterEqual(len(ranges), 1)
        self.assertLess(sum(e - s for s, e in ranges), 1.5)

    def test_timeline_map(self):
        tl = Timeline([(1.0, 2.0), (5.0, 6.0)])
        self.assertAlmostEqual(tl.map(1.5), 0.5)
        self.assertAlmostEqual(tl.map(5.25), 1.25)
        self.assertIsNone(tl.map(3.0))

    def test_subtitles(self):
        srt = "1\n00:00:01,000 --> 00:00:03,000\nhello there world\n\n"
        w = _from_subtitles(srt)
        self.assertEqual([x.text for x in w], ["hello", "there", "world"])
        self.assertAlmostEqual(w[0].start, 1.0)


class Draft(unittest.TestCase):
    def build(self, template_name, broll=()):
        words, end = raw_take()
        info = MediaInfo("C:/videos/raw take.mp4", end + 1, 1080, 1920, True)
        tpl = config.apply_brand(config.load_template(template_name), {})
        plan = make_plan(info, words, template_name, tpl, hook="3 mistakes cost me $10,000", broll=broll)
        return plan, tpl

    def test_every_template_builds_a_valid_draft(self):
        for name in config.list_templates():
            plan, tpl = self.build(name)
            content = build_draft_json(plan, tpl, "t")
            self.assertEqual(validate(content), [], name)
            kinds = [t["type"] for t in content["tracks"]]
            self.assertEqual(kinds[0], "video")
            self.assertIn("text", kinds)
            json.dumps(content)

    def test_captions_never_overlap_and_emphasis_found(self):
        plan, _ = self.build("punch")
        caps = plan["captions"]
        for a, b in zip(caps, caps[1:]):
            self.assertLessEqual(a["end"], b["start"] + 1e-6)
        self.assertTrue(any(w["emph"] for c in caps for w in c["words"]))
        self.assertTrue(any(w["text"] == "3" and w["emph"] for c in caps for w in c["words"]))

    def test_broll_track(self):
        clip = MediaInfo("C:/videos/b1.mp4", 8.0, 1080, 1920, False)
        words, end = raw_take()
        long_words = words + [Word(w.text, w.start + end + 0.5 + i * 0, w.end + end + 0.5) for i, w in enumerate(words)]
        info = MediaInfo("C:/videos/raw take.mp4", 2 * end + 2, 1080, 1920, True)
        tpl = config.apply_brand(config.load_template("soft"), {})
        plan = make_plan(info, long_words, "soft", tpl, hook="x y", broll=[clip])
        content = build_draft_json(plan, tpl, "t")
        self.assertEqual(validate(content), [])
        videos = [t for t in content["tracks"] if t["type"] == "video"]
        if plan["stats"]["edited_seconds"] > 5:
            self.assertEqual(len(videos), 2)
            self.assertTrue(all(s["volume"] == 0.0 for s in videos[1]["segments"]))

    def test_write_to_folder_and_register(self):
        plan, tpl = self.build("clean")
        with tempfile.TemporaryDirectory() as tmp:
            drafts = Path(tmp)
            (drafts / "root_meta_info.json").write_text(json.dumps({"all_draft_store": [], "draft_ids": 0, "root_path": tmp}))
            folder, registered = write_draft(plan, tpl, drafts, "raw take")
            self.assertTrue((folder / "draft_content.json").exists())
            self.assertTrue((folder / "draft_meta_info.json").exists())
            content = json.loads((folder / "draft_content.json").read_text(encoding="utf-8"))
            self.assertEqual(validate(content), [])
            folder2, _ = write_draft(plan, tpl, drafts, "raw take")
            self.assertNotEqual(folder, folder2)  # never overwrites an existing draft
            if registered:
                root = json.loads((drafts / "root_meta_info.json").read_text())
                names = [d["draft_name"] for d in root["all_draft_store"]]
                self.assertEqual(names, ["raw take (2)", "raw take"])

    def test_brand_templates_ignore_global_brand_and_prefer_bundled_fonts(self):
        brand = {"color": "#123456", "highlight": "#654321", "caption_font": "X.ttf"}
        for name in ("cso", "camica", "lm"):
            t = config.apply_brand(config.load_template(name), brand)
            self.assertNotEqual(t["caption"]["color"], "#123456", name)
        from aiedit import fonts
        self.assertEqual(fonts.font_dirs()[0], fonts.BUNDLED)

    def test_plan_roundtrip(self):
        plan, _ = self.build("pop")
        with tempfile.TemporaryDirectory() as tmp:
            save_plan(plan, Path(tmp) / "plan.json")
            self.assertEqual(load_plan(Path(tmp) / "plan.json")["keep"], plan["keep"])


if __name__ == "__main__":
    unittest.main()
