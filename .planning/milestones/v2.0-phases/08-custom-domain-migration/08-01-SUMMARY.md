---
phase: 08-custom-domain-migration
plan: 01
subsystem: infra
tags: [github-pages, dns, https, gh-cli, firebase, google-search-console, runbook]
deferred_commit: true

# Dependency graph
requires:
  - phase: 07-localization-20-rtl
    provides: stable deployment branch (phase-07-localization-20-rtl) + green validate chain the infra work rides on
provides:
  - https_enforced=true on repos/persano/persano.github.io — flipped via one minimal gh PUT, config-verified by GET-after-PUT (edge propagation ≤24 h pending)
  - 08-RUNBOOK.md — 9-section owner runbook (DNS table, re-add→TXT→Verify flow, Firebase/GCP keep-legacy allowlists, GSC Domain property, rollback + CoA-cancel branch)
  - Task 3 owner gate (SIX items) — open; blocks plan 08-02 URL rewrite until owner passes
affects: [08-custom-domain-migration plan 02, plan 03, phase-09-recaptcha]

# Actuals (#2632) — same scale as the plan's estimate (chars/4 over realized diff)
actuals:
  tokens: 7000        # ~28k chars: 08-RUNBOOK.md (17,333) + SUMMARY/STATE/ROADMAP bookkeeping
  tasks: 2            # Tasks 1–2 agent-complete; Task 3 = owner gate (open by design)
  commits: 0          # deferred_commit_mode — code/docs commits deferred to /gsd-ship except .planning docs commit

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "verify-before-flip: cert state terminal (approved) via GET before any enforce PUT; GET-after-PUT as the only correctness proof"
    - "minimal-body PUT: one field per mutation (-F https_enforced=true only) to avoid clobbering cname/build_type"
    - "owner-runbook-as-artifact: console-UI-only instructions, no secrets, publicly-served-safe"

key-files:
  created:
    - .planning/phases/08-custom-domain-migration/08-RUNBOOK.md
  modified:
    - .planning/STATE.md
    - .planning/ROADMAP.md

key-decisions:
  - "Owner divergence ruling (option B): _github-pages-challenge-persano TXT found NXDOMAIN between sessions; enforce flip proceeded on cert-approved; TXT re-add absorbed as runbook §1b + §2 re-add→TXT→Verify flow"
  - "Task 3 owner gate expanded to SIX items: AAAA×4, TXT re-add + Verify click, Firebase Auth authorized-domains, API-key referrer allowlist, GSC Domain property, soft protected_domain_state re-probe"

patterns-established:
  - "Divergence-gate → owner ruling → runbook amendment: probe contradiction is surfaced, ruled, and written into the artifact rather than silently absorbed"

requirements-completed: [HOST-01]  # traceability copy per template; HOST-01 full completion gated on Task 3 owner items (see body)

# Coverage metadata (#1602)
coverage:
  - id: D1
    description: "HTTPS enforcement flipped via gh API: PUT https_enforced=true (cert pre-checked approved), GET-after-PUT shows enforced true with cname/build_type/cert unchanged"
    requirement: HOST-01
    verification:
      - kind: e2e
        ref: "gh api repos/persano/persano.github.io/pages --jq '{enforced, cname, cert}' → {enforced:true, cname:geohisttrivia.com, cert:approved}"
        status: pass
    human_judgment: false
  - id: D2
    description: "08-RUNBOOK.md authored — 9 sections with B-ruled amendments (§1b TXT re-add, §2 re-add→TXT→Verify, 11-row DNS table, keep-legacy allowlists, rollback + CoA-cancel, DELETE forbidden)"
    requirement: HOST-01
    verification:
      - kind: unit
        ref: "node -e keycheck (plan Task 2 automated verify) → 'runbook sections OK'"
        status: pass
    human_judgment: false
  - id: D3
    description: "Live redirect proofs: https apex 200; www→apex 301; github.io→apex 301 path-preserving; http apex→https 301"
    requirement: HOST-01
    verification:
      - kind: e2e
        ref: "curl battery ×4 (2026-09-07 21:15–21:22 UTC): http apex 301→https (converged ~15 min post-PUT); https apex 200; www 301→apex; gh.io/geohist/ 301→apex path-preserved (2-hop chain terminates on https)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Owner gate execution — SIX items (AAAA×4 in Spaceship; TXT re-add + Verify click in profile Settings; Firebase Auth authorized-domains add+keep; API-key referrer add+keep; GSC Domain property + TXT; protected_domain_state soft re-probe)"
    requirement: HOST-01
    verification: []
    human_judgment: true
    rationale: "Firebase/GCP/GSC console contents and registrar-zone edits are unprobeable by the agent until the owner acts; the Task 3 checkpoint (blocking-human) is the evidence surface. Agent re-probes DNS + /pages after owner report."

