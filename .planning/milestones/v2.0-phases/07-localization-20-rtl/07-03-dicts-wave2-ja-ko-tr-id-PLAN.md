---
phase: 07-localization-20-rtl
plan: 03
type: execute
wave: 3
depends_on: ["07-02-dicts-wave1-hi-de-fr-ru"]
files_modified:
  - js/i18n/ja.json
  - js/i18n/ko.json
  - js/i18n/tr.json
  - js/i18n/id.json
autonomous: true
requirements: [I18N-05]
estimate:
  tokens: 72000
  raw_tokens: 55000
  tasks: 2
  confidence: low
must_haves:
  truths:
    - "ja.json, ko.json, tr.json, id.json exist at exact key parity with the live surface — npm run validate:i18n PASSes naming 11 dictionaries at the keycheck-reported size"
    - "ja.json passes the hardened CJK punctuation gate: zero half-width [,!?:;()] and zero periods outside digit-digit context (values like version numbers 0.88 pass via the exception)"
    - "ja keeps the Latin brand GeoHist Trivia per the app's values-ja strings; ko/tr/id follow their respective app strings"
    - "Register per defaults table: ja uses です/ます, ko uses 해요체, tr uses siz, id uses Anda"
    - "ja/ko values shrink or stay compact relative to EN (CJK density) — pass 2 verifies no overflow-prone long values"
    - "The wave lands as one atomic commit of the 4 dictionaries; no engine/CSS/markup changes"
  artifacts:
    - "js/i18n/ja.json, js/i18n/ko.json, js/i18n/tr.json, js/i18n/id.json — 4 dictionaries at exact parity incl. changelog.*"
  key_links:
    - "values-ja/ko/tr/id strings.xml ↔ dictionary game-term keys — node fs utf8 mining only"
    - "ja.json ↔ hardened CJK punctuation gate — the gate is now a live constraint on drafting, not just parity"
    - "Wave commit ↔ D-06 owner spot check through the rendered switcher"
  prohibitions:
    - statement: "The gate is never silenced by deleting legitimate version numbers or dates from values — the digit-period exception exists precisely so real content survives; fix the value or fix the rule, never strip data to go green"
      status: enforced
      verification: "npm run validate:i18n PASS with changelog chrome values containing versions intact; no diff removes digits from existing EN-derived patterns"
    - statement: "No per-language static subdirs/hreflang and no new npm dependencies (locked architecture, zero-build)"
      status: enforced
      verification: "wave diff touches only the 4 dictionary files"
---

<objective>
Dictionary wave 2 (D-05 market-size driver): ja + ko + tr + id at exact key parity through the two-pass process, with ja under the newly hardened CJK punctuation gate.

Purpose: CJK languages stress the phase's new quality gate — drafting ja against the live gate proves the hardening is workable, not just red-gated.
Output: 4 dictionaries at parity, one atomic commit, owner spot-check after deploy.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/phases/07-localization-20-rtl/07-RESEARCH.md
@.planning/phases/07-localization-20-rtl/07-02-SUMMARY.md
@js/i18n/es.json
@scripts/i18n-keycheck.mjs
</context>

<precondition>App glossary dirs values-ja, values-ko, values-tr, values-id exist under C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/ and scripts/i18n-surface.mjs exists from plan 07-02 — assert before starting; halt unmet.</precondition>

<artifacts_this_phase_produces>
This plan produces: js/i18n/ja.json, js/i18n/ko.json, js/i18n/tr.json, js/i18n/id.json. (Phase-level artifact list lives in plan 07-01.)
</artifacts_this_phase_produces>

<tasks>

