---
status: pending
phase: 14-launch-kit
source: [14-02-PLAN.md]
started: 2026-09-15
updated: 2026-09-15
---

# Phase 14 UAT — Locally-Runnable Verification Battery (PRE-01..06)

**Reframe note (2026-09-15):** post-launch rows live in `14-RECORDS.md` (phase-12/13 reframe precedent: post-ship checks live in RECORDS; UAT holds locally-runnable rows). This file holds the pre-ship, locally-runnable battery — every row below is locally executable from the repo root with no live-URL fetches. **Rows are pre-staged: none is executed during plan 14-02 — they execute at ship preflight.**

**Public-artifact notice:** this file ships inside the publicly served Pages artifact (the deploy ships the whole tree). It contains console-UI descriptions and local checks only — zero credentials, zero tokens, zero secrets anywhere in this file.

**Recording predicate (mechanical, no gap-awareness):** any recorded issue is a blocker — there is no "minor issue" reading. A row that later re-verifies green keeps its supersession note pointing at the original gap (repo convention).

---

## Checks

### 1. PRE-01 — full CI validate chain green (6 stages, incl. the play package-id gate)

check: `npm run validate` from the repo root.

expected: exit 0; six stages green in order (html, domain, play-links, links, i18n-detect, i18n); the tail shows the `validate:play-links` stage OK (`check-play-link: OK`) plus the i18n keycheck `PASS` ×19 lines ending `i18n-keycheck: OK`.

status: pending — executes at ship preflight

result: (record when executed)

### 2. PRE-02 — play package-id gate green standalone

check: `node scripts/check-play-link.mjs`

expected: `check-play-link: OK`, exit 0 — the 3 canonical id-bearing URLs (index.html lines 53, 83, 87) pass; the two bare-domain mentions (package.json `--skip "play.google.com"`, index.html line 23 comment prose) stay non-hits.

status: pending — executes at ship preflight

result: (record when executed)

### 3. PRE-03 — red-gate integrity vs the 14-01 closing hashes

check: recompute sha256 (`Get-FileHash`) of `scripts/check-play-link.mjs`, `package.json`, and `index.html`; compare the prefixes against the closing-hashes table in `.planning/phases/14-launch-kit/red-gate-proof.md` (end state: `25d033fbd4f1f260…`, `095a9ca607414c79…`, `425f1fde144f5ef8…`).

expected: all three prefixes equal the closing table — red-gate integrity holds against the current working-tree bytes (the docs edits of 14-02 never touched these three files).

status: pending — executes at ship preflight

result: (record when executed)

### 4. PRE-04 — repointed JSON-LD parse check (root path)

check: the 10-RUNBOOK §3 zero-dependency one-liner with its `readFileSync` path argument set to `index.html` (the repointed form written verbatim in 14-RUNBOOK §5 step 2):

```
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const m=h.match(/<script type=.application\/ld\+json.>[\s\S]*?<\/script>/)[0].replace(/<\/?script[^>]*>/g,'');const j=JSON.parse(m);if(j.aggregateRating){process.exit(2)}console.log('OK: JSON-LD parses; no aggregateRating key; type='+j['@type'])"
```

expected: the OK line — JSON-LD parses; no `aggregateRating` key; type `SoftwareApplication,MobileApplication`; exit 0. (Exit code 2 would mean the rating key appeared in the schema: stop, revert per 10-RUNBOOK §4, check 10-RUNBOOK §6.)

status: pending — executes at ship preflight

result: (record when executed)

### 5. PRE-05 — 10-RUNBOOK supersession state (originals verbatim, 5 corrections present)

check: `rg -c "corrected Phase 14" .planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md` AND `rg -c "geohist/index.html" .planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md`

expected: both — the corrections count prints exactly 5 (audience line, §2 heading, §3 step 1 URL, the line after the one-liner fence, §6 mirror sentence) and the stale-path count prints exactly 4 (every original occurrence intact; corrections never repeat the stale path).

status: pending — executes at ship preflight

result: (record when executed)

### 6. PRE-06 — 14-RUNBOOK content checks

check: over `.planning/phases/14-launch-kit/14-RUNBOOK.md` — count `rg -c "^## §"` (expect 6: prerequisites, inventory, sequence, GA4, refresh-check, guard); count the `| n |`-numbered inventory rows (expect 8, with explicit Zero-action markers on rows 4, 5, 6, 8); confirm §3 presents STEP 1 privacy-URL field → STEP 2 Play-link 200 verify → STEP 3 website field → STEP 4 gated Tier-1 flip in that exact order; secrets scan — the credential-shape regex from the plan's Task-3 acceptance criteria, case-insensitive, over the RUNBOOK (expect 0 matches); `rg -ci "github\.io"` over the three new 14-* docs (RUNBOOK, UAT, RECORDS — expect 0 on each).

expected: 6 §-headings; 8 inventory rows with the pinned order intact in §3; secrets scan 0 matches; legacy-host scan 0 on all three new docs.

status: pending — executes at ship preflight

result: (record when executed)

---

## Summary

total: 6

passed: (fill at ship preflight)

issues: (fill at ship preflight)

pending: 6

skipped: (fill at ship preflight)

blocked: (fill at ship preflight)

## Gaps

(none yet — rows are pre-staged pending; they execute at ship preflight and record observed outputs verbatim)

---

*Phase 14 · Launch Kit · battery staged 2026-09-15 by plan 14-02 (Task 3) · rows execute at ship preflight, recorded verbatim per the mechanical predicate · post-launch owner rows live in 14-RECORDS.md*
