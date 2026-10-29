import * as THREE from 'three'
import type { OrbitSceneApi } from '@/shared/components/OrbitSceneView'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { orbit as orbitBy } from '@/shared/lib/three/orbit'
import {
  addLights,
  createEquatorRing,
  createRenderer,
  createTextSprite,
  createTranslucentSphere,
  disposeScene,
} from '@/shared/lib/three/scene-kit'
import type { BlochArrow } from './cycle'

const SPHERE_RADIUS = 0.9
const SPHERE_X = 1.35
const FOV = 40
const ARROW_SHAFT = 0.85
const ARROW_HEAD = 0.15

export interface OrbitCoords {
  distance: number
  theta: number
  phi: number
}

export const INITIAL_ORBIT: OrbitCoords = {
  distance: 5.2,
  theta: 0.3,
  phi: 0.4,
}
// The camera tilts only a little above or below the spheres' equator.
export const PHI_LIMITS = { min: -0.6, max: 0.6 }

export const orbit = (
  coords: OrbitCoords,
  dx: number,
  dy: number,
  sensitivity: number,
): OrbitCoords => orbitBy(coords, dx, dy, sensitivity, PHI_LIMITS)

export function cameraPosition({ distance, theta, phi }: OrbitCoords) {
  return {
    x: distance * Math.sin(theta) * Math.cos(phi),
    y: distance * Math.sin(phi),
    z: distance * Math.cos(theta) * Math.cos(phi),
  }
}

export interface BellSceneApi extends OrbitSceneApi {
  canvas: HTMLCanvasElement
  // Poses both spheres for a point of the cycle; does not draw.
  update(arrows: [BlochArrow, BlochArrow], rotation: number): void
}

function createArrow(color: string, headColor: string) {
  const group = new THREE.Group()
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, ARROW_SHAFT, 16),
    new THREE.MeshPhongMaterial({ color, shininess: 90 }),
  )
  shaft.position.y = ARROW_SHAFT / 2
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, ARROW_HEAD, 16),
    new THREE.MeshPhongMaterial({ color: headColor, shininess: 90 }),
  )
  head.position.y = ARROW_SHAFT
  group.add(shaft, head)
  return group
}

// Throws when WebGL is unavailable; callers show a fallback message instead.
export function createBellScene(
  container: HTMLElement,
  theme: CanvasTheme,
): BellSceneApi {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(theme.preview)

  const camera = new THREE.PerspectiveCamera(
    FOV,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  )
  let coords = INITIAL_ORBIT
  const placeCamera = () => {
    const { x, y, z } = cameraPosition(coords)
    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  }
  placeCamera()

  const renderer = createRenderer(container)
  addLights(scene, 0.9, 0.6, [4, 8, 6])

  const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 32)
  const labelStyle = { canvasSize: 64, fontSize: 36, scale: 0.35 }

  function createQubit(
    x: number,
    bodyColor: string,
    arrowColor: string,
    labelColor: string,
    name: string,
  ) {
    const sphere = createTranslucentSphere(geometry, bodyColor, 0.28, 80)
    sphere.position.x = x
    sphere.add(createEquatorRing(0.89, 0.91, 48, theme.purple, 0.4))

    const arrow = createArrow(arrowColor, arrowColor)
    sphere.add(arrow)

    for (const [text, y] of [
      ['|0⟩', 1.15],
      ['|1⟩', -1.15],
      [name, -1.5],
    ] as const) {
      const label = createTextSprite(text, labelColor, labelStyle)
      label.position.set(0, y, 0)
      sphere.add(label)
    }
    scene.add(sphere)
    return { sphere, arrow }
  }

  const qubits = [
    createQubit(-SPHERE_X, theme.sphereSky, theme.sky, theme.skyDeep, 'Q0'),
    createQubit(
      SPHERE_X,
      theme.pinkPastel,
      theme.pinkStrong,
      theme.pinkDeep,
      'Q1',
    ),
  ]

  const up = new THREE.Vector3(0, 1, 0)

  return {
    canvas: renderer.domElement,

    update(arrows, rotation) {
      qubits.forEach(({ sphere, arrow }, index) => {
        const { direction, length } = arrows[index]
        arrow.scale.set(1, length, 1)
        arrow.quaternion.setFromUnitVectors(
          up,
          new THREE.Vector3(...direction).normalize(),
        )
        sphere.rotation.y = rotation
      })
    },

    render() {
      renderer.render(scene, camera)
    },

    orbit(dx, dy, sensitivity) {
      coords = orbit(coords, dx, dy, sensitivity)
      placeCamera()
    },

    resize() {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    },

    dispose() {
      disposeScene(scene, renderer)
    },
  }
}
