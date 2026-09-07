---
phase: 07-localization-20-rtl
plan: 06
type: execute
wave: 6
depends_on: ["07-05"]
files_modified:
  - geohist/index.html
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
autonomous: true
gap_closure: true
gap_ids: [G-07-5a]
requirements: [I18N-05, I18N-09]
user_setup: []

estimate:
  tokens: 24000
  raw_tokens: 12000
  tasks: 2
  confidence: low

must_haves:
  truths:
    - "FAQ answer 'What languages is the game available in?' states the count-style enumeration ('... and 16 more languages' form) in EN baseline and in all 19 locale dictionaries"
    - "npm run validate exits 0: html-validate clean, linkinator 200s, 23/23 detect tests, keycheck PASS ×19 at exact 170-key parity with zero empty values"
    - "Key surface unchanged — no key added, removed, renamed; only geohist.faq.languages.a values (and the EN HTML baseline) differ from pre-plan state"
  artifacts:
    - "geohist/index.html (line 142 <p data-i18n=\"geohist.faq.languages.a\"> text updated)"
    - "js/i18n/*.json — all 19 files, geohist.faq.languages.a value updated"
  key_links:
    - "geohist/index.html EN baseline ↔ scripts/i18n-surface.mjs (extracts baseline from HTML — value change must not break extraction)"
    - "js/i18n/ja.json + zh.json values ↔ CJK half-width punct gate in scripts/i18n-keycheck.mjs (full-width 、 and 。 only; no ASCII [,!?:;\"])"
    - "js/i18n/ur.json value ↔ RTL punctuation convention (Arabic comma ، U+060C, Urdu full stop ۔ U+06D4 preserved)"
---

<objective>
Close UAT gap G-07-5a (minor, content staleness): `geohist.faq.languages.a` still says "English, Spanish, Portuguese and more" — authored in Phase 2 when the site had 3 languages; the site now serves 20. Update the EN baseline (geohist/index.html:142) to the user-approved count-style phrasing and update the same key in all 19 dictionaries with equivalent count-style phrasing per locale register. Value text only — key set must NOT change.

Purpose: FAQ copy must reflect the actual 20-language surface; Play reviewers and players reading any of the 20 languages get accurate information.
Output: 20 changed values (1 EN HTML baseline + 19 dictionary values), validate chain green.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/phases/07-localization-20-rtl/07-UAT.md (gap G-07-5a at bottom — root cause, decision)
@geohist/index.html (line 142 — EN baseline)
@js/i18n/keycheck README header: scripts/i18n-keycheck.mjs (CJK gate scope: ja + zh only, ko exempt)
</context>

<tasks>

<task type="auto">
  <name>Task 1: EN baseline — count-style phrasing in geohist/index.html:142</name>
  <files>geohist/index.html</files>
  <action>
Per UAT decision (user-approved count style, answered 2026-09-07): in geohist/index.html line 142, replace the inner text of the paragraph `<p data-i18n="geohist.faq.languages.a">English, Spanish, Portuguese and more.</p>` so it reads:

`English, Spanish, Portuguese and 16 more languages.`

Edit ONLY the text between the tags. Do not touch the data-i18n attribute, surrounding FAQ items, or any other line. The old value "English, Spanish, Portuguese and more." appears exactly once in the repo (verified), so a targeted substring edit is unambiguous.

The number is 16 per the locked user decision ("3 existing + 16 more = 20 total") — do not substitute 17 or any other figure.
  </action>
  <verify>
    <automated>rg -n "English, Spanish, Portuguese and 16 more languages." geohist/index.html && rg -c "Portuguese and more" geohist/index.html; if [ $? -eq 0 ]; then echo "FAIL: old value still present"; exit 1; else echo "OK: old value gone"; fi</automated>
  </verify>
  <done>geohist/index.html:142 reads "English, Spanish, Portuguese and 16 more languages." and the old "and more" phrasing is gone from the file.</done>
