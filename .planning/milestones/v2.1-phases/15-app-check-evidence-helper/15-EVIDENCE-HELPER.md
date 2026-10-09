# Phase 15 Owner Runbook — App Check Evidence Helper & Weekly Triage Guide

**Audience:** Santiago (owner). Every step below is a Firebase console or Google Analytics console action — doc-only, zero code changes, zero CLI commands.

**Public-artifact notice:** this repository deploys the entire directory tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` document — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.**

**Status legend:** ✅ verified / active · ⬜ pending owner action · 🔍 soft check (monitoring indicator)

---

## §1 · The 30-Submission Evidence Floor (EVID-01)

Before flipping App Check enforcement on Cloud Firestore or Firebase Authentication (FIRE-10), the evidence gate defined in `09-RUNBOOK.md` §5 requires accumulating **≥ 30 successful submissions** under monitoring mode.

### 1.1 Exact Console Navigation
To inspect and count successful submissions:

1. Open the [Firebase Console](https://console.firebase.google.com/) with the account owning the project.
2. In the left navigation menu, navigate to **Build → Firestore Database**.
3. Select the **Data** tab.
4. In the collection list (first column), click on the **`messages`** collection.
5. In the document list (second column), documents representing contact form submissions are listed by auto-generated document ID.

### 1.2 Document Counting Procedure
Each contact form submission creates a document containing:
- `email`: sender's email address
- `topic`: one of `general`, `bug`, `feedback`, `deletion`
- `message`: user's text message
- `createdAt`: server timestamp
- `name` (optional): sender's name

**Procedure:**
1. In the document list header, sort by `createdAt` descending.
2. Count documents whose `createdAt` timestamp is **on or after 2026-09-08** (the Phase 09 activation deploy date when the App Check site key went live in production).
3. If the total number of documents in `messages` is small, you can visually count the rows displayed in the document column.

### 1.3 Why the Floor Counts Messages, NEVER App Check Request Rows
In Firebase Console → **Security → App Check → APIs tab**, metrics display **request counts** (or percentages) for Cloud Firestore and Firebase Authentication.

**DO NOT use request counts from the APIs tab to measure the 30 floor.**

Request counts substantially inflate the true user count:
1. **Multi-request architecture**: A single form submission performs two distinct API calls:
   - Anonymous Authentication sign-in (`signInAnonymously`) → 1 Auth API request.
   - Firestore message write (`addDoc`) → 1 Firestore API request.
   - Therefore, 1 human submission generates at minimum 2 request rows.
2. **Session & Token retries**: Client session renewals, transient network re-tries, or page reloads generate request rows without submitting a message.
3. **Automated endpoint scraping**: The Firebase web config in `js/firebase-config.js` is public by design. Internet bots attempting unauthorized reads or hits against the endpoints generate request rows (blocked by Firestore security rules) without creating documents.

**Authoritative Rule:** Only documents committed to the Firestore `messages` collection prove that a real human visitor submitted valid data that passed validation and Firestore security rules.

### 1.4 Strict Floor Boundary Rules
- **Count < 30 submissions**: **DO NOT FLIP ENFORCEMENT.** Even if the console shows 100% "Verified", a sample smaller than 30 lacks coverage across diverse browsers, operating systems, mobile networks, and privacy configurations.
- **Count ≥ 30 submissions**: **Enforcement consideration unlocked.** Proceed to evaluate the Verified rate and Unknown origin breakdown in §2 and §3.

---

## §2 · App Check Category-Split Reading Guide (EVID-02)

In Firebase Console → **Security → App Check → APIs tab**, inspect the metric cards for **Cloud Firestore** and **Firebase Authentication**.

### 2.1 Category Semantics

| Category | Console Meaning | Expected on this Form | Triage & Operational Meaning |
|---|---|---|---|
| **Verified** | Request carried a valid App Check token verified by reCAPTCHA Enterprise | > 85% – 95% | **Primary health signal.** Represents legitimate visitors successfully attested. Must dominate before enforcement. |
| **Outdated client** | Request came from an older app client without App Check | ≈ 0% | GitHub Pages deploys atomically; version skew does not exist. Any spike indicates stale browser caches or unexpected external clients. |
| **Unknown origin** | Request lacked an App Check token or was not shaped as an SDK request | 5% – 15% | **The critical row to watch.** Represents two distinct classes: (1) legitimate visitors with ad-blockers / DNS sinks (see §3.2), and (2) bots hitting Firestore REST directly. |
| **Invalid** | Request carried an App Check token that failed verification | ≈ 0% | Tokens with invalid signatures, expired timestamps, or project mismatches. Should remain at or near zero. |
| **Reused token** | Request replayed a token past its valid reuse window | ≈ 0% | Token replay attempts. Regular web users will not produce reused tokens. |

---

## §3 · Critical Operational Caveats (EVID-02)

### 3.1 The 24-Hour Reporting Lag
- **App Check Metrics**: Console metrics in the APIs tab aggregate asynchronously and often lag live traffic by 8 to 24 hours.
- **Analytics Events**: Custom events (`appcheck_token_failure`) in Google Analytics / Firebase Analytics can take 24 to 48 hours to appear in standard event reports.
- **Operational Rule**: Never make triage or enforcement decisions immediately following a test submission or based on intraday readings. Weekly scheduled reviews provide accurate, smoothed trends.

### 3.2 Pi-hole / Ad-blocker Caveat (`appCheck/probe-failed`)
The contact form submit pipeline in `js/contact.js` features a probe-gated reachability check:
1. **The Probe**: Before initializing App Check, a ~3s probe tests reachability of `https://www.google.com/recaptcha/enterprise.js`.
2. **Ad-Blockers**: Privacy tools (uBlock Origin, Brave Shields, Pi-hole, AdGuard DNS) block Google reCAPTCHA domains by default.
3. **The Skip Path**: If the probe is blocked or times out, `contact.js` skips App Check initialization completely. This prevents the Firebase Auth SDK from deadlocking on an unbounded internal token await.
4. **Un-attested Delivery**: The contact message is successfully written to Firestore un-attested. After delivery, a synthetic error code `appCheck/probe-failed` is recorded, and the custom event `persano:appcheck` is dispatched.
5. **Console Impact**:
   - The message lands in Firestore `messages` normally.
   - In App Check APIs tab, this request appears under **Unknown origin** (un-attested).
   - In Analytics, an `appcheck_token_failure` event is logged with `{ code: 'appCheck/probe-failed' }` (if the visitor accepted analytics cookies).

