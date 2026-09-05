# Pitfalls Research — v2.0 Milestone Features (Added to Existing System)

**Domain:** Static GitHub Pages app-landing site — adding 17 localizations (RTL), App Check, custom domain, changelog page, gated social proof
**Researched:** 2026-09-05
**Confidence basis:** Claims verified against official sources this session: Firebase App Check docs (reCAPTCHA v3 + reCAPTCHA Enterprise provider pages), Google Search Central review-snippet guidelines, GitHub Pages custom-domain docs. Repo-grounded facts verified against the actual code (`js/i18n.js`, `scripts/i18n-keycheck.mjs`, `package.json`, `.github/workflows/deploy.yml`, `scripts/smoke-check.sh`, `geohist/contact.html`). Items not independently verified are marked **MEDIUM** or **LOW**.

**Context for every pitfall below:** this site is agent-maintained (content changes via chat sessions, not owner HTML edits), zero-build, and the owner does not read most of the 17 new languages. That changes the classic failure modes: review gates that assume a human editor who knows the language do not exist, so prevention must be mechanical (CI gates, structural constraints, staged waves) or it will not happen.

---

## Critical Pitfalls

### Pitfall 1: Agent-drafted translations shipped without a register decision, terminology source, or native review — "owner-reviewed" is a rubber stamp

**What goes wrong:**
17 languages × ~146 existing keys + changelog keys ≈ 2,700+ new strings drafted by an agent, "reviewed" by an owner who cannot read most of them. Classic agent-translation failures land live: wrong formality register (German *du* vs *Sie*, Japanese plain *である* vs polite *です/ます*, Hindi *तुम* vs *आप*), inconsistent game terminology across keys in the same language ("level" translated three different ways), and calque-style translations that are grammatically fine but unnatural.

**Why it happens:**
- Register choice is invisible in the drafting prompt unless made explicit per language; agents default inconsistently.
- The site's most important shared vocabulary (game modes, question types, "localization count") should match the **app's own localization** in `C:\Users\Familia\antigravity\GeoHist-Trivia` (the app ships 20 localizations) — but nothing forces the site dictionaries to use those terms, so the site can disagree with the game UI players actually see.
- Owner review is the only human gate, and it cannot function for languages the owner doesn't read. Planning that says "owner-reviewed" gives false assurance.

