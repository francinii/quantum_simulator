import { sampleOutcome, type BlochVector, type Outcome } from './bloch'

export const AXES = {
  Z: { x: 0, y: 0, z: 1 },
  X: { x: 1, y: 0, z: 0 },
  Y: { x: 0, y: 1, z: 0 },
} as const satisfies Record<string, BlochVector>

export const dot = (a: BlochVector, b: BlochVector) =>
  a.x * b.x + a.y * b.y + a.z * b.z

export const scale = (v: BlochVector, factor: number): BlochVector => ({
  x: v.x * factor,
  y: v.y * factor,
  z: v.z * factor,
})

export function normalize(v: BlochVector, fallback: BlochVector): BlochVector {
  const length = Math.hypot(v.x, v.y, v.z)
  return length < 1e-3 ? fallback : scale(v, 1 / length)
}

// Probability of the "+" end of the axis (outcome 0), by Born's rule.
export const probabilityOfPlus = (state: BlochVector, axis: BlochVector) =>
  Math.min(1, Math.max(0, (1 + dot(state, axis)) / 2))

// A measurement leaves the qubit at the end of the axis it reported.
export const collapseTarget = (axis: BlochVector, bit: Outcome) =>
  scale(axis, bit === 0 ? 1 : -1)

export interface OutcomeProbability {
  bits: Outcome[]
  probability: number
}

// One entry per possible result, bits in measurement order (c₀ first).
export function outcomeDistribution(
  state: BlochVector,
  firstAxis: BlochVector,
  secondAxis: BlochVector | null,
): OutcomeProbability[] {
  const pPlus = probabilityOfPlus(state, firstAxis)
  const firstBits: Outcome[] = [0, 1]

  return firstBits.flatMap((first) => {
    const pFirst = first === 0 ? pPlus : 1 - pPlus
    if (!secondAxis) return [{ bits: [first], probability: pFirst }]

    const qPlus = probabilityOfPlus(
      collapseTarget(firstAxis, first),
      secondAxis,
    )
    return [
      { bits: [first, 0 as Outcome], probability: pFirst * qPlus },
      { bits: [first, 1 as Outcome], probability: pFirst * (1 - qPlus) },
    ]
  })
}

export interface ShotResult {
  first: Outcome
  second: Outcome | null
}

export function sampleShot(
  state: BlochVector,
  firstAxis: BlochVector,
  secondAxis: BlochVector | null,
  random: () => number = Math.random,
): ShotResult {
  const first = sampleOutcome(probabilityOfPlus(state, firstAxis), random)
  if (!secondAxis) return { first, second: null }

  const afterFirst = collapseTarget(firstAxis, first)
  const second = sampleOutcome(
    probabilityOfPlus(afterFirst, secondAxis),
    random,
  )
  return { first, second }
}
