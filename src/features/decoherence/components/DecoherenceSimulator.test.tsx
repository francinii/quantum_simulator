import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { createBlochScene } from '../lib/bloch-scene'
import { renderCycleFrames } from '../lib/export-frames'
import { isWebGLAvailable } from '@/shared/lib/three/webgl-support'
import { DecoherenceSimulator } from './DecoherenceSimulator'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))
// jsdom cannot compute accessible names for elements containing KaTeX's MathML, and every role query
// would try that on the "Dephasing (T₂)" buttons. KaTeX itself is covered by the other simulators' tests.
vi.mock('@/shared/components/Formula', () => ({
  Formula: ({ tex }: { tex: string }) => `[${tex}]`,
}))
vi.mock('../lib/bloch-scene', () => ({ createBlochScene: vi.fn() }))
vi.mock('@/shared/lib/three/webgl-support', () => ({
  isWebGLAvailable: vi.fn(() => true),
}))
vi.mock('../lib/export-frames', () => ({
  GIF_SIZE: 540,
  GIF_FRAME_SECONDS: 0.1,
  renderCycleFrames: vi.fn(() => ['frame']),
}))

const makeScene = () => ({
  canvas: document.createElement('canvas'),
  update: vi.fn(),
  render: vi.fn(),
  orbit: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
})

const badge = () => screen.getByTestId('purity-badge').textContent
const readout = (id: string) => screen.getByTestId(`readout-${id}`).textContent
const button = (name: RegExp | string) => screen.getByRole('button', { name })
const click = (name: RegExp | string) => fireEvent.click(button(name))
const view = () => screen.getByRole('application')

type PointerKind = 'pointerdown' | 'pointermove' | 'pointerup'

// jsdom has no PointerEvent, so fireEvent.pointerDown would drop the coordinates.
function pointer(
  type: PointerKind,
  {
    x = 0,
    y = 0,
    pointerType = 'mouse',
  }: { x?: number; y?: number; pointerType?: string } = {},
) {
  const event = new MouseEvent(type, {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
  })
  Object.defineProperties(event, {
    pointerType: { value: pointerType },
    pointerId: { value: 1 },
  })
  fireEvent(view(), event)
}

