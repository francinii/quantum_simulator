import { useId } from 'react'
import { Card } from '@/shared/components/Card'
import { PlayPauseButton } from '@/shared/components/PlayPauseButton'
import { formatSpeed } from '@/shared/lib/format-speed'
import type { ShotView } from '../lib/shot-machine'
import type { Setup } from '../lib/setup'
import { MeasurementCircuit } from './MeasurementCircuit'

export const MANY_SHOTS = 1024

interface CircuitPanelProps {
  setup: Setup
  view: ShotView
  autoRunning: boolean
  speed: number
  lastShot: string
  onToggleAutoRun: () => void
  onOneShot: () => void
  onManyShots: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
}

export function CircuitPanel({
  setup,
  view,
  autoRunning,
  speed,
  lastShot,
  onToggleAutoRun,
  onOneShot,
  onManyShots,
  onReset,
  onSpeedChange,
}: CircuitPanelProps) {
  const speedId = useId()

  return (
    <Card className="flex flex-col p-4 lg:col-span-8">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            Circuit Diagram
          </span>
          <span
            data-testid="stage-label"
            className="text-brand-blue rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold"
          >
            {view.stageLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PlayPauseButton
            playing={autoRunning}
            onToggle={onToggleAutoRun}
            playLabel="Auto-run"
          />
          <button
            type="button"
            onClick={onOneShot}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            1 shot
          </button>
          <button
            type="button"
            onClick={onManyShots}
            className="border-line bg-blue-wash text-brand-blue hover:bg-blue-wash-hover rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors"
          >
            shots = {MANY_SHOTS}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-200"
          >
            Reset
          </button>
          <div className="ml-1 hidden items-center gap-1.5 border-l border-slate-200 pl-2 text-xs text-slate-500 sm:flex">
            <label htmlFor={speedId}>Speed:</label>
            <input
              id={speedId}
              type="range"
              min={0.5}
              max={3}
              step={0.25}
              value={speed}
              onChange={(event) =>
                onSpeedChange(parseFloat(event.target.value))
              }
              className="accent-brand-blue w-16 cursor-pointer"
            />
            <span className="text-ink font-bold">{formatSpeed(speed)}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-preview flex w-full flex-1 items-center overflow-hidden rounded-2xl border border-slate-200 p-3 select-none">
        <MeasurementCircuit setup={setup} view={view} />
      </div>

      <div
        data-testid="last-shot"
        className="mt-3 text-center font-mono text-xs text-slate-500"
      >
        {lastShot}
      </div>
    </Card>
  )
}
