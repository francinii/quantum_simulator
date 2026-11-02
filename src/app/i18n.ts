import type { Resource } from 'i18next'
import { createI18n, LOCALES } from '@/shared/i18n/create-i18n'
import { en as shellEn } from '@/shared/i18n/en'
import { es as shellEs } from '@/shared/i18n/es'

type Messages = Record<string, unknown>

// Each feature owns `i18n/en.ts` and `i18n/es.ts`; its folder name is its namespace.
const featureModules = import.meta.glob<Record<string, Messages>>(
  '../features/*/i18n/*.ts',
  { eager: true },
)

export function collectResources(
  modules: Record<string, Record<string, Messages>>,
): Resource {
  const resources: Resource = {
    en: { shell: shellEn },
    es: { shell: shellEs },
  }
  for (const [path, module] of Object.entries(modules)) {
    const match = path.match(/features\/([^/]+)\/i18n\/(\w+)\.ts$/)
    if (!match) continue
    const [, namespace, locale] = match
    if (!(LOCALES as readonly string[]).includes(locale)) continue
    resources[locale][namespace] = module[locale]
  }
  return resources
}

export const resources = collectResources(featureModules)
export const i18n = createI18n(resources)
