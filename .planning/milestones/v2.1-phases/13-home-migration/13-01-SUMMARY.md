---
phase: 13-home-migration
plan: 01
subsystem: ui
tags: [github-pages, seo, canonical, meta-refresh-stub, i18n, ci-gates, sitemap, home-migration]

# Dependency graph
requires:
  - phase: 12-cleanup-batch
    provides: clean reconciled branch (Task 1 runway — Phase 12 deferred commits landed, origin/main merged), CI npm ci + setup-node cache
  - phase: 07-localization-20-rtl
    provides: page-agnostic keyed i18n engine (`js/i18n.js` absolute DICT_URL_PREFIX) + 19 dictionaries × 178 keys
provides:
  - Root `/` serves the full GeoHist landing (verbatim move from `/geohist/`; canonical/og:url/JSON-LD url → `/`; all 20 locales resolve — engine is page-agnostic)
  - `apps/index.html` — portfolio hub at `/apps/` (former root hub verbatim; 13 `hub.*` keys intact; card CTA → `/`)
  - `geohist/index.html` — self-contained meta-refresh-0 stub (noindex,follow + canonical `/` + `<a>` fallback; zero scripts/keys)
  - All 6 gate hardcodes repointed: 5 page-lists (i18n-keycheck, i18n-surface, a11y-audit, smoke-check, validate:html glob) + the keycheck star-uniqueness path → root `index.html`
  - `red-gate-proof.md` — both-direction proofs for every touched gate, sha256 snapshot-copy restores
  - AGENTS.md layout sync (Project paragraph, Hosting constraint, file map, stale 10-RUNBOOK path) riding the same uncommitted change set
affects: [13-02 (RUNBOOK/UAT authoring), gsd-ship (ONE atomic commit), 14-launch-kit (Play surfaces now concentrated in root index.html), post-deploy GSC resubmit]

# Actuals (#2632) — pairs with the plan's `estimate` to calibrate future estimates.
actuals:
  tokens: 21000        # chars/4 over realized diff (~70KB: 55KB diff + 14KB new evidence) + this SUMMARY
  tasks: 3             # Task 1 (runway) completed by orchestrator; Tasks 2-3 this session
  commits: 1           # docs commit only — ALL code changes uncommitted (deferred-commit mode; ship lands ONE atomic commit)

# Tech tracking
tech-stack:
  added: []            # zero new dependencies (file-migration + gate-repoint phase)
  patterns:
    - "Meta-refresh-0 stub with noindex,follow + canonical + <a> fallback as the static-host permanent-redirect primitive"
    - "Atomic page-move coupling: verbatim markup moves keep the 178-key surface; the two pages[] arrays + star path are the only registration points"

key-files:
  created:
    - apps/index.html
    - .planning/phases/13-home-migration/red-gate-proof.md
  modified:
    - index.html
    - geohist/index.html
    - geohist/guide.html
    - geohist/contact.html
    - geohist/changelog.html
    - geohist/privacy.html
    - 404.html
    - sitemap.xml
    - scripts/i18n-keycheck.mjs
    - scripts/i18n-surface.mjs
    - scripts/a11y-audit.mjs
    - scripts/smoke-check.sh
    - package.json
    - AGENTS.md

key-decisions:
  - "Stub dropped from both pages[] arrays (OQ2 recommendation) — arrays keep 'keyed pages' semantics; star-path repoint carries the landing-moved fact"
  - "Extended nav repoints on guide/contact/changelog (nav.game → /, nav.faq → /#faq) per research OQ3 — href-only, satisfies MIG-09 literally"
  - "privacy.html got exactly ONE href-only footer edit (line 72, / → /apps/) per research A1/OQ1; policy content byte-untouched (P-13-03)"
  - "a11y red-gate mutation paired the plan's duplicate-h2 probe with an unlabeled input — the duplicate h2 alone cannot trip the shipped AA gate (axe duplicate-id is moderate); recorded honestly in red-gate-proof.md"
  - "smoke-check gained the stub-content grep ('has moved') — expected to FAIL pre-deploy by design; post-deploy ALL PASS owned by 13-02 UAT"

patterns-established:
  - "Red-gate snapshot-copy: snapshot under per-file DISTINCT names (multi-dir Copy-Item flattens same-named files — collision bit once, corrected, lesson recorded)"
  - "Gate repoint discipline: mutate → FAIL → hash-verified restore → PASS, both directions, per gate, recorded in red-gate-proof.md"

requirements-completed: [MIG-01, MIG-02, MIG-03, MIG-04, MIG-05, MIG-06, MIG-07, MIG-09]

