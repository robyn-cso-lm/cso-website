from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from . import config, media
from .draft import validate, write_draft, build_draft_json
from .plan import load_plan, make_plan, save_plan
from .transcribe import load_words, save_words, transcribe


def work_dir(video):
    d = Path(video).resolve().parent / "edits" / Path(video).stem
    d.mkdir(parents=True, exist_ok=True)
    return d


def cmd_doctor(a):
    ok = True
    for tool in ("ffmpeg", "ffprobe"):
        found = shutil.which(tool)
        print(f"{'OK     ' if found else 'MISSING'} {tool}")
        ok &= bool(found)
    try:
        import faster_whisper  # noqa: F401
        print("OK      faster-whisper")
    except ImportError:
        print("MISSING faster-whisper  (pip install faster-whisper)  [optional if you pass --transcript]")
    from . import fonts
    for name in ("PlayfairDisplay-BoldItalic", "InstrumentSans-Bold", "Montserrat-SemiBold", "Cinzel-Bold", "Gloock-Regular"):
        path = fonts.resolve(name)
        bundled = path.startswith(str(fonts.BUNDLED).replace("\\", "/"))
        print(f"{'OK     ' if bundled else 'MISSING'} brand font {name}" + ("" if bundled else "  (put the .ttf in fonts/)"))
        ok &= bundled
    d = config.capcut_drafts_dir()
    print(f"{'OK     ' if d.exists() else 'MISSING'} CapCut drafts folder: {d}")
    ok &= d.exists()
    print(f"Python {sys.version.split()[0]}")
    if not ok:
        print("\nInstall help:\n  Windows:  winget install Gyan.FFmpeg\n  Mac:      brew install ffmpeg\n"
              "  Then open CapCut once so it creates its drafts folder.")
    return 0 if ok else 1


def cmd_templates(a):
    for name, p in config.list_templates().items():
        t = config.load_template(name)
        print(f"{name:10} {t['label']:20} {t['best_for']}")


def cmd_brand(a):
    b = config.load_brand()
    for k in ("caption_font", "hook_font", "color", "highlight", "stroke"):
        v = getattr(a, k)
        if v:
            b[k] = v
    if a.clear:
        b = {}
    config.save_brand(b)
    print("Brand saved:" if b else "Brand cleared.", b or "")


def _opts(a):
    return {"restart_gap": a.restart_gap, "max_gap": a.max_gap, "drop_restarts": not a.keep_restarts}


def analyze_one(video, a):
    info = media.probe(video)
    wd = work_dir(video)
    tpath = wd / "transcript.json"
    if a.transcript:
        words = load_words(a.transcript)
    elif tpath.exists() and not a.retranscribe:
        words = load_words(tpath)
    else:
        print(f"Transcribing {Path(video).name} ...")
        words, lang = transcribe(video, a.model, a.language)
        save_words(words, tpath, lang)
    brand = config.load_brand()
    template = config.apply_brand(config.load_template(a.template), brand)
    broll = [media.probe(p) for p in _broll_files(a.broll)]
    plan = make_plan(info, words, a.template, template, a.hook, a.emphasis or (), _opts(a), broll)
    ppath = wd / "plan.json"
    save_plan(plan, ppath)
    s = plan["stats"]
    print(f"{Path(video).name}: {s['raw_seconds']}s -> {s['edited_seconds']}s, {s['cuts']} cuts, {s['words_dropped']} words dropped")
    print(f"Hook: {plan['hook']['text']!r}{'  (auto, rewrite me)' if plan['hook']['auto'] else ''}")
    print(f"Plan: {ppath}")
    return ppath


def _broll_files(folder):
    if not folder:
        return []
    p = Path(folder)
    files = [p] if p.is_file() else sorted(x for x in p.iterdir() if x.suffix.lower() in media.VIDEO_EXT)
    return files


def build_one(ppath, a):
    plan = load_plan(ppath)
    template = config.apply_brand(config.load_template(a.template or plan["template"]), config.load_brand())
    problems = validate(build_draft_json(plan, template, "check"))
    if problems:
        raise SystemExit("Draft failed its own check:\n  " + "\n  ".join(problems[:10]))
    folder, registered = write_draft(plan, template, a.out, a.name, register=not a.no_register)
    print(f"CapCut draft written: {folder}")
    print("It should show in CapCut's project list." if registered else
          "Open CapCut (or restart it). If the draft is not listed, close CapCut and rerun `build` to register it.")
    return folder


