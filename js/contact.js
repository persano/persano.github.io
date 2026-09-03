/*!
 * persano.github.io — contact form submit pipeline (FIRE-04/FIRE-05).
 *
 * Classic defer script, module-free, zero globals (D-26 house style).
 * Owns /geohist/contact.html: the honeypot bot swallow, client-side
 * validation (UX only — the Firestore rules are the real schema gate),
 * the in-flight double-submit guard, and the lazy one-time dynamic
 * import of the three pinned 12.18.0 CDN modules (app + auth +
 * firestore) at submit time.
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

  var form = null;
  var submitButton = null;
  var nameEl = null;
  var emailEl = null;
  var topicEl = null;
  var messageEl = null;
  var statusEls = {};    /* data-status -> element map (Pattern 5) */
  var modules = null;    /* cached { app, auth, firestore } namespaces */
  var importing = null;  /* in-flight import promise — import once */

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
        import(CDN_BASE + 'firebase-firestore.js')
      ]).then(function (loaded) {
        modules = { app: loaded[0], auth: loaded[1], firestore: loaded[2] };
        return modules;
      });
    }
    return importing;
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
        showStatus('error');
        /* log the FirebaseError code (auth/operation-not-allowed,
         * permission-denied, …) for debuggability — users see the
         * keyed generic status only */
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