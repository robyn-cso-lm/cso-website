"""Probe media files with ffprobe."""
from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

VIDEO_EXT = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}


@dataclass
class MediaInfo:
    path: str
    duration: float
    width: int
    height: int
    has_audio: bool


def have_ffmpeg():
    return bool(shutil.which("ffmpeg") and shutil.which("ffprobe"))


def probe(path) -> MediaInfo:
    path = str(Path(path).resolve())
    if not shutil.which("ffprobe"):
        raise SystemExit("ffprobe not found. Run `python editor.py doctor` for install steps.")
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path],
        capture_output=True, text=True, check=True,
    ).stdout
    data = json.loads(out)
    vs = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
    if vs is None:
        raise SystemExit(f"No video stream in {path}")
    w, h = int(vs["width"]), int(vs["height"])
    rot = 0
    for sd in vs.get("side_data_list", []):
        if "rotation" in sd:
            rot = abs(int(sd["rotation"])) % 180
    if str(vs.get("tags", {}).get("rotate", "0")) in ("90", "270"):
        rot = 90
    if rot == 90:
        w, h = h, w
    dur = float(data["format"].get("duration") or vs.get("duration") or 0)
    has_audio = any(s["codec_type"] == "audio" for s in data["streams"])
    return MediaInfo(path, dur, w, h, has_audio)


def extract_audio(video, wav_path):
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(wav_path)],
        check=True,
    )


def extract_frames(video, out_dir, count=8):
    info = probe(video)
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for i in range(count):
        t = info.duration * (i + 0.5) / count
        p = out_dir / f"frame_{i + 1:02d}.jpg"
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1", "-q:v", "3", str(p)],
            check=True,
        )
        paths.append(str(p))
    return paths
