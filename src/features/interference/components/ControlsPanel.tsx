import { Card } from '@/shared/components/Card'
import { Slider } from '@/shared/components/Slider'

interface ControlsPanelProps {
  phase: number
  ampA: number
  ampB: number
  onPhaseChange: (value: number) => void
  onAmpAChange: (value: number) => void
  onAmpBChange: (value: number) => void
}

export function ControlsPanel({
  phase,
  ampA,
  ampB,
  onPhaseChange,
  onAmpAChange,
  onAmpBChange,
}: ControlsPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-brand-sky text-sm font-extrabold tracking-wider uppercase">
          Controls
        </h2>
        <span className="text-brand-sky rounded-sm bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold">
          y = A·sin(kx − ωt + φ)
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <Slider
          label="Phase shift Δφ"
          display={`${Math.round(phase)}°`}
          value={phase}
          min={0}
          max={360}
          step={1}
          tone="purple"
          onChange={onPhaseChange}
        />
        <Slider
          label="Amplitude A"
          display={ampA.toFixed(2)}
          value={ampA}
          min={0}
          max={1}
          step={0.05}
          tone="blue"
          labelClass="text-brand-blue"
          onChange={onAmpAChange}
        />
        <Slider
          label="Amplitude B"
          display={ampB.toFixed(2)}
          value={ampB}
          min={0}
          max={1}
          step={0.05}
          tone="pink"
          labelClass="text-brand-pink"
          onChange={onAmpBChange}
        />
      </div>
    </Card>
  )
}
