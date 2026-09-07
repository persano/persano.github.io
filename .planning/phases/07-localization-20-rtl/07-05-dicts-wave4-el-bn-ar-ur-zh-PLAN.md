---
phase: 07-localization-20-rtl
plan: 05
type: execute
wave: 5
depends_on: ["07-04-dicts-wave3-it-pl-nl-vi"]
files_modified:
  - js/i18n/el.json
  - js/i18n/bn.json
  - js/i18n/ar.json
  - js/i18n/ur.json
  - js/i18n/zh.json
autonomous: true
requirements: [I18N-05]
estimate:
  tokens: 85000
  raw_tokens: 65000
  tasks: 3
  confidence: low
must_haves:
  truths:
    - "el.json, bn.json, ar.json, ur.json, zh.json exist at exact key parity with the live surface — npm run validate:i18n PASSes naming all 20 dictionaries at the keycheck-reported size; the phase's SC1 is mechanically complete"
    - "ar.json and ur.json carry RTL-script copy whose rendering direction comes from the html dir=rtl switch shipped in 07-01 — no per-page or per-dictionary direction markup exists"
    - "zh.json is Simplified Chinese only (values-zh confirmed, no regional variants) and passes the hardened CJK punctuation gate: zero half-width [,!?:;()] and zero periods outside digit-digit context"
    - "Register per defaults table: el uses εσείς, bn uses আপনি, ar uses MSA فصحى, ur uses آپ formal, zh uses 您 unless the app's values-zh strings indicate otherwise (flag the choice in the commit)"
    - "Brand-name behavior follows the app per language: ja/el keep Latin GeoHist Trivia (el verified in research), ur/hi/bn/zh transliterate — ar/ur/bn/zh/el each checked against their values-xx strings"
    - "The wave lands as one atomic commit of the 5 dictionaries; no engine/CSS/markup changes"
    - "With this commit, all 20 dictionaries exist and the D-06 owner skim can cover the full switcher including RTL rendering of ar/ur on the deployed site"
  artifacts:
    - "js/i18n/el.json, js/i18n/bn.json, js/i18n/ar.json, js/i18n/ur.json, js/i18n/zh.json — the final 5 dictionaries at exact parity incl. changelog.*"
  key_links:
    - "values-el/bn/ar/ur/zh strings.xml ↔ dictionary game-term keys — node fs utf8 mining only (Arabic/Indic glyphs mangled in pwsh console)"
    - "ar/ur values ↔ [dir=rtl] CSS block shipped in 07-01 — direction is attribute-driven, never content-driven"
    - "zh.json ↔ CJK punctuation gate — same live-gate constraint as ja"
    - "Final wave commit ↔ phase completion: 20/20 dictionaries, D-06 owner skim, STATE.md Urdu device blocker remains an owner step"
  prohibitions:
    - statement: "Game screenshots and gallery content are never mirrored under RTL — only directional UI chrome may flip; the screenshots are the game's own rendering"
      status: enforced
      verification: "[dir=rtl] block in css/base.css contains no rules targeting gallery/screenshot image elements"
    - statement: "No unicode-bidi: bidi-override anywhere — Arabic/Urdu text reordering uses the Unicode bidi algorithm with isolation attributes only"
      status: enforced
      verification: "grep css/ js/ for bidi-override returns nothing after this wave"
    - statement: "The gate is never silenced by stripping legitimate version numbers or dates from values; zh punctuation failures are fixed in the dictionary"
      status: enforced
      verification: "npm run validate:i18n PASS with changelog version values intact"
---

<objective>
Dictionary wave 4 (D-05 market-size driver, final): el + bn + ar + ur + zh at exact key parity — completing the 20-language surface, including both RTL languages and the CJK-gated zh.

Purpose: Closes I18N-05 fully; the phase ends with 20/20 dictionaries gated green and the owner able to skim every language through the deployed switcher.
Output: 5 dictionaries at parity, one atomic commit, phase-complete owner spot-check after deploy.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/phases/07-localization-20-rtl/07-RESEARCH.md
@.planning/phases/07-localization-20-rtl/07-04-SUMMARY.md
@js/i18n/es.json
@css/base.css
</context>

<precondition>App glossary dirs values-el, values-bn, values-ar, values-ur, values-zh exist under C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/; scripts/i18n-surface.mjs exists; css/base.css already carries the [dir=rtl] block from 07-01 — assert before starting; halt unmet.</precondition>

<artifacts_this_phase_produces>
This plan produces: js/i18n/el.json, js/i18n/bn.json, js/i18n/ar.json, js/i18n/ur.json, js/i18n/zh.json — the final 5 of the phase's 17 new dictionaries. (Phase-level artifact list lives in plan 07-01.)
</artifacts_this_phase_produces>

<tasks>

<task type="tracer">
  <name>Task 1: ar.json — RTL-language draft end-to-end</name>
  <files>js/i18n/ar.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 7 (ar register: MSA فصحى), Pitfall 7 (Arabic glyphs mangled in pwsh — node fs utf8 only)
  - 07-01-SUMMARY.md (the dir=rtl switch + [dir=rtl] CSS this dictionary renders into)
  - App glossary: values/strings.xml + values-ar/strings.xml
  </read_first>
  <action>
  Draft ar.json through both D-08 passes against the surface baseline: Modern Standard Arabic register (فصحى), game terms verbatim from values-ar/strings.xml mined via node fs utf8, brand behavior per values-ar. Values are pure Arabic-script content — direction comes from the html attribute switch shipped in 07-01, so no directional characters, no override controls, and no embedded LTR markup inside values; Latin brand runs (if the app keeps any) ride the Unicode bidi algorithm and are fine as bare runs. Pass 2 re-reads every value for register consistency, grammar, and punctuation (Arabic comma ؟ ؛ ، — no ASCII half-width hangovers). Gate green.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS incl. ar.json)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n prints PASS for ar.json at the reported surface size
  - All values are non-empty Arabic-script strings (spot-check via node utf8 extraction — no question-mark mojibake, no empty strings)
  - No ASCII half-width punctuation sequences in values (Arabic ، ؟ ؛ used instead); no bidi control characters embedded
  - Game terms match values-ar wording on a 3+ term cross-check
  </acceptance_criteria>
  <done>ar.json at parity through two passes — first RTL language gated green</done>
