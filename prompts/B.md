[attach inputs/carriage.jpg]
Using this image as the only reference, build a single-file HTML page using Three.js (import from https://cdn.jsdelivr.net/npm/three@0.170.0/ via importmap; addons from examples/jsm allowed). No other libraries, no external model files — all geometry must be procedural.

Requirements:
1. A 3D carriage whose proportions and silhouette clearly follow the reference image: body, roof, four spoked wheels, driver's seat, two side lamps.
2. Both doors open and close on click; windows are translucent.
3. The two lamps flicker like oil flames and cast light on the body.
4. The carriage rolls forward on a cobbled road; wheels rotate correctly for the speed.
5. The body is on a suspension: it rocks and bounces in reaction to bumps in the road (bumps must be visible geometry, not random noise).
6. Night scene with fog; OrbitControls; key R resets the carriage to the start.
Output the complete HTML in one block. It must run with zero console errors.
