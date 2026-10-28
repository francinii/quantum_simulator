import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col justify-between p-3 md:p-6">
      <Outlet />
    </div>
  )
}
