---
phase: 03-i18n-engine-es-pt-br-dictionaries-switcher
plan: 02
subsystem: site-i18n
tags: [i18n, pt-br, dictionary, ci-gate, regression-battery, deploy-handoff]
requires:
  - Plan 03-01 artifacts: js/i18n.js engine (pt-* → pt-BR folding), js/i18n/es.json (102 keys), scripts/i18n-keycheck.mjs, defer-script wiring on the 3 keyed pages
  - Phase 2 data-i18n key surface (99 markup keys + 3 D-27 meta keys)
  - D-25…D-41 locked decisions (03-CONTEXT.md)
provides:
  - js/i18n/pt-BR.json — complete pt-BR dictionary, 102 keys, key set byte-equal to es.json (D-33 folding now has its target)
  - package.json validate:i18n script chained into validate — dictionary↔markup parity gate live in every CI validate job (Pitfall 8 closed at pipeline level)
  - Cross-page regression battery 19/19 PASS recorded (Phase-2 02-02 pattern) + deploy handoff for the orchestrator's single controlled push
affects:
  - Phase 4 (FIRE-03 consumes persano:langchange for all three languages)
  - OPS-01 CI chain (validate now gates on dictionary parity)
tech-stack:
  added: none (zero new dependencies — devDependencies untouched: html-validate 11.12.0 + linkinator 8.1.0; gate runs on node built-ins only)
  patterns:
    - pt-BR dictionary authored from EN strings mirroring ES structure sentence-for-sentence, você register (D-39)
    - dictionary gate rides existing CI validate job — zero workflow edits
    - read-only cross-page regression battery before deploy handoff
key-files:
  created:
    - js/i18n/pt-BR.json
  modified:
    - package.json
decisions:
  - pt-BR copy drafted fresh from EN per D-39 (app has no pt glossary — translations.json holds es/fr/it only); owner review pending alongside the es-419 review
  - geohist.features.trivia.title rendered "Quiz" in pt-BR (natural Brazilian term) rather than mirroring ES "Trivia" — fresh-copy mode/feature names per plan action
  - geohist.features.offline.title kept "Offline" — standard loanword, the natural Brazilian term (inherent-identity class, same reasoning as 03-01 deviation 4)
  - battery item 1 interpreted per its cited Phase-2 02-02 precedent — privacy link on all 5 pages (CMPL-01), contact mailto on the 4 footer pages; 404.html self-contained by design (D-37, 02-CONTEXT) carries no mailto and stays diff-untouched
metrics:
  duration: ~12 min
  completed: 2026-09-02
  tasks: 3
status: complete
deferred_commit: true
estimate:
  tokens: 22000
  tasks: 3
actuals:
  tokens: 2500
  tasks: 3
  commits: 0
---

# Phase 3 Plan 2: pt-BR Dictionary + CI Dictionary Gate + Regression Battery Summary

**One-liner:** Completed the trilingual surface — a 102-key pt-BR dictionary key-identical with es.json (hub 12 / geohist 53 / guide 37), the `validate:i18n` dictionary-parity gate wired into `npm run validate` so dictionary↔markup drift now fails CI, and the full-site cross-page regression battery (19/19 PASS) with a clean deploy handoff for the orchestrator's single controlled push.

## What Was Built

