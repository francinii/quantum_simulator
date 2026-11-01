import { frequencies, totalShots, type ShotStats } from '../lib/shot-stats'

interface HistogramProps {
  stats: ShotStats
  probabilities: [number, number]
  animating: boolean
}

const BARS = [
  { ket: '|0⟩', color: 'bg-brand-blue' },
  { ket: '|1⟩', color: 'bg-brand-pink' },
]

export function Histogram({ stats, probabilities, animating }: HistogramProps) {
  const measured = frequencies(stats)

  return (
    <div className="bg-surface-preview rounded-2xl border border-line p-4 md:col-span-7">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-ink font-bold">Measured Frequencies</span>
        <span className="font-mono text-muted">
          Total shots:{' '}
          <span className="text-ink font-bold">{totalShots(stats)}</span>
        </span>
      </div>
      <div className="grid h-44 grid-cols-2 items-end gap-6 px-4">
        {BARS.map((bar, outcome) => (
          <div
            key={bar.ket}
            className="flex h-full flex-col items-center justify-end"
          >
            <div className="relative flex h-full w-full items-end overflow-hidden rounded-xl border border-edge bg-surface">
              <div
                data-testid={`bar-${outcome}`}
                className={`w-full transition-all duration-300 ${bar.color}`}
                style={{ height: `${(measured?.[outcome] ?? 0) * 100}%` }}
              />
              <div
                data-testid={`theory-${outcome}`}
                className={`border-ink absolute right-0 left-0 border-t-2 border-dashed ${animating ? '' : 'transition-all duration-200'}`}
                style={{ bottom: `${probabilities[outcome] * 100}%` }}
              />
            </div>
            <div className="text-ink mt-1 font-mono text-xs font-bold">
              {bar.ket}: <span>{stats.counts[outcome]}</span>
            </div>
            <div className="font-mono text-[11px] text-muted">
              <span>
                {measured ? `${(measured[outcome] * 100).toFixed(1)}%` : '—'}
              </span>{' '}
              measured
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        Dashed line = theoretical probability. The more shots you take, the
        closer the bars get to the line.
      </p>
    </div>
  )
}