> [!WARNING]
> A baseline "Unknown origin" rate of 5–15% accompanied by `appCheck/probe-failed` events represents **real, privacy-conscious human visitors**. Enforcing App Check will reject these users. Do not enforce unless you are willing to require these visitors to use the fallback mailto link or until failure volumes are thoroughly understood.

### 3.3 Analytics Failure Trend Reading (`appcheck_token_failure`)
To inspect client-side failure signals:
1. Navigate to Firebase Console → **Analytics → Events**.
2. Click on the **`appcheck_token_failure`** event row.
3. Inspect the breakdown of the **`code`** parameter:
   - `appCheck/probe-failed`: Reachability probe failed (ad-blocker or network sink). The message was delivered un-attested.
   - `appCheck/token-timeout`: Reachability probe passed, but the 10-second `raceToken` window expired before reCAPTCHA returned a token. Indicates high network latency.
   - `appCheck/recaptcha-error`: reCAPTCHA Enterprise runtime rejected the request or encountered an error.

---

## §4 · Weekly Monitoring Ritual & Ledger (EVID-02)

Conduct this 5-minute review once a week.

### 4.1 Weekly Checklist
1. **Firestore Data**: Check `messages` collection. Count total submissions since 2026-09-08.
2. **App Check APIs**: Note **Verified %** and **Unknown origin %** for both Firestore and Authentication.
3. **Analytics Events**: Check `appcheck_token_failure` event count and `code` distribution.
4. **Log Reading**: Record the metrics in the ledger below.
5. **Gate Evaluation**:
   - Are total submissions < 30? → **Continue monitoring.**
   - Are total submissions ≥ 30 AND Verified rate ≥ 90-95%? → **Eligible for FIRE-10 enforcement review** per `09-RUNBOOK.md` §6.

### 4.2 Weekly Monitoring Ledger Template

Copy and append a new row to this table each week:

| Date | Firestore Submissions (≥ 2026-09-08) | Firestore Verified % | Auth Verified % | Unknown Origin % | `appcheck_token_failure` Count & Codes | Gate Verdict |
|---|---|---|---|---|---|---|
| *YYYY-MM-DD* | *e.g. 5* | *e.g. 100%* | *e.g. 100%* | *0%* | *0* | Continue monitoring (< 30) |
| *YYYY-MM-DD* | *e.g. 12* | *e.g. 91%* | *e.g. 92%* | *8%* | *1 (appCheck/probe-failed)* | Continue monitoring (< 30) |
| *YYYY-MM-DD* | *e.g. 32* | *e.g. 94%* | *e.g. 95%* | *5%* | *2 (appCheck/probe-failed)* | Ready for FIRE-10 Review |

---

*Phase 15 · App Check Evidence Helper · Authored 2026-10-09 per requirements EVID-01 and EVID-02*
