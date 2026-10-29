import type { BlochVector } from '@/shared/lib/quantum/bloch'
import { AXES, outcomeDistribution } from '@/shared/lib/quantum/measurement'
import type { Accent } from '@/shared/types/simulator'

export type StateKey =
  'zero' | 'one' | 'plus' | 'minus' | 'plusI' | 'minusI' | 'ry'
export type BasisKey = 'Z' | 'X' | 'Y'
export type BasisTone = 'blue' | 'pink' | 'sky'

export interface Setup {
  state: StateKey
  m1: BasisKey
  m2: BasisKey | null
  theta: number
}

interface StateDefinition {
  label: string
  vector: BlochVector | null
  gates: string[]
  // null for Ry(θ), whose line depends on the angle.
  code: string[] | null
}

export const STATES: Record<StateKey, StateDefinition> = {
  zero: { label: '|0⟩', vector: { x: 0, y: 0, z: 1 }, gates: [], code: [] },
  one: {
    label: '|1⟩',
    vector: { x: 0, y: 0, z: -1 },
    gates: ['X'],
    code: ['qc.x(0)'],
  },
  plus: {
    label: '|+⟩',
    vector: { x: 1, y: 0, z: 0 },
    gates: ['H'],
    code: ['qc.h(0)'],
  },
  minus: {
    label: '|−⟩',
    vector: { x: -1, y: 0, z: 0 },
    gates: ['X', 'H'],
    code: ['qc.x(0)', 'qc.h(0)'],
  },
  plusI: {
    label: '|+i⟩',
    vector: { x: 0, y: 1, z: 0 },
    gates: ['H', 'S'],
    code: ['qc.h(0)', 'qc.s(0)'],
  },
  minusI: {
    label: '|−i⟩',
    vector: { x: 0, y: -1, z: 0 },
    gates: ['H', 'S†'],
    code: ['qc.h(0)', 'qc.sdg(0)'],
  },
  ry: { label: 'Ry(θ)', vector: null, gates: ['Ry'], code: null },
}

interface BasisDefinition {
  axis: BlochVector
  plus: string
  minus: string
  tone: BasisTone
  // Gates that rotate this basis onto Z before a hardware measurement, and back after.
  pre: string[]
  post: string[]
}

export const BASES: Record<BasisKey, BasisDefinition> = {
  Z: {
    axis: AXES.Z,
    plus: '|0⟩',
    minus: '|1⟩',
    tone: 'blue',
    pre: [],
    post: [],
  },
  X: {
    axis: AXES.X,
    plus: '|+⟩',
    minus: '|−⟩',
    tone: 'pink',
    pre: ['qc.h(0)'],
    post: ['qc.h(0)'],
  },
  Y: {
    axis: AXES.Y,
    plus: '|+i⟩',
    minus: '|−i⟩',
    tone: 'sky',
    pre: ['qc.sdg(0)', 'qc.h(0)'],
    post: ['qc.h(0)', 'qc.s(0)'],
  },
}

export const STATE_KEYS = Object.keys(STATES) as StateKey[]
export const BASIS_KEYS = Object.keys(BASES) as BasisKey[]

export const DEFAULT_THETA = 60

export interface Experiment {
  label: string
  title: string
  detail: string
  accent: Accent
  setup: Pick<Setup, 'state' | 'm1' | 'm2'>
}

export const EXPERIMENTS: Experiment[] = [
  {
    label: 'Experiment 1',
    title: 'Definite State',
    detail: '|0⟩ → Z: always 0',
    accent: 'blue',
    setup: { state: 'zero', m1: 'Z', m2: null },
  },
  {
    label: 'Experiment 2',
    title: 'Random Outcome',
    detail: '|+⟩ → Z: 50 / 50',
    accent: 'purple',
    setup: { state: 'plus', m1: 'Z', m2: null },
  },
  {
    label: 'Experiment 3',
    title: 'The Basis Matters',
    detail: '|+⟩ → X: always +',
    accent: 'pink',
    setup: { state: 'plus', m1: 'X', m2: null },
  },
  {
    label: 'Experiment 4',
    title: 'Collapse Persists',
    detail: '|+⟩ → Z → Z: repeats',
    accent: 'sky',
    setup: { state: 'plus', m1: 'Z', m2: 'Z' },
  },
  {
    label: 'Experiment 5',
    title: 'Incompatible Bases',
    detail: '|0⟩ → Z → X: random again',
    accent: 'emerald',
    setup: { state: 'zero', m1: 'Z', m2: 'X' },
  },
]

export const INITIAL_EXPERIMENT = 1

export const initialSetup = (): Setup => ({
  ...EXPERIMENTS[INITIAL_EXPERIMENT].setup,
  theta: DEFAULT_THETA,
})

export function findActiveExperiment(setup: Setup) {
  return EXPERIMENTS.findIndex(
    ({ setup: e }) =>
      e.state === setup.state && e.m1 === setup.m1 && e.m2 === setup.m2,
  )
}

export function preparedVector(setup: Setup): BlochVector {
  const vector = STATES[setup.state].vector
  if (vector) return vector
  const theta = (setup.theta * Math.PI) / 180
  return { x: Math.sin(theta), y: 0, z: Math.cos(theta) }
}

export const stateLabel = (setup: Setup) =>
  setup.state === 'ry' ? `Ry(${setup.theta}°)|0⟩` : STATES[setup.state].label

export const basisLabel = (basis: BasisKey, bit: 0 | 1) =>
  bit === 0 ? BASES[basis].plus : BASES[basis].minus

// Qiskit-style key: the later measurement comes first (c₁c₀).
export const outcomeKey = (setup: Setup, first: 0 | 1, second: 0 | 1 | null) =>
  setup.m2 && second !== null ? `${second}${first}` : `${first}`

export const outcomeKeys = (setup: Setup) =>
  setup.m2 ? ['00', '01', '10', '11'] : ['0', '1']

export function theoryProbabilities(setup: Setup): Record<string, number> {
  const probabilities = Object.fromEntries(
    outcomeKeys(setup).map((k) => [k, 0]),
  )
  const distribution = outcomeDistribution(
    preparedVector(setup),
    BASES[setup.m1].axis,
    setup.m2 ? BASES[setup.m2].axis : null,
  )
  for (const { bits, probability } of distribution) {
    probabilities[outcomeKey(setup, bits[0], bits[1] ?? null)] += probability
  }
  return probabilities
}
