interface PageHeaderProps {
  title: string
  highlight: string
  description: string
  size?: 'home' | 'simulator'
}

const SIZES = {
  home: {
    header: 'mt-4 mb-8',
    badge: 'mb-3',
    title: 'text-3xl md:text-5xl',
    description: 'mt-3 max-w-2xl text-sm md:text-base',
  },
  simulator: {
    header: 'mb-4',
    badge: 'mb-2',
    title: 'text-2xl md:text-4xl',
    description: 'mt-1 max-w-3xl text-xs md:text-sm',
  },
}

export function PageHeader({
  title,
  highlight,
  description,
  size = 'home',
}: PageHeaderProps) {
  const classes = SIZES[size]

  return (
    <header
      className={`mx-auto w-full max-w-6xl text-center ${classes.header}`}
    >
      <div
        className={`border-brand-pink-soft/40 bg-pink-wash text-brand-pink inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase ${classes.badge}`}
      >
        <span className="bg-brand-pink h-2 w-2 animate-ping rounded-full motion-reduce:animate-none" />
        Quantum Pedagogy &bull; Qiskit Fall Fest 2026
      </div>
      <h1 className={`text-ink font-extrabold tracking-tight ${classes.title}`}>
        {title}{' '}
        <span className="from-brand-blue via-brand-purple to-brand-pink bg-linear-to-r bg-clip-text text-transparent">
          {highlight}
        </span>
      </h1>
      <p className={`mx-auto text-slate-500 ${classes.description}`}>
        {description}
      </p>
    </header>
  )
}
