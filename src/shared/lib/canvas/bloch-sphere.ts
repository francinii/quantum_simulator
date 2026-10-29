import type { BlochVector } from '@/shared/lib/quantum/bloch'
import { withAlpha, type CanvasTheme } from '@/shared/lib/theme/canvas-theme'

const VIEW_AZIMUTH = (-35 * Math.PI) / 180
const VIEW_ELEVATION = (18 * Math.PI) / 180
const EQUATOR_STEP_DEG = 3

export interface ProjectedPoint {
  x: number
  y: number
  // Positive when the point is on the near side of the sphere.
  depth: number
}

export function projectBloch(
  v: BlochVector,
  cx: number,
  cy: number,
  radius: number,
): ProjectedPoint {
  const xr = v.x * Math.cos(VIEW_AZIMUTH) - v.y * Math.sin(VIEW_AZIMUTH)
  const yr = v.x * Math.sin(VIEW_AZIMUTH) + v.y * Math.cos(VIEW_AZIMUTH)
  return {
    x: cx + radius * yr,
    y:
      cy -
      radius * (v.z * Math.cos(VIEW_ELEVATION) - xr * Math.sin(VIEW_ELEVATION)),
    depth: xr,
  }
}

// The sphere body and its equator: the far half of the equator is dashed, the near half solid.
export function drawBlochSphere(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  cx: number,
  cy: number,
  radius: number,
) {
  const body = ctx.createRadialGradient(
    cx - radius * 0.3,
    cy - radius * 0.3,
    radius * 0.1,
    cx,
    cy,
    radius,
  )
  body.addColorStop(0, theme.surface)
  body.addColorStop(1, theme.sphereEdge)
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = theme.line
  ctx.lineWidth = 2
  ctx.stroke()

  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath()
    ctx.setLineDash(pass === 0 ? [4, 5] : [])
    let started = false
    for (let angle = 0; angle <= 360; angle += EQUATOR_STEP_DEG) {
      const rad = (angle * Math.PI) / 180
      const p = projectBloch(
        { x: Math.cos(rad), y: Math.sin(rad), z: 0 },
        cx,
        cy,
        radius,
      )
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
}

// The state arrow from the center, its glowing tip and the center dot.
export function drawStateArrow(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  cx: number,
  cy: number,
  radius: number,
  state: BlochVector,
) {
  const origin = projectBloch({ x: 0, y: 0, z: 0 }, cx, cy, radius)
  const tip = projectBloch(state, cx, cy, radius)

  const gradient = ctx.createLinearGradient(origin.x, origin.y, tip.x, tip.y)
  gradient.addColorStop(0, theme.blue)
  gradient.addColorStop(1, theme.purple)
  ctx.strokeStyle = gradient
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
