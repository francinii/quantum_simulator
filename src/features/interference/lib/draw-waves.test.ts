import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { drawWaves } from './draw-waves'

const theme: CanvasTheme = {
  blue: 'blue',
  purple: 'purple',
  pink: 'pink',
  ink: 'ink',
  page: 'page',
  axis: 'axis',
  track: 'track',
  muted: 'muted',
  faint: 'faint',
  sans: 'sans',
  mono: 'mono',
}

describe('drawWaves', () => {
  it('labels the three rows, including the rounded phase shift', () => {
    const { ctx, fillText } = makeFakeContext()
    drawWaves(ctx, theme, 0, 0, 100, 90, 1, 1, 89.6, 0)

    const labels = fillText.mock.calls.map((call) => call[0])
    expect(labels).toEqual([
      'Wave A',
      'Wave B (shifted by 90°)',
      'Sum A + B (superposition)',
    ])
  })
})
