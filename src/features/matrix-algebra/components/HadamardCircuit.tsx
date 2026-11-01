import { useId } from 'react'
import { CONNECTOR, GATE, PHOTON_RADIUS, WIRES } from '../lib/circuit-geometry'
import { STEPS } from '../lib/steps'

interface HadamardCircuitProps {
  step: number
}

function Gate({
  y,
  id,
  glow,
  glowFilter,
}: {
  y: number
  id: string
  glow: boolean
  glowFilter: string
}) {
  return (
    <g transform={`translate(${GATE.x}, ${y})`}>
      <rect
        data-testid="h-gate"
        width={GATE.size}
        height={GATE.size}
        rx={10}
        fill={`url(#${id})`}
        strokeWidth={glow ? 3 : 1.8}
        filter={glow ? `url(#${glowFilter})` : undefined}
        className="stroke-brand-pink transition-all duration-300"
      />
      <text
        x={GATE.size / 2}
        y={32}
        textAnchor="middle"
        fontSize={22}
        fontWeight={800}
        className="font-sans fill-pink-text"
      >
        H
      </text>
    </g>
  )
}

export function HadamardCircuit({ step }: HadamardCircuitProps) {
  const uid = useId().replace(/:/g, '')
  const gradient = `${uid}-h`
  const glow = `${uid}-glow`
  const { cursorX, gatesGlow } = STEPS[step]

  return (
    <svg
      viewBox="0 0 700 180"
      className="h-auto w-full"
      role="img"
      aria-label="Circuit: a Hadamard gate on each of two qubits starting in |0⟩"
    >
      <defs>
        <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'var(--color-brand-pink-pale)' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'var(--color-brand-pink-soft)' }}
          />
        </linearGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={3.5} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {[
        { y: WIRES.q0, labelY: 60, name: 'q₀' },
        { y: WIRES.q1, labelY: 130, name: 'q₁' },
      ].map(({ y, labelY, name }) => (
        <g key={name}>
          <text
            x={35}
            y={labelY}
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
            x={635}
            y={labelY}
            fontSize={12}
            className="font-code fill-faint"
          >
            {name}
          </text>
        </g>
      ))}

      <path
        d="M 22 45 Q 12 85 2 90 Q 12 95 22 135"
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="stroke-brand-blue"
      />
      <text
        x={5}
        y={105}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className="font-sans fill-brand-blue"
      >
        |00⟩
      </text>

      <Gate y={GATE.topY} id={gradient} glow={gatesGlow} glowFilter={glow} />
      <Gate y={GATE.bottomY} id={gradient} glow={gatesGlow} glowFilter={glow} />

      <line
        x1={CONNECTOR.x}
        y1={CONNECTOR.fromY}
        x2={CONNECTOR.x}
        y2={CONNECTOR.toY}
        strokeWidth={2}
        strokeDasharray="3,3"
        className="stroke-brand-pink-soft"
      />
      <text
        x={320}
        y={94}
        fontSize={12}
        fontWeight="bold"
        className="font-code fill-brand-pink"
      >
        H ⊗ H
      </text>

      <path
        d="M 570 40 Q 585 40 585 87.5 Q 585 90 595 90 Q 585 90 585 92.5 Q 585 140 570 140"
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="stroke-brand-purple"
      />
      <text
        x={605}
        y={95}
        fontSize={13}
        fontWeight="bold"
        className="font-code fill-brand-purple"
      >
        |ψ₁⟩
      </text>

      <line
        data-testid="time-cursor"
        x1={cursorX}
        y1={10}
        x2={cursorX}
        y2={170}
        strokeWidth={2}
        strokeDasharray="4,4"
        opacity={0.8}
        className="stroke-brand-purple"
      />
      <circle
        data-testid="photon-0"
        cx={cursorX}
        cy={WIRES.q0}
        r={PHOTON_RADIUS}
        filter={`url(#${glow})`}
        className="fill-brand-blue"
      />
      <circle
        data-testid="photon-1"
        cx={cursorX}
        cy={WIRES.q1}
        r={PHOTON_RADIUS}
        filter={`url(#${glow})`}
        className="fill-brand-pink"
      />
    </svg>
  )
}
