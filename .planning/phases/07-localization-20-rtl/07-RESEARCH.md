# Phase 7: Localization ×20 + RTL - Research

**Researched:** 2026-09-06
**Domain:** i18n engine scaling (3→20 dictionaries), locale-tag detection, RTL mirroring, native-select switcher, CI dictionary-quality gate — plain HTML/CSS/vanilla JS, zero build, GitHub Pages
**Confidence:** HIGH (engine/pitfalls repo-grounded this session; detect-table algorithm + test harness empirically validated in a sandbox run; dictionary-drafting process MEDIUM-HIGH — register table needs an owner pass, see Open Questions)

**Scope note:** Prior milestone research (`.planning/research/STACK.md`, `PITFALLS.md`) already verified the settled questions — `dir` attribute + CSS logical properties (MDN, HIGH), keycheck gate design, two-pass drafting, wave ordering. This document does NOT re-research those. It answers what the planner needs at task granularity: exact engine edit points, the detect-table design + its test harness (empirically proven), the full base.css direction-sensitive audit, the select-switcher mechanics, gate-hardening rules, and the per-wave dictionary workflow.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Switcher is a **native `<select>`** — no `<details>` popover, no inline list. Native keyboard/screen-reader behavior for free, zero new interaction JS. `js/i18n.js` `renderSwitcher()` is rewritten to build a select; the delegated-handler anti-pattern (re-render stacking listeners) must be preserved.
- **D-02:** Select lives in the **existing footer `lang-switcher-slot` only** — no header/nav placement, no new layout touchpoints on any page. Hub root page included.
- **D-03:** Endonyms ordered in **grouped blocks**: en, es, pt-BR first, then the 17 new languages grouped by script (Latin, Cyrillic, Indic/Thai, Arabic, CJK). Fixed order, no dynamic reordering.
- **D-04:** Option labels are **endonym only**. No English glosses, no `<optgroup>` labels.
- **D-05:** Wave order driven by **market size first** (e.g., W1 hi+de+fr+ru, W2 ja+ko+tr+id, W3 it+pl+nl+vi, W4 el+bn+ar+ur+zh). Exact wave composition is the planner's call; the driver is locked.
- **D-06:** **Per-wave owner spot check** — each 3–4-language batch lands as one commit; owner skims the rendered site per wave.
- **D-07:** Glossary source is **per-language `strings.xml`** — game terms pulled verbatim from each app locale's `values-*/strings.xml` so site copy matches in-app wording exactly.
- **D-08:** **Two-pass drafting** with a full re-read pass: pass 1 drafts all ~169 keys, pass 2 re-reads every value for register consistency, length behavior, punctuation correctness.

### the agent's Discretion
- Exact wave-to-language composition (within market-size driver) and CI/plan wave structure.
- Detect-table implementation shape (prefix table data structure, unit-test framework choice — node:test fits zero-build).
- zh dictionary filename/tag: `zh.json` / tag `zh` (Simplified-only — resolved).
- CSS shape of the select styling; minor visual polish of `[dir="rtl"]` override block coverage.
- Bidi isolation mechanism (bdi elements vs `dir="auto"` on text nodes).
- Punctuation-gate scope detail: ja+zh only or includes ko — agent decides, document the rule in the gate script.
- Line-height override implementation (per-lang attribute selectors vs class) in `css/base.css`.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. (Custom domain → Phase 8; App Check → Phase 9; Play listing date → gates Phase 10.)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| I18N-05 | 17 JSON dictionaries at exact key parity (live surface), agent-drafted in waves of 3–4 with register table + app-`strings.xml` glossary + two-pass drafting | §Dictionary Wave Workflow (glossary mining, register scan, per-wave commit + gate); live surface measured at **170 keys** this session; app repo locale dirs verified |
| I18N-06 | Data-driven prefix-table detection: `in-*`→id, `zh-*`→zh, es/pt preserved, unit tested | §Detect Table — full table + algorithm, **empirically validated** 20-vector run; test harness (in-IIFE export hook + node:test) proven to work |
| I18N-07 | RTL for ar/ur — `dir` in applyLanguage pass, `[dir="rtl"]` CSS block, bidi isolation, per-lang line-height (ur ~2, CJK ~1.7) | §Engine RTL Edit (one line, next to existing lang sync) + §CSS RTL Audit (exactly 4 direction-sensitive declarations in base.css, enumerated by line) + line-height selectors that actually override `body { line-height: 1.6 }` |
| I18N-08 | Switcher: 20 endonyms as select/menu, persists to `persano.lang` | §Switcher Select Design (renderSwitcher rewrite, `slot.onchange` property assignment preserves D-01 anti-pattern rule); persistence already works via `readPref()` membership validation — zero changes needed |
| I18N-09 | Gate hardened: empty-value rejection + CJK half-width punctuation check | §Keycheck Hardening (exact rules incl. the digit-period exception for version numbers like "0.88"; ko scope recommendation) |
</phase_requirements>

## Summary

The engine (`js/i18n.js`) was built for exactly this expansion: scaling to 20 languages touches **data tables, not core logic**. `SUPPORTED` (line 22), `ENDONYMS` (line 148), and the hardcoded `detect()` prefixes (lines 101–102) grow; `applyLanguage()` gains one `dir` line beside the existing `lang` sync (line 71); `renderSwitcher()` swaps inline anchors for a `<select>`; `readPref()`/persistence/fetch-caching need **zero changes** — stored prefs, membership validation, and silent-degradation all extend to new languages automatically. The keycheck gate ("covers whatever dictionaries exist") auto-covers all 20 files for parity; only two new checks are added (empty values, CJK punctuation). No new dependencies, no new pages, no sitemap/hreflang changes — dictionaries have no URLs.