</task>

<task type="auto">
  <name>Task 2: 19 dictionaries — count-style geohist.faq.languages.a per locale, then full validate chain</name>
  <files>js/i18n/es.json, js/i18n/pt-BR.json, js/i18n/de.json, js/i18n/fr.json, js/i18n/hi.json, js/i18n/ru.json, js/i18n/ja.json, js/i18n/ko.json, js/i18n/tr.json, js/i18n/id.json, js/i18n/it.json, js/i18n/nl.json, js/i18n/pl.json, js/i18n/vi.json, js/i18n/el.json, js/i18n/bn.json, js/i18n/ar.json, js/i18n/ur.json, js/i18n/zh.json</files>
  <action>
Update ONLY the value of key `geohist.faq.languages.a` in each of the 19 files below, to exactly the listed new value. Each file's current value is given as old — use it as the Edit oldString anchor (each old value is unique within its file). Replace only the value text between the JSON quotes: never rewrite the whole file (files are CRLF, 2-space indent, one key per line — a whole-file rewrite would mangle line endings and risk reordering), never touch the `.q` sibling key, and never touch any other key.

Digits: use Latin digits `16` in every locale — verified convention (ar/ur/hi dictionaries already use Latin digits exclusively; bn uses Latin digits in 32 places vs 4 native).

Exact per-file replacements (old → new):

| File | Old value | New value |
|------|-----------|-----------|
| es.json | Inglés, español, portugués y más. | Inglés, español, portugués y 16 idiomas más. |
| pt-BR.json | Inglês, espanhol, português e mais. | Inglês, espanhol, português e mais 16 idiomas. |
| de.json | Englisch, Spanisch, Portugiesisch und mehr. | Englisch, Spanisch, Portugiesisch und 16 weitere Sprachen. |
| fr.json | Anglais, espagnol, portugais et plus encore. | Anglais, espagnol, portugais et 16 autres langues. |
| hi.json | अंग्रेज़ी, स्पेनिश, पुर्तगाली और भी बहुत कुछ। | अंग्रेज़ी, स्पेनिश, पुर्तगाली और 16 अन्य भाषाएँ। |
| ru.json | Английский, испанский, португальский и другие. | Английский, испанский, португальский и ещё 16 языков. |
| ja.json | 英語、スペイン語、ポルトガル語、そのほかの言語。 | 英語、スペイン語、ポルトガル語、ほか16言語。 |
| ko.json | 영어, 스페인어, 포르투갈어 등이에요. | 영어, 스페인어, 포르투갈어 외 16개 언어예요. |
| tr.json | İngilizce, İspanyolca, Portekizce ve dahası. | İngilizce, İspanyolca, Portekizce ve 16 dil daha. |
| id.json | Bahasa Inggris, Spanyol, Portugis, dan lainnya. | Bahasa Inggris, Spanyol, Portugis, dan 16 bahasa lainnya. |
| it.json | Inglese, spagnolo, portoghese e altro. | Inglese, spagnolo, portoghese e altre 16 lingue. |
| nl.json | Engels, Spaans, Portugees en meer. | Engels, Spaans, Portugees en 16 andere talen. |
| pl.json | Angielski, hiszpański, portugalski i więcej. | Angielski, hiszpański, portugalski i 16 innych języków. |
| vi.json | Tiếng Anh, tiếng Tây Ban Nha, tiếng Bồ Đào Nha và nhiều hơn nữa. | Tiếng Anh, tiếng Tây Ban Nha, tiếng Bồ Đào Nha và 16 ngôn ngữ khác. |
| el.json | Αγγλικά, ισπανικά, πορτογαλικά και άλλες. | Αγγλικά, ισπανικά, πορτογαλικά και άλλες 16 γλώσσες. |
| bn.json | ইংরেজি, স্প্যানিশ, পর্তুগিজ এবং আরও অনেক ভাষা। | ইংরেজি, স্প্যানিশ, পর্তুগিজ এবং আরও 16টি ভাষা। |
| ar.json | الإنجليزية والإسبانية والبرتغالية والمزيد. | الإنجليزية والإسبانية والبرتغالية و16 لغة أخرى. |
| ur.json | انگریزی، ہسپانوی، پرتگیزی اور مزید۔ | انگریزی، ہسپانوی، پرتگیزی اور 16 مزید زبانیں۔ |
| zh.json | 英语、西班牙语、葡萄牙语等。 | 英语、西班牙语、葡萄牙语等16种语言。 |

