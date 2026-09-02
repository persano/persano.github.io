# Domain Pitfalls

**Domain:** Static GitHub Pages app-landing site (Firebase contact form, GDPR consent, i18n, SEO, Play-review support)
**Researched:** 2026-09-01/02
**Confidence basis:** Claims verified against official sources this session (firebase.google.com, developers.google.com, docs.github.com, actions/deploy-pages README) and **live probes of persano.github.io itself** (headers + 404 behavior). Items that could not be primary-source-verified are marked MEDIUM.

---

## A. Firebase / Security

### Pitfall A1: Treating the Firebase web API key as either a secret or as harmless
**Symptom:** Panic + credential-scrubbing ceremony when the config (`apiKey`, `authDomain`, `projectId`) lands in the public repo — or the opposite failure: "the key is public, so no attacker can abuse us" and rules stay wide open.
**Why it happens:** Google's official position ([Firebase API keys doc](https://firebase.google.com/docs/projects/api-keys)): API keys *identify* the project, they do not *authorize* anything. "API keys restricted to Firebase services do not need to be treated as secrets." Real protection = Security Rules + App Check + IAM. Both extremes are wrong: the key is publishable, but it is also a live door into Firestore — the rules decide what's behind the door.
**Prevention:**
- Commit the config inline (it is in the served HTML anyway — hiding it in "env vars" is security theater on a static site).
- In Google Cloud Console → APIs & Services → Credentials: confirm the key has **API restrictions** limited to Firebase-related APIs only. Never add Maps, Places, or the Gemini API to a publicly-served key's allowlist (quota-theft vector; Google explicitly warns about this).
- Put the actual access control in Firestore rules (Pitfall A2) + App Check (A4).
**Early warning sign:** Receiving a Google Cloud email about "publicly accessible Google API key" — follow its checklist instead of deleting/rotating the key (rotation does nothing on a client site; the new key is equally public).
**Phase:** Firebase/Contact-form phase (setup task, not a code task).

### Pitfall A2: Open-write Firestore rules ("test mode" or bare `request.auth != null`)
**Symptom:** Within days: junk documents in `contact-messages` — SEO spam, gibberish, link farms. Firestore write counts spike; in the worst case someone fills the free quota or the inbox becomes unusable.
**Why it happens:** New Firestore projects default to 30-day test-mode rules (`allow read, write: if true` — Google labels this "NEVER use in production"). Even the "improved" one-liner `allow create: if request.auth != null` accepts *any* content: a script can mint unlimited anonymous users (A3) and write 10,000-character garbage fields.
**Prevention:**
- Scope rules to the one collection: `match /contact-messages/{id}` only; deny everything else (`allow read, write: if false` as the global default).
- `allow create` only — never `update`/`delete` from the client.
- Validate shape server-side in the rule: `request.resource.data.keys().hasOnly([...])`, per-field type + max length (e.g. message ≤ 2000 chars, email valid-ish string), reject `unknown` extra fields.
- Use server timestamps (`serverTimestamp()`) client-side, never a user-supplied date.
- Test in the console Rules simulator with both unauthenticated and anonymous-authenticated simulations before deploying; remember CLI deploys overwrite console-edited rules — keep the rules file in the repo as source of truth.
**Early warning sign:** Firestore "Writes" chart in the Firebase console is nonzero while the site has near-zero traffic; any document whose fields don't match the form schema.
**Phase:** Firebase/Contact-form phase — rules are a deliverable of that phase, reviewed before the form goes live. If the app's Firestore already has rules, verify the new collection doesn't inherit broader patterns.

### Pitfall A3: Anonymous auth quota churn / unbounded user growth
**Symptom:** Firebase Auth user list fills with thousands of anonymous UIDs; eventually sign-ins start failing or billing warnings appear — the form breaks silently for real visitors.
**Why it happens:** `signInAnonymously` creates *persistent* accounts (official doc). If the site signs in on every page load (instead of only when the form is used), every visitor and every bot creates an account. Anonymous accounts count toward usage limits unless automatic clean-up is enabled; clean-up (delete after 30 days) requires the free-tier Identity Platform upgrade.
**Prevention:**
- Sign in anonymously **only at form-submit time** (or on first form interaction), not on page load.
- The SDK persists the session (IndexedDB/localStorage) — reuse it: check `auth.currentUser` before calling `signInAnonymously` again.
- Enable anonymous automatic clean-up in the console (Identity Platform setting).
**Early warning sign:** Firebase console → Authentication → Users shows a growing anonymous population after the site has been live a week.
**Phase:** Firebase/Contact-form phase.

