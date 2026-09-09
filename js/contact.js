/*!
 * geohisttrivia.com — contact form submit pipeline (FIRE-04/FIRE-05).
 *
 * Classic defer script, module-free, zero globals (D-26 house style).
 * Owns /geohist/contact.html: the honeypot bot swallow, client-side
 * validation (UX only — the Firestore rules are the real schema gate),
 * the in-flight double-submit guard, and the lazy one-time dynamic
 * import of the four pinned 12.18.0 CDN modules (app + auth +
 * firestore + app-check) at submit time.
 *
 * App Check (FIRE-07/FIRE-08) is the submit-time attestation layer:
 * initialized once per session AFTER the default app and BEFORE
 * auth/firestore, only when the config site key is non-empty (dormant
 * = monitoring mode pre-activation, zero user-visible change).
 *
 * The pipeline is probe-gated (G-09-7): BEFORE any app-check init a
 * bounded ~3s reachability probe fetches the exact reCAPTCHA
 * Enterprise script URL the SDK itself loads. Unreachable (probe
 * reject or timer — ad-blocked visitors) → the init call is SKIPPED
 * entirely: with no registered app-check service the Auth SDK's
 * optional app-check header lookup returns undefined and
 * short-circuits, so signInAnonymously + addDoc proceed un-attested
 * fast — there is no SDK-internal await left to hang (the provider's
 * script tag sets onload with NO onerror in CDN-pinned 12.18.0 code
 * that cannot be patched; skipping registration is the only lever).
 * The probe failure is recorded as a synthetic appCheck/probe-failed
 * code and surfaces through the same post-delivery re-throw.
 * Reachable → unchanged bounded explicit-gate semantics: the explicit
 * getToken() gate is the only observable token-failure seam in
 * monitoring mode — the SDK swallows failures elsewhere — and it
 * is raced against a ~10s timer (TOKEN_TIMEOUT_MS): with reCAPTCHA
 * scripts network-blocked the SDK's promise would otherwise never
 * settle and the submit would hang on "sending" forever (G-09-5A).
 * On token failure (reject OR timeout) the failure code is recorded
 * and the chain STILL delivers the message un-attested —
 * signInAnonymously + addDoc proceed while the keyed appcheck status
 * shows and the persano:appcheck document event dispatches (consent.js
 * routes it to the consent-gated appcheck_token_failure Analytics
 * metric; runbook §7 monitoring-mode semantics, G-09-5B). After
 * delivery the recorded code is thrown as a synthetic appCheck/*-
 * family error so the onSubmit catch remains the single mapping
 * point (D-06/D-07, unchanged). No auto-retry — the visitor resends
 * manually (D-07). The token rides the X-Firebase-AppCheck request
 * header via the SDK and is never written into the addDoc payload.
 *
 * The pipeline is deliberately independent of the banner choice: it
 * neither reads nor writes the banner storage key and never imports
 * the Analytics module — the form is the compliance surface that must
 * work identically after either banner answer (out-of-scope table:
 * "Analytics/form blocking on choice-deny"). That is why only the
 * fork's auth+firestore arm appears below.
 *
 * Failure policy: any Firebase failure surfaces the keyed error status
 * and logs the FirebaseError code to the console for debuggability —
 * the page itself never breaks.
 */
