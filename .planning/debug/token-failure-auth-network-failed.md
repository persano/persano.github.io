---
status: diagnosed
trigger: "G-09-7: Token-failure path regression after 09-04-PLAN gap-closure deploy. reCAPTCHA network-blocked in DevTools → contact submit takes ~60s then GENERIC error, console 'Contact form submit failed: auth/network-request-failed' (contact.js:308), message does NOT land in Firestore (newest doc Sep 8 19:22 = yesterday test-4). Expected: appcheck status (email-fallback) within ~10s, message lands un-attested."
created: 2026-09-09
updated: 2026-09-09
audit_acknowledged:
  milestone: v2.0
  at: 2026-09-11
  status: diagnosed
---

## Current Focus

reasoning_checkpoint:
  hypothesis: "The Auth SDK independently awaits an App Check token (via app-check-internal → AuthImpl._getAdditionalHeaders() → _getAppCheckToken()) BEFORE sending the signUp fetch. With reCAPTCHA script blocked, the app-check provider's token machinery hangs forever (script tag has onload only, no onerror; getToken$1 awaits a Deferred resolved only in onload), so the internal await hangs, is bounded only by the Auth SDK's own NetworkTimeout (30s desktop / 60s mobile UA), which rejects auth/network-request-failed → signUp fetch never sent → addDoc never runs. The shipped 10s raceToken bounds only OUR explicit getToken gate, not the SDK's internal await — so the G-09-5B 'deliver un-attested on token failure' design is unreachable in the script-blocked scenario."
  confirming_evidence:

    - "Prod bundle firebase-auth.js 12.18.0 (gstatic — exact bytes the browser ran): _performApiRequest wraps every auth request in _performFetchWithErrorHandling, which creates NetworkTimeout and Promise.race([r(), t.promise]); r() FIRST awaits e._getAdditionalHeaders() BEFORE FetchProvider.fetch()"
    - "AuthImpl._getAdditionalHeaders: 'const r=await this._getAppCheckToken()' → appCheckServiceProvider.getImmediate({optional:true})?.getToken() — unbounded await for the X-Firebase-AppCheck header"
    - "NetworkTimeout constructor: timer rejects _createError(auth,'network-request-failed') at Delay.get() — new Delay(3e4,6e4): 30s desktop, 60s mobile-UA; catch rethrows FirebaseError as-is"
    - "firebase-app-check.js 12.18.0: loadReCAPTCHAEnterpriseScript sets t.onload=e with NO onerror; initializeEnterprise returns a Deferred resolved only in the onload callback; getToken$1 awaits initialized.promise → with script blocked the promise never settles; the resolve-with-dummy-error path ({error:'UNKNOWN_ERROR'} / makeDummyTokenResult) is only reachable on provider REJECTION (e.g. localhost exchange 400), never on hang"
    - "Timeline math: 10s race + 30s/60s auth NetworkTimeout ≈ 40–70s total = observed 'like a minute'"
    - "contact.js:295 maps auth/* → showStatus('error') (generic) per D-06/D-07; console.error :308 printed auth/network-request-failed — matches the non-appcheck else-branch exactly"
    - "firestore.rules:10 'allow create: if request.auth != null' — addDoc never ran (authReady rejected first); no doc possible"
  falsification_test: "Un-block reCAPTCHA (same incognito session, remove DevTools block): if hypothesis true, submit succeeds normally with zero appcheck status (token settles ~1s, header attaches) — observed in UAT test 4. Conversely, blocking ONLY the script (keep reload unblocked) still produces the same ~40s auth/network-request-failed hang. Also: NetworkTimeout of 30s (desktop) predicts total ≈40s; if total were ~10s+instant, the block-instead-of-hang theory would be required instead."
  fix_rationale: "Root cause is an uncovered seam: the 09-04 fix bounds the explicit getToken gate only; the Auth SDK's own header-attachment await must also be prevented from hanging. Any fix that keeps App Check initialized while reCAPTCHA is blocked cannot deliver un-attested — the SDK-internal await starves the signUp fetch. Fix must make the whole pipeline settle (e.g., probe reCAPTCHA reachability BEFORE initializeAppCheck; on probe failure skip init → optional:true returns undefined → no header await → auth+addDoc proceed un-attested fast → appcheck status + event still dispatch via synthetic code)."
  blind_spots: "Did not verify Delay.get() per-call backoff state across multiple auth instances (first call = 30s assumed, matches timeline); did not empirically reproduce the network block (owner-only DevTools) — diagnosis rests on bundle-source traces + error-signature/timeline math; user-side pihole blocklist contents beyond the screenshot (analytics/firebaselogging) unknown, but neither matters to the identitytoolkit path; mobile vs desktop UA of the test device unknown (30s vs 60s arm — both fit 'like a minute')."
  candidate_causes:

    - "code: shipped raceToken bounds only the explicit getToken gate; Auth SDK's internal X-Firebase-AppCheck header await is bounded only by its own 30s/60s NetworkTimeout → auth/network-request-failed (design gap in G-09-5B scope)"
    - "environment: DevTools block of *recaptcha* + *google.com/reload* (simulating an adblocker visitor — §8's measured population) starves the app-check provider into a permanent hang"
    - "config: ruled out — site key active and correct (UAT test 4 passed with zero appcheck status)"
    - "data: ruled out — no data involvement; Firestore rules are create-with-auth only"
  and_gate: "YES — requires BOTH the code seam (SDK-internal header await hangs when provider hangs) AND the environment trigger (reCAPTCHA script blocked). In a healthy environment the seam is invisible (token settles ~1s, header attaches, test 4 passes)."
  bug_class: "Bohrbug (deterministic — every script-blocked submit produces the same timeline) → reproduction + code-trace route used"

