import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'

interface BlochPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  caption: string
}

export function BlochPanel({ canvasRef, caption }: BlochPanelProps) {
  return (
    <Card className="p-4 lg:col-span-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-fuchsia-500 uppercase">
          Bloch Sphere
        </span>
        <span
          data-testid="bloch-caption"
          className="rounded-sm bg-pink-50 px-2 py-0.5 font-mono text-[11px] font-bold text-pink-600"
        >
          {caption}
        </span>
      </div>
      <div className="bg-surface-preview w-full overflow-hidden rounded-2xl border border-slate-200">
        <canvas
          ref={canvasRef}
          width={420}
          height={400}
          className="block h-auto w-full"
          role="img"
          aria-label="Bloch sphere with the measurement axis and the state vector"
        />
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        The thick colored line is the <strong>measurement axis</strong>. A
        measurement snaps the arrow to one of its two ends; the closer the arrow
        already is to an end, the more likely that outcome.
      </p>
    </Card>
  )
}
