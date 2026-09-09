---
phase: 09-app-check-monitor-first
verified: 2026-09-09T22:30:00Z
status: human_needed
score: 15/18 must-haves verified
behavior_unverified: 3
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 10/12
  gaps_closed:
    - "G-09-2 — closed: ReCaptchaEnterpriseProvider shipped (js/contact.js:205, count=1, classic=0), site key active (js/firebase-config.js:32), COVERAGE.md Enterprise row INTEGRATE with dated D-01 revision, 09-RUNBOOK.md §0–§3/§7 Enterprise reality + Migrate-keys step, privacy.html stale 'v3' label dropped; deployed (bridge 984927e) and behaviorally confirmed by owner UAT test 4 pass (2026-09-08, after the owner's registration site-key correction — G-09-4, no code change)"
    - "G-09-5 — agent-side fix closed: bounded ~10s TOKEN_TIMEOUT_MS race + record-and-swallow + post-delivery synthetic re-throw in js/contact.js; message now delivers un-attested on token failure (reject OR timeout); deployed (bridge 55dba3d), Actions 34408285918 green, prod smoke green; formal closure = owner UAT test 5 repeat (pending, 09-USER-SETUP.md checklist)"
    - "G-09-6 — agent-side fix closed: favicon.ico (59,370 B single-entry ICO, ICO byte gate + PNG magic verified) + icon/apple-touch-icon links in all 7 page heads; validate:html + validate:links green; prod /favicon.ico HTTP 200 (re-verified by this verifier); formal closure = owner tab-icon check (pending)"
  gaps_remaining: []
  regressions: []
gaps: []
deferred:
  - truth: "Enforcement flip execution (FIRE-10) — owner console step after the monitoring window"
    addressed_in: "Future requirement (post-monitoring), not a later phase of this milestone"
    evidence: "REQUIREMENTS.md:49 'FIRE-10: App Check enforcement flip execution (owner console, post-monitoring)'; 09-RUNBOOK.md §6 'the agent never flips enforcement'; grep 'enforce' across js/ → comment word only, no enforcement API call"
behavior_unverified_items:
  - truth: "Token-failure path is bounded: with reCAPTCHA scripts network-blocked, a submit leaves 'sending' within ~10 seconds — appcheck status shows, button re-enables (G-09-5 defect A fix)"
    test: "UAT test 5 repeat per 09-USER-SETUP.md: prod incognito, DevTools request blocking for BOTH *recaptcha* AND *google.com/reload*, submit with valid data"
    expected: "Appcheck status (email fallback text) appears within ~10s — never stuck on 'sending'; submit button re-enabled; form usable and NOT reset; manual resend only"
    why_human: "Requires the owner's browser DevTools request blocking on prod; this static site has no test infrastructure — the race/timeout transition is wired (raceToken, TOKEN_TIMEOUT_MS=10000) but not exercised by any automated test"
  - truth: "On token failure (reject OR timeout) the message STILL lands in Firestore un-attested while the appcheck status shows and the consent-gated appcheck_token_failure event dispatches (G-09-5 defect B fix)"
    test: "Same UAT test 5 repeat: check Firestore messages collection after the blocked submit; repeat with analytics consent denied → no event, message still lands; with consent granted → event in Firebase console → Analytics (GA4 lag up to 24 h)"
    expected: "Message present in messages collection in BOTH consent states (monitoring-mode un-attested delivery); appcheck_token_failure event with a code param only when consent granted"
    why_human: "Requires the owner's Firestore console read + GA4 event check (owner's pihole blocks analytics); the record-and-swallow → addDoc → post-delivery re-throw chain is wired but the runtime transition is unexercised by any automated test"
  - truth: "D-06/D-07 status mapping is preserved at runtime end-to-end: appcheck-family codes and permission-denied on an un-attested write show the appcheck status with email fallback; non-appcheck errors show the generic error; no auto-retry"
    test: "Same UAT test 5 repeat: observe which status variant renders (appcheck wording, not generic error) and that the form retains its field values (not reset)"
    expected: "Appcheck status wording renders; fields keep values (copyable into the email fallback); no retry loop — resend is manual"
    why_human: "The mapping catch is unchanged code, but no post-fix browser observation of the rendered status exists; state-transition behavior grep cannot see"
