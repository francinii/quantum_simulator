import { withAlpha, type CanvasTheme } from '@/shared/lib/theme/canvas-theme'

type WaveFn = (u: number) => number

// Two wavelengths fit across the canvas.
const WAVE_NUMBER = 2 * Math.PI * 2

function drawWaveRow(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  x0: number,
  y0: number,
  w: number,
  h: number,
  label: string,
  fn: WaveFn,
  stroke: string,
  fill: string,
) {
  const mid = y0 + h / 2 + 10
  // Amplitude 2 (the maximum of the sum) fills the row.
  const unit = (h / 2 - 14) / 2

  ctx.fillStyle = theme.ink
  ctx.font = `bold 18px ${theme.sans}`
  ctx.textAlign = 'left'
  ctx.fillText(label, x0, y0 + 22)

  ctx.strokeStyle = theme.axis
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0, mid)
  ctx.lineTo(x0 + w, mid)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x0, mid)
  for (let i = 0; i <= w; i += 2) ctx.lineTo(x0 + i, mid - fn(i / w) * unit)
  ctx.lineTo(x0 + w, mid)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()

  ctx.beginPath()
  for (let i = 0; i <= w; i += 2) {
    const y = mid - fn(i / w) * unit
    if (i === 0) ctx.moveTo(x0 + i, y)
    else ctx.lineTo(x0 + i, y)
  }
  ctx.strokeStyle = stroke
  ctx.lineWidth = 3
  ctx.stroke()
}

export function drawWaves(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  x0: number,
  y0: number,
  w: number,
  h: number,
  a: number,
  b: number,
  phaseDeg: number,
  time: number,
) {
  const phi = (phaseDeg * Math.PI) / 180
  const rowHeight = h / 3
  const waveA: WaveFn = (u) => a * Math.sin(WAVE_NUMBER * u - time)
  const waveB: WaveFn = (u) => b * Math.sin(WAVE_NUMBER * u - time + phi)

  drawWaveRow(
    ctx,
    theme,
    x0,
    y0,
    w,
    rowHeight,
    'Wave A',
    waveA,
    theme.blue,
    withAlpha(theme.blue, 0.18),
  )
  drawWaveRow(
    ctx,
    theme,
    x0,
    y0 + rowHeight,
    w,
    rowHeight,
    `Wave B (shifted by ${Math.round(phaseDeg)}°)`,
    waveB,
    theme.pink,
    withAlpha(theme.pink, 0.18),
  )
  drawWaveRow(
    ctx,
    theme,
    x0,
    y0 + 2 * rowHeight,
    w,
    rowHeight,
    'Sum A + B (superposition)',
    (u) => waveA(u) + waveB(u),
    theme.ink,
    withAlpha(theme.purple, 0.14),
  )
}
