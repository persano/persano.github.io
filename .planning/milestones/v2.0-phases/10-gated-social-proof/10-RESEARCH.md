# Phase 10: Gated Social Proof - Research

**Researched:** 2026-09-10
**Domain:** Landing-page credibility strip + gated rating display (i18n-keyed markup, JSON-LD policy compliance) on a zero-build static site
**Confidence:** HIGH (policy verified live this session; all integration claims verified against the actual files this session; all prior settled decisions carried forward as citations)

<user_constraints>

## User Constraints (from CONTEXT.md — 10-CONTEXT.md, copied verbatim)

### Locked Decisions

**Facts strip (SEO-05)**
- **D-01:** Strip is a **stat pills row** — 3–4 compact icon+text blocks in a flex row that wraps on mobile. It is a **new section between the hero and the features section** (`geohist/index.html` after line 70), first content seen after the install CTA. — Reversibility: reversible — one section + one CSS block; removal costs nothing downstream.
- **D-02:** Strip carries exactly **4 facts**: "20 languages", "Play offline", "History + Geography", "Android 7.0+". Copy style is **short stats** (stat-first, pill-shaped), not mini-sentences. Android 7.0+ is already FAQ-verified (`geohist/index.html:136-137`).
- **D-03:** Pills are **static (non-interactive)** — no anchor links to proof points; the strip is a trust band, not navigation. Accessibility shape: keyed `aria-label` on the section (nav-aria pattern, line 51) + a plain `<ul>`; **no visible h2** — the keyed aria-label carries the name, keeping the existing h2 rhythm (features/gallery/faq) unbroken. Layout: **flexbox with gap + wrap**; RTL mirroring comes free via the existing `[dir="rtl"]` block (flex row order flips automatically).

**Tier-1 gated proof row (SEO-06)**
- **D-04:** Row ships **OFF as `<div hidden>`** with its i18n keys **already live in all 19 dictionaries** (not commented-out markup). The unkeyed number span holds **placeholder `0.0`** while OFF — if `hidden` were ever lost, the row self-flags as obviously wrong instead of looking like a real number. Owner flip = remove `hidden` + edit ONE number in `index.html`; **zero dictionary churn at flip**. — Reversibility: flip is one attribute + one number; rollback = re-add `hidden`.
- **D-05:** Row sits **directly under the hero Play badge CTA** (inside the hero section) — rating proof hugs the install action, the classic store-page pattern. Content: **inline-SVG star (stroke, currentColor)** + whole row is **one `<a rel="noopener">`** to the Play listing. Numbers slot in as **keyed template fragments around ONE unkeyed number span** (e.g., `<i18n>Rated</i18n> <span>X.X</span> <i18n>★ on Google Play</i18n>`) — fragment split chosen per-language-safe by the agent (CJK word order is the known tradeoff). **Rating only, no count** — fewer numbers to fill, less staleness.

**Tier-2 aggregateRating (SEO-07)**
- **D-06:** `aggregateRating` stays **permanently OFF**; the never-mirror-Play-ratings rule is absolute (Google review-snippet policy bars aggregating other-site ratings even when real — Pitfall 9). The commented template + precondition note live in an **HTML comment outside the JSON-LD `<script>`** — served schema stays byte-identical to today's (no `aggregateRating` anywhere in served output, no parser ambiguity from comments inside the script). Precondition documented both in-file and in the runbook (D-07).

**Owner flip runbook + validation**
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. Standing items from STATE.md remain external to this phase: Play listing live date gates the SEO-06 flip (owner-pending privacy-URL field), selector-page removal + GeoHist-as-home (post-phase backlog), FIRE-10 enforcement flip (post-monitoring).

**Also out of scope per CONTEXT domain + REQUIREMENTS Out-of-Scope table:** hub page (`index.html` root), rating-count display, fetching/mirroring Play data at runtime, translating changelog entries, any new pages or sitemap entries, the owner flip itself (runbook documents, owner executes), aggregateRating mirroring Google Play ratings (permanent exclusion), fabricated ratings/placeholder reviews.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-05 | Facts-based social proof strip on landing page (20 localizations, offline-capable, game modes) — verifiable facts only, no fabricated ratings | Strip skeleton + all four facts' on-site verification lines (§Facts Verification Table); i18n keying via existing engine; keyed aria-label precedent |
| SEO-06 | Tier-1 gated proof row ("Rated X.X ★ on Google Play" visible text + attributed link) — template ships off; owner flips when Play listing is live with real ratings | `<div hidden>` mechanics + the keycheck-gate finding (hidden-markup keys still enter the CI surface → keys must land in all 19 dicts atomically); keyed-fragment-around-number-span shape; `[hidden]` CSS insurance trap |
| SEO-07 | aggregateRating JSON-LD (Tier-2) stays permanently off unless an on-site review source exists — documented precondition | Live-fetched Google review-snippet policy (verbatim quotes this session); byte-identical served JSON-LD; HTML comment placement outside `<script>`; runbook precondition text |

</phase_requirements>

## Summary

This is a **pure additive-markup phase** on one file (`geohist/index.html`) plus one CSS block, ~7 i18n keys across 19 dictionaries, and one owner-facing runbook. No new runtime or dev dependencies, no script edits, no sitemap/robots/smoke-check changes, no new pages. Everything rides four existing, verified mechanisms: the keyed-node i18n engine (`js/i18n.js`), the exact-set-equality keycheck gate (`scripts/i18n-keycheck.mjs`), the existing JSON-LD block (already rich-result-shaped with `offers.price`), and the section/styling conventions of `css/base.css`.

