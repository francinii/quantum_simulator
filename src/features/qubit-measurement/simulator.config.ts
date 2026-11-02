import { lazy } from 'react'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { QubitMeasurementPreview } from './QubitMeasurementPreview'

const QubitMeasurementSimulator = lazy(() =>
  import('./components/QubitMeasurementSimulator').then((module) => ({
    default: module.QubitMeasurementSimulator,
  })),
)

export const simulatorConfig: SimulatorConfig = {
  id: 'qubit-measurement',
  order: 6,
  chip: 'qc.measure()',
  accent: 'purple',
  Preview: QubitMeasurementPreview,
  Component: QubitMeasurementSimulator,
}
