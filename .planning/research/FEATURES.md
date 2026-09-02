# Feature Landscape

**Domain:** Indie Android app landing site + personal developer hub (GitHub Pages, plain HTML/CSS)
**Project:** Persano — root portfolio hub + `/geohist/` landing page for GeoHist Trivia (Android trivia game, in Google Play review)
**Researched:** 2026-09-01
**Mode:** Features (ecosystem research, feature-dimension only)

**Overall confidence:** HIGH for Play policy requirements (verified against Google Play Console Help policy pages fetched directly); MEDIUM for conversion/UX community norms (no search MCP available this session; based on established practice); per-claim confidence noted inline.

---

## Critical Research Finding (read this first)

**Google Play's User Data policy (verified, HIGH)** — fetched directly from Play Console Help policy pages:

1. **Privacy policy is mandatory for every app** — even apps with zero data collection. It must be on an **active, publicly accessible, non-geofenced URL, no PDFs, non-editable**. It must include: developer information **and a privacy point of contact or inquiry mechanism**, data types collected/used/shared, secure handling, **data retention and deletion policy**, be titled "privacy policy," and **name the entity exactly as it appears in the Play store listing** (or vice versa).
2. **Data safety form must stay consistent** with the privacy policy — the site policy and the Play Console Data safety section must tell the same story (AdMob, Firebase Analytics, Play Games sign-in all count as collection).
3. **Account deletion requirement (HIGH relevance):** apps that let users create an account **must offer account + data deletion**, and if deletion happens outside the app, Play requires a **web deletion-request resource** whose link must not be broken. GeoHist uses **Google Play Games Services** sign-in → this requirement plausibly applies → the site is the natural home for a "request deletion of my game data" path (even if it's an email-template + contact-form flow).
4. Consent must be affirmative action — **auto-dismissing consent popups are explicitly prohibited** by the policy text.

This makes the website **part of the app's compliance surface**, not just marketing. The privacy policy page alone justifies the site's existence.

---

## Table Stakes

Missing any of these = reviewers reject, players bounce, or the site feels unfinished.

### Core Landing

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero with app name + one-line value prop + game icon | First 5 seconds decide stay/leave; every app site has this | Low | Static HTML, zero deps |
| "Get it on Google Play" official badge + link | Users expect the canonical install path; badge is Google's official artwork (policy-safe) | Low | Play link placeholder until listing live (per PROJECT.md) — placeholder must be visually identical but inert, or hidden until live |
| Screenshot gallery (3–6 real screenshots) | Screenshots are the #1 conversion asset; stock/dummy art reads as scam | Low–Med | ADB capture tools already exist in app repo; phone-frame mockups are the polish tier (optional) |
| Feature list / "what makes it different" | Visitors scan, don't read; 4–6 bullets with icons | Low | Source: app README/docs, AI-drafted, owner reviews |
| Mobile-first responsive layout | Most game-landing traffic is on phones (people tap a Play/social link on their device) | Low | Constraint already set; just don't break it |
| Fast load (no build step, optimized images) | Core Web Vitals affect both UX and ranking; plain HTML is inherently fast | Low | Compress screenshots (WebP + fallback), lazy-load below-fold images |
| Footer with copyright + brand name | Bare minimum legitimacy signal | Low | Entity name should match Play listing (see compliance) |

### Trust & Compliance

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Privacy policy page (`/geohist/privacy.html`) | **Hard Play policy requirement** (HIGH, verified). No PDF, public URL, correct entity name, contact mechanism, retention/deletion | Low (page) / Med (content accuracy) | Source file exists (`GeoHist_Trivia_Privacy_Policy`); must be updated to name the store-listing entity and include contact + retention/deletion sections if missing |
| Contact channel (email or working form) | Play policy expects a privacy inquiry mechanism; players expect support access; reviewers sometimes test it | Med | Firebase JS SDK → Firestore; anonymous auth + security rules per PROJECT.md. **Form success/error states are part of the feature, not polish** |
| GDPR consent banner gating Analytics + form | EU visitors; AdMob app is already privacy-sensitive; Google Consent Mode v2 pattern is the verified way (HIGH): `gtag('consent','default',…denied…, wait_for_update)` → `gtag('consent','update',…)` on choice; SDK loads only after "accept" | Med | Banner must require affirmative action (auto-dismiss = policy violation). Store choice in localStorage. Note: consent state must also gate the contact form's anonymous auth |
| Working links, no placeholders, no lorem ipsum | Reviewers and visitors treat dead links as abandonment | Low | CI link check (see Ops) catches this |
| Privacy policy linked from site footer **and** discoverable | Play checks the URL works and is reachable; buried 3 clicks deep looks evasive | Low | |

### Content Depth

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| FAQ (offline mode, data collected, devices supported) | Players ask these pre-install; also the exact questions Play reviewers probe | Low | Data-collection FAQ must mirror privacy policy wording — single source of truth |
| Download/store section with requirements (Android version, size) | Sets expectations, cuts 1-star "won't install" reviews | Low | |
| Privacy policy in same language as site (EN) | Required for Play listing; translations explicitly out of scope (PROJECT.md) | — | EN authoritative |

### Discovery (SEO / Sharing)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Meta titles + descriptions per page | Search is how people find "[app name] privacy policy" — a top query pattern | Low | |
| Canonical URLs + `sitemap.xml` + `robots.txt` | Site is at `persano.github.io` root + `/geohist/` subdir; sitemap must list all real pages | Low | Search Console already verified on this repo |
| Open Graph + Twitter card tags (og:image 1200×630) | Every share (WhatsApp, Discord, Reddit) renders a link preview; missing preview = dead link look | Med (image asset) / Low (markup) | One branded image for hub, one for GeoHist |
| Favicon + favicon set | Browser tab + bookmark legitimacy | Low | Reuse app icon |
| Custom 404 page | GitHub Pages honors `/404.html`; protects against broken subdir links | Low | |

### Multi-App Hub

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Root page with short bio + portrait/logo + "about the developer" | Personal-brand hub needs a human face; Play "developer website" links point here | Low | Santiago David Postorivo / Persano identity |
| App cards (icon, name, tagline, badge) linking to `/geohist/` | The hub's entire job is routing visitors to apps | Low | Card grid must render sensibly with **1 app** (single card ≠ broken layout) and scale to N without code changes |
| Hub ↔ app-site navigation both directions | Users landing on `/geohist/privacy.html` from Play must reach the hub and vice versa | Low | Shared header/footer pattern, hand-copied between pages (no build step) |
| **No visible placeholders for future apps** | Empty "coming soon" cards destroy credibility (explicit PROJECT.md constraint) | Low | Design decision: grid reflows when a new subdir appears |

### Ops

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| GitHub Actions CI: validate (HTML/link check) → deploy to Pages | Broken privacy-policy URL during review is the nightmare scenario; validate-before-deploy is the guard | Med | Docs confirm custom workflows are supported for Pages deploys (HIGH, GitHub docs) |
| Firebase Analytics (site) | Already required by PROJECT.md; load only after consent | Low | Same Firebase project as app |

---

## Differentiators

Not expected by reviewers — but raise conversions, trust, or maintainability.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **How-to-play guide on its own page** | For a trivia game with mechanics (history+geography modes), a guide converts "what is this?" → install; also feeds FAQ | Med | PROJECT.md already requires this — treated as differentiator-grade content worth investing in |
| **Changelog / version notes page** | Shows the app is alive (reviewers and players both notice staleness); maps to `releaseNotes` in SoftwareApplication schema | Low–Med | Simple list per release; update on each app release |
| **SoftwareApplication structured data (JSON-LD)** | Google documents a "Software app" rich result (HIGH, verified): `@type: SoftwareApplication, operatingSystem: ANDROID, applicationCategory: GameApplication, offers, aggregateRating`. Eligible for richer search presentation | Low | One `<script type="application/ld+json">` block; keep `offers.price = 0`; add `aggregateRating` only once real Play ratings exist (fabricating ratings violates schema guidelines) |
| **Language switcher + browser-language auto-detect (EN/ES/PT)** | Game has 20 localizations; matching the site to the player's language is trust + conversion | Med | **Verified constraint (HIGH):** Google warns locale-adaptive pages (content varies by visitor) may not be fully crawled. Safe pattern: content swapped client-side via `data-i18n` keys + `navigator.language` detection + manual switcher + `localStorage` persistence + EN fallback; document `<html lang>` kept accurate dynamically. SEO cost is acceptable — installs come from Play search, not organic web |
| **Rating/social-proof strip** (once live) | "4.6 ★ on Google Play" converts; pull statically, update manually | Low (later) | Only after listing is live and has ratings |
| **Consent-mode-aware analytics events** (Play button clicks, language switched, guide opened) | Measures whether the site converts, informs where traffic comes from | Med | Consent-gated; only fire after grant |
| **Firebase App Check on the web form** | Hardens contact form against scripted abuse beyond anonymous auth | Med | ReCAPTCHA-enterprise-free (v3 app check) — small config, real spam reduction |
| **Honeypot field + basic client-side rate limiting on form** | Cheap second spam layer; zero UX cost | Low | Complements Firestore rules |
| **Accessibility WCAG 2.1 AA + audit step** | Explicitly required by PROJECT.md; broadens audience, matches Play ecosystem quality bar | Med | Alt text on screenshots, contrast on dark theme, keyboard nav, focus states, form labels |
| **Dedicated data-deletion request path** (email template / form tag / dedicated FAQ entry) | Directly answers the Play account-deletion requirement (HIGH); reviewers check for a working deletion channel | Low–Med | Simplest compliant form: FAQ entry + contact form with "request data deletion" topic + documented manual process |
| **Screenshot gallery with captions per screenshot** | Captions explain mechanics; alt text doubles as accessibility | Low | |
| **Dark history+geography visual theme** (map textures, antique accents) | Brand cohesion hub↔app; memorable niche aesthetic | Med | Agent's call per PROJECT.md; pure CSS |
| **GitHub Search Console verification retained** | Already in repo; keeping it enables indexing monitoring from day 1 | Low | |

---

## Anti-Features

Deliberately NOT build. Each maps to a PROJECT.md Out-of-Scope item or a verified policy/efficiency reason.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| PDF privacy policy | Play policy **explicitly bans PDFs** and requires non-editable HTML on a public URL (HIGH, verified) | HTML privacy page at `/geohist/privacy.html` |
| Auto-dismissing consent popup | Explicit Play policy violation ("Don't use auto-dismissing consent popups when affirmative action is required") | Banner requiring explicit Accept/Reject click |
| Server-side language redirect (serving different HTML per Accept-Language) | Google warns locale-adaptive pages risk incomplete crawling/indexing (HIGH, verified); static host can't do it anyway | Client-side detect + manual switcher + per-language URLs only if/when SEO justifies real subdirectories |
| Translated privacy policy | Legal risk of divergent authoritative texts; PROJECT.md excludes | English-only policy; language switcher hides legal pages from translation scope |
| Native App Links / deep links into the game | Adds Android intent-filter + assetlinks.json maintenance for zero gain on an informational site (PROJECT.md) | Plain Play Store links |
| Real-time chat, comments, user accounts on site | Not core to landing value; huge spam/abuse surface; PROJECT.md excludes | Contact form (Firebase) + FAQ |
| Jekyll/SSG, build pipeline, JS frameworks | Zero-build constraint is deliberate; plain HTML is agent-maintainable and GitHub Pages native | Hand-maintained HTML/CSS + vanilla JS |
| Custom domain (v1) | Deferred per PROJECT.md; `persano.github.io` works and Search Console is already verified on it | Revisit at a later milestone; keep URLs relative so a domain swap is config-only |
| Fabricated ratings/reviews/social proof pre-launch | Schema.org guidelines + honesty; empty social proof reads worse than none | Add aggregateRating/social proof only after real Play data exists |
| Placeholder app cards on hub | PROJECT.md forbids visible placeholders for future apps | Grid renders with actual apps only |
| Auto-playing video / heavy hero media | Kills mobile performance; most visitors are on phones; no build step to optimize media | Static hero image + screenshot gallery |
| Cookie banner that also gates core content | Consent should gate tracking, not access; gating content hurts conversion and AA accessibility | Analytics + form gated; content always available |

---

## Feature Dependencies

```
Privacy policy content (existing file)
  └─ Privacy policy page ── footer link ── every page
  └─ Data-safety consistency (Play Console, outside site)

Firebase project (web app registration in app repo's project)
  ├─ Anonymous Auth ── Contact form
  ├─ Firestore security rules ── Contact form (payload validation, per-uid write limits)
  ├─ App Check (optional hardening) ── Contact form
  └─ Firebase Analytics (site) ── GDPR consent banner (banner MUST gate: gtag consent default denied → update on accept)

Screenshots: ADB capture tooling (app repo) ── Gallery ── og:image / schema screenshot / hero art

Language keys (data-i18n dictionary) ── i18n switcher ── auto-detect (navigator.language) ── localStorage persistence

Play Store listing live
  └─ Real store link (replaces placeholder badge link)
  └─ aggregateRating in structured data (only when real ratings exist)

Hub page ── app cards ── /geohist/ pages (nav both ways)

GitHub Actions validate (HTML + links) ── Pages deploy ── live site
sitemap.xml ── all final URLs (generate after page set is stable)
```

**Critical ordering constraint:** the consent banner must exist **before or with** the Analytics snippet in every page template — retrofitting it means auditing every page. Likewise sitemap/OG/schema belong to the last content phase, once URLs are final.

---

## MVP Recommendation

Prioritize (maps 1:1 onto the Active requirements list — the researched landscape confirms the scoping is correct):

1. **Privacy policy page + footer links** — the single non-negotiable Play-facing artifact (HIGH-verified requirement)
2. **Hero + screenshots + Play badge (placeholder) + feature list** — core conversion block
3. **FAQ + contact form (anon auth + Firestore rules + consent-gated load)** — reviewer and player trust surface
4. **Consent banner (Consent Mode v2 pattern) wired before Analytics goes live** — ordering-critical
5. **Hub page with one-app card grid + EN/ES/PT i18n** — brand foundation with multi-app structure
6. **Meta/OG/sitemap/SoftwareApplication JSON-LD + CI validate-deploy + AA audit** — discovery and quality gate

Defer:
- **Changelog page**: valuable but nothing links to it until the app has shipped updates; add in first post-launch phase
- **Rating/social-proof strip + aggregateRating schema**: requires live Play listing data
- **17 additional localizations**: staged per PROJECT.md if traffic justifies
- **App Check on web form**: harden in ops phase after form proves it works
- **Custom domain, deep links, SSG migration**: explicitly out of scope

---

## Sources

- Google Play Console Help — User Data / Privacy, Deception and Device Abuse policy page (`support.google.com/googleplay/android-developer/answer/9888076`, fetched via curl, read directly) — **HIGH**: privacy policy spec (no PDF, non-geofenced, entity name, contact mechanism, retention/deletion), Data safety consistency, account deletion + web deletion resource, affirmative-consent rule
- Google Play Console Help — Data safety section (`answer/9888379`, fetched) — **HIGH**: form must match privacy policy disclosures
- Google Consent Mode v2 (`developers.google.com/tag-platform/security/guides/consent`, fetched) — **HIGH**: `gtag('consent','default',…)` denied by default + `wait_for_update`, `update` on choice; EEA requirement
- Google Search Central — International/multilingual overview (fetched, updated 2025-12-10) — **HIGH**: locale-adaptive page crawling warning; nav confirms "Software app" is a current structured data feature
- Google Search Central — Software app structured data (fetched) — **HIGH**: SoftwareApplication JSON-LD example (name, operatingSystem ANDROID, applicationCategory GameApplication, aggregateRating, offers)
- schema.org/SoftwareApplication (fetched) — **HIGH**: property list (featureList, screenshot, installUrl, releaseNotes, softwareVersion…), usage tier 1M–10M domains
- GitHub Docs — What is GitHub Pages (fetched) — **HIGH**: user site at `owner.github.io` from `<owner>.github.io` repo; custom workflows for deploy; GitHub logs visitor IPs
- Firebase docs (anonymous auth / Firestore rules pages returned 404 shells this session; patterns corroborated by fetched Firestore security rules doc present in workspace temp) — **MEDIUM**
- Conversion/UX norms for app landing pages (hero/badge/screenshots/CTA placement, OG 1200×630, changelog/social-proof expectations, indie hub patterns) — **MEDIUM**, community-standard practice, not independently re-verified this session (no search MCP available); flagged as the main re-verify target for phase planning
