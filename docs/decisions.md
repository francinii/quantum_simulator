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
