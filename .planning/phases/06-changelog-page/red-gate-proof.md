# Phase 6 Plan 06-01 — Red-Gate Proof Record

**Proven:** 2026-09-05, locally, without ever committing a red state (research Pattern 3).
**Gate:** `node scripts/i18n-keycheck.mjs` (exact set-equality, union surface) + `npm run validate:links`.
**Surface at proof time:** 169 keys (146 pre-Task-2 + 23 new), es.json 169, pt-BR.json 169.

Each cycle: mutate → run → observe FAIL (exit 1) → revert → re-run → observe PASS (exit 0).

---

## Cycle (a) — Missing-keys direction (markup ahead of dictionaries)

- **Mutation:** added a probe swap key to a chrome node in `geohist/changelog.html` (`<time datetime="2026-09-04" data-i18n="changelog.probe.missing">`), dictionaries untouched.
- **Command:** `node scripts/i18n-keycheck.mjs`
- **Observed (FAIL):**

  ```
  i18n-keycheck: FAIL — es.json (surface 170 keys, dictionary 169 keys)
    missing keys (1): changelog.probe.missing
  i18n-keycheck: FAIL — pt-BR.json (surface 170 keys, dictionary 169 keys)
    missing keys (1): changelog.probe.missing
  i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above
  ```

  Exit code: **1**. The probe key is named as missing in BOTH dictionaries — a dictionary missing changelog keys fails CI.
- **Revert:** removed the probe attribute → PASS: `i18n-keycheck: PASS — es.json exactly covers the 169-key live surface` / same for pt-BR.json / `i18n-keycheck: OK`, exit 0.

## Cycle (b) — Extra-keys direction (dictionaries ahead of registered pages)

- **Mutation:** removed `join('geohist', 'changelog.html')` from the `pages` array in `scripts/i18n-keycheck.mjs` (line 22) — dictionaries now exceed the union surface.
- **Command:** `node scripts/i18n-keycheck.mjs`
- **Observed (FAIL):**

  ```
  i18n-keycheck: FAIL — es.json (surface 152 keys, dictionary 169 keys)
    extra keys   (17): changelog.back.link, changelog.footer.back, changelog.footer.changelog, changelog.footer.consent, changelog.footer.contact, changelog.footer.copyright, changelog.footer.privacy, changelog.intro, changelog.meta.desc, changelog.meta.title, changelog.nav.aria, changelog.nav.changelog, changelog.nav.faq, changelog.nav.game, changelog.nav.guide, changelog.nav.privacy, changelog.title
  i18n-keycheck: FAIL — pt-BR.json (surface 152 keys, dictionary 169 keys)
    extra keys   (17): <same 17 keys>
  i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above
  ```

  Exit code: **1**. An unregistered page (its keys orphaned in the dictionaries) fails CI — the extra direction.
- **Revert:** restored the `pages` array entry → PASS at 169 keys both dictionaries, exit 0.

## Cycle (c) — Link direction (dead nav href)

- **Mutation:** pointed the Guide nav Changelog anchor at a nonexistent path (`href="/geohist/changelog-probe-404.html"`).
- **Command:** `npm run validate:links`
- **Observed (FAIL):**

  ```
  [404] geohist\changelog-probe-404.html
  ERROR: Detected 1 broken links. Scanned 19 links in 0.12 seconds.
  ```

  Exit code: **1**. A dead Changelog nav link fails link validation.
- **Revert:** restored `href="/geohist/changelog.html"` → `✓ Successfully scanned 18 links`, exit 0.

## Deviation found during proof (Rule 3 fix, included in Task 3 commit)

`package.json` `validate:links` used `--skip "^https?://(?!persano.github.io)"`. Under the pinned `linkinator@8.1.0`, that lookahead-regex skip flag makes the scan report **0 links** and exit 0 — the link gate was **vacuous** (scanned nothing, always passed, since the devDep was bumped to 8.x). Directory crawl (`linkinator . --recurse`) itself works correctly: it starts a local server rooted at the repo, resolves root-absolute paths, and fails non-zero on 404s.

- **Fix:** replaced the broken skip flag with plain-string skips (`https://persano.github.io` self-references, `play.google.com`, `policies.google.com`, plus `planning` / `node_modules` safety skips). Live self-URLs are covered by `scripts/smoke-check.sh` post-deploy instead.
- **Verification:** broken probe href → `ERROR: Detected 1 broken links` exit 1; restored state → 18 links all [200] exit 0.

## Post-revert cleanliness

`git status` on `geohist/changelog.html`, `geohist/guide.html`, `scripts/i18n-keycheck.mjs`: no modifications — probe key and broken href absent, pages array intact.

## Final green battery

- `node scripts/i18n-keycheck.mjs` → PASS both dictionaries, exit 0 (169-key surface).
- `npm run validate` (html + links + i18n) → exit 0.

`validate:html` covers `geohist/changelog.html` purely via its existing `geohist/*.html` glob — no script edit needed (confirmed every task).
