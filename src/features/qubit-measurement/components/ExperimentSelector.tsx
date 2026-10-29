import { PresetButton } from '@/shared/components/PresetButton'
import { ACCENTS } from '@/shared/config/accents'
import { EXPERIMENTS } from '../lib/setup'

interface ExperimentSelectorProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function ExperimentSelector({
  activeIndex,
  onSelect,
}: ExperimentSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {EXPERIMENTS.map((experiment, index) => (
        <PresetButton
          key={experiment.title}
          active={index === activeIndex}
          onSelect={() => onSelect(index)}
          label={experiment.label}
          labelClass={ACCENTS[experiment.accent].label}
          title={experiment.title}
          detail={experiment.detail}
          className={
            index === EXPERIMENTS.length - 1 ? 'col-span-2 md:col-span-1' : ''
          }
        />
      ))}
    </div>
  )
}
