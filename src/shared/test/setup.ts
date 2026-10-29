import '@testing-library/jest-dom/vitest'

// jsdom has no canvas; returning null makes drawing code skip instead of logging "not implemented".
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never
