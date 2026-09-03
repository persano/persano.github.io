# Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-03
**Phase:** 5-Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit
**Areas discussed:** Screenshot capture, OG image (1200×630), JSON-LD scope, Sitemap+robots details, Meta/canonical per page, Trace items cleanup

---

## Screenshot capture

| Option | Description | Selected |
|--------|-------------|----------|
| 4 — feature-per-shot | Main menu, map/city, flags, timeline — covers all 4 feature groups | ✓ |
| 3 — minimum | Map, flags, timeline only — faster capture | |
| 6 — full coverage | Adds Play Games + IAP screens — fullest gallery | |

| Option | Description | Selected |
|--------|-------------|----------|
| Agent drives ADB live | User plugs in phone + navigates; agent runs adb exec-out screencap per shot, user approves each | ✓ |
| You capture, agent converts | User captures PNGs, drops in folder; agent converts + wires markup | |

| Option | Description | Selected |
|--------|-------------|----------|
| sharp devDep script | scripts/make-webp.mjs + sharp devDependency — cross-platform, matches devDeps pattern | ✓ |
| cwebp binary | Google libwebp CLI — best compression, manual Windows install | |
| ImageMagick local | Zero new deps if installed — not reproducible elsewhere | |

| Option | Description | Selected |
|--------|-------------|----------|
| Keyed captions + alt | One keyed caption per tile (es/pt-BR too), descriptive EN alt, tile CSS + width/height + lazy | ✓ |
| Alt only, no captions | Less i18n churn, gallery loses narration | |
| EN captions, skip i18n | Breaks site i18n convention | |

**User's choice:** All recommended options.
**Notes:** Placeholders (SVGs + "coming soon" captions) get fully replaced.

---

## OG image (1200×630)

| Option | Description | Selected |
|--------|-------------|----------|
| Agent script with sharp | scripts/og-image.mjs: icon + display type on antique bg (#1a1410/parchment/gold), regenerable in repo | ✓ |
| You make it in design tool | Canva/Figma/Photoshop, manual redo on rebrand | |

| Option | Description | Selected |
|--------|-------------|----------|
| Name + tagline + icon | Big 'GeoHist Trivia' + short EN tagline + icon — classic install-card look | ✓ |
| Name + icon only | Cleaner but blander | |
| Full CTA treatment | + 'Get it on Google Play' — busiest | |

| Option | Description | Selected |
|--------|-------------|----------|
| One site-wide image | /geohist/og-image.png referenced by all 6 pages, absolute URLs | ✓ |
| Two variants | Separate hub variant without GeoHist branding | |

**User's choice:** All recommended options.
**Notes:** Text baked-in pixels, EN only.

---

## JSON-LD scope

| Option | Description | Selected |
|--------|-------------|----------|
| Geohist landing only | GameApplication on /geohist/; hub stays clean | ✓ |
| + WebSite on hub | Identity signal on hub | |
| + WebSite + Person | Full graph, more maintenance | |

| Option | Description | Selected |
|--------|-------------|----------|
| Full set + sameAs | name, ANDROID, GAME, offers 0 USD, desc, url, image, screenshot, author, sameAs → Play URL | ✓ |
| Minimum required fields | Leanest, fewer drift fields | |
| + rating stub (banned) | aggregateRating — rejected by requirements | |

| Option | Description | Selected |
|--------|-------------|----------|
| Static EN, desc=meta | Description mirrors EN meta description — single source | ✓ |
| i18n-keyed | Re-serializes on switch; crawlers see EN anyway | |
| Static EN, separate copy | Two sources of truth, drift risk | |

**User's choice:** All recommended options.

---

## Sitemap+robots details

| Option | Description | Selected |
|--------|-------------|----------|
| 5 content URLs | /, /geohist/, guide, contact, privacy — 404 + verification file + app-ads.txt excluded | ✓ |
| Everything crawlable | Non-content noise | |
| 4 URLs, no hub | Drops brand entry point | |

| Option | Description | Selected |
|--------|-------------|----------|
| Omit lastmod | Static Pages site, no generator script | ✓ |
| Generated lastmod | Git-date script re-run on every change | |

| Option | Description | Selected |
|--------|-------------|----------|
| Owner step in plan | Deploy lands → owner submits sitemap in GSC → phase verify includes it | ✓ |
| Post-phase, ad hoc | Risks never happening | |

**User's choice:** All recommended options.
**Notes:** robots.txt content pinned by SEO-03 (allow-all + sitemap line) — no question asked.

---

## Meta/canonical per page

| Option | Description | Selected |
|--------|-------------|----------|
| 5 full + 404 noindex | 5 content pages full set; 404 gets noindex + keeps title | ✓ |
| All 6 full treatment | Literal 'every page' | |
| 5 full + 404 untouched | 404 stays indexable | |

| Option | Description | Selected |
|--------|-------------|----------|
| Static EN for OG/Twitter | Scrapers don't execute JS — keyed values empty at scrape time; visible copy stays keyed | ✓ |
| Keyed like meta | False sense of translation | |
| Unkey everything | Inconsistent with shipped I18N-04 | |

| Option | Description | Selected |
|--------|-------------|----------|
| Clean dir form | /geohist/ canonicals, og:url mirrors, absolute | ✓ |
| File form | /geohist/index.html — ugly, diverges from nav links | |

**User's choice:** All recommended options.
**Notes:** twitter:card summary_large_image pinned by STACK.md — not asked.

---

## Trace items cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Console update, then delete | Owner flips Play Console field → agent deletes old policy file in final deploy | ✓ |
| Delete unconditionally | Risks 404 for Play reviewers during submission window | |
| Keep until Play live | Drags trace past milestone | |

| Option | Description | Selected |
|--------|-------------|----------|
| Bundle both | Play field update + GSC sitemap submit = one end-of-phase owner checkpoint | ✓ |
| Separate steps | More interruption points | |

**User's choice:** Both recommended options.
**Notes:** Order matters — console field first, deletion second.

---

## the agent's Discretion

- Screenshot file naming, WebP quality settings, tile layout tweaks
- Per-page title/description EN wording (i18n key pattern + keycheck gate apply)
- OG script typography specifics (system display stack, sizes)
- axe/Lighthouse CLI invocation details and report format under `reports/`
- a11y battery script structure (single vs per-page)

## Deferred Ideas

None — discussion stayed within phase scope.
