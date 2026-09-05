# Roadmap: Persano — Personal Apps Hub + GeoHist Trivia Site

## Overview

From empty-ish repo (privacy policy files + Search Console verification) to a live, compliance-critical app landing site. Phase 1 stands up the deploy pipeline and ships the Play-critical privacy policy URL first — the site's reason to exist is a release dependency of GeoHist Trivia. Phase 2 fills in the full English landing + hub content with `data-i18n` keys baked into the markup from the start. Phase 3 adds the i18n engine and ES/pt-BR dictionaries (locked decision: JS dictionary swap, no per-language subdirs). Phase 4 delivers the GDPR consent gate, Firebase Analytics behind it, and the contact form last among features — working after any consent choice, completing the data-deletion request path. Phase 5 closes out discovery and quality once URLs are final: real screenshots, full SEO, JSON-LD, and the WCAG 2.1 AA audit as the explicit gate before Play submission.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation — Deploy Pipeline, Skeleton, Privacy Policy** - CI deploy chain live; Play-critical `/geohist/privacy.html` returning 200 (completed 2026-09-02)
- [x] **Phase 2: GeoHist Landing + Hub Content (EN)** - Full English landing, FAQ, guide, hub; `data-i18n` keys in all markup (completed 2026-09-02)
- [x] **Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher** - In-place language swap with auto-detect, switcher, EN fallback (completed 2026-09-02)
- [x] **Phase 4: Consent Gate + Firebase (Analytics + Contact Form)** - Consent banner gating Analytics; form works after any consent choice (completed 2026-09-03)
- [x] **Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit** - Real screenshots, full SEO, schema, WCAG 2.1 AA audit gate (completed 2026-09-04)

## Phase Details

### Phase 1: Foundation — Deploy Pipeline, Skeleton, Privacy Policy

