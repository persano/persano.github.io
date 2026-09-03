---
phase: 04-consent-gate-firebase-analytics-contact-form
plan: 01
subsystem: analytics
tags: [firebase, ga4, gdpr, consent-banner, localstorage, vanilla-js, dynamic-import, i18n]

# Dependency graph
requires:
  - phase: 03-i18n-engine-es-pt-br-dictionaries-switcher
    provides: persano:langchange document event (FIRE-03 hook), 1:1 dictionary keycheck gate, keyed-node conventions
  - phase: 01-foundation-deploy-pipeline-skeleton-privacy-policy
    provides: GitHub Actions validate+deploy chain, keyed page scaffolding on hub/geohist/guide
provides:
  - js/consent.js — versioned consent store (localStorage `persano.consent`, JSON {v:1, analytics, ts}), banner control, footer retraction, post-grant Analytics loader (dynamic import IS the gate, isSupported guard, retract-during-load race guard)
  - js/firebase-config.js — real Firebase Web App config (public-by-design; console-side HTTP-referrer restriction applied)
  - Consent banner (hidden-by-default, Accept/Reject equal prominence) + footer Consent re-open link on hub, geohist landing, guide
  - GA4 custom events play_badge_click {page} and language_switch {from,to}, wired only post-grant, send-time isGranted() re-check
  - 7 consent.* keys in both es.json and pt-BR.json (validate:i18n 109-key surface green)
affects: [04-02-contact-form, phase-5-verification, gsd-verify-work]

# Actuals (#2632)
actuals:
  tokens: 5721   # chars/4 over the realized production diff 1776d59..1a7d322 (22,884 chars); .planning bookkeeping excluded
  tasks: 3
  commits: 6     # 62e4348, d9a424c, 173333b, 1a7d322, f1b909d + close-out docs commit

tech-stack:
  added: [Firebase JS SDK 12.18.0 modular ESM via gstatic CDN (dynamic import only), GA4 custom events]
  patterns: [load-gating consent (no script tags, dynamic import post-grant), fail-closed versioned consent store, delegated single click handler on banner section, send-time consent re-check in event wrappers]

key-files:
  created: [js/consent.js, js/firebase-config.js, .planning/phases/04-consent-gate-firebase-analytics-contact-form/04-USER-SETUP.md]
  modified: [index.html, geohist/index.html, geohist/guide.html, css/base.css, js/i18n/es.json, js/i18n/pt-BR.json]

key-decisions:
  - "Real Firebase Web App config committed to js/firebase-config.js — public by design; secrecy surface handled console-side (API key HTTP-referrer restriction to https://persano.github.io/*) and by Firestore rules in plan 04-02"
  - "Live 6-check battery (fresh-incognito zero-request, Accept/Reject network flows, GA4 DebugView events) NOT executed by owner yet — deferred to phase verification (UAT) as human-needed checks, per honest-resume instruction"
  - "Banner section ships without role=region (section already has implicit region role; aria-label retained) — redundant-role fix during Task 1"

patterns-established:
  - "Consent gate: zero vendor bytes pre-grant; js/consent.js is the only file importing the Analytics module; HTML carries no firebasejs references"
  - "Fail-closed consent store: absent/malformed/storage-blocked treated as no choice; banner returns; write failure keeps choice session-only"
  - "Retraction without unload: wrappers no-op via send-time isGranted(); setAnalyticsCollectionEnabled(false) flips collection when SDK loaded"
  - "Classic defer script trio order (i18n.js -> firebase-config.js -> consent.js) is load-bearing on every engine-carrying page"

requirements-completed: [FIRE-01, FIRE-02, FIRE-03]

coverage:
  - id: D1
    description: "Consent store round-trips: absent/malformed -> banner re-shows; Accept -> {v:1,analytics:'granted',ts ISO-8601}; Reject -> {v:1,analytics:'denied',ts}; storage write failure -> session-only"
    requirement: FIRE-01
    verification:
      - kind: other
        ref: "node vm behavioral harness (re-created this close-out): T1 absent-unhides, T2 accept JSON, T3 reject JSON, T4 malformed x2, T7 write-failure, T8 pre-stored granted/denied — 8/8 PASS"
        status: pass
    human_judgment: false
  - id: D2
    description: "FIRE-02 zero-bytes structural gate: no HTML file references firebasejs; firebase-analytics imported in exactly one file (js/consent.js); dynamic import executes only on granted path; Reject path issues zero vendor imports"
    requirement: FIRE-02
    verification:
      - kind: other
        ref: "source assertions: firebasejs across 5 HTML files = 0 hits; single-import gate = ['js/consent.js']; harness T3 imports==[] ; npm run validate exit 0"
        status: pass
    human_judgment: false
  - id: D3
    description: "Banner markup on 3 engine-carrying pages (exactly 2 keyed buttons, ships hidden, equal prominence, no dismiss), footer consent-reopen link per page, script-trio order i18n->config->consent, 7 consent.* keys 1:1 in es.json + pt-BR.json"
    requirement: FIRE-01
    verification:
      - kind: other
        ref: "source-check script: banner buttons=2 + hidden + reopen + keys on all 3 pages; script order asserted; both dictionaries carry all 7 keys; validate:i18n 109-key surface PASS"
        status: pass
    human_judgment: false
  - id: D4
    description: "FIRE-03 consent-gated events: play_badge_click {page: location.pathname} on .badge-cta, language_switch {from,to} on persano:langchange (every occurrence incl. init auto-apply), wired only after successful analytics instance, isGranted() re-check per send"
    requirement: FIRE-03
    verification:
      - kind: other
        ref: "harness T2: play_badge_click {page:'/geohist/'} + language_switch {from:'en',to:'es'} logged post-grant; T5/T6: sends stop after retraction; T3: no sends on deny"
        status: pass
    human_judgment: false
  - id: D5
    description: "LIVE battery on deployed site: fresh-incognito zero vendor requests pre-consent; vendor traffic appears post-Accept; GA4 DebugView shows both events with params; reject path leaves zero vendor requests and stops sends"
    requirement: FIRE-02
    verification: []
    human_judgment: true
    rationale: "Requires a real browser session against https://persano.github.io with DevTools Network + Firebase Console DebugView — no automation can prove zero-byte live network behavior in this repo's tooling. Owner has NOT yet run the six checks; verification transfers to phase UAT (VERIFICATION.md human_verification), where the verifier surfaces it as human_needed."

