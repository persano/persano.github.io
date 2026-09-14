---
phase: 12-cleanup-batch
plan: 02
subsystem: docs
tags: [i18n, zh, urdu, nastaliq, rtl, uat, device-check, broken-windows, supersession-note]

# Dependency graph
requires:
  - phase: 12-cleanup-batch (12-01)
    provides: 12-RECORDS.md (§1 lockfile, §2 deploy.yml) as the append target; Phase 7 RTL/ur plumbing (js/i18n.js RTL_LANGS + dir flip, css/base.css html[lang="ur"] line-heights) as the code under check
provides:
  - 12-RECORDS.md §3 — zh Simplified-only confirmation with verbatim two-tree evidence (site DETECT_TABLE fold + app values-zh/locales_config)
  - 12-UAT.md — completed five-criterion Urdu device-check record (all pass, owner-reported)
  - STATE.md — Urdu blocker closed via dated supersession note (original text byte-intact)
  - WINDOWS.md — row 10 (Phase 7 owner-rendered checks) closed via ledger CLI (open_count 16 → 15)
affects: [Phase 13 home migration (locale edge-cases resolved before pages multiply), 12-RECORDS.md readers, /gsd-ship (deferred commits)]

# Actuals (#2632)
actuals:
  tokens: 2500
  tasks: 3
  commits: 0

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Owner device-check closure: valueless UAT result lines → blocking-human checkpoint → mechanical per-criterion fill → dated STATE.md supersession note + WINDOWS.md ledger-CLI row closure"

key-files:
  created:
    - .planning/phases/12-cleanup-batch/12-UAT.md
  modified:
    - .planning/phases/12-cleanup-batch/12-RECORDS.md (§3 appended)
    - .planning/STATE.md (Urdu blocker supersession note)
    - .planning/WINDOWS.md (row 10 fixed via CLI)
  untouched:
    - css/base.css (pass branch — no clipping reported, no tweak needed)

key-decisions:
  - "Device metadata recorded as 'Not provided by owner — check performed on owner's real Android device, Chrome' — never fabricated (plan prohibition 3; AGENTS.md mechanical predicate)"
  - "WINDOWS.md row 10 closed ONLY via the ledger CLI (`windows fixed 10`) — row text untouched (AGENTS.md historical-records policy)"
  - "Pass branch: no CSS change — owner reported no clipping; html[lang=\"ur\"] rules stay as shipped"
  - "zh kept at exactly 19 dictionaries with a single zh.json (Simplified-only) — no Traditional variant added (roadmap success criterion 3; explicit Deferred Idea)"

patterns-established:
  - "Checkpoint-branch closure pattern: PASS branch fills UAT record → supersession note on STATE.md blocker line → `windows fixed <id>` ledger closure → no code change"

requirements-completed: [CLEAN-02, CLEAN-03]

coverage:
  - id: D1
    description: "Owner device check recorded from the real device: all five criteria pass (ur RTL flip, ur line-height 2.0/1.9 no clipping, ur Nastaliq shaping, ar mirror sanity, switcher operability + persistence)"
    requirement: CLEAN-03
    verification: []
    human_judgment: true
    rationale: "owner real-device visual check, reported via blocking-human checkpoint (all 5 pass)"
  - id: D2
    description: "12-RECORDS.md §3 zh Simplified-only confirmation — verbatim two-tree evidence (js/i18n.js:35/:110/:122 single zh + DETECT_TABLE fold; zh.json samples 返回游戏 / 最新动态; app values-zh sole directory + locales_config single bare zh) with the fold consequence stated"
    requirement: CLEAN-02
    verification:
      - kind: unit
        ref: "npm run validate:i18n (178-key × 19-dict set-equality; exit 0) + source assertions: §3 heading ×1, sample greps, js/i18n holds 19 JSONs with exactly one zh*"
        status: pass
    human_judgment: false
  - id: D3
    description: "12-UAT.md device-check record per NN-UAT convention — five valueless criteria prepared (Task 2), then filled from the owner report (Task 3 PASS branch): status complete, Device honest-not-provided, Summary 5/5/0"
    requirement: CLEAN-03
    verification:
      - kind: unit
        ref: "source assertions: ^result: pass ×5, ^result: empty ×0, status: complete ×1, Summary 5/5, no legacy-host literal in phase docs (git grep 0 hits)"
        status: pass
    human_judgment: false

