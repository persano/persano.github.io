# Project Research Summary

**Project:** Persano — Personal Apps Hub + GeoHist Trivia Landing Site (persano.github.io)
**Domain:** Static GitHub Pages app-landing/portfolio site with Firebase-powered contact form, GDPR consent, i18n, SEO, Google Play-review support
**Researched:** 2026-09-01/02
**Confidence:** HIGH overall (most claims verified against first-party docs + live probes this session; MEDIUM items flagged below)

## Executive Summary

This project is a compliance-critical app landing site, not a marketing brochure. Research established that the website is part of GeoHist Trivia's Google Play compliance surface: Play's User Data policy (fetched directly, HIGH) mandates a live, public, non-PDF privacy policy URL, Data-safety/policy consistency, affirmative (non-auto-dismissing) consent, and — because the game uses Play Games Services sign-in — an account/data-deletion request path, for which this website is the natural home. The single non-negotiable artifact is `/geohist/privacy.html`; the site must be live and that URL returning 200 before Play review depends on it. Everything else (hero, screenshots, FAQ, guide, hub) is standard static-site work well served by the chosen approach.

The recommended approach: hand-authored HTML/CSS/vanilla JS with zero build step (the repo tree IS the deploy tree), Firebase JS SDK 12.18.0 modular ESM from gstatic (exact-pinned, consent-gated dynamic imports only), GitHub Actions official Pages chain (`checkout@v7 → configure-pages@v6 → upload-pages-artifact@v5 → deploy-pages@v5`) with a validate job gating deploy, and i18n via a single HTML set per page + JSON dictionary in-place DOM swap (decision below). Analytics loads strictly after consent (load-gating, stronger than Consent Mode); the contact form uses anonymous auth at submit-time only + create-only Firestore rules with server-side field validation + honeypot.

Key risks and mitigations: (1) Play review failure from a broken or mismatched privacy URL — deploy pipeline first, policy page early, policy-URL curl check as a release gate; (2) consent-ordering violation (Analytics before banner) — no Firebase script tag in HTML, ever; dynamic import only post-consent, an explicit acceptance criterion; (3) deploy-chain traps — `.nojekyll` committed in the first commit AND `include-hidden-files: true` in upload-pages-artifact (default `false` silently drops `.nojekyll`), explicit `path: '.'`, one-time manual Pages Source setting; (4) schema spam — no `aggregateRating` in SoftwareApplication JSON-LD until real Play ratings exist; (5) dark-theme accessibility — pick the palette by contrast math (4.5:1/3:1) before styling, not during the audit.

## Key Findings

### Recommended Stack

Zero-build, agent-maintained static site: plain HTML5/CSS3/vanilla ES2020+, no SSG, no framework, no Tailwind. Every dependency was version-verified live this session (npm registry, GitHub API `releases/latest`, official docs). SSGs (Jekyll/Astro/Eleventy) were rejected: the agent-maintenance model removes the authoring-ergonomics benefit, page count (~6 layouts) is far below the ~15-page threshold where templating pays, and zero-build means zero CI dependency-rot failure modes.

**Core technologies:**
- **HTML/CSS/vanilla JS (no framework, no build)** — repo tree IS deploy tree; every file inspectable; push → live
- **Firebase JS SDK 12.18.0, modular API, gstatic ESM CDN, exact-pinned** — Analytics + Anonymous Auth + Firestore; never the v8 `*-compat` builds; never `npm install firebase`
- **Consent via load-gating** — no `firebase/analytics` import until `localStorage` consent = granted; custom ~50-line banner, no CMP library; auto-dismissing banners are a Play policy violation
- **Contact form** — `signInAnonymously()` (at submit-time only) → `addDoc()` to one collection; `create`-only Firestore rules with `hasOnly` schema lock, field length caps, `request.time` timestamps; honeypot; App Check later in monitor mode (do not block v1 on it)
- **GitHub Actions deploy chain** — `actions/checkout@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5` (all API-verified current; GitHub docs samples show stale majors); validate job gates deploy
- **CI validation** — `html-validate` 11.12.0 (primary gate), optional `vnu-jar` 26.8.30 (periodic audit), optional `linkinator` (dead-link check, phase 2+)
- **SEO: hand-rolled** — sitemap.xml (with hreflang entries if/where applicable), robots.txt (allow-all + sitemap line), SoftwareApplication JSON-LD, Open Graph with absolute URLs, 1200×630 og:image

