import { Card } from '@/shared/components/Card'
import { OUTCOMES, type Outcome, type Probabilities } from '../lib/bell-states'

const BAR_COLORS = [
  'bg-brand-blue',
  'bg-brand-purple',
  'bg-brand-pink-soft',
  'bg-brand-blue',
]

interface ShotsPanelProps {
  probabilities: Probabilities
  outcome: Outcome | null
  // Bars would restart their CSS transition every frame while the cycle plays, so only a paused view eases.
  animateBars: boolean
  onMeasure: () => void
}

export function ShotsPanel({
  probabilities,
  outcome,
  animateBars,
  onMeasure,
}: ShotsPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-brand-pink text-xs font-bold tracking-wider uppercase">
          Shots Simulator
        </h2>
        <span className="font-mono text-[11px] text-slate-400">
          Collapse on Measurement
        </span>
      </div>

      <div className="my-3 grid grid-cols-4 gap-2 text-center">
        {OUTCOMES.map((label, index) => {
          const percent = probabilities[index] * 100
          return (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2"
            >
              <div className="font-mono text-[10px] text-slate-400">
                {label}
              </div>
              <div className="relative my-1 flex h-10 items-end justify-center overflow-hidden rounded-md bg-slate-100">
                <div
                  data-testid={`bar-${index}`}
                  className={`w-full ${BAR_COLORS[index]} ${
                    animateBars ? 'transition-all duration-300' : ''
                  }`}
                  style={{ height: `${percent}%` }}
                />
              </div>
              <div
                data-testid={`pct-${index}`}
                className="text-ink text-[11px] font-bold"
              >
                {percent.toFixed(0)}%
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onMeasure}
        className="from-brand-blue via-brand-purple to-brand-pink flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-95"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Perform Quantum Measurement (1 Shot)
      </button>

      {outcome && (
        <div
          role="status"
          className="text-ink mt-2 text-center text-xs font-bold"
        >
          Collapsed Outcome:{' '}
          <span className="text-brand-blue font-mono text-sm">{outcome}</span>
        </div>
      )}
    </Card>
  )
}