coverage:
  - id: D1
    description: "Root / serves the full GeoHist landing (hero, proof strip, OFF rating row, features, gallery, FAQ, CTA) with the 178-key i18n surface intact"
    requirement: MIG-01
    verification:
      - kind: unit
        ref: "node scripts/i18n-keycheck.mjs → PASS ×19 (178-key live surface)"
        status: pass
      - kind: unit
        ref: "node --test scripts/i18n-detect.test.mjs → 23/23 pass (engine untouched, path-agnostic)"
        status: pass
      - kind: integration
        ref: "node scripts/a11y-audit.mjs → / lighthouse 100, axe 0/0"
        status: pass
    human_judgment: false
  - id: D2
    description: "/geohist/ is a self-contained meta-refresh-0 stub (noindex,follow + canonical / + <a> fallback, zero scripts/keys) and /geohist/privacy.html stayed path-stable with exactly one href-only edit"
    requirement: MIG-02
    verification:
      - kind: unit
        ref: "npx html-validate geohist/index.html → exit 0"
        status: pass
      - kind: unit
        ref: "grep: stub contains content=\"0; url=/\" exactly once, zero data-i18n occurrences"
        status: pass
      - kind: unit
        ref: "git diff geohist/privacy.html → 1 line changed (footer href only)"
        status: pass
    human_judgment: false
  - id: D3
    description: "/apps/ serves the portfolio hub (former root hub verbatim, 13 hub.* keys, zero placeholder cards)"
    requirement: MIG-03
    verification:
      - kind: unit
        ref: "node scripts/i18n-keycheck.mjs → hub.* keys present (178 surface, PASS ×19)"
        status: pass
      - kind: integration
        ref: "node scripts/a11y-audit.mjs → /apps/ lighthouse 100 PASS"
        status: pass
      - kind: e2e
        ref: "npm run validate:links (linkinator) → [200] apps\\"
        status: pass
    human_judgment: false
  - id: D4
    description: "Sitemap has exactly 6 apex <loc> rows (/apps/ swapped in, stub not listed) and every page's canonical == og:url == JSON-LD url at its new path"
    requirement: MIG-04
    verification:
      - kind: unit
        ref: "grep sitemap.xml: 6 <loc>, 0 rows = https://geohisttrivia.com/geohist/"
        status: pass
      - kind: unit
        ref: "grep all 6 pages: canonical/og:url/JSON-LD url triple coherent (landing /, hub /apps/, sub-pages path-stable)"
        status: pass
    human_judgment: false
  - id: D5
    description: "All 6 gate hardcodes repointed and red-gate proven in both directions with sha256 snapshot-copy restores"
    requirement: MIG-05
    verification:
      - kind: unit
        ref: ".planning/phases/13-home-migration/red-gate-proof.md — 6 cycles, FAIL+PASS records, hash pairs equal"
        status: pass
      - kind: unit
        ref: "closing: node scripts/i18n-keycheck.mjs → PASS ×19; npm run validate → exit 0"
        status: pass
    human_judgment: false
  - id: D6
    description: "AGENTS.md reflects the new layout and rides the SAME ship commit as the migration"
    requirement: MIG-06
    verification:
      - kind: unit
        ref: "git diff AGENTS.md → layout rows (Project ¶, Hosting constraint, file map, stale 10-RUNBOOK path) only; old-domain gate OK on updated file"
        status: pass
    human_judgment: true
    rationale: "The same-commit coupling is only verifiable at /gsd-ship commit assembly; locally the diff content is proven but the commit grouping is not."
  - id: D7
    description: "404 page + every nav/footer anchor point at the new layout; 404 visible text unchanged (smoke-check grep coupling)"
    requirement: MIG-09
    verification:
      - kind: unit
        ref: "grep: one data-i18n=\"geohist.footer.back\" href=/apps/ on landing; one hub.card.cta href=/ on hub; 404 href-only diff"
        status: pass
      - kind: unit
        ref: "scripts/smoke-check.sh line 49 grep byte-untouched; 404.html text identical"
        status: pass
    human_judgment: false
  - id: D8
    description: "Post-deploy smoke-check ALL PASS over the new URL list (incl. /apps/ 200 and stub 'has moved' content)"
    requirement: MIG-05
    verification: []
    human_judgment: true
    rationale: "Requires the deployed site (post-ship); direction-1 FAIL evidence recorded in red-gate-proof.md, direction-2 owned by the 13-02 UAT gate."

# Metrics
duration: ~45min (Tasks 2-3; start timestamp not captured — 2 full a11y battery runs ≈ 8 min of it)
completed: 2026-09-14
status: complete
deferred_commit: true
---

# Phase 13 Plan 01: Home Migration Summary

