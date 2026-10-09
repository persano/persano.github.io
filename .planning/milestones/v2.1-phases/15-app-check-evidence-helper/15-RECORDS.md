---
status: pending
phase: 15-app-check-evidence-helper
source: [15-01-PLAN.md]
started: 2026-10-09
updated: 2026-10-09
---

# Phase 15 Operational Records — App Check Monitoring & Evidence Ledger

**Reframe note (2026-10-09):** post-ship ongoing monitoring records live here (phase-12/13/14 precedent: post-ship checks live in RECORDS; UAT holds locally-runnable rows). All rows below are ongoing operational records executed by the owner following `.planning/phases/15-app-check-evidence-helper/15-EVIDENCE-HELPER.md`.

**Public-artifact notice:** this file ships inside the publicly served Pages artifact. It contains **console-UI descriptions and monitoring entries only — zero credentials, zero tokens, zero secrets anywhere in this file.**

**Scaffold notice:** every row below is pre-staged and marked pending. **Do NOT fabricate outcomes** — rows fill in only when real weekly monitoring observations occur.

---

## Checks & Monitoring Ledger

### 1. R-01 — Baseline activation confirmation (09-RUNBOOK §0 / 15-EVIDENCE-HELPER §1)

check: confirm reCAPTCHA Enterprise site key active in `js/firebase-config.js` and App Check monitoring metrics accumulating in Firebase Console → Security → App Check → APIs tab.

expected: monitoring metrics active; un-attested submissions accepted; zero enforcement applied yet.

status: pending — executes post-ship during weekly ritual

result: (record when executed)

### 2. R-02 — Weekly monitoring logs (15-EVIDENCE-HELPER §4)

check: owner weekly ritual per `15-EVIDENCE-HELPER.md` §4. Count Firestore `messages` documents (≥ 2026-09-08), record Verified % and Unknown Origin %, and review `appcheck_token_failure` codes in Analytics.

expected: progressive accumulation of submissions toward 30-floor; Verified rate remains high; any Unknown Origin aligns with `appCheck/probe-failed`.

status: pending — ongoing weekly owner ritual

| Week Date | Firestore Submissions (≥ 2026-09-08) | Firestore Verified % | Auth Verified % | Unknown Origin % | `appcheck_token_failure` Count & Codes | Gate Verdict |
|---|---|---|---|---|---|---|
| *(pending)* | — | — | — | — | — | Continue monitoring (< 30) |

### 3. R-03 — 30-Submission floor & enforcement decision (09-RUNBOOK §5 / FIRE-10)

check: evaluate evidence gate when Firestore `messages` document count reaches ≥ 30.

expected: if count ≥ 30 AND Verified rate meets console ready-to-enforce guideline (>90-95%) AND un-attested requests accounted for by ad-blocker probe-failed, owner may schedule FIRE-10 enforcement per `09-RUNBOOK.md` §6.

status: pending — gate-driven owner event

result: (record when executed)

---

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps

(none yet — rows are pre-staged pending; they fill in only during ongoing monitoring)

---

*Phase 15 · App Check Evidence Helper · records staged 2026-10-09 by plan 15-01*
