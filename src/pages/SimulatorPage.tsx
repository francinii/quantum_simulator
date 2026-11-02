import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { LoadBoundary } from '@/shared/components/LoadBoundary'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { NotFoundPage } from './NotFoundPage'

interface SimulatorPageProps {
  simulators: SimulatorConfig[]
}

export function SimulatorPage({ simulators }: SimulatorPageProps) {
  const { t } = useTranslation()
  const { id } = useParams()
  const simulator = simulators.find((s) => s.id === id)
  if (!simulator) return <NotFoundPage />

  return (
    <>
      <nav className="mx-auto mb-2 w-full max-w-6xl">
        <Link
          to="/lab"
          className="text-brand-blue hover:text-brand-purple inline-flex items-center gap-1 text-xs font-bold transition-colors"
        >
          {t('backToLab')}
        </Link>
      </nav>
      <LoadBoundary>
        <simulator.Component simulator={simulator} />
      </LoadBoundary>
    </>
  )
}
