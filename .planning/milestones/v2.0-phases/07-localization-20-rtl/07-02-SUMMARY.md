---
phase: 07
plan: 02
subsystem: i18n-dictionaries
tags: [i18n, dictionaries, wave-1, hi, de, fr, ru, glossary]
requires:
  - js/i18n.js engine wave (07-01 — SUPPORTED/ENDONYMS at 20, detect table, select switcher)
  - scripts/i18n-keycheck.mjs hardened gate (170-key exact parity + empty-value rejection)
  - App repo glossaries C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/values-{hi,de,fr,ru}/strings.xml
provides:
  - scripts/i18n-surface.mjs — zero-dep key→EN dump of the live 170-key surface (EN baseline for all later waves)
  - js/i18n/hi.json — 170 keys, आप register, brand भू-इतिहास सामान्य ज्ञान (transliterated per values-hi)
  - js/i18n/de.json — 170 keys, Sie register (flagged for owner pass per research Open Question 1)
  - js/i18n/fr.json — 170 keys, vous register, brand kept Latin per values-fr
  - js/i18n/ru.json — 170 keys, lowercase вы register, brand ГеоИст Викторина (transliterated per values-ru)
affects:
  - waves 2-4 (reusable surface dump → glossary mining → two-pass → gate pipeline)
  - D-06 owner spot check after deploy (4 new languages via rendered switcher)
tech-stack:
  added: []            # zero new deps — node built-ins only, npm untouched by this wave
  patterns:
    - glossary mining via node fs utf8 (never pwsh console — Pitfall 7), keyword probe on EN base then name-lookup per locale
    - site mode names mapped verbatim to app category strings (D-07): encyclopedia_cat_flags, ugc_cat_capitals, cat_figures, cat_cities+cat_islands, cat_events, cat_art_figures, encyclopedia_cat_coats_of_arms, passport_title
    - two-pass drafting (D-08): full draft, then fresh re-read + mechanical register sweep (du/dein, tu/ton, capitalized-Вы = 0 hits each)
    - person name + email kept Latin in all 4 (matches es/pt-BR precedent; searchable owner identity)
key-files:
  created:
    - js/i18n/hi.json
    - js/i18n/de.json
    - js/i18n/fr.json
    - js/i18n/ru.json
  modified: []
decisions:
  - de drafted in Sie (safe general-audience default); app values-de is mixed-register (58 Sie / 40 du) so used for TERMINOLOGY only — Sie-vs-du explicitly flagged for the D-06 owner spot check
  - site mode names rendered with app glossary verbatim (e.g. site EN "Events in time" → de "Historische Ereignisse" / fr "Événements historiques" / ru "Исторические события" / hi "ऐतिहासिक घटनाएँ") — D-07 wording-over-literalism
  - "Cities & islands" combined from the app's two adjacent categories (Cities on the Map + Islands on the Map) using their locale terms
  - brand behavior followed the app per language: hi/ru transliterate, de/fr keep "GeoHist Trivia" Latin (verified from each values-*/app_name)
  - scripts/i18n-surface.mjs from the dead prior attempt was validated (170 keys, exit 0, drift guard, node built-ins only) and kept byte-unchanged — zero fixes needed
metrics:
  duration: 41 min
  completed: 2026-09-07T04:05Z
  tasks: 3
  files: 5
status: complete
actuals:
  tokens: 52000    # chars/4 over the 4 dictionaries (~17.5k chars each) + surface re-validation; plan estimated 78000
  tasks: 3
  commits: 0       # deferred_commit_mode — code left uncommitted; see Deferred Commits
deferred_commit: true
---

# Phase 7 Plan 2: Dictionary Wave 1 — hi · de · fr · ru Summary

Four market-priority dictionaries (Hindi, German, French, Russian) at exact 170-key parity with the live surface — drafted through the full two-pass process with per-language app-strings.xml glossaries, gated green by the hardened keycheck, plus the validated zero-dep surface-dump helper that every later wave reuses.

## What Was Built

