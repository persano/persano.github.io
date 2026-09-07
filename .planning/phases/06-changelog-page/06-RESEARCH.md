# Phase 6: Changelog Page - Research

**Researched:** 2026-09-05
**Domain:** Static HTML changelog page wired into an existing dictionary-swap i18n architecture with an exact-set-equality CI key gate
**Confidence:** HIGH (all findings grounded in direct code reads this session; zero new dependencies)

## Summary

Phase 6 is an additive content page on an already-shipped v1 architecture: `/geohist/changelog.html` built by copying the `geohist/guide.html` keyed-chrome frame (header/nav/main/footer/consent banner — all `data-i18n`-keyed), with the page's entry list itself staying unkeyed English per the documented i18n exception. There are **no new packages, no new JS, no build step** — the phase is pure HTML markup + ~20 new dictionary keys in `es.json`/`pt-BR.json` + edits to `scripts/i18n-keycheck.mjs` (one line), `sitemap.xml` (one `<url>`), and nav/footer link inserts on 3–4 existing pages, plus new CSS entry-row classes in `css/base.css`. Every library question resolves to "already in the repo, pinned, passing."

The dominant planning constraint is the CI key gate's mechanics: `scripts/i18n-keycheck.mjs` builds a **union** key surface from every registered page and requires every dictionary's key set to equal that union **exactly** (zero missing, zero extra). Because nav/footer link keys on `guide.html`, `contact.html`, and `geohist/index.html` *also* grow the surface, the phase's key-surface-affecting files (page markup, 3 nav edits, 3 footer edits, 2 dictionaries, `pages` array registration) form a single atomic unit — any intermediate commit that touches only one side of a key/markup pair is red. The project's own research already frames the deliverable as "one atomic PR" `[VERIFIED: .planning/research/SUMMARY.md:76]`; this research confirms the atomicity is forced by the gate, not a preference.

Content (backfilled 0.x milestones) is reconstructed at execution time from the app repo at `C:/Users/Familia/antigravity/GeoHist-Trivia` — verified present, with a reliable version-date mining path (`git log -p -- app/build.gradle.kts`) and a live `versionName 0.88` / `versionCode 25`. One correction to carry forward: the CONTEXT example date "0.88 — 2026-08-28" is factually wrong — git shows `versionName = "0.88"` landed **2026-09-04** (commit `2cefab4`). Agents must use git-derived dates, never the CONTEXT example.

**Primary recommendation:** One plan whose key-surface-affecting changes land in a **single commit** (page + 3 nav edits + 3 footer edits + 2 dictionaries + `pages` array entry), with sitemap/CSS/smoke-check either riding along or sequenced after; prove the red gate locally by mutating then reverting (both failure directions), and draft 4–6 curated EN entries from app-repo git history with owner review before ship.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Implementation Decisions (Locked)

**Seed Entries**
- **D-01:** Page backfills 0.x development history on day 1 — not a placeholder, not a single entry. Page never looks empty. — Reversibility: reversible — entries are plain HTML rows; removing or rewording them is a content edit.
- **D-02:** Backfill is **curated milestones** (4–6 entries telling the development arc — e.g., first playable, modes complete, Play Games wired, Play release candidate 0.88), NOT every version bump, NOT compressed wave paragraphs.
- **D-03:** Milestone content + real ISO dates are reconstructed by the agent from the app repo (git history, `.planning/`, `app/build.gradle.kts` — currently versionName 0.88 / versionCode 25); owner reviews the drafted entries before ship.
- **D-04:** When the Play listing goes live, a **new entry is prepended** (real Play launch version, e.g., 1.0) — the 0.x backfill below stays untouched. No "label now, date later" relabeling.

**Entry Voice + Depth**
- **D-05:** Entries are **player-facing** plain language (guide.html tone), not a terse technical build log.
- **D-06:** Per-entry category subheadings limited to **Added / Changed / Fixed** (player-visible buckets); empty categories omitted per entry. Full KaC set (Deprecated/Removed/Security) not shown.
- **D-07:** Detail level: **1–4 short bullets per category** per entry — scannable on mobile.
- **D-08:** Pre-launch entries keep their **real 0.x version numbers with ISO dates** — honest, will match Play history later. No semantic labels, no undated dev notes.

