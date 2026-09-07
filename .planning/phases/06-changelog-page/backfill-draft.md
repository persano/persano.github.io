# Changelog Backfill Draft — curated 0.x milestones (owner review)

**Source:** app repo `C:/Users/Familia/antigravity/GeoHist-Trivia`, mined with `git log --date=short -p -- app/build.gradle.kts` (every date below equals the date of the commit that set that `versionName` — see the verification table at the bottom).

**Curation (per D-02):** 6 entries telling the 0.x development arc — pre-launch refinement → Google Play Games wired → game modes complete → shareable/social era → community-made questions → Play release candidate. Not every version bump is listed (0.3–0.6, 0.82, 0.85, 0.86 intentionally skipped).

**Ordering:** newest-first; dates non-increasing; 0.8 above 0.7 (equal date, version-descending tie-break).

---

## 0.88 — 2026-09-04

**Added**
- New Conquest campaign — explore historical eras, claim territories, and grow your empire on an illustrated world map.
- A full historical atlas: each era comes with its own border map to discover.
- The whole Conquest journey is translated in every language the game supports.

**Fixed**
- Fixed a crash that could catch some players on the campaign map.

## 0.87 — 2026-09-02

**Added**
- The Question Workshop — write your own trivia questions and share them with other players.
- A community review step, so shared questions get checked before they appear in anyone's game.
- The interactive tutorial now covers all three game modes.

## 0.84 — 2026-08-31

**Added**
- Shareable result cards — turn any finished match into a picture you can save and send to friends.
- Achievement certificates for your unlocked badges, ready to share.
- Seasonal events with themed weekly tournaments.

## 0.8 — 2026-08-26

**Added**
- The Study Hub — review what you've learned with smart repetition that brings back facts right before you'd forget them.
- A personal player journal that follows your exploration.

**Changed**
- Pin-drop mode got a visual polish pass.

## 0.7 — 2026-08-26

**Added**
- Daily quests — a fresh challenge waiting for you every day.
- Achievement badges to earn for milestones big and small.
- Google Play Games connection: your scores and badges now sync and climb the leaderboards.

## 0.2 — 2026-08-24

**Added**
- A Feedback & Support card in Settings — three easy ways to reach the developer.
- Smarter voice narration: play and stop controls, and reading that pauses properly when you leave a screen.

**Changed**
- Hard mode now draws from a bigger, smarter pool of questions.

---

### Git verification (owner cross-check per D-03/D-08)

| Version | Date (ISO) | Commit that set versionName |
|---------|------------|------------------------------|
| 0.88 | 2026-09-04 | 2cefab4 |
| 0.87 | 2026-09-02 | 9c6eef9 |
| 0.84 | 2026-08-31 | 4f2eedf |
| 0.8 | 2026-08-26 | 745abc8 |
| 0.7 | 2026-08-26 | 4d22ca3 |
| 0.2 | 2026-08-24 | 491ca9c |

Notes for owner review:
- The pre-0.x scheme (versionNames 3.0–10.0, 2026-08-17 → 2026-08-20) is intentionally excluded — versions 8.0/9.0/10.0 predate the current 0.x scheme (switch happened 2026-08-24).
- Version 0.83 never existed in the app history (versionName jumped 0.82 → 0.84 on 2026-08-31); nothing is skipped in the curated list above — the skipped numbers were simply never used as release numbers.
- Feature wording is cross-checked against the app repo's own planning records for each feature area — git dates win over any doc date if they ever disagree.
- The Play launch itself is NOT listed here — when the listing goes live, a new entry (e.g. 1.0) gets prepended per D-04.
