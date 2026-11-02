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
          element: <ComingSoonPage section="articles" />,
        },
        {
          path: '/learn',
          element: <ComingSoonPage section="learn" />,
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
