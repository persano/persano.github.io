# Phase 4: Consent Gate + Firebase (Analytics + Contact Form) - Research

**Researched:** 2026-09-02
**Domain:** Vanilla-JS GDPR consent gate, Firebase modular SDK via gstatic ESM CDN (Analytics + Anonymous Auth + Firestore), create-only Firestore rules
**Confidence:** HIGH (core integration verified against shipped SDK artifacts this session)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Consent banner (FIRE-01)**
- **D-42:** Banner shows on every engine-carrying keyed page — the 3 existing (hub `/index.html`, `/geohist/index.html`, `/geohist/guide.html`) + the new keyed `/geohist/contact.html`; NOT on `privacy.html` (stays EN-only/no-keys per D-37) and NOT on `404.html` (stays self-contained per Phase 1 rule). Consent choice itself is global (one localStorage key) so the gate applies site-wide once Analytics is granted — **Reversibility:** reversible — banner markup/JS is additive; changing the page list is an edit to the script-tag list
- **D-43:** Banner buttons = **Accept + Reject, both equal prominence** — GDPR requires denying to be as easy as granting; FIRE-01 requires affirmative action either way. No dismiss-X, no accept-only
- **D-44:** Retraction path = footer **"Consent" link** on the same engine-carrying pages (joins `.footer-links`, keyed) that re-opens the banner anytime; retraction clears/flips the stored choice and unloads nothing already loaded this session except stopping further event sends
- **D-45:** Banner presentation = **fixed bottom bar**, full-width, dark antique theme, restrained per D-06; exact styling is agent discretion
- Consent persistence: localStorage with timestamp per FIRE-01 (exact key shape agent discretion — agreed family `persano.consent`, exact string flexible; same family pattern as `persano.lang` D-34)

**Contact form (FIRE-04..06)**
- **D-46:** Form lives on its **own page `/geohist/contact.html`** — mirrors the `guide.html` page pattern (same scaffolding, nav, footer); keeps the landing hero-first on phones
- **D-47:** Fields: **name (optional) + email + topic select + message**; topic options = General question · Bug report · Feedback · **Request data deletion** — the deletion topic + FAQ entry + documented manual process (email-based handling by owner, described in the FAQ answer and on the contact page) complete CMPL-03
- **D-48:** Link rewiring: footer "Contact" on hub + geohist + guide (currently `mailto:`) becomes a link to `/geohist/contact.html`; the FAQ "report a problem" answer and the NEW deletion FAQ entry also point to the form; `privacy.html` and the About-dev section keep their direct `mailto:` as the direct channel
- **D-49:** Success/error states = **inline status message under the form**, `aria-live="polite"`, no toasts/popups; all form copy keyed for ES/pt-BR
- Locked pipeline (STACK §6, not re-decided): submit-time `signInAnonymously()` → `addDoc()` into `messages`; repo-rules create-only with field validation + length caps + server timestamps; honeypot catches bots

**Analytics events (FIRE-02, FIRE-03)**
- **D-50:** Event scope = **FIRE-03 minimum only: Play badge clicks + language switches** — both integration points already exist (badge anchors on the pages; `persano:langchange` event, D-35). No form-submit or FAQ-open tracking this phase
- **D-51:** Event taxonomy = **named custom events, stable snake_case names + param objects** (e.g. `play_badge_click {page}`, `language_switch {from, to}` — the `from/to` payload comes straight from the D-35 event detail). No reliance on GA4 auto-named defaults
- Locked gating (Init + STACK §5, not re-decided): zero Firebase script tags in any HTML; `firebase/analytics` imported dynamically only after consent grant; custom ~50-line banner, no CMP library, no Consent Mode; SDK = modular ESM from gstatic CDN, exact-pinned 12.18.0

### the agent's Discretion
- Banner copy wording, exact colors/sizing within the dark antique theme, banner behavior details (animation, focus management)
- Consent storage exact key name/timestamp format; analytics-load timing details after grant; debug logging approach
- Firestore `messages` schema field names, length caps, topic value strings, validation error message copy; client validation timing (on-blur vs on-submit)
- Honeypot placement/technique details; FAQ deletion-entry wording (mirrors policy per CMPL-04)
- Event param extra fields; contact.html section layout details

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. (Phase-boundary exclusions from `<domain>`: App Check enforcement v2 (FIRE-07), real screenshots/SEO/JSON-LD/AA audit (Phase 5), banner on privacy.html/404.html, any Android-app Firebase change.)

