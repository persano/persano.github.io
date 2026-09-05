---
status: resolved
trigger: "Gallery shows 4 captures with AdMob TEST ad banners ('Anuncio de prueba' / test ad) baked into app screens — 'looks horrible'"
created: 2026-09-04T00:00:00Z
updated: 2026-09-04T00:00:00Z
goal: find_root_cause_only
bug_class: Bohrbug (deterministic — test banner rendered by debug build during capture, baked into assets)
---

## Current Focus

hypothesis: CONFIRMED — Captures were taken from a device running the DEBUG build of GeoHist-Trivia, which hardcodes Google's public TEST AdMob banner unit; the "Anuncio de prueba" banner was rendered on-screen at capture time and baked into the raw PNGs; make-webp.mjs converted them 1:1 to the deployed WebPs.
test: Visual inspection of all 4 raw PNGs + code trace of ad configuration in app source + pipeline inspection
expecting: DONE — all 4 raws show test banner; debug build deterministically serves test ads; pipeline has no crop/ad-stripping step
next_action: return diagnosis to orchestrator (plan-phase --gaps handles the fix)

reasoning_checkpoint:
  hypothesis: "The 4 gallery WebPs show AdMob test banners because the raw ADB captures were taken on a device running the app's DEBUG build, and AdBanner.kt forces Google's public TEST banner ad unit in debug builds (by design, to protect the AdMob account from invalid traffic). The rendered banner was baked into the raw PNGs and the site pipeline converts raws 1:1."
  confirming_evidence:

    - "AdBanner.kt:24,27 — bannerAdUnitId = if (BuildConfig.DEBUG) TEST_BANNER_AD_UNIT_ID ('ca-app-pub-3940256099942544/9214589741') else BuildConfig.ADMOB_BANNER_ID"
    - "app/build.gradle.kts:24,117 — debug variants force TEST AdMob APP ID 'ca-app-pub-3940256099942544~3347511713' via manifestPlaceholders"
    - "Visual: all 4 raw PNGs (2026-09-03, 22:35–23:29) show 'Anuncio de prueba / You've loaded a test ad from AdMob' banner at bottom"
    - "MainActivity.kt:719 — AdBanner shown on every screen unless uiState.isAdFree or IME visible; device was not ad-free"
    - "make-webp.mjs:42 CROPS = {} (approved as framed) → 1:1 raw→WebP, no ad removal; deployed WebPs are exactly 720x1600 = full raw panel incl. banner"
  falsification_test: "If the device had run a RELEASE build, bannerAdUnitId would be .env's real ADMOB_BANNER_ID and the banner would show real ads (not 'Anuncio de prueba') — the observed label refutes release-build and refutes post-capture site-side corruption."
  fix_rationale: "Root cause is capture-time device state, not site code. Fix = recapture ad-free screens on device, then rerun existing site pipeline. No pipeline bug to fix."
  blind_spots: "Whether billing/IAP purchase simulation works on a debug-build install (Play license testing normally expects Play-distributed install) — fix plan must pick a mechanism that works with the installed build. Not tested here (diagnose-only, device required)."
  candidate_causes:

    - "code: debug build type hardwires TEST ad unit (confirmed — this is intentional app behavior, not an app bug)"
    - "data: raw capture PNGs contain baked test banner (confirmed — the contaminated artifact)"
    - "environment: device not ad-free during capture — isAdFree=false, IAP not purchased (confirmed)"
    - "config: .env holds real release IDs, so a release-build recapture would show REAL ads — not a fix path (verified .env keys exist)"
  and_gate: "no — single necessary condition (debug build + not-ad-free at capture). Other factors are consequences of the same condition."

## Symptoms

expected: Gallery shows 4 real device screenshots (menu, map, flags, timeline) with keyed captions, no placeholders, lazy-loaded
actual: Captures show AdMob test ad banners ("Anuncio de prueba" / "Test Ad") baked into the app screens
errors: none
reproduction: Test 1 in .planning/phases/05-discovery-quality-screenshots-seo-json-ld-aa-audit/05-UAT.md — visit live https://persano.github.io/geohist/, gallery section
started: Discovered during UAT (post-ship, deployed). Captures taken 2026-09-03/04 (D-52/D-53), AdMob in TEST mode during session.

## Eliminated

- hypothesis: Site-side pipeline (make-webp.mjs) corrupted or composited ads onto captures
  evidence: CROPS map empty, pipeline is sharp(src).webp({quality:82}) 1:1; deployed WebPs are 720x1600 = exact raw panel dimensions; raw PNGs themselves already contain the banner
  timestamp: 2026-09-04

