---
phase: 11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc
plan: 03
subsystem: ci-gates
tags: [star-uniqueness, fail-closed, red-gate-proof, i18n-keycheck, tier1-invariant, p-10-3]
requires:
  - 11-02-PLAN (doc-hygiene + UAT records — prerequisite wave)
  - Phase 10 tier1 invariant (10-VERIFICATION truth: 0 U+2605 in any dictionary value, exactly 1 proof-row-star SVG, 0 star literals in markup — verified but unenforced)
  - Phase 6 red-gate-proof template (evidence standard for gate changes)
provides:
  - Fail-closed star-uniqueness assertion in scripts/i18n-keycheck.mjs (missing OR duplicated star SVG = red; any text star U+2605 in any dictionary value or markup = red)
  - All-values star sweep (pinned Option B, research OQ2) — a future surface wanting a text star must route through a visible gate decision
  - red-gate-proof.md — 3 red cycles + flip-compat green cycle, sha256-snapshot restores, final green battery
  - Gate rides the existing npm run validate chain — zero workflow edits, zero new dependencies (D-10)
affects:
  - /gsd-ship (lands deferred D-06 commit 4: gate script + proof record)
  - Owner Tier-1 flip (10-RUNBOOK §2) — proven flip-compatible, cannot red the gate
tech-stack:
  added: []
  patterns:
    - Fail-closed CI gate extension beside CJK-punct check (Phase 7 precedent) — zero-dep node built-ins
    - Negative-lookahead class-token count `proof-row-star(?![\w-])` — renamed probe classes cannot satisfy the exactly-1 expectation
    - Escape-form code-point constant (STAR = '\u2605') — never a raw star char in gate source
    - sha256 snapshot-copy restore for red-gate mutations under deferred-commit state (Phase 10 precedent)
key-files:
  created:
    - .planning/phases/11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc/red-gate-proof.md
    - .planning/phases/11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc/11-03-SUMMARY.md
  modified:
    - scripts/i18n-keycheck.mjs
    - .planning/phases/11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc/11-02-SUMMARY.md (supersession correction only)
  transient:
    - geohist/index.html (3 mutations, byte-identical restores — hash DE714C28…F1 verified after every cycle)
    - js/i18n/es.json (1 mutation, byte-identical restore — hash CBAB14D2…9D verified)
key-decisions:
  - "Scope pinned Option B (research OQ2): star sweep covers ALL dictionary values, not only geohist.tier1.* — stronger than D-10 minimum wording, matches the invariant 10-VERIFICATION actually verified; TIER1_NS kept for FAIL-message context"
  - "Markup check aggregates before the failed-exit so dictionary and markup failures report together in one run; negative lookahead is load-bearing (proven by cycle a reporting 0, not 1, on a renamed probe)"
  - "Restore method = sha256 snapshot-copy per the plan precondition fallback (deferred-commit state active) — both mutated files were clean in git status, so git restore would also have been safe; snapshot-copy is the Phase 10 superset"
