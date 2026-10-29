import { useEffect, useState } from 'react'
import { downloadFile, encodeGif } from '@/shared/lib/export/gif'

export type GifExportStatus =
  'idle' | 'capturing' | 'compiling' | 'done' | 'error'

interface GifExportOptions {
  renderFrames: () => string[]
  width: number
  height: number
  frameSeconds: number
  filename: string
}

const STATUS_VISIBLE_MS = 3000

// Lets React paint the "capturing" status before the synchronous frame rendering blocks the thread.
const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

export function useGifExport({
  renderFrames,
  width,
  height,
  frameSeconds,
  filename,
}: GifExportOptions) {
  const [status, setStatus] = useState<GifExportStatus>('idle')

  useEffect(() => {
    if (status !== 'done' && status !== 'error') return
    const timeout = setTimeout(() => setStatus('idle'), STATUS_VISIBLE_MS)
    return () => clearTimeout(timeout)
  }, [status])

  // Resolves true once the file was downloaded, false if anything failed.
  const start = async (): Promise<boolean> => {
    setStatus('capturing')
    await nextTick()
    try {
      const frames = renderFrames()
      setStatus('compiling')
      await nextTick()
      const url = await encodeGif({ frames, width, height, frameSeconds })
      downloadFile(url, filename)
      setStatus('done')
      return true
    } catch {
      setStatus('error')
      return false
    }
  }

  return { status, start }
}
