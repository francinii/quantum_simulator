import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { drawMeasurementBloch } from '../lib/draw-bloch'
import { renderMeasurementFrames } from '../lib/export-frames'
import { buildQiskitLines, qiskitText } from '../lib/qiskit-code'
import { initialSetup } from '../lib/setup'
import { QubitMeasurementSimulator } from './QubitMeasurementSimulator'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))
vi.mock('../lib/export-frames', () => ({
  GIF_SIZE: 540,
  GIF_FRAME_SECONDS: 0.18,
  renderMeasurementFrames: vi.fn(() => ['frame']),
}))
vi.mock('../lib/draw-bloch', () => ({ drawMeasurementBloch: vi.fn() }))

const group = (name: RegExp) => screen.getByRole('group', { name })
const chip = (groupName: RegExp, label: string) =>
  within(group(groupName)).getByRole('button', { name: label })
const stateChip = (label: string) => chip(/Prepare the state/, label)
const firstChip = (label: string) => chip(/First measurement basis/, label)
const secondChip = (label: string) => chip(/Second measurement basis/, label)
const experiment = (title: string) =>
  screen.getByRole('button', { name: new RegExp(title) })
const button = (name: RegExp | string) => screen.getByRole('button', { name })
const click = (name: RegExp | string) => fireEvent.click(button(name))
const total = () => screen.getByText('Total shots:').textContent
const stage = () => screen.getByTestId('stage-label').textContent
const lastShot = () => screen.getByTestId('last-shot').textContent
const lastDraw = () => vi.mocked(drawMeasurementBloch).mock.calls.at(-1)
const code = () => screen.getByTestId('qiskit-code').textContent

function mockRandom(values: number[]) {
  let index = 0
  vi.spyOn(Math, 'random').mockImplementation(
    () => values[index++ % values.length],
  )
}