- hypothesis: Test banner appears only on menu + map screens (partial contamination)
  evidence: Visual inspection of raw-screenshot.flags.png and raw-screenshot.timeline.png — both show 'Anuncio de prueba' test banner; all 4 raws contaminated
  timestamp: 2026-09-04

- hypothesis: Test ads caused by test-device configuration / RequestConfiguration.addTestDevice flag that can be toggled off
  evidence: No RequestConfiguration/addTestDevice in app source; mechanism is BuildConfig.DEBUG branch in AdBanner.kt choosing the test ad UNIT — deterministic per build type, not a device flag
  timestamp: 2026-09-04

## Evidence

- timestamp: 2026-09-04
  checked: geohist/screenshots/ — 4 WebPs present (flags 28KB, map 68KB, menu 51KB, timeline 65KB); all 720x1600
  found: dimensions match full 720x1600 device panel exactly — banner region included
  implication: deployed assets are unmodified full-panel copies of raws

- timestamp: 2026-09-04
  checked: raw captures at C:\Users\Familia\AppData\Local\Temp\opencode\geohist-captures\ (4 PNGs, 2026-09-03 22:35–23:29)
  found: ALL 4 raws show 'Anuncio de prueba / You've loaded a test ad from AdMob. Way to go!' banner at bottom
  implication: contamination happened at capture time on device, not in pipeline

- timestamp: 2026-09-04
  checked: GeoHist-Trivia AdBanner.kt
  found: line 24 TEST_BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/9214589741' (Google's official public test unit); line 27 bannerAdUnitId = if (BuildConfig.DEBUG) TEST else BuildConfig.ADMOB_BANNER_ID — debug builds can never serve live ads (invalid-traffic protection)
  implication: device ran a debug build → test banner guaranteed on every screen

- timestamp: 2026-09-04
  checked: app/build.gradle.kts + .env
  found: androidComponents onVariants(debug) forces TEST ADMOB_APP_ID (line 117); .env holds real ADMOB_APP_ID/ADMOB_BANNER_ID for release; secrets plugin injects .env
  implication: release build would show REAL ads — recapturing with release build is not a clean-screenshot path either

- timestamp: 2026-09-04
  checked: MainActivity.kt:719 + BillingRepository.kt:212 (grantProEntitlement) + SettingsScreen.kt:564
  found: AdBanner hidden app-wide when uiState.isAdFree; isAdFree set true by 'Quitar anuncios' IAP purchase (grantProEntitlement → userPreferences.setAdFree(true), persisted in UserPreferencesRepository KEY_AD_FREE); Settings shows billing button only when !isAdFree
  implication: cheapest reliable ad-free capture path = owner activates IAP via Play Console license testing (no charge) → banner disappears on ALL screens → recapture the same 4 screens (D-52/D-53 framing) → rerun npm run convert:screenshots

- timestamp: 2026-09-04
  checked: make-webp.mjs
  found: re-runnable bridge raws→WebP (npm convert:screenshots); CROPS intentionally empty per D-53 'approved as framed'
  implication: once clean raws replace the 4 PNGs at same names, one command regenerates correct assets; site HTML needs no change

## Resolution

root_cause: The 4 raw ADB captures were taken from a device running the app's DEBUG build. AdBanner.kt (GeoHist-Trivia) deterministically serves Google's official PUBLIC TEST banner unit ('ca-app-pub-3940256099942544/9214589741') and build.gradle.kts forces the TEST AdMob APP ID in debug variants (invalid-traffic protection, working as designed). The device was not ad-free (isAdFree=false — no IAP purchase), so the "Anuncio de prueba" test banner rendered on every captured screen. Test banners were baked into the raw PNGs and the site pipeline (scripts/make-webp.mjs, CROPS empty = approved-as-framed, 1:1 conversion) faithfully reproduced them into geohist/screenshots/*.webp, which are deployed live. Site-side code is correct; the defect is capture-time device state propagating into shipped assets.
fix: (diagnose-only — for gap-closure plan) Device side (owner): make device ad-free — install/verify 'Quitar anuncios' purchase via Play Console license-testing account (BillingRepository.grantProEntitlement persists isAdFree, banner hidden app-wide; works on any screen, no code change) OR equivalent ad-free state; then recapture the same 4 screens at 720x1600 with identical framing (D-52/D-53). Site side: replace the 4 raw PNGs in the temp captures dir, run node scripts/make-webp.mjs <rawdir> (or npm run convert:screenshots), verify WebPs clean, commit + deploy. HTML/sitemap unchanged.
verification:
files_changed: []