### Pitfall A4: `auth/unauthorized-domain` — GitHub Pages domain not authorized for Firebase Auth
**Symptom:** The form works on `localhost`, throws `auth/unauthorized-domain` the moment it's live at `https://persano.github.io`.
**Why it happens:** Firebase Auth only accepts requests from domains in Authentication → Settings → **Authorized domains** (localhost + a `*.web.app` default are pre-registered; `persano.github.io` is not).
**Prevention:** Add `persano.github.io` to authorized domains as part of deployment, before the first real test on the live URL. If a custom domain is added later (v2 per PROJECT.md), it must be added too.
**Early warning sign:** Any console error mentioning `unauthorized-domain` during the first live smoke test.
**Phase:** Firebase/Contact-form phase — belongs on the deploy checklist.

### Pitfall A5: App Check skipped or enforced too eagerly
**Symptom (skipped):** Spam keeps flowing even with good rules, because rules can't distinguish a real browser from a script. **Symptom (enforced too early):** Real users blocked with reCAPTCHA failures, or the site breaks in local dev.
**Why it happens:** App Check (reCAPTCHA v3/Enterprise on web) is the only mechanism that attests "request came from my page, not a bot." It's off by default; teams either never enable it or flip enforcement on without a monitoring period.
**Prevention:**
- Register the web app for App Check with reCAPTCHA v3 (low friction for a landing page).
- Run in **monitor/unverified-traffic-visible** mode first; only enforce after reviewing metrics; use debug tokens for localhost.
- Rules stay the primary gate; App Check is defense-in-depth against scripted abuse.
**Early warning sign:** In App Check metrics: high share of unverified requests shortly after launch.
**Phase:** Contact-form phase for registration (monitor mode); enforcement decision deferred to post-launch hardening.
*Confidence: MEDIUM-HIGH — official App Check overview verified this session; the enforcement-mode details come from the same doc family.*

---

## B. GDPR / Consent

