# RESULTS

Machine columns come from `tools/sweep.sh` → `RESULTS.csv` (re-run it after adding `runs/<surface>/<task>/index.html`). The human columns are blank on purpose: fill them after looking at the files and screenshots.

Model for the Claude Code column: `claude-fable-5-1` (confirmed from session metadata, configured and last-served). Token figures for Claude Code are **estimates** (the harness exposes no `/cost`): the session's budget counter delta per task, split into in/out by counting characters written ÷ 3.5. Treat them as ±30%.

## Claude Code column (2026-10-24, one session, tasks run strictly in order A → B → C)

| task | agent iterations (N) | human turns | wall min | tokens in (est) | tokens out (est) | lines | KB | console errors (judge) | checklist self-judged | checklist human (n/6) | subjective 1–5 (human) | failure mode (one line) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A seaplane | 6 | 0 | 18 | 51k | 14k | 581 | 23.2 | 0 | 6/6 | | | visual only: blocky reflections → invisible wake/shadow → Sky addon too pale at 12° sun, replaced by own sky shader |
| B carriage | 4 | 0 | 13 | 24k | 10k | 518 | 24.3 | 0 | 6/6 | | | night scene unreadably dark at first; door-hinge sign bug caught before first run |
| C marble run | 5 | 0 | 19 | 39k | 13k | 565 | 26.9 | 0 | 6/6 | | | 4 physics-flow bugs invisible to the judge (friction units, spiral unwrap, exit gap/slope, low rails) |
| **total** | **15** | 0 | **50** | **~114k** | **~37k** | | | 0 | | | | |

Checklist per task (for the human columns):
- A: ① water moves ② reflections ③ plane shadow on water ④ full take-off/landing loop ⑤ wake only on the water ⑥ Space pauses
- B: ① silhouette follows the reference ② doors click open/closed ③ lamps flicker and light the body ④ wheel speed matches travel ⑤ suspension reacts to the visible ridges ⑥ R resets
- C: ① all three mechanisms work ② no tunnelling ③ 20-marble cap ④ tray pile doesn't explode ⑤ shadows ⑥ R clears + counter correct

Notes that affect the human judgement:
- `check.mjs` runs headless SwiftShader at ~5 fps. The t8s.png screenshots therefore show only ~3–4 s of simulated time (A: still taxiing; B: barely moved; C: empty track because nothing presses the button). Judge the loop/physics in a real browser or with the probe scripts described in each `iterations.md`.
- A uses the Water addon (scaffold) but **not** the Sky addon in its final form — see FAILURE-MODES.md; that matters for H3.
- B's reference image was looked at once, before writing; no iteration went back to it.

## Other surfaces

| surface | model | task | turns | wall min | tokens in | tokens out | lines | KB | console errors | checklist (n/6) | subjective | truncated? | failure mode |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| gemini-app | | A | | | | | | | | | | | |
| gemini-app | | B | | | | | | | | | | | |
| gemini-app | | C | | | | | | | | | | | |
| claude-web | | A | | | | | | | | | | | |
| claude-web | | B | | | | | | | | | | | |
| claude-web | | C | | | | | | | | | | | |
| argon-api | | A | 1 | | | | | | | | | n/a | |
| argon-api | | B | 1 | | | | | | | | | n/a | |
| argon-api | | C | 1 | | | | | | | | | n/a | |

Drop each run into `runs/<surface>/<task>/index.html` (+ `cost.json` with the fields from HANDOFF §1.4) and re-run `tools/sweep.sh`; the machine columns above will then be in `RESULTS.csv`.