requirements-completed: [P-10-3]
coverage:
  - item: "Star-uniqueness gate live and fail-closed (header rule 3, TIER1_NS/STAR constants, all-values sweep, markup check)"
    verified_by: machine
    rationale: "node scripts/i18n-keycheck.mjs PASS ×19 at 178 keys + OK exit 0 pristine; rg 'u2605|2605' → 4 matches (constant + message + header); rg '★' → 0 matches in source; lookahead regex present at the markup-check site"
  - item: "Missing direction proven red (cycle a)"
    verified_by: machine
    rationale: "renamed class probe → gate exit 1 with 'star uniqueness: 0 proof-row-star SVG(s) (expected exactly 1)' — lookahead rejected the renamed token; restore hash-identical; re-run OK exit 0"
  - item: "Duplicated-in-dictionary direction proven red (cycle b)"
    verified_by: machine
    rationale: "★ appended to es.json geohist.tier1.suffix → gate exit 1 naming file + key (es.json outside ja/zh punct scope — star check provably the firing gate); restore hash-identical; re-run OK exit 0"
  - item: "Duplicated-in-markup direction proven red (cycle c)"
    verified_by: machine
    rationale: "second star SVG → gate exit 1 with '2 proof-row-star SVG(s) (expected exactly 1)'; restore hash-identical; re-run OK exit 0"
  - item: "Flip-compat (owner flip cannot red the gate)"
    verified_by: machine
    rationale: "hidden removed + 0.0→4.5 (10-RUNBOOK §2 flip simulation, SVG untouched) → i18n-keycheck: OK exit 0; restore hash-identical"
  - item: "Gate rides the existing validate chain (D-10)"
    verified_by: machine
    rationale: "npm run validate → exit 0: html OK · domain OK · links 19 scanned · detect pass 23/fail 0 · i18n (extended keycheck) PASS ×19 + OK; zero .github/workflows edits; package.json untouched"
  - item: "D-06 commit 4 landed locally with pinned subject"
    verified_by: deferred_ledger
    rationale: "Deferred-commit mode (agent definition + 11-01/11-02 precedent) overrides the plan's local-commit step; subject 'feat(11): star-uniqueness fail-closed gate in i18n-keycheck (P-10-3)' + exact file list recorded in the Deferred Commits ledger — /gsd-ship lands it"
estimate:
  tokens: 26000
actuals:
  tokens: 2600
  tasks: 2
  commits: 0
duration: ~12 min
completed: 2026-09-11
status: complete
deferred_commit: true
---

# Phase 11 Plan 03: Star-Uniqueness Fail-Closed Keycheck Gate (P-10-3) Summary

scripts/i18n-keycheck.mjs now enforces the Tier-1 star invariant fail-closed — exactly ONE `proof-row-star` SVG in the markup, zero U+2605 text stars in any of the 19 dictionaries' values or in the markup, missing or duplicated = exit 1 — proven red in three observed cycles (missing SVG / star in es.json value / duplicate SVG) plus a flip-compat green cycle, with sha256-verified byte-identical restores and a green full validate battery; the gate rides the existing `npm run validate` chain with zero workflow edits and zero new dependencies.

## Accomplishments

