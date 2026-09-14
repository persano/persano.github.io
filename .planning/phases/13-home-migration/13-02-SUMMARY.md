---
phase: 13-home-migration
plan: 02
subsystem: seo-docs
tags: [google-search-console, seo, runbook, uat, sitemap, change-of-address]

# Dependency graph
requires:
  - phase: 13-home-migration (plan 01)
    provides: uncommitted atomic migration set (root landing / hub at /apps/ / stub / repointed gates / sitemap / AGENTS.md) + red-gate-proof.md with the pending direction-2 row + full local validate green
  - phase: 8-custom-domain-migration
    provides: GSC Domain property + active Change-of-Address (180-day window until ~2027-03) + 08-RUNBOOK format precedent
provides:
  - ".planning/phases/13-home-migration/13-RUNBOOK.md — GSC post-deploy owner steps (sitemap resubmit, URL inspection ×5, explicit no-CoA section, Rich Results + og:url post-checks), console-UI only"
  - ".planning/phases/13-home-migration/13-UAT.md — UAT scaffold, one pending row per MIG-01..09 incl. the owner GSC checkpoint (MIG-08) and the smoke-check direction-2 row (MIG-05) that closes red-gate-proof.md Cycle 5"
affects: [gsd-ship (phase docs commit + deploy), gsd-verify-work (executes 13-UAT.md rows), 14-launch-kit (runbook format + post-deploy GSC state)]

# Actuals (#2632)
actuals:
  tokens: 5032        # chars/4 over the two docs created (9429 + 10699) — planning bookkeeping (SUMMARY/STATE/ROADMAP/REQUIREMENTS) excluded from the estimate scale
  tasks: 2
  commits: 3          # 2 per-task docs commits + 1 plan-metadata docs commit (all .planning bookkeeping; zero code commits — deferred-commit mode)

# Tech tracking
tech-stack:
  added: []           # none — doc-only plan
  patterns:
    - "Owner runbook pattern: prerequisites → console-UI steps → do-not-do guard section → post-checks, each step recordable into a UAT row"
    - "UAT scaffold pattern: one row per requirement with check + expected + status-pending + result-pending; mechanical pass/issue predicate stated once in the header"

key-files:
  created:
    - .planning/phases/13-home-migration/13-RUNBOOK.md
    - .planning/phases/13-home-migration/13-UAT.md
    - .planning/phases/13-home-migration/13-02-SUMMARY.md
  modified:
    - .planning/STATE.md
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md

key-decisions:
  - "13-UAT.md documents the mechanical predicate without emitting the pre-filled literals the task verify greps for (tension between the action text and the zero-pre-filled-results acceptance criterion — see Deviations 1)"
  - "Runbook URL-inspection table covers the 4 URLs the plan action enumerates plus a grouped 5th row (unchanged sub-pages guide/changelog/contact), satisfying the acceptance criterion's count of 5 while staying truthful (see Deviations 2)"
  - "Both docs avoid even the AGENTS.md-style wildcard legacy-host phrasing — the plan's verify greps bare 'github.io' (stricter than the repo gate's full-host needle); the dual-hosts fact reads 'legacy-host path-preserved chain' / 'legacy Pages host' (see Deviations 3)"
  - "MIG-08 requirement marked complete = the runbook deliverable + pre-staged UAT rows; the LIVE owner console steps remain explicitly post-deploy (EA-17) and are gated by 13-UAT.md execution"

patterns-established:
  - "Do-not-do guard section in owner runbooks (no-CoA) — irreversible-state prohibitions get their own section with doc-verified rationale, not a footnote"
  - "Expectation-guard rows in UAT (Pitfall-7 fragment loss pre-declared 'correct, not an issue') so UAT cannot misread known cosmetics as blockers"

requirements-completed: [MIG-08]

