# Phase 9: App Check, Monitor-First - Context

**Gathered:** 2026-09-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver invisible bot protection on the contact form: Firebase App Check with the **reCAPTCHA v3** provider, initialized as the 4th lazy CDN module in `contact.js`'s submit path (`initializeAppCheck` before auth/firestore access; zero reCAPTCHA bytes in served HTML — submit-time load only). Monitoring mode only in code: submissions succeed with zero user-visible change while the console accrues Verified/Uncertain metrics. Token-failure path gets a dedicated `contact.status.appcheck` keyed status node with email fallback (key #171 lands in all 20 dictionaries atomically) plus a consent-gated Analytics token-failure event. Enforcement flip is documented as a reversible, per-product (Firestore + Authentication) owner console step gated on evidence — never calendar — with the owner-agreed threshold; the reCAPTCHA v3 site key is registered against `geohisttrivia.com` (owner console step, runbook). Privacy policy gains a reCAPTCHA/App Check line with the consent-interplay nuance (CMPL-05). NOT in this phase: the enforcement flip execution itself (FIRE-10, post-monitoring future requirement), App Check on the Android app, any Analytics-module change (fork split locked), captcha UI of any kind.

</domain>

<decisions>
## Implementation Decisions

### Provider
- **D-01:** Provider is **reCAPTCHA v3** — free, no Cloud Billing, invisible 0.0–1.0 score, App Check app-risk threshold stays the 0.5 default. Enterprise rejected (billing + console complexity unjustified for a low-traffic form). Closes the STATE.md blocker "reCAPTCHA provider hinges on Cloud Billing willingness — owner decision, first task of Phase 9". — **Reversibility:** reversible — a provider swap touches the console registration plus `firebase-config.js` key and the `initializeAppCheck` call; no schema or contract changes.
- **D-02:** Site key is registered against **`geohisttrivia.com` only** — owner console step in reCAPTCHA Admin, documented in the owner runbook (Phase 8 D-11 pattern). Key is public-by-design like the rest of the Firebase config; it lives in `js/firebase-config.js`.

