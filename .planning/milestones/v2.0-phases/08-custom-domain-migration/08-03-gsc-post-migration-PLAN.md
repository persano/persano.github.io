---
phase: 08-custom-domain-migration
plan: 03
type: execute
wave: 3
depends_on: ["08-02"]
files_modified: []
autonomous: false
requirements: [HOST-03]
estimate:
  tokens: 12000
  raw_tokens: 12000
  tasks: 2
  confidence: low
must_haves:
  truths:
    - "Sitemap is resubmitted to the NEW GSC Domain property the same day smoke-check goes green on geohisttrivia.com (D-09, HOST-03)"
    - "Google Change of Address is filed on the new property with source = the old persano.github.io URL-prefix property, only after the 301s are live and smoke-check is green (D-10)"
    - "The old persano.github.io URL-prefix property is retained alongside the new Domain property — no deletion step; it watches the 301/index-decay curve (D-08)"
    - "The new property is the DNS-TXT-verified Domain property covering apex + www in one property (D-07)"
    - "The owner has submitted a real message through the live contact form at the new domain — the migration's final user-visible proof"
    - "Rollback remains possible after GSC steps only through the runbook's documented sequence, including the CoA-cancel-first branch (D-13)"
  artifacts:
    - "GSC state (owner console): sitemap https://geohisttrivia.com/sitemap.xml submitted to the new property; Change of Address filed old→new; old property intact"
    - "08-03-SUMMARY.md — final probe table + checkpoint evidence closing HOST-01/02/03"
  key_links:
    - "smoke-check green (08-02 exit state) ↔ owner GSC steps — D-09 makes the automated green run the gate for the resubmit"
    - "GSC Domain property ↔ apex+www DNS TXT — one property covers both hosts, no www sub-property"
    - "Change of Address ↔ live 301s — the tool's pre-move checks verify ownership and spot-check redirects (research: answer/9370220)"
  prohibitions:
    - statement: "Sitemap resubmit and Change of Address must never run before smoke-check is green on https://geohisttrivia.com (D-09) — filing against a broken state poisons the 180-day signal window"
      status: enforced
      verification: "08-02-SUMMARY.md records smoke green BEFORE the plan-03 checkpoint opens"
    - statement: "The old persano.github.io URL-prefix property must never be deleted — it is the index-decay monitoring surface (D-08)"
      status: enforced
      verification: "runbook §6 and this checkpoint contain no property-deletion step"
    - statement: "Never execute the rollback while a Change of Address move is active without first canceling the move — canceling requires removing forward 301s and adding reverse 301s (research Pitfall 8)"
      status: enforced
      verification: "08-RUNBOOK.md §7 rollback section contains the CoA-cancel-first branch"
---

<objective>
Close HOST-03: the owner-side Google Search Console sequence (sitemap resubmit + Change of Address) gated on the automated green from plan 02, plus a final agent verification sweep that re-proves every phase success criterion end-to-end.

Purpose: 301s alone move the index slowly; the sitemap resubmit + CoA pair is Google's official acceleration mechanism (D-09/D-10). The sweep makes the phase exit state explicit and evidence-backed.
Output: Confirmed GSC submissions (owner), final verification table (agent), HOST-01/02/03 all satisfied.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/08-custom-domain-migration/08-CONTEXT.md
@.planning/phases/08-custom-domain-migration/08-RESEARCH.md
@.planning/phases/08-custom-domain-migration/08-01-SUMMARY.md
@.planning/phases/08-custom-domain-migration/08-02-SUMMARY.md
@.planning/phases/08-custom-domain-migration/08-RUNBOOK.md
</context>

<edge_coverage>
The 1 HOST-03 specless-probe row (unclassified — reviewed manually), surfaced as a flagged assumption:

- HOST-03/unclassified (the whole row): Change of Address is assumed openable in the NEW Domain property with source = the old URL-prefix property persano.github.io (research A4 — the old property has no path suffix, so one CoA covers apex+www). ASSUMPTION: if the tool rejects the old property type, the documented fallback is 301s + sitemap resubmit + old-property monitoring only (still sound); the owner records what the UI accepted and the SUMMARY notes the path taken.
- Same-day semantics (D-09): "same day" binds the resubmit to the smoke-green day — enforced by sequencing the checkpoint immediately after plan 02's green state, not by clock-watching inside the agent.

