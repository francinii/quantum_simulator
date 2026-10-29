interface PlayPauseButtonProps {
  playing: boolean
  onToggle: () => void
  playLabel?: string
  variant?: 'compact' | 'roomy' | 'block'
}

const VARIANTS = {
  compact:
    'bg-ink flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800',
  roomy:
    'bg-ink flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800',
  block:
    'flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800',
}

export function PlayPauseButton({
  playing,
  onToggle,
  playLabel = 'Resume',
  variant = 'compact',
}: PlayPauseButtonProps) {
  return (
    <button type="button" onClick={onToggle} className={VARIANTS[variant]}>
      <svg
        className={variant === 'block' ? 'h-4 w-4' : 'h-3.5 w-3.5'}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        {playing ? (
          <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
        ) : (
          <path d="M4 4l12 6-12 6z" />
        )}
      </svg>
      <span>{playing ? 'Pause' : playLabel}</span>
    </button>
  )
}
