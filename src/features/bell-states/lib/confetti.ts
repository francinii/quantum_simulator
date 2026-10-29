import confetti from 'canvas-confetti'

// A small burst for each measurement; the library skips it when the user prefers reduced motion.
export function celebrateMeasurement(colors: string[]) {
  void confetti({
    particleCount: 28,
    spread: 45,
    origin: { y: 0.8 },
    colors,
    disableForReducedMotion: true,
  })
}
