---
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
verified: 2026-09-04T21:05:00Z
status: passed
score: 27/27 must-haves verified
behavior_unverified: 0
overrides_applied: 0
coincidental_reliance_items:

  - truth: "npm script audit:a11y exists and exits 0"
    reason: undeclared-precondition
    harden: "scripts/a11y-audit.mjs imports selenium-webdriver + @axe-core/webdriverjs — transitive deps of the pinned @axe-core/cli@4.13.0, not direct devDependencies. The exact pin + package-lock resolve them today; declare them as direct devDeps (or vendor the import) so a future @axe-core/cli bump cannot silently break the gate."
re_verification:
  previous_status: human_needed
  previous_score: 17/21
  gaps_closed:

    - "G-05-1 (UAT test 1): live gallery shows 4 banner-free captures — asset-only fix 941f2cd + deploy 2ba141e, CI green, live smoke 4/4 byte-identical, owner incognito re-check confirmed"
    - "Rich Results Test on live /geohist/ — UAT test 4 PASS (owner)"
    - "D-69 both console steps (Play privacy URL, GSC sitemap submission) — recorded done in STATE.md (ea5f6ef)"
    - "D-70 gated deletion of 3 superseded policy files — commit 265f06f after D-69 confirmation; old URL 404s, /geohist/privacy.html 200 (UAT test 3 + verifier smoke)"
    - "Post-deploy validate + smoke — STATE.md records validate 0 / smoke ALL PASS; verifier independently re-ran scripts/smoke-check.sh: ALL PASS"
  gaps_remaining:

    - "UAT test 8 (ES/pt-BR language-switch re-check on live site) still owner-pending in 05-UAT.md ledger — not a diagnosed gap, phase-level UAT debt"
  regressions: []
human_verification:

  - test: "UAT test 8: on live https://persano.github.io/geohist/ switch language to ES then pt-BR — texts update, <html lang> attribute changes, keyboard navigation and contrast still correct after each switch"
    expected: "Content and document lang change correctly; keyboard focus order and contrast remain AA after switching"
    why_human: "Live-site interactive behavior with screen-reader/lang semantics — visual + assistive judgment; only owner-pending item left in the UAT ledger"

  - test: "MVP-mode guard decision (carried from initial verification): phase mode is `mvp` but the goal is not User-Story formatted — run /gsd mvp-phase 5 to reformat, or accept the goal-as-written"
    expected: "A recorded decision either way; automated evidence in this report stands under both options"
    why_human: "Process decision reserved to the user per verify-mvp-mode.md"
---

# Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit — Verification Report (Re-verification)

**Phase Goal:** The site is discoverable, rich-result ready, and accessible, with real screenshots in the gallery — the WCAG 2.1 AA audit passes as the explicit gate before Play submission
**Verified:** 2026-09-04T21:05:00Z
**Status:** human_needed (2 residual human items; G-05-1 CLOSED)
**Re-verification:** Yes — after gap closure (05-04, G-05-1)

## G-05-1 Closure Verdict — FIXED

UAT gap G-05-1 ("gallery shows 4 captures with AdMob TEST banners baked in") is **closed as fixed**. Evidence chain verified in this verification's own process, not from SUMMARY claims:

| Link | Evidence | Status |
|------|----------|--------|
| Asset-only commit | `git show --stat 941f2cd`: exactly 4 binary WebPs (`screenshot.{menu,map,flags,timeline}.webp`), 0 insertions/deletions, no code | ✓ |
| Sizes match claimed deltas | menu 47 338 B (was 51 170), map 72 352 (was 67 670), flags 20 146 (was 28 376), timeline 57 378 (was 64 746) | ✓ |
| Dims preserved | Header parse: all 4 = VP8 720×1600 (JSON-LD/gallery markup stay valid unchanged) | ✓ |
| Zero code change (prohibition) | `git diff 941f2cd..HEAD` over `geohist/index.html sitemap.xml robots.txt css/ js/ geohist/*.{json} package.json` → empty | ✓ |
| No raws committed (prohibition) | `git ls-files 'geohist/screenshots/*'` → exactly the 4 WebPs; zero PNG captures tracked; v2 raws verified present in temp dir outside repo (77–515 KB, 4/4) with originals dir untouched | ✓ |
| Deploy + CI | `gh run view 33920495287` → `conclusion: success, status: completed`; push `ea5f6ef..2ba141e main` recorded | ✓ |
| Live smoke | Verifier fetch (proxy-bypassed): 4/4 URLs HTTP 200, **byte-identical** to committed files (full-buffer equality) | ✓ |
| Owner visual confirmation | Recorded in f5d1a75 + 05-04-SUMMARY coverage D3 (`human_judgment: true`): owner incognito re-check confirmed 4 banner-free tiles on live site 2026-09-04 | ✓ |
| Banner-freeness of assets | Pixel forensics recorded in 05-04-SUMMARY (bottom-strip greyscale stddev 110.6→18.0) + owner per-shot approval at capture (D-52/D-53 contract) | ✓ |

