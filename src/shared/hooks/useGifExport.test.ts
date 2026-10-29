import { act, renderHook, waitFor } from '@testing-library/react'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'
import { useGifExport } from './useGifExport'

vi.mock('@/shared/lib/export/gif', () => ({
  encodeGif: vi.fn(),
  downloadFile: vi.fn(),
}))

const options = (renderFrames = vi.fn(() => ['frame'])) => ({
  renderFrames,
  width: 540,
  height: 540,
  frameSeconds: 0.15,
  filename: 'out.gif',
})

describe('useGifExport', () => {
  afterEach(() => {
    vi.mocked(encodeGif).mockReset()
    vi.mocked(downloadFile).mockReset()
    vi.useRealTimers()
  })

  it('walks through capturing, compiling and done, then downloads the file', async () => {
    let finish: (url: string) => void = () => {}
    vi.mocked(encodeGif).mockReturnValue(
      new Promise<string>((resolve) => {
        finish = resolve
      }),
    )
    const renderFrames = vi.fn(() => ['a', 'b'])
    const { result } = renderHook(() => useGifExport(options(renderFrames)))
    expect(result.current.status).toBe('idle')

    act(() => void result.current.start())
    expect(result.current.status).toBe('capturing')
    await waitFor(() => expect(result.current.status).toBe('compiling'))
    expect(encodeGif).toHaveBeenCalledWith({
      frames: ['a', 'b'],
      width: 540,
      height: 540,
      frameSeconds: 0.15,
    })

    await act(async () => finish('data:image/gif;base64,'))
    await waitFor(() => expect(result.current.status).toBe('done'))
    expect(downloadFile).toHaveBeenCalledWith(
      'data:image/gif;base64,',
      'out.gif',
    )
  })

  it('reports an error when frame rendering throws, without encoding', async () => {
    const renderFrames = vi.fn(() => {
      throw new Error('no canvas')
    })
    const { result } = renderHook(() => useGifExport(options(renderFrames)))

    await act(async () => result.current.start())

    expect(result.current.status).toBe('error')
    expect(encodeGif).not.toHaveBeenCalled()
    expect(downloadFile).not.toHaveBeenCalled()
  })

  it('returns to idle three seconds after finishing', async () => {
    vi.useFakeTimers()
    vi.mocked(encodeGif).mockResolvedValue('data:image/gif;base64,')
    const { result } = renderHook(() => useGifExport(options()))

    await act(async () => {
      const run = result.current.start()
      await vi.advanceTimersByTimeAsync(10)
      await run
    })
    expect(result.current.status).toBe('done')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2999)
    })
    expect(result.current.status).toBe('done')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(result.current.status).toBe('idle')
  })
})
