# Superposition

Status: ready
Legacy: legacy/superposicion_y_probabilidades.html

## Goal

Let a student move a qubit on the Bloch sphere, see how its amplitudes become probabilities (Born's rule), and measure it many times to watch the statistics emerge.

## Behavior

- Page: back link, header, state presets, main panels, footer takeaway ("Superposition is described by amplitudes…").
- Presets: |0⟩ (θ 0°), |1⟩ (θ 180°), |+⟩ (θ 90°, φ 0°), |−⟩ (θ 90°, φ 180°), |+i⟩ (θ 90°, φ 90°), θ = 60° (75% / 25%). The active preset is highlighted when θ and φ match; moving a slider clears it.
- Bloch sphere (canvas): sphere, equator, axes labeled |0⟩ |1⟩ |+⟩ |−⟩ |+i⟩, state vector with its shadow on the equator showing φ.
- Controls: θ 0-180° (sets the probabilities), φ 0-360° (does not), "Animate θ" / "Pause". Animation sweeps θ back and forth between 0° and 180° at 45°/s.
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
- Reused from `shared`: `SimulatorFrame`, `Slider`, `PlayPauseButton`, `Formula`, `useAnimationFrame`, canvas theme, GIF encoder.
- Extracted into `shared` because this is their second use (interference is refactored to use them): `PresetButton`, `PanelHeader`, `ExportBar` and the `useGifExport` hook (status flow and download).

## Out of scope

- Other measurement bases (that is the qubit-measurement simulator).
- High-DPI canvas scaling.

## Acceptance criteria

- [ ] Unit tests for the math: P(0) is 1, 0.5, 0, 0.75 at θ = 0°, 90°, 180°, 60°; |α|² + |β|² = 1 for sample angles; amplitudes of |+⟩, |−⟩, |+i⟩; Bloch vector at the poles and on ±x, ±y.
- [ ] Sampling with a fixed random source returns 0 below P(0) and 1 above; 10,000 shots land within tolerance of the theoretical probability.
- [ ] Amplitude formatting is unit tested (real, negative, imaginary, general phase, near-zero magnitude).
- [ ] Each preset sets θ and φ as listed and highlights itself; sliders clear it.
- [ ] Sliders update α, β, bars, percentages and the normalization line.
- [ ] Animate θ sweeps 0° → 180° → 0°, and stops on any control or measurement.
- [ ] Measure once records one outcome, shows the overlay and moves the vector to the pole, then returns after 1.4 s.
- [ ] ×100 and ×1000 add that many shots; counts sum to the total; Reset clears; the log shows at most 60.
- [ ] Changing the state resets statistics and collapse.
- [ ] Histogram bars and theory lines follow frequencies and probabilities.
- [ ] Exported GIF has 36 looping frames covering θ 0° → 180° → 0°, and the button is disabled while exporting.
- [ ] All controls are keyboard operable with visible labels.
- [ ] Side by side with the legacy page, layout, colors and texts match.
- [ ] The collapse flash is disabled under reduced motion.
- [x] Interference still passes all its tests and looks unchanged after the shared extraction (verified pixel-identical against the previous commit at 1280px and 500px).

## Open questions

None.
