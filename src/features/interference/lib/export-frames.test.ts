import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { GIF_FRAME_COUNT, GIF_SIZE, renderSweepFrames } from './export-frames'

describe('renderSweepFrames', () => {
  it('renders 36 square frames sweeping the phase from 0 up to just below 360 degrees', () => {
    const { ctx, fillText } = makeFakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as never,
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,',
    )

    const frames = renderSweepFrames(testTheme, 1, 1)

    expect(frames).toHaveLength(GIF_FRAME_COUNT)
    expect(GIF_SIZE).toBe(540)

    const phases = fillText.mock.calls
      .map((call) => String(call[0]).match(/^Phase shift: (\d+)°/)?.[1])
      .filter(Boolean)
      .map(Number)
    expect(phases).toHaveLength(36)
    expect(phases[0]).toBe(0)
    expect(phases[35]).toBe(350)
  })
})
