import { lazy } from 'react'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { DecoherencePreview } from './DecoherencePreview'

const DecoherenceSimulator = lazy(() =>
  import('./components/DecoherenceSimulator').then((module) => ({
    default: module.DecoherenceSimulator,
  })),
)

export const simulatorConfig: SimulatorConfig = {
  id: 'decoherence',
  order: 3,
  chip: 'ρ(t)',
  accent: 'pink',
  Preview: DecoherencePreview,
  Component: DecoherenceSimulator,
}
