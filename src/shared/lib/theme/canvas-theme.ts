import type { ResolvedTheme } from './theme-mode'

export interface CanvasTheme {
  blue: string
  purple: string
  pink: string
  pinkSoft: string
  pinkPale: string
  pinkText: string
  pinkVivid: string
  inkDeep: string
  sphereBody: string
  axisCool: string
  grid: string
  sphereSky: string
  pinkPastel: string
  skyLight: string
  pinkGate: string
  night: string
  skyDeep: string
  pinkDeep: string
  emeraldDeep: string
  gateEnd: string
  emerald: string
  sky: string
  ink: string
  page: string
  surface: string
  preview: string
  pinkWash: string
  pinkLine: string
  pinkStrong: string
  body: string
  sphereEdge: string
  line: string
  lineStrong: string
  axis: string
  track: string
  trackSoft: string
  muted: string
  faint: string
  sans: string
  mono: string
}

const TOKENS: Record<keyof CanvasTheme, string> = {
  blue: '--color-brand-blue',
  purple: '--color-brand-purple',
  pink: '--color-brand-pink',
  pinkSoft: '--color-brand-pink-soft',
  pinkPale: '--color-brand-pink-pale',
  pinkText: '--color-pink-text',
  pinkVivid: '--color-pink-vivid',
  inkDeep: '--color-ink-deep',
  sphereBody: '--color-sphere-body',
  axisCool: '--color-axis-cool',
  grid: '--color-grid',
  sphereSky: '--color-sphere-sky',
  pinkPastel: '--color-pink-pastel',
  skyLight: '--color-sky-light',
  pinkGate: '--color-pink-gate',
  night: '--color-night',
  skyDeep: '--color-sky-deep',
  pinkDeep: '--color-pink-deep',
  emeraldDeep: '--color-emerald-deep',
  gateEnd: '--color-gate-x-end',
  emerald: '--color-brand-emerald',
  sky: '--color-brand-sky',
  ink: '--color-ink',
  page: '--color-page',
  surface: '--color-surface',
  preview: '--color-surface-preview',
  pinkWash: '--color-pink-wash',
  pinkLine: '--color-pink-line',
  pinkStrong: '--color-pink-strong',
  body: '--color-body',
  sphereEdge: '--color-sphere-edge',
  line: '--color-line',
  lineStrong: '--color-line-strong',
  axis: '--color-axis',
  track: '--color-track',
  trackSoft: '--color-track-soft',
  muted: '--color-muted',
  faint: '--color-faint',
  sans: '--font-sans',
  mono: '--font-code',
}

// Canvas cannot use Tailwind classes, so it reads the same design tokens from CSS.
// Passing a theme reads that theme's values even when the page shows the other one (GIF export
// is always light): the attribute is flipped and restored synchronously, so nothing is painted.
export function readCanvasTheme(theme?: ResolvedTheme): CanvasTheme {
  const root = document.documentElement
  const shown = root.dataset.theme
  const swap = theme !== undefined && theme !== shown
  if (swap) root.dataset.theme = theme
  try {
    const style = getComputedStyle(root)
    const entries = Object.entries(TOKENS).map(
      ([key, token]) => [key, style.getPropertyValue(token).trim()] as const,
    )
    return Object.fromEntries(entries) as unknown as CanvasTheme
  } finally {
    if (swap) {
      if (shown === undefined) delete root.dataset.theme
      else root.dataset.theme = shown
    }
  }
}

export function withAlpha(color: string, alpha: number): string {
  return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`
}
