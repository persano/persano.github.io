---
schema_version: 1
open_count: 14
waived_count: 0
fixed_count: 1
total_count: 15
last_updated: 2026-09-10T03:10:18.559Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 01 | unrun-verify | geohist/privacy.html |  | html-validate could not run locally (npm E404, known proxy breakage); source-assertion battery passed; CI validate job in Plan 01-02 is the enforcement point | open |  | 2026-09-02T03:16:22.991Z |  |
| 2 | 02 | stub | geohist/index.html | 67 | Gallery placeholder tiles (intentional per D-13/D-23; real WebP screenshots replace them in Phase 5, markup stable) | open |  | 2026-09-02T05:31:10.941Z |  |
| 3 | 02 | deviation | geohist/index.html | 35 | Task 2 plan verify expected 'Screenshots coming soon' count=1 but acceptance/D-23 mandate exactly 3 keyed captions (one per tile); executed per acceptance (3) | open |  | 2026-09-02T05:31:11.439Z |  |
| 4 | 03 | deviation | js/i18n.js |  | detect() scan skips en-*/unknown tags per D-32 example (es anywhere in prefs wins); research Pattern 2 pseudocode corrected; owner browser-check pending per human-check list | open |  | 2026-09-02T18:18:30.842Z |  |
| 5 | 4 | unrun-verify | geohist/index.html |  | Plan 04-01 Task 3 live 6-check battery (fresh-incognito zero-request, Accept/Reject network flows, GA4 DebugView events) not yet run by owner - transferred to phase UAT as D5 (04-01-SUMMARY.md) | open |  | 2026-09-03T01:23:03.674Z |  |
| 6 | 4 | unrun-verify | firebase/firestore.rules | 10 | 04-02 Task 3: Rules Playground battery (cases 1-6) + live submit battery (cases 7-10) not runnable until owner completes Firebase console prerequisites (Anonymous provider, production Firestore, rules paste) | open |  | 2026-09-03T01:34:39.814Z |  |
| 7 | 05 | unrun-verify | geohist/index.html |  | Rich Results Test on live /geohist/ (SoftwareApplication, zero errors) NOT run - changes uncommitted at execution, deployed URL serves old page; PENDING post-ship human verification | open |  | 2026-09-04T13:45:40.418Z |  |
| 8 | 05 | unrun-verify | .planning/phases/05-discovery-quality-screenshots-seo-json-ld-aa-audit/05-03-SUMMARY.md |  | D-69 owner console steps NOT executed (Play Console privacy-URL field + GSC sitemap submit) - owner-only actions, sitemap.xml not yet deployed (404 live); instructions recorded in SUMMARY, checkpoint OPEN | open |  | 2026-09-04T13:45:44.457Z |  |
| 9 | 05 | deviation | GeoHist_Trivia_Privacy_Policy.html |  | D-70 deletion of 3 superseded root policy files (.html/.md/.pdf) deferred - gate unmet (no owner D-69 confirmation, final deploy not shipped); files untouched in working tree, deletion rides post-confirmation deploy | open |  | 2026-09-04T13:45:44.598Z |  |
| 10 | 7 | unrun-verify | css/base.css |  | Owner-rendered checks deferred to D-06 skim: computed line-height on a paragraph under lang=ur shows 2, select keyboard/AT-operable, mirrored layout under ar | open |  | 2026-09-07T02:29:30.974Z |  |
| 11 | 08 | unmet-truth | geohisttrivia.com (live edge) |  | http://geohisttrivia.com/ serves 200 (no 301 to https) after https_enforced PUT; API state true; docs 24h propagation window; re-check runbook 08-RUNBOOK.md §0 row 12 | fixed |  | 2026-09-07T21:19:43.919Z | 2026-09-07T21:21:40.983Z |
| 12 | 08 | deviation | .planning/phases/08-custom-domain-migration/08-RUNBOOK.md |  | Owner option-B divergence ruling: GitHub verification TXT NXDOMAIN between sessions; absorbed as runbook §1b/§2 re-add flow; Task 3 gate expanded to six items | open |  | 2026-09-07T21:19:44.491Z |  |
| 13 | 08 | deviation | scripts/check-no-old-domain.mjs |  | gate walk skips hidden dirs (tooling state) so fs-walk semantics mirror the ignore-respecting rg acceptance; ALLOW set unchanged | open |  | 2026-09-07T22:07:42.844Z |  |
| 14 | 10 | stub | geohist/index.html | 76 | Intentional 0.0 placeholder in unkeyed .proof-row-score span (D-04 self-flagging OFF gate) — resolved at owner flip per 10-RUNBOOK.md (plan 10-02) | open |  | 2026-09-10T02:22:56.603Z |  |
| 15 | 10 | deviation | git-remote-main |  | Remote main 3eaf9d9 (bridge fast-forwards a24fd4e+3eaf9d9, tree 0556bf2) carries the Phase 10 delta while local HEAD 275046b does not - /gsd-ship must fetch/rebase before pushing its deferred commits (content identical) | open |  | 2026-09-10T03:10:18.559Z |  |

