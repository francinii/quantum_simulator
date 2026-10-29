import type { ReactNode } from 'react'
import { PageFooter } from './PageFooter'
import { PageHeader } from './PageHeader'

interface SimulatorFrameProps {
  title: string
  highlight: string
  description: ReactNode
  footerIcon: string
  footerMessage: ReactNode
  children: ReactNode
}

export function SimulatorFrame({
  title,
  highlight,
  description,
  footerIcon,
  footerMessage,
  children,
}: SimulatorFrameProps) {
  return (
    <>
      <PageHeader
        size="simulator"
        title={title}
        highlight={highlight}
        description={description}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
        {children}
      </main>
      <PageFooter size="simulator" icon={footerIcon}>
        {footerMessage}
      </PageFooter>
    </>
  )
}
