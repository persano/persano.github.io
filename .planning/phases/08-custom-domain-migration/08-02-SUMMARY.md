---
phase: 08-custom-domain-migration
plan: 02
subsystem: infra
tags: [ci-gate, url-migration, canonical, sitemap, robots, smoke-check, linkinator, seo]
deferred_commit: true
requirements: [HOST-02, HOST-01]

# Dependency graph
requires:
  - phase: 08-custom-domain-migration
    plan: 01
    provides: owner gate PASSED (AAAA×4 live, domain verified, Firebase Auth + API-key referrer + GSC confirmed) — the locked allowlists-before-rewrite ordering precondition; https_enforced=true on the apex
provides:
  - scripts/check-no-old-domain.mjs — permanent zero-dep CI old-domain gate (exit 1 + file:line hit list; proven RED pre-rewrite / GREEN post-rewrite)
  - validate:domain chained into `npm run validate` (after validate:html); linkinator skip flipped to plain string "https://geohisttrivia.com"
  - 44 legacy-host refs rewritten to the apex across 14 files + the gate script authored (15 files in the planned atomic commit) — working tree verified, zero mixed-domain refs
  - smoke-check BASE pointed at https://geohisttrivia.com — D-09 green-gate precondition armed for plan 08-03
affects: [08-custom-domain-migration plan 03, phase-09-recaptcha, phase-10-social-proof, all future validate-job runs]

# Actuals (#2632) — same scale as the plan's estimate (chars/4 over realized diff)
actuals:
  tokens: 2800      # ~11k chars realized: 53+51 modified-diff lines + 3,684-char new gate script; estimate (30000) budgeted Tasks 1–3 incl. push/CI/orchestration — Tasks 1–2 only realized here
  tasks: 2          # Task 1 + Task 2 complete; Task 3 = orchestrator-owned (commit→push→CI→smoke), pending
  commits: 0        # deferred_commit_mode — one atomic code commit PLANNED (ledger below), executed by orchestrator Task 3

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "zero-dep fs-walk CI gate with runtime-assembled needle (['persano','github','io'].join('.')) — script source contains no legacy literal, cannot self-trip, stays grep-clean"
    - "hidden-dir skip in the walk (.git/.planning/.serena/.gsd tooling state) so gate semantics mirror the rg ignore-respecting acceptance; ALLOW constant stays exactly the 5 planned names"
    - "literal-substring equal-length host swap (both hosts 17 chars) — path preservation 1:1 by construction, apex only, zero shape drift"

key-files:
  created:
    - scripts/check-no-old-domain.mjs
  modified:
    - package.json
    - geohist/index.html
    - geohist/guide.html
    - geohist/contact.html
    - geohist/changelog.html
    - geohist/privacy.html
    - index.html
    - sitemap.xml
    - robots.txt
    - scripts/smoke-check.sh
    - js/i18n.js
    - js/consent.js
    - js/contact.js
    - js/firebase-config.js

key-decisions:
  - "Gate needle assembled at runtime (join('.')) instead of a literal — self-scan safety without an allowlist special case; source stays legacy-host-free like every other tracked file"
  - "Walk skips hidden directories wholesale (tooling state) — mirrors rg's ignore-respecting acceptance; .serena/project.yml project_name (factual identifier, gitignored) never trips the gate"
  - "NUL-byte-in-first-8KiB binary skip (og-image.png, .webp) — walk never mis-reports on media assets"
  - "package.json validate:links skip flipped DURING Task 1 (plan-specified), so pre-rewrite gate RED showed 43 hits (44th ref already eliminated) — reconciliation documented"

