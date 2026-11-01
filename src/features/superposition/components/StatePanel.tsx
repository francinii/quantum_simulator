import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'
import { PanelHeader } from '@/shared/components/PanelHeader'
import { outcomeProbabilities } from '@/shared/lib/quantum/bloch'
import { formatAlpha, formatBeta } from '../lib/format-amplitude'

interface StatePanelProps {
  theta: number
  phi: number
}

export function StatePanel({ theta, phi }: StatePanelProps) {
  const [p0] = outcomeProbabilities(theta)

  return (
    <Card className="p-5">
      <PanelHeader
        title="1. The State Vector"
        titleClass="text-brand-sky"
        chip="|ψ⟩ = α|0⟩ + β|1⟩"
        chipClass="bg-blue-wash text-brand-sky"
      />
      <div className="py-1 text-center text-xs">
        <Formula
          display
          tex="|\psi\rangle = \cos\tfrac{\theta}{2}\,|0\rangle + e^{i\varphi}\sin\tfrac{\theta}{2}\,|1\rangle"
        />
      </div>
      <div className="bg-surface-preview font-code text-ink mt-2 rounded-2xl border border-line p-3 text-center text-sm md:text-base">
        |ψ⟩ ={' '}
        <span className="text-brand-blue font-bold" data-testid="alpha">
          {formatAlpha(Math.sqrt(p0))}
        </span>
        |0⟩ +{' '}
        <span className="text-brand-pink font-bold" data-testid="beta">
          {formatBeta(theta, phi)}
        </span>
        |1⟩
      </div>
      <p className="mt-2 text-[11px] text-muted">
        <Formula tex="\alpha" /> and <Formula tex="\beta" /> are{' '}
        <strong>amplitudes</strong>: they can be negative or even complex
        numbers. They are not probabilities yet.
      </p>
    </Card>
  )
}
