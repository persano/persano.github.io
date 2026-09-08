# Roadmap: Persano — Personal Apps Hub + GeoHist Trivia Site

## Milestones

- ✅ **v1 MVP** — Phases 1-5 (shipped 2026-09-05)
- 🚧 **v2.0 Full Deferred Scope** — Phases 6-10 (in progress)

## Phases

<details>
<summary>✅ v1 MVP (Phases 1-5) — SHIPPED 2026-09-05</summary>

- [x] Phase 1: Foundation — Deploy Pipeline, Skeleton, Privacy Policy (2/2 plans) — completed 2026-09-02
- [x] Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in) (2/2 plans) — completed 2026-09-02
- [x] Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher (2/2 plans) — completed 2026-09-02
- [x] Phase 4: Consent Gate + Firebase (Analytics + Contact Form) (2/2 plans) — completed 2026-09-03
- [x] Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit (4/4 plans) — completed 2026-09-05

Full details: [.planning/milestones/v1-ROADMAP.md](milestones/v1-ROADMAP.md)

</details>

### 🚧 v2.0 Full Deferred Scope (Phases 6-10)

**Milestone Goal:** Ship every v2-deferred item — 17 new localizations (incl. RTL), gated social proof, App Check, changelog page, custom domain.

- [x] **Phase 6: Changelog Page** - `/geohist/changelog.html` with keyed chrome, atomic dictionary keys, CI red-gate proof (completed 2026-09-06)
- [x] **Phase 7: Localization ×20 + RTL** - 17 new dictionaries at exact key parity plus engine/detection/switcher/RTL layout work (completed 2026-09-07)
- [x] **Phase 8: Custom Domain Migration** - Owner domain live on Pages: cert-first, console-allowlists-before-rewrite, zero mixed-domain refs (completed 2026-09-07)
- [ ] **Phase 9: App Check, Monitor-First** - Invisible bot protection on the contact form; enforcement as evidence-gated owner console step
- [ ] **Phase 10: Gated Social Proof** - Facts-only proof strip now; Tier-1/Tier-2 rating templates shipped OFF, gated on real Play data

## Phase Details

### Phase 6: Changelog Page

**Goal**: Visitors can read the app's update history at a stable URL, with page chrome presented in their chosen language
**Depends on**: Nothing (first phase of v2.0; builds on shipped v1 architecture)
**Requirements**: CONT-06, CONT-07
**Success Criteria** (what must be TRUE):

  1. Visitor opening `/geohist/changelog.html` sees entries newest-first with ISO dates in Keep-a-Changelog format (entries stay EN — documented i18n exception)
  2. Visitor browsing in es or pt-BR sees the changelog chrome (nav, headings, back links) in their language
  3. Changelog is reachable from every existing page via nav/footer links and listed in `sitemap.xml`
  4. A dictionary missing `changelog.*` keys — or an unregistered keycheck `pages` entry — fails CI (red-gate proven)

**Plans**: 3/3 plans executed + 1 gap-closure plan
Plans:
**Wave 1**

- [x] 06-01-PLAN.md — Keyed-chrome changelog page + atomic i18n key wiring (page, navs/footers, dictionaries, keycheck registration) + red-gate proof

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 06-02-PLAN.md — App-repo-mined curated 0.x backfill (4-6 owner-reviewed entries) shipped into the page

**Wave 3** *(gap closure: G-06-9, owner decision "Notice only")*

- [x] 06-03-PLAN.md — Translated entries-language notice on changelog + trilingual keyless notice on privacy (closes UAT test 9)

**UI hint**: yes

### Phase 7: Localization ×20 + RTL

