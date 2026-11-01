# Sidebar Navigation

Status: draft

Related: `011-theming.md` (colors, light/dark), `012-i18n.md` (English/Spanish). This spec owns the menu structure and behavior; those two own the cross-cutting concerns the menu consumes.

## Goal

A persistent side menu that turns the project from a single gallery into a small learning platform with four areas: Home, Lab, Articles Explained Visually and Learn. This spec covers the navigation shell and the route structure only; the content of each new area gets its own spec.

## Sections

| Entry                       | Route       | Purpose                                                                                                                          | Content spec                    |
| --------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Home                        | `/`         | About the project and its author. **For now `/` redirects to `/lab`** until the Home page is built.                              | TBD (needs author information)  |
| Lab                         | `/lab`      | The current simulator gallery (moved from `/`). Simulators stay at `/simulators/:id`.                                            | `001-gallery.md` (already done) |
| Articles Explained Visually | `/articles` | Research articles explained with visuals, searchable by topic, so readers skip the paper.                                        | TBD                             |
| Learn                       | `/learn`    | Structured, topic-based course (fundamentals: qubit, measurement, ...) built from the books by Thomas Wong and Nielsen & Chuang. | TBD                             |

## Behavior

### Navigation

- The menu lists the four entries in the order above, each with an icon and a label. The entry for the current route is highlighted and marked with `aria-current="page"`.
- While the redirect is in place, Home is never highlighted (the visitor lands on `/lab`).
- `/simulators/:id` highlights **Lab**; `/articles/:slug` highlights Articles; `/learn/...` highlights Learn.
- Sections with no content yet (`/articles`, `/learn`) render a shared "Coming soon" page inside the layout, so the menu is complete from the first release.
- Menu entries come from a single list in `shared/config` (label key, route, icon, match rule). Adding a section means adding one entry plus its route; the sidebar knows no section by name.
- Simulator pages keep the sidebar visible like every other page; "back" links point to `/lab`.

### Collapse control (hamburger)

- The collapse/expand control is a **three-line (hamburger) icon button at the top of the sidebar**, in the header row before the project name. It replaces the "Collapse" button at the bottom.
- Desktop (`lg` and up): fixed sidebar on the left, expanded by default. The hamburger toggles between expanded and an icon-only rail; in the rail the hamburger stays at the top. The state persists in `localStorage` (`quantum-lab:sidebar-collapsed`).
- Below `lg`: the sidebar is hidden; the top bar shows the same hamburger icon at its left and opens the sidebar as an overlay drawer. The drawer closes on navigation, on `Esc`, and on backdrop click, and returns focus to the hamburger.
- The button has an accessible name ("Open menu" / "Collapse menu" / "Expand menu", localized), `aria-expanded` and `aria-controls`.

### Accent color

- The menu uses **one soft pastel accent for every entry: pastel sky blue**, taken from the palette the project already has. No saturated fills, no per-section colors, so the menu stays harmonious.
- Active entry: pastel fill (`--color-accent-soft`), a thin left indicator bar and the icon in the stronger shade (`--color-accent-strong`), and the label in the strong shade or ink so text meets AA contrast. The pastel is the background, never the text color.
- Hover on inactive entries uses a very light tint of the same hue (the existing blue wash). The keyboard focus ring uses the strong shade.
- Sidebar surface stays neutral (`--color-surface`), so the pastel reads as a highlight. The sidebar never references a raw color: it uses the `accent-*` semantic tokens defined per theme in `011-theming.md`.
- Dark theme: the soft fill becomes a deep, low-saturation tint of the same hue (not a bright pastel) and the strong shade is lightened.
- Changing the accent hue later (e.g. to pastel pink) means editing two token values, not the components.

### Footer controls

- The sidebar footer holds the **theme switcher** (`011-theming.md`) and the **language switcher** (`012-i18n.md`), and secondary links (e.g. source repository) once defined.
- In the icon-only rail, both switchers collapse to single icon buttons with tooltips.
- On mobile they appear in the drawer footer.

### General

- The menu is a `<nav aria-label>` (localized), fully keyboard operable, with visible focus states.
- The header shows the project name ("Quantum Lab") linking to Home.
- All labels come from the i18n catalog; all colors from semantic tokens. No hardcoded text, colors or fonts.
- Animations respect `prefers-reduced-motion`.
- Existing pages keep their look. `Layout` gains the sidebar and a content area; the per-page header and footer stay as they are.

## Structure and dependencies

- `shared/components/Sidebar` (+ `SidebarItem`, `HamburgerButton`, `MobileTopBar`, `ThemeSwitcher`, `LanguageSwitcher`) and `shared/config/navigation.ts`: generic, no feature imports.
- `app/router.tsx` declares the four route groups; each group renders a page from `pages/`.
- The current `HomePage` body moves to `LabPage`. `HomePage` is created later with the about content; until then `/` redirects to `/lab`.
- Future features (`articles`, `learn`) are separate feature folders exposing their API through `index.ts`, per the golden rules. They never import each other or the sidebar.

## Suggested delivery order

1. `011-theming.md`: token layers and the dark theme (touches every component, so it goes first).
2. `012-i18n.md`: catalog infrastructure, then menu and shell strings.
3. This spec's changes: hamburger control, pastel accent, footer switchers (they need 1 and 2).

## Out of scope

- The actual content of Home, Articles and Learn (separate specs).
- Search, topic filtering and tagging (belong to the Articles and Learn specs).
- Accounts, progress tracking.
- Nested or expandable menu groups. Learn topics live inside the Learn page, not in the sidebar, until there is a real need.

## Acceptance criteria

Already implemented (first delivery):

- [x] The four entries render in order with icon, label and the correct route.
- [x] The active entry is highlighted and has `aria-current="page"`, including on nested routes (`/simulators/:id` highlights Lab).
- [x] `/` redirects to `/lab`, which shows the gallery; `/articles` and `/learn` show "Coming soon"; unknown paths still show not-found.
- [x] `/simulators/:id` URLs and existing links keep working.
- [x] `000-app-shell.md` and `001-gallery.md` are updated to reflect the new routes and layout.

Pending (this revision):

- [ ] The collapse control is a hamburger icon at the top of the sidebar (desktop) and top bar (mobile); no collapse button remains at the bottom.
- [ ] Desktop: the hamburger toggles expanded and icon-only rail, and the state survives a reload.
- [ ] Below `lg`: drawer closes on navigation, `Esc` and backdrop click; focus returns to the hamburger.
- [ ] The active entry shows the single pastel sky accent (soft fill, indicator bar, strong icon and label); focus ring uses the strong shade; text contrast meets AA in both themes.
- [ ] The theme and language switchers are in the sidebar footer, work in the rail and in the mobile drawer.
- [ ] Every menu string is localized in EN and ES with no layout break (longest label, "Articles Explained Visually" / "Artículos explicados visualmente", still fits the expanded sidebar and wraps cleanly).
- [ ] Fully usable by keyboard; `nav` has an accessible name.
- [ ] No horizontal scroll at 360px width in any section.
- [ ] Adding an entry to `navigation.ts` shows it in the menu with no sidebar code change.
- [ ] Router and sidebar tests cover each route, active state, hamburger toggle, drawer behavior; lint, format, tests and build pass.

## Open questions

- Home content: who the author is, project story, links, photo/contact? (needed before the Home spec)
- Sidebar on simulator pages: visible for now; revisit if the visualizations feel cramped.
