# Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit - Context

**Gathered:** 2026-09-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 makes the site discoverable, rich-result ready, and accessible, and fills the gallery with real screenshots:

- **LNDG-03:** Screenshot gallery with 3–6 real screenshots captured via ADB (WebP, lazy-load)
- **SEO-01:** Meta titles/descriptions + canonical URLs on every page
- **SEO-02:** Open Graph + Twitter cards, absolute URLs, 1200×630 og:image
- **SEO-03:** sitemap.xml + robots.txt (allow-all + sitemap line), submitted to Search Console
- **SEO-04:** SoftwareApplication JSON-LD (GameApplication, ANDROID, offers price 0), NO aggregateRating
- **A11Y-01:** WCAG 2.1 AA audit as explicit gate before Play submission

Also closes two Phase-01 traces (superseded root policy file deletion, Play Console privacy-URL field update) — both bundled into one end-of-phase owner checkpoint. The AA audit passing is the phase's exit gate.

</domain>

<decisions>
## Implementation Decisions

### Screenshot capture
- **D-52:** 4 screenshots, one per feature group: main menu, map/city mode, flags mode, timeline mode. Matches the 4 feature groups already on the landing page.
- **D-53:** Capture flow: user plugs in phone + navigates to each screen; agent drives ADB live (`adb exec-out screencap -p > file.png`) per shot; user approves each capture before moving on. No file-handoff folder.
- **D-54:** PNG→WebP conversion via `sharp` as a devDependency + `scripts/make-webp.mjs` — matches the existing devDeps-only pattern (html-validate, linkinator), cross-platform, no PATH hunting.
- **D-55:** Per-tile keyed caption naming the mode (new keys in `js/i18n/es.json` + `pt-BR.json`, gate-checked by `scripts/i18n-keycheck.mjs`), descriptive EN alt per shot, keep existing `.gallery-tile` CSS, add `width`/`height` + `loading="lazy"` on images.
- **D-56:** Gallery placeholder tiles (SVG + "Screenshots coming soon" captions, geohist/index.html:66-93) are replaced — placeholder SVGs, placeholder aria-labels, and the "coming soon" caption copy go away.