**The load-bearing discovery of this research:** the keycheck gate extracts `data-i18n` keys from **raw HTML text with no visibility filter** — keys inside a `<div hidden>` Tier-1 row still enter the CI key surface. This is exactly what makes D-04 work ("keys already live in all 19 dictionaries"): if the markup lands and the dictionary edits don't, CI goes red, not the live site. Conversely, the planner MUST plan the ~7 new keys and the markup in the **same atomic commit** (Phase 6 precedent: atomic key-surface moves, red-gate proven). A second load-bearing trap: if the Tier-1 row's CSS class sets `display: flex` (or any display), it overrides the UA `[hidden] { display: none }` rule and the row **renders with the `0.0` placeholder** — the stylesheet already carries an insurance pattern for exactly this (`base.css:411-414`); the plan must include the `.proof-row[hidden] { display: none }` restatement.

The policy foundation (SEO-07) was re-verified live this session against Google Search Central's review-snippet guidelines: **"Don't aggregate reviews or ratings from other websites"** + the visibility rule (marked-up `AggregateRating` must be visible on the page) + the manual-action warning. The self-serving-review *extra* rules are scoped to `LocalBusiness`/`Organization` only — but the don't-aggregate rule alone makes Play-sourced markup illegal forever, which is why Tier-1 (visible, attributed link, zero markup) is the sanctioned path and Tier-2 ships as a documented, permanently-OFF precondition in an HTML comment outside the JSON-LD script.

**Primary recommendation:** Build three artifacts in one phase, ordered: (1) facts strip section + `.proof-*` CSS block between hero and features (4 pills, keyed, static, aria-labeled, no visible h2); (2) Tier-1 `<div hidden>` row under the badge CTA with keyed fragments around one unkeyed `0.0` span — same commit as the 19-dictionary key move; (3) `10-RUNBOOK.md` documenting the flip, evidence gate, Rich Results Test ritual, rollback, and session-convention refresh — plus the Tier-2 HTML comment adjacent to the JSON-LD block.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Facts strip display (SEO-05) | Static HTML (served) | CSS (layout), i18n dictionaries (text) | Zero-build static markup; no JS — text rides the existing dictionary-swap pass |
| Tier-1 gated proof row (SEO-06) | Static HTML (served, `hidden`) | i18n dictionaries, owner flip action | Gate is authoring-time state (`hidden` attribute), not JS; owner flip = one attribute + one number |
| Tier-2 aggregateRating (SEO-07) | HTML comment (served, inert) | `10-RUNBOOK.md` (precondition doc) | Never-served-as-markup; documented OFF; zero runtime surface |
| Rating text translation | i18n dictionaries + engine | — | Keyed fragments around one unkeyed number span; engine `textContent`-only contract preserved |
| Owner flip + validation ritual | Human (owner) via runbook | Rich Results Test (external web tool) | Zero-build CI cannot run Google's validator (D-08); evidence gate is owner eyeball (D-07) |

## Standard Stack

### Core

**No new dependencies — nothing to install.** [VERIFIED: package.json scripts + devDependencies read this session; STACK.md §(e) "No new libraries"; the entire phase is HTML/CSS/JSON edits]

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Hand-authored HTML/CSS | platform | Strip section, hidden row, CSS block | Zero-build constraint (AGENTS.md); every existing section follows it |
| `js/i18n.js` engine (existing) | in-repo | Keyed text + aria-label swap for pills, strip label, Tier-1 fragments | Snapshot/`textContent` engine already handles every needed node shape — verified this session |
| `scripts/i18n-keycheck.mjs` (existing) | in-repo | CI gate that forces the atomic key move | `geohist/index.html` already in `pages` array — zero script edits |
| Google review-snippet policy | external doc | Compliance floor for SEO-07 | Live-verified this session |

### Alternatives Considered (all pre-rejected by locked decisions — listed to prevent relitigating)

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `<div hidden>` Tier-1 gate | JS runtime gate / commented-out markup | JS gate = crawler-visible fake stars (worst of both, FEATURES.md Area D); commented markup = zero dictionary coverage, fails D-04's zero-churn flip |
| HTML comment for Tier-2 template | Commented-out JSON inside the `<script>` | Parser ambiguity risk + accidental uncomment makes served schema drift; D-06 explicitly forbids |
| Runtime Play-data fetch | Static hand-entered rating | No official endpoint, ToS-gray scrape, runtime dependency — STACK.md "What NOT to Use" |
| Visible h2 for the strip | Keyed `aria-label` on section | D-03 locks no-visible-h2 to preserve the h2 rhythm; aria-label precedent exists at `index.html:51` |

## Package Legitimacy Audit

**This phase installs zero external packages** (runtime or dev). No npm installs, no CDN additions, no new script tags. The audit is therefore trivially empty:

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| *(none)* | — | — | — | — | — | Nothing to audit |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### Current-State Integration Map (all line refs verified by reading the files this session)

