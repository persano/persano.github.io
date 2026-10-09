# Phase 13 Plan 01 — Red-Gate Proof (both directions, snapshot-copy restore)

**Executed:** 2026-09-14 (Task 3 of 13-01, after the Task 2 atomic edit set was complete and green)
**Method:** sha256 snapshot-copy via `Copy-Item` BEFORE every mutation, restore AFTER, hash-verified equality. Snapshot-copy only — the working tree is uncommitted (deferred-commit mode), so index-based restore is unusable (Phase 10/11 precedent). Zero VCS mutation/restore commands were used anywhere in this task (no checkout-based, clean-based, or index-based restore of any kind).
**Gate closing state:** all five touched files hash-identical to the Task 2 final state (table below); closing `node scripts/i18n-keycheck.mjs` → PASS ×19 (`KEYCHECK_RESTORED_EXIT=0` / final `KEYCHECK_EXIT=0`); `npm run validate` → exit 0.

## Canonical pre-mutation hashes (Task 2 final state)

| File | sha256 |
|------|--------|
| `scripts/i18n-keycheck.mjs` | `E8E41355A819FC207A9E9C25A56816D48D1EE860F431C010C44D249E86AF0EA9*` (prefix verified E8E41355A819FC20) |
| `scripts/i18n-surface.mjs` | prefix `B0AB9B1C926E23E9` |
| `index.html` (root landing) | prefix `425F1FDE144F5EF8` |
| `package.json` | prefix `2D7C34D518F42D9F` |
| `apps/index.html` | prefix `B8E6519612BDD84F` |

Full hashes were captured at snapshot time; cycle rows below cite the 16-hex prefixes against this table. Post-restore prefixes in every cycle match these values exactly.

---

## Cycle 1 — i18n-keycheck `pages[]` + i18n-surface `pages[]` (same array shape, one cycle covers both)

**Mutation:** both scripts' line-48/line-32 array reverted to the OLD layout:
`['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')]`
while the markup is at the NEW layout (hub at `apps/index.html`, `geohist/index.html` = stub with 0 keys).

**Direction 1 — old gate list on new layout → FAIL (expected):**

```
i18n-keycheck: FAIL — ar.json (surface 165 keys, dictionary 178 keys)
  extra keys   (13): hub.brand, hub.card.cta, hub.card.desc, hub.card.icon-alt, hub.card.name, hub.footer.consent, hub.footer.contact, hub.footer.copyright, hub.footer.privacy, hub.intro.1, hub.intro.2, hub.meta.desc, hub.meta.title
… (identical FAIL pair for all 19 dictionaries: ar bn de el es fr hi id it ja ko nl pl pt-BR ru tr ur vi zh)
i18n-keycheck: FAIL — zh.json (surface 165 keys, dictionary 178 keys)
i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above
KEYCHECK_MUTATED_EXIT=1
```

Same cycle, `i18n-surface` with its old array printed `i18n-surface: 165 keys across 5 pages` (exit 0) — the inventory tool audits the wrong set silently; the set-equality FAIL is owned by keycheck. This is why both arrays must move together with the pages.

**Restore:** snapshot-copy of both scripts back; post-restore prefixes `E8E41355A819FC20` (keycheck) and `B0AB9B1C926E23E9` (surface) — equal to pre-mutation.

**Direction 2 — repointed gate on new layout → PASS (expected):**

```
i18n-keycheck: PASS — <dict>.json exactly covers the 178-key live surface   (×19)
i18n-keycheck: OK
KEYCHECK_RESTORED_EXIT=0
i18n-surface: 178 keys across 5 pages
```

## Cycle 2 — keycheck star-uniqueness path (line 184 → root `index.html`)

**Mutation (direction 2, new gate catches a real mutation):** root `index.html` star SVG class renamed `proof-row-star` → `proof-row-star-renamed`.

```
MUTATED_KEYCHECK_EXIT=1
i18n-keycheck: FAIL — star uniqueness: 0 proof-row-star SVG(s) (expected exactly 1), 0 star literal(s) in markup (expected 0)
```