# Metrics
duration: "4h 46m wall-clock spanning the Task-3 checkpoint pause (active execution ~45 min: tasks 18:59-19:03, config paste 21:53, close-out 01:18Z Sep 3)"
completed: 2026-09-03
status: complete
---

# Phase 4 Plan 01: Consent Gate + Firebase Analytics Summary

**GDPR consent gate (fail-closed store, Accept/Reject banner, footer retraction) on the 3 engine-carrying pages with Firebase Analytics loading exclusively via dynamic import after grant — real Web App config live on https://persano.github.io, both FIRE-03 events wired, zero vendor bytes pre-consent enforced structurally.**

## Performance

- **Duration:** 4h 46m wall-clock (spanning the Task 3 human checkpoint pause; active execution ≈45 min)
- **Started:** 2026-09-02T21:59:15Z (first task commit 62e4348)
- **Completed:** 2026-09-03T01:45:00Z (close-out commit)
- **Tasks:** 3 of 3 (Task 3 checkpoint resolved by owner: config pasted, merged, deployed)
- **Files modified:** 10 (9 production + 1 planning guide)

## Accomplishments

- js/consent.js (234 lines): versioned fail-closed consent store, banner show/hide with ONE delegated click handler, footer retraction reopen, post-grant loader (pinned 12.18.0 CDN dynamic import → initializeApp → isSupported() guard → getAnalytics), retract-during-load race guard, play_badge_click + language_switch wrappers with send-time isGranted() re-check
- Banner markup + consent script trio + footer Consent link rolled to hub /index.html, /geohist/index.html, /geohist/guide.html (privacy.html and 404.html deliberately untouched — last commits on them remain Phase 1's)
- Real Firebase Web App config in js/firebase-config.js (5 keys, zero PASTE_FROM_FIREBASE_CONSOLE placeholders); owner applied HTTP-referrer API-key restriction in Google Cloud Console; merged to main 7012121, CI run 33701412694 validate+deploy green, site live
- 7 consent.* keys added 1:1 to es.json + pt-BR.json; validate:i18n green on the grown 109-key surface
- 04-USER-SETUP.md documents the console prerequisites (Web App registration done; authorized domain / Anonymous provider / Firestore pending — these gate 04-02)

## Task Commits

1. **Task 1: End-to-end consent gate on /geohist/index.html (tracer)** - `62e4348` (feat)
2. **Task 2: Banner roll-out to hub + guide, consent.* keys in both dictionaries** - `d9a424c` (feat)
3. **User-setup guide** - `173333b` (docs)
4. **Task 3: real Firebase config pasted** - `1a7d322` (feat)
5. **Checkpoint state sync** - `f1b909d` (docs)
6. **Merge to main + deploy** - `7012121` (orchestrator push; CI green)
7. **Close-out docs (SUMMARY + STATE + ROADMAP)** - this commit (docs)

## Files Created/Modified

- `js/consent.js` - consent store + banner control + retraction + post-grant Analytics loader + both FIRE-03 event wrappers
- `js/firebase-config.js` - window.persanoFirebaseConfig with the real 5-value Web App config
- `index.html`, `geohist/index.html`, `geohist/guide.html` - banner section, footer Consent link, script-trio order
- `css/base.css` - .consent-banner fixed-bottom styles on existing theme tokens
- `js/i18n/es.json`, `js/i18n/pt-BR.json` - 7 consent.* keys each (109-key 1:1 surface)
- `.planning/phases/04-consent-gate-firebase-analytics-contact-form/04-USER-SETUP.md` - Firebase console prerequisite guide

## Decisions Made

- Real config committed (per plan Task 3: values are public-by-design and committable); protection lives in the referrer restriction + future Firestore rules, not in hiding the apiKey
- Owner's six-check live battery deferred to UAT rather than claimed passed — resume instruction requires honest transfer to phase verification (see Deviations)
- Init-time language auto-apply logs language_switch (locked research choice; zero i18n.js changes)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Redundant role=region removed from banner section**
- **Found during:** Task 1 (tracer)
- **Issue:** Plan-specified markup `<section class="consent-banner" role="region" aria-label=...>` duplicates the implicit region role a section with an accessible name already has — a redundant-role a11y warning
- **Fix:** Shipped the section with aria-label only (no explicit role): `<section class="consent-banner" aria-label="Cookie consent" data-i18n-attr="aria-label:consent.banner.aria" data-i18n-attr-only hidden>`
- **Files modified:** geohist/index.html (and the duplicated blocks in index.html, geohist/guide.html)
- **Verification:** html-validate green; banner still announced as region via implicit role + aria-label
- **Committed in:** 62e4348 (part of task commit)

### Pending Human Verification (transferred to UAT — NOT claimed passed)

**2. Live 6-check battery on the deployed site is PENDING**
- **What:** The six live browser checks from Task 3's how-to-verify: (1) fresh-incognito zero requests to www.gstatic.com/firebasejs, googletagmanager.com, firebaseinstallations.googleapis.com, firebase.googleapis.com; (2) Accept → vendor hosts appear; (3) Play badge click → GA4 DebugView play_badge_click {page}; (4) language switch → language_switch {from,to}; (5) footer Consent re-open → Reject → stored flip, no new wrapper sends; (6) fresh session Reject-first → zero vendor requests at any point
- **Status:** NOT run by owner ("continue" given without the battery). NOT claimed passed. In-repo structural + behavioral equivalents pass (source assertions + Node vm harness 8/8), but live network/DebugView proof requires a human browser session
- **Transfer:** These checks move to phase verification — VERIFICATION.md human_verification / UAT (deliverable D5 above, human_judgment: true) — where the verifier surfaces them as human_needed, the designed honest path
- **Files modified:** none (verification-only gap)

---

**Total deviations:** 1 auto-fix (redundant-role a11y) + 1 pending-verification transfer
**Impact on plan:** Code-level scope fully delivered and in-repo-verified; the live proof of FIRE-02/FIRE-03 is explicitly carried into phase UAT rather than asserted.

## Issues Encountered

- Close-out harness (re-created Node vm battery) needed realm-safe assertions (vm-context objects carry a separate Object.prototype → deepStrictEqual false-fails; replaced with JSON comparison) and longer waits for the delayed-import race case (T6). Harness-only fixes; no site code changed.
- Linkinator scans 0 links locally (pre-existing validate:links behavior, out of scope).

## User Setup Required

**Partially resolved; remainder gates plan 04-02 (not this plan).** See [04-USER-SETUP.md](./04-USER-SETUP.md):
- ✅ Firebase Web App registered; real config pasted + committed; API key referrer-restricted to https://persano.github.io/*
- ⬜ Authorized domain persano.github.io added (Authentication settings) — 04-02
- ⬜ Anonymous sign-in provider enabled — 04-02
- ⬜ Firestore created (production mode) — 04-02

## Next Phase Readiness

- Plan 04-02 (contact form + Firestore rules) can start: consent gate is live, dictionaries have the consent surface, deploy pipeline green with real config
- Blockers for 04-02: the three ⬜ console items above (Anonymous provider, Firestore, authorized domain)
- Open verification debt: live 6-check battery (D5) — to be discharged in phase UAT; GA4 DebugView needs the site visited with debug mode on
- Known deferred: owner review of ES/pt-BR banner translations (D-39 pattern), App Check (FIRE-07, v2)

---
*Phase: 04-consent-gate-firebase-analytics-contact-form*
*Completed: 2026-09-03*

## Self-Check: PASSED (in-repo scope)

Verified before commit:
- All key files exist on disk: js/consent.js, js/firebase-config.js, css/base.css, js/i18n/es.json, js/i18n/pt-BR.json, 04-USER-SETUP.md, this SUMMARY — 7/7 FOUND
- All task commits exist in git history: 62e4348, d9a424c, 173333b, 1a7d322 — 4/4 FOUND
- `npm run validate` (html-validate + linkinator + i18n-keycheck) exit 0 post-config — PASS
- Source assertions: zero firebasejs in 5 HTML files; single-file analytics import gate; banner 2-button/hidden structure + script order on 3 pages; 7 consent.* keys in both dictionaries — PASS
- Node vm behavioral harness (re-created): 8/8 PASS (store round-trips, reject zero-imports, retraction lever, race guard, write-failure session-only)
- Config placeholders: grep PASTE_FROM_FIREBASE_CONSOLE = 0
- **Explicitly NOT verified (pending human):** the live 6-check battery + GA4 DebugView on the deployed site — recorded as deliverable D5 (human_judgment: true) and windows-ledger entry #5 (unrun-verify, open); transfers to phase UAT (VERIFICATION.md human_verification)