---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Full Deferred Scope
current_phase: 6
current_phase_name: Changelog Page — first phase of milestone v2.0
status: planning
stopped_at: Phase 6 context gathered
last_updated: "2026-09-05T16:41:30.778Z"
last_activity: 2026-09-05
last_activity_desc: v2.0 roadmap created (5 phases, 17/17 requirements mapped)
state_head: d7800ca2dd0c31a11327480da26b1dd0970739aa
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-05)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel — before the app goes live on Google Play.
**Current focus:** Phase 6 — Changelog Page (ready to plan)

## Current Position

Phase: 6 of 10 (Changelog Page — first phase of milestone v2.0)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-09-05 — v2.0 roadmap created (5 phases, 17/17 requirements mapped)

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity (lifetime — v1 shipped 12 plans / 30 tasks in 4 days):**

- Total plans completed: 12 (v1)
- v2.0 plans completed: 0

**By Phase (v2.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 06 | 0 | - | - |
| 07 | 0 | - | - |
| 08 | 0 | - | - |
| 09 | 0 | - | - |
| 10 | 0 | - | - |

*Updated after each plan completion. v1 per-plan durations archived in MILESTONES.md.*

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

Last session: 2026-09-05T16:41:30.764Z
Stopped at: Phase 6 context gathered
Resume file: .planning/phases/06-changelog-page/06-CONTEXT.md
