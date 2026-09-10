---
phase: 10-gated-social-proof
plan: 01
subsystem: ui
tags: [seo, i18n, static-site, social-proof, json-ld, accessibility]

# Dependency graph
requires:
  - phase: 07-localization-20-rtl
    provides: keyed-node i18n engine + 19-dictionary keycheck surface (171 keys) + register table + CJK punct gate
  - phase: 09-app-check-monitor-first
    provides: hero/badge-cta markup shape and .proof insertion conventions untouched since Phase 2
provides:
  - 4-pill facts strip between hero and features (static, keyed, aria-labeled, no visible h2, zero hyperlinks)
  - Tier-1 "Rated X.X on Google Play" row shipped OFF (hidden attributed link + translated fragments + 0.0 self-flagging placeholder)
  - 7 new i18n keys live in all 19 dictionaries (key surface 171 → 178, exact-set parity)
  - .proof-* CSS block with .proof-row[hidden] display:none insurance
affects: [10-02 (Tier-2 comment + runbook + owner veto checkpoint), future owner flip, gsd-ship]

# Actuals — pairs with the plan's `estimate` (chars/4 over the realized diff)
actuals:
  tokens: 5670
  tasks: 2
  commits: 0 # deferred_commit_mode — 2 planned code commits recorded in Deferred Commits; committed by /gsd-ship

# Tech tracking
tech-stack:
  added: [] # zero new dependencies — pure HTML/CSS/JSON edits
  patterns:
    - atomic key-surface commits (markup + 19 dictionaries + CSS together; red-gate proven both directions)
    - [hidden] insurance restatement for classes that set display (third instance after .consent-banner/.form-status)
    - position-free i18n fragments around one unkeyed owner-edit span

key-files:
  created: []
  modified:
    - geohist/index.html
    - css/base.css
    - js/i18n/ar.json
    - js/i18n/bn.json
    - js/i18n/de.json
    - js/i18n/el.json
    - js/i18n/es.json
    - js/i18n/fr.json
    - js/i18n/hi.json
    - js/i18n/id.json
    - js/i18n/it.json
    - js/i18n/ja.json
    - js/i18n/ko.json
    - js/i18n/nl.json
    - js/i18n/pl.json
    - js/i18n/pt-BR.json
    - js/i18n/ru.json
    - js/i18n/tr.json
    - js/i18n/ur.json
    - js/i18n/vi.json
    - js/i18n/zh.json

key-decisions:
  - "Pill joins rendered naturally per language (ar و-conjunction 'التاريخ والجغرافيا', ja full-width ＋ '歴史＋地理') instead of a literal '+' — semantic agreement with the on-site anchors (P-10-1) outranks EN's stat-joiner styling"
  - "modes pill glyph = map-pin (D-09 suggestion) rather than the research sketch's heart path; all 5 SVGs 24px-grid stroke currentColor, aria-hidden, focusable=false — owner veto happens at plan 10-02's pre-ship checkpoint"
  - "Tier-1 fragments drafted position-free per language (es 'Valoración de … en Google Play', ja 'Google Playで … の評価', ko 'Google Play에서 … 점') — star-free, digit-free, brand Latin in all 19"
  - "Red-gate restore done via byte-exact in-memory backup (sha256-verified) instead of `git checkout` — deferred-commit mode forbids reverting to HEAD, which would have wiped Task 1's uncommitted keys"

patterns-established:
  - "Pattern: keyed aria-label section naming (nav precedent reused for .proof-strip) — no visible h2 added"
  - "Pattern: [hidden] insurance restatement — .proof-row[hidden] { display: none } with the established comment"
  - "Pattern: one unkeyed owner-edit span inside keyed fragment pairs (engine textContent contract preserved)"

requirements-completed: [SEO-05, SEO-06]

