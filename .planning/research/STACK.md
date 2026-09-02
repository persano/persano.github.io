# Technology Stack

**Project:** Persano — Personal Apps Hub + GeoHist Trivia Landing Site (persano.github.io)
**Researched:** 2026-09-01
**Mode:** Stack research (greenfield, static GitHub Pages site)
**Verification method:** Live fetches this session — npm registry, GitHub API `releases/latest`, official Google/Firebase/GitHub docs pages. No version in this report comes from memory alone unless marked otherwise.

---

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

**One-line stack:** Static hand-written HTML/CSS/JS on GitHub Pages, Firebase JS SDK 12.18.0 modular ESM from gstatic (pinned), per-language HTML subdirectories for i18n, hand-maintained sitemap + JSON-LD, GitHub Actions official deploy chain, `html-validate` as CI gate.

---

## Decision Detail

### 1. Base stack: plain hand-authored HTML/CSS/vanilla JS — no SSG, no framework

**Choice:** Every page is a real `.html` file in the repo. Shared behavior in a few small `.js` files. No build step, no bundler, no npm runtime dependency.

**Alternatives considered:**

| Alternative | Why not (for this project) |
|-------------|---------------------------|
| **Jekyll** (GitHub Pages native, auto-builds via `actions/jekyll-build-pages`) | Adds a Ruby build layer the project explicitly ruled out. Pages' whitelisted-plugin list has no real i18n plugin, so Jekyll wouldn't even help the multi-language requirement. Liquid templating buys little at ~6 unique page layouts. |
| **Astro** (current major line: 5.x) | Best-in-class SSG for content sites and the right answer for a 30+ page site. But it requires a Node build pipeline and npm dependency tree — the exact "build complexity" this project bans. With agent-maintained content, the "authoring ergonomics" argument for SSGs (writing Markdown faster than HTML) matters much less. |
| **Eleventy (11ty)** (3.x) | Same tradeoff as Astro: minimal but still a Node build step and config surface. Pays off with templating needs at higher page counts. |
| **React/Vue/SPA** | Completely wrong shape. This is an SEO-first informational landing site; a SPA framework adds runtime cost, kills crawlability without SSR (which needs a build system), and provides zero value for static content. |

**Rationale:** The maintenance model is *agent-maintained* — content updates happen via chat sessions that regenerate/edit HTML, not by a human hand-editing files. This removes the classic SSG selling point (human authoring ergonomics). Page count is small (hub + ~4 GeoHist pages × 3 languages + privacy), well under the ~15-page threshold where template duplication forces a generator. Zero-build means: push → Pages serves it; no CI failure modes from dependency rot; every file inspectable. **Revisit trigger:** if multi-language page count doubles or shared-layout duplication starts producing copy-paste bugs, move to Astro 5 — the content structure (subdir-per-language HTML) ports directly.

**Confidence: High** (project constraint + domain fit; SSG tradeoff analysis is Medium — based on training knowledge of current Astro/Eleventy majors, not a live fetch).

---

### 2. CSS approach: single shared stylesheet + custom properties + small utility layer

**Choice:** One `styles.css` for global tokens (colors, spacing, typography via CSS custom properties) + base elements + shared components (buttons, cards, header/footer). One additional stylesheet for the GeoHist pages if it grows. A handful of utility classes (`.visually-hidden`, `.container`, `.skip-link`) — the accessibility-critical ones.

**Why not Tailwind (even the CDN Play build):**
- Tailwind Play CDN is a ~100KB+ runtime JS compiler that generates styles in-browser — FOUC risk, render-blocking, and explicitly not for production per Tailwind docs.
- Tailwind via npm needs a build step — banned by constraint.
- Hand-rolled utilities + custom properties cover 100% of a 6-layout site with ~0 dead weight.

**Why not CSS framework (Bootstrap/Bulma):** landing pages need a distinctive dark, map-textured, antique-accent aesthetic; overriding a framework's look costs more than writing ~300 lines of custom CSS. Also removes accessibility surprises from framework components.

