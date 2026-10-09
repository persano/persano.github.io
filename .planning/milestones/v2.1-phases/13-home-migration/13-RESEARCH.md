# Phase 13: Home Migration - Research

**Researched:** 2026-09-14
**Domain:** GitHub Pages static-site URL-layout migration (root↔subdir swap + meta-refresh stub) with five CI gate page-list repoints, canonical/og/JSON-LD/sitemap coherence, and zero i18n dictionary drift
**Confidence:** HIGH (every in-repo claim read from live source this session with line citations; external SEO claims verified against official Google docs fetched this session; stub mechanics verified empirically in headless Chrome)

## Summary

This phase moves the GeoHist landing from `/geohist/` to the site root `/`, moves the portfolio hub from `/` to `/apps/`, replaces `geohist/index.html` with a self-contained meta-refresh-0 stub, and repoints every hard-coded gate page-list — all in **ONE atomic commit** (STATE decision; Phase-8 precedent). The deep structure that makes this cheap and safe was already established: the milestone-level integration research (`.planning/research/ARCHITECTURE.md`, 2026-09-11) prescribes the exact target state, and this phase-level research verified every element of it against the live tree and sharpened three points the milestone doc left open (stub-in-keycheck-list, privacy.html edit scope, fragment behavior of the frozen page's `#faq` link).

The load-bearing mechanism: `scripts/i18n-keycheck.mjs` asserts **exact set equality** between the union of keys across its hard-coded `pages` array and all 19 dictionaries (178 keys, verified live this session: `i18n-keycheck: PASS` ×19 + `i18n-surface: 178 keys across 5 pages`). Key namespaces are role conventions, not URL-bound — `hub.*` (13 keys), `geohist.*` (70), `guide.*` (40), `contact.*` (33), `changelog.*` (18), shared `consent.*` (4) all verified from the surface dump this session. Moving markup **verbatim** preserves the 178 surface with **zero dictionary edits**; the atomic coupling is purely between page placement + the two `pages[]` arrays + the star-check path + the other three gate lists.

Verified this session beyond the milestone doc: (1) the stub pattern passes `html-validate` (exit 0, recommended ruleset); (2) `linkinator` does **not** follow meta refresh — the stub's `<a>` fallback is validated normally (scratch-run verified); (3) **meta refresh drops the URL fragment in Chrome** (empirical: `stub.html#faq` → refreshed to target *without* `#faq`, scroll top) — so the frozen privacy page's `/geohist/index.html#faq` nav link will land at the top of the new root landing, not at the FAQ section: cosmetic, zero broken paths, accepted; (4) Google Search Central classifies instant (0 s) meta refresh as a **permanent redirect** and the Change-of-Address doc explicitly excludes same-domain path moves — both fetched verbatim this session.

**Primary recommendation:** One plan wave carrying the single atomic migration commit (both page moves + stub + href repoints + canonical/og:url/JSON-LD url + sitemap + all five gate lists + star path + 404 + AGENTS.md same-commit per MIG-06), with red-gate proofs both directions for every gate change recorded in `red-gate-proof.md` (snapshot-copy hash-verified restore — the tree is NOT clean: Phase 12's `npm ci`/`cache: npm` changes are still uncommitted, see Environment/git state). A second, parallel-safe docs plan authors `13-RUNBOOK.md` (GSC sitemap resubmit + URL inspection, explicit no-CoA section); its live steps are post-deploy owner console actions recorded via the phase UAT gate.

<user_constraints>

## User Constraints (from AGENTS.md + REQUIREMENTS.md + STATE.md)

No `## Decisions` CONTEXT.md exists for this phase (discuss-phase skipped per config `skip_discuss: true`). Constraints below come from `AGENTS.md` (repo root), `.planning/REQUIREMENTS.md` (Out of Scope), and `.planning/STATE.md` (Accumulated Context decisions). Copy of the binding items:

### Locked decisions (STATE.md lines 73-76, verbatim)

- "v2.1: home migration is ONE atomic commit — keycheck 178-key set-equality forces both page moves + all 5 gate-list registrations together; one revert = rollback (Phase-8 precedent)"
- "v2.1: `/geohist/privacy.html` is FROZEN — Play Console compliance surface, invisible to repo gates; never move it"
- "v2.1: no GSC Change-of-Address refile — same-domain path moves are doc-excluded; 180-day window until ~2027-03 stays untouched"
- "v2.1: gated events are watch items, not phases — Tier-1 rating flip, FIRE-10 flip, App #2 subdir (v3+)"

### REQUIREMENTS.md Out of Scope (verbatim table rows binding this phase)

| Feature | Reason |
|---------|--------|
| Move `geohist/privacy.html` | Play Console compliance surface; invisible to repo gates; app in review |
| Re-file GSC Change-of-Address | 180-day window active until ~2027-03; same-domain path moves are doc-excluded from CoA |
| Rename `hub.*` i18n keys → `apps.*` | ×19 dictionary churn, zero user benefit |
| `aggregateRating` from Play data | Review-snippet policy bars mirroring even with real data — permanent exclusion |
| JS-only redirects | Google classes as last resort; meta-refresh-0 suffices on Pages |
| Future-app placeholder cards | Visible placeholders violate the hub constraint (structure anticipates, doesn't advertise) |
| `robots.txt` `Disallow: /.planning/` | Deliberate decision, flagged not decided — parked for a future milestone |
| Full landing copy at both `/` and `/geohist/` | Double indexation; stub, never copy |

### AGENTS.md directives (must hold during execution)

- **Zero build**: plain HTML5/CSS3/vanilla ES2020+ JS; no SSG/framework; no new runtime dependencies.
- **Firebase loading is fork-shaped** — Analytics only in `js/consent.js` post-consent; Auth+Firestore only in `js/contact.js` submit path; App Check never at page load. The migration touches **no** JS files.
- **Old-domain gate**: never write the legacy `*.github.io` host literal in any file (gate enforces AGENTS.md itself). Phrase the dual-hosts fact as "legacy `*.github.io` Pages host".
- **Red-gate proof for every gate change**: mutate → gate FAIL → restore byte-identical (hash-verified; `git restore` unusable while changes are uncommitted) → re-run → PASS. Both directions, recorded in the phase's `red-gate-proof.md`.
- **One atomic commit per unit of work**, conventional-commit subjects; GSD deferred-commit mode (code changes stay uncommitted; `/gsd-ship` lands them).
- **`.planning/` is publicly served**: no secrets, debug tokens, or console credentials in any planning doc — console-UI instructions only.
- **Supersession-note policy**: historical records keep original text verbatim; dated bracketed correction appends.
- **`uat-passed` predicate is mechanical**: any `result: issue` = blocker, no gap-awareness.
- **Zero globals** in page scripts; the stub and 404 are self-contained (no scripts); native `<details>` — no JS for static interactivity.
- **Deploy via GitHub Git Data API bridge** when local remote ops are harness-blocked: strict fast-forward, never force-push, mandatory per-blob sha assertions, LF-normalized text blobs.

### the agent's Discretion

(None recorded — no CONTEXT.md for this phase. Scope per REQUIREMENTS.md MIG-01..09. Open sub-decisions surfaced by research are listed in `## Open Questions` with recommendations.)

### Deferred Ideas (OUT OF SCOPE)

- 10-RUNBOOK supersession note + GA4 `play_badge_click` pathname addendum + swap-ready inventory → **Phase 14 (LKIT-02/LKIT-04)**, not Phase 13.
- App #2 subdir + hub card → v3+ (APP2-01 watch item).
- Tier-1 rating row flip → owner-gated watch item (10-RUNBOOK §1); the migration must keep the OFF row ship-shape (hidden, `0.0`, exactly ONE star SVG) so the flip stays 2 edits.
- `hub.*` → `apps.*` key rename; robots.txt `.planning/` disallow; CoA refile; any new i18n keys (a frozen 178-key surface ships this phase).

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MIG-01 | Visitor hitting site root `/` sees the GeoHist landing (hero, proof strip, features, gallery, FAQ, CTA) with all 20 locales working | Target state: `geohist/index.html` body moves verbatim to root `index.html` (canonical/og:url/JSON-LD url → `/`). i18n engine is page-agnostic (`js/i18n.js` — `DICT_URL_PREFIX = '/js/i18n/'` absolute; snapshot walk has no path awareness, [VERIFIED: js/i18n.js:38,51-92]) so all 20 locales work at the new path with zero engine/dictionary edits. |
| MIG-02 | Visitor hitting `/geohist/` (incl. via legacy host) reaches the root landing via a meta-refresh-0 stub | `geohist/index.html` becomes a self-contained stub (`noindex, follow` + canonical → `/` + `content="0; url=/"` + visible `<a>` fallback). Google classifies instant meta refresh as a permanent redirect [CITED + VERIFIED quote: developers.google.com/search/docs/crawling-indexing/301-redirects, fetched 2026-09-14]. Legacy-host chain: legacy 301 (path-preserved, permanent hosting fact) → apex `/geohist/` → stub → `/`. Stub passes html-validate (verified this session). |
| MIG-03 | Visitor browsing `/apps/` sees the portfolio hub (former root content, keyed chrome) with zero future-app placeholders | Root `index.html` moves verbatim to `apps/index.html` (canonical/og:url → `/apps/`; card CTA href `/geohist/` → `/`). All 13 `hub.*` keys ride along unchanged; no placeholder cards added (Out of Scope verbatim). |
| MIG-04 | All sitemap URLs resolve on apex with coherent canonical + og:url + JSON-LD url per page | Sitemap target set (6 entries, no-lastmod convention): `/`, `/apps/`, `/geohist/guide.html`, `/geohist/changelog.html`, `/geohist/contact.html`, `/geohist/privacy.html`. The stub is NOT listed (sitemaps list canonical URLs only). Canonicals verified today: every page carries exactly one canonical + og:url ([VERIFIED: guide/contact/changelog/privacy each at lines 8 and 12; hub at index.html:8,12; landing JSON-LD `"url"` at geohist/index.html:44]). |
| MIG-05 | All five hardcoded gate page-lists (i18n-keycheck, i18n-surface, a11y-audit, smoke-check, validate:html glob) cover the new layout — red-gate proven both directions | All five lists read verbatim this session with line citations (see Code Examples) + the 6th hardcode: the keycheck star-uniqueness path (i18n-keycheck.mjs:184) which reads `geohist/index.html` as "the landing" and must repoint to root `index.html`. Red-gate protocol per gate (both directions) prescribed in `## Architecture Patterns` and `## Code Examples`. |
| MIG-06 | AGENTS.md reflects the new layout in the same commit (old-domain gate enforces it) | Exact AGENTS.md edit sites identified: line 9 (Project paragraph — "the root page is a minimal portfolio hub… app site lives in `/geohist/`"), line 20 (Hosting constraint — "GeoHist site in `/geohist/` subdir"), lines 119-121 (Architecture file map: root hub / 404 / geohist landing rows). Old-domain gate walks AGENTS.md (allowlist at check-no-old-domain.mjs:41 = `['.planning', 'README.md', '.git', 'node_modules']` — AGENTS.md NOT allowlisted, gate-enforced [VERIFIED: scripts/check-no-old-domain.mjs:41]). |
| MIG-07 | `/geohist/privacy.html` stays path-stable — Play Console compliance surface frozen | File path never changes; assets it references (`/geohist/icon.png` lines 20-21) never move. Only candidate edit: footer back-link href (line 72) — open question OQ1 with recommendation. Policy content untouched. |
| MIG-08 | GSC sitemap resubmit + URL inspection done post-deploy (owner console step, runbook section) | `13-RUNBOOK.md` deliverable (console-UI only, 08-RUNBOOK format precedent). CoA doc verified verbatim this session: same-domain path moves are excluded — "just add redirects, and update your sitemaps as appropriate" [VERIFIED quote: support.google.com/webmasters/answer/9370220, fetched 2026-09-14]. |
| MIG-09 | 404 page + all nav/footer links point at the new layout (no dead hub links; key surface stays exactly 178 × 19) | 404 link `href` → `/apps/` with visible text UNCHANGED ("Back to the hub" — smoke-check greps the body for `back to the hub` case-insensitively, [VERIFIED: scripts/smoke-check.sh:49]). Full href repoint matrix (all href-only, zero key changes) in `## Code Examples`. Surface preservation: moving markup verbatim keeps the union at 178 (namespace split 70/13/40/33/18/4 verified from the surface dump this session). |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| URL-layout migration (root↔subdir swap) | Site content tier (hand-authored HTML) | — | Zero build, zero server config; GitHub Pages serves static files as-is (`upload-pages-artifact path: '.'` ships the whole tree). |
| `/geohist/` redirect | Site content tier (meta-refresh-0 stub) | — | GitHub Pages has no server-redirect config; meta refresh 0 s is the documented permanent-redirect primitive for static hosts [CITED: 301-redirects doc]. |
| i18n key-surface preservation | i18n engine tier (`js/i18n.js`, page-agnostic) | CI gate tier (`i18n-keycheck`/`i18n-surface` pages[]) | Engine has zero path awareness; the ONLY page-location coupling lives in the two hard-coded `pages[]` arrays. |
| Gate coverage of the new layout | CI gate tier (3 scripts + package.json glob) | Post-deploy tier (`smoke-check.sh` against live site) | Five lists + star path are the single registration point for page moves. |
| SEO coherence (canonical/og:url/JSON-LD url/sitemap) | Site content tier | External (GSC owner console post-deploy) | Per-page head metadata edits + sitemap entry swap; GSC sees the result after deploy. |
| Hub future-readiness (`/apps/` layout) | Site content tier (`apps/index.html`) | — | Structure anticipates (one real card), never advertises (no placeholders — Out of Scope verbatim). |
| Doc/record sync (AGENTS.md, runbook) | Repo docs tier | CI (old-domain gate enforces AGENTS.md) | MIG-06 pins AGENTS.md to the same commit as the migration. |

## Standard Stack

No new packages are installed — this is a file-migration + gate-repoint phase riding the shipped toolchain.

### Core (existing, pinned in package.json — all already CI-proven)

| Tool | Version (exact) | Purpose in this phase | Why Standard |
|------|-----------------|----------------------|--------------|
| html-validate | 11.12.0 | Lints the new stub + all pages via the repointed glob | Shipped gate; stub verified passing this session |
| linkinator | 8.1.0 | `validate:links` — validates the repointed hrefs incl. `/apps/` | Ignores meta refresh (verified scratch-run this session); apex-host skip set unchanged |
| node built-ins (i18n-keycheck, i18n-surface, check-no-old-domain) | node:fs/path only | Key-surface set-equality + legacy-host gate | Zero-dependency gates; pages[] arrays are the registration point |
| @axe-core/webdriverjs + lighthouse (via a11y-audit.mjs) | 4.13.0 / 13.4.1 | A11y battery over the repointed PAGES list | Shipped gate; local chromedriver cached (153.0.8010.12) |
| bash + curl | system | `smoke-check.sh` post-deploy live checks | Verified available on this machine (bash ✓, curl.exe ✓) |
| GitHub Actions Pages chain | checkout@v7 / configure-pages@v6 / upload-pages-artifact@v5 / deploy-pages@v5 | Deploy of the new layout (path: '.' — ships `/apps/` automatically) | No workflow edit needed this phase [VERIFIED: .github/workflows/deploy.yml:38-46] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Meta-refresh-0 stub at `/geohist/` | HTTP 301/308 | Impossible: Pages serves static files only, no server redirect config [VERIFIED: architecture facts; deploy.yml has no redirect step] |
| Meta refresh stub | JS-only redirect | Out of Scope verbatim: "Google classes as last resort; meta-refresh-0 suffices on Pages"; no-JS safety lost |
| Serving landing at BOTH `/` and `/geohist/` | (canonical band-aid) | Out of Scope verbatim: "Double indexation; stub, never copy" |
| Renaming `hub.*` keys → `apps.*` during the move | Keep namespaces | Out of Scope verbatim: "×19 dictionary churn, zero user benefit" |
| `git restore` for red-gate reverts | sha256 snapshot-copy | Snapshot-copy mandatory: deferred-commit state + Phase-12 uncommitted changes in tree (Phase 10/11 precedent) |

**Installation:** none — zero new packages (see Package Legitimacy Audit).

## Package Legitimacy Audit

> Not applicable this phase: no external packages are installed. The devDependency set is unchanged (html-validate 11.12.0, linkinator 8.1.0, @axe-core/cli 4.13.0, lighthouse 13.4.1, sharp 0.35.4 — all committed + locked since Phase 5, CI-proven). No `npm view` runs needed; no new registry surface.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| (none — no installs this phase) | — | — | — | — | — | — |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

Request flow AFTER the migration (arrows = data/visitor flow):

```
                        ┌──────────────────────────────────────────────┐
 visitor / crawler      │              GitHub Pages (static)           │
        │               │  apex https://geohisttrivia.com              │
        ▼               │  (legacy *.github.io host 301s path-preserved│
   URL requested ───────►   to apex — unchanged, external to repo)      │
                        └──────────────┬───────────────────────────────┘
                                       │
          ┌────────────────────────────┼──────────────────────────────┐
          │                            │                              │
          ▼                            ▼                              ▼
   /  (index.html)            /apps/ (index.html)            /geohist/ (index.html)
   GeoHist LANDING            PORTFOLIO HUB                  META-REFRESH-0 STUB
   hero, proof strip,         brand intro + 1 app card       noindex,follow + canonical /
   OFF rating row, features,  keyed: hub.* (13 keys)         content="0; url=/"
   gallery, FAQ, CTA, about   consent banner + switcher      + <a href="/"> fallback
   keyed: geohist.* (70)                                     zero keys, zero scripts
   consent banner + switcher                                        │
          │                                                         │ meta refresh (0s)
          │   ┌────────────────────────────────────────┐            ▼
          │   │ /geohist/guide.html · contact.html ·   │◄────── visitors/crawlers
          └──►│ changelog.html · privacy.html (FROZEN) │      land on / (landing)
              │ sub-pages stay put; href-only repoints │
              │ keyed: guide.*/contact.*/changelog.*   │
              └────────────────────────────────────────┘

  Page load (any keyed page): i18n.js snapshot → resolve lang → fetch /js/i18n/<lang>.json
  (absolute path — page-location agnostic) → swap. UNCHANGED.
  Submit path (contact page only): consent-gated, contact.js probe → App Check → auth →
  Firestore addDoc. UNTOUCHED (no path dependency on page location).
  Deploy: push → CI validate (html→domain→links→i18n-detect→i18n) → Pages deploy.
  Post-deploy: owner GSC resubmit + URL inspection (13-RUNBOOK); no CoA action.
```

### Target State File Map (all verified against the live tree this session)

| File | Action | Detail |
|------|--------|--------|
| `index.html` | REPLACE body with former `geohist/index.html` (verbatim markup) | canonical → `https://geohisttrivia.com/` (line 8 pattern), og:url → same (line 12 pattern), JSON-LD `"url"` → `/` (line 44 pattern); nav.game href → `/`; nav.faq href → `/#faq`; footer.back href → `/apps/` |
| `apps/index.html` | NEW — former root `index.html` verbatim | canonical + og:url → `https://geohisttrivia.com/apps/`; card CTA href `/geohist/` → `/`; everything else byte-identical (13 hub.* keys, consent banner, switcher slot, OG/Twitter image stays `/geohist/og-image.png`) |
| `geohist/index.html` | REPLACE with stub (self-contained, 404.html pattern) | no i18n.js, no consent.js, no stylesheet, zero keyed nodes — see stub pattern below |
| `geohist/guide.html` | href-only edits | nav.game `/geohist/` → `/`; nav.faq `/geohist/index.html#faq` → `/#faq`; footer.back `/` → `/apps/` |
| `geohist/contact.html` | href-only edits | same three as guide |
| `geohist/changelog.html` | href-only edits | same three as guide |
| `geohist/privacy.html` | ONE candidate href-only edit (OQ1) | footer.back `/` → `/apps/` (line 72); policy content + path untouched |
| `404.html` | href-only edit | hub link href `/` → `/apps/`, visible text "Back to the hub" UNCHANGED (smoke-check grep compat, smoke-check.sh:49) |
| `sitemap.xml` | 2-entry swap | `/geohist/` → `/apps/`; final 6: `/`, `/apps/`, guide, changelog, contact, privacy; no lastmod (convention) |
| `robots.txt` | UNTOUCHED | Sitemap line is path-independent |
| `geohist/* assets` (icon, og-image, badge, 4 WebP) | UNTOUCHED | Moving them breaks frozen privacy.html's icon links ([VERIFIED: geohist/privacy.html:20-21]) |
| `css/base.css`, `js/*` (all 4 scripts), `js/i18n/*.json` ×19 | UNTOUCHED | Engine page-agnostic; 178-key surface preserved by verbatim moves |
| `scripts/i18n-keycheck.mjs` | pages[] repoint + star path repoint | Line 48 array + line 184 `readFileSync(join(repoRoot, 'geohist', 'index.html'))` → root `index.html` |
| `scripts/i18n-surface.mjs` | pages[] repoint | Line 32 mirrors keycheck |
| `scripts/a11y-audit.mjs` | PAGES repoint | `/` stays (now the landing), `{url:'/apps/', slug:'apps'}` replaces the `/geohist/` entry; stub NOT audited (meta refresh would navigate axe to `/`) |
| `scripts/smoke-check.sh` | URL list + comments | Add `$BASE/apps/`; `/` and `/geohist/` 200 expectations survive (stub returns 200); optional stub-content grep; 404 grep unchanged |
| `scripts/check-no-old-domain.mjs` | UNTOUCHED | Path-walk + allowlist; migration introduces no legacy-host literals |
| `scripts/i18n-detect.test.mjs` | UNTOUCHED | Pure engine tests |
| `package.json` | validate:html glob | `html-validate index.html 404.html geohist/*.html apps/index.html` |
| `AGENTS.md` | Layout sync (MIG-06, same commit) | Lines 9, 20, 119-121 (+ optional stale 10-RUNBOOK path at line 79, OQ4) |
| `.github/workflows/deploy.yml` | UNTOUCHED | `path: '.'` ships `/apps/` with zero config [VERIFIED: deploy.yml:41-43] |
| `.planning/phases/13-home-migration/13-RUNBOOK.md` | NEW (docs commit) | GSC post-deploy owner steps; console-UI only |
| `.planning/phases/13-home-migration/red-gate-proof.md` | NEW (evidence) | Both-direction proofs per gate change |

**The single most important structural fact** (milestone research, re-verified): after this migration every Play-launch surface (badge CTA, Tier-1 row, JSON-LD sameAs/offers) concentrates in ONE file — root `index.html` — which is what makes Phase 14's launch kit cheap.

### Pattern 1: The meta-refresh-0 stub (verified passing html-validate + linkinator this session)

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

- `noindex, follow`: keeps the stub URL out of the index; `follow` preserves equity via the anchor. Canonical → `/` is belt-and-suspenders for clients that ignore meta refresh.
- The `<a>` fallback keeps the page no-JS-safe and gives linkinator a real link to validate.
- Google's classification: "Instant meta refresh redirect: Triggers as soon as the page is loaded in a browser. Google Search interprets instant meta refresh redirects as **permanent redirects**." [VERIFIED verbatim quote: developers.google.com/search/docs/crawling-indexing/301-redirects, fetched 2026-09-14, doc last updated 2026-04-14]. Place it in `<head>` per the same doc.
- Verified behaviors this session: `npx html-validate <stub>` → exit 0; linkinator does NOT follow meta refresh (only the `<a>` was scanned); **fragments do NOT survive meta refresh in Chrome 153** (`stub#faq` → target without `#faq`, scroll top — empirical, see State of the Art).
- Keep redirects ≥180 days, ideally ≥1 year [CITED: Google site-move guidance via milestone ARCHITECTURE.md §(f); CoA doc independently: "Maintain the redirects for at least 180 days"] — here the stub costs nothing; keep it indefinitely.

### Pattern 2: One atomic commit (the coupling mechanism)

Both page moves + the stub + every gate-list repoint land in ONE commit. Why it is mechanically forced: if the hub moved to `/apps/` without the landing arriving at root in the same commit, the keycheck surface would drop from 178 to 165 (13 missing `hub.*` keys) and all 19 dictionaries would red. Conversely the old `pages[]` arrays with the new layout red with "extra keys". One revert = clean rollback (Phase-8 precedent: migration commit c72b3a2, one atomic commit, CI validate+deploy green — [VERIFIED: 08-RUNBOOK.md:173]).

Red-gate protocol per gate change (both directions, snapshot-copy restore, recorded in `red-gate-proof.md`):

| Gate | Direction 1 (old state fails new coverage) | Direction 2 (new gate catches a real mutation) |
|------|-------------------------------------------|------------------------------------------------|
| i18n-keycheck pages[] (+ i18n-surface, same array) | Temporarily revert pages[] to old paths while layout is new → FAIL (missing 13 hub keys / surface 165 ≠ 178) → re-apply → PASS | Rename the star SVG class in root `index.html` → FAIL naming the NEW path → restore hash-verified → PASS |
| keycheck star-uniqueness path (line 184) | (covered by direction 2 above — proves the gate now reads root index.html) | Flip-compat (expects GREEN by construction): remove `hidden` + set score span `0.0`→`4.5` → PASS; owner's future flip cannot red the gate (Phase-11 precedent cycle (d)) |
| validate:html glob | Inject invalid HTML (unclosed tag) into `apps/index.html` with the OLD glob → falsely PASSES (proves gap) | Same mutation with NEW glob → FAIL → restore → PASS |
| a11y-audit PAGES | Inject an axe/LH-relevant mutation (duplicate `h2`) into root `index.html` → FAIL; ~10-15 min/cycle (5 pages × axe + Lighthouse) — budget for it | restore hash-verified → PASS |
| smoke-check.sh (live-targeted) | Run the NEW list against the LIVE pre-migration site → `/apps/` returns 404 → FAIL printed (proves the list covers the new layout) | Post-deploy: same list → ALL PASS |

`check-no-old-domain.mjs` needs no red-gate (gate logic untouched; full-chain `npm run validate` green is the pre-ship proof).

### Recommended execution shape

```
.planning/phases/13-home-migration/
├── 13-RUNBOOK.md          # GSC owner steps (docs, parallel-safe to author)
├── red-gate-proof.md      # both-direction proofs (during Wave 1)
└── 13-UAT.md              # post-deploy verification incl. owner GSC checkpoint
```

- **Wave 1 (single plan):** the atomic migration commit — all pages + gates + AGENTS.md + red-gate proofs + full local `npm run validate` green. No parallel code plans: everything couples through the 178-key gate.
- **Wave 2 / parallel docs plan:** `13-RUNBOOK.md` authoring (no code dependency). Its LIVE steps (GSC resubmit, URL inspection, Rich Results check on `/`) execute post-deploy as owner console actions recorded in `13-UAT.md`.
- Pre-ship preconditions: reconcile local↔origin/main divergence + land Phase 12's deferred commits first (see Environment/git state — the tree is NOT clean and the branch is diverged).

### Anti-Patterns to Avoid

- **Splitting the two page moves across commits** — keycheck set-equality reds at 165 ≠ 178; canonicals half-migrated. One commit.
- **Serving the landing at both `/` and `/geohist/`** with a canonical band-aid — the exact duplicate-URL class canonicalization exists to fix; the stub is strictly better (Out of Scope verbatim).
- **Renaming `hub.*`/`geohist.*` keys to match new URLs** — namespaces are role conventions; renaming = ×19-dictionary churn for zero benefit (Out of Scope verbatim).
- **JS-only redirect on the stub** — violates no-JS safety; meta-refresh + `<a>` fallback is the pattern (Out of Scope verbatim).
- **Deleting or emptying `geohist/`** — sub-pages, screenshots, og-image, icon, badge live there; only `index.html` swaps body.
- **Moving `/geohist/` assets** — breaks frozen privacy.html's `/geohist/icon.png` references [VERIFIED: geohist/privacy.html:20-21] and every page's absolute asset URLs.
- **Re-filing or canceling the CoA** — internal moves are doc-excluded from the tool; would restart the 180-day clock for nothing.
- **Adding i18n keys during migration** (e.g., an "Apps" nav link) — any key change is a ×19-dictionary atomic edit of a different risk class; ship the frozen 178 surface.
- **Auditing the stub with axe** — meta refresh navigates the driver to `/`; the PAGES list tracks real content pages only.
- **Updating pages without updating all five gate lists + the star path** — each script silently audits the wrong set; the star check would red loudly on the wrong file (0 SVGs found in the stub).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Redirect on a static host | Server-config redirects, .htaccess, JS redirect chains | `<meta http-equiv="refresh" content="0; url=/">` in `<head>` + `<a>` fallback | Pages has no redirect config; Google classifies instant meta refresh as permanent [VERIFIED quote fetched]; JS-only is doc-last-resort + Out of Scope |
| Key-surface inventory | Ad-hoc grep/count scripts to "check the dictionaries" | `node scripts/i18n-keycheck.mjs` + `node scripts/i18n-surface.mjs --summary` | The gates already assert exact 178 × 19 set-equality and name missing/extra keys per file |
| Link checking after repoints | Manual href click-throughs | `npm run validate:links` (linkinator, recursive) | Same gate validates the new `/apps/` dir + repointed hrefs; apex-host skip set unchanged |
| Sitemap generation | SSG/plugin sitemap builders | Hand-edit the 9-line `sitemap.xml` (6 `<loc>`, no lastmod convention) | Zero-build constraint; 6 entries; hand-rolled is the shipped convention |
| Gate coverage proof | "Trust me, the list covers it" | Red-gate both directions + `red-gate-proof.md` record | Repo convention; fail-closed verification |
| Restore during proofs | `git restore` (dirty tree) | sha256 snapshot-copy via Copy-Item, hash-verified per cycle | Deferred-commit state + Phase-12 uncommitted files make `git restore` unusable (Phase 10/11 precedent) |

**Key insight:** this site's whole maintenance model is "gates make drift loud." A migration that touches page placement is safe exactly to the degree that every gate list is repointed and *proven* repointed — the gates, not vigilance, are the safety net.

## Runtime State Inventory

> Required: this is a migration phase. The canonical question: after every repo file is updated, what runtime systems still have the old layout cached, stored, or registered?

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Firestore `messages` collection — stores message content only, no page-path data; contact page path UNCHANGED → nothing affected. GA4 historical events carry `page: '/geohist/'` for old `play_badge_click` fires ([VERIFIED: js/consent.js:129 `logEventSafe('play_badge_click', { page: location.pathname });`]) — new fires report `/`; reporting-only, no data migration. Visitor `localStorage['persano.lang']` is path-agnostic — survives the move. | None (data migration) / GA4 dashboard note belongs to Phase 14 (LKIT-04) — do NOT re-bucket or edit history |
| Live service config | GSC Domain property: sitemap already submitted (Phase 8) — resubmit after deploy (MIG-08 runbook). Play Console privacy-URL field → `/geohist/privacy.html` — UNCHANGED by design (path-stable). Firebase Auth authorized domains + API-key HTTP-referrer restrictions are HOST-based (`geohisttrivia.com` + legacy entries) — `/apps/` is a same-host path, zero console change. GSC CoA window (until ~2027-03): leave untouched — no refile, no cancel. | GSC sitemap resubmit + URL inspection (owner console, post-deploy); everything else: none |
| OS-registered state | None — verified: no Task Scheduler/pm2/launchd/systemd surface in this project (static site + dev scripts) | None |
| Secrets/env vars | None — no secrets in repo (public-by-design Firebase config only); no env-var names reference page paths | None |
| Build artifacts | None — zero build step; `node_modules/` untouched (no dependency changes); no egg-info/binaries | None |
| Git/hosting runtime state | Legacy `*.github.io` host 301 chain — external hosting fact, permanent, unchanged; it path-preserves `/geohist/*` requests to the apex where the stub/real pages handle them. **Working tree NOT clean** (Phase 12's deploy.yml/.gitignore/AGENTS.md/WINDOWS.md/config.json edits + 3 untracked 12-* docs uncommitted) and **local branch diverged from origin/main** (9 ahead / 1 behind; the behind-commit is the PR #6 merge of the same branch) | Reconcile + land Phase 12's deferred commits BEFORE the Phase 13 atomic commit; snapshot-copy restore during proofs |

**Nothing found in category:** OS-registered state, secrets/env vars, build artifacts — explicitly verified as above.

## Common Pitfalls

### Pitfall 1: Splitting the atomic commit
**What goes wrong:** hub moved but landing not yet at root (or vice versa) → keycheck surface 165 ≠ 178 → all 19 dictionaries red; canonicals half-migrated.
**Why it happens:** treating "two file moves" as two tasks/commits.
**How to avoid:** one commit contains both moves + stub + hrefs + sitemap + all gate lists + star path + 404 + AGENTS.md (MIG-06).
**Warning signs:** any intermediate `npm run validate` red during the sequence — intermediate states in the working tree are fine ONLY because the final state is committed atomically; the gates must be green on the final state before ship.

### Pitfall 2: Forgetting the 6th hardcode — the star-check path
**What goes wrong:** `i18n-keycheck.mjs:184` reads `geohist/index.html` as "the landing"; after the swap it reads the STUB (0 SVGs) → gate fails loudly with "0 proof-row-star SVG(s)" — red CI for the wrong reason.
**Why it happens:** the star check lives outside the `pages` array; list-repoint tasks miss it.
**How to avoid:** explicit task item: repoint line 184 to root `index.html`; red-gate the star path both directions (Phase-11 cycle style).
**Warning signs:** keycheck FAIL naming star uniqueness right after the move.

### Pitfall 3: Auditing or keying the stub
**What goes wrong:** including the stub in a11y PAGES → axe's driver instantly navigates to `/` (double-scan, misleading results); adding data-i18n nodes to the stub → dictionary drift.
**Why it happens:** treating the stub as "just another page."
**How to avoid:** stub = zero keys, zero scripts, not in a11y PAGES; optionally in keycheck pages[] (extracts 0 keys — see OQ2) but never elsewhere.
**Warning signs:** a11y report showing `/geohist/` with landing-identical results.

### Pitfall 4: Breaking the frozen privacy page's dependencies
**What goes wrong:** moving `/geohist/` assets (icon/og-image/screenshots) → privacy.html's icon `<link>`s and every page's absolute asset URLs break; editing privacy's policy content mid-Play-review.
**Why it happens:** assets "feel like" they belong at the root now.
**How to avoid:** assets stay in `/geohist/`; privacy.html gets at most the ONE href-only footer edit (OQ1); policy text untouched.
**Warning signs:** any diff inside `geohist/privacy.html` beyond one `href` attribute.

### Pitfall 5: Sitemap stub listing / dead sitemap URLs
**What goes wrong:** listing `/geohist/` (now a redirect) in the sitemap — sitemaps are for canonical URLs; Google flags redirected rows.
**How to avoid:** final set is exactly `/`, `/apps/`, guide, changelog, contact, privacy (6 entries — AGENTS.md line 36's "6 apex `<loc>` entries" claim stays true).
**Warning signs:** sitemap entry count ≠ 6 or a `<loc>` ending in a redirect.

### Pitfall 6: 404 text vs smoke-check grep coupling
**What goes wrong:** rewriting the 404's visible text → `smoke-check.sh:49` greps `back to the hub` on the live 404 body → false FAIL.
**How to avoid:** change ONLY the `href` (`/` → `/apps/`), keep "Back to the hub" text — the label stays truthful because `/apps/` IS the hub (MIG-09 satisfied).
**Warning signs:** any 404.html text edit.

### Pitfall 7: Assume fragments survive the stub refresh (they don't)
**What goes wrong:** frozen privacy.html's FAQ nav link `/geohist/index.html#faq` refreshes to `/` at the TOP of the landing, not at the FAQ section — one cosmetic degradation on one frozen link.
**Why it happens:** meta refresh does NOT carry the original fragment (empirically verified in Chrome 153 headless this session: final URL lost `#faq`, scrollY 0; unlike HTTP Location redirects, no fragment forwarding was observed).
**How to avoid:** accept it (zero broken paths — the link resolves); do NOT add hash-preserving JS to the stub (JS-redirect out of scope + racy against the declarative refresh).
**Warning signs:** UAT expectation "FAQ link from privacy lands on FAQ section" — set the expectation to "lands on the landing."

### Pitfall 8: Ship-blocked by pre-existing git state
**What goes wrong:** Phase 13's atomic commit lands on a diverged branch atop unlanded Phase 12 changes → remote fast-forward impossible, rollback story broken.
**Why it happens:** local branch `gsd/phase-11-audit-debt-closure` is 9 ahead / 1 behind origin/main; deploy.yml/.gitignore/AGENTS.md/WINDOWS.md/config.json modifications + 3 untracked 12-* docs still in the working tree (verified `git status` this session).
**How to avoid:** plan precondition task: reconcile local↔origin/main (fetch/rebase or bridge fast-forward per the Git Data API convention) + land Phase 12's deferred commits BEFORE the migration commit.
**Warning signs:** `git status --porcelain` non-empty or `git rev-list HEAD..origin/main --count` > 0 at Wave 1 start.

### Pitfall 9: Gate-list updates without red-gate proof
**What goes wrong:** a repointed list still silently audits the wrong set (e.g., smoke-check never re-run against a live site that lacks `/apps/`).
**Why it happens:** list edits look "obviously right."
**How to avoid:** the repo convention is mutate → FAIL → restore hash-verified → PASS, both directions, recorded — no exceptions for "obvious" changes.
**Warning signs:** red-gate-proof.md missing a gate touched in the commit.

## Code Examples

All "current" quotes below were read from the live tree **this session** with the Read tool; line numbers are exact. Target values are the prescribed new states.

### 1. `scripts/i18n-keycheck.mjs` — pages array (line 48, verbatim)

```js
const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];
```

**Target:**

```js
const pages = ['index.html', join('apps', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];
```

(The stub is dropped from the list — it is unkeyed forever; keeping `geohist/index.html` in the list is also gate-safe since it extracts 0 keys, but the dropped form keeps the "keyed pages" semantics truthful — see OQ2.)

### 2. `scripts/i18n-keycheck.mjs` — star-uniqueness path (line 184, verbatim)

```js
  const landing = readFileSync(join(repoRoot, 'geohist', 'index.html'), 'utf8');
```

**Target:**

```js
  const landing = readFileSync(join(repoRoot, 'index.html'), 'utf8');
```

### 3. `scripts/i18n-surface.mjs` — pages array (line 32, verbatim)

```js
const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];
```

**Target:** identical replacement as §1 (same array, same rationale). Header comment (lines 5-7) mentions "the five keyed pages (hub /index.html, /geohist/index.html, …)" — update the parenthetical to the new layout.

### 4. `scripts/a11y-audit.mjs` — PAGES (lines 59-65, verbatim)

```js
const PAGES = [
  { url: '/', slug: 'root' },
  { url: '/geohist/', slug: 'geohist' },
  { url: '/geohist/guide.html', slug: 'geohist-guide' },
  { url: '/geohist/contact.html', slug: 'geohist-contact' },
  { url: '/geohist/privacy.html', slug: 'geohist-privacy' },
];
```

**Target:**

```js
const PAGES = [
  { url: '/', slug: 'root' },
  { url: '/apps/', slug: 'apps' },
  { url: '/geohist/guide.html', slug: 'geohist-guide' },
  { url: '/geohist/contact.html', slug: 'geohist-contact' },
  { url: '/geohist/privacy.html', slug: 'geohist-privacy' },
];
```

(The local static server resolves `/apps/` → `apps/index.html` — directory-to-index resolution verified at a11y-audit.mjs:104-106. `/geohist/` is dropped: a meta-refresh-0 page navigates the driver to `/` mid-scan. Changelog is absent today and stays absent — same 5-URL shape.)

### 5. `package.json` — validate:html glob (line 6, verbatim)

```json
    "validate:html": "html-validate index.html 404.html geohist/*.html",
```

**Target:**

```json
    "validate:html": "html-validate index.html 404.html geohist/*.html apps/index.html",
```

(`geohist/*.html` continues to cover the stub + guide + contact + changelog + privacy.)

### 6. `scripts/smoke-check.sh` — live URL list (lines 25-36, verbatim)

```bash
for u in \
  "$BASE/" \
  "$BASE/geohist/contact.html" \
  "$BASE/geohist/privacy.html" \
  "$BASE/app-ads.txt" \
  "$BASE/google7da873f4e9609872.html" \
  "$BASE/geohist/" \
  "$BASE/geohist/guide.html" \
  "$BASE/geohist/changelog.html" \
  "$BASE/sitemap.xml" \
  "$BASE/robots.txt" \
  "$BASE/geohist/og-image.png" ; do
  expect_status "$u" 200
done
```

**Target:** add `"$BASE/apps/"` to the list (all existing rows survive: `/` now serves the landing → 200; `/geohist/` serves the stub → 200; everything else unchanged). Optionally add a stub-content assertion (`curl -s "$BASE/geohist/" | grep -qi "has moved"`). Update the stale layout comments (lines 21-24). The 404 grep (line 49, verbatim `if ! curl -s "$URL" | grep -qi "back to the hub"; then`) stays UNTOUCHED — matched by keeping the 404 text.

### 7. `sitemap.xml` (lines 2-8, verbatim entries)

```xml
  <url><loc>https://geohisttrivia.com/</loc></url>
  <url><loc>https://geohisttrivia.com/geohist/</loc></url>
  <url><loc>https://geohisttrivia.com/geohist/guide.html</loc></url>
  <url><loc>https://geohisttrivia.com/geohist/changelog.html</loc></url>
  <url><loc>https://geohisttrivia.com/geohist/contact.html</loc></url>
  <url><loc>https://geohisttrivia.com/geohist/privacy.html</loc></url>
```

**Target:** row 2 `…/geohist/` → `…/apps/`; all other rows unchanged. Final 6: `/`, `/apps/`, guide, changelog, contact, privacy.

### 8. `404.html` — hub link (line 20, verbatim)

```html
    <p><a href="/">Back to the hub</a> · <a href="/geohist/privacy.html">Privacy policy</a></p>
```

**Target:** `href="/apps/"` on the first anchor; text and second anchor unchanged.

### 9. `index.html` (hub) — the values that change when it becomes `apps/index.html`

Verbatim current (root `index.html`):
- line 8: `<link rel="canonical" href="https://geohisttrivia.com/">` → **target** `href="https://geohisttrivia.com/apps/"`
- line 12: `<meta property="og:url" content="https://geohisttrivia.com/">` → **target** `content="https://geohisttrivia.com/apps/"`
- line 38: `<a href="/geohist/" data-i18n="hub.card.cta">Learn more</a>` → **target** `href="/"`
- footer lines 44-45 (`/geohist/privacy.html`, `/geohist/contact.html`): unchanged
- og:image lines 13/19 (`https://geohisttrivia.com/geohist/og-image.png`): unchanged (asset stays)

### 10. `geohist/index.html` (landing) — the values that change when it becomes root `index.html`

Verbatim current:
- line 8: `<link rel="canonical" href="https://geohisttrivia.com/geohist/">` → **target** `https://geohisttrivia.com/`
- line 12: `<meta property="og:url" content="https://geohisttrivia.com/geohist/">` → **target** `https://geohisttrivia.com/`
- line 44 (JSON-LD): `"url": "https://geohisttrivia.com/geohist/",` → **target** `"https://geohisttrivia.com/"`
- line 44-51 JSON-LD `image`/`screenshot` absolute URLs (`/geohist/icon.png`, `/geohist/screenshots/*.webp`): unchanged
- line 68: `<a href="/geohist/" data-i18n="geohist.nav.game">Game</a>` → **target** `href="/"`
- line 70: `<a href="/geohist/index.html#faq" data-i18n="geohist.nav.faq">FAQ</a>` → **target** `href="/#faq"`
- line 232: `<li><a href="/" data-i18n="geohist.footer.back">Back to hub</a></li>` → **target** `href="/apps/"`
- nav guide/changelog/privacy links (lines 69, 71-72): unchanged (pages keep their paths)

### 11. guide / contact / changelog — href-only repoints (current values verified)

Per page, three anchors change (example line numbers from `geohist/contact.html`; guide/changelog have the identical anchor set):
- line 32: `<a href="/geohist/" data-i18n="contact.nav.game">Game</a>` → **target** `href="/"`
- line 34: `<a href="/geohist/index.html#faq" data-i18n="contact.nav.faq">FAQ</a>` → **target** `href="/#faq"`
- line 88: `<li><a href="/" data-i18n="contact.footer.back">Back to hub</a></li>` → **target** `href="/apps/"`
- All other nav/footer anchors (`/geohist/guide.html`, `/geohist/changelog.html`, `/geohist/privacy.html`, self-references): unchanged
- canonical + og:url (each page lines 8/12): unchanged (paths unchanged)

Note: these nav/footer repoints go slightly beyond the milestone ARCHITECTURE.md's file-map summary (which listed only `footer.back` for these pages) — they are still href-only, zero-key edits, and they satisfy MIG-09's "all nav/footer links point at the new layout" more literally (nav "Game" would otherwise hop through the stub). Recommended.

### 12. `geohist/privacy.html` — the ONE candidate edit (OQ1)

Verbatim current (line 72): `<li><a href="/">Back to hub</a></li>` → **target** `href="/apps/"` (label stays truthful). Its nav (lines 28-32) stays UNTOUCHED: `/geohist/` (stub — resolves), `/geohist/guide.html` + `/geohist/changelog.html` (real pages — resolve), `/geohist/index.html#faq` (stub — resolves; fragment lands at top, Pitfall 7), itself. Policy content byte-untouched.

### 13. i18n surface — the verified numbers

Verified this session by running the shipped gates:

```
i18n-keycheck: PASS — <dict>.json exactly covers the 178-key live surface   (×19)
i18n-surface: 178 keys across 5 pages
```

Namespace split from the surface dump (keys per first segment): `geohist.*` 70 · `hub.*` 13 · `guide.*` 40 · `contact.*` 33 · `changelog.*` 18 · shared `consent.banner.*` 4 → **178 total**, matching the milestone ARCHITECTURE.md claim. Shared keys (`consent.*`) must keep identical EN text on every page that carries them (`i18n-surface.mjs` warns on cross-page text mismatch, docstring lines 20-22) — the migration changes no text, so zero warnings.

### 14. `scripts/check-no-old-domain.mjs` — allowlist (line 41, verbatim; untouched by this phase)

```js
const ALLOW = new Set(['.planning', 'README.md', '.git', 'node_modules']);
```

AGENTS.md is gate-enforced (not allowlisted) — which is exactly why MIG-06 pins its layout sync to the same commit.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server-side 301 as the only "real" redirect | Instant (0 s) meta refresh classified by Google as a **permanent redirect** | Long-standing, doc confirmed 2026-04-14 [VERIFIED quote fetched 2026-09-14] | The stub is first-class for SEO signal transfer on a static host |
| JS redirects as a redirect method | Last resort only — "if you set a JavaScript redirect, Google might never see it" | Same doc | Confirms Out-of-Scope row; stub stays JS-free |
| HTTP redirects forward the original fragment when the target lacks one | **Meta refresh does NOT** (Chrome 153 empirical: fragment lost, lands at top) | Verified this session | Frozen privacy page's `#faq` link degrades cosmetically; accepted (Pitfall 7) |
| CoA tool for any site restructure | Doc-excluded for same-domain path moves: "just add redirects, and update your sitemaps as appropriate" | Verbatim quote fetched 2026-09-14 [VERIFIED] | No CoA action for this phase; active 180-day window untouched |

**Deprecated/outdated:** nothing in the shipped stack is deprecated; no dependency or approach changes in this phase.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The single href-only footer edit on `geohist/privacy.html` (line 72, `/` → `/apps/`) is permitted under the "FROZEN / path-stable" decision — the freeze targets the PATH and policy content, not this nav href | Open Question 1 / Code Example 12 | If owner intends a zero-byte frozen file: leave privacy.html 100% untouched; its footer link then points at the landing (`/`) labeled "Back to hub" — mildly mislabeled, zero broken paths. Needs owner/planner confirmation before execution. |
| A2 | `noindex, follow` + canonical on the stub is the right head metadata set (milestone ARCHITECTURE.md's choice) | Pattern 1 | Alternative readings exist for noindex-on-redirect; worst case Google keeps the stub URL briefly longer in the index — cosmetic. |
| A3 | Meta-refresh fragment loss behaves the same on all evergreen browsers (verified ONLY on Chrome 153 headless, this machine) | Pitfall 7 / State of the Art | Other browsers may forward the fragment (better behavior); worst case is the same cosmetic top-of-page landing. |
| A4 | GitHub Pages serves `apps/index.html` at `/apps/` (directory index resolution), matching the local audit server's behavior | Standard Stack / a11y PAGES | If `/apps/` didn't resolve, smoke-check would catch it post-deploy (fail-loud, pre-Play). |
| A5 | The research seam's `classify-confidence` returns LOW for the webfetch provider even with `--verified`; the two Google-doc claims are tagged VERIFIED because they carry verbatim quotes from the official documents fetched this session (the tag definition in the role spec: tool-confirmed AND authoritative source) | Sources | Tagging-strictness quibble only; quotes are inline for checking. |

## Open Questions

1. **privacy.html footer href edit — allowed under "FROZEN"?** (A1)
   - What we know: STATE says "never move it" (a path rule); REQUIREMENTS Out-of-Scope row targets MOVING the file; milestone ARCHITECTURE.md prescribes a footer.back href-only edit.
   - What's unclear: whether the owner wants a literally byte-frozen file mid-Play-review.
   - Recommendation: do the href-only edit (keeps the "Back to hub" label truthful; content untouched); add a `checkpoint:human-verify`-style owner note in the plan if the planner wants belt-and-suspenders. Fallback (zero edits) documented in A1.

2. **Stub in or out of the keycheck/surface `pages[]` arrays?**
   - What we know: keeping `geohist/index.html` (the stub) extracts 0 keys — harmless; the milestone doc blesses both forms.
   - What's unclear: none technically — pure semantics.
   - Recommendation: DROP it from both arrays (arrays = keyed pages; the star-path repoint already handles the "landing is now at root" fact).

3. **Extended nav repoints on guide/contact/changelog (nav.game → `/`, nav.faq → `/#faq`) beyond the milestone doc's footer-only list?**
   - What we know: href-only, zero key changes; MIG-09 says "all nav/footer links point at the new layout".
   - Recommendation: yes — include them (Code Example 11). Avoids every sub-page's "Game" nav hopping through the stub.

4. **AGENTS.md stale 10-RUNBOOK path (line 79) — fix in the MIG-06 same-commit edit?**
   - What we know: AGENTS.md line 79 references `.planning/phases/10-gated-social-proof/10-RUNBOOK.md`; that dir was archived to `.planning/milestones/v2.0-phases/10-gated-social-proof/` [VERIFIED: directory listing this session]. Phase 14 (LKIT-04) owns the runbook's supersession note.
   - Recommendation: yes — a path-accuracy correction riding the already-mandatory AGENTS.md edit; doc-only, no gate impact.

5. **Phase 12's unlanded state — who clears the runway?**
   - What we know: working tree carries Phase 12's deploy.yml/.gitignore/AGENTS.md/WINDOWS.md/config.json changes + 3 untracked docs; local branch is 9 ahead / 1 behind origin/main (the behind-commit is PR #6's merge of this same branch). Phase 13's atomic commit must land on a clean, reconciled tree.
   - Recommendation: Wave 0 precondition task (reconcile + land Phase 12 deferred commits), before any migration edit; the red-gate restore method (snapshot-copy) covers the interim.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| node | All gate scripts | ✓ | v26.5.1 local (CI: Node 24 via setup-node) | — |
| npm | validate chain + npx tooling | ✓ | 11.17.0 | — |
| bash + curl | smoke-check.sh (post-deploy) | ✓ / ✓ (curl.exe) | system | PowerShell Invoke-WebRequest equivalent if bash regresses |
| Chrome + cached chromedriver | a11y-audit red-gate cycles | ✓ | Chrome 153.0.8010.37 / driver 153.0.8010.12 | SeleniumManager auto-resolve (flaky — cached-first is already the shipped logic) |
| html-validate / linkinator (npx) | validate:html / validate:links | ✓ | 11.12.0 / 8.1.0 (exact-pinned) | — |
| git | atomic commit + ship | ✓ | with divergence (Pitfall 8) | Git Data API bridge convention (strict fast-forward) |

**Missing dependencies with no fallback:** none.

**Missing dependencies with fallback:** none.

**Git/ship state (pre-existing, must clear before Wave 1):** working tree NOT clean — `M .github/workflows/deploy.yml, .gitignore, .planning/WINDOWS.md, .planning/config.json, AGENTS.md` + untracked `12-01-SUMMARY.md, 12-RECORDS.md, 12-UAT.md` (Phase 12 deferred commits, verified `git status --porcelain` this session). Branch `gsd/phase-11-audit-debt-closure` ahead 9 / behind 1 vs origin/main (behind-commit = `1e52a87` PR #6 merge). Reconcile per repo convention (never force-push) before the atomic migration commit.

## Sources

### Primary (HIGH confidence — official docs fetched this session, verbatim quotes in body)

- developers.google.com/search/docs/crawling-indexing/301-redirects — fetched 2026-09-14 (doc last updated 2026-04-14). Verbatim: "Instant meta refresh redirect: Triggers as soon as the page is loaded in a browser. Google Search interprets instant meta refresh redirects as permanent redirects."; "Only use JavaScript redirects if you can't do server-side or meta refresh"; example pattern `<meta http-equiv="refresh" content="0; url=https://example.com/newlocation">` placed in `<head>`.
- support.google.com/webmasters/answer/9370220 (Change of Address tool) — fetched 2026-09-14. Verbatim: "Moving some pages from one location to another within your site: For example, from example.com/oldpath/... to example.com/newpath/...). In this case, just add redirects, and update your sitemaps as appropriate."; "You will see these notifications for 180 days."; "Maintain the redirects for at least 180 days."

### Primary (HIGH confidence — in-repo, read this session with line citations)

- Repo files (all cited inline): `index.html`, `geohist/index.html`, `geohist/guide.html`, `geohist/contact.html`, `geohist/changelog.html`, `geohist/privacy.html`, `404.html`, `sitemap.xml`, `robots.txt`, `package.json`, `.github/workflows/deploy.yml`, `.htmlvalidate.json`, `.gitignore`, `AGENTS.md`, `js/i18n.js`, `js/consent.js`, `scripts/i18n-keycheck.mjs`, `scripts/i18n-surface.mjs`, `scripts/a11y-audit.mjs`, `scripts/smoke-check.sh`, `scripts/check-no-old-domain.mjs`
- `.planning/REQUIREMENTS.md` (MIG-01..09 + Out of Scope), `.planning/STATE.md` (decisions lines 73-76), `.planning/ROADMAP.md` (Phase 13 section), `.planning/AGENTS.md` context via repo AGENTS.md
- `.planning/research/ARCHITECTURE.md` (2026-09-11 milestone integration research — target file map, stub pattern, build order; re-verified element-by-element this session)
- Gate baselines executed this session: `node scripts/i18n-keycheck.mjs` → PASS ×19 (178 keys); `node scripts/i18n-surface.mjs --summary` → "178 keys across 5 pages"; namespace split 70/13/40/33/18/4 computed from the surface dump

### Secondary (HIGH confidence — empirical, executed this session)

- Meta-refresh fragment test: headless Chrome 153 + chromedriver 153.0.8010.12 (selenium-webdriver, cached driver), temp stub+target — `stub.html#faq` → final URL without `#faq`, `scrollY` 0 (fragment lost); plain stub → clean navigation
- `npx html-validate <stub>` on the exact stub pattern → exit 0 (recommended ruleset)
- `npx linkinator <scratch-dir> --recurse` with stub + target → 1 link scanned (the `<a>`), meta refresh not followed
- `git status` / `git log` / `git fetch` probes → working-tree + divergence facts above

### Tertiary (format precedents)

- `.planning/milestones/v2.0-phases/08-custom-domain-migration/08-RUNBOOK.md` — runbook format + GSC section shape + Phase-8 one-commit precedent (migration commit c72b3a2)
- `.planning/milestones/v2.0-phases/11-…/red-gate-proof.md` — red-gate record format, snapshot-copy restore precedent, star-check flip-compat cycles
- `.planning/phases/12-cleanup-batch/12-RESEARCH.md` — phase-research format for gate-free phases in this repo

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new deps; existing toolchain versions exact-pinned and CI-proven
- Architecture/target state: HIGH — every file/line verified live this session; milestone doc re-validated element-by-element
- SEO/redirect behavior: HIGH — official Google docs fetched verbatim this session + empirical Chrome test
- Pitfalls: HIGH — all grounded in shipped gate code read this session + repo precedents
- Open sub-decisions (A1-OQ5): MEDIUM — flagged for planner/owner confirmation, recommendations given

**Research date:** 2026-09-14
**Valid until:** 2026-10-14 (stable — zero-dependency phase; re-verify only if the tree changes underneath, e.g., Phase 12 ship lands)

