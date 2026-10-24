# Claude Code column — where each iteration got stuck

Fifteen iterations across three tasks, zero console errors in any of them. Not one iteration was spent on "does it run". Every iteration was spent on something the chat-style judge (console + three early screenshots) could not see. That is the main finding for the report.

## Three classes of stuck

### 1. "It runs and it's wrong in a way you can only see" (Task A, all 5 fix iterations)
- **Blocky reflections.** A procedurally generated `DataTexture` normal map defaults to `NearestFilter`; the water reflection came out as 8-bit mosaic. One line, but only a screenshot shows it.
- **Invisible wake and spray.** Additive white foam on a white-reflecting lake is invisible; untextured `Points` render as big squares; a foam ribbon placed at y=0.2 was submerged by the ±0.5 m vertex waves and read as two wires. Three iterations of "the feature exists in the code but not in the picture".
- **Invisible shadow.** At 6–9° sun elevation the plane's shadow is stretched ~10× and falls 40 m behind the plane; opacity 0.3 on bright water made it unreadable. Proved the shadow pipeline worked with a scratch copy at 35° elevation, then raised the sun to 12°.
- **Scaffold that fights the brief (H3).** The `Sky` addon's physical model is pale grey at any sun elevation high enough for the shadow to read. A three-variant parameter sweep (turbidity/rayleigh/mie/exposure) could not get "golden". Replaced with a 30-line gradient dome shader in iteration 5. So Task A used the Water scaffold to the end and abandoned the Sky scaffold half-way; the scaffold helped with the hard part (planar reflection) and hurt the art-direction part.

### 2. "It runs and the number is wrong" (Task C, all 4 fix iterations, plus B's suspension check)
- **Units bug.** Tangential friction applied per 240 Hz substep instead of per second → 480 %/s damping → marbles crawled at 0.10 m/s. Found only by printing positions over time.
- **Wrong branch.** Spiral angle unwrapping initialised while the marble was still on the chute (3 m away) latched onto turn 2; marbles arriving at the top fell straight through to the lower turn. The render looked fine.
- **Geometry a few centimetres off.** Exit gap in the outer wall started 0.9 rad too early; the exit chute rose 1 cm toward the tray so arrivals rolled back out; rails 10 cm high lost marbles that leave the funnel hole with vortex velocity. Each fix was one or two constants, each needed a 60–100 s simulated run to confirm.
- **B's suspension** could not be judged from stills either; I had to add a heave/pitch readout to the HUD and run a copy that starts just before the first ridge.

### 3. "The judge is slower than the thing it judges" (all tasks)
Headless SwiftShader renders these scenes at 2–14 fps, so eight real seconds are three or four simulated seconds. The judge's own screenshots show A still taxiing, B barely moving, C empty. Every meaningful check needed a second script: time-series of the HUD, clicks on a grid until a door toggled, a fast-stepping copy that exposes the marble array. The scaffold cost of those probes (≈ 250 lines of Playwright across the session) is real and is part of what "agent harness" buys.

## What was never a problem
- Imports, CDN, importmap, addon paths: correct on every first write.
- The "Output the complete HTML in one block" constraint: no truncation at 520–580 lines / 23–27 KB.
- Logic bugs caught by reading, not running: one (B's door-hinge sign) — fixed with `sed` before the first run.

## Counts for the report's first paragraph
| | A | B | C | total |
|---|---|---|---|---|
| iterations (N) | 6 | 4 | 5 | 15 |
| human turns | 0 | 0 | 0 | 0 |
| wall-clock min | 18 | 13 | 19 | 50 |
| tokens (est. in+out) | 65k | 34k | 52k | ~150k |
| iterations with a console error | 0 | 0 | 0 | 0 |
| iterations that needed a probe beyond check.mjs | 5 | 3 | 4 | 12 |
