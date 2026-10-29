import type { Accent } from '@/shared/types/simulator'

export interface Preset {
  name: string
  detail: string
  phase: number
  a: number
  b: number
  accent: Accent
}

export const PRESETS: Preset[] = [
  {
    name: 'Constructive',
    detail: 'Δφ = 0°',
    phase: 0,
    a: 1,
    b: 1,
    accent: 'emerald',
  },
  {
    name: 'Partial',
    detail: 'Δφ = 90°',
    phase: 90,
    a: 1,
    b: 1,
    accent: 'blue',
  },
  {
    name: 'Destructive',
    detail: 'Δφ = 180°',
    phase: 180,
    a: 1,
    b: 1,
    accent: 'pink',
  },
  {
    name: 'Unequal Amplitudes',
    detail: 'A = 1.0, B = 0.5, Δφ = 180°',
    phase: 180,
    a: 1,
    b: 0.5,
    accent: 'purple',
  },
]

export function findActivePreset(phase: number, a: number, b: number) {
  return PRESETS.findIndex(
    (p) => p.phase === Math.round(phase) && p.a === a && p.b === b,
  )
}
