# Architecture Patterns: Static Multi-App GitHub Pages Site

**Project:** Persano — personal-brand hub + `/geohist/` app site (future app subdirs)
**Researched:** 2026-09-01
**Mode:** Architecture dimension (greenfield)
**Overall confidence:** HIGH (GitHub Pages deploy pattern, Firebase CDN SDK, Consent Mode verified against first-party docs; i18n pattern = established practice, MEDIUM)

---

## 1. Key Structural Insight

`persano.github.io` is a **user site** (repo named `<owner>.github.io`), so the site root IS the domain root: `https://persano.github.io/` (verified: GitHub docs, user/organization site lives in `<owner>.github.io` repo, default location `http(s)://<owner>.github.io`). This is what makes the simplest possible architecture work:

- **Every app is a plain subdirectory.** `/geohist/` today, `/nextapp/` tomorrow. No routing, no subdomains, no build transforms.
- **Root-absolute paths work everywhere.** `/shared/css/base.css` resolves identically from `/index.html` and from `/geohist/guide.html`. Relative paths would shift with page depth; root-absolute never does. (Caveat: this guarantee exists only because it's a user site — if the repo ever moved to a project site, `/repo-name/` prefix would break root-absolute paths. Not a real risk here.)
- **Zero build = the repo tree IS the deploy tree.** What `git push` contains is what `deploy-pages` ships. This constrains everything below: no templating, no bundling, so all reuse happens at runtime (ES modules, shared CSS) or via copy-paste discipline.

## 2. Proposed Directory Tree

```
persano.github.io/
├── index.html                      # Root hub: intro, app cards (GeoHist card links /geohist/)
├── 404.html                        # Single root 404 — GitHub Pages serves it domain-wide
├── .nojekyll                       # Skip Jekyll build entirely (see Pitfalls)
├── robots.txt                      # Allow all + sitemap pointer
├── sitemap.xml                     # Hub + /geohist/ pages (EN canonical)
├── app-ads.txt                     # EXISTS — keep (AdMob publisher verification)
├── google7da873f4e9609872.html     # EXISTS — keep (Search Console verification)
├── GeoHist_Trivia_Privacy_Policy.* # EXISTS — keep .pdf/.md as Play Console source artifacts
├── README.md
│
├── shared/                         # Cross-app assets ONLY (anything 2+ apps need)
│   ├── css/
│   │   └── base.css                # Design tokens (dark map-texture theme vars), reset, a11y helpers
│   ├── js/
│   │   ├── i18n.js                 # Language engine: detect → fetch dict → DOM swap
│   │   ├── consent.js              # Banner UI + consent state persistence + gate emitter
│   │   └── firebase-config.js      # Firebase config object (public keys — safe to commit)
│   └── i18n/
│       ├── hub-en.json             # Hub-level strings only
│       ├── hub-es.json
│       └── hub-pt-BR.json
│
├── geohist/                        # GeoHist Trivia app site (self-contained)
│   ├── index.html                  # Landing: hero, features, gallery, FAQ, contact form
│   ├── guide.html                  # How to play
│   ├── privacy.html                # Privacy policy, EN only (canonical copy lives here)
│   ├── css/
│   │   └── site.css                # GeoHist-specific styles (imports nothing; assumes base.css loaded)
│   ├── js/
│   │   ├── landing.js              # Gallery lightbox, FAQ accordion, scroll behaviors
│   │   └── contact-form.js         # Firebase auth + Firestore submit (consent-gated init)
│   ├── i18n/
│   │   ├── en.json
│   │   ├── es.json
│   │   └── pt-BR.json
│   └── img/
│       ├── og.jpg                  # Open Graph card (1200×630)
│       ├── screenshots/            # ADB-captured, multi-resolution
│       └── icons/
│
└── .github/
    └── workflows/
        └── deploy.yml              # Validate → upload artifact → deploy to Pages
```

**Directory rules (enforced by convention):**

| Rule | Rationale |
|------|-----------|
| `/shared/` holds only what ≥2 apps use | Keeps apps independently removable/movable; avoids a junk drawer |
| Each app dir owns its `css/`, `js/`, `i18n/`, `img/` | An app site is a copy-pasteable unit for future milestones |
| No underscore-prefixed files/dirs anywhere | Jekyll ignores `_foo` paths; `.nojekyll` makes it moot but belt-and-suspenders |
| Existing root files (`app-ads.txt`, `google*.html`) untouched in place | Play Console + Search Console already reference them |
| Privacy HTML served at `/geohist/privacy.html` | Play Console "privacy policy URL" points at it; `.pdf`/`.md` stay at root as archival source copies |

## 3. Page Inventory

| Page | Path | i18n | Notes |
|------|------|------|-------|
| Hub | `/index.html` | EN/ES/PT via `/shared/i18n/hub-*.json` | Minimal: brand, one-paragraph bio, app cards |
| GeoHist landing | `/geohist/index.html` | EN/ES/PT via `/geohist/i18n/*.json` | Hero, features, screenshot gallery, FAQ, download CTA, contact form |
| Game guide | `/geohist/guide.html` | EN/ES/PT | Standalone how-to-play |
| Privacy policy | `/geohist/privacy.html` | **EN only (static HTML, no i18n)** | Deliberate: EN is legally authoritative; no dictionary dependency |
| 404 | `/404.html` | EN only | Light page, links to hub + `/geohist/`; GitHub Pages serves root 404 for the whole domain |

## 4. Shared-Asset Strategy Without a Build Step

**Recommendation: root `/shared/` + ES modules + root-absolute paths + manual `?v=` cache busting.**

- **ES module scripts** (`<script type="module" src="/shared/js/i18n.js">`) give real `import`/`export` in browsers with zero tooling. App pages do `import { initI18n } from '/shared/js/i18n.js'`. No bundler, no concatenation, evergreen browsers only — matches constraints.
- **What is shared vs app-owned:** only `i18n.js`, `consent.js`, `firebase-config.js`, and `base.css` are shared. Everything app-specific (landing behaviors, contact form, dictionaries, images) lives in the app dir. When the second app arrives, it imports the same three JS modules — that's the test for whether something belongs in `/shared/`.
- **Cache busting:** Pages serves with short cache lifetimes for HTML but longer for assets. Since content updates are agent-made via commits (not high-frequency), a plain `?v=2` query string bumped when a file meaningfully changes is sufficient — no hashing toolchain. Cheap, visible, works.
- **Per-app CSS relationship:** `geohist/css/site.css` assumes `base.css` is loaded first (two `<link>` tags, no CSS `@import` — `@import` serializes requests and hurts paint time).

**Rejected alternatives:**
- *Per-app copies of i18n/consent code* — 3 files × N apps of divergence risk for agent-maintained content; a fix in consent logic would need replaying in every app dir.
- *JS-driven everything from one root `main.js`* — coupling; apps stop being self-contained.
- *Per-language page copies* (e.g. `/geohist/es/index.html`) — 3× file count, manual divergence, violates zero-build simplicity. See §5.

## 5. i18n Data Flow (JS-driven, one HTML set per page)

**Decision: JS dictionary swap, not per-language pages.** Rationale: 3 languages × 4 translated pages; page-copy duplication triples maintenance for an agent-maintained site and invites drift. Accepted tradeoff: Google indexes the EN default (privacy policy is EN-only anyway, and the audience is English/Spanish/Portuguese Play traffic where the Play Store listing already localizes).

```
Page load (HTML ships EN text as default → zero flash-of-wrong-language risk
           for EN users; non-EN users see a brief EN flash before swap)
   │
   ▼
i18n.js init
   1. pref = localStorage['persano-lang']          # manual switcher choice, sticky
   2. else lang = detectBrowser():  navigator.languages[]
        prefix-match: es* → es, pt* → pt-BR, else → en
   3. resolved = pref || detected || 'en'
   4. fetch(`/geohist/i18n/${resolved}.json`)      # app-scoped dict
        (hub pages fetch /shared/i18n/hub-${resolved}.json)
        fetch failure → fall back to en.json → if that fails, keep shipped EN markup
   5. swap: document.querySelectorAll('[data-i18n]')   → textContent
            [data-i18n-attr="placeholder:key"] etc.    → attributes
            <html lang>                                → resolved code
   6. emit 'i18n:changed' event                     # other modules can react
   ▼
Manual switcher (footer / header select)
   → localStorage['persano-lang'] = choice         # persists across visits
   → re-run swap (step 4–5) with cached dict if same page, else navigation
```

**Boundaries of the i18n engine:** it owns detection, dictionary fetch, DOM swap, and preference persistence. It does NOT know about Firebase, consent, or app content. Dictionaries are flat key→string JSON; missing keys fall through to the shipped EN markup silently (and could log a console warning during agent review).

## 6. Firebase Init + Consent Flow

**Architecture: strict consent gate.** Per PROJECT.md ("Analytics and form load only after consent"), no Google script is loaded until the user grants — stronger than Google's standard Consent Mode (which loads the tag but sends cookieless pings). If any gtag ever loads, the Consent-Mode-v2 rule applies: `gtag('consent', 'default', {ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied'})` must run BEFORE the tag loads — order is vital (verified: developers.google.com consent guide).

```
                        ┌──────────────────────────────┐
                        │ Page load                    │
                        │ (NO firebase-*.js script tag │
                        │  in HTML — zero by default)  │
                        └──────────────┬───────────────┘
                                       ▼
                        ┌──────────────────────────────┐
                        │ consent.js:                  │
                        │ state = localStorage         │
                        │         ['persano-consent']  │
                        └───────┬──────────────┬───────┘
                       unset    │              │ set (granted / denied)
                                ▼              ▼
                     ┌──────────────┐   ┌─────────────────────────┐
                     │ Show banner  │   │ emit 'consent:ready'    │
                     │ (Accept /    │   │ granted  → unblock      │
                     │  Decline)    │   │ denied   → stay blocked │
                     └───┬──────┬───┘   └─────────────────────────┘
                Accept   │      │  Decline
                         ▼      └────────────► (persist 'denied',
   persist 'granted' ────────────┐            Analytics never loads,
   emit 'consent:granted'        │             form still works)
                         ▼       │
   ┌─────────────────────────────┴───────────────────┐
   │ consent:granted → dynamic import                │
   │   firebase-app.js + firebase-analytics.js       │
   │   initializeApp(config) + getAnalytics(app)     │
   │   (page_view logged on init)                    │
   └─────────────────────────────────────────────────┘

