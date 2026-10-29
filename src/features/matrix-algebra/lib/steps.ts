import type { Accent } from '@/shared/types/simulator'

export const STEP_COUNT = 5
export const STEP_DURATION_MS = 3500

export type Probabilities = [number, number, number, number]

export interface StepInfo {
  // Shown in the circuit badge.
  name: string
  // Percent for |00⟩ |01⟩ |10⟩ |11⟩.
  probabilities: Probabilities
  // How many of the three notation boxes are lit on each side.
  visibleBoxes: 1 | 2 | 3
  // Where the time cursor and photons sit on the circuit.
  cursorX: number
  // The H gates glow once they have been reached.
  gatesGlow: boolean
  button: { label: string; title: string; detail: string; accent: Accent }
}

const CERTAIN: Probabilities = [100, 0, 0, 0]
const UNIFORM: Probabilities = [25, 25, 25, 25]

export const STEPS: StepInfo[] = [
  {
    name: 'Step 0: Basis States',
    probabilities: CERTAIN,
    visibleBoxes: 1,
    cursorX: 75,
    gatesGlow: false,
    button: {
      label: 'Step 0',
      title: 'Initial States',
      detail: '|0⟩ ⊗ |0⟩',
      accent: 'blue',
    },
  },
  {
    name: 'Step 1: Tensor Product of State Vector',
    probabilities: CERTAIN,
    visibleBoxes: 1,
    cursorX: 170,
    gatesGlow: false,
    button: {
      label: 'Step 1',
      title: 'Tensor Vector',
      detail: 'v₀ ⊗ v₁ = [1,0,0,0]ᵀ',
      accent: 'purple',
    },
  },
  {
    name: 'Step 2: Tensor Operator H ⊗ H',
    probabilities: CERTAIN,
    visibleBoxes: 2,
    cursorX: 285,
    gatesGlow: true,
    button: {
      label: 'Step 2',
      title: 'Operator H ⊗ H',
      detail: '4x4 Hadamard Matrix',
      accent: 'pink',
    },
  },
  {
    name: 'Step 3: Matrix-Vector Multiplication',
    probabilities: UNIFORM,
    visibleBoxes: 3,
    cursorX: 380,
    gatesGlow: true,
    button: {
      label: 'Step 3',
      title: 'Operation U · v',
      detail: 'Matrix-Vector Multiplication',
      accent: 'sky',
    },
  },
  {
    name: 'Step 4: Uniform Superposition State',
    probabilities: UNIFORM,
    visibleBoxes: 3,
    cursorX: 570,
    gatesGlow: true,
    button: {
      label: 'Step 4',
      title: 'Final Superposition',
      detail: 'P(ij) = 25% each',
      accent: 'emerald',
    },
  },
]

export const nextStep = (step: number) => (step + 1) % STEP_COUNT
export const previousStep = (step: number) =>
  (step - 1 + STEP_COUNT) % STEP_COUNT

export const BASIS_KETS = ['|00⟩', '|01⟩', '|10⟩', '|11⟩']

// Key lines the GIF shows on each notation card, by step.
export function matrixCardLines(step: number): string[] {
  if (step <= 1)
    return [
      'v₀ ⊗ v₁ = [1,0,0,0]ᵀ',
      'Computational Basis: |00⟩',
      'Kronecker product',
    ]
  if (step === 2)
    return ['H ⊗ H: 4x4 Matrix', 'Global scalar: 1/2', 'Hadamard subblocks']
  return [
    'U · v = [1/2, 1/2, 1/2, 1/2]ᵀ',
    'Column 1 Extraction',
    'Constructive interference',
  ]
}

export function diracCardLines(step: number): string[] {
  if (step <= 1) return ['|ψ₀⟩ = |00⟩', 'Individual ket: |0⟩']
  if (step === 2) return ['H|0⟩ = (|0⟩+|1⟩)/√2', 'Superposition on each qubit']
  return [
    '(|0⟩+|1⟩) ⊗ (|0⟩+|1⟩)/2',
    '= (|00⟩+|01⟩+|10⟩+|11⟩)/2',
    'Distributive Property',
  ]
}

export const probabilityLine = ([p00, p01, p10, p11]: Probabilities) =>
  `P(00)=${p00}%  |  P(01)=${p01}%  |  P(10)=${p10}%  |  P(11)=${p11}%`