### Task 1 (tracer): Surface helper validated + hi.json
- `scripts/i18n-surface.mjs` (pre-existing from a dead prior attempt) **validated, kept unchanged**: extracts key→EN-text from the 5 keyed pages mirroring the keycheck's extraction semantics, decodes entities, normalizes whitespace, warns on cross-page text drift, and fails if any declared key produced no text. Ran clean: **170 keys across 5 pages, exit 0, no warnings, node built-ins only** (`node:fs`, `node:path`, `node:url` — zero npm imports).
- Output captured as the EN drafting baseline (no en.json exists — the dump IS the EN).
- **Glossary mined per D-07** via node fs utf8 (never the pwsh console): keyword probe on `values/strings.xml` (EN base) to locate string names, then per-locale lookup in values-hi. Anchors used: `app_name` भू-इतिहास सामान्य ज्ञान, `encyclopedia_cat_flags` झंडे, `ugc_cat_capitals` राजधानियाँ, `cat_figures` ऐतिहासिक हस्तियां, `cat_cities`/`cat_islands` नक्शे पर शहर/द्वीप, `cat_events` ऐतिहासिक घटनाएँ, `cat_art_figures` कला में हस्तियां, `encyclopedia_cat_coats_of_arms` राजचिह्न, `passport_title` विश्व पासपोर्ट, `share_card_stat_streak` स्ट्रीक.
- **hi.json**: 170 keys, आप-register throughout (लीजिए/कीजिए imperatives; सकते हैं polite forms; gender-neutral question phrasing), fullwidth danda endings, changelog.* chrome keys translated, entry-content exception respected.
- **Pass 2** (fresh re-read): fixed `ऐतिहासिक हस्तियां`→`हस्तियाँ` (long-i stem agreement in both mode names), "पहले अभियान से पहले"→"अपने पहले अभियान से पहले" (duplication), gallery map caption `मैप मोड`→`नक्शा मोड` (aligned with app's नक्शा vocabulary).
- Gate green: keycheck PASS hi.json @ 170; detect tests 23/23.

### Task 2: de.json + fr.json — two-pass drafts with register handling
- **Glossaries mined** (same node-fs pipeline): de Flaggen/Hauptstädte/Historische Persönlichkeiten/Städte auf der Karte+Inseln auf der Karte/Historische Ereignisse/Figuren in der Kunst/Wappen/Weltpass/Bestenliste + brand kept Latin (app_name = "GeoHist Trivia"); fr Drapeaux/Capitales/Figures historiques/Villes sur la carte+Îles sur la carte/Événements historiques/Figures dans l'art/Armoiries/Passeport mondial/classements + brand kept Latin. de used for **terminology only** (Pitfall 9 — file is 58 Sie / 40 du mixed).
- **de.json**: Sie register throughout; German „…“ quotes; UI-fitting compression on long EN strings (feature card, FAQ answers); `SERIE` app term for streak. **Pass 2**: mechanical sweep `\b(du|dein*|Dir|Dich)\b` = **0 hits**; re-read fixed 3 phrasings (meta.desc "erraten Sie sich rund um"→"raten Sie sich durch die Welt"; modes.intro "Brille auf"→"ein eigener Blick auf"; closing "Ticket nach"→"Ticket zu Google Play").
- **fr.json**: vous register; French typographic conventions (' apostrophes, espace insécable pattern " ?", « » quotes) matching the app's fr file style. **Pass 2**: mechanical sweep `\b(tu|ton|ta|tes|toi)\b` = **0 hits**; re-read clean (no edits needed).
- Gate green: keycheck PASS de.json + fr.json @ 170.

### Task 3: ru.json + atomic wave landing
- **Glossary mined** from values-ru: Флаги/Столицы/Исторические личности/Города на карте+Острова на карте/Исторические события/Фигуры в искусстве/Гербы/Всемирный паспорт/таблицы лидеров; brand transliterated **ГеоИст Викторина** (app_name).
- **ru.json**: lowercase вы register throughout (mechanical sweep for capitalized `Вы|Вас|Вам|Ваш*` = **0 hits**); « » quotes; ё where standard (Платёжными, счёт, чём, весёлая). **Pass 2**: re-read fixed 3 phrasings (hub.intro.1 "созданным, чтобы служить весь путь"; modes.2.desc "мыслит глобально"; closing "а также ваш билет").
- **Wave = 5 files** (surface helper + 4 dictionaries), nothing else touched — verified via git status: no markup, no CSS, no engine, no sitemap/hreflang, no package.json change from this wave. Commit deferred per deferred_commit_mode; the planned atomic-wave commit message carries the de-Sie owner flag.

## Verification Results

- `node scripts/i18n-surface.mjs` — 170 keys, exit 0 (twice: before drafting, and re-run during drafting)
- `npm run validate` full chain — **exit 0**: html-validate clean, linkinator 18 links 200s, detect tests **23/23**, keycheck **PASS ×6** (de, es, fr, hi, pt-BR, ru — all exactly the 170-key live surface, zero empty values)
- Register sweeps (node, mechanical): de du-forms 0, fr tu-forms 0, ru capitalized-Вы 0
- Glossary cross-check ≥3 terms per language against values-*/strings.xml via node fs utf8 (mode names + brand + passport title all verbatim)
- `git diff --stat js/i18n/es.json js/i18n/pt-BR.json` — empty (byte-untouched); package.json diff pre-existing from 07-01 only
- No new directories, no .html changes — dictionary-swap architecture intact (I18N-10 untouched)

## Deviations from Plan

None blocking. Notes:

1. **Surface helper provenance**: plan said "create scripts/i18n-surface.mjs"; it already existed from a dead prior attempt. Validated against every acceptance criterion (170-key count, zero deps, extraction semantics mirroring keycheck) and kept byte-unchanged — better than rewriting, same artifact.
2. **Site mode names ≠ app mode names in EN**: the app calls the modes Country Flags / Capitals / Historical Figures / Historical Events / Figures in Art; the site paraphrases ("Flags / Capitals / Map figures / Events in time / Art detective"). Applied D-07 verbatim-glossary rule to the app's terminology, not a literal translation of the site paraphrase — documented as a decision above.
3. **Deferred-commit adjustment**: plan Task 3 specifies "one atomic wave commit" + `git log` verification; deferred_commit_mode replaces this with the planned-commit ledger below (same atomic batch, no commit now). Owner spot check (D-06) still pending on the deployed site.

## Auth Gates

None.

## Known Stubs

None — all 170 values in all 4 files are full translated strings; no placeholders, TODOs, or empty values (gate-enforced + editorially verified).

## Deferred Items

- **D-06 owner spot check** for the wave (hi, de, fr, ru through the rendered footer switcher after deploy) — pending; include the **de register question (Sie vs du)** explicitly per research Open Question 1 and the STATE.md register-table blocker.
- Remaining waves: W2 ja+ko+tr+id, W3 it+pl+nl+vi, W4 el+bn+ar+ur+zh.

## Threat Flags

None — data-only JSON additions; no new endpoints, auth paths, file access, or schema changes.

## Self-Check: PASSED

- FOUND: js/i18n/hi.json, js/i18n/de.json, js/i18n/fr.json, js/i18n/ru.json, scripts/i18n-surface.mjs
- FOUND: keycheck PASS ×6 @ 170 keys; validate chain exit 0; es.json/pt-BR.json byte-untouched
- All must_haves verified except the deploy-dependent owner skim (documented under Deferred Items).

## Deferred Commits

All code changes UNCOMMITTED — will be committed by /gsd-ship:

- feat(07-02): dictionary wave 1 — hi de fr ru at exact 170-key parity, two-pass drafted from app glossaries. DE REGISTER NOTE FOR OWNER SPOT CHECK (D-06): de.json drafted in Sie as the safe general-audience default — the app's values-de mixes registers (58 Sie / 40 du) and was used for terminology only. — files: scripts/i18n-surface.mjs, js/i18n/hi.json, js/i18n/de.json, js/i18n/fr.json, js/i18n/ru.json
