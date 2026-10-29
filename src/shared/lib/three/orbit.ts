export const MOUSE_SENSITIVITY = 0.01
export const TOUCH_SENSITIVITY = 0.015
// One arrow-key press turns the camera like a 10 px mouse drag.
export const KEY_DRAG_PIXELS = 10

export interface AngleLimits {
  min: number
  max: number
}

// Dragging right turns the camera one way (theta); dragging down tilts it (phi), kept inside the limits.
export function orbit<T extends { theta: number; phi: number }>(
  coords: T,
  dx: number,
  dy: number,
  sensitivity: number,
  phiLimits: AngleLimits,
): T {
  return {
    ...coords,
    theta: coords.theta - dx * sensitivity,
    phi: Math.max(
      phiLimits.min,
      Math.min(phiLimits.max, coords.phi - dy * sensitivity),
    ),
  }
}

const KEY_DRAGS: Record<string, [number, number]> = {
  ArrowLeft: [-KEY_DRAG_PIXELS, 0],
  ArrowRight: [KEY_DRAG_PIXELS, 0],
  ArrowUp: [0, -KEY_DRAG_PIXELS],
  ArrowDown: [0, KEY_DRAG_PIXELS],
}

// The drag an arrow key stands for, or null for any other key.
export const keyToDrag = (key: string): [dx: number, dy: number] | null =>
  KEY_DRAGS[key] ?? null
