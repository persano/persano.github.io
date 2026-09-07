# Project Research Summary

**Project:** Persano — GeoHist Trivia site, v2.0 "Full Deferred Scope" milestone
**Domain:** Live zero-build static GitHub Pages site (agent-maintained) — additive features onto a shipped v1
**Researched:** 2026-09-05
**Confidence:** HIGH (all load-bearing claims verified against official Firebase / Google Search Central / GitHub / MDN docs fetched this session, plus direct reads of the live repo source)

## Executive Summary

This milestone adds five features to an already-live, already-validated site: a changelog page (CONT-06), 17 new localizations with RTL for ar/ur (I18N-05), a custom-domain migration (HOST-01), Firebase App Check on the contact form (FIRE-07), and gated social proof / aggregateRating (SEO-05). The defining research conclusion: **this is an integration milestone, not a build milestone** — zero new runtime or dev dependencies are needed, the only new artifact beyond JSON dictionaries is one static HTML page, and every feature bolts onto existing, frozen architecture (`i18n.js` dictionary-swap engine, `contact.js` lazy-import fork, hand-rolled CI). The recommended stack delta is minimal: `dir` attribute + CSS logical properties for RTL (platform features), `firebase-app-check.js` at the existing 12.18.0 pin (verified live on gstatic), and an extension of the existing zero-dep `i18n-keycheck.mjs` gate.

Three research findings overturn assumptions inherited from the v1 planning docs and must be encoded in the roadmap: (1) **no hreflang / per-language URLs** — v1 shipped in-place dictionary-swap on single URLs, so hreflang is not applicable to any of the 17 new languages; converting to per-language static subdirs is the top anti-pattern (120 files of duplicate markup, ×20 maintenance). (2) **No CNAME file** — GitHub docs are explicit that Actions-published Pages ignore it; the domain lives in repo Settings. (3) **aggregateRating cannot legally mirror Play ratings** — Google's review-snippet guidelines bar aggregating ratings "from other websites," so the gate's precondition must be reworded to "on-site rating source exists"; Play-sourced numbers get a *visible, attributed link* (Tier 1) instead of markup. Also corrected: the live key surface is **146 keys** (not 102), which prices the 17-dictionary expansion at ~2,700 strings.

The dominant risks are quality-gate failures that human review cannot catch (an owner who reads ~2 of 20 languages), so prevention must be mechanical: register-decision table + app-`strings.xml` glossary + two-pass agent drafting + 3–4-language waves for I18N-05; a red-gate test for the changelog's keycheck registration; an ordered console-side checklist (Firebase Auth authorized domains, API-key referrer restriction, reCAPTCHA domain list) before the domain URL rewrite; and a submission-count-gated (never calendar-gated) App Check enforcement flip with dedicated token-failure UX. Build order is dependency-forced: **CONT-06 → I18N-05 → HOST-01 → FIRE-07 → SEO-05**, with owner-side DNS/registration parallelizable from day 1.

## Key Findings

### Recommended Stack

Full detail in [STACK.md](STACK.md). The v1 stack (plain HTML/CSS/vanilla JS, Firebase 12.18.0 CDN pin, html-validate CI) is unchanged; the delta is:

