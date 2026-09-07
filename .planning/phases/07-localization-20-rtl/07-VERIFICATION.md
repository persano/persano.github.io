---
phase: 07-localization-20-rtl
verified: 2026-09-07T17:52:40Z
status: passed
score: 6/6 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification: []  # none — every owner-rendered check was executed and passed in 07-UAT.md (10/10, answered 2026-09-07)
gaps: []  # none — G-07-5a closed and re-verified; no new gaps found
notes: >-
  Deferred-commit mode: 27 uncommitted paths (engine files modified, 19 dictionaries incl. 17 untracked)
  are intentional per workflow config — NOT a gap. Verified gates: npm run validate, keycheck red-gate
  battery, detect test suite, all re-run by the verifier on the current working tree.
---

# Phase 7: Localization ×20 + RTL — Verification Report

**Phase Goal:** Visitors in any of the app's 20 supported languages see the whole site in their language, with properly mirrored layout for RTL readers
**Verified:** 2026-09-07T17:52:40Z
**Status:** PASSED
**Re-verification:** Initial VERIFICATION.md (first run; executed after gap-closure plan 07-06 landed — prior run never produced a verification report)

**Verifier method note (adversarial):** No SUMMARY claim was trusted. The verifier re-ran the full validate chain, re-ran the detect suite, re-ran the G-07-5a closure checks, and independently executed a 3-way red-gate battery against the hardened keycheck (planted empty value, planted missing key, planted half-width punct in ja.json — with byte-identical restore) before crediting any gate truth. Evidence below is from these verifier-run commands, not from SUMMARY prose.

## Goal Achievement

### Observable Truths

| # | Truth (roadmap SC / plan must-have) | Status | Evidence |
|---|-------------------------------------|--------|----------|
| 1 | **SC1/I18N-05** — Visitor in any of the 17 new locales is auto-detected and sees all pages translated; dictionaries at exact key parity with the live surface | ✓ VERIFIED | `npm run validate` exit 0 (verifier-run): keycheck **PASS ×19 @ exact 170-key live surface**, `i18n-keycheck: OK`; 19/19 `js/i18n/*.json` exist on disk (direct listing); full translation + detection owner-rendered: UAT tests 2, 8, 9 pass |
| 2 | **SC2/I18N-07** — ar/ur visitors get mirrored RTL layout, bidi isolation, script-appropriate line-heights (ur ~2, CJK ~1.7) | ✓ VERIFIED | Code (grep, verifier-run): `RTL_LANGS = {ar, ur}` (i18n.js:43), single `documentElement.dir` assignment site in applyLanguage pass (i18n.js:91), `[dir="rtl"]` block (base.css:591), `html[lang=ur] body` lh 2 (602), ur h1-h3 1.9 (608), CJK body 1.7 (614), logical props at 4 converted sites (183, 274, 286, 550), `bidi-override` 0 hits in css/+js/. Owner-rendered: UAT tests 4 (ar mirror + reset), 5 (ur RTL + airy spacing), 6 (ja lh 1.7) pass |
| 3 | **SC3/I18N-06** — Legacy/edge locale tags detect correctly via unit-tested prefix table | ✓ VERIFIED | Verifier-run: `node --test scripts/i18n-detect.test.mjs` — **23/23 pass** over the REAL engine (createRequire ../js/i18n.js); vectors cover in-ID/in→id, zh/zh-TW/zh-Hant-CN/zh-HK→zh, pt/pt-PT→pt-BR, es-419→es, [en-US,es]→es (D-32), [zh,pt]→zh (documented intentional), fil-PH/xx-YY→en terminal |
| 4 | **SC4/I18N-08** — Switcher presents all 20 endonyms as a compact select and persists choice to `persano.lang` | ✓ VERIFIED | Code (grep): SUPPORTED 20 entries in D-03 grouped order, ENDONYMS 20, LANG_LABELS 20 (aria-label i18n.js:219), native `<select class="lang-select">` built into `lang-switcher-slot` (i18n.js:213-218), slot present in all 5 keyed HTML pages, script include in all 5, `slot.onchange` property assignment (i18n.js:238, no listener stacking), persistence via switchTo()→persano.lang. Owner-rendered: UAT test 1 (20 endonym options + tap target), test 2 (persistence across reload) pass |
| 5 | **SC5/I18N-09** — CI gate rejects missing keys, empty values, CJK half-width punctuation — across all 20 dictionaries (19 JSON + EN markup baseline) | ✓ VERIFIED | Verifier-run red-gate battery (3 planted defects, all rejected): (a) empty value in temp non-CJK dict → `FAIL — empty/non-string value for "hub.meta.title"`, exit 1; (b) missing key → `FAIL — 169/170, missing keys (1): hub.meta.title` + DRIFTED, exit 1; (c) half-width comma in planted ja.json value → `FAIL — contains half-width punctuation`, exit 1; real ja.json restored **byte-identical**; clean double-run prints identical `OK` (idempotent). PUNCT_LANGS = {ja.json, zh.json}, ko exempt, digit-period exception (keycheck.mjs:41-46,129-133). Chained into `npm run validate` (package.json:5) |
| 6 | **G-07-5a closure (07-06)** — FAQ languages answer states the count-style 20-language surface in EN baseline + all 19 dictionaries; key surface unchanged | ✓ VERIFIED | Verifier-run: EN `geohist/index.html:142` reads "English, Spanish, Portuguese and 17 more languages." and old "Portuguese and more" phrasing gone (0 hits); node count-check over all 19 dicts — `OK: all 19 count-style` (19/19 `geohist.faq.languages.a` contain "17"); keycheck exact-parity green ⇒ key set unchanged at 170 |

