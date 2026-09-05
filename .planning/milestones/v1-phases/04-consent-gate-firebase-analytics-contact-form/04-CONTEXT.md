# Phase 4: Consent Gate + Firebase (Analytics + Contact Form) - Context

**Gathered:** 2026-09-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the site's Firebase integration behind a GDPR consent gate: a custom consent banner (FIRE-01) on the engine-carrying pages, Firebase Analytics loading exclusively via dynamic `import()` after a granted consent — zero SDK bytes before it (FIRE-02) — with consent-gated events for Play badge clicks and language switches (FIRE-03), a contact form on its own page `/geohist/contact.html` submitting via anonymous auth to Firestore with create-only schema-locked rules + honeypot (FIRE-04, FIRE-05), a "Request data deletion" topic wired to the CMPL-03 path (FIRE-06: FAQ entry + form topic + documented manual process). Form works after ANY consent choice (grant or deny). New copy (banner, form, FAQ, footer) carries `data-i18n` keys with ES/pt-BR dictionary additions. NOT in this phase: App Check enforcement (FIRE-07, v2), real screenshots / SEO / JSON-LD / AA audit (Phase 5), consent banner on privacy.html or 404.html, any Firebase change to the Android app.

</domain>

<decisions>
## Implementation Decisions

### Consent banner (FIRE-01)
- **D-42:** Banner shows on every engine-carrying keyed page — the 3 existing (hub `/index.html`, `/geohist/index.html`, `/geohist/guide.html`) + the new keyed `/geohist/contact.html`; NOT on `privacy.html` (stays EN-only/no-keys per D-37) and NOT on `404.html` (stays self-contained per Phase 1 rule). Consent choice itself is global (one localStorage key) so the gate applies site-wide once Analytics is granted — **Reversibility:** reversible — banner markup/JS is additive; changing the page list is an edit to the script-tag list
- **D-43:** Banner buttons = **Accept + Reject, both equal prominence** — GDPR requires denying to be as easy as granting; FIRE-01 requires affirmative action either way. No dismiss-X, no accept-only
- **D-44:** Retraction path = footer **"Consent" link** on the same engine-carrying pages (joins `.footer-links`, keyed) that re-opens the banner anytime; retraction clears/flips the stored choice and unloads nothing already loaded this session except stopping further event sends
- **D-45:** Banner presentation = **fixed bottom bar**, full-width, dark antique theme, restrained per D-06; exact styling is agent discretion
- Consent persistence: localStorage with timestamp per FIRE-01 (exact key shape agent discretion — agreed family `persano.consent`, exact string flexible; same family pattern as `persano.lang` D-34)

### Contact form (FIRE-04..06)
- **D-46:** Form lives on its **own page `/geohist/contact.html`** — mirrors the `guide.html` page pattern (same scaffolding, nav, footer); keeps the landing hero-first on phones
- **D-47:** Fields: **name (optional) + email + topic select + message**; topic options = General question · Bug report · Feedback · **Request data deletion** — the deletion topic + FAQ entry + documented manual process (email-based handling by owner, described in the FAQ answer and on the contact page) complete CMPL-03
- **D-48:** Link rewiring: footer "Contact" on hub + geohist + guide (currently `mailto:`) becomes a link to `/geohist/contact.html`; the FAQ "report a problem" answer and the NEW deletion FAQ entry also point to the form; `privacy.html` and the About-dev section keep their direct `mailto:` as the direct channel
- **D-49:** Success/error states = **inline status message under the form**, `aria-live="polite"`, no toasts/popups; all form copy keyed for ES/pt-BR
- Locked pipeline (STACK §6, not re-decided): submit-time `signInAnonymously()` → `addDoc()` into `messages`; repo-rules create-only with field validation + length caps + server timestamps; honeypot catches bots

### Analytics events (FIRE-02, FIRE-03)
- **D-50:** Event scope = **FIRE-03 minimum only: Play badge clicks + language switches** — both integration points already exist (badge anchors on the pages; `persano:langchange` event, D-35). No form-submit or FAQ-open tracking this phase
- **D-51:** Event taxonomy = **named custom events, stable snake_case names + param objects** (e.g. `play_badge_click {page}`, `language_switch {from, to}` — the `from/to` payload comes straight from the D-35 event detail). No reliance on GA4 auto-named defaults
- Locked gating (Init + STACK §5, not re-decided): zero Firebase script tags in any HTML; `firebase/analytics` imported dynamically only after consent grant; custom ~50-line banner, no CMP library, no Consent Mode; SDK = modular ESM from gstatic CDN, exact-pinned 12.18.0

### the agent's Discretion
- Banner copy wording, exact colors/sizing within the dark antique theme, banner behavior details (animation, focus management)
- Consent storage exact key name/timestamp format; analytics-load timing details after grant; debug logging approach
- Firestore `messages` schema field names, length caps, topic value strings, validation error message copy; client validation timing (on-blur vs on-submit)
- Honeypot placement/technique details; FAQ deletion-entry wording (mirrors policy per CMPL-04)
- Event param extra fields; contact.html section layout details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & scope
- `.planning/ROADMAP.md` §Phase 4 — goal, FIRE-01..06 + CMPL-03, 5 success criteria, **Manual Prerequisites Checklist items 2–4** (Firebase Web App + authorized domain, Anonymous provider, Firestore production mode — USER ACTIONS before planning/execution)
- `.planning/REQUIREMENTS.md` — FIRE-01..06, CMPL-03 definitions; Out of Scope table row "Analytics/form blocking on consent-deny" (form must survive deny); v2 FIRE-07 (App Check)

