import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { CIRCUIT_VIEWBOX } from './circuit-geometry'
import { drawHadamardCircuit } from './draw-circuit'
import {
  diracCardLines,
  matrixCardLines,
  probabilityLine,
  STEP_COUNT,
  STEPS,
} from './steps'

export const GIF_SIZE = 540
// Slow enough to read each step.
export const GIF_FRAME_SECONDS = 1.2

const CARD = { y: 225, width: 230, height: 235, matrixX: 30, diracX: 280 }

function drawCard(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  x: number,
  fill: string,
  stroke: string,
  titleColor: string,
  title: string,
  lines: string[],
) {
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(x, CARD.y, CARD.width, CARD.height, 16)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = titleColor
  ctx.font = `bold 13px ${theme.sans}`
  ctx.textAlign = 'left'
  ctx.fillText(title, x + 15, 250)

  ctx.fillStyle = theme.body
  ctx.font = `11px ${theme.mono}`
  lines.forEach((line, index) => ctx.fillText(line, x + 15, 280 + index * 25))
}

export function renderStepFrames(theme: CanvasTheme): string[] {
  const canvas = document.createElement('canvas')
  canvas.width = GIF_SIZE
  canvas.height = GIF_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const center = GIF_SIZE / 2
  const frames: string[] = []

  for (let step = 0; step < STEP_COUNT; step++) {
    ctx.fillStyle = theme.surface
    ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE)

    ctx.fillStyle = theme.ink
    ctx.font = `bold 20px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Hadamard Application (H ⊗ H)', center, 36)
    ctx.font = `12px ${theme.sans}`
    ctx.fillStyle = theme.muted
    ctx.fillText(STEPS[step].name, center, 56)

    ctx.save()
    ctx.translate(20, 70)
    ctx.scale(500 / CIRCUIT_VIEWBOX.width, 140 / CIRCUIT_VIEWBOX.height)
    drawHadamardCircuit(ctx, theme, step)
    ctx.restore()

    drawCard(
      ctx,
      theme,
      CARD.matrixX,
      theme.preview,
      theme.line,
      theme.sky,
      'Matrix Algebra (ℂ⁴)',
      matrixCardLines(step),
    )
    drawCard(
      ctx,
      theme,
      CARD.diracX,
      theme.pinkWash,
      theme.pinkLine,
      theme.pinkStrong,
      'Dirac Notation',
      diracCardLines(step),
    )

    ctx.fillStyle = theme.muted
    ctx.font = `11px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText(probabilityLine(STEPS[step].probabilities), center, 495)
    ctx.font = `9px ${theme.mono}`
    ctx.fillStyle = theme.faint
    ctx.fillText('Quantum Lab', center, 520)

    frames.push(canvas.toDataURL('image/png'))
  }

  return frames
}
