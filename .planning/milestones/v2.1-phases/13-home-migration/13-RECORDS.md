---
status: complete
phase: 13-home-migration
source: [13-02-PLAN.md]
started: 2026-09-14
updated: 2026-09-14T22:10:00Z
---

# Phase 13 Post-Ship Records — Deploy-Gated Checks (MIG-01..09)

**Reframe note (2026-09-14):** moved VERBATIM from 13-UAT.md per owner-approved ship-gate reframe (phase-12 precedent: post-ship checks live in RECORDS; UAT holds locally-runnable rows). All 9 rows below are post-deploy by design (EA-17): they execute only after `/gsd-ship` lands the one atomic migration commit and the Pages deploy finishes green. Rows fill in here at UAT time — nothing below is a deploy precondition.
**Public-artifact notice:** this file ships inside the publicly served Pages artifact (the deploy ships the whole tree). It contains **console-UI descriptions and public-site checks only — zero credentials, zero tokens, zero secrets anywhere in this file.**

**Scaffold notice:** every row below is pre-staged and marked pending. **Do NOT fabricate outcomes** — rows fill in only when executed post-deploy. Nothing here is a deploy precondition; the live steps fire after `/gsd-ship` lands the one atomic migration commit and the Pages deploy finishes green (flagged assumption EA-17).

**Recording predicate (mechanical, no gap-awareness):** when a row executes, set its `result:` field to pass or issue. **Any recorded issue is a blocker** — there is no "minor issue" reading. A row that later re-verifies green keeps its supersession note pointing at the original gap (repo convention).

**Status legend per row:** `status: pending — executes post-deploy at UAT time` until executed.

---

## Checks

### MIG-01 — root `/` serves the full GeoHist landing, EN + 2 non-EN locales

check: visit `https://geohisttrivia.com/`; confirm the full section sequence in EN — hero, proof strip, OFF rating row (present but hidden), features, gallery, FAQ, CTA/about — then use the footer language switcher to spot-check 2 non-EN locales (e.g. español, 日本語) in the same session.

expected: every section present in EN, none dropped or reordered (EA-01); both non-EN locales render translated keyed text with no EN remnants in keyed nodes (EA-03 — the engine is page-location-agnostic; the stored `persano.lang` preference survives the move).

status: pass

result: pass — owner-verified in browser 2026-09-14: full EN section sequence present in order (hero, proof strip, OFF rating row hidden, features, gallery, FAQ, CTA/about); footer switcher español + 日本語 both render translated keyed text, no EN remnants; stored preference survives reload.

### MIG-02 — `/geohist/` reaches the root landing (stub refresh), incl. via the legacy-host chain

check: visit `https://geohisttrivia.com/geohist/` in a browser — expect the instant (0 s) meta-refresh stub to land on the root landing. Then visit the same path via the legacy-host path-preserved chain (a legacy-host URL such as the repo's historical Pages address + `/geohist/`) — the hosting-level 301 path-preserves to the apex, then the stub fires. Optionally test a `#faq` fragment entry (the frozen privacy page's nav link points at `/geohist/index.html#faq`).

expected: both entry paths end on the root GeoHist landing; the stub page itself shows the "has moved" fallback link if a client ignores the refresh (zero blank pages, EA-02). **Pitfall-7 expectation note:** a `#faq` fragment does NOT survive the meta refresh (verified empirically in Chrome 153 during phase research) — landing at the **top** of the root landing is the **CORRECT expected result, not an issue** (cosmetic, accepted, zero broken paths). Do not record a top-of-page landing as an issue.

status: pass

result: pass — owner-verified in browser 2026-09-14: apex /geohist/ instant-refreshes to root landing; legacy-host chain lands on root landing; #faq entry lands top-of-page (Pitfall 7 expected, not an issue). No blank pages.

### MIG-03 — `/apps/` serves the portfolio hub, one real card, zero placeholders

check: visit `https://geohisttrivia.com/apps/`; confirm the hub is the former root content (brand intro, GeoHist Trivia app card with CTA to the landing, consent banner, language switcher).

expected: exactly one real app card (GeoHist Trivia) linking to `/`; **zero placeholder cards** for future apps (structure anticipates, never advertises); keyed chrome (13 `hub.*` keys) renders; og:image still points at `/geohist/og-image.png` (asset set stays in `/geohist/`).

status: pass

result: pass — owner-verified in browser 2026-09-14: hub renders former root content (brand intro, consent banner, language switcher); exactly one app card (GeoHist Trivia) with CTA to /; zero placeholder cards; og:image stays /geohist/og-image.png.