### Task 1 — js/i18n/pt-BR.json (102 keys, key-identical with es.json)
- Flat JSON, exactly 102 entries (hub 12 / geohist 53 / guide 37); key set byte-equal to es.json's — set equality proven by the plan-03-01 keycheck gate, run here against both dictionaries.
- Brazilian Portuguese drafted from the EN strings in the three keyed pages, mirroring the ES dictionary's structure sentence-for-sentence where the languages allow (side-by-side reviewable); friendly second-person "você" register; complete final sentences; no interpolation, no plural machinery.
- **Game modes (fresh pt-BR per plan — no app pt glossary exists):** Bandeiras, Capitais, Figuras no mapa, Cidades e ilhas, Eventos no tempo, Detetive da arte, Brasões de armas, Passaporte Mundial. Feature titles: "Quiz" (trivia group), "Offline" (kept — standard loanword), "Compras dentro do app".
- **Identity strings byte-equal EN:** both email keys = `santiagopostorivo@gmail.com`; all three copyright keys = `© Persano — Santiago David Postorivo`. Proper nouns "GeoHist Trivia", "Persano", "Google Play", "Android" untranslated.
- **D-41 policy mirror spot-verified against geohist/privacy.html:** faq.data.a (offline-first local-only, no PII on own servers, Google services list incl. website-only annotations, "messages deleted after they are handled" → "As mensagens são excluídas depois de tratadas"), faq.offline.a, faq.devices.a (Android 7.0 / API 24), faq.iap.a (payment data handled entirely by Google; never access financial data or cards), faq.progress.a — all meaning-mirrors, no contradiction.
- **Distinctness proven:** spot keys geohist.hero.tagline, geohist.faq.title, guide.modes.1.name each differ from EN values AND es.json values (automated check PASS). Every value a non-empty string.
- Plan-01 artifacts untouched — zero edits to js/i18n.js, HTML files, or es.json.

### Task 2 — validate:i18n in the CI validate chain
- package.json: `"validate:i18n": "node scripts/i18n-keycheck.mjs"` added; `"validate"` extended to `npm run validate:html && npm run validate:links && npm run validate:i18n` (cheap structural checks first, dictionary gate last so its diff output is never buried).
- Zero new devDependencies (verified byte-identical: html-validate 11.12.0 + linkinator 8.1.0). Gate runs on node built-ins only.
- Rides the existing CI validate job unchanged — .github/workflows/deploy.yml already runs `npm run validate` before deploy, so the dictionary gate goes live in CI with zero workflow edits.

