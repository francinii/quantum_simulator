import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto w-full max-w-6xl flex-1">
      <h1 className="text-ink mb-2 text-2xl font-extrabold">
        {t('notFound.title')}
      </h1>
      <Link
        to="/lab"
        className="text-brand-blue hover:text-brand-purple text-xs font-bold transition-colors"
      >
        {t('backToLab')}
      </Link>
    </main>
  )
}
