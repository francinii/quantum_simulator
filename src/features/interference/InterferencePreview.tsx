import { useId } from 'react'
import { PreviewSvg } from '@/shared/components/preview/PreviewSvg'

const SUM_PEAK = 'M 10 98 Q 45 64 80 98 T 150 98 T 220 98 T 290 98'
const SUM_FLAT = 'M 10 98 Q 45 98 80 98 T 150 98 T 220 98 T 290 98'
const EASE_IN_OUT = '0.45 0 0.55 1;0.45 0 0.55 1'

export function InterferencePreview() {
  const clipId = useId()

  return (
    <PreviewSvg>
      <defs>
        <clipPath id={clipId}>
          <rect x={10} y={0} width={280} height={120} />
        </clipPath>
      </defs>
      <path
        d="M 10 30 Q 45 10 80 30 T 150 30 T 220 30 T 290 30"
        fill="none"
        strokeWidth={2.5}
        className="stroke-brand-blue"
      />
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M -130 62 Q -95 42 -60 62 T 10 62 T 80 62 T 150 62 T 220 62 T 290 62"
          fill="none"
          strokeWidth={2.5}
          className="stroke-brand-pink"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;70 0;0 0"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines={EASE_IN_OUT}
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      <path
        d={SUM_PEAK}
        strokeWidth={3}
        className="fill-brand-purple/10 stroke-ink"
      >
        <animate
          attributeName="d"
          values={`${SUM_PEAK};${SUM_FLAT};${SUM_PEAK}`}
          keyTimes="0;0.5;1"
          calcMode="spline"
          keySplines={EASE_IN_OUT}
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      <text
        x={292}
        y={22}
        textAnchor="end"
        fontSize={10}
        fontWeight="bold"
        className="fill-brand-blue font-code"
      >
        A
      </text>
      <text
        x={292}
        y={54}
        textAnchor="end"
        fontSize={10}
        fontWeight="bold"
        className="fill-brand-pink font-code"
      >
        B
      </text>
      <text
        x={292}
        y={118}
        textAnchor="end"
        fontSize={10}
        fontWeight="bold"
        className="fill-ink font-code"
      >
        A + B
      </text>
      <text
        x={10}
        y={118}
        fontSize={9}
        fontWeight="bold"
        className="fill-emerald-500 font-sans"
      >
        Constructive
        <animate
          attributeName="opacity"
          values="1;0;1"
          keyTimes="0;0.5;1"
          dur="5s"
          repeatCount="indefinite"
        />
      </text>
      <text
        x={10}
        y={118}
        fontSize={9}
        fontWeight="bold"
        opacity={0}
        className="fill-brand-pink font-sans"
      >
        Destructive
        <animate
          attributeName="opacity"
          values="0;1;0"
          keyTimes="0;0.5;1"
          dur="5s"
          repeatCount="indefinite"
        />
      </text>
    </PreviewSvg>
  )
}
