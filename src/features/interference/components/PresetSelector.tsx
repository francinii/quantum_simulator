import { ACCENTS } from '@/shared/config/accents'
import { PRESETS } from '../lib/presets'

interface PresetSelectorProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function PresetSelector({ activeIndex, onSelect }: PresetSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {PRESETS.map((preset, index) => {
        const active = index === activeIndex
        return (
          <button
            key={preset.name}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(index)}
            className={`rounded-2xl border-2 bg-white p-2.5 text-left transition-all ${
              active
                ? 'border-brand-blue ring-brand-blue/20 shadow-md ring-2'
                : 'border-slate-200 opacity-75 hover:border-slate-300'
            }`}
          >
            <div
              className={`text-[10px] font-bold tracking-wider uppercase ${ACCENTS[preset.accent].label}`}
            >
              Scenario {index + 1}
            </div>
            <div className="text-ink mt-0.5 text-xs font-extrabold">
              {preset.name}
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              {preset.detail}
            </div>
          </button>
        )
      })}
    </div>
  )
}
