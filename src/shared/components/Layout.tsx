import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useCollapsedSidebar } from '@/shared/hooks/useCollapsedSidebar'
import { HamburgerIcon } from './HamburgerIcon'
import { Sidebar } from './Sidebar'

export function Layout() {
  const { collapsed, toggle } = useCollapsedSidebar()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  const closeDrawer = () => {
    setDrawerOpen(false)
    menuButton.current?.focus()
  }

  useEffect(() => {
    if (!drawerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setDrawerOpen(false)
      menuButton.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  return (
    <div className="lg:flex">
      <div className="border-line bg-surface sticky top-0 z-20 flex items-center gap-3 border-b px-3 py-2 lg:hidden">
        <button
          ref={menuButton}
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="main-sidebar"
          className="text-ink hover:bg-blue-wash-hover rounded-lg p-2"
        >
          <HamburgerIcon />
        </button>
        <span className="text-ink font-extrabold tracking-tight">
          Quantum Lab
        </span>
      </div>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggle}
        open={drawerOpen}
        onClose={closeDrawer}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col justify-between p-3 md:p-6">
        <Outlet />
      </div>
    </div>
  )
}
