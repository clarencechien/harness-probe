# harness-probe

Same three single-file Three.js tasks, same prompts, run on different surfaces (chat UI / agent harness / bare API) to measure where each one breaks. Protocol and task texts: `HANDOFF-harness-probe.md`.

- `prompts/` — the three prompts, verbatim; `inputs/` — the CC0 reference image for Task B and its source.
- `tools/check.mjs` — the judge: headless Chromium opens an `index.html`, collects console errors for 8 s, screenshots at 0/3/8 s. `tools/sweep.sh` runs it over `runs/**/index.html` and writes `RESULTS.csv`.
- `runs/claude-code/{A,B,C}/` — final `index.html`, `iterations.md` (every iteration), `cost.json`, screenshots. `runs/claude-code/FAILURE-MODES.md` — where each iteration got stuck.
- `RESULTS.md` — table with the human-judged columns left blank; other surfaces go in `runs/<surface>/<task>/`.

Run the judge on one file: `node tools/check.mjs runs/claude-code/A/index.html`
