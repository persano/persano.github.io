---
phase: 01-foundation-deploy-pipeline-skeleton-privacy-policy
plan: 02
subsystem: infra
tags: [github-actions, github-pages, ci, html-validate, linkinator, node]

requires:
  - phase: 01-01
    provides: [hub + 404 + privacy pages, old-policy disposition record]
provides:
  - two-job gated deploy workflow (validate → deploy) on push to main
  - dev tooling (html-validate 11.12.0, linkinator 8.1.0, npm validate scripts)
  - live site at https://persano.github.io via push→CI→Pages
  - re-runnable post-deploy smoke-check script (scripts/smoke-check.sh)
affects: [all later phases (push→deploy), phase-5 play submission]

actuals:
  tokens: 2500    # chars/4 over files changed (~10KB: workflow+tooling+smoke script+docs) — estimate 50000 assumed heavier tooling work
  tasks: 3
  commits: 3

tech-stack:
  added: [html-validate 11.12.0, linkinator 8.1.0, github actions official pages chain (checkout@v7, setup-node@v7, configure-pages@v6, upload-pages-artifact@v5, deploy-pages@v5)]
  patterns: [validate-gates-deploy (needs:), least-privilege workflow permissions, concurrency group "pages" cancel-in-progress:false, include-hidden-files for .nojekyll]

key-files:
  created: [.github/workflows/deploy.yml, package.json, .htmlvalidate.json, scripts/smoke-check.sh]
  modified: []

key-decisions:
  - npm install fallback in validate job (no package-lock.json — local npm CLI proxy-broken per research); npm ci + cache: npm to be restored once a lockfile lands
  - Single controlled push executed by orchestrator (executor harness denies git push) — permission gate, normal flow
  - Old-policy deletion stays DEFERRED (carried from 01-01): old root URL still 200s; Play Console field must be updated to /geohist/privacy.html before submission; delete old files after (Phase 5 trace)

patterns-established:
  - Push to main is the only deploy action: validate job (html-validate + linkinator) gates deploy via needs:
  - scripts/smoke-check.sh re-run after every deploy (reused before Play submission)
  - No third-party actions; official chain pinned to verified majors

requirements-completed: [OPS-01, OPS-02, OPS-03]

coverage:
  - id: D1
    description: "Two-job gated workflow: validate (html-validate + linkinator) gates deploy (official 4-action Pages chain)"
    requirement: OPS-01
    verification:
      - kind: e2e
        ref: "gh run view 33587621659 — validate success (11s) → deploy success (15s), triggered by push of 6a48ca6"
        status: pass
    human_judgment: false
  - id: D2
    description: "Dev tooling: package.json pins html-validate 11.12.0 + linkinator 8.1.0; .htmlvalidate extends recommended; validate scripts exclude .planning/"
    requirement: OPS-01
    verification:
      - kind: e2e
        ref: "CI validate job log: 'npm install' + 'npm run validate' green on ubuntu-latest node 24"
        status: pass
    human_judgment: false
  - id: D3
    description: "Live site + smoke checks: /, /geohist/privacy.html, /app-ads.txt, /google7da873f4e9609872.html → 200; unknown path → 404 with hub link; /.nojekyll → 200"
    requirement: OPS-03
    verification:
      - kind: e2e
        ref: "bash scripts/smoke-check.sh exit 0 — 6/6 checks (CI run 33587621659 deploy success, CDN wait 60s)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Pages source switched to GitHub Actions before first deploy (build_type workflow)"
    requirement: OPS-02
    verification:
      - kind: other
        ref: "gh api repos/persano/persano.github.io/pages --jq .build_type → 'workflow' (Task 2 checkpoint, verified before push)"
        status: pass
    human_judgment: false

duration: 45min (includes owner checkpoint wait + push handoff)
completed: 2026-09-02
status: complete
---

# Phase 1 Plan 2: Deploy Pipeline + Go-Live Summary

**Two-job gated CI pipeline (html-validate + linkinator → official Pages chain) deployed the site live at https://persano.github.io — push is now the only deploy step, with smoke checks 6/6 green.**

## Performance
- **Duration:** ~45min (includes owner Pages-source checkpoint wait + push handoff)
- **Started:** 2026-09-02 (session span; first plan commit 00:28 -03:00, CI green 00:37)
- **Completed:** 2026-09-02
- **Tasks:** 3
- **Files modified:** 4 created, 0 modified

