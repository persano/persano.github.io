# Phase 13 Owner Runbook — GSC Post-Deploy Steps (Sitemap Resubmit + URL Inspection)

**Audience:** Santiago (owner). Every step below is a Google-Search-Console or browser action against a public Google tool — no registrar, no repo, no Firebase work. Agent-owned steps are listed for cross-reference only (§1) — you do nothing for those.

**Public-artifact notice:** this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.**

**When to execute (EA-17):** these steps are pre-staged here and fire **POST-DEPLOY** — after `/gsd-ship` lands the one atomic migration commit and the Pages deploy finishes green. They are recorded at UAT time in `13-UAT.md` (MIG-08 row) with the mechanical pass/issue predicate. Nothing in this runbook is a deploy precondition.

**Status legend:** ⬜ TODO (yours, post-deploy) · ✅ done (agent-verified this phase) · 🔍 soft check (nice-to-have, non-blocking)

---

## §1 · Prerequisites — all three must be true before you open GSC

| # | Prerequisite | How you confirm | Status |
|---|--------------|-----------------|--------|
| 1 | The ONE atomic migration commit has landed via `/gsd-ship` (deferred-commit mode: the migration sits uncommitted until ship; one commit carries both page moves + stub + gates + sitemap + AGENTS.md) | The ship session confirms the push; the commit contains `apps/index.html` (new) + the repointed root landing + stub | ⬜ |
| 2 | The GitHub Actions Pages deploy finished green (validate job → deploy job) | Repo → Actions tab → latest run on main: `validate` ✓ then `deploy` ✓ | ⬜ |
| 3 | Live smoke-check passes **ALL rows**: `bash scripts/smoke-check.sh` run from the repo root against the live apex | Terminal output ends `SMOKE CHECK: ALL PASS`; exit 0 | ⬜ |

Cross-reference for row 3: this is the **post-deploy direction-2 row** that `red-gate-proof.md` Cycle 5 left explicitly **PENDING** (its direction-1 FAIL evidence — the new URL list run against the pre-migration live site, `/apps/` → 404 + stub-content grep fail — is already recorded there). The ALL-PASS run closes it; the record lands in `13-UAT.md` MIG-05.

What changed once the deploy lands (so you know what "right" looks like):

- `/` serves the **GeoHist landing** (hero, proof strip, OFF rating row, features, gallery, FAQ, CTA).
- `/apps/` serves the **portfolio hub** (former root content; one real app card, zero placeholder cards).
- `/geohist/` is a **meta-refresh-0 stub** that sends visitors to `/` (noindex, follow; visible link fallback).
- `/geohist/privacy.html` is **unchanged** — frozen Play Console compliance surface, same path, same policy.
- `sitemap.xml` now lists 6 URLs with `/apps/` replacing the old landing path.

🔍 Soft check: clear browser cache / hard-reload when first checking the new layout (the Phase 8 runbook noted caching after hosting changes).

---

## §2 · GSC sitemap resubmit

GSC → Domain property `geohisttrivia.com` → **Sitemaps** → resubmit `https://geohisttrivia.com/sitemap.xml`.

1. Open **search.google.com/search-console** with the Google account that owns the Domain property (created in Phase 8).
2. Left menu → **Sitemaps**.
3. The sitemap was first submitted at the domain migration (Phase 8) — it is listed there already. Re-enter `https://geohisttrivia.com/sitemap.xml` in the submission field and click the submit button (the form resubmits an existing sitemap in place).
4. **Expected:** GSC lists the sitemap with a `Success` status and the **6-URL set** — `/`, `/apps/`, `/geohist/guide.html`, `/geohist/changelog.html`, `/geohist/contact.html`, `/geohist/privacy.html`. **No redirected URL appears** — the `/geohist/` stub is deliberately NOT in the sitemap (sitemaps list canonical URLs only; a redirect row would be flagged by Google).
5. **Record the submitted date** in `13-UAT.md` (MIG-08 row). Discovery/processing timing after the resubmit is Google-side and varies — that is exactly why the URL-inspection section (§3) exists: **a resubmission alone does not guarantee recrawl timing** (flagged assumption EA-17 — never assume it does).

---

## §3 · URL inspection (GSC → **URL Inspection**, the top search bar)

Inspect each URL one at a time (paste the full URL into the inspection bar) and record the observed outcome per URL in `13-UAT.md` MIG-08. Set the row's `result:` field to pass or issue per the mechanical predicate in that file (any recorded issue is a blocker — no gap-awareness).

