import { matVec } from '@/shared/lib/quantum/matrix'
import { ZERO_STATE_2 } from '@/shared/lib/quantum/gates'
import {
  BELL_KEYS,
  BELL_STATES,
  formatVector,
  type BellKey,
} from './bell-states'

const R = Math.SQRT1_2

// The amplitude vectors and Dirac lines exactly as the legacy page listed them.
const LEGACY_VECTORS: Record<BellKey, string[]> = {
  phi_plus: ['[1.0, 0, 0, 0]ᵀ', '[0.71, 0, 0.71, 0]ᵀ', '[0.71, 0, 0, 0.71]ᵀ'],
  phi_minus: [
    '[1.0, 0, 0, 0]ᵀ',
    '[0, 0, 1.0, 0]ᵀ',
    '[0.71, 0, -0.71, 0]ᵀ',
    '[0.71, 0, 0, -0.71]ᵀ',
  ],
  psi_plus: [
    '[1.0, 0, 0, 0]ᵀ',
    '[0, 1.0, 0, 0]ᵀ',
    '[0, 0.71, 0, 0.71]ᵀ',
    '[0, 0.71, 0.71, 0]ᵀ',
  ],
  psi_minus: [
    '[1.0, 0, 0, 0]ᵀ',
    '[0, 0, 0, 1.0]ᵀ',
    '[0, 0.71, 0, -0.71]ᵀ',
    '[0, 0.71, -0.71, 0]ᵀ',
  ],
}

const LEGACY_PROBABILITIES: Record<BellKey, number[][]> = {
  phi_plus: [
    [1, 0, 0, 0],
    [0.5, 0, 0.5, 0],
    [0.5, 0, 0, 0.5],
  ],
  phi_minus: [
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0.5, 0, 0.5, 0],
    [0.5, 0, 0, 0.5],
  ],
  psi_plus: [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0.5, 0, 0.5],
    [0, 0.5, 0.5, 0],
  ],
  psi_minus: [
    [1, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0.5, 0, 0.5],
    [0, 0.5, 0.5, 0],
  ],
}

describe('the four circuits, simulated with X, H and CNOT', () => {
  it.each(BELL_KEYS)(
    '%s: every step vector matches the legacy table',
    (key) => {
      expect(BELL_STATES[key].steps.map((s) => s.vectorText)).toEqual(
        LEGACY_VECTORS[key],
      )
    },
  )

  it.each(BELL_KEYS)(
    '%s: every step probability matches the legacy table',
    (key) => {
      expect(BELL_STATES[key].steps.map((s) => s.probabilities)).toEqual(
        LEGACY_PROBABILITIES[key],
      )
    },
  )

  it('Φ⁺ ends at (|00⟩ + |11⟩)/√2', () => {
    expect(BELL_STATES.phi_plus.steps.at(-1)!.vector[0]).toBeCloseTo(R)
    expect(BELL_STATES.phi_plus.steps.at(-1)!.vector[3]).toBeCloseTo(R)
  })

  it('Φ⁻ ends at (|00⟩ − |11⟩)/√2', () => {
    const v = BELL_STATES.phi_minus.steps.at(-1)!.vector
    expect([v[0], v[1], v[2], v[3]].map((x) => +x.toFixed(6))).toEqual([
      +R.toFixed(6),
      0,
      0,
      +(-R).toFixed(6),
    ])
  })

  it('Ψ⁺ ends at (|01⟩ + |10⟩)/√2 and Ψ⁻ at (|01⟩ − |10⟩)/√2', () => {
    const plus = BELL_STATES.psi_plus.steps.at(-1)!.vector
    const minus = BELL_STATES.psi_minus.steps.at(-1)!.vector
    expect(plus[1]).toBeCloseTo(R)
    expect(plus[2]).toBeCloseTo(R)
    expect(minus[1]).toBeCloseTo(R)
    expect(minus[2]).toBeCloseTo(-R)
  })

  it('every step starts from the previous one, beginning at |00⟩', () => {
    for (const key of BELL_KEYS) {
      expect(BELL_STATES[key].steps[0].vector).toEqual(ZERO_STATE_2)
    }
  })

  it('every step keeps the total probability at 1', () => {
    for (const key of BELL_KEYS) {
      for (const step of BELL_STATES[key].steps) {
        expect(step.probabilities.reduce((a, b) => a + b, 0)).toBeCloseTo(1)
      }
    }
  })
})

