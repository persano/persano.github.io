---
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
plan: 03
subsystem: a11y-quality-gate
tags: [a11y, wcag2aa, axe, lighthouse, seo, checkpoints, honest-close-out]
requires: [05-01 screenshots, 05-02 sitemap+JSON-LD, Phase-04 consent gate, I18N-04 language switcher]
provides: [scripts/a11y-audit.mjs repeatable AA gate, npm run audit:a11y, gitignored reports/ evidence]
affects: [post-ship D-69/D-70 close-out (Play Console field, GSC submit, policy-file deletion)]
tech-stack:
  added: [@axe-core/cli 4.13.0 + lighthouse 13.4.1 (dev, installed 05-01), Node http static server]
  patterns: [local-http-only battery (Pitfall 7), owner-battery honest close-out, gate-ordered checkpoint]
key-files:
  created: [scripts/a11y-audit.mjs, reports/a11y-summary.json (gitignored evidence)]
  modified: [package.json, .gitignore, index.html, geohist/index.html, geohist/guide.html, geohist/contact.html, geohist/privacy.html]
  deleted: []   # D-70 deletion deliberately NOT performed — gate unmet (see Pending Post-Ship)
decisions:
  - D-70 deletion withheld: owner D-69 confirmation absent + sitemap.xml not deployed (404 live) — plan resume-signal mandates "deletion does NOT happen; checkpoint recorded open"
  - Task 2 item 4 (Rich Results Test) recorded PENDING post-ship, not passed — deployed URL serves the old page while changes are uncommitted
metrics:
  duration: split session (Task 1 prior session 2026-09-04 ~04:40Z battery run; continuation close-out 13:45Z)
  completed: 2026-09-04
  tasks: 3
actuals:
  tokens: 4800
  tasks: 3
  commits: 0
status: complete
deferred_commit: true
---

# Phase 05 Plan 03: WCAG 2.1 AA Audit Gate + Trace Cleanup Checkpoint Summary

**One-liner:** Scripted axe + Lighthouse AA battery green 5/5 pages (LH a11y 100 everywhere, zero critical/serious violations) with palette tokens byte-verified; owner keyboard/form/language battery items 1–3 PASS, item 4 + D-69/D-70 console steps honestly carried as post-ship human debt.

## Task Results

### Task 1 — scripts/a11y-audit.mjs automated battery — DONE (prior session)

- Battery serves repo root over `http://127.0.0.1:<ephemeral-port>` (never file scheme — Pitfall 7), scans the 5 content URLs with axe (`--exit`) + Lighthouse (`--only-categories=accessibility`).
- **Evidence (reports/a11y-summary.json, generatedAt 2026-09-04T04:40:15Z):** `/`, `/geohist/`, `/geohist/guide.html`, `/geohist/contact.html`, `/geohist/privacy.html` — axe critical=0, serious=0, moderate=0, minor=0 on all 5 (1 `color-contrast` *incomplete* on 4 pages — axe could not programmatically verify, not a violation); Lighthouse accessibility **100/100 on all 5**; `allPass: true`; `npm run audit:a11y` exit 0.
- Palette: all 7 token values (`#1a1410 #241c14 #f0e6d2 #c9b89a #d9a951 #8fc3bd #2a1f12`) verified present in css/base.css — nothing redesigned, contrast pairs confirmed rendered.
- `reports/` gitignored; `audit:a11y` npm script added. A11y fix edits landed in the 5 HTML pages (+104/−23 across the fix set).

### Task 2 — CHECKPOINT owner manual AA battery — OWNER RESPONDED

| # | Item | Reported status |
|---|------|-----------------|
| 1 | Keyboard-only pass on /geohist/ (nav, Play badge, FAQ details, footer incl. Consent re-open; visible focus; logical tab order) | **PASS** (owner-confirmed) |
| 2 | Contact form: labeled fields reachable, labels announced, empty submit → inline keyed validation error without navigation | **PASS** (owner-confirmed) |
| 3 | Language-switch re-check ES + pt-BR: `documentElement.lang` syncs; keyboard + contrast pass holds | **PASS** (owner-confirmed) |
| 4 | Rich Results Test on live /geohist/ | **NOT RUN — PENDING post-ship** (see Pending Post-Ship §A) |

Zero unexecuted items claimed passed.

### Task 3 — CHECKPOINT D-69 console steps + D-70 deletion — EXECUTED TO THE GATE, THEN HELD

**Precondition check (read-only):** `https://persano.github.io/sitemap.xml` → **404** (wave-2 changes uncommitted, deploy not shipped); `https://persano.github.io/GeoHist_Trivia_Privacy_Policy.html` → still **200**. Task 3 precondition ("wave-2 deploy is live") is **unmet**, and D-69 owner confirmation is absent.

