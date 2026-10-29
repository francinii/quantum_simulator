import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'

interface StepProps {
  borderClass: string
  kicker: string
  kickerClass: string
  title: string
  children: ReactNode
}

function Step({
  borderClass,
  kicker,
  kickerClass,
  title,
  children,
}: StepProps) {
  return (
    <Card borderClass={borderClass} className="p-5">
      <div
        className={`text-[10px] font-bold tracking-wider uppercase ${kickerClass}`}
      >
        {kicker}
      </div>
      <h3 className="text-ink mt-0.5 text-sm font-extrabold">{title}</h3>
      <p className="mt-2 text-[11px] text-slate-500">{children}</p>
    </Card>
  )
}

export function ExplanationSteps() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Step
        borderClass="border-blue-100"
        kicker="Before measuring"
        kickerClass="text-brand-blue"
        title="Both possibilities coexist"
      >
        The qubit is not secretly 0 or 1. It is described by two amplitudes at
        once, like an arrow pointing somewhere between the north and south poles
        of the sphere.
      </Step>
      <Step
        borderClass="border-pink-100"
        kicker="When measuring"
        kickerClass="text-brand-pink"
        title="The state collapses"
      >
        A measurement always returns a single classical bit: 0 or 1. The arrow
        jumps to a pole, and the chance of each pole is the squared amplitude,{' '}
        <Formula tex="|\alpha|^2" /> or <Formula tex="|\beta|^2" />.
      </Step>
      <Step
        borderClass="border-purple-100"
        kicker="The hidden ingredient"
        kickerClass="text-brand-purple"
        title="Phase is invisible… for now"
      >
        <Formula tex="|+\rangle" />, <Formula tex="|-\rangle" /> and{' '}
        <Formula tex="|+i\rangle" /> all give 50/50, yet they are different
        states. The phase <Formula tex="\varphi" /> only shows up when states{' '}
        <Link
          to="/simulators/interference"
          className="text-brand-purple font-bold underline"
        >
          interfere
        </Link>
        .
      </Step>
    </div>
  )
}
