# Phase 9: App Check, Monitor-First - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-07
**Phase:** 9-App Check, Monitor-First
**Areas discussed:** Provider, Enforcement threshold, Token-failure UX, Privacy policy wording

---

## Provider

| Option | Description | Selected |
|--------|-------------|----------|
| reCAPTCHA v3 (Recommended) | Free, no Cloud Billing, score-based, 0.5 default threshold. Matches low-traffic form; fits zero-cost site posture | ✓ |
| reCAPTCHA Enterprise | Stronger bot defense + WAF-style signals, but requires Cloud Billing and adds cost + console complexity | |
| Play Protect alternative | Defer App Check; keep honeypot as sole defense (closes FIRE-07 in-phase) | |

**User's choice:** reCAPTCHA v3
**Notes:** Resolves the STATE.md blocker "reCAPTCHA provider (v3 vs Enterprise) hinges on Cloud Billing willingness" — no billing needed. Site key registers against `geohisttrivia.com` only (Phase 8 D-11 runbook pattern).

---

## Enforcement threshold

| Option | Description | Selected |
|--------|-------------|----------|
| Verified-rate + floor (Recommended) | Console "almost all Verified" signal AND minimum real-traffic floor (≥30 successful submissions) | ✓ |
| Verified-rate only | Firebase's own ready-to-enforce signal, no submission count — a quiet form could flip on near-zero traffic | |
| Submission-count only | Fixed successful-submission count as sole gate — ignores token-failure distribution | |

**User's choice:** Verified-rate + floor
**Notes:** Exact floor value (≈30) pinned by planner; the driver is locked.

---

## Ritual (same area)

| Option | Description | Selected |
|--------|-------------|----------|
| Weekly console glance (Recommended) | Firebase console → App Check metrics weekly; documented in the enforcement runbook section | ✓ |
| Per-submission check | Check metrics only when a submission lands — tight feedback, rarely triggered, slow accrual | |
| Monthly reminder doc | Dated reminder to look; weakest evidence flow, risk of never checking | |

**User's choice:** Weekly console glance
**Notes:** Form is low-traffic; sustainable cadence chosen so evidence accrues without burden.

---

## Token-failure UX

### Message wording

| Option | Description | Selected |
|--------|-------------|----------|
| Neutral verify framing (Recommended) | "We couldn't verify this message — please email santiagopostorivo@gmail.com." No bot/captcha jargon | ✓ |
| Explicit bot framing | "Bot protection blocked this message" — honest but tells spammers what tripped | |
| Email-only | Just the email address — loses the why | |

**User's choice:** Neutral verify framing
**Notes:** Visitors aren't confused; spammers learn nothing; email fallback does the recovery work. Plain-text keyed node (keyed nodes carry no child markup).

### Retry behavior

| Option | Description | Selected |
|--------|-------------|----------|
| No auto-retry (Recommended) | Appcheck status shows immediately; visitor resends manually — simplest catch-path mapping | ✓ |
| One auto-retry | Silent re-fetch + resubmit after a delay — adds async state to the in-flight guard, double-submit risk | |
| Retry button in status | Manual affordance inside the status — requires markup inside the keyed node, breaks plain-text rule | |

**User's choice:** No auto-retry
**Notes:** Keeps the in-flight double-submit guard simple; manual resend is the recovery path. Catch-path mapping (App Check-family errors → appcheck status) is the agent's discretion.

---

## Privacy policy wording

| Option | Description | Selected |
|--------|-------------|----------|
| Inventory line + note (Recommended) | One SDK-inventory line (section 3) plus one sentence on anti-abuse transport running regardless of the analytics cookie choice | ✓ |
| Inventory line only | Minimal, but the consent-interplay nuance CMPL-05 asks for stays unstated | |
| Line + full paragraph | Covers reCAPTCHA cookie exposure, submit-time load, enforcement modes — most transparent, most text | |

**User's choice:** Inventory line + note
**Notes:** `privacy.html` is scriptless static EN (documented i18n exception); agent drafts, owner reviews before ship.

---

## the agent's Discretion

- Analytics token-failure event mechanics (fork-preserving document-event bridge per `persano:langchange` precedent; event name + params)
- `isTokenAutoRefreshEnabled: false`
- Local-testing approach (debug provider/debug token) + smoke-check coverage
- Runbook file shape (08-RUNBOOK pattern, planner's call)
- Exact appcheck message + privacy line copy (agent drafts EN + translations; owner vetoes)
- Error-code attribution mapping (App Check-family vs generic)
- App Check init-failure vs request-time token-error coverage
- Exact enforcement floor number (planner pins)

## Deferred Ideas

- Selector-page removal + GeoHist-as-home — owner re-raised during this discussion; site restructure, its own phase after Phases 9–10 (STATE.md backlog)
- App Check enforcement flip execution (FIRE-10) — post-monitoring owner console step, future requirement
