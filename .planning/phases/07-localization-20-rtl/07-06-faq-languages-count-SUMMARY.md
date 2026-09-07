---
phase: 07-localization-20-rtl
plan: 06
subsystem: i18n
tags: [i18n, gap-closure, content-accuracy, faq]
requires: [G-07-5a (UAT gap), 07-05 dictionary waves complete]
provides:
  - FAQ languages answer reflects the 20-language surface in EN + all 19 locales (count-style "17 more" form)
  - 07-RESEARCH.md Open Questions marked RESOLVED (checker-warning research_resolution cleared)
affects: [phase-07 closure, /gsd-ship deferred commit batch]
tech-stack:
  added: []
  patterns: [targeted single-anchor value edit, keycheck parity re-verification after content edit]
key-files:
  created: []
  modified:
    - geohist/index.html
    - js/i18n/es.json
    - js/i18n/pt-BR.json
    - js/i18n/de.json
    - js/i18n/fr.json
    - js/i18n/hi.json
    - js/i18n/ru.json
    - js/i18n/ja.json
    - js/i18n/ko.json
    - js/i18n/tr.json
    - js/i18n/id.json
    - js/i18n/it.json
    - js/i18n/nl.json
    - js/i18n/pl.json
    - js/i18n/vi.json
    - js/i18n/el.json
    - js/i18n/bn.json
    - js/i18n/ar.json
    - js/i18n/ur.json
    - js/i18n/zh.json
    - .planning/phases/07-localization-20-rtl/07-RESEARCH.md
decisions:
  - G-07-5a closed with user-approved count-style phrasing ("...and 17 more languages." form); Latin digit 17 in every locale per verified convention
  - Key surface unchanged at 170 keys — value-only edit, verified by keycheck exact parity ×19
metrics:
  duration: 4 min
  completed: 2026-09-07
status: complete
deferred_commit: true
actuals:
  tokens: 700
  tasks: 3
  commits: 0
estimate:
  tokens: 24000
  tasks: 3
---

# Phase 07 Plan 06: FAQ Languages Count (G-07-5a Gap Closure) Summary

FAQ "What languages" answer updated from stale 3-language enumeration to count-style "…and 17 more languages." across EN baseline + all 19 locale dictionaries; validate chain fully green at 170-key parity.

## What Was Built

| Task | Name | Result |
| ---- | ---- | ------ |
| 1 | EN baseline count-style | geohist/index.html:142 now reads "English, Spanish, Portuguese and 17 more languages." (old "and more" phrasing gone) |
| 2 | 19 dictionary count-style values | geohist.faq.languages.a updated in all 19 js/i18n/*.json per locked per-locale table; ja/zh full-width 、 + 。; ur keeps ، + ۔; bn/hi keep danda; Latin digit 17 everywhere |
| 3 | Research bookkeeping | 07-RESEARCH.md "## Open Questions (RESOLVED)" + 4 inline RESOLVED notes pointing at 07-01/07-02 artifacts and UAT 10/10 |

## Verification Results

- **Task 1 verify:** `OK: EN baseline count-style` + `git diff --stat -- geohist/index.html` → 1 file, 1 line.
- **Task 2 verify (`npm run validate` chain, exit 0):**
  - html-validate clean (index.html, 404.html, geohist/*.html)
  - linkinator: 18 links scanned, all `[200]`, 0 broken
  - i18n-detect: 23/23 pass (`tests 23 · pass 23 · fail 0`)
  - i18n-keycheck: **PASS ×19 — every dictionary exactly covers the 170-key live surface**, `i18n-keycheck: OK`
  - count-check node script: `OK: all 19 count-style` (19/19 values contain count-style "17")
- **Task 3 verify:** `OK: research open questions marked RESOLVED` (heading present, ≥4 RESOLVED notes).
- **Scope proof (annotated):** tracked-file diff for this plan = geohist/index.html (1 line), es.json (1 line), pt-BR.json (1 line) — 3 files, 3 insertions, 3 deletions; the 17 untracked dictionaries are covered by keycheck exact-parity + the 19× includes('17') check; ja/zh CJK gate and ur RTL punctuation re-verified by direct value inspection after edit.
- **Key surface unchanged:** no key added/removed/renamed (keycheck exact set-equality green); only geohist.faq.languages.a values + EN HTML baseline + 07-RESEARCH.md RESOLVED notes differ.

## Deferred Commits

All code/content changes left uncommitted — will be committed by /gsd-ship (deferred_commit_mode).

- fix(07-06): FAQ languages answer count-style across EN + 19 dicts (G-07-5a) — files: geohist/index.html, js/i18n/{es,pt-BR,de,fr,hi,ru,ja,ko,tr,id,it,nl,pl,vi,el,bn,ar,ur,zh}.json
- docs(07-06): mark 07-RESEARCH Open Questions RESOLVED — files: .planning/phases/07-localization-20-rtl/07-RESEARCH.md

Pre-existing deferred working-tree output from plans 07-01..07-05 (js/i18n.js, css/base.css, package.json, scripts/i18n-keycheck.mjs, scripts/i18n-surface.mjs, scripts/i18n-detect.test.mjs, 17 untracked dictionaries, .planning/config.json) was left untouched except for the 19 specified value edits. The .planning bookkeeping docs commit for this SUMMARY was made via `gsd_run query commit` (allowed path).

## Deviations from Plan

None — plan executed exactly as written. (Mechanism note: the 19 dictionary edits were applied via a one-shot node script performing the identical single-occurrence exact-string anchor replacement the plan prescribed for the Edit tool — same anchor, same uniqueness assertion, same byte-precise in-line value swap; CRLF/indentation untouched. Outcome verified by the plan's own automated checks.)

## Authentication Gates

None.

## Known Stubs

None.

## Threat Flags

None — static text value change only, no new surface (T-07-06-01 accepted by design; keycheck re-verified parity/empties/punctuation post-edit).

## Self-Check: PASSED

- All 21 modified/created files exist on disk (verified via Test-Path).
- Deferred-commit mode: no code commits made (expected — HEAD unchanged at db71cf2); planned messages + files recorded in Deferred Commits section.
- Validate chain evidence recorded above (html-validate clean, linkinator 18×200, detect 23/23, keycheck PASS ×19 @ 170 keys, count-check 19/19).
