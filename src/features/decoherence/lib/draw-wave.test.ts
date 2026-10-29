import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { drawWavePlot, WAVE_SIZE } from './draw-wave'

const draw = (decay: number, time = 0) => {
  const { ctx, fillText, clearRect, moveTo } = makeFakeContext()
  drawWavePlot(ctx, testTheme, WAVE_SIZE.width, WAVE_SIZE.height, time, decay)
  return { fillText, clearRect, moveTo }
}

describe('drawWavePlot', () => {
  it('clears the canvas first', () => {
    expect(draw(1).clearRect).toHaveBeenCalledWith(0, 0, 400, 150)
  })

  it('labels the fringe visibility with a rounded percent', () => {
    expect(draw(1).fillText).toHaveBeenCalledWith(
      'Fringe Visibility = 100%',
      10,
      16,
    )
    expect(draw(0.456).fillText).toHaveBeenCalledWith(
      'Fringe Visibility = 46%',
      10,
      16,
    )
    expect(draw(0).fillText).toHaveBeenCalledWith(
      'Fringe Visibility = 0%',
      10,
      16,
    )
  })

  it('draws the envelope lines at ±42% of the height times the decay', () => {
    const full = draw(1)
      .moveTo.mock.calls.filter((c) => c[0] === 0)
      .map((c) => c[1])
    expect(full).toContain(75 - 63)
    expect(full).toContain(75 + 63)

    const half = draw(0.5)
      .moveTo.mock.calls.filter((c) => c[0] === 0)
      .map((c) => c[1])
    expect(half).toContain(75 - 31.5)
    expect(half).toContain(75 + 31.5)
  })

  it('flattens the envelope onto the baseline at zero coherence', () => {
    const calls = draw(0)
      .moveTo.mock.calls.filter((c) => c[0] === 0)
      .map((c) => c[1])
    expect(calls.every((y) => y === 75)).toBe(true)
  })

  it('draws the wave from the left edge to the right, one step per pixel', () => {
    const { moveTo } = draw(1)
    const waveStart = moveTo.mock.calls.filter((c) => c[0] === 0)
    expect(waveStart.length).toBeGreaterThan(0)
    // 1 baseline + 2 envelope lines + 1 wave start at x = 0.
    expect(waveStart).toHaveLength(4)
  })

  it('moves the wave with time but not its height envelope', () => {
    const at0 = draw(1, 0).moveTo.mock.calls.at(-1)
    const at1 = draw(1, 1).moveTo.mock.calls.at(-1)
    expect(at0?.[1]).not.toBeCloseTo(at1?.[1] as number)
  })
})
