# Phase 11: Close v2.0 audit debt — F-1 AGENTS.md rewrite + doc-hygiene batch + UAT records - Research

**Researched:** 2026-09-10
**Domain:** Documentation rot closure (AGENTS.md rewrite), planning-record hygiene, owner UAT recording, CI gate extension (`scripts/i18n-keycheck.mjs`) — plain docs/process work on a zero-build static site
**Confidence:** HIGH

## Summary

Phase 11 is docs/process-debt closure, not feature work. Every fix target is a known, line-pinned edit; every technical unknown the planner would face has been resolved against the live tree this session. The F-1 AGENTS.md rewrite is the core deliverable (WARNING-severity: the current doc describes the pre-pivot per-language-subdir i18n design and lists the shipped dictionary-swap architecture under "What NOT to Use" — a future agent following it could re-architect working code [VERIFIED: AGENTS.md:36,81-85,133] + [.planning/v2.0-MILESTONE-AUDIT.md:15-19]). The rewrite source of truth is shipped v2.0 reality: STATE.md locked decisions, PROJECT.md, prior phase CONTEXT/SUMMARY files, and the live validate chain — NOT a regeneration from `.planning/research/STACK.md` (D-02). All facts the rewrite needs are inventoried below with sources.

The P-10-3 keycheck extension is the only code change: a fail-closed star-uniqueness assertion beside the existing CJK-punct check (Phase 7 extension precedent). The invariant is currently green on the live tree — verified this session: **0 occurrences of U+2605 (★) across all 19 dictionaries, exactly 1 `proof-row-star` SVG in `geohist/index.html`, 0 ★ literals in markup** (direct node sweep, this session). The gap is enforcement, not state: the existing gate checks key parity / empty values / CJK punctuation but has no star check, so a malformed Tier-1 row could ship unflagged at owner flip [VERIFIED: scripts/i18n-keycheck.mjs:42-44,127-137] + [.planning/phases/10-gated-social-proof/10-VERIFICATION.md:24-26]. ★ is NOT in the `CJK_PUNCT` regex `[,!?:;()"]`, so today's gate genuinely cannot catch it — the extension is the missing enforcement, and the red-gate proof (Phase 6 pattern) is its test surface.

