import { render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { makeSimulator } from '@/shared/test/make-simulator'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { collectSimulators, SIMULATORS } from './simulators'
import { createTestRouter } from './router'

const fake = makeSimulator()

function renderAt(path: string, simulators: SimulatorConfig[] = [fake]) {
  render(<RouterProvider router={createTestRouter(simulators, [path])} />)
}

describe('app routes', () => {
  it('renders home with the gallery header', () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Quantum Lab: Interactive Simulations',
      }),
    ).toBeInTheDocument()
  })

  it('renders not-found for unknown paths', () => {
    renderAt('/nope')
    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })

  it('renders not-found for unknown simulator ids', () => {
    renderAt('/simulators/missing')
    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })

  it('serves a registered simulator without router edits', () => {
    renderAt('/simulators/fake')
    expect(screen.getByText('fake body')).toBeInTheDocument()
  })
})

describe('simulator discovery', () => {
  it('finds every feature config via glob, in pedagogical order', () => {
    expect(SIMULATORS.map((s) => s.id)).toEqual([
      'matrix-algebra',
      'bell-states',
      'decoherence',
      'interference',
      'superposition',
      'qubit-measurement',
    ])
  })

  it('sorts collected simulators by order', () => {
    const list = collectSimulators({
      b: { simulatorConfig: makeSimulator({ id: 'b', order: 2 }) },
      a: { simulatorConfig: makeSimulator({ id: 'a', order: 1 }) },
    })
    expect(list.map((s) => s.id)).toEqual(['a', 'b'])
  })
})
