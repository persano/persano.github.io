# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1 — MVP

**Shipped:** 2026-09-05
**Phases:** 5 | **Plans:** 12 | **Tasks:** 30

### What Was Built
- Play-critical privacy policy live at `/geohist/privacy.html` + push→CI→Pages deploy pipeline (gated by html-validate + linkinator)
- Complete trilingual (EN/ES/pt-BR) GeoHist landing site + Persano hub: hero, features, real ADB screenshot gallery, guide, FAQ, 404 — zero framework, zero build step
- GDPR consent gate (load-gating, fail-closed store) with Firebase Analytics + anonymous-auth Firestore contact form completing the data-deletion request path
- Full discovery layer: canonical/OG/Twitter blocks, 1200×630 og-image, 5-URL sitemap, robots.txt, corrected SoftwareApplication JSON-LD
- WCAG 2.1 AA gate: axe 0 critical/serious + Lighthouse a11y 100 on all 5 pages; UAT 8/8 live checks pass

### What Worked
- i18n keys baked into markup at Phase 2 made Phase 3 a pure-engine add with a mechanical key-parity gate (fail-loud CI)
- Honest close-out contract (never claim unexecuted batteries) kept human debt visible and traceable to UAT
- Device-stage + site-stage split for G-05-1: root cause (debug-build test ads) diagnosed before any fix plan; asset-only closure commit
- Single controlled orchestrator push per wave with smoke battery after deploy — CI green nearly every time first try

### What Was Inefficient
- npm fetch stalls (IPv6) cost ~25 min in 05-01 before the `NODE_OPTIONS=--dns-result-order=ipv4first` workaround
- G-05-1 test-ad contamination: recapture cycle required empirical DataStore schema derivation (attempt-1 crash, full recovery) — Option A/B dead ends cost device time
- Split sessions on 05-03 (battery run vs close-out) left PENDING states that needed explicit reconciliation at UAT

### Patterns Established
- Orchestrator-owned deploy push; agent never pushes site code directly
- Coverage blocks in SUMMARYs → deterministic UAT classification (auto-pass vs human checkpoints)
- Gap plans carry `gap_ids` frontmatter; verify-work reconciles resolved gaps on resume
- `[ci skip]` ship-note commits for docs-only pushes

### Key Lessons
1. Capture assets from the exact runtime state you ship — debug builds serve deterministic test ads by design; verify visual assets before deploy
2. Device-written files are ground truth: derive DataStore/prefs schemas empirically, never from proto assumptions
3. Binary-safe adb I/O: `exec-out`/`run-as cat` for reads, `push`+`run-as cp` for writes; `shell cat` mangles CRLF
4. consent = load-gating: the dynamic import IS the consent — structural compliance beats policy comments

### Cost Observations
- Model mix: orchestrator flash-class; subagents per role (planner/checker) — no per-phase model ledger kept
- Sessions: ~8 execution sessions across 4 days (2026-09-01 → 2026-09-05)
- Notable: heavy STATE.md Accumulated Context is the de-facto session memory — keep it curated

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1 | ~8 | 5 | Established: coverage-driven UAT, gap-closure plans with gap_ids, orchestrator push pattern |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1 | 27/27 UAT+verification must-haves | 27/27 reqs mapped | 0 runtime deps (Firebase CDN only) |

### Top Lessons (Verified Across Milestones)

1. Honest close-out: record unexecuted human batteries as PENDING, never pass
2. Assets carry state: verify captured/converted media visually before they reach deploy
