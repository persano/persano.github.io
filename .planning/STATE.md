---
gsd_state_version: 1.0
milestone: v2.1
milestone_name: Play Launch + Home Migration
current_phase: 15
current_phase_name: App Check Evidence Helper
status: planning
stopped_at: Phase 14 complete, ready to plan Phase 15
last_updated: "2026-09-15T17:28:14.612Z"
last_activity: 2026-09-15
last_activity_desc: Phase 14 complete, transitioned to Phase 15
state_head: 228f9d5b6b430d4892731bd46b2f56f2b554c0d3
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 6
  completed_plans: 6
  percent: 50
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-14)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel.
**Current focus:** Phase 14 — Launch Kit

## Current Milestone

**v2.1 Play Launch + Home Migration** — Phases 12-15.
Goal: site swap-ready for Play launch day; GeoHist landing serves as site home with `/apps/` hub; small debts closed.

## Current Position

Phase: 15 — App Check Evidence Helper
Plan: Not started
Status: Ready to plan
Last activity: 2026-09-15 — Phase 14 complete, transitioned to Phase 15

Progress: [███░░░░░░░] 25% (1/4 phases complete)

## Performance Metrics

**Velocity:**

- Total plans completed: 6 (this milestone)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 12 | 2 | - | - |
| 13 | 2 | - | - |
| 14 | 2 | - | - |

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

### Pending Todos

See `.planning/todos/pending/` — none yet.

### Blockers/Concerns

- Phase 12 planning must re-verify lockfile consistency (`git ls-files package-lock.json` + consistency check) — researchers disagreed; CLEAN-04 resolves it [superseded 2026-09-13, Phase 12: lockfile tracked since f0f56ca, npm ci --dry-run exit 0 — see 12-RECORDS.md §1]
- Play Console privacy-URL field flow was bot-blocked during research — verify in console when writing Phase 14 runbook
- Urdu Nastaliq real-device rendering unverified — CLEAN-03 owner device check closes it [superseded 2026-09-13, Phase 12: owner device check pass — see 12-UAT.md]
- CLEAN-01 post-ship CI watch: 12-RECORDS.md §2 verdict rows pending until /gsd-ship pushes (run #1 MISS-with-save, run #2 HIT) [superseded 2026-09-14, Phase 13: PR #7 merge ran run 34898054029 green — validate 24s with npm ci + cache HIT, deploy 13s; verdict rows now recordable post-ship]

## Watch Items (owner-gated events, not phases)

- Tier-1 rating row flip — 10-RUNBOOK §1 (real visible Play rating)
- FIRE-10 App Check enforcement flip — 09-RUNBOOK §5-§6 (≥30 submissions + ready-to-enforce)
- GSC CoA 180-day window monitoring until ~2027-03
- App #2 subdir + hub card — v3+

## Session Continuity

Last session: 2026-09-15T04:13:06.921Z
Stopped at: Phase 14 complete, ready to plan Phase 15
Resume file: None
