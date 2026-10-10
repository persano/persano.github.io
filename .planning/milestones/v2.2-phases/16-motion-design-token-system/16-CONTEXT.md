# Phase 16: Motion & Design Token System - Context

**Gathered:** 2026-10-10
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)

<domain>
## Phase Boundary

Establish the core motion and design token architecture across `css/base.css` (or `css/motion.css`), adding multi-layer elevation, spring easings, typography tracking, and mobile-native defaults.

Requirements:
- TOK-01: Multi-tier elevation tokens with ambient dark-antique shadows and 1px inset highlights.
- TOK-02: Spring motion tokens (`--ease-spring-snappy`, `--ease-spring-gentle`, `--dur-micro`, `--dur-interaction`).
- TOK-03: Typography and border polish (tighter display tracking, soft translucent borders).
- MOB-01: Viewport stability (`100dvh`) and safe-area insets (`env(safe-area-inset-*)`).
- MOB-02: Mobile touch polish (`-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`).
- MOB-03: `@media (prefers-reduced-motion: reduce)` override rules site-wide.

</domain>

<decisions>
## Implementation Decisions

### Agent's Discretion
All implementation choices are at the agent's discretion — discuss phase was skipped per user setting. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.
- Maintain single stylesheet architecture in `css/base.css` (zero new runtime CSS files or dependencies).
- Strictly preserve WCAG 2.2 AA contrast ratios and existing dark antique aesthetic.
- Preserve 20-locale compatibility and zero-build static architecture.

</decisions>

<code_context>
## Existing Code Insights

- `css/base.css` holds all theme custom properties, reset, typography, header, nav, cards, proof strip, and responsive layout.
- Headings use `--font-display: Georgia, "Times New Roman", serif`.
- Body uses `min-height: 100vh` and standard flex column layout.
- RTL overrides are centralized under `[dir="rtl"]`.

</code_context>

<specifics>
## Specific Ideas

- Multi-layer elevation tokens (`--elevation-low`, `--elevation-mid`, `--elevation-high`).
- Spring curves calibrated for snappy interactive feel (`cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.25, 1, 0.5, 1)`).
- Safe area insets integrated cleanly into body and main container padding.
- Thorough reduced-motion kill-switch.

</specifics>

<deferred>
## Deferred Ideas

None — discuss phase skipped.
</deferred>
