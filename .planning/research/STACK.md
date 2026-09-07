# Stack Research — v2.0 Milestone: New-Feature Stack Additions

**Domain:** Static GitHub Pages multi-language site (existing zero-build stack) — new features only
**Researched:** 2026-09-05
**Confidence:** HIGH (all load-bearing claims fetched from official docs this session; nuance flagged where Medium)

**Scope rule:** only stack needed for I18N-05, CONT-06, HOST-01, FIRE-07, SEO-05. The existing validated stack (plain HTML/CSS/vanilla JS, i18n.js dictionary-swap, consent banner, contact form, CI chain, sitemap/robots/JSON-LD) is **not re-researched and needs no changes** except the explicit integration points listed below.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| HTML `dir` attribute + CSS logical properties | n/a (platform, evergreen) | RTL support for ar/ur (I18N-05) | `dir` on `<html>` is the *semantic* base-direction mechanism — MDN explicitly recommends the attribute over the CSS `direction` property so content renders correctly even with CSS disabled. Logical properties (`margin-inline-start`, `padding-inline-start`, `border-inline-start`, `inset-inline-start`, `text-align: start/end`) make the existing hand-rolled CSS direction-agnostic with zero duplication. Verified MDN "dir global attribute" (updated 2026-08-28) and "CSS logical properties and values" module this session. |
| `dir` / `lang` setting via i18n.js | existing engine, ~10-line change | One-line dir switching on apply | i18n.js already sets `document.documentElement.lang` inside `applyLanguage()` — add `document.documentElement.dir = RTL_LANGS[lang] ? 'rtl' : 'ltr'` in the same pass. Zero new scripts, zero new files. |
| Firebase JS SDK `firebase/app-check` module | **12.18.0 (existing exact pin — no change)** | App Check for the contact form (FIRE-07) | Verified this session: `https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js` **exists on the gstatic ESM CDN** (content confirmed; imports `firebase-app.js` at the same pinned version). The app-check module has existed since the v9 modular line, so the 12.18.0 pin is version-safe. No new SDK version, no new CDN URLs beyond this one module. |
| reCAPTCHA **v3** provider (not Enterprise) | n/a (Google service) | Attestation provider for App Check | Google's reCAPTCHA v3 App Check doc (fetched, *Last updated 2026-09-02*) still fully supports v3: invisible (no challenge ever), free, no billing. **Important honest caveat:** the same doc now states *"You should use reCAPTCHA Enterprise for new integrations, and we strongly recommend that developers of apps using reCAPTCHA v3 upgrade when possible"* — v3 is soft-deprecated for new integrations, not deprecated. Decision: stay with v3 because (a) reCAPTCHA Enterprise requires linking a **Cloud Billing account** to the Firebase project (verified in the Enterprise provider doc), adds GCP setup surface, and bills above 10k assessments/month; (b) the protected surface is one low-traffic contact form with monitoring-mode-first. Record the Enterprise migration as the documented plan-B (see Stack Patterns). |
| GitHub Pages custom-domain mechanics | n/a (repo settings + DNS) | Custom domain (HOST-01) | Verified from `docs.github.com` (Managing a custom domain, Verifying your custom domain) this session. Apex `A` ×4 + `AAAA` ×4 records, `www` `CNAME`, TXT verification record, `Enforce HTTPS` toggle. Key correction to common lore: with **Actions-workflow publishing (this site), the `CNAME` file is ignored and not required** — the custom domain persists in repository Pages settings. No tooling needed beyond `Resolve-DnsName`/`dig` for DNS verification. |
| Extended `scripts/i18n-keycheck.mjs` | existing zero-dep script | Dictionary quality gate × 20 (I18N-05, CONT-06) | The exact-parity gate already auto-covers every `js/i18n/*.json` — adding 17 dictionaries extends coverage with **zero edits to the gate logic**. Extend it with: (1) add `changelog.html` to the `pages` array, (2) reject empty/whitespace-only values, (3) optional simple length-ratio warning (a translation < 20% or > 400% of the EN value length is worth owner review). This keeps the zero-build, zero-new-dependency philosophy. No npm translation tool outperforms it for this flat-JSON shape. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| *(none)* | — | — | **No new runtime or dev dependencies are needed for any of the five features.** App Check rides the existing pinned CDN SDK; RTL is HTML/CSS platform features; custom domain is repo settings + DNS; dictionaries are JSON files the existing gate already validates; aggregateRating is a JSON-LD edit. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Extended `i18n-keycheck.mjs` (see above) | Key parity × 20 + non-empty values | Also becomes the changelog-page key gate; runs in existing `npm run validate` |
| `scripts/smoke-check.sh` (extend) | RTL sanity: assert `<html lang="ar">` renders `dir="rtl"` post-swap | Can grep the RTL_LANGS map or run a headless check; cheap insurance |
| Rich Results Test (`search.google.com/test/rich-results`) | Validate SoftwareApplication + aggregateRating JSON-LD before and after SEO-05 gate flip | Free; catches aggregateRating field errors the Rich Results Test flags (ratingValue/ratingCount types) |
| `Resolve-DnsName` (Windows) / `dig` | Verify the 8 DNS records before cutover | GitHub docs explicitly recommend this for Windows users |
| Agent-drafted dictionaries + owner review | Produce 17 dictionaries | See "Dictionary workflow" below — the app's own 20-locale `strings.xml` is the terminology source |