**Page Layout**
- **D-09:** **Timeline list** layout: version+date header, category subheads, bullets — all entries visible. No cards, no collapsed `<details>` archive for old entries.
- **D-10:** Page frame **mirrors guide.html**: H1 (e.g., "What's new") + one-line intro at top, back-to-game link at bottom. No back link at top, no bare list.
- **D-11:** Metadata at **full parity with guide.html**: canonical URL, keyed `<title>`/`<meta description>` (via `data-i18n-attr`), og:* + twitter:* set, sitemap entry, existing og-image.png reused. No additional JSON-LD.
- **D-12:** **No growth cap** — page grows unbounded; full history always visible; agent trims only if it ever becomes unwieldy.

**Link Placement**
- **D-13:** **All geohist navs** gain the Changelog link — Game / Guide / FAQ / Changelog / Privacy on `/geohist/index.html`, `guide.html`, `contact.html`, and the new page (privacy.html nav has no keys today; match its structure when touching it, or leave its nav as-is per planner).
- **D-14:** Root hub (`/index.html`) stays **untouched**.
- **D-15:** Nav order: Changelog sits **before Privacy** — Game / Guide / FAQ / Changelog / Privacy.
- **D-16:** Geohist **footer** also gains a Changelog link, positioned **after Contact** (Privacy / Contact / Changelog / Back to hub / Consent).

### the agent's Discretion
- New CSS classes for entry rows (`.changelog-entry`-style) — small addition to `css/base.css` following existing utility/section conventions; decoration-only rule applies (no texture behind copy).
- Exact `changelog.*` key namespace shape and key names — follow existing `guide.*` namespace pattern 1:1.
- Red-gate demo scope for the CI proof (which mutation to demonstrate) — planner's call.
- Intro line copy (EN + es/pt-BR translations) — agent drafts, owner can veto in review.
- Language-switcher slot on the new page — same as guide.html (`lang-switcher-slot` span in footer).

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

### Other locked project decisions (from STATE.md, relevant here)
- [Locked] Dictionary-swap single-URL i18n architecture — no per-language subdirs/hreflang.
- [Locked] Changelog: keyed chrome, EN entries (documented i18n exception); changelog keys land in es/pt-BR atomically with the page, BEFORE ×20 expansion (Phase 7 inherits the key surface).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-06 | Visitor can view app changelog at `/geohist/changelog.html` — newest-first, ISO dates, Keep-a-Changelog format, EN entries (documented i18n exception: chrome keyed, entries stay EN) | Page-frame copy pattern from `guide.html` (verified lines 26–105); KaC content conventions verified (keepachangelog.com 1.1.0); entry markup skeleton empirically validated against `html-validate` (exit 0); version-date timeline mineable via `git log -p -- app/build.gradle.kts` (verified) |
| CONT-07 | Changelog page chrome is i18n-keyed; `i18n-keycheck.mjs` `pages` array entry red-gate tested; sitemap + nav/footer links added; es/pt-BR dictionaries gain `changelog.*` keys atomically with the page | Gate mechanics fully mapped: union-surface + exact set-equality (verified script lines 22, 100–107); atomic-commit sequencing analysis; red-gate demo procedures (both failure directions); sitemap/nav/footer edit points verified line-by-line |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page delivery (HTML content, entries EN) | CDN / Static (GitHub Pages) | — | Zero build; hand-authored HTML is the artifact itself |
| Chrome translation (nav/headings/footer/title/meta) | Browser (vanilla JS) | Static (JSON dictionaries served same-origin) | `js/i18n.js` swaps keyed nodes post-load; dictionaries fetched from `/js/i18n/*.json` |
| Reachability (nav/footer/sitemap links) | CDN / Static | Git (sitemap.xml committed) | Links are plain anchors; sitemap is a static XML file |
| CI validation (HTML, links, key parity) | Git (GitHub Actions validate job) | Node runtime | `npm run validate` in `.github/workflows/deploy.yml` validate job |
| Entry content (backfill milestones) | Git (app repo, external) | Owner review | Reconstructed from `C:/Users/Familia/antigravity/GeoHist-Trivia` history; owner-reviewed |

## Standard Stack

**No new dependencies.** This phase installs nothing — everything needed is already in the repo, pinned, and passing. `npm install` is not required; `node_modules` is already populated with the pinned devDeps.

