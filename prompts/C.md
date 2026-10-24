Build a single-file HTML page using Three.js (import from https://cdn.jsdelivr.net/npm/three@0.170.0/ via importmap; addons from examples/jsm allowed). No other libraries, no physics engine, no external model files — all geometry procedural and all physics hand-written.

Scene: a tabletop marble run.
Requirements:
1. A track with at least three distinct mechanisms in sequence: a funnel/vortex, a seesaw that tips when a marble lands on it, and a spiral ramp.
2. Marbles are rigid spheres with gravity, rolling, and collision against the track and against each other (no tunnelling at 60 fps).
3. Click a button to release a new marble at the top; up to 20 marbles active at once.
4. Marbles that reach the bottom land in a tray and stack plausibly.
5. Studio lighting with soft shadows; the track casts shadows on the table.
6. OrbitControls; key R clears all marbles; an on-screen counter shows marbles in play.
Output the complete HTML in one block. It must run with zero console errors.
