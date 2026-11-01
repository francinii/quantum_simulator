import type { ReactNode } from 'react'

interface CardProps {
  className?: string
  borderClass?: string
  backgroundClass?: string
  children: ReactNode
}

// The hover styles key off an ancestor with the `group` class, so a link wrapping the card drives them.
export function Card({
  className = '',
  borderClass = 'border-line',
  backgroundClass = 'bg-surface',
  children,
}: CardProps) {
  return (
    <div
      className={`rounded-3xl border shadow-xs transition-[transform,box-shadow,border-color] duration-250 ease-[ease] group-hover:border-brand-purple group-hover:-translate-y-1 group-hover:shadow-brand-blue/25 group-hover:shadow-[0_12px_28px_-8px] ${backgroundClass} ${borderClass} ${className}`}
    >
      {children}
    </div>
  )
}