## Feature-by-Feature Detail

### (a) RTL handling (I18N-05) — pure HTML/CSS, no tooling

**HTML mechanism (verified, MDN):**
- Set `dir="rtl"` on the `<html>` element for ar/ur, alongside `lang`. The `dir` attribute is semantic (Unicode BiDi base direction), survives CSS-off, and is the W3C-recommended mechanism. `lang` does **not** imply direction — `dir` must be set explicitly.
- i18n.js already owns the `documentElement.lang` sync in `applyLanguage()` (line 71) — this is the one integration point. Add a `RTL_LANGS = { 'ar': 1, 'ur': 1 }` map (17 new langs: only these two are RTL) and set `document.documentElement.dir` in the same pass. The snapshot/restore path (EN restore) must reset `dir` to `''`/`ltr` — put it next to the `lang` restore.
- `dir="auto"` is for unknown-directionality content (user comments); not needed here — all content language is known at switch time. Not at page level, ever.
- Inline mixed-direction text (English/ES strings inside an RTL page, e.g. the language switcher): the `lang-switcher-slot` endonyms render best with `dir="ltr"` on the slot container (LTR separators stay stable inside an RTL page). For a single inline opposite-direction phrase inside RTL text, MDN's verified pattern is wrapping in an element with explicit `dir` — `<bdi>` is the terser inline-isolation tool (behaves as `dir="auto"` + isolation).

**CSS mechanism (verified, MDN logical properties module):**
- Prefer logical properties in new/edited CSS: `margin-inline-start/end`, `padding-inline-*`, `border-inline-*`, `inset-inline-*`, `text-align: start` (never `left`/`right`), logical border radii (`border-start-start-radius`…). Flex row order flips automatically with direction; no per-Rule override needed.
- For existing physical properties, don't rewrite the whole stylesheet: keep the shared stylesheet, add a small `[dir="rtl"]` attribute-selector override layer (guaranteed support) for the few genuinely directional bits: text-alignment edge cases, chevron/arrow inline-SVGs (`transform: scaleX(-1)`), background-position/texture offsets. `:dir()` pseudo-class is now evergreen-supported (Chrome 120+, Safari 16.4+, Firefox 49+) but attribute selectors are unambiguous and cost nothing — use `[dir="rtl"]` as the mechanism, `:dir()` is unnecessary.
- `unicode-bidi: isolate` is the default rendering behavior of `dir`-bearing elements — don't hand-set `unicode-bidi` overrides (the `bidi-override` value in particular will mangle text).

