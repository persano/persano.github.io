# API Coverage — Firebase JS SDK 12.18.0 (gstatic modular ESM)

> Full coverage by default. Opt-outs are explicit, reasoned decisions.
> Capability surface enumerated from the shipped gstatic 12.18.0 artifacts (verified in 04-RESEARCH.md: HTTP 200 ×4, exports confirmed in the minified code).

| capability | decision | reason |
|---|---|---|
| `analytics_init` (isSupported + getAnalytics) | INTEGRATE | FIRE-02/03 loader; isSupported guard mandatory (Pitfall 3) |
| `logEvent` — play_badge_click {page} | INTEGRATE | D-50 FIRE-03 minimum scope |
| `logEvent` — language_switch {from, to} | INTEGRATE | D-50/D-51; payload from persano:langchange (js/i18n.js:130) |
| `setAnalyticsCollectionEnabled` | INTEGRATE | D-44 retraction lever; sets ga-disable flag (verified in artifact) |
| `setConsent` | OPT-OUT | Consent Mode locked out by Init decision — load-gating replaces it (STACK §5) |
| `setUserId` / `setUserProperties` | OPT-OUT | no user identity exists on an anonymous static site |
| `setCurrentScreen` / `setDefaultEventParameters` / `settings` | OPT-OUT | single-screen informational site; no custom defaults in scope |
| `initializeAnalytics` | OPT-OUT | getAnalytics with defaults suffices; no analytics config object needed |
| `getGoogleAnalyticsClientId` | OPT-OUT | no feature consumes the client id |
| `auth_init + signInAnonymously` (getAuth, signInAnonymously) | INTEGRATE | FIRE-05 locked pipeline: submit-time anonymous auth |
| `onAuthStateChanged` | OPT-OUT | submit-time session only; `auth.currentUser` reuse check suffices |
| `setPersistence` / `browserLocalPersistence` | OPT-OUT | default persistence adequate for an anonymous session's tab lifetime |
| `signOut` | OPT-OUT | anonymous sessions are tab-scoped; no sign-out UX surface |
| `deleteUser` | OPT-OUT | CMPL-03 deletion is a documented manual email process, not SDK self-deletion |
| `firestore_write` (getFirestore, collection, addDoc, serverTimestamp) | INTEGRATE | FIRE-05 form submissions into `messages` |
| `initializeFirestore` / `persistentLocalCache` | OPT-OUT | research: unnecessary at this scale; default getFirestore is right |
| `firestore_read` (doc, getDoc, getDocs) | OPT-OUT | rules deny all reads; submissions are read in the Firebase console |
| `onSnapshot` realtime listeners | OPT-OUT | no read/listen surface exists on the site |

No second integration surface exists this phase (single web SDK against one Firebase project), so no re-decision pass is required.
