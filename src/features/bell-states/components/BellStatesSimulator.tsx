import { useEffect, useRef, useState } from 'react'
import { Formula } from '@/shared/components/Formula'
import { SimulatorFrame } from '@/shared/components/SimulatorFrame'
import { useAnimationFrame } from '@/shared/hooks/useAnimationFrame'
import { useGifExport } from '@/shared/hooks/useGifExport'
import { prefersReducedMotion } from '@/shared/lib/prefers-reduced-motion'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { BELL_STATES, type BellKey, type Outcome } from '../lib/bell-states'
import type { BellSceneApi } from '../lib/bell-scene'
import { celebrateMeasurement } from '../lib/confetti'
import {
  advance,
  blochArrows,
  currentStep,
  sphereRotation,
  stepForward,
} from '../lib/cycle'
import {
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  gifFilename,
  renderCycleFrames,
} from '../lib/export-frames'
import { measureOutcome } from '../lib/measurement'
import { CircuitPanel } from './CircuitPanel'
import { ExportPanel } from './ExportPanel'
import { LiveMathPanel } from './LiveMathPanel'
import { ShotsPanel } from './ShotsPanel'
import { SpheresPanel } from './SpheresPanel'
import { StateCards } from './StateCards'

const TOAST_MS = 2500

export function BellStatesSimulator() {
  const [key, setKey] = useState<BellKey>('phi_plus')
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [speed, setSpeed] = useState(1)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [theme] = useState(readCanvasTheme)

  const sceneRef = useRef<BellSceneApi | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const state = BELL_STATES[key]
  const step = currentStep(state, progress)

  useAnimationFrame(
    (deltaSeconds) =>
      setProgress((current) => advance(current, deltaSeconds, speed)),
    playing,
  )

  useEffect(() => {
    const scene = sceneRef.current
    scene?.update(blochArrows(state, progress), sphereRotation(progress))
    scene?.render()
  }, [state, progress])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const selectState = (next: BellKey) => {
    setKey(next)
    setProgress(0)
  }

  const step1 = () => {
    setPlaying(false)
    setProgress((current) => stepForward(current))
  }

  const measure = () => {
    setOutcome(measureOutcome(state.finalProbabilities))
    celebrateMeasurement([theme.blue, theme.pinkSoft, theme.purple])
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setOutcome(null), TOAST_MS)
  }

  const gifExport = useGifExport({
    renderFrames: () => {
      const scene = sceneRef.current
      if (!scene) throw new Error('The 3D view is not available.')
      try {
        return renderCycleFrames(theme, scene, state)
      } finally {
        // Frames pose the spheres at other moments; put them back where the page is.
        scene.update(blochArrows(state, progress), sphereRotation(progress))
        scene.render()
      }
    },
    width: GIF_SIZE,
    height: GIF_SIZE,
    frameSeconds: GIF_FRAME_SECONDS,
    filename: gifFilename(state),
  })

  const exportGif = async () => {
    setPlaying(false)
    const succeeded = await gifExport.start()
    if (succeeded) setPlaying(true)
  }

  return (
    <SimulatorFrame
      title="The 4 Bell States:"
      highlight="Quantum Entanglement in Action"
      description={
        <>
          Visualize in real time the wavepacket propagation through{' '}
          <span className="text-brand-pink font-bold">X</span>,{' '}
          <span className="text-brand-blue font-bold">Hadamard (H)</span>, and{' '}
          <span className="text-brand-blue font-bold">CNOT</span> gates,
          observing the creation of non-local correlations.
        </>
      }
      footerIcon="Ψ"
      footerMessage={
        <>
          <strong>Fundamental Property:</strong> The Bell states form a complete
          orthonormal basis of the 2-qubit Hilbert space{' '}
          <Formula tex={String.raw`\mathbb{C}^4`} />.
        </>
      }
    >
      <StateCards selected={key} onSelect={selectState} />

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <CircuitPanel
            state={state}
            progress={progress}
            playing={playing}
            speed={speed}
            onTogglePlay={() => setPlaying((value) => !value)}
            onReset={() => setProgress(0)}
            onStep={step1}
            onSpeedChange={setSpeed}
          />
          <LiveMathPanel step={step} />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <SpheresPanel sceneRef={sceneRef} theme={theme} progress={progress} />
          <ShotsPanel
            probabilities={step.probabilities}
            outcome={outcome}
            animateBars={!playing}
            onMeasure={measure}
          />
          <ExportPanel
            state={state}
            status={gifExport.status}
            onExport={exportGif}
          />
        </div>
      </div>
    </SimulatorFrame>
  )
}
