# Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-02
**Phase:** 3-i18n — Engine, ES/pt-BR Dictionaries, Switcher
**Areas discussed:** Dictionary delivery, First-paint behavior, Switcher UX, Translation workflow

---

## Dictionary delivery

| Option | Description | Selected |
|--------|-------------|----------|
| Fetch JSON per lang | Engine fetches only the active language's JSON; EN needs no fetch; fetch failure → EN fallback (SC3) | ✓ |
| Bundled JS, no fetch | All 3 dictionaries ship with the page — no fetch path but every visitor downloads all languages | |
| One file per lang | One JSON per language covering hub.*/geohist.*/guide.* namespaces — one fetch, flat 1:1 keys | ✓ |
| Per-page JSON split | Smaller payloads, more files, split logic in engine | |
| Flat key-value root | Flat root JSON mirroring data-i18n key strings — same one-fetch shape (variant of per-lang file) | |
| Root /js/ | /js/i18n.js + /js/i18n/{lang}.json — shared engine serves hub + geohist pages | ✓ |
| geohist/-scoped | Engine inside /geohist/ — breaks site-level structure | |
| Bake keys on meta | data-i18n-attr on the 3 meta description tags — D-20 mechanism reused | ✓ |
| Engine meta convention | Engine special-cases meta via key convention — zero HTML edits but hidden magic | |
| DOM snapshot | Engine snapshots EN from DOM at load; switch to EN re-applies snapshot; no en.json | ✓ |
| Ship en.json | Symmetric 3-dictionary model — adds EN fetch + drift risk vs raw HTML | |

**User's choice:** All recommended options — fetch JSON per language, one file per language, root /js/, baked meta keys, DOM-snapshot EN
**Notes:** Dictionaries map 1:1 against the ~103-key Phase 2 surface (landing 56, guide 36, hub 11)

## First-paint behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Accept EN flash | EN paints, engine swaps on DOMContentLoaded — no-JS/crawlers see perfect EN | ✓ |
| Hide-until-applied | Body hidden until applied — no flash but render-block risk + noscript unhide needed | |
| First match in list | Scan navigator.languages for first supported match — bilingual users served | ✓ |
| Primary lang only | Only navigator.language[0] counts — simpler but surprises es-secondary users | |
| All pt-* → pt-BR | pt-PT/AO/bare pt all serve pt-BR dictionary — standard single-variant practice | ✓ |
| Exact match only | Only exact pt-BR translates — alienates pt-PT visitors | |
| In-place swap | textContent/attr swap, no reload — matches I18N-02 "in place" wording | ✓ |
| Save + reload | Simpler state but blank flash, contradicts requirement wording | |
| defer classic | <script defer> on 3 keyed pages — single file, no modules | ✓ |
| ES module | Future-proof imports — overkill for one file | |
| One shared key | persano.lang across hub + geohist — same site, one preference | ✓ |
| Per-area keys | Split-brain UX, no requirement asks for it | |
| Silent EN fallback | Fetch fails → stays on shipped EN, no error UI | ✓ |
| Fallback + notice | Small "translation unavailable" notice — extra strings/states for edge case | |
| Custom event | persano:langchange {from,to} document event — Phase 4 listens consent-gated | ✓ |
| Global callback hook | Global function contract instead of standard event API | |

**User's choice:** All recommended options
**Notes:** User asked for one extra round on this area (storage, fetch-fail, analytics hook, load strategy)

## Switcher UX

| Option | Description | Selected |
|--------|-------------|----------|
| Text links | English · Español · Português endonyms — matches .footer-links pattern, mobile friendly | ✓ |
| Native <select> | Compact but OS-stock dropdown, needs custom theming | |
| Globe dropdown | Decorative toggle + open/close state for 3 items | |
| Footer only | One location, reserved #lang-switcher-slot (D-24) | ✓ |
| Header + footer | More discoverable but duplicates control, competes on small screens | |
| Header only | Hub has no header nav — switcher would miss 1 of 3 pages | |
| 3 keyed pages | Hub + landing + guide only; privacy EN-only, 404 self-contained | ✓ |
| All pages incl. privacy | Consistent footer but control does nothing on privacy | |
| Marked, disabled | aria-current="true", non-interactive — clear state signal | ✓ |
| Still clickable | Re-tap no-op, misses state signal | |

**User's choice:** All recommended options — footer text links with endonyms, marked active state
**Notes:** No extra questions requested after second batch

## Translation workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Agent drafts | ES+pt-BR from EN strings, owner reviews after execution (D-09 pattern) | ✓ |
| Review before ship | Owner reviews ES/PT before dictionaries ship — extra round-trip in phase | |
| MT only, no review | Fastest but brand-voice risk (playful D-08 tone) | |
| Neutral es-419 | LatAm neutral Spanish — matches Play es-419 + app's ES localization | ✓ |
| es-ES Spain | Peninsular forms (tú/vosotros) | |
| Translate FAQ policy sentences | Meaning mirrors EN policy; EN legally authoritative | ✓ |
| Keep EN verbatim | Perfect legal mirror but half-EN page in translated site | |

**User's choice:** All recommended options — agent drafts with post-execution review, es-419, translated FAQ
**Notes:** App repo translations.json confirmed as ES terminology reference (game terms only, not site copy)

---

## the agent's Discretion

- Engine internals (detection priority stored-pref > detect > EN), fetch caching/versioning, JSON validation
- Switcher accessibility attrs (lang/hreflang), styling within footer pattern
- Dictionary JSON formatting, exact localStorage key string (persano.lang shape agreed)
- Engine error-guard specifics

## Deferred Ideas

None — discussion stayed within phase scope.