- **HTML `dir` attribute + CSS logical properties** — RTL for ar/ur with no new tooling; `dir` set by `i18n.js` in the same `applyLanguage()` pass that syncs `lang`; one small `[dir="rtl"]` override block (~4 rules verified against `base.css`); system font stack covers all 19 scripts (per-lang `line-height` overrides for ur/CJK).
- **`firebase-app-check.js` @ 12.18.0 (existing pin, verified live)** — 4th lazy CDN module inside `contact.js`; reCAPTCHA v3 provider (Enterprise is Google's stated preference for new work but requires Cloud Billing linkage; v3 remains fully supported — provider decision is a recorded in-phase task, not a roadmap commitment).
- **Extended `scripts/i18n-keycheck.mjs`** — exact-parity gate auto-scales to 20 dictionaries; add changelog page to `pages` array, empty-value rejection, optional length-ratio warning. No npm i18n tool beats it for this shape.
- **GitHub Pages custom domain via repo Settings** — apex A×4 + AAAA×4 + www CNAME + TXT verification; **no CNAME file** (ignored under Actions publishing).
- **Nothing else.** No new npm deps, no webfonts, no CMP, no SSG, no per-language URL plumbing.

### Expected Features

Full detail in [FEATURES.md](FEATURES.md).

**Must have (table stakes, P1):**
- 17 dictionaries at exact 146+changelog key parity, gated by CI — silent EN fallback is otherwise invisible
- Engine extension: `SUPPORTED` 3→20, 20 endonyms, data-driven detection prefix table (incl. legacy `in-*`→`id`, `zh-*` handling), `dir` switching
- CSS RTL audit for ar/ur — the only genuinely design-heavy work (~4-rule override block + manual bidi checks)
- Changelog page: Keep-a-Changelog format, newest-first, ISO dates, **keyed chrome but EN entries** (documented exception)
- App Check in monitoring mode: client init + metrics review; zero user-visible change
- Social-proof gate: commented Tier-1/Tier-2 templates; pre-rating proof = verifiable facts only

**Sequenced inside the milestone on a trigger (P2):**
- App Check enforcement flip (Firestore + Auth, per-product, reversible) — gated on submission-count evidence, owner-approved
- Tier-1 visible proof row ("Rated X.X ★ on Google Play →" with attribution) — gated on Play listing live

**Defer / reject (P3 or anti-feature):**
- Per-language static HTML + hreflang sets — reject for now (anti-pattern 3); revisit only with a crawlability case
- Tier-2 `aggregateRating` JSON-LD — treat as **permanently off** unless the site collects its own reviews (Pitfall 9)
- Translated changelog entries ×20, geo-IP redirects, auto-translate widgets, fabricated stars — all rejected

### Architecture Approach

Full detail in [ARCHITECTURE.md](ARCHITECTURE.md). This is integration research onto a shipped, frozen v1: every integration point was verified against live repo source. Only one new file exists beyond dictionaries (`geohist/changelog.html`); the changelog page + its `es.json`/`pt-BR.json` key additions + keycheck `pages` entry must land **atomically** (the exact-parity gate fails otherwise). App Check init rides `contact.js`'s submit-time `loadModules()` — never page load, never `consent.js` — preserving both the zero-third-party-bytes consent architecture and the fork-shaped Firebase split. The HOST-01 rewrite surface is a verified inventory: 42 absolute-URL refs across 13 files (canonicals, OG, JSON-LD, sitemap, robots, smoke-check BASE, linkinator skip); root-relative asset paths and all JS internals are deliberately untouched.

**Load-bearing integration facts:**
1. App Check init must precede auth/firestore access (safe order from day 1); enforcement is console-only, client code identical in both modes
2. reCAPTCHA v3 site key is domain-allowlisted → **HOST-01 must precede FIRE-07** or the key gets edited twice
3. Firebase Auth authorized domains + v1 API-key referrer restriction block the new domain until updated → form breaks `auth/unauthorized-domain` at migration if the checklist is skipped
4. No 301 exists between github.io and the custom domain (Pages serves both) → canonicals carry the migration; Change-of-Address tool unusable
5. GitHub 301s github.io → custom domain *after* configuration, so ordering Pages-config → rewrite is safe

### Critical Pitfalls

Full detail in [PITFALLS.md](PITFALLS.md). Top five:

1. **Agent-drafted translations without register decision, terminology source, or functional review** — "owner-reviewed" is a rubber stamp across 17 languages the owner can't read. *Avoid:* per-language register table written into the plan, glossary extracted from the app's 20-locale `strings.xml`, two-pass drafting (draft, then fresh-context critique), waves of 3–4 languages with gate checks.
2. **Detection-layer traps at 20 languages** — `zh` is Simplified-only by decision (document it; match the app), CJK half-width punctuation ships constantly from agent drafters (add grep gate), legacy `in-ID` browsers miss naive prefix checks (explicit table + unit tests).
3. **RTL treated as "two more dictionaries" when it is a layout project** — engine has zero `dir` capability today; stylesheet audit is small but bidi isolation, Urdu Nastaliq line-height, and the 20-entry switcher redesign are real work. *Avoid:* RTL as its own wave inside I18N-05 with a per-page screenshot battery at mobile width.
4. **Domain migration console-side blind spots** — repo rewrite is planned but Firebase Auth domains, API-key referrer restriction, App Check domain list, Search Console re-property, and cert-before-rewrite sequencing are where it actually breaks. Also: CNAME file is a no-op; don't "fix" its absence.
5. **App Check enforcement blocking real humans** — privacy-browser users are indistinguishable from bots in metrics, and single-digit daily volume can't disprove a false block. *Avoid:* window sized by successful-submission count, dedicated `contact.status.appcheck` error node with email fallback, per-product reversible flips.

## Implications for Roadmap

Based on combined research, suggested phase structure (dependency-forced order; owner-side DNS/domain registration is a parallel task from day 1):

### Phase 1: Changelog Page (CONT-06)
**Rationale:** Hard dependency anchor — its `changelog.*` keys must exist in all dictionaries before the locale expansion, or the 17-dictionary work triggers a second 20-language parity sweep. Landing first means the atomic commit touches 2 dictionaries, not 20.
**Delivers:** `/geohist/changelog.html` (keyed chrome, EN entries, ISO dates), keycheck `pages` array entry (with red-gate test), nav/sitemap links, es+pt-BR key additions — one atomic PR.
**Avoids:** Pitfalls 10 (keycheck blind spot), 11 (staleness — chrome-vs-entries decision + update routine as convention).
**Research flag:** none — standard patterns, research complete.

### Phase 2: Localization ×20 + RTL (I18N-05) — largest phase, plan as waves
**Rationale:** Must follow Phase 1 (keys) and precede Phase 3 (rewrite final content only; no locale PR reintroducing old-domain strings). Content is domain-independent, so this is the last phase where the site can ship at github.io.
**Delivers:** Wave A: engine extension (`SUPPORTED`, endonyms, detection table + unit tests, `dir` switching) + RTL wave (CSS audit, `[dir="rtl"]` block, bidi isolation, switcher redesign for 20 entries, line-height overrides) + gate extensions (value checks, punctuation gate, per-page `data-i18n` baseline). Waves B–F: 17 dictionaries in 3–4-language batches, each gated.
**Addresses:** I18N-05 table stakes; RTL as its own sub-wave.
**Avoids:** Pitfalls 1, 2, 3, 10 (register table + glossary + two-pass in plan; zh/punctuation/`in-ID` handling; RTL layout project).
**Research flag:** none mandatory — research is deep. If planning hits friction, candidate sub-topic is RTL visual verification tooling (headless screenshot battery).

### Phase 3: Custom Domain Migration (HOST-01)
**Rationale:** After content freeze (rewrite covers final pages), before App Check (single reCAPTCHA domain registration). The *code* PR waits for owner DNS + cert; owner steps (registrar, repo settings, verification) run in parallel from day 1.
**Delivers:** Ordered checklist executed: repo Settings domain → DNS (A×4/AAAA×4/www CNAME/TXT) → cert verified → console allowlists (Firebase Auth domains, API-key referrer, reCAPTCHA domain list, Search Console new property) → 13-file URL rewrite in one commit → sitemap resubmit → smoke-check BASE update.
**Addresses:** HOST-01.
**Avoids:** Pitfalls 7, 8 (console allowlists, cert/HTTPS sequencing, CNAME-file trap, mixed-domain grep acceptance check).
**Research flag:** none — GitHub docs cover everything; the checklist in ARCHITECTURE/PITFALLS is the plan backbone.

### Phase 4: App Check, Monitor-First (FIRE-07)
**Rationale:** After HOST-01 so the reCAPTCHA key is registered once against the final domain and metrics reflect the permanent home.
**Delivers:** Provider decision recorded (Enterprise-vs-v3 with billing tradeoff — owner input), `initializeAppCheck` in `contact.js` submit path (4th lazy module, init before auth/firestore), dedicated token-failure status node, Analytics token-failure event, monitoring window sized by submission count, privacy-policy reCAPTCHA mention. Enforcement flip is a **later owner console step**, not a phase.
**Addresses:** FIRE-07 table stakes + monitoring ritual.
**Avoids:** Pitfalls 4, 5, 6 (provider deprecation direction, human-blocking flip, consent-architecture breach — no reCAPTCHA bytes in served HTML).
**Research flag:** none for docs; the provider decision needs an owner conversation, not research.

### Phase 5: Gated Social Proof (SEO-05)
**Rationale:** Independent of phases 1–4 except the domain rewrite (do it after to avoid conflicting edits in `geohist/index.html`); only external gate is the Play listing.
**Delivers:** Facts-based social proof (20 localizations, feature list, changelog as proof), commented Tier-1/Tier-2 templates, gate precondition reworded to "on-site rating source exists."
**Addresses:** SEO-05.
**Avoids:** Pitfall 9 (aggregateRating policy trap — Play-sourced markup is rejected regardless of gate).
**Research flag:** none — guidelines verified.

### Phase Ordering Rationale

- **CONT-06 → I18N-05** is the single strongest ordering signal: exact-parity CI makes the changelog-keys-first build mandatory, not stylistic.
- **I18N-05 → HOST-01** keeps the domain rewrite a mechanical pass over final content.
- **HOST-01 → FIRE-07** avoids double-editing the domain-scoped reCAPTCHA key.
- **SEO-05 floats last**, gated externally on Play.
- Grouping RTL with the engine (not with dictionaries) matches the research: it's a layout project plus two dictionaries, and one reviewable engine PR is cleaner.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Every version/URL/claim verified this session (gstatic CDN fetch, npm registry, MDN, Firebase/GitHub/Google docs) |
| Features | HIGH | Policy claims from fetched official docs; repo facts read from live source; UX norms marked MEDIUM where practice-based |
| Architecture | HIGH | All integration points verified against actual repo files; 42-ref URL inventory counted, not estimated |
| Pitfalls | HIGH | Official-doc grounded + repo-verified; register conventions and Nastaliq font reality are MEDIUM |

**Overall confidence:** HIGH. The milestone is low-ambiguity: known architecture, verified integration points, official-doc-backed decisions. Remaining uncertainty is concentrated in owner decisions and content quality, not technical unknowns.

### Gaps to Address

- **Custom domain name + apex-vs-www choice:** undecided. GitHub recommends www (CNAME stability vs pinned apex IPs); convention favors apex; both DNS records configured either way. Owner decision at Phase 3 planning.
- **reCAPTCHA provider (v3 vs Enterprise):** hinges on owner's willingness to link Cloud Billing. Decide as FIRE-07's first task; do not pre-commit in roadmap.
- **`zh` variant confirmation:** check the app repo's actual zh localization (`values-zh-rCN`?) before locking Simplified-only; document the decision.
- **Register table per language:** needs a one-time owner pass (e.g., German *du* vs *Sie* matching the Play listing tone) before dictionary drafting starts.
- **App Check monitoring window threshold:** define N successful submissions (and token-failure %) with the owner before enforcement is even discussable.
- **Urdu Nastaliq rendering quality:** visual verification on real devices; documented degradation acceptable, silent discovery is not.
- **Play listing live date:** external gate for Tier-1 proof row; unknowable, so SEO-05 ships gated.

## Sources

### Primary (HIGH confidence)
- Firebase docs (fetched 2026-09-05): App Check reCAPTCHA v3 + Enterprise + debug provider, monitoring metrics, enforcement; anonymous auth; Firestore rules
- gstatic CDN: `firebase-app-check.js` @ 12.18.0 fetched live (verified imports pinned `firebase-app.js`)
- Google Search Central (fetched 2026-09-05): SoftwareApplication structured data, Review-snippet guidelines, localized versions/hreflang
- GitHub docs (fetched 2026-09-05): Pages custom domain (CNAME-ignored under Actions publishing), domain verification
- MDN (fetched 2026-09-05): `dir` global attribute, CSS logical properties module
- Keep a Changelog 1.1.0 (fetched 2026-09-05)
- Live repo source (read this session): `js/i18n.js`, `js/consent.js`, `js/contact.js`, `js/firebase-config.js`, `scripts/i18n-keycheck.mjs`, `scripts/smoke-check.sh`, `deploy.yml`, `package.json`, all 6 HTML pages, `css/base.css`, `sitemap.xml`, `robots.txt`, `firestore.rules`, both existing dictionaries (146 keys each)

### Secondary (MEDIUM confidence)
- npm registry live checks: `firebase@12.18.0`, `i18next-parser@9.4.0` (rejected alternative)
- Per-language register conventions (de/ja/ko/hi/etc.); Urdu Nastaliq/Naskh font reality; `:dir()` evergreen support; 20-entry switcher UX norms
- `isTokenAutoRefreshEnabled:false` recommendation (reasoning over official init docs)

### Tertiary (LOW confidence)
- Community reports of cert provisioning exceeding an hour; github.io dual-hosting behavior pre-configuration — mitigated by cert-gate sequencing in the plan

---
*Research completed: 2026-09-05*
*Ready for roadmap: yes*
