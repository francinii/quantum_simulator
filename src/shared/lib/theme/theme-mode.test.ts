import {
  applyTheme,
  parseThemeMode,
  readStoredMode,
  resolveTheme,
  storeMode,
  THEME_STORAGE_KEY,
} from './theme-mode'

beforeEach(() => localStorage.clear())

describe('theme mode', () => {
  it('parses stored values and defaults to system', () => {
    expect(parseThemeMode('light')).toBe('light')
    expect(parseThemeMode('dark')).toBe('dark')
    expect(parseThemeMode('system')).toBe('system')
    expect(parseThemeMode('nonsense')).toBe('system')
    expect(parseThemeMode(null)).toBe('system')
  })

  it('resolves system from the OS preference and leaves explicit modes alone', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('persists the choice', () => {
    storeMode('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(readStoredMode()).toBe('dark')
  })

  it('falls back to system when storage throws', () => {
    const get = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    const set = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    expect(readStoredMode()).toBe('system')
    expect(() => storeMode('dark')).not.toThrow()
    get.mockRestore()
    set.mockRestore()
  })

  it('sets data-theme on the root element', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
