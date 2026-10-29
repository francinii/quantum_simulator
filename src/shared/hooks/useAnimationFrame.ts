import { useEffect, useRef } from 'react'

export function useAnimationFrame(
  onFrame: (deltaSeconds: number) => void,
  active = true,
) {
  const callback = useRef(onFrame)

  useEffect(() => {
    callback.current = onFrame
  })

  useEffect(() => {
    if (!active) return
    let handle = 0
    let last: number | null = null

    const tick = (timestamp: number) => {
      callback.current(last === null ? 0 : (timestamp - last) / 1000)
      last = timestamp
      handle = requestAnimationFrame(tick)
    }

    handle = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(handle)
  }, [active])
}
