<!-- GSD:project-start source:PROJECT.md -->

## Project

**Persano — Personal Apps Hub + GeoHist Trivia Site**

A static GitHub Pages website at https://persano.github.io serving as Santiago David Postorivo's personal brand hub ("Persano"). The root page is a minimal portfolio hub introducing the developer and linking to per-app sites. The first and primary app site is `/geohist/` — a complete landing page for **GeoHist Trivia**, an Android trivia game (history + geography, Jetpack Compose, Google Play Games Services, IAP, AdMob, offline-capable, 20 localizations) currently in Google Play review. The site lets players learn about the game, view screenshots, read the FAQ and game guide, access the privacy policy, and contact the developer via a Firebase-powered contact form.

**Core Value:** GeoHist Trivia players and Google Play reviewers can reach an authoritative, accessible web page for the app — featuring it, explaining it, hosting its privacy policy, and offering a working contact channel — before the app goes live.

### Constraints

- **Tech stack**: Plain HTML/CSS (vanilla JS for interactivity) — zero build step, GitHub Pages native
- **Hosting**: GitHub Pages, default URL `persano.github.io`, GeoHist site in `/geohist/` subdir from day 1
- **Deployment**: Push → GitHub Actions CI (validate) → Pages deploy
- **Dependencies**: Firebase JS SDK via CDN; no other runtime dependencies
- **Content source**: Screenshots and app facts from `C:\Users\Familia\antigravity\GeoHist-Trivia`
- **Compatibility**: Modern evergreen browsers; responsive mobile-first (most game traffic is mobile)

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommendation Summary

| # | Decision | Pick | Version (verified 2026-09-01) | Confidence |
|---|----------|------|-------------------------------|------------|
| 1 | Base stack | Hand-authored HTML5 + CSS3 + vanilla ES2020+ JS. No framework, no SSG | n/a (platform) | High |
| 2 | CSS approach | One shared stylesheet per site area + CSS custom properties + small utility layer. No Tailwind | n/a | High |
| 3 | Firebase JS SDK | **Modular (v9+ API) via gstatic ESM CDN, exact-pinned** | **12.18.0** | High |
| 4 | Firebase products | Analytics + Anonymous Auth + Firestore (cloud Firestore, not RTDB) | same SDK | High |
| 5 | Analytics consent gating | Load-gating: don't import `firebase/analytics` until consent; custom ~50-line consent banner | n/a | High |
| 6 | Contact form | `signInAnonymously()` → `addDoc()` to `messages` collection; rules `create`-only; honeypot; App Check as later hardening | n/a | High (form) / Medium (App Check details) |
| 7 | i18n (EN/ES/PT) | **Per-language static HTML in subdirs** (`/es/`, `/pt/`) + hreflang alternates + tiny detect/redirect script | n/a | High |
| 8 | SEO tooling | Hand-rolled `sitemap.xml` + `robots.txt` + `SoftwareApplication` JSON-LD + Open Graph | n/a | High |
| 9 | Deployment | GitHub Actions official Pages chain: `actions/checkout@v7` → `actions/configure-pages@v6` → `actions/upload-pages-artifact@v5` → `actions/deploy-pages@v5` | see detail | High |
| 10 | HTML validation (CI) | `html-validate` npm CLI (Node, no Java) | 11.12.0 | High |
| 11 | Optional CI extras | `vnu-jar` (W3C Nu) 26.8.30, `linkinator` link check | see detail | Medium–High |
| 12 | Runtime dependencies | Firebase CDN only. `package.json` exists solely for dev tooling | n/a | High |

## Decision Detail

### 1. Base stack: plain hand-authored HTML/CSS/vanilla JS — no SSG, no framework

| Alternative | Why not (for this project) |
|-------------|---------------------------|
| **Jekyll** (GitHub Pages native, auto-builds via `actions/jekyll-build-pages`) | Adds a Ruby build layer the project explicitly ruled out. Pages' whitelisted-plugin list has no real i18n plugin, so Jekyll wouldn't even help the multi-language requirement. Liquid templating buys little at ~6 unique page layouts. |
| **Astro** (current major line: 5.x) | Best-in-class SSG for content sites and the right answer for a 30+ page site. But it requires a Node build pipeline and npm dependency tree — the exact "build complexity" this project bans. With agent-maintained content, the "authoring ergonomics" argument for SSGs (writing Markdown faster than HTML) matters much less. |
| **Eleventy (11ty)** (3.x) | Same tradeoff as Astro: minimal but still a Node build step and config surface. Pays off with templating needs at higher page counts. |
| **React/Vue/SPA** | Completely wrong shape. This is an SEO-first informational landing site; a SPA framework adds runtime cost, kills crawlability without SSR (which needs a build system), and provides zero value for static content. |

### 2. CSS approach: single shared stylesheet + custom properties + small utility layer

