import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'

const AMPLITUDE_FRACTION = 0.42
const SPATIAL_FREQUENCY = 0.08
const TEMPORAL_FREQUENCY = 6

export const WAVE_SIZE = { width: 400, height: 150 }

// The quantum wave and its envelope: both lose amplitude as coherence decays.
export function drawWavePlot(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  width: number,
  height: number,
  timeSeconds: number,
  decay: number,
) {
  ctx.clearRect(0, 0, width, height)

  ctx.strokeStyle = theme.grid
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, height / 2)
  ctx.lineTo(width, height / 2)
  ctx.stroke()

  const amplitude = height * AMPLITUDE_FRACTION * decay

  ctx.setLineDash([4, 4])
  ctx.strokeStyle = theme.pinkSoft
  ctx.lineWidth = 1.5
  for (const y of [height / 2 - amplitude, height / 2 + amplitude]) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  ctx.strokeStyle = theme.blue
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px < width; px++) {
    const wave =
      Math.sin(px * SPATIAL_FREQUENCY - timeSeconds * TEMPORAL_FREQUENCY) *
      amplitude
    if (px === 0) ctx.moveTo(px, height / 2 + wave)
    else ctx.lineTo(px, height / 2 + wave)
  }
  ctx.stroke()

  ctx.font = `10px ${theme.sans}`
  ctx.fillStyle = theme.muted
  ctx.textAlign = 'left'
  ctx.fillText(`Fringe Visibility = ${(decay * 100).toFixed(0)}%`, 10, 16)
}
