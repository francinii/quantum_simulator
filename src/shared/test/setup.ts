import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'
import '@/app/i18n'

// Simulators render heavy KaTeX; the default 1 s wait for async UI is too tight under parallel workers.
configure({ asyncUtilTimeout: 5000 })

// jsdom has no canvas; returning null makes drawing code skip instead of logging "not implemented".
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never
