import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { drawWaves } from './draw-waves'

describe('drawWaves', () => {
  it('labels the three rows, including the rounded phase shift', () => {
    const { ctx, fillText } = makeFakeContext()
    drawWaves(ctx, testTheme, 0, 0, 100, 90, 1, 1, 89.6, 0)

    const labels = fillText.mock.calls.map((call) => call[0])
    expect(labels).toEqual([
      'Wave A',
      'Wave B (shifted by 90°)',
      'Sum A + B (superposition)',
    ])
  })
})
