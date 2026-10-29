import type { ReactNode } from 'react'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import { ExportGifButton } from './ExportGifButton'

interface ExportBarProps {
  description: ReactNode
  buttonLabel: string
  capturingMessage: string
  status: GifExportStatus
  onExport: () => void
}

export function ExportBar({
  description,
  buttonLabel,
  capturingMessage,
  status,
  onExport,
}: ExportBarProps) {
  const messages: Record<Exclude<GifExportStatus, 'idle'>, string> = {
    capturing: capturingMessage,
    compiling: 'Compiling GIF file with smooth palette...',
    done: 'GIF generated and downloaded successfully!',
    error: 'Error generating GIF. Please try again.',
  }
  const exporting = status === 'capturing' || status === 'compiling'

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">{description}</p>
        <ExportGifButton
          label={buttonLabel}
          disabled={exporting}
          onClick={onExport}
        />
      </div>
      {status !== 'idle' && (
        <div
          role="status"
          className="mt-2 text-center text-[11px] font-medium text-slate-500"
        >
          {messages[status]}
        </div>
      )}
    </>
  )
}
