import {
  classifyInterference,
  relativeIntensity,
  resultantAmplitude,
} from './physics'

describe('resultantAmplitude', () => {
  it('adds amplitudes when in phase', () => {
    expect(resultantAmplitude(1, 1, 0)).toBeCloseTo(2)
    expect(resultantAmplitude(1, 0.5, 360)).toBeCloseTo(1.5)
  })

  it('subtracts amplitudes when opposed', () => {
    expect(resultantAmplitude(1, 1, 180)).toBeCloseTo(0)
    expect(resultantAmplitude(1, 0.5, 180)).toBeCloseTo(0.5)
  })

  it('combines in quadrature at 90 degrees', () => {
    expect(resultantAmplitude(1, 1, 90)).toBeCloseTo(Math.SQRT2)
    expect(resultantAmplitude(3, 4, 90)).toBeCloseTo(5)
  })

  it('never returns NaN from rounding below zero', () => {
    expect(resultantAmplitude(0.3, 0.3, 180)).not.toBeNaN()
  })
})

describe('relativeIntensity', () => {
  it('is 100% when fully constructive and 0% when fully destructive with equal amplitudes', () => {
    expect(relativeIntensity(1, 1, 0)).toBeCloseTo(100)
    expect(relativeIntensity(1, 1, 180)).toBeCloseTo(0)
  })

  it('is 50% at 90 degrees with equal amplitudes', () => {
    expect(relativeIntensity(1, 1, 90)).toBeCloseTo(50)
  })

  it('is 0 when both amplitudes are zero', () => {
    expect(relativeIntensity(0, 0, 45)).toBe(0)
  })
})

describe('classifyInterference', () => {
  it('reports no interference when a wave is missing', () => {
    expect(classifyInterference(0, 1, 0).kind).toBe('none')
    expect(classifyInterference(1, 0, 180).kind).toBe('none')
  })

  it('switches to fully constructive just inside the 0.97 threshold', () => {
    expect(classifyInterference(1, 1, 14).kind).toBe('fully-constructive')
    expect(classifyInterference(1, 1, 15).kind).toBe('mostly-constructive')
  })

  it('switches to fully destructive just inside the -0.97 threshold', () => {
    expect(classifyInterference(1, 1, 166).kind).toBe('fully-destructive')
    expect(classifyInterference(1, 1, 165).kind).toBe('mostly-destructive')
  })

  it('splits the middle range by the sign of the cosine', () => {
    expect(classifyInterference(1, 1, 80).kind).toBe('mostly-constructive')
    expect(classifyInterference(1, 1, 100).kind).toBe('mostly-destructive')
  })

  it('explains full cancellation only when amplitudes are equal', () => {
    expect(classifyInterference(1, 1, 180).hint).toContain('cancel completely')
    expect(classifyInterference(1, 0.5, 180).hint).toContain('residual wave')
  })
})
