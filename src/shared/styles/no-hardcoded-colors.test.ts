import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = join(__dirname, '..', '..')
const TOKEN_FILES = new Set(['palette.css', 'tokens.css'])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    const isSource = /\.(ts|tsx|css)$/.test(entry.name)
    const isTest = /\.test\.tsx?$/.test(entry.name)
    return isSource && !isTest && !TOKEN_FILES.has(entry.name) ? [path] : []
  })
}

const LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/
const RAW_UTILITY =
  /(?<![\w-])(?:[a-z-]+:)*(?:bg|text|border|fill|stroke|from|via|to|ring|outline|divide|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/

describe('theme rules', () => {
  const files = sourceFiles(SRC)

  it.each(files.map((file) => [relative(SRC, file), file]))(
    '%s has no hardcoded colors',
    (_name, file) => {
      const text = readFileSync(file, 'utf8')
      expect(text).not.toMatch(LITERAL)
      expect(text).not.toMatch(RAW_UTILITY)
      // Components use semantic tokens, never the primitive palette layer.
      expect(text).not.toContain('--palette-')
    },
  )
})
