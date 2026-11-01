import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'
import { PanelHeader } from '@/shared/components/PanelHeader'

interface PhasorPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export function PhasorPanel({ canvasRef }: PhasorPanelProps) {
  return (
    <Card className="flex-1 p-5">
      <PanelHeader
        bordered={false}
        title="Phasor Diagram"
        titleClass="text-fuchsia"
        chip="A⃗ + B⃗ = R⃗"
        chipClass="bg-pink-wash text-pink-strong"
      />
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="bg-surface-preview block h-auto w-full rounded-2xl border border-edge"
        role="img"
        aria-label="Phasor diagram showing arrows A, B and their sum R"
      />
      <p className="mt-2 text-[11px] text-muted">
        Each wave is an arrow whose angle is its phase. The resulting wave is
        the arrow sum: aligned arrows add up, opposite arrows cancel.
      </p>
    </Card>
  )
}