- Tailwind Play CDN is a ~100KB+ runtime JS compiler that generates styles in-browser — FOUC risk, render-blocking, and explicitly not for production per Tailwind docs.
- Tailwind via npm needs a build step — banned by constraint.
- Hand-rolled utilities + custom properties cover 100% of a 6-layout site with ~0 dead weight.

### 3. Firebase JS SDK: modular v9+ API via gstatic ESM CDN, exact-pinned

- npm `firebase` latest = **12.18.0** (fetched from `registry.npmjs.org/firebase/latest`).
- Official docs (`firebase.google.com/docs/web/learn-more`) serve the gstatic CDN at the same version: `https://www.gstatic.com/firebasejs/12.18.0/firebase-*.js` — modular **and** `*-compat.js` (legacy v8-namespaced) builds both published.
- **Pin the exact version** (`12.18.0`) in the import URL. Don't track "latest" — a CDN major bump silently changing behavior on a site with no test suite is an avoidable risk. Bump deliberately (one-line change), and it's a cheap Claude-session task.
- **Modular API only.** Never import `firebase-app-compat.js` / v8 namespaced API in new code — it's legacy, heavier, and the compat surface exists only for migrations.
- Never `npm install firebase` for this project — the CDN import *is* the dependency (project constraint). npm firebase exists only if a future build step is adopted.
- Config values (apiKey etc.) are public by design for Firebase web apps; security lives in Firestore rules, not in hiding the key. Register the site as a Web App in the existing Firebase project and optionally restrict via authorized domains (`persano.github.io`).

### 4. Firebase products used: Analytics + Anonymous Auth + Firestore

| Product | Purpose | Module |
|---------|---------|--------|
| Analytics | Page/visit tracking, link clicks (Play Store CTA) | `firebase-analytics.js` |
| Anonymous Auth | Contact-form spam resistance: rules require `request.auth != null` without any signup UX | `firebase-auth.js` |
| Firestore | `messages` collection for contact submissions | `firebase-firestore.js` |

### 5. GDPR consent gating: load-gating pattern (stricter and simpler than consent mode)

### 6. Contact form: anonymous auth + Firestore `create`-only rules + honeypot

### 7. i18n: per-language HTML subdirectories (NOT JSON-DOM-swap), hreflang + auto-detect

