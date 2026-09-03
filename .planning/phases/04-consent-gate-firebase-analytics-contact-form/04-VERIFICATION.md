---
phase: 04-consent-gate-firebase-analytics-contact-form
verified: 2026-09-02T23:59:00Z
status: human_needed
score: 15/17 must-haves verified
behavior_unverified: 2
overrides_applied: 0
human_verification:
  - test: "Consent live battery (04-01 Task 3, 6 checks): fresh incognito + DevTools Network (Disable cache ON) on /geohist/ — (1) banner visible with two equally prominent buttons, ZERO requests to www.gstatic.com/firebasejs, googletagmanager.com, firebaseinstallations.googleapis.com, firebase.googleapis.com; (2) Accept → those vendor hosts appear; (3) Play badge click → GA4 DebugView shows play_badge_click {page}; (4) language switch → language_switch {from,to} (init auto-apply for non-EN browser also logs); (5) footer Consent → Reject → stored choice flips, no new wrapper sends; (6) fresh session Reject-first → zero vendor requests at any point"
    expected: "All six checks pass — zero SDK bytes before grant, both events post-grant, retraction works"
    why_human: "Live network observability + GA4 DebugView require a real browser session; backstop truth (verification: backstop) — presence checks cannot see dynamic imports. Insufficient spec/automation in this repo (no test framework, no build step)"
  - test: "Firestore Rules Playground battery (04-02 Task 3, cases 1-6): (1) 5-field create → ALLOW; (2) name-less create per topic value general/bug/feedback/deletion → ALLOW ×4; (3) extra unknown field → DENY; (4) topic 'other' or missing → DENY; (5) 5001-char message / 255-char email → DENY; (6) get/update/delete simulation on /messages/{docId} → DENY"
    expected: "Cases 1-2 ALLOW, 3-6 DENY — schema lock proven server-side; case 5 also settles rules-language size() unit semantics (research A2 assumption: UTF-8 bytes vs client UTF-16 code units for non-ASCII input)"
    why_human: "Rules Playground runs only in the Firebase console; the console ruleset is an owner-merged (not byte-identical) copy — no automation in this repo can execute rules-language semantics. Insufficient spec/automation"
  - test: "Live submit battery (04-02 Task 3, checks 7-10) on https://persano.github.io/geohist/contact.html: (7) Accept banner, submit valid input → success status; Firestore console shows doc with server timestamp and exact field set {name?, email, topic, message, createdAt}; (8) fresh session, Reject banner, submit → STILL succeeds; (9) honeypot-filled submit → success shown, NO document created; (10) rapid double-click submit → exactly one document"
    expected: "Form works identically after grant and after deny; honeypot swallow creates nothing; in-flight guard prevents duplicates"
    why_human: "Requires real anonymous-auth session + Firestore console reads; backstop truth (verification: backstop). Insufficient spec/automation in this repo's tooling"
behavior_unverified_items:
  - truth: "On the deployed site, a fresh incognito session shows zero requests to any Firebase/measurement vendor before an affirmative grant, and vendor traffic appears only after Accept; GA4 receives play_badge_click and language_switch post-grant (04-01 backstop)"
    test: "Human verification item 1 (consent live battery, 6 checks)"
    expected: "Zero vendor requests pre-grant; vendor hosts + both GA4 events post-grant"
    why_human: "Backstop truth — live network behavior unobservable via source/grep/harness; needs real incognito session + DebugView"
  - truth: "Live behavior on the deployed site: schema-conformant submit creates a Firestore document with server timestamp; name-less create succeeds for every topic; extra/malformed field denied; form submits after consent grant AND after deny; honeypot submit shows success but creates no document (04-02 backstop)"
    test: "Human verification items 2-3 (Rules Playground + live submit battery)"
    expected: "Create succeeds live under published rules after either banner choice; honeypot/double-click create zero/one doc"
    why_human: "Backstop truth — live auth/write behavior + console ruleset content not automatable here"
---

# Phase 4: Consent Gate + Firebase (Analytics + Contact Form) Verification Report

