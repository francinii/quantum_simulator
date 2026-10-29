import { PresetButton } from '@/shared/components/PresetButton'
import { ACCENTS } from '@/shared/config/accents'
import { PRESETS } from '../lib/presets'

interface PresetSelectorProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function PresetSelector({ activeIndex, onSelect }: PresetSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
      {PRESETS.map((preset, index) => (
        <PresetButton
          key={preset.title}
          active={index === activeIndex}
          onSelect={() => onSelect(index)}
          label={preset.label}
          labelClass={ACCENTS[preset.accent].label}
          title={preset.title}
          titleClass="font-mono text-sm"
          detail={preset.detail}
        />
      ))}
    </div>
  )
}
