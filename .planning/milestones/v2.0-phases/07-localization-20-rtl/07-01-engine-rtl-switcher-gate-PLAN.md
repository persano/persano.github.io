---
phase: 07-localization-20-rtl
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - js/i18n.js
  - scripts/i18n-detect.test.mjs
  - scripts/i18n-keycheck.mjs
  - css/base.css
  - package.json
autonomous: true
requirements: [I18N-06, I18N-07, I18N-08, I18N-09]
estimate:
  tokens: 68000
  raw_tokens: 54000
  tasks: 3
  confidence: med
must_haves:
  truths:
    - "detect() is a pure flat prefix-table fold: per candidate tag lowercase → split('-')[0] → table hit returns mapped lang, else scan continues; terminal return is 'en'"
    - "All legacy/edge tags fold correctly: in-* and in → id, zh/zh-TW/zh-Hant-CN/zh-HK → zh, pt/pt-PT/pt-BR → pt-BR, es/es-419 → es (23 unit-test vectors green)"
    - "D-32 preserved: ['en-US','es'] detects es — EN is the terminal fallback, never a returning table entry; [['zh','pt']] now detects zh (first supported match wins — documented intentional behavior change)"
    - "Empty/degenerate input never crashes: unknown tags (xx-YY, fil-PH) and empty candidate lists return 'en'; navigator-less environments are handled by the existing try/catch shape"
    - "keycheck rejects any dictionary value that is non-string or whitespace-empty in ALL js/i18n/*.json files, naming file and key on FAIL"
    - "keycheck rejects half-width ASCII punctuation [,!?:;()] and any '.' not between digits in ja.json and zh.json only (ko exempt — documented in script header); values like '0.88' pass via the digit-period exception"
    - "Parity logic (exact set-equality, keycheck lines 99-110) is byte-unchanged; the script remains zero-dependency node built-ins"
    - "applyLanguage() sets documentElement.dir = 'rtl' for ar/ur and 'ltr' for every other language in the same pass as the existing lang sync; the EN-restore path resets to ltr with no extra code"
    - "renderSwitcher() builds one native <select class=lang-select> into the footer lang-switcher-slot with 20 endonym-only options; switching persists through the existing switchTo() → persano.lang path unchanged"
    - "Option order equals SUPPORTED array order: en, es, pt-BR, then Latin group (fr, de, it, nl, pl, tr, vi, id), Cyrillic (ru), Greek (el), Indic (hi, bn), Arabic (ar, ur), CJK (ja, ko, zh) — fixed per D-03"
    - "css/base.css carries the [dir=rtl] override block and line-height overrides that target body/headings directly (html[lang=ur] body 2.0, ur h1-h3 1.9, ja/zh/ko body 1.7) — html-level rules alone would be defeated by body's own 1.6"
    - "The 3 direction-sensitive physical declarations (list indents, FAQ summary padding, FAQ chevron inset) are converted to logical properties in place — no duplicated mirror stylesheet"
  artifacts:
    - "js/i18n.js — DETECT_TABLE (19 entries, no en), detect(candidatesOverride) optional-arg injection, in-IIFE module.exports hook, RTL_LANGS, LANG_LABELS (20 entries), ENDONYMS/SUPPORTED grown to 20, select-based renderSwitcher/bindSwitcher"
    - "scripts/i18n-detect.test.mjs — node:test harness, document stub + createRequire, 23 vectors"
    - "scripts/i18n-keycheck.mjs — empty-value + CJK-punctuation predicates with documented digit-period exception and ko exemption"
    - "css/base.css — .lang-select rules, logical-property conversions, [dir=rtl] block, html[lang] line-height rules"
    - "package.json — validate:i18n-detect script chained into validate"
  key_links:
    - "js/i18n.js export hook ↔ scripts/i18n-detect.test.mjs require — hook must sit INSIDE the IIFE or require throws ReferenceError (reproduced in research sandbox)"
    - "SUPPORTED array ↔ switcher options ↔ detection coverage — one array activates all three"
    - "applyLanguage dir line ↔ [dir=rtl] CSS block ↔ html[lang] line-height selectors — dir/lang land on <html> in one pass, CSS keys off the same attributes"
  prohibitions:
    - statement: "EN must never appear as a returning DETECT_TABLE entry — it would stop the scan on en-* primaries and break the established Spanish-second-browser behavior"
      status: enforced
      verification: "test vector [en-US, es] → es in scripts/i18n-detect.test.mjs passes; DETECT_TABLE source contains no en key"
    - statement: "No unicode-bidi: bidi-override is introduced anywhere — it mangles text; only isolation attributes and logical properties are permitted"
      status: enforced
      verification: "grep css/ js/ for bidi-override returns nothing"
    - statement: "Switcher binding must never stack listeners across re-renders — property assignment (slot.onchange) only, per D-01 anti-pattern rule"
      status: enforced
      verification: "bindSwitcher uses slot.onchange assignment; no addEventListener inside the switcher bind path"
    - statement: "Switcher aria-label and option labels must not come from dictionary keys — JS-built nodes are invisible to the keycheck snapshot and a key present only in dictionaries fails the parity gate"
      status: enforced
      validation: engine-internal maps only
      verification: "LANG_LABELS and ENDONYMS live in js/i18n.js; npm run validate:i18n stays green after the rewrite"
