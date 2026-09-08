---
phase: 09-app-check-monitor-first
verified: 2026-09-08T00:00:00Z
status: human_needed
score: 10/12 must-haves verified
behavior_unverified: 2
overrides_applied: 0
re_verification:
  previous_status: none
  gaps_closed: []
  gaps_remaining: []
  regressions: []
behavior_unverified_items:
  - truth: "Submitting the contact form succeeds exactly as before while App Check runs in monitoring mode — success status, form reset, message lands in Firestore; zero user-visible change (SC1)"
    test: "Submit the live form at https://geohisttrivia.com/geohist/contact.html (shipped dormant state; repeat after runbook §3 activation)"
    expected: "Success status shows, form resets, message lands in Firestore messages collection — visually identical to pre-Phase-9 behavior"
    why_human: "Runtime browser + live Firebase chain (lazy CDN import → auth → addDoc); no test framework exists in this static site; code path is present and wired but the happy-path transition is not exercised by any automated test"
  - truth: "A token-fetch failure shows the contact.status.appcheck keyed status with email fallback — never a dead form, no auto-retry — and dispatches persano:appcheck which consent.js routes to appcheck_token_failure (SC2/SC3)"
    test: "Runbook §7 debug-token flow: local submit with attestation failing (localhost, no debug token safelisted) → observe status node, resend manually, check GA4 DebugView for appcheck_token_failure with consent granted, then with consent denied"
    expected: "Appcheck status (email fallback text) replaces 'sending'; no retry loop; form usable again; event fires only when analytics consent granted — silent no-op on deny"
    why_human: "Requires real reCAPTCHA/getToken rejection at runtime; static analysis proves the catch mapping, dispatch, listener, and consent gate are wired, but the failure transition itself is not exercised by any automated test"
gaps: []
deferred:
  - truth: "Enforcement flip execution (FIRE-10) — owner console step after monitoring window"
    addressed_in: "Future requirement (post-monitoring), not a later phase of this milestone"
    evidence: "REQUIREMENTS.md Future Requirements: 'FIRE-10: App Check enforcement flip execution (owner console, post-monitoring)'; 09-02-PLAN prohibition: 'The agent never executes the enforcement flip — the runbook documents it as an owner console step (FIRE-10 stays post-monitoring)'; verified no enforcement API call exists in any js file"
---

# Phase 9: App Check, Monitor-First — Verification Report