**Typography (no new dependency — system font stack covers all 19 scripts):**
- System font stacks on Android/iOS/Windows ship Noto Naskh (Arabic), Noto Nastaliq (Urdu), Devanagari (Hindi), Bengali, CJK, and Cyrillic fonts — no webfont CDN, no privacy/latency cost, consistent with the v1 decision.
- One real RTL/CJK risk: **line-height**. Nastaliq (Urdu) needs generous line-height (leading clipping is the classic Urdu breakage) and CJK prefers ~1.7. Add per-lang overrides like `[lang="ur"] { line-height: 2; }` in the shared stylesheet — a handful of lines, no tooling.
- The dark antique textures are physical decorations — MDN-verified rule: they don't need mirroring unless they depict reading flow (arrow motifs would).

**i18n.js changes (all in-file, no architecture change):**
- `SUPPORTED` grows to 20 entries; `detect()`'s hardcoded `pt*`/`es*` prefix folds become a data-driven scan (`SUPPORTED.map(l => l.toLowerCase().split('-')[0])` — but keep explicit `pt-BR`/`es` special-cases as they are today; simpler: replace the two `indexOf` lines with a loop over a `{prefix → lang}` map covering all 20).
- `ENDONYMS` grows to 20 entries — ready-to-use endonyms (standard native names; verify against the app's own locale list during implementation): ar العربية · bn বাংলা · de Deutsch · el Ελληνικά · en English · es Español · fr Français · hi हिन्दी · id Bahasa Indonesia · it Italiano · ja 日本語 · ko 한국어 · nl Nederlands · pl Polski · pt-BR Português · ru Русский · tr Türkçe · ur اردو · vi Tiếng Việt · zh 中文.
- **URL structure:** dictionary-swap means no new URLs — the 17 new languages have **no subdirs, no sitemap entries, no hreflang alternates**. `/es/`, `/pt/` static-page URLs from v1's original plan were superseded by the shipped in-place swap engine; nothing changes for the new languages. Dictionaries only: `js/i18n/{ar,bn,de,el,fr,hi,id,it,ja,ko,nl,pl,ru,tr,ur,vi,zh}.json` (102 keys each). Chinese = Simplified (`zh.json` = zh-CN vocabulary) unless the app's `strings.xml` shows otherwise.

### (b) Firebase App Check via reCAPTCHA v3 (FIRE-07)

**SDK module (verified this session):**
```js
// inside contact.js, after initializeApp(), before the dynamic auth/firestore imports
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js";

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('<reCAPTCHA-v3-site-key>'),
  isTokenAutoRefreshEnabled: true
});
```
- Same pinned CDN version (12.18.0), same ESM style as existing imports. **No `<script>` tag for reCAPTCHA is added to HTML** — the provider fetches the reCAPTCHA JS itself. Keep the fork-shaped architecture: App Check init lives in contact.js (the Auth+Firestore fork), touching nothing in consent.js.
- Setup: register the site for reCAPTCHA v3 (get site key + **secret key**) → Firebase console **App Check → Apps tab**: register the web app with the secret key → client `initializeAppCheck` with the site key. Default token TTL 1 day (library refreshes at ~half TTL); default app-risk threshold 0.5 — both fine defaults, no changes needed for this use case.

**Monitoring vs enforcement (verified):**
- **Monitoring mode requires zero console enforcement changes:** once the SDK is initialized, every Firebase request from the site carries an App Check token, but *no product blocks requests* until enforcement is enabled. Client code is **identical** in both modes — the flip is console-only.
- Monitoring phase = deploy init + watch **App Check request metrics** in the Firebase console (verified/unknown-origin breakdown; the console shows per-product Cloud Firestore + Authentication metrics). No dashboards to build.
- Enforcement flip = console toggle for **Cloud Firestore** (and Auth if desired). No client code change. Until then, invalid-token requests are only *recorded*, never blocked — zero user risk while metrics settle.
- Debug environments (localhost/local file): `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` before `initializeAppCheck`; the SDK prints the debug token in the console; register it via console → Manage debug tokens. **Never commit the debug token** (verified warning). CI environment: store the token as a GitHub Actions secret, set the variable before init. On a static site the CI rarely touches the form, so this is mainly a local-testing affordance.

**Integration points with the existing stack:**
- Init order is load-bearing: `initializeApp` → `initializeAppCheck` → dynamic import of `firebase-auth.js`/`firebase-firestore.js`. Monitoring mode tolerates any order; enforcement later requires the appCheck init to precede any enforced-service call — write it in the safe order from day one.
- **reCAPTCHA key domain list must include `persano.github.io` now AND the custom domain before HOST-01 cutover** — otherwise the contact form breaks at migration (silent failure mode: reCAPTCHA rejects the origin). This is the single cross-feature coupling in the milestone; put it in the HOST-01 checklist.
- Privacy surface: reCAPTCHA v3 JS loads from `google.com` when the form initializes — mention reCAPTCHA in the privacy policy text (one sentence, no new page), and note the form still works identically after analytics Accept/Reject (App Check is form infrastructure, not analytics).

### (c) GitHub Pages custom domain (HOST-01)

**Repo side (verified — Actions-published Pages):**
1. Repo **Settings → Pages → Custom domain**: enter the domain → Save. This persists server-side. Per the docs, with a custom GitHub Actions workflow **no `CNAME` file is created, and any existing `CNAME` file is ignored and is not required**. Committing a `CNAME` file is harmless (ignored) but unnecessary — the settings field is the mechanism. (If you ever switched to branch publishing, the file becomes load-bearing — worth a one-line comment in the workflow.)
2. Domain **verification** (recommended before DNS): Profile (user) **Settings → Pages → Add a domain** → add the DNS TXT record `_github-pages-challenge-persano.<domain>` with the generated code → Verify. Prevents takeover of the domain by other GitHub users if the repo/Pages link ever breaks.
3. After DNS is live: `Enforce HTTPS` toggle (available up to 24h after cert provision). GitHub auto-redirects apex ↔ `www` when both are configured — configure both, pick one as the Pages custom-domain value (convention: apex; `www` CNAME redirects to it).

**DNS side (owner's registrar — exact records, verified):**

| Record | Name | Value |
|--------|------|-------|
| `A` ×4 | `@` (apex) | `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153` |
| `AAAA` ×4 | `@` (apex) | `2606:50c0:8000::153` `2606:50c0:8001::153` `2606:50c0:8002::153` `2606:50c0:8003::153` |
| `CNAME` ×1 | `www` | `persano.github.io` (points directly at the `<user>.github.io` default domain, no repo name) |

Order matters (docs warning): **add the domain in repo settings BEFORE pointing DNS** — configuring DNS first leaves a takeover window. Remove any provider default records first. No wildcard records (takeover risk).

**URL rewrite inventory (all hardcoded absolute URLs, one mechanical pass):**
- `<link rel="canonical">`, `og:url`, `og:image` (absolute URL), `twitter:image` on all pages; every `hreflang` alternate URL (v1 rule: fully-qualified, self-referencing, reciprocal).
- `sitemap.xml` — every `<loc>`; `robots.txt` — `Sitemap:` line; JSON-LD — `url`/`installUrl` fields.
- **Unaffected:** all root-relative assets and fetches — `DICT_URL_PREFIX = '/js/i18n/'`, CSS/JS/WebP references — so zero JavaScript changes.
- Firebase console: add the custom domain to the App Check reCAPTCHA key's domain list (before cutover); Fire-Side Auth authorized domains list gains the custom domain.
- External re-registration: Search Console (add/verify the new domain property, re-submit sitemap), Play Console website field (owner step).
- GitHub 301s `persano.github.io` → custom domain automatically once configured, so stale old-URL references don't break.

### (d) 17 dictionaries — drafting & quality tooling (I18N-05)

**No new tooling dependency.** Recommended workflow (zero-build, agent-maintained model):

1. **Terminology source (the biggest quality lever):** the app itself has the same 20 localizations in `C:\Users\Familia\antigravity\GeoHist-Trivia` (`strings.xml` × 20). Borrow the app's established translations for game terms (history/geography vocabulary, mode names) so site and app never contradict each other. This replaces any translation-memory tool.
2. **Agent drafts each of the 17 flat JSON dictionaries** (102 keys mirroring es/pt-BR shape), owner reviews before merge — this is already the project's maintenance model.
3. **Gate extension** (extend the existing zero-dep `i18n-keycheck.mjs`, no new deps):
   - add `changelog.html` to the `pages` array (CONT-06 keys enter the surface);
   - flag empty / whitespace-only values;
   - (optional) length-ratio warning vs the EN value — catches translation accidents (truncation, untranslated EN leftovers).
   - No placeholder-parity check is needed: the dictionaries are plain strings with **no interpolation tokens** (verified — no `{}`/`%s` in current dicts).
4. **RTL spot-check as part of review:** paste ar/ur values into the page, verify punctuation lands on the correct side and endonyms/switcher stay isolated (`<bdi>`/`dir="ltr"` on the switcher slot).
5. Ordering constraint (already in PROJECT.md, reaffirm): build the changelog page's keys into the **3 existing dictionaries first**, then expand to 20 — otherwise the parity gate fails mid-flight.

**Considered and rejected — verified alternatives:** `i18next-parser` (latest **9.4.0** via npm registry this session) is a key-*extraction* tool for framework projects — wrong shape for a flat-dictionary parity problem the existing gate already solves. Any TMS (Lokalise/Crowdin) is overkill for 102 keys × 20 locales with an agent-maintained content model.

### (e) Gated aggregateRating + social proof (SEO-05)

**No new libraries.** Verified against Google Search Central (Software App structured-data page, updated 2025-12-10, fetched this session):

- Rich-result eligibility for `SoftwareApplication` requires: `name`, `offers.price` (**already present in the shipped JSON-LD** — `"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }`), and **either** `aggregateRating` **or** `review`. So SEO-05 is a pure JSON-LD addition:
  ```json
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": <from Play>,
    "ratingCount": <from Play>
  }
  ```
  (default best/worst 1–5 matches Play's scale; add `bestRating` only if ever non-5).
- **Self-serving nuance (verified in the Review Snippet doc):** the "entity reviews itself" ineligibility rule applies **only to `LocalBusiness` and `Organization` types** — a `SoftwareApplication` page carrying the app's real Play rating **is eligible** for star rich results. The gating decision (SEO-05: wired but structurally off until real Play ratings exist) is still correct — Google takes manual action on inauthentic ratings, and the app currently has none.
- **Gate mechanics (zero JS):** keep the `aggregateRating` block as commented-out JSON-LD (or commented `<script>`), plus a `hidden` social-proof section; the owner's gate flip = one uncomment + one `hidden` removal in a chat session (site is agent-maintained). Stars/ visuals are inline SVG (existing icon policy); the rating text ("X.Y · N ratings") is **i18n-keyed** and rides the dictionary expansion — one more reason changelog/social-proof keys land before the 17-locale expansion.
- Validate with the Rich Results Test after the gate flip; note Google explicitly does not guarantee rich-result display even for valid markup.

### (f) Changelog page (CONT-06) — nothing to add

Pure static HTML page in `/geohist/`, same layout machinery, new `data-i18n` keys. Stack impact is exactly two items already covered: keycheck `pages` array edit + dictionary key additions before locale expansion. CI picks it up automatically (`html-validate` glob `geohist/*.html`, `linkinator` crawl).

## Installation

```bash
# Runtime: NOTHING new. Firebase app-check rides the existing pinned CDN module:
#   https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js  (verified live)

# Dev dependencies: unchanged from v1 — package.json needs zero edits.
# (All new "tooling" is an extension of scripts/i18n-keycheck.mjs, node built-ins only.)
```

```text
# DNS (owner, at registrar — HOST-01):
@     A     185.199.108.153 / 109.153 / 110.153 / 111.153
@     AAAA  2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153
www   CNAME persano.github.io
_github-pages-challenge-persano.<domain>  TXT  <code from profile Pages settings>
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| reCAPTCHA v3 App Check provider | **reCAPTCHA Enterprise** (`ReCaptchaEnterpriseProvider`) | Google's stated preference for *new* integrations (10k assessments/mo free). Use it instead if the owner is willing to link a Cloud Billing account to the Firebase project, or if form spam turns out to be sophisticated enough to need Enterprise fraud signals. Switching later is contained: swap `ReCaptchaV3Provider` → `ReCaptchaEnterpriseProvider` and re-register the key in console. |
| `dir` attribute + logical properties | Separate mirrored RTL stylesheet (`rtl.css`) duplicating selectors | Only if the design ever needs *different visual layouts* (not mirrored) for RTL — not the case; logical properties + a handful of `[dir="rtl"]` overrides mirror everything correctly. |
| `dir="rtl"` on `<html>` set by i18n.js | `dir="auto"` | Never as page-level mechanism — `auto` is a per-element heuristic for unknown-direction content (MDN-verified); explicit `dir` is correct here because language is known per switch. |
| Repo-settings custom domain (Actions publishing) | `CNAME` file in repo root | Required **only** if publishing source changes from Actions to a branch. Keep the settings field authoritative. |
| Extended `i18n-keycheck.mjs` | `i18next-parser` 9.4.0 / translation-management platforms | i18next-parser when keys are extracted from source code with frameworks/TMs — not for 20 flat dictionaries under an exact-parity gate. |
| Agent-drafted + app-strings terminology + owner review | Paid translation service | If owner wants professional QA on the 17 dictionaries before shipping; cost/benefit poor for a landing site where the app itself is the authoritative terminology source. |
| Commented-out JSON-LD gate for aggregateRating | Fetching live Play rating client-side (Play scraper/Google API) | Never for this project — runtime dependency + ToS-stability risk; a manual gate flip in an agent-maintained site is free. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| reCAPTCHA Enterprise *for this milestone* | Requires Cloud Billing account linkage + GCP surface for a single form; Google's "use Enterprise" guidance is a recommendation, not a deprecation — v3 remains fully supported (doc live 2026-09-02) | reCAPTCHA v3 + monitoring-first; document Enterprise as upgrade path |
| A third-party consent/CMP or captcha-widget library | Zero-build constraint; App Check's reCAPTCHA integration needs no widget markup | `ReCaptchaV3Provider` (invisible; no widget, no user interaction) |
| `dir` via CSS `direction`/`unicode-bidi` as the primary mechanism | Presentation-only; breaks with CSS off; MDN explicitly recommends the HTML attribute as semantic | `dir` attribute, CSS as override only |
| Separate `dir=auto` markup for known-language content | Heuristic designed for unknown-direction user content | Explicit `dir` per language + `<bdi>` for inline mixed runs |
| Mirrored duplicate stylesheets / `html[dir=rtl]` full overrides of everything | Maintenance × 2 for a site that mostly uses flex + center alignment | Logical properties at edit points + minimal `[dir="rtl"]` overrides |
| New npm deps for i18n lint/parity (i18next-parser, linting platforms) | Wrong tool shape; existing exact-parity gate is stricter than generic tools | Extend `i18n-keycheck.mjs` |
| CNAME file as the domain mechanism | Explicitly "ignored and not required" for Actions publishing (docs, verified) | Repo Settings → Pages custom-domain field |
| hreflang/sitemap entries for the 17 JS-swap languages | They have no URLs — in-place swap; alternates exist only for real URL variants (en/es/pt-BR) | Endonym switcher + navigator-language detection only |
| Webfont CDNs for Arabic/Urdu/Hindi/Bengali/CJK glyphs | Privacy/latency cost; system fonts cover all 19 scripts | System font stack + per-lang line-height overrides |
| Fetching Play ratings live for social proof | No official lightweight endpoint; scrapes break; adds runtime dependency | Static JSON-LD + hidden-section manual gate flip |

## Stack Patterns by Variant

**If form spam survives App Check enforcement (v3):**
- Keep monitoring metrics for one cycle, raise the app-risk threshold (slider, console — default 0.5), or flip to `ReCaptchaEnterpriseProvider` (requires billing-account linkage). Zero client-architecture change either way.

**If the owner registers a subdomain custom domain (e.g. `apps.example.com`):**
- Single `CNAME` record → `persano.github.io` instead of the 9 apex records; everything else identical (settings, verification TXT, URL rewrite).

**If a future language needs true per-URL SEO (e.g. Arabic static pages):**
- Reuse the v1 `/es/`-style static-subdir pattern for that language only; the JS-swap languages stay dictionary-only. This is a URL-structure change, not a stack change.

**If Play ratings fluctuate after gate flip:**
- Ratings are hand-updated in the JSON-LD + social-proof text during agent sessions (matches maintenance model); keep the gate flip commit as the moment to record the owner's updating habit.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `firebase` (CDN) @ 12.18.0 | `firebase-app-check.js` @ 12.18.0 | Verified live on gstatic this session — the module exists at the exact pinned version and imports the pinned `firebase-app.js`. No version bump required. |
| `firebase/app-check` @ 12.x | reCAPTCHA v3 / Enterprise providers | Debug-token mechanism (`self.FIREBASE_APPCHECK_DEBUG_TOKEN`) is read at initialization time in v9+ — the pre-v9 "must set in index.html before bundle load" restriction does not apply. |
| `html-validate` 11.12.0 | new changelog page, RTL attributes | `geohist/*.html` glob covers the new page; `dir` is a standard global attribute (no plugin needed). |
| `i18next-parser` 9.4.0 | n/a | Not adopted — listed only to pin the "considered alternative" reference honestly. |

## Sources

- Firebase App Check — reCAPTCHA v3 web provider (`firebase.google.com/docs/app-check/web/recaptcha-provider`, page dated 2026-09-02) — init API, TTL, risk threshold, monitoring/enforcement split, Enterprise recommendation — **HIGH**
- Firebase App Check — reCAPTCHA Enterprise provider (same session) — `ReCaptchaEnterpriseProvider`, Cloud Billing linkage, 10k/mo free quota, 2×/hour token refresh — **HIGH**
- Firebase App Check — debug provider (web) — `self.FIREBASE_APPCHECK_DEBUG_TOKEN`, console registration, "do not commit" warning — **HIGH**
- gstatic CDN — fetched `https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js` directly (200, imports pinned `firebase-app.js`) — **HIGH**
- npm registry (live this session) — `firebase@latest` = 12.18.0 (pin current), `i18next-parser@latest` = 9.4.0 — **HIGH**
- GitHub Docs — Managing a custom domain for your GitHub Pages site (apex A/AAAA values, www CNAME, "add domain before DNS" warning, **CNAME file ignored under Actions publishing**, Enforce HTTPS) — **HIGH**
- GitHub Docs — Verifying your custom domain for GitHub Pages (`_github-pages-challenge-<user>` TXT record, profile-level settings) — **HIGH**
- MDN — `dir` HTML global attribute (updated 2026-08-28): `dir` on `<html>`, `dir=auto` semantics, `<bdi>` isolation, `unicode-bidi` override guidance — **HIGH**
- MDN — CSS logical properties and values module: full property list for direction-relative margins/padding/borders/insets/alignment — **HIGH**
- Google Search Central — Software app (`SoftwareApplication`) structured data (updated 2025-12-10): required `name` + `offers.price` + (`aggregateRating` | `review`) — **HIGH**
- Google Search Central — Review Snippet (Review, AggregateRating): self-serving restriction scoped to `LocalBusiness`/`Organization` (SoftwareApplication not restricted); aggregateRating field guidance — **HIGH**
- Endonyms for the 20-language switcher: standard native-language names (training knowledge, cross-checkable against the app's own `strings.xml` locale list) — **MEDIUM-HIGH**
- `:dir()` evergreen support status — Chrome 120+/Safari 16.4+/Firefox 49+ (training knowledge, not re-verified this session) — **MEDIUM** (irrelevant if attribute selectors are used, as recommended)

---
*Stack research for: Persano / GeoHist Trivia site — v2.0 milestone additions*
*Researched: 2026-09-05*
