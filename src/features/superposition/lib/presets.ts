import type { Accent } from '@/shared/types/simulator'

export interface Preset {
  label: string
  title: string
  detail: string
  theta: number
  phi: number
  accent: Accent
}

export const PRESETS: Preset[] = [
  {
    label: 'Basis',
    title: '|0⟩',
    detail: 'P(0) = 100%',
    theta: 0,
    phi: 0,
    accent: 'blue',
  },
  {
    label: 'Basis',
    title: '|1⟩',
    detail: 'P(1) = 100%',
    theta: 180,
    phi: 0,
    accent: 'pink',
  },
  {
    label: 'Superposition',
    title: '|+⟩',
    detail: '50% / 50%',
    theta: 90,
    phi: 0,
    accent: 'purple',
  },
  {
    label: 'Superposition',
    title: '|−⟩',
    detail: '50% / 50%',
    theta: 90,
    phi: 180,
    accent: 'purple',
  },
  {
    label: 'Complex Phase',
    title: '|+i⟩',
    detail: '50% / 50%',
    theta: 90,
    phi: 90,
    accent: 'sky',
  },
  {
    label: 'Unequal',
    title: 'θ = 60°',
    detail: '75% / 25%',
    theta: 60,
    phi: 0,
    accent: 'emerald',
  },
]

export const INITIAL_PRESET = 2

export function findActivePreset(theta: number, phi: number) {
  return PRESETS.findIndex(
    (p) => p.theta === Math.round(theta) && p.phi === Math.round(phi),
  )
}
