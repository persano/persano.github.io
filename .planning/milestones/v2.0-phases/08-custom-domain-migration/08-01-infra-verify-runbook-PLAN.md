---
phase: 08-custom-domain-migration
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/phases/08-custom-domain-migration/08-RUNBOOK.md
autonomous: false
requirements: [HOST-01]
user_setup:
  - service: spaceship-registrar
    why: "Add the 4 missing apex AAAA records (the only DNS gap)"
    dashboard_config:
      - task: "Add AAAA @ records 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153"
        location: "Spaceship DNS zone for geohisttrivia.com"
  - service: github-profile-settings
    why: "Verify-click for geohisttrivia.com (TXT record already resolves)"
    dashboard_config:
      - task: "Profile Settings → Pages → Verified domains → geohisttrivia.com → Verify"
        location: "github.com profile Settings (account-level, not repo Settings)"
  - service: firebase-console
    why: "Auth authorized-domains + API-key HTTP-referrer allowlist BEFORE the rewrite"
    dashboard_config:
      - task: "Add geohisttrivia.com to Auth authorized domains; add 2 referrer entries to the API key"
        location: "Firebase console → Auth → Settings; GCP console → Credentials → API key"
  - service: google-search-console
    why: "New Domain property + DNS TXT verification BEFORE the rewrite"
    dashboard_config:
      - task: "Create Domain property geohisttrivia.com, verify via the TXT record GSC displays"
        location: "search.google.com/search-console"
estimate:
  tokens: 20000
  raw_tokens: 20000
  tasks: 3
  confidence: low
must_haves:
  truths:
    - "Site serves over enforced HTTPS at geohisttrivia.com (apex): http→https redirect live, www→apex 301, persano.github.io→apex 301 path-preserving (D-01, D-02)"
    - "Every Pages config change is made via gh CLI PUT with GET-baseline and GET-confirmation around it — no Settings-UI clicks by the owner for domain/enforce (D-12)"
    - "A single owner runbook covers: DNS completion (AAAA×4), Verify click, Firebase Auth + API-key allowlists, GSC Domain property, agent-step cross-references, post-migration GSC steps, and documented rollback (D-11, D-13)"
    - "Runbook instructs keeping persano.github.io in Firebase Auth authorized-domains AND the API-key HTTP-referrer allowlist — through the transition and indefinitely (D-03, D-04)"
    - "Runbook specifies a GSC Domain property (geohisttrivia.com, no www, no protocol) verified via DNS TXT, with the old URL-prefix property retained (D-07, D-08)"
    - "Owner has confirmed via blocking checkpoint that AAAA×4, the Verify click, both Firebase allowlist surfaces, and the GSC Domain property are done BEFORE the URL rewrite plan starts"
  artifacts:
    - ".planning/phases/08-custom-domain-migration/08-RUNBOOK.md — 9-section owner runbook incl. DNS table, allowlist entry shapes, rollback + CoA-cancel branch"
    - "GitHub Pages config field https_enforced=true on repos/persano/persano.github.io (via gh api PUT)"
  key_links:
    - "gh CLI session ↔ GET/PUT /repos/persano/persano.github.io/pages — same authenticated transport deploys use; GET-after-PUT is the only correctness proof (research A5)"
    - "AAAA×4 records ↔ apex IPv6 reachability — the single remaining DNS gap for HOST-01"
    - "Runbook §3/§4 ↔ Firebase/GSC console state — console contents are unprobeable, so the owner confirmation checkpoint is the ordering gate for plan 08-02"
  prohibitions:
    - statement: "persano.github.io must never be removed from Firebase Auth authorized-domains or the API-key HTTP-referrer allowlist — during the transition or ever after (D-03/D-04; removal breaks the form on any rollback)"
      status: enforced
      verification: "grep 08-RUNBOOK.md shows keep instructions next to both allowlist steps"
    - statement: "No CNAME file may be committed to the repo — under Actions publishing it is ignored and the domain lives in repo Pages settings; the file must stay absent"
      status: enforced
      verification: "Test-Path CNAME at repo root returns False after the plan"
    - statement: "DELETE /repos/persano/persano.github.io/pages must never be used for rollback — it deletes the whole Pages site config and unpublishes the site; rollback is PUT with cname null"
      status: enforced
      verification: "08-RUNBOOK.md rollback section documents the PUT-JSON rollback and names DELETE as forbidden"
    - statement: "https_enforced must never be flipped before https_certificate.state is terminal (issued/approved) for both apex and www"
      status: enforced
      verification: "tracer task GET output shows cert state issued/approved BEFORE the PUT is issued"