**How to avoid:**
1. **Register decision table before drafting.** One row per language, decided up front: de→*Sie* (or *du* if matching the app's Play listing — check it), fr→*vous*, ja→*です/ます*, ko→*해요체*, ru→lowercase *вы*, hi→*आप*, bn→*আপনি*, tr→*siz* (safe default), el→*εσείς*, pl→"Ty" (modern app convention), it→*tu* acceptable for a game, nl→*je*, vi→avoid pronouns where possible, id→*Anda* for formal copy, ar→MSA (فصحى, never a dialect), pt-BR/es→already shipped. Write the table into the phase plan; it becomes the drafting prompt and the review rubric.
2. **Terminology glossary extracted from the app repo.** Pull the app's `strings.xml` per locale for the shared game terms and put a 10–20-term glossary (EN → each language) at the top of every drafting session. The app's translations are already user-accepted; reusing them costs nothing.
3. **Two-pass drafting:** pass 1 drafts; pass 2 is a *fresh* agent session that only critiques (register check, punctuation check, glossary-conformance check, EN-echo check) — no shared context with the drafter. Cheap on a static site and catches most mechanical errors.
4. **Stagger waves of 3–4 languages per plan**, gate-checked per wave — not 17 dictionaries in one shot. A systemic error (bad register, wrong punctuation width) in one wave costs a redo of 3 dictionaries, not 17.

**Warning signs:** mixed register in sample strings; game terms differing from the app; a wave where all languages share one visibly machine-literal sentence structure; owner approving 17 dictionaries in under 5 minutes.
**Phase to address:** I18N-05 (register table + glossary in the phase plan itself; two-pass + waves in plan tasks).

---

### Pitfall 2: `zh` variant, punctuation width, and legacy language-code traps in the detection layer

**What goes wrong:**
Three concrete failure modes when expanding `js/i18n.js` from 3 to 20 languages:
- **`zh` is not one language.** One `zh` dictionary silently decides Simplified-only. A `zh-TW`/`zh-Hant` visitor gets Simplified characters — visibly wrong to Traditional-script readers, who read them as a different writing system, not a dialect variant. (Check which variant the app itself localizes — app repo decides; if the app ships only `values-zh-rCN`, Simplified-only is defensible *and documented*.)
- **Half-width punctuation in CJK strings.** English commas/periods/quotes (`,` `.` `"...") in zh/ja copy look broken. zh needs full-width （，。！？「」）; ja needs 、。「」 and no spaces; ko needs correct 띄어쓰기 spacing rules. Agent drafters produce half-width punctuation constantly.
- **Legacy Indonesian code.** Indonesian's deprecated BCP-47 code is `in` (modern: `id`). Some older/embedded browsers and OS stacks still emit `in-ID`. A naive `tag.indexOf('id') === 0` check misses them. No other new code has this trap, but `zh-*` region handling (`zh-tw`/`zh-hk`/`zh-hant` vs `zh-cn`/`zh-hans`) and plain `zh` all need explicit handling in `detect()`.

**Why it happens:**
`detect()` today (`js/i18n.js:90-107`) is a flat prefix-scan with two hardcoded mappings. Scaling it is mechanical — exactly the kind of edit where region/script nuance and deprecated codes get dropped. Punctuation width is a per-string property, so no CI gate catches it without a rule.

**How to avoid:**
- Decide and document: one `zh` dictionary = `zh-Hans`, `zh-*` browsers (all regions) map to it, note the limitation in the phase plan. Map the app's actual zh localization to the same decision.
- Extend `detect()` with an explicit per-language table, not a growing if-chain: exact-tag matches first (`pt-BR`), then prefix fold for each language, then `zh-tw|zh-hk|zh-hant` handling, then `in-*` → `id`.
- Add a mechanical punctuation check to the i18n gate for zh/ja: flag keys whose values contain ASCII `,` `.` `!` `?` `"` adjacent to CJK characters (regex heuristic; a small allowlist for URLs and numbers).
- Unit-test `detect()` with a table of input tags → expected language, including `in-ID`, `zh-TW`, `pt`, bare `zh`.

**Warning signs:** `zh.json` containing `","`; any browser sending `in-ID` showing EN; screenshots of zh pages with visually cramped punctuation.
**Phase to address:** I18N-05 (detection-table task + punctuation gate rule; zh decision documented in phase plan).

---

### Pitfall 3: RTL breaks the existing layout — `i18n.js` switches `lang` but has zero `dir` capability, and the stylesheet is all physical properties

**What goes wrong:**
Enabling `ar`/`ur` does three distinct things badly by default:
- **The engine doesn't switch direction.** `applyLanguage()` (`js/i18n.js:58-72`) sets `document.documentElement.lang` only. Without setting `dir="rtl"`, Arabic/Urdu render left-aligned with RTL text runs inside an LTR frame — punctuation lands on the wrong side, and layout is unreadable.
- **The existing CSS uses physical properties.** The Phase-2 stylesheet (dark antique theme, utility layer) was authored LTR with physical `margin-left`/`padding-left`/`text-align:left`-style declarations. `dir="rtl"` auto-flips text alignment defaults but flips *nothing else*: explicit left/right values, icon slots padded on one side, absolutely positioned decorations, and any `transform` directionality stay LTR. Result: mirrored text with unmoved chrome.
- **Bidi runs and glyphs.** The brand names ("GeoHist", "Persano") and any email/URL embedded in translated strings are LTR islands inside RTL text; without `dir="ltr"` isolation (or `unicode-bidi: isolate`) they scramble. Urdu needs Nastaliq-friendly line height; Arabic diacritics clip in tight line-heights; both need more leading than Latin. Urdu rendered with an Arabic Naskh fallback font reads as "wrong letterforms" to Urdu readers (Urdu-specific letters ے ں ٹ ڈ — acceptable degradation if documented, not if discovered later).

**Why it happens:**
RTL is invisible during development on an English machine; the 17-dictionary wave treats `ar`/`ur` as "two more dictionaries" when they are actually a **layout project plus two dictionaries**.

**How to avoid:**
1. Extend `applyLanguage()` to set `document.documentElement.dir` from a per-language map (`ar`/`ur` → `rtl`, everything else → `ltr`) in the same pass — one-place change, snapshot pattern stays intact.
2. Audit the stylesheet and convert direction-sensitive declarations to CSS logical properties (`margin-inline-start`, `padding-inline`, `text-align: start`), *scoped to the direction-sensitive rules only* — do not blind-replace everything; decoration textures (`background-position`) are fine either way, and over-mirroring decoration is its own mistake.
3. Mirror check list for `ar`/`ur` verification: nav order, form fields and their labels, footer switcher, `::before`/`::after` arrows (flip directional icons, keep neutral icons), screenshots gallery (game images are NOT mirrored — they are the game's own rendering), og-image (unchanged, EN).
4. Wrap brand names and embedded Latin (emails, URLs) in `<span dir="ltr">`-style isolation, or set `unicode-bidi: isolate` on the brand classes.
5. Bump line-height for `[lang="ar"]`/`[lang="ur"]` scoped rules; verify no button/label text clips in the fixed-height UI elements.
6. The language switcher itself: 20 endonym entries ("English · Español · … العربية … हिन्दी") in the reserved footer slot will wrap into a multi-line strip; each RTL endonym inside the LTR footer needs `dir="auto"` on its element (the switcher already sets `lang` per entry — add `dir`). Plan the switcher redesign (a `<details>` disclosure or `<select>`) as part of I18N-05, not as a surprise discovered at 20 entries.

**Warning signs:** `dir` absent from `documentElement` when `ar` selected; any `left`/`right` physical property surviving the audit in direction-sensitive rules; Arabic screenshots showing left-aligned chrome; footer switcher wrapping to 3+ lines.
**Phase to address:** I18N-05 (RTL must be its own plan/wave inside the localization work — engine change + CSS audit + per-page screenshot verification — not bundled with dictionary drafting).

---

### Pitfall 4: Building App Check on classic reCAPTCHA v3 — the officially deprecated-for-new-work provider

**What goes wrong:**
FIRE-07 plans "reCAPTCHA v3". Firebase's current official docs state: *"You should use reCAPTCHA Enterprise for new integrations, and we strongly recommend that developers of apps using reCAPTCHA v3 upgrade when possible."* Building the new integration on v3 means (a) adopting the provider Google is steering away from, (b) losing the richer fraud signals, and (c) a likely forced migration later on a live form.

**Why it happens:**
"reCAPTCHA v3" is the name everyone knows; milestone text was drafted with it; the Enterprise page looks like it needs billing.

**How to avoid:**
- Re-decide the provider *in* the FIRE-07 phase, not before. Verified facts for the decision: reCAPTCHA Enterprise includes **up to 10,000 free assessments/month** (more than enough for a contact form); it supports a configurable **app risk threshold** (default 0.5, per-app, in Firebase console → Security → App Check). Tradeoff: Enterprise requires the Firebase project to have billing enabled (no charge at this volume) — an owner console step.
- If the owner declines billing, v3 classic still works and both provider pages are live current docs — but record the decision and the known deprecation direction in the phase plan.

**Warning signs:** milestone text hardcoding "v3" without a decision note; App Check registration attempted with a v3 secret key on the Enterprise flow.
**Phase to address:** FIRE-07 (first task of the phase: provider decision with the billing caveat; do not pre-commit in roadmap).

---

### Pitfall 5: Enforcement flip blocking real humans — privacy-browser users are indistinguishable from bots in the metrics, and this site's volume can't disprove a false block

**What goes wrong:**
App Check monitoring mode shows request metrics (valid / invalid verdicts). The classic misread: assume "invalid requests are bots, therefore flip to enforcement." On this site, a large share of *real* contact-form users run adblock/privacy browsers (Brave, uBlock, Firefox ETP) that **block reCAPTCHA** — those users produce exactly the same "no valid token" signal as bots. Worse, this site's form volume is tiny (single-digit submissions/day at best), so "a clean week of metrics" may mean five data points. Flipping enforcement then silently hard-blocks real users: `signInAnonymously` and the Firestore `create` both start demanding a valid App Check token, the form shows a generic error, and there is no way for the blocked user to self-recover except the fallback email — which exists in the error copy but is easy to miss.

**Why it happens:**
- Monitoring dashboards cannot distinguish "token missing because bot" from "token missing because reCAPTCHA script was blocked by the user's privacy tooling."
- The docs' monitoring→enforcement guidance assumes request volume sufficient to establish a baseline.
- Enforcement is per-product; people enable it for "everything" without realizing Auth + Firestore are the two products this form actually uses, and each has its own flip.

**How to avoid:**
1. **Size the monitoring window by submission count, not duration:** e.g., collect metrics until N *successful* real submissions have occurred with tokens present (Analytics `form_submit` success event already exists from Phase 4 — use it), not "1 week".
2. **Explicit UX for token failure:** a dedicated error status node (the site's pre-rendered keyed-node pattern handles this perfectly — add `contact.status.appcheck`) that names the actual cause and the fallback email. Never reuse the generic "Something went wrong" for this.
3. **Flip per-product, form first:** enable enforcement for Firestore and Identity Platform (the two products the form uses) — not for anything else — and treat the Auth flip and the Firestore flip as separate, reversible steps.
4. **Fail-open canary:** before flipping, keep enforcement off but add an Analytics event on App Check token-fetch failure; if >5–10% of *real* submit attempts fail token fetch, don't flip.
5. **Debug provider for local/CI:** registered App Check apps will reject local dev and CI environments — use the App Check debug provider (`debug` token in Firebase console) there, or validation work gets misread as App Check breakage. Document the debug token as a console-side artifact in the phase plan.
6. Know the fallback: enforcement can be turned back off per product; the form's email fallback address in the error copy is the human safety net — keep it.

**Warning signs:** Firebase console App Check metrics showing "requests without valid token" where the count exceeds plausible bot traffic on a near-zero-traffic site; Brave/uBlock test submissions failing during monitoring; flip done the same week as registration.
**Phase to address:** FIRE-07 (monitoring window definition + token-failure UX + per-product flip order are plan tasks; the flip itself is gated on submission-count evidence, owner-approved).

---

### Pitfall 6: App Check's reCAPTCHA script vs the site's own consent architecture — the third-party-bytes principle gets broken

**What goes wrong:**
The site's v1 consent design (FIRE-01..03) is load-gating with a hard rule: **zero third-party bytes pre-consent** — no `firebasejs` references anywhere in HTML; imports happen only when needed. App Check with reCAPTCHA adds a new third-party script stream (`google.com/recaptcha/api.js` or the Enterprise equivalent) that sets its own cookies. If it's loaded on page load of `/geohist/contact.html`, the site ships third-party cookie-bearing bytes to EU visitors before any consent — violating its own architecture and, functionally, the same reasoning the GDPR banner exists for.

**Why it happens:**
App Check docs show `initializeAppCheck()` at app init; nobody maps that against the consent model. reCAPTCHA is arguably "functional" (anti-abuse for a service the user explicitly requested) rather than "analytics" — but the *cookie-setting script load* is the thing the consent gate architecture was designed to control.

**How to avoid:**
- Follow the existing fork-shaped pattern: initialize App Check **inside `contact.js`, at form-submit time** (the same trigger as `signInAnonymously`), never at page load, never in `consent.js`. The reCAPTCHA bytes then load only when the user has explicitly chosen to use the form — the same functional-essential justification already used for auth.
- Keep the strict separation: `consent.js` imports analytics only; `contact.js` imports auth + firestore + **app-check**. Zero new script references in HTML.
- Document the reasoning (functional/essential classification for the anti-abuse token) in the phase plan so the decision is auditable; flag for the owner's privacy review alongside the privacy policy (which should mention reCAPTCHA once App Check ships — the policy is EN-only by decision, so it's a one-page edit, but it must not be forgotten).

**Warning signs:** any `recaptcha` string in served HTML `<head>`; App Check initialization outside `contact.js`; privacy policy unchanged after FIRE-07 ships.
**Phase to address:** FIRE-07 (submit-time initialization is a plan task; privacy-policy note is a verification item).

---

### Pitfall 7: Domain migration — the repo-wide absolute-URL rewrite is planned, but the Firebase/console side and the "no 301" reality are not

**What goes wrong:**
HOST-01 correctly plans rewriting canonical/og/sitemap/robots/JSON-LD (the repo surface is real: `persano.github.io` appears in ~17 files including `sitemap.xml`, `robots.txt`, all four app pages, `js/consent.js`, `js/contact.js`, `js/firebase-config.js`, `scripts/smoke-check.sh`). Three adjacent failure modes are outside the repo:
1. **Firebase rejects the new domain.** Anonymous auth from the new domain fails with `auth/unauthorized-domain` unless the domain is added to Firebase console → Authentication → Settings → Authorized domains. The v1 API-key hardening added an **HTTP-referrer restriction to `persano.github.io`** — the same restriction now blocks Firestore/Auth calls from the new domain. App Check's reCAPTCHA registration is domain-scoped too — register the new domain before enforcement, or the form dies exactly when App Check goes live.
2. **No 301 exists.** GitHub Pages serves the same content at both hostnames; there is no redirect from `persano.github.io` to the custom domain. Google's Change-of-Address tool formally requires 301s, so it can't be used. Canonicals carry the migration — which makes *every* canonical/og:url/sitemap/hreflang/JSON-LD rewrite load-bearing, not cosmetic.
3. **Tooling hardcoded to the old domain.** `scripts/smoke-check.sh` (`BASE=`), the `linkinator` skip regex in `package.json`, and Search Console's existing property all assume `persano.github.io`. A partial migration passes CI while serving a mixed-domain site.

**Why it happens:**
The repo rewrite is visible and plannable; the console-side allowlists are scattered across three Firebase console surfaces and a Cloud Console credentials page, and they all worked fine for months.

**How to avoid:**
- **Order of operations (encode in the phase plan):** register domain owner-side → add domain in repo Settings → set DNS → wait for cert → **console-side: Firebase Auth authorized domains + API-key referrer restriction + App Check domain list + Search Console new property** → *then* the repo URL rewrite in one commit → sitemap resubmit → smoke-check updated and re-run.
- Rewrite must include: canonical links, `og:url`/`og:image`/`twitter:image`, `sitemap.xml` URLs, `robots.txt` sitemap line, both JSON-LD blocks, `scripts/smoke-check.sh` BASE, `package.json` linkinator skip regex, and the Search Console verification file stays at root (works on the new domain; the *new* Search Console property needs its own verification).
- Rely on canonicals for re-indexing: same content, same paths, new domain is the *easy* site-move case — no per-URL redirect map needed, but expect a re-crawl window of days-to-weeks; keep the old Search Console property alive to watch the old URLs' indexing decay.
- **The HOST-01 "CNAME file" plan item is wrong for this deploy setup:** GitHub docs are explicit that with a custom Actions workflow, a CNAME file in the repo is ignored — the domain must be set in the repository's Pages settings. Correct the plan so nobody "fixes" the missing CNAME file and wonders why it does nothing.
- Choose **www vs apex deliberately**: GitHub recommends www as the more stable choice (apex A-records pin four GitHub IPs that can change; www CNAME doesn't). Configure *both* apex and www DNS records either way — Pages redirects between them automatically once configured.

**Warning signs:** `auth/unauthorized-domain` in contact form console after migration; mixed-domain grep hits (`rg "persano.github.io"` returning >0 outside planning/) post-merge; HTTPS toggle gray in repo settings; "DNS check unsuccessful" when adding the domain before DNS propagates.
**Phase to address:** HOST-01 (ordered operations checklist as the plan backbone; console-side allowlist items as explicit owner tasks with verification).

---

### Pitfall 8: HTTPS certificate + enforcement window treated as instant

**What goes wrong:**
After adding the custom domain: the **Enforce HTTPS** toggle is disabled until GitHub finishes provisioning the Let's Encrypt cert; docs say up to an hour, community reports run longer when DNS was partially propagated. During the gap the site is HTTP-only on the new domain (mixed-content failures for the Firebase CDN scripts if any page references force-https assets — currently none, but the smoke check will show non-200 on `https://`). Related verified traps: **CAA records** — if the DNS provider has any CAA record, it must include `letsencrypt.org` or the cert never issues; the fix for a stuck cert is often "remove and re-add the custom domain" to re-trigger provisioning.

**Why it happens:**
DNS looks fine in `dig`, the domain shows as configured, and the wait is opaque.

**How to avoid:**
- Sequence in the plan: DNS fully propagated → domain in settings → *verify cert issued* (https:// works) → then enforce HTTPS → only then flip the repo URL rewrite. Never rewrite URLs to `https://newdomain` while the cert is still provisioning — that combination produces a temporarily broken live site.
- Check CAA records during DNS setup; add `letsencrypt.org` if any exist.
- Add the new domain URLs to `smoke-check.sh`'s expect-200 list as part of HOST-01; run it post-cert, not post-push.

**Warning signs:** Enforce HTTPS disabled >2h after DNS is correct; "Enforce HTTPS" clicked then cert errors; smoke check 200s on github.io but failures on new domain.
**Phase to address:** HOST-01 (cert gate between DNS step and URL-rewrite commit; smoke-check extension).

---

### Pitfall 9: aggregateRating gating is necessary but *not sufficient* — real Play ratings still can't be published as site markup

**What goes wrong:**
SEO-05 is planned as "gate aggregateRating on real Play ratings." The gate alone doesn't make the markup legal. Google's review-snippet guidelines (verified this session, with manual-action warning attached) state: **"Don't aggregate reviews or ratings from other websites"** and ratings must be **"sourced directly from users"**. Play Store ratings live on `play.google.com` — copying them into the site's JSON-LD once the listing goes live violates the "other websites" rule even though the ratings are real. Two more traps on the same feature: (a) **invented testimonial quotes** ("Great game!" — anonymous) are fake reviews under the same guidelines; (b) the self-serving-reviews ban technically scopes to `LocalBusiness`/`Organization` markup, but a developer's own app page sourcing no user ratings is the same shape of problem.

**Why it happens:**
"Real ratings" and "ratings we're allowed to mark up" are different requirements; the milestone text conflates them.

**How to avoid:**
- **Split SEO-05 into two gates:**
  1. *Now:* social proof from verifiable facts only — 20 localizations, feature list, version history (the changelog itself becomes honest social proof). Visible, truthful, zero markup risk.
  2. *Later, conditional:* aggregateRating markup only ever if ratings are **collected on the site itself** (which is a whole feature — probably never for this site) — i.e., treat the markup as *permanently off* unless that source materializes. Play-rating copy-paste is rejected by policy regardless of the gate.
- If visible non-marked-up star display is ever wanted, it must link to Play and attribute Play, without `aggregateRating` markup — that's a judgment call to make explicitly, not silently.
- The gate flip should stay owner-controlled as planned, but the flip's precondition should be reworded from "real Play ratings exist" to "on-site rating source exists" — otherwise the owner flips a gate that then creates a manual-action risk.

**Warning signs:** JSON-LD containing `aggregateRating` with `ratingCount` from Play; testimonial block with no verifiable origin; Search Console manual action notification (too late — that's the detection failure).
**Phase to address:** SEO-05 (redefine the gate's precondition in the phase plan; ship the facts-based social proof path).

---

### Pitfall 10: Key-parity gate scales to 19 dictionaries — but has two structural blind spots that CI-green hides

**What goes wrong:**
`scripts/i18n-keycheck.mjs` is a good gate: it extracts the live `data-i18n`/`data-i18n-attr` key surface from markup and asserts every dictionary's key set **equals** it exactly (zero missing, zero extra; 146 keys per dict today). Scaling 2→19 dictionaries keeps it O(1)-cheap (node built-ins, milliseconds). The blind spots:
1. **New unkeyed copy passes silently.** The gate only checks keyed nodes. If a session adds new content to a page *without* `data-i18n` attributes, no dictionary needs updating and no gate fails — 19 languages silently show that new block in EN while the rest of the page is translated. This is the most likely *content* drift on an agent-maintained site.
2. **The pages array is hardcoded** (`index.html`, `geohist/index.html`, `geohist/guide.html`, `geohist/contact.html`). CONT-06 adds `geohist/changelog.html` — if nobody edits the script, the changelog's keys are invisible to the gate: a changelog built before I18N-05 produces dictionaries missing its keys, and the gate reports a *false pass* (dictionaries with extra keys fail… actually the changelog keys never enter the surface, so dictionaries simply won't have them and no failure occurs).
3. **Value quality is out of scope:** empty-string values (`"key": ""`), EN echoes, and HTML entities in values (`&mdash;` renders literally because the engine does `textContent` assignment only — `js/i18n.js:63`) all pass the gate.

**Why it happens:**
Key-parity is exactly the check that's easy to automate, so it creates an illusion of completeness. The unkeyed-copy and value-quality holes need *different* checks that nobody writes because "we have the i18n gate."

**How to avoid:**
1. Add `geohist/changelog.html` to the script's `pages` array **in the CONT-06 phase** (make it an explicit task, with a test: temporarily remove a changelog key from a dictionary and confirm CI goes red).
2. Add a cheap **unkeyed-content canary**: fail the build if any text-heavy new element lacks `data-i18n` — practical approximation: per-page count of `data-i18n` attributes committed as a baseline; a drop in count fails. Imperfect, but catches the "new section with no keys" class.
3. Add value checks to the gate: non-empty strings; flag `&`-entity patterns (`&\w+;`) in dictionary values (legitimate uses are essentially nil — the engine is textContent-only); flag values identical to the EN snapshot for review (allowlist for brand names/endonyms).
4. Keep gate-per-wave (Pitfall 1) so a red gate pinpoints one 3–4-language wave.

**Warning signs:** `rg -c 'data-i18n'` per page drifting down between milestones; CI green on a commit that visibly adds English-only content; `&amp;` visible on a translated page.
**Phase to address:** CONT-06 (pages array + baseline counts), I18N-05 (value checks + per-wave gate), and as a standing convention (agent-maintained model: every content edit adds keys in the same session).

---

### Pitfall 11: Changelog page becomes the highest-frequency content × highest-translation-burden page

**What goes wrong:**
A changelog is the one page whose *content* changes every app release. If release-note entries are i18n-keyed, every app update requires editing 20 dictionaries (N releases × 20 languages = the combinatorial drift problem), the dictionaries bloat, and eventually entries ship EN-only or machine-translated on the fly — or the changelog stops being updated at all (stale changelog actively erodes trust more than no changelog).

**Why it happens:**
"Keyed for i18n" (the CONT-06 requirement) gets implemented as "every string on the page is a key."

**How to avoid:**
- **Key the chrome, not the entries:** page title, intro line, column labels ("Version", "Date", "Notes"), and any persistent UI = keyed (the gate covers them). Release-note entries = EN body text, updated in one place per release. This is a deliberate, documented exception to the site's keyed-content convention — record it in the phase plan so later sessions don't "fix" it.
- **Dates language-neutral:** ISO format (`2026-09-05`) in the date column — no per-locale date keys at all (this also sidesteps the per-language date-convention matrix: ja `yyyy年m月d日`, de `d.m.yyyy`, ar/ur variants, Hijri calendar questions — none of which are worth solving for a changelog).
- **Agent-maintained update routine:** the changelog's freshness depends on sessions that touch app-version facts anyway (Play link swap, social proof) — add "update changelog if app version changed" to the session conventions rather than hoping it's remembered.
- Include `changelog.html` in sitemap + the keycheck pages array (Pitfall 10) at build time.

**Warning signs:** changelog last-entry date older than the app's latest release; dictionary key counts growing linearly with releases; untranslated note bodies appearing in non-EN languages *and then disappearing entirely* (the tell that someone stopped adding entries).
**Phase to address:** CONT-06 (chrome-vs-entries decision + ISO dates are plan-level requirements; update routine becomes a standing convention).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Single `zh` dictionary (Simplified) for all zh-* visitors | One dictionary, no variant matrix | Traditional-script users get "wrong" characters | Acceptable **if** documented and matches the app's own zh localization; revisit only if zh-TW traffic appears in Analytics |
| Detect() if-chain grows instead of a data table | 5-minute edit per language | Ordering bugs, deprecated codes (`in`), region folds get lost; the function that "just works" becomes the scariest file | Never for 17 languages — table + unit tests now |
| Translating changelog entries per release | "Complete" i18n story | N×20 dictionary edits per release → guaranteed staleness | Never |
| Register table skipped ("agents write fine German") | Drafting starts immediately | 17 dictionaries rebuilt after register inconsistency is discovered | Never |
| Physical CSS properties left as-is; RTL handled with ad-hoc `html[dir=rtl]` overrides | No stylesheet refactor | Override pile grows per new RTL page/element; every future element needs its override too | Acceptable only if the override set is small and centralized; logical-property conversion is the durable fix |
| App Check v3-classic chosen to avoid billing enablement | No console billing step | Officially deprecated-for-new-work provider; migration debt | Acceptable as an explicit, recorded owner decision — not by default |
| Hardcoded `persano.github.io` left in smoke-check/linkinator after migration | Migration ships faster | Post-deploy verification silently checks the old host; regressions on the new domain go unseen | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Firebase Auth (anonymous) + custom domain | Forgetting Authorized domains → `auth/unauthorized-domain` only from the new host | Add custom domain in Firebase console Auth settings *before* the URL rewrite commit |
| API-key referrer restriction (v1 hardening) | Key restricted to `persano.github.io` blocks the new domain | Update HTTP-referrer allowlist in Cloud Console as part of HOST-01 owner steps |
| App Check reCAPTCHA registration | Registered only against github.io | reCAPTCHA site registration must include the custom domain before enforcement; both hostnames during transition |
| App Check + anonymous auth | Enforcement enabled for Auth and Firestore in one move, same day | Per-product flips as separate reversible steps; Auth enforcement means `signInAnonymously` requires a valid token — test the full form path, not just Firestore |
| reCAPTCHA + GDPR consent | reCAPTCHA script loaded on page load, breaking the zero-third-party-bytes pre-consent architecture | Initialize App Check inside `contact.js` at submit time; zero new script tags in HTML; mention reCAPTCHA in the privacy policy |
| GitHub Pages + custom Actions workflow | Adding a CNAME file to the repo and expecting it to matter | CNAME file is **ignored** in workflow mode; set the domain in repo Settings; verify the domain to prevent takeover |
| Search Console | Using the Change-of-Address tool (needs 301s Pages can't provide) | New property + verification file/DNS, sitemap resubmit, canonical-driven migration, keep old property for monitoring |
| i18n engine + RTL endonyms | Arabic/Urdu endonyms in the LTR footer without `dir` | `dir="auto"` on switcher entries (it already sets `lang`); switcher redesigned for 20 entries |
| Dictionary values + textContent engine | Translators putting HTML entities or markup in values | Values are plain text only; gate rejects `&entity;` patterns; `&amp;` in EN HTML must become a literal character in dictionaries |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 19 dictionary fetches if a visitor language-hops | Multiple ~13KB JSON fetches (fine); cache already prevents repeats | Existing per-language memory cache suffices; do not preload all 20 | Only under pathological switching; not a real risk |
| Detect() table scan on every load | Negligible CPU | None needed — but keep it O(1)-ish with exact-match map before prefix scan | Irrelevant at this scale |
| reCAPTCHA/Enterprise script weight on contact page | Slower form page, privacy-tool friction | Load at submit-time only (already the plan) — script bytes never paid by browsers that don't submit | Immediately if loaded on page load |
| 20-entry footer switcher reflow | Layout wrap, CLS-like jump on render | Switcher redesign (details/select) sized for 20 entries before the wave lands | At ~7+ entries; guaranteed at 20 |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Enabling App Check enforcement and calling spam "solved" | Token bypass via headless browsers with reCAPTCHA tokens exists; App Check raises the bar, doesn't end spam | Keep the create-only + field-length Firestore rules from v1 as the actual content validator; App Check is layer two |
| Debug App Check token committed / left enabled | Anyone with the debug token bypasses App Check | Debug tokens are console-side, never in the repo; documented in phase plan only |
| Loosening Firestore rules to "debug" a post-migration form failure | Open writes return | Migrations fail for *allowlist* reasons (Pitfall 7) — check Authorized domains/API-key referrer/reCAPTCHA domains before touching rules |
| Trusting agent-drafted dictionaries as content-safe | Translated spam-bait or offensive phrasing damages brand | Two-pass review + register table (Pitfall 1); owner spot-checks the languages they can read; nothing ships from a single unsupervised pass |
| aggregateRating added "just to see" | Manual action risk documented by Google | Gate is permanent unless an on-site rating source exists (Pitfall 9) |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Generic error after App Check blocks a submit | Real user thinks the site is broken; data loss (typed message gone) | Dedicated `contact.status.appcheck` keyed node naming the cause + email fallback; consider preserving the message textarea content on failure |
| Silent EN fallback on a single dictionary miss | Mixed-language page (per-node fallback by design) — acceptable for one node, jarring for a wave of misses | Gate catches set-level misses; value-quality checks catch the rest (Pitfall 10) |
| Urdu/Arabic rendered in Arabic-style fallback font | Urdu readers notice wrong letterforms instantly | Acceptable if documented; consider scoped `line-height` at minimum; Nastaliq-capable system fonts where available |
| Language switcher grows from 3 to 20 inline entries | Footer becomes a wall of text; mobile worst | `<details>` disclosure or `<select>` with endonyms, `dir="auto"` per entry |
| Changelog dates in per-locale formats | Inconsistent, translation burden | ISO dates everywhere (Pitfall 11) |

## "Looks Done But Isn't" Checklist

- [ ] **I18N-05:** dictionaries pass key-parity but new content added in the same milestone has no keys — verify `data-i18n` per-page counts didn't drop
- [ ] **I18N-05:** `ar`/`ur` dictionaries applied but `documentElement.dir` never set — verify RTL actually activates, per page
- [ ] **I18N-05:** zh strings contain half-width punctuation — grep gate
- [ ] **I18N-05:** `detect()` handles `in-ID` (legacy Indonesian), `zh-TW`, and all 17 prefixes — unit-test table
- [ ] **I18N-05:** switcher shows 20 endonyms with `dir` handling and still fits mobile — screenshot at 360px
- [ ] **I18N-05:** register table followed in every language — two-pass critique pass output archived
- [ ] **CONT-06:** changelog keys included in keycheck gate (`pages` array edited) — red-gate test performed
- [ ] **CONT-06:** release entries deliberately NOT keyed (documented exception, not an omission)
- [ ] **FIRE-07:** provider decision (Enterprise vs v3) recorded with billing tradeoff
- [ ] **FIRE-07:** App Check initialized at submit-time only — no `recaptcha` in served HTML
- [ ] **FIRE-07:** dedicated token-failure status node + Analytics event; enforcement flip gated on real-submission evidence, per product
- [ ] **FIRE-07:** privacy policy mentions reCAPTCHA/App Check
- [ ] **HOST-01:** Firebase Authorized domains, API-key referrer allowlist, App Check domain list all include the new domain — *before* the URL-rewrite commit
- [ ] **HOST-01:** zero `persano.github.io` occurrences outside `.planning/` and smoke-check history — `rg "persano\.github\.io"` is the acceptance check
- [ ] **HOST-01:** cert issued and HTTPS enforced *before* rewrite goes live; smoke-check extended to new domain
- [ ] **HOST-01:** domain verified account-wide (takeover prevention); both apex+www DNS records present
- [ ] **HOST-01:** Search Console new property verified, sitemap resubmitted, old property retained
- [ ] **SEO-05:** gate precondition reworded to "on-site rating source"; no `aggregateRating` in any served JSON-LD; social proof = verifiable facts only

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Bad translation wave shipped | LOW (files) / reputational | Revert the wave's dictionaries (fallback is EN per-node, so page stays coherent); redo with two-pass; gate stays |
| RTL broke a page layout | LOW | Language revert isn't needed (per-node fallback); fix CSS, redeploy; keep `dir` map |
| Enforcement blocked real users | MEDIUM — trust + lost messages | Turn enforcement off per product immediately (reversible); fix token-failure UX; re-gate on evidence; check Firestore for lost submissions (there will be none from blocked users — messages failed client-side) |
| Migration shipped before Firebase allowlists | HIGH for users, LOW to fix | Form fails on new domain (`auth/unauthorized-domain`); add domains, redeploy nothing (console fix is live); check for confused users via Analytics |
| Search indexing decayed post-migration | MEDIUM, slow | Verify canonicals + sitemap all point at new domain; request reindexing of key pages; wait — recovery is time-bound |
| Manual action from review markup | HIGH | Remove the markup, fix the source, submit reconsideration — weeks of friction; prevention is the entire point (Pitfall 9) |
| Changelog stale | LOW | It's additive content — update in next session; no user harm, just eroded freshness |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase (feature ref) | Verification |
|---------|-------------------------------|--------------|
| Register/terminology/quality of 17 languages | I18N-05 | Register table in plan; two-pass outputs; glossary conformance spot-check |
| zh variants, punctuation, legacy codes | I18N-05 | `detect()` unit-test table; punctuation grep gate red on planted error |
| RTL layout + engine `dir` support | I18N-05 (own wave) | Screenshot battery ar/ur × all pages at mobile width; `documentElement.dir` assertion |
| App Check provider choice | FIRE-07 | Decision note (Enterprise vs v3 + billing) in phase plan |
| Enforcement blocks real users | FIRE-07 | Monitoring window sized by submission count; token-failure UX node exists; per-product flip order in plan |
| reCAPTCHA vs consent architecture | FIRE-07 | No `recaptcha` strings in served HTML; init only in `contact.js`; policy updated |
| Domain migration console-side allowlists | HOST-01 | Ordered checklist executed; form tested on new domain before github.io links retire |
| Cert/HTTPS sequencing | HOST-01 | Smoke-check green on new domain *before* rewrite commit; HTTPS enforced |
| aggregateRating policy gate | SEO-05 | No `aggregateRating` in JSON-LD; social proof is facts-based; gate precondition reworded in plan |
| Key-parity blind spots | CONT-06 + I18N-05 | Changelog in `pages` array with red-gate test; per-page `data-i18n` baseline; value checks in gate |
| Changelog staleness | CONT-06 | Chrome-vs-entries decision documented; ISO dates; update routine in conventions |

## Sources

- Firebase official docs, fetched 2026-09-05: App Check with reCAPTCHA v3 (`firebase.google.com/docs/app-check/web/recaptcha-provider`) — Enterprise recommendation quote, 10k free assessments; reCAPTCHA Enterprise page (`.../recaptcha-enterprise-provider`) — risk threshold 0.5 default, per-app console config; monitoring→enforcement flow and debug provider (`.../manage-projects` navigation verified; per-product enforcement confirmed)
- Google Search Central review-snippet guidelines (`developers.google.com/search/docs/appearance/structured-data/review-snippet`), fetched 2026-09-05 — manual-action warning, "don't aggregate from other websites", "sourced directly from users", self-serving scope, fake-review ban
- GitHub Pages custom-domain docs (`docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/...`), fetched 2026-09-05 — CNAME-file-ignored-in-workflow-mode, www stability guidance, apex/www auto-redirect, HTTPS "up to an hour" + remove/re-add trigger, CAA `letsencrypt.org` requirement, domain-verification/takeover warning
- Repo-verified (this session): `js/i18n.js` (snapshot/apply/lang-only, no `dir`; detect() structure; ENDONYMS; textContent-only apply), `scripts/i18n-keycheck.mjs` (hardcoded 4-page array, exact-set equality), `package.json` (validate scripts, linkinator skip regex), `.github/workflows/deploy.yml` (validate→deploy chain), `scripts/smoke-check.sh` (hardcoded BASE), `geohist/contact.html` (keyed status nodes pattern), `js/i18n/es.json`+`pt-BR.json` (146 keys each), absolute-URL spread (`rg persano.github.io` across ~17 files)
- Training knowledge, marked MEDIUM where used: github.io dual-hosting without 301; community reports of cert provisioning exceeding an hour; per-language register conventions (de/ja/ko/hi/etc.); Urdu Nastaliq/Naskh font reality; legacy `in` code prevalence
