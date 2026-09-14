# Feature Research

**Domain:** Brownfield static-site feature research — v2.1 "Play Launch + Home Migration" (home migration, launch kit, App Check evidence helper, cleanup)
**Researched:** 2026-09-11
**Confidence:** HIGH overall (official Google/Play Console docs fetched this session + shipped-repo runbook precedent; portfolio-hub structure pattern is MEDIUM — synthesized industry practice, no single authoritative doc)

## Feature Landscape

Four feature areas. Each requirement below is classified **Table Stakes** (users/owner expect it; missing = broken), **Differentiator** (valued, not expected), or **Anti-Feature** (looks good, causes harm — build the alternative instead). Complexity is measured against this repo's locked architecture: zero-build HTML/CSS/vanilla JS, single-URL keyed i18n (19 dictionaries, 178-key exact surface, CI keycheck), owner-gated flips, `.planning/` publicly served.

### A. Home Migration (root = GeoHist landing; hub → `/apps/`)

**How it typically works.** An app-developer hub that promotes one flagship app serves that app's landing at the site root and demotes the brand/portfolio page to a subpath. Deep links into the old location (`/geohist/`) must keep resolving — Google's site-move guidance (fetched, HIGH): use permanent redirects (301/308), update every `rel="canonical"` to the new self-referencing URL, move the sitemap to the new URLs and resubmit in Search Console. **A path move inside the same domain does NOT need the Search Console Change of Address tool** — that tool is only for domain/subdomain moves. Keep redirects ≥1 year (user-facing: indefinitely); expect a few weeks for the index swap; the existing 180-day CoA window on this site's old→new domain migration is a separate, untouched surface. GitHub Pages cannot emit HTTP 301s for arbitrary paths — Google treats **instant `meta refresh` (0 s)** as a permanent redirect, so a tiny stub page at `/geohist/index.html` is the compliant mechanism.

| Feature | Class | Complexity | Notes / Expected Behavior |
|---------|-------|------------|---------------------------|
| Root serves GeoHist landing directly at apex | Table Stakes | MEDIUM | One atomic commit: root `index.html` = current landing (hero, proof strip, features, gallery, FAQ, CTA) with `canonical`/`og:url`/JSON-LD `url` → `https://geohisttrivia.com/`; nav "Game" link points to `/` |
| Redirect stub for old `/geohist/index.html` | Table Stakes | LOW | Instant `meta refresh` (0 s) to `/` — Google-interpreted as permanent; no JS-only redirect (Google may never render it); no redirect chain |
| Portfolio hub at `/apps/` | Table Stakes | MEDIUM | `apps/index.html`: Persano brand intro + one GeoHist card (icon, one-liner, Play link, site link); future apps = new subdir + new card when shipped |
| No visible placeholders for future apps | Table Stakes | LOW | Unreleased apps simply have no card, no "coming soon" stub, no sitemap entry; only the structure (subdir convention, card template) is anticipated |
| i18n atomic key move | Table Stakes | MEDIUM | Hub `hub.*` keys → `apps.*` namespace; landing keys stay `geohist.*`; key surface stays exactly 178 across 19 dictionaries in the SAME commit (keycheck gate enforces set-equality); keycheck/i18n-detect/`validate:html` file lists must register `apps/index.html` |
| sitemap + canonical coherence | Table Stakes | LOW | Sitemap: apex `/` (unchanged loc, new content), remove `/geohist/` entry, add `/apps/`; every moved page self-canonical; sub-pages (guide/contact/changelog/privacy) stay in `/geohist/` — only the landing moves |
| 404 page + footer links update | Table Stakes | LOW | 404 "back to hub" target → `/apps/`; nav/footer hub links across pages repointed |
| GSC sitemap resubmit (no CoA) | Table Stakes | LOW | Same-domain path move: resubmit sitemap on the existing Domain property; optional URL Inspection/Request-indexing on `/`; CoA 180-day monitoring window untouched |
| Old-domain CI gate stays intact | Table Stakes | LOW | Migration commit must keep `check-no-old-domain.mjs` green (legacy-host literal never appears); gate is unaffected by the subdir→root move itself |

