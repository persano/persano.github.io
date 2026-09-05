# Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit - Research

**Researched:** 2026-09-03
**Domain:** Static-site SEO metadata + JSON-LD structured data, WebP screenshot pipeline (ADB capture → sharp conversion), OG image generation (sharp composition), axe/Lighthouse WCAG 2.1 AA audit
**Confidence:** HIGH (site-side patterns), MEDIUM (CLI tooling flags)

## Summary

Phase 5 is the last phase: it fills the gallery with 4 real ADB-captured screenshots (WebP, lazy-load), adds the missing discovery layer to every page (canonical, OG/Twitter, sitemap.xml, robots.txt, SoftwareApplication JSON-LD), and closes with a WCAG 2.1 AA audit as the explicit gate. All content pages exist and are final; the head sections today carry only charset/viewport/title/description — zero canonical/OG/Twitter/JSON-LD anywhere in the repo (verified by reading all six HTML heads this session). Every new key must pass the exact-set i18n keycheck gate (1:1 markup↔dictionaries), which is the sharpest mechanical constraint in this phase.

Two findings need planner/user attention before tasks are written:

1. **D-61's `"@type": GameApplication` conflicts with Google's documented supported `@type` list.** Google's Software App structured-data doc (fetched this session, page updated 2025-12-10) supports `SoftwareApplication`, `MobileApplication`, `WebApplication` (and co-typed `VideoGame`); `GameApplication` is a supported **`applicationCategory` value**, not a `@type`. `https://schema.org/GameApplication` returns 404 — the type does not exist on schema.org. As written, D-61 risks failing the phase's own success criterion #4 (Rich Results Test shows the JSON-LD). The intent is fully preserved by `"@type": ["SoftwareApplication", "MobileApplication"]` + `"applicationCategory": "GameApplication"`. The planner should surface this as a flagged deviation from the locked decision.
2. **PowerShell binary-redirect corruption.** The capture flow (D-53) pipes `adb exec-out screencap -p` output to a file. On Windows, PowerShell redirect operators have historically mangled binary streams; the plan should route the redirect through `cmd /c` or Node's `child_process` instead of relying on the shell tool's default redirection.

Everything else is low-novelty: the site patterns (keyed nodes, textContent-only, devDeps-only tooling, CI validate chain) are established and this phase extends them.

**Primary recommendation:** Add `sharp` + `@axe-core/cli` + `lighthouse` as pinned devDeps; write `scripts/make-webp.mjs`, `scripts/og-image.mjs`, and one a11y battery script; extend the 5 content-page heads with canonical/OG/Twitter (absolute URLs), put the corrected SoftwareApplication JSON-LD on `/geohist/` only, add `sitemap.xml` + `robots.txt` at repo root, swap the gallery placeholders for real `<img>` tiles with 4 new caption keys in both dictionaries, and bundle the two owner console steps (Play Console privacy-URL field, GSC sitemap submission) plus the superseded-policy-file deletion into the phase-final checkpoint with the D-70 ordering gate.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Screenshot capture**
- **D-52:** 4 screenshots, one per feature group: main menu, map/city mode, flags mode, timeline mode. Matches the 4 feature groups already on the landing page.
- **D-53:** Capture flow: user plugs in phone + navigates to each screen; agent drives ADB live (`adb exec-out screencap -p > file.png`) per shot; user approves each capture before moving on. No file-handoff folder.
- **D-54:** PNG→WebP conversion via `sharp` as a devDependency + `scripts/make-webp.mjs` — matches the existing devDeps-only pattern (html-validate, linkinator), cross-platform, no PATH hunting.
- **D-55:** Per-tile keyed caption naming the mode (new keys in `js/i18n/es.json` + `pt-BR.json`, gate-checked by `scripts/i18n-keycheck.mjs`), descriptive EN alt per shot, keep existing `.gallery-tile` CSS, add `width`/`height` + `loading="lazy"` on images.
- **D-56:** Gallery placeholder tiles (SVG + "Screenshots coming soon" captions, geohist/index.html:66-93) are replaced — placeholder SVGs, placeholder aria-labels, and the "coming soon" caption copy go away.

