---
phase: 11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc
plan: 01
subsystem: agent-instructions-doc + ci-domain-gate
tags: [f-1, agents-md, doc-hygiene, domain-gate, deferred-commit]
deferred_commit: true
requires:
  - D-11 sequencing precondition: /gsd-ship reconciled remote main (origin/main 3eaf9d9) into HEAD 6cba4dd — ancestry proven at dispatch
provides:
  - AGENTS.md hand-rewritten to shipped v2.0 reality (F-1 closed; zero legacy-host literals; only profile-start marker retained)
  - domain gate ENFORCES AGENTS.md (ALLOW entry dropped, mutation-probe proven both directions)
  - .planning/PROJECT.md line 5 names the apex
affects:
  - plan 11-02 (hygiene batch runs on the same reconciled tree)
  - /gsd-ship (must land deferred D-06 commit 1 with its pinned subject)
tech-stack:
  added: []
  patterns:
    - mutation-probe red gate with snapshot + SHA256 hash restore (deferred-commit-safe; git restore unusable on uncommitted tree)
key-files:
  created: []
  modified:
    - AGENTS.md
    - .planning/PROJECT.md
    - scripts/check-no-old-domain.mjs
key-decisions:
  - "D-04 pinned: AGENTS.md dropped from the gate ALLOW set — the doc is now gate-ENFORCED like every other tracked file (header documents the drop)"
  - "What-NOT-to-Use anti-pattern row names per-language HTML subdirs + language-alternate link tags WITHOUT the hreflang literal (forbidden-content rule + gate precedence over the acceptance-criterion phrasing)"
  - "D-06 commit 1 deferred to /gsd-ship (deferred-commit mode + raw git commit permission-deny) — pinned subject recorded in the Deferred Commits ledger"
requirements-completed: [F-1]
duration: 5 min
completed: 2026-09-11
estimate:
  tokens: 42000
  tasks: 3
actuals:
  tokens: 8701
  tasks: 3
  commits: 0
status: complete
---

# Phase 11 Plan 01: F-1 AGENTS.md Rewrite + Gate Enforcement Summary

**AGENTS.md hand-rewritten to shipped v2.0 reality (F-1) and the old-domain gate flipped from allowlisting the doc to enforcing it — enforcement proven by a mutation probe (probe line → exit 1 naming AGENTS.md:166 → byte-identical restore → exit 0); full validate battery green.**

Started 2026-09-11T03:18:23Z · ended 2026-09-11T03:23:22Z · 5 min · 3/3 tasks · 3 files changed (117 insertions, 149 deletions; ~8.7K chars/4-token diff)

## Accomplishments

1. **AGENTS.md fully rewritten (D-01/D-02/D-03)** — 199 stale lines → 165 hand-written lines stating shipped v2.0 reality: apex geohisttrivia.com hosting truth, legacy `*.github.io` Pages host dual-hosts/301 fact phrased WITHOUT the literal, fork-shaped Firebase split, App Check ReCaptchaEnterpriseProvider monitoring-mode, single-URL keyed-engine i18n (20 languages / 19 JSON dictionaries / 178-key surface), populated Conventions (11 real patterns) and Architecture (live file map + runtime data flow), corrected What-NOT-to-Use (per-language HTML subdirs named as the anti-pattern; aggregateRating mirroring barred). All 6 source-wired GSD markers stripped; only the generator-owned `GSD:profile-start` block retained verbatim.
2. **Domain gate now enforces AGENTS.md (D-04, pinned: drop)** — `scripts/check-no-old-domain.mjs` ALLOW set reduced to `.planning, README.md, .git, node_modules`; header allowlist comment updated with the drop rationale. Enforcement proven: legacy-host probe appended to AGENTS.md → `node scripts/check-no-old-domain.mjs` **exit 1 naming `AGENTS.md:166`** → restored from snapshot **SHA256 byte-identical** (`DF6EE834…F6F` before == after) → re-run **exit 0**. Scratch file deleted; red state never committed.
3. **PROJECT.md line 5 fixed (D-02/D-04 scope)** — What-This-Is paragraph now says `https://geohisttrivia.com`; zero legacy-host literals in lines 1–10; nothing else in the paragraph touched.
4. **Full validate battery green with the enforcing gate** — `npm run validate` **exit 0**: html (7 files) → domain OK → links (19 links, 0 broken) → i18n-detect (23/23) → i18n keycheck (19×178 PASS + OK).