**Anti-features for A:**

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Moving ALL app pages (guide/contact/changelog/privacy) to root | "Consistency" | Breaks the Play Console privacy-policy URL already being pointed at `/geohist/privacy.html`; ×5 redirect stubs for zero user value; churn on 20-locale keyed pages | Move only the landing; sub-pages stay in `/geohist/` |
| Server-side-style HTTP 301 hunt on Pages | "Best practice" | GitHub Pages offers no config for arbitrary-path 301s; `404.html` JS redirects are last-resort | Instant `meta refresh` stub (Google = permanent) |
| Visible "coming soon" cards for future apps | "Shows ambition" | Phantom links, sitemap noise, maintenance debt; owner explicitly said none | Card appears only when the app ships |
| JS-only redirect / SPA router for the hub | "Fancy" | Rendering-failure risk for crawlers; violates zero-JS-static-interactive convention | Plain HTML stub + static links |
| Redundant canonical in the stub pointing at itself | Habit | Canonical must live on the real content (root page), not on a redirect source | Self-referencing canonical on root; stub carries only the refresh |

### B. Launch Kit (owner runbook + swap-ready site)

**How it typically works.** The store listing is a **Play Console** concern (fetched, HIGH): App Details on the Main store listing; **Store settings → Contact Details** takes the required support email and the recommended **website URL**; the privacy-policy URL lives in App content declarations and must be set **before submission/review**; *managed publishing* (optional) lets the developer hold an approved listing until they choose the go-live moment. On the web side, launch day is a sequence of tiny **verifications and gated flips**, not rewrites — this repo's D-22 decision already shipped the real package URL into every Play-link surface, so most "swaps" are confirmations.

| Feature | Class | Complexity | Notes / Expected Behavior |
|---------|-------|------------|---------------------------|
| Swap-ready placeholder/flag inventory | Table Stakes | LOW | Documented table of every launch-gated surface (below). Each row: file:line, current state, flip action, verification |
| Owner launch runbook with flip order | Table Stakes | LOW | Console-UI only (public-artifact rule): 1) Play Console App content privacy-URL field → `https://geohisttrivia.com/geohist/privacy.html` (pre-submission); 2) listing live → verify the three package-URL hrefs return 200; 3) Play Console Store settings website URL; 4) Tier-1 rating row flip per 10-RUNBOOK once a real rating is visible; 5) post-flip Rich Results Test + JSON-LD no-aggregateRating parse check |
| Play link verification (3 surfaces) | Table Stakes | LOW | `geohist/index.html:53` (JSON-LD `sameAs`), `:83` (badge CTA), `:87` (hidden Tier-1 row) all already carry the real package URL — launch day = curl 200 check, zero edits (D-22) |
| JSON-LD `offers` refresh check | Table Stakes | LOW | Confirm `price "0" / priceCurrency USD` still matches the live listing (IAP exists but app is free — free listing keeps price 0); confirm no `aggregateRating` key ever appears (10-RUNBOOK §3 parse check still passes after flips) |
| Tier-1 rating row flip support | Table Stakes | LOW | Already fully specified in `10-RUNBOOK.md` §2 (remove `hidden`, replace `0.0`); v2.1 runbook references it, does not re-specify; gate: real visible rating, no floor, fabrication forbidden |
| Rating-value refresh convention | Differentiator | LOW | 10-RUNBOOK §5 habit rides any app-version-facts session; v2.1 runbook restates it so launch-day and later sessions keep the number honest |
| Red-gate/smoke ritual per flip | Differentiator | MEDIUM | Owner flip → agent runs `npm run validate` + prod smoke (`smoke-check.sh` ALL PASS) — proven v2.0 pattern, re-listed in runbook |
| Rollback section per flip | Table Stakes | LOW | Rating row: re-add `hidden` + restore `0.0` self-flagging placeholder; badge/link surfaces need no rollback (they never change) |

