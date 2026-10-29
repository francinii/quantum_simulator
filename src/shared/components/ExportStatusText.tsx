import type { GifExportStatus } from '@/shared/hooks/useGifExport'

interface ExportStatusTextProps {
  status: GifExportStatus
  capturingMessage: string
  className?: string
}

export function ExportStatusText({
  status,
  capturingMessage,
  className = 'mt-2 text-center text-[11px] font-medium text-slate-500',
}: ExportStatusTextProps) {
  if (status === 'idle') return null

  const messages: Record<Exclude<GifExportStatus, 'idle'>, string> = {
    capturing: capturingMessage,
    compiling: 'Compiling GIF file with smooth palette...',
    done: 'GIF generated and downloaded successfully!',
    error: 'Error generating GIF. Please try again.',
  }

  return (
    <div role="status" className={className}>
      {messages[status]}
    </div>
  )
}
