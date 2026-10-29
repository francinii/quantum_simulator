import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'
import { PanelHeader } from '@/shared/components/PanelHeader'
import { outcomeProbabilities } from '@/shared/lib/quantum/bloch'
import { OutcomeCard } from './OutcomeCard'

interface ProbabilityPanelProps {
  theta: number
  animating: boolean
}

export function ProbabilityPanel({ theta, animating }: ProbabilityPanelProps) {
  const [p0, p1] = outcomeProbabilities(theta)

  return (
    <Card className="flex-1 p-5">
      <PanelHeader
        title="2. From Amplitudes to Probabilities"
        titleClass="text-fuchsia-500"
        chip="Born's Rule: P = |amplitude|²"
        chipClass="bg-pink-50 text-pink-600"
      />
      <div className="grid grid-cols-2 gap-3">
        <OutcomeCard
          ket="|0⟩"
          amplitudeName="|α|"
          amplitude={Math.sqrt(p0)}
          probability={p0}
          tone="blue"
          smooth={!animating}
        />
        <OutcomeCard
          ket="|1⟩"
          amplitudeName="|β|"
          amplitude={Math.sqrt(p1)}
          probability={p1}
          tone="pink"
          smooth={!animating}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span>
          Normalization: <Formula tex="|\alpha|^2 + |\beta|^2 = 1" />
        </span>
        <span className="text-brand-purple font-mono font-bold">
          {p0.toFixed(3)} + {p1.toFixed(3)} = {(p0 + p1).toFixed(3)} ✓
        </span>
      </div>
    </Card>
  )
}
