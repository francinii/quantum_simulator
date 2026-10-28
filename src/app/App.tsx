import { RouterProvider } from 'react-router-dom'
import { createAppRouter } from './router'
import { SIMULATORS } from './simulators'

const router = createAppRouter(SIMULATORS)

export function App() {
  return <RouterProvider router={router} />
}
