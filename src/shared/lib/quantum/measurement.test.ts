import { blochVector, outcomeProbabilities } from './bloch'
import {
  AXES,
  collapseTarget,
  dot,
  normalize,
  outcomeDistribution,
  probabilityOfPlus,
  sampleShot,
  scale,
} from './measurement'

const KET_ZERO = blochVector(0, 0)
const KET_ONE = blochVector(180, 0)
const KET_PLUS = blochVector(90, 0)
const KET_MINUS = blochVector(90, 180)
const KET_PLUS_I = blochVector(90, 90)
const KET_MINUS_I = blochVector(90, 270)

const asMap = (
  state: ReturnType<typeof blochVector>,
  first: keyof typeof AXES,
  second: keyof typeof AXES | null,
) =>
  Object.fromEntries(
    outcomeDistribution(state, AXES[first], second ? AXES[second] : null).map(
      ({ bits, probability }) => [bits.join(''), probability],
    ),
  )

describe('vector helpers', () => {
  it('computes dot products and scaling', () => {
    expect(dot({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toBe(32)
    expect(scale({ x: 1, y: -2, z: 0 }, 3)).toEqual({ x: 3, y: -6, z: 0 })
  })

  it('normalizes to unit length and falls back when the vector is tiny', () => {
    const unit = normalize({ x: 3, y: 0, z: 4 }, KET_ZERO)
    expect(Math.hypot(unit.x, unit.y, unit.z)).toBeCloseTo(1)
    expect(normalize({ x: 0, y: 0, z: 0 }, KET_PLUS)).toBe(KET_PLUS)
  })
})

describe('probabilityOfPlus', () => {
  it.each([
    ['|0⟩ on Z', KET_ZERO, 'Z', 1],
    ['|1⟩ on Z', KET_ONE, 'Z', 0],
    ['|+⟩ on Z', KET_PLUS, 'Z', 0.5],
    ['|+⟩ on X', KET_PLUS, 'X', 1],
    ['|−⟩ on X', KET_MINUS, 'X', 0],
    ['|+i⟩ on Y', KET_PLUS_I, 'Y', 1],
    ['|−i⟩ on Y', KET_MINUS_I, 'Y', 0],
    ['|0⟩ on X', KET_ZERO, 'X', 0.5],
    ['|+i⟩ on Z', KET_PLUS_I, 'Z', 0.5],
  ] as const)('%s gives %f', (_name, state, basis, expected) => {
    expect(probabilityOfPlus(state, AXES[basis])).toBeCloseTo(expected)
  })

  it('agrees with Born probabilities for Ry(θ)|0⟩ on Z', () => {
    for (const theta of [0, 30, 60, 90, 135, 180]) {
      const [p0] = outcomeProbabilities(theta)
      expect(probabilityOfPlus(blochVector(theta, 0), AXES.Z)).toBeCloseTo(p0)
    }
  })

  it('stays within [0, 1] despite rounding', () => {
    const slightlyOff = { x: 0, y: 0, z: 1.0000000001 }
    expect(probabilityOfPlus(slightlyOff, AXES.Z)).toBe(1)
  })
})

describe('collapseTarget', () => {
  const expectVector = (
    actual: { x: number; y: number; z: number },
    expected: { x: number; y: number; z: number },
  ) => {
    // Scaling by -1 yields -0 for null components, which toEqual would reject.
    expect(actual.x).toBeCloseTo(expected.x)
    expect(actual.y).toBeCloseTo(expected.y)
    expect(actual.z).toBeCloseTo(expected.z)
  }

  it('snaps to the ends of the axis', () => {
    expectVector(collapseTarget(AXES.X, 0), { x: 1, y: 0, z: 0 })
    expectVector(collapseTarget(AXES.Y, 1), { x: 0, y: -1, z: 0 })
    expectVector(collapseTarget(AXES.Z, 1), { x: 0, y: 0, z: -1 })
  })
})

describe('outcomeDistribution (the five experiments)', () => {
  it('Experiment 1: |0⟩ → Z is always 0', () => {
    expect(asMap(KET_ZERO, 'Z', null)).toEqual({ '0': 1, '1': 0 })
  })

  it('Experiment 2: |+⟩ → Z is 50 / 50', () => {
    const p = asMap(KET_PLUS, 'Z', null)
    expect(p['0']).toBeCloseTo(0.5)
    expect(p['1']).toBeCloseTo(0.5)
  })

  it('Experiment 3: |+⟩ → X is always +', () => {
    const p = asMap(KET_PLUS, 'X', null)
    expect(p['0']).toBeCloseTo(1)
    expect(p['1']).toBeCloseTo(0)
  })

  it('Experiment 4: |+⟩ → Z → Z only gives 00 and 11 (the collapse persists)', () => {
    const p = asMap(KET_PLUS, 'Z', 'Z')
    expect(p['00']).toBeCloseTo(0.5)
    expect(p['11']).toBeCloseTo(0.5)
    expect(p['01']).toBeCloseTo(0)
    expect(p['10']).toBeCloseTo(0)
  })

  it('Experiment 5: |0⟩ → Z → X is random again on the second bit', () => {
    const p = asMap(KET_ZERO, 'Z', 'X')
    expect(p['00']).toBeCloseTo(0.5)
    expect(p['01']).toBeCloseTo(0.5)
    expect(p['10']).toBeCloseTo(0)
    expect(p['11']).toBeCloseTo(0)
  })

  it('always sums to 1, for one and two measurements and any state', () => {
    for (const state of [KET_ZERO, KET_PLUS, KET_MINUS_I, blochVector(60, 0)]) {
      for (const first of ['Z', 'X', 'Y'] as const) {
        for (const second of [null, 'Z', 'X', 'Y'] as const) {
          const total = outcomeDistribution(
            state,
            AXES[first],
            second ? AXES[second] : null,
          ).reduce((sum, o) => sum + o.probability, 0)
          expect(total).toBeCloseTo(1)
        }
      }
    }
  })

  it('lists one entry per result, with bits in measurement order', () => {
    expect(
      outcomeDistribution(KET_PLUS, AXES.Z, null).map((o) => o.bits),
    ).toEqual([[0], [1]])
    expect(
      outcomeDistribution(KET_PLUS, AXES.Z, AXES.X).map((o) => o.bits),
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ])
  })
})

describe('sampleShot', () => {
  it('is deterministic for a fixed random source', () => {
    const draws = [0.1, 0.9]
    let index = 0
    const random = () => draws[index++ % draws.length]
    // P(0) = 0.5 on Z for |+⟩: 0.1 → 0. Then collapsed |0⟩ on X: 0.9 → 1.
    expect(sampleShot(KET_PLUS, AXES.Z, AXES.X, random)).toEqual({
      first: 0,
      second: 1,
    })
  })

  it('has no second result with a single measurement', () => {
    expect(sampleShot(KET_ZERO, AXES.Z, null, () => 0.5)).toEqual({
      first: 0,
      second: null,
    })
  })

  it('reproduces the second measurement collapse: |+⟩ Z→Z repeats the first bit', () => {
    let seed = 99
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    for (let i = 0; i < 500; i++) {
      const { first, second } = sampleShot(KET_PLUS, AXES.Z, AXES.Z, random)
      expect(second).toBe(first)
    }
  })

  it('lands within tolerance of theory over 10,000 shots', () => {
    let seed = 2024
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    const state = blochVector(60, 0)
    let zeros = 0
    for (let i = 0; i < 10_000; i++) {
      if (sampleShot(state, AXES.Z, null, random).first === 0) zeros++
    }
    expect(Math.abs(zeros / 10_000 - 0.75)).toBeLessThan(0.02)
  })
})
