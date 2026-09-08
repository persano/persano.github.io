---
status: testing
phase: 09-app-check-monitor-first
source: [09-VERIFICATION.md]
started: 2026-09-08T03:10:00Z
updated: 2026-09-08T03:10:00Z
---

## Current Test

number: 1
name: Dormant happy path — zero user-visible change (SC1)
expected: |
  Submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data (shipped dormant state: recaptchaSiteKey ''). Success status shows, form resets, message lands in Firestore messages collection; appearance identical to pre-Phase-9 form. Repeat after runbook §1–§3 activation (§3 step 3) with the same zero-change result.
awaiting: user response

## Tests

### 1. Dormant happy path — zero user-visible change (SC1)
expected: |
  Submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data (shipped dormant state: recaptchaSiteKey ''). Success status shows, form resets, message lands in Firestore messages collection; appearance identical to pre-Phase-9 form. Repeat after runbook §1–§3 activation (§3 step 3) with the same zero-change result.
result: [pending]

### 2. Token-failure path — appcheck status + consent-gated event (SC2/SC3)
expected: |
  Runbook §7 debug-token flow on localhost without safelisting a debug token: submit with analytics consent granted → observe status; submit with consent denied → check GA4 DebugView (no event). "We couldn't verify this message — please email santiagopostorivo@gmail.com." status replaces "sending"; form stays usable (manual resend, no auto-retry); appcheck_token_failure event with a code param fires in GA4 only when consent granted; message still lands in Firestore (monitoring mode).
result: [pending]

### 3. Visual check of new surfaces
expected: |
  View contact page (trigger the appcheck status via test 2) and privacy.html section 3 in desktop + mobile browser. Appcheck status node styled consistently with other form-status variants; privacy li renders as part of the SDK-inventory list with correct typography.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
