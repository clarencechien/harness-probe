# Post-hoc comparison: Claude Code runs vs. the Google blog demos

**Read this first.** HANDOFF §1.1 forbids looking at the five builders' work *while running the experiment*, to avoid copying. All three Claude Code runs were committed and frozen (commit `c9a33e9`, 11:26 UTC) before anything below was fetched (11:37 UTC). Nothing here fed back into the runs. The Google material is the blog post's own embedded MP4s (`Sea_Plane_1.mp4`, 67 s; `Carriage_Ev1Y6Sv.mp4`, 50 s); frames were extracted every 3–4 s with ffmpeg. Source: [See what 5 builders are making with Gemini 4 Argon](https://blog.google/products-and-platforms/products/gemini/gemini-4-argon-builders/).

Files: `side-by-side.png` (the summary image), `google/*` (frames + contact sheets + the carriage spec panel crop), `claude-code/*` (screenshots of the live Pages site taken with headless Chromium).

## What the blog actually tells us (the column the experiment set out to fill)

| | seaplane (Lumina) | carriage (The Bugged Dev) |
|---|---|---|
| surface used | not stated | not stated |
| iterations / time / tokens | not stated | not stated |
| input | not stated | "a single image of a Gothic Victorian carriage" |
| single file? Three.js? external assets? | not stated | not stated |
| blog's description | "realistic lighting, reflections, and water movement … coordinate the motions of different elements simultaneously" | "functioning doors and windows, flickering oil lamps, and an undercarriage that responds to bumps in the road" |

So the blog gives zero of the fields in HANDOFF §1.4. The videos add some evidence, listed below.

## What the videos show

**Seaplane (Google).** A detailed DHC-3-style Beaver/Otter (riveted panels, cabin glazing, radial cowl, float struts, livery decals) on a wide sea with mountains on the horizon. In the sampled 67 s the plane is always on the water: HUD reads 27 kt / "6 kt · Idle Taxi"; no lift-off, climb, or bank is visible. Product-grade UI: seven named camera presets (Hero/Bow/Aerial/Profile/Cockpit/Wake/Wingtip), a "Flight Deck" panel with livery, throttle slider, sea-state slider, four time-of-day presets (Golden/Fjord/Nordic/Twilight), lighting toggles, Pause Motion / Auto Director / Reset View. Wake and spray are the strongest effect. Shadow on the water is visible in the aerial shot.

**Carriage (Google).** A "Gothic Victorian carriage" rendered as a museum-catalogue page: sepia layout, title block, numbered callouts, technical elevation drawings, a colour-swatch "Bespoke finish" panel, view modes (Iso/Side/Front/Rear), buttons for Open Door / Open Window / Rotate / Wireframe / Coach Lanterns / Exploded View, "Drive on road: active". The model is a gypsy-wagon silhouette with ornate finials, carved medallions, arched glazing, brass lamps, purple spoked wheels. The on-screen spec panel says **"POLYGONS 1,284,560 · TEXTURES 4K PBR"**. If that number is real, the model is an imported asset, not procedural geometry; if it is decorative text the model wrote, it is still a claim the page makes about itself. Either way it is not comparable to a primitives-only build. A wireframe frame in the video (contact sheet, row 2) shows dense mesh consistent with an imported model.

**Claude Code runs.** All geometry from Three.js primitives as the protocol requires: the seaplane is capsules/boxes/cones, the carriage is boxes/cylinders/tori, materials are flat PBR constants, no textures beyond a 256² procedural normal map and two canvas sprites. UI is a one-line HUD. The full flight loop (taxi → lift-off → climb → bank → descend → land) runs and is shown in `claude-code/A-climb.jpg` / `A-late.jpg`; the Google video never shows the plane airborne.

## Where the gap is, concretely

| dimension | Google demos | Claude Code runs | note |
|---|---|---|---|
| model fidelity | film-prop level (riveted aircraft, carved wagon) | primitive assemblies, recognisable silhouette | **protocol forbids external models for us; unknown for them.** The carriage's own panel claims 1.28 M polygons / 4K PBR. |
| environment art | mountains, haze, sea with multiple wave scales, colour-graded | flat lake to the horizon, gradient sky, one sun | 2–3 iterations of ours went here; still far behind |
| UI / product polish | full "flight deck" / catalogue page, presets, swatches | one HUD line + one button | not in the prompt for either; they added it, we did not |
| required behaviours | seaplane: never leaves the water in the video; carriage: doors/lamps/bumps claimed by the blog, doors visible in video | A: full loop verified; B: doors/lamps/suspension verified by probe | our checklist is stricter than what the video demonstrates |
| process data | none published | 15 iterations, 50 min, ~150k tokens, 0 console errors, all logged | this is the column the experiment adds |

## What this does and does not say about H1–H4

- It says nothing about H1/H2 (chat vs harness) because the blog does not say which surface produced either demo, nor how many rounds. The Gemini-app and Claude-web columns still have to be run by hand.
- For H3 it is suggestive: both Google demos lean on assets (or at least present themselves as asset-based); the protocol's "procedural only" rule makes our column visually poorer by construction, independent of model or surface. If the report compares pictures, say this.
- For H4 (image input): the Google carriage follows a *gothic* reference and ours a plain brougham; silhouettes both track their inputs. Fidelity gap is asset-driven, not input-driven.

## Caveats
- Our screenshots are headless SwiftShader at ~5 fps; a real GPU shows the same geometry with smoother spray/wake density.
- Google frames are from a captured video, likely on a real GPU at 60 fps, possibly colour-graded in post.
- I did not read any of the builders' code and the blog links only to their X profiles; nothing here is from their source.
