---
phase: 07
plan: 04
subsystem: i18n-dictionaries
tags: [i18n, dictionaries, wave-3, it, pl, nl, vi, glossary, length-stress]
requires:
  - js/i18n.js engine wave (07-01 — 20-locale SUPPORTED/ENDONYMS, detect table, hardened keycheck)
  - scripts/i18n-surface.mjs (07-02 — 170-key EN baseline dump)
  - App repo glossaries C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/values-{it,pl,nl,vi}/strings.xml
provides:
  - js/i18n/it.json — 170 keys, tu register (game convention, 0 Lei-form leakage), brand Latin per values-it
  - js/i18n/pl.json — 170 keys, Ty register (lowercase ty/twoich; 0 Pan/Pani; 0 gendered 2sg past), brand Latin
  - js/i18n/nl.json — 170 keys, je register (31 je-forms, 0 u-forms), brand Latin
  - js/i18n/vi.json — 170 keys, pronoun-avoidant register (0 real personal pronouns), 109.2% total length vs EN — length-stress case passed
affects:
  - wave 4 (el+bn+ar+ur+zh) reuses the same mine→two-pass→gate pipeline; zh will hit the ja-style email-vs-CJK-gate conflict (precedent documented in 07-03)
  - D-06 owner spot check after deploy (it, pl, nl, vi via rendered switcher)
tech-stack:
  added: []            # zero new deps — node built-ins only, npm untouched by this wave
  patterns:
    - glossary mining via node fs utf8 (Pitfall 7) — EN-base keyword probe → same-name lookup in each values-*/strings.xml
    - site mode names mapped to app category strings verbatim (D-07): it Bandiere/Capitali/Figure storiche/Città e isole sulla mappa/Eventi storici/Figure nell'arte/Stemmi/Passaporto mondiale; pl Flagi/Stolice/Postacie historyczne/Miasta i wyspy na mapie/Wydarzenia historyczne/Postacie w sztuce/Herby/Paszport świata; nl Vlaggen/Hoofdsteden/Historische figuren/Steden en eilanden op de kaart/Historische gebeurtenissen/Figuren in de Kunst/Wapenschilden/Wereldpaspoort; vi Cờ/Thủ đô/Nhân vật lịch sử/Thành phố và đảo trên bản đồ/Sự kiện lịch sử/Nhân vật trong nghệ thuật/Huy hiệu/Hộ chiếu thế giới
    - two-pass drafting (D-08) + mechanical register sweeps (Lei leakage 0, Pan/Pani 0, real gendered 2sg 0, u-form 0, Unicode-\b pronoun count 0)
    - length-ratio gate (research guidance): total-value length vs EN it 115.6% / pl 106.1% / nl 109.5% / vi 109.2%; vi 5 longest prose values 91–119% of EN (no 2x blowups)
key-files:
  created:
    - js/i18n/it.json
    - js/i18n/pl.json
    - js/i18n/nl.json
    - js/i18n/vi.json
  modified: []
decisions:
  - brand behavior verified from app per language: values-it/pl/nl/vi app_name are ALL plain "GeoHist Trivia" (no transliteration) — Latin brand kept in all four
  - vi nav/footer changelog label shortened to "Cập nhật" (8 spots) to keep the nav row compact; the noun "Nhật ký thay đổi" survives only in changelog.meta.desc prose
  - pl drafted gender-neutral (Polish ty is genderless in imperative/present, but 2sg past-tense is gendered) — progress.a uses impersonal "zostawiono", contact.intro rephrased pronoun-free; mechanical sweep for -łeś/-łaś real hits = 0 (JS ASCII \b false-positives on "Właśnie" excluded via manual check)
  - vi register per defaults table (avoid pronouns), NOT per the app (values-vi uses bạn 76×) — Pitfall 9 applied: app is terminology source, not register source
  - it guide.modes.6.name "Figure nell'arte" normalizes the app's typographic apostrophe (U+2019) to straight U+0027 for file-wide apostrophe consistency; wording stays app-verbatim
metrics:
  duration: 40 min
  completed: 2026-09-07T02:20Z
  tasks: 2
  files: 4
status: complete
actuals:
  tokens: 52000    # chars/4 over the 4 dictionaries (~15-16k chars each) + glossary mining + gates; plan estimated 68000
  tasks: 2
  commits: 0       # deferred_commit_mode — code left uncommitted; see Deferred Commits
deferred_commit: true
---

# Phase 7 Plan 4: Dictionary Wave 3 — it · pl · nl · vi Summary

Four Latin-script European + Vietnamese dictionaries at exact 170-key parity with the live surface — drafted through the full two-pass process against per-language app-strings.xml glossaries, with vi (the length-stress case) landing at 109.2% of EN total and zero personal pronouns.

## What Was Built

