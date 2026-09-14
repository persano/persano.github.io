---
phase: 13-home-migration
verified: 2026-09-14T00:00:00Z
status: passed
score: 10/12 must-haves verified
behavior_unverified: 2
overrides_applied: 0
prohibition_flags: # ADR-550 D4 — judgment-tier prohibitions, autonomous verify: LLM-judge verdicts with concrete file evidence, flagged for human review (never silent pass)
  - id: P-13-01
    verdict: judged-pass (LLM-judge, non-authoritative)
    evidence: "geohist/index.html is a 14-line declarative stub (meta refresh content=\"0; url=/\" + <a> fallback, zero <script>, zero data-i18n, zero stylesheet); landing content exists ONLY at root index.html — no copy at both URLs; no JS-only redirect"
    flagged: true
  - id: P-13-02
    verdict: judged-pass (LLM-judge, non-authoritative)
    evidence: "apps/index.html contains exactly one real app-card (GeoHist Trivia, CTA href=/); grep placeholder|coming soon|future app|soon → 0 matches"
    flagged: true
  - id: P-13-03
    verdict: judged-pass (LLM-judge, non-authoritative)
    evidence: "git diff geohist/privacy.html → exactly 1 line changed (footer href / → /apps/); policy content byte-identical; path unchanged"
    flagged: true
  - id: P-13-04
    verdict: judged-pass (LLM-judge, non-authoritative)
    evidence: "13-RUNBOOK.md §4: verbatim doc-exclusion quote (\"just add redirects, and update your sitemaps as appropriate\"), No refile / No cancel bullets, 180-day window until ~2027-03 stated untouched; \"There is nothing to click in this section\""
    flagged: true
behavior_unverified_items:
  - truth: "All 20 locales resolve at the new path / (landing keyed text renders per visitor language)"
    test: "Visit live / after deploy; switch to 2 non-EN locales (e.g. español, 日本語) via the footer switcher"
    expected: "Keyed nodes render translated text, no EN remnants; stored persano.lang preference survives the move"
    why_human: "Mechanism verified in repo (js/i18n.js untouched, DICT_URL_PREFIX='/js/i18n/' absolute, detect tests 23/23, keycheck 178×19) but per-locale rendering at the NEW URL is browser+CDN behavior no local test exercises — pre-staged as 13-UAT.md MIG-01 (EA-03)"
  - truth: "Visitor hitting /geohist/ (incl. via the legacy-host path-preserved chain) reaches the root landing via the meta-refresh-0 stub"
    test: "Visit live /geohist/ in a browser; then the same path via a legacy-host URL + /geohist/; optionally with a #faq fragment"
    expected: "Both entries land on the root GeoHist landing; stub shows the 'has moved' fallback if refresh ignored; a #faq fragment does NOT survive (top-of-page landing = CORRECT, Pitfall 7, not an issue)"
    why_human: "Stub file verified (meta refresh + <a> fallback + html-validate exit 0) but the visitor-experience chain (refresh behavior + hosting 301) is live-site behavior no local test exercises — pre-staged as 13-UAT.md MIG-02"
