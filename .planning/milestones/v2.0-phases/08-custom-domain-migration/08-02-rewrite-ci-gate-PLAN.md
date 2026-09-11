---
phase: 08-custom-domain-migration
plan: 02
type: execute
wave: 2
depends_on: ["08-01"]
files_modified:
  - scripts/check-no-old-domain.mjs
  - package.json
  - geohist/index.html
  - geohist/guide.html
  - geohist/contact.html
  - geohist/changelog.html
  - geohist/privacy.html
  - index.html
  - sitemap.xml
  - robots.txt
  - scripts/smoke-check.sh
  - js/i18n.js
  - js/consent.js
  - js/contact.js
  - js/firebase-config.js
autonomous: true
requirements: [HOST-02, HOST-01]
estimate:
  tokens: 30000
  raw_tokens: 30000
  tasks: 3
  confidence: low
must_haves:
  truths:
    - "Every functional absolute URL on the site points at the apex: canonical, og:url, og:image, twitter:url, twitter:image, JSON-LD url+image, sitemap.xml <loc> entries, robots.txt Sitemap line, smoke-check BASE — all under https://geohisttrivia.com/... (D-01, D-02)"
    - "The 5 prose file-header comments (js/i18n.js, js/consent.js, js/contact.js, js/firebase-config.js, scripts/smoke-check.sh) reference the new domain in the SAME commit as the functional rewrite (D-05)"
    - "A permanent CI gate fails the validate job on any legacy-host reference outside the allowlist {.planning, README.md, AGENTS.md, .git, node_modules} — protecting Phases 9/10 and all future edits (D-06)"
    - "Gate script, validate-chain entry, linkinator skip flip, and the full 44-ref rewrite (39 functional + 5 prose) land in ONE atomic commit (D-05/D-06 sequencing; Phase 06 one-atomic-commit precedent)"
    - "smoke-check.sh runs green against https://geohisttrivia.com after deploy — every printed URL carries the new host"
    - "github.io dual-hosts then redirects: legacy host 301s to the apex with full path preservation (platform-verified, re-proven post-deploy)"
  artifacts:
    - "scripts/check-no-old-domain.mjs — zero-dependency node walk gate, exit 1 with file:line hit list, readable allowlist constant"
    - "package.json — validate:domain chained into validate (after validate:html); linkinator --skip flipped to the apex plain string"
    - "44 refs rewritten across 14 files: geohist/index.html, geohist/{guide,contact,changelog,privacy}.html, index.html, sitemap.xml, robots.txt, scripts/smoke-check.sh, js/{i18n,consent,contact,firebase-config}.js"
  key_links:
    - "validate chain ↔ check-no-old-domain.mjs — deploy.yml runs `npm run validate`, so the gate self-protects from the first push it lands in"
    - "smoke-check BASE ↔ geohisttrivia.com — the BASE flip is the D-09 green-gate precondition for plan 08-03"
    - "linkinator plain-string skip ↔ apex — plain string per Phase 06 decision; live self-URL checks stay in smoke-check.sh"
    - "Gate allowlist ↔ .planning + README.md + AGENTS.md — repo-name heading and hosting docs are factual identifiers, out of rewrite scope (deferred item)"
  prohibitions:
    - statement: "Acceptance is ZERO legacy-host matches outside the allowlist — never a magic ref count (42/44); counts drift and phantom-fail (research Pitfall 10)"
      status: enforced
      verification: "node scripts/check-no-old-domain.mjs exits 0 after the rewrite; no count-based assertion exists in any plan task"
    - statement: "The linkinator skip must never become a regex lookahead — linkinator 8.1.0 turns ^-anchored lookaheads into match-nothing (Phase 06 vacuous-gate bug: 0 links scanned, gate lies); plain-string skip only"
      status: enforced
      verification: "package.json validate:links shows --skip \"https://geohisttrivia.com\" as a plain string"
    - statement: "smoke-check BASE and the linkinator skip must never stay pointed at the legacy host after the rewrite — smoke would green-light the wrong host (research Pitfall 6)"
      status: enforced
      verification: "post-deploy smoke output shows https://geohisttrivia.com/... on every checked URL"
    - statement: "The CI gate must never be committed before or separately from the rewrite — a pre-gate commit fails CI on the still-old refs; same commit is the only safe sequencing (D-06)"
      status: enforced
      verification: "git show --stat on the migration commit contains both scripts/check-no-old-domain.mjs and all 14 rewritten files"
---

<objective>
The one-commit migration: rewrite every legacy-host reference (39 functional + 5 prose = 44 across 14 files) and self-protect with a permanent CI old-domain gate, then prove the deployed site green on the apex.

Purpose: Zero mixed-domain references is HOST-02; the gate (D-06) is what makes it permanent instead of a one-time cleanup. The atomic commit follows the Phase 06 precedent.
Output: scripts/check-no-old-domain.mjs, updated validate chain + linkinator skip, 14 rewritten files, one commit, deploy verified by smoke-check on geohisttrivia.com.
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
</context>

<edge_coverage>
The 3 HOST-02 specless-probe rows, surfaced as flagged assumptions:

- HOST-02/adjacency (functional refs vs prose headers): treated as ONE rewrite class in ONE commit — D-05 merges the 5 comment headers into the 39-ref functional pass; no separate "cosmetics" commit exists.
- HOST-02/empty (zero matches): after the rewrite the gate's hit list is empty → script prints OK and exits 0; the gate never asserts an expected non-zero count, so an empty tree is the success state, not an edge case.
- HOST-02/ordering (stable output): the gate walks directories in node's deterministic readdir order and prints every file:line hit before failing — acceptance depends on the set of hits (must be empty), never on hit ordering.

Out-of-scope non-drops (surfaced, not silently dropped): repo rename and `.planning/` public-surface hygiene stay allowlisted/deferred per CONTEXT deferred items; JS internals and root-relative asset paths (/css/, /js/, /geohist/) are deliberately untouched (research Anti-Pattern 6).
</edge_coverage>

<artifacts_this_phase>
Plan 02 creates:
- `scripts/check-no-old-domain.mjs` — new zero-dep CI gate script (walk + allowlist + exit code)
- `package.json` — new script `validate:domain`; `validate` chain gains it after `validate:html`; `validate:links` --skip string flipped to the apex
- `scripts/smoke-check.sh` — `BASE` constant flipped to the apex; header comment (line 2) rewritten
- Rewritten URL surface: `geohist/index.html` (canonical, og:url, og:image, twitter:url, twitter:image, JSON-LD url + image), `geohist/guide.html`, `geohist/contact.html`, `geohist/changelog.html`, `geohist/privacy.html` (canonical + og/twitter each), root `index.html` (4 refs), `sitemap.xml` (6 `<loc>` entries), `robots.txt` (1 `Sitemap:` line), and line-2 header comments in `js/i18n.js`, `js/consent.js`, `js/contact.js`, `js/firebase-config.js`
- No new dependencies, no workflow (deploy.yml) changes, no CNAME file
</artifacts_this_phase>

<tasks>

<task type="auto">
  <name>Task 1: CI old-domain gate — scripts/check-no-old-domain.mjs + validate chain</name>
  <files>scripts/check-no-old-domain.mjs, package.json</files>
  <read_first>scripts/i18n-keycheck.mjs (repo gate-script convention: zero-dep node builtins, exit-code semantics, console.error on fail); package.json (current validate chain + validate:links skip — lines 5–9); .planning/phases/08-custom-domain-migration/08-RESEARCH.md (Recommended CI Gate Design + CI gate skeleton in Code Examples — copy structure, adapt)</read_first>
  <action>Author the gate per research Option B, but with file:line reporting (the research skeleton reports file names only — upgrade: per line, find the legacy-host index and report `file:line`). Structure: zero-dependency node builtins (readdirSync/readFileSync/statSync from node:fs, join/sep from node:path); ALLOW set exactly {.planning, README.md, AGENTS.md, .git, node_modules}; recursive walk from repo root skipping allowlisted names; per text file, scan lines for the legacy host substring; collect `path:line` hits; on any hit print `Old-domain refs found:` + the list to console.error and exit 1; else print `check-no-old-domain: OK` and exit 0. Treat binary-ish extensions defensively (skip files whose content contains a NUL byte within the first chunk) so the walk never crashes on og-image.png etc. package.json edits: (1) add `"validate:domain": "node scripts/check-no-old-domain.mjs"`; (2) chain it into `validate` immediately after `validate:html` (research-recommended position); (3) flip the FIRST `--skip` in `validate:links` from the legacy-host plain string to the plain string "https://geohisttrivia.com" (leave --skip play.google.com, policies.google.com, planning, node_modules untouched). Do NOT commit in this task — Task 3 commits everything atomically.</action>
  <verify>
    <automated>node scripts/check-no-old-domain.mjs; if ($LASTEXITCODE -eq 0) { Write-Output 'UNEXPECTED PASS pre-rewrite' ; exit 1 } else { Write-Output 'gate correctly RED pre-rewrite' }</automated>
  </verify>
  <acceptance_criteria>
    - Gate run against the CURRENT tree exits 1 and prints file:line for every legacy-host hit (expected ~44 across the 14 files; the allowlisted README.md/AGENTS.md/.planning hits are absent from output)
    - Gate is red before the rewrite and green after it — proving both directions of the regression protection
    - package.json validate chain reads: validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n
    - validate:links first --skip equals the plain string "https://geohisttrivia.com"
    - Script uses only node builtins (no imports beyond node:fs/node:path)
  </acceptance_criteria>
  <done>Gate script + package.json chain edits authored, red against the current tree with a clean file:line report, NOT yet committed.</done>
