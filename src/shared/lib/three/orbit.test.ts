import {
  keyToDrag,
  KEY_DRAG_PIXELS,
  MOUSE_SENSITIVITY,
  orbit,
  TOUCH_SENSITIVITY,
} from './orbit'

const start = { theta: 1, phi: 0.5, distance: 5 }

describe('orbit', () => {
  it('turns theta opposite to the horizontal drag and tilts phi opposite to the vertical drag', () => {
    const next = orbit(start, 100, 20, MOUSE_SENSITIVITY, { min: -3, max: 3 })
    expect(next.theta).toBeCloseTo(0)
    expect(next.phi).toBeCloseTo(0.3)
  })

  it('clamps phi to the limits of each scene, but never theta', () => {
    expect(
      orbit(start, 0, 1e6, MOUSE_SENSITIVITY, { min: -0.6, max: 0.6 }).phi,
    ).toBe(-0.6)
    expect(
      orbit(start, 0, -1e6, MOUSE_SENSITIVITY, { min: -0.6, max: 0.6 }).phi,
    ).toBe(0.6)
    expect(
      orbit(start, 1e5, 0, MOUSE_SENSITIVITY, { min: 0, max: 1 }).theta,
    ).toBeLessThan(-100)
  })

  it('keeps every other field and does not mutate the input', () => {
    const next = orbit(start, 10, 10, MOUSE_SENSITIVITY, { min: 0, max: 1 })
    expect(next.distance).toBe(5)
    expect(start.theta).toBe(1)
  })

  it('a finger moves the camera farther than the mouse for the same drag', () => {
    expect(TOUCH_SENSITIVITY).toBeGreaterThan(MOUSE_SENSITIVITY)
  })
})

describe('keyToDrag', () => {
  it('maps the arrow keys to drags of 10 px in opposite directions', () => {
    expect(keyToDrag('ArrowLeft')).toEqual([-KEY_DRAG_PIXELS, 0])
    expect(keyToDrag('ArrowRight')).toEqual([KEY_DRAG_PIXELS, 0])
    expect(keyToDrag('ArrowUp')).toEqual([0, -KEY_DRAG_PIXELS])
    expect(keyToDrag('ArrowDown')).toEqual([0, KEY_DRAG_PIXELS])
  })

  it('ignores every other key', () => {
    for (const key of ['a', 'Enter', ' ', 'Tab'])
      expect(keyToDrag(key)).toBeNull()
  })
})
