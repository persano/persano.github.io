# Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher - Research

**Researched:** 2026-09-02
**Domain:** Vanilla-JS client-side i18n (data-i18n dictionary swap) on a static GitHub Pages site
**Confidence:** MEDIUM — in-repo claims all verified this session; external doc verification unavailable (webfetch proxy-blocked, no search/context7 MCPs in session), so platform-API claims are tagged [ASSUMED] and ride stable web-standard knowledge

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Dictionary delivery & engine architecture**
- **D-25:** Dictionaries fetched per language at runtime as JSON — one file per language covering all namespaces (`hub.*`, `geohist.*`, `guide.*`) with keys flat and 1:1 against the Phase 2 `data-i18n` surface (~103 keys: landing 56, guide 36, hub 11). Files: `/js/i18n/es.json`, `/js/i18n/pt-BR.json`. ES visitor downloads EN HTML + one small JSON; EN visitors download nothing extra — **Reversibility:** costly — switching delivery later rewrites the engine's fetch/fallback path, re-proves SC3 fallback behavior, and re-tests all 3 pages
- **D-26:** Engine = single classic script `/js/i18n.js` loaded via `<script defer>` on exactly the 3 keyed pages; no ES modules (one file, no imports)
- **D-27:** Meta description translation (I18N-04) = bake `data-i18n-attr="content:{ns}.meta.desc"` onto the 3 meta tags — one-line HTML edits reusing the D-20 mechanism; no engine special-casing for meta
- **D-28:** EN handling = DOM snapshot: engine snapshots the shipped EN text/attrs from the DOM at load (before any swap); switching back to EN re-applies the snapshot. No `en.json` ships — EN always exactly matches raw HTML
- **D-29:** Switch action = in-place textContent/attribute swap, no reload; localStorage preference saved, `document.documentElement.lang` + `<title>` + meta description updated atomically
- **D-30:** Dictionary fetch failure (offline, CDN hiccup) = silent EN fallback — page stays on shipped content, no error UI; a failed manual switch also stays on the current language (SC3 / I18N-02)

**Detection & first paint**
- **D-31:** Accept the EN first-paint flash for ES/pt-BR visitors — engine fetches and swaps on DOMContentLoaded; no hide-until-applied render-blocking; no-JS users and crawlers see perfect EN by construction
- **D-32:** Auto-detect = first supported match across `navigator.languages` (not primary language only) — an en-US-primary + es-secondary browser still gets Spanish
- **D-33:** Portuguese variants: all `pt-*` (pt-BR, pt-PT, pt-AO, bare pt) map to the pt-BR dictionary; `es-*` maps to the ES dictionary
- **D-34:** localStorage = one shared key (`persano.lang`) across hub + geohist pages — same site, one visitor preference
- **D-35:** Phase 4 hook = engine dispatches document event `persano:langchange` `{from, to}` on every applied switch — FIRE-03 consent-gated Analytics listens in Phase 4; zero coupling now

**Switcher UX**
- **D-36:** Switcher = three text links (English · Español · Português) with endonym labels, rendered inside the reserved `#lang-switcher-slot` footer span (D-24) — zero styling burden, matches `.footer-links` pattern, mobile-tap friendly
- **D-37:** Switcher appears on the 3 keyed pages only; privacy.html stays EN-only (no keys to swap) and 404.html stays self-contained
- **D-38:** Active language renders as non-interactive marked text (`aria-current="true"`, not clickable) — clear state signal for screen readers

