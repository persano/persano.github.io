---
phase: 09-app-check-monitor-first
plan: 02
subsystem: docs
tags: [app-check, recaptcha-v3, firebase, runbook, privacy-policy, monitoring, enforcement]

# Dependency graph
requires:
  - phase: 09-app-check-monitor-first (plan 09-01)
    provides: dormant App Check gate code — `js/firebase-config.js` `recaptchaSiteKey` field (empty = dormant), `persano:appcheck` document event, consent-gated `appcheck_token_failure` Analytics event (exact names the runbook references)
provides:
  - `.planning/phases/09-app-check-monitor-first/09-RUNBOOK.md` — owner console chain: reCAPTCHA v3 key-pair registration (domain allowlist geohisttrivia.com only) → Firebase App Check app registration (secret key consumed console-side) → activation (site key → `recaptchaSiteKey`) → weekly monitoring ritual → evidence gate → per-product Enforce + rollback → debug-token local-testing flow → `appcheck_token_failure` metric reference
  - `geohist/privacy.html` section 3 — one reCAPTCHA v3 / Firebase App Check (website only) SDK-inventory line with the consent-interplay sentence (anti-abuse not measurement; runs regardless of the analytics cookie choice) + Last-updated date bump
  - FIRE-10 execution path fully documented (the owner performs the flip post-monitoring; the repo never executes it)
affects: [FIRE-10 (future enforcement execution), phase-9 verify-work, owner console onboarding]

# Actuals (#2632)
actuals:
  tokens: 3300    # chars/4 over realized diff (runbook 12789 bytes new + privacy ~385 chars changed)
  tasks: 2
  commits: 3      # 2 task commits + 1 plan-metadata docs commit

# Tech tracking
tech-stack:
  added: []       # zero-build constraint held — no dependencies, no code changes
  patterns:
    - "Owner-runbook pattern (08-RUNBOOK skeleton): audience line, public-artifact no-secrets notice, status legend, §0 state table + numbered console sections, do-not-touch warnings, verify steps, explicit failure shapes"
    - "Evidence-gated enforcement: ready-to-enforce console signal + 30-successful-submissions floor, unit pinned to form submissions, boundary stated both directions, never calendar"

key-files:
  created:
    - .planning/phases/09-app-check-monitor-first/09-RUNBOOK.md
  modified:
    - geohist/privacy.html

key-decisions:
  - "Runbook follows the 08-RUNBOOK skeleton verbatim in shape (audience / public-artifact no-secrets notice / status legend / §0–§8) — phase-dir location per D-04"
  - "Evidence gate pinned: BOTH the console ready-to-enforce signal ('almost all of the recent requests are from verified clients') AND ≥30 successful submissions since code ship; unit = successful form submissions (one submission = 2+ console requests); boundary stated both directions; no date/elapsed-time trigger exists (D-03, FIRE-09)"
  - "Local testing prescribes the debug-token flow only — explicit never-add-localhost and never-commit-token warnings (repo tree is publicly served; T-09-07/T-09-08)"
  - "Replay-protection refutation documented for Firestore (standard Google services: Firebase AI Logic only — Pitfall 5); flip propagation ≤15 min each way, rollback = same toggle off (D-05)"
  - "privacy.html li is static EN with no data-i18n (documented scriptless-page exception); wording mirrors the shipped consent.js load-gating model (D-09)"

patterns-established:
  - "Owner console runbooks live in the phase dir as {phase}-RUNBOOK.md, mirroring 08-RUNBOOK structure"
  - "Enforcement decisions are evidence-gated owner steps; repo documents, never executes (FIRE-10 stays post-monitoring)"

requirements-completed: [FIRE-09, CMPL-05]

# Coverage metadata (#1602)
coverage:
  - id: D1
    description: "Owner runbook 09-RUNBOOK.md documents the full console chain (§0 state, §1 reCAPTCHA registration with geohisttrivia.com-only allowlist, §2 App Check registration, §3 activation via recaptchaSiteKey, §4 weekly ritual, §5 evidence gate, §6 per-product flip + rollback, §7 debug-token local testing, §8 appcheck_token_failure reference) with zero secret-shaped literals"
    requirement: FIRE-09
    verification:
      - kind: other
        ref: "node runbook content gate (10 required strings present incl. '30 successful submissions', 'Enforce', '15 minutes', 'Reused token', 'appcheck_token_failure', 'recaptchaSiteKey', 'Manage debug tokens') — exit 0"
        status: pass
      - kind: other
        ref: "secret-shape grep /AIza[\\w-]{10,}/ and /[0-9A-Za-z_-]{30,}/ over 09-RUNBOOK.md — 0 matches"
        status: pass
    human_judgment: false
  - id: D2
    description: "privacy.html section 3 gains one reCAPTCHA v3 / Firebase App Check (website only) li with the consent-interplay sentence ('runs regardless of your analytics cookie choice, and only when you submit the form'), no data-i18n, Last updated bumped to September 7, 2026"
    requirement: CMPL-05
    verification:
      - kind: other
        ref: "npm run validate:html — exit 0 (privacy.html in glob)"
        status: pass
      - kind: other
        ref: "node privacy content gate ('reCAPTCHA v3','App Check','website only','regardless of your analytics cookie choice' present; no data-i18n) — exit 0"
        status: pass
    human_judgment: false
  - id: D3
    description: "Post-ship owner flow works end-to-end: owner works runbook §1–§3 (register keys, register app, activate site key), sends one real submission — zero visible change, metrics begin accruing, §4 ritual starts"
    verification: []
    human_judgment: true
    rationale: "Console registration + activation + live submission are owner-side actions outside repo automation (plan verification lists this as non-blocking owner-side); gated by runbook instructions, not executable by the agent."

