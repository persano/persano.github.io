# Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in) - Research

**Researched:** 2026-09-02
**Domain:** Static HTML/CSS content build — dark antique theme, mobile-first landing/hub/guide pages, native-HTML FAQ, i18n-ready markup
**Confidence:** HIGH (no external packages, no JS, all patterns platform-native or already proven in-repo)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Visual style (site-wide):**
- **D-01:** Dark antique theme replaces Phase 1 light cream as the site-wide direction — costly to reverse (palette/texture live in `css/base.css` shared by every page)
- **D-02:** Antique-map atmosphere rendered CSS-only (gradients + inline SVG patterns: paper grain, graticule/contour hints) — zero texture image assets, zero extra requests
- **D-03:** Single dark theme only — no `prefers-color-scheme` light variant
- **D-04:** Base surface = warm brown-black (aged leather/ink, sepia tint); primary accent = antique gold/parchment; exactly one secondary accent (aged-map teal OR terracotta). Exact hexes + contrast math (4.5:1 body text, 3:1 large text/UI) proven at design time and recorded in plans
- **D-05:** Serif display headings + sans body via system font stack (no webfont CDN)
- **D-06:** Decoration subtle/restrained — low-opacity texture, hairline rules, small compass/star motifs; content stays the hero
- **D-07:** Play Store CTA = official "Get it on Google Play" badge (dark variant PNG, hosted locally, `rel="noopener"`)

**Hero & copy:**
- **D-08:** Playful tone — fun-first game voice ("travel through time" energy)
- **D-09:** Agent drafts all copy now from the app README + known Play-listing facts; owner reviews after execution
- **D-10:** Hero app icon pulled from app repo (`C:\Users\Familia\antigravity\GeoHist-Trivia` launcher/play-store asset) into `/geohist/` as PNG
- **D-11:** Minimal hero: icon + app name + tagline + one short description paragraph + Play badge — tight, above-the-fold, phone-first. No fact chips, no screenshots in hero

**Structure & nav:**
- **D-12:** About-the-developer section lives on `/geohist/` landing (near FAQ); hub intro paragraph carries the Persano brand
- **D-13:** Screenshot gallery ships as skeleton now: heading + copy + placeholder tiles with `data-i18n` keys; Phase 5 swaps tiles for real WebP — markup stable
- **D-14:** Light header nav on `/geohist/` pages (Game · Guide · FAQ · Privacy); hub stays link-card minimal; footer keeps privacy link on every page (CMPL-01)
- **D-15:** Hub = grid-ready single app card — styled so card #2 slots into a grid later; no visible placeholder cells (CONT-04)

**FAQ & guide:**
- **D-16:** Extended FAQ (~6–8 questions): required three (data collection, offline capability, supported devices) + Remove Ads IAP, available languages, where progress is saved, how to report a problem
- **D-17:** CMPL-04 wording mirror = verbatim on data: FAQ answers reuse the policy's exact phrases for anything data-related (SDK names, retention, contact email)
- **D-18:** FAQ interaction = native `<details>`/`<summary>` accordions — no JS, keyboard-accessible, i18n-swap-safe
- **D-19:** `guide.html` concise: how-to-play basics + game modes overview, ~1–2 screens

**i18n keys (baked into all Phase 2 markup):**
- **D-20:** Page-prefixed dotted keys, per-element: `geohist.hero.tagline`, `hub.intro.1`, `guide.modes.title`. `data-i18n` for text nodes, `data-i18n-attr` for attributes (alt, aria-label, placeholder). Phase 3 dictionaries map 1:1
- **D-21:** Key everything user-visible: headings, paragraphs, list items, link labels, buttons, alt text, aria-labels, FAQ answers, guide body

**Placeholders & footer:**
- **D-22:** Play badge href = real package URL `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` now — 404s until listing live; zero code change on launch day (LNDG-04)
- **D-23:** Gallery placeholder tiles: phone-aspect, dark antique frames, subtle map-texture fill, small compass motif, caption "Screenshots coming soon" (keyed)
- **D-24:** Footer = minimal four: privacy link · contact email · Back to hub (on `/geohist/` pages) · © Persano — Santiago David Postorivo. Slot reserved for language switcher (Phase 3) and consent banner hooks (Phase 4)

### the agent's Discretion
- Exact hex values for the palette + which secondary accent (teal vs terracotta), with contrast math shown in plans
- Serif/sans system font picks within the system-stack constraint
- Section order on the landing page below the hero
- Compass/star motif SVG design and texture implementation details
- FAQ order and guide page section layout

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. (Deep guide walkthroughs noted in D-19 as "add later if needed".)