CONTACT FORM PATH (independent of Analytics consent):
   user submits form
      → contact-form.js validates client-side
      → dynamic import firebase-app.js + firebase-auth.js + firebase-firestore.js
      → signInAnonymously(auth)                    # spam gate: Firestore rules
                                                   #   require request.auth != null
      → addDoc(collection(db,'contact-messages'),  # server timestamp, honeypot field
               {name, email, message, lang, ts})
      → success/error UI
   Rationale: anonymous auth is an anti-spam mechanism, not tracking;
   form must work even when visitor declined Analytics.
```

**Where things live:**

| Concern | Location | Notes |
|---------|----------|-------|
| Firebase config keys | `/shared/js/firebase-config.js` | Public identifiers, safe to commit (same project as app; web-app registration needed once in Firebase console) |
| Consent state | `localStorage['persano-consent']` | Values: `granted` / `denied`; absent = ask |
| Language pref | `localStorage['persano-lang']` | Absent = auto-detect each visit |
| Firestore rules | Firebase console (not in this repo) | `allow create: if request.auth != null && <field constraints>`; anonymous users auto-clean after 30 days if enabled |
| Analytics init | lazy `import()` inside consent handler only | Never a static `<script>` tag |

**SDK loading shape:** Firebase 12.x modular CDN, ESM dynamic imports pinned to a version: `https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js` etc. (verified current in Firebase docs). Pin the version in code; upgrade deliberately.

## 7. CI/Deploy Flow (GitHub Actions artifact pattern)

**Decision: `actions/configure-pages` + `upload-pages-artifact` + `deploy-pages` (the official custom-workflow pattern), not branch deploy.** Verified against docs.github.com custom-workflows guide and the actions' own `action.yml` files.

Why artifact over `gh-pages` branch: no second branch to keep clean, deploy is a first-class deployment with environment history and rollback, and the pattern is GitHub's current recommendation for custom workflows.

```
git push → main
   │
   ▼
