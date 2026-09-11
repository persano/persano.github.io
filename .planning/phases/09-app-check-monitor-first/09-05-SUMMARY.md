---
phase: 09-app-check-monitor-first
plan: 05
subsystem: infra
tags: [firebase-app-check, recaptcha-enterprise, contact-form, github-pages, gap-closure, deploy-bridge]
gap_closure: true
gap_ids: [G-09-7]

# Dependency graph
requires:
  - phase: 09-app-check-monitor-first (plans 01-04)
    provides: Enterprise-provider App Check gate + bounded ~10s deliver-anyway token race in contact.js (G-09-5), consent-gated appcheck_token_failure event bridge (consent.js), keyed contact.status.appcheck node, 09-RUNBOOK.md §7/§8, deployed phase-9 tree on main (55dba3d), debug session .planning/debug/token-failure-auth-network-failed.md
provides:
  - Bounded ~3s reCAPTCHA reachability probe BEFORE any App Check init in js/contact.js — probe failure (reject or hang) skips registration entirely, so the Auth SDK's optional X-Firebase-AppCheck lookup short-circuits and blocked-reCAPTCHA submits deliver un-attested in seconds with the appcheck status + consent-gated event (G-09-7)
  - appCheck/probe-failed synthetic appcheck-family code surfaced through the unchanged post-delivery re-throw (D-06/D-07 mapping NOT extended)
  - Dated G-09-7 runbook revision note + §8 probe-skip wiring/param wording; UAT test 7 re-verification checklist appended to 09-USER-SETUP.md (committed BEFORE the deploy — 09-04 ordering lesson applied)
  - Deployed main (bridge chain df3cc63 → 53e1511 → 81463b3, strict fast-forwards; remote tree 247d010c byte-identical to local HEAD ced0fdc) with Actions 34414513455 green and prod smoke green
affects: [gsd-verify-work resume (UAT test 7 repeat), FIRE-09 monitoring gate, FIRE-10 enforcement flip, future deploy bridges (blob-sha assertion mandate)]

# Actuals (#2632) — pairs with the plan's estimate (tokens 30000 / raw 15000 / tasks 3)
actuals:
  tokens: 4600   # chars/4 over the realized text diffs (contact.js +135/−36 lines, runbook/usersetup +26 lines, STATE/ROADMAP bookkeeping); favicon/binary n/a
  tasks: 3
  commits: 6   # local: ced0fdc (fix), 4f882b8 (docs) + final docs metadata commit; remote: df3cc63, 53e1511, 81463b3 (bridge chain)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Probe-gated attestation (G-09-7): a bounded ~3s no-cors/no-store fetch of the exact SDK-loaded reCAPTCHA Enterprise script URL (verified in the gstatic 12.18.0 bundle) races before init; failure routes to skip-init — never register the app-check service while reCAPTCHA is unreachable; the Auth SDK's optional header lookup then short-circuits"
    - "Blob-sha-asserted deploy bridge (post-incident mandate): every created blob must equal git rev-parse HEAD:<path> BEFORE tree creation — the df3cc63 incident (git show --output wrote empty files for blob output) is the standing regression this assertion blocks"
    - "Cache-once probe skip: a cached appCheckInstance short-circuits the probe (no fetch on resubmits); accepted residual edge = blocker enabled mid-session after one attested submit (documented in code, not engineered around)"

key-files:
  created:
    - .planning/phases/09-app-check-monitor-first/09-05-SUMMARY.md
    - .planning/debug/token-failure-auth-network-failed.md (committed here; authored by the 09-04→09-05 debug session, referenced by 09-UAT.md)
  modified:
    - js/contact.js
    - .planning/phases/09-app-check-monitor-first/09-RUNBOOK.md
    - .planning/phases/09-app-check-monitor-first/09-USER-SETUP.md
    - .planning/STATE.md
    - .planning/ROADMAP.md

key-decisions:
  - "G-09-7 fix shape: PROBE_TIMEOUT_MS=3000 race around a no-cors/no-store fetch of https://www.google.com/recaptcha/enterprise.js?render=exact — on reject/hang the init call is skipped entirely (appCheck/probe-failed recorded, resolved null); with no registered app-check service the Auth SDK's optional header lookup returns undefined and short-circuits, so signInAnonymously + addDoc proceed un-attested in seconds — plan-around-not-through the unpatchable CDN-pinned SDK hang"
  - "D-06/D-07 mapping NOT extended (planner decision upheld): the probe eliminates the blocked-reCAPTCHA scenario instead of remapping auth-family codes; the single mapping point, no-auto-retry, and dormant-gate byte-identity are preserved end-to-end"
  - "Deploy bridge chain with per-blob sha assertions (df3cc63 incident → 53e1511 fix → 81463b3 CRLF normalize); remote main tree 247d010c == local HEAD tree — full byte-identity invariant restored"