**The concrete swap-ready inventory (from shipped v2.0 code):**

| Surface | File:line | State today | Launch-day action |
|---------|-----------|-------------|-------------------|
| Badge CTA Play URL | `geohist/index.html:83` | Real package URL, 404s until listing live | Verify 200; no edit |
| JSON-LD `sameAs` Play URL | `geohist/index.html:53` | Real package URL | Verify; no edit |
| Tier-1 row Play URL | `geohist/index.html:87` | Real package URL, row hidden | Verify; no edit |
| Tier-1 rating number | `geohist/index.html:92` | `0.0` self-flagging span | Replace with real rating when visible (10-RUNBOOK §2) |
| Tier-1 visibility gate | `geohist/index.html:86` | `<div class="proof-row" hidden>` | Remove `hidden` (same flip) |
| JSON-LD `offers` | `geohist/index.html:54` | price 0 USD | Refresh-check vs live listing |
| JSON-LD rating keys | `geohist/index.html:20-35` | Permanently OFF + inert policy comment | Never flip; parse check stays negative |
| Play Console privacy-URL field | Owner console (App content) | Empty/pending | Set → `/geohist/privacy.html` BEFORE submission |
| Play Console website field | Owner console (Store settings) | Pending | Set after listing live |
| App Check enforcement | Firebase console (APIs tab) | Monitoring mode | Flip only on 09-RUNBOOK §5 gate (evidence helper covers counting) |

**Anti-features for B:**

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Automated Play-rating fetch (scraping/unsanctioned API) | "Rating updates itself" | No sanctioned public rating API for individual devs; scraping violates ToS; fabrication risk | Owner eyeballs the Play page; §5 refresh habit |
| `aggregateRating` mirroring Play ratings in JSON-LD | "Rich snippets" | Google review-snippet policy bars aggregating other sites' ratings **even when real**; locked permanently OFF | Visible attributed Tier-1 row only |
| Calendar-based enforcement/flip dates | "Predictable" | All gates on this repo are evidence-only by locked decision (09-RUNBOOK §5, 10-RUNBOOK §1) | Evidence gates + owner console action |
| Blocking launch on rating-row flip | "Complete launch" | First ratings appear days after listing; blocking delays nothing useful | Row flips independently, any time after real data exists |

### C. App Check Evidence Helper (console-UI doc)

**How it typically works.** The enforcement decision (09-RUNBOOK §5-§6) needs two signals read in the Firebase console: the **ready-to-enforce** guideline on the APIs-tab metrics (almost all recent requests Verified) and a **≥30 successful-submissions floor**. The helper doc teaches the owner to produce that evidence by hand. The counting unit is pinned: **successful form submissions** (messages visible in Firestore `messages`, sorted by `createdAt` desc since code-ship date) — never console request rows (one submission = 2+ requests: anonymous auth + Firestore write, so requests overshoot).

| Feature | Class | Complexity | Notes / Expected Behavior |
|---------|-------|------------|---------------------------|
| Submission-counting walkthrough | Table Stakes | LOW | Firestore console: `messages` → sort `createdAt` desc → count since code-ship date; state the unit rule and the both-directions boundary (below 30 = keep monitoring even at 100% Verified) |
| Category-split reading guide | Table Stakes | LOW | Verified / Outdated client / Unknown origin / Invalid / Reused token semantics table already proven in 09-RUNBOOK §4; helper condenses it to one glance page |
| Weekly ritual + log template | Differentiator | LOW | One-row "week of X: Verified Y%, submissions Z" log; rides the existing §4 ritual; no automation |
| `appcheck_token_failure` trend reading | Table Stakes | LOW | Analytics → Events; up to 24h lag; owner's pihole blocks GA4 on owner devices (no DebugView) — documented so a flat trend isn't misread as absence of visitors |
| Ready-to-enforce + flip pointer | Table Stakes | LOW | Where to read the console guideline; flip itself stays §6 owner-only (FIRE-10); helper links, never re-specifies |

