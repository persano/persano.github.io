# Architecture Research — v2.0 Milestone Feature Integration

**Domain:** Static GitHub Pages site — integration research for 5 new features onto a live v1 architecture
**Researched:** 2026-09-05
**Confidence:** HIGH (integration points verified against actual repo source; external claims verified against official Firebase / GitHub / Google Search Central docs)

**Scope note:** This is *not* greenfield architecture research. The v1 architecture is shipped and frozen; this file maps **how each of the 5 new features bolts onto it** — integration points, new vs modified components, data-flow changes, and build order with dependency reasoning. Every claim about existing structure was read from the live source files, not assumed.

**Context corrections found during research** (milestone brief vs repo reality):
1. Brief says "102 keys" — actual live surface is **146 keys** (`node scripts/i18n-keycheck.mjs` → "146-key live surface", es + pt-BR both exactly cover it).
2. Brief says "hreflang alternates in sitemap.xml" — **no hreflang exists anywhere** (not in sitemap, not in-page). Correct and unchangeable: the i18n engine is dictionary-swap on the *same URL*, so hreflang alternates don't apply at all. Nothing to preserve or extend — remove hreflang from the v2 plan unless per-language URLs are adopted (anti-pattern here; see Anti-Pattern 3).

---

## Standard Architecture (v1 baseline + v2 deltas)

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        PAGES (hand-authored HTML)                    │
├──────────────────────────────────────────────────────────────────────┤
│  index.html (hub)      geohist/{index,guide,contact,privacy,404}     │
│  [MODIFIED ×5: new nav link, absolute-URL rewrite, JSON-LD edit]     │
│  [NEW] geohist/changelog.html                                         │
├──────────────────────────────────────────────────────────────────────┤
│                        JS SURFACES (classic defer scripts)           │
├──────────────────────────────────────────────────────────────────────┤
│  i18n.js [MODIFIED]          consent.js [UNTOUCHED]                  │
│   · SUPPORTED 3→20            · consent store, banner, retraction    │
│   · detection prefix map      · analytics load-gating (untouched)    │
│   · NEW: dir=rtl/ltr in apply pass                                    │
│  contact.js [MODIFIED]       firebase-config.js [MODIFIED]           │
│   · 4th CDN module: app-check · NEW field: recaptcha site key         │
│   · init chain: app→appCheck→auth→firestore                          │
├──────────────────────────────────────────────────────────────────────┤
│  i18n/es.json, pt-BR.json [MODIFIED: +changelog keys]                │
│  i18n/{hi,zh,fr,…,ar}.json ×17 [NEW]                                 │
├──────────────────────────────────────────────────────────────────────┤
│                        SHARED CSS                                    │
│  css/base.css [MODIFIED] — new tokens for changelog page, one small  │
│  [dir="rtl"] override block (~4 rules); rest auto-flips via flex/grid│
├──────────────────────────────────────────────────────────────────────┤
│                        SEO / CI / INFRA                              │
│  sitemap.xml [MODIFIED: +changelog URL, domain rewrite]              │
│  robots.txt [MODIFIED: domain rewrite only]                          │
│  scripts/i18n-keycheck.mjs [MODIFIED: +changelog in pages array]     │
│  package.json [MODIFIED: linkinator skip regex, smoke-check BASE]    │
│  .github/workflows/deploy.yml [UNCHANGED]                            │
│  firebase/firestore.rules [UNCHANGED]                                │
├──────────────────────────────────────────────────────────────────────┤
│  EXTERNAL (console/owner-side, no code):                             │
│  · GitHub Settings → Pages: custom domain field (HOST-01)            │
│  · Firebase console: Auth authorized domains, App Check metrics +    │
│    enforcement flip (FIRE-07)                                        │
│  · reCAPTCHA Admin: v3 site key + domain allowlist                   │
│  · Search Console: new domain property + sitemap resubmit            │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities (new vs modified, per feature)

