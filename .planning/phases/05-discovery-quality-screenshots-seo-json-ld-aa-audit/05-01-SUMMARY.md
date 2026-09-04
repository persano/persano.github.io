---
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
plan: 01
subsystem: gallery-assets-i18n
tags: [screenshots, webp, gallery, i18n, lndg-03]
requires:
  - Phase 02 placeholder gallery markup (replaced)
  - scripts/i18n-keycheck.mjs exact-set gate (141-key surface, now 146)
provides:
  - 4 pinned real-screenshot WebPs at geohist/screenshots/screenshot.{menu,map,flags,timeline}.webp
  - scripts/make-webp.mjs raw-PNG→WebP converter + npm script convert:screenshots
  - 8 new gallery keys (alt.* + caption.*) and 3 retired keys removed in es.json + pt-BR.json
  - devDeps sharp 0.35.4 / @axe-core/cli 4.13.0 / lighthouse 13.4.1 (05-02 + 05-03 reuse)
affects:
  - 05-02 — JSON-LD screenshot array cites these exact pinned paths
  - 05-03 — reuses axe/lighthouse devDeps, no reinstall
tech-stack:
  added: [sharp 0.35.4, "@axe-core/cli 4.13.0", lighthouse 13.4.1]
  patterns: [raw ADB PNGs stay outside repo → in-repo converter → pinned WebP paths, exact-pinned devDependencies]
key-files:
  created:
    - scripts/make-webp.mjs
    - geohist/screenshots/screenshot.menu.webp
    - geohist/screenshots/screenshot.map.webp
    - geohist/screenshots/screenshot.flags.webp
    - geohist/screenshots/screenshot.timeline.webp
  modified:
    - package.json
    - package-lock.json
    - geohist/index.html
    - js/i18n/es.json
    - js/i18n/pt-BR.json
decisions:
  - "No crop map in make-webp.mjs — Task 1 recorded zero framing/crop decisions (all 4 shots owner-approved as framed on the 720x1600 panel); CROPS map intentionally empty, documented in-script for future use"
  - "WebP quality 82, no downscale triggered — all four outputs 720x1600 at 28–68 KB, far under the 300 KB cap (A3/A4 discretion)"
  - "npm caret ranges replaced with exact pins after install — plan verify does strict-equality checks and existing html-validate/linkinator entries are exact-style"
  - "NODE_OPTIONS=--dns-result-order=ipv4first required for npm on this machine — npm's fetch hung on IPv6 while direct HTTPS worked (see Deviations)"
metrics:
  duration: ~40 min (incl. ~25 min npm network stalls before the IPv4 fix)
  completed: 2026-09-04
status: complete
deferred_commit: true
actuals:
  tokens: 48000
  tasks: 3
  commits: 0
---

# Phase 5 Plan 1: Real Screenshots — ADB Capture + WebP Pipeline + Gallery Summary

**Real device-captured game screenshots (4 feature groups, owner-approved via ADB checkpoint) shipped as lean WebPs through a re-runnable sharp converter, replacing the placeholder gallery with keyed, lazy-loaded tiles across EN markup + es/pt-BR dictionaries — LNDG-03 complete in code.**

## Tasks Completed

