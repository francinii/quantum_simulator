import type { SimulatorConfig } from '@/shared/types/simulator'

export function makeSimulator(
  overrides: Partial<SimulatorConfig> = {},
): SimulatorConfig {
  return {
    id: 'fake',
    order: 1,
    title: 'Fake Sim',
    description: 'Only for tests',
    chip: 'chip',
    category: 'Testing',
    accent: 'blue',
    Preview: () => <svg data-testid="preview" />,
    Component: () => <p>fake body</p>,
    ...overrides,
  }
}
