# Persano — Personal Apps Hub + GeoHist Trivia Site

## What This Is

A static GitHub Pages website at https://geohisttrivia.com serving as Santiago David Postorivo's personal brand hub ("Persano"). The root page is a minimal portfolio hub introducing the developer and linking to per-app sites. The first and primary app site is `/geohist/` — a complete landing page for **GeoHist Trivia**, an Android trivia game (history + geography, Jetpack Compose, Google Play Games Services, IAP, AdMob, offline-capable, 20 localizations) currently in Google Play review. The site lets players learn about the game, view screenshots, read the FAQ and game guide, access the privacy policy, and contact the developer via a Firebase-powered contact form.

## Core Value

GeoHist Trivia players and Google Play reviewers can reach an authoritative, accessible web page for the app — featuring it, explaining it, hosting its privacy policy, and offering a working contact channel — before the app goes live.

## Current State (v2.0 shipped 2026-09-11)

**Shipped:** v2.0 "Full Deferred Scope" — Phases 6-11, 22 plans, all 17 v2 requirements validated.

- Site canonical at https://geohisttrivia.com (HTTPS enforced, `protected_domain_state: verified`); legacy `persano.github.io` host 301s path-preserved
- 20-locale single-URL keyed i18n (EN markup baseline + 19 JSON dictionaries, 178-key exact surface, CI-gated incl. CJK punctuation + star-uniqueness fail-closed gates); RTL ar/ur mirrored
- `/geohist/changelog.html` live (KaC format, 6 curated git-mined entries, keyed chrome, EN-entries exception documented)
- App Check via reCAPTCHA Enterprise, monitoring mode live: dormant-by-default gate, ~3s reachability probe + bounded ~10s token race, deliver-anyway, consent-gated failure event
- Social proof: facts-only 4-pill strip live; Tier-1 rating row shipped OFF (owner flip per 10-RUNBOOK.md gated on real Play data); Tier-2 aggregateRating permanently OFF (policy)
- GSC: sitemap Success on new Domain property, Change of Address filed (180-day window active), old property retained for index-decay monitoring
- AGENTS.md describes shipped reality; old-domain CI gate enforces it; owner UAT records complete (HV-06, HV-09a, HV-09b)

**Deferred by design (owner console, not code debt):** FIRE-10 App Check enforcement flip (evidence-gated per 09-RUNBOOK.md §5-§6); Tier-1 rating row flip (Play listing live); GSC 180-day CoA window monitoring.

## Next Milestone Goals

