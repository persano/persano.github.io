---
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
plan: 04
subsystem: ui
tags: [gap-closure, G-05-1, adb-capture, webp, asset-only, admob, datastore, option-c]

# Dependency graph
requires:
  - phase: 05-01
    provides: ADB capture command pattern (binary-safe redirect), make-webp.mjs converter (q82, no downscale), D-52/D-53 framing contract, gallery WebP pipeline
  - phase: 05-02
    provides: JSON-LD screenshot array citing the 4 pinned WebP paths (unchanged filenames/dims keep it valid)
provides:
  - 4 banner-free gallery WebPs (screenshot.menu/map/flags/timeline.webp) committed as asset-only change 941f2cd
  - AdMob test-banner contamination removed from the gallery asset source (G-05-1 device + site stages done)
  - Empirically-derived DataStore Preferences wire schema for the installed GeoHist build (boolean = field 1, not 4)
affects: [05-04 Task 3 (orchestrator push + post-deploy smoke + owner live re-check), geohist gallery, JSON-LD]

# Actuals (#2632)
actuals:
  tokens: 74000
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Binary-safe file pull/push over adb: exec-out/run-as cat for reads (adb shell cat mangles CRLF), push + run-as cp for writes, chmod 600 after"
    - "DataStore Preferences wire format must be derived from a device-written file, never from assumed proto numbering"
    - "Pixel-forensics banner check: bottom-strip greyscale stddev (banner ≈ 110; banner-free ≈ 18) + full-image stddev for non-blank proof"

key-files:
  created:
    - .planning/phases/05-discovery-quality-screenshots-seo-json-ld-aa-audit/05-04-SUMMARY.md
  modified:
    - geohist/screenshots/screenshot.menu.webp
    - geohist/screenshots/screenshot.map.webp
    - geohist/screenshots/screenshot.flags.webp
    - geohist/screenshots/screenshot.timeline.webp

key-decisions:
  - "G-05-1 ad-free state produced via persistence-flag write (Option C), owner-approved — NOT a real IAP purchase; Option A dead (logcat: 'Product details not found for pro_supporter_lifetime' on adb-installed debug build), Option B not viable (app still in Play review, product not queryable)"
  - "Attempt-1 payload crashed the app (ClassCastException: Long→Boolean) — DataStore schema field numbers were assumed from upstream proto; corrected by reverse-walking the app-written geo_hist_prefs.preferences_pb (boolean_value = field 1 in this build); attempt-2 accepted, app stable"
  - "flags raw is 78 KB (vs 100 KB plan threshold) — threshold was calibrated on banner-contaminated originals; pixel forensics proved content integrity (full stddev 61.6 ≈ original 64.1; bottom-strip 110.6 → 18.0)"

patterns-established:
  - "Option C device-state pattern: debuggable build + run-as write of the app's own persistence flags = genuine runtime state for visual capture work; documented honestly as simulated, never claimed as purchase"
  - "Evidence-based size floors: capture-size thresholds must be recalibrated when the fix removes content (banner) from the captures"

requirements-completed: []  # LNDG-03 already complete from 05-01; G-05-1 closes at Task 3 (live re-check) — not marked yet

coverage:
  - id: D1
    description: "4 banner-free raw device captures (menu/map/flags/timeline) in v2 temp dir, 720x1600, owner-approved per shot"
    verification:
      - kind: manual_procedural
        ref: "node PNG-magic/dims/size sweep + sharp bottom-strip stddev (110.6→18.0, 110.5→18.0) + owner per-shot approval"
        status: pass
    human_judgment: true
    rationale: "Banner-freeness and framing are visual judgments — owner confirmed each shot on-device before capture and approved framing after"
  - id: D2
    description: "4 pinned gallery WebPs regenerated from ad-free raws (q82, 720x1600, 19.7-70.7 KB) and committed as an asset-only change"
    verification:
      - kind: automated_ui
        ref: "converter output log + sharp metadata checks + git show --stat 941f2cd (exactly 4 binary files)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Live gallery at https://persano.github.io/geohist/ shows the 4 clean captures (byte-identical deploy, CI green, owner visual re-check) — G-05-1 formally closed"
    verification: []
    human_judgment: true
    rationale: "Task 3 checkpoint OPEN — requires orchestrator-controlled push, CI run, live byte-compare smoke, and owner incognito re-check; cannot be verified while changes are unpushed"

