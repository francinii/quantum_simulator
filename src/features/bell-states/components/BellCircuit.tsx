import { useId } from 'react'
import type { BellState } from '../lib/bell-states'
import {
  CIRCUIT_VIEWBOX,
  CNOT,
  CURSOR_Y,
  GATE_BOTTOM_Y,
  GATE_SIZE,
  GATE_TOP_Y,
  H_GATE_X,
  PHOTON_RADIUS,
  WIRES,
  X_GATE_X,
} from '../lib/circuit-geometry'
import { cursorX } from '../lib/cycle'

interface BellCircuitProps {
  state: BellState
  progress: number
}

interface GateProps {
  x: number
  y: number
  label: string
  gradient: string
  strokeClass: string
  textClass: string
  testId: string
}

function Gate({
  x,
  y,
  label,
  gradient,
  strokeClass,
  textClass,
  testId,
}: GateProps) {
  return (
    <g data-testid={testId} transform={`translate(${x}, ${y})`}>
      <rect
        width={GATE_SIZE}
        height={GATE_SIZE}
        rx={10}
        fill={`url(#${gradient})`}
        strokeWidth={1.5}
        className={strokeClass}
      />
      <text
        x={GATE_SIZE / 2}
        y={32}
        textAnchor="middle"
        fontSize={20}
        fontWeight="bold"
        className={`font-sans ${textClass}`}
      >
        {label}
      </text>
    </g>
  )
}

export function BellCircuit({ state, progress }: BellCircuitProps) {
  const uid = useId().replace(/:/g, '')
  const hGradient = `${uid}-h`
  const xGradient = `${uid}-x`
  const cnotGradient = `${uid}-cnot`
  const glow = `${uid}-glow`
  const x = cursorX(progress)

  return (
    <svg
      viewBox={`0 0 ${CIRCUIT_VIEWBOX.width} ${CIRCUIT_VIEWBOX.height}`}
      className="h-auto w-full font-sans select-none"
      role="img"
      aria-label={`Circuit for ${state.symbol}: two qubits starting in |0⟩, ${
        state.needsX0 || state.needsX1 ? 'X gates, ' : ''
      }a Hadamard on q₀ and a CNOT from q₀ to q₁`}
    >
      <defs>
        <linearGradient id={hGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--color-sphere-sky)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-sky-light)' }} />
        </linearGradient>
        <linearGradient id={xGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--color-pink-pastel)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-pink-gate)' }} />
        </linearGradient>
        <linearGradient id={cnotGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-gate-x-start)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-gate-x-end)' }}
          />
        </linearGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={3} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {[
        { y: WIRES.q0, name: 'q₀' },
        { y: WIRES.q1, name: 'q₁' },
      ].map(({ y, name }) => (
        <g key={name}>
          <text
            x={30}
            y={y + 5}
            fontSize={16}
            fontWeight="bold"
            className="font-code fill-ink"
          >
            |0⟩
          </text>
          <line
            x1={WIRES.startX}
            y1={y}
            x2={WIRES.endX}
            y2={y}
            strokeWidth={2.5}
            strokeLinecap="round"
            className="stroke-faint"
          />
          <text
            x={535}
            y={y + 5}
            fontSize={12}
            fontWeight={600}
            className="font-code fill-faint"
          >
            {name}
          </text>
        </g>
      ))}

      {state.needsX0 && (
        <Gate
          testId="x-gate-0"
          x={X_GATE_X}
          y={GATE_TOP_Y}
          label="X"
          gradient={xGradient}
          strokeClass="stroke-pink-gate"
          textClass="fill-pink-text"
        />
      )}
      {state.needsX1 && (
        <Gate
          testId="x-gate-1"
          x={X_GATE_X}
          y={GATE_BOTTOM_Y}
          label="X"
          gradient={xGradient}
          strokeClass="stroke-pink-gate"
          textClass="fill-pink-text"
        />
      )}
      <Gate
        testId="h-gate"
        x={H_GATE_X}
        y={GATE_TOP_Y}
        label="H"
        gradient={hGradient}
        strokeClass="stroke-gate-x-end"
        textClass="fill-sky-deep"
      />

      <g data-testid="cnot-gate">
        <line
          x1={CNOT.x}
          y1={WIRES.q0}
          x2={CNOT.x}
          y2={WIRES.q1}
          strokeWidth={2.5}
          className="stroke-night"
        />
        <circle
          cx={CNOT.x}
          cy={WIRES.q0}
          r={CNOT.controlRadius}
          className="fill-night"
        />
        <circle
          cx={CNOT.x}
          cy={WIRES.q1}
          r={CNOT.targetRadius}
          fill={`url(#${cnotGradient})`}
          strokeWidth={1.5}
          className="stroke-brand-sky"
        />
        <line
          x1={CNOT.x}
          y1={WIRES.q1 - 20}
          x2={CNOT.x}
          y2={WIRES.q1 + 20}
          strokeWidth={2.2}
          className="stroke-sky-deep"
        />
        <line
          x1={CNOT.x - 20}
          y1={WIRES.q1}
          x2={CNOT.x + 20}
          y2={WIRES.q1}
          strokeWidth={2.2}
          className="stroke-sky-deep"
        />
      </g>

      <path
        d="M 500 50 Q 515 50 515 107.5 Q 515 110 525 110 Q 515 110 515 112.5 Q 515 170 500 170"
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="stroke-brand-pink-soft"
      />
      <text
        data-testid="state-symbol"
        x={540}
        y={115}
        fontSize={14}
        fontWeight="bold"
        className="font-code fill-brand-pink"
      >
        {state.symbol}
      </text>

      <circle
        data-testid="photon-0"
        cx={x}
        cy={WIRES.q0}
        r={PHOTON_RADIUS}
        filter={`url(#${glow})`}
        className="fill-brand-blue"
      />
      <circle
        data-testid="photon-1"
        cx={x}
        cy={WIRES.q1}
        r={PHOTON_RADIUS}
        filter={`url(#${glow})`}
        className="fill-brand-pink"
      />
      <line
        data-testid="time-cursor"
        x1={x}
        y1={CURSOR_Y.from}
        x2={x}
        y2={CURSOR_Y.to}
        strokeWidth={2}
        strokeDasharray="4,4"
        opacity={0.75}
        className="stroke-brand-purple"
      />
    </svg>
  )
}
