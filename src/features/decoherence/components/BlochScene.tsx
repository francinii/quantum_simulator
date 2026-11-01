import type { RefObject } from 'react'
import { OrbitSceneView } from '@/shared/components/OrbitSceneView'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { createBlochScene, type BlochSceneApi } from '../lib/bloch-scene'

interface BlochSceneProps {
  sceneRef: RefObject<BlochSceneApi | null>
  theme: CanvasTheme
}

export function BlochScene({ sceneRef, theme }: BlochSceneProps) {
  return (
    <OrbitSceneView
      sceneRef={sceneRef}
      rebuildKey={theme}
      createScene={(container) => createBlochScene(container, theme)}
      className="relative h-72 w-full rounded-xl border border-edge/60 bg-surface/70 sm:h-80 md:h-96"
      ariaLabel="3D Bloch sphere. Drag, or use the arrow keys, to rotate the view."
      hint="Drag with mouse to rotate camera"
      hintClassName="bottom-3 left-3 z-10 rounded-md border border-edge bg-surface/90 px-2.5 py-1 text-[11px] text-muted shadow-xs backdrop-blur-sm"
    />
  )
}