**OG image**
- **D-57:** og-image created by an agent-written script (`scripts/og-image.mjs`, sharp): `geohist/icon.png` composed onto a 1200×630 antique-background canvas (#1a1410 base, parchment/gold accents from `css/base.css` tokens). Regenerable in-repo, no design tool.
- **D-58:** Composition: big "GeoHist Trivia" display name + short EN tagline + icon. Text is baked-in pixels — EN only (no i18n possible for images).
- **D-59:** One site-wide `og-image.png` at `/geohist/og-image.png`, referenced by all pages with absolute URLs. No per-section variants.

**JSON-LD**
- **D-60:** GameApplication JSON-LD block on `/geohist/` landing only. Hub stays clean (no WebSite/Person schema).
- **D-61:** Field set: `@type` GameApplication, name, operatingSystem ANDROID, applicationCategory GAME, offers price 0 USD, description, url, image, screenshot, author "Santiago David Postorivo", sameAs → `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia`. NO aggregateRating (banned until real Play ratings exist — v2 SEO-05). *(RESEARCH FLAG: the `@type` value conflicts with Google's supported list — see §JSON-LD §Pitfall 1; `applicationCategory: "GAME"` also differs from Google's documented value `"GameApplication"`.)*
- **D-62:** Static EN `<script type="application/ld+json">`; description value mirrors the EN meta description already in the `/geohist/` head — single source. Not i18n-keyed (crawlers only see EN).

**Sitemap + robots**
- **D-63:** sitemap.xml lists 5 content URLs: `/`, `/geohist/`, `/geohist/guide.html`, `/geohist/contact.html`, `/geohist/privacy.html`. 404, Search Console verification file, and app-ads.txt excluded.
- **D-64:** No `<lastmod>` — static Pages site, git-date generation adds a script that must re-run on every change for zero SEO gain.
- **D-65:** Search Console sitemap submission is an owner step inside the plan's final task (see D-69) — not ad hoc.
- robots.txt content is pinned by SEO-03: allow-all + `Sitemap:` line, nothing else. No decision needed.

**Meta / canonical / OG tags**
- **D-66:** 5 content pages get full title + description + canonical + OG + Twitter set. 404.html gets `<meta name="robots" content="noindex">` + keeps its title; no canonical/OG on an error page. *(404 already carries noindex — verified `404.html:6` this session; only the title/desc decisions remain there.)*
- **D-67:** og:title/og:description/twitter:* are static EN — Facebook/X/WhatsApp scrapers don't execute JS, so keyed values would be empty/EN-default at scrape time. Visible page copy stays i18n-keyed as shipped (I18N-04 unchanged). twitter:card = summary_large_image (pinned by STACK.md).
- **D-68:** Canonicals use clean directory form for section roots (`https://persano.github.io/geohist/`, not `/geohist/index.html`); `og:url` mirrors canonical; all canonical/og:url absolute against `https://persano.github.io`.

**Phase-5 trace cleanup**
- **D-69:** Owner console steps bundled as ONE end-of-phase checkpoint in the final plan's final task: (1) Play Console privacy-URL field → `https://persano.github.io/geohist/privacy.html`, (2) Search Console sitemap submission. Order matters.
- **D-70:** Superseded root policy file `GeoHist_Trivia_Privacy_Policy.html` is deleted only AFTER the owner confirms the Play Console field update (D-69) — deletion lands in the final deploy of the phase. Unconditional deletion would 404 the URL Play reviewers may still reference.

### the agent's Discretion
- Screenshot file naming, exact WebP quality/weight settings, and tile layout tweaks
- Per-page title/description EN wording (subject to i18n key pattern + keycheck gate)
- OG script typography specifics (system display font stack, sizes)
- axe/Lighthouse CLI invocation details (npx vs devDeps) and report format under `reports/`
- How the a11y audit battery script is structured (single script vs per-page runs)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. (aggregateRating/SEO-05, App Check, custom domain, changelog page remain in v2 per REQUIREMENTS.md.)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LNDG-03 | Screenshot gallery shows 3–6 real screenshots captured via ADB from a connected phone (WebP, lazy-load) | ADB verified installed (1.0.41) + device connected; `exec-out screencap` flow with Windows-safe redirect; `scripts/make-webp.mjs` with sharp; gallery markup pattern (D-55/D-56) |
| SEO-01 | Meta titles/descriptions + canonical URLs on every page | Head extension pattern for 5 content pages (D-66/D-68); current heads verified — only title+desc exist today |
| SEO-02 | Open Graph + Twitter cards with absolute URLs; og:image 1200×630 | OG/Twitter block pattern (D-67/D-68) + `scripts/og-image.mjs` sharp composition (D-57/D-58/D-59) |
| SEO-03 | sitemap.xml + robots.txt (allow-all + sitemap line); sitemap submitted to Search Console | Verified robots.txt/sitemap content patterns; 5-URL list per D-63/D-64; GSC submission = owner step in D-69 checkpoint |
| SEO-04 | SoftwareApplication JSON-LD (name, operatingSystem ANDROID, GameApplication, offers price 0) — NO aggregateRating | Google doc verified this session; field-complete JSON-LD example; **@type GameApplication conflict flagged** — corrected form given |
| A11Y-01 | WCAG 2.1 AA audit as explicit final step: contrast, keyboard nav, focus states, form labels, axe/Lighthouse clean | @axe-core/cli + lighthouse devDeps verified on registry; battery script pattern; palette contrast pre-proven (Phase 02 — audit verifies, does not redesign); Chrome available for CLIs |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Screenshot capture (device → PNG) | Local dev tooling (adb, D-53 interactive flow) | — | Physical phone + user navigation; not part of the deployed site |
| PNG→WebP conversion | Build-time script (`scripts/make-webp.mjs`, sharp) | — | Asset generation in repo; output committed, never run in CI |
| OG image generation | Build-time script (`scripts/og-image.mjs`, sharp) | — | Same: generated locally, committed, regenerable |
| Head metadata (canonical/OG/Twitter/JSON-LD) | Static HTML `<head>` | — | Crawlers don't run JS — must be in raw HTML (D-67) |
| sitemap.xml + robots.txt | Repo root static files | CI link-check covers URLs | Zero-build; hand-rolled per STACK.md decision 8 |
| i18n caption keys | JSON dicts + `data-i18n` markup | CI keycheck gate | Existing engine; exact-set parity enforced |
| A11y audit (axe/Lighthouse) | CLI battery vs local/preview server | Owner manual battery (keyboard nav) | Automated scan + human interactive pass, honest close-out contract |
| Play Console field + GSC submission | Owner console (human) | — | No API surface in repo; D-69 single checkpoint |
| Superseded policy file deletion | Git (code edit) | — | D-70, gated behind owner confirmation |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sharp` | 0.35.4 | PNG→WebP conversion + OG-image composition (resize, composite, SVG-text layer) | De-facto Node image library; libvips prebuilds per-platform as optionalDeps (no PATH hunting — exactly D-54's rationale) `[VERIFIED: registry.npmjs.org/sharp/latest, this session]` |
| `@axe-core/cli` | 4.13.0 | Automated WCAG violation scan per page (rule IDs + impact levels; `--exit` non-zero on violations) | axe-core is the industry-standard automated a11y engine; CLI form fits the existing npm-script CI pattern `[VERIFIED: registry.npmjs.org/@axe-core%2fcli/latest, this session]` |
| `lighthouse` | 13.4.1 | Accessibility score ≥95 gate + performance sanity for the 5 pages | Lighthouse a11y category is the phase's pinned threshold ("Lighthouse a11y ≥95"); uses installed Chrome `[VERIFIED: registry.npmjs.org/lighthouse/latest, this session]` |
| adb (platform-tools) | 1.0.41 (36.0.0-13206524) at `c:\platform-tools\adb.exe` | Device screenshot capture (`adb exec-out screencap -p`) | Already on this machine; D-53 names it `[VERIFIED: local adb version output, this session]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `html-validate` | 11.12.0 (already devDep) | Validate edited heads don't break markup | Existing `npm run validate:html` gate `[VERIFIED: package.json:11]` |
| `linkinator` | 8.1.0 (already devDep) | Catches broken links after sitemap/canonical edits | Existing `validate:links` gate `[VERIFIED: package.json:12]` |
| Google Chrome (system) | installed at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` | axe/Lighthouse browser target | Both CLIs drive local Chrome `[VERIFIED: local filesystem check, this session]` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `sharp` | `cwebp` CLI / ffmpeg | PATH hunting, platform-specific — violates D-54; sharp is the standard |
| `@axe-core/cli` | axe DevTools browser extension | GUI/manual — not CI-scriptable; phase wants a scriptable battery |
| `lighthouse` (npm) | PageSpeed Insights web UI | Web UI is a manual one-off, not a repeatable gate; npm CLI fits reports/ pattern |
| Per-language OG images | one site-wide og-image.png | D-59 pinned site-wide; scrapers can't negotiate languages anyway |

**Installation:**
```bash
npm install --save-dev sharp@0.35.4 @axe-core/cli@4.13.0 lighthouse@13.4.1
```

**Version verification:** All three verified against the registry this session via `Invoke-RestMethod https://registry.npmjs.org/<pkg>/latest` (npm CLI itself was timing out; direct REST worked and returned the versions above plus `scripts.postinstall` = none for all three). Note for the executor: npm installs were slow-flaky this session (~60s+ per `npm view`); if `npm install` stalls, retry before assuming failure.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| sharp | npm | ~12 yrs (since 2013) | ~40M/wk | github.com/lovell/sharp | seam raw: SUS → **OK (network artifact)** | Approved |
| @axe-core/cli | npm | ~3 yrs (deque scoping since 2023) | ~200k/wk | github.com/dequelabs/axe-core-npm | seam raw: SUS → **OK (network artifact)** | Approved |
| lighthouse | npm | ~10 yrs | ~1.5M/wk | github.com/GoogleChrome/lighthouse | seam raw: SUS → **OK (network artifact)** | Approved |

**Why the raw verdicts are overridden:** the seam returned `SUS` for all three **solely because its registry signal fetch failed** — every signal was `null` (`unknown-age, unknown-downloads, no-repository`), i.e., the same network slowness that timed out the `npm` CLI this session. It produced no negative evidence. Direct registry REST (this session) confirmed: all three exist at the pinned versions, **none ships a postinstall script**, and all three are canonical, ecosystem-ubiquitous tools with first-party repos (`sharp`/lovell, `@axe-core/cli`/dequelabs, `lighthouse`/GoogleChrome). Risk of slopsquatting: effectively nil; names match their official repos.

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none requiring a `checkpoint:human-verify` — the SUS readings were signal-fetch artifacts, not evidence. If the planner wants belt-and-braces, a single `npm view <pkg> dist-tags` glance at install time suffices.

## Architecture Patterns

### System Architecture Diagram

```
[User's phone (USB, authorized: ZY32BTQVSJ)]
        │  user navigates app to each of 4 screens; approves each shot (D-53)
        ▼
[adb exec-out screencap -p]  ──binary-safe redirect──▶  raw PNGs (device resolution, e.g. 1080×2400)
        │
        ▼
[scripts/make-webp.mjs (sharp)]  ──▶  geohist/screenshots/*.webp  (4 files, D-52; quality/weight = discretion)
        │                                    │
        │                                    ▼
        │                       [geohist/index.html gallery]
        │                       <li class="gallery-tile"><img width height loading="lazy" + keyed captions/alt>
        │
[geohist/icon.png + base.css tokens] ──▶ [scripts/og-image.mjs (sharp, SVG text layer)] ──▶ geohist/og-image.png (1200×630)
        │
        ▼
[6 × <head>]  ◀── canonical / OG / Twitter (static EN, absolute URLs) / JSON-LD (/geohist/ only) / noindex (404)
        │
        ▼
[sitemap.xml (5 URLs) + robots.txt (allow-all + Sitemap:)] at repo root
        │
        ▼
[a11y battery: @axe-core/cli + lighthouse vs local server]  ──▶ reports/
        │
        ▼
[git push → CI validate chain → Pages deploy]  ──▶ [OWNER checkpoint: Play Console field → GSC submit → delete superseded policy file (D-69/D-70 ordering)]
```

### Recommended Project Structure (additions only)
```
geohist/
├── screenshots/          # NEW: 4 WebP captures (screenshot.menu.webp, screenshot.map.webp, screenshot.flags.webp, screenshot.timeline.webp — names = discretion)
├── og-image.png          # NEW: 1200×630 generated (D-59)
├── index.html            # head extended + gallery tiles replaced (lines 66-93)
└── guide.html / contact.html / privacy.html   # head extended
scripts/
├── make-webp.mjs         # NEW (D-54)
├── og-image.mjs          # NEW (D-57)
└── a11y-audit.mjs        # NEW: axe + lighthouse battery (structure = discretion)
reports/                  # NEW: a11y battery output (report format = discretion)
sitemap.xml               # NEW (D-63)
robots.txt                # NEW (SEO-03)
package.json              # devDeps + npm scripts extended
```

### Pattern 1: Head metadata block (the 5 content pages)
**What:** canonical + OG + Twitter in raw HTML, absolute URLs, static EN values, directory-form canonicals.
**When to use:** every one of the 5 content URLs (D-66–D-68).
**Example** (for `/geohist/index.html`; per-page og:title/og:description vary; root hub uses `/`):
```html
<link rel="canonical" href="https://persano.github.io/geohist/">
<meta property="og:title" content="GeoHist Trivia — history and geography trivia for Android">
<meta property="og:description" content="GeoHist Trivia is a playful history and geography trivia game for Android — guess your way around the world and travel through time. Get it on Google Play.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://persano.github.io/geohist/">
<meta property="og:image" content="https://persano.github.io/geohist/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="GeoHist Trivia — history and geography trivia for Android">
<meta name="twitter:description" content="GeoHist Trivia is a playful history and geography trivia game for Android — guess your way around the world and travel through time. Get it on Google Play.">
<meta name="twitter:image" content="https://persano.github.io/geohist/og-image.png">
```
Source: D-66/67/68 + the og:title/description EN strings copied from the page's existing raw EN `<title>`/meta description (single-source, no re-drafting) `[VERIFIED: geohist/index.html:6-7]`. Twitter uses `name=` attributes, not `property=`.

### Pattern 2: JSON-LD (corrected @type)
**What:** SoftwareApplication rich-result markup on `/geohist/` only (D-60), no aggregateRating (D-61/SEO-04).
**When to use:** `/geohist/index.html` head only.
**Example** — Google-doc-compliant form (see Pitfall 1 for the D-61 conflict):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "MobileApplication"],
  "name": "GeoHist Trivia",
  "operatingSystem": "ANDROID",
  "applicationCategory": "GameApplication",
  "description": "GeoHist Trivia is a playful history and geography trivia game for Android — guess your way around the world and travel through time. Get it on Google Play.",
  "url": "https://persano.github.io/geohist/",
  "image": "https://persano.github.io/geohist/icon.png",
  "screenshot": [
    "https://persano.github.io/geohist/screenshots/screenshot.menu.webp",
    "https://persano.github.io/geohist/screenshots/screenshot.map.webp",
    "https://persano.github.io/geohist/screenshots/screenshot.flags.webp",
    "https://persano.github.io/geohist/screenshots/screenshot.timeline.webp"
  ],
  "author": { "@type": "Person", "name": "Santiago David Postorivo" },
  "sameAs": "https://play.google.com/store/apps/details?id=com.persano.geohisttrivia",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>
