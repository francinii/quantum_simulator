import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import type { BellState } from './bell-states'
import type { BellSceneApi } from './bell-scene'
import { CIRCUIT_VIEWBOX } from './circuit-geometry'
import { blochArrows, sphereRotation } from './cycle'
import { drawBellCircuit } from './draw-circuit'

export const GIF_SIZE = 540
export const GIF_FRAME_COUNT = 28
export const GIF_FRAME_SECONDS = 0.12

export type FrameScene = Pick<BellSceneApi, 'update' | 'render' | 'canvas'>

const CIRCUIT_BOX = { x: 20, y: 75, width: 500, height: 180 }
const SPHERES_BOX = { x: 40, y: 265, width: 460, height: 210 }

export const gifFilename = (state: BellState) => `bell_state_${state.key}.gif`

const percent = (probability: number) => `${(probability * 100).toFixed(0)}%`

// One full cycle: the circuit at each frame's own moment beside the matching 3D spheres.
export function renderCycleFrames(
  theme: CanvasTheme,
  scene: FrameScene,
  state: BellState,
): string[] {
  const composite = document.createElement('canvas')
  composite.width = GIF_SIZE
  composite.height = GIF_SIZE
  const ctx = composite.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const center = GIF_SIZE / 2
  const [p00, p01, p10, p11] = state.finalProbabilities
  const footer = `P(00)=${percent(p00)}  |  P(11)=${percent(p11)}  |  P(01)=${percent(p01)}  |  P(10)=${percent(p10)}`
  const formulaColor = {
    blue: theme.blue,
    purple: theme.purple,
    pink: theme.pink,
    emerald: theme.emeraldDeep,
    sky: theme.sky,
  }[state.accent]
  const frames: string[] = []

  for (let i = 0; i < GIF_FRAME_COUNT; i++) {
    const progress = i / GIF_FRAME_COUNT
    scene.update(blochArrows(state, progress), sphereRotation(progress))
    scene.render()

    ctx.fillStyle = theme.surface
    ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE)

    ctx.fillStyle = theme.ink
    ctx.font = `bold 20px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText(state.title, center, 36)

    ctx.font = `13px ${theme.mono}`
    ctx.fillStyle = formulaColor
    ctx.fillText(state.formula, center, 58)

    ctx.save()
    ctx.translate(CIRCUIT_BOX.x, CIRCUIT_BOX.y)
    ctx.scale(
      CIRCUIT_BOX.width / CIRCUIT_VIEWBOX.width,
      CIRCUIT_BOX.height / CIRCUIT_VIEWBOX.height,
    )
    drawBellCircuit(ctx, theme, state, progress)
    ctx.restore()

    ctx.drawImage(
      scene.canvas,
      SPHERES_BOX.x,
      SPHERES_BOX.y,
      SPHERES_BOX.width,
      SPHERES_BOX.height,
    )

    ctx.fillStyle = theme.muted
    ctx.font = `11px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText(footer, center, 510)

    frames.push(composite.toDataURL('image/png'))
  }

  return frames
}
