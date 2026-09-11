# Phase 10: Gated Social Proof - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-10
**Phase:** 10-Gated Social Proof
**Areas discussed:** Strip design + placement, Which facts, Tier-1 OFF mechanics, Owner flip runbook, Icon drafting + approval, Pre-flip safety + validation

---

## Strip design + placement

| Option | Description | Selected |
|--------|-------------|----------|
| Stat pills row | 3-4 compact stat blocks in a row, wraps on mobile | ✓ |
| Inline sentence | One short sentence under hero tagline | |
| Mini feature-group | Styled like existing feature-group block with bullets | |

**User's choice:** Stat pills row
**Notes:**

| Option | Description | Selected |
|--------|-------------|----------|
| Between hero + features | New section directly below hero, above features | ✓ |
| Inside hero, under CTA | Proof hugs the install action | |
| Mid-page, before FAQ | Calmer spot | |

**User's choice:** Between hero + features

| Option | Description | Selected |
|--------|-------------|----------|
| Icon + text pills | Small inline-SVG icon + short stat text | ✓ |
| Text-only pills | Big number/short label, zero icon work | |

**User's choice:** Icon + text pills

| Option | Description | Selected |
|--------|-------------|----------|
| Static pills | Plain statements, trust band not navigation | ✓ |
| Linked pills | Each pill links to its on-page proof point | |

**User's choice:** Static pills

| Option | Description | Selected |
|--------|-------------|----------|
| Keyed aria + ul | Keyed aria-label on section + plain ul pill list | ✓ |
| Minimal, no heading | role=list only | |

**User's choice:** Keyed aria + ul

| Option | Description | Selected |
|--------|-------------|----------|
| No visible heading | Pills only, aria-label carries the name | ✓ |
| Visible keyed h2 | Small keyed heading above pills | |

**User's choice:** No visible heading

| Option | Description | Selected |
|--------|-------------|----------|
| Flex wrap, free RTL | Flexbox gap+wrap; RTL free via existing block | ✓ |
| Grid 3-up + wrap | Rigid column count desktop, wrap below | |

**User's choice:** Flex wrap, free RTL

---

## Which facts

| Option | Description | Selected |
|--------|-------------|----------|
| 3 roadmap facts | 20 languages, offline, game modes | |
| 4 facts | Trio + one extra | ✓ |
| 5+ facts | Add changelog count / Play Games | |

**User's choice:** 4 facts

| Option | Description | Selected |
|--------|-------------|----------|
| Android 7.0+ | No flagship required (FAQ-verified) | ✓ |
| Changelog count | "X versions since 0.2" | |
| Play Games | Cloud saves + achievements | |

**User's choice:** Android 7.0+

| Option | Description | Selected |
|--------|-------------|----------|
| Short stats | "20 languages" / "Play offline" | ✓ |
| Mini-sentences | Warmer claim-first sentences | |

**User's choice:** Short stats

| Option | Description | Selected |
|--------|-------------|----------|
| 5 keys | One keyed span per pill + aria label | ✓ |
| Split number+label | Numbers untranslated, more keys | |

**User's choice:** 5 keys

---

## Tier-1 OFF mechanics

| Option | Description | Selected |
|--------|-------------|----------|
| Hidden + keys now | div hidden, keys live in dicts, flip = unhide + fill number | ✓ |
| Commented-out markup | Flip = uncomment + 20-dict atomic move | |

**User's choice:** Hidden + keys now

| Option | Description | Selected |
|--------|-------------|----------|
| Under hero CTA | Rating proof hugs install button | ✓ |
| Inside proof strip | Rating joins the facts band | |
| Own slim section | Separate from hero and strip | |

**User's choice:** Under hero CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Linked row + SVG star | Whole row one anchor to Play; inline-SVG star | ✓ |
| Static row | No link (badge above already goes to Play) | |
| Unicode star | ★ char, per-font rendering risk | |

**User's choice:** Linked row + SVG star

