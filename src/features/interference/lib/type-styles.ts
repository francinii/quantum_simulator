import type { InterferenceKind } from './physics'

interface TypeStyle {
  text: string
  badge: string
}

export const TYPE_STYLES: Record<InterferenceKind, TypeStyle> = {
  none: {
    text: 'text-muted',
    badge: 'bg-neutral-soft text-muted border-edge',
  },
  'fully-constructive': {
    text: 'text-emerald-deep',
    badge: 'bg-emerald-wash text-emerald-ink border-emerald-edge',
  },
  'fully-destructive': {
    text: 'text-brand-pink',
    badge: 'bg-pink-wash text-pink-deep border-pink-pastel',
  },
  'mostly-constructive': {
    text: 'text-brand-blue',
    badge: 'bg-blue-wash text-brand-blue border-line-strong',
  },
  'mostly-destructive': {
    text: 'text-brand-purple',
    badge: 'bg-purple-wash text-purple-deep border-purple-edge',
  },
}
