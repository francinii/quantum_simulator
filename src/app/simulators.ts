import type { SimulatorConfig } from '@/shared/types/simulator'

interface ConfigModule {
  simulatorConfig: SimulatorConfig
}

export function collectSimulators(
  modules: Record<string, ConfigModule>,
): SimulatorConfig[] {
  return Object.values(modules)
    .map((m) => m.simulatorConfig)
    .sort((a, b) => a.order - b.order)
}

export const SIMULATORS = collectSimulators(
  import.meta.glob<ConfigModule>('../features/*/simulator.config.ts', {
    eager: true,
  }),
)
