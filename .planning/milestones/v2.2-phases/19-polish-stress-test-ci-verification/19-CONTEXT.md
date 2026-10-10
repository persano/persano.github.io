# Phase 19: Polish, Stress-Test & CI Verification - Context

**Gathered:** 2026-10-10
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)

<domain>
## Phase Boundary

Stress-test the site under all 20 locales and ensure 60fps compositor performance and 100% green CI validation.

Requirements:
- VAL-01: Visual layout resilience stress-test (`break-ui`) across all 20 locales (long text strings in German/Russian, RTL alignment in Arabic/Urdu).
- VAL-02: Full existing CI validation chain passes cleanly with zero errors (`npm run validate`: html, domain, play-links, links, i18n-detect, i18n).

</domain>

<decisions>
## Implementation Decisions

### Agent's Discretion
All implementation choices are at the agent's discretion — discuss phase was skipped per user setting.
- Audit layout resilience across extreme text lengths and RTL script directions.
- Ensure all transitions use GPU-accelerated compositor properties (`transform`, `opacity`) without layout thrashing.
- Execute the full `npm run validate` test chain and record proof.

</decisions>

<code_context>
## Existing Code Insights

- `css/base.css` contains all design tokens, animations, cards, layout, RTL overrides, and per-language line-height rules.
- 19 JSON dictionaries in `js/i18n/` cover 178 keys each.
- `scripts/check-no-old-domain.mjs`, `scripts/check-play-links.mjs`, `scripts/i18n-detect.test.mjs`, and `scripts/i18n-keycheck.mjs`.

</code_context>

<specifics>
## Specific Ideas

- Verify text-overflow, word-break, and flex-wrapping under long translations.
- Run `npm run validate` and assert green exit code.

</specifics>

<deferred>
## Deferred Ideas

None — discuss phase skipped.
</deferred>
