import { PreviewSvg } from '@/shared/components/preview/PreviewSvg'

export function DecoherencePreview() {
  return (
    <PreviewSvg>
      <circle
        cx={150}
        cy={60}
        r={45}
        fill="none"
        strokeWidth={2}
        className="stroke-line"
      />
      <ellipse
        cx={150}
        cy={60}
        rx={45}
        ry={13}
        fill="none"
        strokeWidth={1.5}
        strokeDasharray="4,4"
        className="stroke-line"
      />
      <circle
        cx={150}
        cy={60}
        r={38}
        strokeWidth={1.5}
        className="animate-shrink fill-brand-purple/12 stroke-brand-purple motion-reduce:animate-none"
      />
      <circle cx={150} cy={60} r={3} className="fill-ink" />
      <circle
        cx={40}
        cy={25}
        r={3}
        opacity={0.7}
        className="fill-brand-pink-soft"
      />
      <circle
        cx={62}
        cy={90}
        r={2.5}
        opacity={0.6}
        className="fill-brand-blue"
      />
      <circle
        cx={250}
        cy={30}
        r={3}
        opacity={0.6}
        className="fill-brand-blue"
      />
      <circle
        cx={262}
        cy={88}
        r={2.5}
        opacity={0.7}
        className="fill-brand-pink-soft"
      />
      <circle
        cx={30}
        cy={60}
        r={2}
        opacity={0.6}
        className="fill-brand-purple"
      />
      <circle
        cx={275}
        cy={60}
        r={2}
        opacity={0.6}
        className="fill-brand-purple"
      />
      <text
        x={150}
        y={115}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className="fill-brand-purple font-code"
      >
        ρ → mixed state
      </text>
    </PreviewSvg>
  )
}
