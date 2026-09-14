# Architecture Research — v2.1 "Play Launch + Home Migration" Feature Integration

**Domain:** Static GitHub Pages site (geohisttrivia.com) — integration research for the home migration, launch kit, App Check evidence helper, and cleanup batch onto the shipped v2.0 architecture
**Researched:** 2026-09-11
**Confidence:** HIGH (every claim about existing structure read from live repo source; external SEO claims verified against official Google Search Central / Search Console docs)

**Scope note:** This is *not* greenfield research and it does not re-research v2.0 features (see superseded `.planning/research/ARCHITECTURE.md` from 2026-09-05 for the v2.0 integration mapping — this file replaces it at the same path per milestone convention). The v2.0 architecture is shipped and locked; this file maps **how the 4 v2.1 features bolt onto it**: integration points, new-vs-modified file list, data-flow changes, and a dependency-reasoned build order.

---

## Target State File Map (new vs modified)

```
index.html                      # MODIFIED-HEAVY: becomes the GeoHist landing
                                #   (former geohist/index.html body; canonical/og:url → /;
                                #    JSON-LD url → /; nav.game → /; #faq anchor → /#faq;
                                #    footer.back → /apps/)
apps/
  index.html                    # NEW: former root hub, verbatim markup, 13 hub.* keys
                                #   (canonical/og:url → /apps/; card CTA href → /)
geohist/
  index.html                    # MODIFIED-HEAVY: becomes self-contained meta-refresh-0
                                #   stub → / (zero keyed nodes, zero i18n.js, 404.html-style)
  guide.html                    # MODIFIED (href-only): footer.back → /apps/
  contact.html                  # MODIFIED (href-only): footer.back → /apps/
  changelog.html                # MODIFIED (href-only): footer.back → /apps/
  privacy.html                  # MODIFIED (href-only): footer.back → /apps/
  (assets, screenshots, icon,
   og-image, badge)              # UNTOUCHED — all paths preserved
404.html                        # MODIFIED (href-only): back-to-hub → /apps/ (text unchanged)
sitemap.xml                     # MODIFIED: /geohist/ entry → /apps/; root / = landing
robots.txt                      # UNTOUCHED
css/base.css                    # UNTOUCHED
js/i18n.js                      # UNTOUCHED — engine is page-agnostic
js/i18n/*.json  (×19)           # UNTOUCHED — 178-key surface preserved exactly
js/consent.js                   # UNTOUCHED
js/contact.js                   # UNTOUCHED
js/firebase-config.js           # UNTOUCHED
scripts/i18n-keycheck.mjs       # MODIFIED: pages[] + star-check path (geohist/index.html → index.html)
scripts/i18n-surface.mjs        # MODIFIED: pages[] mirrors keycheck
scripts/a11y-audit.mjs          # MODIFIED: PAGES[] root↔/apps/ swap, /geohist/ → /apps/
scripts/smoke-check.sh          # MODIFIED: + /apps/ 200 check; /geohist/ stays 200 (stub)
scripts/check-no-old-domain.mjs # UNTOUCHED (gate unchanged; nothing new trips it)
scripts/i18n-detect.test.mjs    # UNTOUCHED (pure engine tests)
package.json                    # MODIFIED: validate:html glob + apps/index.html
.github/workflows/deploy.yml    # MODIFIED (cleanup item only): npm ci + cache: npm
.planning/phases/10-*/10-RUNBOOK.md   # MODIFIED (docs): supersession note — star/0.0 edits
                                      #   now live in root index.html
.planning/<v2.1 phase dirs>/    # NEW (docs): launch runbook, swap-ready inventory,
                                #   App Check evidence helper (console-UI only)
```

**The single most important structural fact:** after the migration, **every Play-launch surface concentrates in ONE file** (root `index.html`). That is what makes the launch kit cheap.

---

## Integration Point Analysis (per question)

### (a) Moving the landing to root — safest mechanism

