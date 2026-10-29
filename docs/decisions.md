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
