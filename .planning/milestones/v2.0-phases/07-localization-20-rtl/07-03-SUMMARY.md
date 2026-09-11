---
phase: 07
plan: 03
subsystem: i18n-dictionaries
tags: [i18n, dictionaries, wave-2, ja, ko, tr, id, cjk-gate, glossary]
requires:
  - js/i18n.js engine wave (07-01 — 20-locale SUPPORTED/ENDONYMS, detect table, hardened keycheck with CJK punct gate)
  - scripts/i18n-surface.mjs (07-02 — 170-key EN baseline dump)
  - App repo glossaries C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/values-{ja,ko,tr,id}/strings.xml
provides:
  - js/i18n/ja.json — 170 keys, です/ます register, brand kept Latin per values-ja, drafted against the LIVE CJK half-width-punctuation gate
  - js/i18n/ko.json — 170 keys, 해요체 register, brand kept Latin (ko exempt from the CJK punct gate per documented 07-01 decision)
  - js/i18n/tr.json — 170 keys, siz register, brand kept Latin
  - js/i18n/id.json — 170 keys, Anda register, brand kept Latin
affects:
  - waves 3-4 (it+pl+nl+vi, then el+bn+ar+ur+zh) reuse the same mine→two-pass→gate pipeline
  - D-06 owner spot check after deploy (ja, ko, tr, id via rendered switcher)
tech-stack:
  added: []            # zero new deps — node built-ins only, npm untouched by this wave
  patterns:
    - glossary mining via node fs utf8 (Pitfall 7) — EN-base keyword probe → same-name lookup in each values-*/strings.xml
    - site mode names mapped to app category strings verbatim (D-07): 国旗/국기/Bayraklar/Bendera, 首都/수도/Başkentler/Ibu Kota, 歴史上の人物/역사적 인물/Tarihi Kişiler/Tokoh Bersejarah, 地図上の都市+島 combined, 歴史的出来事/역사적 사건/Tarihi Olaylar/Peristiwa Sejarah, 美術の中の人物/예술 속 인물/Sanattaki Figürler/Tokoh dalam Seni, 紋章/국장/Armalar/Lambang Negara, ワールドパスポート/세계 여권/Dünya pasaportu/Paspor Dunia
    - two-pass drafting (D-08) + mechanical register sweeps (합니다체/sen/kamu leakage = 0 hits each)
    - CJK gate compliance by dictionary-side value design (full-width punctuation; digit-digit period exception) — gate never weakened
key-files:
  created:
    - js/i18n/ja.json
    - js/i18n/ko.json
    - js/i18n/tr.json
    - js/i18n/id.json
  modified: []
