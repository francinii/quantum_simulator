export type NavIconName = 'home' | 'flask' | 'article' | 'book'

export interface NavItem {
  label: string
  to: string
  icon: NavIconName
  /** Route prefixes that keep this entry highlighted (nested pages). */
  activePrefixes: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/', icon: 'home', activePrefixes: [] },
  { label: 'Lab', to: '/lab', icon: 'flask', activePrefixes: ['/simulators'] },
  {
    label: 'Articles Explained Visually',
    to: '/articles',
    icon: 'article',
    activePrefixes: [],
  },
  { label: 'Learn', to: '/learn', icon: 'book', activePrefixes: [] },
]

const startsWithSegment = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.to === '/') return pathname === '/'
  return [item.to, ...item.activePrefixes].some((prefix) =>
    startsWithSegment(pathname, prefix),
  )
}
