import { lazy } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { makeSimulator } from '@/shared/test/make-simulator'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { SimulatorPage } from './SimulatorPage'

function renderPage(simulator: SimulatorConfig) {
  render(
    <MemoryRouter initialEntries={[`/simulators/${simulator.id}`]}>
      <Routes>
        <Route
          path="/simulators/:id"
          element={<SimulatorPage simulators={[simulator]} />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SimulatorPage lazy loading', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a loading message, then the simulator once it loads', async () => {
    let finish: () => void = () => {}
    const Lazy = lazy(
      () =>
        new Promise<{ default: () => React.JSX.Element }>((resolve) => {
          finish = () => resolve({ default: () => <p>lazy body</p> })
        }),
    )
    renderPage(makeSimulator({ id: 'lazy', Component: Lazy }))

    expect(screen.getByRole('status')).toHaveTextContent('Loading simulation')
    expect(screen.queryByText('lazy body')).not.toBeInTheDocument()

    finish()
    expect(await screen.findByText('lazy body')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows an error with a reload button when the chunk fails to load', async () => {
    const reload = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload,
    })
    const Broken = lazy(() => Promise.reject(new Error('chunk gone')))
    renderPage(makeSimulator({ id: 'broken', Component: Broken }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'could not be loaded',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Reload page' }))
    expect(reload).toHaveBeenCalledOnce()
  })

  it('renders a non-lazy simulator immediately', () => {
    renderPage(makeSimulator({ id: 'plain' }))
    expect(screen.getByText('fake body')).toBeInTheDocument()
  })
})
