# Phase 8: Custom Domain Migration - Research

**Researched:** 2026-09-07
**Domain:** GitHub Pages custom-domain cutover (DNS/HTTPS/redirects), Firebase + Search Console allowlist migration, repo-wide URL rewrite, CI regression gate
**Confidence:** HIGH (live platform behavior probed this session; official docs fetched; repo inventory counted exactly)

## Summary

**The migration's infrastructure half is already live — discovered by probing, not assumed.** `GET /repos/persano/persano.github.io/pages` returned `cname: "geohisttrivia.com"`, Let's Encrypt cert **issued for both apex + www** (expires 2026-12-06), `build_type: workflow`. Live probes: apex serves 200 over HTTPS at 185.199.110.153, `www` → apex **301**, `persano.github.io` → apex **301 with full path preservation**. DNS verified: apex A×4 correct, `www` CNAME → `persano.github.io` correct, GitHub verification TXT record (`_github-pages-challenge-persano`) already resolves. Owner (or a prior session) evidently ran registration + DNS + domain-set already.

What remains is smaller and precisely bounded: (1) **AAAA×4 records are missing** (only A records) — owner DNS add; (2) `protected_domain_state: null` — the profile-level **Verify click hasn't happened** (TXT record exists; owner completes it); (3) `https_enforced: false` — agent flips via gh CLI PUT after cert check (already approved); (4) owner console allowlists (Firebase Auth authorized domains, API-key HTTP-referrer restriction, GSC Domain property + TXT verification) **before** the URL rewrite per locked decision; (5) the rewrite itself: **verified inventory is 44 refs, not 42** — 39 functional URLs across 10 files + 5 prose comment headers (D-05), plus README/AGENTS.md/.planning references that stay (allowlisted, not rewritten); (6) permanent CI old-domain gate; (7) smoke-check BASE + linkinator skip flip; (8) owner GSC steps: Domain property (DNS-verified), sitemap resubmit, Change-of-Address after 301s (which are already live).

Two prior-research claims are **corrected** this session: `.planning/research/PITFALLS.md` claimed "GitHub Pages serves the same content at both hostnames; there is no redirect" — **wrong**, the 301 exists and was verified live on this repo (which also makes the Change-of-Address tool viable, contrary to that note). And the Pages REST API update endpoint is **`PUT`, not `PATCH`** per current docs. Sitemap `lastmod` policy (a discretion item) is trivially resolved: `sitemap.xml` has **no `<lastmod>` entries today** — the rewrite keeps the existing shape, pure `<loc>` swap.

**Primary recommendation:** Treat this phase as "finish a half-done migration": Wave 0 re-verifies live state (DNS/table + GET /pages + curl probes) since it changed under us; owner console steps (Firebase ×2 surfaces, GSC Domain property) run in parallel from day 1 per D-11 runbook; then one atomic agent commit (44 refs + 5 headers + CI gate + smoke-check/linkinator flips, gate included so CI self-protects); then gh `https_enforced` flip, smoke-check green on apex, owner sitemap resubmit + CoA.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Domain is **`geohisttrivia.com`** — matches Play package `com.persano.geohisttrivia`; persano.com rejected (taken since 1997). Costly to reverse — every URL surface keys off it.
- **D-02:** **Apex canonical** — `geohisttrivia.com` is the host in repo Settings and in all rewritten URLs; `www` 301-redirects to apex (Pages handles it; empirically confirmed live).
- **D-03:** During dual-hosting/301 period, `persano.github.io` **stays in Firebase Auth authorized-domains AND API-key HTTP-referrer allowlist** alongside `geohisttrivia.com` — stale-indexed visitors keep a working form.
- **D-04:** github.io stays in allowlists **indefinitely** — guarantees rollback never breaks the form.
- **D-05:** The **5 prose comment headers** (`js/i18n.js`, `js/consent.js`, `js/contact.js`, `js/firebase-config.js` headers + `scripts/smoke-check.sh` header) rewritten to geohisttrivia.com **in the same migration commit**.
- **D-06:** **Permanent CI gate** against old-domain regression in the existing validate job, fail on `persano.github.io` functional refs outside a skip-list.
- **D-07:** New GSC property is a **Domain property** (`geohisttrivia.com`, no www) verified via **DNS TXT**; old property used HTML-file verification (`google7da873f4e9609872.html`).
- **D-08:** Old `persano.github.io` URL-prefix property **stays** — watches the 301/index-decay curve. No deletion step.
- **D-09:** Sitemap resubmitted to new property the **same day** smoke-check goes green on geohisttrivia.com (HOST-03).
- **D-10:** Google **Change-of-Address tool** used on the new property once Pages 301s are live (they are — verified live this session).
- **D-11:** Owner runbook at `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md`; owner runs registration + DNS + Firebase console + GSC steps in parallel from day 1.
- **D-12:** Agent applies Pages domain + HTTPS-enforce via **gh CLI** (`PUT /repos/.../pages` — corrected from PATCH), not owner Settings-UI clicks.
- **D-13:** Runbook includes a **documented rollback section**: gh CLI unset-domain → Pages returns to persano.github.io; allowlists keep github.io indefinitely.