### Locked prior decisions (Firebase architecture)
- `AGENTS.md` (embedded STACK.md) §3, §5, §6 — modular ESM SDK via gstatic CDN exact-pinned 12.18.0; consent load-gating (no script tags, dynamic import post-grant, ~50-line custom banner, no CMP/Consent Mode); contact form = anonymous auth → `messages` collection, create-only rules + honeypot
  - ⚠ STACK §7's i18n approach (per-language subdirs) is **STALE** — locked decision is JS dictionary swap (see Phase 3 CONTEXT); do not follow it
- `.planning/STATE.md` §Accumulated Context — Init decisions: consent via load-gating; form works after ANY consent choice (compliance surface); real screenshots/SEO deferred to Phase 5

### i18n key contract (new banner/form/FAQ keys must join)
- `.planning/phases/02-geohist-landing-hub-content-en-i18n-keys-baked-in/02-01-PLAN.md` §i18n Key Contract — dotted keys, `data-i18n`/`data-i18n-attr` syntax, keyed nodes carry plain text only
- `.planning/phases/03-i18n-engine-es-pt-br-dictionaries-switcher/03-CONTEXT.md` — D-35 `persano:langchange` event (FIRE-03 hook), D-34 shared `persano.lang` localStorage, D-39 agent-drafted ES/pt-BR copy with owner review after execution
- `js/i18n.js` + `scripts/i18n-keycheck.mjs` — engine; new keys must be added 1:1 to BOTH `js/i18n/es.json` and `js/i18n/pt-BR.json` or the `validate:i18n` CI gate fails

### Wording single-source (CMPL-04)
- `geohist/privacy.html` — authoritative EN wording: SDK names (incl. "Firebase Analytics (website only)", "Firestore via the contact form"), retention sentence ("Messages are deleted after they are handled"), contact email, entity name; FAQ/contact-page data claims copy phrases verbatim from here

### Locked prior decisions (site structure)
- `.planning/phases/02-geohist-landing-hub-content-en-i18n-keys-baked-in/02-CONTEXT.md` — D-24 footer reserved consent hooks; D-14 nav; D-18 `<details>` FAQ pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `js/i18n.js` — engine dispatches `persano:langchange` `{from, to}` (line 130) — FIRE-03 language-switch events listen for exactly this; no engine changes needed
- FAQ `<details class="faq-item" name="geohist-faq">` pattern (`geohist/index.html:95-127`) — deletion-request FAQ entry slots in as one more `<details>` with keys `geohist.faq.deletion.q/a`
- `.footer-links` list pattern in all 3 footers — "Consent" retraction link joins it; footer Contact links are the mailto→form swap points
- `geohist/guide.html` — the page pattern (head meta, `/css/base.css`, nav, footer) `/geohist/contact.html` mirrors
- `geohist/google-play-badge.png` anchors on 3 pages — click-tracking targets
- `scripts/smoke-check.sh` + package.json `validate` chain — regression battery extends to banner/form/rules

### Established Patterns
- Classic `<script defer>` vanilla JS only (D-26) — consent/banner JS is a classic script; Firebase ESM modules enter ONLY via dynamic `import()` after grant (compatible: classic scripts can dynamic-import ESM)
- `data-i18n` keyed nodes carry plain text only — banner/form/FAQ markup follows; dynamic strings (validation status) rendered via engine-safe keyed nodes or attribute swap
- Zero build step; SDK version pinned in import URL; html-validate/linkinator CI must pass with new page + script tags
- Per-task commits via gsd-tools commit handler; deploy is orchestrator-owned single controlled push (Phase 01/02 pattern)

### Integration Points
- Footer Contact `<li>` ×3 (`index.html:28`, `geohist/index.html:139`, `guide.html:79`) → `/geohist/contact.html` (D-48)
- FAQ section gains deletion entry (`geohist/index.html` ~line 127) + report entry rewires to form
- `#lang-switcher-slot` footers + consent-link slot: footer gains a "Consent" item on engine-carrying pages
- Play badge `<a>` anchors — click handlers attach, namespaced so i18n switcher handler stays addEventListener==1 (Phase 03 pattern)
- Firestore rules file lives in repo (path TBD by planner) — console deploys it (manual prerequisite item 4)
- Firebase config values: owner supplies from console (Web App registration) — config is public-by-design, but must NOT be committed as a secret; agent discretion on file placement (e.g. `js/firebase-config.js`)

</code_context>

<specifics>
## Specific Ideas

- Every discussion answer took the recommended option — the model is: 3-keyed-pages+contact banner with Accept/Reject equal buttons, footer retraction link, fixed bottom bar; own contact page with 4 fields + deletion topic; mailto preserved in privacy/About-dev; inline aria-live form status; FIRE-03 minimum event set; snake_case named custom events
- GDPR framing mattered to the user: reject must be as easy as accept; form stays usable after "deny" because it is the compliance surface
- Banner scope rule = "every page that runs the site JS" — privacy.html and 404 deliberately excluded

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Consent Gate + Firebase (Analytics + Contact Form)*
*Context gathered: 2026-09-02*
