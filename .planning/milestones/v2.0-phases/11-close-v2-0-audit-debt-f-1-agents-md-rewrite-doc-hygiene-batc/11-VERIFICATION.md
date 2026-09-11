---
phase: 11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc
verified: 2026-09-11T14:30:00Z
status: passed
score: 12/12 must-haves verified
behavior_unverified: 0
overrides_applied: 0
gaps: []
requirements_accounted:
  - F-1
  - F-2
  - F-3
  - F-4
  - F-5
  - HV-06
  - HV-09a
  - HV-09b
  - P-10-3
---

# Phase 11: Close v2.0 audit debt — F-1 AGENTS.md rewrite + doc-hygiene batch + UAT records — Verification Report

**Phase Goal:** Future agents and the owner can trust the repo's docs and records — AGENTS.md describes shipped v2.0 reality instead of the pre-pivot design, planning records carry supersession-noted corrections, the three owner-pending verifications are recorded in their own phase UAT files, and the last audit nit (Tier-1 star-uniqueness) is permanently CI-enforced
**Verified:** 2026-09-11T14:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

**Requirements source note:** ROADMAP.md:198 declares "None from REQUIREMENTS.md" — IDs are v2.0-MILESTONE-AUDIT.md items. All 9 IDs (F-1, F-2, F-3, F-4, F-5, HV-06, HV-09a, HV-09b, P-10-3) cross-referenced against the audit file and accounted for below. Zero orphaned IDs: every audit tech_debt/owner-pending item maps to a plan; `deferred_by_design` items (FIRE-10 flip, Tier-1 rating flip, GSC watch) are explicitly out of scope per 11-CONTEXT Phase Boundary and stay parked in their runbooks.

**Deferred-commit note (by design, not a gap):** D-06's 4 code/doc commits are intentionally UNCOMMITTED — /gsd-ship lands them. Per-SC-5 the "commit shape respected" criterion is the 4-commit ledger in the SUMMARIES, verified below. Only .planning metadata commits landed (c85ec38, 2531ea5, f3b3a45 — verified in git log).

## Goal Achievement

