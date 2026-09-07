---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Full Deferred Scope
current_phase: 07
current_phase_name: localization-20-rtl
status: "Phase 06 shipped — PR #2"
stopped_at: Phase 7 context gathered
last_updated: "2026-09-07T02:09:09.116Z"
last_activity: 2026-09-06
last_activity_desc: Phase 07 planning complete
state_head: 7803cfc06a5cf83ced4360f51a8139839c883210
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 8
  completed_plans: 3
  percent: 20
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-06)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel — before the app goes live on Google Play.
**Current focus:** Phase 7 — Localization ×20 + RTL

## Current Position

Phase: 07 (localization-20-rtl) — READY TO EXECUTE
Plan: Not started
Status: Ready to execute
Total Plans in Phase: 5
Plans Executed: 0
Last activity: 2026-09-06 — Phase 07 planning complete (5 plans, 5 waves)

Progress: [████████████████████] 3/3 plans (100%) — v2.0 milestone 20% (1/5 phases)

## Performance Metrics

**Velocity (lifetime — v1 shipped 12 plans / 30 tasks in 4 days):**

- Total plans completed: 3 (v1)
- v2.0 plans completed: 0

**By Phase (v2.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 06 | 3 | - | - |
| 07 | 0 | - | - |
| 08 | 0 | - | - |
| 09 | 0 | - | - |
| 10 | 0 | - | - |

*Updated after each plan completion. v1 per-plan durations archived in MILESTONES.md.*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 06 P01 | 23 min | 3 tasks | 12 files |
| Phase 06 P02 | 7 min | 2 tasks | 2 files |
| Phase 06 P03 | 10 min | 3 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Locked] Dictionary-swap single-URL i18n architecture — no per-language subdirs/hreflang (anti-pattern at this shape; revisit only with crawlability case)
- [Locked] Consent = load-gating; fork-shaped Firebase split (analytics only in consent.js; auth+firestore only in contact.js) — App Check must ride contact.js submit path, never page load
- [Locked] Changelog: keyed chrome, EN entries (documented i18n exception); changelog keys land in es/pt-BR atomically with the page, BEFORE ×20 expansion
- [Locked] No CNAME file under Actions publishing — domain lives in repo Settings; cert verified BEFORE URL rewrite; console allowlists BEFORE rewrite
- [Locked] aggregateRating JSON-LD permanently OFF unless an on-site review source exists (Google review-snippet policy bars mirroring Play ratings)
- [v1] Firestore console ruleset is NOT byte-identical to repo `firebase/firestore.rules` — future rules edits require console re-paste
- [v1] Canonical measurementId G-KDWVVHRYD5; site copy refers to Santiago David Postorivo (internal `persano.*` identifiers unchanged)
- [Phase 06]: Changelog chrome keyed changelog.* mirroring guide.html 1:1; entry content stays EN-unkeyed (documented i18n exception)
- [Phase 06]: Fixed vacuous validate:links — linkinator 8.1.0 treats the ^https?:// lookahead skip as match-nothing (0 links scanned); replaced with plain-string skips, live self-URL checks live in smoke-check.sh
- [Phase 06]: Key surface 146→169 moved atomically (page + 3 nav/footer inserts + 2 dictionaries + keycheck registration, one commit); red gate proven both directions locally
- [Phase 06]: Curated 6 of 13 real 0.x versions for changelog backfill (0.88/0.87/0.84/0.8/0.7/0.2) telling the arc; git-mined dates authoritative (0.2 -> 2026-08-24, 0.88 -> 2026-09-04); pre-scheme 3.0-10.0 era excluded — D-02 curation over commit-log dump; D-08 honesty - dates match versionName-touching commits, cross-checkable against Play history
- [Phase 06]: [Phase 06] G-06-9 resolved per owner D-notice: Notice only — keyed changelog notice (170-key atomic surface move) + static EN-ES-PT line on scriptless privacy.html (06-01 D-13 stands, no dead-key swap); browser-native translation remains the mechanism; deploy push gate unblocked

### Pending Todos

None yet.

### Blockers/Concerns

- Custom domain name + apex-vs-www choice undecided — owner decision at Phase 8 planning
- reCAPTCHA provider (v3 vs Enterprise) hinges on Cloud Billing willingness — owner decision, first task of Phase 9
- Per-language register table needs a one-time owner pass before dictionary drafting (e.g., de du vs Sie)
- zh variant confirmation (Simplified-only?) — check app repo `strings.xml` (`values-zh-rCN`?) before locking
- App Check enforcement threshold (N successful submissions + token-failure %) to be agreed with owner in Phase 9
- Play Console privacy-URL field still owner-pending before Play submission (v1 carryover); Play listing live date gates SEO-06 flip
- Urdu Nastaliq rendering quality needs real-device visual verification (documented degradation acceptable, silent discovery is not)

## Deferred Items

Items acknowledged and deferred at milestone close, most recent first:

| Category | Item | Status | Deferred At | Milestone |
|----------|------|--------|-------------|-----------|
| I18N-10 | Per-language static HTML subdirs + hreflang | Future requirement | 2026-09-05 | post-v2 |
| FIRE-10 | App Check enforcement flip execution (owner console) | Future requirement (post-monitoring) | 2026-09-05 | post-v2 |
| I18N-05 | 17 new localizations | Promoted — Phase 7 | 2026-09-01 | v2 |
| SEO-05 | aggregateRating + social proof | Promoted — Phase 10 | 2026-09-01 | v2 |
| FIRE-07 | App Check | Promoted — Phase 9 | 2026-09-01 | v2 |
| CONT-06 | Changelog page | Promoted — Phase 6 | 2026-09-01 | v2 |
| HOST-01 | Custom domain | Promoted — Phase 8 | 2026-09-01 | v2 |

## Session Continuity

Last session: 2026-09-07T00:52:15.203Z
Stopped at: Phase 7 context gathered
Resume file: .planning/phases/07-localization-20-rtl/07-CONTEXT.md
