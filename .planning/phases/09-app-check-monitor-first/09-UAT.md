---
status: complete
phase: 09-app-check-monitor-first
source: [09-VERIFICATION.md]
started: 2026-09-08T03:10:00Z
updated: 2026-09-11T00:00:00Z

> Final state: all 9 tests pass. Tests 2/5/6/7 initially failed; each failure was diagnosed (G-09-2/5/6/7), fixed by a gap-closure plan (09-03/09-04/09-05), and re-verified pass by its superseding test (4/8/9). Verbatim failure reports live in the Gaps section below.
> [updated Phase 11, 2026-09-11: tests 10–11 appended (HV-09a G-09-5 formal closure + HV-09b favicon glance) — all 11 tests pass; test 10's GA4 event clause is an owner-console sub-item pending per D-09 (≤24h Events window)]
---

## Current Test

[testing complete]

## Tests

### 1. Dormant happy path — zero user-visible change (SC1)
expected: |
  Submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data (shipped dormant state: recaptchaSiteKey ''). Success status shows, form resets, message lands in Firestore messages collection; appearance identical to pre-Phase-9 form. Repeat after runbook §1–§3 activation (§3 step 3) with the same zero-change result.
result: pass

### 2. Token-failure path — appcheck status + consent-gated event (SC2/SC3)
expected: |
  Runbook §7 debug-token flow on localhost without safelisting a debug token: submit with analytics consent granted → observe status; submit with consent denied → check GA4 DebugView (no event). "We couldn't verify this message — please email santiagopostorivo@gmail.com." status replaces "sending"; form stays usable (manual resend, no auto-retry); appcheck_token_failure event with a code param fires in GA4 only when consent granted; message still lands in Firestore (monitoring mode).
result: pass
note: "Initially FAILED (see gap G-09-2 for verbatim report): shipped ReCaptchaV3Provider incompatible with forced reCAPTCHA Enterprise registration; dormant state left failure path unexercisable. Fixed by 09-03-PLAN; final behavior re-verified pass — happy path by test 4, failure path by test 9."

### 3. Visual check of new surfaces
expected: |
  View contact page (trigger the appcheck status via test 2) and privacy.html section 3 in desktop + mobile browser. Appcheck status node styled consistently with other form-status variants; privacy li renders as part of the SDK-inventory list with correct typography.
result: pass

### 4. Test 1 repeat — normal submit after Migrate keys (gap G-09-2 re-verify)
expected: |
  Submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data. Success status shows, form resets, message lands in Firestore messages collection. Zero visible change — no appcheck error status appears (monitoring mode, post-migration).
result: pass
note: "Initially failed with 403 App attestation failed (see gap G-09-4): Firebase App Check registration held a different site key than the one the page uses. Owner corrected the registration site key in Firebase console (no code change); submit now passes silently."

### 5. Test 2 repeat — blocked-token failure path (gap G-09-2 re-verify)
expected: |
  On prod, DevTools-block `*recaptcha*` AND `*google.com/reload*` (token POST goes to www.google.com/reload — no "recaptcha" in URL), submit with analytics consent granted → `contact.status.appcheck` shows, form stays usable, `appcheck_token_failure` appears in GA4 Realtime, message still lands in Firestore. Repeat with consent denied → same status, no event, message still lands.
result: pass
note: "Initially FAILED (see gap G-09-5 for verbatim report + inline diagnosis): unbounded getToken hang + aborted auth+addDoc chain on token rejection. Fixed by 09-04-PLAN (bounded ~10s race + record-and-swallow + deliver-anyway); residual Auth-header hang diagnosed as G-09-7, fixed by 09-05-PLAN (probe-gated init), re-verified pass by test 9."

### 6. Favicon present (user-raised, site-wide)
expected: |
  Browser tab shows the site favicon on all pages; /favicon.ico resolves (no 404); pages declare <link rel="icon">.
result: pass
note: "Initially FAILED (see gap G-09-6 for verbatim report): no favicon file, no link tags, /favicon.ico 404. Fixed by 09-04-PLAN; re-verified pass by test 8."

### 7. Token-failure path re-verify (G-09-5 closure)
expected: |
  Per 09-USER-SETUP.md checklist: prod incognito, DevTools block BOTH *recaptcha* AND *google.com/reload*, submit with analytics consent granted → contact.status.appcheck (email fallback wording) within ~10s, button re-enabled, form NOT reset, message lands in Firestore messages collection un-attested, appcheck_token_failure event in GA4 (lag up to 24h). Repeat with consent denied → same status, no event, message still lands.
result: pass
note: "Initially FAILED (see gap G-09-7 for verbatim report + root cause): 09-04 bounded only the explicit getToken gate; Auth's internal X-Firebase-AppCheck header await hung → auth/network-request-failed after ~1 min, no Firestore delivery. Fixed by 09-05-PLAN (bounded ~3s reachability probe skips App Check init); re-verified pass by test 9."

### 8. Favicon re-verify (G-09-6 closure)
expected: |
  Browser tab shows the GeoHist icon on https://geohisttrivia.com/ and /geohist/contact.html; https://geohisttrivia.com/favicon.ico returns 200.
result: pass
note: "Formal favicon closure verified by owner (tab icon + /favicon.ico 200); remote head/link checks re-verified in 09-VERIFICATION.md."

### 9. UAT test 7 repeat — blocked-reCAPTCHA submit delivers un-attested fast (G-09-7 closure)
expected: |
  Per 09-USER-SETUP.md G-09-7 checklist: prod incognito (fresh session), DevTools block BOTH *recaptcha* AND *google.com/reload*, submit with analytics consent granted → appcheck status ("We couldn't verify this message — please email santiagopostorivo@gmail.com") within ~10s TOTAL (never ~1 minute, never "Algo salió mal"), button re-enables, form NOT reset, message lands in Firestore messages collection un-attested, appcheck_token_failure event in GA4 (lag up to 24h). Repeat with consent denied → same status, no event, message still lands. Console must NOT show auth-family error (e.g. auth/network-request-failed) — only the recorded appcheck-family code.
result: pass
note: "G-09-7 formal closure PASSED by owner 2026-09-09: appcheck status within ~10s, delivered un-attested in Firestore, no auth-family console error. 09-05 probe fix verified end-to-end."

### 10. UAT test 5 repeat — G-09-5 formal closure per 09-USER-SETUP checklist (Phase 11 HV-09a)
expected: |
  Per 09-USER-SETUP.md §G-09-5: prod incognito, DevTools → Network → request blocking BOTH *recaptcha* AND *google.com/reload*, submit at https://geohisttrivia.com/geohist/contact.html with valid data, analytics consent GRANTED → contact.status.appcheck ("We couldn't verify this message — please email santiagopostorivo@gmail.com") within ~10s, submit button re-enables, form NOT reset, Firebase console → Firestore → messages shows the submitted doc (un-attested). Repeat with consent DENIED → same status, no event, message still lands.
  [GA4 appcheck_token_failure clause → owner-console sub-item per D-09: Firebase console → Analytics → Events within ≤24h — NOT part of today's pass/fail (owner pihole blocks GA4/DebugView); confirmed later in Firebase Events]
result: pass
note: "Owner-executed in-session 2026-09-11 (Phase 11 HV-09a) on prod geohisttrivia.com incognito, walking 09-USER-SETUP.md §G-09-5: BOTH blocking patterns added (*recaptcha* + *google.com/reload*); consent GRANTED submit → contact.status.appcheck (email-fallback wording) within ~10s, submit button re-enabled, form NOT reset, Firestore messages collection shows the submitted doc un-attested; consent DENIED repeat → same status, no event, message still lands. GA4 appcheck_token_failure confirmation pending as owner-console sub-item per D-09 (Firebase console → Analytics → Events, ≤24h window; owner pihole blocks GA4/DebugView) — NOT part of today's pass/fail; live checks passed, the full record closes when the owner confirms the event. Formal G-09-5 closure superseding the test 5/7/9 fix-chain records."

### 11. Favicon visual glance (Phase 11 HV-09b)
expected: Browser tabs show the GeoHist app icon on https://geohisttrivia.com/ and /geohist/contact.html; /favicon.ico 200 already machine-verified (prior record test 8, 2026-09-09).
result: pass
note: "Owner-executed in-session 2026-09-11 (Phase 11 HV-09b): GeoHist app icon visible in browser tabs on https://geohisttrivia.com/ and /geohist/contact.html; /favicon.ico HTTP 200 machine-verified pre-session (earlier same day). Prior record = test 8 (2026-09-09)."

## Summary

total: 11
passed: 11
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-09-2
  truth: "Post-activation submits pass token verification (zero visible change in monitoring mode); token-failure path shows contact.status.appcheck with consent-gated appcheck_token_failure event"
  status: resolved
  resolved_by: "09-03-PLAN (gap closure): ReCaptchaEnterpriseProvider swap + site-key activation + deploy — verified by UAT test 4 pass 2026-09-08. Residual failure-path defects moved to G-09-5."
  resolved_at: 2026-09-08
  reason: "User reported: shipped ReCaptchaV3Provider incompatible with the reCAPTCHA Enterprise registration Firebase now forces (classic provider marked obsolete); also recaptchaSiteKey empty = dormant, so failure path unexercisable until activation"
  severity: major
  test: 2
  root_cause: "Phase research (D-01, 2026-09-02) locked the classic reCAPTCHA v3 App Check provider; Firebase has since deprecated it for new App Check registrations (console: 'reCAPTCHA está obsoleto. Usa reCAPTCHA Enterprise en su lugar') and the owner registered web-geohist as reCAPTCHA Enterprise (2026-09-08). js/contact.js:151 instantiates mods.appCheck.ReCaptchaV3Provider, whose tokens cannot verify against an Enterprise registration. The dormant gate (recaptchaSiteKey: '') additionally means no reCAPTCHA script ever loads, so the failure path could not be exercised in UAT until the provider swap + site-key activation deploy."
  artifacts:
    - path: "js/contact.js"
      issue: "Line 151 instantiates ReCaptchaV3Provider (classic); must be ReCaptchaEnterpriseProvider from the same firebase-app-check.js module"
    - path: "js/firebase-config.js"
      issue: "recaptchaSiteKey: '' (dormant) — must receive the owner's public site key 6LfYjbAtAAAAABgPLG-4SuJJ9lggRWO-ZJxxOEPF (safe to commit, public-by-design)"
    - path: ".planning/phases/09-app-check-monitor-first/COVERAGE.md"
      issue: "ReCaptchaEnterpriseProvider row is OPT-OUT under invalidated D-01 — must flip to INTEGRATE with deprecation rationale"
    - path: ".planning/phases/09-app-check-monitor-first/09-RUNBOOK.md"
      issue: "§1/§2/§7 document classic v3 + debug-token flow — needs Enterprise wording (owner already completed §1 key + §2 Enterprise registration on 2026-09-08)"
  missing:
    - "[DONE] Swap ReCaptchaV3Provider → ReCaptchaEnterpriseProvider — verified in js/contact.js:151 (2026-09-08)"
    - "[DONE] Paste site key into js/firebase-config.js recaptchaSiteKey — verified (2026-09-08)"
    - "[DONE] COVERAGE.md Enterprise row flipped to INTEGRATE; RUNBOOK §1 documents remaining console step (2026-09-08)"
    - "[DONE] Owner console 'Migrate keys' + App Check registration site-key correction (2026-09-08) — verified by UAT test 4 pass"
    - "[MOVED] Failure-path defects (timeout + message-not-landing) tracked as G-09-5"
  debug_session: "diagnosed inline during UAT — evidence: owner console screenshots (Firebase App Check registration + reCAPTCHA admin), Google docs (docs.cloud.google.com/recaptcha/docs/keys, 2026-08-26), code inspection contact.js:151"

- gap_id: G-09-5
  truth: "Token-failure path is bounded and graceful: appcheck status shows within seconds, form stays usable for manual resend, message still lands in Firestore (monitoring mode), consent-gated appcheck_token_failure event fires"
  status: resolved
  resolved_by: "09-04-PLAN (gap closure): bounded ~10s TOKEN_TIMEOUT_MS race + record-and-swallow + post-delivery synthetic re-throw in js/contact.js; deployed (bridge 55dba3d), Actions 34408285918 green, prod smoke green. Formal closure = UAT test 7 re-verify (owner, pending)"
  resolved_at: 2026-09-09
  reason: "User reported: incognito with *recaptcha* + *google.com/reload* blocked, form stuck on 'sending' forever — no appcheck status, no timeout, message never lands. GA4 event not owner-observable (pihole)."
  severity: major
  test: 5
  root_cause: "Two defects in js/contact.js submit pipeline: (A) no timeout around getToken (line 155) — with reCAPTCHA scripts network-blocked, the SDK's ReCaptchaEnterpriseProvider hangs awaiting grecaptcha readiness, the promise never settles, so the .catch failure path and .finally button re-enable never run; (B) attested.then(...) (line 159) aborts the auth+addDoc chain on token rejection — runbook §7 (line 144) specifies monitoring-mode semantics where a failed token still delivers the message un-attested; test 4's initial 403 state showed the same loss."
  artifacts:
    - path: "js/contact.js"
      issue: "Line 155: getToken(appCheckInstance, false) has no timeout — network-blocked reCAPTCHA hangs the submit indefinitely"
    - path: "js/contact.js"
      issue: "Lines 159-179: token rejection skips auth + addDoc entirely; runbook §7 requires the message to still land un-attested in monitoring mode"
  missing:
    - "Wrap getToken in a bounded race (~10s) — on timeout, treat as token failure"
    - "On token failure: still proceed to signInAnonymously + addDoc (un-attested) while showing contact.status.appcheck and dispatching persano:appcheck"
    - "Keep persano:appcheck event dispatch on BOTH reject and timeout paths (code detail routed via consent.js)"
    - "Deploy, then re-run UAT test 5 repeat"
  debug_session: "diagnosed inline during UAT — evidence: incognito network trace (blocked 2 requests, no exchange/auth/firestore calls, status stuck), code inspection js/contact.js:147-179, runbook §7 line 144"

- gap_id: G-09-6
  truth: "Site serves a favicon on all pages (icon file + link tags)"
  status: resolved
  resolved_by: "09-04-PLAN (gap closure): favicon.ico (59,370 B ICO + PNG magic verified) + icon/apple-touch-icon links in all 7 page heads; validate:html + validate:links green; prod /favicon.ico HTTP 200 (re-verified by 09-VERIFICATION.md). Formal closure = UAT test 8 tab check — PASSED by owner 2026-09-09."
  resolved_at: 2026-09-09
  reason: "User reported: favicon missing from browser tab. Verified: no <link rel='icon'> in any page head, no favicon file in repo, https://geohisttrivia.com/favicon.ico returns 404 site-wide."
  severity: cosmetic
  test: 6
  root_cause: "No favicon was ever authored in the project (root hub or /geohist pages); browsers fall back to /favicon.ico which 404s on Pages."
  artifacts:
    - path: "geohist/contact.html"
      issue: "No <link rel='icon'> in head"
  missing:
    - "Author favicon asset(s) (reuse app icon art from GeoHist-Trivia)"
    - "Add <link rel='icon'> (+ apple-touch-icon) to all page heads"
  debug_session: "diagnosed inline during UAT — evidence: remote head inspection + HEAD /favicon.ico → 404"

- gap_id: G-09-7
  truth: "With reCAPTCHA requests network-blocked, a submit leaves 'sending' within ~10s showing the appcheck status (email fallback wording); the message lands in Firestore un-attested; appcheck_token_failure fires (consent-gated)"
  status: resolved
  resolved_by: "09-05-PLAN (gap closure): bounded ~3s reCAPTCHA reachability probe BEFORE App Check init — probe failure skips init entirely (Auth SDK's optional header lookup short-circuits), blocked-reCAPTCHA submits deliver un-attested in seconds; deployed main 81463b3, Actions 34414513455 green, prod smoke green. Formal closure = UAT test 9 re-verify — PASSED by owner 2026-09-09."
  resolved_at: 2026-09-09
  reason: "User reported: still the same, but now it kinda 'worked', just took like a minute. Ended in generic error 'Algo salió mal' with console 'Contact form submit failed: auth/network-request-failed' (contact.js:308); nothing in Firestore (no new doc since Sep 8 19:22)."
  severity: major
  test: 7
  root_cause: "Uncovered join point: the 09-04 fix bounds only the explicit getToken gate (10s raceToken, js/contact.js:149-167). Firebase Auth independently awaits an App Check token BEFORE sending signUp — AuthImpl._getAdditionalHeaders() → _getAppCheckToken() → app-check-internal getToken() — to build the X-Firebase-AppCheck header. With reCAPTCHA scripts blocked, the Enterprise provider hangs forever (script tag has onload only, NO onerror → initialized Deferred never settles), so the internal header await hangs until Auth SDK's own NetworkTimeout (Delay(30s,60s): desktop 30s / mobile-UA 60s) rejects with auth/network-request-failed. signUp is never sent → addDoc never runs → no Firestore doc. Timeline math confirms: 10s race + 30/60s = ~40–70s ≈ observed 'like a minute' (also proves identitytoolkit was NOT blocked — an instant block would fail ~10s via the fetch-TypeError path). contact.js:295 mapping correct by design: auth/* → generic status ('Algo salió mal'); console.error :308 is that else-branch. Net effect: §8 ad-blocker metric is blind to the very visitors (ad-blockers) it targets — blocked-reCAPTCHA environments produce an auth-family error, so appcheck status + un-attested delivery + appcheck_token_failure are all unreachable in exactly that scenario."
  artifacts:
    - path: "js/contact.js"
      issue: "Lines 149-167: raceToken bounds ONLY the explicit getToken gate (shipped correct per 09-04); Auth's internal header await is outside it"
    - path: "js/contact.js"
      issue: "Lines 295-311: mapping correct by design (auth/* → generic) — but that design leaves the blocked-reCAPTCHA scenario with generic status, no delivery, no event"
    - path: "firebase-auth.js / firebase-app-check.js 12.18.0 (CDN-pinned)"
      issue: "Hang mechanism lives in the SDK: _getAppCheckToken unbounded await + NetworkTimeout Delay(30s,60s) → auth/network-request-failed; Enterprise script tag onload-only (no onerror) → initialized promise hangs forever when script is blocked"
  missing:
    - "Probe reCAPTCHA reachability BEFORE initializeAppCheck; on probe failure skip App Check init entirely — getImmediate({optional:true}) then returns undefined → no X-Firebase-AppCheck header await → auth+addDoc proceed fast un-attested (~10s bound restored), appcheck status + consent-gated appcheck_token_failure dispatched per G-09-5B semantics"
    - "Design decision deferred to plan phase: whether D-06/D-07 mapping spec needs extending for this scenario (probe approach eliminates it instead)"
  debug_session: ".planning/debug/token-failure-auth-network-failed.md"

- gap_id: G-09-4
  truth: "Normal submit passes App Check token verification silently after Migrate keys (zero visible change, monitoring mode)"
  status: resolved
  resolved_by: "Owner console fix (no code change): Firebase App Check web-geohist registration site key corrected to 6LfYjbAt...ZJxxOEPF — it previously held a different key, causing 403 'App attestation failed' on exchangeRecaptchaEnterpriseToken. Verified by UAT test 4 pass 2026-09-08."
  resolved_at: 2026-09-08
  severity: major
  test: 4
  root_cause: "Firebase App Check registration for web-geohist was registered with a reCAPTCHA Enterprise site key different from the site key shipped in js/firebase-config.js — token/key mismatch rejected at exchange."
  artifacts: []
  missing: []
  debug_session: "diagnosed inline during UAT — evidence: DevTools network trace (403 on exchangeRecaptchaEnterpriseToken, token OK from www.google.com/reload), Cloud console (key + API enabled in project geohist-trivia), Firebase App Check console (registered key ≠ site key, confirmed via find-in-page)"
