---
phase: 04-consent-gate-firebase-analytics-contact-form
plan: 02
subsystem: contact
tags: [firebase, firestore, anonymous-auth, contact-form, honeypot, i18n, gdpr, compliance]

# Dependency graph
requires:
  - phase: 04-consent-gate-firebase-analytics-contact-form
    provides: js/consent.js gate + js/firebase-config.js real Web App config (04-01); banner markup the contact page inherits from birth
  - phase: 03-i18n-engine-es-pt-br-dictionaries-switcher
    provides: i18n engine + 1:1 dictionary keycheck gate + keyed-node conventions (contact.* keys join the 141-key surface)
  - phase: 02-geohist-landing-hub-content-en-i18n-keys-baked-in
    provides: guide.html page pattern + footer trio the contact page mirrors; FAQ <details> pattern
provides:
  - /geohist/contact.html — keyed page mirroring guide.html: nav, 4-field form + honeypot, 6 pre-authored keyed aria-live status variants, banner block, consent-reopen footer item
  - js/contact.js — choice-independent submit pipeline: honeypot swallow → client validation BEFORE any network → one-time lazy import of the 3 pinned 12.18.0 CDN modules → signInAnonymously (only when currentUser absent) → addDoc(messages, serverTimestamp) with in-flight double-submit guard; zero 'consent' references, zero Analytics imports (fork-shaped)
  - firebase/firestore.rules — create-only schema-locked rules (hasOnly 5 fields, 4-value topic enum, email 1..254 / message 1..5000 / name ≤100 caps, absent-or-string name guard, createdAt == request.time, read+update+delete denied) — repo source of truth, MERGED into the project's existing console ruleset and PUBLISHED by owner
  - CMPL-03 deletion path: form topic 'deletion' + geohist.faq.deletion.q/a FAQ entry + contact-page explainer, all quoting privacy.html §4 retention sentence verbatim
  - D-48 rewiring: footer Contact anchors on hub/geohist/guide → /geohist/contact.html; FAQ report answer + anchor repointed to the form; About-dev + privacy.html mailto preserved
  - 141-key 1:1 dictionary surface (contact.* namespace + geohist.faq.deletion.* in es.json + pt-BR.json); keycheck covers 4 keyed pages; smoke-check covers /geohist/contact.html
affects: [phase-5-verification, gsd-verify-work, phase-5-seo-screenshots]

# Actuals (#2632)
actuals:
  tokens: 8645   # chars/4 over the realized production diff 5c17241..8993c77 (34,581 chars incl. 2 planning files); plan estimate was 50000 — 6x overestimate
  tasks: 3
  commits: 6     # cff7d08, eca2237, 6dc2b56, 21f8509, 8993c77 + close-out docs commit

tech-stack:
  added: [Cloud Firestore (messages collection, production mode), Firebase Anonymous Auth (runtime use at submit time)]
  patterns: [submit-time lazy 3-module dynamic import (import is the consent fork), honeypot silent-success swallow, create-only schema-locked security rules, absent-or-string optional-field guard (no dot-access on missing field), pre-authored keyed aria-live status variants (static nodes, never JS textContent injection), in-flight submit-button disable guard]

key-files:
  created: [geohist/contact.html, js/contact.js, firebase/firestore.rules]
  modified: [index.html, geohist/index.html, geohist/guide.html, css/base.css, js/firebase-config.js, js/i18n/es.json, js/i18n/pt-BR.json, scripts/i18n-keycheck.mjs, scripts/smoke-check.sh]

key-decisions:
  - "Task 3 closed honestly per 04-01 precedent: Rules Playground cases 1-6 + live submit battery cases 7-10 NOT run/reported by owner — recorded PENDING, transferred to phase verification (VERIFICATION.md human_verification / UAT) as human_judgment deliverables D4/D5; NOT claimed passed"
  - "Owner took merge path for rules: Firestore already existed in project geohist-trivia, so the match /messages/{docId} block from firebase/firestore.rules was MERGED into the existing ruleset and PUBLISHED (existing app rules preserved) — console ruleset is not byte-identical to the repo file; repo file stays source of truth, future edits require re-paste"
  - "Canonical measurementId is G-KDWVVHRYD5 (owner-confirmed from console); wrong G-DV1M5N0EY5 fixed in js/firebase-config.js (8993c77) — pushed, CI run 33704909374 validate+deploy green, contact page live"
  - "Client caps equal rules caps exactly (email ≤254, message 1..5000, name ≤100, UTF-16 code units) — encoding probes resolved by making both sides agree on the same numbers"