### i18n Strategy — RESOLVED CONFLICT

The four research files split on i18n: STACK.md recommended per-language HTML subdirs (`/es/`, `/pt/`) + hreflang + detect/redirect; ARCHITECTURE.md and PITFALLS.md recommended a single HTML set + JS dictionary in-place swap (no redirects, crawler sees EN). **Decision: single HTML set + JS dictionary swap (data-i18n + JSON dicts).**

Rationale, weighing the four deciding factors:
1. **Installs come from Play search, not web SEO.** Per-language SEO is the subdirs' main advantage; here its conversion value is ~zero. EN-only indexing costs nothing measurable.
2. **Agent-maintained site.** 3 languages × ~6 layouts = ~18 hand-maintained HTML files with per-page drift risk; one fix must be replayed everywhere. Dictionary swap keeps one HTML source per page — a copy fix lands in one file, translations in JSON. Drift is the dominant long-term cost in this maintenance model.
3. **Expansion path.** Adding language #4–20 under subdirs means new page trees; under swap it means one new JSON dict. If traffic ever justifies more localizations, swap scales far cheaper.
4. **Googlebot crawls without Accept-Language.** With swap, Google indexes the EN default — acceptable and predictable (Pitfall C2). With subdirs, the STACK plan's detect-redirect script is the exact pattern Google warns against (Pitfall C1: "avoid automatically redirecting users between language versions"), and sessionStorage gating only partially contains it. Swap eliminates the entire redirect-pitfall class.

Constraints that come with this decision (bake into the i18n phase): EN copy ships in the raw HTML (never empty placeholders — otherwise nothing is indexable at all); NO hreflang (invalid on a single URL — known spam signal); detect `navigator.language` and apply in place without URL change; stored preference beats re-detection; switcher overrides all; `document.documentElement.lang` updates with content (WCAG 3.1.1/3.1.2); `<title>`/meta description translate too.

**Revisit trigger:** web organic search becomes a real acquisition channel — Search Console shows meaningful non-EN impressions/clicks after a few months live, or a custom domain + content push is adopted. Migration path is documented (Pitfall C2): real duplicated HTML files + self-referencing hreflang set + sitemap entries; the `data-i18n` keys in markup port directly.

### Expected Features

**Must have (table stakes):**
- **Privacy policy page** (`/geohist/privacy.html`, EN, non-PDF, public) — hard Play requirement; must name the store-listing entity, include contact mechanism + retention/deletion policy; linked from every footer
- **Privacy-policy ↔ Data-safety consistency** — every SDK (AdMob, Play Games, IAP, Firebase Analytics, contact form) named in policy matches Data safety declarations
- **Account/data-deletion request path** — Play requires it for apps with account creation (Play Games sign-in applies). Simplest compliant form: FAQ entry + contact-form "request data deletion" topic + documented manual process
- **Hero + Play badge (placeholder until listing live) + 3–6 real ADB screenshots + feature list** — core conversion block; screenshots are the #1 conversion asset
- **FAQ** (data collection, offline, devices) — wording must mirror the privacy policy (single source of truth)
- **Working contact form with success/error states** — part of the feature, not polish
- **GDPR consent banner with affirmative action** — gates Analytics (and gates form-Firebase init to the choice, see below); never auto-dismissing
- **Mobile-first responsive + fast load** — most traffic is phones tapping Play/social links
- **Hub page: bio + app-card grid that renders correctly with exactly 1 app** — no visible "coming soon" placeholders (explicit constraint)
- **Meta titles/descriptions, canonicals, sitemap.xml, robots.txt, OG/Twitter cards, favicon, custom 404** — Search Console already verified on this repo

**Should have (differentiators):**
- How-to-play guide on its own page (also feeds FAQ)
- SoftwareApplication JSON-LD (name, operatingSystem ANDROID, applicationCategory GameApplication, offers price 0) — **skip aggregateRating until real Play ratings exist**
- Language switcher + browser auto-detect (EN/ES/PT-BR)
- Changelog page (post-launch, once updates exist)
- Consent-gated analytics events (Play clicks, language switches)
- Honeypot + App Check (monitor mode) on the form
- WCAG 2.1 AA audit as an explicit step

