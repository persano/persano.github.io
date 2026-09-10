# Phase 10 Owner Runbook — Rating Row Flip (Tier-1) + Permanent Schema Rule (Tier-2)

**Audience:** Santiago (owner). The only code surface you ever touch is `geohist/index.html` (two tiny edits, §2) plus browser tools you already use. Agent-owned steps (validation chain, deploys, prod smoke) are listed for cross-reference only.

**Public-artifact notice:** this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI and local-file instructions only: **no secrets, no tokens, no credentials anywhere in this file.**

**Status legend:** ✅ done (agent-verified this session) · ⬜ TODO (yours, when the gate passes) · 🔍 soft check (nice-to-have, non-blocking)

---

## §0 · Current state (as of the Phase 10 ship, 2026-09-09)

| # | Surface | Live state | Status | Owner action |
|---|---------|-----------|--------|--------------|
| 1 | Facts strip (`proof-strip`) between hero and features | Live — 4 keyed stat pills (20 languages / play offline / History + Geography / Android 7.0+), translated in all 20 languages | ✅ | none |
| 2 | Tier-1 "Rated ★ on Google Play" row | Ships **OFF** — `<div class="proof-row" hidden>` sits directly under the hero Play badge CTA, invisible in every language; its number span (`proof-row-score`) holds the placeholder `0.0`, which self-flags as obviously wrong if `hidden` were ever lost | ✅ correct today | **§2 — flip only when the §1 gate passes** |
| 3 | Tier-2 `aggregateRating` JSON-LD | **Permanently OFF** — the served schema carries no rating markup of any kind and must NEVER gain Play-sourced numbers (see §6; the in-file comment next to the JSON-LD block says the same) | ✅ correct today | none — see §6 |

**Ship record (Phase 10):** deploy sha `3eaf9d9` (Git Data API bridge fast-forwards `81463b3 → a24fd4e → 3eaf9d9`, tree `0556bf2`, 2026-09-09) · Actions run `34431471810` green (validate + deploy) · prod smoke green: strip served (aria key + 4 pill keys), OFF row served hidden, served JSON-LD byte-identical with zero rating literals, scripts/smoke-check.sh ALL PASS.

> Tier-1 vs Tier-2 in one line: the **visible row** (Tier-1) flips when real Play ratings exist — that is the sanctioned path. The **JSON-LD schema** (Tier-2) is a different surface with a different, stricter gate (an on-site review source) and is documented permanently OFF.

---

## §1 · Evidence gate (before ANY flip)

Flip the Tier-1 row only when **both** are true — you eyeball them, no tooling:

1. **The Google Play listing is live** (the app page exists and is browsable).
2. **A real aggregate rating is visible on the Play page** — the star score next to the install button.

**No minimum-count floor** — there is no minimum number of ratings to wait for: any honest, real rating flips — one honest rating beats silence; fabrication is the enemy, not small numbers. Never enter a number you did not see on the Play page itself.

While the listing is pending (Play Console privacy-URL field still owner-side), the row stays OFF. Nothing else on the site depends on it.

---

## §2 · The flip — exactly two edits in `geohist/index.html`

Nothing else changes. Zero dictionary churn in either direction — the row's text is already translated in all 20 languages.

1. **Remove the gate attribute.** Find this line inside the hero section:

   ```html
   <div class="proof-row" hidden>
   ```

   → remove ` hidden` so it reads:

   ```html
   <div class="proof-row">
   ```

2. **Replace the placeholder number.** A few lines below, inside the span with class `proof-row-score`:

   ```html
   <span class="proof-row-score">0.0</span>
   ```

   → replace `0.0` with the real rating exactly as the Play page shows it, decimal dot format (e.g. `4.5`, never `4,5`).

3. **Commit** the file (one-line change, one number change) and **deploy** (push → Actions validate + deploy → Pages live in ~1 min). Ask the agent to run the §3 ritual and the prod smoke on your behalf, or run §3 yourself.

Everything else — text, links, star icon, translations — is already in place and must not be touched.

---

## §3 · Validation ritual (run pre-ship AND again at flip)

**Before the deploy (local):**

```powershell
npm run validate
```

Full gate chain must be green (HTML validity, domain scan, link check, i18n detection, key parity ×19).

**After the deploy (live):**

1. **Google Rich Results Test** — open `search.google.com/test/rich-results`, test `https://geohisttrivia.com/geohist/`. Expect: valid `SoftwareApplication` result, no new errors or warnings vs the pre-flip run. (Zero-build CI cannot run Google's tool — this is the manual half of the ritual, no new CI dependencies.)
2. **Zero-dependency JSON-LD parse check** — from the repo root:

   ```powershell
   node -e "const fs=require('fs');const h=fs.readFileSync('geohist/index.html','utf8');const m=h.match(/<script type=.application\/ld\+json.>[\s\S]*?<\/script>/)[0].replace(/<\/?script[^>]*>/g,'');const j=JSON.parse(m);if(j.aggregateRating){process.exit(2)}console.log('OK: JSON-LD parses; no aggregateRating key; type='+j['@type'])"
   ```

   Expect the `OK:` line. After a Tier-1 flip it must STILL report `no aggregateRating key` — the row flip never touches the schema. Exit code 2 at any time means the rating key appeared in the served schema: stop and revert (§4), then check §6.

🔍 Soft check: re-run the Rich Results Test ~24h after a flip and skim Search Console for structured-data reports.

---

## §4 · Rollback (one attribute, one number)

If anything looks wrong after a flip (Rich Results errors, wrong number, layout break):

1. Re-add ` hidden` to the `div class="proof-row"` line.
2. If the number was already replaced, restore `0.0` inside `proof-row-score` (so the row self-flags if it ever renders again).
3. Deploy, then re-run the §3 ritual + prod smoke.

The row is a display-only surface — rolling it back never affects the strip, the schema, or any dictionary.

---

## §5 · Refresh rule (session convention, not a calendar ritual)

During **any agent session that touches app-version facts** (changelog entries, FAQ device answers, feature claims), also:

- open the live Play page, read the current aggregate rating, and update the `proof-row-score` number **if it changed**;
- re-check the four facts-strip claims still match their on-site anchors (FAQ languages answer, Offline feature line, Trivia feature line, FAQ devices answer).

This rides the established changelog-freshness habit. No automation, no calendar reminder.

---

## §6 · Tier-2 precondition — the schema rule that never flips

Mirrors the in-file HTML comment next to the JSON-LD block in `geohist/index.html` (same rule, two surfaces, so no future agent can miss it):

- The `aggregateRating` key stays **out of the page's structured data permanently** unless a review/rating source **collected on this site itself** exists (it does not today).
- **Play-derived ratings are barred from the markup even when real.** Google review-snippet policy, verbatim: *"Don't aggregate reviews or ratings from other websites."* Google Play ratings are another website's ratings — visible attributed display (the Tier-1 row, §2) is the sanctioned path; structured-data mirroring is not.
- The only documented trigger for ever adding the key is that **on-site review source** — never the Play listing, never "ratings are live on Play". If a future agent or session proposes the Play listing as the trigger, that is the exact violation this phase exists to prevent.
- If the on-site source ever exists, the template shape in the in-file comment applies: `ratingValue` in decimal dot format (`4.4`, never `4,4`) plus `ratingCount`, validated through §3 — and the marked-up rating must be visibly shown on the page.

---

*Phase 10 · Gated Social Proof · runbook authored 2026-09-09 by plan 10-02 (Task 2) · ship record appended by the same plan's ship step*
