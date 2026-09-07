---
status: diagnosed
phase: 07-localization-20-rtl
source: 07-01-SUMMARY.md, 07-02-SUMMARY.md, 07-03-SUMMARY.md, 07-04-SUMMARY.md, 07-05-SUMMARY.md
started: 2026-09-07T00:00:00Z
updated: 2026-09-07T03:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Footer switcher shows 20 languages
expected: Open any keyed page via local server. Footer has a language <select> listing 20 endonym-only options (Español, Deutsch, हिन्दी, العربية, اردو, 日本語, 한국어, 中文, ελληνικά, বাংলা, Türkçe, Bahasa Indonesia, Italiano, Nederlands, Polski, Tiếng Việt, Français, Português (Brasil), русский, English). English selected. Tap target large enough on mobile.
result: pass

### 2. Switch to German — full page translation + persistence
expected: Select Deutsch. Visible page text becomes German (Sie register — "Sie", not "du"). Game mode names match the app's terms (Flaggen, Hauptstädte, Historische Persönlichkeiten, Historische Ereignisse…). Reload the page — German persists (no flip back to English).
result: pass

### 3. Switch back to English restores everything
expected: Select English. Page returns to full original English content — no German fragments left, layout unchanged, dir reset to left-to-right.
result: pass

### 4. RTL: Arabic mirrors the page, switching back resets
expected: Select العربية. Page flips to right-to-left — text right-aligned, lists/indentation mirrored, punctuation like ? and ( ) rendered correctly for RTL. Switch back to English — layout returns to normal left-to-right.
result: pass

### 5. Urdu: RTL + airier line spacing
expected: Select اردو. Page is right-to-left AND paragraphs look noticeably more spaced (line-height 2 vs normal) — Nastaliq script has room. Headings also extra-spaced.
result: pass

### 6. Japanese: CJK rendering + punctuation + email label
expected: Select 日本語. Text renders in Japanese with full-width punctuation （、。「？」). Paragraph spacing slightly taller than English (line-height 1.7). In the about/contact area the mailto link's visible text is the Japanese label メールで連絡 (not the raw email address) — but clicking it still opens a mail draft to santiagopostorivo@gmail.com.
result: pass

### 7. Chinese: register + localized brand + contact form reference
expected: Select 中文. Text is Simplified Chinese with polite 您 forms. Brand appears localized as 地史知识问答 (not Latin "GeoHist Trivia"). Where other languages show the raw email address (e.g. data-deletion FAQ answer), the Chinese text instead points to the contact form — no raw email in Chinese page text.
result: pass

### 8. Quick sweep: 4 more languages translate cleanly
expected: Pick any 4 of: 한국어, Türkçe, Bahasa Indonesia, Italiano, Polski, Nederlands, Tiếng Việt, ελληνικά, বাংলা, Français, हिन्दी, русский. Each switch translates the whole page — no empty sections, no English leftovers in translated areas, no broken/mojibake characters.
result: pass

### 9. Browser-language auto-detection
expected: In Chrome DevTools → Sensors → override "Language" to Spanish, then reload in a fresh context (no stored pref, e.g. new profile/incognito). Page comes up in Español automatically. After manually switching to another language, a reload keeps the manual choice (stored preference beats detection).
result: pass

### 10. Validation chain green
expected: Run `npm run validate` in the repo root. Exit code 0 — html-validate clean, linkinator 200s, 23/23 detect tests, keycheck PASS ×19 at exact 170-key parity with zero empty values.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-07-5a
  truth: "FAQ answer 'What languages is the game available in?' reflects the actual 20-language surface"
  status: failed
  reason: "User reported (during test 5): FAQ answer geohist.faq.languages.a still says 'English, Spanish, Portuguese and more' — stale pre-phase-7 content; site now supports 20 languages. Verified stale in EN HTML (geohist/index.html:142) and all 19 dictionaries (js/i18n/*.json)."
  severity: minor
  test: 5
  root_cause: "Content staleness — geohist.faq.languages.a was authored in Phase 2 when the site supported 3 languages (en/es/pt-BR); Phase 7 grew the surface to 20 via dictionary waves without revisiting this FAQ answer. No gate covers content accuracy (keycheck verifies key parity/empties/punctuation, not facts)."
  artifacts:
    - path: "geohist/index.html:142"
      issue: "EN baseline: 'English, Spanish, Portuguese and more.'"
    - path: "js/i18n/*.json (all 19)"
      issue: "Same 3-language enumeration translated in every dictionary"
  missing:
    - "Update geohist.faq.languages.a EN baseline (geohist/index.html:142) to 'English, Spanish, Portuguese and 16 more languages.' (user-approved count style)"
    - "Update geohist.faq.languages.a in all 19 js/i18n/*.json with the equivalent count-style phrasing per locale register"
    - "Re-run npm run validate (keycheck parity must stay green; key set unchanged)"
  decision: "User picked count style (question answered 2026-09-07): EN 'English, Spanish, Portuguese and 16 more languages.'"
