# Phase 18: Screenshot Showcase & Lightbox - Context

**Gathered:** 2026-10-10
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)

<domain>
## Phase Boundary

Transform static screenshot grid into an interactive showcase: mobile-friendly scroll-snap reel with pagination dots, plus an interactive lightbox modal.

Requirements:
- GAL-01: Screenshot gallery on root landing upgraded to smooth CSS scroll-snap horizontal reel with mobile pagination indicators.
- GAL-02: Full-screen interactive lightbox modal for viewing high-resolution screenshots with smooth entrance, ESC key trap, and background click dismissal.
- GAL-03: Progressive enhancement fallback ensuring screenshot gallery remains fully readable and browsable without JavaScript.

</domain>

<decisions>
## Implementation Decisions

### Agent's Discretion
All implementation choices are at the agent's discretion — discuss phase was skipped per user setting.
- Progressive enhancement: Base markup in `index.html` stays clean semantic HTML `<ul>` and `<li>` with images and captions.
- CSS scroll-snap: On mobile (`@media (max-width: 600px)`), `.gallery-grid` switches from grid to `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;` with peek margins, while desktop retains multi-column layout.
- Lightbox: Native `<dialog>` or accessible overlay with `role="dialog"`, `aria-modal="true"`, closed via Escape key or backdrop click. Smooth spring fade-in / scale entrance.
- Zero external libraries: Pure vanilla ES2020+ script in `js/gallery.js` or inline module loaded defer. Zero build step, fully compliant with CI gates.
- No new i18n key requirement: Close buttons and aria labels can reuse existing aria-label or language-neutral SVG icons (× close icon) or existing labels to keep 178-key set equality invariant completely untouched!

</decisions>

<code_context>
## Existing Code Insights

- `index.html` lines ~120-170 contains `.gallery` with `.gallery-grid` and 4 `.gallery-tile` elements (menu, map, flags, timeline).
- WebP screenshots in `geohist/screenshots/`:
  - `screenshot.menu.webp`
  - `screenshot.map.webp`
  - `screenshot.flags.webp`
  - `screenshot.timeline.webp`
- `css/base.css` lines 260-320 has `.gallery`, `.gallery-grid`, `.gallery-tile`, `.tile-caption`.

</code_context>

<specifics>
## Specific Ideas

- Add `js/gallery.js` (loaded via `<script defer src="js/gallery.js"></script>` on `index.html`).
- If JS is disabled or fails, images remain displayed in the scroll-snap/grid reel without modal popup.
- Modal opens on tile click, focuses modal, traps ESC key, click outside to close.

</specifics>

<deferred>
## Deferred Ideas

None — discuss phase skipped.
</deferred>
