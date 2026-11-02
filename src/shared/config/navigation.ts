export type NavIconName = 'home' | 'flask' | 'article' | 'book'

export type NavLabelKey = 'nav.home' | 'nav.lab' | 'nav.articles' | 'nav.learn'

export interface NavItem {
  labelKey: NavLabelKey
  to: string
  icon: NavIconName
  /** Route prefixes that keep this entry highlighted (nested pages). */
  activePrefixes: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', to: '/', icon: 'home', activePrefixes: [] },
  {
    labelKey: 'nav.lab',
    to: '/lab',
    icon: 'flask',
    activePrefixes: ['/simulators'],
  },
  {
    labelKey: 'nav.articles',
    to: '/articles',
    icon: 'article',
    activePrefixes: [],
  },
  { labelKey: 'nav.learn', to: '/learn', icon: 'book', activePrefixes: [] },
]

const startsWithSegment = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.to === '/') return pathname === '/'
  return [item.to, ...item.activePrefixes].some((prefix) =>
    startsWithSegment(pathname, prefix),
  )
}
