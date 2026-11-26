"""Decide which words and which stretches of the raw take to keep.

Input is a list of words with timings. Output is a list of (start, end) source
ranges that get laid end to end on the CapCut timeline.

Rules, in order:
1. Drop filler words (um, uh, er ...).
2. Drop an immediate stutter ("the the").
3. Drop an earlier take when the speaker restarts the same sentence after a
   pause, so the LAST take wins.
4. Merge what is left into ranges, cutting any pause longer than max_gap.
"""
from __future__ import annotations

import re
from bisect import bisect_right
from dataclasses import dataclass

FILLERS = {"um", "uh", "umm", "uhh", "er", "erm", "ah", "hmm", "mm", "mmm", "uhm", "eh"}


@dataclass
class Word:
    text: str
    start: float
    end: float


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9']", "", text.lower())


def clamp_words(words, base=0.35, per_char=0.09):
    """Whisper often stretches a word across the silence after it, which hides pauses
    inside words and makes captions linger. Trim each word to a believable length."""
    out = []
    for w in words:
        limit = base + per_char * len(norm(w.text))
        out.append(Word(w.text, w.start, min(w.end, w.start + limit)))
    return out


def mark_keep(words, restart_gap=0.7, drop_restarts=True, drop_fillers=True):
    """Return a list of booleans, one per word: True means keep."""
    n = len(words)
    keep = [True] * n

    if drop_fillers:
        for i, w in enumerate(words):
            if norm(w.text) in FILLERS:
                keep[i] = False

    # stutter: same word twice in a row, close together
    prev = None
    for i, w in enumerate(words):
        if not keep[i]:
            continue
        if prev is not None:
            a, b = words[prev], w
            if norm(a.text) and norm(a.text) == norm(b.text) and b.start - a.end < 0.5:
                keep[prev] = False
        prev = i

    if drop_restarts:
        chunks = []
        cur = []
        last_end = None
        for i, w in enumerate(words):
            if not keep[i]:
                continue
            if last_end is not None and w.start - last_end > restart_gap and cur:
                chunks.append(cur)
                cur = []
            cur.append(i)
            last_end = w.end
        if cur:
            chunks.append(cur)

        def toks(chunk):
            return [norm(words[i].text) for i in chunk if norm(words[i].text)]

        for ci in range(len(chunks) - 1):
            a = toks(chunks[ci])
            for cj in (ci + 1, ci + 2):
                if cj >= len(chunks):
                    break
                if _is_restart(a, toks(chunks[cj])):
                    for i in chunks[ci]:
                        keep[i] = False
                    break
    return keep


def _is_restart(a, b):
    if not a or not b:
        return False
    if len(a) <= 2:
        return a == b[: len(a)]
    k = min(3, len(a), len(b))
    return a[:k] == b[:k]


def keep_ranges(words, keep, duration, pad=0.07, max_gap=0.4, min_len=0.2):
    """Merge kept words into source ranges. A dropped word always forces a cut."""
    ranges = []
    last_idx = None
    n = len(words)
    for i, w in enumerate(words):
        if not keep[i]:
            continue
        s = max(0.0, w.start - pad)
        e = min(duration, w.end + pad)
        # never bleed into a dropped neighbour
        if i > 0 and not keep[i - 1]:
            s = max(s, words[i - 1].end)
        if i + 1 < n and not keep[i + 1]:
            e = min(e, words[i + 1].start)
        e = max(e, s)
        forced_cut = last_idx is not None and last_idx != i - 1
        if ranges and not forced_cut and s - ranges[-1][1] <= max_gap:
            ranges[-1][1] = max(ranges[-1][1], e)
        else:
            ranges.append([s, e])
        last_idx = i
    out = [(s, e) for s, e in ranges if e - s >= min_len]
    return out


class Timeline:
    """Maps source time to edited-timeline time."""

    def __init__(self, ranges):
        self.ranges = list(ranges)
        self.offsets = []
        total = 0.0
        for s, e in self.ranges:
            self.offsets.append(total)
            total += e - s
        self.total = total
        self._starts = [s for s, _ in self.ranges]

    def map(self, t):
        """Timeline time for a source time, or None if that moment was cut."""
        i = bisect_right(self._starts, t + 1e-6) - 1
        if i < 0:
            return None
        s, e = self.ranges[i]
        if t > e + 1e-6:
            return None
        return self.offsets[i] + min(max(t - s, 0.0), e - s)