````json
[
  {
    "id": 1,
    "kind": "unrun-verify",
    "phase": "01",
    "file": "geohist/privacy.html",
    "line": null,
    "description": "html-validate could not run locally (npm E404, known proxy breakage); source-assertion battery passed; CI validate job in Plan 01-02 is the enforcement point",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-02T03:16:22.991Z",
    "resolved_at": null
  },
  {
    "id": 2,
    "kind": "stub",
    "phase": "02",
    "file": "geohist/index.html",
    "line": 67,
    "description": "Gallery placeholder tiles (intentional per D-13/D-23; real WebP screenshots replace them in Phase 5, markup stable)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-02T05:31:10.941Z",
    "resolved_at": null
  },
  {
    "id": 3,
    "kind": "deviation",
    "phase": "02",
    "file": "geohist/index.html",
    "line": 35,
    "description": "Task 2 plan verify expected 'Screenshots coming soon' count=1 but acceptance/D-23 mandate exactly 3 keyed captions (one per tile); executed per acceptance (3)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-02T05:31:11.439Z",
    "resolved_at": null
  },
  {
    "id": 4,
    "kind": "deviation",
    "phase": "03",
    "file": "js/i18n.js",
    "line": null,
    "description": "detect() scan skips en-*/unknown tags per D-32 example (es anywhere in prefs wins); research Pattern 2 pseudocode corrected; owner browser-check pending per human-check list",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-02T18:18:30.842Z",
    "resolved_at": null
  },
  {
    "id": 5,
    "kind": "unrun-verify",
    "phase": "4",
    "file": "geohist/index.html",
    "line": null,
    "description": "Plan 04-01 Task 3 live 6-check battery (fresh-incognito zero-request, Accept/Reject network flows, GA4 DebugView events) not yet run by owner - transferred to phase UAT as D5 (04-01-SUMMARY.md)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-03T01:23:03.674Z",
    "resolved_at": null
  },
  {
    "id": 6,
    "kind": "unrun-verify",
    "phase": "4",
    "file": "firebase/firestore.rules",
    "line": 10,
    "description": "04-02 Task 3: Rules Playground battery (cases 1-6) + live submit battery (cases 7-10) not runnable until owner completes Firebase console prerequisites (Anonymous provider, production Firestore, rules paste)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-03T01:34:39.814Z",
    "resolved_at": null
  },
  {
    "id": 7,
    "kind": "unrun-verify",
    "phase": "05",
    "file": "geohist/index.html",
    "line": null,
    "description": "Rich Results Test on live /geohist/ (SoftwareApplication, zero errors) NOT run - changes uncommitted at execution, deployed URL serves old page; PENDING post-ship human verification",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-04T13:45:40.418Z",
    "resolved_at": null
  },
  {
    "id": 8,
    "kind": "unrun-verify",
    "phase": "05",
    "file": ".planning/phases/05-discovery-quality-screenshots-seo-json-ld-aa-audit/05-03-SUMMARY.md",
    "line": null,
    "description": "D-69 owner console steps NOT executed (Play Console privacy-URL field + GSC sitemap submit) - owner-only actions, sitemap.xml not yet deployed (404 live); instructions recorded in SUMMARY, checkpoint OPEN",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-04T13:45:44.457Z",
    "resolved_at": null
  },
  {
    "id": 9,
    "kind": "deviation",
    "phase": "05",
    "file": "GeoHist_Trivia_Privacy_Policy.html",
    "line": null,
    "description": "D-70 deletion of 3 superseded root policy files (.html/.md/.pdf) deferred - gate unmet (no owner D-69 confirmation, final deploy not shipped); files untouched in working tree, deletion rides post-confirmation deploy",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-04T13:45:44.598Z",
    "resolved_at": null
  },
  {
    "id": 10,
    "kind": "unrun-verify",
    "phase": "7",
    "file": "css/base.css",
    "line": null,
    "description": "Owner-rendered checks deferred to D-06 skim: computed line-height on a paragraph under lang=ur shows 2, select keyboard/AT-operable, mirrored layout under ar",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-07T02:29:30.974Z",
    "resolved_at": null
  },
  {
    "id": 11,
    "kind": "unmet-truth",
    "phase": "08",
    "file": "geohisttrivia.com (live edge)",
    "line": null,
    "description": "http://geohisttrivia.com/ serves 200 (no 301 to https) after https_enforced PUT; API state true; docs 24h propagation window; re-check runbook 08-RUNBOOK.md §0 row 12",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-09-07T21:19:43.919Z",
    "resolved_at": "2026-09-07T21:21:40.983Z"
  },
  {
    "id": 12,
    "kind": "deviation",
    "phase": "08",
    "file": ".planning/phases/08-custom-domain-migration/08-RUNBOOK.md",
    "line": null,
    "description": "Owner option-B divergence ruling: GitHub verification TXT NXDOMAIN between sessions; absorbed as runbook §1b/§2 re-add flow; Task 3 gate expanded to six items",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-07T21:19:44.491Z",
    "resolved_at": null
  },
  {
    "id": 13,
    "kind": "deviation",
    "phase": "08",
    "file": "scripts/check-no-old-domain.mjs",
    "line": null,
    "description": "gate walk skips hidden dirs (tooling state) so fs-walk semantics mirror the ignore-respecting rg acceptance; ALLOW set unchanged",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-07T22:07:42.844Z",
    "resolved_at": null
  },
  {
    "id": 14,
    "kind": "stub",
    "phase": "10",
    "file": "geohist/index.html",
    "line": 76,
    "description": "Intentional 0.0 placeholder in unkeyed .proof-row-score span (D-04 self-flagging OFF gate) — resolved at owner flip per 10-RUNBOOK.md (plan 10-02)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-10T02:22:56.603Z",
    "resolved_at": null
  },
  {
    "id": 15,
    "kind": "deviation",
    "phase": "10",
    "file": "git-remote-main",
    "line": null,
    "description": "Remote main 3eaf9d9 (bridge fast-forwards a24fd4e+3eaf9d9, tree 0556bf2) carries the Phase 10 delta while local HEAD 275046b does not - /gsd-ship must fetch/rebase before pushing its deferred commits (content identical)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-10T03:10:18.559Z",
    "resolved_at": null
  }
]
````
