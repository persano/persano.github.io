# Phase 8: Custom Domain Migration - Context

**Gathered:** 2026-09-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the live site from `persano.github.io` to the owner-registered **geohisttrivia.com** (apex canonical): DNS (apex A×4 + AAAA×4, www CNAME, TXT verification), GitHub Pages domain via repo Settings (no CNAME file under Actions publishing), HTTPS cert verified BEFORE the URL rewrite, Firebase console allowlists + Search Console property updated BEFORE the URL rewrite, all 42 hardcoded `persano.github.io` functional URLs rewritten in one commit plus the 5 prose comment headers, permanent CI gate against old-domain regression, owner resubmits the sitemap to a new GSC Domain property post-migration (HOST-01/02/03). Domain name pivot this phase: persano.com was ruled out (owned by third party since 1997) — the site's web identity becomes the game (`geohisttrivia.com`); repo/brand restructure is NOT in scope.

</domain>

<decisions>
## Implementation Decisions

### Domain
- **D-01:** Domain is **`geohisttrivia.com`** — owner will register it. Matches the Play package (`com.persano.geohisttrivia`) and app brand. persano.com rejected (taken since 1997). Owner explicitly pivoted: "build the page for the game". — **Reversibility:** costly — every canonical/og/sitemap/JSON-LD/CI-surface URL and the Firebase/GSC/reCAPTCHA allowlists key off this name; changing later re-runs the entire HOST-02 rewrite plus console passes.
- **D-02:** **Apex canonical** — `geohisttrivia.com` is the host in repo Settings and in all 42 rewritten URLs; `www.geohisttrivia.com` 301-redirects to apex (Pages handles it). Apex DNS: A×4 + AAAA×4 + TXT verification; www: CNAME.

