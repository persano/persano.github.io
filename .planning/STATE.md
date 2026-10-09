---
gsd_state_version: 1.0
milestone: v2.1
milestone_name: Play Launch + Home Migration
current_phase: 15
current_phase_name: App Check Evidence Helper
status: "Milestone v2.1 complete — archived and ready for next milestone"
stopped_at: "Milestone v2.1 complete, ready for next milestone (/gsd-new-milestone)"
last_updated: "2026-10-09T17:10:00.000Z"
last_activity: 2026-10-09
state_head: a912019
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 7
  completed_plans: 7
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-10-09)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel.
**Current focus:** Milestone v2.1 complete

## Current Milestone

**v2.1 Play Launch + Home Migration** — Phases 12-15 (shipped 2026-10-09).
Goal: site swap-ready for Play launch day; GeoHist landing serves as site home with `/apps/` hub; small debts closed.

## Current Position

Phase: 15 — App Check Evidence Helper
Plan: 15-01 complete (verified passed)
Status: Milestone v2.1 complete — all 4 phases shipped, archived to milestones/
Last activity: 2026-10-09

**Work branch (owner decision 2026-09-15):** all phase work + PRs happen on the single persistent branch `latest` → PRs target `main`; no per-phase branches (all `gsd/phase-*` and `phase-*` branches deleted local+remote). PR #8 (Phase 14) merged before the switch; `latest` = main tip 1c7e87d. Future sessions: work on `latest`, PR latest → main.

Progress: [██████████] 100% (4/4 phases complete)

## Performance Metrics

**Velocity:**

- Total plans completed: 7 (this milestone)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 12 | 2 | - | - |
| 13 | 2 | - | - |
| 14 | 2 | - | - |
| 15 | 1 | - | - |

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 12 P01 | 12min | 2 tasks | 5 files |
| Phase 12 P02 | 88min (incl. owner wait) | 3 tasks | 5 files |
| Phase 13 P01 | 45min | 3 tasks | 16 files |
| Phase 13 P02 | 9min | 2 tasks | 2 files |
| Phase 14 P01 | 17min | 2 tasks | 3 files |
| Phase 14 P02 | 38min | 3 tasks | 4 files |
| Phase 15 P01 | 15min | 3 tasks | 4 files |

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
- [Phase 14]: v2.1/14-01: LKIT-03 gate scope = tracked-text walk, ALLOW {'.planning','README.md','.git','node_modules'} — .planning/ verbatim-immutable, exclusion documented do-not-fix in the script header
- [Phase 14]: v2.1/14-01: http:// scheme Play URLs FAIL the gate (EA-05); scheme verdict reads the line prefix before the needle match
- [Phase 14]: 14-02: pinned launch order — privacy-URL field first (compliance), Play-link 200 verify, website field, gated Tier-1 flip last (may be a later day, evidence-gated never calendar-gated)
- [Phase 14]: 14-02: launch day = ZERO code change (all 8 surfaces swap-ready); GA4 note-only (no custom dimensions); JSON-LD refresh-check is verification-only (offers already price 0 + USD)
- [Phase 14]: 14-02: 10-RUNBOOK supersession via 5 dated bracketed appends, originals verbatim, content-anchored raw I/O splices (line-84 one-liner byte-untouched)
- [Phase 15]: Floor unit pinned to Firestore messages documents; baseline date 2026-09-08; 5-15% un-attested traffic from adblockers/Pi-hole accompanied by appCheck/probe-failed is legitimate, not abuse; 24h lag documented; 09-RUNBOOK cross-referenced with dated supersession notes

### Pending Todos

See `.planning/todos/pending/` — none yet.

### Blockers/Concerns

- Phase 12 planning must re-verify lockfile consistency (`git ls-files package-lock.json` + consistency check) — researchers disagreed; CLEAN-04 resolves it [superseded 2026-09-13, Phase 12: lockfile tracked since f0f56ca, npm ci --dry-run exit 0 — see 12-RECORDS.md §1]
- Play Console privacy-URL field flow was bot-blocked during research — verify in console when writing Phase 14 runbook [superseded 2026-09-15, Phase 14: runbook authored with owner-verify caveat (EA-06) + rejection-rollback framing — 14-RUNBOOK §3 step 1; live console verification records via 14-RECORDS.md R-01 at owner launch time]
- Urdu Nastaliq real-device rendering unverified — CLEAN-03 owner device check closes it [superseded 2026-09-13, Phase 12: owner device check pass — see 12-UAT.md]
- CLEAN-01 post-ship CI watch: 12-RECORDS.md §2 verdict rows pending until /gsd-ship pushes (run #1 MISS-with-save, run #2 HIT) [superseded 2026-09-14, Phase 13: PR #7 merge ran run 34898054029 green — validate 24s with npm ci + cache HIT, deploy 13s; verdict rows now recordable post-ship]

## Watch Items (owner-gated events, not phases)

- Tier-1 rating row flip — 10-RUNBOOK §1 (real visible Play rating)
- FIRE-10 App Check enforcement flip — 09-RUNBOOK §5-§6 (≥30 submissions + ready-to-enforce)
- GSC CoA 180-day window monitoring until ~2027-03
- App #2 subdir + hub card — v3+

## Session Continuity

Last session: 2026-10-09T16:45:00.000Z
Stopped at: Phase 15 complete (verified passed); all 4/4 phases in milestone v2.1 complete
Resume file: None