**Also out of scope this phase (CONTEXT.md §domain):** real screenshots (Phase 5), i18n engine/dictionaries/switcher (Phase 3), consent/Firebase/form (Phase 4), SEO/JSON-LD/sitemap (Phase 5).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LNDG-01 | `/geohist/` hero: app name, tagline, description, icon | Icon source verified: `GeoHist-Trivia/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192×192 PNG). Minimal-hero markup pattern + data-i18n key scheme provided below |
| LNDG-02 | Categorized feature list from app README | README features quoted verbatim below (README.md:6–11) — four categories: Trivia / Play Games / Offline / IAP (plus audio/SFX fact) |
| LNDG-04 | Play Store button present, placeholder href, swappable | Official badge asset URL verified live (200); href = D-22 package URL; guidelines (min 28px height, no recolor) documented |
| LNDG-05 | Mobile-first responsive | Base CSS pattern (existing `max-width: 42rem` + flex column) extends with clamp() type, grid auto-fill for hub/gallery; pitfalls listed |
| CONT-01 | FAQ: data collection, offline, devices — mirrors privacy wording | Verbatim policy phrases extracted and quoted below (CMPL-04 mirror table) |
| CONT-02 | `guide.html`: how to play, game modes | Game-mode facts extracted from app README (verified screen/mode names) |
| CONT-03 | About-the-developer: Santiago David Postorivo / Persano | Entity name verbatim from policy: "Persano, the personal brand of Santiago David Postorivo" |
| CONT-04 | Hub: brand intro + single app card, no visible placeholders | Hub-card CSS pattern (grid-ready single card) provided |
| CMPL-04 | Policy wording mirrors FAQ | Verbatim-phrase table below sourced from `geohist/privacy.html` (read this session, path+lines cited) |
</phase_requirements>

## Summary

Phase 2 is a pure content + styling phase on an already-live static site. No new packages, no JavaScript, no build changes. The work is: (1) re-theme `css/base.css` from light cream to a dark antique token set (keeping the existing `--color-*`/`--font-*` custom-property architecture), (2) build three pages (`/geohist/index.html` landing, `/geohist/guide.html`, expanded hub `/index.html`) reusing the privacy.html scaffolding pattern, (3) bake `data-i18n`/`data-i18n-attr` keys into every user-visible string per D-20/D-21, and (4) pull two binary assets from the app repo: the launcher icon (verified 192×192 PNG at `mipmap-xxxhdpi/ic_launcher.png`) and the official Google Play badge (verified live asset URL).

The two things most likely to cause rework are **(a) contrast math done wrong or late** — D-04 demands design-time proof, and WCAG thresholds are exact (4.499:1 fails) — and **(b) i18n key conventions drifting** (inconsistent prefixes, missing keys on attributes) — Phase 3 dictionaries map 1:1 against what Phase 2 bakes, so any inconsistency becomes Phase 3 rework. This document provides a pre-computed palette table (all pairs ≥6.8:1, computed with the exact WCAG formula fetched from w3.org this session) and a concrete key-naming/attr-syntax proposal to lock in the plan.

**Primary recommendation:** Lock the palette + `data-i18n-attr` syntax in the plan first (Task 1), then build pages bottom-up against the verbatim CMPL-04 phrase table below; validate with the existing CI (`npm run validate` covers `geohist/*.html` + `index.html`).

## Project Constraints (from AGENTS.md)

- Plain HTML/CSS + vanilla JS only; zero build step; GitHub Pages native
- Firebase JS SDK via CDN only; no other runtime dependencies (Phase 2 adds no JS at all)
- Content facts sourced from `C:\Users\Familia\antigravity\GeoHist-Trivia`
- Mobile-first responsive; modern evergreen browsers
- **STACK.md i18n section (per-language subdirs /es/, /pt/) is STALE** — locked decision is JS dictionary swap via `data-i18n` + JSON. Do not follow STACK.md §7. SEO tooling guidance there applies to Phase 5 only
- GSD workflow enforcement: work enters via GSD commands; this research is part of that flow

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hero/features/FAQ/guide/hub content | Static HTML (pages) | css/base.css tokens | All content is hand-authored markup; zero JS, zero client logic this phase |
| Dark antique theme + texture | css/base.css (token layer + utilities) | inline SVG in pages | D-01/D-02: shared tokens + CSS-only atmosphere; texture = layered gradients + inline SVG, no assets |
| FAQ accordion behavior | Browser-native (`<details>`) | — | D-18: native disclosure widget, keyboard accessible, no JS |
| Play Store CTA | Static HTML link + local badge PNG | — | D-07/D-22: hosted asset, single swap point at href |
| i18n key surface | HTML attributes (`data-i18n`, `data-i18n-attr`) | — | Phase 3 engine reads attributes; dictionaries map 1:1 (D-20) |
| Mobile-first layout | css/base.css + per-page classes | — | Existing viewport meta + fluid type; no breakpoints-first thinking |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Plain HTML5/CSS3 (ES: none — no JS) | platform | All pages + theme | Project constraint: zero build step [VERIFIED: AGENTS.md project constraints] |
| CSS custom properties (existing token arch in `css/base.css`) | n/a | Dark antique palette + fonts | D-01/D-04: swap token values, keep architecture [VERIFIED: css/base.css:3–9] |
| Native `<details>`/`<summary>` | HTML platform | FAQ accordions (D-18) | Keyboard accessible by default; optional `name` attr for exclusive groups [CITED: developer.mozilla.org — HTML details] |

### Supporting (dev tooling — already pinned, nothing to install)
| Tool | Version | Purpose | When |
|------|---------|---------|------|
| html-validate | 11.12.0 (devDep, pinned) | CI HTML validation | `npm run validate:html` — glob `index.html 404.html geohist/*.html` covers all new pages [VERIFIED: package.json:6] |
| linkinator | 8.1.0 (devDep, pinned) | Dead-link check | External domains (play.google.com) are SKIPPED by regex `^https?://(?!persano.github.io)` — the 404ing D-22 placeholder href will NOT fail CI [VERIFIED: package.json:7] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `<details name>` exclusive accordions | All-independently-toggling details | `name` gives one-open-at-a-time without JS; unsupported browsers ignore it (independent toggles — acceptable). Either is fine; `name` is free |
| Inline SVG compass motif per page | Shared CSS background-image data-URI | Inline SVG (aria-hidden) for one-off motifs; data-URI background for repeated texture. Both CSS-only, both D-02-compliant |
| `aspect-ratio` for phone tiles | padding-top percentage hack | `aspect-ratio` is baseline in evergreen browsers since 2021 [ASSUMED — low risk, project targets evergreen only] |

**Installation:** Nothing to install. No new packages. Local `npm` CLI is proxy-broken (E404 on registry, confirmed this session) — validation runs in CI exactly as Phase 1 established [VERIFIED: .github/workflows/deploy.yml:27–28 + STATE.md Phase 01 decision].

## Package Legitimacy Audit

**No external packages are installed in this phase.** Dev deps (html-validate 11.12.0, linkinator 8.1.0) were already pinned and CI-proven in Phase 1. No legitimacy gate runs required. Binary assets (icon PNG, badge PNG) are static file copies, not packages.

## Architecture Patterns

### System Architecture Diagram

```
 [App repo: GeoHist-Trivia]                [Site repo: persano.github.io]
  README.md ──(copy facts)─────┐
  mipmap-xxxhdpi/              │            ┌─ /index.html (hub: brand intro + 1 app card)
    ic_launcher.png ─(copy)────┼───►        ├─ /geohist/index.html (hero→features→gallery
  official Play badge PNG ─(copy)───►       │    skeleton→FAQ→About→badge) + /geohist/guide.html
                               │            └─ /geohist/privacy.html (existing; CMPL-04 wording source)
                               │                        │
                               │                 css/base.css (dark antique tokens + utilities)
                               │                        │ shared by all pages
                               ▼                        ▼
                     Visitor phone browser ── renders static HTML ──► CI: html-validate + linkinator
                               │                                        (glob covers geohist/*.html)
                               └── "Get it on Google Play" link ──► play.google.com/store/apps/
                                     href = package URL (D-22; 404 until listing live; linkinator skips
                                     external domains so CI stays green)
```

Data flow: repo file copy → static pages → push → CI validate → Pages deploy. No runtime services, no JS execution, no network calls from the pages this phase.

### Recommended Project Structure (delta from current)
```
geohist/
├── index.html          # NEW — landing: hero, features, gallery skeleton, FAQ, About-dev, Play badge
├── guide.html          # NEW — how-to-play + game modes (~1–2 screens, D-19)
├── privacy.html        # existing — untouched content; inherits new dark theme via base.css
└── icon.png            # NEW — copied 192×192 launcher PNG (D-10)
assets or geohist/
└── google-play-badge.png  # official 646×250 badge PNG, hosted locally (D-07)
css/base.css            # MODIFIED — dark antique token values + typography/texture/component utilities
index.html              # MODIFIED — full hub: brand intro + single app card (D-15)
```
`404.html` stays self-contained and untouched (CONTEXT.md §code_context).

### Pattern 1: Dark antique token swap (preserve token architecture)
**What:** Replace `:root` values in `css/base.css`, keep names and add new tokens.
**When to use:** The entire theme change (D-01).
**Example:**
```css
/* Existing architecture (base.css:3–9) — values change, names stay: */
:root {
  --color-bg: #1a1410;        /* warm brown-black surface (research-proposed, proven below) */
  --color-fg: #f0e6d2;        /* parchment body text */
  --color-accent: #d9a951;    /* antique gold */
  --color-muted: #c9b89a;     /* sepia-muted text */
  --font-body: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  /* NEW tokens, same naming style: */
  --color-surface: #241c14;   /* raised card surface */
  --font-display: Georgia, "Times New Roman", serif; /* falls back to Noto Serif on Android [ASSUMED: Android serif mapping — low risk, generic serif family guarantees a serif] */
}
```
Existing pages (privacy.html, hub) restyle automatically; nothing else to touch.

### Pattern 2: Native FAQ accordion (`<details>`/`<summary>`, D-18)
**What:** Native disclosure widgets, zero JS.
**When to use:** Every FAQ entry.
**Example:**
```html
<!-- Source: MDN — developer.mozilla.org/en-US/docs/Web/HTML/Element/details (fetched this session) -->
<details class="faq-item" name="geohist-faq">
  <summary data-i18n="geohist.faq.q1">Does GeoHist Trivia collect my data?</summary>
  <p data-i18n="geohist.faq.a1">…answer quoting policy verbatim…</p>
