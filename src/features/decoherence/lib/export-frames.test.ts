import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { decayAt } from './physics'
import {
  GIF_FRAME_COUNT,
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  renderCycleFrames,
  type FrameScene,
} from './export-frames'

function capture(mechanism: 'dephasing' | 'relaxation', rate = 1.2) {
  const { ctx, fillText } = makeFakeContext()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as never,
  )
  const toDataURL = vi
    .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValue('data:image/png;base64,')

  const poses: number[] = []
  let renders = 0
  const scene: FrameScene = {
    canvas: document.createElement('canvas'),
    update: (_state, time) => void poses.push(time),
    render: () => void renders++,
  }
  const frames = renderCycleFrames(testTheme, scene, mechanism, rate)
  return {
    frames,
    toDataURL,
    poses,
    renders,
    texts: fillText.mock.calls.map((c) => String(c[0])),
  }
}

describe('renderCycleFrames', () => {
  afterEach(() => vi.restoreAllMocks())

  it('has the legacy GIF settings: 540x540, 30 frames at 10 fps', () => {
    expect(GIF_SIZE).toBe(540)
    expect(GIF_FRAME_COUNT).toBe(30)
    expect(GIF_FRAME_SECONDS).toBe(0.1)
  })

  it('renders 30 frames covering one 5-second cycle in even steps', () => {
    const { frames, poses, toDataURL } = capture('dephasing')
    expect(frames).toHaveLength(30)
    expect(toDataURL).toHaveBeenCalledTimes(30)
    expect(poses[0]).toBe(0)
    expect(poses[1]).toBeCloseTo(5 / 30)
    expect(poses.at(-1)).toBeCloseTo((29 * 5) / 30)
    expect(poses.every((time, i) => i === 0 || time > poses[i - 1])).toBe(true)
  })

  it('poses and draws the 3D scene once per frame, before compositing it', () => {
    expect(capture('dephasing').renders).toBe(30)
  })

  it('titles the GIF without event branding and names the mechanism', () => {
    const dephasing = capture('dephasing').texts
    expect(dephasing).toContain('Quantum Decoherence')
    expect(dephasing).toContain('Phase & Interference Loss (T₂)')
    expect(dephasing.some((t) => /qiskit/i.test(t))).toBe(false)

    expect(capture('relaxation').texts).toContain(
      'Energy Relaxation to Ground State (T₁)',
    )
  })

  it('writes the coherence of every frame, falling from 100%', () => {
    const { texts } = capture('dephasing', 1.2)
    const values = texts
      .filter((t) => t.startsWith('Coherence: '))
      .map((t) => Number(t.match(/(\d+)%/)?.[1]))
    expect(values).toHaveLength(30)
    expect(values[0]).toBe(100)
    expect(values[29]).toBe(Math.round(decayAt((29 * 5) / 30, 1.2) * 100))
    expect(values.every((v, i) => i === 0 || v <= values[i - 1])).toBe(true)
  })

  it('draws the wave plot label for every frame too', () => {
    const labels = capture('relaxation').texts.filter((t) =>
      t.startsWith('Fringe Visibility'),
    )
    expect(labels).toHaveLength(30)
  })
})
