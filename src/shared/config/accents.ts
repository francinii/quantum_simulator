import type { Accent } from '@/shared/types/simulator'

interface AccentClasses {
  label: string
  chip: string
  cta: string
}

export const ACCENTS: Record<Accent, AccentClasses> = {
  blue: {
    label: 'text-brand-blue',
    chip: 'bg-blue-wash text-brand-sky',
    cta: 'text-brand-blue',
  },
  purple: {
    label: 'text-brand-purple',
    chip: 'bg-purple-wash text-brand-purple',
    cta: 'text-brand-purple',
  },
  pink: {
    label: 'text-brand-pink',
    chip: 'bg-pink-wash text-pink-strong',
    cta: 'text-brand-pink',
  },
  emerald: {
    label: 'text-emerald-deep',
    chip: 'bg-emerald-wash text-emerald-ink',
    cta: 'text-emerald-deep',
  },
  sky: {
    label: 'text-brand-sky',
    chip: 'bg-blue-wash text-brand-sky',
    cta: 'text-brand-sky',
  },
}
