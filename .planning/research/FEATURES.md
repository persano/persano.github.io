# Features Research — Milestone v2.2 (UI & Motion Rework)

**Domain:** Static Web Frontend / UI Craftsmanship & Animation  
**Researched:** 2026-10-09  
**Confidence:** HIGH  

---

## Scope Overview

Milestone v2.2 reworks the UI and motion design across all 4 core pages:
1. **Root GeoHist Landing (`/`)**
2. **Portfolio Apps Hub (`/apps/`)**
3. **Game Guide & FAQ (`/geohist/guide.html`)**
4. **Contact Page (`/geohist/contact.html`)**

All features must integrate seamlessly with the existing dark antique aesthetic, 20-locale keyed i18n system, and zero-build GitHub Pages deployment.

---

## Detailed Feature Matrix

### 1. Design System & Token Polish (`emil-design-eng`)

- **Multi-layer Elevation System**:
  - Replace flat hairline borders with subtle, layered ambient shadows and 1px inset highlights (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px rgba(10,8,6,0.5)`).
  - Surface cards have distinct depth tiers: background (`#1a1410`), base surface (`#241c14`), raised hover surface (`#2a221a`).
- **Refined Typography & Micro-Contrast**:
  - Tighter tracking on display headings (`letter-spacing: -0.02em` on `Georgia` headings).
  - Enhanced optical hierarchy between primary parchment text (`#f0e6d2`), muted sepia (`#c9b89a`), and antique gold accents (`#d9a951`).
- **Refined Border Contrast**:
  - Shift harsh border lines to subtle translucent borders that blend with warm dark backgrounds.

### 2. Spring Physics & Micro-Interactions (`apple-design`, `animate`)

- **Buttons & CTA Badges**:
  - **Press feel**: Fast active scale feedback (`transform: scale(0.97)` on `:active`) with swift 80ms damping.
  - **Hover state**: Smooth upward float (`transform: translateY(-2px)`) with gold ambient aura glow.
  - **Focus-visible**: Refined non-jarring outline with 2px offset matching brand gold.
- **Card Hover & Lift**:
  - Feature cards on landing page and app cards on `/apps/` respond to cursor hover with smooth elevation lift (`translateY(-3px)`) and border highlight.
  - Directionally neutral transforms to avoid breaking RTL layout in Arabic (`ar`) and Urdu (`ur`).
- **Smooth FAQ Accordions (`/geohist/guide.html` and `/`)**:
  - Currently, clicking `<details>` abruptly snaps open/shut.
  - Animate expanding content with fluid height transition (via CSS grid `grid-template-rows: 0fr -> 1fr` or WAAPI) and smooth rotating indicator (`+` to `−` with 90° spin).

### 3. Screenshot Showcase & Interactive Gallery (`/`)

- **Fluid Swipe/Scroll Carousel**:
  - Upgrade static 4-tile grid into a smooth scroll-snap horizontal reel on mobile with visible pagination dots and subtle peek of adjacent screens.
- **Interactive Lightbox Zoom**:
  - Tapping/clicking any screenshot expands into a clean, focused lightbox modal.
  - Lightbox entry: smooth scale-up (`scale(0.92) -> scale(1.0)`) and backdrop fade-in.
  - Dismiss: ESC key, background tap, or swipe down, with fast exit animation (`ease-in` fade out in <150ms).
  - Accessibility: Focus trapping, `aria-modal="true"`, and keyboard navigable.

### 4. Mobile-Native Touch Polish (`mobile-native`)

- **Viewport Stability**:
  - Replace `100vh` with `100dvh` (dynamic viewport height) across all full-height containers to eliminate mobile browser URL-bar jump.
- **Touch Responsiveness**:
  - Eliminate 300ms tap delay on mobile buttons using `touch-action: manipulation`.
  - Disable blue tap highlight boxes using `-webkit-tap-highlight-color: transparent`.
  - Prevent accidental text selection during multi-tap on interactive badges (`-webkit-user-select: none; user-select: none`).
- **Safe Area Insets**:
  - Include `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` padding for notch and home-bar clearance on modern mobile devices.

### 5. Motion Quality & Accessibility Verification (`review-animations`, `break-ui`)

- **`prefers-reduced-motion` Overrides**:
  - All transitions and transforms immediately clamp to instant or opacity-only transitions when user prefers reduced motion.
- **RTL Integrity Verification**:
  - Arabic and Urdu text directions verified with all new hover and accordion states; zero horizontal scroll overflow.
- **20-Locale String Length Resilience**:
  - Responsive cards tested with extreme character length (German compound words, Russian phrases) to ensure buttons, badges, and titles never clip or overlap.