**Goal**: Visitors in any of the app's 20 supported languages see the whole site in their language, with properly mirrored layout for RTL readers
**Depends on**: Phase 6 (changelog keys must exist before ×20 expansion, or all 20 dictionaries re-trigger a parity sweep)
**Requirements**: I18N-05, I18N-06, I18N-07, I18N-08, I18N-09
**Success Criteria** (what must be TRUE):

  1. Visitor with browser language among the 17 new locales is auto-detected and sees all pages translated (17 dictionaries at exact key parity with the live 146+changelog surface)
  2. Arabic/Urdu visitors see a mirrored RTL layout with bidi isolation and script-appropriate line-height (Urdu ~2, CJK ~1.7)
  3. Legacy/edge locale tags detect correctly: `in-*` → id, `zh-*` → zh Simplified, es/pt behavior unchanged (unit-tested prefix table)
  4. Language switcher presents all 20 endonyms as a compact select/menu and persists choice to `persano.lang`
  5. CI gate rejects any dictionary with missing keys, empty values, or CJK half-width punctuation — across all 20 dictionaries

**Plans:** 6/6 plans complete

- [x] 07-01-engine-rtl-switcher-gate-PLAN.md
- [x] 07-02-dicts-wave1-hi-de-fr-ru-PLAN.md
- [x] 07-03-dicts-wave2-ja-ko-tr-id-PLAN.md
- [x] 07-04-dicts-wave3-it-pl-nl-vi-PLAN.md
- [x] 07-05-dicts-wave4-el-bn-ar-ur-zh-PLAN.md
- [x] 07-06-faq-languages-count-PLAN.md — Gap G-07-5a: FAQ languages answer count-style (EN + 19 dicts)

**Wave 1** *(engine + RTL + switcher + gate hardening)*

- [x] 07-01-PLAN.md — Detect prefix table + tests, select switcher, dir switching, RTL/line-height CSS, keycheck hardening

**Waves 2–5** *(dictionaries, market-size order per D-05: glossary mining + two-pass drafting + gate, one atomic commit per wave)*

- [x] 07-02-PLAN.md — Dicts W1: hi, de, fr, ru (+ i18n-surface.mjs helper)
- [x] 07-03-PLAN.md — Dicts W2: ja, ko, tr, id
- [x] 07-04-PLAN.md — Dicts W3: it, pl, nl, vi
- [x] 07-05-PLAN.md — Dicts W4: el, bn, ar, ur, zh

**UI hint**: yes

### Phase 8: Custom Domain Migration

**Goal**: The site serves at the owner's custom domain over HTTPS with every Firebase integration and SEO surface intact through the migration
**Depends on**: Phase 7 (domain rewrite is a mechanical pass over final content; no locale PR may reintroduce old-domain strings)
**Requirements**: HOST-01, HOST-02, HOST-03
**Success Criteria** (what must be TRUE):

  1. Site loads at the custom domain (apex + www) with a verified HTTPS certificate; github.io dual-hosts then redirects (Pages 301)
  2. Zero mixed-domain references: canonical, og:url, `sitemap.xml`, `robots.txt`, JSON-LD, smoke-check BASE, linkinator skips — all 42 refs rewritten in one commit, grep-verified
  3. Contact form works at the new domain: Firebase Auth authorized domains, API-key HTTP-referrer allowlist, reCAPTCHA domain list, and Search Console property all updated BEFORE the URL rewrite (cert verified before rewrite too)
  4. Owner resubmits the sitemap to Google Search Console under the new property post-migration

**Plans**: 3/3 plans executed (owner DNS + registration already largely live per research; owner console steps parallelizable from day 1 via 08-RUNBOOK.md)

Plans:
**Wave 1**

- [x] 08-01-infra-verify-runbook-PLAN.md — re-verify live Pages/DNS state, gh-CLI HTTPS enforce flip, owner runbook + blocking owner gate (HOST-01)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 08-02-rewrite-ci-gate-PLAN.md — atomic 44-ref rewrite + permanent CI old-domain gate + smoke green on apex (HOST-02)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 08-03-gsc-post-migration-PLAN.md — final sweep + owner GSC sitemap resubmit + Change of Address (HOST-03)

**UI hint**: no

### Phase 9: App Check, Monitor-First