| Component | Status | Feature | Change |
|-----------|--------|---------|--------|
| `geohist/changelog.html` | **NEW** | CONT-06 | Static page, keyed markup (`changelog.*` namespace), rides existing styles |
| `js/i18n/*.json` ×17 | **NEW** | I18N-05 | Flat JSON, exact 146+N key parity (enforced by gate) |
| `js/i18n/es.json`, `pt-BR.json` | MODIFIED | CONT-06→I18N-05 | Gain changelog keys in same commit as the page |
| `js/i18n.js` | MODIFIED | I18N-05 | `SUPPORTED` 3→20; `ENDONYMS` 20 entries; hardcoded pt/es detection prefixes → data-driven prefix map; **new**: `dir` set per language (rtl for ar/ur, ltr otherwise) in `applyLanguage()` |
| `css/base.css` | MODIFIED | I18N-05 | One `[dir="rtl"]` block (~4 rules); new changelog styles if needed |
| `js/contact.js` | MODIFIED | FIRE-07 | `loadModules()` imports 4 modules (adds `firebase-app-check.js`); init order app→`initializeAppCheck`→auth→firestore; graceful degrade if App Check fails (same silent-error pattern as auth) |
| `js/firebase-config.js` | MODIFIED | FIRE-07 | Adds reCAPTCHA v3 site key (public by design, same rationale as existing config) |
| `geohist/index.html` (JSON-LD) | MODIFIED | SEO-05 | Add `aggregateRating: {ratingValue, ratingCount}` behind an owner flip — file initially ships without it, PR adds it when Play ratings are real |
| All 6 HTML heads, `sitemap.xml`, `robots.txt`, `scripts/smoke-check.sh`, `package.json` (linkinator skip) | MODIFIED | HOST-01 | Mechanical `https://persano.github.io` → `https://<domain>` rewrite (42 refs, 13 files); root-relative asset paths (`/css/`, `/js/`, `/geohist/`) untouched |
| `scripts/i18n-keycheck.mjs` | MODIFIED | CONT-06 | `pages` array gains `geohist/changelog.html` |
| `scripts/smoke-check.sh` | MODIFIED | HOST-01 | `BASE` var rewrite |
| `consent.js`, `deploy.yml`, `firestore.rules`, 404 flow | UNTOUCHED | — | Analytics consent gate, CI chain, rules carry over as-is |

### Structure additions

```
/
├── geohist/
│   └── changelog.html        # NEW — joins the keyed page set
├── js/
│   ├── i18n/
│   │   ├── es.json           # existing
│   │   ├── pt-BR.json        # existing
│   │   └── {17 new}.json     # NEW — same flat shape, exact key parity
│   └── i18n.js               # modified engine (no new files needed)
```

**Rationale:** No new JS surface, no new stylesheet, no build tooling. The changelog page is the only new artifact beyond 17 JSON dictionaries. This is the payoff of the v1 "structure anticipates future content" decisions.

---

## Integration Point Analysis (per feature)

### 1. CONT-06 — Changelog page `/geohist/changelog.html`

**Integration points:**

| Touchpoint | Change | Why |
|------------|--------|-----|
| `geohist/changelog.html` | NEW file | Same head pattern as `guide.html`: canonical, OG, stylesheet, 3 defer scripts |
| `geohist/*/index|guide|contact` nav | Add `Changelog` link with key `geohist.nav.changelog` | Nav is a keyed surface (`data-i18n`) |
| `scripts/i18n-keycheck.mjs` | Add page to hardcoded `pages` array | Gate extracts surface only from the 4 listed pages — a keyed page not listed is **invisible to the gate** (silent parity drift) |
| `sitemap.xml` | Add URL entry | Every public page |
| `package.json` `validate:html` | Nothing — glob `geohist/*.html` picks it up automatically | Already future-proof |
| Screenshot/asset dir | Nothing | Changelog is text-only |

**Data-flow change:** none — static content, no JS behavior beyond existing i18n/consent.

**Atomicity constraint (drives build order):** the key gate demands *exact* set equality per dictionary at every commit. Adding `changelog.*` keys to markup immediately makes es.json/pt-BR.json fail the gate → **the page and its key additions to es+pt-BR must land in one commit/PR.** Landing the page *before* the 17 locales means that atomic commit touches only 2 dictionaries, not 20. This is the single strongest ordering signal in the milestone.

**Changelog content maintenance:** entries are agent-maintained static `<li>`s (site maintenance model is agent-driven). Keep entries short; the key surface grows ~6–10 keys per entry, and every key multiplies ×20 dictionaries — price content growth accordingly (numbered version rows, terse bullet strings).

### 2. I18N-05 — 17 localizations + RTL (ar, ur)

**Integration points (all in one file + 17 new files):**

| Touchpoint | Change |
|-----------|--------|
| `i18n.js` `SUPPORTED` | `['en','es','pt-BR']` → 20 entries. `readPref()` membership check and dictionary fetch scale automatically — no other array edits |
| `i18n.js` `detect()` | Hardcoded `pt*`/`es*` prefix checks → data-driven prefix table (lang → prefix list; `pt*`→pt-BR, `es*`→es, `zh*`→zh, etc.). The scan-across-`navigator.languages` behavior (D-32) must be preserved verbatim |
| `i18n.js` `ENDONYMS` + switcher | 20 endonym entries. UX decision for roadmap: same single-line footer slot will wrap on mobile — keep it (CSS-only, no engine change) or group. Do **not** build a dropdown/select — the current slot pattern is tested, accessible, and zero-CSS |
| `i18n.js` `applyLanguage()` | **New line:** `document.documentElement.dir = (lang==='ar'\|\|lang==='ur') ? 'rtl' : 'ltr'` — same pass as the `lang` sync (D-29). Engine snapshot captures text/attrs only; `dir` is stateless per apply, no snapshot needed |
| `js/i18n/{17}.json` | NEW files, flat shape (existing `loadDict` validates shape), 146+changelog keys each |

**RTL × the shared stylesheet — verified against `css/base.css`:**

| Selector | Property | RTL verdict |
|----------|----------|-------------|
| `.faq-item summary::after` | `right: 1rem` (accordion "+") | **Needs mirror** → `[dir="rtl"] .faq-item summary::after { right:auto; left:1rem; }` |
| `.gallery-tile svg` | `left: 50%` + centered transform | Symmetric center — no change |
| `.consent-banner` | `left:0; right:0` | Symmetric — no change |
| `.hp-field` | `left: -9999px` | Off-screen either way — no change |
| everything else | flexbox/grid + `text-align: start`-equivalent flow | Auto-flips with `dir` |

The stylesheet was authored with flex/grid flow layout and CSS custom properties only — custom properties (`--color-*`, `--font-*`, `--hairline*`) are direction-agnostic and need zero RTL work. **One small `[dir="rtl"]` block is the whole cost.** Texture utilities are decorative background layers — unaffected by direction.

**Script coverage:** system font stack (`system-ui, Segoe UI, Roboto…`) falls back to native Arabic/Urdu Nastaliq/Devanagari/Bengali glyph rendering on every evergreen browser. No font CDN (constraint honored). Urdu users get Nastaliq where the platform ships it (Windows/Android do; iOS ships Nastaliq for ur since iOS 14) — acceptable without webfonts.

**Analytics:** `language_switch` event needs no change — `consent.js` listens on `persano:langchange` and logs `from`/`to` generically.

