import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ThemeContext } from '@/shared/lib/theme/theme-context'
import {
  applyTheme,
  readStoredMode,
  resolveTheme,
  storeMode,
  systemPrefersDark,
  systemQuery,
  type ThemeMode,
} from '@/shared/lib/theme/theme-mode'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState(readStoredMode)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  const modeRef = useRef(mode)
  const resolved = resolveTheme(mode, systemDark)

  // The DOM is updated in the handlers, before React re-renders, so components that read
  // colors from the tokens (canvas, 3D) see the new theme on that very render.
  const setMode = (next: ThemeMode) => {
    modeRef.current = next
    storeMode(next)
    applyTheme(resolveTheme(next, systemDark))
    setModeState(next)
  }

  useEffect(() => {
    applyTheme(resolveTheme(modeRef.current, systemPrefersDark()))
    const query = systemQuery()
    if (!query) return
    const onChange = (event: MediaQueryListEvent) => {
      applyTheme(resolveTheme(modeRef.current, event.matches))
      setSystemDark(event.matches)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
