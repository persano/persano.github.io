# Phase 7: Localization ×20 + RTL - Context

**Gathered:** 2026-09-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver full-site localization for the app's 20 supported languages: 17 new JSON dictionaries (hi, zh, fr, vi, nl, ur, el, ko, tr, de, ja, ru, id, pl, it, bn, ar) at exact key parity with the live 169-key surface, CI-gated; a data-driven locale-detection prefix table replacing the hardcoded pt/es checks (legacy `in-*`→id, `zh-*`→zh Simplified, es/pt preserved), unit-tested; RTL mirroring for ar/ur (`dir` switching inside the `i18n.js` applyLanguage pass, `[dir="rtl"]` CSS override block, bidi isolation, per-language line-height overrides — Urdu Nastaliq ~2, CJK ~1.7); a 20-endonym language switcher replacing the 3-link inline list, persisting to `persano.lang`; and a hardened key-parity gate (empty-value rejection + CJK half-width punctuation check). Dictionary drafting is agent-drafted in waves of 3–4 languages using per-language app-`strings.xml` glossaries and a two-pass process. No per-language static subdirs or hreflang (locked Phase-2 decision), no new pages, no translated changelog entries (existing EN exception stands).

</domain>

<decisions>
## Implementation Decisions

### Switcher UI
- **D-01:** Switcher is a **native `<select>`** — no `<details>` popover, no inline list. Native keyboard/screen-reader behavior for free, zero new interaction JS, matches zero-build spirit. `js/i18n.js` `renderSwitcher()` is rewritten to build a select (options carry `data-persano-lang` or are handled via `change` event on the slot container — planner's call); the delegated-handler anti-pattern (re-render stacking listeners) must be preserved.
- **D-02:** Select lives in the **existing footer `lang-switcher-slot` only** — no header/nav placement, no new layout touchpoints on any page. Hub root page included (it already loads i18n.js).
- **D-03:** Endonyms are ordered in **grouped blocks**: en, es, pt-BR first (established languages), then the 17 new languages grouped by script (Latin, Cyrillic, Indic/Thai, Arabic, CJK). Fixed order, no dynamic reordering.
- **D-04:** Option labels are **endonym only** (native-script name, e.g., 日本語 for ja; plain Latin-script endonyms for de/fr/it/etc.). No English glosses, no `<optgroup>` labels.

### Dictionary Drafting Workflow
- **D-05:** Wave order driven by **market size first** — largest expected player bases translate first (e.g., W1 hi+de+fr+ru, W2 ja+ko+tr+id, W3 it+pl+nl+vi, W4 el+bn+ar+ur +zh). Exact wave composition is the planner's call; the *driver* (market size) is locked. — **Reversibility:** reversible — waves are commit batches; reordering later waves costs nothing.
- **D-06:** **Per-wave owner spot check** — each 3–4-language batch lands as one commit; owner skims the rendered site per wave (via the switcher). Not one final pass, not ungated. — **Reversibility:** reversible — per-wave gates are process, not code.
- **D-07:** Glossary source is **per-language `strings.xml`** — game terms (GeoHist, Art Detective, True/False, leaderboard names, mode names) pulled verbatim from each app locale's `values-*/strings.xml` so site copy matches in-app wording exactly. Not a curated key-terms subset, not EN-direct translation.
- **D-08:** Two-pass drafting means a **full re-read pass**: pass 1 drafts all ~169 keys, pass 2 re-reads every value for register consistency, length behavior (EN strings are long — de/vi grow ~20–35%, ja/zh shrink), and punctuation correctness. Not a risk-key-only pass, not single-pass.

### the agent's Discretion
- Exact wave-to-language composition (within market-size driver) and CI/plan wave structure per ROADMAP hint.
- Detect-table implementation shape (prefix table data structure, unit-test framework choice — node:test fits zero-build) — I18N-06 already defines the mapping contract.
- zh dictionary filename/tag: `zh.json` / tag `zh` (Simplified-only — resolved this session, see specifics).
- CSS shape of the select styling (follow existing footer/form control conventions in `css/base.css`); minor visual polish of `[dir="rtl"]` override block coverage.
- Bidi isolation mechanism (bdi elements vs `dir="auto"` on text nodes) — researcher/planner decision per I18N-07.
- Punctuation-gate scope detail: whether the CJK half-width check applies to ja+zh only or includes ko (Korean commonly uses half-width punctuation) — agent decides, document the rule in the gate script.
- Line-height override implementation (per-lang attribute selectors vs class) in `css/base.css`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning / Requirements
- `.planning/ROADMAP.md` — Phase 7 goal, 5 success criteria (17-dict parity, RTL mirroring + line-heights, legacy-tag detection unit-tested, 20-endonym switcher + persistence, hardened CI gate), plan-as-waves hint
- `.planning/REQUIREMENTS.md` — I18N-05 … I18N-09 exact wording (lines 19–23); Out-of-Scope table
- `.planning/STATE.md` — Accumulated Context: locked dictionary-swap architecture decision; blockers list (register-table owner pass; zh variant — now resolved; Urdu Nastaliq device verification)
- `.planning/PROJECT.md` — Key Decisions table (i18n architecture, zero-build, agent-maintained model)

### Prior Phase Context
- `.planning/phases/06-changelog-page/06-CONTEXT.md` — changelog key namespace (`changelog.*`) that all 17 dictionaries must include; keycheck registration pattern; D-13–D-16 nav/footer key conventions

### Code (patterns to follow)
- `js/i18n.js` — the engine every requirement touches: `SUPPORTED` array (line 22), `detect()` hardcoded pt/es (lines 90–107 → replaced by prefix table), `renderSwitcher()` inline-links (lines 150–174 → replaced by select), `applyLanguage()` (dir switching rides here per I18N-07), snapshot/fallback contract (D-28/D-30), `persano:langchange` event
- `scripts/i18n-keycheck.mjs` — the CI gate to harden: surface extraction, exact set-equality per dictionary (line 99–110); gains empty-value + CJK punctuation checks (I18N-09); covers all 20 dictionaries automatically once files exist
- `js/i18n/es.json`, `js/i18n/pt-BR.json` — shape reference for the 17 new dictionaries (flat JSON, exact key parity, ~169 keys incl. `changelog.*`)
- `css/base.css` — gains `[dir="rtl"]` override block and per-language line-height rules; existing utility/section conventions apply
- `geohist/index.html` line 178 — `lang-switcher-slot` span the select replaces; other keyed pages carry the same slot
- `scripts/smoke-check.sh` — existing smoke gate; check whether dictionary fetch paths need coverage for new locales (researcher verifies)

### Content Source (external, absolute path)
- `C:/Users/Familia/antigravity/GeoHist-Trivia/shared/src/androidMain/res/values-*/strings.xml` — per-language app glossary (D-07). Authoritative source list confirmed this session: ar, bn, de, el, es, fr, hi, id, it, ja, ko, nl, pl, pt, ru, tr, ur, vi, zh (plus base) — exactly the phase's 20-language set; `values-zh` only (no `values-zh-rTW`) ⇒ zh = Simplified confirmed.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `js/i18n.js` engine — snapshot/apply/detect/persist/switcher architecture already production-proven for 3 languages; scaling to 20 touches data tables (SUPPORTED, ENDONYMS, detect prefix map) rather than core logic
- `scripts/i18n-keycheck.mjs` — gate design ("covers whatever dictionaries exist") means adding 17 JSON files extends CI coverage with zero script edits for parity; only hardening checks are new
- `persano.lang` localStorage + `readPref()` membership validation — switcher persistence (I18N-08) reuses this verbatim; new languages auto-accepted once in SUPPORTED
- `persano:langchange` event — any RTL `dir` sync on consent banner or contact form rides this, no new coupling

### Established Patterns
- Silent-degradation failure policy (D-30/SC3): unsupported locale, missing dict, failed fetch → page stays EN, no error UI — detection table must preserve this
- Keyed-node plain-text rule: `data-i18n` targets carry no child markup — bidi isolation must not require markup inside keyed nodes (use attribute-level `dir` on ancestors or bdi wrapping outside keyed spans)
- Zero build step, zero globals, zero page JS beyond the three shared `<script defer>` tags; node built-ins only for scripts
- Flat JSON dictionaries, exact set-equality gate, one-atomic-commit-per-language-surface convention (Phase 6 precedent)

### Integration Points
- `SUPPORTED` array + `ENDONYMS` map in `js/i18n.js` — grow to 20 entries; every new language added here activates detection, switcher, and keycheck coverage simultaneously
- `applyLanguage()` — gains `document.documentElement.dir` + lang-scoped attribute setting in the same pass (I18N-07 contract: no separate DOM walk)
- `css/base.css` — `[dir="rtl"]` block + line-height overrides keyed off `documentElement.lang`/`dir`
- CI validate job (`.github/workflows`) — keycheck hardening lands inside the existing gate invocation; no new workflow
- App repo `strings.xml` — read-only glossary mining per wave; no site↔app sync mechanism (one-time pull, agent re-checks when drafting)

</code_context>

<specifics>
## Specific Ideas

- Wave sketch from discussion (market-size driver, planner refines): hi+de+fr+ru → ja+ko+tr+id → it+pl+nl+vi → el+bn+ar+ur+zh
- Owner spot-checks each wave through the rendered site using the switcher — so the switcher (engine wave) must ship before or with wave 1
- zh Simplified-only confirmed this session from app source (`shared/src/androidMain/res/values-zh`, no regional variants) — closes the STATE.md blocker
- Switcher grouping: established trio first (en, es, pt-BR), then script-grouped new languages — endonym-only labels

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Open owner decisions deferred by STATE.md to their own phases: custom domain (Phase 8), App Check enforcement threshold (Phase 9), Play listing live date (gates Phase 10 SEO-06 flip).

</deferred>

---

*Phase: 7-Localization ×20 + RTL*
*Context gathered: 2026-09-06*