| # | Surface | Today (verified) | Phase 10 change |
|---|---------|------------------|-----------------|
| 1 | `geohist/index.html:60-70` | Hero section: icon, copy, `badge-cta` anchor (`:67-69`) | Tier-1 `<div hidden>` row inserted after `</a>` of `.badge-cta`, before `</section>` (`:70`) |
| 2 | `geohist/index.html:72` | `<section class="features">` starts | New `<section class="proof-strip">` inserted between line 70 and 72 |
| 3 | `geohist/index.html:20-40` | JSON-LD `SoftwareApplication` block with `offers.price` (`:38`) + Play `sameAs` (`:37`) | HTML comment (Tier-2 template + precondition) placed adjacent, **outside** the `<script>` (before `:20` or after `:40`) |
| 4 | `css/base.css` | Section conventions (`.features:164`, `.feature-group:168`, texture rules `:377-392`) | One new `.proof-strip` / pill / Tier-1 row CSS block + `[hidden]` insurance |
| 5 | `js/i18n/*.json` (19 files × 171 keys — counts verified per-file this session) | 171-key surface | Atomic move to ~178 (+4 pills, +1 strip aria, +2 Tier-1 fragments; planner pins exact count) |
| 6 | `scripts/i18n-keycheck.mjs:38` | `pages` array already contains `geohist/index.html` | **Zero edits** |
| 7 | `scripts/smoke-check.sh:25-36` | URL status list | **Zero edits** (no new URLs; verified: landing URL unchanged, no new pages/sitemap entries) |
| 8 | `.planning/phases/10-gated-social-proof/10-RUNBOOK.md` | (new file) | Owner flip doc, 08-RUNBOOK structural pattern |

### Verbatim code facts the plan depends on (in-repo provenance)

- Keycheck pages array — `scripts/i18n-keycheck.mjs:38`, verbatim:
  `const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];`