</task>

<task type="auto">
  <name>Task 2: ur + bn + el — two-pass drafts</name>
  <files>js/i18n/ur.json, js/i18n/bn.json, js/i18n/el.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 7 (bn register আপনি; el register εσείς; el keeps Latin brand), Pitfall 7
  - App glossaries: values-ur, values-bn, values-el strings.xml
  </read_first>
  <action>
  Draft all three through both D-08 passes: ur uses formal آپ register and transliterated brand per values-ur (Nastaliq rendering on devices remains the documented STATE.md owner blocker — the CSS side shipped in 07-01 with line-height 2 for ur); bn uses আপনি and transliterated brand per values-bn; el uses εσείς and keeps the Latin GeoHist Trivia brand per the research-verified values-el behavior. Game terms verbatim from each strings.xml via node fs utf8 mining. Pass 2 full re-read for register, length, punctuation (Urdu/Arabic-script punctuation for ur; Bengali danda া-adjacent punctuation rules per the app's usage; Greek question mark is the semicolon glyph — follow the app). Gate green after all three.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS incl. ur.json, bn.json, el.json)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n prints PASS for ur.json, bn.json, el.json at the reported surface size
  - ur values use آپ-register phrasing on 5+ sentence-bearing spot-checks; bn uses আপনি; el uses εσείς forms
  - el brand-bearing values keep the Latin GeoHist Trivia name matching values-el
  - No mojibake in extracted Urdu/Bengali/Greek values; no empty values
  </acceptance_criteria>
  <done>ur/bn/el at parity through two passes; 18 of 20 dictionaries green</done>
</task>

<task type="auto">
  <name>Task 3: zh.json (Simplified) + atomic wave commit — phase dictionary completion</name>
  <files>js/i18n/zh.json</files>
  <read_first>
  - scripts/i18n-surface.mjs output (EN baseline)
  - 07-RESEARCH.md Pattern 6/7 (zh under the CJK punctuation gate; brand transliterates per values-zh), Pitfall 4
  - App glossary: values-zh/strings.xml (Simplified — no regional variants exist in the app repo)
  </read_first>
  <action>
  Draft zh.json through both D-08 passes: Simplified Chinese only (the app repo has values-zh and nothing regional — the resolved STATE.md blocker), full-width Chinese punctuation throughout, ASCII periods only inside digit-digit contexts (version numbers in changelog chrome survive the gate exception), register follows the app's values-zh strings — if the app is consistent in its 您/你 usage, mirror it; otherwise default to 您 and flag the choice in the commit message. Brand transliterates per values-zh. Pass 2 re-reads every value. Then land the FINAL wave as ONE atomic commit containing exactly the 5 dictionaries; the commit message notes: 20/20 dictionaries complete, zh register choice, and the standing owner items (Urdu device rendering, de register from wave 1). After deploy, the D-06 owner skim covers the full 20-option switcher including RTL rendering of ar/ur.
  </action>
  <verify>
  <automated>npm run validate:i18n (PASS naming all 20 dictionaries) && git show --stat --oneline HEAD (5 dictionary files only)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n exits 0 with all 20 dictionary files PASS at the reported surface size — SC1's mechanical condition complete
  - zh.json values contain full-width punctuation; any ASCII period sits between digits; no half-width commas/colons/quotes
  - zh values are Simplified characters (no traditional-form spot-hits on 5+ checked values)
  - Exactly one new commit containing exactly the 5 dictionary files; no empty values anywhere
  - Commit message records the zh register choice and the standing owner spot-check items
  </acceptance_criteria>
  <done>All 20 dictionaries live at parity in CI-gated state; phase dictionary scope complete</done>
</task>

</tasks>

<verification>
- npm run validate green; 20/20 dictionaries at exact parity with the live surface
- ar/ur draft cleanly into the attribute-driven RTL system; zh passes the CJK gate without gate edits
- Atomic wave commit; D-06 full-switcher owner skim pending post-deploy
</verification>

<success_criteria>
- validate:i18n PASS across all 20 dictionaries — I18N-05 mechanically closed
- Registers applied (el εσείς, bn আপনি, ar MSA, ur آپ, zh per-app-or-您 flagged)
- Phase success criteria 1 and 5 fully satisfied; 2 satisfied code-side with owner visual confirmation post-deploy
</success_criteria>

<notes>
- Chain auto-run: no interactive checkpoints. The zh 您/你 register call is reversible, recorded in the commit message, and covered by the D-06 owner skim.
- Reversibility: wave batches are commits (D-05, reversible).
- Standing owner items after this plan (not blockers for phase completion): Urdu Nastaliq real-device rendering check; de Sie-vs-du review from wave 1; per-wave skims batched if the owner prefers one pass over the deployed switcher.
</notes>

<output>
Create `.planning/phases/07-localization-20-rtl/07-05-SUMMARY.md` when done
</output>