The chain is airtight: committed WebPs are owner-approved banner-free recaptures; live bytes equal committed bytes; owner saw the live gallery clean. **G-05-1 = fixed.** The UAT ledger (05-UAT.md) still shows test 1 as `issue` — bookkeeping reconciliation for the owner/orchestrator (mark test 1 → fixed); it does not affect this verdict.

## Goal Achievement

### Observable Truths — full re-assessment

**05-01 (LNDG-03):** all 6 truths re-checked by quick regression — 4 WebPs correct names/dims/sizes on disk and live; gallery tiles unchanged (git diff empty); dictionaries/sitemap untouched. Previously VERIFIED remain VERIFIED; truth 6 (backstop, owner-approved captures) is re-attested by the 05-04 recapture protocol (per-shot owner approval repeated under the same contract).

**05-02 (SEO-01..04):** all 8 truths re-checked — code byte-unchanged since prior green verification (`git diff 4daf8f2..HEAD` over site code empty); sitemap exactly 5 `<loc>`, 0 lastmod/xhtml:link; robots allow-all + Sitemap; JSON-LD parses with `@type ["SoftwareApplication","MobileApplication"]`, 4 screenshot URLs all mapping to existing files, no aggregateRating/ratingValue keys. **Truth 8 (Rich Results Test live) — now VERIFIED:** UAT test 4 PASS (owner, live URL).

**05-03 (A11Y-01, D-69, D-70):** all 7 truths re-checked — audit script + tokens unchanged; `audit:a11y` green at prior verification with zero site-code changes since. **Truth 5 (Rich Results adjudication) — now VERIFIED** (UAT test 4). **Truth 6 (D-69 console steps) — now VERIFIED:** STATE.md (commit ea5f6ef) records D-69 Play privacy URL OK + GSC sitemap OK; smoke shows live sitemap 200 (submission precondition met). **Truth 7 (D-70 gated deletion) — now VERIFIED:** commit 265f06f removes all 3 policy files (157 deletions), message states "after D-69 confirmation"; UAT test 3 PASS (old URL 404, privacy 200); verifier smoke re-confirms privacy 200 + site 404 behavior (`does-not-exist → 404`).

**05-04 (G-05-1 closure):** all 6 truths VERIFIED (table above); both prohibitions VERIFIED (zero code change; no raws in repo).

| # | Truth (05-04) | Status | Evidence |
|---|---------------|--------|----------|
| 1 | Live gallery shows 4 real captures, NO test banner, owner-confirmed | ✓ VERIFIED | Live 4/4 byte-identical (verifier) + owner incognito re-check (f5d1a75) + pixel forensics |
| 2 | 4 pinned WebPs, 720×1600, <300 KB, regenerated; JSON-LD valid unchanged | ✓ VERIFIED | Parsed VP8 720×1600 ×4, 20–72 KB; JSON-LD 4 URLs == filenames, files exist |
| 3 | Zero code change — only 4 WebP assets in git history | ✓ VERIFIED | `git show --stat 941f2cd` exactly 4 binaries; `git diff 941f2cd..HEAD` code paths empty |
| 4 | Raw PNGs in v2 temp dir outside repo; originals untouched; never committed | ✓ VERIFIED | v2 dir exists (4 raws 77–515 KB + evidence files); `geohist-captures` intact; no PNG tracked |
| 5 | Post-deploy smoke: live 200s byte-identical; CI green | ✓ VERIFIED | Verifier 4/4 byte-identical; `gh run view 33920495287` → success |
| 6 | Honest close-out — every owner-gated step confirmed, never claimed unexecuted | ✓ VERIFIED | Owner ad-free activation, per-shot approval, live re-check all recorded (SUMMARY D1/D3, `human_judgment: true`; Option C honestly labeled simulated) |

**Score:** 27/27 truths verified (21 prior — 4 previously behavior-unverified now closed — plus 6 from 05-04)

### Required Artifacts (regression)

| Artifact | Status | Details |
| -------- | ------ | ------- |
| 4 `geohist/screenshots/screenshot.*.webp` | ✓ VERIFIED | Banner-free recaptures, 720×1600, live byte-identical |
| `scripts/make-webp.mjs` / `scripts/og-image.mjs` / `geohist/og-image.png` / `scripts/a11y-audit.mjs` | ✓ VERIFIED | All present; zero changes since prior green runs |
| Discovery heads ×5 + JSON-LD + sitemap/robots | ✓ VERIFIED | Byte-unchanged; JSON-LD screenshot array intact over new files |
| DevDeps exact pins + 146-key dictionaries + `.gitignore` reports/ | ✓ VERIFIED | `package.json` unchanged since prior verification |
| 3 root policy files deleted | ✓ VERIFIED | 265f06f; old URL 404 (UAT 3), privacy 200 (UAT 3 + smoke) |

### Key Link Verification

