import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = __dirname
const read = (file: string) => readFileSync(join(dir, file), 'utf8')

const palette = new Map(
  [
    ...read('palette.css').matchAll(/(--palette-[\w-]+):\s*(#[0-9a-f]{6});/g),
  ].map((m) => [m[1], m[2]]),
)

function parseTokens(block: string) {
  const tokens = new Map<string, string>()
  for (const m of block.matchAll(
    /--color-([\w-]+):\s*var\((--palette-[\w-]+)\);/g,
  )) {
    const hex = palette.get(m[2])
    if (!hex) throw new Error(`Unknown palette entry ${m[2]}`)
    tokens.set(m[1], hex)
  }
  return tokens
}

const css = read('tokens.css')
const light = parseTokens(css.slice(0, css.indexOf(":root[data-theme='dark']")))
const darkOverrides = parseTokens(
  css.slice(css.indexOf(":root[data-theme='dark']")),
)
const dark = new Map([...light, ...darkOverrides])

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [text token, surface token, minimum ratio]. 4.5 for text; 3 for large or graphical use.
const PAIRS: [string, string, number][] = [
  ['ink', 'page', 4.5],
  ['ink', 'surface', 4.5],
  ['body', 'surface', 4.5],
  ['body', 'page', 4.5],
  ['muted', 'surface', 4.5],
  ['muted', 'page', 4.5],
  ['muted', 'neutral', 4.5],
  ['faint', 'surface', 3],
  ['brand-blue', 'surface', 3],
  ['brand-purple', 'surface', 3],
  ['brand-pink', 'surface', 3],
  ['pink-strong', 'pink-wash', 4.5],
  ['pink-deep', 'pink-wash', 4.5],
  ['pink-text', 'brand-pink-pale', 4.5],
  ['sky-deep', 'gate-x-start', 4.5],
  ['emerald-deep', 'surface', 3],
  ['emerald-ink', 'emerald-wash', 4.5],
  ['purple-deep', 'purple-wash', 4.5],
  ['rose-ink', 'rose-wash', 4.5],
  ['amber-ink', 'amber-wash', 3],
  ['on-inverse', 'inverse', 4.5],
  ['on-inverse', 'inverse-hover', 4.5],
  ['accent-strong', 'accent-soft', 4.5],
  ['code-text', 'code', 4.5],
  ['code-method', 'code', 4.5],
  ['code-keyword', 'code', 4.5],
]

// Brand colors keep their legacy light values (spec 011: light matches legacy), so a few
// light pairs are below AA for small text. They are listed, not hidden; dark has none.
const LIGHT_KNOWN_BELOW: Record<string, number> = {
  'muted/neutral': 4.3,
  'faint/surface': 2.5,
  'brand-blue/surface': 3,
  'brand-pink/surface': 2.8,
  'pink-strong/pink-wash': 4.2,
  'sky-deep/gate-x-start': 4.4,
  'rose-ink/rose-wash': 4.2,
  'emerald-deep/surface': 3,
  'amber-ink/amber-wash': 3,
}

describe('theme tokens', () => {
  it('defines a dark value for every token that needs one', () => {
    for (const name of darkOverrides.keys()) {
      expect(light.has(name)).toBe(true)
    }
  })

  it.each(PAIRS)(
    'dark: %s on %s has contrast of at least %d',
    (fg, bg, min) => {
      expect(contrast(dark.get(fg)!, dark.get(bg)!)).toBeGreaterThanOrEqual(min)
    },
  )

  it.each(PAIRS)(
    'light: %s on %s has contrast of at least %d',
    (fg, bg, min) => {
      const required = LIGHT_KNOWN_BELOW[`${fg}/${bg}`] ?? min
      expect(contrast(light.get(fg)!, light.get(bg)!)).toBeGreaterThanOrEqual(
        required,
      )
    },
  )
})
