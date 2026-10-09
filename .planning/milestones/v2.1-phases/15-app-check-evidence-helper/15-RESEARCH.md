# Phase 15: App Check Evidence Helper — Research

**Researched:** 2026-10-09
**Domain:** Firebase App Check & Firestore monitoring operations, evidence-floor accounting, and console triage runbook (doc-only; zero runtime code changes; zero secrets)
**Confidence:** HIGH (codebase verified against `contact.js`, `consent.js`, `firestore.rules`, and `09-RUNBOOK.md` this session)

---

## Executive Summary

Phase 15 is the final phase of milestone **v2.1 Play Launch + Home Migration**. Its purpose is to deliver a dedicated, console-UI-only operational helper (`15-EVIDENCE-HELPER.md`) that guides the owner (Santiago) in tracking App Check metrics toward the locked 30-submission floor before considering enforcement (FIRE-10).

Requirements:
- **EVID-01**: Console-UI-only guide for counting successful submissions toward the 30-floor (unit = successful submissions in Firestore `messages`, never console request rows).
- **EVID-02**: Weekly ritual template + category-split reading guide (24h lag, Pi-hole/adblocker reachability caveat, token-failure trend reading).

Zero code changes, zero dependencies, and zero credentials/secrets are involved.

---

## Key Findings

### Q1 — Accounting Mechanics: Firestore Documents vs. App Check Request Rows (EVID-01)

#### 1. Why Console Request Rows Mislead
In Firebase Console → **Security → App Check → APIs tab**, metrics are presented as **request counts** (or percentages) for each registered product (**Cloud Firestore** and **Firebase Authentication**).
A naive inspection would count these request rows as user submissions. However, request rows substantially overestimate actual human submissions:
1. **Multi-request pipeline per submit**: A single contact form submission performs:
   - Submit-time anonymous authentication: `signInAnonymously(auth)` (Auth API request).
   - Firestore document write: `addDoc(collection(db, 'messages'), payload)` (Firestore API request).
   - Thus, 1 submission = minimum 2 API requests.
2. **Session and token traffic**: Token exchanges, token refresh attempts (if any), or client session retries generate request rows without representing a new message.
3. **Bot probes / Scraping**: The Firebase web config in `js/firebase-config.js` is public by design. Automated scrapers attempting unauthorized reads or hits against the endpoints generate request rows that are rejected or recorded in the console, but never create documents in `messages`.

#### 2. The Authoritative Floor Unit
The only authoritative unit for the 30-submission floor is a **successfully committed document in the `messages` Firestore collection**:
- **Location**: Firebase Console → **Build → Firestore Database → Data tab → `messages` collection**.
- **Schema**: Validated by `firebase/firestore.rules`:
  - `email` (string, 1-254 chars)
  - `topic` (`general`, `bug`, `feedback`, `deletion`)
  - `message` (string, 1-5000 chars)
  - `createdAt` (`serverTimestamp()`)
  - Optional `name` (string, 1-100 chars)
- **Baseline Date**: 2026-09-08 (Phase 09 plan 09-03 activation deploy date). Only messages created on or after activation count toward the 30 floor.
- **Counting Procedure**:
  - In Firestore Database Data viewer, select `messages`.
  - Sort or inspect by `createdAt` descending.
  - Count documents with `createdAt >= 2026-09-08`.

#### 3. Strict Boundary Criteria (Both Directions)
- **Count < 30**: **DO NOT ENFORCE**. Even if the App Check APIs tab shows "100% Verified", a sample size below 30 lacks statistical and environmental diversity across real-world devices, networks, and operating systems.
- **Count >= 30**: **Enforcement consideration unlocked**. The owner may review whether the Verified rate meets the "Ready to enforce" threshold.

---

### Q2 — Category-Split Semantics & Operational Triage (EVID-02)

In Firebase Console → **Security → App Check → APIs tab**, request breakdown categories have specific meanings in the context of `persano.github.io` / `geohisttrivia.com`:

| Category | Console Meaning | Expected on this form | Triage Action |
|----------|-----------------|----------------------|---------------|
| **Verified** | Request carried a valid App Check token verified by reCAPTCHA Enterprise | Dominant category (>85-95%) | Healthy indicator. High ratio needed before enforcement. |
| **Outdated client** | Request came from an older client version without App Check | ~0% | Static GitHub Pages sites deploy atomically; version skew does not exist. Any significant count suggests legacy cached assets or custom API calls. |
| **Unknown origin** | Request lacked an App Check token or was not shaped as expected | Low baseline (5-15%) | **The primary signal to watch.** Represents two distinct sources: (a) legitimate ad-blocked visitors (see Pi-hole caveat), and (b) direct automated abuse / bots calling Firestore REST directly. |
| **Invalid** | Request had a token, but token verification failed (bad signature, expired, wrong project) | ~0% | If rising, check reCAPTCHA Enterprise project binding or domain configuration. |
| **Reused token** | Token replayed past its valid lifetime | ~0% | Replay attempts; normal web users do not generate reused tokens. |

