import { useEffect, useRef, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/shared/lib/prefers-reduced-motion'

interface PreviewSvgProps {
  children: ReactNode
}

export function PreviewSvg({ children }: PreviewSvgProps) {
  const ref = useRef<SVGSVGElement>(null)

  // SMIL animations ignore CSS media queries, so reduced motion must pause them explicitly.
  useEffect(() => {
    if (prefersReducedMotion()) ref.current?.pauseAnimations?.()
  }, [])

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 120"
      className="h-auto w-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}
