import type { en as shell } from '@/shared/i18n/en'
import type { galleryMessagesEn as gallery } from '@/features/gallery'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'shell'
    resources: { shell: typeof shell; gallery: typeof gallery }
  }
}
