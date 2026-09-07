# Phase 8: Custom Domain Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-07
**Phase:** 8-custom-domain-migration
**Areas discussed:** Domain name + canonical host, Transition allowlist policy, Search Console property, Owner runbook format

---

## Domain name + canonical host

**Q: Which domain are you registering?**

| Option | Description | Selected |
|--------|-------------|----------|
| persano.com | Personal-brand hub domain, long-lived umbrella | |
| geohisttrivia.com | App-first domain, SEO signal for game searches | |
| dev-style name | e.g., santiagopostorivo.dev / persano.dev | |

**User's choice:** free-text pivot — "persano.com is already a propery of someone since 1997.... - it would be better just to build the page for the game, as that is what we are doing right now. Even the repo naming can change in the future"
**Notes:** persano.com taken by third party. Site identity shifts toward the game. Content/repo restructure explicitly deferred.

**Q: Game-first domain — which exact name?**

| Option | Description | Selected |
|--------|-------------|----------|
| geohisttrivia.com | Matches Play package com.persano.geohisttrivia; strongest TLD for game landing | ✓ |
| geohisttrivia.app | App-style TLD, slightly less familiar to players | |
| Different name | Owner types exact domain | |

**User's choice:** geohisttrivia.com
**Notes:** Owner will register it; domain must be final — Phase 9 registers the reCAPTCHA key against it once.

**Q: Which host is canonical?**

| Option | Description | Selected |
|--------|-------------|----------|
| Apex canonical (Recommended) | geohisttrivia.com canonical; www 301s to apex; matches current root-style refs | ✓ |
| www canonical | www.geohisttrivia.com canonical; apex 301s; www prefix in all 42 refs | |

**User's choice:** Apex canonical
**Notes:** —

---

## Transition allowlist policy

**Q: Does github.io stay in Auth authorized-domains + API-key referrer allowlist during transition?**

| Option | Description | Selected |
|--------|-------------|----------|
| Both during transition (Recommended) | github.io stays authorized alongside geohisttrivia.com — stale-URL visitors keep a working form | ✓ |
| New-domain only | Cleanest posture; form breaks on stale links during index decay | |

**User's choice:** Both during transition
**Notes:** —

**Q: When does github.io get dropped from the allowlists?**

| Option | Description | Selected |
|--------|-------------|----------|
| After verification pass (Recommended) | Drop after smoke-check green + sitemap resubmit + index-decay window | |
| Keep indefinitely | Referrer-locked, only 301s — zero maintenance; also guarantees rollback never breaks the form | ✓ |

**User's choice:** Keep indefinitely
**Notes:** —

**Q: JS file-header comments referencing persano.github.io — rewrite or leave?**

| Option | Description | Selected |
|--------|-------------|----------|
| Rewrite with refs (Recommended) | 4 JS headers + smoke-check comment rewritten in the migration commit | ✓ |
| Leave as-is | Historical prose; grep gate then needs comment-line exclusions | |

**User's choice:** Rewrite with refs
**Notes: —

**Q: Zero-mixed-domain: one-off grep or permanent CI gate?**

| Option | Description | Selected |
|--------|-------------|----------|
| Permanent CI gate (Recommended) | Validate-job check fails on old-domain refs outside skip-list; guards Phases 9/10 | ✓ |
| One-off check | Grep only during migration commit; drift unnoticed later | |

**User's choice:** Permanent CI gate
**Notes:** —

---

## Search Console property

**Q: New GSC property type?**

| Option | Description | Selected |
|--------|-------------|----------|
| Domain property (Recommended) | DNS TXT verification; one property covers apex + www | ✓ |
| URL-prefix property | Matches old setup; per-URL, www needs its own property | |

**User's choice:** Domain property
**Notes:** —

**Q: Old persano.github.io property — keep or delete?**

| Option | Description | Selected |
|--------|-------------|----------|
| Keep alongside (Recommended) | Watches the 301/index-decay curve; zero maintenance | ✓ |
| Delete later | One less property; loses redirect visibility | |

**User's choice:** Keep alongside
**Notes:** —

**Q: Sitemap resubmit timing (HOST-03)?**

| Option | Description | Selected |
|--------|-------------|----------|
| Same day as migration (Recommended) | Resubmit the day smoke-check passes on geohisttrivia.com | ✓ |
| Wait a window | e.g., 7-day settle before resubmit | |

**User's choice:** Same day as migration
**Notes:** —

**Q: Change-of-Address tool?**

| Option | Description | Selected |
|--------|-------------|----------|
| Use CoA tool (Recommended) | Accelerates index transfer once Pages 301s are live | ✓ |
| 301s only | Simpler, slower index transfer | |

**User's choice:** Use CoA tool
**Notes:** —

---

## Owner runbook format

**Q: Deliverable shape — standalone runbook doc or plan-only steps?**

| Option | Description | Selected |
|--------|-------------|----------|
| Owner runbook doc (Recommended) | Dedicated owner-steps doc; owner executes in parallel from day 1 | ✓ |
| Plan-only steps | Steps embedded in PLAN.md / summaries only | |

**User's choice:** Owner runbook doc
**Notes:** —

**Q: Who applies the Pages domain + HTTPS enforce?**

| Option | Description | Selected |
|--------|-------------|----------|
| Agent via gh CLI (Recommended) | PATCH /repos/.../pages; owner needs only an authenticated gh session | ✓ |
| Owner manual | Owner clicks Settings → Pages UI | |

**User's choice:** Agent via gh CLI
**Notes:** —

**Q: Rollback plan in the runbook?**

| Option | Description | Selected |
|--------|-------------|----------|
| Documented rollback (Recommended) | gh CLI unset-domain; allowlists keep github.io so form survives rollback | ✓ |
| No rollback section | Trivially reversible by hand if needed | |

**User's choice:** Documented rollback
**Notes:** —

**Q: Where does the runbook live?**

| Option | Description | Selected |
|--------|-------------|----------|
| Phase dir runbook (Recommended) | .planning/phases/08-custom-domain-migration/08-RUNBOOK.md; publicly visible like all .planning docs (deploy uploads whole repo) | ✓ |
| Repo root | OWNER-DOMAIN-STEPS.md; easiest to spot, clutters deployed site root | |

**User's choice:** Phase dir runbook
**Notes:** Both options public — runbook contains console UI instructions only, no secrets.

---

## the agent's Discretion

- CI-gate implementation shape (node script vs grep step; skip-list mechanism)
- Sitemap lastmod policy for rewritten entries
- smoke-check.sh BASE + linkinator skip-list updates (mechanical, part of the 42)
- Runbook step ordering details and DNS record table format
- Whether Enforce HTTPS flips in the same gh PATCH as domain-set (after cert verified)

## Deferred Ideas

- Game-only site focus restructure (hub de-emphasis, repo rename) — future phase/milestone decision
- Public-surface hygiene: exclude internal docs from Pages artifact (deploy currently uploads whole repo)

---
