import type { ReactNode } from 'react'
import { Formula } from '@/shared/components/Formula'

interface NotationBoxProps {
  id: string
  // The first box of each side is tinted; the others are plain white.
  boxClass: string
  ringClass: string
  active: boolean
  header: ReactNode
  chip: string
  chipClass: string
  tex: string
  formulaClass: string
  note: ReactNode
}

export function NotationBox({
  id,
  boxClass,
  ringClass,
  active,
  header,
  chip,
  chipClass,
  tex,
  formulaClass,
  note,
}: NotationBoxProps) {
  return (
    <div
      data-testid={id}
      data-active={active}
      className={`rounded-2xl border p-3 transition-all ${boxClass} ${
        active ? `opacity-100 ring-1 ${ringClass}` : 'opacity-40'
      }`}
    >
      <div className="text-ink mb-1 flex items-center justify-between text-xs font-bold">
        <span>{header}</span>
        <span className={`font-mono text-[10px] ${chipClass}`}>{chip}</span>
      </div>
      <div className={`overflow-x-auto ${formulaClass}`}>
        <Formula display tex={tex} />
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{note}</p>
    </div>
  )
}
