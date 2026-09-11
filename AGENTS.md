# Persano — Personal Apps Hub + GeoHist Trivia Site

Agent-facing project instructions, hand-written from shipped v2.0 reality (Phase 11 F-1 rewrite; decisions D-01/D-02/D-03 of `11-CONTEXT.md`). Every stack claim below traces to `.planning/STATE.md` locked decisions, `.planning/PROJECT.md`, or live code/CI gates — this document is NOT regenerated from research files.

## Project

**Persano — Personal Apps Hub + GeoHist Trivia Site**

A static GitHub Pages site served at the apex **https://geohisttrivia.com** (HTTPS enforced; `www` canonicalized to the apex; `protected_domain_state: verified`). It is Santiago David Postorivo's personal brand hub ("Persano"): the root page is a minimal portfolio hub introducing the developer and linking to per-app sites. The first and primary app site lives in `/geohist/` — a complete landing site for **GeoHist Trivia**, an Android trivia game (history + geography, Jetpack Compose, Google Play Games Services, IAP, AdMob, offline-capable, 20 localizations) currently in Google Play review (package `com.persano.geohisttrivia`; app source of truth `C:\Users\Familia\antigravity\GeoHist-Trivia`).

The repo's legacy `*.github.io` Pages host still dual-serves the same content and 301-redirects path-preserved to the apex. That redirect is a live hosting fact — but the apex is the only canonical URL, and the legacy host literal must NEVER appear in any tracked file: `scripts/check-no-old-domain.mjs` is the permanent CI gate enforcing this repo-wide, AGENTS.md included. Phrase the dual-hosts fact exactly as this paragraph does ("legacy `*.github.io` Pages host") if you ever need to restate it.

**Core value:** GeoHist Trivia players and Google Play reviewers can reach an authoritative, accessible web page for the app — featuring it, explaining it, hosting its privacy policy, and offering a working contact channel — before the app goes live.

**Maintenance model:** agent-maintained — content updates happen via chat sessions, not raw HTML editing by the owner. Visual style: dark antique aesthetic (map textures, aged-map teal accent), consistent between hub and app site.

### Constraints

- **Tech stack**: plain HTML5/CSS3/vanilla ES2020+ JS — zero build step, no SSG, no framework; GitHub Pages native
- **Hosting**: GitHub Pages behind the apex custom domain `geohisttrivia.com` (HTTPS enforced); GeoHist site in `/geohist/` subdir; legacy host 301s path-preserved
- **Deployment**: push → GitHub Actions CI (`validate` job) → Pages deploy (`deploy` job)
- **Dependencies**: Firebase JS SDK via gstatic ESM CDN only; no other runtime dependencies; `package.json` exists solely for dev tooling
- **Content source**: screenshots and app facts from the app repo (`C:\Users\Familia\antigravity\GeoHist-Trivia`)
- **Compatibility**: modern evergreen browsers; responsive mobile-first (most game traffic is mobile)
- **`.planning/` is publicly served** (it ships with the Pages artifact): no secrets, debug tokens, or private console material in any planning doc — console-UI instructions only

## Technology Stack (shipped)

| Area | Decision |
|------|----------|
| Base | Hand-authored HTML5 + CSS3 + vanilla ES2020+ JS; zero build; no SSG/framework |
| CSS | One shared stylesheet `css/base.css`: CSS custom properties + small utility layer + `[dir="rtl"]` block + `.proof-*` block. No Tailwind. |
| Firebase JS SDK | **12.18.0 exact-pinned** via gstatic ESM CDN (`https://www.gstatic.com/firebasejs/12.18.0/`), modular API only — never `*-compat.js` builds; never `npm install firebase` (the CDN import IS the dependency) |
| Firebase products | Analytics + Anonymous Auth + Firestore (cloud Firestore, not RTDB) |
| i18n | Single-URL keyed-engine dictionary swap — 20 supported languages, 19 JSON dictionaries, 178-key exact surface (details below) |
| SEO | Hand-rolled `sitemap.xml` (6 apex `<loc>` entries, no lastmod) + `robots.txt` (apex Sitemap line) + SoftwareApplication + MobileApplication JSON-LD + Open Graph (OG image 1200×630) + `favicon.ico` (single-entry ICO built via node built-ins) + `app-ads.txt` + GSC verification file |
| CI validate chain | `npm run validate` = `validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n` |
| CI deploy chain | `actions/checkout@v7` → `actions/configure-pages@v6` → `actions/upload-pages-artifact@v5` → `actions/deploy-pages@v5` (`.github/workflows/deploy.yml`; Node 24; `npm install` until a lockfile is committed) |
| Dev deps | html-validate 11.12.0 · linkinator 8.1.0 · @axe-core/cli 4.13.0 · lighthouse 13.4.1 · sharp 0.35.4 |

