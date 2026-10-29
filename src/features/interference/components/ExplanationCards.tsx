import type { ReactNode } from 'react'
import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'

interface ExplanationCardProps {
  borderClass: string
  dotClass: string
  titleClass: string
  title: string
  tex: string
  children: ReactNode
}

function ExplanationCard({
  borderClass,
  dotClass,
  titleClass,
  title,
  tex,
  children,
}: ExplanationCardProps) {
  return (
    <Card borderClass={borderClass} className="p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${dotClass}`} />
        <h2
          className={`text-sm font-extrabold tracking-wider uppercase ${titleClass}`}
        >
          {title}
        </h2>
      </div>
      <div className="py-1 text-center text-xs">
        <Formula display tex={tex} />
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{children}</p>
    </Card>
  )
}

export function ExplanationCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <ExplanationCard
        borderClass="border-emerald-100"
        dotClass="bg-emerald-500"
        titleClass="text-emerald-600"
        title="Constructive"
        tex="\Delta\varphi = 0^\circ, 360^\circ, \dots \;\Rightarrow\; R = A + B"
      >
        The waves are <strong>in phase</strong>: crest meets crest and trough
        meets trough. The amplitude grows and the intensity can reach four times
        that of a single wave.
      </ExplanationCard>
      <ExplanationCard
        borderClass="border-pink-100"
        dotClass="bg-brand-pink"
        titleClass="text-brand-pink"
        title="Destructive"
        tex="\Delta\varphi = 180^\circ \;\Rightarrow\; R = |A - B|"
      >
        The waves are <strong>out of phase</strong>: crest meets trough. With
        equal amplitudes they cancel completely and the result is a flat line.
      </ExplanationCard>
      <ExplanationCard
        borderClass="border-purple-100"
        dotClass="bg-brand-purple"
        titleClass="text-brand-purple"
        title="Quantum Connection"
        tex="P = |\alpha_1 + \alpha_2|^2 \neq |\alpha_1|^2 + |\alpha_2|^2"
      >
        In quantum mechanics, <strong>amplitudes</strong> (not probabilities)
        are added, so they can interfere. Algorithms like Grover&apos;s use
        constructive interference on the right answer and destructive
        interference on the wrong ones.
      </ExplanationCard>
    </div>
  )
}
