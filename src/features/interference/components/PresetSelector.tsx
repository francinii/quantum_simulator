import { PresetButton } from '@/shared/components/PresetButton'
import { ACCENTS } from '@/shared/config/accents'
import { PRESETS } from '../lib/presets'

interface PresetSelectorProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function PresetSelector({ activeIndex, onSelect }: PresetSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {PRESETS.map((preset, index) => (
        <PresetButton
          key={preset.name}
          active={index === activeIndex}
          onSelect={() => onSelect(index)}
          label={`Scenario ${index + 1}`}
          labelClass={ACCENTS[preset.accent].label}
          title={preset.name}
          detail={preset.detail}
        />
      ))}
    </div>
  )
}
