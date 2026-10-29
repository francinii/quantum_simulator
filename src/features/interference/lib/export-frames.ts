import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { drawWaves } from './draw-waves'
import { classifyInterference, resultantAmplitude } from './physics'

export const GIF_SIZE = 540
export const GIF_FRAME_COUNT = 36
export const GIF_FRAME_SECONDS = 0.15

export function renderSweepFrames(
  theme: CanvasTheme,
  a: number,
  b: number,
): string[] {
  const canvas = document.createElement('canvas')
  canvas.width = GIF_SIZE
  canvas.height = GIF_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const center = GIF_SIZE / 2
  const frames: string[] = []

  for (let frame = 0; frame < GIF_FRAME_COUNT; frame++) {
    const phaseDeg = (frame / GIF_FRAME_COUNT) * 360
    const r = resultantAmplitude(a, b, phaseDeg)
    const info = classifyInterference(a, b, phaseDeg)

    ctx.fillStyle = theme.page
    ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE)

    ctx.fillStyle = theme.ink
    ctx.font = `bold 20px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Wave Interference', center, 34)
    ctx.font = `13px ${theme.sans}`
    ctx.fillStyle = theme.muted
    ctx.fillText(
      `Phase shift: ${Math.round(phaseDeg)}°  •  ${info.text}`,
      center,
      56,
    )

    drawWaves(ctx, theme, 30, 66, 480, 420, a, b, phaseDeg, 0)

    const max = a + b || 1
    ctx.fillStyle = theme.track
    ctx.beginPath()
    ctx.roundRect(30, 496, 480, 10, 5)
    ctx.fill()

    const gradient = ctx.createLinearGradient(30, 0, 510, 0)
    gradient.addColorStop(0, theme.blue)
    gradient.addColorStop(0.5, theme.purple)
    gradient.addColorStop(1, theme.pink)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(30, 496, Math.max(1, (480 * r) / max), 10, 5)
    ctx.fill()

    ctx.font = `9px ${theme.mono}`
    ctx.fillStyle = theme.faint
    ctx.fillText(`R = ${r.toFixed(2)}  •  Quantum Lab`, center, 526)

    frames.push(canvas.toDataURL('image/png'))
  }

  return frames
}