human_verification:
  - test: "13-UAT.md MIG-01 — live / full landing, EN + 2 non-EN locales"
    expected: "Every section present (hero, proof strip, OFF rating row, features, gallery, FAQ, CTA/about); both locales render translated keyed text"
    why_human: "Post-deploy live rendering (EA-01/EA-03)"
  - test: "13-UAT.md MIG-02 — live /geohist/ redirect, incl. legacy-host chain + #faq fragment note"
    expected: "Both entries land on root landing; top-of-page landing after #faq = correct, not an issue"
    why_human: "Post-deploy browser + hosting-301 behavior (Pitfall 7)"
  - test: "13-UAT.md MIG-04 — live sitemap.xml 6 URLs all 200 + per-page canonical/og:url spot-check"
    expected: "6 rows resolve; canonical == og:url at new paths; root JSON-LD url = https://geohisttrivia.com/"
    why_human: "Live-served artifact check"
  - test: "13-UAT.md MIG-05 — bash scripts/smoke-check.sh against live apex → ALL PASS"
    expected: "SMOKE CHECK: ALL PASS, exit 0 (incl. /apps/ 200 + stub 'has moved' grep) — closes red-gate-proof.md Cycle 5 direction 2"
    why_human: "Requires the deployed site (EA-17); direction-1 FAIL reproduced by this verifier against the pre-migration live site (expected)"
  - test: "13-UAT.md MIG-06 — deployed AGENTS.md matches new layout + CI validate green on ship commit"
    expected: "Deployed copy describes root landing / hub /apps/ / stub; old-domain gate green in CI"
    why_human: "Requires deploy + CI run"
  - test: "13-UAT.md MIG-07 — live /geohist/privacy.html frozen, byte-stable, correct icon"
    expected: "Same path, unchanged policy, /geohist/icon.png loads; only footer href differs"
    why_human: "Play-review compliance surface — live visual/content check"
  - test: "13-UAT.md MIG-08 — OWNER GSC CHECKPOINT: execute 13-RUNBOOK.md §2–§5 (sitemap resubmit, URL inspection ×5, no-CoA guard, Rich Results + og:url)"
    expected: "Resubmit recorded with date + Success over 6-URL set; per-URL outcomes recorded; zero CoA actions"
    why_human: "Owner-only GSC console access (EA-17)"
  - test: "13-UAT.md MIG-09 — live 404 link → /apps/ 'Back to the hub'; sub-page nav/footer spot-checks"
    expected: "404 label unchanged, target /apps/; guide/contact/changelog nav Game → /, FAQ → /#faq, footer back → /apps/"
    why_human: "Live rendered-anchor check"
---

# Phase 13: Home Migration Verification Report

