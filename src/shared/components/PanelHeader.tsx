interface PanelHeaderProps {
  title: string
  titleClass: string
  chip: string
  chipClass: string
  bordered?: boolean
}

export function PanelHeader({
  title,
  titleClass,
  chip,
  chipClass,
  bordered = true,
}: PanelHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between ${
        bordered ? 'mb-3 border-b border-slate-100 pb-2' : 'mb-2'
      }`}
    >
      <h2
        className={`text-sm font-extrabold tracking-wider uppercase ${titleClass}`}
      >
        {title}
      </h2>
      <span
        className={`rounded-sm px-2 py-0.5 font-mono text-[11px] font-bold ${chipClass}`}
      >
        {chip}
      </span>
    </div>
  )
}
