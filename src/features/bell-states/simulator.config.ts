import { lazy } from 'react'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { BellStatesPreview } from './BellStatesPreview'

const BellStatesSimulator = lazy(() =>
  import('./components/BellStatesSimulator').then((module) => ({
    default: module.BellStatesSimulator,
  })),
)

export const simulatorConfig: SimulatorConfig = {
  id: 'bell-states',
  order: 2,
  chip: '|Φ⁺⟩ |Ψ⁻⟩',
  accent: 'purple',
  Preview: BellStatesPreview,
  Component: BellStatesSimulator,
}
