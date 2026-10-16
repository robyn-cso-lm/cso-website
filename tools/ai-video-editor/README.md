# AI Video Editor for CapCut

Record one take. Hand it over. Get back an editable CapCut draft.

It removes the pauses, fillers and false starts, times your captions, adds a hook, and writes a real CapCut project you can open and change. Nothing is locked: every clip, caption and font is its own layer.

Runs on your computer (Windows or Mac). Claude Code is the editor; this folder is its toolbox.

## What it does

| Step | Who | What |
|---|---|---|
| 1 | You | Record. Ums, pauses, restarts and all. |
| 2 | Tool | Transcribes locally with word timings (faster-whisper). Nothing is uploaded. |
| 3 | Tool | Drops filler words and stutters, cuts dead air, and when you restart a sentence it keeps the **last** take. |
| 4 | Claude | Rewrites the hook, checks the highlighted words, fixes mis-hearings in `plan.json`. |
| 5 | Tool | Writes the CapCut draft: cuts, captions, hook, optional B-roll track. |
| 6 | You | Open CapCut, change anything, export. |

## Setup (one sitting)

You need: **CapCut desktop** (free plan is fine), **Python 3.10 to 3.13**, **ffmpeg**, and **Claude Code**.

```bash
# Windows
winget install Gyan.FFmpeg
# Mac
brew install ffmpeg
```

```bash
cd tools/ai-video-editor
pip install -r requirements.txt
python editor.py doctor
```

Open CapCut once so it creates its drafts folder. `doctor` tells you what is still missing.

Python 3.14 is too new for the transcription library right now. If `pip install` fails on it, use 3.12 or 3.13, or skip transcribing and pass `--transcript` with an `.srt`, `.vtt` or `.json` (CapCut's own auto-captions export works).

## Use it

The easy way: open Claude Code in this folder and say **"edit C:\Videos\monday.mp4 with the soft template"**. It follows [EDITOR.md](EDITOR.md).

Or by hand:

```bash
python editor.py templates
python editor.py edit "monday.mp4" --template soft --hook "3 mistakes cost me $10,000"
```

Close CapCut before building so the draft registers in its project list. Then open CapCut and find the project named after your video.

### Your brand, once

```bash
python editor.py brand --caption-font "C:/Fonts/Poppins-Bold.ttf" --hook-font "C:/Fonts/Caveat.ttf" --color "#FFFFFF" --highlight "#F5B700"
```

### A week at once

```bash
python editor.py batch "C:\Videos\this-week" --template punch
```

### B-roll and voiceovers

```bash
python editor.py edit "talking.mp4" --broll "C:\Videos\b-roll"
```

### Match a creator you like

```bash
python editor.py frames "their-video.mp4"
```

Then ask Claude to build a custom template from the stills (see EDITOR.md). It saves to `templates/custom/` and works with `--template`.

## Templates

| Name | Look | Best for |
|---|---|---|
| `punch` | Tall caps, yellow highlights, black outline | Fitness, myth-busting, hard truths |
| `pop` | Bubbly pink and yellow, dark outline | Shops, products, crafts |
| `soft` | White italic serif, soft pink highlight | Skincare, beauty, wellness |
| `butter` | Butter-yellow script | Recipes, cosy stories |
| `editorial` | Cream serif, calm | Travel, explainers |
| `luxe` | Spaced caps, cream and gold | Interiors, real estate, premium |
| `clean` | Sans-serif on a colour box | Careers, finance, how-to |

Fonts are system fonts (Impact, Arial, Georgia and friends) so they exist on every Mac and PC. If one is missing, CapCut falls back to its default. Your own fonts via `brand` always win.

## Tuning the cuts

| Flag | Default | Meaning |
|---|---|---|
| `--max-gap` | 0.4 | Longest pause kept, in seconds. Lower is snappier. |
| `--restart-gap` | 0.7 | A pause this long followed by the same opening words counts as a restart. |
| `--keep-restarts` | off | Keep earlier takes. |

## Honest limits

- The CapCut draft format is not documented by CapCut. This writer copies the structure from a real CapCut 8.5 draft (schema 167), and a future CapCut update could change it. Drafts are always written as new projects, never over yours.
- The "pop" is scale keyframes, not CapCut's animation library. No sound effects or stickers.
- Cuts are hard jump cuts.
- The first draft you build on a new machine, open it and check it before batching a week.

## Tests

```bash
python -m unittest discover -s tests
```

Runs without ffmpeg or whisper.
