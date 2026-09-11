# Phase 9: App Check, Monitor-First - Research

**Researched:** 2026-09-07
**Domain:** Firebase App Check (reCAPTCHA v3) on a static GitHub Pages contact form — modular web SDK v12.18.0 via gstatic CDN, monitoring-mode integration, token-failure UX, evidence-gated enforcement runbook
**Confidence:** HIGH (all external claims verified against official Firebase docs fetched live this session, all dated 2026-09-02; SDK behavior verified against the actual gstatic 12.18.0 bundles + official SDK source; all in-repo claims verified by reading source files this session)

## Summary

Phase 9 inserts Firebase App Check as the 4th lazy CDN module in `contact.js`'s submit path, in monitoring mode. External research confirmed the core premise: shipping `initializeAppCheck` code makes every auth/firestore request carry a token, but **products accept un-attested requests until the console enforcement flip** — monitoring mode is the code's natural state, zero user-visible change [VERIFIED: firebase.google.com/docs/app-check/web/recaptcha-provider]. The single most important design finding: **SDK-swallowed token failures are invisible in monitoring mode** — the auth bundle logs a warning and proceeds un-attested, so *without an explicit `getToken()` call there is no failure signal at all*, and the success-criterion-3 Analytics metric could never fire. The public `getToken(appCheck, false)` **rejects** on failure (verified in the 12.18.0 bundle) — it is the observable seam that produces both the D-06 status UX and the enforcement-decision metric.

Two corrections to prior research surfaced: (1) runtime App Check error codes are **`appCheck/…`** (camelCase), not `app-check/…` as CONTEXT.md D-07 colloquially writes — the catch-path mapping must be case-tolerant; (2) **replay protection is NOT available for Firestore** (standard Google services support it only for Firebase AI Logic as of 2026-09-02 docs) — the enforcement runbook must not document it as a Firestore option.

Three constraints with sharp edges for the planner: the i18n key lands as surface key #171 in **19 JSON dictionaries + the contact.html markup** atomically (the "20 dictionaries" count includes EN-as-markup, which has no en.json); the ja/zh values **cannot carry the raw email** (ASCII periods fail the CJK punctuation gate — Phase 7 precedent: `contact.status.error` in ja/zh omits it); and the ≈30-submission enforcement floor plus the "almost all recent requests Verified" console signal are both documented owner-side — the agent writes the runbook, never flips enforcement (FIRE-10 is future).

**Primary recommendation:** Gate the submission on an explicit `getToken(appCheck, false)` call (cached instance, init order app→appcheck→getToken→auth→firestore); on rejection map `appCheck/`-family errors to the dedicated appcheck status + consent-gated Analytics event; document the per-product console flip (Firestore + Authentication) and weekly Verified-rate + 30-submission floor in a phase-dir runbook.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Implementation Decisions (locked)

