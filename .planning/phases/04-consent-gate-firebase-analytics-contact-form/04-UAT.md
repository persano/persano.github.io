---
status: complete
phase: 04-consent-gate-firebase-analytics-contact-form
source: [04-VERIFICATION.md]
started: 2026-09-03T02:05:00Z
updated: 2026-09-03T14:26:24Z
---

## Current Test

[testing complete]

## Tests

### 1. Consent live battery (04-01, 6 checks)
expected: All six pass — zero SDK bytes before grant, both GA4 events post-grant, retraction works
result: pass

### 2. Firestore Rules Playground battery (04-02, cases 1-6)
expected: (1) 5-field create → ALLOW; (2) name-less create per topic general/bug/feedback/deletion → ALLOW ×4; (3) extra unknown field → DENY; (4) topic 'other'/missing → DENY; (5) 5001-char message / 255-char email → DENY; (6) get/update/delete simulation → DENY. Case 5 settles size() unit semantics (research A2: UTF-8 bytes vs client UTF-16 code units)
result: pass

### 3. Live submit battery (04-02, checks 7-10)
expected: On https://persano.github.io/geohist/contact.html — (7) Accept + valid submit → success status, Firestore doc with server timestamp + exact field set {name?, email, topic, message, createdAt}; (8) fresh session + Reject → submit STILL succeeds; (9) honeypot-filled → success shown, NO document created; (10) rapid double-click → exactly one document
result: pass

## Summary

total: 3
passed: 3
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps