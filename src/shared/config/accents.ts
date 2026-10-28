import type { Accent } from '@/shared/types/simulator'

interface AccentClasses {
  label: string
  chip: string
  cta: string
}

export const ACCENTS: Record<Accent, AccentClasses> = {
  blue: {
    label: 'text-brand-blue',
    chip: 'bg-blue-50 text-brand-sky',
    cta: 'text-brand-blue',
  },
  purple: {
    label: 'text-brand-purple',
    chip: 'bg-purple-50 text-brand-purple',
    cta: 'text-brand-purple',
  },
  pink: {
    label: 'text-brand-pink',
    chip: 'bg-pink-50 text-pink-600',
    cta: 'text-brand-pink',
  },
  emerald: {
    label: 'text-emerald-600',
    chip: 'bg-emerald-50 text-emerald-700',
    cta: 'text-emerald-600',
  },
  sky: {
    label: 'text-brand-sky',
    chip: 'bg-blue-50 text-brand-sky',
    cta: 'text-brand-sky',
  },
}
