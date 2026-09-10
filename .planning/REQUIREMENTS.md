# Requirements: Persano — GeoHist Trivia Site (v2.0)

**Defined:** 2026-09-05
**Core Value:** GeoHist Trivia players and Google Play reviewers can reach an authoritative, accessible web page for the app — featuring it, explaining it, hosting its privacy policy, and offering a working contact channel — before the app goes live.

**Milestone focus:** Ship every v2-deferred item — 17 new localizations (incl. RTL), gated social proof, App Check, changelog page, custom domain.

## v2 Requirements

Continues requirement numbering from v1 (archived at `.planning/milestones/v1-REQUIREMENTS.md`; v1 shipped 27/27).

### Changelog

- [x] **CONT-06**: Visitor can view app changelog at `/geohist/changelog.html` — newest-first, ISO dates, Keep-a-Changelog format, EN entries (documented i18n exception: chrome keyed, entries stay EN)
- [x] **CONT-07**: Changelog page chrome is i18n-keyed; `i18n-keycheck.mjs` `pages` array entry red-gate tested; sitemap + nav/footer links added; es/pt-BR dictionaries gain `changelog.*` keys atomically with the page

### Localization ×20

- [x] **I18N-05**: Visitor browsing in any of the 17 new languages (hi, zh, fr, vi, nl, ur, el, ko, tr, de, ja, ru, id, pl, it, bn, ar) sees site text in their language — 17 JSON dictionaries at exact key parity with the live 146+changelog-key surface, CI-gated; agent-drafted in waves of 3–4 languages with per-language register table + app-`strings.xml` glossary + two-pass drafting
- [x] **I18N-06**: Language detection handles all 20 locale tags — data-driven prefix table replacing hardcoded pt/es checks (legacy `in-*`→id, `zh-*`→zh Simplified, es/pt preserved), unit tested
- [x] **I18N-07**: RTL visitors (ar, ur) get properly mirrored layout — `dir` switching inside `i18n.js` applyLanguage pass, `[dir="rtl"]` CSS override block, bidi isolation, per-language line-height overrides (Urdu Nastaliq ~2, CJK ~1.7)
- [x] **I18N-08**: Language switcher presents 20 endonyms as a select/menu (no long inline list), persists choice to `persano.lang`
- [x] **I18N-09**: Key-parity gate hardened: empty-value rejection + CJK half-width punctuation grep check

### Custom Domain

- [x] **HOST-01**: Site serves at owner-registered custom domain with HTTPS — GitHub Pages repo-Settings config (no CNAME file under Actions publishing), DNS (apex A×4 + AAAA×4, www CNAME, TXT verification), cert verified BEFORE rewrite; console allowlists (Firebase Auth authorized domains, API-key HTTP-referrer restriction, reCAPTCHA domain list, Search Console property) updated BEFORE URL rewrite
- [x] **HOST-02**: All 42 hardcoded absolute URLs rewritten in one commit (canonical, og:url, sitemap.xml, robots.txt, JSON-LD URLs, smoke-check BASE, linkinator skips) — zero mixed-domain refs, grep-verified; github.io dual-hosts then redirects
- [x] **HOST-03**: Sitemap resubmitted to Google Search Console post-migration (owner console step)

### App Check

- [x] **FIRE-07**: Contact form protected by Firebase App Check in monitoring mode — `initializeAppCheck` as 4th lazy CDN module in `contact.js` submit path, init before auth/firestore; zero reCAPTCHA bytes in served HTML (submit-time load only); zero user-visible change; provider decision (reCAPTCHA v3 vs Enterprise, billing tradeoff) recorded in-phase
- [x] **FIRE-08**: App Check token-failure UX — dedicated `contact.status.appcheck` status node with email fallback + Analytics token-failure event
- [x] **FIRE-09**: Enforcement flip is a documented owner console step, gated on successful-submission count evidence (never calendar-based); per-product (Firestore + Auth), reversible; monitoring ritual defined with owner-agreed threshold
- [x] **CMPL-05**: Privacy policy mentions reCAPTCHA/App Check (consent interplay nuance)

### Social Proof

- [x] **SEO-05**: Facts-based social proof strip on landing page (20 localizations, offline-capable, game modes) — verifiable facts only, no fabricated ratings
- [x] **SEO-06**: Tier-1 gated proof row ("Rated X.X ★ on Google Play" visible text + attributed link) — template ships off; owner flips when Play listing is live with real ratings
- [x] **SEO-07**: aggregateRating JSON-LD (Tier-2) stays permanently off unless an on-site review source exists — Google review-snippet policy bars aggregating ratings from other websites; documented precondition

## Future Requirements

Tracked but not in current roadmap.

- **I18N-10**: Per-language static HTML subdirs + hreflang — revisit only with a crawlability case (currently anti-pattern at this architecture)
- **FIRE-10**: App Check enforcement flip execution (owner console, post-monitoring)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Per-language HTML subdirs + hreflang | Anti-pattern for dictionary-swap single-URL architecture — 120 files of duplicate markup, ×20 maintenance |
| Translated changelog entries (×20) | Human-curated EN entries; translating content ×20 is unmaintainable |
| Geo-IP language redirects | Detect via `navigator.languages` only; no server-side sniffing on Pages |
| Auto-translate widgets | Unacceptable quality/privacy tradeoff |
| aggregateRating mirroring Google Play ratings | Review-snippet policy violation regardless of data being real — permanent exclusion unless on-site review source appears |
| Fabricated star ratings / placeholder reviews | Structured-data spam risk; manual actions |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-06 | Phase 6 | Complete |
| CONT-07 | Phase 6 | Complete |
| I18N-05 | Phase 7 | Complete |
| I18N-06 | Phase 7 | Complete |
| I18N-07 | Phase 7 | Complete |
| I18N-08 | Phase 7 | Complete |
| I18N-09 | Phase 7 | Complete |
| HOST-01 | Phase 8 | Complete |
| HOST-02 | Phase 8 | Complete |
| HOST-03 | Phase 8 | Complete |
| FIRE-07 | Phase 9 | Complete |
| FIRE-08 | Phase 9 | Complete |
| FIRE-09 | Phase 9 | Complete |
| CMPL-05 | Phase 9 | Complete |
| SEO-05 | Phase 10 | Complete |
| SEO-06 | Phase 10 | Complete |
| SEO-07 | Phase 10 | Complete |

**Coverage:**

- v2 requirements: 17 total
- Mapped to phases: 17 ✓ (Phases 6-10, milestone v2.0)
- Unmapped: 0

---
*Requirements defined: 2026-09-05*
*Last updated: 2026-09-05 after v2.0 roadmap creation (phases 6-10 assigned)*
