---
phase: 14-launch-kit
plan: 02
subsystem: launch-kit-docs
tags: [lkit-01, lkit-02, lkit-04, runbook, supersession, uat-scaffold, records-scaffold]
requires:
  - "14-01 artifacts: scripts/check-play-link.mjs + validate:play-links chain slot + red-gate-proof.md closing hashes"
  - "Phase 13 root-landing layout (verified file:line citations)"
provides:
  - "14-RUNBOOK.md — owner launch-day runbook, pinned 4-step flip order, 8-surface swap-ready inventory (LKIT-01, LKIT-02)"
  - "10-RUNBOOK.md supersession — 5 dated bracketed appends, originals verbatim (LKIT-04b)"
  - "14-UAT.md — PRE-01..06 locally-runnable battery scaffold (executes at ship preflight)"
  - "14-RECORDS.md — R-01..06 post-launch pending-by-design scaffold (executes at owner launch time)"
affects:
  - "/gsd-ship 14 — UAT rows execute at ship preflight; code pair (14-01) commits here"
  - "Owner launch day — 14-RUNBOOK §3 steps 1-3 fire; R-01..R-06 record outcomes"
tech-stack:
  added: []
  patterns: ["supersession-by-dated-bracketed-append (AGENTS.md policy)", "12/13 reframe split: UAT=locally-runnable / RECORDS=post-launch pending"]
key-files:
  created:
    - .planning/phases/14-launch-kit/14-RUNBOOK.md
    - .planning/phases/14-launch-kit/14-UAT.md
    - .planning/phases/14-launch-kit/14-RECORDS.md
  modified:
    - .planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md
decisions:
  - "Pinned order enforced in prose and structure: privacy-URL field (compliance first) → Play-link 200 verify → website field → gated Tier-1 flip; step 4 explicitly may be a later day (EA-09)"
  - "Every launch-day surface carries an explicit action or an explicit 'Zero action — verify only' marker (EA-08); inventory rows 1-8 numbered, no empty cells (EA-07)"
  - "ZERO code change on launch day declared in §2 (EA-10) — all 8 surfaces swap-ready per 14-01/Phase-13 tree"
  - "GA4 section is note-only with expect/verify phrasing (EA-11); §5 is a verification step, not an edit step — offers already ships price 0 + USD on index.html line 54"
  - "10-RUNBOOK supersession via PowerShell raw I/O splices (mixed-line-ending-safe), content anchors not line numbers, all 5 anchors unique; line-84 one-liner byte-untouched, correction inserted as a new line after the closing fence"
  - "14-02 is all-docs → docs commits ARE made per execution rules (unlike 14-01's deferred code); the 14-01 code pair stays uncommitted for /gsd-ship"
metrics:
  duration: 38min
  completed: 2026-09-15
  tasks: 3
  files: 4
status: complete
deferred_commit: true
actuals:
  tokens: 31000
  tasks: 3
  commits: 3
---

# Phase 14 Plan 02: Launch Kit Docs Summary

**One-liner:** Phase 14 launch kit authored — owner runbook with the pinned 4-step Play-launch flip order and an 8-surface swap-ready inventory, 5 verbatim-preserving dated corrections in 10-RUNBOOK.md (paths now root), and the UAT/RECORDS scaffolds in the 12/13 reframe shape (locally-runnable PRE battery vs pending post-launch records).

## What Was Built

### Task 1 — 14-RUNBOOK.md (LKIT-01, LKIT-02, LKIT-04a, LKIT-04c)

