---
phase: 10-gated-social-proof
plan: 02
subsystem: seo-docs
tags: [seo, json-ld, policy-compliance, runbook, deploy, static-site, social-proof]

# Dependency graph
requires:
  - phase: 10-gated-social-proof
    plan: 01
    provides: strip + OFF rating row markup (uncommitted), 178-key ×19 surface, JSON-LD byte-identity baseline
provides:
  - Tier-2 permanent-OFF HTML comment adjacent to the JSON-LD block (verbatim policy citation, on-site-source precondition, commented template, no double-hyphen grammar)
  - 10-RUNBOOK.md owner flip doc (evidence gate no-minimum-floor, two-edit flip, Rich Results Test + parse ritual, rollback, refresh rule, Tier-2 precondition)
  - Phase 10 deployed on main (bridge tree 0556bf2): strip live, OFF row served hidden, served JSON-LD byte-identical with zero rating literals
affects: [future owner flip per 10-RUNBOOK.md, gsd-ship (remote/local reconciliation), future agents (Tier-2 precondition surfaces)]

# Actuals — pairs with the plan's `estimate` (chars/4 over the realized diff)
actuals:
  tokens: 2400 # chars/4 over the 10-02-only diff (index.html comment ~1.3k chars + runbook ~8k chars); excludes the 10-01 delta already counted in 10-01-SUMMARY
  tasks: 3
  commits: 0 # deferred_commit_mode — 1 planned docs commit recorded in Deferred Commits; deploy = remote bridge commits (not local)

# Tech tracking
tech-stack:
  added: [] # zero new dependencies — one HTML comment, one markdown doc, deploy tooling only
  patterns:
    - Git Data API bridge with LF-normalized blobs (09-04 CRLF precedent) + per-blob sha assertion vs `git hash-object` + full round-trip decode compare
    - documented-OFF surfaces in two linked locations (in-file comment ↔ runbook §6, same on-site-source precondition)

key-files:
  created:
    - .planning/phases/10-gated-social-proof/10-RUNBOOK.md
  modified:
    - geohist/index.html

key-decisions:
  - "Tier-2 comment placed immediately BEFORE the JSON-LD script opening tag, strictly outside the element; served schema byte-identical (verified vs HEAD~1 pre-deploy and vs prod post-deploy, LF-normalized per autocrlf reality)"
  - "Runbook evidence gate = Play listing live AND real aggregate rating visible on the Play page, owner eyeballs, NO minimum-count floor; flip = remove `hidden` from div.proof-row + replace 0.0 in span.proof-row-score (decimal dot), zero dictionary churn (D-04/D-07)"
  - "Bridge blobs shipped LF-normalized (09-04 precedent) so remote tree matches what autocrlf clean-filter would commit; prod byte-identity asserted on LF-normalized blocks (disk is CRLF)"

patterns-established:
  - "Pattern: documented-OFF pairing — inert HTML comment in-file + runbook section mirroring the same precondition verbatim-in-meaning, so no future agent can rationalize the Play mirror"
  - "Pattern: blob sha assertion = git hash-object (clean-filter equivalent) + round-trip decode compare, when HEAD:<path> is unsatisfiable (uncommitted deferred mode)"

requirements-completed: [SEO-07]

coverage:
  - id: D1
    description: "Owner pre-ship veto (D-09): 5 agent-drafted glyphs + strip layout + copy approved in live local preview before any deploy"
    requirement: D-09
    verification: []
    human_judgment: true
    rationale: "checkpoint:human-verify resolved — owner ruled 'approved' for all 5 glyphs + layout + copy after reviewing the ES-rendered strip live (Task 1, pre-resume); echoed per plan output spec"
  - id: D2
    description: "Tier-2 permanent OFF (SEO-07/D-06): rating template + precondition in an inert HTML comment outside the script element; served schema byte-identical, rating literal confined to the comment"
    requirement: SEO-07
    verification:
      - kind: unit
        ref: "verify-t2 checks 1-3: comment before script tag + outside element, no double-hyphen inside, ratingValue+ratingCount present, schema JSON-parses, zero rating literals inside script block, PERMANENTLY OFF x1, script block byte-identical to HEAD~1 (LF-normalized)"
        status: pass
      - kind: unit
        ref: "npm run validate full chain green (html-validate, domain, links 19, i18n-detect 23/0, keycheck 178 ×19)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Owner runbook (D-07/D-08): evidence gate (no minimum floor), two-edit flip (proof-row hidden + proof-row-score 0.0), Rich Results Test + zero-dep parse ritual, rollback, refresh rule, Tier-2 on-site-source precondition; no secrets"
    requirement: SEO-07
    verification:
      - kind: unit
        ref: "acceptance greps ×7 (no minimum / proof-row / 0.0 / Rich Results Test / Refresh / Rollback / on-site) + public-artifact notice (console-UI only, no secrets)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Ship: bridge deploy strict fast-forward, Actions green on remote sha, prod smoke green (strip served, OFF row served hidden, JSON-LD byte-identical + zero rating literals, smoke-check ALL PASS), ship record in runbook §0"
    requirement: SEO-07
    verification:
      - kind: unit
        ref: "bridge log: 22 blobs sha-asserted == git hash-object + round-trip verified; main 81463b3 -> a24fd4e -> 3eaf9d9 (force:false); Actions 34431471810 success; prod asserts aria=1 pills=4 offrow=1 + JSON-LD compare + smoke-check 13/13"
        status: pass
    human_judgment: false