## Architecture-Critical Invariants (do not re-architect)

These are LOCKED decisions with shipped code behind them. Changing any of them is an architectural decision requiring explicit owner/planning approval — never "fix" them as a drive-by improvement.

### Firebase loading is fork-shaped

- **Analytics** is imported only inside `js/consent.js`, post-consent — the dynamic import IS the consent gate (load-gating; zero SDK bytes pre-grant). Consent state is a fail-closed versioned store `{v:1, analytics, ts}`; a retraction path re-shows the banner.
- **Auth + Firestore** are imported only in `js/contact.js`, on the submit path — the form is the compliance surface and works identically after Accept or Reject.
- **App Check rides the contact.js submit path, never page load.**

### App Check (Phase 9, monitoring mode)

- Provider: `ReCaptchaEnterpriseProvider` — the classic v3 provider is deprecated for new App Check registrations (owner registered `web-geohist` as reCAPTCHA Enterprise; same pinned 12.18.0 module; classic tokens cannot verify against an Enterprise registration).
- Dormant-by-default: an empty `recaptchaSiteKey` keeps pre-activation behavior byte-identical; the site key is now activated. Code attests, console enforces.
- ~3s reachability probe BEFORE any init: probe failure (reject or hang) skips registration entirely, so blocked reCAPTCHA (ad-blockers) submit un-attested in seconds instead of hanging on the CDN-pinned SDK's unbounded Auth await.
- Bounded ~10s `getToken(appCheck, false)` race + record-and-swallow + deliver-anyway: delivery never aborts; the submit-path catch is the single mapping point; no auto-retry.
- `contact.status.appcheck` keyed status; consent-gated `appcheck_token_failure` Analytics event via the `persano:appcheck` document-event bridge.
- Enforcement flip = owner console action, evidence-gated (≥30 successful submissions + console ready-to-enforce signal, unit boundary enforced both directions) — never calendar-based.

### i18n: single-URL keyed-engine dictionary swap (Phase 7)

- One URL set — no per-language pages. EN is the shipped raw HTML markup baseline (there is no `en.json`; EN lives in the markup).
- `js/i18n.js` (classic defer script, module-free, zero globals) snapshots the EN baseline exactly once, resolves the visitor's language (stored `persano.lang` preference > first supported match across `navigator.languages` via the table-driven DETECT_TABLE > `en`), fetches a same-origin flat JSON dictionary from `/js/i18n/` and swaps keyed text/attributes in place — `textContent` and `setAttribute` ONLY, because keyed nodes carry plain text (no markup-parsing DOM assignment anywhere).
- 20 supported languages (switcher order = established trio first, then Latin, Cyrillic, Greek, Indic, Arabic, CJK script groups): en, es, pt-BR, fr, de, it, nl, pl, tr, vi, id, ru, el, hi, bn, ar, ur, ja, ko, zh.
- **19 JSON dictionaries** in `js/i18n/` — 178-key exact surface with per-dictionary set-equality, CI-gated by `scripts/i18n-keycheck.mjs`.
- Keyed nodes are plain-text-only. Failure policy: any storage, fetch, parse, or per-node dictionary miss degrades silently — the page keeps its current (EN-by-default) content, no error UI, no persistence.
- RTL `ar`/`ur`: `<html dir>` flip in the same pass as the lang sync + the `[dir="rtl"]` CSS block + per-language line-height overrides.
- Native `<select>` switcher with ×20 endonyms in the fixed grouped display order (order-insensitive detection; the array IS the display order).

