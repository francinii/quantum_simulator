import type { BlochVector, Outcome } from '@/shared/lib/quantum/bloch'
import {
  collapseTarget,
  normalize,
  sampleShot,
} from '@/shared/lib/quantum/measurement'
import {
  BASES,
  basisLabel,
  preparedVector,
  stateLabel,
  type BasisKey,
  type Setup,
} from './setup'

export type Stage = 'travel1' | 'collapse1' | 'travel2' | 'collapse2' | 'hold'

export const DURATIONS: Record<Stage, number> = {
  travel1: 0.9,
  collapse1: 0.6,
  travel2: 0.7,
  collapse2: 0.6,
  hold: 1.1,
}

export const PHOTON_X = { start: 70, meter1: 330, meter2: 480 }
export const IDLE_BEFORE_NEXT_SHOT = 0.35

export interface Shot {
  stage: Stage
  elapsed: number
  first: Outcome
  second: Outcome | null
  vector: BlochVector
  // Where the current collapse started from.
  from: BlochVector
}

export const ease = (u: number) =>
  u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2

export const mix = (
  from: BlochVector,
  to: BlochVector,
  e: number,
): BlochVector => ({
  x: from.x * (1 - e) + to.x * e,
  y: from.y * (1 - e) + to.y * e,
  z: from.z * (1 - e) + to.z * e,
})

export function startShot(
  setup: Setup,
  random: () => number = Math.random,
): Shot {
  const vector = preparedVector(setup)
  const { first, second } = sampleShot(
    vector,
    BASES[setup.m1].axis,
    setup.m2 ? BASES[setup.m2].axis : null,
    random,
  )
  return { stage: 'travel1', elapsed: 0, first, second, vector, from: vector }
}

export interface Advance {
  // null once the hold stage is over.
  shot: Shot | null
  // True on the step that reads the last classical bit, when the result is recorded.
  finished: boolean
}

export function advanceShot(shot: Shot, dt: number, setup: Setup): Advance {
  const elapsed = shot.elapsed + dt
  const progress = Math.min(1, elapsed / DURATIONS[shot.stage])
  let vector = shot.vector

  if (shot.stage === 'collapse1' || shot.stage === 'collapse2') {
    const first = shot.stage === 'collapse1'
    const basis = (first ? setup.m1 : setup.m2) as BasisKey
    const bit = (first ? shot.first : shot.second) as Outcome
    const target = collapseTarget(BASES[basis].axis, bit)
    vector = normalize(mix(shot.from, target, ease(progress)), target)
  }

  if (progress < 1)
    return { shot: { ...shot, elapsed, vector }, finished: false }

  const next = { ...shot, elapsed: 0, vector }
  switch (shot.stage) {
    case 'travel1':
      return {
        shot: { ...next, stage: 'collapse1', from: vector },
        finished: false,
      }
    case 'collapse1':
      return setup.m2
        ? { shot: { ...next, stage: 'travel2' }, finished: false }
        : { shot: { ...next, stage: 'hold' }, finished: true }
    case 'travel2':
      return {
        shot: { ...next, stage: 'collapse2', from: vector },
        finished: false,
      }
    case 'collapse2':
      return { shot: { ...next, stage: 'hold' }, finished: true }
    case 'hold':
      return { shot: null, finished: false }
  }
}

export interface ShotView {
  vector: BlochVector
  basis: BasisKey
  highlight: Outcome | null
  caption: string
  stageLabel: string
  photonX: number
  photonVisible: boolean
  activeMeter: 0 | 1 | null
  bits: [Outcome | null, Outcome | null]
}

const STAGE_LABELS: Record<Stage, string> = {
  travel1: 'Preparing…',
  collapse1: 'Measurement 1',
  travel2: 'Between measurements',
  collapse2: 'Measurement 2',
  hold: 'Result read',
}

function photonPosition(shot: Shot | null, setup: Setup) {
  if (!shot) return PHOTON_X.start
  const u = Math.min(1, shot.elapsed / DURATIONS[shot.stage])
  const { start, meter1, meter2 } = PHOTON_X
  switch (shot.stage) {
    case 'travel1':
      return start + (meter1 - start) * ease(u)
    case 'collapse1':
      return meter1
    case 'travel2':
      return meter1 + (meter2 - meter1) * ease(u)
    default:
      return setup.m2 ? meter2 : meter1
  }
}

export function describeShot(
  shot: Shot | null,
  setup: Setup,
  autoRunning: boolean,
): ShotView {
  let basis = setup.m1
  let highlight: Outcome | null = null
  let caption = `Prepared state ${stateLabel(setup)}`
  let bits: ShotView['bits'] = [null, null]
  let activeMeter: ShotView['activeMeter'] = null

  if (shot) {
    const collapsedFirst = `Collapsed to ${basisLabel(setup.m1, shot.first)}`
    switch (shot.stage) {
      case 'collapse1':
        caption = `Measuring in ${setup.m1}…`
        activeMeter = 0
        break
      case 'travel2':
        highlight = shot.first
        caption = collapsedFirst
        bits = [shot.first, null]
        break
      case 'collapse2':
        basis = setup.m2 as BasisKey
        caption = `Measuring in ${basis}…`
        activeMeter = 1
        bits = [shot.first, null]
        break
      case 'hold':
        if (setup.m2 && shot.second !== null) {
          basis = setup.m2
          highlight = shot.second
          caption = `Collapsed to ${basisLabel(setup.m2, shot.second)}`
          bits = [shot.first, shot.second]
        } else {
          highlight = shot.first
          caption = collapsedFirst
          bits = [shot.first, null]
        }
        break
    }
  }

  return {
    vector: shot ? shot.vector : preparedVector(setup),
    basis,
    highlight,
    caption,
    stageLabel: shot
      ? STAGE_LABELS[shot.stage]
      : autoRunning
        ? 'Next shot…'
        : 'Ready',
    photonX: photonPosition(shot, setup),
    photonVisible: shot !== null,
    activeMeter,
    bits,
  }
}