| Concern | Tool (already in repo) | Version | Purpose this phase |
|---------|------------------------|---------|--------------------|
| HTML validation | `html-validate` | 11.12.0 (pinned devDep) | `validate:html` glob `geohist/*.html` covers the new page automatically — no script edit `[VERIFIED: package.json:6]` |
| Key-parity gate | `scripts/i18n-keycheck.mjs` (Node built-ins only) | n/a | The CI red gate — one-line `pages` array edit `[VERIFIED: scripts/i18n-keycheck.mjs:22]` |
| Link check | `linkinator` | 8.1.0 (pinned devDep) | `validate:links` recurses repo; new nav links resolve once page exists `[VERIFIED: package.json:8]` |
| CI chain | `.github/workflows/deploy.yml` | checkout@v7 / setup-node@v7 (Node 24) | `validate` job runs `npm install` + `npm run validate`; deploy `needs: validate` `[VERIFIED: .github/workflows/deploy.yml:16-31]` |
| Content source | `C:/Users/Familia/antigravity/GeoHist-Trivia` | — | `git log -p -- app/build.gradle.kts` yields versionName→date pairs `[VERIFIED: app repo, this session]` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff (why not) |
|------------|-----------|--------------------|
| Hand-written HTML timeline | CHANGELOG.md rendered by a build step | Violates zero-build constraint; D-09 timeline-list HTML is a content edit forever after |
| RSS/Atom feed | — | Explicitly excluded by CONTEXT ("no RSS/feed") |
| `<details>` collapsed archive | Timeline list (D-09) | Locked decision: all entries visible |
| Keyed category subheads | EN unkeyed subheads | See Open Question 1 — recommend unkeyed (entries-exception); either is buildable |

## Package Legitimacy Audit

> **N/A — no external packages installed this phase.** Zero runtime deps (project constraint: Firebase CDN only), zero new devDeps (validation stack already pinned in `package.json` and shipped green in CI since v1). Nothing to audit; no `checkpoint:human-verify` tasks needed.

## Architecture Patterns

### System Architecture Diagram

```
                       Git push (main)
                            │
                            ▼
              GitHub Actions: validate job
   ┌──────────────────────────────────────────────┐
   │ npm run validate                              │
   │  ├─ validate:html  (html-validate, glob      │
   │  │                  geohist/*.html)           │
   │  ├─ validate:links (linkinator, recursive)    │
   │  └─ validate:i18n  ────────┐                  │
   └────────────────────────────┼──────────────────┘
                                │ keycheck (node):
                                │  surface = UNION of data-i18n keys
                                │  across pages array [4→5 pages]
                                │  assert: every js/i18n/*.json
                                │  key set == surface EXACTLY
                                ▼
                     green? ── deploy job → Pages CDN
                                │
                                ▼  visitor loads /geohist/changelog.html
   Browser: raw EN HTML paints → i18n.js snapshots keyed nodes
   → resolve lang (localStorage persano.lang > navigator.languages > en)
   → fetch /js/i18n/{es|pt-BR}.json → textContent/setAttribute swap
   (EN entries are NOT keyed — they never swap; chrome only)
```

### Live key-surface numbers (verified by running the gate this session)

```
i18n-keycheck: PASS — es.json exactly covers the 146-key live surface
i18n-keycheck: PASS — pt-BR.json exactly covers the 146-key live surface

index.html 17 | geohist/index.html 65 | geohist/guide.html 42 | geohist/contact.html 34
UNION 146 | es.json 146 | pt-BR.json 146
```

### Recommended key additions (~23 keys, estimated — exact set is planner/agent discretion per D-discretion)

| Group | Keys | Notes |
|-------|------|-------|
| `changelog.*` namespace (new page) | `changelog.meta.title`, `changelog.meta.desc`, `changelog.nav.aria`, `changelog.nav.game`, `changelog.nav.guide`, `changelog.nav.faq`, `changelog.nav.changelog`, `changelog.nav.privacy`, `changelog.title`, `changelog.intro`, `changelog.back.link`, `changelog.footer.privacy`, `changelog.footer.contact`, `changelog.footer.changelog`, `changelog.footer.back`, `changelog.footer.consent`, `changelog.footer.copyright` | ≈17. Self-link in nav keyed (precedent: `guide.nav.guide` self-link `[VERIFIED: geohist/guide.html:29]`). Pattern 1:1 per `guide.*` |
| Nav additions on 3 keyed pages | `geohist.nav.changelog`, `guide.nav.changelog`, `contact.nav.changelog` | Each page namespaces its own nav keys — no shared key `[VERIFIED: guide.html:29, index.html:50, contact.html:30]` |
| Footer additions on 3 keyed pages | `geohist.footer.changelog`, `guide.footer.changelog`, `contact.footer.changelog` | Position: between Contact and Back-to-hub `<li>` `[VERIFIED: guide.html:92-94]` |
| Shared | `consent.banner.*` (aria/text/accept/reject) | Already on surface; reuse identical banner block — adds **no** new keys |

