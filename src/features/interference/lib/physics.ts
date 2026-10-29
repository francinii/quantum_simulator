export type InterferenceKind =
  | 'none'
  | 'fully-constructive'
  | 'fully-destructive'
  | 'mostly-constructive'
  | 'mostly-destructive'

export interface InterferenceInfo {
  kind: InterferenceKind
  text: string
  hint: string
}

const FULL_THRESHOLD = 0.97
const EQUAL_AMPLITUDE_TOLERANCE = 0.01

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

export function resultantAmplitude(a: number, b: number, phaseDeg: number) {
  const phi = toRadians(phaseDeg)
  return Math.sqrt(Math.max(0, a * a + b * b + 2 * a * b * Math.cos(phi)))
}

export function relativeIntensity(a: number, b: number, phaseDeg: number) {
  const max = a + b
  if (max <= 0) return 0
  const r = resultantAmplitude(a, b, phaseDeg)
  return ((r * r) / (max * max)) * 100
}

export function classifyInterference(
  a: number,
  b: number,
  phaseDeg: number,
): InterferenceInfo {
  const c = Math.cos(toRadians(phaseDeg))

  if (a === 0 || b === 0) {
    return {
      kind: 'none',
      text: 'No Interference',
      hint: 'Only one wave is present.',
    }
  }
  if (c > FULL_THRESHOLD) {
    return {
      kind: 'fully-constructive',
      text: 'Fully Constructive',
      hint: 'Crests meet crests: the waves reinforce each other.',
    }
  }
  if (c < -FULL_THRESHOLD) {
    const equal = Math.abs(a - b) < EQUAL_AMPLITUDE_TOLERANCE
    return {
      kind: 'fully-destructive',
      text: 'Fully Destructive',
      hint: equal
        ? 'Crests meet troughs: the waves cancel completely.'
        : 'Crests meet troughs, but unequal amplitudes leave a residual wave.',
    }
  }
  if (c > 0) {
    return {
      kind: 'mostly-constructive',
      text: 'Mostly Constructive',
      hint: 'Partially aligned: the result is larger than each wave alone.',
    }
  }
  return {
    kind: 'mostly-destructive',
    text: 'Mostly Destructive',
    hint: 'Partially opposed: the waves mostly cancel each other.',
  }
}
