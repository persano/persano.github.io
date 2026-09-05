# Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher - Context

**Gathered:** 2026-09-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the site's first (and only) JavaScript: an i18n engine at `/js/i18n.js` that swaps `data-i18n`-keyed text and attributes in place on the 3 keyed pages (hub `/index.html`, `/geohist/index.html`, `/geohist/guide.html`) using ES and pt-BR JSON dictionaries fetched per language, with browser-language auto-detect, EN fallback on any failure, a manual footer language switcher persisted in localStorage, and `document.documentElement.lang` + `<title>` + meta description sync (I18N-01..04). EN ships as the raw HTML — no redirects, no URL changes, no per-language subdirs. NOT in this phase: privacy.html translation (EN legally authoritative, out of scope), 404.html changes, real screenshots / SEO / JSON-LD / AA audit (Phase 5), consent banner / Firebase / contact form (Phase 4 — engine only exposes a `persano:langchange` event hook for FIRE-03).

</domain>

<decisions>
## Implementation Decisions

### Dictionary delivery & engine architecture
- **D-25:** Dictionaries fetched per language at runtime as JSON — one file per language covering all namespaces (`hub.*`, `geohist.*`, `guide.*`) with keys flat and 1:1 against the Phase 2 `data-i18n` surface (~103 keys: landing 56, guide 36, hub 11). Files: `/js/i18n/es.json`, `/js/i18n/pt-BR.json`. ES visitor downloads EN HTML + one small JSON; EN visitors download nothing extra — **Reversibility:** costly — switching delivery later rewrites the engine's fetch/fallback path, re-proves SC3 fallback behavior, and re-tests all 3 pages
- **D-26:** Engine = single classic script `/js/i18n.js` loaded via `<script defer>` on exactly the 3 keyed pages; no ES modules (one file, no imports)
- **D-27:** Meta description translation (I18N-04) = bake `data-i18n-attr="content:{ns}.meta.desc"` onto the 3 meta tags — one-line HTML edits reusing the D-20 mechanism; no engine special-casing for meta
- **D-28:** EN handling = DOM snapshot: engine snapshots the shipped EN text/attrs from the DOM at load (before any swap); switching back to EN re-applies the snapshot. No `en.json` ships — EN always exactly matches raw HTML
- **D-29:** Switch action = in-place textContent/attribute swap, no reload; localStorage preference saved, `document.documentElement.lang` + `<title>` + meta description updated atomically
- **D-30:** Dictionary fetch failure (offline, CDN hiccup) = silent EN fallback — page stays on shipped content, no error UI; a failed manual switch also stays on the current language (SC3 / I18N-02)

### Detection & first paint
- **D-31:** Accept the EN first-paint flash for ES/pt-BR visitors — engine fetches and swaps on DOMContentLoaded; no hide-until-applied render-blocking; no-JS users and crawlers see perfect EN by construction
- **D-32:** Auto-detect = first supported match across `navigator.languages` (not primary language only) — an en-US-primary + es-secondary browser still gets Spanish
- **D-33:** Portuguese variants: all `pt-*` (pt-BR, pt-PT, pt-AO, bare pt) map to the pt-BR dictionary; `es-*` maps to the ES dictionary
- **D-34:** localStorage = one shared key (`persano.lang`) across hub + geohist pages — same site, one visitor preference
- **D-35:** Phase 4 hook = engine dispatches document event `persano:langchange` `{from, to}` on every applied switch — FIRE-03 consent-gated Analytics listens in Phase 4; zero coupling now

### Switcher UX
- **D-36:** Switcher = three text links (English · Español · Português) with endonym labels, rendered inside the reserved `#lang-switcher-slot` footer span (D-24) — zero styling burden, matches `.footer-links` pattern, mobile-tap friendly
- **D-37:** Switcher appears on the 3 keyed pages only; privacy.html stays EN-only (no keys to swap) and 404.html stays self-contained
- **D-38:** Active language renders as non-interactive marked text (`aria-current="true"`, not clickable) — clear state signal for screen readers

