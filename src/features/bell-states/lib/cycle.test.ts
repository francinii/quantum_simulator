import { BELL_STATES } from './bell-states'
import {
  advance,
  blochArrows,
  currentStep,
  cursorX,
  entropyLabel,
  isEntangled,
  phaseLabel,
  probabilityNote,
  sphereRotation,
  stepForward,
  stepIndex,
} from './cycle'

describe('advance', () => {
  it('takes four seconds per cycle at 1x and scales with speed', () => {
    expect(advance(0, 1, 1)).toBeCloseTo(0.25)
    expect(advance(0, 1, 2)).toBeCloseTo(0.5)
  })

  it('wraps back to the start after passing the end', () => {
    expect(advance(0.95, 1, 1)).toBe(0)
    expect(advance(1, 0, 1)).toBe(1)
  })
})

describe('stepForward', () => {
  it('adds 0.15 and wraps', () => {
    expect(stepForward(0)).toBeCloseTo(0.15)
    expect(stepForward(0.9)).toBeCloseTo(0.05)
  })
})

describe('cursorX', () => {
  it('runs from 70 to 500 across the circuit', () => {
    expect(cursorX(0)).toBe(70)
    expect(cursorX(1)).toBe(500)
    expect(cursorX(0.5)).toBe(285)
  })
})

describe('step lookup', () => {
  const phi = BELL_STATES.phi_plus
  const psi = BELL_STATES.psi_minus

  it('picks the last step already reached', () => {
    expect(stepIndex(phi, 0)).toBe(0)
    expect(stepIndex(phi, 0.34)).toBe(0)
    expect(stepIndex(phi, 0.35)).toBe(1)
    expect(stepIndex(phi, 0.9)).toBe(2)
    expect(stepIndex(psi, 0.2)).toBe(1)
    expect(stepIndex(psi, 0.5)).toBe(2)
    expect(stepIndex(psi, 0.75)).toBe(3)
  })

  it('returns the step data for the current moment', () => {
    expect(currentStep(phi, 0.5).vectorText).toBe('[0.71, 0, 0.71, 0]ᵀ')
    expect(currentStep(phi, 0.8).probabilities).toEqual([0.5, 0, 0, 0.5])
  })
})

describe('phase and entanglement', () => {
  it('labels the phase by progress', () => {
    expect(phaseLabel(0.19)).toBe('Input')
    expect(phaseLabel(0.2)).toBe('Superposition')
    expect(phaseLabel(0.59)).toBe('Superposition')
    expect(phaseLabel(0.6)).toBe('Entanglement')
  })

  it('becomes entangled at 0.70', () => {
    expect(isEntangled(0.69)).toBe(false)
    expect(isEntangled(0.7)).toBe(true)
  })

  it('reports entropy 0 until entangled, then the maximum', () => {
    expect(entropyLabel(0.5)).toBe('0.00 qubits')
    expect(entropyLabel(0.7)).toBe('1.00 qubit (Max)')
  })
})

describe('blochArrows', () => {
  it('starts both qubits at |0⟩, full length', () => {
    const [a, b] = blochArrows(BELL_STATES.phi_plus, 0)
    expect(a).toEqual({ direction: [0, 1, 0], length: 1 })
    expect(b).toEqual({ direction: [0, 1, 0], length: 1 })
  })

  it('flips the qubits that receive an X gate after 0.15', () => {
    const [a, b] = blochArrows(BELL_STATES.psi_minus, 0.2)
    expect(a.direction).toEqual([0, -1, 0])
    expect(b.direction).toEqual([0, -1, 0])
    expect(blochArrows(BELL_STATES.psi_plus, 0.2)[0].direction).toEqual([
      0, 1, 0,
    ])
    expect(blochArrows(BELL_STATES.psi_plus, 0.2)[1].direction).toEqual([
      0, -1, 0,
    ])
  })

  it('tips q₀ onto +X or −X during the Hadamard window', () => {
    expect(blochArrows(BELL_STATES.phi_plus, 0.5)[0].direction).toEqual([
      1, 0, 0,
    ])
    expect(blochArrows(BELL_STATES.phi_minus, 0.5)[0].direction).toEqual([
      -1, 0, 0,
    ])
    expect(blochArrows(BELL_STATES.phi_plus, 0.5)[1].direction).toEqual([
      0, 1, 0,
    ])
  })

  it('shrinks both arrows after the CNOT, never below 0.02', () => {
    expect(blochArrows(BELL_STATES.phi_plus, 0.7)[0].length).toBeCloseTo(1)
    expect(blochArrows(BELL_STATES.phi_plus, 0.8)[1].length).toBeCloseTo(0.67)
    expect(blochArrows(BELL_STATES.phi_plus, 1)[0].length).toBe(0.02)
  })
})

describe('sphereRotation', () => {
  it('turns 0.8 rad per cycle', () => {
    expect(sphereRotation(0.5)).toBeCloseTo(0.4)
  })
})

describe('probabilityNote', () => {
  it('names the single configuration or the two that share the probability', () => {
    expect(probabilityNote([1, 0, 0, 0])).toBe(
      'Probability is concentrated in a single configuration: |00⟩.',
    )
    expect(probabilityNote([0.5, 0, 0, 0.5])).toBe(
      'Probability is shared equally between |00⟩ and |11⟩.',
    )
    expect(probabilityNote([0, 0.5, 0.5, 0])).toBe(
      'Probability is shared equally between |01⟩ and |10⟩.',
    )
  })
})