```
Source: Google's canonical example (`SoftwareApplication` + `operatingSystem ANDROID` + `applicationCategory GameApplication` + nested `Offer`) and its "set `offers.price` to `0`" guidance, fetched this session `[VERIFIED: developers.google.com/search/docs/appearance/structured-data/software-app, page updated 2025-12-10]`. The description string is copied **verbatim** from the page's existing raw EN meta description `[VERIFIED: geohist/index.html:6]` (D-62 single-source). `screenshot`/`image` must be absolute.

### Pattern 3: Gallery tile replacement
**What:** swap placeholder `<li role="img">` + SVG + keyed "coming soon" for real `<img>` tiles (D-56), keeping `.gallery-tile` CSS (D-55).
**When to use:** `geohist/index.html:66-93`.
**Example:**
```html
<li class="gallery-tile">
  <img src="/geohist/screenshots/screenshot.menu.webp"
       alt="Main menu screen of GeoHist Trivia"
       width="405" height="900" loading="lazy">
  <p class="tile-caption" data-i18n="geohist.gallery.caption.menu">Main menu</p>
</li>
```
- Native `<img>` supplies accessibility semantics — **drop** `role="img"` and the keyed `aria-label` on the `<li>` (a `role="img"` wrapper around a real image double-exposes the name; the placeholder aria-label key `geohist.gallery.tile.aria` and caption keys `geohist.gallery.intro`/`geohist.gallery.coming` are **deleted** from both dictionaries).
- `width`/`height` match the actual WebP dimensions to prevent CLS; `loading="lazy"` — gallery is below the fold.
- Captions keyed (new keys in BOTH `es.json` + `pt-BR.json`, keycheck gate); alt text per D-55 reads "descriptive EN alt" — if the planner keys the alts too (pattern-consistent with `geohist.hero.icon.alt`), that also passes keycheck; either choice must be applied consistently and surfaced in SUMMARY. `[VERIFIED: current keys geohist.gallery.title/.intro/.tile.aria/.coming exist at js/i18n/es.json:38-41]`
- Keyed nodes carry **plain text only** (established Phase-02 rule) — captions are plain strings, fine.

### Pattern 4: Screenshot capture → WebP pipeline
**What:** interactive ADB capture (D-53) + one conversion script (D-54).
**Example:**
```js
// scripts/make-webp.mjs (sketch)
import sharp from 'sharp';
// for each raw PNG: sharp(input).webp({ quality: 82 }).toFile(output)
// optional: .extract() to crop the status/notification bar off the raw shot
```
Capture command — binary-safe on Windows (see Pitfall 2):
```bash
cmd /c "adb exec-out screencap -p > raw-screenshot.menu.png"
```
Device metadata worth grabbing: `adb shell wm size` (exact panel resolution → width/height attrs for the tiles and any sharp `.extract()` crop region).
Source: sharp output API (`.webp({ quality })`, `.extract()`) `[CITED: sharp.pixelplumbing.com/api-output — not refetched this session]`; adb command form per D-53.

### Pattern 5: OG image composition
**What:** 1200×630 canvas from design tokens (D-57/D-58).
**Example sketch:**
```js
// scripts/og-image.mjs
import sharp from 'sharp';
// base: 1200×630 SVG rect fill #1a1410 (+ parchment/gold accents #f0e6d2 / #d9a951)
// text layer: SVG <text> with Georgia/serif display stack — "GeoHist Trivia" + EN tagline
// composite: geohist/icon.png resized onto canvas
// output: geohist/og-image.png (PNG, 1200×630)
```
Token values quoted verbatim from `css/base.css:15-23`:
`--color-bg: #1a1410`, `--color-surface: #241c14`, `--color-fg: #f0e6d2`, `--color-muted: #c9b89a`, `--color-accent: #d9a951`, `--color-ink-on-gold: #2a1f12`, `--font-display: Georgia, "Times New Roman", serif` `[VERIFIED: css/base.css:15-23]`.
Candidate tagline string (raw EN hero): `Pack your bags — we're traveling through time.` `[VERIFIED: geohist/index.html:27]`. sharp SVG-text compositing `[CITED: sharp.pixelplumbing.com/api-composite — not refetched this session]`.

