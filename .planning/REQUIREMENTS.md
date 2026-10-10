# Requirements: Persano — Personal Apps Hub + GeoHist Trivia Site

**Defined:** 2026-10-09  
**Milestone:** v2.2 UI & Motion Rework  
**Core Value:** GeoHist Trivia players and Play reviewers reach an authoritative, accessible, beautifully crafted page with fluid physical motion and responsive mobile polish.

---

## v2.2 Requirements

### Design Tokens & Visual Foundation (TOK)

- [ ] **TOK-01**: Multi-tier elevation tokens defined with layered ambient dark-antique shadows and subtle 1px inset card highlights.
- [ ] **TOK-02**: Standard spring motion tokens (`--ease-spring-snappy`, `--ease-spring-gentle`, `--dur-micro`, `--dur-interaction`) defined in CSS.
- [ ] **TOK-03**: Typography and border polish applied across shared stylesheet (tighter display tracking, soft translucent borders replacing flat lines).

### Micro-Interactions & Tactile States (INT)

- [ ] **INT-01**: Tactile active press physics (`scale(0.97)` on `:active`) applied to buttons, Play Store badges, and interactive CTAs.
- [ ] **INT-02**: Smooth card hover elevation and border highlight applied to landing feature cards and `/apps/` portfolio cards (scoped to `@media (hover: hover)`).
- [ ] **INT-03**: Smooth, animated expansion and icon rotation on FAQ accordions across root landing and `/geohist/guide.html`.

### Screenshot Showcase & Lightbox (GAL)

- [ ] **GAL-01**: Screenshot gallery on root landing upgraded to smooth CSS scroll-snap horizontal reel with mobile pagination indicators.
- [ ] **GAL-02**: Full-screen interactive lightbox modal for viewing high-resolution screenshots with smooth entrance, ESC key trap, and background click dismissal.
- [ ] **GAL-03**: Progressive enhancement fallback ensuring screenshot gallery remains fully readable and browsable without JavaScript.

### Mobile-Native & Accessibility (MOB)

- [ ] **MOB-01**: Dynamic viewport height (`100dvh`) and safe-area insets (`env(safe-area-inset-*)`) implemented to eliminate mobile address-bar jump.
- [ ] **MOB-02**: Mobile touch polish applied site-wide: `-webkit-tap-highlight-color: transparent` and `touch-action: manipulation` eliminating tap delay and sticky hovers.
- [ ] **MOB-03**: `@media (prefers-reduced-motion: reduce)` implemented site-wide to immediately disable spring transforms and motion for accessibility.

### Quality & Validation (VAL)

- [ ] **VAL-01**: Visual layout resilience stress-test (`break-ui`) across all 20 locales (long text strings in German/Russian, RTL alignment in Arabic/Urdu).
- [ ] **VAL-02**: Full existing CI validation chain passes cleanly with zero errors (`npm run validate`: html, domain, play-links, links, i18n-detect, i18n).

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Heavy runtime JS animation frameworks (GSAP, Framer Motion) | Project strictly enforces zero-build static architecture with minimal payload. |
| New content pages or modified copywriting | Milestone v2.2 is purely focused on visual polish, touch experience, and motion mechanics. |
| Light mode theme | Existing brand identity is dark antique only (WCAG 2.2 AA verified). |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOK-01 | Phase 16 | Pending |
| TOK-02 | Phase 16 | Pending |
| TOK-03 | Phase 16 | Pending |
| MOB-01 | Phase 16 | Pending |
| MOB-02 | Phase 16 | Pending |
| MOB-03 | Phase 16 | Pending |
| INT-01 | Phase 17 | Pending |
| INT-02 | Phase 17 | Pending |
| INT-03 | Phase 17 | Pending |
| GAL-01 | Phase 18 | Pending |
| GAL-02 | Phase 18 | Pending |
| GAL-03 | Phase 18 | Pending |
| VAL-01 | Phase 19 | Pending |
| VAL-02 | Phase 19 | Pending |
