import { useTranslation } from 'react-i18next'

type Translate = (key: string, options: { ns: string }) => string

// Simulator ids are dynamic (the gallery knows none by name), so their namespaces cannot be typed
// statically. Each feature owns a namespace named after its id with title, description and category.
export function useSimulatorText(id: string) {
  const { t } = useTranslation()
  const translate = t as unknown as Translate
  return {
    title: translate('title', { ns: id }),
    description: translate('description', { ns: id }),
    category: translate('category', { ns: id }),
  }
}
