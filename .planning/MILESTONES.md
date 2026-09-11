# Milestones

## v2.0 Full Deferred Scope (Shipped: 2026-09-11)

**Phases completed:** 6 phases, 22 plans, 39 tasks

**Key accomplishments:**

- `/geohist/changelog.html` shipped end-to-end: keyed chrome + git-verified 0.88 entry, key surface grown 146→169 atomically under the gate, full reachability wired, red gate proven both directions — plus repaired a vacuous validate:links gate.
- Full curated 0.x arc shipped onto the changelog page: 6 git-verified milestone entries (0.88 → 0.2, 2026-09-04 → 2026-08-24) replacing the provisional single entry, with zero key-surface drift — plus an owner-review draft with a git-provenance appendix.
- One keyed translated notice on the changelog (170-key atomic surface move) + a static EN—ES—PT notice line on the scriptless privacy page — closing UAT test 9 with zero scripts added.
- HTTPS enforcement flipped on geohisttrivia.com via one minimal gh PUT (cert pre-verified approved, GET-after-PUT proof) and a 9-section owner runbook authored with the divergence-ruled TXT re-add flow — owner gate (6 items) now open.
- One-pass apex migration authored and locally proven: 44 refs rewritten across 14 files (39 functional + 5 prose, path-preserved 1:1), permanent zero-dep CI gate proven RED→GREEN in both directions, validate chain green end-to-end — commit, push, CI watch, and live smoke deferred to orchestrator Task 3.
- Sitemap resubmitted + Change of Address filed old→new in the new GSC Domain property after a 12-row probe battery went green — live form test at geohisttrivia.com closes HOST-03.
- Firebase App Check wired as the 4th lazy submit-time CDN module in contact.js (monitoring mode, dormant pre-activation) with the getToken failure seam, contact.status.appcheck email-fallback status (i18n key #171 across 19 dictionaries, atomic), and the consent-gated appcheck_token_failure Analytics event.
- Owner App Check runbook (register → activate → weekly ritual → evidence-gated per-product flip with rollback, zero secrets) plus the privacy-policy reCAPTCHA/App Check disclosure with its consent-interplay sentence — zero code changes.
- Firebase deprecated the classic reCAPTCHA provider, so the shipped App Check code was swapped to ReCaptchaEnterpriseProvider, the site key was activated, docs were revised to Enterprise reality (D-01 revised 2026-09-08), and the phase-9 tree went live on prod with smoke green.
- Contact-form token failures are now bounded (~10s) and deliver-anyway — the message lands un-attested while the keyed appcheck status and consent-gated event fire — and the site ships a favicon.ico with icon links on all 7 pages, deployed green with prod smoke passing.
- A bounded ~3s reCAPTCHA reachability probe now skips App Check entirely when reCAPTCHA is unreachable — blocked-reCAPTCHA (ad-blocker) submits deliver un-attested in ~10s with the keyed appcheck status and the consent-gated event, instead of the ~60s auth-family generic error with no delivery — deployed green with prod smoke passing.
- 4-pill facts strip + OFF-gated "Rated X.X on Google Play" row on geohist/index.html — 7 keyed i18n entries live in all 19 dictionaries (171 → 178), validate chain green, red gate proven both directions
- Tier-2 aggregateRating permanently OFF via inert in-file comment + owner runbook (10-RUNBOOK.md), and Phase 10 shipped: prod serves the 4-pill strip, the hidden OFF rating row, and a byte-identical JSON-LD schema with zero rating literals
- AGENTS.md hand-rewritten to shipped v2.0 reality (F-1) and the old-domain gate flipped from allowlisting the doc to enforcing it — enforcement proven by a mutation probe (probe line → exit 1 naming AGENTS.md:166 → byte-identical restore → exit 0); full validate battery green.

---

## v1 MVP (Shipped: 2026-09-05)

**Phases completed:** 5 phases, 12 plans, 30 tasks

**Key accomplishments:**

- Minimal Persano hub + self-contained 404 + Play-critical English privacy policy at /geohist/privacy.html with owner-supplied facts, all committed locally.
- Two-job gated CI pipeline (html-validate + linkinator → official Pages chain) deployed the site live at https://persano.github.io — push is now the only deploy step, with smoke checks 6/6 green.
- Dark antique re-theme of the shared stylesheet plus a complete keyed English /geohist/ landing page — hero with real Play-badge CTA, four feature categories, gallery skeleton, 8-item policy-verbatim FAQ, About-dev — with data-i18n keys on every visible string for Phase 3.
- Site's first and only JavaScript — a dependency-free classic-script i18n engine (`/js/i18n.js`) that snapshots shipped EN, auto-detects es/pt-BR from `navigator.languages`, fetches a same-origin 102-key es-419 dictionary, and swaps keyed text/attrs in place with lang/title/meta sync, plus a footer endonym switcher persisting to `persano.lang`, and a mechanical key-coverage gate proving dictionary ↔ markup parity.
- Completed the trilingual surface — a 102-key pt-BR dictionary key-identical with es.json (hub 12 / geohist 53 / guide 37), the `validate:i18n` dictionary-parity gate wired into `npm run validate` so dictionary↔markup drift now fails CI, and the full-site cross-page regression battery (19/19 PASS) with a clean deploy handoff for the orchestrator's single controlled push.
- GDPR consent gate (fail-closed store, Accept/Reject banner, footer retraction) on the 3 engine-carrying pages with Firebase Analytics loading exclusively via dynamic import after grant — real Web App config live on https://persano.github.io, both FIRE-03 events wired, zero vendor bytes pre-consent enforced structurally.
- /geohist/contact.html with a consent-choice-independent submit pipeline (honeypot → pre-network validation → lazy anonymous auth → create-only schema-locked Firestore `messages` writes) live on https://persano.github.io, completing the CMPL-03 data-deletion request path — Rules Playground + live batteries honestly carried to phase UAT as pending human verification.
- Real device-captured game screenshots (4 feature groups, owner-approved via ADB checkpoint) shipped as lean WebPs through a re-runnable sharp converter, replacing the placeholder gallery with keyed, lazy-loaded tiles across EN markup + es/pt-BR dictionaries — LNDG-03 complete in code.
- Every content page now carries a complete static-EN discovery block (canonical == og:url, absolute URLs, 1200x630 brand og-image) with the corrected rich-result SoftwareApplication JSON-LD on /geohist/ only, plus a 5-URL sitemap and allow-all robots.txt — SEO-01..04 complete in code.
- Scripted axe + Lighthouse AA battery green 5/5 pages (LH a11y 100 everywhere, zero critical/serious violations) with palette tokens byte-verified; owner keyboard/form/language battery items 1–3 PASS, item 4 + D-69/D-70 console steps honestly carried as post-ship human debt.
- 4 gallery WebPs regenerated from owner-captured banner-free raws via Option-C device state — asset-only commit 941f2cd, zero HTML/JSON-LD/dictionary change; Task 3 (push + smoke + live re-check) checkpoint open

**Stats:** 2026-09-01 → 2026-09-05 (4 days) · 27/27 v1 requirements validated · UAT final 8/8 pass (G-05-1 gap closed by 05-04) · verification 27/27 must-haves · zero runtime deps beyond Firebase CDN
**Closeout:** verified_closeout — artifact audit clear (0 open, 0 suppressed)

---
