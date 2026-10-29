import {
  collapseTarget,
  probabilityOfPlus,
} from '@/shared/lib/quantum/measurement'
import {
  BASES,
  basisLabel,
  preparedVector,
  type BasisKey,
  type Setup,
} from './setup'

export interface TheoryRow {
  id: string
  tone: 'first' | 'second'
  prefix: string
  plusLabel: string
  minusLabel: string
  pPlus: number
  pMinus: number
  decimals: number
}

const CERTAIN_MARGIN = 0.001

export const isCertain = (pPlus: number) =>
  pPlus > 1 - CERTAIN_MARGIN || pPlus < CERTAIN_MARGIN

export function theoryRows(setup: Setup): TheoryRow[] {
  const first = BASES[setup.m1]
  const pPlus = probabilityOfPlus(preparedVector(setup), first.axis)
  const rows: TheoryRow[] = [
    {
      id: 'm1',
      tone: 'first',
      prefix: `M1 (${setup.m1}):`,
      plusLabel: first.plus,
      minusLabel: first.minus,
      pPlus,
      pMinus: 1 - pPlus,
      decimals: 1,
    },
  ]

  if (setup.m2) {
    const second = BASES[setup.m2 as BasisKey]
    for (const bit of [0, 1] as const) {
      const q = probabilityOfPlus(collapseTarget(first.axis, bit), second.axis)
      rows.push({
        id: `m2-${bit}`,
        tone: 'second',
        prefix: `If M1 gave ${basisLabel(setup.m1, bit)}, then M2 (${setup.m2}):`,
        plusLabel: second.plus,
        minusLabel: second.minus,
        pPlus: q,
        pMinus: 1 - q,
        decimals: 0,
      })
    }
  }
  return rows
}

export const firstResultIsCertain = (setup: Setup) =>
  isCertain(probabilityOfPlus(preparedVector(setup), BASES[setup.m1].axis))
