---
phase: 12-cleanup-batch
verified: 2026-09-14T01:01:24.059Z
status: passed
score: 9/9 must-haves verified
behavior_unverified: 0
overrides_applied: 0
gaps: []
backstop_pending: 1   # CI-green (post-ship slot per 12-RECORDS.md §2) — planned human/backstop follow-up tied to /gsd-ship, NOT a gap
requirements_accounted:
  - CLEAN-01
  - CLEAN-02
  - CLEAN-03
  - CLEAN-04
---

# Phase 12: Cleanup Batch — Verification Report

**Phase Goal:** CI runs reproducibly and fast (`npm ci` + cached deps restored), and both locale edge-cases (zh variant, Urdu rendering) are verified against the real app/dictionary state (ROADMAP.md §Phase 12)
**Verified:** 2026-09-14T01:01:24.059Z
**Status:** passed
**Re-verification:** No — initial verification

**Deferred-commit note (by design, not a gap):** Phase 12's production changes are intentionally UNCOMMITTED — /gsd-ship lands them: `.github/workflows/deploy.yml`, `AGENTS.md`, `.planning/WINDOWS.md`, `.planning/phases/12-cleanup-batch/12-RECORDS.md`, `12-UAT.md`, `12-01-SUMMARY.md`, plus bookkeeping `.gitignore`/`.planning/config.json`. Planning metadata already landed as commit 6594887 (`docs(12-02): complete zh variant + Urdu device check plan` — STATE.md, ROADMAP.md, REQUIREMENTS.md, 12-02-SUMMARY.md; HEAD 6594887). Verified in `git status --short` + `git log`.

