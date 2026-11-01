import type { ReactNode } from 'react'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import { ExportGifButton } from './ExportGifButton'
import { ExportStatusText } from './ExportStatusText'

interface ExportBarProps {
  description: ReactNode
  buttonLabel: string
  capturingMessage: string
  status: GifExportStatus
  onExport: () => void
  // Inside a card of its own: no top margin or rule.
  standalone?: boolean
}

export function ExportBar({
  description,
  buttonLabel,
  capturingMessage,
  status,
  onExport,
  standalone = false,
}: ExportBarProps) {
  const exporting = status === 'capturing' || status === 'compiling'

  return (
    <>
      <div
        className={`flex flex-wrap items-center justify-between gap-3 ${
          standalone ? '' : 'mt-4 border-t border-edge-soft pt-3'
        }`}
      >
        <p className="text-xs text-muted">{description}</p>
        <ExportGifButton
          label={buttonLabel}
          disabled={exporting}
          onClick={onExport}
        />
      </div>
      <ExportStatusText status={status} capturingMessage={capturingMessage} />
    </>
  )
}
