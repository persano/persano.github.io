---
status: diagnosed
phase: 09-app-check-monitor-first
source: [09-VERIFICATION.md]
started: 2026-09-08T03:10:00Z
updated: 2026-09-08T16:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Dormant happy path — zero user-visible change (SC1)
expected: |
  Submit the live form at https://geohisttrivia.com/geohist/contact.html with valid data (shipped dormant state: recaptchaSiteKey '').   Success status shows, form resets, message lands in Firestore messages collection; appearance identical to pre-Phase-9 form. Repeat after runbook §1–§3 activation (§3 step 3) with the same zero-change result.
result: pass

### 2. Token-failure path — appcheck status + consent-gated event (SC2/SC3)
expected: |
  Runbook §7 debug-token flow on localhost without safelisting a debug token: submit with analytics consent granted → observe status; submit with consent denied → check GA4 DebugView (no event). "We couldn't verify this message — please email santiagopostorivo@gmail.com." status replaces "sending"; form stays usable (manual resend, no auto-retry); appcheck_token_failure event with a code param fires in GA4 only when consent granted; message still lands in Firestore (monitoring mode).
result: issue
reported: "Shipped contact.js uses classic ReCaptchaV3Provider, but Firebase App Check console now marks the classic reCAPTCHA provider obsolete for new registrations (screenshot: 'reCAPTCHA está obsoleto. Usa reCAPTCHA Enterprise en su lugar') — owner was forced to register web-geohist as reCAPTCHA Enterprise. With an Enterprise registration, every post-activation submit fails token verification; the dormant failure path also cannot be exercised (no reCAPTCHA script loads while recaptchaSiteKey: ''). Localhost testing additionally blocked by API-key referrer restriction (API_KEY_HTTP_REFERRER_BLOCKED on identitytoolkit)."
severity: major

### 3. Visual check of new surfaces
expected: |
  View contact page (trigger the appcheck status via test 2) and privacy.html section 3 in desktop + mobile browser. Appcheck status node styled consistently with other form-status variants; privacy li renders as part of the SDK-inventory list with correct typography.
result: pass

## Summary

total: 3
passed: 2
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-09-2
  truth: "Post-activation submits pass token verification (zero visible change in monitoring mode); token-failure path shows contact.status.appcheck with consent-gated appcheck_token_failure event"
  status: failed
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
    - "Swap ReCaptchaV3Provider → ReCaptchaEnterpriseProvider in js/contact.js:151 (same CDN module export)"
    - "Paste site key into js/firebase-config.js recaptchaSiteKey (activation, one-line §3 step)"
    - "Update COVERAGE.md + 09-RUNBOOK.md to Enterprise reality; record D-01 revision in docs"
    - "Owner console step (not agent): reCAPTCHA admin 'Migrate keys' to GCP so the v3 key is Enterprise-managed (site key value unchanged)"
    - "Deploy, then re-run UAT tests 1 (repeat) and 2"
  debug_session: "diagnosed inline during UAT — evidence: owner console screenshots (Firebase App Check registration + reCAPTCHA admin), Google docs (docs.cloud.google.com/recaptcha/docs/keys, 2026-08-26), code inspection contact.js:151"
