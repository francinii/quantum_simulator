import { useMemo } from 'react'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { useTheme } from './useTheme'

// Re-read when the theme changes so canvas drawings pick up the new token values.
export function useCanvasTheme() {
  const { resolved } = useTheme()
  return useMemo(() => readCanvasTheme(resolved), [resolved])
}
