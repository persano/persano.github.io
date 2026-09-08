# Phase 09 Owner Runbook — App Check: Register → Activate → Monitor → Enforce (Console Steps)

**Audience:** Santiago (owner). Every step below is a reCAPTCHA-Admin or Firebase-console click — no code, no CLI. Agent-owned steps (the 09-01 shipped code; the §3 one-line activation if you prefer to delegate it) are listed for cross-reference only.

**Public-artifact notice:** this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.** Two values are private in this phase and must never be pasted into the repo, chat logs, or this file: the reCAPTCHA **secret key** (§1 — consumed once by the Firebase console in §2) and any App Check **debug token** (§7 — console safelisting only). The reCAPTCHA **site key** is the one paste-able value: it is public-by-design, exactly like the rest of `js/firebase-config.js`.

**Status legend:** ✅ done (verified this session) · ⬜ TODO (yours) · 🔍 soft check (nice-to-have, non-blocking)

---

## §0 · Current state (as of the 09-01 code ship, 2026-09-07)

| # | Surface | Live state | Status | Owner action |
|---|---------|-----------|--------|--------------|
| 1 | 09-01 App Check code | Shipped — dormant-by-default gate in `contact.js`'s submit path (init app → app check → `getToken` → auth → Firestore), `contact.status.appcheck` fallback status, consent-gated `appcheck_token_failure` event | ✅ | none |
| 2 | reCAPTCHA v3 site key + secret key (reCAPTCHA Admin) | Not created | ⬜ | **§1** |
| 3 | Firebase App Check app registration | Not registered | ⬜ | **§2** |
| 4 | Site key in code (`js/firebase-config.js` `recaptchaSiteKey`) | Empty string = dormant (init skipped; legacy path unchanged) | ⬜ | **§3** |
| 5 | Monitoring metrics (App Check → APIs tab) | Not accruing — needs §1 + §2 + §3 deployed on top of the shipped code | ⬜ | starts after §3 |
| 6 | Enforcement (Firestore / Authentication) | OFF — monitoring mode (un-attested requests are accepted) | ✅ correct today | **do not flip until the §5 gate passes** |

**Weekly ritual starts from the code-ship date** (09-01, shipped 2026-09-07): until §1–§3 complete there is nothing meaningful to read — the ritual becomes live the moment §3 activation deploys.

---

## §1 · reCAPTCHA Admin — create the v3 key pair (D-01/D-02)

1. Open **google.com/recaptcha/admin/create** with the Google account that owns the Firebase project.
2. Type: **reCAPTCHA v3** — free, no Cloud Billing, invisible (score 0.0–1.0, no checkbox, no challenge). Provider decision locked (D-01: Enterprise rejected).
3. Label: anything you will recognize, e.g. `GeoHist contact form (App Check)`.
4. **Domain list: add `geohisttrivia.com` ONLY.** The www host 301s to apex before any page loads, so the apex entry covers it (Phase 8 §3a rationale). Nothing else belongs in this list — and especially never `localhost` (§7 explains why).
5. Submit. reCAPTCHA shows two keys:
   - **SITE key** — public-by-design. This is the value §3 pastes into `recaptchaSiteKey`. You can re-read it anytime from the key's settings page.
   - **SECRET key** — console-only credential. It is consumed exactly once, by §2 (Firebase App Check registration). **Never paste it into the repo, chat logs, or this file.** Store it in your password manager.
6. 🔍 Soft check: on the key's settings page, confirm the domain list shows exactly `geohisttrivia.com`.

---

## §2 · Firebase console — register the app with App Check

1. Firebase console → your project → **Security → App Check**.
2. **Apps tab** → locate the web app (its config is the same Firebase project `js/firebase-config.js` points at) → **Register**.
3. Provider: **reCAPTCHA** → paste the **SECRET key** from §1 when the console asks. This is the only place the secret is ever used.
4. App-risk threshold: keep the **0.5 default** (D-01 — under enforcement, scores strictly below 0.5 are rejected; monitoring mode ignores the threshold entirely).
5. Confirm: the app now shows as registered with the reCAPTCHA provider; the **APIs tab** will start listing **Firestore** and **Authentication** request metrics once §3 is deployed and requests flow.

---

## §3 · Activation — paste the site key (the one-line code step)

The shipped code is dormant until the site key exists:

```js
// js/firebase-config.js — current shipped state:
recaptchaSiteKey: ''
```

1. Paste your **SITE key** (public-by-design) between the quotes: `recaptchaSiteKey: '<your site key>'`. No other edit. You can do it yourself or hand the value to the agent in chat — this is the one value that is safe to share.
2. Deploy (the agent pushes; CI validate → Pages deploy), then send **one real submission** through the form at `https://geohisttrivia.com/geohist/contact.html`.
3. Expect **zero visible change** (monitoring mode): success toast, message lands in the Firestore `messages` collection. If instead you see the "We couldn't verify this message…" status or the generic error — stop and tell the agent; that is the failure path, not the expected post-activation behavior.
4. After that submit, **Security → App Check → APIs tab** begins accruing request metrics for Firestore + Authentication. **§4 starts now.**

---

## §4 · Weekly monitoring ritual (D-04)

Once a week, one glance — after activation:

1. **Firebase console → Security → App Check → APIs tab.** For **both** **Firestore** and **Authentication**, read the category split (semantics table below).
2. **Count successful submissions:** Firebase console → **Firestore → `messages` collection** → sort by `createdAt` descending → count messages created since the code-ship date. This count is the §5 floor unit — successful form submissions, not console request rows.
3. **Skim the `appcheck_token_failure` trend** (§8) — the complementary client-side failure signal.
4. Record the reading wherever you keep notes (a one-row "week of X: Verified Y%, submissions Z" log is enough).

