import type { SimulatorProps } from '@/shared/types/simulator'

export function MigrationPending({ simulator }: SimulatorProps) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1">
      <h1 className="text-ink my-3 text-2xl font-extrabold">
        {simulator.title}
      </h1>
      <p className="text-sm text-muted">
        This simulation is still being migrated. The original lives in{' '}
        <code className="font-code">legacy/</code>.
      </p>
    </main>
  )
}