The FAIL message is path-agnostic by design; the path repoint is proven by the flip-compat cycle below: the gate finds exactly ONE star SVG in root `index.html` (the stub at `geohist/index.html` contains 0 SVGs — an un-repointed gate reading the stub could never PASS).

**Restore:** snapshot-copy of root `index.html`; post-restore prefix `425F1FDE144F5EF8` — equal to pre-mutation. `KEYCHECK_RESTORED_EXIT=0` (PASS ×19, star check green).

**Flip-compat cycle (expects GREEN by construction — Phase 11 precedent):** removed `hidden` from the OFF rating row and changed the score span `0.0` → `4.5` in root `index.html` (the owner's exact future Tier-1 flip, 10-RUNBOOK §2 shape).

```
FLIP_KEYCHECK_EXIT=0   (PASS ×19 with the row flipped ON — the flip cannot red the gate)
```

**Restore:** snapshot-copy; post-restore prefix `425F1FDE144F5EF8`; `RESTORED_KEYCHECK_EXIT=0`.

## Cycle 3 — `package.json` validate:html glob

**Mutation:** glob reverted to the OLD string (`html-validate index.html 404.html geohist/*.html`) AND an unclosed-element probe injected into `apps/index.html` (`<section class="red-gate-probe">unclosed probe content` before `</body>`).

**Direction 1 — old glob + broken new page → falsely PASSES (gap proven):**

```
npx html-validate index.html 404.html geohist/*.html
OLDGLOB_EXIT=0        ← 5 real errors invisible: apps/index.html not in the glob
```

**Direction 2 — new glob + same mutation → FAIL (expected):**

```
npm run validate:html   (glob includes apps/index.html)
  58:2   error  End tag '</html>' seen but there were open elements     close-order
✖ 5 problems (5 errors, 0 warnings)
NEWGLOB_EXIT=1
```

**Restore:** `package.json` snapshot-copied back (post-restore prefix `2D7C34D518F42D9F`); `apps/index.html` rebuilt to the exact Task 2 bytes (post-restore prefix `B8E6519612BDD84F`); `npm run validate:html` → `RESTORED_VALIDATE_HTML_EXIT=0`.

## Cycle 4 — a11y-audit PAGES

**Mutation:** injected into root `index.html` after the features heading: a duplicate `<h2 id="features-title">Duplicate heading probe</h2>` (per plan) plus an `<input type="text">` probe. Observed: the duplicate h2 alone does not trip the shipped AA gate (axe `duplicate-id` is moderate-impact, below the critical/serious gate); the unlabeled input trips it on both engines — recorded verbatim:

**Direction 1 — mutated layout → FAIL (expected):**

```
Scanning /
  axe: critical=1 serious=0 moderate=0 minor=0 incomplete=5
  lighthouse a11y: 94
  axe rule label [critical] nodes=1
  lh fail: label
/                         1/0           94        FAIL
BATTERY: FAILED
A11Y_MUTATED_EXIT=1
```

(All four other PAGES rows — `/apps/`, guide, contact, privacy — stayed PASS; the mutation was isolated to `/`.)

**Restore:** snapshot-copy of root `index.html`; post-restore prefix `425F1FDE144F5EF8` — equal to pre-mutation.

**Direction 2 — restored layout → PASS (expected):**

```
===== A11Y AA BATTERY =====
/                         0/0           100       PASS
/apps/                    0/0           100       PASS
/geohist/guide.html       0/0           100       PASS
/geohist/contact.html     0/0           100       PASS
/geohist/privacy.html     0/0           100       PASS
BATTERY: ALL PASS
A11Y_RESTORED_EXIT=0
```

This PASS run also proves the repointed PAGES list audits the new 5-page set (root = landing with the Tier-1 row; `/apps/` = hub; stub NOT in the list — a meta-refresh-0 page would navigate the driver mid-scan).

## Cycle 5 — smoke-check.sh URL list (live-targeted)

No mutation needed — the NEW list (with `$BASE/apps/` + the stub-content grep) was run against the CURRENT LIVE pre-migration site.

**Direction 1 — new list on pre-migration live site → FAIL (expected, proves the list covers the new layout):**

```
https://geohisttrivia.com/ -> 200
https://geohisttrivia.com/apps/ -> 404
FAIL: expected HTTP 200
… (all other 200 rows: contact, privacy, app-ads.txt, GSC file, /geohist/, guide, changelog, sitemap, robots, og-image — 200)
https://geohisttrivia.com/does-not-exist -> 404
FAIL: /geohist/ stub missing "has moved" content
https://geohisttrivia.com/.nojekyll -> 200
SMOKE CHECK: FAILED
SMOKE_EXIT=1
```

Two FAILs, both expected pre-deploy: (1) `$BASE/apps/` 404 — the new row detects the layout the deploy must create; (2) the stub-content grep fails because live `/geohist/` still serves the landing until the migration deploys. The 404-body grep (`back to the hub`) stayed byte-untouched in the script and the 404 text is unchanged, so that coupling survives.

**Direction 2 (post-deploy ALL PASS):** **PENDING** — owned by the phase UAT gate after `/gsd-ship` deploys; to be recorded in `13-UAT.md` (13-02). Not fabricated here. [closed 2026-09-14: post-deploy live smoke run ALL PASS — SMOKE CHECK: ALL PASS, exit 0, /apps/ → 200 + stub "has moved" grep green — recorded as MIG-05 in 13-RECORDS.md (ship-gate reframe vehicle: post-ship rows live in the records file); this PENDING line stays verbatim per repo convention]

## Cycle 6 — check-no-old-domain: no red-gate required (rationale)

`scripts/check-no-old-domain.mjs` gate logic is untouched by this phase (path-walk + allowlist unchanged). The migration introduces no legacy-host literals in any tracked file: the dual-hosts fact is phrased "legacy `*.github.io` Pages host" everywhere, AGENTS.md included. Pre-ship proof = the full chain green on the final state:

```
validate:domain → check-no-old-domain: OK
npm run validate → VALIDATE_EXIT=0   (html + domain + links + i18n-detect + i18n, all five stages)
```

---

## Deviation note (honest record — restore-method incident, corrected)

The initial multi-file snapshot `Copy-Item a,b,…,apps\index.html -Destination <snapdir>` flattened both `index.html` files into one name; the `apps` copy overwrote the root snapshot. Effects, all corrected within Task 3:

1. First star-cycle restore wrote hub content into root `index.html` — detected immediately by hash mismatch (`B8E65196…` ≠ `425F1FDE…`), fixed by deterministic rewrite to the exact Task 2 content, hash-verified equal (`425F1FDE…`), snapshot re-taken under a distinct name (`root-index.html`).
2. The `apps/index.html` snapshot was lost in the same collision; after the glob cycle it was rebuilt the same way and hash-verified equal (`B8E65196…`).

The FAIL evidence for cycles 2–3 is unaffected (mutations ran against the live files; expected FAILs were observed before any restore). Lesson recorded: snapshot multi-dir copies under per-file distinct names.

## End state (closing checks)

```
scripts/i18n-keycheck.mjs  E8E41355A819FC20   = pre-mutation
scripts/i18n-surface.mjs   B0AB9B1C926E23E9   = pre-mutation
index.html                 425F1FDE144F5EF8   = pre-mutation
package.json               2D7C34D518F42D9F   = pre-mutation
apps/index.html            B8E6519612BDD84F   = pre-mutation

KEYCHECK_EXIT=0   (PASS ×19, star check green)
i18n-surface: 178 keys across 5 pages
VALIDATE_EXIT=0   (npm run validate — all five stages)
```

Working tree at close: exactly the Task 2 migration set (14 modified files + new `apps/index.html`) plus this evidence doc. Nothing committed (deferred-commit mode; ship lands ONE atomic commit per the STATE locked decision).
