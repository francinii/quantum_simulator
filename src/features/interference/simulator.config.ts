import { MigrationPending } from '@/shared/components/MigrationPending'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { InterferencePreview } from './InterferencePreview'

export const simulatorConfig: SimulatorConfig = {
  id: 'interference',
  order: 4,
  title: 'Wave Interference: Constructive vs. Destructive',
  description:
    'Shift the phase between two waves and watch them reinforce or cancel each other, with a live phasor diagram and resultant amplitude.',
  chip: 'Δφ',
  category: 'Interference',
  accent: 'emerald',
  Preview: InterferencePreview,
  Component: MigrationPending,
}
