# Decoherence

Status: implemented
Legacy: legacy/decoherencia_cu_ntica_animaci_n_y_generador_gif.html (migrated)

## Goal

Show how interaction with the environment destroys a superposition: a 3D Bloch vector shrinks toward the center while a wave loses its interference fringes.

## Behavior

- Page: standard shell (see Technical decisions), then a 3D Bloch sphere panel and, beside it, the time-evolution plot and the controls.
- 3D Bloch sphere: translucent sphere, wireframe, equator ring, X/Y/Z axes, labels |0⟩ |1⟩ |+⟩, origin dot and a state arrow. The sphere turns slowly on its own. Dragging with the mouse or one finger orbits the camera (polar angle clamped); the hint "Drag with mouse to rotate camera" shows over it. Arrow keys also orbit it when the view has focus.
- Purity badge: "Pure State: N%" (green) above 70%, "Partial Superposition: N%" (amber) above 35%, otherwise "Statistical Mixture: N%" (rose), where N = vector length / 1.18.
- Readouts: |⟨X⟩| coherence, |⟨Y⟩| phase and ⟨Z⟩ population, each the vector component divided by 1.18, two decimals.
- Time evolution canvas (400x150): quantum wave, dashed pink envelope e^{-t/T₂}, "Fringe Visibility = N%", legend (Quantum Wave, Envelope, Classical).
- Cycle: 5 s. Decay = e^{-(t/5)·3.5·rate}; the vector precesses about Z at 4 rad/s and the cycle restarts after 5 s.
- Dephasing (T₂): the vector stays in the XY plane and shrinks to the center, with a tiny Z wobble. Relaxation (T₁): XY shrinks and Z rises toward |0⟩.
- Controls: noise mechanism (Dephasing active blue, Relaxation active pink; switching restarts the cycle), rate γ 0.2x-3.0x (step 0.1, default 1.2), Pause / Resume, Reset Cycle.
- Export GIF (540x540): 30 frames over one cycle at 10 fps, looping, each composed of the 3D view and the wave plot plus title, mechanism subtitle and "Coherence: N%". File name `quantum_decoherence.gif`. Playback pauses while exporting and resumes after a successful export.
- Footer: Phase Damping Model with ρ(t) as a KaTeX matrix.

## Technical decisions

- Decay, vector, purity tier and readouts are one pure function of time, mechanism and rate in the feature `lib/`, unit tested.
- Three.js comes from npm (legacy used r128 from a CDN). The scene lives behind a small component so everything else is testable without WebGL; jsdom has none.
- GIF frames capture the WebGL canvas, so the renderer keeps its drawing buffer.
- This page adopts the standard shell: header with the animated badge, back link, standard footer, page background, same width, shared `Card`. Panel contents and tints stay as in legacy.
- `ExportGifButton` gains the full-width gradient variant this page uses.
- The 3D scene code stays in this feature until the Bell simulator needs it (then it moves to `shared`).
- Fix over legacy: that page never loaded a math renderer, so `$T_2# Decoherence

Status: implemented
Legacy: legacy/decoherencia_cu_ntica_animaci_n_y_generador_gif.html (migrated)

## Goal

Show how interaction with the environment destroys a superposition: a 3D Bloch vector shrinks toward the center while a wave loses its interference fringes.

## Behavior

- Page: standard shell (see Technical decisions), then a 3D Bloch sphere panel and, beside it, the time-evolution plot and the controls.
- 3D Bloch sphere: translucent sphere, wireframe, equator ring, X/Y/Z axes, labels |0⟩ |1⟩ |+⟩, origin dot and a state arrow. The sphere turns slowly on its own. Dragging with the mouse or one finger orbits the camera (polar angle clamped); the hint "Drag with mouse to rotate camera" shows over it. Arrow keys also orbit it when the view has focus.
- Purity badge: "Pure State: N%" (green) above 70%, "Partial Superposition: N%" (amber) above 35%, otherwise "Statistical Mixture: N%" (rose), where N = vector length / 1.18.
- Readouts: |⟨X⟩| coherence, |⟨Y⟩| phase and ⟨Z⟩ population, each the vector component divided by 1.18, two decimals.
- Time evolution canvas (400x150): quantum wave, dashed pink envelope e^{-t/T₂}, "Fringe Visibility = N%", legend (Quantum Wave, Envelope, Classical).
- Cycle: 5 s. Decay = e^{-(t/5)·3.5·rate}; the vector precesses about Z at 4 rad/s and the cycle restarts after 5 s.
- Dephasing (T₂): the vector stays in the XY plane and shrinks to the center, with a tiny Z wobble. Relaxation (T₁): XY shrinks and Z rises toward |0⟩.
- Controls: noise mechanism (Dephasing active blue, Relaxation active pink; switching restarts the cycle), rate γ 0.2x-3.0x (step 0.1, default 1.2), Pause / Resume, Reset Cycle.
- Export GIF (540x540): 30 frames over one cycle at 10 fps, looping, each composed of the 3D view and the wave plot plus title, mechanism subtitle and "Coherence: N%". File name `quantum_decoherence.gif`. Playback pauses while exporting and resumes after a successful export.
- Footer: Phase Damping Model with ρ(t) as a KaTeX matrix.

## Technical decisions

- Decay, vector, purity tier and readouts are one pure function of time, mechanism and rate in the feature `lib/`, unit tested.
- Three.js comes from npm (legacy used r128 from a CDN). The scene lives behind a small component so everything else is testable without WebGL; jsdom has none.
- GIF frames capture the WebGL canvas, so the renderer keeps its drawing buffer.
- This page adopts the standard shell: header with the animated badge, back link, standard footer, page background, same width, shared `Card`. Panel contents and tints stay as in legacy.
- `ExportGifButton` gains the full-width gradient variant this page uses.
- The 3D scene code stays in this feature until the Bell simulator needs it (then it moves to `shared`).
  , `$gamma# Decoherence

