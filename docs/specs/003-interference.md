# Interference

Status: implemented
Legacy: legacy/interferencia_constructiva_y_destructiva.html (migrated)

## Goal

Let a student change the phase and amplitudes of two waves and see them reinforce or cancel, bridging to amplitude interference in quantum algorithms.

## Behavior

- Page: back link, header, scenario presets, main panels, footer takeaway ("Phase decides everything…").
- Presets: Constructive (Δφ 0°), Partial (90°), Destructive (180°), Unequal Amplitudes (A 1.0, B 0.5, 180°). The active preset is highlighted; moving any slider clears the highlight.
- Controls: phase 0-360° (step 1), amplitude A and B 0-1 (step 0.05), play/pause, speed 0.25x-2x. The speed readout shows the exact value (0.25x); legacy rounded it to one decimal (0.3x), which was wrong. The speed slider is hidden below the `sm` breakpoint, as in legacy.
- Wave canvas: three animated rows (A, B shifted by Δφ, and A + B), two wavelengths visible.
- Phasor canvas: arrows A, B and their sum R.
- Readouts: resultant R = √(A² + B² + 2AB·cos Δφ), max possible (A + B), relative intensity R²/(A+B)² as bar and percent, interference type with hint.
- Type by cos Δφ: none if A or B is 0; fully constructive > 0.97; fully destructive < -0.97 (hint differs if A = B); otherwise mostly constructive (> 0) or mostly destructive.
- Three explanation cards with formulas (constructive, destructive, quantum connection).
- Export GIF (540x540): 36 frames sweeping Δφ from 0° to 360°, looping, with status text while it works.

## Technical decisions

- Waves and phasors are drawn on `<canvas>` (not SVG); one drawing function serves both the screen and the GIF frames so they match.
- Formulas render with KaTeX, installed from npm (legacy used MathJax from a CDN).
- GIF encoding uses `gifshot` 0.4.5 from npm (legacy used 0.3.2 from a CDN), wrapped in `shared/lib/export` so the other simulators reuse it.
- Canvas colors and fonts are read from the CSS design tokens at runtime (`shared/lib/theme`), so the canvas has no hardcoded colors either.
- Physics (`resultantAmplitude`, type classifier) is pure TypeScript in the feature `lib/`, framework-free and unit tested.

## Shared foundation this adds

- `SimulatorFrame` gives every simulator the same header (smaller `PageHeader` size), main area and footer (`PageFooter` size, icon and message per page). The back link "← All simulations" lives in `SimulatorPage`. Simulators receive their own config as a prop.
- Reusable pieces added to `shared`: `Slider`, `PlayPauseButton`, `ExportGifButton`, `Formula` (KaTeX), `useAnimationFrame`, `prefersReducedMotion`, canvas theme, and the GIF encoder/downloader.

## Out of scope

- Other waveforms, more than two waves, audio.
- Sharing state through the URL.
- High-DPI canvas scaling: canvases keep the legacy fixed resolution (900x560 and 320x240) and scale with CSS.

## Acceptance criteria

- [x] `resultantAmplitude` and the type classifier are unit tested: Δφ 0° gives A + B, 180° gives |A - B|, 90° gives √(A² + B²), thresholds at ±0.97, A or B = 0.
- [x] Each preset sets phase and amplitudes as listed and highlights itself; sliders clear it.
- [x] Readouts and type badge update as controls change.
- [x] Play/pause and speed control the animation; pausing freezes both canvases.
- [x] Wave and phasor canvases scale with their container keeping their aspect ratio, from phone width to desktop.
- [x] Exported GIF has 36 looping frames covering 0° to 360° and the button is disabled while exporting.
- [x] All sliders and buttons are keyboard operable with visible labels.
- [x] Side by side with the legacy page, layout, colors, texts and formulas match.
- [x] Reduced motion starts the animation paused.

## Open questions

None.
