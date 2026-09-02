---
phase: 02-geohist-landing-hub-content-en-i18n-keys-baked-in
verified: 2026-09-02T05:59:18Z
status: human_needed
score: 13/14 must-haves verified
behavior_unverified: 1
overrides_applied: 0
behavior_unverified_items:
  - truth: "All pages render correctly at phone widths (mobile-first responsive) — Roadmap SC4"
    test: "After the single controlled push, open /, /geohist/, /geohist/guide.html, /geohist/privacy.html at 320px and 375px viewport width"
    expected: "Hero above the fold with legible badge; nav wraps cleanly; gallery tiles keep phone aspect; tile captions on solid strip; hub card proportioned (no stretch); texture never behind body copy"
    why_human: "Visual rendering is not provable by markup/CSS grep; the plans' <human-check> explicitly defers this to end-of-phase owner inspection (02-01 coverage D7, 02-02 coverage D5)"
human_verification:
  - test: "Post-deploy smoke: orchestrator executes the single controlled push (branch is ahead of origin/main by 14 commits, push pending), waits for CI validate job green, then loads /geohist/, /geohist/guide.html, /, /geohist/privacy.html"
    expected: "CI validate green; all four URLs return HTTP 200 and show the dark antique theme"
    why_human: "Push-to-main is orchestrator-owned (STATE.md Phase-01 pattern; executor barred from pushing); live URLs cannot be checked before the push exists"
  - test: "Phone-width sweep at 320/375px on all five pages after deploy (plans' <human-check>, merged)"
    expected: "See behavior_unverified_items entry — responsive invariants hold visually"
    why_human: "Visual rendering; no automated path proves it"
  - test: "Prohibition review (judgment-tier, LLM-judge verdicts below are NON-AUTHORITATIVE): owner skims landing/guide/hub copy for data-claim drift, hub filler, and i18n approach violations"
    expected: "No data-collection wording outside the policy-mirrored FAQ; no 'more apps' filler; no hreflang/subdirs/redirect scripts"
    why_human: "Judgment-tier prohibitions route to human review per ADR-550 D4; grep evidence recorded but not authoritative"
---

# Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in) — Verification Report

**Phase Goal:** Players and prospective players can learn about GeoHist Trivia from a complete English landing site; the hub introduces the Persano brand with exactly one app card
**Verified:** 2026-09-02T05:59:18Z
**Status:** human_needed (1 behavior-unverified truth + deploy-pending smoke checks; zero gaps)
**Re-verification:** No — initial verification

**MVP-mode note:** The raw ROADMAP goal line is not in `As a …, I want to …, so that ….` format (`gsd-tools query user-story.validate` → `false`). Both plans restated it 1:1 as valid User Stories (`user-story.validate` → `true` for 02-01's restatement; 02-02's follows the same validated shape), so User Flow Coverage below is judged against the plan-carried stories — the format discrepancy is surfaced here for the owner (optionally normalize via `/gsd mvp-phase 2`).

## Goal Achievement

### User Flow Coverage (MVP mode — 02-01/02-02 validated user stories)

| # | Step | Expected | Evidence in codebase | Status |
|---|------|----------|---------------------|--------|
| 1 | Prospective player opens `/geohist/` | Dark antique hero: app icon, name, tagline, description | `geohist/index.html:20-30` — hero-icon img (192×192 asset verified), h1 "GeoHist Trivia", tagline, desc, all keyed | ✓ |
| 2 | Player scans what the game offers | Categorized feature list from README facts | `geohist/index.html:32-61` — exactly 4 `.feature-group` (Trivia×3 items, Play Games×1, Offline×2, IAP×1), zero data-claim wording | ✓ |
| 3 | Player previews the game | Screenshot gallery | `geohist/index.html:63-90` — 3 keyed phone-aspect tiles (intentional Phase-5 skeleton, D-13/D-23; real WebPs are Phase 5) | ✓ |
| 4 | Player gets answers | FAQ incl. data collection / offline / devices mirroring the policy | `geohist/index.html:92-127` — 8 `<details name="geohist-faq">`; all verbatim phrases grep-hit (see Key Links) | ✓ |
| 5 | Player gets the game | Visible Play button, placeholder href by design, swappable in one place | `geohist/index.html:27-29` — one anchor, literal package URL, `rel="noopener"`, local official badge PNG 646×250 verified from headers | ✓ |
| 6 | Player knows who made it | About-the-developer: Santiago David Postorivo / Persano | `geohist/index.html:129-133` — verbatim entity string + 2 mailto links | ✓ |
| 7 | Visitor opens `/` (hub) | Persano brand intro + exactly one app card, no placeholders | `index.html:12-22` — h1 "Persano", 2 keyed intro paragraphs naming Santiago David Postorivo, one `.app-card` in a real `.app-grid`, "Learn more" → `/geohist/`; zero filler strings | ✓ |
| 8 | Visitor reads the guide | How to play + game modes, ~1–2 screens | `geohist/guide.html:20-68` — h1 + intro + 4 keyed steps, 8 `.mode-item` entries (Flags→World Passport, README-verified set) | ✓ |

