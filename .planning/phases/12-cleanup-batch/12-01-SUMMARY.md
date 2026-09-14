---
phase: 12-cleanup-batch
plan: 01
subsystem: infra
tags: [github-actions, npm-ci, setup-node-cache, package-lock, ci-reproducibility, supersession-note]

# Dependency graph
requires:
  - phase: 05 (v2.0)
    provides: committed package-lock.json (f0f56ca, 2026-09-02) that npm ci and the cache key depend on
  - phase: 11 (v2.0)
    provides: shipped repo state and AGENTS.md conventions this plan edits against
provides:
  - deploy.yml validate job: lockfile-frozen install (npm ci) + setup-node cache: npm restore; stale NOTE comment removed
  - CLEAN-04 verdict: lockfile tracked + npm ci --dry-run exit 0, recorded in 12-RECORDS.md §1; STATE.md blocker closed via dated supersession note
  - Post-ship CI evidence slot: 12-RECORDS.md §2 with commands, MISS-then-save expectations, two pending verdict rows
  - AGENTS.md CI deploy chain row states shipped install reality
affects: [phase 13-15 validate runs (reproducible CI), /gsd-ship (post-ship gh run watch per §2), 12-02 (shares 12-RECORDS.md and STATE.md blockers)]

# Actuals (#2632)
actuals:
  tokens: 2600    # chars/4 over realized diff: deploy.yml 2+/4-, AGENTS.md 1+/1-, STATE.md 9+/9-, 12-RECORDS.md ~3.8k chars new, this SUMMARY new
  tasks: 2
  commits: 0      # deferred-commit mode — /gsd-ship lands them

# Tech tracking
tech-stack:
  added: []       # zero new packages — config + verification + records only
  patterns:
    - "npm ci (lockfile-frozen install) + setup-node cache: npm keyed on package-lock.json hash"
    - "record-gates-removal: stale comment removed only after the verdict record exists"
    - "blocker closure via dated bracketed supersession note, original text byte-intact"

key-files:
  created:
    - .planning/phases/12-cleanup-batch/12-RECORDS.md
    - .planning/phases/12-cleanup-batch/12-01-SUMMARY.md
  modified:
    - .github/workflows/deploy.yml
    - AGENTS.md
    - .planning/STATE.md

key-decisions:
  - "Explicit setup-node cache: npm input (no packageManager field — rejected per research; field changes corepack/tooling behavior)"
  - "No cache-dependency-path added — single root lockfile is setup-node README basic usage"
  - "chromedriver@152.0.3 allowScripts warning recorded as warn-only; no --ignore-scripts flag added"
  - "deploy.yml edited byte-exact via .NET (LF-preserving) so the 2+/4- numstat gate stays clean"

patterns-established:
  - "Supersession-note closure: STATE.md blocker lines keep original text; dated '[superseded YYYY-MM-DD, Phase 12: ...]' note appends"
  - "Verify-then-record: fresh executor-run command outputs recorded verbatim in 12-RECORDS.md before dependent removals"

requirements-completed: [CLEAN-01, CLEAN-04]

coverage:
  - id: D1
    description: "deploy.yml validate job: setup-node cache: npm + npm ci install, stale NOTE comment removed, diff scoped 2+/4-"
    requirement: CLEAN-01
    verification:
      - kind: other
        ref: "source greps: cache_npm=1, run_npmci=1, npm_install=0, proxy_broken=0, lines=46, numstat 2 4"
        status: pass
      - kind: other
        ref: "npm run validate (full chain) exit 0 on edited tree"
        status: pass
    human_judgment: false
  - id: D2
    description: "Lockfile consistency verdict (CLEAN-04): fresh executor-run commands recorded verbatim in 12-RECORDS.md §1 with provenance f0f56ca and dated verdict"
    requirement: CLEAN-04
    verification:
      - kind: other
        ref: "git ls-files package-lock.json -> package-lock.json; npm ci --dry-run exit 0 (recorded §1)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Post-ship CI verification template in 12-RECORDS.md §2: gh commands, MISS-then-save expectations, two pending verdict rows"
    requirement: CLEAN-01
    verification:
      - kind: other
        ref: "source greps: sec2=1, ghrunlist=3, ghrunwatch=1, cache_not_found=1, verdict_pending=2"
        status: pass
    human_judgment: false
  - id: D4
    description: "Backstop: post-ship pipeline green (validate with npm ci + cache: npm active; deploy) — run #1 expected MISS-save, run #2 expected HIT"
    requirement: CLEAN-01
    verification: []
    human_judgment: true
    rationale: "CI green is only confirmable after /gsd-ship pushes the Phase 12 commits — deferred-commit mode means the workflow has not run yet. Verifier confirms post-ship via gh run list/watch and fills 12-RECORDS.md §2 rows, or abstains to human_needed."

