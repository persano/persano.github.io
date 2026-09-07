---
phase: 07
plan: 01
subsystem: i18n-engine
tags: [i18n, rtl, detection, ci-gate, switcher]
requires:
  - js/i18n.js (3-language engine, Phase 2)
  - scripts/i18n-keycheck.mjs (170-key parity gate, Phase 6)
  - footer lang-switcher-slot on 5 keyed pages
provides:
  - DETECT_TABLE prefix-table detection (19 entries, no en) with detect(candidatesOverride) test injection
  - scripts/i18n-detect.test.mjs (node:test, 23 vectors) + validate:i18n-detect chain step
  - hardened i18n-keycheck (empty-value rejection all files; CJK half-width punct ja/zh, ko exempt, digit-period exception)
  - 20-endonym select switcher (D-01..D-04) with engine-internal LANG_LABELS aria vocabulary
  - RTL dir switching in applyLanguage + [dir=rtl] CSS block + logical-property conversions + ur/CJK line-heights
  - SUPPORTED/ENDONYMS grown to 20 — one array activates detection, switcher, and keycheck coverage for plans 02-05
affects:
  - plans 02-05 (17 dictionaries auto-covered by the gate; owner spot-checks ride the rendered switcher)
tech-stack:
  added: []            # zero new deps — node:test is a Node built-in
  patterns:
    - in-IIFE module.exports test hook (inert in browsers) + document stub + node:test
    - flat prefix-table detect fold with 'en' terminal (D-32)
    - slot.onchange property assignment (never-stacks listener rule, D-01)
    - CSS logical properties in place instead of mirrored stylesheet
key-files:
  created:
    - scripts/i18n-detect.test.mjs
  modified:
    - js/i18n.js
    - scripts/i18n-keycheck.mjs
    - css/base.css
    - package.json
decisions:
  - el placed as its own script group between Cyrillic and Indic in the D-03 order (reversible; documented in engine comment)
  - हिन्दी spelling chosen over हिंदी — stay consistent (owner spot-check per D-06 catches misspellings)
  - ko exempt from the CJK half-width punctuation rule (common Korean usage); ko included in the 1.7 CJK line-height rule (harmless, consistent) — both documented in script header / CSS comment
  - select aria-label vocabulary is the engine-internal LANG_LABELS 20-word map (Pitfall 6), never dictionary keys (Pitfall 5)
  - intentional detection change [zh, pt] → zh documented in test file (first supported match wins now that zh is supported)
  - red-gate used a temporary planted ja.json (real ja.json drafts land in plans 02-05); punct rule is filename-scoped
metrics:
  duration: 14 min
  completed: 2026-09-07T02:29Z
  tasks: 3
  files: 5
status: complete
actuals:
  tokens: 4400        # chars/4 over the realized code diff (~17.5k chars) + new test file; plan estimated 68000 — heavy over-delivery of research precision, no churn
  tasks: 3
  commits: 0          # deferred_commit_mode — code left uncommitted; see Deferred Commits
deferred_commit: true
---

# Phase 7 Plan 1: Engine Wave — Detection Table + RTL + 20-Endonym Switcher + Hardened Gate Summary

Table-driven 20-locale detection with a 23-vector node:test harness, an empty-value + CJK-punctuation-hardened keycheck, and a 20-endonym native-select switcher with ar/ur RTL mirroring — zero new dependencies, zero markup edits.

## What Was Built

### Task 1 (tracer): End-to-end detection slice
- `js/i18n.js` `detect()` internals replaced with flat `DETECT_TABLE` (19 entries: es, pt, fr, de, it, nl, pl, tr, vi, id, ru, hi, bn, ar, ur, ja, ko, zh + legacy fold `in`→id). **No `en` entry** — EN stays the terminal return after the scan (D-32). Per candidate: lowercase → `split('-')[0]` → table hit returns mapped lang, else scan continues.
- Optional `detect(candidatesOverride)` parameter for test injection — the browser path passes no argument.
- Test-only export hook as the last line inside the IIFE: `if (typeof module === 'object' && module.exports) module.exports = { detect: detect };` — inert in browsers, exactly one `module.exports` hit in the file.
- `scripts/i18n-detect.test.mjs`: node:test harness with document stub + createRequire over the REAL engine; **23 vectors** including `[en-US, es]→es` (D-32), `[zh, pt]→zh` (documented intentional change), `[fil-PH]→en`, `[in-ID]→id`, `[zh-Hant-CN]→zh`.
- `package.json`: `validate:i18n-detect` chained into `validate` before `validate:i18n`.

### Task 2: Hardened keycheck gate
- `scripts/i18n-keycheck.mjs` per-dictionary loop gained two predicates after the shape check:
  - **Empty-value rejection (all dictionaries):** non-string or whitespace-empty value → FAIL naming file and key.
  - **CJK half-width punctuation (ja.json + zh.json only; ko exempt):** rejects ASCII `, ! ? : ; ( ) "`; rejects `.` unless every period sits between digits (`\d\.\d` runs stripped first, remaining `.` fails) — `0.88`/`3.0` pass. Both the exception and the ko exemption documented in the script header.