**Anti-features for C:**

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| CLI/API counting script (service-account credentials) | "Automate the count" | Repo tree is publicly served — credentials would leak; agent shouldn't hold console auth | Console-UI-only walkthrough |
| Auto-enforcement flip when count hits 30 | "Hands-free" | Flip is owner-only by decision (FIRE-10); 30 is a floor, ready-to-enforce is the second gate | Doc points at §6; owner clicks |
| Storing submission counts in the repo | "Audit trail" | `.planning/` is publicly served; submission data is user-adjacent | Owner keeps the log privately (or a sanitized count line only) |

### D. Cleanup Batch

| Feature | Class | Complexity | Notes / Expected Behavior |
|---------|-------|------------|---------------------------|
| Restore `npm ci` + `cache: npm` in validate job | Table Stakes | LOW | CI currently runs `npm install` (no lockfile committed); commit lockfile, restore pinned/cached installs — faster, reproducible validate runs |
| zh variant confirmation | Table Stakes | LOW | Check app repo `strings.xml` for `values-zh-rCN` → confirm Simplified-only dictionary choice; document in planning record |
| Urdu Nastaliq real-device check | Table Stakes | MEDIUM | Visual render check of `ur` line-height/RTL on a real device; documented degradation acceptable, silent discovery is not (STATE.md blocker) |
| Future-apps structure check | Table Stakes | LOW | Post-migration walkthrough: confirm adding app #2 = new subdir + hub card + sitemap entry, no placeholder code to delete; document the convention |

