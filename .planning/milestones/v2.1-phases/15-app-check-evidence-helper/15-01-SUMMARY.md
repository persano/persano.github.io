---
phase: 15-app-check-evidence-helper
plan: 01
subsystem: app-check-monitoring-docs
tags: [evid-01, evid-02, runbook, supersession, app-check, firestore, uat, records]
requires:
  - "Phase 09 App Check implementation (contact.js, consent.js, firestore.rules, 09-RUNBOOK.md)"
  - "Phase 14 launch kit conventions"
provides:
  - "15-EVIDENCE-HELPER.md — App Check evidence helper & weekly triage guide (EVID-01, EVID-02)"
  - "09-RUNBOOK.md supersession — 2 dated bracketed notes in §4 and §5"
  - "15-UAT.md — 5-check PRE battery green"
  - "15-RECORDS.md — ongoing monitoring records scaffold"
affects:
  - "Owner weekly monitoring workflow"
  - "Enforcement gate timing (FIRE-10 eligibility evaluation)"
tech-stack:
  added: []
  patterns: ["supersession-by-dated-bracketed-append (AGENTS.md policy)", "UAT=locally-runnable / RECORDS=post-ship monitoring"]
key-files:
  created:
    - .planning/phases/15-app-check-evidence-helper/15-EVIDENCE-HELPER.md
    - .planning/phases/15-app-check-evidence-helper/15-UAT.md
    - .planning/phases/15-app-check-evidence-helper/15-RECORDS.md
  modified:
    - .planning/milestones/v2.0-phases/09-app-check-monitor-first/09-RUNBOOK.md
decisions:
  - "Unit pinned to Firestore messages documents: request rows in the App Check APIs tab overestimate human submissions by multi-request architecture (auth + write), token retries, and config scrapers (EVID-01)"
  - "Baseline date fixed to 2026-09-08 (Phase 09 activation deploy date)"
  - "Unknown origin category split explicitly clarifies that 5-15% un-attested traffic accompanied by appCheck/probe-failed events represents legitimate privacy-conscious visitors with adblockers/Pi-holes; premature enforcement would block them (EVID-02)"
  - "24-hour reporting lag documented to prevent intraday knee-jerk decisions"
  - "09-RUNBOOK supersession preserves all original text verbatim, adding dated cross-reference notes to §4 and §5"
metrics:
  duration: 15min
  completed: 2026-10-09
  tasks: 3
  files: 4
status: complete
deferred_commit: true
---

# Phase 15 Plan 01: App Check Evidence Helper Summary

**One-liner:** App Check Evidence Helper authored (`15-EVIDENCE-HELPER.md`) covering Firestore document counting for the 30-submission floor (EVID-01), category-split semantics, 24h reporting lag, Pi-hole/ad-blocker reachability caveats, and a weekly triage ritual with fillable ledger (EVID-02); `09-RUNBOOK.md` cross-referenced with dated supersession notes.

## Deliverables

1. **`15-EVIDENCE-HELPER.md`**: Complete console-UI-only guide for the owner:
   - **§1 The 30-Submission Floor (EVID-01)**: Firestore Database Data tab navigation, `messages` collection, `createdAt >= 2026-09-08` counting, strict distinction between form submissions and request rows, boundary rules.
   - **§2 Category-Split Reading Guide (EVID-02)**: Verified, Outdated client, Unknown origin (triage breakdown), Invalid, Reused token.
   - **§3 Critical Operational Caveats (EVID-02)**: 24h console reporting lag, Pi-hole/ad-blocker probe failure (`appCheck/probe-failed`) causing un-attested delivery, `appcheck_token_failure` event code reading.
   - **§4 Weekly Monitoring Ritual & Ledger (EVID-02)**: 5-minute weekly checklist and fillable markdown log table.
2. **`09-RUNBOOK.md` Updates**:
   - Added dated bracketed cross-reference note to §4 (Weekly monitoring ritual).
   - Added dated bracketed cross-reference note to §5 (Evidence gate).
   - Original text preserved 100% verbatim.
3. **`15-UAT.md`**:
   - 5 PRE verification checks executed and passed (CI validate chain, legacy domain gate, play package-id gate, content audit, supersession audit).
4. **`15-RECORDS.md`**:
   - Staged operational records scaffold for owner weekly logs (R-01..R-03).

## Verification Evidence

- `npm run validate`: Exit 0; all 6 checks passed (html, domain, play-links, links, i18n-detect, i18n).
- `node scripts/check-no-old-domain.mjs`: OK (0 occurrences of legacy host literal).
- `node scripts/check-play-link.mjs`: OK.
- Zero secrets or credentials present in any document.
