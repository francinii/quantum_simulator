import {
  drawBlochSphere,
  drawStateArrow,
  projectBloch,
} from '@/shared/lib/canvas/bloch-sphere'
import type { BlochVector, Outcome } from '@/shared/lib/quantum/bloch'
import { scale } from '@/shared/lib/quantum/measurement'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { BASES, BASIS_KEYS, type BasisKey } from './setup'

const LABEL_DISTANCE = 1.18

// The measurement axis is drawn thick in its color; the other two stay thin and dashed.
export function drawMeasurementBloch(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  cx: number,
  cy: number,
  radius: number,
  state: BlochVector,
  activeBasis: BasisKey,
  highlightBit: Outcome | null,
) {
  drawBlochSphere(ctx, theme, cx, cy, radius)

  const origin = projectBloch({ x: 0, y: 0, z: 0 }, cx, cy, radius)
  for (const key of BASIS_KEYS) {
    const basis = BASES[key]
    const active = key === activeBasis
    const color = theme[basis.tone]

    for (const sign of [1, -1] as const) {
      const end = projectBloch(scale(basis.axis, sign), cx, cy, radius)
      ctx.strokeStyle = active ? color : theme.axis
      ctx.globalAlpha = active ? 0.55 : 1
      ctx.lineWidth = active ? 6 : 1
      ctx.setLineDash(active ? [] : [3, 4])
      ctx.beginPath()
      ctx.moveTo(origin.x, origin.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.setLineDash([])

      const label = projectBloch(
        scale(basis.axis, sign * LABEL_DISTANCE),
        cx,
        cy,
        radius,
      )
      const bit: Outcome = sign === 1 ? 0 : 1
      const highlighted = active && highlightBit === bit
      ctx.fillStyle = active ? color : theme.faint
      ctx.font = `bold ${highlighted ? 22 : active ? 17 : 13}px ${theme.mono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(sign === 1 ? basis.plus : basis.minus, label.x, label.y)
    }
  }
  ctx.textBaseline = 'alphabetic'

  drawStateArrow(ctx, theme, cx, cy, radius, state)
}
