import { useId } from 'react'

interface GateBoxProps {
  x: number
  y: number
  label: string
}

export function GateBox({ x, y, label }: GateBoxProps) {
  const gradientId = useId()

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-brand-pink-pale)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-brand-pink-soft)' }}
          />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={36}
        height={36}
        rx={8}
        fill={`url(#${gradientId})`}
        strokeWidth={1.5}
        className="stroke-brand-pink"
      />
      <text
        x={x + 18}
        y={y + 24}
        textAnchor="middle"
        fontSize={17}
        fontWeight={800}
        className="fill-pink-text"
      >
        {label}
      </text>
    </>
  )
}
