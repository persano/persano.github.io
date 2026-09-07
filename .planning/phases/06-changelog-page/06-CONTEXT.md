# Phase 6: Changelog Page - Context

**Gathered:** 2026-09-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver `/geohist/changelog.html`: a Keep-a-Changelog-format app update history (entries newest-first, ISO dates, EN entries), with page chrome (nav, headings, footer, back links, language switcher) keyed via `data-i18n` and translated in es/pt-BR dictionaries in the same commit. Wire the page into every geohist nav + footer, `sitemap.xml`, and add it to `scripts/i18n-keycheck.mjs` `pages` array so missing `changelog.*` keys or an unregistered page fails CI (red-gate proven). Content: backfilled curated 0.x milestones reconstructed from the app repo, owner-reviewed. No translated entries (×20 excluded), no RSS/feed, no automation beyond existing CI.

</domain>

<decisions>
## Implementation Decisions

### Seed Entries
- **D-01:** Page backfills 0.x development history on day 1 — not a placeholder, not a single entry. Page never looks empty. — **Reversibility:** reversible — entries are plain HTML rows; removing or rewording them is a content edit.
- **D-02:** Backfill is **curated milestones** (4–6 entries telling the development arc — e.g., first playable, modes complete, Play Games wired, Play release candidate 0.88), NOT every version bump, NOT compressed wave paragraphs.
- **D-03:** Milestone content + real ISO dates are reconstructed by the agent from the app repo (git history, `.planning/`, `app/build.gradle.kts` — currently versionName 0.88 / versionCode 25); owner reviews the drafted entries before ship.
- **D-04:** When the Play listing goes live, a **new entry is prepended** (real Play launch version, e.g., 1.0) — the 0.x backfill below stays untouched. No "label now, date later" relabeling.

### Entry Voice + Depth
- **D-05:** Entries are **player-facing** plain language (guide.html tone: "New: Art Detective mode — recognize legendary figures in paintings"), not a terse technical build log.
- **D-06:** Per-entry category subheadings limited to **Added / Changed / Fixed** (player-visible buckets); empty categories omitted per entry. Full KaC set (Deprecated/Removed/Security) not shown.
- **D-07:** Detail level: **1–4 short bullets per category** per entry — scannable on mobile.
- **D-08:** Pre-launch entries keep their **real 0.x version numbers with ISO dates** ("0.88 — 2026-08-28") — honest, will match Play history later. No semantic labels, no undated dev notes.

### Page Layout
- **D-09:** **Timeline list** layout: version+date header, category subheads, bullets — all entries visible. No cards, no collapsed `<details>` archive for old entries.
- **D-10:** Page frame **mirrors guide.html**: H1 (e.g., "What's new") + one-line intro at top, back-to-game link at bottom. No back link at top, no bare list.
- **D-11:** Metadata at **full parity with guide.html**: canonical URL, keyed `<title>`/`<meta description>` (via `data-i18n-attr`), og:* + twitter:* set, sitemap entry, existing og-image.png reused. No additional JSON-LD (SoftwareVersion/Article) — plain parity only.
- **D-12:** **No growth cap** — page grows unbounded; full history always visible; agent trims only if it ever becomes unwieldy.

### Link Placement
- **D-13:** **All geohist navs** gain the Changelog link — Game / Guide / FAQ / Changelog / Privacy on `/geohist/index.html`, `guide.html`, `contact.html`, and the new page (privacy.html nav has no keys today; match its structure when touching it, or leave its nav as-is per planner).
- **D-14:** Root hub (`/index.html`) stays **untouched** — its app card already leads into the geohist site; no changelog link on the hub.
- **D-15:** Nav order: Changelog sits **before Privacy** — Game / Guide / FAQ / Changelog / Privacy.
- **D-16:** Geohist **footer** also gains a Changelog link, positioned **after Contact** (Privacy / Contact / Changelog / Back to hub / Consent).

