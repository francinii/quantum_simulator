import { useEffect, useRef, useState } from 'react'
import { Card } from '@/shared/components/Card'
import { ExportBar } from '@/shared/components/ExportBar'
import { SimulatorFrame } from '@/shared/components/SimulatorFrame'
import { useAnimationFrame } from '@/shared/hooks/useAnimationFrame'
import { useGifExport } from '@/shared/hooks/useGifExport'
import { prefersReducedMotion } from '@/shared/lib/prefers-reduced-motion'
import { sampleShot } from '@/shared/lib/quantum/measurement'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { useCanvasTheme } from '@/shared/hooks/useCanvasTheme'
import { drawMeasurementBloch } from '../lib/draw-bloch'
import {
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  renderMeasurementFrames,
} from '../lib/export-frames'
import {
  IDLE_MESSAGE,
  instantShotsMessage,
  lastShotMessage,
} from '../lib/last-shot'
import {
  advanceShot,
  describeShot,
  IDLE_BEFORE_NEXT_SHOT,
  startShot,
  type Shot,
} from '../lib/shot-machine'
import {
  BASES,
  EXPERIMENTS,
  findActiveExperiment,
  initialSetup,
  outcomeKey,
  outcomeKeys,
  preparedVector,
  type Setup,
} from '../lib/setup'
import { BlochPanel } from './BlochPanel'
import { CircuitPanel, MANY_SHOTS } from './CircuitPanel'
import { ExperimentSelector } from './ExperimentSelector'
import { OutcomeHistogram } from './OutcomeHistogram'
import { QiskitCodePanel } from './QiskitCodePanel'
import { RuleCards } from './RuleCards'
import { SetupPanel } from './SetupPanel'
import { TheoryPanel } from './TheoryPanel'

const MAX_FRAME_SECONDS = 0.1
const GIF_FILENAME = 'qubit_measurement.gif'

const emptyCounts = (setup: Setup) =>
  Object.fromEntries(outcomeKeys(setup).map((key) => [key, 0]))

interface Simulation {
  shot: Shot | null
  // Time spent waiting before auto-run starts the next shot.
  idle: number
}

const IDLE: Simulation = { shot: null, idle: 0 }

