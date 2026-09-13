# Requirements: Persano — Personal Apps Hub + GeoHist Trivia Site

**Defined:** 2026-09-11
**Core Value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible page — featuring the app, hosting its privacy policy, and offering a working contact channel.
**Milestone:** v2.1 Play Launch + Home Migration

## v2.1 Requirements

Requirements for this milestone. Each maps to roadmap phases (see Traceability).

### Home Migration (MIG)

- [ ] **MIG-01**: Visitor hitting site root `/` sees the GeoHist landing (hero, proof strip, features, gallery, FAQ, CTA) with all 20 locales working
- [ ] **MIG-02**: Visitor hitting `/geohist/` (incl. via legacy host) reaches the root landing via a meta-refresh-0 stub
- [ ] **MIG-03**: Visitor browsing `/apps/` sees the portfolio hub (former root content, keyed chrome) with zero future-app placeholders
- [ ] **MIG-04**: All sitemap URLs resolve on apex with coherent canonical + og:url + JSON-LD url per page
- [ ] **MIG-05**: All five hardcoded gate page-lists (i18n-keycheck, i18n-surface, a11y-audit, smoke-check, validate:html glob) cover the new layout — red-gate proven both directions
- [ ] **MIG-06**: AGENTS.md reflects the new layout in the same commit (old-domain gate enforces it)
- [ ] **MIG-07**: `/geohist/privacy.html` stays path-stable — Play Console compliance surface frozen
- [ ] **MIG-08**: GSC sitemap resubmit + URL inspection done post-deploy (owner console step, runbook section)
- [ ] **MIG-09**: 404 page + all nav/footer links point at the new layout (no dead hub links; key surface stays exactly 178 × 19)

### Launch Kit (LKIT)

- [ ] **LKIT-01**: Owner launch runbook with pinned flip order — privacy-URL field → Play-link 200 verify → website field → Tier-1 rating flip (console-UI only)
- [ ] **LKIT-02**: Swap-ready inventory table: every Play-launch surface with file:line + exact flip action
- [ ] **LKIT-03**: CI gate — every `play.google.com` URL in tracked files carries `details?id=com.persano.geohisttrivia` (red-gate proven both directions)
- [ ] **LKIT-04**: Runbook addenda — GA4 page-dimension note, 10-RUNBOOK supersession note (paths now root), JSON-LD offers refresh-check step

### App Check Evidence (EVID)

- [ ] **EVID-01**: Console-UI-only doc: counting successful submissions toward the 30-floor (unit = successful submissions, never request rows)
- [ ] **EVID-02**: Weekly ritual template + category-split reading guide (24h lag, pihole caveat, token-failure trend reading)

### Cleanup (CLEAN)

- [ ] **CLEAN-01**: `deploy.yml` validate job runs `npm ci` + `cache: npm` — CI green
- [ ] **CLEAN-02**: zh variant confirmed vs app `strings.xml` (Simplified-only documented)
- [ ] **CLEAN-03**: Urdu Nastaliq owner device check recorded (`dir="rtl"` + line-height on `ur`)
- [ ] **CLEAN-04**: Lockfile consistency re-verified at plan time (closes research discrepancy)

## v3+ Requirements

Deferred to future milestones. Tracked but not in current roadmap.

- **APP2-01**: Next app gets a `/`-adjacent subdir + `/apps/` hub card (trigger: next app actually ships)
- **GATED**: Tier-1 rating row flip — owner event per 10-RUNBOOK §1 (real visible Play rating)
- **GATED**: FIRE-10 App Check enforcement flip — owner event per 09-RUNBOOK §5-§6 (≥30 submissions + ready-to-enforce)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Move `geohist/privacy.html` | Play Console compliance surface; invisible to repo gates; app in review |
| Re-file GSC Change-of-Address | 180-day window active until ~2027-03; same-domain path moves are doc-excluded from CoA |
| Rename `hub.*` i18n keys → `apps.*` | ×19 dictionary churn, zero user benefit |
| `aggregateRating` from Play data | Review-snippet policy bars mirroring even with real data — permanent exclusion |
| JS-only redirects | Google classes as last resort; meta-refresh-0 suffices on Pages |
| Future-app placeholder cards | Visible placeholders violate the hub constraint (structure anticipates, doesn't advertise) |
| `robots.txt` `Disallow: /.planning/` | Deliberate decision, flagged not decided — parked for a future milestone |
| Full landing copy at both `/` and `/geohist/` | Double indexation; stub, never copy |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEAN-01 | Phase 12 | Pending |
| CLEAN-02 | Phase 12 | Pending |
| CLEAN-03 | Phase 12 | Pending |
| CLEAN-04 | Phase 12 | Pending |
| MIG-01 | Phase 13 | Pending |
| MIG-02 | Phase 13 | Pending |
| MIG-03 | Phase 13 | Pending |
| MIG-04 | Phase 13 | Pending |
| MIG-05 | Phase 13 | Pending |
| MIG-06 | Phase 13 | Pending |
| MIG-07 | Phase 13 | Pending |
| MIG-08 | Phase 13 | Pending |
| MIG-09 | Phase 13 | Pending |
| LKIT-01 | Phase 14 | Pending |
| LKIT-02 | Phase 14 | Pending |
| LKIT-03 | Phase 14 | Pending |
| LKIT-04 | Phase 14 | Pending |
| EVID-01 | Phase 15 | Pending |
| EVID-02 | Phase 15 | Pending |

**Coverage:**
- v2.1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-11*
*Last updated: 2026-09-13 after v2.1 roadmap creation (traceability mapped to Phases 12-15)*
