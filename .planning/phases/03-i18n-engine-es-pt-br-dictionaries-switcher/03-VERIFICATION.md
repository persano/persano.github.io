---
phase: 03-i18n-engine-es-pt-br-dictionaries-switcher
verified: 2026-09-02T18:40:00Z
status: human_needed
score: 10/14 must-haves verified
behavior_unverified: 4
overrides_applied: 0
behavior_unverified_items:

  - truth: "A browser preferring any es-* (or pt-*) tag sees Spanish/pt-BR copy applied in place on hub, landing, guide — same URL, no redirect (SC1; I18N-01/02)"
    test: "Set browser/DevTools locale to es (then pt-BR), load /, /geohist/, /geohist/guide.html"
    expected: "Copy, <title>, meta description, and html lang flip to es (then pt-BR); URL unchanged; EN markup untouched without JS"
    why_human: "Browser-runtime behavior — no DOM test framework in a zero-dependency project; source+executor harness (49/49, 19/19) assert the chain but true rendering needs a browser"

  - truth: "Manual switcher applies language without reload and persists across reload (SC2; I18N-03)"
    test: "Click Español / Português / English entries in the footer switcher; reload"
    expected: "Language flips in place, aria-current moves, choice survives reload; re-clicking the active language does nothing"
    why_human: "Click/reload lifecycle is browser-runtime; persistence contract source-asserted only"

  - truth: "Dictionary fetch/parse failure leaves shipped EN with no error UI (SC3)"
    test: "Open a keyed page with the /js/i18n/*.json request blocked (offline throttle), then reload normally"
    expected: "Page stays on EN silently in the blocked case; translations return when unblocked"
    why_human: "Network-failure path requires DevTools throttling; engine guards are try/catch source-asserted"

  - truth: "html lang, <title>, meta description sync on every applied switch (SC4; I18N-04)"
    test: "Switch languages and watch tab title + html lang attribute in DevTools"
    expected: "All three flip together with body text on every applied switch"
    why_human: "Visual tab-title check; meta/lang sync is machine-asserted at source, visual confirmation rides the browser pass"
human_verification:

  - test: "Owner copy review per D-39: es-419 and pt-BR dictionaries — wording, register, game-mode names, FAQ policy-mirror sentences (D-41)"
    expected: "Copy reads naturally; FAQ answers never contradict geohist/privacy.html meaning; identity strings (email, copyrights) intact"
    why_human: "Translation semantics and brand voice are judgment-tier; EN stays legally authoritative"

  - test: "Deploy handoff then post-deploy smoke: /gsd-ship commits the deferred code (deferred_commit_mode ledger), orchestrator executes the single controlled push to main, CI validate green (now including the dictionary gate), then load /, /geohist/, /geohist/guide.html, /geohist/privacy.html, /js/i18n/es.json, /js/i18n/pt-BR.json"
    expected: "CI validate green; five pages 200; both dictionary URLs 200 with application/json content-type"
    why_human: "Push-to-main is orchestrator-owned (STATE.md Phase-01 pattern); live URLs cannot be checked before the push exists"
---

# Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher — Verification Report

**Phase Goal:** Spanish and pt-BR visitors read the site in their language with no URL changes or redirects; English always remains the safe, indexable fallback
**Verified:** 2026-09-02T18:40:00Z
**Status:** human_needed (4 behavior-unverified truths + owner copy review + deploy-pending smoke; zero gaps)
**Re-verification:** No — initial verification
**Verifier:** Orchestrator inline (project config `gates.verifier: false` — no verifier subagent; Phase-01 precedent)

## Goal Achievement

### User Flow Coverage (MVP mode — 03-01/03-02 validated user stories)

