# Persano — Personal Apps Hub + GeoHist Trivia Site

## What This Is

A static GitHub Pages website at https://persano.github.io serving as Santiago David Postorivo's personal brand hub ("Persano"). The root page is a minimal portfolio hub introducing the developer and linking to per-app sites. The first and primary app site is `/geohist/` — a complete landing page for **GeoHist Trivia**, an Android trivia game (history + geography, Jetpack Compose, Google Play Games Services, IAP, AdMob, offline-capable, 20 localizations) currently in Google Play review. The site lets players learn about the game, view screenshots, read the FAQ and game guide, access the privacy policy, and contact the developer via a Firebase-powered contact form.

## Core Value

GeoHist Trivia players and Google Play reviewers can reach an authoritative, accessible web page for the app — featuring it, explaining it, hosting its privacy policy, and offering a working contact channel — before the app goes live.

## Business Context

- **Customer**: GeoHist Trivia players (Google Play), prospective players, Play review team
- **Revenue model**: Indirect — supports the app's Google Play presence (AdMob-monetized free app)
- **Success metric**: Site live and linked as app website before/with Play listing approval; working contact form with spam-free submissions
- **Strategy notes**: App source of truth: `C:\Users\Familia\antigravity\GeoHist-Trivia` (package `com.persano.geohisttrivia`)

## Requirements

### Validated

- ✓ GitHub Actions CI pipeline that validates then deploys to Pages — Phase 1 (OPS-01, OPS-02, OPS-03; run 33587621659)
- ✓ Privacy policy on its own page (`/geohist/privacy.html`), English only — Phase 1 (CMPL-01, CMPL-02)
- ✓ Self-contained 404 page linking back to hub — Phase 1 (CONT-05)
- ✓ GeoHist landing page: hero, categorized features, gallery skeleton, Play badge placeholder — Phase 2 (LNDG-01, LNDG-02, LNDG-04)
- ✓ Policy-mirrored FAQ (data collection, offline, devices) — Phase 2 (CONT-01, CMPL-04)
- ✓ Game guide page (how to play + game modes) — Phase 2 (CONT-02)
- ✓ About-the-developer section — Phase 2 (CONT-03)
- ✓ Root hub full content: Persano brand intro + exactly one app card — Phase 2 (CONT-04)
- ✓ Mobile-first responsive at phone widths + design-time WCAG contrast math — Phase 2 (LNDG-05)

### Active

- [ ] Restore `npm ci` + `cache: npm` in validate job once a package-lock.json lands (local npm proxy-broken)
- [ ] Screenshot gallery with real screenshots captured via ADB from a connected phone (tools exist in app repo)
- [ ] Contact form via Firebase JS SDK → Firestore, same Firebase project as the app
- [ ] Anonymous Firebase Auth for form spam resistance + Firestore security rules
- [ ] Firebase Analytics on the site (same project)
- [ ] GDPR consent banner: Analytics and form load only after consent
- [ ] Languages: English, Spanish, Portuguese — auto-detect by browser language, manual switcher, EN fallback
- [ ] Play Store link as placeholder until listing is live, then real link
- [ ] Full SEO: meta descriptions, Open Graph image, sitemap.xml, robots.txt
- [ ] Rich snippets: SoftwareApplication structured data
- [ ] WCAG 2.1 AA accessibility audit as an explicit step
- [ ] Structure anticipates future apps as new subdirs without visible placeholders

### Out of Scope

- Native Android App Links (deep links into the game) — informational site only; Play Store links suffice
- Privacy policy translations — English is the legally authoritative version
- Remaining 17 localizations — staged later if traffic justifies
- Real-time chat, comments, user accounts — not core to landing value
- Jekyll/static-site generators — plain HTML/CSS chosen deliberately (zero build complexity)
- Custom domain — GitHub default URL for v1

## Context

- This repo (`persano.github.io`) currently holds only the app's privacy policy files and Google Search Console verification — it becomes the live site
- App published/review context: GeoHist Trivia is in Google Play review ("soon"); Play Store link will be a placeholder first
- App has 20 localizations; site v1 covers EN + ES + PT-BR as core
- Existing tooling in app repo: Python ADB screenshot tools, `translations.json`, `translate_categories.py` — reusable where sensible
- Firebase: reuse the app's Firebase project (config keys exist in app repo `.env`); web app registration needed
- AdMob + Firebase means privacy policy must stay accurate on the site (data collection disclosure)
- Site maintenance model: agent-maintained — content updates happen via chat sessions, not raw HTML editing by the owner
- Marketing copy: AI-drafted from app README/docs, owner reviews
- Visual style: agent's call — dark landing aesthetic with history+geography mood (map textures, antique accents), consistent between hub and app site

## Constraints

- **Tech stack**: Plain HTML/CSS (vanilla JS for interactivity) — zero build step, GitHub Pages native
- **Hosting**: GitHub Pages, default URL `persano.github.io`, GeoHist site in `/geohist/` subdir from day 1
- **Deployment**: Push → GitHub Actions CI (validate) → Pages deploy
- **Dependencies**: Firebase JS SDK via CDN; no other runtime dependencies
- **Content source**: Screenshots and app facts from `C:\Users\Familia\antigravity\GeoHist-Trivia`
- **Compatibility**: Modern evergreen browsers; responsive mobile-first (most game traffic is mobile)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GeoHist site in `/geohist/` subdir, not root root | Portfolio-ready from day 1; future apps get clean subdirs | ✓ Phase 1 — policy live at `/geohist/privacy.html` |
| Plain HTML/CSS, no SSG | Zero build complexity; GitHub Pages native; agent-maintained content | ✓ Validated Phase 1 |
| Firebase contact form (anonymous auth + Firestore rules) | Free, no backend, spam-resistant, same project as app | — Pending (Phase 4) |
| GDPR consent banner gating Analytics | EU visitors; AdMob app already privacy-sensitive | — Pending (Phase 4) |
| EN+ES+PT v1, 17 others deferred | Core audience first; i18n structure ready for expansion | — Pending (Phase 3) |
| ADB screenshot capture in v1 | Real screenshots beat placeholders; tools already exist | — Pending (Phase 5) |
| AA accessibility audit explicit | Play ecosystem quality bar; broadens audience | — Pending (Phase 5) |
| Old root policy files kept; deletion deferred | Play Console privacy field already points at old root URL — update it to `/geohist/privacy.html` before Play submission, then delete the 3 old files | Deferred — Phase 5 trace |
| Dark antique theme; secondary accent = aged-map teal #8fc3bd (over terracotta) | Differentiates harder against warm brown-black; 9.30:1 contrast; all 8 WCAG 2.2 pairs re-proven | ✓ Phase 2 |
| data-i18n keys baked into all Phase 2 markup; keyed nodes plain text only | Phase 3 textContent dictionary swap is markup-safe; namespaces geohist.*/guide.*/hub.* mapped 1:1 | ✓ Phase 2 |
| Texture utilities decoration-only (never behind body copy); zero JS in any page | Readability + i18n/no-JS safety; native `<details>` accordions | ✓ Phase 2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-02 after Phase 2*
