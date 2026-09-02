---
status: complete
phase: 03-i18n-engine-es-pt-br-dictionaries-switcher
source: [03-VERIFICATION.md]
started: 2026-09-02T18:40:00Z
updated: 2026-09-02T16:35:00Z
---

## Current Test

[testing complete]

## Tests

### 1. ES auto-detect in place (SC1, I18N-01/02)
expected: |
  Locale es → all 3 keyed pages render Spanish in place; titles translate; html lang="es"; no URL change.
result: pass

### 2. pt-BR auto-detect in place (SC1, I18N-01)
expected: |
  Locale pt-BR (or bare pt) → all 3 keyed pages render pt-BR copy in place; titles translate; html lang="pt-BR".
result: pass

### 3. Manual switcher applies + persists (SC2, I18N-03)
expected: |
  Footer shows English · Español · Português. Clicking an entry flips language without reload, aria-current moves, choice persists across reload; re-clicking active language is inert.
result: pass

### 4. Offline fallback stays silent on EN (SC3)
expected: |
  With /js/i18n/*.json request blocked (DevTools offline throttle), pages stay on shipped EN with no error UI; translations return once unblocked.
result: pass

### 5. lang/title/meta sync (SC4, I18N-04)
expected: |
  On every applied switch: html lang, tab title, and meta description flip together with body text.
result: pass

### 6. Owner copy review (D-39/D-41)
expected: |
  es-419 and pt-BR copy read naturally; FAQ policy-mirror sentences never contradict geohist/privacy.html; game-mode names acceptable; identity strings intact.
result: pass

### 7. Deploy handoff + post-deploy smoke
expected: |
  /gsd-ship commits deferred code; orchestrator single controlled push to main; CI validate green (incl. dictionary gate); /, /geohist/, /geohist/guide.html, /geohist/privacy.html 200; /js/i18n/es.json and /js/i18n/pt-BR.json 200 with application/json.
result: skipped
reason: "Post-deploy smoke — executes at /gsd-ship time (deploy handoff). Not verifiable before push; live-URL checks are the ship-time smoke test."

## Summary

total: 7
passed: 6
issues: 0
pending: 0
skipped: 1
blocked: 0

## Gaps