### Phase-Boundary Exclusions (from `<domain>`)
- NOT in this phase: App Check enforcement (FIRE-07, v2), real screenshots / SEO / JSON-LD / AA audit (Phase 5), consent banner on privacy.html or 404.html, any Firebase change to the Android app
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FIRE-01 | GDPR consent banner: affirmative action required, never auto-dismisses, choice persisted with timestamp, retraction path available | Consent-manager pattern (Pattern 1): state machine absent→banner→granted/denied, JSON `{v, analytics, ts}` in one localStorage key, footer retraction link, `setAnalyticsCollectionEnabled(false)` as retraction lever |
| FIRE-02 | Analytics loads ONLY after consent grant — no Firebase script tag in any HTML; dynamic import post-grant; zero SDK bytes before consent | Verified: gstatic modules load only via `import()`; analytics module pulls `firebase-app.js` itself via absolute URL; all vendor traffic (googletagmanager, firebaseinstallations) happens post-import |
| FIRE-03 | Consent-gated events: Play badge clicks, language switches | Verified hooks: badge anchor exists on exactly 1 page (`geohist/index.html:28`); `persano:langchange {from, to}` dispatched on `document` (`js/i18n.js:129-131`); `logEvent` export verified in shipped artifact |
| FIRE-04 | Contact form: labels, honeypot, client validation, success/error states; works after any consent choice | Form pipeline (Pattern 3) touches only auth+firestore modules — never analytics; engine-compatible i18n status pattern (pre-authored keyed variants) |
| FIRE-05 | Form submits via anonymous auth to Firestore; create-only schema-locked rules; rules file lives in repo | Verified exports: `signInAnonymously`, `getAuth`, `addDoc`, `collection`, `getFirestore`, `serverTimestamp`; rules pattern with `hasOnly` + length caps + `request.time` |
| FIRE-06 | Form supports "request data deletion" topic wired to CMPL-03 process | Topic enum value in schema + FAQ entry pattern (`<details class="faq-item">`) + owner manual process described in FAQ answer and contact page, wording mirrors `geohist/privacy.html` §4 |
| CMPL-03 | Data-deletion request path: FAQ entry + contact-form topic + documented manual process | privacy.html:33 verified wording: "Messages are deleted after they are handled" + email contact — FAQ/contact copy must quote these phrases (CMPL-04 single-source rule) |
</phase_requirements>

## Summary

Phase 4 wires three independent surfaces onto the existing 3-page site: (1) a consent gate that decides whether the Firebase Analytics SDK ever loads, (2) the Analytics event layer behind that gate, and (3) a contact form with its own page that submits to Firestore through anonymous auth under create-only rules. The architecture is deliberately fork-shaped: the form path imports `firebase-app.js` + `firebase-auth.js` + `firebase-firestore.js` lazily at submit time and never touches the analytics module, so the form works identically after consent grant **and** consent deny (the compliance surface requirement). The analytics path imports `firebase-analytics.js` only after a granted choice, which is the entire GDPR mechanism — the module pulls `firebase-app.js` itself via an absolute gstatic URL, and Google's measurement/config/installations network traffic only begins post-import.