describe('DecoherenceSimulator', () => {
  let scene: ReturnType<typeof makeScene>
  const frames = new Map<number, FrameRequestCallback>()
  let nextHandle = 1
  let clock = 0

  beforeEach(() => {
    scene = makeScene()
    vi.mocked(createBlochScene).mockReturnValue(scene)
    vi.mocked(isWebGLAvailable).mockReturnValue(true)
    frames.clear()
    nextHandle = 1
    clock = 0
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(nextHandle, callback)
      return nextHandle++
    })
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
      frames.delete(handle)
    })
  })

  afterEach(() => {
    vi.mocked(createBlochScene).mockReset()
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    vi.mocked(renderCycleFrames).mockClear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  // Advances the animation clock; the first frame only starts the clock.
  const runSeconds = (seconds: number, step = 0.1) => {
    const entry = () => [...frames.entries()][0]
    for (let elapsed = 0; elapsed < seconds - 1e-9; elapsed += step) {
      const next = entry()
      if (!next) return
      frames.delete(next[0])
      clock += step * 1000
      act(() => next[1](clock))
    }
  }
  const startClock = () => runSeconds(0.1, 0.1)

  const lastPose = () =>
    scene.update.mock.calls.at(-1) as [{ decay: number; tier: string }, number]

  describe('layout and initial state', () => {
    it('shows the pure state with full coherence at the start', () => {
      render(<DecoherenceSimulator />)
      expect(badge()).toBe('Pure State: 100%')
      expect(readout('x')).toBe('1.00')
      expect(readout('y')).toBe('0.00')
      expect(readout('z')).toBe('0.00')
    })

    it('mounts the 3D scene once, poses it at t = 0 and disposes it on unmount', () => {
      const { unmount } = render(<DecoherenceSimulator />)
      expect(createBlochScene).toHaveBeenCalledOnce()
      const [state, time] = lastPose()
      expect(time).toBe(0)
      expect(state.decay).toBe(1)
      expect(scene.render).toHaveBeenCalled()

      unmount()
      expect(scene.dispose).toHaveBeenCalledOnce()
    })

    it('has the page header and the footer formula', () => {
      render(<DecoherenceSimulator />)
      expect(screen.getByText('Quantum Decoherence')).toBeInTheDocument()
      expect(screen.getByText(/Phase Damping Model:/)).toBeInTheDocument()
      expect(document.body.textContent).toContain(String.raw`\rho(t)`)
      expect(document.body.textContent).toContain(String.raw`e^{-t/T_2}`)
    })

    it('draws the wave plot with its fringe visibility', () => {
      const { ctx, fillText } = makeFakeContext()
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
        ctx as never,
      )
      render(<DecoherenceSimulator />)
      expect(fillText).toHaveBeenCalledWith('Fringe Visibility = 100%', 10, 16)
    })
  })

  describe('time and decay', () => {
    it('coherence falls as the cycle runs, and the scene follows', () => {
      render(<DecoherenceSimulator />)
      startClock()
      runSeconds(2.5)

      const [state, time] = lastPose()
      expect(time).toBeGreaterThan(2.3)
      expect(state.decay).toBeLessThan(0.4)
      expect(badge()).not.toBe('Pure State: 100%')
      expect(Number(readout('x'))).toBeLessThan(1)
    })

    it('goes from pure to partial superposition to a statistical mixture', () => {
      render(<DecoherenceSimulator />)
      fireEvent.change(screen.getByLabelText(/Decoherence Rate/), {
        target: { value: '3' },
      })
      startClock()

      const seen = new Set<string>()
      for (let i = 0; i < 49; i++) {
        runSeconds(0.1)
        seen.add(badge()?.split(':')[0] as string)
      }
      expect(seen).toEqual(
        new Set(['Pure State', 'Partial Superposition', 'Statistical Mixture']),
      )
    })

    it('restarts the cycle when it wraps at 5 seconds', () => {
      render(<DecoherenceSimulator />)
      startClock()
      runSeconds(4.8)
      expect(Number(badge()?.match(/(\d+)%/)?.[1])).toBeLessThan(40)
      runSeconds(0.4)
      expect(Number(badge()?.match(/(\d+)%/)?.[1])).toBeGreaterThan(80)
    })
  })

  describe('controls', () => {
    it('Pause stops the clock and Resume restarts it', () => {
      render(<DecoherenceSimulator />)
      startClock()
      runSeconds(1)
      click('Pause')
      const paused = badge()
      const poses = scene.update.mock.calls.length
      expect(frames.size).toBe(0)
      runSeconds(2)
      expect(badge()).toBe(paused)
      expect(scene.update.mock.calls.length).toBe(poses)

      click('Resume')
      startClock()
      runSeconds(1)
      expect(badge()).not.toBe(paused)
    })

    it('Reset Cycle returns to full coherence', () => {
      render(<DecoherenceSimulator />)
      startClock()
      runSeconds(2)
      expect(badge()).not.toBe('Pure State: 100%')
      click('Reset Cycle')
      expect(badge()).toBe('Pure State: 100%')
      expect(lastPose()[1]).toBe(0)
    })

    it('switching the mechanism restarts the cycle and highlights the choice', () => {
      render(<DecoherenceSimulator />)
      expect(button(/Dephasing/)).toHaveAttribute('aria-pressed', 'true')
      startClock()
      runSeconds(2)

      click(/Relaxation/)

      expect(button(/Relaxation/)).toHaveAttribute('aria-pressed', 'true')
      expect(button(/Dephasing/)).toHaveAttribute('aria-pressed', 'false')
      expect(badge()).toBe('Pure State: 100%')
      expect(button(/Relaxation/).className).toContain('bg-brand-pink')
      expect(button(/Dephasing/).className).toContain('bg-slate-100')
    })

    it('relaxation raises the Z population while dephasing does not', () => {
      const { unmount } = render(<DecoherenceSimulator />)
      startClock()
      runSeconds(2.5)
      expect(Math.abs(Number(readout('z')))).toBeLessThan(0.05)
      unmount()

      frames.clear()
      clock = 0
      render(<DecoherenceSimulator />)
      click(/Relaxation/)
      startClock()
      runSeconds(2.5)
      expect(Number(readout('z'))).toBeGreaterThan(0.3)
    })

    it('the rate slider scales the decay and labels itself with one decimal', () => {
      render(<DecoherenceSimulator />)
      const slider = () => screen.getByLabelText(/Decoherence Rate/)
      expect(screen.getByTestId('rate-label')).toHaveTextContent('1.2x')
      fireEvent.change(slider(), { target: { value: '0.2' } })
      expect(screen.getByTestId('rate-label')).toHaveTextContent('0.2x')
      expect(slider()).toHaveAttribute('min', '0.2')
      expect(slider()).toHaveAttribute('max', '3')

      startClock()
      runSeconds(2.5)
      const slow = lastPose()[0].decay
      fireEvent.change(slider(), { target: { value: '3' } })
      expect(screen.getByTestId('rate-label')).toHaveTextContent('3.0x')
      expect(lastPose()[0].decay).toBeLessThan(slow)
    })

    it('starts paused under reduced motion', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never
      render(<DecoherenceSimulator />)
      expect(button('Resume')).toBeInTheDocument()
      expect(frames.size).toBe(0)
      expect(badge()).toBe('Pure State: 100%')
    })
  })

  describe('camera', () => {
    it('dragging with the mouse orbits the scene and redraws it', () => {
      render(<DecoherenceSimulator />)
      pointer('pointerdown', { x: 100, y: 100 })
      pointer('pointermove', { x: 140, y: 120 })

      expect(scene.orbit).toHaveBeenCalledWith(40, 20, 0.01)
      const orbitOrder = scene.orbit.mock.invocationCallOrder[0]
      expect(
        scene.render.mock.invocationCallOrder.some((n) => n > orbitOrder),
      ).toBe(true)
    })

    it('moves are relative to the previous position, not to where the drag began', () => {
      render(<DecoherenceSimulator />)
      pointer('pointerdown', { x: 0, y: 0 })
      pointer('pointermove', { x: 10, y: 0 })
      pointer('pointermove', { x: 25, y: 5 })
      expect(scene.orbit.mock.calls.map((c) => [c[0], c[1]])).toEqual([
        [10, 0],
        [15, 5],
      ])
    })

    it('a finger turns the camera faster than the mouse', () => {
      render(<DecoherenceSimulator />)
      pointer('pointerdown', { x: 0, y: 0, pointerType: 'touch' })
      pointer('pointermove', { x: 10, y: 0, pointerType: 'touch' })
      expect(scene.orbit).toHaveBeenCalledWith(10, 0, 0.015)
    })

    it('stops orbiting once the pointer is released', () => {
      render(<DecoherenceSimulator />)
      pointer('pointerdown', { x: 0, y: 0 })
      pointer('pointermove', { x: 5, y: 0 })
      expect(scene.orbit).toHaveBeenCalledOnce()
      pointer('pointerup')
      pointer('pointermove', { x: 50, y: 50 })
      expect(scene.orbit).toHaveBeenCalledOnce()
    })

    it('ignores pointer movement that never started with a press', () => {
      render(<DecoherenceSimulator />)
      pointer('pointermove', { x: 50, y: 50 })
      expect(scene.orbit).not.toHaveBeenCalled()
    })

    it.each([
      ['ArrowLeft', -10, 0],
      ['ArrowRight', 10, 0],
      ['ArrowUp', 0, -10],
      ['ArrowDown', 0, 10],
    ])('the %s key orbits the scene', (key, dx, dy) => {
      render(<DecoherenceSimulator />)
      fireEvent.keyDown(view(), { key })
      expect(scene.orbit).toHaveBeenCalledWith(dx, dy, 0.01)
      expect(scene.render).toHaveBeenCalled()
    })

    it('ignores other keys', () => {
      render(<DecoherenceSimulator />)
      fireEvent.keyDown(view(), { key: 'a' })
      expect(scene.orbit).not.toHaveBeenCalled()
    })

    it('the 3D view is focusable and describes how to use it', () => {
      render(<DecoherenceSimulator />)
      expect(view()).toHaveAttribute('tabindex', '0')
      expect(view()).toHaveAccessibleName(/arrow keys/)
      expect(
        screen.getByText('Drag with mouse to rotate camera'),
      ).toBeInTheDocument()
    })
  })

  describe('without WebGL', () => {
    it('explains it instead of leaving a blank box, and the rest keeps working', () => {
      vi.mocked(isWebGLAvailable).mockReturnValue(false)
      render(<DecoherenceSimulator />)
      expect(screen.getByRole('alert')).toHaveTextContent(/needs WebGL/)
      expect(createBlochScene).not.toHaveBeenCalled()
      expect(badge()).toBe('Pure State: 100%')
      startClock()
      runSeconds(1)
      expect(badge()).not.toBe('Pure State: 100%')
    })
  })

  describe('GIF export', () => {
    it('pauses while building, disables the button, downloads, then resumes', async () => {
      let finish: (url: string) => void = () => {}
      vi.mocked(encodeGif).mockReturnValue(
        new Promise<string>((resolve) => {
          finish = resolve
        }),
      )
      render(<DecoherenceSimulator />)
      startClock()
      runSeconds(1)
      const exportButton = button(/Generate and Download GIF/)

      fireEvent.click(exportButton)
      await waitFor(() => expect(exportButton).toBeDisabled())
      expect(button('Resume')).toBeInTheDocument()
      expect(renderCycleFrames).toHaveBeenCalledWith(
        expect.anything(),
        scene,
        'dephasing',
        1.2,
      )

      finish('data:image/gif;base64,')
      await waitFor(() => expect(exportButton).toBeEnabled())
      expect(downloadFile).toHaveBeenCalledWith(
        'data:image/gif;base64,',
        'quantum_decoherence.gif',
      )
      expect(screen.getByText(/downloaded successfully/)).toBeInTheDocument()
      expect(button('Pause')).toBeInTheDocument()
    })

    it('puts the scene back where the page is after posing it for the frames', async () => {
      vi.mocked(encodeGif).mockResolvedValue('data:image/gif;base64,')
      render(<DecoherenceSimulator />)
      startClock()
      runSeconds(1)
      const timeBefore = lastPose()[1]
      click('Pause')

      fireEvent.click(button(/Generate and Download GIF/))
      await waitFor(() => expect(downloadFile).toHaveBeenCalled())

      expect(lastPose()[1]).toBe(timeBefore)
    })

    it('stays paused and says so when encoding fails', async () => {
      vi.mocked(encodeGif).mockRejectedValue(new Error('boom'))
      render(<DecoherenceSimulator />)
      fireEvent.click(button(/Generate and Download GIF/))

      expect(
        await screen.findByText(/Error generating GIF/),
      ).toBeInTheDocument()
      expect(downloadFile).not.toHaveBeenCalled()
      expect(button('Resume')).toBeInTheDocument()
    })

    it('shows the preparing message while capturing', async () => {
      vi.mocked(renderCycleFrames).mockImplementationOnce(() => {
        throw new Error('no 3D view')
      })
      render(<DecoherenceSimulator />)
      fireEvent.click(button(/Generate and Download GIF/))
      expect(
        await screen.findByText(/Error generating GIF/),
      ).toBeInTheDocument()
    })
  })
})
