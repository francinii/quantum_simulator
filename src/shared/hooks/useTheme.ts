import { useContext } from 'react'
import { ThemeContext } from '@/shared/lib/theme/theme-context'

export const useTheme = () => useContext(ThemeContext)
