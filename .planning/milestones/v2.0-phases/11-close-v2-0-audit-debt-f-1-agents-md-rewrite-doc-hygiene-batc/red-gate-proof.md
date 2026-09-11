# Phase 11 Plan 11-03 — Red-Gate Proof Record (star-uniqueness, P-10-3)

**Proven:** 2026-09-11, locally, without ever committing a red state (Phase 6 pattern).
**Gate:** `node scripts/i18n-keycheck.mjs` star-uniqueness extension (Phase 11, P-10-3 / ADR-550 D4) — fail-closed: missing OR duplicated star SVG, or any text star (U+2605) in a dictionary value or markup = exit 1.
**Surface at proof time:** 178 keys × 19 dictionaries; markup anchor `geohist/index.html:88` (the single `proof-row-star` SVG inside the hidden Tier-1 row).

Each cycle: mutate → run → observe FAIL (exit 1) → restore → re-run → observe PASS (exit 0). The flip-compat cycle (d) expects GREEN by construction.

---

## Cycle (a) — Missing direction (star SVG's class token renamed)

- **Mutation:** renamed the star SVG's class `proof-row-star` → `proof-row-star-probe` in `geohist/index.html` (a renamed class must NOT satisfy the exactly-1 expectation — the count regex carries the negative lookahead `proof-row-star(?![\w-])`).
- **Command:** `node scripts/i18n-keycheck.mjs`
- **Observed (FAIL):** all 19 dictionaries still PASS their key-parity lines, then:

  ```
  i18n-keycheck: FAIL — star uniqueness: 0 proof-row-star SVG(s) (expected exactly 1), 0 star literal(s) in markup (expected 0)
  i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above
  ```

  Exit code: **1**. The gate reports **0** SVGs — the lookahead demonstrably rejected the renamed probe class (a plain substring count would have reported 1 and passed falsely). A Tier-1 row missing its star SVG fails CI.
- **Revert:** restored `geohist/index.html` from the pre-mutation sha256 snapshot copy → SHA256 `DE714C284B1996FAE6DF00FA6C24D2126A0B56BFFDABC54D4BA3D5C6E0E232F1`, identical before/after → PASS tail `i18n-keycheck: OK`, exit 0.

## Cycle (b) — Duplicated direction, dictionary value (text star in a value)

- **Mutation:** appended the raw star character to the `geohist.tier1.suffix` VALUE in `js/i18n/es.json` (`"en Google Play"` → `"en Google Play★"`, transient probe).
- **Command:** `node scripts/i18n-keycheck.mjs`
- **Observed (FAIL):**

  ```
  i18n-keycheck: FAIL — es.json: "geohist.tier1.suffix" contains a literal star (U+2605) — the Tier-1 star is the row's single inline SVG [geohist.tier1.* — the Tier-1 rating row]
  i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above
  ```

  Exit code: **1**. The FAIL names the file AND the key, with the tier1 context. **es.json is outside the ja/zh CJK-punct scope, so the star check is provably the gate that fired** — the star sweep is real coverage, not a duplicate of the punct gate (interplay note below).
- **Revert:** restored `js/i18n/es.json` from the snapshot copy → SHA256 `CBAB14D22F8EF9DA59B2CE8929FF7D6D1139E6C085365D69C73728D34EBD119D`, identical before/after → `i18n-keycheck: OK`, exit 0.

## Cycle (c) — Duplicated direction, markup (second star SVG in the row)

- **Mutation:** duplicated the existing star SVG element inside the Tier-1 row in `geohist/index.html` (two identical `<svg class="proof-row-star">` siblings, transient probe).
- **Command:** `node scripts/i18n-keycheck.mjs`
- **Observed (FAIL):**

  ```
  i18n-keycheck: FAIL — star uniqueness: 2 proof-row-star SVG(s) (expected exactly 1), 0 star literal(s) in markup (expected 0)
  i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above
  ```

  Exit code: **1**. A duplicated star SVG fails CI.
- **Revert:** snapshot-copy restore → SHA256 `DE714C284B1996FAE6DF00FA6C24D2126A0B56BFFDABC54D4BA3D5C6E0E232F1` again → `i18n-keycheck: OK`, exit 0.

## Cycle (d) — Flip-compat (expects GREEN — the owner's flip cannot red the gate)

- **Mutation (flip simulation, per 10-RUNBOOK.md section 2):** removed the `hidden` attribute from `<div class="proof-row" hidden>` and replaced the unkeyed span placeholder `0.0` → `4.5` in `geohist/index.html`. The star SVG untouched.
- **Command:** `node scripts/i18n-keycheck.mjs`
- **Observed (PASS):** `i18n-keycheck: OK` — exit code **0**. The flip edits (attribute + number span) never touch the star SVG, so the owner's Tier-1 flip cannot red this gate.
- **Revert:** snapshot-copy restore → SHA256 `DE714C284B1996FAE6DF00FA6C24D2126A0B56BFFDABC54D4BA3D5C6E0E232F1` → `i18n-keycheck: OK`, exit 0.

---

## Restore verification notes

- **Restore method:** sha256 snapshot-copy (`Copy-Item` from a pre-mutation temp snapshot, hash-verified after EVERY cycle). `git restore` was documented in the plan as the clean-tree revert, but deferred-commit state was active on this tree (11-01/11-02 uncommitted work), so the Phase 10 precedent (snapshot-copy, `git checkout`/`git restore` unusable there) was used as the safer superset — both files were clean in `git status`, so either method was safe; snapshot-copy was chosen.
- **Post-revert cleanliness:** after the final cycle, `git status --porcelain` shows NO entry for `geohist/index.html` and NO entry for `js/i18n/es.json` — both byte-identical to their pre-phase state. `scripts/i18n-keycheck.mjs` shows as modified (the P-10-3 gate extension itself — planned deferred commit 4, landed by /gsd-ship).

## Final green battery

- `node scripts/i18n-keycheck.mjs` → `PASS` ×19 at the 178-key surface + `i18n-keycheck: OK`, exit 0.
- `npm run validate` → exit 0, full chain: `validate:html` OK · `check-no-old-domain: OK` · `validate:links` "Successfully scanned 19 links" · `validate:i18n-detect` "pass 23 / fail 0" · `validate:i18n` (the extended gate, now riding the chain) PASS ×19 + OK. Zero workflow edits, zero new dependencies.

## Interplay note

★ (U+2605) is NOT in the `CJK_PUNCT` regex `[,!?:;()"]`, so a star in ja/zh values passed the pre-Phase-11 punct gate; cycle (b) used es.json specifically to prove the star check fires independently of the punct scope — the extension adds real coverage.

## Flip-compat note (restated)

The gate protects the flip; the flip never trips the gate (cycle d). Documented in the gate's header comment (rule 3) so future editors of `scripts/i18n-keycheck.mjs` know the invariant's boundary: the star SVG (`class="proof-row-star"`) is the invariant's anchor — only edits that remove, duplicate, rename, or text-star the star surface can red the gate.