### the agent's Discretion
- Exact CI-gate implementation shape (node script vs grep step; skip-list mechanism).
- Sitemap `lastmod` policy — **resolved: no `<lastmod>` entries exist; keep shape** `[VERIFIED: sitemap.xml:1-9]`.
- smoke-check.sh BASE value + linkinator skip updates (mechanical, part of the 44).
- Runbook step ordering details and DNS record table format.
- Whether `Enforce HTTPS` flips in the same gh PUT as domain-set (moot: domain already set; enforce flips alone, after cert verified — cert already approved).

### Deferred Ideas (OUT OF SCOPE)
- Game-only site focus restructure / repo rename away from `persano.github.io`.
- Public-surface hygiene (`.planning/` served by `upload-pages-artifact path: '.'`) — separate hardening idea.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOST-01 | Custom domain with HTTPS — repo-Settings config (no CNAME file under Actions publishing), DNS (apex A×4 + AAAA×4, www CNAME, TXT verification), cert verified BEFORE rewrite; console allowlists updated BEFORE URL rewrite | Exact DNS values + current live DNS state (A×4 done, **AAAA missing**, www CNAME done, GitHub TXT present but Verify pending); API cert-state polling; allowlist exact entry shapes for Firebase Auth + GCP referrer restriction |
| HOST-02 | All hardcoded absolute URLs rewritten in one commit — zero mixed-domain refs, grep-verified; github.io dual-hosts then redirects | Verified inventory: **39 functional + 5 prose = 44 refs across 14 files** (CONTEXT said 42 — stale; planner should use grep-acceptance, not a magic number); one-atomic-commit precedent from Phase 06; permanent CI gate design; 301 redirect verified live |
| HOST-03 | Sitemap resubmitted to GSC post-migration (owner console step) | CoA tool mechanics + prerequisites verified from official doc; Domain property creation/verification; resubmit path; 180-day window + cancel/rollback interplay |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| DNS records (A/AAAA/CNAME/TXT) | Owner registrar (Spaceship) | — | Zone lives at registrar; agent can only verify via `Resolve-DnsName` |
| GitHub domain-verification (TXT + Verify click) | Owner console | Agent (verify via GET /pages `protected_domain_state`) | Profile-level setting; agent has read surface only |
| Pages domain + HTTPS enforcement | Agent (gh CLI PUT) | — | D-12: repo Settings equivalent via API; gh session already authenticated |
| TLS certificate | GitHub (Let's Encrypt, automatic) | — | Issued already; renews automatically; CAA must allow letsencrypt.org |
| github.io → apex + www → apex 301s | GitHub Pages edge | — | Platform behavior; verified live this session |
| Firebase Auth authorized domains + API-key referrer restriction | Owner console | — | Firebase/GCP console UI steps; runbook content |
| GSC Domain property + TXT + sitemap resubmit + CoA | Owner console | — | GSC UI steps; same Google account must own both properties |
| URL rewrite (44 refs) + CI gate + smoke/linkinator flips | Repo content + Actions CI | — | Mechanical pass over final content; agent commits |
| Migration verification (smoke-check on new domain) | Agent (script) | Owner (live form test) | `scripts/smoke-check.sh` BASE flip + re-run is the D-09 gate |

## Standard Stack

### Core (no new packages — zero-dependency phase)
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| gh CLI | 2.92.0 `[VERIFIED: gh --version]` | `gh api` calls to Pages REST API (D-12) | Already authenticated in deploy context; no new auth surface |
| Resolve-DnsName | OS built-in | DNS verification on Windows | Explicitly recommended by GitHub docs (dig absent on Windows) `[CITED: docs.github.com managing-custom-domain]` |
| curl | OS/JS-download bundled | HTTP status + redirect + header probes | Already used by smoke-check.sh |
| node | local 26.5.1, CI 24 `[VERIFIED: node --version / deploy.yml:23]` | CI gate script (`scripts/check-no-old-domain.mjs`) | Fits existing `validate:` chain convention (`i18n-keycheck.mjs`, `i18n-detect.test.mjs` are node scripts) |

### Supporting
| Tool | Purpose | When |
|------|---------|------|
| html-validate 11.12.0, linkinator 8.1.0 (existing devDeps) | Unchanged; linkinator skip string flips to new domain | Same commit as rewrite |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| gh CLI PATCH-style domain set | Owner Settings UI | D-12 locked gh; UI adds owner toil and loses scripted verify |
| `PATCH /pages` | `PUT /pages` | PATCH is the **old** endpoint; current docs specify PUT `[VERIFIED: docs.github.com/en/rest/pages/pages]` |
| bash grep CI gate | node script | grep not runnable locally on Windows pwsh; node script runs in CI (ubuntu/node24) and locally (node 26), matches repo convention |

**Installation:** nothing to install. No npm deps added or bumped.

**Version verification:** no external packages this phase — npm registry checks not applicable. Tool availability audited below.

## Package Legitimacy Audit

No packages installed in this phase (zero-dependency; devDependencies unchanged). No registry checks required. Disposition: **none**.

## Migration State Reality Check (CRITICAL — probed live this session)

Plan **must not re-do** what is already done, and must **re-verify** state at execution start (it changed between planning sessions):

| Surface | Expected by old plan | Verified live state (2026-09-07) | Remaining work |
|---------|---------------------|----------------------------------|----------------|
| Domain registration | Owner to register | Registered (registrar: Spaceship, `launch1.spaceship.net` SOA) | none |
| Apex A×4 | Owner to add | ✅ 185.199.108–111.153 `[VERIFIED: Resolve-DnsName output]` | none |
| Apex AAAA×4 | Owner to add | ❌ **missing** (SOA authority answer, no AAAA) | owner DNS add ×4 |
| www CNAME | Owner to add | ✅ → `persano.github.io` (TTL 1799) | none |
| GitHub verification TXT | Owner to add | ✅ `_github-pages-challenge-persano` TXT resolves (TTL 3600) | none (keep record) |
| Domain-verify click | Owner to verify | `protected_domain_state: null` → **Verify not yet clicked** | owner: profile Settings → Pages → Verified domains → Verify |
| Pages domain set | Agent via gh | ✅ already set: `cname: "geohisttrivia.com"`, cert approved apex+www, expires 2026-12-06 | none |
| HTTPS enforce | Agent via gh | `https_enforced: false` | agent: PUT after cert check |
| github.io → apex 301 | Platform | ✅ live, path-preserving | none |
| www → apex 301 | Platform | ✅ live | none |
| Firebase Auth authorized domains | Owner to add | **Unknown** (console, not probeable) | owner runbook step, BEFORE rewrite |
| API-key HTTP-referrer allowlist | Owner to update | **Unknown** (console) | owner runbook step, BEFORE rewrite |
| GSC Domain property + TXT | Owner to create | **Unknown** | owner runbook step |
| URL rewrite | Agent commit | ❌ live site serves old-domain canonicals at new host (mixed state confirmed: `https://geohisttrivia.com/geohist/` → `canonical href="https://persano.github.io/geohist/"`) | the rewrite commit |
| CI old-domain gate | Agent | ❌ absent | build + land with rewrite |
| smoke-check BASE / linkinator skip | Agent | ❌ still old domain | flip in rewrite commit |
| Sitemap resubmit + CoA | Owner post-migration | not started | owner, after smoke green |

**Mixed-domain window hazard (live now):** Googlebot crawling `geohisttrivia.com/geohist/` reads canonical → old URL → 301 → back to apex. Loop resolves via the 301, but canonicals disagree with serving host. Not catastrophic (301 + canonical both exist), but the rewrite commit should land promptly; don't let this state sit for weeks.

**Worth knowing:** who applied the domain/cert (owner directly? prior agent session?) is undocumented in STATE.md. Plan Wave 0 = re-run the probe table above and treat divergence as a stop-and-report.

## Architecture Patterns

### System Architecture Diagram (migration flow)

```
[Owner: registrar Spaceship]
   A×4 (done) + AAAA×4 (TODO) + www CNAME (done) + GitHub TXT (done) + GSC TXT (TODO)
        │
        ▼
[Owner: github.com profile Settings → Pages → Verified domains]  ← Verify click (TODO, TXT already in DNS)
        │
        ▼
[Agent: gh api PUT /pages]  ── https_enforced:true ──▶  cert pre-check: GET /pages → https_certificate.state ∈ {issued, approved}
        │                                                  (already {approved, domains: [apex, www]})
        ▼
[Owner: Firebase console]                                [Owner: GSC]
   Auth → Settings → Authorized domains:                    new Domain property `geohisttrivia.com` (no www)
     + geohisttrivia.com  (keep persano.github.io)          DNS TXT verification → Verify
   GCP Credentials → API key → Website restrictions:        (old URL-prefix property stays, D-08)
     + https://geohisttrivia.com/*                          ↓ (AFTER rewrite + smoke green)
     + https://*.geohisttrivia.com/*                        sitemap resubmit + Change-of-Address (from persano.github.io)
     (keep persano.github.io/* entries)                     pre-move checks: ownership both + 301s ✓
        │                                                   180-day signal window (D-10)
        ▼
[Agent: one atomic commit]  ── 44 refs + 5 headers + CI gate + smoke-check BASE + linkinator skip
        │
        ▼
[CI validate job: html-validate + i18n gates + NEW check-no-old-domain + linkinator]
        │  green
        ▼
[Pages deploy → serves rewritten site at apex]  ──▶ [Agent: smoke-check.sh vs geohisttrivia.com = migration gate]
        │
        ▼
[Owner: GSC sitemap resubmit (new property) + CoA tool]  (HOST-03 / D-09 / D-10)
```

### Recommended CI Gate Design (D-06 — agent's discretion, decided)

**Recommendation: node script in the existing validate chain.**

```jsonc
// package.json scripts (add one line to the chain)
"validate": "npm run validate:html && npm run validate:domain && npm run validate:links && npm run validate:i18n-detect && npm run validate:i18n",
"validate:domain": "node scripts/check-no-old-domain.mjs"
```

- **Option A (bash grep in deploy.yml):** runs on ubuntu CI, but not locally on Windows pwsh; regex/skip plumbing buried in YAML. Rejected.
- **Option B (node script):** matches repo convention (`scripts/i18n-keycheck.mjs` already chained via `validate:i18n`); runs identically local + CI; skip-list is a readable constant; error output lists file:line for each hit.
- **Skip-list:** `.planning/`, `README.md`, `AGENTS.md`, `.git/`, `node_modules/`. Rationale: `.planning/` is historical planning docs (publicly served but out of scope per deferred item); `README.md` line 1 is the repo name `# persano.github.io` (repo is NOT renamed — out of scope, factual identifier); AGENTS.md describes hosting. Everything else containing `persano.github.io` fails the build.
- **Sequencing:** the gate + the rewrite land in the **same commit** (pre-gate commit would fail on the still-old refs). After it merges, Phase 9/10 and future edits can't reintroduce the old domain.

### Runbook Structure (D-11 — owner-facing, `.planning/phases/08-.../08-RUNBOOK.md`)

1. **0 · Current state** — table from "Migration State Reality Check" (what's done, what's yours).
2. **1 · Registrar (Spaceship)** — add **AAAA×4** (the only DNS gap); confirm A×4 + www CNAME + GitHub TXT untouched.
3. **2 · GitHub verification** — profile (avatar → Settings) → Pages → Verified domains → `geohisttrivia.com` → **Verify** (TXT already resolving; may need "Continue verifying"). Keep the TXT record forever.
4. **3 · Firebase console** — Auth → Settings → Authorized domains: add `geohisttrivia.com` (keep `persano.github.io`); GCP console → Credentials → API key → Website restrictions: add both entries (see Allowlist Surfaces). Do NOT remove github.io entries (D-03/D-04).
5. **4 · Search Console** — new **Domain property** `geohisttrivia.com` (no protocol, no www, no path) → DNS record verification (paste the TXT string GSC shows) → Verify. Old property stays (D-08).
6. **5 · What the agent does meanwhile** — cross-ref: gh enforce flip, rewrite commit, smoke-check (owner needs no action here).
7. **6 · Post-migration (owner)** — live contact-form test at `https://geohisttrivia.com/geohist/contact.html`; GSC: submit `https://geohisttrivia.com/sitemap.xml` in the **new** property (D-09); open **Change of Address** in the new property, source = `persano.github.io` (D-10). Tool's pre-move checks confirm ownership + spot-check 301s.
8. **7 · Rollback** — agent: `gh api -X PUT .../pages --input -` with `{"cname":null,"https_enforced":false}` → site returns to persano.github.io in one call; allowlists keep github.io indefinitely so the form survives rollback (D-04). **If CoA was already filed:** cancel it first in the OLD property (GSC requires the 301s removed and reverse redirects added as part of cancel procedure) `[CITED: support.google.com/webmasters/answer/9370220]`.
9. **DNS record table** — see DNS table below (copy verbatim into runbook).

### DNS Record Table (runbook payload — values verified against docs + live zone)

| # | Type | Host/Name | Value | Status | Source |
|---|------|-----------|-------|--------|--------|
| 1–4 | `A` | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | ✅ live | `[VERIFIED: docs.github.com managing page + live Resolve-DnsName]` |
| 5–8 | `AAAA` | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | ❌ **missing — owner adds** | `[VERIFIED: docs.github.com managing page; live AAAA probe returned SOA]` |
| 9 | `CNAME` | `www` | `persano.github.io` (no repo name suffix) | ✅ live | `[VERIFIED: live Resolve-DnsName]` |
| 10 | `TXT` | `_github-pages-challenge-persano` | value GitHub displayed at Add-domain time | ✅ live — **Verify click pending** | `[VERIFIED: live TXT probe + docs verifying page]` |
| 11 | `TXT` | (host GSC specifies, typically `@`) | `google-site-verification=<token from GSC UI>` | ❌ owner adds with Domain property | `[CITED: support.google.com/webmasters/answer/9008080 (DNS record verification)]` |

Notes: no wildcard `*.geohisttrivia.com` records (docs: takeover risk). No extra `A/AAAA/ALIAS` at `@` beyond the 8 (docs: extra records can block cert). If registrar has CAA records, at least one must allow `letsencrypt.org` (probe showed none blocking — cert already issued).

### Allowlist Surfaces (owner console — exact entry shapes)

**Firebase Auth → Settings → Authorized domains** `[CITED: console.google flow; error mapping auth/unauthorized-domain = INVALID_ORIGIN — firebase.google.com/docs/reference/js/auth.md]`
- Add: `geohisttrivia.com` — bare hostname, no scheme/path. Keep `persano.github.io` indefinitely (D-04).
- `www.geohisttrivia.com` as a separate entry: **optional belt-and-braces**. www 301s to apex before any page loads, so the browser Origin seen by Identity Toolkit is the apex only. Adding www costs nothing and hedges exact-match semantics `[ASSUMED: exact-host matching for custom domains; www handling not doc-verified this session]` — decide by live form test at execution.
- Failure shape if missing: `auth/unauthorized-domain` in browser console at form submit.

**GCP console → Credentials → API key → Website restrictions (HTTP referrers)** `[VERIFIED: cloud.google.com/docs/authentication/api-keys — wildcard rules + two-entry pattern]`
- Docs-verified pattern for "allow any URL in your site" = **two entries**:
  - `https://geohisttrivia.com/*` (domain without subdomain, wildcard path)
  - `https://*.geohisttrivia.com/*` (wildcard subdomain, wildcard path)
- Keep the existing `https://persano.github.io/*` entry/entries indefinitely (D-03/D-04).
- Wildcards allowed only as full subdomain or full path segment — never mid-URL (`mysubdomain*.example.com` invalid).
- gcloud/REST updates REPLACE the whole restriction list — the console UI append flow is what the runbook describes; owner should not "re-enter only the new domain" via CLI.
- Failure shape if missing: Identity Toolkit/Firestore REST calls rejected by referrer restriction (network error / permission errors) from the new origin.

**reCAPTCHA domain list** — Phase 9 registers its key against `geohisttrivia.com` only (CONTEXT integration point; nothing to do this phase).

### Pattern: verify-before-flip (HTTPS enforce)

Poll `GET /pages` until `https_certificate.state` is terminal-issued (`issued`/`approved`) with both domains listed, then PUT `https_enforced:true`, then re-GET to confirm. Empirical A/B: a Pages site with `https_enforced:false` (jekyllrb.com, checked this session) serves plain http:// with 200 and no redirect; enforcement is what creates the http→https redirect. Current repo state: cert already `approved` for `["geohisttrivia.com","www.geohisttrivia.com"]` — flip is safe now `[VERIFIED: gh api GET output]`.

### Anti-Patterns to Avoid
- **`DELETE /repos/{owner}/{repo}/pages` for rollback** — that deletes the whole Pages site config (site unpublishes; if DNS still points at GitHub, docs warn of takeover risk until domain re-pointed). Rollback = `PUT` with `cname:null`.
- **Committing a `CNAME` file** — explicitly ignored under Actions publishing; repo Settings/API is the mechanism. CNAME file must not appear (currently absent — keep it absent).
- **Removing github.io from allowlists at cutover** — contradicts D-03/D-04; rollback would break the form.
- **CoA before 301s + before smoke green** — tool pre-move checks will fail or, worse, file a move against a broken state; ordering is locked (D-09/D-10).
- **Chaining site moves / re-running CoA per-subdomain needlessly** — old property has no www variant (www.<user>.github.io isn't a thing); one CoA from `persano.github.io` covers it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Redirect/cert status verification | Custom polling daemon | `gh api GET /pages` + `curl -sI` one-shots in a plan task | Single-shot checks; state is visible; no service to babysit |
| DNS checks | Custom DNS client | `Resolve-DnsName -Type A/AAAA/CNAME/TXT` | Docs-recommended on Windows; worked this session |
| Site-move signal to Google | Hoping 301s "work it out" | GSC Change of Address tool | 180-day signal forwarding, canonical preference — official mechanism `[CITED: answer/9370220]` |
| TLS cert | Any cert tooling | GitHub/Let's Encrypt automatic | Already issued; renews itself; CAA only constraint |
| Mixed-domain regression protection | Nothing / manual greps | `scripts/check-no-old-domain.mjs` in validate chain (D-06) | One small script beats per-PR vigilance; this IS the hand-rolled part, intentionally minimal |

**Key insight:** every "hard" mechanism (DNS→cert→redirect→search signal) is a platform feature already exercised live. The phase's real engineering is ordering discipline + the 44-ref atomic rewrite + a 30-line CI gate.

## Runtime State Inventory

> Migration phase — all 5 categories answered explicitly.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Firestore `messages` collection: contains message docs only, no domain-keyed fields (schema-locked create-only from Phase 04) — **no migration**. Firebase Auth anonymous UIDs: domain-independent. **None requiring change — verified by repo rules + prior phases.** | none |
| Live service config | (1) Firebase Auth authorized-domains list — current contents unknown (console; runbook adds geohisttrivia.com, keeps github.io). (2) API-key HTTP-referrer restriction — runbook adds 2 entries, keeps github.io. (3) GSC: old URL-prefix property exists (D-08 stays); new Domain property to create. (4) GitHub Pages domain — **already set** (`cname: geohisttrivia.com`, cert approved); `https_enforced` still false. (5) reCAPTCHA domain list — nothing exists yet (Phase 9 registers against final domain). | owner console steps (before rewrite); agent gh PUT (before rewrite) |
| OS-registered state | None — no scheduled tasks/launchd/pm2 entries involved. **Verified: no such registrations exist for this repo.** | none |
| Secrets/env vars | None keyed by domain — `js/firebase-config.js` is public-by-design config (v1 decision); no .env; no CI secrets reference the domain. **Verified by repo grep — zero domain-keyed secrets.** | none |
| Build artifacts / installed packages | No `CNAME` file (correct under Actions publishing — absent, verified; must stay absent). No compiled artifacts. Google's index holds old-URL entries — external "artifact" handled by 301s (live) + sitemap resubmit + CoA, not by repo edits. Browser caches: docs note clearing cache after domain changes (transient, owner-facing note only). | keep no-CNAME invariant (CI gate could also assert absence — optional); owner GSC steps |

## Common Pitfalls

### Pitfall 1: Wrong HTTP verb / endpoint for Pages update
**What goes wrong:** plan tasks say `PATCH /repos/.../pages` (old docs, prior training lore); executor copies it and gets 404/405.
**Why it happens:** the endpoint was PATCH years ago; current docs specify `PUT` with body params `cname`, `https_enforced`, `build_type`, `source`.
**How to avoid:** use `gh api -X PUT`; keep prior `GET` baseline + `GET` after each PUT to confirm intended fields changed and others didn't.
**Warning signs:** 404/409/422 from the API; `html_url` still `http://geohisttrivia.com/` with wrong enforce state.

### Pitfall 2: PUT with wrong body shape (source on a workflow site / string "null")
**What goes wrong:** (a) sending `source` alongside `cname` on a `build_type: workflow` site can 422; (b) `gh -f cname=null` sends the literal string `"null"`, not JSON null — the domain may end up as "null" or the call errors.
**How to avoid:** send only the fields needed (`-f cname=geohisttrivia.com`, `-F https_enforced=true` — `-F` for booleans); for rollback use `--input -` with a JSON body `{"cname":null,"https_enforced":false}`. If a PUT 422s, retry including `"build_type":"workflow"` `[ASSUMED: exact 422 conditions; docs list source as optional body param — GET-after-PUT verifies outcome]`.
**Warning signs:** non-204 status; GET shows unchanged/absent fields.

### Pitfall 3: https_enforced before cert is terminal
**What goes wrong:** 400 from the API or a broken HTTPS window.
**Why it happens:** docs — HTTPS availability takes up to ~1h after configure; Enforce toggle up to 24h; provisioning can stall (fix: Remove + re-add domain).
**How to avoid:** poll `https_certificate.state` to `issued`/`approved` first (already `approved` here — verified); only then enforce.
**Warning signs:** `https_certificate.state` ∈ {authorization_pending, dns_changed, errored}.

### Pitfall 4: Form death by allowlist ordering
**What goes wrong:** rewrite deploys before Firebase surfaces updated → form fails at the new domain with `auth/unauthorized-domain` (Auth authorized domains) and/or GCP referrer rejection (API-key restriction).
**Why it happens:** both surfaces are origin-gated; the locked order (allowlists BEFORE rewrite, cert BEFORE rewrite) exists to prevent exactly this.
**How to avoid:** owner console steps (runbook §3) gated as "done" before the rewrite commit; live form test after deploy is part of owner's post-migration checklist.
**Warning signs:** console `auth/unauthorized-domain` = INVALID_ORIGIN; network errors on identitytoolkit/firestore calls from new origin.

### Pitfall 5: linkinator skip flip done wrong (Phase 06 precedent)
**What goes wrong:** after the rewrite, `validate:links` skip still says `--skip "https://persano.github.io"` → every self-link (now geohisttrivia.com) gets crawled live → CI flaky/fails on its own URLs; OR someone "fixes" it with a regex lookahead skip — which under linkinator 8.1.0 matched NOTHING and reported 0 links (the Phase 06 vacuous-gate bug).
**How to avoid:** plain-string skip `"https://geohisttrivia.com"` replacing the old plain-string skip; live self-URL checks stay in smoke-check.sh (Phase 06 decision, already true).
**Warning signs:** linkinator scanning self URLs (slow, flaky); or "0 links" pass (vacuous gate).

### Pitfall 6: Smoke-check passes against the wrong host
**What goes wrong:** smoke-check BASE left at persano.github.io — it still passes (301 target serves the same site) while verifying nothing about the new host.
**Why it happens:** BASE is 1 of the 39 functional refs; easy to miss in a mechanical pass.
**How to avoid:** it's in the inventory table; the post-rewrite run must show `https://geohisttrivia.com/... -> 200` lines (the script prints each URL — planner's verification step greps output for the new host).
**Warning signs:** smoke output URLs prefixed with the old host.

### Pitfall 7: 404 body / custom-404 behavior at the new host
**What goes wrong:** `GET /pages` shows `custom_404: false`; smoke-check expects 404 + "back to the hub" body. Under workflow builds the 404.html serves by convention; the API field may not reflect it (jekyll-era field).
**How to avoid:** treat the smoke-check run as the source of truth (it tests status + body); do not gate on `custom_404` API field.
**Warning signs:** smoke-check FAIL: expected HTTP 404.

### Pitfall 8: CoA cancel/rollback entanglement
**What goes wrong:** rollback after CoA was filed without canceling → Google keeps preferring the new site (180d window) while the site is back on github.io.
**Why it happens:** canceling requires, per docs: remove the forward 301s, add REVERSE 301s, then Cancel Move in the old property.
**How to avoid:** runbook rollback section includes the CoA branch: "if CoA filed → cancel first (needs the agent to unset the Pages domain anyway, which removes the 301s)".
**Warning signs:** GSC notification banners persisting after rollback.

### Pitfall 9: AAAA-less apex stays indefinitely
**What goes wrong:** IPv6-only visitors hit connectivity errors; docs recommend A **in addition to** AAAA (slow global IPv6 adoption is why both).
**Why it happens:** owner added A×4 only.
**How to avoid:** runbook §1 makes AAAA×4 the single DNS TODO; verification probe re-run post-add.
**Warning signs:** `Resolve-DnsName geohisttrivia.com -Type AAAA` returns SOA (observed this session).

### Pitfall 10: Trusting "42 refs" as the acceptance number
**What goes wrong:** plan task says "rewrite 42 refs"; actual grep finds 44 (or a future file adds one) → phantom 2-ref audit or false failure.
**Why it happens:** the 42 figure predates the Phase 06 linkinator-skip rewrite (package.json gained a plain-string skip that is a functional old-domain ref).
**How to avoid:** acceptance = "zero `persano.github.io` matches outside the allowlist (`.planning/`, `README.md`, `AGENTS.md`)" enforced by the new CI gate — not a count.
**Warning signs:** counts that don't reconcile.

## Code Examples

### Agent: read baseline → enforce → verify (gh CLI, exact commands)

```bash
# Source: docs.github.com/en/rest/pages/pages (PUT endpoint, response schema) + live session
# 1. Baseline + cert check (must show https_certificate.state: issued|approved)
gh api repos/persano/persano.github.io/pages

# 2. Enforce HTTPS (cert already approved for apex+www)
gh api -X PUT repos/persano/persano.github.io/pages -F https_enforced=true

# 3. Confirm
gh api repos/persano/persano.github.io/pages
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://geohisttrivia.com/
# expect: 301 -> https://geohisttrivia.com/
```

### Agent: rollback (D-13) — single API call, JSON null via stdin

```bash
gh api -X PUT repos/persano/persano.github.io/pages --input - <<< '{"cname":null,"https_enforced":false}'
```

### CI gate skeleton (D-06, Option B — final code is plan work)

```javascript
// scripts/check-no-old-domain.mjs — fail on persano.github.io outside allowlist
// Source: repo convention (scripts/i18n-keycheck.mjs chain pattern); zero deps
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
const ALLOW = new Set([".planning", "README.md", "AGENTS.md", ".git", "node_modules"]);
const hits = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (ALLOW.has(name)) continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (readFileSync(p, "utf8").includes("persano.github.io")) hits.push(p);
  }
})(".");
if (hits.length) { console.error(`Old-domain refs found:\n${hits.join("\n")}`); process.exit(1); }
console.log("check-no-old-domain: OK");
```

### Owner verification probes (runbook "verify" boxes)

```powershell
Resolve-DnsName geohisttrivia.com -Type A        # expect 185.199.108-111.153 ×4
Resolve-DnsName geohisttrivia.com -Type AAAA     # expect 2606:50c0:8000::153 … 8003::153 ×4
Resolve-DnsName www.geohisttrivia.com -Type CNAME  # expect persano.github.io
Resolve-DnsName _github-pages-challenge-persano.geohisttrivia.com -Type TXT
```

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://persano.github.io/geohist/  # 301 -> https://geohisttrivia.com/geohist/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://www.geohisttrivia.com/       # 301 -> https://geohisttrivia.com/
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `PATCH /repos/.../pages` to set domain/enforce | **`PUT /repos/.../pages`** | current REST docs (api-version header 2026-03-10 shown in docs this session) | All plan commands must use PUT |
| "No 301 from github.io; CoA unusable" (prior PITFALLS.md) | **301 exists, path-preserving, live-verified** | platform behavior (evergreen) | CoA viable; D-10 stands; prior note wrong |
| Prior research "42 refs, 13 files" | **44 refs, 14 files** (39 functional + 5 prose) | counted this session | Plan uses grep-acceptance + inventory table |
| "CNAME file required for custom domain" (community lore) | Ignored/not required under Actions publishing | long-standing docs | keep CNAME file absent |
| HSTS from Pages on custom domains (lore: sticky headers) | **No `strict-transport-security` header sent** (empirical, this repo's live apex) | observed 2026-09-07 | rollback has no browser-pinned-HSTS hazard |

**Deprecated/outdated:** `PATCH` endpoint; treating the old URL-prefix GSC property as deletable; branch-publishing CNAME-file mechanics (inapplicable — `build_type: workflow`).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Firebase Auth authorized-domains matching is exact-host for custom domains (www needs its own entry; no scheme/path) | Allowlist Surfaces | Form works anyway via apex entry + 301; www entry harmless hedge — low risk |
| A2 | `auth/unauthorized-domain` fires for `signInAnonymously()` from an unauthorized domain (not only OAuth popup/redirect flows) | Pitfall 4 | Mitigation identical either way (add domain before rewrite); prior project research asserts it; runbook live form test catches it |
| A3 | GSC Domain-property TXT record value format `google-site-verification=<token>` (host label as GSC UI shows) | DNS table | UI hands the exact string — copy-paste removes ambiguity; near-zero risk |
| A4 | CoA can be opened in the new Domain property with source = old URL-prefix property `persano.github.io` (doc: "open the tool in a property at the domain level"; old property has no path suffix) | Runbook §6 | If tool rejects the old property type, fallback = 301s + sitemap + old-property monitoring only (still sound); planner may add a `checkpoint:human-verify` on the CoA step |
| A5 | PUT /pages with partial body preserves unspecified fields (GET-after-PUT verifies) | Pitfall 2 | Verified behaviorally per PUT via GET; worst case = resend full intended state |
| A6 | jekyllrb.com/danluu.com probes generalize platform behavior (www→apex 301; github.io→custom 301) — corroborated by the same behavior observed on THIS repo live | State of the Art | Already confirmed directly on this repo; none |

## Open Questions

1. **Who/what applied the Pages domain + cert before this research?**
   - What we know: GET shows `cname: geohisttrivia.com`, cert approved (expires 2026-12-06); STATE.md had no record.
   - What's unclear: whether owner did it via UI or a prior session via API; whether any console allowlist step also happened.
   - Recommendation: Wave 0 re-runs the reality-check table + asks owner to confirm runbook §3/§4 status before the rewrite. Never assume console state is unchanged.
2. **`www.geohisttrivia.com` Firebase Auth entry — needed or redundant?**
   - What we know: www 301s to apex before page load; Origin seen by Auth backend is apex.
   - What's unclear: exact match semantics of the authorized-domains checker for subdomains (A1).
   - Recommendation: add it anyway (zero cost) OR decide via live form test; document choice in runbook.
3. **Does `protected_domain_state` flip to `verified` immediately after the owner's Verify click?**
   - What we know: TXT resolves; state currently `null`.
   - What's unclear: propagation lag of the state field.
   - Recommendation: verify-click is an owner step; agent re-GETs /pages as a soft check (non-blocking — takeover protection is the goal, not a deploy gate).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| gh CLI (authenticated) | D-12 Pages API calls | ✓ | 2.92.0 (2026-04-28) | — |
| node (local) | CI gate script dev/run | ✓ | 26.5.1 | npx node/CI node 24 |
| node (CI runner) | validate job | ✓ | 24 (deploy.yml `setup-node`) | — |
| curl | HTTP probes + smoke-check | ✓ | system | — |
| Resolve-DnsName | DNS probes (Windows) | ✓ | OS built-in | dig via WSL |
| Owner: Spaceship registrar access | AAAA×4 add | ✓ (zone live) | — | — |
| Owner: Firebase console access | Auth domains + API-key referrer | ✓ (v1 used it) | — | — |
| Owner: GSC account owning BOTH properties | CoA requirement | ✓ (old property exists) | — | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — all owner-side prerequisites already evidenced (registrar zone live, old GSC property exists, gh authenticated).

## Sources

### Primary (HIGH confidence)
- docs.github.com/en/rest/pages/pages — PUT/GET/DELETE /pages schemas, body params, cert-state enum `[fetched this session]`
- docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site — A/AAAA/CNAME values, apex/www redirect rules, no-CNAME-file-under-Actions, Enforce-HTTPS-24h, Resolve-DnsName recommendation `[fetched]`
- docs.github.com/.../verifying-your-custom-domain-for-github-pages — `_github-pages-challenge-<username>` TXT, profile-level Verify `[fetched]`
- docs.github.com/.../troubleshooting-custom-domains-and-github-pages — ~1h HTTPS availability, remove/re-add fix, CAA letsencrypt.org, extra-records hazard `[fetched]`
- docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https — provisioning flow, mixed content, DNS config table `[fetched]`
- cloud.google.com/docs/authentication/api-keys — referrer wildcard rules + mandatory two-entry pattern `[fetched]`
- support.google.com/webmasters/answer/9370220 — Change of Address: requirements, pre-move checks, 180d window, cancel procedure `[fetched]`
- support.google.com/webmasters/answer/34592 — Domain property syntax (no www, no protocol), DNS-only verification `[fetched]`
- firebase.google.com/docs/reference/js/auth.md — `auth/unauthorized-domain` = `INVALID_ORIGIN` error mapping `[fetched]`
- **Live probes (highest authority for platform behavior):** `gh api repos/persano/persano.github.io/pages` (repo state); `Resolve-DnsName` A/AAAA/CNAME/TXT (DNS state); curl status/redirect probes on persano.github.io, geohisttrivia.com, www, jekyllrb.com/danluu.github.io (platform A/B evidence); response headers (no HSTS)

### Secondary (MEDIUM confidence)
- support.google.com/webmasters/answer/9008080 — DNS record verification details (referenced from 34592; exact TXT string comes from GSC UI) `[not fetched directly]`

### Tertiary (LOW confidence)
- None load-bearing. SLO/sampler claims excluded.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new deps; tools probed live
- Architecture (API/ordering/allowlist shapes): HIGH — official docs fetched + live platform probes on this repo
- Pitfalls: HIGH — several verified empirically (301s, no-HSTS, AAAA gap, linkinator precedent from repo history); A1/A2/A4 carry MEDIUM/ASSUMED tags where noted

**Research date:** 2026-09-07
**Valid until:** ~2026-10-07 (platform mechanics stable; live-state table must be re-probed at execution start regardless)