coincidental_reliance_items: []
human_verification:
  - test: "UAT test 5 repeat (G-09-5 formal closure) — per 09-USER-SETUP.md §Gap Re-verification: prod incognito, DevTools block *recaptcha* + *google.com/reload*, submit with consent granted → appcheck status within ~10s, button re-enabled, form NOT reset, message in Firestore messages collection, appcheck_token_failure in GA4 (up to 24 h lag); repeat with consent denied → same status, no event, message still lands. Record via /gsd-verify-work resume."
    expected: "Bounded, deliver-anyway failure: never stuck on 'sending', message always lands, event strictly consent-gated"
    why_human: "Owner-only surfaces: DevTools request blocking on the owner's session, Firestore console read, GA4 events (pihole-blocked)"
  - test: "Favicon check (G-09-6 formal closure) — browser tab shows the GeoHist icon on https://geohisttrivia.com/ and /geohist/contact.html"
    expected: "GeoHist app icon in the tab (not the generic/missing icon)"
    why_human: "Tab rendering is browser-UI observable only; the server half (/favicon.ico 200, served link tags) is machine-verified by this verifier"
  - test: "Migrate-keys soft confirm (09-USER-SETUP.md marks this completed 2026-09-08; UAT test 4 pass corroborates end-to-end verification) — 🔍 runbook §1 soft check: reCAPTCHA Admin key settings no longer show the Migrate-keys banner"
    expected: "Banner gone (migration complete); site key value unchanged"
    why_human: "Owner-only console surface; non-blocking soft check by design"
---

# Phase 9: App Check, Monitor-First — Verification Report (Re-verification after gap closure)

**Phase Goal:** The contact form gains bot protection that is invisible to real users, with enforcement deferred until submission-count evidence says it is safe
**Verified:** 2026-09-09
**Status:** human_needed
**Re-verification:** Yes — after gap closure (prior 09-VERIFICATION.md 2026-09-08, status human_needed, 10/12; UAT 2026-09-08 produced G-09-2/G-09-4 [resolved], G-09-5, G-09-6; closed by plans 09-03 and 09-04. UAT results preserved in 09-UAT.md — unchanged, not overwritten)

## Goal Achievement

### Observable Truths

