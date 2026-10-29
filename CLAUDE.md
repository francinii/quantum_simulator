# Quantum Lab: Project Guide

Interactive quantum computing simulators for teaching. Currently **frontend only**. A backend may come later as a standalone service consumed by any client (web, mobile, desktop).

## Golden Rules

1. **Everything is in English**: folders, files, identifiers, comments, commit messages, docs, and UI copy defaults.
2. **Feature-driven structure**: code is grouped by feature, not by technical type. A feature owns its components, hooks, logic, and types.
3. **Features expose a public API** through `index.ts`. Other code imports a feature only through that file, never its internals.
4. **Dependency direction**: `app -> pages -> features -> shared`. Features never import from other features. `shared` imports from nothing above it.
5. **Pure quantum logic is framework-free**: math lives in `shared/lib/quantum` as plain TypeScript with unit tests. No React, no DOM.
6. **Keep it simple**: no abstraction, package, or service until it is needed. No monorepo, state library, or backend layer until a real requirement appears.
7. **Do not touch `legacy/`**: the original HTML simulators are preserved as the reference for migration. Never delete them until their feature is migrated and verified.
8. **Comments explain why, not what.** Default to none.
9. **Spec first (SDD)**: write or update the spec in `docs/specs/NNN-<feature>.md` before implementing a feature or changing its behavior. `NNN` is a 3-digit sequence in creation order (`000`, `001`, `002`, ...); never renumber existing specs.
10. **The spec is the source of truth and must always be up to date.** Any change to behavior, scope, or a decision updates the spec in the same piece of work, before or together with the code. Tick acceptance criteria only once verified, and set `Status` to match reality (`draft`, `ready`, `implemented`). If code and spec disagree, stop and reconcile them; never leave the spec stale.
11. **Conventional commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
12. **Commits always need the owner's approval.** Never commit or push on your own, even if a similar commit was approved before. Propose the commit message and the files, then wait for a yes. Pushing is done by the owner.
13. Responsive design for different devices
14. **Keep the repo clean**: never commit dependencies, build output, caches, logs, secrets, or editor/OS files. `.gitignore` covers them; update it when a new tool adds generated files. `pnpm-lock.yaml` is the exception and is always committed.


## Stack

| Concern         | Choice                                          |
| --------------- | ----------------------------------------------- |
| Framework       | React + TypeScript (`strict: true`)             |
| Build tool      | Vite (SPA)                                      |
| Styling         | Tailwind CSS (already used by the legacy pages) |
| Routing         | React Router                                    |
| Testing         | Vitest + Testing Library                        |
| Lint / format   | ESLint + Prettier                               |
| Package manager | pnpm                                            |

Add later only when needed: TanStack Query (when a backend exists), Zustand (if shared state outgrows React state).

## Why Vite and not Next.js

- The product is interactive, client-side visualization (SVG, animation, GIF export). There is little to render on a server.
- No SEO pressure today. Simulators are tools, not content pages.
- The future backend is a separate service shared by web and mobile. Next.js server features (API routes, server actions) would duplicate or couple to it.
- Static output deploys anywhere (GitHub Pages, Netlify, Vercel) with no server cost.
- Feature-driven code is framework-agnostic. If SEO for course landing pages becomes important, moving to Next.js later is a contained migration of `app/` and `pages/`.

## Project Structure

```
quantum-lab/
├── legacy/                       # Original HTML simulators, untouched until migrated
│   ├── index.html
│   └── *.html
├── docs/
│   └── specs/                    # One spec per feature (SDD)
├── public/
├── src/
│   ├── app/                      # App shell: entry, providers, router
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── main.tsx
│   ├── pages/                    # Route-level compositions, no business logic
│   │   ├── HomePage.tsx
│   │   ├── SimulatorPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── features/                 # One folder per feature
│   │   ├── gallery/              # Home gallery of simulator cards
│   │   ├── matrix-algebra/
│   │   ├── bell-states/
│   │   ├── decoherence/
│   │   ├── interference/
│   │   ├── superposition/
│   │   └── qubit-measurement/
│   │       ├── components/       # Feature UI
│   │       ├── hooks/            # Feature hooks
│   │       ├── lib/              # Feature-specific logic
│   │       ├── types.ts
│   │       ├── simulator.config.ts   # Metadata used by the gallery and router
│   │       └── index.ts          # Public API
│   └── shared/                   # Reusable across features
│       ├── components/           # Generic UI (Button, Card, Slider, layout)
│       ├── hooks/                # Generic hooks (e.g. useAnimationFrame)
│       ├── lib/
│       │   ├── quantum/          # Complex numbers, matrices, Bloch sphere math
│       │   └── export/           # GIF export utilities
│       ├── styles/               # Global CSS, design tokens, animations
│       ├── types/
│       └── config/               # Constants, env access
├── tests/                        # E2E tests only. Unit tests live next to the code.
├── CLAUDE.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## Naming Conventions

- Folders and non-component files: `kebab-case` (`bell-states`, `quantum-math.ts`).
- React components: `PascalCase.tsx`, one component per file.
- Hooks: `useThing.ts`.
- Tests: `thing.test.ts(x)` next to the file under test.
- Types and interfaces: `PascalCase`. Constants: `UPPER_SNAKE_CASE`.
- Prefer named exports. Default exports only where a tool requires them.
- Import alias: `@/` maps to `src/`.

## Adding a Simulator

1. Write `docs/specs/NNN-<feature>.md` from `_template.md` (next free number): goal, user interactions, math, acceptance criteria.
2. Create `src/features/<feature>/` with the layout above.
3. Put pure math in `shared/lib/quantum` if reusable, otherwise in the feature `lib/`. Add unit tests.
4. Register it in `simulator.config.ts` so the gallery and router pick it up.
5. Verify in the browser against the matching file in `legacy/`, then mark the legacy file as migrated in the spec.

## Migration Plan (Legacy HTML to React)

1. Move current HTML files into `legacy/` (no content changes).
2. Scaffold Vite + React + TypeScript + Tailwind with the structure above.
3. Build `shared` basics (layout, Card, Button, Slider) and the `gallery` feature to replace `legacy/index.html`.
4. Migrate one simulator at a time, starting with the simplest. Extract duplicated CSS, JS, and math into `shared`.
5. Once all are migrated and verified, remove `legacy/`.

## Future Backend (Not Now)

When needed, build it as an independent, client-agnostic service:

- Defined by an API contract (OpenAPI) so web, mobile, and desktop all consume the same interface.
- Lives in its own folder or repository. The frontend talks to it only through a `shared/api` client.
- Do not design or scaffold it until a concrete requirement exists (accounts, saved progress, courses).

## Quality Checklist

- TypeScript strict, no `any` without justification.
- Lint, format, and tests pass before every commit.
- Quantum math has unit tests (known results: H|0>, Bell states, Born rule).
- Keyboard accessible controls and labeled inputs.
- Responsive from mobile width up.