## Accomplishments
- Two-job workflow `.github/workflows/deploy.yml`: validate job (checkout@v7 → setup-node@v7 node 24 → npm install → npm run validate) gates deploy job (`needs: validate`; checkout@v7 → configure-pages@v6 → upload-pages-artifact@v5 `path: '.'` + `include-hidden-files: true` → deploy-pages@v5); least-privilege permissions (top-level `contents: read`; deploy-only `pages: write` + `id-token: write`); concurrency group `pages`, `cancel-in-progress: false`
- Dev tooling committed: `package.json` (exact-pinned html-validate 11.12.0 + linkinator 8.1.0; validate scripts scan only index.html, 404.html, geohist/*.html — never .planning/), `.htmlvalidate.json` (extends html-validate:recommended)
- First CI run on main: validate green (11s) → deploy success (15s) for commit 6a48ca6 — https://github.com/persano/persano.github.io/actions/runs/33587621659
- Site LIVE: push→CI→Pages with zero manual steps; all Phase 1 content published
- Smoke checks 6/6 green (`bash scripts/smoke-check.sh` exit 0):
  - `/` → 200 (hub serves footer privacy link)
  - `/geohist/privacy.html` → 200 (Play-critical URL live)
  - `/app-ads.txt` → 200, `/google7da873f4e9609872.html` → 200 (OPS-03 regression pass)
  - `/does-not-exist` → 404 with "Back to the hub" link in body (custom 404 serving)
  - `/.nojekyll` → 200 (hidden file survived artifact)
- Old-policy URL per 01-01 DEFERRED disposition: `https://persano.github.io/GeoHist_Trivia_Privacy_Policy.html` → 200 (old files retained, as recorded); misspelled variant `GeoHist_Trivivia_…` → 404 (never existed — objective typo, no action)

## Task Commits
1. **Task 1: CI pipeline slice** - `11d00da` (feat) — deploy.yml, package.json, .htmlvalidate.json
2. **Task 2: Checkpoint — Pages source switch** - [owner action; `gh api … --jq .build_type` → "workflow" verified before push]
3. **Task 3: Go-live push + smoke checks** - `6a48ca6` (chore) + [CI run 33587621659 green; smoke 6/6 exit 0]

**Plan metadata:** docs commit (see final commit) (docs: complete deploy pipeline and go-live plan)

## Files Created/Modified
- Created: `.github/workflows/deploy.yml`, `package.json`, `.htmlvalidate.json`, `scripts/smoke-check.sh`
- Modified: none

## Decisions Made
- **npm install fallback (pre-planned, Task 1 step 4):** local npm CLI is proxy-broken (research-documented E404 false negatives), so no package-lock.json was produced; validate job uses `npm install` with no `cache: npm` input. Restore `npm ci` + cache once a lockfile lands (deferred item).
- **Push handoff:** executor harness denies `git push`; orchestrator executed the single controlled push (`0e99613..6a48ca6`, exit 0). Documented as a permission gate (normal flow), not a failure.
- **Old-policy retention carried forward:** old root policy files stay live until the Play Console privacy-URL field is updated to `/geohist/privacy.html`, then deleted (Phase 5 trace).

## Deviations from Plan
- **[Pre-planned fallback] npm install instead of npm ci + cache: npm** — plan Task 1 step 4 explicitly prescribed this branch when local npm cannot produce a lockfile. Not a surprise deviation.
- **[Permission gate — normal flow] `git push origin main` executed by orchestrator**, not the executor agent. CI watch, smoke checks, and all bookkeeping done by executor.
- Plan otherwise executed exactly as written. CI passed first try — no markup fixes needed, no gate weakening.

## Issues Encountered
- None blocking. First workflow run passed both jobs on the first attempt.

## User Setup Required
- **Play Console follow-up (BEFORE Play submission):** update the privacy-policy URL field from `https://persano.github.io/GeoHist_Trivia_Privacy_Policy.html` to `https://persano.github.io/geohist/privacy.html`. After confirmed in Console, delete the three superseded root files (`GeoHist_Trivia_Privacy_Policy.html`, `.md`, `.pdf`) — Phase 5 trace item.

## Next Phase Readiness
- Deploy pipeline proven end-to-end: any later phase's push auto-validates + deploys
- Smoke-check script ready for reuse before Play submission
- Phase 2 (hub expansion, i18n) can build on live site; Phase 4 Firebase prerequisites (Web App registration, authorized domain, Anonymous auth, Firestore) remain owner actions before that phase

---
*Phase: 01-foundation-deploy-pipeline-skeleton-privacy-policy*
*Completed: 2026-09-02*
