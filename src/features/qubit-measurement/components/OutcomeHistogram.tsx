import { Card } from '@/shared/components/Card'
import type { Setup } from '../lib/setup'
import { outcomeKeys, theoryProbabilities } from '../lib/setup'

const BAR_COLORS = [
  'bg-brand-blue',
  'bg-brand-pink-soft',
  'bg-brand-purple',
  'bg-brand-emerald',
]

interface OutcomeHistogramProps {
  setup: Setup
  counts: Record<string, number>
}

export function OutcomeHistogram({ setup, counts }: OutcomeHistogramProps) {
  const keys = outcomeKeys(setup)
  const theory = theoryProbabilities(setup)
  const total = keys.reduce((sum, key) => sum + (counts[key] ?? 0), 0)

  return (
    <Card className="flex flex-col p-5 lg:col-span-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-edge-soft pb-2">
        <div>
          <span className="text-brand-purple text-xs font-bold tracking-wider uppercase">
            Counts (plot_histogram)
          </span>
          <h3 className="text-ink text-sm font-bold">
            Measured outcomes vs. theory
          </h3>
        </div>
        <span className="font-mono text-xs text-muted">
          Total shots: <span className="text-ink font-bold">{total}</span>
        </span>
      </div>

      <div
        className="grid h-52 items-end gap-4 px-2"
        style={{
          gridTemplateColumns: `repeat(${keys.length}, minmax(0, 1fr))`,
        }}
      >
        {keys.map((key, index) => {
          const count = counts[key] ?? 0
          const frequency = total ? count / total : 0
          return (
            <div
              key={key}
              className="flex h-full flex-col items-center justify-end"
            >
              <div className="text-ink mb-1 font-mono text-[11px] font-bold">
                {total ? count : ''}
              </div>
              <div className="bg-surface-preview relative flex w-full flex-1 items-end overflow-hidden rounded-xl border border-edge">
                <div
                  data-testid={`bar-${key}`}
                  className={`w-full transition-all duration-300 ${BAR_COLORS[index]}`}
                  style={{ height: `${frequency * 100}%` }}
                />
                <div
                  data-testid={`theory-${key}`}
                  className="border-ink absolute right-0 left-0 border-t-2 border-dashed"
                  style={{ bottom: `${theory[key] * 100}%` }}
                />
              </div>
              <div className="text-ink mt-1 font-mono text-sm font-extrabold">
                {key}
              </div>
              <div
                data-testid={`share-${key}`}
                className="font-mono text-[10px] text-faint"
              >
                {total ? `${(frequency * 100).toFixed(1)}%` : '—'} /{' '}
                {(theory[key] * 100).toFixed(0)}%
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-edge-soft pt-3 text-[11px] text-muted">
        <span>
          Dashed line = theoretical probability &bull; bars = measured frequency
        </span>
        <span
          data-testid="bit-order-note"
          className={`text-brand-purple font-mono font-bold ${setup.m2 ? '' : 'invisible'}`}
        >
          Qiskit bitstrings read right to left: c₁c₀
        </span>
      </div>
    </Card>
  )
}