assumption_delta_decision:
  noun_primary: "geohisttrivia.com (apex canonical URL)"
  decision: "promote"
  rationale: "Domain chosen and registered; every URL/allowlist/runbook surface keys off the concrete apex, so the generic 'custom domain' placeholder demotes to a mechanism detail"
---

<objective>
Finish the infrastructure half of a half-done migration: re-verify the live Pages/DNS state (it changed between sessions), flip HTTPS enforcement via the gh CLI, and hand the owner a single runbook that completes DNS, domain verification, Firebase allowlists, and the new GSC property — all BEFORE the URL rewrite.

Purpose: The locked ordering (cert verified + console allowlists BEFORE rewrite) is the anti-form-death invariant; this plan proves infra state and unblocks the owner work in parallel.
Output: Verified live-infra table, https_enforced=true, 08-RUNBOOK.md, and a blocking owner-confirmation checkpoint.
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
</context>

<edge_coverage>
All 8 specless-probe rows are unresolved; the 4 HOST-01 rows are surfaced here as flagged assumptions (never silent drops; never auto-resolved):

- HOST-01/adjacency (merge vs separate when hosts touch): apex and www are SEPARATE entries on every allowlist surface — Firebase Auth gets a bare-hostname `geohisttrivia.com` entry and an optional separate `www.geohisttrivia.com` belt-and-braces entry (research A1 / Open Question 2); the API-key referrer restriction gets the docs-verified two-entry pattern. ASSUMPTION: exact-host matching for custom domains; www entry is a zero-cost hedge — the owner's live form test is the decider.
- HOST-01/empty (null input): `protected_domain_state: null` means the profile Verify click has NOT happened; treated as a SOFT, non-blocking check (takeover protection, not a deploy gate). Null `cname` in a PUT body means domain removal — used ONLY by the documented rollback, never mid-plan.
- HOST-01/ordering (equal elements): A×4 and AAAA×4 are unordered address SETS — DNS probes compare resolved address sets, not sequence; no record-order semantics are asserted anywhere.
- HOST-01/concurrency (interrupted/parallel): owner console steps and agent gh steps run in parallel per D-11; the ONLY serialization points are (a) cert-terminal check before the PUT inside the tracer, and (b) the owner checkpoint before the rewrite. If any PUT is interrupted, the next GET shows actual state and the PUT is safely re-issued (research A5).

Unresolved ≠ blocking: each assumption is verified by the concrete probe/checkpoint named above at execution time.
</edge_coverage>

<artifacts_this_phase>
Plan 01 creates:
- `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` — the phase's owner-facing runbook (D-11 artifact)
- GitHub Pages config mutation: `https_enforced: true` on `repos/persano/persano.github.io` via `gh api -X PUT` (D-12)
- No source files, no workflow changes, no npm installs (zero-dependency phase)
(Phase-level artifacts produced by sibling plans: 08-02 creates scripts/check-no-old-domain.mjs + the 44-ref rewrite; 08-03 produces GSC sitemap resubmit + Change-of-Address evidence.)
</artifacts_this_phase>

<tasks>

