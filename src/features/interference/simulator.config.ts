import { lazy } from 'react'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { InterferencePreview } from './InterferencePreview'

const InterferenceSimulator = lazy(() =>
  import('./components/InterferenceSimulator').then((module) => ({
    default: module.InterferenceSimulator,
  })),
)

export const simulatorConfig: SimulatorConfig = {
  id: 'interference',
  order: 4,
  title: 'Wave Interference: Constructive vs. Destructive',
  description:
    'Shift the phase between two waves and watch them reinforce or cancel each other, with a live phasor diagram and resultant amplitude.',
  chip: 'Δφ',
  category: 'Interference',
  accent: 'emerald',
  Preview: InterferencePreview,
  Component: InterferenceSimulator,
}