### Contact form

- `signInAnonymously()` → `addDoc()` to the `messages` collection; create-only Firestore security rules.
- `firebase/firestore.rules` in the repo is the source of truth, but the deployed console ruleset is NOT byte-identical — future rules edits require a console re-paste.
- Honeypot field. Firebase config values are public by design for Firebase web apps; hardening is console-side (API-key HTTP-referrer restriction + create-only rules).

### Social proof (Phase 10)

- Facts strip: 4 keyed stat pills, aria-labeled, static, zero links, between hero and features.
- Tier-1 rating row is shipped **OFF**: `<div class="proof-row" hidden>` with an unkeyed `0.0` self-flagging score span, a single star inline SVG (`proof-row-star`), and one attributed `rel="noopener"` Play link. Owner flip = 2 edits per `.planning/phases/10-gated-social-proof/10-RUNBOOK.md`, gated on real visible Play data (no minimum floor). The star SVG is exactly ONE — `scripts/i18n-keycheck.mjs` enforces star uniqueness fail-closed (★ U+2605 must never appear as text in any dictionary value or in markup).
- Tier-2 `aggregateRating` JSON-LD is permanently OFF via an inert HTML comment outside the script tag: Google's review-snippet policy bars mirroring Play ratings absent an on-site review source.

## What NOT to Use

| Do not use | Why |
|------------|-----|
| SSGs: Jekyll / Astro / Eleventy | Zero-build constraint; agent-maintained content removes the authoring-ergonomics benefit; page count too low. Revisit only past ~15 pages. |
| React / Vue / any SPA | SEO-first static site; adds a build step, runtime cost, zero payoff. |
| Tailwind (CDN or build) | CDN build is a runtime JS compiler (FOUC, not for production); the build variant violates the zero-build constraint; hand-rolled tokens suffice at this scale. |
| Firebase `*-compat.js` (v8 namespaced API) | Legacy surface; heavier; new code is modular-only. |
| npm `firebase` package at runtime | The CDN import IS the dependency (project constraint); the npm copy needs a bundler. |
| gtag Consent Mode as the primary gate | Preserves cookieless measurement the site doesn't need; load-gating is simpler and stricter. |
| CMP/consent libraries (Cookiebot, Klaro…) | One two-choice banner doesn't justify a dependency + TCF complexity. |
| Per-language static HTML subdirs with language-alternate link tags (the pre-Phase-7 design) | The anti-pattern at this architecture: ~120 files of duplicate markup, ×20 maintenance on every copy change. The single-URL keyed swap shipped instead. Revisit only with a proven crawlability case (locked decision). |
| Firebase Cloud Functions / email add-ons for the form | Secrets, deploy surface, cost — all avoided; the Firestore console suffices for reading submissions. |
| Jekyll i18n plugins / pages-plugins whitelist bets | Not on the Pages plugin whitelist; contradicts zero-build. |
| `aggregateRating` mirroring Play Store ratings | Barred by Google's review-snippet policy **even when the data is real** — absent an on-site review source, mirroring is structured-data spam. Keep the Tier-2 inert comment OFF. |

## Conventions

Patterns established across Phases 1–10; follow them for all new work:

