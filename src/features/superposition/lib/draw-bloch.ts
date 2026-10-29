import {
  drawBlochSphere,
  drawStateArrow,
  projectBloch,
} from '@/shared/lib/canvas/bloch-sphere'
import { blochVector, type Outcome } from '@/shared/lib/quantum/bloch'
import { withAlpha, type CanvasTheme } from '@/shared/lib/theme/canvas-theme'

const LABEL_DISTANCE = 1.17

export function drawBloch(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  cx: number,
  cy: number,
  radius: number,
  thetaDeg: number,
  phiDeg: number,
  highlightPole: Outcome | null,
) {
  drawBlochSphere(ctx, theme, cx, cy, radius)

  const axes = [
    { v: { x: 0, y: 0, z: 1 }, label: '|0⟩', color: theme.blue, pole: 0 },
    { v: { x: 0, y: 0, z: -1 }, label: '|1⟩', color: theme.pink, pole: 1 },
    { v: { x: 1, y: 0, z: 0 }, label: '|+⟩', color: theme.purple, pole: null },
    { v: { x: -1, y: 0, z: 0 }, label: '|−⟩', color: theme.purple, pole: null },
    { v: { x: 0, y: 1, z: 0 }, label: '|+i⟩', color: theme.sky, pole: null },
  ]
  const origin = projectBloch({ x: 0, y: 0, z: 0 }, cx, cy, radius)
  for (const axis of axes) {
    const end = projectBloch(axis.v, cx, cy, radius)
    ctx.strokeStyle = theme.axis
    ctx.lineWidth = 1
    ctx.setLineDash([3, 4])
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.setLineDash([])

    const label = projectBloch(
      {
        x: axis.v.x * LABEL_DISTANCE,
        y: axis.v.y * LABEL_DISTANCE,
        z: axis.v.z * LABEL_DISTANCE,
      },
      cx,
      cy,
      radius,
    )
    const highlighted = axis.pole !== null && axis.pole === highlightPole
    ctx.fillStyle = axis.color
    ctx.font = `bold ${highlighted ? 22 : 16}px ${theme.mono}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(axis.label, label.x, label.y)
  }
  ctx.textBaseline = 'alphabetic'

  const state = blochVector(thetaDeg, phiDeg)
  const tip = projectBloch(state, cx, cy, radius)
  const shadow = projectBloch({ ...state, z: 0 }, cx, cy, radius)

  // Dotted path down to the equator and along it shows the phase φ.
  ctx.strokeStyle = withAlpha(theme.pink, 0.5)
  ctx.lineWidth = 1.5
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(origin.x, origin.y)
  ctx.lineTo(shadow.x, shadow.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.stroke()
  ctx.setLineDash([])

  drawStateArrow(ctx, theme, cx, cy, radius, state)
}
