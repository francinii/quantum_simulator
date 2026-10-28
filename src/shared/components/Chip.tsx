import type { ReactNode } from 'react'
import { ACCENTS } from '@/shared/config/accents'
import type { Accent } from '@/shared/types/simulator'

interface ChipProps {
  accent: Accent
  children: ReactNode
}

export function Chip({ accent, children }: ChipProps) {
  return (
    <span
      className={`font-code rounded-sm px-2 py-0.5 text-[10px] font-bold ${ACCENTS[accent].chip}`}
    >
      {children}
    </span>
  )
}
