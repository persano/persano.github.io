# Pitfalls Research — v2.1 "Play Launch + Home Migration"

**Domain:** Adding features to a shipped, CI-gated, CI-enforced static GitHub Pages site (locked architecture: zero-build, single-URL keyed i18n, 178-key × 19 dictionaries, owner-gated flips, active GSC CoA window)
**Researched:** 2026-09-11
**Confidence:** HIGH for mechanics backed by first-party official docs (verbatim-fetched this session from Google Search Central, GitHub Docs, npm Docs, actions/setup-node — see Sources); MEDIUM for empirical GitHub Pages/Play Store behaviors; LOW where flagged for phase-time re-verification.

> Confidence note: the classify-confidence seam returns LOW for the `webfetch` provider class because it is URL-blind. Every HIGH-confidence claim below was verified by quoting official first-party documentation live this session, with the URL and doc-date cited. This is the strongest provenance available and is tagged accordingly; community/empirical claims are tagged MEDIUM and assumptions LOW.

---

## Critical Pitfalls

### Pitfall 1: Moving `privacy.html` while the Play listing is in review — the privacy-URL coupling

**What goes wrong:**
Home migration relocates pages, someone "helpfully" moves `geohist/privacy.html` to `/privacy.html` (or to the new landing root) as part of the move. The Play Console privacy-URL field — set (or about to be set) to `https://geohisttrivia.com/geohist/privacy.html` — now points at a 404 or a redirect. Google Play reviewers hitting a dead privacy policy is a classic rejection/delay cause, and the field update is an *owner console step* that can be forgotten for weeks.

**Why it happens:**
The migration looks like a pure URL-plumbing exercise; the Play Console field is a cross-system dependency living outside the repo, invisible to every gate in this project. The 180-day GSC window also creates a false sense that "URLs are in flux anyway."

**How to avoid:**
- **Do not move `geohist/privacy.html` in v2.1.** It is the compliance surface for the app in active review. Declare its URL frozen this milestone; run the root migration around it.
- If a future move is ever approved: runbook order is (1) ship new URL + 301-equivalent stub at old URL, (2) owner updates the Play Console field, (3) only after field verified, old stub may remain permanently (never delete it — Play Console links have no expiry).
- The launch-kit runbook's flip order (privacy-URL field → Play link swap → rating row) already implies the field edit comes first; the pitfall is doing the *migration* first and breaking the target the field points at.

**Warning signs:**
`curl -I` on the privacy URL returning 301/404 after a deploy; Play Console review status going "In review" longer than usual; any diff touching `geohist/privacy.html`'s path in the migration commit.

**Phase to address:** Home migration phase — freeze rule stated in plan; launch-kit phase — verification step in runbook.

---

### Pitfall 2: Dropping old `/geohist/*` paths to 404 — breaking the legacy-host 301 chain

**What goes wrong:**
The migration deletes `geohist/index.html` (and optionally the whole dir) and puts the landing at root. GitHub Pages then serves `404.html` with HTTP 404 for every old path. But the legacy `*.github.io` Pages host **301s path-preserved** to the apex: any indexed legacy URL now resolves `legacy-host/geohist/` → 301 → `geohisttrivia.com/geohist/` → **404**. Redirect chains that terminate in 404 transfer nothing; Google drops those URLs without passing signals, and any bookmark, screenshot, or Play-listing link pointing at the old path dies. Per official Google site-move guidance, old URLs must redirect, not vanish ("not updating sitemaps / broken redirects" are listed migration mistakes).

**Why it happens:**
"Moving to root" is mentally coded as "old location is gone." On a server host you'd add a 301 rewrite; GitHub Pages has **no server config** (no `.htaccess`, no `nginx.conf`), and `.nojekyll` rules out the Jekyll redirect template. The official redirect ladder (Google "Redirects and Google Search", upd. 2026-08): server 301/308 → **instant meta refresh (0s) = treated as a permanent redirect** → JS redirect = last resort only. GitHub serves exactly one root `404.html` for all missing paths (official GitHub Docs; no per-directory 404s), so a dynamic 404-based JS redirector is the *weakest*-tier mechanism available.

