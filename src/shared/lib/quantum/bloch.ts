import { fromPolar, type Complex } from './complex'

export type Outcome = 0 | 1

export interface BlochVector {
  x: number
  y: number
  z: number
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

// |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩
export function qubitAmplitudes(
  thetaDeg: number,
  phiDeg: number,
): [alpha: Complex, beta: Complex] {
  const half = toRadians(thetaDeg) / 2
  return [
    fromPolar(Math.cos(half), 0),
    fromPolar(Math.sin(half), toRadians(phiDeg)),
  ]
}

// Born's rule. Only θ matters: the relative phase φ never changes these probabilities.
export function outcomeProbabilities(
  thetaDeg: number,
): [p0: number, p1: number] {
  const p0 = Math.cos(toRadians(thetaDeg) / 2) ** 2
  return [p0, 1 - p0]
}

export function blochVector(thetaDeg: number, phiDeg: number): BlochVector {
  const theta = toRadians(thetaDeg)
  const phi = toRadians(phiDeg)
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  }
}

export function sampleOutcome(
  p0: number,
  random: () => number = Math.random,
): Outcome {
  return random() < p0 ? 0 : 1
}
