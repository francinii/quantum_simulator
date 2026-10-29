import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'

// Every token maps to its own name, so tests can assert which token a drawing call used.
export const testTheme = Object.fromEntries(
  [
    'blue',
    'purple',
    'pink',
    'sky',
    'ink',
    'page',
    'surface',
    'sphereEdge',
    'line',
    'lineStrong',
    'axis',
    'track',
    'muted',
    'faint',
    'sans',
    'mono',
  ].map((key) => [key, key]),
) as unknown as CanvasTheme
