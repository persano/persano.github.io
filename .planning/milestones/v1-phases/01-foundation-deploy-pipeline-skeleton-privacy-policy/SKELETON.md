# Walking Skeleton — Persano Personal Apps Hub + GeoHist Trivia Site

**Phase:** 1
**Generated:** 2026-09-01

## Capability Proven End-to-End

> A visitor opens https://persano.github.io (pushed from main), sees the minimal Persano hub, can reach the Play-critical English privacy policy at `/geohist/privacy.html`, and any unknown path serves the custom self-contained 404 — with CI validation gating the deploy.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | None — hand-authored HTML5/CSS3, zero build step | Project constraint; Pages serves files as-is (`.nojekyll`) |
| Data layer | None — pure static files | No runtime data in Phase 1; Firebase (Firestore) arrives Phase 4 via gstatic ESM CDN |
| Auth | None | Contact-form anonymous auth is Phase 4 |
| Deployment target | GitHub Pages via official Actions chain (`checkout@v7` → `configure-pages@v6` → `upload-pages-artifact@v5` → `deploy-pages@v5`), Actions source | Verified versions; artifact from `path: '.'` + `include-hidden-files: true` keeps `.nojekyll` |
| CI gate | Two-job workflow: `validate` (html-validate 11.12.0 + linkinator 8.1.0, devDeps only) gates `deploy` via `needs:` | Red/green validation check distinct from deploy; deploy skipped on failure |
| Directory layout | Repo root = site root (user site); `/geohist/` subdir for app pages; `css/base.css` shared | Matches AGENTS.md constraints and research structure |
| Fonts/icons | System font stack; inline SVG later | No fonts CDN (privacy/latency, locked decision) |

## Stack Touched in Phase 1

- [x] Project scaffold (repo structure, `package.json` dev tooling only, `.htmlvalidate.json`)
- [x] Routing — static paths: `/`, `/404.html` (served for unknown paths), `/geohist/privacy.html`
- [x] Data layer — n/a (static site; no DB in skeleton)
- [x] UI — one real page served live (hub) + policy page + 404 interaction (unknown path → 404 page → link back to hub)
- [x] Deployment — push to main → CI validate → Pages deploy, verified live with smoke checks

## Out of Scope (Deferred to Later Slices)

- Full landing content, FAQ, game guide, app card (Phase 2)
- i18n engine + ES/pt-BR dictionaries, `data-i18n` keys (Phase 2/3)
- GDPR consent banner + Firebase Analytics + contact form (Phase 4)
- Screenshots, sitemap/robots, JSON-LD, OG cards, AA audit (Phase 5)
- Any Firebase script tag or Analytics byte — forbidden until consent gate exists (Phase 4)

## Subsequent Slice Plan

- Phase 2: Full EN GeoHist landing + hub content, mobile-first, `data-i18n` keys baked into markup
- Phase 3: In-place language swap (ES/pt-BR), switcher, localStorage persistence, EN fallback
- Phase 4: Consent gate + Firebase Analytics behind it + contact form working after any consent choice
- Phase 5: Real screenshots, SEO/sitemap/JSON-LD, WCAG 2.1 AA audit as Play-submission gate
