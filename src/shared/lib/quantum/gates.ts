import { identity, kron, type Matrix } from './matrix'

const SQRT_HALF = Math.SQRT1_2

export const I: Matrix = identity(2)

export const X: Matrix = [
  [0, 1],
  [1, 0],
]

export const H: Matrix = [
  [SQRT_HALF, SQRT_HALF],
  [SQRT_HALF, -SQRT_HALF],
]

// Control on the first qubit, target on the second; basis order |00⟩, |01⟩, |10⟩, |11⟩.
export const CNOT: Matrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
]

// Qubit 0 is the leftmost bit, so on 2 qubits applying a gate to it is gate ⊗ I.
export function applyToQubit(
  gate: Matrix,
  qubit: number,
  qubitCount: number,
): Matrix {
  let result: Matrix = [[1]]
  for (let index = 0; index < qubitCount; index++) {
    result = kron(result, index === qubit ? gate : I)
  }
  return result
}

export const ZERO_STATE_2: number[] = [1, 0, 0, 0]
