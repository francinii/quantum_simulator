import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { testTheme } from '@/shared/test/test-theme'
import { BELL_STATES } from './bell-states'
import { cursorX } from './cycle'
import {
  GIF_FRAME_COUNT,
  gifFilename,
  renderCycleFrames,
  type FrameScene,
} from './export-frames'

function setup() {
  const { ctx, fillText, moveTo } = makeFakeContext()
  const realCreate = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag !== 'canvas') return realCreate(tag)
    return {
      width: 0,
      height: 0,
      getContext: () => ctx,
      toDataURL: () => 'data:image/png;base64,frame',
    } as unknown as HTMLCanvasElement
  })
  const scene: FrameScene = {
    update: vi.fn(),
    render: vi.fn(),
    canvas: document.createElement('canvas'),
  }
  return { scene, fillText, moveTo }
}

afterEach(() => vi.restoreAllMocks())

describe('renderCycleFrames', () => {
  it('renders 28 frames, posing the spheres for each progress value', () => {
    const { scene } = setup()
    const frames = renderCycleFrames(testTheme, scene, BELL_STATES.phi_plus)

    expect(frames).toHaveLength(GIF_FRAME_COUNT)
    expect(GIF_FRAME_COUNT).toBe(28)
    expect(scene.update).toHaveBeenCalledTimes(28)
    expect(scene.render).toHaveBeenCalledTimes(28)
  })

  it('draws the circuit cursor at a different x on every frame', () => {
    const { scene, moveTo } = setup()
    renderCycleFrames(testTheme, scene, BELL_STATES.phi_plus)

    const cursorXs = moveTo.mock.calls
      .filter(([, y]) => y === 20)
      .map(([x]) => x as number)
    expect(cursorXs).toHaveLength(28)
    expect(cursorXs[0]).toBe(70)
    expect(cursorXs[14]).toBeCloseTo(cursorX(0.5))
    expect(new Set(cursorXs).size).toBe(28)
  })

  it('writes the title, the formula and the final probabilities without event branding', () => {
    const { scene, fillText } = setup()
    renderCycleFrames(testTheme, scene, BELL_STATES.psi_minus)

    const texts = fillText.mock.calls.map(([text]) => text as string)
    expect(texts).toContain('Circuit for State |Ψ⁻⟩ (Singlet)')
    expect(texts).toContain('|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2')
    expect(texts).toContain('P(00)=0%  |  P(11)=0%  |  P(01)=50%  |  P(10)=50%')
    expect(texts.some((text) => /qiskit/i.test(text))).toBe(false)
  })

  it('draws the X gates only for the circuits that need them', () => {
    const plus = setup()
    renderCycleFrames(testTheme, plus.scene, BELL_STATES.phi_plus)
    const xCount = (calls: unknown[][]) =>
      calls.filter(([text]) => text === 'X').length
    expect(xCount(plus.fillText.mock.calls)).toBe(0)

    vi.restoreAllMocks()
    const both = setup()
    renderCycleFrames(testTheme, both.scene, BELL_STATES.psi_minus)
    expect(xCount(both.fillText.mock.calls)).toBe(2 * 28)
  })
})

describe('gifFilename', () => {
  it('names the file after the state', () => {
    expect(gifFilename(BELL_STATES.phi_minus)).toBe('bell_state_phi_minus.gif')
  })
})