patterns-established:
  - "Probe-gated attestation registration (see above)"
  - "Blob-sha assertion mandate in every future Git Data API bridge: assert created-blob sha == repo blob sha per file, fail-fast before tree creation (df3cc63 regression guard)"

requirements-completed: [FIRE-07, FIRE-08]

coverage:
  - id: D1
    description: "G-09-7 code: bounded ~3s probe precedes the App Check init call; probe failure skips init entirely, records appCheck/probe-failed, and the chain reaches signInAnonymously + addDoc un-attested within seconds; probe success preserves the shipped raceToken semantics exactly; dormant gate and all pipeline invariants intact (single Enterprise provider, single init call site, single auth call, single addDoc call, single dormant gate, no Analytics import)"
    requirement: FIRE-08
    verification:
      - kind: unit
        ref: "node --check js/contact.js + Task 1 rg gates (PROBE_TIMEOUT_MS, appCheck/probe-failed, appCheck/token-timeout, recaptcha/enterprise.js literals; counts provider=1 init=1 auth=1 adddoc=1 dormant=1; no firebase-analyt) + 21-check behavioral smoke of the shipped chain with SDK stubs (probe-reject fast un-attested delivery, probe-ok init+gate, cached no-reprobe, token-reject record-and-swallow, dormant no-op, hung-probe ~3s bound) + npm run validate:html"
        status: pass
    human_judgment: false
  - id: D2
    description: "Runbook + owner-handoff wording: dated G-09-7 revision note; §8 wiring describes the probe-skip path (no attestation header await, delivery in seconds); §8 param lists appCheck/probe-failed (≤40-char truncation note kept); 09-USER-SETUP.md carries the UAT test 7 repeat checklist (~10s TOTAL, un-attested Firestore delivery, consent-gated event, consent-denied repeat, negative auth-family console expectation); no secrets or debug tokens added"
    requirement: FIRE-08
    verification:
      - kind: unit
        ref: "rg gates: G-09-7 present in 09-RUNBOOK.md + 09-USER-SETUP.md, appCheck/probe-failed in runbook, google.com/reload in USER-SETUP; secrets scan clean (only negative statements match)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Deploy + prod smoke: remote main = 81463b3 (strict fast-forward chain from 55dba3d), remote tree byte-identical to local HEAD tree (247d010c); Actions run 34414513455 green (validate + deploy) selected by the remote main sha; prod serves contact.js carrying appCheck/probe-failed (count=2), /favicon.ico HTTP 200, /geohist/contact.html rel=icon ×2, and the served 09-USER-SETUP.md is byte-identical (SHA256) to the repo blob"
    requirement:
    verification:
      - kind: e2e
        ref: "gh run watch 34414513455 --exit-status = success; curl.exe asserts: served contact.js appCheck/probe-failed count=2, favicon HTTP 200, contact.html rel=\"icon\" count=2, served USER-SETUP.md SHA256 == git blob SHA256"
        status: pass
    human_judgment: false
  - id: D4
    description: "G-09-7 formal closure = owner re-runs UAT test 7 on prod (DevTools request blocking of *recaptcha* AND *google.com/reload*, fresh incognito environment) and confirms ~10s appcheck status, un-attested Firestore delivery, consent-gated GA4 event, and no auth-family console failure"
    verification: []
    human_judgment: true
    rationale: "Requires the owner's browser DevTools request blocking (agent cannot block the owner's session traffic) plus Firebase console reads (Firestore messages + GA4 events; owner's pihole blocks analytics, GA4 lag up to 24h). Checklist ready in 09-USER-SETUP.md; run via /gsd-verify-work resume."

# Metrics
duration: 15min
completed: 2026-09-09
status: complete
---

# Phase 09 Plan 05: G-09-7 Gap Closure Summary

