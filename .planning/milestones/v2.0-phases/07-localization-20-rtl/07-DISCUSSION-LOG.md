# Phase 7: Localization ×20 + RTL - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-06
**Phase:** 7-Localization ×20 + RTL
**Areas discussed:** Switcher UI shape, Drafting wave order

---

## Switcher UI shape

| Option | Description | Selected |
|--------|-------------|----------|
| Native `<select>` | Zero new JS/CSS logic, keyboard/screen-reader behavior free, matches zero-build spirit | ✓ |
| Details dropdown | Native `<details>/<summary>` styled popover — more control, needs new CSS + focus management | |
| Inline list | 20 inline text links with wrap — simplest, noisy in footer | |

**User's choice:** Native `<select>`
**Notes:** First question of the area.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Footer slot only | Replaces inline list in existing footer lang-switcher-slot on every page, incl. hub | ✓ |
| Footer + header | Select in footer + compact select in header/site-nav — every page gains header markup + keys | |
| Footer only, hub too | Footer inline list → select; hub root page included; no header change | |

**User's choice:** Footer slot only
**Notes:** Keeps chrome change minimal across all pages.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped blocks | en, es, pt-BR first, then 17 grouped by script (Latin, Cyrillic, Indic/Thai, Arabic, CJK) | ✓ |
| Alphabetical endonym | Alphabetical by endonym — scripts scatter unpredictably | |
| Active first | Detected language auto-moves to top on each render — reorder motion | |

**User's choice:** Grouped blocks
**Notes:** Fixed order, no dynamic reordering.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Endonym only | Native-script name where non-Latin (e.g., 日本語); plain Latin endonyms otherwise | ✓ |
| Endonym + English name | "Español — Spanish" style — 40 labels get long | |
| Endonym + optgroup labels | Native `<optgroup>` per script block with visible labels | |

**User's choice:** Endonym only
**Notes:** No English glosses, no optgroup labels.

---

## Drafting wave order

| Option | Description | Selected |
|--------|-------------|----------|
| Market size first | Biggest player bases first (e.g., hi+de+fr+ru → ja+ko+tr+id → it+pl+nl+vi → el+bn+ar+ur+zh) | ✓ |
| Simple first | Latin-script languages first — lowest risk before Indic/Arabic/CJK | |
| Hard first | RTL + CJK + Indic early — hard problems surface immediately | |

**User's choice:** Market size first
**Notes:** Exact wave composition left to planner; the driver (market size) is the locked part.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Per-wave spot check | Each 3–4-language batch = one commit; owner skims rendered site per wave | ✓ |
| One final pass | All 17 merge first, owner reviews once at phase end | |
| No gate | Agent ships all waves ungated | |

**User's choice:** Per-wave spot check
**Notes:** Implies switcher ships before/with wave 1 so owner can skim via the switcher.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Per-language strings.xml | Game terms pulled verbatim from each app locale's strings.xml | ✓ |
| Key-terms glossary only | App-repo mining for ~5–8 game terms; rest translated freely | |
| No glossary | Translate EN directly — fastest, risk of term divergence | |

**User's choice:** Per-language strings.xml
**Notes:** Highest app↔site wording consistency.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Full re-read pass | Pass 2 re-reads every value: register consistency, length behavior, punctuation | ✓ |
| Risk-key pass | Pass 2 checks only flagged risky keys | |
| Single pass | Skip pass 2; CI + owner spot-check catch issues | |

**User's choice:** Full re-read pass
**Notes:** ~169 keys per dictionary; catches de/vi length growth and ja/zh shrinkage before CI.

---

## the agent's Discretion

- Exact wave-to-language composition and CI wave structure (within market-size driver)
- Detect-table data structure + unit-test framework choice (node:test fits zero-build)
- zh dictionary filename/tag (`zh.json`)
- Select styling in `css/base.css`; `[dir="rtl"]` block coverage and line-height implementation
- Bidi isolation mechanism (bdi vs `dir="auto"`), respecting keyed-node plain-text rule
- CJK punctuation-gate scope (ja+zh only vs including ko) — document rule in gate script

## Deferred Ideas

None — discussion stayed within phase scope.
