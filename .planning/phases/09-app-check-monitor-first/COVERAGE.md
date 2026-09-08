# API Coverage — Firebase App Check (reCAPTCHA Enterprise) + reCAPTCHA Enterprise attestation

> Full coverage by default. Opt-outs are explicit, reasoned decisions.
> Phase 9 integrates the Firebase App Check web SDK (`firebase-app-check.js`, gstatic 12.18.0 exact-pinned)
> on the `contact.js` submit path, plus the reCAPTCHA Enterprise attestation provider (D-01 revised 2026-09-08).

| capability | decision | reason |
|---|---|---|
| initializeAppCheck + ReCaptchaV3Provider (submit-path lazy init) | INTEGRATE | Core of FIRE-07; cache-once guard; init before auth/firestore as 4th lazy module (superseded 2026-09-08: provider class swapped to Enterprise, see ReCaptchaEnterpriseProvider row) |
| getToken(appCheck, false) explicit gate | INTEGRATE | The only observable token-failure seam in monitoring mode (research Pattern 2) — powers D-06 status UX + FIRE-08 event |
| isTokenAutoRefreshEnabled: false init option | INTEGRATE | Submit-time instance used once; no background refresh pings (research/ARCHITECTURE §4) |
| persano:appcheck doc event → consent-gated appcheck_token_failure | INTEGRATE | FIRE-08 metric; consent-gated Analytics bridge; fork-preserving (persano:langchange precedent) |
| onTokenChanged listener | OPT-OUT | Not needed — token is fetched once per submit via the explicit gate; no token-lifecycle UI exists |
| setTokenAutoRefreshEnabled (runtime toggle) | OPT-OUT | Superseded by the init option; no runtime surface toggles refresh |
| getLimitedUseToken | OPT-OUT | For non-Firebase backends / replay protection; Firestore replay protection is unavailable (docs 2026-09-02) |
| ReCaptchaEnterpriseProvider | INTEGRATE | Firebase deprecated the classic reCAPTCHA provider for new App Check registrations (console banner, ES); owner registered web-geohist as reCAPTCHA Enterprise 2026-09-08 — tokens from the classic provider cannot verify against an Enterprise registration. D-01 revised 2026-09-08 |
| CustomProvider (self-hosted attestation) | OPT-OUT | No custom attestation backend exists in this zero-build project |
| Debug provider shipped in code (FIREBASE_APPCHECK_DEBUG_TOKEN flag) | OPT-OUT | Docs forbid shipping/committing debug tokens (repo tree is publicly served); flow documented owner-side in 09-RUNBOOK §local-testing |
| Console enforcement flip execution (Firestore + Authentication) | OPT-OUT | Documented in 09-RUNBOOK (D-05), never executed by the agent — execution is FIRE-10, post-monitoring |
| Console replay protection for Firestore | OPT-OUT | Not available for standard Google services (Firebase AI Logic only) — runbook must not document it (research refutation) |
| reCAPTCHA score-threshold tuning (0.5 app-risk default) | OPT-OUT | Keep the Firebase default per D-01; no tuning surface in this phase |
