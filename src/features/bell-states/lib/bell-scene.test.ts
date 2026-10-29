import { MOUSE_SENSITIVITY } from '@/shared/lib/three/orbit'
import { cameraPosition, INITIAL_ORBIT, orbit, PHI_LIMITS } from './bell-scene'

describe('orbit with this scene limits', () => {
  it('turns the camera around the spheres without clamping the azimuth', () => {
    expect(orbit(INITIAL_ORBIT, 100, 0, MOUSE_SENSITIVITY).theta).toBeCloseTo(
      INITIAL_ORBIT.theta - 1,
    )
    expect(orbit(INITIAL_ORBIT, 1e5, 0, MOUSE_SENSITIVITY).theta).toBeLessThan(
      -100,
    )
  })

  it('keeps the tilt between −0.6 and 0.6 radians', () => {
    expect(orbit(INITIAL_ORBIT, 0, 1e6, MOUSE_SENSITIVITY).phi).toBe(
      PHI_LIMITS.min,
    )
    expect(orbit(INITIAL_ORBIT, 0, -1e6, MOUSE_SENSITIVITY).phi).toBe(
      PHI_LIMITS.max,
    )
  })

  it('keeps the distance and does not mutate the input', () => {
    const next = orbit(INITIAL_ORBIT, 30, 30, MOUSE_SENSITIVITY)
    expect(next.distance).toBe(5.2)
    expect(INITIAL_ORBIT.theta).toBe(0.3)
  })
})

describe('cameraPosition', () => {
  it('stays on a sphere of the given distance', () => {
    const { x, y, z } = cameraPosition({ distance: 5.2, theta: 1.1, phi: -0.4 })
    expect(Math.hypot(x, y, z)).toBeCloseTo(5.2)
  })

  it('looks straight at the spheres from the front when untilted', () => {
    const { x, y, z } = cameraPosition({ distance: 4, theta: 0, phi: 0 })
    expect([x, y, z]).toEqual([0, 0, 4])
  })
})
