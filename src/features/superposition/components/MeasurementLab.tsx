import { Card } from '@/shared/components/Card'
import { ExportBar } from '@/shared/components/ExportBar'
import { Formula } from '@/shared/components/Formula'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import type { ShotStats } from '../lib/shot-stats'
import { Histogram } from './Histogram'
import { ShotLog } from './ShotLog'

interface MeasurementLabProps {
  stats: ShotStats
  probabilities: [number, number]
  animating: boolean
  exportStatus: GifExportStatus
  onMeasureOnce: () => void
  onMeasureMany: (shots: number) => void
  onReset: () => void
  onExport: () => void
}

export function MeasurementLab({
  stats,
  probabilities,
  animating,
  exportStatus,
  onMeasureOnce,
  onMeasureMany,
  onReset,
  onExport,
}: MeasurementLabProps) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-brand-purple text-xs font-bold tracking-wider uppercase">
            3. Measurement Lab
          </span>
          <h3 className="text-ink text-sm font-bold">
            One measurement is random — many measurements reveal the
            probabilities
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMeasureOnce}
            className="bg-inverse rounded-xl px-3.5 py-1.5 text-xs font-bold text-on-inverse shadow-xs transition-colors hover:bg-inverse-hover"
          >
            Measure once
          </button>
          <button
            type="button"
            onClick={() => onMeasureMany(100)}
            className="border-line bg-blue-wash text-brand-blue hover:bg-blue-wash-hover rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors"
          >
            × 100 shots
          </button>
          <button
            type="button"
            onClick={() => onMeasureMany(1000)}
            className="text-brand-purple rounded-xl border border-purple-edge bg-purple-wash px-3 py-1.5 text-xs font-bold transition-colors hover:bg-purple-line"
          >
            × 1000 shots
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl bg-neutral px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-neutral-strong"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Histogram
          stats={stats}
          probabilities={probabilities}
          animating={animating}
        />
        <ShotLog stats={stats} />
      </div>

      <ExportBar
        description={
          <>
            Want to include this explanation in your class slides? Generate a
            looping GIF that sweeps the state from <Formula tex="|0\rangle" />{' '}
            to <Formula tex="|1\rangle" />.
          </>
        }
        buttonLabel="Export GIF for Slides (540x540)"
        capturingMessage="Capturing superposition sweep frames..."
        status={exportStatus}
        onExport={onExport}
      />
    </Card>
  )
}
