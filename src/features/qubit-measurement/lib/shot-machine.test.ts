import type { Outcome } from '@/shared/lib/quantum/bloch'
import {
  advanceShot,
  describeShot,
  DURATIONS,
  ease,
  PHOTON_X,
  startShot,
  type Shot,
} from './shot-machine'
import type { Setup } from './setup'

const setupOf = (
  state: Setup['state'],
  m1: Setup['m1'],
  m2: Setup['m2'] = null,
): Setup => ({ state, m1, m2, theta: 60 })

// Always draws below any probability above zero, so every outcome is "+" (0).
const alwaysZero = () => 0
// Always draws at the top, so every outcome that is not certain is "−" (1).
const alwaysOne = () => 0.999999

function run(shot: Shot, setup: Setup, steps: number[]) {
  const stages: string[] = []
  let current: Shot | null = shot
  let finishedAt = -1
  steps.forEach((dt, index) => {
    if (!current) return
    const result = advanceShot(current, dt, setup)
    if (result.finished) finishedAt = index
    current = result.shot
    stages.push(current ? current.stage : 'done')
  })
  return { stages, finishedAt, final: current as Shot | null }
}

describe('ease', () => {
  it('runs from 0 to 1, symmetric around the middle', () => {
    expect(ease(0)).toBe(0)
    expect(ease(1)).toBe(1)
    expect(ease(0.5)).toBeCloseTo(0.5)
    expect(ease(0.25) + ease(0.75)).toBeCloseTo(1)
  })

  it('never decreases', () => {
    let previous = 0
    for (let u = 0; u <= 1; u += 0.05) {
      expect(ease(u)).toBeGreaterThanOrEqual(previous)
      previous = ease(u)
    }
  })
})

describe('shot stages with one measurement', () => {
  const setup = setupOf('plus', 'Z')

  it('goes travel → collapse → hold → done, recording when the bit is read', () => {
    const { stages, finishedAt } = run(startShot(setup, alwaysZero), setup, [
      DURATIONS.travel1,
      DURATIONS.collapse1,
      DURATIONS.hold,
    ])
    expect(stages).toEqual(['collapse1', 'hold', 'done'])
    expect(finishedAt).toBe(1)
  })

  it('stays in a stage until its duration is reached', () => {
    const shot = startShot(setup, alwaysZero)
    const half = advanceShot(shot, DURATIONS.travel1 / 2, setup)
    expect(half.shot?.stage).toBe('travel1')
    expect(half.shot?.elapsed).toBeCloseTo(DURATIONS.travel1 / 2)
    const done = advanceShot(half.shot as Shot, DURATIONS.travel1 / 2, setup)
    expect(done.shot?.stage).toBe('collapse1')
    expect(done.shot?.elapsed).toBe(0)
  })

  it('collapses the vector onto the measured end of the axis', () => {
    const atCollapse = advanceShot(
      startShot(setup, alwaysOne),
      DURATIONS.travel1,
      setup,
    ).shot as Shot
    const done = advanceShot(atCollapse, DURATIONS.collapse1, setup)
      .shot as Shot
    expect(done.first).toBe(1)
    expect(done.vector.x).toBeCloseTo(0)
    expect(done.vector.z).toBeCloseTo(-1)
  })

  it('keeps the vector at unit length while collapsing', () => {
    const atCollapse = advanceShot(
      startShot(setup, alwaysZero),
      DURATIONS.travel1,
      setup,
    ).shot as Shot
    const middle = advanceShot(atCollapse, DURATIONS.collapse1 / 2, setup)
      .shot as Shot
    const { x, y, z } = middle.vector
    expect(Math.hypot(x, y, z)).toBeCloseTo(1)
    expect(middle.vector.x).toBeGreaterThan(0)
    expect(middle.vector.z).toBeGreaterThan(0)
  })
})

describe('shot stages with two measurements', () => {
  const setup = setupOf('plus', 'Z', 'Z')

  it('visits both collapses and records only when the second bit is read', () => {
    const { stages, finishedAt } = run(startShot(setup, alwaysZero), setup, [
      DURATIONS.travel1,
      DURATIONS.collapse1,
      DURATIONS.travel2,
      DURATIONS.collapse2,
      DURATIONS.hold,
    ])
    expect(stages).toEqual([
      'collapse1',
      'travel2',
      'collapse2',
      'hold',
      'done',
    ])
    expect(finishedAt).toBe(3)
  })

  it('repeats the first answer on a second Z measurement (collapse persists)', () => {
    for (const random of [alwaysZero, alwaysOne]) {
      const shot = startShot(setup, random)
      expect(shot.second).toBe(shot.first)
    }
  })

  it('measures the second collapse along the second basis', () => {
    const xSetup = setupOf('zero', 'Z', 'X')
    const shot = startShot(xSetup, alwaysOne)
    expect(shot.first).toBe(0)
    expect(shot.second).toBe(1)
    const { final } = run(shot, xSetup, [
      DURATIONS.travel1,
      DURATIONS.collapse1,
      DURATIONS.travel2,
      DURATIONS.collapse2,
    ])
    expect(final?.stage).toBe('hold')
    expect(final?.vector.x).toBeCloseTo(-1)
    expect(final?.vector.z).toBeCloseTo(0)
  })
})