The full `npm run validate` battery re-ran green this session (html → domain → links → i18n-detect → i18n keycheck 178×19 PASS, `i18n-keycheck: OK`) — it is the phase verification gate, available locally with zero setup [VERIFIED: package.json:5; this session's run]. Node v26.5.1 / npm 11.17.0 available; `node_modules` populated; zero new dependencies (D-10 explicitly requires this — no Package Legitimacy audit needed).

**Primary recommendation:** Plan 4 work units in D-06's locked commit order — (1) F-1 rewrite (+ `.planning/PROJECT.md` line 5 URL fix + optional domain-gate allowlist drop, same concern); (2) F-2/F-3/F-4 hygiene batch; (3) UAT records (HV-06, HV-09a with D-09 split, HV-09b) + F-5 header flip; (4) P-10-3 gate extension + red-gate-proof.md as its own atomic code commit. Re-run the validate battery after each unit that touches scanned surfaces.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**F-1: AGENTS.md rewrite**
- **D-01:** **Full rewrite**, not a surgical patch — the whole doc is brought to current shipped reality (single-URL keyed-engine i18n, 19 dictionaries/178-key surface, geohisttrivia.com canonical, App Check Enterprise monitoring-mode, social proof tiers, Firebase 12.18.0 pinned CDN). Surgical patch rejected: the rest of the v1-era doc (Firebase products table, decisions 2–6 details) would keep contradicting the fix.
- **D-02:** The rewritten stack section is **hand-written from shipped reality** (STATE locked decisions + prior phase CONTEXTs + the live validate chain) — NOT regenerated from `.planning/research/STACK.md` (that file is v2-scope *additions* research, additions-only framing — wrong shape for a whole-stack doc). Sources stay untouched except `.planning/PROJECT.md` line 5 (Core Value paragraph still says persano.github.io).
- **D-03:** The `<!-- GSD:...-start source:... -->` injection markers are **stripped**; sections written fresh. CONVENTIONS and ARCHITECTURE sections (previously empty "not yet established" placeholders) are **populated with the 10 phases' real patterns** as part of the rewrite. Stripping ends stale-injection drift permanently — regeneration tooling can no longer clobber with v1-era source content.
- **D-04:** URL sweep scope = **AGENTS.md + PROJECT.md line 5 only**. The ~70 other `persano.github.io` hits across `.planning` stay as historical records. Keep the still-true github.io-dual-hosts/301 fact in the rewrite (audit fix instruction). — **Reversibility:** reversible — text edits only; the audit's fix recipe names the same scope.

**Doc-hygiene batch (F-2/F-3/F-4)**
- **D-05:** Historical-record fixes (F-2 "20 dictionaries" in 08-02-SUMMARY:121, 08-VERIFICATION:33, 09-CONTEXT.md) are **edit-in-place + bracketed supersession note** (e.g., "[corrected Phase 11: 19 — no en.json; EN lives in markup]") — matching the Phase 9 UAT supersession-note policy (records show the fact AND the correction trail; silent edits rejected as falsifying what the verifier actually saw).
- **D-06:** Commit shape = **3 commits**: (1) F-1 AGENTS.md rewrite; (2) F-2/F-3/F-4 hygiene batch (F-3 privacy.html date → "September 8, 2026" rides here); (3) F-5 09-USER-SETUP header flip rides the HV-09a UAT-record commit. Audit's recommended shape, matches the atomic-commit convention.
- F-4 (08-RUNBOOK §5 row ⏳→✅ with pass date) is a live-checklist flip — plain edit, no note ceremony.

**UAT owner records (HV-06 / HV-09a / HV-09b)**
- **D-07:** All three human verifications run **in-phase with the owner live at the keyboard**: agent pre-writes the test scaffolding, walks the owner through each check in-session, records results. If any check can't be completed, it stays **documented as owner-pending** — the phase still closes.
- **D-08:** Records append to the **phase's own UAT files** — HV-06 → `06-UAT.md` (test 9 re-run), HV-09a → `09-UAT.md` — with dated supersession-note framing (Phase 9 policy). Old files keep the mechanical `uat-passed` predicate complete. A centralized 11-UAT.md rejected: splits records from their test definitions.
- **D-09:** HV-09a is a **split record**: live checks (blocked reCAPTCHA → ~10s appcheck status, message lands in Firestore ±consent) recorded in-session; the **GA4 token-failure-event clause becomes an owner-console sub-item** (≤24h Events lag; owner's pihole blocks GA4/DebugView) confirmed later in Firebase Events. The full record closes eventually; the phase doesn't stall on pihole lag.

**P-10-3: star-uniqueness CI gate**
- **D-10:** **Folded in.** Extend `scripts/i18n-keycheck.mjs` with a fail-closed star-uniqueness assertion on the `geohist.tier1.*` keys (ADR-550 D4: ★ exactly once — missing or duplicated = red). Zero new dependencies. Rationale: closes the last audit nit permanently; a malformed Tier-1 row can never ship unflagged at owner flip.

**Sequencing**
- **D-11:** **`/gsd-ship` → Phase 11 → `/gsd-complete-milestone v2.0`.** Ship first reconciles remote main (3eaf9d9 ahead of local 275046b, content identical; fetch/rebase + commit deferred 10-01/10-02). Phase 11 then executes on the reconciled tree — zero rebase conflicts with its `.planning`/AGENTS.md edits. Matches the audit verdict's own recommended order.

### the agent's Discretion
- AGENTS.md section structure and length (rewrite shape is free; substance = shipped v2.0 reality).
- Whether the domain-gate allowlist entry for AGENTS.md is dropped after the rewrite (if the new AGENTS.md has zero old-domain refs, the gate can start enforcing it — preferred; researcher verifies gate mechanics).
- Exact supersession-note wording for F-2 fixes (one-line bracketed style).
- Phase validation shape: re-run `npm run validate` battery (html/domain/links/i18n-detect/i18n) after edits; keycheck extension needs a red-gate proof both directions (Phase 6 pattern). No product deploy expectations for docs-only changes, though Actions runs on push regardless (harmless).
- HV-09b favicon check depth (visual glance on live tab; `/favicon.ico` 200 + icon links already machine-verified).
- ROADMAP.md phase-11 goal/success-criteria backfill during planning (planner-owned).

### Deferred Ideas (OUT OF SCOPE)
- **Owner-backlog rollup** — consolidating FIRE-10 flip, Tier-1 rating flip, and GSC 180-day watch into a single owner-backlog surface. Declined this phase; items stay parked in 09-RUNBOOK.md, 10-RUNBOOK.md, and 08-RUNBOOK/STATE respectively.
- **Full `.planning` old-domain sweep** — rejected as history rewriting (D-04). If a future phase needs a grep-clean tree for tooling reasons, it must decide its own policy.

**Additional hard scope limits (11-CONTEXT `<domain>`):** NOT in this phase: any product/site feature work; sweeping the ~70 historical `.planning` old-domain references (research docs and phase records legitimately document pre-migration state); rewriting `research/STACK.md`; the deferred-by-design owner items (FIRE-10 enforcement flip, Tier-1 rating flip, GSC 180-day watch) — those stay parked in their runbooks.

**Explicitly out of rewrite scope (11-CONTEXT canonical_refs):** `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `FEATURES.md`, `PITFALLS.md`, `MILESTONES.md`, `milestones/` archive — historical old-domain refs stay (D-04).
</user_constraints>

<phase_requirements>
## Phase Requirements

No REQUIREMENTS.md IDs are mapped to this phase (doc/process-debt work). The binding item IDs are the audit entries + context decisions. Planner maps them to plan tasks:

| ID | Source | Description | Research Support |
|----|--------|-------------|------------------|
| F-1 | v2.0-MILESTONE-AUDIT (WARNING) | Full AGENTS.md rewrite to shipped v2.0 reality; URL rot lines 7/14/67/90; i18n decision 7 lines 36/81–85; What-NOT-to-Use line 133; strip GSD markers | Stale-line inventory + shipped-reality fact pack below (§ "F-1 rewrite fact pack") |
| F-2 | audit (INFO) | "20 dictionaries"→19 in 08-02-SUMMARY:121, 08-VERIFICATION:33, 09-CONTEXT.md (4 hits) + supersession notes (D-05) | Exact hit lines quoted below |
| F-3 | audit (INFO) | privacy.html:37 date "September 7"→"September 8, 2026" | Line quoted below |
| F-4 | audit (INFO) | 08-RUNBOOK §5 line 173 ⏳→✅ with pass date | Row quoted; pass date verified = 2026-09-07 (commit c72b3a2) |
| F-5 | audit (INFO) | 09-USER-SETUP.md line 5 "Status: Incomplete"→"Complete", rides HV-09a commit | Line quoted below |
| HV-06 | audit (OWNER-PENDING) | UAT test 9 re-run record appends to 06-UAT.md (D-08) | File structure + prior-record finding below |
| HV-09a | audit (OWNER-PENDING) | UAT test 5 repeat record appends to 09-UAT.md; unblocks F-5; D-09 split record | Checklist source (09-USER-SETUP.md §G-09-5) + record skeleton below |
| HV-09b | audit (OWNER-PENDING) | Favicon visual glance; machine side already verified | Record shape below |
| P-10-3 | 10-VERIFICATION (folded in per D-10) | Star-uniqueness fail-closed assertion in i18n-keycheck.mjs + red-gate proof both directions | Full extension design below |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| AGENTS.md rewrite (F-1) | Repo doc (project instructions file) | — | Pure doc; consumed by every future agent session; no runtime surface |
| `.planning/PROJECT.md` line 5 URL fix | Repo doc (planning source) | — | D-02 names it the only source-file edit |
| F-2/F-3/F-4 hygiene batch | Repo docs + one product page (`privacy.html`) | CI validate (html gate re-run) | privacy.html is the only scanned product surface touched; others are `.planning` historical records (allowlisted, unscanned) |
| UAT records (HV-06/09a/09b) | Planning records (`.planning/**-UAT.md`) | Owner console + live prod tabs (human, in-session) | Records are files; the *checks* run on prod with the owner at the keyboard (D-07) |
| P-10-3 star-uniqueness gate | CI gate code (`scripts/i18n-keycheck.mjs`) | `npm run validate` chain + Actions validate job | Rides the existing validate chain — no new workflow [VERIFIED: .github/workflows/deploy.yml:27-28 runs `npm run validate`] |
| F-5 header flip | Planning record (09-USER-SETUP.md) | — | Rides the HV-09a record commit (D-06) |

## Fix-Target Inventory (exact lines, verified this session)

### F-1 — AGENTS.md stale content (rewrite target)

Current file: 199 lines. Stale content located and read this session:

| Lines | Content | Problem |
|-------|---------|---------|
| 7, 14, 67 | `https://persano.github.io` (project para, Hosting constraint, authorized-domains note) | URL rot — canonical is geohisttrivia.com since Phase 8 [VERIFIED: .planning/PROJECT.md:93] |
| 90 | `Sitemap: https://persano.github.io/sitemap.xml` | Actual robots.txt: `Sitemap: https://geohisttrivia.com/sitemap.xml` [VERIFIED: robots.txt, this session] |
| 36 | Decision 7: "i18n (EN/ES/PT) — **Per-language static HTML in subdirs** (`/es/`, `/pt/`) + hreflang alternates + tiny detect/redirect script" | Pre-pivot design; shipped reality is single-URL dictionary swap [VERIFIED: js/i18n.js:1-18] |
| 81–85 | Decision 7 detail (hreflang alternates, subdir redirect script, "JSON dictionaries … complement, not the primary mechanism") | Same inversion |
| 89 | Sitemap "including `/es/`, `/pt/` variants, with `xhtml:link rel="alternate" hreflang` entries" | No `/es/` `/pt/` dirs exist |
| 133 | What-NOT-to-Use row: "JSON-dictionary JS-swap as primary i18n — Kills per-language SEO, hreflang targets, no-JS accessibility" | Describes the SHIPPED architecture as banned — highest-risk line |
| 1, 20, 22, 155, 157, 162, 164, 169, 171, 176, 178, 191, 193, 199 | `<!-- GSD:... -->` injection/section markers | Strip per D-03 (see marker nuance below) |
| 159–161, 166–168 | CONVENTIONS/ARCHITECTURE empty placeholders ("not yet established" / "not yet mapped") | Populate with real patterns per D-03 |

**Marker-strip nuance (planner decision):** D-03 targets `<!-- GSD:...-start source:... -->` injection markers. The file has 7 section markers: `project-start source:PROJECT.md` (line 1), `stack-start source:research/STACK.md` (22), `conventions-start source:CONVENTIONS.md` (157), `architecture-start source:ARCHITECTURE.md` (164), `skills-start source:skills/` (171), `workflow-start source:GSD defaults` (178), and `profile-start` (193, **no `source:` attr** — managed by `generate-claude-profile`, "do not edit manually"). The first 6 carry source wiring and match D-03's strip intent exactly; the profile block is generator-managed, not stale-injected content. Recommendation: strip the 6 `source:`-wired markers, and for the profile block either keep the block+marker intact or preserve its marker with the block — its content is not stale and an external generator claims ownership. Planner pins in the plan.

**Keep-true facts the rewrite must retain** (audit fix instruction): the github.io dual-hosts→301 fact. Critical mechanic: `check-no-old-domain.mjs` scans for the literal host string (`persano.github.io`, runtime-assembled from parts so the script source stays clean). To drop AGENTS.md from the gate allowlist (discretion item, preferred), the rewritten doc must phrase the dual-hosts fact WITHOUT the literal — e.g. "the repo's legacy `*.github.io` Pages host dual-serves then 301-redirects path-preserved to the apex" [VERIFIED mechanics: scripts/check-no-old-domain.mjs:38-39,66-68,82].

### F-1 rewrite fact pack (shipped v2.0 reality — sources verified this session)

The rewritten doc's substance, sourced from locked decisions + live code:

**Project/hosting:** static GitHub Pages site behind apex `https://geohisttrivia.com` (HTTPS enforced, `protected_domain_state: verified`, www canonicalized to apex); legacy repo host dual-serves then 301s path-preserved; GeoHist site in `/geohist/` subdir; app in Google Play review [VERIFIED: .planning/PROJECT.md:81,93,117; STATE.md:105].

**Stack:** plain HTML5/CSS3/ES2020+ vanilla JS, zero build, no SSG/framework; Firebase JS SDK **12.18.0 exact-pinned** gstatic ESM CDN, modular API only; products = Analytics + Anonymous Auth + Firestore [VERIFIED: AGENTS.md:32 (still true), STATE.md:82-88].

**Fork-shaped Firebase split (LOCKED):** analytics imported only in `consent.js` (post-consent, load-gating — dynamic import IS the consent); auth+firestore only in `contact.js` submit path; "App Check must ride contact.js submit path, never page load" [VERIFIED: STATE.md:83].

**App Check (Phase 9 shipped):** `ReCaptchaEnterpriseProvider` (classic v3 deprecated for new registrations — D-01 revised 2026-09-08); dormant-by-default empty `recaptchaSiteKey` gate → site key now activated; ~3s reachability probe before init (blocked reCAPTCHA skips init); bounded ~10s `getToken` race + record-and-swallow + deliver-anyway; `contact.status.appcheck` keyed status (#171); consent-gated `appcheck_token_failure` via `persano:appcheck` document-event bridge; enforcement flip = owner console, evidence-gated (≥30 successful submissions + ready-to-enforce signal), never calendar [VERIFIED: STATE.md:106-118, 01 [Locked] rows].

**i18n (Phase 7 shipped — the correct Decision-7 content):** single-URL keyed-engine dictionary swap. EN is the shipped raw HTML; `js/i18n.js` snapshots the baseline once, resolves via stored preference (`persano.lang`) > first supported match across `navigator.languages` (table-driven DETECT_TABLE) > `en`; fetches same-origin flat JSON from `/js/i18n/` and swaps keyed text/attrs via textContent/setAttribute only. 20 supported languages (SUPPORTED array: en es pt-BR fr de it nl pl tr vi id ru el hi bn ar ur ja ko zh); 19 JSON dictionaries (no `en.json` — EN lives in markup); **178-key exact surface**, exact set-equality per dictionary, CI-gated; keyed nodes plain-text-only; RTL `ar`/`ur` via `<html dir>` flip + `[dir="rtl"]` CSS block; per-language line-height overrides; native select switcher ×20 endonyms, fixed D-03 grouped order [VERIFIED: js/i18n.js:1-48,28-37,43; STATE.md:82; keycheck 178×19 green this session].

**Contact form:** `signInAnonymously()` → `addDoc()` to `messages`; create-only Firestore rules (repo `firebase/firestore.rules` is source of truth, but console ruleset NOT byte-identical — future rules edits require console re-paste [VERIFIED: STATE.md:87]); honeypot; Firebase config public-by-design, hardening console-side (API-key HTTP-referrer restriction).

**Social proof (Phase 10 shipped):** 4-pill facts strip (keyed, aria-labeled, static, zero links); Tier-1 rating row shipped OFF (`<div class="proof-row" hidden>`, unkeyed `0.0` self-flagging span, single star SVG, one attributed `rel="noopener"` Play link); owner flip = 2 edits per 10-RUNBOOK.md gated on real visible Play data (no minimum floor); Tier-2 `aggregateRating` permanently OFF via inert HTML comment outside the JSON-LD script (on-site-review-source precondition) [VERIFIED: geohist/index.html:86-95; STATE.md:121-123].

**SEO/CI:** sitemap.xml (6 apex `<loc>`, no lastmod), robots.txt apex Sitemap line, SoftwareApplication + MobileApplication JSON-LD, OG image 1200×630, `favicon.ico` single-entry ICO (node builtins), `app-ads.txt`, GSC verification file. Validate chain = `validate:html && validate:domain && validate:links && validate:i18n-detect && validate:i18n` [VERIFIED: package.json:5-10]. Deploy chain = checkout@v7 → configure-pages@v6 → upload-pages-artifact@v5 → deploy-pages@v5 [VERIFIED: .github/workflows/deploy.yml:40-48]. Dev deps: html-validate 11.12.0, linkinator 8.1.0, @axe-core/cli 4.13.0, lighthouse 13.4.1, sharp 0.35.4 [VERIFIED: package.json:15-21].

**Updated What-NOT-to-Use:** all current rows stay true except the JSON-dictionary row (line 133) which inverts to its opposite: **per-language HTML subdirs + hreflang is now the anti-pattern** ("120 files of duplicate markup, ×20 maintenance" — REQUIREMENTS.md Out-of-Scope), and "gtag Consent Mode / CMP libraries" rows stay. Add: aggregateRating mirroring Play ratings stays barred even when real (review-snippet policy).

**Conventions section (populate — real patterns from the 10 phases):** one atomic commit per unit; conventional-commit subjects; supersession-note policy for historical records (original text stays, dated bracketed correction appends — never silent edits); `.planning/` is publicly served → no secrets/debug tokens in runbooks/UAT/console docs, console-UI instructions only; uat-passed predicate is mechanical (any `result: issue` = blocker — records land clean or with supersession framing); red-gate-proof pattern for gate changes (mutate→FAIL→restore byte-identical→PASS, both directions); i18n drafting = two-pass + app `strings.xml` glossary + register table; CJK punct gate scope ja+zh (ko exempt, digit-period exception); changelog EN-entries documented i18n exception; deploy via GitHub Git Data API bridge with mandatory per-blob sha assertions when local remote ops are harness-blocked (Phase 9/10 precedent); zero globals (D-26), classic defer scripts, inline SVG icons stroke/currentColor, texture utilities decoration-only.

**Architecture section (populate — live file map):** root `index.html` (hub, keyed) + `404.html`; `geohist/{index,guide,contact,changelog,privacy}.html` (5 keyed pages); `css/base.css` (single shared stylesheet, custom properties, `[dir="rtl"]` block, `.proof-*` block); `js/{i18n,consent,contact,firebase-config}.js` + `js/i18n/*.json` (19 dicts); `scripts/{i18n-keycheck.mjs,check-no-old-domain.mjs,i18n-detect.test.mjs,i18n-surface.mjs,a11y-audit.mjs,smoke-check.sh,make-webp.mjs,og-image.mjs}`; `firebase/firestore.rules`; `sitemap.xml`, `robots.txt`, `favicon.ico`, `app-ads.txt`, `google7da873f4e9609872.html`, `.nojekyll` [VERIFIED: live tree listing this session]. Data flow: page load → i18n.js detect+apply (snapshot-walk) → consent.js (load-gated analytics) → contact.js submit path (probe → appCheck init → getToken race → auth → firestore).

### F-2 — "20 dictionaries" hits (verified lines)

- 08-02-SUMMARY.md:121 — "`npm run validate` → exit 0 (… 20 dictionaries × 170-key exact parity ✓)" [VERIFIED]
- 08-VERIFICATION.md:33 — "20/20 dictionaries exactly cover the 170-key live surface" [VERIFIED]
- 09-CONTEXT.md — 4 hits: line 9 "(key #171 lands in all 20 dictionaries atomically)", line 28 "key #171 in all 20 dictionaries atomically", line 69 "`js/i18n/*.json` (20 dictionaries, 170 keys)", line 89 "20 dictionaries + keycheck gate" [VERIFIED via grep + file read]

Ground truth: **19 JSON dictionaries on disk** (counted this session: 19 files; keycheck PASS ×19 at 178), no `en.json` — EN lives in markup. The supersession note must state why so future agents stop hunting for en.json (11-CONTEXT `<specifics>`).

Out of scope (stays as-is): ROADMAP.md:66,74; research/*.md; PROJECT.md:17; the audit file itself — historical/additions framing (D-04 scope).

### F-3 — privacy.html:37 [VERIFIED]

`<p><strong>Last updated:</strong> September 7, 2026</p>` → `September 8, 2026` (last content change was 2026-09-08: disclosure li da374dd, label fix 2d8d954 [VERIFIED: audit F-3]). Rides hygiene commit (D-06). Product page — `validate:html` covers it via `geohist/*.html` glob.

### F-4 — 08-RUNBOOK.md §5 line 173 [VERIFIED]

Row: `| URL rewrite (44 old-domain refs + 5 prose headers, one atomic commit) + CI old-domain gate | no | ⏳ plan 08-02 — **starts only after your §1–§4 gate items pass** |` → flip to ✅ with pass date **2026-09-07** (migration commit `c72b3a2` dated 2026-09-07, CI validate+deploy green [VERIFIED: git log this session; STATE.md:105]).

Adjacent line 174 (smoke row `⏳ plan 08-02/08-03`): reality is it ALSO passed (STATE.md:105 "smoke ALL PASS on apex, curl triple" — 08-02 landed 2026-09-07). Audit names only line 173; 11-CONTEXT instructs "verify gate state before flipping" for 174. Both flips are factually supported; planner decides strict-scope (173) vs accuracy (173+174). Recommendation: flip both — same table, same concern, both verified passed; a freshly-edited table leaving one stale ⏳ recreates the F-4 pattern.

### F-5 — 09-USER-SETUP.md line 5 [VERIFIED]

`**Status:** Incomplete` → `**Status:** Complete`. Only console item (Migrate keys) done 2026-09-08 [VERIFIED: line 15 "[x] … completed by owner 2026-09-08"]. Rides the HV-09a record commit (D-06 commit 3).

## Standard Stack

No new tooling. Everything needed exists and is verified:

| Tool | Version | Role in phase | Status |
|------|---------|--------------|--------|
| Node | v26.5.1 | runs gates + red-gate probes + U+2605 sweeps | ✓ available [VERIFIED: this session] |
| npm | 11.17.0 | `npm run validate` battery | ✓ available [VERIFIED] |
| i18n-keycheck.mjs | (repo) | P-10-3 extension target; zero-dep ESM | ✓ green at 178×19 [VERIFIED: this session] |
| check-no-old-domain.mjs | (repo) | domain gate; AGENTS.md allowlist mechanics | ✓ green [VERIFIED] |
| html-validate | 11.12.0 (pinned) | covers privacy.html edit | ✓ in node_modules |
| linkinator | 8.1.0 (pinned) | links gate in battery | ✓ in node_modules |

**Installation:** nothing. **Package Legitimacy Audit:** not required — zero new packages (D-10 mandates zero new dependencies; D-01 is a doc rewrite). No `npm view` runs needed.

## Architecture Patterns

### Work-item flow (what depends on what)

```
/gsd-ship (D-11 precondition: reconcile remote main 3eaf9d9)
   │
   ▼
Unit 1: F-1 AGENTS.md rewrite ──► commit 1
         (+ PROJECT.md line 5; optional: drop AGENTS.md from gate ALLOW)
   │            validates: npm run validate (domain gate re-check if ALLOW changed)
   ▼
Unit 2: F-2/F-3/F-4 hygiene batch ──► commit 2
         (08-02-SUMMARY, 08-VERIFICATION, 09-CONTEXT ×4, 08-RUNBOOK §5, privacy.html date)
   │            validates: npm run validate:html (+full battery cheap)
   ▼
Unit 3: UAT records ──► commit 3
         (agent scaffolds → owner runs checks live → append records → F-5 flip)
   │
   ▼
Unit 4: P-10-3 gate extension ──► commit 4
         (edit keycheck.mjs → red-gate proof both directions → red-gate-proof.md)
   │            validates: npm run validate (new gate in chain)
   ▼
Phase gate: full npm run validate green → phase closes → /gsd-complete-milestone v2.0
```

### Pattern 1: Supersession note (D-05) — historical-record correction

**What:** original text stays verbatim; a dated bracketed correction appends inline.
**When to use:** every F-2 fix (and the HV record framing).
**Example (08-VERIFICATION.md:33):**
```
`npm run validate` … → exit 0; 20/20 dictionaries exactly cover the 170-key live
surface. [corrected Phase 11: 19 JSON dictionaries — no en.json; EN is the markup
baseline, so the "20" counted locales, not files]
```

### Pattern 2: UAT re-run record append (D-07/D-08/D-09) — Phase 9 shape

**What:** new numbered test appended to the existing phase UAT file; `expected:` mirrors the checklist; `result:` + `note:` carry the dated supersession framing; Summary counters updated so the mechanical predicate stays complete.
**Skeleton (09-UAT.md append):**
```markdown
### 10. UAT test 5 repeat — G-09-5 formal closure per 09-USER-SETUP checklist (Phase 11 re-run)
expected: |
  Prod incognito, DevTools block BOTH *recaptcha* AND *google.com/reload*, submit
  with analytics consent granted → contact.status.appcheck within ~10s, button
  re-enables, form NOT reset, message lands in Firestore messages un-attested.
  Repeat with consent denied → same status, no event, message still lands.
  [GA4 appcheck_token_failure clause → owner-console sub-item: Firebase console →
  Analytics → Events, ≤24h lag (owner pihole blocks GA4/DebugView) — Phase 11 D-09 split]
result: pass
note: "Owner-executed in-session 2026-09-XX (Phase 11 HV-09a). GA4 event
confirmation pending as owner-console sub-item per D-09."
```
Then update Summary counters (`total: 10, passed: 10`). Same pattern for 06-UAT.md (HV-06) — note: **06-UAT.md already contains test 11, a "UAT test 9 re-run — G-06-9 closure" pass record dated 2026-09-06** [VERIFIED: 06-UAT.md:81-83]. The audit still flags HV-06 as unrecorded because that record predates the ×20 engine + apex domain; the Phase 11 record should be framed as a re-run **under shipped v2.0 reality** (post Phase 7/8, on geohisttrivia.com), referencing test 11 as the prior record — honest supersession, no duplicate history.

### Pattern 3: Red-gate proof (Phase 6 template — mandatory for P-10-3)

**What:** mutate → run gate → observe FAIL (exit 1) → restore byte-identical → re-run → PASS (exit 0); each cycle recorded with mutation, command, observed output, exit code in `red-gate-proof.md` in the phase dir.
**Restore mechanics:** git restore is fine if the tree is clean-committed; **sha256-verified restore** if in deferred-commit mode (Phase 10 precedent — `git checkout` unusable there [VERIFIED: STATE.md:122]).

### Anti-Patterns to Avoid
- **Silent edits of historical records:** falsifies what the verifier saw; always bracketed supersession note (D-05).
- **Regenerating AGENTS.md from research/STACK.md:** additions-only v2 framing — wrong shape (D-02).
- **Centralizing UAT records in a new 11-UAT.md:** splits records from test definitions (D-08 rejected this).
- **Writing the star gate without a red-gate proof:** a green-only gate is unproven (D-10 demands both directions).
- **Leaving `persano.github.io` literals in the rewritten AGENTS.md if dropping the ALLOW entry:** the gate would trip itself; phrase the dual-hosts fact without the literal.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Star-uniqueness enforcement | New standalone lint script / new CI job | Extend `i18n-keycheck.mjs` (one assertion beside the CJK-punct check) | Rides existing chain + existing run command; Phase 6/7 extension precedent; D-10 says so |
| Gate-failure proof | Trust "it would fail" reasoning | Phase 6 red-gate-proof.md cycle record | Observed output + exit codes are the evidence standard in this repo |
| UAT record storage | New centralized UAT doc | Append to existing phase UAT files (D-08) | Keeps records with test definitions; mechanical predicate stays per-file |
| Dictionary count/parity facts | Recount by hand in prose | Run `node scripts/i18n-keycheck.mjs` / `node scripts/i18n-surface.mjs` | Gates print the exact surface size and file count |
| i18n engine description in AGENTS.md | Paraphrase from memory | Quote js/i18n.js header (D-25..D-34 documented there) | The header IS the authoritative engine spec |

**Key insight:** every "new" mechanism this phase needs already exists in the repo as a proven pattern — the phase is assembly, not invention.

## P-10-3 Extension Design (verified against live tree)

### Current baseline (green, verified this session)
- `node -e` sweep: **0 U+2605 hits in all 19 dictionaries; exactly 1 `proof-row-star` in `geohist/index.html`; 0 ★ literals in markup** — the invariant holds today; the gate locks it.
- tier1 keys exist at identical positions in all 19 dicts: `"geohist.tier1.prefix"` / `"geohist.tier1.suffix"` (e.g. es.json:178-179 `"Valoración de"` / `"en Google Play"`) [VERIFIED: grep of js/i18n/*.json, this session].

### Extension shape (zero-dep, inside existing structure)

```js
// Header comment gains: "3. Star-uniqueness (Phase 11, P-10-3 / ADR-550 D4):
//  the Tier-1 row's star is exactly ONE inline SVG; ★ (U+2605) never appears
//  as text — not in any dictionary value, not in the markup. Missing or
//  duplicated = red (fail-closed)."

const TIER1_NS = 'geohist.tier1.';
const STAR = '\u2605';

// (a) inside the existing per-dictionary value loop (keycheck.mjs:127-137):
if (String(value).includes(STAR)) {          // scope decision below
  console.error(`i18n-keycheck: FAIL — ${file}: "${key}" contains a literal star (★); the Tier-1 star is the row's single inline SVG`);
  failed = true;
}

// (b) markup check (once, after surface extraction):
const landing = readFileSync(join(repoRoot, 'geohist', 'index.html'), 'utf8');
const starSvgs = (landing.match(/proof-row-star/g) || []).length;
const starLiterals = landing.split(STAR).length - 1;
if (starSvgs !== 1 || starLiterals !== 0) {
  console.error(`i18n-keycheck: FAIL — star uniqueness: ${starSvgs} proof-row-star SVG(s) (expected exactly 1), ${starLiterals} ★ literal(s) in markup (expected 0)`);
  failed = true;
}
```

**Scope decision for the planner (D-10 says "on the `geohist.tier1.*` keys"):**
- **Option A (literal-minimal):** star check only when `key.startsWith(TIER1_NS)`. Matches D-10 wording.
- **Option B (recommended):** sweep U+2605 across ALL dictionary values + the markup checks. Stronger, still one condition; matches the invariant 10-VERIFICATION actually verified ("no U+2605 in **any** dictionary value", truth 7) and ADR-550 D4 fail-closed spirit — a future surface wanting a text star must route through a visible gate decision, not slip through.
- Either way the markup check (exactly one star SVG, zero ★ text) is what enforces "★ exactly once — missing or duplicated = red".

**Red-gate proof cycles (both directions locked by D-10):**
1. **Missing:** delete the `proof-row-star` SVG (or rename its class) in `geohist/index.html` → run → FAIL ("0 proof-row-star") → restore byte-identical → PASS.
2. **Duplicated (dictionary):** add `★` into one `geohist.tier1.suffix` value (e.g. es.json) → FAIL naming file+key → restore → PASS.
3. *(optional)* **Duplicated (markup):** add a second star SVG to the row → FAIL ("2 proof-row-star") → restore → PASS.

Record in `.planning/phases/11-close-v2-0-audit-debt-f-1-agents-md-rewrite-doc-hygiene-batc/red-gate-proof.md` per the Phase 6 template (cycles with mutation/command/observed output/exit code; final green battery `node scripts/i18n-keycheck.mjs && npm run validate`).

**Interplay note:** ★ (U+2605) is not in `CJK_PUNCT = /[,!?:;()"] /` [VERIFIED: scripts/i18n-keycheck.mjs:44], so a star in ja/zh values passes today's punct gate — confirming the extension adds real coverage, not a duplicate check.

**Flip-compat note:** the gate must survive the owner's Tier-1 flip (remove `hidden` + edit `0.0`→real number — 10-RUNBOOK §2 never touches the SVG), so the flip cannot red the gate. Document the invariant in the keycheck header.

## Runtime State Inventory

(String-replacement phase — URL literals + one date + one status flip. Answered per category; nothing left blank.)

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — verified: no DB/datastore involved; dictionaries and HTML are files scanned by gates | none |
| Live service config | None — verified: no n8n/Datadog/Tailscale/etc. in project; GitHub Pages config untouched by doc edits | none |
| OS-registered state | None — verified: no Task Scheduler/pm2/launchd/systemd surfaces exist for this repo | none |
| Secrets/env vars | None — verified: privacy date + status flip + doc text carry no secret material; `.planning` publicly served constraint respected (console instructions only in UAT records) | none |
| Build artifacts | None — verified: zero-build site; no egg-info/dist; `node_modules` is dev-only tooling unaffected by doc edits | none |

**Sequencing caveat (D-11):** remote main is ahead of local (3eaf9d9 vs 275046b, content identical; current branch `gsd/phase-10-gated-social-proof` at 023a645 [VERIFIED: git this session]). Phase 11 must not start before `/gsd-ship` reconciles — otherwise the AGENTS.md/.planning edits land on a diverged tree.

## Common Pitfalls

### Pitfall 1: Gate self-trip when dropping the AGENTS.md allowlist entry
**What goes wrong:** rewrite keeps a `persano.github.io` literal (e.g. writing the 301 fact verbatim) while removing `AGENTS.md` from ALLOW → `validate:domain` FAILs → CI red.
**Why:** gate needle is the literal host string; ALLOW is the only exemption [VERIFIED: scripts/check-no-old-domain.mjs:38-39,82].
**How to avoid:** if ALLOW entry is dropped, phrase the dual-hosts fact without the literal (`*.github.io` / "legacy Pages host"); run `npm run validate:domain` immediately after both edits.
**Warning signs:** `Old-domain refs found: AGENTS.md:<line>` in gate output.

### Pitfall 2: Star check written but never proven red
**What goes wrong:** assertion has an inverted/never-true condition; ships green forever, protects nothing.
**Why:** untested fail-closed logic is indistinguishable from dead code.
**How to avoid:** red-gate proof both directions is mandatory (D-10); record observed FAIL output + exit 1 in red-gate-proof.md.
**Warning signs:** proof file missing a FAIL cycle; exit codes not recorded.

### Pitfall 3: UAT record breaks the mechanical uat-passed predicate
**What goes wrong:** GA4 sub-item pending recorded as `result: issue` → predicate reads blocker → phase gate confused.
**Why:** predicate is mechanical — any `result: issue` = blocker, no gap-awareness [VERIFIED: STATE.md:119].
**How to avoid:** D-09 split shape — live checks → `result: pass`; GA4 clause framed as owner-console sub-item in the note/expected text, not an issue result; update Summary counters.
**Warning signs:** appended test without counter update; `result:` values other than pass/issue used inconsistently with the file's established style.

### Pitfall 4: Rewrite reintroduces contradiction via copied sections
**What goes wrong:** copy-pasting still-true-looking v1 sections (Firebase products table, decisions 2–6) into the fresh doc keeps stale claims alive — exactly what D-01 rejected the surgical patch for.
**Why:** v1-era content is 80% right; the wrong 20% is the trap.
**How to avoid:** write sections fresh from the fact pack above; every stack claim sourced from STATE locked decisions or live code; re-check the What-NOT-to-Use table row-by-row.
**Warning signs:** any `persano.github.io` literal, any hreflang/subdir mention, any "EN/ES/PT" three-language framing in the new doc.

### Pitfall 5: Editing `.planning` records that the domain gate or future tooling depends on
**What goes wrong:** over-sweeping "20 dictionaries" fixes into ROADMAP/research files (out of D-04 scope) turns history-keeping into history-rewriting.
**How to avoid:** fix ONLY the audit-named files (08-02-SUMMARY:121, 08-VERIFICATION:33, 09-CONTEXT 4 hits). Everything else stays.

## Code Examples

### Current keycheck value loop (insertion point) — verbatim
```js
// Source: scripts/i18n-keycheck.mjs:126-137
    // Value-quality checks (I18N-09 — see header for rules + exceptions).
    for (const [key, value] of Object.entries(dict)) {
      if (typeof value !== 'string' || value.trim() === '') {
        console.error(`i18n-keycheck: FAIL — ${file}: empty/non-string value for "${key}"`);
        failed = true;
        continue;
      }
      if (PUNCT_LANGS.has(file) && (CJK_PUNCT.test(value) || hasLoosePeriod(value))) {
        console.error(`i18n-keycheck: FAIL — ${file}: "${key}" contains half-width punctuation (${value.slice(0, 40)}…)`);
        failed = true;
      }
    }
```

### Domain-gate allowlist (mechanics for the discretion item) — verbatim
```js
// Source: scripts/check-no-old-domain.mjs:38-39
const LEGACY_HOST = ['persano', 'github', 'io'].join('.');
const ALLOW = new Set(['.planning', 'README.md', 'AGENTS.md', '.git', 'node_modules']);
```
Drop `'AGENTS.md'` from the set (one-word diff) iff the rewrite is literal-free; gate header comment (lines 14-19) lists the allowlist and should be updated in the same edit.

### Validate chain (phase verification gate) — verbatim
```json
// Source: package.json:5-10
    "validate": "npm run validate:html && npm run validate:domain && npm run validate:links && npm run validate:i18n-detect && npm run validate:i18n",
    "validate:html": "html-validate index.html 404.html geohist/*.html",
    "validate:domain": "node scripts/check-no-old-domain.mjs",
    "validate:i18n": "node scripts/i18n-keycheck.mjs",
    "validate:i18n-detect": "node --test scripts/i18n-detect.test.mjs",
    "validate:links": "linkinator . --recurse --skip \"https://geohisttrivia.com\" --skip \"play.google.com\" --skip \"policies.google.com\" --skip \"planning\" --skip \"node_modules\" --timeout 10000",
```

### Tier-1 row markup (what the star gate protects) — verbatim shape
```html
<!-- Source: geohist/index.html:86-95 (verified this session) -->
      <div class="proof-row" hidden>
        <a href="https://play.google.com/store/apps/details?id=com.persano.geohisttrivia" rel="noopener">
          <svg class="proof-row-star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 2.5l2.95 6.32 6.92.63-5.22 4.59 1.54 6.78L12 17.2l-6.19 3.62 1.54-6.78-5.22-4.59 6.92-.63z"/>
          </svg>
          <span data-i18n="geohist.tier1.prefix">Rated</span>
          <span class="proof-row-score">0.0</span>
          <span data-i18n="geohist.tier1.suffix">on Google Play</span>
        </a>
      </div>
```

### HV-09a walkthrough source (owner checklist) — verbatim step list
```
Source: .planning/phases/09-app-check-monitor-first/09-USER-SETUP.md:33-42 (verified)
1. DevTools → Network → request blocking: add BOTH `*recaptcha*` AND
   `*google.com/reload*` (the token POST goes to www.google.com/reload …).
2. Submit the form at https://geohisttrivia.com/geohist/contact.html … consent granted.
3. Expect: appcheck status appears within ~10 seconds … form NOT reset … no auto-retry.
4. Firebase console → Firestore → messages collection: message present (un-attested).
5. With consent granted, the appcheck_token_failure event fires (up to 24 h lag).
6. Repeat with consent denied: same appcheck status, no event, message still lands.
```
Step 5 = the D-09 owner-console sub-item. Favicon item (lines 44-47) = HV-09b, same session.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Keeping the `GSD:profile-start` block/marker (only) while stripping the 6 `source:`-wired markers satisfies D-03; `generate-claude-profile` can still manage its section | F-1 marker nuance | Low — worst case the profile block gets regenerated as placeholder text; cosmetic |
| A2 | Flipping 08-RUNBOOK §5 line 174 (smoke row) alongside line 173 is factually supported (STATE.md:105 smoke ALL PASS 2026-09-07) | F-4 | Low — if planner strict-scopes to 173, nothing breaks; 174 stays stale |
| A3 | HV-09a Firestore check can be done by the owner in Firebase console in-session (messages collection read access) | UAT records | Low — owner has console access (used it 2026-09-09 for test 9); if not, record stays owner-pending per D-07 and phase still closes |
| A4 | PROJECT.md line 5 rides commit 1 (F-1 concern) — D-06 enumerates 3 commits for F-items but doesn't name line 5 explicitly | Commit shape | Low — planner may place it elsewhere; content is what matters |

## Open Questions

1. **AGENTS.md allowlist drop vs keep**
   - What we know: mechanics fully verified (ALLOW set, literal needle); discretion item says dropping is "preferred" if rewrite is literal-free.
   - What's unclear: none technically — planner just pins the choice (and the dual-hosts phrasing that goes with it).
   - Recommendation: drop the entry; phrase the 301 fact as "legacy `*.github.io` Pages host dual-serves then 301s path-preserved to the apex".
2. **Star-check scope: tier1-only vs all-values sweep**
   - What we know: D-10 wording says tier1 keys; 10-VERIFICATION's verified invariant was all-19-dicts zero-★.
   - Recommendation: Option B (all-values + markup) — stronger, trivially cheap, fail-closed spirit. Planner pins.
3. **08-RUNBOOK §5 line 174 flip**
   - Recommendation: flip both rows with pass date 2026-09-07 (see A2).
4. **HV-09b record placement**
   - Recommendation: fold into the same 09-UAT.md append as HV-09a (the USER-SETUP checklist itself groups them: "Gap Re-verification — G-09-5 + G-09-6"), as its own small test entry or checklist-item-2 confirmation — planner pins.
5. **Commit placement for P-10-3**
   - What we know: D-06's 3-commit shape covers the audit F-items; P-10-3 was folded in via D-10 without commit assignment.
   - Recommendation: 4th atomic commit (code + red-gate-proof.md) — keeps D-06's shape intact and respects one-concern-per-commit.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | all gates, red-gate probes, sweeps | ✓ | v26.5.1 | — |
| npm | `npm run validate` battery | ✓ | 11.17.0 | — |
| node_modules (html-validate, linkinator, …) | validate:html / validate:links | ✓ | pinned per package.json | — |
| Owner (human) | HV-06 / HV-09a / HV-09b live checks | required in-session | — | D-07 escape: record owner-pending; phase still closes |
| Firebase console access | HV-09a Firestore check; GA4 sub-item later | owner-side | — | D-09 split covers GA4 lag/pihole |
| Live prod (geohisttrivia.com) | all UAT checks | ✓ (audit-verified green 2026-09-10) | — | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — note the standing deploy constraint: if local `git push`/merge are harness-blocked during execution, the sanctioned remote channel is the GitHub Git Data API bridge with mandatory per-blob sha assertions (Phase 9/10 precedent, STATE.md) [VERIFIED: STATE.md:114,120].

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is explicitly `false` in `.planning/config.json` [VERIFIED: config.json:24]. Phase validation shape (discretion item, D-context): re-run `npm run validate` after each unit touching scanned surfaces; full battery green = phase gate; red-gate proof for the keycheck extension.

## Security Domain

> Skipped — `workflow.security_enforcement` is explicitly `false` in `.planning/config.json` [VERIFIED: config.json:22]. Standing constraint honored throughout: `.planning/` is publicly served — UAT records, scaffolding, and runbook edits stay secret-free (console-UI instructions only; no debug tokens) [VERIFIED: STATE.md:111; 09-USER-SETUP.md:31,51].

## Sources

### Primary (HIGH confidence — read this session)
- `.planning/phases/11-.../11-CONTEXT.md` — D-01..D-11, scope, canonical refs
- `.planning/v2.0-MILESTONE-AUDIT.md` — F-1..F-5/HV-06/HV-09a/HV-09b exact items + verdict
- `AGENTS.md` (full 199-line read) — stale-line inventory + marker census
- `.planning/PROJECT.md` — line 5 target; hosting truth line 93; Key Decisions table
- `.planning/STATE.md` — locked decisions, pihole blocker, deploy-bridge precedent
- `scripts/i18n-keycheck.mjs` (full) — extension target structure
- `scripts/check-no-old-domain.mjs` (full) — gate + ALLOW mechanics
- `package.json`, `.github/workflows/deploy.yml` — validate/deploy chains
- `.planning/phases/09-app-check-monitor-first/09-USER-SETUP.md` — F-5 target + HV-09a/09b checklist
- `.planning/phases/09-app-check-monitor-first/09-UAT.md` — record-append target structure
- `.planning/phases/06-changelog-page/06-UAT.md` — HV-06 target + prior re-run record (test 11)
- `.planning/phases/06-changelog-page/red-gate-proof.md` — proof template
- `.planning/phases/10-gated-social-proof/10-CONTEXT.md`, `10-VERIFICATION.md` — D-04/D-05 tier1 shape, P-10-3 disposition
- `.planning/phases/08-custom-domain-migration/08-02-SUMMARY.md:121`, `08-VERIFICATION.md:33`, `09-CONTEXT.md` (lines 9/28/69/89) — F-2 hits
- `.planning/phases/08-custom-domain-migration/08-RUNBOOK.md:173-174` — F-4 rows
- `geohist/privacy.html:37`, `geohist/index.html:86-95`, `js/i18n.js:1-60`, `js/i18n/*.json` (tier1 keys + count), `robots.txt` — live-tree facts
- `.planning/config.json` — nyquist_validation: false, security_enforcement: false

### Secondary (MEDIUM confidence)
- `npm run validate` full-battery run output (this session, green; keycheck 178×19 + OK tail quoted in session log)

### Tertiary (LOW confidence)
- None — no web/training-knowledge claims; all facts are in-repo or session-run.

## Metadata

**Confidence breakdown:**
- Fix-target inventory: HIGH — every line read this session, quotes verbatim
- P-10-3 design: HIGH — extension point, invariant baseline, and gate mechanics all verified live
- UAT record shapes: HIGH — both target files read; Phase 9 pattern established
- Rewrite fact pack: HIGH for shipped-reality facts (STATE/PROJECT/i18n.js/index.html read); section structure itself is agent discretion (D-01)

**Research date:** 2026-09-10
**Valid until:** phase executes immediately after /gsd-ship (D-11) — no drift window expected; re-verify only if execution slips past 2026-09-24 or a new deploy changes the scanned surfaces.

---
*Researcher: gsd phase researcher — all line references verified against the working tree this session.*
