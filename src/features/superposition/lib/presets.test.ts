import { findActivePreset, INITIAL_PRESET, PRESETS } from './presets'
import { outcomeProbabilities } from '@/shared/lib/quantum/bloch'

describe('presets', () => {
  it('lists the six legacy states in order', () => {
    expect(PRESETS.map((p) => p.title)).toEqual([
      '|0⟩',
      '|1⟩',
      '|+⟩',
      '|−⟩',
      '|+i⟩',
      'θ = 60°',
    ])
  })

  it('starts on |+⟩', () => {
    expect(PRESETS[INITIAL_PRESET].title).toBe('|+⟩')
  })

  it('finds the preset matching θ and φ, rounding both', () => {
    expect(findActivePreset(90, 0)).toBe(2)
    expect(findActivePreset(89.6, 180.4)).toBe(3)
    expect(findActivePreset(60, 0)).toBe(5)
  })

  it('finds none when the state is not a preset', () => {
    expect(findActivePreset(45, 0)).toBe(-1)
    expect(findActivePreset(90, 45)).toBe(-1)
  })

  it('has labels that agree with the real probabilities', () => {
    const [p0] = outcomeProbabilities(PRESETS[5].theta)
    expect(Math.round(p0 * 100)).toBe(75)
    expect(PRESETS[5].detail).toBe('75% / 25%')
  })
})