### Category semantics (what each console category means here)

| Category | Meaning | Expected on this form |
|----------|---------|----------------------|
| **Verified** | Request carried a valid App Check token | Climbs toward ~100% after §3 activation |
| **Outdated client** | Missing token from an older app version | ≈0 — a static site deploys instantly, no version skew |
| **Unknown origin** | Missing token, not shaped like a Firebase SDK request — the forged/stolen-config spam vector | **The row to watch.** The Firebase config is public; this category is where direct-REST abuse shows up |
| **Invalid** | Request carried a token that failed validation | Should stay ≈0; investigate if it grows |
| **Reused token** | A token replayed past its reuse window | ≈0 for this form |

---

## §5 · Evidence gate — when the flip may be considered (D-03 / FIRE-09)

The enforcement flip is considered **ONLY when BOTH hold**, read in the §4 ritual:

1. **Ready-to-enforce signal:** on the relevant product's APIs-tab metrics, the console's own guideline reads true — *almost all of the recent requests are from verified clients* (Firebase's ready-to-enforce wording).
2. **Submission floor:** **≥ 30 successful submissions** have accumulated since the code-ship date (the §4 step-2 count).

**Boundary, both directions:**

- **Below 30 → keep monitoring.** A "100% Verified" reading at 3 submissions is meaningless — there is no evidence real users pass.
- **At/above 30 with a clean Verified rate → §6 becomes available** for that product.

**Unit, pinned:** the floor counts **successful form submissions** (messages visible in Firestore) — **not** console request rows. One submission = 2+ requests (anonymous auth + Firestore write), so request counts overshoot the real-user count by design.

**Never calendar:** there is no date or elapsed-time trigger in this gate. It is evidence-only — both signals, or no flip.

---

## §6 · Per-product enforcement flip + rollback (D-05) — owner console step

**Who:** the owner only. The agent never flips enforcement — execution is **FIRE-10**, a post-monitoring future requirement. Nothing in this repo calls any enforcement API.

**Where:** Firebase console → **Security → App Check → APIs tab**.

**Flip (per product, separately):**

1. Expand the product's metrics card — **Firestore** first, then separately **Authentication** (the form's whole chain: auth must accept before Firestore can matter).
2. Read that product's Verified split one more time (the §5 gate).
3. Click **Enforce** → confirm.
4. Propagation: enforcement **takes up to 15 minutes to take effect**. After the window, send one real submission and confirm it still lands.

**Rollback (same surface):** the same toggle, off — un-attested requests are accepted again; propagation is also **≤ 15 minutes**. Rollback is the first response to any post-flip submit failure, before any debugging.

**What the Firestore flip does NOT include:** the Firestore flip is **baseline session-token protection** only. A **replay-protection option does NOT exist for Firestore** — replay protection for standard Google services is available only for Firebase AI Logic. Do not hunt for it in the console; it is not there, and this runbook deliberately does not document it as an option.

---

## §7 · Local testing — the debug-token flow (never the domain list)

App Check attestation fails on `localhost` (it is not on the §1 domain list) — that is expected, and it is not something to fix by widening the allowlist.

**Flow (local dev only):**

1. Set `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` **before** `initializeAppCheck` runs (a local, uncommitted tweak — e.g. one temporary line in `contact.js`).
2. Open the local form and submit; the browser console prints `App Check debug token: "…"`.
3. Safelist it: **Firebase console → Security → App Check → Apps tab → ⋮ → Manage debug tokens** → paste the token. Requests from your local browser now classify as Verified (clean local metrics).

**Two hard warnings:**

- ❌ **Never add `localhost` (or any non-production host) to the reCAPTCHA domain allowlist** — the docs are explicit: it would allow anyone to run your app from their local machines. Not even "temporarily."
- ❌ **Never commit the debug token, and never ship the debug flag** — this repo's entire tree is publicly served. To be explicit: never commit the debug token anywhere, and never ship the debug flag in the production bundle; a committed debug token is a standing backdoor into your App Check metrics, and a shipped flag does the same from prod.

**Useful side effect:** in monitoring mode, `localhost` submissions **succeed anyway** — the token fetch fails, the request goes un-attested, and the backend accepts it. Expect the local failure path ("We couldn't verify this message…" status + an `appcheck_token_failure` event where consent was granted) *while the message still lands in Firestore*. That is exactly how to exercise the failure path locally without touching prod.

---

## §8 · Analytics metric reference — `appcheck_token_failure`

**What it is:** a consent-gated custom Analytics event measuring client-side token failures — **would-be-blocked** token failures (adblockers, reCAPTCHA outages, hard network failures), the complement of the console Verified split. The console classifies requests that *arrive*; this event captures what *failed before it could arrive*.

**Shipped wiring (09-01):** the `getToken` gate in `contact.js` rejects on token failure → `contact.js` dispatches the `persano:appcheck` document event → the `consent.js` listener routes it through `logEventSafe('appcheck_token_failure', { code })` — sent only when the visitor granted analytics consent, silently no-op otherwise (fork boundary preserved: no analytics code in `contact.js`, no App Check code in `consent.js`).

**Where to read:** Firebase console → **Analytics → Events** → `appcheck_token_failure` (GA4 custom events can take up to 24 h to appear after the first fire).

**Param:** `code` — the App Check error string (`appCheck/…`, e.g. `appCheck/recaptcha-error` for a blocked/failed reCAPTCHA run), truncated to 40 chars. A rising trend with a healthy console Verified rate = visitors blocked *by their own environment*, not by abuse — useful context when reading the §5 gate.

---

*Phase 09 · App Check, Monitor-First · runbook authored 2026-09-07 by plan 09-02 (Task 1) · flip execution stays FIRE-10, post-monitoring*