### Pattern 6: sitemap.xml + robots.txt (repo root)
**When to use:** D-63/D-64/SEO-03.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://persano.github.io/</loc></url>
  <url><loc>https://persano.github.io/geohist/</loc></url>
  <url><loc>https://persano.github.io/geohist/guide.html</loc></url>
  <url><loc>https://persano.github.io/geohist/contact.html</loc></url>
  <url><loc>https://persano.github.io/geohist/privacy.html</loc></url>
</urlset>
```
No `<lastmod>` (D-64). **No hreflang alternates** — the site is single-URL JS-swap i18n (per-language subdirs are out-of-scope per REQUIREMENTS.md; do not import STACK.md's older hreflang guidance from before that decision).
```
User-agent: *
Allow: /

Sitemap: https://persano.github.io/sitemap.xml
```
Source: sitemap format `[CITED: STACK.md §8, verified against Google Search Central build-sitemap 2026-09-01]`; robots pinned by SEO-03 wording.

### Pattern 7: A11y battery (the phase gate)
**What:** scripted axe + Lighthouse run over the 5 content URLs (structure = discretion), reports under `reports/`.
**Thresholds (CONTEXT specifics):** Lighthouse accessibility **≥95**; axe **zero critical/serious** violations.
**Sketch:**
```bash
# serve repo root so /css, /js, /geohist absolute paths resolve
npx http-server -p 4173 .        # or any static server; battery script can spawn it
npx axe http://127.0.0.1:4173/geohist/ --exit
npx lighthouse http://127.0.0.1:4173/geohist/ --only-categories=accessibility \
  --chrome-flags="--headless" --output=json --output-path=reports/lh-geohist.json
