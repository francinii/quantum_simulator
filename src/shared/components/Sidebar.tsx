import { Link, useLocation } from 'react-router-dom'
import { isNavItemActive, NAV_ITEMS } from '@/shared/config/navigation'
import { NavIcon } from './NavIcon'
import { ThemeSwitcher } from './ThemeSwitcher'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  /** Mobile drawer state; desktop ignores it. */
  open: boolean
  onClose: () => void
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  open,
  onClose,
}: SidebarProps) {
  const { pathname } = useLocation()
  const labelClass = collapsed ? 'lg:sr-only' : ''

  return (
    <>
      {open && (
        <div
          data-testid="sidebar-backdrop"
          className="bg-night/60 fixed inset-0 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        id="main-sidebar"
        className={`border-line bg-surface flex-col border-r lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0 ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        } ${
          open
            ? 'fixed inset-y-0 left-0 z-40 flex w-64 max-w-[85vw]'
            : 'max-lg:hidden'
        }`}
      >
        <div className="flex items-center justify-between gap-2 p-4">
          <Link
            to="/"
            onClick={onClose}
            className={`text-ink hover:text-brand-purple text-lg font-extrabold tracking-tight transition-colors ${labelClass}`}
          >
            Quantum Lab
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-muted hover:text-ink rounded p-1 lg:hidden"
          >
            ✕
          </button>
        </div>
        <nav aria-label="Main" className="flex-1 px-2">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item, pathname)
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-blue-wash text-brand-blue'
                        : 'text-body hover:bg-blue-wash-hover'
                    } ${collapsed ? 'lg:justify-center' : ''}`}
                  >
                    <NavIcon name={item.icon} />
                    <span className={labelClass}>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-line border-t p-2">
          <ThemeSwitcher collapsed={collapsed} />
        </div>
        <div className="border-line hidden border-t p-2 lg:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="main-sidebar"
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
            className="text-muted hover:bg-blue-wash-hover flex w-full items-center justify-center rounded-lg py-2 text-sm font-semibold transition-colors"
          >
            {collapsed ? '»' : '« Collapse'}
          </button>
        </div>
      </aside>
    </>
  )
}
