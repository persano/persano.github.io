# Pitfalls Research — Milestone v2.2 (UI & Motion Rework)

**Domain:** Web Motion & Responsive UI Pitfalls in Multi-locale Static Site  
**Researched:** 2026-10-09  
**Confidence:** HIGH  

---

## Critical Pitfalls to Avoid

### 1. The RTL Transform Inversion Pitfall

- **Problem:** Applying directional transforms like `transform: translateX(8px)` on hover or card animations moves elements rightward in LTR, but in Arabic (`ar`) and Urdu (`ur`), expanding/moving elements outward requires moving *leftward* (`translateX(-8px)`).
- **Consequence:** Visual clipping, awkward reverse motion, or horizontal scrollbar emergence in RTL locales.
- **Prevention:**
  - Prefer non-directional transforms: `translateY(-2px)`, `scale(1.02)`, or logical properties.
  - If horizontal translation is necessary, scope via `[dir="rtl"]`:
    ```css
    .item:hover { transform: translateX(6px); }
    [dir="rtl"] .item:hover { transform: translateX(-6px); }
    ```

### 2. The Accordion `<details>` Height Snap Pitfall

- **Problem:** `<details>` natively toggles `open` state instantaneously before CSS transitions can finish. Setting `transition: height` directly on `<details>` fails because browser toggles `display` or layout before animation runs.
- **Consequence:** Ugly snap open or instant collapse with cut-off content.
- **Prevention:**
  - Use the CSS Grid trick (`grid-template-rows: 0fr -> 1fr`) on a wrapper element inside the details tag.
  - Or handle open/close using the Web Animations API (WAAPI) by intercepting the click, animating out, and then removing the `open` attribute.

### 3. The Mobile `:hover` Sticky State Bug

- **Problem:** Mobile touch devices do not have true hover states. Tapping an element with `:hover` styles on mobile triggers the hover state and keeps it "stuck" until the user taps somewhere else.
- **Consequence:** Buttons and cards stay highlighted, scaled, or glowed indefinitely on iOS Safari and Android Chrome.
- **Prevention:**
  - Wrap desktop hover effects in `@media (hover: hover) and (pointer: fine)`:
    ```css
    @media (hover: hover) and (pointer: fine) {
      .card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
      }
    }
    ```
  - Use `:active` pseudo-class for touch feedback (`scale(0.97)`), which clears immediately upon finger release.

### 4. Layout Shift (CLS) from Animated Borders

- **Problem:** Adding or expanding borders on hover (`border: 2px solid gold`) changes element dimensions by 1-2px, causing surrounding text and buttons to jump.
- **Consequence:** Poor Cumulative Layout Shift (CLS), visual jank, failing Core Web Vitals.
- **Prevention:**
  - Use `box-shadow: inset 0 0 0 1px var(--color-accent)` or transparent borders (`border: 1px solid transparent`) that transition `border-color` rather than `border-width`.

### 5. i18n Text Expansion Breaking Fixed Heights

- **Problem:** German (`de`), Russian (`ru`), and Greek (`el`) translations are 30%–45% longer than English. Urdu (`ur`) requires 1.8+ line-height for proper Nastaliq glyph rendering. Setting fixed `height` or `max-height` on cards or buttons causes text clipping.
- **Consequence:** Broken layout, unreadable localized content, failed visual QA.
- **Prevention:**
  - Never use fixed `height` or `max-height` on text containers.
  - Always use `min-height`, `clamp()`, and allow content to flex naturally.
  - Test layouts in German and Urdu specifically before committing.

### 6. The 100vh Mobile URL-Bar Jump Bug

- **Problem:** `100vh` on mobile browsers includes the address bar area. When the user scrolls, the address bar collapses, resizing `100vh` and causing an abrupt layout jump.
- **Consequence:** Full-height modals or hero sections shudder on mobile scroll.
- **Prevention:**
  - Use `100dvh` (Dynamic Viewport Height) with fallback:
    ```css
    min-height: 100vh;
    min-height: 100dvh;
    ```

### 7. Unkeyed String Injection in CI

- **Problem:** Introducing new UI elements (like a lightbox modal with "Close" or "Screenshot" text) without corresponding keys in all 19 JSON dictionaries fails the `validate:i18n` CI gate.
- **Consequence:** CI pipeline breaks (`i18n-keycheck: FAIL`), deployment blocked.
- **Prevention:**
  - Use icon-only buttons with existing translated labels, or add keys atomically across all 19 dictionaries if new text is unavoidable.
