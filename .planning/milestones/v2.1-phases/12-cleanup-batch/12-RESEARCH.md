# Phase 12: Cleanup Batch - Research

**Researched:** 2026-09-13
**Domain:** GitHub Actions CI reproducibility (`npm ci` + `cache: npm`) + i18n locale edge-case verification (zh variant vs app `strings.xml`; Urdu Nastaliq device check)
**Confidence:** HIGH

## Summary

This phase closes three small debts left from v2.0 and prepares the CI for the gate-heavy phases 13-15. The central discovery: **the research discrepancy recorded in STATE.md is resolved — the lockfile IS tracked in git** and has been since commit `f0f56ca` (2026-09-02, "chore: dev tooling lockfile + ignore node_modules", during Phase 5). The `"no package-lock.json exists yet"` NOTE comment in `deploy.yml` (lines 24-26) is stale by two weeks of repo history. `npm ci --dry-run` executed this session exits 0 ("up to date in 1s"), proving package.json and package-lock.json are in sync by npm's own validation. CLEAN-04 is effectively pre-closed; the plan only needs to re-run the two cheap commands at plan time and record the result (per CLEAN-04's "re-verified at plan time" wording), then delete the stale NOTE comment.

For CLEAN-01, the change is a three-line edit to `.github/workflows/deploy.yml`: add `cache: npm` to the `actions/setup-node@v7` `with:` block, replace `npm install` with `npm ci`, remove the NOTE comment. Setup-node v7 docs (fetched this session) confirm: `cache: npm` caches the package manager's global cache (not `node_modules`), keyed on the lockfile hash, saved by a post-job step that runs only on success — so the first post-change run is a miss+save and the speedup appears from the second run onward. Auto-caching (v5/v6 behavior) does NOT fire here because `package.json` has no `packageManager`/`devEngines.packageManager` field, so the explicit `cache: npm` input is genuinely required. Baseline CI runs (34-39s total for validate+deploy) show the win is primarily **reproducibility** (frozen installs, error on drift), not dramatic speed.

CLEAN-02 confirms from both source trees that `zh` is Simplified-only: the site's single `zh` entry (folded from any `zh-*` browser locale via `DETECT_TABLE`) and its 178-key `zh.json` are Simplified; the app ships exactly one `values-zh` directory (no `values-zh-rTW`/`values-zh-rCN`) with Simplified strings, and `locales_config.xml` lists a single bare `zh`. CLEAN-03 is an owner-device check the agent cannot execute: the RTL flip and `line-height: 2` plumbing are verified in shipped code; what remains is a human visual check of Nastaliq rendering on the deployed site, recorded in a phase UAT file.

**Primary recommendation:** One small plan: (1) re-run lockfile verification commands and record the result, (2) edit `deploy.yml` (`cache: npm` + `npm ci` + remove stale NOTE), (3) push and watch the full pipeline go green, (4) document the zh=Lazy confirmation, (5) issue the owner a precise Urdu device-check script and record its result in `12-UAT.md` when the owner completes it.

## User Constraints (from AGENTS.md + REQUIREMENTS.md)

No `## Decisions` CONTEXT.md exists for this phase (discuss-phase skipped per config `skip_discuss: true`). Constraints below come from AGENTS.md (repo root), `.planning/REQUIREMENTS.md`, and `.planning/STATE.md`.

### Locked / binding constraints