export function QubitMeasurementSimulator() {
  const [setup, setSetup] = useState(initialSetup)
  const [autoRunning, setAutoRunning] = useState(() => !prefersReducedMotion())
  const [speed, setSpeed] = useState(1)
  const [simulation, setSimulation] = useState<Simulation>(IDLE)
  const [counts, setCounts] = useState(() => emptyCounts(initialSetup()))
  const [lastShot, setLastShot] = useState(IDLE_MESSAGE)
  const theme = useCanvasTheme()
  const canvas = useRef<HTMLCanvasElement>(null)

  const view = describeShot(simulation.shot, setup, autoRunning)

  useEffect(() => {
    const element = canvas.current
    const ctx = element?.getContext('2d')
    if (!element || !ctx) return
    ctx.clearRect(0, 0, element.width, element.height)
    drawMeasurementBloch(
      ctx,
      theme,
      210,
      205,
      140,
      view.vector,
      view.basis,
      view.highlight,
    )
  }, [theme, view.vector, view.basis, view.highlight])

  const record = (shot: Shot) => {
    const key = outcomeKey(setup, shot.first, shot.second)
    setCounts((current) => ({ ...current, [key]: (current[key] ?? 0) + 1 }))
    setLastShot(lastShotMessage(setup, shot.first, shot.second))
  }

  useAnimationFrame(
    (deltaSeconds) => {
      const dt = Math.min(MAX_FRAME_SECONDS, deltaSeconds) * speed
      if (simulation.shot) {
        const { shot, finished } = advanceShot(simulation.shot, dt, setup)
        if (finished) record(simulation.shot)
        setSimulation({ shot, idle: 0 })
      } else if (autoRunning) {
        const idle = simulation.idle + dt
        setSimulation(
          idle > IDLE_BEFORE_NEXT_SHOT
            ? { shot: startShot(setup), idle: 0 }
            : { shot: null, idle },
        )
      }
    },
    autoRunning || simulation.shot !== null,
  )

  // Any change to the experiment makes earlier results meaningless.
  const changeSetup = (patch: Partial<Setup>) => {
    const next = { ...setup, ...patch }
    setSetup(next)
    setSimulation(IDLE)
    setCounts(emptyCounts(next))
    setLastShot(IDLE_MESSAGE)
  }

  const applyExperiment = (index: number) =>
    changeSetup(EXPERIMENTS[index].setup)

  const runOneShot = () => {
    if (!simulation.shot) setSimulation({ shot: startShot(setup), idle: 0 })
  }

  const runManyShots = () => {
    const state = preparedVector(setup)
    const axis = BASES[setup.m1].axis
    const secondAxis = setup.m2 ? BASES[setup.m2].axis : null
    const added: Record<string, number> = {}
    for (let i = 0; i < MANY_SHOTS; i++) {
      const { first, second } = sampleShot(state, axis, secondAxis)
      const key = outcomeKey(setup, first, second)
      added[key] = (added[key] ?? 0) + 1
    }
    setSimulation(IDLE)
    setCounts((current) =>
      Object.fromEntries(
        outcomeKeys(setup).map((key) => [
          key,
          (current[key] ?? 0) + (added[key] ?? 0),
        ]),
      ),
    )
    setLastShot(instantShotsMessage(MANY_SHOTS))
  }

  const resetCounts = () => {
    setCounts(emptyCounts(setup))
    setLastShot(IDLE_MESSAGE)
  }

  const gifExport = useGifExport({
    renderFrames: () =>
      renderMeasurementFrames(readCanvasTheme('light'), setup),
    width: GIF_SIZE,
    height: GIF_SIZE,
    frameSeconds: GIF_FRAME_SECONDS,
    filename: GIF_FILENAME,
  })

  const exportGif = () => {
    setAutoRunning(false)
    setSimulation(IDLE)
    void gifExport.start()
  }

  return (
    <SimulatorFrame
      title="Qubit Measurement:"
      highlight="Collapse, Bases & Statistics"
      description="Measuring a qubit forces it to pick an answer and changes its state. Choose what to prepare and in which basis to measure, then watch the Bloch vector collapse shot by shot while the counts build up just like in Qiskit."
      footerIcon="⏚"
      footerMessage={
        <>
          <strong>Pedagogical Takeaway:</strong> Measurement is not a passive
          look: it picks an answer at random, following Born&apos;s rule, and
          leaves the qubit in that answer.
        </>
      }
    >
      <ExperimentSelector
        activeIndex={findActiveExperiment(setup)}
        onSelect={applyExperiment}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SetupPanel setup={setup} onChange={changeSetup} />
        <CircuitPanel
          setup={setup}
          view={view}
          autoRunning={autoRunning}
          speed={speed}
          lastShot={lastShot}
          onToggleAutoRun={() => setAutoRunning((value) => !value)}
          onOneShot={runOneShot}
          onManyShots={runManyShots}
          onReset={resetCounts}
          onSpeedChange={setSpeed}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <BlochPanel canvasRef={canvas} caption={view.caption} />
        <OutcomeHistogram setup={setup} counts={counts} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <TheoryPanel setup={setup} />
        <QiskitCodePanel setup={setup} />
      </div>

      <Card className="p-4">
        <ExportBar
          standalone
          description="Want to include this explanation in your class slides? Generate a looping GIF of several shots collapsing the state and filling the histogram."
          buttonLabel="Export GIF for Slides (540x540)"
          capturingMessage="Simulating shots and capturing frames..."
          status={gifExport.status}
          onExport={exportGif}
        />
      </Card>

      <RuleCards />
    </SimulatorFrame>
  )
}
