import { IDLE_MESSAGE, instantShotsMessage, lastShotMessage } from './last-shot'
import type { Setup } from './setup'

const one: Setup = { state: 'plus', m1: 'Z', m2: null, theta: 60 }
const two: Setup = { state: 'plus', m1: 'Z', m2: 'X', theta: 60 }

describe('last shot message', () => {
  it('describes a single measurement', () => {
    expect(lastShotMessage(one, 1, null)).toBe('Last shot: M1 → |1⟩ (c₀ = 1)')
  })

  it('adds the second measurement and the Qiskit bitstring', () => {
    expect(lastShotMessage(two, 0, 1)).toBe(
      'Last shot: M1 → |0⟩ (c₀ = 0), M2 → |−⟩ (c₁ = 1)  ⇒  bitstring "10"',
    )
  })

  it('has the idle and instant-run messages from the legacy page', () => {
    expect(IDLE_MESSAGE).toBe(
      'Each shot: prepare → measure → read the classical bits.',
    )
    expect(instantShotsMessage(1024)).toBe(
      'Ran 1024 shots instantly (like backend.run(qc, shots=1024)).',
    )
  })
})
