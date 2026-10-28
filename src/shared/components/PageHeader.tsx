interface PageHeaderProps {
  title: string
  highlight: string
  description: string
}

export function PageHeader({ title, highlight, description }: PageHeaderProps) {
  return (
    <header className="mx-auto mt-4 mb-8 w-full max-w-6xl text-center">
      <div className="border-brand-pink-soft/40 bg-pink-wash text-brand-pink mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
        <span className="bg-brand-pink h-2 w-2 animate-ping rounded-full motion-reduce:animate-none" />
        Quantum Pedagogy &bull; Qiskit Fall Fest 2026
      </div>
      <h1 className="text-ink text-3xl font-extrabold tracking-tight md:text-5xl">
        {title}{' '}
        <span className="from-brand-blue via-brand-purple to-brand-pink bg-linear-to-r bg-clip-text text-transparent">
          {highlight}
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
        {description}
      </p>
    </header>
  )
}
