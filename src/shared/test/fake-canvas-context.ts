// Records fillText and clearRect calls and swallows every other canvas call, since jsdom has no real canvas.
export function makeFakeContext() {
  const fillText = vi.fn()
  const clearRect = vi.fn()
  const noop = vi.fn()
  const gradient = { addColorStop: vi.fn() }
  const overrides: Record<string, unknown> = {
    fillText,
    clearRect,
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
  }
  const ctx = new Proxy(overrides, {
    get: (target, key: string) => (key in target ? target[key] : noop),
    set: () => true,
  }) as unknown as CanvasRenderingContext2D

  return { ctx, fillText, clearRect }
}
