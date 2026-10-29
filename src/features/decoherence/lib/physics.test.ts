import {
  CYCLE_SECONDS,
  decayAt,
  FULL_LENGTH,
  purityText,
  purityTier,
  stateAt,
} from './physics'

describe('decayAt', () => {
  it('is 1 at the start of the cycle', () => {
    expect(decayAt(0, 1.2)).toBe(1)
  })

  it('follows e^(−3.5·rate·t/5)', () => {
    expect(decayAt(2.5, 1)).toBeCloseTo(Math.exp(-3.5 * 0.5))
    expect(decayAt(1, 2)).toBeCloseTo(Math.exp(-3.5 * 0.2 * 2))
  })

  it('approaches e^(−3.5·rate) just before the cycle ends', () => {
    expect(decayAt(CYCLE_SECONDS - 1e-9, 1.2)).toBeCloseTo(
      Math.exp(-3.5 * 1.2),
      5,
    )
  })

  it('returns to 1 when the cycle wraps at 5 seconds', () => {
    expect(decayAt(CYCLE_SECONDS, 1.2)).toBe(1)
    expect(decayAt(CYCLE_SECONDS + 1, 1.2)).toBeCloseTo(decayAt(1, 1.2))
    expect(decayAt(3 * CYCLE_SECONDS + 2, 0.5)).toBeCloseTo(decayAt(2, 0.5))
  })

  it('decays faster with a higher rate and never goes below 0', () => {
    expect(decayAt(2, 3)).toBeLessThan(decayAt(2, 0.2))
    expect(decayAt(4.99, 3)).toBeGreaterThan(0)
  })
})

describe('dephasing (T₂)', () => {
  it('starts as a pure state of full length on the equator', () => {
    const s = stateAt(0, 'dephasing', 1.2)
    expect(s.x).toBeCloseTo(FULL_LENGTH)
    expect(s.y).toBeCloseTo(0)
    expect(s.z).toBeCloseTo(0)
    expect(s.purityPercent).toBe(100)
    expect(s.tier).toBe('pure')
  })

  it('keeps the XY radius at 1.18·decay, with only a tiny Z wobble on top', () => {
    for (let t = 0; t < CYCLE_SECONDS; t += 0.37) {
      const s = stateAt(t, 'dephasing', 1.2)
      expect(Math.abs(s.z)).toBeLessThanOrEqual(0.02 + 1e-12)
      expect(Math.hypot(s.x, s.y)).toBeCloseTo(FULL_LENGTH * s.decay, 9)
      // The total length is the XY radius plus the wobble, so it is never shorter than the radius.
      expect(s.length).toBeCloseTo(Math.hypot(FULL_LENGTH * s.decay, s.z), 9)
      expect(s.length - FULL_LENGTH * s.decay).toBeLessThanOrEqual(0.02)
    }
  })

  it('precesses around Z at 4 rad/s', () => {
    const t = Math.PI / 8
    const s = stateAt(t, 'dephasing', 0.2)
    expect(Math.atan2(s.y, s.x)).toBeCloseTo(4 * t)
  })

  it('shrinks toward the center and ends as a statistical mixture', () => {
    const s = stateAt(CYCLE_SECONDS - 0.01, 'dephasing', 3)
    expect(s.length).toBeLessThan(0.05)
    expect(s.tier).toBe('mixture')
  })
})

describe('relaxation (T₁)', () => {
  it('starts like dephasing: full length on the equator', () => {
    const s = stateAt(0, 'relaxation', 1.2)
    expect(s.x).toBeCloseTo(FULL_LENGTH)
    expect(s.z).toBeCloseTo(0)
  })

  it('rises toward |0⟩ while the XY radius shrinks', () => {
    const early = stateAt(0.5, 'relaxation', 1.2)
    const late = stateAt(4.9, 'relaxation', 1.2)
    expect(late.z).toBeGreaterThan(early.z)
    expect(Math.hypot(late.x, late.y)).toBeLessThan(
      Math.hypot(early.x, early.y),
    )
  })

  it('ends with z near 1.18·0.95 for a strong rate', () => {
    const s = stateAt(CYCLE_SECONDS - 0.01, 'relaxation', 3)
    expect(s.z).toBeCloseTo(FULL_LENGTH * 0.95, 1)
    expect(s.populationZ).toBeCloseTo(0.95, 1)
  })

  it('is not monotonic in length: it dips below both ends of the cycle', () => {
    const lengths: number[] = []
    for (let t = 0; t < CYCLE_SECONDS; t += 0.01)
      lengths.push(stateAt(t, 'relaxation', 1.2).length)
    const lowest = Math.min(...lengths)
    expect(lowest).toBeLessThan(lengths[0])
    expect(lowest).toBeLessThan(lengths.at(-1) as number)
    // The dip is what makes the badge read "Partial Superposition" mid-cycle even though the qubit relaxes.
    expect(lowest / FULL_LENGTH).toBeLessThan(0.75)
  })
})

describe('purity tiers and readouts', () => {
  it.each([
    [100, 'pure'],
    [71, 'pure'],
    [70, 'partial'],
    [36, 'partial'],
    [35, 'mixture'],
    [0, 'mixture'],
  ] as const)('%i%% is %s', (percent, tier) => {
    expect(purityTier(percent)).toBe(tier)
  })

  it('writes the badge text with the tier name and the rounded percent', () => {
    expect(purityText(stateAt(0, 'dephasing', 1.2))).toBe('Pure State: 100%')
    const middle = stateAt(2.2, 'dephasing', 1.2)
    expect(purityText(middle)).toMatch(
      /^(Pure State|Partial Superposition|Statistical Mixture): \d+%$/,
    )
  })

  it('divides readouts by 1.18, with absolute values for X and Y but not Z', () => {
    const s = stateAt(0, 'dephasing', 1.2)
    expect(s.coherenceX).toBeCloseTo(1)
    expect(s.phaseY).toBeCloseTo(0)

    const negative = stateAt(Math.PI / 4 + 0.001, 'dephasing', 0.2)
    expect(negative.x).toBeLessThan(0)
    expect(negative.coherenceX).toBeGreaterThan(0)

    const flipped = stateAt(0.2, 'dephasing', 1.2)
    expect(flipped.populationZ).toBeCloseTo(flipped.z / FULL_LENGTH)
    const below = stateAt(4 * Math.PI * 0 + 4.0, 'dephasing', 1.2)
    expect(below.populationZ).toBeCloseTo(below.z / FULL_LENGTH)
  })
})