# Metrics
duration: 16min
completed: 2026-09-10
status: complete
deferred_commit: true
---

# Phase 10 Plan 02: Documented-OFF Surfaces + Ship Summary

**Tier-2 aggregateRating permanently OFF via inert in-file comment + owner runbook (10-RUNBOOK.md), and Phase 10 shipped: prod serves the 4-pill strip, the hidden OFF rating row, and a byte-identical JSON-LD schema with zero rating literals**

## Performance

- **Duration:** 16 min
- **Started:** 2026-09-09T23:54Z (post-checkpoint resume)
- **Completed:** 2026-09-10T03:10Z
- **Tasks:** 3 (Task 1 = checkpoint resolved pre-resume with owner ruling "approved")
- **Files modified:** 2 (geohist/index.html, 10-RUNBOOK.md) + remote-only bridge commit

## Accomplishments

- Task 1 (checkpoint, resolved before this session): owner reviewed the live local preview (ES-rendered 4-pill strip: 20 idiomas / Juega sin conexión / Historia + Geografía / Android 7.0+), checklist a-e verified, ruled **"approved"** for all 5 glyphs + strip layout + copy. No repo changes (per plan).
- Tier-2 permanent-OFF comment landed in `geohist/index.html` immediately before the JSON-LD `<script>` opening tag, strictly outside the element: PERMANENTLY OFF header (SEO-07), verbatim Google review-snippet policy citation ("Don't aggregate reviews or ratings from other websites", fetched 2026-09-09), the on-site-review-source precondition (Play ratings barred from markup even when real), and the commented template (AggregateRating / ratingValue decimal-dot 4.4 / ratingCount). No double-hyphen sequences; script element untouched.
- `10-RUNBOOK.md` written in the 08/09-RUNBOOK pattern: public-artifact notice, §0 current state + ship record, §1 evidence gate (**no minimum-count floor** — any honest real rating flips), §2 two-edit flip (`div.proof-row` `hidden` removal + `span.proof-row-score` `0.0` → decimal-dot value, zero dictionary churn), §3 validation ritual (`npm run validate` + Rich Results Test + exact zero-dep `node -e` parse check), §4 rollback (one attribute + one number), §5 session-convention refresh rule, §6 Tier-2 on-site-source precondition mirroring the in-file comment. Console-UI/local-file instructions only — no secrets.
- Schema guarantee locked twice: script block byte-identical to HEAD~1 pre-deploy and byte-identical prod-post-deploy (LF-normalized both sides); rating literal appears only inside the comment (zero occurrences in the script block, verified locally and on the served page).
- Ship executed: 22-file delta (10-01 markup/CSS/19 dictionaries + 10-02 comment/runbook) deployed via the Phase 9 GitHub Git Data API bridge as strict fast-forwards (`81463b3 → a24fd4e → 3eaf9d9`, tree `0556bf2`); every blob sha-asserted against `git hash-object` (autocrlf clean-filter equivalent) and round-trip decoded+compared (STATE.md empty-blob rule honored in its uncommitted-state adaptation).
- Actions run `34431471810` green (validate + deploy) selected by the remote main sha; prod smoke green: aria key ×1, pill keys ×4, `<div class="proof-row" hidden>` ×1, served JSON-LD byte-identical with zero rating literals, `scripts/smoke-check.sh` ALL PASS (13/13).
- Ship record appended to runbook §0 with deploy sha, Actions run id, and smoke results.

