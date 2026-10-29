import type { ReactNode } from 'react'

interface PageFooterProps {
  icon: string
  size?: 'home' | 'simulator'
  children: ReactNode
}

export function PageFooter({ icon, size = 'home', children }: PageFooterProps) {
  return (
    <footer
      className={`mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-xs md:flex-row ${size === 'home' ? 'mt-8' : 'mt-5'}`}
    >
      <div className="flex items-center gap-2">
        <span className="bg-ink flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold text-white">
          {icon}
        </span>
        <span>{children}</span>
      </div>
      <div className="font-mono text-[11px] text-slate-400">
        Quantum Lab &bull; Mathematical Quantum Physics
      </div>
    </footer>
  )
}
