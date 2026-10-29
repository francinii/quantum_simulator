import type { Setup } from './setup'
import { firstResultIsCertain, isCertain, theoryRows } from './theory'

const setupOf = (
  state: Setup['state'],
  m1: Setup['m1'],
  m2: Setup['m2'] = null,
): Setup => ({ state, m1, m2, theta: 60 })

describe('theory rows', () => {
  it('has one row for a single measurement, with 1-decimal percentages', () => {
    const rows = theoryRows(setupOf('plus', 'Z'))
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      prefix: 'M1 (Z):',
      plusLabel: '|0⟩',
      minusLabel: '|1⟩',
      decimals: 1,
    })
    expect(rows[0].pPlus).toBeCloseTo(0.5)
    expect(rows[0].pMinus).toBeCloseTo(0.5)
  })

  it('adds one row per first result when there are two measurements', () => {
    const rows = theoryRows(setupOf('zero', 'Z', 'X'))
    expect(rows.map((r) => r.prefix)).toEqual([
      'M1 (Z):',
      'If M1 gave |0⟩, then M2 (X):',
      'If M1 gave |1⟩, then M2 (X):',
    ])
    expect(rows[1].decimals).toBe(0)
    expect(rows[1].pPlus).toBeCloseTo(0.5)
    expect(rows[2].pPlus).toBeCloseTo(0.5)
  })

  it('shows a repeated Z measurement as certain', () => {
    const [, ifZero, ifOne] = theoryRows(setupOf('plus', 'Z', 'Z'))
    expect(ifZero.pPlus).toBeCloseTo(1)
    expect(ifOne.pPlus).toBeCloseTo(0)
  })
})

describe('certainty note', () => {
  it('treats states on the measurement axis as certain', () => {
    expect(firstResultIsCertain(setupOf('zero', 'Z'))).toBe(true)
    expect(firstResultIsCertain(setupOf('plus', 'X'))).toBe(true)
    expect(firstResultIsCertain(setupOf('minusI', 'Y'))).toBe(true)
  })

  it('treats states off the axis as random', () => {
    expect(firstResultIsCertain(setupOf('plus', 'Z'))).toBe(false)
    expect(firstResultIsCertain(setupOf('zero', 'X'))).toBe(false)
  })

  it('uses a 0.1% margin', () => {
    expect(isCertain(0.9995)).toBe(true)
    expect(isCertain(0.0005)).toBe(true)
    expect(isCertain(0.998)).toBe(false)
  })
})
