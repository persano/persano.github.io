# Phase 4: Consent Gate + Firebase (Analytics + Contact Form) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-02
**Phase:** 4-Consent Gate + Firebase (Analytics + Contact Form)
**Areas discussed:** Consent banner scope, Contact form shape, Analytics event scope

---

## Consent banner scope

| Option | Description | Selected |
|--------|-------------|----------|
| 3 keyed pages (Recommended) | Banner on hub + geohist + guide; consent state global via localStorage; privacy.html stays EN-only/no-keys (D-37); 404 stays self-contained | ✓ |
| 3 keyed + privacy | Adds privacy.html, but banner copy needs EN-only special case there | |
| All pages incl. 404 | Breaks 404's self-contained design rule | |

| Option | Description | Selected |
|--------|-------------|----------|
| Accept + Reject (Recommended) | Both buttons equal weight — GDPR: deny as easy as grant | ✓ |
| Accept + Reject + policy link | Busier banner, maximum transparency | |
| Accept + dismiss X | Not compliant with FIRE-01 intent | |

| Option | Description | Selected |
|--------|-------------|----------|
| Footer link (Recommended) | Footer 'Consent' item on keyed pages reopens banner, keyed for i18n | ✓ |
| Floating corner button | New UI element outside established patterns | |
| Footer + privacy note | Adds EN-only plain-text consent line to privacy.html | |

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed bottom bar (Recommended) | Full-width dark antique bar matching footer family | ✓ |
| Bottom-right card | Less obtrusive, phone tap-space care needed | |
| You decide | Agent discretion within theme | |

**User's choice:** 4× recommended option
**Notes:** Banner applied to the new keyed contact.html too (rule: every engine-carrying page) — recorded in D-42.

---

## Contact form shape

| Option | Description | Selected |
|--------|-------------|----------|
| Own page (Recommended) | /geohist/contact.html mirroring guide.html pattern; keeps landing hero-first | ✓ |
| Inline section on landing | Heavier landing, phone-first suffers | |
| Details inside FAQ | Compliance form hidden in accordion is awkward | |

| Option | Description | Selected |
|--------|-------------|----------|
| 4 fields + topic (Recommended) | name (optional) + email + topic (General/Bug/Feedback/Request data deletion) + message | ✓ |
| 3 fields, no name | Fewest taps, less reply context | |
| 5 fields | More friction + schema to lock | |

| Option | Description | Selected |
|--------|-------------|----------|
| Form links, mailto stays (Recommended) | Footer Contact ×3 + FAQ report + deletion FAQ → form; privacy.html + About-dev keep mailto | ✓ |
| Form replaces all mailto | privacy.html should keep direct email visible | |
| Both in footer | Decision fatigue | |

| Option | Description | Selected |
|--------|-------------|----------|
| Inline status (Recommended) | Under-form message, aria-live polite, keyed | ✓ |
| Toast | Flashy, extra ARIA handling | |
| You decide | Agent discretion with AA constraint | |

**User's choice:** 4× recommended option
**Notes:** None.

---

## Analytics event scope

| Option | Description | Selected |
|--------|-------------|----------|
| FIRE-03 minimum (Recommended) | Play badge clicks + language switches only | ✓ |
| Min + form submits | Topic-level visibility of form arrivals | |
| Full engagement set | FAQ opens, scroll depth — more noise | |

| Option | Description | Selected |
|--------|-------------|----------|
| Named custom events (Recommended) | snake_case + param objects (play_badge_click {page}, language_switch {from,to}) | ✓ |
| GA4 defaults | Cryptic auto names | |
| You decide | Agent discretion on taxonomy | |

**User's choice:** Both recommended options
**Notes:** None.

---

## the agent's Discretion

- Banner copy wording, exact styling within dark antique theme, animation/focus details
- Consent storage exact key name/timestamp format; analytics-load timing; debug logging
- Firestore schema field names/caps/topic strings; validation timing; honeypot details
- FAQ deletion-entry wording (CMPL-04 mirror); event param extras; contact page layout

## Deferred Ideas

None — discussion stayed within phase scope.
