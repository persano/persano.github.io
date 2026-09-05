# Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in) - Context

**Gathered:** 2026-09-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete English content phase: `/geohist/` landing (hero, categorized features, screenshot-gallery skeleton, FAQ, About-the-developer, Play badge), `/geohist/guide.html` (concise how-to-play + game modes), and the full hub page (`/index.html`: Persano brand intro + single GeoHist app card). All markup mobile-first responsive, contrast-math-checked dark antique palette, and `data-i18n` keys baked into every user-visible string (engine + dictionaries arrive Phase 3). FAQ wording mirrors `geohist/privacy.html` (CMPL-04). Play Store button visible with real package URL (LNDG-04). NOT in this phase: real screenshots (Phase 5), i18n engine/dictionaries/switcher (Phase 3), consent/Firebase/form (Phase 4), SEO/JSON-LD/sitemap (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Visual style (site-wide direction)
- **D-01:** Dark antique theme replaces Phase 1 light cream as the site-wide direction — **Reversibility:** costly — palette and texture live in `css/base.css` shared by every page; switching later means redoing all pages' styling and re-proving contrast math
- **D-02:** Antique-map atmosphere rendered CSS-only (gradients + inline SVG patterns: paper grain, graticule/contour hints) — zero texture image assets, zero extra requests
- **D-03:** Single dark theme only — no `prefers-color-scheme` light variant; one palette to prove contrast for
- **D-04:** Base surface = warm brown-black (aged leather/ink, sepia tint); primary accent = antique gold/parchment; exactly one secondary accent (agent picks aged-map teal OR terracotta). Exact hexes + contrast math (4.5:1 body text, 3:1 large text/UI) proven at design time and recorded in plans
- **D-05:** Serif display headings + sans body via system font stack (no webfont CDN)
- **D-06:** Decoration subtle/restrained — low-opacity texture, hairline rules, small compass/star motifs; content stays the hero
- **D-07:** Play Store CTA = official "Get it on Google Play" badge (dark variant PNG, hosted locally, `rel="noopener"`)

### Hero & marketing copy
- **D-08:** Playful tone — fun-first game voice ("travel through time" energy), casual player-facing language
- **D-09:** Copy workflow: agent drafts all copy now from the app README + known Play-listing facts; owner reviews after execution, not before
- **D-10:** Hero app icon pulled from the app repo (`C:\Users\Familia\antigravity\GeoHist-Trivia` launcher/play-store asset) into `/geohist/` as PNG
- **D-11:** Minimal hero: icon + app name + tagline + one short description paragraph + Play badge — tight, above-the-fold, phone-first. No fact chips, no screenshots in hero

### Page structure & navigation
- **D-12:** About-the-developer section lives on `/geohist/` landing (near FAQ); hub intro paragraph already carries the Persano brand
- **D-13:** Screenshot gallery ships as skeleton now: section heading + copy + placeholder tiles with `data-i18n` keys; Phase 5 swaps tiles for real WebP screenshots — markup stable, keys baked once
- **D-14:** Light header nav on `/geohist/` pages (Game · Guide · FAQ · Privacy); hub stays link-card minimal; footer keeps privacy link on every page (CMPL-01)
- **D-15:** Hub = grid-ready single app card — styled so card #2 slots into a grid later; no visible placeholder cells (CONT-04)

### FAQ & guide
- **D-16:** Extended FAQ set (~6–8 questions): required three (data collection, offline capability, supported devices) + Remove Ads IAP, available languages, where progress is saved, how to report a problem
- **D-17:** CMPL-04 wording mirror = verbatim on data: FAQ answers reuse the policy's exact phrases for anything data-related (SDK names, retention, contact email); casual tone allowed elsewhere
- **D-18:** FAQ interaction = native `<details>`/`<summary>` accordions — no JS, keyboard-accessible, i18n-swap-safe
- **D-19:** `guide.html` concise: how-to-play basics + game modes overview, ~1–2 screens; deep walkthroughs deferred until needed

### i18n key conventions (baked into all Phase 2 markup)
- **D-20:** Page-prefixed dotted keys, per-element: `geohist.hero.tagline`, `hub.intro.1`, `guide.modes.title`. `data-i18n` for text nodes, `data-i18n-attr` for attributes (alt, aria-label, placeholder). Phase 3 dictionaries map 1:1
- **D-21:** Key everything user-visible: headings, paragraphs, list items, link labels, buttons, alt text, aria-labels, FAQ answers, guide body — whole pages swap cleanly in Phase 3

### Placeholders & footer
- **D-22:** Play badge href = real package URL `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` now — 404s until listing goes live; launch-day swap requires zero code change (LNDG-04)
- **D-23:** Gallery placeholder tiles: phone-aspect, dark antique frames, subtle map-texture fill, small compass motif, caption "Screenshots coming soon" (keyed)
- **D-24:** Footer = minimal four: privacy link · contact email · Back to hub (on `/geohist/` pages) · © Persano — Santiago David Postorivo. Slot reserved for language switcher (Phase 3) and consent banner hooks (Phase 4)

### the agent's Discretion
- Exact hex values for the palette + which secondary accent (teal vs terracotta), with contrast math shown in plans
- Serif/sans system font picks within the system-stack constraint
- Section order on the landing page below the hero
- Compass/star motif SVG design and texture implementation details
- FAQ order and guide page section layout

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & scope
- `.planning/ROADMAP.md` §Phase 2 — goal, requirements list, 5 success criteria
- `.planning/REQUIREMENTS.md` — LNDG-01/02/04/05, CONT-01/02/03/04, CMPL-04 definitions; Out of Scope table
- `.planning/PROJECT.md` — brand facts, constraints (plain HTML/CSS, system fonts, mobile-first), Content source path

### Wording single-source (CMPL-04)
- `geohist/privacy.html` — authoritative wording for all data claims: SDK names (AdMob, Play Games Services, Play Billing, Firebase Analytics, contact-form Firestore), retention sentence, contact email, entity name. FAQ data answers copy phrases verbatim from here

### Locked prior decisions
- `.planning/STATE.md` §Accumulated Context — i18n = JS dictionary swap (data-i18n + JSON, no per-language subdirs); consent load-gating; form works after any consent choice; privacy facts verbatim (santiagopostorivo@gmail.com; entity "Persano, the personal brand of Santiago David Postorivo"; retention "Messages are deleted after they are handled")

### Content source (external)
- `C:\Users\Familia\antigravity\GeoHist-Trivia` — app README (feature-list source, LNDG-02), launcher/play-store icon asset, game modes + feature facts

### Superseded-doc warning
- `AGENTS.md` / embedded STACK.md §7 — its i18n section (per-language subdirs `/es/`, `/pt/`, hreflang, redirect script) is **STALE**. The locked decision (REQUIREMENTS.md Out of Scope + STATE.md) is JS dictionary swap via `data-i18n` + JSON. Do not follow the STACK.md i18n approach; SEO tooling guidance there still applies to Phase 5 only

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `css/base.css` — custom-properties token structure (`--color-*`, `--font-*`); Phase 2 swaps light token values for the dark antique set, keeps token architecture; add typography/display + texture utilities + component classes (cards, badge, accordion, header nav)
- `geohist/privacy.html` — page scaffolding pattern (head meta, `/css/base.css` link, `<main>`+`<footer>`) and the CMPL-04 wording source
- `index.html` — hub skeleton to expand into full hub (brand intro + app card)
- `404.html` — self-contained by design; leave as-is (no shared CSS dependency), link targets unchanged

### Established Patterns
- Static HTML per page, absolute-root asset paths (`/css/base.css`), `rel="noopener"` on external links, footer on every page — new pages follow the same shape
- No JS anywhere yet — Phase 2 adds no JS (FAQ uses `<details>`, gallery static); first JS lands Phase 3 (i18n engine)

### Integration Points
- Footer gains a language-switcher slot (empty/hidden until Phase 3) and later consent hooks (Phase 4) — mark up with reserved container now
- All new markup carries `data-i18n`/`data-i18n-attr` keys per D-20 so Phase 3 dictionaries drop in with zero HTML edits
- Play badge href (D-22) is the single swap point for listing day
- Header nav + footer must keep `404.html`'s "Back to the hub" and privacy links consistent (CMPL-01 regression-checked in CI)

</code_context>

<specifics>
## Specific Ideas

- Dark antique + subtle map atmosphere is the visual anchor: "aged parchment on warm brown-black leather/ink", gold accents, compass motifs — restrained, not illustrated-poster
- Official Google Play badge (dark variant) specifically chosen over a custom CTA button
- FAQ data answers must quote the policy verbatim — the owner treats the policy as the single source of truth for data claims
- Hub must render perfectly with exactly one app — no empty grid cells, no "more apps coming" placeholders

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (Deep guide walkthroughs noted in D-19 as "add later if needed" — same phase, optional depth, not a new capability.)

</deferred>

---

*Phase: 2-GeoHist Landing + Hub Content (EN, i18n keys baked in)*
*Context gathered: 2026-09-02*