Not yet defined — run `/gsd-new-milestone` (questioning → research → requirements → roadmap). Fresh REQUIREMENTS.md will be created there.

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
- ✓ i18n: ES + pt-BR in-place dictionary swap, auto-detect, manual switcher, EN fallback — Phase 3 (I18N-01..04)
- ✓ GDPR consent banner gating Firebase Analytics (zero SDK bytes pre-grant, retraction path) — Phase 4 (FIRE-01, FIRE-02, FIRE-03)
- ✓ Firebase Analytics GA4 events (play_badge_click, language_switch) consent-gated — Phase 4 (FIRE-03)
- ✓ Contact form via Firebase JS SDK → Firestore (`/geohist/contact.html`) — Phase 4 (FIRE-04, FIRE-06)
- ✓ Anonymous Firebase Auth for form spam resistance + create-only Firestore security rules in repo — Phase 4 (FIRE-04, FIRE-05)
- ✓ Data-deletion request path via form topic 'deletion' (CMPL-03) — Phase 4
- ✓ Screenshot gallery with real ADB captures (4 pinned WebPs, ad-free recapture after G-05-1 fix) — Phase 5 (LNDG-03)
- ✓ Full SEO: meta descriptions, Open Graph image (1200×630 composite), sitemap.xml, robots.txt — Phase 5 (SEO-01..04)
- ✓ Rich snippets: SoftwareApplication + MobileApplication JSON-LD (applicationCategory GameApplication) — Phase 5
- ✓ WCAG 2.1 AA accessibility audit: axe 0 critical/serious + Lighthouse a11y 100 on all 5 pages, owner keyboard/form/language battery — Phase 5 (A11Y-01)
- ✓ Superseded root privacy-policy files deleted (old URL 404 live; /geohist/privacy.html canonical) — Phase 5 (D-70)
- ✓ Changelog page at `/geohist/changelog.html` — KaC format, 6 curated git-mined entries, keyed chrome (nav/footer/title/intro), EN entries with per-language entries-language notice — Phase 6 (CONT-06, CONT-07)
- ✓ i18n ×20: 17 new dictionaries at exact 170-key parity + engine/detect/switcher scale-up + RTL (ar/ur) mirroring with script line-heights + hardened validate chain — Phase 7 (I18N-05..09; UAT 10/10)
- ✓ Custom domain live at https://geohisttrivia.com — apex + HTTPS enforced + `protected_domain_state: verified`, 44-URL rewrite in one commit, permanent CI old-domain gate — Phase 8 (HOST-01, HOST-02; UAT 5/5)
- ✓ GSC migration complete — sitemap Success on new Domain property, Change of Address old→new (180-day window), old property retained for index-decay monitoring — Phase 8 (HOST-03)
- ✓ App Check via reCAPTCHA Enterprise, monitoring mode live on prod — dormant-by-default gate, bounded ~10s token-failure race with deliver-anyway, ~3s probe-gated init (blocked-reCAPTCHA submits deliver un-attested in seconds), consent-gated appcheck_token_failure event, favicon site-wide — Phase 9 (FIRE-07, FIRE-08; UAT 9/9 final state, gaps G-09-2/4/5/6/7 all resolved)
- ✓ Facts-only social proof: 4-pill keyed strip (aria-labeled, no visible h2, zero links) between hero and features + Tier-1 "Rated X.X" row shipped OFF (hidden, 0.0 self-flagging span, two-edit owner flip per 10-RUNBOOK.md gated on real Play data, no minimum floor) + Tier-2 aggregateRating permanently OFF via inert policy-citing comment; served JSON-LD byte-identical — Phase 10 (SEO-05, SEO-06, SEO-07; UAT 3/3)

### Active

- [ ] Restore `npm ci` + `cache: npm` in validate job — package-lock.json exists (Phase 5), restore is unblocked
- [ ] Play Console privacy-URL field → `/geohist/privacy.html` before Play submission (owner console step)
- [ ] Play Store link as placeholder until listing is live, then real link
- [ ] Structure anticipates future apps as new subdirs without visible placeholders
- [ ] Owner request (post-phase-8): remove root selector/hub page and serve the GeoHist landing as site home — needs product decision + planning
- [ ] FIRE-10: App Check enforcement flip execution — owner console, gated on 30-successful-submissions floor + clean console signal (09-RUNBOOK.md §5-§6); owner-only, post-monitoring
- [ ] Tier-1 rating row flip — owner 2-edit flip per 10-RUNBOOK.md, gated on real visible Play data
- [ ] Urdu Nastaliq rendering quality — real-device visual verification (silent degradation unacceptable)
- [ ] GSC Change-of-Area 180-day window monitoring until ~2027-03 — old property retained for D-08 index-decay watch; don't delete


### Out of Scope

- Native Android App Links (deep links into the game) — informational site only; Play Store links suffice
- Privacy policy translations — English is the legally authoritative version
- Translated changelog entries (×20) — human-curated EN entries; ×20 content translation unmaintainable (documented i18n exception)
- Geo-IP language redirects — detect via `navigator.languages` only; no server-side sniffing on Pages
- Auto-translate widgets — unacceptable quality/privacy tradeoff
- aggregateRating mirroring Google Play ratings — review-snippet policy violation regardless of data being real — permanent exclusion unless on-site review source appears
- Fabricated star ratings / placeholder reviews — structured-data spam risk; manual actions
- Real-time chat, comments, user accounts — not core to landing value
- Jekyll/static-site generators — plain HTML/CSS chosen deliberately (zero build complexity)

## Context

