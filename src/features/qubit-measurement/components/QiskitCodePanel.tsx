import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  buildQiskitLines,
  qiskitText,
  type QiskitLine,
} from '../lib/qiskit-code'
import type { Setup } from '../lib/setup'

const COPIED_VISIBLE_MS = 1500

// Keywords and Qiskit method names get a color; everything else stays plain.
function highlight(code: string): ReactNode {
  const keyword = code.match(/^(from|import)\b/)
  if (keyword) {
    return (
      <>
        <span className="text-code-keyword">{keyword[1]}</span>
        {code.slice(keyword[1].length)}
      </>
    )
  }
  const method = code.match(/^(qc)\.(\w+)(.*)$/)
  if (method) {
    return (
      <>
        {method[1]}.<span className="text-code-method">{method[2]}</span>
        {method[3]}
      </>
    )
  }
  return code
}

function renderLine({ code, comment }: QiskitLine): ReactNode {
  if (!code)
    return comment ? <span className="text-code-comment">{comment}</span> : ''
  return (
    <>
      {highlight(code)}
      {comment && (
        <>
          {'  '}
          <span className="text-code-comment"># {comment}</span>
        </>
      )}
    </>
  )
}

interface QiskitCodePanelProps {
  setup: Setup
}

export function QiskitCodePanel({ setup }: QiskitCodePanelProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lines = buildQiskitLines(setup)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(qiskitText(lines))
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_VISIBLE_MS)
  }

  return (
    <div className="bg-code border-code-edge rounded-3xl border p-5 shadow-xs lg:col-span-6">
      <div className="mb-3 flex items-center justify-between border-b border-code-text/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="bg-brand-pink h-3 w-3 rounded-full" />
          <h2 className="text-code-keyword text-sm font-extrabold tracking-wider uppercase">
            Equivalent Qiskit Code
          </h2>
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-sm bg-code-text/10 px-2 py-0.5 text-[11px] font-bold text-on-brand transition-colors hover:bg-code-text/20"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        data-testid="qiskit-code"
        className="font-code overflow-x-auto text-[11px] leading-relaxed text-code-text md:text-xs md:leading-4"
      >
        {lines.map((line, index) => (
          <span key={index}>
            {renderLine(line)}
            {index < lines.length - 1 ? '\n' : ''}
          </span>
        ))}
      </pre>
    </div>
  )
}