The single highest-leverage discovery this session: **the gstatic 12.18.0 artifacts were downloaded and inspected directly**, so every module URL, export name, and load-order behavior below is verified against the code Google actually serves — not docs. Verified: `firebase-analytics.js` exports `getAnalytics/initializeAnalytics/isSupported/logEvent/setAnalyticsCollectionEnabled/settings`; `isSupported()` requires cookies AND IndexedDB; `getAnalytics()` throws `invalid-analytics-context` in unsupported environments and must be wrapped in `await isSupported()` (the SDK's own error text says so); `setAnalyticsCollectionEnabled(analytics, false)` sets `window['ga-disable-<measurementId>'] = true` — the natural retraction lever for D-44. `firebase-auth.js` exports `signInAnonymously/getAuth`; `firebase-firestore.js` exports `addDoc/collection/getFirestore/serverTimestamp`.

**Critical repo facts the planner must encode as tasks:** (1) `scripts/i18n-keycheck.mjs` hardcodes its page list — `contact.html` must be added or its keys escape the CI gate entirely; (2) the Play badge anchor exists on exactly **one** page, not three as the phase context's reusable-assets note says; (3) `persano:langchange` also fires at page init for auto-detected non-EN visitors, so the `language_switch` event semantics need one explicit decision; (4) every new key must land in **both** `js/i18n/es.json` and `pt-BR.json` 1:1 or `validate:i18n` fails the CI gate.

**Primary recommendation:** One consent module (`js/consent.js`) owning banner + storage + post-grant analytics loader; one form module (`js/contact.js`) with lazy auth/firestore import at submit; rules file `firebase/firestore.rules` in repo pasted to console; all new copy keyed with `consent.*`/`contact.*`/`geohist.faq.deletion.*` namespaces added 1:1 to both dictionaries.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Consent banner UI + storage | Browser (vanilla JS + localStorage) | — | No server tier exists; GitHub Pages is static. Choice lives client-side; nothing to sync |
| Analytics SDK loading (gate) | Browser (dynamic `import()` of gstatic ESM) | Firebase CDN (module host) | Load-gating is the whole compliance design: the import statement IS the gate |
| Consent-gated events | Browser (`logEvent` wrappers) | GA4 (collection) | Events fire client-side; vendor collects only post-grant |
| Form client validation + honeypot | Browser (vanilla JS) | — | No build step, no libraries; `:has()`/CSS for honeypot hiding + JS for fill-check |
| Form submission pipeline | Firebase Auth + Firestore (BaaS) | Browser (orchestrates calls) | Anonymous auth session + `addDoc` call originate in browser; storage is Firebase's |
| Schema enforcement (hard wall) | Firebase Security Rules (server-evaluated) | Browser validation (UX only) | Client validation is cosmetic to a bot; rules are the real gate — create-only, length caps, enum check |
| Data-deletion process (CMPL-03) | Human process (owner email handling) | Site content (FAQ/form topic) | Documented manual process; no automation in v1 |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Firebase JS SDK (gstatic ESM, modular) | **12.18.0 exact-pinned** | Analytics, Anonymous Auth, Firestore | Same version verified both on gstatic CDN (4 modules, HTTP 200) and in repo STACK (verified 2026-09-01); modular v9+ API is the only non-legacy surface |
| Vanilla ES2020+ classic scripts | platform | `js/consent.js`, `js/contact.js` | D-26: classic `<script defer>` only; classic scripts can `import()` ESM URLs dynamically — verified ES2020 dynamic import semantics |
| `js/i18n.js` engine (existing) | — | Translates all new banner/form/FAQ/consent copy | Zero engine changes needed; new keyed nodes join snapshot automatically |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| html-validate | 11.12.0 (installed) | Validates new `geohist/contact.html` via existing `geohist/*.html` glob | Every CI run |
| linkinator | 8.1.0 (installed) | Link-checks the new page + re wired footer links | Every CI run |
| `scripts/i18n-keycheck.mjs` | in-repo | 1:1 key parity gate — **needs its page list extended** | Every CI run |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom consent module (locked) | CMP library (Cookiebot/Klaro) | Locked OUT by Init decision — one two-choice banner doesn't justify TCF complexity |
| gtag Consent Mode (locked) | Load-gating | Locked OUT — load-gating is simpler and stricter (zero SDK bytes vs zero *cookies*) |
| Import auth+firestore at page load on contact.html | Import at submit time | Submit-time keeps the page at zero Firebase bytes and costs ~200–800KB of one-time CDN fetch on first submit — acceptable MVP tradeoff, agent discretion |

**Installation:**
```bash
# Nothing to install. Zero runtime npm deps (project constraint).
# Firebase modules are pinned URLs, e.g.:
# https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js
```

**Version verification:** All four gstatic module URLs verified this session via HTTP 200 + content-type `text/javascript; charset=UTF-8` + internal version strings (`@firebase/analytics` 0.10.24, `@firebase/installations` 0.6.24, matching the 12.18.0 release). ⚠️ `npm view` is **broken in this environment** (registry.npmjs.org returns 404 for every package, including already-installed devDeps — proxy issue, not package reality). No new npm installs are planned this phase, so this is a non-blocker; if a future phase needs registry lookups, resolve the proxy first.

## Package Legitimacy Audit

No external packages are installed in this phase (zero-build constraint; the gstatic CDN import *is* the runtime dependency). Dev tooling (`html-validate` 11.12.0, `linkinator` 8.1.0) was already installed and validated in Phases 1–3.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| *(none — no installs this phase)* | — | — | — | — | — | — |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*Environment note: npm registry verification was impossible this session (all `npm view` calls 404 through the local proxy, including installed packages). This is an environment limitation, not a package-legitimacy signal. The runtime dependency was verified directly against the gstatic CDN artifacts instead.*

## Architecture Patterns

### System Architecture Diagram

```
                       ┌──────────────────────────────────────┐
                       │  Page load (4 keyed pages: hub,      │
                       │  geohist/, guide, contact)           │
                       │  classic defer: i18n.js → consent.js │
                       └──────────────┬───────────────────────┘
                                      │
                          localStorage 'persano.consent.*'
                                      │
              ┌───────────────────────┼───────────────────────────┐
              │ absent (1st visit)    │ 'granted'                 │ 'denied'
              ▼                       ▼                           ▼
     ┌────────────────┐    ┌──────────────────────┐    ┌ (no analytics path)
     │ Fixed bottom   │    │ dynamic import() of  │    │ Analytics never
     │ banner: Accept │    │ gstatic 12.18.0      │    │ loads. Zero SDK
     │ + Reject equal │    │ firebase-app.js →    │    │ bytes. Form path
     │ prominence     │    │ firebase-analytics.js│    │ still works.
     └───────┬────────┘    └──────────┬───────────┘    └────────┬─────────
             │ affirmative            │ isSupported() guard      │
             ▼                        ▼                          │
   persist {v,choice,ts}   logEvent 'play_badge_click'          │
   localStorage            logEvent 'language_switch'           │
             │             (badge anchor, persano:langchange)    │
             │                        │                          │
             │ footer "Consent" link ─┘  retraction:            │
             │ re-opens banner,       setAnalyticsCollectionEnabled(false)
             │ flip stored choice     + stop own logEvent calls │
             ▼                                                   ▼
     ┌──────────────────────────────────────────────────────────────┐
     │ Contact form path (INDEPENDENT of consent branch)            │
     │ submit → honeypot check → client validation →                │
     │ import firebase-app/auth/firestore (lazy, once) →            │
     │ signInAnonymously() (reuse currentUser) →                    │
     │ addDoc(messages, {name?, email, topic, message,              │
     │                  createdAt: serverTimestamp()})              │
     └──────────────┬───────────────────────────────────────────────┘
                    ▼
     ┌──────────────────────────────────────────────────────────────┐
     │ Firestore Security Rules (server-evaluated, repo file)       │
     │ allow create: if request.auth != null                        │
     │   && keys().hasOnly([...]) && type/length/enum caps          │
     │   && createdAt == request.time                               │
     │ allow read/update/delete: if false                           │
     └──────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
js/
├── i18n.js              # existing engine — NO changes
├── consent.js           # NEW: banner + consent store + analytics loader
├── contact.js           # NEW: form validation + submit pipeline (contact.html only)
├── firebase-config.js   # NEW: initializeApp config object (public-by-design, committable)
├── analytics-track.js   # optional split: badge + langchange event wiring (or fold into consent.js)
└── i18n/
    ├── es.json          # + new keys (1:1)
    └── pt-BR.json       # + new keys (1:1)
firebase/
└── firestore.rules      # NEW: create-only rules, source of truth
geohist/
├── contact.html         # NEW page, mirrors guide.html scaffolding
├── index.html           # + FAQ deletion entry, + badge click wiring, footer swap
├── guide.html           # footer contact → form link
└── privacy.html         # UNTOUCHED (no banner, mailto preserved, wording source)
index.html               # hub: footer contact swap + banner markup
css/base.css             # + banner bar, form controls, status message styles
scripts/i18n-keycheck.mjs # + contact.html in pages list
scripts/smoke-check.sh   # + /geohist/contact.html 200 check (optional, cheap)
```

### Pattern 1: Consent manager (load-gating state machine)
**What:** One classic script owns a single localStorage key, renders/controls the banner, and is the ONLY caller of the analytics dynamic import.
**When to use:** Always in this phase — it is the locked architecture (Init + STACK §5).
**Example:**
```js
// Storage shape (agent discretion — recommended: versioned JSON for future purposes)
var KEY = 'persano.consent';           // agreed family per D-42
// localStorage value: {"v":1,"analytics":"granted","ts":"2026-09-02T21:00:00.000Z"}
// or {"v":1,"analytics":"denied","ts":...}. Absent key = no choice = banner shows.

function readConsent() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;                       // never chose → banner
    var c = JSON.parse(raw);
    if (c && c.v === 1 && (c.analytics === 'granted' || c.analytics === 'denied') && typeof c.ts === 'string') return c;
    return null;                                 // malformed → treat as no choice
  } catch (err) { return null; }                 // restricted storage → ask every visit (fail-closed)
}

function save(choice) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, analytics: choice, ts: new Date().toISOString() }));
  } catch (err) { /* session-only choice; banner returns next visit — correct fail-closed */ }
}
```
Fire the analytics loader only on `'granted'` (initial read) and on an Accept click. On a Reject-as-retraction (D-44): flip storage, hide banner, call `setAnalyticsCollectionEnabled(analytics, false)` if the SDK is already loaded this session, and stop all subsequent `logEvent` calls from our own wrappers.

### Pattern 2: Post-grant analytics loader
**What:** After grant, dynamically import the pinned module, init inside `isSupported()`, then wire the two FIRE-03 events.
**When to use:** Only after `readConsent().analytics === 'granted'` — never at page load.
**Example:**
```js
// Inside consent.js, after a granted choice:
import('https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js')
  .then(function (mod) { return import('https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js').then(function (appMod) { return { mod: mod, appMod: appMod }; }); })
  .then(function (mods) {
    var app = mods.appMod.initializeApp(FIREBASE_CONFIG);
    return mods.mod.isSupported().then(function (supported) {
      return supported ? mods.mod.getAnalytics(app) : null;   // MUST wrap — getAnalytics throws otherwise
    });
  })
  .then(function (analytics) {
    if (!analytics) return;                    // no cookies / no IndexedDB / extension env
    wireEvents(analytics);                     // play_badge_click + language_switch
    if (readConsent().analytics === 'denied') {
      // retraction arrived while SDK was loading: kill collection immediately
      modRef.setAnalyticsCollectionEnabled(analytics, false);
    }
  })
  .catch(function () { /* analytics failure must never break the page (SC-style silent degrade) */ });
```
Both imports in practice: `firebase-analytics.js` imports `firebase-app.js` itself via its absolute gstatic URL (verified in the artifact), so a single analytics import suffices — but `initializeApp` must come from an explicit `firebase-app.js` import for `getAuth`/`addDoc` later.

### Pattern 3: Contact-form submit pipeline (consent-independent)
```js
// contact.js — imports ONLY app+auth+firestore, lazily, once, at first submit
async function onSubmit(ev) {
  ev.preventDefault();
  if (honeypotEl.value !== '') { showStatus('sent'); return; }  // silent bot swallow
  var err = validate();                                          // email shape, message length, topic in enum
  if (err) { showStatus(err); return; }
  try {
    var [{ initializeApp }, { getAuth, signInAnonymously }, { getFirestore, collection, addDoc, serverTimestamp }] =
      await Promise.all([
        import('https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js')
      ]);
    var app = initializeApp(FIREBASE_CONFIG);
    var auth = getAuth(app);
    if (!auth.currentUser) await signInAnonymously(auth);        // submit-time only (locked pipeline)
    var db = getFirestore(app);
    await addDoc(collection(db, 'messages'), {
      name: nameEl.value || null,          // optional field — see rules pitfall 4
      email: emailEl.value.trim(),
      topic: topicEl.value,                // 'general' | 'bug' | 'feedback' | 'deletion'
      message: messageEl.value.trim(),
      createdAt: serverTimestamp()
    });
    showStatus('success'); form.reset();
  } catch (e) {
    showStatus('error');                   // keyed status; log e.code to console for debuggability
  }
}
```
The auth/firestore import does not read or write the consent key — this is what makes the form work after deny (locked compliance surface).

### Pattern 4: Create-only Firestore rules (repo file: `firebase/firestore.rules`)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{docId} {
      allow create: if request.auth != null
        && request.resource.data.keys().hasOnly(['name', 'email', 'topic', 'message', 'createdAt'])
        && request.resource.data.topic in ['general', 'bug', 'feedback', 'deletion']
        && request.resource.data.email is string
        && request.resource.data.email.size() > 0
        && request.resource.data.email.size() <= 254
        && request.resource.data.message is string
        && request.resource.data.message.size() >= 1
        && request.resource.data.message.size() <= 5000
        && (!('name' in request.resource.data) || request.resource.data.name is string)
        && (!('name' in request.resource.data) || request.resource.data.name.size() <= 100)
        && request.resource.data.createdAt == request.time;
      allow read, update, delete: if false;
    }
  }
}
```
Deployed by pasting the exact file content into Firebase Console → Firestore → Rules (manual prerequisite context). The repo file is the single source of truth; the console copy must match it verbatim.

### Pattern 5: i18n integration for dynamic form status (engine-compatible)
The engine swaps `textContent` of keyed nodes from its DOMContentLoaded snapshot. A single status node whose text JS rewrites fights the snapshot. Instead, pre-authorize every status variant as its own keyed element and toggle visibility:
```html
<p class="form-status" role="status" aria-live="polite" data-i18n="contact.status.sending" hidden>Sending…</p>
<p class="form-status" role="status" aria-live="polite" data-i18n="contact.status.success" hidden>Thanks — your message is on its way.</p>
<p class="form-status" role="status" aria-live="polite" data-i18n="contact.status.error" hidden>Something went wrong — write to santiagopostorivo@gmail.com.</p>
<p class="form-status" role="status" aria-live="polite" data-i18n="contact.status.invalid-email" hidden>…</p>
```
JS toggles `hidden`; the engine translates each variant like any other keyed node (works for both init-snapshot and later language switches). Validation-error copy per field follows the same multiple-keyed-nodes pattern if validation runs on-submit.

### Anti-Patterns to Avoid
- **Importing analytics at page load "just to check consent":** the import IS the consent act. Zero bytes means the module never appears before grant — no script tags anywhere (verified: FIRE-02 wording).
- **gtag Consent Mode / CMP libraries:** locked out (Init + D-series). Custom ~50-line banner only.
- **`*-compat.js` (v8 namespaced API):** legacy surface; modular only (STACK).
- **JS `textContent` injection for status text against dictionaries:** fights the snapshot engine; use pre-authored keyed variants (Pattern 5).
- **`display:none` honeypot field exposed to the a11y tree:** must carry `aria-hidden="true"` + `tabindex="-1"` so screen-reader users never tab into it.
- **Accept-only banner / dismiss-X / pre-checked boxes:** violates D-43 and FIRE-01 (affirmative action, never auto-dismiss).
- **Trusting client validation as the schema gate:** rules are the enforcement point; client validation is UX only.
- **Tracking `submit`/FAQ-open events:** out of FIRE-03 minimum scope (D-50).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Consent framework/TCF strings | A CMP in 50 lines of ambition | The locked ~50-line banner | One purpose (analytics), one banner, two buttons — a framework solves problems this site doesn't have |
| Analytics event buffering/queueing pre-SDK-load | Event queue replayed post-grant | Accept the gap: events before SDK load are lost | D-50 minimum scope; queueing pre-consent events is exactly what GDPR gating forbids |
| Bot filtering beyond honeypot | Captcha, rate limiting, fingerprinting | Honeypot + rules caps | App Check (FIRE-07) is the designated v2 hardening; hand-rolled filtering adds failure modes to a 1-person app site |
| Firestore schema validation client-side only | Trusting the browser | Repo rules file (server-evaluated) | Bots bypass the form entirely; rules are the schema lock (FIRE-05) |
| Custom i18n machinery for new copy | A second translation mechanism | Existing `data-i18n` + both dictionaries | Engine snapshot covers any static node; `validate:i18n` enforces 1:1 parity |

**Key insight:** every enforcement point that matters (consent, schema, auth) already has a platform-level mechanism — the phase's job is wiring, not inventing.

## Runtime State Inventory

Not a rename/refactor/migration phase — omitted per protocol. (No stored data, service config, OS state, secrets, or build artifacts carry renames. Note: the Firebase console-side configuration — Web App registration, authorized domain, Anonymous provider, Firestore DB — is owner-owned manual state documented under Manual Prerequisites, not runtime state this phase creates.)

## Common Pitfalls

### Pitfall 1: `validate:i18n` CI gate breaks (or worse, silently skips contact.html keys)
**What goes wrong:** `scripts/i18n-keycheck.mjs` line 21 hardcodes its page list: `const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html')];` — a new keyed `contact.html` is invisible to the gate, and any key-count change on existing pages fails 1:1 parity against both dictionaries.
**Why it happens:** the gate was written when 3 pages existed.
**How to avoid:** add `join('geohist', 'contact.html')` to the pages array as part of the same task that authors contact.html; every new key goes into BOTH `es.json` and `pt-BR.json` in the same commit.
**Warning signs:** `i18n-keycheck: FAIL — missing keys (...)` in CI.

### Pitfall 2: `language_switch` fires on initial auto-apply, not just user switches
**What goes wrong:** `js/i18n.js` dispatches `persano:langchange {from:'en', to:target}` at init when auto-detection applies a non-EN language (line 234, `dispatchLangChange('en', target)`), indistinguishable from a manual switch in the event detail.
**Why it happens:** the engine was designed with "applied switches only" semantics — init apply counts.
**How to avoid:** decide explicitly (agent discretion): log every `persano:langchange` (each marks a rendered non-EN transition; simplest, zero engine changes — recommended) or hold the first event per page-load. Document the choice in the task.
**Warning signs:** GA4 shows `language_switch` count ≈ pageviews for non-EN visitors.

### Pitfall 3: `getAnalytics()` throws outside supported environments
**What goes wrong:** without `await isSupported()` first, `getAnalytics` throws `invalid-analytics-context` when cookies are disabled, IndexedDB is unavailable, or in browser extensions (SDK error text: "Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments" — verified in the shipped artifact).
**Why it happens:** the SDK does not self-guard.
**How to avoid:** always `isSupported().then(supported => supported ? getAnalytics(app) : null)`.
**Warning signs:** uncaught promise rejections in consoles of hardened browsers.

### Pitfall 4: Rules dot-access on an absent optional field errors out
**What goes wrong:** `request.resource.data.name is string` evaluates to *deny* (error) when `name` is absent — but D-47 makes name optional.
**Why it happens:** Firestore rules dot-access of a missing key throws inside the expression.
**How to avoid:** guard optional fields: `(!('name' in request.resource.data) || request.resource.data.name is string ...)`, or use `.get('name', '')` defaults. ⚠️ Rules-language semantics here are training knowledge — **verify in the Firebase console Rules Playground (or emulator) during execution**, ideally with a test create for each topic value and a name-less submit.
**Warning signs:** every name-less real submission denied with `permission-denied`.