**Requirements source note:** ROADMAP.md §Phase 12 declares CLEAN-01..04; `.planning/REQUIREMENTS.md:37-40` marks all four `[x]` and traceability table `:71-74` marks all four `Complete` at HEAD. All four accounted for below; zero orphaned IDs (both plans' `requirements:` frontmatter covers exactly the four).

## Goal Achievement

### Observable Truths (merged: ROADMAP SCs 1–4 + PLAN frontmatter truths; SC1 split into source-state + post-ship backstop per plan)

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | deploy.yml validate job installs with `npm ci` and setup-node carries `cache: npm`; stale NOTE comment gone; diff scoped 2+/4− (SC1 source state) | ✓ VERIFIED | Verifier re-grepped: `cache: npm` ×1 (line 24, inside setup-node@v7 `with:`), `- run: npm ci` ×1 (line 25), `npm install` ×0, `proxy-broken` ×0, file exactly 46 lines; `git diff --numstat` → `2	4	.github/workflows/deploy.yml`; read confirms nothing else moved (checkout/validate chain/deploy job/permissions byte-identical to prior shape) |
| 2  | Lockfile consistency re-verified with both raw command outputs recorded in 12-RECORDS.md §1; research discrepancy closed (SC2) | ✓ VERIFIED | 12-RECORDS.md §1 read in full: headings `Commands & raw output` (:10), `Provenance` (:38), `Verdict` (:43); both command outputs verbatim (`git ls-files package-lock.json` → path; `npm ci --dry-run` block + `Dry-run exit code: 0`); provenance f0f56ca (2026-09-02, Phase 5) at :41; dated verdict 2026-09-13 at :46/:49; stale comment text NOT quoted in the record (0 matches in 12-RECORDS.md). **Verifier re-ran both commands fresh:** `npm ci --dry-run` → exit 0 (chromedriver@152.0.3 allowScripts warn-only) |
| 3  | AGENTS.md CI deploy chain row states shipped reality (`npm ci` + setup-node `cache: npm`, lockfile committed since Phase 5); pre-lockfile clause gone | ✓ VERIFIED | `git diff -- AGENTS.md` (1/1) shows the row replaced exactly as planned — Node 24 + deploy.yml reference kept, `npm ci` with setup-node `cache: npm`; lockfile committed since Phase 5; `until a lockfile is committed` ×0 repo-wide; `npm ci` ×1 in file; row-scoped edit only |
| 4  | STATE.md lockfile blocker line keeps original text + dated bracketed supersession note (12-01 truth 4) | ✓ VERIFIED | STATE.md:85 = original wording byte-intact (compared against `git show f270f4c:.planning/STATE.md` — text identical) + appended `[superseded 2026-09-13, Phase 12: lockfile tracked since f0f56ca, npm ci --dry-run exit 0 — see 12-RECORDS.md §1]`; commit 6594887 diff shows append-only |
| 5  | Post-ship CI: full pipeline (validate + deploy) completes green; run #1 expected cache MISS+save, run #2 HIT (SC1 second half — 12-01 truth 5, `verification: backstop`) | ⏳ BACKSTOP (post-ship slot) | CI observable only after /gsd-ship pushes. Evidence slot prepared and source-verified: 12-RECORDS.md §2 exact heading (:57), both gh commands (:64-65), MISS-then-save expectations naming "Cache not found for input keys" (:71), cache keyed on package-lock.json hash (:73-75), two `verdict: pending` rows (:83-84), pass predicate (:86-88). Listed under Human Verification — planned post-ship follow-up, not a gap |
| 6  | 12-RECORDS.md §3 documents zh as Simplified-only with verbatim two-tree evidence + fold consequence stated (SC3, CLEAN-02) | ✓ VERIFIED | §3 read in full: exact heading (:91); site evidence js/i18n.js:35/:110/:122 cited (verifier re-checked live: single `zh` at :35 in `'ja', 'ko', 'zh'`, fold doc `'zh-Hant-CN' -> 'zh'` at :110, `'zh': 'zh'` at :122); dictionary samples verbatim (`返回游戏`, `最新动态 — 地史知识问答` — verifier JSON-parsed zh.json and byte-compared; 178 keys); app parity (values-zh sole dir, locales_config single bare `zh` — verifier re-listed the app res tree: `["values-zh"]`, zh entries = `zh`); fold consequence stated explicitly in §(d) (:133-139); §(e) pt/pt-BR observation recorded |
| 7  | js/i18n/ still exactly 19 dictionaries, zh.json the only zh* — no Traditional variant added (SC3 negative) | ✓ VERIFIED | Verifier counted: 19 `*.json`, exactly one `zh*` (zh.json); js/i18n.js contains no zh-TW/zh-CN entry (sole `zh-Hant` mention is the :110 fold doc comment); detect tests prove the fold: `detect(["zh-TW"])→zh`, `detect(["zh-Hant-CN","en"])→zh`, `detect(["zh-HK"])→zh` in the 23/23 battery; `npm run validate:i18n` → PASS ×19 @ 178 keys |
| 8  | 12-UAT.md exists per NN-UAT convention (frontmatter, Current Test, Device, Owner checklist, Tests, Summary, Gaps); zero synthetic outcomes — filled only from the owner report (CLEAN-03 record) | ✓ VERIFIED | Full read: frontmatter `status: complete`, started/updated 2026-09-14; Device section honestly carries "Not provided by owner — check performed on owner's real Android device, Chrome" ×3 (never fabricated — Summary's checkpoint record documents the owner replied "All 5 pass" without metadata); owner checklist names https://geohisttrivia.com + file:// voidance + footer-select-only override; Summary total: 5 / passed: 5 / issues: 0 / pending: 0; Gaps (none yet) |
| 9  | Urdu device check recorded from the owner's real device: all five criteria pass — ur renders RTL with line-height override and readable Nastaliq (SC4, CLEAN-03) | ✓ VERIFIED | 12-UAT.md: `result: pass` ×5 (verifier re-grepped; zero `result:` empty, zero `result: issue`); criteria map to shipped plumbing — verifier re-checked live: js/i18n.js:43 `RTL_LANGS = { 'ar': 1, 'ur': 1 }`, :91 `dir = 'rtl'` flip same pass, css/base.css:667-669 `html[lang="ur"] body { line-height: 2 }`, :674 headings 1.9. Owner executed the blocking-human checkpoint this session (12-02 Summary checkpoint record); css/base.css untouched on the pass branch (`git status` clean for base.css) |
| 10 | STATE.md Urdu blocker superseded + WINDOWS.md row 10 closed via ledger CLI (12-02 truth 5) | ✓ VERIFIED | STATE.md:87 = original text byte-intact (vs f270f4c) + `[superseded 2026-09-13, Phase 12: owner device check pass — see 12-UAT.md]`; WINDOWS.md diff append-only in the row (description untouched, status open→fixed, resolved_at added) + frontmatter open_count 16→15, fixed_count 1→2; **verifier re-ran `gsd-tools windows status`: open_count 15, fixed_count 2, row 10 `"status": "fixed"`** |

**Score:** 9/9 core truths verified (0 present, behavior-unverified) + 1 backstop (truth 5) in its planned post-ship slot

**Supersession integrity (both notes):** git-verified append-only — `git show 6594887 -- .planning/STATE.md` shows the notes appended after `…CLEAN-04 resolves it` and `…closes it` with the pre-note text identical to f270f4c. Historical text never deleted.

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `.github/workflows/deploy.yml` | cache: npm + npm ci, stale comment gone, 2+/4−, 46 lines | ✓ VERIFIED | All greps + numstat + read |
| `AGENTS.md` | CI deploy chain row → shipped reality | ✓ VERIFIED | Diff 1/1, row-scoped; no pre-lockfile clause anywhere |
| `.planning/phases/12-cleanup-batch/12-RECORDS.md` | §1 lockfile verdict + §2 post-ship template + §3 zh confirmation | ✓ VERIFIED | All three sections verified against plan acceptance (headings, verbatim outputs, f0f56ca, gh commands, pending ×2, two-tree evidence, fold consequence, file:line cites) |
| `.planning/phases/12-cleanup-batch/12-UAT.md` | Five-criterion owner device-check record | ✓ VERIFIED | NN-UAT shape, 5× pass, honest device slots |
| `.planning/STATE.md` | Two dated supersession notes, originals intact | ✓ VERIFIED | Lines 85/87, append-only vs git |
| `.planning/WINDOWS.md` | Row 10 fixed via CLI, open_count 15 | ✓ VERIFIED | Diff + `windows status` re-run |
| `css/base.css` | UNTOUCHED on pass branch | ✓ VERIFIED | Absent from `git status --short`; ur rules (:667-675) as shipped |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| setup-node `cache: npm` | package-lock.json hash cache key | cache input in with: block; §2 expectations name the lockfile-hash key + MISS-then-save | ✓ WIRED (source) | deploy.yml:24; post-ship behavior observed via §2 slot (backstop) |
| `npm ci` | committed package-lock.json sync | npm ci --dry-run exit 0 = plan-time proof; CI re-proves every run | ✓ WIRED | Verifier re-ran: exit 0; lockfile tracked; package-lock.json not touched by the phase (absent from git status) |
| DETECT_TABLE fold | every zh-* locale → zh.json | js/i18n.js:110 doc + :122 `'zh': 'zh'` | ✓ WIRED | detect battery: zh-TW / zh-Hant-CN / zh-HK all → zh (23/23) |
| 12-UAT criteria | css/base.css:667-675 + js/i18n.js:43/:91 | owner observes what's shipped | ✓ WIRED | Lines re-verified live (body 2 / headings 1.9; RTL_LANGS; dir flip same pass) |
| 12-UAT outcome | WINDOWS.md row 10 closure | row-10's three deferred items = criteria 5, 4, 2/1 | ✓ WIRED | All cited criteria pass → row 10 fixed via `windows fixed 10` CLI (JSON row + table both fixed) |
| 12-RECORDS.md §1 verdict | stale-comment removal in deploy.yml | record gates removal (same unit of work) | ✓ WIRED | §1 Consequence (:52-55) justifies the removal; removal landed in the same plan (numstat 2/4 includes the 4-deletion comment block) |

### Data-Flow Trace (Level 4)

Not applicable — CI-config + records phase; no rendered dynamic data surfaces touched. zh.json values verified by direct JSON parse (real dictionary data, not mock).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | -------| ------ |
| Lockfile-frozen install dry-run | `npm ci --dry-run` | "up to date in 933ms" + warn-only chromedriver notice, exit 0 | ✓ PASS |
| Full validate chain | `npm run validate` | html-validate clean → check-no-old-domain: OK → 19 links scanned (all 200) → i18n-detect 23/23 pass → i18n-keycheck PASS ×19 @ 178 keys + OK; **VALIDATE_EXIT=0** | ✓ PASS |
| zh dictionary real data | node JSON.parse zh.json | `返回游戏` / `最新动态 — 地史知识问答`, 178 keys | ✓ PASS |
| App locale surface | node fs listing of app res tree | `values-zh dirs: ["values-zh"]`; locales_config zh entries = `zh` (single bare) | ✓ PASS |
| Broken-windows ledger state | `gsd-tools windows status` | open_count 15, fixed_count 2, row 10 `"status": "fixed"` | ✓ PASS |

### Probe Execution

No `scripts/*/tests/probe-*.sh` declared or conventional for this phase. The runnable check IS the validate chain — re-executed green by the verifier above.

### Requirements Coverage (against .planning/REQUIREMENTS.md)

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| CLEAN-01 | 12-01 | deploy.yml validate job runs `npm ci` + `cache: npm` — CI green | ✓ SATISFIED | Source state verified (truth 1); CI-green = post-ship backstop slot (§2, human_verification) — per plan's `verification: backstop` framing; traceability `Complete` justified |
| CLEAN-02 | 12-02 | zh variant confirmed vs app strings.xml (Simplified-only documented) | ✓ SATISFIED | Truths 6–7 + verifier's independent two-tree re-check; visitor selecting zh gets Simplified (detect fold proven) |
| CLEAN-03 | 12-02 | Urdu Nastaliq owner device check recorded (dir="rtl" + line-height) | ✓ SATISFIED | Truths 8–9: owner real-device record, 5× pass, `dir="rtl"` + line-height 2.0/1.9 plumbing confirmed in code |
| CLEAN-04 | 12-01 | Lockfile consistency re-verified at plan time (closes research discrepancy) | ✓ SATISFIED | Truth 2: §1 verdict with fresh outputs (re-run by verifier, exit 0) + f0f56ca provenance + dated verdict + STATE.md supersession |

**Orphaned requirements:** none — REQUIREMENTS.md maps exactly CLEAN-01..04 to Phase 12; both plans' `requirements:` frontmatter covers all four.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| (none new) | — | Debt-marker scan (TBD/FIXME/XXX/HACK/PLACEHOLDER/coming soon) across all 8 phase-touched files | ℹ️ Info | Zero new markers. `placeholder`/`coming soon` hits exist only in WINDOWS.md pre-existing historical ledger row descriptions (rows 2/3/14/16, v2.0-era) — historical records, untouched by this phase by design |
| 12-RESEARCH.md | 9/279 | Quotes the stale comment text and `*.github.io` wildcard phrase | ℹ️ Info | Both are the sanctioned documentation forms: the record-file prohibition (no stale-comment quote in 12-RECORDS.md, no legacy-host literal anywhere in the phase records) is satisfied — 12-RECORDS.md/12-UAT.md contain zero hits; `*.github.io` wildcard is the AGENTS.md-canonical dual-hosts phrase and does not contain the gate needle (`persano` + `.github` + `.io` runtime-assembled); validate:domain OK proves it |

### Human Verification Required

1. **Post-ship CI watch — fill 12-RECORDS.md §2 rows (SC1 "CI green" backstop, CLEAN-01)**
   **Test:** After /gsd-ship pushes the Phase 12 commits to main and the workflow triggers: `gh run list --limit 2` → `gh run watch <run-id> --exit-status` for the first two runs.
   **Expected:** Both jobs green on both runs; run #1 shows `Cache not found for input keys` (designed first-run MISS, then post-step saves the lockfile-keyed npm cache); run #2 shows cache HIT and a faster install — judge speed on run #2 only.
   **Then:** Fill both §2 result rows (Run ID / jobs / cache outcome / duration) and flip both `verdict: pending` cells.
   **Why human/backstop:** CI runs only after push — unobservable on the working tree under deferred-commit mode. Workflow YAML source-verified; local `npm run validate` exit 0 proves the validate job's payload green on the exact tree /gsd-ship will commit.

No other human items: the CLEAN-03 device check was executed by the owner this session at the blocking-human checkpoint (all five pass, recorded in 12-UAT.md) — not pending.

### Gaps Summary

None. All four ROADMAP success criteria verified with first-hand evidence: SC1 source state + full local validate green (post-ship CI watch parked in its planned slot), SC2 verdict recorded + stale comment gone, SC3 Simplified-only confirmed against both trees with the fold consequence documented and no zh-TW surface added, SC4 owner device check recorded all-pass. Both STATE.md blockers closed with byte-intact originals + dated supersession notes; WINDOWS row 10 closed via the ledger CLI; every prohibition honored (no packageManager field, no package-lock.json edit, 2+/4− scoped deploy.yml diff, no zh-TW dictionary, no pre-fabricated device metadata, no historical text deleted).

**Owner follow-up (informational, tracked in §2):** the post-ship CI watch above is the phase's single pending evidence fill — it rides /gsd-ship, not a separate task.

---

_Verified: 2026-09-14T01:01:24.059Z_
_Verifier: the agent (gsd-verifier)_
