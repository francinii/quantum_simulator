import { lazy } from 'react'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { MatrixAlgebraPreview } from './MatrixAlgebraPreview'

const MatrixAlgebraSimulator = lazy(() =>
  import('./components/MatrixAlgebraSimulator').then((module) => ({
    default: module.MatrixAlgebraSimulator,
  })),
)

export const simulatorConfig: SimulatorConfig = {
  id: 'matrix-algebra',
  order: 1,
  chip: 'H ⊗ H',
  accent: 'blue',
  Preview: MatrixAlgebraPreview,
  Component: MatrixAlgebraSimulator,
}
