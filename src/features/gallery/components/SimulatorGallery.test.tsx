import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { makeSimulator } from '@/shared/test/make-simulator'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { SimulatorGallery } from './SimulatorGallery'

const simulators = [
  makeSimulator({ id: 'one', title: 'First', chip: 'c1', category: 'Cat A' }),
  makeSimulator({ id: 'two', title: 'Second', chip: 'c2', category: 'Cat B' }),
]

function renderGallery(list: SimulatorConfig[] = simulators) {
  render(
    <MemoryRouter>
      <SimulatorGallery simulators={list} />
    </MemoryRouter>,
  )
}

describe('SimulatorGallery', () => {
  it('renders one card per simulator with all its metadata', () => {
    renderGallery()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)

    const first = within(items[0])
    expect(first.getByRole('heading', { name: 'First' })).toBeInTheDocument()
    expect(first.getByText('Only for tests')).toBeInTheDocument()
    expect(first.getByText('c1')).toBeInTheDocument()
    expect(first.getByText('Cat A')).toBeInTheDocument()
    expect(first.getByTestId('preview')).toBeInTheDocument()
  })

  it('links each card to its simulator route', () => {
    renderGallery()
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/simulators/one')
    expect(links[1]).toHaveAttribute('href', '/simulators/two')
  })

  it('numbers cards from 01 following the given order', () => {
    renderGallery()
    expect(screen.getByText('Simulation 01')).toBeInTheDocument()
    expect(screen.getByText('Simulation 02')).toBeInTheDocument()
  })

  it('makes cards keyboard focusable', async () => {
    renderGallery()
    await userEvent.tab()
    expect(screen.getAllByRole('link')[0]).toHaveFocus()
  })

  it('renders an extra card when a config is added, with no gallery change', () => {
    renderGallery([...simulators, makeSimulator({ id: 'three' })])
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
