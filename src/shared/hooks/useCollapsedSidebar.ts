import { useState } from 'react'

const STORAGE_KEY = 'quantum-lab:sidebar-collapsed'

function read() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function useCollapsedSidebar() {
  const [collapsed, setCollapsed] = useState(read)

  const toggle = () =>
    setCollapsed((current) => {
      const next = !current
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        // Persistence is a convenience; the toggle still works without it.
      }
      return next
    })

  return { collapsed, toggle }
}
