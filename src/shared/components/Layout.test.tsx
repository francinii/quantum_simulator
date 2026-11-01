import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { createTestRouter } from '@/app/router'
import { makeSimulator } from '@/shared/test/make-simulator'

function renderAt(path: string) {
  render(
    <RouterProvider router={createTestRouter([makeSimulator()], [path])} />,
  )
}

beforeEach(() => localStorage.clear())

describe('sidebar navigation', () => {
  it('lists the four entries in order with their routes', () => {
    renderAt('/lab')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const links = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ])
    expect(links).toEqual([
      ['Home', '/'],
      ['Lab', '/lab'],
      ['Articles Explained Visually', '/articles'],
      ['Learn', '/learn'],
    ])
  })

  it('redirects / to the lab', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Lab' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it.each([
    ['/lab', 'Lab'],
    ['/simulators/fake', 'Lab'],
    ['/articles', 'Articles Explained Visually'],
    ['/learn', 'Learn'],
  ])('highlights the active entry at %s', (path, label) => {
    renderAt(path)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const current = nav.querySelectorAll('[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent(label)
  })

  it('shows coming soon for articles and learn', () => {
    renderAt('/articles')
    expect(
      screen.getByRole('heading', { name: 'Coming soon' }),
    ).toBeInTheDocument()
  })

  it('puts the hamburger at the top of the sidebar, before the navigation', () => {
    renderAt('/lab')
    const hamburger = screen.getByRole('button', { name: 'Collapse menu' })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(
      hamburger.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      screen.getAllByRole('button', { name: /collapse menu/i }),
    ).toHaveLength(1)
  })

  it('collapses and remembers the state', async () => {
    const user = userEvent.setup()
    renderAt('/lab')
    await user.click(screen.getByRole('button', { name: 'Collapse menu' }))
    expect(localStorage.getItem('quantum-lab:sidebar-collapsed')).toBe('1')
    expect(
      screen.getByRole('button', { name: 'Expand menu' }),
    ).toBeInTheDocument()
  })

  it('opens the mobile drawer and closes it with Esc, returning focus', async () => {
    const user = userEvent.setup()
    renderAt('/lab')
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes the drawer on backdrop click and on navigation', async () => {
    const user = userEvent.setup()
    renderAt('/lab')
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByTestId('sidebar-backdrop'))
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByRole('link', { name: 'Learn' }))
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
  })
})
