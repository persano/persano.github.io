---
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
plan: 02
subsystem: discoverability-seo
tags: [seo, og-image, json-ld, sitemap, canonical, social-cards]
requires:
  - 05-01 pinned screenshot WebPs at geohist/screenshots/screenshot.{menu,map,flags,timeline}.webp (JSON-LD screenshot array cites them)
  - sharp 0.35.4 devDep (05-01) — og-image composition
  - css/base.css design tokens (Phase 02) — og-image brand composition
provides:
  - geohist/og-image.png 1200x630 + scripts/og-image.mjs + npm script og:image (regenerable, D-57..D-59)
  - Full discovery head blocks (canonical + OG + Twitter) on all 5 content pages, static EN unkeyed (D-66..D-68)
  - Corrected SoftwareApplication JSON-LD on /geohist/ only (flagged D-61 deviation per plan header; D-60/D-62)
  - sitemap.xml (5 pinned URLs, no date elements, no alternates) + robots.txt (allow-all + Sitemap) at repo root (D-63/D-64)
  - smoke-check.sh 200-list extended with the 5 wave-2 URLs
affects:
  - 05-03 — Rich Results Test owner check adjudicates the corrected JSON-LD (SC4); GSC sitemap submission is 05-03's owner step (D-65)
  - /gsd-ship — commits this plan's code changes + performs the wave-2 deploy push; post-deploy checks listed PENDING below
tech-stack:
  added: []
  patterns: [sharp SVG-text composition with design tokens, static-EN head discovery blocks (og property= / twitter name=), single-source description (meta == JSON-LD byte-identical)]
key-files:
  created:
    - scripts/og-image.mjs
    - geohist/og-image.png
    - sitemap.xml
    - robots.txt
  modified:
    - package.json
    - geohist/index.html
    - index.html
    - geohist/guide.html
    - geohist/contact.html
    - geohist/privacy.html
    - scripts/smoke-check.sh
decisions:
  - "og-image: double gold/parchment hairline frame + Georgia display title + muted tagline + centered 176px icon composite — tokens quoted verbatim from css/base.css :root (D-57 discretion area)"
  - "JSON-LD uses the plan-header corrected form: @type [SoftwareApplication, MobileApplication] + applicationCategory GameApplication (literal D-61 GameApplication type does not exist on schema.org) — flagged deviation honored as recorded"
  - "Post-deploy checks recorded PENDING — deferred-commit mode leaves all code uncommitted, so the orchestrator-owned push (Phase-01/02/04 pattern) has not happened at execution time; honest close-out contract"
metrics:
  duration: ~9 min
  completed: 2026-09-04
status: complete
deferred_commit: true
actuals:
  tokens: 28000
  tasks: 3
  commits: 0
---

# Phase 5 Plan 2: Discoverability — OG Image, Heads, JSON-LD, Sitemap, Robots Summary

**Every content page now carries a complete static-EN discovery block (canonical == og:url, absolute URLs, 1200x630 brand og-image) with the corrected rich-result SoftwareApplication JSON-LD on /geohist/ only, plus a 5-URL sitemap and allow-all robots.txt — SEO-01..04 complete in code.**

## Tasks Completed

| Task | Name | Result |
| ---- | ---- | ------ |
| 1 | tracer: /geohist/ discoverable end-to-end (D-57..D-62) | DONE. `scripts/og-image.mjs` written (sharp SVG-canvas + icon composite, tokens verbatim from css/base.css), `og:image` npm script added, `geohist/og-image.png` generated 1200x630 and visually inspected (title + tagline render correctly in Georgia stack). Head block + corrected JSON-LD inserted on geohist/index.html. Task verify PASS: og-image dims, canonical==og:url==`https://persano.github.io/geohist/`, @type array, category/OS, description byte-identical to meta, offers "0"/USD, 4-URL screenshot array, author/sameAs, 4x twitter name= / 0x property=, og:image dims declared, zero rating keys, zero data-i18n in script, npm script present. validate:html + keycheck green. ⚡ Tracer verified end-to-end — expanding. |
| 2 | Replicate head block to remaining 4 content pages (D-66/D-67/D-68) | DONE. Hub (canonical `https://persano.github.io/` directory form), guide, contact, privacy — each with its OWN title/description strings byte-identical into og: and twitter: tags, og:type website, shared og-image + 1200/630 dims. No JSON-LD on any of the 4 (D-60). 404.html untouched (git diff empty). Task verify PASS + supplemental battery: og:description==meta description and twitter title/description mirrors on 5/5 pages. validate:html green. |
| 3 | sitemap.xml + robots.txt + smoke-check extension (D-63/D-64, D-65 prep) | DONE. sitemap.xml: exactly 5 loc entries in pinned order (hub → geohist → guide → contact → privacy), no lastmod/date elements, no alternates. robots.txt: exactly the 3 pinned content lines. smoke-check.sh 200-list extended with `$BASE/geohist/`, `$BASE/geohist/guide.html`, `$BASE/sitemap.xml`, `$BASE/robots.txt`, `$BASE/geohist/og-image.png` (existing OPS-03 set kept). Task verify PASS. GSC submission NOT performed here — 05-03 owner step (D-65/Pitfall 10). |

