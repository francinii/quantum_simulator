export type ChipTone = 'purple' | 'blue' | 'pink' | 'sky' | 'muted'

const ACTIVE_CLASSES: Record<ChipTone, string> = {
  purple: 'border-brand-purple text-brand-purple ring-brand-purple/20',
  blue: 'border-brand-blue text-brand-blue ring-brand-blue/20',
  pink: 'border-brand-pink text-brand-pink ring-brand-pink/20',
  sky: 'border-brand-sky text-brand-sky ring-brand-sky/20',
  muted: 'border-muted text-muted ring-muted/20',
}

interface ChoiceChipProps {
  label: string
  active: boolean
  tone: ChipTone
  onSelect: () => void
}

export function ChoiceChip({ label, active, tone, onSelect }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`rounded-xl border-2 bg-surface px-2 py-1.5 font-mono font-bold transition-all ${
        active
          ? `shadow-xs ring-2 ${ACTIVE_CLASSES[tone]}`
          : 'border-edge text-muted hover:border-edge-strong'
      }`}
    >
      {label}
    </button>
  )
}