coverage:
  - id: D1
    description: "Facts strip: static 4-pill band (20 languages / Play offline / History + Geography / Android 7.0+) between hero and features, keyed in all 19 dictionaries, aria-labeled, no visible h2, zero hyperlinks"
    requirement: SEO-05
    verification:
      - kind: unit
        ref: "npm run validate:i18n (i18n-keycheck exact-set 176-key ×19 PASS + CJK punct gate)"
        status: pass
      - kind: unit
        ref: "temp structural asserts (4 li / 4 svg / 4 keyed pill spans / 1 keyed aria pair / zero <a> / zero <h2> in section) + validate:html"
        status: pass
    human_judgment: false
  - id: D2
    description: "Tier-1 gated proof row ships OFF: hidden div under badge CTA, one attributed link (rel=noopener) to the Play package URL, keyed prefix/suffix fragments around ONE unkeyed 0.0 span, .proof-row[hidden] insurance CSS, keys live in all 19 dictionaries (178-key parity), red gate proven missing+extra"
    requirement: SEO-06
    verification:
      - kind: unit
        ref: "npm run validate:i18n (178-key ×19 PASS) + structural asserts (1 row / 1 star svg / 2 keyed spans / unkeyed score span / noopener / package URL)"
        status: pass
      - kind: unit
        ref: "red-gate proof: missing tier1.suffix -> FAIL naming es.json+key; extra geohist.proof.bogus -> FAIL; byte-identical restores; final keycheck green"
        status: pass
    human_judgment: false
  - id: D3
    description: "5 inline-SVG icon drafts (globe/offline/map-pin/phone + star), stroke currentColor — visual veto"
    verification: []
    human_judgment: true
    rationale: "D-09 locks owner veto pre-ship; the veto checkpoint is plan 10-02's work (same file/checkout), so automation cannot close it here"

# Metrics
duration: 8min
completed: 2026-09-09
status: complete
deferred_commit: true
---

# Phase 10 Plan 01: Gated Social Proof Site Surfaces Summary

**4-pill facts strip + OFF-gated "Rated X.X on Google Play" row on geohist/index.html — 7 keyed i18n entries live in all 19 dictionaries (171 → 178), validate chain green, red gate proven both directions**

## Performance

- **Duration:** 8 min
- **Started:** 2026-09-09T23:12:48Z
- **Completed:** 2026-09-09T23:21:00Z
- **Tasks:** 2
- **Files modified:** 21 (index.html + base.css + 19 dictionaries)

## Accomplishments

