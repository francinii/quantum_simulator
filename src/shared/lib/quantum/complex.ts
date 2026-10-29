export interface Complex {
  re: number
  im: number
}

export const fromPolar = (magnitude: number, angleRad: number): Complex => ({
  re: magnitude * Math.cos(angleRad),
  im: magnitude * Math.sin(angleRad),
})

export const abs = ({ re, im }: Complex) => Math.hypot(re, im)
