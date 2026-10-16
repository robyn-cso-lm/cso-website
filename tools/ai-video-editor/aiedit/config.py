"""Templates, branding and where CapCut keeps its drafts."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_DIRS = [ROOT / "templates" / "custom", ROOT / "templates"]
BRAND_FILE = Path.home() / ".claude-capcut-editor" / "brand.json"


def list_templates():
    seen = {}
    for d in TEMPLATE_DIRS:
        if d.exists():
            for p in sorted(d.glob("*.json")):
                seen.setdefault(p.stem, p)
    return seen


def load_template(name):
    found = list_templates()
    if name not in found:
        raise SystemExit(f"Unknown template '{name}'. Available: {', '.join(found)}")
    return json.loads(found[name].read_text(encoding="utf-8"))


def load_brand():
    if BRAND_FILE.exists():
        return json.loads(BRAND_FILE.read_text(encoding="utf-8"))
    return {}


def save_brand(brand):
    BRAND_FILE.parent.mkdir(parents=True, exist_ok=True)
    BRAND_FILE.write_text(json.dumps(brand, indent=2), encoding="utf-8")


def apply_brand(template, brand):
    """Your fonts and colours win over the template's. Load them once, every video uses them."""
    t = json.loads(json.dumps(template))
    for part, fkey in (("caption", "caption_font"), ("hook", "hook_font")):
        if brand.get(fkey):
            t[part]["font"] = [brand[fkey]]
        if brand.get("color"):
            t[part]["color"] = brand["color"]
        if brand.get("highlight"):
            t[part]["highlight"] = brand["highlight"]
        if brand.get("stroke"):
            t[part]["stroke"] = brand["stroke"]
    return t


def capcut_drafts_dir():
    if sys.platform == "win32":
        base = os.environ.get("LOCALAPPDATA", "")
        return Path(base) / "CapCut/User Data/Projects/com.lveditor.draft"
    return Path.home() / "Movies/CapCut/User Data/Projects/com.lveditor.draft"
