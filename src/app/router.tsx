import {
  createBrowserRouter,
  createMemoryRouter,
  type RouteObject,
} from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import type { SimulatorConfig } from '@/shared/types/simulator'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SimulatorPage } from '@/pages/SimulatorPage'

function buildRoutes(simulators: SimulatorConfig[]): RouteObject[] {
  return [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage simulators={simulators} /> },
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
