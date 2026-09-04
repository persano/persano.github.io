---
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
verified: 2026-09-04T11:07:26Z
status: human_needed
score: 17/21 must-haves verified
behavior_unverified: 4
overrides_applied: 0
coincidental_reliance_items:
  - truth: "npm script audit:a11y exists and exits 0"
    reason: undeclared-precondition
    harden: "scripts/a11y-audit.mjs imports selenium-webdriver + @axe-core/webdriverjs — transitive deps of the pinned @axe-core/cli@4.13.0, not direct devDependencies. The exact pin + package-lock resolve them today; declare them as direct devDeps (or vendor the import) so a future @axe-core/cli bump cannot silently break the gate."
---

# Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit — Verification Report

**Phase Goal:** The site is discoverable, rich-result ready, and accessible, with real screenshots in the gallery — the WCAG 2.1 AA audit passes as the explicit gate before Play submission
**Verified:** 2026-09-04T11:07:26Z
**Status:** human_needed
**Re-verification:** No — initial verification

## ⚠️ MVP-Mode Guard Discrepancy (human decision required — not a gap)

ROADMAP.md sets `**Mode:** mvp` for this phase, but the phase goal is NOT in User Story format (`user-story.validate` → `false`; regex `/^As a .+, I want to .+, so that .+\.$/` does not match "The site is discoverable, rich-result ready, and accessible, …").

Per `verify-mvp-mode.md`, the verifier must surface this and ask the user to reformat. Verification was NOT refused: the roadmap defines 5 explicit, outcome-shaped Success Criteria (the `[outcome]` clauses the MVP narrowing would target), and the orchestrator explicitly directed must-have checking + VERIFICATION.md creation. The User Flow Coverage table below is therefore built from SC1–SC5 outcome clauses rather than a story's `[outcome]` slot.

**Decision for the user:** either run `/gsd mvp-phase 5` to set a proper User Story goal (then re-run UAT against it), or accept the goal-as-written for this phase. Automated evidence below stands either way.

## User Flow Coverage

Outcome coverage per roadmap SC (MVP-narrowed framing; each SC maps to codebase evidence below):

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Visit gallery | See 3–6 real device screenshots (WebP, lazy) | 4 WebPs `geohist/screenshots/screenshot.{menu,map,flags,timeline}.webp` (28–68 KB, parsed 720×1600); 4 `li.gallery-tile` img tiles `width=720 height=1600 loading=lazy` (geohist/index.html:101–119) | ✓ |
| Share/find a page | Correct title/desc/canonical + 1200×630 OG/Twitter card | 5/5 pages: canonical==og:url byte-equal, og:type website, absolute og:image + dims, twitter `name=` 4 / `property=` 0, og:title==`<title>` text, og:desc==meta desc | ✓ |
| Search engine crawl | sitemap + robots discoverable | sitemap.xml: exactly 5 `<loc>`, no dates, no alternates; robots.txt: allow-all + Sitemap line | ✓ (files) / ⚠️ (live + GSC submit) |
| Google rich result | SoftwareApplication detected, no rating | JSON-LD parsed from geohist/index.html: `@type ["SoftwareApplication","MobileApplication"]`, OS ANDROID, applicationCategory GameApplication, offers "0"/USD, 4 existing screenshot URLs, author, sameAs Play URL; rating-keys: `[]` | ✓ (markup) / ⚠️ (Rich Results Test on live URL) |
| Use the site with a disability | WCAG 2.1 AA clean, incl. after language switch | `npm run audit:a11y` re-run by verifier: axe critical/serious 0 ×5, Lighthouse a11y 100 ×5, `BATTERY: ALL PASS`, exit 0; owner-confirmed keyboard/form/language items 1–3 PASS (recorded) | ✓ |

## Goal Achievement

