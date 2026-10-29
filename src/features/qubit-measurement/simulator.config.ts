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
  title: 'Qubit Measurement: Collapse, Bases & Statistics',
  description:
    "Measure in the Z, X or Y basis, chain two measurements, watch the state collapse, and compare Qiskit-style counts with Born's rule.",
  chip: 'qc.measure()',
  category: 'Measurement',
  accent: 'purple',
  Preview: QubitMeasurementPreview,
  Component: QubitMeasurementSimulator,
}