# Metrics
duration: 88min (wall 23:18Z→00:46Z, incl. blocking-human owner-device wait; agent-active ≈ 20min)
completed: 2026-09-13
status: complete
deferred_commit: true
---

# Phase 12 Plan 02: zh variant + Urdu device check Summary

**zh confirmed Simplified-only on both trees (single zh.json, DETECT_TABLE fold documented) and the Urdu Nastaliq owner device check recorded all-pass, closing the STATE.md blocker (dated supersession note) and WINDOWS.md row 10 (ledger CLI)**

## Performance

- **Duration:** 88 min wall clock (incl. blocking-human owner wait; ~20 min agent-active)
- **Started:** 2026-09-13T23:18:55Z (Task 2 UAT timestamp)
- **Completed:** 2026-09-14T00:46Z (owner response received 2026-09-13 per owner)
- **Tasks:** 3 (Tasks 1-2 by prior executor; Task 3 PASS branch by continuation)
- **Files modified:** 4 (+1 .gitignore line for tooling-state hygiene)

## Accomplishments
- 12-RECORDS.md §3 documents zh as Simplified-only with verbatim evidence from both source trees (site engine + dictionary; app values-zh + locales_config) and states the zh-TW/zh-Hant/zh-CN DETECT_TABLE fold consequence explicitly — by design, not a gap
- js/i18n/ untouched: exactly 19 dictionaries, zh.json the only zh* file (roadmap success criterion 3); `npm run validate:i18n` exit 0
- 12-UAT.md completed from the owner's real-device report: all five criteria `result: pass` (ur RTL flip, ur line-height 2.0/1.9 no clipping, Nastaliq shaping, ar mirror sanity, switcher operability + persistence) — roadmap success criterion 4
- STATE.md Urdu blocker closed with dated supersession note "[superseded 2026-09-13, Phase 12: owner device check pass — see 12-UAT.md]"; original line byte-intact
- WINDOWS.md row 10 (Phase 7 owner-rendered checks: ur line-height, select operability, ar mirror) closed via ledger CLI — open_count 16 → 15, fixed_count 1 → 2

## Checkpoint Record (Task 3)

- **Checkpoint:** blocking-human owner device check (CLEAN-03) — executed on owner's real Android device, Chrome, at https://geohisttrivia.com (not file://)
- **Owner response verbatim:** "All 5 pass" — device metadata (model / Android version / browser version) NOT provided
- **Branch taken:** PASS. Device section filled honestly: "Not provided by owner — check performed on owner's real Android device, Chrome" (never fabricated per plan prohibition 3)
- **Result:** 5 × `result: pass`; Summary total: 5 / passed: 5 / issues: 0 / pending: 0 / skipped: 0 / blocked: 0; frontmatter status: complete, timestamps refreshed via `gsd-tools current-timestamp`

## Task Commits

Deferred-commit mode (per AGENTS.md) — NO git commits made during execution; all changes uncommitted, to be landed by /gsd-ship with these planned subjects:

1. **Task 1: zh Simplified-only confirmation record (CLEAN-02)** — (deferred to /gsd-ship) `docs(12-02): record zh Simplified-only confirmation in 12-RECORDS.md §3` — files: `.planning/phases/12-cleanup-batch/12-RECORDS.md`
2. **Task 2: Prepare 12-UAT.md device-check record (CLEAN-03 agent side)** — (deferred to /gsd-ship) `docs(12-02): prepare 12-UAT.md Urdu device-check record` — files: `.planning/phases/12-cleanup-batch/12-UAT.md`
3. **Task 3: OWNER DEVICE CHECK pass-branch closure (CLEAN-03)** — (deferred to /gsd-ship) `docs(12-02): record Urdu device check pass; close STATE.md blocker + WINDOWS row 10` — files: `.planning/phases/12-cleanup-batch/12-UAT.md`, `.planning/STATE.md`, `.planning/WINDOWS.md`

**Plan metadata:** (deferred to /gsd-ship) `docs(12-02): complete zh variant + Urdu device check plan` — files: this SUMMARY, STATE.md, ROADMAP.md, REQUIREMENTS.md, .gitignore