### Pitfall 5: Production-mode Firestore blocks all writes until rules are pasted
**What goes wrong:** production-mode Firestore (manual prerequisite) starts fully locked; the form 403s until the repo rules file is deployed via console.
**Why it happens:** locked mode default.
**How to avoid:** sequence the rules-deploy step (owner action, exact file paste) before form verification; keep `firebase/firestore.rules` in repo as the single source of truth and re-paste on any change.
**Warning signs:** console errors `permission-denied` on every submit despite valid input.

### Pitfall 6: Anonymous auth fails with console-side causes
**What goes wrong:** `signInAnonymously` rejects with `auth/operation-not-allowed` (Anonymous provider not enabled) or `auth/unauthorized-domain` (`persano.github.io` missing from Auth → Settings → Authorized domains).
**Why it happens:** both are manual-prerequisite items (owner actions in console).
**How to avoid:** verify prerequisites before execution (ROADMAP manual checklist); surface a generic keyed error message to users, log the specific code to console for debuggability.
**Warning signs:** auth-specific FirebaseError codes in console during first submit test.

### Pitfall 7: "Zero requests" test polluted by cached modules
**What goes wrong:** verifying SC2 ("fresh incognito, zero Firebase/Analytics network requests") in a browser that cached gstatic modules from earlier testing shows zero requests even when the gate is broken.
**How to avoid:** test in a truly fresh incognito profile (or DevTools "Disable cache" + hard reload); the pre-grant check is: zero requests to `gstatic.com/firebasejs`, `googletagmanager.com`, `firebaseinstallations.googleapis.com`, `firebase.googleapis.com`. Post-grant, expect exactly those vendors to appear.
**Warning signs:** any gstatic/googletagmanager entry in the Network tab pre-consent.