# Metrics
duration: 12 min (continuation segment; Wave-0 probe battery + divergence ruling ran in the prior session segment)
completed: 2026-09-07
status: halted  # designed stop: Task 3 owner gate OPEN — 08-02 must not start until gate passes; continuation agent re-summarizes to complete after the gate
---

# Phase 08 Plan 01: Infra Verify + Runbook Summary

**HTTPS enforcement flipped on geohisttrivia.com via one minimal gh PUT (cert pre-verified approved, GET-after-PUT proof) and a 9-section owner runbook authored with the divergence-ruled TXT re-add flow — owner gate (6 items) now open.**

## Performance

- **Duration:** ~12 min (this continuation segment: enforce flip → runbook → bookkeeping). Prior segment: probe battery + divergence gate.
- **Started:** 2026-09-07T21:12:30Z (continuation)
- **Completed:** 2026-09-07 (agent portion; Task 3 gate open)
- **Tasks:** 2 of 3 agent-executed (Task 3 = blocking owner checkpoint, open)
- **Files modified:** 1 created (runbook) + 2 planning bookkeeping files

## Accomplishments

- **HTTPS enforce flip (Task 1):** baseline GET confirmed cert `approved` for apex+www → issued `gh api -X PUT repos/persano/persano.github.io/pages -F https_enforced=true` (only that field, `-F` boolean) → GET-after-PUT: `https_enforced: true`, `cname: geohisttrivia.com`, `build_type: workflow`, cert `approved` — all unchanged. No DELETE endpoint touched anywhere.
- **Live proofs (final):** `http://geohisttrivia.com/` → **301 → https** (propagation converged ~15 min after the flip); `https://geohisttrivia.com/` → 200; `https://www.geohisttrivia.com/` → 301 apex; `https://persano.github.io/geohist/` → 301 apex path-preserved (its redirect target still emits `http://` — cosmetic remnant; that target 301s to https, chain terminates correctly).
- **Runbook (Task 2):** `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` — 9 sections (§0 current state + divergence ruling; §1 Spaceship AAAA×4 **+ TXT re-add**; §2 re-add domain → TXT → Verify; §3 Firebase Auth + GCP API-key allowlists with keep-legacy-host rules; §4 GSC Domain property; §5 agent cross-ref; §6 sitemap resubmit + Change of Address; §7 live contact-form test; §8 rollback with CoA-cancel-first branch and DELETE-forbidden warning). Automated keycheck passed.
- **CNAME-file invariant:** `Test-Path CNAME` → False (prohibition upheld).

## Task Commits

**Deferred-commit mode:** no code/planning commits made per task. Planned ledger (all changes uncommitted — will be committed by /gsd-ship except the allowed `.planning` docs commit):

- docs(08-01): infra enforce flip + live proofs (API mutation, no repo files) — files: none
- docs(08-01): author 08-RUNBOOK.md with divergence-ruled amendments — files: .planning/phases/08-custom-domain-migration/08-RUNBOOK.md
- docs(08-01): complete infra-verify-runbook plan (bookkeeping) — files: .planning/phases/08-custom-domain-migration/08-01-SUMMARY.md, .planning/STATE.md, .planning/ROADMAP.md

## Files Created/Modified

- `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` — created; the D-11 owner artifact (console instructions only, no secrets)
- `.planning/STATE.md` — position/metrics/session updated (below)
- `.planning/ROADMAP.md` — plan progress row updated (below)

## Decisions Made

