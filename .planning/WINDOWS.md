---
schema_version: 1
open_count: 1
waived_count: 0
fixed_count: 0
total_count: 1
last_updated: 2026-09-02T03:16:22.991Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 01 | unrun-verify | geohist/privacy.html |  | html-validate could not run locally (npm E404, known proxy breakage); source-assertion battery passed; CI validate job in Plan 01-02 is the enforcement point | open |  | 2026-09-02T03:16:22.991Z |  |

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
  }
]
````
