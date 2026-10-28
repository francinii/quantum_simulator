interface QubitWireProps {
  y: number
  label: string
}

export function QubitWire({ y, label }: QubitWireProps) {
  return (
    <>
      <text
        x={8}
        y={y + 4}
        fontSize={13}
        fontWeight="bold"
        className="fill-ink font-code"
      >
        {label}
      </text>
      <line
        x1={40}
        y1={y}
        x2={280}
        y2={y}
        strokeWidth={2}
        strokeLinecap="round"
        className="stroke-slate-400"
      />
    </>
  )
}