coverage:
  - id: D1
    description: "13-RUNBOOK.md — GSC post-deploy owner runbook: 5 numbered sections (Prerequisites, sitemap resubmit, URL inspection, explicit no-CoA, post-checks), console-UI only, zero secrets, zero legacy-host literals, 180-day no-refile/no-cancel guard"
    requirement: MIG-08
    verification:
      - kind: other
        ref: "rg -c 'Sitemaps' 13-RUNBOOK.md -> 2; rg -c 'Change-of-Address' -> 5; rg -c 'github\\.io' -> 0 matches (exit 1)"
        status: pass
    human_judgment: false
  - id: D2
    description: "13-UAT.md — UAT scaffold with one pending row per MIG-01..MIG-09, MIG-08 owner checkpoint referencing 13-RUNBOOK.md sections, Pitfall-7 expectation note on MIG-02, zero pre-filled result values"
    requirement: MIG-08
    verification:
      - kind: other
        ref: "rg -c 'MIG-0' 13-UAT.md -> 11; rg -c 'result: pass|result: issue' -> 0 matches (exit 1)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Post-deploy live verification: smoke-check ALL PASS on the live site (red-gate Cycle 5 direction-2 closure) + owner GSC steps executed per runbook and recorded in 13-UAT.md"
    verification: []
    human_judgment: true
    rationale: "Executes POST-DEPLOY after /gsd-ship (flagged assumption EA-17) — owner console + live-site actions that cannot run at authoring time; pre-staged as pending rows in 13-UAT.md and routed through the phase UAT gate"

# Metrics
duration: 9min
completed: 2026-09-14
status: complete
---

# Phase 13 Plan 02: Home Migration Docs Summary

**GSC post-deploy owner runbook (sitemap resubmit + URL inspection + explicit no-CoA guard) and the MIG-01..09 UAT scaffold — both console-UI-only, zero secrets, zero legacy-host literals; live owner steps pre-staged as pending rows for post-deploy execution (EA-17).**

## Performance

- **Duration:** 9 min
- **Started:** 2026-09-14T18:53:03Z
- **Completed:** 2026-09-14T19:02:04Z
- **Tasks:** 2/2
- **Files created:** 2 (+1 summary); **code/content/script/sitemap files touched:** 0

## Accomplishments