Merged must-haves: prior verification's 12 truths (regression re-checked) + 09-03 must_haves (G-09-2) + 09-04 must_haves (G-09-5/G-09-6). Deduplicated against roadmap SCs 1–5.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Form submissions succeed with zero user-visible change in monitoring mode (SC1) — now post-activation, post-Enterprise swap | ✓ VERIFIED | Owner UAT test 1 pass + test 4 pass (2026-09-08, live prod, message landed in Firestore); code chain traced: contact.js:170–253 (app 176–180 → appCheck 202–208 → getToken 214 → auth 222–225 → addDoc 236–239) |
| 2 | App Check initializes as 4th pinned 12.18.0 module, after default app, before auth/firestore; zero attestation bytes in served HTML (SC1) | ✓ VERIFIED (regression) | contact.js:125–129 four imports under `CDN_BASE = 'https://www.gstatic.com/firebasejs/12.18.0/'` (line 46); rg `google.com/recaptcha` across index.html, 404.html, geohist/*.html → 0 matches; served contact.html → 0 matches |
| 3 | Shipped attestation provider is ReCaptchaEnterpriseProvider, exported by the same pinned 12.18.0 firebase-app-check.js module (G-09-2) | ✓ VERIFIED | contact.js:205 `new mods.appCheck.ReCaptchaEnterpriseProvider(config.recaptchaSiteKey)` — count = 1; `ReCaptchaV3Provider` in js/ → 0 matches; prod-served contact.js → Enterprise = 1 |
| 4 | Site key active in firebase-config.js (dormant gate retired) (G-09-2) | ✓ VERIFIED | firebase-config.js:32 `recaptchaSiteKey: '6LfYjbAtAAAAABgPLG-4SuJJ9lggRWO-ZJxxOEPF'`; header comment records 2026-09-08 activation; prod-served firebase-config.js carries the key; gate branch `!== ''` (contact.js:202) is live |
| 5 | Token-failure path is bounded: blocked reCAPTCHA → submit leaves "sending" within ~10s, status shows, button re-enables (G-09-5A) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Wiring complete: `TOKEN_TIMEOUT_MS = 10000` (contact.js:53), `raceToken` helper (149–167, timer + clearTimeout on both settle paths, synthetic `appCheck/token-timeout` reject), applied at 214; `.finally` re-enables (313–315). No automated test exercises the hang→timeout transition — see Human Verification #1 |
| 6 | On token failure (reject OR timeout) the message STILL lands un-attested while appcheck status shows and the event dispatches (G-09-5B) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Wiring complete: record-and-swallow catch (214–217: records `err.code`, swallows, returns normally) → signInAnonymously + addDoc proceed (221–240) → recorded code re-thrown AFTER delivery (247–251) → unchanged onSubmit mapping (295–303). Runbook §7 line 146 + §8 line 154 now state the shipped un-attested semantics. Runtime transition unexercised — see Human Verification #1 |
| 7 | D-06/D-07 mapping preserved end-to-end: appcheck-family + permission-denied (incl. un-attested writes) → appcheck status with email fallback; non-appcheck → generic; no auto-retry; form NOT reset on appcheck path | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Case-tolerant `/^app-?check\//i \|\| permission-denied` (contact.js:295) unchanged; `appCheck/token-timeout` (20 chars) matches the family regex; node at contact.html:74 with email fallback text; no reset call on the appcheck path; no retry loop in js/contact.js (rg "retry" → comment prose only). Rendered-status runtime observation pending — same Human Verification #1 |
| 8 | persano:appcheck event → consent.js listener → logEventSafe('appcheck_token_failure', {code}), consent-gated, silent no-op on deny (SC3) | ✓ VERIFIED (regression) | Dispatch contact.js:297–300 (detail.code sliced 40); consent.js:140–142 listener routes to logEventSafe (116–123, early return unless granted); zero App Check imports in consent.js; event + param names exact |
| 9 | Resubmit reuses cached instance — no second initializeAppCheck possible | ✓ VERIFIED (regression) | contact.js:69 module-level `appCheckInstance`, set once (203–208), never cleared anywhere in file |
| 10 | Double/parallel submit impossible in flight; button re-enables in .finally on every path | ✓ VERIFIED (regression) | contact.js:272 `submitButton.disabled = true` before send; 313–315 `.finally` re-enables — reachable from reject, timeout-race, and post-delivery re-throw paths |
| 11 | 19 dictionaries + markup carry contact.status.appcheck at 171-key parity; ja/zh omit raw email | ✓ VERIFIED (regression) | `node scripts/i18n-keycheck.mjs` → PASS ×19, "OK", exit 0; ja/zh parsed values contain no '@' and are non-empty |
| 12 | 09-RUNBOOK.md documents the full owner console chain in Enterprise reality with dated revisions (G-09-2 + G-09-5 wording) | ✓ VERIFIED | Read all 162 lines: revision notes 2026-09-08 (line 9, D-01 revised) and 2026-09-09 (line 11, G-09-5 bounded/un-attested); §0 state table rows 2–4 ✅ done; §1 key record + Migrate-keys owner step (domain list `geohisttrivia.com` ONLY, line 37); §2 Enterprise registration record; §3 activation done; §7/§8 wording matches shipped bounded deliver-anyway behavior (lines 146, 154); no 'Enterprise rejected' stale rationale in COVERAGE.md/RUNBOOK.md (rg → 0) |
| 13 | Flip gated on evidence, never calendar: ready-to-enforce signal + ≥30 successful submissions, unit pinned, both boundary directions (SC4) | ✓ VERIFIED (regression) | §5 lines 96–108: BOTH conditions required; below-30 and at/above-30 boundary sentences; unit pinned to successful form submissions (line 106); "Never calendar" (line 108) |
| 14 | Per-product flip (Firestore AND Authentication) + rollback toggle-off + ≤15-min propagation + replay-protection refutation (SC4) | ✓ VERIFIED (regression) | §6 lines 112–127: owner-only, per-product expand→read→Enforce; rollback = same toggle off, ≤15 min; replay-protection explicitly documented as NOT existing for Firestore |
| 15 | Weekly ritual reads Verified/Outdated/Unknown/Invalid split + submission count + appcheck_token_failure named (SC4) | ✓ VERIFIED (regression) | §4 steps 1–4 + semantics table (82–91); §8 event reference with `code` param + 24h GA4 lag |
| 16 | privacy.html SDK-inventory li mentions reCAPTCHA/App Check (website only) with consent-interplay sentence; stale 'v3' label dropped; prose byte-identical (SC5, CMPL-05) | ✓ VERIFIED | privacy.html:55 exact li — bold lead "reCAPTCHA / Firebase App Check (website only):" (v3 dropped by 09-03), consent-interplay sentence intact ("runs regardless of your analytics cookie choice, and only when you submit the form"); `git diff -- geohist/privacy.html` → empty (worktree = HEAD); "reCAPTCHA v3" in privacy.html → 0 matches; Last updated September 7, 2026 (line 37) |
| 17 | Every HTML page (7 heads) declares icon links and the repo ships a root favicon.ico; prod /favicon.ico resolves (G-09-6) | ✓ VERIFIED | favicon.ico tracked in git; ICO byte gate: `ICO OK (len=59370, png=59348)` — length = png+22, ICONDIR/ICONDIRENTRY bytes, PNG magic `89504e47` at offset 22; all 7 files carry `rel="icon"` ×2 + `apple-touch-icon` ×1, root-relative (contact.html:20–22, 404.html:8–10, index.html:20–22, geohist/{index,guide,privacy,changelog}.html — counted per file); validate:html + validate:links exit 0 (19 links all 200); prod: /favicon.ico HTTP 200 (re-verified), served contact.html rel="icon" ×2, zero attestation bytes |
| 18 | COVERAGE.md reflects Enterprise reality: ReCaptchaEnterpriseProvider row INTEGRATE with dated D-01 revision; first row marked superseded | ✓ VERIFIED | COVERAGE.md:16 Enterprise row INTEGRATE with deprecation rationale "(2026-09-08). D-01 revised 2026-09-08"; line 9 first row INTEGRATE + "(superseded 2026-09-08: provider class swapped to Enterprise…)" |

**Score:** 15/18 truths verified (3 present, behavior-unverified)

Regression check of the prior verification's 12 truths: all 12 remain standing (truths #1, #2, #8–#11, #15 above map 1:1; #3's appcheck-status wiring is now extended by the 09-04 bounded/deliver-anyway semantics and re-classified with runtime evidence still pending). No regressions found: worktree clean vs HEAD for all phase files; privacy.html prose byte-identical; consent.js listener unchanged; init order, cache-once guard, and double-submit guard intact.

### UAT Gap Reconciliation (09-UAT.md cross-reference)

| Gap | Closure vehicle | Agent-side state | Behavior evidence |
|-----|----------------|------------------|-------------------|
| G-09-2 (major) — classic provider vs Enterprise registration + dormant gate | 09-03 (Enterprise swap + activation + docs + deploy) | CLOSED + machine-verified (code, docs, prod) | Owner UAT test 4 pass 2026-09-08 (valid prod submit, zero visible change, message in Firestore) |
| G-09-4 (major) — 403 App attestation failed (registration held wrong site key) | Owner console fix, no code change | CLOSED | Owner UAT test 4 pass 2026-09-08 |
| G-09-5 (major) — unbounded getToken hang + message-lost-on-reject | 09-04 Task 1 (bounded race + record-and-swallow + post-delivery re-throw) | CLOSED + machine-verified (syntax, invariant gates, prod serves the fix) | UAT test 5 repeat PENDING owner (09-USER-SETUP.md checklist) |
| G-09-6 (cosmetic) — favicon missing site-wide | 09-04 Task 2 (favicon.ico + 7 heads) | CLOSED + machine-verified (byte gate, links, prod 200) | Tab-icon check PENDING owner (cosmetic residual) |

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Enforcement flip execution (FIRE-10) | Future requirement (post-monitoring), by design | REQUIREMENTS.md:49 Future Requirements; 09-RUNBOOK.md §6 "Who: the owner only"; 0 enforcement API calls in js/ (rg "enforce" → comment word only, contact.js:284) |

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `js/contact.js` | Bounded ~10s race, record-and-swallow, post-delivery re-throw, Enterprise provider, dormant gate, unchanged mapping | ✓ VERIFIED | `node --check` passes; TOKEN_TIMEOUT_MS=10000 (line 53); raceToken (149–167); record-and-swallow (214–217); re-throw after addDoc (247–251); Enterprise init (205); dormant else-branch (218–219) byte-identical semantics; header (lines 11–30) + inline comments document the G-09-5 semantics |
| `js/firebase-config.js` | Active public site key + activation comment | ✓ VERIFIED | Line 32 active key; lines 15–21 comment records 2026-09-08 activation, public-by-design, secret console-only |
| `js/consent.js` | persano:appcheck listener via logEventSafe, no App Check imports | ✓ VERIFIED | Lines 140–142; rg initializeAppCheck/firebase-app-check in consent.js → 0 |
| `geohist/contact.html` | data-status=appcheck node with email fallback + icon links | ✓ VERIFIED | Line 74 (form-status + data-status + data-i18n + hidden); icon links 20–22 |
| `js/i18n/*.json` (19 files) | contact.status.appcheck in every dictionary, atomic | ✓ VERIFIED | keycheck PASS (19/19, 171-key parity, exit 0) |
| `favicon.ico` | Spec-valid single-entry ICO wrapping geohist/icon.png | ✓ VERIFIED | Byte gate pass: 59,370 B = 59,348 + 22 header; ICONDIR 00 00 01 00 01 00; entry width/height 192/192; PNG magic 89504e47 at offset 22; tracked in git |
| `index.html`, `404.html`, `geohist/{index,contact,guide,privacy,changelog}.html` | 3 icon-link lines per head, root-relative | ✓ VERIFIED | rel="icon" ×2 + apple-touch-icon ×1 in each of the 7 files; /geohist/icon.png + /favicon.ico root-relative |
| `.planning/.../09-RUNBOOK.md` | Dated revisions; §7/§8 match shipped bounded deliver-anyway behavior; warnings verbatim | ✓ VERIFIED | Lines 9–11 revision notes; §7 line 146 + §8 line 154 aligned; both §7 hard warnings verbatim (143–144); no secrets (AIza-shaped scan of runbook body → config values only in code, none here) |
| `.planning/.../09-USER-SETUP.md` | G-09-5/G-09-6 re-verification checklist appended | ✓ VERIFIED | Lines 29–47: test 5 repeat (both block patterns, ~10s status, form unreset, Firestore read, GA4 event, consent-deny repeat) + favicon check; no secrets |
| `.planning/.../COVERAGE.md` | Enterprise row INTEGRATE + superseded marker | ✓ VERIFIED | Lines 9, 16 |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| getToken reject OR 10s timeout | recorded code → signInAnonymously + addDoc un-attested → appcheck status + persano:appcheck → logEventSafe | raceToken reject → catch records → attested.then proceeds → post-delivery throw → onSubmit mapping → dispatch → consent.js listener | ✓ WIRED | contact.js:149–167 → 214–217 → 221–240 → 247–251 → 295–300 → consent.js:140–142; `appCheck/token-timeout` matches `/^app-?check\//i` |
| config.recaptchaSiteKey | ReCaptchaEnterpriseProvider init | config field read | ✓ WIRED | contact.js:202 non-empty branch → 204–208 init; empty branch = dormant resolve (unchanged) |
| `<link rel="icon">` ×7 | /favicon.ico + /geohist/icon.png | head links → root-relative URLs → browser tab icon | ✓ WIRED | 7/7 files counted; favicon.ico byte-gate + prod 200 |
| consent.js logEventSafe | GA4 appcheck_token_failure {code} | isGranted() gate | ✓ WIRED (regression) | consent.js:116–123, 142; code truncated 40 chars both sides |
| runbook §3 activation | firebase-config.js field | documented paste (done by 09-03) | ✓ WIRED | §3 record matches shipped field |
| runbook §7/§8 | shipped contact.js semantics | wording parity | ✓ WIRED | Lines 146/154 describe exactly the 09-04 code (bounded ~10s, record, deliver un-attested, post-delivery mapping) |
| privacy li | consent.js load-gating model | "regardless of your analytics cookie choice" claim | ✓ WIRED (regression) | Claim matches logEventSafe isGranted gate; App Check path never reads banner storage |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| appcheck status wording | err.code | runtime getToken/addDoc rejection or synthetic timeout | Yes (runtime) | ✓ FLOWING (statically traced; runtime unexercised — truths #5–#7) |
| event param code | detail.code | CustomEvent from contact.js (runtime code or synthetic) | Yes | ✓ FLOWING |
| GA4 appcheck_token_failure | code | String(detail.code).slice(0,40) | Yes | ✓ FLOWING |
| favicon.ico bytes | geohist/icon.png | repo asset, verbatim | Yes | ✓ FLOWING (byte gate + prod SHA256 match per 09-04 D4) |

No static/hardcoded fallbacks in the phase's data paths. The `'unknown'` default when err.code is absent is the correct defensive fallback, not a stub.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| contact.js syntax | `node --check js/contact.js` | "syntax-contact OK" | ✓ PASS |
| firebase-config.js syntax | `node --check js/firebase-config.js` | "syntax-config OK" | ✓ PASS |
| i18n detect redirect logic | `node --test scripts/i18n-detect.test.mjs` | tests 23, pass 23, fail 0 | ✓ PASS |
| i18n 171-key parity | `node scripts/i18n-keycheck.mjs` | PASS ×19, "OK", exit 0 | ✓ PASS |
| HTML validity | `npm run validate:html` | exit 0 | ✓ PASS |
| Link integrity (incl. favicon refs) | `npm run validate:links` | 19 links, all 200, exit 0 | ✓ PASS |
| ICO byte gate | `node -e` (09-04 Task 2 recipe) | "ICO OK (len=59370, png=59348)" | ✓ PASS |
| Icon links per head | rg rel="icon"/apple-touch-icon ×7 files | 7/7 = 2 + 1 | ✓ PASS |
| Enterprise provider count | `rg -c "ReCaptchaEnterpriseProvider" js/contact.js` | 1 | ✓ PASS |
| Zero classic-provider refs | `rg "ReCaptchaV3Provider" js/` | 0 matches | ✓ PASS |
| No analytics import in contact.js | `rg "firebase-analyt" js/contact.js` | 0 matches | ✓ PASS |
| No debug token committed | `rg "FIREBASE_APPCHECK_DEBUG_TOKEN" js/` | 0 matches | ✓ PASS |
| Zero attestation bytes (local + prod) | rg google.com/recaptcha on 7 HTML files + served contact.html | 0 matches both | ✓ PASS |
| ja/zh no raw email | parsed JSON '@' check | False ×2, values non-empty | ✓ PASS |
| Prod favicon | `curl.exe -s -o NUL -w "%{http_code}" https://geohisttrivia.com/favicon.ico` | 200 | ✓ PASS |
| Prod serves the fix | served contact.js: appCheck/token-timeout ≥1 (4), Enterprise = 1; served firebase-config.js: key = 1 | all present | ✓ PASS |
| privacy.html prose integrity | `git diff -- geohist/privacy.html` | empty (worktree = HEAD) | ✓ PASS |

### Probe Execution

No `scripts/*/tests/probe-*.sh` probes declared for this phase. Phase-relevant runnable gates (keycheck, i18n-detect test, validate:html, validate:links, ICO byte gate, node --check, rg invariant gates, prod curls) were all executed by this verifier in its own process and are recorded above.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| FIRE-07 | 09-01, 09-03, 09-04 | App Check monitoring mode, 4th lazy module, init before auth/firestore, zero reCAPTCHA bytes, zero user-visible change, provider decision recorded | ✓ SATISFIED | Truths #1–#4, #17–#18; Enterprise D-01 revision recorded; zero-visible-change behaviorally confirmed by UAT tests 1 + 4 |
| FIRE-08 | 09-01, 09-04 | Token-failure UX — dedicated status node with email fallback + Analytics event; bounded and deliver-anyway after G-09-5 | ✓ SATISFIED (code complete; runtime acceptance pending owner) | Truths #5–#8, #11; all wiring machine-verified; runtime transition → Human Verification #1 |
| FIRE-09 | 09-02 | Enforcement flip documented as owner console step, evidence-gated (never calendar), per-product, reversible, ritual defined | ✓ SATISFIED | Truths #13–#15 |
| CMPL-05 | 09-02 | Privacy policy mentions reCAPTCHA/App Check with consent-interplay nuance | ✓ SATISFIED | Truth #16 |

**Orphaned requirements:** none — REQUIREMENTS.md maps exactly FIRE-07/08/09 + CMPL-05 to Phase 9 (lines 80–83, all Complete), and the plans claim exactly those four. FIRE-10 stays in Future Requirements (deferred by design).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| 09-RUNBOOK.md | 7 | "TODO (yours)" status-legend label | ℹ️ Info | Intentional owner-action legend (⬜ TODO = owner console steps), carried since 09-02; not unfinished work |
| js/contact.js | 307–311 | console.error on submit failure | ℹ️ Info | Deliberate debuggability log per header comment — users see the keyed status only; not a log-only implementation |
| 09-04 plan vs shipped | — | Plan said revision note "Revised 2026-09-08 (G-09-5…)", shipped says 2026-09-09 | ℹ️ Info | Shipped date is the accurate execution date; wording otherwise per plan |

No TBD/FIXME/XXX/HACK/PLACEHOLDER markers in any phase-modified file (rg across all 10 text artifacts → 0). No enforcement logic, no auto-retry, no debug tokens, no secrets in the served tree. Working tree clean vs HEAD for every phase artifact.

### Prohibitions Re-Verified (regression, all passed)

| Prohibition | Check | Result |
| ----------- | ----- | ------ |
| No attestation-script URL in served HTML | rg google.com/recaptcha, local + prod | 0 matches ✓ |
| No debug-provider flag / debug token in js/ | rg FIREBASE_APPCHECK_DEBUG_TOKEN | 0 matches ✓ |
| No classic provider class anywhere in js/ | rg ReCaptchaV3Provider | 0 matches ✓ |
| No auto-retry of token fetch | rg retry/attempt/interval in contact.js | comment prose only ✓ |
| No client-side enforcement logic | rg enforce/Enforce in js/ | comment word only (contact.js:284), no API call ✓ |
| No App Check code in consent.js / page-load path | listener only, zero imports ✓ |
| Token never in addDoc payload | payload inspected (contact.js:227–235): email/topic/message/createdAt/name only ✓ |
| Banner independence | no firebase-analyt import, no banner-storage reads in contact.js ✓ |
| Never add localhost to allowlist | §1 line 37 + §7 line 143 double warning verbatim ✓ |
| No secrets in RUNBOOK/USER-SETUP | AIza-shaped scan → 0 ✓ |
| No Firestore replay-protection option documented | §6 refutation paragraph verbatim ✓ |
| No calendar trigger | §5 "Never calendar" ✓ |
| Agent never executes flip | §6 owner-only + 0 repo enforcement calls ✓ |

### Human Verification Required

See frontmatter `human_verification` (3 items). The single blocking item is the **UAT test 5 repeat** (G-09-5 formal closure): prod incognito + DevTools block of `*recaptcha*` AND `*google.com/reload` → appcheck status within ~10s, form usable/unreset, message in Firestore (both consent states), appcheck_token_failure only with consent granted. Checklist ready in 09-USER-SETUP.md; formal pass/fail via `/gsd-verify-work resume`. Favicon tab check and the Migrate-keys soft confirm are the remaining non-blocking items.

### Gaps Summary

No automated gaps. All 5 roadmap Success Criteria verified at the code/artifact level and, where runtime-observable, by owner UAT evidence: SC1 zero-visible-change (UAT tests 1 + 4 pass), SC2/SC3 token-failure status + consent-gated event (wiring machine-verified end-to-end including the 09-04 bounded/deliver-anyaway semantics; runtime observation pending the owner's UAT test 5 repeat), SC4 evidence-gated per-product reversible flip + ritual (runbook §4–§6, all constraints standing), SC5 privacy disclosure (li intact, stale v3 label dropped). Both gap-closure plans' machine-verifiable slices re-verified fresh by this verifier (syntax, invariant rg gates, ICO byte gate, i18n parity, validate:html/links, prod smoke: /favicon.ico 200, served Enterprise provider + timeout code + site key, zero attestation bytes).

The phase remains in `human_needed` solely because three truths assert runtime transitions (bounded timeout UX, un-attested delivery, rendered status mapping) that this static site's zero-test-infrastructure cannot exercise automatically and that only the owner's browser/Firestore/GA4 surfaces can discharge. The 09-USER-SETUP.md checklist is the exact closure procedure.

---

_Verified: 2026-09-09_
_Verifier: the agent (gsd-verifier)_
_Re-verification basis: prior 09-VERIFICATION.md (2026-09-08) + 09-UAT.md (UAT results preserved there, not superseded) + plans 09-03/09-04 must_haves_