**Phase Goal:** Site root serves the GeoHist landing; the portfolio hub lives at `/apps/` — visitors, Play reviewers, and Google all see the new layout with zero broken paths and zero dictionary drift
**Verified:** 2026-09-14 (working-tree verification, deferred-commit mode — uncommitted migration set is BY DESIGN, lands as ONE atomic commit at /gsd-ship)
**Status:** human_needed (all deliverable-level must-haves verified; 8 post-deploy checks pre-staged in 13-UAT.md pending by design — EA-17) [superseded 2026-09-14, ship-gate reframe: frontmatter flipped to `passed` per owner-approved reframe — the 9 post-deploy rows moved verbatim to `13-RECORDS.md` (phase-12 precedent); they remain the phase's post-ship vehicle; this verifier saw status `human_needed` and the reframe happened at ship preflight]
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Root `/` serves the full GeoHist landing — hero, proof strip, OFF rating row (hidden, one star SVG), features, gallery, FAQ, CTA/about; EA-01 sequence verbatim | ✓ VERIFIED | Read `index.html` L76–L225 (all 7 sections, same order); keycheck PASS ×19 over the moved markup; a11y battery scanned `/` as the landing (red-gate Cycle 4 PASS run — file hash 425F1FDE… matches current bytes, verified live) |
| 2 | All 20 locales resolve at the new path | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Mechanism proven: `js/i18n.js` NOT in the diff (untouched), `DICT_URL_PREFIX='/js/i18n/'` absolute (L38), i18n-detect 23/23, surface 178×5; live per-locale rendering at the NEW URL unexercised → 13-UAT.md MIG-01 |
| 3 | Visitor hitting `/geohist/` (incl. legacy-host chain) reaches root landing via meta-refresh-0 stub | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Stub verified: `geohist/index.html` carries `content="0; url=/"` (L9), noindex,follow (L6), canonical `/` (L8), `<a href="/">` fallback (L12), zero scripts/data-i18n/stylesheet; `npx html-validate geohist/index.html` exit 0; live visitor chain unexercised → 13-UAT.md MIG-02 |
| 4 | `/geohist/privacy.html` path + policy frozen; only permitted change is the single href-only footer back-link (P-13-03) | ✓ VERIFIED | `git diff --numstat` = 1/1; hunk shows ONLY `<a href="/">` → `<a href="/apps/">` on the footer back-link; policy content byte-identical; file path unchanged |
| 5 | `/apps/` serves the portfolio hub (former root content verbatim, 13 `hub.*` keys, keyed chrome) with zero placeholder cards (P-13-02) | ✓ VERIFIED | Read `apps/index.html` — 13 `hub.*` keys present (meta.desc/title, brand, intro.1/2, card.icon-alt/name/desc/cta, footer.privacy/contact/consent/copyright); exactly ONE app-card; grep placeholder/coming-soon → 0; og:image stays `/geohist/og-image.png` (L13/19) |
| 6 | Sitemap: exactly 6 apex `<loc>` rows, no redirected URL listed; per-page canonical == og:url == JSON-LD `url` at new paths | ✓ VERIFIED | Read `sitemap.xml` — 6 rows (`/`, `/apps/`, guide, changelog, contact, privacy), zero lastmod, stub absent; root index.html L8/L12/L44 all `https://geohisttrivia.com/`; hub L8/L12 `…/apps/`; sub-page canonicals untouched (numstat 3/3 = exactly the 3 nav/footer anchors) |
| 7 | All five gate page-lists + the star-uniqueness path cover the new layout, red-gate proven both directions (MIG-05) | ✓ VERIFIED | All 6 hardcodes read at new values: keycheck pages[] L49 + star path L185 (`join(repoRoot,'index.html')`), surface pages[] L32, a11y PAGES L59–64 (`/apps/` in, stub out), smoke-check L26 `$BASE/apps/` + L55 stub grep + L49 byte-untouched, package.json L6 glob + `apps/index.html`. `red-gate-proof.md`: 6 cycles, FAIL+PASS records, sha256 snapshot restores, 0 `git restore` literals. **All 5 red-gate-tracked file hashes match CURRENT working-tree bytes** (425F1FDE/B8E65196/2D7C34D5/E8E41355/B0AB9B1C — re-computed live). Direction-2 live smoke ALL PASS = pre-staged UAT row (by design, EA-17) |
| 8 | AGENTS.md reflects the new layout and rides the SAME commit as the migration; old-domain gate still green (MIG-06) | ✓ VERIFIED (prepared state) | `git diff AGENTS.md` = 4 hunks, 8+/7− — exactly Project ¶ (L9), Hosting constraint (L20), stale 10-RUNBOOK path (L79 → `.planning/milestones/v2.0-phases/10-gated-social-proof/10-RUNBOOK.md`, OQ4), file map (L119–122); AGENTS.md IS in the uncommitted migration set (`git status` = M); `node scripts/check-no-old-domain.mjs` → OK, exit 0 live; same-commit assembly = ship-time event (verify-work context: compliant) |
| 9 | 404 page + every nav/footer anchor point at the new layout; 404 visible text unchanged; key surface exactly 178 × 19 (MIG-09) | ✓ VERIFIED | `404.html` L20: href `/apps/`, text "Back to the hub" unchanged; smoke-check L49 grep byte-untouched; guide/contact/changelog numstat 3/3 each = exactly nav.game → `/`, nav.faq → `/#faq`, footer.back → `/apps/` (grep-verified); `node scripts/i18n-keycheck.mjs` → PASS ×19 (178-key set-equality), LIVE re-run by this verifier |
| 10 | Owner can execute post-deploy GSC steps from the console UI alone per 13-RUNBOOK.md, zero secrets (MIG-08) | ✓ VERIFIED | RUNBOOK §1–§5 console-UI only; secret-shape grep → only the public-artifact disclaimer lines; `github\.io` grep → 0 matches; every step names a console screen/URL, no credentials anywhere |
| 11 | No-CoA refile/cancel explicitly forbidden with doc-verified rationale; 180-day window until ~2027-03 untouched (P-13-04) | ✓ VERIFIED | RUNBOOK §4: verbatim quote "just add redirects, and update your sitemaps as appropriate"; **No refile** / **No cancel** bullets; "There is nothing to click in this section"; 13-UAT.md MIG-08 §4 pass-condition line |
| 12 | Post-deploy owner steps pre-scaffolded in 13-UAT.md with mechanical pass/issue recording | ✓ VERIFIED | 13-UAT.md: 9 rows (MIG-01..09), all `status: pending` + `result: pending`, zero pre-filled outcomes; MIG-08 = owner GSC checkpoint with per-URL recording slots; mechanical predicate ("any recorded issue is a blocker") in the header; Pitfall-7 expectation note on MIG-02 |

**Score:** 10/12 truths verified (2 present, behavior-unverified — both pre-staged as 13-UAT.md rows by design)

### Deferred Items

None — no failed truth is parked on a later phase. The post-deploy rows are owned by this phase's own UAT gate (13-UAT.md), not deferred work.

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `index.html` | GeoHist landing at root, verbatim move + repointed head/hrefs | ✓ VERIFIED | All sections; canonical/og:url/JSON-LD url → `/`; nav.game `/`, nav.faq `/#faq`, footer.back `/apps/`; star SVG exactly 1; og:image + JSON-LD image/screenshot stay `/geohist/` |
| `apps/index.html` | NEW hub, former root verbatim + repointed canonical/og:url/CTA | ✓ VERIFIED | canonical/og:url → `/apps/`; card CTA → `/`; 13 hub.* keys; zero placeholders |
| `geohist/index.html` | meta-refresh-0 stub, self-contained | ✓ VERIFIED | 14 lines; noindex,follow + canonical `/` + `<a>` fallback; zero scripts/data-i18n/stylesheet; html-validate exit 0 |
| `404.html` | href-only edit, text unchanged | ✓ VERIFIED | 1/1 diff; `/apps/` target; "Back to the hub" intact |
| `sitemap.xml` | 6 apex `<loc>` rows, `/geohist/` swapped to `/apps/` | ✓ VERIFIED | 6 rows, row 2 `/apps/`, no stub row, no lastmod |
| `scripts/i18n-keycheck.mjs` | pages[] repointed + star path → root index.html | ✓ VERIFIED | L49 new array; L185 root path; PASS ×19 live |
| `scripts/i18n-surface.mjs` | pages[] repointed | ✓ VERIFIED | L32 new array; `178 keys across 5 pages` live |
| `scripts/a11y-audit.mjs` | PAGES: `/apps/` replaces `/geohist/`, stub excluded | ✓ VERIFIED | L59–64: root, apps, guide, contact, privacy — 5 rows, no stub |
| `scripts/smoke-check.sh` | URL list + `$BASE/apps/` + stub grep; L49 untouched | ✓ VERIFIED | L26 apps row; L55–56 stub grep; L49 404 grep byte-identical |
| `package.json` | validate:html glob += apps/index.html | ✓ VERIFIED | L6 confirmed |
| `AGENTS.md` | Layout sync + 10-RUNBOOK path fix, same commit set | ✓ VERIFIED | 4 hunks, layout rows only; in the uncommitted migration set |
| `geohist/guide.html` / `contact.html` / `changelog.html` | 3 href-only edits each | ✓ VERIFIED | numstat 3/3 each; anchors grep-verified |
| `geohist/privacy.html` | ONE href-only footer edit, frozen policy | ✓ VERIFIED | 1/1 diff (P-13-03) |
| `.planning/phases/13-home-migration/red-gate-proof.md` | Both-direction proofs per gate | ✓ VERIFIED | 6 cycles, FAIL+PASS, sha256 pairs, honest deviation record; hashes bind to current bytes |
| `.planning/phases/13-home-migration/13-RUNBOOK.md` | GSC owner steps, console-UI only | ✓ VERIFIED | 5 numbered sections incl. explicit no-CoA |
| `.planning/phases/13-home-migration/13-UAT.md` | UAT scaffold MIG-01..09, pending | ✓ VERIFIED | 9 rows pending; owner checkpoint; mechanical predicate |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| keycheck/surface `pages[]` arrays | moved markup ↔ 19 dictionaries | 178-key set-equality | ✓ WIRED | keycheck PASS ×19 live = the atomic-coupling mechanism; old-array mutation FAILs with 13 extra hub.* keys (Cycle 1 recorded) |
| keycheck L185 star-uniqueness path | root `index.html` proof-row-star | readFileSync root | ✓ WIRED | Renamed-class mutation FAILs (0 SVGs); un-repointed gate reading the stub could never PASS (0 SVGs there); flip-compat cycle green |
| 404.html "Back to the hub" | smoke-check L49 grep | text coupling | ✓ WIRED | Grep byte-untouched; 404 text unchanged; live 404 row green in smoke run |
| sitemap rows | per-page canonical/og:url/JSON-LD url | coherence | ✓ WIRED | 6 rows ↔ 6 pages' triples verified by direct read |
| AGENTS.md | check-no-old-domain walk | not allowlisted | ✓ WIRED | Gate OK live on the updated file; AGENTS.md rides the uncommitted migration set (same-commit sync enforced by ship) |
| 13-RUNBOOK/13-UAT | post-deploy execution | EA-17 framing + mechanical predicate | ✓ WIRED | Runbook §1–§5 ↔ UAT MIG-08 row recording slots; UAT MIG-05 ↔ red-gate Cycle 5 pending row (cross-reference present) |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| root index.html / apps/index.html keyed text | data-i18n keys | EN markup baseline + 19 `/js/i18n/*.json` dictionaries via absolute DICT_URL_PREFIX | Yes — keycheck set-equality PASS ×19 | ✓ FLOWING |
| geohist/index.html (stub) | — | — | Zero data dependencies by design | ✓ N/A (correct) |
| sitemap.xml | `<loc>` rows | real page paths | Yes | ✓ FLOWING |

Static site — no dynamic rendering surfaces; the keyed-text flow is the only data path and it is mechanically proven.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| 178 × 19 set-equality + star uniqueness over the NEW page set | `node scripts/i18n-keycheck.mjs` | PASS ×19, OK, exit 0 | ✓ PASS |
| Key-surface inventory over the new page list | `node scripts/i18n-surface.mjs --summary` | `178 keys across 5 pages` | ✓ PASS |
| Full validate chain (html + domain + links + i18n-detect + i18n) | `npm run validate` | exit 0; i18n-detect 23/23; links 20/20 → 200 incl. `apps\` | ✓ PASS |
| Stub passes recommended ruleset | `npx html-validate geohist/index.html` | exit 0 | ✓ PASS |
| Legacy-host gate incl. updated AGENTS.md | `node scripts/check-no-old-domain.mjs` | `check-no-old-domain: OK`, exit 0 | ✓ PASS |
| Smoke-check URL list covers new layout (direction-1, pre-deploy) | `bash scripts/smoke-check.sh` (live) | FAILED as expected pre-deploy: `/apps/` 404 + stub-grep fail; all old rows 200 | ✓ PASS (expected direction-1 FAIL — reproduced independently; direction-2 ALL PASS = UAT row MIG-05) |
| a11y AA battery over 5-page PAGES list | `node scripts/a11y-audit.mjs` | ? SKIP — ~8 min self-served server battery; substituted: red-gate Cycle 4 FAIL+PASS record bound to current bytes (root hash 425F1FDE… re-verified live) + PAGES array read-verified | ? SKIP (recorded substitute evidence) |

### Probe Execution

| Probe | Command | Result | Status |
| ----- | ------- | ------ | ------ |
| `scripts/*/tests/probe-*.sh` | discovery | none exist (repo has no conventional probe path) | N/A |
| Red-gate cycles (phase's probe analog) | executor-run, recorded in red-gate-proof.md | 6 cycles FAIL+PASS; **verifier re-computed all 5 tracked file sha256 prefixes against the closing table — all equal to current working-tree bytes** | ✓ INTEGRITY-BOUND |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| MIG-01 | 13-01 | Root `/` = GeoHist landing, all 20 locales | ✓ SATISFIED (deliverable) | Truth 1 + 2; live locale check pre-staged (UAT MIG-01) |
| MIG-02 | 13-01 | `/geohist/` → root landing via meta-refresh-0 stub (incl. legacy host) | ✓ SATISFIED (deliverable) | Truth 3 (stub verified); live chain pre-staged (UAT MIG-02) |
| MIG-03 | 13-01 | `/apps/` hub, zero placeholders | ✓ SATISFIED | Truth 5 |
| MIG-04 | 13-01 | Sitemap URLs resolve apex, coherent canonical/og:url/JSON-LD | ✓ SATISFIED (markup) | Truth 6; live 200s pre-staged (UAT MIG-04) |
| MIG-05 | 13-01 | 5 gate lists cover new layout, red-gate both directions | ✓ SATISFIED | Truth 7; direction-2 live smoke pre-staged (UAT MIG-05 closes Cycle 5) |
| MIG-06 | 13-01 | AGENTS.md same-commit sync, old-domain gate | ✓ SATISFIED (prepared state) | Truth 8; commit assembly at /gsd-ship |
| MIG-07 | 13-01 | `/geohist/privacy.html` path-stable, frozen | ✓ SATISFIED | Truth 4 (1-line href diff) |
| MIG-08 | 13-02 | GSC sitemap resubmit + URL inspection post-deploy (runbook section) | ✓ SATISFIED (deliverable) | Truths 10–12; live owner console steps pre-staged (UAT MIG-08, EA-17) |
| MIG-09 | 13-01 | 404 + nav/footer links new layout; 178 × 19 surface | ✓ SATISFIED | Truth 9 |

No orphaned requirements — REQUIREMENTS.md maps MIG-01..09 to Phase 13 exactly; both plans' `requirements:` fields union to the same set (13-01: MIG-01..07+09; 13-02: MIG-08).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| — | — | Debt markers (TBD/FIXME/XXX/PLACEHOLDER/coming soon) across all 14 migration files | — | 0 found ✓ |
| — | — | Legacy-host literal in 13-RUNBOOK.md / 13-UAT.md / any tracked file | — | 0 found ✓ |
| — | — | Secret-shaped strings in the two planning docs | ℹ️ Info | Only the public-artifact disclaimer lines themselves (the word "no secrets") — matches the 08-RUNBOOK precedent; no actual credentials |
| — | — | `return null` / empty handlers / console.log-only implementations | — | 0 found ✓ |
| — | — | `geohist/index.html` minimal page | ℹ️ Info | Deliberate deliverable (Pattern-1 stub), not a stub defect |

### Human Verification Required

All 8 items below are **pre-staged and pending BY DESIGN in `13-UAT.md`** (EA-17: post-deploy, post-ship). None is a gap; the deliverables verified above are what this phase owed pre-ship. Execute after `/gsd-ship` deploys.

1. **MIG-01** — live `/` full landing + 2 non-EN locale spot-checks (behavior-unverified truth #2)
2. **MIG-02** — live `/geohist/` redirect incl. legacy-host chain; #faq fragment → top-of-page = CORRECT (behavior-unverified truth #3)
3. **MIG-04** — live sitemap 6 × 200 + canonical/og:url spot-checks
4. **MIG-05** — live smoke-check ALL PASS → closes red-gate-proof.md Cycle 5 direction 2 (supersession framing per repo convention)
5. **MIG-06** — deployed AGENTS.md + CI validate green on the ship commit
6. **MIG-07** — live privacy page byte-stable + icon resolves
7. **MIG-08** — owner GSC checkpoint per 13-RUNBOOK.md §2–§5 (mechanical predicate: any recorded issue = blocker)
8. **MIG-09** — live 404 + nav/footer anchor spot-checks

[superseded 2026-09-14, ship-gate reframe: all 9 rows (MIG-01..09) moved verbatim to `13-RECORDS.md` — they execute there post-ship; `13-UAT.md` now holds the locally-runnable PRE-01..06 battery, 6/6 pass]

### Gaps Summary

**No gaps.** Every deliverable-level must-have verified against the working tree with independently re-run gates (keycheck PASS ×19, surface 178×5, validate exit 0, stub html-validate 0, old-domain OK, links 20/200, smoke direction-1 expected-FAIL reproduced). The migration set is intact: 14 modified files + new `apps/`, exactly the planned 15-file change set, hash-bound to the red-gate evidence. Prohibitions P-13-01..04 judged pass with concrete file evidence and flagged for human review per the autonomous judgment-tier contract (see `prohibition_flags` frontmatter). The `human_needed` status reflects only the pre-staged post-deploy UAT rows — the phase's own designed verification vehicle — not missing work.

---

_Verified: 2026-09-14_
_Verifier: the agent (gsd-verifier)_
