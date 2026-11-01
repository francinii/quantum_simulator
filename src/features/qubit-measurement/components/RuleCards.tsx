import type { ReactNode } from 'react'
import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'

interface RuleProps {
  borderClass: string
  kicker: string
  kickerClass: string
  title: string
  children: ReactNode
}

function Rule({
  borderClass,
  kicker,
  kickerClass,
  title,
  children,
}: RuleProps) {
  return (
    <Card borderClass={borderClass} className="p-5">
      <div
        className={`text-[10px] font-bold tracking-wider uppercase ${kickerClass}`}
      >
        {kicker}
      </div>
      <h3 className="text-ink mt-0.5 text-sm font-extrabold">{title}</h3>
      <p className="mt-2 text-[11px] text-muted">{children}</p>
    </Card>
  )
}

export function RuleCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Rule
        borderClass="border-line"
        kicker="Rule 1"
        kickerClass="text-brand-blue"
        title="Outcomes are probabilistic"
      >
        The chance of outcome <Formula tex="b" /> is the squared overlap{' '}
        <Formula tex="|\langle b|\psi\rangle|^2" />. Only states lying exactly
        on the measurement axis give a certain answer.
      </Rule>
      <Rule
        borderClass="border-pink-line"
        kicker="Rule 2"
        kickerClass="text-brand-pink"
        title="The state collapses"
      >
        After measuring, the qubit <em>becomes</em> the state it reported.
        Measure again in the same basis and you get the same answer every time
        (Experiment 4).
      </Rule>
      <Rule
        borderClass="border-purple-line"
        kicker="Rule 3"
        kickerClass="text-brand-purple"
        title="The basis is a choice"
      >
        Hardware measures in the Z basis. To measure in X we apply{' '}
        <Formula tex="H" /> first; for Y we apply <Formula tex="S^\dagger" />{' '}
        and then <Formula tex="H" />. Z and X are incompatible: knowing one
        erases the other (Experiment 5).
      </Rule>
      <Rule
        borderClass="border-emerald-line"
        kicker="Rule 4"
        kickerClass="text-emerald-deep"
        title="One shot is not enough"
      >
        A single shot returns one bit and destroys the superposition. To learn{' '}
        <Formula tex="\alpha" /> and <Formula tex="\beta" /> we must prepare and
        measure the state many times — that is why Qiskit runs 1024 shots by
        default.
      </Rule>
    </div>
  )
}
