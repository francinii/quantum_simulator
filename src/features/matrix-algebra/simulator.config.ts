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
  title: 'Matrix Algebra vs. Dirac Notation',
  description:
    'Explore step by step the Kronecker product, the operator H ⊗ H, and its equivalence in bra-ket notation, side by side.',
  chip: 'H ⊗ H',
  category: 'Linear Algebra',
  accent: 'blue',
  Preview: MatrixAlgebraPreview,
  Component: MatrixAlgebraSimulator,
}