- Authored `13-RUNBOOK.md` (08-RUNBOOK format): §1 prerequisites (ship landed + Pages deploy green + live smoke-check ALL PASS, cross-referenced to red-gate-proof.md's pending direction-2 row), §2 GSC sitemap resubmit (6-URL set, no redirected URL, record the date), §3 URL inspection (/, /apps/, /geohist/ redirect-classified with a do-NOT-request-indexing guard, /geohist/privacy.html unchanged, unchanged sub-pages), §4 explicit no-CoA section (P-13-04: verbatim doc-exclusion quote "just add redirects, and update your sitemaps as appropriate"; 180-day window until ~2027-03 untouched — no refile, no cancel), §5 post-checks (Rich Results Test on `/` SoftwareApplication + og:url sharing-debugger spot-check).
- Authored `13-UAT.md` scaffold: one pending row per MIG-01..MIG-09 with check + expected + `status: pending` + `result: pending`; MIG-02 carries the Pitfall-7 expectation note (fragment loss → lands at top = CORRECT, not an issue); MIG-05 carries the red-gate-proof.md Cycle 5 direction-2 cross-reference; MIG-08 is the owner GSC checkpoint with per-URL recording slots; mechanical predicate (any recorded issue = blocker) stated once in the header; public-artifact notice on top.
- EA-17 honored end-to-end: neither doc assumes resubmission guarantees recrawl — the runbook and the MIG-08 row both state URL inspection exists precisely because resubmission timing is not guaranteed; all live steps marked post-deploy.

## Verification Evidence (verbatim)

Task 1 verify (plan's `<automated>` block, run piecewise after a PowerShell chain-parse quirk):

```
Test-Path .planning/phases/13-home-migration/13-RUNBOOK.md   -> True
rg -c "Sitemaps"            ...13-RUNBOOK.md                 -> 2
rg -c "Change-of-Address"   ...13-RUNBOOK.md                 -> 5
rg -c "github\.io"          ...13-RUNBOOK.md                 -> (no output) github.io grep exit: 1   [0 matches - PASS]
```

Acceptance-criteria sweeps: `rg -n "^## §"` → 5 numbered sections (§1 Prerequisites, §2 sitemap resubmit, §3 URL inspection, §4 Change-of-Address no-CoA, §5 post-checks); `rg -n "2027-03|No refile|No cancel"` → 3 hits in §4; secret-shape grep (`api[_ -]?key|token|password|secret|credential`, case-insensitive) → only the public-artifact disclaimer line itself (same phrasing as the 08-RUNBOOK precedent).

Task 2 verify (plan's `<automated>` block):

```
Test-Path .planning/phases/13-home-migration/13-UAT.md                       -> True
rg -c "MIG-0" ...13-UAT.md                                                   -> 11   (>= 9 rows)
rg -c "result: pass|result: issue" ...13-UAT.md                              -> (no output) result-grep exit: 1   [0 pre-filled results - PASS]
```

Extra gates (plan `<verification>` items 4-5): `rg -c "github\.io"` on 13-UAT.md → exit 1 (0 matches); secret-shape grep → only the disclaimer line; `git status --porcelain` after both tasks → exactly the untouched 13-01 migration set (13 modified + untracked `apps/`), proving zero code/content/script/sitemap changes from this plan.

## Must-Haves Mapping

| Must-have | Evidence |
|-----------|----------|
| Owner can execute post-deploy GSC steps from console UI alone, zero secrets (MIG-08) | 13-RUNBOOK.md §2-§5 + §1 prerequisite table; secret-shape grep clean; every step names a console screen/tool, no CLI/credential anywhere |
| No-CoA refile/cancel explicitly forbidden with doc-verified rationale; 180-day window until ~2027-03 untouched (P-13-04) | 13-RUNBOOK.md §4: verbatim quote "just add redirects, and update your sitemaps as appropriate"; "**No refile**"/"**No cancel**" bullets; "There is nothing to click in this section"; 13-UAT.md MIG-08 §4 pass-condition line |
| Post-deploy owner steps pre-scaffolded with mechanical pass/issue recording (any issue = blocker) | 13-UAT.md MIG-08 row: per-URL recording slots + "set the row's `result:` field to pass or issue" + header predicate "any recorded issue is a blocker — no gap-awareness" |

## Decisions Made

See `key-decisions` frontmatter: predicate phrased without pre-filled literals; URL-inspection 5th grouped row; stricter-than-gate legacy-host phrasing; MIG-08 marked complete = deliverable + pre-staged rows while live steps stay UAT-gated.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Consistency] Action text vs verify gate contradiction on the recording predicate**
- **Found during:** Task 2
- **Issue:** the task action said to record outcomes "with `result: pass` or `result: issue`", but the task's own `<verify>` greps `result: pass|result: issue` and requires ZERO matches (no fabricated outcomes). Writing the action text verbatim would fail the plan's own gate.
- **Fix:** documented the predicate without emitting the pre-filled literals — "set the row's `result:` field to pass or issue" — which preserves the mechanical-recording intent and leaves the zero-pre-filled acceptance green.
- **Files modified:** .planning/phases/13-home-migration/13-UAT.md
- **Verification:** `rg -c "result: pass|result: issue"` → exit 1 (0 matches)
- **Committed in:** 9020628

**2. [Rule 1 - Count] Acceptance criterion says "all 5 URLs" while the action enumerates 4**
- **Found during:** Task 1
- **Issue:** the action lists exactly 4 inspection URLs (/, /apps/, /geohist/, /geohist/privacy.html) but the acceptance criterion requires "all 5 URLs listed in the action".
- **Fix:** added a grouped 5th table row — unchanged sub-pages (guide/changelog/contact) with the UNCHANGED-indexed-state expectation — truthful (their hrefs changed in the same commit; paths/canonicals did not) and consistent with the UAT MIG-08 row.
- **Files modified:** .planning/phases/13-home-migration/13-RUNBOOK.md (and mirrored in 13-UAT.md)
- **Verification:** inspection table shows 5 rows with expected outcomes
- **Committed in:** c1bd152 / 9020628

**3. [Rule 1 - Gate coupling] Legacy-host phrasing stricter than AGENTS.md's canonical form**
- **Found during:** Task 1
- **Issue:** AGENTS.md phrases the dual-hosts fact as "legacy `*.github.io` Pages host", but the plan's verify greps bare `github\.io` — even the wildcard form would fail the plan gate.
- **Fix:** both docs say "legacy-host path-preserved chain" / "legacy Pages host"; the literal and its wildcard form are absent from both files. (The repo CI gate's needle is the full host and is unaffected either way; the plan gate is stricter, so the plan gate wins.)
- **Files modified:** 13-RUNBOOK.md, 13-UAT.md
- **Verification:** `rg -c "github\.io"` → exit 1 on both files
- **Committed in:** c1bd152 / 9020628

---

**Total deviations:** 3 auto-fixed (3 × Rule 1 documentation-consistency; zero behavior changes — doc-only plan).
**Impact on plan:** none on substance; all three resolve self-contradictions between plan action prose and its own acceptance gates without weakening any invariant.

## Issues Encountered

- PowerShell mangled the plan's chained one-line `<automated>` verify (`&&` + nested parens with `;`), erroring on parse. Resolved by running the same commands piecewise with explicit `$LASTEXITCODE` echoes — every assertion is present verbatim above. No substance change.

## Known Stubs

None — the `result: pending` rows in 13-UAT.md are the plan's designed deliverable ("do NOT fabricate results"), not unfinished work; they execute post-deploy at UAT time (EA-17) and are tracked by REQUIREMENTS.md (MIG-08) + the phase UAT gate.

## User Setup Required

None — no external service configuration required by this plan (the owner GSC steps are documented in the runbook, not set up here).

## Next Phase Readiness

- Phase 13 authoring work complete: migration set (13-01, uncommitted) + runbook + UAT scaffold + red-gate proofs ready to ride the ship (`/gsd-ship` lands the ONE atomic migration commit + the phase docs commit, then pushes → Pages deploy).
- Post-ship: execute 13-UAT.md rows (MIG-05 smoke-check direction-2 closes red-gate-proof.md Cycle 5; MIG-08 owner GSC steps per 13-RUNBOOK.md §2-§5).
- Phase 14 (Launch Kit) can plan against root `index.html` paths per AGENTS.md; LKIT-04's 10-RUNBOOK supersession note and GA4 note ride the Phase 14 runbook addenda.

## Deferred Commits

Deferred-commit mode ACTIVE: **no code changes exist in this plan**; the following .planning bookkeeping commits were made via the gsd-tools SDK (the only permitted commit path):

- `docs(13-02): author GSC post-deploy runbook (sitemap resubmit, URL inspection, no-CoA)` — files: .planning/phases/13-home-migration/13-RUNBOOK.md — committed `c1bd152`
- `docs(13-02): author post-deploy UAT scaffold (MIG-01..09, all rows pending)` — files: .planning/phases/13-home-migration/13-UAT.md — committed `9020628`
- `docs(13-02): complete home-migration docs plan` — files: 13-02-SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md — committed at close

The 13-01 migration set (13 modified files + new `apps/`) remains UNCOMMITTED in the working tree, untouched by this plan — it will be committed by `/gsd-ship` as the ONE atomic migration commit. Do NOT run /gsd-ship from this plan; do NOT push.

---
*Phase: 13-home-migration*
*Completed: 2026-09-14*

## Self-Check: PASSED

All created files exist on disk (13-RUNBOOK.md, 13-UAT.md, 13-02-SUMMARY.md); both task commits present in git log (c1bd152, 9020628). All task acceptance criteria green; plan-level verification items 1-5 green (see Verification Evidence).