**Translation workflow & language choices**
- **D-39:** Agent drafts all ES + pt-BR copy from the EN strings (app's ES localization as game-term terminology reference), owner reviews after execution — D-09 pattern from Phase 2
- **D-40:** Spanish variant = neutral Latin American Spanish (es-419) — matches Play Store's es-419 audience and the app's Spanish localization; owner flags preferences in review
- **D-41:** FAQ answers that quote privacy.html verbatim in EN get translated in ES/pt-BR dictionaries — translated claims mirror the EN policy's meaning and stay consistent with it; EN remains the legally authoritative text

### the agent's Discretion
- Engine internal structure (detection priority: stored pref > browser detect > EN), fetch caching/versioning details, JSON validation approach
- Switcher accessibility details (lang/hreflang attributes on links) and styling within the footer pattern
- Dictionary JSON formatting, key ordering, engine error-guard specifics
- Exact localStorage key name (persano.lang is the agreed shape, exact string flexible)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

**Additional out-of-scope (from REQUIREMENTS.md Out of Scope + phase boundary):** per-language HTML subdirs (/es/, /pt/), hreflang link tags, redirect scripts, privacy.html translation, 404.html changes, screenshots/SEO/JSON-LD/AA audit (Phase 5), consent banner/Firebase/contact form (Phase 4 — engine only exposes `persano:langchange` for FIRE-03). I18N-05 (17 more localizations) is v2.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| I18N-01 | Site copy in EN/ES/pt-BR; EN ships in raw HTML | Exact 98-key surface extracted + 3 meta-desc keys to bake (D-27); dictionary files `/js/i18n/{es,pt-BR}.json`, flat keys 1:1; EN = raw HTML + D-28 DOM snapshot |
| I18N-02 | Auto-detect applies translation in place — no redirects, no URL changes; EN fallback on any failure | Detection chain stored-pref > first-match across `navigator.languages` (D-32/D-33); in-place textContent/attr swap (D-29); silent EN fallback on fetch/parse failure (D-30) |
| I18N-03 | Manual switcher overrides detection; preference persists (localStorage) | Switcher rendered into `#lang-switcher-slot` (D-36/D-38); `persano.lang` storage with try/catch guards (D-34); stored pref wins over detect in priority chain |
| I18N-04 | `document.documentElement.lang` syncs; `<title>`/meta description translate | `<title>` already carries `data-i18n` on all 3 pages (snapshot path covers it); D-27 bakes `data-i18n-attr="content:{ns}.meta.desc"` on the 3 meta tags; `documentElement.lang` set atomically with swap |
</phase_requirements>

## Summary

Phase 3 introduces the site's first and only JavaScript: a dependency-free, classic-script i18n engine (`/js/i18n.js`, ~150–200 lines) plus two flat JSON dictionaries (`/js/i18n/es.json`, `/js/i18n/pt-BR.json`) covering a precisely measurable key surface. Every mechanism the engine needs is a stable web-platform API: `querySelectorAll` + `textContent`/`setAttribute` for the swap, `fetch` (same-origin) for dictionaries, `navigator.languages` for detection, `localStorage` for persistence, `CustomEvent` on `document` for the Phase 4 hook, and `documentElement.lang` for I18N-04. No packages, no build step, no new runtime dependencies — the Package Legitimacy Audit is empty by design.

The key contract is already locked in markup: 98 unique keys ship today (hub 11, geohist landing 51, guide 36 — CONTEXT.md's "~103 / landing 56" estimate is slightly high; the exact extraction in this document is authoritative and the planner should drive dictionary authoring from it, not the estimate). D-27 adds 3 meta-description keys (`{ns}.meta.desc`) for 101 total. The engine walks `[data-i18n]`/`[data-i18n-attr]` nodes once at init, snapshots the EN values (D-28), then applies the resolved language. `<title>` is a normal node in this walk — no special-casing.

The two genuinely failure-prone areas are (1) **snapshot/restore ordering** — the EN snapshot must be taken before any swap, and language switching must be idempotent over it (es → en → es must work repeatedly); and (2) **silent degradation everywhere** — localStorage access, JSON parsing, and per-node dictionary misses must each fall back without throwing, because SC3 ("any dictionary fetch failure falls back to shipped English") is a hard success criterion. Both are addressed with concrete patterns below.

**Primary recommendation:** Build the engine as: snapshot → resolve target (stored pref, validated ∈ {en, es, pt-BR} > detect via first-match across `navigator.languages` with `pt-* → pt-BR`, `es-* → es` mapping > `en`) → fetch dict into an in-memory Map → single synchronous apply pass (textContent + attributes + `documentElement.lang` + switcher active state) → dispatch `persano:langchange` last. Manual switch = same path minus detection; EN re-apply = snapshot restore, zero fetch. Every storage/parse call wrapped in try/catch; any failure before apply = stay on current language silently.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Language detection (auto) | Browser/Client (JS) | — | `navigator.languages` is a browser API; GitHub Pages cannot server-sniff (static host) |
| Dictionary delivery | CDN/Static (GitHub Pages) | — | Two JSON files served as static assets, same-origin fetch |
| Text/attribute swap engine | Browser/Client (JS) | — | DOM manipulation only; no server, no build step |
| EN baseline + snapshot | Browser/Client (JS) | Static HTML (raw EN is the baseline) | EN IS the raw HTML by construction; snapshot preserves it for round-trips |
| Preference persistence | Browser/Client (JS) | — | localStorage; no server-side session exists |
| Switcher UI | Browser/Client (JS) | — | JS-rendered into reserved footer slot; zero static markup change beyond un-hiding |
| `documentElement.lang` / title / meta sync | Browser/Client (JS) | — | I18N-04 is a runtime DOM concern; static HTML keeps EN for crawlers |
| Dictionary authoring (ES/pt-BR copy) | Content (agent-drafted, repo files) | — | Static JSON in repo; owner reviews after execution (D-39) |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Web platform APIs (fetch, querySelectorAll, textContent, setAttribute, navigator.languages, localStorage, CustomEvent, documentElement.lang) | built-in | The entire engine | Zero-dependency constraint (PROJECT.md); all stable since ~2016; no polyfill needed for evergreen browsers [ASSUMED — platform-API facts, doc fetch blocked this session] |
| JSON (flat key→string dictionaries) | n/a | Translation data format | D-25 locks it; `response.json()` parses natively |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | — | — | No new runtime or dev dependency is needed or allowed. html-validate 11.12.0 + linkinator 8.1.0 already in package.json run in CI against the edited HTML [VERIFIED: package.json:6-12] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Flat JSON fetch (D-25) | Bundling dicts inside i18n.js | Bundled = one fewer request but EN visitors pay the byte cost and dict edits touch JS; flat files keep EN visitors at zero extra bytes (D-25 rationale) — stay flat |
| Classic script (D-26) | ES module | Modules add import machinery for a single file with zero imports; classic `defer` script is strictly simpler — stay classic |
| `en.json` file | DOM snapshot (D-28) | An en.json could drift from raw HTML; snapshot guarantees EN ≡ shipped markup — stay snapshot |

**Installation:**
```bash
# Nothing to install. No npm packages are added this phase.
# Dictionary files are hand-authored JSON; engine is hand-authored vanilla JS.
```

**Version verification:** N/A — no packages introduced. Existing dev tooling (html-validate 11.12.0, linkinator 8.1.0) is already locked in package.json and CI [VERIFIED: package.json:9-12].

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| — | — | — | — | — | — | No packages installed this phase |

**Packages removed due to [SLOP] verdict:** none (zero install surface — engine is dependency-free vanilla JS per D-26 and the project's zero-build constraint)
**Packages flagged as suspicious [SUS]:** none

*Phase installs no external packages; the npm registry is not consulted. Firebase CDN imports arrive in Phase 4, not here.*

## Architecture Patterns

### System Architecture Diagram

```
                 ┌──────────────────────────────────────────────────┐
                 │  Browser loads EN HTML (3 keyed pages)           │
                 │  hub /index.html · /geohist/ · /geohist/guide    │
                 └──────────────────────┬───────────────────────────┘
                                        │ <script defer src="/js/i18n.js">
                                        ▼ (executes after DOM parse, before DOMContentLoaded)
                 ┌──────────────────────────────────────────────────┐
                 │  INIT (once, synchronous start)                  │
                 │  1. Snapshot EN text/attrs from [data-i18n],     │
                 │     [data-i18n-attr] nodes  (D-28)               │
                 │  2. Render switcher into #lang-switcher-slot     │
                 │     (un-hide, EN active)                         │
                 └──────────────────────┬───────────────────────────┘
                                        ▼
                 ┌──────────────────────────────────────────────────┐
                 │  RESOLVE TARGET LANGUAGE                         │
                 │  localStorage 'persano.lang' valid? ──yes──▶ use │
                 │        │no                                       │
                 │  navigator.languages first-match scan (D-32):    │
                 │    pt-* → pt-BR · es-* → es · en-* → en          │
                 │        │no match                                 │
                 │      EN                                          │
                 └──────────────────────┬───────────────────────────┘
              target === 'en'           │           target ≠ 'en'
                 ┌──────────────────────┴─────────────┬─────────────┐
                 ▼                                    ▼             │
   ┌───────────────────────────┐      ┌────────────────────────────┐│
   │ APPLY EN (snapshot state) │      │ fetch('/js/i18n/<lang>.json)││
   │ html.lang='en'; done      │      │ (in-memory Map cache)       ││
   └───────────────────────────┘      └──────────┬─────────────────┘│
                                                 │                  │
                                    fetch/parse OK?                 │
                                     yes │      │no (offline, 404,  │
                                         │      │    bad JSON)      │
                                         ▼      ▼                   │
                          ┌────────────────┐  ┌───────────────────┐ │
                          │ APPLY <lang>   │  │ SILENT EN FALLBACK│ │
                          │ sync pass:     │  │ stay on shipped   │ │
                          │  textContent + │  │ EN, no error UI,  │ │
                          │  attrs + title │  │ no persist        │ │
                          │  + meta (D-27) │  │ (D-30 / SC3)      │ │
                          │  + html.lang   │  └───────────────────┘ │
                          └───────┬────────┘                        │
                                  ▼                                 │
                    persist localStorage (try/catch)                │
                    dispatch 'persano:langchange' {from,to} (D-35) ─┼──▶ Phase 4: FIRE-03
                    update switcher aria-current state              │    consent-gated Analytics
                                  ▼                                 │
                    ┌───────────────────────────┐                   │
                    │ MANUAL SWITCH = same path │◀──── user click ──┘
                    │ minus detection; stored   │      (switcher link)
                    │ pref wins; failed switch  │
                    │ = silent no-op (D-30)     │
                    └───────────────────────────┘
```

Entry point: `<script defer src="/js/i18n.js">` on exactly 3 pages. Data flow: static HTML (EN) → runtime detection → one same-origin JSON fetch → synchronous DOM pass. External dependency: none beyond same-origin static files. Failure paths all terminate on the shipped-EN state.

### Recommended Project Structure
```
/                       (repo root — deployed as Pages root)
├── index.html           # hub — gets <script defer> + meta-desc keying (D-27)
├── 404.html             # UNTOUCHED (self-contained, EN)
├── geohist/
│   ├── index.html       # landing — script tag + D-27 edit
│   ├── guide.html       # guide — script tag + D-27 edit
│   └── privacy.html     # UNTOUCHED (EN legally authoritative, no slot, no keys)
├── css/base.css         # UNTOUCHED — switcher inherits footer styles
└── js/
    ├── i18n.js          # NEW — engine, classic script, no imports
    └── i18n/
        ├── es.json      # NEW — 101 keys, es-419 copy (D-40)
        └── pt-BR.json   # NEW — 101 keys, pt-BR copy
```

### Pattern 1: EN DOM snapshot + dictionary apply (D-28 core loop)

**What:** Walk all keyed nodes once, capture their shipped values, then re-apply either snapshot (EN) or dictionary (ES/pt-BR) values through one function.

**When to use:** Always in this phase — this is the engine's core.

**Example:**
```javascript
// Engine skeleton — shape only, not verbatim implementation
var SUPPORTED = ['en', 'es', 'pt-BR'];
var STORAGE_KEY = 'persano.lang';
var dicts = {};          // in-memory cache: lang -> parsed JSON
var snapshot = [];       // [{el, text, attrs:[{name, key, value}]}]

function capture() {
  document.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach(function (el) {
    var entry = { el: el, text: el.textContent, attrs: [] };
    var attrSpec = el.getAttribute('data-i18n-attr');           // "attr:key[,attr:key…]"
    if (attrSpec) {
      attrSpec.split(',').forEach(function (pair) {
        var p = pair.split(':');
        entry.attrs.push({ name: p[0].trim(), key: p[1].trim(),
                           value: el.getAttribute(p[0].trim()) });
      });
    }
    snapshot.push(entry);
  });
}

function apply(lang) {
  var dict = dicts[lang] || null;                                // null = EN snapshot path
  snapshot.forEach(function (e) {
    if (e.el.hasAttribute('data-i18n') && dict) {
      var t = dict[e.el.getAttribute('data-i18n')];
      e.el.textContent = (typeof t === 'string') ? t : e.text;   // missing key → keep EN, silent
    } else if (e.el.hasAttribute('data-i18n')) {
      e.el.textContent = e.text;                                 // EN restore
    }
    e.attrs.forEach(function (a) {
      var v = dict ? dict[a.key] : null;
      e.el.setAttribute(a.name, (typeof v === 'string') ? v : a.value);
    });
  });
  document.documentElement.lang = lang;                          // I18N-04
}
```

Source: pattern per D-20/D-28 contract [VERIFIED: .planning/phases/02-geohist-landing-hub-content-en-i18n-keys-baked-in/02-01-PLAN.md:89-103]; API behaviors (querySelectorAll includes `<head>` nodes, textContent safe-swap) [ASSUMED — platform standard].

### Pattern 2: Detection chain with pt-*/es-* folding

**What:** Priority: valid stored pref → first supported match scanning ALL `navigator.languages` entries → EN.

**Example:**
```javascript
function detect() {
  var candidates;
  try { candidates = navigator.languages || [navigator.language]; }
  catch (e) { candidates = []; }
  for (var i = 0; i < candidates.length; i++) {
    var tag = String(candidates[i] || '').toLowerCase();
    if (tag.indexOf('pt') === 0) return 'pt-BR';   // pt, pt-BR, pt-PT, pt-AO → pt-BR dict (D-33)
    if (tag.indexOf('es') === 0) return 'es';      // es, es-419, es-ES → es dict (D-33)
    if (tag.indexOf('en') === 0) return 'en';
  }
  return 'en';
}
```
[ASSUMED — `navigator.languages` is a readonly, most-preferred-first array; standard behavior, doc fetch blocked this session. Mapping logic is D-32/D-33 [VERIFIED: 03-CONTEXT.md:26-27].]

### Pattern 3: Switcher rendering with active-state swap

**What:** Build 3 entries into the reserved slot; active one is a non-interactive marked span (D-38), inactive ones are links; delegate one click listener on the slot container so re-renders never stack listeners.

**Example:**
```html
<!-- Engine output inside #lang-switcher-slot (example: es active) -->
<span lang="es" aria-current="true">Español</span>
· <a href="#" lang="en" hreflang="en" data-persano-lang="en">English</a>
· <a href="#" lang="pt-BR" hreflang="pt-BR" data-persano-lang="pt-BR">Português</a>
```
```javascript
slot.addEventListener('click', function (ev) {
  var a = ev.target.closest('[data-persano-lang]');
  if (!a) return;
  ev.preventDefault();
  switchTo(a.getAttribute('data-persano-lang'));
});
```
Endonym labels and slot placement per D-36 [VERIFIED: 03-CONTEXT.md:32]; `lang`/`hreflang` on inactive links = discretion granted by CONTEXT, `aria-current="true"` per D-38 [VERIFIED: 03-CONTEXT.md:34].

### Pattern 4: Silent-failure guards (SC3 / D-30)

**What:** Every storage, fetch, and parse call is individually guarded; failure aborts the current operation without UI change.

**Example:**
```javascript
function loadDict(lang) {                       // returns Promise<dict|null>
  return fetch('/js/i18n/' + lang + '.json')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || typeof j !== 'object' || Array.isArray(j) || !Object.keys(j).length) return null;
      dicts[lang] = j; return j;
    })
    .catch(function () { return null; });
}

function persist(lang) {
  try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode / quota: skip */ }
}
function readPref() {
  try {
    var v = window.localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.indexOf(v) !== -1 ? v : null;   // invalid/legacy value → ignore, re-detect
  } catch (e) { return null; }
}
```
[ASSUMED — localStorage throws in some restricted modes; fetch rejects on network failure; both standard. Guard REQUIREMENT is D-30/SC3 [VERIFIED: 03-CONTEXT.md:22, REQUIREMENTS.md:37].]

### Anti-Patterns to Avoid
- **innerHTML for swaps:** dictionary strings would be parsed as HTML — an injection surface and a contract violation. Phase 2 locked keyed nodes to plain text precisely so `textContent` swap is markup-safe [VERIFIED: STATE.md:82]. Use `textContent` + `setAttribute` only.
- **Snapshot after first apply:** capturing EN after an ES apply bakes translated text into the "EN" snapshot and makes `es → en` restore Spanish. Capture exactly once, before any apply.
- **Re-binding switcher listeners per render:** each re-render adds another click handler → multiple switches per click. Delegate one listener on the slot container (Pattern 3).
- **Persisting before apply:** save `persano.lang` only AFTER a successful apply; a failed switch that persisted would break the "stays on current language" guarantee (D-30) on next visit.
- **Trusting stored values:** stored pref must be validated against `SUPPORTED` before use; a stale/foreign value must silently re-detect, never crash.
- **Redirects or URL changes of any kind:** locked out (REQUIREMENTS.md Out of Scope, D-31). Detection produces a language, never a navigation.
- **Special-casing `<title>`/meta in the engine:** D-27 explicitly reuses the attr mechanism — meta tags get `data-i18n-attr="content:{ns}.meta.desc"` in HTML; `<title>` already has `data-i18n`. Engine code is identical for all nodes [VERIFIED: 03-CONTEXT.md:19].
- **Loading the script on privacy.html/404.html:** D-37 restricts the script tag to the 3 keyed pages; those two pages have no slot and no keys [VERIFIED: slot grep — only index.html:30, geohist/index.html:142, guide.html:82 contain `lang-switcher-slot`].

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Language-tag parsing | Full BCP-47 parser / Intl.Locale resolution chains | Lowercase prefix match (`pt*`/`es*`/`en*`) per D-33 | Site supports exactly 3 mappings; a tag parser adds surface with zero benefit at this scope |
| Date/number localization | Custom formatters | Not needed — copy has no dynamic dates/numbers | Static content; dictionaries hold final rendered strings |
| Pluralization machinery | ICU MessageFormat / plural rules | Not needed — EN strings are authored to avoid interpolation; translations mirror sentence-for-sentence | 101 flat keys, no interpolation anywhere in the current surface (verified: all keyed values are complete static sentences) |
| Cookie/Server language negotiation | Any server logic | Impossible on static Pages hosting; navigator API is the standard client path | GitHub Pages cannot execute negotiation |
| Consent/gating logic in engine | Persisting consent alongside lang | Phase 4 concern; engine only emits `persano:langchange` | D-35 keeps zero coupling; localStorage `persano.lang` is functional preference, not tracking [VERIFIED: 03-CONTEXT.md:25, 95] |

**Key insight:** The whole phase fits inside the web platform's free tier. Every "framework feature" an i18n library would add (interpolation, plurals, lazy namespaces, file watching) is dead weight for 101 static keys — and the zero-dependency constraint is a project-level rule, not a preference.

## Common Pitfalls

### Pitfall 1: Snapshot/apply round-trip corruption
**What goes wrong:** Switch ES → EN → ES produces mixed-language text; or EN restore leaves translated attributes behind.
**Why it happens:** Snapshot captured after an apply, or attrs restored from a translated dictionary instead of the snapshot; or the EN path reads a nonexistent `en.json`.
**How to avoid:** Capture once at init before any swap; EN apply = restore snapshot verbatim (D-28); every apply function has exactly two sources (snapshot or dict), never a mix.
**Warning signs:** Second language toggle leaves a few strings in the previous language; after returning to EN, an img alt or aria-label stays translated.

### Pitfall 2: Throwing localStorage access
**What goes wrong:** Engine crashes at init in privacy-restricted browsers (Safari private mode historically threw on `setItem`; some extensions block storage entirely), taking the switcher and swap with it.
**Why it happens:** Unwrapped storage access assumes availability.
**How to avoid:** Wrap every `getItem`/`setItem` in try/catch (Pattern 4); storage failure degrades to detect-on-every-visit, which is acceptable behavior.
**Warning signs:** Console exception in private browsing; switcher missing.

### Pitfall 3: Dictionary fetch failure on file:// / dev-server mismatch
**What goes wrong:** Opening pages via `file://` makes `fetch('/js/i18n/es.json')` fail (CORS/file scheme), so ES/pt-BR silently never apply during local testing — looks like a broken engine when it's an environment artifact.
**Why it happens:** `file://` origin semantics; absolute-root paths also resolve wrong under `file://`.
**How to avoid:** Test against a local HTTP server rooted at the repo (`python -m http.server` or `npx serve`). Absolute-root paths (`/js/i18n/…`) are correct for Pages deploy and match the existing `/css/base.css` convention [VERIFIED: index.html:8].
**Warning signs:** Manual switch does nothing locally but works deployed; 404 in network tab.

### Pitfall 4: Stale or hostile localStorage value
**What goes wrong:** A stored value like `"fr"` or `"undefined"` gets applied as if supported → all keys miss → mixed EN (at best) or exceptions.
**Why it happens:** Validating format but not membership.
**How to avoid:** `readPref()` returns the value only if it's in `SUPPORTED` (Pattern 4); otherwise treat as absent.
**Warning signs:** Behavior differs between first-visit and returning visitors after a key rename.

### Pitfall 5: Multiple `data-i18n-attr` pairs per node parsing errors
**What goes wrong:** A node with `data-i18n-attr="alt:a,aria-label:b"` only gets one attribute translated; silent partial swap.
**Why it happens:** Naive `split(':')` handling that ignores the comma-separated contract.
**How to avoid:** Parse pairs per the locked syntax `attr:key[,attr:key…]` [VERIFIED: 02-01-PLAN.md:92,103]; unit-test the parse with the gallery-tile case (multiple tiles share one key) and any future multi-attr node.
**Warning signs:** Some alts/aria-labels stay EN after switch.

### Pitfall 6: Event dispatched before DOM state is consistent
**What goes wrong:** Phase 4's FIRE-03 listener records a switch whose visible state isn't yet applied (or fires for no-op clicks), producing wrong analytics.
**Why it happens:** Dispatching before the swap pass finishes, or on clicks targeting the already-active language.
**How to avoid:** Dispatch `persano:langchange` as the LAST step after text/attrs/lang/persist; no-op when `to === from` (D-35 wording is "every applied switch" — applied, not attempted).
**Warning signs:** Duplicate analytics events; events for failed switches.

### Pitfall 7: CI regression on the HTML edits
**What goes wrong:** `npm run validate` fails on push because the new `<script>` tag or the keyed meta tag breaks an html-validate rule or a linkinator check.
**Why it happens:** Assuming validator behavior; e.g., linkinator scanning `href="#"` switcher links (it can't — they're JS-injected and invisible to static parsing).
**How to avoid:** Script tag with `src` + `defer` is standard-valid HTML; meta `content` stays a real attribute value. Run `npx html-validate index.html 404.html geohist/*.html` and the link check locally before commit [VERIFIED: package.json:6-8]. Dictionaries aren't referenced by any static href → linkinator can't see them either.
**Warning signs:** Red validate job; linkinator "broken link" on `#`.

### Pitfall 8: Key-count drift between dictionaries and markup
**What goes wrong:** A dictionary misses a key (silent EN retention for that node — acceptable but imperfect) or HTML gains keys later with no dict entry.
**Why it happens:** Hand-authoring 2 × 101 keys against an estimate ("~103") instead of the exact surface.
**How to avoid:** Use the exact extracted inventory below as the authoring checklist; add a cheap CI gate: `node -e "JSON.parse(...)"` on both dictionaries inside `validate` (optional, agent-discretion) plus a key-coverage diff (extract `data-i18n`/`data-i18n-attr` keys from HTML, assert equality with `Object.keys(dict)`).
**Warning signs:** Any node staying EN after a switch.

## Code Examples

### Exact data-i18n key surface (authoring checklist — extract-verified this session)

Extraction command (rerun to re-verify): `Select-String`/regex `data-i18n(?:-attr)?="[^"]*?(hub|geohist|guide)\.[\w.\-]+"` over the 3 pages. 98 unique keys today + 3 keys D-27 adds = **101 dictionary entries per language**.

**hub — 11 keys [VERIFIED: index.html:1-33, full-file Read this session]:**
`hub.brand, hub.card.cta, hub.card.desc, hub.card.icon-alt, hub.card.name, hub.footer.contact, hub.footer.copyright, hub.footer.privacy, hub.intro.1, hub.intro.2, hub.meta.title`
D-27 adds: `hub.meta.desc`

**geohist landing — 51 keys [VERIFIED: geohist/index.html, full key extraction this session]:**
`geohist.about.body, geohist.about.email, geohist.about.title, geohist.cta.badge-alt, geohist.faq.aboutgame.a, geohist.faq.aboutgame.q, geohist.faq.data.a, geohist.faq.data.q, geohist.faq.devices.a, geohist.faq.devices.q, geohist.faq.iap.a, geohist.faq.iap.q, geohist.faq.languages.a, geohist.faq.languages.q, geohist.faq.offline.a, geohist.faq.offline.q, geohist.faq.progress.a, geohist.faq.progress.q, geohist.faq.report.a, geohist.faq.report.email, geohist.faq.report.q, geohist.faq.title, geohist.features.iap.1, geohist.features.iap.title, geohist.features.offline.1, geohist.features.offline.2, geohist.features.offline.title, geohist.features.playgames.1, geohist.features.playgames.title, geohist.features.title, geohist.features.trivia.1, geohist.features.trivia.2, geohist.features.trivia.3, geohist.features.trivia.title, geohist.footer.back, geohist.footer.contact, geohist.footer.copyright, geohist.footer.privacy, geohist.gallery.coming, geohist.gallery.intro, geohist.gallery.tile.aria, geohist.gallery.title, geohist.hero.desc, geohist.hero.icon.alt, geohist.hero.tagline, geohist.hero.title, geohist.meta.title, geohist.nav.aria, geohist.nav.faq, geohist.nav.game, geohist.nav.guide, geohist.nav.privacy`
D-27 adds: `geohist.meta.desc`

**guide — 36 keys [VERIFIED: geohist/guide.html, full key extraction this session]:**
`guide.closing.link, guide.closing.text, guide.footer.back, guide.footer.contact, guide.footer.copyright, guide.footer.privacy, guide.how.intro, guide.how.step.1, guide.how.step.2, guide.how.step.3, guide.how.step.4, guide.how.title, guide.meta.title, guide.modes.1.name, guide.modes.1.desc, guide.modes.2.name, guide.modes.2.desc, guide.modes.3.name, guide.modes.3.desc, guide.modes.4.name, guide.modes.4.desc, guide.modes.5.name, guide.modes.5.desc, guide.modes.6.name, guide.modes.6.desc, guide.modes.7.name, guide.modes.7.desc, guide.modes.8.name, guide.modes.8.desc, guide.modes.intro, guide.modes.title, guide.nav.aria, guide.nav.faq, guide.nav.game, guide.nav.guide, guide.nav.privacy`
D-27 adds: `guide.meta.desc`

**Note:** CONTEXT.md's "~103 keys (landing 56, guide 36, hub 11)" estimate [VERIFIED: 03-CONTEXT.md:17] counts landing as 56; extraction says 51 + 1 meta.desc. Planner should treat the extraction above as the authoring contract and re-run the extraction command as a task verify step.

### Dictionary shape (D-25: flat, 1:1)
```json
{
  "hub.meta.title": "Persano — centro de aplicaciones personales",
  "hub.intro.1": "…",
  "geohist.hero.tagline": "…",
  "geohist.gallery.tile.aria": "Captura de pantalla (próximamente)",
  "guide.modes.8.name": "Pasaporte mundial"
}
```
Values are complete final strings — no interpolation, no nesting, no plural forms. Identity strings translate to themselves: `geohist.about.email` stays `santiagopostorivo@gmail.com`, copyright stays `© Persano — Santiago David Postorivo` [VERIFIED: geohist/index.html:132 keyed email value].

### D-27 bake points (one-line edits)
```html
<!-- index.html:6 → add to existing meta -->
<meta name="description" content="Persano is the personal apps hub …" data-i18n-attr="content:hub.meta.desc" data-i18n-attr-only>
<!-- geohist/index.html:6 -->
<meta name="description" content="GeoHist Trivia is a playful …" data-i18n-attr="content:geohist.meta.desc" data-i18n-attr-only>
<!-- geohist/guide.html:6 -->
<meta name="description" content="How to play GeoHist Trivia — …" data-i18n-attr="content:guide.meta.desc" data-i18n-attr-only>
```
[VERIFIED: meta desc lines quoted verbatim from index.html:6, geohist/index.html:6, geohist/guide.html:6 this session]

### Script tag (3 pages, before `</head>` after the CSS link — order irrelevant for defer)
```html
<script defer src="/js/i18n.js"></script>
```
`defer` guarantees execution after full DOM parse (all keyed nodes exist) without blocking first paint [ASSUMED — HTML standard behavior]. EN snapshot can then run immediately at script execution; no DOMContentLoaded listener strictly required, though wrapping in one is harmless belt-and-suspenders.

### Engine flow (complete pseudocode, dependency-free)
```javascript
(function () {
  'use strict';
  var SUPPORTED = ['en', 'es', 'pt-BR'];
  var STORAGE_KEY = 'persano.lang';
  var dicts = {};           // lang -> object
  var snapshot = [];
  var current = 'en';

  capture();                // 1. EN snapshot (D-28)
  renderSwitcher('en');
  var target = readPref() || detect();                       // D-32/D-34
  if (target !== 'en') {
    loadDict(target).then(function (dict) {
      if (!dict) return;                                     // D-30 silent EN fallback
      applyDict(target);                                     // swap + html.lang (D-29)
      current = target;
      markSwitcherActive(target);
      dispatchLangChange('en', target);                      // D-35, last step
    });
  }
  // switchTo(lang): no-op if lang===current; EN → applySnapshot(); else loadDict→apply;
  //   persist ONLY after successful apply; failed switch = silent no-op (D-30)
  // manual switch dispatches persano:langchange {from:current, to:lang}
})();
```

### Terminology reference (ES copy)
`C:\Users\Familia\antigravity\GeoHist-Trivia\translations.json` — top-level `es`/`fr`/`it`; the `es` object holds 247 entries, all proper-noun glossary (country/city/figure names — e.g. `Queen Victoria`, `Nairobi`, `Bosnia and Herzegovina`) [VERIFIED: file read this session]. Useful for consistent ES naming of places/figures inside FAQ/guide copy; game-mode UI terms ("Flags", "Capitals"…) are NOT in this file — draft fresh es-419 copy (D-39/D-40) and let owner review.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Per-language HTML subdirs + hreflang + redirect script | JS dictionary swap on one HTML set | Locked at project init (REQUIREMENTS.md Out of Scope) | AGENTS.md/STACK.md §7 is STALE for i18n — do not follow it [VERIFIED: 03-CONTEXT.md:71, REQUIREMENTS.md:78] |
| Legacy i18n libs (i18next, polyglot) for DOM-swap sites | Native `data-i18n` convention + flat JSON | Long-standing lightweight pattern | Zero deps, ~200 lines; scale trigger for a real framework is far away (17 more locales = v2, still fine flat) |
| `navigator.language` single-value detection | `navigator.languages` array first-match | Supported in all evergreen browsers for years | D-32 picks the array; en-US-primary + es-secondary browsers get Spanish [ASSUMED — API standard] |

**Deprecated/outdated for this phase:** hreflang link tags, redirect-on-detect scripts, `es.json`-style EN dictionary, any build-step i18n — all either locked out by decision or unnecessary.

## Assumptions Log

> External doc verification was unavailable this session (webfetch proxy-blocked: even `https://example.com` returned 404 via the tool; no WebSearch/context7/tavily/exa/brave MCPs present). Platform-API claims below are stable web-standard facts from training knowledge — flag for any executor surprise, but drift risk is minimal.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `navigator.languages` is a readonly array ordered most-preferred-first; `navigator.language` is the primary tag | Pattern 2 | Detection picks wrong language → wrong-but-functional language shown; switcher always recovers (manual override) |
| A2 | `<script defer src>` executes after DOM parse completes, before `DOMContentLoaded`; nodes exist when engine runs | Code Examples | Engine must wrap init in DOMContentLoaded listener — one-line change if timing differs |
| A3 | `localStorage` access can throw in restricted contexts; try/catch guards are sufficient | Pattern 4 | Switcher init could crash in exotic privacy modes → guard order matters; degrade-to-detect path already specified |
| A4 | `aria-current="true"` announces current item in a set to screen readers | Pattern 3 | Cosmetic a11y mismatch; D-38 mandates the attribute regardless |
| A5 | Same-origin `fetch()` of `/js/i18n/*.json` works on GitHub Pages; `.json` served with valid JSON content-type | Architecture | Fetch fails → silent EN fallback (already the designed behavior — worst case = feature no-ops) |
| A6 | html-validate accepts `<script defer src>` and the keyed meta tags; linkinator ignores JS-injected anchors and doesn't flag `href="#"` static links (none exist) | Pitfall 7 | CI red → adjust config or markup; trivial fix |
| A7 | GitHub Pages serves static assets with short cache (max-age ~600s) so dictionary edits propagate quickly | Discretion (caching) | Stale dictionaries for ≤10 min post-deploy — cosmetic |
| A8 | `<title>` textContent swap updates the tab title | Summary | Title stays EN → SC4 partially unmet; trivial to fix (title IS a regular node in the walk) |

## Open Questions

1. **Dispatch `persano:langchange` on the initial auto-detect apply?**
   - What we know: D-35 says "on every applied switch"; auto-detect apply IS an applied switch (from 'en').
   - What's unclear: Whether Phase 4 FIRE-03 wants first-visit auto-applies counted as "language switches" for analytics.
   - Recommendation: Dispatch on initial apply too (`{from:'en', to:detected}`) — Phase 4 can filter by a flag if needed; zero coupling now.
2. **Persist auto-detected language, or explicit choice only?**
   - What we know: D-34 fixes the shared key; SC2 requires persistence only for manual choice.
   - What's unclear: Whether a returning auto-detected visitor should skip detection.
   - Recommendation: Persist explicit manual choice only; auto-detect re-runs each visit (result is deterministic per browser anyway). Executor's discretion.
3. **Add CI JSON-parse + key-coverage gate to `npm run validate`?**
   - What we know: Nothing in package.json validates dictionaries today; Pitfall 8 shows drift is the likeliest slow-burn defect.
   - Recommendation: Yes — two cheap `node -e` checks in the validate chain. Optional (plan-level call), high value/zero risk.

## Environment Availability

Phase is code/config-only (no new tools, no external services). Execution-time needs:

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Local HTTP server (repo-rooted) | Manual verification of fetch + switch behavior | — (not a repo artifact; trivially available) | — | `python -m http.server` or `npx serve` from repo root |
| Browser with changeable language | SC verification (es/pt-BR detection paths) | ✓ (any evergreen browser) | — | DevTools: `chrome://flags` lang override or DevTools Sensors locale |
| Node.js | CI validate (`npm run validate`) — already green pattern | ✓ | 24 in CI [VERIFIED: .github/workflows/deploy.yml:21-23] | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none.
**Note:** local npm CLI is proxy-broken on this machine (known from Phase 1 — `npm install` fallback documented in deploy.yml) but `node` itself runs fine for `node -e` dictionary checks.

## Sources

### Primary (HIGH confidence)
- In-repo read this session: index.html (full), geohist/index.html:4-9 + 130-145, geohist/guide.html:1-10 + 73-85, css/base.css:350-360, package.json, .github/workflows/deploy.yml, geohist/privacy.html:1-12, 03-CONTEXT.md, REQUIREMENTS.md, STATE.md, 02-01-PLAN.md:88-142
- In-repo verified extraction: full data-i18n key surface (98 unique keys) via regex extraction over the 3 pages (command reproduced in Code Examples)
- `C:\Users\Familia\antigravity\GeoHist-Trivia\translations.json` — ES glossary structure (247 proper-noun entries)

### Secondary (MEDIUM confidence)
- None this session — external fetch unavailable

### Tertiary (LOW confidence — verify at execution if behavior surprises)
- Web-platform API behaviors (navigator.languages, defer timing, localStorage exceptions, aria-current, GH Pages caching) — tagged [ASSUMED] above; stable standard knowledge, no session verification possible

## Metadata

**Confidence breakdown:**
- In-repo key contract & surface: HIGH — every claim read from source files this session with verbatim quotes
- Engine architecture & patterns: MEDIUM-HIGH — patterns derive from verified D-decisions + standard platform APIs; API details [ASSUMED]
- Pitfalls: MEDIUM — standard vanilla-JS i18n failure modes from training knowledge, not session-verified
- Translation content quality: n/a — D-39/D-40 make copy agent-drafted with owner review after execution

**Research date:** 2026-09-02
**Valid until:** 2026-10-02 (stable domain; no fast-moving dependencies)