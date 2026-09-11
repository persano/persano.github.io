# Phase 11: Close v2.0 audit debt — F-1 AGENTS.md rewrite + doc-hygiene batch + UAT records - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-10
**Phase:** 11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc
**Areas discussed:** F-1 rewrite depth, Historical doc edits, UAT owner records, P-10-3 CI gate edge, Sequencing

---

## Area selection

User replied to the multiSelect with a full restatement of the 8-item debt inventory (F-1..F-5, HV-06/09a/09b across phases 6–10) — interpreted as "all areas in play." All four proposed gray areas discussed.

## F-1 rewrite depth

| Option | Description | Selected |
|--------|-------------|----------|
| Full rewrite | Rewrite AGENTS.md to shipped v2.0 reality (keyed-engine i18n, 19 dicts/178 keys, geohisttrivia.com, App Check, social proof) | ✓ |
| Surgical patch | Decision 7 + line 133 + 4 URL refs only; rest stays v1-era | |
| Thin pointer file | Shrink to pointers into .planning docs | |

**User's choice:** Full rewrite
**Notes:** Agent scout surfaced the rot mechanism before the follow-up: GSD source markers (PROJECT.md / research/STACK.md injections) + current research/STACK.md is v2-scope additions (correct architecture, additions-only shape) + ~70 historical .planning old-domain refs.

## F-1 content source

| Option | Description | Selected |
|--------|-------------|----------|
| Hand-write | Draft stack section from shipped reality (STATE decisions + CONTEXTs + validate chain); sources untouched except PROJECT.md line 5 | ✓ |
| Regen via STACK.md | Re-sync research/STACK.md to whole-stack scope, then inject | |
| Both | Hand-write + rewrite STACK.md scope | |

**User's choice:** Hand-write

## F-1 markers + placeholders

| Option | Description | Selected |
|--------|-------------|----------|
| Strip markers | Remove GSD source markers; write fresh; populate empty CONVENTIONS/ARCHITECTURE sections with real 10-phase patterns | ✓ |
| Keep markers | Hand-edit inside markers; regeneration can still clobber | |
| Keep + fix sources | Keep markers; create .planning/CONVENTIONS.md + ARCHITECTURE.md | |

**User's choice:** Strip markers

## F-1 URL sweep scope

| Option | Description | Selected |
|--------|-------------|----------|
| AGENTS.md only | AGENTS.md + PROJECT.md line 5; ~70 historical refs stay | ✓ |
| Live docs sweep | + MILESTONES.md + research/*.md live-reference docs | |
| Full-tree sweep | Every old-domain ref rewritten — history rewriting | |

**User's choice:** AGENTS.md only

## Historical doc edits (F-2 style)

| Option | Description | Selected |
|--------|-------------|----------|
| Fix + note | Edit-in-place + bracketed supersession note (Phase 9 policy) | ✓ |
| Silent edit | 20→19, no marker | |
| Addenda only | Records untouched; errata elsewhere | |

**User's choice:** Fix + note

## Commit strategy

| Option | Description | Selected |
|--------|-------------|----------|
| 3 commits | F-1 rewrite; F-2/F-3/F-4 batch; F-5 rides HV-09a record commit | ✓ |
| Single commit | Everything at once | |
| Per item | 5 tiny commits | |

**User's choice:** 3 commits

## UAT owner records timing

| Option | Description | Selected |
|--------|-------------|----------|
| In-phase w/ owner | Scaffolding + live walkthrough in-session; incomplete → documented owner-pending; phase still closes | ✓ |
| Record as pending | Docs only; F-5 header stays Incomplete | |
| Run before planning | Owner runs 3 checks pre-planning | |

**User's choice:** In-phase w/ owner

## UAT record location

| Option | Description | Selected |
|--------|-------------|----------|
| Phase files | HV-06 → 06-UAT.md, HV-09a → 09-UAT.md, dated supersession framing | ✓ |
| Central 11-UAT.md | All 3 records centralized with pointers | |

**User's choice:** Phase files

## HV-09a GA4 clause

| Option | Description | Selected |
|--------|-------------|----------|
| Split record | Live checks in-session; GA4 clause = owner console sub-item (≤24h pihole lag) | ✓ |
| Wait for GA4 | Phase stalls on Events lag | |
| Drop GA4 clause | Wiring machine-verified in 09-01 | |

**User's choice:** Split record

## P-10-3 CI gate edge

| Option | Description | Selected |
|--------|-------------|----------|
| Fold in | Extend i18n-keycheck.mjs with fail-closed star-uniqueness assertion on geohist.tier1.* | ✓ |
| Defer + document | Rich Results Test ritual is the gate; note in 10-RUNBOOK | |
| Skip | Non-blocking per audit; no note | |

**User's choice:** Fold in

## Sequencing (second-round gray area)

| Option | Description | Selected |
|--------|-------------|----------|
| Ship → 11 → close | /gsd-ship reconciles remote (3eaf9d9, deferred 10-01/10-02) → Phase 11 on reconciled tree → /gsd-complete-milestone v2.0 | ✓ |
| 11 → ship → close | Rebase risk on .planning edits | |
| Close first | Phase 11 becomes next-milestone work; contradicts audit intent | |

**User's choice:** Ship → 11 → close

## the agent's Discretion

- AGENTS.md section structure/length; domain-gate allowlist entry for AGENTS.md after rewrite (preferred: drop if zero old-domain refs)
- F-2 supersession-note wording; F-4 plain flip mechanics; F-3 date fix rides hygiene batch
- Phase validation shape (validate battery re-run + red-gate proof for the new gate); no product deploy expectations
- HV-09b favicon check depth; ROADMAP phase-11 goal backfill (planner-owned)

## Deferred Ideas

- Owner-backlog rollup (FIRE-10 / Tier-1 flip / GSC watch into one surface) — declined; stays parked in runbooks
- Full .planning old-domain sweep — rejected as history rewriting; future phase must set own policy if ever needed
