import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import type { BellState } from './bell-states'
import {
  CNOT,
  CURSOR_Y,
  GATE_BOTTOM_Y,
  GATE_SIZE,
  GATE_TOP_Y,
  H_GATE_X,
  PHOTON_RADIUS,
  WIRES,
  X_GATE_X,
} from './circuit-geometry'
import { cursorX } from './cycle'

function drawWire(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  y: number,
  name: string,
) {
  ctx.fillStyle = theme.ink
  ctx.font = `bold 16px ${theme.mono}`
  ctx.textAlign = 'left'
  ctx.fillText('|0⟩', 30, y + 5)

  ctx.strokeStyle = theme.faint
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(WIRES.startX, y)
  ctx.lineTo(WIRES.endX, y)
  ctx.stroke()
  ctx.lineCap = 'butt'

  ctx.fillStyle = theme.faint
  ctx.font = `600 12px ${theme.mono}`
  ctx.fillText(name, 535, y + 5)
}

function drawGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  fromColor: string,
  toColor: string,
  strokeColor: string,
  textColor: string,
  font: string,
) {
  ctx.save()
  ctx.translate(x, y)
  const gradient = ctx.createLinearGradient(0, 0, GATE_SIZE, GATE_SIZE)
  gradient.addColorStop(0, fromColor)
  gradient.addColorStop(1, toColor)
  ctx.fillStyle = gradient
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(0, 0, GATE_SIZE, GATE_SIZE, 10)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = textColor
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.fillText(label, GATE_SIZE / 2, 32)
  ctx.restore()
}

function drawCnot(ctx: CanvasRenderingContext2D, theme: CanvasTheme) {
  ctx.strokeStyle = theme.night
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(CNOT.x, WIRES.q0)
  ctx.lineTo(CNOT.x, WIRES.q1)
  ctx.stroke()

  ctx.fillStyle = theme.night
  ctx.beginPath()
  ctx.arc(CNOT.x, WIRES.q0, CNOT.controlRadius, 0, 2 * Math.PI)
  ctx.fill()

  const gradient = ctx.createLinearGradient(
    CNOT.x - CNOT.targetRadius,
    WIRES.q1 - CNOT.targetRadius,
    CNOT.x + CNOT.targetRadius,
    WIRES.q1 + CNOT.targetRadius,
  )
  gradient.addColorStop(0, theme.sphereSky)
  gradient.addColorStop(1, theme.gateEnd)
  ctx.fillStyle = gradient
  ctx.strokeStyle = theme.sky
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(CNOT.x, WIRES.q1, CNOT.targetRadius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = theme.skyDeep
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.moveTo(CNOT.x, WIRES.q1 - 20)
  ctx.lineTo(CNOT.x, WIRES.q1 + 20)
  ctx.moveTo(CNOT.x - 20, WIRES.q1)
  ctx.lineTo(CNOT.x + 20, WIRES.q1)
  ctx.stroke()
}

function drawPhoton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(x, y, PHOTON_RADIUS, 0, 2 * Math.PI)
  ctx.fill()
  ctx.shadowBlur = 0
}

// Draws the 620x220 circuit for a state at a point of its cycle; the caller positions and scales it.
export function drawBellCircuit(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  state: BellState,
  progress: number,
) {
  drawWire(ctx, theme, WIRES.q0, 'q₀')
  drawWire(ctx, theme, WIRES.q1, 'q₁')

  if (state.needsX0) {
    drawGate(
      ctx,
      X_GATE_X,
      GATE_TOP_Y,
      'X',
      theme.pinkPastel,
      theme.pinkGate,
      theme.pinkGate,
      theme.pinkText,
      `bold 20px ${theme.sans}`,
    )
  }
  if (state.needsX1) {
    drawGate(
      ctx,
      X_GATE_X,
      GATE_BOTTOM_Y,
      'X',
      theme.pinkPastel,
      theme.pinkGate,
      theme.pinkGate,
      theme.pinkText,
      `bold 20px ${theme.sans}`,
    )
  }
  drawGate(
    ctx,
    H_GATE_X,
    GATE_TOP_Y,
    'H',
    theme.sphereSky,
    theme.skyLight,
    theme.gateEnd,
    theme.skyDeep,
    `bold 20px ${theme.sans}`,
  )
  drawCnot(ctx, theme)

  ctx.strokeStyle = theme.pinkSoft
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(500, 50)
  ctx.quadraticCurveTo(515, 50, 515, 107.5)
  ctx.quadraticCurveTo(515, 110, 525, 110)
  ctx.quadraticCurveTo(515, 110, 515, 112.5)
  ctx.quadraticCurveTo(515, 170, 500, 170)
  ctx.stroke()
  ctx.lineCap = 'butt'
  ctx.fillStyle = theme.pink
  ctx.font = `bold 14px ${theme.mono}`
  ctx.textAlign = 'left'
  ctx.fillText(state.symbol, 540, 115)

  const x = cursorX(progress)
  ctx.save()
  ctx.globalAlpha = 0.75
  ctx.strokeStyle = theme.purple
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(x, CURSOR_Y.from)
  ctx.lineTo(x, CURSOR_Y.to)
  ctx.stroke()
  ctx.restore()
  ctx.setLineDash([])

  drawPhoton(ctx, x, WIRES.q0, theme.blue)
  drawPhoton(ctx, x, WIRES.q1, theme.pink)
}