</details>
```
- `name` attribute: grouped `<details>` with the same name open one-at-a-time (exclusive accordion) without scripting; browsers lacking support simply ignore it → independent toggles [CITED: MDN — "give multiple `<details>` elements the same name value to group them… only one can be open at a time"]. Exact first-support browser versions: [ASSUMED] Chrome/Edge 120+, Safari 17.2+, Firefox 130+ — degradation is harmless
- Marker customization: `summary { list-style: none; } summary::-webkit-details-marker { display: none; }` then style your own indicator, or use `::marker` [CITED: MDN — "implementations automatically apply `display: list-item` to `<summary>`; you can use this or `::marker` to customize the disclosure widget"]

### Pattern 3: data-i18n key conventions (D-20/D-21)
**What:** Page-prefixed dotted keys baked into every user-visible string.
**Proposal to lock in the plan** (D-20 names the attributes but not the attr-value syntax):
- Text nodes: `<h1 data-i18n="geohist.hero.title">GeoHist Trivia</h1>` — attribute value IS the key
- Attributes: `data-i18n-attr` with a compact `attr:key` list, e.g. `<img src="/geohist/icon.png" alt="GeoHist Trivia app icon" data-i18n-attr="alt:geohist.hero.icon.alt" data-i18n-attr-only>`
- Key scheme: `geohist.<section>.<element>` / `hub.<n>` / `guide.<section>.<title>` per D-20 examples (`geohist.hero.tagline`, `hub.intro.1`, `guide.modes.title`)
- **Key-everything checklist (D-21):** headings, paragraphs, list items, link labels, alt text, aria-labels, FAQ Q&A, guide body, gallery captions, footer strings, `<title>`? — `<title>`/meta translation is I18N-04 (Phase 3); bake keys onto those nodes only if trivially possible, else leave (flag in plan)
- Reserved footer slot: empty container with a stable hook, e.g. `<span id="lang-switcher-slot" hidden></span>` (D-24)

### Pattern 4: CSS-only antique-map atmosphere (D-02/D-06)
**What:** Texture without image assets.
**When to use:** Base background + gallery placeholder fills (D-23).
**Techniques (all CSS-only):**
- Graticule/contour hints: two crossed `repeating-linear-gradient` layers at very low opacity
- Paper grain: inline SVG `feTurbulence` as a data-URI background at low opacity, or an inline `<svg aria-hidden="true" focusable="false">` overlay with `pointer-events: none`
- Blend: `background-blend-mode` between grain layer and base color
- Compass/star motifs: small inline SVGs, `aria-hidden="true" focusable="false"`
- **Rule:** text always sits on the solid token background — textures live on decorative layers/section backgrounds at low opacity, never behind body copy (keeps contrast math valid — texture under text would invalidate the computed pairs)

### Pattern 5: Hub — grid-ready single app card (D-15/CONT-04)
```css
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1.25rem;
}
.app-card { max-width: 30rem; } /* one card fills first track only; no empty cells, no stretching */
```
Grid is real (card #2 slots in later) but with one item renders as a single well-proportioned card — satisfies "renders correctly with exactly one app, no visible placeholders".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accordion interaction | JS toggle code, `<div onclick>` | Native `<details>`/`<summary>` (+`name`) | Keyboard/AT support free; zero JS honors project constraint |
| Contrast proof | Eyeballing colors, "looks fine" | WCAG formula (below) computed per pair | D-04 requires math; thresholds are exact (4.499:1 fails) |
| Disclosure animation/state | Custom JS state machines | `details[open]` CSS hooks | Native state; content in DOM only when open |
| Play CTA | Custom "Download" button/logo | Official badge PNG (local) | Google brand rules forbid altered/recolored marks; badge is recognized and trusted |
| Texture | Image assets, webfonts, icon fonts | CSS gradients + inline SVG feTurbulence | D-02 zero-request constraint |

**Key insight:** Every behavioral requirement this phase (accordion, disclosure, responsive layout) is a native browser capability. Hand-rolling any of it adds JS the project explicitly deferred to Phase 3.

## Runtime State Inventory

Static site, additive content phase — checked each category:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no databases/datastores in this project (static GitHub Pages) | None |
| Live service config | None — Pages deploys from repo (workflow type verified in Phase 1); no external service config UI holds site strings | None |
| OS-registered state | None — no scheduled tasks, daemons, or plists involved | None |
| Secrets/env vars | None added; no new secrets this phase | None |
| Build artifacts | `node_modules/` absent locally (npm proxy-broken) — CI `npm install`s fresh each run [VERIFIED: deploy.yml:27]; nothing stale to clean | None |

**Regression surface (the real risk):** `css/base.css` token swap restyles *existing* live pages — `privacy.html` and hub `index.html`. After the swap, both must be visually re-checked at phone width, and `404.html` (self-contained, inline styles) must remain unaffected (verify its light look is intentional-independent — CONTEXT.md says leave as-is; link targets unchanged, CMPL-01 regression-checked in CI).

## Common Pitfalls

### Pitfall 1: Contrast math done on rounded values or wrong threshold
**What goes wrong:** A pair computes 4.499:1 and "passes" because someone rounded to 4.5.
**Why it happens:** Rounding instinct; also large-text threshold misapplied (large-scale = ≥24px regular or ≥18.67px **bold**, not "any heading").
**How to avoid:** Compare raw computed ratio to 4.5 exactly; record both hexes and ratio per pair in the plan (D-04). Use the formula below verbatim.
**Warning signs:** Muted text pairs hovering near 4.5; gold text on gold-tinted surfaces.

### Pitfall 2: Texture behind text invalidates the math
**What goes wrong:** Paper-grain/graticule layers sit behind body copy; effective background luminance shifts and the proven pair no longer reflects reality.
**How to avoid:** Rule (Pattern 4): textures only on decorative layers/surfaces where no text sits, or behind text at opacity so low it cannot drop the ratio below the proven margin (all proposed pairs have ≥2.3:1 headroom above 4.5:1).
**Warning signs:** Grainy overlay spanning `main`; gradient under paragraph text.

### Pitfall 3: data-i18n coverage gaps → Phase 3 rework
**What goes wrong:** One heading/aria-label/FAQ answer without a key; Phase 3 dictionary maps 1:1 and misses it — string stays EN after language switch (silent failure).
**How to avoid:** Bake keys while writing markup (D-21), not retrofitted; run a `data-i18n` coverage grep before commit (e.g. count user-visible text nodes vs. keyed nodes per page).
**Warning signs:** Any visible string in a new page lacking `data-i18n` (or `data-i18n-attr` for attributes).

### Pitfall 4: Placeholder Play URL breaking CI (or being "fixed" to a fake)
**What goes wrong:** Fear that the 404ing `play.google.com` href fails link check → someone swaps in a fake URL or removes the badge.
**How to avoid:** Nothing to do — linkinator's skip regex `^https?://(?!persano.github.io)` excludes all external domains, so the D-22 placeholder href passes CI today and on launch day (zero code change) [VERIFIED: package.json:7].
**Warning signs:** Someone proposing `href="#"` — reject; D-22 mandates the real package URL.

