import { Card } from '@/shared/components/Card'
import type { BellStep } from '../lib/bell-states'
import { probabilityNote } from '../lib/cycle'

interface LiveMathPanelProps {
  step: BellStep
}

export function LiveMathPanel({ step }: LiveMathPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-brand-purple text-xs font-bold tracking-wider uppercase">
          Step-by-Step Quantum Evolution
        </span>
        <span className="text-[11px] text-slate-400">
          Dirac Notation & State Matrix
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="bg-violet-wash rounded-2xl border border-purple-300/40 p-3.5">
          <div className="text-brand-purple mb-1 text-[11px] font-bold tracking-wider uppercase">
            Dirac State (|ψ(t)⟩)
          </div>
          <div
            data-testid="dirac-line"
            className="text-ink font-code flex min-h-11 items-center text-sm font-bold"
          >
            {step.dirac}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {step.description}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-300/40 bg-sky-50 p-3.5">
          <div className="text-brand-sky mb-1 text-[11px] font-bold tracking-wider uppercase">
            Amplitude Vector [c₀₀, c₀₁, c₁₀, c₁₁]ᵀ
          </div>
          <div className="flex items-center gap-3">
            <div
              data-testid="vector-line"
              className="font-code text-brand-sky rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold"
            >
              {step.vectorText}
            </div>
            <div className="text-[11px] text-slate-500">
              P(00) ={' '}
              <span data-testid="p00" className="font-bold text-slate-800">
                {(step.probabilities[0] * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {probabilityNote(step.probabilities)}
          </div>
        </div>
      </div>
    </Card>
  )
}
