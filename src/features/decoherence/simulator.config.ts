import { MigrationPending } from '@/shared/components/MigrationPending'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { DecoherencePreview } from './DecoherencePreview'

export const simulatorConfig: SimulatorConfig = {
  id: 'decoherence',
  order: 3,
  title: 'Quantum Decoherence',
  description:
    'See how interaction with the environment destroys superposition, shrinking the pure state vector into a classical statistical mixture.',
  chip: 'ρ(t)',
  category: 'Open Systems',
  accent: 'pink',
  Preview: DecoherencePreview,
  Component: MigrationPending,
}
