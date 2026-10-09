# Research Synthesis — Milestone v2.2 (UI & Motion Rework)

**Domain:** Static Web Frontend / Zero-Build UI & Motion Architecture  
**Researched:** 2026-10-09  
**Status:** COMPLETE  

---

## Executive Summary

The research confirms that milestone v2.2 can achieve modern, fluid UI craftsmanship and Apple-grade motion physics while **strictly maintaining 100% zero-build vanilla CSS/JS architecture** and preserving all existing CI validation gates across 20 languages.

By leveraging:
1. **Compositor-only CSS transitions** (`transform`, `opacity`) with spring curves (`cubic-bezier(0.32, 0.72, 0, 1)`).
2. **Layered dark antique elevation tokens** (tinted shadows, inset highlights).
3. **CSS scroll-snap and lightweight vanilla lightbox controller** (~1.5KB, zero dependencies).
4. **Mobile-native safeguards** (`@media (hover: hover)`, `100dvh`, `-webkit-tap-highlight-color: transparent`).

we eliminate all risk of CLS jank, ensure 60fps frame rates on low-end mobile devices, and maintain full compatibility with RTL and CJK locales.

---

## Key Recommendations for Milestone Planning

1. **Phase Structure Recommendation**:
   - **Phase 16: Motion & Design Token System** — Token architecture (`css/motion.css` / `css/base.css` expansion), spring curves, multi-layer elevation, typography tracking, mobile-native defaults (`100dvh`, tap highlights).
   - **Phase 17: Interactive Micro-Interactions & Accordions** — Tactile button/badge physics (`scale(0.97)` active press), card hover elevation, fluid FAQ accordion transitions across `/`, `/apps/`, and `/geohist/guide.html`.
   - **Phase 18: Screenshot Showcase & Lightbox** — Scroll-snap gallery reel with pagination on mobile, interactive lightbox modal with spring entrance and fast dismiss.
   - **Phase 19: Polish, Stress-Test & CI Verification** — 20-locale layout resilience audit (`break-ui`), 60fps compositor check (`review-animations`), RTL mirroring verification, full `npm run validate` CI green.

2. **Guiding Invariants**:
   - Zero layout shifts (CLS = 0).
   - Strict adherence to `prefers-reduced-motion`.
   - No untracked i18n key drift across 19 dictionaries.
   - No sticky hover states on touch screens.
