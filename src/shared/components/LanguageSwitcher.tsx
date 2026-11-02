import { useTranslation } from 'react-i18next'
import { LOCALES, setLocale, type Locale } from '@/shared/i18n/create-i18n'

// Each language is named in itself so a visitor can always find theirs.
const NAMES: Record<Locale, string> = { en: 'English', es: 'Español' }

interface LanguageSwitcherProps {
  /** Icon-only rail on desktop: the options collapse into one cycling button. */
  collapsed: boolean
}

export function LanguageSwitcher({ collapsed }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'en') as Locale
  const next = LOCALES[(LOCALES.indexOf(current) + 1) % LOCALES.length]

  return (
    <>
      <div
        role="radiogroup"
        aria-label={t('language.label')}
        className={`bg-neutral flex rounded-lg p-0.5 ${collapsed ? 'lg:hidden' : ''}`}
      >
        {LOCALES.map((locale) => {
          const selected = locale === current
          return (
            <button
              key={locale}
              type="button"
              role="radio"
              lang={locale}
              aria-checked={selected}
              onClick={() => void setLocale(locale)}
              className={`flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                selected
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {NAMES[locale]}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => void setLocale(next)}
        aria-label={t('language.switch', {
          current: NAMES[current],
          next: NAMES[next],
        })}
        title={t('language.current', { current: NAMES[current] })}
        className={`text-muted hover:bg-blue-wash-hover hidden w-full items-center justify-center rounded-lg py-2 text-xs font-bold uppercase transition-colors ${
          collapsed ? 'lg:flex' : ''
        }`}
      >
        {current}
      </button>
    </>
  )
}
