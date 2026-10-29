import { Card } from '@/shared/components/Card'
import { ExportGifButton } from '@/shared/components/ExportGifButton'
import { ExportStatusText } from '@/shared/components/ExportStatusText'
import type { GifExportStatus } from '@/shared/hooks/useGifExport'
import type { BellState } from '../lib/bell-states'

interface ExportPanelProps {
  state: BellState
  status: GifExportStatus
  onExport: () => void
}

export function ExportPanel({ state, status, onExport }: ExportPanelProps) {
  const exporting = status === 'capturing' || status === 'compiling'

  return (
    <Card
      backgroundClass="bg-pink-tint"
      borderClass="border-pink-line"
      className="p-5"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-brand-pink text-xs font-bold tracking-wider uppercase">
          Export for Presentation
        </h2>
        <span className="rounded-sm bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
          540x540 Loop
        </span>
      </div>
      <p className="mb-3 text-[11px] text-slate-500">
        Generate a GIF file of the circuit animation and selected Bell state for
        your presentation slides.
      </p>

      <ExportGifButton
        variant="block"
        label={`Download GIF for State ${state.symbol}`}
        disabled={exporting}
        onClick={onExport}
      />
      <ExportStatusText
        status={status}
        capturingMessage="Preparing Bell State frames..."
      />
    </Card>
  )
}
