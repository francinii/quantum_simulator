import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { RouterProvider } from 'react-router-dom'
import { createTestRouter } from '@/app/router'
import { makeSimulator } from '@/shared/test/make-simulator'

function renderAt(path: string) {
  render(
    <RouterProvider router={createTestRouter([makeSimulator()], [path])} />,
  )
}

afterEach(async () => {
  localStorage.clear()
  await i18next.changeLanguage('en')
})

describe('language switcher', () => {
  it('translates the menu, the lab and the labels of the switchers', async () => {
    const user = userEvent.setup()
    renderAt('/lab')
    await user.click(screen.getByRole('radio', { name: 'Español' }))

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(
      Array.from(nav.querySelectorAll('a')).map((a) => a.textContent),
    ).toEqual([
      'Inicio',
      'Laboratorio',
      'Artículos explicados visualmente',
      'Aprender',
    ])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Quantum Lab: Simulaciones interactivas',
    )
    expect(screen.getByRole('radiogroup', { name: 'Idioma' })).toBeVisible()
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('es')
    expect(document.title).toBe('Quantum Lab: Simulaciones interactivas')
  })

  it('shows English again and marks the active language', async () => {
    const user = userEvent.setup()
    renderAt('/lab')
    await user.click(screen.getByRole('radio', { name: 'Español' }))
    expect(screen.getByRole('radio', { name: 'Español' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'English' }))
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  })

  it('translates coming soon and not-found pages', async () => {
    const user = userEvent.setup()
    renderAt('/articles')
    await user.click(screen.getByRole('radio', { name: 'Español' }))
    expect(
      screen.getByRole('heading', { name: 'Próximamente' }),
    ).toBeInTheDocument()
  })

  it('translates the gallery cards from each simulator namespace', async () => {
    const user = userEvent.setup()
    renderAt('/lab')
    expect(screen.getByText('Simulation 01')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Español' }))
    expect(screen.getByText('Simulación 01')).toBeInTheDocument()
    expect(screen.getByText('Abrir simulación →')).toBeInTheDocument()
  })
})
