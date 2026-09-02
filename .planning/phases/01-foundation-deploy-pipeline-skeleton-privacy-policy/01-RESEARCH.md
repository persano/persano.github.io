# Phase 1: Foundation — Deploy Pipeline, Skeleton, Privacy Policy - Research

**Researched:** 2026-09-01/02
**Domain:** GitHub Pages deploy pipeline (GitHub Actions), static HTML/CSS skeleton, Google Play privacy-policy compliance content
**Confidence:** HIGH (pipeline mechanics), MEDIUM (policy content specifics — need owner inputs)

## Summary

Phase 1 turns a near-empty repo (privacy policy drafts + AdMob `app-ads.txt` + Search Console verification) into a live GitHub Pages site via the official Actions chain, with a Play-critical English privacy policy at `/geohist/privacy.html`. All pipeline mechanics were verified this session from the official `actions/*` repos and the GitHub docs source repo: the four-action chain (checkout → configure-pages → upload-pages-artifact → deploy-pages), required token permissions, hidden-file behavior, and 404 placement. Current versions confirmed via GitHub API: `checkout@v7.0.1`, `configure-pages@v6.0.0`, `upload-pages-artifact@v5.0.0`, `deploy-pages@v5.0.1` (published 2026-09-01), `setup-node@v7.0.0`.

Two hard constraints found. **(1)** Live API shows the repo's Pages `build_type: "legacy"` (Deploy from a branch) — `configure-pages`'s `enablement` input requires a non-GITHUB_TOKEN, so the roadmap's manual prerequisite (Settings → Pages → Source: GitHub Actions) is unavoidable and MUST be a human checkpoint before the first deploy. **(2)** The existing root privacy policy is Spanish, has a placeholder email, and lacks retention/deletion wording — Phase 1 writes a fresh English policy; the contact email, legal-entity naming, and retention period require owner input before that text can be final.

Dev tooling (CI only, no runtime deps): `html-validate` 11.12.0 and `linkinator` 8.1.0, verified directly against `registry.npmjs.org` via REST (local npm CLI is proxy-broken on this machine — `npm view`/`npm ping` 404; CI runners unaffected).

**Primary recommendation:** Two-job workflow (`validate` gates `deploy`), artifact from `path: '.'` + `include-hidden-files: true`, commit `.nojekyll` + `404.html` (self-contained, inline CSS) + minimal hub + English policy; gate first deploy behind the Pages-source human checkpoint and owner-supplied policy facts (email, entity, retention).

## Project Constraints (from AGENTS.md)

Directives with planning authority (copied/condensed — verify against AGENTS.md when in doubt):

