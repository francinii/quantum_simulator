import i18next from 'i18next'
import { LOCALE_STORAGE_KEY, setLocale } from '@/shared/i18n/create-i18n'
import { collectResources, resources } from './i18n'

type Tree = Record<string, unknown>

function leaves(tree: Tree, prefix = ''): [string, unknown][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    value !== null && typeof value === 'object'
      ? leaves(value as Tree, `${prefix}${key}.`)
      : [[`${prefix}${key}`, value] as [string, unknown]],
  )
}

afterEach(async () => {
  localStorage.clear()
  await i18next.changeLanguage('en')
  vi.restoreAllMocks()
})

describe('catalogs', () => {
  const en = resources.en as Record<string, Tree>
  const es = resources.es as Record<string, Tree>

  it('has the same namespaces in both languages', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort())
  })

  it('has a namespace for the shell, the gallery and every simulator', () => {
    expect(Object.keys(en)).toEqual(
      expect.arrayContaining([
        'shell',
        'gallery',
        'matrix-algebra',
        'bell-states',
        'decoherence',
        'interference',
        'superposition',
        'qubit-measurement',
      ]),
    )
  })

  it.each(Object.keys(en))('%s: es has the same keys as en', (namespace) => {
    const keys = (tree: Tree) =>
      leaves(tree)
        .map(([key]) => key)
        .sort()
    expect(keys(es[namespace])).toEqual(keys(en[namespace]))
  })

  it.each(Object.keys(en))('%s: no empty values', (namespace) => {
    for (const locale of [en, es]) {
      for (const [key, value] of leaves(locale[namespace])) {
        expect(value, key).toEqual(expect.stringMatching(/\S/))
      }
    }
  })

  it('keeps math and gate notation identical in both languages', () => {
    const notation = /H ⊗ H|[|⟨]\S*[⟩]/g
    for (const namespace of Object.keys(en)) {
      const spanish = Object.fromEntries(leaves(es[namespace]))
      for (const [key, value] of leaves(en[namespace])) {
        for (const token of String(value).match(notation) ?? []) {
          expect(spanish[key], `${namespace}.${key}`).toContain(token)
        }
      }
    }
  })

  it('collects feature catalogs by folder name', () => {
    const collected = collectResources({
      '../features/demo/i18n/en.ts': { en: { title: 'Demo' } },
      '../features/demo/i18n/es.ts': { es: { title: 'Demostración' } },
    })
    expect((collected.es as Tree).demo).toEqual({ title: 'Demostración' })
  })
})

describe('language selection', () => {
  const detect = () => {
    const found = i18next.services.languageDetector.detect()
    return Array.isArray(found) ? found[0] : found
  }

  it('prefers the stored choice, then the browser language, then English', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-MX', 'en'])
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('es-MX')
    expect(detect()).toBe('es-MX')

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(detect()).toBe('en')

    localStorage.clear()
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-FR'])
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    await i18next.changeLanguage(detect())
    expect(i18next.resolvedLanguage).toBe('en')
  })

  it('resolves regional Spanish to es', async () => {
    await i18next.changeLanguage('es-MX')
    expect(i18next.resolvedLanguage).toBe('es')
  })

  it('switches text and <html lang> instantly and persists the choice', async () => {
    await setLocale('es')
    expect(i18next.t('nav.lab')).toBe('Laboratorio')
    expect(document.documentElement.lang).toBe('es')
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es')
  })

  it('does not persist a choice when only detecting', () => {
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull()
  })

  it('interpolates values', async () => {
    await setLocale('es')
    expect(i18next.t('simulation', { ns: 'gallery', number: '03' })).toBe(
      'Simulación 03',
    )
  })

  it('falls back to English for a key missing in Spanish', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    i18next.addResource('en', 'shell', 'onlyEnglish', 'English only')
    await setLocale('es')
    expect(i18next.t('onlyEnglish' as 'nav.lab')).toBe('English only')
  })
})
