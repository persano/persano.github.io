---
gsd_state_version: 1.0
milestone: v2.1
milestone_name: Play Launch + Home Migration
current_phase: 13
current_phase_name: Home Migration
status: verifying
stopped_at: Completed 13-02-PLAN.md (runbook + UAT scaffold; phase ready for /gsd-verify-work then /gsd-ship)
last_updated: "2026-09-14T19:04:35.255Z"
last_activity: 2026-09-14
last_activity_desc: Phase 13 execution started
state_head: 9020628fa778c23ab8118a1ab6dcff787ea9de8a
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 4
  completed_plans: 4
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-13)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel.
**Current focus:** Phase 13 — Home Migration

## Current Milestone

**v2.1 Play Launch + Home Migration** — Phases 12-15.
Goal: site swap-ready for Play launch day; GeoHist landing serves as site home with `/apps/` hub; small debts closed.

## Current Position

Phase: 13 (Home Migration) — EXECUTING
Plan: 2 of 2
Status: Phase complete — ready for verification
Last activity: 2026-09-14 — Phase 13 execution started

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- Total plans completed: 2 (this milestone)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 12 | 2 | - | - |

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 12 P01 | 12min | 2 tasks | 5 files |
| Phase 12 P02 | 88min (incl. owner wait) | 3 tasks | 5 files |
| Phase 13 P01 | 45min | 3 tasks | 16 files |
| Phase 13 P02 | 9min | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- v2.1: home migration is ONE atomic commit — keycheck 178-key set-equality forces both page moves + all 5 gate-list registrations together; one revert = rollback (Phase-8 precedent)
- v2.1: `/geohist/privacy.html` is FROZEN — Play Console compliance surface, invisible to repo gates; never move it
- v2.1: no GSC Change-of-Address refile — same-domain path moves are doc-excluded; 180-day window until ~2027-03 stays untouched
- v2.1: gated events are watch items, not phases — Tier-1 rating flip, FIRE-10 flip, App #2 subdir (v3+)
- [Phase 12]: Explicit setup-node cache: npm input (no packageManager field); npm ci lockfile-frozen install in CI; chromedriver allowScripts warning warn-only; blocker closure via dated supersession note
- [Phase 13]: v2.1/13-01: stub dropped from keycheck/surface pages[] (keyed-pages semantics; star-path repoint carries landing-moved fact)
- [Phase 13]: v2.1/13-01: red-gate snapshots must use per-file distinct names (Copy-Item multi-source flattens same-named files)
- [Phase 13]: v2.1/13-01: a11y red-gate tripper is critical-impact (unlabeled input); duplicate h2 alone is below the shipped AA gate
- [Phase 13]: 13-02: runbook/UAT predicate phrased without pre-filled literals (plan action text contradicted its own zero-pre-filled verify gate)
- [Phase 13]: 13-02: runbook URL-inspection table adds grouped 5th row (unchanged sub-pages) to satisfy the 5-URL acceptance criterion truthfully
- [Phase 13]: 13-02: docs avoid the wildcard legacy-host phrasing — plan verify greps bare github.io, stricter than the repo gate needle
- [Phase 13]: 13-ship: owner-approved ship-gate reframe — 9 post-deploy UAT rows moved verbatim to 13-RECORDS.md (phase-12 precedent), UAT holds locally-runnable PRE battery 6/6, verification flipped passed on owner consent (2026-09-14); broken-windows ledger closed at ship preflight (12 fixed / 5 waived)

### Pending Todos

See `.planning/todos/pending/` — none yet.

### Blockers/Concerns

- Phase 12 planning must re-verify lockfile consistency (`git ls-files package-lock.json` + consistency check) — researchers disagreed; CLEAN-04 resolves it [superseded 2026-09-13, Phase 12: lockfile tracked since f0f56ca, npm ci --dry-run exit 0 — see 12-RECORDS.md §1]
- Play Console privacy-URL field flow was bot-blocked during research — verify in console when writing Phase 14 runbook
- Urdu Nastaliq real-device rendering unverified — CLEAN-03 owner device check closes it [superseded 2026-09-13, Phase 12: owner device check pass — see 12-UAT.md]
- CLEAN-01 post-ship CI watch: 12-RECORDS.md §2 verdict rows pending until /gsd-ship pushes (run #1 MISS-with-save, run #2 HIT)

## Watch Items (owner-gated events, not phases)

- Tier-1 rating row flip — 10-RUNBOOK §1 (real visible Play rating)
- FIRE-10 App Check enforcement flip — 09-RUNBOOK §5-§6 (≥30 submissions + ready-to-enforce)
- GSC CoA 180-day window monitoring until ~2027-03
- App #2 subdir + hub card — v3+

## Session Continuity

Last session: 2026-09-14T19:04:35.122Z
Stopped at: Completed 13-02-PLAN.md (runbook + UAT scaffold; phase ready for /gsd-verify-work then /gsd-ship)
Resume file: None
