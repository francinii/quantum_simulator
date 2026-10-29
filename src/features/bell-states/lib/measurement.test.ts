import { BELL_KEYS, BELL_STATES, type Outcome } from './bell-states'
import { measureOutcome } from './measurement'

describe('measureOutcome', () => {
  it('splits Φ⁺ between 00 and 11 at the 0.5 mark', () => {
    const p = BELL_STATES.phi_plus.finalProbabilities
    expect(measureOutcome(p, () => 0)).toBe('|00⟩')
    expect(measureOutcome(p, () => 0.49)).toBe('|00⟩')
    expect(measureOutcome(p, () => 0.5)).toBe('|11⟩')
    expect(measureOutcome(p, () => 0.99)).toBe('|11⟩')
  })

  it('splits Ψ± between 01 and 10', () => {
    const p = BELL_STATES.psi_minus.finalProbabilities
    expect(measureOutcome(p, () => 0.1)).toBe('|01⟩')
    expect(measureOutcome(p, () => 0.9)).toBe('|10⟩')
  })

  it('still returns an allowed outcome when the roll rounds up to 1', () => {
    expect(measureOutcome([0.5, 0, 0, 0.5], () => 1)).toBe('|11⟩')
    expect(measureOutcome([0, 0.5, 0.5, 0], () => 1)).toBe('|10⟩')
  })

  it.each(BELL_KEYS)(
    '%s: never gives a forbidden outcome and lands near 50/50 over 10,000 shots',
    (key) => {
      const p = BELL_STATES[key].finalProbabilities
      const counts: Record<string, number> = {}
      let seed = 12345
      // A small deterministic generator keeps the tolerance check reproducible.
      const random = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296
        return seed / 4294967296
      }
      for (let i = 0; i < 10000; i++) {
        const outcome: Outcome = measureOutcome(p, random)
        counts[outcome] = (counts[outcome] ?? 0) + 1
      }
      const allowed = key.startsWith('phi')
        ? ['|00⟩', '|11⟩']
        : ['|01⟩', '|10⟩']
      expect(Object.keys(counts).sort()).toEqual(allowed)
      for (const outcome of allowed) {
        expect(Math.abs(counts[outcome] / 10000 - 0.5)).toBeLessThan(0.03)
      }
    },
  )
})