The load-bearing discoveries this session: (1) the live key surface is **170 keys** (not 169 as the CONTEXT sketches — measured via a passing keycheck run; plan tasks should quote 170 or, better, defer to the keycheck output at execution time). (2) The base.css RTL audit is *tiny*: exactly **4 direction-sensitive declarations in 3 rules** (two list indents, FAQ summary padding, FAQ chevron inset) — everything else is flex/center/both-edges and flips for free. (3) The detect-table test harness was empirically proven in a sandbox: the export hook **must live inside the IIFE** (outside → `ReferenceError: detect is not defined` — reproduced), and with a one-line `document` stub, Node `require()`s the browser script cleanly. (4) The app's German `strings.xml` **mixes registers** (58 Sie-form vs 40 du-form hits) — the app is NOT a reliable register source for de, so the STATE.md "register table owner pass" blocker stays live for German specifically.

**Primary recommendation:** Plan 4 waves — Wave 0 (engine+RTL+switcher+gate hardening, one commit), then 4 dictionary waves per D-05 market-size sketch, each landing dictionaries that already passed both drafting passes and the locally-hardened gate. Do not let dictionary drafting start before the engine wave ships (D-06 owner spot-checks ride the switcher).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Locale detection (20 tags, legacy folds) | Browser client (`js/i18n.js` `detect()`) | — | `navigator.languages` read + pure prefix table; Pages has no server tier |
| RTL base direction | Browser client (`applyLanguage()`) + HTML `dir` attribute | CSS (`[dir="rtl"]` block) | `dir` on `<html>` is semantic (survives CSS-off, MDN-verified per prior research); CSS is override-only |
| Bidi isolation | HTML attributes / CSS | — | `dir="ltr"` on slot container; no markup inside keyed nodes (contract) |
| Per-language typography | CSS (`html[lang=…]` selectors) | — | `lang` is already synced on `<html>` by the engine in the same pass |
| Switcher UI | Browser client (`renderSwitcher()`) | CSS (`.lang-select`) | Native `<select>` built into existing footer slot; no page markup changes |
| Dictionary storage/fetch | Browser client (fetch + memory cache) | Static files (`js/i18n/*.json`) | Same-origin fetch, per-language cache — existing mechanism, no change |
| Key parity + value quality | CI (node built-ins) | — | `scripts/i18n-keycheck.mjs` extension; zero new deps |
| Glossary source | External app repo (read-only) | — | `C:/Users/Familia/antigravity/GeoHist-Trivia/.../values-*/strings.xml` — one-time pull per wave, no sync mechanism |

