import { applyToQubit, CNOT, H, I, X, ZERO_STATE_2 } from './gates'
import {
  approxEqual,
  identity,
  kron,
  kronVector,
  matMul,
  matVec,
  probabilities,
  scaleMatrix,
  transpose,
} from './matrix'

const HALF = 0.5

describe('basic operations', () => {
  it('builds identity matrices', () => {
    expect(identity(3)).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ])
  })

  it('transposes and multiplies', () => {
    expect(
      transpose([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ])
    expect(
      matMul(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
      ),
    ).toEqual([
      [19, 22],
      [43, 50],
    ])
    expect(
      matVec(
        [
          [1, 2],
          [3, 4],
        ],
        [1, 1],
      ),
    ).toEqual([3, 7])
  })

  it('compares with a tolerance, including nested arrays and different lengths', () => {
    expect(approxEqual([[1, 2]], [[1 + 1e-12, 2]])).toBe(true)
    expect(approxEqual([1, 2], [1, 2.1])).toBe(false)
    expect(approxEqual([1, 2], [1, 2, 3])).toBe(false)
  })
})

describe('Kronecker product', () => {
  it('v₀ ⊗ v₁ for |0⟩ ⊗ |0⟩ is [1, 0, 0, 0]', () => {
    expect(kronVector([1, 0], [1, 0])).toEqual([1, 0, 0, 0])
  })

  it('each entry of the first vector scales the whole second vector', () => {
    expect(kronVector([2, 3], [5, 7])).toEqual([10, 14, 15, 21])
    expect(kronVector([0, 1], [1, 0])).toEqual([0, 0, 1, 0])
  })

  it('every entry of the first matrix scales a copy of the second', () => {
    expect(
      kron(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [0, 1],
          [1, 0],
        ],
      ),
    ).toEqual([
      [0, 1, 0, 2],
      [1, 0, 2, 0],
      [0, 3, 0, 4],
      [3, 0, 4, 0],
    ])
  })

  it('has the dimensions 2^n for n qubits', () => {
    expect(kron(H, H)).toHaveLength(4)
    expect(kron(kron(H, H), H)).toHaveLength(8)
  })
})

describe('H ⊗ H', () => {
  const HH = kron(H, H)

  it('equals ½ [[1,1,1,1],[1,-1,1,-1],[1,1,-1,-1],[1,-1,-1,1]]', () => {
    const expected = scaleMatrix(
      [
        [1, 1, 1, 1],
        [1, -1, 1, -1],
        [1, 1, -1, -1],
        [1, -1, -1, 1],
      ],
      HALF,
    )
    expect(approxEqual(HH, expected)).toBe(true)
  })

  it('has the global scalar 1/√2 × 1/√2 = 1/2', () => {
    expect(H[0][0] * H[0][0]).toBeCloseTo(HALF)
    expect(HH[0][0]).toBeCloseTo(HALF)
  })

  it('applied to |00⟩ gives ½ [1, 1, 1, 1] and extracts the first column', () => {
    const result = matVec(HH, ZERO_STATE_2)
    expect(approxEqual(result, [HALF, HALF, HALF, HALF])).toBe(true)
    expect(
      approxEqual(
        result,
        HH.map((row) => row[0]),
      ),
    ).toBe(true)
  })

  it('is orthogonal, hence unitary, so it preserves total probability', () => {
    expect(approxEqual(matMul(HH, transpose(HH)), identity(4))).toBe(true)
    const total = probabilities(matVec(HH, ZERO_STATE_2)).reduce(
      (a, b) => a + b,
      0,
    )
    expect(total).toBeCloseTo(1)
  })

  it('gives 25% to each basis state', () => {
    for (const p of probabilities(matVec(HH, ZERO_STATE_2))) {
      expect(p).toBeCloseTo(0.25)
    }
  })

  it('matches applying H to each qubit separately', () => {
    const separately = matMul(applyToQubit(H, 0, 2), applyToQubit(H, 1, 2))
    expect(approxEqual(separately, HH)).toBe(true)
  })

  it('equals (H|0⟩) ⊗ (H|0⟩), the distributive form on the Dirac side', () => {
    const plus = matVec(H, [1, 0])
    expect(approxEqual(kronVector(plus, plus), matVec(HH, ZERO_STATE_2))).toBe(
      true,
    )
  })
})

describe('gates', () => {
  it('H is self-inverse and X flips the bit', () => {
    expect(approxEqual(matMul(H, H), I)).toBe(true)
    expect(matVec(X, [1, 0])).toEqual([0, 1])
  })

  it('H|0⟩ = |+⟩ and H|1⟩ = |−⟩', () => {
    expect(approxEqual(matVec(H, [1, 0]), [Math.SQRT1_2, Math.SQRT1_2])).toBe(
      true,
    )
    expect(approxEqual(matVec(H, [0, 1]), [Math.SQRT1_2, -Math.SQRT1_2])).toBe(
      true,
    )
  })

  it('CNOT flips the target only when the control is 1', () => {
    expect(matVec(CNOT, [1, 0, 0, 0])).toEqual([1, 0, 0, 0])
    expect(matVec(CNOT, [0, 1, 0, 0])).toEqual([0, 1, 0, 0])
    expect(matVec(CNOT, [0, 0, 1, 0])).toEqual([0, 0, 0, 1])
    expect(matVec(CNOT, [0, 0, 0, 1])).toEqual([0, 0, 1, 0])
  })

  it('applying a gate to qubit k of n equals the Kronecker form', () => {
    expect(applyToQubit(X, 0, 2)).toEqual(kron(X, I))
    expect(applyToQubit(X, 1, 2)).toEqual(kron(I, X))
    expect(applyToQubit(H, 1, 3)).toEqual(kron(kron(I, H), I))
  })

  it('X on qubit 0 of |00⟩ gives |10⟩, X on qubit 1 gives |01⟩', () => {
    expect(matVec(applyToQubit(X, 0, 2), ZERO_STATE_2)).toEqual([0, 0, 1, 0])
    expect(matVec(applyToQubit(X, 1, 2), ZERO_STATE_2)).toEqual([0, 1, 0, 0])
  })
})