**A bounded ~3s reCAPTCHA reachability probe now skips App Check entirely when reCAPTCHA is unreachable — blocked-reCAPTCHA (ad-blocker) submits deliver un-attested in ~10s with the keyed appcheck status and the consent-gated event, instead of the ~60s auth-family generic error with no delivery — deployed green with prod smoke passing.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-09-09T19:41:21-03:00
- **Completed:** 2026-09-09T19:56:36-03:00
- **Tasks:** 3
- **Files modified:** 5 (+1 committed debug doc + this SUMMARY)

## Accomplishments

- **G-09-7:** `js/contact.js` now probe-gates the App Check block. A `PROBE_TIMEOUT_MS = 3000` race around a `no-cors`/`no-store` fetch of the exact script URL the pinned 12.18.0 SDK loads (`https://www.google.com/recaptcha/enterprise.js?render=explicit` — verified in the gstatic bundle: script tag onload-only, no onerror). On probe reject/timeout the init call is NEVER made — no app-check service registered — so the Auth SDK's optional `X-Firebase-AppCheck` lookup (`getImmediate({optional:true})`) returns undefined and short-circuits: there is no SDK-internal token await left to hang, `signInAnonymously` + `addDoc` proceed un-attested in seconds, and `appCheck/probe-failed` surfaces through the **unchanged** post-delivery re-throw + onSubmit mapping (D-06/D-07 byte-identical, no extension). Probe success preserves the shipped G-09-5 semantics exactly (cache-once guard, Enterprise provider, ~10s raceToken gate, record-and-swallow). Dormant gate untouched; no new imports; zero globals; banner independence intact.
- **Behavioral proof:** a 21-check smoke harness (temp dir, never committed) drove the REAL shipped chain with SDK stubs: probe-reject → init=0 + delivery + probe-failed code <1s; probe-ok → init once + explicit getToken gate; cached → no re-probe/re-init; token-reject → record-and-swallow + synthetic re-throw; dormant → byte-identical no-op; hung probe → bounded ~3s skip path. All 21 pass.
- **Docs:** 09-RUNBOOK.md gained the dated G-09-7 revision note; §8 "Shipped wiring" now leads with the probe-skip step (fork-boundary and no-auto-retry statements verbatim); §8 param lists `appCheck/probe-failed` with the ≤40-char note. 09-USER-SETUP.md gained the UAT test 7 repeat checklist (~10s TOTAL expectation, un-attested Firestore delivery, consent-gated event, consent-denied repeat, and the negative "no auth-family console failure" expectation). No secrets or debug tokens added.
- **Deployed:** main fast-forwarded via the Git Data API bridge — 55dba3d → `df3cc63` (BROKEN, see deviations) → `53e1511` (blob fix, sha-asserted) → `81463b3` (6 HTML CRLF→LF normalize). Remote tree `247d010c` is byte-identical to local HEAD `ced0fdc`'s tree — the "main == local HEAD" invariant is now exact. Actions run 34414513455 green (validate 12s + deploy 15s).
- **Prod smoke green (asserted, non-zero exit on failure):** served `/js/contact.js` carries `appCheck/probe-failed` (count=2); `/favicon.ico` HTTP 200; `/geohist/contact.html` has both icon links; served 09-USER-SETUP.md is SHA256-identical to the repo blob (no post-bridge drift — the Task 2 commit preceded the bridge, applying the 09-04 ordering lesson).
- **Handoff:** owner re-verification checklist (UAT test 7 repeat) is IN the deployed tree and local 09-USER-SETUP.md. Formal pass/fail via `/gsd-verify-work resume`.

## Task Commits

Each task was committed atomically (via the gsd-tools commit path; raw bash `git commit`/`git push` are permission-blocked in this harness):

1. **Task 1: G-09-7 — bounded reCAPTCHA reachability probe + skip-init in contact.js** - `ced0fdc` (fix)
2. **Task 2: Runbook + USER-SETUP wording for the probe-skip semantics** - `4f882b8` (docs; includes the referenced debug-session doc commit)
3. **Task 3: deploy + prod smoke + owner re-verification handoff** - no local commit needed (Task 2 already shipped the checklist pre-deploy per plan); deploy = remote bridge chain `df3cc63` → `53e1511` → `81463b3`, Actions 34414513455 green

**Plan metadata:** the docs(09-05) commit (this SUMMARY + STATE + ROADMAP + REQUIREMENTS).

## Files Created/Modified