- **Tech stack:** plain hand-authored HTML5/CSS3/vanilla ES2020+ JS. Zero build step. No SSG, no framework, no Tailwind.
- **Hosting:** GitHub Pages at `persano.github.io`; GeoHist content under `/geohist/`.
- **Deployment:** push → GitHub Actions CI (validate) → Pages deploy. Chain pinned: `actions/checkout@v7` → `actions/configure-pages@v6` → `actions/upload-pages-artifact@v5` (`path: '.'`, `include-hidden-files: true`) → `actions/deploy-pages@v5`.
- **Dependencies:** Firebase JS SDK via gstatic CDN only — **none of it in Phase 1**. No runtime npm deps; `package.json` exists solely for dev tooling.
- **Compatibility:** modern evergreen browsers; mobile-first responsive.
- **Locked stack decisions (do not re-litigate):** no SSG/SPA; system font stack (no fonts CDN); inline SVG icons; no CSS framework; Firebase modular API only; i18n via JS dictionary swap (Phase 3); consent via load-gating (Phase 4).
- **GSD workflow:** repo edits happen through GSD commands (this research is part of that flow).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OPS-01 | GitHub Actions CI: validation job (html-validate + link check) gates Pages deploy | Two-job workflow pattern, both tool CLIs + flags verified; `needs:` gating shown in official READMEs |
| OPS-02 | Deploy chain checkout@v7 → configure-pages@v6 → upload-pages-artifact@v5 (`path: '.'`, `include-hidden-files: true`) → deploy-pages@v5; `.nojekyll` in first commit | All four actions verified at exact versions via GitHub API; `include-hidden-files` semantics verified from README (dotfiles included, `.git`/`.github` always excluded) |
| OPS-03 | Live URL + privacy URL verified 200 before Play submission; `app-ads.txt` + Search Console verification regress-checked after first deploy | Post-deploy smoke-check pattern (5 URLs incl. an unknown-path 404 check); Pages currently `legacy` — manual prerequisite verified via API |
| CMPL-01 | Privacy policy at `/geohist/privacy.html` — public, non-PDF, English, reachable from every page footer | New `geohist/privacy.html` + footer link pattern; existing Spanish root files identified as superseded source material |
| CMPL-02 | Policy names every SDK in actual use (AdMob, Play Games Services, IAP, Firebase Analytics, contact-form Firestore) with contact mechanism + retention/deletion policy | SDK checklist extracted from existing ES policy (AdMob/Play Games/Billing present; Analytics/Firestore/retention missing → new EN sections); email/entity/retention need owner input |
| CONT-05 | Custom 404 page, self-contained with link back to hub | `404.html` at repo root verified from github/docs; inline-CSS self-containment pattern |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CI validation gate (html-validate + link check) | API/Backend (GitHub Actions runner) | — | Runs in CI, not on Pages; zero client involvement |
| Pages deploy (artifact upload/serve) | CDN / Static (Pages) | API/Backend (Actions) | Official artifact chain; Pages CDN serves |
| Hub skeleton, 404, privacy page | CDN / Static (Pages) | — | Pure static HTML/CSS; no JS needed this phase |
| Privacy policy content (SDK disclosures) | CDN / Static | Human/owner | Content is a legal artifact — owner reviews facts before publish |
| Regression checks on root files | Manual/smoke (curl) | CI | File presence is static; HTTP 200 only meaningful post-deploy |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| actions/checkout | v7.0.1 | Fetch repo in CI | Official; current release 2026-07-20 [VERIFIED: GitHub API releases/latest] |
| actions/configure-pages | v6.0.0 | Pages metadata/bootstrap | Official; release 2026-03-25 [VERIFIED: GitHub API releases/latest] |
| actions/upload-pages-artifact | v5.0.0 | Package site as `github-pages` artifact | Official; release 2026-04-10 [VERIFIED: GitHub API releases/latest] |
| actions/deploy-pages | v5.0.1 | Deploy artifact to Pages via OIDC | Official; release 2026-09-01 [VERIFIED: GitHub API releases/latest] |
| actions/setup-node | v7.0.0 | Node for validate job | Official; release 2026-07-14 [VERIFIED: GitHub API releases/latest] |
| html-validate | 11.12.0 (dev) | Offline strict HTML5 validation gate | De-facto offline validator, GitLab-maintained, docs at html-validate.org [VERIFIED: npm registry REST + official repo] |
| linkinator | 8.1.0 (dev) | Dead-link check (local dir scan spins up static server) | Standard npm link checker, pure JS, CI-friendly flags [VERIFIED: npm registry REST + official repo] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `package.json` + `package-lock.json` | new | Pins devDeps exactly; enables `npm ci` + setup-node cache | Phase 1 (CI reproducibility) |
| `.htmlvalidate.json` | new | Preset config (`html-validate:recommended`) | Phase 1 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| html-validate | vnu-jar (W3C Nu) 26.8.30 | Spec-grade but needs Java in CI (slower, more moving parts). AGENTS.md positions vnu-jar as periodic secondary audit, not the gate. |
| linkinator | lychee (Rust) | Non-npm toolchain; linkinator is pure npm, matches zero-build-adjacent CI simplicity. |
| Two jobs (validate→deploy) | Single job, validate as first step | Two jobs give a distinct red "validate" check and skip deploy entirely on failure; official starter pattern. |

**Installation (dev tooling only, committed for CI):**
```bash
npm install --save-dev html-validate@11.12.0 linkinator@8.1.0
```
(On this machine npm CLI is proxy-broken — see Environment Availability. Generate `package-lock.json` wherever npm works, or have CI produce it.)

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| html-validate | npm | ~8 yrs (mature) | very high (major v11 line) | gitlab.com/html-validate/html-validate [VERIFIED: registry metadata] | OK — see note | Approved |
| linkinator | npm | ~8 yrs (major v8 line) | high | github.com/JustinBeckwith/linkinator [VERIFIED: registry metadata] | OK — see note | Approved |

