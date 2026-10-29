import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { makeFakeContext } from '@/shared/test/fake-canvas-context'
import { InterferenceSimulator } from './InterferenceSimulator'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))
vi.mock('../lib/export-frames', () => ({
  GIF_SIZE: 540,
  GIF_FRAME_SECONDS: 0.15,
  renderSweepFrames: vi.fn(() => ['frame']),
}))

const preset = (name: RegExp) => screen.getByRole('button', { name })
const slider = (name: RegExp) => screen.getByLabelText(name)

describe('InterferenceSimulator', () => {
  afterEach(() => {
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  it('starts on the constructive preset with matching readouts', () => {
    render(<InterferenceSimulator />)

    expect(preset(/Constructive/)).toHaveAttribute('aria-pressed', 'true')
    // Resultant amplitude and the "max possible" line both read 2.00.
    expect(screen.getAllByText('2.00')).toHaveLength(2)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getAllByText('Fully Constructive').length).toBeGreaterThan(0)
  })

  it('applies a preset: sets the controls, highlights it and updates readouts', async () => {
    render(<InterferenceSimulator />)
    await userEvent.click(preset(/Unequal Amplitudes/))

    expect(preset(/Unequal Amplitudes/)).toHaveAttribute('aria-pressed', 'true')
    expect(preset(/Constructive/)).toHaveAttribute('aria-pressed', 'false')
    expect(slider(/Phase shift/)).toHaveValue('180')
    expect(slider(/Amplitude B/)).toHaveValue('0.5')
    // Resultant amplitude and the Amplitude B display both read 0.50.
    expect(screen.getAllByText('0.50')).toHaveLength(2)
    expect(screen.getByText('1.50')).toBeInTheDocument()
    expect(screen.getByText('11%')).toBeInTheDocument()
    expect(screen.getAllByText('Fully Destructive').length).toBeGreaterThan(0)
    expect(screen.getByText(/leave a residual wave/)).toBeInTheDocument()
  })

  it('clears the preset highlight when a slider moves away from it', () => {
    render(<InterferenceSimulator />)
    fireEvent.change(slider(/Phase shift/), { target: { value: '45' } })

    expect(screen.getByText('45°')).toBeInTheDocument()
    for (const button of screen.getAllByRole('button', { name: /Scenario/ })) {
      expect(button).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('updates the readouts and type badge as controls change', () => {
    render(<InterferenceSimulator />)
    fireEvent.change(slider(/Phase shift/), { target: { value: '180' } })

    expect(screen.getByText('0.00')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(
      screen.getByText('Fully Destructive', { selector: 'span' }),
    ).toBeInTheDocument()
  })

  it('toggles play and pause', async () => {
    render(<InterferenceSimulator />)
    await userEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Resume' }))
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('shows the chosen speed', () => {
    render(<InterferenceSimulator />)
    fireEvent.change(slider(/Speed/), { target: { value: '0.25' } })
    expect(screen.getByText('0.25x')).toBeInTheDocument()
  })

  it('starts paused when the user prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never
    render(<InterferenceSimulator />)
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('disables the export button while the GIF is built, then downloads it', async () => {
    let finish: (url: string) => void = () => {}
    vi.mocked(encodeGif).mockReturnValue(
      new Promise<string>((resolve) => {
        finish = resolve
      }),
    )
    render(<InterferenceSimulator />)
    const exportButton = screen.getByRole('button', { name: /Export GIF/ })

    await userEvent.click(exportButton)
    await waitFor(() => expect(exportButton).toBeDisabled())
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Compiling GIF'),
    )

    finish('data:image/gif;base64,')
    await waitFor(() => expect(exportButton).toBeEnabled())
    expect(downloadFile).toHaveBeenCalledWith(
      'data:image/gif;base64,',
      'wave_interference_qff2026.gif',
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'downloaded successfully',
    )
  })

  it('reports an error and re-enables export when encoding fails', async () => {
    vi.mocked(encodeGif).mockRejectedValue(new Error('boom'))
    render(<InterferenceSimulator />)

    await userEvent.click(screen.getByRole('button', { name: /Export GIF/ }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Error generating GIF',
      ),
    )
    expect(screen.getByRole('button', { name: /Export GIF/ })).toBeEnabled()
    expect(downloadFile).not.toHaveBeenCalled()
  })

  it('renders the explanation cards with formulas', () => {
    const { container } = render(<InterferenceSimulator />)
    expect(screen.getByText('Quantum Connection')).toBeInTheDocument()
    expect(container.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(
      5,
    )
  })
})

describe('InterferenceSimulator animation loop', () => {
  const frames = new Map<number, FrameRequestCallback>()
  let nextHandle = 1

  beforeEach(() => {
    frames.clear()
    nextHandle = 1
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(nextHandle, callback)
      return nextHandle++
    })
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
      frames.delete(handle)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const runFrame = (timestamp: number) => {
    const [handle, callback] = [...frames.entries()][0]
    frames.delete(handle)
    act(() => callback(timestamp))
  }

  it('redraws both canvases every frame, and stops completely while paused', async () => {
    const { ctx, clearRect } = makeFakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as never,
    )
    render(<InterferenceSimulator />)

    const afterMount = clearRect.mock.calls.length
    runFrame(0)
    runFrame(16)
    // Each frame clears the wave canvas and the phasor canvas.
    expect(clearRect.mock.calls.length).toBe(afterMount + 4)

    await userEvent.click(screen.getByRole('button', { name: 'Pause' }))
    const whilePaused = clearRect.mock.calls.length
    expect(frames.size).toBe(0)

    await userEvent.click(screen.getByRole('button', { name: 'Resume' }))
    runFrame(32)
    expect(clearRect.mock.calls.length).toBe(whilePaused + 2)
  })

  it('still redraws on control changes while paused', async () => {
    const { ctx, clearRect } = makeFakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as never,
    )
    render(<InterferenceSimulator />)
    await userEvent.click(screen.getByRole('button', { name: 'Pause' }))

    const before = clearRect.mock.calls.length
    fireEvent.change(slider(/Phase shift/), { target: { value: '90' } })
    expect(clearRect.mock.calls.length).toBe(before + 2)
  })
})
