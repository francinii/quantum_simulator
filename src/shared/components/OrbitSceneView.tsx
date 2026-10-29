import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from 'react'
import {
  keyToDrag,
  MOUSE_SENSITIVITY,
  TOUCH_SENSITIVITY,
} from '@/shared/lib/three/orbit'
import { isWebGLAvailable } from '@/shared/lib/three/webgl-support'

// What the view needs from a 3D scene; each simulator adds its own methods on top.
export interface OrbitSceneApi {
  orbit(dx: number, dy: number, sensitivity: number): void
  render(): void
  resize(): void
  dispose(): void
}

interface OrbitSceneViewProps<T extends OrbitSceneApi> {
  sceneRef: RefObject<T | null>
  // Builds the scene inside the container; may throw if WebGL fails.
  createScene: (container: HTMLElement) => T
  className: string
  ariaLabel: string
  hint: string
  hintClassName: string
}

interface Drag {
  x: number
  y: number
  sensitivity: number
}

export function OrbitSceneView<T extends OrbitSceneApi>({
  sceneRef,
  createScene,
  className,
  ariaLabel,
  hint,
  hintClassName,
}: OrbitSceneViewProps<T>) {
  const container = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const [webgl] = useState(isWebGLAvailable)

  // Callers pass a new function every render; the scene must be built once.
  const create = useRef(createScene)
  useEffect(() => {
    create.current = createScene
  })

  useEffect(() => {
    const element = container.current
    if (!webgl || !element) return

    const scene = create.current(element)
    sceneRef.current = scene

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            scene.resize()
            scene.render()
          })
    observer?.observe(element)

    return () => {
      observer?.disconnect()
      scene.dispose()
      sceneRef.current = null
    }
  }, [webgl, sceneRef])

  const turn = (dx: number, dy: number, sensitivity: number) => {
    sceneRef.current?.orbit(dx, dy, sensitivity)
    // The loop is not drawing while paused, so redraw the new viewpoint right away.
    sceneRef.current?.render()
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      sensitivity:
        event.pointerType === 'touch' ? TOUCH_SENSITIVITY : MOUSE_SENSITIVITY,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current) return
    turn(
      event.clientX - current.x,
      event.clientY - current.y,
      current.sensitivity,
    )
    drag.current = { ...current, x: event.clientX, y: event.clientY }
  }

  const endDrag = () => {
    drag.current = null
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = keyToDrag(event.key)
    if (!step) return
    event.preventDefault()
    turn(step[0], step[1], MOUSE_SENSITIVITY)
  }

  if (!webgl) {
    return (
      <div
        role="alert"
        className={`${className} flex items-center justify-center p-4 text-center text-xs text-slate-500`}
      >
        The 3D view needs WebGL, which is not available in this browser.
      </div>
    )
  }

  return (
    <div
      ref={container}
      role="application"
      tabIndex={0}
      aria-label={ariaLabel}
      className={`${className} focus-visible:outline-brand-purple cursor-grab touch-none focus-visible:outline-2 active:cursor-grabbing`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      <div className={`pointer-events-none absolute ${hintClassName}`}>
        {hint}
      </div>
    </div>
  )
}
