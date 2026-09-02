---
status: testing
phase: 02-geohist-landing-hub-content-en-i18n-keys-baked-in
source: [02-VERIFICATION.md]
started: 2026-09-02T06:05:00Z
updated: 2026-09-02T06:05:00Z
---

## Current Test

number: 1
name: Post-deploy smoke (controlled push + CI + live URLs)
expected: |
  Orchestrator executes the single controlled push (branch ahead of origin/main by 14 commits),
  CI validate job goes green, then /geohist/, /geohist/guide.html, /, /geohist/privacy.html
  all return HTTP 200 and show the dark antique theme.
awaiting: user response

## Tests

### 1. Post-deploy smoke: controlled push + CI green + four live URLs
expected: CI validate green; all four URLs return HTTP 200 and show the dark antique theme
result: [pending]

### 2. Phone-width sweep at 320/375px on all five pages
expected: Hero above the fold with legible badge; nav wraps cleanly; gallery tiles keep phone aspect; tile captions on solid strip; hub card proportioned (no stretch); texture never behind body copy
result: [pending]

### 3. Prohibition review (owner skim — LLM verdicts non-authoritative)
expected: No data-collection wording outside the policy-mirrored FAQ; no "more apps" filler; no hreflang/subdirs/redirect scripts
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps