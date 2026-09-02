---
schema_version: 1
open_count: 3
waived_count: 0
fixed_count: 0
total_count: 3
last_updated: 2026-09-02T05:31:11.439Z
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
  }
]
````