# Coverage metadata (#1602)
coverage:
  - id: D1
    description: "All 39 functional absolute URLs point at the apex, path-preserved 1:1: canonical/og:url/og:image/twitter:url/twitter:image (5 geohist pages + hub), JSON-LD url+image+4 screenshots (geohist/index.html), sitemap 6 <loc> (zero lastmod), robots Sitemap line, smoke-check BASE"
    requirement: HOST-02
    verification:
      - kind: unit
        ref: "node scripts/check-no-old-domain.mjs → 'check-no-old-domain: OK' (exit 0) post-rewrite; exit 1 with 43-line file:list pre-rewrite — both directions proven"
        status: pass
      - kind: unit
        ref: "rg 'persano\\.github\\.io' outside allowlist → zero matches (exit 1); rg geohisttrivia.com geohist/index.html → 10 apex refs"
        status: pass
    human_judgment: false
  - id: D2
    description: "5 prose file-header comments reference the new host: 4 js files line-2-only diffs (git diff --stat: 2 ± each, single hunk) + smoke-check.sh line 2 (same single hunk as the BASE flip)"
    requirement: HOST-02
    verification:
      - kind: unit
        ref: "git diff js/{i18n,consent,contact,firebase-config}.js → exactly one hunk each, line 2 only; scripts/smoke-check.sh → lines 2+8 only"
        status: pass
    human_judgment: false
  - id: D3
    description: "CI gate + validate:domain chained after validate:html + plain-string linkinator skip — permanent regression protection (D-06); no regex lookahead anywhere (T-08-02-03 mitigated)"
    requirement: HOST-02
    verification:
      - kind: unit
        ref: "npm run validate → exit 0; chain order validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n; package.json shows --skip \"https://geohisttrivia.com\" plain string"
        status: pass
    human_judgment: false
  - id: D4
    description: "One atomic commit (gate + rewrite, D-05/D-06 sequencing) → push → Actions validate+deploy green → smoke-check green on apex → curl triple (apex 200 / www→apex 301 / github.io→apex 301 path-preserved)"
    requirement: HOST-02
    verification: []
    human_judgment: false
    rationale: "ORCHESTRATOR-OWNED (Task 3): deferred-commit dispatch mode grants no commit/push permission. All local preconditions proven (see Orchestrator Task 3 section); D-09 gate opens only after CI + smoke green."

# Metrics
duration: 5 min (Tasks 1–2 + full local verification battery; orchestrator Task 3 pending)
completed: 2026-09-07
status: complete  # executor scope (authoring + local proofs) complete per deferred-commit dispatch; commit/push/CI/smoke = orchestrator Task 3, pending

---

# Phase 08 Plan 02: URL Rewrite + CI Gate Summary

**One-pass apex migration authored and locally proven: 44 refs rewritten across 14 files (39 functional + 5 prose, path-preserved 1:1), permanent zero-dep CI gate proven RED→GREEN in both directions, validate chain green end-to-end — commit, push, CI watch, and live smoke deferred to orchestrator Task 3.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-09-07T22:01:12Z
- **Completed:** 2026-09-07 (Tasks 1–2; Task 3 = orchestrator)
- **Tasks:** 2 of 3 (Task 3 = orchestrator-owned per deferred-commit dispatch)
- **Files:** 15 (1 created + 14 modified) — the exact atomic-commit payload

## Accomplishments

- **Task 1 — CI gate (D-06):** `scripts/check-no-old-domain.mjs` authored: zero-dep node builtins (node:fs/node:path only), recursive walk from repo root, ALLOW exactly {.planning, README.md, AGENTS.md, .git, node_modules}, hidden-dir tooling-state skip, NUL-byte (first 8 KiB) binary skip, per-line `file:line` hit reporting to console.error, exit 1 with `Old-domain refs found:` list / exit 0 with `check-no-old-domain: OK`. Needle assembled at runtime so the script source contains no legacy literal. package.json: `validate:domain` added; `validate` chain = `validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n`; FIRST `--skip` in validate:links flipped to the plain string `"https://geohisttrivia.com"` (never a regex lookahead — Phase 06 vacuous-gate precedent respected); play.google.com / policies.google.com / planning / node_modules skips untouched.
- **Task 1 verify (RED):** gate exited 1 with a clean 43-line file:line list, zero allowlisted files in output. 43 not 44: the 44th ref (package.json validate:links skip) was already flipped in Task 1 per plan — reconciliation exact (43 + 1 = 44).
- **Task 2 — 44-ref rewrite:** literal-substring equal-length host swap (both hosts 17 chars) → path shapes preserved 1:1, apex only, never www. Per-file counts: geohist/index.html ×10 (canonical, og:url, og:image, twitter:image, JSON-LD url + icon + 4 screenshots), guide/contact/changelog/privacy ×4 each (canonical + og/twitter), hub index.html ×4, sitemap.xml ×6, robots.txt ×1, smoke-check.sh ×2 (line-2 header + line-8 BASE), js ×4 (line-2 headers only). Untouched as ordered: root-relative asset paths, JS logic, Play Store URL, gstatic URLs, google7da873f4e9609872.html, deploy.yml, no CNAME file.
- **Task 2 verify (GREEN):** gate exit 0; rg acceptance (escaped-dot, ignore-respecting) → zero legacy-host matches outside allowlist; 4 js files + smoke-check.sh proven single-hunk line-2/2+8-only diffs (no logic drift, no line-ending churn); sitemap = 6 apex `<loc>`, zero `<lastmod>`; robots Sitemap line apex; smoke BASE = `BASE="https://geohisttrivia.com"`.
- **Full chain:** `npm run validate` → exit 0 (html-validate ✓, check-no-old-domain OK ✓, linkinator 18 local links 200s with the apex skip preventing self-crawl ✓, i18n-detect 23/23 ✓, 20 dictionaries × 170-key exact parity ✓).

