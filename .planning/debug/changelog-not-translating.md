---
status: diagnosed
trigger: "sorry, one error, changelog is only in english, even when setting site to spanish"
created: 2026-09-05T19:00:00Z
updated: 2026-09-05T19:20:00Z
---

## Current Focus

hypothesis: CONFIRMED — No code bug in the changelog translation path. The English the user sees is the changelog ENTRY content (six article blocks: subheads Added/Changed/Fixed + all bullet copy), which is EN-unkeyed BY DOCUMENTED DESIGN ("documented i18n exception"). Chrome (nav/footer/title/intro) is fully keyed and both dictionaries carry the 17 changelog.* keys — root cause is an expectation/design mismatch, not a defect.
test: static reproduction of the translation flow: markup keys (geohist/changelog.html) → engine lookup (js/i18n.js flat dict[key]) → dictionary keys (js/i18n/es.json, pt-BR.json) → keycheck gate exact set-equality PASS at 169 (changelog.html registered in scripts/i18n-keycheck.mjs pages array)
expecting: chrome keys all resolve in both dictionaries; only entry content is unkeyed
next_action: owner design decision via /gsd-plan-phase --gaps: translate entries vs accept EN entries (optionally add a keyed "entries shown in English" notice, or key only the 3 category subheads)

## Symptoms

expected: Switch to Español or Português on /geohist/changelog.html — chrome (nav, footer, title, intro) reads in that language with tone parity; intro copy owner-approved (UAT test 9)
actual: "sorry, one error, changelog is only in english, even when setting site to spanish"
errors: none reported
reproduction: UAT test 9 (.planning/phases/06-changelog-page/06-UAT.md), switcher in changelog.html footer
started: discovered during end-of-phase UAT of 06-changelog-page

## Eliminated

- hypothesis: Chrome translation is broken on changelog.html — missing data-i18n attributes in markup
  evidence: geohist/changelog.html lines 27-33, 37-38, 110, 115-121, 126-128 carry data-i18n on every chrome node (nav ×5, nav aria, title, intro, back link, footer ×6, copyright, consent banner ×3) plus meta title/desc via data-i18n-attr; 17 changelog.* + 6 shared keys fully keyed
  timestamp: 2026-09-05T19:05:00Z
- hypothesis: Dictionaries are missing the changelog.* keys (silent per-node miss → EN fallback per D-30)
  evidence: es.json lines 154-170 and pt-BR.json lines 154-170 contain all 17 changelog.* keys with translations; node scripts/i18n-keycheck.mjs exits 0 — PASS for both dictionaries, exact set-equality over the 169-key live surface which INCLUDES geohist/changelog.html (registered at scripts/i18n-keycheck.mjs line 22)
  timestamp: 2026-09-05T19:07:00Z
- hypothesis: i18n engine (js/i18n.js) skips or fails on this page (e.g. per-page namespace detection unaware of changelog.html)
  evidence: engine is page-agnostic — flat key lookup dict[data-i18n] over one full-document snapshot; no page/path/namespace logic anywhere in js/i18n.js; same script tag, same switcher slot (span#lang-switcher-slot, line 122), same defer order as the working guide.html/index.html frame
  timestamp: 2026-09-05T19:09:00Z
- hypothesis: User saw the LIVE deployed site, which is stale/misconfigured
  evidence: git branch -vv shows main ahead 21 of origin/main — the ENTIRE v2.0 milestone (including changelog.html, 3eeb38e..e176dda) is unpushed; https://persano.github.io has no changelog page at all (would 404, contradicting "changelog is only in english" which implies the page was seen). Report necessarily came from local viewing
  timestamp: 2026-09-05T19:12:00Z
- hypothesis: Environment artifact — user opened changelog.html via file:// so fetch('/js/i18n/es.json') fails (D-30 silent fallback) making EVERYTHING (chrome + entries) English
  evidence: mechanically possible (fetch fails under file://), but page-agnostic — under file:// NO page would translate, contradicting the user singling out changelog while other pages presumably translated during the same UAT. Cannot run a browser to confirm; noted as residual caveat, not the primary cause
  timestamp: 2026-09-05T19:14:00Z

## Evidence

- timestamp: 2026-09-05T19:02:00Z
  checked: geohist/changelog.html full markup
  found: chrome 100% keyed with changelog.* namespace (mirrors guide.html frame 1:1); entries region (6 article.changelog-entry blocks, lines 40-108) has ZERO data-i18n — version headers numeric, subheads Added/Changed/Fixed and all bullets EN-unkeyed
  implication: markup layer correct; entries unkeyed deliberately
- timestamp: 2026-09-05T19:07:00Z
  checked: js/i18n/es.json + js/i18n/pt-BR.json + scripts/i18n-keycheck.mjs execution
  found: 17 changelog.* keys present in BOTH dictionaries with full translations; keycheck PASS both at 169 exact set-equality; changelog.html in keycheck pages array; on-disk filenames es.json / pt-BR.json exactly match engine's DICT_URL_PREFIX+lang+'.json' fetch URLs (case-sensitive-safe)
  implication: dictionary + gate layers correct; no missing-key path to silent EN fallback for chrome
- timestamp: 2026-09-05T19:09:00Z
  checked: js/i18n.js engine logic (applyLanguage, loadDict, switchTo, init)
  found: flat dictionary lookup, page-agnostic; silent EN fallback only on fetch/parse failure; switcher + persistence storage key persano.lang identical on all pages
  implication: no mechanism by which changelog chrome stays English while other pages translate
- timestamp: 2026-09-05T19:12:00Z
  checked: git push state
  found: main ahead 21 of origin/main — changelog page and its i18n keys never deployed; live site is at v1 state
  implication: user report necessarily from local viewing; deploy is deferred pending UAT (06-01-SUMMARY Next Phase Readiness)
- timestamp: 2026-09-05T19:15:00Z
  checked: documented design decisions (06-01-SUMMARY.md key-decisions, STATE.md locked decisions, 06-02 test 7)
  found: "Changelog chrome keyed changelog.* mirroring guide.html 1:1; entry content stays EN-unkeyed (documented i18n exception)" — locked in STATE.md Decisions; 06-02 test 7 verified keysInsideEntries=0 as a PASS criterion
  implication: the remaining English on the page is exactly the documented exception; UAT truth ("chrome reads in selected language") is technically satisfied by the code, but the page reads as "in English" because the six entries dominate it

## Resolution

root_cause: Expectation/design mismatch, not a code bug. Changelog page chrome (nav, footer, title, intro, consent banner, meta) is fully keyed with changelog.* namespace, both es.json and pt-BR.json contain all 17 changelog.* keys, the i18n engine applies flat key lookup page-agnostically, and the keycheck gate proves exact set-equality PASS at 169 including changelog.html. The English text remaining when the site is switched to Spanish is the six changelog ENTRY articles — subheads (Added/Changed/Fixed) and all bullet copy are EN-unkeyed BY DOCUMENTED DESIGN ("entries are the documented i18n exception" — 06-01-SUMMARY key-decisions, locked in STATE.md, enforced as keysInsideEntries=0 by 06-02 test 7). The user's mental model (whole page in Spanish) diverges from the shipped design (keyed chrome + EN entries). Residual caveat: a literal all-English reading is only mechanically possible under file:// viewing (dictionary fetch fails silently per D-30) — an environment artifact affecting all pages equally, not a code defect.
fix: none applied (find_root_cause_only). This resolves to an owner design decision, not a bug fix
verification: static verification only (no browser available) — keycheck gate PASS re-executed this session; engine + markup + dictionaries cross-read; git push state verified
files_changed: []