**Note — seam anomaly (documented, not ignored):** `gsd-tools query package-legitimacy check` returned `SLOP / does-not-exist` for both packages. Direct registry REST this session returned full valid metadata for both (versions 11.12.0 / 8.1.0, repo URLs, no postinstall scripts), and the local `npm` CLI itself 404s on `npm ping` — the seam's probe inherits that machine-level registry connectivity failure. Both packages were previously verified in project research (AGENTS.md stack, 2026-09-01) and are confirmed here via direct registry evidence + official repo/docs presence. Dispositions above stand as Approved; no `checkpoint:human-verify` required for registry existence (CI install is itself the working proof on first run).

**Postinstall check:** `html-validate` and `linkinator` both ship **no** `postinstall` script [VERIFIED: registry `scripts.postinstall` empty for both, this session].

**Packages removed due to [SLOP] verdict:** none (both SLOP verdicts are connectivity false-negatives, overridden above).
**Packages flagged as suspicious [SUS]:** none.

## Architecture Patterns

### System Architecture Diagram

```
[developer push to main]
        │
        ▼
[GitHub Actions: validate job]
   checkout → setup-node (npm ci)
   npx html-validate <explicit .html list>
   npx linkinator . --recurse --skip <externals>
        │  (non-zero exit = fail; deploy skipped)
        ▼
[GitHub Actions: deploy job]  (needs: validate)
   checkout → configure-pages@v6
   upload-pages-artifact@v5 (path: '.', include-hidden-files: true)
        │   artifact 'github-pages' = gzip+tar, dotfiles kept (.nojekyll), .git/.github dropped
        ▼
[deploy-pages@v5]  (pages:write + id-token:write, environment 'github-pages')
        │
        ▼
[Pages CDN: https://persano.github.io]
   /            → minimal hub (links /geohist/privacy.html in footer)
   /geohist/privacy.html → 200 English policy  ← Play Console references this
   /app-ads.txt, /google7da873f4e9609872.html → 200 (regression-critical)
   /404.html    → served for all unknown paths (self-contained)
```

Manual prerequisite (before first deploy): Settings → Pages → Build and deployment → Source: **GitHub Actions** — converts `build_type` from `legacy` to `workflow`. Verified current value via `gh api repos/persano/persano.github.io/pages` → `{"build_type":"legacy"}` [VERIFIED: GitHub API, this session].

### Recommended Project Structure (end of Phase 1)

```
/                          # repo root = site root (user site, no subpath)
├── .github/workflows/
│   └── deploy.yml         # validate job → deploy job (OPS-01/02)
├── geohist/
│   └── privacy.html       # CMPL-01/02 — Play-critical URL
├── css/
│   └── base.css           # shared stylesheet (hub + privacy)
├── index.html             # minimal hub skeleton + footer
├── 404.html               # self-contained (inline CSS) + link home (CONT-05)
├── .nojekyll              # empty file; survives artifact via include-hidden-files
├── app-ads.txt            # EXISTING — must survive (AdMob)
├── google7da873f4e9609872.html  # EXISTING — must survive (Search Console)
├── package.json / package-lock.json  # dev tooling only
└── .htmlvalidate.json     # html-validate preset config
```

**Superseded files (recommend removing in this phase):** `GeoHist_Trivia_Privacy_Policy.html` (Spanish), `.md`, `.pdf` at root — replaced by the English `/geohist/privacy.html`. Leaving them live creates two contradictory public policies (the PDF directly conflicts with the "non-PDF" requirement). See Open Questions (Play Console may already reference the old URL).

### Pattern 1: Two-job gated Pages workflow
**What:** `validate` job (html-validate + linkinator) then `deploy` job with `needs: validate`; deploy job carries only the elevated permissions.
**When to use:** Every push to main.
**Example:** see Code Examples — full YAML assembled from the official `deploy-pages` README + official `static.yml` starter [VERIFIED: both sources].