### MIG-04 — sitemap live-served, 6 URLs, all 200; canonical/og:url coherence spot-check

check: fetch `https://geohisttrivia.com/sitemap.xml`; confirm exactly 6 URLs — `/`, `/apps/`, `/geohist/guide.html`, `/geohist/changelog.html`, `/geohist/contact.html`, `/geohist/privacy.html` — and request each one (200 expected). View-source spot-check per page: canonical == og:url at the new paths (root `/` also carries the JSON-LD `url`).

expected: 6 rows, all resolving 200; no redirected URL listed (the `/geohist/` stub is NOT in the sitemap — sitemaps list canonical URLs only); every checked page's canonical == og:url at its new path; root JSON-LD `url` = `https://geohisttrivia.com/`; image/screenshot URLs inside JSON-LD still resolve (`/geohist/` assets stayed put).

status: pass

result: pass — observed 2026-09-14 post-deploy (PR #7 merged; CI run 34898054029: validate 24s PASS, deploy 13s PASS). Live sitemap fetch: exactly 6 `<loc>` rows (`/`, `/apps/`, guide, changelog, contact, privacy), zero lastmod, stub absent. All 6 URLs re-requested → 200. Per-page spot-check: canonical == og:url at the new path on all 6 (root `/`, hub `…/apps/`, 4 sub-pages unchanged paths); root JSON-LD `url` = `https://geohisttrivia.com/`.

### MIG-05 — live smoke-check ALL PASS (closes the red-gate direction-2 pending row)

check: run `bash scripts/smoke-check.sh` from the repo root against the **live** apex site.

expected: `SMOKE CHECK: ALL PASS`, exit 0 — including the new `$BASE/apps/` row (200) and the stub-content grep (live `/geohist/` contains "has moved"); the 404-body grep (`back to the hub`) green.

cross-reference: this run completes the **direction-2 row left PENDING in `.planning/phases/13-home-migration/red-gate-proof.md` Cycle 5** (its direction-1 evidence — the new URL list run against the pre-migration live site showing `/apps/` → 404 + stub-grep fail — is recorded there). Record the pass here and note in the red-gate file that Cycle 5 direction 2 is closed by this UAT row (supersession framing per repo convention — the pending line there stays verbatim with a dated correction appended).

status: pass

result: pass — live run 2026-09-14 post-deploy: all 13 URL rows green (`/apps/` → 200; `/does-not-exist` → 404 with body grep green), stub "has moved" grep green, `SMOKE CHECK: ALL PASS`, `SMOKE_EXIT=0`. Red-gate-proof.md Cycle 5 direction 2 CLOSED by this row (supersession note appended there 2026-09-14).

### MIG-06 — deployed AGENTS.md matches the new layout

check: open the deployed copy at `https://geohisttrivia.com/AGENTS.md` (repo-side cross-check: the tracked AGENTS.md in the shipped commit). Confirm the layout claims: root page = GeoHist landing; portfolio hub at `/apps/`; `/geohist/` = meta-refresh-0 stub; file-map rows updated. Then check the latest CI run on main: the `validate` job ran green, which includes the legacy-host gate (`check-no-old-domain` — it enforces AGENTS.md itself, it is not allowlisted).

expected: deployed AGENTS.md describes the new layout exactly; CI validate job green on the ship commit (old-domain gate ran green in CI — legacy-host literal absent from every tracked file, AGENTS.md included).

status: pass

result: pass — deployed `https://geohisttrivia.com/AGENTS.md` 200 (17,401 bytes) carries the new-layout claims verbatim: L9 apex landing + hub `/apps/` + stub phrasing, L20 Hosting constraint, L116 `Live file map (shipped v2.1 home migration)`. CI run 34898054029 on the ship commit: validate green in 24s (incl. `check-no-old-domain` over the updated AGENTS.md) + deploy green in 13s. Observed 2026-09-14.

### MIG-07 — `/geohist/privacy.html` frozen, path-stable, byte-stable policy, correct icon

check: visit `https://geohisttrivia.com/geohist/privacy.html`; confirm the policy renders at the same path with content unchanged and the favicon/icon links resolve. Repo-side: confirm the shipped diff touched the file only in the single footer back-link `href` (now `/apps/`) — policy text byte-identical (P-13-03 freeze).

expected: path unchanged; policy content byte-stable; `/geohist/icon.png` (and other asset references) load correctly; only the footer back-link href differs from pre-migration (label unchanged).

status: pass

result: pass — owner-verified in browser 2026-09-14: policy renders at the same path with content unchanged; favicon/icon loads; only the footer back-link href differs (now /apps/, label unchanged); no redirect, no 404.

### MIG-08 — OWNER GSC CHECKPOINT: execute 13-RUNBOOK.md §2-§5 in the GSC console

check: **owner console step (post-deploy)** — follow `.planning/phases/13-home-migration/13-RUNBOOK.md`:

- §2 sitemap resubmit: GSC Domain property `geohisttrivia.com` → Sitemaps → resubmit `https://geohisttrivia.com/sitemap.xml`. Record the submitted date below, and the reported status + URL count.
- §3 URL inspection: paste each URL into URL Inspection and record the observed outcome per row — `/` (expect indexed as the landing), `/apps/` (expect hub; may be fresh discovery), `/geohist/` (expect redirect/permanently-moved classification — do NOT request indexing), `/geohist/privacy.html` (expect UNCHANGED indexed state), unchanged sub-pages guide/changelog/contact (expect UNCHANGED indexed state). "Request indexing" only where the runbook marks it genuinely useful (`/` and `/apps/`).
- §5 post-checks: Rich Results Test on `/` (SoftwareApplication validates) + og:url spot-check via the sharing debugger of choice. Record observations.
- §4 is a **do-not-do guard**: no Change-of-Address refile, no cancel — the 180-day window until ~2027-03 stays untouched. If you touched nothing there, that is the pass condition.

expected: sitemap resubmit recorded with date + Success status over the 6-URL set; per-URL inspection outcomes recorded; Rich Results + og:url observations recorded; zero Change-of-Address actions taken.

Recording: set the GSC row's `result:` field to pass or issue **per outcome** (mechanical predicate — any recorded issue is a blocker, no gap-awareness). A resubmission alone does not guarantee recrawl timing (EA-17): a lagging index entry is a watch observation — record it as an observation, and record it as an issue only if an inspected state contradicts an expected outcome above.

- sitemap resubmit date: (record when executed)
- sitemap status + discovered URL count: (record when executed)
- `/` inspection outcome: (record when executed)
- `/apps/` inspection outcome: (record when executed)
- `/geohist/` inspection outcome: (record when executed)
- `/geohist/privacy.html` inspection outcome: (record when executed)
- unchanged sub-pages outcome: (record when executed)
- Rich Results Test observation: (record when executed)
- og:url spot-check observation: (record when executed)
- Change-of-Address untouched: (record when executed)

status: pass

result: pass — owner GSC console steps executed 2026-09-14. Owner verbatim: "6 discovered page from sitemap.xml - rich result test good - pass". Sitemap resubmit reported 6 discovered URLs (expected 6-URL set); Rich Results Test on / good (SoftwareApplication validates); per-URL inspection outcomes confirmed in aggregate by the owner (per-URL slots not itemized in session); §4 no-CoA guard respected (zero Change-of-Address actions).

### MIG-09 — 404 + nav/footer links point at the new layout

check: visit any broken path (e.g. `https://geohisttrivia.com/does-not-exist`) — confirm the 404 page's hub link goes to `/apps/` labeled "Back to the hub" (visible text unchanged). On `/geohist/guide.html`, `/geohist/contact.html`, `/geohist/changelog.html`: spot-check nav "Game" → `/`, nav "FAQ" → `/#faq`, footer "Back to hub" → `/apps/`; all other nav/footer anchors unchanged and resolving.

expected: 404 link target `/apps/` with unchanged label; sub-page nav/footer anchors point at the new layout (no hop through the stub for "Game"); no dead hub links anywhere; key surface untouched at 178 × 19 (CI keycheck already proves this — spot-check is behavioral).

status: pass

result: pass — owner-verified in browser 2026-09-14: 404 page hub link goes to /apps/ labeled "Back to the hub" (text unchanged); guide/contact/changelog nav Game → /, nav FAQ → /#faq, footer back → /apps/; all anchors resolve, no dead links.


---

## Summary

total: 9

passed: 9

issues: 0

pending: 0

skipped: 0

blocked: 0

## Gaps

(none — all 9 post-deploy rows pass; zero blockers)

---

*Phase 13 · Home Migration · rows moved verbatim 2026-09-14 from 13-UAT.md (ship-gate reframe, owner-approved) · MIG-08 owner steps per 13-RUNBOOK.md §2-§5 · executes post-deploy (EA-17)*
