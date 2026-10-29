import type { RefObject } from 'react'
import { OrbitSceneView } from '@/shared/components/OrbitSceneView'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { createBellScene, type BellSceneApi } from '../lib/bell-scene'

interface BellSceneProps {
  sceneRef: RefObject<BellSceneApi | null>
  theme: CanvasTheme
}

export function BellScene({ sceneRef, theme }: BellSceneProps) {
  return (
    <OrbitSceneView
      sceneRef={sceneRef}
      createScene={(container) => createBellScene(container, theme)}
      className="bg-surface-preview relative h-56 w-full overflow-hidden rounded-2xl border border-slate-200"
      ariaLabel="3D Bloch spheres for qubit 0 and qubit 1. Drag, or use the arrow keys, to rotate the view."
      hint="Drag to rotate 3D view"
      hintClassName="bottom-2 left-2 rounded-sm border border-slate-200 bg-white/90 px-2 py-0.5 text-[10px] text-slate-500 backdrop-blur-sm"
    />
  )
}
