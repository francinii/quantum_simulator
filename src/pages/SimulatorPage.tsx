import { Link, useParams } from 'react-router-dom'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { NotFoundPage } from './NotFoundPage'

interface SimulatorPageProps {
  simulators: SimulatorConfig[]
}

export function SimulatorPage({ simulators }: SimulatorPageProps) {
  const { id } = useParams()
  const simulator = simulators.find((s) => s.id === id)
  if (!simulator) return <NotFoundPage />

  return (
    <>
      <nav className="mx-auto mb-2 w-full max-w-6xl">
        <Link
          to="/"
          className="text-brand-blue hover:text-brand-purple inline-flex items-center gap-1 text-xs font-bold transition-colors"
        >
          ← All simulations
        </Link>
      </nav>
      <simulator.Component simulator={simulator} />
    </>
  )
}
