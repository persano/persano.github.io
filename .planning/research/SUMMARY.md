# Project Research Summary

**Project:** Persano — Personal Apps Hub + GeoHist Trivia Site (v2.1 "Play Launch + Home Migration")
**Domain:** Brownfield static-site additions on a shipped, CI-gated GitHub Pages site (zero-build, locked architecture)
**Researched:** 2026-09-11
**Confidence:** HIGH (all four researchers same-day verified against official vendor docs — Google Search Central, GSC Help, Play Console Help, npm docs, actions/setup-node, GitHub Docs — plus direct live-repo file reads)

## Executive Summary

v2.1 is a **zero-new-dependencies milestone** on the shipped v2.0 stack: hand-authored HTML5/CSS3/vanilla JS, single-URL keyed i18n (178 keys × 19 dictionaries), Firebase 12.18.0 CDN pins, GitHub Actions validate→deploy. All four feature areas (home migration, launch kit, App Check evidence helper, cleanup batch) are file-level and doc-level work. The only "stack change" in the entire milestone is restoring two lines in `deploy.yml` (`npm ci` + `cache: npm`) — and the lockfile is already committed and verified consistent with `package.json` (all 5 devDeps exact-pinned match, `LOCKFILE CONSISTENT`).

The home migration's core finding is the **redirect mechanic decision**: GitHub Pages offers no arbitrary-path server 301s, but Google's official redirect doc classifies **instant `meta refresh` (0 s) as a permanent redirect** — the first-party-sanctioned substitute. The migration is ONE atomic commit: root `index.html` becomes the GeoHist landing, hub moves verbatim to `apps/index.html` (all 13 `hub.*` keys unchanged — namespaces are role conventions, not URL-bound, so **zero dictionary edits across all 19 files**), `geohist/index.html` becomes a meta-refresh-0 stub with `noindex, follow`, and all five hardcoded gate page-lists update in the same commit. Two moves in one commit is mechanically forced: `i18n-keycheck.mjs` asserts exact 178-key set equality — splitting the moves drops the surface to 165 and reds all 19 dictionaries. The old root URL needs no stub (it is *reused*, not deleted); the active 180-day GSC Change-of-Address window is **untouched** — CoA is domain-scoped only, and same-domain path moves are doc-excluded ("just add redirects, and update your sitemaps").

The launch kit is cheap because of one structural fact: **after migration, every Play-launch surface concentrates in root `index.html`** — and all three Play-link surfaces (badge CTA, JSON-LD `sameAs`, Tier-1 row) already carry the real package URL (D-22), so launch day is verifications, not edits. The only code edit is the owner-gated Tier-1 rating-row flip (2 edits per 10-RUNBOOK). Top risks: (1) moving `geohist/privacy.html` while the app sits in Play review — the Play Console privacy field points there and is invisible to every repo gate; freeze it; (2) old `/geohist/*` paths 404ing and breaking the legacy-host 301 chain — stub, don't delete; (3) the launch-day "rationalization flip" adding `aggregateRating` from Play data — barred by Google review-snippet policy **even with real data**, permanently OFF; (4) the five hardcoded gate page-lists silently skipping the new layout — one task, red-gate proved both directions.

## Key Findings

### Recommended Stack

**Zero new dependencies.** Every v2.1 feature is file-level work on the shipped stack. Full detail in [STACK.md](STACK.md).

**Core technologies (all unchanged):**
- Hand-authored HTML5/CSS3/vanilla ES2020+ — all pages; zero build, no SSG/framework
- `css/base.css` + `js/i18n.js` + 19 JSON dictionaries — untouched; engine is page-agnostic (absolute `/js/i18n/` fetch is move-safe), keyed nodes move verbatim
- Firebase JS SDK 12.18.0 gstatic ESM CDN — untouched; contact form stays at `/geohist/contact.html`
- GitHub Pages apex custom domain + legacy-host 301 — platform redirect unchanged; meta-refresh-0 is the in-site redirect primitive
- GitHub Actions (checkout@v7 … deploy-pages@v5, Node 24) — one edit: `npm ci` + `cache: npm` in validate job (lockfile committed, v3, verified consistent)

**New file-level additions (not libraries):** `/geohist/` meta-refresh-0 stub, `apps/index.html` (hub verbatim), rewritten root `index.html` (landing), sitemap edit, launch runbook + swap-ready inventory, JSON-LD `offers` refresh-check spec, App Check evidence helper doc, workflow cleanup.

**Version notes:** Node 24/npm 11 ↔ lockfileVersion 3 verified compatible; html-validate glob must gain `apps/index.html`; linkinator needs no `--skip` changes (stub's fallback link is same-site); keep redirect chains ≤3 hops (legacy-host path + stub = exactly 3, at Google's advised limit — accepted residual).

### Expected Features

Full classification in [FEATURES.md](FEATURES.md).

**Must have (table stakes):**
- **A — Home migration:** root = GeoHist landing (P1); meta-refresh-0 stub at `/geohist/` (P1); hub at `/apps/` with keyed-chrome parity (P1); i18n atomic key move — surface stays exactly 178 × 19 in the SAME commit (P1); sitemap/canonical coherence + GSC resubmit, no CoA (P1); 404/footer repoints (P1); no visible future-app placeholders (P1)
- **B — Launch kit:** owner runbook with pinned flip order — privacy-URL field (pre-submission) → Play-link 200 verify → website field → Tier-1 rating flip (P1); swap-ready inventory table baked into the runbook (P1)
- **C — Evidence helper:** Firestore submission-counting walkthrough (unit = successful submissions, never console request rows) + category-split reading guide (P2)
- **D — Cleanup:** `npm ci` + `cache: npm` restore (P2); zh variant confirmation vs app `strings.xml` (P3); Urdu Nastaliq real-device check (P3)

**Should have (differentiators):**
- Rating-value refresh convention restated in the runbook (keeps the number honest)
- Red-gate/smoke ritual per flip (proven v2.0 pattern)
- Weekly evidence log template (one-row ritual, no automation)
- Package-id assertion gate: every `play.google.com` URL in tracked files must contain `details?id=com.persano.geohisttrivia` — passes pre- AND post-launch (Pitfall 8 prevention)

**Defer / gated (not phases — owner-gated events):**
- Tier-1 rating row flip — trigger: real visible Play rating (10-RUNBOOK §1)
- FIRE-10 App Check enforcement flip — trigger: 09-RUNBOOK §5 gate (≥30 submissions + ready-to-enforce), post-v2.1 acceptable
- GSC sitemap resubmit + URL Inspection — trigger: migration deploy live
- App #2 subdir + hub card — trigger: next app actually ships (v3+)

**Anti-features (refuse these):** moving `privacy.html` (breaks Play Console field); full landing duplicate at both `/` and `/geohist/` (double indexation); renaming `hub.*` → `apps.*` keys (×19 churn, zero benefit); JS-only redirects; `aggregateRating` from Play data (policy violation even when real); automated rating fetch/scraping; CoA refiling; coming-soon placeholder cards; CLI counting scripts with service-account credentials; `lastmod` in sitemap.

### Architecture Approach

Full target-state file map, integration points, and build order in [ARCHITECTURE.md](ARCHITECTURE.md). The v2.0 architecture is locked and untouched: i18n engine, consent, contact/App Check flows, old-domain gate all ride through unchanged — the migration touches markup URLs only, **zero JS-module changes expected**. Key mechanics:

1. **The migration is ONE atomic commit** — pages + stub + href repoints + canonical/og:url/JSON-LD `url` + sitemap + both `pages[]` scripts + star-path repoint + a11y `PAGES` + `validate:html` glob + smoke-check + 404 + AGENTS.md parity. One commit = one revert = rollback (Phase-8 precedent).
2. **Sub-pages stay in `/geohist/`** — only the landing moves. `/geohist/privacy.html` is path-stable and Play-Console-safe forever.
3. **Gate registration is the hidden work** — `i18n-keycheck.mjs` (incl. line-184 star-gate path), `i18n-surface.mjs`, `a11y-audit.mjs`, `smoke-check.sh`, `validate:html` glob all hardcode the v2.0 layout. Red-gate proof both directions per repo convention.
4. **Sitemap final set (6, no lastmod, never list the stub):** `/`, `/apps/`, 4 × `/geohist/*.html` sub-pages.
5. **Stub shape:** `content="0; url=/"` + canonical-to-`/` + `noindex, follow` + plain `<a>` fallback; html-validate green; linkinator validates the anchor.

### Critical Pitfalls

Full 9-pitfall catalog with warning signs and recovery in [PITFALLS.md](PITFALLS.md). Top 5:

1. **Privacy-URL coupling** — never move `geohist/privacy.html` this milestone; it is the Play review compliance surface, invisible to all repo gates. Freeze rule stated in plan.
2. **Old-path 404s break the legacy-host 301 chain** — legacy URL → platform 301 → apex `/geohist/` → 404 transfers nothing. Stub every moved path with meta-refresh-0; never delete the dir (sub-pages, og-image, screenshots live there).
3. **Double indexation** — stub, never copy; one canonical per page; sitemap lists final URLs only.
4. **The five hardcoded gate page-lists** — update all in the migration commit; a new keyed page missed by keycheck silently exits the 178-key invariant. Red-gate proof.
5. **The `aggregateRating` rationalization flip** — Software App IS a supported review-snippet type, but "don't aggregate reviews from other websites" bars Play data even when real. Runbook hard-cites the policy; JSON-LD refresh-check is verification only.

Also: **GSC CoA misapplication** — do NOT file/touch CoA for a same-domain path move (would endanger the active 180-day window); **Play link swap invisible to CI** (linkinator skips play.google.com — add the package-id assertion gate); **npm ci restore** — see gap note below on lockfile state.

## Implications for Roadmap

Suggested 4-phase structure (docs-only work runs small; the migration is the structural core):

### Phase 1: Cleanup Batch (CI hygiene + device checks)
**Rationale:** FEATURES dependency notes say D1 (lockfile/`npm ci` restore) should precede heavy phases — every subsequent validate cycle gets faster and reproducible. Zero risk, independent, warmup for the gate-heavy migration.
**Delivers:** `deploy.yml` with `npm ci` + `cache: npm` (CI-verified green), zh variant confirmation documented, Urdu Nastaliq owner device check recorded.
**Addresses:** D1, D2, D3 of FEATURES.md.
**Avoids:** Pitfall 9 (supply-chain hole of unpinned transitives re-resolved every CI run).

### Phase 2: Home Migration (one atomic commit + GSC)
**Rationale:** The structural core; launch kit depends on its file paths; Play launch day must see the apex root landing. Everything ships in one commit — splitting the two page moves is mechanically impossible without reding keycheck.
**Delivers:** Root = landing; `apps/index.html` hub; `/geohist/` stub; all href/canonical/og:url/JSON-LD/sitemap/404/nav updates; all five gate page-list updates + red-gate proofs; AGENTS.md layout parity in the same commit; post-deploy GSC sitemap resubmit + smoke-check.
**Addresses:** All of feature area A.
**Avoids:** Pitfalls 1, 2, 3, 4, 5, 6 (freeze privacy.html; stub-not-copy; annotation inventory; gate-list registration; no-CoA guard).

### Phase 3: Launch Kit (runbook + swap-ready inventory + link gate)
**Rationale:** Must follow Phase 2 (file paths land in root `index.html`) and must exist BEFORE the Play listing goes live. Doc-only + one small CI gate; no runtime surface.
**Delivers:** Owner runbook (flip order: privacy-URL field → link 200-verify → website field → Tier-1 flip), swap-ready inventory table (surfaces 1–8, file:line pinned), package-id assertion gate with red-gate proof, 10-RUNBOOK supersession note (star/0.0 edits now in root index.html), JSON-LD offers refresh-check step.
**Addresses:** All of feature area B.
**Avoids:** Pitfalls 7 (aggregateRating — policy citation in runbook) and 8 (package-id gate).

### Phase 4: App Check Evidence Helper (console-UI doc)
**Rationale:** Zero dependencies on 1–3; can even run parallel with Phase 3. Pairs naturally with the launch kit (same owner-runbook format).
**Delivers:** Submission-counting walkthrough (unit = successful submissions; 30 = floor not trigger), category-split glance page, weekly ritual template, `appcheck_token_failure` trend-reading notes (24h lag, pihole caveat), ready-to-enforce pointer (flip stays §6 owner-only).
**Addresses:** All of feature area C.
**Avoids:** Secrets-in-`.planning/` security mistakes (console-UI instructions only).

### Phase Ordering Rationale

- **D1 → heavy phases** (explicit FEATURES dependency note); **A → B** (launch kit references root file paths); **C free-floating** (doc-only, zero deps). Gated flips (rating row, FIRE-10) are owner-gated *events*, not phases — the roadmap should carry them as watch items, not phases.
- **One-commit migration is non-negotiable:** keycheck set-equality (178) forces both page moves + all gate registrations into a single commit; this is also the rollback unit.
- **Ship migration before Play launch:** reviewers and Play-driven visitors see the apex root landing; the Play privacy field points at a URL that never moves.
- Anti-pattern list (ARCHITECTURE.md §Anti-Patterns, 8 items) should be copied into the Phase 2 plan as review checklist.

### Research Flags

**No phase needs `/gsd-plan-phase --research-phase`.** All four researchers same-day verified mechanics against official first-party docs and live repo reads — the research phase of this milestone is effectively done. Planning notes:

- **Phase 2 (Migration):** well-documented, fully mapped target state (stub HTML pre-drafted, file map enumerated). Planning burden is verification design (red-gate proofs, smoke-check assertions), not research.
- **Phase 1 (Cleanup):** standard patterns; `npm ci` + `cache: npm` mechanics doc-verified.
- **Phase 3 (Launch Kit):** mostly standard; one micro-flag — the Play Console privacy-URL field doc page was bot-blocked during research; field flow rests on repo precedent (D-70 record, HIGH). If the console UI differs at runbook time, a 5-minute check resolves it.
- **Phase 4 (Evidence helper):** standard; rides 09-RUNBOOK §4 semantics verbatim.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM (self-tagged) / HIGH (substantively) | Researcher tagged MEDIUM due to a provider-blind confidence seam; every claim was same-day verified against official vendor docs with cross-checked overlaps (CoA ↔ site-move; npm ci ↔ setup-node) plus programmatic repo verification. Treat as HIGH on substance. |
| Features | HIGH | Official Google/Play Console docs fetched this session + shipped-repo runbook precedent. Portfolio-hub `/apps/` pattern is MEDIUM (synthesized industry practice, no single authoritative doc) — low-stakes, convention only. |
| Architecture | HIGH | Every structural claim read from live repo source (key census, script line numbers, gate paths); external SEO claims verified against official Google docs. |
| Pitfalls | HIGH for mechanics (first-party docs quoted verbatim); MEDIUM for empirical behaviors | Empirical: unpublished-Play-URL not-found behavior, setup-node error wording, GSC re-file semantics. LOW items flagged for phase-time re-verification. |

**Overall confidence:** HIGH — unusually strong provenance: same-day official-doc verification plus direct repo reads across all four files.

### Gaps to Address

