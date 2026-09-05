# Phase 4: User Setup Required

**Generated:** 2026-09-02
**Phase:** 04-consent-gate-firebase-analytics-contact-form
**Status:** Incomplete

Complete these items for the Firebase Analytics gate (plan 04-01 Task 3) and the contact form (plan 04-02) to function. The executor automated everything possible in-repo; these items require human access to the Firebase console.

## Environment Variables

None — the Web App config is public-by-design and lives in `js/firebase-config.js` (committed). No `.env` files; zero-build static site.

## Account Setup

- [ ] **Firebase project exists** (the Android app's project)
  - URL: https://console.firebase.google.com/
  - Skip if: Already have the GeoHist Trivia Firebase project

## Dashboard Configuration

- [ ] **Register a Web App in the existing Firebase project**
  - Location: Firebase Console → Project settings (gear icon) → General → Your apps → Web app (`</>`)
  - Copy the `firebaseConfig` values: `apiKey`, `authDomain`, `projectId`, `appId`, `measurementId`
  - Notes: These exact five values replace the `PASTE_FROM_FIREBASE_CONSOLE` placeholders in `js/firebase-config.js` (plan 04-01 Task 3, checkpoint reply or direct edit — values are public-by-design and committable)

- [ ] **Add `persano.github.io` to authorized domains**
  - Location: Firebase Console → Authentication → Settings → Authorized domains → Add domain
  - Set to: `persano.github.io`
  - Notes: Console-side gate for Anonymous Auth (plan 04-02 FIRE-05); harmless to do now

- [ ] **Enable the Anonymous auth provider** (needed by plan 04-02)
  - Location: Firebase Console → Authentication → Sign-in method → Anonymous → Enable

- [ ] **Create the Firestore database in production mode** (needed by plan 04-02)
  - Location: Firebase Console → Firestore Database → Create database → Production mode
  - Notes: Starts fully locked; the repo rules file `firebase/firestore.rules` (plan 04-02) is pasted into Firestore → Rules before any form verification

## Verification

After pasting the real config into `js/firebase-config.js` and the orchestrator's controlled push (CI validate → deploy green):

```bash
# Confirm no placeholders remain
grep -c PASTE_FROM_FIREBASE_CONSOLE js/firebase-config.js   # expect 0
```

Expected: `0`. Then run the Task 3 live battery (plan 04-01 §how-to-verify) in a FRESH incognito window with DevTools → Network → Disable cache ON, and report the six results:

1. Load `/geohist/` — banner visible; ZERO requests to `www.gstatic.com/firebasejs`, `googletagmanager.com`, `firebaseinstallations.googleapis.com`, `firebase.googleapis.com`
2. Click Accept — banner hides; those vendor hosts now appear
3. Click the Play badge — GA4 DebugView shows `play_badge_click` with a `page` param
4. Footer language switcher — DebugView shows `language_switch` with `from`/`to` params (first-render auto-apply for a non-EN browser also logs it)
5. Footer "Consent" re-opens banner; click Reject — choice flips, no further wrapper events, no new vendor requests
6. Fresh session, click Reject first — banner hides, zero vendor requests at any point

---

**Once all items complete:** Mark status as "Complete" at top of file.