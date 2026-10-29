import { MOUSE_SENSITIVITY } from '@/shared/lib/three/orbit'
import {
  cameraPosition,
  INITIAL_ORBIT,
  MAX_PHI,
  MIN_PHI,
  orbit,
} from './camera'

describe('orbit with this scene limits', () => {
  it('turns the camera around the sphere without clamping the azimuth', () => {
    const right = orbit(INITIAL_ORBIT, 100, 0, MOUSE_SENSITIVITY)
    expect(right.theta).toBeCloseTo(INITIAL_ORBIT.theta - 1)
    expect(right.phi).toBe(INITIAL_ORBIT.phi)
    expect(orbit(INITIAL_ORBIT, 1e5, 0, MOUSE_SENSITIVITY).theta).toBeLessThan(
      -100,
    )
  })

  it('clamps the polar angle so the camera never reaches the poles', () => {
    expect(orbit(INITIAL_ORBIT, 0, 1e6, MOUSE_SENSITIVITY).phi).toBe(MIN_PHI)
    expect(orbit(INITIAL_ORBIT, 0, -1e6, MOUSE_SENSITIVITY).phi).toBe(MAX_PHI)
  })

  it('keeps the radius and does not mutate the input', () => {
    const next = orbit(INITIAL_ORBIT, 30, 30, MOUSE_SENSITIVITY)
    expect(next.radius).toBe(3.5)
    expect(INITIAL_ORBIT.theta).toBe(Math.PI / 4)
  })
})

describe('cameraPosition', () => {
  it('stays on a sphere of the given radius', () => {
    const { x, y, z } = cameraPosition(
      orbit(INITIAL_ORBIT, 37, -12, MOUSE_SENSITIVITY),
    )
    expect(Math.hypot(x, y, z)).toBeCloseTo(3.5)
  })

  it('looks from above at the pole and from the side at the equator', () => {
    const top = cameraPosition({ radius: 2, theta: 0, phi: 0 })
    expect(top.y).toBeCloseTo(2)
    expect(top.x).toBeCloseTo(0)
    const side = cameraPosition({ radius: 2, theta: 0, phi: Math.PI / 2 })
    expect(side.x).toBeCloseTo(2)
    expect(side.y).toBeCloseTo(0)
  })
})