### Pitfall 8: Honeypot trips real users or screen readers
**What goes wrong:** an off-screen input without `aria-hidden`/`tabindex="-1"` sits in the tab order; autofill may populate it for humans.
**Why it happens:** CSS-hidden inputs remain focusable/fillable.
**How to avoid:** `tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`, name chosen to attract bots (e.g. `website`), positioned off-screen rather than `display:none` (defeats naive bot CSS checks).
**Warning signs:** legitimate submissions rejected by the honeypot check.

### Pitfall 9: Banner excluded pages regress (privacy.html / 404.html)
**What goes wrong:** adding banner script tags to `privacy.html` (EN-only/no-keys per D-37) or `404.html` (self-contained per Phase 1 rule) breaks their contract and adds keys those pages can't host.
**How to avoid:** banner markup + `js/consent.js` script tag go ONLY on the 4 keyed pages (D-42); `validate:html` + linkinator cover the rest automatically.
**Warning signs:** any `data-i18n` key appearing in privacy.html/404.html.

### Pitfall 10: Consent state and analytics loader race on retraction
**What goes wrong:** user grants → loader starts importing → user immediately retracts via footer link before module finishes loading → collection starts anyway.
**Why it happens:** async import gap.
**How to avoid:** after `getAnalytics` resolves, re-read the consent key; if flipped to denied, immediately `setAnalyticsCollectionEnabled(analytics, false)` (verified export; sets `window['ga-disable-<measurementId>']=true`) and skip event wiring. Retraction while granted: same call + stop own wrappers.
**Warning signs:** events recorded after a deny in DevTools network tab.