decisions:
  - ja prose keys drop the raw santiagopostorivo@gmail.com (its ASCII dots are not digit-digit → the live CJK gate rejects it); ja values point to the contact form (site's canonical channel carrying the deletion topic) and geohist.about.email (visible text of a mailto link whose href keeps the raw address) becomes the label メールで連絡 — data preserved via href, gate satisfied dictionary-side per the plan prohibition "fix the value, never the rule"
  - brand behavior verified from app per language: values-ja/ko/tr/id app_name are ALL plain "GeoHist Trivia" (no transliteration in any of the four) — Latin brand kept everywhere
  - ko drafted in 해요체 (locked register default) although app values-ko strings lean 합니다체 in places — register comes from the defaults table (Pitfall 9: app is a terminology source, not a register source)
  - ko punctuation uses standard half-width (gate-exempt, matching app values-ko style); ja uses full-width 、。「（）？！ throughout with the single digit-digit period "7.0" surviving via the documented exception
metrics:
  duration: 42 min
  completed: 2026-09-07T05:00Z
  tasks: 2
  files: 4
status: complete
actuals:
  tokens: 48000    # chars/4 over the 4 dictionaries (~15-19k chars each) + glossary mining + gates; plan estimated 72000
  tasks: 2
  commits: 0       # deferred_commit_mode — code left uncommitted; see Deferred Commits
deferred_commit: true
---

# Phase 7 Plan 3: Dictionary Wave 2 — ja · ko · tr · id Summary

Four market-priority dictionaries (Japanese, Korean, Turkish, Indonesian) at exact 170-key parity with the live surface — drafted through the full two-pass process against per-language app-strings.xml glossaries, with ja proving the hardened CJK half-width-punctuation gate workable on real copy (gate green on first full run, never edited).

## What Was Built

### Task 1 (tracer): ja.json — two-pass draft against the live CJK punctuation gate
- **Precondition asserted**: values-ja/ko/tr/id dirs + scripts/i18n-surface.mjs + i18n-keycheck.mjs all present before starting.
- **Glossary mined per D-07** via node fs utf8 (never the pwsh console — Pitfall 7): EN-base keyword probe across `values/strings.xml` (2,395 strings), then same-name lookup in values-ja/ko/tr/id (each also 2,395 strings). Anchors verified verbatim: app_name = "GeoHist Trivia" in ALL FOUR locales (Latin brand everywhere), cat_flags 国の旗/국기/Ülke Bayrakları/Bendera Negara, cat_figures 歴史上の人物/역사적 인물/Tarihi Kişiler/Tokoh Bersejarah, cat_cities+cat_islands 地図上の都市+地図上の島/지도상의 도시+섬/Haritadaki Şehirler+Adalar/Kota di Peta+Pulau di Peta, cat_events 歴史的出来事/역사적 사건/Tarihi Olaylar/Peristiwa Sejarah, cat_art_figures 美術の中の人物/예술 속 인물/Sanattaki Figürler/Tokoh dalam Seni, cat_coat_of_arms 紋章/국장/Armalar/Lambang Negara, passport_title ワールドパスポート/세계 여권/Dünya pasaportu/Paspor Dunia, share_card_stat_streak 連続/연속/SERİ/RENTETAN, ugc_cat_capitals 首都/수도/Başkentler/Ibu Kota.
- **ja.json pass 1**: all 170 keys, です/ます register, Latin brand kept (values-ja app_name is plain "GeoHist Trivia"), full-width Japanese punctuation throughout （、。「」？！：）, mode names = app category terms verbatim, changelog.* chrome translated, entries-notice translated.
- **Live gate result**: keycheck PASS on first full run — zero half-width `,!?:;()"` in any value; exactly ONE value carries an ASCII period (`geohist.faq.devices.a`, "Android 7.0（API 24）") and it sits in digit-digit context, passing via the documented exception. Gate never edited; no version numbers or data stripped (prohibition honored).
- **Pass 2** (fresh re-read): fixed consent.banner.text word order (同意をいただいた場合にのみ…), later also clarified guide.modes.8.desc to パスポートを世界中のスタンプで埋め尽くします. Mechanical polite-ending count: 33 sentence values end in です/ます/ましょう/ください/でしょうか — no plain-form leakage.
- Gates: `npm run validate:i18n` PASS (ja.json @ 170-key surface) + detect tests 23/23. ⚡ Tracer verified end-to-end — expanding.

### Task 2: ko + tr + id — two-pass drafts, wave landing
- **ko.json**: 해요체 register throughout (mechanical sweep for 합니다체 markers 습니다/습니까/하십시오/입니다/됩니까 = **0 hits**; 44 values end in 해요체 forms). Half-width punctuation per app values-ko style (gate-exempt — documented 07-01 decision). Korean single quotes '…' in prose; raw email kept (not gated).
- **tr.json**: siz register with formal plural imperatives (-in/-iniz: Eşleştirin/Bulun/Tahmin edin — matches app values-tr hint style); mechanical sweep for informal sen/seni/sana/senin/seniz = **0 hits**; 12 values carry explicit siz forms. Turkish suffix apostrophes (Postorivo'nun, Play'den, Trivia'yı) consistent ASCII '. Raw email kept.
- **id.json**: Anda register (22 values carry Anda; mechanical sweep for kamu/kau = **0 hits**); rentetan for streak (app RENTETAN, lowercased for prose), Papan Peringkat for leaderboards. Raw email kept.
- **Pass 2 fixes**: ko — 국장 instead of ambiguous 문장 ("sentence") in modes.7.desc, 대장정 spelling, modes.4.desc ending, status.success tense (전송됐어요); tr — mid-sentence lowercase after dash in faq.offline.a; id — removed redundant "mundur ke belakang", naturalized meta.desc; ja — passport-stamp clarity (above). All re-gated green after edits.
- **Length behavior verified** (D-08): total value length vs EN — ja 52%, ko 57% (CJK shrink as expected), tr 108%, id 110% (mild growth, no overflow-prone outliers).
- **Wave = exactly the 4 dictionary files** — git status shows only ja/ko/tr/id added this plan; no markup, no CSS, no engine, no package.json, no sitemap/hreflang changes. Commit deferred per deferred_commit_mode; the planned atomic-wave commit message (below) carries the ko-exemption and brand-behavior notes.

## Verification Results

- `node scripts/i18n-surface.mjs` — 170 keys across 5 pages, exit 0 (baseline for drafting)
- `npm run validate` full chain — **exit 0**: html-validate clean, linkinator green, detect tests **23/23**, keycheck **PASS ×10** (de, es, fr, hi, id, ja, ko, pt-BR, ru, tr — all exactly the 170-key live surface, zero empty values)
- **ja under the live CJK gate**: 0 banned half-width punctuation hits; 1/1 ASCII-period value in digit-digit context ("7.0"); no gate edits, no data stripped
- Register sweeps (node, mechanical): ko 합니다체 0, tr sen-forms 0, id kamu/kau 0; polite-ending counts ko 44 / ja 33
- Glossary cross-check ≥3 terms per language against values-*/strings.xml via node fs utf8 (mode names + brand + passport title verbatim, listed above)
- 6 existing dictionaries byte-untouched: mtimes predate this session (es/pt-BR 2026-09-05, hi/fr/de/ru 07-02 session 03:2x–03:4x); no Write/Edit touched them
- `git status` — only the 4 new dictionary files added by this plan (deferred commit mode: nothing staged)

## Deviations from Plan

1. **[Rule 3 - Blocking issue, fixed dictionary-side] Raw email vs the live CJK gate in ja.json**
   - **Found during:** Task 1
   - **Issue:** `santiagopostorivo@gmail.com` contains ASCII dots not in digit-digit context — the hardened gate (I18N-09, live since 07-01) rejects every ja value carrying it, and the plan forbids weakening the gate or stripping data to go green.
   - **Fix:** ja values reference the contact form (the site's canonical contact channel, which already carries the data-deletion topic) instead of embedding the raw address; `geohist.about.email` — the visible TEXT of a mailto link whose href is unkeyed and keeps the raw address — becomes the Japanese label メールで連絡. The address itself remains live in the href; ko/tr/id keep the raw email like all 6 existing dictionaries (not CJK-gated).
   - **Files modified:** js/i18n/ja.json (4 keys: geohist.faq.deletion.a, geohist.about.email, contact.status.error, contact.deletion.text)
   - **Commit:** deferred (ledger below)
2. **Plan-doc count discrepancy (no action):** plan frontmatter/verify say "PASS naming 11 dictionaries"; actual on-disk count after this wave is **10** JSON dictionaries (6 existing + 4 new — there is no en.json), matching the plan's own Task 2 done-statement "10 of 20 dictionaries gated green". Surface size 170 is correct. Quoted the keycheck-reported numbers here per Pitfall 11.
3. **Deferred-commit adjustment:** plan Task 2 specifies one atomic wave commit + `git show --stat HEAD` verification; deferred_commit_mode replaces this with the planned-commit ledger below (same atomic batch of exactly the 4 files, no commit now). D-06 owner spot check still pending post-deploy.

## Auth Gates

None.

## Known Stubs

None — all 170 values in all 4 files are full translated strings; no placeholders, TODOs, or empty values (gate-enforced + editorially verified in pass 2).

## Deferred Items

- **D-06 owner spot check** for the wave (ja, ko, tr, id through the rendered footer switcher after deploy) — pending; include a native-speaker glance at ja punctuation and the メールで連絡 mailto label (deviation 1), plus the ko 해요체-vs-합니다체 register call.
- Remaining waves: W3 it+pl+nl+vi, W4 el+bn+ar+ur+zh. zh will hit the same email-vs-gate conflict as ja (same PUNCT_LANGS scope) — the dictionary-side pattern from this wave is the precedent.

## Threat Flags

None — data-only JSON additions; no new endpoints, auth paths, file access, or schema changes.

## Self-Check: PASSED

- FOUND: js/i18n/ja.json, js/i18n/ko.json, js/i18n/tr.json, js/i18n/id.json (git status ?? — present on disk)
- FOUND: keycheck PASS ×10 @ 170 keys; `npm run validate` exit 0 (html + links + detect 23/23 + i18n); detect test file untouched
- FOUND: 6 pre-existing dictionaries byte-untouched (mtime evidence above)
- All must_haves verified except the deploy-dependent D-06 owner skim (documented under Deferred Items)

## Deferred Commits

All code changes UNCOMMITTED — will be committed by /gsd-ship:

- feat(07-03): dictionary wave 2 — ja ko tr id at exact 170-key parity, two-pass drafted from app glossaries; ja green under the live CJK half-width-punctuation gate (no gate edits; single digit-digit period "7.0" survives via the documented exception). KO EXEMPTION STANDS: ko.json keeps standard half-width punctuation (common Korean usage, documented 07-01 gate scope). BRAND BEHAVIOR per app: values-ja/ko/tr/id app_name are all plain "GeoHist Trivia" — Latin brand kept in all four. JA NOTE FOR OWNER SPOT CHECK (D-06): raw santiagopostorivo@gmail.com kept out of ja VALUES (ASCII dots fail the CJK gate; href of the mailto link still carries the address; ja prose points to the contact form). — files: js/i18n/ja.json, js/i18n/ko.json, js/i18n/tr.json, js/i18n/id.json