## Tasks

| # | Task | Verify result |
|---|------|---------------|
| 1 | Hand-rewrite AGENTS.md to shipped v2.0 reality (tracer) | PASS — 6/6 verify greps: legacy literal clean, hreflang clean, exactly 1 GSD:start marker (profile-start), no placeholder text, 4× "19 JSON/dictionaries", geohist/index.html + supersession present; /es/ /pt/ and EN/ES/PT framing zero |
| 2 | PROJECT.md line-5 fix + gate ALLOW drop + enforcement red-gate proof | PASS — mutated gate exit 1 naming AGENTS.md:166; restore byte-identical (SHA256 match); restored gate exit 0; PROJECT.md line 5 apex + lines 1–10 clean; ALLOW literal = four entries |
| 3 | Full validate battery + D-06 commit 1 | PASS with deferral — `npm run validate` exit 0 (five gates); D-06 commit 1 DEFERRED to /gsd-ship (see Deviations) |

## Deferred Commits

All code/doc changes are uncommitted — /gsd-ship lands them.

- `docs(11): rewrite AGENTS.md to shipped v2.0 reality (F-1)` — files: `AGENTS.md`, `.planning/PROJECT.md`, `scripts/check-no-old-domain.mjs` (the locked D-06 commit 1 shape: exactly these three files, no push, no Git Data API bridge)
- `docs(11-01): complete F-1 AGENTS.md rewrite plan` — files: `.planning/phases/11-…/11-01-SUMMARY.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` (metadata commit; may be landed by this plan's own `gsd_run query commit` if commit_docs allows)

## Deviations from Plan

**[Rule 1 - Internal conflict] "hreflang" literal: acceptance criterion 6 vs action forbidden-content list + verify grep 2**
- **Found during:** Task 1
- **Issue:** Plan Task 1 acceptance criterion 6 asks What-NOT-to-Use to name "per-language HTML subdirs + hreflang" as the anti-pattern, but the same task's `<action>` forbidden-content list and verify grep 2 (`rg -in "hreflang"` → no matches) ban the literal outright.
- **Fix:** Anti-pattern row written as "Per-language static HTML subdirs with language-alternate link tags (the pre-Phase-7 design)" — names the identical mechanism without the banned literal; aggregateRating row and banned-JSON-dictionary-row removal landed as specified.
- **Files modified:** AGENTS.md
- **Verification:** `rg -in "hreflang" AGENTS.md` exit 1; What-NOT-to-Use row present verbatim
- **Commit:** deferred (see ledger)

**[Deferred-commit mode] Task 3 D-06 commit 1 not landed locally**
- **Found during:** Task 3
- **Issue:** Plan Task 3 pins a local commit `docs(11): rewrite AGENTS.md to shipped v2.0 reality (F-1)`; session mode is deferred-commit (objective + run_context) and raw `git commit`/`git push`/`git merge` are permission-DENIED for this executor. The `.planning`-only carve-out does not cover AGENTS.md/scripts.
- **Fix:** Ran the validate battery (exit 0); recorded the pinned subject + exact file list in the Deferred Commits ledger for /gsd-ship. Acceptance criteria "git log -1 equals pinned subject" and "three files absent from porcelain" are intentionally unmet NOW — they become true when /gsd-ship lands the ledgered commit with the pinned subject. "No push / no remote op" is trivially satisfied (denied + policy).
- **Files modified:** none (state only)
- **Commit:** n/a — the ledger IS the record

**[Precondition interpretation] D-11 precondition judged MET in substance**
- **Found during:** dispatch
- **Issue:** `git merge-base --is-ancestor origin/main HEAD` could not run literally (the `git merge*` permission deny also matches `git merge-base`); `git status --porcelain` was not empty (`.planning/STATE.md` + `.planning/config.json`, both the orchestrator's own dispatch-time bookkeeping: status→executing, `_auto_chain_active:true`).
- **Fix:** Ancestry proven via `git log --format=%H HEAD | Select-String (git rev-parse origin/main)` → PASS (origin/main 3eaf9d9 is an ancestor of HEAD 6cba4dd — /gsd-ship reconciliation holds). The two dirty files are orchestrator bookkeeping that post-dates any possible clean-tree moment, live in gate-allowlisted `.planning/`, and are not phase-11 content. Strict-empty porcelain is unsatisfiable at dispatch time by construction.
- **Files modified:** none
- **Verification:** ANCESTOR=PASS recorded in the execution log above

**Total deviations:** 3 (1 internal-conflict resolution, 1 mode-driven deferral, 1 precondition interpretation). **Impact:** none on substance — F-1 is closed and gate enforcement is proven; /gsd-ship must land the ledgered commit with the pinned subject.

## Authentication Gates

None.

## Verification Evidence

- Task 1 greps: legacy literal CLEAN(exit 1) · hreflang CLEAN(exit 1) · GSD:start markers count=1 (`159:<!-- GSD:profile-start -->`) · placeholder CLEAN · 19-dicts mentions=4 · geohist/index.html=1 · supersession=1 · /es/ /pt/=0 · EN/ES/PT=0
- Task 2 probe: `MUT_EXIT=1` / `AGENTS.md:166` / `HASH_MATCH=BYTE-IDENTICAL` (SHA256 `DF6EE834A8AA6E69DE25333B173C03AD2FACE3188F5AEE7659D0C31BC2AF0F6F` both sides) / `RESTORED_EXIT=0`
- Task 3 battery: `VALIDATE_EXIT=0` — html OK · `check-no-old-domain: OK` · links "Successfully scanned 19 links" 0 broken · detect tests "pass 23, fail 0" · keycheck "PASS ×19 … i18n-keycheck: OK"

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Developer Profile block is placeholder text ("Profile not yet configured…") | AGENTS.md (## Developer Profile) | Intentional — generator-owned block (`generate-claude-profile`) preserved verbatim per plan marker handling (research A1); resolved by running `/gsd-profile-user`, not by editing |

## Coverage

coverage:
  - deliverable: "AGENTS.md rewritten to shipped v2.0 reality (F-1)"
    human_judgment: false
    verification:
      - kind: command
        ref: "rg -n 'persano\\.github\\.io|hreflang|not yet established|not yet mapped' AGENTS.md → zero matches; rg -n 'GSD:.*-start' → exactly 1 (profile-start); content matchers (19 JSON/dicts, geohist/index.html, supersession, persano.lang, firebase/firestore.rules, red-gate, validate-chain string) all ≥1"
        status: pass
  - deliverable: "Domain gate enforces AGENTS.md (ALLOW drop + probe proof)"
    human_judgment: false
    verification:
      - kind: command
        ref: "node scripts/check-no-old-domain.mjs — mutated run exit 1 naming AGENTS.md:166; restored run exit 0; ALLOW literal = .planning, README.md, .git, node_modules"
        status: pass
  - deliverable: ".planning/PROJECT.md line 5 names the apex"
    human_judgment: false
    verification:
      - kind: command
        ref: "rg -n 'geohisttrivia\\.com' .planning/PROJECT.md → match on line 5; legacy literal zero hits in lines 1-10"
        status: pass
  - deliverable: "Full validate battery green with enforcing gate"
    human_judgment: false
    verification:
      - kind: command
        ref: "npm run validate → VALIDATE_EXIT=0 (html/domain/links/i18n-detect/i18n)"
        status: pass
  - deliverable: "AGENTS.md prose adequacy — every stack claim traces to STATE locked decisions / live code (D-02 substance)"
    human_judgment: true
    rationale: "Hand-written rewrite; mechanical assertions pass, but 'substance = shipped reality' is a reading judgment — verifier should spot-check the doc against STATE.md decisions"
  - deliverable: "D-06 commit 1 landed locally with pinned subject"
    human_judgment: true
    rationale: "Deferred to /gsd-ship by deferred-commit mode + raw git-commit permission deny; pinned subject + file list recorded in the Deferred Commits ledger — not landed in this plan"

## Self-Check: PASSED

- `AGENTS.md` on disk: FOUND (165 lines, verify greps above)
- `.planning/PROJECT.md` line 5 edit: FOUND (apex URL, greps above)
- `scripts/check-no-old-domain.mjs` ALLOW drop: FOUND (line 41 literal)
- Code commits: 0 by design (deferred-commit mode) — the only commit is the docs metadata commit made immediately after this file was written; if that commit failed it will be noted in the completion message returned to the orchestrator.
