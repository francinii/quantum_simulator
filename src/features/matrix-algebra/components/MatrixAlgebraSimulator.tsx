import { useEffect, useState } from 'react'
import { Formula } from '@/shared/components/Formula'
import { SimulatorFrame } from '@/shared/components/SimulatorFrame'
import { useGifExport } from '@/shared/hooks/useGifExport'
import { prefersReducedMotion } from '@/shared/lib/prefers-reduced-motion'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import {
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  renderStepFrames,
} from '../lib/export-frames'
import { nextStep, previousStep, STEP_DURATION_MS, STEPS } from '../lib/steps'
import { CircuitPanel } from './CircuitPanel'
import { DiracPanel } from './DiracPanel'
import { MatrixPanel } from './MatrixPanel'
import { StepProbabilities } from './StepProbabilities'
import { StepSelector } from './StepSelector'

const GIF_FILENAME = 'hadamard_matrix_vs_dirac.gif'

export function MatrixAlgebraSimulator() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [speed, setSpeed] = useState(1)
  const [theme] = useState(readCanvasTheme)

  // One timer per step: moving by hand restarts the wait, so the new step is never cut short.
  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(
      () => setStep((current) => nextStep(current)),
      STEP_DURATION_MS / speed,
    )
    return () => clearTimeout(timer)
  }, [playing, step, speed])

  const gifExport = useGifExport({
    renderFrames: () => renderStepFrames(theme),
    width: GIF_SIZE,
    height: GIF_SIZE,
    frameSeconds: GIF_FRAME_SECONDS,
    filename: GIF_FILENAME,
  })

  const exportGif = () => {
    setPlaying(false)
    void gifExport.start()
  }

  const { visibleBoxes } = STEPS[step]

  return (
    <SimulatorFrame
      title="Hadamard Application:"
      highlight="Matrix Algebra vs. Dirac Notation"
      description={
        <>
          Learn how quantum math operates under the hood: explore step by step
          the Kronecker product (<Formula tex={String.raw`\otimes`} />
          ), the operator product <Formula tex={String.raw`H \otimes H`} />, and
          its equivalence in bra-ket notation.
        </>
      }
      footerIcon="⊗"
      footerMessage={
        <>
          <strong>Pedagogical Takeaway:</strong> Matrix algebra is ideal for
          numerical computer simulations; Dirac notation is superior for human
          symbolic calculation.
        </>
      }
    >
      <StepSelector step={step} onSelect={setStep} />

      <CircuitPanel
        step={step}
        playing={playing}
        speed={speed}
        onTogglePlay={() => setPlaying((value) => !value)}
        onPrevious={() => setStep(previousStep(step))}
        onNext={() => setStep(nextStep(step))}
        onReset={() => setStep(0)}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <MatrixPanel visibleBoxes={visibleBoxes} />
        <DiracPanel visibleBoxes={visibleBoxes} />
      </div>

      <StepProbabilities
        step={step}
        exportStatus={gifExport.status}
        onExport={exportGif}
      />
    </SimulatorFrame>
  )
}
