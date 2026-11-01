interface OutcomeCardProps {
  ket: string
  amplitudeName: string
  amplitude: number
  probability: number
  tone: 'blue' | 'pink'
  smooth: boolean
}

const TONES = {
  blue: {
    card: 'bg-surface-preview border-line',
    amplitudeBar: 'bg-brand-blue/50',
    probabilityBar: 'bg-brand-blue',
    text: 'text-brand-blue',
  },
  pink: {
    card: 'bg-pink-wash border-pink-line',
    amplitudeBar: 'bg-brand-pink/50',
    probabilityBar: 'bg-brand-pink',
    text: 'text-brand-pink',
  },
}

export function OutcomeCard({
  ket,
  amplitudeName,
  amplitude,
  probability,
  tone,
  smooth,
}: OutcomeCardProps) {
  const classes = TONES[tone]
  // While θ animates, a new transition starts before every paint and never advances, freezing the bar.
  const transition = smooth ? 'transition-all duration-200' : ''

  return (
    <div className={`rounded-2xl border p-3 ${classes.card}`}>
      <div className="flex items-center justify-between">
        <span className="text-ink font-mono text-sm font-extrabold">{ket}</span>
        <span className="font-mono text-[11px] text-faint">
          {amplitudeName} = <span>{amplitude.toFixed(3)}</span>
        </span>
      </div>
      <div className="mt-2 text-[10px] text-muted">Amplitude size</div>
      <div className="h-2.5 overflow-hidden rounded-full bg-neutral">
        <div
          data-testid={`amplitude-bar-${ket}`}
          className={`h-full ${transition} ${classes.amplitudeBar}`}
          style={{ width: `${amplitude * 100}%` }}
        />
      </div>
      <div className="mt-2 text-[10px] text-muted">
        Probability = {amplitudeName}²
      </div>
      <div className="h-5 overflow-hidden rounded-full bg-neutral">
        <div
          data-testid={`probability-bar-${ket}`}
          className={`h-full ${transition} ${classes.probabilityBar}`}
          style={{ width: `${probability * 100}%` }}
        />
      </div>
      <div
        className={`mt-2 text-center text-2xl font-extrabold ${classes.text}`}
      >
        {(probability * 100).toFixed(1)}%
      </div>
    </div>
  )
}
