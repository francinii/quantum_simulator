import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import {
  framesPerShot,
  GIF_FRAME_SECONDS,
  GIF_SHOTS,
  GIF_SIZE,
  renderMeasurementFrames,
} from './export-frames'
import type { Setup } from './setup'

const one: Setup = { state: 'plus', m1: 'Z', m2: null, theta: 60 }
const two: Setup = { state: 'plus', m1: 'Z', m2: 'X', theta: 60 }

function capture(setup: Setup, random: () => number) {
  const { ctx, fillText } = makeFakeContext()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as never,
  )
  const toDataURL = vi
    .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValue('data:image/png;base64,')
  const frames = renderMeasurementFrames(testTheme, setup, random)
  return {
    frames,
    toDataURL,
    texts: fillText.mock.calls.map((c) => String(c[0])),
  }
}

describe('renderMeasurementFrames', () => {
  afterEach(() => vi.restoreAllMocks())

  it('has the legacy GIF settings', () => {
    expect(GIF_SIZE).toBe(540)
    expect(GIF_FRAME_SECONDS).toBe(0.18)
    expect(GIF_SHOTS).toBe(8)
  })

  it('renders 88 frames for one measurement (11 per shot)', () => {
    expect(framesPerShot(one)).toBe(11)
    const { frames, toDataURL } = capture(one, () => 0.1)
    expect(frames).toHaveLength(88)
    expect(toDataURL).toHaveBeenCalledTimes(88)
  })

  it('renders 136 frames for two measurements (17 per shot)', () => {
    expect(framesPerShot(two)).toBe(17)
    expect(capture(two, () => 0.1).frames).toHaveLength(136)
  })

  it('labels every shot and what it collapsed to', () => {
    const { texts } = capture(one, () => 0.1)
    for (let shot = 1; shot <= 8; shot++) {
      expect(texts).toContain(`Shot ${shot}: prepared |+⟩`)
    }
    expect(texts).toContain('Collapsed to |0⟩  (c₀ = 0)')
    expect(texts).toContain('Measuring in Z…')
    expect(texts).toContain('|+⟩ → measure Z')
  })

  it('writes the Qiskit bitstring in the final caption of two measurements', () => {
    // 0.1 → "+" on both, so c₀ = 0 and c₁ = 0 → "00".
    const { texts } = capture(two, () => 0.1)
    expect(texts).toContain('Collapsed to |+⟩  →  "00"')
    expect(texts).toContain('|+⟩ → measure Z → measure X')
  })

  it('draws the lab credit, not event branding', () => {
    const { texts } = capture(one, () => 0.1)
    expect(texts).toContain('Quantum Lab')
  })

  it('is deterministic for a fixed random source and varies with it', () => {
    const lows = capture(one, () => 0.1).texts.filter((t) =>
      t.startsWith('Collapsed'),
    )
    const highs = capture(one, () => 0.9).texts.filter((t) =>
      t.startsWith('Collapsed'),
    )
    expect(new Set(lows)).toEqual(new Set(['Collapsed to |0⟩  (c₀ = 0)']))
    expect(new Set(highs)).toEqual(new Set(['Collapsed to |1⟩  (c₀ = 1)']))
  })
})
