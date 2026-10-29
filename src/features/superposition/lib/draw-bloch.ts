import { blochVector, type Outcome } from '@/shared/lib/quantum/bloch'
import { withAlpha, type CanvasTheme } from '@/shared/lib/theme/canvas-theme'

const VIEW_AZIMUTH = (-35 * Math.PI) / 180
const VIEW_ELEVATION = (18 * Math.PI) / 180
const EQUATOR_STEP_DEG = 3
const LABEL_DISTANCE = 1.17

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  radius: number,
) {
  const xr = x * Math.cos(VIEW_AZIMUTH) - y * Math.sin(VIEW_AZIMUTH)
  const yr = x * Math.sin(VIEW_AZIMUTH) + y * Math.cos(VIEW_AZIMUTH)
  return {
    x: cx + radius * yr,
    y:
      cy -
      radius * (z * Math.cos(VIEW_ELEVATION) - xr * Math.sin(VIEW_ELEVATION)),
    depth: xr,
  }
}

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
  const sphere = ctx.createRadialGradient(
    cx - radius * 0.3,
    cy - radius * 0.3,
    radius * 0.1,
    cx,
    cy,
    radius,
  )
  sphere.addColorStop(0, theme.surface)
  sphere.addColorStop(1, theme.sphereEdge)
  ctx.fillStyle = sphere
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = theme.line
  ctx.lineWidth = 2
  ctx.stroke()

  // Equator: the far half is dashed, the near half solid.
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath()
    ctx.setLineDash(pass === 0 ? [4, 5] : [])
    let started = false
    for (let angle = 0; angle <= 360; angle += EQUATOR_STEP_DEG) {
      const rad = (angle * Math.PI) / 180
      const p = project(Math.cos(rad), Math.sin(rad), 0, cx, cy, radius)
      const front = p.depth >= 0
      if ((pass === 1) === front) {
        if (!started) {
          ctx.moveTo(p.x, p.y)
          started = true
        } else ctx.lineTo(p.x, p.y)
      } else started = false
    }
    ctx.strokeStyle = theme.lineStrong
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
  ctx.setLineDash([])

  const axes = [
    { v: [0, 0, 1], label: '|0⟩', color: theme.blue, pole: 0 },
    { v: [0, 0, -1], label: '|1⟩', color: theme.pink, pole: 1 },
    { v: [1, 0, 0], label: '|+⟩', color: theme.purple, pole: null },
    { v: [-1, 0, 0], label: '|−⟩', color: theme.purple, pole: null },
    { v: [0, 1, 0], label: '|+i⟩', color: theme.sky, pole: null },
  ]
  const origin = project(0, 0, 0, cx, cy, radius)
  for (const axis of axes) {
    const [x, y, z] = axis.v
    const end = project(x, y, z, cx, cy, radius)
    ctx.strokeStyle = theme.axis
    ctx.lineWidth = 1
    ctx.setLineDash([3, 4])
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.setLineDash([])

    const label = project(
      x * LABEL_DISTANCE,
      y * LABEL_DISTANCE,
      z * LABEL_DISTANCE,
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
  const tip = project(state.x, state.y, state.z, cx, cy, radius)
  const shadow = project(state.x, state.y, 0, cx, cy, radius)

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

  const arrow = ctx.createLinearGradient(origin.x, origin.y, tip.x, tip.y)
  arrow.addColorStop(0, theme.blue)
  arrow.addColorStop(1, theme.purple)
  ctx.strokeStyle = arrow
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(origin.x, origin.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.stroke()
  ctx.lineCap = 'butt'

  ctx.fillStyle = theme.purple
  ctx.shadowColor = withAlpha(theme.purple, 0.6)
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.arc(tip.x, tip.y, 8, 0, 2 * Math.PI)
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.fillStyle = theme.ink
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, 3.5, 0, 2 * Math.PI)
  ctx.fill()
}