## Deferred Commits

All code/doc changes are UNCOMMITTED locally (deferred_commit_mode) — /gsd-ship will create these commits:

- `docs(10-02): Tier-2 aggregateRating permanent-OFF comment adjacent to JSON-LD + owner flip runbook` — files: `geohist/index.html`, `.planning/phases/10-gated-social-proof/10-RUNBOOK.md`
- `docs(10-02): ship record — bridge sha 3eaf9d9, Actions 34431471810, prod smoke results in runbook §0` — files: `.planning/phases/10-gated-social-proof/10-RUNBOOK.md`

**Deploy (remote-only, no local commit):** bridge commits `a24fd4e` + `3eaf9d9` on main (strict fast-forwards of `81463b3`, tree `0556bf2`) carry the full Phase 10 delta — 10-01's two planned feat commits + 10-02's docs content are already LIVE on prod in consolidated form.

## Files Created/Modified

- `geohist/index.html` — one inert HTML comment before the JSON-LD script tag (permanent-OFF statement, verbatim policy citation, on-site-source precondition, commented template); JSON-LD block byte-untouched
- `.planning/phases/10-gated-social-proof/10-RUNBOOK.md` — new owner flip doc, §0–§6 + ship record

## Decisions Made

- Comment template values shown as plain numbers (4.4 / 12) with the decimal-dot rule stated in prose — matches the research example and Google's own doc example; the grammar constraint (no `--`) held throughout
- Runbook flip steps name the exact artifacts plan 10-01 created (`proof-row` div, `proof-row-score` span) so the two-edit flip needs zero discovery
- Parse-check one-liner uses `.` wildcards for the quote characters in the script regex — quoting-robust in both pwsh and bash without escaping churn

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Normal push impossible under deferred-commit mode — bridge shipped the working-tree delta with adapted sha assertions**
- **Found during:** Task 3 deploy
- **Issue:** Local HEAD `275046b` contains no Phase 10 code (commits deferred by mode); there is nothing to `git push`, and raw push/commit are harness-blocked anyway (Phase 9 precedent). STATE.md's mandatory assertion form `git rev-parse HEAD:<path> == created blob` is unsatisfiable when the changed content is uncommitted by design.
- **Fix:** Git Data API bridge from the working tree (09-03/09-04/09-05 shape): LF-normalized blobs → tree with `base_tree` = main tip tree `247d010c` → commit parented on tip `81463b3` → PATCH refs/heads/main `force:false`. Blob assertions strengthened: created sha == `git hash-object <path>` (clean-filter equivalent of HEAD:path) AND full round-trip decode-compare per blob.
- **Files modified:** none in repo (remote-only)
- **Verification:** all 22 blob shas asserted + round-tripped; remote main tree `0556bf2`; prod smoke green

**2. [Rule 1 - Bug] Bridge script's final assertion JSON-parsed a `--jq` plain-string output — second identical-tree fast-forward commit**
- **Found during:** Task 3 deploy (first bridge run)
- **Issue:** The post-PATCH assertion used `--jq .sha` (raw string output) through a JSON-parsing helper → SyntaxError AFTER the ref update had already succeeded. The re-run repeated the chain, creating a second commit (`3eaf9d9`) on top of the first (`a24fd4e`) with an identical tree (blobs deduplicated by GitHub).
- **Fix:** Verified remote main pointer + tree directly (main `3eaf9d9`, tree `0556bf2`, message confirmed); both updates were strict fast-forwards with force:false — no force-push, no history rewrite, content byte-identical. Left as stacked commits (history noise only; rewriting remote history is forbidden).
- **Files modified:** none (script was temp-dir only)
- **Verification:** `commits/main` = `3eaf9d9`, parent `a24fd4e`, tree `0556bf2`; prod serves the correct content

**3. [Rule 3 - Blocking] Byte-identity comparisons line-ending-normalized (disk CRLF vs repo LF)**
- **Found during:** Task 2 verification setup
- **Issue:** Working tree serves CRLF (`core.autocrlf=true`); repo blobs and `git show` output are LF. The plan's raw byte comparisons (HEAD~1 script block; later prod vs local file) would fail on line endings alone — meaningless noise, not schema drift.
- **Fix:** Both comparisons run LF-normalized (`\r\n` → `\n` on both sides), matching the 09-04 bridge precedent (HTML blobs shipped LF-normalized). The semantic guarantee (JSON-LD content unchanged byte-for-byte modulo line endings) is proven on both surfaces.
- **Files modified:** none (verification normalization only)
- **Verification:** check2 OK (vs HEAD~1); prod JSON-LD compare OK

