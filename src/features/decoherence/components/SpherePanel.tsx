import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import type { BlochSceneApi } from '../lib/bloch-scene'
import {
  purityText,
  type DecoherenceState,
  type PurityTier,
} from '../lib/physics'
import { BlochScene } from './BlochScene'

const BADGE_CLASSES: Record<PurityTier, string> = {
  pure: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  partial: 'bg-amber-50 text-amber-600 border-amber-200',
  mixture: 'bg-rose-50 text-rose-600 border-rose-200',
}

interface SpherePanelProps {
  sceneRef: RefObject<BlochSceneApi | null>
  theme: CanvasTheme
  state: DecoherenceState
}

const READOUTS = [
  { id: 'x', label: '|⟨X⟩| Coherence', className: 'text-brand-blue' },
  { id: 'y', label: '|⟨Y⟩| Phase', className: 'text-brand-purple' },
  { id: 'z', label: '⟨Z⟩ Population', className: 'text-brand-pink' },
]

export function SpherePanel({ sceneRef, theme, state }: SpherePanelProps) {
  const values = {
    x: state.coherenceX,
    y: state.phaseY,
    z: state.populationZ,
  }

  return (
    <Card
      backgroundClass="bg-surface-preview"
      className="relative flex flex-col justify-between overflow-hidden p-4 lg:col-span-7"
    >
      <div className="relative z-10 mb-2 flex items-center justify-between">
        <div>
          <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            3D Visualization
          </span>
          <h2 className="text-ink text-base font-bold">
            Bloch Sphere: Vector Collapse
          </h2>
        </div>
        <span
          data-testid="purity-badge"
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${BADGE_CLASSES[state.tier]}`}
        >
          {purityText(state)}
        </span>
      </div>

      <BlochScene sceneRef={sceneRef} theme={theme} />

      <div className="border-line/60 mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
        {READOUTS.map(({ id, label, className }) => (
          <div
            key={id}
            className="border-line/40 rounded-xl border bg-white p-2"
          >
            <div className="text-[11px] font-medium text-slate-400">
              {label}
            </div>
            <div
              data-testid={`readout-${id}`}
              className={`text-sm font-bold ${className}`}
            >
              {values[id as keyof typeof values].toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
