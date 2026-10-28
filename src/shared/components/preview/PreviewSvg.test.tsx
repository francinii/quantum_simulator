import { render } from '@testing-library/react'
import { PreviewSvg } from './PreviewSvg'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as never
}

describe('PreviewSvg', () => {
  const pause = vi.fn()

  beforeEach(() => {
    pause.mockClear()
    SVGSVGElement.prototype.pauseAnimations = pause
  })

  it('pauses SMIL animations when the user prefers reduced motion', () => {
    mockReducedMotion(true)
    render(<PreviewSvg>{null}</PreviewSvg>)
    expect(pause).toHaveBeenCalledOnce()
  })

  it('leaves animations running otherwise', () => {
    mockReducedMotion(false)
    render(<PreviewSvg>{null}</PreviewSvg>)
    expect(pause).not.toHaveBeenCalled()
  })
})