### Enforcement Gate (monitoring → enforcement)
- **D-03:** Flip gate is **Verified-rate + floor**: the Firebase console "almost all recent requests are Verified" signal (Firebase's own ready-to-enforce criterion) **AND** a successful-submission floor of **≈30 real submissions** proving real users pass before any enforcement. Never calendar-based (FIRE-09). Exact floor value (30 vs nearby) is pinned by the planner; the driver (Verified-rate + real-traffic floor) is locked.
- **D-04:** Monitoring ritual is a **weekly console glance**: Firebase console → App Check metrics — verified vs unverified split + successful-submission count. Documented in the enforcement runbook section shipped this phase (Phase 8 `08-RUNBOOK.md` pattern; phase-dir location).
- **D-05:** The flip is documented as a **per-product, reversible owner console step** (Firestore **and** Authentication — the form's whole chain), with instant rollback (flip off). Agent never flips it; FIRE-10 execution stays post-monitoring.

### Token-failure UX
- **D-06:** `contact.status.appcheck` wording is **neutral verify framing** with email fallback — e.g. "We couldn't verify this message — please email santiagopostorivo@gmail.com." No bot/captcha jargon, no reveal of the anti-abuse mechanism; same tone as the generic error status. Plain-text keyed node (no child markup; email as text, matching `contact.status.error`).
- **D-07:** **No auto-retry** — a token-fetch failure shows the appcheck status immediately; the visitor resends manually. Catch-path mapping: App Check-family errors (`app-check/*`, and post-enforcement `permission-denied` where attribution is clear) → appcheck status; everything else → generic error. Exact error-code attribution is the agent's discretion.
- **D-08:** The new key is **key #171 in all 20 dictionaries atomically** — the keycheck exact set-equality gate forces every dictionary to gain `contact.status.appcheck` in the same commit as the node. Agent drafts the 19 translations with per-language glossaries + two-pass drafting (Phase 7 D-07/D-08 pattern); per-wave owner spot-check precedent applies.

### Privacy (CMPL-05)
- **D-09:** `privacy.html` section 3 SDK inventory gains **one reCAPTCHA/App Check line** ("website only" phrasing like the Firestore entry) plus **one consent-interplay sentence**: App Check is anti-abuse transport (honeypot category), loads only when the form is submitted, and runs regardless of the analytics cookie choice. Static EN page (documented i18n exception); agent drafts, owner reviews before ship.

### the agent's Discretion
- Analytics token-failure event mechanics: the fork split (analytics only in `consent.js`) is locked — the pattern-consistent bridge is a custom document event from `contact.js` listened to by `consent.js`'s `logEventSafe` (the `persano:langchange` precedent). Planner confirms shape; event name + params are the agent's.
- `isTokenAutoRefreshEnabled: false` (research opinion, ARCHITECTURE.md §4 — submit-time instance used once; no background refresh pings).
- Local-testing approach: App Check debug provider/debug token for dev + whether smoke-check.sh needs an App Check-aware tweak (researcher verifies).
- Runbook file shape: one enforcement/monitoring section appended to a Phase-9 runbook doc (phase-dir) vs standalone doc — follow the 08-RUNBOOK pattern, planner's call.
- Exact appcheck message + privacy line copy (agent drafts EN + translations; owner vetoes in review).
- Whether the appcheck status also covers hard `initializeAppCheck` init failure vs only request-time token errors (both are App Check-family; agent decides mapping).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning / Requirements
- `.planning/ROADMAP.md` — Phase 9 goal, 5 success criteria (monitoring-mode invisible integration, appcheck status + email fallback, consent-gated token-failure event, evidence-gated owner flip + provider decision recorded, privacy mention), depends-on note (Phase 8: key registered against final domain)
- `.planning/REQUIREMENTS.md` — FIRE-07, FIRE-08, FIRE-09, CMPL-05 exact wording (lines 33–36); FIRE-10 as future requirement; Out-of-Scope table
- `.planning/STATE.md` — Locked decisions (consent load-gating; fork-shaped Firebase split "App Check must ride contact.js submit path, never page load"); blockers now resolved by D-01/D-03 (provider, threshold); FIRE-10 deferral row
- `.planning/PROJECT.md` — Key Decisions table (FIRE-07 via reCAPTCHA v3 monitoring-first; zero-build; Firebase split)

### Research (pre-v2, authoritative for this phase)
- `.planning/research/ARCHITECTURE.md` — §4 FIRE-07 (init order app→`initializeAppCheck`→auth→firestore, token auto-attach, no rules change, consent independence rationale, failure policy, domain coupling); Anti-Pattern 1 (no global init — never in consent.js/page load); Anti-Pattern 2 (never write the token into the Firestore payload); modified contact submit flow diagram
- `.planning/research/FEATURES.md` — Area B (monitoring-mode semantics: observability not protection until console flip; Verified/Uncertain classification; per-product enforcement; isSupported/score-threshold notes; FIRE-07 dependency chain on reCAPTCHA key + HOST-01)

### Prior Phase Context
- `.planning/phases/08-custom-domain-migration/08-CONTEXT.md` — D-01 domain final (geohisttrivia.com); D-11 owner-runbook pattern; D-12 agent-via-gh-CLI precedent; the reCAPTCHA key registers against the final domain once (this phase)
- `.planning/phases/07-localization-20-rtl/07-CONTEXT.md` — D-07/D-08 glossary mining + two-pass drafting pattern for the 19 new translations of the appcheck key; keycheck gate semantics

### Code (the integration surface)
- `js/contact.js` — the only JS touched: `loadModules()` gains the 4th lazy module (`firebase-app-check.js`); init order app→appcheck→auth→firestore; `showStatus()`/`statusEls` Pattern-5 keyed statuses; `.catch` path gains App Check-family mapping
- `js/firebase-config.js` — gains the public reCAPTCHA v3 site key (same public-by-design rationale, header comment updated)
- `js/consent.js` — potential listener for the token-failure Analytics event (fork-preserving bridge; `persano:langchange` precedent lines 132–135); NO App Check code here
- `geohist/contact.html` — gains the `contact.status.appcheck` pre-authored hidden status node (Pattern 5, lines 68–73 shape)
- `geohist/privacy.html` — section 3 SDK inventory (line 45–51) gains the reCAPTCHA/App Check line + note
- `firebase/firestore.rules` — UNTOUCHED (token rides request headers via the SDK; rules stay create-only schema-locked)
- `js/i18n/*.json` (20 dictionaries, 170 keys) + `scripts/i18n-keycheck.mjs` — surface moves 170→171 atomically; gate covers all 20 automatically once the key exists in one
- `.github/workflows/deploy.yml` — existing validate chain (html, i18n keycheck, domain gate); no new workflow needed
- `scripts/smoke-check.sh` — post-deploy smoke gate; researcher checks whether App Check changes its coverage
- `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` — structural pattern for the new enforcement runbook section

### External Console Surfaces (owner steps, in runbook)
- reCAPTCHA Admin: register v3 site key, domain allowlist = `geohisttrivia.com` only
- Firebase console → App Check: confirm the app registers, monitoring metrics (Verified/Uncertain split, APIs tab for Firestore + Authentication), per-product enforcement toggles (flip = D-05, later)
- Firebase console → Auth/Firestore: no changes (allowlists current from Phase 8)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `contact.js` `loadModules()` dynamic-import family — the 4th module slots in with one array entry + one namespace slot; import-once caching already handles re-submit
- `contact.js` `getApp()` try/catch reuse — handles "analytics initialized the default app first"; `initializeAppCheck` rides the same reused app instance, no new coordination
- `showStatus()`/`statusEls` Pattern-5 map — the appcheck variant is one new pre-authored node + one `data-status` key, no engine change
- `consent.js` `logEventSafe()` + document-event precedent — fork-preserving Analytics event bridge for the token-failure signal exists as a working pattern (`persano:langchange`)
- 20 dictionaries + keycheck gate — adding the key to one dictionary extends CI coverage to all 20 with zero script edits

### Established Patterns
- Keyed node = plain-text-only (no child markup) — appcheck message carries the email as text
- Silent-degradation failure policy — App Check failure must never break the form; monitoring mode means zero user-visible change
- Fork-shaped Firebase split (locked): analytics only in consent.js, auth+firestore only in contact.js — App Check lives in contact.js's submit path; the event, not the module, crosses the fork
- Submit-time-only lazy loading — zero reCAPTCHA bytes in served HTML matches the zero-Firebase-bytes-before-submit contract
- Zero build step, classic defer scripts, zero globals (D-26 house style)

### Integration Points
- `contact.js` `loadModules()` + `send()` — App Check init slots between app init and `getAuth()`; token auto-attaches to `addDoc` + anonymous-auth requests via SDK headers
- `js/firebase-config.js` global — gains the site key field read by `contact.js` init
- `scripts/i18n-keycheck.mjs` exact set-equality — every dictionary must gain `contact.status.appcheck` in the same commit as the `contact.html` node (red-gate proven pattern from Phase 6)
- `geohist/privacy.html` section 3 — SDK inventory list is the CMPL-05 landing spot
- Owner console: reCAPTCHA Admin key + Firebase App Check metrics — the monitoring evidence surface the weekly ritual reads

</code_context>

<specifics>
## Specific Ideas

- Owner picked "Verified-rate + floor" deliberately: a quiet form could otherwise flip on near-zero-traffic evidence — the ≈30-submission floor is the real-user proof
- Weekly cadence chosen over per-submission checking because the form is low-traffic; evidence accrues anyway, ritual must be sustainable
- Neutral framing chosen so visitors aren't confused and spammers learn nothing — email fallback does the recovery work
- No auto-retry chosen to keep the in-flight double-submit guard simple; manual resend is the recovery path
- Owner re-confirmed during this session: selector-page removal + GeoHist-as-home is wanted, but as its own work item — not Phase 9

</specifics>

<deferred>
## Deferred Ideas

- **Selector-page removal + GeoHist-as-home** — owner re-raised it in this discussion; site restructure (new capability), already on STATE.md backlog from Phase 8. Its own phase after Phases 9–10.
- **App Check enforcement flip execution (FIRE-10)** — post-monitoring owner console step; documented this phase, executed later.

</deferred>

---

*Phase: 9-App Check, Monitor-First*
*Context gathered: 2026-09-07*
