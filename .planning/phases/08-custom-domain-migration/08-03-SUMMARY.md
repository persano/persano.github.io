---
phase: 08-custom-domain-migration
plan: 03
deferred_commit: false
requirements: [HOST-03]
subsystem: infra
tags: [geohisttrivia.com, google-search-console, sitemap, change-of-address, dns, redirects, smoke-check, custom-domain]

# Dependency graph
requires:
  - phase: 08-02-rewrite-ci-gate
    provides: atomic 44-ref apex rewrite + permanent CI old-domain gate + smoke-green on https://geohisttrivia.com (D-09 gate open)
provides:
  - Final verification evidence: full probe battery green on the new domain (Pages API, DNS, redirect triple, CI gate, smoke 14/14)
  - Owner-side GSC close-out: sitemap resubmitted to new Domain property, Change of Address filed old→new, old property retained (HOST-03 closed, D-08/D-09/D-10 satisfied)
  - Live contact-form proof at the new domain — the migration's user-visible final proof
affects: [09-app-check, seo-phase, milestone-close]

# Actuals (#2632)
actuals:
  tokens: 2300
  tasks: 2
  commits: 1

# Tech tracking
tech-stack:
  added: []   # zero-dependency phase — verification + owner console only
  patterns:
    - "Probe-battery close-out: agent re-runs every phase success criterion post-deploy and records the table in the plan SUMMARY before the owner checkpoint"
    - "Owner-reported console evidence handled as human_judgment coverage entries (GSC/Firebase consoles are unprobeable)"

key-files:
  created:
    - .planning/phases/08-custom-domain-migration/08-03-SUMMARY.md
  modified: []

key-decisions:
  - "No CoA fallback needed — Change of Address tool accepted the old persano.github.io URL-prefix property as source (research A4 assumption held); move filed old→new in the new Domain property"
  - "Old property retained intact as the index-decay monitoring surface (D-08) — no deletion step executed"
  - "Owner request (remove root hub/selector page, serve GeoHist as home) routed to planning as post-phase backlog — out of phase 8 scope"

patterns-established:
  - "Same-day semantics (D-09): sitemap resubmit bound to the smoke-green day by sequencing, verified by owner Success status in the new property"
  - "CoA evidence pattern: owner records what the GSC UI accepted; agent appends verbatim to SUMMARY as checkpoint evidence"

requirements-completed: [HOST-03]

coverage:
  - id: D1
    description: "Final verification sweep — every phase success criterion re-proven post-deploy with zero regression (Pages API, DNS shape, redirect behavior, CI gate, smoke)"
    requirement: HOST-03
    verification:
      - kind: other
        ref: "gh api repos/persano/persano.github.io/pages --jq '{enforced:.https_enforced,cname:.cname,cert:.https_certificate.state,protected:.protected_domain_state}'"
        status: pass
      - kind: other
        ref: "Resolve-DnsName geohisttrivia.com (A×4, AAAA×4, TXT) + www CNAME"
        status: pass
      - kind: other
        ref: "curl redirect triple (apex 200 / http→https 301 / www→apex 301 / github.io→apex 301 path-preserved)"
        status: pass
      - kind: other
        ref: "node scripts/check-no-old-domain.mjs (exit 0)"
        status: pass
      - kind: other
        ref: "bash scripts/smoke-check.sh (ALL PASS 14/14, apex-prefixed, incl. google7da873f4e9609872.html 200 at new host)"
        status: pass
    human_judgment: false
  - id: D2
    description: "GSC sitemap resubmit + Change of Address filed old→new in the new Domain property; old property retained"
    requirement: HOST-03
    verification:
      - kind: other
        ref: "owner-reported GSC console results (see Checkpoint Evidence)"
        status: pass
    human_judgment: true
    rationale: "owner-reported GSC + live form results are unprobeable console/browser evidence"
  - id: D3
    description: "Live contact-form test at https://geohisttrivia.com/geohist/contact.html — real message submitted, success state confirmed"
    requirement: HOST-03
    verification:
      - kind: other
        ref: "owner-reported live form result (see Checkpoint Evidence)"
        status: pass
    human_judgment: true
    rationale: "owner-reported GSC + live form results are unprobeable console/browser evidence"

# Metrics
duration: 5min
completed: 2026-09-07
status: complete
---

# Phase 8 Plan 03: GSC post-migration Summary

**Sitemap resubmitted + Change of Address filed old→new in the new GSC Domain property after a 12-row probe battery went green — live form test at geohisttrivia.com closes HOST-03.**