**Score:** 6/6 truths verified — **behavior_unverified: 0** (the DOM state transitions — dir flip on applyLanguage, EN-restore ltr reset, switcher rendering — carry no automated node:test, but were exercised owner-rendered in 07-UAT.md tests 1–6, 10/10 pass, answered 2026-09-07; per phase instruction that UAT evidence is the owner-rendered proof for visual/RTL/switcher checks).

### G-07-5a Closure Record (explicit)

- Gap origin: 07-UAT.md — FAQ answer `geohist.faq.languages.a` stale ("English, Spanish, Portuguese and more", 3-language-era copy) in EN HTML + all 19 dictionaries.
- Closure: plan 07-06 — count-style phrasing ("…and 17 more languages." form) per user-approved decision (2026-09-07); Latin digit `17` in every locale.
- Verification (this run, not trusting SUMMARY): EN baseline check OK + 19/19 dictionary count-style check OK + full validate chain exit 0 + keycheck parity unchanged at 170. **Closed and re-verified.**

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `js/i18n.js` | DETECT_TABLE (19, no en), detect(candidatesOverride), RTL_LANGS, LANG_LABELS/ENDONYMS ×20, select switcher, dir switching | ✓ VERIFIED | All present + wired (greps above); module.exports single hit inside IIFE (i18n.js:302, browser-inert) |
| `scripts/i18n-detect.test.mjs` | node:test harness, document stub + createRequire, 23 vectors over real engine | ✓ VERIFIED | 23/23 pass (verifier-run); requires ../js/i18n.js |
| `scripts/i18n-keycheck.mjs` | empty-value + CJK-punct predicates, parity byte-unchanged, ko exempt, digit-period exception | ✓ VERIFIED | Predicates at lines 41-46/129-133; red-gate-proven both directions (verifier-run); clean PASS ×19 |
| `css/base.css` | .lang-select 44px, logical props ×3 sites, [dir=rtl] block, html[lang] line-heights | ✓ VERIFIED | Lines 159, 183, 274, 286, 550, 570-578, 591, 602/608/614 |
| `package.json` | validate:i18n-detect chained into validate | ✓ VERIFIED | Chain: html → links → i18n-detect → i18n (line 5) |
| `scripts/i18n-surface.mjs` | zero-dep key→EN dump, 170-key surface | ✓ VERIFIED | Exists; keycheck reports the same 170-key surface it feeds |
| `js/i18n/*.json` (19 files) | 17 new + es + pt-BR at exact 170-key parity, non-empty values | ✓ VERIFIED | 19/19 exist (direct dir listing); keycheck PASS ×19; zero empty values; debt-marker scan clean |
| `geohist/index.html` | EN baseline, FAQ count-style at line 142 | ✓ VERIFIED | Value present; old phrasing gone |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| js/i18n.js export hook | scripts/i18n-detect.test.mjs | in-IIFE module.exports + createRequire | ✓ WIRED | 23/23 vectors run against the real engine |
| 5 keyed pages | js/i18n.js | `<script defer src="/js/i18n.js">` + `lang-switcher-slot` | ✓ WIRED | Present in index.html + geohist/{index,guide,contact,changelog}.html |
| js/i18n.js applyLanguage | html dir/lang attributes | documentElement.lang + .dir same pass | ✓ WIRED | i18n.js:91, single assignment site; CSS keys off same attributes |
| [dir=rtl] block / html[lang] rules | ar/ur/ja/zh/ko rendering | attribute-driven direction + line-height | ✓ WIRED | base.css:591-614; owner-rendered in UAT 4/5/6 |
| Dictionary values | rendered page text | applyLanguage → data-i18n swap | ✓ WIRED | Owner-rendered: UAT 2/6/7/8 full-page translation, no EN leftovers |
| switchTo() | persano.lang persistence | stored pref beats detection | ✓ WIRED | UAT test 9 (manual switch survives reload); readPref membership validation |
| keycheck surface | live markup | extraction regex over 5 keyed pages | ✓ WIRED | 170-key surface reported; parity enforced set-equality |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| Switcher options | SUPPORTED/ENDONYMS | engine-internal arrays (20) | ✓ real | ✓ FLOWING |
| Translated text | js/i18n/{locale}.json values | 19 real dictionaries at 170-key parity | ✓ real | ✓ FLOWING |
| dir attribute | RTL_LANGS membership | engine set {ar, ur} | ✓ real | ✓ FLOWING |
| aria-label | LANG_LABELS[current] | engine-internal 20-word map | ✓ real | ✓ FLOWING |
| EN text | markup baseline | live HTML (no en.json — by design) | ✓ real | ✓ FLOWING |

