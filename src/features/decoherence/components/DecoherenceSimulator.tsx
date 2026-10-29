import { useEffect, useRef, useState } from 'react'
import { Formula } from '@/shared/components/Formula'
import { SimulatorFrame } from '@/shared/components/SimulatorFrame'
import { useAnimationFrame } from '@/shared/hooks/useAnimationFrame'
import { useGifExport } from '@/shared/hooks/useGifExport'
import { prefersReducedMotion } from '@/shared/lib/prefers-reduced-motion'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import type { BlochSceneApi } from '../lib/bloch-scene'
import { drawWavePlot, WAVE_SIZE } from '../lib/draw-wave'
import {
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  renderCycleFrames,
} from '../lib/export-frames'
import { DEFAULT_RATE, stateAt, type Mechanism } from '../lib/physics'
import { ControlsPanel } from './ControlsPanel'
import { EvolutionPanel } from './EvolutionPanel'
import { SpherePanel } from './SpherePanel'

const GIF_FILENAME = 'quantum_decoherence.gif'

export function DecoherenceSimulator() {
  const [mechanism, setMechanism] = useState<Mechanism>('dephasing')
  const [rate, setRate] = useState(DEFAULT_RATE)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [time, setTime] = useState(0)
  const [theme] = useState(readCanvasTheme)

  const sceneRef = useRef<BlochSceneApi | null>(null)
  const waveCanvas = useRef<HTMLCanvasElement>(null)

  useAnimationFrame(
    (deltaSeconds) => setTime((current) => current + deltaSeconds),
    playing,
  )

  const state = stateAt(time, mechanism, rate)

  // Poses the 3D scene and the wave plot whenever the moment or the physics changes.
  useEffect(() => {
    const scene = sceneRef.current
    scene?.update(state, time)
    scene?.render()

    const ctx = waveCanvas.current?.getContext('2d')
    if (ctx)
      drawWavePlot(
        ctx,
        theme,
        WAVE_SIZE.width,
        WAVE_SIZE.height,
        time,
        state.decay,
      )
  }, [state, time, theme])

  const restartCycle = () => setTime(0)

  const changeMechanism = (next: Mechanism) => {
    setMechanism(next)
    restartCycle()
  }

  const gifExport = useGifExport({
    renderFrames: () => {
      const scene = sceneRef.current
      if (!scene) throw new Error('The 3D view is not available.')
      try {
        return renderCycleFrames(theme, scene, mechanism, rate)
      } finally {
        // Frames pose the scene at other moments; put it back where the page is.
        scene.update(state, time)
        scene.render()
      }
    },
    width: GIF_SIZE,
    height: GIF_SIZE,
    frameSeconds: GIF_FRAME_SECONDS,
    filename: GIF_FILENAME,
  })

  const exportGif = async () => {
    setPlaying(false)
    const succeeded = await gifExport.start()
    if (succeeded) setPlaying(true)
  }

  return (
    <SimulatorFrame
      title="Visual Simulation of"
      highlight="Quantum Decoherence"
      description="Observe how interaction with the environment destroys quantum superposition, shrinking the pure state vector into a classical statistical mixture."
      footerIcon="Ψ"
      footerMessage={
        <>
          <strong>Phase Damping Model:</strong>{' '}
          <Formula
            tex={String.raw`\rho(t) = \frac{1}{2}\begin{bmatrix} 1 & e^{-t/T_2} \\ e^{-t/T_2} & 1 \end{bmatrix}`}
          />{' '}
          &bull; The vector shrinks toward the classical center.
        </>
      }
    >
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <SpherePanel sceneRef={sceneRef} theme={theme} state={state} />
        <div className="flex flex-col gap-4 lg:col-span-5">
          <EvolutionPanel canvasRef={waveCanvas} />
          <ControlsPanel
            mechanism={mechanism}
            rate={rate}
            playing={playing}
            exportStatus={gifExport.status}
            onMechanismChange={changeMechanism}
            onRateChange={setRate}
            onTogglePlay={() => setPlaying((value) => !value)}
            onReset={restartCycle}
            onExport={exportGif}
          />
        </div>
      </div>
    </SimulatorFrame>
  )
}