---

<objective>
Engine wave: scale the i18n engine from 3 to 20 languages and harden the CI gate before any dictionary drafting starts.

Purpose: D-06 owner spot-checks ride the rendered switcher, so the select + detection + RTL plumbing must ship first; the hardened gate then guards every dictionary wave that follows. This plan closes I18N-06 (detection), I18N-07 (RTL), I18N-08 (switcher), I18N-09 (gate).
Output: Rewritten js/i18n.js (prefix table, dir switching, select switcher), new scripts/i18n-detect.test.mjs, hardened scripts/i18n-keycheck.mjs, css/base.css RTL/typography/select styling, package.json validate chain — one atomic commit.
</objective>

<execution_context>
@C:/Users/Familia/.config/opencode/gsd-core/workflows/execute-plan.md
@C:/Users/Familia/.config/opencode/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/07-localization-20-rtl/07-RESEARCH.md
@js/i18n.js
@css/base.css
@scripts/i18n-keycheck.mjs
@package.json
</context>

<artifacts_this_phase_produces>
Symbols this phase (07) creates; this plan creates the starred subset:
- **DETECT_TABLE** (flat {prefix → lang} map, 19 entries, no en), **detect(candidatesOverride)** optional-arg signature, in-IIFE `module.exports` test hook
- **RTL_LANGS** {ar, ur}, **LANG_LABELS** (20-entry aria-label map), **ENDONYMS**/**SUPPORTED** grown to 20 entries in D-03 grouped order
- Select-based **renderSwitcher()**/**bindSwitcher()** (slot.onchange property assignment)
- **scripts/i18n-detect.test.mjs** (node:test, 23 vectors)
- Hardened **scripts/i18n-keycheck.mjs**: empty-value predicate, CJK half-width punctuation predicate (PUNCT_LANGS = ja.json + zh.json; ko exempt), digit-period exception
- **css/base.css**: `.lang-select`, logical-property conversions, `[dir="rtl"]` block, `html[lang=…]` line-height rules
- **package.json** `validate:i18n-detect` chained into `validate`
- Plans 02–05: 17 dictionaries `js/i18n/{hi,de,fr,ru,ja,ko,tr,id,it,pl,nl,vi,el,bn,ar,ur,zh}.json`, **scripts/i18n-surface.mjs** (key→EN dump helper)
</artifacts_this_phase_produces>

