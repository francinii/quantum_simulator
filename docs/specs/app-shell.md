# App Shell

Status: implemented

## Goal

A runnable React app skeleton where simulators can be plugged in by registering a config, with tooling (lint, format, tests) ready from day one.

## Behavior

- `pnpm dev` serves the app; `pnpm build` produces a static bundle.
- Routes: `/` (home), `/simulators/:id` (simulator), anything else shows a not-found page.
- A shared layout wraps all pages (header with home link, content area).
- Simulators are discovered automatically (`import.meta.glob`) from each feature's `simulator.config.ts`; the router and gallery read the same list.
- Tailwind styles available globally; `@/` aliases `src/`.

## Out of scope

- Real simulators (migrated one by one later).
- Backend, auth, state library, i18n.
- Removing `legacy/`.

## Acceptance criteria

- [x] `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test` all succeed on a clean install.
- [x] TypeScript runs with `strict: true`.
- [x] Visiting `/` renders the home page inside the shared layout.
- [x] Visiting an unknown path renders the not-found page.
- [x] Visiting `/simulators/<unknown-id>` renders the not-found page.
- [x] A placeholder simulator registered via config appears in the router without editing the router.
- [x] Layout is usable at 360px width.

## Open questions

None.
