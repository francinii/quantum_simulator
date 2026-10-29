import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { drawBloch } from '../lib/draw-bloch'
import { renderSweepFrames } from '../lib/export-frames'
import { SuperpositionSimulator } from './SuperpositionSimulator'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))
vi.mock('../lib/export-frames', () => ({
  GIF_SIZE: 540,
  GIF_FRAME_SECONDS: 0.15,
  renderSweepFrames: vi.fn(() => ['frame']),
}))
vi.mock('../lib/draw-bloch', () => ({ drawBloch: vi.fn() }))

const renderSimulator = () =>
  render(
    <MemoryRouter>
      <SuperpositionSimulator />
    </MemoryRouter>,
  )

const preset = (title: string) =>
  screen.getByRole('button', {
    name: new RegExp(title.replace(/[|+⟩θ°=]/g, (c) => `\\${c}`)),
  })
const slider = (name: RegExp) => screen.getByLabelText(name)
const button = (name: RegExp | string) => screen.getByRole('button', { name })
const click = (name: RegExp | string) => fireEvent.click(button(name))
const setSlider = (name: RegExp, value: number) =>
  fireEvent.change(slider(name), { target: { value: String(value) } })
const total = () => screen.getByText('Total shots:').textContent
const shotLog = () => screen.getByTestId('shot-log')
const percent = (testId: string, property: 'width' | 'height' | 'bottom') =>
  parseFloat(screen.getByTestId(testId).style[property])
const lastDrawnTheta = () => vi.mocked(drawBloch).mock.calls.at(-1)?.[5]
const lastHighlight = () => vi.mocked(drawBloch).mock.calls.at(-1)?.[7]

function mockRandom(values: number[]) {
  let index = 0
  vi.spyOn(Math, 'random').mockImplementation(
    () => values[index++ % values.length],
  )
}