Status: implemented
Legacy: legacy/decoherencia_cu_ntica_animaci_n_y_generador_gif.html (migrated)

## Goal

Show how interaction with the environment destroys a superposition: a 3D Bloch vector shrinks toward the center while a wave loses its interference fringes.

## Behavior

- Page: standard shell (see Technical decisions), then a 3D Bloch sphere panel and, beside it, the time-evolution plot and the controls.
- 3D Bloch sphere: translucent sphere, wireframe, equator ring, X/Y/Z axes, labels |0⟩ |1⟩ |+⟩, origin dot and a state arrow. The sphere turns slowly on its own. Dragging with the mouse or one finger orbits the camera (polar angle clamped); the hint "Drag with mouse to rotate camera" shows over it. Arrow keys also orbit it when the view has focus.
- Purity badge: "Pure State: N%" (green) above 70%, "Partial Superposition: N%" (amber) above 35%, otherwise "Statistical Mixture: N%" (rose), where N = vector length / 1.18.
- Readouts: |⟨X⟩| coherence, |⟨Y⟩| phase and ⟨Z⟩ population, each the vector component divided by 1.18, two decimals.
- Time evolution canvas (400x150): quantum wave, dashed pink envelope e^{-t/T₂}, "Fringe Visibility = N%", legend (Quantum Wave, Envelope, Classical).
- Cycle: 5 s. Decay = e^{-(t/5)·3.5·rate}; the vector precesses about Z at 4 rad/s and the cycle restarts after 5 s.
- Dephasing (T₂): the vector stays in the XY plane and shrinks to the center, with a tiny Z wobble. Relaxation (T₁): XY shrinks and Z rises toward |0⟩.
- Controls: noise mechanism (Dephasing active blue, Relaxation active pink; switching restarts the cycle), rate γ 0.2x-3.0x (step 0.1, default 1.2), Pause / Resume, Reset Cycle.
- Export GIF (540x540): 30 frames over one cycle at 10 fps, looping, each composed of the 3D view and the wave plot plus title, mechanism subtitle and "Coherence: N%". File name `quantum_decoherence.gif`. Playback pauses while exporting and resumes after a successful export.
- Footer: Phase Damping Model with ρ(t) as a KaTeX matrix.

## Technical decisions

- Decay, vector, purity tier and readouts are one pure function of time, mechanism and rate in the feature `lib/`, unit tested.
- Three.js comes from npm (legacy used r128 from a CDN). The scene lives behind a small component so everything else is testable without WebGL; jsdom has none.
- GIF frames capture the WebGL canvas, so the renderer keeps its drawing buffer.
- This page adopts the standard shell: header with the animated badge, back link, standard footer, page background, same width, shared `Card`. Panel contents and tints stay as in legacy.
- `ExportGifButton` gains the full-width gradient variant this page uses.
- The 3D scene code stays in this feature until the Bell simulator needs it (then it moves to `shared`).
  and the footer matrix showed as raw TeX; they now render with KaTeX.
- If WebGL is unavailable the 3D box explains it instead of staying blank; everything else keeps working.
- Pointer events (mouse, pen, touch) drive the camera; the view is focusable with an accessible name and arrow keys.
- Playback starts paused under reduced motion.

## Out of scope

- Other noise channels (depolarizing, amplitude damping beyond T₁).
- Editing the initial state.

## Acceptance criteria

- [x] Unit tests: decay is 1 at t = 0, approaches e^(−3.5·rate) just before the cycle ends and returns to 1 at t = 5 s; dephasing keeps the vector length at 1.18·decay with |z| ≤ 0.02; relaxation ends with z near 1.18·0.95 while the XY radius shrinks.
- [x] Purity tiers switch at 70% and 35%; readouts divide by 1.18 and use absolute values for X and Y only.
- [x] Switching mechanism or pressing Reset Cycle restarts at t = 0.
- [x] Rate slider scales the decay speed and its label shows one decimal plus "x".
- [x] Pause freezes the vector, the wave and the sphere rotation.
- [x] Dragging orbits the camera with the polar angle clamped; arrow keys orbit too.
- [x] Wave canvas shows the envelope shrinking with the decay and the visibility percentage.
- [x] Exported GIF has 30 looping frames at 540x540, the button is disabled while exporting, playback resumes after success.
- [x] Controls are keyboard operable with visible labels.
- [x] Side by side with the legacy page, the panels, colors and texts match; header, footer and background follow the standard shell.
- [x] The 3D sphere renders in a real browser at paused state and after dragging.
- [x] Playback starts paused under reduced motion.

## Open questions

None.