patterns-established:
  - "Contact form is the compliance surface: js/contact.js never reads/writes the consent storage key and imports Auth/Firestore unconditionally at submit — form works identically after Accept or Reject"
  - "Fork-shaped Firebase split: firebase-analytics imported only in js/consent.js; app+auth+firestore imported only in js/contact.js; neither file touches the other's modules"
  - "Firestore rules are create-only: every accepted write is an independent immutable document; read/update/delete denied at the rules level"
  - "Pre-authored keyed status variants (role=status aria-live=polite hidden-toggled) — engine-safe pattern for dynamic form feedback"

requirements-completed: [FIRE-04, FIRE-05, FIRE-06, CMPL-03]

coverage:
  - id: D1
    description: "Contact page + submit pipeline in code: /geohist/contact.html mirrors guide.html (keyed metas/nav/footer, banner block, 4 script tags in locked order i18n->firebase-config->consent->contact), form per D-47 (name optional ≤100, email required ≤254, 4-topic select, message 1..5000, all labeled/keyed), honeypot off-screen aria-hidden + tabindex=-1, 6 keyed aria-live status variants; js/contact.js honeypot swallow -> pre-network validation -> lazy pinned import -> anonymous auth -> addDoc with conditional name key + in-flight guard"
    requirement: FIRE-04
    verification:
      - kind: other
        ref: "npm run validate exit 0 (html-validate + linkinator + i18n-keycheck 141-key 1:1 in es.json and pt-BR.json); close-out node battery: rules assert + contact.js pins (signInAnonymously/addDoc/serverTimestamp/hp_website/12.18.0, consent=0, firebase-analytics=0) + script order + honeypot markup — PASS; live: https://persano.github.io/geohist/contact.html and /js/contact.js return 200"
        status: pass
    human_judgment: false
  - id: D2
    description: "firebase/firestore.rules create-only schema lock: single allow (create gated on auth + hasOnly 5 fields + topic enum + type/length caps + absent-or-string name guard + createdAt == request.time) and explicit read/update/delete deny — merged into console ruleset and published per owner"
    requirement: FIRE-05
    verification:
      - kind: other
        ref: "close-out node battery: exactly 1 non-false allow line, deny line present, hasOnly/request.time/enum/caps/absent-or-string guard all asserted — PASS"
        status: pass
    human_judgment: false
  - id: D3
    description: "D-48 rewiring + CMPL-03 surfaces: footer Contact anchors on hub, geohist landing, guide → /geohist/contact.html; FAQ report answer + anchor repointed to the form; geohist.faq.deletion.q/a <details> entry quoting privacy.html §4 retention sentence verbatim; contact.deletion.text explainer; About-dev + privacy.html mailto preserved; smoke-check covers the new URL"
    requirement: CMPL-03
    verification:
      - kind: other
        ref: "close-out node battery: href=/geohist/contact.html present in all 3 footers, faq.deletion.q/a present, About-dev and privacy.html retain mailto:, smoke-check.sh carries /geohist/contact.html — PASS"
        status: pass
    human_judgment: false
  - id: D4
    description: "Rules Playground battery (Firestore console, cases 1-6): 5-field create ALLOW, name-less create ALLOW per topic value, extra-field DENY, bad-topic DENY, over-cap DENY, get/update/delete DENY"
    requirement: FIRE-05
    verification: []
    human_judgment: true
    rationale: "Owner confirmed console prerequisites done and rules published (merged path), but did NOT run or report the Playground battery — server-side schema-lock proof (research assumption A2: absent-or-string guard + timestamp match exercised) is pending; transferred to phase UAT (windows ledger #6 open, unrun-verify)."
  - id: D5
    description: "Live submit battery on https://persano.github.io/geohist/contact.html: submit succeeds after Accept AND after a fresh session's Reject; honeypot-filled submit shows success but creates no document; double-click creates exactly one document; first real create lands in Firestore with server timestamp + exact field set"
    requirement: FIRE-04
    verification: []
    human_judgment: true
    rationale: "Requires real browser sessions against the deployed site + Firestore console reads — no automation in this repo's tooling can prove live auth/write behavior. Owner replied 'continue' without running the battery; NOT claimed passed; transfers to phase UAT (VERIFICATION.md human_verification) alongside 04-01's live 6-check battery (windows ledger #5)."

# Metrics
duration: "24 min wall-clock spanning the Task-3 checkpoint pause (tasks 01:32-01:35Z, owner prerequisites + measurementId fix 01:44Z, close-out 01:55Z Sep 3)"
completed: 2026-09-03
status: complete
---

# Phase 4 Plan 02: Contact Page + Form Pipeline + Firestore Rules + CMPL-03 Summary

**/geohist/contact.html with a consent-choice-independent submit pipeline (honeypot → pre-network validation → lazy anonymous auth → create-only schema-locked Firestore `messages` writes) live on https://persano.github.io, completing the CMPL-03 data-deletion request path — Rules Playground + live batteries honestly carried to phase UAT as pending human verification.**

## Performance

