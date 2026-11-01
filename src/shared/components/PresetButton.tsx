interface PresetButtonProps {
  active: boolean
  onSelect: () => void
  label: string
  labelClass: string
  title: string
  titleClass?: string
  detail: string
  className?: string
}

export function PresetButton({
  active,
  onSelect,
  label,
  labelClass,
  title,
  titleClass = 'text-xs',
  detail,
  className = '',
}: PresetButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`rounded-2xl border-2 bg-surface p-2.5 text-left transition-all ${
        active
          ? 'border-brand-blue ring-brand-blue/20 shadow-md ring-2'
          : 'border-edge opacity-75 hover:border-edge-strong'
      } ${className}`}
    >
      <div
        className={`text-[10px] font-bold tracking-wider uppercase ${labelClass}`}
      >
        {label}
      </div>
      <div className={`text-ink mt-0.5 font-extrabold ${titleClass}`}>
        {title}
      </div>
      <div className="font-mono text-[10px] text-faint">{detail}</div>
    </button>
  )
}