**Outcome clause** ("understand what the game offers before the listing goes live"): fully enabled in markup and validated by `npm run validate` (exit 0). Final visual confirmation rides the human items below.

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `/geohist/` renders hero (name, tagline, desc, icon) + badge CTA (SC1, 02-01 T1) | ✓ VERIFIED | `geohist/index.html:20-30`; package URL ×1 exact; assets verified 192×192 / 646×250 from image headers |
| 2 | Four categorized feature groups, every category ≥1 item (SC1, 02-01 T2) | ✓ VERIFIED | `geohist/index.html:34-60` — Trivia(3), Play Games(1), Offline(2), IAP(1); no empty `<ul>` |
| 3 | Gallery skeleton: heading + keyed intro + 3 phone-aspect tiles with keyed captions (02-01 T3, D-13/D-23) | ✓ VERIFIED | `geohist/index.html:63-90` — 3 tiles, aria-hidden SVG motifs, keyed `data-i18n-attr` aria-labels, no tile ids, 3× `geohist.gallery.coming`; `aspect-ratio: 9/19.5` at `css/base.css:204` |
| 4 | FAQ 7-8 native details items; data answers quote privacy.html verbatim (SC1, 02-01 T4, CMPL-04) | ✓ VERIFIED | 8 `<details name="geohist-faq">` at `geohist/index.html:94-126`; verbatim greps: "works mostly locally" 2×, no-collection phrase 1×, local-save phrase 3×, retention sentence 1×, 5 SDK labels 1× each, "handled entirely by Google" 1×, "Android 7.0 (API 24)" 1× — all present in `geohist/privacy.html` too |
| 5 | About-dev names entity verbatim + contact email (02-01 T5, CONT-03) | ✓ VERIFIED | `geohist/index.html:130-132` — "Persano, the personal brand of Santiago David Postorivo" exact + mailto |
| 6 | Nav (Game/Guide/FAQ/Privacy) + footer (privacy, mailto, Back to hub, copyright, #lang-switcher-slot) on landing (02-01 T6) | ✓ VERIFIED | `geohist/index.html:11-18` + `135-143`; `#lang-switcher-slot` present, `hidden` |
| 7 | Every user-visible string carries data-i18n / data-i18n-attr keys (SC5b, 02-01 T7, 02-02 T4) | ✓ VERIFIED | Keyed nodes: landing 56, guide 36, hub 11; markup review of all three files shows every text node/attribute-alt keyed; `<title>` keyed on all 3 pages; meta description EN-only flagged for Phase 3 per plan |
| 8 | Palette contrast passes at design time, ratios recorded (SC5c, 02-01 T8) | ✓ VERIFIED | All 8 pairs recomputed with WCAG 2.2 relative-luminance formula: 14.72 / 13.55 / 9.38 / 8.64 / 8.46 / 7.79 / 9.30 / 7.48 — exact match to `02-01-PLAN.md` table and `css/base.css:4-10` comment; no `prefers-color-scheme` (grep=0) |
| 9 | guide.html explains how to play + game modes (~1-2 screens) (SC2, 02-02 T1) | ✓ VERIFIED | `geohist/guide.html:20-73` — keyed h1 + intro + 4 steps, 8 modes, closing link back; 36 `guide.*` keys; zero `<script>`; zero data claims (the "collect" hit is "collection" in World Passport copy — not a data claim) |
| 10 | Hub shows Persano brand intro + exactly one app card, no visible placeholders (SC5, 02-02 T2) | ✓ VERIFIED | `index.html:12-22` — one `.app-card`, real `.app-grid`, keyed icon alt/name/desc/CTA; zero "more apps" filler; no second-card stub |
| 11 | Play button visible with placeholder href — visually final, swappable in one place (SC3) | ✓ VERIFIED | `geohist/index.html:27` — href literal `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` on a single anchor (one swap point), official badge PNG hosted locally, never recolored (binary unmodified from download) |
| 12 | Internal links all resolve (02-02 T5) | ✓ VERIFIED | Manual resolution: `/css/base.css`, `/geohist/`, `/geohist/icon.png`, `/geohist/google-play-badge.png`, `/geohist/guide.html`, `/geohist/index.html`, `/geohist/privacy.html` all `Test-Path` True across 5 pages; `npm run validate` exit 0 (linkinator step exited 0; it scanned 0 local links, so resolution proven manually) |
| 13 | Regression-safe: privacy.html inherits theme untouched; 404.html self-contained (02-02 T6) | ✓ VERIFIED | `git diff --stat c7d1867..HEAD -- 404.html geohist/privacy.html` → empty; privacy link present on all 5 pages |
| 14 | All pages render correctly at phone widths (SC4) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Foundations present + wired: viewport meta ×5, fluid `clamp()` type, `auto-fill` grids, `flex-wrap` nav, 42rem column, caption-on-solid-strip. No test exercises the rendered invariant — routed to human verification |

**Score:** 13/14 truths verified (1 present, behavior-unverified)

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Real screenshots replace the 3 gallery placeholder tiles | Phase 5 | ROADMAP Phase 5 SC1: "The gallery shows 3–6 real screenshots captured via ADB from a connected phone (WebP, lazy-load)"; 02-01-SUMMARY Known Stubs records the skeleton as intentional (D-13/D-23) |

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `geohist/index.html` | Landing: hero, features, gallery skeleton, FAQ, About-dev, badge CTA, nav, footer | ✓ VERIFIED | 145 lines; all sections present; zero `<script>`; unique ids; h1→h2 sequential |
| `geohist/guide.html` | How-to-play + game modes, nav + footer, keys baked | ✓ VERIFIED | 85 lines; 8 mode-items; zero `<script>`; reuses landing nav/footer pattern |
| `index.html` | Full hub: brand intro + single app card | ✓ VERIFIED | 33 lines; one `.app-card`; zero `<script>`; footer drops Back-to-hub per plan |
| `css/base.css` | Dark antique tokens + display font + texture utilities + full component class set | ✓ VERIFIED | 377 lines; 7 `--color-*` tokens at locked hexes; `--font-display`; `:focus-visible` gold; all classes used by ≥1 page (`WIRED`); no light-mode variant |
| `geohist/icon.png` | 192×192 launcher PNG | ✓ VERIFIED | Header-verified 192×192, 59,348 bytes |
| `geohist/google-play-badge.png` | Official 646×250 badge PNG, local | ✓ VERIFIED | Header-verified 646×250, 4,904 bytes |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `css/base.css` tokens | every page | `<link rel="stylesheet" href="/css/base.css">` | ✓ WIRED | Present in landing:8, guide:8, hub:8 (+ phase-1 privacy.html) — theme swap restyles all pages via shared tokens |
| badge href | `play.google.com/.../com.persano.geohisttrivia` | anchor href | ✓ WIRED | Exact URL ×1 in `geohist/index.html:27` — single swap point (D-22); `rel="noopener"` |
| FAQ data answers | `geohist/privacy.html` | verbatim phrase mirror (CMPL-04) | ✓ WIRED | 11/11 shared phrases grep-hit in both files; guide/hub carry zero data claims (no drift possible) |
| data-i18n keys | Phase 3 dictionaries (D-20) | keyed surface 1:1 | ✓ WIRED (consumer deferred) | geohist.*/guide.*/hub.* namespaces locked in markup; dictionaries are Phase 3 scope (I18N-01..04) — key surface complete by phase contract |
| hub app card | `/geohist/` | "Learn more" href | ✓ WIRED | `index.html:20` |
| landing nav "Guide" | `/geohist/guide.html` | nav link | ✓ WIRED | Resolved by this plan; file exists |

### Data-Flow Trace (Level 4)

N/A — static content site. Every rendered value is authored copy baked into markup; there is no DB query, fetch, store, or mock chain anywhere in the phase's files (zero `<script>` enforces this). No HOLLOW/STATIC/DISCONNECTED patterns possible by construction.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| HTML validity, all 5 pages | `npm run validate` (html-validate over `index.html 404.html geohist/*.html`) | exit 0, no diagnostics | ✓ PASS |
| Link check step | `npm run validate` (linkinator) | exit 0 — but scanned 0 links (likely local-file mode quirk); compensated by manual `Test-Path` resolution of every internal href (all True) | ✓ PASS (with caveat) |
| Asset integrity | `System.Drawing` header read | icon 192×192, badge 646×250, nonzero bytes | ✓ PASS |
| Contrast math | node WCAG 2.2 recompute (8 pairs) | ratios exactly match recorded values | ✓ PASS |
| Zero-JS constraint | `<script` grep ×5 pages | 0 everywhere | ✓ PASS |
| No superseded i18n | `hreflang` grep + `/es/`,`/pt/` dir scan | 0 / none | ✓ PASS |

### Probe Execution

SKIPPED — no probes declared in either PLAN, no `scripts/**/probe-*.sh` found; static-markup phase, not a migration/tooling phase.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| LNDG-01 | 02-01 | Hero: app name, tagline, description, icon | ✓ SATISFIED | `geohist/index.html:20-30` |
| LNDG-02 | 02-01 | Categorized feature list from README | ✓ SATISFIED | 4 groups at `geohist/index.html:32-61`; items match README facts (Compose UI, Play Games, offline sync, Remove Ads) |
| LNDG-04 | 02-01 | Play button present, placeholder href, trivially swappable | ✓ SATISFIED | Single anchor href = package URL; badge PNG local; one-line swap |
| LNDG-05 | 02-01 + 02-02 | Mobile-first responsive | ✓ SATISFIED (foundations) | viewport ×5, clamp type, auto-fill grids, flex-wrap nav; visual phone-width check → human |
| CONT-01 | 02-01 | FAQ: data collection, offline, devices — mirrors policy | ✓ SATISFIED | 8 items; verbatim mirror grep-proven |
| CONT-02 | 02-02 | Guide page: how to play, game modes | ✓ SATISFIED | `geohist/guide.html:20-68` |
| CONT-03 | 02-01 | About-dev: Santiago David Postorivo / Persano | ✓ SATISFIED | `geohist/index.html:129-133` verbatim entity |
| CONT-04 | 02-02 | Hub: brand intro + app card, exactly one app, no placeholders | ✓ SATISFIED | `index.html:12-22` |
| CMPL-04 | 02-01 + 02-02 | Policy wording mirrors FAQ; no contradictions | ✓ SATISFIED | Verbatim phrases present in both files; zero data-claim drift on guide/hub |

Plan requirement IDs union = {LNDG-01, LNDG-02, LNDG-04, LNDG-05, CONT-01, CONT-02, CONT-03, CONT-04, CMPL-04} — matches ROADMAP Phase 2 mapping exactly; no orphaned requirements. REQUIREMENTS.md traceability table already marks all nine Complete — consistent with this evidence.

### must_haves.prohibitions (judgment-tier — NON-AUTHORITATIVE LLM-judge verdicts, human review recommended)

| Prohibition | Verdict (non-authoritative) | Evidence |
| ----------- | --------------------------- | -------- |
| No data-claim drift | Not violated | `collect/retention/personal identifying/saved locally/deleted after/AdMob/Firebase` greps on guide+hub: only hit is "collection" (World Passport passport-stamp collections, `geohist/guide.html:65`) — not a data claim |
| No placeholder CTA / no hub filler | Not violated | Badge href literal package URL; hub ships exactly one card, zero filler strings (`index.html` fully read) |
| No superseded i18n approach | Not violated | 0 `<script>`, 0 `hreflang`, no `/es/` or `/pt/` directories anywhere |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `geohist/index.html` | 67-88 | "Screenshot placeholder" aria-labels + "Screenshots coming soon" ×3 | ℹ️ Info | Intentional gallery skeleton (D-13/D-23, recorded Known Stub); deferred to Phase 5 — hub criterion "no visible placeholders" applies to root hub, which is clean |
| repo root | — | Untracked `node_modules/` + `package-lock.json` | ℹ️ Info | Side effect of local `npm run validate` runs; uncommitted — decide gitignore/commit later, no impact on shipped site |

Zero `TBD`/`FIXME`/`XXX`/`TODO`/`HACK` markers in any phase file.

### Gaps Summary

None. Every must-have truth, artifact, and key link verified against the actual codebase. The single non-verified truth (SC4 phone-width rendering) is code-complete but behavior-unexercised — by design deferred to the end-of-phase human checkpoint, not a code defect. The deploy itself is pending (orchestrator-owned single controlled push; branch ahead 14), so CI-green and live-URL 200s remain unverified and ride the same human checkpoint.

---

_Verified: 2026-09-02T05:59:18Z_
_Verifier: the agent (gsd-verifier)_