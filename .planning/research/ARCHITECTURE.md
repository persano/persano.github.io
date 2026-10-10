# Architecture Research — Milestone v2.2 (UI & Motion Rework)

**Domain:** Static Web Frontend Architecture  
**Researched:** 2026-10-09  
**Confidence:** HIGH  

---

## Architectural Principles

1. **Zero-Build GitHub Pages Compatibility**:
   - Zero bundlers, compilers, or transpilers. All styles and scripts load directly via browser standard `<link rel="stylesheet">` and `<script>`.
2. **Preserve i18n & Markup Contracts**:
   - The site uses a 178-key i18n dictionary system (`i18n.js`).
   - All `data-i18n` attributes and text keys must remain strictly untouched to ensure `validate:i18n` and `i18n-keycheck.mjs` pass CI with zero warnings.
3. **Compositor-Driven 60fps Motion**:
   - Motion is achieved strictly through CSS `transform` and `opacity`. No layout properties (`height`, `width`, `margin`) are animated directly during gestures or continuous transitions.
4. **Logical Properties for Bidi/RTL Compliance**:
   - All directional margins, paddings, and absolute insets use logical CSS properties (`margin-inline-start`, `inset-inline-end`) so that RTL (`ar`, `ur`) and LTR (all other 18 locales) work symmetrically without duplicate override rules.

---

## Directory & File Organization

```
persano.github.io/
├── css/
│   ├── base.css           # Core layout, theme tokens, typography, shared elements
│   └── motion.css         # NEW: Spring easings, elevation tokens, transition classes, keyframes
├── js/
│   ├── i18n.js            # Existing 178-key runtime engine (UNTOUCHED contract)
│   ├── consent.js         # GDPR consent gate (UNTOUCHED)
│   ├── contact.js         # Firebase contact form submission (UNTOUCHED)
│   └── gallery.js         # NEW: Lightweight lightbox & carousel controller (~1.5KB vanilla JS)
├── index.html             # GeoHist landing (enhanced gallery markup & motion attributes)
├── apps/index.html        # Apps hub (interactive cards & polish)
├── geohist/
│   ├── guide.html         # Accordions & FAQ with smooth expansion
│   ├── contact.html       # Input focus & button physics
│   └── privacy.html       # Compliance-frozen (styles inherit base tokens, content untouched)
```

---

## Component Architecture

### 1. Motion Tokens (`css/motion.css`)

```css
:root {
  /* Apple / Emil Spring Easings */
  --ease-spring-snappy: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-spring-gentle: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);

  /* Duration Standards */
  --dur-micro: 120ms;
  --dur-interaction: 200ms;
  --dur-expansion: 320ms;

  /* Layered Elevation Tokens (Dark Antique Tinted) */
  --shadow-sm: 0 2px 4px rgba(10, 8, 6, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  --shadow-md: 0 4px 12px rgba(10, 8, 6, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --shadow-lg: 0 8px 24px rgba(10, 8, 6, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);

  /* Highlight Glow */
  --glow-gold: 0 0 16px rgba(217, 169, 81, 0.22);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-micro: 0ms;
    --dur-interaction: 0ms;
    --dur-expansion: 0ms;
  }
}
```

### 2. Gallery & Lightbox Controller (`js/gallery.js`)

- **Separation of Concerns**:
  - The carousel layout and scrolling are 100% native CSS (`scroll-snap-type: x mandatory`).
  - `gallery.js` only handles user interaction:
    1. Synchronizing active pagination indicator pill.
    2. Opening the screenshot in a fullscreen `<dialog>` or overlay modal upon click.
    3. Keyboard trapping (`Tab`, `Escape`) and click-outside dismissal.
- **Fail-safe Progressive Enhancement**:
  - If JS fails to load or is disabled, the screenshot gallery still functions as a scrollable image reel. The thumbnails remain accessible images with full alt text.

### 3. Smooth Details Accordion Architecture

- Instead of legacy JavaScript accordion hacks, modern CSS Grid handles accordion animation without height calculation:
  ```css
  .faq-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--dur-expansion) var(--ease-spring-gentle);
  }
  .faq-item[open] .faq-content {
    grid-template-rows: 1fr;
  }
  .faq-content-inner {
    overflow: hidden;
  }
  ```
- Complies 100% with semantic `<details>` and `<summary>` tags without breaking accessibility screen readers.

---

## Integration with CI Gates

1. **`validate:html` (`html-validate`)**: All new modal/lightbox elements must use valid HTML5 syntax (`<dialog>` or `role="dialog"`, `aria-modal="true"`, proper button types).
2. **`validate:links` (`linkinator`)**: No broken image paths, dead anchors, or invalid `href` targets in gallery components.
3. **`validate:i18n` (`i18n-keycheck.mjs`)**: All new textual labels (e.g. "Close", "Next", "Previous" for modal) must be evaluated: either use aria labels from existing keys or keep purely visual icons (`aria-hidden="true"`). If any new text is needed, it must be added atomically across all 19 JSON dictionaries.
4. **`validate:play-links` (`check-play-link.mjs`)**: All Play Store badges and links retain `details?id=com.persano.geohisttrivia`.