**Accessibility hooks built into the CSS choice:** `:focus-visible` styling, `prefers-reduced-motion` media query, WCAG-safe custom-property color pairs (define tokens as WCAG 2.1 AA pairs from day one — makes the audit trivial).

**Confidence: High** (low-stakes decision with clear constraint alignment).

---

### 3. Firebase JS SDK: modular v9+ API via gstatic ESM CDN, exact-pinned

**Choice:** Load as ES modules directly from Google's CDN, importing only what's used:

```html
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
</script>
```

**Verified version facts (this session):**
- npm `firebase` latest = **12.18.0** (fetched from `registry.npmjs.org/firebase/latest`).
- Official docs (`firebase.google.com/docs/web/learn-more`) serve the gstatic CDN at the same version: `https://www.gstatic.com/firebasejs/12.18.0/firebase-*.js` — modular **and** `*-compat.js` (legacy v8-namespaced) builds both published.
- **Pin the exact version** (`12.18.0`) in the import URL. Don't track "latest" — a CDN major bump silently changing behavior on a site with no test suite is an avoidable risk. Bump deliberately (one-line change), and it's a cheap Claude-session task.

**Rules of engagement:**
- **Modular API only.** Never import `firebase-app-compat.js` / v8 namespaced API in new code — it's legacy, heavier, and the compat surface exists only for migrations.
- Never `npm install firebase` for this project — the CDN import *is* the dependency (project constraint). npm firebase exists only if a future build step is adopted.
- Config values (apiKey etc.) are public by design for Firebase web apps; security lives in Firestore rules, not in hiding the key. Register the site as a Web App in the existing Firebase project and optionally restrict via authorized domains (`persano.github.io`).

**Confidence: High** — version cross-verified from two primary sources (npm registry + official docs CDN snippet) this session.

---

### 4. Firebase products used: Analytics + Anonymous Auth + Firestore