The 180-day CoA signal window and the cancel procedure are documented in 08-RUNBOOK.md §6/§7 — surfaced there, not silently dropped.
</edge_coverage>

<artifacts_this_phase>
Plan 03 creates:
- No repo source files (owner console phase)
- Owner-side GSC state: sitemap submitted to the new Domain property; Change of Address filed; old property retained
- `08-03-SUMMARY.md` — final probe table + checkpoint evidence closing the phase's three requirement IDs
(Phase-level artifact inventory closure: 08-RUNBOOK.md + https_enforced flip [01]; scripts/check-no-old-domain.mjs + validate:domain chain + linkinator skip + 44-ref rewrite [02]; GSC submissions + final verification [03].)
</artifacts_this_phase>

<tasks>

<task type="auto">
  <name>Task 1: Final verification sweep — re-prove every phase success criterion</name>
  <files>.planning/phases/08-custom-domain-migration/08-03-SUMMARY.md (probe results recorded there)</files>
  <read_first>.planning/phases/08-custom-domain-migration/08-02-SUMMARY.md (green state to re-confirm); .planning/phases/08-custom-domain-migration/08-RESEARCH.md (probe battery commands)</read_first>
  <action>Re-run the full probe battery and record results for the SUMMARY: (1) `gh api repos/persano/persano.github.io/pages --jq '{enforced:.https_enforced,cname:.cname,cert:.https_certificate.state,protected:.protected_domain_state}'` — enforced true, cname apex, cert issued/approved; protected_domain_state recorded as soft evidence (null tolerated). (2) DNS: A×4 set, AAAA×4 set (must now resolve), www CNAME, GitHub TXT. (3) Redirects: apex https 200; http apex → 301 https; www → 301 apex; legacy github.io host → 301 path-preserved (run `curl -s -o NUL -w "%{http_code} %{redirect_url}" https://persano.github.io/geohist/` exactly as written — literal lives in the verify command, not in an action echo). (4) Gate: node scripts/check-no-old-domain.mjs → exit 0. (5) Smoke: bash scripts/smoke-check.sh → exit 0, apex-prefixed URLs, including the GSC verification file google7da873f4e9609872.html returning 200 at the NEW host (old property's file must keep serving — D-08 support). (6) HTTPS-redirect proof: `curl -sI http://geohisttrivia.com/ | Select-String -Pattern "^HTTP|^location"` shows the 301 to https. If ANY check regresses from 08-02's green state — stop and report; do not proceed to the checkpoint.</action>
  <verify>
    <automated>node scripts/check-no-old-domain.mjs && bash scripts/smoke-check.sh && gh api repos/persano/persano.github.io/pages --jq '{enforced:.https_enforced,cname:.cname,cert:.https_certificate.state}'</automated>
  </verify>
  <acceptance_criteria>
    - Pages API: https_enforced true, cname geohisttrivia.com, cert state issued-or-approved
    - DNS: apex resolves 4 A + 4 AAAA addresses; www CNAME → persano.github.io; GitHub TXT resolves
    - Redirects: apex https 200; http→https 301; www→apex 301; github.io→apex 301 with /geohist/ path preserved
    - CI gate exits 0; smoke-check exits 0 with every URL apex-prefixed
    - https://geohisttrivia.com/google7da873f4e9609872.html returns 200 (old-property verification file keeps serving)
  </acceptance_criteria>
  <done>Full probe battery green and recorded; every phase success criterion independently re-proven post-deploy; no regression from 08-02.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking-human">
  <name>Task 2: OWNER — live form test + GSC sitemap resubmit + Change of Address (HOST-03)</name>
  <files>.planning/phases/08-custom-domain-migration/08-03-SUMMARY.md (evidence appended)</files>
  <read_first>.planning/phases/08-custom-domain-migration/08-RUNBOOK.md (§6 post-migration owner steps — follow verbatim); .planning/phases/08-custom-domain-migration/08-CONTEXT.md (D-07..D-10)</read_first>
  <action>Owner executes runbook §6 in order and reports each result: (1) Live contact-form test — open https://geohisttrivia.com/geohist/contact.html, submit a real test message, confirm the success state appears (this is the user-visible proof that the allowlists + rewrite + deploy all interlock); also spot-test https://geohisttrivia.com/ loads and https://www.geohisttrivia.com/ redirects. (2) GSC sitemap resubmit (D-09/HOST-03) — in the NEW Domain property, submit https://geohisttrivia.com/sitemap.xml (Success status expected; same day as the smoke-green per D-09). (3) Change of Address (D-10) — in the NEW property open the Change of Address tool, source = the old persano.github.io URL-prefix property; let the tool's pre-move checks run (they verify ownership of both + spot-check 301s); file the move; note the 180-day window. (4) Confirm the old property is intact and will be watched for index decay (D-08) — no deletion. If the CoA tool rejects the old property as source (research A4 risk): record the exact UI message, skip step 3, and rely on the fallback (301s + sitemap + old-property monitoring) — the phase is still closed, the SUMMARY documents the deviation. Agent appends the owner-reported results to 08-03-SUMMARY.md as checkpoint evidence.</action>
  <verify>
    <automated>curl -s -o NUL -w "%{http_code}" https://geohisttrivia.com/geohist/contact.html</automated>
  </verify>
  <what-built>The site is fully migrated and verified green on geohisttrivia.com (Task 1 sweep). Nothing remains to build — this checkpoint is the owner-side HOST-03 close-out: live form proof + Google Search Console submissions per runbook §6.</what-built>
  <how-to-verify>Owner: (1) submit a real test message at https://geohisttrivia.com/geohist/contact.html and confirm the success state; spot-check apex load + www redirect; (2) in the NEW Domain property submit https://geohisttrivia.com/sitemap.xml; (3) open Change of Address in the new property, source = the old persano.github.io property, let pre-move checks run, file the move; (4) confirm the old property stays. Agent appends reported results to 08-03-SUMMARY.md.</how-to-verify>
  <resume-signal>Owner reports the 4 step results (or the CoA-fallback message if the tool refuses the source property) — "done" or list what failed</resume-signal>
  <done>Owner confirms: (1) test message submitted successfully through the live form at the new domain; (2) sitemap submitted to the new property with Success; (3) Change of Address filed old→new (or documented fallback if the tool refused); (4) old property retained. HOST-03 closed; D-09/D-10 satisfied.</done>
  <reversibility rating="costly">The CoA filing opens a 180-day signal window; cancellation is possible but requires removing forward 301s and adding reverse 301s, then canceling in the old property (runbook §7 CoA-cancel-first branch). Costly, not one-way — hence flagged, with the rollback branch documented rather than a blocking decision checkpoint.</reversibility>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| GSC submissions → Google index | Filing a move against a broken/ungreen state teaches Google the wrong mapping for 180 days |
| Owner console → property retention | Deleting the old property would blind the index-decay monitoring surface |
| Rollback procedure → CoA state | A rollback while CoA is active leaves Google preferring a site that no longer exists |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-08-03-01 | Tampering | CoA filed against ungreen state | medium | mitigate | Plan-03 sequencing: Task 1 sweep (automated, must pass) gates the owner checkpoint; smoke-green is D-09's precondition |
| T-08-03-02 | Denial of service | Old property deleted → index-decay blindness | medium | mitigate | Prohibition recorded; checkpoint step 4 explicitly confirms retention; runbook §6 states no-deletion |
| T-08-03-03 | Repudiation | Rollback/CoA entanglement | medium | accept | Documented: rollback while CoA active requires CoA-cancel-first (runbook §7); low likelihood — rollback is not planned post-green |
| T-08-SC | Supply chain | npm installs | low | accept | Zero-dependency phase — verification and owner console steps only |
</threat_model>

<verification>
- Agent sweep (Task 1): Pages API enforced/cname/cert green; DNS A×4+AAAA×4+CNAME+TXT; redirect triple; gate 0; smoke 0; verification file 200 at new host
- Owner checkpoint (Task 2): live form success; sitemap Success in new property; CoA filed or fallback documented; old property retained
</verification>

<success_criteria>
Phase-8 plan 03 is done when: the final sweep re-proves all phase success criteria with no regression, the owner has submitted a real message through the live form at geohisttrivia.com, the sitemap is resubmitted to the new Domain property (D-09), Change of Address is filed (D-10) or its documented fallback recorded, and the old property is retained (D-08) — HOST-01, HOST-02, HOST-03 all closed.
</success_criteria>

<output>
Create `.planning/phases/08-custom-domain-migration/08-03-SUMMARY.md` when done
</output>
