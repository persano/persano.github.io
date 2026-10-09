---
status: complete
phase: 12-cleanup-batch
source: [12-02-PLAN.md]
started: 2026-09-14T00:44:00.859Z
updated: 2026-09-14T00:44:00.859Z
---

## Current Test

[complete — owner device check reported pass on all 5 criteria]

## Device

(Device model: Not provided by owner — check performed on owner's real Android device, Chrome)
(Android version: Not provided by owner — check performed on owner's real Android device, Chrome)
(Browser + version: Not provided by owner — check performed on owner's real Android device, Chrome)

## Owner checklist

Execute on a **real Android device with Chrome**:

1. Open `https://geohisttrivia.com` directly in Chrome — **never via `file://`** (the same-origin dictionary fetch fails silently there and the page stays EN, which voids the check).
2. Scroll to the footer and use the language switcher to select اردو. The footer select is the **only** language override path — there is no query parameter; `localStorage` (`persano.lang`) carries the choice across pages.
3. Walk the five criteria below on the geohist landing page (`/geohist/`), reading each `expected:` line as the pass condition.
4. Repeat criterion 4 with العربية in the same session.
5. Screenshots optional; report per-criterion outcomes plus device model, Android version, and browser version.

## Tests

### 1. ur direction flip

expected: after selecting اردو in the footer switcher the page renders RTL: text right-aligned, nav/footer/lists mirrored via the logical properties, html element carries dir="rtl" lang="ur"

result: pass

### 2. ur line-height override

expected: body text visually double-spaced (line-height 2.0 per css/base.css:667-669), headings ~1.9 (css/base.css:671-675), no clipped ascenders/descenders on multi-line Urdu paragraphs

result: pass

### 3. ur Nastaliq shaping

expected: Urdu renders as flowing Nastaliq (Android system font), letters correctly joined, no tofu/box glyphs, no isolated-letter fallback

result: pass

### 4. ar mirror sanity

expected: switching to العربية flips RTL the same way (closes the WINDOWS.md row 10 mirrored-layout item); game-screenshot gallery tiles stay NOT mirrored (intentional — the game's own rendering)

result: pass

### 5. switcher operability

expected: the footer select opens, اردو is selectable, and the choice persists when navigating to another page (closes the WINDOWS.md row 10 select-operability item)

result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

(none yet)
