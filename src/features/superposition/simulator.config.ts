import { MigrationPending } from '@/shared/components/MigrationPending'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { SuperpositionPreview } from './SuperpositionPreview'

export const simulatorConfig: SimulatorConfig = {
  id: 'superposition',
  order: 5,
  title: 'Quantum Superposition & Probabilities',
  description:
    'Move a qubit on the Bloch sphere, see how amplitudes become probabilities, and measure it hundreds of times to watch the statistics emerge.',
  chip: 'α|0⟩ + β|1⟩',
  category: "Born's Rule",
  accent: 'sky',
  Preview: SuperpositionPreview,
  Component: MigrationPending,
}
