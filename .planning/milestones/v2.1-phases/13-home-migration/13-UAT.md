---
status: complete
phase: 13-home-migration
source: [13-02-PLAN.md]
started: 2026-09-14
updated: 2026-09-14
---

# Phase 13 UAT — Locally-Runnable Verification Battery (PRE-01..06)

**Reframe note (2026-09-14):** the original 9 post-deploy rows (MIG-01..09) moved VERBATIM to `13-RECORDS.md` per owner-approved ship-gate reframe (phase-12 precedent: post-ship checks live in RECORDS; UAT holds locally-runnable rows). This file now records the pre-deploy, locally-runnable battery — every row below was freshly executed 2026-09-14 during the ship preflight, with observed outputs cited verbatim.

**Public-artifact notice:** this file ships inside the publicly served Pages artifact (the deploy ships the whole tree). It contains console-UI descriptions and public-site checks only — zero credentials, zero tokens, zero secrets anywhere in this file.

**Recording predicate (mechanical, no gap-awareness):** any recorded issue is a blocker — there is no "minor issue" reading. A row that later re-verifies green keeps its supersession note pointing at the original gap (repo convention).

---

## Checks

### 1. PRE-01 — full CI validate chain green over the migrated tree

check: `npm run validate` (html-validate over the 7-page glob incl. `apps/index.html` + `check-no-old-domain` + linkinator 20-URL check + i18n-detect + i18n-keycheck).

expected: exit 0; every sub-gate green.

status: pass

result: pass — `VALIDATE_EXIT=0` observed 2026-09-14 (ship preflight re-run); chain tail shows `i18n-keycheck: OK` with `PASS — *.json exactly covers the 178-key live surface` ×19.

### 2. PRE-02 — key-surface inventory over the new page list

check: `node scripts/i18n-surface.mjs --summary`

expected: `178 keys across 5 pages` (root landing, /apps/ hub, guide, contact, privacy — changelog chrome exception documented).

status: pass

result: pass — `i18n-surface: 178 keys across 5 pages`, exit 0, observed 2026-09-14.

### 3. PRE-03 — stub passes recommended ruleset

check: `npx html-validate geohist/index.html`

expected: exit 0 on the 14-line meta-refresh-0 stub.

status: pass

result: pass — `HTML_VALIDATE_EXIT=0`, observed 2026-09-14.

### 4. PRE-04 — legacy-host gate green over the updated AGENTS.md

check: `node scripts/check-no-old-domain.mjs`

expected: `check-no-old-domain: OK`, exit 0 — AGENTS.md (in the uncommitted migration set) enforced, not allowlisted.

status: pass

result: pass — `check-no-old-domain: OK`, `OLD_DOMAIN_EXIT=0`, observed 2026-09-14.

### 5. PRE-05 — smoke-check direction-1 reproduced (expected pre-deploy FAIL)

check: `bash scripts/smoke-check.sh` against the live apex BEFORE the ship deploys the migration.

expected: FAILED, exit 1 — the new URL list run against the pre-migration live site must fail (this is the direction-1 half of red-gate Cycle 5; its direction-2 ALL-PASS closes post-ship via `13-RECORDS.md` MIG-05).

status: pass (expected-FAIL reproduced)

result: pass — live run 2026-09-14: old rows 200 (`/geohist/contact.html` etc.), `FAIL: /geohist/ stub missing "has moved" content`, `SMOKE CHECK: FAILED`, `SMOKE_EXIT=1`. Direction-1 FAIL independently reproduced; not an issue (by-design expectation, recorded per red-gate-proof.md Cycle 5).

### 6. PRE-06 — red-gate integrity re-verified against current working-tree bytes

check: recompute sha256 of the 5 red-gate-tracked files and compare to the closing table in `red-gate-proof.md`.

expected: all 5 prefixes equal — keycheck `E8E41355A819FC20`, surface `B0AB9B1C926E23E9`, root `index.html` `425F1FDE144F5EF8`, `package.json` `2D7C34D518F42D9F`, `apps/index.html` `B8E6519612BDD84F`.

status: pass

result: pass — 5/5 prefixes recomputed equal, observed 2026-09-14 (ship preflight).

---

## Summary

total: 6

passed: 6

issues: 0

pending: 0

skipped: 0

blocked: 0

## Gaps

(none — all locally-runnable rows pass; post-deploy rows execute via 13-RECORDS.md)

---

*Phase 13 · Home Migration · battery recorded 2026-09-14 (ship preflight, owner-approved ship-gate reframe) · original MIG-01..09 rows live verbatim in 13-RECORDS.md · rides the phase docs commit alongside red-gate-proof.md*