**Root `/` now serves the GeoHist landing, the portfolio hub moved verbatim to `/apps/`, `/geohist/` became a self-contained meta-refresh-0 stub, and all six gate hardcodes were repointed and red-gate proven — one atomic uncommitted change set, 178×19 i18n surface untouched.**

## Performance

- **Duration:** ~45 min (Tasks 2-3; Task 1 executed earlier by the orchestrator)
- **Started:** 2026-09-14 (afternoon session; exact start not captured)
- **Completed:** 2026-09-14T15:40Z
- **Tasks:** 3 of 3 (Task 1: orchestrator; Tasks 2-3: this executor)
- **Files modified:** 14 modified + 2 created (apps/index.html, red-gate-proof.md)

## Accomplishments
- Page moves executed verbatim: `geohist/index.html` (landing) → root `index.html`; former root hub → `apps/index.html`; `geohist/index.html` → Pattern-1 stub. Zero key additions/renames/drops — 178×19 set-equality stayed green throughout.
- All 6 gate hardcodes repointed in the same change set: keycheck pages[] + star path (line 184), i18n-surface pages[] (+ header), a11y PAGES (`/apps/` replaces `/geohist/`; stub NOT audited), smoke-check URL list (+ `/apps/` + stub grep), package.json validate:html glob (+ `apps/index.html`).
- Full verification chain green on the final state: keycheck PASS ×19, `i18n-surface: 178 keys across 5 pages`, `npm run validate` exit 0 (html/domain/links/i18n-detect/i18n), a11y battery ALL PASS over the new 5-page list, html-validate stub exit 0, old-domain gate OK.
- Red-gate proofs recorded for every touched gate in `red-gate-proof.md` — 6 cycles, both directions where applicable, sha256 snapshot-copy restores all hash-equal.
- Href-only repoints: guide/contact/changelog (3 anchors each), privacy (1 footer anchor, policy byte-frozen), 404 (href-only, "Back to the hub" text intact), sitemap row 2 → `/apps/` (6 `<loc>` rows, no lastmod, stub not listed).
- AGENTS.md layout sync (MIG-06): Project paragraph, Hosting constraint, file map rows (landing/hub/stub/404), stale 10-RUNBOOK path fix (OQ4) — riding the SAME uncommitted change set as the migration.

## Task Commits

Deferred-commit mode — NO code commits made this plan. All migration changes sit uncommitted in the working tree awaiting the single atomic ship commit.

**Planned ship commit (suggested subject from the plan):**
`feat(13-01): root = GeoHist landing, hub -> /apps/, /geohist/ stub, gates repointed (one atomic commit)` — files: index.html, apps/index.html, geohist/index.html, geohist/guide.html, geohist/contact.html, geohist/changelog.html, geohist/privacy.html, 404.html, sitemap.xml, scripts/i18n-keycheck.mjs, scripts/i18n-surface.mjs, scripts/a11y-audit.mjs, scripts/smoke-check.sh, package.json, AGENTS.md

