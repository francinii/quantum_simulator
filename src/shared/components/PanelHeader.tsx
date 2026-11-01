interface PanelHeaderProps {
  title: string
  titleClass: string
  chip: string
  chipClass: string
  bordered?: boolean
  dotClass?: string
}

export function PanelHeader({
  title,
  titleClass,
  chip,
  chipClass,
  bordered = true,
  dotClass,
}: PanelHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between ${
        bordered ? 'mb-3 border-b border-edge-soft pb-2' : 'mb-2'
      }`}
    >
      <div className="flex items-center gap-2">
        {dotClass && <span className={`h-3 w-3 rounded-full ${dotClass}`} />}
        <h2
          className={`text-sm font-extrabold tracking-wider uppercase ${titleClass}`}
        >
          {title}
        </h2>
      </div>
      <span
        className={`rounded-sm px-2 py-0.5 font-mono text-[11px] font-bold ${chipClass}`}
      >
        {chip}
      </span>
    </div>
  )
}