| # | URL | Expected outcome | Request indexing? |
|---|-----|------------------|-------------------|
| 1 | `https://geohisttrivia.com/` | Indexed as the **GeoHist landing** (hero/features/FAQ content; canonical `/`). If the cached/inspected snapshot still shows the old hub content, that is the pre-deploy index catching up | **Yes** — genuinely useful here |
| 2 | `https://geohisttrivia.com/apps/` | The **portfolio hub** — a newly-meaningful URL at its own path; it may have never been indexed as a standalone page yet (expect "URL is not on Google" or fresh discovery) | **Yes** — genuinely useful here |
| 3 | `https://geohisttrivia.com/geohist/` | Recognized as **redirecting / permanently moved** — Google classifies an instant (0 s) meta refresh as a permanent redirect, so the stub should report redirect/moved handling, not indexable content | **NO — do not request indexing.** The stub must LEAVE the index; requesting would work against that |
| 4 | `https://geohisttrivia.com/geohist/privacy.html` | **UNCHANGED indexed state** — the path is stable (Play Console compliance surface, frozen), nothing about the page changed | No action |
| 5 | Unchanged sub-pages: `/geohist/guide.html`, `/geohist/changelog.html`, `/geohist/contact.html` | **UNCHANGED indexed state** — paths and canonicals unchanged; only nav/footer link targets were repointed in the same commit | No action |

Notes:

- "Request indexing" only where marked genuinely useful (`/` and `/apps/`). The stub (row 3) must never get an indexing request.
- Rows 4-5 are *expectation guards*: if inspection shows a changed/degraded state for any unchanged page, record it as an issue — do not rationalize it.
- Lagging index entries (old hub content cached at `/` for a while) are a **watch item**, not an automatic fail — but they are recorded as observations in `13-UAT.md` MIG-08, and any row you record as an issue is a blocker per the mechanical predicate.

---

## §4 · Change-of-Address — DO NOT refile or cancel (explicit no-CoA section)

**A Change-of-Address refile is PROHIBITED for this migration** (phase prohibition P-13-04; STATE locked decision).

Why, verbatim from Google's Change-of-Address documentation (support.google.com/webmasters/answer/9370220, fetched during phase research 2026-09-14):

> "Moving some pages from one location to another within your site: For example, from example.com/oldpath/... to example.com/newpath/...). In this case, **just add redirects, and update your sitemaps as appropriate**."

Same-domain path moves are doc-**excluded** from the tool — this migration (landing → `/`, hub → `/apps/`, stub at `/geohist/`) is exactly that class. The redirects are the meta-refresh-0 stub + the hosting-level path-preserved 301s; the sitemap update is §2. That is the complete documented treatment.

The **existing** Change-of-Address — filed at Phase 8 for the legacy-host → apex domain move — is active: its **180-day signal-forwarding window runs until ~2027-03**. It must stay **untouched**:

- **No refile** — doc-excluded for same-domain path moves, and a refile would restart the 180-day clock for nothing.
- **No cancel** — canceling would drop active signal forwarding to the apex while the legacy-host 301 chain still routes old-URL visitors.

**There is nothing to click in this section.** If the property dashboard shows the existing move status, leave it exactly as is. This section is a do-not-do guard, not an action.

---

## §5 · Post-checks (record observations in `13-UAT.md` MIG-08)

1. **Rich Results Test on `/`** — open `https://search.google.com/test/rich-results`, enter `https://geohisttrivia.com/`, run the test. **Expected:** the SoftwareApplication structured data (JSON-LD) validates with no new errors; the landing carries SoftwareApplication + MobileApplication markup with its `url` now pointing at `/`. (🔍 It is also a live-rendering cross-check of the new root layout as Googlebot sees it.)
2. **og:url spot-check** — paste the landing URL into the sharing debugger of your choice for the platform you care about. **Expected:** the rendered preview shows the landing's `og:url` (`https://geohisttrivia.com/`) and `og:image` (which intentionally stays `/geohist/og-image.png` — the asset set stays in `/geohist/` so the frozen privacy page's references keep resolving). Social-platform crawler caches refresh on their own schedule — a stale preview is a soft observation, not a fail.
3. Record both observations in `13-UAT.md` MIG-08.

---

*Phase 13 · Home Migration · runbook authored 2026-09-14 by plan 13-02 (Task 1) · live steps execute post-deploy, recorded via 13-UAT.md (EA-17) · no Change-of-Address action, ever, for this migration (P-13-04)*
