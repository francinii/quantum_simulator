# Superposition

Status: implemented
Legacy: legacy/superposicion_y_probabilidades.html (migrated)

## Goal

Let a student move a qubit on the Bloch sphere, see how its amplitudes become probabilities (Born's rule), and measure it many times to watch the statistics emerge.

## Behavior

- Page: back link, header, state presets, main panels, footer takeaway ("Superposition is described by amplitudes…").
- Presets: |0⟩ (θ 0°), |1⟩ (θ 180°), |+⟩ (θ 90°, φ 0°), |−⟩ (θ 90°, φ 180°), |+i⟩ (θ 90°, φ 90°), θ = 60° (75% / 25%). The active preset is highlighted when θ and φ match; moving a slider clears it.
- Bloch sphere (canvas): sphere, equator, axes labeled |0⟩ |1⟩ |+⟩ |−⟩ |+i⟩, state vector with its shadow on the equator showing φ.
- Controls: θ 0-180° (sets the probabilities), φ 0-360° (does not), "Animate θ" / "Pause". Animation sweeps θ back and forth between 0° and 180° at 45°/s. While it runs, the amplitude and probability bars and the dashed theory lines follow θ in real time; otherwise they ease with a short CSS transition.
- State panel: |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩, with the numeric α and β (β shown as real, imaginary, or magnitude with phase).
- Probability panel: |α|, |β| bars, probabilities P = |amplitude|² as bars and percent, and the normalization line.
- Measurement lab: Measure once, ×100, ×1000, Reset. Shows total shots, counts and frequencies per outcome, a histogram with a dashed theoretical line, and the last 60 outcomes.
- Measure once: the vector jumps to the measured pole for 1.4 s and an overlay reads "Measured: |k⟩".
- Changing the state (preset, θ, φ) or starting the animation clears collapse and statistics. Any control or measurement stops the animation.
- Three explanation cards; the last links to the interference simulator.
- Export GIF (540x540): 36 frames sweeping θ 0° → 180° → 0° at the current φ, looping, with status text while it works.

## Technical decisions

- Quantum math is pure TypeScript in `shared/lib/quantum` (`Complex`, amplitudes, probabilities, Bloch vector, outcome sampling). Sampling takes an injectable random source so tests are deterministic.
- Bloch sphere drawing stays in this feature for now; it moves to `shared` when a second simulator needs it.
- Amplitude text formatting and presets live in the feature `lib/`.
- The θ-driven bars and theory lines have no CSS transition while animating: React commits the style before each paint, so a transition would restart at zero progress every frame and the bars would freeze. (Legacy avoided this by writing styles inside `requestAnimationFrame`.)
- Reused from `shared`: `SimulatorFrame`, `Slider`, `PlayPauseButton`, `Formula`, `useAnimationFrame`, canvas theme, GIF encoder.
- Formulas use KaTeX (as in interference), so glyph shapes differ slightly from the legacy MathJax; layout and content match.
- Extracted into `shared` because this is their second use (interference is refactored to use them): `PresetButton`, `PanelHeader`, `ExportBar` and the `useGifExport` hook (status flow and download).

## Out of scope

- Other measurement bases (that is the qubit-measurement simulator).
- High-DPI canvas scaling.

## Acceptance criteria

- [x] Unit tests for the math: P(0) is 1, 0.5, 0, 0.75 at θ = 0°, 90°, 180°, 60°; |α|² + |β|² = 1 for sample angles; amplitudes of |+⟩, |−⟩, |+i⟩; Bloch vector at the poles and on ±x, ±y.
- [x] Sampling with a fixed random source returns 0 below P(0) and 1 above; 10,000 shots land within tolerance of the theoretical probability.
- [x] Amplitude formatting is unit tested (real, negative, imaginary, general phase, near-zero magnitude).
- [x] Each preset sets θ and φ as listed and highlights itself; sliders clear it.
- [x] Sliders update α, β, bars, percentages and the normalization line.
- [x] Animate θ sweeps 0° → 180° → 0°, and stops on any control or measurement.
- [x] While animating, the probability and amplitude bars and the theory lines visibly follow θ (measured in a real browser: bar 129 px → 25 px, theory line moves down the histogram).
- [x] Measure once records one outcome, shows the overlay and moves the vector to the pole, then returns after 1.4 s.
- [x] ×100 and ×1000 add that many shots; counts sum to the total; Reset clears; the log shows at most 60.
- [x] Changing the state resets statistics and collapse.
- [x] Histogram bars and theory lines follow frequencies and probabilities.
- [x] Exported GIF has 36 looping frames covering θ 0° → 180° → 0°, and the button is disabled while exporting.
- [x] All controls are keyboard operable with visible labels.
- [x] Side by side with the legacy page, layout, colors and texts match.
- [x] The collapse flash is disabled under reduced motion.
- [x] Interference still passes all its tests and looks unchanged after the shared extraction (verified pixel-identical against the previous commit at 1280px and 500px).

## Open questions

None.
