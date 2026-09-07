---
phase: 06
plan: 03
subsystem: i18n + static pages
tags: [i18n, changelog, privacy, gap-closure, uat]
requires:
  - 06-01 (changelog page + keycheck surface)
  - 06-02 (content backfill)
provides:
  - keyed entries-language notice on changelog (changelog.entries.notice, 170-key surface)
  - static trilingual notice on privacy.html (keyless path)
affects:
  - deploy push gate (unblocked — was deferred pending G-06-9 resolution)
tech-stack:
  added: []
  patterns: [sequenced-green atomic key-surface move, static trilingual one-liner for scriptless pages]
key-files:
  created: []
  modified:
    - geohist/changelog.html
    - js/i18n/es.json
    - js/i18n/pt-BR.json
    - css/base.css
    - geohist/privacy.html
decisions:
  - "G-06-9 resolved per owner D-notice: Notice only — no translate button, no Google Translate widget, no third-party script; browser-native translation remains the mechanism for EN-only entry content"
  - "privacy.html stays keyless/scriptless (06-01 D-13 stands): static EN—ES—PT trilingual notice line instead of a keyed swap (a swap key would be dead weight on a script-free page)"
  - "Key surface 169→170 moved atomically (markup + es.json + pt-BR.json + CSS); red gate re-proven both directions locally"
metrics:
  duration: ~10 min
  completed: 2026-09-05
status: complete
deferred_commit: true
actuals:
  tokens: 1400
  tasks: 3
  commits: 0
---

# Phase 06 Plan 03: Gap Closure G-06-9 — Entries-Language Notices Summary

**One-liner:** One keyed translated notice on the changelog (170-key atomic surface move) + a static EN—ES—PT notice line on the scriptless privacy page — closing UAT test 9 with zero scripts added.

## What Was Built

1. **Changelog keyed notice (Task 1)** — `<p class="lang-notice" data-i18n="changelog.entries.notice">Entries below are shown in English.</p>` inserted between the intro paragraph and the first `article.changelog-entry` in `geohist/changelog.html`. Keyed node is plain-text-only (no child markup). Nothing inside any entry article was touched — `keysInsideEntries=0` preserved. Translations:
   - `es.json`: `"Las entradas de abajo se muestran en inglés."`
   - `pt-BR.json`: `"As entradas abaixo são mostradas em inglês."`
   - `css/base.css`: `.lang-notice` rule (muted token, 0.95rem, 0.9rem bottom margin) appended after the `.changelog-entry` block.
2. **Privacy trilingual notice (Task 2)** — static `<p class="lang-notice">This page is in English — Esta página está en inglés — Esta página está em inglês.</p>` after the "Last updated" line in `geohist/privacy.html`. Reuses the Task 1 class; no new CSS, no scripts, no keys.
3. **Full validation battery (Task 3)** — gates below, plus gap-closure proof recorded here.

## Verification Evidence

| Gate | Result |
|------|--------|
| `node scripts/i18n-keycheck.mjs` | PASS — es.json and pt-BR.json exactly cover the **170-key** live surface (169 + `changelog.entries.notice`) |
| `npm run validate` | exit 0 — html-validate clean, linkinator 18 links all 200, keycheck PASS both dictionaries |
| Red-gate probe | Key removed from es.json → keycheck FAIL exit 1 naming `changelog.entries.notice` missing → key restored → PASS. Working-tree cycle only, nothing committed |
| privacy.html census | 0 `data-i18n` keys, 0 `<script>` tags — keyless/scriptless invariant held |
| changelog.html script census | exactly 3 scripts, all three srcs present: `/js/i18n.js`, `/js/firebase-config.js`, `/js/consent.js` |
| Third-party translate surface | none — enforced mechanically by both censuses |

## Owner Decision Traceability

- Owner picked option (b) for G-06-9: **accept EN entries + keyed per-language notice** (D-notice). Options (a) key entry content and (c) key the 3 category subheads were rejected.
- **Privacy approach diagnosis (documented in plan):** keying privacy.html was rejected — the page loads no scripts, so a swap key could never be applied (the exact dead-key trap 06-01 avoided); keying would also force loading i18n.js on a deliberately script-free page and add keycheck registration, all for one sentence. Chosen: static trilingual one-liner. Zero gate surface change.

## UAT Re-run Instructions (owner)

Switch site language to Español on `/geohist/changelog.html` → notice reads "Las entradas de abajo se muestran en inglés." above the entries. `/geohist/privacy.html` shows the trilingual line under "Last updated" with no language switch needed. **The deploy push gate (deferred pending this UAT resolution) is now unblocked.**

## Deviations from Plan

None — plan executed exactly as written. (Deferred-commit mode: the plan's two per-task `fix(06-03)` commits and atomic-change-set requirement are recorded as planned ledger entries below; all code changes stay uncommitted for /gsd-ship, which preserves the atomic set-equality property — the whole 4-file Task 1 set lands in one commit at ship time.)

## Deferred Commits

All code changes uncommitted — will be committed by /gsd-ship.

- fix(06-03): add translated entries-language notice to changelog — files: geohist/changelog.html, js/i18n/es.json, js/i18n/pt-BR.json, css/base.css
- fix(06-03): add trilingual English-availability notice to privacy policy — files: geohist/privacy.html

## Self-Check: PASSED

- All 5 modified files present on disk with expected content (notice line verified in each via keycheck/census gates).
- No commits expected (deferred_commit_mode) — ledger above records planned ship commits.