**Task 1 (orchestrator, already landed):**
1. **Task 1: Runway** — `8d2b824` chore(12-01) CI unit; `2039642` docs(12-02) records unit; `869a280` docs(13) tracking; `aa17a6f` merge origin/main (PR #6). Tree clean, 0 behind origin/main, 16 ahead at handoff.

**This session (docs commit):**
2. **Task 2: Atomic migration edit set** — uncommitted (see ledger above)
3. **Task 3: Red-gate proofs** — red-gate-proof.md authored; docs commit via gsd_run (see .planning files)

## Files Created/Modified
- `index.html` — GeoHist landing at root (verbatim landing body; canonical/og:url/JSON-LD url → `/`; nav.game → `/`, nav.faq → `/#faq`, footer.back → `/apps/`)
- `apps/index.html` — NEW portfolio hub (former root hub verbatim; canonical/og:url → `/apps/`; card CTA → `/`; 13 hub.* keys intact; OG image stays `/geohist/og-image.png`)
- `geohist/index.html` — meta-refresh-0 stub (noindex,follow, canonical `/`, `content="0; url=/"`, `<a>` fallback; zero scripts/keys/data-i18n)
- `geohist/guide.html`, `geohist/contact.html`, `geohist/changelog.html` — 3 href-only edits each (nav.game, nav.faq, footer.back)
- `geohist/privacy.html` — ONE href-only footer edit (line 72); path + policy content frozen
- `404.html` — href-only edit (hub link → `/apps/`; text unchanged)
- `sitemap.xml` — row 2 `/geohist/` → `/apps/`; exactly 6 `<loc>` rows
- `scripts/i18n-keycheck.mjs` — pages[] array + star-uniqueness path → root `index.html` + header comment sync
- `scripts/i18n-surface.mjs` — pages[] array + header parenthetical sync
- `scripts/a11y-audit.mjs` — PAGES: `/apps/` replaces `/geohist/`
- `scripts/smoke-check.sh` — `$BASE/apps/` added; stale comments updated; stub-content grep added; line 49 untouched
- `package.json` — validate:html glob += `apps/index.html`
- `AGENTS.md` — layout sync (MIG-06) + stale 10-RUNBOOK path (OQ4)
- `.planning/phases/13-home-migration/red-gate-proof.md` — NEW evidence (6 cycles, hash pairs, honest deviation record)

## Decisions Made
- Dropped the stub from both pages[] arrays (research OQ2): arrays keep keyed-page semantics; the star-path repoint carries the "landing at root" fact.
- Included the extended nav repoints (nav.game/nav.faq) on guide/contact/changelog (research OQ3) — href-only, MIG-09 satisfied literally.
- privacy.html: exactly one href-only edit (A1/OQ1 accepted recommendation); freeze fenced by the one-line diff (verified above).
- AGENTS.md file-map label updated to "shipped v2.1 home migration" alongside the mandated row rewrites (keeps the map truthful; doc-only).
- Keycheck/surface header comments updated in the same pass (doc truthfulness; comment-only).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Red-gate snapshot name collision corrupted two restores**
- **Found during:** Task 3 (cycles 2-3 restores)
- **Issue:** `Copy-Item` with multi-source including `apps\index.html` flattened both `index.html` files into one snapshot name; the `apps` copy overwrote the root snapshot. First star-cycle restore wrote hub content into root `index.html` (hash mismatch caught immediately); the `apps/index.html` snapshot was lost in the cleanup.
- **Fix:** Deterministic rewrite of both files to their exact Task 2 content via the Write tool; hash-verified byte-identical (`425F1FDE…` / `B8E65196…`); snapshots re-taken under distinct names (`root-index.html`, `apps-index.html`).
- **Files modified:** none beyond the two restored files (net-zero; verified by closing hash table)
- **Verification:** closing hash table in red-gate-proof.md — all five files equal to pre-mutation hashes; keycheck PASS ×19; validate exit 0
- **Committed in:** uncommitted (rides the migration change set; red-gate-proof.md documents the incident)

---

**Total deviations:** 1 auto-fixed (Rule 3 blocking), zero scope creep. All plan-specified edits landed exactly as prescribed (plus comment-only doc syncs inside already-listed files).

## Issues Encountered
- The plan's cycle-4 mutation ("duplicate h2") alone cannot trip the shipped AA gate (axe `duplicate-id` = moderate, gate is critical/serious; LH 100→100 in observation). Paired it with an unlabeled input — a real critical a11y bug — and recorded both facts verbatim in red-gate-proof.md. Gate FAIL achieved (axe `label` critical=1, LH 94 < 95); PASS re-run green after hash-verified restore.
- Cycle 3 sequencing slip: first "new glob" run executed while package.json still carried the mutated old glob (both runs old-glob). Old-glob gap evidence (exit 0) unaffected; new-glob FAIL then captured after snapshot restore (exit 1, close-order errors). Recorded honestly in red-gate-proof.md.

## Auth Gates
None.

## Known Stubs
None. No placeholder content, no unwired components. The stub page is a deliberate deliverable (Pattern 1), not a stub defect.

## User Setup Required
None — no external service configuration required by this plan. (Post-deploy GSC sitemap resubmit + URL inspection are owner console steps authored by 13-02, MIG-08.)

## Next Phase Readiness
- 13-02 (RUNBOOK/UAT) can author against the final state: GSC resubmit + URL inspection steps, post-deploy smoke direction-2 record, owner checkpoints.
- `/gsd-ship` must land the migration as ONE atomic commit containing all 15 migration files + AGENTS.md (STATE locked decision; single-revert rollback story).
- Post-ship watch items: smoke-check full ALL PASS (once deployed), GSC resubmit (13-RUNBOOK), GA4 `page: '/geohist/'` old fires are reporting-only (no action).
- Play-critical surface unaffected: `/geohist/privacy.html` path + content frozen; its `/geohist/` asset references untouched.

---
*Phase: 13-home-migration*
*Completed: 2026-09-14*

## Self-Check: PASSED
- All created/modified files exist on disk (verified by Test-Path: index.html, apps/index.html, geohist/index.html, red-gate-proof.md, this SUMMARY).
- Task 1 commit evidence verified in git log: 8d2b824, 2039642, 869a280, aa17a6f — all present.
- Deferred-commit mode: zero code commits made by this executor; migration change set verified uncommitted (`git status --short` = 14 modified + apps/ new).