### Transition + Allowlists
- **D-03:** During the github.io dual-hosting/301 period, `persano.github.io` **stays in the Firebase Auth authorized-domains AND the API-key HTTP-referrer allowlist** alongside `geohisttrivia.com` — stale-indexed-URL visitors keep a working contact form. — **Reversibility:** reversible — console list edit.
- **D-04:** github.io stays in the allowlists **indefinitely** (not dropped after a settle window) — referrer-locked to a host that only 301s; zero maintenance. This also guarantees rollback never breaks the form.
- **D-05:** The **5 prose comment headers** referencing `persano.github.io` (`js/i18n.js`, `js/consent.js`, `js/contact.js`, `js/firebase-config.js` file headers + `scripts/smoke-check.sh` header comment) are **rewritten to geohisttrivia.com in the same migration commit** — repo stays grep-consistent, no dead-domain hits.
- **D-06:** **Permanent CI gate** against old-domain regression: a small check in the existing validate job that fails on any `persano.github.io` functional reference outside an allowed skip-list (so Phase 9/10 and future agent edits can't reintroduce the old domain).

### Search Console
- **D-07:** New GSC property is a **Domain property** (`geohisttrivia.com`) verified via DNS TXT — one property covers apex + www. The existing HTML-file verification (`google7da873f4e9609872.html`, URL-prefix property) is the old persano.github.io property's mechanism.
- **D-08:** Old `persano.github.io` URL-prefix property **stays alongside** — watches the 301/index-decay curve. No deletion step.
- **D-09:** Sitemap resubmitted to the new property the **same day the migration verifies** (smoke-check green on geohisttrivia.com) — HOST-03.
- **D-10:** Google **Change-of-Address tool** is used on the new property (from persano.github.io → geohisttrivia.com) once Pages 301s are live — accelerates index transfer alongside the 301s + sitemap resubmit.

### Runbook + Execution Split
- **D-11:** A standalone **owner runbook** ships at `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md` (phase-dir location; note: whole repo is publicly served by the current `upload-pages-artifact` `path: '.'`, so the runbook is visible like every other `.planning` doc — it contains console UI instructions only, no secrets). Owner runs registration + DNS + Firebase console + GSC steps **in parallel from day 1** per ROADMAP's parallelizable hint.
- **D-12:** The agent applies the **Pages domain + HTTPS-enforce via `gh` CLI** (`PATCH /repos/.../pages`), not owner Settings-UI clicks — owner only needs an authenticated gh session (already used for deploys).
- **D-13:** Runbook includes a **documented rollback section**: gh CLI unset-domain → Pages returns to persano.github.io; allowlists keep github.io indefinitely (D-04) so the form keeps working through a rollback. — **Reversibility:** reversible — a single API call.

### the agent's Discretion
- Exact CI-gate implementation shape (node script vs grep step; skip-list mechanism for `google7da873f4e9609872.html`-style unavoidable refs).
- Sitemap `lastmod` policy for the rewritten sitemap entries (bump all, keep, or hybrid).
- smoke-check.sh BASE constant value + linkinator skip-list updates (mechanical, part of the 42).
- Runbook step ordering details and DNS record table format.
- Whether `Enforce HTTPS` toggle flips in the same gh PATCH as domain-set (after cert verified, per locked requirement).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning / Requirements
- `.planning/ROADMAP.md` — Phase 8 goal, 4 success criteria (apex+www HTTPS, zero mixed-domain refs, allowlists-before-rewrite ordering, owner sitemap resubmit), depends-on constraints from Phases 9/10
- `.planning/REQUIREMENTS.md` — HOST-01, HOST-02, HOST-03 exact wording (lines 27–29)
- `.planning/STATE.md` — Locked decision: "No CNAME file under Actions publishing — domain lives in repo Settings; cert verified BEFORE URL rewrite; console allowlists BEFORE rewrite"; Phase 8 blocker (domain name — now resolved as geohisttrivia.com)
- `.planning/PROJECT.md` — Key Decisions table (zero-build, Actions publishing chain, Firebase split)

### Prior Phase Context
- `.planning/phases/07-localization-20-rtl/07-CONTEXT.md` — deferred this phase; Phase 9 (reCAPTCHA key registered against final domain) and Phase 10 (avoid conflicting `geohist/index.html` edits around the rewrite) depend on it

### Code (the rewrite surface)
- `geohist/index.html` (10 refs) — canonical, og:*, twitter:*, JSON-LD `url`+`image`
- `geohist/guide.html`, `geohist/contact.html`, `geohist/changelog.html`, `geohist/privacy.html` (4 refs each) — canonical + og/twitter
- `index.html` (4 refs) — hub page head
- `sitemap.xml` (6 refs) — URL entries
- `robots.txt` (1 ref) — `Sitemap:` line
- `scripts/smoke-check.sh` (2 refs) — header comment (D-05) + `BASE=` constant (functional)
- `js/i18n.js`, `js/consent.js`, `js/contact.js`, `js/firebase-config.js` (1 comment ref each) — file headers only (D-05)
- `.github/workflows/deploy.yml` — Actions publishing chain; `upload-pages-artifact path: '.'` (no CNAME file — domain is repo Settings); where the new CI gate (D-06) hooks into the validate job
- `google7da873f4e9609872.html` — existing GSC URL-prefix verification file; old property stays (D-08), file must keep serving

### External Console Surfaces (owner steps, in runbook)
- GitHub Pages settings (agent via gh CLI per D-12): domain + HTTPS enforce, cert verification status
- Firebase console: Auth authorized domains, API-key HTTP-referrer restrictions (add geohisttrivia.com BEFORE rewrite; github.io stays indefinitely per D-03/D-04)
- Google Search Console: new Domain property + DNS TXT (D-07), sitemap resubmit (D-09), Change-of-Address (D-10)
- Domain registrar: register geohisttrivia.com; apex A×4 + AAAA×4, www CNAME, TXT verification records (HOST-01 DNS shape)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/smoke-check.sh` — post-deploy verification ritual exists; update BASE (the 1 functional ref) and re-run against geohisttrivia.com as the migration-verification gate referenced in D-09
- `scripts/i18n-keycheck.mjs` + existing validate job — CI surface the D-06 old-domain gate joins (no new workflow)
- Existing GSC verification file `google7da873f4e9609872.html` — served unchanged at the new domain; old property needs zero work
- `gh` CLI already authenticated in deploy context — D-12 Pages PATCH uses the same session

### Established Patterns
- One-atomic-commit convention (Phase 06 precedent: page + nav/footer + dictionaries + keycheck in one commit) — HOST-02's 42-ref single-commit rewrite follows it
- Zero build step — CI gate is a plain node script/grep step in the existing validate job, no tooling additions
- Silent-degradation policy — allowlist ordering (cert + allowlists BEFORE rewrite) means the form never breaks during the transition; rollback (D-13) preserves it

### Integration Points
- `.github/workflows/deploy.yml` — domain set via `PATCH /repos/.../pages` (repo Settings, not a CNAME file under Actions publishing — locked); the deploy itself needs no workflow change
- `geohist/index.html` head — canonical/og/twitter/JSON-LD all rewrite together (Phase 10 later adds social-proof markup here; dependency note already in ROADMAP)
- Phase 9 (reCAPTCHA/App Check) — registers its site key against `geohisttrivia.com` only; depends on D-01 being final (it is)
- Search Console — old URL-prefix property (HTML file) + new Domain property (TXT) coexist per D-07/D-08

</code_context>

<specifics>
## Specific Ideas

- Owner rationale recorded verbatim: persano.com "is already a property of someone since 1997... it would be better just to build the page for the game, as that is what we are doing right now. Even the repo naming can change in the future."
- URL pattern for all 42 refs: `https://geohisttrivia.com/...` (apex, no www) — mirrors the current `https://persano.github.io/...` root-style pattern 1:1.
- Migration verification order (from locked STATE decision): DNS → Pages domain set (gh) → cert verified → Firebase/GSC allowlists → URL rewrite commit → smoke-check green on new domain → sitemap resubmit + CoA.

</specifics>

<deferred>
## Deferred Ideas

- **Game-only site focus restructure** — owner signaled the site's identity shifts to the game; actual content/branding restructure (hub de-emphasis, repo rename away from `persano.github.io`) is separate from this phase's mechanical domain migration. Future phase / milestone decision.
- **Public-surface hygiene** — deploy uploads the whole repo (`path: '.'`, include-hidden-files: true), so `.planning/` is publicly served. Excluding internal docs from the artifact is a separate hardening idea, not Phase 8 scope.

</deferred>

---

*Phase: 8-Custom Domain Migration*
*Context gathered: 2026-09-07*