### Translation workflow & language choices
- **D-39:** Agent drafts all ES + pt-BR copy from the EN strings (app's ES localization as game-term terminology reference), owner reviews after execution — D-09 pattern from Phase 2
- **D-40:** Spanish variant = neutral Latin American Spanish (es-419) — matches Play Store's es-419 audience and the app's Spanish localization; owner flags preferences in review
- **D-41:** FAQ answers that quote privacy.html verbatim in EN get translated in ES/pt-BR dictionaries — translated claims mirror the EN policy's meaning and stay consistent with it; EN remains the legally authoritative text — **Reversibility:** reversible — dictionary entries are data edits

### the agent's Discretion
- Engine internal structure (detection priority: stored pref > browser detect > EN), fetch caching/versioning details, JSON validation approach
- Switcher accessibility details (lang/hreflang attributes on links) and styling within the footer pattern
- Dictionary JSON formatting, key ordering, engine error-guard specifics
- Exact localStorage key name (persano.lang is the agreed shape, exact string flexible)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & scope
- `.planning/ROADMAP.md` §Phase 3 — goal, I18N-01..04, 4 success criteria (in-place swap, switcher override + persistence, EN fallback on failure, lang/title/meta sync)
- `.planning/REQUIREMENTS.md` — I18N-01..04 definitions; Out of Scope table (no per-language subdirs; privacy policy translations excluded)
- `.planning/PROJECT.md` — constraints (plain HTML/CSS/vanilla JS, zero build step, CDN-only deps), Key Decisions table (JS dictionary swap locked)

### Locked prior decisions (i18n key contract)
- `.planning/phases/02-geohist-landing-hub-content-en-i18n-keys-baked-in/02-CONTEXT.md` — D-20 (dotted keys, `data-i18n` / `data-i18n-attr` syntax), D-21 (key everything), D-24 (reserved `#lang-switcher-slot` in both footers)
- `.planning/STATE.md` §Accumulated Context — locked Init decision: JS dictionary swap, no per-language subdirs; Phase 02 notes on plain-text-only keyed nodes (textContent swap is markup-safe)
- `.planning/phases/02-geohist-landing-hub-content-en-i18n-keys-baked-in/02-01-PLAN.md` §i18n Key Contract — locked key contract Phase 3 dictionaries map against

### Wording source (CMPL-04)
- `geohist/privacy.html` — authoritative EN wording for all data claims; ES/pt-BR FAQ translations must mirror its meaning (D-41 in Phase 2 CONTEXT: verbatim at text level in EN; translated-with-meaning-mirror in ES/PT per D-41 this phase)

### Terminology reference (external)
- `C:\Users\Familia\antigravity\GeoHist-Trivia\translations.json` — app's existing ES localization of game terms; reference for game terminology consistency in the ES dictionary

### Superseded-doc warning
- `AGENTS.md` / embedded STACK.md §7 — its i18n section (per-language subdirs `/es/`, `/pt/`, hreflang, redirect script) is **STALE**. Locked decision: JS dictionary swap via `data-i18n` + JSON (REQUIREMENTS.md Out of Scope). Do not follow it; its SEO guidance applies to Phase 5 only

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `#lang-switcher-slot` reserved hidden `<span>` in both footers (`index.html:30`, `geohist/index.html:142`) — Phase 3 populates it (un-hide, render links)
- `data-i18n` / `data-i18n-attr` (+ `data-i18n-attr-only`) key surface baked in all 3 pages — dictionaries map 1:1; `<title>` already keyed on all 3 pages
- `.footer-links` list pattern in both footers — switcher links join the same visual family
- `css/base.css` custom-property tokens — switcher styling rides existing tokens
- App repo `translations.json` (es/fr/it) — ES game-term translations as terminology reference

### Established Patterns
- Static HTML per page, absolute-root asset paths (`/css/base.css` → `/js/i18n.js` follows the same shape)
- Zero JS so far — this phase introduces the site's first script; keep it dependency-free vanilla JS
- No-JS = EN by construction (EN is the raw HTML); html-validate + link-check CI must pass with the new script tags
- Per-task commits via gsd-tools commit handler (Phase 02 pattern); deploy is orchestrator-owned single controlled push (Phase-01 pattern)

### Integration Points
- Engine loads on exactly 3 pages via `<script defer src="/js/i18n.js">`
- Meta descriptions on all 3 pages are currently unkeyed (flagged in Phase 2) — D-27 bakes `data-i18n-attr` onto them in this phase
- `persano:langchange` event consumed by Phase 4 (FIRE-03 consent-gated events)
- localStorage `persano.lang` is functional preference storage — no interaction with Phase 4 consent gating (Firebase loads only post-grant)

</code_context>

<specifics>
## Specific Ideas

- Every discussion answer took the recommended option — the model is: fetch-per-language JSON, DOM-snapshot EN, accept-EN-flash, first-match detection, in-place swap, footer text links, agent-drafted translations reviewed after execution
- Endonym labels explicitly chosen for the switcher (English · Español · Português)
- Neutral es-419 Spanish explicitly chosen over Peninsular
- FAQ policy sentences translated with meaning-mirror to EN policy (EN stays legally authoritative)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 3-i18n — Engine, ES/pt-BR Dictionaries, Switcher*
*Context gathered: 2026-09-02*