**How to avoid:**
- **Static instant meta-refresh stubs at the old paths.** Recreate `/geohist/index.html` (and any other moved path) as a ~15-line stub: `<meta http-equiv="refresh" content="0; url=/">` plus a real link, `<meta name="robots" content="noindex">`, and a `<link rel="canonical">` to the NEW URL. Google officially interprets instant (0s) meta refresh as a permanent redirect — the only first-party-sanctioned substitute for 301 on this host.
- Old paths that move must exist as stubs; old paths that *stay* (privacy.html per Pitfall 1) need nothing.
- The 404.html JS redirector (`location.pathname` mapping) is acceptable as a **safety net** for unknown legacy paths, never as the primary mechanism (Google: JS redirects are last-resort; the 404 page is served with HTTP 404 status, so it is treated as a soft-404, not a redirect, for ranking).
- Keep stub count minimal and enumerable: the old `/geohist/` section root is the main indexed URL (plus the 5 sitemap URLs).

**Warning signs:**
GSC old-property URL inspection showing "Submitted URL not found (404)" after the migration deploy; legacy-host URLs in GSC URL inspection; link-checker reports on `/geohist/` going red; site:somequery showing old URLs.

**Phase to address:** Home migration phase — stub files are a plan deliverable, not an afterthought; GSC monitoring task in the same phase verifies decay, not 404 spikes.

---

### Pitfall 3: Double indexation — copying the landing to root while keeping `/geohist/` serving full content

**What goes wrong:**
To "keep old URLs working," the landing is **duplicated**: full content at root AND full content at `/geohist/`, both self-canonicalized. Now two URLs serve identical content with competing canonicals. Google picks one arbitrarily; the sitemap (which currently lists both `/` and `/geohist/`) actively tells the crawler both are real; og:url drift follows; link equity splits; and Analytics `play_badge_click` etc. fragment across two page paths.

**Why it happens:**
Confusion between "keep working" (redirect) and "keep serving" (duplicate). Canonical-to-root in the copy would be defensible, but the shipped pages self-canonicalize (`/geohist/` canonical on line 8 of `geohist/index.html`), so a careless copy is self-canonical duplicate.

