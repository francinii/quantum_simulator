import { useId } from 'react'
import type { Outcome } from '@/shared/lib/quantum/bloch'
import type { ShotView } from '../lib/shot-machine'
import {
  BASES,
  STATES,
  stateLabel,
  type BasisKey,
  type BasisTone,
  type Setup,
} from '../lib/setup'

const FILL_BY_TONE: Record<BasisTone, string> = {
  blue: 'fill-brand-blue',
  pink: 'fill-brand-pink',
  sky: 'fill-brand-sky',
}

const METER_X = { first: 304, second: 454 }

interface MeterProps {
  x: number
  basis: BasisKey
  bitIndex: 0 | 1
  bit: Outcome | null
  active: boolean
  gradientId: string
}

function Meter({ x, basis, bitIndex, bit, active, gradientId }: MeterProps) {
  const fill = FILL_BY_TONE[BASES[basis].tone]
  const bitFill =
    bit === null
      ? 'fill-faint'
      : bit === 0
        ? 'fill-brand-blue'
        : 'fill-brand-pink'

  return (
    <g
      data-testid={`meter-${bitIndex}`}
      className={active ? 'animate-meter-pulse motion-reduce:animate-none' : ''}
    >
      <rect
        x={x}
        y={36}
        width={52}
        height={48}
        rx={10}
        fill={`url(#${gradientId})`}
        strokeWidth={1.8}
        className="stroke-brand-purple"
      />
      <path
        d={`M ${x + 10} 72 A 16 16 0 0 1 ${x + 42} 72`}
        fill="none"
        strokeWidth={2}
        className="stroke-ink"
      />
      <line
        x1={x + 26}
        y1={74}
        x2={x + 38}
        y2={50}
        strokeWidth={2}
        strokeLinecap="round"
        className="stroke-ink"
      />
      <circle cx={x + 50} cy={38} r={11} className={fill} />
      <text
        x={x + 50}
        y={42.5}
        textAnchor="middle"
        fontSize={12}
        fontWeight={800}
        className="font-sans fill-surface"
      >
        {basis}
      </text>
      <line
        x1={x + 24}
        y1={84}
        x2={x + 24}
        y2={140}
        strokeWidth={1.5}
        className="stroke-brand-purple"
      />
      <line
        x1={x + 28}
        y1={84}
        x2={x + 28}
        y2={140}
        strokeWidth={1.5}
        className="stroke-brand-purple"
      />
      <path
        d={`M ${x + 19} 138 L ${x + 26} 147 L ${x + 33} 138 Z`}
        className="fill-brand-purple"
      />
      <text
        x={x + 26}
        y={172}
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
        className="font-code fill-brand-purple"
      >
        {bitIndex === 0 ? 'c₀' : 'c₁'}
      </text>
      <text
        data-testid={`bit-${bitIndex}`}
        x={x + 26}
        y={192}
        textAnchor="middle"
        fontSize={15}
        fontWeight={800}
        className={`font-code ${bitFill}`}
      >
        {bit ?? '?'}
      </text>
      <text
        x={x + 26}
        y={26}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className={`font-sans ${fill}`}
      >
        {basis} basis
      </text>
    </g>
  )
}

interface MeasurementCircuitProps {
  setup: Setup
  view: ShotView
}

export function MeasurementCircuit({ setup, view }: MeasurementCircuitProps) {
  const uid = useId().replace(/:/g, '')
  const hGradient = `${uid}-h`
  const xGradient = `${uid}-x`
  const meterGradient = `${uid}-m`
  const glow = `${uid}-glow`
  const gates = STATES[setup.state].gates
  const bits = setup.m2 ? 2 : 1

  return (
    <svg
      viewBox="0 0 700 200"
      className="h-auto w-full"
      role="img"
      aria-label="Quantum circuit: prepare, measure, read classical bits"
    >
      <defs>
        <linearGradient id={hGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-brand-pink-pale)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-brand-pink-soft)' }}
          />
        </linearGradient>
        <linearGradient id={xGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-gate-x-start)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-gate-x-end)' }}
          />
        </linearGradient>
        <linearGradient id={meterGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-measure-start)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-measure-end)' }}
          />
        </linearGradient>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3.5} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <text
        x={22}
        y={65}
        fontSize={16}
        fontWeight="bold"
        className="font-code fill-ink"
      >
        |0⟩
      </text>
      <line
        x1={62}
        y1={60}
        x2={640}
        y2={60}
        strokeWidth={2.5}
        strokeLinecap="round"
        className="stroke-faint"
      />
      <text x={650} y={65} fontSize={12} className="font-code fill-faint">
        q₀
      </text>

      <text
        x={30}
        y={155}
        fontSize={14}
        fontWeight="bold"
        className="font-code fill-brand-purple"
      >
        c
      </text>
      <line
        x1={62}
        y1={147}
        x2={640}
        y2={147}
        strokeWidth={1.5}
        className="stroke-violet-line"
      />
      <line
        x1={62}
        y1={152}
        x2={640}
        y2={152}
        strokeWidth={1.5}
        className="stroke-violet-line"
      />
      <text
        x={650}
        y={155}
        fontSize={11}
        className="font-code fill-brand-purple"
      >
        {bits} bit{bits === 2 ? 's' : ''}
      </text>

      <text
        x={130 + Math.max(0, gates.length - 1) * 31 + 23}
        y={108}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className="font-sans fill-brand-pink"
      >
        prepare {stateLabel(setup)}
      </text>
      {gates.length === 0 ? (
        <text
          x={180}
          y={30}
          textAnchor="middle"
          fontSize={10}
          className="font-sans fill-faint"
        >
          (no gates: stays |0⟩)
        </text>
      ) : (
        gates.map((gate, index) => {
          const isX = gate === 'X'
          return (
            <g
              key={`${gate}-${index}`}
              transform={`translate(${130 + index * 62}, 37)`}
            >
              <rect
                width={46}
                height={46}
                rx={10}
                fill={`url(#${isX ? xGradient : hGradient})`}
                strokeWidth={1.8}
                className={isX ? 'stroke-brand-sky' : 'stroke-brand-pink'}
              />
              <text
                x={23}
                y={30}
                textAnchor="middle"
                fontSize={gate.length > 1 ? 16 : 20}
                fontWeight={800}
                className={`font-sans ${isX ? 'fill-sky-deep' : 'fill-pink-text'}`}
              >
                {gate}
              </text>
            </g>
          )
        })
      )}

      <Meter
        x={METER_X.first}
        basis={setup.m1}
        bitIndex={0}
        bit={view.bits[0]}
        active={view.activeMeter === 0}
        gradientId={meterGradient}
      />
      {setup.m2 && (
        <Meter
          x={METER_X.second}
          basis={setup.m2}
          bitIndex={1}
          bit={view.bits[1]}
          active={view.activeMeter === 1}
          gradientId={meterGradient}
        />
      )}

      <circle
        data-testid="photon"
        cx={view.photonX}
        cy={60}
        r={7}
        filter={`url(#${glow})`}
        opacity={view.photonVisible ? 1 : 0}
        className="fill-brand-purple"
      />
    </svg>
  )
}