- Keycheck extraction is visibility-blind — `scripts/i18n-keycheck.mjs:61` regex, verbatim: `/data-i18n(?:-attr)?="([^"]*)"/g` applied to the raw HTML string (`extractKeys`, `:59-79`). No `hidden`-filter exists → **keys in hidden markup are CI-load-bearing**.
- Keycheck exact-set-equality — `:139-148`: `missing` + `extra` arrays both fail the run; PASS line names the surface size.
- CJK punctuation gate — `scripts/i18n-keycheck.mjs:44,47`, verbatim: `const CJK_PUNCT = /[,!?:;()"]/;` scoped `PUNCT_LANGS = new Set(['ja.json', 'zh.json'])`; period exception `const PERIOD_BETWEEN_DIGITS = /\d\.\d/g;` (digit.digit allowed, loose period fails).
- Keyed-node plain-text contract — `js/i18n.js:9-11` header, verbatim: *"swaps keyed text and attributes in place — textContent and setAttribute ONLY, because keyed nodes carry plain text by the Phase-2 contract (no markup-parsing DOM assignment anywhere)"*. Engine selects `[data-i18n], [data-i18n-attr]` nodes (`:53`) — **hidden nodes are snapshotted too** (`captureSnapshot` has no visibility filter), so a hidden Tier-1 row is translated live in all 19 languages the moment dictionaries land, and the owner flip needs zero dictionary work.
- Keyed aria-label precedent — `geohist/index.html:51`, verbatim: `<nav class="site-nav" aria-label="GeoHist site navigation" data-i18n-attr="aria-label:geohist.nav.aria" data-i18n-attr-only>` — the exact shape D-03 requires for the strip section.
- Badge CTA precedent (Tier-1's sibling + link style) — `geohist/index.html:67-68`: `<a class="badge-cta" href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">` — same Play URL reused by the Tier-1 row.
- Play URL in JSON-LD — `geohist/index.html:37`: `"sameAs": "https://play.google.com/store/apps/details?id=com.persano.geohisttrivia"`.
- JSON-LD offers — `geohist/index.html:38`, verbatim: `"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }` — the rich-result-eligibility shape already ships (CITED: STACK.md §(e)).
- `[hidden]` CSS insurance precedent — `css/base.css:411-414`, verbatim:
  ```css
  /* author display beats [hidden] UA style — must restate the rule */
  .consent-banner[hidden] {
    display: none;
  }
  ```
- `[dir="rtl"]` block empty by design — `css/base.css:591-593`, verbatim:
  ```css
  [dir="rtl"] {
    /* intentionally empty — seed point for the RTL screenshot battery */
  }
  ```
  Flex row order flips automatically with `dir` — D-03's "RTL mirroring comes free" is verified real.
- Texture rule — `css/base.css:12` header comment: "Texture utilities are decoration-only: never behind body copy (Pattern 4)"; `:246` `.tile-caption` comment: "solid strip: texture never sits behind this copy" — the strip must sit on solid `--color-surface`/`--color-bg` tokens only.
- Contrast pairs pre-verified — `css/base.css:4-11` (e.g., `#c9b89a on #1a1410 9.38:1`, `#d9a951 on #1a1410 8.46:1`) — pill text colors must come from these existing pairs, not new tokens.
- Language facts basis — `js/i18n.js:28-36` SUPPORTED array (20 entries: en + 19), verbatim group structure: `'en', 'es', 'pt-BR',` / `'fr', 'de', 'it', 'nl', 'pl', 'tr', 'vi', 'id',` / `'ru',` / `'el',` / `'hi', 'bn',` / `'ar', 'ur',` / `'ja', 'ko', 'zh'`.
- CI chain — `package.json` `validate` script: `npm run validate:html && npm run validate:domain && npm run validate:links && npm run validate:i18n-detect && npm run validate:i18n`; `validate:html` = `html-validate index.html 404.html geohist/*.html` (covers the edited file); `validate:links` already skips `play.google.com` (the Tier-1 link is pre-covered — zero CI edits).

### External policy facts (live-fetched this session — HIGH)

From `developers.google.com/search/docs/appearance/structured-data/review-snippet`, fetched 2026-09-09:

- Verbatim: **"Don't aggregate reviews or ratings from other websites."** [VERIFIED: review-snippet doc, live fetch 2026-09-09] — this alone permanently bars Play-sourced `aggregateRating` (SEO-07's foundation).
- Verbatim: *"Make sure the review content you mark up are readily available to users from the marked-up page. … If you use `AggregateRating`, users should be able to see that aggregate rating on the page."* [VERIFIED: same fetch] — invisible markup is a violation regardless; the permanently-OFF Tier-2 cannot "pre-stage" values.
- Verbatim: *"If your site violates one or more of these guidelines, then Google may take manual action against it."* [VERIFIED: same fetch] — the manual-action risk is real and stated.
- Verbatim: *"If the review snippet is for a local business or an organization, you must follow these additional guidelines"* (self-serving rules incl. "Ratings must be sourced directly from users"). [VERIFIED: same fetch] — self-serving scope is `LocalBusiness`/`Organization`; `SoftwareApplication` is outside that clause (consistent with CITED: `.planning/research/STACK.md` §(e) and FEATURES.md Area D).
- Verbatim (JSON-LD example in the same doc): `"aggregateRating": { "@type": "AggregateRating", "ratingValue": 88, "bestRating": 100, "ratingCount": 20 }` — field names `ratingValue`/`ratingCount`/`bestRating` verified live. [VERIFIED: same fetch] Required-property rule (`ratingValue` + `ratingCount`|`reviewCount`): CITED: `.planning/research/FEATURES.md` Area D.
- Verbatim: *"For decimal numbers, use a dot instead of a comma to specify the value (for example `4.4` instead of `4,4`)"* [VERIFIED: same fetch] — applies to the future Tier-2 `ratingValue` if it ever existed; also a clean convention for the Tier-1 visible number.

### Recommended Project Structure (delta only)

```
geohist/
├── index.html              # + strip section, + Tier-1 hidden row, + Tier-2 HTML comment
css/
├── base.css                # + .proof-strip / pill styles + .proof-row[hidden] insurance
js/i18n/
├── {19 × lang}.json        # + ~7 keys each, SAME commit as index.html (171 → ~178)
.planning/phases/10-gated-social-proof/
├── 10-RUNBOOK.md           # owner flip doc (new)
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Translation of the new keys | Custom per-language templating, JS-side string building | Existing `data-i18n` keyed-node engine + 19 flat dictionaries + keycheck gate | The gate makes dictionary drift impossible; hand-rolling any new text mechanism forks the key surface |
| The OFF/ON gate | JS feature flag, localStorage toggle, CMS | `<div hidden>` attribute + owner one-line flip | Authoring-time state; zero JS; crawler-truthful (nothing renders); D-04 locked |
| Star icon | Icon font, CDN icon library, unicode-only text star | Inline SVG, 24px stroke, `currentColor` (D-09) | Zero third-party bytes; theme-consistent; owner-vetoable |
| Structured-data validation in CI | A hand-rolled schema validator, new npm dep | Runbook ritual: Google Rich Results Test + `node -e "JSON.parse(...)"` parse check (D-08) | Zero-build CI cannot run Google's tool; the JSON-LD is static and pre-ship checked |
| Play rating retrieval | Scraper, Google API client, runtime fetch | Owner eyeballs the Play page, enters the number once (D-07 evidence gate) | No official lightweight endpoint; ToS-gray; runtime dependency — pre-rejected in STACK.md |

**Key insight:** every mechanism this phase needs already exists and is CI-enforced. The phase's failure mode is not missing capability — it is **editing `index.html` without the 19 dictionary edits in the same commit** (gate goes red, correct outcome) or **styling the hidden row with a `display` rule** (gate stays green, row renders with `0.0` — wrong outcome). Both are mechanical, and both have named preventions below.

## Common Pitfalls

### Pitfall 1: The `[hidden]` display-override trap — row renders with `0.0` while "OFF"
**What goes wrong:** The Tier-1 row will want `display: flex` (or `inline-flex`) for its star+text layout. Author CSS sets it on the class → the class rule beats the UA's `[hidden] { display: none }` → the "OFF" row renders fully visible in every language, showing "Rated 0.0 on Google Play" until the owner flips. The `0.0` placeholder self-flags (D-04's intent) but the row should never render while OFF.
**Why it happens:** This exact bug already bit the site twice — `base.css:411-414` (`consent-banner`) and `:508-510` (`form-status`) both carry restated `[hidden]` insurance rules with comments calling it out ("author display beats [hidden] UA style — must restate the rule").
**How to avoid:** Every new class that sets `display` and can coexist with `hidden` gets the insurance restatement in the same CSS block: `.proof-row[hidden] { display: none; }`. (Alternative: style only the inner spans and let the row keep UA display semantics — but the insurance restatement is the site's established pattern and survives future styling.)
**Warning signs:** Screenshot/Grep: `display:` on `.proof-row`/`.proof-strip` without a matching `[hidden]` restatement.

### Pitfall 2: Markup and dictionary edits split across commits → CI red, or dictionaries edited with values nobody sees
**What goes wrong:** Keycheck demands exact set equality across 19 dictionaries and the live markup surface. Landing the markup without the ~7 keys → `missing keys` FAIL ×19. Landing keys first → `extra keys` FAIL ×19. Also: because hidden-markup keys enter the surface, a "temporary commented-out row" is the only way to stage markup without keys — and that forfeits D-04's zero-churn flip.
**Why it happens:** The gate is exact-set, not superset (verified `:139-148` — `extra` keys fail as hard as `missing`).
**How to avoid:** One atomic commit: `index.html` + all 19 dictionaries (+ base.css). Phase 6 proved this shape ("key surface moved atomically… red gate proven both directions", STATE.md). Red-gate test in-plan: remove one new key from one dictionary locally → `npm run validate:i18n` must FAIL naming the file/key → restore → PASS.
**Warning signs:** Any plan task ordering dictionaries after the markup, or a "dictionary PR later" note.

### Pitfall 3: CJK punctuation gate rejects the new ja/zh values
**What goes wrong:** ja/zh Tier-1 fragments and pill values containing ASCII `, ! ? : ; ( ) "` fail the gate (`:44`); a loose ASCII period fails too (`:47-49`) — only `digit.digit` periods are allowed. A translator drafting "Google Playで、4.5★評価" with half-width comma, or EN-echo "on Google Play." with a trailing period, ships red.
**How to avoid:** Draft ja/zh values with full-width punctuation （，。！？「」） and no trailing ASCII period. The unkeyed number span means **no dictionary value ever contains the rating** — keep it that way (a `4.5` inside a ja value passes the digit.digit exception, but it would double-print next to the span). `★` (U+2605) is not in the ASCII punct set — safe everywhere, including ja/zh.
**Warning signs:** `i18n-keycheck: FAIL — ja.json: "geohist.tier1.*" contains half-width punctuation`.

### Pitfall 4: Tier-1 keyed fragments attached to the wrong node — the plain-text contract violation
**What goes wrong:** Putting `data-i18n` on the `<a>` row itself (it contains the number span → not plain-text) makes the engine **wipe the number span** on apply: `entry.el.textContent = text` replaces ALL children. Same class of bug: putting `data-i18n` on a pill `<li>` that contains the icon SVG — the SVG is erased for every non-EN visitor.
**Why it happens:** The engine is `textContent`-only by contract (`i18n.js:9-11`, verified); keyed nodes must be leaf text nodes.
**How to avoid:** Fragments go on **dedicated wrapper spans**: `<a …><span data-i18n="geohist.tier1.prefix">Rated</span> <span class="proof-row-score">0.0</span> <span data-i18n="geohist.tier1.suffix">on Google Play</span></a>`; pill markup = `<li><svg aria-hidden="true" …></svg><span data-i18n="geohist.proof.pill-1">20 languages</span></li>`. The snapshot walk keys the spans; the SVG and number span are untouched (verified engine behavior: only `[data-i18n]`-holding nodes are snapshotted/written).
**Warning signs:** Missing star/number after a language switch in manual testing; or `data-i18n` on any element that has element children.

### Pitfall 5: Per-language word order vs the fixed DOM slot order (the D-05 tradeoff)
**What goes wrong:** The DOM is fixed as `[prefix][NUMBER][suffix]`. Languages that put the rating phrase *before* the store name, or the number at the end, produce stilted text ("Rated 4.5 on Google Play" → ja must become "Google Playで[NUMBER]の評価" style). A literal prefix/suffix translation of EN produces unnatural copy in ja/zh/tr/vi in particular.
**How to avoid:** Treat prefix/suffix as **position-free fragments**, not sentence halves: each language drafts whichever two strings make `[prefix] 4.5 [suffix]` read naturally (07-CONTEXT D-07/D-08 two-pass drafting; per-language register table already locked from Phase 7). Examples that work in the fixed slot order: ja prefix "Google Playで" / suffix "★の評価"; zh prefix "在 Google Play 获" / suffix "★评分"; es prefix "Con" / suffix "estrellas en Google Play"; ar/ur fragments flow RTL and the number slot stays valid (Western digits are the site convention — brand Latin kept per Phase 7 precedent, STATE.md). **Never** solve word order by adding a third fragment or a second number span — one unkeyed span is the D-04 flip surface.
**Warning signs:** Draft review shows a language where the number would need to move to read naturally → re-draft the fragments, don't touch the DOM.

### Pitfall 6: Star glyph decision ambiguity — SVG star vs text `★` ×19
**What goes wrong:** D-05 lists both an inline-SVG star AND a `★`-bearing suffix example. If the text star ships in all 19 dictionaries AND the SVG ships, the row shows two stars; if dictionaries carry `★`, each language's placement relative to the number varies (fragile), and the glyph's weight in system fonts is inconsistent across scripts.
**How to avoid (agent-discretion recommendation, not a decision reversal):** the SVG star is the visual (D-09, stroke/currentColor); keyed suffix text stays **star-free** ("on Google Play"), so no dictionary carries `★` and per-language placement issues vanish. The D-05 fragment example remains satisfiable — the "★ on Google Play" suffix becomes "on Google Play" with the SVG star visually leading the row. If the planner instead keeps `★` in text values, drop the SVG from the suffix position and keep exactly one star. **Never both.** (Owner veto via D-09's pre-ship review covers the visual.)
**Warning signs:** Two star glyphs rendered in the flipped row mock; `★` present in any dictionary value while an SVG star also ships.

### Pitfall 7: Tier-2 comment drifts into the served schema
**What goes wrong:** Placing the commented `aggregateRating` template **inside** the JSON-LD `<script>` (JS-style `//` comments are invalid in JSON; parsers choke or Google flags) or an HTML-comment typo accidentally uncommenting served markup.
**How to avoid:** The template + precondition live in an `<!-- … -->` block adjacent to (outside) the `<script>` element (D-06). Keep the commented JSON as a plain HTML comment; no `--` sequences inside comment text (HTML comment grammar); served JSON-LD must remain **byte-identical to today's** — verify with `git diff` on the script block only.
**Warning signs:** `git diff geohist/index.html` shows any change between `<script type="application/ld+json">` and `</script>`; Rich Results Test parse error pre-ship.

### Pitfall 8: Facts strip claims drift from their on-site verification points
**What goes wrong:** "Verifiable on-site" (success criterion 1) decays: e.g., pill says "20 languages" while FAQ says something else, or future phases add a language without touching the pill.
**How to avoid:** Each pill's claim must have a live on-site anchor, verified this session (see Facts Verification Table below). The strip copy is keyed (`geohist.proof.pill-*`), so future wording edits are dictionary edits — the standing session convention (update proof + changelog together during app-version-fact sessions, D-07 refresh rule) keeps them in step.
**Warning signs:** Pill text vs FAQ text disagree in EN (dictionary drift is caught nowhere else — value-quality checks don't compare semantics).

### Facts Verification Table (every strip claim ↔ its on-site anchor, verbatim)

| Pill (EN draft) | On-site anchor (verified this session) | Verbatim quote |
|---|---|---|
| "20 languages" | FAQ languages answer — `geohist/index.html:144-146` | `<summary data-i18n="geohist.faq.languages.q">What languages is the game available in?</summary>` / `<p data-i18n="geohist.faq.languages.a">English, Spanish, Portuguese and 17 more languages.</p>` (= 4 + 17 = 20; also matches the 20-entry SUPPORTED array, `js/i18n.js:28-36`) |
| "Play offline" | Features offline group — `geohist/index.html:89-92` | `<h2 data-i18n="geohist.features.offline.title">Offline</h2>` / `<li data-i18n="geohist.features.offline.1">The core game requires no internet connection.</li>` (+ FAQ `:132-133` "Can I play offline? … works mostly locally (offline-first)") |
| "History + Geography" | Features trivia group — `geohist/index.html:77` | `<li data-i18n="geohist.features.trivia.1">Multiple game modes based on History and Geography — flags, capitals, maps, events and more.</li>` |
| "Android 7.0+" | FAQ devices answer — `geohist/index.html:136-137` | `<p data-i18n="geohist.faq.devices.a">GeoHist Trivia runs on Android 7.0 (API 24) or newer — no flagship phone required.</p>` |

## Code Examples

### Tier-1 gated proof row (SEO-06) — insertion point: inside `.hero`, after the `badge-cta` anchor (`index.html:69`)

```html
<!-- Source: D-04/D-05 + engine contract (js/i18n.js textContent-only) + [hidden] insurance precedent (base.css:411-414) -->
<a class="badge-cta" href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">
  <img src="/geohist/google-play-badge.png" alt="Get GeoHist Trivia on Google Play" width="194" height="75" data-i18n-attr="alt:geohist.cta.badge-alt" data-i18n-attr-only>
</a>
<div class="proof-row" hidden>
  <a href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">
    <svg class="proof-row-star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 2.5l2.95 6.32 6.92.63-5.22 4.59 1.54 6.78L12 17.2l-6.19 3.62 1.54-6.78-5.22-4.59 6.92-.63z"/>
    </svg>
    <span data-i18n="geohist.tier1.prefix">Rated</span>
    <span class="proof-row-score">0.0</span>
    <span data-i18n="geohist.tier1.suffix">on Google Play</span>
  </a>
</div>
```

Notes: the number span is **unkeyed** (owner edits `0.0` → real value at flip; engine never touches it). The keyed spans are leaf text nodes (engine-safe). One star total (SVG; suffix text star-free — see Pitfall 6). Whole row = one attributed link with `rel="noopener"` (D-05).

### Facts strip section (SEO-05) — insertion point: between `</section>` of hero (`index.html:70`) and `<section class="features">` (`:72`)

```html
<!-- Source: D-01/D-02/D-03/D-09; aria-label precedent = index.html:51 (nav-aria pattern) -->
<section class="proof-strip" aria-label="GeoHist at a glance" data-i18n-attr="aria-label:geohist.proof.aria" data-i18n-attr-only>
  <ul>
    <li>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" data-icon="globe">
        <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>
      </svg>
      <span data-i18n="geohist.proof.pill-languages">20 languages</span>
    </li>
    <li>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" data-icon="offline">
        <path d="M12 3v10"/><path d="M8 9l4 4 4-4"/><path d="M4 17a4 4 0 0 1 1-7.9A5.5 5.5 0 0 1 15.5 8 4.5 4.5 0 0 1 20 17"/>
      </svg>
      <span data-i18n="geohist.proof.pill-offline">Play offline</span>
    </li>
    <li>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" data-icon="modes">
        <path d="M12 21s-7-4.6-9.5-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.5 12C19 16.4 12 21 12 21z"/>
      </svg>
      <span data-i18n="geohist.proof.pill-modes">History + Geography</span>
    </li>
    <li>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" data-icon="android">
        <rect x="7" y="4" width="10" height="16" rx="2"/><path d="M11 17.5h2"/>
      </svg>
      <span data-i18n="geohist.proof.pill-android">Android 7.0+</span>
    </li>
  </ul>
</section>
```

Notes: glyphs are draft suggestions (D-09: agent-drafted, owner-vetoed). No visible h2 — the keyed `aria-label` names the section (keeps h2 rhythm unbroken, D-03). No anchors (D-03: trust band, not navigation). Pill count is exactly 4 (D-02).

### Tier-2 comment (SEO-07) — adjacent to the JSON-LD block, OUTSIDE the `<script>` (D-06)

```html
<!-- Source: D-06 + live-fetched review-snippet policy (2026-09-09) -->
<!--
  aggregateRating: PERMANENTLY OFF (SEO-07).
  Google review-snippet policy: "Don't aggregate reviews or ratings from other
  websites." Google Play ratings live on play.google.com — they may NEVER be
  copied into this page's structured data, even when real. Visible attributed
  display is the Tier-1 row above; markup is barred.
  Precondition to EVER add aggregateRating: a review/rating source collected
  on this site itself must exist (it does not today). Only then:
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": <on-site value>,  // decimal dot format: 4.4 (never 4,4)
      "ratingCount": <on-site count>
    }
-->
<script type="application/ld+json">
  … (existing block, byte-identical — untouched by this phase)
</script>
```

### CSS block sketch (agent-discretion styling; conventions from base.css)

```css
/* Source: base.css conventions — verified pairs (header 4-11), texture rule (12), [hidden] insurance (411-414) */
.proof-strip { margin-top: 1.5rem; }            /* matches .features/.gallery spacing (base.css:164,193) */
.proof-strip ul {
  list-style: none;
  display: flex;                                  /* flex row flips order under [dir="rtl"] automatically */
  flex-wrap: wrap;                                /* D-01: wraps on mobile */
  gap: 0.6rem 1.25rem;
  justify-content: center;
  margin: 0;
}
.proof-strip li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-muted);                      /* 9.38:1 on bg — verified pair */
  font-size: 0.95rem;
}
.proof-strip svg { color: var(--color-accent-2); } /* teal secondary, 9.30:1 */
.proof-row { text-align: center; }
.proof-row[hidden] { display: none; }            /* INSURANCE — mandatory (Pitfall 1) */
.proof-row a { color: var(--color-accent); font-size: 0.9rem; }
```

### Owner flip (documented in 10-RUNBOOK.md, not executed this phase)

```
1. Evidence gate: Play listing live AND a real aggregate rating visible on the
   Play page (owner eyeballs it — no minimum-count floor, D-07).
2. geohist/index.html: remove ` hidden` from <div class="proof-row" hidden>;
   replace <span class="proof-row-score">0.0</span> number with the real
   rating (decimal dot: 4.5).
3. Validate: npm run validate (gate chain) + Rich Results Test on the live URL
   after deploy + JSON-LD parse check (node -e "JSON.parse(...)").
4. Deploy; re-run scripts/smoke-check.sh (unchanged list — no new URLs).
Rollback: re-add ` hidden`. Zero dictionary churn in either direction (D-04).
Refresh rule: update the number during any agent session touching app-version
facts (rides the Pitfall 9.4 changelog-freshness convention).
```

### i18n drafting process for the ~7 keys (rides Phase 7 machinery, no new process)

Per CITED: `.planning/phases/07-localization-20-rtl/07-CONTEXT.md` D-06/D-07/D-08: register table (locked from Phase 7 — re per language), app-`strings.xml` glossary for terms ("offline", "languages", "Google Play" brand stays Latin in all 19 — Phase 7 precedent, STATE.md), two-pass drafting (pass 2 = fresh critique pass), owner spot-check on languages the owner reads. One wave suffices at ~7 keys × 19 languages (~133 strings); red-gate + `npm run validate:i18n` per the atomic-commit rule. ja/zh values must clear the CJK punct gate (Pitfall 3).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Gate = "real Play ratings exist" (v1 wording) | Split gates: Tier-1 visible attributed link (Play source OK *visibly*, never in markup) + Tier-2 markup gated on on-site review source | Established in v2 research (PITFALLS.md Pitfall 9); reconfirmed by policy fetch this session | SEO-06 flip precondition is "listing live + real rating visible"; SEO-07 precondition is "on-site review source exists" — two different triggers, both documented |
| Commented-out JSON-LD as gate | `aggregateRating` never ships in any form; HTML comment documents the permanent OFF | This phase's D-06 | Served schema byte-stable; no parser ambiguity |
| Star display | One star only, exactly one representation (SVG recommended) | This research (Pitfall 6) | No double-star rendering; no ×19 glyph placement fragility |

**Deprecated/outdated for this phase:** none — no dependencies change.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `★` text star can be dropped from the keyed suffix values in favor of the SVG star (D-05 names both; framed as agent-discretion per the per-language-safe clause) | Pitfall 6 / Code Examples | Cosmetic: row shows zero or two stars depending on choice — caught by the D-09 owner-veto pre-ship review |
| A2 | SVG glyph paths in the code examples are reasonable drafts, not final art (owner veto is the gate, D-09) | Code Examples | Cosmetic only |
| A3 | Western digits + decimal dot in the visible rating number for all 19 locales (no per-locale number formatting keys) | Pitfall 5 / Owner flip | Cosmetic inconsistency in e.g. de (expect "4,5") — acceptable and documented; JSON-LD rule (dot) unaffected since markup never ships |
| A4 | Register choices for the ~7 new keys inherit the Phase 7 locked register table verbatim | i18n drafting process | If a register table entry was superseded, wave-level redraft of ≤7 keys — cheap |

## Open Questions

1. **Does the strip get the muted or the foreground color for pill text?**
   - What we know: both `--color-muted` (9.38:1) and `--color-fg` (14.72:1) pass AA; D-01 says compact/quiet.
   - What's unclear: visual weight vs the hero's tagline teal (`--color-accent-2`).
   - Recommendation: planner pins; agent-discretion styling per CONTEXT; owner veto covers.
2. **`★` in text values vs SVG-only star** (A1) — planner pins; owner veto is the real gate (D-09).
3. **Exact key count** — CONTEXT suggests ~7 (`geohist.proof.aria` + 4 pills + `geohist.tier1.prefix` + `geohist.tier1.suffix` = 7, matching the 171→178 move); planner pins the exact names.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Google Rich Results Test (`search.google.com/test/rich-results`) | D-08 manual ritual (pre-ship + at flip) | ✓ (free web tool, no login required for URL/code testing) | — | `node -e` JSON.parse parse check (zero-dep sanity); Schema Markup Validator as secondary |
| Google Play listing (real aggregate rating) | SEO-06 flip evidence gate (owner, future — NOT this phase) | ✗ — gated externally (STATE.md blocker: owner-pending Play privacy-URL field) | — | Phase ships with row OFF; flip is owner-runbook work |
| Node (for keycheck + parse check) | CI gate + pre-ship ritual | ✓ | v26.5.1 (this session) | — |
| `npm run validate` chain (html-validate 11.12.0, linkinator 8.1.0, keycheck) | Every commit | ✓ (verified scripts this session) | — | — |

**Missing dependencies with no fallback:** none blocking this phase (the Play listing gates only the owner's future flip, by design).
**Missing dependencies with fallback:** n/a.

## Phase Verification Map (CI + manual gates — nyquist_validation is off in config; kept as research notes, not the Validation Architecture section)

| Gate | Command | Covers | Status this phase |
|------|---------|--------|-------------------|
| HTML validity | `npm run validate:html` (html-validate 11.12.0, glob `geohist/*.html`) | New section/row markup | Existing, zero edits |
| Key parity + value quality | `npm run validate:i18n` | Atomic 171→~178 move ×19; CJK punct | Existing, zero script edits; red-gate test in-plan |
| Old-domain scan / links | `npm run validate:domain` / `validate:links` (play.google.com already skipped) | Tier-1 link | Existing, zero edits |
| JSON-LD integrity | `git diff` on the `<script>` block (must be empty) + manual Rich Results Test + `node -e "JSON.parse(...)"` | SEO-07 byte-identical requirement | Manual ritual (D-08), documented in runbook |
| Smoke | `scripts/smoke-check.sh` post-deploy | URL list unchanged | Zero edits (verified: no new URLs) |

## Sources

### Primary (HIGH confidence)
- **Live fetch 2026-09-09:** Google Search Central — Review Snippet (Review, AggregateRating) guidelines, `developers.google.com/search/docs/appearance/structured-data/review-snippet` — verbatim policy quotes above (don't-aggregate, visibility, manual action, self-serving scope, decimal dot, AggregateRating example fields). Digest cached via research-store (keys `ac617a8a…`, `d41d327c…`).
- **Repo files read this session (VERIFIED with line refs):** `geohist/index.html` (all quoted lines), `js/i18n.js`, `scripts/i18n-keycheck.mjs`, `css/base.css`, `scripts/smoke-check.sh`, `package.json`, `js/i18n/*.json` (19 files × 171 keys counted), `.planning/config.json`.
- `.planning/research/STACK.md` §(e) — SoftwareApplication eligibility shape, self-serving nuance, gate mechanics, "what NOT to use" (CITED; its Google sources were live-verified 2026-09-05 and re-verified today).

### Secondary (MEDIUM/HIGH)
- `.planning/research/PITFALLS.md` Pitfall 9 (+9.4 freshness pattern), Pitfall 10 (keycheck blind spots) — CITED (its Google guideline facts re-verified live today).
- `.planning/research/FEATURES.md` Area D — Tier-1/Tier-2 split, anti-features table (invisible markup, fabricated stars, Review-item markup) — CITED.
- `.planning/research/ARCHITECTURE.md` §5 — one-JSON-block integration, additive edit, no sitemap/CI change — CITED.

### Tertiary (LOW)
- Prior-phase context patterns (08-RUNBOOK structure, 09-RUNBOOK revision-note pattern, 07-CONTEXT drafting process) — read this session from the actual files; the *patterns* are conventions, not external facts.

## Metadata

**Confidence breakdown:**
- Standard stack (no new deps): HIGH — verified against package.json + every referenced script this session.
- Integration points & line refs: HIGH — every claim above was read from the file this session with verbatim quotes.
- Google policy (SEO-07 foundation): HIGH — live-fetched 2026-09-09 with verbatim quotes; cross-consistent with two prior verified research docs.
- i18n drafting quality (19-language values): MEDIUM — mechanical gates catch parity/punctuation, not register quality; mitigated by the Phase 7 two-pass process (CITED).
- Styling/visual outcome: MEDIUM — conventions verified, but aesthetics are owner-veto territory (D-09) by design.

**Research date:** 2026-09-10
**Valid until:** ~2026-10-10 (static repo + stable Google policy; re-check review-snippet doc only if the flip ritual ever runs long after this phase)