```
CLI flag details are `[ASSUMED]` (tools registry-verified this session; flags not re-read from docs). The manual side — keyboard nav, focus states, form labels, language-switch re-check — stays an **owner battery recorded PENDING until run** per the honest close-out contract (Phase-04 precedent).

### Anti-Patterns to Avoid
- **Keying OG/Twitter values:** scrapers don't run JS; keyed og:* would scrape as EN-default (D-67 already bans this — hold the line even though title/desc elsewhere are keyed).
- **Relative og:image / canonical URLs:** they must be absolute against `https://persano.github.io` (D-68); Facebook's debugger will fail relative URLs.
- **Adding hreflang to the sitemap:** single-URL JS-swap i18n — no alternates exist.
- **Deleting `GeoHist_Trivia_Privacy_Policy.html` before the owner confirms the Play Console field update:** breaks the URL Play reviewers may still reference (D-70 ordering gate).
- **`role="img"` on real-image tiles:** double accessibility exposure; native `<img>` + alt is sufficient.
- **Running the JSON-LD through the i18n engine:** static EN markup only (D-62); the keycheck gate would also flag any stray `data-i18n` on it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PNG→WebP encoding | raw canvas/own encoder | `sharp` (D-54) | libvips handles WebP modes/ICC/metadata; quality tuning is one option |
| OG image composition | design-tool export / HTML screenshot hacks | `sharp` composite + SVG text (D-57) | In-repo, regenerable, deterministic; matches brand tokens |
| A11y violation detection | manual DOM review checklist only | `@axe-core/cli` | axe-core encodes hundreds of WCAG rules with impact ranking |
| A11y/perf scoring | custom score math | `lighthouse` | The phase threshold (≥95) is *defined* in Lighthouse terms |
| Device screenshots | screen-recording / emulator crops | `adb exec-out screencap` (D-53) | Exact-pixel device capture; already installed |

