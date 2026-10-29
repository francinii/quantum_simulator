import type { BellState, BellStep } from './bell-states'

export const CYCLE_SECONDS = 4
export const STEP_FORWARD = 0.15
export const ENTANGLED_AT = 0.7

export const CURSOR_START_X = 70
export const CURSOR_END_X = 500

export type Vec3 = readonly [number, number, number]

export function advance(progress: number, deltaSeconds: number, speed: number) {
  const next = progress + (deltaSeconds / CYCLE_SECONDS) * speed
  return next > 1 ? 0 : next
}

export function stepForward(progress: number) {
  return (progress + STEP_FORWARD) % 1
}

export const cursorX = (progress: number) =>
  CURSOR_START_X + progress * (CURSOR_END_X - CURSOR_START_X)

export function currentStep(state: BellState, progress: number): BellStep {
  for (let i = state.steps.length - 1; i >= 0; i--) {
    if (progress >= state.steps[i].t) return state.steps[i]
  }
  return state.steps[0]
}

export const stepIndex = (state: BellState, progress: number) =>
  state.steps.indexOf(currentStep(state, progress))

export function phaseLabel(progress: number) {
  if (progress < 0.2) return 'Input'
  if (progress < 0.6) return 'Superposition'
  return 'Entanglement'
}

export const isEntangled = (progress: number) => progress >= ENTANGLED_AT

// Entropy of one qubit's reduced state jumps from 0 to 1 when CNOT entangles the pair.
export const entropyLabel = (progress: number) =>
  isEntangled(progress) ? '1.00 qubit (Max)' : '0.00 qubits'

export interface BlochArrow {
  direction: Vec3
  length: number
}

// Each qubit's own arrow: X flips it to |1⟩, H on q₀ tips it onto ±X, and once
// entangled the reduced state is maximally mixed so the arrow shrinks to nothing.
export function blochArrows(
  state: BellState,
  progress: number,
): [BlochArrow, BlochArrow] {
  let q0: Vec3 = [0, 1, 0]
  let q1: Vec3 = [0, 1, 0]

  if (state.needsX0 && progress > 0.15) q0 = [0, -1, 0]
  if (state.needsX1 && progress > 0.15) q1 = [0, -1, 0]
  if (progress >= 0.35 && progress < ENTANGLED_AT) {
    q0 = state.needsX0 ? [-1, 0, 0] : [1, 0, 0]
  }

  const length = isEntangled(progress)
    ? Math.max(0.02, 1 - (progress - ENTANGLED_AT) * 3.3)
    : 1

  return [
    { direction: q0, length },
    { direction: q1, length },
  ]
}

export const sphereRotation = (progress: number) => progress * 0.8

const BASIS = ['|00⟩', '|01⟩', '|10⟩', '|11⟩']

// Plain-words reading of the current distribution; legacy showed one static sentence.
export function probabilityNote(probabilities: readonly number[]) {
  const present = BASIS.filter((_, i) => probabilities[i] > 1e-9)
  if (present.length === 1) {
    return `Probability is concentrated in a single configuration: ${present[0]}.`
  }
  return `Probability is shared equally between ${present.join(' and ')}.`
}
