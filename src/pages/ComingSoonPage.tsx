import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'

interface ComingSoonPageProps {
  section: 'articles' | 'learn'
}

export function ComingSoonPage({ section }: ComingSoonPageProps) {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader
        title={t(`${section}.title`)}
        highlight={t(`${section}.highlight`)}
        description={t(`${section}.description`)}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 text-center">
        <h2 className="text-ink mb-2 text-xl font-extrabold">
          {t('comingSoon.title')}
        </h2>
        <Link
          to="/lab"
          className="text-brand-blue hover:text-brand-purple text-xs font-bold transition-colors"
        >
          {t('comingSoon.explore')}
        </Link>
      </main>
    </>
  )
}
