"""Turn kept words into timed caption chunks with emphasis words marked."""
from __future__ import annotations

import re

from .cuts import Timeline, norm

STOP = set(
    "the a an and or but so to of in on at for with from that this these those is are was were be been "
    "it its i you he she we they me my your our their just really very about because like what when how "
    "have has had do does did not no yes can will would could should there here then than as if".split()
)

SENTENCE_END = re.compile(r"[.!?]$")
CLAUSE_END = re.compile(r"[,;:]$")


def build_captions(words, keep, timeline: Timeline, words_per_caption=3, max_chars=22, extra_emphasis=()):
    extra = {norm(w) for w in extra_emphasis}
    items = []
    for w, k in zip(words, keep):
        if not k:
            continue
        s = timeline.map(w.start)
        e = timeline.map(w.end)
        if s is None or e is None:
            continue
        items.append({"text": w.text.strip(), "start": s, "end": max(e, s + 0.05)})

    groups, cur = [], []
    for it in items:
        if cur:
            gap = it["start"] - cur[-1]["end"]
            chars = sum(len(x["text"]) + 1 for x in cur) + len(it["text"])
            if (
                len(cur) >= words_per_caption
                or chars > max_chars
                or gap > 0.45
                or SENTENCE_END.search(cur[-1]["text"])
                or (CLAUSE_END.search(cur[-1]["text"]) and len(cur) >= 2)
            ):
                groups.append(cur)
                cur = []
        cur.append(it)
    if cur:
        groups.append(cur)

    captions = []
    for gi, g in enumerate(groups):
        start = g[0]["start"]
        end = g[-1]["end"]
        nxt = groups[gi + 1][0]["start"] if gi + 1 < len(groups) else None
        if nxt is not None:
            end = min(max(end, start + 0.25), nxt)  # never overlap the next caption
            if nxt - end < 0.25:
                end = nxt  # hold on screen through tiny gaps instead of flickering
        emph = _pick_emphasis(g, extra)
        captions.append(
            {
                "start": round(start, 3),
                "end": round(end, 3),
                "words": [{"text": x["text"], "emph": i in emph} for i, x in enumerate(g)],
            }
        )
    return captions


def _pick_emphasis(group, extra):
    picks = set()
    for i, it in enumerate(group):
        t = norm(it["text"])
        if not t:
            continue
        if t in extra or any(ch.isdigit() for ch in it["text"]) or "$" in it["text"]:
            picks.add(i)
    if picks:
        return picks
    best, best_len = None, 0
    for i, it in enumerate(group):
        t = norm(it["text"])
        if t and t not in STOP and len(t) >= 6 and len(t) > best_len:
            best, best_len = i, len(t)
    return {best} if best is not None else set()


def auto_hook(words, keep, max_words=8):
    """First kept sentence, trimmed. A placeholder for Claude to rewrite."""
    out = []
    for w, k in zip(words, keep):
        if not k:
            continue
        out.append(w.text.strip())
        if SENTENCE_END.search(out[-1]) or len(out) >= max_words:
            break
    text = " ".join(out).strip(" ,;:")
    return re.sub(r"[.!]+$", "", text)
