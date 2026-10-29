import {
  applyToQubit,
  CNOT,
  H,
  X,
  ZERO_STATE_2,
} from '@/shared/lib/quantum/gates'
import {
  matVec,
  probabilities as probabilitiesOf,
  type Matrix,
  type Vector,
} from '@/shared/lib/quantum/matrix'
import type { Accent } from '@/shared/types/simulator'

export type BellKey = 'phi_plus' | 'phi_minus' | 'psi_plus' | 'psi_minus'
export const BELL_KEYS: BellKey[] = [
  'phi_plus',
  'phi_minus',
  'psi_plus',
  'psi_minus',
]

// Qubit 0 is the left bit of |q₀q₁⟩, so |10⟩ is "q₀ = 1".
export type Op = { gate: 'X'; qubit: 0 | 1 } | { gate: 'H' } | { gate: 'CNOT' }

export type Probabilities = [number, number, number, number]

interface StepDefinition {
  // Position in the 4 s cycle where this step begins, from 0 to 1.
  t: number
  description: string
  dirac: string
  ops: Op[]
}

interface BellDefinition {
  title: string
  symbol: string
  formula: string
  accent: Accent
  card: { label: string; chip: string; description: string }
  steps: StepDefinition[]
}

const x0: Op = { gate: 'X', qubit: 0 }
const x1: Op = { gate: 'X', qubit: 1 }
const h: Op = { gate: 'H' }
const cnot: Op = { gate: 'CNOT' }
const INITIAL = {
  t: 0,
  description: 'Initial state: |00⟩',
  dirac: '|ψ₀⟩ = |00⟩',
  ops: [],
}

const DEFINITIONS: Record<BellKey, BellDefinition> = {
  phi_plus: {
    title: 'Circuit for State |Φ⁺⟩',
    symbol: '|Φ⁺⟩',
    formula: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
    accent: 'blue',
    card: {
      label: 'Basis State 00',
      chip: 'H → CX',
      description: 'Symmetric identical correlation',
    },
    steps: [
      INITIAL,
      {
        t: 0.35,
        description: 'Hadamard on q₀: Uniform superposition',
        dirac: '|ψ₁⟩ = (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩+|10⟩)/√2',
        ops: [h],
      },
      {
        t: 0.75,
        description: 'CNOT: If q₀=|1⟩, flips q₁ → Entanglement!',
        dirac: '|ψ₂⟩ = (|00⟩ + |11⟩)/√2 = |Φ⁺⟩',
        ops: [cnot],
      },
    ],
  },
  phi_minus: {
    title: 'Circuit for State |Φ⁻⟩',
    symbol: '|Φ⁻⟩',
    formula: '|Φ⁻⟩ = (|00⟩ - |11⟩)/√2',
    accent: 'purple',
    card: {
      label: 'Basis State 01',
      chip: 'X₀ → H → CX',
      description: 'Identical correlation with phase -',
    },
    steps: [
      INITIAL,
      {
        t: 0.2,
        description: 'X on q₀: Bit flip to |1⟩',
        dirac: '|ψ₁⟩ = |10⟩',
        ops: [x0],
      },
      {
        t: 0.45,
        description: 'Hadamard on q₀: Introduces negative phase',
        dirac: '|ψ₂⟩ = (|0⟩-|1⟩)/√2 ⊗ |0⟩ = (|00⟩-|10⟩)/√2',
        ops: [h],
      },
      {
        t: 0.75,
        description: 'CNOT: Correlates negative phase into |11⟩',
        dirac: '|ψ₃⟩ = (|00⟩ - |11⟩)/√2 = |Φ⁻⟩',
        ops: [cnot],
      },
    ],
  },
  psi_plus: {
    title: 'Circuit for State |Ψ⁺⟩',
    symbol: '|Ψ⁺⟩',
    formula: '|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2',
    accent: 'pink',
    card: {
      label: 'Basis State 10',
      chip: 'X₁ → H → CX',
      description: 'Anti-correlation (opposite bits)',
    },
    steps: [
      INITIAL,
      {
        t: 0.2,
        description: 'X on q₁: Target bit flip',
        dirac: '|ψ₁⟩ = |01⟩',
        ops: [x1],
      },
      {
        t: 0.45,
        description: 'Hadamard on q₀: Superposition on control',
        dirac: '|ψ₂⟩ = (|0⟩+|1⟩)/√2 ⊗ |1⟩ = (|01⟩+|11⟩)/√2',
        ops: [h],
      },
      {
        t: 0.75,
        description: 'CNOT: Flips |11⟩ → |10⟩ (Anti-correlation)',
        dirac: '|ψ₃⟩ = (|01⟩ + |10⟩)/√2 = |Ψ⁺⟩',
        ops: [cnot],
      },
    ],
  },
  psi_minus: {
    title: 'Circuit for State |Ψ⁻⟩ (Singlet)',
    symbol: '|Ψ⁻⟩',
    formula: '|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2',
    accent: 'emerald',
    card: {
      label: 'Singlet State 11',
      chip: 'X₀,X₁ → H → CX',
      description: 'Rotationally invariant singlet',
    },
    steps: [
      INITIAL,
      {
        t: 0.2,
        description: 'X on both qubits: Transitions to |11⟩',
        dirac: '|ψ₁⟩ = |11⟩',
        ops: [x0, x1],
      },
      {
        t: 0.45,
        description: 'Hadamard on q₀: Negative phase on q₀',
        dirac: '|ψ₂⟩ = (|0⟩-|1⟩)/√2 ⊗ |1⟩ = (|01⟩-|11⟩)/√2',
        ops: [h],
      },
      {
        t: 0.75,
        description: 'CNOT: Inversion produces singlet state',
        dirac: '|ψ₃⟩ = (|01⟩ - |10⟩)/√2 = |Ψ⁻⟩',
        ops: [cnot],
      },
    ],
  },
}

