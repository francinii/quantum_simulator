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
  // Title, description and category live in the feature's i18n namespace (named after the id).
  chip: string
  accent: Accent
  Preview: ComponentType
  Component: SimulatorComponent
}