- **v2.0 shipped (2026-09-11)**: all v2-deferred items live — 20-locale site, custom domain, changelog, App Check monitoring, gated social proof; 17/17 v2 requirements validated; 6 phases / 22 plans (2026-09-05 → 2026-09-11); see `.planning/MILESTONES.md` and `.planning/milestones/v2.0-ROADMAP.md`
- **Shipped v1 (2026-09-05)**: site fully live — 5 phases, 12 plans, 27/27 v1 requirements validated; see `.planning/milestones/v1-ROADMAP.md`
- Current stack reality: plain HTML/CSS/vanilla JS, zero-build; one JS surface set (i18n.js, consent.js, contact.js via Firebase 12.18.0 gstatic ESM CDN dynamic imports — contact.js carries probe-gated App Check Enterprise + bounded token race); 19 JSON dictionaries at 178-key exact surface; 4 real WebP screenshots; OG image composite; favicon.ico; sitemap + robots + SoftwareApplication JSON-LD
- CI gates: old-domain literal ban (enforces AGENTS.md too), i18n keycheck (set-equality + CJK punct + star-uniqueness fail-closed), all chained in `npm run validate`
- Owner-pending before Play submission: Play Console privacy-URL field → `/geohist/privacy.html`; Play Store link swap once listing is live
- App published/review context: GeoHist Trivia is in Google Play review ("soon"); Play Store link stays placeholder until approval
- App has 20 localizations; site covers all 20 (EN + 19, incl. RTL ar/ur) since Phase 7
- Firebase: reuse of app's project (analytics + anonymous auth + Firestore `messages`, create-only rules); API-key hardening console-side; App Check reCAPTCHA Enterprise registration `web-geohist`
- Site maintenance model: agent-maintained — content updates happen via chat sessions, not raw HTML editing by the owner
- Visual style: dark antique aesthetic (map textures, aged-map teal accent), consistent between hub and app site

## Constraints