<task type="tracer">
  <name>Task 1: End-to-end infra verification → HTTPS enforce flip → live redirect proof</name>
  <files>.planning/phases/08-custom-domain-migration/08-RUNBOOK.md (§0 current-state table only — updated by this task's probe results)</files>
  <read_first>.planning/phases/08-custom-domain-migration/08-RESEARCH.md (Migration State Reality Check table + Code Examples section — the probe battery and exact gh/curl commands come verbatim from there)</read_first>
  <action>Wire the one infra path end-to-end, in order: (1) Wave-0 probe battery — `gh api repos/persano/persano.github.io/pages` baseline: expect cname geohisttrivia.com, build_type workflow, https_enforced false, https_certificate.state issued-or-approved with both apex and www listed, protected_domain_state null; `Resolve-DnsName geohisttrivia.com -Type A` → 185.199.108–111.153 set; `-Type AAAA` → expect missing (SOA authority answer) — if AAAA now resolves, note it and skip the owner DNS nag later; `Resolve-DnsName www.geohisttrivia.com -Type CNAME` → persano.github.io; `Resolve-DnsName _github-pages-challenge-persano.geohisttrivia.com -Type TXT` → resolves; curl `https://persano.github.io/geohist/` → 301 to apex path-preserved; curl `https://www.geohisttrivia.com/` → 301 to apex. (2) DIVERGENCE GATE: if any probe contradicts the research table (cert errored, cname changed, 301s gone) — STOP and report before any mutation. (3) With cert state terminal (issued/approved), flip enforcement: `gh api -X PUT repos/persano/persano.github.io/pages -F https_enforced=true` — send ONLY that field (no source, no build_type, no cname; -F not -f for the boolean). (4) GET-after-PUT: confirm https_enforced true AND cname/build_type/cert-state unchanged (research pitfall 1/2: wrong verb or fat body is the failure mode). (5) Live proof: `curl -s -o NUL -w "%{http_code} -> %{redirect_url}" http://geohisttrivia.com/` → 301 to https://geohisttrivia.com/, then https apex → 200. Record the full probe table into runbook §0. Do NOT use the DELETE endpoint anywhere in this task. Do NOT touch the legacy host string in any repo file — that is plan 08-02.</action>
  <verify>
    <automated>gh api repos/persano/persano.github.io/pages --jq '{enforced: .https_enforced, cname: .cname, cert: .https_certificate.state}' ; curl -s -o NUL -w "%{http_code} %{redirect_url}" http://geohisttrivia.com/</automated>
  </verify>
  <done>GET shows https_enforced true with cname geohisttrivia.com and cert state issued-or-approved unchanged; http apex returns 301 to https; https apex returns 200; both 301s (github.io→apex path-preserved, www→apex) confirmed live; probe table written into runbook §0.</done>
  <reversibility rating="reversible">HTTPS enforce flips back with one PUT https_enforced=false; no content, DNS, or allowlist change in this task.</reversibility>
</task>

<task type="auto">
  <name>Task 2: Author 08-RUNBOOK.md — owner console + DNS + rollback instructions</name>
  <files>.planning/phases/08-custom-domain-migration/08-RUNBOOK.md</files>
  <read_first>.planning/phases/08-custom-domain-migration/08-RESEARCH.md (Runbook Structure + DNS Record Table + Allowlist Surfaces + Code Examples sections — copy the DNS table and entry shapes verbatim); .planning/phases/08-custom-domain-migration/08-CONTEXT.md (D-01..D-13)</read_first>
  <action>Write the owner runbook with the research's 9-section structure, stating it contains console-UI instructions only (no secrets; the repo artifact is publicly served): §0 current state (paste Task 1's probe table; mark what is already done vs owner TODO); §1 registrar (Spaceship): the ONLY DNS TODO is AAAA×4 at `@` — values 2606:50c0:8000::153, 8001::153, 8002::153, 8003::153; instruct: do not touch the 4 live A records, the www CNAME, or the `_github-pages-challenge-persano` TXT; no wildcard records; no extra A/AAAA/ALIAS at `@`; if CAA records exist at least one must allow letsencrypt.org; include the full 11-row DNS table from research verbatim; add the PowerShell verify probes (Resolve-DnsName A/AAAA/CNAME/TXT). §2 GitHub verification: profile avatar → Settings → Pages → Verified domains → geohisttrivia.com → Verify (TXT already resolving; keep the TXT record forever). §3 Firebase console: Auth → Settings → Authorized domains — ADD `geohisttrivia.com` (bare hostname, no scheme/path) and `www.geohisttrivia.com` as a separate belt-and-braces entry; KEEP the legacy github.io entries indefinitely per D-03/D-04 (state the reason: stale-indexed visitors + rollback safety); GCP console → Credentials → API key → Website restrictions — ADD both `https://geohisttrivia.com/*` and `https://*.geohisttrivia.com/*` (docs-verified two-entry pattern; wildcards only as full segments); KEEP existing github.io referrer entries; warn: the UI append flow only — gcloud/REST replaces the whole list; failure shapes: auth/unauthorized-domain at submit, referrer-rejected identitytoolkit/firestore calls. §4 Search Console: create a Domain property `geohisttrivia.com` (no protocol, no www, no path), DNS-record verification with the exact TXT string the GSC UI displays; the old persano.github.io URL-prefix property STAYS (D-08). §5 agent-steps cross-ref (enforce flip, rewrite commit, smoke-check — owner does nothing here). §6 post-migration owner steps: live contact-form test at https://geohisttrivia.com/geohist/contact.html; submit https://geohisttrivia.com/sitemap.xml in the NEW property (D-09); open Change of Address in the new property with source = the old persano.github.io property (D-10) — only after smoke-check green; note the 180-day signal window. §7 rollback (D-13): agent runs `gh api -X PUT repos/persano/persano.github.io/pages --input -` with JSON body cname null + https_enforced false (single call, site returns to the legacy host); allowlists keep github.io so the form survives rollback; IF Change of Address was already filed — cancel it FIRST in the old property (procedure requires 301 removal + reverse 301s); DELETE /pages endpoint is forbidden. §8 note for owner: confirm/flag anything in §3/§4 that turns out to be already done (console state is unknown — research Open Question 1).</action>
  <verify>
    <automated>node -e "const t=require('fs').readFileSync('.planning/phases/08-custom-domain-migration/08-RUNBOOK.md','utf8'); const need=['2606:50c0:8000::153','2606:50c0:8003::153','185.199.108.153','_github-pages-challenge-persano','https://*.geohisttrivia.com/*','authorized domains','Change of Address','--input -']; const miss=need.filter(s=>!t.includes(s)); if(miss.length){console.error('MISSING: '+miss.join(' | '));process.exit(1)} console.log('runbook sections OK')"</automated>
  </verify>
  <done>08-RUNBOOK.md exists with all 9 sections; DNS table carries AAAA×4 values verbatim; both allowlist surfaces list keep-legacy-host instructions; rollback section contains the PUT-JSON rollback command and the CoA-cancel-first branch; no secrets anywhere in the file.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking-human">
  <name>Task 3: OWNER GATE — runbook §1–§4 complete BEFORE the URL rewrite</name>
  <files>.planning/phases/08-custom-domain-migration/08-RUNBOOK.md (owner ticks/annotates §1–§4)</files>
  <read_first>.planning/phases/08-custom-domain-migration/08-RUNBOOK.md (§1 registrar, §2 Verify, §3 Firebase, §4 GSC)</read_first>
  <action>Owner executes runbook §1→§4 in order and reports completion. Agent then re-probes the checkable surfaces: `Resolve-DnsName geohisttrivia.com -Type AAAA` must now return the 4 expected IPv6 addresses (the one hard gate — HOST-01 DNS shape); `gh api repos/persano/persano.github.io/pages --jq .protected_domain_state` recorded as a SOFT check (null tolerated — Verify-click propagation lag, research Open Question 3); Firebase/GSC console contents are unprobeable — owner's verbal/UI confirmation is the evidence. If AAAA is still missing, the checkpoint stays open and the rewrite plan must not start.</action>
  <verify>
    <automated>Resolve-DnsName geohisttrivia.com -Type AAAA | Select-Object -ExpandProperty IPAddress</automated>
  </verify>
  <what-built>Infrastructure half verified and live: HTTPS enforced at the apex via gh PUT; 08-RUNBOOK.md authored with the owner's remaining steps (AAAA×4, Verify click, Firebase Auth + API-key allowlists, GSC Domain property). Agent work for this plan is complete — the remaining work is owner console/DNS execution per runbook §1–§4.</what-built>
  <how-to-verify>Owner: execute runbook §1 (Spaceship AAAA×4 add), §2 (GitHub profile Settings → Pages → Verified domains → Verify), §3 (Firebase Auth authorized domains + GCP API-key referrer entries — keep github.io entries), §4 (GSC Domain property + TXT verification). Agent re-probes after owner reports: Resolve-DnsName AAAA returns exactly the 4 expected addresses; owner verbally confirms console states (unprobeable).</how-to-verify>
  <resume-signal>Owner reports each of the 5 items done (or explicitly deferred-with-reason for the soft Verify item) — "gate passed" or list what is missing</resume-signal>
  <done>Owner confirms: (1) AAAA×4 added at @, (2) Verify click done in profile Settings (or explicitly deferred with reason — soft), (3) Firebase Auth authorized-domains has geohisttrivia.com (+ www) AND github.io entries still present, (4) API-key referrer restriction has both geohisttrivia.com entries AND github.io entries still present, (5) GSC Domain property created and TXT-verified. Agent's AAAA probe returns exactly 4 addresses.</done>
  <reversibility rating="costly">D-01/D-02 domain + apex-canonical choice is flagged costly by CONTEXT: every canonical/og/sitemap/JSON-LD URL and the Firebase/GSC allowlists key off geohisttrivia.com — a change re-runs the entire rewrite plus console passes. The registration itself is already done; this checkpoint only locks the ordering, so the cost is accepted and no one-way gate is inserted.</reversibility>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Public DNS zone → GitHub Pages edge | Owner-controlled DNS records steer apex/www traffic; a wrong or hijacked record repoints the domain |