<specless_edge_coverage>
Probe fallback report (12 items, no SPEC file) — resolution record; zero silent drops:
1. I18N-05/empty → RESOLVED explicit: keycheck rejects empty/whitespace/non-string values in every dictionary (truth #5).
2. I18N-05/encoding → RESOLVED explicit: parity equality is exact code-point string-set equality via Set comparison against the extracted markup surface (truth #6 context; keycheck lines 99-110 unchanged).
3. I18N-05/idempotency → RESOLVED explicit: keycheck is a pure read-only script — re-running on unchanged input always yields the same PASS/FAIL (verified by the red-gate proof running twice).
4. I18N-05/concurrency → RESOLVED backstop: script is single-process read-only; a CI interruption leaves no partial state (no writes anywhere). Verifier can confirm read-only-ness only partially → backstop.
5. I18N-06/adjacency → RESOLVED explicit: variant tags fold by prefix — zh-TW/zh-Hant-CN/zh-HK→zh, in-ID/in→id, pt-PT→pt-BR (test vectors).
6. I18N-06/empty → RESOLVED explicit: empty candidate list / unknown tags → 'en' terminal (vectors xx-YY, fil-PH).
7. I18N-06/ordering → RESOLVED explicit: first supported match wins in candidate order; D-32 vector [en-US, es]→es and documented [zh, pt]→zh change lock the semantics.
8. I18N-07/unclassified → RESOLVED explicit: dir switching rides the existing applyLanguage pass; EN-restore auto-resets ltr (truth #8).
9. I18N-08/adjacency → RESOLVED explicit: option values are unique because SUPPORTED entries are unique; active value always ∈ SUPPORTED via existing readPref membership validation — no collision path.
10. I18N-08/empty → RESOLVED explicit: missing lang-switcher-slot → renderSwitcher returns early, no crash (existing `if (!slot) return` preserved).
11. I18N-08/ordering → RESOLVED explicit: option order = SUPPORTED order = fixed D-03 grouped blocks, never dynamic.
12. I18N-09/unclassified → RESOLVED explicit: digit-period exception (values like '0.88' pass) and ko exemption are documented in the gate header and red-gated in both directions.

Flagged assumptions surfaced (planner assumptions carried from RESEARCH.md, not silently dropped):
- Endonym spellings are the research draft list (हिन्दी variant chosen over हिंदी — stay consistent); owner spot-check per D-06 catches misspellings cheaply.
- node:test is expected to work on CI Node 24 (stable since Node 18, not yet exercised in CI) — if the first CI run reddens on this, fix is trivial.
- Urdu Nastaliq device rendering verification remains a STATE.md blocker — this plan ships the CSS; real-device visual check is an owner step.
</specless_edge_coverage>

<tasks>

<task type="tracer">
  <name>Task 1: End-to-end locale detection slice — prefix table + unit-tested harness</name>
  <files>js/i18n.js, scripts/i18n-detect.test.mjs, package.json</files>
  <read_first>
  - js/i18n.js (whole file — detect() hardcoded prefixes at lines 90–107, IIFE close ~247, SUPPORTED line 22)
  - 07-RESEARCH.md Patterns 1–2 and Pitfalls 1–3 (validated algorithm, export-hook placement, zh/pt behavior change)
  - scripts/i18n-keycheck.mjs (node built-ins-only script convention)
  - package.json (validate chain to extend)
  </read_first>
  <action>
  Replace the two hardcoded indexOf lines in detect() (js/i18n.js:101-102) with the flat DETECT_TABLE from research Pattern 1 — entries es→es, pt→pt-BR, fr, de, it, nl, pl, tr, vi, id, ru, hi, bn, ar, ur, ja, ko, zh, plus the legacy fold in→id. Critically: NO en key — EN stays the terminal return after the loop (D-32). Keep the existing silent-degradation try/catch contract (D-30): unknown tags keep scanning, terminal 'en'. Add the optional candidatesOverride parameter per research Pattern 1 so tests inject vectors without navigator gymnastics. Add the test-only export hook as the LAST lines inside the IIFE immediately before the closing paren-guard — gated on typeof module, so it is inert in browsers (Pitfall 1: outside the IIFE it throws ReferenceError). Create scripts/i18n-detect.test.mjs per research Pattern 2: document stub (readyState complete, addEventListener no-op, querySelectorAll returning []), createRequire over ../js/i18n.js, and the 23 vectors from research — including [en-US, es]→es (D-32), [zh, pt]→zh (documented intentional change per Pitfall 3), [fil-PH]→en, [in-ID]→id, [zh-Hant-CN]→zh. Add script validate:i18n-detect running node --test on the new file and chain it into the existing validate composite before validate:i18n. Note the [zh, pt] preference change in the commit message.
  </action>
  <verify>
  <automated>node --test scripts/i18n-detect.test.mjs (23/23 pass) && npm run validate:i18n-detect (exit 0) && npm run validate:i18n (exit 0)</automated>
  </verify>
  <acceptance_criteria>
  - node --test scripts/i18n-detect.test.mjs exits 0 with 23 passing tests, including detect(['en-US','es']) === 'es' and detect(['zh','pt']) === 'zh'
  - js/i18n.js contains a DETECT_TABLE declaration with an 'in' key mapping to 'id' and a 'zh' key mapping to 'zh'
  - The export hook sits inside the IIFE: the file's final lines read as the module-guard then the closing paren-guard, and node -e "globalThis.document={readyState:'complete',addEventListener(){},querySelectorAll(){return[]}};console.log(require('./js/i18n.js').detect(['in-ID']))" prints id
  - package.json validate script references validate:i18n-detect and that script invokes node --test scripts/i18n-detect.test.mjs
  - Browser-path behavior: no reference to module outside the IIFE guard; grep for module.exports in js/i18n.js returns exactly one hit, inside the IIFE
  </acceptance_criteria>
  <done>detect() is table-driven, 23/23 vectors green, harness wired into the validate chain, browser behavior unchanged except the documented zh-before-pt preference change</done>
</task>

<task type="auto">
  <name>Task 2: Harden i18n-keycheck — empty values + CJK half-width punctuation</name>
  <files>scripts/i18n-keycheck.mjs</files>
  <read_first>
  - scripts/i18n-keycheck.mjs (whole file — per-file loop shape check lines 94-98, parity lines 99-110 that must stay untouched)
  - 07-RESEARCH.md Pattern 6 + Pitfall 4 (predicate rules, digit-period exception, red-gate procedure)
  - js/i18n/es.json (existing value shapes — values with versions/dates like '0.88' must survive)
  </read_first>
  <action>
  Inside the per-dictionary loop, immediately after the flat-object shape check: (a) empty-value rejection — for every entry, a value that is not a string or whose trim is the empty string marks the file FAILED and prints the file name plus the offending key; this check applies to ALL dictionaries. (b) CJK half-width punctuation check scoped to exactly ja.json and zh.json (ko exempt — Korean commonly uses half-width punctuation; record the exemption reason in the script header comment per CONTEXT discretion): reject any value containing ASCII comma, exclamation, question, colon, semicolon, parenthesis, or double-quote; reject ASCII period unless it appears in a digit-digit context (regex permitting decimal/version patterns like 0.88 and 3.0). Write the period rule as one clear documented predicate — research sketches intent, ship a simple correct version. Update the header comment to describe both new checks, the exception, and the ko exemption. Do NOT touch the surface extraction or the exact set-equality block. Then red-gate both directions per Phase 6 precedent: copy ja.json to a temp file in the dictionaries directory, plant one empty value and one comma-containing value, run the gate and confirm per-key FAIL naming both, then plant a value containing 0.88 and confirm it passes the period rule; also plant an empty value in a copy of es.json to prove the empty check spans non-CJK files; delete all temp files afterward.
  </action>
  <verify>
  <automated>npm run validate:i18n (exit 0 on the clean tree after temp files are removed) && node scripts/i18n-keycheck.mjs (double-run idempotent PASS)</automated>
  </verify>
  <acceptance_criteria>
  - npm run validate:i18n exits 0 on the unmodified 3-dictionary tree
  - Red-gate: a dictionary copy containing an empty-string value produces FAIL output naming that file and key, exit 1
  - Red-gate: a ja dictionary copy containing a comma or half-width exclamation in a value produces FAIL naming file and key
  - A ja/zh value containing 0.88 passes the period rule (no false positive)
  - A ko-shaped file with half-width punctuation passes (exemption honored) while the same content in ja fails
  - The set-equality parity output lines (PASS — file exactly covers the N-key live surface) are textually unchanged; git diff shows no edits to the extraction regex or parity block
  - Running the script twice on an unchanged tree prints identical PASS output (idempotency probe closed)
  </acceptance_criteria>
  <done>Gate rejects empty values across all dictionaries and half-width punctuation in ja/zh, with the digit-period exception and ko exemption documented and red-gate-proven in both directions</done>
</task>

<task type="auto">
  <name>Task 3: Switcher select rewrite + RTL dir switching + CSS (logical props, rtl block, line-heights)</name>
  <files>js/i18n.js, css/base.css</files>
  <read_first>
  - js/i18n.js (SUPPORTED line 22, applyLanguage lang sync line 71, ENDONYMS line 148, renderSwitcher lines 150-174, bindSwitcher lines 180-191, finalize path)
  - css/base.css (body line-height line 40, h1-h3 lines 59-64, list indents lines 181 and 543, FAQ summary block lines 265-288, form-control token conventions)
  - 07-RESEARCH.md Patterns 3–5, Endonyms section, Pitfalls 6 and 8
  - 07-CONTEXT.md D-01..D-04 (select, slot placement, grouped order, endonym-only)
  </read_first>
  <action>
  Engine (js/i18n.js): grow SUPPORTED to exactly 20 entries in the D-03 grouped display order — en, es, pt-BR first; then Latin group fr, de, it, nl, pl, tr, vi, id; Cyrillic ru; Greek el; Indic hi, bn; Arabic ar, ur; CJK ja, ko, zh (el placed as its own script group between Cyrillic and Indic — document the placement choice in the commit). Detection no longer depends on array order (table-driven since Task 1). Rewrite renderSwitcher per research Pattern 4: clear the slot, build one select with class lang-select, one option per SUPPORTED entry — value and lang attribute set to the language code, label textContent is the endonym from the research list only (no English glosses, no optgroups — D-04; हिन्दी spelling chosen, stay consistent), then set the select value to the current language. The select builds into the existing footer lang-switcher-slot on all 5 keyed pages and nowhere else (D-02). Rewrite bindSwitcher to attach the change handler by property assignment on the slot element so re-renders never stack listeners (D-01). Remove the now-dead anchor-based rendering code paths from renderSwitcher. Add the engine-internal LANG_LABELS map — the word for Language in all 20 languages, drafted in this wave — applied as the select aria-label for the current language (Pitfall 6); labels never come from dictionary keys (Pitfall 5). Add RTL_LANGS = ar and ur; inside applyLanguage, immediately after the existing documentElement lang assignment, set documentElement dir to rtl for RTL languages and ltr otherwise (I18N-07, same pass, no separate DOM walk — the EN-restore path resets to ltr automatically). CSS (css/base.css): add .lang-select styling following existing form-control tokens with a 44px minimum tap target per research Pattern 5; convert the three direction-sensitive physical declarations to logical properties in place (list indents via margin-inline-start, FAQ summary via padding-block/padding-inline, FAQ chevron via inset-inline-end); add the [dir=rtl] override block as the designated home for anything the screenshot pass reveals (expected near-empty seed); add line-height overrides that target body and headings directly — html[lang=ur] body 2, html[lang=ur] h1..h3 1.9, html[lang=ja|zh|ko] body 1.7 — because html-level declarations would be defeated by body's own explicit 1.6 (Pitfall 8).
  </action>
  <verify>
  <automated>node --test scripts/i18n-detect.test.mjs && npm run validate:i18n && grep -c "documentElement.dir" js/i18n.js</automated>
  </verify>
  <acceptance_criteria>
  - js/i18n.js SUPPORTED contains exactly 20 entries in the D-03 grouped order with no duplicates; ENDONYMS has an entry for every SUPPORTED code
  - renderSwitcher creates a SELECT element with class lang-select into the element with id lang-switcher-slot; each option's textContent is the endonym and carries a lang attribute equal to its value
  - The switcher change path is wired via slot.onchange property assignment; grep for addEventListener within the bindSwitcher function body returns nothing
  - applyLanguage sets documentElement.dir once, keyed on an RTL set containing exactly ar and ur; grep for documentElement.dir in js/i18n.js returns exactly one assignment site
  - css/base.css contains an html[lang="ur"] body rule with line-height 2, an html[lang="ja"] (or grouped ja/zh/ko) body rule with line-height 1.7, a [dir="rtl"] block, a .lang-select rule with min-height 44px, and margin-inline-start / padding-inline / inset-inline-end replacements at the three converted sites (lines ~181, ~269, ~281, ~543)
  - No dictionary key is consumed by the switcher: npm run validate:i18n exits 0 after the rewrite (parity unchanged)
  - Owner-rendered checks (non-blocking here, covered by D-06 skim after deploy): computed line-height on a paragraph under lang=ur shows 2, select is keyboard/AT-operable, mirrored layout under ar
  </acceptance_criteria>
  <done>20-endonym select lives in the footer slot on all keyed pages, persists via the existing path, ar/ur flip html dir=rtl in the same pass, and base.css mirrors via logical properties with script-appropriate line-heights</done>
</task>

</tasks>

<verification>
- npm run validate (full chain incl. new detect tests) exits 0 locally
- All 5 success-criteria items this plan owns: detection vectors green (SC3), RTL dir + line-heights shipped (SC2 code side), 20-endonym select + persistence (SC4), hardened gate rejects empty/CJK-half-width (SC5 mechanics)
- SC1/SC2 rendering completion lands via plans 02–05 dictionaries plus the D-06 owner skims
</verification>

<success_criteria>
- npm run validate green with the new validate:i18n-detect step chained in
- 23/23 detection vectors pass, D-32 behavior locked, [zh, pt] change documented
- Gate red-gate-proven for empty values (all files) and CJK punctuation (ja/zh, ko exempt, version numbers safe)
- One atomic engine commit; no dictionary files touched; no markup edits on any page
</success_criteria>

<notes>
- Chain auto-run: no interactive checkpoints. Decisions rated: engine-first ordering and D-03 grouped order are locked by CONTEXT; the el placement and हिन्दी spelling are reversible discretionary calls recorded here and in the commit message.
- Transient state after this wave: switcher shows 20 options while 17 dictionaries do not exist yet — selecting one silently stays EN (D-30 silent degradation, by design). Resolves as dictionary waves land; noted for the owner.
- No COVERAGE.md raised: the phase API-coverage detector returned detected=false (no external API integration — Firebase untouched this phase).
</notes>

<output>
Create `.planning/phases/07-localization-20-rtl/07-01-SUMMARY.md` when done
</output>