- **One atomic commit per unit of work**, conventional-commit subjects (`feat|fix|docs|chore(scope): subject`). During GSD plan execution code changes stay uncommitted (deferred-commit mode) and `/gsd-ship` lands them with the planned per-task subjects.
- **Supersession-note policy for historical records**: original text stays verbatim; a dated bracketed correction appends (e.g. "[corrected Phase 11: 19 JSON dictionaries — no en.json; EN is the markup baseline]"). Never silently edit what a past verifier saw.
- **`.planning/` is publicly served**: no secrets, debug tokens, or console credentials in runbooks/UAT/console docs — console-UI instructions only.
- **The `uat-passed` predicate is mechanical**: any `result: issue` = blocker, no gap-awareness. Records land clean or with explicit supersession framing; a failing test later re-verified stays in the file, flipped to pass with a supersession note pointing at the gap and the re-verify test.
- **Red-gate proof for every gate change**: mutate → run gate → observe FAIL → restore byte-identical (hash-verified; `git restore` is unusable while changes are uncommitted) → re-run → PASS. Both directions, recorded in the phase's `red-gate-proof.md`.
- **i18n drafting**: two-pass (translate, then length/quality check) against the app's `strings.xml` glossary; per-language register table (e.g. de = Sie-implied neutral, ko = 해요체); brand Latin stays in all languages per the app's `app_name`.
- **CJK punctuation gate** (`scripts/i18n-keycheck.mjs`) scopes ja+zh (ko exempt — common Korean usage); digit-period exception (version strings like 0.88 pass).
- **Changelog i18n exception**: keyed chrome (nav/footer/title/intro) is translated; entry content stays EN — a documented exception, not drift.
- **Deploy via GitHub Git Data API bridge** when local remote ops are harness-blocked: blobs → tree(base = main tip) → commit → PATCH ref, strict fast-forward, never force-push, with **mandatory per-blob sha assertions** (empty-blob incident precedent) and LF-normalized text blobs.
- **Zero globals** in page scripts (single-IIFE modules, classic defer scripts, module-free); inline SVG icons with `stroke="currentColor"`; texture utilities decoration-only (never behind body copy); native `<details>` accordions — no JS for static interactivity.
- **Old-domain gate**: `scripts/check-no-old-domain.mjs` fails any tracked text file containing the legacy host literal (its own source stays clean by runtime-assembling the needle). Write the dual-hosts fact as "legacy `*.github.io` Pages host" — never the literal.

## Architecture

Live file map (shipped v2.0):

```
index.html                    # root portfolio hub (keyed)
404.html                      # self-contained 404, links back to hub
geohist/index.html            # landing: hero, proof strip, OFF rating row, features, gallery, FAQ, CTA
geohist/guide.html            # how to play + game modes
geohist/contact.html          # Firebase contact form + consent surface
geohist/changelog.html        # keyed chrome + EN entries (documented i18n exception)
geohist/privacy.html          # privacy policy (English; legally authoritative)
geohist/icon.png, google-play-badge.png, og-image.png, 4 WebP screenshots
css/base.css                  # single shared stylesheet: custom properties, [dir="rtl"] block, .proof-* block
js/i18n.js                    # keyed-engine dictionary swap (snapshot → resolve → fetch → swap)
js/consent.js                 # consent banner + load-gated Analytics import
js/contact.js                 # form + App Check probe/init/token-race + anonymous auth + Firestore
js/firebase-config.js         # public-by-design Firebase web config
js/i18n/*.json                # 19 dictionaries, 178-key exact surface
scripts/i18n-keycheck.mjs     # 178×19 set-equality + value-quality + CJK punct + star-uniqueness gates
scripts/check-no-old-domain.mjs  # legacy-host CI gate (enforces AGENTS.md too)
scripts/i18n-detect.test.mjs  # language-detection unit tests
scripts/i18n-surface.mjs      # key-surface inventory
scripts/a11y-audit.mjs, smoke-check.sh, make-webp.mjs, og-image.mjs
firebase/firestore.rules      # create-only rules (repo source of truth; console re-paste required on edit)
sitemap.xml, robots.txt, favicon.ico, app-ads.txt, google7da873f4e9609872.html, .nojekyll
.github/workflows/deploy.yml  # validate → deploy Pages chain
```

Runtime data flow: page load → `i18n.js` detect + apply (snapshot-walk; silent degrade on any failure) → `consent.js` (load-gated Analytics, only post-consent) → on submit, `contact.js` runs the submit path: ~3s reachability probe → App Check init → bounded ~10s `getToken` race → anonymous auth → Firestore `addDoc` (create-only rules; honeypot checked first).

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it. GSD planning state lives in `.planning/` (`STATE.md`, `ROADMAP.md`, phase directories).

## Project Skills

No project skills are installed (no `SKILL.md` index under `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/`).

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
