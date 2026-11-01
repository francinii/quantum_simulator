import { readCanvasTheme } from './canvas-theme'

const STYLE =
  ":root{--color-page:#fafcff}:root[data-theme='dark']{--color-page:#0f0a24}"

describe('readCanvasTheme', () => {
  let style: HTMLStyleElement
  beforeEach(() => {
    style = document.createElement('style')
    style.textContent = STYLE
    document.head.appendChild(style)
    document.documentElement.dataset.theme = 'dark'
  })
  afterEach(() => {
    style.remove()
    delete document.documentElement.dataset.theme
  })

  it('reads the theme shown on the page by default', () => {
    expect(readCanvasTheme().page).toBe('#0f0a24')
  })

  it('reads the requested theme and leaves the page theme untouched', () => {
    expect(readCanvasTheme('light').page).toBe('#fafcff')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('removes the attribute again when the page had none', () => {
    delete document.documentElement.dataset.theme
    readCanvasTheme('dark')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})