### Observable Truths (merged: ROADMAP SCs 1–5 + PLAN frontmatter truths; plan truths that restate an SC keep SC wording)

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | AGENTS.md is a full rewrite describing shipped v2.0 reality (SC1 substance) | ✓ VERIFIED | 165 lines on disk (199→165, SUMMARY claim confirmed); content matchers re-run by verifier: apex `geohisttrivia.com` (lines 9/20/37), 19-dict mentions ×4, 178-key surface (lines 35/65/132), Firebase `12.18.0` exact-pinned CDN (lines 33/53), `ReCaptchaEnterpriseProvider` + "App Check (Phase 9, monitoring mode)" (lines 51–53), fork-shaped Firebase split (consent.js/contact.js sections), validate-chain string `validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n` (line 37) |
| 2  | Zero legacy-host literals; only the generator-owned profile marker remains (D-03) | ✓ VERIFIED | `rg "persano\.github\.io"` AGENTS.md → 0 matches; `rg -in hreflang` → 0; `rg "GSD:.*-start"` → exactly 1 (`159:<!-- GSD:profile-start -->`); no placeholder text (`not yet established|not yet mapped` → 0); dual-hosts fact phrased as "legacy host 301s path-preserved" (line 20) without the literal |
| 3  | CONVENTIONS + ARCHITECTURE populated with real patterns and live file map (D-03) | ✓ VERIFIED | Conventions matchers: `supersession` (line 105, the mechanical uat-passed/red-gate policy block), `red-gate` (line 106), `persano.lang` (line 63); Architecture matchers: `geohist/contact.html` (line 123), `firebase/firestore.rules` (line 138), full file map + runtime data-flow sentence present; What-NOT-to-Use names per-language HTML subdirs as the anti-pattern (line 93, no hreflang literal — documented 11-01 deviation) and bars aggregateRating mirroring (line 96) |
| 4  | Old-domain CI gate ENFORCES AGENTS.md (allowlist entry dropped) + red-gate proven (SC1) | ✓ VERIFIED | `scripts/check-no-old-domain.mjs:41` ALLOW = `['.planning', 'README.md', '.git', 'node_modules']` (AGENTS.md absent); header documents the drop (line 20). **Verifier re-ran the mutation probe**: legacy-host probe line appended → `exit 1` naming `AGENTS.md:166` → snapshot restore SHA256-identical → `check-no-old-domain: OK` exit 0 |
| 5  | F-2: supersession notes in-place, originals verbatim (SC2) | ✓ VERIFIED | Pinned note `[corrected Phase 11: 19 JSON dictionaries — no en.json; EN is the markup baseline, so the "20" counted locales, not files]` counts: 08-VERIFICATION.md ×1, 08-02-SUMMARY.md ×1, 09-CONTEXT.md ×4 (= 6, as planned); originals verbatim — 08-VERIFICATION.md:33 still carries `20/20 dictionaries exactly cover the 170-key` inline before the note; 09-CONTEXT hits at lines 9/28/69/89 as planned |
| 6  | F-3: privacy.html date = September 8, 2026 (SC2) | ✓ VERIFIED | `geohist/privacy.html:37` = `<strong>Last updated:</strong> September 8, 2026`; zero `September 7, 2026` matches |
| 7  | F-4: 08-RUNBOOK §5 rows ✅ with pass date 2026-09-07 (SC2) | ✓ VERIFIED | Rows 173 (`URL rewrite … ✅ done 2026-09-07 (migration commit c72b3a2, CI validate+deploy green)`) and 174 (`Post-deploy smoke … ✅ done 2026-09-07 (smoke ALL PASS on apex; curl triple apex 200 / www 301 / github.io 301 path-preserved)`); zero ⏳ in the §5 table |
| 8  | HV-06 / HV-09a / HV-09b recorded in their own phase UAT files with dated supersession framing (SC3, D-07/D-08) | ✓ VERIFIED | 06-UAT.md: `### 14. UAT test 9 re-run — shipped v2.0 reality (Phase 11 HV-06)` (line 93), note superseding the 2026-09-06 test-11 record, result pass, owner-executed 2026-09-11 on prod apex; Summary counters 14/14. 09-UAT.md: `### 10. UAT test 5 repeat — G-09-5 formal closure…` (line 70, walks §G-09-5: both blocking patterns, GRANTED+DENIED submits, Firestore doc un-attested) + `### 11. Favicon visual glance` (line 77, references test 8); Summary counters 11/11; both consent states + deliver-anyway + form-not-reset in test 10's note. Zero `result: issue` in either file (rg exit 1); zero `result: pending`/SKELETON |
| 9  | HV-09a GA4 clause framed as owner-console sub-item inside a passing record (SC3, D-09) | ✓ VERIFIED | 09-UAT.md test 10 expected-field + note: `GA4 appcheck_token_failure clause → owner-console sub-item per D-09 … NOT part of today's pass/fail`; frontmatter header line 9 carries the same framing; uat-passed predicate stays clean |
| 10 | F-5: 09-USER-SETUP.md status flips to Complete riding the HV-09a record (SC3) | ✓ VERIFIED | Line 5 `**Status:** Complete` with dated provenance line (2026-09-11) pointing at 09-UAT.md tests 10–11 — exactly the audit's F-5 semantics (NOT the Tier-1 row flip; that row correctly remains `hidden` + `0.0` per deferred-by-design — line 86/92 of geohist/index.html verified) |
| 11 | Star-uniqueness gate fail-closed in i18n-keycheck.mjs, red-gate proven both directions, riding the validate chain (SC4, D-10) | ✓ VERIFIED | Source: `TIER1_NS = 'geohist.tier1.'` (line 67), `STAR = '\u2605'` escape (line 68), negative-lookahead regex `proof-row-star(?![\w-])` (line 185), FAIL prefix `star uniqueness:` (line 188), tier1 context in sweep FAIL (line 163), zero raw ★ in source. **Verifier re-ran all cycles in a fresh process:** pristine → PASS ×19 @ 178 keys + OK exit 0; (a) renamed SVG class → `FAIL — star uniqueness: 0 proof-row-star SVG(s)` exit 1; (b) ★ appended to es.json `geohist.tier1.suffix` → `FAIL — es.json: "geohist.tier1.suffix" contains a literal star (U+2605) … [geohist.tier1.* — the Tier-1 rating row]` exit 1 (es.json outside ja/zh punct scope — star check provably the firing gate); (c) duplicated SVG → `FAIL — star uniqueness: 2 proof-row-star SVG(s)` exit 1; flip-compat cycle recorded GREEN in red-gate-proof.md cycle (d); every restore SHA256 hash-identical. red-gate-proof.md complete per Phase 6 template: 3 red cycles + flip-compat + restore notes + final battery + interplay + flip-compat notes |
| 12 | Full validate battery green + D-06 4-commit ledger shape respected (SC5) | ✓ VERIFIED | **Verifier ran `npm run validate` fresh: exit 0** (html 7 files → domain OK → links 19 scanned 0 broken → i18n-detect 23/23 → i18n PASS ×19 + OK incl. star gate). Ledger: commit 1 `docs(11): rewrite AGENTS.md to shipped v2.0 reality (F-1)` (11-01-SUMMARY Deferred Commits), commit 2 `docs(11): audit-debt hygiene batch (F-2 F-3 F-4)` + commit 3 `docs(11): owner UAT records HV-06 HV-09a HV-09b + F-5 flip` (11-02-SUMMARY), commit 4 `feat(11): star-uniqueness fail-closed gate in i18n-keycheck (P-10-3)` + 11-02 supersede commit (11-03-SUMMARY). Working tree matches the ledgers: 15 modified files + untracked red-gate-proof.md, all accounted for (plus orchestrator bookkeeping `.planning/config.json` `_auto_chain_active`, `.planning/WINDOWS.md` stub-ledger rows 16/17 — not D-06 content) |

