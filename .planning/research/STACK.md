# Stack Research — Milestone v2.2 (UI & Motion Rework)

**Domain:** Static Web Frontend / Zero-Build Vanilla CSS & JS  
**Researched:** 2026-10-09  
**Confidence:** HIGH  

---

## Recommended Stack

### Core Technologies

| Technology | Version / Spec | Purpose | Why Recommended |
|------------|----------------|---------|-----------------|
| **Vanilla CSS3 Custom Properties & Motion Tokens** | Modern Evergreen | Elevation, borders, spring easings, duration tokens | Native CSS tokens require zero build step, zero runtime overhead, and update reactively with system preferences. |
| **CSS Transforms & Opacity (Compositor-only)** | CSS Transforms Level 2 | Micro-interactions, card hovers, modal scale/fade | Guaranteed 60fps animations off the main thread; prevents layout shifts (CLS = 0) and reflow thrashing. |
| **CSS `linear()` Spring Easings & Custom Cubic Beziers** | CSS Easing Functions Level 2 | Physical spring feel for interactive elements | Mimics Apple-grade and Emil Kowalski spring motion (`cubic-bezier(0.32, 0.72, 0, 1)`) without importing heavy JS animation libraries like Framer Motion or GSAP. |
| **CSS Scroll-Snap & Touch Scroll** | CSS Scroll Snap Level 1 | Mobile screenshot carousel / gallery | Native hardware-accelerated momentum swipe on mobile and trackpad with zero JavaScript dependency for scrolling mechanics. |
| **Web Animations API (WAAPI)** | W3C Recommendation | Programmatic accordions, lightbox dismiss, gesture hand-off | Built into all evergreen browsers; allows interruptible, cancelable JS animations running on the compositor without third-party dependencies. |

### Supporting Tools & Zero-Build Runtime Components

| Component | Architecture | Purpose | When to Use |
|-----------|--------------|---------|-------------|
| **`css/motion.css` (or modular `css/base.css` sections)** | Zero-build CSS | Token library for easing curves, durations, elevation shadows, active transforms | Applied across all site pages (`/`, `/apps/`, `/geohist/guide.html`, `/geohist/contact.html`). |
| **Vanilla `js/carousel.js` (or inline component)** | Dependency-free ES Module / classic script | Lightbox open/close, arrow pagination, thumbnail active indicator | Root landing page screenshot showcase only (~1.5KB unminified). |
| **`@media (prefers-reduced-motion: reduce)`** | Media Queries Level 5 | Accessibility compliance | Automatically disables or flattens transitions for users requesting reduced motion. |

### Development & Verification Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **`html-validate`** | Static HTML validation | Part of existing `npm run validate` pipeline; ensures zero invalid markup. |
| **`linkinator`** | Link crawler | Part of existing `npm run validate` pipeline; ensures modal/anchor links do not 404. |
| **`i18n-keycheck.mjs`** | CI dictionary coverage gate | Part of existing `npm run validate` pipeline; guarantees zero i18n drift across 20 languages. |
| **Chrome DevTools Performance / Rendering** | Frame rate & paint flashing audit | Verify 60fps compositor-only layers (`will-change: transform`). |

---

## Alternatives Considered

| Recommended | Alternative | Why Recommended Over Alternative |
|-------------|-------------|-----------------------------------|
| **Vanilla CSS + WAAPI** | Framer Motion / Motion One | Framer Motion requires React + build bundle (Vite/Webpack). The project is strictly zero-build static GitHub Pages. WAAPI and CSS offer identical feel with 0 bytes bundle tax. |
| **CSS Scroll-Snap Carousel** | Swiper.js / Embla Carousel | Swiper is >30KB minified and introduces CDN dependencies. CSS scroll-snap is 0KB, natively responsive, and mirrors automatically in RTL. |
| **Pure CSS Accordions (`details`/`summary`) with WAAPI transition** | Hand-rolled JS Accordion | Native `<details>` remains accessible without JS and works when scripts fail or are blocked. WAAPI provides smooth height expansion without breaking semantic HTML. |

---

## What NOT to Use

1. **NO JS bundling toolchains (Webpack, Vite, Rollup, PostCSS)**: Project is strictly zero-build; HTML directly serves static files.
2. **NO Heavy Animation Libraries (GSAP, Anime.js, Framer Motion)**: Violates zero-dependency and minimal payload rules.
3. **NO Animating `height`, `width`, `top`, `margin`, `padding`**: Forces browser layout recalculation and causes jank on low-end mobile devices. Use `transform` and `opacity` only.
4. **NO Pure Black Shadows (`rgba(0, 0, 0, 0.8)`)**: Unnatural aesthetic; use layered, subtle tinted elevation shadows.
5. **NO Directional CSS in Shared Components (`margin-left`, `left`)**: Breaks Arabic (`ar`) and Urdu (`ur`) RTL rendering. Always use logical properties (`margin-inline-start`, `inset-inline-start`).
