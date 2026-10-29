import {
  approxEqual,
  kron,
  matVec,
  probabilities,
} from '@/shared/lib/quantum/matrix'
import { H, ZERO_STATE_2 } from '@/shared/lib/quantum/gates'
import {
  diracCardLines,
  matrixCardLines,
  nextStep,
  previousStep,
  probabilityLine,
  STEP_COUNT,
  STEP_DURATION_MS,
  STEPS,
} from './steps'

describe('step table', () => {
  it('has the five legacy steps in order', () => {
    expect(STEPS).toHaveLength(STEP_COUNT)
    expect(STEPS.map((s) => s.name)).toEqual([
      'Step 0: Basis States',
      'Step 1: Tensor Product of State Vector',
      'Step 2: Tensor Operator H ⊗ H',
      'Step 3: Matrix-Vector Multiplication',
      'Step 4: Uniform Superposition State',
    ])
    expect(STEPS.map((s) => s.button.title)).toEqual([
      'Initial States',
      'Tensor Vector',
      'Operator H ⊗ H',
      'Operation U · v',
      'Final Superposition',
    ])
  })

  it('places the cursor at the legacy x positions', () => {
    expect(STEPS.map((s) => s.cursorX)).toEqual([75, 170, 285, 380, 570])
  })

  it('lights one box for steps 0-1, two for step 2 and three after', () => {
    expect(STEPS.map((s) => s.visibleBoxes)).toEqual([1, 1, 2, 3, 3])
  })

  it('glows the H gates from step 2', () => {
    expect(STEPS.map((s) => s.gatesGlow)).toEqual([
      false,
      false,
      true,
      true,
      true,
    ])
  })

  it('is certain before the operator acts and uniform after, always summing to 100', () => {
    expect(STEPS.map((s) => s.probabilities)).toEqual([
      [100, 0, 0, 0],
      [100, 0, 0, 0],
      [100, 0, 0, 0],
      [25, 25, 25, 25],
      [25, 25, 25, 25],
    ])
    for (const { probabilities: p } of STEPS) {
      expect(p.reduce((a, b) => a + b, 0)).toBe(100)
    }
  })

  it('shows probabilities that match the real H ⊗ H computation', () => {
    const before = probabilities(ZERO_STATE_2).map((p) => p * 100)
    const after = probabilities(matVec(kron(H, H), ZERO_STATE_2)).map(
      (p) => p * 100,
    )
    expect(approxEqual(before, [...STEPS[2].probabilities])).toBe(true)
    expect(approxEqual(after, [...STEPS[4].probabilities], 1e-6)).toBe(true)
  })

  it('advances every 3.5 seconds', () => {
    expect(STEP_DURATION_MS).toBe(3500)
  })
})

describe('navigation', () => {
  it('wraps around in both directions', () => {
    expect(nextStep(0)).toBe(1)
    expect(nextStep(4)).toBe(0)
    expect(previousStep(1)).toBe(0)
    expect(previousStep(0)).toBe(4)
  })
})

describe('GIF card text', () => {
  it('matrix card changes at steps 2 and 3', () => {
    expect(matrixCardLines(0)).toEqual(matrixCardLines(1))
    expect(matrixCardLines(2)[0]).toBe('H ⊗ H: 4x4 Matrix')
    expect(matrixCardLines(3)).toEqual(matrixCardLines(4))
    expect(matrixCardLines(4)[0]).toBe('U · v = [1/2, 1/2, 1/2, 1/2]ᵀ')
  })

  it('dirac card has three lines only from step 3', () => {
    expect(diracCardLines(1)).toHaveLength(2)
    expect(diracCardLines(2)).toHaveLength(2)
    expect(diracCardLines(3)).toHaveLength(3)
    expect(diracCardLines(3)[1]).toBe('= (|00⟩+|01⟩+|10⟩+|11⟩)/2')
  })

  it('writes the probabilities of the step, not a fixed 25%', () => {
    expect(probabilityLine([100, 0, 0, 0])).toBe(
      'P(00)=100%  |  P(01)=0%  |  P(10)=0%  |  P(11)=0%',
    )
    expect(probabilityLine([25, 25, 25, 25])).toBe(
      'P(00)=25%  |  P(01)=25%  |  P(10)=25%  |  P(11)=25%',
    )
  })
})
