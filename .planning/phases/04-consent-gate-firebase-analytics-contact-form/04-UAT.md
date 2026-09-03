---
status: testing
phase: 04-consent-gate-firebase-analytics-contact-form
source: [04-VERIFICATION.md]
started: 2026-09-03T02:05:00Z
updated: 2026-09-03T02:05:00Z
---

## Current Test

number: 1
name: Consent live battery (04-01, 6 checks)
expected: |
  Fresh incognito + DevTools Network (Disable cache ON) on https://persano.github.io/geohist/:
  (1) banner visible, two equally prominent buttons, ZERO requests to www.gstatic.com/firebasejs,
  googletagmanager.com, firebaseinstallations.googleapis.com, firebase.googleapis.com;
  (2) Accept → those vendor hosts appear; (3) Play badge click → GA4 DebugView play_badge_click {page};
  (4) language switch → language_switch {from,to} (init auto-apply for non-EN browser also logs);
  (5) footer Consent → Reject → stored choice flips, no new wrapper sends;
  (6) fresh session Reject-first → zero vendor requests at any point.
awaiting: user response

## Tests

### 1. Consent live battery (04-01, 6 checks)
expected: All six pass — zero SDK bytes before grant, both GA4 events post-grant, retraction works
result: [pending]

### 2. Firestore Rules Playground battery (04-02, cases 1-6)
expected: (1) 5-field create → ALLOW; (2) name-less create per topic general/bug/feedback/deletion → ALLOW ×4; (3) extra unknown field → DENY; (4) topic 'other'/missing → DENY; (5) 5001-char message / 255-char email → DENY; (6) get/update/delete simulation → DENY. Case 5 settles size() unit semantics (research A2: UTF-8 bytes vs client UTF-16 code units)
result: [pending]

### 3. Live submit battery (04-02, checks 7-10)
expected: On https://persano.github.io/geohist/contact.html — (7) Accept + valid submit → success status, Firestore doc with server timestamp + exact field set {name?, email, topic, message, createdAt}; (8) fresh session + Reject → submit STILL succeeds; (9) honeypot-filled → success shown, NO document created; (10) rapid double-click → exactly one document
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps