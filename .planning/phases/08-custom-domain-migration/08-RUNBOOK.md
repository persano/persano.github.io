# Phase 08 Owner Runbook — geohisttrivia.com Migration (Console + DNS Steps)

**Audience:** Santiago (owner). Every step below is a registrar-dashboard, GitHub-console, Firebase/GCP-console, or Google-Search-Console action. Agent-owned steps are listed for cross-reference only (§5) — you do nothing for those.

**Public-artifact notice:** this repo deploys the entire tree (`upload-pages-artifact path: '.'`), so this file — like every `.planning` doc — is publicly served. It therefore contains console-UI instructions only: **no secrets, no tokens, no credentials anywhere in this file.** Verification strings you must copy (GitHub TXT value, GSC TXT token) are shown to you inside the respective consoles at the time you add them; never paste them here.

**Status legend:** ✅ done (agent-verified live this session) · ⬜ TODO (yours) · 🔍 soft check (nice-to-have, non-blocking)

---

## §0 · Current state (probed 2026-09-07 ~21:15 UTC)

| # | Surface | Live state | Status | Owner action |
|---|---------|-----------|--------|--------------|
| 1 | Domain registration (Spaceship) | Registered — SOA `launch1.spaceship.net` | ✅ | none |
| 2 | Apex A×4 | `185.199.108.153` / `109.153` / `110.153` / `111.153` | ✅ | none — do not touch |
| 3 | Apex AAAA×4 | **missing** (SOA authority answer, no AAAA records) | ⬜ | **§1 — add 4 records** |
| 4 | GitHub verification TXT (`_github-pages-challenge-persano`) | **NXDOMAIN** — record vanished between sessions (was live at research time) | ⬜ | **§1 + §2 — re-add** |
| 5 | www CNAME | → `persano.github.io` | ✅ | none — do not touch |
| 6 | Pages domain set (repo Settings equivalent) | `cname: geohisttrivia.com`, `build_type: workflow` | ✅ (agent via gh API) | none |
| 7 | HTTPS certificate | `approved` for `geohisttrivia.com` + `www.geohisttrivia.com` (expires 2026-12-06) | ✅ | none |
| 8 | HTTPS enforcement (`https_enforced`) | API state `true` (agent flipped it 2026-09-07 via one `PUT`); live edge redirect **converged ~15 min after the flip** (http→https 301 verified) | ✅ | none |
| 9 | `https://geohisttrivia.com/` | **200** | ✅ | none |
| 10 | `https://www.geohisttrivia.com/` | **301 → https://geohisttrivia.com/** | ✅ | none |
| 11 | `https://persano.github.io/geohist/` | **301 → apex, path preserved** (the github.io edge still emits `http://` as the redirect *target* — a cosmetic remnant; that target itself 301s to `https://`, so the chain terminates on https) | ✅ | none |
| 12 | `http://geohisttrivia.com/` | **301 → https://geohisttrivia.com/** (converged ~15 min after the flip — well inside the docs' 24 h window) | ✅ | none |
| 13 | Profile-level domain verification (`protected_domain_state`) | `null` — Verify click not done | ⬜ | **§2 — re-add domain + TXT + Verify** |
| 14 | Firebase Auth authorized domains | unknown (console not probeable) | ⬜ | **§3 — add + keep legacy** |
| 15 | GCP API-key HTTP-referrer restriction | unknown (console not probeable) | ⬜ | **§3 — add + keep legacy** |
| 16 | GSC Domain property | unknown | ⬜ | **§4 — create + TXT-verify** |
| 17 | CNAME file in repo | absent (correct under Actions publishing — it is ignored; domain lives in repo Pages settings) | ✅ | none — must stay absent |

### Divergence ruling (owner decision, option B — 2026-09-07)

The research snapshot (same day, earlier session) showed the `_github-pages-challenge-persano` TXT **resolving**; this session's re-probe found it **NXDOMAIN**. The GitHub domain-verification record disappeared between sessions, and the profile-level verified-domain entry may have been removed along with it (`protected_domain_state` is still `null`).

Owner ruled: **proceed with the HTTPS-enforce flip now** (cert already `approved` — verified live before the flip), and absorb the TXT gap as runbook work: §1 gains a TXT re-add step, §2 is written for "re-add domain → TXT → Verify" instead of the original "TXT already resolving → Verify", and the Task-3 owner gate expands to **six items** (§0 rows 3, 4/13, 14, 15, 16, plus the soft re-probe of `protected_domain_state`).