**Choice:** Exactly three products, one project (the app's existing Firebase project, after registering the website as a Web App).

| Product | Purpose | Module |
|---------|---------|--------|
| Analytics | Page/visit tracking, link clicks (Play Store CTA) | `firebase-analytics.js` |
| Anonymous Auth | Contact-form spam resistance: rules require `request.auth != null` without any signup UX | `firebase-auth.js` |
| Firestore | `messages` collection for contact submissions | `firebase-firestore.js` |

Not used and why: Realtime Database (Firestore is the modern default with better rules model), Cloud Functions (no deploy path from a static site + unnecessary for a write-only form), App Hosting/Hosting (GitHub Pages already does this), Storage (no uploads).

**Confidence: High.**

---

### 5. GDPR consent gating: load-gating pattern (stricter and simpler than consent mode)

**Choice:** Do **not** load or initialize Analytics at page load. Keep a small `consent.js` that:
1. On load, reads consent state from `localStorage` (`persano-consent` = `granted|denied|null`).
2. If `null`: show custom banner (~40 lines HTML/CSS/JS, no CMP library), buttons "Accept all" / "Essential only".
3. Only on `granted`: `import("https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js")` dynamically, then `getAnalytics(app)` and subsequent `logEvent` calls.
4. On "Accept all", also gate the contact form: it can only initialize Firebase Auth/Firestore after consent (or reveal the form only after consent — simplest compliant UX: form section renders after consent choice; privacy policy already discloses what's collected).
5. Listen for changes across tabs via the `storage` event (nice-to-have).

**Why load-gating instead of gtag Consent Mode v2:** Consent Mode (`gtag('consent', 'default', {analytics_storage:'denied', ...})` before load, then `consent('update')` on grant — fields verified on `support.google.com/analytics/answer/9976101`: `ad_storage`, `analytics_storage`; v2 adds `ad_user_data`, `ad_personalization` for EU/DMA) exists to preserve *modeled/cookieless* conversions while denied. A small app landing site gains nothing from cookieless pings. Load-gating is: fewer moving parts, zero SDK bytes before consent (better LCP for EU visitors), trivially auditable ("no script, no tracking" is stronger than "SDK loaded but consent-denied"). It also automatically satisfies the `ad_user_data`/`ad_personalization` v2 fields since nothing loads.

**Why not a CMP library (Cookiebot, Klaro, Osano):** one banner, two choices, no ads on the website itself. A library adds a dependency + IAB TCF complexity the site doesn't need. Custom banner also fully styles-consistent and ~50 lines the agent can maintain.

**Confidence: High** for the pattern (canonical consent-mode doc fetched this session; load-gating is the conservative superset). Medium for the claim that `ad_user_data`/`ad_personalization` are the exact v2 field names (from training knowledge of the March 2024 EU rollout; the fetched support page confirmed the two storage fields).

---

### 6. Contact form: anonymous auth + Firestore `create`-only rules + honeypot

**Choice:** Flow on submit:
1. Client-side validation (required fields, length caps, honeypot field must be empty).
2. `signInAnonymously(getAuth())` (cached by default persistence — subsequent visits reuse the anonymous uid).
3. `addDoc(collection(db, "messages"), {...})` with a fixed schema: `{ name, email, subject, body, locale, userAgent, createdAt: serverTimestamp(), uid }`.
4. Users see success/error inline. No email delivery (v1) — submissions live in Firestore console; owner reads them.

**Firestore rules (the actual spam resistance):**

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{id} {
      allow create: if request.auth != null
        && request.resource.data.keys().hasAll(['name','email','body','createdAt'])
        && request.resource.data.keys().hasOnly(['name','email','subject','body','locale','userAgent','createdAt','uid'])
        && request.resource.data.name is string && request.resource.data.name.size() > 1 && request.resource.data.name.size() < 100
        && request.resource.data.email is string && request.resource.data.email.matches('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')
        && request.resource.data.body is string && request.resource.data.body.size() > 1 && request.resource.data.body.size() < 5000
        && request.resource.data.createdAt == request.time;
      allow read, update, delete: if false; // owner reads via console only
    }
  }
}
```

Key properties: **create-only** (no scraping of other visitors' submissions — there are none anyway since reads are false, but rules defense-in-depth), schema-locked via `hasOnly`, server-authoritative timestamps (`request.time`), anonymous auth required.

**Honest limits (important for planning):** anonymous auth stops *nothing* by itself against a scripted attacker (they can create anonymous accounts too, and the web API key is public). Real spam resistance for this scale = Firestore rules validation + honeypot + (optionally, phase 2) **Firebase App Check**. App Check web providers: reCAPTCHA Enterprise is the currently recommended provider; legacy reCAPTCHA v3 support is being phased out — verify current provider status when implementing that phase. Do not block v1 on App Check; the honeypot + rules validation is proportionate for a new site's contact form.

**Anti-pattern to avoid:** writing the form through an unrestricted "open write" collection or through client-side-only validation. Also avoid email-sending add-ons (Cloud Functions + SendGrid) — out of scope, adds secrets management.

**Confidence: High** for the flow and rules shape (verified API surface on `firebase.google.com/docs/auth/web/anonymous-auth` — slug changed from `/anonymous`, fetched this session; Firestore rules get-started fetched). **Medium** for App Check provider specifics (reCAPTCHA Enterprise recommendation is from training knowledge).

---

### 7. i18n: per-language HTML subdirectories (NOT JSON-DOM-swap), hreflang + auto-detect

**Choice:** Three parallel static trees. Language pages are complete, pre-rendered HTML files:

```
/                     → hub, EN (default)
/es/                  → hub, ES
/pt/                  → hub, PT-BR
/geohist/             → app landing, EN
/geohist/es/          → app landing, ES
/geohist/pt/          → app landing, PT
/geohist/guide.html   → EN only (v1 scope)
/geohist/privacy.html → EN only (legally authoritative)
```

- `<html lang="...">` correct per file; every page declares self-referencing `link rel="alternate" hreflang` for all three + `x-default` → `/geohist/`. (Google Search Central requires alternates to be reciprocal/self-referencing — verified on the international docs page this session, slug: `managing-multi-regional-sites`.)
- **Auto-detect:** tiny inline script (runs before paint on the root landing pages only): `navigator.language` → if `es-*` or `pt-*` and no `sessionStorage.persano-lang-redirect`, redirect to the matching subdir, set the flag. EN is the canonical URL and no-redirect fallback. The manual switcher (visible footer/header links) sets the same flag and navigates — so crawlers (no JS storage) and humans (explicit choice) are both respected. Never UA-sniff server-side (GitHub Pages can't) and never redirect on deep pages — root pages only.
- **What JSON dictionaries are still for:** dynamic strings that don't exist in pre-rendered HTML — form validation messages, consent-banner text, success/error toasts. One small `i18n/{locale}.json` (or a JS object) swapped via `data-i18n` attributes on those few nodes. That's the *complement*, not the primary mechanism.

**Why not JSON dictionary + JS DOM swap as the primary mechanism (the tempting "one file per page" approach):**
1. **SEO:** crawlers index the pre-JS DOM → all three languages collapse into one indexed URL in one language; you lose per-language targeting entirely. hreflang has nothing to point at.
2. No separate URLs per language → can't share/share-target language-specific links, no per-language Search Console performance data.
3. Flash of untranslated content on slow devices; content invisible if JS fails — directly conflicts with the WCAG 2.1 AA goal.
4. The duplication cost it avoids is small: ~6 unique page layouts × 3 languages with agent-maintained content = mechanical copy edits.

**Why not Jekyll/SSG i18n:** Pages' whitelisted plugin set has no i18n story, and any SSG contradicts the zero-build constraint (see Decision 1).

**Confidence: High** — SEO reasoning grounded in Google Search Central international docs fetched this session; pattern is the standard one for hand-built static multilingual sites.

---

### 8. SEO tooling: hand-rolled sitemap.xml + robots.txt + SoftwareApplication JSON-LD

**Choice:** No tooling needed — these files are tiny, static, and agent-maintained:

- **`sitemap.xml`** (root): full URL list including `/es/`, `/pt/`, `/geohist/*` variants, with `xhtml:link rel="alternate" hreflang` entries per URL. XML format (Search Central also accepts `.txt`/RSS/Atom — XML is the right default). Submit via Google Search Console (verification already exists in this repo).
- **`robots.txt`** (root): allow all, `Sitemap: https://persano.github.io/sitemap.xml`. No crawl-delay, no disallow rules (nothing to hide — the Firebase config values being public is fine; robots can't protect anything anyway).
- **`SoftwareApplication` JSON-LD** on `/geohist/` (verified field list from Google Search Central's software-app schema page this session):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "GeoHist Trivia",
  "operatingSystem": "Android",
  "applicationCategory": "GameApplication",
  "description": "...",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Person", "name": "Santiago David Postorivo" },
  "url": "https://persano.github.io/geohist/"
}
</script>
```

  ⚠️ **Do not add `aggregateRating` until real ratings exist** — Search Central treats fabricated review markup as structured-data spam. Add it (from Play listing data) after launch.
- **Per-page SEO:** unique `<title>` + `<meta name="description">`, Open Graph (`og:title/description/image/url/type`), Twitter `summary_large_image`, canonical URL per language page, one `og-image.png` (1200×630) generated from app art.
- Play Store link: `<a rel="noopener">` to the `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` package URL — placeholder-safe because the package ID is fixed; the listing going live is all that's needed.

**Confidence: High** — all schema/sitemap/hreflang facts from Search Central pages fetched this session.

---

### 9. Deployment: GitHub Actions official Pages chain

**Choice:** Custom workflow (not "deploy from branch") — CI validation *gates* deployment. Verified latest majors via GitHub API `releases/latest` this session:

| Action | Pin | Role |
|--------|-----|------|
| `actions/checkout` | `@v7` (v7.0.1) | Fetch repo |
| `actions/configure-pages` | `@v6` (v6.0.0) | Enables Pages metadata |
| `actions/upload-pages-artifact` | `@v5` (v5.0.0) | Uploads site as artifact |
| `actions/deploy-pages` | `@v5` (v5.0.1) | Deploys artifact to Pages CDN |

```yaml
name: Deploy
on:
  push: { branches: [main] }
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  validate:            # html-validate (+ optional link check) must pass first
    ...
  deploy:
    needs: validate
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v7
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with: { path: '.' }
      - id: deployment
        uses: actions/deploy-pages@v5
```

Requires repo Settings → Pages → Source: **GitHub Actions** (one-time manual step — plan for it).
Note: GitHub's docs page still shows older majors (`@v4`/`@v5`) in samples; the API-verified versions above are current.

**Why not deploy-from-branch:** loses the validation gate (validate job must pass before deploy — the project requires CI-validated deploys) and the artifact model gives immutable deployments.

**Confidence: High** — all four versions from GitHub API this session.

---

### 10. HTML validation tooling for CI

**Choice:** **`html-validate`** (npm, current **11.12.0**) as the primary gate, run with `npx html-validate "**/*.html"` in the `validate` job. Config file (`.htmlvalidate.json`) tuned: enable rules `require-doctype`, `no-duplicate-id`, `wcag` ruleset subset (missing alt, label association, heading order), disable pedantic rules that fight hand-authored pages (e.g., inline-style restrictions) as needed.

