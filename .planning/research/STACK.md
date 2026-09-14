# Stack Research

**Domain:** Brownfield static-site additions — home migration, Play launch kit, cleanup batch (GitHub Pages, zero-build)
**Researched:** 2026-09-11
**Confidence:** MEDIUM

> Confidence note: every claim below was verified the same day against live official vendor docs (Google Search Central, Google Search Console Help, npm docs, actions/setup-node, MDN/WHATWG). The seam's `classify-confidence --provider webfetch` returns a provider-generic `LOW` for raw webfetch (no library identity to verify); treat source authority, not the seam tier, as the real signal here. Overlapping claims (CoA doc ↔ site-move doc; npm ci doc ↔ setup-node doc) agree — cross-checked.

## Headline: Zero New Dependencies

**No runtime package, no dev package, no library of any kind is needed for v2.1.** All four features are file-level work on the shipped stack (plain HTML5/CSS3/vanilla ES2020+, single `css/base.css`, 19 JSON dictionaries, GitHub Actions validate→deploy). The only "stack change" in the entire milestone is restoring two lines in `.github/workflows/deploy.yml` (`npm ci` + `cache: npm`) — and even that requires no new tooling, because the lockfile is already committed and verified consistent.

Verification run against the repo before writing this file:

- `git ls-files package-lock.json` → tracked (lockfile v3, `lockfileVersion: 3`)
- Programmatic consistency check: all 5 devDependencies in `package.json` exactly match their `package-lock.json` pins (`html-validate 11.12.0`, `linkinator 8.1.0`, `@axe-core/cli 4.13.0`, `lighthouse 13.4.1`, `sharp 0.35.4`) → `LOCKFILE CONSISTENT`. `npm ci` will pass on first run after restore.

## Recommended Stack

### Core Technologies (unchanged, and what v2.1 touches in each)

| Technology | Version | Purpose | Role in v2.1 |
|------------|---------|---------|-----------------|
| Hand-authored HTML5 | n/a (zero-build) | All pages | Root `index.html` becomes the GeoHist landing; hub content moves to `/apps/index.html`; `/geohist/index.html` becomes a redirect stub |
| CSS3 (`css/base.css`) | n/a | Single shared stylesheet | Untouched — all pages already use site-absolute `/css/base.css`, so moving pages between root and subdirs requires zero CSS path edits (verified by grep: all `src`/`href` are `/…` absolute) |
| Vanilla ES2020+ JS | n/a | i18n engine, consent, contact | Untouched. `js/i18n.js` resolves dictionaries from `/js/i18n/` (absolute) — the keyed swap works identically at `/`, `/apps/`, and `/geohist/` |
| Firebase JS SDK | 12.18.0 exact-pinned (gstatic ESM CDN) | Analytics + Auth + Firestore + App Check | Untouched. Contact form stays at `/geohist/contact.html` — no migration |
| GitHub Pages (custom apex domain) | platform | Hosting + the only platform-level redirect | Platform 301 (legacy `*.github.io` host, path-preserved) unchanged; intra-domain moves use static stub pages (below) |
| GitHub Actions | checkout@v7 · setup-node@v7 · configure-pages@v6 · upload-pages-artifact@v5 · deploy-pages@v5, Node 24 | CI validate → deploy | One edit: `npm ci` + `cache: npm` in the validate job (cleanup phase) |
| `npm ci` / package-lock.json | npm 11.x on Node 24; lockfileVersion 3 | Reproducible dev-dep install | Already satisfied; only the workflow line needs restoring |

### New File-Level Additions (not libraries)

