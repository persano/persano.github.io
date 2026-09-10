---
status: testing
phase: 10-gated-social-proof
source: [10-VERIFICATION.md]
started: 2026-09-10T03:35:00Z
updated: 2026-09-10T03:35:00Z
---

## Current Test

number: 1
name: Prod visual strip check (re-confirms D-09 icon ruling)
expected: |
  Open https://geohisttrivia.com/geohist/, switch EN/ES/PT-BR, narrow to phone width.
  4-pill strip between hero and features in the chosen language (20 idiomas / Juega sin
  conexión / Historia + Geografía / Android 7.0+ in ES), 4 glyph drafts legible
  (globe/cloud-off/map-pin/phone), no overlap, no texture behind pills, no visible h2, no links.
awaiting: user response

## Tests

### 1. Prod visual strip check (re-confirms D-09 icon ruling)
expected: 4-pill strip between hero and features in chosen language, 4 glyphs legible (globe/cloud-off/map-pin/phone), no overlap, no texture behind pills, no visible h2, no links
result: [pending]

### 2. OFF-row invisibility across languages incl. one RTL locale
expected: Scroll hero in EN, ES, PT-BR and ar — zero visible rating surface in every language; page source still shows `<div class="proof-row" hidden>` with 0.0
result: [pending]

### 3. Rich Results Test ritual (D-08)
expected: Run https://geohisttrivia.com/geohist/ through search.google.com/test/rich-results — valid SoftwareApplication result, no new errors/warnings vs pre-phase state (schema byte-identical so pre-phase result should reproduce exactly), no rating snippets offered
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