**Alternatives:**

| Tool | Verdict |
|------|---------|
| **`vnu-jar`** (W3C Nu validator, npm wrapper, current **26.8.30**) | The strictest, spec-grade validator. Needs Java (`setup-java`) → slower CI, more moving parts. Good as a *secondary* audit run (weekly or per-milestone), not the fast inner-loop gate. |
| `tidy` (HTML Tidy) | Legacy; not spec-grade, noisy on modern HTML. Skip. |
| `linkinator` / `lychee` (link checkers, npm/Rust) | Optional third step: catches the #1 real-world rot on hand-maintained sites (dead Play Store/docs links). Recommend `linkinator` (pure npm, no binary). Low priority — phase 2+ CI hardening. |

**`package.json` consequence:** runtime has **zero npm dependencies** (Firebase comes from CDN). `package.json` exists only for devDependencies (`html-validate`, optional `linkinator`, optional `markdownlint` if content moves to md). `npx` without install also works in CI.

**Confidence: High** for versions (npm registry this session) and the primary/secondary split; Medium on exact `html-validate` ruleset names (from training knowledge).

---

### 11. Supporting libraries (complete list)

| Library | Version | Purpose | When |
|---------|---------|---------|------|
| Firebase JS SDK (gstatic ESM) | 12.18.0 pinned | Analytics, Auth, Firestore | Runtime, consent-gated |
| html-validate | 11.12.0 (dev) | CI HTML validation | CI validate job |
| vnu-jar | 26.8.30 (dev, optional) | Spec-grade audit | Periodic audits |
| linkinator | latest (dev, optional) | Dead-link check | Phase 2+ CI |
| Everything else | — | — | **Nothing.** No runtime npm deps, no fonts CDN needed (system font stack fits the antique aesthetic; avoids Google Fonts privacy/latency), no icon library (inline SVG), no JS libraries for sliders/lightbox (~30 lines vanilla) |

---

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

---

## Installation / Setup (nothing to install at runtime)

```bash
# Dev tooling only (optional — CI can use npx)
npm install -D html-validate@11 linkinator
```

Manual one-time steps (roadmap items, not code):
1. Firebase console → register **Web App** in existing project → copy config → authorized domain `persano.github.io`.
2. Enable **Anonymous** sign-in provider; create Firestore (production mode) + deploy rules from Decision 6.
3. Repo Settings → Pages → Source: **GitHub Actions**.
4. Google Search Console → submit sitemap (verification already in repo).

## Sources

Verified live this session (2026-09-01), all **High** confidence unless noted:

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