GitHub Actions: deploy.yml
   permissions: contents: read, pages: write, id-token: write
   concurrency: group "pages" + cancel-in-progress
   │
   ├─ job: validate                       # cheap checks, fails the run before deploy
   │    - checkout
   │    - (v1: link check of internal hrefs, HTML sanity, JSON.parse all i18n dicts)
   │
   └─ job: deploy (needs: validate)
        environment: name github-pages, url from deployment step
        steps:
          1. actions/checkout
          2. actions/configure-pages@v5       # reads site metadata; Pages already enabled
          3. actions/upload-pages-artifact@v4
                with:
                  path: '.'                     # repo root IS the site (no _site build step)
                  include-hidden-files: true    # ⚠ REQUIRED: default false EXCLUDES .nojekyll
          4. actions/deploy-pages@v4            # id-token auth → Pages CDN
   │
   ▼
https://persano.github.io/  (usually live in ~1–2 min)
```

**One-time manual setup (do this first, before first deploy):** repo Settings → Pages → Build and deployment → Source: **GitHub Actions**. (`configure-pages` has an `enablement` input, but it requires a PAT with `pages:write` instead of `GITHUB_TOKEN` — not worth it for a one-time toggle.)

**Required workflow details (all verified from first-party sources):**
- `deploy-pages` requires `pages: write` + `id-token: write` permissions and `needs:` the uploading job.
- `upload-pages-artifact` defaults to `path: _site/` and `retention-days: 1`; tar must be <10 GB, no symlinks.
- Dotfiles: the action's tar step runs `--exclude='.[^/]*'` unless `include-hidden-files: true` — without that flag `.nojekyll` is silently dropped from the artifact.

**Comparison — why not branch deploy:** pushing built files to a `gh-pages` branch works, but for a root-repo user site it adds a parallel branch whose content diverges from `main` (confusing for an agent-maintained site), no deployment environment/rollback UI, and history noise. Zero benefit given no build step.

## 8. Component Boundaries

| Component | Responsibility | Communicates with |
|-----------|---------------|-------------------|
| Hub (`/index.html`) | Brand intro, app cards | Loads `base.css`, `i18n.js` + hub dicts; links to app dirs |
| App site (`/geohist/`) | Landing/guide/privacy content, gallery, form | Loads shared modules + own dicts; talks to Firebase |
| i18n engine (`shared/js/i18n.js`) | Detect, load dict, swap DOM, persist pref | Reads `data-i18n` DOM; fetches dict JSON; emits events |
| Consent module (`shared/js/consent.js`) | Banner UI, persist choice, gate others | Emits `consent:granted`/`consent:denied`; renders into any page |
| Firebase gate (per-app JS) | Lazy init Analytics + form submit | Imports SDK only after consent (Analytics) or on submit (form) |
| Firebase backend | Anonymous auth + Firestore rules + Analytics | Receives writes from form; receives analytics events |
| Deploy workflow | Validate → package → publish | GitHub Actions → Pages CDN |

**Data flow direction summary:** static assets flow one-way repo → CDN → browser. Runtime data flows browser → Firebase only (form writes, analytics events); nothing reads back except auth state. No server-side state anywhere.

## 9. Build-Order Recommendation (dependency-driven)

```
1. Skeleton + deploy pipeline        ← deploy FIRST, to a real URL, before content
   .nojekyll, 404.html, hub index (EN-only text), base.css, deploy.yml
   Proves: artifact deploy works, root URL live, existing files unbroken
   (app-ads.txt, google*.html must still serve — regression check)