Punctuation gates that MUST hold (per scripts/i18n-keycheck.mjs):

- ja.json and zh.json (CJK gate scope — ASCII `[,!?:;()"]` banned, loose period banned): new ja value uses full-width 、 (U+3001) enumerators and ends with 。 (U+3002); new zh value same — 、 enumerators, 。 terminator, no spaces inside. Latin digit 16 is legal (digit-period exception already documented for 0.88). ko.json is gate-exempt (half-width comma, as current).
- ur.json: keep Arabic-script punctuation — enumerator ، (U+060C Arabic comma, as current) and terminator ۔ (U+06D4 Urdu full stop, as current).
- bn.json and hi.json: keep danda । terminator (as current values).

Register notes already locked in prior waves and preserved here: ko stays 해요체 ("언어예요"), vi stays pronoun-avoidant, de stays Sie-implied neutral (no pronoun in this value).

After all 19 edits, run the full validation chain. html-validate/linkinator/detect must be unaffected (i18n-surface.mjs re-extracts the EN baseline from Task 1's HTML — value change is safe) and keycheck must stay at exact 170-key parity with zero empty values.
  </action>
  <verify>
    <automated>npm run validate && node -e "const fs=require('fs');let bad=0;for(const f of fs.readdirSync('js/i18n')){const v=JSON.parse(fs.readFileSync('js/i18n/'+f,'utf8'))['geohist.faq.languages.a'];if(!v||!v.includes('16')){console.log('MISSING count-style:',f);bad++}}process.exit(bad===0?0:1)" && echo "OK: all 19 count-style"</automated>
  </verify>
  <done>npm run validate exits 0 (html-validate clean, linkinator 200s, 23/23 detect, keycheck PASS ×19 at 170-key parity, zero empty values); every dictionary's geohist.faq.languages.a contains the count-style "16" phrasing; ja/zh pass the CJK punct gate with full-width 、 and 。; ur keeps ، and ۔; no other key differs (git diff shows exactly 20 changed value lines across the phase: 1 HTML + 19 JSON).</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| (none new) | Static text value change only — no new input path, endpoint, dependency, or script surface |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-07-06-01 | Tampering | Dictionary value edits (20 lines) | low | accept | Values are hardcoded literal strings from a locked table in this plan; keycheck gate re-verifies parity/empties/punctuation on every edit; no runtime code touched |
</threat_model>

<verification>
- `npm run validate` exit 0 after both tasks: html-validate clean, linkinator 200s, 23/23 detect tests, keycheck PASS ×19 (exact 170-key parity, zero empty values).
- `git diff --stat` shows exactly 20 files, 1 line each (index.html + 19 json) — no key additions/removals, no other files touched.
</verification>

<success_criteria>
- G-07-5a closed: FAQ languages answer states the 20-language surface in count-style phrasing ("... 16 more languages" form) in EN and all 19 locales.
- Key set unchanged at 170 keys; CJK/Urdu punctuation conventions intact; validate chain fully green.
- Single commit: `fix(07-06): FAQ languages answer count-style across EN + 19 dicts (G-07-5a)`.
</success_criteria>

<output>
Create `.planning/phases/07-localization-20-rtl/07-06-faq-languages-count-SUMMARY.md` when done
</output>