- **D-01:** Provider is **reCAPTCHA v3** — free, no Cloud Billing, invisible 0.0–1.0 score, App Check app-risk threshold stays the 0.5 default. Enterprise rejected. Reversible — a provider swap touches the console registration plus `firebase-config.js` key and the `initializeAppCheck` call.
- **D-02:** Site key is registered against **`geohisttrivia.com` only** — owner console step in reCAPTCHA Admin, documented in the owner runbook. Key is public-by-design like the rest of the Firebase config; it lives in `js/firebase-config.js`.
- **D-03:** Flip gate is **Verified-rate + floor**: the Firebase console "almost all recent requests are Verified" signal **AND** a successful-submission floor of **≈30 real submissions**. Never calendar-based (FIRE-09). Exact floor value pinned by the planner; the driver is locked.
- **D-04:** Monitoring ritual is a **weekly console glance**: Firebase console → App Check metrics — verified vs unverified split + successful-submission count. Documented in the enforcement runbook section shipped this phase (phase-dir location).
- **D-05:** The flip is documented as a **per-product, reversible owner console step** (Firestore **and** Authentication — the form's whole chain), with instant rollback. Agent never flips it; FIRE-10 execution stays post-monitoring.
- **D-06:** `contact.status.appcheck` wording is **neutral verify framing** with email fallback — e.g. "We couldn't verify this message — please email santiagopostorivo@gmail.com." No bot/captcha jargon, no reveal of the anti-abuse mechanism; plain-text keyed node (no child markup; email as text, matching `contact.status.error`).
- **D-07:** **No auto-retry** — a token-fetch failure shows the appcheck status immediately; the visitor resends manually. Catch-path mapping: App Check-family errors (`app-check/*`, and post-enforcement `permission-denied` where attribution is clear) → appcheck status; everything else → generic error. Exact error-code attribution is the agent's discretion.
- **D-08:** The new key is **key #171 in all 20 dictionaries atomically** — keycheck exact set-equality gate forces every dictionary to gain `contact.status.appcheck` in the same commit as the node. Agent drafts the 19 translations with per-language glossaries + two-pass drafting; per-wave owner spot-check precedent applies.
- **D-09:** `privacy.html` section 3 SDK inventory gains **one reCAPTCHA/App Check line** ("website only" phrasing like the Firestore entry) plus **one consent-interplay sentence**: App Check is anti-abuse transport (honeypot category), loads only when the form is submitted, and runs regardless of the analytics cookie choice. Static EN page; agent drafts, owner reviews before ship.

### the agent's Discretion

- Analytics token-failure event mechanics: fork split (analytics only in `consent.js`) is locked — the pattern-consistent bridge is a custom document event from `contact.js` listened to by `consent.js`'s `logEventSafe` (the `persano:langchange` precedent). Planner confirms shape; event name + params are the agent's.
- `isTokenAutoRefreshEnabled: false` (submit-time instance used once; no background refresh pings).
- Local-testing approach: App Check debug provider/debug token for dev + whether smoke-check.sh needs an App Check-aware tweak.
- Runbook file shape: one enforcement/monitoring section appended to a Phase-9 runbook doc (phase-dir) vs standalone doc — follow the 08-RUNBOOK pattern, planner's call.
- Exact appcheck message + privacy line copy (agent drafts EN + translations; owner vetoes in review).
- Whether the appcheck status also covers hard `initializeAppCheck` init failure vs only request-time token errors (both are App Check-family; agent decides mapping).

### Deferred Ideas (OUT OF SCOPE)

- **Selector-page removal + GeoHist-as-home** — site restructure, its own phase after Phases 9–10.
- **App Check enforcement flip execution (FIRE-10)** — post-monitoring owner console step; documented this phase, executed later.
- Any Analytics-module change (fork split locked), App Check on the Android app, captcha UI of any kind.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description (REQUIREMENTS.md, verbatim wording abbreviated) | Research Support |
|----|-------------|------------------|
| FIRE-07 | Contact form protected by App Check in monitoring mode — `initializeAppCheck` as 4th lazy CDN module in `contact.js` submit path, init before auth/firestore; zero reCAPTCHA bytes in served HTML; zero user-visible change; provider decision (reCAPTCHA v3 vs Enterprise) recorded in-phase | Module `firebase-app-check.js` verified on gstatic CDN 12.18.0 (HTTP 200, 26 KB); init order requirement + monitoring-mode semantics verified from official docs; provider decision already locked (D-01); reCAPTCHA script is SDK-injected at init — no HTML edit needed |
| FIRE-08 | Token-failure UX — dedicated `contact.status.appcheck` node with email fallback + Analytics token-failure event | Public `getToken(appCheck, false)` verified to REJECT on failure (bundle) — the only observable failure seam in monitoring mode; Pattern-5 keyed status node shape verified in contact.html:68–73; document-event bridge pattern verified in consent.js:132–135 |
| FIRE-09 | Enforcement flip documented as owner console step, gated on successful-submission count (never calendar); per-product (Firestore + Auth), reversible; monitoring ritual with owner-agreed threshold | Flip path verified: Security → App Check → APIs tab → expand product → **Enforce**; "almost all of the recent requests are from verified clients" = ready-to-enforce signal [VERIFIED]; per-product incl. Authentication verified; rollback = toggle off; enforcement propagation ≤15 min; D-03 floor (≈30) is the owner-agreed threshold |
| CMPL-05 | Privacy policy mentions reCAPTCHA/App Check (consent interplay nuance) | reCAPTCHA script loads from `https://www.google.com/recaptcha/api.js` SDK-injected at submit-time init only [VERIFIED bundle] — supports the "loads only when the form is submitted, runs regardless of analytics choice" line; landing spot privacy.html:44–52 SDK inventory |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| App Check init + token gate | Browser (contact.js submit path) | — | Token attestation is a client capability; rides the existing lazy import family; zero page-load footprint |
| reCAPTCHA v3 attestation | External service (Google) | Browser (SDK-injected script) | SDK injects `www.google.com/recaptcha/api.js` and exchanges the score server-side with Firebase |
| Enforcement decision + flip | External console (owner) | Runbook doc (repo) | Per-product Enforce toggles live in Firebase console; repo documents, never executes |
| Monitoring metrics (Verified split) | External console (Firebase) | Analytics event (consent-gated) | Console classifies requests server-side; the client-side Analytics event is the complementary failure-rate signal |
| Token-failure UX + i18n | Browser (contact.js + dictionaries) | CI gate (keycheck) | Keyed status node pattern; ×19 dictionaries + markup atomicity enforced by keycheck |
| Privacy disclosure | Static HTML (privacy.html) | Owner review | EN-only documented exception; consent-interplay wording per D-09 |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Firebase JS SDK `firebase-app-check.js` (gstatic ESM CDN) | **12.18.0 exact-pinned** (matches the three existing modules) | `initializeAppCheck`, `ReCaptchaV3Provider`, `getToken` | Same CDN base as app/auth/firestore already in `contact.js`; verified served at 12.18.0 (HTTP 200, `Content-Length: 26160`); bundle itself imports the full-URL `firebase-app.js`, so the ES module cache dedupes it with the existing app import — no double-app hazard |
| reCAPTCHA v3 provider (Google, free) | n/a (console-registered) | Attestation provider | D-01 locked; site key + secret key from `google.com/recaptcha/admin/create`; no Cloud Billing |

**Exports needed from the app-check module (verified against official API reference, fetched live):** `initializeAppCheck(app, options)` — "Can be called only once per app"; `ReCaptchaV3Provider(siteKey)`; `getToken(appCheck, forceRefresh?) → Promise<AppCheckTokenResult>` — "checks for a valid token in memory, then local persistence (IndexedDB). If not found, or if forceRefresh is true, makes a request to the App Check endpoint for a fresh token"; `onTokenChanged`, `setTokenAutoRefreshEnabled`, `getLimitedUseToken` exist but are **not needed** (getLimitedUseToken is for non-Firebase backends / replay protection — see State of the Art).

**No new npm packages. No new HTML script tags. No new workflow.** The only repo-side dependency surface is the 4th entry in `contact.js`'s `Promise.all` import array.

### Package Legitimacy Audit

> No external packages are installed this phase (Firebase rides the CDN import; dev tooling unchanged). Nothing to audit; no `checkpoint:human-verify` inserts needed.

| Package | Registry | Verdict | Disposition |
|---------|----------|---------|-------------|
| — | — | — | none installed this phase |

## Architecture Patterns

### System Architecture Diagram

```
Visitor submits contact form (/geohist/contact.html)
        │
        ▼
honeypot swallow → client validation (UNCHANGED, pre-network)
        │
        ▼
loadModules(): dynamic import ×4 ─────────────────────────────► gstatic CDN
   [app, auth, firestore, APP-CHECK(new)]                        (12.18.0, submit-time only;
        │                                                         zero Firebase/reCAPTCHA bytes
        ▼                                                         in served HTML before this)
reuse-or-create default app (existing getApp() try/catch)
        │
        ▼
initializeAppCheck(app, {ReCaptchaV3Provider(siteKey),              ──► SDK injects
  isTokenAutoRefreshEnabled:false})        [NEW, cache-once]           www.google.com/recaptcha/api.js
        │                                                            (invisible v3, score 0.0–1.0)
        ▼
getToken(appCheck, false)          [NEW gate — the ONLY observable
        │                           token-failure seam in monitoring mode]
   ┌────┴─────────────────┐
   │ resolves (token)     │ rejects (appCheck/* error)
   ▼                      ▼
signInAnonymously      showStatus('appcheck')        [NEW keyed status]
   │ (anon auth)       + dispatch 'persano:appcheck' ──► consent.js listener
   ▼                      document event (fork-       → logEventSafe('appcheck_token_failure',
addDoc(messages,…)        preserving bridge;             {code}) — consent-gated,
   │ (token auto-         analytics untouched)           silently no-op on deny
   ▼  attached via
   ▼  X-Firebase-AppCheck header by SDK)
Backend (monitoring mode): products accept requests
with missing/invalid tokens — console classifies each
request Verified / Outdated client / Unknown origin / Invalid
        │
        ▼
Owner weekly ritual (D-04): Firebase console → App Check →
APIs tab → Verified split + submission count → evidence accrues
        │
        ▼ (later, post-monitoring — FIRE-10, documented NOT executed)
Security → App Check → APIs tab → expand product metrics
→ Enforce (Firestore AND Authentication) — reversible, ≤15 min to take effect
```

### Recommended Project Structure

```
├── js/
│   ├── contact.js              # MODIFIED — 4th lazy module; init chain app→appCheck→getToken→auth→firestore;
│   │                           #   appcheck catch-mapping; document-event dispatch
│   ├── firebase-config.js      # MODIFIED — public reCAPTCHA v3 site key field (same global)
│   ├── consent.js              # MODIFIED (minimal) — one listener in wireEvents() for the token-failure event
│   └── i18n/*.json ×19         # MODIFIED — +contact.status.appcheck in every dictionary (atomic with markup)
├── geohist/
│   ├── contact.html            # MODIFIED — pre-authored hidden status node (Pattern 5, line 68–73 shape)
│   └── privacy.html            # MODIFIED — section 3 SDK inventory + consent-interplay sentence (D-09)
└── .planning/phases/09-app-check-monitor-first/
    └── 09-RUNBOOK.md           # NEW — owner console steps: reCAPTCHA registration, App Check registration,
                                #   weekly monitoring ritual, evidence gate, per-product flip + rollback
UNTOUCHED: firebase/firestore.rules (token rides request headers, not payload),
           .github/workflows/deploy.yml, scripts/smoke-check.sh (HTTP-status-only checks — see below),
           all other pages, css/base.css
```

### Pattern 1: The monitoring-mode semantic (verified, load-bearing)

**What:** The client SDK attaches tokens to every Firebase request, but products **accept requests with missing or invalid tokens until enforcement is enabled console-side**. Verbatim: "The updated client app will begin sending App Check tokens along with every request it makes to Firebase, but Firebase products will not require the tokens to be valid until you enable enforcement in the App Check section of the Firebase console" [VERIFIED: docs/app-check/web/recaptcha-provider, updated 2026-09-02].

**Verified at SDK level (12.18.0 auth bundle):** `_getAppCheckToken()` reads the AppCheck service with `getImmediate({optional: true})`, and on `e?.error` only calls `_logWarn('Error while retrieving App Check token: …')` then sends the request **without** the `X-Firebase-AppCheck` header [VERIFIED: gstatic 12.18.0 firebase-auth.js]. Consequence: in monitoring mode a failed token fetch produces **no thrown error** anywhere in the form's auth/firestore chain — the only visible signal would be a console warning. Therefore the manual `getToken()` gate is not optional decoration; it is the sole mechanism that satisfies FIRE-08's Analytics metric and D-06's status UX.

**When to use:** always in this phase — it is the phase's whole point.

### Pattern 2: The `getToken()` gate (the observable seam)

Public `getToken(appCheck, forceRefresh?)` is verified to **reject** on failure — 12.18.0 bundle: `async function getToken(e,t){const r=await getToken$2(e,t); if(r.error) throw r.error; if(r.internalError) throw r.internalError; return {token:r.token}}` [VERIFIED: gstatic bundle]. The internal interposer variant instead *resolves* with a dummy `{token, error}` result (which is why services proceed silently); the public API deliberately re-throw. On success it also caches the token (memory → IndexedDB), so the immediately-following `signInAnonymously`/`addDoc` attach the already-fetched token — no double reCAPTCHA run.

```javascript
// Source: contact.js existing structure + verified SDK behavior (pattern sketch, not final code)
var appCheckInstance = null;                    // cache-once (see Pitfall 2)

function send(values) {
  return loadModules().then(function (mods) {
    var config = window.persanoFirebaseConfig;
    if (!config) throw new Error('Firebase config missing');
    var app;
    try { app = mods.app.getApp(); } catch (noDefault) { app = mods.app.initializeApp(config); }

    if (!appCheckInstance) {                   // "Can be called only once per app"
      appCheckInstance = mods.appCheck.initializeAppCheck(app, {
        provider: new mods.appCheck.ReCaptchaV3Provider(config.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: false
      });
    }
    /* THE GATE: rejects with appCheck/* on failure — the monitoring-mode
     * failure signal; resolves with a cached-or-fresh token that the
     * following auth/firestore requests auto-attach. */
    return mods.appCheck.getToken(appCheckInstance, false).then(function () {
      var auth = mods.auth.getAuth(app);
      var authReady = auth.currentUser ? Promise.resolve() : mods.auth.signInAnonymously(auth);
      return authReady.then(function () { /* …addDoc unchanged… */ });
    });
  });
}
```

**Trade-off to state in the plan (consequence of D-07's abort semantics):** with the gate-abort design, a visitor whose adblocker blocks `www.google.com/recaptcha/api.js` sees the appcheck status **even in monitoring mode**, though the backend would have accepted the un-attested request. This is correct per D-07 ("shows the appcheck status immediately; the visitor resends manually") and it makes the Analytics event a true measure of would-be-blocked traffic — exactly the enforcement-decision metric. Success criterion 1 ("submissions succeed with zero user-visible change") describes the normal path where reCAPTCHA loads.

### Pattern 3: Catch-path mapping (D-07, case-tolerant)

**Verified error surface (official SDK source `packages/app-check/src/errors.ts` + live bundle):** the ErrorFactory is constructed with service string `'appCheck'`, and codes are built as `` `${service}/${code}` `` — so runtime codes are **`appCheck/already-initialized`, `appCheck/use-before-activation`, `appCheck/fetch-network-error`, `appCheck/fetch-parse-error`, `appCheck/fetch-status-error`, `appCheck/storage-open`, `appCheck/storage-get`, `appCheck/storage-write`, `appCheck/recaptcha-error`, `appCheck/initial-throttle`, `appCheck/throttled`** [VERIFIED: SDK source + strings confirmed in bundle]. CONTEXT.md D-07's "`app-check/*`" spelling is the colloquial form; the literal prefix is camelCase.

**Recommended mapping (agent discretion per D-07):** a case-tolerant prefix test — `/^app-?check\//i.test(err.code)` — routes App Check-family errors (init failure, token fetch failure) to the appcheck status; post-enforcement Firestore rejects an un-attested write with `permission-denied`, which under the create-only-true ruleset is attributable to App Check with high confidence (the rules themselves allow every well-formed create, so `permission-denied` can only come from the enforcement wall) → also appcheck status; **everything else → generic error**. Auth-side post-enforcement rejection surfaces through Identity Toolkit with a murky `auth/…` code — generic error (D-07's "everything else").

### Pattern 4: Analytics token-failure event (fork-preserving bridge)

Contact.js dispatches a document event; consent.js listens and routes through `logEventSafe`, which re-checks the stored consent on every send (consent-denied → silently no-op) [VERIFIED pattern: consent.js:116–123, 132–135]. `contact.js` gains zero analytics imports; `consent.js` gains zero App Check code — the event, not the module, crosses the fork (locked boundary).

```javascript
// contact.js (appCheck catch path):
document.dispatchEvent(new CustomEvent('persano:appcheck', { detail: { code: err.code || 'unknown' } }));
// consent.js (wireEvents(), mirroring the persano:langchange listener):
document.addEventListener('persano:appcheck', function (ev) {
  var detail = (ev && ev.detail) ? ev.detail : {};
  logEventSafe('appcheck_token_failure', { code: String(detail.code || 'unknown').slice(0, 40) });
});
```

Event name/params are agent's discretion (CONTEXT). GA4 custom-event naming (letters/digits/underscores, must start with a letter, ≤40 chars) matches the existing `play_badge_click`/`language_switch` precedent [ASSUMED: GA4 naming rules — consistent with shipped events, not re-verified this session].

### Pattern 5: Keyed status node (Pattern 5, unchanged engine)

One pre-authored hidden node in `contact.html` mirroring lines 68–73 exactly: `<p class="form-status" role="status" aria-live="polite" data-status="appcheck" data-i18n="contact.status.appcheck" hidden>…EN text…</p>`, plus one `statusEls` map entry via the existing `data-status` walk — no `showStatus()` engine change. Plain text only (email as text, D-06).

### Anti-Patterns to Avoid

- **Anti-Pattern 1: Initializing App Check globally (consent.js or page load)** — loads reCAPTCHA bytes for every visitor on every page, couples the compliance surface to the consent choice, pollutes Verified-rate metrics with page-views that never submit [prior research Anti-Pattern 1, re-affirmed].
- **Anti-Pattern 2: Manual `getToken()` stashed into the Firestore payload** — the token rides the `X-Firebase-AppCheck` request header via the SDK automatically; writing it into documents bloats the schema and would need a rules edit. Rules stay untouched [VERIFIED: header attachment seen in auth bundle; Firestore behaves the same].
- **Anti-Pattern 3: Relying on automatic-attach alone for failure detection** — in monitoring mode the SDK swallows token failures (log-only); you'd ship the metric and the UX as dead code. The explicit `getToken()` gate is required.
- **Anti-Pattern 4: Adding `localhost` to the reCAPTCHA domain list to test locally** — docs warn this "would allow anyone to run your app from their local machines" [VERIFIED: docs/app-check/web/debug-provider]. Use the debug provider instead (below).
- **Anti-Pattern 5: Committing or shipping a debug token** — "Do not commit your debug token to a public repository, and do not ship your debug token or debug build in production builds" [VERIFIED: same page]. This repo's entire tree is publicly served.
- **Anti-Pattern 6: Tracking the v3 "latest" CDN version or the reCAPTCHA script in HTML** — app-check module stays exact-pinned at 12.18.0 with the other three; the reCAPTCHA script must never appear as a page-level `<script>` (submit-time-only contract).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bot attestation / score | Own challenge, timing heuristics, or payload fingerprints | Firebase App Check + reCAPTCHA v3 provider | Score model, server-side exchange, per-product enforcement wall are the platform's job; enforcement lives console-side, not in code |
| Token lifecycle (fetch, cache, refresh, TTL) | Custom token storage/retry | `initializeAppCheck` + SDK internals | Token cached in memory + IndexedDB; TTL (default 1 day, configurable 30 min–7 days) handled by SDK; manual reimplementation leaks edge cases (throttling, storage-open) |
| Token-failure detection | Watching network responses / guessing from auth errors | Public `getToken(appCheck, false)` promise rejection | Only documented, stable rejection surface; verified in the shipped bundle |
| Key parity across 20 locales | Manual checks | Existing `scripts/i18n-keycheck.mjs` exact set-equality gate | Adding the key to one dictionary + markup extends coverage automatically; gate is red-gate proven |
| Consent-gated event sending | New consent plumbing in contact.js | `consent.js` `logEventSafe` + document-event bridge | Re-checks consent per send; fork boundary preserved |

**Key insight:** App Check's protection model is deliberately asymmetric — code attests, console enforces. Every attempt to "enforce in code" (manual token gating of rules, payload-embedded tokens, client-side score checks) is either dead code in monitoring mode or a hand-rolled worse version of the platform wall.

## Runtime State Inventory

> Not a rename/refactor phase, but this phase **creates live console-side state** that outlives the code — inventoried because half the phase is owner-console work.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — Firestore `messages` schema unchanged; App Check adds no document fields (token rides headers) | none |
| Live service config (new) | (1) reCAPTCHA v3 site key + **secret key** registered at `google.com/recaptcha/admin/create`, domain allowlist = `geohisttrivia.com` only (D-02); (2) Firebase console → Security → App Check → **Apps tab** → register the web app with the reCAPTCHA provider, **providing the secret key** [VERIFIED: docs — "You'll need to provide the *secret key* you got in the reCAPTCHA site"] | Owner console steps — documented in the phase runbook. **The secret key never enters the repo** (repo is publicly served; site key alone is public-by-design) |
| Live service config (existing, verified current) | Firebase Auth authorized domains + GCP API-key referrer restrictions already include `geohisttrivia.com` (Phase 8, runbook §3); Firestore console ruleset (repo mirror is `firebase/firestore.rules`, create-only) | none — App Check needs no rules change; enforcement is the console wall, not rules |
| OS-registered state | None — verified by design (static Pages site, no OS services) | none |
| Secrets/env vars | No new secrets in repo. reCAPTCHA **secret key** is the one new secret — lives in reCAPTCHA Admin / Firebase App Check registration only | none (runbook states the keep-it-out-of-repo rule) |
| Build artifacts | None — zero-build site; no lockfile changes (no new dev deps) | none |

## Common Pitfalls

### Pitfall 1: Assuming the Analytics event will fire from the auth/firestore catch path
**What goes wrong:** planner wires the token-failure event into the existing `.catch` on `send()` — it never fires in monitoring mode.
**Why it happens:** in monitoring mode the SDK never throws on token failure; auth proceeds un-attested with a `_logWarn` only [VERIFIED bundle].
**How to avoid:** the explicit `getToken()` gate (Pattern 2) is the only rejection source in monitoring mode; wire the event + status from its rejection (and from init-time `appCheck/*` failures).
**Warning signs:** monitoring metrics show "Unknown origin"/"Outdated client" requests with zero `appcheck_token_failure` events.

### Pitfall 2: Calling `initializeAppCheck` inside `send()` unguarded
**What goes wrong:** second submit in a session re-runs init → `appCheck/already-initialized` (thrown only when options differ; same-options calls return the existing instance [VERIFIED: errors.ts message — "call initializeAppCheck() with the same options… This will return the already initialized instance"]).
**Why it happens:** `send()` runs per submit; `modules` caching covers imports, not the init call.
**How to avoid:** cache the instance module-level (`appCheckInstance`, Pattern 2) — same guard shape as `modules`/`importing`. Do not rely on same-options idempotence; it is fragile against config edits.
**Warning signs:** resubmit after a success throws `already-initialized` in console.

### Pitfall 3: The CJK dictionaries cannot carry the raw email
**What goes wrong:** drafting `contact.status.appcheck` in ja/zh with the literal `santiagopostorivo@gmail.com` → `i18n-keycheck.mjs` fails (ASCII period not between digits fails the half-width punctuation gate scoped to ja+zh; I18N-09).
**Why it happens:** D-06 says "email as text, matching `contact.status.error`" — but the error key itself **omits** the email in ja/zh (verified values this session: ja `問題が発生しました — しばらくしてからもう一度お試しください。`, zh `出现了问题 — 请稍后再试。`; ar/ur/latin scripts keep the raw email).
**How to avoid:** mirror the per-language strategy of `contact.status.error`: email as text in EN/ES/PT + most scripts; ja/zh (and any dictionary whose register/gate forbids it) drop the email and keep the neutral verify framing + retry/contact-form pointer.
**Warning signs:** keycheck red on ja.json/zh.json at the atomic commit.

### Pitfall 4: The atomicity set is 19 JSON files + the markup, not "20 dictionaries"
**What goes wrong:** planner budgets "20 dictionary edits"; there is no en.json.
**Why it happens:** CONTEXT counts EN (which lives as raw HTML markup — the keycheck extracts the key surface from the 5 keyed pages and compares each of the **19** JSON dictionaries). Verified this session: 19 `js/i18n/*.json` files, all exactly 170 keys.
**How to avoid:** one atomic commit: contact.html node (surface 170→171) + all 19 dictionaries + contact.js/status wiring; gate covers every dictionary automatically once the key exists.
**Warning signs:** keycheck output `surface 171 keys, dictionary 170 keys`.

### Pitfall 5: Documenting the enforcement flip as instant or as including replay protection
**What goes wrong:** runbook promises "instant" flip effect or a Firestore replay-protection toggle that doesn't exist.
**Why it happens:** prior research (FEATURES.md Area B) tagged Firestore replay protection [HIGH]; current docs (fetched 2026-09-07, updated 2026-09-02) state replay protection for standard Google services is **only available for Firebase AI Logic** [VERIFIED].
**How to avoid:** runbook states: flip = Security → App Check → APIs tab → expand product metrics → **Enforce** → confirm; **takes up to 15 minutes to take effect**; rollback = same toggle off (also ≤15 min propagation). Firestore flip is baseline protection (session tokens, TTL default 1 day) only.
**Warning signs:** owner can't find a replay-protection option for Firestore in the console.

### Pitfall 6: Wrong error-prefix match in the catch path
**What goes wrong:** `err.code.startsWith('app-check/')` never matches → token failures fall through to the generic error.
**Why it happens:** CONTEXT.md D-07 writes `app-check/*`; the runtime literal is `appCheck/…` (camelCase) [VERIFIED: SDK source + bundle strings].
**How to avoid:** case-tolerant regex `/^app-?check\//i` (Pattern 3).
**Warning signs:** manually blocking the reCAPTCHA script in devtools shows generic error instead of appcheck status.

### Pitfall 7: Local testing assumptions
**What goes wrong:** expecting form submissions from `localhost` to fail under App Check, or "fixing" it by adding localhost to the reCAPTCHA domain list (forbidden — docs warning) [VERIFIED].
**Why it happens:** localhost is not on the key's domain allowlist, so reCAPTCHA attestation fails there.
**How to avoid:** (a) in monitoring mode, localhost submissions **succeed anyway** (token fails → un-attested → backend accepts; only the appcheck status + event fire — actually useful for testing the failure path!). (b) For clean Verified metrics from a local browser: debug provider — `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` set **before** `initializeAppCheck`; console prints `AppCheck debug token: "…"`; owner safelists it via Apps tab → ⋮ → **Manage debug tokens** [VERIFIED]. v9+ reads the flag at init time, so setting it in JS just before init works. For this zero-build site, a `location.hostname === 'localhost'` guard is safe-by-construction (never activates on prod hosts) — or a local-only uncommitted tweak; agent's discretion per CONTEXT.
**Warning signs:** localhost testing shows appcheck status while prod works fine.

### Pitfall 8: Reading "almost all requests Verified" against near-zero traffic
**What goes wrong:** flipping (or planning to flip) on a handful of requests; the console signal is meaningless at low volume.
**Why it happens:** docs' ready-to-enforce guideline ("almost all of the recent requests are from verified clients") has no floor; this form is low-traffic.
**How to avoid:** D-03 locks the driver: Verified-rate signal **AND** ≈30 real submissions. The weekly ritual (D-04) reads both. Note the category semantics for the runbook: **Verified** = valid token; **Outdated client** = missing token from an older app version (≈0 here — static site deploys instantly, no version skew); **Unknown origin** = missing token, not looking like the Firebase SDK — the forged/stolen-API-key spam vector (the Firebase config is public; today the REST API is callable directly with it); **Invalid** = bad token; **Reused token** = replay-protected reuse [VERIFIED: docs/app-check/monitor-metrics].
**Warning signs:** "100% Verified" celebrated at 3 submissions.

## Code Examples

### Init order + gate inside the existing send() chain
See Pattern 2 sketch above. Ordering rationale: docs require init "before you access any Firebase services" [VERIFIED]; `appCheck/use-before-activation` error exists for the wrong order [VERIFIED: errors.ts]. In practice the auth bundle looks up the AppCheck service lazily per-request (`getImmediate({optional:true})`), but honor the documented order — it is also what CONTEXT locks.

### firebase-config.js addition
```javascript
window.persanoFirebaseConfig = {
  apiKey: '…', authDomain: '…', projectId: '…', appId: '…', measurementId: '…',
  recaptchaSiteKey: '6L…'   // public-by-design; counterpart to the SECRET key
                            // registered console-side in Firebase App Check (never in repo)
};
```

### Status node (mirror of contact.html:68–73)
```html
<p class="form-status" role="status" aria-live="polite" data-status="appcheck"
   data-i18n="contact.status.appcheck" hidden>We couldn't verify this message — please email santiagopostorivo@gmail.com.</p>
```
(EN default in markup; translations per dictionary with the Pitfall-3 CJK constraint.)

### Privacy line shape (D-09, privacy.html section 3 ul)
```html
<li><strong>reCAPTCHA v3 / Firebase App Check (website only):</strong> when you submit the
contact form, Google's reCAPTCHA runs in the background to protect the form from abuse.
It is an anti-abuse mechanism, not measurement — it runs regardless of your analytics
cookie choice, and only when you submit the form.</li>
```
(Agent drafts; owner reviews. "Website only" phrasing mirrors the Firestore entry at privacy.html:51.)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FEATURES.md "Verified/Uncertain" monitoring categories | Current docs: **Verified / Outdated client / Unknown origin / Invalid / Reused token** | docs fetched 2026-09-07 (page updated 2026-09-02) | Runbook uses current names; "almost all recent requests Verified" guideline unchanged |
| FEATURES.md: replay protection on Firestore "strongest config" [HIGH] | **Refuted:** replay protection for standard Google services is only available for Firebase AI Logic | docs/app-check/enable-enforcement, updated 2026-09-02 | Runbook: Firestore flip = baseline protection only; don't document a nonexistent toggle |
| reCAPTCHA v3 docs at developers.google.com/recaptcha/docs/v3 | Marked deprecated → Cloud Fraud Defense direction; v3 keys still standard for App Check | prior research + reCAPTCHA docs | D-01 (v3) unaffected — v3 remains the App Check web provider of record in Firebase docs |
| `isTokenAutoRefreshEnabled` default | SDK does **not** auto-refresh by default; explicit `true` required to enable | docs note (2026-09-02) | `false` (explicit) = the default behavior made deliberate; zero background reCAPTCHA pings — matches CONTEXT discretion |

**Deprecated/outdated:**
- Legacy v8 namespaced `appCheck().activate()` compat surface exists in docs examples — never use (house rule: modular only).
- `developers.google.com/recaptcha/docs/v3` is flagged deprecated in favor of Cloud Fraud Defense material — cite Firebase's App Check pages as the authoritative surface for this integration.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | GA4 custom-event naming rules (letters/digits/underscore, start with letter, ≤40 chars) allow `appcheck_token_failure` | Pattern 4 | Low — mirrors shipped `play_badge_click`/`language_switch` precedent; worst case rename |
| A2 | reCAPTCHA v3 domain allowlist is configured per-key in the reCAPTCHA Admin console (UI-level mechanics) | Runtime State / D-02 | Low — owner does it in the console UI; runbook phrases it as the UI flow |
| A3 | Post-enforcement Firestore rejection surfaces as `permission-denied` (403 → SDK code mapping) | Pattern 3 | Low — D-07 already scopes attribution ("where attribution is clear"); misattribution degrades to generic error, never breaks the form |
| A4 | `location.hostname === 'localhost'` debug-token guard ships safely (never activates on prod hosts) | Pitfall 7 | Low — docs verify the flag is read at init/activation time and only honored by the SDK locally; planner may prefer a local-only uncommitted tweak instead |
| A5 | App Check token TTL default "1 day" phrasing read through a compressed docs fetch; 30 min–7 days range is firm, exact default wording slightly garbled | Standard Stack / Pitfall 5 | Negligible — irrelevant to phase code (submit-time instance; cached token either valid or refetched) |

## Open Questions (RESOLVED)

1. **Exact floor value (≈30) — planner pins per D-03.** — **RESOLVED (shipped):** pinned to **successful form submissions**, floor **≥ 30** — see 09-RUNBOOK §5 ("Submission floor: ≥ 30 successful submissions" + "Unit, pinned: ... successful form submissions, **not** console request rows", lines ~97-104).
   - What we knew: driver locked (Verified-rate + floor); owner said ≈30; Phase 7/8 precedent puts exact constants on the planner.
   - Resolution note: the successful-submission unit was chosen (user-facing, matches REQUIREMENTS.md FIRE-09 wording) and is read alongside the console Verified split in the weekly ritual — exactly the original recommendation.
2. **Should the appcheck status cover hard `initializeAppCheck` failure? (agent's discretion per CONTEXT)** — **RESOLVED (shipped):** init and token acquisition are ONE appCheck-family failure surface — see js/contact.js's case-tolerant appCheck-family catch mapping (comment block at ~line 212: "token-time appCheck/* failures are one family, one status"), matching D-07's "App Check-family errors → appcheck status".
3. **Debug-provider guard shipped vs local-only.** — **RESOLVED (shipped):** local-only debug flow — see 09-RUNBOOK §7 ("Local testing — the debug-token flow (never the domain list)", line ~129); nothing debug-flagged in the committed bundle.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| gstatic CDN `firebase-app-check.js` | 4th lazy module | ✓ | 12.18.0 verified live (HTTP 200, 26,160 bytes) | — |
| gstatic CDN `firebase-app.js` (bundle dependency) | app-check module import | ✓ | 12.18.0 (already used) | — |
| Node (for i18n-keycheck + validate chain) | CI gate | ✓ | node 24 in CI (deploy.yml), local node present | — |
| reCAPTCHA Admin console (owner) | site key + secret key registration | owner step | — | blocks D-02 until owner registers; **monitoring metrics only accrue after the key is registered AND the code ships** |
| Firebase console App Check (owner) | app registration (secret key), metrics, debug-token safelist, enforcement toggles | owner step | — | — |

**Missing dependencies with no fallback:** none — all external surfaces are owner console steps documented in the runbook; code can merge and deploy before the owner completes registration (submissions keep working; App Check requests classify as Unknown origin/Outdated client until registration, then Verified — the runbook's weekly ritual starts from the code-ship date).

**Missing dependencies with fallback:** none.

## Sources

### Primary (HIGH confidence)
- Firebase docs — App Check reCAPTCHA v3 web provider (`firebase.google.com/docs/app-check/web/recaptcha-provider`, updated 2026-09-02, fetched 2026-09-07): registration (site key + secret key), Apps-tab registration with secret key, TTL 30 min–7 days default 1 day, score 0.0–1.0, app-risk threshold default 0.5 (scores strictly below rejected), unenforce-before-threshold-raise warning, init-before-services, `initializeAppCheck`/`ReCaptchaV3Provider`/`isTokenAutoRefreshEnabled` API, monitoring-before-enforcement statement
- Firebase docs — Monitor App Check request metrics (`/docs/app-check/monitor-metrics`, updated 2026-09-02): console path Security → App Check → **APIs tab**; Verified / Outdated client / Unknown origin / Invalid / Reused token categories; "almost all of the recent requests are from verified clients" ready-to-enforce guideline
- Firebase docs — Enable App Check enforcement (`/docs/app-check/enable-enforcement`, updated 2026-09-02): per-product Enforce flow (expand product metrics → Enforce → confirm), "all unverified requests to that product will be rejected", ≤15 min propagation, replay protection (beta) — **standard Google services: only Firebase AI Logic**; session-token baseline model
- Firebase docs — App Check debug provider in web apps (`/docs/app-check/web/debug-provider`, updated 2026-09-02): `self.FIREBASE_APPCHECK_DEBUG_TOKEN` mechanics, v9+ init-time read, Manage debug tokens UI, never-add-localhost + never-commit-token warnings
- Firebase JS SDK API reference (`/docs/reference/js/app-check.md`, fetched live): `initializeAppCheck` ("Can be called only once per app"), `getToken(appCheck, forceRefresh?)`, `onTokenChanged`, `setTokenAutoRefreshEnabled`, `getLimitedUseToken` semantics; no `isSupported` export for app-check
- Firebase JS SDK official source: `packages/app-check/src/errors.ts` (full appCheck error-code family) and `packages/util/src/errors.ts` (`fullCode = ${service}/${code}` → camelCase `appCheck/…` prefix)
- Live gstatic 12.18.0 bundles (fetched + inspected this session): `firebase-app-check.js` (26,160 B, HTTP 200; imports full-URL `firebase-app.js`; injects `https://www.google.com/recaptcha/api.js`; `getToken` public API re-throws `r.error`; internal interposer resolves dummy `{token, error}`; debug-token branch), `firebase-auth.js` (lazy optional AppCheck lookup; `_logWarn`-and-proceed on token error; `X-Firebase-AppCheck` header attach)

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md` §4 + Anti-Patterns 1–2 (init order, fork split, header-not-payload) — verified consistent against today's sources
- `.planning/research/FEATURES.md` Area B — monitoring-mode semantics verified; **two corrections recorded** (category names; Firestore replay protection refuted)

### Tertiary (LOW confidence)
- GA4 custom-event naming rules (A1) — training knowledge, consistent with shipped precedent

## Metadata

**Confidence breakdown:**
- Standard stack / API surface: HIGH — official docs + live CDN bundles + official SDK source, all fetched this session
- Architecture (gate design, catch mapping, event bridge): HIGH — mechanism verified at bundle level; the gate design follows directly from verified rejection semantics
- Pitfalls: HIGH — every pitfall grounded in verified doc text, bundle behavior, or read repo files
- Monitoring/enforcement runbook content: HIGH — console flows taken verbatim from current official docs

**Research date:** 2026-09-07
**Valid until:** ~2026-10-07 (Firebase App Check web docs are stable; re-verify only if SDK major bump is ever adopted — version is exact-pinned at 12.18.0)