---

### Q3 — Environmental Realities & Hidden Caveats (EVID-02)

#### 1. The 24-Hour Reporting Lag
- **App Check Metrics**: Data in the App Check APIs tab is aggregated asynchronously. There is typically an 8 to 24-hour processing lag before full metrics reflect recent activity.
- **GA4 Custom Events**: Custom events (`appcheck_token_failure`) in **Analytics → Events** take 24–48 hours to appear in standard reporting tables.
- **Operational Rule**: Never make enforcement or triage decisions based on intra-day fluctuations or immediately after a test submission. Weekly evaluation provides the necessary smoothing.

#### 2. The Pi-hole / Ad-blocker Caveat (`appCheck/probe-failed`)
- **Mechanism in `contact.js`**:
  - Prior to initializing App Check, a ~3s reachability probe (`fetch('https://www.google.com/recaptcha/enterprise.js?render=explicit', { mode: 'no-cors' })`) runs.
  - Visitors using ad-blockers (uBlock Origin, Brave Shields, Pi-hole, AdGuard DNS) block Google reCAPTCHA scripts.
  - When the probe fails, App Check initialization is **skipped entirely**.
  - Skipping init prevents the Firebase Auth SDK from hanging on an unbounded internal token await.
  - The submit proceeds **un-attested**; the message is successfully written to Firestore; a synthetic error `appCheck/probe-failed` is thrown post-delivery; and the event `persano:appcheck` is dispatched.
- **Console Impact**:
  - In Firestore, the message lands normally.
  - In App Check APIs tab, this un-attested submission is categorized under **Unknown origin** (or unverified).
  - In Firebase Analytics, if consent was granted, an `appcheck_token_failure` event with param `code: "appCheck/probe-failed"` is logged.
- **Crucial Warning**: An "Unknown origin" rate of ~5–10% that correlates with `appCheck/probe-failed` events represents **real, privacy-conscious human visitors**. Flipping enforcement prematurely will reject these legitimate users.

#### 3. Interpreting `appcheck_token_failure` Event Codes
Under Firebase Console → **Analytics → Events → `appcheck_token_failure`**:
- `appCheck/probe-failed`: Reachability probe failed (ad-blocker/DNS sink). Message delivered un-attested. Normal background rate expected.
- `appCheck/token-timeout`: Reachability probe passed, but the 10-second `raceToken` window expired before reCAPTCHA yielded a token. Indicates high network latency or sluggish client devices.
- `appCheck/recaptcha-error`: reCAPTCHA Enterprise runtime threw an error. Indicates client configuration issue or domain validation failure.

---

### Q4 — Weekly Ritual Workflow (EVID-02)

A structured 5-minute weekly checklist:
1. **Step 1: Check Floor Count**:
   - Navigate to Firestore Data viewer → `messages`.
   - Count messages since 2026-09-08.
   - Record count.
2. **Step 2: Check App Check Metrics**:
   - Navigate to Security → App Check → APIs tab.
   - Note Verified %, Unknown origin % for Cloud Firestore and Authentication.
3. **Step 3: Check Client Failure Trends**:
   - Navigate to Analytics → Events → `appcheck_token_failure`.
   - Note event count and breakdown of `code`.
4. **Step 4: Record Entry in Ledger**:
   - Record in weekly table template.
5. **Step 5: Evaluate Gate**:
   - Is Count >= 30?
   - Is Verified % >= 90-95%?
   - Are Unknown origin requests explained by `probe-failed` or benign ad-blocking?
   - If YES to all → FIRE-10 enforcement may be scheduled. Otherwise → continue monitoring.

---

## Architectural Guardrails & Invariants

1. **Console-UI only**: No commands, scripts, or runtime edits.
2. **Zero secrets**: No secret keys, debug tokens, or private credentials documented or pasted.
3. **Legacy domain gate**: Do not reference the legacy `*.github.io` literal anywhere. Use approved phrasing ("legacy `*.github.io` Pages host").
4. **Unit integrity**: Floor unit is always **successful form submissions** (`messages` docs), never request rows.
5. **Historical supersession**: Retain existing `09-RUNBOOK.md` text verbatim, appending dated cross-reference notes pointing to Phase 15.

---

## Recommendation for Plan & Implementation

- **15-01-PLAN.md**:
  - Task 1: Author `15-EVIDENCE-HELPER.md` covering EVID-01 (Firestore counting mechanics) and EVID-02 (Weekly ritual, category-split guide, 24h lag, Pi-hole caveat, failure codes).
  - Task 2: Append dated supersession/cross-reference notes in `09-RUNBOOK.md` §4 and §5 linking to `15-EVIDENCE-HELPER.md`.
  - Task 3: Author `15-UAT.md` and `15-RECORDS.md` for verification and evidence tracking.
