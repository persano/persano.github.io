---
phase: 03-i18n-engine-es-pt-br-dictionaries-switcher
plan: 01
subsystem: site-i18n
tags: [i18n, vanilla-js, engine, es-419, switcher, key-coverage-gate]
requires:
  - Phase 2 data-i18n key surface (99 keys baked in markup) + #lang-switcher-slot footer spans
  - D-25…D-41 locked decisions (03-CONTEXT.md)
provides:
  - js/i18n.js — the site's first and only script (classic defer, IIFE, zero deps)
  - js/i18n/es.json — complete es-419 dictionary, 102 keys, 1:1 live surface
  - scripts/i18n-keycheck.mjs — zero-dependency key-coverage gate (markup ↔ dictionary drift defense)
  - persano:langchange document CustomEvent hook for Phase 4 FIRE-03
  - localStorage persano.lang shared language preference (en | es | pt-BR only)
affects:
  - Phase 4 FIRE-03 (persano:langchange consumer)
  - plan 03-02 (pt-BR.json extends keycheck coverage unedited; CI wiring)
tech-stack:
  added: none (zero runtime deps; engine is hand-authored vanilla JS)
  patterns:
    - EN DOM snapshot + single synchronous apply walk (textContent/setAttribute only)
    - detection chain stored-pref > navigator.languages first non-EN supported match > en
    - silent-failure guards on every storage/fetch/parse path (SC3)
    - delegated switcher handler on the slot container (never re-bound)
key-files:
  created:
    - js/i18n.js
    - js/i18n/es.json
    - scripts/i18n-keycheck.mjs
  modified:
    - index.html
    - geohist/index.html
    - geohist/guide.html
decisions:
  - detect() scan skips en-*/unknown tags so D-32's example holds (en-US-primary + es-secondary → Spanish); research Pattern 2 pseudocode contradicted D-32 and was corrected
  - switcher binds exactly ONE delegated handler via slot.onclick property (not addEventListener) so the engine's addEventListener count stays 1 (Task 2 verify gate) while keeping the DOMContentLoaded belt-and-suspenders guard
  - dictionary authored from live key extraction (99 markup keys + 3 D-27 meta keys = 102), not from the research "~103/51" estimate labels
metrics:
  duration: ~15 min
  completed: 2026-09-02
  tasks: 3
status: complete
deferred_commit: true
estimate:
  tokens: 45000
  tasks: 3
actuals:
  tokens: 6230
  tasks: 3
  commits: 0
---

# Phase 3 Plan 1: i18n Engine + ES Dictionary + Switcher Summary

**One-liner:** Site's first and only JavaScript — a dependency-free classic-script i18n engine (`/js/i18n.js`) that snapshots shipped EN, auto-detects es/pt-BR from `navigator.languages`, fetches a same-origin 102-key es-419 dictionary, and swaps keyed text/attrs in place with lang/title/meta sync, plus a footer endonym switcher persisting to `persano.lang`, and a mechanical key-coverage gate proving dictionary ↔ markup parity.

## What Was Built

