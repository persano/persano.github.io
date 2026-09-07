---
plan: 07-05-dicts-wave4-el-bn-ar-ur-zh
phase: 07-localization-20-rtl
status: complete
deferred_commit: true
started: 2026-09-07
completed: 2026-09-07
---

# 07-05 — Dictionary Wave 4: el · bn · ar · ur · zh (20/20 complete)

## What Was Built

Final dictionary batch completing the 20-language surface (19 JSON files; en = raw-HTML
baseline per D-28). All five languages at exact 170-key parity, two-pass drafted against
the app-strings.xml glossaries (D-07 mode names verbatim, per-language registers).

**NOTE — fragmented execution:** five executor sessions died mid-run (empty/truncated
returns on this runtime); the orchestrator completed the wave via single-dictionary
dispatches. Every file below was still produced through the plan's two-pass process.

| File | Register | Notes |
|------|----------|-------|
| js/i18n/ar.json | MSA فصحى، أنت | RTL language; pass-2 revision (calque fixes, glossary verified verbatim, 0 bidi control chars) |
| js/i18n/el.json | εσείς formal | D-07 violations fixed in pass-2 (Κατάργηση διαφημίσεων, σερί); glossary verbatim |
| js/i18n/bn.json | আপনি | Danda । prose endings; Bengali numerals for literals; glossary verbatim + transliterated passport |
| js/i18n/ur.json | آپ | RTL language; 12 editorial pass-2 fixes; 0 ASCII punct in Urdu runs; glossary verbatim (2395 strings mined) |
| js/i18n/zh.json | 您 | Simplified per D-03; CJK gate green (only ASCII period = `7.0` digit-digit); email → contact-form reference (ja precedent) |

## Verification

- `npm run validate` — exit 0; `i18n-keycheck` PASS ×19 @ exact 170-key parity, 0 empty values
- `node scripts/i18n-detect.test.mjs` — 23/23 pass
- CJK gate proven live on real zh content: zero half-width `,!?:;()"`
- Pre-existing 14 dictionaries byte-untouched (this wave touched only the 5 new files)

## Deviations

1. **Five dead executor sessions** (empty/truncated task returns on this runtime) — work
   recovered via resume-dispatches; final wave executed as single-dictionary micro-plans
   (bn → ur → zh → ar/el pass-2). No work lost; all files verified by the same gates.
2. **zh 您 default flagged** (recorded choice): app values-zh is inconsistent (你=59 vs
   您=22) — plan rule picked 您; owner should confirm at spot-check.
3. **zh/el brand divergence noted**: zh uses localized app_name 地史知识问答 (matches
   hi/ru/ar precedent); el keeps Latin "GeoHist Trivia" (app values-el brand is Latin).
   Both are app-source-faithful; owner pass confirms.
4. Deferred-commit mode replaces the plan's atomic wave commit (below).

## Deferred Commits (for /gsd-ship)

- `feat(07-05): dictionary wave 4 — el bn ar ur zh, 20/20 localization surface complete` - files: js/i18n/el.json, js/i18n/bn.json, js/i18n/ar.json, js/i18n/ur.json, js/i18n/zh.json

## Owner Items (D-06 spot check, post-deploy)

- ur device render (Nastaliq line-height visual check) + ar mirror check via rendered switcher
- zh 您 vs 你 confirmation
- el Κατάργηση/σερί spot-read

## Self-Check: PASSED

All gates green; must_haves satisfied for wave 4; I18N-05 surface complete (20/20).
