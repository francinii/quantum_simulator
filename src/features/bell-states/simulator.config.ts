import { MigrationPending } from '@/shared/components/MigrationPending'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { BellStatesPreview } from './BellStatesPreview'

export const simulatorConfig: SimulatorConfig = {
  id: 'bell-states',
  order: 2,
  title: 'The 4 Bell States: Entanglement in Action',
  description:
    'Watch the wavepacket propagate through X, Hadamard and CNOT gates in real time, and observe how non-local correlations are created.',
  chip: '|Φ⁺⟩ |Ψ⁻⟩',
  category: 'Entanglement',
  accent: 'purple',
  Preview: BellStatesPreview,
  Component: MigrationPending,
}