describe('describeShot', () => {
  const one = setupOf('plus', 'Z')
  const two = setupOf('plus', 'Z', 'X')
  const at = (setup: Setup, steps: number[], random = alwaysZero) =>
    run(startShot(setup, random), setup, steps).final as Shot

  it('without a shot it shows the prepared state and the idle label', () => {
    const view = describeShot(null, one, true)
    expect(view.caption).toBe('Prepared state |+⟩')
    expect(view.stageLabel).toBe('Next shot…')
    expect(describeShot(null, one, false).stageLabel).toBe('Ready')
    expect(view.photonX).toBe(PHOTON_X.start)
    expect(view.photonVisible).toBe(false)
    expect(view.bits).toEqual([null, null])
    expect(view.activeMeter).toBeNull()
  })

  it('travelling: photon moves from the start toward meter 1', () => {
    const shot = at(one, [DURATIONS.travel1 / 2])
    const view = describeShot(shot, one, true)
    expect(view.stageLabel).toBe('Preparing…')
    expect(view.photonVisible).toBe(true)
    expect(view.photonX).toBeCloseTo((PHOTON_X.start + PHOTON_X.meter1) / 2)
  })

  it('measuring 1: caption, meter pulse and photon parked on meter 1', () => {
    const view = describeShot(at(one, [DURATIONS.travel1]), one, true)
    expect(view.caption).toBe('Measuring in Z…')
    expect(view.stageLabel).toBe('Measurement 1')
    expect(view.activeMeter).toBe(0)
    expect(view.photonX).toBe(PHOTON_X.meter1)
    expect(view.bits).toEqual([null, null])
  })

  it('single measurement hold: reads c₀ and highlights the collapsed pole', () => {
    const view = describeShot(
      at(one, [DURATIONS.travel1, DURATIONS.collapse1]),
      one,
      true,
    )
    expect(view.caption).toBe('Collapsed to |0⟩')
    expect(view.stageLabel).toBe('Result read')
    expect(view.highlight).toBe(0)
    expect(view.bits).toEqual([0, null])
    expect(view.photonX).toBe(PHOTON_X.meter1)
  })

  it('between measurements: c₀ is read, photon travels to meter 2', () => {
    const shot = at(two, [
      DURATIONS.travel1,
      DURATIONS.collapse1,
      DURATIONS.travel2 / 2,
    ])
    const view = describeShot(shot, two, true)
    expect(view.stageLabel).toBe('Between measurements')
    expect(view.caption).toBe('Collapsed to |0⟩')
    expect(view.highlight).toBe(0)
    expect(view.bits).toEqual([0, null])
    expect(view.photonX).toBeCloseTo((PHOTON_X.meter1 + PHOTON_X.meter2) / 2)
  })

  it('measuring 2: switches the basis and pulses meter 2', () => {
    const shot = at(two, [
      DURATIONS.travel1,
      DURATIONS.collapse1,
      DURATIONS.travel2,
    ])
    const view = describeShot(shot, two, true)
    expect(view.basis).toBe('X')
    expect(view.caption).toBe('Measuring in X…')
    expect(view.activeMeter).toBe(1)
    expect(view.highlight).toBeNull()
    expect(view.photonX).toBe(PHOTON_X.meter2)
  })

  it('two-measurement hold: reads both bits in the second basis', () => {
    const shot = at(
      two,
      [
        DURATIONS.travel1,
        DURATIONS.collapse1,
        DURATIONS.travel2,
        DURATIONS.collapse2,
      ],
      alwaysOne,
    )
    const view = describeShot(shot, two, true)
    expect(view.basis).toBe('X')
    expect(view.caption).toBe('Collapsed to |−⟩')
    expect(view.highlight).toBe(1)
    expect(view.bits).toEqual(
      [1 as Outcome, 1 as Outcome].map((b, i) => (i === 0 ? shot.first : b)),
    )
    expect(view.photonX).toBe(PHOTON_X.meter2)
  })
})
