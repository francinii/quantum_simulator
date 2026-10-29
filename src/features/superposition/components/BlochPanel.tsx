import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'
import { PlayPauseButton } from '@/shared/components/PlayPauseButton'
import { Slider } from '@/shared/components/Slider'
import type { Outcome } from '@/shared/lib/quantum/bloch'

interface BlochPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  theta: number
  phi: number
  animating: boolean
  collapsedTo: Outcome | null
  onToggleAnimate: () => void
  onThetaChange: (value: number) => void
  onPhiChange: (value: number) => void
}

export function BlochPanel({
  canvasRef,
  theta,
  phi,
  animating,
  collapsedTo,
  onToggleAnimate,
  onThetaChange,
  onPhiChange,
}: BlochPanelProps) {
  return (
    <Card className="flex flex-col p-4 lg:col-span-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
          Bloch Sphere
        </span>
        <PlayPauseButton
          playing={animating}
          onToggle={onToggleAnimate}
          playLabel="Animate θ"
        />
      </div>

      <div className="bg-surface-preview relative w-full overflow-hidden rounded-2xl border border-slate-200">
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="block h-auto w-full"
          role="img"
          aria-label="Bloch sphere showing the qubit state vector"
        />
        {collapsedTo !== null && (
          <div
            role="status"
            className={`animate-collapse-flash absolute top-3 right-3 rounded-xl px-3 py-1.5 font-mono text-sm font-extrabold text-white shadow-md motion-reduce:animate-none ${
              collapsedTo === 0 ? 'bg-brand-blue' : 'bg-brand-pink'
            }`}
          >
            Measured: |{collapsedTo}⟩
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3 text-xs">
        <Slider
          label="Polar angle θ"
          labelHint="(controls the probabilities)"
          display={`${Math.round(theta)}°`}
          value={Math.round(theta)}
          min={0}
          max={180}
          step={1}
          tone="purple"
          onChange={onThetaChange}
        />
        <Slider
          label="Relative phase φ"
          labelHint="(does not change them)"
          display={`${Math.round(phi)}°`}
          value={Math.round(phi)}
          min={0}
          max={360}
          step={1}
          tone="pink"
          onChange={onPhiChange}
        />
      </div>
    </Card>
  )
}