| Unverified domain → GitHub account | An unverified custom domain can be claimed by another account (takeover) until the Verify click lands |
| gh CLI session → Pages REST API | An over-broad PUT body can clobber Pages config fields (source/build_type) |
| Browser origin → Firebase backends | Origin-gated allowlists decide whether the contact form works from the new host |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-08-01-01 | Spoofing/Tampering | geohisttrivia.com DNS (pre-Verify) | high | mitigate | TXT verification record (already resolving) + owner Verify click (runbook §2); agent records protected_domain_state as soft check; no wildcard DNS records |
| T-08-01-02 | Information disclosure | Dual-hosting window (github.io + apex serve same content) | medium | accept | Transient by design (D-03/D-04 keep both hosts working); 301s + sitemap resubmit + CoA converge the index; no action beyond ordering discipline |
| T-08-01-03 | Tampering | PUT /repos/.../pages config clobber | medium | mitigate | Minimal-body PUT (-F https_enforced=true only), GET-baseline + GET-after-PUT verification; rollback uses PUT cname-null JSON via --input - , never DELETE |
| T-08-01-04 | Denial of service | Form death by allowlist ordering | high | mitigate | Owner checkpoint (Task 3) blocks the rewrite until both Firebase surfaces + GSC property are confirmed; runbook documents failure shapes |
| T-08-SC | Supply chain | npm/devDependency installs | low | accept | Zero-dependency phase — no installs, devDependencies unchanged (research Package Legitimacy Audit: disposition none) |
</threat_model>

<verification>
- `gh api repos/persano/persano.github.io/pages` → https_enforced true, cname geohisttrivia.com, cert issued/approved
- `Resolve-DnsName geohisttrivia.com -Type AAAA` → 4 × 2606:50c0:8000–8003::153 (after owner checkpoint)
- `curl -s -o NUL -w "%{http_code} %{redirect_url}" http://geohisttrivia.com/` → 301 → https apex
- 08-RUNBOOK.md complete (9 sections, DNS table, keep-legacy-host instructions, rollback + CoA-cancel branch)
</verification>

<success_criteria>
Phase-8 plan 01 is done when: infra state re-verified against the research table with zero unexplained divergence; HTTPS enforced at the apex via one gh PUT with GET proof; owner runbook on disk covering DNS/Verify/Firebase/GSC/rollback; owner checkpoint confirms the four console+DNS prerequisites — making the URL-rewrite plan safe to start.
</success_criteria>

<output>
Create `.planning/phases/08-custom-domain-migration/08-01-SUMMARY.md` when done
</output>
