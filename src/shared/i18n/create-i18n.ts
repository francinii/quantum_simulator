import i18next, { type Resource } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'quantum-lab:locale'

export function createI18n(resources: Resource) {
  void i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      ns: Object.keys(resources.en),
      defaultNS: 'shell',
      fallbackLng: 'en',
      supportedLngs: [...LOCALES],
      load: 'languageOnly',
      initAsync: false,
      interpolation: { escapeValue: false },
      saveMissing: import.meta.env.DEV,
      missingKeyHandler: (_lngs, ns, key) =>
        console.warn(`[i18n] missing translation: ${ns}:${key}`),
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: LOCALE_STORAGE_KEY,
        // Only an explicit choice is stored (see setLocale); detection alone is not a choice.
        caches: [],
      },
    })

  const syncHtmlLang = () => {
    document.documentElement.lang = i18next.resolvedLanguage ?? 'en'
  }
  i18next.on('languageChanged', syncHtmlLang)
  syncHtmlLang()
  return i18next
}

export function setLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // The choice still applies for this visit without storage.
  }
  return i18next.changeLanguage(locale)
}
