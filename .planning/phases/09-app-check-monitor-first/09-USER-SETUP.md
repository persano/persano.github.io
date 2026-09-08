# Phase 09: User Setup Required

**Generated:** 2026-09-08
**Phase:** 09-app-check-monitor-first
**Status:** Incomplete

Complete these items for the App Check Enterprise integration to function end-to-end. The agent automated everything possible (provider swap, site-key activation, deploy, prod smoke — all green); this item requires human access to the reCAPTCHA Admin console.

## Environment Variables

None — the site key is already committed (public-by-design); the secret key never leaves the console.

## Dashboard Configuration

- [ ] **Run the "Migrate keys" migration for the GeoHist reCAPTCHA key**
  - Location: reCAPTCHA Admin (google.com/recaptcha/admin) → GeoHist key → settings → **Migrate keys** banner
  - Set to: migrate the classic v3 key so it becomes GCP/Enterprise-managed (site key value is **unchanged** by the migration — `js/firebase-config.js` needs no edit)
  - Notes: Firebase deprecated the classic reCAPTCHA provider for new App Check registrations; the owner registered web-geohist as reCAPTCHA Enterprise (2026-09-08). Until the key is migrated, the Firebase Enterprise registration cannot verify tokens from the deployed site key — this is the one console step between "deployed" and "verified". Documented in 09-RUNBOOK.md §1 ("Remaining owner step — Migrate keys").

## Verification

After completing the migration, run the gap re-verification (formal pass/fail via `/gsd-verify-work resume`):

1. **UAT test 1 repeat** — submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data → success status shows, form resets, message lands in the Firestore `messages` collection. Zero visible change (monitoring mode).
2. **UAT test 2 repeat** — on prod, DevTools-block `*recaptcha*`, submit with analytics consent granted → `contact.status.appcheck` shows, form stays usable, `appcheck_token_failure` appears in GA4 (up to 24 h event lag), message still lands in Firestore. Repeat with consent denied → same status, no event, message still lands.

Expected results: post-activation submits pass token verification with zero visible change; the token-failure path is observable and consent-gated.

---

**Once all items complete:** Mark status as "Complete" at top of file.
