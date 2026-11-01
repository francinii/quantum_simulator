import { Link } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'

interface ComingSoonPageProps {
  title: string
  highlight: string
  description: string
}

export function ComingSoonPage({
  title,
  highlight,
  description,
}: ComingSoonPageProps) {
  return (
    <>
      <PageHeader
        title={title}
        highlight={highlight}
        description={description}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 text-center">
        <h2 className="text-ink mb-2 text-xl font-extrabold">Coming soon</h2>
        <Link
          to="/lab"
          className="text-brand-blue hover:text-brand-purple text-xs font-bold transition-colors"
        >
          Explore the lab in the meantime →
        </Link>
      </main>
    </>
  )
}
