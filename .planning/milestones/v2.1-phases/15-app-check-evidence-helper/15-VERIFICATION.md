---
phase: 15-app-check-evidence-helper
verified: 2026-10-09T17:00:00Z
status: passed
score: 6/6 must-haves verified
behavior_unverified: 0
overrides_applied: 0
prohibition_flags:
  - id: P-15-01 (never paste secrets, debug tokens, credentials into docs)
    verdict: judged-pass
    evidence: "Automated scan over .planning/phases/15-app-check-evidence-helper/ returned 0 credentials/tokens"
    flagged: true
  - id: P-15-02 (never use legacy domain literal)
    verdict: judged-pass
    evidence: "node scripts/check-no-old-domain.mjs exit 0; dedicated check over phase 15 docs: CLEAN"
    flagged: true
  - id: P-15-03 (never mutate original 09-RUNBOOK.md text)
    verdict: judged-pass
    evidence: "git diff confirms only 2 additions (dated bracketed notes in §4 and §5); original text 100% byte-identical"
    flagged: true
---

# Phase 15: App Check Evidence Helper — Verification Report

**Phase Goal:** Owner can track App Check evidence toward the 30-submission floor from the Firebase console UI alone — doc-only, zero code changes, zero secrets.
**Verified:** 2026-10-09
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Owner can count successful submissions toward the 30-floor following the doc; unit = successful submissions in Firestore `messages`, never console request rows (SC-1 / EVID-01) | ✓ VERIFIED | `15-EVIDENCE-HELPER.md` §1 documents exact console steps (Build → Firestore Database → Data → `messages`), sorting by `createdAt` descending, baseline date 2026-09-08, and explains why 1 submit = 2+ requests and why request rows inflate the count |
| 2 | Category-split reading guide usable from console UI alone (SC-2 / EVID-02) | ✓ VERIFIED | `15-EVIDENCE-HELPER.md` §2 table covers Verified, Outdated client, Unknown origin (detailed breakdown between adblockers and bots), Invalid, Reused token |
| 3 | Operational caveats documented: 24h reporting lag + Pi-hole/ad-blocker probe-failed caveat + `appcheck_token_failure` trend reading (SC-2 / EVID-02) | ✓ VERIFIED | `15-EVIDENCE-HELPER.md` §3 details the 8-24h aggregation lag, explains `contact.js` ~3s reachability probe skipping App Check and delivering un-attested with `appCheck/probe-failed`, and details how to read Analytics event codes |
| 4 | Weekly ritual checklist and fillable ledger template present (SC-2 / EVID-02) | ✓ VERIFIED | `15-EVIDENCE-HELPER.md` §4 provides the 5-minute checklist and markdown table template for weekly tracking |
| 5 | `09-RUNBOOK.md` cross-referenced with dated supersession notes; original text verbatim (EVID-01/02) | ✓ VERIFIED | `09-RUNBOOK.md` §4 and §5 carry dated bracketed notes pointing to `15-EVIDENCE-HELPER.md`; original text untouched |
| 6 | Full CI validation chain passes green; zero secrets; zero old domain literals | ✓ VERIFIED | `npm run validate` exit 0 (6/6 stages green); `check-no-old-domain.mjs` OK; secrets scan clean |

**Score:** 6/6 truths verified.

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `.planning/phases/15-app-check-evidence-helper/15-EVIDENCE-HELPER.md` | Owner operational guide | ✓ VERIFIED | §1-§4 complete, zero secrets, zero code |
| `.planning/phases/15-app-check-evidence-helper/15-UAT.md` | Verification checklist | ✓ VERIFIED | 5/5 PRE checks executed and passed |
| `.planning/phases/15-app-check-evidence-helper/15-RECORDS.md` | Operational records scaffold | ✓ VERIFIED | R-01..R-03 pre-staged |
| `.planning/milestones/v2.0-phases/09-app-check-monitor-first/09-RUNBOOK.md` | Dated cross-references in §4 & §5 | ✓ VERIFIED | 2 dated bracketed notes |

### Release Criteria Verification

- All phase requirements (EVID-01, EVID-02) complete.
- No code regressions: code tree unmodified; `npm run validate` 100% green.
- Operational guide tested and self-contained for console-only execution.