(function () {
  'use strict';

  var CDN_BASE = 'https://www.gstatic.com/firebasejs/12.18.0/';
  var TOPICS = ['general', 'bug', 'feedback', 'deletion'];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var EMAIL_MAX = 254;
  var MESSAGE_MIN = 1;
  var MESSAGE_MAX = 5000;
  var NAME_MAX = 100;
  var TOKEN_TIMEOUT_MS = 10000; /* G-09-5A: bounded getToken race — an
                                   unbounded await on a network-blocked
                                   reCAPTCHA deadlocks the form ("sending"
                                   forever, .finally never runs); ~10s
                                   tolerates slow tokens without trapping
                                   the visitor */
  var PROBE_TIMEOUT_MS = 3000;  /* G-09-7: bounded reCAPTCHA reachability
                                   probe — the probe guards the only hang
                                   entry point (app-check registration), so
                                   an unbounded probe would reintroduce the
                                   same deadlock class it removes. DevTools/
                                   ad-blocker blocks reject the fetch near-
                                   instantly (blocked scenario pays ~0ms);
                                   a healthy connection pays one no-cors
                                   fetch once per session (cache-once). */
  var ENTERPRISE_JS_URL = 'https://www.google.com/recaptcha/enterprise.js?render=explicit';
  /* ^ G-09-7 probe target: the exact script URL the pinned 12.18.0 SDK
   * loads for the Enterprise provider (host + render=explicit — verified
   * in the gstatic 12.18.0 bundle). Exact-pinning makes the URL stable;
   * a deliberate version bump must re-verify it against the new bundle. */

  var form = null;
  var submitButton = null;
  var nameEl = null;
  var emailEl = null;
  var topicEl = null;
  var messageEl = null;
  var statusEls = {};    /* data-status -> element map (Pattern 5) */
  var modules = null;    /* cached { app, auth, firestore, appCheck } namespaces */
  var importing = null;  /* in-flight import promise — import once */
  var appCheckInstance = null; /* cache-once guard — "Can be called only
                                  once per app"; same-options idempotence
                                  is NOT relied on (resubmit safety) */

  /* ---- Pre-authored keyed status variants (research Pattern 5):
   * static elements present at DOMContentLoaded; JS only toggles
   * hidden, never injects text against the dictionaries. ---- */

  function showStatus(variant) {
    for (var key in statusEls) {
      if (Object.prototype.hasOwnProperty.call(statusEls, key)) {
        if (key === variant) {
          statusEls[key].removeAttribute('hidden');
        } else {
          statusEls[key].setAttribute('hidden', '');
        }
      }
    }
  }

  /* ---- Client validation: UX only, runs BEFORE any network activity.
   * Caps mirror firebase/firestore.rules exactly (email <=254,
   * message 1..5000) so honest input never 403s at the wall. ---- */

  function validate(values) {
    if (!values.email || values.email.length > EMAIL_MAX || !EMAIL_RE.test(values.email)) {
      return 'invalid-email';
    }
    if (values.message.length < MESSAGE_MIN || values.message.length > MESSAGE_MAX) {
      return 'invalid-message';
    }
    if (TOPICS.indexOf(values.topic) === -1) {
      return 'invalid-topic';
    }
    return null;
  }

  function readValues() {
    var name = nameEl.value.trim();
    /* maxlength already caps in-browser; clamp defends programmatic input
     * (the optional name has no dedicated status variant) */
    if (name.length > NAME_MAX) name = name.slice(0, NAME_MAX);
    return {
      name: name,
      email: emailEl.value.trim(),
      topic: topicEl.value,
      message: messageEl.value.trim()
    };
  }

  /* ---- Lazy one-time CDN import (submit-time only: the page carries
   * zero Firebase bytes until a real submit). ---- */

  function loadModules() {
    if (modules) return Promise.resolve(modules);
    if (!importing) {
      importing = Promise.all([
        import(CDN_BASE + 'firebase-app.js'),
        import(CDN_BASE + 'firebase-auth.js'),
        import(CDN_BASE + 'firebase-firestore.js'),
        import(CDN_BASE + 'firebase-app-check.js')
      ]).then(function (loaded) {
        modules = { app: loaded[0], auth: loaded[1], firestore: loaded[2], appCheck: loaded[3] };
        return modules;
      });
    }
    return importing;
  }

  /* ---- Bounded token race (G-09-5A): the explicit getToken call is
   * the only observable failure seam, so an unbounded await on a
   * network-blocked reCAPTCHA leaves the submit stuck on "sending"
   * forever. Race the token promise against a timer: on settle, clear
   * the timer and pass through; on timeout, reject with a synthetic
   * Error carrying code appCheck/token-timeout (the case-tolerant
   * appcheck-family regex in the onSubmit catch matches it). A
   * late-settling getToken after the race is harmless — the returned
   * token object is never read (the SDK auto-attaches via the
   * X-Firebase-AppCheck header). ---- */

  function raceToken(tokenPromise) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        var err = new Error('App Check token fetch timed out');
        err.code = 'appCheck/token-timeout';
        reject(err);
      }, TOKEN_TIMEOUT_MS);
      tokenPromise.then(
        function (token) {
          clearTimeout(timer);
          resolve(token);
        },
        function (reason) {
          clearTimeout(timer);
          reject(reason);
        }
      );
    });
  }

  /* ---- Bounded reCAPTCHA reachability probe + skip-init (G-09-7):
   * why this kills the SDK-internal hang. The Auth SDK independently
   * awaits an App Check token for the X-Firebase-AppCheck header
   * BEFORE every auth request (AuthImpl._getAdditionalHeaders →
   * app-check-internal getToken, an optional-chain lookup on the
   * registered service). With reCAPTCHA scripts network-blocked, the
   * Enterprise provider's script tag — onload only, NO onerror, in
   * CDN-pinned 12.18.0 code that cannot be patched — hangs forever,
   * so that internal await is bounded only by the Auth SDK's own
   * 30/60s NetworkTimeout → the submit dies as an auth-family error
   * ~1 minute in with no delivery and no event (the G-09-5B recovery
   * bounds only OUR explicit gate, not the SDK's internal one). Fix
   * shape: never register the app-check service while reCAPTCHA is
   * unreachable. With NO registered service the Auth SDK's optional
   * lookup returns undefined and the optional-chain short-circuits —
   * there is no token await left to hang, so the signUp fetch goes out
   * immediately and addDoc follows (un-attested, seconds). The probe
   * fetches the exact script URL the SDK itself loads (no-cors,
   * no-store) raced against PROBE_TIMEOUT_MS: a rejected or hung probe
   * settles within ~3s and routes to the skip path — the probe itself
   * can never stall the submit. Success (opaque response) runs the
   * same init as shipped since 09-01 (cache-once guard into
   * appCheckInstance; Enterprise provider with the config site key;
   * token auto-refresh off). Accepted residual edge: a visitor who
   * completes one attested submit (instance cached) and THEN enables
   * a reCAPTCHA blocker mid-session re-enters the SDK-internal hang —
   * 12.18.0 offers no un-registration, so it stays bounded only by
   * the Auth NetworkTimeout as today; fresh environments (the UAT
   * test-7 scenario, the dominant ad-blocker case) are fully covered.
   * Accepted, not engineered around. ---- */

  function prepareAppCheck(mods, app, config) {
    if (appCheckInstance) return Promise.resolve(appCheckInstance);
    return new Promise(function (resolveProbe) {
      var timer = setTimeout(function () {
        resolveProbe(false);         /* hung probe → skip path */
      }, PROBE_TIMEOUT_MS);
      var probe;
      try {
        probe = fetch(ENTERPRISE_JS_URL, { mode: 'no-cors', cache: 'no-store' });
      } catch (syncFailure) {
        probe = Promise.reject(syncFailure);
      }
      probe.then(
        function () { clearTimeout(timer); resolveProbe(true); },
        function () { clearTimeout(timer); resolveProbe(false); }
      );
    }).then(function (reachable) {
      if (!reachable) return null;   /* init is NEVER called — no
                                        app-check service registered */
      appCheckInstance = mods.appCheck.initializeAppCheck(app, {
        provider: new mods.appCheck.ReCaptchaEnterpriseProvider(config.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: false
      });
      return appCheckInstance;
    });
  }

  function send(values) {
    return loadModules().then(function (mods) {
      var config = window.persanoFirebaseConfig;
      if (!config) throw new Error('Firebase config missing');
      /* Idempotent default app: reuse when the granted analytics path
       * already initialized it, initialize once otherwise. */
      var app;
      try {
        app = mods.app.getApp();
      } catch (noDefault) {
        app = mods.app.initializeApp(config);
      }
      /* App Check block (FIRE-07): submit-time attestation layer, init
       * order app → appCheck (probe-gated, G-09-7) → getToken → auth →
       * firestore (docs requirement). Dormant while recaptchaSiteKey is
       * empty — the legacy chain runs unchanged: no probe, no appcheck
       * init, no race, no recorded failure (byte-identical to
       * pre-G-09-5). When active: prepare FIRST (G-09-7) — the helper
       * resolves the cached-or-new instance, or null when reCAPTCHA is
       * unreachable (probe reject or ~3s timer) so the init call is
       * skipped entirely and no app-check service is registered (the
       * Auth SDK's optional header lookup then short-circuits — no
       * SDK-internal await left to hang; the probe failure code is
       * recorded and surfaces after delivery). With an instance: the
       * explicit getToken call is gated — monitoring mode swallows
       * token failures elsewhere, so this is the only observable
       * failure seam (research Pattern 1/2). The call is raced against
       * ~10s (G-09-5A) and a failure — reject OR timeout — is recorded,
       * not fatal: the message still reaches Firestore un-attested
       * (G-09-5B, runbook §7 monitoring-mode semantics) and the
       * recorded code is thrown after delivery so the onSubmit catch
       * maps it (single mapping point, no duplicated logic). The token
       * auto-attaches to the auth/firestore requests via the
       * X-Firebase-AppCheck header; it is NEVER added to the addDoc
       * payload. */
      var attested;
      var tokenFailureCode = ''; /* non-empty ⇒ a bounded failure was
                                    recorded (reachability probe OR token
                                    race); the code surfaces through the
                                    unchanged onSubmit mapping after
                                    addDoc */
      if (typeof config.recaptchaSiteKey === 'string' && config.recaptchaSiteKey !== '') {
        attested = prepareAppCheck(mods, app, config).then(function (instance) {
          if (!instance) {
            /* G-09-7 skip path: no instance to call the explicit gate
             * with — record the probe failure and proceed directly to
             * auth + addDoc (un-attested fast). */
            tokenFailureCode = 'appCheck/probe-failed';
            return;
          }
          /* Record-and-swallow (G-09-5B): a bounded-race token failure
           * neither hangs the submit nor aborts auth/addDoc — the catch
           * records the appcheck-family code (err.code when present, the
           * synthetic timeout code otherwise) and returns normally so
           * delivery proceeds un-attested. */
          return raceToken(mods.appCheck.getToken(instance, false))
            .catch(function (err) {
              tokenFailureCode = (err && err.code) ? String(err.code) : 'appCheck/token-timeout';
            });
        });
      } else {
        attested = Promise.resolve();
      }
      return attested.then(function () {
        var auth = mods.auth.getAuth(app);
        var authReady = auth.currentUser
          ? Promise.resolve()
          : mods.auth.signInAnonymously(auth);   /* submit-time anonymous auth */
        return authReady.then(function () {
          var payload = {
            email: values.email,
            topic: values.topic,
            message: values.message,
            createdAt: mods.firestore.serverTimestamp()
          };
          /* Optional name: included ONLY when non-empty — a present null
           * would fail the rules' string-type guard (Pitfall 4 adjacency). */
          if (values.name) payload.name = values.name;
          return mods.firestore.addDoc(
            mods.firestore.collection(mods.firestore.getFirestore(app), 'messages'),
            payload
          );
        });
      }).then(function (delivered) {
        /* Post-delivery surface (G-09-5B/G-09-7): the recorded failure
         * code (token race OR reachability probe) is thrown only AFTER
         * the message landed, so the
         * EXISTING onSubmit catch maps it — appcheck status + event
         * fire, form stays usable (not reset) for the email fallback,
         * no auto-retry. send() adds no mapping logic of its own. */
        if (tokenFailureCode) {
          var late = new Error('App Check token failure (message delivered un-attested)');
          late.code = tokenFailureCode;
          throw late;
        }
        return delivered;
      });
    });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var hp = document.getElementById('hp_website');
    if (hp && hp.value !== '') {
      /* Bot swallow: silent fake success, form reset, zero network. */
      showStatus('success');
      form.reset();
      return;
    }
    var values = readValues();
    var problem = validate(values);
    if (problem) {
      showStatus(problem);
      return;
    }
    submitButton.disabled = true;              /* in-flight double-submit guard */
    showStatus('sending');
    send(values)
      .then(function () {
        showStatus('success');
        form.reset();
      })
      .catch(function (err) {
        var code = (err && err.code) ? String(err.code) : '';
        /* App Check-family mapping (D-06/D-07): case-tolerant prefix —
         * the runtime literal is camelCase appCheck/, the hyphenated
         * form never appears (research Pattern 3) — plus permission-
         * denied (post-enforcement Firestore wall; under the create-
         * only ruleset attribution is unambiguous, and it still maps
         * here even when the write was attempted un-attested). Init-
         * time and token-time appCheck/* failures are one family, one
          * status — codes arriving may be genuine FirebaseErrors OR the
          * synthetic post-delivery re-throw from send() (a recorded
          * reachability-probe failure, a recorded getToken failure, or
          * the appCheck/token-timeout race reject):
          * same family, same keyed status, same event. The appcheck
         * path does NOT reset the form — fields stay so the visitor
         * can copy them into the email fallback. No auto-retry — the
         * visitor resends manually. */
        var isAppCheck = /^app-?check\//i.test(code) || code === 'permission-denied';
        if (isAppCheck) {
          showStatus('appcheck');
          document.dispatchEvent(new CustomEvent('persano:appcheck', {
            detail: { code: code ? code.slice(0, 40) : 'unknown' }
          }));
        } else {
          showStatus('error');
        }
        /* log the FirebaseError code (appCheck/fetch-network-error,
         * permission-denied, auth/operation-not-allowed, …) for
         * debuggability — users see the keyed status only */
        if (err && err.code) {
          console.error('Contact form submit failed:', err.code);
        } else if (err) {
          console.error('Contact form submit failed:', err);
        }
      })
      .finally(function () {
        submitButton.disabled = false;
      });
  }

  /* Init — wire once; absent form (defensive) is a clean no-op. */
  function init() {
    form = document.getElementById('contact-form');
    if (!form) return;
    nameEl = document.getElementById('contact-name');
    emailEl = document.getElementById('contact-email');
    topicEl = document.getElementById('contact-topic');
    messageEl = document.getElementById('contact-message');
    submitButton = form.querySelector('.form-submit');
    var nodes = form.querySelectorAll('.form-status[data-status]');
    for (var i = 0; i < nodes.length; i++) {
      statusEls[nodes[i].getAttribute('data-status')] = nodes[i];
    }
    form.addEventListener('submit', onSubmit);
  }

  /* defer normally guarantees post-parse execution (house style); the
   * readyState guard is the belt-and-suspenders for non-defer loading. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();