<task type="tracer">
  <name>Task 1: ja.json — two-pass draft against the live CJK punctuation gate</name>
  <files>js/i18n/ja.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline from 07-02 Task 1)
  - 07-RESEARCH.md Pattern 7 (ja register です/ます; brand keeps Latin GeoHist Trivia), Pitfall 7 (utf8 mining)
  - scripts/i18n-keycheck.mjs (the hardened checks this dictionary must survive)
  - App glossary: values/strings.xml + values-ja/strings.xml
  </read_first>
  <action>
  Draft ja.json through both D-08 passes against the surface baseline: pass 1 covers every key with game terms verbatim from values-ja/strings.xml (mined via node fs utf8), keeping the brand name GeoHist Trivia in Latin script wherever the app does; register is です/ます throughout. CJK values naturally shrink versus EN — use the freed length for natural phrasing rather than padding. Punctuation discipline during drafting: full-width Japanese punctuation everywhere, with ASCII periods only inside digit-digit contexts (version numbers like 0.88 in changelog chrome values survive via the documented gate exception). Pass 2 re-reads every value for register consistency and punctuation width. Run the gate; any FAIL is fixed in the dictionary, never by weakening the gate.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS incl. ja.json under the CJK punctuation check)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n prints PASS for ja.json at the reported surface size — including the half-width punctuation predicate (no ASCII comma, exclamation, question, colon, semicolon, parenthesis, double-quote in any value)
  - Any value containing an ASCII period has it only between digits (spot-check every such value)
  - Register spot-check: 5+ sentence-bearing values end in polite です/ます forms, no plain-form leakage
  - Brand cross-check: the game-title key matches values-ja wording (Latin brand retained where the app retains it)
  - No empty values (gate-enforced)
  </acceptance_criteria>
  <done>ja.json at parity, two passes complete, live CJK gate green — hardening proven workable on real CJK copy</done>
</task>

<task type="auto">
  <name>Task 2: ko + tr + id — two-pass drafts + atomic wave commit</name>
  <files>js/i18n/ko.json, js/i18n/tr.json, js/i18n/id.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 7 (ko 해요체; tr siz; id Anda), Pitfall 7
  - App glossaries: values-ko, values-tr, values-id strings.xml
  </read_first>
  <action>
  Draft all three through both D-08 passes: ko uses 해요체 register (half-width punctuation is common Korean usage and ko is exempt from the CJK punctuation gate — documented exemption, but prefer natural Korean typography anyway), tr uses siz, id uses Anda; game terms verbatim from each language's strings.xml via node fs utf8 mining; brand behavior per the app. Pass 2 full re-read for register, length, punctuation. Then land the wave as ONE atomic commit containing exactly the 4 dictionaries (files_modified list), commit message noting the ko exemption stands and any brand-behavior choices taken from the app.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS naming 11 dictionaries) && git show --stat --oneline HEAD (4 dictionary files only)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n exits 0 with es, pt-BR, hi, de, fr, ru, ja, ko, tr, id all PASS at the reported surface size
  - ko register spot-check shows 해요체 endings on 5+ sentence-bearing values
  - tr and id spot-checks show siz / Anda consistently
  - Exactly one new commit containing exactly the 4 dictionary files
  - No empty values in any of the 3 new files
  </acceptance_criteria>
  <done>Wave-2 dictionaries live at parity in one commit; 10 of 20 dictionaries gated green</done>
</task>

</tasks>

<verification>
- npm run validate green; 11 dictionaries at exact parity
- ja drafted against the live CJK gate without gate edits
- Atomic wave commit, D-06 owner skim pending post-deploy
</verification>

<success_criteria>
- validate:i18n PASS across 11 dictionaries; ja punctuation spotless under the gate
- Registers applied (ja です/ます, ko 해요체, tr siz, id Anda)
</success_criteria>

<notes>
- Chain auto-run: no interactive checkpoints; ko-exemption and brand-behavior calls are reversible and recorded in the commit message.
- Reversibility: wave batches are commits (D-05, reversible).
</notes>

<output>
Create `.planning/phases/07-localization-20-rtl/07-03-SUMMARY.md` when done
</output>
