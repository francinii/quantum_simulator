import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { LabPage } from '@/pages/LabPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SimulatorPage } from '@/pages/SimulatorPage'

function buildRoutes(simulators: SimulatorConfig[]): RouteObject[] {
  return [
    {
      element: <Layout />,
      children: [
        // Placeholder until the Home page exists (spec 010).
        { path: '/', element: <Navigate to="/lab" replace /> },
        { path: '/lab', element: <LabPage simulators={simulators} /> },
        {
          path: '/articles',
          element: (
            <ComingSoonPage
              title="Articles"
              highlight="Explained Visually"
              description="Research articles explained with visuals, searchable by topic, so you can understand them without reading the full paper."
            />
          ),
        },
        {
          path: '/learn',
          element: (
            <ComingSoonPage
              title="Learn"
              highlight="Quantum Computing"
              description="Structured, topic-based lessons from the fundamentals: qubits, measurement and more."
            />
          ),
        },
        {
          path: '/simulators/:id',
          element: <SimulatorPage simulators={simulators} />,
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]
}

export const createAppRouter = (simulators: SimulatorConfig[]) =>
  createBrowserRouter(buildRoutes(simulators), {
    basename: import.meta.env.BASE_URL,
  })

export const createTestRouter = (
  simulators: SimulatorConfig[],
  initialEntries: string[],
) => createMemoryRouter(buildRoutes(simulators), { initialEntries })