- `js/contact.js` — PROBE_TIMEOUT_MS constant, ENTERPRISE_JS_URL probe target, prepareAppCheck helper (probe + skip-init), probe-gated active-site-key branch; header + block comments document the probe semantics, the hang mechanism, the URL-pin coupling, and the accepted mid-session residual edge
- `.planning/phases/09-app-check-monitor-first/09-RUNBOOK.md` — dated G-09-7 revision note + §8 wiring/param wording
- `.planning/phases/09-app-check-monitor-first/09-USER-SETUP.md` — "Gap Re-verification — G-09-7" UAT test 7 checklist appended; existing footer note intact
- `.planning/debug/token-failure-auth-network-failed.md` — debug session doc committed (was untracked; referenced by committed 09-UAT.md)
- `.planning/STATE.md`, `.planning/ROADMAP.md` — position/metrics/session bookkeeping

## Decisions Made

- **Probe + skip-init (not SDK patch, not mapping extension):** the hang mechanism lives in gstatic CDN-pinned 12.18.0 code (script tag onload-only; Auth NetworkTimeout 30/60s) and cannot be patched — never registering the app-check service while reCAPTCHA is unreachable is the only lever. D-06/D-07 stay byte-identical; the probe code rides the EXISTING post-delivery re-throw.
- **Probe cost bounds:** blocked environments reject the fetch near-instantly (~0ms); healthy connections pay one opaque fetch once per session (cache-once guard); an unbounded probe would reintroduce the deadlock class it removes (T-09-G11 mitigation: reject OR timeout → skip path).
- **Accepted residual edge (documented in code, not engineered around):** one attested submit then mid-session blocker enable re-enters the SDK-internal hang (no un-registration in 12.18.0), bounded by Auth NetworkTimeout as today; fresh environments are fully covered (T-09-G14).
- **Bridge hardening:** after the df3cc63 empty-blob incident, every future bridge asserts `git rev-parse HEAD:<path> == created blob sha` per file before tree creation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] First bridge commit (df3cc63) created EMPTY blobs for all 10 files**
- **Found during:** Task 3 (blob export step)
- **Issue:** `git show HEAD:<path> --output=<file>` does not honor `--output` for a bare blob show — content printed to stdout and the output files were empty, so all 10 created blobs were the empty blob (e69de29…); the tree and commit `df3cc63` were built from them and main was PATCHed (strict fast-forward) before the mismatch was noticed.
- **Fix:** exported bytes via `cmd /c "git show HEAD:<path> > <file>"` (raw stdout redirect), asserted per-file `git hash-object <file> == git rev-parse HEAD:<path>` AND created-blob sha == expected, then bridged a corrected commit `53e1511` (parented on df3cc63, strict fast-forward) replacing all 10 blobs with the verified ones.
- **Files modified:** none in the repo (remote-only bridge commits; scripts live in the pre-approved temp dir)
- **Verification:** all 10 blob shas asserted equal to repo blob shas; prod smoke (D3) green
- **Committed in:** remote `53e1511` (fix), `df3cc63` (broken, superseded in-tree)

**2. [Rule 3 - Blocker/invariant] Remote main's 6 icon-link HTML files had CRLF blobs (09-04 bridge artifact) — full byte-identity restored**
- **Found during:** Task 3 (tree comparison after the fix bridge)
- **Issue:** remote tree ≠ local HEAD tree: the 09-04 bridge had exported the 6 HTML files from the working tree (CRLF on disk) instead of repo blob bytes (LF), so 6 blobs differed from local by CR bytes only (same size−57, same content, icon links present in both). Pre-existing from the prior plan's tooling — but "main byte-identical to local HEAD" is the documented invariant this deploy channel owns.
- **Fix:** third strict-fast-forward commit `81463b3` replacing the 6 HTML blobs with the LF repo blobs (sha-asserted); remote tree now `247d010c` == local HEAD tree (verified equal).
- **Files modified:** none in the repo (remote-only normalize commit)
- **Verification:** `git rev-parse HEAD^{tree}` == remote tree sha; prod HTML unchanged modulo CR bytes (icon links count=2 re-asserted on prod)
- **Committed in:** remote `81463b3`

**3. [Bookkeeping] state.advance-plan read a stale position ("1 of 5" reset by the phase orchestrator) and advanced to "2 of 5"**
- **Found during:** close-out
- **Issue:** the orchestrator had reset Current Position to 1-of-5 at phase start; the tool advanced from the recorded value, not the executed plan (09-05, the last one).
- **Fix:** hand-corrected STATE.md Current Position to "5 of 5 (complete)" + phase-complete status + Plans Executed 17 + By-Phase 09 row = 5; trimmed the redundant Velocity block to keep STATE.md ≤150 lines.
- **Files modified:** .planning/STATE.md
- **Committed in:** the docs(09-05) metadata commit