| Task | Name | Result |
| ---- | ---- | ------ |
| 1 | checkpoint:human-action — ADB capture (D-52/D-53) | DONE (prior session). 4 raw PNGs at `C:\Users\Familia\AppData\Local\Temp\opencode\geohist-captures\`, all owner-approved, no framing/crop decisions, panel 720x1600. Raw verify passed (PNG magic, >100 KB each). |
| 2 | Pin devDeps + scripts/make-webp.mjs + convert (D-54) | DONE. sharp@0.35.4 + @axe-core/cli@4.13.0 + lighthouse@13.4.1 exact-pinned; `convert:screenshots` script added; converter logs per-file dimensions/bytes; 4 WebPs written, all 720x1600, 28–68 KB. Automated verify PASS. |
| 3 | Gallery replacement + dictionary parity (D-55/D-56) | DONE. 4 real img tiles (width/height=720/1600, loading=lazy, keyed alt, keyed captions); intro paragraph + 3 SVG placeholder tiles + li aria-labels deleted; 8 new keys + 3 retired keys in both dictionaries → 146 keys 1:1. validate:html green, keycheck green (both dicts exactly cover the 146-key live surface), plan verify PASS. |

## Verification Evidence

- Task 1 (prior session): `PASS: 4 raw PNG captures present, valid magic, non-trivial size`
- Task 2: `PASS: 4 WebPs valid+lean, devDeps pinned, npm script present`; lockfile resolves exact versions (0.35.4 / 4.13.0 / 13.4.1); `geohist/screenshots/` contains exactly the 4 pinned WebPs
- Task 3: `i18n-keycheck: PASS — es.json exactly covers the 146-key live surface` + same for pt-BR.json; `PASS: gallery 4 real tiles, keyed alts+captions, dicts 146 keys 1:1`; validate:html exit 0
- Plan-level: validate:links exit 0 (no new outbound links); no raw PNGs in repo (raws live in temp dir outside the repo); pinned paths ready for 05-02's JSON-LD screenshot array

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] npm registry fetches hung — fixed with IPv4-first DNS ordering**
- **Found during:** Task 2
- **Issue:** `npm install` hung >25 min across two attempts; `npm ping` also hung; direct HTTPS to registry.npmjs.org returned 200. Root cause: npm's Node fetch path stalls on IPv6 DNS resolution on this machine. Offline-cache probe confirmed ENOTCACHED (not a legitimacy problem — all three packages were research-approved in 05-RESEARCH.md).
- **Fix:** Set `NODE_OPTIONS=--dns-result-order=ipv4first` for npm invocations → install completed in 23 s (236 packages). Future npm-dependent work in this repo (05-03 axe/lighthouse runs) needs the same env var.
- **Files modified:** none (environment workaround only)

**2. [Rule 1 - Inline fix] npm wrote caret ranges; plan requires exact pins**
- **Found during:** Task 2 verify (first run failed `FAIL devDep sharp != 0.35.4`)
- **Issue:** `npm install --save-dev pkg@x.y.z` wrote `^x.y.z` ranges; the plan's verify does strict-equality checks and existing entries (html-validate/linkinator) are exact-style.
- **Fix:** Removed carets from the three new devDependencies in package.json; package-lock.json already resolved the exact versions, so no reinstall was needed. Verify re-run → PASS.
- **Files modified:** package.json

### Out-of-scope Observations (not fixed, pre-existing)

- `npm run validate:links` scans 0 links ("Successfully scanned 0 links") — linkinator 8.x config/behavior predates this plan; exit code 0 and unrelated to this plan's changes (no new outbound links were added).

## Known Stubs

None — gallery tiles render real approved captures; all keyed strings exist in both dictionaries (keycheck exact-set gate proves it structurally).

## Deferred Commits

All code changes are UNCOMMITTED — will be committed by /gsd-ship (deferred_commit_mode). Planned ledger:

- chore(05-01): pin sharp/@axe-core/cli/lighthouse devDeps + make-webp.mjs converter + 4 gallery WebP captures — files: package.json, package-lock.json, scripts/make-webp.mjs, geohist/screenshots/screenshot.menu.webp, geohist/screenshots/screenshot.map.webp, geohist/screenshots/screenshot.flags.webp, geohist/screenshots/screenshot.timeline.webp
- feat(05-01): replace placeholder gallery with 4 real screenshot tiles + keyed alts/captions in es/pt-BR dictionaries — files: geohist/index.html, js/i18n/es.json, js/i18n/pt-BR.json

Note: `opencode.json` (modified) and `opencode/` (untracked) are pre-existing owner changes — excluded from this plan's ledger, untouched.

## Requirements Coverage

- LNDG-03: gallery shows 4 real ADB-captured screenshots (within the 3–6 range), WebP, lazy loading, placeholders fully replaced (D-52..D-56 honored) → satisfied in code; marked complete via requirements handler.
