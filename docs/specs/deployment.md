# Deployment

Status: ready

## Goal

Publish the app as a static site on GitHub Pages at `https://francinii.github.io/quantum_simulator/`, redeployed on every push to `main`.

## Behavior

- A GitHub Action builds with pnpm and publishes `dist/` to Pages.
- The app is served under the `/quantum_simulator/` base path; assets and routes resolve under it.
- Opening or refreshing any in-app route directly (e.g. `/quantum_simulator/simulators/bell-states`) loads the app instead of a 404.
- Local `pnpm dev` keeps working at `/` of the dev server.

## Out of scope

- Custom domain.
- Preview deployments for pull requests.
- Publishing `legacy/` (kept in the repo only, until migrated).

## Acceptance criteria

- [ ] Pushing to `main` runs lint, tests and build before deploying; a failure blocks the deploy.
- [ ] The live URL shows the gallery with fonts, styles and previews loaded.
- [ ] Clicking a card, then refreshing the page, still shows that simulator's page.
- [x] An unknown path under the base shows the not-found page.
- [x] `pnpm build && pnpm preview` serves the same behavior locally under the base path.

## Open questions

None. One manual step outside the code: in the GitHub repo, Settings → Pages → Source must be set to "GitHub Actions" (done by the owner). Until then the live site (old root `index.html`) breaks after the first push.