- `<html lang="...">` correct per file; every page declares self-referencing `link rel="alternate" hreflang` for all three + `x-default` → `/geohist/`. (Google Search Central requires alternates to be reciprocal/self-referencing — verified on the international docs page this session, slug: `managing-multi-regional-sites`.)
- **Auto-detect:** tiny inline script (runs before paint on the root landing pages only): `navigator.language` → if `es-*` or `pt-*` and no `sessionStorage.persano-lang-redirect`, redirect to the matching subdir, set the flag. EN is the canonical URL and no-redirect fallback. The manual switcher (visible footer/header links) sets the same flag and navigates — so crawlers (no JS storage) and humans (explicit choice) are both respected. Never UA-sniff server-side (GitHub Pages can't) and never redirect on deep pages — root pages only.
- **What JSON dictionaries are still for:** dynamic strings that don't exist in pre-rendered HTML — form validation messages, consent-banner text, success/error toasts. One small `i18n/{locale}.json` (or a JS object) swapped via `data-i18n` attributes on those few nodes. That's the *complement*, not the primary mechanism.

### 8. SEO tooling: hand-rolled sitemap.xml + robots.txt + SoftwareApplication JSON-LD

- **`sitemap.xml`** (root): full URL list including `/es/`, `/pt/`, `/geohist/*` variants, with `xhtml:link rel="alternate" hreflang` entries per URL. XML format (Search Central also accepts `.txt`/RSS/Atom — XML is the right default). Submit via Google Search Console (verification already exists in this repo).
- **`robots.txt`** (root): allow all, `Sitemap: https://persano.github.io/sitemap.xml`. No crawl-delay, no disallow rules (nothing to hide — the Firebase config values being public is fine; robots can't protect anything anyway).
- **`SoftwareApplication` JSON-LD** on `/geohist/` (verified field list from Google Search Central's software-app schema page this session):
- **Per-page SEO:** unique `<title>` + `<meta name="description">`, Open Graph (`og:title/description/image/url/type`), Twitter `summary_large_image`, canonical URL per language page, one `og-image.png` (1200×630) generated from app art.
- Play Store link: `<a rel="noopener">` to the `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` package URL — placeholder-safe because the package ID is fixed; the listing going live is all that's needed.

### 9. Deployment: GitHub Actions official Pages chain

| Action | Pin | Role |
|--------|-----|------|
| `actions/checkout` | `@v7` (v7.0.1) | Fetch repo |
| `actions/configure-pages` | `@v6` (v6.0.0) | Enables Pages metadata |
| `actions/upload-pages-artifact` | `@v5` (v5.0.0) | Uploads site as artifact |
| `actions/deploy-pages` | `@v5` (v5.0.1) | Deploys artifact to Pages CDN |

### 10. HTML validation tooling for CI

| Tool | Verdict |
|------|---------|
| **`vnu-jar`** (W3C Nu validator, npm wrapper, current **26.8.30**) | The strictest, spec-grade validator. Needs Java (`setup-java`) → slower CI, more moving parts. Good as a *secondary* audit run (weekly or per-milestone), not the fast inner-loop gate. |
| `tidy` (HTML Tidy) | Legacy; not spec-grade, noisy on modern HTML. Skip. |
| `linkinator` / `lychee` (link checkers, npm/Rust) | Optional third step: catches the #1 real-world rot on hand-maintained sites (dead Play Store/docs links). Recommend `linkinator` (pure npm, no binary). Low priority — phase 2+ CI hardening. |

### 11. Supporting libraries (complete list)

| Library | Version | Purpose | When |
|---------|---------|---------|------|
| Firebase JS SDK (gstatic ESM) | 12.18.0 pinned | Analytics, Auth, Firestore | Runtime, consent-gated |
| html-validate | 11.12.0 (dev) | CI HTML validation | CI validate job |
| vnu-jar | 26.8.30 (dev, optional) | Spec-grade audit | Periodic audits |
| linkinator | latest (dev, optional) | Dead-link check | Phase 2+ CI |
| Everything else | — | — | **Nothing.** No runtime npm deps, no fonts CDN needed (system font stack fits the antique aesthetic; avoids Google Fonts privacy/latency), no icon library (inline SVG), no JS libraries for sliders/lightbox (~30 lines vanilla) |

## What NOT to Use (explicit)

| Do not use | Why |
|------------|-----|
| SSGs: Jekyll / Astro / Eleventy | Zero-build constraint; agent-maintained content removes the authoring-ergonomics benefit; page count too low. Revisit only past ~15 pages (see Decision 1). |
| React / Vue / any SPA | SEO-first static site; adds build step, runtime cost, zero payoff. |
| Tailwind (CDN or build) | CDN build is a runtime JS compiler (FOUC, not for production); build variant violates constraint; hand-rolled tokens suffice at this scale. |
| Firebase `*-compat.js` (v8 namespaced API) | Legacy surface; heavier; new code should be modular-only. |
| npm `firebase` package at runtime | CDN import *is* the dependency (project constraint); npm copy needs a bundler. |
| gtag Consent Mode as the primary gate | Preserves cookieless measurement the site doesn't need; load-gating is simpler and stricter. |
| CMP/consent libraries (Cookiebot, Klaro…) | One two-choice banner doesn't justify a dependency + TCF complexity. |
| JSON-dictionary JS-swap as primary i18n | Kills per-language SEO, hreflang targets, no-JS accessibility. |
| Firebase Cloud Functions / email add-ons for the form | Secrets, deploy surface, cost — all avoided; Firestore console suffices for reading submissions. |
| Jekyll i18n plugins / pages-plugins whitelist bets | Not on the Pages whitelist; contradicts zero-build. |
| `aggregateRating` in JSON-LD before real ratings | Structured-data spam → manual actions. |

## Installation / Setup (nothing to install at runtime)

# Dev tooling only (optional — CI can use npx)

## Sources

- npm registry — `firebase@12.18.0`, `html-validate@11.12.0`, `vnu-jar@26.8.30` (`registry.npmjs.org/<pkg>/latest`)
- Firebase docs — CDN modular imports + gstatic version strings: `firebase.google.com/docs/web/learn-more`
- Firebase docs — anonymous auth (current slug `…/docs/auth/web/anonymous-auth`): `firebase.google.com/docs/auth/web/anonymous-auth`
- Firebase docs — Firestore security rules get-started: `firebase.google.com/docs/firestore/security/get-started`
- Consent Mode (fields `ad_storage`, `analytics_storage`): `support.google.com/analytics/answer/9976101` — v2 `ad_user_data`/`ad_personalization` from training knowledge (Medium)
- GitHub API `releases/latest` — `actions/checkout` v7.0.1, `actions/configure-pages` v6.0.0, `actions/upload-pages-artifact` v5.0.0, `actions/deploy-pages` v5.0.1, `actions/upload-artifact` v7.0.1
- Google Search Central — SoftwareApplication schema: `developers.google.com/search/docs/appearance/structured-data/software-app`
- Google Search Central — sitemaps: `developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap`
- Google Search Central — multilingual/multiregional (hreflang): `developers.google.com/search/docs/specialty/international/managing-multi-regional-sites`
- SSG-vs-plain tradeoff analysis: training knowledge + project constraints (**Medium** — not independently re-verified this session)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