const gateMatrix = (op: Op): Matrix =>
  op.gate === 'CNOT'
    ? CNOT
    : applyToQubit(op.gate === 'X' ? X : H, op.gate === 'X' ? op.qubit : 0, 2)

// Legacy format: zeros as "0", ±1 as "1.0", everything else with two decimals.
function formatAmplitude(value: number) {
  if (Math.abs(value) < 1e-9) return '0'
  if (Math.abs(Math.abs(value) - 1) < 1e-9) return value < 0 ? '-1.0' : '1.0'
  return value.toFixed(2)
}

export const formatVector = (vector: Vector) =>
  `[${vector.map(formatAmplitude).join(', ')}]ᵀ`

const cleanProbability = (p: number) => Math.round(p * 1e6) / 1e6

export interface BellStep {
  t: number
  description: string
  dirac: string
  vector: Vector
  vectorText: string
  probabilities: Probabilities
}

export interface BellState {
  key: BellKey
  title: string
  symbol: string
  formula: string
  accent: Accent
  card: BellDefinition['card']
  needsX0: boolean
  needsX1: boolean
  steps: BellStep[]
  finalProbabilities: Probabilities
}

function resolve(key: BellKey): BellState {
  const definition = DEFINITIONS[key]
  let vector: Vector = ZERO_STATE_2
  const steps = definition.steps.map((step): BellStep => {
    for (const op of step.ops) vector = matVec(gateMatrix(op), vector)
    return {
      t: step.t,
      description: step.description,
      dirac: step.dirac,
      vector,
      vectorText: formatVector(vector),
      probabilities: probabilitiesOf(vector).map(
        cleanProbability,
      ) as Probabilities,
    }
  })
  const ops = definition.steps.flatMap((step) => step.ops)

  return {
    key,
    title: definition.title,
    symbol: definition.symbol,
    formula: definition.formula,
    accent: definition.accent,
    card: definition.card,
    needsX0: ops.some((op) => op.gate === 'X' && op.qubit === 0),
    needsX1: ops.some((op) => op.gate === 'X' && op.qubit === 1),
    steps,
    finalProbabilities: steps.at(-1)!.probabilities,
  }
}

export const BELL_STATES = Object.fromEntries(
  BELL_KEYS.map((key) => [key, resolve(key)]),
) as Record<BellKey, BellState>

export const OUTCOMES = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'] as const
export type Outcome = (typeof OUTCOMES)[number]