def cmd_analyze(a):
    analyze_one(a.video, a)


def cmd_build(a):
    build_one(a.plan, a)


def cmd_edit(a):
    build_one(analyze_one(a.video, a), a)


def cmd_batch(a):
    folder = Path(a.folder)
    vids = sorted(p for p in folder.iterdir() if p.suffix.lower() in media.VIDEO_EXT)
    if not vids:
        raise SystemExit(f"No videos found in {folder}")
    print(f"{len(vids)} videos found")
    failed = []
    for v in vids:
        try:
            build_one(analyze_one(v, a), a)
        except (Exception, SystemExit) as e:
            failed.append((v.name, str(e)))
            print(f"  FAILED {v.name}: {e}")
    print(f"\nDone. {len(vids) - len(failed)} drafts built, {len(failed)} failed.")
    return 1 if failed else 0


def cmd_frames(a):
    out = Path(a.out or Path(a.video).with_suffix("")).resolve()
    paths = media.extract_frames(a.video, out, a.count)
    print("\n".join(paths))


def main(argv=None):
    p = argparse.ArgumentParser(prog="editor.py", description="Hand it a raw video, get back an editable CapCut draft.")
    sub = p.add_subparsers(dest="cmd", required=True)

    def add_edit_opts(sp):
        sp.add_argument("--template", default="punch", help="see `templates`")
        sp.add_argument("--hook", help="hook text for the first 3 seconds (default: auto from your first sentence)")
        sp.add_argument("--emphasis", nargs="*", help="words to always highlight in captions")
        sp.add_argument("--transcript", help=".json/.srt/.vtt you already have (skips transcribing)")
        sp.add_argument("--retranscribe", action="store_true")
        sp.add_argument("--model", default="small", help="whisper model: tiny, base, small, medium, large-v3")
        sp.add_argument("--language")
        sp.add_argument("--broll", help="a clip or a folder of clips to lay over the talking")
        sp.add_argument("--max-gap", type=float, default=0.4, help="longest pause kept, seconds")
        sp.add_argument("--restart-gap", type=float, default=0.7, help="pause that counts as a restart, seconds")
        sp.add_argument("--keep-restarts", action="store_true", help="do not drop earlier takes")
        sp.add_argument("--out", help="CapCut drafts folder (default: auto-detect)")
        sp.add_argument("--name", help="draft name (default: video file name)")
        sp.add_argument("--no-register", action="store_true", help="do not touch CapCut's project list")

    sp = sub.add_parser("doctor", help="check ffmpeg, whisper and CapCut"); sp.set_defaults(fn=cmd_doctor)
    sp = sub.add_parser("templates", help="list templates"); sp.set_defaults(fn=cmd_templates)
    sp = sub.add_parser("brand", help="save your fonts and colours once")
    sp.add_argument("--caption-font"); sp.add_argument("--hook-font")
    sp.add_argument("--color"); sp.add_argument("--highlight"); sp.add_argument("--stroke")
    sp.add_argument("--clear", action="store_true"); sp.set_defaults(fn=cmd_brand)
    sp = sub.add_parser("analyze", help="transcribe and write plan.json"); sp.add_argument("video")
    add_edit_opts(sp); sp.set_defaults(fn=cmd_analyze)
    sp = sub.add_parser("build", help="turn plan.json into a CapCut draft"); sp.add_argument("plan")
    sp.add_argument("--template"); sp.add_argument("--out"); sp.add_argument("--name")
    sp.add_argument("--no-register", action="store_true"); sp.set_defaults(fn=cmd_build)
    sp = sub.add_parser("edit", help="analyze + build in one go"); sp.add_argument("video")
    add_edit_opts(sp); sp.set_defaults(fn=cmd_edit)
    sp = sub.add_parser("batch", help="edit every video in a folder"); sp.add_argument("folder")
    add_edit_opts(sp); sp.set_defaults(fn=cmd_batch, name=None)
    sp = sub.add_parser("frames", help="pull stills from a reference video so Claude can match its look")
    sp.add_argument("video"); sp.add_argument("--count", type=int, default=8); sp.add_argument("--out")
    sp.set_defaults(fn=cmd_frames)

    a = p.parse_args(argv)
    return a.fn(a) or 0


if __name__ == "__main__":
    sys.exit(main())
