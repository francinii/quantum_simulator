import { orbit as orbitBy } from '@/shared/lib/three/orbit'

export interface OrbitCoords {
  radius: number
  theta: number
  phi: number
}

export const INITIAL_ORBIT: OrbitCoords = {
  radius: 3.5,
  theta: Math.PI / 4,
  phi: Math.PI / 4,
}

// Keeps the camera off the poles so the view never flips.
export const MIN_PHI = 0.1
export const MAX_PHI = Math.PI - 0.1

export const orbit = (
  coords: OrbitCoords,
  dx: number,
  dy: number,
  sensitivity: number,
): OrbitCoords =>
  orbitBy(coords, dx, dy, sensitivity, { min: MIN_PHI, max: MAX_PHI })

// Polar coordinates: phi is measured from the vertical axis.
export function cameraPosition({ radius, theta, phi }: OrbitCoords) {
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  }
}
