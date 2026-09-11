# Phase 09: User Setup Required

**Generated:** 2026-09-08
**Phase:** 09-app-check-monitor-first
**Status:** Complete
*Completed 2026-09-11 (Phase 11): HV-09a live checks passed — 09-UAT.md test 10 (G-09-5 formal closure, D-09 split: GA4 event = owner-console sub-item, ≤24h window); HV-09b favicon glance passed — test 11.*

Complete these items for the App Check Enterprise integration to function end-to-end. The agent automated everything possible (provider swap, site-key activation, deploy, prod smoke — all green); this item requires human access to the reCAPTCHA Admin console.

## Environment Variables

None — the site key is already committed (public-by-design); the secret key never leaves the console.

## Dashboard Configuration

- [x] **Run the "Migrate keys" migration for the GeoHist reCAPTCHA key** — completed by owner 2026-09-08
  - Location: reCAPTCHA Admin (google.com/recaptcha/admin) → GeoHist key → settings → **Migrate keys** banner
  - Set to: migrate the classic v3 key so it becomes GCP/Enterprise-managed (site key value is **unchanged** by the migration — `js/firebase-config.js` needs no edit)
  - Notes: Firebase deprecated the classic reCAPTCHA provider for new App Check registrations; the owner registered web-geohist as reCAPTCHA Enterprise (2026-09-08). Until the key is migrated, the Firebase Enterprise registration cannot verify tokens from the deployed site key — this is the one console step between "deployed" and "verified". Documented in 09-RUNBOOK.md §1 ("Remaining owner step — Migrate keys").

## Verification

After completing the migration, run the gap re-verification (formal pass/fail via `/gsd-verify-work resume`):

1. **UAT test 1 repeat** — submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data → success status shows, form resets, message lands in the Firestore `messages` collection. Zero visible change (monitoring mode).
2. **UAT test 2 repeat** — on prod, DevTools-block `*recaptcha*`, submit with analytics consent granted → `contact.status.appcheck` shows, form stays usable, `appcheck_token_failure` appears in GA4 (up to 24 h event lag), message still lands in Firestore. Repeat with consent denied → same status, no event, message still lands.

Expected results: post-activation submits pass token verification with zero visible change; the token-failure path is observable and consent-gated.

## Gap Re-verification — G-09-5 + G-09-6 (appended 2026-09-09 by plan 09-04)

Formal pass/fail is recorded via `/gsd-verify-work resume`. No secret keys and no debug tokens belong in this file — the repo tree is publicly served.

### 1. UAT test 5 repeat — bounded, deliver-anyway token failure (G-09-5)

On prod, in an incognito window:

1. DevTools → Network → request blocking: add BOTH `*recaptcha*` AND `*google.com/reload*` (the token POST goes to `www.google.com/reload` — no "recaptcha" in the URL).
2. Submit the form at https://geohisttrivia.com/geohist/contact.html with valid data, analytics consent granted.
3. Expect: the "We couldn't verify this message — please email santiagopostorivo@gmail.com" status appears **within ~10 seconds** (never stuck on "sending"); the submit button re-enables; the form stays usable and is **NOT reset** (fields keep their values so they can be copied into the email fallback); no auto-retry — resending is manual.
4. Firebase console → Firestore → `messages` collection: the submitted message is present — delivered **un-attested** (monitoring mode; the failure no longer aborts delivery).
5. With consent granted, the `appcheck_token_failure` event fires — Firebase console → Analytics → Events (GA4 custom events can take up to 24 h to appear after the first fire).
6. Repeat with consent **denied**: same appcheck status, no event, message still lands.

### 2. Favicon check (G-09-6)

1. Open https://geohisttrivia.com/ and https://geohisttrivia.com/geohist/contact.html — the browser tab shows the GeoHist app icon on both.
2. https://geohisttrivia.com/favicon.ico returns 200 (no 404).

## Gap Re-verification — G-09-7 (appended 2026-09-09 by plan 09-05)

Formal pass/fail is recorded via `/gsd-verify-work resume`. No secret keys and no debug tokens belong in this file — the repo tree is publicly served.

### UAT test 7 repeat — blocked-reCAPTCHA submit now delivers un-attested fast (G-09-7)

On prod, in an incognito window (fresh environment — no prior submit in the session):

1. DevTools → Network → request blocking: add BOTH `*recaptcha*` AND `*google.com/reload*` (the token POST goes to `www.google.com/reload` — no "recaptcha" in the URL).
2. Submit the form at https://geohisttrivia.com/geohist/contact.html with valid data, analytics consent granted.
3. Expect: the "We couldn't verify this message — please email santiagopostorivo@gmail.com" status appears **within ~10 seconds TOTAL** (never ~1 minute, never stuck on "sending", never the generic "Algo salió mal" wording); the submit button re-enables; the form stays usable and is **NOT reset** (fields keep their values so they can be copied into the email fallback); no auto-retry — resending is manual.
4. Firebase console → Firestore → `messages` collection: the submitted message is present — delivered **un-attested** (the probe skipped App Check for this environment, so the message no longer dies with an auth error).
5. With consent granted, the `appcheck_token_failure` event fires — Firebase console → Analytics → Events (GA4 custom events can take up to 24 h to appear after the first fire).
6. Repeat with consent **denied**: same appcheck status, no event, message still lands.
7. Negative expectation: the browser console must **NOT** show an auth-family submit failure (e.g. `auth/network-request-failed`) for this scenario anymore — the only console line is the recorded appcheck-family code.

---

**Once all items complete:** Mark status as "Complete" at top of file.