No static/hardcoded/mock data source found anywhere in the chain.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full validate chain | `npm run validate` | exit 0; html clean, 18 links [200], detect 23/23, keycheck PASS ×19 @ 170, `OK` | ✓ PASS |
| Detection over real engine | `node --test scripts/i18n-detect.test.mjs` | 23 pass / 0 fail | ✓ PASS |
| G-07-5a EN baseline | node includes-check | `OK: EN baseline count-style` | ✓ PASS |
| G-07-5a 19 dicts | node includes-check | `OK: all 19 count-style` | ✓ PASS |
| Red-gate: empty value | planted zz-temp dict | FAIL names file+key, exit 1 | ✓ PASS (gate rejects) |
| Red-gate: missing key | planted 169-key dict | FAIL 169/170 + DRIFTED, exit 1 | ✓ PASS (gate rejects) |
| Red-gate: CJK punct (ja) | planted comma in ja.json | FAIL "contains half-width punctuation", exit 1; restore byte-identical | ✓ PASS (gate rejects) |
| Gate idempotency | double clean run | identical `OK` both runs | ✓ PASS |

### Probe Execution

No `scripts/*/tests/probe-*.sh` probes declared or conventional for this project. The behavioral probe role is served by the detect test suite + keycheck red-gate battery above (both verifier-run).

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|-------------|---------------|-------------|--------|----------|
| I18N-05 | 07-02, 07-03, 07-04, 07-05, 07-06 | 17 new-language dictionaries at exact key parity, CI-gated, waves + register table + glossary + two-pass | ✓ SATISFIED | keycheck PASS ×19 @ 170 keys (verifier-run); 19 dicts on disk; 07-02..05 register sweeps recorded in summaries (de Sie, fr vous, ru вы, ja です/ます, ko 해요체, tr siz, id Anda, it tu, pl Ty, nl je, vi pronoun-avoidant, el εσείς, bn আপনি, ar MSA, ur آپ, zh 您) |
| I18N-06 | 07-01 | Detection handles all 20 locale tags — prefix table, unit-tested | ✓ SATISFIED | 23/23 vectors green (verifier-run); DETECT_TABLE 19 entries + en terminal |
| I18N-07 | 07-01 | RTL visitors (ar, ur) get mirrored layout — dir in applyLanguage, [dir=rtl] CSS, bidi isolation, line-heights | ✓ SATISFIED | Code greps + owner-rendered UAT 4/5; bidi-override 0 hits |
| I18N-08 | 07-01 | 20-endonym select switcher, persists to persano.lang | ✓ SATISFIED | select ×20 endonyms in all 5 keyed pages; UAT 1/2/9 |
| I18N-09 | 07-01, 07-06 | Gate hardened: empty-value rejection + CJK half-width punct check | ✓ SATISFIED | Verifier red-gate battery (3/3 rejected); validate chain green |

