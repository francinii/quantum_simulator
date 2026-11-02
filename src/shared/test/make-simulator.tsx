import i18next from 'i18next'
import type { SimulatorConfig } from '@/shared/types/simulator'

interface FakeText {
  title?: string
  description?: string
  category?: string
}

// Feature texts live in an i18n namespace named after the id, so the fake registers its own.
export function makeSimulator(
  overrides: Partial<SimulatorConfig> & FakeText = {},
): SimulatorConfig {
  const {
    title = 'Fake Sim',
    description = 'Only for tests',
    category = 'Testing',
    ...config
  } = overrides
  const simulator: SimulatorConfig = {
    id: 'fake',
    order: 1,
    chip: 'chip',
    accent: 'blue',
    Preview: () => <svg data-testid="preview" />,
    Component: () => <p>fake body</p>,
    ...config,
  }
  i18next.addResourceBundle(
    'en',
    simulator.id,
    { title, description, category },
    true,
    true,
  )
  return simulator
}