## Task Commits

**Deferred-commit mode:** NO code commits made (no commit/push permission this dispatch). Planned ledger — all 15 files sit uncommitted in the working tree:

- feat(08-02): migrate all URLs to geohisttrivia.com + old-domain CI gate — files: scripts/check-no-old-domain.mjs, package.json, geohist/index.html, geohist/guide.html, geohist/contact.html, geohist/changelog.html, geohist/privacy.html, index.html, sitemap.xml, robots.txt, scripts/smoke-check.sh, js/i18n.js, js/consent.js, js/contact.js, js/firebase-config.js

**ONE atomic commit, exact staging list above** (gate and rewrite inseparable per D-05/D-06 — a gate-first commit would fail CI on the still-old refs). Stage exactly these 15 paths; nothing else.

## Files Created/Modified

Created: `scripts/check-no-old-domain.mjs` (~3.7 KB, zero-dep gate).
Modified: the 14 files listed in the plan frontmatter — every change is a hostname swap or the three package.json script edits (chain, validate:domain, skip flip). Pre-existing orchestrator bookkeeping (`.planning/STATE.md`, `.planning/config.json` mods, `.gsd/`, `.planning/agent-history.json`) left untouched.

## Decisions Made

- **Runtime-assembled needle:** gate host constant = `['persano','github','io'].join('.')` — the script's own source contains no legacy literal, so the gate can scan itself honestly and the source stays grep-clean (no self-hit special case needed).
- **Hidden-dir walk skip:** gate skips any entry starting with `.` (tooling state: .git, .planning, .serena cache, agent runtimes) so gate semantics mirror the rg acceptance, which respects .gitignore and would never see `.serena/project.yml:2` (`project_name: "persano.github.io"` — gitignored factual identifier). ALLOW constant remains exactly the 5 planned names.
- **Binary skip:** NUL byte in first 8 KiB → skip (og-image.png, .webp screenshots) — walk never mis-reports on media.
- **argv[1]-derived repo root:** cwd-independent walk without a node:url import — keeps the script to node:fs/node:path exactly as the acceptance requires.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] rg acceptance pattern corrected: unescaped dots → escaped**
- **Found during:** Task 2 verification setup
- **Issue:** plan's verify uses `rg -n "persano.github.io"` — regex dots are wildcards, so the unescaped pattern also matches the dash-form npm package name `persano-github-io` in package.json/package-lock.json (which is NOT a legacy-host reference and must never be rewritten), producing a phantom failure of the zero-match acceptance forever
- **Fix:** acceptance run with `rg -n "persano\.github\.io"` (literal host) + ignore-respecting defaults; verify command is acceptance tooling, not a repo artifact
- **Files modified:** none (verify-command correction)

**2. [Rule 3 - Blocking] Gate walk gains hidden-directory skip**
- **Found during:** Task 1 gate design
- **Issue:** the fs walk (unlike rg) does not respect .gitignore; gitignored tooling state `.serena/project.yml` contains the host as a factual `project_name`, which would make the gate permanently RED after the rewrite
- **Fix:** walk skips entries starting with "." (subsumes .git/.planning; adds .serena/.gsd) — ALLOW set unchanged and exactly as planned; documented in the script header
- **Files modified:** scripts/check-no-old-domain.mjs

**3. [Reconciliation note] Pre-rewrite RED shows 43 hits, plan expected ~44**
- **Found during:** Task 1 verify
- **Issue:** none — the 44th ref (package.json validate:links --skip) is flipped during Task 1 by plan order, so it is already apex at gate-RED time
- **Resolution:** 43 + 1 = 44 exact reconciliation; acceptance is zero-match (never a count) per plan prohibition — no count-based assertion exists

**Total deviations:** 2 tooling-fidelity fixes + 1 reconciliation note. **Impact on plan:** none — all acceptance criteria met or superseded-equivalent; gate both-directions proof intact.

## Issues Encountered

