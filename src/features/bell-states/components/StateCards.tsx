import { ACCENTS } from '@/shared/config/accents'
import { BELL_KEYS, BELL_STATES, type BellKey } from '../lib/bell-states'

interface StateCardsProps {
  selected: BellKey
  onSelect: (key: BellKey) => void
}

export function StateCards({ selected, onSelect }: StateCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {BELL_KEYS.map((key) => {
        const { formula, accent, card } = BELL_STATES[key]
        const active = key === selected
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(key)}
            className={`rounded-2xl border-2 bg-white p-3 text-left transition-all duration-200 ${
              active
                ? 'border-brand-blue ring-brand-blue/20 shadow-md ring-2'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold tracking-wider uppercase ${ACCENTS[accent].label}`}
              >
                {card.label}
              </span>
              <span
                className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold ${ACCENTS[accent].chip}`}
              >
                {card.chip}
              </span>
            </div>
            <div className="text-ink font-code mt-1 text-lg font-extrabold">
              {formula.replace(/ ([+-]) /g, '$1')}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">
              {card.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
