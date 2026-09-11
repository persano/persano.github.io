# Phase 11: Close v2.0 audit debt — F-1 AGENTS.md rewrite + doc-hygiene batch + UAT records - Context

**Gathered:** 2026-09-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Close the v2.0 milestone-audit debt (`.planning/v2.0-MILESTONE-AUDIT.md`, status `tech_debt`, 2026-09-10): (1) **F-1** — full AGENTS.md rewrite to the shipped v2.0 reality (WARNING-severity: stale persano.github.io URLs + i18n section describing the pre-pivot per-language-subdir design while listing the shipped JSON-dictionary-swap architecture under "What NOT to Use" — a future agent following it could re-architect working code); (2) **F-2–F-4 doc-hygiene batch** — "20 dictionaries"→19 count fixes with supersession notes, 08-RUNBOOK §5 gate-row flip, privacy.html date fix; (3) **UAT records** — HV-06 (06-UAT test 9 re-run), HV-09a (09-USER-SETUP checklist, unblocks F-5 header flip), HV-09b (favicon glance) recorded in-phase with the owner live at the keyboard; (4) **P-10-3** — Tier-1 star-uniqueness keycheck extension (folded in). Sequencing is locked: `/gsd-ship` (reconcile remote main 3eaf9d9, commit deferred 10-01/10-02) → Phase 11 → `/gsd-complete-milestone v2.0`.

NOT in this phase: any product/site feature work; sweeping the ~70 historical `.planning` old-domain references (research docs and phase records legitimately document pre-migration state); rewriting `research/STACK.md`; the deferred-by-design owner items (FIRE-10 enforcement flip, Tier-1 rating flip, GSC 180-day watch) — those stay parked in their runbooks.

</domain>

<decisions>
## Implementation Decisions

### F-1: AGENTS.md rewrite
- **D-01:** **Full rewrite**, not a surgical patch — the whole doc is brought to current shipped reality (single-URL keyed-engine i18n, 19 dictionaries/178-key surface, geohisttrivia.com canonical, App Check Enterprise monitoring-mode, social proof tiers, Firebase 12.18.0 pinned CDN). Surgical patch rejected: the rest of the v1-era doc (Firebase products table, decisions 2–6 details) would keep contradicting the fix.
- **D-02:** The rewritten stack section is **hand-written from shipped reality** (STATE locked decisions + prior phase CONTEXTs + the live validate chain) — NOT regenerated from `.planning/research/STACK.md` (that file is v2-scope *additions* research, additions-only framing — wrong shape for a whole-stack doc). Sources stay untouched except `.planning/PROJECT.md` line 5 (Core Value paragraph still says persano.github.io).
- **D-03:** The `<!-- GSD:...-start source:... -->` injection markers are **stripped**; sections written fresh. CONVENTIONS and ARCHITECTURE sections (previously empty "not yet established" placeholders) are **populated with the 10 phases' real patterns** as part of the rewrite. Stripping ends stale-injection drift permanently — regeneration tooling can no longer clobber with v1-era source content.
- **D-04:** URL sweep scope = **AGENTS.md + PROJECT.md line 5 only**. The ~70 other `persano.github.io` hits across `.planning` stay as historical records. Keep the still-true github.io-dual-hosts/301 fact in the rewrite (audit fix instruction). — **Reversibility:** reversible — text edits only; the audit's fix recipe names the same scope.

### Doc-hygiene batch (F-2/F-3/F-4)
- **D-05:** Historical-record fixes (F-2 "20 dictionaries" in 08-02-SUMMARY:121, 08-VERIFICATION:33, 09-CONTEXT.md) are **edit-in-place + bracketed supersession note** (e.g., "[corrected Phase 11: 19 — no en.json; EN lives in markup]") — matching the Phase 9 UAT supersession-note policy (records show the fact AND the correction trail; silent edits rejected as falsifying what the verifier actually saw).
- **D-06:** Commit shape = **3 commits**: (1) F-1 AGENTS.md rewrite; (2) F-2/F-3/F-4 hygiene batch (F-3 privacy.html date → "September 8, 2026" rides here); (3) F-5 09-USER-SETUP header flip rides the HV-09a UAT-record commit. Audit's recommended shape, matches the atomic-commit convention.
- F-4 (08-RUNBOOK §5 row ⏳→✅ with pass date) is a live-checklist flip — plain edit, no note ceremony.

