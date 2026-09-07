---
phase: 07-localization-20-rtl
plan: 04
type: execute
wave: 4
depends_on: ["07-03-dicts-wave2-ja-ko-tr-id"]
files_modified:
  - js/i18n/it.json
  - js/i18n/pl.json
  - js/i18n/nl.json
  - js/i18n/vi.json
autonomous: true
requirements: [I18N-05]
estimate:
  tokens: 68000
  raw_tokens: 52000
  tasks: 2
  confidence: low
must_haves:
  truths:
    - "it.json, pl.json, nl.json, vi.json exist at exact key parity with the live surface — npm run validate:i18n PASSes naming 15 dictionaries at the keycheck-reported size"
    - "Register per defaults table: it uses tu (game convention), pl uses Ty, nl uses je, vi avoids pronouns"
    - "vi values grow roughly 20–35% over EN — pass 2 explicitly checks length behavior so long EN strings do not overflow their UI slots"
    - "Game terms are verbatim from values-it/pl/nl/vi strings.xml; brand behavior follows the app per language"
    - "The wave lands as one atomic commit of the 4 dictionaries; no engine/CSS/markup changes"
  artifacts:
    - "js/i18n/it.json, js/i18n/pl.json, js/i18n/nl.json, js/i18n/vi.json — 4 dictionaries at exact parity incl. changelog.*"
  key_links:
    - "values-it/pl/nl/vi strings.xml ↔ dictionary game-term keys — node fs utf8 mining only"
    - "Wave commit ↔ D-06 owner spot check through the rendered switcher"
  prohibitions:
    - statement: "No per-language static subdirs/hreflang and no new npm dependencies (locked architecture, zero-build)"
      status: enforced
      verification: "wave diff touches only the 4 dictionary files"
---

<objective>
Dictionary wave 3 (D-05 market-size driver): it + pl + nl + vi at exact key parity through the two-pass process.

Purpose: Extends the proven pipeline to the Latin-script European + Vietnamese set; vi is the length-behavior stress case.
Output: 4 dictionaries at parity, one atomic commit, owner spot-check after deploy.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/phases/07-localization-20-rtl/07-RESEARCH.md
@.planning/phases/07-localization-20-rtl/07-03-SUMMARY.md
@js/i18n/es.json
</context>

<precondition>App glossary dirs values-it, values-pl, values-nl, values-vi exist under C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/ and scripts/i18n-surface.mjs exists — assert before starting; halt unmet.</precondition>

<artifacts_this_phase_produces>
This plan produces: js/i18n/it.json, js/i18n/pl.json, js/i18n/nl.json, js/i18n/vi.json. (Phase-level artifact list lives in plan 07-01.)
</artifacts_this_phase_produces>

<tasks>

<task type="tracer">
  <name>Task 1: it.json — two-pass draft on the proven pipeline</name>
  <files>js/i18n/it.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 7 (it register: tu per game convention), Pitfall 7
  - App glossary: values/strings.xml + values-it/strings.xml
  </read_first>
  <action>
  Draft it.json through both D-08 passes against the surface baseline: tu register per the game-industry convention recorded in the research register table, game terms verbatim from values-it/strings.xml via node fs utf8 mining, brand behavior per values-it. Pass 2 full re-read for register, length, punctuation (Italian uses accented vowels — verify no mojibake from the mining step).
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS incl. it.json)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n prints PASS for it.json at the reported surface size
  - Register spot-check: 5+ second-person-bearing values use tu forms, no Lei-form leakage
  - Accented characters render correctly in extracted and stored values (no replacement characters anywhere in the file)
  - No empty values; game terms match values-it wording on a 3+ term cross-check
  </acceptance_criteria>
  <done>it.json at parity through two passes, gate green</done>
</task>

<task type="auto">
  <name>Task 2: pl + nl + vi — two-pass drafts (vi length stress) + atomic wave commit</name>
  <files>js/i18n/pl.json, js/i18n/nl.json, js/i18n/vi.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 7 (pl Ty; nl je; vi avoids pronouns), Pitfall 7
  - App glossaries: values-pl, values-nl, values-vi strings.xml
  </read_first>
  <action>
  Draft all three through both D-08 passes: pl uses Ty, nl uses je, vi avoids personal pronouns per the register table; game terms verbatim from each language's strings.xml via node fs utf8; brand behavior per the app. For vi specifically, pass 2 pays extra attention to length behavior — Vietnamese grows roughly 20–35% over EN, so keep the longest EN-derived values within reasonable UI bounds without truncating meaning. Polish diacritics (ą, ć, ę, ł, ń, ó, ś, ź, ż) and Vietnamese diacritics verified intact post-mining. Land the wave as ONE atomic commit of exactly the 4 dictionaries, commit message noting the vi length behavior check.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS naming 15 dictionaries) && git show --stat --oneline HEAD (4 dictionary files only)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n exits 0 with all 15 dictionaries PASS at the reported surface size
  - pl shows Ty, nl shows je, vi shows pronoun-avoidant phrasing on 5+ value spot-checks each
  - No replacement/mojibake characters in pl or vi values (diacritics intact)
  - vi's 5 longest values compared against their EN counterparts stay within a reasonable expansion envelope (no 2x blowups)
  - Exactly one new commit containing exactly the 4 dictionary files; no empty values
  </acceptance_criteria>
  <done>Wave-3 dictionaries live at parity in one commit; 15 of 20 dictionaries gated green</done>
</task>

</tasks>

<verification>
- npm run validate green; 15 dictionaries at exact parity
- Registers applied; vi length behavior checked; diacritics intact
- Atomic wave commit, D-06 owner skim pending post-deploy
</verification>

<success_criteria>
- validate:i18n PASS across 15 dictionaries
- it tu, pl Ty, nl je, vi pronoun-avoidant — per the register table
</success_criteria>

<notes>
- Chain auto-run: no interactive checkpoints. Reversibility: wave batches are commits (D-05, reversible).
</notes>

<output>
Create `.planning/phases/07-localization-20-rtl/07-04-SUMMARY.md` when done
</output>
