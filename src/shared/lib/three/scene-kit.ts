import * as THREE from 'three'

// Legacy pages used Three.js r128, which had no color management; matching it keeps the pastel palette.
export function createRenderer(container: HTMLElement) {
  THREE.ColorManagement.enabled = false

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  })
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)
  return renderer
}

// Intensities are scaled by π to match the pre-r155 lighting the pages were tuned for.
export function addLights(
  scene: THREE.Scene,
  ambient: number,
  directional: number,
  directionalPosition: [number, number, number],
) {
  scene.add(new THREE.AmbientLight(0xffffff, ambient * Math.PI))
  const light = new THREE.DirectionalLight(0xffffff, directional * Math.PI)
  light.position.set(...directionalPosition)
  scene.add(light)
}

export function createTextSprite(
  text: string,
  color: string,
  {
    canvasSize,
    fontSize,
    scale,
  }: { canvasSize: number; fontSize: number; scale: number },
) {
  const canvas = document.createElement('canvas')
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.font = `bold ${fontSize}px Inter, sans-serif`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvasSize / 2, canvasSize / 2)
  }
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
    }),
  )
  sprite.scale.set(scale, scale, 1)
  return sprite
}

export function createTranslucentSphere(
  geometry: THREE.SphereGeometry,
  color: string,
  opacity: number,
  shininess: number,
) {
  return new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity,
      shininess,
      depthWrite: false,
    }),
  )
}

// A flat ring lying in the horizontal plane, marking the equator.
export function createEquatorRing(
  innerRadius: number,
  outerRadius: number,
  segments: number,
  color: string,
  opacity: number,
) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(innerRadius, outerRadius, segments),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity,
    }),
  )
  ring.rotation.x = Math.PI / 2
  return ring
}

export function disposeScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh
    mesh.geometry?.dispose()
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]
    for (const material of materials) {
      if (!material) continue
      ;(material as THREE.SpriteMaterial).map?.dispose()
      material.dispose()
    }
  })
  renderer.dispose()
  renderer.domElement.remove()
}
