import type { SimulatorConfig } from '@/shared/types/simulator'
import { SimulatorCard } from './SimulatorCard'

interface SimulatorGalleryProps {
  simulators: SimulatorConfig[]
}

export function SimulatorGallery({ simulators }: SimulatorGalleryProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {simulators.map((simulator, index) => (
        <li key={simulator.id} className="flex">
          <SimulatorCard simulator={simulator} position={index + 1} />
        </li>
      ))}
    </ul>
  )
}
