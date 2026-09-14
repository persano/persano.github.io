# Phase 12 — Records

**Created:** 2026-09-13
**Purpose:** CLEAN-04/CLEAN-01/CLEAN-02 evidence records; `.planning/` is publicly served — no secrets.

## 1. Lockfile consistency re-verification (CLEAN-04)

**Executed:** 2026-09-13, fresh executor-run during 12-01 Task 1 (both commands re-run this session; this section records THAT output, not the planner's plan-time run).

### Commands & raw output

```
$ git ls-files package-lock.json
package-lock.json
```

Tracked: `git ls-files` returns the path — the lockfile is in git.

```
$ npm ci --dry-run
up to date in 1s
npm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:
npm warn allow-scripts   chromedriver@152.0.3 (install: node install.js)
npm warn allow-scripts
npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.

43 packages are looking for funding
  run `npm fund` for details
```

Dry-run exit code: **0**.

Observation (warn-only, no action taken): the chromedriver@152.0.3 allowScripts notice is a local
npm script-approval warning. The validate chain never invokes chromedriver (the a11y audit is the
separate `audit:a11y` script, not part of `validate`), and no `--ignore-scripts` flag is added —
adding it would change install semantics for all devDeps.

### Provenance

- `package-lock.json` is tracked in git (see raw output above).
- Lockfile added in commit `f0f56ca` (2026-09-02, "chore: dev tooling lockfile + ignore node_modules", Phase 5).

### Verdict

**package.json and package-lock.json are in sync per npm's own validation** — `npm ci --dry-run`
exited 0 with the "up to date" summary. Verdict dated 2026-09-13.

The research-discrepancy blocker recorded in STATE.md is closed: the researchers who found no
lockfile were correct at Phase-1 time; the Phase-5 lockfile commit (2026-09-02) superseded them
roughly two weeks ago, and today's fresh commands re-verify the committed pair.

Consequence: the three-line lockfile NOTE comment in `.github/workflows/deploy.yml` (lines 24-26)
is confirmed stale by two weeks of repo history and this recorded verdict. Its removal in the same
unit of work (12-01 Task 1, step 4) is justified by this record — comment removal and recorded
verification belong together, never the comment first.

## 2. Post-ship CI verification (CLEAN-01)

**Trigger:** Fill after /gsd-ship pushes the Phase 12 commits to main and the workflow triggers.

### Commands

```
gh run list --limit 2        # get the new run id
gh run watch <run-id> --exit-status   # watch the run to completion
```

### Expectations

Run #1 after the change is an EXPECTED cache MISS: the setup-node log line
"Cache not found for input keys" is designed first-run behavior, not an error —
there is no saved cache to restore yet. The setup-node post step then saves the
npm cache keyed on the package-lock.json hash after a successful job (the cache
key is the lockfile hash, so any lockfile change invalidates the entry by
design). Run #2 restores that cache (cache HIT) and installs faster.

Judge speed on run #2, never run #1.

### Results

| Run ID | validate job | deploy job | cache outcome (MISS-save / HIT) | duration | verdict |
|--------|--------------|------------|---------------------------------|----------|---------|
| (fill from `gh run list`) | (fill) | (fill) | (fill) | (fill) | verdict: pending |
| (fill from `gh run list`) | (fill) | (fill) | (fill) | (fill) | verdict: pending |

**Pass predicate:** validate job green with the lockfile-frozen install + cache input active AND
deploy job green = CLEAN-01's "CI green" criterion satisfied; record the outcomes in the rows
above (initial state: both slots await post-ship evidence). No secrets in this file; it is
publicly served.

## 3. zh variant confirmation (CLEAN-02)

**Executed:** 2026-09-13, fresh executor-run during 12-02 Task 1. Both source trees read verbatim
this session; every claim below carries its file:line evidence. No dictionary or engine file was
modified — this is a documentation-only record.

### (a) Site engine evidence

- `js/i18n.js:28-36` — the `SUPPORTED` array holds exactly one `zh` entry (line 35, in the CJK
  group `'ja', 'ko', 'zh'`) and no `zh-TW` / `zh-Hant` / `zh-CN` entry.
- `js/i18n.js:122` — `DETECT_TABLE` maps `'zh': 'zh'`; no Traditional/region key exists in the
  table.
- `js/i18n.js:105-111` — the table's documented purpose is folding multi-subtag locales to the
  primary subtag: the doc example is `'zh-Hant-CN' -> 'zh'` (line 110). Every browser locale
  reporting a `zh-*` family tag (`zh-TW`, `zh-Hant`, `zh-CN`, `zh-HK`, …) is lowercased, split on
  the first `-` (js/i18n.js:139-141), and folded to `zh` — which resolves to the single zh
  dictionary.

### (b) Dictionary evidence

- `js/i18n/` holds exactly **19 JSON dictionaries** and `zh.json` is the **only** `zh*` file —
  verified by directory listing this session (19 `*.json` files; exactly one match for `zh*.json`).
  Nothing was added in this phase.
- `js/i18n/zh.json` verbatim Simplified samples (lines 2 and 12):
  - `"changelog.back.link": "返回游戏"`
  - `"changelog.meta.title": "最新动态 — 地史知识问答"`
  - The file is 178 keys at the site's exact surface; `npm run validate:i18n` passed after this
    record was written (exit 0, 178 keys × 19 dictionaries set-equality — see verdict below).

### (c) App parity evidence

- `C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/` directory listing:
  `values-zh` is present and there is **no** `values-zh-rTW`, `values-zh-rCN`, or `values-zh-TW`
  directory — the app res tree ships exactly one values-zh.
- `values-zh/strings.xml:3` — `app_name` is `地史知识问答`; line 4 subtitle
  `通过视觉线索推断历史人物与国家`; line 7 win-threshold string `答对10题即可获胜。` — all
  Simplified.
- `shared/src/androidMain/res/xml/locales_config.xml:3-22` — exactly 20 entries with a **single
  bare `zh`** at line 4 (no region/script variants).

### (d) Confirmation statement

**zh is Simplified-only on both sides.** A visitor whose browser reports `zh-TW`, `zh-Hant`, or
`zh-CN` folds via `DETECT_TABLE` to the same `zh` dictionary and receives Simplified Chinese —
this is the documented consequence of the single-URL keyed engine (table-driven primary-subtag
fold, js/i18n.js:110), not a gap. The app ships no Traditional strings (exactly one `values-zh`,
single bare `zh` in `locales_config.xml`), so no Traditional dictionary is added — per the v2.1
roadmap success criterion 3, no `zh-TW` surface is introduced unprompted, and the explicit
Deferred Idea stays out of scope.

### (e) Observation (documented, no action)

The app ships generic `pt` (`values-pt`, also listed bare in `locales_config.xml`) while the site
ships `pt-BR` — established in Phase 3, unrelated to the zh scope of this confirmation. Recorded
so a future reader does not mistake the asymmetry for a zh-only anomaly.

### Verdict

CLEAN-02 closed 2026-09-13: site and app agree on a single Simplified-only zh surface; dictionary
set untouched (19 total, `zh.json` the sole `zh*` file); keycheck green at record time.
