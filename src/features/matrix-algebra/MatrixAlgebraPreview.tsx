import { GateBox } from '@/shared/components/preview/GateBox'
import { Photon } from '@/shared/components/preview/Photon'
import { PreviewSvg } from '@/shared/components/preview/PreviewSvg'
import { QubitWire } from '@/shared/components/preview/QubitWire'

export function MatrixAlgebraPreview() {
  return (
    <PreviewSvg>
      <QubitWire y={35} label="|0⟩" />
      <QubitWire y={85} label="|0⟩" />
      <GateBox x={135} y={17} label="H" />
      <GateBox x={135} y={67} label="H" />
      <line
        x1={153}
        y1={53}
        x2={153}
        y2={67}
        strokeWidth={1.5}
        strokeDasharray="3,3"
        className="stroke-brand-pink-soft"
      />
      <Photon y={35} className="fill-brand-blue" />
      <Photon y={85} className="fill-brand-pink" />
    </PreviewSvg>
  )
}
