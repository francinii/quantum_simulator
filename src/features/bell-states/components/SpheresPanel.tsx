import type { RefObject } from 'react'
import { Card } from '@/shared/components/Card'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import type { BellSceneApi } from '../lib/bell-scene'
import { entropyLabel, isEntangled } from '../lib/cycle'
import { BellScene } from './BellScene'

interface SpheresPanelProps {
  sceneRef: RefObject<BellSceneApi | null>
  theme: CanvasTheme
  progress: number
}

export function SpheresPanel({ sceneRef, theme, progress }: SpheresPanelProps) {
  const entangled = isEntangled(progress)

  return (
    <Card className="flex flex-col justify-between p-5">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <span className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            3D Spatial Visualization
          </span>
          <h2 className="text-ink text-sm font-bold">
            Bloch Spheres: Qubit 0 & Qubit 1
          </h2>
        </div>
        <span
          data-testid="entanglement-badge"
          className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
            entangled
              ? 'text-brand-pink animate-pulse border-rose-edge bg-rose-wash'
              : 'border-edge bg-neutral text-muted'
          }`}
        >
          {entangled
            ? 'Maximal Entanglement (EPR)!'
            : 'Separable: Not Entangled'}
        </span>
      </div>
      <p className="mb-2 text-[11px] text-faint">
        Upon completing CNOT, the individual state shrinks to the center
        (maximal entanglement).
      </p>

      <BellScene sceneRef={sceneRef} theme={theme} />

      <div className="mt-3 rounded-xl border border-edge bg-neutral-soft p-2.5 text-center text-xs">
        <span className="font-medium text-muted">Entanglement Entropy: </span>
        <span data-testid="entropy" className="text-brand-pink font-bold">
          {entropyLabel(progress)}
        </span>
        <span className="ml-1 font-mono text-faint">(EPR Pair: 1.00)</span>
      </div>
    </Card>
  )
}
