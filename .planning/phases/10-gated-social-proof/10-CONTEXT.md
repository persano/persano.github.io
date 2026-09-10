# Phase 10: Gated Social Proof - Context

**Gathered:** 2026-09-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the landing page's credibility story in three tiers, all on `geohist/index.html`: (1) a facts-only social-proof strip — 4 verifiable stat pills (20 localizations, offline-capable, History + Geography game modes, Android 7.0+) — as a new section between hero and features, every claim verifiable on-site (SEO-05); (2) the Tier-1 "Rated X.X ★ on Google Play" row shipped **OFF** (`hidden` + i18n keys already live in all 19 dictionaries), with an attributed whole-row link template; the owner flips it when the Play listing is live with a real aggregate rating (SEO-06); (3) Tier-2 `aggregateRating` JSON-LD stays **permanently OFF** with the documented precondition (an on-site review source must exist — Play-sourced numbers are barred from markup by Google's review-snippet policy; SEO-07, Pitfall 9). New i18n keys (~7, exact count pinned by planner) land atomically across the 19-dictionary keycheck surface. NOT in this phase: hub page (`index.html` root), rating-count display, fetching/mirroring Play data at runtime, translating changelog entries, any new pages or sitemap entries, the enforcement-flip-style owner actions themselves (runbook documents, owner executes).

</domain>

<decisions>
## Implementation Decisions

### Facts strip (SEO-05)
- **D-01:** Strip is a **stat pills row** — 3–4 compact icon+text blocks in a flex row that wraps on mobile. It is a **new section between the hero and the features section** (`geohist/index.html` after line 70), first content seen after the install CTA. — **Reversibility:** reversible — one section + one CSS block; removal costs nothing downstream.
- **D-02:** Strip carries exactly **4 facts**: "20 languages", "Play offline", "History + Geography", "Android 7.0+". Copy style is **short stats** (stat-first, pill-shaped), not mini-sentences. Android 7.0+ is already FAQ-verified (`geohist/index.html:136-137`).
- **D-03:** Pills are **static (non-interactive)** — no anchor links to proof points; the strip is a trust band, not navigation. Accessibility shape: keyed `aria-label` on the section (nav-aria pattern, line 51) + a plain `<ul>`; **no visible h2** — the keyed aria-label carries the name, keeping the existing h2 rhythm (features/gallery/faq) unbroken. Layout: **flexbox with gap + wrap**; RTL mirroring comes free via the existing `[dir="rtl"]` block (flex row order flips automatically).

### Tier-1 gated proof row (SEO-06)
- **D-04:** Row ships **OFF as `<div hidden>`** with its i18n keys **already live in all 19 dictionaries** (not commented-out markup). The unkeyed number span holds **placeholder `0.0`** while OFF — if `hidden` were ever lost, the row self-flags as obviously wrong instead of looking like a real number. Owner flip = remove `hidden` + edit ONE number in `index.html`; **zero dictionary churn at flip**. — **Reversibility:** reversible — flip is one attribute + one number; rollback = re-add `hidden`.
- **D-05:** Row sits **directly under the hero Play badge CTA** (inside the hero section) — rating proof hugs the install action, the classic store-page pattern. Content: **inline-SVG star (stroke, currentColor)** + whole row is **one `<a rel="noopener">`** to the Play listing. Numbers slot in as **keyed template fragments around ONE unkeyed number span** (e.g., `<i18n>Rated</i18n> <span>X.X</span> <i18n>★ on Google Play</i18n>`) — fragment split chosen per-language-safe by the agent (CJK word order is the known tradeoff). **Rating only, no count** — fewer numbers to fill, less staleness.

### Tier-2 aggregateRating (SEO-07)
- **D-06:** `aggregateRating` stays **permanently OFF**; the never-mirror-Play-ratings rule is absolute (Google review-snippet policy bars aggregating other-site ratings even when real — Pitfall 9). The commented template + precondition note live in an **HTML comment outside the JSON-LD `<script>`** — served schema stays byte-identical to today's (no `aggregateRating` anywhere in served output, no parser ambiguity from comments inside the script). Precondition documented both in-file and in the runbook (D-07).

