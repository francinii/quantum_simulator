import type { InterferenceKind } from './physics'

interface TypeStyle {
  text: string
  badge: string
}

export const TYPE_STYLES: Record<InterferenceKind, TypeStyle> = {
  none: {
    text: 'text-slate-500',
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
  },
  'fully-constructive': {
    text: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  'fully-destructive': {
    text: 'text-brand-pink',
    badge: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  'mostly-constructive': {
    text: 'text-brand-blue',
    badge: 'bg-blue-50 text-brand-blue border-blue-200',
  },
  'mostly-destructive': {
    text: 'text-brand-purple',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}