| # | Step | Expected | Evidence in codebase | Status |
|---|------|----------|---------------------|--------|
| 1 | ES visitor opens any keyed page | Spanish applied in place, no URL change | `js/i18n.js` detect chain (navigator.languages scan ×4 hits, es→es folding) + single-pass textContent/setAttribute apply | ✓ source+harness |
| 2 | ES visitor's fetch fails (offline) | Shipped EN kept silently, no error UI | 18 try/catch guards, response.ok + shape validation, per-node EN retention | ✓ source (browser proof = human item) |
| 3 | Visitor flips language from footer | 3 endonym entries, apply without reload, aria-current moves | `lang-switcher-slot` render, `data-persano-lang` ×5, exactly 1 delegated listener | ✓ source |
| 4 | Choice persists | localStorage `persano.lang`, written only after successful apply | membership-validated reads, persist-after-apply order in switchTo | ✓ source (reload proof = human item) |
| 5 | Visitor returns to English | Shipped markup restored exactly, zero fetch | EN snapshot (D-28) restore path, no en.json exists | ✓ source |
| 6 | pt-BR visitor | pt-* folds to pt-BR, `/js/i18n/pt-BR.json` fetched | pt→pt-BR folding in engine; pt-BR.json 102 keys key-identical | ✓ source (browser proof = human item) |
| 7 | Tab title + meta description follow language | lang/title/meta sync atomically | documentElement.lang in apply pass; 3 keyed meta attrs (hub/geohist/guide.meta.desc) | ✓ source |
| 8 | CI never ships drift | Dictionary gate in validate chain | `package.json` validate:html → validate:links → validate:i18n; keycheck exit 0 locally | ✓ machine |

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | ES/pt-BR auto-detect applies in place, no redirects (SC1) | ⚷ BEHAVIOR | detect chain source-verified (navigator.languages ×4, folding present); executor harness 49/49 + 19/19; browser proof = human item 1 |
| 2 | Resolution order stored > detect > en (D-32/33/34) | ✓ VERIFIED | `js/i18n.js` — stored pref membership-validated, navigator scan, en fallback |
| 3 | Silent EN fallback on any fetch/parse/shape failure (SC3) | ⚷ BEHAVIOR | 18 try/catch guards, ok-guard, non-empty-object validation; offline proof = human item |
| 4 | lang/title/meta sync on every applied switch (SC4) | ✓ source-asserted | documentElement.lang ×2 in apply pass; title+meta are keyed nodes; visual = behavior item |
| 5 | Switcher: 3 endonyms, active span aria-current, on exactly 3 keyed pages | ✓ VERIFIED | slot un-hidden, data-persano-lang ×5, aria-current ×2; script tag ×1 per keyed page, ×0 in privacy.html + 404.html |
| 6 | Click applies without reload; persists after success; langchange dispatched last | ✓ source-asserted | addEventListener == 1 (delegated), persano:langchange ×3; click/reload = behavior item |
| 7 | EN restore exact, no en.json (D-28) | ✓ VERIFIED | snapshot capture precedes apply; Test-Path js/i18n/en.json = False |
| 8 | EN visitors fetch zero bytes (D-25) | ✓ source-asserted | en target → snapshot restore path, no fetch branch |
| 9 | es.json maps 1:1 to live key surface | ✓ MACHINE | keycheck exit 0 — 102=102 exact, fail-loud proven both directions (missing + extra key) |
| 10 | pt-* sees pt-BR applied (03-02) | ⚷ BEHAVIOR | folding + pt-BR.json delivery source-verified; browser proof = human item |
| 11 | Português entry: same persist-then-emit contract | ✓ source-asserted | same switchTo path as Español |
| 12 | npm run validate includes dictionary gate | ✓ MACHINE | scripts.validate chains validate:i18n; full `npm run validate` exit 0 this run |
| 13 | ES and pt-BR key-identical | ✓ MACHINE | 102=102, key sets JSON-stringify-equal |
| 14 | Identity strings byte-identical EN/es/pt | ✓ MACHINE | email ×2 keys, 3 copyright keys byte-equal; spot keys (hero.tagline, faq.title, modes) distinct from EN and each other |

**Score:** 10/14 source/machine-verified; 4 behavior-unverified (browser-runtime, zero-dependency project) — none gap-class.

## Prohibitions (P1–P4)

| # | Prohibition | Status | Evidence |
|---|------------|--------|----------|
| P1 | No policy-claim drift in ES/pt-BR translations | ⚷ OWNER REVIEW | D-41 meaning-mirror spot-verified by 03-02 vs privacy.html; authoritative check = owner (human item) |
| P2 | No language data leaves the browser | ✓ source-asserted | engine's only network call is the same-origin dictionary fetch; detection is client-side reads |
| P3 | Storage holds only a language code | ✓ source-asserted | persano.lang values restricted to en/es/pt-BR via SUPPORTED membership |
| P4 | No flag icons/country imagery | ✓ BY CONSTRUCTION | three endonym text entries; no img/emoji in switcher markup |

## Requirement Traceability

| Req | Definition | Status |
|-----|-----------|--------|
| I18N-01 | Site copy EN/ES/pt-BR; EN ships raw HTML | ✓ Complete — es.json + pt-BR.json 102 keys each, key-identical; EN raw HTML untouched as baseline |
| I18N-02 | Auto-detect in place, EN fallback on failure | ✓ Complete — detect chain + silent fallback source-verified; browser proof in UAT |
| I18N-03 | Manual switcher overrides detection; persists | ✓ Complete — 3-entry switcher, persano.lang persist-after-apply; click/reload proof in UAT |
| I18N-04 | documentElement.lang + title/meta sync | ✓ Complete — synced in apply pass; 3 keyed meta attrs; visual = UAT |

## Automated Evidence (this verification run)

- `node scripts/i18n-keycheck.mjs` → exit 0: "PASS — es.json exactly covers the 102-key live surface", "PASS — pt-BR.json exactly covers the 102-key live surface"
- `npm run validate` → exit 0 (html-validate clean; linkinator scanned 0 links — known local-mode quirk, compensated by 03-02 battery item 4 manual Test-Path resolution; validate:i18n PASS)
- Engine greps: use strict 1, import/export 0, innerHTML 0, try 18, documentElement.lang 2, navigator.languages 4, persano.lang 1, persano:langchange 3, data-persano-lang 5, aria-current 2, addEventListener 1, lang-switcher-slot 2
- Page greps: script tag 1/1/1 on keyed pages, 0 in privacy.html + 404.html; meta attrs 1/1/1; rel="alternate" 0; no es/ or pt/ dirs
- `git diff HEAD -- geohist/privacy.html 404.html css/base.css` → 0 lines (diff-untouched)
- Dictionary node gate: 102/102 keys, key-identical sets, all values non-empty strings, identity strings byte-equal
- Executor harnesses: 03-01 49/49 behavioral + 10/10 engine battery + fail-loud proven; 03-02 19/19 regression battery + diff-untouched assertions

## Known Stubs / Debt

None introduced. Owner copy review (D-39) is a human item, not a stub. Code changes are UNCOMMITTED per deferred_commit_mode — 5-entry ledger in 03-01-SUMMARY.md + 2 in 03-02-SUMMARY.md; /gsd-ship commits, then orchestrator push.

## Human Verification Items → 03-UAT.md

4 behavior-unverified truths + owner copy review + deploy-pending smoke persisted as UAT items in `03-UAT.md`.