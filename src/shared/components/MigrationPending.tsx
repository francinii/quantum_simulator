export function MigrationPending() {
  return (
    <p className="text-sm text-slate-500">
      This simulation is still being migrated. The original lives in{' '}
      <code className="font-code">legacy/</code>.
    </p>
  )
}
