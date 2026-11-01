import { Card } from '@/shared/components/Card'
import { PanelHeader } from '@/shared/components/PanelHeader'
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
      <PanelHeader
        title="Controls"
        titleClass="text-brand-sky"
        chip="y = A·sin(kx − ωt + φ)"
        chipClass="bg-blue-wash text-brand-sky"
      />

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