**Defer (v2+):**
- aggregateRating + social-proof strip — requires live Play listing data
- 17 additional localizations — staged if traffic justifies (see revisit trigger above)
- App Check enforcement — after monitor-mode metrics
- Custom domain, deep links, SSG migration — explicitly out of scope

### Architecture Approach

`persano.github.io` is a **user site**: the repo root IS `https://persano.github.io/`, so root-absolute paths (`/shared/css/base.css`) work from every page and every future app is a plain self-contained subdirectory (`/geohist/` now, `/nextapp/` later). No build step means all reuse is runtime: shared ES modules (`i18n.js`, `consent.js`, `firebase-config.js`) + `base.css` in `/shared/` (only what ≥2 apps need), app-owned `css/js/i18n/img` inside each app dir, manual `?v=` cache busting. Existing root files (`app-ads.txt`, `google*.html` Search Console verification, privacy-policy source files) stay untouched in place. Data flow is one-way: assets repo → CDN → browser; runtime data browser → Firebase only. Zero server-side state.

**Major components:**
1. **Hub (`/index.html`)** — brand intro + app cards; loads base.css, i18n.js + hub dicts
2. **App site (`/geohist/`)** — landing, guide, privacy (EN-only static), gallery, form; loads shared modules + own dicts
3. **i18n engine (`shared/js/i18n.js`)** — detect → fetch dict → DOM swap → persist pref; emits `i18n:changed`; knows nothing of Firebase/consent; falls back to shipped EN markup on any fetch failure
4. **Consent module (`shared/js/consent.js`)** — banner UI, localStorage persistence, emits `consent:granted`/`consent:denied`; the only thing allowed to trigger the Analytics dynamic import
5. **Firebase gate (per-app JS)** — lazy SDK import post-consent (Analytics) / at submit (form); SDK never in a static `<script>` tag
6. **Deploy workflow** — validate job → artifact upload (`path: '.'`, **`include-hidden-files: true`**) → deploy-pages; `pages: write` + `id-token: write` permissions; `github-pages` environment