describe('SuperpositionSimulator', () => {
  beforeEach(() => {
    const { ctx } = makeFakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as never,
    )
  })

  afterEach(() => {
    vi.mocked(drawBloch).mockClear()
    vi.mocked(renderSweepFrames).mockClear()
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('state and presets', () => {
    it('starts on |+⟩ with matching amplitudes, probabilities and normalization', () => {
      renderSimulator()

      expect(preset('|+⟩')).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByTestId('alpha')).toHaveTextContent('0.707')
      expect(screen.getByTestId('beta')).toHaveTextContent('0.707')
      expect(screen.getAllByText('50.0%')).toHaveLength(2)
      expect(screen.getByText('0.500 + 0.500 = 1.000 ✓')).toBeInTheDocument()
    })

    it.each([
      ['|0⟩', '1.000', '0.000', '100.0%', '0.0%'],
      ['|1⟩', '0.000', '1.000', '0.0%', '100.0%'],
      ['|−⟩', '0.707', '(−0.707)', '50.0%', '50.0%'],
      ['|+i⟩', '0.707', '0.707i', '50.0%', '50.0%'],
      ['θ = 60°', '0.866', '0.500', '75.0%', '25.0%'],
    ])(
      'preset %s sets the state and highlights itself',
      (title, alpha, beta, p0, p1) => {
        renderSimulator()
        fireEvent.click(preset(title))

        expect(preset(title)).toHaveAttribute('aria-pressed', 'true')
        expect(preset('|+⟩').getAttribute('aria-pressed')).toBe(
          title === '|+⟩' ? 'true' : 'false',
        )
        expect(screen.getByTestId('alpha')).toHaveTextContent(alpha)
        expect(screen.getByTestId('beta')).toHaveTextContent(beta)
        expect(screen.getAllByText(p0).length).toBeGreaterThan(0)
        expect(screen.getAllByText(p1).length).toBeGreaterThan(0)
      },
    )

    it('θ changes the probabilities, bars and normalization', () => {
      renderSimulator()
      setSlider(/Polar angle θ/, 60)

      expect(screen.getByText('75.0%')).toBeInTheDocument()
      expect(screen.getByText('25.0%')).toBeInTheDocument()
      expect(screen.getByText('0.750 + 0.250 = 1.000 ✓')).toBeInTheDocument()
      expect(percent('probability-bar-|0⟩', 'width')).toBeCloseTo(75)
      expect(percent('amplitude-bar-|1⟩', 'width')).toBeCloseTo(50)
      expect(preset('θ = 60°')).toHaveAttribute('aria-pressed', 'true')
    })

    it('φ changes the phase but never the probabilities, and clears the preset', () => {
      renderSimulator()
      setSlider(/Relative phase φ/, 45)

      expect(screen.getByTestId('beta')).toHaveTextContent('0.707·e^(i·45°)')
      expect(screen.getAllByText('50.0%')).toHaveLength(2)
      for (const title of ['|0⟩', '|1⟩', '|+⟩', '|−⟩', '|+i⟩', 'θ = 60°']) {
        expect(preset(title)).toHaveAttribute('aria-pressed', 'false')
      }
    })
  })

  describe('θ animation', () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextHandle = 1

    beforeEach(() => {
      frames.clear()
      nextHandle = 1
      vi.stubGlobal(
        'requestAnimationFrame',
        (callback: FrameRequestCallback) => {
          frames.set(nextHandle, callback)
          return nextHandle++
        },
      )
      vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
        frames.delete(handle)
      })
    })

    afterEach(() => vi.unstubAllGlobals())

    const runFrame = (timestamp: number) => {
      const [handle, callback] = [...frames.entries()][0]
      frames.delete(handle)
      act(() => callback(timestamp))
    }

    it('sweeps θ 0° → 180° → 0° at 45° per second', () => {
      renderSimulator()
      click('Animate θ')
      expect(button('Pause')).toBeInTheDocument()

      runFrame(0)
      expect(slider(/Polar angle θ/)).toHaveValue('90')
      runFrame(1000)
      expect(slider(/Polar angle θ/)).toHaveValue('135')
      runFrame(3000)
      expect(slider(/Polar angle θ/)).toHaveValue('180')
      runFrame(4000)
      expect(slider(/Polar angle θ/)).toHaveValue('135')
    })

    it('drops the CSS transition on θ-driven bars while animating so they cannot freeze', () => {
      renderSimulator()
      const driven = () => [
        screen.getByTestId('probability-bar-|0⟩'),
        screen.getByTestId('amplitude-bar-|1⟩'),
        screen.getByTestId('theory-0'),
        screen.getByTestId('theory-1'),
      ]
      for (const element of driven()) {
        expect(element.className).toContain('transition-all')
      }

      click('Animate θ')
      for (const element of driven()) {
        expect(element.className).not.toContain('transition')
      }

      click('Pause')
      for (const element of driven()) {
        expect(element.className).toContain('transition-all')
      }
    })

    it('stops on pause with a rounded θ and no further frames', () => {
      renderSimulator()
      click('Animate θ')
      runFrame(0)
      runFrame(100)
      click('Pause')

      expect(button('Animate θ')).toBeInTheDocument()
      expect(frames.size).toBe(0)
      expect(slider(/Polar angle θ/)).toHaveValue('95')
    })

    it.each([
      ['a preset', () => fireEvent.click(preset('|0⟩'))],
      ['the θ slider', () => setSlider(/Polar angle θ/, 20)],
      ['the φ slider', () => setSlider(/Relative phase φ/, 20)],
      ['measuring once', () => click('Measure once')],
      ['measuring many', () => click(/× 100 shots/)],
    ])('stops when %s is used', (_label, action) => {
      renderSimulator()
      click('Animate θ')
      runFrame(0)

      act(action)

      expect(button('Animate θ')).toBeInTheDocument()
    })

    it('clears earlier statistics when it starts', () => {
      renderSimulator()
      click(/× 100 shots/)
      expect(total()).toContain('100')

      click('Animate θ')

      expect(total()).toContain('0')
      expect(total()).not.toContain('100')
    })
  })

  describe('measurement lab', () => {
    it('measuring once records the shot, shows the overlay, jumps to the pole and returns', () => {
      vi.useFakeTimers()
      mockRandom([0.1])
      renderSimulator()

      click('Measure once')

      expect(screen.getByRole('status')).toHaveTextContent('Measured: |0⟩')
      expect(total()).toContain('1')
      expect(within(shotLog()).getByText('0')).toBeInTheDocument()
      expect(lastDrawnTheta()).toBe(0)
      expect(lastHighlight()).toBe(0)

      act(() => void vi.advanceTimersByTime(1399))
      expect(screen.getByRole('status')).toBeInTheDocument()
      act(() => void vi.advanceTimersByTime(1))

      expect(screen.queryByText(/Measured:/)).not.toBeInTheDocument()
      expect(lastDrawnTheta()).toBe(90)
      expect(lastHighlight()).toBeNull()
    })

    it('jumps to the south pole when the outcome is 1', () => {
      mockRandom([0.9])
      renderSimulator()

      click('Measure once')

      expect(screen.getByRole('status')).toHaveTextContent('Measured: |1⟩')
      expect(lastDrawnTheta()).toBe(180)
      expect(lastHighlight()).toBe(1)
    })

    it('restarts the 1.4 s collapse when measuring again quickly', () => {
      vi.useFakeTimers()
      mockRandom([0.1, 0.9])
      renderSimulator()

      click('Measure once')
      act(() => void vi.advanceTimersByTime(1000))
      click('Measure once')
      act(() => void vi.advanceTimersByTime(1000))

      expect(screen.getByRole('status')).toHaveTextContent('Measured: |1⟩')
      act(() => void vi.advanceTimersByTime(400))
      expect(screen.queryByText(/Measured:/)).not.toBeInTheDocument()
    })

    it('×100 and ×1000 add that many shots and counts sum to the total', () => {
      mockRandom([0.1, 0.9, 0.9, 0.9])
      renderSimulator()

      click(/× 100 shots/)
      expect(total()).toContain('100')
      click(/× 1000 shots/)
      expect(total()).toContain('1100')

      const histogram = screen
        .getByText('Measured Frequencies')
        .closest('div')!.parentElement!
      expect(within(histogram).getByText(/\|0⟩:/)).toHaveTextContent('275')
      expect(within(histogram).getByText(/\|1⟩:/)).toHaveTextContent('825')
    })

    it('shows at most the last 60 outcomes while counting every shot', () => {
      mockRandom([0.9])
      renderSimulator()
      click(/× 100 shots/)
      click('Measure once')

      expect(shotLog().children).toHaveLength(60)
      expect(total()).toContain('101')
    })

    it('Reset clears the counts and restores the empty message', () => {
      renderSimulator()
      click(/× 100 shots/)
      click('Reset')

      expect(total()).toContain('0')
      expect(total()).not.toContain('100')
      expect(
        screen.getByText(/Press “Measure once” to start/),
      ).toBeInTheDocument()
    })

    it.each([
      ['a preset', () => fireEvent.click(preset('|0⟩'))],
      ['θ', () => setSlider(/Polar angle θ/, 30)],
      ['φ', () => setSlider(/Relative phase φ/, 30)],
    ])('changing %s resets statistics and collapse', (_label, change) => {
      mockRandom([0.9])
      renderSimulator()
      click(/× 100 shots/)
      click('Measure once')

      act(change)

      expect(total()).not.toContain('101')
      expect(screen.queryByText(/Measured:/)).not.toBeInTheDocument()
      expect(
        screen.getByText(/Press “Measure once” to start/),
      ).toBeInTheDocument()
    })

    it('histogram bars follow the measured frequencies and theory lines the probabilities', () => {
      mockRandom([0.1, 0.9, 0.9, 0.9])
      renderSimulator()
      expect(percent('bar-0', 'height')).toBe(0)
      expect(percent('theory-0', 'bottom')).toBeCloseTo(50)

      for (let i = 0; i < 4; i++) click('Measure once')

      expect(percent('bar-0', 'height')).toBeCloseTo(25)
      expect(percent('bar-1', 'height')).toBeCloseTo(75)
      expect(
        screen.getByText('25.0% measured'.replace(' measured', ''), {
          selector: 'span',
        }),
      ).toBeInTheDocument()

      setSlider(/Polar angle θ/, 60)
      expect(percent('theory-0', 'bottom')).toBeCloseTo(75)
      expect(percent('theory-1', 'bottom')).toBeCloseTo(25)
    })

    it('disables the collapse flash under reduced motion', () => {
      renderSimulator()
      click('Measure once')
      expect(screen.getByRole('status').className).toContain(
        'motion-reduce:animate-none',
      )
    })
  })

  describe('GIF export', () => {
    it('disables the button while building, then downloads with the right name', async () => {
      let finish: (url: string) => void = () => {}
      vi.mocked(encodeGif).mockReturnValue(
        new Promise<string>((resolve) => {
          finish = resolve
        }),
      )
      renderSimulator()
      setSlider(/Relative phase φ/, 90)
      const exportButton = button(/Export GIF/)

      fireEvent.click(exportButton)
      await waitFor(() => expect(exportButton).toBeDisabled())
      expect(renderSweepFrames).toHaveBeenCalledWith(expect.anything(), 90)

      finish('data:image/gif;base64,')
      await waitFor(() => expect(exportButton).toBeEnabled())
      expect(downloadFile).toHaveBeenCalledWith(
        'data:image/gif;base64,',
        'quantum_superposition_qff2026.gif',
      )
      expect(screen.getByText(/downloaded successfully/)).toBeInTheDocument()
    })

    it('reports an error when encoding fails', async () => {
      vi.mocked(encodeGif).mockRejectedValue(new Error('boom'))
      renderSimulator()

      fireEvent.click(button(/Export GIF/))

      expect(
        await screen.findByText(/Error generating GIF/),
      ).toBeInTheDocument()
      expect(downloadFile).not.toHaveBeenCalled()
    })
  })

  describe('explanations', () => {
    it('links the phase card to the interference simulator', () => {
      renderSimulator()
      expect(screen.getByRole('link', { name: 'interfere' })).toHaveAttribute(
        'href',
        '/simulators/interference',
      )
    })

    it('renders the three steps and the formulas', () => {
      const { container } = renderSimulator()
      for (const title of [
        'Both possibilities coexist',
        'The state collapses',
        /Phase is invisible/,
      ]) {
        expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      }
      expect(
        container.querySelectorAll('.katex').length,
      ).toBeGreaterThanOrEqual(8)
    })
  })
})