**Mechanism: ONE atomic commit containing both page moves.** Not "both pages serve the landing", not "stub only". The exact target state:

| URL | Serves | Keyed? |
|-----|--------|--------|
| `/` (index.html) | Full GeoHist landing (hero, proof strip, OFF rating row, features, gallery, FAQ, about) | Yes — 70 `geohist.*` keys unchanged |
| `/apps/` (apps/index.html) | Portfolio hub (brand intro + 1 app card) | Yes — 13 `hub.*` keys unchanged |
| `/geohist/` (geohist/index.html) | Meta-refresh-0 stub → `/` | **No** — zero keyed nodes |
| `/geohist/guide.html` etc. | Unchanged | Yes (own namespaces) |

Why one commit, mechanically: `scripts/i18n-keycheck.mjs` asserts **exact set equality** between the union of keys across its `pages` list and every dictionary (178 keys). `hub.*` keys exist *only* in root `index.html` today. If the hub moves to `/apps/` in a commit that doesn't also deliver the landing to root, the surface drops to 165 and all 19 dictionaries fail the gate (13 extra keys). Both moves + the script `pages[]` updates must land together. This matches the Phase-8 precedent ("one-commit migration; one revert = rollback").

Why a meta-refresh stub for `/geohist/` (no HTTP 301 possible): GitHub Pages serves static files only — no redirect config. Google's "Redirects and Google Search" doc classifies **`meta refresh` (0 seconds) as a permanent-redirect method** (grouped with 301/308), with JS redirects as the last fallback. Server-side redirects are unavailable here, so meta-refresh-0 is the documented-resort correct choice. Stub shape (mirrors the self-contained `404.html` pattern; zero globals, no i18n):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>GeoHist Trivia has moved</title>
  <link rel="canonical" href="https://geohisttrivia.com/">
  <meta http-equiv="refresh" content="0; url=/">
</head>
<body>
  <p>This page has moved. <a href="/">Continue to GeoHist Trivia</a>.</p>
