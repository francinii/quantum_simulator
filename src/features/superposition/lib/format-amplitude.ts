const NEGLIGIBLE_MAGNITUDE = 0.0005

export const formatAlpha = (alphaMagnitude: number) => alphaMagnitude.toFixed(3)

// Right angles read as clean real or imaginary numbers; any other phase is shown in polar form.
export function formatBeta(thetaDeg: number, phiDeg: number) {
  const magnitude = Math.sin((thetaDeg * Math.PI) / 360)
  const phase = ((Math.round(phiDeg) % 360) + 360) % 360
  const text = magnitude.toFixed(3)

  if (magnitude < NEGLIGIBLE_MAGNITUDE) return '0.000'
  if (phase === 0) return text
  if (phase === 180) return `(−${text})`
  if (phase === 90) return `${text}i`
  if (phase === 270) return `(−${text}i)`
  return `${text}·e^(i·${phase}°)`
}