hypothesis: CONFIRMED (see reasoning_checkpoint)
test: Done — prod-bundle source trace + timeline-signature math (documented in Evidence)
expecting: n/a
next_action: return_diagnosis — goal find_root_cause_only; no fix applied

## Symptoms

expected: Per 09-USER-SETUP.md checklist (prod https://geohisttrivia.com/geohist/contact.html, incognito, DevTools request blocking for BOTH *recaptcha* AND *google.com/reload*, valid submit, analytics consent granted): contact.status.appcheck (email fallback wording) within ~10s, submit button re-enables, form NOT reset, message lands in Firestore messages un-attested (monitoring mode), appcheck_token_failure event dispatched consent-gated.
actual: Status ended GENERIC error wording ("Algo salió mal. Escribe a santiagopostorivo@gmail.com.") — NOT appcheck email-fallback wording. ~60 seconds wait. Console: "Contact form submit failed: auth/network-request-failed" at contact.js:308 (onSubmit promise callback chain). No new doc in Firestore messages (newest visible doc Sep 8 19:22 = yesterday's passing test 4).
errors: console.error "Contact form submit failed: auth/network-request-failed" contact.js:308 (thrown/reported onSubmit promise chain at contact.js:279)
reproduction: Test 7 in UAT (09-UAT.md) — prod incognito, DevTools request blocking *recaptcha* + *google.com/reload*, valid submit, consent granted.
started: Discovered during UAT 2026-09-09, AFTER 09-04-PLAN gap-closure deploy (bridge 55dba3d, Actions run 34408285918 green). Prior: G-09-5 diagnosed (no getToken timeout; token rejection aborting auth+addDoc). 09-04-PLAN claims: bounded ~10s TOKEN_TIMEOUT_MS race (raceToken), record-and-swallow + post-delivery synthetic re-throw, message delivers un-attested on token reject OR timeout.

## Eliminated

- hypothesis: "DevTools block pattern accidentally matched the auth endpoint (identitytoolkit blocked)"
  evidence: "Neither block pattern (*recaptcha*, *google.com/reload*) matches identitytoolkit.googleapis.com. Decisive: a BLOCKED fetch fails instantly via the fetch-TypeError catch (_fail(e,'network-request-failed')) → total ≈10s; observed ≈40–70s = 10s race + 30/60s NetworkTimeout hang. Also test 4 (same browser, no blocks) passed yesterday."
  timestamp: 2026-09-09

- hypothesis: "raceToken never wired / timeout path skips delivery (hints 2a, 2b)"
  evidence: "Shipped diff d3a68c7 + js/contact.js:149-167,214-217,241-253 show the race wired around mods.appCheck.getToken with record-and-swallow and post-delivery re-throw. The observed error is AUTH-family, which proves the chain PROCEEDED past the attested await (an appcheck-path failure would surface as appCheck/* and map to appcheck status)."
  timestamp: 2026-09-09

- hypothesis: "Auth SDK internal retry/backoff caused the extra ~50s"
  evidence: "Prod firebase-auth.js contains zero retry logic for network failures (grep: no RETRY refs; 'retry' only in error-message text). The only bound is the single NetworkTimeout race (Delay 30s/60s)."
  timestamp: 2026-09-09

- hypothesis: "Auth's own /v2/recaptchaConfig init fetch got blocked (URL contains 'recaptcha')"
  evidence: "_initializeRecaptchaConfig is called only from _verifyPhoneNumber (phone/MFA flows) and the public initializeRecaptchaConfig export — never on the anonymous signUp path, never during getAuth init."
  timestamp: 2026-09-09

## Evidence

- timestamp: 2026-09-09
  checked: "js/contact.js (full, 341 lines) + shipped diff d3a68c7"
  found: "09-04 fix IS shipped and correct as written: TOKEN_TIMEOUT_MS=10000 (L53), raceToken (L149-167), record-and-swallow catch (L214-217), post-delivery synthetic re-throw (L241-253). Mapping L295: /^app-?check\\//i or permission-denied → appcheck status; everything else → showStatus('error')."
  implication: "Shipped fix works as designed for the rejection path; the failure is in the UNCOVERED seam beyond it (rules out hints 2a/2b)."

- timestamp: 2026-09-09
  checked: "Prod bundle firebase-auth.js 12.18.0 fetched from gstatic (exact bytes the user's browser executed)"
  found: "_performApiRequest → _performFetchWithErrorHandling: 'const t=new NetworkTimeout(e), i=await Promise.race([r(),t.promise])' where r() FIRST does 'a=await e._getAdditionalHeaders()' BEFORE FetchProvider.fetch(). AuthImpl._getAdditionalHeaders: 'const r=await this._getAppCheckToken(); r&&(e[\"X-Firebase-AppCheck\"]=r)'. _getAppCheckToken: 'await this.appCheckServiceProvider.getImmediate({optional:true})?.getToken()'."
  implication: "Every auth request (incl. anonymous signUp) awaits an App Check token before the fetch is sent. With the token hung, the request never starts."

- timestamp: 2026-09-09
  checked: "NetworkTimeout + Delay in same bundle"
  found: "NetworkTimeout rejects _createError(auth,'network-request-failed') after A.get() where A=new Delay(3e4,6e4); Delay.get() returns shortDelay (30s) on desktop UA, longDelay (60s) on mobile UA. The catch rethrows FirebaseError as-is."
  implication: "The hung internal await is bounded ONLY by this 30/60s timer, which then produces exactly the observed auth/network-request-failed."

- timestamp: 2026-09-09
  checked: "Prod bundle firebase-app-check.js 12.18.0 (same gstatic source)"
  found: "loadReCAPTCHAEnterpriseScript: 't.src=w+\"?render=explicit\",t.onload=e,document.head.appendChild(t)' — onload ONLY, no onerror. initializeEnterprise resolves its Deferred only inside the onload callback. getToken$1: 'const r=await t.initialized.promise' — with the script blocked (no onload), the Deferred never settles. getToken$2's dummy-result resolve path (makeDummyTokenResult / {error}) is reachable only on provider REJECTION, never on hang."
  implication: "Under reCAPTCHA script block, app-check getToken hangs FOREVER — for BOTH our explicit call (handled by the 10s race) and the Auth SDK's internal header await (NOT handled — 30/60s NetworkTimeout then rejects)."

- timestamp: 2026-09-09
  checked: "Timeline signature"
  found: "t≈0 submit + module import; t≈10s race rejects appCheck/token-timeout → recorded → auth starts; t≈10+30s (desktop) or +60s (mobile) NetworkTimeout rejects auth/network-request-failed; onSubmit catch → generic status + console.error :308. Observed: 'took like a minute' + exact error code + :308."
  implication: "Observed behavior matches the hang path end-to-end; also DISPROVES the identitytoolkit-block theory (would have been ~10s)."

- timestamp: 2026-09-09
  checked: "firestore.rules"
  found: "Line 10: 'allow create: if request.auth != null'"
  implication: "No message could land even if addDoc had run; in fact addDoc never ran (authReady rejected first). No-doc observation is correct-by-design given auth failure."

- timestamp: 2026-09-09
  checked: "Runbook §7 line 146 + localhost path in app-check bundle"
  found: "§7 claims 'localhost submissions succeed anyway — token fetch fails (bounded ~10s), request goes un-attested'. That holds on localhost because reCAPTCHA scripts LOAD there and the exchange 400s → provider.getToken REJECTS → getToken$2 resolves a dummy {error} result → auth proceeds un-attested fast. Script-BLOCK is a different failure mode (hang) where that recovery is unreachable."
  implication: "G-09-5B un-attested delivery is reachable ONLY via the rejection path; the hang path (adblocker visitors — §8's target population) never delivers and never fires the appcheck_token_failure event. The §8 metric is blind to exactly the population it is meant to measure."

## Resolution

root_cause: "AND-gate (code seam × environment trigger): (1) CODE — the G-09-5B un-attested-delivery recovery bounds only the explicit getToken gate (10s raceToken); Firebase Auth independently awaits an App Check token for the X-Firebase-AppCheck header (AuthImpl._getAdditionalHeaders → _getAppCheckToken → app-check-internal getToken) BEFORE sending the signUp fetch, and that await is bounded only by the Auth SDK's own NetworkTimeout (30s desktop / 60s mobile UA), which rejects 'auth/network-request-failed'; (2) ENVIRONMENT — with reCAPTCHA script + www.google.com/reload blocked (adblocker simulation), the app-check provider's token machinery hangs forever (enterprise script tag sets onload only, no onerror; getToken$1 awaits a Deferred resolved only in onload), so every SDK-internal token await hangs with it. Result: signUp never sent → addDoc never ran → generic error status per the (correct) D-06/D-07 mapping; no Firestore doc; appcheck status + event unreachable. Deviations from spec: ~60s (>10s bound) = 10s race + 30/60s auth-internal timeout; generic wording = correct mapping of an auth-family error whose ultimate cause is the token hang — the design did not anticipate that a token-blocked environment produces auth-family failures."
fix: [not applied — goal find_root_cause_only]
verification: [n/a — diagnosis only]
files_changed: []