### Pitfall 5: html-validate surprises on new markup
**What goes wrong:** CI validate job fails on a rule you didn't anticipate (e.g. `<img>` missing `alt`, duplicate `id`s across gallery placeholder tiles, heading-order jumps like h1→h3).
**How to avoid:** Every `<img>` carries `alt` (empty string + keyed attr for decorative), unique `id`s (gallery tiles: no per-tile ids), sequential heading order per page, `rel="noopener"` on external links (established pattern).
**Note:** Local npm is proxy-broken — you cannot run html-validate locally; CI is the arbiter (first push will surface any violation). Keep markup conservative.
**Warning signs:** Red validate job on run #1.

### Pitfall 6: Copy contradicting the privacy policy (CMPL-04)
**What goes wrong:** Marketing voice paraphrases data claims ("we never see your data") and drifts from the policy's exact wording — the owner treats the policy as single source of truth.
**How to avoid:** FAQ data answers reuse the verbatim phrases from the table below; playful tone allowed everywhere EXCEPT data claims (D-17: "verbatim on data, casual tone allowed elsewhere").
**Warning signs:** Any data-related sentence in FAQ/guide/hub not present verbatim in privacy.html.

### Pitfall 7: Official-badge misuse
**What goes wrong:** Recoloring, restyling, or scaling the badge below legibility — Google brand rules explicitly forbid altering the badge.
**How to avoid:** Host the official PNG as-is; height ≥28px (use ~48–56px display height for tap targets); clear space = ¼ badge height; `rel="noopener"` (D-07).
**Warning signs:** CSS filters/tints applied to the badge image.

