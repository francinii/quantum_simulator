import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { renderStepFrames } from '../lib/export-frames'
import { STEPS } from '../lib/steps'
import { MatrixAlgebraSimulator } from './MatrixAlgebraSimulator'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))
vi.mock('../lib/export-frames', () => ({
  GIF_SIZE: 540,
  GIF_FRAME_SECONDS: 1.2,
  renderStepFrames: vi.fn(() => ['frame']),
}))

const stepButton = (n: number) =>
  screen.getByRole('button', { name: new RegExp(`Step ${n}\\b`) })
const click = (name: RegExp | string) =>
  fireEvent.click(screen.getByRole('button', { name }))
const label = () => screen.getByTestId('step-label').textContent
const cursorX = () => screen.getByTestId('time-cursor').getAttribute('x1')
const box = (id: string) => screen.getByTestId(id)
const wait = (ms: number) => act(() => void vi.advanceTimersByTime(ms))

describe('MatrixAlgebraSimulator', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => {
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    vi.mocked(renderStepFrames).mockClear()
    vi.useRealTimers()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  describe('steps', () => {
    it('starts at step 0 with the first box lit and certainty on |00⟩', () => {
      render(<MatrixAlgebraSimulator />)
      expect(stepButton(0)).toHaveAttribute('aria-pressed', 'true')
      expect(label()).toBe('Step 0: Basis States')
      expect(cursorX()).toBe('75')
      expect(box('matrix-box-1')).toHaveAttribute('data-active', 'true')
      expect(box('matrix-box-2')).toHaveAttribute('data-active', 'false')
      expect(box('dirac-box-3')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('percent-0')).toHaveTextContent('100%')
    })

    it.each([
      [
        1,
        'Step 1: Tensor Product of State Vector',
        '170',
        [true, false, false],
        '100%',
        '0%',
      ],
      [
        2,
        'Step 2: Tensor Operator H ⊗ H',
        '285',
        [true, true, false],
        '100%',
        '0%',
      ],
      [
        3,
        'Step 3: Matrix-Vector Multiplication',
        '380',
        [true, true, true],
        '25%',
        '25%',
      ],
      [
        4,
        'Step 4: Uniform Superposition State',
        '570',
        [true, true, true],
        '25%',
        '25%',
      ],
    ])(
      'step %i: label, cursor, boxes and probabilities',
      (n, name, x, boxes, p00, p01) => {
        render(<MatrixAlgebraSimulator />)
        fireEvent.click(stepButton(n))

        expect(stepButton(n)).toHaveAttribute('aria-pressed', 'true')
        expect(label()).toBe(name)
        expect(cursorX()).toBe(x)
        expect(screen.getByTestId('photon-0')).toHaveAttribute('cx', x)
        expect(screen.getByTestId('photon-1')).toHaveAttribute('cx', x)
        ;['1', '2', '3'].forEach((suffix, index) => {
          expect(box(`matrix-box-${suffix}`)).toHaveAttribute(
            'data-active',
            String(boxes[index]),
          )
          expect(box(`dirac-box-${suffix}`)).toHaveAttribute(
            'data-active',
            String(boxes[index]),
          )
        })
        expect(screen.getByTestId('percent-0')).toHaveTextContent(p00)
        expect(screen.getByTestId('percent-1')).toHaveTextContent(p01)
      },
    )

    it('dims inactive boxes and rings active ones on each side', () => {
      render(<MatrixAlgebraSimulator />)
      expect(box('matrix-box-2').className).toContain('opacity-40')
      expect(box('matrix-box-1').className).toContain('ring-brand-blue/40')
      expect(box('dirac-box-1').className).toContain('ring-brand-pink-soft/50')
      fireEvent.click(stepButton(2))
      expect(box('matrix-box-2').className).toContain('opacity-100')
      expect(box('matrix-box-2').className).not.toContain('opacity-40')
    })

    it('shows bar heights that follow the probabilities', () => {
      render(<MatrixAlgebraSimulator />)
      expect(screen.getByTestId('bar-0').style.height).toBe('100%')
      expect(screen.getByTestId('bar-1').style.height).toBe('0%')
      fireEvent.click(stepButton(3))
      for (let i = 0; i < 4; i++) {
        expect(screen.getByTestId(`bar-${i}`).style.height).toBe('25%')
      }
    })

    it('glows the H gates from step 2', () => {
      render(<MatrixAlgebraSimulator />)
      const gates = () => screen.getAllByTestId('h-gate')
      for (const gate of gates()) {
        expect(gate).not.toHaveAttribute('filter')
        expect(gate).toHaveAttribute('stroke-width', '1.8')
      }
      fireEvent.click(stepButton(2))
      for (const gate of gates()) {
        expect(gate).toHaveAttribute('filter')
        expect(gate).toHaveAttribute('stroke-width', '3')
      }
      fireEvent.click(stepButton(1))
      expect(gates()[0]).not.toHaveAttribute('filter')
    })
  })

  describe('navigation', () => {
    it('Next and Previous wrap around', () => {
      render(<MatrixAlgebraSimulator />)
      click('← Previous')
      expect(label()).toBe(STEPS[4].name)
      click('Next →')
      expect(label()).toBe(STEPS[0].name)
      click('Next →')
      expect(label()).toBe(STEPS[1].name)
    })

    it('Reset returns to step 0 and keeps playing', () => {
      render(<MatrixAlgebraSimulator />)
      fireEvent.click(stepButton(3))
      click('Reset')
      expect(label()).toBe(STEPS[0].name)
      expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    })
  })

  describe('auto-play', () => {
    it('advances every 3.5 seconds and loops from step 4 back to 0', () => {
      render(<MatrixAlgebraSimulator />)
      wait(3499)
      expect(label()).toBe(STEPS[0].name)
      wait(1)
      expect(label()).toBe(STEPS[1].name)
      // One step at a time: each step schedules its own timer after React re-renders.
      for (let i = 0; i < 3; i++) wait(3500)
      expect(label()).toBe(STEPS[4].name)
      wait(3500)
      expect(label()).toBe(STEPS[0].name)
    })

    it('speed shortens the wait: 2x advances every 1.75 s', () => {
      render(<MatrixAlgebraSimulator />)
      fireEvent.change(screen.getByLabelText(/Speed/), {
        target: { value: '2' },
      })
      expect(screen.getByText('2.0x')).toBeInTheDocument()
      wait(1749)
      expect(label()).toBe(STEPS[0].name)
      wait(1)
      expect(label()).toBe(STEPS[1].name)
    })

    it('slowest speed waits 7 seconds', () => {
      render(<MatrixAlgebraSimulator />)
      fireEvent.change(screen.getByLabelText(/Speed/), {
        target: { value: '0.5' },
      })
      wait(6999)
      expect(label()).toBe(STEPS[0].name)
      wait(1)
      expect(label()).toBe(STEPS[1].name)
    })

    it('Pause stops it and Resume restarts it', () => {
      render(<MatrixAlgebraSimulator />)
      click('Pause')
      wait(20000)
      expect(label()).toBe(STEPS[0].name)
      click('Resume')
      wait(3500)
      expect(label()).toBe(STEPS[1].name)
    })

    it('manual navigation keeps it running, with a fresh wait for the new step', () => {
      render(<MatrixAlgebraSimulator />)
      wait(3000)
      fireEvent.click(stepButton(3))
      expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
      wait(3499)
      expect(label()).toBe(STEPS[3].name)
      wait(1)
      expect(label()).toBe(STEPS[4].name)
    })

    it('starts paused under reduced motion', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never
      render(<MatrixAlgebraSimulator />)
      expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
      wait(20000)
      expect(label()).toBe(STEPS[0].name)
    })
  })

  describe('GIF export', () => {
    it('pauses playback, disables the button while building, then downloads', async () => {
      vi.useRealTimers()
      let finish: (url: string) => void = () => {}
      vi.mocked(encodeGif).mockReturnValue(
        new Promise<string>((resolve) => {
          finish = resolve
        }),
      )
      render(<MatrixAlgebraSimulator />)
      const exportButton = screen.getByRole('button', { name: /Export GIF/ })

      fireEvent.click(exportButton)
      await waitFor(() => expect(exportButton).toBeDisabled())
      expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
      expect(renderStepFrames).toHaveBeenCalledOnce()

      finish('data:image/gif;base64,')
      await waitFor(() => expect(exportButton).toBeEnabled())
      expect(downloadFile).toHaveBeenCalledWith(
        'data:image/gif;base64,',
        'hadamard_matrix_vs_dirac.gif',
      )
      expect(screen.getByText(/downloaded successfully/)).toBeInTheDocument()
    })

    it('reports an error when encoding fails', async () => {
      vi.useRealTimers()
      vi.mocked(encodeGif).mockRejectedValue(new Error('boom'))
      render(<MatrixAlgebraSimulator />)
      fireEvent.click(screen.getByRole('button', { name: /Export GIF/ }))
      expect(
        await screen.findByText(/Error generating GIF/),
      ).toBeInTheDocument()
      expect(downloadFile).not.toHaveBeenCalled()
    })
  })

  describe('content', () => {
    it('renders the matrices and the aligned expansion as formulas', () => {
      const { container } = render(<MatrixAlgebraSimulator />)
      expect(
        container.querySelectorAll('.katex').length,
      ).toBeGreaterThanOrEqual(20)
      expect(
        container.querySelectorAll('.katex-display').length,
      ).toBeGreaterThanOrEqual(6)
    })

    it('makes "first column" bold instead of printing markdown asterisks', () => {
      render(<MatrixAlgebraSimulator />)
      expect(screen.getByText('first column').tagName).toBe('STRONG')
      expect(document.body.textContent).not.toContain('**')
    })

    it('keeps the formula areas scrollable on narrow screens', () => {
      const { container } = render(<MatrixAlgebraSimulator />)
      const scrollers = container.querySelectorAll('.overflow-x-auto')
      expect(scrollers.length).toBeGreaterThanOrEqual(6)
    })

    it('has the side headings, the normalization line and the takeaway', () => {
      render(<MatrixAlgebraSimulator />)
      expect(
        screen.getByText('1. Approach: Matrix Notation'),
      ).toBeInTheDocument()
      expect(
        screen.getByText('2. Approach: Dirac Notation (Bra-Ket)'),
      ).toBeInTheDocument()
      expect(screen.getByText(/Normalization:/)).toBeInTheDocument()
      expect(
        screen.getByText(/Matrix algebra is ideal for numerical/),
      ).toBeInTheDocument()
    })
  })
})
