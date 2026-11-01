# Theming (Light and Dark)

Status: ready

## Goal

Visitors can use the whole site in a light or a dark theme, following their system by default. Colors are managed through a token system so a theme is a set of values, not a rewrite of components.

## Behavior

### Modes

- Three modes: **Light**, **Dark**, **System** (default). System follows `prefers-color-scheme` and reacts live when the OS setting changes.
- The choice persists in `localStorage` (`quantum-lab:theme`, values `light | dark | system`). Storage failures fall back to System without errors.
- The resolved theme is applied as `data-theme="light|dark"` on `<html>`, together with the matching CSS `color-scheme` so native controls, scrollbars and form fields follow.
- No flash of the wrong theme: a tiny inline script in `index.html` resolves and sets `data-theme` before first paint.
- The switcher lives in the sidebar footer (see `010-sidebar-navigation.md`): a three-option control (Light / Dark / System), labeled, keyboard operable, exposing the current value to assistive tech.

### Token architecture

Two layers, both in `shared/styles`:

1. **Primitives** (`shared/styles/palette.css`): the raw palette, named by hue and lightness step (`--palette-pink-30`, ...). Theme independent. Never used by components; a test fails if source files reference them.
2. **Semantic tokens** (`shared/styles/tokens.css`): purpose-based names (`--color-page`, `--color-surface`, `--color-ink`, `--color-body`, `--color-muted`, `--color-line`, `--color-accent-soft`, `--color-accent-strong`, ...). Defined for light in `:root` and overridden in `:root[data-theme='dark']`. Tailwind utilities (`bg-surface`, `text-ink`, ...) map to these.

Rules:

- Components and pages use semantic tokens only. No hex values, no primitives, and no per-component `dark:` color overrides; a color that needs to change in dark changes in the token definition.
- Tokens are named by role, not by appearance (`--color-muted`, not `--color-slate-500`).
- Today's ~46 tokens are audited once: each is kept, merged into an existing role, or renamed to a role. Simulator-specific tokens (sphere, gates, measurement gradient) stay as tokens with a dark value each.
- Spacing, radius, typography and motion are not theme dependent and stay shared.

### Canvas, SVG and 3D

- Canvas drawing reads colors from tokens through `shared/lib/theme/canvas-theme.ts`. On theme change the cached values are invalidated and every canvas redraws; no reload.
- Inline SVG (previews, diagrams) uses `currentColor` or token-backed classes, never literal colors.
- Three.js scenes read the same tokens for background, materials and lines, and update on theme change.
- KaTeX formulas inherit the text color.

### Exports

- GIF export **always renders in the light theme**, whatever theme is active on screen, so GIFs are predictable on class slides. Exporters resolve colors from the light token set explicitly (not from the live page), and the on-screen theme is never changed during export.

### Accessibility

- Text contrast at least 4.5:1 and UI/graphic contrast at least 3:1 (WCAG AA) in both themes, for every text-on-surface pair and every accent.
- A unit test reads the token values and asserts the contrast of the declared pairs, so a bad color fails CI.
- The light theme keeps the legacy brand values, so a few light pairs are below AA for small text (for example `faint` on white, brand pink on white). They are listed with their current ratio as known exceptions in `tokens.test.ts` so they cannot get worse; dark has no exceptions. Fixing them is a separate, visible design change.
- Switching theme never changes layout, only color.

## Dark theme direction

- Deep navy-ink backgrounds (derived from the brand ink `#1e1244`), not pure black; raised surfaces slightly lighter.
- Brand blue, purple and pink are lightened as needed to hold contrast on dark surfaces; hue stays recognizable.
- Shadows soften; separation relies more on borders and surface steps.
- The light theme remains the reference for pixel comparison with `legacy/`.

## Out of scope

- User-defined palettes, per-section themes, high-contrast mode (can be added later as another token set).
- Theming the legacy pages.
- Images or photos with theme-specific variants (none exist yet).

## Acceptance criteria

- [x] Light, Dark and System modes work; System reacts to an OS change without reload (unit tests; browser check pending).
- [x] The choice persists across reloads; with storage blocked the site still works (unit tests).
- [ ] No flash of the wrong theme on load (verified with a hard reload in each theme).
- [ ] `<html>` carries `data-theme` and `color-scheme` matching the resolved theme.
- [x] No hardcoded colors in `src` (ts, tsx, css outside token files); `no-hardcoded-colors.test.ts` enforces it.
- [x] Components use semantic tokens only; primitives appear only in the token layer (same test).
- [ ] Every simulator, preview, canvas, SVG and 3D scene is readable and correct in both themes, and updates live on switch.
- [x] Contrast test passes for all declared pairs in both themes (light exceptions documented above).
- [ ] Light theme still matches `legacy/` side by side.
- [ ] A GIF exported while in dark mode is identical to one exported in light mode, and the page theme does not flicker during export.
- [ ] Switcher is keyboard operable and labeled; works in the sidebar rail and mobile drawer.
- [x] Unit tests cover theme resolution, persistence and the canvas theme refresh; lint, format, tests and build pass.

## Open questions

None. The exact dark palette values are proposed in the first implementation PR and reviewed visually.
