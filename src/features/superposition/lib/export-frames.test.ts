import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { GIF_SIZE, renderSweepFrames, sweepAngles } from './export-frames'

describe('sweepAngles', () => {
  it('goes 0° → 180° → 0° in 10° steps without repeating the poles', () => {
    const angles = sweepAngles()
    expect(angles).toHaveLength(36)
    expect(angles[0]).toBe(0)
    expect(angles[18]).toBe(180)
    expect(angles.at(-1)).toBe(10)
    expect(angles.filter((a) => a === 0)).toHaveLength(1)
    expect(angles.filter((a) => a === 180)).toHaveLength(1)
  })
})

describe('renderSweepFrames', () => {
  it('renders one square frame per sweep angle, labeled with its θ', () => {
    const { ctx, fillText } = makeFakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as never,
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,',
    )

    const frames = renderSweepFrames(testTheme, 0)

    expect(frames).toHaveLength(36)
    expect(GIF_SIZE).toBe(540)
    const thetas = fillText.mock.calls
      .map((call) => String(call[0]).match(/^θ = (\d+)°/)?.[1])
      .filter(Boolean)
      .map(Number)
    expect(thetas).toEqual(sweepAngles())
  })
})
