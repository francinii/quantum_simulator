import { OUTCOMES, type Outcome, type Probabilities } from './bell-states'

// Draws one outcome from the final distribution; outcomes with zero probability can never be returned.
export function measureOutcome(
  probabilities: Probabilities,
  random: () => number = Math.random,
): Outcome {
  const roll = random()
  let sum = 0
  let last = 0
  for (let i = 0; i < probabilities.length; i++) {
    if (probabilities[i] <= 0) continue
    last = i
    sum += probabilities[i]
    if (roll < sum) return OUTCOMES[i]
  }
  return OUTCOMES[last]
}