## Standard Stack

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| `js/i18n.js` (existing engine) | in-repo | All detection/apply/switcher/persist changes | Snapshot/apply architecture is production-proven for 3 languages [VERIFIED: js/i18n.js full read this session] |
| `dir` attribute + CSS logical properties | platform | RTL mirroring (I18N-07) | MDN-verified in prior milestone research [CITED: .planning/research/STACK.md lines 15, 42–52] |
| `node:test` (built-in) | node 18+ stable | detect-table unit tests (I18N-06) | Zero-dep; fits node built-ins-only script convention [CONTEXT discretion names node:test] |
| `scripts/i18n-keycheck.mjs` (existing gate) | in-repo | Parity ×20 + empty-value + CJK punctuation (I18N-09) | Exact set-equality design auto-covers new dictionary files [VERIFIED: scripts/i18n-keycheck.mjs:78,99-110] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| *(none)* | — | — | No new runtime or dev dependencies. Everything is platform CSS/HTML, engine edits, and node built-in scripts. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prefix-table `detect()` | `Intl.Locale` parsing | Overkill — I18N-06 locks "prefix table"; 20 one-char folds need no locale-object machinery |
| Marker-delimited JSON table for tests | In-IIFE export hook (recommended) | Markers work but test a *copy* of the algorithm; the export hook tests the REAL `detect()` — proven this session |
| Re-implemented fold algorithm in test | Optional-arg injection `detect(candidates?)` | Optional-arg keeps the algorithm in one place; pure-function tests need no `navigator` global gymnastics |
| Hardcoded EN `aria-label="Language"` | Per-language label map in engine | Map gives language-correct a11y for all 20 without key-surface churn (JS-built nodes aren't keyed — see Pitfall 6); hardcoded fallback acceptable |

**Installation:** Nothing. `package.json` gains only a script line (`validate:i18n-detect`) chained into `validate` — no dependency edits.

## Package Legitimacy Audit

No external packages are installed in this phase — all changes are in-repo files and node built-ins. Audit not applicable. **Packages removed due to [SLOP]: none. Packages flagged [SUS]: none.**

## Architecture Patterns

### System Architecture Diagram

```
Visitor loads a keyed page (5 pages: /, /geohist/, guide, contact, changelog)
        │  shipped EN raw HTML; <html lang="en">; no third-party bytes
        ▼
js/i18n.js init (defer, IIFE, zero globals)
   1. captureSnapshot()  ── EN baseline of [data-i18n]/[data-i18n-attr] nodes (once)
   2. bindSwitcher()     ── slot.onchange (select rewrite; property assignment = never stacks)
   3. renderSwitcher()   ── <select class="lang-select"> + 20 <option value=lang>Endonym</option>
   4. readPref() || detect()
        │                  readPref: localStorage 'persano.lang' → membership check vs SUPPORTED (20)
        │                  detect: navigator.languages → DETECT_TABLE prefix fold → 'en' terminal
        ▼
   5. target === 'en' ? zero fetches : loadDict(target) → fetch /js/i18n/<lang>.json
        │                  any failure → null → silent EN fallback (D-30)
        ▼
   6. applyLanguage(lang, dict)
        ├─ snapshot walk: textContent + setAttribute swaps (per-node EN fallback)
        ├─ documentElement.lang = lang          (existing, line 71)
        └─ documentElement.dir = RTL_LANGS[lang] ? 'rtl' : 'ltr'   (NEW, I18N-07 — same pass)
        ▼
   7. persist → renderSwitcher (active select value) → persano:langchange event
        ▼
CSS reacts to <html lang/dir>: [dir="rtl"] override block, html[lang="ur"/"ja"/"zh"/"ko"] line-height
```

**Branch points:** unknown tag / failed fetch / empty dict → stay EN silently; stored pref wins over detection; `en` is the terminal fallback, never a returning prefix match (D-32 preserved — see Pitfall 3).

### Recommended Project Structure (changes only)

```
js/i18n.js                      # engine: SUPPORTED/ENDONYMS/DETECT_TABLE grow; dir line; select rewrite
js/i18n/
  ├── es.json, pt-BR.json       # unchanged (170 keys each)
  └── hi,de,fr,ru,ja,ko,tr,id,it,pl,nl,vi,el,bn,ar,ur,zh.json   # 17 new, flat, 170 keys each
css/base.css                    # + .lang-select (~10 lines) + logical-property conversion (3 rules)
                                # + [dir="rtl"] block + html[lang=…] line-height rules
scripts/i18n-keycheck.mjs       # + empty-value + CJK punctuation checks (parity logic unchanged)
scripts/i18n-detect.test.mjs    # NEW: node:test table for detect() (via export hook)
scripts/i18n-surface.mjs        # NEW (optional, recommended): zero-dep key→EN-text dump for drafting
package.json                    # validate chain += validate:i18n-detect
```

### Pattern 1: Detect table (I18N-06) — replace `detect()` internals, keep the scan contract

**What:** One flat `{ prefix → lang }` map; per candidate tag: lowercase → `split('-')[0]` → table hit returns mapped lang, else continue scanning the preference list; `en` terminal return.
**When to use:** Replaces lines 101–102 verbatim.
**Empirical validation:** 20-vector sandbox run this session — all current behaviors preserved; `['zh','pt']` changes pt-BR→zh *by design* (first supported match wins once zh is supported).
**Key contract points:** `en` MUST NOT be a returning table entry (it would stop the scan on `en-us` and break D-32's "en-* keeps scanning"); `in` is a separate table key mapping to `id`; all `zh-*` variants fold via the single `zh` prefix.

```javascript
// js/i18n.js — replaces the two indexOf lines (js/i18n.js:101-102)
var DETECT_TABLE = {
  'es': 'es', 'pt': 'pt-BR',
  'fr': 'fr', 'de': 'de', 'it': 'it', 'nl': 'nl', 'pl': 'pl', 'tr': 'tr', 'vi': 'vi', 'id': 'id',
  'ru': 'ru',
  'hi': 'hi', 'bn': 'bn',
  'ar': 'ar', 'ur': 'ur',
  'ja': 'ja', 'ko': 'ko', 'zh': 'zh',
  'in': 'id'          // legacy BCP-47 Indonesian code (deprecated, still emitted by old stacks)
};
/* NOTE: no 'en' entry — EN is the terminal fallback, never a scan stop (D-32). */

function detect(candidatesOverride) {          // optional arg = test injection (recommended)
  var candidates;
  try {
    candidates = candidatesOverride ||
      ((navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language]);
  } catch (err) { candidates = []; }
  for (var i = 0; i < candidates.length; i++) {
    var tag = String(candidates[i] || '').toLowerCase();
    var prefix = tag.split('-')[0];             // 'zh-hant-cn' → 'zh', 'in-ID' → 'in', 'pt-PT' → 'pt'
    if (DETECT_TABLE[prefix]) return DETECT_TABLE[prefix];
    /* unknown tags keep scanning (D-32) */
  }
  return 'en';
}
```

### Pattern 2: Unit-test harness for the browser IIFE — empirically proven this session

**What:** A 3-line export hook inside the IIFE (inert in browsers) + a `document` stub + `node:test` in a `.mjs` file using `createRequire`.
**Validated:** Sandbox run on a copy of `js/i18n.js`. Hook placed *outside* the IIFE throws `ReferenceError: detect is not defined` (reproduced); hook inside + stub works, `require()` succeeds, `init()` silently no-ops (its own try/catch swallows the stub's missing DOM APIs).

```javascript
// js/i18n.js — LAST lines inside the IIFE, before the closing })();
  /* test-only export — inert in browsers (typeof module === 'undefined') */
  if (typeof module === 'object' && module.exports) { module.exports = { detect: detect }; }
})();

// scripts/i18n-detect.test.mjs — zero-dependency
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
globalThis.document = { readyState: 'complete', addEventListener() {}, querySelectorAll() { return []; } };
const { detect } = require('../js/i18n.js');

const VECTORS = [
  [['in-ID', 'en'], 'id'], [['in'], 'id'], [['zh'], 'zh'], [['zh-TW'], 'zh'],
  [['zh-Hant-CN', 'en'], 'zh'], [['zh-HK'], 'zh'],
  [['pt'], 'pt-BR'], [['pt-PT'], 'pt-BR'], [['pt-BR'], 'pt-BR'],
  [['es'], 'es'], [['es-419'], 'es'], [['de-AT'], 'de'], [['ur-PK'], 'ur'],
  [['ar-EG'], 'ar'], [['bn-BD'], 'bn'], [['fr'], 'fr'],
  [['en'], 'en'], [['en-US'], 'en'], [['xx-YY'], 'en'], [['fil-PH'], 'en'],
  [['en-US', 'es'], 'es'],   // D-32: EN primary must not stop the scan
  [['fr', 'de'], 'fr'], [['zh', 'pt'], 'zh'],
];
for (const [langs, expected] of VECTORS) {
  test(`detect(${JSON.stringify(langs)}) → ${expected}`, () => {
    assert.equal(detect(langs), expected);
  });
}
```

### Pattern 3: Engine RTL edit (I18N-07) — one line, same pass

```javascript
// js/i18n.js — beside the existing lang sync (applyLanguage, js/i18n.js:71)
var RTL_LANGS = { 'ar': 1, 'ur': 1 };

// inside applyLanguage(), immediately after document.documentElement.lang = lang;
document.documentElement.dir = RTL_LANGS[lang] ? 'rtl' : 'ltr';
```

The EN-restore path (`applyLanguage('en', null)`) auto-resets `dir` to `ltr` — no separate reset logic. The EN-init early return (`target === 'en'` → return, js/i18n.js:228) leaves shipped `lang="en"`/default LTR untouched. No `persano:langchange` consumer (consent banner, contact form) needs dir awareness — the banner is a fixed full-width bottom bar, the form is single-column; both are direction-agnostic.

### Pattern 4: Switcher select rewrite (I18N-08, D-01/D-02/D-03/D-04)

```javascript
// renderSwitcher() rewrite (replaces js/i18n.js:150-174)
var ENDONYMS = { /* grows to 20 entries, see §Endonyms */ };

function renderSwitcher() {
  var slot = document.getElementById('lang-switcher-slot');
  if (!slot) return;
  slot.removeAttribute('hidden');
  while (slot.firstChild) slot.removeChild(slot.firstChild);
  var select = document.createElement('select');
  select.className = 'lang-select';
  select.setAttribute('aria-label', LANG_LABELS[current] || 'Language'); // 20-word map, see Pitfall 6
  for (var i = 0; i < SUPPORTED.length; i++) {          // SUPPORTED order == D-03 grouped display order
    var lang = SUPPORTED[i];
    var opt = document.createElement('option');
    opt.value = lang;
    opt.setAttribute('lang', lang);
    opt.textContent = ENDONYMS[lang];                    // endonym only (D-04)
    select.appendChild(opt);
  }
  select.value = current;                                // active language = the select's value
  slot.appendChild(select);
}

// bindSwitcher rewrite — property assignment preserves the never-stacks rule (D-01):
function bindSwitcher() {
  var slot = document.getElementById('lang-switcher-slot');
  if (!slot) return;
  slot.onchange = function (ev) {
    if (ev.target && ev.target.tagName === 'SELECT') switchTo(ev.target.value);
  };
}
```

Notes: `SUPPORTED` can *be* the display order (detection is table-driven now, so array order no longer affects detection — `readPref()` membership and `switchTo()` are order-insensitive). `aria-current`/anchor patterns are dead code once the select lands — remove them. Endonym-only option labels need no bidi markup: each endonym is a single-script run, and `<option>` allows no child markup anyway. The switchTo/apply/finalize path is unchanged — `renderSwitcher()` re-runs in `finalize()` and sets the select value.

### Pattern 5: CSS RTL audit result + typography (I18N-07)

Full audit of `css/base.css` (557 lines, read this session) — **exactly 4 direction-sensitive declarations in 3 rules**; everything else (flex rows, centered text, both-edges insets, `left: 50%` centering, `left: -9999px` honeypot) flips or stays correct for free. No explicit `text-align: left/right` exists anywhere in the file.

```css
/* 1. Logical-property conversion (replaces physical declarations in place) */
.feature-group ul,                    /* was: margin: 0 0 0.25rem 1.25rem;  base.css:181 */
.changelog-entry ul {                 /* was: margin: 0 0 0.25rem 1.25rem;  base.css:543 */
  margin: 0 0 0.25rem 0;
  margin-inline-start: 1.25rem;
}

.faq-item summary {                   /* was: padding: 0.8rem 2.6rem 0.8rem 1rem;  base.css:269 */
  padding-block: 0.8rem;
  padding-inline: 1rem 2.6rem;        /* text edge / chevron edge per direction */
}

.faq-item summary::after {            /* was: right: 1rem;  base.css:281 */
  inset-inline-end: 1rem;
}

/* 2. [dir="rtl"] override block — designated home for anything the ar/ur
      screenshot pass reveals that logical properties can't express.
      Success criteria name this block; expected seed content: near-empty.
      Candidates if found: directional inline-SVG flips (transform: scaleX(-1)),
      background-position offsets. The gallery's game screenshots are NOT
      mirrored (they are the game's own rendering). */
[dir="rtl"] { /* seeded by the RTL screenshot battery — see verification list */ }

/* 3. Per-language line-height. MUST target body/headings: body sets an
      explicit line-height (base.css:40) so an html-level override would
      not inherit down. h1-h3 are 1.25 (base.css:63) — Nastaliq clips there too. */
html[lang="ur"] body { line-height: 2; }
html[lang="ur"] h1, html[lang="ur"] h2, html[lang="ur"] h3 { line-height: 1.9; }
html[lang="ja"] body, html[lang="zh"] body, html[lang="ko"] body { line-height: 1.7; }

/* 4. Switcher select — follows existing form-control conventions (tokens, 44px tap target) */
.lang-select {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-fg);
  background-color: var(--color-bg);
  border: var(--hairline-gold);
  border-radius: 0.4rem;
  padding: 0.4rem 0.6rem;
  min-height: 44px;
}
```

### Pattern 6: Keycheck hardening (I18N-09)

Extend `scripts/i18n-keycheck.mjs` per-dictionary loop (after the existing flat-object shape check, js/i18n-keycheck.mjs:94-98). Parity logic (lines 99-110) stays untouched.

```javascript
// value-quality checks — inside the per-file loop, after shape validation
const CJK_PUNCT = /[,!?:;()"]/;          // ASCII half-width, never legal in zh/ja copy
const CJK_PERIOD_OK = /\d\.\d/;          // version numbers / decimals: '0.88', '3.0'
const CJK_PERIOD_BAD = /\.(?!\d)|(?<!\d)\./; // period NOT between digits
const PUNCT_LANGS = new Set(['ja.json', 'zh.json']);  // ko exempt: half-width punct is
                                                     // common Korean usage (documented per CONTEXT)

for (const [key, value] of Object.entries(dict)) {
  if (typeof value !== 'string' || value.trim() === '') {
    console.error(`i18n-keycheck: FAIL — ${file}: empty/non-string value for "${key}"`);
    failed = true;
  }
  if (PUNCT_LANGS.has(file) && typeof value === 'string') {
    if (CJK_PUNCT.test(value) ||
        (value.includes('.') && !CJK_PERIOD_OK.test(value) === false && CJK_PERIOD_BAD.test(value))) {
      console.error(`i18n-keycheck: FAIL — ${file}: "${key}" contains half-width punctuation (${value.slice(0, 40)}…)`);
      failed = true;
    }
  }
}
```

(Planner/executor: write the period rule as a single clear predicate — reject `.` unless matched by `\d\.\d` — and red-gate it. The snippet above sketches intent; keep the shipped regex simple and documented in the script header.)

**Red-gate proof procedure** (mirrors Phase 6 precedent): copy a ja/zh dict to a temp file, plant `","` and `"key": ""`, run the script, confirm per-key FAIL output, remove. Also plant an empty value in es.json to prove the check spans all 20 files.

### Pattern 7: Dictionary wave workflow (I18N-05, D-05/D-06/D-07/D-08)

Per wave (3–4 languages, one atomic commit):

1. **Mine the glossary (D-07).** Site-relevant terms (GeoHist, Art Detective, True/False, mode names, leaderboard names) are located by grepping `values/strings.xml` (EN base, ~2,390 strings per file — grep, never full-read) for the EN term to get the string name, then reading the same `name` in `values-<xx>/strings.xml` for each wave language. Read files via **Node `fs` with utf8** — the PowerShell console mangles UTF-8 to `???` (display-only, verified this session: Node extracted جیو ہسٹ ٹریویا / معلومات جغرافية وتاريخية / भू-इतिहास सामान्य ज्ञान correctly while pwsh showed question marks).
2. **Register scan per language.** Grep-count formality markers (this session's de method: `\bSie\b|\bIhre\b` vs `\bdu\b|\bdein\b` counts). Defaults table below; **de is confirmed mixed in the app (58 Sie / 40 du)** — the app is not authoritative for German register.
3. **Pass 1 (D-08):** draft all 170 keys per language, using the glossary verbatim for game terms and matching brand-name behavior from the app (verified examples: ja/el keep "GeoHist Trivia" Latin; ur/hi/bn/zh transliterate — follow the app per language).
4. **Pass 2 (D-08):** fresh full re-read — register consistency, length behavior (de/vi grow ~20–35%, ja/zh shrink), punctuation width for ja/zh (the gate also catches mechanically).
5. **Gate locally:** `npm run validate:i18n` (parity + new checks) — must be green before the wave commit.
6. **Commit the wave** (dictionaries only; engine landed earlier).
7. **Owner spot-check (D-06)** via the rendered site's switcher, live on persano.github.io after deploy.

**EN source for drafting:** EN strings live in the *markup* (no `en.json` exists — the snapshot IS the EN). The optional `scripts/i18n-surface.mjs` (zero-dep, reuses the keycheck's extraction regex to also capture node text) turns this into a key→EN map — also enabling the optional length-ratio warning in the gate. Recommended as a committed helper; a one-off node script per wave is acceptable.

**Register defaults** (from prior milestone research, to be confirmed by owner pass — see Open Questions) [CITED: .planning/research/PITFALLS.md Pitfall 1]: fr→vous · ja→です/ます · ko→해요체 · ru→lowercase вы · hi→आप · bn→আপনি · tr→siz · el→εσείς · pl→Ty · it→tu (game convention) · nl→je · vi→avoid pronouns · id→Anda · ar→MSA فصحى · de→**owner decision** (app mixes du/Sie).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RTL mirroring | Mirrored duplicate stylesheet | `dir` attribute + logical properties + tiny `[dir="rtl"]` block | Only 4 declarations in this stylesheet are directional (§Pattern 5); a mirror stylesheet is ×2 maintenance forever |
| Locale tag parsing | BCP-47 parser / `Intl.Locale` machinery | Flat prefix table + `split('-')[0]` | 20 one-fold mappings; table is unit-testable data (I18N-06 locks this shape) |
| Dictionary validation | Generic i18n lint dependency | Extend `i18n-keycheck.mjs` (node built-ins) | Exact-parity gate already stricter than generic tools; zero deps |
| Unit test framework | Custom test runner / test harness in HTML | `node:test` | Stable built-in; harness proven this session |
| Bidirectional text algorithm | Manual character reordering / `unicode-bidi` overrides | Unicode bidi algorithm + isolation attributes only | `bidi-override` mangles text (MDN, prior research); strong-LTR brand runs inside RTL handle themselves |
| Translation memory / QA tooling | TMS integration, i18next-parser | App `strings.xml` glossary + two-pass + gate | App is the authoritative terminology source (D-07); 170 keys × 20 files is gate-sized |

**Key insight:** every quality mechanism this phase needs is already built — the phase is data growth (17 dictionaries) plus three surgical engine edits (detect table, dir line, select rewrite) plus two gate predicates. Resist any "tooling upgrade" temptation.

## Common Pitfalls

### Pitfall 1: Export hook outside the IIFE breaks `require()` — and would break nothing in the browser
**What goes wrong:** `module.exports = { detect }` appended after `})();` throws `ReferenceError: detect is not defined` — `detect` is IIFE-scoped. Reproduced this session.
**How to avoid:** Hook goes inside the IIFE, immediately before the closing `})();`. Browsers never evaluate it (`typeof module === 'undefined'`).
**Warning signs:** test file crashing at require; any browser console error mentioning `module`.

### Pitfall 2: An `en` entry in DETECT_TABLE silently breaks D-32
**What goes wrong:** If `en` is a returning prefix match, an `en-US`-primary browser with Spanish second gets EN — today it gets Spanish (scan continues past non-matching tags, js/i18n.js:103-104 comment is explicit).
**How to avoid:** `en` is the terminal `return 'en'` after the loop, never a table entry. Test vector `[['en-US','es'], 'es']` locks this.
**Warning signs:** unit test `[en-US, es] → es` failing; Spanish visitors on en-primary browsers seeing EN.

### Pitfall 3: Intended behavior change — `['zh','pt']` preference order
**What goes wrong (if unnoticed):** Today that browser gets pt-BR (zh unsupported → scan continues). After the table lands it gets zh (first supported match wins). This is *correct* per D-32 but is a behavior change — encode it as an explicit test vector with a comment, or a wave-reviewer will "fix" it.
**How to avoid:** Document in the test file; include in the engine-wave commit message.

### Pitfall 4: CJK punctuation gate rejects legitimate version numbers
**What goes wrong:** A naive "no ASCII `.` in zh/ja values" rule flags `0.88`, `3.0`, `2026-09-04` (changelog chrome strings may carry versions/dates).
**How to avoid:** Allow `.` only in digit-digit context (`/\d\.\d/`); reject all other half-width `, . ! ? : ; ( ) "` in ja/zh. Document the exception in the gate header. Red-gate both directions.
**Warning signs:** gate red on a dictionary with "0.88" in a value; or worse — gate silenced by deleting legitimate numbers.

### Pitfall 5: JS-only keys can't pass the exact-parity gate
**What goes wrong:** Tempting to add an aria-label or new UI string consumed only by `renderSwitcher()` (JS-built nodes are not in the snapshot walk, and the keycheck reads *static markup*). A key present only in dictionaries = "extra key" → gate fails (js/i18n-keycheck.mjs:101,109). A key in markup-only = missing from dictionaries.
**How to avoid:** Switcher a11y labels come from engine-internal maps (ENDONYMS-style), never from dictionary keys. If a future switcher label ever needs translating, it must be a real keyed node in markup on all 5 pages — a surface move like Phase 6's.
**Warning signs:** keycheck FAIL "extra keys" right after adding engine-consumed strings.

### Pitfall 6: Select a11y label has no key and no markup
**What goes wrong:** `<select>` without an accessible name fails WCAG; there is no dictionary key for "Language" and adding one collides with Pitfall 5.
**How to avoid:** Engine-internal `LANG_LABELS` map (the word "Language" in all 20 languages — ~20 trivial strings, drafted in the engine wave), applied as `aria-label` per current language. Fallback if the map feels heavy: hardcoded `aria-label="Language"` (documented wart). Planner's call per CONTEXT discretion.
**Warning signs:** axe/a11y audit flagging unlabeled combobox in footer.

### Pitfall 7: Windows console mangles glossary mining output
**What goes wrong:** `Get-Content values-ur/strings.xml` shows `??? ??? ??????` — the agent may wrongly conclude the files are broken or mis-encododed. The files are valid UTF-8 (verified via Node this session).
**How to avoid:** Mine glossaries via `node -e`/`node:fs` (utf8) or `Get-Content -Encoding UTF8`; never trust pwsh console rendering of RTL/Indic text.
**Warning signs:** question marks in place of Arabic/Devanagari/Bengali glyphs in terminal output.

### Pitfall 8: line-height overrides that don't actually apply
**What goes wrong:** `[lang="ur"] { line-height: 2 }` on `<html>` is defeated by body's own explicit `line-height: 1.6` (css/base.css:40) — inheritance never overrides a direct declaration. Urdu renders clipped anyway; looks "done" in a passing grep.
**How to avoid:** Target `html[lang="ur"] body` (and h1-h3, which carry their own 1.25, base.css:63). Verify by rendered-page inspection, not grep.
**Warning signs:** DevTools computed line-height on a `<p>` still showing 1.6 under `lang="ur"`.

### Pitfall 9: Register table treated as solved because the app "has the language"
**What goes wrong:** D-07 makes app `strings.xml` the glossary source; over-extension assumes it also answers register. Verified false for German: app de strings mix Sie-form (58 hits) and du-form (40 hits) in the same file.
**How to avoid:** Use the app for *terminology* (locked) and *brand-name behavior* (verified: ja/el keep Latin brand, ur/hi/bn/zh transliterate), but resolve register via the defaults table + the pending owner pass (STATE.md blocker). de is the known conflict.
**Warning signs:** a de dictionary mixing "Schlussfolgere" and "Identifizieren Sie" patterns — exactly the app's own inconsistency.

### Pitfall 10: Owner spot-check done on `file://`
**What goes wrong:** Dictionary fetch via `file://` fails (browser fetch restrictions) → silent EN fallback → owner concludes translation is broken.
**How to avoid:** Spot-check on the deployed site (push → Pages deploy ~1 min) or a local HTTP server. The silent-degradation policy (D-30) deliberately gives no error UI, so the failure mode is *quiet*.
**Warning signs:** switcher selects a language, nothing changes, no console-visible cause on file://.

### Pitfall 11: Legacy surface-number drift in task text
**What goes wrong:** Requirements/CONTEXT say "146+changelog"/"169 keys"; the measured live surface is **170** (keycheck PASS output this session). Tasks quoting a stale number trip reviewers during parity checks.
**How to avoid:** Quote 170 in tasks, or better: reference "the keycheck-reported surface size" — the gate is the number's source of truth.

## Code Examples

Verified patterns are embedded in the Architecture Patterns section above (all engine/CSS snippets cite the exact in-repo line they modify). The detect-table + test harness (Patterns 1–2) was **executed end-to-end in a sandbox** this session against a copy of the real `js/i18n.js`: 20/20 vectors behave as specified, with the single intentional D-32 difference documented (Pitfall 3).

## Endonyms (engine wave data)

Draft list (20 entries) from prior milestone research, standard native names [ASSUMED — verify spelling during the engine wave, owner spot-checks per D-06]:

en English · es Español · pt-BR Português · fr Français · de Deutsch · it Italiano · nl Nederlands · pl Polski · tr Türkçe · vi Tiếng Việt · id Bahasa Indonesia · ru Русский · hi हिन्दी · bn বাংলা · ar العربية · ur اردو · ja 日本語 · ko 한국어 · zh 中文 · el Ελληνικά

Display order per D-03: trio first, then Latin group (fr, de, it, nl, pl, tr, vi, id), Cyrillic (ru), Indic (hi, bn), Arabic (ar, ur), CJK (ja, ko, zh). Known spelling variant to settle: हिन्दी vs हिंदी (both standard; pick one and stay consistent).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | keycheck, detect tests, surface script | ✓ | 26.5.1 local [VERIFIED: node --version] | — |
| Node (CI) | validate job | ✓ | node-version 24 [VERIFIED: .github/workflows/deploy.yml:23] | — |
| npm | validate chain | ✓ | 11.17.0 [VERIFIED: npm --version] | — |
| App repo `strings.xml` ×19 locales + base | D-07 glossary | ✓ | `C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/` — `values` + `values-{ar,bn,de,el,es,fr,hi,id,it,ja,ko,nl,pl,pt,ru,tr,ur,vi,zh}` [VERIFIED: filesystem listing this session] | — |
| `node:test` | I18N-06 unit tests | ✓ (built-in) | stable since Node 18 | Marker-extraction harness (§Alternatives) |

**Missing dependencies with no fallback:** none.
**Notes:** `values-zh` only — no `values-zh-rTW`/`-rHK` → zh = Simplified re-confirmed this session (closes the STATE.md zh blocker). CI installs dev deps via `npm install` (no lockfile) — unchanged; this phase adds no dev deps.

## Known Scope Boundaries (verified this session)

- `privacy.html` and `404.html` carry `<html lang="en">`, **no i18n.js**, no keys — they stay EN (privacy has its Phase-6 static trilingual notice). "Whole site translated" applies to the 5 keyed pages [VERIFIED: script-tag grep across all 7 pages].
- `lang-switcher-slot` exists on exactly the 5 keyed pages: `index.html:46`, `geohist/index.html:178`, `geohist/guide.html:100`, `geohist/contact.html:88`, `geohist/changelog.html:123` [VERIFIED: grep]. All load i18n.js. No markup edits needed for the select (engine builds into the slot).
- No sitemap/robots/hreflang changes — the 17 dictionaries have no URLs (dictionary-swap architecture; I18N-10 subdirs remain a deferred future requirement).
- Stored `persano.lang` values (`en`/`es`/`pt-BR`) remain valid — SUPPORTED growth is additive; no data migration.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Endonym spellings (17 entries, esp. हिन्दी vs हिंदी) | Endonyms | Wrong native name visible to native speakers; cheap fix, owner spot-check catches |
| A2 | Register defaults per language (fr vous, ja です/ます, …) | Pattern 7 | 17 dictionaries rebuilt if register is wrong — the reason the owner pass exists; de confirmed contested |
| A3 | `node:test` works on CI Node 24 (stable since Node 18, not exercised in CI yet) | Environment | First CI run red — trivial fix, but plan the first push expecting it |
| A4 | Urdu Nastaliq renders acceptably via system fonts on real devices | Pattern 5 | STATE.md blocker stands: needs real-device visual verification (documented degradation acceptable, silent discovery is not) |
| A5 | ko exempt from the CJK half-width punctuation rule (Korean commonly uses half-width punctuation) | Pattern 6 | Over-strict gate → false FAILs on valid ko copy; documented decision per CONTEXT discretion |

## Open Questions (RESOLVED)

1. **German register (du vs Sie) — owner pass still pending (STATE.md blocker).**
   - What we know: app `values-de/strings.xml` is internally inconsistent (58 Sie-form / 40 du-form hits, verified this session) — D-07 cannot settle it.
   - Recommendation: draft de with **Sie** (safe default for general-audience copy), flag explicitly in the wave-1 owner spot-check (D-06) rather than blocking wave 1.
   - RESOLVED: 07-01 drafted de with Sie-implied neutral register (no pronoun in this value); UAT German check passed, full run 10/10.
2. **Switcher aria-label mechanism** — per-language `LANG_LABELS` map in the engine (recommended: language-correct, zero key-surface impact) vs hardcoded `"Language"`. Planner's call; both avoid the Pitfall 5/6 traps.
   - RESOLVED: 07-01 implemented the per-language `LANG_LABELS` map — language-correct labels, zero key-surface impact.
3. **Committed `scripts/i18n-surface.mjs` (key→EN dump) vs one-off node scripts per wave** — recommended committed (reusable by the optional length-ratio gate check and all future content edits); zero-dep ~40 lines.
   - RESOLVED: 07-02 committed the reusable `scripts/i18n-surface.mjs` extractor; used by keycheck for the live-surface baseline.
4. **ko line-height grouping** — included in the 1.7 CJK rule above (harmless, consistent); planner may drop ko if a rationale for strict minimalism is preferred. Document either way.
   - RESOLVED: 07-01 included ko in the 1.7 CJK line-height rule; documented in STATE.md decisions.

## Sources

### Primary (HIGH confidence)
- `js/i18n.js` — full read this session: SUPPORTED (:22), applyLanguage lang sync (:71), detect hardcoded prefixes (:90-107), readPref (:76-83), loadDict (:113-124), ENDONYMS (:148), renderSwitcher (:150-174), bindSwitcher property assignment (:180-191), switchTo (:199-219), init order + outer try/catch (:222-239), readyState guard (:243-247)
- `scripts/i18n-keycheck.mjs` — full read: 5-page array (:22), extraction regex (:32-52), flat-object shape check (:94-98), exact set-equality (:99-110)
- Sandbox experiment (this session): copy of i18n.js + in-IIFE export hook + document stub + 20-vector detect run — hook-inside-works / hook-outside-throws reproduced; prefix-table algorithm validated against every current behavior
- `css/base.css` — full read (557 lines): direction-sensitive audit results with line numbers; body line-height :40; h1-h3 :59-64; FAQ summary :265-288; list indents :181, :543
- `package.json` (:5-7) + `.github/workflows/deploy.yml` (:17-28) — validate chain wiring, CI node 24
- `scripts/smoke-check.sh` — verified **zero dictionary-URL coverage** today (:25-38) → optional extension: 20-URL expect-200 loop post-deploy
- App repo filesystem: `values` + 19 locale dirs confirmed; `values-zh` only (Simplified); glossary UTF-8 extraction via node verified (ur/ar/hi/ja/el/bn/zh app_name strings); de register counts (58 Sie / 40 du / 2,390 strings)

### Secondary (MEDIUM-HIGH confidence)
- `.planning/research/STACK.md` + `PITFALLS.md` (2026-09-05, one day old) — MDN dir/logical-properties/bidi verification, register defaults, keycheck blind-spot analysis, endonym list
- `.planning/phases/06-changelog-page/06-CONTEXT.md` — `changelog.*` namespace, keycheck registration precedent, red-gate procedure

### Tertiary (LOW confidence)
- Live key surface = 170 (from keycheck PASS output — HIGH for execution purposes; the planning docs' "169"/"146+changelog" phrasing is the stale part)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new deps; everything in-repo or platform, all read this session
- Architecture: HIGH — engine read line-by-line; detect table + harness empirically executed in sandbox
- Pitfalls: HIGH — all repo-grounded or reproduced this session (Pitfall 1 reproduced live)
- Dictionary workflow: MEDIUM-HIGH — process locked by D-05..D-08; register defaults pending owner pass (de contested)

**Validation sections omitted per `.planning/config.json`:** `nyquist_validation: false`, `security_enforcement: false` — the CI gate story lives in `package.json` validate chain; no ASVS surface changes this phase (no auth/crypto/input handling touched).

**Research date:** 2026-09-06
**Valid until:** 2026-10-06 (stable domain — in-repo code + locked decisions; only external risk is app-repo edits, which only add glossary rows)