# Metrics
duration: 221 min (wall-clock incl. owner checkpoint waits)
completed: 2026-09-04
status: halted  # designed stop: Task 3 checkpoint awaiting orchestrator-controlled push; resume closes Task 3 and flips status to complete
---

# Phase 05 Plan 04: Gap Closure G-05-1 — Ad-Free Recapture + Asset-Only Redeploy Summary

**4 gallery WebPs regenerated from owner-captured banner-free raws via Option-C device state — asset-only commit 941f2cd, zero HTML/JSON-LD/dictionary change; Task 3 (push + smoke + live re-check) checkpoint open**

## Performance

- **Duration:** 221 min wall-clock (dominated by owner checkpoint waits: ad-free activation diagnosis, crash recovery, per-shot capture protocol)
- **Started:** 2026-09-04T17:31:15Z
- **Tasks:** 2 of 3 complete (Task 3 = orchestrator-controlled push + post-deploy smoke + owner live gallery re-check — checkpoint OPEN)
- **Files modified:** 4 (all `geohist/screenshots/screenshot.*.webp`)

## Accomplishments

- Diagnosed the dead "Quitar anuncios" IAP tap from logcat (`Product details not found for pro_supporter_lifetime` — license-testing purchases don't resolve on the adb-installed debug build) and mapped the app's real entitlement mechanism from source (DataStore Preferences flags, `grantProEntitlement()` only writer, no debug bypass)
- Produced the genuine ad-free runtime state via **persistence-flag write (Option C), owner-approved** — the exact file/keys/values a completed purchase writes; owner verified on-device (purchase button gone, banner-free gameplay)
- Captured 4 banner-free raws screen-by-screen in D-52 order with per-shot owner approval; every raw validated (PNG magic, 720x1600) plus pixel forensics proving banner removal (bottom-strip stddev 110.6→18.0 flags, 110.5→18.0 timeline)
- Regenerated the 4 pinned WebPs via the existing converter (q82, CROPS empty per D-53): 19.7–70.7 KB, all 720x1600; committed as **asset-only** change `941f2cd` — 05-02's JSON-LD screenshot array stays valid with zero markup change (same filenames, same dims)

## Task Commits

1. **Task 1 (device stage):** no repo commit — raws live outside the repo by contract (v2 temp dir, never committed)
2. **Task 2 (site stage):** `941f2cd` fix(05-04): replace gallery captures with ad-free recaptures (banner-free, same framing) — exactly 4 binary WebPs, no deletions, no code
3. **Task 3:** OPEN — orchestrator-controlled push, CI monitor, live byte-compare smoke, owner visual re-check

**Plan metadata:** committed alongside STATE.md update (see final docs commit)

## Files Created/Modified

- `geohist/screenshots/screenshot.menu.webp` — 47.3 KB (was 51.2 KB w/ test banner baked in)
- `geohist/screenshots/screenshot.map.webp` — 72.4 KB (was 67.7 KB)
- `geohist/screenshots/screenshot.flags.webp` — 20.1 KB (was 28.4 KB)
- `geohist/screenshots/screenshot.timeline.webp` — 57.4 KB (was 64.7 KB)
- Raw PNGs + diagnostic artifacts in `C:\Users\Familia\AppData\Local\Temp\opencode\geohist-captures-v2\` (outside repo, never committed; originals in `geohist-captures\` untouched as evidence)

## Decisions Made

- **Option C over A/B:** logcat proved the IAP product unresolvable on this build (A dead); app in Play review with no queryable catalog (B heavy, same risk). Flag write = same state the app itself persists on purchase; capture verification is visual, so this is exactly what the screenshots need. Recorded honestly as simulated.
- **Attempt-2 encoding derived from device ground truth:** after the ClassCastException crash, the app-written `geo_hist_prefs.preferences_pb` was pulled binary-safe (`exec-out`, not `shell cat` which CRLF-mangles) and reverse-walked: boolean = field 1 (`08 01`), int64 = field 4 (the exact field my first payload used — hence Long→Boolean crash). Attempt-2 accepted; 32 s stability watch passed before owner hand-back.
- **Evidence-based size floor:** flags raw at 78 KB failed the plan's 100 KB threshold; forensics (full stddev 61.6 vs original-with-banner 64.1; bottom strip 110.6→18.0) proved the banner's removal accounts for the delta — threshold was calibrated on contaminated originals.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Attempt-1 entitlement payload crashed the app (crash loop)**
- **Found during:** Task 1 (Option C write, first relaunch)
- **Issue:** Payload encoded booleans with upstream proto numbering (`boolean_value = field 4` → `20 01`); the installed build's schema has boolean at field 1, field 4 = int64 → `ClassCastException: Long cannot be cast to Boolean` at `UserPreferencesRepository.kt:212`, uncaught (`.catch{}` guards upstream reads only) → crash loop, contradicting my stated benign-fallback prediction
- **Fix:** Immediate pre-approved recovery (delete file via run-as, relaunch, confirm stable, zero new FATALs), then empirical schema reversal from a device-written DataStore file; attempt-2 with `08 01` encoding — stable, owner-verified ad-free
- **Files modified:** none in repo (device data only); corrected payload + crash buffer + real prefs file preserved in v2 temp dir as evidence
- **Verification:** 32 s stability watch (same pid), crash buffer clean, owner on-device confirmation
- **Committed in:** n/a (device state; no repo artifact)

**2. [Rule 1 - Bug] Plan's 100 KB raw-capture threshold miscalibrated for banner-free captures**
- **Found during:** Task 1 (flags capture validation)
- **Issue:** flags raw = 77,759 B < 100 KB threshold; threshold was calibrated on originals that still contained the ~40 KB-compressed test banner
- **Fix:** Kept the capture; proved content integrity via sharp pixel forensics (full-image stddev parity with original; bottom-strip banner-texture disappearance); re-ran sweep with evidence-based floor
- **Files modified:** none (validation methodology only)
- **Verification:** sweep 4/4 PASS with documented threshold rationale
- **Committed in:** n/a

---

**Total deviations:** 2 auto-fixed (2 × Rule 1). **Impact on plan:** one transient device crash fully recovered before any capture; no scope creep — repo footprint remains exactly the 4 WebPs.

## Issues Encountered

- Crash-loop incident (deviation 1) — resolved; app back to pre-write state between attempts, no user data touched (`geo_hist_prefs.preferences_pb` byte-identical, 473 B / 14:03 mtime throughout)
- `adb shell cat` CRLF-mangles binary pulls (505 vs 473 bytes) — switched to `exec-out` (same 05-01 Pitfall-2 lesson, now also for reads)
- Owner checkpoint waits dominated wall-clock (221 min) — inherent to the honest per-shot protocol, not a defect

## User Setup Required

None — all device actions completed in-session by the owner at the checkpoint.

## Next Phase Readiness

- **Task 3 checkpoint OPEN (the only remaining work):** (1) ORCHESTRATOR performs the single controlled push of `941f2cd` to main; (2) executor monitors CI validate + Pages deploy; (3) automated smoke: 4 live WebP URLs 200 + byte-identical to committed files; (4) owner incognito re-check of https://persano.github.io/geohist/ gallery — formally closes G-05-1; (5) then flip this SUMMARY's `status` to `complete`, mark state, and update ROADMAP row
- UAT test 8 (ES/pt-BR switch re-check) remains owner-pending in the UAT ledger — untouched by this plan (not a diagnosed gap)
- Pre-existing uncommitted working-tree dirt (`.planning/config.json`, `opencode.json`, untracked `.planning/debug/`, `opencode/`, part of `.planning/STATE.md`) is owner/runtime-owned and was deliberately NOT staged — push of `941f2cd` is unaffected

---
*Phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit*
*Completed: 2026-09-04 (Tasks 1-2; Task 3 checkpoint open)*
