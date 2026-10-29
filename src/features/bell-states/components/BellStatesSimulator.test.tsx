import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { isWebGLAvailable } from '@/shared/lib/three/webgl-support'
import { createBellScene } from '../lib/bell-scene'
import { celebrateMeasurement } from '../lib/confetti'
import { renderCycleFrames } from '../lib/export-frames'
import { BellStatesSimulator } from './BellStatesSimulator'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))
vi.mock('../lib/bell-scene', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/bell-scene')>()),
  createBellScene: vi.fn(),
}))
vi.mock('@/shared/lib/three/webgl-support', () => ({
  isWebGLAvailable: vi.fn(() => true),
}))
vi.mock('../lib/confetti', () => ({ celebrateMeasurement: vi.fn() }))
vi.mock('../lib/export-frames', () => ({
  GIF_SIZE: 540,
  GIF_FRAME_SECONDS: 0.12,
  gifFilename: (state: { key: string }) => `bell_state_${state.key}.gif`,
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

const button = (name: RegExp | string) => screen.getByRole('button', { name })
const click = (name: RegExp | string) => fireEvent.click(button(name))
const text = (id: string) => screen.getByTestId(id).textContent
const cursor = () =>
  Number(screen.getByTestId('time-cursor').getAttribute('x1'))
const x = (progress: number) => 70 + progress * 430

describe('BellStatesSimulator', () => {
  let scene: ReturnType<typeof makeScene>
  const frames = new Map<number, FrameRequestCallback>()
  let nextHandle = 1
  let clock = 0

  beforeEach(() => {
    scene = makeScene()
    vi.mocked(createBellScene).mockReturnValue(scene)
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
    vi.mocked(createBellScene).mockReset()
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    vi.mocked(celebrateMeasurement).mockReset()
    vi.mocked(renderCycleFrames).mockClear()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  // Advances the animation clock; the first frame only starts the clock.
  const runSeconds = (seconds: number, step = 0.1) => {
    for (let elapsed = 0; elapsed < seconds - 1e-9; elapsed += step) {
      const next = [...frames.entries()][0]
      if (!next) return
      frames.delete(next[0])
      clock += step * 1000
      act(() => next[1](clock))
    }
  }
  const startClock = () => runSeconds(0.1)

  describe('layout and initial state', () => {
    it('starts on Φ⁺ at the beginning of the cycle', () => {
      render(<BellStatesSimulator />)

      expect(screen.getByText('Quantum Entanglement in Action')).toBeTruthy()
      expect(button(/Basis State 00/).getAttribute('aria-pressed')).toBe('true')
      expect(screen.getByText('Circuit for State |Φ⁺⟩')).toBeTruthy()
      expect(text('step-badge')).toBe('Step 0: Input')
      expect(text('dirac-line')).toBe('|ψ₀⟩ = |00⟩')
      expect(text('vector-line')).toBe('[1.0, 0, 0, 0]ᵀ')
      expect(text('p00')).toBe('100%')
      expect(text('entropy')).toBe('0.00 qubits')
      expect(text('entanglement-badge')).toBe('Separable: Not Entangled')
      expect(cursor()).toBe(70)
      expect(button('Pause')).toBeTruthy()
    })

    it('shows four state cards with their circuits', () => {
      render(<BellStatesSimulator />)
      for (const chip of [
        'H → CX',
        'X₀ → H → CX',
        'X₁ → H → CX',
        'X₀,X₁ → H → CX',
      ]) {
        expect(screen.getByText(chip)).toBeTruthy()
      }
      expect(screen.getByText('|Ψ⁻⟩ = (|01⟩-|10⟩)/√2')).toBeTruthy()
    })

    it('has the footer property and no event branding', () => {
      const { container } = render(<BellStatesSimulator />)
      expect(container.textContent).toContain('complete orthonormal basis')
      expect(container.textContent).not.toMatch(/qiskit/i)
    })

    it('shows the shots bars for the initial state', () => {
      render(<BellStatesSimulator />)
      expect(text('pct-0')).toBe('100%')
      expect(text('pct-3')).toBe('0%')
    })
  })

  describe('selecting a state', () => {
    it('updates cards, gates, header, symbol and export label, and restarts the cycle', () => {
      render(<BellStatesSimulator />)
      startClock()
      runSeconds(1)
      expect(cursor()).toBeGreaterThan(70)

      click(/Basis State 01/)

      expect(button(/Basis State 01/).getAttribute('aria-pressed')).toBe('true')
      expect(button(/Basis State 00/).getAttribute('aria-pressed')).toBe(
        'false',
      )
      expect(screen.getByText('Circuit for State |Φ⁻⟩')).toBeTruthy()
      expect(text('state-symbol')).toBe('|Φ⁻⟩')
      expect(screen.getByTestId('x-gate-0')).toBeTruthy()
      expect(screen.queryByTestId('x-gate-1')).toBeNull()
      expect(button('Download GIF for State |Φ⁻⟩')).toBeTruthy()
      expect(cursor()).toBe(70)
    })

    it('shows both X gates for the singlet', () => {
      render(<BellStatesSimulator />)
      click(/Singlet State 11/)
      expect(screen.getByTestId('x-gate-0')).toBeTruthy()
      expect(screen.getByTestId('x-gate-1')).toBeTruthy()
    })
  })

  describe('playback controls', () => {
    it('moves the cursor 430 px per 4 s cycle and pauses and resumes', () => {
      render(<BellStatesSimulator />)
      startClock()
      runSeconds(1)
      expect(cursor()).toBeCloseTo(x(0.25), 0)

      click('Pause')
      const paused = cursor()
      runSeconds(1)
      expect(cursor()).toBe(paused)
      expect(button('Resume')).toBeTruthy()

      click('Resume')
      startClock()
      runSeconds(0.5)
      expect(cursor()).toBeGreaterThan(paused)
    })

    it('loops back to the start after a full cycle', () => {
      render(<BellStatesSimulator />)
      startClock()
      runSeconds(4.2)
      expect(cursor()).toBeLessThan(x(0.1))
    })

    it('Reset returns to the start without changing play state', () => {
      render(<BellStatesSimulator />)
      startClock()
      runSeconds(1)
      click('Reset')
      expect(cursor()).toBe(70)
      expect(button('Pause')).toBeTruthy()
    })

    it('Step pauses and advances 15% of the cycle, wrapping around', () => {
      render(<BellStatesSimulator />)
      click(/Step/)
      expect(button('Resume')).toBeTruthy()
      expect(cursor()).toBeCloseTo(x(0.15))
      for (let i = 0; i < 6; i++) click(/Step/)
      expect(cursor()).toBeCloseTo(x(0.05))
    })

    it('speed scales the cycle', () => {
      render(<BellStatesSimulator />)
      fireEvent.change(screen.getByLabelText('Speed:'), {
        target: { value: '2' },
      })
      expect(screen.getByText('2.0x')).toBeTruthy()
      startClock()
      runSeconds(1)
      expect(cursor()).toBeCloseTo(x(0.5), 0)
    })

    it('starts paused when the user prefers reduced motion', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }))
      render(<BellStatesSimulator />)
      expect(button('Resume')).toBeTruthy()
      expect(frames.size).toBe(0)
    })
  })

  describe('following the cycle', () => {
    it('walks Φ⁺ through its three steps with live math and bars', () => {
      render(<BellStatesSimulator />)
      for (let i = 0; i < 3; i++) click(/Step/)
      // 0.45 of the cycle: after H, before CNOT
      expect(text('step-badge')).toBe('Step 1: Superposition')
      expect(text('vector-line')).toBe('[0.71, 0, 0.71, 0]ᵀ')
      expect(text('p00')).toBe('50%')
      expect(text('pct-2')).toBe('50%')
      expect(text('entanglement-badge')).toBe('Separable: Not Entangled')

      click(/Step/)
      click(/Step/)
      // 0.75: after CNOT
      expect(text('step-badge')).toBe('Step 2: Entanglement')
      expect(text('dirac-line')).toBe('|ψ₂⟩ = (|00⟩ + |11⟩)/√2 = |Φ⁺⟩')
      expect(text('vector-line')).toBe('[0.71, 0, 0, 0.71]ᵀ')
      expect(text('pct-3')).toBe('50%')
      expect(text('pct-2')).toBe('0%')
      expect(text('entanglement-badge')).toBe('Maximal Entanglement (EPR)!')
      expect(text('entropy')).toBe('1.00 qubit (Max)')
    })

    it('explains the distribution in words', () => {
      render(<BellStatesSimulator />)
      expect(
        screen.getByText(/concentrated in a single configuration: \|00⟩/),
      ).toBeTruthy()
      for (let i = 0; i < 5; i++) click(/Step/)
      expect(
        screen.getByText(/shared equally between \|00⟩ and \|11⟩/),
      ).toBeTruthy()
    })

    it('poses the 3D spheres with the shrinking arrows after the CNOT', () => {
      render(<BellStatesSimulator />)
      for (let i = 0; i < 5; i++) click(/Step/)
      const [arrows] = scene.update.mock.calls.at(-1) as [{ length: number }[]]
      expect(arrows[0].length).toBeLessThan(1)
      expect(arrows[1].length).toBe(arrows[0].length)
      expect(scene.render).toHaveBeenCalled()
    })
  })

  describe('3D view', () => {
    it('orbits with the mouse and the arrow keys', () => {
      render(<BellStatesSimulator />)
      const view = screen.getByRole('application')
      const event = new MouseEvent('pointerdown', {
        clientX: 10,
        clientY: 10,
        bubbles: true,
      })
      Object.defineProperties(event, {
        pointerType: { value: 'mouse' },
        pointerId: { value: 1 },
      })
      fireEvent(view, event)
      const move = new MouseEvent('pointermove', {
        clientX: 40,
        clientY: 10,
        bubbles: true,
      })
      Object.defineProperties(move, {
        pointerType: { value: 'mouse' },
        pointerId: { value: 1 },
      })
      fireEvent(view, move)
      expect(scene.orbit).toHaveBeenCalledWith(30, 0, expect.any(Number))

      fireEvent.keyDown(view, { key: 'ArrowLeft' })
      expect(scene.orbit).toHaveBeenCalledTimes(2)
    })

    it('shows a message instead of the scene when WebGL is unavailable', () => {
      vi.mocked(isWebGLAvailable).mockReturnValue(false)
      render(<BellStatesSimulator />)
      expect(screen.getByRole('alert').textContent).toMatch(/WebGL/)
    })
  })

  describe('measurement', () => {
    it('collapses Φ⁺ to 00 or 11, shows it for 2.5 s and fires confetti', () => {
      vi.useFakeTimers()
      vi.spyOn(Math, 'random').mockReturnValue(0.9)
      render(<BellStatesSimulator />)

      click('Perform Quantum Measurement (1 Shot)')
      expect(screen.getByRole('status').textContent).toBe(
        'Collapsed Outcome: |11⟩',
      )
      expect(celebrateMeasurement).toHaveBeenCalledTimes(1)

      act(() => vi.advanceTimersByTime(2400))
      expect(screen.queryByRole('status')).not.toBeNull()
      act(() => vi.advanceTimersByTime(100))
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('draws from the final distribution of the selected state', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1)
      render(<BellStatesSimulator />)
      click(/Anti-correlation|Basis State 10/)
      click('Perform Quantum Measurement (1 Shot)')
      expect(screen.getByRole('status').textContent).toContain('|01⟩')
    })
  })

  describe('GIF export', () => {
    it('pauses while capturing, downloads the file and resumes', async () => {
      vi.mocked(encodeGif).mockResolvedValue('blob:gif')
      render(<BellStatesSimulator />)

      click('Download GIF for State |Φ⁺⟩')
      expect(button('Resume')).toBeTruthy()
      expect(
        (button('Download GIF for State |Φ⁺⟩') as HTMLButtonElement).disabled,
      ).toBe(true)

      await waitFor(() =>
        expect(downloadFile).toHaveBeenCalledWith(
          'blob:gif',
          'bell_state_phi_plus.gif',
        ),
      )
      await waitFor(() => expect(button('Pause')).toBeTruthy())
      expect(encodeGif).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 540,
          height: 540,
          frameSeconds: 0.12,
        }),
      )
      expect(scene.render).toHaveBeenCalled()
    })

    it('stays paused and reports the error when encoding fails', async () => {
      vi.mocked(encodeGif).mockRejectedValue(new Error('nope'))
      render(<BellStatesSimulator />)
      click('Download GIF for State |Φ⁺⟩')
      await waitFor(() =>
        expect(screen.getByText(/Error generating GIF/)).toBeTruthy(),
      )
      expect(button('Resume')).toBeTruthy()
    })
  })
})