| Option | Description | Selected |
|--------|-------------|----------|
| Unkeyed number span | Keyed fragments around one unkeyed number; flip edits 1-2 numbers | ✓ |
| Fully keyed sentence | Numbers baked into 19 dict values | |
| EN-only exception | Row unkeyed | |

**User's choice:** Unkeyed number span

| Option | Description | Selected |
|--------|-------------|----------|
| Rating only | "Rated X.X ★ on Google Play" | ✓ |
| Rating + count | Second unkeyed count span | |

**User's choice:** Rating only

---

## Owner flip runbook

| Option | Description | Selected |
|--------|-------------|----------|
| 10-RUNBOOK.md | Phase-dir runbook (08/09 pattern) | ✓ |
| Inline comments only | Instructions rot with the page | |
| Runbook + pointer comment | Both | |

**User's choice:** 10-RUNBOOK.md

| Option | Description | Selected |
|--------|-------------|----------|
| Live + real rating | Owner eyeballs real aggregate rating on Play; no min floor | ✓ |
| Live + min count | Add minimum-ratings floor | |

**User's choice:** Live + real rating

| Option | Description | Selected |
|--------|-------------|----------|
| Session convention | Update number during any session touching app facts | ✓ |
| Monthly owner check | Periodic ritual | |
| Flip-once, no upkeep | Honesty-drift risk | |

**User's choice:** Session convention

| Option | Description | Selected |
|--------|-------------|----------|
| In-file + runbook | Commented JSON-LD template in index.html + runbook note | ✓ |
| Runbook only | Precondition away from markup | |

**User's choice:** In-file + runbook

---

## Icon drafting + approval

| Option | Description | Selected |
|--------|-------------|----------|
| Stroke, currentColor | 24px stroke icons, minimal, consistent | ✓ |
| Filled glyphs | Heavier presence | |

**User's choice:** Stroke, currentColor

| Option | Description | Selected |
|--------|-------------|----------|
| Agent drafts, owner vetoes | Owner reviews rendered strip pre-ship | ✓ |
| Ship first, fix later | Fastest, style risk live | |
| Owner references first | Owner picks samples, slowest | |

**User's choice:** Agent drafts, owner vetoes

---

## Pre-flip safety + validation

| Option | Description | Selected |
|--------|-------------|----------|
| 0.0 placeholder | Self-flagging if hidden lost | ✓ |
| X.X placeholder | Reads as template, looks broken if live | |
| Empty span | Subtle failure | |

**User's choice:** 0.0 placeholder

| Option | Description | Selected |
|--------|-------------|----------|
| Manual ritual | Rich Results Test + lint in runbook, pre-ship + flip | ✓ |
| CI JSON-LD lint + manual | Node script in validate chain | |
| Existing gates only | validate:html only | |

**User's choice:** Manual ritual

| Option | Description | Selected |
|--------|-------------|----------|
| Plain div hidden | No extra semantics; screen readers skip hidden | ✓ |
| hidden + aria-hidden | Belt-and-suspenders, one more attr to remove | |

**User's choice:** Plain div hidden

| Option | Description | Selected |
|--------|-------------|----------|
| Comment-only template | HTML comment outside JSON-LD script; served schema byte-clean | ✓ |
| Template inside script | Comment inside script tag = invalid JSON risk | |

**User's choice:** Comment-only template

---

## the agent's Discretion

- Exact key names + count (~7 keys; planner pins the surface move)
- Per-language fragment split for the Tier-1 sentence (CJK word order)
- Exact icon glyph designs (owner veto is the gate)
- CSS class naming + texture-rule interplay
- smoke-check additions (researcher verifies; likely none)
- Sitemap: no change (landing URL unchanged, no new pages)

## Deferred Ideas

None — discussion stayed within phase scope. Standing external gates: Play listing live date gates the SEO-06 flip (owner-pending privacy-URL field, STATE.md); selector-page removal (post-phase backlog); FIRE-10 (post-monitoring).
