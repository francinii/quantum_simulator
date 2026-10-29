# Matrix Algebra

Status: draft
Legacy: legacy/simulador_interactivo_lgebra_matricial_vs_notaci_n_dirac.html

## Goal

Teach H ⊗ H step by step, side by side in matrix (Kronecker) and Dirac notation, ending at the uniform superposition with 25% on each basis state.

## Behavior

- Page: standard shell with the back link, five step buttons, the circuit, two parallel notation panels, the probability panel, the footer takeaway ("Matrix algebra is ideal for numerical computer simulations…").
- Steps: 0 Initial States (|0⟩ ⊗ |0⟩), 1 Tensor Vector, 2 Operator H ⊗ H, 3 Operation U · v, 4 Final Superposition (P(ij) = 25% each). The active step is highlighted. Previous and Next wrap around; Reset returns to step 0.
- Auto-play advances one step every 3.5 s divided by the speed (0.5x-2x, default 1x), looping 4 → 0. Pause stops it; going to a step by hand does not.
- Circuit (SVG): two wires |0⟩, an H on each, a dotted H ⊗ H connector, a final brace labeled |ψ₁⟩, and a dashed time cursor with a photon on each wire at x = 75, 170, 285, 380, 570 for steps 0-4. From step 2 the H gates glow with a thicker outline. The step label reads "Step N: name".
- Matrix panel: three boxes (basis vectors and Kronecker product; construction of H ⊗ H as a 4x4 matrix with factor 1/2; matrix-vector multiplication extracting column 1). Dirac panel: three boxes (|ψ₀⟩ = |00⟩; H|0⟩ = |+⟩; distributive expansion to (|00⟩+|01⟩+|10⟩+|11⟩)/2). Boxes up to the current step are fully visible and ringed, the rest dimmed: step 0-1 box 1; step 2 boxes 1-2; steps 3-4 all three.
- Probability panel: |00⟩ |01⟩ |10⟩ |11⟩ bars and percentages: 100/0/0/0 for steps 0-2 and 25 each for steps 3-4, with a normalization line.
- Export GIF (540x540): one frame per step (5), 1.2 s each, looping. Each shows the circuit at that step, a matrix card and a Dirac card with that step's key lines, the probabilities line and the lab name. File name `hadamard_matrix_vs_dirac.gif`.

## Technical decisions

- Linear algebra is pure TypeScript in `shared/lib/quantum` on real matrices: Kronecker product, matrix-matrix and matrix-vector multiplication, identity, and the H, X and CNOT gates. Bell states reuse it.
- Displayed matrices stay static KaTeX; unit tests check the same identities numerically (H ⊗ H, column extraction, unitarity, 25% each).
- Step data (names, active boxes, probabilities, x positions) is a typed table in the feature `lib/`.
- Fix over legacy: the legacy GIF serialized the circuit once before the loop, so every frame showed step 0. Here each frame draws the circuit for its own step, natively on canvas.
- Auto-play starts paused under reduced motion.
- Step buttons reuse `PresetButton`; the rest reuses shared pieces.

## Out of scope

- Other gates or more than two qubits.
- Typing in custom matrices.

## Acceptance criteria

- [ ] Math tests: kron([1,0],[1,0]) = [1,0,0,0]; H ⊗ H equals ½[[1,1,1,1],[1,-1,1,-1],[1,1,-1,-1],[1,-1,-1,1]]; (H ⊗ H)|00⟩ = ½[1,1,1,1]; the matrix is orthogonal; squared amplitudes are 25% each and sum to 1.
- [ ] Gate tests: X, H and CNOT matrices; applying a gate to qubit k of n equals the Kronecker form.
- [ ] Step table matches the spec: names, active boxes, probabilities and cursor positions for steps 0-4.
- [ ] Step buttons, Previous, Next and Reset navigate with wraparound and update every panel.
- [ ] Auto-play advances every 3.5 s divided by speed, loops, and pauses; manual navigation keeps it running.
- [ ] H gates glow from step 2; photons and cursor sit at the step position.
- [ ] Inactive boxes are dimmed and active boxes ringed in blue (matrix) or pink (Dirac).
- [ ] Probability bars and percentages follow the step.
- [ ] Exported GIF has 5 frames at 540x540, looping, each with its own circuit state; the button is disabled while exporting.
- [ ] Formulas render (matrices, aligned expansion) and scroll horizontally on narrow screens.
- [ ] Controls are keyboard operable with visible labels.
- [ ] Side by side with the legacy page, layout, colors and texts match.
- [ ] Auto-play starts paused under reduced motion.

## Open questions

None.