2. Shared i18n engine + hub dicts
   i18n.js + hub-{en,es,pt-BR}.json + language switcher on hub
   Proves: dictionary swap pattern before replicating in the bigger app
3. /geohist/ landing (EN content in markup) + app CSS
   Hero, features, gallery (placeholder imgs), FAQ, download CTA
4. GeoHist i18n dictionaries (es, pt-BR) + guide.html + privacy.html
   privacy.html is static EN — trivial, but needed for Play Console URL
5. Consent module + Analytics init
   consent.js + lazy firebase-analytics import on grant
   Needs: web app registered in Firebase console (one-time)
6. Contact form + Firestore rules
   contact-form.js + anonymous auth + rules with field constraints
   LAST because it's the only piece with a stateful backend and rule-tuning loop
7. SEO + screenshots + polish
   sitemap.xml, robots.txt, OG image, SoftwareApplication JSON-LD,
   real ADB screenshots, WCAG 2.1 AA audit
```

**Why this order:**
- Deploy pipeline first — every later phase is validated on the live URL, and the existing `app-ads.txt`/verification files regression-check from day 1 (PROJECT requirement: site live before Play approval).
- i18n engine before app content — the app's markup must be authored with `data-i18n` keys from the start; retrofitting keys after writing landing copy is rework.
- Firebase last among features — only self-contained piece; everything else is static and can ship while Firebase web-app registration is pending.
- Play Store link stays a placeholder until the listing is live (PROJECT constraint) — decoupled from all steps.

## 10. Pitfalls Specific to This Architecture

| Pitfall | Consequence | Prevention |
|---------|-------------|------------|
| `include-hidden-files` left default in `upload-pages-artifact` | `.nojekyll` silently missing from deploy → Jekyll runs server-side each deploy | Set `include-hidden-files: true` (verified in action.yml tar flags) |
| Committing Firebase secrets instead of public config | Confusion; web config is public by design | Use standard web config object; security lives in Firestore rules + authorized domains |
| Analytics `<script>` in HTML head "temporarily" | GDPR violation vs stated consent promise; hard to untangle later | Analytics only via dynamic import post-consent, from the start |
| Per-app copies of consent/i18n logic | Divergence when the 2nd app arrives | Shared modules from day 1; app dirs import, never copy |
| `@import` in CSS or non-module scripts order games | Render-blocking chains, i18n swap races | ES modules + `defer` semantics; base.css as separate link tag |
| Root-absolute paths if site were moved to project-site repo | `/shared/...` 404s under `/repo-name/` | Non-risk for `<owner>.github.io`; noted for future custom domain |
| Dictionary fetch failure leaves half-translated page | Ugly partial swap | Fall back to shipped EN markup on any fetch/parse error; never clear DOM before new dict is loaded |

## 11. Sources

| Source | What it verified | Confidence |
|--------|------------------|------------|
| docs.github.com — Using custom workflows with GitHub Pages | Single-job no-build pattern, permissions (`pages:write`, `id-token:write`), environment requirement, action versions | HIGH (first-party) |
| actions/upload-pages-artifact `action.yml` | Inputs (`path` default `_site/`, `retention-days`, `include-hidden-files` default false + tar `--exclude=.[^/]*` dotfile exclusion) | HIGH (primary source) |
| actions/configure-pages `action.yml` | Outputs (`base_url`/`base_path`), `enablement` requires non-GITHUB_TOKEN | HIGH (primary source) |
| docs.github.com — About GitHub Pages | User-site repo naming, `https://owner.github.io` default URL, one site per account | HIGH (first-party) |
| developers.google.com — Consent Mode guide | Consent default-denied before tag load; `consent/update` on banner choice; four signal names | HIGH (first-party) |
| firebase.google.com — Add Firebase to web (learn-more) | Modular CDN ESM imports, version 12.18.0, per-product modules, `measurementId` | HIGH (first-party) |
| firebase.google.com — Anonymous auth on web | `signInAnonymously`, 30-day auto-clean option, error handling | HIGH (first-party) |
| firebase.google.com — Firestore add data | `addDoc`/`setDoc` client API | HIGH (first-party) |
| MDN — `Navigator.language` | Detection API, `navigator.languages` | HIGH (first-party) |
| `.nojekyll` behavior | Jekyll skip; underscore paths ignored | MEDIUM (community knowledge; GitHub docs page relocated, couldn't re-verify primary URL) |
| data-i18n + JSON dictionary i18n pattern | Established static-site practice | MEDIUM (no single canonical source) |
