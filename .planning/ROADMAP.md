# Roadmap: Persano — Personal Apps Hub + GeoHist Trivia Site

## Milestones

- ✅ **v1 MVP** — Phases 1-5 (shipped 2026-09-05)
- ✅ **v2.0 Full Deferred Scope** — Phases 6-11 (shipped 2026-09-11)
- 🚧 **v2.1 Play Launch + Home Migration** — Phases 12-15 (in progress)

## Phases

<details>
<summary>✅ v1 MVP (Phases 1-5) — SHIPPED 2026-09-05</summary>

- [x] Phase 1: Foundation — Deploy Pipeline, Skeleton, Privacy Policy (2/2 plans) — completed 2026-09-02
- [x] Phase 2: GeoHist Landing + Hub Content (EN, i18n keys baked in) (2/2 plans) — completed 2026-09-02
- [x] Phase 3: i18n — Engine, ES/pt-BR Dictionaries, Switcher (2/2 plans) — completed 2026-09-02
- [x] Phase 4: Consent Gate + Firebase (Analytics + Contact Form) (2/2 plans) — completed 2026-09-03
- [x] Phase 5: Discovery & Quality — Screenshots, SEO, JSON-LD, AA Audit (4/4 plans) — completed 2026-09-05

Full details: [.planning/milestones/v1-ROADMAP.md](milestones/v1-ROADMAP.md)

</details>

<details>
<summary>✅ v2.0 Full Deferred Scope (Phases 6-11) — SHIPPED 2026-09-11</summary>

- [x] Phase 6: Changelog Page (3/3 plans) — completed 2026-09-06
- [x] Phase 7: Localization ×20 + RTL (6/6 plans) — completed 2026-09-07
- [x] Phase 8: Custom Domain Migration (3/3 plans) — completed 2026-09-07
- [x] Phase 9: App Check, Monitor-First (5/5 plans) — completed 2026-09-09
- [x] Phase 10: Gated Social Proof (2/2 plans) — completed 2026-09-10
- [x] Phase 11: Close v2.0 audit debt — AGENTS.md rewrite + doc hygiene + UAT records + star gate (3/3 plans) — completed 2026-09-11

**Milestone Goal:** Ship every v2-deferred item — 17 new localizations (incl. RTL), gated social proof, App Check, changelog page, custom domain — plus closure of the v2.0 milestone-audit debt (F-1 AGENTS.md rewrite, doc hygiene, owner UAT records, star-uniqueness gate).

Full details: [.planning/milestones/v2.0-ROADMAP.md](milestones/v2.0-ROADMAP.md)

</details>

### 🚧 v2.1 Play Launch + Home Migration (In Progress)

**Milestone Goal:** Site swap-ready for Play launch day; GeoHist landing serves as site home with `/apps/` hub; small debts closed. All flips stay owner-gated; GSC 180-day window untouched; zero-build + 19-dictionary atomic key moves enforced by CI.

- [x] **Phase 12: Cleanup Batch** - CI hygiene (`npm ci` + `cache: npm` restore) + zh variant confirmation + Urdu Nastaliq device check (completed 2026-09-13)
- [ ] **Phase 13: Home Migration** - Root = GeoHist landing, hub → `/apps/`, `/geohist/` meta-refresh stub, all 5 gate page-lists repointed — ONE atomic commit + post-deploy GSC resubmit
- [ ] **Phase 14: Launch Kit** - Owner launch runbook (pinned flip order) + swap-ready inventory + package-id CI gate
- [ ] **Phase 15: App Check Evidence Helper** - Console-UI-only doc: 30-floor submission counting + weekly ritual

## Phase Details

### Phase 12: Cleanup Batch

**Goal**: CI runs reproducibly and fast (`npm ci` + cached deps restored), and both locale edge-cases (zh variant, Urdu rendering) are verified against the real app/dictionary state
**Depends on**: Nothing (first v2.1 phase; runs before the gate-heavy migration so every later validate cycle benefits)
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04
**Success Criteria** (what must be TRUE):

  1. `deploy.yml` validate job runs `npm ci` + `cache: npm` and the full CI pipeline completes green
  2. Lockfile consistency re-verified at plan time with the result recorded — research discrepancy closed (stale "no lockfile" NOTE comment in `deploy.yml` removed if confirmed stale)
  3. zh variant (Simplified-only) confirmed against the app's `strings.xml` and documented — a visitor selecting zh gets Simplified Chinese; no zh-TW dictionary added unprompted
  4. Urdu Nastaliq check recorded from the owner's real device: `ur` page renders RTL (`dir="rtl"`) with its line-height override and readable text

**Plans**: 2/2 plans executed

Plans:
**Wave 1**

- [x] 12-01-PLAN.md — CI reproducibility tracer: lockfile re-verification record + `npm ci`/`cache: npm` in deploy.yml + stale-comment removal (CLEAN-01, CLEAN-04)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 12-02-PLAN.md — zh Simplified-only confirmation record + Urdu Nastaliq owner device check (12-UAT.md, blocking owner checkpoint) (CLEAN-02, CLEAN-03)

### Phase 13: Home Migration