## Code Examples

### WCAG contrast formula (use verbatim for the design-time proof)
```
Source: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance (fetched this session)

L = 0.2126 * R + 0.7152 * G + 0.0722 * B
where channel c (8bit/255): c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4

contrast ratio = (L1 + 0.05) / (L2 + 0.05)   // L1 = lighter of the two
```
- SC 1.4.3: text ≥ **4.5:1**; large-scale text (≥24px, or ≥18.67px bold) ≥ **3:1**; thresholds exact — do not round ("4.499:1 would not meet the 4.5:1 threshold") [VERIFIED: w3.org/WAI/WCAG22/Understanding/contrast-minimum.html]
- WCAG 2.1 AA (A11Y-01) uses the identical 1.4.3 criterion; 1.4.11 non-text contrast (3:1) additionally applies to focus indicators/UI component boundaries — give links and any bordered control a `:focus-visible` outline that clears 3:1 on the dark bg (gold works, 8.46:1)

### Proposed palette with computed pairs (agent's discretion seed — planner locks final hexes)
Computed with the formula above this session (node script, formula as quoted):

| Pair | Foreground | Background | Ratio | AA verdict |
|------|-----------|------------|-------|------------|
| Body text on base | `#f0e6d2` | `#1a1410` | 14.72:1 | ✅ 4.5:1 |
| Body text on card surface | `#f0e6d2` | `#241c14` | 13.55:1 | ✅ |
| Muted text on bg | `#c9b89a` | `#1a1410` | 9.38:1 | ✅ |
| Muted text on surface | `#c9b89a` | `#241c14` | 8.64:1 | ✅ |
| Gold accent (links) on bg | `#d9a951` | `#1a1410` | 8.46:1 | ✅ |
| Gold on surface | `#d9a951` | `#241c14` | 7.79:1 | ✅ |
| Secondary A: aged-map teal on bg | `#8fc3bd` | `#1a1410` | 9.30:1 | ✅ |
| Secondary B: terracotta on bg | `#e0885f` | `#1a1410` | 6.82:1 | ✅ |
| Ink text on gold (badge-like fills) | `#2a1f12` | `#d9a951` | 7.48:1 | ✅ |