- **Duration:** 24 min wall-clock (spanning the Task 3 owner checkpoint pause; active execution ≈10 min)
- **Started:** 2026-09-03T01:32:22Z (first task commit cff7d08)
- **Completed:** 2026-09-03T01:56:00Z (close-out commit)
- **Tasks:** 3 of 3 (Task 3 checkpoint closed by owner-confirmed console prerequisites; batteries transferred to UAT)
- **Files modified:** 14 (12 production/source + 2 planning)

## Accomplishments

- geohist/contact.html: keyed page mirroring guide.html — nav Game/Guide/FAQ/Privacy, 4-field form + off-screen honeypot (aria-hidden, tabindex=-1, autocomplete=off), 6 pre-authored keyed aria-live status variants, 04-01 banner block from birth, footer trio + consent-reopen item; 4 script tags in locked order (i18n.js → firebase-config.js → consent.js → contact.js)
- js/contact.js: submit pipeline is choice-independent — preventDefault → honeypot non-empty = silent success-swallow (zero network) → validation BEFORE any network (email shape/≤254, message 1..5000, topic enum, name ≤100) → one-time lazy import of the 3 pinned 12.18.0 gstatic modules → signInAnonymously only when currentUser absent → payload includes name key ONLY when non-empty (never null) → addDoc(messages) with serverTimestamp(); submit button disabled in flight; zero 'consent' matches, zero Analytics imports (fork shape)
- firebase/firestore.rules: create-only — hasOnly(['name','email','topic','message','createdAt']), 4-value topic enum, email 1..254 / message 1..5000 / name ≤100, absent-or-string name guard, createdAt == request.time, read+update+delete denied; owner MERGED this block into the project's existing console ruleset and PUBLISHED it
- CMPL-03 complete in code: topic 'deletion' + geohist.faq.deletion.q/a FAQ entry + contact-page explainer, quoting privacy.html §4 retention sentence verbatim; D-48 rewiring done (3 footer Contact anchors + FAQ report anchor → form; About-dev + privacy mailto preserved)
- Canonical measurementId G-KDWVVHRYD5 committed (8993c77); pushed to main (7012121..8993c77), GitHub Actions run 33704909374 validate+deploy green — contact page + js + rules all 200 live
- Dictionaries at 141 keys 1:1 in es.json + pt-BR.json; keycheck covers 4 keyed pages; smoke-check covers /geohist/contact.html

## Task Commits

1. **Task 1: /geohist/contact.html + js/contact.js pipeline + create-only rules + keycheck wiring (tracer)** - `cff7d08` (feat)
2. **Task 2: D-48 link rewiring + CMPL-03 deletion FAQ + smoke-check URL** - `eca2237` (feat)
3. **Checkpoint state sync + windows ledger** - `6dc2b56`, `21f8509` (docs)
4. **Task 3 (checkpoint): canonical measurementId G-KDWVVHRYD5** - `8993c77` (fix, owner-confirmed)
5. **Push + deploy** - 7012121..8993c77 to main; CI run 33704909374 green (orchestrator push)
6. **Close-out docs (SUMMARY + STATE + ROADMAP + REQUIREMENTS)** - this commit (docs)

## Files Created/Modified

- `geohist/contact.html` - the contact page (form, honeypot, status variants, banner, footer)
- `js/contact.js` - submit pipeline (honeypot, validation, lazy import, anonymous auth, addDoc, in-flight guard)
- `firebase/firestore.rules` - create-only schema-locked rules (repo source of truth; console carries merged copy)
- `index.html`, `geohist/index.html`, `geohist/guide.html` - footer Contact anchors → /geohist/contact.html; FAQ report + deletion entries
- `css/base.css` - .form-field / .form-status / .hp-field styles on existing theme tokens
- `js/firebase-config.js` - canonical measurementId G-KDWVVHRYD5
- `js/i18n/es.json`, `js/i18n/pt-BR.json` - contact.* namespace + geohist.faq.deletion.q/a, 141-key 1:1 surface
- `scripts/i18n-keycheck.mjs` - pages list += geohist/contact.html
- `scripts/smoke-check.sh` - URL list += /geohist/contact.html

## Decisions Made

- Rules deployed via merge path: project geohist-trivia already had a Firestore ruleset, so owner merged the match /messages block into it (existing app rules preserved) and published — repo file remains the source of truth; future rule edits require a console re-paste (noted for Phase 5)
- Live/Playground batteries transferred to phase UAT instead of claimed (honest close-out, 04-01 precedent); case-1-equivalent live proof now awaits the owner's first real form submit
- measurementId G-KDWVVHRYD5 canonical per owner console reading; pre-existing working-tree edit at plan start resolved as owner-owned and correct

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Wrong measurementId in committed Firebase config**
- **Found during:** Task 3 checkpoint (owner console verification)
- **Issue:** js/firebase-config.js carried G-DV1M5N0EY5; owner confirmed canonical GA4 property measurementId is G-KDWVVHRYD5 — wrong ID would send analytics events into the void
- **Fix:** Committed the canonical ID
- **Files modified:** js/firebase-config.js
- **Verification:** Deploy run 33704909374 green; live /js/firebase-config.js serves the canonical value
- **Committed in:** 8993c77