- Header block in the 13-RUNBOOK shape: Audience (Santiago, console/browser actions only), public-artifact notice, When-to-execute (steps 1–3 launch day; step 4 gate-driven, may be a later day; nothing is a deploy precondition), status legend.
- §1 prerequisites: 4-row table incl. the 6-stage validate chain (with `validate:play-links`) and the **expectation-guard row** — the package URL 404 pre-launch is the DESIGNED state (D-22), never an issue.
- §2 surface inventory: 8 numbered rows, every file:line re-verified against the working tree at write time (Play URL lines 53/83/87; proof-row div 86, score span 92, og:url 12, og:image 13, JSON-LD 36–56) — rows 4, 5, 6, 8 carry explicit `Zero action` markers; EA-10 sentence after the table: zero code change on launch day.
- §3 pinned sequence: STEP 1 privacy-URL field (EA-06 owner-verify caveat + rejection-rollback framing) → STEP 2 Play-link 200 verify (Tier-1 gate input #1) → STEP 3 website field → STEP 4 Tier-1 flip, gated, no-minimum-floor language, two edits against root `index.html` (lines 86/92), cross-referencing 10-RUNBOOK §1–§4 instead of duplicating.
- §4 GA4 note-only (4 research-Q3 bullets, expect/verify phrasing) + the historical `/geohist/` page-param note.
- §5 JSON-LD refresh-check: verification-not-edit framing; Rich Results Test on `https://geohisttrivia.com/` (not the stale path); the repointed zero-dependency one-liner written with `index.html` as its readFileSync path (tested green this session: `OK: JSON-LD parses; no aggregateRating key; type=SoftwareApplication,MobileApplication`, exit 0).
- §6 do-NOT-do guard: no aggregateRating ever (policy quote), no hl/gl params (PITFALLS row 214 + gate), no Change-of-Address touch (180-day window until ~2027-03), no calendar-based flip.

### Task 2 — 10-RUNBOOK.md supersession (LKIT-04b)

Exactly 5 dated bracketed appends, originals verbatim, via PowerShell raw I/O (`ReadAllText` → `IndexOf`/`Insert` splices → `WriteAllText` UTF-8 no-BOM) — mixed-line-endings-safe, content anchors (each verified unique), zero other bytes touched:

| Spot | Anchor (content) | Correction |
|------|------------------|------------|
| 1 | audience sentence "plus browser tools you already use." | landing now lives at root `index.html` (Phase 13 home migration) → 14-RUNBOOK §3 step 4 |
| 2 | `## §2 · The flip — exactly two edits in …` | now `index.html` at repo root → 14-RUNBOOK §3 step 4 |
| 3 | §3 step 1 "test `https://geohisttrivia.com/geohist/`." | test `https://geohisttrivia.com/`; `/geohist/` is the meta-refresh-0 stub |
| 4 | after the one-liner closing fence (new line; command line byte-untouched) | copy the command with path `index.html` |
| 5 | §6 "Mirrors the in-file HTML comment …" | comment now in root `index.html` (lines 20–35) |

Verified: `corrected Phase 14` count = 5; `geohist/index.html` count = 4 (all originals intact, corrections never repeat the stale path); `git diff` bounded to exactly the 5 declared hunks; line-84 one-liner byte-unchanged (insertion shows as an added line after the fence).

### Task 3 — 14-UAT.md + 14-RECORDS.md scaffolds

- **14-UAT.md** (PRE-01..06, all `status: pending — executes at ship preflight`, zero fabricated outcomes): PRE-01 full validate chain (6 stages incl. play-links gate + keycheck ×19); PRE-02 standalone `check-play-link.mjs`; PRE-03 sha256 recomputation of the 14-01 closing hashes (script `25d033fb…`, package.json `095a9ca…`, index.html `425f1fde…`); PRE-04 the repointed JSON-LD one-liner (expected OK line); PRE-05 10-RUNBOOK supersession counts (5 corrections / 4 originals); PRE-06 14-RUNBOOK content checks (6 §-headings, 8 rows, pinned order, secrets 0, legacy-host 0).
- **14-RECORDS.md** (R-01..06, all `status: pending — executes post-launch at owner time`, do-not-fabricate scaffold notice, mechanical predicate): R-01 privacy-URL field outcome (§3 step 1); R-02 Play-link liveness date (§3 step 2); R-03 website field (§3 step 3); R-04 Rich Results post-launch (§5); R-05 GA4 Realtime soft check (§4); R-06 gated Tier-1 flip record (§3 step 4). Every row names its 14-RUNBOOK §-step; zero pre-filled `result:` outcomes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing-critical] PRE-06's check line self-hits the secrets scan**
- **Found during:** Task 3 verification
- **Issue:** PRE-06's check text quoted the secrets-scan regex verbatim (`api[_-]?key|password|bearer|AKIA|ghp_|AIza`), which made 14-UAT.md fail its own Task-3 acceptance criterion ("secrets scan over both files prints 0 matches") — a self-referential trap.
- **Fix:** PRE-06 now describes the scan as "the credential-shape regex from the plan's Task-3 acceptance criteria, case-insensitive, over the RUNBOOK" without spelling the pattern bytes. Criterion now green (0 matches across all three new docs).
- **Files modified:** .planning/phases/14-launch-kit/14-UAT.md