### Task 1 (tracer): it.json — two-pass draft on the proven pipeline
- **Precondition asserted**: values-it/pl/nl/vi dirs + scripts/i18n-surface.mjs + i18n-keycheck.mjs all present before starting.
- **Glossary mined per D-07** via node fs utf8 (never the pwsh console — Pitfall 7): EN-base keyword probes across values/strings.xml (2,425 strings), same-name lookup in values-it/pl/nl/vi (2,395 strings each). Anchors verified verbatim: app_name = "GeoHist Trivia" in ALL FOUR locales (Latin brand everywhere); cat_flags Bandiere dei paesi/Flagi państw/Landvlaggen/Cờ các quốc gia; ugc_cat_capitals Capitali/Stolice/Hoofdsteden/Thủ đô; cat_figures Figure storiche/Postacie historyczne/Historische figuren/Nhân vật lịch sử; cat_cities+cat_islands Città+Isole sulla mappa/Miasta+Wyspy na mapie/Steden+Eilanden op de kaart/Thành phố+Đảo trên bản đồ; cat_events Eventi storici/Wydarzenia historyczne/Historische gebeurtenissen/Sự kiện lịch sử; cat_art_figures Figure nell'arte/Postacie w sztuce/Figuren in de Kunst/Nhân vật trong nghệ thuật; cat_coat_of_arms Stemmi/Herby/Wapenschilden/Huy hiệu; passport_title Passaporto mondiale/Paszport świata/Wereldpaspoort/Hộ chiếu thế giới; share_card_stat_streak SERIE/SERIA/REEKS/CHUỖI.
- **Register scans** (grep-count on app files): it tu-forms 50 vs Lei 17; pl Ty-forms 24 vs Pan 4; nl je 94 vs u 1 — all three match the defaults table (research register table confirmed by app data); vi app uses bạn 76× but the defaults table says pronoun-avoidant → table wins (Pitfall 9).
- **it.json pass 1**: all 170 keys, tu register, Latin brand kept, «» quoting, mode names = app category terms verbatim, changelog.* chrome translated. Gate: keycheck PASS on first run; detect tests 23/23. ⚡ Tracer verified end-to-end — expanding.
- **it.json pass 2** (fresh re-read): 3 fixes — about.body gender agreement (trivia è pubblicato, the game is published), "footer" anglicism → "piè di pagina", step.3 carries the app streak term "serie". Mechanical sweeps: Lei/Loro/Sua leakage **0**, tu-form hits 17, mojibake 0. Length 115.6% of EN.