**Orphaned requirements:** none — REQUIREMENTS.md maps exactly I18N-05..09 to Phase 7; plan frontmatter union = {05, 06, 07, 08, 09}; traceability table already marks all 5 Complete (matches evidence). I18N-10 correctly deferred to Future Requirements (prohibitions in plans 02-05 kept per-language subdirs/hreflang out — verified: no new .html dirs in diff scope).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | — | Debt-marker scan: TBD/FIXME/XXX/HACK/PLACEHOLDER/coming-soon across js/i18n.js, css/base.css, scripts/*.mjs, package.json, geohist/index.html, js/i18n/*.json | — | 0 hits |
| js/i18n.js | 101, 157-162 | `return null` | ℹ️ Info | Legit guards (restricted-storage re-detect, malformed/empty dictionary fallback per D-30 silent degradation) — not stubs; data-flow verified |

Deferred-commit mode: 27 uncommitted paths (engine + 19 dictionaries) are the workflow's intentional state — recorded in all summaries with /gsd-ship commit plans. **Not a gap.** Docs commits exist for all .planning artifacts (6cc76da, db71cf2, 0f56419).

### Broken-Windows Ledger Cross-Reference

Ledger entry **#10 (phase 7, unrun-verify)** — "computed line-height ur=2, select keyboard/AT-operable, mirrored layout under ar" — was recorded at 07-01 completion (02:29Z) as deferred-to-D-06-skim. The subsequent UAT run (updated 03:30Z) executed and passed exactly these checks (UAT tests 1, 4, 5). Substance is now owner-verified; the ledger row remains `open` as a bookkeeping item — recommend `gsd-tools windows fixed 10` at ship time. Ledger entries 1-9 belong to earlier phases and are out of scope here.

Standing owner items (recorded owner steps, explicitly non-blocking per plan 07-05 notes): Urdu Nastaliq real-device rendering check (STATE.md blocker); de Sie-vs-du review. Both ride the post-deploy D-06 skim.

### Human Verification Required

None. Every owner-rendered check for this phase was executed and passed in 07-UAT.md (10/10, answered 2026-09-07): switcher rendering/tap target, full-page translation + persistence, EN-restore reset, ar mirroring + reset, ur RTL + line-height, ja CJK rendering/punctuation, zh register/brand, multi-language sweep, browser detection + pref precedence, validate chain.

### Gaps Summary

No gaps. All 5 roadmap success criteria are true in the codebase (mechanics re-proven by the verifier; rendering proven by owner-rendered UAT evidence). G-07-5a is closed with user-approved phrasing and re-verified mechanically (EN + 19/19 dicts count-style, parity unchanged at 170 keys). The hardened gate was independently red-gate-tested in both directions by this verification run.

---

_Verified: 2026-09-07T17:52:40Z_
_Verifier: the agent (gsd-verifier)_