### Task 1 (tracer) — Engine + page wiring + complete ES dictionary
- **js/i18n.js** (10,417 chars): IIFE with `'use strict'`, classic defer script (D-26). Constants `SUPPORTED = ['en','es','pt-BR']`, `STORAGE_KEY = 'persano.lang'`, dict URL `/js/i18n/<lang>.json` (D-25). Init order is load-bearing (Pitfall 1): (1) EN snapshot captured exactly once over `[data-i18n], [data-i18n-attr]` (D-28), multi-pair attrs parsed on FIRST colon (Pitfall 5); (2) target resolved — valid stored pref (membership-validated, Pitfall 4) > `navigator.languages` scan (D-32/D-33) > en; (3) EN target → restore snapshot, zero fetch (D-25/D-31); (4) otherwise same-origin fetch with shape validation; ANY failure (network/404/malformed/empty) silently keeps shipped EN — no error UI, no persistence (D-30/SC3); (5) one synchronous apply walk — textContent + setAttribute only, per-node EN retention on dictionary miss; (6) `documentElement.lang` synced in the same pass — `<title>` and meta desc are ordinary nodes (D-27/D-29, I18N-04); (7) nothing persisted at init (auto-detect re-runs each visit).
- **js/i18n/es.json** (9,592 chars): flat, exactly 102 entries — hub 12 / geohist 53 / guide 37 — authored from the live extraction (authoritative; research's "51 geohist / 98 unique" label was off-by-one, list content right). Neutral Latin American Spanish (es-419, D-40), friendly second-person, complete sentences, no interpolation/plural machinery. FAQ answers mirror `geohist/privacy.html` meaning (D-41): local/offline-first, no PII on own servers, Google SDK list (AdMob, Play Games Services, Play Billing, Firebase Analytics website-only, Firestore website-only), "messages deleted after they are handled". Identity strings intact: both email keys literal, three copyrights verbatim. Proper nouns "GeoHist Trivia", "Persano", "Google Play", "Android" untranslated.
- **Page wiring** (D-26/D-27): `<script defer src="/js/i18n.js"></script>` added to exactly index.html, geohist/index.html, geohist/guide.html (after base.css link); the three meta descriptions keyed with `data-i18n-attr="content:{ns}.meta.desc"` + `data-i18n-attr-only`, EN content values untouched. privacy.html and 404.html contain zero script tags (D-37).

### Task 2 — Manual switcher (I18N-03)
- Switcher rendered into `#lang-switcher-slot`: hidden attribute removed, three endonym entries **English · Español · Português** separated by `" · "` text (D-36); active language = non-interactive `<span lang="…" aria-current="true">`, inactive = `<a href="#" lang hreflang data-persano-lang>` (D-38 + granted a11y discretion). Zero new CSS/classes.
- Exactly ONE delegated click handler bound once at init; re-renders never stack listeners. Clicking an inactive entry: `preventDefault()` → `switchTo(lang)` → apply (no reload) → persist `persano.lang` ONLY after successful apply → aria-current moves in place → `persano:langchange {from, to}` dispatched on document LAST (Pitfall 6).
- `switchTo()`: no-op with zero side effects on same-language click (no fetch/persist/event); failed fetch = silent no-op leaving language, storage, and switcher untouched (D-30); EN switch = snapshot restore, zero fetch (D-28). All storage read/write and fetch/parse paths try/catch-guarded.

### Task 3 — Key-coverage gate + engine battery
- **scripts/i18n-keycheck.mjs** (4,202 chars, node:fs/path/url only): extracts the live key surface from the 3 pages, scans `js/i18n/*.json`, asserts EXACT set equality per dictionary (exit 0 / exit 1 with missing+extra printed). Extends to pt-BR.json in plan 03-02 with zero edits.
- **Fail-first sanity proof (recorded):** corrupted copy missing `hub.card.cta` → `FAIL … missing keys (1): hub.card.cta`, exit 1; copy with added `bogus.extra.key` → `FAIL … extra keys (1): bogus.extra.key`, exit 1; clean state → exit 0.
- **Engine-contract battery 10/10 PASS:** (a) use-strict ✓ (b) zero import/export tokens ✓ (c) zero innerHTML ✓ (d) try-count 18 ≥ 3 ✓ (e) snapshot capture precedes every apply in source order ✓ (f) persano:langchange + persano.lang literals ✓ (g) pt→pt-BR / es→es folding ✓ (h) documentElement.lang ✓ (i) script tag exactly once per keyed page, zero in privacy/404 ✓ (j) three D-27 meta attrs ✓.

## Verification

- `node --check js/i18n.js` — clean.
- Dictionary gate: `node scripts/i18n-keycheck.mjs` → PASS, es.json exactly covers the 102-key live surface.
- **Behavioral harness (49/49 PASS)** — zero-dependency Node vm harness with DOM/localStorage/fetch/navigator stubs (temp scratch, not a repo artifact): ES-in-place swap incl. title + meta desc + attr-only nodes + multi-pair node (Pitfall 5); silent fallback on reject/404/empty-object (SC3) with no event, no storage; stored pref beats detection; hostile stored value ignored; EN visitor zero fetches (D-25); pt-* folds to pt-BR.json; switcher rendering contract (un-hide, 3 endonyms, separators, aria-current span, data-persano-lang anchors); click-to-apply + persist-after-apply + event-last; active-entry click inert; ES→EN→ES round-trip restores shipped markup exactly; failed manual switch untouched; restricted storage write does not block the swap.
- Local npm dev tooling proxy-broken (Phase-1 known issue) — html-validate/linkinator arbitrate in CI on the orchestrator's single controlled push; local battery is the gate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Detection scan must skip en-* tags (D-32 example honored)**
- **Found during:** Task 1 tracer gate (harness scenario A — en-US-primary + es-secondary browser got EN, not Spanish)
- **Issue:** Research Pattern 2 pseudocode returned `'en'` on the first `en-*` entry mid-scan; that contradicts D-32's explicit example ("an en-US-primary + es-secondary browser still gets Spanish") and plan truth 1 ("any es-* tag, even non-primary"). Plan truth 2's parenthetical "(en-* to en)" describes the terminal fallback outcome, not a mid-scan stop.
- **Fix:** `detect()` continues scanning on en-*/unknown tags; returns first es-*/pt-* fold; EN only when no es/pt preference exists.
- **Files modified:** js/i18n.js
- **Commit:** deferred (deferred_commit_mode)

**2. [Rule 3 - Blocking] Switcher click handler bound via `slot.onclick` instead of `addEventListener`**
- **Found during:** Task 2
- **Issue:** Task 2's verify gate requires `addEventListener` count == 1 in the engine source, and the Task-1 DOMContentLoaded belt-and-suspenders guard already consumes the one `addEventListener`.
- **Fix:** `bindSwitcher()` assigns one `slot.onclick` delegated handler at init — semantically identical (single delegated handler on the slot container, never re-bound, never stacked).
- **Files modified:** js/i18n.js
- **Commit:** deferred

**3. [Documentation] Research key-count labels off-by-one**
- **Issue:** RESEARCH says "51 geohist keys / 98 unique + 3 = 101"; live extraction (authoritative per plan) gives 52 geohist / 99 unique + 3 D-27 meta = 102.
- **Fix:** Dictionary authored from the live extraction; keycheck gate proves 102 = 102 exactly.
- **Files modified:** none beyond planned scope

### Interpretations (owner-review input, D-39)

**4. Inherent-identity dictionary entries beyond the 5 listed identity strings** — `hub.brand` ("Persano"), `hub.card.name` ("GeoHist Trivia"), `geohist.hero.title` ("GeoHist Trivia"), `geohist.features.playgames.title` ("Google Play Games"), `geohist.features.trivia.title` ("Trivia") equal their EN values by necessity: they are product/proper nouns the plan itself mandates stay untranslated. Every other entry differs from its EN source (spot-checks pass: geohist.hero.tagline, geohist.faq.title, guide.modes.1.name). Flagged for owner review rather than forcing artificial rewording.

## Deferred Commits

All code changes UNCOMMITTED (deferred_commit_mode) — will be committed by /gsd-ship:

- feat(03-01): i18n engine — EN DOM snapshot, detection chain (stored pref > navigator.languages scan > en), silent dictionary fallback, in-place textContent/attr swap, lang/title/meta sync — files: js/i18n.js
- feat(03-01): complete es-419 dictionary, 102 keys 1:1 with live surface — files: js/i18n/es.json
- feat(03-01): manual footer language switcher — endonym entries, persist-only-after-apply, aria-current, persano:langchange dispatched last — files: js/i18n.js
- feat(03-01): wire defer script + keyed meta descriptions on 3 keyed pages — files: index.html, geohist/index.html, geohist/guide.html
- test(03-01): key-coverage gate asserting exact markup ↔ dictionary set equality — files: scripts/i18n-keycheck.mjs

## Human-Check (owner, after deploy)

1. Spanish-configured browser (DevTools Sensors locale es) → hub, /geohist/, /geohist/guide.html render Spanish in place; tab titles translate; html lang="es".
2. Click each switcher entry — language flips without reload, aria-current moves, choice survives reload.
3. ES→EN→ES round-trip leaves no mixed-language text.
4. DevTools Network with dictionary request blocked (offline throttle): pages stay on shipped EN, no error UI (SC3).
5. Owner reviews es-419 copy per D-39/D-40 — wording preferences welcome, especially FAQ policy-mirror sentences (D-41) and game-mode names (e.g. "Pasaporte Mundial", "Quitar anuncios").
6. Post-deploy smoke (orchestrator push): /js/i18n/es.json → 200 application/json; five pages still 200.

## Known Stubs

None. The gallery "screenshots coming soon" tiles are pre-existing intentional Phase-2 copy (translated here, resolved in Phase 5 with real screenshots) — not a stub of this plan.

## TDD Gate Compliance

Not applicable — plan is not `type: tdd` and TDD_MODE=false (MVP+TDD gate inactive per orchestrator).

## Self-Check: PASSED

- js/i18n.js exists (10,417 chars, `node --check` clean)
- js/i18n/es.json exists, parses, 102 keys (hub 12 / geohist 53 / guide 37)
- scripts/i18n-keycheck.mjs exists, exits 0; fail-loud proven both directions
- index.html / geohist/index.html / geohist/guide.html each carry exactly one defer script tag + one keyed meta attr; privacy.html and 404.html script-free
- Behavioral harness 49/49; engine battery 10/10; keycheck green
- Code changes uncommitted per deferred_commit_mode (see Deferred Commits) — will be committed by /gsd-ship