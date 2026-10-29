import { useId } from 'react'
import { Card } from '@/shared/components/Card'
import { PanelHeader } from '@/shared/components/PanelHeader'
import {
  BASES,
  BASIS_KEYS,
  STATE_KEYS,
  STATES,
  type BasisKey,
  type Setup,
  type StateKey,
} from '../lib/setup'
import { ChoiceChip } from './ChoiceChip'

interface SetupPanelProps {
  setup: Setup
  onChange: (patch: Partial<Setup>) => void
}

export function SetupPanel({ setup, onChange }: SetupPanelProps) {
  const thetaId = useId()
  const stateGroup = useId()
  const firstGroup = useId()
  const secondGroup = useId()

  return (
    <Card className="p-5 lg:col-span-4">
      <PanelHeader
        title="Experiment Setup"
        titleClass="text-brand-sky"
        chip="1 qubit"
        chipClass="bg-blue-50 text-brand-sky"
      />

      <div className="space-y-4 text-xs">
        <div>
          <div id={stateGroup} className="text-ink mb-1.5 font-bold">
            1. Prepare the state
          </div>
          <div
            role="group"
            aria-labelledby={stateGroup}
            className="grid grid-cols-4 gap-1.5"
          >
            {STATE_KEYS.map((key: StateKey) => (
              <ChoiceChip
                key={key}
                label={STATES[key].label}
                active={setup.state === key}
                tone="purple"
                onSelect={() => onChange({ state: key })}
              />
            ))}
          </div>
          {setup.state === 'ry' && (
            <div className="mt-2">
              <div className="mb-1 flex justify-between">
                <label htmlFor={thetaId} className="text-slate-500">
                  Rotation Ry(θ)
                </label>
                <span className="text-brand-purple font-mono font-bold">
                  {setup.theta}°
                </span>
              </div>
              <input
                id={thetaId}
                type="range"
                min={0}
                max={180}
                step={1}
                value={setup.theta}
                onChange={(event) =>
                  onChange({ theta: parseInt(event.target.value, 10) })
                }
                className="accent-brand-purple w-full cursor-pointer"
              />
            </div>
          )}
        </div>

        <div>
          <div id={firstGroup} className="text-ink mb-1.5 font-bold">
            2. First measurement basis{' '}
            <span className="font-normal text-slate-400">→ c₀</span>
          </div>
          <div
            role="group"
            aria-labelledby={firstGroup}
            className="grid grid-cols-3 gap-1.5"
          >
            {BASIS_KEYS.map((key: BasisKey) => (
              <ChoiceChip
                key={key}
                label={key}
                active={setup.m1 === key}
                tone={BASES[key].tone}
                onSelect={() => onChange({ m1: key })}
              />
            ))}
          </div>
        </div>

        <div>
          <div id={secondGroup} className="text-ink mb-1.5 font-bold">
            3. Second measurement basis{' '}
            <span className="font-normal text-slate-400">→ c₁</span>
          </div>
          <div
            role="group"
            aria-labelledby={secondGroup}
            className="grid grid-cols-4 gap-1.5"
          >
            <ChoiceChip
              label="None"
              active={setup.m2 === null}
              tone="muted"
              onSelect={() => onChange({ m2: null })}
            />
            {BASIS_KEYS.map((key: BasisKey) => (
              <ChoiceChip
                key={key}
                label={key}
                active={setup.m2 === key}
                tone={BASES[key].tone}
                onSelect={() => onChange({ m2: key })}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