### Pattern 2: Self-contained 404
**What:** `404.html` at site root with **inline `<style>`**, no external CSS/JS, links to `/` and `/geohist/privacy.html`.
**Why:** Unknown paths may be at any depth; relative asset URLs would break. GitHub Pages serves `/404.html` for all unmatched paths [CITED: docs.github.com "Creating a custom 404 page" — verified from github/docs source repo]. Docs predate Actions-artifact deploys; behavior there is verified empirically post-deploy (success criterion 1 includes the check) [ASSUMED → verified by phase's own smoke test].

### Pattern 3: Load-bearing hidden file
**What:** `.nojekyll` committed in the same commit as the site skeleton; artifact upload uses `include-hidden-files: true`.
**Why:** upload-pages-artifact defaults `include-hidden-files: false` — dotfiles are silently dropped (documented regression source); `.git` and `.github` are always excluded regardless [VERIFIED: actions/upload-pages-artifact README].

### Pattern 4: Privacy page structure (CMPL-01/02 checklist)
Required sections, extracted from REQUIREMENTS + gaps in the existing Spanish policy:
1. Entity identification — Persano / Santiago David Postorivo (+ contact email — owner input)
2. App data: offline-first, local-only storage (source: existing ES policy §2 — reuse wording, translate)
3. SDK inventory — every one of: **AdMob** (advertising ID), **Google Play Games Services** (player profile/achievements/leaderboards), **Google Play Billing** (IAP; financial data handled by Google), **Firebase Analytics** (website, consent-gated — fires only after consent), **Firestore via contact form** (message content submitted when the visitor uses the form)
4. **Retention & deletion:** local app data cleared on uninstall; contact messages retained until handled then deleted (period — owner input); deletion requests via contact channel
5. Third-party policy links (policies.google.com/privacy — already in source material)
6. Changes-to-policy section (already in source material)
7. Contact section (email — owner input; placeholder `[TU_CORREO_ELECTRÓNICO_AQUÍ]` exists today — must not ship)

### Anti-Patterns to Avoid
- **`path: '.'` without `include-hidden-files: true`:** `.nojekyll` silently missing from artifact — hidden-file drop is the known failure mode this input exists to fix [VERIFIED: README].
- **Deploying without the Pages source switch:** `deploy-pages` against a `legacy`-source repo fails; no workflow YAML can fix it with the default token (`enablement` needs PAT-level auth) [VERIFIED: configure-pages action.yml].
- **Publishing placeholder text:** shipping `[TU CORREO ELECTRÓNICO AQUÍ]` or TBD retention in the policy — this URL is read by Play reviewers; treat placeholder leakage as a phase failure.
- **Relative asset paths in 404.html:** breaks at arbitrary unknown-path depths; inline CSS + absolute links only.
- **Running linkinator without `--skip` on externals:** pre-deploy CI then depends on Google's servers; skip external domains in the gate, spot-check them post-deploy.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTML validation | regex/parity checks | html-validate (strict parser, preset rules) | Hand-rolled validation misses void-element/implicit-close/error classes; strict parser is the point [VERIFIED: README examples] |
| Dead-link detection | curl loops | linkinator | Handles redirects, fragments, relative resolution via built-in static server, status-code policies, retries [VERIFIED: README flags] |
| Pages deploy plumbing | tar/gzip + REST API calls | official 4-action chain | Artifact format rules (single gzip>tar, no links, 1GB limit) are enforced for you [VERIFIED: upload-pages-artifact README] |
| CDN-cache busting / Pages enablement | custom scripts | platform behavior | Pages handles cache/limits; source switch is a settings action |

**Key insight:** everything with edge cases in this phase (hidden files, artifact shape, OIDC, 404 serving, link resolution) is already handled by the official chain + two CLI tools. Phase 1 code is content, not machinery.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — repo is pure static files; no databases; no runtime stores [VERIFIED: repo listing + git history] | None |
| Live service config | GitHub Pages currently `build_type: "legacy"`, source branch main/ (user action to switch to GitHub Actions) [VERIFIED: `gh api .../pages` this session]; Search Console property already verified via the HTML file; AdMob `app-ads.txt` already published and registered with Google | User switches Pages source; verify both root files return 200 after first deploy |
| OS-registered state | None — no schedulers/daemons involved | None |
| Secrets/env vars | None — repo has no secrets; workflow uses default `GITHUB_TOKEN` with scoped permissions | None |
| Build artifacts | Old root policy files (`GeoHist_Trivia_Privacy_Policy.{html,md,pdf}`) were uploaded ad hoc ("Add files via upload" commits) and would deploy publicly as-is | Delete in Phase 1 (superseded by EN `/geohist/privacy.html`); confirm no external reference (Play Console) first — see Open Questions |

## Common Pitfalls

### Pitfall 1: First deploy fails — Pages source not switched
**What goes wrong:** `deploy-pages` errors when repo Pages source is "Deploy from a branch" (`build_type: legacy` — the current verified state).
**Why it happens:** `configure-pages` `enablement: true` requires a PAT/App token; the workflow's default `GITHUB_TOKEN` cannot flip the setting [VERIFIED: action.yml description].
**How to avoid:** `checkpoint:human-verify` before the first deploy run; then confirm `build_type: "workflow"` via API.
**Warning signs:** deploy job fails with "Pages site not configured"/source-branch errors while validate is green.

### Pitfall 2: `.nojekyll` (or any dotfile) silently missing from the live site
**What goes wrong:** artifact excludes dotfiles by default → hidden file never deploys.
**Why it happens:** `include-hidden-files` defaults to `false` [VERIFIED: README].
**How to avoid:** set the input; verify `.nojekyll` present in the uploaded artifact or live URL.
**Warning signs:** Pages behaving as if Jekyll processing applies; `.nojekyll` 404 on live site (it does serve as a real file).

### Pitfall 3: html-validate rejecting hand-authored markup
**What goes wrong:** strict parser flags implicit closes, missing `lang`/charset, button types — red CI on first push.
**Why it happens:** `html-validate:recommended` is deliberately strict and non-forgiving [VERIFIED: README].
**How to avoid:** run it locally on the exact file list before committing (or accept CI as the first local-free check); keep the explicit file list in the npm script so `.planning/`/generated files are never scanned.
**Warning signs:** CI red with line/position errors that look cosmetic.

### Pitfall 4: Link check flakiness from external URLs
**What goes wrong:** validation job fails intermittently fetching `policies.google.com` etc.
**Why it happens:** the gate depends on third-party uptime by default.
**How to avoid:** `--skip` external domains pre-deploy; use `--status-code "429:warn" --retry` for resilience [VERIFIED: flags]; full external check stays a post-deploy/manual concern.
**Warning signs:** CI failures on links that load fine in a browser.

### Pitfall 5: Old Spanish policy stays publicly reachable
**What goes wrong:** two live, contradictory privacy policies (one PDF) — undermines CMPL-01 "non-PDF/English" intent and CMPL-04 consistency.
**Why it happens:** `path: '.'` deploys everything committed at root.
**How to avoid:** delete the superseded root files in the same phase; if Play Console already holds the old URL, update it to the new one when submitting.
**Warning signs:** search results / Play Console showing the old path.

### Pitfall 6: Workflow permission drift
**What goes wrong:** deploy fails on missing OIDC permission.
**Why it happens:** deploy-pages requires `pages: write` **and** `id-token: write` on the deploying job [VERIFIED: README Security Considerations].
**How to avoid:** copy the official job-level permissions block; keep top-level at `contents: read` (least privilege).
**Warning signs:** "Resource not accessible by integration"-class errors in deploy job.

## Code Examples

### Complete workflow (`.github/workflows/deploy.yml`)
```yaml
# Source: github.com/actions/deploy-pages README + actions/starter-workflows/pages/static.yml (pinned to verified versions)
name: Validate and deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run validate

  deploy:
    needs: validate
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: '.'
          include-hidden-files: true
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

### `package.json` (dev tooling only) + validation scripts
```json
{
  "name": "persano-github-io",
  "private": true,
  "scripts": {
    "validate": "npm run validate:html && npm run validate:links",
    "validate:html": "html-validate index.html 404.html geohist/*.html",
    "validate:links": "linkinator . --recurse --skip \"^https?://(?!persano.github.io)\" --timeout 10000"
  },
  "devDependencies": {
    "html-validate": "11.12.0",
    "linkinator": "8.1.0"
  }
}
```
(Exact-pin devDeps; `npm ci` enforces lock. The skip regex form is from the linkinator README — "only scan links with a given domain" pattern [VERIFIED: README]. Alternative: repeated `--skip policies.google.com` style flags.)

### `.htmlvalidate.json`
```json
{
  "extends": ["html-validate:recommended"]
}
```
[VERIFIED: html-validate README config example]

### Self-contained `404.html` skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Page not found — Persano</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; display: grid; place-items: center; min-height: 100vh; }
    main { text-align: center; padding: 2rem; }
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>That page doesn't exist.</p>
    <p><a href="/">Back to the hub</a> · <a href="/geohist/privacy.html">Privacy policy</a></p>
  </main>
</body>
</html>
```
(Root placement [VERIFIED: docs.github.com 404 article via github/docs]; self-containment via inline CSS per criterion 1.)

### Post-deploy smoke check (OPS-03)
```bash
for u in \
  "https://persano.github.io/" \
  "https://persano.github.io/geohist/privacy.html" \
  "https://persano.github.io/app-ads.txt" \
  "https://persano.github.io/google7da873f4e9609872.html" ; do
  printf '%s -> %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' "$u")"
done
# plus one unknown path — expect 404 page content linking back to hub:
curl -s https://persano.github.io/does-not-exist | grep -i "back to the hub"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| checkout@v4/configure-pages@v5/upload-pages-artifact@v3 (official starter defaults) | checkout@v7 / configure-pages@v6 / upload-pages-artifact@v5 / deploy-pages@v5.0.1 | v-lines released 2026-03→2026-09 | Starter YAML still shows old majors — pin the verified new ones (OPS-02 already does) |
| setup-node@v4/v5 | setup-node@v7.0.0 | 2026-07-14 | Use v7; `cache: npm` needs committed lockfile |
| deploy-pages v4 | v5.0.1 | 2026-09-01 | v5.0.1 published yesterday — @v5 tag tracks it |
| Branch-source Pages (`build_type: legacy`) | Actions-source (`build_type: workflow`) | setting toggle | Repo currently legacy — switch is the manual prerequisite |

**Deprecated/outdated:** `404.md` + permalink front matter (Jekyll path) — irrelevant under no-Jekyll; use plain `404.html`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Contact email for policy + footer — owner must supply (currently placeholder in source files) | Pattern 4, Open Questions | Policy ships with placeholder → CMPL-02 failure, unprofessional to Play reviewers |
| A2 | Legal-entity naming: "Santiago David Postorivo" as the named entity behind "Persano" | Pattern 4 | Wrong entity in a legal doc; needs owner wording |
| A3 | Retention period for contact-form messages (e.g., "deleted after handling") — owner decides concrete statement | Pattern 4 | Policy/FAQ contradiction later (CMPL-04); wrong commitment |
| A4 | Linkinator exits non-zero on broken links (CI gate behavior) | Standard Stack, workflow | Gate could pass with broken links; verify on first CI run |
| A5 | `404.html` serves on Actions-artifact-source Pages (docs cover branch source) | Pattern 2 | 404 returns Pages default; covered by phase smoke test |
| A6 | Deleting old root policy files is safe (nothing external references them yet) | Runtime State, Pitfall 5 | Play Console holding old URL → broken reference; ask owner |
| A7 | CI `node-version: 24` (current LTS) works for both dev tools | Code Examples | Trivial; any modern Node works |
| A8 | Play policy specifics (active-URL, disclosure requirements) not re-fetched this session (Google domains blocked); checklist derived from project REQUIREMENTS CMPL-01/02 + existing policy drafts | Pattern 4 | Policy misses a Play-required element; owner is final reviewer of the legal text regardless |
| A9 | Hub/privacy content in EN only this phase; `data-i18n` keys deferred to Phase 2 (per phase split) | Structure | If Phase 2 prefers keys from the start, tiny rework |

## Open Questions

1. **What contact email goes in the policy/contact sections?**
   - What we know: existing drafts contain `[TU CORREO ELECTRÓNICO AQUÍ]` / `[TU_CORREO_DE_SOPORTE_AQUI]` placeholders.
   - What's unclear: the real address (and whether it's a domain email vs personal).
   - Recommendation: planner adds a checkpoint:human-verify; block policy finalization on it.
2. **Has Play Console already been given the old policy URL (`/GeoHist_Trivia_Privacy_Policy.html`)?**
   - What we know: app is in review; old files exist at root.
   - Recommendation: if yes, owner updates the field to `/geohist/privacy.html` before submission; deleting old files then is safe.
3. **Retention statement wording** for contact-form messages (and explicit statement that website analytics is consent-gated) — owner wording needed (A3).
4. **Exact entity name form** (A2) — "Santiago David Postorivo" alone, or with "Persano" as product/brand line.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | local checks, CI | ✓ | 26.5.1 local; CI pins 24 | — |
| npm CLI (local registry access) | local install/lock generation | ✗ broken | 11.17.0 | Generate lock in CI or on an unproxied machine; direct REST to registry works, so only local npm CLI is affected |
| gh CLI | API verification, post-deploy checks | ✓ | 2.92.0 | curl |
| git | everything | ✓ | repo on main, remote persano/persano.github.io | — |
| GitHub Pages (Actions source) | deploy | ✗ until user switches | currently `legacy` | None — manual prerequisite, blocking first deploy |
| curl / Invoke-WebRequest | smoke checks | ✓ | — | gh api |

**Missing dependencies with no fallback:**
- Pages source switch (human action, one-time) — blocks first deploy only.
- Owner-supplied policy facts (email/entity/retention) — blocks CMPL-02 final text only; pipeline work proceeds independently.

**Missing dependencies with fallback:**
- Local npm CLI — CI (`npm ci` on GitHub runners) is the real enforcement point; local validation optional until proxy fixed.

## Sources

### Primary (HIGH confidence)
- `gh api repos/actions/upload-pages-artifact/readme` — inputs incl. `include-hidden-files` semantics, artifact constraints
- `gh api repos/actions/deploy-pages/readme` — permissions, environment, OIDC rationale, job pattern
- `gh api repos/actions/starter-workflows/contents/pages/static.yml` — canonical chain, concurrency group
- `gh api repos/actions/configure-pages/contents/action.yml` — `enablement` token requirements
- `gh api repos/github/docs/contents/content/pages/.../creating-a-custom-404-page-for-your-github-pages-site.md` — 404 placement
- `gh api repos/actions/{checkout,configure-pages,upload-pages-artifact,deploy-pages,setup-node,upload-artifact}/releases/latest` — exact versions/dates
- `registry.npmjs.org/{html-validate,linkinator}/latest` — versions 11.12.0 / 8.1.0, repo URLs, empty postinstall
- `gh api repos/{html-validate/html-validate,JustinBeckwith/linkinator}/readme` — CLI flags, config, presets
- `gh api repos/persano/persano.github.io/pages` — current `build_type: legacy`
- Repo files read this session: `app-ads.txt`, `google7da873f4e9609872.html`, `.gitignore`, `GeoHist_Trivia_Privacy_Policy.{html,md}`, REQUIREMENTS/ROADMAP/STATE

### Secondary (MEDIUM confidence)
- AGENTS.md stack section (verified in project research 2026-09-01; reused where it matches this session's registry/API data)

### Tertiary (LOW confidence)
- Google Play policy pages — blocked to all fetchers this session; claims routed to Assumptions A8/owner review

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version from GitHub API / registry REST this session
- Architecture: HIGH — assembled from official action READMEs + starter workflow
- Pitfalls: HIGH for pipeline pitfalls (README-documented); MEDIUM for 404-on-artifact (docs gap, covered by phase smoke test)
- Policy content: MEDIUM — structure solid; concrete facts need owner input

**Research date:** 2026-09-01/02
**Valid until:** 2026-10-01 (pipeline stack stable; re-check action majors if planning slips past then)