**Dictionary authoring flow:** agent drafts all 17 from the EN snapshot; owner reviews. Gate behavior: CI fails until every dictionary exactly matches the surface — so all 17 land in one PR (or sequenced PRs where each adds a full dictionary; adding a dictionary is independent, they don't interact). An *empty-pending* locale cannot exist in `js/i18n/` without failing CI — either land complete or don't commit the file.

### 3. HOST-01 — Custom domain migration

**Integration points — verified absolute-URL inventory (rg across repo, 42 refs / 13 files, excluding lockfile/comments):**

| File(s) | Refs | What |
|---------|------|------|
| `index.html`, `geohist/{index,guide,contact,privacy}.html` | 4 each = 20 | `rel=canonical`, `og:url`, `og:image`, `twitter:image` |
| `geohist/index.html` | +6 extra | JSON-LD `url`, `image`, 4 `screenshot` URLs |
| `sitemap.xml` | 5 | `<loc>` entries |
| `robots.txt` | 1 | `Sitemap:` line |
| `scripts/smoke-check.sh` | 1 (+comment) | `BASE=` post-deploy smoke base |
| `package.json` | 1 | linkinator `--skip` regex allowlist |
| `js/firebase-config.js` | 1 | comment only — code is domain-agnostic |

**Zero-touch (deliberately):** `DICT_URL_PREFIX='/js/i18n/'`, stylesheet/script `src="/js/..."`, all internal nav links — root-relative, domain-agnostic. Firebase CDN URLs — absolute, unrelated.

**Console/owner-side coupling (the real work of this feature):**

1. GitHub **Settings → Pages → Custom domain** + DNS (apex `A` 185.199.108–111.153, `AAAA` 2606:50c0:8000–3::153, `www` CNAME → `persano.github.io`). Verified: **with an Actions publishing source, no CNAME file is required and any existing CNAME is ignored** — do not add one; the deploy chain (`configure-pages@v6` + `deploy-pages@v5`) needs no workflow edit.
2. HTTPS cert auto-provisions (up to 24h) → then Enforce HTTPS.
3. **Firebase console:** Auth *Authorized domains* — add custom domain (or anonymous-auth sign-in for the form starts failing — high-severity, silent-ish: shows as `auth/unauthorized-domain` in the form error path). App Check reCAPTCHA domain list — see #4.
4. Google verification file: old `google7da873f4e9609872.html` serves the old property; register a *new* Search Console property for the custom domain (DNS or file verification), resubmit sitemap.
5. GitHub **domain verification** (recommended by docs — anti-takeover) via org/user settings.
6. `app-ads.txt` serves identically at the new domain; if Play Console references the site domain, update in the next Play console touch (already an owner-side task family).

**Redirect safety:** GitHub Pages 301-redirects `persano.github.io` → custom domain automatically once configured. Canonicals flip in the same deploy as the domain goes live — no intermediate canonical mismatch window worth engineering around, since redirect + canonical change ship in one push.

### 4. FIRE-07 — App Check (reCAPTCHA v3)

**Placement decision: inside `contact.js`'s lazy `loadModules()` — nowhere else.**

Verified from Firebase docs (updated 2026-09-02): `initializeAppCheck(app, { provider: new ReCaptchaV3Provider(SITE_KEY), isTokenAutoRefreshEnabled: ... })` must run **before accessing any Firebase service**; enforcement is console-side (client ships tokens; products ignore validity until console flip) — meaning **monitoring mode is the code's natural state**: ship the init, watch metrics, flip enforcement later with zero code change. This matches the milestone's "monitoring first" plan exactly.

**Integration with the existing contact pipeline:**

```
submit → honeypot (unchanged) → pre-network validation (unchanged)
  → loadModules(): import app + auth + firestore + **app-check**   [MODIFIED: 3→4 modules]
  → app init (existing idempotent default-app logic, reused as-is)
  → initializeAppCheck(app, {ReCaptchaV3Provider, isTokenAutoRefreshEnabled:false})   [NEW]
  → signInAnonymously (existing)
  → addDoc(messages, payload)   [UNCHANGED — App Check token is attached
                                 automatically by the Firestore client per-request;
                                 rules unchanged; token rides headers, not payload]
```

**Where App Check sits relative to consent gating:** nowhere. Deliberately.

- App Check is an anti-abuse transport mechanism for the compliance surface, the same category as the honeypot — not measurement. The form must work identically after Accept *or Reject* (v1 "fork-shaped Firebase split" decision); routing App Check through `consent.js` would couple the form to the banner and break that invariant.
- Mechanically it lives in the same lazy dynamic-import family as auth/firestore: **zero App Check bytes until a real submit** — matching the established "lazy submit-time import" pattern, and incidentally minimizing reCAPTCHA cookie exposure (strictly-necessary-leaning GDPR posture; reCAPTCHA v3 does set cookies — the submit-time-only load is the strongest privacy stance available while still using App Check).
- `isTokenAutoRefreshEnabled: **false**` (opinionated, MEDIUM confidence): the App Check instance is created at submit time inside a short-lived page context and used once immediately — background auto-refresh would schedule reCAPTCHA pings for a page the user is about to leave. Auto-refresh matters for long-lived sessions; not this.

**Analytics independence:** `consent.js` untouched; the `initializeApp` reuse in `contact.js` (`getApp()` try/catch) already handles "analytics initialized the app first" — App Check slots into the same reused app instance with no new coordination.

**Failure policy:** mirror the file's existing pattern — an App Check failure (reCAPTCHA blocked, score below threshold under *enforcement*) surfaces as a FirebaseError on `addDoc` → existing `.catch` shows the keyed generic error status and logs the code (`permission-denied` post-enforcement, or `app-check/…` at init). In monitoring mode nothing user-visible changes. **No new status variants** unless the owner later wants a dedicated "blocked" message (optional; recommend against — error text is i18n-priced ×20).

**Domain coupling (ordering-critical):** the reCAPTCHA v3 site key carries a domain allowlist (reCAPTCHA Admin console). If the key is registered against `persano.github.io` and the custom domain lands later, the key needs a second domain edit — if the custom domain lands first, the key is registered once, correctly. This is the reason App Check follows HOST-01.

### 5. SEO-05 — Gated aggregateRating

**Integration point: one JSON block in `geohist/index.html`.** Verified against Google Search Central's SoftwareApplication spec: `aggregateRating` (with `ratingValue` + `ratingCount` per Review-snippet guidelines) is an optional, first-class property of the existing type — Google's own example (Angry Birds) is precisely the "mirror the store rating" pattern. The existing block already carries `name/operatingSystem/applicationCategory/offers/sameAs` — additive edit, zero restructure, no new i18n keys, no sitemap entry, no CI change.

**Gate mechanics:** values must mirror the live Play listing (owner flips when ratings are real and stable). Ship the PR with the fields commented out in-repo is *not* possible in JSON-LD — instead: gate = feature simply not merged until the Play listing is live, or merged with values from the listing the same day. An owner console step (`play_badge_click`-style flip is impossible — this is static HTML) → the gate is a **deferred PR**, not a runtime flag. Also note: values drift over time — the agent-maintenance model absorbs it (re-edit when Play rating shifts by ≥0.1 or a major release).

---

## Recommended Build Order (dependency-reasoned)

```
CONT-06 ──▶ I18N-05 ──▶ HOST-01 ──▶ FIRE-07 ──▶ SEO-05
 changelog   17 locales   domain      App Check    aggregateRating
   + keys     + RTL       migration   (gated on     (gated on
   (atomic     engine       ↑ owner     final        Play listing
   w/ 2 dicts) + 17 dicts  DNS race    domain)      live)
```

**Why this order — dependency reasoning:**

1. **Changelog before locales** (hard dependency): its new keys must ride the same dictionary-expansion commit. If locales landed first, the changelog would trigger a *second* 20-dictionary key-parity sweep — pure duplicated effort, and the gate makes it mandatory, not optional. Landing changelog first = one atomic commit touching 2 existing dicts + the page, then the locale PR copies the already-stable key surface ×17. Also: keycheck's `pages` array edit and the page must land *together* with the dict updates (the gate compares surface↔dictionaries at every push).

2. **Locale expansion after changelog, before domain** (soft): 17 × ~150-key JSON files are pure content — independent of the domain. Doing it before the domain rewrite keeps the domain migration a purely mechanical find/replace across *final* content (no locale PR rebase mid-migration, no risk of a locale PR reintroducing `persano.github.io` strings after the rewrite). RTL touches `base.css` + `i18n.js` only — no interplay with URLs. Bonus: the RTL/dir engine changes and the 20-entry switcher ship as one reviewable engine PR.

3. **Domain migration after content freeze, before App Check** (hard dependency, reversed): the URL rewrite sweep must cover all final pages (changelog included — hence its position *after* the changelog exists), and App Check's reCAPTCHA key must be registered against the *final* domain to avoid a second key edit. Owner-registering the domain is the only external wall — registration/DNS can be kicked off in parallel with phases 1–2; the *code* PR waits for DNS propagation so CI linkinator (which validates `sitemap.xml` → URLs) passes post-deploy. The github.io → custom domain redirect is automatic, so nothing breaks between Pages-config and the URL-rewrite push.

4. **App Check after domain**: single reCAPTCHA domain registration; monitoring metrics then reflect the domain where the site will actually live long-term (score distributions are per-domain context). Console-side enforcement flip is a *later, separate, owner-only* step — explicitly NOT a phase of its own; it's a task on FIRE-07's done criteria.

5. **aggregateRating last, and independently**: its only dependency is the Play listing going live (external gate, no code dependency on phases 1–4). It can interleave anywhere after the domain migration (the JSON-LD `url`/`image` fields it edits sit inside the same file the domain sweep rewrites — doing it after avoids conflicting with that rewrite). It's a ~10-line PR.

**Parallelization allowed:** domain registration (owner, no code) can run from day 1; the 17 dictionaries can be *drafted* (not merged) in parallel with the changelog work, since the gate only checks committed files.

---

## Data Flow Changes (summary)

### i18n apply flow (modified)

```
stored pref | navigator.languages → prefix table (20 langs) → en fallback
   ↓
fetch /js/i18n/<lang>.json → shape-validate → apply: textContent + attrs
   → html.lang = lang        (existing)
   → html.dir  = rtl|ltr     (NEW — ar/ur = rtl, else ltr)
   → persano:langchange {from, to} → analytics language_switch (unchanged)
```

### Contact submit flow (modified — App Check inserted)

```
honeypot → validate → lazy import (app, auth, firestore, app-check)
   → app init (reuse-or-create) → initializeAppCheck → anon auth → addDoc
   → App Check token auto-attached to Firestore request (SDK-internal)
   → create-only rules unchanged (rules now also validate App Check once enforcement flips)
```

### Deploy flow (unchanged shape)

```
push → validate job (html-validate 7 pages [glob], linkinator, i18n-keycheck 5 pages)
     → deploy job (unchanged 4-action Pages chain) → Pages CDN
     → smoke-check.sh vs BASE (BASE now = custom domain post-HOST-01)
```

---

## Anti-Patterns (specific to this integration)

### Anti-Pattern 1: Initializing App Check globally (consent.js or page load)
**What people do:** put `initializeAppCheck` next to the analytics loader "since they're both Firebase". **Why it's wrong:** loads reCAPTCHA bytes on every page for every visitor (form page only, today), couples the compliance surface to the consent choice, and pollutes App Check metrics with page-views that will never submit. **Do instead:** lazy init inside `contact.js`'s existing `loadModules()` submit path.

### Anti-Pattern 2: Writing the reCAPTCHA token into the Firestore payload
**What people do:** call `getToken()` manually and stash the token in the document. **Why it's wrong:** App Check attestation rides request headers via the SDK automatically; embedding tokens bloats the schema, leaks a secret-ish bearer into stored data, and the rules file would need a new guarded field. **Do instead:** just `initializeAppCheck` before service access — the SDK handles attachment; rules stay untouched.

### Anti-Pattern 3: Converting i18n to per-language URL subdirectories during the locale expansion
**What people do:** see "17 languages" and think `/es/geohist/`, `/de/geohist/`… (the pre-v1 stack research even sketched this). **Why it's wrong:** v1 shipped and validated the dictionary-swap engine with key-parity CI; 20 × static page sets = 120 files of duplicate markup, a rewrite of hreflang/sitemap/canonical plumbing, and double every future content edit — all to buy SEO targets the dictionary-swap site doesn't have. **Do instead:** keep dictionary-swap; one URL, one canonical, `lang` attribute synced by the engine (already implemented).

### Anti-Pattern 4: Merging the changelog page in a PR without its dictionary key additions
**What people do:** "page first, translations later." **Why it's wrong:** the exact-parity gate fails on the existing es/pt-BR dicts → CI red → deploy blocked. **Do instead:** one atomic commit: page + `pages` array entry + es.json/pt-BR.json key additions (+ sitemap + nav links).

### Anti-Pattern 5: RTL by forking the stylesheet or swapping stylesheets per direction
**What people do:** `base-rtl.css` loaded when ar/ur active. **Why it's wrong:** doubles the maintenance surface, desyncs from the single shared-stylesheet architecture, and the real override surface is ~4 rules (verified inventory above). **Do instead:** `[dir="rtl"]` block appended to `base.css`; flex/grid auto-flip does the rest.

### Anti-Pattern 6: Rewriting URLs in JS files during HOST-01
**What people do:** grep-replace the domain everywhere including JS internals. **Why it's wrong:** JS hits are comments/CDN URLs (gstatic) — the only genuinely domain-adjacent JS is none; the actual rewrite surface is HTML meta/JSON-LD + sitemap/robots + two scripts. **Do instead:** rewrite exactly the inventoried 13 files; leave `/js/i18n/` root-relative prefix alone.

---

## Integration Points (consolidated)

### External Services

| Service | Integration Pattern | Notes / gotchas |
|---------|---------------------|-----------------|
| Firebase App Check (reCAPTCHA v3) | 4th lazy CDN module in `contact.js`; init before auth/firestore | Monitoring = default (no code); enforcement = console-only flip; site key domain allowlist must include final domain; token TTL default 1d; debug provider for local testing |
| Firebase Auth authorized domains | Console: add custom domain | Form breaks (`auth/unauthorized-domain`) silently-ish until added — deploy-order checklist item |
| GitHub Pages custom domain | Settings → Pages field + DNS records | No CNAME file needed with Actions source; redirects automatic; cert ≤24h |
| Search Console | New property for custom domain; resubmit sitemap | Old property/file stays valid for github.io |
| Google Play listing | Source of truth for aggregateRating values | Gate = deferred PR; keep values mirrored |
| reCAPTCHA Admin | Register v3 key, domain allowlist, score monitoring | Threshold 0.5 default; tokens 2-min TTL (irrelevant here — Firebase SDK manages) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| i18n.js ↔ consent.js | `persano:langchange` event | Already exists; 20-lang expansion touches neither side's contract |
| i18n.js ↔ DOM | `data-i18n` / `data-i18n-attr` snapshot walk | Changelog must use plain-text keyed nodes only (Phase-2 contract) |
| contact.js ↔ consent.js | None (deliberate fork) | App Check must respect this boundary — init in contact.js only |
| firebase-config.js ↔ both consumers | `window.persanoFirebaseConfig` global | New `recaptchaSiteKey` field rides the same object |
| keycheck ↔ markup | regex extraction of key surface | Adding a keyed page requires editing the `pages` array (only hardcoded coupling in the toolchain) |

---

## Scaling Considerations

| Scale | Adjustment |
|-------|-----------|
| 20 languages / 6 pages (this milestone) | Nothing — 20 dicts ≈ 20 × 5KB fetched one-at-a-time per visitor choice; keycheck gate < 1s |
| Switcher UX at 20 entries | First friction point: 20 endonyms wrap ~3 lines in footer. Acceptable; if not, CSS-column the slot. No engine change |
| Dictionary drift with 20 dicts | Mitigated by the gate (exact parity, every PR). Human cost: every new key = 20 edits — agent-maintenance model absorbs it; keep namespaces tight |
| Future apps (hub growth) | Unaffected by all 5 features; `/geohist/` subdir pattern already generalizes |

**First bottleneck if the site grows:** key-parity bookkeeping across 20 dictionaries (content-velocity friction, not performance). Pre-planned escape hatch: per-language URL structure or an SSG — both deferred, both cheap to revisit since URLs are already clean.

---

## Sources

- Firebase official docs — App Check reCAPTCHA v3 web provider (`firebase.google.com/docs/app-check/web/recaptcha-provider`, updated 2026-09-02): init API, before-services requirement, `isTokenAutoRefreshEnabled`, console-side enforcement, metrics, TTL, risk threshold. **HIGH**
- Firebase official docs — App Check monitor-metrics covers Cloud Firestore + Authentication enforcement targets (referenced from provider page). **HIGH**
- GitHub official docs — Managing a custom domain for Pages: "If you are publishing from a custom GitHub Actions workflow, no CNAME file is created… not required"; apex A/AAAA record set; www CNAME → default domain; automatic redirects; HTTPS ≤24h. **HIGH**
- Google Search Central — SoftwareApplication structured data: `aggregateRating`/`review` property definitions, Review-snippet guideline linkage, GameApplication supported category, Google's store-rating example. **HIGH**
- Google reCAPTCHA v3 docs (`developers.google.com/recaptcha/docs/v3`, marked deprecated → Cloud Fraud Defense): score model, 0.5 default threshold, 2-minute token TTL, admin-console key registration; domain allowlist per key from `domain_validation` (training knowledge, MEDIUM) — **HIGH/MEDIUM mix, flagged**
- Live repo source (read this session): `js/i18n.js`, `js/consent.js`, `js/contact.js`, `js/firebase-config.js`, `scripts/i18n-keycheck.mjs`, `.github/workflows/deploy.yml`, `package.json`, `sitemap.xml`, `robots.txt`, `firebase/firestore.rules`, `css/base.css` (physical-property audit), all 6 HTML pages (URL inventory, nav/switcher/banner structure). **HIGH**
- RTL styling practices: training knowledge + codebase audit (no external fetch) — **MEDIUM**
- `isTokenAutoRefreshEnabled:false` recommendation rationale: reasoning over official init docs — **MEDIUM**

---
*Architecture research for: persano.github.io v2.0 milestone integration*
*Researched: 2026-09-05*
