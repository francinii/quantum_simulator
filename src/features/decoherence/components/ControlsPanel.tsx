import { useId } from 'react'
import { Card } from '@/shared/components/Card'
import { ExportGifButton } from '@/shared/components/ExportGifButton'
import { ExportStatusText } from '@/shared/components/ExportStatusText'
import { Formula } from '@/shared/components/Formula'
import { PlayPauseButton } from '@/shared/components/PlayPauseButton'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import type { Mechanism } from '../lib/physics'

const ACTIVE = {
  dephasing: 'bg-brand-blue text-white shadow-xs',
  relaxation: 'bg-brand-pink text-white shadow-xs',
}
const INACTIVE = 'bg-slate-100 text-slate-700 hover:bg-slate-200'

interface ControlsPanelProps {
  mechanism: Mechanism
  rate: number
  playing: boolean
  exportStatus: GifExportStatus
  onMechanismChange: (mechanism: Mechanism) => void
  onRateChange: (rate: number) => void
  onTogglePlay: () => void
  onReset: () => void
  onExport: () => void
}

export function ControlsPanel({
  mechanism,
  rate,
  playing,
  exportStatus,
  onMechanismChange,
  onRateChange,
  onTogglePlay,
  onReset,
  onExport,
}: ControlsPanelProps) {
  const rateId = useId()
  const exporting = exportStatus === 'capturing' || exportStatus === 'compiling'

  return (
    <Card
      borderClass="border-slate-200"
      className="flex flex-1 flex-col justify-between p-4"
    >
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          Simulation Controls
        </h3>

        <div>
          <div className="mb-1 block text-xs font-semibold text-slate-700">
            Noise Mechanism:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['dephasing', 'Dephasing', 'T_2'],
                ['relaxation', 'Relaxation', 'T_1'],
              ] as const
            ).map(([key, name, tex]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mechanism === key}
                onClick={() => onMechanismChange(key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  mechanism === key ? ACTIVE[key] : INACTIVE
                }`}
              >
                {name} (<Formula tex={tex} />)
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor={rateId}>
              Decoherence Rate (<Formula tex={String.raw`\gamma`} />)
            </label>
            <span
              data-testid="rate-label"
              className="text-brand-blue font-bold"
            >
              {rate.toFixed(1)}x
            </span>
          </div>
          <input
            id={rateId}
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={rate}
            onChange={(event) => onRateChange(parseFloat(event.target.value))}
            className="accent-brand-blue h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <PlayPauseButton
            variant="block"
            playing={playing}
            onToggle={onTogglePlay}
          />
          <button
            type="button"
            onClick={onReset}
            className="border-line bg-blue-wash text-brand-blue hover:bg-blue-wash-hover w-full rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
          >
            Reset Cycle
          </button>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-4">
        <ExportGifButton
          variant="gradient"
          label="Generate and Download GIF"
          disabled={exporting}
          onClick={onExport}
        />
        <ExportStatusText
          status={exportStatus}
          capturingMessage="Preparing decoherence frames..."
          className="mt-1.5 text-center text-[11px] text-slate-400"
        />
      </div>
    </Card>
  )
}
