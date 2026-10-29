import { arrowGeometry } from './arrow-geometry'

describe('arrowGeometry', () => {
  it('swaps physics Z and Y so that |0⟩ points up in the 3D scene', () => {
    const arrow = arrowGeometry(0, 0, 1)
    expect(arrow.direction).toEqual({ x: 0, y: 1, z: 0 })
    expect(arrow.visible).toBe(true)
  })

  it('maps physics Y to the scene depth axis', () => {
    expect(arrowGeometry(0, 1, 0).direction).toEqual({ x: 0, y: 0, z: 1 })
    expect(arrowGeometry(1, 0, 0).direction).toEqual({ x: 1, y: 0, z: 0 })
  })

  it('centers the shaft halfway and shortens it by the head', () => {
    const arrow = arrowGeometry(1, 0, 0)
    expect(arrow.shaftCenter).toEqual({ x: 0.5, y: 0, z: 0 })
    expect(arrow.shaftLength).toBeCloseTo(1 - 0.14)
  })

  it('puts the head just inside the tip', () => {
    const arrow = arrowGeometry(1.18, 0, 0)
    expect(arrow.headCenter.x).toBeCloseTo(1.18 - 0.08)
  })

  it('has a unit direction for any vector', () => {
    const { direction } = arrowGeometry(0.4, -0.7, 0.2)
    expect(Math.hypot(direction.x, direction.y, direction.z)).toBeCloseTo(1)
  })

  it('hides the arrow once the vector is nearly at the center', () => {
    expect(arrowGeometry(0.03, 0, 0).visible).toBe(false)
    expect(arrowGeometry(0.04, 0, 0).visible).toBe(false)
    expect(arrowGeometry(0.05, 0, 0).visible).toBe(true)
  })

  it('never lets the shaft collapse to zero or negative length', () => {
    expect(arrowGeometry(0.05, 0, 0).shaftLength).toBe(0.01)
  })
})