**Goal**: The contact form gains bot protection that is invisible to real users, with enforcement deferred until submission-count evidence says it is safe
**Depends on**: Phase 8 (reCAPTCHA site key is domain-allowlisted — register once against the final domain)
**Requirements**: FIRE-07, FIRE-08, FIRE-09, CMPL-05
**Success Criteria** (what must be TRUE):

  1. Form submissions succeed with zero user-visible change while App Check runs in monitoring mode (`initializeAppCheck` as 4th lazy CDN module in `contact.js` submit path, init before auth/firestore; zero reCAPTCHA bytes in served HTML)
  2. A token-failure visitor sees a dedicated `contact.status.appcheck` status message with an email fallback — never a dead form
  3. App Check token-failure Analytics event fires (consent-gated), giving the owner metrics for the enforcement decision
  4. Enforcement flip is documented as a per-product (Firestore + Auth), reversible owner console step gated on successful-submission count — never calendar-based — with an owner-agreed monitoring threshold; provider decision (reCAPTCHA v3 vs Enterprise) recorded in-phase
  5. Privacy policy mentions reCAPTCHA/App Check and its consent interplay

**Plans**: 3/3 plans executed (09-01 + 09-02 executed; 09-03 gap closure for G-09-2)
Plans:

- [x] 09-01-PLAN.md — App Check gate end-to-end: 4th lazy module + getToken seam + catch mapping + consent-gated event; i18n key #171 atomic across 19 dictionaries (FIRE-07, FIRE-08)
- [x] 09-02-PLAN.md — 09-RUNBOOK.md owner console chain (register → activate → weekly ritual → evidence-gated per-product flip) + privacy.html reCAPTCHA/App Check disclosure (FIRE-09, CMPL-05)
- [x] 09-03-PLAN.md — G-09-2 gap closure: Enterprise provider swap + site-key activation + Enterprise docs (COVERAGE/RUNBOOK/privacy) + deploy (FIRE-07, FIRE-08)

**UI hint**: yes

### Phase 10: Gated Social Proof

**Goal**: The landing page proves credibility with verifiable facts today, with templates ready to flip the moment real Play ratings exist — never fabricating ratings
**Depends on**: Phase 8 (avoid conflicting edits to `geohist/index.html` around the URL rewrite); externally gated on Play listing going live
**Requirements**: SEO-05, SEO-06, SEO-07
**Success Criteria** (what must be TRUE):

  1. Landing page shows a facts-only social-proof strip (20 localizations, offline-capable, game modes) — every claim verifiable on-site
  2. "Rated X.X ★ on Google Play" Tier-1 proof row exists in markup shipping OFF, with attributed link template; owner flips it when the listing is live with real ratings
  3. aggregateRating JSON-LD (Tier-2) stays permanently OFF with documented precondition (an on-site review source must exist) — never mirrors Play ratings
  4. Live structured data passes Google review-snippet policy — no fabricated ratings or placeholder reviews anywhere

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:** Phases execute in numeric order: 6 → 7 → 8 → 9 → 10

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-09-02 |
| 2. GeoHist Landing + Hub | v1.0 | 2/2 | Complete | 2026-09-02 |
| 3. i18n Engine + Dictionaries | v1.0 | 2/2 | Complete | 2026-09-02 |
| 4. Consent Gate + Firebase | v1.0 | 2/2 | Complete | 2026-09-03 |
| 5. Discovery & Quality | v1.0 | 4/4 | Complete | 2026-09-05 |
| 6. Changelog Page | v2.0 | 3/3 | Complete    | 2026-09-06 |
| 7. Localization ×20 + RTL | v2.0 | 6/6 | Complete    | 2026-09-07 |
| 8. Custom Domain Migration | v2.0 | 3/3 | Complete    | 2026-09-07 |
| 9. App Check, Monitor-First | v2.0 | 3/3 | In Progress|  |
| 10. Gated Social Proof | v2.0 | 0/? | Not started | - |

---
*Roadmap created: 2026-09-05 (milestone v2.0 — continues numbering from v1's Phase 5)*