**Goal**: Site is live at https://persano.github.io via push→CI→Pages, with the Play-critical privacy policy URL returning 200 and existing root files regression-checked
**Mode:** mvp
**Depends on**: Nothing (first phase). Manual prerequisite: Repo Settings → Pages → Source: GitHub Actions (one-time, before first deploy)
**Requirements**: OPS-01, OPS-02, OPS-03, CMPL-01, CMPL-02, CONT-05
**Success Criteria** (what must be TRUE):

  1. Visiting https://persano.github.io serves a minimal hub skeleton with shared `base.css`; unknown paths serve a self-contained 404 page linking back to the hub
  2. https://persano.github.io/geohist/privacy.html returns 200 — public, non-PDF, English policy naming the entity, contact mechanism, retention/deletion policy, and every SDK in actual use (AdMob, Play Games Services, IAP, Firebase Analytics, contact-form Firestore)
  3. Footer on deployed pages links to `/geohist/privacy.html`
  4. Push to main triggers CI validation then Pages deploy with no manual steps; `.nojekyll` survives the artifact upload (hidden files not silently dropped)
  5. Existing root files (`app-ads.txt`, Search Console verification) still return 200 after the first deploy

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Walking skeleton content slice: minimal hub + base.css + self-contained 404 + .nojekyll + complete EN privacy policy (owner-facts checkpoint) + superseded-file disposition (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — CI validate→deploy workflow (4-action chain), Pages-source checkpoint, single push → live deploy → OPS-03 smoke checks (wave 2)

### Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in)

**Goal**: Players and prospective players can learn about GeoHist Trivia from a complete English landing site; the hub introduces the Persano brand with exactly one app card
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: LNDG-01, LNDG-02, LNDG-04, LNDG-05, CONT-01, CONT-02, CONT-03, CONT-04, CMPL-04
**Success Criteria** (what must be TRUE):

  1. `/geohist/` renders the hero (app name, tagline, description, icon), categorized feature list drafted from the app README, and FAQ (data collection, offline, devices) whose wording mirrors the privacy policy
  2. `/geohist/guide.html` explains how to play and game modes; the About-the-developer section presents Santiago David Postorivo / Persano
  3. Download/Play Store button is visible with a placeholder href — visually final, swappable in one place when the listing goes live
  4. All pages render correctly at phone widths (mobile-first responsive)
  5. Root hub shows Persano brand intro + a single GeoHist app card with no visible placeholders; all new markup carries `data-i18n` keys, and the palette passes contrast math (4.5:1/3:1) at design time

**Plans:** 2/2 plans complete

**Wave 1**

- [x] 02-01-PLAN.md — Dark antique theme + GeoHist landing: hero, categorized features, gallery skeleton, policy-mirrored FAQ, About-dev, Play badge, nav/footer — data-i18n keys baked (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — guide.html (how to play + game modes) + full hub (brand intro + single app card) + cross-page regression & deploy handoff (wave 2)

### Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher

**Goal**: Spanish and pt-BR visitors read the site in their language with no URL changes or redirects; English always remains the safe, indexable fallback
**Mode:** mvp
**Depends on**: Phase 2 (markup already carries `data-i18n` keys)
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04
**Success Criteria** (what must be TRUE):

  1. A browser set to Spanish or pt-BR sees translated copy on the hub and GeoHist pages, applied in place — no redirects, no URL changes
  2. The manual language switcher overrides auto-detection, and the choice persists across visits (localStorage)
  3. A non-matching browser language or any dictionary fetch failure falls back to the shipped English content
  4. `document.documentElement.lang` matches the active language, and page `<title>`/meta description translate too

Plans: 2/2 plans executed

**Wave 1**

- [x] 03-01-PLAN.md — i18n engine (detect → fetch → in-place swap, EN snapshot fallback, lang/title/meta sync, persano:langchange) + complete es-419 dictionary (102 keys) + page wiring (script tags, keyed metas) + scripts/i18n-keycheck.mjs key-coverage gate (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md — pt-BR dictionary (key-identical, 102 keys) + validate:i18n CI gate wiring + cross-page regression battery & deploy handoff (wave 2)

### Phase 4: Consent Gate + Firebase (Analytics + Contact Form)

**Goal**: GDPR-compliant consent gates Firebase Analytics (zero SDK bytes before grant); a working contact form submits via anonymous auth to Firestore after any consent choice and completes the data-deletion request path
**Mode:** mvp
**Depends on**: Phases 1, 2, 3 (deployed pages to instrument; language-switch events). Manual prerequisites: Firebase Web App registered + `persano.github.io` authorized domain; Anonymous provider enabled; Firestore (production mode) created
**Requirements**: FIRE-01, FIRE-02, FIRE-03, FIRE-04, FIRE-05, FIRE-06, CMPL-03
**Success Criteria** (what must be TRUE):

  1. First visit shows a consent banner requiring affirmative action — never auto-dismisses; the choice is persisted with a timestamp and a retraction path works
  2. In a fresh incognito session, zero Firebase/Analytics network requests fire before consent; after grant, Play-badge clicks and language switches appear as consent-gated events
  3. The contact form validates input, catches honeypot submissions, and shows success/error states — and submits successfully after consent grant AND after deny
  4. Firestore accepts only schema-conformant creates (field validation, length caps, server timestamps) via create-only rules that live in the repo
  5. The form offers a "request data deletion" topic, completing the CMPL-03 path (FAQ entry + form topic + documented manual process)

Plans: 2/2 plans executed

**Wave 1**

- [x] 04-01-PLAN.md — Consent gate: banner (D-42..D-45) + timestamped storage + footer retraction + post-grant Analytics loader + FIRE-03 events on the 3 keyed pages, keys 1:1 both dicts (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 04-02-PLAN.md — /geohist/contact.html + form pipeline (honeypot -> validation -> anonymous auth -> Firestore) + create-only rules + CMPL-03 deletion path + D-48 link rewiring (wave 2)

### Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit

**Goal**: The site is discoverable, rich-result ready, and accessible, with real screenshots in the gallery — the WCAG 2.1 AA audit passes as the explicit gate before Play submission
**Mode:** mvp
**Depends on**: Phases 1, 2, 3, 4 (URLs must be final before sitemap/OG/schema enumerate them)
**Requirements**: LNDG-03, SEO-01, SEO-02, SEO-03, SEO-04, A11Y-01
**Success Criteria** (what must be TRUE):

  1. The gallery shows 3–6 real screenshots captured via ADB from a connected phone (WebP, lazy-load)
  2. Every page has meta title/description + canonical URL; OG/Twitter cards use absolute URLs with a 1200×630 og:image
  3. sitemap.xml and robots.txt are live (allow-all + sitemap line) and the sitemap is submitted to Search Console
  4. Rich Results Test shows SoftwareApplication JSON-LD (GameApplication, operatingSystem ANDROID, offers price 0) with NO aggregateRating
  5. axe/Lighthouse are clean; keyboard nav, focus states, and form labels pass WCAG 2.1 AA — re-checked after a language switch

Plans:

**Wave 1**

- [x] 05-01-PLAN.md — Real ADB screenshots: interactive capture with per-shot approval (D-52/D-53) + sharp WebP pipeline (D-54) + gallery replacement with keyed captions/alts, dict parity 146 keys (D-55/D-56) (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-02-PLAN.md — Discoverability: og-image generator (D-57..59) + canonical/OG/Twitter heads on 5 pages (D-66..68) + corrected SoftwareApplication JSON-LD (D-60..62) + sitemap.xml/robots.txt (D-63/D-64) + smoke-check extension (wave 2)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 05-03-PLAN.md — A11y AA gate: axe/Lighthouse battery (A11Y-01) + owner manual battery checkpoint + D-69 console steps + D-70 superseded-policy-file deletion in final deploy (wave 3)

**Gap closure** *(from 05-UAT G-05-1)*

- [x] 05-04-PLAN.md — G-05-1: owner ad-free activation + banner-free recapture of the 4 screens (D-52/D-53 framing) + asset-only reconvert/commit + orchestrator push + post-deploy smoke + owner live re-check (gap closure)

## Coverage

| Requirement | Phase |
|-------------|-------|
| OPS-01, OPS-02, OPS-03, CMPL-01, CMPL-02, CONT-05 | Phase 1 |
| LNDG-01, LNDG-02, LNDG-04, LNDG-05, CONT-01, CONT-02, CONT-03, CONT-04, CMPL-04 | Phase 2 |
| I18N-01, I18N-02, I18N-03, I18N-04 | Phase 3 |
| FIRE-01, FIRE-02, FIRE-03, FIRE-04, FIRE-05, FIRE-06, CMPL-03 | Phase 4 |
| LNDG-03, SEO-01, SEO-02, SEO-03, SEO-04, A11Y-01 | Phase 5 |

27/27 v1 requirements mapped — no orphans, no duplicates.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation — Deploy Pipeline, Skeleton, Privacy Policy | 2/2 | Complete    | 2026-09-02 |
| 2. GeoHist Landing + Hub Content (EN) | 2/2 | Complete    | 2026-09-02 |
| 3. i18n — Engine, ES/pt-BR Dictionaries, Switcher | 2/2 | Complete    | 2026-09-02 |
| 4. Consent Gate + Firebase (Analytics + Contact Form) | 2/2 | Complete    | 2026-09-03 |
| 5. Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit | 4/4 | Complete    | 2026-09-04 |

## Manual Prerequisites Checklist (user actions, not code)

1. Repo Settings → Pages → Build and deployment → Source: **GitHub Actions** (before first deploy — Phase 1)
2. Firebase console → register **Web App** in the app's existing project → copy config → add `persano.github.io` to authorized domains (Phase 4)
3. Enable **Anonymous** sign-in provider + anonymous auto-clean-up (Phase 4)
4. Firestore created (production mode) + rules deployed from repo file (Phase 4)
5. Google Search Console → submit sitemap (verification file already in repo — Phase 5)
