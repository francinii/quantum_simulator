import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/Card'
import { Chip } from '@/shared/components/Chip'
import { ACCENTS } from '@/shared/config/accents'
import { useSimulatorText } from '@/shared/hooks/useSimulatorText'
import type { SimulatorConfig } from '@/shared/types/simulator'

interface SimulatorCardProps {
  simulator: SimulatorConfig
  position: number
}

export function SimulatorCard({ simulator, position }: SimulatorCardProps) {
  const accent = ACCENTS[simulator.accent]
  const { t } = useTranslation('gallery')
  const text = useSimulatorText(simulator.id)

  return (
    <Link
      to={`/simulators/${simulator.id}`}
      className="group focus-visible:outline-brand-purple flex w-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card className="flex w-full flex-col p-5">
        <div className="bg-surface-preview mb-4 overflow-hidden rounded-2xl border border-edge p-3">
          <simulator.Preview />
        </div>
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase ${accent.label}`}
          >
            {t('simulation', { number: String(position).padStart(2, '0') })}
          </span>
          <Chip accent={simulator.accent}>{simulator.chip}</Chip>
        </div>
        <h2 className="text-ink text-lg leading-snug font-extrabold">
          {text.title}
        </h2>
        <p className="mt-2 flex-1 text-xs text-muted">{text.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-edge-soft pt-3 text-xs">
          <span className="font-code text-faint">{text.category}</span>
          <span
            className={`font-bold transition-transform group-hover:translate-x-1 ${accent.cta}`}
          >
            {t('open')}
          </span>
        </div>
      </Card>
    </Link>
  )
}