**Phase Goal:** GDPR-compliant consent gates Firebase Analytics (zero SDK bytes before grant); a working contact form submits via anonymous auth to Firestore after any consent choice and completes the data-deletion request path
**Verified:** 2026-09-02T23:59:00Z
**Status:** human_needed (all must-haves verified at source + behavioral level; 2 backstop truths + 3 battery sets require human/live proof per honesty contract)
**Re-verification:** No — initial verification

> **Mode note:** ROADMAP declares `Mode: mvp`, but `user-story.validate` returns `false` for this phase's goal (not in "As a …, I want to …, so that …" format). MVP-narrowed User Flow Coverage was NOT produced; standard goal-backward verification (roadmap SCs + PLAN must_haves) was applied instead. If the MVP User-Flow table is wanted, run `/gsd mvp-phase 4` and re-verify.

## Goal Achievement

### Observable Truths

04-01-PLAN.md (7 truths):

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | First visit on the 3 engine-carrying pages shows fixed-bottom banner, affirmative Accept/Reject only, equal prominence, no dismiss, never auto-dismisses | ✓ VERIFIED | All 3 pages: `consent-banner` section ships `hidden`, exactly 2 `<button>` (`data-consent=granted/denied`), zero other controls; `.consent-banner` fixed-bottom CSS on `var(--color-surface)` (base.css); harness T1: absent choice → banner un-hidden at init |
| 2 | Choice persists as versioned JSON `{v:1, analytics:'granted'\|'denied', ts:ISO-8601}` in `persano.consent`; absent/malformed/storage-blocked = no choice (fail-closed) | ✓ VERIFIED | js/consent.js:40-66 validates `v===1`, enum value, `typeof ts==='string'`, try/catch fail-closed; harness T2/T3 (both round-trips with fresh ISO ts), T4 (5 malformed variants → banner re-shows), T7 (setItem throw → session-only, banner re-shows next session), T8 (pre-stored granted → no banner + loader; denied → no loader) — 46/46 harness checks pass |
| 3 | Zero Firebase bytes before grant: no HTML references Firebase CDN; only consent.js imports Analytics, only inside granted path | ✓ VERIFIED | `firebasejs` across index.html, 404.html, geohist/*.html = **0 hits**; files importing `firebase-analytics` = exactly `['js/consent.js']`; import executes only in `loadAnalytics()` reached solely from granted path (consent.js:102-107, 218); harness T3: Reject → imports==[]; deployed served HTML: firebasejs=0 |
| 4 | Post-grant loader: pinned 12.18.0 modules, `isSupported()` guard before getAnalytics, `play_badge_click {page}` on .badge-cta, `language_switch {from,to}` on persano:langchange, every occurrence logged incl. init auto-apply | ✓ VERIFIED | consent.js:140-174 (app-first import chain, isSupported gate line 153, pinned CDN_BASE 12.18.0); i18n.js:130 dispatches `persano:langchange {from,to}`; harness T2: both events logged with exact params after grant; langchange is document-level listener → every occurrence incl. auto-apply hits it |
| 5 | Footer Consent link re-opens banner; retraction flips choice, calls `setAnalyticsCollectionEnabled(false)` when loaded, stops wrappers; grant→instant-retract race closed by re-reading choice after load | ✓ VERIFIED | consent.js:163-165 (race guard re-reads isGranted post-load), 178-185 (lever), 199-207 (reopen); harness T5 (lever(false) on retract, sends stop), T6 (deny during in-flight load → lever(false), zero wiring, zero sends) |
| 6 | All banner copy keyed (consent.banner.*) and present in BOTH es.json + pt-BR.json; validate:i18n passes | ✓ VERIFIED | `npm run validate` exit 0: "es.json exactly covers the 141-key live surface", "pt-BR.json exactly covers the 141-key live surface"; all 4 banner keys + 4 footer consent keys present in both dicts |
| 7 | BACKSTOP: deployed fresh-incognito zero vendor requests pre-grant; vendor traffic + GA4 events post-grant | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Structure verified live (deployed HTML: firebasejs=0, script trios correct) + behavioral equivalent (harness T2/T3), but live network zero-byte proof needs a human incognito session — human item 1 |

04-02-PLAN.md (10 truths):

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | /geohist/contact.html mirrors guide.html pattern, carries banner block + consent script tags + contact.js from birth | ✓ VERIFIED | contact.html: nav (4 keys), keyed metas/title, footer trio + copyright + lang slot + consent-reopen, banner block verbatim, 4 script tags in locked order i18n→config→consent→contact; deployed 200 |
| 2 | Form per D-47: name optional ≤100, email required ≤254, topic select with exactly 4 enum options, message 1..5000, all labeled+keyed; honeypot off-screen (not display:none), aria-hidden + tabindex=-1 + autocomplete off | ✓ VERIFIED | contact.html:28-61 (4 labeled fields, maxlength attrs, 4 option values); `.hp-field` off-screen `-9999px`, not display:none; aria-hidden + tabindex=-1 + autocomplete=off present |
| 3 | Client validation BEFORE any network; keyed status variants (aria-live=polite, hidden-toggled, static nodes); inline statuses only, no toasts | ✓ VERIFIED | contact.js:63-74 validate() runs before loadModules(); 6 pre-authored `<p class=form-status aria-live=polite hidden>` variants; zero textContent dict injection (JS only toggles hidden); harness C2: invalid-email/invalid-message/invalid-topic shown with ZERO imports; C1: honeypot path zero network |
| 4 | Client caps == rules caps (email 254, message 1..5000, name 100) | ✓ VERIFIED (see human item 2 for unit semantics) | Both files encode identical numbers: contact.js:28-31 (254/1..5000/100) ↔ firestore.rules:14-20 (>0,≤254 / ≥1,≤5000 / ≤100). Numeric agreement proven; rules-language `size()` unit semantics (UTF-8 bytes vs UTF-16 units for non-ASCII) is research assumption A2 — exercised by Rules Playground case 5 (human item 2) |
| 5 | Choice-independent submit pipeline: preventDefault → honeypot silent swallow → lazy one-time import of 3 pinned modules → initializeApp + getAuth, signInAnonymously only when currentUser absent → conditional name key (never null) → addDoc(messages, serverTimestamp) → in-flight button disable | ✓ VERIFIED | contact.js:107-177 full chain; `'consent'` (case-insensitive) in contact.js = **0 matches**; `firebase-analytics` = 0; harness C1 (honeypot → success + reset + zero network), C3 (3 pinned imports, signInAnonymously, payload keys exact without name, serverTimestamp sentinel, name included when filled, button disabled in flight/re-enabled in finally, import-once on 2nd submit, no re-signIn when currentUser present), C4 (import failure → error status, no crash) |
| 6 | firebase/firestore.rules create-only: hasOnly 5 fields, 4-value topic enum, type+length caps, absent-or-string name guard, createdAt == request.time, read+update+delete denied | ✓ VERIFIED (repo file) | firestore.rules:10-24 — single `allow create` gated on auth+hasOnly+enum+caps+`(!('name' in …) \|\| name is string)`+`createdAt == request.time`; `allow read, update, delete: if false`; no other allow rule. Server-side enforcement = human item 2 |
| 7 | CMPL-03 path: 'deletion' topic + FAQ entry + contact explainer quoting privacy §4 verbatim (retention sentence + contact email) | ✓ VERIFIED | `contact.topic.deletion` option value=deletion; `geohist.faq.deletion.q/a` present; "Messages are deleted after they are handled" verbatim in geohist/index.html FAQ, contact.html explainer, and privacy.html; santiagopostorivo@gmail.com in all three EN surfaces |
| 8 | D-48 rewiring: 3 footer Contact anchors → /geohist/contact.html; FAQ report answer + anchor → form; privacy.html + About-dev keep mailto | ✓ VERIFIED | hub/geohist/guide footer.contact hrefs = `/geohist/contact.html`; FAQ report anchor → form; About-dev + privacy.html mailto preserved; deployed pages confirm |
| 9 | keycheck pages list includes contact.html; every new key in BOTH dicts; validate:i18n passes | ✓ VERIFIED | scripts/i18n-keycheck.mjs contains contact.html; both dicts 141 keys 1:1; `npm run validate` exit 0 |
| 10 | BACKSTOP: live submit creates doc with server timestamp; name-less create per topic; extra field denied; works after grant AND after deny; honeypot → success, no doc | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Full pipeline proven in-code (truth 5) + deployed assets 200 + owner-confirmed console prerequisites (Anonymous provider, authorized domain, rules merged+published), but live proof needs human items 2-3 |

**Score:** 15/17 truths verified (2 present, behavior-unverified — both declared `verification: backstop`)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `js/consent.js` | Consent store + banner + retraction + loader + both event wrappers | ✓ VERIFIED | 234 lines; wired via `<script defer>` on 4 pages; behaviorally exercised (harness) |
| `js/firebase-config.js` | `window.persanoFirebaseConfig` with 5 real values | ✓ VERIFIED | Real config (projectId geohist-trivia, measurementId G-KDWVVHRYD5), 0 placeholders; wired (read by both gates) |
| Banner markup ×3 + footer consent items | section + 2 buttons + reopen on 3 keyed pages | ✓ VERIFIED | All 3 pages + contact.html: 2 buttons, hidden attr, reopen links |
| `css/base.css` form/status/banner styles | theme tokens | ✓ VERIFIED | `.consent-banner` (var(--color-surface)), `.form-field`, `.form-status`, `.hp-field` (off-screen) present |
| `geohist/contact.html` | New keyed contact page | ✓ VERIFIED | Exists, substantive, wired (3 footers + FAQ anchor + smoke-check + keycheck) |
| `js/contact.js` | Submit pipeline | ✓ VERIFIED | 202 lines; wired via script tag on contact.html; behaviorally exercised |
| `firebase/firestore.rules` | Create-only schema lock | ✓ VERIFIED | 27 lines, exactly one non-false allow; console copy owner-merged (content unverifiable from repo — human item 2) |
| `scripts/i18n-keycheck.mjs` + `scripts/smoke-check.sh` | Wiring for new page/keys | ✓ VERIFIED | Both reference contact.html; validate + smoke wired |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| consent grant | Firebase Analytics SDK | dynamic CDN import in consent.js (import IS the gate) | ✓ WIRED | Harness T2: imports==[app,analytics] only on granted path; T3: zero on deny |
| js/i18n.js persano:langchange | language_switch wrapper | document-level listener | ✓ WIRED | i18n.js:130 dispatches `{from,to}`; harness T2 logs event with params |
| .badge-cta anchor (geohist/index.html) | play_badge_click wrapper | click listener on .badge-cta | ✓ WIRED | Anchor present (deployed geohist/index.html:30); harness T2 logs `{page:'/geohist/'}` |
| footer Consent link | banner reopen → choice flip → setAnalyticsCollectionEnabled(false) | .consent-reopen class | ✓ WIRED | Present on 4 pages; harness T5 |
| consent.banner.* keys | both dictionaries | validate:i18n gate | ✓ WIRED | npm run validate exit 0, 141-key 1:1 |
| submit | lazy import → signInAnonymously → addDoc(messages) | contact.js pipeline | ✓ WIRED | Harness C3: 3 pinned imports, auth, addDoc with exact schema payload |
| firestore.rules | Firebase console paste | verbatim paste (merged) | ⚠️ PARTIAL | Owner confirmed MERGED into existing ruleset + PUBLISHED (documented deviation — console not byte-identical); console content unverifiable from repo → covered by human item 2 |
| faq.deletion + contact.deletion keys | privacy.html §4 wording | verbatim quote | ✓ WIRED | Retention phrase + email identical in all EN surfaces |
| footer Contact ×3 + FAQ anchor | /geohist/contact.html | href | ✓ WIRED | All 4 anchors point to the page |
| contact.html | i18n-keycheck pages list | join('geohist','contact.html') | ✓ WIRED | Gate green over 4 keyed pages |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| contact form | payload {email, topic, message, name?} | live form input values (readValues) | Yes | ✓ FLOWING (harness C3: payload built from actual input values, name key conditional) |
| consent banner | stored choice | localStorage persano.consent (versioned JSON) | Yes | ✓ FLOWING (harness T2/T3/T8 round-trips) |
| analytics events | page/lang params | location.pathname + CustomEvent detail | Yes | ✓ FLOWING (harness T2) |
| GA4/monitoring | vendor traffic | post-grant dynamic import | Yes (structural) | ⚠️ live volume unverified — human item 1 |

### Behavioral Spot-Checks

Independent verifier harness (vm-sandboxed, temp dir, zero site-code changes): `node C:/Users/Familia/AppData/Local/Temp/opencode/harness-p4.js` → **46 pass, 0 fail**

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Consent store round-trips (accept/reject/malformed/write-fail/pre-stored ×5) | harness T1-T4, T7-T8 | 46/0 overall | ✓ PASS |
| Deny never imports Analytics | harness T3 | imports==0 | ✓ PASS |
| Retraction lever + send stop | harness T5 | lever(false), sends stop | ✓ PASS |
| Grant→instant-retract race guard | harness T6 | lever(false), no wiring, no sends | ✓ PASS |
| FIRE-03 events post-grant with exact params | harness T2 | play_badge_click {page}, language_switch {from,to} | ✓ PASS |
| Honeypot swallow (zero network) | harness C1 | success + reset + 0 imports | ✓ PASS |
| Validation before network (4 invalid cases) | harness C2 | keyed statuses, 0 imports | ✓ PASS |
| Full submit pipeline (auth, schema payload, in-flight guard, import-once) | harness C3 | all assertions pass | ✓ PASS |
| Import failure → keyed error, no crash | harness C4 | error status, button re-enabled | ✓ PASS |
| `npm run validate` (html + links + i18n) | `npm run validate` | exit 0, 141-key 1:1 both dicts | ✓ PASS |
| Deployed pages/assets live | curl ×6 URLs | all 200; served HTML firebasejs=0; deployed content matches repo | ✓ PASS |
| Commits exist | git cat-file ×11 hashes | all `commit` | ✓ PASS |

### Probe Execution

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| scripts/smoke-check.sh (contact URL present) | source check | URL wired in 200-check loop | ✓ WIRED (script targets deployed site; local run not required) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FIRE-01 | 04-01 | GDPR consent banner: affirmative action, never auto-dismisses, persisted with timestamp, retraction path | ✓ SATISFIED | Truths 1-2, 5 + harness; live visual confirm inside human item 1 |
| FIRE-02 | 04-01 | Analytics loads ONLY after grant; no Firebase script tag in any HTML; zero SDK bytes before consent | ✓ SATISFIED (structure) | Truths 3 + prohibition gates (firebasejs=0, single import); live zero-request proof = human item 1 |
| FIRE-03 | 04-01 | Consent-gated events: Play badge clicks, language switches | ✓ SATISFIED (code) | Truths 4-5 + harness T2/T5; GA4 DebugView proof = human item 1 |
| FIRE-04 | 04-02 | Contact form: labels, honeypot, client validation, success/error states; works after any consent choice | ✓ SATISFIED (code) | Truths 1-3, 5 + harness C1-C4; live after-grant/after-deny proof = human item 3 |
| FIRE-05 | 04-02 | Anonymous auth at submit-time → Firestore; create-only schema-locked rules in repo | ✓ SATISFIED (code) | Truths 5-6 + harness C3; server-side lock proof = human item 2 |
| FIRE-06 | 04-02 | "Request data deletion" topic wired to CMPL-03 process | ✓ SATISFIED | Truth 7: deletion topic + FAQ + explainer |
| CMPL-03 | 04-02 | Data-deletion request path: FAQ + form topic + documented manual process | ✓ SATISFIED | Truth 7: all three surfaces quote privacy §4 verbatim (EN) |

No orphaned requirements: REQUIREMENTS.md maps exactly FIRE-01..06 + CMPL-03 to Phase 4; all appear in plan frontmatter (`04-01: [FIRE-01, FIRE-02, FIRE-03]`, `04-02: [FIRE-04, FIRE-05, FIRE-06, CMPL-03]`).

### Prohibitions (must-NOT checks)

| Prohibition | Verification | Status |
|-------------|-------------|--------|
| No Firebase SDK bytes pre-grant (no HTML script tag; only consent.js imports Analytics) | node gate: firebasejs=0 across 5 HTML files; analytics importers == ['js/consent.js'] | ✓ VERIFIED |
| Banner never dismiss-only/accept-only: exactly 2 equal buttons, no close control | per-page button count == 2, keyed accept+reject, no dismiss markup | ✓ VERIFIED |
| Gate never swallows a deny: Reject persists and no SDK import that session | harness T3 (imports==0 on reject) | ✓ VERIFIED |
| Rules never permit read/update/delete of messages | single `allow create` + `allow read, update, delete: if false`; no other allow | ✓ VERIFIED (repo file; console copy = human item 2) |
| Form pipeline never conditioned on banner choice | `'consent'` in contact.js == 0 matches (case-insensitive) | ✓ VERIFIED |
| Client validation never the schema gate — rules enforce independently | rules carry own type/length/enum checks; server-side proof = human item 2 | ✓ VERIFIED (source) / Playground pending |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| js/firebase-config.js | 10 | Stale comment: "Values below are placeholders" while the values are real (owner pasted at 1a7d322) | ⚠️ Warning | Misleading doc comment only; no runtime impact. Suggest one-line comment fix |
| geohist/index.html | 70-90 | "Screenshot placeholder" / "Screenshots coming soon" gallery | ℹ️ Info | Deliberate Phase-5 scope (LNDG-03, Phase 5 Pending in REQUIREMENTS.md) — not a phase-4 gap |
| (linkinator) | — | Local link scan covers 0 links (pre-existing validate:links behavior) | ℹ️ Info | Noted in 04-01 SUMMARY; out of phase-4 scope |

No TBD/FIXME/XXX debt markers in any phase-4 file. No stubs found (all `return`/empty-pattern hits were legitimate: try/catch degrade paths, defensive no-ops).

### Human Verification Required

See the 3 items in frontmatter `human_verification` (consent live battery, Rules Playground, live submit battery). These are exactly the checks both executors deliberately did NOT claim (04-01 D5; 04-02 D4/D5) — verified here as PENDING, never passed.

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Real screenshot gallery replacing placeholder tiles | Phase 5 | REQUIREMENTS.md traceability: "LNDG-03 \| Phase 5 \| Pending" |
| 2 | Owner review of ES/pt-BR translations (incl. new consent.* / contact.* copy) | Owner review (D-39 pattern, established Phase 3) | Summaries flag as known deferred; EN is the authoritative surface for CMPL-04 verbatim quotes |
| 3 | App Check enforcement (FIRE-07) | v2 (not current milestone) | REQUIREMENTS.md v2 section |

### Gaps Summary

None blocking. All 17 must-have truths resolve to VERIFIED (15) or PRESENT_BEHAVIOR_UNVERIFIED (2, both `verification: backstop` truths the plans themselves routed to human proof). No artifacts missing/stub/orphaned; no key link NOT_WIRED (one PARTIAL: console rules copy is owner-merged, not byte-identical — repo file is source of truth, per owner decision documented in 04-02-SUMMARY). Code-level phase goal is achieved: the consent gate structurally and behaviorally enforces zero Firebase bytes before grant, and the contact form is choice-independent with a create-only schema-locked rules file. What remains is exactly what the honesty contract reserved for humans: live network/DebugView proof (FIRE-02/03), server-side rules enforcement proof (FIRE-05, incl. A2 unit semantics), and live submit proof after grant and after deny (FIRE-04/05/06).

---

_Verified: 2026-09-02T23:59:00Z_
_Verifier: the agent (gsd-verifier)_
