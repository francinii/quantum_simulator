import { PreviewSvg } from '@/shared/components/preview/PreviewSvg'

const BAR_KEY_TIMES = '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1'

export function SuperpositionPreview() {
  return (
    <PreviewSvg>
      <circle
        cx={80}
        cy={60}
        r={45}
        strokeWidth={2}
        className="fill-sphere stroke-line"
      />
      <ellipse
        cx={80}
        cy={60}
        rx={45}
        ry={12}
        fill="none"
        strokeWidth={1.2}
        strokeDasharray="4,4"
        className="stroke-line-strong"
      />
      <g>
        <line
          x1={80}
          y1={60}
          x2={80}
          y2={20}
          strokeWidth={3}
          strokeLinecap="round"
          className="stroke-brand-purple"
        />
        <circle cx={80} cy={20} r={5} className="fill-brand-purple" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 80 60;180 80 60;0 80 60"
          keyTimes="0;0.5;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </g>
      <circle cx={80} cy={60} r={2.5} className="fill-ink" />
      <text
        x={80}
        y={11}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className="fill-brand-blue font-code"
      >
        |0⟩
      </text>
      <text
        x={80}
        y={117}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className="fill-brand-pink font-code"
      >
        |1⟩
      </text>
      <rect
        x={170}
        y={30}
        width={110}
        height={14}
        rx={7}
        className="fill-neutral-strong"
      />
      <rect
        x={170}
        y={30}
        width={110}
        height={14}
        rx={7}
        className="fill-brand-blue"
      >
        <animate
          attributeName="width"
          values="110;94;55;16;0;16;55;94;110"
          keyTimes={BAR_KEY_TIMES}
          dur="6s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={170}
        y={70}
        width={110}
        height={14}
        rx={7}
        className="fill-neutral-strong"
      />
      <rect
        x={170}
        y={70}
        width={0}
        height={14}
        rx={7}
        className="fill-brand-pink"
      >
        <animate
          attributeName="width"
          values="0;16;55;94;110;94;55;16;0"
          keyTimes={BAR_KEY_TIMES}
          dur="6s"
          repeatCount="indefinite"
        />
      </rect>
      <text
        x={170}
        y={24}
        fontSize={10}
        fontWeight="bold"
        className="fill-ink font-code"
      >
        P(0) = cos²(θ/2)
      </text>
      <text
        x={170}
        y={64}
        fontSize={10}
        fontWeight="bold"
        className="fill-ink font-code"
      >
        P(1) = sin²(θ/2)
      </text>
    </PreviewSvg>
  )
}
