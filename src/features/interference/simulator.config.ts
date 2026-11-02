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
  chip: 'Δφ',
  accent: 'emerald',
  Preview: InterferencePreview,
  Component: InterferenceSimulator,
}
