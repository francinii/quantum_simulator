import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import type { BlochSceneApi } from './bloch-scene'
import { drawWavePlot, WAVE_SIZE } from './draw-wave'
import { CYCLE_SECONDS, stateAt, type Mechanism } from './physics'

export const GIF_SIZE = 540
export const GIF_FRAME_COUNT = 30
// 10 frames per second.
export const GIF_FRAME_SECONDS = 0.1

export const MECHANISM_SUBTITLE: Record<Mechanism, string> = {
  dephasing: 'Phase & Interference Loss (T₂)',
  relaxation: 'Energy Relaxation to Ground State (T₁)',
}

export type FrameScene = Pick<BlochSceneApi, 'update' | 'render' | 'canvas'>

// One full decoherence cycle: the 3D view and the wave plot on a single frame.
export function renderCycleFrames(
  theme: CanvasTheme,
  scene: FrameScene,
  mechanism: Mechanism,
  rate: number,
): string[] {
  const composite = document.createElement('canvas')
  composite.width = GIF_SIZE
  composite.height = GIF_SIZE
  const ctx = composite.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const wave = document.createElement('canvas')
  wave.width = WAVE_SIZE.width
  wave.height = WAVE_SIZE.height
  const waveCtx = wave.getContext('2d')
  if (!waveCtx) throw new Error('Canvas is not supported in this browser.')

  const center = GIF_SIZE / 2
  const step = CYCLE_SECONDS / GIF_FRAME_COUNT
  const frames: string[] = []

  for (let i = 0; i < GIF_FRAME_COUNT; i++) {
    const time = i * step
    const state = stateAt(time, mechanism, rate)
    scene.update(state, time)
    scene.render()
    drawWavePlot(
      waveCtx,
      theme,
      WAVE_SIZE.width,
      WAVE_SIZE.height,
      time,
      state.decay,
    )

    ctx.fillStyle = theme.surface
    ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE)

    ctx.fillStyle = theme.inkDeep
    ctx.font = `bold 22px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Quantum Decoherence', center, 34)
    ctx.font = `13px ${theme.sans}`
    ctx.fillStyle = theme.muted
    ctx.fillText(MECHANISM_SUBTITLE[mechanism], center, 54)

    ctx.drawImage(scene.canvas, 30, 68, 480, 310)
    ctx.drawImage(wave, 40, 385, 460, 115)

    ctx.fillStyle = theme.blue
    ctx.font = `bold 12px ${theme.sans}`
    ctx.textAlign = 'right'
    ctx.fillText(
      `Coherence: ${(state.decay * 100).toFixed(0)}%`,
      GIF_SIZE - 45,
      520,
    )

    frames.push(composite.toDataURL('image/png'))
  }

  return frames
}