### Task 2: pl + nl + vi — two-pass drafts, vi length stress
- **pl.json**: Ty register (lowercase twoim/twoich/twoją per Polish orthography; 6 explicit Ty-pronoun hits + Tu-imperatives throughout; Pan/Pana/Pani leakage **0**; gendered 2sg past real hits **0** — the two regex hits were JS ASCII-\b false positives on "Właśnie"). Polish quotes „ ”. Length 106.1%. Pass 2 fix: meta.desc "podróżując po świecie i przez czas" → "zgaduj na całym świecie i podróżuj w czasie".
- **nl.json**: je register (31 je/jij/jouw hits; u-form leakage **0**). Length 109.5%. Pass 2 fix: closing.text "het hele snelle cursusje" → "het hele spoedcursusje" (EN "crash course" = spoedcursus; the first draft misread as "fast course"). App verbatim "Figuren in de Kunst" kept with its title case (D-07 verbatim).
- **vi.json** (length-stress case): pronoun-avoidant register — **0 real personal pronouns** (bạn/tôi/mình/chúng ta/anh/chị/em — Unicode-\b verified; the naive ASCII-\b scan's 12 "ông" hits were all inside "không", false positives). Imperative + impersonal constructions throughout ("Vui lòng nhập…", passive "đều được lưu ngay trên thiết bị", "không bao giờ xem xét dữ liệu… của người chơi"). **Length behavior**: total 109.2% of EN (inside the 20–35% growth envelope); the 5 longest prose values run **91–119% of EN** — no 2x blowups. The only >155% values are micro-labels where % is meaningless (FAQ→"Hỏi đáp" 3→7 chars; nav.game 4→8) — structural term-length, not overflow risk. Pass 2 fixes: hub.meta.desc "nơi lưu trú" (lodging) → "trang chủ"; "nhanh nhẹn" → "nhanh gọn" (×2); nav/footer changelog label "Nhật ký thay đổi" → "Cập nhật" (8 spots) to keep the nav row compact — the noun survives in changelog.meta.desc.
- **Raw email kept** in all 4 dictionaries (contact.deletion.text, contact.status.error, geohist.faq.deletion.a carry santiagopostorivo@gmail.com; geohist.about.email is the visible mailto text) — none of these locales is CJK-gated, matching all 8 pre-existing non-ja dictionaries.
- **Wave = exactly the 4 dictionary files** — no markup, no CSS, no engine, no package.json, no sitemap/hreflang changes. Commit deferred per deferred_commit_mode; planned atomic-wave commit message in the ledger below carries the vi length-behavior note.

## Verification Results

- `node scripts/i18n-keycheck.mjs` — **PASS ×14** @ the 170-key live surface (de, es, fr, hi, id, it, ja, ko, nl, pl, pt-BR, ru, tr, vi), zero empty values
- `node scripts/i18n-detect.test.mjs` — 23/23 pass
- `npm run validate` — **exit 0** (html-validate + linkinator + detect tests + keycheck chain)
- Register sweeps (mechanical, node): it Lei 0 / tu 17; pl Pan-family 0 / Ty-forms present; nl u-form 0 / je 31; vi real pronoun count 0
- Length ratios vs EN (D-08): it 115.6% · pl 106.1% · nl 109.5% · vi 109.2%; vi top-5 longest 91–119%
- Glossary cross-check ≥3 terms per language against values-*/strings.xml via node fs utf8 (mode names ×8 + streak + passport + brand per locale, verbatim list above)
- Diacritics intact: it à/è/é/ì/ò/ù, pl ą/ć/ę/ł/ń/ó/ś/ź/ż, nl è/ï/é, vi tone marks — 0 replacement characters (U+FFFD) in any of the 4 files
- 10 pre-existing dictionaries byte-untouched: mtimes 2026-09-05 20:5x (es, pt-BR) and 2026-09-07 00:28–01:30 (de, fr, hi, ru, ja, ko, tr, id — waves 1-2); wave-3 writes 01:58–02:07; no Write/Edit touched them
- `git status` — this plan adds only js/i18n/it.json, pl.json, nl.json, vi.json (everything else in the working tree predates this plan: deferred waves 0-2 uncommitted per deferred_commit_mode)

## Deviations from Plan

1. **Deferred-commit adjustment:** plan Task 2 specifies one atomic wave commit + `git show --stat HEAD` verification; deferred_commit_mode replaces this with the planned-commit ledger below (same atomic batch of exactly the 4 files, no commit now). D-06 owner spot check still pending post-deploy.
2. **I18N-05 not marked complete:** plan frontmatter carries `requirements: [I18N-05]`, but I18N-05 = all 17 new dictionaries at parity — this wave reaches 14 of 20 dictionaries. Marking it complete would be false; it stays open until wave 4 lands. (07-03 precedent: requirement not marked there either.)
3. **vi length note:** ~36 short labels exceed 155% of EN (e.g. "FAQ"→"Hỏi đáp" 233% on a 3-char string) — the plan's no-2x-blowup criterion applies to the 5 LONGEST values, which sit at 91–119%. Vietnamese term-length growth on micro-labels is structural; nav row verified label lengths ≤ "Chính sách quyền riêng tư" (footer, standard term).

## Auth Gates

None.

## Known Stubs

None — all 170 values in all 4 files are full translated strings; no placeholders, TODOs, or empty values (gate-enforced + editorially verified in pass 2).

## Deferred Items

- **D-06 owner spot check** for the wave (it, pl, nl, vi through the rendered footer switcher after deploy) — pending; include a native-speaker glance at vi pronoun-avoidant phrasing and pl gender-neutral impersonals.
- Remaining wave: W4 el+bn+ar+ur+zh. zh will hit the same email-vs-gate conflict as ja (same PUNCT_LANGS scope) — the 07-03 dictionary-side pattern is the precedent.
- I18N-05 requirement completes when wave 4 lands (17/17).

## Threat Flags

None — data-only JSON additions; no new endpoints, auth paths, file access, or schema changes.

## Self-Check: PASSED

- FOUND: js/i18n/it.json, pl.json, nl.json, vi.json on disk (git status ??)
- FOUND: keycheck PASS ×14 @ 170 keys; `npm run validate` exit 0; detect tests 23/23
- FOUND: 10 pre-existing dictionaries byte-untouched (mtime evidence above)
- All must_haves verified except the deploy-dependent D-06 owner skim (documented under Deferred Items)

## Deferred Commits

All code changes UNCOMMITTED — will be committed by /gsd-ship:

- feat(07-04): dictionary wave 3 — it pl nl vi at exact 170-key parity, two-pass drafted from app glossaries; VI LENGTH CHECK: total 109.2% of EN, 5 longest values 91–119% (no 2x blowups). REGISTERS: it tu (0 Lei leakage), pl Ty (0 Pan/Pani, gender-neutral impersonals), nl je (0 u-forms), vi pronoun-avoidant (0 real personal pronouns, Unicode-\b verified). BRAND BEHAVIOR per app: values-it/pl/nl/vi app_name are all plain "GeoHist Trivia" — Latin brand kept in all four. — files: js/i18n/it.json, js/i18n/pl.json, js/i18n/nl.json, js/i18n/vi.json
