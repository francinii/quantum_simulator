import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'

const ARROW_HEAD_LENGTH = 10
const ARROW_HEAD_ANGLE = 0.4
const MIN_ARROW_LENGTH_FOR_HEAD = 4
// Slow shared rotation shows that the whole diagram turns together.
const ROTATION_RATE = 0.25

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  if (Math.hypot(x2 - x1, y2 - y1) < MIN_ARROW_LENGTH_FOR_HEAD) return

  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - ARROW_HEAD_LENGTH * Math.cos(angle - ARROW_HEAD_ANGLE),
    y2 - ARROW_HEAD_LENGTH * Math.sin(angle - ARROW_HEAD_ANGLE),
  )
  ctx.lineTo(
    x2 - ARROW_HEAD_LENGTH * Math.cos(angle + ARROW_HEAD_ANGLE),
    y2 - ARROW_HEAD_LENGTH * Math.sin(angle + ARROW_HEAD_ANGLE),
  )
  ctx.closePath()
  ctx.fill()
}

export function drawPhasors(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  cx: number,
  cy: number,
  scale: number,
  a: number,
  b: number,
  phaseDeg: number,
  time: number,
) {
  const phi = (phaseDeg * Math.PI) / 180
  const base = -time * ROTATION_RATE

  ctx.strokeStyle = theme.track
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.arc(cx, cy, 2 * scale, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])

  const ax = cx + a * scale * Math.cos(base)
  const ay = cy - a * scale * Math.sin(base)
  const bx = ax + b * scale * Math.cos(base + phi)
  const by = ay - b * scale * Math.sin(base + phi)

  drawArrow(ctx, cx, cy, bx, by, theme.ink, 4)
  drawArrow(ctx, cx, cy, ax, ay, theme.blue, 3)
  drawArrow(ctx, ax, ay, bx, by, theme.pink, 3)

  ctx.fillStyle = theme.ink
  ctx.beginPath()
  ctx.arc(cx, cy, 3.5, 0, 2 * Math.PI)
  ctx.fill()
}