- **Tech stack:** plain HTML5/CSS3/vanilla ES2020+ JS — zero build step, no SSG, no framework; GitHub Pages native.
- **Dependencies:** Firebase JS SDK via gstatic ESM CDN only; no other runtime dependencies; `package.json` exists solely for dev tooling (that is why the lockfile exists and why `npm ci` is safe — everything installed is devDeps).
- **CI chain:** `npm run validate` = `validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n` — do not restructure it in this phase.
- **`.planning/` is publicly served:** no secrets, debug tokens, or private console material in any planning doc (this RESEARCH.md, the plan, and the UAT record included).
- **Old-domain gate:** `scripts/check-no-old-domain.mjs` fails any tracked text file containing the legacy host literal — never write that literal in any new file (deploy.yml edit, UAT record, plan). Phrase the dual-hosts fact as "legacy `*.github.io` Pages host" if ever needed.
- **One atomic commit per unit of work**, conventional-commit subjects. During GSD plan execution code changes stay uncommitted (deferred-commit mode); `/gsd-ship` lands them.
- **Red-gate proof for every gate change** — this phase touches CI config but not gate logic; no gate mutation expected.
- **Supersession-note policy for historical records** — STATE.md blocker lines closed by this phase should be closed with a dated note, not silently deleted.
- **GSD workflow enforcement:** all edits through the GSD plan; no drive-by fixes.

### the agent's Discretion

(None recorded — no CONTEXT.md for this phase. Scope per REQUIREMENTS.md CLEAN-01..04 only.)

### Deferred Ideas (OUT OF SCOPE)