**Consent ordering (critical, cross-file agreement):** banner choice precedes ANY Firebase load. Analytics: never loads without grant — zero SDK bytes before consent (stronger than Consent Mode, which exists to preserve cookieless pings this site doesn't need). Form: loads its Firebase modules on submit regardless of grant/deny — the account-deletion request path runs through this form, so blocking it on "deny" would break a Play requirement; anonymous auth is anti-spam, not tracking. The privacy policy must disclose the form's data handling either way (Pitfall B3).

### Critical Pitfalls

1. **Broken privacy-policy URL at Play review (E2)** — the site is a release dependency of the app. Verify `privacy.html` returns 200 before Play submission; keep that URL stable forever; policy must name every SDK the app+site actually use.
2. **Analytics before consent (B1)** — no Firebase/Analytics script tag in page HTML ever; dynamic import only after grant; test in incognito that no `google-analytics.com/g/collect` request fires pre-banner. Persistence (B2): stored choice re-applied on every load; retraction honored.
3. **Deploy-chain traps (D1/D2 + artifact)** — `.nojekyll` in the first commit AND `include-hidden-files: true` on upload-pages-artifact (default silently drops dotfiles); explicit `path: '.'`; permissions + environment in workflow; one-time manual Pages Source = GitHub Actions. Note Pages CDN caches ~10 min (`max-age=600`, live-verified) — don't mistake stale cache for deploy failure.
4. **Open-write Firestore rules / anon-auth churn (A2/A3)** — create-only, schema-locked rules; sign in anonymously only at submit-time (not page load); enable anonymous auto-clean-up; add `persano.github.io` to Firebase authorized domains BEFORE first live test (`auth/unauthorized-domain`).
5. **aggregateRating trap (E1)** — SoftwareApplication rich result officially requires aggregateRating OR review, but fabricating ratings = structured-data spam. Ship schema without it; add with real Play data post-launch. Treat Rich Results Test warnings as expected, errors as blockers.

## Implications for Roadmap

Based on research, suggested phase structure (dependency-driven; synthesizes ARCHITECTURE build-order, FEATURES MVP ordering, and PITFALLS phase mapping):

### Phase 1: Foundation — Deploy Pipeline + Skeleton + Privacy Policy
**Rationale:** Every later phase validates against the live URL, and the privacy URL is a Play release dependency — the site's reason to exist. Deploying first proves the pipeline and regression-checks existing root files.
**Delivers:** `.nojekyll` (first commit), `404.html` (self-contained, root-absolute assets), minimal hub index (EN text), `base.css`, `deploy.yml` (validate → upload with `path: '.'` + `include-hidden-files: true` → deploy), **static EN `/geohist/privacy.html`** with website section + contact mechanism + retention/deletion, live URL + policy URL verified 200.
**Addresses:** Privacy policy page (Play-critical), custom 404, footer.
**Avoids:** D1 (Jekyll eating files), D2 (artifact path/permissions), D5 (context-less 404), E2 (broken policy URL).
**Manual prerequisite:** Repo Settings → Pages → Source: GitHub Actions (one-time, before first deploy).

### Phase 2: GeoHist Landing + Hub Content (EN, i18n-keys baked in)
**Rationale:** Content next, with `data-i18n` keys authored from the start — retrofitting keys after writing copy is rework (ARCHITECTURE). Play link stays a placeholder (inert but visually identical) until the listing is live.
**Delivers:** Landing (hero, features, screenshot gallery placeholders, FAQ, download CTA), guide.html, hub bio + one-app card grid; GeoHist-specific CSS with contrast-math-checked token pairs.
**Addresses:** Core landing table stakes, FAQ, guide, hub.
**Avoids:** F1 (dark-theme contrast — decide palette by math at design time), D4 (trailing-slash/root-absolute link convention).

### Phase 3: i18n — Engine + ES/PT Dictionaries + Switcher
**Rationale:** Pattern proven on the hub dicts first, then applied to the larger app pages; markup already carries keys from Phase 2.
**Delivers:** `shared/js/i18n.js` (detect in place, no redirects, no URL changes), `/shared/i18n/hub-*.json`, `/geohist/i18n/{es,pt-BR}.json`, manual switcher, localStorage persistence, `document.documentElement.lang` sync, EN fallback chain.
**Addresses:** EN/ES/PT v1 requirement, language switcher + auto-detect.
**Avoids:** C1 (auto-redirect), C2 (indexable EN in raw HTML; no invalid hreflang), C3 (lang-attribute drift).
**Decision locked:** JS dictionary swap, not per-language subdirs (rationale + revisit trigger above).

### Phase 4: Consent Gate + Firebase Analytics
**Rationale:** Consent must exist before Analytics goes live in any template — retrofitting the banner means auditing every page (FEATURES ordering constraint).
**Delivers:** `shared/js/consent.js` (affirmative-action banner, localStorage + timestamp, retraction path), dynamic `import()` of firebase-analytics only on grant, analytics events (Play clicks, language switches) post-grant; accessible banner (focus, contrast, no trap).
**Addresses:** GDPR consent banner, Firebase Analytics, consent-gated events.
**Avoids:** B1 (pre-consent collection — acceptance criterion, not nice-to-have), B2 (unpersisted choice), F3 (inaccessible banner).
**Manual prerequisite:** Firebase console → register **Web App** in the app's existing project → copy config → add `persano.github.io` to authorized domains.

### Phase 5: Contact Form + Firestore
**Rationale:** LAST among features — the only stateful backend piece, with a rule-tuning loop; everything else ships static while Firebase setup is pending.
**Delivers:** Form (labels, honeypot, client validation, success/error states), submit-time `signInAnonymously` (reuse `auth.currentUser`), `addDoc` with schema, create-only Firestore rules (field validation, length caps, server timestamps), rules file in repo as source of truth, console simulator tests.
**Addresses:** Contact channel (Play inquiry mechanism), data-deletion request topic, spam resistance.
**Avoids:** A2 (open-write rules), A3 (anon-auth churn), A4 (unauthorized-domain), A5 (App Check — register in monitor mode only, enforce post-launch), F2 (form label/focus failures).
**Manual prerequisite:** Enable **Anonymous** sign-in provider; Firestore created (production mode) + rules deployed; anonymous auto-clean-up enabled.

### Phase 6: SEO, Screenshots, JSON-LD, A11y Audit, Hardening
**Rationale:** Discovery/quality gate last, once URLs are final — sitemap/OG/schema must enumerate the real page set.
**Delivers:** Real ADB screenshots (WebP, lazy-load), og-image 1200×630 with absolute URLs, sitemap.xml + robots.txt + Search Console submission, SoftwareApplication JSON-LD (**no aggregateRating**), WCAG 2.1 AA audit (axe/Lighthouse post-language-switch too), link check, App Check monitor-mode metrics review.
**Addresses:** Full SEO, rich snippets (deferred rating), screenshots, AA audit, Play pre-submission checks.
**Avoids:** E1 (rating trap), E3 (relative OG URLs), E4 (sitemap drift), F1/F2 residuals, B3 (policy ↔ SDK cross-check as the final gate before Play submission).

### Phase Ordering Rationale

- **Deploy pipeline first** — every phase validates on the live URL; existing `app-ads.txt`/verification files regression-check from day 1; Play-review dependency (E2) starts ticking immediately.
- **i18n keys authored with content, engine before ES/PT content** — avoids markup rework; swap pattern proven small (hub) before large (app).
- **Consent before Analytics, both before form's public launch** — the two ordering-critical compliance constraints (FEATURES dependency graph + B1).
- **Firebase form last among features** — only piece needing backend setup and iteration; decoupled from all static work.
- **SEO/screenshot/polish last** — URLs must be final before sitemap/OG/schema enumerate them.
- **Play Store link stays placeholder throughout** — decoupled from all phases; swap in when listing goes live.

### Research Flags

Phases likely needing deeper research during planning (`/gsd-plan-phase --research-phase`):
- **Phase 5 (Contact form/Firestore):** App Check web provider status is MEDIUM confidence (reCAPTCHA v3 vs Enterprise transition in flux — verify current provider when implementing); exact anonymous-auth cleanup behavior worth confirming. Rules shape is verified HIGH — research should target App Check only.
- **Phase 3 (i18n):** dictionary-swap pattern is established practice but MEDIUM (no canonical first-party source) — a plan-level check of edge cases (attribute swaps, `pt` → pt-BR fallback, fetch-failure UX) is cheap insurance.

Phases with standard patterns (skip research-phase):
- **Phase 1 (deploy pipeline):** fully verified first-party this session — action versions, permissions, artifact inputs, `.nojekyll`, live CDN-cache behavior.
- **Phase 2 (landing content):** static HTML/CSS craft; no external unknowns. Conversion/UX placement norms are MEDIUM (see Gaps) but low-risk to iterate.
- **Phase 4 (consent):** load-gating pattern + Consent Mode fields verified first-party (HIGH).
- **Phase 6 (SEO/a11y):** schema/sitemap/hreflang facts verified from Search Central this session; a11y thresholds are domain-standard.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Every version live-verified (npm registry, GitHub API releases, Firebase docs CDN); only SSG-tradeoff analysis is MEDIUM (training knowledge, low stakes) |
| Features | HIGH | Play User Data policy fetched directly (privacy spec, deletion requirement, affirmative-consent rule); conversion/UX norms MEDIUM (no search MCP this session) |
| Architecture | HIGH | Deploy pattern verified against action.yml primary sources + docs.github.com; Firebase flows verified first-party; i18n swap pattern MEDIUM (established practice) |
| Pitfalls | HIGH | Official docs + live probes of persano.github.io itself (cache headers, 404, trailing-slash 301); Play policy article + WCAG numbers restated MEDIUM |

**Overall confidence:** HIGH — the deploy chain, Firebase versions/APIs, consent pattern, and Play policy requirements all rest on first-party sources fetched this session. The MEDIUM residue is concentrated in areas that are cheap to verify during execution.

### Gaps to Address

- **Conversion/UX placement norms** (hero/CTA/badge placement, screenshot framing): MEDIUM, community-standard, not independently re-verified. Handle: treat as design iteration during Phase 2, not research blockers.
- **App Check web provider (v3 vs Enterprise) status:** MEDIUM and moving. Handle: verify during Phase 5 planning; do not block v1 on App Check.
- **Account-deletion mechanism details:** requirement is HIGH-verified; the concrete flow (FAQ entry + form topic + email-template manual process) is a planning decision, not a research gap. Decide in Phase 5 planning and mirror it in the policy's deletion section (B3).
- **`html-validate` exact ruleset names:** MEDIUM (training knowledge). Handle: tune config empirically in Phase 1 CI setup.
- **Form-Firebase vs consent-deny UX:** research converged on "form works after any consent choice (grant or deny), because the deletion-request path must not break" — PROJECT.md wording ("form load only after consent") should be read as "after the consent interaction," not "only after grant." Confirm this interpretation when writing the policy's Website section (Phase 1/6) and the banner behavior (Phase 4).
- **og:image / app art assets:** production task (1200×630 from app art), no research needed — schedule in Phase 6.

### Manual Prerequisites Checklist (roadmap items, not code)

1. Repo Settings → Pages → Build and deployment → Source: **GitHub Actions** (before first deploy — Phase 1)
2. Firebase console → register **Web App** in the app's existing project → copy config → authorized domain `persano.github.io` (Phase 4)
3. Enable **Anonymous** sign-in provider + anonymous auto-clean-up (Phase 5)
4. Firestore created (production mode) + rules deployed from repo file (Phase 5)
5. Google Search Console → submit sitemap (verification file already in repo — Phase 6)

## Sources

### Primary (HIGH confidence)
- **Google Play Console Help** — User Data / Privacy policy (`support.google.com/googleplay/android-developer/answer/9888076`, fetched): privacy-policy spec (no PDF, non-geofenced, entity name, contact mechanism, retention/deletion), Data-safety consistency, account deletion + web deletion resource, affirmative-consent rule; Data safety (`answer/9888379`)
- **Google Consent Mode v2** (`developers.google.com/tag-platform/security/guides/consent`, fetched): default-denied before tag load, `consent/update`, four signal names
- **Google Search Central** — Software app structured data; sitemaps; multilingual/multiregional (hreflang, locale-adaptive crawling warning, "avoid auto-redirecting between language versions") — all fetched, updated 2025-12-10
- **Firebase docs** (fetched): web learn-more (CDN modular imports, 12.18.0), anonymous auth (`/docs/auth/web/anonymous-auth`), Firestore rules get-started, API keys ("identify, not authorize"), App Check overview
- **GitHub** (fetched): docs.github.com Pages custom workflows + About Pages; `actions/deploy-pages` README; `upload-pages-artifact`/`configure-pages` action.yml (inputs incl. `include-hidden-files` default false, tar dotfile exclusion)
- **npm registry** (fetched): `firebase@12.18.0`, `html-validate@11.12.0`, `vnu-jar@26.8.30`
- **GitHub API `releases/latest`** (fetched): checkout v7.0.1, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1
- **Live probes this session:** persano.github.io (`Cache-Control: max-age=600`, ETag, 404 status behavior), trailing-slash 301 on a real Pages site
- **schema.org/SoftwareApplication** (fetched): property list
- **MDN** `Navigator.language(s)`

### Secondary (MEDIUM confidence)
- Conversion/UX norms for app landing pages (hero/badge/screenshots/CTA, OG 1200×630, indie hub patterns) — community-standard practice, no search MCP available this session; main re-verify target for phase planning
- Play privacy-policy support article in PITFALLS session was a JS shell (restated from policy knowledge) — superseded by FEATURES.md's direct fetch of the same policy family (HIGH)
- WCAG 2.1 AA numeric thresholds (4.5:1 / 3:1) — w3.org fetch blocked (Cloudflare); domain-standard knowledge
- `html-validate` ruleset names; Consent Mode v2 field names corroborated across three files (treat as verified); `.nojekyll` behavior (community knowledge, GitHub docs page relocated)
- SSG-vs-plain tradeoff (Astro 5/Eleventy 3 majors) — training knowledge + project constraints

---
*Research completed: 2026-09-02*
*Ready for roadmap: yes*
