# Gallery

Status: implemented
Legacy: legacy/index.html

## Goal

The home page where a visitor discovers every simulator and opens one with a single click. It must look pixel-equivalent to the legacy page, built from shared, reusable pieces.

## Behavior

- Header: event badge, gradient title, one-paragraph intro.
- One card per registered simulator in pedagogical order (config `order`), showing: animated preview, number ("Simulation 01"), chip (e.g. `H ⊗ H`), title, description, category, "Open simulation" link.
- Cards link to `/simulators/:id`; hover lifts the card.
- Grid: 1 column on mobile, 2 from `md`, 3 from `lg`.
- Footer: GIF-export tip and event credit.
- Cards come only from the simulator registry; the gallery knows no simulator by name.
- Each feature provides its own `Preview` component (its animated SVG) via config.

## Shared foundation (reused by every page)

- Design tokens in `shared/styles`: colors (`#fafcff` bg, `#1e1244` ink, `#2f80ed` blue, `#8b5cf6` purple, `#ff6097` pink), Inter and Fira Code fonts, shared animations (`travel`, `shrink`).
- `Layout` restyled to legacy look: light background, shared header and footer. Simulator pages reuse it, so the one inconsistent legacy page (decoherence: white bg, narrower width) adopts the same standard.
- Reusable components: `Card`, `Chip`, `PageHeader`, `PageFooter`. No page restyles these inline.

## Out of scope

- Search, filtering, sorting controls.
- Migrating the simulators themselves.
- Translating the UI.

## Acceptance criteria

- [x] Every registered simulator renders exactly one card with preview, number, chip, title, description and category.
- [x] Each card links to its `/simulators/:id` route and is keyboard focusable.
- [x] Cards follow config `order`, numbered from 01.
- [x] Adding a simulator config adds a card with no gallery code change.
- [x] Grid is 1/2/3 columns at mobile/`md`/`lg`.
- [x] Preview animations respect `prefers-reduced-motion`.
- [x] Side by side with `legacy/index.html`, layout, colors, fonts and spacing match.
- [x] No color or font value is hardcoded outside the design tokens.

## Open questions

None.
