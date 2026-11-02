import { lazy } from 'react'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { SuperpositionPreview } from './SuperpositionPreview'

const SuperpositionSimulator = lazy(() =>
  import('./components/SuperpositionSimulator').then((module) => ({
    default: module.SuperpositionSimulator,
  })),
)

export const simulatorConfig: SimulatorConfig = {
  id: 'superposition',
  order: 5,
  chip: 'α|0⟩ + β|1⟩',
  accent: 'sky',
  Preview: SuperpositionPreview,
  Component: SuperpositionSimulator,
}
