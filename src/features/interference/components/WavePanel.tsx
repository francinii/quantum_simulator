import { useId, type RefObject } from 'react'
import { Card } from '@/shared/components/Card'
import { PlayPauseButton } from '@/shared/components/PlayPauseButton'
import type { InterferenceInfo } from '../lib/physics'
import { TYPE_STYLES } from '../lib/type-styles'

interface WavePanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  info: InterferenceInfo
  playing: boolean
  onTogglePlay: () => void
  speed: number
  onSpeedChange: (speed: number) => void
}

const formatSpeed = (speed: number) => `${speed.toFixed(2).replace(/0$/, '')}x`

export function WavePanel({
  canvasRef,
  info,
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
}: WavePanelProps) {
  const speedId = useId()

  return (
    <Card className="p-4 lg:col-span-8">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            Wave Superposition
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${TYPE_STYLES[info.kind].badge}`}
          >
            {info.text}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PlayPauseButton playing={playing} onToggle={onTogglePlay} />
          <div className="ml-2 hidden items-center gap-1.5 border-l border-slate-200 pl-2 text-xs text-slate-500 sm:flex">
            <label htmlFor={speedId}>Speed:</label>
            <input
              id={speedId}
              type="range"
              min={0.25}
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

      <div className="bg-surface-preview relative w-full overflow-hidden rounded-2xl border border-slate-200">
        <canvas
          ref={canvasRef}
          width={900}
          height={560}
          className="block h-auto w-full"
          role="img"
          aria-label="Animated waves A and B and their sum"
        />
      </div>
    </Card>
  )
}
