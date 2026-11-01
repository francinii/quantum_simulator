export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'quantum-lab:theme'
export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system']

export function parseThemeMode(value: string | null): ThemeMode {
  return value === 'light' || value === 'dark' ? value : 'system'
}

export function resolveTheme(
  mode: ThemeMode,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (mode === 'system') return systemPrefersDark ? 'dark' : 'light'
  return mode
}

export function readStoredMode(): ThemeMode {
  try {
    return parseThemeMode(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

export function storeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // The choice still applies for this visit without storage.
  }
}

export const systemQuery = () =>
  typeof matchMedia === 'function'
    ? matchMedia('(prefers-color-scheme: dark)')
    : null

export const systemPrefersDark = () => systemQuery()?.matches ?? false

export function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme
}