**Estimated new surface: 146 → ~169.** Exact count must be computed at build time — the gate enforces set equality, so the dictionaries must carry precisely whatever markup lands.

### Pattern 1: Keyed-page frame (copy `guide.html` head-to-foot)

**What:** Every structural element gets a key; entries stay unkeyed EN.

**Verified mechanics (source: `js/i18n.js`, read this session):**
- `SUPPORTED = ['en', 'es', 'pt-BR']` `[VERIFIED: js/i18n.js:22]` — no engine change needed; changelog rides the existing swap.
- Snapshot walk selects `[data-i18n], [data-i18n-attr]` `[VERIFIED: js/i18n.js:34]`; keyed nodes get `textContent` only — keyed nodes must contain **plain text, no child markup** `[VERIFIED: js/i18n.js:11]`.
- `data-i18n-attr="attr:key,attr2:key2"` pairs split on FIRST colon; `data-i18n-attr-only` is a bare flag attribute that extracts nothing `[VERIFIED: scripts/i18n-keycheck.mjs:32-52]`.
- Language switcher materializes into `<span id="lang-switcher-slot" hidden>` in the footer; absent slot = clean no-op `[VERIFIED: js/i18n.js:151-153]` — the new page must include the slot to get the switcher.
- Consent banner markup (section + 2 buttons + `.consent-reopen` footer link) is required on the new page like all others; `js/consent.js` must be loaded `[VERIFIED: geohist/guide.html:22-23,95,101-105]`.
- Head script trio, in this order, on every keyed page: `/js/i18n.js`, `/js/firebase-config.js`, `/js/consent.js` (all `defer`) `[VERIFIED: geohist/guide.html:21-23]`.
- Only `<title>` and meta description are keyed; **og:*/twitter:* stay raw EN** (social crawlers don't run JS) `[VERIFIED: geohist/guide.html:6-19]`.

### Pattern 2: Atomic key-surface commit (the binding constraint)

**What:** The gate compares a UNION surface against every dictionary. Any commit that shifts one side without the other is red. Concretely, these files are one atomic unit:
`geohist/changelog.html` + 3 nav edits + 3 footer edits + `js/i18n/es.json` + `js/i18n/pt-BR.json` + `scripts/i18n-keycheck.mjs` (`pages` array).

**Proof by construction (why ordering alternatives are red):**
- Dictionaries land first (changelog.* + nav/footer keys added) → dicts have **extra** keys vs 146-surface → `FAIL extra keys` `[VERIFIED: scripts/i18n-keycheck.mjs:101]`.
- Page/nav markup lands first (keys in markup, dictionaries not updated) → `FAIL missing keys` `[VERIFIED: scripts/i18n-keycheck.mjs:100]`.
- Page registered in `pages` array but keys not in dictionaries → missing → FAIL. Dictionaries have keys but page not registered → extra → FAIL.

**Sequenced-green alternative** (if planner wants multiple tasks, each commit green):
1. Commit A: `changelog.html` with *plain unkeyed* nav/footer/text (no `data-i18n` anywhere, no dictionary edits) + new CSS + sitemap + smoke-check URL → surface unchanged → green.
2. Commit B (atomic): swap page chrome to keyed + keyed nav/footer inserts on the 3 pages + both dictionaries + `pages` array entry → one commit, both sides move together → green.
Recommended default: single atomic commit (matches "one atomic PR" framing `[VERIFIED: .planning/research/SUMMARY.md:76]`).

### Pattern 3: Red-gate proof (both failure directions, run locally then revert)

The gate is the same script CI runs; the proof is a local mutation + run + revert (do not push a red commit):

```bash
# Failure A — page registered, dictionaries missing changelog.* keys:
#   edit scripts/i18n-keycheck.mjs line 22 -> add join('geohist','changelog.html')
#   (with the real page's keyed markup present)
node scripts/i18n-keycheck.mjs   # expect FAIL missing keys, exit 1
git checkout -- scripts/i18n-keycheck.mjs

# Failure B — dictionaries have changelog.* keys, page unregistered:
#   (changelog.html + keyed markup present, pages array NOT edited)
#   temporarily add a changelog.* key to markup only -> surface lacks it -> dicts have EXTRA keys
node scripts/i18n-keycheck.mjs   # expect FAIL extra keys, exit 1
```

Also demonstrate: `npm run validate:html` covers the new page via the existing glob (no edit), and `validate:links` fails if nav links point at a nonexistent page — link wiring is red-gated too.

### Pattern 4: Keep-a-Changelog content shape (adapted to HTML)

`[CITED: keepachangelog.com/en/1.1.0]` — verified this session:
- Curated, chronologically ordered list of notable changes per version; **latest version first** (reverse chronological).
- Release date displayed; ISO 8601 `YYYY-MM-DD` explicitly recommended (largest-to-smallest units, unambiguous).
- Standard types: Added / Changed / Deprecated / Removed / Fixed / Security — D-06 adopts the Added/Changed/Fixed subset, which is a documented deviation, fine as a convention.
- Empty categories omitted ("People will have to assume that the missing sections were intentionally left out" — spec's own guidance).
- "Changelogs are for humans, not machines"; commit-log dumps are an anti-pattern (matches D-02 curated milestones, D-05 player voice).
- Note: KaC is a *file convention* (CHANGELOG.md). Here it is a *content convention* rendered as HTML — no CHANGELOG.md file is created. No markdown tooling.

### Recommended project structure (deltas only)

```
geohist/
├── changelog.html      # NEW — keyed frame + unkeyed EN timeline list
css/base.css            # + .changelog-entry block (card pattern, end of file)
js/i18n/es.json         # + ~23 keys (changelog.* + 3×nav + 3×footer)
js/i18n/pt-BR.json      # + ~23 keys (same set)
scripts/i18n-keycheck.mjs   # line 22: + join('geohist', 'changelog.html')
sitemap.xml             # + 1 <url>
scripts/smoke-check.sh  # + $BASE/geohist/changelog.html in URL list
geohist/{index,guide,contact}.html  # + nav & footer links
geohist/privacy.html    # + plain unkeyed nav link (see Pitfall 7)
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chrome translation | Any new i18n mechanism, JSON-DOM swap variant, or per-page script | Existing `js/i18n.js` — zero engine changes `[VERIFIED: js/i18n.js:1-18 design intent]` | Engine already handles snapshot/fallback/lang sync; entries unkeyed by design |
| Date formatting | JS date-formatting helper | Static `<time datetime="2026-09-04">` text in EN entries | Entries are static HTML; ISO strings are written literally |
| Version/date reconstruction | Manual memory-based dating | `git log -p -- app/build.gradle.kts` on the app repo | Verified to yield the full versionName→date timeline this session |
| Key parity checking | Ad-hoc grep scripts | Existing `i18n-keycheck.mjs` (extend `pages` array by one entry) | Gate already handles missing/extra reporting and exit codes |
| Page frame/nav/footer/banner markup | New structure | Copy `guide.html` frame verbatim, change namespace + main content | Proven-passing under html-validate, axe, Lighthouse (v1 gates) |

## Common Pitfalls

### Pitfall 1: Non-atomic key-surface commits go red in CI
**What goes wrong:** Splitting "page markup" / "dictionaries" / "pages array" / "nav links" across per-task commits makes intermediate commits fail `validate:i18n` (extra or missing keys), breaking the trunk CI between tasks.
**Why it happens:** The gate is set-equality over a UNION of 5 pages; nav/footer keys on `guide.html`, `contact.html`, `geohist/index.html` count too — they're easy to forget as surface-growers.
**How to avoid:** Plan the whole key-surface delta as ONE commit (or the two-commit green sequence in Pattern 2). Grep the final diff: every `data-i18n`/`data-i18n-attr` key added to markup must exist in BOTH dictionaries, and vice versa.
**Warning signs:** `i18n-keycheck: FAIL — missing keys (N): changelog.*` or `extra keys (N)` in CI log.

### Pitfall 2: Trusting the CONTEXT example date
**What goes wrong:** Backfill entries dated from the CONTEXT example ("0.88 — 2026-08-28") instead of real history.
**Why it happens:** The example looks authoritative but is illustrative.
**How to avoid:** Derive every version-date pair from `git -C <app-repo> log --date=short --format="COMMIT %h %ad" -p -- app/build.gradle.kts` and cross-check against `.planning/` milestone audits in the app repo. Verified actual data point: `versionName = "0.88"` appears in commit `2cefab4`, dated **2026-09-04** `[VERIFIED: git log -p, this session]`.
**Warning signs:** An entry date that doesn't match any versionName-touching commit date.

### Pitfall 3: Pre-0.x version scheme noise
**What goes wrong:** Listing "8.0", "9.0", "10.0" entries — the app repo used those versionNames before switching to the 0.x scheme (`10.0` → `0.2` on 2026-08-24) `[VERIFIED: git log -p, this session]`.
**Why it happens:** Naive `git log -p` mining includes the early scheme.
**How to avoid:** Backfill starts at the first real 0.x (0.2, 2026-08-24) or the "first playable" milestone per D-03 curation; never list every bump (D-02). Owner reviews the draft.
**Warning signs:** Entry headers like "8.0 — 2026-08-2x" on the page.

### Pitfall 4: Keyed nodes carrying markup
**What goes wrong:** Putting `<strong>`/links inside a `data-i18n` node — `textContent` assignment destroys the markup on every non-EN apply.
**Why it happens:** Keyed-node = plain-text-only contract (`textContent` and `setAttribute` ONLY).
**How to avoid:** Only chrome text nodes get `data-i18n`; entries are unkeyed EN so their internal markup is free. Nav/footer link nodes are plain text already — copy them verbatim.
**Warning signs:** Translated page renders literal tags or loses link styling.

### Pitfall 5: Keying the privacy.html nav
**What goes wrong:** Adding `data-i18n="privacy.nav.changelog"` to privacy.html creates a dead key: privacy.html loads **no scripts** and has no consent banner or switcher `[VERIFIED: geohist/privacy.html:20-30 — stylesheet only, unkeyed nav]`. It's the site's EN-only static outlier.
**How to avoid:** Per D-13, *match its structure*: add a plain unkeyed "Changelog" `<a>` to its nav (zero key-surface impact). If the planner instead wants a keyed nav there, that drags in `privacy.*` namespace + i18n.js + consent scripts — cost without benefit; not recommended.
**Warning signs:** New `privacy.*` keys appearing in the surface estimate.

### Pitfall 6: Forgetting the lang-switcher slot and consent banner
**What goes wrong:** Changelog page lacks `<span id="lang-switcher-slot" hidden>` or the consent-banner block / `consent-reopen` footer link / `js/consent.js` — switcher silently absent (no-op) or consent retraction broken on that page.
**How to avoid:** Copy guide.html footer + banner blocks verbatim; keep the three shared defer scripts in the head.
**Warning signs:** Manual QA — footer shows no "English · Español · Português" row.

### Pitfall 7: Forgetting smoke-check URL list
**What goes wrong:** Post-deploy smoke check doesn't verify the new URL — silent-404 window on the live site goes unnoticed.
**How to avoid:** One-line addition to `scripts/smoke-check.sh` URL list (`$BASE/geohist/changelog.html`) `[VERIFIED: scripts/smoke-check.sh:25-37 — it enumerates pages; add the URL]`.
**Warning signs:** Live check list diverges from sitemap.

### Pitfall 8: OG/Twitter meta keyed by reflex
**What goes wrong:** Keying og:title/description — they never swap (no JS in crawlers) and would add surface keys pointlessly; also diverges from the proven guide.html metadata pattern.
**How to avoid:** Copy guide.html lines 6–19 exactly: keyed `<title>` + keyed meta description only; og:*/twitter:* raw EN.

## Code Examples

### Entry markup skeleton (validated: `npx html-validate` → exit 0 on a full mock of this exact structure)

```html
<!-- Source: frame copied from geohist/guide.html (verified) + D-06/D-07/D-09 shape;
     empirically passes html-validate:recommended this session -->
<article class="changelog-entry">
  <h2><time datetime="2026-09-04">2026-09-04</time> — 0.88</h2>
  <h3>Added</h3>
  <ul><li>Player-facing bullet in plain English.</li></ul>
</article>
```

(Alternate header order "0.88 — 2026-08-28" per CONTEXT Specifics is equally valid; pick one and stay consistent.)

### Nav insert (guide.html shown; identical shape on index/contact with each page's namespace)

```html
<!-- Source: geohist/guide.html:28-31 + D-15 ordering -->
<a href="/geohist/guide.html" data-i18n="guide.nav.guide">Guide</a>
<a href="/geohist/index.html#faq" data-i18n="guide.nav.faq">FAQ</a>
<a href="/geohist/changelog.html" data-i18n="guide.nav.changelog">Changelog</a>  <!-- NEW, before Privacy -->
<a href="/geohist/privacy.html" data-i18n="guide.nav.privacy">Privacy</a>
```

### Footer insert (D-16: after Contact, before Back to hub)

```html
<!-- Source: geohist/guide.html:92-94 -->
<li><a href="/geohist/contact.html" data-i18n="guide.footer.contact">Contact</a></li>
<li><a href="/geohist/changelog.html" data-i18n="guide.footer.changelog">Changelog</a></li>  <!-- NEW -->
<li><a href="/" data-i18n="guide.footer.back">Back to hub</a></li>
```

### CSS entry-row class (follows .mode-item card convention; decoration-only rule)

```css
/* Source: css/base.css:337-343 (.mode-item pattern); D-discretion notes */
.changelog-entry {
  background-color: var(--color-surface);
  border: var(--hairline);
  border-radius: 0.5rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.6rem;
}
```

### Keycheck registration (the one-line script edit)

```js
// Source: scripts/i18n-keycheck.mjs:22 (verbatim current line)
const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html')];
// becomes:
const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];
```

### Sitemap entry

```xml
<!-- Source: sitemap.xml:5-7 format -->
<url><loc>https://persano.github.io/geohist/changelog.html</loc></url>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Keep-a-Changelog as CHANGELOG.md file | Rendered as static HTML page (site-native, KaC content conventions) | n/a — site constraint | No markdown tooling; entries are HTML rows |
| KaC full category set (6 types + Unreleased) | D-06 subset: Added/Changed/Fixed only, empty omitted | Phase 6 decision | Documented deviation; spec-tolerant (subset is a convention, not a violation) |
| Per-language subdirs + hreflang (v1 pre-decision idea) | Dictionary-swap single URL (locked) | v1 | Changelog must NOT add hreflang/subdirs; requirement I18N-10 explicitly deferred |

**Deprecated/outdated:** None affecting this phase. Note for planner (out of scope, zero action): `.github/workflows/deploy.yml:24-27` comment claims "no package-lock.json exists yet" but a lockfile now exists — stale comment only; CI runs `npm install` regardless and is green. Fixing the comment is not Phase 6 work.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Category subheads (Added/Changed/Fixed) are EN unkeyed — part of entries, inside the documented i18n exception (not counted in the ~23-key estimate) | Open Questions 1 | If planner keys them instead: +3 keys to estimate; dictionaries need them; gate enforces either way — decision must precede dictionary drafting |
| A2 | Exact key names/counts (~23) follow the guide.* 1:1 pattern; final set is whatever markup lands | Architecture Patterns | Cosmetic — gate enforces set equality; estimate is for sizing only |
| A3 | privacy.html gets a plain unkeyed nav link (no key surface change); its minimal footer (Back to hub / Contact) stays as-is | Pitfall 5 | If owner wants footer parity there too: one more plain link, no key impact |
| A4 | Entry header format "0.88 — 2026-09-04" vs "2026-09-04 — 0.88" — both validated; CONTEXT Specifics suggests version-first | Code Examples | Cosmetic only |
| A5 | Backfill sources: git-derived versionName timeline is the authoritative date source; app-repo `.planning/` milestone audits (v1.0–v1.6) inform milestone arc wording | Common Pitfalls 2/3 | Low — cross-checkable by owner in review (D-03 mandates owner review) |

## Open Questions (RESOLVED)

All three questions were substantively resolved by executed Phase 6 work. Original recommendations retained for traceability; resolution pointer added to each.

1. **Are the per-entry category subheads keyed or EN-unkeyed?**
   - What we know: D-06 limits categories to Added/Changed/Fixed; entries are the documented EN exception; subheads sit *inside* entries.
   - What's unclear: whether they count as "chrome" (keyed) or "entries" (EN).
   - Recommendation: **EN unkeyed** (entry-scoped content, consistent with the exception; keeps estimate at ~23). If the planner prefers keyed subheads (`changelog.cat.added/changed/fixed`), add exactly 3 keys and they must land in the same atomic commit.
   - **RESOLVED: EN unkeyed** — see `06-01-SUMMARY.md` ("Decisions Made"): subheads sit inside the documented EN entries exception (`keysInsideEntries=0`).
2. **Red-gate demo scope** (planner's call per discretion): recommend demonstrating **both** failure directions (Pattern 3) locally — cheap (two mutations + reverts) and proves the gate's symmetric design.
   - **RESOLVED: both failure directions demonstrated** — see `red-gate-proof.md` and `06-UAT.md` (D4 pass).
3. **privacy.html footer link** (A3): nav-only is my recommendation; footer addition is optional owner polish.
   - **RESOLVED: footer stays as-is** per A3 (nav-only adopted; no footer addition made in Phase 6).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node + npm | CI validate job, local gate runs | ✓ (local 26.5.1; CI pins Node 24) | — | — |
| html-validate / linkinator (pinned devDeps) | validate:html / validate:links | ✓ (node_modules present) | 11.12.0 / 8.1.0 | npx fetch if node_modules wiped |
| App repo `C:/Users/Familia/antigravity/GeoHist-Trivia` | Backfill content mining | ✓ | git history 2026-08-16 → 2026-09-05 | None needed — owner can supply dates manually |
| Chrome | a11y-audit only (optional, not in validate chain) | ✓ per script path check | — | Skip audit (not CI-gated) |

**Missing dependencies with no fallback:** none.

## Sources

### Primary (HIGH confidence — direct file reads this session)
- `scripts/i18n-keycheck.mjs` (full read) — pages array (line 22), exact set-equality logic (100–107), exit codes
- `geohist/guide.html` (full read) — keyed-chrome frame, nav (27–32), footer (90–99), consent banner (101–105), head metadata (6–23)
- `geohist/index.html` (full read) — landing nav/footer (48–53, 168–177)
- `geohist/contact.html` (full read) — second nav/footer variant (28–33, 78–87)
- `geohist/privacy.html` (full read) — unkeyed outlier: no scripts, no consent banner, minimal footer (20–30, 64–70)
- `js/i18n.js` (full read) — swap engine, SUPPORTED list, snapshot/apply/switcher mechanics
- `js/consent.js` (read, 1–80) — banner/store behavior, CDN base 12.18.0
- `css/base.css` (full read) — design tokens (:root, 14–26), card pattern (.mode-item, 337–343), footer styles (347–360), decoration-only rule (362–377)
- `sitemap.xml`, `robots.txt`, `package.json`, `.htmlvalidate.json`, `.github/workflows/deploy.yml`, `scripts/smoke-check.sh` (full reads)
- Key counts verified by live node run: hub 17 / geohist 65 / guide 42 / contact 34 / union 146 / es 146 / pt-BR 146 (gate PASS pre-change)
- App repo `C:/Users/Familia/antigravity/GeoHist-Trivia` — `app/build.gradle.kts:20-21` (`versionCode = 25`, `versionName = "0.88"`); `git log -p -- app/build.gradle.kts` version timeline (0.2 2026-08-24 … 0.88 2026-09-04); `.planning/` milestone audits present
- Empirical: mock changelog skeleton validated with `npx html-validate` → exit 0

### Secondary (MEDIUM confidence)
- `[CITED: keepachangelog.com/en/1.1.0]` — KaC principles, ISO 8601 dates, category types, empty-category omission, anti-patterns (fetched this session)
- `.planning/research/SUMMARY.md:76`, `.planning/research/PITFALLS.md:303` — project's own phase-6 framing ("one atomic PR", red-gate test)

### Tertiary (LOW confidence)
- None — no unverified claims carried.

## Metadata

**Confidence breakdown:**
- Gate mechanics & atomicity: HIGH — script read in full, live-run verified, both failure modes reasoned from code
- Page structure & patterns: HIGH — guide.html frame copied verbatim, empirically html-validate-clean
- Content sourcing: HIGH — app repo verified, version-date mining command proven
- Key estimate: MEDIUM-A2 — exact set is build-time, gate-enforced

**Research date:** 2026-09-05
**Valid until:** 2026-10-05 (stable — no moving dependencies)
