import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/shared/components/ThemeProvider'
import { createAppRouter } from './router'
import { SIMULATORS } from './simulators'

const router = createAppRouter(SIMULATORS)

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