**Score:** 12/12 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `AGENTS.md` | Full rewrite, 165 lines, shipped v2.0 reality | ✓ VERIFIED | Substantive (all content matchers) + wired (gate scans it — probe proven) |
| `scripts/check-no-old-domain.mjs` | ALLOW entry dropped, header updated | ✓ VERIFIED | Line 41 four-entry set; wired into validate:domain — battery green |
| `.planning/PROJECT.md` | Line 5 names apex | ✓ VERIFIED | Line 5 `https://geohisttrivia.com`; lines 1–10 clean (line 93 legacy mention is D-04 out-of-scope hosting history) |
| `scripts/i18n-keycheck.mjs` | Star-uniqueness gate | ✓ VERIFIED | Constants + sweep + markup check; wired into validate:i18n |
| `red-gate-proof.md` (phase dir) | 3 cycles + proof sections | ✓ VERIFIED | Phase 6 template complete |
| `06-UAT.md` / `09-UAT.md` / `09-USER-SETUP.md` / `08-VERIFICATION.md` / `08-02-SUMMARY.md` / `08-RUNBOOK.md` / `09-CONTEXT.md` / `geohist/privacy.html` | Hygiene + record edits | ✓ VERIFIED | All greps above |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| AGENTS.md | scripts/check-no-old-domain.mjs | gate scans the rewritten doc | ✓ WIRED | Verifier probe: mutated → exit 1 naming AGENTS.md:166 → byte-identical restore → exit 0 |
| AGENTS.md fact claims | STATE.md locked decisions + live code | hand-written from shipped reality (D-02) | ✓ WIRED | Content matchers (19 dicts/178-key/12.18.0/Enterprise/fork split/validate chain) all match live tree; D-02 spot-check against STATE corroborated |
| check-no-old-domain.mjs | npm run validate chain | validate:domain stays green after drop | ✓ WIRED | Full battery exit 0 with enforcing gate |
| 09-UAT.md test 10 | 09-USER-SETUP.md §G-09-5 | same steps walked | ✓ WIRED | Test 10 note names §G-09-5 walkthrough, blocking patterns, both consent states — checklist source consistent |
| F-5 flip | HV-09a record | same-commit linkage (D-06 commit 3) | ✓ WIRED (ledger) | Provenance line on the flip cites 09-UAT.md tests 10–11; both files share deferred commit 3 |
| UAT record | GA4 owner-console sub-item | tracked, not blocking (D-09) | ✓ WIRED | Owner-console clause inside test 10 expected+note; never `result: issue` |
| privacy.html edit | validate:html | only scanned product surface | ✓ WIRED | Battery html gate green |
| i18n-keycheck.mjs | npm run validate chain | validate:i18n rides CI | ✓ WIRED | Battery exit 0; zero workflow edits, zero new deps |
| Markup check needle | geohist/index.html:88 | single proof-row-star SVG anchor | ✓ WIRED | Line 88 verified; cycles a/c prove the count is live |
| Gate invariant | 10-RUNBOOK flip ritual | flip never trips gate | ✓ WIRED | Cycle (d) flip-compat GREEN recorded |
| red-gate-proof.md | Phase 6 template | evidence standard | ✓ WIRED | Structure matches (cycles/restore/final-battery/interplay/flip-compat) |

### Data-Flow Trace (Level 4)

Not applicable — docs/CI-gate phase; no rendered dynamic data surfaces touched. The one product-surface edit (privacy.html date) is static text, verified directly.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Star gate pristine | `node scripts/i18n-keycheck.mjs` | PASS ×19 @ 178 keys + OK, exit 0 | ✓ PASS |
| Missing star SVG | rename class → gate | `star uniqueness: 0 proof-row-star SVG(s)`, exit 1; restore hash-identical → OK exit 0 | ✓ PASS |
| Text star in dictionary | ★ in es.json tier1.suffix | `FAIL — es.json: "geohist.tier1.suffix" contains a literal star (U+2605)…`, exit 1; restore hash-identical | ✓ PASS |
| Duplicated star SVG | duplicate SVG element | `star uniqueness: 2 proof-row-star SVG(s)`, exit 1; restore hash-identical | ✓ PASS |
| Domain gate enforces AGENTS.md | legacy probe line in AGENTS.md | `AGENTS.md:166` + FAIL, exit 1; restore hash-identical → OK exit 0 | ✓ PASS |
| Full battery | `npm run validate` | exit 0 (all five gates) | ✓ PASS |

