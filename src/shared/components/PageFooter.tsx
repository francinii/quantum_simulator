import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface PageFooterProps {
  icon: string
  size?: 'home' | 'simulator'
  children: ReactNode
}

export function PageFooter({ icon, size = 'home', children }: PageFooterProps) {
  const { t } = useTranslation()

  return (
    <footer
      className={`mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 rounded-2xl border border-edge bg-surface p-4 text-xs text-muted shadow-xs md:flex-row ${size === 'home' ? 'mt-8' : 'mt-5'}`}
    >
      <div className="flex items-center gap-2">
        <span className="bg-inverse flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold text-on-inverse">
          {icon}
        </span>
        <span>{children}</span>
      </div>
      <div className="font-mono text-[11px] text-faint">
        {t('footer.credit')}
      </div>
    </footer>
  )
}