- **Tech stack**: Plain HTML/CSS (vanilla JS for interactivity) — zero build step, GitHub Pages native
- **Hosting**: GitHub Pages behind apex custom domain `geohisttrivia.com` (HTTPS enforced); GeoHist site in `/geohist/` subdir; legacy `persano.github.io` 301s preserved
- **Deployment**: Push → GitHub Actions CI (validate) → Pages deploy
- **Dependencies**: Firebase JS SDK via CDN; no other runtime dependencies
- **Content source**: Screenshots and app facts from `C:\Users\Familia\antigravity\GeoHist-Trivia`
- **Compatibility**: Modern evergreen browsers; responsive mobile-first (most game traffic is mobile)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GeoHist site in `/geohist/` subdir, not root root | Portfolio-ready from day 1; future apps get clean subdirs | ✓ Phase 1 — policy live at `/geohist/privacy.html` |
| Plain HTML/CSS, no SSG | Zero build complexity; GitHub Pages native; agent-maintained content | ✓ Validated Phase 1 |
| Firebase contact form (anonymous auth + Firestore rules) | Free, no backend, spam-resistant, same project as app | ✓ Phase 4 |
| GDPR consent banner gating Analytics | EU visitors; AdMob app already privacy-sensitive | ✓ Phase 4 |
| Consent = load-gating: dynamic import IS the consent; zero firebasejs refs in HTML; fail-closed versioned store `{v:1, analytics, ts}` | Zero SDK bytes pre-grant; storage failure degrades to banner re-show | ✓ Phase 4 |
| Fork-shaped Firebase split: analytics imported only in consent.js; auth+firestore only in contact.js | Form is the compliance surface — works identically after Accept or Reject | ✓ Phase 4 |
| Firebase config public-by-design; hardening console-side (API-key HTTP-referrer restriction + create-only Firestore rules) | Standard Firebase web pattern; repo rules file is source of truth (merged into existing project ruleset) | ✓ Phase 4 |
| EN+ES+PT v1, 17 others deferred | Core audience first; i18n structure ready for expansion | ✓ Phase 3 |
| ADB screenshot capture in v1 | Real screenshots beat placeholders; tools already exist | ✓ Phase 5 — 4 real WebPs; G-05-1 test-banner contamination recaptured ad-free |
| AA accessibility audit explicit | Play ecosystem quality bar; broadens audience | ✓ Phase 5 — axe 0 critical/serious, LH a11y 100 all 5 pages |
| Old root policy files kept; deletion deferred | Play Console privacy field already points at old root URL — update it to `/geohist/privacy.html` before Play submission, then delete the 3 old files | ✓ Phase 5 — old files deleted (404 live); Play Console field update remains owner step |
| Dark antique theme; secondary accent = aged-map teal #8fc3bd (over terracotta) | Differentiates harder against warm brown-black; 9.30:1 contrast; all 8 WCAG 2.2 pairs re-proven | ✓ Phase 2 |
| data-i18n keys baked into all Phase 2 markup; keyed nodes plain text only | Phase 3 textContent dictionary swap is markup-safe; namespaces geohist.*/guide.*/hub.* mapped 1:1 | ✓ Phase 2 |
| Texture utilities decoration-only (never behind body copy); zero JS in any page | Readability + i18n/no-JS safety; native `<details>` accordions | ✓ Phase 2 |
| Apex custom domain `geohisttrivia.com` (www canonicalized to apex); enforce-flip during TXT gap ruled by owner (option B) | SEO value on new domain early; gate script + runbook cover residual risk | ✓ Phase 8 — https_enforced, protected verified |
| One-commit migration + permanent CI old-domain gate (`check-no-old-domain.mjs` in validate chain) | Atomic history (one revert = rollback); gate prevents legacy-host re-introduction | ✓ Phase 8 — CI green, gate RED→GREEN proven |
| GSC: new Domain property, CoA old→new (180-day signal window), old property retained | Consolidates index signals; retained old property = D-08 decay monitoring surface | ✓ Phase 8 — sitemap Success, CoA filed |
| App Check provider = ReCaptchaEnterpriseProvider (classic v3 provider deprecated by Firebase for new App Check registrations) | Owner console forced Enterprise registration; classic tokens cannot verify against it; same pinned 12.18.0 module | ✓ Phase 9 — monitoring live on prod (G-09-2 fix) |
| Monitor-first + dormant-by-default: empty recaptchaSiteKey keeps pre-activation behavior byte-identical; enforcement flip post-metrics (FIRE-09) | Zero user-visible change until owner activation; console enforces, code attests | ✓ Phase 9 — dormant gate verified unchanged through 3 deploys |
| Token-failure semantics: bounded ~10s race + record-and-swallow + deliver-anyway (monitoring mode); ~3s reachability probe skips App Check init when reCAPTCHA is blocked | Failure paths bounded & graceful; blocked-reCAPTCHA visitors (ad-blockers) still deliver — the SDK's unbounded Auth header await (30/60s NetworkTimeout, onload-only script tag) is unpatchable at CDN pin | ✓ Phase 9 — G-09-5/G-09-7 fixes, UAT test 9 pass |
| Remote deploys via GitHub Git Data API bridge (strict fast-forward; per-blob sha assertions mandatory) | raw git push harness-blocked in executor sessions; blob-sha assertion is the standing regression guard after the empty-blob incident | ✓ Phase 9 — bridge chain to 81463b3, remote tree byte-identical to local HEAD |
| Single-entry favicon.ico (22-byte ICO header + verbatim app icon bytes) via node builtins | No image library, no build step; reuses app icon art | ✓ Phase 9 — G-09-6, /favicon.ico 200 site-wide |
| Rating surfaces (Tier-1 row / Tier-2 JSON-LD) shipped OFF: hidden row + inert comment citing Google review-snippet policy verbatim; flip = 2-edit owner runbook gated on real visible Play data (no minimum floor) | Mirroring Play ratings into markup is barred by policy; honest zero (0.0) over fake rating; documented-OFF pair (in-file comment + runbook) blocks future-agent rationalization | ✓ Phase 10 — prod smoke: row hidden, zero rating literals in served schema |
| Star-uniqueness fail-closed CI gate in i18n-keycheck (P-10-3): exactly 1 proof-row-star SVG, zero U+2605 text stars in any dictionary value or markup; red-gate proven both directions | Verified-but-unenforced invariants rot; gate rides existing validate chain, zero deps (D-10) | ✓ Phase 11 — red-gate-proof.md, 3 red cycles + flip-compat green |
| AGENTS.md describes shipped v2.0 reality + old-domain gate enforces it (allowlist entry dropped, mutation-probe proven) | Doc rot on a self-referential file misleads every future agent; enforcement closes the loop (F-1/D-04) | ✓ Phase 11 — full battery green, enforcement both directions |

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
*Last updated: 2026-09-11 after v2.0 milestone*
