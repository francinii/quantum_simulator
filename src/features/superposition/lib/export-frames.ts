import { outcomeProbabilities } from '@/shared/lib/quantum/bloch'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { drawBloch } from './draw-bloch'

export const GIF_SIZE = 540
export const GIF_FRAME_SECONDS = 0.15
const SWEEP_STEPS = 18

// |0⟩ → |1⟩ → |0⟩, without repeating either pole so the loop is seamless.
export function sweepAngles(): number[] {
  const angles: number[] = []
  for (let i = 0; i <= SWEEP_STEPS; i++) angles.push((i * 180) / SWEEP_STEPS)
  for (let i = SWEEP_STEPS - 1; i > 0; i--) angles.push((i * 180) / SWEEP_STEPS)
  return angles
}

function drawProbabilityBar(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  x: number,
  y: number,
  width: number,
  label: string,
  probability: number,
  color: string,
) {
  ctx.fillStyle = theme.ink
  ctx.font = `bold 14px ${theme.mono}`
  ctx.textAlign = 'left'
  ctx.fillText(label, x, y + 13)

  ctx.fillStyle = theme.track
  ctx.beginPath()
  ctx.roundRect(x + 44, y, width - 110, 18, 9)
  ctx.fill()

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x + 44, y, Math.max(2, (width - 110) * probability), 18, 9)
  ctx.fill()

  ctx.font = `bold 14px ${theme.sans}`
  ctx.textAlign = 'right'
  ctx.fillText(`${(probability * 100).toFixed(0)}%`, x + width, y + 14)
}

export function renderSweepFrames(
  theme: CanvasTheme,
  phiDeg: number,
): string[] {
  const canvas = document.createElement('canvas')
  canvas.width = GIF_SIZE
  canvas.height = GIF_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const center = GIF_SIZE / 2

  return sweepAngles().map((theta) => {
    const [p0, p1] = outcomeProbabilities(theta)

    ctx.fillStyle = theme.page
    ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE)

    ctx.fillStyle = theme.ink
    ctx.font = `bold 20px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Quantum Superposition', center, 34)
    ctx.font = `13px ${theme.sans}`
    ctx.fillStyle = theme.muted
    ctx.fillText(
      `θ = ${Math.round(theta)}°   •   |ψ⟩ = ${Math.sqrt(p0).toFixed(2)}|0⟩ + ${Math.sqrt(p1).toFixed(2)}|1⟩`,
      center,
      56,
    )

    drawBloch(ctx, theme, center, 225, 135, theta, phiDeg, null)

    ctx.fillStyle = theme.ink
    ctx.font = `bold 12px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText(
      "Measurement probabilities  (Born's rule: P = |amplitude|²)",
      center,
      418,
    )
    drawProbabilityBar(ctx, theme, 60, 434, 420, '|0⟩', p0, theme.blue)
    drawProbabilityBar(ctx, theme, 60, 466, 420, '|1⟩', p1, theme.pink)

    ctx.font = `9px ${theme.mono}`
    ctx.fillStyle = theme.faint
    ctx.textAlign = 'center'
    ctx.fillText('Qiskit Fall Fest 2026', center, 524)

    return canvas.toDataURL('image/png')
  })
}