describe('the Bell states form an orthonormal basis of ℂ⁴', () => {
  const finals = BELL_KEYS.map((key) => BELL_STATES[key].steps.at(-1)!.vector)
  const dot = (a: number[], b: number[]) =>
    a.reduce((sum, value, i) => sum + value * b[i], 0)

  it('each has unit length', () => {
    for (const v of finals) expect(dot(v, v)).toBeCloseTo(1)
  })

  it('each pair is orthogonal', () => {
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++)
        expect(dot(finals[i], finals[j])).toBeCloseTo(0)
    }
  })

  it('CNOT·(H⊗I) is what creates the entanglement: no final state is a product state', () => {
    for (const v of finals) {
      // A 2-qubit state is a product state exactly when c00·c11 = c01·c10.
      expect(Math.abs(v[0] * v[3] - v[1] * v[2])).toBeCloseTo(0.5)
    }
  })
})

describe('final distributions and circuit gates', () => {
  it('Φ states give 00 or 11, Ψ states give 01 or 10, each half the time', () => {
    expect(BELL_STATES.phi_plus.finalProbabilities).toEqual([0.5, 0, 0, 0.5])
    expect(BELL_STATES.phi_minus.finalProbabilities).toEqual([0.5, 0, 0, 0.5])
    expect(BELL_STATES.psi_plus.finalProbabilities).toEqual([0, 0.5, 0.5, 0])
    expect(BELL_STATES.psi_minus.finalProbabilities).toEqual([0, 0.5, 0.5, 0])
  })

  it('shows the X gates each circuit needs', () => {
    expect(
      BELL_KEYS.map((k) => [BELL_STATES[k].needsX0, BELL_STATES[k].needsX1]),
    ).toEqual([
      [false, false],
      [true, false],
      [false, true],
      [true, true],
    ])
  })

  it('places step boundaries at the legacy cycle positions', () => {
    expect(BELL_STATES.phi_plus.steps.map((s) => s.t)).toEqual([0, 0.35, 0.75])
    expect(BELL_STATES.phi_minus.steps.map((s) => s.t)).toEqual([
      0, 0.2, 0.45, 0.75,
    ])
    expect(BELL_STATES.psi_minus.steps.map((s) => s.t)).toEqual([
      0, 0.2, 0.45, 0.75,
    ])
  })

  it('names the states and their cards', () => {
    expect(BELL_STATES.phi_plus.symbol).toBe('|Φ⁺⟩')
    expect(BELL_STATES.psi_minus.title).toBe('Circuit for State |Ψ⁻⟩ (Singlet)')
    expect(BELL_STATES.phi_minus.card.chip).toBe('X₀ → H → CX')
    expect(BELL_STATES.psi_minus.card.label).toBe('Singlet State 11')
  })
})

describe('formatVector', () => {
  it('writes zeros as 0, ±1 as 1.0 and the rest with two decimals', () => {
    expect(formatVector([1, 0, 0, 0])).toBe('[1.0, 0, 0, 0]ᵀ')
    expect(formatVector([R, -R, 0, -1])).toBe('[0.71, -0.71, 0, -1.0]ᵀ')
    expect(
      formatVector(
        matVec(
          [
            [0, 1],
            [1, 0],
          ],
          [1, 0],
        ),
      ),
    ).toBe('[0, 1.0]ᵀ')
  })
})