Both secondary accents pass everywhere; terracotta (`#e0885f`) is the thematically warmer pick (gold + aged-map warmth stay in one family), teal (`#8fc3bd`) differentiates harder against the warm brown-black. Pick one (D-04). All pairs leave ≥2.3:1 margin above AA — texture opacity risk (Pitfall 2) is absorbed.

### CMPL-04 verbatim phrase table (FAQ answers MUST reuse these exact strings)
Source: `geohist/privacy.html` — read this session; quote verbatim beside claims:

- Entity (privacy.html:17): "Persano, the personal brand of Santiago David Postorivo"
- Contact email (privacy.html:17, 33, 42): "santiagopostorivo@gmail.com"
- Offline/local claim (privacy.html:20): "works mostly locally (*offline-first*)" — "does not collect or store personal identifying information on its own servers" — "All game progress, levels, medals, and settings are saved locally on your device."
- SDK names (privacy.html:25–29), verbatim labels:
  - "AdMob (Google Mobile Ads)"
  - "Google Play Games Services"
  - "Google Play Billing"
  - "Firebase Analytics (website only)"
  - "Firestore via the contact form (website only)"
- Retention (privacy.html:33): "Messages are deleted after they are handled."
- Billing phrasing (privacy.html:27): payment "handled entirely by Google"; the IAP example is the "Remove Ads" option
- Google policy link (privacy.html:36): `https://policies.google.com/privacy` with `rel="noopener"`

### Feature facts for LNDG-02 (from app README — read this session)
Quoted verbatim from `C:\Users\Familia\antigravity\GeoHist-Trivia\README.md:5–11`:
- "Categorized Trivia: Multiple game modes based on History and Geography."
- "Interactive UI: Built entirely with Jetpack Compose for a modern, fluid experience."
- "Audio & SFX: Integrated background music with a perceptual volume curve and interactive sound effects."
- "Google Play Games Services V2: Seamless sign-in, cloud saves, achievements, and leaderboards."
- "In-App Billing: Support for unlocking premium content or supporting development."
- "Offline Capable: The core game requires no internet connection; achievements are queued and synced once a connection is established."