### Probe Execution

No `scripts/*/tests/probe-*.sh` declared or conventional for this phase. The gate-mutation cycles above ARE the phase's probe evidence, re-executed by the verifier.

### Requirements Coverage (against v2.0-MILESTONE-AUDIT.md)

| Requirement | Source Plan | Audit Item | Status | Evidence |
| ----------- | ----------- | ---------- | ------ | -------- |
| F-1 | 11-01 | WARNING: AGENTS.md stale (URL rot + pre-pivot i18n + gate allowlist rot) | ✓ SATISFIED | Truths 1–4: full rewrite, zero literals/markers, gate enforcing, probe proven |
| F-2 | 11-02 | INFO: "20 dictionaries" (08-02-SUMMARY:121, 08-VERIFICATION:33, 09-CONTEXT:69) | ✓ SATISFIED | Truth 5: 6 supersession notes, originals verbatim |
| F-3 | 11-02 | INFO: privacy date stale (September 7) | ✓ SATISFIED | Truth 6: September 8, 2026 |
| F-4 | 11-02 | INFO: 08-RUNBOOK §5 row never flipped | ✓ SATISFIED | Truth 7: rows 173+174 ✅ done 2026-09-07 |
| F-5 | 11-02 | INFO: 09-USER-SETUP header Incomplete | ✓ SATISFIED | Truth 10: Complete + dated provenance (flip = header status, NOT the Tier-1 row — correctly untouched) |
| HV-06 | 11-02 | OWNER-PENDING: 06 UAT test 9 re-run unrecorded | ✓ SATISFIED | Truth 8: 06-UAT test 14, owner pass 2026-09-11, supersession framing |
| HV-09a | 11-02 | OWNER-PENDING: G-09-5 formal closure | ✓ SATISFIED | Truth 8: 09-UAT test 10 (D-09 split); Truth 9: GA4 owner-console sub-item |
| HV-09b | 11-02 | OWNER-PENDING: favicon glance | ✓ SATISFIED | Truth 8: 09-UAT test 11, owner pass |
| P-10-3 | 11-03 | star-uniqueness no wired CI gate | ✓ SATISFIED | Truth 11: fail-closed gate, both directions red-proven (verifier re-run), chained in validate |

**Orphaned requirements:** none — all 9 audit IDs claimed across plans 11-01/11-02/11-03 (`requirements:` frontmatter) and verified above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| (none) | — | Debt markers TBD/FIXME/XXX/PLACEHOLDER/"not yet implemented" scanned across all 11 phase-modified files | ℹ️ Info | Zero matches. The 11-01 "Known Stubs" entry (generator-owned Developer Profile block) is intentional per research A1 — tracked in WINDOWS.md stub ledger, resolved by /gsd-profile-user, not a phase gap |

Superseded-claim check: 11-02-SUMMARY's original overclaim that the star gate existed pre-11-03 carries dated bracketed supersession notes (lines 82/127) — correct final state per the supersession policy, not drift.

### Human Verification Required

None. The three human verifications were performed **in-phase with the owner live** (D-07 model) on 2026-09-11 and recorded: HV-06 (06-UAT test 14), HV-09a live checks (09-UAT test 10), HV-09b (09-UAT test 11) — all owner-passed. The 11-02 `checkpoint:human-verify` gate resolved (owner blanket pass). No ⚠️ PRESENT_BEHAVIOR_UNVERIFIED truths: every behavior-dependent truth (gate fail-closed directions, gate enforcement) was exercised by the verifier's own mutation cycles above.

### Gaps Summary

None. All 12 must-haves verified with first-hand evidence: working-tree deliverables match every plan acceptance criterion, both CI gates re-proven red by the verifier in fresh processes with hash-identical restores, the full battery re-run green, all 9 audit requirement IDs accounted for, the D-06 4-commit ledger shape intact, and the deferred-by-design states (Tier-1 row hidden + 0.0, runbook-parked owner flips) preserved exactly as the phase boundary requires.

**Owner follow-ups (informational — parked by design, tracked in records, not phase gaps):**
1. GA4 `appcheck_token_failure` console confirmation — D-09 owner-console sub-item inside the passing 09-UAT test 10 record (≤24h Firebase Events window; pihole blocks GA4/DebugView). The record closes on an owner console glance.
2. Deferred-by-design flips remain parked per runbooks: FIRE-10 enforcement flip (09-RUNBOOK), Tier-1 rating row flip (10-RUNBOOK, gate now protected by the new star gate), GSC 180-day watch (~2027-03).

---

_Verified: 2026-09-11T14:30:00Z_
_Verifier: the agent (gsd-verifier)_
