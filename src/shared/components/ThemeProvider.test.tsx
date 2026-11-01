import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCanvasTheme } from '@/shared/hooks/useCanvasTheme'
import { useTheme } from '@/shared/hooks/useTheme'
import { THEME_STORAGE_KEY } from '@/shared/lib/theme/theme-mode'
import { ThemeProvider } from './ThemeProvider'
import { ThemeSwitcher } from './ThemeSwitcher'

type Listener = (event: MediaQueryListEvent) => void

function mockSystem(initialDark: boolean) {
  const listeners = new Set<Listener>()
  let dark = initialDark
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return dark
      },
      addEventListener: (_: string, fn: Listener) => listeners.add(fn),
      removeEventListener: (_: string, fn: Listener) => listeners.delete(fn),
    })),
  )
  return (next: boolean) => {
    dark = next
    listeners.forEach((fn) => fn({ matches: next } as MediaQueryListEvent))
  }
}

function Probe() {
  const { resolved } = useTheme()
  const canvas = useCanvasTheme()
  return (
    <p>
      {resolved}:{canvas.page}
    </p>
  )
}

function renderApp() {
  return render(
    <ThemeProvider>
      <ThemeSwitcher collapsed={false} />
      <Probe />
    </ThemeProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})
afterEach(() => vi.unstubAllGlobals())

describe('ThemeProvider', () => {
  it('follows the system by default and reacts when it changes', () => {
    const setSystemDark = mockSystem(false)
    renderApp()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked()

    act(() => setSystemDark(true))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByText(/^dark:/)).toBeInTheDocument()
  })

  it('applies and persists an explicit choice', async () => {
    mockSystem(false)
    renderApp()
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked()
  })

  it('restores the stored choice on load', () => {
    mockSystem(false)
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    renderApp()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('re-reads canvas tokens when the theme changes', async () => {
    mockSystem(false)
    const style = document.createElement('style')
    style.textContent =
      ":root{--color-page:#fafcff}:root[data-theme='dark']{--color-page:#0f0a24}"
    document.head.appendChild(style)
    renderApp()
    expect(screen.getByText('light:#fafcff')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(screen.getByText('dark:#0f0a24')).toBeInTheDocument()
    style.remove()
  })
})