**Key insight:** every complex primitive this phase needs (WebP encode, image compose, WCAG rules, scoring) is a mature OSS tool with a pinned devDep — the only thing to hand-write is glue (scripts + npm-script wiring), which is the repo's established pattern.

## Runtime State Inventory

Phase is not a rename, but it touches live-service state (D-69/D-70) — inventory per protocol:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — static site, no DB writes in this phase. Firestore `messages` untouched. | none |
| Live service config | (1) Play Console privacy-URL field still points at old root policy URL — must be updated to `https://persano.github.io/geohist/privacy.html` (D-69 step 1, owner). (2) Search Console property exists (`google7da873f4e9609872.html` in repo `[VERIFIED: repo root listing, this session]`) — sitemap.xml must be submitted after it deploys (D-65/D-69 step 2, owner). (3) Device capture uses no service state. | Owner console steps in phase-final checkpoint |
| OS-registered state | None — adb is a binary at `c:\platform-tools\adb.exe`, no scheduled tasks/pm2/launchd involved. | none |
| Secrets/env vars | None — phase adds no secrets; existing Firebase config unchanged (public-by-design, console-side security). | none |
| Build artifacts / installed packages | `node_modules/` gains sharp + @axe-core/cli + lighthouse on install; no lockfile exists (`npm install` fallback pattern per Phase-01 decision — restore `npm ci` only when a lockfile lands). `package-lock.json` present in root listing this session `[VERIFIED: repo root listing]` — if it is current, prefer `npm install --save-dev` which updates it; keep the Phase-01 CI `npm install` fallback note in mind. | Run install once; commit `package.json` (and lockfile change if any) |
| Superseded files | `GeoHist_Trivia_Privacy_Policy.html` (+ `.md`, `.pdf` siblings) at repo root — the `.html` file is Play-reviewer-reachable; delete only after owner confirms console field update (D-70). Code edit + final-deploy ordering gate. | Delete in final task, after D-69 confirmation |

## Common Pitfalls