## Verification Evidence

- Task 1: `PASS: og-image 1200x630, canonical==og:url, corrected JSON-LD complete, twitter name=, no rating key` (verify script at runtime; regex-hardened see Deviations #1)
- Task 2: `PASS: 4 pages blocked, 404 untouched` + `PASS: og:desc==meta desc + twitter title/desc mirrors on 5/5`
- Task 3: `PASS: sitemap 5 URLs pinned order, no enrichment; robots exact; smoke list extended`
- Plan-level: `npm run validate` exit 0 (html-validate + linkinator + keycheck 146 keys 1:1 both dictionaries); `git status css/base.css 404.html` → both untouched
- og-image.png visually inspected via image read: "GeoHist Trivia" + tagline rendered in serif display stack, gold double frame, icon composited — brand-consistent

## Deferred Commits

All code changes are UNCOMMITTED — will be committed by /gsd-ship (deferred_commit_mode). Planned ledger:

- feat(05-02): og-image generator + /geohist/ discovery head block + corrected SoftwareApplication JSON-LD — files: scripts/og-image.mjs, package.json, geohist/og-image.png, geohist/index.html
- feat(05-02): discovery head blocks (canonical/OG/Twitter) on hub, guide, contact, privacy — files: index.html, geohist/guide.html, geohist/contact.html, geohist/privacy.html
- feat(05-02): sitemap.xml + robots.txt + smoke-check 200-list extension — files: sitemap.xml, robots.txt, scripts/smoke-check.sh

Note: `opencode.json` (modified) and `opencode/` (untracked) are pre-existing owner changes — excluded, untouched. 05-01's uncommitted files (geohist/screenshots/, scripts/make-webp.mjs, js/i18n/*, package-lock.json, prior edits to package.json/geohist/index.html) are Wave-1 work — /gsd-ship commits those per 05-01's ledger.

## Post-Deploy Checks — PENDING (orchestrator handoff)

Deferred-commit mode leaves this plan's code uncommitted, so the single controlled push to main has NOT happened at execution time (push is orchestrator-owned, Phase-01/02/04 pattern). Per the plan's honest close-out contract, the following are recorded **PENDING for /gsd-ship after the wave-2 deploy goes green** — never claimed:

- `npm run validate` (linkinator now reaches the live og-image URL)
- `bash scripts/smoke-check.sh` → must print `SMOKE CHECK: ALL PASS` (og-image, sitemap, robots, all pages live 200)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's Task-1 verify regex flagged `operatingSystem` as a rating key**
- **Found during:** Task 1 verify (first run failed `FAIL rating key present: operatingSystem`)
- **Issue:** the plan's prohibition check `/rating/i` substring-matches "ope**rating**System" — a harness bug, not a markup violation (operatingSystem is a required D-61 field).
- **Fix:** verify script hardened to `/\brating\b|aggregaterating/i` (word-boundary) — verify-side only; no source file changed. The prohibition itself (zero rating fields in JSON-LD) holds: grep of the JSON-LD keys confirms none.
- **Files modified:** none (temp verify script only)

### Out-of-scope Observations (not fixed, pre-existing)

- `npm run validate:links` still scans 0 links (linkinator 8.x behavior, noted in 05-01) — exit 0, unrelated to this plan; the live-URL link check happens via the PENDING post-deploy validate run.

## Known Stubs

None — every head block is fully populated with static EN strings; JSON-LD field set complete per the corrected D-61 form; sitemap/robots complete.

## Requirements Coverage

- SEO-01: 5/5 content pages carry title/description + canonical (directory form for roots, absolute, og:url mirrored) → satisfied in code
- SEO-02: 5/5 pages OG/Twitter cards absolute, one site-wide og-image.png 1200x630 with dims declared → satisfied in code
- SEO-03: sitemap.xml (5 URLs, no dates, no alternates) + robots.txt exact + smoke-covered in code; GSC submission deferred to 05-03 owner checkpoint (D-65) → satisfied in code
- SEO-04: corrected SoftwareApplication JSON-LD on /geohist/ only, zero rating fields, description single-sourced byte-identical → satisfied in code; Rich Results Test is the 05-03 owner-side adjudication (Pitfall 8)

## Threat Flags

None — head metadata, sitemap/robots, and a static JSON-LD introduce no new network endpoints, auth paths, or file-access surfaces (public-by-design data only).
