/*!
 * persano.github.io — GDPR consent gate + post-grant Analytics loader.
 *
 * Classic defer script, module-free, zero globals (D-26 house style).
 * Owns the single consent choice (localStorage "persano.consent",
 * versioned JSON {v:1, analytics:'granted'|'denied', ts:<ISO-8601>}),
 * the fixed-bottom banner (D-42..D-45), the footer retraction link
 * (D-44), and the post-grant Analytics loader (FIRE-02: the dynamic
 * import IS the gate — zero SDK bytes before an affirmative grant).
 *
 * Events (FIRE-03, D-50/D-51): play_badge_click {page} on .badge-cta
 * anchors and language_switch {from,to} on the persano:langchange
 * document event — wired ONLY after a supported analytics instance
 * exists, and each send re-checks the stored choice, so retraction
 * stops sends with zero unload logic (D-44). Every persano:langchange
 * occurrence is logged, including the init-time auto-apply (locked
 * choice; zero engine changes).
 *
 * Failure policy: any storage or SDK failure degrades silently — the
 * page must never break because analytics failed.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'persano.consent';
  var CDN_BASE = 'https://www.gstatic.com/firebasejs/12.18.0/';
  var APP_MODULE = CDN_BASE + 'firebase-app.js';
  var ANALYTICS_MODULE = CDN_BASE + 'firebase-analytics.js';

  var banner = null;
  var analyticsModule = null;   /* module namespace (logEvent, lever) */
  var analytics = null;         /* supported instance, or null */
  var loading = false;

  /* ---- Consent store (research Pattern 1) ----
   * One versioned JSON value; read validates the shape and treats
   * absent/malformed/storage-blocked as no choice (fail-closed:
   * banner re-shows). Write failure keeps the choice session-only. */

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var choice = JSON.parse(raw);
      if (choice && choice.v === 1 &&
          (choice.analytics === 'granted' || choice.analytics === 'denied') &&
          typeof choice.ts === 'string') {
        return choice;
      }
      return null;                       /* malformed → treat as no choice */
    } catch (err) {
      return null;                       /* restricted storage: fail closed */
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: 1,
        analytics: value,
        ts: new Date().toISOString()
      }));
    } catch (err) {
      /* session-only choice: banner returns next visit (fail-closed) */
    }
  }

  function isGranted() {
    var choice = readConsent();
    return !!choice && choice.analytics === 'granted';
  }

  /* ---- Banner control ---- */

  function showBanner() {
    if (banner) banner.removeAttribute('hidden');
  }

  function hideBanner() {
    if (banner) banner.setAttribute('hidden', '');
  }

  /* ONE delegated handler on the section routes both buttons (equal
   * prominence, D-43); the markup carries no dismiss control. */
  function bindBanner() {
    if (!banner) return;
    banner.addEventListener('click', function (ev) {
      var button = (ev.target && typeof ev.target.closest === 'function')
        ? ev.target.closest('button[data-consent]')
        : null;
      if (!button) return;
      ev.preventDefault();
      choose(button.getAttribute('data-consent') === 'granted' ? 'granted' : 'denied');
    });
  }

  /* Choice entry point (initial Accept/Reject or a later re-choice):
   * persist with a fresh ISO timestamp, hide, and drive the gate. */
  function choose(value) {
    saveChoice(value);
    hideBanner();
    if (value === 'granted') {
      if (analytics) {
        setCollection(true);             /* re-grant: re-enable this session */
      } else if (!loading) {
        loadAnalytics();
      }
    } else if (analytics) {
      setCollection(false);              /* retraction lever (D-44) */
    }
    /* deny while a load is in flight: the post-load race guard handles it */
  }

  /* ---- FIRE-03 wrappers (send only while the choice is granted) ---- */

  function logEventSafe(name, params) {
    if (!analytics || !analyticsModule || !isGranted()) return;
    try {
      analyticsModule.logEvent(analytics, name, params);
    } catch (err) {
      /* a failed send must never break the page */
    }
  }

  function wireEvents() {
    var badges = document.querySelectorAll('.badge-cta');
    for (var i = 0; i < badges.length; i++) {
      badges[i].addEventListener('click', function () {
        logEventSafe('play_badge_click', { page: location.pathname });
      });
    }
    document.addEventListener('persano:langchange', function (ev) {
      var detail = (ev && ev.detail) ? ev.detail : {};
      logEventSafe('language_switch', { from: detail.from, to: detail.to });
    });
  }

  /* ---- Post-grant loader (research Pattern 2; Pitfalls 3 + 10) ---- */

  function loadAnalytics() {
    var config = window.persanoFirebaseConfig;
    if (!config) return;                 /* config absent: silent no-op */
    loading = true;
    import(APP_MODULE)                   /* app module first: initializeApp */
      .then(function (appModule) {
        return import(ANALYTICS_MODULE).then(function (module) {
          return { appModule: appModule, module: module };
        });
      })
      .then(function (mods) {
        analyticsModule = mods.module;
        var app = mods.appModule.initializeApp(config);
        return mods.module.isSupported().then(function (supported) {
          /* isSupported guard (Pitfall 3): getAnalytics throws bare */
          return supported ? mods.module.getAnalytics(app) : null;
        });
      })
      .then(function (instance) {
        loading = false;
        if (!instance) return;
        /* Race guard (Pitfall 10): re-read the stored choice after the
         * async load — a retract-during-load must not start collection. */
        if (!isGranted()) {
          disableCollection(instance);
          return;                        /* skip event wiring */
        }
        analytics = instance;
        wireEvents();
      })
      .catch(function () {
        loading = false;
        /* analytics failure must never break the page (silent degrade) */
      });
  }

  /* Retraction lever (D-44): verified SDK export — flips the
   * ga-disable flag; own wrappers additionally no-op via isGranted(). */
  function setCollection(enabled) {
    if (!analytics || !analyticsModule) return;
    try {
      analyticsModule.setAnalyticsCollectionEnabled(analytics, enabled);
    } catch (err) {
      /* lever failure: wrappers still stop sends via isGranted() */
    }
  }

  function disableCollection(instance) {
    if (!analyticsModule) return;
    try {
      analyticsModule.setAnalyticsCollectionEnabled(instance, false);
    } catch (err) {
      /* degrade silently */
    }
  }

  /* ---- Retraction UI (D-44): footer Consent link re-opens the banner
   * regardless of stored choice; the banner buttons then re-choose. ---- */

  function bindReopen() {
    var links = document.querySelectorAll('.consent-reopen');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        showBanner();
      });
    }
  }

  /* Init — the banner ships hidden in markup; un-hide only when no valid
   * stored choice exists (absent, malformed, or storage-blocked). */
  function init() {
    try {
      banner = document.querySelector('.consent-banner');
      bindBanner();
      bindReopen();
      if (readConsent()) {
        hideBanner();
        if (isGranted()) loadAnalytics();
      } else {
        showBanner();
      }
    } catch (err) {
      /* consent failure must never break the page */
    }
  }

  /* defer normally guarantees post-parse execution (house style); the
   * readyState guard is the belt-and-suspenders for non-defer loading. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();