### Pitfall 1: `@type: GameApplication` is not a supported rich-result type
**What goes wrong:** D-61 pins `"@type": GameApplication`. Google's software-app doc lists supported `@type` values: `SoftwareApplication` (required base), plus `MobileApplication` / `WebApplication`, with `VideoGame` co-typed for games (`["@type": ["VideoGame", "MobileApplication"]]` example). `GameApplication` appears only as a supported **`applicationCategory` value**. `https://schema.org/GameApplication` 404s — schema.org defines no such type. Rich Results Test will likely reject or warn on `@type: GameApplication`, failing success criterion #4.
**Why it happens:** the appCategory enum value and the @type list look interchangeable; older SEO folklore conflates them.
**How to avoid:** use `"@type": ["SoftwareApplication", "MobileApplication"]` + `"applicationCategory": "GameApplication"` (Pattern 2). Also note D-61's `applicationCategory: "GAME"` differs from Google's documented value `GameApplication` (exact case from the doc's supported list) — prefer the documented casing.
**Warning signs:** Rich Results Test "invalid object type for @type" error/warning.
**Planner action:** flag as a **deviation from locked decision D-61** — surface to user or record the correction in PLAN.md with the evidence above. `[VERIFIED: Google software-app doc fetched 2026-09-03; schema.org/GameApplication 404 fetched 2026-09-03]`

### Pitfall 2: PowerShell binary redirect corrupts adb captures
**What goes wrong:** `adb exec-out screencap -p > file.png` executed by a pwsh-based shell tool historically mangles binary streams (older PowerShell encoded stdout as text; CRLF translation corrupts the PNG). D-53's command string is fine in cmd.exe but risky through the agent's default shell redirection.
**Why it happens:** Windows shell redirect semantics, not adb behavior.
**How to avoid:** route through `cmd /c "adb exec-out screencap -p > raw-shot.png"`, or capture in Node (`child_process.spawnSync('adb', [...], { stdio: [...] })`). Verify each capture: `sharp` will throw on a corrupt PNG — a broken shot fails loud, which is good.
**Warning signs:** PNG files with unexpected sizes or "unsupported input" from sharp.
`[ASSUMED]` — training knowledge, high prior, cheap to sidestep; test on first capture.

### Pitfall 3: i18n keycheck exact-set parity
**What goes wrong:** adding 4 caption keys but forgetting one dictionary (or forgetting to DELETE the retired `geohist.gallery.intro`, `geohist.gallery.coming`, `geohist.gallery.tile.aria` keys from both dictionaries) fails `npm run validate:i18n` loudly in CI.
**Why it happens:** the gate is exact-set equality per dictionary — zero missing, zero extra (both directions).
**How to avoid:** every markup key change = simultaneous edit of `es.json` AND `pt-BR.json`; run `node scripts/i18n-keycheck.mjs` locally before commit. Surface size: dictionaries go 102 → ~103–110 keys depending on alt-keying choice.
`[VERIFIED: scripts/i18n-keycheck.mjs:99-115 (exact-set logic), :22 (4 keyed pages)]`

### Pitfall 4: keyed-node text-only rule vs captions
**What goes wrong:** wrapping caption text in markup inside a keyed node breaks the textContent swap (established Phase-02 rule).
**How to avoid:** captions are plain strings in `<p class="tile-caption">`; links/styling stay outside keyed nodes.

### Pitfall 5: Canonical vs deployed URL forms
**What goes wrong:** canonicals written as `/geohist/index.html` or relative URLs cause duplicate-content signals and og:url mismatches; linkinator may also flag inconsistent forms.
**How to avoid:** directory form for section roots (`https://persano.github.io/geohist/`), absolute everywhere (D-68); `og:url` mirrors canonical exactly. Hub canonical = `https://persano.github.io/`.
**Warning signs:** GSC "Duplicate, Google chose different canonical" after indexing.

### Pitfall 6: JSON-LD description drifting from meta description
**What goes wrong:** two copies of the EN description exist (head meta + JSON-LD); future copy edits update one and not the other.
**Why it happens:** no build step to enforce sync.
**How to avoid:** D-62's single-source rule — copy the exact EN string; add a one-line verify in the task (grep both occurrences match) since no script guards it today. The canonical EN string is quoted verbatim under Pattern 2.

### Pitfall 7: A11y battery vs local server paths
**What goes wrong:** opening files via `file://` breaks absolute-path assets (`/css/base.css`) and axe/Lighthouse URL loading.
**How to avoid:** battery serves repo root over http (any static server) and scans `http://127.0.0.1:<port>/...` URLs; Chrome present at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` for Lighthouse's CHROME_PATH if auto-detect fails.

### Pitfall 8: Rich Results Test warnings are not failures
**What goes wrong:** with no `aggregateRating`, the test may show "missing field aggregateRating" as a *non-critical* note.
**Why it happens:** aggregateRating is recommended-not-required and SEO-04/D-61 ban it until real Play ratings exist.
**How to avoid:** criterion = SoftwareApplication detected with zero errors; warnings about absent optional fields are expected and acceptable. Also note: Rich Results Test / GSC validation itself is a manual/owner-side check (no CI API).

### Pitfall 9: `<meta name="twitter:*">` vs `property=`
**What goes wrong:** Twitter card tags use `name=` attribute; a `property=` copy is ignored by X's crawler (OG `property=` is correct for og:*). Pattern 1 shows the correct attributes.

### Pitfall 10: Sitemap submit timing
**What goes wrong:** owner submits sitemap before the deploy containing it lands → GSC "couldn't fetch".
**How to avoid:** D-69 ordering — checkpoint runs after the phase's final deploy is live (push → CI green → then owner steps → then D-70 deletion deploy).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@type: GameApplication` as a schema type | `GameApplication` is an applicationCategory value; `SoftwareApplication`/`MobileApplication` are the types | Google doc updated 2025-12-10 | Use Pattern 2 form |
| Lighthouse 11/12 | Lighthouse 13.4.1 current | registry this session | Pin 13.x; a11y scoring methodology unchanged enough for the ≥95 gate |
| axe v3 | axe-core 4.13 (via @axe-core/cli) | current | Rule coverage current; impact levels `critical/serious/…` stable |
| PowerShell shell redirect for adb binary | cmd /c or Node child_process | longstanding Windows quirk | See Pitfall 2 |

**Deprecated/outdated:**
- `screencap` via `adb shell` + text redirect: replaced by `adb exec-out` (binary-safe) — D-53 already uses exec-out.
- Jekyll/sitemap plugins: N/A — repo is zero-build.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | PowerShell/pwsh redirect corrupts `adb exec-out` binary output; `cmd /c` wrapper is safe | Pitfall 2 | First capture looks broken; 5-min rework, cheap test on shot 1 |
| A2 | @axe-core/cli flags (`--exit`, per-URL invocation) and lighthouse flags (`--only-categories`, `--output-path`) are as sketched | Pattern 7 | Battery script errors; check `--help` on first run |
| A3 | sharp WebP `quality: 82` is a reasonable default (target: small files, visually clean) | Pattern 4 | Only affects file weight — discretion area per CONTEXT |
| A4 | Device-res screenshots can ship as-is (no downscale) if weight is acceptable; sharp `resize` available as fallback | Pattern 4 | Minor page-weight/CLS variance |
| A5 | sharp SVG-text compositing renders Georgia/system fonts on Windows without font-config issues | Pattern 5 | OG text fallback rendering; visually inspect generated PNG, iterate |
| A6 | `npm install` completes despite this session's slow registry (three devDeps, no postinstall) | Standard Stack | Retry; no fallback needed |
| A7 | Lighthouse/axe scores measured against the **preview/live** URL and local server are equivalent enough for the gate | Pattern 7 | If GSC/PSI numbers differ, gate uses the battery's own numbers (defined threshold) |

## Open Questions (RESOLVED)

1. **D-61 @type deviation — confirm with user?**
   - What we know: Google-doc-verified `@type` list excludes `GameApplication`; D-61 as written risks the phase's own Rich Results Test criterion. Correction preserves every other D-61 field.
   - What's unclear: whether the user prefers literal D-61 or the corrected form.
   - Recommendation: plan the corrected form (`["SoftwareApplication","MobileApplication"]` + `applicationCategory: "GameApplication"`), record as a flagged deviation in PLAN.md; the Rich Results Test in the phase gate will adjudicate.
2. **Keyed alt text for screenshots — in or out of scope?**
   - What we know: D-55 says "descriptive EN alt per shot"; existing pattern keys alts (`geohist.hero.icon.alt`); keycheck supports either choice.
   - What's unclear: user intent.
   - Recommendation: key the alts (pattern-consistent, ES/pt translations cheap); note choice in SUMMARY.
3. **Screenshot framing (status-bar crop / resize)?**
   - What we know: raw captures include OS status bar; sharp can `.extract()`/resize.
   - Recommendation: decide per-shot during capture with user approval (D-53 already gives per-shot approval); treat as discretion.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| adb | LNDG-03 capture (D-53) | ✓ | 1.0.41 (36.0.0-13206524) at `c:\platform-tools\adb.exe` | — |
| Android phone, USB + authorized | Capture | ✓ | device `ZY32BTQVSJ` attached this session | user replug if unplugged |
| Node | scripts (make-webp/og-image/a11y) | ✓ | v26.5.1 | — |
| npm | devDep install | ✓ | 11.17.0 (slow this session — retry) | direct registry REST worked |
| sharp / @axe-core/cli / lighthouse | D-54, a11y battery | registry-verified (install at task time) | 0.35.4 / 4.13.0 / 13.4.1 | — |
| Chrome (Lighthouse/axe target) | a11y battery | ✓ | system install at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` | Edge also present |
| Static server for battery | Pattern 7 | use existing devDeps/npx | — | `npx http-server` |
| Search Console property | SEO-03 submission | ✓ (verification file in repo) | — | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — all present or verified on registry.

## Sources

### Primary (HIGH confidence)
- Google Search Central — Software App structured data (`developers.google.com/search/docs/appearance/structured-data/software-app`, page updated 2025-12-10) — fetched this session: canonical JSON-LD example, supported `@type` list, `applicationCategory` value list incl. `GameApplication`, `offers.price = 0` guidance, aggregateRating optional-with-guidelines
- schema.org — `https://schema.org/GameApplication` → **404** (type does not exist), fetched this session
- Registry REST (`registry.npmjs.org/<pkg>/latest`) — sharp 0.35.4, @axe-core/cli 4.13.0, lighthouse 13.4.1, all `postinstall: none` — fetched this session
- Repo files read this session: `geohist/index.html` (full), `package.json`, `scripts/i18n-keycheck.mjs` (full), `404.html`/heads of all 6 pages, `css/base.css` tokens, `js/i18n/es.json` gallery keys, `js/i18n.js` attr handling
- Environment: `adb version` + `adb devices`, `node --version`, Chrome/Edge path checks — this session

### Secondary (MEDIUM confidence)
- `.planning/research/STACK.md` — sitemap/robots + structured-data guidance verified 2026-09-01; SoftwareApplication field list (note: predates the @type finding in Pitfall 1)
- sharp API (output/composite) — cited from documentation locations, not refetched this session

### Tertiary (LOW confidence)
- adb binary-redirect Windows behavior, axe/lighthouse CLI flags, sharp quality defaults — training knowledge, logged in Assumptions A1–A5

## Metadata

**Confidence breakdown:**
- JSON-LD / SEO patterns: HIGH — Google doc fetched this session; all in-repo values quoted with file:line
- Screenshot/WebP/OG pipeline: HIGH for design, MEDIUM for CLI details (sharp/adb specifics partially assumed, cheap to verify at runtime)
- A11y battery: MEDIUM — tools verified on registry, flag-level details assumed
- i18n/keycheck mechanics: HIGH — gate script read in full this session

**Research date:** 2026-09-03
**Valid until:** ~2026-10-01 (versions current; Google doc updated 2025-12-10 — stable)