| Addition | Kind | Purpose | Mechanics |
|----------|------|---------|-----------|
| Redirect stub replacing `geohist/index.html` | HTML file | Landing URL move `/geohist/` → `/` | `meta http-equiv="refresh" content="0; url=https://geohisttrivia.com/"` + `<link rel="canonical" href="https://geohisttrivia.com/">` + visible fallback link + optional `location.replace` JS as convenience only (see Redirect Mechanic Decision) |
| `apps/index.html` | HTML file | Moved portfolio hub | Copy of current root hub, self-canonical `https://geohisttrivia.com/apps/`, `og:url` updated; future-app subdirs created as plain convention (no visible placeholders) |
| Root `index.html` (rewritten) | HTML file | Root = GeoHist landing | Adapted full landing; self-canonical `https://geohisttrivia.com/`; `og:url` root; JSON-LD `url` field updated; internal links point to `/geohist/*.html` subpages and `/apps/` |
| `sitemap.xml` edit | XML | URL inventory follows the move | Swap the `/geohist/` `<loc>` → `https://geohisttrivia.com/`; add `/apps/`. Google: after a move, submit the updated sitemap in GSC to speed discovery |
| Launch runbook (`.planning/phases/…`) | Markdown doc | Owner flip order on launch day | Flip order: Play Console privacy-URL field → Play Store link swap → Tier-1 rating row flip (per 10-RUNBOOK.md). Console-UI only; no secrets |
| JSON-LD `offers` refresh | In-page edit | Swap-ready schema for live listing | `"offers": {"@type": "Offer", "price": 0, "priceCurrency": "USD"}` — Google's doc (updated 2026-09-08): free app ⇒ `offers.price: 0`; `priceCurrency` is only required when price > 0, including `"USD"` is harmless and explicit |
| App Check evidence helper doc | Markdown doc | Counting submissions toward the 30-floor | Console-UI only; rides existing `.planning/` conventions |
| Workflow cleanup | YAML edit | Restore reproducible CI installs | `actions/setup-node@v7` gains `cache: npm`; `npm install` → `npm ci` |

### Redirect Mechanic Decision (the core research finding)

Google's redirect doc states the tier ordering explicitly, and it maps perfectly onto GitHub Pages:

