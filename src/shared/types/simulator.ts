import type { ComponentType } from 'react'

export type Accent = 'blue' | 'purple' | 'pink' | 'emerald' | 'sky'

export interface SimulatorProps {
  simulator: SimulatorConfig
}

export interface SimulatorConfig {
  id: string
  order: number
  title: string
  description: string
  chip: string
  category: string
  accent: Accent
  Preview: ComponentType
  Component: ComponentType<SimulatorProps>
}
