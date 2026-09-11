---
phase: 07-localization-20-rtl
plan: 02
type: execute
wave: 2
depends_on: ["07-01-engine-rtl-switcher-gate"]
files_modified:
  - scripts/i18n-surface.mjs
  - js/i18n/hi.json
  - js/i18n/de.json
  - js/i18n/fr.json
  - js/i18n/ru.json
autonomous: true
requirements: [I18N-05]
estimate:
  tokens: 78000
  raw_tokens: 60000
  tasks: 3
  confidence: low
must_haves:
  truths:
    - "scripts/i18n-surface.mjs dumps the exact key→EN-text map of the live markup surface (count equals the keycheck-reported surface, measured 170 this session) with zero dependencies"
    - "hi.json, de.json, fr.json, ru.json exist as flat JSON objects whose key set exactly equals the live surface — npm run validate:i18n PASSes naming all 7 dictionaries at the reported surface size (the gate's number is the source of truth, never the 169/170 quoted in docs)"
    - "Every value in the 4 new dictionaries is a non-empty translated string — the Task-2 gate from plan 07-01 enforces this mechanically, and pass 2 (full re-read) enforces it editorially"
    - "Game terms (GeoHist Trivia, Art Detective, True/False, mode names, leaderboard names) are pulled verbatim from each language's app strings.xml glossary — site copy matches in-app wording exactly per D-07"
    - "Register follows the defaults table per language: hi uses आप, de uses Sie (safe default — the app mixes 58 Sie / 40 du, flagged for the owner in the wave-1 spot check per D-06), fr uses vous, ru uses lowercase вы"
    - "Brand-name behavior follows the app per language (hi transliterates; fr/de/ru follow the app's values-de/values-fr/values-ru strings)"
    - "The wave lands as one atomic commit containing exactly the 4 dictionaries + the surface helper; no engine, CSS, or markup changes"
  artifacts:
    - "scripts/i18n-surface.mjs — zero-dep key→EN dump reusing the keycheck extraction approach plus node text capture"
    - "js/i18n/hi.json, js/i18n/de.json, js/i18n/fr.json, js/i18n/ru.json — 4 dictionaries at exact parity with the live surface incl. the changelog.* namespace"
  key_links:
    - "App repo values-hi/de/fr/ru/strings.xml ↔ dictionary game-term keys — glossary mining via Node fs utf8 (never the pwsh console, which mangles UTF-8 to question marks)"
    - "scripts/i18n-surface.mjs output ↔ drafting source — EN strings live in markup (no en.json); the dump IS the EN baseline"
    - "Each wave commit ↔ D-06 owner spot check — owner skims the rendered site through the 20-option switcher after deploy"
  prohibitions:
    - statement: "No per-language static HTML subdirs, hreflang alternates, or sitemap entries for dictionaries are introduced — the locked dictionary-swap single-URL architecture stands and I18N-10 stays deferred"
      status: enforced
      verification: "git diff of this wave touches only js/i18n/*.json and scripts/i18n-surface.mjs; no new directories or .html files"
    - statement: "No translated changelog entries — the EN-unkeyed changelog entry exception from Phase 6 stands; dictionaries translate chrome keys only"
      status: enforced
      verification: "npm run validate:i18n exact-parity PASS (any translated entry content added as keys would break set-equality)"
    - statement: "No new runtime or dev npm dependencies for drafting/validation — glossary mining and the surface dump use node built-ins only"
      status: enforced
      verification: "package.json dependency lists unchanged after this wave"
---

<objective>
Dictionary wave 1 (market-size driver, D-05): hi + de + fr + ru at exact key parity, drafted through the full two-pass process with the app-strings.xml glossary, gated green before the atomic wave commit.

Purpose: Largest expected player bases first; establishes the reusable drafting pipeline (surface dump → glossary mining → two passes → gate) that waves 2–4 follow.
Output: scripts/i18n-surface.mjs + 4 dictionaries at parity, one atomic commit, owner spot-check after deploy.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/phases/07-localization-20-rtl/07-RESEARCH.md
@.planning/phases/07-localization-20-rtl/07-01-SUMMARY.md
@js/i18n/es.json
@js/i18n/pt-BR.json
@scripts/i18n-keycheck.mjs
</context>

<precondition>App glossary repo exists and is readable: C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/values/strings.xml plus values-hi, values-de, values-fr, values-ru siblings — assert with a directory listing before starting; halt unmet.</precondition>

<artifacts_this_phase_produces>
This plan produces: scripts/i18n-surface.mjs (key→EN dump helper, reused by all later waves), js/i18n/hi.json, js/i18n/de.json, js/i18n/fr.json, js/i18n/ru.json. (Phase-level artifact list lives in plan 07-01.)
</artifacts_this_phase_produces>

<tasks>