- No `zh-TW` dictionary added unprompted (explicit success criterion 3).
- Adding a `packageManager` field to `package.json` (redundant with explicit `cache: npm`; changes tooling behavior).
- Removing `@axe-core/cli`/chromedriver from devDeps (validate chain doesn't need them, but dependency pruning is out of scope).
- Any change to the validate chain scripts themselves.

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLEAN-01 | `deploy.yml` validate job runs `npm ci` + `cache: npm` — CI green | Exact current state and target diff verified (see Code Examples). setup-node v7 cache semantics fetched from official README + action.yml. Lockfile committed → both inputs are valid. CI baseline: last 3 pipeline runs success, 34-39s total. |
| CLEAN-02 | zh variant confirmed vs app `strings.xml` (Simplified-only documented) | Site `SUPPORTED` + `DETECT_TABLE` + `zh.json` read verbatim this session; app `values-zh/strings.xml` + `locales_config.xml` read verbatim — both Simplified, no zh-TW surface on either side. Confirmation is a documentation task. |
| CLEAN-03 | Urdu Nastaliq owner device check recorded (`dir="rtl"` + line-height on `ur`) | Agent-side mechanics verified in code (`RTL_LANGS`, `applyLanguage` dir flip, `html[lang="ur"]` line-heights). Device check is human-only; exact verification checklist and record format prescribed below. |
| CLEAN-04 | Lockfile consistency re-verified at plan time (closes research discrepancy) | DISCREPANCY RESOLVED: `git ls-files package-lock.json` → tracked; added 2026-09-02 (f0f56ca, Phase 5); `npm ci --dry-run` exit 0. Plan must re-run both commands and record the result, then remove the stale NOTE comment. |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CI reproducibility (npm ci + cache restore) | CI (GitHub Actions workflow) | Repo/manifest tier (package-lock.json in git) | The workflow file owns the install/cache config; the committed lockfile is the data the cache key and `npm ci` depend on. |
| Lockfile consistency verification | Repo/manifest tier (git-tracked manifests) | CI (npm ci fails on drift) | Verification is a local command + record; CI enforces it on every future run for free. |
| zh variant confirmation (Simplified-only) | App locale surface (source of truth) + site i18n engine (delivery) | Documentation (planning record) | The app's `values-zh` + `locales_config.xml` are the ground truth; the site's DETECT_TABLE folds all zh-* to one zh dictionary. |
| Urdu Nastaliq rendering check | Browser tier on owner device (human verification) | Planning docs (record) | Real-device font shaping cannot be executed by the agent; agent verifies the code paths, owner verifies pixels. |
| Stale NOTE removal | CI tier (workflow file) | — | Comment-only deletion; zero YAML semantics change. |

## Standard Stack

No new packages are installed in this phase — this is a config + verification + documentation phase. The relevant "stack" is the existing CI toolchain.

### Core (CI actions — already shipped and pinned in deploy.yml)

| Action/Tool | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| actions/checkout | v7 | Fetch repo | Already pinned, CI-green since Phase 5 |
| actions/setup-node | v7 | Node 24 + npm cache | Already pinned; v7 = ESM internals, "no changes to action inputs, outputs, or behavior" [VERIFIED: setup-node README "What's new in V7"] |
| `cache: npm` input | (setup-node built-in) | Restore/save global npm cache | Documented first-class input; follows actions/cache guidelines [VERIFIED: setup-node README + action.yml] |
| `npm ci` | npm 11.x (bundled with Node 24) | Lockfile-frozen install | npm docs: "meant to be used in automated environments such as test platforms, continuous integration" [VERIFIED: docs.npmjs.com/cli/v11/commands/npm-ci] |

### Existing devDependencies (unchanged — listed for lockfile context)

| Library | Version (package.json, exact) | Locked in package-lock.json |
|---------|---------|--------------|
| @axe-core/cli | 4.13.0 | 4.13.0 ✓ |
| html-validate | 11.12.0 | 11.12.0 |
| lighthouse | 13.4.1 | 13.4.1 |
| linkinator | 8.1.0 | 8.1.0 |
| sharp | 0.35.4 | 0.35.4 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Explicit `cache: npm` input | Add `packageManager` field to package.json (v6 auto-caching) | Redundant after the explicit input; adding the field changes corepack/tooling behavior — rejected, keep minimal diff |
| `npm ci` | `npm install` + `npm ci --only=prod`… | None viable: `npm ci` is the documented CI standard with a committed lockfile [VERIFIED: setup-node README §Working with lockfiles] |
| Manual actions/cache step | setup-node built-in `cache: npm` | Hand-rolled cache keys invite drift; built-in handles key + save + restore |

**Installation:** none — zero new packages (see Package Legitimacy Audit).

## Package Legitimacy Audit

> Not applicable this phase: no external packages are installed. All five devDependencies are already committed, locked (package-lock.json, 3640 lines), and CI-proven green since Phase 5.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| (none — no installs this phase) | — | — | — | — | — | — |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

Observation (no action): `chromedriver@152.0.3` is a transitive dep of `@axe-core/cli` (spec `latest` inside that package's deps). Local npm 11.17.0 warns "1 package has install scripts not yet covered by allowScripts" on `npm ci --dry-run` (exit 0, warn-only). The validate chain never invokes chromedriver (the a11y audit is the separate `audit:a11y` script, not in `validate`). No action in this phase; do not add `--ignore-scripts` (changes install semantics for all devDeps).

## Architecture Patterns

### System Architecture Diagram

```
push to main / workflow_dispatch
        │
        ▼
┌─────────────────────────┐
│ validate job (ubuntu)   │
│  checkout@v7            │
│  setup-node@v7          │
│   ├─ node 24 install    │
│   └─ cache: npm         │──(post, success-only)──► save ~/.npm cache keyed on package-lock.json hash
│  npm ci                 │◄── restore ~/.npm cache (hit from 2nd run on)
│  npm run validate       │
│   ├─ validate:html      │
│   ├─ validate:domain    │
│   ├─ validate:links     │
│   ├─ validate:i18n-detect│
│   └─ validate:i18n      │
└──────────┬──────────────┘
           │ needs: validate
           ▼
┌─────────────────────────┐
│ deploy job (Pages)      │
│  configure-pages@v6     │
│  upload-pages-artifact@v5│
│  deploy-pages@v5        │
└─────────────────────────┘
```

Decision points: cache hit (2nd+ run) vs miss (first run / lockfile change); validate failure aborts deploy (unchanged).

### Pattern 1: Lockfile-frozen CI install
**What:** `npm ci` installs exactly what the committed lockfile pins, errors on package.json/lockfile drift, never writes either file.
**When to use:** every CI run with a committed package-lock.json — this repo's case since 2026-09-02.
**Example:**
```yaml
# Source: docs.npmjs.com/cli/v11/commands/npm-ci + github.com/actions/setup-node README
- uses: actions/setup-node@v7
  with:
    node-version: 24
    cache: npm
- run: npm ci
- run: npm run validate
```
npm ci verified behaviors [VERIFIED: docs.npmjs.com/cli/v11/commands/npm-ci, fetched 2026-09-13]:
- "The project **must** have an existing `package-lock.json` or `npm-shrinkwrap.json`."
- "If dependencies in the package lock do not match those in `package.json`, `npm ci` will exit with an error, instead of updating the package lock."
- "It will never write to `package.json` or any of the package-locks: installs are essentially frozen."
- "If a `node_modules` is already present, it will be automatically removed before `npm ci` begins its install."

### Pattern 2: Verify-then-record (CLEAN-04's "recorded at plan time")
**What:** the plan carries the two verification commands and an explicit slot (task/acceptance) where their output is recorded; the result closes the STATE.md discrepancy with a dated supersession note.
**Evidence already gathered this session (2026-09-13):**
```
$ git ls-files package-lock.json
package-lock.json                      ← tracked
$ npm ci --dry-run
up to date in 1s
EXIT=0                                 ← npm's own sync validation PASSED
```
Commit provenance: lockfile added in `f0f56ca` "chore: dev tooling lockfile + ignore node_modules" (2026-09-02, Phase 5). The "no lockfile" researchers were correct at Phase-1 time; the Phase-5 commit superseded them.

### Pattern 3: Owner checkpoint record (CLEAN-03)
**What:** the agent ships a precise checklist + record template; the owner executes on-device and the result lands in a phase UAT file (convention: `NN-UAT.md`, used by every phase since Phase 2 — `06-UAT.md` … `10-RUNBOOK.md` precedent).
**When to use:** any check requiring hardware/human perception (fonts, touch, rendering).

### Anti-Patterns to Avoid
- **Hand-editing package-lock.json** to "fix" the caret/exact metadata drift — `npm ci` accepts the lockfile as-is; only `npm install`/`npm update` should rewrite it.
- **Adding `cache-dependency-path` needlessly** — single root lockfile; the README's basic usage omits it (wildcard paths are for monorepos).
- **Adding a `packageManager` field** to get "auto-caching" — redundant and changes local tooling behavior.
- **Removing the NOTE comment as a drive-by before the lockfile verdict is recorded** — the comment removal and the recorded verification belong to the same task (success criterion 2 ties them).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CI dependency caching | Manual actions/cache step with hand-computed keys | setup-node `cache: npm` | Built-in keys on lockfile hash, saves in post step, restores automatically [VERIFIED: action.yml — post: dist/cache-save/index.js, post-if success()] |
| package.json ↔ lockfile sync check | Custom node/grep diff script | `npm ci --dry-run` | npm's own validation — errors on any real drift; exit code is the verdict [VERIFIED: npm ci docs + session run] |
| zh language folding logic | New mapping code/table | Existing `DETECT_TABLE` (`'zh': 'zh'` entry) | Already folds zh-Hant-CN→zh etc.; verified in source [VERIFIED: js/i18n.js:110,122] |
| Urdu RTL plumbing check | New test script | Code reading + owner device checklist | Mechanism is 2 assignment sites + 3 CSS rules — verification is visual, not automatable |

**Key insight:** every automation this phase needs is a one-liner of an existing tool (setup-node cache input, npm ci itself, the keycheck). The phase's value is evidence discipline, not new machinery.

## Runtime State Inventory

Phase is CI config + verification + docs — not a rename/refactor. Categories checked anyway for completeness:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — verified (`git ls-files` shows no runtime datastores in this repo; Firestore holds contact messages, unaffected by CI config). | none |
| Live service config | GitHub Actions workflow — but it lives IN git (this phase edits it directly). GitHub Pages deploy config is repo-driven (`configure-pages`). No out-of-git service config involved. | none |
| OS-registered state | None — verified (no schedulers/pm2/launchd involved). | none |
| Secrets/env vars | None added or changed. deploy.yml keeps `permissions: contents: read` + Pages-scoped job permissions. `.planning/` public-serving rule: the UAT record will contain only device model/browser/OS — no secrets. | none |
| Build artifacts | Local `node_modules/` is gitignored (`.gitignore:4`, verified via `git check-ignore`) — `npm ci` removes and rebuilds it anywhere it runs; no stale artifact. The stale NOTE comment in deploy.yml is repo text, removed in-task. | remove stale comment (in-task) |

## Common Pitfalls

### Pitfall 1: First CI run after the change is a cache MISS
**What goes wrong:** adding `cache: npm` does not make run #1 faster — the post step (`dist/cache-save/index.js`, `post-if: success()`) saves the cache after a successful run; restore only hits from run #2.
**Why it happens:** cache save happens post-job; there is nothing to restore on first execution.
**How to avoid:** judge speed on the second run after the change; record run #1 as expected-miss in the plan evidence.
**Warning signs:** "Cache not found for input keys" log line on the first run — expected, not an error.

### Pitfall 2: Cache key is the lockfile hash
**What goes wrong:** any package-lock.json change invalidates the cache entry.
**Why it happens:** that is the designed invalidation signal.
**How to avoid:** nothing to do — just expect a one-run miss after any dependency bump.
**Warning signs:** slower run immediately following a lockfile edit.

### Pitfall 3: `npm ci` locally deletes `node_modules/`
**What goes wrong:** executor runs `npm ci` locally and the existing node_modules is removed before reinstall (npm docs: automatic removal).
**How to avoid:** fine in CI; locally it just means a fresh install (~seconds for 5 devDeps). Use `--dry-run` for the pure consistency check (that is what the plan-time re-verification should use).
**Warning signs:** local a11y/lighthouse scripts need re-running binaries — reinstall restores them.

### Pitfall 4: The caret/exact metadata drift in the lockfile root
**What goes wrong:** package.json pins devDeps exactly (`"4.13.0"` etc.) but the lockfile root snapshot records carets (`^4.13.0`, `^13.4.1`, `^0.35.4`) [VERIFIED: package.json:15-21 vs package-lock.json:8-14].
**Why it happens:** package.json was pinned after the lockfile was generated; npm never rewrites the root metadata on `ci`.
**How to avoid:** accept it — `npm ci --dry-run` exit 0 proves the resolved tree satisfies package.json; a future local `npm install` will normalize the metadata on its own. Do not hand-edit the lockfile.
**Warning signs:** none in CI; the dry-run is the check.

### Pitfall 5: Removing YAML comments can tempt renumbering
**What goes wrong:** editing deploy.yml lines 24-26 (comment) and line 27 (`npm install`) in one pass may tempt reordering steps.
**How to avoid:** the change is exactly: delete lines 24-26, replace `- run: npm install` with `- run: npm ci`, add `cache: npm` under `with:`. Nothing else moves.
**Warning signs:** diff shows any line beyond those three areas.

### Pitfall 6: zh-TW visitors get Simplified — by design
**What goes wrong:** a zh-TW/zh-Hant browser locale folds to `zh` via DETECT_TABLE ('zh-Hant-CN' → 'zh' documented example) and receives the Simplified dictionary.
**Why it happens:** single zh dictionary, table-driven fold — the shipped architecture.
**How to avoid:** document it; do NOT add a zh-TW dictionary unprompted (explicit success criterion + app ships no Traditional strings for parity).
**Warning signs:** reviewer asks "why is 简体 text shown for zh-TW?" — answer: documented fold, app parity.

### Pitfall 7: Device check must run against the deployed site (or a local server), never file://
**What goes wrong:** opening the HTML via file:// on the device — the i18n dictionary fetch (`/js/i18n/ur.json`) is same-origin relative and silent-degrades, so the page stays EN and the check is meaningless.
**How to avoid:** use `https://geohisttrivia.com` directly on the device (or `npx http-server`/`python -m http.server` if local testing is ever needed).
**Warning signs:** switcher select shows the endonym but text doesn't change → dictionary fetch failed → check URL scheme.

### Pitfall 8: The switcher is the only lang-override path
**What goes wrong:** there is no `?lang=` query param; language is `localStorage.persano.lang` > navigator.languages match > en.
**How to avoid:** the owner device check must use the footer `<select>` endonym اردو (value `ur`) — persistence then carries ur across pages.
**Warning signs:** switching "doesn't stick" on some page → that page lacks the footer slot (should not happen on keyed pages; check which page was used).

### Pitfall 9: RECORDING the check — mechanical predicate
**What goes wrong:** "looks fine" is not a record.
**How to avoid:** `12-UAT.md` rows must be per-criterion with `result: pass` or `result: issue`; any issue = blocker (AGENTS.md mechanical predicate); closing the STATE.md blocker uses a dated supersession note.
**Warning signs:** record without device model/browser/OS is incomplete.

### Pitfall 10: `deploy.yml` is also guarded by the old-domain gate
**What goes wrong:** any new comment/text containing the legacy host literal fails `validate:domain`.
**How to avoid:** the edit touches none of that; new planning docs (this file, plan, UAT) must also avoid the literal — phrase dual-hosts as "legacy `*.github.io` Pages host".

## Code Examples

### Target state of the validate job (CLEAN-01 exact diff)

Current [VERIFIED: .github/workflows/deploy.yml:17-28]:
```yaml
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
      # NOTE: `npm install` + no cache input — no package-lock.json exists yet (local npm
      # CLI is proxy-broken; research "Environment Availability"). Restore `npm ci` +
      # `cache: npm` once a lockfile is committed.
      - run: npm install
      - run: npm run validate
```

Target:
```yaml
# Source: github.com/actions/setup-node README (Caching packages data) + action.yml
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
```

Changes: (1) delete NOTE comment lines 24-26 (stale — lockfile committed 2026-09-02), (2) add `cache: npm` inside setup-node `with:`, (3) `npm install` → `npm ci`. Optional (recommended-optional, not required): add `cache-dependency-path: package-lock.json` for explicitness — README basic usage omits it for a single root lockfile.

Note: setup-node v7's v6-era breaking change means explicit `cache: npm` is REQUIRED here (auto-caching only fires with a `packageManager`/`devEngines.packageManager` field, which package.json lacks [VERIFIED: package.json:1-22]).

### Plan-time lockfile re-verification (CLEAN-04)

```bash
git ls-files package-lock.json   # expect: package-lock.json
npm ci --dry-run                 # expect: exit 0, "up to date" — record both in the plan/summary
```

### CLEAN-02 confirmation record (already gatherable verbatim)

| Surface | Evidence | Value |
|---------|----------|-------|
| Site language list | js/i18n.js:28-36 | `'en', 'es', 'pt-BR', 'fr', 'de', 'it', 'nl', 'pl', 'tr', 'vi', 'id', 'ru', 'el', 'hi', 'bn', 'ar', 'ur', 'ja', 'ko', 'zh'` — single `zh`, no `zh-TW` |
| Site zh-* fold | js/i18n.js:110, 122 | `'zh-Hant-CN' -> 'zh'`; `'zh': 'zh'` in DETECT_TABLE |
| Site zh dictionary | js/i18n/zh.json:2-12 | Simplified: `"changelog.back.link": "返回游戏"`, `"changelog.meta.title": "最新动态 — 地史知识问答"`; 178 keys; `npm run validate:i18n` PASS |
| App locale dirs | shared/src/androidMain/res/ | `values-zh` present; NO `values-zh-rTW`, `values-zh-rCN`, `values-zh-TW` |
| App zh strings | values-zh/strings.xml:3-9 | `地史知识问答` (app_name), `通过视觉线索推断历史人物与国家` (subtitle), `答对10题即可获胜。` — Simplified |
| App per-app-language list | shared/src/androidMain/res/xml/locales_config.xml:3-22 | 20 entries: en, zh, hi, es, fr, ar, bn, ru, pt, ur, de, it, tr, el, ja, ko, vi, id, pl, nl — single bare `zh` |

Documented nuance (observation only, no action): the app ships generic `pt` (`values-pt`) while the site ships `pt-BR` — established Phase 3; unrelated to CLEAN-02's zh scope.

### CLEAN-03 owner device-check checklist (agent side verified; owner side executes)

Code plumbing verified this session:
- `RTL_LANGS = { 'ar': 1, 'ur': 1 }` [VERIFIED: js/i18n.js:43]
- `document.documentElement.dir = RTL_LANGS[lang] ? 'rtl' : 'ltr'` in the same pass as lang sync [VERIFIED: js/i18n.js:91]
- `html[lang="ur"] body { line-height: 2; }` and `html[lang="ur"] h1, h2, h3 { line-height: 1.9; }` [VERIFIED: css/base.css:667-675]; `[dir="rtl"]` block intentionally empty as seed [VERIFIED: css/base.css:657-659]
- `js/i18n/ur.json` exists, 178 keys, keycheck PASS [VERIFIED: session keycheck output]

Owner checklist (real device, Chrome on Android; open `https://geohisttrivia.com` — never file://):
1. Footer language switcher → اردو (`ur`).
2. Verify direction: content flips RTL — text right-aligned, nav/footer/lists mirrored (logical properties carry the mirror), `<html dir="rtl" lang="ur">`.
3. Verify line-height: body text at ~2.0 and headings at ~1.9 — no clipped ascenders/descenders; comfortable multi-line Urdu.
4. Verify Nastaliq rendering: Urdu displays in flowing Nastaliq script (Android system font), letters correctly joined, no tofu/box glyphs, no isolated-letter fallback.
5. Record in `.planning/phases/12-cleanup-batch/12-UAT.md`: date, device model, Android version, browser version, per-criterion `result: pass|issue`, optional screenshots; close the STATE.md blocker line with a dated supersession note; annotate the broken-windows ledger entry (`07-01-SUMMARY.md` notes it rides `.planning/WINDOWS.md`).

If the check finds real issues (e.g., clipping): record `result: issue` (mechanical blocker per AGENTS.md) — the fix (a CSS tweak in the same ur rules) is small enough to loop inside the phase, then the device check re-runs.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `npm install` in CI | `npm ci` (frozen install, errors on drift) | npm docs standard (npm 5.7+ era; current docs v11) | Reproducible CI installs; drift fails loudly instead of silently rewriting the lock |
| No cache input in setup-node | `cache: npm` input | setup-node v3+ feature; v5 (2025) enabled caching by default with package-manager detection; v6 narrowed npm auto-caching to a `packageManager`/`devEngines.packageManager` field | Explicit input still required for repos without those fields — this repo's case |
| "No lockfile yet" era (Phase 1) | Lockfile committed + CI-green since Phase 5 (f0f56ca, 2026-09-02) | 2026-09-02 | CLEAN-04 resolves with evidence; NOTE comment removal justified |

**Deprecated/outdated:**
- The deploy.yml NOTE comment: stale by 2 weeks — removed in this phase (success criterion 2).
- The STATE.md Blockers line "researchers disagreed on lockfile" — superseded by this research (planner re-runs commands at plan time and closes with a dated note).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Owner's "real device" is an Android device (Nastaliq system font expected — Noto Nastaliq Urdu) | CLEAN-03 | Low: roadmap says "owner's real device" and the app is Android; the plan's checkpoint should confirm device type when handing the checklist to the owner |
| A2 | setup-node resolves the repo-root package-lock.json as the default cache-dependency-path when the input is unset | Architecture Patterns | Very low: single-root lockfile is the basic README case; adding an explicit path is a 1-line fallback if ever needed |
| A3 | npm-ci speed gain is modest (baseline pipeline 34-39s total; install is only part of the validate job) — reproducibility is the primary win | Summary / CLEAN-01 | Low: expectation-setting only; green pipeline is the criterion, not a time target |
| A4 | CI's bundled npm does not block chromedriver's postinstall via any script-approval policy (local npm 11.17.0 warns via allowScripts but proceeded, exit 0) | Package Legitimacy Audit | Very low: validate chain never needs chromedriver |

## Open Questions

1. **Owner device availability / type for CLEAN-03**
   - What we know: roadmap phrases it as "the owner's real device"; the app is Android; no other constraint recorded.
   - What's unclear: whether the owner will use an Android phone or tablet, and its OS/browser versions (record fields).
   - Recommendation: planner makes it a `checkpoint:human-verify` task with the checklist above; owner fills the record fields.

2. **If the Urdu device check finds a rendering issue**
   - What we know: the CSS targets ur body (2.0) and h1-h3 (1.9); Phase 7 chose these values deliberately.
   - What's unclear: whether the owner's device shows any clipping/shaping problem — the entire point of the check.
   - Recommendation: if an issue appears, record `result: issue` and loop a small CSS fix (line-height bump or `font-family` hint) within the phase; re-run the device check. Keep the fix inside the same phase only if trivial; otherwise a follow-up todo.

3. **Explicit `cache-dependency-path`?**
   - Recommendation: omit — single root lockfile, README basic usage omits it; explicit path is harmless but adds a line for no benefit here.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| git | lockfile tracking re-verification | ✓ | 2.55.0.windows.3 | — |
| npm (local) | `npm ci --dry-run` consistency proof | ✓ | 11.17.0 (historical "proxy-broken" note is obsolete — dry-run succeeded) | — |
| node (local) | keycheck re-run spot checks | ✓ | 26.5.1 (CI pins 24 via setup-node; no engines field conflicts) | — |
| gh CLI | baseline `gh run list` + watching the post-change run | ✓ | authenticated (run list returned 3 green runs) | GitHub web Actions tab |
| Android device + Chrome | CLEAN-03 owner check | owner-provided | recorded at check time | none (owner step) |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none.

## Sources

### Primary (HIGH confidence)
- [VERIFIED: session commands] `git ls-files package-lock.json` (tracked), `git log --diff-filter=A` (f0f56ca, 2026-09-02), `npm ci --dry-run` (exit 0), `npm run validate:i18n` (PASS, 178-key surface ×19), `gh run list` (3 green runs, 34-39s), `git check-ignore node_modules` (ignored, .gitignore:4)
- [VERIFIED: repo files read this session] `.github/workflows/deploy.yml:17-48` · `package.json:1-22` · `package-lock.json:1-14` · `js/i18n.js:20-139` · `css/base.css:640-681` · `js/i18n/zh.json:2-12` · `GeoHist-Trivia/shared/src/androidMain/res/` directory listing · `values-zh/strings.xml:3-15` · `res/xml/locales_config.xml:3-22`
- [VERIFIED: github.com/actions/setup-node README + action.yml, fetched 2026-09-13] caching section, lockfile guidance, v5/v6/v7 behavior, cache input/outputs, post-step save-on-success
- [VERIFIED: docs.npmjs.com/cli/v11/commands/npm-ci, fetched 2026-09-13] npm ci semantics (frozen install, error on mismatch, node_modules removal)

### Secondary (MEDIUM confidence)
- `.planning/milestones/v2.0-phases/07-localization-20-rtl/` PLAN/SUMMARY records (Phase 7 shipped the RTL/line-height plumbing; owner device check deferred as documented blocker)

### Tertiary (LOW confidence)
- Font-level details (Noto Nastaliq Urdu as Android system font for ur) — training knowledge, [ASSUMED A1]; does not affect the check itself (the check observes whatever the device renders)

## Metadata

**Confidence breakdown:**
- CLEAN-01/CLEAN-04 (CI + lockfile): HIGH — every claim verified from live repo state + official setup-node/npm docs fetched this session
- CLEAN-02 (zh variant): HIGH — both source trees read verbatim (site js/i18n/* + app values-zh + locales_config)
- CLEAN-03 (Urdu device check): MEDIUM — code plumbing verified HIGH; the device rendering itself is the owner step (that is the phase's purpose)
- Pitfalls: HIGH for repo-verified items; cache first-run behavior VERIFIED from action.yml `post-if: success()`

**Research date:** 2026-09-13
**Valid until:** 2026-10-13 (config-only domain; setup-node major versions pinned — stable)
