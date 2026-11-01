import { MAX_LOGGED_SHOTS, type ShotStats } from '../lib/shot-stats'

interface ShotLogProps {
  stats: ShotStats
}

export function ShotLog({ stats }: ShotLogProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-purple-line bg-purple-wash p-4 md:col-span-5">
      <div className="text-ink mb-2 text-xs font-bold">
        Last {MAX_LOGGED_SHOTS} outcomes
      </div>
      <div
        data-testid="shot-log"
        className="flex min-h-[96px] flex-wrap content-start gap-1"
      >
        {stats.history.length === 0 ? (
          <span className="text-[11px] text-faint">
            Press “Measure once” to start.
          </span>
        ) : (
          stats.history.map((outcome, index) => (
            <span
              key={index}
              className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold text-on-brand ${
                outcome === 0 ? 'bg-brand-blue' : 'bg-brand-pink'
              }`}
            >
              {outcome}
            </span>
          ))
        )}
      </div>
      <div className="mt-auto space-y-1 pt-3 text-[11px] text-muted">
        <div className="flex items-center gap-2">
          <span className="bg-brand-blue inline-block h-3 w-3 rounded-sm" />{' '}
          Outcome 0
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-brand-pink inline-block h-3 w-3 rounded-sm" />{' '}
          Outcome 1
        </div>
        <div className="pt-1">
          Each outcome is unpredictable. Only the <strong>pattern</strong> is.
        </div>
      </div>
    </div>
  )
}
