import katex from 'katex'
import 'katex/dist/katex.min.css'

interface FormulaProps {
  tex: string
  display?: boolean
}

// Only ever called with constant TeX written in this codebase, never user input.
export function Formula({ tex, display = false }: FormulaProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
  })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