Additional verified facts for FAQ/guide copy:
- Devices: "low-end `minSdk 24` device" (README.md:65) → draft FAQ answer: Android 7.0 (API 24) or newer [VERIFIED: README.md:65]
- Trivia content categories evidenced in-repo: FlagCountry, FlagCapital, MapFigure, MapCity, MapIsland, EventYearPhoto, FigureArt, CoatOfArmsCountry modes + "World Passport" screen (README.md:72–79) — guide copy drafts from these, playful tone per D-08/D-09
- Package ID: `com.persano.geohisttrivia` [VERIFIED: README.md:26 + D-22 URL]

### Play badge markup (D-07/D-22)
```html
<!-- Official asset verified live: 200 OK, 646×250 PNG, 4.9 KB (downloaded this session).
     NOTE: there is NO separate "dark variant" file — en_badge_web_dark.png returns 404.
     The standard "Get it on Google Play" badge IS black; D-07's "dark variant" = this standard black badge. -->
<a href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">
  <img src="/geohist/google-play-badge.png" width="194" height="75"
       alt="Get GeoHist Trivia on Google Play"
       data-i18n-attr="alt:geohist.cta.badge-alt">
</a>
```
Brand rules (fetched from play.google.com/intl/en_us/badges/ this session): use the "Get it on Google Play" badge for download CTAs (not lockups); minimum digital height **28px**; clear space = **¼ of badge height**; don't recolor, alter, stretch, or use low-res/outdated artwork; solid or simple backgrounds with contrast are fine (dark antique bg works). Localized badge versions exist for non-EN campaigns — EN badge is correct for this phase.

### FAQ item + gallery skeleton tiles (D-13/D-18/D-23)
```html
<section id="faq" aria-labelledby="faq-title">
  <h2 id="faq-title" data-i18n="geohist.faq.title">Frequently asked questions</h2>
  <details class="faq-item" name="geohist-faq">
    <summary data-i18n="geohist.faq.data.q">Does the game collect my data?</summary>
    <p data-i18n="geohist.faq.data.a"><!-- verbatim policy phrases --></p>
  </details>
  <!-- …6–8 items total per D-16… -->
</details>

<section class="gallery" aria-labelledby="gallery-title">
  <h2 id="gallery-title" data-i18n="geohist.gallery.title">See the world, answer the past</h2>
  <p data-i18n="geohist.gallery.intro">A peek at the journey — screenshots are on the way.</p>
  <ul class="gallery-grid">
    <li class="gallery-tile" role="img" aria-label="Screenshot placeholder" data-i18n-attr="aria-label:geohist.gallery.tile.aria">
      <!-- decorative compass SVG, aria-hidden="true" focusable="false" -->
      <p class="tile-caption" data-i18n="geohist.gallery.coming">Screenshots coming soon</p>
    </ul>
  </ul>
</section>
```
(placeholder markup shape — planner finalizes; keys per D-20, captions keyed per D-23)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS accordions (jQuery slideToggle) | Native `<details name>` exclusive accordions | `name` attr shipped in evergreen browsers ~2023–2024 | Zero-JS accordion is now fully capable; no JS this phase |
| JS lightbox for gallery | (deferred — skeleton tiles only this phase) | n/a | No slider/lightbox library ever needed at this scale |
| Rounding contrast to 1 decimal | Exact-threshold comparison (4.499:1 fails) | WCAG 2.2 Understanding guidance | Compute + record exact ratios at design time |