**Goal**: Site root serves the GeoHist landing; the portfolio hub lives at `/apps/` — visitors, Play reviewers, and Google all see the new layout with zero broken paths and zero dictionary drift
**Depends on**: Phase 12
**Requirements**: MIG-01, MIG-02, MIG-03, MIG-04, MIG-05, MIG-06, MIG-07, MIG-08, MIG-09
**Success Criteria** (what must be TRUE):

  1. Visitor hitting `/` sees the full GeoHist landing (hero, proof strip, features, gallery, FAQ, CTA) with all 20 locales working; visitor browsing `/apps/` sees the portfolio hub (former root content, keyed chrome) with zero future-app placeholders
  2. Visitor hitting `/geohist/` (incl. via the legacy-host path-preserved chain) reaches the root landing via the meta-refresh-0 stub, while `/geohist/privacy.html` stays path-stable (Play Console compliance surface frozen)
  3. All sitemap URLs resolve on apex with coherent canonical + og:url + JSON-LD `url` per page; 404 page and all nav/footer links point at the new layout; i18n key surface stays exactly 178 × 19
  4. All five hardcoded gate page-lists (i18n-keycheck, i18n-surface, a11y-audit, smoke-check, validate:html glob) cover the new layout — red-gate proven both directions — and AGENTS.md reflects the new layout in the same commit (old-domain gate enforces it)
  5. Post-deploy: GSC sitemap resubmit + URL inspection done (owner console step, runbook section); no Change-of-Address refile (180-day window untouched)

**Plans**: 2 plans

Plans:
**Wave 1**

- [ ] 13-01-PLAN.md — runway clear (Phase 12 deferred commits + origin/main reconcile) + THE atomic migration edit set (landing→root, hub→/apps/, stub, all 5 gate lists + star path, sitemap, 404, AGENTS.md same-commit) + red-gate proofs both directions (MIG-01..07, MIG-09)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 13-02-PLAN.md — 13-RUNBOOK.md (GSC sitemap resubmit + URL inspection + explicit no-CoA) + 13-UAT.md scaffold (MIG-08; live owner steps post-deploy)

### Phase 14: Launch Kit

**Goal**: Owner can execute Play launch day from one runbook — every Play-launch surface verified, every flip done in pinned order, nothing improvised on launch day
**Depends on**: Phase 13 (file paths land in root `index.html` after migration)
**Requirements**: LKIT-01, LKIT-02, LKIT-03, LKIT-04
**Success Criteria** (what must be TRUE):

  1. Owner launch runbook with pinned flip order — privacy-URL field → Play-link 200 verify → website field → Tier-1 rating flip — console-UI only, zero secrets
  2. Swap-ready inventory table: every Play-launch surface with file:line + exact flip action
  3. CI gate green: every `play.google.com` URL in tracked files carries `details?id=com.persano.geohisttrivia` — red-gate proven both directions
  4. Runbook addenda present: GA4 page-dimension note, 10-RUNBOOK supersession note (paths now root), JSON-LD offers refresh-check step

**Plans**: TBD

### Phase 15: App Check Evidence Helper

**Goal**: Owner can track App Check evidence toward the 30-submission floor from the Firebase console UI alone — doc-only, zero code changes, zero secrets
**Depends on**: Nothing (independent doc work; sequenced last by numbering only)
**Requirements**: EVID-01, EVID-02
**Success Criteria** (what must be TRUE):

  1. Owner can count successful submissions toward the 30-floor following the doc — unit = successful submissions, never console request rows
  2. Weekly ritual template + category-split reading guide usable from the console UI alone (24h lag, pihole caveat, token-failure trend reading)

**Plans**: TBD

## Watch Items (gated events — NOT phases)

- **Tier-1 rating row flip** — owner event per 10-RUNBOOK §1 (trigger: real visible Play rating; no minimum floor)
- **FIRE-10 App Check enforcement flip** — owner event per 09-RUNBOOK §5-§6 (trigger: ≥30 successful submissions + console ready-to-enforce; post-v2.1 acceptable)
- **App #2 subdir + `/apps/` hub card** — v3+ (APP2-01; trigger: next app actually ships)
- **GSC Change-of-Address 180-day window** — monitoring until ~2027-03; old property retained; watch only

## Progress

**Execution Order:** Phase 12 → 13 → 14 → 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1 | 2/2 | Complete | 2026-09-02 |
| 2. GeoHist Landing + Hub | v1 | 2/2 | Complete | 2026-09-02 |
| 3. i18n ES/pt-BR | v1 | 2/2 | Complete | 2026-09-02 |
| 4. Consent + Firebase | v1 | 2/2 | Complete | 2026-09-03 |
| 5. Discovery & Quality | v1 | 4/4 | Complete | 2026-09-05 |
| 6. Changelog Page | v2.0 | 3/3 | Complete | 2026-09-06 |
| 7. Localization ×20 + RTL | v2.0 | 6/6 | Complete | 2026-09-07 |
| 8. Custom Domain Migration | v2.0 | 3/3 | Complete | 2026-09-07 |
| 9. App Check Monitor-First | v2.0 | 5/5 | Complete | 2026-09-09 |
| 10. Gated Social Proof | v2.0 | 2/2 | Complete | 2026-09-10 |
| 11. Close v2.0 Audit Debt | v2.0 | 3/3 | Complete | 2026-09-11 |
| 12. Cleanup Batch | v2.1 | 2/2 | Complete    | 2026-09-13 |
| 13. Home Migration | v2.1 | 0/? | Not started | - |
| 14. Launch Kit | v2.1 | 0/? | Not started | - |
| 15. App Check Evidence Helper | v2.1 | 0/? | Not started | - |

---
*Roadmap updated: 2026-09-13 (v2.1 milestone defined: Phases 12-15, 19/19 requirements mapped)*