</task>

<task type="auto">
  <name>Task 2: Atomic 44-ref rewrite — 39 functional URLs + 5 prose headers</name>
  <files>geohist/index.html, geohist/guide.html, geohist/contact.html, geohist/changelog.html, geohist/privacy.html, index.html, sitemap.xml, robots.txt, scripts/smoke-check.sh, js/i18n.js, js/consent.js, js/contact.js, js/firebase-config.js</files>
  <read_first>geohist/index.html (10 refs: canonical, og:url, og:image, twitter:url, twitter:image, JSON-LD url + image — read every head block); geohist/guide.html, geohist/contact.html, geohist/changelog.html, geohist/privacy.html (canonical + og/twitter each); index.html (4 head refs); sitemap.xml (6 <loc> entries, NO lastmod — keep shape); robots.txt (Sitemap line); scripts/smoke-check.sh (BASE line 8 + header line 2); js/i18n.js, js/consent.js, js/contact.js, js/firebase-config.js (line-2 header comments)</read_first>
  <action>Mechanical pass, path shapes preserved 1:1: replace every `https://<legacy-github-io-host>/...` absolute URL with the same path under `https://geohisttrivia.com/...` — apex only, never www (D-02). Sweep: geohist/index.html (canonical link, og:url, og:image, twitter:url, twitter:image, JSON-LD "url" and "image" values); guide/contact/changelog/privacy.html (canonical + og:url/og:image/twitter:url/twitter:image as present per file); root index.html (all 4 head refs); sitemap.xml (all 6 <loc> entries — no <lastmod> exists, do not add any); robots.txt (the Sitemap: line); smoke-check.sh (line 8 BASE constant → `BASE="https://geohisttrivia.com"`, and the line-2 header comment hostname); js/i18n.js, js/consent.js, js/contact.js, js/firebase-config.js — line-2 file-header comments hostname only, no other line of any JS file changes. Do NOT touch: root-relative asset paths (/css/, /js/, /geohist/), any JS logic, the Play Store URL, gstatic URLs, or the google7da873f4e9609872.html filename. Do NOT commit in this task — Task 3 commits gate + rewrite atomically.</action>
  <verify>
    <automated>$hits = rg -n "persano.github.io" --hidden -g "!.planning/**" -g "!README.md" -g "!AGENTS.md" -g "!.git/**" ; if ($LASTEXITCODE -eq 1) { Write-Output 'ZERO legacy-host matches outside allowlist' } else { Write-Output $hits; exit 1 }</automated>
  </verify>
  <acceptance_criteria>
    - rg for the legacy host across the repo (excluding .planning/, README.md, AGENTS.md, .git/) returns ZERO matches — this is the grep-verified acceptance, not a count
    - sitemap.xml contains exactly 6 <loc> entries all beginning https://geohisttrivia.com/ and zero <lastmod> elements
    - robots.txt Sitemap line reads Sitemap: https://geohisttrivia.com/sitemap.xml
    - smoke-check.sh line 8 is BASE="https://geohisttrivia.com"; its line-2 header names the new host
    - Each of the 5 js/*.js files differs from before ONLY on its line-2 header comment (no logic drift — verify with git diff hunk count per file)
    - geohist/index.html JSON-LD "url" and "image" values both point at geohisttrivia.com; og:image and twitter:image point at https://geohisttrivia.com/geohist/og-image.png
  </acceptance_criteria>
  <done>All 44 refs rewritten in the working tree; grep acceptance (zero legacy matches outside allowlist) passes; no commit yet.</done>
</task>

<task type="auto">
  <name>Task 3: One atomic commit → push → CI green → smoke-check green on the apex</name>
  <files>.git (commit only — no new files)</files>
  <read_first>scripts/check-no-old-domain.mjs + package.json (Task 1 state); all Task 2 files (git status/diff review before staging); .planning/phases/08-custom-domain-migration/08-01-SUMMARY.md (confirms owner gate passed)</read_first>
  <action>Stage exactly: scripts/check-no-old-domain.mjs, package.json, and the 13 Task-2 files. ONE commit (Phase 06 one-atomic-commit convention; gate and rewrite inseparable per D-06 — a gate-first commit would fail CI on the still-old refs). Commit message style: conventional, e.g. feat(08-02): migrate all URLs to geohisttrivia.com + old-domain CI gate. Run node scripts/check-no-old-domain.mjs locally → exit 0 BEFORE pushing. Push to main. Wait for the Actions run on the pushed SHA: validate job green MUST include the new validate:domain step, then deploy job green. Allow the ~60s Pages propagation window (smoke-check header documents it). Run the smoke check via bash (Git Bash): `bash scripts/smoke-check.sh` — every URL line must be prefixed https://geohisttrivia.com (grep the output for the apex prefix; any legacy-host prefix line is a FAIL). Live curl proofs: apex https → 200; `https://www.geohisttrivia.com/` → 301 to apex; `https://persano.github.io/geohist/` (old github.io host) → 301 with /geohist/ path preserved to apex — run these three exactly as written (the legacy-host literal here lives in a verify command, not an action echo). If smoke fails on 404-body check: treat the live run as truth (research Pitfall 7 — do not gate on the API custom_404 field), diagnose, and only then re-run.</action>
  <verify>
    <automated>node scripts/check-no-old-domain.mjs && bash scripts/smoke-check.sh</automated>
  </verify>
  <acceptance_criteria>
    - Exactly one commit contains the gate script, both package.json edits, and all 13 rewritten files (git show --stat proves co-location)
    - node scripts/check-no-old-domain.mjs exits 0 (allowlist-only hits remain in README.md/AGENTS.md/.planning)
    - GitHub Actions run for the pushed SHA: validate job green including validate:domain output line, deploy job green
    - bash scripts/smoke-check.sh exits 0 with all ~12 checks green and every printed URL prefixed https://geohisttrivia.com
    - curl: https apex 200; www→apex 301; legacy github.io host→apex 301 with path preserved
  </acceptance_criteria>
  <done>Migration commit pushed; CI validate+deploy green with the new gate in the chain; smoke-check green against the apex; all three redirect proofs pass. The D-09 precondition (smoke green on geohisttrivia.com) is now TRUE.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Repo content → CI validate job | Any future edit can reintroduce the legacy host; the gate is the control surface |
| Deployed canonical tags → Googlebot | Mixed-domain canonicals during the window tell crawlers the wrong preferred URL |
| Linkinator skip config → CI link check | A malformed skip can silently disable the gate (Phase 06 precedent) |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-08-02-01 | Information disclosure | Mixed-domain window (apex serving legacy-host canonicals — live NOW per research) | high | mitigate | Single atomic rewrite commit lands promptly after the owner gate; runbook §0 documents the hazard; smoke green same-day |
| T-08-02-02 | Tampering | Legacy host reintroduced by Phase 9/10 edits | medium | mitigate | validate:domain in the permanent validate chain; allowlist minimal and readable; failure output lists file:line |
| T-08-02-03 | Tampering | Vacuous link-check via malformed skip | medium | mitigate | Plain-string --skip only (Phase 06 precedent bans regex lookaheads); prohibition recorded in must_haves |
| T-08-02-04 | Repudiation | Allowlist dirs used to hide functional legacy-host refs | low | accept | Allowlist limited to factual-identifier/history surfaces (README heading, AGENTS.md hosting docs, .planning archive); future growth of the allowlist is a visible diff |
| T-08-SC | Supply chain | npm installs | low | accept | Zero-dependency phase — only script authoring; devDependencies unchanged |
</threat_model>

<verification>
- node scripts/check-no-old-domain.mjs → exit 0 (and it exited 1 pre-rewrite — both directions proven)
- rg legacy host outside allowlist → zero matches
- bash scripts/smoke-check.sh → exit 0, all URLs apex-prefixed
- Actions run: validate (incl. validate:domain) + deploy green on the migration SHA
- curl triple: apex 200 / www→apex 301 / github.io→apex 301 path-preserved
</verification>

<success_criteria>
Phase-8 plan 02 is done when: one atomic commit carries the 44-ref rewrite + permanent CI gate; CI is green with the gate in the chain; smoke-check is green against https://geohisttrivia.com; all redirects behave exactly as the research table predicts — HOST-02 satisfied and the D-09 gate open for plan 03.
</success_criteria>

<output>
Create `.planning/phases/08-custom-domain-migration/08-02-SUMMARY.md` when done
</output>
