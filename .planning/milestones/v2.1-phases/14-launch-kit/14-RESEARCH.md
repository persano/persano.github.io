# Phase 14: Launch Kit — Research

**Researched:** 2026-09-14
**Domain:** Play-launch-day operations runbook + Play-URL package-id CI gate (repo-internal; zero runtime dependencies added)
**Confidence:** HIGH (all repo facts read this session; one Google doc fetched live; Play Console field flow carries one carry-over assumption)
**Researcher note:** doc/script-only phase — no runtime code paths change. Every code-tree fact below was read with `Read`/`git grep` this session against the post-Phase-13 layout (root landing, PR #7 merged + deployed 2026-09-14). Per repo convention, config has `nyquist_validation: false`, but the orchestrator explicitly requested a `## Validation Architecture` section — it is included below and marked as such.

---

## Key Findings

### Q1 — LKIT surface inventory (every `play.google.com` occurrence + every launch-day flip)

**Full inventory of `play.google.com` in the tracked tree** (via `git grep -n "play.google.com"`, all files, this session):

**Code tree (the gate's protection target):**

| # | Location | Current value (verbatim) | URL-shaped? | Carries `details?id=com.persano.geohisttrivia`? |
|---|----------|--------------------------|-------------|------------------------------------------------|
| 1 | `index.html:53` | `"sameAs": "https://play.google.com/store/apps/details?id=com.persano.geohisttrivia",` | YES (JSON-LD sameAs) | YES ✓ |
| 2 | `index.html:83` | `<a class="badge-cta" href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">` | YES (badge CTA href) | YES ✓ |
| 3 | `index.html:87` | `<a href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">` | YES (proof-row anchor href) | YES ✓ |
| 4 | `index.html:23` | `Google Play ratings live on play.google.com and may NEVER be copied into this` (HTML comment inside the aggregateRating-OFF block, lines 20-35) | NO — bare domain mention, no path | n/a |
| 5 | `package.json:10` | `"validate:links": "linkinator . --recurse --skip \"https://geohisttrivia.com\" --skip \"play.google.com\" --skip \"policies.google.com\" ..."` | NO — bare domain in a linkinator `--skip` flag, no path | n/a |

**Verified elsewhere (all negative):**

- `js/i18n/*.json` — all 19 dictionaries: **zero** Play URLs. The only "play" hits are the `geohist.features.playgames.title` / `geohist.features.playgames.1` value strings ("Google Play Games" product name + its translation). No dictionary carries a Play URL → the CI gate needs no i18n interaction at all. [VERIFIED: git grep -n "play" -- js/i18n, this session]
- `apps/index.html`, `404.html`, `geohist/*.html` (incl. the frozen `privacy.html`) — **zero** `play.google.com` hits. The hub card CTA links to `/` (the landing), not to Play. [VERIFIED: git grep -n "play.google" -- apps 404.html geohist → empty]
- `js/*.js` — zero hits (no Play URL in any script).
- `sitemap.xml` — zero hits (6 apex URLs only: `/`, `/apps/`, guide, changelog, contact, privacy — read in full this session).

**`.planning/` historical docs — many hits, of which several are Play URLs WITHOUT the package id:**
- `.planning/milestones/v1-phases/02-.../02-RESEARCH.md:439` — `https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png` (badge asset URL, no `details?id=`)
- `.planning/milestones/v1-phases/02-.../02-RESEARCH.md:150` — `play.google.com/store/apps/` (bare path, no id)
- `.planning/research/PITFALLS.md:157` — `play.google.com/store/apps/details?id=...&hl=` (URL-shaped, NO package id — would FAIL a naive gate)
- `.planning/milestones/v2.0-phases/06-.../red-gate-proof.md:63`, `06-01-SUMMARY.md:161` — bare `play.google.com` skip-flag mentions
- Numerous full URLs WITH the id (10-RESEARCH.md:134-135, 10-01-PLAN.md:113/184, 05-*, 08-*, 11-* etc.)

Historical `.planning/` records are **verbatim-immutable** (supersession policy: original text stays verbatim; only dated bracketed corrections append). This drives the gate scope decision — see Q4.

**Launch-day flip surfaces (the swap-ready inventory):**

| # | Surface | Where it lives today | Current state (verified) | Launch-day action |
|---|---------|----------------------|--------------------------|-------------------|
| 1 | Play Console **privacy-policy URL field** | Play Console (not a file) — the field is not yet filled (app in review) | Points-at target: `https://geohisttrivia.com/geohist/privacy.html` — path FROZEN (MIG-07; STATE locked decision: "v2.1: `/geohist/privacy.html` is FROZEN — Play Console compliance surface, invisible to repo gates; never move it") | Owner pastes the privacy URL into the console field |
| 2 | Play listing liveness (the package URL) | `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` | Shipped pre-launch in all 3 code URLs (D-22 decision from Phase 2: real package URL shipped now, "404s until listing goes live; launch-day swap requires zero code change") | Owner verifies the URL returns a live listing (200) — this is the §1-gate input for the rating flip |
| 3 | Play Console **website field** | Play Console (not a file) | Not yet filled | Owner pastes `https://geohisttrivia.com/` (root = the GeoHist landing post-Phase-13) |
| 4 | Badge CTA | `index.html:83-85` (`.badge-cta` anchor + `/geohist/google-play-badge.png` img) | Live since Phase 2, already points at the real package URL | **Zero action** — verify only (no code change on launch day) |
| 5 | JSON-LD `offers` + `sameAs` | `index.html:36-56` (block) — `sameAs` line 53, `offers` line 54 | `offers` present and compliant; `sameAs` carries the id | **Zero action** — refresh-check only (see Q2) |
| 6 | og:url / og:image coherence | `index.html:12` (`og:url` = `https://geohisttrivia.com/`), `index.html:13` (`og:image` = `https://geohisttrivia.com/geohist/og-image.png`) | Coherent with canonical (line 8 = `/`) and JSON-LD `url` (line 44 = `/`); og:image intentionally stays under `/geohist/` (asset set frozen there so the privacy page's references keep resolving — 13-RUNBOOK §5.2) | **Zero action** — coherence already shipped post-Phase-13 |
| 7 | Tier-1 rating row | `index.html:86-95`: `<div class="proof-row" hidden>` (86) → anchor (87) → star SVG `proof-row-star` (88-90) → `<span data-i18n="geohist.tier1.prefix">Rated</span>` (91) → `<span class="proof-row-score">0.0</span>` (92) → `<span data-i18n="geohist.tier1.suffix">on Google Play</span>` (93) | OFF — `hidden` attribute + placeholder `0.0` (self-flagging); translations already baked ×20; star-uniqueness gate enforces exactly ONE star | **Two edits** per 10-RUNBOOK §2 (now against root `index.html`): remove ` hidden` from line 86, replace `0.0` in line 92 with the real Play rating (decimal dot format) — then deploy + §3 ritual |
| 8 | GA4 / Analytics | `js/consent.js` (load-gated Firebase Analytics) | Consent-gated auto page_view; `play_badge_click {page: location.pathname}` event (consent.js:129) | **Zero action** — note only (see Q3) |

**Play Console field flow caveat:** STATE.md blocker (verbatim): "Play Console privacy-URL field flow was bot-blocked during research — verify in console when writing Phase 14 runbook." The exact console navigation path for the privacy-URL and website fields is owner-verified at runbook-write time; the runbook must present these as console-UI steps with expected outcomes, not as verified screen-by-screen instructions. [CARRY-OVER: STATE.md:96]

### Q2 — JSON-LD offers refresh check

**Root `index.html` JSON-LD block (lines 36-56), verbatim:**

```json
{
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "MobileApplication"],
  "name": "GeoHist Trivia",
  "operatingSystem": "ANDROID",
  "applicationCategory": "GameApplication",
  "description": "GeoHist Trivia is a playful history and geography trivia game for Android — guess your way around the world and travel through time. Get it on Google Play.",
  "url": "https://geohisttrivia.com/",
  "image": "https://geohisttrivia.com/geohist/icon.png",
  "screenshot": [ ... 4 screenshot URLs ... ],
  "author": { "@type": "Person", "name": "Santiago David Postorivo" },
  "sameAs": "https://play.google.com/store/apps/details?id=com.persano.geohisttrivia",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```

**The block ALREADY has `offers`** — line 54, verbatim: `"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }`. [VERIFIED: index.html:36-56, read this session]

**Google's documented requirement** (SoftwareApplication rich result doc, fetched live this session from developers.google.com/search/docs/appearance/structured-data/software-app): *"If the app is available without payment, set `offers.price` to `0`"* — the doc's own minimal free-app example is `"offers": { "@type": "Offer", "price": 0 }`; `priceCurrency` is recommended (required-ish) and the doc's paid example carries it. [VERIFIED: developers.google.com software-app doc — verbatim quotes in §Sources]

**Answer to "PreOrder vs omit":** for a **free** Android app, the minimal compliant shape is exactly what ships — `price: "0"` + `priceCurrency: "USD"`. `availability` (InStock/PreOrder) is an Offer property the software-app doc does not require and its examples omit it; PreOrder semantics apply to products not yet purchasable, and the shipped shape has passed the Rich Results ritual since Phase 5/13 with no availability warning recorded. **No availability key, no PreOrder key, no `offers.url` key is needed.** [VERIFIED: Google doc fetched; 13-RUNBOOK §5.1 records the post-migration Rich Results pass with no new errors]

**Conclusion for LKIT-04:** the JSON-LD is **already swap-ready — launch day requires ZERO data change and ZERO code change**. The runbook's "JSON-LD offers refresh-check step" is a *verification* step, not an edit step: after the listing goes live, re-run Google Rich Results Test on `https://geohisttrivia.com/` (not the stale `/geohist/` path from 10-RUNBOOK §3), expect a valid SoftwareApplication result with no new errors, and confirm the offers shape still reflects reality (app free at download; IAP lives inside the app and does not change the web offers node). The permanent rule stands untouched: **no `aggregateRating` key, ever** (in-file comment lines 20-35 + 10-RUNBOOK §6 + review-snippet policy).

### Q3 — GA4 page-dimension note (note, not code)

**Where GA4 is configured:** nowhere as a `gtag('config', …)` call — the site uses the **Firebase Analytics SDK**, dynamically imported post-consent in `js/consent.js:148-182` (`initializeApp` + `getAnalytics` after the `isSupported()` guard). The SDK auto-sends `page_view` with default params; `page_location` defaults to the full document URL. `git grep gtag` finds zero code hits (only historical .planning docs + the AGENTS.md What-NOT-to-Use row). [VERIFIED: js/consent.js read in full; git grep gtag]

**Relevant shipped facts:**

- Single-URL i18n (Phase 7 locked design): all 20 languages share `https://geohisttrivia.com/` — `page_location` is identical across locales; language attribution rides the `language_switch {from,to}` event (consent.js:132-135) and `play_badge_click {page: location.pathname}` (consent.js:129). Post-Phase-13, `location.pathname` on the landing = `/`.
- No custom dimensions are configured anywhere (no gtag config, no `setDefaultEventParameters`, no GA4 admin-side custom dims in any runbook).

**What the launch-runbook note must say (LKIT-04):**

1. **Default `page_location` already covers Play-launch attribution** — every landing hit records `page_location = https://geohisttrivia.com/` and `page_path = /`. No code change, no custom dimension, no config flip needed on launch day. The note exists so the owner does NOT improvise one.
2. **Attribution of "came from Play" traffic:** traffic arriving from the Play listing shows in GA4 traffic acquisition under whatever referrer the Play webview sends — commonly `(direct)` for the in-app store browser. The reliable on-site signal is the **`play_badge_click` event count** (consent-gated) — the number of visitors who clicked the badge toward Play, with `page` = `/`.
3. **Locale split:** because the i18n design is single-URL, per-language launch traffic is read from GA4's default browser-language signal plus the `language_switch` event — never from distinct page paths (there are none).
4. Optional 🔍 soft check: during launch window, GA4 Realtime on `https://analytics.google.com` shows the landing's realtime users; consent-gated so counts are consent-filtered by design.

**Explicitly NOT done:** no `page_dimension`/custom-dimension code, no gtag shim, no consent-mode change — LKIT-04 words it as a *note*, and the shipped architecture needs nothing else. [ASSUMED parts: default Firebase Analytics `page_view` param behavior and Play-webview referrer classification — both are platform-default behaviors, note-only, zero risk if phrased as "expect / verify", never as guarantees. Tagged [ASSUMED] in the Assumptions Log.]

### Q4 — CI gate design (LKIT-03): `scripts/check-play-link.mjs`

**Scope decision (explicit recommendation): the gate mirrors `check-no-old-domain.mjs` walk + ALLOW set exactly — ALLOW = `{ '.planning', 'README.md', '.git', 'node_modules' }`, i.e. `.planning/` is OUT of gate scope.**

Rationale (three legs, all repo-verified):

1. `.planning/` historical docs contain legitimate non-canonical Play URLs that can never be edited (verbatim-immutability): the badge PNG `intl/...` URL (02-RESEARCH.md:439), a bare `store/apps/` path (02-RESEARCH.md:150), and PITFALLS.md:157's `details?id=...&hl=` illustration. Including `.planning/` forces either a FAIL on the current tree (vacuous gate — Phase 06 precedent forbids) or editing historical records (forbidden by the supersession policy).
2. The precedent gate's ALLOW set is the established repo pattern [VERIFIED: scripts/check-no-old-domain.mjs:41 — `const ALLOW = new Set(['.planning', 'README.md', '.git', 'node_modules']);`].
3. The requirement's protection target is the served site tree: all real Play-URL surfaces live in `index.html` (3 URL-shaped hits). The gate's value = nobody adds a Play URL to the site (code, scripts, root docs like AGENTS.md — which old-domain gate enforces and this gate would too, since AGENTS.md is NOT in ALLOW) without the package id. "Tracked files" in LKIT-03 is implemented as "the walk" — same approximation the old-domain gate ships, and the header comment documents it.

**Needle construction (script design):**

- The script must detect **URL-shaped** occurrences only: `play\.google\.com/` followed by at least one path character. This is the critical discriminator that keeps `package.json:10` (`--skip "play.google.com"` — bare domain, no slash-path) and `index.html:23` (comment prose "live on play.google.com and" — no path) as non-hits. A naive `line.includes('play.google.com')` gate **FAILS the positive control on the current tree** — both bare mentions would trip it. This is the #1 design pitfall.
- Regex (zero-dep, per-line scan like the old-domain gate): extract every match of `/play\.google\.com\/[^\s"'<>\\)]+/g` per line; a match **PASSES** iff it contains the literal `details?id=com.persano.geohisttrivia` **after** normalization: `&amp;` → `&` (HTML attribute escaping) and `&#38;` → `&`. A match without the id → hit, reported `file:line` (same per-line reporting as the old-domain gate), collected list to `console.error`, exit 1 with a header like `Play URLs missing package id:`; exit 0 with `check-play-link: OK`.
- **`&` vs `&amp;`:** the canonical URL puts `id` first (`details?id=com.persano.geohisttrivia`), and the id token `[a-zA-Z0-9.]` is never HTML-escaped — so the id substring survives attribute escaping untouched. Normalization is belt-and-suspenders for hypothetical `details?id=X&amp;hl=en`-style forms and costs 2 lines.
- **`store/apps/download` / shortlink forms:** any URL-shaped `play.google.com/...` match WITHOUT `details?id=<package>` fails — including `store/apps/download?id=...` and `market://` links are out of scope (different host). Policy: the canonical `details?id=com.persano.geohisttrivia` form is the only sanctioned one (matches `.planning/research/PITFALLS.md:163`'s recommendation verbatim: "every `play.google.com` URL in tracked files must contain `details?id=com.persano.geohisttrivia` (and https scheme)").
- **https scheme:** optional second check — a match starting `http://play.google.com` also fails (cheap, keeps the PITFALLS.md:163 recommendation fully). Recommend including it: same match loop, one extra condition.
- Binary safety + hidden-dir skip + cwd-independence: copy the established patterns verbatim (NUL-byte probe in first 8 KiB; `entry.name.startsWith('.')` skip; repo root from `process.argv[1]`).
- Unlike the old-domain gate, the needle here is a **public constant** (the package id is public-by-design, published in every surfaced URL) — no runtime-assembly trickery needed; but the script source itself contains `play.google.com` + the id, which is fine because the script's own matches are URL-shaped WITH the id (self-trip impossible: its own source matches are in `scripts/`, which the walk scans — wait: `scripts/check-play-link.mjs` itself WOULD be scanned by the walk and contains URL-shaped strings in comments/regex. **Resolution:** the walk scans it, and any URL-shaped literal in its own source must either carry the id or the regex/comment must be written non-URL-shaped. The old-domain gate solved this by runtime-assembly; here the simple fix: write the regex as `play\\.google\\.com\\//`-style source text (double-escaped) and in comments never write a full URL-shaped literal without the id. Recommend the gate's own doc comments spell the host as `play.google.com` followed by `/store/apps/details?id=com.persano.geohisttrivia` WITH the id (self-passing), or keep comments prose-only. Simplest robust choice: the script's canonical self-reference IS the full package URL — it self-passes.)

**Validate-chain position:** add `"validate:play-links": "node scripts/check-play-link.mjs"` to `package.json`, chained immediately after `validate:domain` (both are zero-dep source-scan gates; keeps the fast cheap gates together before linkinator):

```
"validate": "npm run validate:html && npm run validate:domain && npm run validate:play-links && npm run validate:links && npm run validate:i18n-detect && npm run validate:i18n"
```

[VERIFIED: package.json:5 chain, read this session. Do NOT touch `validate:links`'s `--skip "play.google.com"` — linkinator liveness-checking of Play is deliberately skipped pre-launch; the new gate covers the URL-shape invariant instead (PITFALLS.md:163's exact design).]

**Red-gate plan (both directions + positive control), per repo red-gate convention (mutate → gate → observe → restore byte-identical via pre-made snapshot → re-run; `git restore` is unusable while Phase-14 changes are uncommitted — Phase 13 lesson "per-file distinct snapshot names"):**

| # | Cycle | Mutation | Expected gate result |
|---|-------|----------|---------------------|
| 1 | Positive control (pre-mutation) | none — run gate on current tree | PASS (`check-play-link: OK`) — proves the bare mentions (`package.json:10`, `index.html:23`) do NOT trip the URL-shaped needle |
| 2 | Direction-1 FAIL (wrong id) | snapshot `index.html`; mutate line 83 href to `details?id=com.example.wrong` | FAIL, hit list names `index.html:83`; restore byte-identical (hash-verified) → PASS |
| 3 | Direction-1 FAIL (id removed) | mutate line 87 href to bare `https://play.google.com/store/apps/` | FAIL at `index.html:87`; restore → PASS |
| 4 | Adjacent-param PASS | mutate line 83 href to `details?id=com.persano.geohisttrivia&hl=en` (append param) | PASS (id intact — params allowed, id mandatory); restore → PASS |
| 5 | Escaped-ampersand PASS | mutate line 83 href to `...trivia&amp;hl=en` | PASS after `&amp;` normalization; restore → PASS |
| 6 | Non-canonical form FAIL | (in a scratch file, e.g. temp `geohist/gate-probe.html`) write `play.google.com/store/apps/download?id=com.persano.geohisttrivia` | FAIL (no `details?id=`); delete scratch file → PASS |

All cycles recorded in the phase's `red-gate-proof.md` (convention: `.planning/phases/14-launch-kit/red-gate-proof.md`).

### Q5 — 10-RUNBOOK supersession (exact stale lines post-Phase-13)

All paths verified stale against the current tree [VERIFIED: 10-RUNBOOK.md read in full this session; root layout per 13-RUNBOOK §1]. Supersession policy: **original text stays verbatim; a dated bracketed correction appends at each stale spot** (AGENTS.md policy example: "[corrected Phase 11: 19 JSON dictionaries — no en.json; EN is the markup baseline]").

| Line (10-RUNBOOK.md) | Stale text (verbatim) | Correction |
|----------------------|----------------------|------------|
| 3 | "The only code surface you ever touch is `geohist/index.html` (two tiny edits, §2)" | now **root `index.html`** |
| 38 (§2 title) | "## §2 · The flip — exactly two edits in `geohist/index.html`" | now root `index.html` |
| 80 (§3 step 1) | "test `https://geohisttrivia.com/geohist/`" | now test `https://geohisttrivia.com/` (landing moved to root in Phase 13; `/geohist/` is the meta-refresh-0 stub) |
| 84 (§3 step 2 node one-liner) | `const h=fs.readFileSync('geohist/index.html','utf8')` | now `fs.readFileSync('index.html','utf8')` |
| 118 (§6) | "Mirrors the in-file HTML comment next to the JSON-LD block in `geohist/index.html`" | comment now lives in root `index.html` (lines 20-35) |

Non-stale (checked, do NOT touch): §0 table content is path-neutral (row 2 describes position "directly under the hero Play badge CTA" — still true); §1 gate text path-free; §2 code snippets show only line content (paths identical in root file); §4/§5 path-free.

Mechanics: append at each of the 5 spots, e.g. line 38 becomes `## §2 · The flip — exactly two edits in `geohist/index.html` [corrected Phase 14, 2026-09-14: the landing now lives at root `index.html` — same two edits, new file path]`. Original line stays verbatim; correction appends. The §3 Rich-Results URL and the node one-liner get their corrections as bracketed appends immediately after (the runbook's owner re-reads them at flip time — the correction must sit exactly where the stale instruction is). The 14-RUNBOOK.md launch sequence **links** to 10-RUNBOOK §1/§2 for the Tier-1 flip rather than duplicating it, so the supersession note is the bridge.

### Q6 — Pinned flip order rationale

Order: **privacy-URL field → Play-link 200 verify → website field → Tier-1 rating flip.**

1. **Privacy-URL field FIRST** — it is the listing's compliance precondition: the Play Console app-content declarations (privacy policy URL) must be satisfiable before the listing can go live; the site side of it is already frozen and live (`/geohist/privacy.html`, MIG-07, live since Phase 1). Filling it first means the launch's hard dependency is closed before cosmetic steps. It is also the one field whose console flow was never verified end-to-end (STATE.md:96 bot-block) — doing it first surfaces any console surprise while there is still runway. [ASSUMED: exact console requirement wording — carry-over, see Assumptions A1]
2. **Play-link 200 verify SECOND** — the package URL (`https://play.google.com/store/apps/details?id=com.persano.geohisttrivia`) shipped in all 3 code surfaces at Phase 2 and **404s until the listing is live** (D-22: "launch-day swap requires zero code change" — the swap already happened pre-launch; only liveness changes). The 200 verify is the objective, no-tooling proof that the listing exists — and it is **gate input #1** of the Tier-1 flip gate (10-RUNBOOK §1: "The Google Play listing is live (the app page exists and is browsable)"). Verifying before the website field prevents a false "launch done" state while the listing is still propagating.
3. **Website field THIRD** — a console-side association (paste `https://geohisttrivia.com/`); it depends only on console access and the apex being live (true since Phase 8/13). Cheap, no gating power, and doing it after the 200-verify keeps every console edit after the "listing live" proof so the runbook never half-flips.
4. **Tier-1 rating flip LAST** — the only flip with a two-condition gate (10-RUNBOOK §1, verbatim): "1. **The Google Play listing is live** … 2. **A real aggregate rating is visible on the Play page** — the star score next to the install button," plus "**No minimum-count floor** … Never enter a number you did not see on the Play page itself." A rating cannot exist until the listing is live AND users have rated — it is structurally the last-possible flip. Its gate therefore sits at the END of the sequence, and the runbook must say: flip when the §1 gate passes, even if that is days/weeks after launch day (watch-item semantics per STATE.md: "Tier-1 rating row flip — 10-RUNBOOK §1 (real visible Play rating)" — a gated owner event, not a launch-day step).

**Phase 9 evidence-floor language cross-reference:** the other owner-gated flip (FIRE-10 App Check enforcement) uses a hard evidence floor (≥30 successful submissions + console ready-to-enforce, per 09-RUNBOOK §5-§6) — the Tier-1 flip deliberately has **no floor** (10-RUNBOOK §1: "one honest rating beats silence"). The 14-RUNBOOK must not import the ≥30 language into the rating flip; the two gates are named apart in ROADMAP watch items. [VERIFIED: STATE.md:102-103, ROADMAP.md:126-127]

### Q7 — Runbook format precedent (13-RUNBOOK / 13-UAT / 13-RECORDS / 10-RUNBOOK)

Verified structural pattern [VERIFIED: 13-RUNBOOK.md, 13-UAT.md, 13-RECORDS.md, 10-RUNBOOK.md all read this session]:

1. **Header block:** `# Phase N Owner Runbook — <purpose>`; **Audience:** line (name the owner, state what the owner touches vs what is agent-owned cross-reference); **Public-artifact notice** (near-verbatim template: "this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.**"); **When-to-execute** line (pre-staged, fires at a defined trigger, "Nothing in this runbook is a deploy precondition" phrasing); **Status legend:** ⬜ TODO (yours) · ✅ done (agent-verified) · 🔍 soft check (nice-to-have, non-blocking).
2. **§-numbered sections** with tables (prerequisite table with How-you-confirm column; expected-outcome columns); explicit do-not-do sections exist as guards (13-RUNBOOK §4 no-CoA is the model for anything the owner must NOT touch).
3. **Mechanical recording predicate** (13-UAT.md:15 verbatim): "any recorded issue is a blocker — there is no 'minor issue' reading. A row that later re-verifies green keeps its supersession note pointing at the original gap (repo convention)."
4. **UAT/RECORDS split (Phase 12/13 reframe precedent):** UAT holds **locally-runnable** rows (PRE-battery: `npm run validate`, gate one-liners, red-gate integrity re-checks); **post-ship/post-deploy rows live in RECORDS** (pre-staged `status: pending — executes post-deploy at UAT time`; "Do NOT fabricate outcomes"). 14's analog: launch-day owner console steps and live-URL checks are post-launch → the RECORDS pattern fits the launch-verification rows; locally-runnable rows (validate chain with the new gate, red-gate integrity, JSON-LD parse one-liner) fit UAT.
5. **Trailer line:** italic footer `*Phase N · <name> · runbook authored <date> by plan <id> · <predicate note>*`.

---

## Validation Architecture

*(Included per orchestrator request; note `workflow.nyquist_validation: false` in config — this section maps verification for the planner, it does not assume a TDD loop.)*

| Req | Behavior | Verification type | Automated command / method | Exists today? |
|-----|----------|-------------------|---------------------------|---------------|
| LKIT-01 | Runbook with pinned flip order, console-UI only | Human-runbook review + planner check (4 steps in pinned order; public-artifact notice; no secrets) | Read 14-RUNBOOK.md; grep for secrets (none expected) | ❌ Wave 0 (file created this phase) |
| LKIT-02 | Swap-ready inventory table (file:line + flip action) | Research/plan artifact check | Read 14-RUNBOOK.md §-inventory; spot-verify each file:line against tree | ❌ Wave 0 |
| LKIT-03 | Every `play.google.com` URL carries `details?id=com.persano.geohisttrivia` | CI gate + red-gate both directions | `node scripts/check-play-link.mjs`; `npm run validate:play-links`; red-gate cycles 1-6 (table above) | ❌ Wave 0 (script + package.json slot) |
| LKIT-04a | GA4 page-dimension note | Doc presence + no-code assertion | Read 14-RUNBOOK.md GA4 section; `git grep gtag` (zero code hits stays zero) | ❌ Wave 0 |
| LKIT-04b | 10-RUNBOOK supersession note | Doc edit + verbatim check | Read 10-RUNBOOK.md — 5 corrected spots, originals verbatim + dated bracketed appends; full `npm run validate` still green | ❌ Wave 0 |
| LKIT-04c | JSON-LD offers refresh-check step | Runbook step (launch-day) + local one-liner | 10-RUNBOOK §3-style node one-liner repointed at root `index.html` (parses JSON-LD, asserts no aggregateRating) | ❌ Wave 0 (step text) |

- **Per-task commit check:** `npm run validate` (new gate inside chain).
- **Phase gate:** full chain green + red-gate-proof.md complete + UAT battery pass.
- **Framework:** node built-ins only (`node --test` for any script test if the planner wants one; the old-domain gate ships with zero tests — precedent is red-gate proof instead). Node v26.5.1 on this machine [VERIFIED: node --version this session].

## Recommendations

Per requirement, concrete:

**LKIT-03 (gate) — build first; everything else references it.**
- Create `scripts/check-play-link.mjs`: zero-dep (node:fs/node:path), walk + ALLOW + hidden-skip + NUL-skip copied from `check-no-old-domain.mjs`; URL-shaped needle regex `/play\.google\.com\/[^\s"'<>\\)]+/g` per line; require `details?id=com.persano.geohisttrivia` after `&amp;`/`&#38;` normalization; optionally fail `http://play.google.com`; file:line hits to stderr, exit 1 / `check-play-link: OK` exit 0. Script's own source/comments self-pass (spell the full package URL wherever a URL-shaped literal appears, or keep comments prose-only).
- `package.json`: add `validate:play-links` between `validate:domain` and `validate:links`.
- Red-gate-proof.md with the 6 cycles from Q4.
- Scope statement in the script header: site-tree gate; `.planning/` historical records out of scope (verbatim-immutability), README.md/`.git`/node_modules out of scope (precedent).

**LKIT-02 (inventory) — land inside the runbook, not a separate file.**
- 14-RUNBOOK.md §"Surface inventory" = the 8-row table from Q1 (verified file:line, current value, flip action, zero-action markers). Every file:line re-verified at plan-write time (line numbers are current as of this research; any edit shifts them).

**LKIT-01 (runbook) — one new file, 13-RUNBOOK shape.**
- `.planning/phases/14-launch-kit/14-RUNBOOK.md`: header block (Audience/Public-artifact notice/When-to-execute/Status legend) → §1 Prerequisites (migration landed + deploy green + validate green incl. new gate) → §2 Surface inventory (LKIT-02) → §3 The pinned sequence: step 1 privacy-URL field (console-UI; expected outcome: field accepts `https://geohisttrivia.com/geohist/privacy.html`; owner-verifies console flow — carry-over caveat stated), step 2 Play-link 200 verify (browser fetch of the package URL; expected: live listing page), step 3 website field (paste `https://geohisttrivia.com/`), step 4 Tier-1 rating flip — **gated, may be a later day**: cross-reference 10-RUNBOOK §1/§2 (superseded paths) + the two edits against root `index.html` + deploy + ritual → §4 GA4 note (Q3's four bullets) → §5 JSON-LD offers refresh-check (Q2's verification step + the repointed node one-liner) → §6 Do-NOT-do guard (no aggregateRating ever; no `hl=`/`gl=` experiments on shipped URLs — PITFALLS.md:214; no Change-of-Address touch) → trailer line.
- Zero code change on launch day is an explicit runbook claim backed by this research (all 8 surfaces already swap-ready).

**LKIT-04 (addenda).**
- GA4 note + JSON-LD refresh step: §4/§5 of 14-RUNBOOK.md (above).
- 10-RUNBOOK supersession: 5 dated bracketed appends at lines 3, 38, 80, 84, 118 (exact corrections in Q5 table). One atomic doc edit; no other 10-RUNBOOK bytes touched.
- 14-UAT.md scaffold (locally-runnable PRE rows: full validate incl. new gate; gate red-gate integrity re-check; JSON-LD parse one-liner repointed to root) + 14-RECORDS.md (post-launch rows: Play-link 200 observed, website field live, Rich Results post-launch observation, GA4 Realtime observation) following the 12/13 reframe pattern.

**Plan-shape suggestion:** 2 plans, one wave: Plan 14-01 = gate script + package.json + red-gate proof + 10-RUNBOOK appends (code+gate wave); Plan 14-02 = 14-RUNBOOK.md + UAT/RECORDS scaffolds (docs wave). Order within 14-01: script → chain slot → positive control → mutations (mirror Phase 13's red-gate discipline; per-file distinct snapshot names).

## Risks & Edge Cases

1. **Naive needle FAILS the positive control.** `package.json:10` (`--skip "play.google.com"`) and `index.html:23` (comment prose) are bare-domain mentions without a path. Gate MUST be URL-shaped (`play.google.com/` + path) or the current tree is red. This is the single most likely implementation bug.
2. **HTML-escaped ampersands.** `href="...&hl=en"` renders as `&amp;hl=en` in serialized HTML. The id param is first in the canonical URL and its value never escapes, so the id check survives — but normalize `&amp;`/`&#38;` anyway (2 lines) so future URL forms with the id NOT first can't false-fail.
3. **`.planning/` scope trap.** Including `.planning/` fails on legitimate historical URLs (badge PNG intl URL, `details?id=...&hl=` illustration) and would force editing verbatim-immutable records. Exclude `.planning/` via ALLOW (precedent) and document the scope line in the script header so a future reader doesn't "fix" it.
4. **i18n dictionaries.** Verified zero Play URLs in all 19 dictionaries [VERIFIED this session] — but if a future dictionary ever embeds a URL, the gate catches it (dictionaries are not allowlisted). No interaction with the 178-key surface: the gate reads file text, never keys; keycheck untouched; `validate:links` skips untouched.
5. **Linkinator skip stays.** `--skip "play.google.com"` in `validate:links` must remain — linkinator's live-404 on the pre-launch URL is the reason the skip exists (PITFALLS.md:154-163); the new gate covers shape, linkinator stays skipped for liveness. Removing the skip would turn CI red pre-launch (vacuous-gate inversion).
6. **Script self-scan.** The walk scans `scripts/check-play-link.mjs` itself; its own regex/comment literals must be written so they don't self-trip (write the canonical package URL in its own comments, or escape the host in the regex source). The old-domain gate's runtime-assembly trick is unnecessary here if the source self-references the full id-bearing URL.
7. **Line-number drift.** All file:line citations in the inventory are as-of this research (post-Phase-13 tree). If any plan task edits `index.html` before the runbook lands, line numbers must be re-verified (planner: pin the inventory check as a task verification step).
8. **Play Console flow unverified (carry-over).** STATE.md:96 — the privacy-URL field flow was bot-blocked in prior research. The runbook frames console steps with expected outcomes + owner-verify language, not screen-by-screen pixel instructions. If the console field rejects the URL for any reason, that is a launch-day blocker discovered at the step — the runbook's rollback is simply "field not yet filled; investigate".
9. **The rating flip may happen days after launch day.** The runbook must NOT imply all four steps complete in one sitting — the Tier-1 flip is gate-driven (10-RUNBOOK §1) and is a watch item; steps 1-3 close launch day, step 4 fires when real ratings exist.
10. **`page: location.pathname` event param** — post-migration it is `/` for the landing; historical pre-migration events carry `/geohist/`. GA4 readings comparing launch-day `/` events with pre-migration data must account for the path change (one-line note in §4; no data migration).

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | Play Console requires a privacy-policy URL (the field exists in app content/compliance) before the listing can go live; website field is a console listing setting pasted as `https://geohisttrivia.com/` | Q1, Q6, Recommendations LKIT-01 | Low for build (runbook step framing is owner-verify regardless — carry-over from STATE.md:96); runbook ordering still holds (privacy field is the compliance-dependent step regardless of exact console screen) |
| A2 | Firebase Analytics SDK auto-sends `page_view` with `page_location` = full document URL by default; Play webview referrer often classifies as `(direct)` in GA4 | Q3 | None for build (note-only step, phrased as expect/verify); owner GA4 reading guidance slightly off at worst |
| A3 | `availability`/PreOrder key unnecessary for a free app's SoftwareApplication offers node (doc examples omit it; shipped shape passes Rich Results since Phase 5) | Q2 | None — shipped shape already validates; the refresh-check step catches any future drift |

Everything else in this file is repo-verified this session or fetched from Google's official doc (see Sources).

## Open Questions

1. **Exact Play Console screen paths for the two fields** (privacy-URL, website) — known-unknown by carry-over (STATE.md:96). Resolution: owner verifies at runbook-write/execution; 14-RUNBOOK frames steps as console-UI actions with expected outcomes. No build impact.
2. **Should the gate also enforce `http://` failure?** Recommended yes (1 extra condition, matches PITFALLS.md:163). Planner confirms with owner during discuss if undesired.

## Sources

### Primary (HIGH confidence)
- [VERIFIED: repo files read this session] `index.html` (full), `scripts/check-no-old-domain.mjs` (full), `package.json` (full), `js/consent.js` (full), `sitemap.xml` (full), `10-RUNBOOK.md` (full), `13-RUNBOOK.md` (full), `13-UAT.md` (full), `13-RECORDS.md` (head), `STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `.planning/config.json` + `git grep` inventories (play.google.com / play / gtag)
- [VERIFIED: developers.google.com/search/docs/appearance/structured-data/software-app — fetched live this session] verbatim: "If the app is available without payment, set `offers.price` to `0`"; free-app example `"offers": { "@type": "Offer", "price": 0 }`; paid example carries `"priceCurrency": "USD"`; worked example uses `"@type": "SoftwareApplication", "operatingSystem": "ANDROID", "applicationCategory": "GameApplication"` with an `offers` node

### Secondary (MEDIUM confidence)
- [CITED via repo docs] `.planning/research/PITFALLS.md` Pitfall 8 + row 214 (package-id gate design + no `hl=`/`gl=` params), 10-RUNBOOK §1/§6 gating language, 13-RUNBOOK/UAT/RECORDS format precedent — all quoted from files read this session

### Tertiary (LOW confidence)
- Play Console field flow specifics (Assumption A1) — owner-verifies in console

## RESEARCH COMPLETE

All 7 research questions answered with file:line evidence read this session; the JSON-LD is verified already offers-compliant (zero launch-day code change), the gate design resolves the bare-mention trap and the `.planning/` scope question, the 5 stale 10-RUNBOOK lines are enumerated verbatim, and the pinned order rationale is grounded in 10-RUNBOOK §1 + D-22 + the STATE carry-over. No blockers. Ready to plan Phase 14.