### Observable Truths — 05-01 (LNDG-03): Real Screenshots + Gallery

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | geohist/screenshots/ contains exactly 4 WebPs with pinned names | ✓ VERIFIED | `ls`: exactly screenshot.menu/map/flags/timeline.webp (28376/67670/51170/64746 B); parsed headers: all VP8 720×1600 |
| 2 | Every screenshot is a real device capture, owner-approved at capture time (D-53) | ✓ VERIFIED | Blocking human checkpoint completed (4/4 shots owner-approved, panel 720×1600, raws PNG-magic-verified >100 KB outside repo); WebP dims consistent with panel; raws never committed (git status clean of captures) |
| 3 | Gallery shows 4 real img tiles: dims match, loading=lazy, keyed alt via data-i18n-attr, keyed p.tile-caption | ✓ VERIFIED | geohist/index.html:101–119 — 4 tiles, `src="/geohist/screenshots/screenshot.*.webp"`, width=720 height=1600, `data-i18n-attr="alt:geohist.gallery.alt.*"`, `p.tile-caption` with `data-i18n="geohist.gallery.caption.*"` |
| 4 | Zero placeholder remnants (D-56); 3 retired keys gone from BOTH dictionaries | ✓ VERIFIED | Gallery section: 0 `<svg`, 0 li-level aria-label/data-i18n-attr, no intro paragraph (only keyed h2); retired keys (`gallery.intro`/`tile-aria`/`coming*`) absent from both dicts; keycheck exact-set gate green |
| 5 | validate:i18n passes, 146 keys 1:1 across es.json + pt-BR.json | ✓ VERIFIED | Ran `npm run validate`: `i18n-keycheck: PASS — es.json exactly covers the 146-key live surface` + same for pt-BR; node keyset diff: none; gallery key sets 9==9 (title + 4 alt + 4 caption) |
| 6 | (backstop) Shots read as clean game screens per owner discretion (D-53) | ✓ VERIFIED | Backstop evidence = directly observed behavior: per-shot owner approval recorded at capture; zero framing/crop decisions requested |

