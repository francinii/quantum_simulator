import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { CONNECTOR, GATE, PHOTON_RADIUS, WIRES } from './circuit-geometry'
import { STEPS } from './steps'

function drawWire(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  y: number,
  labelY: number,
  qubit: string,
) {
  ctx.fillStyle = theme.ink
  ctx.font = `bold 16px ${theme.mono}`
  ctx.textAlign = 'left'
  ctx.fillText('|0⟩', 35, labelY)

  ctx.strokeStyle = theme.faint
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(WIRES.startX, y)
  ctx.lineTo(WIRES.endX, y)
  ctx.stroke()
  ctx.lineCap = 'butt'

  ctx.font = `12px ${theme.mono}`
  ctx.fillStyle = theme.faint
  ctx.fillText(qubit, 635, labelY)
}

function drawGate(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  y: number,
  glow: boolean,
) {
  ctx.save()
  ctx.translate(GATE.x, y)

  const gradient = ctx.createLinearGradient(0, 0, GATE.size, GATE.size)
  gradient.addColorStop(0, theme.pinkPale)
  gradient.addColorStop(1, theme.pinkSoft)
  ctx.fillStyle = gradient
  ctx.strokeStyle = theme.pink
  ctx.lineWidth = glow ? 3 : 1.8
  if (glow) {
    ctx.shadowColor = theme.pinkSoft
    ctx.shadowBlur = 8
  }
  ctx.beginPath()
  ctx.roundRect(0, 0, GATE.size, GATE.size, 10)
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0

  ctx.fillStyle = theme.pinkText
  ctx.font = `800 22px ${theme.sans}`
  ctx.textAlign = 'center'
  ctx.fillText('H', GATE.size / 2, 32)
  ctx.restore()
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

// Draws the 700x180 circuit for a step; the caller positions and scales it.
export function drawHadamardCircuit(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  step: number,
) {
  const { cursorX, gatesGlow } = STEPS[step]

  drawWire(ctx, theme, WIRES.q0, 60, 'q₀')
  drawWire(ctx, theme, WIRES.q1, 130, 'q₁')

  ctx.strokeStyle = theme.blue
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(22, 45)
  ctx.quadraticCurveTo(12, 85, 2, 90)
  ctx.quadraticCurveTo(12, 95, 22, 135)
  ctx.stroke()
  ctx.lineCap = 'butt'
  ctx.fillStyle = theme.blue
  ctx.font = `bold 10px ${theme.sans}`
  ctx.textAlign = 'center'
  ctx.fillText('|00⟩', 5, 105)

  drawGate(ctx, theme, GATE.topY, gatesGlow)
  drawGate(ctx, theme, GATE.bottomY, gatesGlow)

  ctx.strokeStyle = theme.pinkSoft
  ctx.lineWidth = 2
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(CONNECTOR.x, CONNECTOR.fromY)
  ctx.lineTo(CONNECTOR.x, CONNECTOR.toY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = theme.pink
  ctx.font = `bold 12px ${theme.mono}`
  ctx.textAlign = 'left'
  ctx.fillText('H ⊗ H', 320, 94)

  ctx.strokeStyle = theme.purple
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(570, 40)
  ctx.quadraticCurveTo(585, 40, 585, 87.5)
  ctx.quadraticCurveTo(585, 90, 595, 90)
  ctx.quadraticCurveTo(585, 90, 585, 92.5)
  ctx.quadraticCurveTo(585, 140, 570, 140)
  ctx.stroke()
  ctx.lineCap = 'butt'
  ctx.fillStyle = theme.purple
  ctx.font = `bold 13px ${theme.mono}`
  ctx.fillText('|ψ₁⟩', 605, 95)

  ctx.save()
  ctx.globalAlpha = 0.8
  ctx.strokeStyle = theme.purple
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(cursorX, 10)
  ctx.lineTo(cursorX, 170)
  ctx.stroke()
  ctx.restore()
  ctx.setLineDash([])

  drawPhoton(ctx, cursorX, WIRES.q0, theme.blue)
  drawPhoton(ctx, cursorX, WIRES.q1, theme.pink)
}
