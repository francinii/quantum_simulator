import * as THREE from 'three'
import type { OrbitSceneApi } from '@/shared/components/OrbitSceneView'
import {
  addLights,
  createEquatorRing,
  createRenderer,
  createTextSprite,
  createTranslucentSphere,
  disposeScene,
} from '@/shared/lib/three/scene-kit'
import type { CanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { arrowGeometry } from './arrow-geometry'
import {
  cameraPosition,
  INITIAL_ORBIT,
  orbit as orbitCoords,
  type OrbitCoords,
} from './camera'
import type { DecoherenceState } from './physics'

const SPHERE_RADIUS = 1.2
const ROTATION_RATE = 0.15
const FOV = 40
const AXIS_REACH = 1.4

export interface BlochSceneApi extends OrbitSceneApi {
  canvas: HTMLCanvasElement
  // Poses the sphere and the arrow for a moment in the cycle; does not draw.
  update(state: DecoherenceState, timeSeconds: number): void
}

function axisLine(
  from: THREE.Vector3,
  to: THREE.Vector3,
  material: THREE.LineBasicMaterial,
) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([from, to]),
    material,
  )
}

// Throws when WebGL is unavailable; callers show a fallback message instead.
export function createBlochScene(
  container: HTMLElement,
  theme: CanvasTheme,
): BlochSceneApi {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(theme.surface)

  const camera = new THREE.PerspectiveCamera(
    FOV,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  )
  let coords: OrbitCoords = INITIAL_ORBIT
  const placeCamera = () => {
    const { x, y, z } = cameraPosition(coords)
    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  }
  placeCamera()

  const renderer = createRenderer(container)
  addLights(scene, 0.85, 0.6, [5, 10, 7])

  const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 40, 40)
  const sphere = createTranslucentSphere(
    sphereGeometry,
    theme.sphereBody,
    0.22,
    90,
  )
  scene.add(sphere)
  scene.add(
    new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({
        color: theme.blue,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      }),
    ),
  )

  const equator = createEquatorRing(1.19, 1.21, 64, theme.purple, 0.45)
  scene.add(equator)

  const axisMaterial = new THREE.LineBasicMaterial({
    color: theme.axisCool,
    transparent: true,
    opacity: 0.8,
  })
  const reach = AXIS_REACH
  scene.add(
    axisLine(
      new THREE.Vector3(-reach, 0, 0),
      new THREE.Vector3(reach, 0, 0),
      axisMaterial,
    ),
  )
  scene.add(
    axisLine(
      new THREE.Vector3(0, -reach, 0),
      new THREE.Vector3(0, reach, 0),
      axisMaterial,
    ),
  )
  scene.add(
    axisLine(
      new THREE.Vector3(0, 0, -reach),
      new THREE.Vector3(0, 0, reach),
      axisMaterial,
    ),
  )

  const labelStyle = { canvasSize: 128, fontSize: 54, scale: 0.4 }
  for (const [label, color, position] of [
    ['|0⟩', theme.inkDeep, new THREE.Vector3(0, 1.55, 0)],
    ['|1⟩', theme.inkDeep, new THREE.Vector3(0, -1.55, 0)],
    ['|+⟩', theme.blue, new THREE.Vector3(1.5, 0, 0)],
  ] as const) {
    const sprite = createTextSprite(label, color, labelStyle)
    sprite.position.copy(position)
    scene.add(sprite)
  }

  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: theme.muted }),
    ),
  )

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 1, 16),
    new THREE.MeshPhongMaterial({ color: theme.pink, shininess: 80 }),
  )
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.065, 0.16, 16),
    new THREE.MeshPhongMaterial({ color: theme.pinkVivid }),
  )
  scene.add(shaft)
  scene.add(head)

  const up = new THREE.Vector3(0, 1, 0)

  return {
    canvas: renderer.domElement,

    update(state, timeSeconds) {
      sphere.rotation.y = timeSeconds * ROTATION_RATE
      equator.rotation.z = timeSeconds * ROTATION_RATE

      const arrow = arrowGeometry(state.x, state.y, state.z)
      shaft.visible = arrow.visible
      head.visible = arrow.visible
      if (!arrow.visible) return

      const direction = new THREE.Vector3(
        arrow.direction.x,
        arrow.direction.y,
        arrow.direction.z,
      )
      shaft.position.set(
        arrow.shaftCenter.x,
        arrow.shaftCenter.y,
        arrow.shaftCenter.z,
      )
      shaft.scale.set(1, arrow.shaftLength, 1)
      shaft.quaternion.setFromUnitVectors(up, direction)
      head.position.set(
        arrow.headCenter.x,
        arrow.headCenter.y,
        arrow.headCenter.z,
      )
      head.quaternion.setFromUnitVectors(up, direction)
    },

    render() {
      renderer.render(scene, camera)
    },

    orbit(dx, dy, sensitivity) {
      coords = orbitCoords(coords, dx, dy, sensitivity)
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
