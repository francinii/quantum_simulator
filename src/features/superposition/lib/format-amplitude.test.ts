import { formatAlpha, formatBeta } from './format-amplitude'

describe('formatBeta', () => {
  it('writes a real positive amplitude at phase 0°', () => {
    expect(formatBeta(90, 0)).toBe('0.707')
  })

  it('writes a negative real amplitude at 180°', () => {
    expect(formatBeta(90, 180)).toBe('(−0.707)')
  })

  it('writes imaginary amplitudes at 90° and 270°', () => {
    expect(formatBeta(90, 90)).toBe('0.707i')
    expect(formatBeta(90, 270)).toBe('(−0.707i)')
  })

  it('falls back to polar form for any other phase', () => {
    expect(formatBeta(60, 45)).toBe('0.500·e^(i·45°)')
  })

  it('shows plain zero when the magnitude is negligible, whatever the phase', () => {
    expect(formatBeta(0, 0)).toBe('0.000')
    expect(formatBeta(0, 137)).toBe('0.000')
  })

  it('normalizes phases outside 0-360', () => {
    expect(formatBeta(90, 360)).toBe('0.707')
    expect(formatBeta(90, -90)).toBe('(−0.707i)')
  })

  it('reaches full magnitude at the south pole', () => {
    expect(formatBeta(180, 0)).toBe('1.000')
  })
})

describe('formatAlpha', () => {
  it('uses three decimals', () => {
    expect(formatAlpha(Math.SQRT1_2)).toBe('0.707')
    expect(formatAlpha(1)).toBe('1.000')
  })
})
