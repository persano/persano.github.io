# Phase 14 Owner Runbook — Play Launch Day (Pinned Flip Order)

**Audience:** Santiago (owner). Every step below is a Play Console or browser action against a public Google/Play surface — no repo editing, no Firebase work, no CI. Agent-owned steps (validate chain, deploys) appear as cross-references only — you do nothing for those except, in one case, asking the agent to deploy (§3 step 4).

**Public-artifact notice:** this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.**

**When to execute (EA-06/EA-09):** these steps are pre-staged here. **Steps 1–3 fire on launch day**, once the Play listing goes live, in the pinned order below — do not reorder, do not skip step 1. **Step 4 is gate-driven and may be a later day** (real Play ratings must exist first; watch-item semantics per 10-RUNBOOK §1 and the STATE watch items). Nothing in this runbook is a deploy precondition — the site is already fully shipped and live; launch day changes only Play Console fields and verifies live surfaces.

**Status legend:** ⬜ TODO (yours) · ✅ done (agent-verified) · 🔍 soft check (nice-to-have, non-blocking)

---

## §1 · Prerequisites — all four must be true before you open Play Console

| # | Prerequisite | How you confirm | Status |
|---|--------------|-----------------|--------|
| 1 | Phase 13 home migration landed and the Pages deploy finished green | Repo → Actions tab → latest run on main: `validate` ✓ then `deploy` ✓ | ⬜ |
| 2 | Local validate chain green (6 stages, including the play package-id gate from Phase 14 plan 14-01) | From the repo root: `npm run validate` → exit 0; the chain tail shows the `validate:play-links` stage (`check-play-link: OK`) and the i18n keycheck `PASS` ×19 lines then `i18n-keycheck: OK` | ⬜ |
| 3 | The privacy policy renders live at the frozen compliance path | Visit `https://geohisttrivia.com/geohist/privacy.html` — the policy page renders, no 404 | ⬜ |
| 4 | **EXPECTATION GUARD — pre-launch 404 is the DESIGNED state:** `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` returning 404 *before* launch is expected (the D-22 pre-launch swap shipped the real package URL in all 3 code surfaces at Phase 2; only the listing's liveness changes on launch day) | Read this row and skip any impulse to "fix" the 404 — there is nothing to fix; §2 row 2 and §3 step 2 verify when it stops being 404 | ⬜ |

**Recording:** every step's observed outcome is recorded in `14-RECORDS.md` (R-01..R-06) — post-launch rows there, pre-ship locally-runnable checks in `14-UAT.md` (PRE-01..06). The recording predicate in both files is mechanical: any recorded issue is a blocker, no gap-awareness.

---

## §2 · Surface inventory — every Play-launch surface, verified swap-ready (LKIT-02)

All file:line citations below were re-verified against the working tree when this runbook was authored (root landing layout post-Phase-13): the package URL appears at exactly `index.html` lines 53, 83, 87; the OFF proof-row `div hidden` sits at line 86 with the `0.0` placeholder span at line 92; `og:url` line 12, `og:image` line 13; the JSON-LD block spans lines 36–56 (`sameAs` 53, `offers` 54).

| # | Surface | Where it lives | Current state | Launch-day action |
|---|---------|----------------|---------------|-------------------|
| 1 | Play Console **privacy-policy URL field** | Play Console (not a file) — field not yet filled (app in review) | Target frozen: `https://geohisttrivia.com/geohist/privacy.html` (MIG-07 — the path is frozen and live; never move it) | **Paste** the privacy URL into the console field (§3 step 1) |
| 2 | Play listing liveness (the package URL) | `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` | Shipped pre-launch in all 3 code URLs; 404s until the listing goes live (designed — see §1 row 4) | **Verify** the URL returns the live listing (§3 step 2; also the Tier-1 gate input #1) |
| 3 | Play Console **website field** | Play Console (not a file) — field not yet filled | — | **Paste** `https://geohisttrivia.com/` (root = the GeoHist landing post-Phase-13) (§3 step 3) |
| 4 | Badge CTA | `index.html` lines 83–85 (`.badge-cta` anchor + `/geohist/google-play-badge.png` img) | Live since Phase 2, already points at the real package URL | **Zero action — verify only** |
| 5 | JSON-LD `offers` + `sameAs` | `index.html` lines 36–56 (`sameAs` line 53, `offers` line 54: price `"0"`, `priceCurrency` `"USD"`) | Already compliant — free-app shape per Google's software-app doc | **Zero action — refresh-check only (§5)** |
| 6 | `og:url` / `og:image` coherence | `index.html` line 12 (`og:url` = `https://geohisttrivia.com/`), line 13 (`og:image` = `https://geohisttrivia.com/geohist/og-image.png`) | Coherent with the canonical (line 8) and the JSON-LD `url` (line 44); `og:image` intentionally stays under `/geohist/` so the frozen privacy page's asset references keep resolving | **Zero action — verify only** |
| 7 | Tier-1 rating row | `index.html` lines 86–95 — `<div class="proof-row" hidden>` (86) → anchor (87) → star SVG (88–90) → "Rated" span (91) → `<span class="proof-row-score">0.0</span>` (92) → "on Google Play" span (93) | OFF by design — `hidden` + placeholder `0.0`; translations already baked in all 20 languages; star-uniqueness gate enforces exactly one star | **Two edits** per 10-RUNBOOK §2 (that file's paths are superseded — its dated corrections point at root `index.html`); **gated, may be a later day** (§3 step 4) |
| 8 | GA4 / Analytics | `js/consent.js` (load-gated Firebase Analytics; consent-gated `play_badge_click` event) | Consent-gated auto `page_view`; no custom dimensions anywhere | **Zero action — note only (§4)** |

**Zero code change on launch day (EA-10):** all 8 surfaces are already swap-ready — steps 1–3 are console fields or a browser check, and the only future code touch is the Tier-1 two-edit flip (row 7), which fires when its evidence gate passes, never on a schedule.

---

## §3 · The pinned sequence — exactly 4 steps, in this order (LKIT-01)

### STEP 1 — privacy-URL field FIRST (compliance precondition closes before cosmetic steps)

Play Console → app content → privacy policy URL field → paste `https://geohisttrivia.com/geohist/privacy.html`.

- **Expected outcome:** the field accepts the URL and saves.
- **Owner-verify caveat (carry-over EA-06):** this exact console flow was never verified end-to-end (it was bot-blocked during prior research) — verify the actual console screens yourself as you go. The runbook deliberately does not give screen-by-screen pixel instructions.
- **If the field rejects the URL for any reason:** that is a launch-day blocker discovered at the step. Rollback is simply "field not yet filled; investigate" — there is no site-side action (the privacy path is frozen and live; the page itself cannot be the cause of a console-side rejection pattern).
- Record the outcome in `14-RECORDS.md` R-01.

### STEP 2 — Play-link 200 verify SECOND

Open `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` in a browser.

- **Expected outcome:** the live listing page — the app page exists and is browsable (no 404).
- This is **gate input #1** of the Tier-1 flip (10-RUNBOOK §1 condition 1: "The Google Play listing is live"). Verifying it before the console cosmetic steps keeps the runbook from ever declaring a false "launch done" while the listing is still propagating.
- Record the first-live date in `14-RECORDS.md` R-02.

### STEP 3 — website field THIRD

Play Console → main listing → website field → paste `https://geohisttrivia.com/`.

- **Expected outcome:** the field accepts and saves.
- Cheap, no gating power — it depends only on console access and the apex being live (true since Phase 8/13). Doing it after the step-2 proof means every console edit follows the "listing live" evidence.
- Record the outcome in `14-RECORDS.md` R-03.

### STEP 4 — Tier-1 rating flip LAST — GATED, may be a later day (EA-09)

**Steps 1–3 close launch day. Step 4 fires when its gate passes — even if that is days or weeks later.** It is never calendar-based, never optional-to-skip-without-gate, and it is a STATE watch item.

The gate (10-RUNBOOK §1, verbatim conditions — you eyeball them, no tooling):

1. **The Google Play listing is live** (the app page exists and is browsable — proven at step 2).
2. **A real aggregate rating is visible on the Play page** — the star score next to the install button.

**No minimum-count floor** — there is no minimum number of ratings to wait for: any honest, real rating flips. **Never enter a number you did not see on the Play page itself.**

The two edits target **root `index.html`** (the 10-RUNBOOK §2 paths are superseded — that file's dated corrections say so — same two edits, new path):

1. Remove the `hidden` attribute from the `proof-row` div (root `index.html` line 86).
2. Replace `0.0` in the `proof-row-score` span (line 92) with the real rating in decimal dot format (e.g. `4.5`, never `4,5`).

Then deploy (ask the agent to run the deploy and the validation ritual on your behalf) and run the §5 refresh ritual. The full flip detail, rollback, and the validation ritual live in 10-RUNBOOK §1–§4 — cross-reference those, do not improvise here. Record the flip in `14-RECORDS.md` R-06.

---

## §4 · GA4 note — how launch-day traffic reads (note only, zero code)

Firebase Analytics is load-gated behind consent (`js/consent.js`) — the SDK auto-sends `page_view` with default params after a visitor accepts. Four facts so launch day needs **no code change, no custom dimension, no config flip** — this note exists so the owner does NOT improvise one:

1. **Default `page_location` already covers Play-launch attribution** — every landing hit records `page_location = https://geohisttrivia.com/` and `page_path = /`. Expect/verify — this is default SDK behavior, not a guarantee.
2. **"Came from Play" traffic** reads via the consent-gated `play_badge_click` event count (badge clicks toward Play; `page` param = `/` post-migration). The Play webview referrer commonly classifies as `(direct)` in traffic acquisition — expect/verify, never assume.
3. **Locale split** reads from GA4's default browser-language signal plus the `language_switch` event — never from distinct page paths (single-URL i18n: there are none).
4. 🔍 **Soft check:** GA4 Realtime during the launch window shows the landing's realtime users — consent-filtered by design (only consented sessions report).

**Historical-path note:** pre-migration events carry `/geohist/` as the `page` param — any comparison across the migration boundary must account for the path change (no data migration exists or is needed).

Record the optional Realtime observation in `14-RECORDS.md` R-05.

---

## §5 · JSON-LD offers refresh-check — verification step, NOT an edit step (LKIT-04c)

The schema is already correct: root `index.html` line 54 ships `"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }` — the documented minimal compliant shape for a free app. **Zero data change, zero code change** (no `availability` key, no PreOrder key — the shipped shape has passed Rich Results since Phase 5/13 with no availability warning recorded). After the listing goes live, verify it still reads correctly:

1. **Google Rich Results Test** — open `search.google.com/test/rich-results`, test `https://geohisttrivia.com/` (the root landing — NOT the stale pre-Phase-13 landing path; the 10-RUNBOOK line-80 correction says the same). **Expected:** a valid `SoftwareApplication` result with no new errors, and the offers shape still reflects reality — the app is free at download; IAP lives inside the app and does not change the web offers node.
2. **Zero-dependency local parse check** — from the repo root (this is the 10-RUNBOOK §3 command with its path argument repointed to root):

   ```powershell
   node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const m=h.match(/<script type=.application\/ld\+json.>[\s\S]*?<\/script>/)[0].replace(/<\/?script[^>]*>/g,'');const j=JSON.parse(m);if(j.aggregateRating){process.exit(2)}console.log('OK: JSON-LD parses; no aggregateRating key; type='+j['@type'])"
   ```

   **Expected:** the `OK:` line — JSON-LD parses; no `aggregateRating` key; type `SoftwareApplication,MobileApplication`. **Exit code 2 at any time means the rating key appeared in the schema: stop and revert (10-RUNBOOK §4), then check §6.**

Record the Rich Results observation in `14-RECORDS.md` R-04.

---

## §6 · Do-NOT-do guard — four things that must never happen

1. **No `aggregateRating` key, ever** — Tier-2 stays permanently OFF (10-RUNBOOK §6). Google review-snippet policy, verbatim: *"Don't aggregate reviews or ratings from other websites."* Play ratings are another website's ratings; the visible Tier-1 row is the only sanctioned display path.
2. **No `hl=` or `gl=` experiment parameters on shipped Play URLs** — the canonical form is `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia`, param-free (PITFALLS.md row 214). The Phase 14 CI gate (plan 14-01) also fails any URL-shaped Play URL missing the package id, so a malformed edit never ships silently.
3. **No Change-of-Address touch** — the 13-RUNBOOK §4 guard stands: no refile, no cancel. The existing 180-day signal-forwarding window (filed at Phase 8 for the legacy-host → apex move) runs until ~2027-03.
4. **No calendar-based flip** — the rating flip is evidence-gated only (10-RUNBOOK §1 conditions), never date-gated. "It's been N days" is not a gate condition.

---

*Phase 14 · Launch Kit · runbook authored 2026-09-15 by plan 14-02 (Task 1) · steps 1-3 fire launch day, step 4 gate-driven · outcomes recorded via 14-RECORDS.md*