### OG image
- **D-57:** og-image created by an agent-written script (`scripts/og-image.mjs`, sharp): `geohist/icon.png` composed onto a 1200×630 antique-background canvas (#1a1410 base, parchment/gold accents from `css/base.css` tokens). Regenerable in-repo, no design tool.
- **D-58:** Composition: big "GeoHist Trivia" display name + short EN tagline + icon. Text is baked-in pixels — EN only (no i18n possible for images).
- **D-59:** One site-wide `og-image.png` at `/geohist/og-image.png`, referenced by all pages with absolute URLs. No per-section variants.

### JSON-LD
- **D-60:** GameApplication JSON-LD block on `/geohist/` landing only. Hub stays clean (no WebSite/Person schema).
- **D-61:** Field set: `@type` GameApplication, name, operatingSystem ANDROID, applicationCategory GAME, offers price 0 USD, description, url, image, screenshot, author "Santiago David Postorivo", sameAs → `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia`. NO aggregateRating (banned until real Play ratings exist — v2 SEO-05).
- **D-62:** Static EN `<script type="application/ld+json">`; description value mirrors the EN meta description already in the `/geohist/` head — single source. Not i18n-keyed (crawlers only see EN).

### Sitemap + robots
- **D-63:** sitemap.xml lists 5 content URLs: `/`, `/geohist/`, `/geohist/guide.html`, `/geohist/contact.html`, `/geohist/privacy.html`. 404, Search Console verification file, and app-ads.txt excluded.
- **D-64:** No `<lastmod>` — static Pages site, git-date generation adds a script that must re-run on every change for zero SEO gain.
- **D-65:** Search Console sitemap submission is an owner step inside the plan's final task (see D-69) — not ad hoc.
- robots.txt content is pinned by SEO-03: allow-all + `Sitemap:` line, nothing else. No decision needed.

### Meta / canonical / OG tags
- **D-66:** 5 content pages get full title + description + canonical + OG + Twitter set. 404.html gets `<meta name="robots" content="noindex">` + keeps its title; no canonical/OG on an error page.
- **D-67:** og:title/og:description/twitter:* are static EN — Facebook/X/WhatsApp scrapers don't execute JS, so keyed values would be empty/EN-default at scrape time. Visible page copy stays i18n-keyed as shipped (I18N-04 unchanged). twitter:card = summary_large_image (pinned by STACK.md).
- **D-68:** Canonicals use clean directory form for section roots (`https://persano.github.io/geohist/`, not `/geohist/index.html`); `og:url` mirrors canonical; all canonical/og:url absolute against `https://persano.github.io`.

### Phase-5 trace cleanup
- **D-69:** Owner console steps bundled as ONE end-of-phase checkpoint in the final plan's final task: (1) Play Console privacy-URL field → `https://persano.github.io/geohist/privacy.html`, (2) Search Console sitemap submission. Order matters.
- **D-70:** Superseded root policy file `GeoHist_Trivia_Privacy_Policy.html` is deleted only AFTER the owner confirms the Play Console field update (D-69) — deletion lands in the final deploy of the phase. Unconditional deletion would 404 the URL Play reviewers may still reference. — **Reversibility:** reversible — file is in git history and can be restored, but deletion before the console field flips breaks the Play-reviewer URL contract, hence the ordering gate.

### the agent's Discretion
- Screenshot file naming, exact WebP quality/weight settings, and tile layout tweaks
- Per-page title/description EN wording (subject to i18n key pattern + keycheck gate)
- OG script typography specifics (system display font stack, sizes)
- axe/Lighthouse CLI invocation details (npx vs devDeps) and report format under `reports/`
- How the a11y audit battery script is structured (single script vs per-page runs)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning artifacts
- `.planning/ROADMAP.md` §Phase 5 — goal, success criteria, manual prerequisites checklist (item 5: Search Console sitemap submission)
- `.planning/REQUIREMENTS.md` — LNDG-03, SEO-01..04, A11Y-01 definitions; v2/out-of-scope (aggregateRating ban, no subdirs)
- `.planning/PROJECT.md` — constraints, stack summary, Key Decisions
- `.planning/research/STACK.md` — SEO tooling decisions (SoftwareApplication field list, sitemap/hreflang guidance, Twitter summary_large_image), deployment chain pins

### State/traces
- `.planning/STATE.md` §Blockers/Concerns — Play Console privacy-URL trace + superseded-file deletion trace (closed by D-69/D-70 this phase)
- `.planning/STATE.md` §Accumulated Context — palette contrast pairs math-proven (Phase 02), keyed-node text-only rule, honest close-out contract for owner batteries

### Site source (integration targets)
- `geohist/index.html` — gallery skeleton to replace (lines 66–93), head to extend with canonical/OG/JSON-LD
- `css/base.css` — design tokens for og-image composition (#1a1410, #f0e6d2, #d9a951, Georgia display)
- `scripts/i18n-keycheck.mjs` + `js/i18n/es.json` / `js/i18n/pt-BR.json` — caption keys must pass the 1:1 parity gate
- `package.json` — validate chain where new gates (a11y battery) may slot

No external specs/ADRs exist — decisions above are the binding record.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Gallery skeleton: 3 `.gallery-tile` `<li role="img">` placeholders with keyed captions/aria (geohist/index.html:66-93) — structure kept, SVGs swapped for `<img>` tiles
- i18n engine + 102-key dicts + `data-i18n-attr` pattern — new captions/alts slot straight in; keycheck gate enforces parity
- CI validate chain (`html-validate` + `linkinator` + `i18n-keycheck`) — a11y battery can follow the same npm-script pattern
- `geohist/icon.png` (512²) and `google-play-badge.png` — og-image composition source
- Search Console verification file `google7da873f4e9609872.html` already in repo — GSC property ready for sitemap submission
- DevDeps pattern: html-validate 11.12.0, linkinator 8.1.0 — sharp joins as the third

### Established Patterns
- EN ships in raw HTML; all user-visible strings keyed; textContent-only keyed nodes — new caption keys follow this
- Design-time contrast math already proven for all 8 palette pairs (Phase 02) — AA audit verifies, does not redesign palette
- Deploy = single push to main → validate → Pages; orchestrator-owned controlled push
- Honest close-out contract (Phase 4): owner-executed batteries recorded PENDING until owner runs them — applies to the manual AA battery

### Integration Points
- `<head>` of all 6 pages: canonical/OG/Twitter/JSON-LD/noindex additions land here (zero today)
- Root of repo: new `sitemap.xml` + `robots.txt`
- `geohist/` dir: new screenshot WebP files + `og-image.png`
- `scripts/`: new `make-webp.mjs`, `og-image.mjs`, a11y audit battery
- Play badge href already final (`com.persano.geohisttrivia`) — sameAs and Play Console field use the same package URL

</code_context>

<specifics>
## Specific Ideas

- OG image visual: antique background from base.css tokens, big Georgia-style display type — must read as the same brand as the site (user picked the theme-derived composition over a design-tool export)
- Owner console steps (Play field + GSC submit) deliberately bundled into one checkpoint to minimize interruptions
- Pass thresholds chosen pragmatically: Lighthouse a11y ≥95 + zero critical/serious axe violations — strict enough to gate, without chasing cosmetic minors

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (aggregateRating/SEO-05, App Check, custom domain, changelog page remain in v2 per REQUIREMENTS.md.)

</deferred>

---

*Phase: 5-Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit*
*Context gathered: 2026-09-03*