**Anti-features for D:** none — hygiene scope; refuse only scope creep (e.g., don't add new CI gates beyond what migration needs).

## Feature Dependencies

```
[Home Migration A]
    └──requires──> [i18n atomic key move (keycheck green)] ──requires──> [apps.* key surface + file-list registration]
    └──requires──> [sitemap/canonical update] ──requires──> [GSC sitemap resubmit (no CoA)]
    └──enables──> [Future-app structure check D4]

[Launch Kit B]
    └──requires──> [Play listing live (external, owner console)] ──gates──> [link 200-verify, website field, rating row flip]
    └──requires──> [privacy-URL field set PRE-submission] ──independent of──> [A] (privacy stays at /geohist/privacy.html)
    └──depends on──> [10-RUNBOOK §1-§5 unchanged] + [09-RUNBOOK §5 gate]

[Evidence Helper C]
    └──depends on──> [09-RUNBOOK §4 semantics (unit, categories)] ──no code, no A/B dependency
    └──feeds──> [FIRE-10 enforcement flip (owner, post-v2.1)]

[Cleanup D]
    └──D1 lockfile ──should precede──> [any phase needing many validate runs] (faster CI)
    └──D4 ──requires──> [A shipped]

[Rating row flip] ──conflicts──> [aggregateRating JSON-LD] (Tier-1 visible row is the ONLY sanctioned Play-rating surface — never both)
[meta-refresh stub] ──conflicts──> [JS-only redirect] (choose stub; Google treats JS redirect as unreliable last resort)
```

**Dependency notes:**
- **A requires the atomic key move:** moving hub content to `/apps/` and landing to root in one commit, with the key surface staying exactly 178 × 19, is the only keycheck-green path (Phase 06/07 precedent).
- **B's flips never touch A's URLs:** privacy stays at `/geohist/privacy.html` so the Play Console field recorded in the owner's flow never dangles.
- **C is documentation-only:** zero dependency on migration state; can ship in any phase but pairs naturally with B (same owner-runbook format).
- **D1 before heavy phases:** lockfile restore speeds every subsequent validate cycle.

## MVP Definition

### Launch With (v2.1 core)

- [ ] Root migration atomic commit (landing at root, hub at `/apps/`, meta-refresh stub, sitemap/canonical/404/nav updates, i18n key move, `validate:html` file list) — the milestone's structural core
- [ ] Launch runbook with pinned flip order (privacy URL → link verify → website field → rating row) — must exist BEFORE the listing goes live
- [ ] Swap-ready inventory table (above) baked into the runbook — makes every flip a tiny verified edit
- [ ] Evidence helper doc (counting unit + weekly ritual) — needed once submissions start accruing toward the 30-floor

### Add After Validation (post-migration, pre/at launch)

- [ ] Tier-1 rating row flip — trigger: real visible Play rating (gate already defined in 10-RUNBOOK §1)
- [ ] GSC sitemap resubmit + URL Inspection on `/` — trigger: migration deploy live
- [ ] FIRE-10 enforcement flip — trigger: 09-RUNBOOK §5 gate (≥30 submissions + ready-to-enforce); owner console, post-v2.1 acceptable

### Future Consideration (v3+)

- [ ] App #2 subdir + hub card — trigger: next app actually ships
- [ ] Per-language static subdirs — locked out without a proven crawlability case (single-URL i18n stands)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Root = GeoHist landing + `/apps/` hub | HIGH (Play reviewers + visitors land on the game) | MEDIUM | P1 |
| `/geohist/` redirect stub + canonical/sitemap updates | HIGH (deep links keep working) | LOW | P1 |
| Launch runbook (flip order) | HIGH (launch day is owner-operated) | LOW | P1 |
| Swap-ready inventory | HIGH (every flip = verified tiny edit) | LOW | P1 |
| Evidence helper doc | MEDIUM (unblocks future FIRE-10) | LOW | P2 |
| Tier-1 rating row flip | MEDIUM (social proof, owner-gated) | LOW | P2 |
| Cleanup: lockfile/ci cache | MEDIUM (CI speed/reproducibility) | LOW | P2 |
| Cleanup: zh + Urdu checks | LOW-MEDIUM (quality assurance) | LOW | P3 |

**Priority key:** P1 = must ship in v2.1 · P2 = should ship in v2.1 · P3 = nice to have inside cleanup batch

## Requirements Category Groupings (for downstream planning)

1. **URL / information-architecture changes** (A) — one atomic commit + one deploy; verification-heavy, edit-light; all CI gates must stay green.
2. **External-event-gated content flips** (B flips, rating row) — code-ready today; each flip waits on owner console action + Play listing reality; never blocking the site.
3. **Documentation-only owner rituals** (runbook, evidence helper) — console-UI instructions only (public-artifact rule); zero runtime surface.
4. **CI/tooling hygiene** (D) — independent, fast, de-risk the rest.

## Sources

- Google Search Central — *Redirects and Google Search* (developers.google.com/search/docs/crawling-indexing/301-redirects), fetched 2026-09-11 — HIGH: 301/308 = permanent signal; instant meta refresh interpreted as permanent; JS redirects last resort; alternate-name behavior.
- Google Search Central — *Site moves with URL changes* (developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), fetched 2026-09-11 — HIGH: same-domain path moves need no CoA; update canonicals + sitemap + resubmit; keep redirects ≥1 year; avoid chains and irrelevant homepage redirects (soft-404 risk); small sites move all at once; old-sitemap warnings normal.
- Play Console Help — *Create and set up your app* (support.google.com/googleplay/android-developer/answer/113469), fetched 2026-09-11 — HIGH: store-listing field limits; Store settings → Contact Details (support email required, website recommended); managed publishing option. App-content privacy-URL field page is bot-blocked — field existence/flow is HIGH-confidence repo precedent (PROJECT.md owner steps, v1 D-70 record).
- Repo precedent (curated, HIGH — verified in v2.0 records): `.planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md` (Tier-1 flip, gates, refresh habit, §6 schema rule); `09-app-check-monitor-first/09-RUNBOOK.md` §4-§6 (counting unit, category semantics, evidence gate, flip/rollback); Phase 08 records (domain migration, sitemap/GSC flow, curl triple proof); D-22 (real package URL shipped in all three Play-link surfaces).
- Industry hub pattern (subdir-per-app + `/apps/` index, no placeholder cards) — MEDIUM: synthesized common indie-developer practice; no single authoritative doc.

---
*Feature research for: Persano v2.1 — Play Launch + Home Migration*
*Researched: 2026-09-11*
