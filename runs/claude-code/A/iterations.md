# Task A · seaplane — Claude Code iterations

Start: 2026-10-24T10:32:51Z (60-minute wall-clock budget → hard stop 11:32:51Z)
Input: prompts/A.md verbatim. Judge: `node tools/check.mjs runs/claude-code/A/index.html`.

| iter | time (UTC) | what changed | ran? | console errors | screenshots | notes |
|---|---|---|---|---|---|---|
| 1 | 10:36 | First full write: Water+Sky addons, procedural DataTexture normal map, ShadowMaterial shadow-catcher over the water, oval path state machine (taxi→accelerate→lift-off→climb→cruise→descend→landing), spray Points, additive foam ribbons, phase-driven prop/pitch/camera, Space pause | yes | 0 | t0/t3s/t8s | Runs first try. Visual problems from screenshots: reflections blocky (DataTexture default NearestFilter), sky pale grey not golden (sun behind camera, exposure), wake ribbon reads as a pale blob (additive white on white water), spray too small to see, plane shadow a huge dark wedge toward camera (opacity 0.55 at 9° sun). |
