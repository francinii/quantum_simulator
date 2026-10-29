import {
  addShots,
  EMPTY_STATS,
  frequencies,
  MAX_LOGGED_SHOTS,
  totalShots,
} from './shot-stats'

describe('shot stats', () => {
  it('starts empty with no frequencies', () => {
    expect(totalShots(EMPTY_STATS)).toBe(0)
    expect(frequencies(EMPTY_STATS)).toBeNull()
  })

  it('counts each outcome and keeps the order', () => {
    const stats = addShots(EMPTY_STATS, [0, 1, 1, 0, 1])
    expect(stats.counts).toEqual([2, 3])
    expect(stats.history).toEqual([0, 1, 1, 0, 1])
    expect(totalShots(stats)).toBe(5)
  })

  it('does not mutate the previous stats', () => {
    addShots(EMPTY_STATS, [1, 1])
    expect(EMPTY_STATS.counts).toEqual([0, 0])
    expect(EMPTY_STATS.history).toEqual([])
  })

  it('keeps only the last 60 outcomes in the log but counts every shot', () => {
    const first = addShots(EMPTY_STATS, Array<0>(100).fill(0))
    const stats = addShots(first, [1, 1, 1])

    expect(stats.counts).toEqual([100, 3])
    expect(stats.history).toHaveLength(MAX_LOGGED_SHOTS)
    expect(stats.history.slice(-3)).toEqual([1, 1, 1])
  })

  it('computes frequencies that sum to one', () => {
    const [f0, f1] = frequencies(addShots(EMPTY_STATS, [0, 0, 0, 1]))!
    expect(f0).toBeCloseTo(0.75)
    expect(f1).toBeCloseTo(0.25)
  })
})