**How to avoid:**
- **One canonical URL per page: root.** Old paths become meta-refresh stubs (Pitfall 2), never full copies.
- Sitemap lists **only final URLs**: `/`, `/geohist/guide.html` (if kept), `privacy.html`, `contact.html`, `changelog.html`, `/apps/`. Never list redirect stubs. Remove `/geohist/` from the sitemap in the same commit as the move (single atomic commit, per the repo's one-commit-migration precedent from Phase 8).
- Resubmit the sitemap in GSC after deploy; expect old-URL sitemap "redirecting" warnings — official docs say these are normal during a move.

**Warning signs:**
Two URLs with HTTP 200 + identical `data-i18n` surfaces; Coverage report showing both "Duplicate, Google chose different canonical" and "Alternate page with proper canonical tag"; sitemap containing a URL that emits `content="0; url=..."`.

**Phase to address:** Home migration phase — sitemap rewrite + stub-not-copy rule in the plan's verification checklist.

---

### Pitfall 4: URL-annotation drift — canonical/og:url/JSON-LD/og-image/favicon/sitemap/404 links all hardcode absolute URLs

**What goes wrong:**
Every page hardcodes absolute URLs in at least seven places: `<link rel="canonical">`, `og:url`, JSON-LD (`url`, `image`, `screenshot`), `og:image`, favicon links, footer links, and `sitemap.xml`. The repo migrated 44 URLs in one commit for the *domain* change; the *path* change has the same surface, plus new failure modes: root landing's `og:image` still pointing at `/geohist/og-image.png` (fine if assets stay), JSON-LD `"url": "https://geohisttrivia.com/geohist/"` stale (it must become `/`), JSON-LD `screenshot` paths, the 404 page's links, and `robots.txt` Sitemap line. Drift means: social previews resolving wrong, structured data describing a URL that now redirects, and the Rich-Results-eligible `SoftwareApplication` losing coherence.

**Why it happens:**
The pages were *written* with absolute URLs (deliberately — it makes pages location-independent for serving, which is why the CSS/JS `href="/css/base.css"` / `DICT_URL_PREFIX = '/js/i18n/'` will NOT break in the move; the trap is believing "relative paths will break" applies here — it doesn't — and missing that the annotation *layer* is the real work).

**How to avoid:**
- Inventory-first: enumerate every absolute-URL literal per file (`rg -n 'https://geohisttrivia.com' *.html geohist/*.html scripts/ sitemap.xml robots.txt`) before editing; the migration commit touches each in one atomic pass (Phase-8 precedent: one commit = one revert = rollback).
- After deploy: smoke-check the served HTML (not just status codes) — assert canonical == serving URL for each page, JSON-LD parses and `url` == new canonical, og:image 200s.
- `app-ads.txt` and `favicon.ico` are path-independent at root — verify but don't churn.

**Warning signs:**
Rich Results Test on the root page reporting the structured data item is "on a page that is not the item URL"; og:url ≠ canonical; linkinator passes while canonical text is stale (linkinator only checks link liveness, not canonical correctness).

**Phase to address:** Home migration phase — annotation inventory as an explicit plan task with per-file assertions in smoke-check.

---

### Pitfall 5: The five hardcoded page-path lists — gates either go red or silently skip the new layout

**What goes wrong:**
`validate:html` glob (`index.html 404.html geohist/*.html`), `scripts/i18n-keycheck.mjs` `pages` array (line 48, plus the star-gate's direct `readFileSync(join(repoRoot, 'geohist', 'index.html'), ...)`, line 184), `scripts/i18n-surface.mjs` `pages` array (line 32), `scripts/a11y-audit.mjs` URL table (`/geohist/`, `/geohist/guide.html`, ...), and `scripts/smoke-check.sh` URL list all **hardcode the v2.0 layout**. After a move: `readFileSync` on a vanished path throws → CI red (fail-closed, but confusing); worse, a *new* page (e.g. `/apps/index.html` carrying keyed hub chrome) added without updating the keycheck page list is **silently outside the set-equality surface** — its keys aren't checked, its drift isn't caught, and the "178-key exact surface" invariant quietly stops being true.

**Why it happens:**
Zero-build repo with node-builtin scripts — no config file centralizes the page list; each script embeds its own. Five separate lists is five chances to miss one.

**How to avoid:**
- The migration plan must enumerate all five touchpoints as one task: update `pages` arrays + `validate:html` glob + a11y audit URLs + smoke-check URLs **in the same commit** as the file moves, then red-gate prove (mutate a key → gate FAIL → restore → PASS), per repo convention.
- Consider a tiny shared `scripts/pages.mjs` exporting the canonical page list, imported by both keycheck and surface (node built-ins only, zero deps) — one list to update forever after. Not required, but it kills this pitfall class.
- Key namespaces stay **logical, not path-derived**: `hub.*` keys keep their names even though the hub page moves to `/apps/`. Renaming `hub.*` → `apps.*` means an atomic rewrite of keys across 19 dictionaries + markup + keycheck expectations for **zero user-visible benefit**. Keys are IDs, not URLs.

**Warning signs:**
CI red with ENOENT on a script that "worked yesterday"; keycount in the keycheck summary changing (178 → other) without an intentional key change; a11y audit covering fewer pages than exist.

**Phase to address:** Home migration phase — one dedicated plan task "update all gate page lists + red-gate proof."

---

### Pitfall 6: GSC Change-of-Address misapplication during a same-domain path move

**What goes wrong:**
Two failure directions. (a) Assuming the active CoA (old host → geohisttrivia.com, 180-day window until ~2027-03) somehow "covers" the path move and doing nothing — correct *partially*: CoA is domain-scoped only (official docs: "You only need this tool when moving from one domain or subdomain to another... You don't need it for HTTP to HTTPS moves, switching between www and non-www, or **moving paths within the same domain**"), so the path move needs its OWN mechanics: redirects + updated sitemap + resubmission (Pitfalls 2/3). (b) The worse error: **filing a second CoA** for the path change — GSC's CoA is domain→domain; a same-domain re-file is at best rejected, at worst replaces/confuses the active window, and the repo deliberately monitors index decay on the retained old property through ~2027-03.

**Why it happens:**
"Migration" + "GSC" + "Change of Address" pattern-match to each other. The v2.0 Phase-8 CoA is fresh in memory and becomes the wrong template.

**How to avoid:**
- Runbook states it verbatim: **path moves within geohisttrivia.com use redirects + sitemap only. Do NOT open the Change of Address tool. Do NOT touch the active 180-day window.**
- GSC actions for the path move: submit updated sitemap on the Domain property; monitor the retained old property for decay (unchanged practice); optionally use URL Inspection on migrated URLs.
- Keep the old-property retention monitoring task alive; it is now ALSO the early-warning surface for stub mistakes (404 spikes instead of decay).

**Warning signs:**
Any plan or doc step saying "file CoA" outside the domain-move context; GSC CoA panel showing a replaced/canceled request; Coverage 404 spike on the *new* property for `/geohist/*` URLs.

**Phase to address:** Home migration phase — explicit "do not file CoA" guard-rail in the runbook; GSC monitoring carried as watch-only task.

---

### Pitfall 7: The launch-day "rationalization flip" — adding `aggregateRating` because "Software App is a supported review-snippet type"

**What goes wrong:**
Play goes live, real ratings appear, and an agent (or the owner) sees that Google's review-snippet docs **do list "Software App" as a supported type** and adds `"aggregateRating": {"ratingValue": 4.x, "ratingCount": n}` with Play numbers to the JSON-LD. That is a **structured-data policy violation even with real data**: the official policy (doc updated 2026-09-08) says *"Don't aggregate reviews or ratings from other websites"* — Play ratings are another website's ratings sourced on this site, and there is no on-site review source. Consequence class: structured-data manual actions / rich-result ineligibility, exactly the spam signal the repo's Tier-2 decision was built to avoid. The shipped state is a locked decision: Tier-2 `aggregateRating` is **permanently OFF** via an inert comment; only a genuine on-site review source can ever unlock it.

**Why it happens:**
The docs' support for Software App review snippets is *half*-true and reads like permission. The inert in-file comment exists precisely to stop future-agent rationalization — an edit to `geohist/index.html` during the JSON-LD refresh task is the moment it can be overridden.

**How to avoid:**
- Launch-kit runbook: the JSON-LD "refresh check" is verification ONLY (offers block present, `price: "0"` string, priceCurrency USD, Rich Results Test clean). The aggregateRating block stays commented-out-inert. Copy the policy citation into the runbook.
- The star-uniqueness CI gate already fails closed if ★ appears in any dictionary or markup — do not weaken it.
- Tier-1 visible rating row flip is the sanctioned surface: 2-edit flip per `10-RUNBOOK.md` (remove `hidden`, replace the self-flagging `0.0` span with the real score), gated on real visible Play data (no minimum floor). Include in the runbook: decimal **dot** format (4.4, never 4,4), keep exactly ONE `proof-row-star` SVG, keep the attributed `rel="noopener"` Play link.

**Warning signs:**
Any diff introducing `aggregateRating` into markup or a runbook; a translated dictionary value or HTML containing U+2605; Rich Results Test suddenly reporting a review-snippet candidate.

**Phase to address:** Launch-kit phase — runbook hard-cites the policy; code-review of the flip task checks for the anti-pattern.

---

### Pitfall 8: The Play link swap is invisible to CI — linkinator skips `play.google.com`

**What goes wrong:**
Placeholder Play links exist in at least three places (hero badge CTA, features-section link, JSON-LD `sameAs`) — all pointing at `https://play.google.com/store/apps/details?id=com.persano.geohisttrivia`, which 404s (or shows "not found") until the listing is live. On launch day the swap happens — and because `validate:links` **skips play.google.com** (deliberately, so the placeholder passes CI), a swapped URL with a typo'd package id, wrong domain (`play.google.com/store/apps/details?id=...&hl=` experiments), or an http:// scheme ships green and uncaught. First-day users click the badge into a 404 — the exact day the site gets its traffic peak.

**Why it happens:**
The skip rule exists for a good pre-launch reason and is forgotten at the moment it matters. No gate asserts link *correctness*, only liveness of the rest of the site.

**How to avoid:**
- Add a package-id assertion to the old-domain gate script (or a new tiny check): every `play.google.com` URL in tracked files must contain `details?id=com.persano.geohisttrivia` (and https scheme). That check passes BOTH before and after launch (URL shape is identical; only liveness changes) — zero-maintenance permanent gate.
- Runbook launch-day step: after the owner confirms listing live, verify the URL in a real browser, then swap; smoke-check script gains an optional post-launch target check.
- The flip order in the runbook (privacy field → link swap → rating row) exists because each flip depends on the previous being verifiable; keep that order intact.

**Warning signs:**
`rg 'play\.google\.com' geohist/ index.html` returning URLs with query params or missing the full package id; CI staying green while the badge 404s (expected pre-launch, alarming post-launch).

**Phase to address:** Launch-kit phase — assertion gate + runbook verification step; swap itself is owner-gated.

---

### Pitfall 9: Restoring `npm ci` + `cache: npm` — lockfile generation is blocked locally and the cache input has preconditions

**What goes wrong:**
Three stacked traps. (a) **Lockfile can't be generated locally**: the local npm CLI is proxy-broken (documented in `deploy.yml`'s own comment), so `npm install --package-lock-only` on the dev machine may fail or produce a partial lock. (b) **cache: npm hard-requires a committed lockfile**: setup-node's `cache: 'npm'` hashes `package-lock.json` at repo root — with no lockfile the workflow errors at the setup step (official README; the action searches for the lockfile and fails without it). Note also setup-node v5+ auto-enables npm caching only when `package.json` has a `packageManager`/`devEngines.packageManager` field — absent here — so the explicit `cache: 'npm'` input is required. (c) **Version drift**: lockfile generated under one npm version carries a lockfileVersion (v3 for npm 11 / Node 24); `npm ci` **exits with error on any package.json ↔ lockfile mismatch** (official npm docs — fail-closed, never silently updates). A lockfile committed from Node 18 (npm 9, v3 but different structure edge cases) or generated with `--legacy-peer-deps` will red every subsequent CI run with confusing EUSAGE errors.

**Why it happens:**
The cleanup reads as two-line diff (`npm install`→`npm ci`, add cache input) but is actually a dependency-tree freeze: 5 exact-pinned devDeps hide hundreds of **unpinned transitives** — which is precisely the current supply-chain hole: today's `npm install` (no lockfile) re-resolves the full tree from registry metadata on *every* CI run; a compromised transitive version publishes and the next deploy validates through it.

**How to avoid:**
- Generate the lockfile in CI itself (one-off run of `npm install --package-lock-only` as a workflow_dispatch step, or locally on a network that can reach the registry), verify it's `lockfileVersion: 3`, commit it, THEN flip to `npm ci` + `cache: 'npm'` in a separate commit — so a red CI is attributable.
- `sharp` uses platform-specific optional deps (`@img/sharp-*`) — the lockfile records all platforms; verify CI (linux) installs cleanly before trusting it.
- Going forward, any `npm install <pkg>` locally must be followed by committing the updated lockfile in the same atomic commit — otherwise the very next `npm ci` fails (this is the designed protective friction).
- npm 11 offers `allow-scripts` / `strict-allow-scripts` — optional hardening, not required for this validate-only dependency set; exact pins + lockfile are the substantive fix.

**Warning signs:**
CI log "npm ci can only install with an existing package-lock.json"; setup-node step erroring "Dependencies lock file is not found"; lockfile diff noise on every dependency-touching commit; `cache: npm` silently doing nothing (check the post-run cache step exists).

**Phase to address:** Cleanup phase — two-commit chore with red/green verification of the full validate chain in CI, not locally.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Rename `hub.*` i18n keys to `apps.*` "for consistency" with the new path | Feels cleaner | Atomic key rewrite across 19 dictionaries + keycheck expectations + markup; pure churn, red CI risk | Never — keys are logical IDs |
| JS `location.pathname` redirector in 404.html as the ONLY old-path mechanism | One file handles everything | Google treats 404-served JS redirects as last-resort; soft-404 signal; no permanent-redirect equivalence | Only as safety net behind meta-refresh stubs |
| Leaving `/geohist/` as a full duplicate with root canonical | Zero breakage day one | Split signals, Analytics fragmentation, permanent maintenance duality | Never — stubs instead |
| Keeping `npm install` in CI "until things settle" | No lockfile to babysit | Unpinned transitives re-resolved every run = open supply-chain hole | Never (post-cleanup-phase) |
| Moving `privacy.html` while "also touching the Play Console field later" | Tidier URL tree | Review-window 404; owner console step forgotten | Never this milestone |
| Adding `lastmod` to sitemap during the rewrite | Feels more "SEO complete" | Every edit becomes a sitemap edit; stale lastmod is worse than none | Never (repo convention: no lastmod) |
| Folding AGENTS.md layout updates into "later" | Faster migration commit | AGENTS.md self-referentially enforced by CI gate describes the OLD layout — doc rot misguiding every future agent | Never — same-milestone doc update |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GSC Change of Address | Filing/re-filing CoA for a same-domain path move; touching the active 180-day window | Path moves = redirects + sitemap resubmit only; CoA untouched until ~2027-03 decay monitoring ends |
| GSC sitemap | Editing sitemap without resubmitting; leaving `/geohist/` in sitemap while it's a stub | Atomic sitemap rewrite + explicit resubmit step; never list stub/redirect URLs |
| Google Play Console | Privacy field edited after submission already in flight; website field pointing at the hub during review | Field order in runbook (privacy URL first); root-after-migration serves the landing, which is the intended listing website |
| Google Play listing URL | Assuming URL works before listing public; adding `hl=`/`gl=` params on a whim | Canonical `https://play.google.com/store/apps/details?id=<package>`; unverified package → not-found page (MEDIUM: empirical behavior); package-id assertion gate in CI |
| GitHub Pages | Expecting per-directory 404s, .htaccess, or 301-on-path-rename | Single root 404.html (HTTP 404); meta-refresh 0s stubs = sanctioned permanent redirect; GitHub's own 301s (domain redirect, trailing-slash/index normalization) are the only server-side redirects available |
| GitHub Actions npm cache | `cache: 'npm'` without lockfile; assuming auto-cache (requires packageManager field) | Lockfile committed first; explicit `cache: 'npm'` input; verify cache step in run log |
| Firebase (unchanged surface) | "Fixing" consent/contact/App Check paths during migration | Fork-shaped loading, submit-path App Check, create-only rules are LOCKED; the migration touches markup URLs only — zero JS-module changes expected |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Writing the App Check evidence helper with console screenshots, project keys, or "create-only rules mean anyone can write" phrasing into `.planning/` | `.planning/` ships in the Pages artifact AND is crawlable (robots.txt is `Allow: /`) — secret material becomes permanently public + indexed | Console-UI instructions only (click-paths, not credentials); review diff with "would I publish this?" test; note: consider a `Disallow: /.planning/` line in robots.txt as a deliberate roadmap decision (keeps files served, blocks indexing) |
| Mentioning the legacy host literal in any new doc (including this caveat) | `check-no-old-domain.mjs` fails the whole validate chain — it scans ALL tracked text files, AGENTS.md included | Phrase as "legacy `*.github.io` Pages host"; the gate is permanent CI law |
| Treating the Play listing URL as safe to embed with arbitrary params pre-launch | Placeholder URL structure becomes launch-day truth; params leak/referral noise | Fixed canonical URL, assertion-gated |
| Weakening the star-uniqueness or CJK punctuation gates to make a flip pass | Fail-closed invariants rot; structured-data spam surface reopens | Red-gate proof protocol: mutate → FAIL → restore byte-identical → PASS, recorded |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Launch-day badge → Play 404 (listing live before site swap, or typo) | First-peak traffic bounces off the hero CTA | Runbook verification step + post-swap badge click test; Analytics `play_badge_click` as a canary |
| `/apps/` hub missing the language switcher slot or `i18n.js` include | 19-language visitors get EN-only hub after being used to localized chrome | Hub page ships with full keyed-chrome parity (switcher slot, consent link, `hub.*` keys kept); a11y audit covers `/apps/` |
| Urdu Nastaliq rendering untested on real Android device | System fallback renders Naskh-like or clipped diacritics; per-language line-height overrides may not survive the keyless-font environment | Cleanup-phase real-device check (documented owner task); verify `dir="rtl"` flip + line-height on ur, not just ar |
| zh dictionary assumed to cover Traditional-Chinese readers | zh = one variant (Simplified-flavored generic); app localization set may imply more | Cleanup-phase zh variant confirmation against the app's `strings.xml` locales; document the mapping; do NOT add zh-TW dictionaries unprompted (surface explosion ×19 → ×20) |
| Landing copy edited at root during migration without dictionary sync | Keyed nodes show stale/mismatched translations; keycheck red | Any EN-baseline copy change = same-commit update to all 19 dictionaries (two-pass draft + length check per repo convention) |

## "Looks Done But Isn't" Checklist

- [ ] **Root migration:** Often missing stub files for old paths — verify `/geohist/` returns 200 stub with instant meta refresh + canonical to `/`, and legacy-host chain (old host → apex) never terminates in 404
- [ ] **Root migration:** Often missing the five gate-list updates — verify keycheck summary still reports the exact key count, validate:html globs the new layout, a11y audit + smoke-check URL tables updated, all in the migration commit
- [ ] **Root migration:** Often missing JSON-LD `url` + `screenshot` array update — verify Rich Results Test on `/` passes and `url` == served canonical
- [ ] **Sitemap:** Often missing GSC resubmit — verify Sitemap report shows Success with the new URL set, zero stub URLs listed
- [ ] **Launch kit:** Often missing the privacy-field-first flip order — verify runbook numbers the flips and each has a verification method
- [ ] **Launch kit:** Often missing the package-id assertion — verify a gate fails on a mutated Play URL (red-gate proof recorded)
- [ ] **npm ci restore:** Often missing the lockfile commit BEFORE the workflow change — verify CI log shows `npm ci` + cache hit, and lockfile is v3
- [ ] **App Check evidence doc:** Often missing the no-secrets review — verify doc contains click-paths only; `npm run validate` green (old-domain gate passes)
- [ ] **AGENTS.md:** Often missing layout-update parity with the migration — verify AGENTS.md describes root-landing reality the same commit the layout ships

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Broken privacy URL during review | MEDIUM | Restore path immediately (one-commit revert precedent); owner re-checks Play Console field; monitor review status |
| Old paths 404 after migration shipped | LOW | Ship meta-refresh stubs in a follow-up commit; resubmit sitemap; GSC Coverage confirms re-crawl |
| Double indexation already live | MEDIUM | Convert duplicate to stub with canonical-to-root; resubmit; expect weeks-scale consolidation (official doc) |
| CoA accidentally re-filed | HIGH | No un-do in GSC: re-verify properties, re-request if tool permits; fall back to redirect + sitemap mechanics; document in planning with supersession note |
| aggregateRating shipped | HIGH | Revert to inert-comment state; check GSC manual-actions/spam report; document incident + policy citation |
| Bad Play link swapped | LOW | One-line fix + package-id gate prevents recurrence; Analytics confirms badge clicks recover |
| Lockfile committed wrong / ci red | LOW | Regenerate lockfile (CI step or network-fixed machine); commit; npm ci errors are fail-closed so nothing shipped broken |
| Secret leaked in .planning/ doc | HIGH | Delete + history rewrite is insufficient for Pages snapshots: rotate the exposed credential console-side; add no-cache/noindex decision note |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1 Privacy-URL coupling | Home migration (freeze rule) + Launch kit (runbook) | `curl -I` privacy URL = 200 post-deploy; runbook flip 1 documented |
| 2 Old-path 404 / legacy chain | Home migration | Stub 200 + meta refresh verified; GSC old-property shows decay not 404s |
| 3 Double indexation | Home migration | Sitemap has zero stubs; one canonical per page; Coverage clean |
| 4 Annotation drift | Home migration | smoke-check asserts canonical/og:url/JSON-LD per page |
| 5 Hardcoded gate lists | Home migration | Keycheck key-count stable; red-gate proof recorded; validate green |
| 6 CoA misapplication | Home migration | Runbook "do not file CoA" guard; CoA window untouched in GSC |
| 7 aggregateRating flip | Launch kit | Inert comment intact; Rich Results Test clean; star gate green |
| 8 Play link swap | Launch kit | Package-id assertion red-gate proven; post-swap badge test |
| 9 npm ci restore | Cleanup | CI: `npm ci` + cache hit green; lockfile v3 committed first |
| Public docs hygiene | All v2.1 phases | Old-domain gate green; no-secrets review on every `.planning/` diff |
| RTL/zh/Urdu device checks | Cleanup | Owner device checklist with recorded results |

## Sources

- **Google Search Central — "Redirects and Google Search"** (developers.google.com/search/docs/crawling-indexing/301-redirects; doc upd. 2026-08): meta refresh 0s = permanent-equivalent; delayed = temporary; JS redirect last resort. HIGH (first-party, quoted verbatim this session).
- **Google Search Central — "Move a site with URL changes"** (developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes; doc upd. 2026-08-20): CoA scope = domain/subdomain only; same-domain path moves excluded; "not updating sitemaps" listed as migration mistake; sitemap-resubmit mechanics. HIGH.
- **Google Search Central — "Review snippet (Review, AggregateRating) structured data"** (developers.google.com/search/docs/appearance/structured-data/review-snippet; doc upd. 2026-09-08): "Don't aggregate reviews or ratings from other websites"; Software App is a supported type; self-serving/ratings-sourced-directly-from-users rules. HIGH.
- **GitHub Docs — "Creating a custom 404 page for your GitHub Pages site"** (docs.github.com): single root 404.html serves all missing paths; no per-directory 404s. HIGH.
- **npm Docs — `npm ci`** (docs.npmjs.com/cli/v11/commands/npm-ci): lockfile required, mismatch = hard error, never writes, npm 11 allow-scripts policy. HIGH.
- **actions/setup-node README** (github.com/actions/setup-node, main): `cache: 'npm'` requires lockfile; v5+ auto-cache gated on `packageManager` field; caches global data not node_modules. HIGH.
- **Repo facts** (read this session): sitemap.xml (6 URLs incl. both `/` and `/geohist/`), 404.html (noindex, absolute links), all 6 keyed/EN pages' canonical+og:url lines, JSON-LD block (`url`/`sameAs`/`offers.price:"0"`/screenshot paths), keycheck/surface `pages` arrays (lines 48/32), star-gate `readFileSync('geohist/index.html')` (line 184), a11y-audit + smoke-check URL tables, deploy.yml (`npm install`, no cache, Node 24, proxy-broken local npm comment), package.json (exact pins, no lockfile, no packageManager field), `DICT_URL_PREFIX='/js/i18n/'` (absolute — i18n fetch is move-safe), i18n.js RTL same-pass dir flip, key namespace census (index.* 91, guide.* 82, contact.* 68, geohist.* 61, changelog.* 38, consent.* 15, hub.* 11), robots.txt (`Allow: /` — `.planning/` crawlable), app-ads.txt. HIGH (direct file reads).
- **MEDIUM (empirical, verify at phase time):** unpublished Play package URL → not-found page; setup-node error wording on missing lockfile; GSC re-filing-CoA cancellation semantics (docs don't specify replacement behavior — treat re-filing as forbidden rather than attempting to learn).
- **LOW (flagged for phase-time re-verification):** Windows rendering of Urdu Nastaliq fallbacks; zh variant mapping against the app's `strings.xml`; whether Play Console website-field acceptance tolerates a redirecting URL (avoid by not redirecting the listing-linked URL).

---
*Pitfalls research for: v2.1 Play Launch + Home Migration — adding features to the locked v2.0 Persano/GeoHist static site*
*Researched: 2026-09-11*
