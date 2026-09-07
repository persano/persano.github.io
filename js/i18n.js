/*!
 * geohisttrivia.com — i18n engine (the site's first and only script).
 *
 * Classic defer script, module-free, zero dependencies, zero globals
 * (D-26). EN is the shipped raw HTML; this engine snapshots it exactly
 * once (D-28), resolves the visitor's language (stored preference >
 * first supported match across navigator.languages > en; D-32/D-33/D-34),
 * fetches a same-origin flat JSON dictionary when the target is not EN
 * (D-25) and swaps keyed text and attributes in place — textContent and
 * setAttribute ONLY, because keyed nodes carry plain text by the Phase-2
 * contract (no markup-parsing DOM assignment anywhere).
 *
 * Failure policy (D-30 / SC3): any storage, fetch, parse, or per-node
 * dictionary miss degrades silently — the page keeps its current (shipped
 * EN by default) content, with no error UI and no persistence.
 * document.documentElement.lang, <title> and the meta description ride
 * the same snapshot walk (I18N-04, D-27/D-29) — zero special-casing.
 */
(function () {
  'use strict';

  /* 20 supported languages (I18N-08) in the fixed D-03 grouped display
   * order — established trio first, then script groups: Latin, Cyrillic,
   * Greek (own script group, placed between Cyrillic and Indic), Indic,
   * Arabic, CJK. Detection no longer depends on this order (table-driven
   * DETECT_TABLE below); readPref()/switchTo() are order-insensitive, so
   * this array IS the switcher display order (D-03, no dynamic reorder). */
  var SUPPORTED = [
    'en', 'es', 'pt-BR',                    /* established trio */
    'fr', 'de', 'it', 'nl', 'pl', 'tr', 'vi', 'id',  /* Latin */
    'ru',                                   /* Cyrillic */
    'el',                                   /* Greek */
    'hi', 'bn',                             /* Indic */
    'ar', 'ur',                             /* Arabic — RTL */
    'ja', 'ko', 'zh'                        /* CJK */
  ];
  var STORAGE_KEY = 'persano.lang';
  var DICT_URL_PREFIX = '/js/i18n/';

  /* RTL languages (I18N-07): applyLanguage flips <html dir> in the same
   * pass as the lang sync — no separate DOM walk. Any other language
   * (including the EN-restore path) resets to ltr automatically. */
  var RTL_LANGS = { 'ar': 1, 'ur': 1 };

  var snapshot = [];   // EN baseline captured before any apply (D-28)
  var captured = false;
  var dicts = {};      // in-memory cache: lang -> parsed dictionary object
  var current = 'en';

  /* 1. Capture the EN snapshot exactly once, before any apply (Pitfall 1). */
  function captureSnapshot() {
    if (captured) return;
    var nodes = document.querySelectorAll('[data-i18n], [data-i18n-attr]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var entry = { el: el, text: el.textContent, attrs: [] };
      var spec = el.getAttribute('data-i18n-attr');
      if (spec) {
        var pairs = spec.split(',');
        for (var p = 0; p < pairs.length; p++) {
          var colon = pairs[p].indexOf(':');   /* FIRST colon only (Pitfall 5) */
          if (colon === -1) continue;
          var name = pairs[p].slice(0, colon).trim();
          var key = pairs[p].slice(colon + 1).trim();
          if (!name || !key) continue;
          entry.attrs.push({ name: name, key: key, value: el.getAttribute(name) });
        }
      }
      snapshot.push(entry);
    }
    captured = true;
  }

  /* One synchronous walk over the snapshot: dictionary values where the
   * key exists, snapshot EN values as the per-node/per-pair fallback.
   * dict === null means EN: restore the snapshot verbatim (D-28). */
  function applyLanguage(lang, dict) {
    for (var i = 0; i < snapshot.length; i++) {
      var entry = snapshot[i];
      if (entry.el.hasAttribute('data-i18n')) {
        var text = dict ? dict[entry.el.getAttribute('data-i18n')] : null;
        entry.el.textContent = (typeof text === 'string') ? text : entry.text;
      }
      for (var a = 0; a < entry.attrs.length; a++) {
        var pair = entry.attrs[a];
        var value = dict ? dict[pair.key] : null;
        entry.el.setAttribute(pair.name, (typeof value === 'string') ? value : pair.value);
      }
    }
    document.documentElement.lang = lang;   /* I18N-04 sync, same pass (D-29) */
    document.documentElement.dir = RTL_LANGS[lang] ? 'rtl' : 'ltr';   /* I18N-07 RTL flip, same pass (EN-restore resets ltr) */
  }

  /* Storage read — membership-validated (Pitfall 4); anything not in
   * SUPPORTED is treated as absent and detection re-runs. */
  function readPref() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return (value && SUPPORTED.indexOf(value) !== -1) ? value : null;
    } catch (err) {
      return null;                          /* restricted storage: re-detect */
    }
  }

  /* Detection: first supported TRANSLATED match across ALL
   * navigator.languages entries in preference order (D-32) — an
   * en-US-primary + es-secondary browser still gets Spanish, so en-*
   * and unknown tags do not stop the scan. Flat prefix table (I18N-06):
   * each candidate tag is lowercased and folded to its primary
   * subtag ('zh-Hant-CN' -> 'zh', 'in-ID' -> 'in'); a table hit returns
   * the mapped language, unknown tags keep scanning, EN is the terminal
   * return — never a table entry (D-32). The optional candidatesOverride
   * parameter exists for unit-test injection only (scripts/
   * i18n-detect.test.mjs); the browser path passes no argument. */
  var DETECT_TABLE = {
    'es': 'es', 'pt': 'pt-BR',
    'fr': 'fr', 'de': 'de', 'it': 'it', 'nl': 'nl', 'pl': 'pl',
    'tr': 'tr', 'vi': 'vi', 'id': 'id',
    'ru': 'ru',
    'hi': 'hi', 'bn': 'bn',
    'ar': 'ar', 'ur': 'ur',
    'ja': 'ja', 'ko': 'ko', 'zh': 'zh',
    'in': 'id'          /* legacy BCP-47 Indonesian code (deprecated, still emitted by old stacks) */
  };
  /* NOTE: no 'en' entry — EN is the terminal fallback, never a scan stop
   * (D-32: an en-* primary must not abort the preference-list scan). */

  function detect(candidatesOverride) {
    var candidates;
    try {
      candidates = candidatesOverride ||
        ((navigator.languages && navigator.languages.length)
          ? navigator.languages
          : [navigator.language]);
    } catch (err) {
      candidates = [];
    }
    for (var i = 0; i < candidates.length; i++) {
      var tag = String(candidates[i] || '').toLowerCase();
      var prefix = tag.split('-')[0];
      if (DETECT_TABLE[prefix]) return DETECT_TABLE[prefix];
      /* unknown tags keep scanning (D-32 — ES anywhere in the
       * preference list wins; EN is the terminal fallback, not a match) */
    }
    return 'en';
  }

  /* Same-origin dictionary fetch + parse + shape validation. Resolves
   * null on ANY failure (offline, 404, malformed JSON, empty/wrong-shape
   * object) so the caller stays on the current language silently
   * (D-30 / SC3). Successful dictionaries are cached per language. */
  function loadDict(lang) {
    if (dicts[lang]) return Promise.resolve(dicts[lang]);
    return fetch(DICT_URL_PREFIX + lang + '.json')
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (json) {
        if (!json || typeof json !== 'object' || Array.isArray(json)) return null;
        if (!Object.keys(json).length) return null;
        dicts[lang] = json;
        return json;
      })
      .catch(function () { return null; });
  }

  /* persano:langchange — Phase 4 FIRE-03 hook (D-35). Dispatched on
   * document, detail {from, to}, ALWAYS as the last step of an applied
   * switch (Pitfall 6: applied switches only, consistent state first). */
  function dispatchLangChange(from, to) {
    document.dispatchEvent(new CustomEvent('persano:langchange', { detail: { from: from, to: to } }));
  }

  /* Manual-choice persistence — called ONLY after a successful apply
   * (anti-pattern: persist-before-apply). Restricted storage skips. */
  function persist(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* private mode / quota: preference stays session-only (D-30) */
    }
  }

  /* Switcher (I18N-08, D-01..D-04): one native <select class="lang-select">
   * built into the reserved footer lang-switcher-slot — native keyboard/
   * screen-reader behavior for free, zero new interaction JS (D-01).
   * Option labels are endonyms only (D-04 — no English glosses, no
   * optgroups), one option per SUPPORTED entry in fixed D-03 grouped
   * order; the active language IS the select's value. */
  var ENDONYMS = {
    'en': 'English', 'es': 'Español', 'pt-BR': 'Português',
    'fr': 'Français', 'de': 'Deutsch', 'it': 'Italiano', 'nl': 'Nederlands',
    'pl': 'Polski', 'tr': 'Türkçe', 'vi': 'Tiếng Việt', 'id': 'Bahasa Indonesia',
    'ru': 'Русский', 'el': 'Ελληνικά',
    'hi': 'हिन्दी', 'bn': 'বাংলা',
    'ar': 'العربية', 'ur': 'اردو',
    'ja': '日本語', 'ko': '한국어', 'zh': '中文'
  };

  /* Select accessible name (Pitfall 6): the word "Language" per current
   * language, from this engine-internal map — never from dictionary keys,
   * because JS-built nodes are invisible to the keycheck markup surface
   * and a dictionary-only key would fail the parity gate (Pitfall 5). */
  var LANG_LABELS = {
    'en': 'Language', 'es': 'Idioma', 'pt-BR': 'Idioma',
    'fr': 'Langue', 'de': 'Sprache', 'it': 'Lingua', 'nl': 'Taal',
    'pl': 'Język', 'tr': 'Dil', 'vi': 'Ngôn ngữ', 'id': 'Bahasa',
    'ru': 'Язык', 'el': 'Γλώσσα',
    'hi': 'भाषा', 'bn': 'ভাষা',
    'ar': 'اللغة', 'ur': 'زبان',
    'ja': '言語', 'ko': '언어', 'zh': '语言'
  };

  function renderSwitcher() {
    var slot = document.getElementById('lang-switcher-slot');
    if (!slot) return;                      /* absent slot: clean no-op (D-37) */
    slot.removeAttribute('hidden');
    while (slot.firstChild) slot.removeChild(slot.firstChild);
    var select = document.createElement('select');
    select.className = 'lang-select';
    select.setAttribute('aria-label', LANG_LABELS[current] || 'Language');
    for (var i = 0; i < SUPPORTED.length; i++) {
      var lang = SUPPORTED[i];
      var opt = document.createElement('option');
      opt.value = lang;
      opt.setAttribute('lang', lang);
      opt.textContent = ENDONYMS[lang];     /* endonym only (D-04) */
      select.appendChild(opt);
    }
    select.value = current;                 /* active language = the value */
    slot.appendChild(select);
  }

  /* Exactly ONE change handler, attached by PROPERTY ASSIGNMENT on the
   * slot container — re-renders replace the handler instead of stacking
   * listeners (D-01 anti-pattern rule). Bubbles up from the select. */
  function bindSwitcher() {
    var slot = document.getElementById('lang-switcher-slot');
    if (!slot) return;
    slot.onchange = function (ev) {
      if (ev.target && ev.target.tagName === 'SELECT') switchTo(ev.target.value);
    };
  }

  /* Manual switch (I18N-03) — same apply path as init, minus detection.
   * No-op with zero side effects when lang is unsupported or already
   * current (Pitfall 6). EN restores the snapshot with zero fetch (D-28);
   * a failed fetch/apply leaves language, storage and switcher untouched
   * (D-30). After a SUCCESSFUL apply only: persist, re-render the
   * switcher's active state, then dispatch persano:langchange LAST. */
  function switchTo(lang) {
    if (SUPPORTED.indexOf(lang) === -1 || lang === current) return;
    var from = current;
    var finalize = function () {
      persist(lang);
      renderSwitcher();
      dispatchLangChange(from, lang);
    };
    if (lang === 'en') {
      applyLanguage('en', null);
      current = 'en';
      finalize();
    } else {
      loadDict(lang).then(function (dict) {
        if (!dict) return;                /* failed switch: silent no-op */
        applyLanguage(lang, dict);
        current = lang;
        finalize();
      });
    }
  }

  /* Init — order is load-bearing (Pitfall 1): snapshot BEFORE any apply. */
  function init() {
    try {
      captureSnapshot();                    /* 1. EN baseline (D-28) */
      bindSwitcher();                       /* 2. one delegated listener */
      renderSwitcher();                     /* 3. switcher visible, EN active */
      var target = readPref() || detect();  /* 4. stored pref > detect > en */
      if (target === 'en') return;          /* 5. EN visitors: zero fetches (D-25) */
      loadDict(target).then(function (dict) {
        if (!dict) return;                  /* 6. silent EN fallback (D-30/SC3) */
        applyLanguage(target, dict);        /* 7. swap + lang/title/meta sync */
        current = target;
        renderSwitcher();                   /* 8. active entry follows */
        dispatchLangChange('en', target);   /* 9. final init step (D-35) */
      });
    } catch (err) {
      /* any init failure leaves the shipped EN page untouched (SC3) */
    }
  }

  /* defer normally guarantees post-parse execution (research A2); the
   * readyState guard is the belt-and-suspenders for non-defer loading. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* test-only export — inert in browsers (typeof module === 'undefined');
   * MUST sit inside the IIFE or require() throws ReferenceError
   * (detect is IIFE-scoped — research Pitfall 1, reproduced). */
  if (typeof module === 'object' && module.exports) module.exports = { detect: detect };
})();