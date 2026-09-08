# Phase 09 Owner Runbook — App Check: Register → Activate → Monitor → Enforce (Console Steps)

**Audience:** Santiago (owner). Every step below is a reCAPTCHA-Admin or Firebase-console click — no code, no CLI. Agent-owned steps (the 09-01 shipped code; the §3 one-line activation if you prefer to delegate it) are listed for cross-reference only.

**Public-artifact notice:** this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.** Two values are private in this phase and must never be pasted into the repo, chat logs, or this file: the reCAPTCHA **secret key** (§1 — consumed once by the Firebase console in §2) and any App Check **debug token** (§7 — console safelisting only). The reCAPTCHA **site key** is the one paste-able value: it is public-by-design, exactly like the rest of `js/firebase-config.js`.

**Status legend:** ✅ done (verified this session) · ⬜ TODO (yours) · 🔍 soft check (nice-to-have, non-blocking)

> **Revised 2026-09-08 (G-09-2 / plan 09-03):** Firebase deprecated the classic reCAPTCHA provider for new App Check registrations; the owner registered web-geohist as reCAPTCHA Enterprise. D-01 (classic v3, Enterprise then rejected) is revised accordingly; the code now ships the Enterprise provider.

---

## §0 · Current state (as of the 09-03 Enterprise swap, 2026-09-08)

| # | Surface | Live state | Status | Owner action |
|---|---------|-----------|--------|--------------|
| 1 | 09-01 App Check code | Shipped — dormant-by-default gate in `contact.js`'s submit path (init app → app check → `getToken` → auth → Firestore), `contact.status.appcheck` fallback status, consent-gated `appcheck_token_failure` event | ✅ | none |
| 2 | reCAPTCHA v3 site key + secret key (reCAPTCHA Admin) | Done — v3 key pair created 2026-09-08 (Migrate-keys step below) | ✅ | **§1 (one step left)** |
| 3 | Firebase App Check app registration | Done — Enterprise registration completed 2026-09-08 | ✅ | none |
| 4 | Site key in code (`js/firebase-config.js` `recaptchaSiteKey`) | Done — site key in code shipped by 09-03 | ✅ | none |
| 5 | Monitoring metrics (App Check → APIs tab) | Not accruing yet — needs §1's Migrate-keys step + the 09-03 deploy | ⬜ | accrues once 09-03 deploys |
| 6 | Enforcement (Firestore / Authentication) | OFF — monitoring mode (un-attested requests are accepted) | ✅ correct today | **do not flip until the §5 gate passes** |

**Weekly ritual starts from the code-ship date** (09-01, shipped 2026-09-07): until §1–§3 complete there is nothing meaningful to read — the ritual becomes live the moment §3 activation deploys.

---

## §1 · reCAPTCHA Admin — key pair (done 2026-09-08) + the remaining Migrate-keys step

**Record (completed):**

1. Opened **google.com/recaptcha/admin** with the Google account that owns the Firebase project.
2. Type: **reCAPTCHA v3** — free, no Cloud Billing, invisible (score 0.0–1.0, no checkbox, no challenge).
3. Label: `GeoHist contact form (App Check)`.
4. **Domain list: `geohisttrivia.com` ONLY** (still true). The www host 301s to apex before any page loads, so the apex entry covers it (Phase 8 §3a rationale). Nothing else belongs in this list — and especially never `localhost` (§7 explains why).
5. Submitted. The key pair exists: the **SITE key** is public-by-design (the value 09-03 pasted into `recaptchaSiteKey`; re-readable anytime from the key's settings page) and the **SECRET key** is a console-only credential, consumed exactly once by §2 and never pasted into the repo, chat logs, or this file.

**Remaining owner step — Migrate keys (required for token verification to succeed):**

1. The key was created as classic v3, so the reCAPTCHA admin shows a **Migrate keys** banner (classic reCAPTCHA is obsolete for new App Check registrations; the Firebase registration in §2 is a reCAPTCHA **Enterprise** registration).
2. Run the migration from the key's settings: the classic v3 key becomes GCP/Enterprise-managed, which is what makes the Firebase Enterprise registration's token verification succeed.
3. The **site key value is unchanged** by the migration — `js/firebase-config.js` needs no further edit.
4. 🔍 Soft check: after migrating, the key's settings page no longer shows the Migrate-keys banner.

---

## §2 · Firebase console — register the app with App Check (done 2026-09-08)

**Record (completed):**

1. Firebase console → your project → **Security → App Check**.
2. **Apps tab** → web app (its config is the same Firebase project `js/firebase-config.js` points at) → **Register**.
3. Provider: the console's current flow registers the app with the **reCAPTCHA Enterprise** provider (the classic reCAPTCHA option is obsolete for new registrations); the **SECRET key** from §1 was consumed here — the only place it is ever used.
4. App-risk threshold: **0.5 default** (under enforcement, scores strictly below 0.5 are rejected; monitoring mode ignores the threshold entirely).
5. Confirmed: the app shows as registered with the reCAPTCHA Enterprise provider; the **APIs tab** lists **Firestore** and **Authentication** request metrics once the 09-03 activation deploy is live and requests flow.

---

## §3 · Activation — site key pasted (done 2026-09-08 by plan 09-03)

**Record (completed):** the **SITE key** (public-by-design) was pasted into `recaptchaSiteKey` in `js/firebase-config.js` by plan 09-03 (2026-09-08) — the one-line code step is done; the value is unchanged by the §1 Migrate-keys migration. The agent deploys (push → CI validate → Pages deploy).

**What happens with the next real submission** (one-real-submission expectation, unchanged):

1. Send **one real submission** through the form at `https://geohisttrivia.com/geohist/contact.html`.
2. Expect **zero visible change** (monitoring mode): success toast, message lands in the Firestore `messages` collection. If instead you see the "We couldn't verify this message…" status or the generic error — stop and tell the agent; that is the failure path, not the expected post-activation behavior.
3. After that submit, **Security → App Check → APIs tab** begins accruing request metrics for Firestore + Authentication. **§4 starts now.**

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