- Windows autocrlf warnings on 9 working-copy files during git diff — benign config notices; single-hunk diff stats prove zero line-ending churn (content untouched).
- `.gsd/` + `.planning/agent-history.json` untracked runtime artifacts from the orchestrator session — not part of the 15-file payload; left for orchestrator handling (gitignore decision is orchestrator-owned).

## User Setup Required

None — owner console steps (runbook §1–§4) already passed in plan 08-01's six-item gate (STATE.md). Remaining work is orchestrator-executed (Task 3 below), not owner-executed.

## Next Phase Readiness

- **Plan 08-03 precondition (D-09) armed:** smoke-check BASE now points at https://geohisttrivia.com — its green run after orchestrator's push+deploy opens the D-09 gate (sitemap resubmit + CoA owner steps).
- **Phase 9:** reCAPTCHA key registers against `geohisttrivia.com` only — the domain is now consistent repo-wide (gate-enforced).
- **Phase 10:** avoid conflicting geohist/index.html edits around the rewrite — rewrite is authored; Phase 10 must rebase its social-proof markup on the apex-URL version in this working tree/commit.

## Known Stubs

None — no placeholders, no unwired data paths; the gate is fully functional in both exit directions.

## Threat Flags

None — no new attack surface; T-08-02-01 (mixed-domain window) is shortened by authoring the rewrite now; T-08-02-02/03 mitigations implemented (gate in chain, plain-string skip).

## Broken-windows ledger

- deviation recorded: gate hidden-dir skip semantic (see Deviation 2) — appended to .planning/WINDOWS.md (best-effort)

## Orchestrator Task 3 (pending — execute after this return)

All local proofs are done. Orchestrator must run:

1. **Stage exactly the 15 files** listed in "Task Commits" (individually — never `git add .`; the tree also carries orchestrator-owned `.planning/STATE.md`/`config.json` mods + `.gsd/` + `.planning/agent-history.json` that do NOT belong in this commit).
2. **One atomic commit:** `feat(08-02): migrate all URLs to geohisttrivia.com + old-domain CI gate` (conventional style; D-05/D-06 single-commit sequencing). `git show --stat` must list all 15 files.
3. **Pre-push gate:** `node scripts/check-no-old-domain.mjs` → exit 0.
4. **Push to main.**
5. **Watch the Actions run on the pushed SHA:** validate job green MUST include the `validate:domain` output line (`check-no-old-domain: OK`), then deploy job green.
6. **Allow the ~60s Pages propagation window** (documented in smoke-check header), then `bash scripts/smoke-check.sh` → exit 0, ALL ~12 checks green, every printed URL prefixed `https://geohisttrivia.com` (grep output for the apex prefix; any legacy-host line = FAIL).
7. **curl triple, exactly as written:**
   - `curl -s -o /dev/null -w "%{http_code}" https://geohisttrivia.com/` → 200
   - `curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" https://www.geohisttrivia.com/` → 301 → apex
   - `curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" https://persano.github.io/geohist/` → 301 → apex with `/geohist/` path preserved
8. If smoke fails on the 404-body check: treat the live run as truth (research Pitfall 7 — do not gate on the API `custom_404` field), diagnose, re-run.
9. Then plan 08-03's D-09 gate is OPEN (owner sitemap resubmit + CoA).

---

*Phase: 08-custom-domain-migration*
*Completed: 2026-09-07 (Tasks 1–2; Task 3 pending with orchestrator)*

## Self-Check: PASSED

- [x] All 15 payload files exist on disk (15/15 FOUND)
- [x] All 15 payload files uncommitted in working tree (14 M + 1 ??) — deferred-commit mode honored; the ONE atomic code commit = orchestrator Task 3
- [x] Gate both-directions proof: RED exit 1 (43 hits, clean list) pre-rewrite → GREEN exit 0 post-rewrite → re-run GREEN (GATE=0) after bookkeeping
- [x] rg acceptance: zero legacy-host matches outside allowlist (literal, ignore-respecting)
- [x] npm run validate → exit 0 (all 5 steps incl. validate:domain + validate:links with plain-string apex skip)
- [x] 5 prose-header files proven single-hunk line-2-only diffs (git diff --stat: 2 ± each; smoke 2+8)
- [x] sitemap 6 apex <loc>, zero <lastmod>; robots apex; smoke BASE apex
- [x] SUMMARY.md on disk; docs commit 224cdc3 present (git log)
- [x] STATE.md (advance-plan 2→3, update-progress, record-metric, record-session, 2 decisions) + ROADMAP.md (08 progress row: 2/3 summaries) + REQUIREMENTS.md (HOST-02, HOST-01 marked) updated

