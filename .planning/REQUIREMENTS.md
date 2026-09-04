# Requirements: Persano Hub + GeoHist Trivia Site

**Defined:** 2026-09-01
**Core Value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel — before the app goes live on Google Play.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Compliance

- [x] **CMPL-01**: Privacy policy lives at `/geohist/privacy.html` — public, non-PDF, English, reachable from every page footer
- [x] **CMPL-02**: Privacy policy names every SDK in actual use (AdMob, Play Games Services, IAP, Firebase Analytics, contact-form Firestore) with contact mechanism and retention/deletion policy
- [x] **CMPL-03**: Data-deletion request path exists: FAQ entry + contact-form "data deletion" topic + documented manual process (Play requirement for Play Games sign-in)
- [x] **CMPL-04**: Policy wording mirrors FAQ and Play Data safety declarations (single source of truth, no contradictions)

### Landing

- [x] **LNDG-01**: `/geohist/` landing page renders hero: app name, tagline, description, app icon/logo
- [x] **LNDG-02**: Feature list section (categorized trivia, Play Games, offline mode, IAP) drafted from app README
- [x] **LNDG-03**: Screenshot gallery shows 3–6 real screenshots captured via ADB from a connected phone (WebP, lazy-load)
- [x] **LNDG-04**: Download/Play Store button present — placeholder href until listing live, trivially swappable
- [x] **LNDG-05**: Mobile-first responsive layout (primary traffic is phones)

### Content

- [x] **CONT-01**: FAQ section: data collection, offline capability, supported devices — mirrors privacy policy wording
- [x] **CONT-02**: Game guide on own page (`guide.html`): how to play, game modes
- [x] **CONT-03**: About-the-developer section: Santiago David Postorivo / Persano personal brand
- [x] **CONT-04**: Root hub (`/index.html`): Persano brand intro + app card for GeoHist; renders correctly with exactly one app, no visible placeholders
- [x] **CONT-05**: Custom 404 page, self-contained with link back to hub

### Internationalization

- [x] **I18N-01**: Site copy in English, Spanish, Portuguese (pt-BR); EN ships in raw HTML
- [x] **I18N-02**: Browser-language auto-detect applies translation in place — no redirects, no URL changes, EN fallback on any failure
- [x] **I18N-03**: Manual language switcher overrides detection; preference persists (localStorage)
- [x] **I18N-04**: `document.documentElement.lang` syncs with active language; `<title>`/meta description translate too

### Firebase

- [x] **FIRE-01**: GDPR consent banner: affirmative action required, never auto-dismisses, choice persisted with timestamp, retraction path available
- [x] **FIRE-02**: Firebase Analytics loads ONLY after consent grant — no Firebase script tag in any HTML; dynamic import post-grant; zero SDK bytes before consent
- [x] **FIRE-03**: Consent-gated events: Play badge clicks, language switches
- [x] **FIRE-04**: Contact form: labels, honeypot, client validation, success/error states; works after any consent choice (grant or deny)
- [x] **FIRE-05**: Form submits via anonymous auth (at submit-time only) to Firestore; create-only, schema-locked rules (field validation, length caps, server timestamps); rules file lives in repo
- [x] **FIRE-06**: Form supports "request data deletion" topic wired to CMPL-03 process

### Discovery & Quality

- [x] **SEO-01**: Meta titles/descriptions + canonical URLs on every page
- [x] **SEO-02**: Open Graph + Twitter cards with absolute URLs; og:image 1200×630
- [x] **SEO-03**: sitemap.xml + robots.txt (allow-all + sitemap line); sitemap submitted to Search Console
- [x] **SEO-04**: SoftwareApplication JSON-LD (name, operatingSystem ANDROID, GameApplication, offers price 0) — NO aggregateRating until real Play ratings exist
- [ ] **A11Y-01**: WCAG 2.1 AA audit as explicit final step: contrast (math-checked palette at design time), keyboard nav, focus states, form labels, axe/Lighthouse clean
- [x] **OPS-01**: GitHub Actions CI: validation job (html-validate + link check) gates Pages deploy
- [x] **OPS-02**: Deploy chain: checkout@v7 → configure-pages@v6 → upload-pages-artifact@v5 (`path: '.'`, `include-hidden-files: true`) → deploy-pages@v5; `.nojekyll` in first site commit
- [x] **OPS-03**: Live URL + privacy-policy URL verified 200 before Play submission; existing root files (`app-ads.txt`, Search Console verification) regress-checked after first deploy

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Expansion

- **I18N-05**: Remaining 17 localizations (JSON dictionaries scale cheaply — add when traffic justifies)
- **SEO-05**: aggregateRating + social proof strip (requires live Play listing data)
- **FIRE-07**: App Check enforcement (monitor mode metrics first, enforce post-launch)
- **CONT-06**: Changelog/updates page (once app updates exist)
- **HOST-01**: Custom domain + CNAME

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Per-language HTML subdirs (/es/, /pt/) | Resolved: JS dictionary swap chosen — Play search drives installs, subdirs' SEO advantage worthless, 3× file drift kills agent-maintenance |
| Android App Links / deep links | Informational site only; Play Store links suffice |
| Privacy policy translations | EN is legally authoritative version |
| SSG (Jekyll/Astro/Eleventy) | Zero-build deliberate; page count far below templating threshold |
| Real-time chat, comments, user accounts | Not core to landing value |
| aggregateRating in schema at launch | Fabricated ratings = structured-data spam; add with real data |
| Analytics/form blocking on consent-deny | Deletion-request path must survive "deny" — form is compliance surface |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMPL-01 | Phase 1 | Complete |
| CMPL-02 | Phase 1 | Complete |
| CMPL-03 | Phase 4 | Complete |
| CMPL-04 | Phase 2 | Complete |
| LNDG-01 | Phase 2 | Complete |
| LNDG-02 | Phase 2 | Complete |
| LNDG-03 | Phase 5 | Complete |
| LNDG-04 | Phase 2 | Complete |
| LNDG-05 | Phase 2 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| CONT-05 | Phase 1 | Complete |
| I18N-01 | Phase 3 | Complete |
| I18N-02 | Phase 3 | Complete |
| I18N-03 | Phase 3 | Complete |
| I18N-04 | Phase 3 | Complete |
| FIRE-01 | Phase 4 | Complete |
| FIRE-02 | Phase 4 | Complete |
| FIRE-03 | Phase 4 | Complete |
| FIRE-04 | Phase 4 | Complete |
| FIRE-05 | Phase 4 | Complete |
| FIRE-06 | Phase 4 | Complete |
| SEO-01 | Phase 5 | Complete |
| SEO-02 | Phase 5 | Complete |
| SEO-03 | Phase 5 | Complete |
| SEO-04 | Phase 5 | Complete |
| A11Y-01 | Phase 5 | Pending |
| OPS-01 | Phase 1 | Complete |
| OPS-02 | Phase 1 | Complete |
| OPS-03 | Phase 1 | Complete |

**Coverage:**

- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-01*
*Last updated: 2026-09-01 — traceability populated by roadmap creation*
