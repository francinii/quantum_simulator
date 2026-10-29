export type Mechanism = 'dephasing' | 'relaxation'

export const CYCLE_SECONDS = 5
// Length of the state vector at full coherence, a little inside the unit sphere drawn at 1.2.
export const FULL_LENGTH = 1.18
export const DEFAULT_RATE = 1.2

const DECAY_STRENGTH = 3.5
const PRECESSION_RATE = 4
const WOBBLE_AMPLITUDE = 0.02
const WOBBLE_RATE = 2
const RELAXATION_REACH = 0.95

export type PurityTier = 'pure' | 'partial' | 'mixture'

export interface DecoherenceState {
  x: number
  y: number
  z: number
  // 1 at the start of a cycle, shrinking toward 0.
  decay: number
  length: number
  purityPercent: number
  tier: PurityTier
  // Readout cards: |⟨X⟩|, |⟨Y⟩| and ⟨Z⟩ as fractions of the full length.
  coherenceX: number
  phaseY: number
  populationZ: number
}

export function decayAt(timeSeconds: number, rate: number) {
  const normalizedTime = (timeSeconds % CYCLE_SECONDS) / CYCLE_SECONDS
  return Math.exp(-normalizedTime * DECAY_STRENGTH * rate)
}

export function purityTier(purityPercent: number): PurityTier {
  if (purityPercent > 70) return 'pure'
  if (purityPercent > 35) return 'partial'
  return 'mixture'
}

export function stateAt(
  timeSeconds: number,
  mechanism: Mechanism,
  rate: number,
): DecoherenceState {
  const decay = decayAt(timeSeconds, rate)
  const larmor = timeSeconds * PRECESSION_RATE
  const radius = FULL_LENGTH * decay

  const x = radius * Math.cos(larmor)
  const y = radius * Math.sin(larmor)
  const z =
    mechanism === 'dephasing'
      ? WOBBLE_AMPLITUDE * Math.sin(timeSeconds * WOBBLE_RATE)
      : FULL_LENGTH * (1 - decay) * RELAXATION_REACH

  const length = Math.hypot(x, y, z)
  const purityPercent = Math.round((length / FULL_LENGTH) * 100)

  return {
    x,
    y,
    z,
    decay,
    length,
    purityPercent,
    tier: purityTier(purityPercent),
    coherenceX: Math.abs(x / FULL_LENGTH),
    phaseY: Math.abs(y / FULL_LENGTH),
    populationZ: z / FULL_LENGTH,
  }
}

export const PURITY_LABELS: Record<PurityTier, string> = {
  pure: 'Pure State',
  partial: 'Partial Superposition',
  mixture: 'Statistical Mixture',
}

export const purityText = (state: DecoherenceState) =>
  `${PURITY_LABELS[state.tier]}: ${state.purityPercent}%`