| Google redirect tier | Mechanic | Available on GitHub Pages? | Verdict for v2.1 |
|---|---|---|---|
| Best: server-side 301/308 | Server config | No (except the platform's legacy-host 301) | n/a intra-domain |
| **Permanent tier: instant `meta refresh` (0 s)** | Static HTML | **Yes** | **Use this** for the `/geohist/` → `/` landing move |
| Last resort: JS `location` redirect | Static HTML | Yes | Use ONLY as a convenience layer on top of the meta tag; Google may never see JS redirects if rendering fails |
| —: 404.html-rooted JS router | Static HTML | Yes | **Reject**: Google's site-move doc warns many-old-URLs→one-URL patterns risk `soft 404` classification; JS-render dependent; wrong signal for a permanent move |

Key verbatim findings:

- "Google Search interprets instant `meta refresh` redirects as permanent redirects" / "delayed `meta refresh` redirects as temporary redirects." So the stub **must** use `content="0; url=…"` — any delay > 0 s downgrades the signal to temporary.
- "Permanent redirects don't cause a loss in PageRank" and the permanent redirect is "a signal that the redirect target should be canonical."
- "Avoid chaining redirects… ideally no more than 3" hops. Legacy-host visitors to the old landing traverse: platform 301 (path-preserved) → `/geohist/` stub (meta refresh 0) → `/`. Exactly 3 hops — at Google's advised limit, unavoidable given the platform 301, accepted residual.
- `meta http-equiv="refresh"` is standard HTML (WHATWG spec; MDN Baseline widely available since 2015), not deprecated. Keep the visible "Click here if you are not redirected" link (the jekyll-redirect-from stub pattern, hand-rolled since `.nojekyll` means the gem can't run).
- The old hub URL `/` gets **no stub — and needs none**: the root URL is *reused* by the landing, not deleted. There is nothing to redirect; Google relearns `/`'s new content from the updated sitemap + canonical. (This asymmetry — landing is a real URL *move* with a stub, hub is a *content handoff* of `/` — is why no 404-rooted or reverse-redirect gymnastics are needed.)

### GSC Change-of-Address Interaction (explicit doc answer)

The CoA doc's "When *not* to use this tool" section names this exact case:

- "Moving some pages from one location to another within your site: For example, from `example.com/oldpath/…` to `example.com/newpath/…`). In this case, just add redirects, and update your sitemaps as appropriate."
- Site-move doc: CoA is needed only "when moving from one domain or subdomain to another… You don't need it for… moving paths within the same domain."

**Verdict: the intra-domain root swap does NOT interact with the active 180-day CoA (old legacy domain → geohisttrivia.com).** The CoA maps *old-domain URLs → new-domain URLs*; path changes under the new domain are outside its mechanism. No CoA refiling, no cancel, window monitoring continues untouched (until ~2027-03). Post-migration GSC steps: resubmit the updated sitemap on the Domain property (same sitemap URL), optionally URL-Inspect `/` and `/apps/`. One honest caution from the CoA doc: combining a domain move with "a redesign of the site's content and URL structure" can cause temporary traffic fluctuation while Google relearns pages — at a 6-URL site this is noise, but sequence the work so the sitemap resubmit lands in the same deploy as the URL changes (one atomic commit, per repo convention).

### JSON-LD `offers` for Launch Day (swap-ready spec)

From the SoftwareApplication doc (updated 2026-09-08):

- `offers` is **required**; free app ⇒ `"price": 0` (Google's own example: `"offers": {"@type": "Offer", "price": 0}`).
- `priceCurrency` "only if the price is greater than 0" per Google — include `"USD"` anyway for explicitness.
- `name`, `operatingSystem` (`ANDROID`), `applicationCategory` (`GameApplication`) — already shipped, keep.
- `aggregateRating` stays **OFF** (permanent policy decision — review-snippet policy bars mirroring Play ratings; unchanged by launch).
- Optional strengthening (MEDIUM confidence, schema.org-side not Google-required): add `"url"` inside the Offer pointing at the live Play listing at flip time — it associates the offer with the store page. Keep this in the runbook's flip checklist, not pre-baked.
- Types: `SoftwareApplication`/`MobileApplication` both Google-supported (both shipped); `VideoGame` would need co-typing — not applicable.

Launch-kit "swap-ready" therefore = (a) placeholder Play-link inventory (grep-able markers for the badge `href`, JSON-LD, any og references), (b) the runbook flip order, (c) the offers block ready to edit. No build tooling, no templating engine, no new script needed.

### npm ci Restore (cleanup phase — mechanics verified)

From npm docs (npm 11) and actions/setup-node@v7 (verified same day):

- "The project **must** have an existing `package-lock.json` or `npm-shrinkwrap.json`" — satisfied (committed, v3, consistent).
- "If dependencies in the package lock do not match those in `package.json`, `npm ci` will exit with an error" — pre-checked consistent; `npm ci` will pass.
- `npm ci` deletes `node_modules` first and "never writes to `package.json` or any of the package-locks: installs are essentially frozen" — exactly the CI semantics wanted.
- setup-node: "Ensure that `package-lock.json` is always committed, use `npm ci` instead of `npm install`"; the `cache: npm` input "relies on the lockfile to generate a unique key for the cache entry." With the lockfile committed, `cache: npm` is safe and warms the global npm cache (reused across runs; not `node_modules`).
- Node 24 ships npm 11.x (npm docs list 11.19.1 as current for major 11); npm 11 fully supports `lockfileVersion: 3`. Local Node is 26.5.1 — both majors read lockfile v3, no regeneration needed.

Resulting workflow edit (validate job):

```yaml
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run validate
```

(Delete the stale "no package-lock.json exists yet" NOTE comment — the lockfile is tracked.)

## Installation

```bash
# No new packages — zero-dependency milestone. Verify locally:
npm ci              # Node ≥24 (ships npm 11); proves lockfile consistency
npm run validate    # existing gate chain must stay green
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Instant meta refresh stub for `/geohist/` → `/` | 404.html-rooted JS `location.replace` router | Never for this move: soft-404 risk + JS-render dependence; only for cosmetic bulk-routing of many junk URLs, not real moves |
| Instant meta refresh stub | Server-side 301 via reverse proxy / redirect service | Only if hosting left GitHub Pages; adds cost + infra, violates zero-build simplicity |
| Reuse root URL for landing (no hub stub) | Keep hub at `/` and duplicate landing at both `/` and `/geohist/` | Never: duplicate full landing content on two URLs forces Google to pick a canonical and risks splitting signals; the stub-move is strictly cleaner |
| `npm ci` + `cache: npm` | Keep `npm install`, no cache | Only if the lockfile were uncommitted (then caching must be disabled per setup-node docs) — not our state |
| Delayed meta refresh with visible notice page | — | Only for intentional temporary redirects (e.g. maintenance); never for permanent URL moves (Google reads it as temporary) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| jekyll-redirect-from gem / Jekyll layouts | `.nojekyll` + zero-build constraint; gem runs in a build step we don't have | Hand-rolled static stub with the same output (canonical + meta refresh 0 + fallback link) |
| 404.html JS router for the URL moves | Soft-404 classification risk (Google doc), render-failure signal loss | Per-URL meta-refresh stubs |
| Delayed meta refresh (`content="3; url=…"`) for the move | Google interprets >0 s as TEMPORARY — wrong signal for a permanent move | `content="0; url=…"` |
| Any SSG, bundler, framework, redirect middleware | Hard project constraint; page count (~8) gives SSGs zero payoff | Plain HTML files |
| New npm runtime/dev packages for any of the 4 features | Nothing here needs tooling; stubs and docs are hand-authored | Existing dev deps only |
| CoA refiling / cancel-and-refile for the root swap | Doc-excluded use case; would burn the active 180-day window | Redirects + sitemap update only |
| `aggregateRating` activation on launch day | Permanent policy exclusion (review-snippet policy) — flips stay Tier-1 row only | Owner flip of the hidden rating row per 10-RUNBOOK.md |
| hreflang alternates / per-language HTML dirs | Locked single-URL keyed-i18n decision | Existing 19-dictionary keyed engine |
| `en.json` dictionary | EN is the shipped markup baseline (locked) | Keyed markup as EN source of truth |

## Stack Patterns by Variant

**If future apps arrive (v2.2+):** each app gets `/apps/<slug>/` + optional root-card update; the `/apps/` hub card pattern established in v2.1 is the template. Future-app subdirs stay out of sitemap until content exists.

**If a launch-day flip is blocked mid-runbook:** flips are independent owner console/site edits (privacy-URL field is Play-side only; link swap is site-only; rating row is site-only) — any partial state is valid; document the done/not-done state in the runbook checklist, never half-flip markup.

**If more URLs move later:** same stub-per-URL pattern; keep chains ≤3 hops (legacy-host path adds 1 hop — count from the legacy host URL when auditing).

**If the lockfile ever drifts from `package.json`:** `npm ci` fails loudly (EUSAGE-style error) — that failure is the intended guard, not a bug; regenerate with `npm install` locally, review the diff, commit.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Node 24 (CI) | npm 11.x · lockfileVersion 3 | Verified: npm docs v11 line; lockfile is v3 and consistent |
| Node 26 (local dev) | npm 12 · lockfileVersion 3 | Both majors read lockfile v3; no regeneration |
| actions/setup-node@v7 | `cache: npm` + committed package-lock.json | Cache key derives from lockfile hash — lockfile must stay committed (it is) |
| actions/checkout@v7 ↔ deploy chain (configure-pages@v6, upload-pages-artifact@v5, deploy-pages@v5) | unchanged | No version bumps needed for v2.1 |
| html-validate 11.12.0 | new stub + `/apps/index.html` | ⚠️ Integration flag: `validate:html` glob is `index.html 404.html geohist/*.html` — add `apps/*.html` so the moved hub stays gated; confirm the stub passes html-validate (0 s refresh is valid HTML; if a rule objects, add a targeted exception, not a global one) |
| linkinator 8.1.0 | stub page | Stub's fallback link points at a same-site URL — will be crawled and must resolve; the existing `--skip` list needs no change |
| Firebase 12.18.0 CDN pin | unchanged | No new products; App Check/Analytics/Auth/Firestore untouched by v2.1 |
| GSC CoA 180-day window (until ~2027-03) | intra-domain restructure | No interaction (doc-verified); monitoring continues; old property retained |

## Sources

All fetched live 2026-09-11 (same-day verification; publication/update dates noted where stated):

- Google Search Console Help — Change of Address tool (support.google.com/webmasters/answer/9370220) — CoA domain-only scope, 180-day mechanics, intra-domain exclusion quote. **Primary/official.**
- Google Search Central — Site move with URL changes (developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes, doc updated 2026-08-20) — redirect strategy, sitemap submission, chain limits, soft-404 warning, "moving paths within the same domain" exclusion. **Primary/official, cross-checked with CoA doc.**
- Google Search Central — Redirects and Google Search (developers.google.com/search/docs/crawling-indexing/301-redirects) — instant vs delayed meta refresh, redirect tier table, JS-redirect last-resort caveat, PageRank neutrality. **Primary/official.**
- Google Search Central — Software App (SoftwareApplication) structured data (developers.google.com/search/docs/appearance/structured-data/software-app, doc updated 2026-09-08) — `offers.price: 0` for free apps, required/recommended properties, MobileApplication support. **Primary/official.**
- npm docs — npm ci (docs.npmjs.com/cli/v11/commands/npm-ci, v11.19.1) — lockfile requirement, frozen installs, mismatch error. **Primary/official.**
- actions/setup-node@v7 — advanced usage (raw.githubusercontent.com/actions/setup-node/main/docs/advanced-usage.md) — lockfile caching contract, `npm ci` recommendation, cache-disable-when-no-lockfile rule. **Primary/official, cross-checked with npm docs.**
- MDN — `<meta>` element (developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta, modified 2026-04-24) — `http-equiv="refresh"` standard/Baseline status. **Primary/official.**
- Repo verification runs (not web): `git ls-files package-lock.json` (tracked), programmatic lockfile↔package.json consistency check (`LOCKFILE CONSISTENT`), grep of all page asset paths (all site-absolute).

---
*Stack research for: v2.1 Play Launch + Home Migration (brownfield, zero-build)*
*Researched: 2026-09-11*