<task type="tracer">
  <name>Task 1: Surface dump helper + hi.json through the full two-pass pipeline</name>
  <files>scripts/i18n-surface.mjs, js/i18n/hi.json</files>
  <read_first>
  - 07-RESEARCH.md Pattern 7 (wave workflow), Pitfalls 7 and 11, Endonyms section
  - scripts/i18n-keycheck.mjs (extraction regex to mirror; pages array)
  - js/i18n/es.json (dictionary shape reference — flat, exact parity, changelog.* included)
  - App glossary: values/strings.xml (EN base) and values-hi/strings.xml in C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/
  </read_first>
  <action>
  Build scripts/i18n-surface.mjs per research Pattern 7's recommendation: zero-dependency node script reusing the keycheck's markup-extraction approach, extended to also capture each keyed node's EN text, printing a key→EN map for the live surface across the 5 keyed pages (this is the EN baseline — no en.json exists; the snapshot IS the EN). Run it once and keep the output as the drafting source. Then draft hi.json through both D-08 passes: pass 1 covers every key of the reported surface using the hi strings.xml glossary verbatim for game terms (GeoHist, Art Detective, True/False, mode and leaderboard names — locate the EN term in values/strings.xml to get the string name, then read that name in values-hi/strings.xml; mine via node fs utf8, never via the PowerShell console, per Pitfall 7), and brand-name behavior matching the app (hi transliterates — follow values-hi). Pass 2 is a full fresh re-read of all values checking register consistency (आप-form), length behavior, and punctuation correctness. Include the changelog.* keys translated like all others (chrome keys are in scope; entry content stays EN-unkeyed). Gate green before commit.
  </action>
  <verify>
  <automated>node scripts/i18n-surface.mjs (prints the surface map) && npm run validate:i18n (PASS incl. hi.json)</automated>
  </verify>
  <acceptance_criteria>
  - node scripts/i18n-surface.mjs exits 0 and prints a key→EN mapping whose key count equals the keycheck-reported surface size
  - js/i18n/hi.json exists, parses as a flat JSON object, and npm run validate:i18n prints PASS for hi.json at the reported surface size
  - No value in hi.json is an empty or whitespace-only string (gate-enforced) and no value contains untranslatable EN chrome leftovers
  - Glossary terms cross-checked: the site's game-title/mode strings match the values-hi strings.xml wording (spot-check 3+ terms via node fs utf8 extraction)
  - scripts/i18n-surface.mjs contains no npm imports beyond node built-ins
  </acceptance_criteria>
  <done>Surface helper committed and hi.json at exact parity through two passes — the drafting pipeline is proven end-to-end for the remaining waves</done>
</task>

<task type="auto">
  <name>Task 2: de.json + fr.json — two-pass drafts with register handling</name>
  <files>js/i18n/de.json, js/i18n/fr.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline from Task 1)
  - 07-RESEARCH.md Pattern 7 register defaults, Pitfall 9 (app is NOT authoritative for de register), Assumptions A2
  - App glossaries: values-de/strings.xml, values-fr/strings.xml (mine via node fs utf8)
  </read_first>
  <action>
  Draft both dictionaries through both D-08 passes against the Task-1 surface baseline. fr: vous register throughout; follow values-fr for game terms and brand behavior. de: use Sie as the safe default register per the research recommendation for general-audience copy — the app's values-de file is internally inconsistent (58 Sie-form / 40 du-form hits), so use it for TERMINOLOGY only (D-07) and flag the Sie decision explicitly in the wave-1 owner spot-check note (D-06) rather than blocking the wave; watch for the app's own mixed-register phrasing patterns leaking into site copy (Pitfall 9). Length behavior: de values grow roughly 20–35% over EN — keep UI-fitting values tight where EN strings are long. Gate green after both.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS incl. de.json + fr.json)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n prints PASS for de.json and fr.json at the reported surface size
  - de.json values use Sie-form consistently: a spot-check of 5+ second-person-bearing values shows no du/dein forms
  - fr.json values use vous consistently on the same spot-check basis
  - No empty values; game-term strings match the respective values-xx strings.xml wording on a 3+ term cross-check
  - changelog.* keys present and translated in both files (parity gate enforces the key side)
  </acceptance_criteria>
  <done>de (Sie-flagged) and fr (vous) dictionaries at parity, both passes complete, gate green</done>
</task>

<task type="auto">
  <name>Task 3: ru.json + atomic wave commit</name>
  <files>js/i18n/ru.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 7 (ru register: lowercase вы), Pitfall 7 (utf8 mining)
  - App glossary: values-ru/strings.xml
  </read_first>
  <action>
  Draft ru.json through both D-08 passes: lowercase вы register, game terms verbatim from values-ru/strings.xml (brand-name behavior per values-ru), length and punctuation reviewed in pass 2. Then land the wave as ONE atomic commit containing scripts/i18n-surface.mjs + hi.json + de.json + fr.json + ru.json (dictionaries-only convention from Phase 6; engine already landed in 07-01), with the commit message noting the de-Sie flag for the owner spot check. After push and Pages deploy, the D-06 owner skim covers the 4 new languages through the footer switcher on the rendered site (never file:// — Pitfall 10).
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS naming 7 dictionaries) && git log --oneline -1 (single wave commit)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n exits 0 with es, pt-BR, hi, de, fr, ru all PASS at the reported surface size
  - Exactly one new commit for this wave containing the 5 files listed in files_modified and nothing else (git show --stat)
  - ru.json values use lowercase вы consistently on a 5+ value spot-check
  - Wave commit message documents: de register default (Sie) flagged for owner review per research Open Question 1
  </acceptance_criteria>
  <done>Wave-1 dictionaries live at parity in one commit; owner spot-check pending on the deployed site per D-06</done>
</task>

</tasks>

<verification>
- npm run validate green on the full chain
- 7 dictionaries (es, pt-BR, hi, de, fr, ru) at exact parity with the live surface, zero empty values, glossary-verified game terms
- Wave commit is atomic (dictionaries + surface helper only)
</verification>

<success_criteria>
- validate:i18n PASS across 7 dictionaries; surface helper reusable for waves 2–4
- Register defaults applied (hi आप, de Sie-flagged, fr vous, ru lowercase вы)
- D-06 spot-check note written into the commit for the owner
</success_criteria>

<notes>
- Chain auto-run: no interactive checkpoints. The de Sie-vs-du register question is a reversible decision recorded here and in the commit message (safe default + owner flag) rather than a blocking checkpoint.
- Reversibility: dictionary waves are commit batches — reordering or amending later waves costs nothing (D-05 rated reversible).
</notes>

<output>
Create `.planning/phases/07-localization-20-rtl/07-02-SUMMARY.md` when done
</output>
