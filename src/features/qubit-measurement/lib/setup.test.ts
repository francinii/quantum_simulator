import {
  BASES,
  EXPERIMENTS,
  findActiveExperiment,
  initialSetup,
  outcomeKey,
  outcomeKeys,
  preparedVector,
  stateLabel,
  theoryProbabilities,
  type Setup,
} from './setup'

const setupOf = (
  state: Setup['state'],
  m1: Setup['m1'],
  m2: Setup['m2'] = null,
  theta = 60,
): Setup => ({ state, m1, m2, theta })

describe('experiments', () => {
  it('lists the five legacy experiments in order', () => {
    expect(EXPERIMENTS.map((e) => e.title)).toEqual([
      'Definite State',
      'Random Outcome',
      'The Basis Matters',
      'Collapse Persists',
      'Incompatible Bases',
    ])
  })

  it('starts on Random Outcome: |+⟩ measured in Z', () => {
    expect(initialSetup()).toEqual({
      state: 'plus',
      m1: 'Z',
      m2: null,
      theta: 60,
    })
    expect(findActiveExperiment(initialSetup())).toBe(1)
  })

  it('finds the matching experiment, ignoring θ, and none for a custom setup', () => {
    expect(findActiveExperiment(setupOf('plus', 'Z', 'Z', 123))).toBe(3)
    expect(findActiveExperiment(setupOf('zero', 'Z', 'X'))).toBe(4)
    expect(findActiveExperiment(setupOf('one', 'Z'))).toBe(-1)
    expect(findActiveExperiment(setupOf('plus', 'Y'))).toBe(-1)
  })
})

describe('prepared state', () => {
  it('uses the exact Bloch vectors of the named states', () => {
    expect(preparedVector(setupOf('plusI', 'Z'))).toEqual({ x: 0, y: 1, z: 0 })
    expect(preparedVector(setupOf('minus', 'Z'))).toEqual({
      x: -1,
      y: 0,
      z: 0,
    })
  })

  it('builds Ry(θ)|0⟩ in the XZ plane', () => {
    const v = preparedVector(setupOf('ry', 'Z', null, 90))
    expect(v.x).toBeCloseTo(1)
    expect(v.y).toBe(0)
    expect(v.z).toBeCloseTo(0)
  })

  it('labels Ry with its angle', () => {
    expect(stateLabel(setupOf('ry', 'Z', null, 60))).toBe('Ry(60°)|0⟩')
    expect(stateLabel(setupOf('minusI', 'Z'))).toBe('|−i⟩')
  })
})

describe('outcome keys', () => {
  it('uses 2 keys for one measurement and 4 for two', () => {
    expect(outcomeKeys(setupOf('plus', 'Z'))).toEqual(['0', '1'])
    expect(outcomeKeys(setupOf('plus', 'Z', 'X'))).toEqual([
      '00',
      '01',
      '10',
      '11',
    ])
  })

  it('writes bitstrings Qiskit style, c₁ before c₀', () => {
    const two = setupOf('plus', 'Z', 'Z')
    expect(outcomeKey(two, 0, 1)).toBe('10')
    expect(outcomeKey(two, 1, 0)).toBe('01')
    expect(outcomeKey(setupOf('plus', 'Z'), 1, null)).toBe('1')
  })
})

describe('theoryProbabilities (the five experiments)', () => {
  it('Experiment 1: always 0', () => {
    expect(theoryProbabilities(setupOf('zero', 'Z'))).toEqual({
      '0': 1,
      '1': 0,
    })
  })

  it('Experiment 2: 50 / 50', () => {
    const p = theoryProbabilities(setupOf('plus', 'Z'))
    expect(p['0']).toBeCloseTo(0.5)
    expect(p['1']).toBeCloseTo(0.5)
  })

  it('Experiment 3: always +', () => {
    expect(theoryProbabilities(setupOf('plus', 'X'))['0']).toBeCloseTo(1)
  })

  it('Experiment 4: only 00 and 11', () => {
    const p = theoryProbabilities(setupOf('plus', 'Z', 'Z'))
    expect(p['00']).toBeCloseTo(0.5)
    expect(p['11']).toBeCloseTo(0.5)
    expect(p['01']).toBeCloseTo(0)
    expect(p['10']).toBeCloseTo(0)
  })

  it('Experiment 5: c₀ is always 0, c₁ is random (keys 00 and 10)', () => {
    const p = theoryProbabilities(setupOf('zero', 'Z', 'X'))
    expect(p['00']).toBeCloseTo(0.5)
    expect(p['10']).toBeCloseTo(0.5)
    expect(p['01']).toBeCloseTo(0)
    expect(p['11']).toBeCloseTo(0)
  })

  it('sums to 1 for every state and basis pair', () => {
    const states = [
      'zero',
      'one',
      'plus',
      'minus',
      'plusI',
      'minusI',
      'ry',
    ] as const
    for (const state of states) {
      for (const m1 of Object.keys(BASES) as (keyof typeof BASES)[]) {
        for (const m2 of [null, 'Z', 'X', 'Y'] as const) {
          const total = Object.values(
            theoryProbabilities(setupOf(state, m1, m2, 37)),
          ).reduce((a, b) => a + b, 0)
          expect(total).toBeCloseTo(1)
        }
      }
    }
  })
})
