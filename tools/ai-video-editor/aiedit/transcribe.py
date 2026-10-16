"""Word-level transcripts: run faster-whisper locally, or import one you already have."""
from __future__ import annotations

import json
import re
import tempfile
from pathlib import Path

from .cuts import Word


def save_words(words, path, language=None):
    Path(path).write_text(
        json.dumps(
            {"language": language, "words": [{"text": w.text, "start": w.start, "end": w.end} for w in words]},
            indent=1,
        ),
        encoding="utf-8",
    )


def load_words(path):
    p = Path(path)
    text = p.read_text(encoding="utf-8-sig")
    if p.suffix.lower() == ".json":
        data = json.loads(text)
        raw = data["words"] if isinstance(data, dict) else data
        return [Word(w["text"], float(w["start"]), float(w["end"])) for w in raw]
    return _from_subtitles(text)


_TS = re.compile(r"(\d+):(\d+):(\d+)[.,](\d+)\s*-->\s*(\d+):(\d+):(\d+)[.,](\d+)")


def _sec(h, m, s, f):
    return int(h) * 3600 + int(m) * 60 + int(s) + int(f.ljust(3, "0")[:3]) / 1000


def _from_subtitles(text):
    """SRT or VTT. Cue text is spread across the cue evenly, word by word."""
    words = []
    for block in re.split(r"\n\s*\n", text.replace("\r", "")):
        lines = [l for l in block.split("\n") if l.strip()]
        for i, line in enumerate(lines):
            m = _TS.search(line)
            if not m:
                continue
            a = _sec(*m.group(1, 2, 3, 4))
            b = _sec(*m.group(5, 6, 7, 8))
            toks = " ".join(lines[i + 1:]).split()
            if not toks:
                break
            step = (b - a) / len(toks)
            for k, tok in enumerate(toks):
                words.append(Word(tok, a + k * step, a + (k + 1) * step))
            break
    if not words:
        raise SystemExit("Could not read any timed words from that transcript file.")
    return words


def transcribe(video, model="small", language=None):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise SystemExit(
            "faster-whisper is not installed. Run:  pip install faster-whisper\n"
            "Or pass --transcript with an .srt/.vtt/.json you already have."
        )
    from .media import extract_audio

    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "audio.wav"
        extract_audio(video, wav)
        m = WhisperModel(model, device="auto", compute_type="int8")
        segments, info = m.transcribe(
            str(wav), word_timestamps=True, language=language, vad_filter=False,
            condition_on_previous_text=False,
        )
        words = []
        for seg in segments:
            for w in seg.words or []:
                words.append(Word(w.word.strip(), float(w.start), float(w.end)))
    return words, info.language
