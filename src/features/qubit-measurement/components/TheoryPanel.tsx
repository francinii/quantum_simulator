import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'
import { PanelHeader } from '@/shared/components/PanelHeader'
import { stateLabel, type Setup } from '../lib/setup'
import { firstResultIsCertain, theoryRows } from '../lib/theory'

const ROW_CLASSES = {
  first: 'bg-surface-preview border-blue-100',
  second: 'bg-purple-50 border-purple-100',
}

interface TheoryPanelProps {
  setup: Setup
}

export function TheoryPanel({ setup }: TheoryPanelProps) {
  const certain = firstResultIsCertain(setup)

  return (
    <Card className="p-5 lg:col-span-6">
      <PanelHeader
        dotClass="bg-brand-blue"
        title="Born's Rule for this Setup"
        titleClass="text-brand-sky"
        chip="P = |⟨b|ψ⟩|²"
        chipClass="bg-blue-50 text-brand-sky"
      />
      <div className="py-1 text-center text-xs">
        <Formula
          display
          tex="P(b) = |\langle b|\psi\rangle|^2 \qquad\Longrightarrow\qquad |\psi\rangle \xrightarrow{\text{measure}} |b\rangle"
        />
      </div>
      <div className="mt-2 space-y-1.5 font-mono text-xs">
        {theoryRows(setup).map((row) => (
          <div
            key={row.id}
            data-testid={`theory-row-${row.id}`}
            className={`rounded-xl border p-2 ${ROW_CLASSES[row.tone]}`}
          >
            <span className="text-slate-500">{row.prefix}</span> P(
            {row.plusLabel}) ={' '}
            <b className="text-brand-blue">
              {(row.pPlus * 100).toFixed(row.decimals)}%
            </b>{' '}
            &nbsp;•&nbsp; P({row.minusLabel}) ={' '}
            <b className="text-brand-pink">
              {(row.pMinus * 100).toFixed(row.decimals)}%
            </b>
          </div>
        ))}
        <div className="pt-1 font-sans text-[11px] text-slate-500">
          {stateLabel(setup)} {certain ? 'lies on' : 'is not on'} the {setup.m1}{' '}
          axis, so the first result is <b>{certain ? 'certain' : 'random'}</b>.
        </div>
      </div>
    </Card>
  )
}
