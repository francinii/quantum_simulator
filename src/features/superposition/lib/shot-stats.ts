import type { Outcome } from '@/shared/lib/quantum/bloch'

export const MAX_LOGGED_SHOTS = 60

export interface ShotStats {
  counts: [number, number]
  history: Outcome[]
}

export const EMPTY_STATS: ShotStats = { counts: [0, 0], history: [] }

export function addShots(stats: ShotStats, outcomes: Outcome[]): ShotStats {
  const counts: [number, number] = [...stats.counts]
  for (const outcome of outcomes) counts[outcome]++
  return {
    counts,
    history: [...stats.history, ...outcomes].slice(-MAX_LOGGED_SHOTS),
  }
}

export const totalShots = ({ counts }: ShotStats) => counts[0] + counts[1]

export function frequencies(stats: ShotStats): [number, number] | null {
  const total = totalShots(stats)
  if (total === 0) return null
  return [stats.counts[0] / total, stats.counts[1] / total]
}
