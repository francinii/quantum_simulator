export interface CanvasTheme {
  blue: string
  purple: string
  pink: string
  ink: string
  page: string
  axis: string
  track: string
  muted: string
  faint: string
  sans: string
  mono: string
}

const TOKENS: Record<keyof CanvasTheme, string> = {
  blue: '--color-brand-blue',
  purple: '--color-brand-purple',
  pink: '--color-brand-pink',
  ink: '--color-ink',
  page: '--color-page',
  axis: '--color-axis',
  track: '--color-track',
  muted: '--color-muted',
  faint: '--color-faint',
  sans: '--font-sans',
  mono: '--font-code',
}

// Canvas cannot use Tailwind classes, so it reads the same design tokens from CSS.
export function readCanvasTheme(): CanvasTheme {
  const style = getComputedStyle(document.documentElement)
  const entries = Object.entries(TOKENS).map(
    ([key, token]) => [key, style.getPropertyValue(token).trim()] as const,
  )
  return Object.fromEntries(entries) as unknown as CanvasTheme
}

export function withAlpha(color: string, alpha: number): string {
  return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`
}
