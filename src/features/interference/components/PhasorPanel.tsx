import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'

interface PhasorPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export function PhasorPanel({ canvasRef }: PhasorPanelProps) {
  return (
    <Card className="flex-1 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-extrabold tracking-wider text-fuchsia-500 uppercase">
          Phasor Diagram
        </h2>
        <span className="rounded-sm bg-pink-50 px-2 py-0.5 font-mono text-[11px] font-bold text-pink-600">
          A⃗ + B⃗ = R⃗
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="bg-surface-preview block h-auto w-full rounded-2xl border border-slate-200"
        role="img"
        aria-label="Phasor diagram showing arrows A, B and their sum R"
      />
      <p className="mt-2 text-[11px] text-slate-500">
        Each wave is an arrow whose angle is its phase. The resulting wave is
        the arrow sum: aligned arrows add up, opposite arrows cancel.
      </p>
    </Card>
  )
}