- **Owner divergence ruling (option B), recorded verbatim intent:** proceed with the HTTPS-enforce flip NOW on confirmed cert `approved`; TXT gap becomes owner work — runbook §1 gains the TXT re-add step (Spaceship: add `_github-pages-challenge-persano` TXT with the value GitHub displays at profile Settings → Pages → Verified domains → Add domain; re-add the domain if the account-level entry was removed); §2 rewritten for "TXT re-add → Verify"; Task 3 gate expanded to SIX items.
- **Enforce-flip timing:** flipped immediately after re-confirming the cert terminal state in a fresh baseline GET (tracer's verify-before-flip invariant), despite the TXT gap — enforcement is independent of domain verification (takeover protection is the TXT/Verify concern, not HTTPS).
- **HTTP-verb discipline:** PUT (not PATCH — old endpoint), `-F` for the boolean, single-field body; GET-baseline + GET-after-PUT around the mutation (research pitfalls 1–3).

## Deviations from Plan

### Documented deviations

**1. [Divergence — owner-ruled] TXT verification record missing (NXDOMAIN)**
- **Found during:** Task 1 Wave-0 probe battery (prior session segment)
- **Issue:** `_github-pages-challenge-persano.geohisttrivia.com` TXT resolved at research time but is NXDOMAIN now — the GitHub domain-verification record (and possibly the profile-level domain entry) disappeared between sessions
- **Ruling:** owner selected option B — proceed with enforce flip; absorb TXT re-add into runbook §1b/§2; expand Task 3 gate to six items
- **Files modified:** 08-RUNBOOK.md (§0 divergence note, §1b, §2, gate expansion)

**2. [Live-proof lag — RESOLVED in-session] http→https 301 briefly absent at the edge after the enforce PUT**
- **Found during:** Task 1 step 5 (live proofs)
- **Issue:** immediately after the PUT, `http://geohisttrivia.com/` served 200 (not 301→https) and the github.io→apex 301 targeted `http://…`; cache-busted re-probes confirmed it was not CDN cache (`x-proxy-cache: MISS`)
- **Resolution:** propagation converged **~15 minutes after the flip** — final probe battery: http apex 301→https; https apex 200; www 301→apex; gh.io path-preserving 301 (target scheme remnant is cosmetic; the 2-hop chain terminates on https). GET-after-PUT had been the config correctness proof throughout (research A5). Windows-ledger entry recorded then closed as `fixed`.
- **Files modified:** 08-RUNBOOK.md (§0 rows 8/11/12 + propagation note marked RESOLVED)

**Total deviations:** 2 (1 owner-ruled divergence, 1 live-propagation lag — resolved in-session). **Impact on plan:** neither blocks the gate structure; Task 3 gate now carries six items instead of five.

## Issues Encountered

- Enforcement edge propagation: briefly pending after the PUT (http apex 200 for ~15 min), then converged within the docs' 24 h window — resolved in-session, no action left (see Deviation 2).
- Prior-session probe history recorded the TXT as resolving; research table row 10 was stale within hours. All §0 rows were re-probed live this session before writing the runbook.

## User Setup Required

**Yes — this plan is mostly owner work.** See **[08-RUNBOOK.md](./08-RUNBOOK.md)** (the runbook replaces a generic USER-SETUP.md): §1 Spaceship (AAAA×4 + TXT re-add), §2 GitHub profile Verify, §3 Firebase/GCP allowlists, §4 GSC Domain property. Note: the plan's `user_setup` frontmatter premise "TXT record already resolves" is superseded by the divergence ruling.

## Next Phase Readiness

- **BLOCKED:** plan 08-02 (44-ref URL rewrite) must NOT start until the Task 3 owner gate passes (six items, runbook §1–§4). The `status: halted` frontmatter encodes this; continuation agent re-summarizes to `complete` after the gate.
- Gate-pass evidence: `Resolve-DnsName geohisttrivia.com -Type AAAA` returns exactly 4 addresses + owner verbal confirmation of console states + TXT re-added.

## Known Stubs

None — no code shipped in this plan (infra mutation + docs only).

## Threat Flags

None — no new attack surface; the plan *reduced* surface (HTTPS enforcement) and documented takeover-protection restoration (§1b/§2).

## Self-Check: PASSED

- [x] 08-RUNBOOK.md exists on disk; keycheck green
- [x] GET-after-PUT proof captured (enforced true, other fields unchanged)
- [x] Live probes captured — all 4 green at session end (http apex 301→https after ~15 min propagation; 2-hop gh.io chain terminates on https)
- [x] Commits: N/A — deferred_commit_mode (no code commits; ledger above); `.planning` docs commit made via `gsd_run query commit`
- [x] STATE.md / ROADMAP.md updated via gsd-tools handlers

---
*Phase: 08-custom-domain-migration*
*Completed: 2026-09-07 (agent portion; Task 3 gate open)*
