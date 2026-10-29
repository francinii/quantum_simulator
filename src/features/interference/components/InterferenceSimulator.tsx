import { useCallback, useEffect, useRef, useState } from 'react'
import { SimulatorFrame } from '@/shared/components/SimulatorFrame'
import { useAnimationFrame } from '@/shared/hooks/useAnimationFrame'
import { useGifExport } from '@/shared/hooks/useGifExport'
import { prefersReducedMotion } from '@/shared/lib/prefers-reduced-motion'
import { readCanvasTheme } from '@/shared/lib/theme/canvas-theme'
import { drawPhasors } from '../lib/draw-phasors'
import { drawWaves } from '../lib/draw-waves'
import {
  GIF_FRAME_SECONDS,
  GIF_SIZE,
  renderSweepFrames,
} from '../lib/export-frames'
import {
  classifyInterference,
  relativeIntensity,
  resultantAmplitude,
} from '../lib/physics'
import { findActivePreset, PRESETS } from '../lib/presets'
import { ControlsPanel } from './ControlsPanel'
import { ExplanationCards } from './ExplanationCards'
import { PhasorPanel } from './PhasorPanel'
import { PresetSelector } from './PresetSelector'
import { ResultPanel } from './ResultPanel'
import { WavePanel } from './WavePanel'

// Converts elapsed seconds into wave phase advance, tuned to look like the legacy page.
const TIME_SCALE = 2.2
const GIF_FILENAME = 'wave_interference_qff2026.gif'

export function InterferenceSimulator() {
  const [phase, setPhase] = useState(0)
  const [ampA, setAmpA] = useState(1)
  const [ampB, setAmpB] = useState(1)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [speed, setSpeed] = useState(1)
  const [theme] = useState(readCanvasTheme)

  const waveCanvas = useRef<HTMLCanvasElement>(null)
  const phasorCanvas = useRef<HTMLCanvasElement>(null)
  const time = useRef(0)

  const draw = useCallback(() => {
    const wave = waveCanvas.current
    const waveCtx = wave?.getContext('2d')
    if (wave && waveCtx) {
      waveCtx.clearRect(0, 0, wave.width, wave.height)
      drawWaves(
        waveCtx,
        theme,
        40,
        10,
        wave.width - 80,
        wave.height - 20,
        ampA,
        ampB,
        phase,
        time.current,
      )
    }

    const phasor = phasorCanvas.current
    const phasorCtx = phasor?.getContext('2d')
    if (phasor && phasorCtx) {
      phasorCtx.clearRect(0, 0, phasor.width, phasor.height)
      drawPhasors(
        phasorCtx,
        theme,
        phasor.width / 2,
        phasor.height / 2,
        52,
        ampA,
        ampB,
        phase,
        time.current,
      )
    }
  }, [theme, ampA, ampB, phase])

  useAnimationFrame((deltaSeconds) => {
    time.current += deltaSeconds * TIME_SCALE * speed
    draw()
  }, playing)

  // Redraws on any control change, which is what updates the canvases while paused.
  useEffect(draw, [draw])

  const applyPreset = (index: number) => {
    const preset = PRESETS[index]
    setPhase(preset.phase)
    setAmpA(preset.a)
    setAmpB(preset.b)
  }

  const gifExport = useGifExport({
    renderFrames: () => renderSweepFrames(theme, ampA, ampB),
    width: GIF_SIZE,
    height: GIF_SIZE,
    frameSeconds: GIF_FRAME_SECONDS,
    filename: GIF_FILENAME,
  })

  const info = classifyInterference(ampA, ampB, phase)

  return (
    <SimulatorFrame
      title="Wave Interference:"
      highlight="Constructive vs. Destructive"
      description="When two waves meet, they add point by point. Change the phase shift between them and watch how they reinforce each other or cancel out — the same mechanism quantum algorithms use to amplify correct answers."
      footerIcon="∿"
      footerMessage={
        <>
          <strong>Pedagogical Takeaway:</strong> Phase decides everything: the
          same two waves can double each other or disappear completely.
        </>
      }
    >
      <PresetSelector
        activeIndex={findActivePreset(phase, ampA, ampB)}
        onSelect={applyPreset}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <WavePanel
          canvasRef={waveCanvas}
          info={info}
          playing={playing}
          onTogglePlay={() => setPlaying((value) => !value)}
          speed={speed}
          onSpeedChange={setSpeed}
        />
        <div className="flex flex-col gap-4 lg:col-span-4">
          <ControlsPanel
            phase={phase}
            ampA={ampA}
            ampB={ampB}
            onPhaseChange={setPhase}
            onAmpAChange={setAmpA}
            onAmpBChange={setAmpB}
          />
          <PhasorPanel canvasRef={phasorCanvas} />
        </div>
      </div>

      <ResultPanel
        amplitude={resultantAmplitude(ampA, ampB, phase)}
        maxAmplitude={ampA + ampB}
        intensity={relativeIntensity(ampA, ampB, phase)}
        info={info}
        exportStatus={gifExport.status}
        onExport={gifExport.start}
      />

      <ExplanationCards />
    </SimulatorFrame>
  )
}
