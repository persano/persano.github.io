---
status: complete
phase: 08-custom-domain-migration
source: [08-03-SUMMARY.md]
started: 2026-09-07T22:30:00Z
updated: 2026-09-07T23:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Live contact-form test at the new domain
expected: Submit a real test message at https://geohisttrivia.com/geohist/contact.html — success state appears; message visible in Firestore `messages`. (Owner reported success during 08-03 gate — confirm formally.)
result: pass

### 2. Apex + www live behavior
expected: https://geohisttrivia.com/ loads (200); https://www.geohisttrivia.com/ redirects to the apex; http apex 301s to https. (Automated curl proofs green in 08-03 sweep — owner spot-check to confirm visually.)
result: pass

### 3. GSC sitemap resubmitted to the new Domain property
expected: https://geohisttrivia.com/sitemap.xml submitted in the NEW Domain property shows Success status (D-09/HOST-03). Owner reported Success during the gate — confirm formally.
result: pass

### 4. Change of Address filed old→new
expected: CoA filed in the new property with source = old persano.github.io URL-prefix property; pre-move checks passed; 180-day window active (D-10). Owner reported filed — confirm formally.
result: pass

### 5. Old GSC property retained
expected: The old persano.github.io URL-prefix property remains intact in GSC — no deletion (D-08 index-decay monitoring surface). Owner confirmed retained — confirm formally.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps
