# Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-02
**Phase:** 2-GeoHist Landing + Hub Content (EN, i18n keys baked in)
**Areas discussed:** Visual style, Hero & marketing copy, Page structure & nav, FAQ scope & wording, i18n key conventions, Play link placeholder, Gallery placeholder look, Footer content

---

## Visual style

| Option | Description | Selected |
|--------|-------------|----------|
| Dark antique | PROJECT.md-floated dark antique-map mood; Phase 1 light becomes placeholder | ✓ |
| Keep light cream | Refine deployed Phase 1 cream/leather-brown | |
| You decide | Agent optimizes for contrast + mood | |

| Option | Description | Selected |
|--------|-------------|----------|
| CSS-only texture | Gradients + inline SVG patterns, zero requests | ✓ |
| Texture images | Real map/parchment backgrounds; binary assets | |
| Flat, no texture | Solid surfaces, typography carries mood | |

| Option | Description | Selected |
|--------|-------------|----------|
| Single dark theme | One theme, one contrast proof | ✓ |
| Auto light/dark | prefers-color-scheme dual theme | |

| Option | Description | Selected |
|--------|-------------|----------|
| Gold + one secondary | Antique gold primary + teal/terracotta secondary | ✓ |
| One accent only | Single hue family | |
| Full multi-hue palette | Gold, sepia, teal, terracotta, parchment | |

| Option | Description | Selected |
|--------|-------------|----------|
| Serif display + sans body | Antique book feel + clean body | ✓ |
| All sans | Current stack, mood via color/weight | |
| You decide | Agent picks pairing | |

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle, restrained | Low-opacity texture, hairline rules, small motifs | ✓ |
| Bold antique illustration | Compass roses, illustrated borders | |

| Option | Description | Selected |
|--------|-------------|----------|
| Official Play badge | "Get it on Google Play" dark variant, hosted locally | ✓ |
| Custom antique button | Theme-matched custom CTA | |
| You decide | Agent decides, swappable either way | |

| Option | Description | Selected |
|--------|-------------|----------|
| Warm brown-black | Aged leather/ink, sepia tint | ✓ |
| Neutral ink-black | Near-black neutral, gold pops harder | |
| You decide | Agent picks hex + proves contrast | |

**User's choice:** Dark antique, CSS-only texture, single theme, gold + one secondary, serif display + sans body, subtle, official badge, warm brown-black
**Notes:** Phase 1 light palette becomes placeholder; contrast math (4.5:1/3:1) proven at design time.

## Hero & marketing copy

| Option | Description | Selected |
|--------|-------------|----------|
| Playful | Fun-first game voice | ✓ |
| Formal / premium | Polished, educational emphasis | |
| Show me options | 2–3 taglines per tone | |

| Option | Description | Selected |
|--------|-------------|----------|
| Draft now, review after | Agent drafts from README; owner reviews diff post-execution | ✓ |
| Approve copy first | Wording approved before HTML | |
| I'll write key lines | Owner dictates key lines | |

| Option | Description | Selected |
|--------|-------------|----------|
| App repo icon | Launcher/play-store asset from GeoHist-Trivia | ✓ |
| Themed placeholder | SVG compass/map motif until real icon | |
| Skip icon | Text-only hero | |

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal hero | Icon + name + tagline + short paragraph + badge | ✓ |
| Hero + fact chips | Offline · 20 languages · Free strip | |
| Hero + screenshots | Screenshot strip (empty until Phase 5) | |

**User's choice:** Playful, draft-now-review-after, app repo icon, minimal hero
**Notes:** —

## Page structure & nav

| Option | Description | Selected |
|--------|-------------|----------|
| On landing page | About-dev section on /geohist/ near FAQ | ✓ |
| On the hub | Fuller About on brand home | |
| Both | Duplication to maintain | |

| Option | Description | Selected |
|--------|-------------|----------|
| Skeleton now | Gallery section + placeholder tiles + keys; Phase 5 swaps tiles | ✓ |
| Absent until Phase 5 | No section in Phase 2 | |

| Option | Description | Selected |
|--------|-------------|----------|
| Light header nav | Game · Guide · FAQ · Privacy on /geohist/ pages | ✓ |
| Footer links only | Phase 1 minimal pattern | |
| You decide | Per page | |

| Option | Description | Selected |
|--------|-------------|----------|
| Grid-ready single card | Card #2 slots in later, no placeholder cells | ✓ |
| Single feature panel | Rich hero-style card; refactor to grid later | |
| You decide | Phone-width-driven | |

**User's choice:** On landing, skeleton now, light header nav, grid-ready single card
**Notes:** —

## FAQ scope & wording

| Option | Description | Selected |
|--------|-------------|----------|
| Required three only | Data collection, offline, devices | |
| Extended set | + IAP, languages, progress storage, reporting (~6–8 Qs) | ✓ |
| Everything incl. gameplay | Overlaps guide page | |

| Option | Description | Selected |
|--------|-------------|----------|
| Verbatim on data | Policy's exact phrases for data claims | ✓ |
| Paraphrased | Plain-speech, needs review per edit | |
| Draft + audit pass | Checklist proves 1:1 mapping | |

| Option | Description | Selected |
|--------|-------------|----------|
| details/summary | Native accordions, no JS | ✓ |
| Open list | All visible, longer scroll | |

| Option | Description | Selected |
|--------|-------------|----------|
| Concise | Basics + modes, ~1–2 screens | ✓ |
| Detailed walkthrough | Scoring, medals, tips per mode | |

**User's choice:** Extended set, verbatim on data, details/summary, concise guide
**Notes:** —

## i18n key conventions

| Option | Description | Selected |
|--------|-------------|----------|
| Page-prefixed dotted keys | geohist.hero.tagline; data-i18n + data-i18n-attr | ✓ |
| Flat short keys | hero.tagline; collision-prone | |
| You decide | Documented in CONTEXT | |

| Option | Description | Selected |
|--------|-------------|----------|
| Everything visible | All strings incl. FAQ/guide body, alt, aria | ✓ |
| Chrome only | Headings + UI; body stays EN for now | |
| You decide | Per-string cost/benefit | |

**User's choice:** Page-prefixed dotted keys, everything visible
**Notes:** —

## Play link placeholder

| Option | Description | Selected |
|--------|-------------|----------|
| Real package URL | details?id=com.persano.geohisttrivia; 404s until live; zero-code swap | ✓ |
| Dead placeholder href | "#" or stub; needs launch-day edit | |
| URL + coming-soon note | Honest but odd in review | |

**User's choice:** Real package URL
**Notes:** —

## Gallery placeholder look

| Option | Description | Selected |
|--------|-------------|----------|
| Framed map-motif tiles | Phone-aspect, antique frames, compass motif, "Screenshots coming soon" | ✓ |
| Plain dark tiles | Neutral rectangles | |
| Copy only, no tiles | Text-only section | |

**User's choice:** Framed map-motif tiles
**Notes:** —

## Footer content

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal four | Privacy · contact email · Back to hub · © Persano; switcher slot reserved | ✓ |
| Minimal + Play link | Adds badge link in footer | |
| You decide | Per-page composition | |

**User's choice:** Minimal four
**Notes:** —

## the agent's Discretion

- Exact palette hexes + secondary accent choice (teal vs terracotta), contrast math shown in plans
- Serif/sans system font picks within system-stack constraint
- Landing section order below hero
- Compass/star motif SVG design + texture implementation
- FAQ order + guide page section layout

## Deferred Ideas

None — discussion stayed within phase scope.