## Code Examples

### Badge click tracking (single anchor, verified location)
```js
// geohist/index.html:28 is the ONLY Play badge anchor on the site.
// Namespaced addEventListener — must not collide with i18n switcher handlers (Phase-03 pattern).
document.querySelectorAll('.badge-cta').forEach(function (a) {
  a.addEventListener('click', function () {
    logEventSafe('play_badge_click', { page: location.pathname });
  });
});
```

### Language-switch hook (payload straight from D-35 event)
```js
// js/i18n.js:129-131 (verified): document.dispatchEvent(new CustomEvent('persano:langchange', { detail: { from: from, to: to } }));
document.addEventListener('persano:langchange', function (ev) {
  logEventSafe('language_switch', { from: ev.detail.from, to: ev.detail.to });
});
```

### Honeypot markup
```html
<div class="hp-field" aria-hidden="true">
  <label for="hp_website">Website</label>
  <input id="hp_website" name="website" type="text" tabindex="-1" autocomplete="off">
</div>
<!-- CSS: .hp-field { position: absolute; left: -9999px; } — off-screen, not display:none -->
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Firebase v8 namespaced compat CDN | Modular v9+ ESM API | v9 (2021), current 12.x | This project locks modular-only (STACK); compat builds exist on gstatic but are legacy |
| gtag.js Consent Mode as gate | Load-gating (import IS the gate) | Locked at Init | Simpler, strictly zero SDK bytes pre-grant |
| RTDB for contact forms | Firestore (locked: cloud Firestore, not RTDB) | project decision | Rules language richer for schema-locking |

**Deprecated/outdated:** `firebase-*-compat.js` builds — do not import. `initializeFirestore`/`persistentLocalCache` extras — unnecessary at this scale; default `getFirestore` is right.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | GA4 custom-event constraints: name ≤40 chars, starts with a letter, `[a-zA-Z0-9_]` only; param key ≤40 chars, value ≤100 chars | Standard Stack / D-51 | Low — chosen names (`play_badge_click`, `language_switch`) and params fit with huge headroom; GA4 would just drop oversize params, no site breakage |
| A2 | Firestore rules language: `keys().hasOnly()`, `field in request.resource.data` guard for optional fields, `createdAt == request.time` matches a client `serverTimestamp()` | Pattern 4 / Pitfall 4 | **High for the form if wrong** — all submissions denied or malformed ones accepted. Mitigation: verify in console Rules Playground during execution before declaring FIRE-05 done |
| A3 | Anonymous-auth error codes `auth/operation-not-allowed`, `auth/unauthorized-domain` | Pitfall 6 | Low — failures surface immediately at first submit; console fix is the documented prerequisite path |
| A4 | `logEvent` accepts arbitrary named custom events without registration | FIRE-03 | Low — GA4 accepts custom events by default; worst case event appears only in DebugView |
| A5 | Analytics "zero bytes" claim holds with the analytics module pulling `firebase-app.js` itself | Pattern 2 | None — both fetches verified post-import; nothing pre-import exists |
| A6 | localStorage unavailability (restricted storage) → banner re-shows every visit | Pattern 1 | None functionally — fail-closed is the *correct* compliance behavior |

**Planner note:** A2 is the one assumption that must be exercised in the Firebase console during execution — put a `checkpoint`-style manual verification task around the Rules Playground test.

## Open Questions

1. **Does `language_switch` include the init-time auto-apply?**
   - What we know: engine dispatches `persano:langchange('en', target)` on init auto-apply (`js/i18n.js:234`); detail is indistinguishable from manual switches.
   - What's unclear: whether "switches" should count first-render applications.
   - Recommendation: log all occurrences (zero engine changes, still accurate signal); agent discretion per D-51.

2. **Import auth+firestore at page load vs submit time on contact.html?**
   - What we know: FIRE-02 constrains Analytics bytes only; form path needs auth+firestore eventually.
   - Recommendation: submit-time import (zero Firebase bytes on contact.html until real use); revisit if first-submit latency annoys.

3. **Rules file path + exact field names/caps** — planner's call per discretion (recommend `firebase/firestore.rules`, schema in Pattern 4 as starting point).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| gstatic CDN modules (app/analytics/auth/firestore) | FIRE-02/03/05 | ✓ (verified HTTP 200 ×4, `text/javascript`) | 12.18.0 | — (none needed; CDN is the deployment) |
| Firebase project: Web App registered + `persano.github.io` authorized domain | Anonymous auth (FIRE-05) | **owner action — verify before execution** | — | Blocks FIRE-05 testing until done |
| Firebase Anonymous provider enabled | FIRE-05 | **owner action — verify before execution** | — | Blocks all submits |
| Firestore DB in production mode | FIRE-05 | **owner action — verify before execution** | — | Blocks all submits (also locked until rules pasted) |
| Node.js | validate chain, i18n-keycheck | ✓ | 26.5.1 | — |
| node_modules (html-validate, linkinator) | CI validate chain | ✓ (installed) | 11.12.0 / 8.1.0 | — |
| npm registry access | (nothing this phase) | **✗ — proxy 404s all packages** | — | No installs planned; non-blocking |

**Missing dependencies with no fallback:** none in-repo. Firebase console prerequisites are owner actions (manual prerequisites items 2–4) — the planner should place a precondition note before form-verification tasks.

**Missing dependencies with fallback:** npm registry access (not needed — zero installs planned).

## Sources

### Primary (HIGH confidence)
- gstatic CDN artifacts, fetched and inspected this session: `https://www.gstatic.com/firebasejs/12.18.0/firebase-{app,analytics,auth,firestore}.js` — all HTTP 200; export surfaces (`initializeApp`; `getAnalytics, initializeAnalytics, isSupported, logEvent, setAnalyticsCollectionEnabled, setConsent, setCurrentScreen, setDefaultEventParameters, setUserId, setUserProperties, settings, getGoogleAnalyticsClientId`; `signInAnonymously, getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, signOut, deleteUser, …`; `addDoc, collection, doc, getFirestore, serverTimestamp, initializeFirestore, …`) verified in the shipped minified code; analytics internals verified: absolute-URL import of firebase-app.js, `insertScriptTag` of `googletagmanager.com/gtag/js`, installations endpoint `firebaseinstallations.googleapis.com`, `isSupported()` gates (extensions/cookies/IndexedDB), `ga-disable-<measurementId>` retraction flag, SDK_VERSION export
- In-repo (read this session): `js/i18n.js` (langchange dispatch 129-131; init apply 234), `scripts/i18n-keycheck.mjs` (pages list line 21), `package.json` (validate chain), `geohist/index.html` (FAQ pattern 95-127, badge 28, footer 139), `geohist/guide.html` (page pattern), `index.html` (hub footer 28), `geohist/privacy.html` (§3 SDK inventory, §4 retention/deletion wording line 33), `css/base.css` (theme tokens, no form styles), `scripts/smoke-check.sh`, `.planning/{REQUIREMENTS,STATE,ROADMAP,config.json}`, phase 04-CONTEXT.md, 02-01-PLAN.md key contract

### Secondary (MEDIUM confidence)
- `AGENTS.md` embedded STACK.md — verified against Firebase docs/npm on 2026-09-01 (one day before this research): CDN slugs, anonymous-auth doc, Firestore rules get-started, GA4 consent fields, GA actions versions
- Prior-phase plans: 02-01-PLAN.md i18n key contract (key syntax), 03-CONTEXT (D-35 event, D-34 storage)

### Tertiary (LOW confidence)
- GA4 event-name/param constraints (A1), Firestore rules-language semantics (A2) — training knowledge; verification paths documented above

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — SDK surface verified against shipped artifacts; no new packages
- Architecture: HIGH — fork-shaped consent/form split is locked by decisions; patterns grounded in verified code
- Pitfalls: HIGH for in-repo items (verified reads), MEDIUM for Firebase-console behaviors (prereq-verification step required)
- Rules-language details (A2): LOW — must be exercised in Rules Playground during execution

**Research date:** 2026-09-02
**Valid until:** 2026-10-02 (SDK pinned exact; CDN artifacts verified; Firebase console behavior stable)