# Metrics
duration: 5min
completed: 2026-09-07
status: complete
---

# Phase 9 Plan 2: Owner Runbook + Privacy Disclosure Summary

**Owner App Check runbook (register → activate → weekly ritual → evidence-gated per-product flip with rollback, zero secrets) plus the privacy-policy reCAPTCHA/App Check disclosure with its consent-interplay sentence — zero code changes.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-09-08T02:56:04Z
- **Completed:** 2026-09-08T03:00:52Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments
- `09-RUNBOOK.md` (§0–§8, 08-RUNBOOK skeleton): full owner console chain — reCAPTCHA v3 key pair with geohisttrivia.com-only domain allowlist, Firebase App Check registration (secret key console-only), activation via `recaptchaSiteKey`, weekly ritual (five-category Verified split + successful-submission count), evidence gate (ready-to-enforce signal + ≥30 successful submissions, never calendar), per-product Enforce/rollback for Firestore AND Authentication with ≤15-minute propagation, debug-token local testing with never-add-localhost and never-commit warnings, and the `appcheck_token_failure` Analytics reference
- `geohist/privacy.html` section 3: one new SDK-inventory line — "reCAPTCHA v3 / Firebase App Check (website only)" — with the anti-abuse-not-measurement consent interplay, no data-i18n (documented static-EN exception), Last updated bumped to September 7, 2026
- FIRE-10 remains a documented future owner step: the agent never flips enforcement; no repo surface calls any enforcement API

## Task Commits

Each task was committed atomically (scoped single-file commits):

1. **Task 1: 09-RUNBOOK.md — owner console chain** - `afd855d` (docs)
2. **Task 2: privacy.html CMPL-05 disclosure** - `da374dd` (docs)

**Plan metadata:** committed at close (docs: complete plan)

## Files Created/Modified
- `.planning/phases/09-app-check-monitor-first/09-RUNBOOK.md` - Owner console runbook: registration → activation → weekly ritual → evidence gate → flip/rollback → debug-token testing → metric reference (no secrets)
- `geohist/privacy.html` - Section 3 SDK inventory gains the reCAPTCHA v3/App Check line with consent interplay; Last updated → September 7, 2026

## Decisions Made
- Followed the 08-RUNBOOK skeleton exactly (audience line, public-artifact no-secrets notice, status legend, §0–§8) per the plan's read_first pattern
- Pinned the D-03 floor at 30 successful form submissions with the unit explicitly NOT console request rows (one submission = 2+ requests) and both boundary directions stated
- Prescribed the debug-token flow (Manage debug tokens UI) for local testing with two hard warnings (never add localhost to the allowlist; never commit/ship the token or flag)
- Documented the Firestore replay-protection refutation (Firebase AI Logic only) so the owner doesn't hunt for a nonexistent toggle
- Kept the privacy li data-i18n-free — privacy.html is scriptless by design (documented exception)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None generated - the owner console steps ARE the runbook content itself: `.planning/phases/09-app-check-monitor-first/09-RUNBOOK.md` (§1–§3 before metrics accrue; §4 weekly thereafter; §5/§6 only when evidence passes). No env vars, no accounts beyond the existing Firebase/Google consoles.

## Next Phase Readiness
- Phase 9 plans complete (09-01 + 09-02) — ready for phase verify-work
- Owner post-ship flow (non-blocking): work runbook §1–§3, send one real submission — metrics accrue, §4 ritual starts; FIRE-10 (enforcement flip execution) stays post-monitoring per plan
- Phase 10 (Gated Social Proof) can plan next; no blockers from this plan

---
*Phase: 09-app-check-monitor-first*
*Completed: 2026-09-07*

## Self-Check: PASSED

- Files verified on disk: `09-RUNBOOK.md` ✓, `09-02-SUMMARY.md` ✓, `geohist/privacy.html` (modified) ✓
- Commits verified in git log: `afd855d` (Task 1, runbook only) ✓, `da374dd` (Task 2, privacy.html only) ✓, `656650b` (plan metadata: SUMMARY + STATE + ROADMAP + REQUIREMENTS) ✓
- Task 1 gates re-verified at execution time: runbook content gate exit 0 (all 10 required strings), `/AIza[\w-]{10,}/` 0 matches, `[0-9A-Za-z_-]{30,}` 0 matches, no localhost-allowlist instruction, no date/elapsed-time flip criterion, replay-protection refutation present, flip attributed to owner + FIRE-10 named
- Task 2 gates re-verified at execution time: `npm run validate:html` exit 0, privacy content gate exit 0 (4 required strings, no data-i18n), one-file commit
- Unrelated dirty files (`.planning/config.json`, `.gsd/`, `.planning/agent-history.json`) left unstaged throughout