### Pending Human Verification (transferred to UAT — NOT claimed passed)

**2. Rules Playground battery cases 1-6 and live submit battery cases 7-10 are PENDING**
- **What:** Playground: (1) 5-field create ALLOW; (2) name-less create ALLOW ×4 topic values; (3) extra field DENY; (4) bad/missing topic DENY; (5) 5001-char message / 255-char email DENY; (6) get/update/delete DENY. Live: (7) submit after Accept → doc with server timestamp + exact field set; (8) fresh session after Reject → still succeeds; (9) honeypot submit → success shown, no doc; (10) double-click → exactly one doc
- **Status:** Owner replied "continue" without results — NOT run, NOT claimed passed. Rules are merged-and-published per owner, so the case-1-equivalent live create proof awaits the owner's first real submit
- **Transfer:** Recorded as coverage deliverables D4/D5 (human_judgment: true) and windows ledger entry #6 (open, unrun-verify); phase verification (VERIFICATION.md human_verification / UAT) surfaces them as human_needed
- **In-repo equivalents passing:** rules-file structural assertions (single create-allow, deny line, hasOnly, enum, caps, absent-or-string guard, request.time) + contact.js behavioral pins + validate chain — see Self-Check

---

**Total deviations:** 1 auto-fix (measurementId) + 1 pending-verification transfer
**Impact on plan:** Code-level scope fully delivered and in-repo-verified; the server-side and live proofs of FIRE-04/FIRE-05 are explicitly carried into phase UAT rather than asserted.

## Issues Encountered

- Firestore already existed in the project (plan assumed a fresh production-mode create) — owner resolved by merging the repo rules block into the existing ruleset; documented above
- In close-out battery, two initial assertion failures were battery-script bugs, not site bugs (deny line `allow read, update, delete: if false` counted as an allow; script srcs are root-absolute `/js/...`) — assertions corrected, all checks then pass; no site code changed

## User Setup Required

**All console prerequisites resolved (owner-confirmed):**
- ✅ Anonymous sign-in provider enabled (with auto-clean-up)
- ✅ persano.github.io confirmed in Authentication → Authorized domains
- ✅ Firestore present (pre-existing) — repo match /messages block MERGED into existing ruleset and PUBLISHED
- ⬜ Pending live proof: Rules Playground battery + live submit battery (see Pending Human Verification)

## Next Phase Readiness

- Phase 4 complete (2 of 2 plans): consent gate + Analytics + contact form + deletion path all live
- Open verification debt for phase UAT: 04-01 live 6-check battery (D5 there), 04-02 Rules Playground battery (D4) + live submit battery (D5 here) — all human-needed, windows ledger #5 and #6 open
- Known deferred: owner review of ES/pt-BR translations (D-39 pattern), App Check enforcement (FIRE-07, v2), console rules re-paste on any future rules-file edit
- Ready for phase verification, then Phase 5 (real screenshots, SEO/JSON-LD, AA audit)

---
*Phase: 04-consent-gate-firebase-analytics-contact-form*
*Completed: 2026-09-03*

## Self-Check: PASSED (in-repo scope)

Verified before commit:
- All key files exist on disk: geohist/contact.html, js/contact.js, firebase/firestore.rules, scripts/i18n-keycheck.mjs, scripts/smoke-check.sh, this SUMMARY — 6/6 FOUND
- All task commits exist in git history: cff7d08, eca2237, 6dc2b56, 21f8509, 8993c77 — 5/5 FOUND
- `npm run validate` (html-validate + linkinator + i18n-keycheck) exit 0 — 141-key 1:1 surface in both dictionaries — PASS
- Close-out node battery: rules single non-false allow + deny line + hasOnly + topic enum + name guard + request.time; contact.js consent=0 / firebase-analytics=0 / all pins; firebase-analytics isolated to js/consent.js; contact.html 4-script locked order + honeypot (aria-hidden + tabindex=-1) + banner; D-48 anchors ×3 + deletion FAQ + preserved mailto (About-dev, privacy.html); smoke URL — ALL PASS
- Live spot-check: /geohist/contact.html 200, /js/contact.js 200, /firebase/firestore.rules 200
- **Explicitly NOT verified (pending human):** Rules Playground cases 1-6 + live submit battery cases 7-10 — recorded as coverage D4/D5 (human_judgment: true), windows ledger #6 open; transfers to phase UAT
