# Phase 6: Changelog Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-05
**Phase:** 6-Changelog Page
**Areas discussed:** Seed entries, Entry voice + depth, Page layout, Link placement

---

## Seed entries

| Option | Description | Selected |
|--------|-------------|----------|
| Backfill 0.x history (Recommended) | Curated highlights of the 0.x development arc — tells the story, page never looks empty | ✓ |
| Single current entry | One entry for the Play release version only (currently 0.88) | |
| Placeholder only | Empty structure with one placeholder entry until the listing is live | |

**User's choice:** Backfill 0.x history
**Notes:** —

## Backfill depth

| Option | Description | Selected |
|--------|-------------|----------|
| Curated milestones (Recommended) | 4-6 milestone entries (first playable, modes complete, Play Games wired, Play release candidate) | ✓ |
| Every meaningful bump | Entry per meaningful version bump across the 25 build numbers — complete but noisy | |
| Compressed waves | One paragraph per 0.x release wave — most compact | |

**User's choice:** Curated milestones
**Notes:** —

## Source+dates

| Option | Description | Selected |
|--------|-------------|----------|
| Agent reconstructs (Recommended) | Agent reconstructs milestones from app repo (git history, .planning/, strings.xml) with real ISO dates, owner reviews draft | ✓ |
| You dictate now | Owner lists milestones + dates from memory | |
| Agent, approximate dates | Month-level approximate dates flagged in a comment | |

**User's choice:** Agent reconstructs, owner reviews
**Notes:** App repo is `C:/Users/Familia/antigravity/GeoHist-Trivia` (versionName 0.88 / versionCode 25).

## Launch entry

| Option | Description | Selected |
|--------|-------------|----------|
| New entry at launch (Recommended) | Fresh entry prepended when listing goes live (real Play version, e.g., 1.0) — 0.x history stays as-is | ✓ |
| Label now, date later | Top entry labeled "Play release" now, date flipped at approval | |
| Decide later | Page structure just needs to make prepending trivial | |

**User's choice:** New entry at launch
**Notes:** —

---

## Entry voice

| Option | Description | Selected |
|--------|-------------|----------|
| Player-facing (Recommended) | Matches guide.html tone — players actually read it | ✓ |
| Terse technical | Changelog-as-build-log | |
| Hybrid | Player-facing summary + technical detail paragraph | |

**User's choice:** Player-facing
**Notes:** —

## Categories

| Option | Description | Selected |
|--------|-------------|----------|
| Added/Changed/Fixed (Recommended) | Three player-visible buckets; empty categories omitted | ✓ |
| Full KaC set | Full Keep-a-Changelog set shown whenever applicable | |
| No categories | Bullet list under version + date only | |

**User's choice:** Added/Changed/Fixed
**Notes:** —

## Entry depth

| Option | Description | Selected |
|--------|-------------|----------|
| Short bullets (Recommended) | 1-4 bullets per category — scannable on mobile | ✓ |
| One-liner | One line per entry | |
| Bullets + context | Short bullets + context paragraph for major releases | |

**User's choice:** Short bullets
**Notes:** —

## Version labels

| Option | Description | Selected |
|--------|-------------|----------|
| Real 0.x numbers (Recommended) | "0.88 — 2026-09-01" style; honest, matches Play later | ✓ |
| Semantic labels | Semantic labels with version in smaller text | |
| Numbers on launch only | Only launch version gets a number | |

**User's choice:** Real 0.x numbers with ISO dates
**Notes:** —

---

## Page layout

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline list (Recommended) | Vertical list: version+date header, category subheads, bullets — all visible | ✓ |
| Timeline + <details> for old | Newest 2-3 visible, older collapse inside native <details> | |
| Version cards | Themed cards like guide.html mode-list — heavier visually | |

**User's choice:** Timeline list
**Notes:** —

## Page frame

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror guide frame (Recommended) | H1 + one-line intro top, back-to-game link bottom — mirrors guide.html | ✓ |
| Back link top + bottom | Changelog readers often arrive from Play listing | |
| Bare list | H1 only, no intro text | |

**User's choice:** Mirror guide frame
**Notes:** —

## Meta/SEO

| Option | Description | Selected |
|--------|-------------|----------|
| Full parity (Recommended) | Canonical, keyed title/desc, og:*, twitter:*, sitemap entry, existing og:image | ✓ |
| Minimal meta | Canonical + title + description + sitemap only | |
| Parity + JSON-LD | Full parity + Article/SoftwareVersion JSON-LD | |

**User's choice:** Full parity
**Notes:** —

## Growth

| Option | Description | Selected |
|--------|-------------|----------|
| No cap (Recommended) | Full history always visible; agent trims only if unwieldy | ✓ |
| 10 + archive | Latest ~10 visible, older behind native <details> | |
| Rolling window | Only current release cycle on page; git history keeps the rest | |

**User's choice:** No cap
**Notes:** —

---

## Nav links

| Option | Description | Selected |
|--------|-------------|----------|
| All navs (Recommended) | Game/Guide/FAQ/Changelog/Privacy on all 4 keyed pages + new page | ✓ |
| Footer-only elsewhere | Changelog in footer only; nav link only on the changelog page | |
| Geohist-only navs | Nav link only on geohist pages, hub untouched | |

**User's choice:** All navs
**Notes:** —

## Hub page

| Option | Description | Selected |
|--------|-------------|----------|
| Hub untouched (Recommended) | Hub stays minimal — app card already leads in | ✓ |
| Hub footer link | Small Changelog link in root hub footer | |
| Hub nav + footer | Full cross-site parity | |

**User's choice:** Hub untouched
**Notes:** —

## Nav order

| Option | Description | Selected |
|--------|-------------|----------|
| Before Privacy (Recommended) | Game/Guide/FAQ/Changelog/Privacy | ✓ |
| After Privacy | Appended at the end | |
| Second position | Right after the game link | |

**User's choice:** Before Privacy
**Notes:** —

## Footer link

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, after Contact (Recommended) | Privacy/Contact/Changelog/Back to hub/Consent | ✓ |
| No footer link | Nav covers it; footer stays 4 items | |
| Footer-only | Nav stays 4 items | |

**User's choice:** Yes, after Contact
**Notes:** —

---

## the agent's Discretion

- New CSS classes for entry rows (`.changelog-entry`-style) in `css/base.css`
- Exact `changelog.*` key namespace shape/names (follow `guide.*` pattern 1:1)
- Red-gate demo scope for the CI proof
- Intro line copy (EN + es/pt-BR)
- Language-switcher slot treatment on the new page (same as guide.html)

## Deferred Ideas

None — discussion stayed within phase scope.

