---
gsd_state_version: 1.0
milestone: v2.1
milestone_name: Play Launch + Home Migration
current_phase: 12
current_phase_name: Cleanup Batch
status: verifying
stopped_at: Completed 12-02-PLAN.md
last_updated: "2026-09-14T00:51:07.888Z"
last_activity: 2026-09-13
last_activity_desc: Phase 12 execution started
state_head: 635cbf3b53416dc429f553529745b1b5bd84770d
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 2
  completed_plans: 2
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-11)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel.
**Current focus:** Phase 12 — Cleanup Batch

## Current Milestone

**v2.1 Play Launch + Home Migration** — Phases 12-15.
Goal: site swap-ready for Play launch day; GeoHist landing serves as site home with `/apps/` hub; small debts closed.

## Current Position

Phase: 12 (Cleanup Batch) — EXECUTING
Plan: 2 of 2
Status: Phase complete — ready for verification
Last activity: 2026-09-13 — Phase 12 execution started

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- Total plans completed: 0 (this milestone)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 12 P01 | 12min | 2 tasks | 5 files |
| Phase 12 P02 | 88min (incl. owner wait) | 3 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- v2.1: home migration is ONE atomic commit — keycheck 178-key set-equality forces both page moves + all 5 gate-list registrations together; one revert = rollback (Phase-8 precedent)
- v2.1: `/geohist/privacy.html` is FROZEN — Play Console compliance surface, invisible to repo gates; never move it
- v2.1: no GSC Change-of-Address refile — same-domain path moves are doc-excluded; 180-day window until ~2027-03 stays untouched
- v2.1: gated events are watch items, not phases — Tier-1 rating flip, FIRE-10 flip, App #2 subdir (v3+)
- [Phase 12]: Explicit setup-node cache: npm input (no packageManager field); npm ci lockfile-frozen install in CI; chromedriver allowScripts warning warn-only; blocker closure via dated supersession note

### Pending Todos

See `.planning/todos/pending/` — none yet.

### Blockers/Concerns

- Phase 12 planning must re-verify lockfile consistency (`git ls-files package-lock.json` + consistency check) — researchers disagreed; CLEAN-04 resolves it [superseded 2026-09-13, Phase 12: lockfile tracked since f0f56ca, npm ci --dry-run exit 0 — see 12-RECORDS.md §1]
- Play Console privacy-URL field flow was bot-blocked during research — verify in console when writing Phase 14 runbook
- Urdu Nastaliq real-device rendering unverified — CLEAN-03 owner device check closes it [superseded 2026-09-13, Phase 12: owner device check pass — see 12-UAT.md]

## Watch Items (owner-gated events, not phases)

- Tier-1 rating row flip — 10-RUNBOOK §1 (real visible Play rating)
- FIRE-10 App Check enforcement flip — 09-RUNBOOK §5-§6 (≥30 submissions + ready-to-enforce)
- GSC CoA 180-day window monitoring until ~2027-03
- App #2 subdir + hub card — v3+

## Session Continuity

Last session: 2026-09-14T00:51:07.236Z
Stopped at: Completed 12-02-PLAN.md
Resume file: None