# Metrics
duration: 12min
completed: 2026-09-13
status: complete
deferred_commit: true
---

# Phase 12 Plan 01: CI Reproducibility + Lockfile Verdict Summary

**Validate job installs from the committed lockfile (`npm ci`) with npm cache restore (`cache: npm`), stale no-lockfile NOTE comment removed under a recorded CLEAN-04 verdict, AGENTS.md + STATE.md aligned to shipped reality**

## Performance

- **Duration:** 12 min
- **Started:** 2026-09-13T20:02-03:00 (approx, executor session start)
- **Completed:** 2026-09-13T20:14:16-03:00
- **Tasks:** 2/2
- **Files modified:** 5 (3 planned + 2 planning docs)

## Accomplishments

- CLEAN-04 closed with fresh evidence: `git ls-files package-lock.json` → `package-lock.json` (tracked) and `npm ci --dry-run` → exit 0 ("up to date in 1s", chromedriver@152.0.3 allowScripts warning warn-only), recorded verbatim in `12-RECORDS.md` §1 with provenance (f0f56ca, 2026-09-02, Phase 5) and the dated verdict.
- CLEAN-01 landed in `deploy.yml`: `cache: npm` added inside `actions/setup-node@v7` with: block, install swapped to `- run: npm ci`, stale three-line NOTE comment deleted — numstat exactly 2 insertions / 4 deletions, file 46 lines, everything else untouched.
- `AGENTS.md` CI deploy chain row now states shipped reality: `npm ci` with setup-node `cache: npm`; lockfile committed since Phase 5 (Node 24 + deploy.yml reference kept).
- STATE.md lockfile blocker closed per supersession policy: original line byte-intact, dated `[superseded 2026-09-13, Phase 12: lockfile tracked since f0f56ca, npm ci --dry-run exit 0 — see 12-RECORDS.md §1]` appended.
- Post-ship CI evidence slot (§2) ready: `gh run list --limit 2` + `gh run watch <run-id> --exit-status`, MISS-then-save expectations (run #1 "Cache not found for input keys" = designed behavior; cache keyed on package-lock.json hash; judge speed on run #2), two `verdict: pending` rows.

## Verification Evidence

Fresh re-verification (executor-run, 2026-09-13):

```
$ git ls-files package-lock.json
package-lock.json
$ npm ci --dry-run
up to date in 1s
... chromedriver@152.0.3 allowScripts warning (warn-only) ...
DRYRUN_EXIT=0
```

deploy.yml numstat (after edit): `2  4  .github/workflows/deploy.yml` (2 insertions / 4 deletions, 46 lines).

Local validation after all edits: `npm ci --dry-run` → exit 0; full chain `npm run validate` (validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n) → **VALIDATE_EXIT=0** (check-no-old-domain: OK, 23/23 detect tests pass, i18n-keycheck OK 178×19, 19 links scanned OK).

Task 1 automated verify: cache_npm=1, run_npmci=1, npm_install=0, proxy_broken=0, lines=46, until_lockfile=0, npmci_agents=1, superseded=1, f0f56ca=1 — all PASS.

Task 2 automated verify: sec2=1, ghrunlist=3, ghrunwatch=1, cache_not_found=1, verdict_pending=2 — all PASS.

**Backstop follow-up (post-ship, per §2):** after /gsd-ship pushes to main, watch the new run (`gh run list --limit 2` → `gh run watch <run-id> --exit-status`): run #1 expected cache MISS-then-save, run #2 expected HIT; both jobs green → fill §2 rows and flip both verdicts. First-run MISS is designed behavior, not an error.

## Task Commits

Deferred-commit mode — nothing committed during plan execution; /gsd-ship lands every commit with these planned subjects:

1. **Task 1: Lockfile verdict → record → supersession note → deploy.yml CI slice → local validation** — `chore(12-01): lockfile verdict + npm ci + setup-node cache in CI` (deferred to /gsd-ship) — files: `.github/workflows/deploy.yml`, `AGENTS.md`, `.planning/STATE.md`, `.planning/phases/12-cleanup-batch/12-RECORDS.md`
2. **Task 2: Post-ship CI verification template in 12-RECORDS.md §2** — `docs(12-01): post-ship CI verification template (CLEAN-01 evidence slot)` (deferred to /gsd-ship) — files: `.planning/phases/12-cleanup-batch/12-RECORDS.md`

Plan metadata docs commit (SUMMARY/STATE/ROADMAP): also deferred — /gsd-ship owns it.

## Deferred Commits

- chore(12-01): lockfile verdict + npm ci + setup-node cache in CI — files: .github/workflows/deploy.yml, AGENTS.md, .planning/STATE.md, .planning/phases/12-cleanup-batch/12-RECORDS.md
- docs(12-01): post-ship CI verification template (CLEAN-01 evidence slot) — files: .planning/phases/12-cleanup-batch/12-RECORDS.md

All code changes uncommitted — will be committed by /gsd-ship.

## Files Created/Modified

- `.planning/phases/12-cleanup-batch/12-RECORDS.md` (new) — §1 lockfile verdict (CLEAN-04), §2 post-ship CI template (CLEAN-01 evidence slot); §3 reserved for plan 12-02 (zh variant)
- `.github/workflows/deploy.yml` (modified) — `cache: npm` + `npm ci` + stale comment removed (2+/4−, 46 lines)
- `AGENTS.md` (modified) — CI deploy chain row: `npm ci` with setup-node `cache: npm`; lockfile committed since Phase 5
- `.planning/STATE.md` (modified) — dated supersession note appended to the lockfile blocker line (original text intact)

## Decisions Made

- Explicit `cache: npm` input; no `packageManager`/`devEngines.packageManager` field added (prohibition honored — field would change corepack/local tooling behavior)
- No `cache-dependency-path` added — single root lockfile, README basic usage omits it
- chromedriver@152.0.3 allowScripts warning: recorded warn-only, no `--ignore-scripts` (validate chain never invokes chromedriver)
- LF-preserving byte-exact edit for deploy.yml via .NET WriteAllText to keep the numstat gate clean
- Prohibitions honored: no hand-edit of package-lock.json; no validate-chain/permissions/deploy-job restructuring; comment removed only after the verdict record existed

## Deviations from Plan

None — plan executed exactly as written. Line-count prediction matched reality (46 lines), numstat matched (2/4), both command exit codes matched plan-time evidence.

## Issues Encountered

- Pre-existing uncommitted orchestrator edits in `.planning/STATE.md` (execution-start position updates) and `.planning/config.json` were already present when this plan started; left untouched and uncommitted — not part of this plan's diff.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 12-02 can append §3 (zh variant confirmation) to 12-RECORDS.md and close the Urdu blocker line the same way
- Phase 13-15 gate-heavy work gets reproducible CI installs on every validate run
- Post-ship: §2 rows must be filled by the first two CI runs after /gsd-ship (MISS expected on #1, HIT on #2)

---
*Phase: 12-cleanup-batch*
*Completed: 2026-09-13*

## Self-Check: PASSED

- All 5 key files FOUND on disk (deploy.yml, AGENTS.md, STATE.md, 12-RECORDS.md, 12-01-SUMMARY.md)
- Task 1 acceptance criteria re-run: cache_npm=1, run_npmci=1, npm_install=0, proxy_broken=0, lines=46, numstat 2/4, until_lockfile=0, phase5-row=1, §1 headings=3, §1 exit-code=1, superseded-note=1 — PASS
- Task 2 acceptance criteria re-run: §2 heading=1, verdict_pending=2 (exactly) — PASS
- `npm ci --dry-run` → exit 0; `npm run validate` → VALIDATE_EXIT=0 (domain OK, detect 23/23, keycheck OK, links OK)
- Commit checks: N/A — deferred-commit mode, nothing committed (see Deferred Commits; /gsd-ship lands them)
