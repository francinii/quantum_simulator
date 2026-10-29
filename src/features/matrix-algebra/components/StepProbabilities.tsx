import { Card } from '@/shared/components/Card'
import { ExportBar } from '@/shared/components/ExportBar'
import { Formula } from '@/shared/components/Formula'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import { BASIS_KETS, STEPS } from '../lib/steps'

const CELLS = [
  {
    alpha: 'α₀₀',
    box: 'bg-surface-preview border-blue-100',
    bar: 'bg-brand-blue',
  },
  {
    alpha: 'α₀₁',
    box: 'bg-pink-wash border-pink-100',
    bar: 'bg-brand-pink-soft',
  },
  {
    alpha: 'α₁₀',
    box: 'bg-purple-50 border-purple-100',
    bar: 'bg-brand-purple',
  },
  {
    alpha: 'α₁₁',
    box: 'bg-green-50 border-emerald-100',
    bar: 'bg-emerald-500',
  },
]

interface StepProbabilitiesProps {
  step: number
  exportStatus: GifExportStatus
  onExport: () => void
}

export function StepProbabilities({
  step,
  exportStatus,
  onExport,
}: StepProbabilitiesProps) {
  const probabilities = STEPS[step].probabilities

  return (
    <Card className="p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-brand-purple text-xs font-bold tracking-wider uppercase">
            Born&apos;s Rule: Probability Distribution
          </span>
          <h3 className="text-ink text-sm font-bold">
            Measurement Probability:{' '}
            <Formula tex={String.raw`P(x) = |\alpha_x|^2`} />
          </h3>
        </div>
        <div className="font-mono text-xs text-slate-500">
          Normalization:{' '}
          <Formula
            tex={String.raw`\sum |\alpha_i|^2 = (1/2)^2 + (1/2)^2 + (1/2)^2 + (1/2)^2 = 1.0`}
          />{' '}
          (100%)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {CELLS.map((cell, index) => (
          <div
            key={cell.alpha}
            className={`rounded-2xl border p-3 ${cell.box}`}
          >
            <div className="font-mono text-xs font-bold text-slate-700">
              {BASIS_KETS[index]}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-slate-400">
              {cell.alpha} = 1/2
            </div>
            <div className="my-2 flex h-14 items-end overflow-hidden rounded-xl bg-slate-100">
              <div
                data-testid={`bar-${index}`}
                className={`w-full transition-all duration-500 ${cell.bar}`}
                style={{ height: `${probabilities[index]}%` }}
              />
            </div>
            <div
              data-testid={`percent-${index}`}
              className="text-ink text-sm font-extrabold"
            >
              {probabilities[index]}%
            </div>
          </div>
        ))}
      </div>

      <ExportBar
        description="Want to include this explanation in your class slides? Download a visual card or generate an explanatory looping GIF."
        buttonLabel="Export GIF for Slides (540x540)"
        capturingMessage="Capturing demonstration explanatory frames..."
        status={exportStatus}
        onExport={onExport}
      />
    </Card>
  )
}
