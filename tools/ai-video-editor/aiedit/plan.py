"""The edit plan: a small JSON file between "analyse" and "build".

Claude (or you) can open it and change the hook, the cuts or the emphasis words
before the CapCut draft is written. That is the whole "AI editor" loop.
"""
from __future__ import annotations

import json
from pathlib import Path

from .captions import auto_hook, build_captions
from .cuts import Timeline, keep_ranges, mark_keep


def make_plan(info, words, template_name, template, hook=None, emphasis=(), cut_opts=None, broll=()):
    o = {"restart_gap": 0.7, "max_gap": 0.4, "pad": 0.07, "drop_restarts": True, "drop_fillers": True}
    o.update(cut_opts or {})
    keep = mark_keep(words, o["restart_gap"], o["drop_restarts"], o["drop_fillers"])
    ranges = keep_ranges(words, keep, info.duration, o["pad"], o["max_gap"])
    tl = Timeline(ranges)
    caps = build_captions(words, keep, tl, template["caption"]["words"], extra_emphasis=emphasis)
    hook_text = hook if hook is not None else auto_hook(words, keep)
    return {
        "version": 1,
        "name": Path(info.path).stem,
        "template": template_name,
        "source": {"path": info.path, "duration": info.duration, "width": info.width, "height": info.height,
                   "has_audio": info.has_audio},
        "hook": {"text": hook_text, "auto": hook is None},
        "keep": [[round(s, 3), round(e, 3)] for s, e in ranges],
        "captions": caps,
        "broll": [dict(path=b.path, duration=b.duration, width=b.width, height=b.height, has_audio=b.has_audio) for b in broll],
        "stats": {
            "raw_seconds": round(info.duration, 2),
            "edited_seconds": round(tl.total, 2),
            "words_total": len(words),
            "words_dropped": sum(1 for k in keep if not k),
            "cuts": len(ranges),
        },
    }


def save_plan(plan, path):
    Path(path).write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")


def load_plan(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))