describe('QubitMeasurementSimulator', () => {
  const frames = new Map<number, FrameRequestCallback>()
  let nextHandle = 1
  let clock = 0

  beforeEach(() => {
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
    const { ctx } = makeFakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as never,
    )
  })

  afterEach(() => {
    vi.mocked(drawMeasurementBloch).mockClear()
    vi.mocked(renderMeasurementFrames).mockClear()
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  // One animation frame of 100 ms (the largest step the simulation takes).
  const frame = () => {
    const entry = [...frames.entries()][0]
    if (!entry) return false
    frames.delete(entry[0])
    clock += 100
    act(() => entry[1](clock))
    return true
  }
  const runFrames = (count: number) => {
    for (let i = 0; i < count; i++) frame()
  }
  const runUntil = (done: () => boolean, limit = 120) => {
    for (let i = 0; i < limit && !done(); i++) if (!frame()) break
    expect(done()).toBe(true)
  }

  describe('setup and experiments', () => {
    it('starts on Random Outcome: |+⟩ measured in Z, no second measurement', () => {
      render(<QubitMeasurementSimulator />)
      expect(experiment('Random Outcome')).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(stateChip('|+⟩')).toHaveAttribute('aria-pressed', 'true')
      expect(firstChip('Z')).toHaveAttribute('aria-pressed', 'true')
      expect(secondChip('None')).toHaveAttribute('aria-pressed', 'true')
    })

    it.each([
      ['Definite State', '|0⟩', 'Z', 'None'],
      ['The Basis Matters', '|+⟩', 'X', 'None'],
      ['Collapse Persists', '|+⟩', 'Z', 'Z'],
      ['Incompatible Bases', '|0⟩', 'Z', 'X'],
    ])('experiment %s sets %s → %s → %s', (title, state, first, second) => {
      render(<QubitMeasurementSimulator />)
      fireEvent.click(experiment(title))

      expect(experiment(title)).toHaveAttribute('aria-pressed', 'true')
      expect(stateChip(state)).toHaveAttribute('aria-pressed', 'true')
      expect(firstChip(first)).toHaveAttribute('aria-pressed', 'true')
      expect(secondChip(second)).toHaveAttribute('aria-pressed', 'true')
    })

    it('clears the experiment highlight when the setup no longer matches one', () => {
      render(<QubitMeasurementSimulator />)
      fireEvent.click(stateChip('|1⟩'))
      for (const name of [
        /Definite State/,
        /Random Outcome/,
        /The Basis Matters/,
        /Collapse Persists/,
        /Incompatible Bases/,
      ]) {
        expect(screen.getByRole('button', { name })).toHaveAttribute(
          'aria-pressed',
          'false',
        )
      }
    })

    it('shows the θ slider only for Ry(θ)', () => {
      render(<QubitMeasurementSimulator />)
      expect(screen.queryByLabelText(/Rotation Ry/)).not.toBeInTheDocument()
      fireEvent.click(stateChip('Ry(θ)'))
      const slider = screen.getByLabelText(/Rotation Ry/)
      expect(slider).toHaveValue('60')
      fireEvent.change(slider, { target: { value: '120' } })
      expect(screen.getByText('120°')).toBeInTheDocument()
      expect(code()).toContain('qc.ry(2.0944, 0)  # θ = 120°')
    })

    it('a change cancels the running shot and clears the counts', () => {
      render(<QubitMeasurementSimulator />)
      click(/shots = 1024/)
      expect(total()).toContain('1024')
      runUntil(() => stage() !== 'Next shot…')

      fireEvent.click(firstChip('X'))

      expect(total()).toContain('0')
      expect(total()).not.toContain('1024')
      expect(stage()).toBe('Next shot…')
      expect(lastShot()).toBe(
        'Each shot: prepare → measure → read the classical bits.',
      )
    })
  })

  describe('shots', () => {
    it('1024 shots run instantly and counts add up to the total', () => {
      mockRandom([0.1, 0.9])
      render(<QubitMeasurementSimulator />)
      click(/shots = 1024/)

      expect(total()).toContain('1024')
      expect(lastShot()).toBe(
        'Ran 1024 shots instantly (like backend.run(qc, shots=1024)).',
      )
      const zero = Number(
        screen.getByTestId('share-0').textContent?.split('%')[0],
      )
      const one = Number(
        screen.getByTestId('share-1').textContent?.split('%')[0],
      )
      expect(zero + one).toBeCloseTo(100, 0)
      expect(zero).toBeCloseTo(50, 0)
    })

    it('Reset clears the counts and the message', () => {
      render(<QubitMeasurementSimulator />)
      click(/shots = 1024/)
      click('Reset')
      expect(total()).toContain('0')
      expect(total()).not.toContain('1024')
      expect(lastShot()).toContain('Each shot:')
    })

    it('adds exactly one count when a single animated shot finishes', () => {
      mockRandom([0.1])
      render(<QubitMeasurementSimulator />)
      click('Pause')
      click('1 shot')

      runUntil(() => stage() === 'Result read')
      expect(total()).toContain('1')
      expect(total()).not.toContain('10')
      expect(lastShot()).toBe('Last shot: M1 → |0⟩ (c₀ = 0)')
      expect(screen.getByTestId('bit-0').textContent).toBe('0')

      runUntil(() => stage() === 'Ready')
      expect(total()).toContain('1')
    })

    it('a second click on "1 shot" while one is running is ignored', () => {
      render(<QubitMeasurementSimulator />)
      click('Pause')
      click('1 shot')
      runFrames(3)
      click('1 shot')
      runUntil(() => stage() === 'Ready')
      expect(total()).toMatch(/Total shots:\s*1$/)
    })

    it('shows ? until each bit is read, then the bit', () => {
      mockRandom([0.9])
      render(<QubitMeasurementSimulator />)
      fireEvent.click(secondChip('X'))
      click('Pause')
      click('1 shot')

      expect(screen.getByTestId('bit-0').textContent).toBe('?')
      expect(screen.getByTestId('bit-1').textContent).toBe('?')
      runUntil(() => stage() === 'Between measurements')
      expect(screen.getByTestId('bit-0').textContent).toBe('1')
      expect(screen.getByTestId('bit-1').textContent).toBe('?')
      runUntil(() => stage() === 'Result read')
      expect(screen.getByTestId('bit-1').textContent).toBe('1')
    })
  })

  describe('auto-run and speed', () => {
    it('starts a shot after a short idle and keeps going', () => {
      render(<QubitMeasurementSimulator />)
      expect(stage()).toBe('Next shot…')
      runUntil(() => stage() === 'Preparing…')
      runUntil(() => stage() === 'Result read')
      expect(total()).toMatch(/Total shots:\s*1$/)
      runUntil(() => total()!.endsWith('2'), 200)
    })

    it('Pause stops new shots but lets the running one finish', () => {
      render(<QubitMeasurementSimulator />)
      runUntil(() => stage() === 'Measurement 1')
      click('Pause')
      runUntil(() => stage() === 'Ready')
      runFrames(10)
      expect(stage()).toBe('Ready')
      expect(total()).toMatch(/Total shots:\s*1$/)
      expect(button('Auto-run')).toBeInTheDocument()
    })

    it('speed scales how fast a shot runs', () => {
      render(<QubitMeasurementSimulator />)
      click('Pause')
      fireEvent.change(screen.getByLabelText(/Speed/), {
        target: { value: '3' },
      })
      expect(screen.getByText('3.0x')).toBeInTheDocument()
      click('1 shot')

      let fastFrames = 0
      while (stage() !== 'Ready' && fastFrames < 100) {
        frame()
        fastFrames++
      }
      expect(fastFrames).toBeLessThan(15)
      expect(fastFrames).toBeGreaterThan(5)
    })

    it('starts paused under reduced motion', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never
      render(<QubitMeasurementSimulator />)
      expect(button('Auto-run')).toBeInTheDocument()
      expect(stage()).toBe('Ready')
      runFrames(10)
      expect(stage()).toBe('Ready')
    })
  })

  describe('circuit and Bloch sphere', () => {
    it('draws the preparation gates and one meter per measurement', () => {
      render(<QubitMeasurementSimulator />)
      expect(screen.getByText('prepare |+⟩')).toBeInTheDocument()
      expect(screen.getByText('1 bit')).toBeInTheDocument()
      expect(screen.getByTestId('meter-0')).toBeInTheDocument()
      expect(screen.queryByTestId('meter-1')).not.toBeInTheDocument()

      fireEvent.click(stateChip('|−⟩'))
      fireEvent.click(secondChip('Y'))
      const svg = screen.getByRole('img', { name: /Quantum circuit/ })
      expect(
        within(svg as unknown as HTMLElement).getByText('X'),
      ).toBeInTheDocument()
      expect(
        within(svg as unknown as HTMLElement).getByText('H'),
      ).toBeInTheDocument()
      expect(screen.getByText('2 bits')).toBeInTheDocument()
      expect(screen.getByTestId('meter-1')).toBeInTheDocument()
    })

    it('says so when |0⟩ needs no gates', () => {
      render(<QubitMeasurementSimulator />)
      fireEvent.click(stateChip('|0⟩'))
      expect(screen.getByText('(no gates: stays |0⟩)')).toBeInTheDocument()
    })

    it('moves the photon and pulses the meter while measuring', () => {
      render(<QubitMeasurementSimulator />)
      click('Pause')
      click('1 shot')
      expect(screen.getByTestId('photon')).toHaveAttribute('opacity', '1')
      runUntil(() => stage() === 'Measurement 1')
      expect(screen.getByTestId('meter-0').getAttribute('class')).toContain(
        'animate-meter-pulse',
      )
      expect(screen.getByTestId('photon')).toHaveAttribute('cx', '330')
    })

    it('follows the shot with the caption, the active axis and the highlighted pole', () => {
      mockRandom([0.9])
      render(<QubitMeasurementSimulator />)
      fireEvent.click(secondChip('X'))
      click('Pause')
      expect(screen.getByTestId('bloch-caption')).toHaveTextContent(
        'Prepared state |+⟩',
      )
      expect(lastDraw()?.[6]).toBe('Z')

      click('1 shot')
      runUntil(() => stage() === 'Measurement 1')
      expect(screen.getByTestId('bloch-caption')).toHaveTextContent(
        'Measuring in Z…',
      )

      runUntil(() => stage() === 'Between measurements')
      expect(screen.getByTestId('bloch-caption')).toHaveTextContent(
        'Collapsed to |1⟩',
      )
      expect(lastDraw()?.[7]).toBe(1)

      runUntil(() => stage() === 'Measurement 2')
      expect(lastDraw()?.[6]).toBe('X')
      expect(screen.getByTestId('bloch-caption')).toHaveTextContent(
        'Measuring in X…',
      )

      runUntil(() => stage() === 'Result read')
      expect(screen.getByTestId('bloch-caption')).toHaveTextContent(
        'Collapsed to |−⟩',
      )
      expect(lastDraw()?.[7]).toBe(1)
    })
  })

  describe('histogram and theory', () => {
    it('shows 2 bars for one measurement and 4 for two, with the bit-order note', () => {
      render(<QubitMeasurementSimulator />)
      expect(screen.getByTestId('bar-0')).toBeInTheDocument()
      expect(screen.getByTestId('bar-1')).toBeInTheDocument()
      expect(screen.queryByTestId('bar-00')).not.toBeInTheDocument()
      expect(screen.getByTestId('bit-order-note').className).toContain(
        'invisible',
      )

      fireEvent.click(secondChip('Z'))
      for (const key of ['00', '01', '10', '11']) {
        expect(screen.getByTestId(`bar-${key}`)).toBeInTheDocument()
      }
      expect(screen.getByTestId('bit-order-note').className).not.toContain(
        'invisible',
      )
    })

    it('Experiment 4 puts every shot on 00 and 11 and none on 01 or 10', () => {
      render(<QubitMeasurementSimulator />)
      fireEvent.click(experiment('Collapse Persists'))
      click(/shots = 1024/)

      expect(screen.getByTestId('share-01').textContent).toMatch(/^0\.0%/)
      expect(screen.getByTestId('share-10').textContent).toMatch(/^0\.0%/)
      const a = parseFloat(screen.getByTestId('share-00').textContent ?? '')
      const b = parseFloat(screen.getByTestId('share-11').textContent ?? '')
      expect(a + b).toBeCloseTo(100, 0)
    })

    it('draws theory lines at the theoretical probabilities', () => {
      render(<QubitMeasurementSimulator />)
      expect(
        parseFloat(screen.getByTestId('theory-0').style.bottom),
      ).toBeCloseTo(50)
      fireEvent.click(experiment('Definite State'))
      expect(
        parseFloat(screen.getByTestId('theory-0').style.bottom),
      ).toBeCloseTo(100)
      expect(
        parseFloat(screen.getByTestId('theory-1').style.bottom),
      ).toBeCloseTo(0)
    })

    it('lists the first-measurement probabilities and a certain/random note', () => {
      render(<QubitMeasurementSimulator />)
      expect(screen.getByTestId('theory-row-m1')).toHaveTextContent(
        'M1 (Z): P(|0⟩) = 50.0% • P(|1⟩) = 50.0%',
      )
      expect(screen.getByText(/is not on the Z axis/)).toBeInTheDocument()
      expect(screen.getByText('random')).toBeInTheDocument()

      fireEvent.click(experiment('The Basis Matters'))
      expect(screen.getByText(/lies on the X axis/)).toBeInTheDocument()
      expect(screen.getByText('certain')).toBeInTheDocument()
    })

    it('adds the conditional rows for a second measurement', () => {
      render(<QubitMeasurementSimulator />)
      fireEvent.click(experiment('Incompatible Bases'))
      expect(screen.getByTestId('theory-row-m2-0')).toHaveTextContent(
        'If M1 gave |0⟩, then M2 (X): P(|+⟩) = 50% • P(|−⟩) = 50%',
      )
      expect(screen.getByTestId('theory-row-m2-1')).toBeInTheDocument()
    })
  })

  describe('Qiskit code', () => {
    it('shows the code for the current setup', () => {
      render(<QubitMeasurementSimulator />)
      expect(code()).toBe(qiskitText(buildQiskitLines(initialSetup())))
      fireEvent.click(experiment('Incompatible Bases'))
      expect(code()).toContain('QuantumCircuit(1, 2)')
      expect(code()).toContain('qc.measure(0, 1)')
    })

    it('Copy writes the code to the clipboard and shows Copied! for 1.5 s', async () => {
      vi.useFakeTimers()
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      })
      render(<QubitMeasurementSimulator />)

      await act(async () => {
        fireEvent.click(button('Copy'))
      })
      expect(writeText).toHaveBeenCalledWith(code())
      expect(button('Copied!')).toBeInTheDocument()

      act(() => void vi.advanceTimersByTime(1499))
      expect(button('Copied!')).toBeInTheDocument()
      act(() => void vi.advanceTimersByTime(1))
      expect(button('Copy')).toBeInTheDocument()
    })

    it('does not claim success when the clipboard is unavailable', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      })
      render(<QubitMeasurementSimulator />)
      await act(async () => {
        fireEvent.click(button('Copy'))
      })
      expect(button('Copy')).toBeInTheDocument()
    })
  })

  describe('GIF export', () => {
    it('stops the animation, disables the button while building, then downloads', async () => {
      let finish: (url: string) => void = () => {}
      vi.mocked(encodeGif).mockReturnValue(
        new Promise<string>((resolve) => {
          finish = resolve
        }),
      )
      render(<QubitMeasurementSimulator />)
      const exportButton = button(/Export GIF/)

      fireEvent.click(exportButton)
      await waitFor(() => expect(exportButton).toBeDisabled())
      expect(button('Auto-run')).toBeInTheDocument()
      expect(renderMeasurementFrames).toHaveBeenCalledWith(
        expect.anything(),
        initialSetup(),
      )

      finish('data:image/gif;base64,')
      await waitFor(() => expect(exportButton).toBeEnabled())
      expect(downloadFile).toHaveBeenCalledWith(
        'data:image/gif;base64,',
        'qubit_measurement.gif',
      )
      expect(screen.getByText(/downloaded successfully/)).toBeInTheDocument()
    })

    it('reports an error when encoding fails', async () => {
      vi.mocked(encodeGif).mockRejectedValue(new Error('boom'))
      render(<QubitMeasurementSimulator />)
      fireEvent.click(button(/Export GIF/))
      expect(
        await screen.findByText(/Error generating GIF/),
      ).toBeInTheDocument()
      expect(downloadFile).not.toHaveBeenCalled()
    })
  })

  it('renders the four rules and the formulas', () => {
    const { container } = render(<QubitMeasurementSimulator />)
    for (const title of [
      'Outcomes are probabilistic',
      'The state collapses',
      'The basis is a choice',
      'One shot is not enough',
    ]) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    }
    expect(container.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(
      8,
    )
  })
})
