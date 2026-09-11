---
phase: 09-app-check-monitor-first
plan: 01
subsystem: security
tags: [firebase-app-check, recaptcha-v3, contact-form, i18n, analytics, monitoring]

# Dependency graph
requires:
  - phase: 05-firebase-consent-form
    provides: fork-shaped Firebase split (auth+firestore in contact.js, analytics in consent.js), keyed Pattern-5 status nodes, logEventSafe + document-event bridge
  - phase: 07-localization-20-rtl
    provides: 19 dictionaries at exact key parity + i18n-keycheck exact set-equality gate (CJK punctuation scope)
  - phase: 08-custom-domain-migration
    provides: geohisttrivia.com domain locked (reCAPTCHA key registers against it); owner-runbook pattern
provides:
  - Firebase App Check as the 4th lazy 12.18.0 CDN module in contact.js submit path (monitoring mode, dormant while recaptchaSiteKey is empty)
  - Explicit getToken gate — the only observable token-failure seam in monitoring mode
  - contact.status.appcheck keyed status node with email fallback (i18n key #171, 19 dictionaries, atomically)
  - consent-gated appcheck_token_failure Analytics event via the persano:appcheck document-event bridge
  - recaptchaSiteKey public-by-design config field (empty until owner console registration)
affects: [09-02 (owner runbook + privacy disclosure), FIRE-10 (future enforcement flip)]

# Actuals (#2632) — pairs with the plan's estimate (70000 tokens) to calibrate future estimates.
# chars/4 over the realized diff (HEAD~3..HEAD), never a harness token count.
actuals:
  tokens: 6500
  tasks: 2
  commits: 3

# Tech tracking
tech-stack:
  added: []  # no new dependencies — firebase-app-check.js rides the existing pinned 12.18.0 gstatic CDN base
  patterns:
    - "4th lazy submit-time CDN module (modules = { app, auth, firestore, appCheck })"
    - "cache-once module-level instance guard (appCheckInstance) — initializeAppCheck never re-runs on resubmit"
    - "explicit getToken gate gating the auth/firestore chain (monitoring-mode failure seam)"
    - "case-tolerant appcheck-family error mapping (/^app-?check\\//i + permission-denied)"
    - "document-event fork bridge: contact.js dispatches persano:appcheck, consent.js routes to logEventSafe"

key-files:
  created: []  # no new files
  modified:
    - geohist/contact.html
    - js/contact.js
    - js/firebase-config.js
    - js/consent.js
    - js/i18n/*.json (19 dictionaries)

key-decisions:
  - "App Check dormant-by-default: recaptchaSiteKey empty string keeps monitoring mode pre-activation — zero user-visible change until owner console activation (D-01/D-02)"
  - "Explicit getToken(appCheck, false) gate is the only observable token-failure seam in monitoring mode (SDK swallows failures elsewhere) — status UX + Analytics event wired from its rejection (research Pattern 1/2)"
  - "appCheckInstance cache-once guard, not same-options idempotence — resubmit can never re-run initializeAppCheck (Pitfall 2)"
  - "Case-tolerant appcheck-family mapping (/^app-?check\\//i + permission-denied) → dedicated status + consent-gated event; no auto-retry (D-06/D-07)"

patterns-established:
  - "Pattern: submit-time-only attestation — zero reCAPTCHA bytes in served HTML; SDK injects the script at App Check init"
  - "Pattern: one family, one status — init-time and token-time appCheck/* failures map to the same keyed status"
  - "Pattern: token rides the X-Firebase-AppCheck header via the SDK — never written into the addDoc payload"

requirements-completed: [FIRE-07, FIRE-08]

coverage:
  - id: D1
    description: "i18n key #171 contact.status.appcheck at exact 171-key parity across contact.html node + all 19 dictionaries; ja/zh email-free with full-width punctuation; one atomic commit"
    requirement: FIRE-08
    verification:
      - kind: other
        ref: "node scripts/i18n-keycheck.mjs → 19× 'PASS — exactly covers the 171-key live surface' + 'i18n-keycheck: OK' (exit 0)"
        status: pass
      - kind: other
        ref: "npm run validate:html → exit 0"
        status: pass
    human_judgment: false
  - id: D2
    description: "App Check wired as 4th lazy 12.18.0 CDN module in contact.js submit path: init order app → appCheck → getToken → auth → firestore, cache-once guard, dormant while recaptchaSiteKey empty, zero attestation bytes in served HTML"
    requirement: FIRE-07
    verification:
      - kind: other
        ref: "node --check js/contact.js && node --check js/firebase-config.js → exit 0; validate:html + validate:domain → exit 0; grep 'google.com/recaptcha' across served HTML → 0; grep FIREBASE_APPCHECK_DEBUG_TOKEN in js/ → 0"
        status: pass
    human_judgment: true
    rationale: "Runtime monitoring-mode behavior (submit succeeds identically, console accrues metrics) requires a deployed page + browser — plan's post-deploy manual smoke is explicitly non-blocking; automated gates prove syntax + static surface only."
  - id: D3
    description: "Token-failure UX: appcheck-family/permission-denied failures show contact.status.appcheck (email fallback) with no auto-retry; token never enters the addDoc payload"
    requirement: FIRE-08
    verification:
      - kind: other
        ref: "code-level: catch-path mapping verified in js/contact.js (case-tolerant prefix + permission-denied → showStatus('appcheck'), no retry loop); node --check + validate chain → exit 0"
        status: pass
    human_judgment: true
    rationale: "The failure path is observable only with an active site key (or a devtools-blocked attestation script) in a live browser — post-activation owner smoke per plan verification."
  - id: D4
    description: "Consent-gated appcheck_token_failure Analytics event: contact.js dispatches persano:appcheck {code ≤40 chars}; consent.js wireEvents() routes to logEventSafe — silent no-op on deny; no App Check code in consent.js"
    requirement: FIRE-08
    verification:
      - kind: other
        ref: "code-level: single listener verified in js/consent.js (no initializeAppCheck / app-check import / debug literal); node --check → exit 0"
        status: pass
    human_judgment: true
    rationale: "Event delivery requires a runtime appcheck failure while analytics is granted — only provable in a live session; GA4 name follows shipped play_badge_click/language_switch precedent (assumption A1, worst case one-line rename)."

# Metrics
duration: 4min
completed: 2026-09-08
status: complete
---

# Phase 09 Plan 01: App Check Gate + Token-Failure UX Summary

**Firebase App Check wired as the 4th lazy submit-time CDN module in contact.js (monitoring mode, dormant pre-activation) with the getToken failure seam, contact.status.appcheck email-fallback status (i18n key #171 across 19 dictionaries, atomic), and the consent-gated appcheck_token_failure Analytics event.**

## Performance

- **Duration:** 4 min (02:39:23Z → 02:43:53Z)
- **Started:** 2026-09-08T02:39:23Z
- **Completed:** 2026-09-08T02:42:53Z
- **Tasks:** 2
- **Files modified:** 22 task files (1 HTML + 19 JSON + 3 JS)

## Accomplishments
- i18n key #171 `contact.status.appcheck` landed atomically: pre-authored hidden Pattern-5 node in contact.html (D-06 wording verbatim) + the key in all 19 dictionaries, each mirroring its `contact.status.error` email strategy (ja/zh omit the raw email, full-width punctuation only) — keycheck exact set-equality green at 171 keys
- contact.js: 4th pinned-12.18.0 CDN import (`firebase-app-check.js`, namespace `appCheck`), module-level `appCheckInstance` cache-once guard, init order app → appCheck → getToken → auth → firestore, App Check block skipped when `recaptchaSiteKey` is empty (dormant = zero user-visible change), explicit `getToken(appCheckInstance, false)` gate, case-tolerant appcheck-family catch mapping + `permission-denied`, `persano:appcheck` CustomEvent with `detail.code` (≤40 chars), no auto-retry, token never in the addDoc payload
- firebase-config.js: `recaptchaSiteKey: ''` (public-by-design, dormant until owner console registration/activation) + updated header comment
- consent.js: single `persano:appcheck` listener in wireEvents() → `logEventSafe('appcheck_token_failure', { code })` — the event, not the module, crosses the fork; no App Check init/imports/debug literals

## Task Commits

Each task was committed atomically (scoped `query commit`, hooks run):

1. **Task 1: i18n key #171 surface move (node + 19 dictionaries)** - `ed9c605` (feat) — 20 files
2. **Task 2 (tracer): App Check gate end-to-end (4th module, cache-once init, getToken seam, catch mapping, consent-gated event)** - `ce54952` (feat) — 3 files
3. **EOL hygiene fix (deviation, see below)** - `73fd4c2` (style) — 19 files

**Plan metadata:** committed with SUMMARY/STATE/ROADMAP/REQUIREMENTS (`docs(09-01)`).

## Files Created/Modified
- `geohist/contact.html` — one hidden `data-status="appcheck"` / `data-i18n="contact.status.appcheck"` node between error and invalid-email (Pattern-5 shape, plain text with email fallback)
- `js/i18n/*.json` (19 files) — `contact.status.appcheck` added after `contact.status.error` in each; neutral verify framing, no bot/captcha jargon; ja/zh email-free with full-width punctuation
- `js/contact.js` — 4th lazy import, `appCheckInstance` cache-once guard, App Check block + getToken gate in send(), appcheck-family catch mapping + event dispatch, header comment updated to four modules + FIRE-07/FIRE-08 layer
- `js/firebase-config.js` — `recaptchaSiteKey: ''` + public-by-design/dormant-until-activation header comment
- `js/consent.js` — `persano:appcheck` listener in wireEvents() → `appcheck_token_failure` via logEventSafe (fork split untouched)

## Decisions Made
- App Check dormant-by-default (empty `recaptchaSiteKey`) — real users see zero change pre-activation; owner activation fills the key console-side (D-01/D-02)
- Explicit `getToken()` gate — the only observable token-failure seam in monitoring mode; both UX and metric hang off its rejection (research Pattern 1/2)
- `appCheckInstance` cache-once guard instead of same-options idempotence — resubmit-safe against config edits (Pitfall 2)
- One appcheck-family failure surface: init-time and token-time `appCheck/*` errors plus post-enforcement `permission-denied` all map to the appcheck status (D-07 discretion, research Open Question 2 resolution)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] i18n dictionary blobs committed with CRLF line endings**
- **Found during:** Task 1 post-commit verification
- **Issue:** the batch key-insert script rewrote the 19 JSON worktree files wholesale with CRLF endings; git's clean filter skipped conversion for those paths, so the Task 1 commit stored CRLF blobs where the repo convention (and the pre-commit index state) is LF-normalized — whole-file diffs (173/172 lines per dictionary) and future diff noise
- **Fix:** rewrote the 19 dictionaries to LF in the worktree, re-added, and committed the normalization; post-fix `git diff --numstat HEAD~3..HEAD` shows exactly 1 insertion per dictionary
- **Files modified:** js/i18n/*.json (19 files)
- **Verification:** `git ls-files --eol js/i18n/*.json` → i/lf for all; `node scripts/i18n-keycheck.mjs` → 171-key OK after normalization; `git status` clean for js/i18n
- **Committed in:** 73fd4c2 (style)

---

**Total deviations:** 1 auto-fixed (line-ending hygiene; no functional impact)
**Impact on plan:** None on behavior — all gates green before and after; normalization restores the repo's LF-blob convention and keeps future dictionary diffs line-scoped.

## Issues Encountered
None — verification chains passed on first run for both tasks.

## User Setup Required
None — no external service configuration required by this plan. Owner console steps (reCAPTCHA site key registration, App Check app registration, weekly monitoring ritual, enforcement flip) are documented in the 09-02 runbook, not executed here.

## Next Phase Readiness
- App Check seam live in code, dormant — monitoring metrics accrue only after the owner registers the key console-side (09-02 runbook content)
- Ready for 09-02: owner runbook (enforcement gate D-03/D-04/D-05, local-testing/debug-provider notes) + privacy.html reCAPTCHA/App Check disclosure (D-09/CMPL-05)
- Post-deploy manual smoke (non-blocking, per plan verification): submit one real message at /geohist/contact.html → success unchanged (dormant path); post-activation, block the attestation script in devtools → appcheck status + appcheck_token_failure event

---
*Phase: 09-app-check-monitor-first*
*Completed: 2026-09-08*

## Self-Check: PASSED

- All 24 task-touched files exist on disk (1 HTML + 19 JSON + 3 JS + SUMMARY)
- Commits verified in git log: `ed9c605` (Task 1), `ce54952` (Task 2), `73fd4c2` (EOL fix)
- Plan-level verification re-run post-commit: i18n-keycheck 171-key OK (exit 0), validate:html exit 0, validate:domain exit 0, node --check ×3 exit 0, `git diff --name-only HEAD -- firebase/firestore.rules` empty
- All task acceptance criteria + plan prohibitions verified (see Task sections above): 0 attestation bytes in served HTML, 0 debug-token literals, 0 App Check code in consent.js, no auto-retry, requirements FIRE-07/FIRE-08 marked complete
