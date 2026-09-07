---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Full Deferred Scope
current_phase: 8
current_phase_name: Custom Domain Migration
status: planning
stopped_at: Phase 07 complete, ready to plan Phase 8
last_updated: "2026-09-07T17:54:50.182Z"
last_activity: 2026-09-07
last_activity_desc: Phase 07 complete, transitioned to Phase 8
state_head: 6cc76daa1f2a104d5ae851b8de4f571f53b06324
progress:
  total_phases: 5
  completed_phases: 2
  total_plans: 9
  completed_plans: 9
  percent: 40
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-07)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel — before the app goes live on Google Play.
**Current focus:** Phase 8 — Custom Domain Migration

## Current Position

Phase: 8 — Custom Domain Migration
Plan: Not started
Status: Ready to plan
Total Plans in Phase: 6
Plans Executed: 6
Last activity: 2026-09-07 — Phase 07 complete, transitioned to Phase 8

Progress: [████████████████████] 9/9 plans — v2.0 milestone 40% (2/5 phases)

## Performance Metrics

**Velocity (lifetime — v1 shipped 12 plans / 30 tasks in 4 days):**

- Total plans completed: 9 (v1)
- v2.0 plans completed: 0

**By Phase (v2.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 06 | 3 | - | - |
| 07 | 6 | - | - |
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
| Phase 07 P01 | 14 min | 3 tasks | 5 files |
| Phase 07 P02 | 41 min | 3 tasks | 5 files |
| Phase 07 P03 | 42 min | 2 tasks | 4 files |
| Phase 07 P04 | 40 min | 2 tasks | 4 files |
| Phase 07 P06 | 4 min | 3 tasks | 21 files |

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
- [Phase 07]: Phase 07: el placed as own script group between Cyrillic and Indic in the D-03 switcher order; हिन्दी endonym spelling chosen (stay consistent)
- [Phase 07]: Phase 07: keycheck CJK half-width punct gate scoped ja+zh, ko exempt (common Korean usage); digit-period exception (0.88 passes); [zh,pt] now detects zh (first supported match wins) — documented intentional change
- [Phase 07]: [Phase 07]: Dictionary wave 1 (hi de fr ru) landed at exact 170-key parity; de drafted in Sie (app values-de mixed-register — used for terminology only), Sie-vs-du flagged for D-06 owner spot check
- [Phase 07]: [Phase 07]: Dictionary wave 2 (ja ko tr id) landed at exact 170-key parity; ja green under the live CJK punct gate with zero gate edits; raw email kept out of ja VALUES (ASCII dots fail CJK gate — mailto href keeps the address, ja prose points to contact form); brand Latin in all four per app app_name
- [Phase 07]: [Phase 07]: ko register = 해요체 (locked default; app values-ko leans 합니다체 — used for terminology only); ko keeps half-width punctuation per documented gate exemption
- [Phase 07]: [Phase 07]: Dictionary wave 3 (it pl nl vi) landed at exact 170-key parity; registers from defaults table confirmed by app data (it tu 50/Lei 17, pl Ty 24/Pan 4, nl je 94/u 1); vi pronoun-avoidant per table (0 real personal pronouns) despite app values-vi using bạn 76x; vi length 109.2% of EN with 5 longest values 91-119 percent (no 2x blowups); Latin brand kept in all four per app_name
- [Phase 07]: Phase 07: G-07-5a closed — FAQ languages answer count-style ('…and 17 more languages.') in EN baseline + all 19 dictionaries; key surface unchanged at 170 keys; validate chain green; 07-RESEARCH Open Questions marked RESOLVED (all 4 answered by 07-01/07-02)

### Pending Todos

None yet.

### Blockers/Concerns

- Custom domain name + apex-vs-www choice undecided — owner decision at Phase 8 planning
- reCAPTCHA provider (v3 vs Enterprise) hinges on Cloud Billing willingness — owner decision, first task of Phase 9
- ~~Per-language register table needs a one-time owner pass before dictionary drafting (e.g., de du vs Sie)~~ resolved Phase 7 (Sie-implied neutral de, UAT test 2 pass)
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

Last session: 2026-09-07T17:57:01.548Z
Stopped at: Phase 07 complete, ready to plan Phase 8
Resume file: None
