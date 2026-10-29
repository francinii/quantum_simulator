// Exact value with a trailing zero dropped: 1 -> "1.0x", 0.25 -> "0.25x", 1.5 -> "1.5x".
export const formatSpeed = (speed: number) =>
  `${speed.toFixed(2).replace(/0$/, '')}x`
