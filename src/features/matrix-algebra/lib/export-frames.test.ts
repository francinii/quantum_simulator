import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { drawHadamardCircuit } from './draw-circuit'
import { GIF_FRAME_SECONDS, GIF_SIZE, renderStepFrames } from './export-frames'
import { STEPS } from './steps'

function capture() {
  const { ctx, fillText, moveTo } = makeFakeContext()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as never,
  )
  const toDataURL = vi
    .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValue('data:image/png;base64,')
  const frames = renderStepFrames(testTheme)
  return {
    frames,
    toDataURL,
    texts: fillText.mock.calls.map((call) => String(call[0])),
    cursorXs: moveTo.mock.calls
      .filter((call) => call[1] === 10)
      .map((call) => call[0] as number),
  }
}

describe('renderStepFrames', () => {
  afterEach(() => vi.restoreAllMocks())

  it('has the legacy GIF settings: 540x540 and 1.2 s per step', () => {
    expect(GIF_SIZE).toBe(540)
    expect(GIF_FRAME_SECONDS).toBe(1.2)
  })

  it('renders one frame per step', () => {
    const { frames, toDataURL } = capture()
    expect(frames).toHaveLength(5)
    expect(toDataURL).toHaveBeenCalledTimes(5)
  })

  it('labels each frame with its step', () => {
    const { texts } = capture()
    for (const step of STEPS) expect(texts).toContain(step.name)
    expect(texts).toContain('Hadamard Application (H ⊗ H)')
  })

  it('draws the circuit at each frame own step, not frozen at step 0', () => {
    // Fix over legacy: it serialized the circuit once, so every frame showed step 0.
    expect(capture().cursorXs).toEqual([75, 170, 285, 380, 570])
  })

  it('writes each step own key lines on the two cards', () => {
    const { texts } = capture()
    expect(texts).toContain('H ⊗ H: 4x4 Matrix')
    expect(texts).toContain('U · v = [1/2, 1/2, 1/2, 1/2]ᵀ')
    expect(texts).toContain('|ψ₀⟩ = |00⟩')
    expect(texts).toContain('= (|00⟩+|01⟩+|10⟩+|11⟩)/2')
    expect(texts.filter((t) => t === 'Matrix Algebra (ℂ⁴)')).toHaveLength(5)
    expect(texts.filter((t) => t === 'Dirac Notation')).toHaveLength(5)
  })

  it('shows the real probabilities of each step in the footer', () => {
    const { texts } = capture()
    const lines = texts.filter((t) => t.startsWith('P(00)='))
    expect(lines).toEqual([
      'P(00)=100%  |  P(01)=0%  |  P(10)=0%  |  P(11)=0%',
      'P(00)=100%  |  P(01)=0%  |  P(10)=0%  |  P(11)=0%',
      'P(00)=100%  |  P(01)=0%  |  P(10)=0%  |  P(11)=0%',
      'P(00)=25%  |  P(01)=25%  |  P(10)=25%  |  P(11)=25%',
      'P(00)=25%  |  P(01)=25%  |  P(10)=25%  |  P(11)=25%',
    ])
  })

  it('credits the lab, not an event', () => {
    expect(capture().texts).toContain('Quantum Lab')
  })
})

describe('drawHadamardCircuit', () => {
  it('draws both qubit labels and the final state label', () => {
    const { ctx, fillText } = makeFakeContext()
    drawHadamardCircuit(ctx, testTheme, 0)
    const texts = fillText.mock.calls.map((c) => String(c[0]))
    expect(texts).toEqual(
      expect.arrayContaining(['|0⟩', 'q₀', 'q₁', '|00⟩', 'H', 'H ⊗ H', '|ψ₁⟩']),
    )
    expect(texts.filter((t) => t === 'H')).toHaveLength(2)
  })

  it('places the cursor at each step x position', () => {
    for (const [index, step] of STEPS.entries()) {
      const { ctx, moveTo } = makeFakeContext()
      drawHadamardCircuit(ctx, testTheme, index)
      expect(
        moveTo.mock.calls.some((c) => c[0] === step.cursorX && c[1] === 10),
      ).toBe(true)
    }
  })
})
