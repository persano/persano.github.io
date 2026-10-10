# Phase 17: Interactive Micro-Interactions & Accordions - Context

**Gathered:** 2026-10-10
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)

<domain>
## Phase Boundary

Add physical feel to interactive elements: press damping on buttons/badges, hover lift on cards, and smooth CSS Grid/WAAPI accordion expansion.

Requirements:
- INT-01: Tactile active press physics (`scale(0.97)` on `:active`) applied to buttons, Play Store badges, and interactive CTAs.
- INT-02: Smooth card hover elevation and border highlight applied to landing feature cards and `/apps/` portfolio cards (scoped to `@media (hover: hover)`).
- INT-03: Smooth, animated expansion and icon rotation on FAQ accordions across root landing and `/geohist/guide.html`.

</domain>

<decisions>
## Implementation Decisions

### Agent's Discretion
All implementation choices are at the agent's discretion — discuss phase was skipped per user setting.
- Use spring motion tokens from Phase 16 (`--ease-spring-snappy`, `--ease-spring-gentle`, `--dur-micro`, `--dur-interaction`).
- For hover lifts, scope strictly to `@media (hover: hover) and (pointer: fine)` to avoid sticky hovers on mobile touchscreens.
- For accordion animation, use CSS Grid `grid-template-rows: 0fr` to `1fr` transition or CSS pseudo-element icon rotation with smooth spring easing while maintaining native `<details>`/`<summary>` semantics and accessibility.
- Zero external JS libraries; keep zero-build vanilla CSS/JS architecture intact.

</decisions>

<code_context>
## Existing Code Insights

- Buttons and badges: `.badge-cta`, `.consent-banner button`, `.form-submit`, `.site-nav a`.
- Cards: `.feature-group`, `.app-card`, `.mode-item`, `.changelog-entry`.
- FAQ items: `.faq-item` (`details`) and `.faq-item summary`. Currently uses CSS `::after` with content `+` / `\2212` and flat snap.

</code_context>

<specifics>
## Specific Ideas

- Button active states: `transform: scale(0.97); transition: transform var(--dur-micro) var(--ease-spring-snappy);`.
- Card hover: `transform: translateY(-2px); box-shadow: var(--elevation-high); border-color: rgba(217, 169, 81, 0.4); transition: transform var(--dur-interaction) var(--ease-spring-gentle), box-shadow var(--dur-interaction) var(--ease-spring-gentle), border-color var(--dur-interaction) ease;`.
- FAQ accordion: SVG or CSS indicator with `transform: rotate(45deg)` on open, plus smooth grid transition for accordion content.

</specifics>

<deferred>
## Deferred Ideas

None — discuss phase skipped.
</deferred>