### Owner flip runbook + validation
- **D-07:** Flip instructions ship as **`10-RUNBOOK.md`** in the phase dir (08/09-RUNBOOK pattern; note `.planning` is publicly served — console-UI instructions only, no secrets). Runbook contains: flip steps (remove `hidden`, fill number, deploy), the evidence gate, Rich Results Test ritual, rollback note, and the **refresh rule**. Evidence gate = **Play listing live AND a real aggregate rating visible on the Play page** (owner eyeballs it) — **no minimum-count floor**: any honest real rating flips. Refresh = **session convention** — update the number during any agent session touching app-version facts (Pitfall 9.4 changelog-freshness pattern); no automation, no calendar ritual.
- **D-08:** Structured-data validation is a **manual ritual in the runbook** (Rich Results Test + JSON-LD parse check, run pre-ship and again at owner flip). No new CI deps — zero-build CI cannot run Google's tool; existing `validate:html`/keycheck gates already cover syntax and key parity.
- **D-09:** Icons are **agent-drafted, owner-vetoed pre-ship** (09-CONTEXT D-09 copy-review pattern): 5 inline SVGs total (4 pill icons + star), 24px **stroke style, currentColor**, consistent across all. Glyph suggestions: globe (languages), download/cloud-off (offline), map-pin (modes), phone (Android).

### the agent's Discretion
- Exact key names + count (suggest `geohist.proof.*` + `geohist.tier1.*` namespaces; ~7 keys: 4 pills + strip aria + 2 Tier-1 fragments) — planner pins, atomic 171→~178 move across 19 dicts with owner spot-check per 07-CONTEXT D-06 pattern.
- Per-language fragment split for the Tier-1 sentence (word order across 20 languages; two-pass drafting, length/register checks per 07-CONTEXT D-07/D-08).
- Exact icon glyph designs (owner veto is the gate, not the initial choice).
- CSS class naming + section styling; interplay with the base.css:246 texture rule ("solid strip: texture never sits behind this copy").
- Whether smoke-check.sh gains any assertion (researcher verifies; likely none — landing URL unchanged, no sitemap edit).
- Keycheck needs **zero script edits** — `geohist/index.html` is already in the `pages` array, so new keys are CI-gated automatically.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning / Requirements
- `.planning/ROADMAP.md` — Phase 10 goal + 4 success criteria (facts-only strip verifiable on-site; Tier-1 ships OFF with attributed link template; Tier-2 permanently OFF with documented precondition; passes Google review-snippet policy), external gate note (Play listing live)
- `.planning/REQUIREMENTS.md` — SEO-05, SEO-06, SEO-07 exact wording (lines 40–42); **Out-of-Scope table** (aggregateRating mirroring Play = permanent exclusion; fabricated ratings = manual-action risk)
- `.planning/STATE.md` — Locked decisions (dictionary-swap i18n; zero-build; fork split); blockers: "Play listing live date gates SEO-06 flip" (owner-pending privacy-URL field); deploy-bridge blob-sha-assertion requirement from Phase 9
- `.planning/PROJECT.md` — Key Decisions table (zero-build, i18n architecture, Firebase split)

### Research (pre-v2, authoritative for this phase)
- `.planning/research/STACK.md` §(e) — SEO-05 integration: JSON-LD already has `offers.price` (rich-result shape exists); aggregateRating is a pure additive JSON-LD edit; gate mechanics (zero JS, manual flip); inline-SVG icon policy; i18n-keyed rating text
- `.planning/research/PITFALLS.md` **Pitfall 9** — aggregateRating gating is necessary but NOT sufficient: Play-sourced markup is policy-rejected regardless of the gate; invented testimonials = fake reviews; visible attributed-link display (Tier 1) is the sanctioned path; session-convention freshness pattern (§9.4)
- `.planning/research/FEATURES.md` Area D — Tier-1/Tier-2 split rationale; `aggregateRating` requires `ratingValue` + (`ratingCount`|`reviewCount`); marked-up rating must be visible on page; self-serving ban scoped to LocalBusiness/Organization only
- `.planning/research/ARCHITECTURE.md` §5 — one JSON block in `geohist/index.html`; additive edit, zero restructure, no new sitemap entry, no CI change; SEO-05 floats last, externally gated

### Prior Phase Context
- `.planning/phases/07-localization-20-rtl/07-CONTEXT.md` — D-07/D-08 glossary mining + two-pass drafting for the ~7 new keys' 19 translations; per-wave owner spot-check (D-06)
- `.planning/phases/09-app-check-monitor-first/09-CONTEXT.md` — D-09 agent-drafts-owner-vetoes pattern (applies to icons); runbook location pattern
- `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` — structural pattern for `10-RUNBOOK.md` (flip steps, evidence gate, rollback section)

