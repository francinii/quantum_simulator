import { PresetButton } from '@/shared/components/PresetButton'
import { ACCENTS } from '@/shared/config/accents'
import { STEP_COUNT, STEPS } from '../lib/steps'

interface StepSelectorProps {
  step: number
  onSelect: (step: number) => void
}

export function StepSelector({ step, onSelect }: StepSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {STEPS.map(({ button }, index) => (
        <PresetButton
          key={button.label}
          active={index === step}
          onSelect={() => onSelect(index)}
          label={button.label}
          labelClass={ACCENTS[button.accent].label}
          title={button.title}
          detail={button.detail}
          className={index === STEP_COUNT - 1 ? 'col-span-2 md:col-span-1' : ''}
        />
      ))}
    </div>
  )
}
