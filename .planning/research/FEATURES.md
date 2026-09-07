# Feature Research

**Domain:** Static app-landing site expansion (v2.0: 20-language i18n incl. RTL, App Check, changelog page, gated social proof)
**Researched:** 2026-09-05
**Confidence:** HIGH overall — all policy/behavior claims verified against official Firebase and Google Search Central documentation fetched live this session; UX-norm claims marked MEDIUM where they rest on established practice rather than a fetched spec.

**Confidence legend used below:** claims tagged **[HIGH]** come from official docs fetched this session (Firebase docs, Google Search Central, MDN, keepachangelog.com). Claims tagged **[MEDIUM]** are established community practice, not independently verified by a fetched spec.

## Grounding: Existing Implementation (verified by reading repo code)

Dependencies named in tables below refer to these verified facts:

- `js/i18n.js` — dictionary-swap engine. `SUPPORTED = ['en','es','pt-BR']`; flat JSON dictionaries at `/js/i18n/{lang}.json` (`es.json`, `pt-BR.json` exist); EN is raw HTML restored from a snapshot; swap is `textContent`/`setAttribute` only (keyed nodes carry plain text by Phase-2 contract); `document.documentElement.lang` synced in the apply pass; **no `dir` handling exists anywhere**; detection is prefix-folding hardcoded for `pt-*`/`es-*`; endonym footer switcher built from an `ENDONYMS` map; persists `localStorage.persano.lang`; dispatches `persano:langchange`.
- `sitemap.xml` — plain `urlset`, **no hreflang/`xhtml:link` entries**, 5 URLs. (The pre-build STACK recommendation of per-language static HTML + hreflang sets was NOT how v1 shipped; v1 is single-URL dictionary swap, and the sitemap correctly reflects that.)
- `js/contact.js` + `js/firebase-config.js` — contact form imports Firebase auth+firestore modules via CDN dynamic import; anonymous auth → `addDoc` to `messages`.
- No auto URL redirect exists for language (in-place swap on one URL) — consistent with Google's anti-redirect guidance **[HIGH]**.

---

## Feature Landscape

### Area A — I18N-05: 17 New Localizations (hi, zh, fr, vi, nl, ur, el, ko, tr, de, ja, ru, id, pl, it, bn, ar) + RTL

**Expected behavior on a high-quality multilingual site:** every visitor lands on readable content in their language with zero configuration; manual choice is one interaction and sticks; languages read in the correct direction with correctly mirroring layout; crawlers see a consistent language story. Google detects page language algorithmically — **not** from `hreflang` or `lang` **[HIGH]**, so a single-URL dictionary-swap site is a legitimate architecture; what matters is that content, `lang`, and `dir` agree once swapped.

#### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 17 new dictionaries with 1:1 key parity vs EN | Missing keys = silent EN fallback (existing D-30 behavior); parity is the quality gate | MEDIUM | Mechanical drafting, owner review per language; add a CI/parity-check script (compare key sets across all 20 `js/i18n/*.json`) — without it, misses are invisible until a user hits one |
| Engine `SUPPORTED` + `ENDONYMS` extension | Switcher and validation read these two constants; 17 new endonyms (हिन्दी, 中文, Français…) | LOW | ~20-line change; endonym display is the expected UX (each language listed in itself) |
| Detection prefix-folding for new languages | Existing `detect()` hardcodes `pt-*`→`pt-BR`, `es-*`→`es`; must fold all 20 (e.g. `de-*`→`de`, `ar-*`→`ar`) | LOW | One folding table; decide zh handling (site scope = `zh` ≈ Simplified; `zh-*`→`zh`) |
| `lang` sync on swap | Already automatic (`applyLanguage` sets `documentElement.lang`) | DONE | Existing behavior carries over |
| RTL base direction for ar/ur | `dir="rtl"` must be set on `<html>` alongside `lang`; `lang` does not imply direction **[HIGH]** | LOW | Add RTL_LANGS list to engine; set `documentElement.dir` in `applyLanguage`; remove on switch back to LTR |
| CSS RTL audit (mirrored layout) | Logical order properties (margin-inline-start, text-align:start) mirror automatically; physical `left/right` properties and directional pseudo-element spacing do not **[HIGH]** | MEDIUM-HIGH | The real cost of RTL. Audit every stylesheet for `margin-left/right`, `padding-left/right`, `text-align: left/right`, directional icons/arrows; fix via logical properties or `[dir="rtl"]` overrides. Flexbox/Grid row direction mirror automatically |
| Bidi-safe inline mixed content | Latin runs ("GeoHist Trivia", version numbers) inside RTL text; neutral punctuation at run boundaries can land on the wrong side **[HIGH]** | MEDIUM | Constraint: keyed nodes are plain-text-only (textContent contract) → cannot insert `<bdi>`. Mitigations: keep mixed content at run-friendly positions, or extend `data-i18n-attr` to carry `dir` on specific nodes; manual check of ar/ur pages against landing copy |
| Form inputs direction for RTL | `<input>`/`<textarea>` inherit direction; users typing Urdu/Arabic expect RTL field content | LOW | dir inheritance covers it once `<html dir="rtl">`; verify contact form under ar/ur |
| Switcher UX scales to 20 entries | Footer inline "A · B · C" breaks at 20 languages | MEDIUM | Expected pattern at 20 languages: a labeled `<select>` or footer language menu; must remain keyboard-accessible and keep `lang`/`hreflang` attrs on options; MEDIUM confidence (UX norm, not spec) |
| Font coverage for new scripts | System font stacks generally cover Arabic, Devanagari, Bengali, CJK, Cyrillic, Greek via OS fallback | LOW | Verify visually on 2–3 pages per script; Nastaliq (ur) fallback quality is the main watch item [MEDIUM] |

#### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| hreflang + sitemap `xhtml:link` sets for per-language URLs | Only meaningful if the site moves to per-language static HTML (distinct URLs per language); enables Google to link the right language version in results **[HIGH]** | HIGH | 5 pages × 20 languages = ~100 URL variants, reciprocal self-referencing sets, x-default → EN. **Architecture decision pending** — see Dependency Notes. Under current single-URL dictionary-swap, hreflang is *not applicable* (nothing to annotate) and correctly stays out of scope |
| Per-language static HTML (subdirs) | Crawlable per-language content, no JS dependency for translation, cleaner analytics | HIGH | Contradicts zero-build maintenance model at this page count; would multiply page maintenance ~×20. Current STACK.md favors it; v1 shipped dictionary-swap. Roadmap must pick one — complexity swing is large |
| `changelog.*` dictionary keys included in all 20 dicts from day one | One build order instead of a 21-language catch-up later | LOW | Already planned (CONT-06 before I18N-05) |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Geo-IP / server-side language redirect | "Serve users their language" | Impossible on GitHub Pages (no server); Google explicitly advises against automatic redirects based on guessed language and against IP analysis **[HIGH]** | Client-side detect (already built) + visible switcher; EN always reachable |
| URL auto-redirect on deep pages | Maximize localized reach | Redirect loops, crawler confusion, users trapped in a language | If per-language URLs ever adopted: entry pages only, persistence flag, never crawlers |
| Translating the privacy policy | "Full i18n" | English is the legally authoritative version (PROJECT.md out-of-scope) | Keep EN policy; link it from translated pages with translated label |
| Third-party auto-translate widget | Cheap coverage | Machine-translated HTML = poor quality + no control; Google translates user-side | Owner-reviewed agent-drafted dictionaries (current plan) |
| Adding languages one-off as JSON without a parity gate | Fast shipping | Silent key misses degrade to EN invisibly | Parity check × 20 in CI before each deploy |

---

### Area B — FIRE-07: Firebase App Check (reCAPTCHA v3) on the Contact Form

**Expected behavior (verified, official Firebase docs):** after the SDK is integrated, the client sends App Check tokens with Firebase requests, but **products do not reject anything until enforcement is enabled console-side** — that is monitoring mode **[HIGH]**. It is an observability phase, not a protection phase. reCAPTCHA v3 returns a 0.0–1.0 score; App Check compares against a configurable app-risk threshold (default 0.5); scores strictly below the threshold are rejected *once enforcing* **[HIGH]**. v3 is invisible — no checkbox, no user interaction required **[HIGH]**.

