export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface ArrowGeometry {
  visible: boolean
  // Shaft: centered halfway along the vector, as long as the vector minus the head.
  shaftCenter: Vec3
  shaftLength: number
  // Cone head: just inside the tip.
  headCenter: Vec3
  direction: Vec3
}

const MIN_VISIBLE_LENGTH = 0.04
const HEAD_LENGTH = 0.14
const HEAD_INSET = 0.08
const MIN_SHAFT = 0.01
const ZERO: Vec3 = { x: 0, y: 0, z: 0 }

// Physics axes are (x, y, z) with Z up; Three.js has Y up, so Z and Y swap places.
export function arrowGeometry(x: number, y: number, z: number): ArrowGeometry {
  const target: Vec3 = { x, y: z, z: y }
  const length = Math.hypot(target.x, target.y, target.z)

  if (length <= MIN_VISIBLE_LENGTH) {
    return {
      visible: false,
      shaftCenter: ZERO,
      shaftLength: 0,
      headCenter: ZERO,
      direction: ZERO,
    }
  }

  const direction = {
    x: target.x / length,
    y: target.y / length,
    z: target.z / length,
  }
  return {
    visible: true,
    shaftCenter: { x: target.x / 2, y: target.y / 2, z: target.z / 2 },
    shaftLength: Math.max(MIN_SHAFT, length - HEAD_LENGTH),
    headCenter: {
      x: target.x - direction.x * HEAD_INSET,
      y: target.y - direction.y * HEAD_INSET,
      z: target.z - direction.z * HEAD_INSET,
    },
    direction,
  }
}
