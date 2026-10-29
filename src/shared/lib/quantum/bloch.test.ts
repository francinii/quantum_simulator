import { abs } from './complex'
import {
  blochVector,
  outcomeProbabilities,
  qubitAmplitudes,
  sampleOutcome,
} from './bloch'

const SQRT_HALF = Math.SQRT1_2

describe('outcomeProbabilities', () => {
  it.each([
    [0, 1, 0],
    [90, 0.5, 0.5],
    [180, 0, 1],
    [60, 0.75, 0.25],
  ])('θ = %i° gives P(0) = %f and P(1) = %f', (theta, p0, p1) => {
    const [a, b] = outcomeProbabilities(theta)
    expect(a).toBeCloseTo(p0)
    expect(b).toBeCloseTo(p1)
  })

  it('is independent of the relative phase', () => {
    const [p0] = outcomeProbabilities(60)
    const [alpha, beta] = qubitAmplitudes(60, 217)
    expect(abs(alpha) ** 2).toBeCloseTo(p0)
    expect(abs(beta) ** 2).toBeCloseTo(1 - p0)
  })
})

describe('qubitAmplitudes', () => {
  it('keeps |α|² + |β|² = 1 for any state', () => {
    for (const theta of [0, 17, 60, 90, 133, 180]) {
      for (const phi of [0, 45, 90, 180, 300]) {
        const [alpha, beta] = qubitAmplitudes(theta, phi)
        expect(abs(alpha) ** 2 + abs(beta) ** 2).toBeCloseTo(1)
      }
    }
  })

  it('gives |0⟩ and |1⟩ at the poles', () => {
    const [a0, b0] = qubitAmplitudes(0, 0)
    expect([abs(a0), abs(b0)]).toEqual([1, 0])
    const [a1, b1] = qubitAmplitudes(180, 0)
    expect(abs(a1)).toBeCloseTo(0)
    expect(abs(b1)).toBeCloseTo(1)
  })

  it('gives |+⟩ = (|0⟩ + |1⟩)/√2', () => {
    const [alpha, beta] = qubitAmplitudes(90, 0)
    expect(alpha.re).toBeCloseTo(SQRT_HALF)
    expect(beta.re).toBeCloseTo(SQRT_HALF)
    expect(beta.im).toBeCloseTo(0)
  })

  it('gives |−⟩ = (|0⟩ − |1⟩)/√2', () => {
    const [alpha, beta] = qubitAmplitudes(90, 180)
    expect(alpha.re).toBeCloseTo(SQRT_HALF)
    expect(beta.re).toBeCloseTo(-SQRT_HALF)
    expect(beta.im).toBeCloseTo(0)
  })

  it('gives |+i⟩ = (|0⟩ + i|1⟩)/√2', () => {
    const [alpha, beta] = qubitAmplitudes(90, 90)
    expect(alpha.re).toBeCloseTo(SQRT_HALF)
    expect(beta.re).toBeCloseTo(0)
    expect(beta.im).toBeCloseTo(SQRT_HALF)
  })
})

describe('blochVector', () => {
  it.each([
    ['|0⟩', 0, 0, { x: 0, y: 0, z: 1 }],
    ['|1⟩', 180, 0, { x: 0, y: 0, z: -1 }],
    ['|+⟩', 90, 0, { x: 1, y: 0, z: 0 }],
    ['|−⟩', 90, 180, { x: -1, y: 0, z: 0 }],
    ['|+i⟩', 90, 90, { x: 0, y: 1, z: 0 }],
  ])('points %s along its axis', (_name, theta, phi, expected) => {
    const v = blochVector(theta, phi)
    expect(v.x).toBeCloseTo(expected.x)
    expect(v.y).toBeCloseTo(expected.y)
    expect(v.z).toBeCloseTo(expected.z)
  })

  it('always has unit length', () => {
    const { x, y, z } = blochVector(37, 211)
    expect(Math.hypot(x, y, z)).toBeCloseTo(1)
  })
})

describe('sampleOutcome', () => {
  it('returns 0 below P(0) and 1 at or above it', () => {
    expect(sampleOutcome(0.75, () => 0.74)).toBe(0)
    expect(sampleOutcome(0.75, () => 0.75)).toBe(1)
    expect(sampleOutcome(0.75, () => 0.99)).toBe(1)
  })

  it('always returns the certain outcome at the poles', () => {
    expect(sampleOutcome(1, () => 0.999999)).toBe(0)
    expect(sampleOutcome(0, () => 0)).toBe(1)
  })

  it('reproduces the theoretical probability over 10,000 shots', () => {
    // Deterministic LCG so the test never flakes.
    let seed = 12345
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    const [p0] = outcomeProbabilities(60)
    let zeros = 0
    for (let i = 0; i < 10_000; i++)
      if (sampleOutcome(p0, random) === 0) zeros++

    expect(zeros / 10_000).toBeCloseTo(0.75, 1)
    expect(Math.abs(zeros / 10_000 - 0.75)).toBeLessThan(0.02)
  })
})