**Deprecated/outdated:** None new for this stack. (STACK.md i18n subdirs approach already superseded — see User Constraints warning.)

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `<details name>` browser versions (Chrome/Edge 120+, Safari 17.2+, Firefox 130+); graceful degradation confirmed by MDN text but exact versions unverified | Architecture Patterns / Pitfalls | Cosmetic only — older browsers show independent toggles |
| A2 | `aspect-ratio` CSS property safe for phone-aspect placeholder tiles (baseline ~2021 evergreen) | Standard Stack | Low — fallback is a fixed-height tile |
| A3 | Georgia → generic `serif` falls back to Noto Serif on Android; Georgia absent on Android | Standard Stack (D-05 picks) | Cosmetic only — any system serif satisfies D-05 |
| A4 | html-validate:recommended rules assumed from Phase 1 experience (img alt, dup ids, heading order, attribute quoting); exact rule list not re-fetched (local npm proxy-broken) | Pitfalls 5 | CI catches any miss on first push; fix is trivial markup edit |
| A5 | Proposed hexes (#1a1410/#241c14/#f0e6d2/#c9b89a/#d9a951/#8fc3bd/#e0885f) are a seed within agent's discretion — planner may adjust but must re-run the shown math | Code Examples (palette) | None if math re-proven |
| A6 | App "available languages" FAQ answer: PROJECT.md claims 20 localizations; app source strings not located this session (no `res/values` in main module) — draft copy conservatively ("English, Spanish, Portuguese and more"), owner reviews per D-09 | Open Questions | Minor copy correction post-review |
| A7 | Node 26.5.1 local + Node 24 in CI both fine for dev tooling; local npm registry broken (E404) matches STATE.md — nothing this phase needs local npm | Environment Availability | None — CI is the validator |

## Open Questions

1. **Exact `data-i18n-attr` value syntax**
   - What we know: D-20 locks the attribute names (`data-i18n`, `data-i18n-attr`) but not the attr-form syntax
   - What's unclear: `data-i18n-attr="alt:key"` (single attr) vs list syntax for multiple attrs
   - Recommendation: lock `attr:key` pairs (comma-separated for multiple) in PLAN.md; Phase 3 engine implements to match
2. **`<title>`/meta description i18n keys now or Phase 3?**
   - What we know: D-21 says key everything user-visible; I18N-04 (title/meta translation) is a Phase 3 requirement
   - Recommendation: bake `data-i18n` on `<title>` content now (harmless), skip meta description until Phase 3 confirms engine handles meta — flag in plan
3. **FAQ "available languages" wording**
   - What we know: app README doesn't list languages; PROJECT.md says 20 localizations
   - Recommendation: draft conservatively, owner reviews post-execution (D-09)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js (CI) | validate job | ✓ (CI) | 24 (workflow-pinned) | — |
| node/npm local | (not needed this phase — no local validation possible) | ✓ node 26.5.1 / npm 11.17.0; registry E404 | — | CI is the validation arbiter |
| App repo icon asset | D-10 hero icon | ✓ | 192×192 PNG at `GeoHist-Trivia/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` | — |
| Official Play badge PNG | D-07 CTA | ✓ | `https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png` (200, 646×250) | Re-fetch from Play badge generator page |
| Git push → CI | Deploy | ✓ | Phase 1 chain proven green | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** local npm (proxy-broken, E404 confirmed this session) — CI performs validation; do not add local npm-dependent plan steps.

## Validation Architecture

> workflow.nyquist_validation is explicitly `false` in `.planning/config.json` (line 24) — section omitted per contract. Note for the planner: CI validation (`npm run validate` = html-validate + linkinator over `index.html`, `404.html`, `geohist/*.html`) remains the automated gate that already exists; new pages must stay inside those globs.

## Runtime State Regression Checklist (compact)

Not a rename/migration phase — no stored data, live-service config, OS state, secrets, or build artifacts affected (see Runtime State Inventory above). Single regression surface: `css/base.css` token swap restyles `privacy.html` + hub. Verify both at phone width after the swap.

## Security Domain

> `security_enforcement: false` in .planning/config.json (line 22) — omitted per config. Note only: external links carry `rel="noopener"` (established pattern), and this phase adds no JS, no forms, no secrets.

## Sources

### Primary (HIGH confidence)
- w3.org/TR/WCAG22/ + WAI/WCAG22/Understanding/contrast-minimum.html — SC 1.4.3 thresholds, exact-threshold rule, relative-luminance formula (fetched via curl this session)
- play.google.com/intl/en_us/badges/ — badge selection, min size, clear space, alteration rules; asset URL verified 200 + dimensions read from PNG header
- developer.mozilla.org/en-US/docs/Web/HTML/Element/details — name attribute, summary/marker styling (fetched this session)

### In-repo (verified by Read this session)
- `.planning/phases/02-.../02-CONTEXT.md` (all D-01…D-24), `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, `.planning/config.json`
- `css/base.css` (token architecture), `index.html` (hub skeleton), `geohist/privacy.html` (CMPL-04 wording source), `404.html`
- `package.json` (validate globs + linkinator skip regex), `.github/workflows/deploy.yml`, `.htmlvalidate.json`
- `C:\Users\Familia\antigravity\GeoHist-Trivia\README.md` (features, minSdk 24, package id), `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192×192 verified)

### Tertiary (LOW confidence)
- Browser-version specifics for `details[name]` (A1), Android serif fallback (A3), app localization count (A6) — all flagged above, all low-risk

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — platform-native HTML/CSS only; no new dependencies; existing CI proven
- Architecture: HIGH — additive pages on an established scaffolding pattern; theme swap confined to one file
- Pitfalls: HIGH — each pitfall verified against in-repo constraints or fetched specs; contrast math computed with the verbatim spec formula
- Copy facts: HIGH for data/offline/devices/IAP (verbatim in-repo sources); MEDIUM for game-mode marketing voice (owner reviews per D-09)

**Research date:** 2026-09-02
**Valid until:** 2026-10-02 (stable platform patterns; badge/brand rules re-checkable at any time)
