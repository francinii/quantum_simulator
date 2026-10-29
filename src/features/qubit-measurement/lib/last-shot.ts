import type { Outcome } from '@/shared/lib/quantum/bloch'
import { basisLabel, outcomeKey, type Setup } from './setup'

export const IDLE_MESSAGE =
  'Each shot: prepare → measure → read the classical bits.'

export const instantShotsMessage = (shots: number) =>
  `Ran ${shots} shots instantly (like backend.run(qc, shots=${shots})).`

export function lastShotMessage(
  setup: Setup,
  first: Outcome,
  second: Outcome | null,
) {
  let message = `Last shot: M1 → ${basisLabel(setup.m1, first)} (c₀ = ${first})`
  if (setup.m2 && second !== null) {
    message += `, M2 → ${basisLabel(setup.m2, second)} (c₁ = ${second})  ⇒  bitstring "${outcomeKey(setup, first, second)}"`
  }
  return message
}