**Phase Goal:** The contact form gains bot protection that is invisible to real users, with enforcement deferred until submission-count evidence says it is safe
**Verified:** 2026-09-08
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Submissions succeed with zero user-visible change in monitoring mode (SC1) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Submit chain present + wired (contact.js:124–181); shipped state is dormant (`recaptchaSiteKey: ''` → `attested = Promise.resolve()`, contact.js:156–158) so the happy path is the pre-existing legacy chain; runtime transition needs live browser+Firebase — see Human Verification #1 |
| 2 | App Check initializes lazily as 4th pinned 12.18.0 module, after default app, before auth/firestore; zero attestation bytes in served HTML | ✓ VERIFIED | contact.js:115 4th import in `Promise.all` under `CDN_BASE = 'https://www.gstatic.com/firebasejs/12.18.0/'` (line 38); init order app (132–134) → appCheck (148–153) → getToken (155) → auth (160–163) → addDoc (174–177); `grep google.com/recaptcha` across index.html, 404.html, geohist/*.html = 0 matches |
| 3 | Token-fetch failure shows contact.status.appcheck + email fallback, never dead form, no auto-retry | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Wiring complete: case-tolerant `/^app-?check\//i \|\| permission-denied` mapping (contact.js:214–219) → `showStatus('appcheck')`; node exists at contact.html:71 with email fallback text; no retry loop in catch path; actual rejection transition unexercised — see Human Verification #2 |
| 4 | persano:appcheck event → consent.js → logEventSafe('appcheck_token_failure', {code}), consent-gated, silent no-op on deny | ✓ VERIFIED | Dispatch contact.js:217–219 (detail.code sliced 40); listener consent.js:140–142; logEventSafe consent.js:116–123 returns early unless `isGranted()`; zero App Check imports in consent.js; both endpoints name-matched; contact.html loads both scripts (lines 22–23) |
| 5 | Resubmit reuses cached instance — no second initializeAppCheck possible | ✓ VERIFIED | Module-level `appCheckInstance` guard (contact.js:55, 149–154): set once, never cleared anywhere in file; second call structurally impossible |
| 6 | Double/parallel submit impossible in flight; button re-enables in .finally | ✓ VERIFIED | contact.js:198 `submitButton.disabled = true` before send; 232–234 `.finally` re-enables; unchanged from pre-phase code (verified via full file read) |
| 7 | 19 dictionaries + markup carry contact.status.appcheck at exact 171-key parity; ja/zh omit raw email | ✓ VERIFIED | `node scripts/i18n-keycheck.mjs` → PASS (all 19 at 171-key parity, exit 0); key present in all 19 JSON files (counted 19/19); ja/zh values contain no '@' (parsed JSON, checked directly) |
| 8 | 09-RUNBOOK.md documents full owner console chain (register §1–§2, activate §3, ritual §4, evidence gate §5, flip+rollback §6) with geohisttrivia.com-only allowlist | ✓ VERIFIED | Read all 154 lines: §0 state table, §1 v3 key pair w/ "Domain list: add `geohisttrivia.com` ONLY" (§1 step 4), §2 secret-key registration, §3 activation via recaptchaSiteKey paste, provider decision D-01 recorded (§1 step 2: "Enterprise rejected") |
| 9 | Flip gated on evidence, never calendar: ready-to-enforce signal + ≥30 successful submissions, unit pinned, both boundary directions | ✓ VERIFIED | §5: BOTH conditions required (lines 88–91); "Below 30 → keep monitoring" + "At/above 30 → §6 available" (lines 93–96); unit pinned to successful form submissions, not request rows (line 98); "Never calendar: no date or elapsed-time trigger" (line 100) |
| 10 | Per-product flip (Firestore AND Authentication) + rollback toggle-off + ≤15-min propagation + replay-protection refutation | ✓ VERIFIED | §6: Enforce separately per product (lines 110–115); rollback = same toggle off, ≤15 min (line 117); "replay-protection option does NOT exist for Firestore … only for Firebase AI Logic" (line 119) |
| 11 | Weekly ritual reads Verified/Outdated/Unknown/Invalid split + submission count + appcheck_token_failure named | ✓ VERIFIED | §4 steps 1–3 + semantics table (lines 74–82); §8 documents appcheck_token_failure wiring, GA4 read path, and `code` param |
| 12 | privacy.html section 3 gains reCAPTCHA v3/App Check (website only) li with consent-interplay sentence; Last updated bumped | ✓ VERIFIED | privacy.html:52 exact li ("anti-abuse mechanism, not measurement — runs regardless of your analytics cookie choice, and only when you submit the form"); line 34 "Last updated: September 7, 2026" |

**Score:** 10/12 truths verified (2 present, behavior-unverified)

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Enforcement flip execution (FIRE-10) | Future requirement (post-monitoring), by design | REQUIREMENTS.md:49 Future Requirements; runbook §6 "Who: the owner only"; 0 enforcement API calls in js/ (grep "enforce" → only a code comment) |

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `js/contact.js` | 4th lazy import, cache-once guard, getToken gate, catch mapping, event dispatch | ✓ VERIFIED | All present; `node --check` passes; header comment documents four-module pin + monitoring mode |
| `js/firebase-config.js` | `recaptchaSiteKey: ''` + public-by-design comment | ✓ VERIFIED | Line 31 empty string; lines 15–20 comment (dormant until activation, secret never in repo) |
| `js/consent.js` | persano:appcheck listener via logEventSafe, no App Check imports | ✓ VERIFIED | Lines 139–142; grep confirms no initializeAppCheck / firebase-app-check import |
| `geohist/contact.html` | hidden data-status=appcheck node, data-i18n=contact.status.appcheck | ✓ VERIFIED | Line 71, Pattern 5 shape (form-status class → statusEls walk at init, contact.js:246–249), email fallback text, `hidden` attribute |
| `js/i18n/*.json` (19 files) | contact.status.appcheck in every dictionary, atomic | ✓ VERIFIED | keycheck PASS; 19/19 files contain the key |
| `.planning/.../09-RUNBOOK.md` | §0–§8 owner console chain, no secrets | ✓ VERIFIED | All sections present; AIza-shaped literal scan = 0 matches; public-artifact notice at top |
| `geohist/privacy.html` | one new li + consent interplay + date bump | ✓ VERIFIED | Line 52; all four required strings present; date bumped |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| contact.js getToken rejection | catch mapping → showStatus('appcheck') → contact.html node | attested.then/catch chain + `/^app-?check\//i` test | ✓ WIRED | contact.js:155–158, 205–221 → node at contact.html:71; node class form-status makes it reachable by the statusEls walk |
| contact.js dispatch persano:appcheck | consent.js listener → logEventSafe | CustomEvent name match | ✓ WIRED | contact.js:217 ↔ consent.js:140; detail.code both sides; event name + param name exact |
| contact.html data-status=appcheck | statusEls map in init() | `.form-status[data-status]` querySelectorAll | ✓ WIRED | Node has class form-status + data-status attr; showStatus toggles hidden attr |
| firebase-config.js recaptchaSiteKey | ReCaptchaV3Provider construction | config field read | ✓ WIRED | contact.js:148–151 reads `config.recaptchaSiteKey`, empty = dormant else-branch |
| runbook §3 activation | js/firebase-config.js field | documented paste target | ✓ WIRED | §3 shows exact shipped field + paste instruction; names match code |
| runbook §4/§5 | Firebase console APIs tab + messages count | evidence surface | ✓ WIRED | §4 step 2 names messages collection + createdAt sort; §5 references §4 count as floor unit |
| runbook §8 | appcheck_token_failure event | metric reference | ✓ WIRED | §8 describes shipped wiring verbatim (matches contact.js/consent.js code) |
| privacy li | consent.js load-gating model | "regardless of analytics choice" claim | ✓ WIRED | Claim matches architecture: logEventSafe gates on isGranted; App Check code path never reads banner storage (contact.js:24–29 comment + no consent-key access in file) |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| contact.js appcheck status | err.code | runtime getToken/addDoc rejection | Yes (runtime) | ✓ FLOWING (statically traced; runtime unexercised — truth #3) |
| consent.js event param | detail.code | CustomEvent from contact.js | Yes | ✓ FLOWING |
| appcheck_token_failure param | code | String(detail.code).slice(0,40) | Yes | ✓ FLOWING |

No hardcoded/static fallbacks found in the phase's data paths. The only literal in the chain is the `'unknown'` default when err.code is absent — correct defensive fallback, not a stub.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| i18n 171-key parity incl. key #171 | `node scripts/i18n-keycheck.mjs` | "i18n-keycheck: OK" (19 PASS lines) | ✓ PASS |
| HTML validity after node + privacy edits | `npm run validate:html` | exit 0, no output | ✓ PASS |
| Old-domain gate | `npm run validate:domain` | "check-no-old-domain: OK" | ✓ PASS |
| JS syntax (3 files) | `node --check js/contact.js \|\| consent.js \|\| firebase-config.js` | "syntax OK" ×3 | ✓ PASS |
| i18n detect redirect logic | `node scripts/i18n-detect.test.mjs` | 0 failed / 0 skipped, 11.9ms | ✓ PASS |
| Zero reCAPTCHA bytes in served HTML | Select-String google.com/recaptcha on index.html, 404.html, geohist/*.html | 0 matches | ✓ PASS |
| No debug flag committed | Select-String FIREBASE_APPCHECK_DEBUG_TOKEN js/*.js | 0 matches | ✓ PASS |
| No raw email in ja/zh values | parsed JSON, `.Contains('@')` | False ×2 | ✓ PASS |
| Rules untouched | `git diff HEAD~6..HEAD --name-only \| Select-String firestore.rules` | empty; last rules commit is cff7d08 (phase 4) | ✓ PASS |
| Both plans committed | `git log --oneline --grep="09-0"` | 8 phase-9 commits (09-01: ed9c605, ce54952, 73fd4c2, 4dfb666; 09-02: afd855d, da374dd, 656650b, 915c5a5) | ✓ PASS |

### Probe Execution

No `scripts/*/tests/probe-*.sh` probes declared for this phase. Phase-relevant runnable gates (keycheck, validate:html, validate:domain, node --check, i18n-detect test) executed above in Behavioral Spot-Checks — all run by this verifier in its own process.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| FIRE-07 | 09-01 | App Check monitoring mode, 4th lazy module, init before auth/firestore, zero reCAPTCHA bytes, zero user-visible change, provider decision recorded | ✓ SATISFIED | Truths #1–#2; D-01 recorded (CONTEXT.md + RUNBOOK §1 step 2); runtime acceptance → Human Verification #1 |
| FIRE-08 | 09-01 | Token-failure UX — dedicated status node with email fallback + Analytics event | ✓ SATISFIED | Truths #3–#4, #7; runtime firing → Human Verification #2 |
| FIRE-09 | 09-02 | Enforcement flip documented as owner console step, evidence-gated (never calendar), per-product, reversible, ritual defined | ✓ SATISFIED | Truths #8–#11 |
| CMPL-05 | 09-02 | Privacy policy mentions reCAPTCHA/App Check with consent-interplay nuance | ✓ SATISFIED | Truth #12 |

**Orphaned requirements:** none — REQUIREMENTS.md maps exactly FIRE-07/08/09/CMPL-05 to Phase 9, and the plans claim exactly those four. FIRE-10 stays in Future Requirements (deferred by design, see Deferred Items).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| 09-RUNBOOK.md | 7 | "TODO (yours)" in status legend | ℹ️ Info | Intentional owner-action legend label (⬜ TODO = owner console steps), not unfinished work |
| js/contact.js | 227–229 | console.error on submit failure | ℹ️ Info | Deliberate debuggability log per header comment ("logs the FirebaseError code … users see the keyed status only") — not a log-only implementation |

No TBD/FIXME/XXX/HACK/PLACEHOLDER markers in any phase-modified file. No enforcement logic, no auto-retry, no debug tokens, no secrets anywhere in the served tree.

### Prohibitions Verified (all enforced-tier, all passed)

| Prohibition | Check | Result |
| ----------- | ----- | ------ |
| No attestation-script URL in served HTML | grep google.com/recaptcha | 0 matches ✓ |
| No debug-provider flag / debug token in js/ | grep FIREBASE_APPCHECK_DEBUG_TOKEN | 0 matches ✓ |
| firestore.rules byte-identical | git diff + git log -- file | untouched since phase 4 ✓ |
| No App Check code in consent.js / page-load path | grep imports + init in consent.js | listener only ✓ |
| No auto-retry of token fetch | catch-path inspection | no retry loop ✓ |
| No client-side enforcement logic | grep enforce/Enforce in js/ | comment word only, no API call ✓ |
| No secrets in 09-RUNBOOK.md | AIza-shaped + 30+-char literal scan | 0 secret matches ✓ |
| Never add localhost to allowlist | §7 explicit double warning | present ✓ |
| No Firestore replay-protection option documented | §6 refutation paragraph | present ✓ |
| No calendar trigger | §5 "Never calendar" + §5 criteria-only gate | present ✓ |
| Agent never executes flip | runbook §6 owner-only + 0 repo enforcement calls | present ✓ |
| ja/zh no raw email | parsed JSON '@' check | False ×2 ✓ |

### Human Verification Required

### 1. Dormant happy path — zero user-visible change (SC1)

**Test:** Submit the live form at `https://geohisttrivia.com/geohist/contact.html` with valid data (shipped dormant state: `recaptchaSiteKey: ''`). Repeat after runbook §1–§3 activation per §3 step 3.
**Expected:** Success status shows, form resets, message lands in Firestore `messages` collection; appearance identical to pre-Phase-9 form. After activation: same zero-change behavior (that is the §3 step-3 acceptance).
**Why human:** Live browser + real Firebase runtime (lazy CDN import, anonymous auth, addDoc). No automated test infrastructure exists for the static site; the code path is present and wired but the happy-path transition is unexercised.

