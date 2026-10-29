import type { BlochVector, Outcome } from '@/shared/lib/quantum/bloch'
import {
  collapseTarget,
  normalize,
  sampleShot,
} from '@/shared/lib/quantum/measurement'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { drawMeasurementBloch } from './draw-bloch'
import { ease, mix } from './shot-machine'
import {
  BASES,
  basisLabel,
  outcomeKey,
  outcomeKeys,
  preparedVector,
  stateLabel,
  theoryProbabilities,
  type BasisKey,
  type Setup,
} from './setup'

export const GIF_SIZE = 540
export const GIF_FRAME_SECONDS = 0.18
export const GIF_SHOTS = 8

const PREPARED_FRAMES = 3
const COLLAPSE_FRAMES = 4
const BETWEEN_FRAMES = 2
const HOLD_FRAMES = 4

export function framesPerShot(setup: Setup) {
  const single = PREPARED_FRAMES + COLLAPSE_FRAMES + HOLD_FRAMES
  return setup.m2 ? single + BETWEEN_FRAMES + COLLAPSE_FRAMES : single
}

function drawHistogram(
  ctx: CanvasRenderingContext2D,
  theme: CanvasTheme,
  setup: Setup,
  counts: Record<string, number>,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const keys = outcomeKeys(setup)
  const theory = theoryProbabilities(setup)
  const total = keys.reduce((sum, key) => sum + counts[key], 0)
  const colors = [theme.blue, theme.pinkSoft, theme.purple, theme.emerald]
  const slot = width / keys.length
  const barWidth = Math.min(70, slot * 0.6)

  keys.forEach((key, index) => {
    const barX = x + slot * index + (slot - barWidth) / 2
    const frequency = total ? counts[key] / total : 0

    ctx.fillStyle = theme.trackSoft
    ctx.fillRect(barX, y, barWidth, height)
    ctx.fillStyle = colors[index]
    ctx.fillRect(
      barX,
      y + height * (1 - frequency),
      barWidth,
      height * frequency,
    )

    ctx.strokeStyle = theme.ink
    ctx.setLineDash([4, 3])
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(barX - 4, y + height * (1 - theory[key]))
    ctx.lineTo(barX + barWidth + 4, y + height * (1 - theory[key]))
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = theme.ink
    ctx.font = `bold 13px ${theme.mono}`
    ctx.textAlign = 'center'
    ctx.fillText(key, barX + barWidth / 2, y + height + 16)
    ctx.font = `10px ${theme.sans}`
    ctx.fillStyle = theme.muted
    ctx.fillText(`${counts[key]}`, barX + barWidth / 2, y - 4)
  })
}

export function renderMeasurementFrames(
  theme: CanvasTheme,
  setup: Setup,
  random: () => number = Math.random,
): string[] {
  const canvas = document.createElement('canvas')
  canvas.width = GIF_SIZE
  canvas.height = GIF_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const center = GIF_SIZE / 2
  const frames: string[] = []
  const counts = Object.fromEntries(outcomeKeys(setup).map((key) => [key, 0]))

  const drawFrame = (
    vector: BlochVector,
    basis: BasisKey,
    highlight: Outcome | null,
    caption: string,
  ) => {
    ctx.fillStyle = theme.page
    ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE)

    ctx.fillStyle = theme.ink
    ctx.font = `bold 20px ${theme.sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Qubit Measurement', center, 32)
    ctx.font = `13px ${theme.sans}`
    ctx.fillStyle = theme.muted
    ctx.fillText(
      `${stateLabel(setup)} → measure ${setup.m1}${setup.m2 ? ` → measure ${setup.m2}` : ''}`,
      center,
      52,
    )
    ctx.font = `bold 13px ${theme.mono}`
    ctx.fillStyle = theme.purple
    ctx.fillText(caption, center, 74)

    drawMeasurementBloch(ctx, theme, center, 200, 105, vector, basis, highlight)
    drawHistogram(ctx, theme, setup, counts, 60, 360, 420, 120)

    ctx.font = `9px ${theme.mono}`
    ctx.fillStyle = theme.faint
    ctx.textAlign = 'center'
    ctx.fillText('Quantum Lab', center, 528)
    frames.push(canvas.toDataURL('image/png'))
  }

  const drawCollapse = (
    from: BlochVector,
    target: BlochVector,
    basis: BasisKey,
  ) => {
    for (let i = 1; i <= COLLAPSE_FRAMES; i++) {
      const vector = normalize(
        mix(from, target, ease(i / COLLAPSE_FRAMES)),
        target,
      )
      drawFrame(vector, basis, null, `Measuring in ${basis}…`)
    }
  }

  const prepared = preparedVector(setup)
  const firstAxis = BASES[setup.m1].axis
  const secondAxis = setup.m2 ? BASES[setup.m2].axis : null

  for (let shot = 0; shot < GIF_SHOTS; shot++) {
    const { first, second } = sampleShot(
      prepared,
      firstAxis,
      secondAxis,
      random,
    )

    for (let i = 0; i < PREPARED_FRAMES; i++) {
      drawFrame(
        prepared,
        setup.m1,
        null,
        `Shot ${shot + 1}: prepared ${stateLabel(setup)}`,
      )
    }
    const afterFirst = collapseTarget(firstAxis, first)
    drawCollapse(prepared, afterFirst, setup.m1)

    let finalVector = afterFirst
    let finalBasis = setup.m1
    let finalBit = first
    let caption = `Collapsed to ${basisLabel(setup.m1, first)}  (c₀ = ${first})`

    if (setup.m2 && secondAxis && second !== null) {
      for (let i = 0; i < BETWEEN_FRAMES; i++) {
        drawFrame(afterFirst, setup.m1, first, caption)
      }
      const afterSecond = collapseTarget(secondAxis, second)
      drawCollapse(afterFirst, afterSecond, setup.m2)
      finalVector = afterSecond
      finalBasis = setup.m2
      finalBit = second
      caption = `Collapsed to ${basisLabel(setup.m2, second)}  →  "${outcomeKey(setup, first, second)}"`
    }

    counts[outcomeKey(setup, first, second)]++
    for (let i = 0; i < HOLD_FRAMES; i++) {
      drawFrame(finalVector, finalBasis, finalBit, caption)
    }
  }

  return frames
}
