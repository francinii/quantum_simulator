# Bell States

Status: implemented
Legacy: legacy/simulador_animado_y_generador_gif_estados_de_bell.html (migrated)

## Goal

Build each of the four Bell states with X, Hadamard and CNOT gates, watching the circuit run, the amplitudes evolve and the two Bloch vectors collapse to the center as entanglement appears.

## Behavior

- Page: standard shell with the back link, four state cards, the circuit and live math on the left, the 3D spheres, measurement and export panels on the right, the footer ("The Bell states form a complete orthonormal basis of ℂ⁴").
- States: |Φ⁺⟩ (H → CX), |Φ⁻⟩ (X₀ → H → CX), |Ψ⁺⟩ (X₁ → H → CX), |Ψ⁻⟩ (X₀,X₁ → H → CX). The selected card is highlighted; selecting one restarts the cycle.
- Circuit: two wires |0⟩, X gates shown only where the state needs them, H on q₀, CNOT (control q₀, target q₁), a brace labeled with the state symbol, a dashed time cursor and a photon per wire. A cycle of 4 s moves them from x = 70 to x = 500, looping. Header reads "Circuit for State |Φ⁺⟩…".
- Steps per state (3 for Φ⁺, 4 for the others) change the Dirac line, its explanation, the amplitude vector [c₀₀, c₀₁, c₁₀, c₁₁]ᵀ and P(00). Bit order is q₀ then q₁, left to right. The step badge reads "Step N: Input / Superposition / Entanglement".
- Controls: Pause / Resume, Reset, Step → (pauses and advances 15% of the cycle, wrapping), speed 0.5x-2.5x (default 1x).
- Live math: Dirac card and amplitude-vector card with P(00) and a one-line reading of the distribution ("concentrated in a single configuration: |00⟩" / "shared equally between |00⟩ and |11⟩").
- 3D spheres: Q0 (blue) and Q1 (pink) with equator rings, |0⟩/|1⟩ labels and names, one arrow each; drag orbits the camera. Before the CNOT the arrows point to |0⟩ (or |1⟩ after X), after H to ±X; from 70% of the cycle both shrink toward the center and the badge turns to "Maximal Entanglement (EPR)!" (pulsing), otherwise "Separable: Not Entangled".
- Entanglement entropy line: "0.00 qubits (EPR Pair: 1.00)" while separable and "1.00 qubit (Max)" once entangled, switching together with the badge at 70% of the cycle.
- Shots simulator: four bars (|00⟩ |01⟩ |10⟩ |11⟩) with the current step's probabilities and percentages. "Perform Quantum Measurement (1 Shot)" samples the final distribution (Φ± give 00 or 11, Ψ± give 01 or 10), shows "Collapsed Outcome: |kk⟩" for 2.5 s and fires a small confetti burst.
- Export GIF (540x540): 28 frames over one cycle at 0.12 s, looping, each with title, state formula, circuit at that frame's progress, the 3D spheres and the probabilities line. Playback pauses while exporting and resumes after a successful export. File name `bell_state_<state>.gif`.

## Technical decisions

- Step states come from a pure state-vector simulation in `shared/lib/quantum` (X, H, CNOT on two qubits, from spec 008), checked against the table above; the Dirac text per step is typed data.
- Cycle logic is pure and tested: current step at a progress value, vector lengths and directions, entanglement flag, step label, measurement sampling with an injectable random source.
- Second use of the Three.js scene: camera orbit, translucent sphere with equator ring, state arrow and text sprites move to `shared`; decoherence (spec 007) is refactored onto them and stays pixel-identical.
- Three.js and `canvas-confetti` come from npm. Confetti is skipped under reduced motion.
- Fix over legacy: entropy used to ramp linearly (up to 0.84 qubits) while the badge still said "Separable", which is physically wrong; it is now 0 until entangled.
- Fix over legacy: the GIF circuit was serialized once, so every frame showed the same cursor position. Each frame now draws the circuit at its own progress, natively on canvas.
- Fix over legacy: the P(00) readout never updated (always 100%) and the sentence under the vector was static; both follow the current step.
- Fix over legacy: the footer printed the literal source `$\mathbb{C}^4$`; it is rendered with KaTeX like the other pages.
- Fix over legacy: no event branding in the page, in the GIF title suffix or in the file name.
- State cards are their own component (their layout differs from `PresetButton`); the export panel uses the shared export pieces.
- The shots bars ease only while paused: while the cycle plays they follow every frame and a CSS transition would restart each time.
- Playback starts paused under reduced motion.

## Out of scope

- Custom input states, noise, more than two qubits.
- Real Bell-inequality experiments.

## Acceptance criteria

- [x] Simulation tests: each circuit yields the expected final vector, and Φ⁺ also yields the intermediate vector after H.
- [x] Step selection at any progress returns the right step for every state; badge labels switch at 20% and 60%.
- [x] Bloch arrows: directions before X, after X, after H and the shrink law from 70%, for all four states.
- [x] Entanglement flag turns on at 70%; the badge and entropy text follow it, with entropy 0.00 before and 1.00 after (never a ramp).
- [x] Measurement: Φ± never give 01 or 10, Ψ± never 00 or 11; 10,000 samples land within tolerance of 50/50.
- [x] Selecting a state updates cards, gates, header, symbol and export label and restarts the cycle.
- [x] Play, pause, reset, step and speed behave as listed; Step wraps and pauses.
- [x] The toast shows the outcome for 2.5 s and confetti fires unless reduced motion.
- [x] Exported GIF has 28 looping frames at 540x540 with the circuit cursor moving across frames; the button is disabled while exporting.
- [x] Both spheres render in a real browser, orbit with the mouse and follow the cycle.
- [x] Controls are keyboard operable with visible labels.
- [x] Side by side with the legacy page, layout, colors and texts match.
- [x] Decoherence and the other simulators still pass their tests and look unchanged after the shared 3D extraction.
- [x] Playback starts paused under reduced motion.

## Open questions

None.
