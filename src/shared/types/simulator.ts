import type { ComponentType, LazyExoticComponent } from 'react'

export type Accent = 'blue' | 'purple' | 'pink' | 'emerald' | 'sky'

export interface SimulatorProps {
  simulator: SimulatorConfig
}

export type SimulatorComponent =
  | ComponentType<SimulatorProps>
  | LazyExoticComponent<ComponentType<SimulatorProps>>

export interface SimulatorConfig {
  id: string
  order: number
  title: string
  description: string
  chip: string
  category: string
  accent: Accent
  Preview: ComponentType
  Component: SimulatorComponent
}
