import { SimulatorGallery } from '@/features/gallery'
import { PageFooter } from '@/shared/components/PageFooter'
import { PageHeader } from '@/shared/components/PageHeader'
import type { SimulatorConfig } from '@/shared/types/simulator'

interface LabPageProps {
  simulators: SimulatorConfig[]
}

export function LabPage({ simulators }: LabPageProps) {
  return (
    <>
      <PageHeader
        title="Quantum Lab:"
        highlight="Interactive Simulations"
        description="A collection of animated, step-by-step visualizations to explore the core ideas of quantum computing. Each simulation can export a looping GIF for your class slides."
      />
      <main className="mx-auto w-full max-w-6xl flex-1">
        <SimulatorGallery simulators={simulators} />
      </main>
      <PageFooter icon="⊗">
        <strong>Tip:</strong> Every simulation includes playback controls and a
        GIF exporter ready for presentations.
      </PageFooter>
    </>
  )
}
