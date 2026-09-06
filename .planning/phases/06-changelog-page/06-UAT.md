---
status: complete
phase: 06-changelog-page
source: 06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md, 06-VERIFICATION.md
started: 2026-09-05T18:05:00Z
updated: 2026-09-06T00:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Changelog page in Keep-a-Changelog timeline form (D1)
expected: Changelog page at /geohist/changelog.html in KaC timeline form with git-verified entry 0.88 — 2026-09-04 (Added/Fixed subheads, player-facing bullets, newest-first)
result: pass
source: automated
coverage_id: D1
covering: npm run validate:html exit 0; grep article.changelog-entry + time datetime=2026-09-04 + h3 Added/Fixed matched

### 2. Atomic i18n wiring, 169-key surface (D2)
expected: Keyed chrome + per-page nav/footer keys + 23 keys in es/pt-BR + keycheck pages registration in ONE commit; exact set-equality PASS at 169
result: pass
source: automated
coverage_id: D2
covering: i18n-keycheck PASS both dictionaries at 169; commit cba2763 diff contains markup + es.json + pt-BR.json + keycheck.mjs together

### 3. Reachability from all pages (D3)
expected: Nav + footer Changelog links on index/guide/contact, plain nav link on privacy, root hub untouched, sitemap + smoke-check enumerate the URL
result: pass
source: automated
coverage_id: D3
covering: validate:links 18 links all [200]; grep anchors index/guide/contact ×2, privacy ×1, root ×0; sitemap + smoke-check contain the URL

### 4. Red gate proof (D4)
expected: Keycheck failure directions (missing probe key, unregistered page) + dead-link direction each proven red (exit 1) then reverted to green
result: pass
source: automated
coverage_id: D4
covering: red-gate-proof.md — cycles a/b/c with observed output + exit codes

### 5. Curated owner-review draft (06-02 D1)
expected: 6 milestone entries (version, git-mined ISO date, arc, Added/Changed/Fixed bullets) in backfill-draft.md
result: pass
source: automated
coverage_id: 06-02/D1
covering: Test-Path + 6 '^## ' sections + 2026-09-04 present; every draft date equals a versionName-touching commit date

### 6. Full curated arc in entries region (06-02 D2)
expected: 6 article.changelog-entry rows, 0.88 (2026-09-04) first, dates non-increasing, 0.8>0.7 version-descending tie-break
result: pass
source: automated
coverage_id: 06-02/D2
covering: regex count articles=6 times=6; h2 order 0.88→0.87→0.84→0.8→0.7→0.2 with dates 09-04/09-02/08-31/08-26/08-26/08-24

### 7. Entry content rules (06-02 D3)
expected: Subheads limited to Added/Changed/Fixed, 1-4 bullets per category, zero data-i18n inside entries, player-facing plain language
result: pass
source: automated
coverage_id: 06-02/D3
covering: keysInsideEntries=0; allowedH3=9 totalH3=9; bullet counts all 1-4

### 8. Phase-closing validate battery green (06-02 D4)
expected: Key surface untouched after content edit; HTML/links/i18n all pass
result: pass
source: automated
coverage_id: 06-02/D4
covering: keycheck PASS both dictionaries at 169; npm run validate exit 0 (18 links all 200)

### 9. Translated chrome quality (es/pt-BR)
expected: Switch to Español or Português on /geohist/changelog.html — chrome (nav, footer, title, intro) reads in that language with tone parity to existing dictionaries; intro copy owner-approved
result: issue
reported: "sorry, one error, changelog is only in english, even when setting site to spanish"
severity: major

### 10. Owner content review of backfilled milestones
expected: You read the 6 backfilled entries — arc truthful, tone and depth right, 0.88 at top, intro wording approved — before any public deploy push
result: pass

### 11. UAT test 9 re-run — G-06-9 closure (06-03 D-notice)
expected: Switch site language to Español on /geohist/changelog.html — notice 'Las entradas de abajo se muestran en inglés.' visible above the entries; nav/footer/title/intro in Spanish; the 6 entry articles correctly still in English (pt-BR: 'As entradas abaixo são mostradas em inglês.')
result: pass

### 12. Visual placement check (06-03 notices)
expected: /geohist/privacy.html shows the trilingual EN/ES/PT line under 'Last updated'; /geohist/changelog.html shows the notice between intro and first entry, styled muted/small; both visible, correctly placed, no layout breakage, no translate button/widget anywhere
result: pass

### 13. Deploy push gate confirmation (owner)
expected: Owner confirms UAT re-run passes; /gsd-ship lands the 5-file atomic set (changelog.html, privacy.html, base.css, es.json, pt-BR.json) before push — 06-03 code changes are deferred-commit (uncommitted in working tree, ledger in 06-03-SUMMARY.md)
result: pass

## Summary

total: 13
passed: 12
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-06-9
  truth: "Changelog page chrome (nav, footer, title, intro) reads in the selected site language (Spanish/Portuguese)"
  status: resolved
  resolved_by: 06-03-PLAN
  resolved_at: 2026-09-05
  reason: "User reported: sorry, one error, changelog is only in english, even when setting site to spanish"
  severity: major
  test: 9
  root_cause: "Expectation/design mismatch, not a code bug. Chrome (nav/footer/title/intro) is fully keyed with changelog.* — es.json + pt-BR.json carry all 17 keys, engine applies page-agnostically, keycheck PASS at 169 including changelog.html. The English the user sees is the six changelog ENTRY articles (subheads Added/Changed/Fixed + bullets), EN-unkeyed by documented design (06-01 key-decisions i18n exception, enforced keysInsideEntries=0). Entries dominate the page, so it reads as 'in English'. Owner design decision needed."
  artifacts:
    - path: "geohist/changelog.html"
      issue: "entries region zero data-i18n (deliberate, documented exception) — dominates page visually"
  missing:
    - "Owner design decision: (a) key entry content, (b) accept EN entries + add keyed per-language 'entries shown in English' notice, or (c) key only the 3 category subheads"
  debug_session: ".planning/debug/changelog-not-translating.md"