### Pitfall B1: Analytics fires before consent — the default-consent call comes too late
**Symptom:** EU visitors' pageviews are collected before they touch the banner; consent audit (or a WPP/DSAR complaint) shows collection without legal basis. This is the single most common consent-mode misconfiguration.
**Why it happens:** `gtag.js` / Firebase Analytics gets loaded via `<script src>` in `<head>`, and `gtag('consent', 'default', ...)` runs after it — or is only called from the banner code, which loads late. Official requirement: the **default consent state must be set before any Google tag loads**, with all four Consent Mode v2 parameters denied: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`.
**Prevention:**
- Inline `<script>` in `<head>`, before any external tag/SDK, calling `gtag('consent', 'default', {ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied', wait_for_update:500})`.
- Do **not** include the Firebase Analytics script tag in the page HTML at all; inject it only after an affirmative consent grant (belt-and-suspenders with the consent default).
- If Firebase Analytics is initialized through the Firebase JS bundle instead of gtag, same rule: initialize the app *without* the analytics module until consent, or ensure the default-denied command precedes the SDK load.
**Early warning sign:** In DevTools → Network, a request to `google-analytics.com/g/collect` or Firebase Analytics endpoints fires on first visit *before* the banner is clicked. Test in a fresh incognito window with an EU-exit node mindset (default-denied check is toolable: Tag Assistant / GA DebugView shows consent state).
**Phase:** Consent phase — this is its acceptance criterion, not a nice-to-have.

### Pitfall B2: Consent choice not persisted / not re-applied on return
**Symptom:** Banner reappears on every visit (annoying, suppresses conversion), or worse — the *denied* choice silently becomes "granted" on a later page load because the update call never happens on subsequent visits.
**Why it happens:** Official docs: "consent mode doesn't save consent choices" — the site owns persistence. A banner that only calls `update` at click time and nothing on page load fails returning visitors.
**Prevention:**
- Persist the decision in `localStorage` (key + timestamp).
- On every page load: read stored choice → if granted, call `gtag('consent','update', {...granted})` *in the head*, before analytics loads; if denied/none, leave defaults denied.
- Honor retraction: settings link that re-opens the banner and can downgrade to denied.
**Early warning sign:** Test: accept cookies, hard-refresh, check that no banner shows *and* `analytics_storage` is granted in the dataLayer; then clear site data and verify defaults are denied again.
**Phase:** Consent phase.

### Pitfall B3: Privacy policy on the site doesn't match what the site actually does
**Symptom:** `privacy.html` (imported from the app's policy) describes only app-side data collection (AdMob, game telemetry) — says nothing about the website's Firebase Analytics or the contact form storing the visitor's email in Firestore. Play reviewers and privacy-minded users compare the two.
**Why it happens:** The policy is copied from the app repo verbatim, and the website is treated as "just a brochure." The site is a separate data processing surface with the same Firebase project.
**Prevention:**
- Site policy page = app policy + a "Website" section: Firebase Analytics (with/without consent), contact form data (what's stored, why, how long), no cookies set by the site itself except consent/localStorage state.
- Keep the English policy authoritative (per PROJECT.md) but the website section applies to the site regardless of UI language.
- Every time a new SDK/tag is added to the site, the policy gets an entry in the same phase's definition-of-done.
**Early warning sign:** Diffing `privacy.html` against the site's `<script>` tags shows any collector the policy doesn't name.
**Phase:** Content/privacy phase (before Play submission; see E2).

---

## C. i18n (auto-detect + EN/ES/PT-BR switcher)

### Pitfall C1: Auto-*redirect* based on browser language
**Symptom:** Visiting `/geohist/` from a Spanish browser hard-redirects to `?lang=es` or `/geohist/es/`; Spanish-speaking users in the US can never see the English page; bookmarks/refresh behave inconsistently; in the worst variant, redirect loops (`/geohist/?lang=es` → `/geohist` → `?lang=es`…).
**Why it happens:** Treating auto-detect as auto-redirect. Google's explicit guidance: **"Avoid automatically redirecting users from one language version of a site to a different language version"** — and critically for SEO, Googlebot crawls **from the USA and sends no Accept-Language header**, so a redirect-on-detect means Google only ever crawls and indexes the default variant. Redirect loops appear when the preference isn't persisted and the detection logic disagrees with itself (e.g., UA-language ≠ stored language).
**Prevention:**
- Serve one canonical URL per page; apply language via in-place DOM swap (the `data-i18n` + JSON dictionary pattern planned in PROJECT.md), never via redirect.
- On first visit: detect `navigator.language` and apply it *without* changing the URL; persist the choice immediately.
- On later visits: the stored choice wins over re-detection; the visible language switcher overrides everything.
- Fall back to EN for anything not matching `es*`/`pt*` prefixes (map `pt-BR`→PT-BR content, `pt`→PT-BR fallback, never fall through to ES).
**Early warning sign:** Any `location.replace`/`location.href` assignment in the i18n code path — flag it in review. Test with a US-IP VPN/DevTools override: crawler view must equal EN default.
**Phase:** i18n phase — bake "no redirects, no URL changes" into the phase plan.

### Pitfall C2: Googlebot indexes the wrong (or only the default) language
**Symptom:** Search results show English snippets to Spanish/Portuguese users; or — with a naive per-language hidden implementation — duplicate-content confusion.
**Why it happens:** Google determines a page's language from **visible content, not `lang` attributes or URL** (official). With client-side JS language swapping, the crawler sees the initial server HTML = English default. That's *acceptable* for v1 (English is the SEO language; ES/PT users get a translated UI), but teams often expect all three languages to be indexed — they won't be.
**Prevention:**
- Keep the default language content **in the raw HTML** (server-delivered), never empty placeholders filled by JS — otherwise the page has no indexable text at all.
- Treat EN as the SEO surface for v1; don't add `hreflang` for the JS-swap variants (there are no separate URLs; `hreflang` on one URL pointing to itself in three languages is invalid and a known spam-signal mistake).
- If separate-URL i18n (`/geohist/es/`) is ever added later, do it with real duplicated HTML files + correct self-referencing `hreflang` set (en, es, pt-BR, x-default) + sitemap entries — and re-run this pitfall review.
**Early warning sign:** `view-source:` of the live page (not DevTools DOM) lacks the default-language copy.
**Phase:** i18n + SEO phases (shared decision — record it in both).

### Pitfall C3: `lang` attribute and accessibility drift after the language switch
**Symptom:** Screen readers read Spanish text with English pronunciation after the user switches to ES (jarring, fails WCAG "Language of Page Parts" 3.1.1/3.1.2); Lighthouse flags `<html lang>` mismatch; the manual switcher button has no accessible name in the active language.
**Why it happens:** The i18n routine swaps `textContent` of labeled elements but forgets `document.documentElement.lang = 'es'` (or `pt-BR` — the full tag matters), and the switcher itself isn't translated/labelled.
**Prevention:**
- One line in the apply-language function: update `document.documentElement.lang` alongside content.
- Announce the switch politely (optional `aria-live` on a status element) so screen-reader users know content changed.
- Translate the switcher's accessible name and the `<title>`/meta description too — a Spanish page with an English `<title>` is both an SEO and a11y smell.
**Early warning sign:** Run axe/Lighthouse after a language switch, not just on the default page.
**Phase:** i18n phase, re-verified in the a11y audit phase.

---

## D. GitHub Pages / CI

### Pitfall D1: Jekyll silently eating files (missing `.nojekyll`)
**Symptom:** Site works locally; on Pages, some assets 404 — typically anything under a `_*` folder, dotfiles, or `node_modules`/`vendor` (official: Jekyll skips files/folders starting with `_`, `.`, `#`, ending with `~`).
**Why it happens:** Pages runs a Jekyll build even for plain HTML repos unless told not to.
**Prevention:** Commit an empty `.nojekyll` at the repo root in the very first site commit. Also avoid `_`-prefixed folders entirely (e.g. use `assets/`, not `_assets/`) so both with/without Jekyll behave identically.
**Early warning sign:** Deploy succeeds but "open page source in browser" 404s for a file that exists in the repo.
**Phase:** Repo-setup phase (first commit).

### Pitfall D2: Deploy workflow breaks — wrong artifact path or missing permissions
**Symptom:** Green-looking job followed by "Get Pages site failed" / 404 on the deploy step, or the live site serves an empty directory listing. Two classic causes, both in the workflow file.
**Why it happens:**
1. `actions/upload-pages-artifact` defaults to `path: _site` — a plain-HTML repo has no `_site`, so it either fails or uploads nothing.
2. The deploy job lacks the OIDC contract of `actions/deploy-pages@v4`: job-level `permissions: pages: write` **and** `id-token: write`, plus the `github-pages` environment (verified against the action's README).
**Prevention:**
- `upload-pages-artifact` with explicit `path: .` (or a `dist/` if CI builds anything).
- Workflow skeleton: `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages@v4`; `permissions:` block present; `environment: github-pages`.
- One-time repo setting: Pages **Source = GitHub Actions** (branch-based source overrides/conflicts with the workflow).
**Early warning sign:** First CI run fails at deploy; check the Actions log for "artifact could not be found" or OIDC/permission errors.
**Phase:** CI phase (the workflow is that phase's main deliverable).

### Pitfall D3: Cache confusion — "I deployed but I still see the old site"
**Symptom:** After `git push` + green deploy, the site shows stale content for up to ~10 minutes; the developer force-pushes again, thinking the deploy failed.
**Why it happens:** Live-verified this session: `persano.github.io` serves `Cache-Control: max-age=600` — GitHub's CDN (and any intermediate/browser honoring the header) may serve a cached copy for up to 10 minutes after deploy. ETags make revalidation cheap but don't shorten the TTL.
**Prevention:**
- Document the 10-minute expectation in the CI phase docs; use `curl -H "Cache-Control: no-cache"` or incognito + hard refresh when verifying deploys.
- For CSS/JS changes where instant correctness matters (e.g. emergency rule fix), use cache-busting query strings (`site.css?v=YYYYMMDD`) — update the version string when the file meaningfully changes.
- Never rely on Pages for instant rollback verification.
**Early warning sign:** Time-gap confusion reports in chat sessions ("changes not visible") — check the deploy timestamp before assuming failure.
**Phase:** CI phase (verification procedure).

### Pitfall D4: Trailing-slash and relative-path inconsistency in links
**Symptom:** Every click to a directory page costs an extra 301 (live-verified: `https://…/mkdocs-material` → `301` → `/mkdocs-material/` on a Pages site); pages visited via the no-slash URL resolve *relative* asset URLs against the wrong base until the redirect lands; links with fragments (`/geohist#faq`) sometimes survive the redirect, sometimes lose it depending on client.
**Why it happens:** Directory URLs on Pages redirect to their slash form; hand-written HTML mixes `href="guide"` / `href="./guide"` / `href="/geohist/guide"`.
**Prevention:**
- Convention: directory links always with trailing slash; on a user site (`persano.github.io`), root-absolute paths (`/geohist/`, `/assets/site.css`) are safe and simplest — adopt them everywhere.
- Never rely on extension-less "pretty" links (`/geohist/faq`) — use real filenames (`/geohist/faq.html`) or `index.html` inside folders; Pages has no rewrite layer.
**Early warning sign:** Grep for `href="` values not starting with `/` or `#` and not ending in `.html`/`.css`/`.js`.
**Phase:** Site-build phase (link checker in CI can automate: validate all internal hrefs resolve 200 without redirect).

### Pitfall D5: 404 page with no context on deep links
**Symptom:** A stale screenshot link or a typo'd URL (`/geohist/guide/`) serves `404.html` — if that page's assets are referenced relatively or it lacks nav, visitors (and the Play reviewer!) hit a dead end.
**Why it happens:** Pages serves `404.html` (with HTTP 404) for *all* unknown paths, including deep ones; it's a full page load at the unknown URL, so relative asset paths resolve against the broken path.
**Prevention:** Self-contained root-absolute 404 page (own inline CSS or root-absolute asset URLs), links back to hub + GeoHist landing, correct `lang` default. Test `curl -I /nonexistent` (verified: returns 404 status) plus a browser visit.
**Early warning sign:** 404.html referenced as `./404-assets/…` in review.
**Phase:** Site-build phase (minor).

---

## E. SEO + Google Play policy

### Pitfall E1: SoftwareApplication rich-results blockage — the required `aggregateRating` trap
**Symptom:** Rich Results Test shows "Missing field aggregateRating" warning, or — if someone "fixed" it with an invented 4.9 — the site risks structured-data spam action.
**Why it happens:** Official requirements for the `SoftwareApplication` rich result: `name` + `offers.price` **and either `aggregateRating` or `review`**. GeoHist is brand-new: there are no ratings yet. Fabricating one violates Google's structured-data spam policies; omitting it means no rich result (only the required/recommended fields still serve normal SEO fine).
**Prevention:**
- Include `name`, `operatingSystem: "ANDROID"`, `applicationCategory: "GameApplication"`, `offers.price: 0` (free app — official: set price 0 when no payment), plus the Play Store URL once live.
- Skip `aggregateRating` until real Play ratings exist; add it (with real values) as a later task — it's the *correct* time to gain the rich result.
- Validate with Rich Results Test as the SEO phase's gate; treat "warnings" on rating as expected, "errors" as blockers.
**Early warning sign:** Any rating value in the JSON-LD that doesn't match the live Play listing.
**Phase:** SEO phase.

### Pitfall E2: Privacy-policy URL unreachable or mismatched at Play review time
**Symptom:** App update (or the initial listing, "in review" per PROJECT.md) rejected: "privacy policy link broken/unavailable," or Data safety section flagged for mismatch with declared SDKs.
**Why it happens:** Play requires an *active, accessible* privacy policy URL (valid SSL, reachable by reviewers) for apps that handle personal data, and the **Data safety** declarations must match actual SDK behavior. The site is a dependency of that review: if `persano.github.io` is mid-deploy, the GitHub Actions source is off, or `privacy.html` is missing when the reviewer clicks, the app bounces. Mismatch example: policy silent on AdMob/IAP while Data safety declares collected data; or site Analytics present but policy (B3) silent.
**Prevention:**
- Deploy the site **and** verify the exact `privacy.html` URL returns 200 *before* submitting/decoupling the Play listing; keep that URL stable forever (redirects are tolerated, 404s are not).
- Cross-check: every SDK named in Data safety (AdMob, Play Games Services, IAP, Firebase Analytics/Contact form) has a named paragraph in the policy; no policy paragraph describes an SDK that isn't integrated.
- Site contact form collects email/message → policy must state retention + purpose (ties to B3).
**Early warning sign:** `curl` the policy URL as a pre-submission checklist item; diff policy SDK list against the app's actual dependencies.
**Phase:** **First phase** (site must be live before Play submission) — this pitfall is the reason the site exists; treat the policy URL as a release dependency, not a page.

### Pitfall E3: Social/OG metadata that scrapers can't resolve
**Symptom:** WhatsApp/Twitter/Slack previews show no image, or the Play Store button's OG title falls back to "persano.github.io".
**Why it happens:** Relative `og:image` URLs (`content="assets/og.png"`) and images without absolute `https://` paths — scrapers do not resolve relative URLs; also OG image missing `width`/`height` causes some platforms to drop it.
**Prevention:** Absolute URLs (`https://persano.github.io/geohist/assets/og-cover.png`), `og:image:width/height`, `og:url` absolute, one description per page (the EN default for v1 per C2). Verify with a live fetch of the deployed page's `<head>`, not the local file.
**Early warning sign:** `<meta property="og:image" content="/…` in review.
**Phase:** SEO phase.

### Pitfall E4: Sitemap/robots drift after adding pages
**Symptom:** `sitemap.xml` lists only `/` forever; `robots.txt` contains a leftover `Disallow` from the Search-Console-verification era; the guide/FAQ pages never get indexed.
**Why it happens:** The repo already holds verification files (per PROJECT.md) — teams copy a robots.txt template that disallows more than intended, and sitemaps are hand-maintained in a no-build repo.
**Prevention:** Sitemap enumerates: `/`, `/geohist/`, `/geohist/guide.html`, `/geohist/privacy.html`; lastmod updated by the maintenance sessions; robots.txt = allow-all + sitemap line; CI validates internal links (D4) and sitemap URLs resolve 200.
**Early warning sign:** Search Console "Discovered - currently not indexed" for pages absent from the sitemap.
**Phase:** SEO phase.

---

## F. Accessibility (WCAG 2.1 AA audit)

### Pitfall F1: Dark "history-map" theme failing contrast — especially muted/parchment accents
**Symptom:** The explicit WCAG 2.1 AA audit (a PROJECT.md requirement) fails on: gray body text on dark background, low-opacity "vintage" parchment captions, placeholder text, link colors that differ from body only by hue.
**Why it happens:** Dark themes drift to 3.5–4:1 "moody" grays that fail AA. The thresholds: **4.5:1** for normal text, **3:1** for large text (≥24px, or ≥18.66px bold), and **3:1 non-text contrast** for UI borders/icons/focus indicators (SC 1.4.3 / 1.4.11). The aesthetic brief ("antique accents, map textures") actively pulls toward low-contrast text over busy textures.
**Prevention:**
- Decide the palette from contrast math, not taste: define CSS variables for ink/background pairs, verify every pair at 4.5:1 *before* styling pages.
- Never set text over texture without a solid overlay behind it.
- Include the *de facto* contrast traps: form placeholder text, disabled-button labels, footer fine print, and text over the map-texture hero.
**Early warning sign:** Any hand-picked hex pair not run through a contrast check; Lighthouse a11y score < 100 on the first audit run.
**Phase:** Visual-design decisions in the site-build phase; formal check in the a11y-audit phase (catch it in design, not in audit).

### Pitfall F2: Contact form label/field failures and outline-stripping
**Symptom:** axe/Lighthouse flags "form elements do not have associated labels", "links not distinguishable", focus invisible; keyboard users can't see where they are in the form; error states are color-only.
**Why it happens:** Dark-theme resets often include `* { outline: none }` or `outline: none` on `:focus`; visual design uses placeholder text *as* the label; the language switcher / select is custom-styled and loses semantics.
**Prevention:**
- `<label for>` on every input (name, email, message); `aria-describedby` for help + error text; errors announced (role/aria-live), not color-only.
- Never remove focus outlines without replacing them (`:focus-visible` styled ring at ≥3:1 against adjacent colors).
- Custom language select: keep a real `<select>` or add `role`/`aria-expanded` if bespoke.
**Early warning sign:** Running axe on the form *before* the a11y phase and seeing ≥1 critical; tab-through test where focus disappears.
**Phase:** Form build in the contact-form phase; audit gate in the a11y phase.

### Pitfall F3: Consent banner itself inaccessible (a11y × consent overlap)
**Symptom:** Banner traps keyboard focus, is announced late/never to screen readers, or the "Accept all" button is the only prominent target (dark-pattern + a11y failure); banner text fails contrast like any other text.
**Why it happens:** Consent banners are added last, styled ad hoc, and rarely included in the a11y audit scope.
**Prevention:** Banner = real buttons with labels, focus lands on it when shown, Escape/decline path exists, ≥4.5:1 text, no full-screen focus trap; test banner + axe in the consent phase, not only the a11y phase.
**Early warning sign:** Banner open + Tab key cycles nowhere sensible.
**Phase:** Consent phase (build right); re-verified in a11y phase.

---

## Phase-Specific Warnings

| Phase topic | Most likely pitfall | Mitigation anchor |
|---|---|---|
| Repo setup / first deploy | Missing `.nojekyll`; workflow artifact path | D1, D2 |
| Firebase contact form | Open-write rules, unauthorized-domain, anon-auth churn | A2, A4, A3 |
| Consent banner | Analytics-before-consent, non-persistent choice | B1, B2 |
| i18n | Auto-redirect, missing `lang` update | C1, C3 |
| SEO | Rating-trap in structured data, sitemap drift | E1, E4 |
| Privacy/content | Policy-SDK mismatch before Play review | E2, B3 |
| A11y audit | Dark-theme contrast, form labels | F1, F2 |

## Sources

- Firebase API keys (official, fetched): https://firebase.google.com/docs/projects/api-keys — HIGH
- Firestore Security Rules get-started (official, fetched): https://firebase.google.com/docs/firestore/security/get-started — HIGH
- Firebase Anonymous Auth web (official, fetched): https://firebase.google.com/docs/auth/web/anonymous-auth — HIGH
- Firebase App Check overview (official, fetched): https://firebase.google.com/docs/app-check — MEDIUM-HIGH
- Consent Mode v2 guidance (official, fetched): https://developers.google.com/tag-platform/security/guides/consent — HIGH
- Google multilingual/SEO guidance (official, fetched, updated 2025-12-10): https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites — HIGH
- SoftwareApplication structured data (official, fetched, updated 2025-12-10): https://developers.google.com/search/docs/appearance/structured-data/software-app — HIGH
- actions/deploy-pages README (official, fetched): https://github.com/actions/deploy-pages — HIGH
- GitHub Pages + Jekyll docs (official, fetched): https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll — HIGH
- **Live probes this session:** `persano.github.io` (`Cache-Control: max-age=600`, ETag, 404 behavior) and a real Pages site trailing-slash 301 — HIGH
- Google Play privacy-policy / Data-safety requirements — support article not fetchable this session (JS shell); restated from Play policy knowledge — **MEDIUM**
- WCAG 2.1 AA numeric thresholds (4.5:1 / 3:1) — w3.org fetch blocked (Cloudflare); restated from domain-standard knowledge — **MEDIUM**
