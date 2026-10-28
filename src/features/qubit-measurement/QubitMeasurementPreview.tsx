import { useId } from 'react'
import { Photon } from '@/shared/components/preview/Photon'
import { PreviewSvg } from '@/shared/components/preview/PreviewSvg'
import { QubitWire } from '@/shared/components/preview/QubitWire'

export function QubitMeasurementPreview() {
  const gradientId = useId()

  return (
    <PreviewSvg>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-measure-start)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-measure-end)' }}
          />
        </linearGradient>
      </defs>
      <QubitWire y={35} label="|ψ⟩" />
      <line
        x1={40}
        y1={94}
        x2={280}
        y2={94}
        strokeWidth={1.5}
        className="stroke-violet-300"
      />
      <line
        x1={40}
        y1={98}
        x2={280}
        y2={98}
        strokeWidth={1.5}
        className="stroke-violet-300"
      />
      <text
        x={22}
        y={100}
        fontSize={12}
        fontWeight="bold"
        className="fill-brand-purple font-code"
      >
        c
      </text>
      <rect
        x={125}
        y={15}
        width={44}
        height={40}
        rx={8}
        fill={`url(#${gradientId})`}
        strokeWidth={1.5}
        className="stroke-brand-purple"
      />
      <path
        d="M 133 46 A 14 14 0 0 1 161 46"
        fill="none"
        strokeWidth={1.8}
        className="stroke-ink"
      />
      <line
        x1={147}
        y1={47}
        x2={157}
        y2={27}
        strokeWidth={1.8}
        strokeLinecap="round"
        className="stroke-ink"
      />
      <line
        x1={145}
        y1={55}
        x2={145}
        y2={90}
        strokeWidth={1.3}
        className="stroke-brand-purple"
      />
      <line
        x1={149}
        y1={55}
        x2={149}
        y2={90}
        strokeWidth={1.3}
        className="stroke-brand-purple"
      />
      <Photon y={35} className="fill-brand-purple" />
      <rect
        x={215}
        y={76}
        width={22}
        height={22}
        rx={5}
        className="fill-brand-blue"
      />
      <text
        x={226}
        y={92}
        textAnchor="middle"
        fontSize={13}
        fontWeight="bold"
        className="font-code fill-white"
      >
        0
      </text>
      <rect
        x={243}
        y={76}
        width={22}
        height={22}
        rx={5}
        className="fill-brand-pink"
      />
      <text
        x={254}
        y={92}
        textAnchor="middle"
        fontSize={13}
        fontWeight="bold"
        className="font-code fill-white"
      >
        1
      </text>
    </PreviewSvg>
  )
}
