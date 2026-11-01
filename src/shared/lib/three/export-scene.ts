// GIF export is always light, but the on-screen scene may be dark. Frames come from a short-lived
// scene built off-screen at the live scene's size, so the visible one is never touched.
export function withExportScene<T extends { dispose(): void }, R>(
  like: HTMLElement,
  create: (container: HTMLElement) => T,
  run: (scene: T) => R,
): R {
  const host = document.createElement('div')
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${like.clientWidth}px;height:${like.clientHeight}px`
  document.body.appendChild(host)
  const scene = create(host)
  try {
    return run(scene)
  } finally {
    scene.dispose()
    host.remove()
  }
}