### HTTPS-enforce propagation note (RESOLVED)

The API-level flip is done and confirmed (`GET /pages` → `https_enforced: true`; this GET-after-PUT is the correctness proof). Immediately after the flip the edge lagged (`http://` apex served 200) — **it converged ~15 minutes later**: `http://geohisttrivia.com/` → 301 → `https://geohisttrivia.com/` verified live. GitHub documents up to 24 h for this window; only investigate if a probe ever regresses (fix path per docs: remove + re-add the domain).

### Owner note (console state unknown)

Research Open Question 1: nobody recorded who set the domain/cert, and the Firebase/GSC console contents are not probeable from here. As you work through §3/§4, **confirm or flag anything that turns out to be already done** — if you find `geohisttrivia.com` already in a list, just verify the *legacy entries are still present* (that's the part that must not regress).

---

## §1 · Registrar (Spaceship) — DNS TODOs

Two record additions. Everything else in the zone stays untouched.

### 1a. Add AAAA×4 at `@` (the original gap — HOST-01)

In the Spaceship DNS zone for `geohisttrivia.com`, add four AAAA records at host `@` (apex):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| AAAA | `@` | `2606:50c0:8000::153` | default/auto |
| AAAA | `@` | `2606:50c0:8001::153` | default/auto |
| AAAA | `@` | `2606:50c0:8002::153` | default/auto |
| AAAA | `@` | `2606:50c0:8003::153` | default/auto |

### 1b. Re-add the GitHub verification TXT (new — divergence ruling)

The `_github-pages-challenge-persano` TXT is gone (NXDOMAIN). Re-add it:

1. Do §2 first up to the point where GitHub **displays the TXT value** (the value contains a random code; GitHub shows it when you add the domain — see §2 step 2).
2. In Spaceship, add: **Type `TXT`, Host `_github-pages-challenge-persano`, Value = the exact string GitHub displayed** (it looks like a random token; copy-paste, don't retype). TTL default.
3. Wait a few minutes for propagation, then continue §2.

If GitHub displays a **new** value when you re-add the domain, the new value wins — make sure the TXT in DNS matches what the Verify step expects *right now*, not an old screenshot.

### Do-not-touch list (§1)

- ✅ The 4 live A records (`185.199.108–111.153`) — leave exactly as they are.
- ✅ The www CNAME (`www` → `persano.github.io`) — leave as is.
- ❌ **No wildcard records** (`*.geohisttrivia.com`) — takeover risk per GitHub docs.
- ❌ **No extra A/AAAA/ALIAS records at `@`** beyond the 8 above — extra records can block certificate issuance.
- ⚠️ If CAA records exist in the zone, at least one must allow `letsencrypt.org` (current cert is already issued, so none blocking today).

### Full DNS record table (target state — copy of research table, row 10 amended)

| # | Type | Host/Name | Value | Status | Source |
|---|------|-----------|-------|--------|--------|
| 1–4 | `A` | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | ✅ live | docs.github.com managing page + live `Resolve-DnsName` |
| 5–8 | `AAAA` | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | ❌ **missing — owner adds (§1a)** | docs.github.com managing page; live AAAA probe returned SOA |
| 9 | `CNAME` | `www` | `persano.github.io` (no repo-name suffix) | ✅ live | live `Resolve-DnsName` |
| 10 | `TXT` | `_github-pages-challenge-persano` | value GitHub displays at Add-domain time (fresh value if domain re-added) | ❌ **was live at research time, now NXDOMAIN — owner re-adds (§1b)** | live TXT probe: NXDOMAIN 2026-09-07 |
| 11 | `TXT` | (host GSC specifies — typically `@`) | `google-site-verification=<token shown in GSC UI>` | ❌ owner adds with the Domain property (§4) | support.google.com/webmasters/answer/9008080 |

### Verify probes (run in PowerShell after each addition)

```powershell
Resolve-DnsName geohisttrivia.com -Type A        # expect 185.199.108-111.153 ×4
Resolve-DnsName geohisttrivia.com -Type AAAA     # expect 2606:50c0:8000::153 … 8003::153 ×4  ← must pass before gate item 1
Resolve-DnsName www.geohisttrivia.com -Type CNAME  # expect persano.github.io
Resolve-DnsName _github-pages-challenge-persano.geohisttrivia.com -Type TXT  # expect the GitHub token
```

DNS note: A and AAAA answer sets are unordered — the probe compares the *set* of resolved addresses, not their sequence.

---

## §2 · GitHub domain verification (profile-level) — re-add → TXT → Verify

The account-level verified-domain entry for `geohisttrivia.com` needs to be (re)established. This is **profile** Settings (avatar → Settings), *not* the repo's Settings.

1. Go to **github.com → your profile avatar → Settings → Pages → Verified domains**.
   - If `geohisttrivia.com` is **still listed**: open it and copy the displayed TXT value (skip to step 3).
   - If it is **absent** (likely — the TXT vanished, and `protected_domain_state` was `null` in both probes): click **Add a domain**, enter `geohisttrivia.com`, and GitHub will **display a fresh TXT record value** (hostname `_github-pages-challenge-persano` + a token).
2. **Add that TXT in Spaceship** (§1b — exactly as displayed).
3. Back in the GitHub dialog, wait for DNS propagation (a few minutes), then click **Verify**.
4. Success = the domain shows as verified in the list. The agent-side soft check: `GET /pages` → `protected_domain_state` becomes non-null (propagation of this field may lag — soft, non-blocking).

**Keep the TXT record forever** — removing it later can de-verify the domain and re-opens the takeover window.

Why this matters: an unverified custom domain can be claimed by another GitHub account (takeover) until the verification lands. Not a deploy gate — a protection gate.

---

## §3 · Firebase + GCP console — allowlists BEFORE the URL rewrite

Two surfaces. The rule for both: **ADD the new host entries; KEEP every existing `persano.github.io` / `github.io` entry — during the transition and indefinitely** (decisions D-03/D-04). Reasons, verbatim: (1) stale-indexed visitors still land on `persano.github.io` URLs via search/history and must keep a working contact form there; (2) rollback safety — if the domain is ever unset, the form must not break on the legacy host.

### 3a. Firebase console → Authentication → Settings → **Authorized domains**

- **ADD:** `geohisttrivia.com` — bare hostname, **no** `https://`, **no** path, **no** trailing slash.
- **ADD (separate entry, belt-and-braces):** `www.geohisttrivia.com` — the www host 301s to apex before any page loads, so the apex entry is what the origin check actually sees; the www entry costs nothing and hedges exact-match semantics. Keep both.
- **KEEP:** the existing `persano.github.io` entry/entries — do not remove, ever.
- Console UI = **append flow only**. Never "clean up" the list by removing old entries as part of this task.

### 3b. GCP console → APIs & Services → Credentials → your API key → **Website restrictions** (HTTP referrers)

- **ADD both entries** (this is the docs-verified two-entry pattern for "allow any URL in your site" — a single bare-domain entry is NOT sufficient):

| Entry | Covers |
|-------|--------|
| `https://geohisttrivia.com/*` | apex, any path |
| `https://*.geohisttrivia.com/*` | any subdomain, any path |

- **KEEP:** existing `https://persano.github.io/*` entry/entries — do not remove.
- Wildcards are valid **only as a full subdomain segment or a full path segment** — never mid-string (`mysubdomain*.example.com` is invalid).
- ⚠️ **Console UI append flow only.** gcloud/REST updates **replace the entire restriction list** — do not "re-enter just the new domain" via CLI/REST; that silently drops the github.io entries and the legacy form.

### Failure shapes (what you'd see if either surface is missed)

- Missing 3a → `auth/unauthorized-domain` in the browser console at form submit (`signInAnonymously` rejected — INVALID_ORIGIN).
- Missing 3b → Identity Toolkit / Firestore calls from the new origin rejected by the referrer restriction (network/permission errors on `identitytoolkit` / `firestore` requests).

---

## §4 · Google Search Console — new Domain property

1. Open **search.google.com/search-console** with the same Google account that owns the existing `persano.github.io` property.
2. **Add property → Domain** → enter `geohisttrivia.com` — **no protocol, no `www`, no path** (Domain-property syntax; one property covers apex + all subdomains).
3. Choose **DNS record verification**. GSC displays a TXT record: a host (typically `@`) and a value of the form `google-site-verification=<token>`.
4. Add that TXT in Spaceship **exactly as displayed** (§1 zone; a second TXT record alongside the GitHub one is fine — different host labels).
5. Back in GSC, click **Verify**.
6. **The old `persano.github.io` URL-prefix property STAYS** (D-08) — it monitors the 301/index-decay curve. No deletion step, now or ever.

---

## §5 · What the agent does meanwhile (owner: nothing here)

Cross-reference so you know what is already automated — none of this needs your action:

| Step | Owner? | Status |
|------|--------|--------|
| Pages domain set (`cname: geohisttrivia.com`) via gh API | no | ✅ done |
| HTTPS cert issue + verification | no | ✅ `approved` (apex + www) |
| HTTPS enforce flip (`PUT … -F https_enforced=true`) | no | ✅ done 2026-09-07 (edge propagation ≤24 h — §0 note) |
| URL rewrite (44 old-domain refs + 5 prose headers, one atomic commit) + CI old-domain gate | no | ✅ done 2026-09-07 (migration commit c72b3a2, CI validate+deploy green) |
| Post-deploy smoke-check against `https://geohisttrivia.com` | no | ✅ done 2026-09-07 (smoke ALL PASS on apex; curl triple apex 200 / www 301 / github.io 301 path-preserved) |
| GSC sitemap resubmit + Change of Address | **you** | §6 |

---

## §6 · Post-migration owner steps (after the rewrite deploys + smoke-check is green)

1. **GSC → new Domain property → Sitemaps** → submit `https://geohisttrivia.com/sitemap.xml` (D-09: same day the smoke-check goes green on the new domain).
2. **GSC → new Domain property → Change of Address** → source = the old `persano.github.io` property (D-10). Open it **only after** the smoke-check is green and the 301s are live (they are — §0 rows 10–11). The tool's pre-move checks confirm ownership of both properties and spot-check the redirects.
3. The move window is **180 days** — Google forwards signals from the old property to the new one for that period. Do not cancel it early; it lapses on its own.
4. Optional housekeeping: clear browser cache / hard-reload when first checking the new domain (GitHub docs note caching after domain changes).

---

## §7 · Live contact-form test (the migration's functional gate)

After the rewrite deploys (§6 step 1 precondition), send **one real message** through the form at:

```
https://geohisttrivia.com/geohist/contact.html
```

- Expect: submit succeeds, success toast/message, and the message lands in the Firestore `messages` collection (visible in Firebase console).
- If it fails with `auth/unauthorized-domain` → §3a missed; if Identity Toolkit/Firestore calls are rejected → §3b missed. Fix the console list, hard-reload, retry.
- Then send one more from an old-indexed URL (e.g. `https://persano.github.io/geohist/contact.html`) — it 301s to the apex and must work identically (this is what the "keep github.io entries" rule buys).

---

## §8 · Rollback (D-13) — agent-run, single API call

**The rollback is one `PUT` that unsets the custom domain and un-enforces HTTPS** — the Pages site returns to `persano.github.io`. It is run by the agent (gh CLI), not by console clicks:

```bash
gh api -X PUT repos/persano/persano.github.io/pages --input - <<'JSON'
{"cname":null,"https_enforced":false}
JSON
```

(The `--input -` form sends a JSON body with a real `null` for `cname`. Never pass `cname=null` as a key/value flag — that sends the literal string `"null"`.)

**Allowlists make this safe:** §3 keeps `persano.github.io` / `github.io` in Firebase Auth authorized domains and the API-key referrer allowlist **indefinitely**, so the form keeps working the moment the site is back on the legacy host.

**Branch: if Change of Address was already filed (§6 step 2), cancel it FIRST.**

1. Canceling requires, per Google's procedure: remove the forward 301s (the Pages-domain unset above does exactly that), add **reverse 301s** (old→new becomes new→old — agent work), then **Cancel Move** in the *old* property.
2. If rollback happens while CoA is active and it is *not* canceled, Google keeps preferring geohisttrivia.com for up to 180 days while the site actually serves from `persano.github.io` — conflicting signals.

**FORBIDDEN:** `DELETE /repos/persano/persano.github.io/pages` — that deletes the *entire* Pages site config and **unpublishes the site** (and if DNS still points at GitHub, the docs warn of takeover risk until the domain is re-pointed). It is never the rollback. Never use it.

---

*Phase 08 · Custom Domain Migration · runbook authored 2026-09-07 by plan 08-01 (Task 2) · amendments per owner divergence ruling (option B) of the same day*
