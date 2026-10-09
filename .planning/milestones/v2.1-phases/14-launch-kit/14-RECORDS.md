---
status: pending
phase: 14-launch-kit
source: [14-02-PLAN.md]
started: 2026-09-15
updated: 2026-09-15
---

# Phase 14 Post-Launch Records — Owner-Executed Checks (LKIT-01 flips)

**Reframe note (2026-09-15):** post-launch rows live here (phase-12/13 reframe precedent: post-ship checks live in RECORDS; UAT holds locally-runnable rows). All 6 rows below are post-launch by design: they execute only when the Play listing goes live and the owner works through `.planning/phases/14-launch-kit/14-RUNBOOK.md` (steps 1–3 on launch day; R-06 gate-driven, possibly much later). Locally-runnable pre-ship rows live in `14-UAT.md`.

**Public-artifact notice:** this file ships inside the publicly served Pages artifact (the deploy ships the whole tree). It contains **console-UI descriptions and public-site checks only — zero credentials, zero tokens, zero secrets anywhere in this file.**

**Scaffold notice:** every row below is pre-staged and marked pending. **Do NOT fabricate outcomes** — rows fill in only when executed post-launch. Nothing here is a deploy precondition; the live steps fire per the 14-RUNBOOK pinned sequence (privacy-URL field first, Play-link verify, website field, gated Tier-1 flip last).

**Recording predicate (mechanical, no gap-awareness):** when a row executes, set its `result:` field to pass or issue. **Any recorded issue is a blocker** — there is no "minor issue" reading. A row that later re-verifies green keeps its supersession note pointing at the original gap (repo convention).

**Status legend per row:** `status: pending — executes post-launch at owner time` until executed.

---

## Checks

### 1. R-01 — privacy-URL field outcome (14-RUNBOOK §3 step 1)

check: owner console step per 14-RUNBOOK §3 step 1 — Play Console → app content → privacy policy URL field → paste `https://geohisttrivia.com/geohist/privacy.html`. Record the observed console outcome (accepted / rejected + any console message).

expected: the field accepts and saves. A rejection records as an issue per the mechanical predicate (launch-day blocker discovered at the step; rollback = "field not yet filled; investigate" — no site-side action, the path is frozen and live).

status: pending — executes post-launch at owner time

result: (record when executed)

### 2. R-02 — Play-link liveness date (14-RUNBOOK §3 step 2)

check: per 14-RUNBOOK §3 step 2 — open `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia` in a browser. Record the date the package URL first returned the live listing.

expected: the live listing page (the app page exists and is browsable). Pre-launch, the URL 404s by design (14-RUNBOOK §1 row 4) — record nothing here until it does not. This observation is Tier-1 gate input #1 (10-RUNBOOK §1 condition 1).

status: pending — executes post-launch at owner time

result: (record when executed)

### 3. R-03 — website field outcome (14-RUNBOOK §3 step 3)

check: owner console step per 14-RUNBOOK §3 step 3 — Play Console → main listing → website field → paste `https://geohisttrivia.com/`. Record the observed console outcome.

expected: the field accepts and saves.

status: pending — executes post-launch at owner time

result: (record when executed)

### 4. R-04 — Rich Results Test post-launch (14-RUNBOOK §5)

check: per 14-RUNBOOK §5 — Google Rich Results Test (`search.google.com/test/rich-results`) on `https://geohisttrivia.com/` after the listing goes live. Record the SoftwareApplication result and any new errors.

expected: a valid `SoftwareApplication` result with no new errors; the offers shape still reflects reality (price `"0"`, `priceCurrency` `"USD"` — the app is free at download; IAP lives inside the app and does not change the web offers node). No `aggregateRating` key anywhere (exit code 2 on the §5 local one-liner would mean the rating key appeared in the schema: stop and revert per 10-RUNBOOK §4, then check 10-RUNBOOK §6).

status: pending — executes post-launch at owner time

result: (record when executed)

### 5. R-05 — GA4 Realtime observation (14-RUNBOOK §4) 🔍

check: 🔍 optional soft check per 14-RUNBOOK §4 — GA4 Realtime during the launch window, consent-filtered by design. Record the observation (realtime users on the landing; `play_badge_click` counts if visible).

expected: nothing blocking — this is a nice-to-have observation, not a launch-day gate. Launch-day attribution reads via default `page_location` (`https://geohisttrivia.com/`, `page_path` `/`) and the consent-gated `play_badge_click` event; no code change was needed or made.

status: pending — executes post-launch at owner time

result: (record when executed)

### 6. R-06 — Tier-1 rating flip record (14-RUNBOOK §3 step 4; fires when the 10-RUNBOOK §1 gate passes)

check: per 14-RUNBOOK §3 step 4 + the superseded 10-RUNBOOK §1/§2 — the gated Tier-1 flip. Fires only when BOTH gate conditions hold (listing live + a real aggregate rating visible on the Play page; no minimum-count floor; never a number not seen on the Play page itself) — may be much later than launch day (watch-item semantics). Record: the actual rating value as seen on the Play page (decimal dot), the flip date, the deploy run, and the §5 ritual result (Rich Results + the repointed one-liner still reporting `no aggregateRating key`).

expected: the two edits land against root `index.html` (`hidden` removed from the proof-row div at line 86; `0.0` replaced in the `proof-row-score` span at line 92 with the real rating); the row renders visible with the real number in every language; the schema stays rating-key-free; validate chain green post-flip.

status: pending — executes post-launch at owner time

result: (record when executed)

---

## Summary

total: 6

passed: (fill post-launch)

issues: (fill post-launch)

pending: 6

skipped: (fill post-launch)

blocked: (fill post-launch)

## Gaps

(none yet — rows are pre-staged pending; they fill in only when executed post-launch at owner time)

---

*Phase 14 · Launch Kit · records staged 2026-09-15 by plan 14-02 (Task 3) · R-01..R-03 + R-05 execute launch day, R-04 after the listing goes live, R-06 gate-driven per 10-RUNBOOK §1 · executes post-launch, never a deploy precondition*
