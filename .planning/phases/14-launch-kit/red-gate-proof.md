# Phase 14 Plan 01 — Red-Gate Proof (both directions, snapshot-copy restore)

**Executed:** 2026-09-15 (Task 2 of 14-01, after the Task 1 gate script + 6-stage validate chain were complete and green)
**Method:** sha256 snapshot-copy via `Copy-Item` BEFORE every mutation, restore AFTER, `Get-FileHash` equality. Snapshot-copy ONLY — the working tree is uncommitted (deferred-commit mode), so any VCS-based restore (checkout-, clean-, or index-based) is forbidden here: it would destroy the deferred work (Phase 13 precedent, same rationale). Zero VCS mutation/restore commands were used anywhere in this task. Snapshots live under `C:/Users/Familia/AppData/Local/Temp/opencode/redgate14/` — outside the repo (never walked by the gate, never committed) — with ONE distinct destination name per source file per cycle (Phase 13 lesson: multi-source `Copy-Item` flattens same-named files): `cycle2--index.html`, `cycle3--index.html`, `cycle4--index.html`, `cycle5--index.html`, `cycleA--index.html`, `cycleA2--index.html` (cycles 1 and 6 mutate nothing restorable; cycle 6's scratch probe is deleted, not restored). The temp dir was removed after the closing hash verification and briefly re-created for the Addendum cycle, then removed again.
**Gate closing state:** all three files hash-identical to their post-fix close state (end-state table below); closing `node scripts/check-play-link.mjs` → `check-play-link: OK` (exit 0); `npm run validate` → exit 0 (6 stages); `Test-Path geohist/gate-probe.html` → False.

## Canonical pre-mutation hashes (Task 1 close state)

| File | sha256 (at the 6-cycle session) |
|------|--------|
| `scripts/check-play-link.mjs` | `3815bd97451ff11d747881fc5e6fe6c9e70e2f840203a044940dd986e2f34a30` (superseded post-fix — see the Script-fix section; final `25d033fbd4f1f26066f51ad3c35a68fdb9fcada5fe023af3e5be472657392996`) |
| `package.json` | `095a9ca607414c79be1c1b85682c32a3487c2ab20a320f89f3ba7e7ba1f49626` |
| `index.html` | `425f1fde144f5ef8eb609fc29242533cdf922b8e423404f8d672270a44834782` (prefix `425f1fde144f5ef8` — identical to the Phase 13 close-state prefix recorded in 13-home-migration/red-gate-proof.md) |

Full hashes captured at snapshot time; cycle rows below cite prefixes against this table. Every post-restore prefix equals its pre-mutation value.

---

## Cycle 1 — Positive control (no mutation)

`node scripts/check-play-link.mjs` on the Task 1 tree, before wiring-adjacent mutations and after the chain wiring:

```
check-play-link: OK
EXIT=0
```

PASS — proves the two bare-domain mentions (package.json `validate:links` `--skip "play.google.com"` flag; index.html:23 comment prose "ratings live on play.google.com and …") do NOT trip the URL-shaped needle, while the walk still sees the 3 canonical id-bearing URLs (index.html:53, 83, 87) and the script's own self-referencing source (self-pass).

## Cycle 2 — FAIL direction: wrong package id (index.html:83)

**Mutation:** snapshot `cycle2--index.html` (prefix `425f1fde144f5ef8`); line 83 badge-CTA href id value `com.persano.geohisttrivia` → `com.example.wrong`.

```
MUTATED: line 83 id -> com.example.wrong
Play URLs missing package id:
  index.html:83 — play.google.com/store/apps/details?id=com.example.wrong
check-play-link: FAIL — every URL-shaped play.google.com URL must use the canonical form
  https://play.google.com/store/apps/details?id=com.persano.geohisttrivia
GATE_EXIT=1
```

Exactly one hit — the mutation was isolated (index.html:53 JSON-LD `sameAs` and index.html:87 proof-row anchor still carried the id and stayed silent).

**Restore:** snapshot-copy back; post-restore prefix `425f1fde144f5ef8` — equal to pre-mutation.

```
check-play-link: OK
GATE_EXIT=0
```

## Cycle 3 — FAIL direction: id removed (index.html:87)

**Mutation:** snapshot `cycle3--index.html` (prefix `425f1fde144f5ef8`); line 87 proof-row anchor href `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` → bare `https://play.google.com/store/apps/` (no query string).

```
MUTATED: line 87 href -> bare store/apps path
Play URLs missing package id:
  index.html:87 — play.google.com/store/apps/
check-play-link: FAIL — every URL-shaped play.google.com URL must use the canonical form
  https://play.google.com/store/apps/details?id=com.persano.geohisttrivia
GATE_EXIT=1
```

**Restore:** snapshot-copy back; post-restore prefix `425f1fde144f5ef8` — equal to pre-mutation.

```
check-play-link: OK
GATE_EXIT=0
```

## Cycle 4 — Adjacent-param PASS (id intact, params allowed)

**Mutation:** snapshot `cycle4--index.html` (prefix `425f1fde144f5ef8`); line 83 href appended `&hl=en` → `details?id=com.persano.geohisttrivia&hl=en`.

```
MUTATED: line 83 href -> details?id=...&hl=en
check-play-link: OK
GATE_EXIT=0
```

PASS — the id is mandatory, additional params are allowed (PITFALLS.md row 214's warning is against experimenting `hl=`/`gl=` onto the SHIPPED URLs, not against the gate tolerating them in future edited forms; the shipped URLs stay param-free).

**Restore:** snapshot-copy back; post-restore prefix `425f1fde144f5ef8` — equal to pre-mutation.

```
check-play-link: OK
GATE_EXIT=0
```

## Cycle 5 — Escaped-ampersand PASS (normalization, no false-fail)

**Mutation:** snapshot `cycle5--index.html` (prefix `425f1fde144f5ef8`); line 83 href to the HTML-escaped form `details?id=com.persano.geohisttrivia&amp;hl=en` (literal `&amp;` bytes in the HTML source).

```
MUTATED: line 83 href -> details?id=...&amp;hl=en (escaped)
check-play-link: OK
GATE_EXIT=0
```

PASS — `&amp;`/`&#38;` normalization unescapes the ampersand before the id check; escaped later params must not false-fail (EA / research Risk 2).

**Restore:** snapshot-copy back; post-restore prefix `425f1fde144f5ef8` — equal to pre-mutation.

```
check-play-link: OK
GATE_EXIT=0
```

## Cycle 6 — FAIL direction: non-canonical form (scratch probe)

**Mutation:** created scratch file `geohist/gate-probe.html` containing one anchor whose href is the URL-shaped download form `https://play.google.com/store/apps/download?id=com.persano.geohisttrivia` (URL-shaped, id-bearing query, but NOT the sanctioned `details?id=` form — PITFALLS.md row 163). No snapshot needed: the file is deleted, not restored.

```
Play URLs missing package id:
  geohist/gate-probe.html:4 — play.google.com/store/apps/download?id=com.persano.geohisttrivia
check-play-link: FAIL — every URL-shaped play.google.com URL must use the canonical form
  https://play.google.com/store/apps/details?id=com.persano.geohisttrivia
GATE_EXIT=1
```

**Deletion:** scratch probe deleted (`PROBE_DELETED`).

```
check-play-link: OK
GATE_EXIT=0
PROBE_EXISTS=False
```

## Script fix after Cycle 6 (Rule 1 — dead scheme condition, corrected)

While preparing the EA-05 evidence check, review found that the Task 1 script's scheme condition could never fire: the needle match itself begins at the host (`play.google.com/…`), so `m[0].startsWith('http://play.google.com')` was unreachable — the EA-05 truth (an insecure-scheme Play URL must FAIL) would have been silently false. Fix: the verdict reads the LINE PREFIX before the match (`lines[i].slice(0, m.index)` lowercased, must end with `http://`) — the scheme lives before the host, the match never carries it. Two hash transitions during the fix, both honestly recorded:

1. `3815bd97…` (Task 1 state, 6-cycle session) → `8c29448f…` (prefix logic added). The first fix comment self-tripped the walk — the gate caught its own source comment carrying a URL-shaped literal without the id (`scripts/check-play-link.mjs:100 — play.google.com/...`) — unplanned proof that the self-scan works; comment rewritten prose-only.
2. `8c29448f…` → `25d033fbd4f1f26066f51ad3c35a68fdb9fcada5fe023af3e5be472657392996` (scheme constant narrowed to the bare scheme literal — the first prefix form compared against scheme+host, which the prefix before the host can never end with; narrowed `endsWith` to the scheme alone).

Positive control re-run at `25d033fb…`:

```
check-play-link: OK
POSITIVE_EXIT=0
```

Cycles 2–6 evidence above is unaffected: the missing-id logic is byte-untouched by the fix; only the (previously dead) scheme condition was added. index.html and package.json were never touched by the fix (their hashes below still hold).

## Addendum cycle A — EA-05: insecure http:// scheme FAIL (post-fix)

**Mutation:** fresh snapshot `cycleA--index.html` (prefix `425f1fde144f5ef8`); line 83 href scheme `https` → `http` (id intact). First run recorded against the PRE-fix gate (`3815bd97…` state): `check-play-link: OK` / `GATE_EXIT=0` — the false PASS that exposed the dead condition (recorded verbatim above in the Script-fix section). Post-fix re-run with snapshot `cycleA2--index.html`:

```
MUTATED: line 83 href scheme https -> http (id intact)
Play URLs missing package id:
  index.html:83 — play.google.com/store/apps/details?id=com.persano.geohisttrivia
check-play-link: FAIL — every URL-shaped play.google.com URL must use the canonical form
  https://play.google.com/store/apps/details?id=com.persano.geohisttrivia
GATE_EXIT=1
```

**Restore:** snapshot-copy back; post-restore prefix `425f1fde144f5ef8` — equal to pre-mutation.

```
check-play-link: OK
GATE_EXIT=0
```

---

## End state (closing checks)

```
scripts/check-play-link.mjs  25d033fbd4f1f260…  = post-fix close state (see Script-fix section)
package.json                 095a9ca607414c79…  = pre-mutation
index.html                   425f1fde144f5ef8…  = pre-mutation

check-play-link: OK           (node scripts/check-play-link.mjs, exit 0)
VALIDATE_EXIT=0               (npm run validate — 6 stages: html, domain, play-links, links, i18n-detect, i18n)
Test-Path geohist/gate-probe.html → False
snapshot temp dir removed     (redgate14 — deleted after closing hash verification, re-created once for the Addendum cycle, deleted again)
```

Both directions proven: id-bearing canonical forms pass (cycles 1, 4, 5); wrong-id, id-less, non-canonical, and insecure-scheme forms fail (cycles 2, 3, 6, and Addendum A). All restores hash-verified snapshot-copies; no VCS-based restore of any kind was used.

Working tree at close: exactly the Task 1 set (new `scripts/check-play-link.mjs` + `package.json` 2 hunks) plus this evidence doc. Nothing committed (deferred-commit mode; /gsd-ship lands the code pair with the planned per-task subjects; planning docs ride the plan's docs commit).
