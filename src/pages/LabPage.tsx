import { useTranslation } from 'react-i18next'
import { SimulatorGallery } from '@/features/gallery'
import { PageFooter } from '@/shared/components/PageFooter'
import { PageHeader } from '@/shared/components/PageHeader'
import type { SimulatorConfig } from '@/shared/types/simulator'

interface LabPageProps {
  simulators: SimulatorConfig[]
}

export function LabPage({ simulators }: LabPageProps) {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader
        title={t('lab.title')}
        highlight={t('lab.highlight')}
        description={t('lab.description')}
      />
      <main className="mx-auto w-full max-w-6xl flex-1">
        <SimulatorGallery simulators={simulators} />
      </main>
      <PageFooter icon="⊗">
        <strong>{t('lab.tipLabel')}</strong> {t('lab.tip')}
      </PageFooter>
    </>
  )
}
