# Roadmap: Persano — Personal Apps Hub + GeoHist Trivia Site

## Milestones

- ✅ **v1 MVP** — Phases 1-5 (shipped 2026-09-05)
- ✅ **v2.0 Full Deferred Scope** — Phases 6-11 (shipped 2026-09-11)
- ✅ **v2.1 Play Launch + Home Migration** — Phases 12-15 (shipped 2026-10-09)
- 🚧 **v2.2 UI & Motion Rework** — Phases 16-19 (in progress)

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

Full details: [.planning/milestones/v2.0-ROADMAP.md](milestones/v2.0-ROADMAP.md)

</details>

<details>
<summary>✅ v2.1 Play Launch + Home Migration (Phases 12-15) — SHIPPED 2026-10-09</summary>

- [x] Phase 12: Cleanup Batch (2/2 plans) — completed 2026-09-13
- [x] Phase 13: Home Migration (2/2 plans) — completed 2026-09-14
- [x] Phase 14: Launch Kit (2/2 plans) — completed 2026-09-15
- [x] Phase 15: App Check Evidence Helper (1/1 plans) — completed 2026-10-09

Full details: [.planning/milestones/v2.1-ROADMAP.md](milestones/v2.1-ROADMAP.md)

</details>

### 🚧 v2.2 UI & Motion Rework (In Progress)

**Milestone Goal:** Rework all site pages with modern UI craftsmanship and fluid animations while strictly preserving zero-build vanilla CSS/JS architecture and 20-locale CI gates.

- [ ] **Phase 16: Motion & Design Token System** - Multi-layer elevation, spring motion variables, optical typography, and mobile-native foundation (`100dvh`, tap highlight) across shared styles.
- [ ] **Phase 17: Interactive Micro-Interactions & Accordions** - Tactile button/badge physics (`scale(0.97)` on `:active`), hover card elevation, and smooth animated FAQ accordions.
- [ ] **Phase 18: Screenshot Showcase & Lightbox** - Mobile scroll-snap carousel with pagination and full-screen accessible modal lightbox for high-resolution screenshots.
- [ ] **Phase 19: Polish, Stress-Test & CI Verification** - Multi-locale layout resilience audit (`break-ui`), 60fps compositor motion check (`review-animations`), and full green CI run.

## Phase Details

### Phase 16: Motion & Design Token System
**Goal**: Establish the core motion and design token architecture across `css/base.css` (or `css/motion.css`), adding multi-layer elevation, spring easings, typography tracking, and mobile-native defaults.
**Depends on**: Nothing (foundation phase)
**Requirements**: TOK-01, TOK-02, TOK-03, MOB-01, MOB-02, MOB-03
**Success Criteria**:
1. Multi-tier elevation tokens with ambient dark-antique shadows and 1px inset highlights defined.
2. Spring easing tokens (`--ease-spring-snappy`, `--ease-spring-gentle`) and duration variables defined.
3. Mobile-native viewport stability (`100dvh`) and tap latency/highlight removals active.
4. `prefers-reduced-motion` override rules fully active site-wide.

### Phase 17: Interactive Micro-Interactions & Accordions
**Goal**: Add physical feel to interactive elements: press damping on buttons/badges, hover lift on cards, and smooth CSS Grid/WAAPI accordion expansion.
**Depends on**: Phase 16
**Requirements**: INT-01, INT-02, INT-03
**Success Criteria**:
1. Buttons, badges, and Play Store CTA display swift active scale feedback (`scale(0.97)`) on press.
2. Cards on root landing and `/apps/` hub float up smoothly on cursor hover without layout shifting.
3. FAQ items on root landing and `/geohist/guide.html` expand and collapse smoothly with rotating indicators.

### Phase 18: Screenshot Showcase & Lightbox
**Goal**: Transform static screenshot grid into an interactive showcase: mobile-friendly scroll-snap reel with pagination dots, plus an interactive lightbox modal.
**Depends on**: Phase 16, Phase 17
**Requirements**: GAL-01, GAL-02, GAL-03
**Success Criteria**:
1. Mobile devices display a horizontal scroll-snap reel with pagination indicators and peek margins.
2. Clicking a screenshot opens a focused lightbox modal with smooth spring entrance, ESC key trap, and background dismissal.
3. Gallery remains fully readable and functional when JavaScript is disabled.

### Phase 19: Polish, Stress-Test & CI Verification
**Goal**: Stress-test the site under all 20 locales and ensure 60fps compositor performance and 100% green CI validation.
**Depends on**: Phase 18
**Requirements**: VAL-01, VAL-02
**Success Criteria**:
1. Zero visual clipping or overflow under long string translations (German, Russian) and RTL scripts (Arabic, Urdu).
2. Animations run at 60fps with zero layout thrashing or CLS jank.
3. Full `npm run validate` CI chain passes cleanly (HTML, domain, play-links, links, i18n).

## Watch Items (gated events — NOT phases)

- **Tier-1 rating row flip** — owner event per 10-RUNBOOK §1 (trigger: real visible Play rating; no minimum floor)
- **FIRE-10 App Check enforcement flip** — owner event per 09-RUNBOOK §5-§6 / 15-EVIDENCE-HELPER §4 (trigger: ≥30 successful submissions + console ready-to-enforce)
- **App #2 subdir + `/apps/` hub card** — v3+ (APP2-01; trigger: next app actually ships)
- **GSC Change-of-Address 180-day window** — monitoring until ~2027-03; old property retained; watch only

## Progress

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
| 12. Cleanup Batch | v2.1 | 2/2 | Complete | 2026-09-13 |
| 13. Home Migration | v2.1 | 2/2 | Complete | 2026-09-14 |
| 14. Launch Kit | v2.1 | 2/2 | Complete | 2026-09-15 |
| 15. App Check Evidence Helper | v2.1 | 1/1 | Complete | 2026-10-09 |
| 16. Motion & Design Token System | v2.2 | 0/? | Not started | - |
| 17. Interactive Micro-Interactions | v2.2 | 0/? | Not started | - |
| 18. Screenshot Showcase & Lightbox | v2.2 | 0/? | Not started | - |
| 19. Polish, Stress-Test & CI | v2.2 | 0/? | Not started | - |

---
*Roadmap updated: 2026-10-09 (v2.2 started)*