### Observable Truths — 05-02 (SEO-01..04): Discoverability

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | og-image.mjs regenerates geohist/og-image.png at 1200×630 from base.css tokens, Georgia stack, icon composite | ✓ VERIFIED | scripts/og-image.mjs lines 2–17 quote tokens (#1a1410/#f0e6d2/#d9a951, Georgia, icon.png, 176px); artifact parsed: PNG 1200×630 (99 011 B); npm script `og:image` present; sharp exact-pinned |
| 2 | All 5 content pages carry full discovery block, byte-identical title/desc into og:/twitter: | ✓ VERIFIED | Grep battery ×5: canonical==og:url, og:type=website, og:image absolute + width=1200/height=630, twitter name=4/property=0; og:desc==meta 5/5; og:title==title text 5/5 |
| 3 | JSON-LD in corrected rich-result form on /geohist/ (flagged D-61 deviation recorded in plan header) | ✓ VERIFIED | Parsed JSON-LD: all D-61 fields present + non-empty; description byte-identical to meta desc; 4 screenshot URLs all resolve to existing files; offers price "0" string/USD |
| 4 | JSON-LD exists ONLY on /geohist/; other pages schema-clean | ✓ VERIFIED | ld+json count: 1 (geohist/index.html), 0 on hub/guide/contact/privacy |
| 5 | 404.html requires no edit — noindex + title only | ✓ VERIFIED | `git diff --stat 404.html` empty; 0 canonical/og:/twitter: matches in 404.html |
| 6 | sitemap.xml exactly 5 URLs, no dates, no alternates; robots.txt exactly allow-all + sitemap line | ✓ VERIFIED | sitemap.xml read: 5 `<loc>`, no lastmod/date, no xhtml:link; robots.txt: 3 content lines exactly as pinned |
| 7 | canonical == og:url byte-for-byte; every sitemap loc matches canonical form | ✓ VERIFIED | All 5 pages byte-equal pairs; sitemap locs identical strings to page canonicals (directory form for both roots) |
| 8 | (backstop) Rich Results Test on live /geohist/ detects SoftwareApplication, zero errors | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Markup complete (truth 3); the test runs against the deployed URL — impossible pre-ship (deferred-commit; deployed site still serves old page). → Human Verification #1 |

### Observable Truths — 05-03 (A11Y-01, D-69, D-70): AA Gate + Gated Cleanup

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | a11y-audit.mjs runs the automated AA gate (127.0.0.1 http server at repo root, 5 URLs, axe crit/ser==0 + LH ≥95, reports/ JSON, non-zero exit on failure) | ✓ VERIFIED | Script read: server binds `127.0.0.1` ephemeral port (line 119), PAGES = 5 content URLs (lines 59–65), gate `axePass && lhPass` (line 296–305), writes reports/a11y-summary.json, `process.exit(allPass ? 0 : 1)` (line 342); zero file-scheme scan URLs (only a comment references Pitfall 7) |
| 2 | npm run audit:a11y exists and exits 0 | ✓ VERIFIED (coincidental-reliance) | Verifier re-ran in own process: `BATTERY: ALL PASS`, EXIT 0 — axe 0/0 ×5, LH 100 ×5, allPass:true written to reports/. Reliance flag: imports transitive deps of pinned @axe-core/cli — see coincidental_reliance_items |
| 3 | Palette verified, not redesigned; base.css tokens byte-unchanged | ✓ VERIFIED | `git diff css/base.css` empty; all 7 recorded token values present (incl. `--color-ink-on-gold: #2a1f12`); header contrast table intact |
| 4 | (backstop) Owner manual AA battery honestly recorded — PENDING until owner reports | ✓ VERIFIED | Honest close-out holds: battery ran, items 1–3 (keyboard/focus, form labels + empty-submit inline error, ES/pt-BR lang-switch re-check) owner-confirmed PASS, item 4 recorded PENDING — zero unexecuted items claimed passed |
| 5 | (backstop) Rich Results Test owner-side adjudication (SC4) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Same as 05-02 truth 8 — deployed URL pre-ship. → Human Verification #1 |
| 6 | Owner confirms BOTH D-69 console steps in order (Play privacy URL, then GSC sitemap after live deploy) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Correctly NOT done: precondition check showed live sitemap.xml → 404 (wave-2 uncommitted) — gate unmet; checkpoint recorded OPEN. Console actions have no pre-ship surface. → Human Verification #2/#3 |
| 7 | 3 superseded policy files deleted ONLY after D-69 confirmation, riding final deploy | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Invariant half VERIFIED now: all 3 files present, `git diff` empty — deletion correctly withheld (gate honored). Completion half (delete + old-URL 404 + privacy 200) is post-ship. → Human Verification #4 |

**Score:** 17/21 truths verified (4 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `geohist/screenshots/screenshot.{menu,map,flags,timeline}.webp` | 4 real WebP captures, pinned names | ✓ VERIFIED | Exact names; 720×1600; 28–68 KB; dims feed gallery markup |
| `scripts/make-webp.mjs` | Raw-PNG→WebP converter | ✓ VERIFIED | Exists; `convert:screenshots` npm script present |
| `scripts/og-image.mjs` + `geohist/og-image.png` | 1200×630 regenerable brand image | ✓ VERIFIED | Script + artifact + `og:image` script |
| `scripts/a11y-audit.mjs` + `audit:a11y` | Repeatable AA gate | ✓ VERIFIED | Ran green in verifier process |
| Discovery heads ×5 pages | canonical/OG/Twitter blocks | ✓ VERIFIED | Full blocks, byte-identical mirrors |
| SoftwareApplication JSON-LD | /geohist/ only | ✓ VERIFIED | Corrected form, complete |
| `sitemap.xml` + `robots.txt` | 5-URL sitemap; allow-all + Sitemap | ✓ VERIFIED | Exact pinned form |
| DevDeps sharp/axe/lighthouse exact pins | 0.35.4 / 4.13.0 / 13.4.1, no carets | ✓ VERIFIED | package.json exact strings; lockfile resolves exact versions |
| 8 new + 3 retired dictionary keys | Both dicts, 146 keys 1:1 | ✓ VERIFIED | keycheck PASS ×2; keyset diff none |
| Deletions: 3 root policy files | Gated on D-70 (post-ship) | ✓ CORRECTLY WITHHELD | Files present, byte-untouched — gate honored |
| `.gitignore` += reports/ | Battery output uncommitted | ✓ VERIFIED | Present in .gitignore; reports/ exists with 5 LH JSONs + summary |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| Raw PNG (outside repo) | scripts/make-webp.mjs → WebPs → gallery img src | converter | ✓ WIRED | Gallery src paths == committed WebP filenames; CROPS map empty (no crop decisions recorded) |
| Gallery keyed captions/alts | es.json + pt-BR.json | scripts/i18n-keycheck.mjs exact-set parity | ✓ WIRED | keycheck PASS ×2; markup and dictionaries in same change-set |
| Pinned screenshot filenames | JSON-LD screenshot array | 05-02 dependency | ✓ WIRED | 4 absolute URLs in JSON-LD == pinned filenames; all files exist |
| og-image.mjs | css/base.css design tokens | quoted verbatim | ✓ WIRED | Tokens + Georgia in script header/constants |
| JSON-LD description | geohist meta description | single source | ✓ WIRED | Byte-identical (node comparison: true) |
| canonical ↔ og:url ↔ sitemap loc | one URL form per page | D-68 | ✓ WIRED | Byte-equal on all 5 pages; sitemap locs match |
| Battery | local http server at repo root | absolute /css /js resolve | ✓ WIRED | Server binds 127.0.0.1:ephemeral, serves repo root; scan ran green |
| Battery thresholds | phase SC5 + A11Y-01 | axe 0 crit/ser, LH ≥95 | ✓ WIRED | Gate constants in script; thresholds met ×5 |
| D-70 deletion ↔ D-69 confirmation | ordering gate | withheld | ✓ WIRED | Deletion not performed; files untouched |
| GSC submission ↔ live sitemap deploy | timing gate | open | ✓ WIRED (held) | Precondition checked (live 404), submission correctly not claimed |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| Gallery img tiles | src/width/height/alt/caption | Real device captures + i18n dictionaries | Yes (parsed 720×1600 VP8; keycheck exact-cover) | ✓ FLOWING |
| JSON-LD screenshot array | 4 URLs | 05-01 committed files | Yes (all 4 exist on disk) | ✓ FLOWING |
| Head blocks ×5 | title/desc strings | Per-page `<title>`/`<meta name="description">` | Yes (byte-equality proven 5/5) | ✓ FLOWING |
| og-image.png | tokens + icon.png | css/base.css + geohist/icon.png | Yes (1200×630 parsed; script regenerable) | ✓ FLOWING |
| a11y-summary.json | per-page axe/LH results | Live local scan of real pages | Yes (re-generated by verifier run) | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Validation chain green | `npm run validate` | exit 0 (html-validate clean; keycheck PASS ×2 146 keys; linkinator scans 0 links — pre-existing 8.x quirk, noted in both SUMMARYs) | ✓ PASS |
| AA battery green | `npm run audit:a11y` | exit 0; axe 0/0 ×5; LH 100 ×5; `BATTERY: ALL PASS`; reports/ regenerated | ✓ PASS |
| WebP/PNG dims correct | node header parser | 4×720×1600 VP8; og-image 1200×630 PNG | ✓ PASS |
| JSON-LD parses + fields + screenshots exist | node extraction | Parsed; rating-keys []; desc==meta; 4/4 files exist | ✓ PASS |
| Rich Results Test (live) | — | Requires deployed URL | ? SKIP → human |

### Probe Execution

| Probe | Command | Result | Status |
| ----- | ------- | ------ | ------ |
| `scripts/smoke-check.sh` | `bash scripts/smoke-check.sh` | NOT RUN — hits live URLs; site not deployed yet (deferred-commit); recorded PENDING post-ship in 05-02-SUMMARY | ? SKIP (would fail against un-deployed live site; not a code defect) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| LNDG-03 | 05-01 | Gallery 3–6 real ADB screenshots (WebP, lazy-load) | ✓ SATISFIED | 4 real 720×1600 WebPs, lazy, placeholders fully replaced |
| SEO-01 | 05-02 | Meta titles/descriptions + canonical on every page | ✓ SATISFIED | 5/5 pages + 404 correctly excluded (noindex only) |
| SEO-02 | 05-02 | OG/Twitter absolute URLs; og:image 1200×630 | ✓ SATISFIED | 5/5 pages, absolute, dims declared |
| SEO-03 | 05-02 | sitemap.xml + robots.txt; GSC submission | ✓ SATISFIED (code) / ⚠️ GSC submit pending (human) | Files exact; submission = D-69 step 2 post-ship |
| SEO-04 | 05-02 | SoftwareApplication JSON-LD, no aggregateRating | ✓ SATISFIED (code) / ⚠️ live test pending (human) | Corrected form complete, rating-keys []; Rich Results = post-ship |
| A11Y-01 | 05-03 | WCAG 2.1 AA audit as explicit final gate | ✓ SATISFIED (automated + owner items 1–3) | Verifier re-ran battery: ALL PASS exit 0; manual items recorded |

REQUIREMENTS.md traceability table (lines 98, 116–120): exactly these 6 IDs map to Phase 5 — matches plan frontmatter with zero orphans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| (none) | — | Debt-marker scan (TBD/FIXME/XXX/HACK/PLACEHOLDER/coming-soon/not-yet-implemented) across all 15 phase files: 0 hits | — | — |
| scripts/a11y-audit.mjs | 33–35 | Imports `selenium-webdriver` + `@axe-core/webdriverjs` — transitive deps of pinned `@axe-core/cli`, not direct devDeps | ℹ️ Info | Works under the exact pin (lockfile-resolved); declare as direct devDeps to de-fragilize |
| package-lock.json | root | Lockfile root devDeps carry caret ranges (`^4.13.0` etc.) while package.json is exact-pinned | ℹ️ Info | package.json (the source of truth for the plan's pin check) is exact; lockfile ranges resolve to exact versions — cosmetic inconsistency only |

### Human Verification Required

**Decision item (MVP guard):** Phase mode is `mvp` but the goal is not User-Story formatted. Run `/gsd mvp-phase 5` to reformat, or accept the goal-as-written. Automated evidence above stands either way.

Post-ship items (deferred-commit mode — all correctly recorded PENDING in SUMMARYs, none claimed passed; execute in this order):

### 1. Rich Results Test on live /geohist/ (SC4 adjudication)

**Test:** After the ship deploy is green, open https://search.google.com/test/rich-results and test `https://persano.github.io/geohist/`
**Expected:** SoftwareApplication detected with zero errors; a note about the absent optional rating field is expected and acceptable (Pitfall 8)
**Why human:** Requires the deployed URL — impossible pre-ship; owner-side check by phase design

### 2. D-69 step 1 — Play Console privacy-URL field

**Test:** Play Console → App content → Privacy policy → set to `https://persano.github.io/geohist/privacy.html`, save, confirm field shows that exact value
**Expected:** Field displays the exact URL; **must be done FIRST** (it is what makes the old root policy URL safe to remove, D-70)
**Why human:** Console-side owner action; no API surface

### 3. D-69 step 2 — Search Console sitemap submission

**Test:** After deploy, verify `https://persano.github.io/sitemap.xml` returns 200, then Search Console (property persano.github.io) → Sitemaps → submit `https://persano.github.io/sitemap.xml`
**Expected:** GSC reports submission received (first-processing status fine)
**Why human:** Console-side owner action; timing-gated on the live deploy (Pitfall 10)

### 4. D-70 — gated deletion of 3 superseded policy files

**Test:** Only after item 2 confirmed: delete `GeoHist_Trivia_Privacy_Policy.html/.md/.pdf`; deletion rides the deploy; then check `/geohist/privacy.html` = 200, old policy URL = 404, `npm run validate` exit 0, `bash scripts/smoke-check.sh` = ALL PASS
**Expected:** Old URL 404s, new privacy URL stays 200, full battery green
**Why human:** Executor action gated on owner confirmation; ordering invariant observable only post-deploy

### 5. Post-deploy validate + smoke (05-02 close-out)

**Test:** After the ship deploy: `npm run validate` (linkinator now reaches live og-image URL) and `bash scripts/smoke-check.sh`
**Expected:** validate exit 0; smoke prints `SMOKE CHECK: ALL PASS` (og-image, sitemap, robots, all pages 200)
**Why human:** Requires live deployment (orchestrator-owned push)

### Gaps Summary

**No gaps.** All 21 plan-level must-have truths resolve to VERIFIED (17) or PRESENT_BEHAVIOR_UNVERIFIED (4), with zero FAILED artifacts, zero NOT_WIRED links, zero blockers, and zero debt markers. Every artifact is present, substantive, and wired; all data flows terminate in real sources (real device captures, real dictionaries, real page markup).

The 4 behavior-unverified truths are structurally impossible to exercise pre-ship under deferred-commit mode (live Rich Results Test, GSC submission + live sitemap, D-69 console confirmations, D-70 gated deletion) — each is the honest post-ship debt the phase's own close-out contract prescribes, recorded identically in the SUMMARYs, and routed here as human items, not gaps. The D-70 ordering gate and the honest-PENDING prohibition were both honored in the working tree (policy files byte-untouched; no unexecuted battery item claimed passed).

The AA gate — the phase's explicit exit criterion — was independently re-executed by the verifier in its own process and is green: `npm run audit:a11y` exit 0, axe critical/serious 0 ×5, Lighthouse accessibility 100 ×5, palette tokens byte-unchanged.

Once the 5 post-ship human items (plus the MVP-format decision) complete after `/gsd-ship`, this phase is fully closed.

---

_Verified: 2026-09-04T11:07:26Z_
_Verifier: the agent (gsd-verifier)_
