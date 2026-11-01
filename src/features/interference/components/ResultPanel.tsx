import { Card } from '@/shared/components/Card'
import { ExportBar } from '@/shared/components/ExportBar'
import { Formula } from '@/shared/components/Formula'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import type { InterferenceInfo } from '../lib/physics'
import { TYPE_STYLES } from '../lib/type-styles'

interface ResultPanelProps {
  amplitude: number
  maxAmplitude: number
  intensity: number
  info: InterferenceInfo
  exportStatus: GifExportStatus
  onExport: () => void
}

export function ResultPanel({
  amplitude,
  maxAmplitude,
  intensity,
  info,
  exportStatus,
  onExport,
}: ResultPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-brand-purple text-xs font-bold tracking-wider uppercase">
            Resulting Wave
          </span>
          <h3 className="text-ink text-sm font-bold">
            Resultant Amplitude:{' '}
            <Formula tex="R = \sqrt{A^2 + B^2 + 2AB\cos\Delta\varphi}" />
          </h3>
        </div>
        <div className="font-mono text-xs text-muted">
          Intensity is proportional to the squared amplitude:{' '}
          <Formula tex="I \propto R^2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
        <div className="bg-surface-preview rounded-2xl border border-line p-3">
          <div className="text-xs font-bold text-body">
            Resultant Amplitude R
          </div>
          <div className="text-ink mt-1 font-mono text-2xl font-extrabold">
            {amplitude.toFixed(2)}
          </div>
          <div className="font-mono text-[11px] text-faint">
            max possible: <span>{maxAmplitude.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-line bg-purple-wash p-3">
          <div className="text-xs font-bold text-body">
            Relative Intensity R² / (A+B)²
          </div>
          <div className="my-3 h-4 overflow-hidden rounded-full bg-neutral">
            <div
              className="from-brand-blue via-brand-purple to-brand-pink h-full bg-linear-to-r transition-all duration-200"
              style={{ width: `${intensity}%` }}
            />
          </div>
          <div className="text-ink text-sm font-extrabold">
            {intensity.toFixed(0)}%
          </div>
        </div>

        <div className="bg-pink-wash rounded-2xl border border-pink-line p-3">
          <div className="text-xs font-bold text-body">Interference Type</div>
          <div
            className={`mt-1 text-lg font-extrabold ${TYPE_STYLES[info.kind].text}`}
          >
            {info.text}
          </div>
          <div className="mt-1 text-[11px] text-muted">{info.hint}</div>
        </div>
      </div>

      <ExportBar
        description="Want to include this explanation in your class slides? Generate a looping GIF that sweeps the phase from 0° to 360°."
        buttonLabel="Export GIF for Slides (540x540)"
        capturingMessage="Capturing phase sweep frames..."
        status={exportStatus}
        onExport={onExport}
      />
    </Card>
  )
}
