import { useId } from 'react'

type Tone = 'blue' | 'purple' | 'pink'

const TONES: Record<Tone, { value: string; accent: string }> = {
  blue: { value: 'text-brand-blue', accent: 'accent-brand-blue' },
  purple: { value: 'text-brand-purple', accent: 'accent-brand-purple' },
  pink: { value: 'text-brand-pink', accent: 'accent-brand-pink' },
}

interface SliderProps {
  label: string
  labelHint?: string
  display: string
  value: number
  min: number
  max: number
  step: number
  tone: Tone
  labelClass?: string
  onChange: (value: number) => void
}

export function Slider({
  label,
  labelHint,
  display,
  value,
  min,
  max,
  step,
  tone,
  labelClass = 'text-ink',
  onChange,
}: SliderProps) {
  const id = useId()

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <label htmlFor={id} className={`font-bold ${labelClass}`}>
          {label}
          {labelHint && (
            <span className="font-normal text-slate-400"> {labelHint}</span>
          )}
        </label>
        <span className={`font-mono font-bold ${TONES[tone].value}`}>
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        className={`w-full cursor-pointer ${TONES[tone].accent}`}
      />
    </div>
  )
}