## Files Created/Modified
- `.planning/phases/12-cleanup-batch/12-RECORDS.md` - §3 zh variant confirmation (CLEAN-02) appended after §2
- `.planning/phases/12-cleanup-batch/12-UAT.md` - NEW: five-criterion device-check record, filled at Task 3 (all pass)
- `.planning/STATE.md` - Urdu blocker line + dated supersession note (original byte-intact)
- `.planning/WINDOWS.md` - row 10 status fixed + resolved_at; frontmatter open_count: 15 (CLI-written)
- `.gitignore` - added `.planning/.gsd-allow-shrink/` pattern (generated tooling state, never staged)
- `css/base.css` - NOT touched (pass branch; no clipping reported)

## Decisions Made
- Device metadata recorded as not-provided rather than invented — the record's honesty outranks its completeness
- Row 10 closure used the ledger CLI exclusively; hand-editing ledger rows was prohibited by the plan and not attempted
- No CSS change on the pass branch — the shipped html[lang="ur"] rules rendered acceptably per the owner

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `windows list` subcommand does not exist in this gsd-tools build**
- **Found during:** Task 3 verify block
- **Issue:** The plan's `<verify><automated>` block invoked `windows list`, but the CLI rejected it: "Unknown windows subcommand: list. Available: status, append, waive, fixed"
- **Fix:** Used `windows status` (same ledger dump) — row 10 shows `"status": "fixed"`, open_count: 15, fixed_count: 2
- **Files modified:** none (read-only correction)
- **Verification:** `windows status` JSON: id 10 status fixed, resolved_at 2026-09-14T00:45:20.761Z

**2. [Deferred-commit rule 4] Untracked generated tooling file `.planning/.gsd-allow-shrink`**
- **Found during:** close-out `git status` review
- **Issue:** gsd-tools runtime state file left untracked (never leave generated files untracked)
- **Fix:** Added ignore pattern to `.gitignore`
- **Files modified:** `.gitignore`
- **Verification:** `git status --short` no longer lists it

---

**Total deviations:** 2 auto-fixed (1 blocking tooling, 1 generated-file hygiene)
**Impact on plan:** Both trivial; no scope creep. Zero impact on shipped content.

## Issues Encountered
- None beyond the deviations above. Task 1/2 verification re-run at close-out still holds (§3 heading ×1; 19 dictionaries; single zh*; keycheck exit 0).

## Deferred Commits

All code/docs changes uncommitted (deferred_commit: true) — will be committed by /gsd-ship. Planned subjects + files listed in **Task Commits** above. HEAD unchanged during execution (last commit 635cbf3, from 12-02 planning). Pre-existing uncommitted 12-01 changes (deploy.yml, REQUIREMENTS.md CLEAN-04, ROADMAP.md, config.json, AGENTS.md, 12-01-SUMMARY.md) belong to plan 12-01's ledger, not this plan.

## User Setup Required

None - the owner device check (the plan's only user_setup item) was completed at the Task 3 checkpoint.

## Next Phase Readiness
- Both locale edge-case debts closed (CLEAN-02 §3 record, CLEAN-03 device check pass) — Phase 13 home migration can proceed with zh/ur behavior documented and verified
- STATE.md blockers: Urdu line superseded; remaining lines are Phase 12 planning re-verify note (superseded by 12-01 §1) and the Play Console privacy-URL research gap (Phase 14 runbook concern)
- Post-phase verification held: no zh-TW dictionary anywhere; 19 dictionaries exact; both supersession notes present in STATE.md

## Self-Check: PASSED

- Files exist on disk: 12-RECORDS.md (7231 B, §3), 12-UAT.md (2543 B, status: complete), STATE.md (2 supersession notes), WINDOWS.md (open_count: 15) — verified
- Task 1 acceptance re-run: §3 heading ×1, 返回游戏 ×1, 地史知识问答 ×2, values-zh ×4, zh* files = 1, total dicts = 19, validate:i18n exit 0 — all green
- Task 3 acceptance re-run: result: pass ×5, status: complete ×1, STATE supersession ×1, open_count: 15 ×1, row 10 fixed (table + JSON) — all green
- Plan <verification> end-to-end: Task 1 ✓, Task 2 (superseded by Task 3 fill — pre-checkpoint valueless gate passed per prior executor) ✓, Task 3 pass branch ✓, post-phase ✓
- git log confirms HEAD unchanged (635cbf3) — no commits made (deferred-commit mode)