**What monitoring mode means operationally:** every anonymous-auth sign-in and Firestore `addDoc` from the form already carries a token; the Firebase console (**Security > App Check > APIs tab**) classifies requests as **Verified / Uncertain / likely-outdated / Reused token**; "ready to enforce" = almost all recent requests are Verified **[HIGH]**. Enforcement is a per-product console flip (Firestore **and** Authentication — the form's whole chain) with instant rollback (flip off) **[HIGH]**.

#### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| reCAPTCHA v3 site key registration (reCAPTCHA Admin) | Prerequisite for the provider | LOW | Owner console step; allowlist `persano.github.io` and later the custom domain (HOST-01 interaction — see dependencies) |
| `initializeAppCheck` in `contact.js` (CDN `firebase-app-check.js`) | Same fork-shaped pattern as auth/firestore; analytics surface untouched | LOW | Fits existing dynamic-import structure; no other JS surface needs App Check |
| Monitoring mode first (default state) | Docs: verify no legitimate-user disruption before enforcing **[HIGH]** | LOW | Zero code beyond the init; zero UX change |
| Metrics review ritual | "Almost all recent requests Verified" is the documented green light **[HIGH]** | LOW | Owner/agent check cadence; **small-sample caveat**: a low-traffic contact form needs a pragmatic window (e.g., ≥ 2 weeks and ≥ N verified submissions) before "almost all" means anything [MEDIUM] |
| Enforcement flip: Firestore + Authentication per-product | Console-side; both products in the form chain must enforce or protection is half-done **[HIGH]** | LOW | Owner console step; document the exact flip path |
| Pre-enforcement error UX in `contact.js` | Token fetch can fail (offline, provider error); at enforce time a rejected token = failed request | LOW-MEDIUM | Wrap submission: get token → proceed; on failure show the existing i18n'd error message + retry; map App Check/permission-denied errors to a friendly retry message, not a console error |
| Rollback plan | Unenforce = console flip off, immediate **[HIGH]**; before raising the threshold, temporarily unenforce **[HIGH]** | LOW | Written rollback note in phase plan |

#### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Replay protection on Firestore | Tokens become one-use; strongest config **[HIGH]** | LOW | Optional toggle at enforcement time; sensible for a spam-targeted form |
| Threshold tuning from reCAPTCHA score distribution | Raise strictness only when score distribution proves it **[HIGH]** | LOW | Score distribution lives in reCAPTCHA Admin console; default 0.5 first |
| Honeypot (already specced in STACK.md) | Defense-in-depth independent of App Check | LOW | Complements, does not replace; App Check gates abuse of the Firebase backend itself |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Enforce-on-day-1 on a live form | "Protected immediately" | Legitimate users whose tokens fail get silent form errors; docs' own warning path is monitor-then-enforce **[HIGH]** | Monitoring window, then flip |
| Threshold raised toward 1.0 | "Zero bots" | Can deny real users; docs explicitly warn and require unenforce-first **[HIGH]** | Keep 0.5; tune only with score-distribution evidence |
| Building enforcement UI (checkbox/challenge UX) | Perceived rigor | v3 is invisible by design; adding visible challenge UI is a different product (v2) | Stay v3-invisible |
| Do-it-yourself token checks in `contact.js` beyond SDK | Extra skepticism | Re-implementing the SDK badly; enforcement lives console-side | SDK + rules + replay protection |

---

### Area C — CONT-06: Changelog Page (`/geohist/changelog.html`)

**Expected behavior (Keep a Changelog 1.1.0, fetched live):** changelogs are *for humans* — curated, reverse-chronological, one entry per version, ISO 8601 dates (`2026-09-05`), linkable version headings, changes grouped into **Added / Changed / Deprecated / Removed / Fixed / Security**, latest first, with an `Unreleased` section when useful **[HIGH]**. Players landing on an app changelog expect: newest version on top, plain-language "what's new / what got fixed", dates, and consistency — not commit dumps **[HIGH]**.

#### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Newest-first version sections with version + date | Universal player expectation; dates ambiguous-region-proof in ISO 8601 **[HIGH]** | LOW | `## [1.0.0] — 2026-09-05` heading pattern; anchor ids per version |
| Grouped change types per entry | Players scan for "what's fixed" **[HIGH]** | LOW | Trim to the types the app actually uses (likely Added/Changed/Fixed); empty sections omitted (anti-pattern per KAC) |
| Plain-language, human-curated entries | Git-log dumps are noise **[HIGH]** | LOW | One curated bullet per notable change; agent-maintained model fits perfectly |
| i18n chrome keys (`changelog.*` namespace) | Page must exist in the 20-language dictionary build | LOW | Translate headings/labels; entries themselves default EN — see differentiator |
| Nav/footer + sitemap + landing link | Discoverability; sitemap gains the URL | LOW | Fits existing hand-rolled sitemap; also add to 404/backlinks pattern |
| `Unreleased` section convention | Lets the owner stage notes between releases **[HIGH]** | LOW | Optional but cheap; hide when empty |

#### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Translated changelog entries × 20 | Full localization parity for readers | HIGH (ongoing upkeep) | Every app release = 20 translations. Recommend: chrome translated, entries EN with owner opt-in per release; app in-game "What's new" is already localized, so the web page is the durable archive |
| Permalinked versions + "latest" anchor | Community/support can link to a version | LOW | Version headings already linkable per KAC principles |
| Dates in visitors' locale? | Readability | MEDIUM | ISO 8601 is the recommended unambiguous format **[HIGH]** — resist locale-formatting; it stays parseable for everyone |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Commit-log dump / auto-generated notes | "Automate it" | Noise, not for humans **[HIGH]** | Curated per-release entries |
| `YANKED` mechanics / release-pulled states | Format completeness | Not applicable to an app-store release cadence | Simply remove/never list broken releases |
| Changelog as JSON consumed by JS | "One source of truth" | Kills no-JS/crawler access; page is static HTML by contract | Static HTML entries (dictionaries only for chrome) |
| Syncing Play "What's new" verbatim via scraping | Low effort | Fragile + ToS-gray | Hand-copy the notable lines at each release |

---

### Area D — SEO-05: Gated aggregateRating + Social Proof

**Expected behavior:** a landing page pre-ratings shows honest, verifiable proof and **no rating markup at all**; the rating story unlocks only when real ratings exist. Verified guideline facts **[HIGH]**: `aggregateRating` requires `ratingValue` plus `ratingCount` or `reviewCount`; the marked-up rating must be *visible on the page* (invisible markup = guideline violation); **do not aggregate reviews or ratings from other websites**; no fake or undisclosed-incentivized reviews; the "self-serving" prohibition applies only to `LocalBusiness`/`Organization` — `SoftwareApplication` is not restricted, so an app's own site *may* carry its own rating markup *when the rating is genuinely sourced on that page's terms*.

**Critical nuance for this project:** Play Store ratings pasted into the site's JSON-LD are "ratings from another website" — the guideline text excludes aggregating them **[HIGH]**. Community practice diverges (many app sites mark up Play numbers) [MEDIUM], but the compliant wiring for this milestone is two-tier (below). No fabricated numbers, ever.

#### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Gate mechanism: authoring-time, not JS runtime | Static site; markup present-but-invisible violates the visibility guideline **[HIGH]**; JS-gated markup is crawler-visible anyway | LOW | Content (stars row, rating text, ratingCount in JSON-LD) lives as **HTML comments / absent JSON-LD properties** until the owner flips the gate. Commented-out = never served = zero risk. Matches PROJECT.md "owner flips gate" |
| Honest placeholder social proof while gate is closed | "Coming soon to Google Play" (existing Play badge placeholder already does this); real verifiable facts as proof | LOW | Real facts available now: offline-capable, 20 in-app localizations, history+geography scope, 4 real screenshots, Play Games Services, privacy contact path |
| Pre-registration / notify-me path while unpublished | Standard indie-app pattern [MEDIUM] | LOW | Play pre-registration link when available; otherwise "Follow releases via changelog" |
| JSON-LD stays `SoftwareApplication`-without-`aggregateRating` pre-ratings | Adding `aggregateRating: 0` or placeholder numbers = structured-data spam risk | LOW | Current shipped state is already correct; gate = a future property addition, nothing more |

#### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Tier 1 gate flip (Play listing live): visible proof row | "Rated X.X ★ on Google Play →" as **visible text + link with clear attribution** | LOW | Visible content with attribution is standard practice [MEDIUM]; no JSON-LD change required for this tier |
| Tier 2 gate flip: `aggregateRating` in JSON-LD | Rich-result star potential | LOW (code) — but eligibility-limited | Only if the site ever collects its own reviews (it doesn't today); Play-sourced numbers are excluded by the don't-aggregate rule **[HIGH]**. Honest recommendation: wire the *shape* (commented template), leave activation explicitly conditional on own-site review collection |
| Social-proof content set (translated) | 20-language parity for the proof row | LOW | Reuses changelog-order i18n key-parity build |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Fabricated stars/counts ("4.9★, 10k players") | Looks launched | Google fake-review guidelines **[HIGH]**; trust destruction if caught; Play policy contamination | Real facts + "coming soon" |
| Invisible/JS-injected markup pre-ratings | "Ready for later" | Invisible-markup guideline violation **[HIGH]**; JS-gated stars render for nobody yet are crawler-visible = worst of both | Commented template, owner flips |
| Incentivized review solicitation without disclosure | Seed ratings | Explicitly barred **[HIGH]** | None needed — let organic Play ratings exist at Play |
| Marking up Play reviews individually (`Review` items) | Richer snippet | Aggregating another site's content **[HIGH]** + author-validation rules | Link out to Play reviews instead |

---

## Feature Dependencies

```
[CONT-06 changelog page]
    └──requires──> [i18n chrome keys present in ALL 20 dictionaries]
                        └──requires──> [I18N-05 built AFTER changelog keys exist
                                        (build changelog first — PROJECT.md already orders this)]

[I18N-05 dictionaries ×17]
    └──requires──> [key-parity gate (CI script) — new CI work]
    └──requires──> [i18n.js engine extension: SUPPORTED, ENDONYMS, folding table, dir switching]
    └──conflicts──> [text-only keyed-node contract] (bidi isolation needs workarounds — see RTL table)

[FIRE-07 App Check]
    └──requires──> [reCAPTCHA v3 site key (owner, reCAPTCHA Admin)]
    └──requires──> [contact.js: token init + failure UX]
    └──requires──> [HOST-01 domain decided BEFORE reCAPTCHA site-key domain allowlist is finalized]
                        (site-key domain list + Firebase authorized domains must include the final
                         domain; changing domains after means re-editing both console configs)

[SEO-05 social proof]
    └──gated──> [Play listing live (external, owner)] — no code dependency on other v2 features
    └──enhances──> [landing page] (proof row slots into existing hero/features)

[HOST-01 custom domain]
    └──conflicts──> [FIRE-07 enforcement flip] if App Check config is finalized before the domain
                     (reCAPTCHA allowlist + authorized domains must be re-edited post-flip)
```

### Dependency Notes

- **CONT-06 requires the changelog keys before I18N-05:** dictionaries are drafted per-language with a parity gate; retrofitting `changelog.*` into 20 dicts later = a second 20-language pass. Build order already stated in PROJECT.md.
- **FIRE-07 depends on HOST-01 ordering:** reCAPTCHA v3 site keys are domain-allowlisted; Firebase authorized domains gate auth. Decide/land the custom domain first (or re-edit console configs at flip time). This ordering is a phase-sequencing recommendation.
- **I18N-05 conflicts with the text-only keyed-node contract for RTL:** bidi isolation normally wants `<bdi>` wrappers; the snapshot/textContent contract forbids markup inside keyed nodes. The engine's `dir` switch + CSS logical audit are the compatible path; hand-check ar/ur pages for punctuation-at-run-boundary glitches.
- **SEO-05 is the only externally gated feature:** everything else ships at the site's own pace.

---

## MVP Definition

### Launch With (v2.0 milestone)

- [ ] 17 dictionaries + parity gate × 20 — the headline commitment; mechanical but review-heavy
- [ ] Engine extension: SUPPORTED/ENDONYMS/folding/dir switching — small, unblocks everything above
- [ ] CSS RTL audit for ar/ur on all pages — the only genuinely design-heavy i18n work
- [ ] Changelog page (EN entries, i18n chrome) — built *before* the locale expansion lands
- [ ] App Check monitoring mode wired into `contact.js` + owner console steps documented
- [ ] Social-proof gate: commented Tier-1/Tier-2 templates in place; pre-rating proof = real facts only

### Add After Validation (v1.x of this milestone)

- [ ] App Check enforcement flip (Firestore + Authentication) — trigger: metrics window shows verified share ≈ 100%
- [ ] Tier-1 visible proof row — trigger: Play listing live (owner flips)
- [ ] hreflang/sitemap alternates — trigger: only if roadmap adopts per-language static HTML

### Future Consideration (v2+)

- [ ] Per-language static HTML expansion — revisit only if a crawlability/traffic case emerges
- [ ] Tier-2 JSON-LD `aggregateRating` — revisit only if the site collects its own reviews
- [ ] Translated changelog entries per release — revisit if changelog becomes a traffic surface

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 17 dictionaries + parity gate | HIGH (core audience reach) | MEDIUM (volume, review) | P1 |
| RTL dir switching + CSS audit | HIGH (ar/ur unusable without) | MEDIUM-HIGH | P1 |
| Engine extension (SUPPORTED/ENDONYMS/folding/dir) | HIGH | LOW | P1 |
| Changelog page (pre-locale build order) | MEDIUM-HIGH | LOW-MEDIUM | P1 |
| App Check monitoring mode | MEDIUM (invisible, observability) | LOW | P1 |
| App Check enforcement flip | HIGH (spam-free form) | LOW (console) + UX wiring | P2 (after metrics) |
| Gated social proof wiring | MEDIUM (pre-ratings) → HIGH (post) | LOW | P2 |
| hreflang/per-language URLs | MEDIUM (SEO) | HIGH | P3 (architecture decision first) |

**Priority key:** P1 = must have in this milestone · P2 = sequenced inside the milestone on a trigger · P3 = deferred pending a decision

---

## How High-Quality Sites Do It (Analogue Analysis)

| Concern | Large multilingual sites (hreflang-heavy) | App web changelogs (Signal/Telegram-style) | App landing pages w/ ratings | This site's approach |
|---------|------------------------------------------|--------------------------------------------|------------------------------|----------------------|
| Language serving | Per-language URLs + reciprocal hreflang + sitemap `xhtml:link` **[HIGH]** | n/a | n/a | Dictionary-swap, one URL — valid because Google detects language algorithmically, not via hreflang **[HIGH]**; upgrade path documented above |
| Auto-redirect | Entry-page-only, flag-persisted, never crawlers | n/a | n/a | No redirect at all (in-place swap); Google's anti-redirect guidance is satisfied by construction **[HIGH]** |
| Changelog format | n/a | Newest-first, ISO dates, grouped Added/Changed/Fixed **[HIGH]** | n/a | Keep a Changelog principles, trimmed type set |
| Rating display | n/a | n/a | Visible rating with on-store attribution + link | Two-tier gate; JSON-LD only for own-site reviews |

---

## Sources

- Firebase docs — App Check reCAPTCHA v3 setup (`firebase.google.com/docs/app-check/web/recaptcha-provider`), monitoring metrics (`/docs/app-check/monitor-metrics`), enforcement (`/docs/app-check/enable-enforcement`) — fetched live 2026-09-05 — **HIGH**
- Google Search Central — Localized versions / hreflang (`/search/docs/specialty/international/localized-versions`) and Managing multi-regional and multilingual sites — fetched live 2026-09-05 — **HIGH**
- Google Search Central — Review snippet / AggregateRating structured data (`/search/docs/appearance/structured-data/review-snippet`) — fetched live 2026-09-05 — **HIGH**
- MDN — `dir` global attribute (`developer.mozilla.org/.../Global_attributes/dir`) — fetched live 2026-09-05 — **HIGH**
- Keep a Changelog 1.1.0 (`keepachangelog.com/en/1.1.0/`) — fetched live 2026-09-05 — **HIGH**
- Static-site language-detection UX patterns and indie-app social-proof norms — training knowledge, consistent with the fetched Google guidance — **MEDIUM**
- Existing implementation facts (`js/i18n.js`, `sitemap.xml`, `js/contact.js`) — read directly from repo — **HIGH**

---
*Feature research for: Persano v2.0 milestone (multilingual ×20, App Check, changelog, gated social proof)*
*Researched: 2026-09-05*
