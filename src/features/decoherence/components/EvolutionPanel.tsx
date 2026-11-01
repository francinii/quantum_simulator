import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'
import { WAVE_SIZE } from '../lib/draw-wave'

interface EvolutionPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export function EvolutionPanel({ canvasRef }: EvolutionPanelProps) {
  return (
    <Card
      backgroundClass="bg-pink-tint"
      borderClass="border-pink-line"
      className="flex flex-col p-4"
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-brand-pink text-xs font-bold tracking-wider uppercase">
            Time Evolution
          </span>
          <h3 className="text-ink text-sm font-bold">
            Loss of Quantum Interference
          </h3>
        </div>
      </div>
      <div className="border-pink-line/60 w-full rounded-xl border bg-surface p-2">
        <canvas
          ref={canvasRef}
          width={WAVE_SIZE.width}
          height={WAVE_SIZE.height}
          className="block h-32 w-full"
          role="img"
          aria-label="Quantum wave and its decaying envelope"
        />
      </div>
      <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <span className="bg-brand-blue h-2 w-2 rounded-full" /> Quantum Wave
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-brand-pink-soft h-2 w-2 rounded-full" /> Envelope{' '}
          <Formula tex="e^{-t/T_2}" />
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-neutral-deep" /> Classical
        </span>
      </div>
    </Card>
  )
}
