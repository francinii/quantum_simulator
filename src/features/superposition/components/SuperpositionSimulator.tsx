import { useCallback, useEffect, useRef, useState } from 'react'
import { Formula } from '@/shared/components/Formula'
import { SimulatorFrame } from '@/shared/components/SimulatorFrame'
import { useAnimationFrame } from '@/shared/hooks/useAnimationFrame'
import { useGifExport } from '@/shared/hooks/useGifExport'
import {
  outcomeProbabilities,
  sampleOutcome,
  type Outcome,
} from '@/shared/lib/quantum/bloch'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { drawBloch } from '../lib/draw-bloch'
import {
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  renderSweepFrames,
} from '../lib/export-frames'
import { findActivePreset, INITIAL_PRESET, PRESETS } from '../lib/presets'
import { addShots, EMPTY_STATS } from '../lib/shot-stats'
import { BlochPanel } from './BlochPanel'
import { ExplanationSteps } from './ExplanationSteps'
import { MeasurementLab } from './MeasurementLab'
import { PresetSelector } from './PresetSelector'
import { ProbabilityPanel } from './ProbabilityPanel'
import { StatePanel } from './StatePanel'

const SWEEP_DEGREES_PER_SECOND = 45
const COLLAPSE_VISIBLE_MS = 1400
const GIF_FILENAME = 'quantum_superposition_qff2026.gif'

export function SuperpositionSimulator() {
  const [theta, setTheta] = useState(PRESETS[INITIAL_PRESET].theta)
  const [phi, setPhi] = useState(PRESETS[INITIAL_PRESET].phi)
  const [animating, setAnimating] = useState(false)
  const [collapsedTo, setCollapsedTo] = useState<Outcome | null>(null)
  const [stats, setStats] = useState(EMPTY_STATS)
  const [theme] = useState(readCanvasTheme)

  const canvas = useRef<HTMLCanvasElement>(null)
  const sweepDirection = useRef(1)
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const clearCollapse = useCallback(() => {
    clearTimeout(collapseTimer.current)
    setCollapsedTo(null)
  }, [])

  useEffect(() => () => clearTimeout(collapseTimer.current), [])

  // While the vector sits at a pole after a measurement, draw it there instead of at θ.
  const shownTheta = collapsedTo === null ? theta : collapsedTo === 0 ? 0 : 180

  useEffect(() => {
    const element = canvas.current
    const ctx = element?.getContext('2d')
    if (!element || !ctx) return
    ctx.clearRect(0, 0, element.width, element.height)
    drawBloch(ctx, theme, 210, 215, 150, shownTheta, phi, collapsedTo)
  }, [theme, shownTheta, phi, collapsedTo])

  useAnimationFrame((deltaSeconds) => {
    let next =
      theta + sweepDirection.current * deltaSeconds * SWEEP_DEGREES_PER_SECOND
    if (next >= 180) {
      next = 180
      sweepDirection.current = -1
    }
    if (next <= 0) {
      next = 0
      sweepDirection.current = 1
    }
    setTheta(next)
  }, animating)

  // Changing the state makes earlier statistics meaningless, so they are cleared with it.
  const setState = (nextTheta: number, nextPhi: number) => {
    setTheta(nextTheta)
    setPhi(nextPhi)
    clearCollapse()
    setStats(EMPTY_STATS)
  }

  const stopAnimating = () => {
    if (!animating) return
    setAnimating(false)
    setTheta(Math.round(theta))
  }

  const toggleAnimate = () => {
    if (animating) {
      stopAnimating()
      return
    }
    clearCollapse()
    setStats(EMPTY_STATS)
    setAnimating(true)
  }

  const applyPreset = (index: number) => {
    stopAnimating()
    setState(PRESETS[index].theta, PRESETS[index].phi)
  }

  const changeTheta = (value: number) => {
    stopAnimating()
    setState(value, phi)
  }

  const changePhi = (value: number) => {
    stopAnimating()
    setState(theta, value)
  }

  const settledTheta = animating ? Math.round(theta) : theta

  const measureOnce = () => {
    stopAnimating()
    const [p0] = outcomeProbabilities(settledTheta)
    const outcome = sampleOutcome(p0)
    setStats((current) => addShots(current, [outcome]))
    setCollapsedTo(outcome)
    clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(
      () => setCollapsedTo(null),
      COLLAPSE_VISIBLE_MS,
    )
  }

  const measureMany = (shots: number) => {
    stopAnimating()
    clearCollapse()
    const [p0] = outcomeProbabilities(settledTheta)
    const outcomes = Array.from({ length: shots }, () => sampleOutcome(p0))
    setStats((current) => addShots(current, outcomes))
  }

  const gifExport = useGifExport({
    renderFrames: () => renderSweepFrames(theme, phi),
    width: GIF_SIZE,
    height: GIF_SIZE,
    frameSeconds: GIF_FRAME_SECONDS,
    filename: GIF_FILENAME,
  })

  const exportGif = () => {
    stopAnimating()
    clearCollapse()
    void gifExport.start()
  }

  const probabilities = outcomeProbabilities(theta)

  return (
    <SimulatorFrame
      title="Quantum Superposition:"
      highlight="Amplitudes & Probabilities"
      description={
        <>
          A qubit can be a blend of <Formula tex="|0\rangle" /> and{' '}
          <Formula tex="|1\rangle" /> at the same time. Move the state on the
          Bloch sphere, see how its amplitudes become probabilities, and then
          measure it many times to watch those probabilities emerge.
        </>
      }
      footerIcon="ψ"
      footerMessage={
        <>
          <strong>Pedagogical Takeaway:</strong> Superposition is described by
          amplitudes; probabilities only appear when we measure, as their
          squared magnitudes.
        </>
      }
    >
      <PresetSelector
        activeIndex={findActivePreset(theta, phi)}
        onSelect={applyPreset}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <BlochPanel
          canvasRef={canvas}
          theta={theta}
          phi={phi}
          animating={animating}
          collapsedTo={collapsedTo}
          onToggleAnimate={toggleAnimate}
          onThetaChange={changeTheta}
          onPhiChange={changePhi}
        />
        <div className="flex flex-col gap-4 lg:col-span-7">
          <StatePanel theta={theta} phi={phi} />
          <ProbabilityPanel theta={theta} animating={animating} />
        </div>
      </div>

      <MeasurementLab
        stats={stats}
        probabilities={probabilities}
        animating={animating}
        exportStatus={gifExport.status}
        onMeasureOnce={measureOnce}
        onMeasureMany={measureMany}
        onReset={() => setStats(EMPTY_STATS)}
        onExport={exportGif}
      />

      <ExplanationSteps />
    </SimulatorFrame>
  )
}
