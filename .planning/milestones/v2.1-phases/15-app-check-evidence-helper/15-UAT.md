---
status: passed
phase: 15-app-check-evidence-helper
source: [15-01-PLAN.md]
started: 2026-10-09
updated: 2026-10-09
---

# Phase 15 UAT — Locally-Runnable Verification Battery (PRE-01..05)

**Reframe note (2026-10-09):** post-monitoring owner entries live in `15-RECORDS.md` (phase-12/13/14 reframe precedent: post-ship ongoing monitoring records live in RECORDS; UAT holds the pre-ship locally-runnable battery). Every row below is locally executable from the repo root with no live network calls.

**Public-artifact notice:** this file ships inside the publicly served Pages artifact. It contains console-UI descriptions and local checks only — zero credentials, zero tokens, zero secrets anywhere in this file.

**Recording predicate (mechanical, no gap-awareness):** any recorded issue is a blocker. Rows are executed at phase verification time and recorded verbatim.

---

## Checks

### 1. PRE-01 — Full CI validate chain green (6 stages)

check: `npm run validate` from repo root.

expected: exit 0; six stages green in order (html, domain, play-links, links, i18n-detect, i18n).

status: passed

result: pass — exit 0; html, domain (check-no-old-domain: OK), play-links (check-play-link: OK), links (20 links scanned), i18n-detect (23 tests pass), i18n (19/19 pass) all green

### 2. PRE-02 — Legacy domain gate green

check: `node scripts/check-no-old-domain.mjs`

expected: exit 0; prints `check-no-old-domain: OK`. No tracked file contains the legacy domain literal.

status: passed

result: pass — check-no-old-domain: OK, exit 0

### 3. PRE-03 — Play package-id gate green

check: `node scripts/check-play-link.mjs`

expected: exit 0; prints `check-play-link: OK`.

status: passed

result: pass — check-play-link: OK, exit 0

### 4. PRE-04 — 15-EVIDENCE-HELPER.md content verification

check: inspect `.planning/phases/15-app-check-evidence-helper/15-EVIDENCE-HELPER.md` for required EVID-01 and EVID-02 elements:
- §1: Firestore `messages` collection navigation, `createdAt >= 2026-09-08` counting, distinction between form submissions and request rows, boundary rules (<30 vs >=30).
- §2: Category-split table (Verified, Outdated client, Unknown origin, Invalid, Reused token).
- §3: 24h reporting lag, Pi-hole/ad-blocker reachability probe (`appCheck/probe-failed`), `appcheck_token_failure` parameter reading.
- §4: Weekly monitoring checklist and markdown ledger table.
- Secrets scan: zero API secret keys, debug tokens, or passwords.
- Domain scan: zero old domain literals.

expected: all sections present; zero secrets found; zero old domain literals.

status: passed

result: pass — §1-§4 complete; 0 secrets; 0 legacy domain literals

### 5. PRE-05 — 09-RUNBOOK.md supersession verification

check: inspect `.planning/milestones/v2.0-phases/09-app-check-monitor-first/09-RUNBOOK.md` §4 and §5 for dated Phase 15 cross-reference notes; verify original text remains verbatim.

expected: dated notes present in §4 and §5; original text untouched.

status: passed

result: pass — exactly 2 dated Phase 15 notes present; original text preserved verbatim

---

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

(none yet)

---

*Phase 15 · App Check Evidence Helper · UAT staged 2026-10-09 by plan 15-01*