### UAT owner records (HV-06 / HV-09a / HV-09b)
- **D-07:** All three human verifications run **in-phase with the owner live at the keyboard**: agent pre-writes the test scaffolding, walks the owner through each check in-session, records results. If any check can't be completed, it stays **documented as owner-pending** — the phase still closes.
- **D-08:** Records append to the **phase's own UAT files** — HV-06 → `06-UAT.md` (test 9 re-run), HV-09a → `09-UAT.md` — with dated supersession-note framing (Phase 9 policy). Old files keep the mechanical `uat-passed` predicate complete. A centralized 11-UAT.md rejected: splits records from their test definitions.
- **D-09:** HV-09a is a **split record**: live checks (blocked reCAPTCHA → ~10s appcheck status, message lands in Firestore ±consent) recorded in-session; the **GA4 token-failure-event clause becomes an owner-console sub-item** (≤24h Events lag; owner's pihole blocks GA4/DebugView) confirmed later in Firebase Events. The full record closes eventually; the phase doesn't stall on pihole lag.

### P-10-3: star-uniqueness CI gate
- **D-10:** **Folded in.** Extend `scripts/i18n-keycheck.mjs` with a fail-closed star-uniqueness assertion on the `geohist.tier1.*` keys (ADR-550 D4: ★ exactly once — missing or duplicated = red). Zero new dependencies. Rationale: closes the last audit nit permanently; a malformed Tier-1 row can never ship unflagged at owner flip.

### Sequencing
- **D-11:** **`/gsd-ship` → Phase 11 → `/gsd-complete-milestone v2.0`.** Ship first reconciles remote main (3eaf9d9 ahead of local 275046b, content identical; fetch/rebase + commit deferred 10-01/10-02). Phase 11 then executes on the reconciled tree — zero rebase conflicts with its `.planning`/AGENTS.md edits. Matches the audit verdict's own recommended order.

### the agent's Discretion
- AGENTS.md section structure and length (rewrite shape is free; substance = shipped v2.0 reality).
- Whether the domain-gate allowlist entry for AGENTS.md is dropped after the rewrite (if the new AGENTS.md has zero old-domain refs, the gate can start enforcing it — preferred; researcher verifies gate mechanics).
- Exact supersession-note wording for F-2 fixes (one-line bracketed style).
- Phase validation shape: re-run `npm run validate` battery (html/domain/links/i18n-detect/i18n) after edits; keycheck extension needs a red-gate proof both directions (Phase 6 pattern). No product deploy expectations for docs-only changes, though Actions runs on push regardless (harmless).
- HV-09b favicon check depth (visual glance on live tab; `/favicon.ico` 200 + icon links already machine-verified).
- ROADMAP.md phase-11 goal/success-criteria backfill during planning (planner-owned).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit (the debt inventory — authoritative)
- `.planning/v2.0-MILESTONE-AUDIT.md` — F-1..F-5 exact items + line refs, HV-06/HV-09a/HV-09b definitions, deferred-by-design list, recommended fix order (verdict section)

### Planning / Requirements
- `.planning/ROADMAP.md` — Phase 11 entry (goal "[To be planned]" — planner backfills), Phase-Evolution note
- `.planning/REQUIREMENTS.md` — v2 requirement context; no new requirements this phase (doc/process work only)
- `.planning/STATE.md` — locked decisions (dictionary-swap i18n, deploy-bridge blob-sha policy, UAT supersession policy), GA4 pihole blocker, sequencing note (/gsd-ship next)
- `.planning/PROJECT.md` — line 5 stale URL (fix target D-02/D-04); hosting line 93 (current truth: geohisttrivia.com apex); Key Decisions table

### Fix targets (F-items)
- `AGENTS.md` — the rewrite target: URL rot lines 7/14/67/90; i18n decision 7 lines 36/81–85; What-NOT-to-Use line 133; GSD source markers lines 1/22/157 (strip per D-03)
- `.planning/phases/08-custom-domain-migration/08-02-SUMMARY.md` line 121 — F-2 "20 dictionaries"
- `.planning/phases/08-custom-domain-migration/08-VERIFICATION.md` line 33 — F-2
- `.planning/phases/09-app-check-monitor-first/09-CONTEXT.md` lines 9/28/69/89 — F-2 (4 hits)
- `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` §5 line 173 — F-4 ⏳ row (line 174 ⏳ smoke row: verify gate state before flipping — audit names only line 173)
- `geohist/privacy.html` line 37 — F-3 date ("September 7" → "September 8, 2026")
- `.planning/phases/09-app-check-monitor-first/09-USER-SETUP.md` line 5 — F-5 status header (flips only after HV-09a records)

### UAT record targets
- `.planning/phases/06-changelog-page/06-UAT.md` §11 line 81 — HV-06 test-9 re-run record appends here
- `.planning/phases/09-app-check-monitor-first/09-UAT.md` — HV-09a record appends here (test 5 repeat)
- `.planning/phases/09-app-check-monitor-first/09-USER-SETUP.md` — HV-09a checklist source (owner walks it)

### Code (P-10-3 + validation)
- `scripts/i18n-keycheck.mjs` — the P-10-3 extension target (pages array + exact set-equality; star-uniqueness assertion on `geohist.tier1.*`)
- `js/i18n/*.json` (19 dictionaries, 178 keys) — the surface the extended gate scans; tier1 fragments per 10-CONTEXT D-04
- `.planning/phases/10-gated-social-proof/10-CONTEXT.md` — D-04 (Tier-1 fragment shape: keyed fragments + one unkeyed number span) and D-05 (star inline-SVG currentColor) — what "exactly one ★" means
- `.planning/phases/10-gated-social-proof/10-RUNBOOK.md` — flip ritual the new gate protects; §6 Tier-2 permanent-OFF
- `.planning/phases/10-gated-social-proof/10-VERIFICATION.md` — P-10-3 star-uniqueness original verification (ADR-550 D4 fail-closed citation)
- `.github/workflows/deploy.yml` — validate chain (validate:html → validate:domain → validate:links → validate:i18n-detect → validate:i18n); the domain-gate allowlist holding AGENTS.md

### Explicitly out of rewrite scope (do not touch)
- `.planning/research/STACK.md` (v2 additions research — historical; old-domain refs document pre-migration planning)
- `.planning/research/ARCHITECTURE.md`, `FEATURES.md`, `PITFALLS.md`, `MILESTONES.md`, `milestones/` archive — historical old-domain refs stay (D-04)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `npm run validate` battery — full chain re-runnable locally as the phase's verification gate (all green at audit time, 2026-09-10)
- `scripts/i18n-keycheck.mjs` — existing zero-dep gate; the P-10-3 assertion slots in beside the CJK-punct check (Phase 7 precedent for gate extensions)
- Phase 6 red-gate proof pattern (`red-gate-proof.md`) — template for proving the new star-uniqueness gate fails both directions before landing
- UAT file structures (06-UAT.md §11, 09-UAT.md) — supersession-note pattern established in Phase 9 for appending re-run records

### Established Patterns
- Supersession notes (Phase 9): original text stays, dated correction note appends — D-05 applies it to historical-record fixes
- One-atomic-commit convention; 3-commit shape locked (D-06)
- `.planning/` is publicly served (08-CONTEXT D-11) — UAT records and runbook edits must stay secret-free (console instructions only)
- Deploy via GitHub Git Data API bridge with mandatory blob-sha assertions if local remote ops are harness-blocked (Phase 9/10 precedent, STATE.md)
- `uat-passed` predicate is mechanical (any `result: issue` = blocker) — records must land with clean result fields or explicit supersession framing

### Integration Points
- AGENTS.md ↔ every future agent session — the rewrite is the phase's core deliverable (WARNING-severity debt)
- `i18n-keycheck.mjs` ↔ `npm run validate` chain — P-10-3 gate rides the existing CI job, no new workflow
- 09-USER-SETUP.md status header ↔ HV-09a record — same commit (D-06 commit 3)
- `/gsd-ship` ↔ phase 11 — hard ordering (D-11); phase 11 must not start before remote main is reconciled

</code_context>

<specifics>
## Specific Ideas

- Audit verdict (quoted): "fix F-1 first (doc rewrite before the next i18n/URL work), batch F-2–F-5 into one docs commit, then `/gsd-complete-milestone v2.0`" — owner adopted this order, adjusted to ship-first for rebase safety (D-11) and to split F-5 onto the UAT-record commit (D-06).
- F-2 actual count: **19 dictionaries** — no `en.json`; EN lives in markup. The corrected note must state why, so future agents stop hunting for en.json.
- Keep the "github.io dual-hosts then 301s" fact in the AGENTS.md rewrite — still true, and the audit fix instruction names it explicitly.
- HV-09a checks: prod incognito, DevTools block `*recaptcha*` + `*google.com/reload`, submit → appcheck status within ~10s, message in Firestore in both consent states; GA4 event clause split per D-09.

</specifics>

<deferred>
## Deferred Ideas

- **Owner-backlog rollup** — consolidating FIRE-10 flip, Tier-1 rating flip, and GSC 180-day watch into a single owner-backlog surface. Declined this phase; items stay parked in 09-RUNBOOK.md, 10-RUNBOOK.md, and 08-RUNBOOK/STATE respectively. Revisit if the scattered-parking ever causes a missed owner step.
- **Full `.planning` old-domain sweep** — rejected as history rewriting (D-04). If a future phase needs a grep-clean tree for tooling reasons, it must decide its own policy.

</deferred>

---

*Phase: 11-Close v2.0 audit debt: F-1 AGENTS.md rewrite + doc-hygiene batch + UAT records*
*Context gathered: 2026-09-10*
