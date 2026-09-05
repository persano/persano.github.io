# Milestones

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

---