**Actions taken:**
- The 3 superseded policy files (`GeoHist_Trivia_Privacy_Policy.html/.md/.pdf`) verified present and **left byte-untouched** — D-70 ordering gate honored (deletion must never precede owner confirmation).
- D-69 checkpoint recorded **OPEN**; both Phase-01/05 traces stay **open** in STATE.md.

**Owner step-by-step instructions (execute after /gsd-ship deploy is green — verify sitemap.xml returns 200 first):**
1. **Play Console → App content → Privacy policy**: set URL to `https://persano.github.io/geohist/privacy.html`, save, confirm the field shows that exact value. **Must be done FIRST** — this flip is what makes the old root policy URL safe to remove (D-70).
2. **Search Console** (property `persano.github.io`) **→ Sitemaps**: submit `https://persano.github.io/sitemap.xml`; confirm GSC reports the submission received (first-processing status is fine). Only after the deploy containing sitemap.xml is live (Pitfall 10).
3. Reply to the executor/ship flow with both confirmations (field URL shown + GSC status) → then D-70 runs: delete the 3 root policy files, that deletion rides the deploy, then verify `/geohist/privacy.html` = 200, old policy URL = 404, `npm run validate` exit 0, `bash scripts/smoke-check.sh` = ALL PASS.

## Deferred Commits

All code changes uncommitted — will be committed by /gsd-ship. Planned messages + files:

- feat(05-03): add automated axe + Lighthouse WCAG AA audit battery — files: `scripts/a11y-audit.mjs` (new), `package.json` (+`audit:a11y` script), `.gitignore` (+`reports/`)
- fix(05-03): a11y battery fixes across 5 content pages — files: `index.html`, `geohist/index.html`, `geohist/guide.html`, `geohist/contact.html`, `geohist/privacy.html` (fix set +104/−23; axe rule IDs exercised: color-contrast-family checks clean post-fix, zero violations)
- (none for Task 3: no files touched — D-70 deletion gated and withheld)

Note: working tree also carries intentionally-uncommitted 05-01/05-02 changes (screenshots, sitemap.xml, robots.txt, og-image, make-webp/og-image scripts) and pre-existing owner changes (`opencode.json`, `opencode/`) — build on the tree, never stage here. `reports/` output is generated evidence, gitignored, numbers recorded above.

## Deviations from Plan

None against task logic — plan executed as written. One **gate-honoring halt**: Task 3's D-70 half was deliberately not executed because its gate (owner D-69 confirmation + live sitemap deploy) is unmet; the plan's own resume-signal prescribes exactly this outcome ("Not confirmed → the deletion does NOT happen; record the checkpoint as open"). Task 2 item 4 was equally un-runnable (deployed URL serves the old page while changes are uncommitted) — recorded PENDING, per the honest close-out contract and the plan's own prohibition.

## Pending Post-Ship (human_needed — explicit debt, NOT passed)

| Item | Type | Blocks | Where recorded |
|------|------|--------|----------------|
| A. Rich Results Test on `https://persano.github.io/geohist/` — SoftwareApplication detected, zero errors (rating-note acceptable, Pitfall 8) | owner check | SC4 adjudication | Task 2 item 4; windows ledger #7 |
| B. D-69 step 1: Play Console privacy-URL field → `https://persano.github.io/geohist/privacy.html` | owner console | D-70 gate, Play submission | Task 3; windows ledger #8 |
| C. D-69 step 2: GSC sitemap submit (AFTER deploy live, Pitfall 10) | owner console | D-65 close | Task 3; windows ledger #8 |
| D. D-70: delete `GeoHist_Trivia_Privacy_Policy.{html,md,pdf}` only after B confirmed; deletion rides final deploy | executor, gated | old-URL 404 + privacy.html 200 checks, smoke ALL PASS | windows ledger #9 |
| E. 05-02 post-deploy validate + smoke on live site | CI/orchestrator | 05-02 close-out | 05-02-SUMMARY |

Post-deploy close-out order: E (deploy green) → A (rich results) → B → C → D → post-deletion battery (privacy 200 / old URL 404 / validate / smoke).

## TDD Gate Compliance

Not applicable — plan type is `execute`, no tdd tasks.

## Threat Flags

None — no new network endpoints, auth paths, or trust-boundary surfaces introduced (audit tooling is local-only, bound to 127.0.0.1).

## Known Stubs

None introduced by this plan.

## Self-Check: PASSED

- FOUND: scripts/a11y-audit.mjs, reports/a11y-summary.json, all 3 superseded policy files (untouched), SUMMARY.md
- package.json has `audit:a11y`; .gitignore has `reports/`; battery binds 127.0.0.1; the only `file://` occurrence is the Pitfall-7 prohibition comment (zero file-scheme scan URLs)
- Battery evidence on disk matches quoted numbers (5 pages, allPass true, LH 100 ×5, axe critical/serious 0 ×5)
