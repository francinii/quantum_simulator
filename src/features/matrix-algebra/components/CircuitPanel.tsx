import { useId } from 'react'
import { Card } from '@/shared/components/Card'
import { PlayPauseButton } from '@/shared/components/PlayPauseButton'
import { formatSpeed } from '@/shared/lib/format-speed'
import { STEPS } from '../lib/steps'
import { HadamardCircuit } from './HadamardCircuit'

interface CircuitPanelProps {
  step: number
  playing: boolean
  speed: number
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
}

export function CircuitPanel({
  step,
  playing,
  speed,
  onTogglePlay,
  onPrevious,
  onNext,
  onReset,
  onSpeedChange,
}: CircuitPanelProps) {
  const speedId = useId()

  return (
    <Card className="relative overflow-hidden p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            Circuit Diagram
          </span>
          <span
            data-testid="step-label"
            className="text-brand-blue rounded-md border border-line-strong bg-blue-wash px-2 py-0.5 font-mono text-xs font-semibold"
          >
            {STEPS[step].name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PlayPauseButton playing={playing} onToggle={onTogglePlay} />
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-xl bg-neutral px-3 py-1.5 text-xs font-bold text-body transition-colors hover:bg-neutral-strong"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            className="border-line bg-blue-wash text-brand-blue hover:bg-blue-wash-hover rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors"
          >
            Next →
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl bg-neutral px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-neutral-strong"
          >
            Reset
          </button>
          <div className="ml-2 hidden items-center gap-1.5 border-l border-edge pl-2 text-xs text-muted sm:flex">
            <label htmlFor={speedId}>Speed:</label>
            <input
              id={speedId}
              type="range"
              min={0.5}
              max={2}
              step={0.25}
              value={speed}
              onChange={(event) =>
                onSpeedChange(parseFloat(event.target.value))
              }
              className="accent-brand-blue w-20 cursor-pointer"
            />
            <span className="text-ink font-bold">{formatSpeed(speed)}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-preview relative w-full overflow-hidden rounded-2xl border border-edge p-3 select-none">
        <HadamardCircuit step={step} />
      </div>
    </Card>
  )
}
