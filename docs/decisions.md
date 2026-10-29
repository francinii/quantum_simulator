# Decisions

One line each: date · decision · reason.

2026-10-28 · Vite SPA over Next.js · no SEO or server needs; backend will be a separate service
2026-10-28 · Specs are one page max, what not how · keeps them readable and maintained
2026-10-28 · Unit tests next to code, E2E in `tests/` · colocation moves with the feature
2026-10-28 · Tailwind v4 via `@tailwindcss/vite`, no `tailwind.config.ts` · v4 is CSS-first, config file not needed
2026-10-28 · TypeScript pinned to ~6 · typescript-eslint does not support TS 7 yet; revisit when it does
2026-10-28 · jsdom pinned to ^26 · jsdom 30 needs Node >=22.22 and local Node is 22.14; unpin after upgrading Node
2026-10-28 · Simulators auto-discovered via `import.meta.glob` · adding one needs no router or gallery edits
2026-10-28 · Simulator order via `order` field in config · legacy order is pedagogical, not alphabetical
2026-10-28 · Each feature supplies its own `Preview` component · gallery stays generic, previews match legacy SVGs
2026-10-28 · Legacy look is the visual source of truth, standardized through shared tokens and components · decoherence page aligned to the others
2026-10-28 · Spec files numbered `NNN-name.md` in creation order, never renumbered · shows which came first
2026-10-28 · The spec is the source of truth and is always kept current · code and spec must not drift
2026-10-28 · Formulas via KaTeX (npm), not MathJax CDN · lighter, synchronous, bundled with the app
2026-10-28 · GIF export via `gifshot` (npm) in `shared/lib/export` · all simulators except one export GIFs
2026-10-28 · Wave drawings use canvas, shared by screen and GIF · guarantees the GIF matches what is shown
2026-10-28 · Canvas reads colors and fonts from the CSS tokens at runtime · one source of truth for the palette, no hex in TS
2026-10-28 · Simulator components receive their own config as a `simulator` prop · lets the migration placeholder show a title without extra wiring
2026-10-28 · Speed readout shows exact value (0.25x) · legacy rounded 0.25 to 0.3x, which was misleading
2026-10-28 · Simulator components load lazily; config, metadata and `Preview` stay eager · home bundle stays light as simulators and their libraries grow
2026-10-28 · A load boundary shows a reload prompt when a chunk fails · static hosting can remove old chunks after a redeploy
2026-10-28 · Anything used by two or more simulators moves to `shared` at its second use · `PresetButton`, `PanelHeader`, `ExportBar` and `useGifExport` extracted from interference before superposition needed them
2026-10-28 · No CSS transition on bars driven every frame (superposition under Animate θ) · React commits before paint, so each transition restarts at zero progress and the bar freezes
2026-10-28 · This is a lab, not an event: no event branding anywhere (badge, footer, GIF text, file names) · it belonged to the legacy pages; "Qiskit" stays only as educational content in qubit-measurement
2026-10-28 · Bell entanglement entropy is 0 until entangled, then 1 · legacy ramped it to 0.84 qubits while labeling the state "Separable"
2026-10-28 · Bloch sphere body, equator, projection and state arrow live in `shared/lib/canvas` (second use) · superposition refactored onto them, verified pixel-identical against the previous commit
2026-10-28 · Tailwind v4 needs `md:leading-4` where v3's `md:text-xs` also set the line height · otherwise multi-line `leading-relaxed` text grows taller than in legacy
2026-10-28 · Linear algebra for gates lives in `shared/lib/quantum` on real matrices (kron, matMul, H, X, CNOT) · Bell states reuse it; complex entries are added when a gate needs them
2026-10-28 · Circuit drawing has one implementation per simulator that serves both the on-screen SVG geometry and the GIF canvas · every GIF frame shows its own step, fixing the legacy frozen circuit
2026-10-28 · Three.js comes from npm and stays in lazy simulator chunks; build warning limit raised to 700 kB · the home bundle stays ~325 kB while the 3D simulators ship ~540 kB only when opened
2026-10-28 · The 3D scene is isolated behind a small API (`createBlochScene`) and everything else is pure or mockable · jsdom has no WebGL, so scene math (camera, arrow) is tested as plain functions and the rendering is verified in a real browser
2026-10-28 · Three.js color management is disabled and light intensities scaled by π · it reproduces the look of r128, the version the legacy pages were tuned for
2026-10-28 · Bell step vectors and probabilities are computed by the shared simulator, not typed in · tests compare them with the legacy tables, so a gate or ordering mistake fails loudly
2026-10-28 · Bell cycle logic (step, phase, arrows, entropy, wrap) is pure in `lib/cycle.ts` · the component only renders it, so the 3D scene and the GIF frames reuse the same functions
2026-10-28 · Confetti via `canvas-confetti` with `disableForReducedMotion` · the burst is decoration, so it is skipped for users who ask for less motion
