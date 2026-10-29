import { useId } from 'react'
import { Card } from '@/shared/components/Card'
import { PlayPauseButton } from '@/shared/components/PlayPauseButton'
import { formatSpeed } from '@/shared/lib/format-speed'
import type { BellState } from '../lib/bell-states'
import { phaseLabel, stepIndex } from '../lib/cycle'
import { BellCircuit } from './BellCircuit'

interface CircuitPanelProps {
  state: BellState
  progress: number
  playing: boolean
  speed: number
  onTogglePlay: () => void
  onReset: () => void
  onStep: () => void
  onSpeedChange: (speed: number) => void
}

export function CircuitPanel({
  state,
  progress,
  playing,
  speed,
  onTogglePlay,
  onReset,
  onStep,
  onSpeedChange,
}: CircuitPanelProps) {
  const speedId = useId()

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            Quantum Circuit Diagram
          </span>
          <h2 className="text-ink text-base font-bold">{state.title}</h2>
        </div>
        <span
          data-testid="step-badge"
          className="text-brand-blue rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold"
        >
          Step {stepIndex(state, progress)}: {phaseLabel(progress)}
        </span>
      </div>

      <div className="bg-surface-preview relative w-full overflow-hidden rounded-2xl border border-slate-200 p-4">
        <BellCircuit state={state} progress={progress} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <PlayPauseButton
            playing={playing}
            onToggle={onTogglePlay}
            variant="roomy"
          />
          <button
            type="button"
            onClick={onReset}
            className="border-line bg-blue-wash text-brand-blue hover:bg-blue-wash-hover rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onStep}
            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Step →
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <label htmlFor={speedId}>Speed:</label>
          <input
            id={speedId}
            type="range"
            min={0.5}
            max={2.5}
            step={0.25}
            value={speed}
            onChange={(event) => onSpeedChange(parseFloat(event.target.value))}
            className="accent-brand-blue w-24 cursor-pointer"
          />
          <span className="text-ink font-bold">{formatSpeed(speed)}</span>
        </div>
      </div>
    </Card>
  )
}
