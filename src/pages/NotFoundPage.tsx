import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1">
      <h1 className="text-ink mb-2 text-2xl font-extrabold">Page not found</h1>
      <Link
        to="/lab"
        className="text-brand-blue hover:text-brand-purple text-xs font-bold transition-colors"
      >
        ← All simulations
      </Link>
    </main>
  )
}