### Task 3 — Cross-page regression battery + deploy handoff (read-only, zero file changes)
**Battery 19/19 PASS** (Phase-2 02-02 pattern, one line each):
1. Privacy link on all 5 pages + contact mailto on the 4 footer pages (CMPL-01 regression) — 5 PASS
2. `<script defer src="/js/i18n.js">` exactly once in each of the 3 keyed pages (count = 3); zero `<script>` in geohist/privacy.html and 404.html (D-26/D-37)
3. No per-language directory artifacts (Test-Path es / pt both false) + zero `rel="alternate"` across all *.html (locked no-subdirs decision)
4. Internal link graph resolves — all 6 static link targets exist on disk
5. Heading order sequential + ids unique per page — 5 PASS
6. Keyed meta attrs (`data-i18n-attr="content:{ns}.meta.desc"`) present on all 3 keyed pages (D-27)
7. Dictionaries: keycheck exit 0, both parse, key sets equal (102 = 102), identity strings byte-equal EN — both files
8. geohist/privacy.html, 404.html, css/base.css diff-untouched this phase (`git diff --name-only HEAD` on those paths → empty)
9. Zero static href references to js/i18n/*.json in any markup (dictionaries are fetch-only)

**Deploy handoff (recorded, executor did NOT push — Phase-01 pattern):** orchestrator executes the single controlled push to main after this docs commit; CI runs `npm run validate` (now including the dictionary gate) then Pages deploy. Post-deploy smoke list: hub, /geohist/, /geohist/guide.html, /geohist/privacy.html, 404 behavior, `/js/i18n/es.json` → 200 JSON, `/js/i18n/pt-BR.json` → 200 JSON (reuse scripts/smoke-check.sh + the two dictionary URL checks).

## Verification

- Task 1 gates: key-set equality es↔pt-BR (JSON.stringify comparison) PASS; 102-key count PASS; identity strings PASS; non-empty-string sweep PASS; spot-key distinctness vs EN + ES PASS; keycheck exit 0 for both dictionaries.
- Task 2 gates: validate:i18n present + chained + devDependencies untouched PASS; keycheck exit 0.
- Task 3 battery 19/19 PASS (script at %TEMP%\opencode\battery-03-02.cjs, not a repo artifact).
- Local npm dev tooling proxy-broken (Phase-1 known issue) — html-validate/linkinator arbitrate in CI on the orchestrator's single controlled push; local battery + keycheck are the local gate.
- Behavioral pt-BR proof (pt-* browser locale renders pt-BR in place; Português switcher entry persists) rides the owner human-check after deploy — engine pt-* folding was already harness-proven 49/49 in plan 03-01.

## Deviations from Plan

### Interpretations (no code change)

**1. Battery item 1 wording over-broad — asserted per its cited Phase-2 pattern**
- **Found during:** Task 3 battery
- **Issue:** Plan says "footer privacy link + contact mailto present on all five pages," but the Phase-2 battery it mirrors (02-02-PLAN Task 3 verify) asserts the **privacy link** on all five pages only — 404.html is self-contained by design (D-37, 02-CONTEXT "leave as-is"), carries no mailto, and must stay diff-untouched this phase (battery item 8). Adding a mailto to 404.html would violate the plan's own regression constraint.
- **Resolution:** Asserted privacy link on all 5 + mailto on the 4 footer-bearing pages — the established CMPL-01 regression surface. 5/5 PASS. No file changes.
- **Files modified:** none (battery-script scope only)

Battery-script-only fixes (not site defects): item 1 rewording above; item 4 root URL `/` mapped to `index.html` for the file-existence check (battery script bug, link resolves fine on Pages).

### Auto-fixed Issues

None — both tasks authored to spec on first pass; keycheck green both directions on first run.

## Deferred Commits

All code changes UNCOMMITTED (deferred_commit_mode) — will be committed by /gsd-ship:

- feat(03-02): complete pt-BR dictionary, 102 keys key-identical with es.json, identity strings + D-41 policy mirror intact — files: js/i18n/pt-BR.json
- chore(03-02): wire validate:i18n dictionary-parity gate into npm run validate chain (html → links → i18n), zero new dependencies — files: package.json
- Task 3 battery is read-only — no file changes, no commit entry.

## Human-Check (owner, after deploy)

1. pt-BR-configured browser (DevTools Sensors locale pt-BR, or any pt-* variant incl. bare pt / pt-PT): hub, /geohist/, /geohist/guide.html render pt-BR copy in place; tab titles translate; html lang="pt-BR" (D-33 folding).
2. Português switcher entry from English or Español — language flips without reload, aria-current moves, choice persists across reload.
3. Owner reviews pt-BR copy per D-39 — especially game-mode names (Bandeiras, Figuras no mapa, Detetive da arte, Brasões de armas, Passaporte Mundial…) and the FAQ policy-mirror sentences per D-41 — alongside the es-419 review from plan 03-01.
4. Post-deploy smoke (orchestrator push): `/js/i18n/pt-BR.json` → 200 application/json alongside `/js/i18n/es.json`; five pages 200.

## Known Stubs

None. The gallery "screenshots coming soon" tiles remain pre-existing intentional Phase-2 copy (now translated to pt-BR), resolved in Phase 5 with real screenshots — not a stub of this plan.

## TDD Gate Compliance

Not applicable — plan is not `type: tdd`; TDD_MODE=false (MVP+TDD gate inactive per orchestrator).

## Self-Check: PASSED

- js/i18n/pt-BR.json exists (9,407 chars), parses, 102 keys, key set exactly equals es.json's (set-equality gate exit 0)
- package.json parses; validate:i18n wired; devDependencies byte-identical to before
- scripts/i18n-keycheck.mjs exits 0 covering BOTH dictionaries (es.json + pt-BR.json)
- Battery 19/19 PASS; privacy.html / 404.html / css/base.css diff-untouched this phase
- Code changes uncommitted per deferred_commit_mode (see Deferred Commits) — will be committed by /gsd-ship
