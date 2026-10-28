interface PhotonProps {
  y: number
  className: string
}

export function Photon({ y, className }: PhotonProps) {
  return (
    <circle
      cx={45}
      cy={y}
      r={5}
      className={`animate-travel motion-reduce:animate-none ${className}`}
    />
  )
}