### the agent's Discretion
- New CSS classes for entry rows (`.changelog-entry`-style) — small addition to `css/base.css` following existing utility/section conventions; decoration-only rule applies (no texture behind copy).
- Exact `changelog.*` key namespace shape and key names — follow existing `guide.*` namespace pattern 1:1.
- Red-gate demo scope for the CI proof (which mutation to demonstrate) — planner's call.
- Intro line copy (EN + es/pt-BR translations) — agent drafts, owner can veto in review.
- Language-switcher slot on the new page — same as guide.html (`lang-switcher-slot` span in footer).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning / Requirements
- `.planning/ROADMAP.md` — Phase 6 goal, success criteria (4 gates: newest-first KaC EN entries, keyed chrome in es/pt-BR, nav/footer/sitemap reachability, CI red-gate proof)
- `.planning/REQUIREMENTS.md` — CONT-06, CONT-07 exact wording; Out-of-Scope table (translated entries ×20 excluded)
- `.planning/STATE.md` — locked decision: "Changelog: keyed chrome, EN entries (documented i18n exception); changelog keys land in es/pt-BR atomically with the page, BEFORE ×20 expansion"
- `.planning/PROJECT.md` — Key Decisions table (i18n architecture, zero-build, agent-maintained model)

### Code (patterns to follow)
- `geohist/guide.html` — structural analog: keyed chrome head-to-foot (`data-i18n`, `data-i18n-attr`, `data-i18n-attr-only`), header/nav/footer frame, consent banner block, no page-specific JS
- `geohist/index.html` — landing nav (`site-nav`) and footer (`footer-links`) that gain the Changelog link
- `geohist/contact.html` — second nav/footer variant to update
- `scripts/i18n-keycheck.mjs` — the CI gate: `pages` array at line 22 must gain `join('geohist', 'changelog.html')`; exact set-equality means every dictionary needs ALL new keys
- `js/i18n/es.json`, `js/i18n/pt-BR.json` — dictionaries that gain `changelog.*` keys atomically with the page (exact key parity enforced)
- `css/base.css` — shared stylesheet; new entry-row classes go here
- `sitemap.xml` — gains `/geohist/changelog.html` URL
- `scripts/smoke-check.sh` — BASE-driven smoke check; verify whether it enumerates pages (agent checks during research)

### Content Source (external, absolute path)
- `C:/Users/Familia/antigravity/GeoHist-Trivia` — app repo: git history + `.planning/` + `app/build.gradle.kts` (versionName 0.88, versionCode 25) are the source for backfilled milestones and real dates. Owner reviews the agent's draft entries before ship.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `geohist/guide.html` — copy-frame source: header/nav/main/footer/consent-banner structure with keyed chrome; changelog page differs only in main content (timeline list, EN entries unkeyed)
- `css/base.css` — section/list/typography styles already cover a timeline-list shape with minor additions
- `js/i18n.js` — applies dictionary swap to `data-i18n` nodes on any page that loads it; no engine changes needed for chrome (entries stay EN)
- `js/consent.js` + consent banner markup — required on the new page like all others
- Existing `og-image.png` — reused for og:image, no new asset

### Established Patterns
- Keyed-node = plain-text-only rule: `data-i18n` targets must contain no child markup (entries are unkeyed EN so no conflict, but chrome nodes must comply)
- Namespace 1:1 mapping (`guide.*`, `contact.*`, `consent.*`) → new `changelog.*` namespace
- Zero build step, zero page JS beyond the three shared `<script defer>` tags (i18n, firebase-config, consent)
- Native semantics only (no JS accordions/sliders); WCAG AA contrast already proven palette

### Integration Points
- `scripts/i18n-keycheck.mjs` `pages` array — add `join('geohist', 'changelog.html')`; gate then enforces es/pt-BR key parity for `changelog.*` (Phase 7 dictionaries inherit automatically)
- `sitemap.xml` — add one `<url>` entry
- Nav + footer links on 3 existing keyed pages (index, guide, contact) — each page's own namespace gains a nav/footer link key (e.g., `guide.nav.changelog`), which itself changes each dictionary's key surface — must land atomically with the page
- `robots.txt` — no change needed (allow-all)

</code_context>

<specifics>
## Specific Ideas

- Backfill arc suggested (not exhaustive, agent reconstructs real milestones from app repo): first playable build → game modes complete → Play Games Services/leaderboards wired → Play release candidate (0.88). Owner reviews before ship.
- Entry header format: "0.88 — 2026-08-28" style (version + ISO date on one line).
- Nav on all pages reads Game / Guide / FAQ / Changelog / Privacy; footer reads Privacy / Contact / Changelog / Back to hub / Consent.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 6-Changelog Page*
*Context gathered: 2026-09-05*
