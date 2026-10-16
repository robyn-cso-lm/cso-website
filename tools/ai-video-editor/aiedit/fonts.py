"""Find font files on Mac and Windows so CapCut draws the right typeface."""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path


def font_dirs():
    if sys.platform == "win32":
        dirs = [Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"]
        local = os.environ.get("LOCALAPPDATA")
        if local:
            dirs.append(Path(local) / "Microsoft/Windows/Fonts")
    elif sys.platform == "darwin":
        dirs = [
            Path("/System/Library/Fonts"),
            Path("/System/Library/Fonts/Supplemental"),
            Path("/Library/Fonts"),
            Path.home() / "Library/Fonts",
        ]
    else:
        dirs = [Path("/usr/share/fonts"), Path.home() / ".fonts"]
    return [d for d in dirs if d.exists()]


def _key(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


_INDEX = None


def _index():
    global _INDEX
    if _INDEX is None:
        _INDEX = {}
        for d in font_dirs():
            for p in d.rglob("*"):
                if p.suffix.lower() in (".ttf", ".otf", ".ttc"):
                    _INDEX.setdefault(_key(p.stem), str(p))
    return _INDEX


def resolve(candidates):
    """candidates: a path, a font name, or a list of either. Returns a path or ''."""
    if isinstance(candidates, str):
        candidates = [candidates]
    idx = _index()
    for c in candidates or []:
        if not c:
            continue
        if os.path.isfile(c):
            return str(Path(c).resolve()).replace("\\", "/")
        k = _key(c)
        if k in idx:
            return idx[k].replace("\\", "/")
        for name, path in idx.items():
            if k and name.startswith(k):
                return path.replace("\\", "/")
    return ""