- **⚠️ Lockfile-state discrepancy between researchers:** STACK.md verified same-day that `package-lock.json` IS tracked and consistent (`git ls-files` → tracked; programmatic check → `LOCKFILE CONSISTENT`); PITFALLS.md Pitfall 9 still reasons from "no lockfile committed" (stale assumption). **Resolve at Phase 1 planning:** re-run `git ls-files package-lock.json` + the consistency check; if consistent, Pitfall 9 collapses to a one-edit workflow task with CI verification (no lockfile-generation dance needed). Also confirm the `deploy.yml` "no package-lock.json exists yet" NOTE comment is stale and delete it.
- **Play Console privacy-URL field flow** — doc page bot-blocked; field existence/flow from repo precedent (D-70). Verify in console when writing the Phase 3 runbook.
- **Urdu Nastaliq real-device rendering** — system fallback may render Naskh-like or clip diacritics; owner device check pending (Phase 1 deliverable). Verify `dir="rtl"` + line-height on `ur`, not just `ar`.
- **zh variant mapping** — confirm Simplified-only choice against app `strings.xml` (`values-zh-rCN`); do NOT add zh-TW dictionaries unprompted (×19 → ×20 surface explosion).
- **Empirical Play behaviors** (MEDIUM): unpublished package URL → not-found page; Play Console website-field tolerance — moot here since the field will point at `/` post-migration (a real page, not a redirect).
- **GA4 reporting note** — `play_badge_click {page}` changes `/geohist/` → `/` post-migration; note in launch runbook so the dashboard isn't misread.
- **Optional roadmap decision:** `Disallow: /.planning/` in robots.txt (keeps files served, blocks indexing) — deliberate decision, not a drive-by; pair with the secrets-hygiene review.

## Sources

Aggregated from all four research files; all web sources fetched live 2026-09-11.

### Primary (HIGH confidence — first-party official docs, quoted same-day)
- Google Search Central — Redirects and Google Search (developers.google.com/search/docs/crawling-indexing/301-redirects) — meta refresh 0s = permanent class; JS last resort
- Google Search Central — Site move with URL changes (…/site-move-with-url-changes, upd. 2026-08-20) — same-domain path moves excluded from CoA; sitemap mechanics; soft-404 warning
- Google Search Console Help — Change of Address tool (support.google.com/webmasters/answer/9370220) — domain-only scope, 180-day mechanics
- Google Search Central — Software App structured data (…/structured-data/software-app, upd. 2026-09-08) — `offers.price: 0`, required properties
- Google Search Central — Review snippet structured data (upd. 2026-09-08) — "Don't aggregate reviews or ratings from other websites"
- Play Console Help — Create and set up your app (support.google.com/googleplay/android-developer/answer/113469) — store-listing fields, contact details, managed publishing
- npm Docs — npm ci (docs.npmjs.com/cli/v11/commands/npm-ci) — lockfile requirement, frozen installs, mismatch = hard error
- actions/setup-node@v7 — advanced usage + README — `cache: npm` lockfile contract
- GitHub Docs — Custom 404 page for Pages — single root 404.html, no per-directory 404s
- MDN — `<meta>` element — `http-equiv="refresh"` Baseline status

### Repo verification (HIGH — direct reads, 2026-09-11)
- All 6 keyed pages (canonical/og:url/JSON-LD lines), `js/i18n.js` (page-agnostic engine, `DICT_URL_PREFIX` absolute), 19-dictionary key census (70+13+40+33+18+4 = 178), `scripts/i18n-keycheck.mjs` (line 48 pages[], line 184 star-gate path), `i18n-surface.mjs` (line 32), `a11y-audit.mjs`, `smoke-check.sh`, `check-no-old-domain.mjs`, `sitemap.xml` (6 URLs), `404.html`, `package.json` (5 exact pins), `deploy.yml` (npm install, Node 24), `git ls-files package-lock.json` + programmatic lockfile↔package.json consistency check (`LOCKFILE CONSISTENT`), grep of all asset paths (site-absolute)
- `.planning/` precedent (HIGH — curated v2.0 records): 10-RUNBOOK (Tier-1 flip, gates), 09-RUNBOOK §4–§6 (counting unit, category semantics, evidence gate), Phase 8 migration records, D-22 (real package URL in all three Play-link surfaces), D-70 (Play privacy-field record)

### Secondary (MEDIUM — empirical, verify at phase time)
- Unpublished Play package URL → not-found page; setup-node missing-lockfile error wording; GSC re-file/cancel semantics (treat re-filing as forbidden rather than learning by experiment)
- Portfolio-hub subdir-per-app pattern (synthesized industry practice)

### Tertiary (LOW — flagged for phase-time re-verification)
- Windows/Android Urdu Nastaliq fallback rendering; zh variant mapping vs app `strings.xml`

---
*Research completed: 2026-09-11*
*Ready for roadmap: yes*