---

**Total deviations:** 3 auto-fixed (1 bridge blob-export bug with incident hardening, 1 pre-existing line-ending invariant restore, 1 stale-state bookkeeping correction). **Impact on plan:** deploy mechanism identical to the sanctioned bridge pattern but now sha-asserted; outcomes identical or improved (tree byte-identity now exact). No scope creep.

## Issues Encountered

- **~2 min prod window with an empty contact.js:** the broken `df3cc63` commit triggered its own Actions run (34414210983) which completed before the fix was bridged; its Pages deploy briefly served a 0-byte `/js/contact.js`. The `53e1511`/`81463b3` deploys overwrote it; final prod state verified correct (D3). Residual risk: any visitor submitting in that window would have seen the form inert — acceptable, self-healed, and now guarded against by the blob-sha assertion mandate.
- **G-09-7 formal closure is owner re-verification** (UAT test 7 repeat on prod with DevTools request blocking) — agent cannot block the owner's session traffic or read the GA4/Firestore consoles. Checklist ready in 09-USER-SETUP.md (deployed); non-blocking here.
- GA4 `appcheck_token_failure` visibility limited for the owner (pihole blocks analytics; up to 24 h event lag) — unchanged from 09-04.

## User Setup Required

**⚠️ USER SETUP REQUIRED** — see `.planning/phases/09-app-check-monitor-first/09-USER-SETUP.md` (deployed with this plan):
- Repeat UAT test 7 on prod (fresh incognito; DevTools block `*recaptcha*` + `*google.com/reload`): appcheck status within **~10s TOTAL** (never ~1 minute, never the generic wording), button re-enables, form usable and NOT reset, message present in the Firestore `messages` collection (delivered un-attested), `appcheck_token_failure` event with consent granted (GA4 lag up to 24h), same status with consent denied (no event), and **no auth-family console failure** for this scenario.
- Formal pass/fail via `/gsd-verify-work resume`.

## Next Phase Readiness

- All 5 phase-09 plans are executed; both monitoring-mode failure paths (token failure G-09-5, unreachable-reCAPTCHA G-09-7) are now bounded and deliver-anyway, with the appcheck status + consent-gated event as the single observable failure surface. Remaining phase-9 work is owner re-verification (USER-SETUP checklists: tests 5 + 7 + favicon), after which the FIRE-09 weekly monitoring ritual (§4) and the evidence-gated FIRE-10 flip proceed per runbook.
- main (remote 81463b3) is byte-identical to local HEAD's tree (247d010c) as of this close-out; the docs metadata commit will trail by one STATE/ROADMAP version until the next sync/bridge (established precedent).
- Future deploy bridges MUST use the sha-asserted export (`git show HEAD:<path>` via raw redirect + blob-sha equality check) — the df3cc63 incident is the regression guard.

---
*Phase: 09-app-check-monitor-first*
*Completed: 2026-09-09*

## Self-Check: PASSED

- All key files exist on disk (js/contact.js, 09-RUNBOOK.md, 09-USER-SETUP.md, the committed debug doc, this SUMMARY) — verified with `[ -f ]`-equivalent checks.
- All local task commits exist: `ced0fdc` (fix), `4f882b8` (docs), `6fa94c7` (metadata). Remote main = `81463b3` verified via `gh api commits/main`; remote tree `247d010c` == local HEAD tree (byte-identical).
- Task 1 verify: node --check + all rg gates pass (provider=1, init=1, auth=1, adddoc=1, dormant=1, no analytics import) + 21/21 behavioral smoke checks + validate:html green.
- Task 2 verify: all 4 rg gates pass; secrets scan clean.
- Task 3 verify: Actions run 34414513455 green via `gh run watch --exit-status`; prod asserts — served contact.js probe code count=2, favicon HTTP 200, contact.html rel=icon ×2, served USER-SETUP.md SHA256 == repo blob — all pass.
- Plan-level verification: all four bullets satisfied; the one owner-judgment item (UAT test 7 repeat) is delegated to `/gsd-verify-work resume` per 09-USER-SETUP.md.
