Build a single-file HTML page using Three.js (import from https://cdn.jsdelivr.net/npm/three@0.170.0/ via importmap; you may use addons from examples/jsm). No other libraries, no external model files — all geometry must be procedural.

Scene: a seaplane taxiing and taking off from a lake at golden hour.
Requirements:
1. Animated water surface with reflections and visible wave motion.
2. Sky with a sun; lighting should be warm, with the plane casting a shadow on the water.
3. The seaplane is built from primitives: fuselage, wings, tail, two floats, a spinning propeller.
4. Takeoff sequence loops: taxi (floats create a wake / spray), accelerate, lift off, climb, bank in a wide circle, descend and land again. The wake must stop when airborne.
5. Propeller speed, pitch of the plane and camera all respond to the flight phase.
6. OrbitControls plus a key (Space) to pause/resume the sequence.
Output the complete HTML in one block. It must run with zero console errors.
