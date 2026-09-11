---
status: passed
phase: 08-custom-domain-migration
verified_at: 2026-09-08T00:55:00Z
verifier: orchestrator-canonical (verifier capability disabled in config)
plans: [08-01, 08-02, 08-03]
uat: 5 passed, 0 issues (08-UAT.md)
---

# Phase 8 Verification: Custom Domain Migration

## Goal
`persano.github.io` serves identically at the apex custom domain with enforced HTTPS, a permanent CI old-domain gate, and Google Search Console fully migrated — HOST-01/02/03 closed.

## Must-Haves — Evidence

### 1. Custom domain live + HTTPS enforced (HOST-01)
- `gh api repos/persano/persano.github.io/pages` → `https_enforced: true`, `cname: geohisttrivia.com`, `protected_domain_state: verified`, `status: built` (08-01 gate sweep)
- DNS: A×4 + AAAA×4 GitHub Pages IPs at Spaceship (authoritative `launch1/launch2.spaceship.net`); challenge TXT removed by owner after verify

### 2. URL rewrite complete + permanent gate (HOST-02)
- Migration commit `c72b3a2` → merged to main `7f0cf4e`; 44 legacy-host references rewritten across 14 files, line-2-only diffs in 4 JS files
- Gate RED→GREEN both directions: `scripts/check-no-old-domain.mjs` rejects legacy refs outside allowlist, passes on clean tree
- CI: Actions run `34165783219` green on main (validate incl. `validate:domain` + deploy)
- Live: apex 200, `www` 301→apex, `persano.github.io` 301→apex path-preserved (curl triple green); `scripts/smoke-check.sh` → `SMOKE CHECK: ALL PASS`

### 3. GSC migration (HOST-03)
- Sitemap submitted in new Domain property → Success (owner-reported + UAT test 3 pass)
- Change of Address filed old→new, 180-day window active (UAT test 4 pass)
- Old URL-prefix property retained for D-08 index-decay monitoring (UAT test 5 pass)

## Regression Gate
`npm run validate` (validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n) → exit 0; 20/20 dictionaries exactly cover the 170-key live surface. [corrected Phase 11: 19 JSON dictionaries — no en.json; EN is the markup baseline, so the "20" counted locales, not files] No cross-phase regressions.

## Human Verification
08-UAT.md: 5/5 passed (form test, redirects, sitemap, CoA, old property).

## Acknowledged Gaps
- Pre-existing phase-07 debug session `changelog-not-translating` (status: diagnosed, hypothesis CONFIRMED — no code bug) — not phase-8 scope, left open intentionally.

## Verdict
PASS — all must-haves verified; UAT 5/5; zero issues.