</body>
</html>
```

- `noindex, follow` on the stub: prevents the stub URL from competing in the index; `follow` keeps any residual equity flowing via the anchor. The canonical line is belt-and-suspenders for clients that don't honor meta refresh.
- The plain `<a>` fallback keeps the page no-JS-safe and gives linkinator something to validate (200).
- html-validate must pass on it — it enters the `geohist/*.html` glob automatically; the `<title>` and full head satisfy the recommended ruleset.

**The i18n namespace question — resolved by the engine's design (zero dictionary edits):**

- `js/i18n.js` is page-agnostic: it snapshot-walks whatever `[data-i18n]`/`[data-i18n-attr]` nodes the page has and fetches **one flat per-language dictionary** from `/js/i18n/<lang>.json`. There is no page→namespace binding anywhere in the engine (verified: `captureSnapshot`/`applyLanguage` have no path awareness; `DICT_URL_PREFIX` is global).
- Key namespaces (`hub.*`, `geohist.*`, …) are **section-role conventions, not URL-bound**. The hub page moving to `/apps/` does not move `hub.*`; the landing moving to `/` does not move `geohist.*`.
- Therefore the 178-key surface is **preserved exactly** by moving markup verbatim: 70 (`geohist.*`) + 13 (`hub.*`) + 40 (`guide.*`) + 33 (`contact.*`) + 18 (`changelog.*`) + 4 shared (`consent.*`) = 178. **Zero dictionary edits across all 19 files.** The atomic key-surface unit (page + dictionaries + keycheck registration) never separates because the dictionaries never change.
- Minor href-only edits are key-adjacent but key-safe: `geohist.footer.back` ("Back to hub") keeps its text/value and only repoints `href="/"` → `href="/apps/"`. An EN-text mismatch across pages would trip `i18n-surface.mjs` warnings — none occur because the text doesn't change.
- Optional nav additions (e.g. a new `geohist.nav.apps` "Apps" link on the landing): **defer** — any new key is a 19-dictionary atomic edit and the footer link already provides the path. Ship the migration with a frozen 178-key surface; treat key additions as their own separately-gated commit if ever wanted.

**Script-side atomic registration (both scripts hard-code the page list):**

- `scripts/i18n-keycheck.mjs` line 48 and `scripts/i18n-surface.mjs` line 32:
  `['index.html', 'apps/index.html', 'geohist/index.html', 'geohist/guide.html', 'geohist/contact.html', 'geohist/changelog.html']` — keeping the stub in the list is harmless (extracts 0 keys) and documents its existence; dropping it also works.
- `i18n-keycheck.mjs` star-uniqueness check (line 184) reads `geohist/index.html` as "the landing" — must repoint to root `index.html` (the row ships there now). This is a **gate change → red-gate proof both directions** per repo convention (mutate: remove the star SVG from root index → gate must FAIL; restore hash-verified → PASS; also prove the flip-compat direction: owner's `hidden`-removal + score edit never touches the SVG → still PASS).

### (b) What the `/apps/` hub page needs

- **Keyed: YES.** Reuses **all 13 `hub.*` keys verbatim** (`hub.meta.title`, `hub.meta.desc`, `hub.brand`, `hub.intro.1/.2`, `hub.card.icon-alt/name/desc/cta`, `hub.footer.privacy/contact/consent/copyright`). Zero text changes → zero dictionary edits. The unkeyed alternative is rejected: it would drop the surface to 165 and force a ×19-dictionary rewrite plus losing the switcher on that page.
- **Kept as-is:** consent banner block (`consent.*` shared keys, `.consent-reopen` hook — consent.js is page-agnostic), footer structure, `lang-switcher-slot`, script/stylesheet loads (all absolute `/js/…`, `/css/…` — path-independent), OG/Twitter image (stays `https://geohisttrivia.com/geohist/og-image.png` — asset stays put), icons.
- **Changed:** `canonical` + `og:url` → `https://geohisttrivia.com/apps/`; app-card CTA `hub.card.cta` href `/geohist/` → `/`.
- **Cross-links (href-only, no key changes):** every `Back to hub` footer link repoints `/` → `/apps/` on `guide.html`, `contact.html`, `changelog.html`, `privacy.html`, and the new root landing (`geohist.footer.back` → `/apps/`). Play Console's privacy field target `/geohist/privacy.html` is **path-stable — the migration does not touch it**.
- **No visible placeholders:** `/apps/` ships exactly one real app card (current state). Future apps = future subdirs; do not add empty cards or "coming soon" teases (the anti-feature list treats placeholder reviews/teasers as structured-spam-adjacent).

### (c) 404.html, smoke-check.sh, validate:links changes

| Surface | Change | Why |
|---------|--------|-----|
| `404.html` | `href="/"` → `href="/apps/"`; **visible text stays "Back to the hub"** | smoke-check greps the served 404 body for "back to the hub" (case-insensitive); unkeyed page → no dict impact |
| `smoke-check.sh` | Add `$BASE/apps/` to the 200 list; `$BASE/` (now landing) and `$BASE/geohist/` (now stub) **already return 200** so their expectations survive unchanged; optionally add a stub-content check (`grep -qi "has moved"` on `/geohist/`) | manual post-deploy script, not in CI chain |
| `validate:links` (linkinator) | **No change** | `--skip` set (apex host, play.google.com, policies.google.com, planning, node_modules) still correct; `/apps/` is a real local dir that gets crawled; the stub is a 200 page whose `<a href="/">` fallback validates; linkinator does not follow meta refresh, which is fine |
| `validate:html` | Glob → `index.html 404.html geohist/*.html apps/index.html` | new keyed page must be linted |
| `scripts/a11y-audit.mjs` | `PAGES` → `{url:'/', slug:'root'}` (now the landing), `{url:'/apps/', slug:'apps'}` replaces `{url:'/geohist/'...}`; drop the stub (nothing to audit) | axe/Lighthouse targets track the real page set |

`scripts/check-no-old-domain.mjs` needs **nothing**: the migration introduces no legacy-host literals, and the walk covers new files automatically. `scripts/i18n-detect.test.mjs` needs nothing (pure engine tests, no paths).

### (d) Launch-kit flags/placeholders in code — the flip surface

Post-migration inventory of every Play-related surface (all in root `index.html` unless noted):

| # | Surface | Current state | Launch-day action |
|---|---------|---------------|-------------------|
| 1 | `.badge-cta` href | `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` (real package URL, live-404s until listing) | **None** — verify + re-run smoke-check; `linkinator --skip play.google.com` keeps CI green pre-launch |
| 2 | Tier-1 row anchor href (inside `<div class="proof-row" hidden>`) | Same real URL | None |
| 3 | JSON-LD `"sameAs"` | Same real URL | None |
| 4 | JSON-LD `"offers"` `{price:"0", priceCurrency:"USD"}` | Correct for free-with-IAP | **Refresh check only** (confirm 0/USD still true) — documented check, not an edit |
| 5 | Badge `img alt` | Keyed `geohist.cta.badge-alt` (already "Get … on Google Play") | None |
| 6 | Tier-1 rating row | `<div class="proof-row" hidden>` + `0.0` self-flagging span + exactly ONE `proof-row-star` SVG | **2-edit flip** (remove `hidden`, replace `0.0` with real score) per 10-RUNBOOK §2 — now referencing **root `index.html`** (supersession note in the runbook) |
| 7 | Play Console privacy-URL field | Owner console field → `/geohist/privacy.html` | Path-stable; settable pre- or post-migration (order-independence — see build order) |
| 8 | Tier-2 `aggregateRating` | Inert comment, permanently OFF | **Never** (policy) |

**"Swap-ready" = surfaces 1–5 are already final-valued; the only launch-day code edit is the gated Tier-1 flip (2 edits, one file).** The launch kit deliverables are: owner runbook (flip order + console steps), swap-ready inventory doc (the table above, in the phase's `.planning/` dir — publicly served, console-UI instructions only), and a JSON-LD offers refresh check step.

### (e) Sitemap + canonical updates required by the root swap

- `sitemap.xml` (6 entries, no-lastmod convention preserved): replace `<loc>…/geohist/</loc>` with `<loc>…/apps/</loc>`; root `/` entry now represents the landing. Final set: `/`, `/apps/`, `/geohist/guide.html`, `/geohist/changelog.html`, `/geohist/contact.html`, `/geohist/privacy.html`. **Do not list the stub** — sitemaps list canonical URLs only.
- Canonicals: root `index.html` → `https://geohisttrivia.com/`; `apps/index.html` → `https://geohisttrivia.com/apps/`; the four sub-pages **unchanged** (verified all 6 pages carry exactly one canonical + one og:url today).
- JSON-LD `"url"` on the landing → `https://geohisttrivia.com/` (its `image`/`screenshot` absolute URLs are unchanged).
- `robots.txt`: unchanged (Sitemap line is path-independent).
- GSC (owner console, post-deploy): **resubmit the sitemap** (same URL) on the existing Domain property; URL-Inspect `/`. No property changes.

### (f) GSC Change-of-Address interaction — the constraint question

**Answer: the active 180-day CoA does NOT constrain when the root swap ships.** Verified against the official Change of Address doc:

- CoA is a **domain-level** tool (persano.github.io → geohisttrivia.com, filed ~2026-09, window to ~2027-03). Its "when NOT to use" list explicitly covers this case: *"Moving some pages from one location to another within your site (example.com/oldpath/… to example.com/newpath/…) — just add redirects, and update your sitemaps."* The home migration is exactly that case.
- No chaining risk: an internal restructure is not a site move and neither cancels nor re-files CoA. The CoA signal-forwarding runs to its ~2027-03 end undisturbed.
- Real constraints that DO apply (all standing practice, none timing-bound):
  1. Legacy `*.github.io` host 301s stay live permanently (already true — gate-enforced architecture).
  2. The `/geohist/` → `/` stub stays live long-term: Google's guidance is keep redirects **≥180 days, ideally ≥1 year**; here it costs nothing, keep it indefinitely.
  3. Resubmit the updated sitemap after deploy (Sitemaps report on the Domain property; old-URL rows showing "redirecting" warnings are expected/normal per Google).
  4. Monitor both the CoA window and the internal move in the same Sitemaps/Index reports; the retained old property remains the decay surface.
- Timing recommendation (not constraint): ship the migration **before Play launch day** so reviewers and Play-driven visitors see the apex root landing, and so the Play privacy field points at a URL that will never move.

---

## Data Flow Changes (summary)

### i18n apply flow — UNCHANGED
`page load → i18n.js snapshot → resolve lang → fetch /js/i18n/<lang>.json → swap`. Same engine, same 19 dictionaries, same 178 keys, same silent-degrade policy. The only observable differences are `location.pathname` values: GA4 `play_badge_click {page}` now reports `/` instead of `/geohist/` (consent.js passes `location.pathname` — no code change; note it in the launch runbook so the dashboard isn't misread) and the dictionary fetch path is unchanged (`/js/i18n/` absolute).

### Deploy flow — unchanged shape, one cleanup edit
`push → validate (html → domain → links → i18n-detect → i18n) → Pages deploy`. Cleanup batch restores `npm ci` + `cache: npm` in the validate job — safe now that `package-lock.json` is committed (verified present in working tree at HEAD `f6259f9`).

### Submit flow — UNTOUCHED
`contact.js` probe → App Check → auth → Firestore. No path dependency on page location; the form lives at `/geohist/contact.html` before and after.

## Recommended Build Order (dependency-reasoned)

1. **Migration — ONE atomic commit** (everything in the Target State File Map marked MODIFIED-HEAVY/MODIFIED): pages + stub + href repoints + canonical/og:url/JSON-LD url + sitemap + both `pages[]` scripts + star-path + a11y `PAGES` + `validate:html` glob + smoke-check + 404. Includes **red-gate proofs** for the two gate changes (keycheck page-list/star-path; validate glob) and the full local validate chain green before push.
2. **Post-deploy owner console steps** (GSC): sitemap resubmit + URL Inspection of `/` and `/apps/` + smoke-check run. No CoA action.
3. **Launch kit** (docs, depends on 1): owner runbook (flip order: privacy-URL field → verify Play link live → Tier-1 flip) + swap-ready inventory (table above) + 10-RUNBOOK supersession note. Doc-only; `.planning/` public-serving rules apply.
4. **App Check evidence helper** (docs, zero deps — can run parallel to 1): console-UI-only submission-counting doc + weekly ritual.
5. **Cleanup batch** (CI edit + verification tasks, independent): `npm ci` + `cache: npm` in deploy.yml (red-gate: prove validate still green on CI); zh variant confirmation; Urdu Nastaliq real-device check.

Steps 3–5 have no interdependency; 3 must follow 1 (file paths); 4 and 5 are free-floating.

## Anti-Patterns (specific to this migration)

1. **Splitting the two page moves across commits** — keycheck set-equality reds at 165≠178; canonicals half-migrated. One commit.
2. **Serving the landing at both `/` and `/geohist/`** with a canonical band-aid — duplicates the exact duplicate-URL class canonicalization exists to fix; the stub is strictly better.
3. **Renaming `hub.*`/`geohist.*` keys to match new URLs** — namespaces are role conventions; renaming = ×19-dictionary churn for zero benefit.
4. **JS-only redirect on the stub** — violates no-JS safety; meta-refresh + `<a>` fallback is the pattern.
5. **Deleting or emptying `geohist/`** — sub-pages, screenshots, og-image, icon, badge live there; the dir stays, only `index.html` swaps body.
6. **Re-filing or canceling CoA for the internal move** — out of tool scope; would restart the 180-day clock for nothing.
7. **Adding keys during migration** — any key change is a 19-dictionary atomic commit; mixing it with the move couples two risk classes. Frozen 178.
8. **Updating the hub/landing without updating the three hard-coded page lists** — `i18n-keycheck.mjs`, `i18n-surface.mjs`, `a11y-audit.mjs` each silently audit the wrong pages (the first two fail loudly only if key counts drift; the last one just audits stale URLs).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Search Console | Owner console: sitemap resubmit + URL inspection on the existing Domain property | CoA untouched; internal moves out of CoA scope (official doc) |
| Google Play Console | Owner console: privacy-URL field → `/geohist/privacy.html` (path-stable) | Listing URL already baked into hrefs; launch day = verify |
| GitHub Pages | Static host: no server redirects; legacy-host 301 permanent; meta-refresh-0 is the in-site redirect primitive | Google classifies meta refresh 0s as permanent-redirect class |
| Firebase | Unchanged (Analytics load-gated, contact submit path, App Check) | GA4 `page` dimension value changes `/geohist/` → `/` for badge clicks — reporting note only |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| i18n engine ↔ page markup | `[data-i18n]` snapshot walk | Page-location agnostic — why zero engine edits |
| keycheck/surface ↔ markup | Hard-coded `pages[]` array | The one place page moves must be registered |
| consent.js ↔ any page | Class hooks (`.consent-reopen`, `.badge-cta`, `.consent-banner`) | Follows pages automatically |
| old-domain gate ↔ whole repo | Path-walk + allowlist | Unaffected by migration |

## Scaling Considerations

| Scale | Adjustment |
|-------|------------|
| 1 app (today) | `/` = app 1 landing; `/apps/` = 1-card hub |
| 2–3 apps | Each app gets `/apps/<name>/`? — **No: keep the established pattern** — app sites get their own top-level subdirs (`/<app>/`) like `/geohist/`, hub card links out; each new card = new `hub.card.*` keys ×19 in one atomic commit |
| Many apps | Sitemap grows linearly; keycheck/surface page lists grow per page (consider a shared `PAGES` module only past ~10 pages — not now) |

## Sources

- Repo source (read 2026-09-11, HIGH): `index.html`, `geohist/index.html`, `js/i18n.js`, `js/i18n/es.json` (ns counts 13/70/40/33/18/4), `scripts/i18n-keycheck.mjs`, `scripts/i18n-surface.mjs`, `scripts/a11y-audit.mjs`, `scripts/smoke-check.sh`, `scripts/check-no-old-domain.mjs`, `package.json`, `.github/workflows/deploy.yml`, `sitemap.xml`, `robots.txt`, `404.html`, `.planning/PROJECT.md`
- Google Search Central — "Redirects and Google Search" (meta refresh 0s = permanent-redirect class; JS redirects last resort), developers.google.com/search/docs/crawling-indexing/301-redirects — HIGH
- Google Search Central — "Site moves with URL changes" (redirect strategy, keep ≥1 year, canonical/sitemap updates, resubmit sitemap, redirect warnings normal), developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes — HIGH
- Google Search Console Help — "Change of Address tool" (internal path moves: don't use tool; 180-day window mechanics; cancel rules; no chaining), support.google.com/webmasters/answer/9370220 — HIGH
- `.planning/research/ARCHITECTURE.md` (v2.0, 2026-09-05) — superseded by this file; its per-feature v2.0 integration detail remains the historical record

---
*Architecture research for: Persano v2.1 Play Launch + Home Migration*
*Researched: 2026-09-11*