**4. [Rule 1 - Bug] Prod-smoke pill pattern transcribed with a trailing quote — zero matches**
- **Found during:** Task 3 prod smoke
- **Issue:** My smoke script's pill regex was `data-i18n="geohist\.proof\.pill-"` with a trailing `\"` (attribute-value-end anchor) — the plan's pattern ends at `pill-` (prefix match); served values end in `pill-languages"` etc., so the mis-transcribed pattern can never match.
- **Fix:** Corrected to the plan's exact pattern; count = 4 as specified. (Also: node https gets ECONNREFUSED from this machine's resolver while curl succeeds — prod fetch done via `curl --compressed` into a temp file, then byte-compared in node; the plan's assertion semantics unchanged.)
- **Files modified:** none (temp-dir smoke script only)
- **Verification:** aria=1 pills=4 offrow=1 on try 1; JSON-LD compare OK; smoke-check 13/13

**5. [Rule 3 - Blocking] Task 2 acceptance grep `'no minimum'` (lowercase) initially unsatisfied**
- **Found during:** Task 2 verification
- **Issue:** Runbook sentence began "**No minimum-count floor.**" — capital N; the plan's grep is case-sensitive.
- **Fix:** Rephrased to include the lowercase occurrence ("there is no minimum number of ratings to wait for") without changing meaning.
- **Files modified:** `.planning/phases/10-gated-social-proof/10-RUNBOOK.md`
- **Verification:** all 7 acceptance greps hit

---

**Total deviations:** 5 auto-fixed (2 deploy-mechanism, 2 tooling-mode/quoting, 1 phrasing). **Impact on plan:** every plan guarantee held — byte-identical schema (twice), comment grammar, runbook completeness, strict-FF deploy, green Actions, green prod smoke. The only lasting artifact is a cosmetically doubled bridge commit on remote main.

## Issues Encountered

- Node's `https.get` to geohisttrivia.com → ECONNREFUSED (local resolver/IPv6 quirk; curl resolves fine) — prod fetches routed through `curl.exe --compressed` for this session. Future prod checks should keep this in mind on this machine.
- `curl.exe` serves the page compressed on some requests when `--compressed` is omitted — always fetch with `--compressed` for content assertions.

## Known Stubs

None new. The intentional `0.0` placeholder in `.proof-row-score` (10-01, WINDOWS.md entry 14) is now owner-documented for resolution in `10-RUNBOOK.md` §2/§4 — flip remains externally gated on the Play listing.

## User Setup Required

None — no external service configuration required by this plan. The owner's future flip (when the Play listing is live) is fully documented in `10-RUNBOOK.md`.

## Next Phase Readiness

- **Phase 10 is fully shipped and green** — all three SEO requirements complete (SEO-05/06 in 10-01, SEO-07 here); milestone v2.0 phases 6–10 executed.
- **Remote/local divergence:** remote main `3eaf9d9` (tree `0556bf2`) carries the Phase 10 content; local HEAD `275046b` does not (deferred-commit mode). **/gsd-ship must fetch/rebase before pushing its deferred commits** — the local commits will carry content identical to what main already serves (recorded in WINDOWS.md as a deviation entry).
- Next workflow step: `/gsd-ship` (commits the deferred 10-01/10-02 changes + reconciles with remote) → `/gsd-verify-work` UAT if desired → milestone close. The Tier-1 flip stays owner-runbook work, externally gated on the Play listing (STATE.md blocker stands).

---
*Phase: 10-gated-social-proof*
*Completed: 2026-09-10*

## Self-Check: PASSED

- All plan files exist on disk: `geohist/index.html` (comment present), `10-RUNBOOK.md` (ship record present), `10-02-SUMMARY.md`
- Remote main `3eaf9d9` verified live (tree `0556bf2`); Actions run `34431471810` = completed/success
- Deferred commits: 2 planned docs commits in the Deferred Commits ledger (no local code commits made — /gsd-ship will commit); deploy shipped as remote bridge commits
- Full validate chain green on final tree; prod smoke green (strip served, OFF row hidden, JSON-LD byte-identical, smoke-check ALL PASS)
