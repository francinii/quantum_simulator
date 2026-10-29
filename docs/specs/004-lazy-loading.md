# Lazy Loading

Status: implemented

## Goal

Keep the home page light: a simulator's code (and heavy libraries like KaTeX and gifshot) downloads only when someone opens that simulator.

## Behavior

- Each simulator's main component loads on demand; its config, metadata and gallery `Preview` stay in the main bundle so the gallery renders immediately.
- While a simulator loads, its page shows a short loading message inside the standard layout.
- If the simulator fails to load (offline, or a stale tab after a new deploy removed the old file), the page shows an error message with a button to reload.
- A simulator whose component is not lazy (such as migration placeholders) works unchanged.

## Out of scope

- Prefetching simulators on card hover.
- Splitting vendor libraries into custom chunks.
- A service worker or offline mode.

## Acceptance criteria

- [x] The main bundle stays under 500 kB. The build warns above 700 kB, because the Three.js simulators (decoherence, Bell states) legitimately ship a ~540 kB chunk that only downloads when they are opened.
- [x] The main bundle does not contain KaTeX or gifshot; they live in the interference chunk.
- [x] Opening `/simulators/interference` shows a loading message, then the simulator.
- [x] A failed load shows the error message and a reload button, not a blank page.
- [x] Gallery, not-found and placeholder simulators behave as before.

## Open questions

None.
