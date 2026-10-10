---
phase: 16
plan: 1
title: Motion & Design Token System
status: complete
completed: 2026-10-10
requirements_covered:
  - TOK-01
  - TOK-02
  - TOK-03
  - MOB-01
  - MOB-02
  - MOB-03
files_modified:
  - css/base.css
---

# Summary 16-01: Motion & Design Token System

## What Was Done
1. **Design Tokens (TOK-01, TOK-02, TOK-03):**
   - Added `--elevation-low`, `--elevation-mid`, and `--elevation-high` with layered ambient dark-antique shadows and 1px inset highlights in `:root`.
   - Added `--ease-spring-snappy`, `--ease-spring-gentle`, and duration variables (`--dur-micro`, `--dur-interaction`, `--dur-expand`).
   - Added translucent border tokens (`--border-subtle`, `--border-card`).
   - Applied optical negative letter-spacing to `h1`, `h2`, `h3` (`-0.015em` and `-0.025em` for h1).
   - Upgraded card elements (`.feature-group`, `.faq-item`, `.about-dev`, `.app-card`, `.mode-item`, `.changelog-entry`) to use `--border-card` and `--elevation-mid`.

2. **Mobile Native & Accessibility Defaults (MOB-01, MOB-02, MOB-03):**
   - Added `min-height: 100dvh` on `body`.
   - Added `env(safe-area-inset-*)` padding on `main`, `.site-header`, and `footer`.
   - Added `-webkit-tap-highlight-color: transparent` across all elements.
   - Added `touch-action: manipulation` across interactive form controls, links, and buttons.
   - Added global `@media (prefers-reduced-motion: reduce)` kill-switch at the stylesheet boundary.

## Verification
- `npm run validate` clean pass (HTML validate, no old domain, play links, linkinator 20/20, i18n detect 23/23, 19 dictionaries 178 keys set equality).