- **Gate extension (zero-dep, node built-ins only):**
  - Header comment rule 3 — star-uniqueness (Phase 11, P-10-3 / ADR-550 D4), including the flip-compat statement (10-RUNBOOK §2 flip never touches the SVG) and the interplay note (U+2605 not in CJK_PUNCT — real coverage, not a duplicate gate).
  - Constants beside the PUNCT block: `TIER1_NS = 'geohist.tier1.'` (documents the invariant's origin; FAIL-message context) and `STAR = '\u2605'` (escape form — zero raw star characters in gate source, grep-verified).
  - Dictionary sweep inside the existing value loop, after the CJK-punct check: any value containing U+2605 → FAIL naming file + key, message "contains a literal star (U+2605) — the Tier-1 star is the row's single inline SVG" with `[geohist.tier1.* — the Tier-1 rating row]` context appended for tier1 keys. Scope: ALL values (pinned Option B).
  - Markup check after the dictionary loop, before the failed-exit: `proof-row-star(?![\w-])` count (negative lookahead REQUIRED — proven by cycle a) must equal 1; `split(STAR).length - 1` star literals must equal 0; either violated → one FAIL line prefixed "star uniqueness:" reporting both counts; existing failed→exit 1 flow propagates (no new exit path).
- **Red-gate proof (red-gate-proof.md, Phase 6 template):** 3 red cycles + 1 flip-compat green cycle, each with mutation / command / verbatim observed output / exit code; restore verification notes (snapshot-copy + hashes); post-revert cleanliness; final green battery; flip-compat note restated.
- **Full battery green:** `node scripts/i18n-keycheck.mjs` PASS ×19 @ 178 keys + OK, exit 0; `npm run validate` exit 0 (html/domain/links/detect/i18n — the extended gate now chained as validate:i18n).
- **Transient mutations restored byte-identical:** `geohist/index.html` and `js/i18n/es.json` absent from `git status --porcelain` after all cycles (hashes DE714C28…F1 / CBAB14D2…9D verified before, after, and between cycles).

## Task Commits (deferred ledger — code changes uncommitted)

| Task | Name | Planned Commit | Files |
| ---- | ---- | -------------- | ----- |
| 1 | Star-uniqueness gate + missing-direction red-gate cycle (tracer, D-10) | DEFERRED → rides commit 4 | scripts/i18n-keycheck.mjs (gate), geohist/index.html (transient, restored) |
| 2 | Duplicate-direction cycles + red-gate-proof.md + full battery + D-06 commit 4 | `feat(11): star-uniqueness fail-closed gate in i18n-keycheck (P-10-3)` | scripts/i18n-keycheck.mjs, .planning/phases/11-…-batc/red-gate-proof.md |

## TDD Gate Compliance

Task 1 carries `tdd="true"`; config `tdd_mode` is false and this gate has no test framework — the failing/passing runs ARE the test runs, executed for real through the real gate: RED = cycle (a) observed FAIL exit 1 (`0 proof-row-star SVG(s)`), GREEN = pristine run PASS ×19 + OK exit 0 recorded before and after. Deferred-commit mode converts the test→feat commit sequence into ledger entries (the `feat(11)` subject above); no separate test file exists to commit.

## Files

**Created:** red-gate-proof.md, 11-03-SUMMARY.md (this file).
**Modified:** scripts/i18n-keycheck.mjs (the P-10-3 extension); 11-02-SUMMARY.md (supersession corrections only, originals verbatim).
**Transient (restored byte-identical, not part of any diff):** geohist/index.html, js/i18n/es.json.

## Decisions Made

- **Option B scope pinned (research OQ2):** the star sweep covers ALL dictionary values, not only `geohist.tier1.*` — stronger than D-10's minimum wording, matches the invariant 10-VERIFICATION actually verified, and keeps ADR-550 D4's fail-closed spirit: a future surface wanting a text star must route through a visible gate decision. TIER1_NS still declared and used for tier1-scoped FAIL context.
- **Markup check aggregates before the failed-exit:** dictionary failures and markup failures report together in one run (both use the single failed→exit 1 flow; no new exit path).
- **Snapshot-copy restore over git restore:** the plan precondition's fallback clause applies (deferred-commit state active on the tree from 11-01/11-02) — sha256 snapshot copies with hash verification after every cycle; both mutated files were clean in git status, so git restore would also have been safe; snapshot-copy is the Phase 10 superset.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Doc bug] 11-02-SUMMARY overclaimed the star gate existed**
- **Found during:** Task 1 read_first (ground-truth check before assuming what is missing)
- **Issue:** 11-02-SUMMARY lines 82/100/127 state the keycheck already carried "fail-closed star-uniqueness per D-10" — false at that date: the on-disk gate had no star check (10-VERIFICATION:24-26 and 11-RESEARCH both confirm enforcement was missing; a future agent trusting that note could skip re-verification of a Tier-1 edit)
- **Fix:** dated bracketed supersession notes appended at both claim sites (originals verbatim, per the repo's supersession-note policy); 11-03 implements the full gate and records the proof
- **Files modified:** 11-02-SUMMARY.md
- **Commit:** DEFERRED (ledger entry below)

### Deviations

2. **[Deferred-commit mode] D-06 commit 4 not landed locally** — the plan's Task 2 step 5 (stage gate script + proof record, commit `feat(11): star-uniqueness fail-closed gate in i18n-keycheck (P-10-3)`, local only) is overridden by the agent definition's deferred-commit mode + the orchestrator's objective (11-01/11-02 precedent). Planned subject + exact file list in the Deferred Commits ledger; /gsd-ship lands it as the phase's 4th atomic commit, keeping D-06's three F-item commits intact (research OQ5).

## Issues

None. No auth gates, no failed installs, no out-of-scope discoveries.

## Verification Evidence

- PRISTINE (baseline pre-extension): PASS ×19 @ 178 keys + OK, exit 0
- Gate source: `rg -n "u2605|2605" scripts/i18n-keycheck.mjs` → 4 matches (header ×2, constant, message); `rg -n "★"` → 0 matches (exit 1 = clean)
- Pristine post-extension: PASS ×19 + OK, exit 0
- Cycle a: FAIL `i18n-keycheck: FAIL — star uniqueness: 0 proof-row-star SVG(s) (expected exactly 1), 0 star literal(s) in markup (expected 0)` + DRIFTED line, exit 1; restore hash DE714C284B1996FAE6DF00FA6C24D2126A0B56BFFDABC54D4BA3D5C6E0E232F1 both sides; re-run OK exit 0
- Cycle b: FAIL `i18n-keycheck: FAIL — es.json: "geohist.tier1.suffix" contains a literal star (U+2605) — the Tier-1 star is the row's single inline SVG [geohist.tier1.* — the Tier-1 rating row]`, exit 1; restore hash CBAB14D22F8EF9DA59B2CE8929FF7D6D1139E6C085365D69C73728D34EBD119D; re-run OK exit 0
- Cycle c: FAIL `…2 proof-row-star SVG(s) (expected exactly 1)…`, exit 1; restore hash DE714C28…F1; re-run OK exit 0
- Flip-compat: hidden removed + 0.0→4.5 → `i18n-keycheck: OK` exit 0; restore hash DE714C28…F1
- Final battery: `npm run validate` → exit 0 (html OK · `check-no-old-domain: OK` · links "Successfully scanned 19 links" · detect "pass 23, fail 0" · i18n PASS ×19 + OK)
- Cleanliness: `git status --porcelain` shows geohist/index.html and js/i18n/es.json ABSENT (byte-identical); scripts/i18n-keycheck.mjs modified = the deferred gate change itself; all other entries are pre-existing 11-01/11-02 deferred work, untouched

## Known Stubs

None. The gate enforces a real invariant on live artifacts; no placeholder data flows anywhere (the 0.0 self-flagging span is D-04 by design, unchanged by this plan, and tracked in 10-01-SUMMARY's stub table).

## Next Phase Readiness

- **Phase 11 is fully executed** — all 3 plans complete (11-01 F-1 rewrite, 11-02 doc-hygiene + UAT records, 11-03 P-10-3 gate). The last v2.0 audit nit (P-10-3 unwired enforcement, 10-VERIFICATION fail-closed disposition) is permanently closed.
- Next workflow steps: `/gsd-ship` lands the four deferred D-06 commits (1 from 11-01; 2+3 from 11-02; 4 from this plan) then `/gsd-complete-milestone v2.0`.
- Deferred-by-design owner items remain parked in their runbooks (FIRE-10 enforcement flip, Tier-1 rating flip, GSC 180-day watch) — unchanged by this plan; the new gate protects the Tier-1 flip rather than performing it.

## Deferred Commits

All code changes uncommitted — will be committed by /gsd-ship.

- `feat(11): star-uniqueness fail-closed gate in i18n-keycheck (P-10-3)` — files: scripts/i18n-keycheck.mjs, .planning/phases/11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc/red-gate-proof.md
- `docs(11): supersede 11-02 star-gate claim (11-03 correction)` — files: .planning/phases/11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc/11-02-SUMMARY.md

## Self-Check: PASSED

- red-gate-proof.md FOUND; `rg -c "Exit code: \*\*1\*\*"` → 3 (cycles a/b/c); Final-green-battery/Restore-verification/Flip-compat sections present.
- scripts/i18n-keycheck.mjs FOUND with TIER1_NS/STAR (5 matches) and the lookahead regex (4 proof-row-star matches); zero raw ★ chars in source.
- Final `node scripts/i18n-keycheck.mjs` → `i18n-keycheck: OK`, exit 0; `npm run validate` → exit 0.
- geohist/index.html + js/i18n/es.json present on disk and ABSENT from git status (byte-identical restores, hashes verified per cycle).
- Code commits: 0 by design (deferred-commit mode); the docs metadata commit follows this file.
