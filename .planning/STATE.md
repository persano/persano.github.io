---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Full Deferred Scope
current_phase: 09
current_phase_name: App Check, Monitor-First
status: executing
stopped_at: "Completed 09-01-PLAN.md (App Check gate + i18n key #171)"
last_updated: "2026-09-08T02:48:45.354Z"
last_activity: 2026-09-07
last_activity_desc: Phase 09 execution started
state_head: 73fd4c2b178705e05cf2b262a764b024d99b933b
progress:
  total_phases: 5
  completed_phases: 3
  total_plans: 14
  completed_plans: 12
  percent: 60
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-07)

**Core value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel — before the app goes live on Google Play.
**Current focus:** Phase 09 — App Check, Monitor-First

## Current Position

Phase: 09 (App Check, Monitor-First) — EXECUTING
Plan: 2 of 2
Status: Ready to execute
Total Plans in Phase: 2
Plans Executed: 6
Last activity: 2026-09-07 — Phase 09 execution started

Progress: [############] 12/12 plans - v2.0 milestone [██████░░░░] 60% (3/5 phases)

## Performance Metrics

**Velocity (lifetime — v1 shipped 12 plans / 30 tasks in 4 days):**

- Total plans completed: 12 (v1)
- v2.0 plans completed: 12 (Phase 6 ×3, Phase 7 ×6, Phase 8 ×3)

**By Phase (v2.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 06 | 3 | - | - |
| 07 | 6 | - | - |
| 08 | 3 | - | - |
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
| Phase 08 P01 | 12 min | 3 tasks | 3 files |
| Phase 08 P02 | 5 min | 2 tasks | 15 files |
| Phase 08 P03 | 5 min | 2 tasks | 1 files |
| Phase 09 P01 | 3 min | 2 tasks | 22 files |

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
- [Phase 08]: Phase 08 P01: owner option-B divergence ruling — GitHub TXT NXDOMAIN absorbed as runbook §1b/§2 re-add flow; https_enforced flipped true on cert-approved (GET-after-PUT proof); Task 3 gate = six items; http edge propagation ≤24h pending
- [Phase 08]: [Phase 08] TXT divergence ruled option B by owner: enforce flip proceeded before TXT restore; runbook §1/§2 amended; six-item gate passed with protected_domain_state=verified
- [Phase 08]: Phase 08 P02: CI gate needle runtime-assembled ([persano,github,io].join) so gate source stays legacy-host-free (self-scan-safe); hidden-dir walk skip mirrors the ignore-respecting rg acceptance; NUL-byte binary skip for media
- [Phase 08]: Phase 08 P02: validate:domain chained after validate:html; linkinator skip = plain-string apex (never regex lookahead); 44-ref rewrite via literal equal-length host swap — path-preserved 1:1, apex only, never www
- [Phase 08]: [Phase 08] 08-02 landed: migration commit c72b3a2 (15 files, gate+44 refs atomic) merged to main 7f0cf4e, CI validate+deploy green incl validate:domain, smoke ALL PASS on apex, curl triple (apex 200 / www 301 / github.io 301 path-preserved). Owner ruled push-now over deferred-ship to close mixed-domain window; smoke-check.sh blob has CRLF (normalized LF in worktree for Git Bash; cosmetic, git-normalized)
- [Phase 09]: Phase 09 P01: App Check dormant-by-default - recaptchaSiteKey empty string keeps monitoring mode pre-activation; zero user-visible change until owner console activation — D-01/D-02: code attests, console enforces; empty key = legacy path unchanged, real users see zero change pre-activation
- [Phase 09]: Phase 09 P01: explicit getToken(appCheck, false) gate is the only observable token-failure seam in monitoring mode (SDK swallows failures elsewhere); status UX + Analytics event wired from its rejection — Research Pattern 1/2: without the gate neither contact.status.appcheck nor appcheck_token_failure could ever fire
- [Phase 09]: Phase 09 P01: appCheckInstance cache-once module-level guard (not same-options idempotence) - resubmit can never re-run initializeAppCheck — Pitfall 2: already-initialized throw on resubmit; cache-once is fragile-proof against config edits
- [Phase 09]: Phase 09 P01: case-tolerant appcheck-family mapping (/^app-?check\//i + permission-denied) to dedicated status + consent-gated persano:appcheck event; no auto-retry — D-06/D-07 + research Pattern 3: runtime literal is camelCase appCheck/; permission-denied attribution unambiguous under create-only rules; init-time and token-time failures are one family

### Pending Todos

None yet.

### Blockers/Concerns

- reCAPTCHA provider (v3 vs Enterprise) hinges on Cloud Billing willingness — owner decision, first task of Phase 9
- ~~Per-language register table needs a one-time owner pass before dictionary drafting (e.g., de du vs Sie)~~ resolved Phase 7 (Sie-implied neutral de, UAT test 2 pass)
- zh variant confirmation (Simplified-only?) — check app repo `strings.xml` (`values-zh-rCN`?) before locking
- App Check enforcement threshold (N successful submissions + token-failure %) to be agreed with owner in Phase 9
- Play Console privacy-URL field still owner-pending before Play submission (v1 carryover); Play listing live date gates SEO-06 flip
- Urdu Nastaliq rendering quality needs real-device visual verification (documented degradation acceptable, silent discovery is not)
- Selector-page removal + GeoHist-as-home requested by owner during 08-03 gate — new product decision, route to /gsd-plan-phase (post-phase-8 backlog, not phase 8 scope)
- ⚠️ [Phase 8] GSC Change-of-Area 180-day signal window active until ~2027-03 — old property retained for D-08 index-decay monitoring; don't delete

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

Last session: 2026-09-08T02:48:44.836Z
Stopped at: Completed 09-01-PLAN.md (App Check gate + i18n key #171)
Resume file: None