- Parity logic (exact set-equality block) byte-untouched; extraction regex untouched; script remains zero-dependency node built-ins.
- **Red-gate proven both directions** (11/11 checks): empty value in a non-CJK file FAILs naming file+key; ko-shaped file with half-width punct passes the punct rule; planted ja.json FAILs for empty/comma/loose-period keys while the `0.88` key is NOT named; ja-vs-ko asymmetry proven; all temp artifacts deleted, tree restored (git status clean of temp files).
- Idempotency: two consecutive clean runs print identical PASS output.

### Task 3: Switcher select + RTL + CSS
- `SUPPORTED` grown to exactly 20 entries in D-03 grouped order: en, es, pt-BR | fr, de, it, nl, pl, tr, vi, id | ru | el | hi, bn | ar, ur | ja, ko, zh. `el` placed as its own script group between Cyrillic and Indic (documented choice). ENDONYMS grown to 20 (हिन्दी spelling chosen).
- `renderSwitcher()` rewritten: clears the footer `lang-switcher-slot`, builds one native `<select class="lang-select">`, one option per SUPPORTED entry (value = lang attr = language code, textContent = endonym only, no optgroups per D-04), sets select value to the current language. Dead anchor/span rendering paths removed. Switching persists through the unchanged `switchTo()` → `persano.lang` path.
- `bindSwitcher()` rewritten: `slot.onchange` property assignment — re-renders never stack listeners (D-01); no `addEventListener` in the bind path.
- `LANG_LABELS`: engine-internal 20-word "Language" aria-label map (Pitfall 6), applied per current language with `'Language'` fallback.
- `RTL_LANGS = { ar, ur }`; `applyLanguage()` sets `documentElement.dir = 'rtl'/'ltr'` in the same pass as the existing lang sync — single assignment site; the EN-restore path resets to ltr with no extra code.
- `css/base.css`: `.lang-select` styled on form-control tokens with 44px tap target; three direction-sensitive physical declarations converted to logical properties **in place** (`.feature-group ul` and `.changelog-entry ul` → `margin-inline-start: 1.25rem`; `.faq-item summary` → `padding-block`/`padding-inline: 1rem 2.6rem`; `.faq-item summary::after` → `inset-inline-end: 1rem`); `[dir="rtl"]` seed block (intentionally empty — documented home for the RTL screenshot battery); `html[lang="ur"] body { line-height: 2 }`, `html[lang="ur"] h1-h3 { line-height: 1.9 }`, `html[lang="ja"/"zh"/"ko"] body { line-height: 1.7 }` — targeting body/headings directly per Pitfall 8.

## Verification Results

- `node --test scripts/i18n-detect.test.mjs` — **23/23 pass**
- `npm run validate` (full chain: html + links + detect + keycheck) — **exit 0**
- `npm run validate:i18n` — PASS ×2 (170-key surface, es + pt-BR); double-run idempotent
- Red-gate script — **11/11 checks passed**, tree restored, temp files deleted
- Engine smoke check (real IIFE + DOM stub) — select built with 20 endonym options in D-03 order, unique values, `lang` attr == value, aria-label applied, value = 'en'
- `grep documentElement.dir js/i18n.js` → exactly 1 assignment site; `grep module.exports` → exactly 1 hit (inside IIFE); `grep bidi-override css/ js/` → 0 hits
- `npm run validate:html` — clean (no markup edits made anywhere)

## Deviations from Plan

None — plan executed exactly as written. (Task 2's red-gate procedure says "copy ja.json"; ja.json does not exist yet — plans 02–05 draft it — so the punct red-gate planted a **temporary** ja.json and deleted it in cleanup. The punct rule is filename-scoped, so this proves the real rule without touching any shipped dictionary.)

## Auth Gates

None.

## Known Stubs

None. Transient by-design state (per plan notes): the switcher lists 20 options while 17 dictionaries do not exist yet — selecting one silently stays EN (D-30 silent degradation). Resolves as dictionary waves land.

## Deferred Items

- Owner-rendered checks (non-blocking, ride the D-06 skim after deploy): computed `line-height` on a paragraph under `lang=ur` shows 2; select keyboard/AT-operable; mirrored layout under `lang=ar`. Recorded in the broken-windows ledger (`.planning/WINDOWS.md`, unrun-verify).
- Urdu Nastaliq real-device rendering verification remains a STATE.md blocker — this plan ships the CSS only.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes. Firestore/analytics untouched.

## Self-Check: PASSED

- FOUND: js/i18n.js (modified), scripts/i18n-detect.test.mjs (created), scripts/i18n-keycheck.mjs (modified), css/base.css (modified), package.json (modified)
- Deferred-commit ledger below lists all changed files; `git status` shows exactly these 5 files + new test file, nothing else.
- All plan must_haves verified: 12/12 truths checked via the test battery, greps, smoke script, and validate chain above.

## Deferred Commits

All code changes UNCOMMITTED — will be committed by /gsd-ship:

- feat(07-01): table-driven locale detection with legacy folds + node:test harness — files: js/i18n.js, scripts/i18n-detect.test.mjs, package.json
- feat(07-01): keycheck hardening — empty-value rejection + CJK half-width punctuation gate — files: scripts/i18n-keycheck.mjs
- feat(07-01): 20-endonym select switcher + RTL dir switching + logical-property CSS — files: js/i18n.js, css/base.css