### 2. Token-failure path — appcheck status + consent-gated event (SC2/SC3)

**Test:** Runbook §7 debug-token flow on localhost without safelisting a debug token: submit with analytics consent granted → observe status; submit with consent denied → check GA4 DebugView (no event).
**Expected:** "We couldn't verify this message — please email santiagopostorivo@gmail.com." status replaces "sending"; form stays usable (resend manually, no auto-retry); `appcheck_token_failure` event with a `code` param fires in GA4 only when consent granted; message still lands in Firestore (monitoring mode, per §7 side effect).
**Why human:** Requires real reCAPTCHA/getToken rejection at runtime and GA4 event delivery; static analysis proved every wiring link but not the failure transition itself.

### 3. Visual check of new surfaces (UI hint: yes)

**Test:** View contact page (trigger the appcheck status via test 2) and privacy.html section 3 in a desktop + mobile browser.
**Expected:** Appcheck status node styled consistently with the other form-status variants; privacy li renders as part of the SDK-inventory list with correct typography.
**Why human:** Visual appearance is not programmatically verifiable.

### Gaps Summary

No gaps. All 5 roadmap Success Criteria verified at the code/artifact level: monitoring-mode integration is present and wired end-to-end (truth #2), token-failure UX exists (truth #3 wiring), the consent-gated event chain is complete (truth #4), the runbook documents the evidence-gated per-product flip with every locked constraint (truths #8–#11, prohibitions all passed), and the privacy disclosure landed (truth #12). FIRE-10 (flip execution) is correctly a future requirement, not a phase gap.

The phase ships in `human_needed` status solely because two truths assert runtime transitions (successful submission; token-failure UX) that this static site's zero-test-infrastructure cannot exercise automatically. The runbook itself (§3 step 3, §7) provides the exact owner-side procedure to discharge both items.

---

_Verified: 2026-09-08_
_Verifier: the agent (gsd-verifier)_