- Facts strip section (`proof-strip`) between hero and features: exactly 4 stat pills, each an inline-SVG icon (globe/offline/map-pin/phone drafts, stroke currentColor) + a keyed leaf span; keyed aria-label names the section (no visible h2); zero anchors — a trust band per D-01/D-02/D-03
- Tier-1 gated proof row shipped OFF: `<div class="proof-row" hidden>` directly under the badge CTA, whole row one `rel="noopener"` link to the Play package URL, keyed `tier1.prefix`/`tier1.suffix` leaf spans around ONE unkeyed `0.0` self-flagging span (D-04/D-05) — owner flip = one attribute removal + one number edit, zero dictionary churn
- 7 new keys (`geohist.proof.aria`, 4 pills, `geohist.tier1.prefix/suffix`) landed in all 19 dictionaries; keycheck exact-set parity at 178 across the surface; ja/zh values full-width-punctuation clean; zero U+2605 in any dictionary value (single star = the row's SVG)
- `.proof-*` CSS block: flex+wrap pills on verified contrast tokens (muted 9.38:1 text, teal 9.30:1 icons, gold 8.46:1 row link), zero directional declarations (RTL rides the flex order flip), and the mandatory `.proof-row[hidden] { display: none }` insurance restatement
- Red gate proven BOTH directions locally: missing `geohist.tier1.suffix` → FAIL naming es.json + key; extra `geohist.proof.bogus` → FAIL naming es.json + key; tree restored byte-identical (sha256-verified) and green after each
- Full `npm run validate` chain green on the final tree (html-validate, domain scan, linkinator, i18n-detect tests, keycheck 178); JSON-LD block untouched (0 diff lines — Pitfall 7)

## Deferred Commits

All code changes are UNCOMMITTED (deferred_commit_mode) — /gsd-ship will create these commits:

- `feat(10-01): facts strip — 4 keyed stat pills between hero and features (+CSS, 5 keys ×19 dicts, 171→176)` — files: `geohist/index.html`, `css/base.css`, `js/i18n/{ar,bn,de,el,es,fr,hi,id,it,ja,ko,nl,pl,pt-BR,ru,tr,ur,vi,zh}.json`
- `feat(10-01): Tier-1 gated proof row OFF — hidden attributed row under badge CTA (+CSS with [hidden] insurance, 2 keys ×19 dicts, 176→178)` — files: same 21-file set (second edit pass)

## Files Created/Modified

- `geohist/index.html` — strip section (4 pills + keyed aria-label) + hidden proof row under badge CTA; JSON-LD byte-untouched
- `css/base.css` — one `.proof-*` block: strip flex layout, pill tokens, row styles + `[hidden]` insurance; no directional rules
- `js/i18n/*.json` (19 files) — +5 strip keys then +2 tier1 keys; exact 178-key parity; values anchor-verified (20 = FAQ 4+17; offline/modes words from feature groups; Android 7.0+ from FAQ devices)

## Decisions Made

- Per-language natural joins for the modes pill (ar و, ja ＋, bn ও) — keeps claims in exact semantic agreement with the trivia feature line (P-10-1) instead of transplanting EN's "+"
- `modes` glyph = map-pin per D-09's own suggestion (research example sketched a heart — D-09 governs); owner veto gate sits in 10-02
- zh offline pill = "支持离线" (supports offline) — stat phrasing consistent with zh FAQ offline answer rather than a marketing verb

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Task 1 verify's CSS-block count is unsatisfiable at Task 1 time**
- **Found during:** Task 1 verification
- **Issue:** The Task 1 automated verify requires ≥6 `.proof-` CSS chunks, but the Task 1 artifact list defines only 4 strip selectors; the other 5 belong to Task 2's commit. No valid Task-1-only tree can reach 6.
- **Fix:** Ran the gate with threshold 4 after Task 1 (all other assertions byte-identical to the plan); the plan's original ≥6 check re-run after Task 2 and passed (10 chunks). Final-tree behavior is exactly as planned.
- **Files modified:** none (verification-threshold adaptation only)
- **Verification:** post-Task-2 run: `proof-blocks=10`, no `direction:`, both color tokens present

**2. [Rule 3 - Blocking] Red-gate restore step unusable under deferred-commit mode**
- **Found during:** Task 2 red-gate proof
- **Issue:** Plan specifies `git checkout` to restore es.json after each red-gate mutation — but with commits deferred, checkout restores HEAD, which does NOT contain Task 1's uncommitted keys (would destroy committed-in-Task-1 state and 7 keys).
- **Fix:** Restored via byte-exact in-memory backup with sha256 comparison before/after; both red-gate directions still proven and tree verified identical + green.
- **Files modified:** none (transient local state; committed tree unaffected)
- **Verification:** `restore-missing: identical=true`, `restore-extra: identical=true`, `final-keycheck-green=true`

---

**Total deviations:** 2 auto-fixed (1 plan-internal inconsistency, 1 tooling-mode conflict)
**Impact on plan:** Both adaptations preserve every plan guarantee (atomic surfaces, red gate, insurance rule). No scope creep.

## Issues Encountered

None — both tasks landed clean on first verification run.

## Known Stubs

| File | What | Why intentional | Resolution |
|------|------|-----------------|------------|
| `geohist/index.html` (`.proof-row-score` span) | placeholder `0.0` | D-04 by design: row is `hidden`; if the attribute were ever lost, 0.0 self-flags instead of looking real; engine never touches the unkeyed span | owner flip per `10-RUNBOOK.md` (plan 10-02): Play listing live AND real aggregate visible → remove `hidden`, replace number |

## User Setup Required

None — no external service configuration required by this plan (Play listing itself gates only the future owner flip).

## Next Phase Readiness

- Plan 10-02 (wave 2) can proceed: Tier-2 HTML comment adjacent to the untouched JSON-LD block, `10-RUNBOOK.md`, icon-veto checkpoint, deploy
- Key surface at 178 — any 10-02 dictionary work must stay exact-set
- Owner flip path is live and translated in 20 languages; blocked externally on the Play listing (STATE.md blocker stands)

---
*Phase: 10-gated-social-proof*
*Completed: 2026-09-09*

## Self-Check: PASSED

- All 21 task files exist on disk with the changes intact (`git diff --name-only` = 23 files incl. 2 pre-existing .planning mods)
- Deferred commits: 2 planned code commits in the Deferred Commits ledger above (no code commits made — /gsd-ship will commit)
- Final validate chain green: 178-key ×19 exact-set, html-validate, domain, links, i18n-detect