**2. [Execution-mode note] Per-task docs commits made (execution-rule override)**
- The plan's success_criteria anticipated holding all output uncommitted for /gsd-ship, but the execution rules for this run state docs commits ARE made in this mode (only CODE is deferred; 14-02 is all docs) — consistent with the 14-01 close precedent (d90a394 committed planning docs at plan close). The 14-01 code pair (`scripts/check-play-link.mjs`, `package.json`) remains untouched and uncommitted for /gsd-ship, per the hard instruction.
- `git commit` is permission-blocked in this harness; commits went through the sanctioned `gsd-tools query commit` SDK path (staged files individually, no `git add .`).

### Tooling notes (no file damage)

- pwsh quirk: bare `G=path` is not an assignment — needs `$G = "path"` (first commit attempt errored harmlessly; retried correctly). Empty `rg` output (0 counts) reads as blank lines in the transcript — counts verified via `-c` and explicit `Measure-Object` wrappers.

## Known Stubs

None — all three docs are complete scaffolds by design; UAT/RECORDS rows are intentionally `pending` (pre-staged, never executed during this plan — that is their specified state, not a stub: UAT rows execute at ship preflight, RECORDS rows at owner launch time).

## Threat Flags

None new — doc-only plan, no network/auth/file-access/schema surface added (T-14-04/05/06 mitigations all verified: public-artifact notices present, originals verbatim with bounded diff, stale-path count 0 in 14-RUNBOOK).

## Verification Evidence (verbatim)

```
npm run validate — VALIDATE_EXIT=0 (6 stages: html, domain, play-links, links, i18n-detect, i18n)
check-no-old-domain: OK
check-play-link: OK
✓ Successfully scanned 20 links in 0.108 seconds.
ℹ tests 23 / pass 23 / fail 0
i18n-keycheck: PASS ×19 … i18n-keycheck: OK
```

Task-verify greps (all green): 14-RUNBOOK `^## §`=6, privacy URL present (§1/§2/§3), `geohist/index.html`=0, `github\.io`=0, secrets=0; 10-RUNBOOK corrections=5, stale-path originals=4, diff bounded to 5 hunks; 14-UAT `^###`=6; 14-RECORDS `^###`=6, `result: pass`=0; secrets across all three new docs=0.

Repointed one-liner (tested this session, exit 0):

```
OK: JSON-LD parses; no aggregateRating key; type=SoftwareApplication,MobileApplication
```

## Deferred Commits

All CODE changes remain uncommitted — will be committed by /gsd-ship (the 14-01 code pair, untouched by this plan):

- `feat(launch-kit): play package-id CI gate wired into validate chain (check-play-link.mjs)` — files: `scripts/check-play-link.mjs` (new), `package.json` (2 hunks)

Docs commits MADE this plan (all-docs plan; execution-rule override of full deferral):

- `docs(14-02): author launch-day runbook — pinned flip order, 8-surface inventory, GA4 + JSON-LD refresh-check, do-not-do guard` — `28a6433` — files: `.planning/phases/14-launch-kit/14-RUNBOOK.md`
- `docs(14-02): 10-RUNBOOK supersession — 5 dated bracketed appends (paths now root), originals verbatim` — `29cbcdc` — files: `.planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md`
- `docs(14-02): UAT + RECORDS scaffolds — PRE-01..06 locally-runnable pending, R-01..06 post-launch pending (do-not-fabricate)` — `d75544b` — files: `.planning/phases/14-launch-kit/14-UAT.md`, `.planning/phases/14-launch-kit/14-RECORDS.md`

(The plan-close bookkeeping — this SUMMARY, STATE.md, ROADMAP.md, REQUIREMENTS.md — rides the final docs commit.)

## Self-Check: PASSED

- `.planning/phases/14-launch-kit/14-RUNBOOK.md` exists (commit 28a6433)
- `.planning/phases/14-launch-kit/14-UAT.md` + `14-RECORDS.md` exist (commit d75544b)
- `.planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md` carries the 5 appends (commit 29cbcdc); originals verbatim
- 3/3 commits found in `git log`; zero file deletions; working tree holds only the 14-01 deferred code pair (`package.json` modified, `scripts/check-play-link.mjs` untracked) — exactly as required
