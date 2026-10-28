import { GateBox } from '@/shared/components/preview/GateBox'
import { Photon } from '@/shared/components/preview/Photon'
import { PreviewSvg } from '@/shared/components/preview/PreviewSvg'
import { QubitWire } from '@/shared/components/preview/QubitWire'

export function BellStatesPreview() {
  return (
    <PreviewSvg>
      <QubitWire y={35} label="|0⟩" />
      <QubitWire y={85} label="|0⟩" />
      <GateBox x={105} y={17} label="H" />
      <line
        x1={195}
        y1={35}
        x2={195}
        y2={98}
        strokeWidth={2}
        className="stroke-brand-blue"
      />
      <circle cx={195} cy={35} r={5} className="fill-brand-blue" />
      <circle
        cx={195}
        cy={85}
        r={13}
        strokeWidth={2}
        className="stroke-brand-blue fill-white"
      />
      <line
        x1={182}
        y1={85}
        x2={208}
        y2={85}
        strokeWidth={2}
        className="stroke-brand-blue"
      />
      <Photon y={35} className="fill-brand-blue" />
      <Photon y={85} className="fill-brand-pink" />
    </PreviewSvg>
  )
}