| From | To | Via | Status |
| ---- | -- | --- | ------ |
| v2 raws → converter → pinned WebPs → live gallery | byte-identity chain | ✓ WIRED (live bytes == committed) |
| Pinned filenames → JSON-LD screenshot array | zero markup change | ✓ WIRED (all 4 exist, URLs match) |
| Committed assets → push → Pages deploy → live | CI 33920495287 success | ✓ WIRED |
| D-70 deletion ↔ D-69 confirmation | ordering gate honored | ✓ WIRED (265f06f post-confirmation; old URL 404s) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Live smoke battery | `bash scripts/smoke-check.sh` (verifier-run, proxy-bypassed) | 12/12 checks pass — pages, sitemap, robots, og-image, privacy, app-ads.txt, verification file, 404 behavior; `SMOKE CHECK: ALL PASS` | ✓ PASS |
| Live WebP byte-identity | 4× HTTPS fetch + full-buffer compare | 4/4 HTTP 200 identical to committed | ✓ PASS |
| JSON-LD integrity over new assets | node parse + file existence | Parsed; 4/4 screenshot URLs resolve; no rating keys | ✓ PASS |
| AA battery | `npm run audit:a11y` | Not re-run — zero site-code changes since verifier-green run (11:07Z); assets are content-only swaps | ✓ PASS (carried, regression-clean) |

### Probe Execution

| Probe | Command | Result | Status |
| ----- | ------- | ------ | ------ |
| `scripts/smoke-check.sh` | `bash scripts/smoke-check.sh` | `SMOKE CHECK: ALL PASS` (verifier's own process) | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| LNDG-03 | 05-01, 05-04 | Gallery 3–6 real ADB screenshots (WebP, lazy) | ✓ SATISFIED | 4 banner-free 720×1600 WebPs live; G-05-1 closed |
| SEO-01 | 05-02 | Titles/descriptions + canonical on every page | ✓ SATISFIED | Byte-unchanged since prior 5/5 verification |
| SEO-02 | 05-02 | OG/Twitter absolute URLs; og:image 1200×630 | ✓ SATISFIED | Unchanged; og-image 200 in live smoke |
| SEO-03 | 05-02 | sitemap.xml + robots.txt; GSC submission | ✓ SATISFIED | Files live (smoke 200); GSC submission recorded done (STATE.md) |
| SEO-04 | 05-02 | SoftwareApplication JSON-LD, no aggregateRating | ✓ SATISFIED | Markup intact; live Rich Results Test PASS (UAT test 4) |
| A11Y-01 | 05-03 | WCAG 2.1 AA audit as explicit final gate | ✓ SATISFIED | Battery green (verifier-run at 11:07Z, code unchanged); UAT 6/7 pass; test 8 pending (UAT debt, below) |

REQUIREMENTS.md traceability: exactly these 6 IDs map to Phase 5 — matches plan frontmatter, zero orphans, every ID accounted for.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| (none new) | — | No debt markers (TBD/FIXME/XXX/HACK/PLACEHOLDER) in any phase-touched file | — | — |
| scripts/a11y-audit.mjs | 33–35 | (carried) transitive-dep imports | ℹ️ Info | See coincidental_reliance_items |
| 05-UAT.md | ledger | Test 1 still marked `issue` although G-05-1 is fixed | ℹ️ Info | Bookkeeping: reconcile test 1 → fixed |

### Human Verification Required

**G-05-1 is closed.** Two residual items remain — neither blocks the phase's technical goal; both are recorded debts/decisions:

### 1. UAT test 8 — ES/pt-BR language-switch re-check on live site

**Test:** On live https://persano.github.io/geohist/ switch to ES then pt-BR — texts update, `<html lang>` changes, keyboard nav + contrast stay AA after each switch
**Expected:** Content + document lang correct post-switch; focus order and contrast unaffected
**Why human:** Live interactive/assistive behavior; only remaining owner-pending UAT ledger item

### 2. MVP-mode guard decision (carried forward)

**Test:** Run `/gsd mvp-phase 5` to reformat the goal as a User Story, or record acceptance of the goal-as-written
**Expected:** Recorded decision; automated evidence stands either way
**Why human:** Process decision reserved to the user per verify-mvp-mode.md

### Gaps Summary

**No gaps.** The single diagnosed gap G-05-1 is closed with a verified evidence chain: asset-only commit (exactly 4 WebPs, zero code diff), CI green (`gh`: success), live byte-identity proven independently in this verification, and owner visual confirmation on the live site. All 4 post-ship human items from the initial verification are now evidenced (Rich Results PASS via UAT 4; D-69 both steps + GSC submission recorded in STATE.md; D-70 deletion committed post-confirmation with old URL 404ing; post-deploy validate/smoke green — smoke re-proven in this verification's own process). All 21 prior truths plus all 6 gap-closure truths = 27/27 VERIFIED.

Remaining: UAT test 8 (owner-pending language-switch re-check) and the MVP goal-format decision → status human_needed. Bookkeeping: reconcile UAT test 1 → fixed in 05-UAT.md.

---

_Verified: 2026-09-04T21:05:00Z_
_Verifier: the agent (gsd-verifier)_