## Performance

- **Duration:** 5 min (agent-side span since wave-3 start marker; owner console time not agent-measurable)
- **Started:** 2026-09-07T22:15:02Z (wave 3 start per STATE)
- **Completed:** 2026-09-07T22:20:33Z
- **Tasks:** 2/2
- **Files modified:** 1 (this SUMMARY — verification-only plan)

## Accomplishments
- Final verification sweep: full probe battery green, zero regression from 08-02's state
- Owner GSC sequence executed per runbook §6: sitemap Success in new property, CoA filed old→new, old property retained (HOST-03 closed; D-08/D-09/D-10 satisfied)
- Live contact-form proof at the new domain — success state confirmed

## Task Commits

No code commits — verification-only plan (files_modified: []).

1. **Task 1: Final verification sweep** — results recorded in this SUMMARY (probe table below); no commit
2. **Task 2 (gate): OWNER GSC close-out** — owner-reported results recorded below; no commit

**Plan metadata:** docs commit follows this SUMMARY (see Commits).

## Task 1 — Final Verification Sweep (probe table)

| # | Probe | Result |
|---|-------|--------|
| 1 | Pages API `https_enforced` | `true` |
| 2 | Pages API `cname` | `geohisttrivia.com` |
| 3 | Pages API `https_certificate.state` | approved |
| 4 | Pages API `protected_domain_state` | verified |
| 5 | DNS apex | A×4 + AAAA×4 all resolve |
| 6 | DNS www | CNAME → persano.github.io |
| 7 | DNS GitHub TXT | resolves |
| 8 | Redirect apex https | 200 |
| 9 | Redirect http→https | 301 |
| 10 | Redirect www→apex | 301 |
| 11 | Redirect github.io→apex | 301, path-preserved |
| 12 | CI gate + smoke | `check-no-old-domain.mjs` exit 0; smoke **ALL PASS 14/14** apex-prefixed, incl. `google7da873f4e9609872.html` 200 at the new host |

Zero regression from 08-02 green state.

## Checkpoint Evidence (Task 2 — owner-reported, verbatim)

Owner reported all 4 steps executed successfully:

1. **Live contact-form test** — https://geohisttrivia.com/geohist/contact.html OK (success state); apex loads; www redirects.
2. **Sitemap resubmit (D-09/HOST-03)** — https://geohisttrivia.com/sitemap.xml submitted to the NEW Domain property with **Success**.
3. **Change of Address (D-10)** — filed in the new property with source = old persano.github.io URL-prefix property (pre-move checks passed). **No CoA fallback needed** — the research-A4 assumption held.
4. **Old property retained** — intact, watches the 301/index-decay curve (D-08); no deletion step.

## New owner request logged

Owner wants to remove the root hub/selector page (`index.html`) and serve the GeoHist page as the site home. **Out of phase 8 scope** — routed to planning as a post-phase backlog item.

## Files Created/Modified
- `.planning/phases/08-custom-domain-migration/08-03-SUMMARY.md` — final probe table + checkpoint evidence closing HOST-03

## Decisions Made
- No CoA fallback needed — tool accepted the old URL-prefix property as source; move filed as planned (D-10)
- Old property retained intact per D-08 — index-decay monitoring surface preserved
- Selector-page request routed to planning backlog, not executed in phase 8

## Deviations from Plan

None - plan executed exactly as written. (Owner selector-page request is an informational routing, not a plan deviation — no plan step touched.)

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required (owner console steps already executed; 180-day CoA window and rollback branch documented in 08-RUNBOOK.md §6/§7).

## Next Phase Readiness
- HOST-01, HOST-02, HOST-03 all closed — phase 8 complete
- Phase 9 (App Check) unblocked: reCAPTCHA provider decision (v3 vs Enterprise, Cloud Billing) is the first owner decision on record
- Post-phase backlog: selector-page removal (serve GeoHist as site home)

## Commits
- No code commits — verification-only plan; all changes are .planning/ docs (committed via docs commit below)

## Self-Check: PASSED

- SUMMARY exists on disk: FOUND (`.planning/phases/08-custom-domain-migration/08-03-SUMMARY.md`)
- No task commits expected — verification-only plan (`files_modified: []`); docs commit only
- HOST-03 marked complete in REQUIREMENTS.md (checkbox + traceability); shared-ID gate clear (HOST-01 already marked by 08-02, `ready-ids` returned no blocked IDs)

---
*Phase: 08-custom-domain-migration*
*Completed: 2026-09-07*