### Code (the integration surface)
- `geohist/index.html` — hero section lines 60–70 (badge CTA = Tier-1 insertion point); JSON-LD block lines 20–40 (Tier-2 comment lands adjacent, outside the script); features section line 72 (strip section inserts before it); FAQ Android 7.0 line 136–137 + languages line 144–146 (the facts' on-site verification points)
- `css/base.css` — section styling conventions; texture rule line 246; `[dir="rtl"]` override block (strip pills mirror for free)
- `js/i18n/*.json` (19 dictionaries, 171 keys) — atomic surface move 171→~178
- `scripts/i18n-keycheck.mjs` — `pages` array line 38 already includes `geohist/index.html`; exact set-equality gate covers new keys with zero script edits; CJK punct gate scope (ja+zh) applies to new values
- `js/i18n.js` — keyed-node engine (`data-i18n` / `data-i18n-attr`); plain-text keyed-node rule constrains Tier-1 fragment shape

### External Policy (verified in research)
- Google Search Central — Review snippet (AggregateRating) guidelines: "Don't aggregate reviews or ratings from other websites"; rating must be visible on page; manual-action warning
- Google Search Central — Software app (`SoftwareApplication`) structured data: `name` + `offers.price` + (`aggregateRating`|`review`) eligibility
- Google Rich Results Test (`search.google.com/test/rich-results`) — the D-08 manual validation tool

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Hero section markup shape (`geohist/index.html:60-70`) — badge CTA + copy pattern; Tier-1 row slots under the badge as a sibling element
- Keyed-node i18n engine (`data-i18n`, `data-i18n-attr`) — pills + aria-label + Tier-1 fragments all ride it; no engine change
- `[dir="rtl"]` CSS block — pill row mirrors automatically; strip needs no RTL-specific code
- Keycheck gate — `geohist/index.html` already registered; new keys auto-gated across all 19 dictionaries
- Section + `feature-group` CSS conventions — strip styling follows existing patterns, one new CSS block

### Established Patterns
- Keyed nodes = plain-text only — Tier-1's unkeyed number span is the mechanism that keeps fragments keyed-compliant while numbers stay owner-editable
- Atomic key-surface moves — one commit carries page markup + all 19 dictionaries (Phase 6 red-gate proven)
- Silent degradation — hidden row with 0.0 placeholder self-flags instead of faking realism
- Zero build step, classic defer scripts, inline-SVG icons, one-atomic-commit convention
- Deploy via GitHub Git Data API bridge with mandatory blob-sha assertions (Phase 9 precedent, STATE.md) if remote ops are harness-blocked

### Integration Points
- `geohist/index.html` hero — Tier-1 `div hidden` insertion point (under badge CTA)
- `geohist/index.html` between hero and features — strip section insertion point
- JSON-LD block head — Tier-2 HTML comment (outside `<script>`) documents the permanent-OFF precondition
- `css/base.css` — new `.proof-strip` / pill styles + `[dir="rtl"]` verification
- 19 dictionaries + keycheck — atomic key move in the same commit as the markup
- `10-RUNBOOK.md` — phase dir, owner-facing flip doc

</code_context>

<specifics>
## Specific Ideas

- Placeholder `0.0` chosen deliberately over "X.X": if the hidden row ever renders, "Rated 0.0 ★" is obviously wrong and self-flagging — never a plausible-looking fake
- Static pills chosen so the strip is a trust band, not navigation — "verifiable on-site" is satisfied by the claims being true and present on the page, not by links
- No minimum-count flip floor: owner prefers any honest real rating over defensiveness — fabrication is the enemy, not small numbers
- Rating-only (no count): fewer numbers to fill and maintain at flip; count goes stale fastest
- Session-convention refresh mirrors Pitfall 9.4: the changelog-freshness habit already covers "sessions that touch app-version facts" — the rating number rides the same trigger

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Standing items from STATE.md remain external to this phase: Play listing live date gates the SEO-06 flip (owner-pending privacy-URL field), selector-page removal + GeoHist-as-home (post-phase backlog), FIRE-10 enforcement flip (post-monitoring).

</deferred>

---

*Phase: 10-Gated Social Proof*
*Context gathered: 2026-09-10*
