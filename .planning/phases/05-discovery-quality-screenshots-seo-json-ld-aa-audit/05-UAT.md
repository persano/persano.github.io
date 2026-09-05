---
status: complete
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md]
started: 2026-09-04T15:05:00Z
updated: 2026-09-04T17:20:00Z
---


## Current Test

[testing complete]

## Tests

### 1. Galería con capturas reales
expected: Abre https://persano.github.io/geohist/ — galería muestra 4 capturas reales del juego con captions, sin placeholders SVG, lazy-load al hacer scroll
result: pass
note: "Issue G-05-1 (banners AdMob de prueba horneados en capturas) resuelto por 05-04: 4 WebPs regenerados sin banners (`941f2cd`), CI 33920495287 verde, smoke 4/4 byte-idéntico en vivo. Owner confirmó galería live sin banners (incognito, f5d1a75). Verificación 05-VERIFICATION.md: 27/27 must-haves."

### 2. Tarjeta al compartir enlace
expected: Pega https://persano.github.io/geohist/ en un chat — la tarjeta muestra imagen de marca, título y descripción del juego
result: pass
note: "Preview WhatsApp OK (título + descripción visibles). Owner pregunta: preview sale en inglés — correcto por diseño (EN canónico + diccionarios es/pt-BR con switcher; og:tags son estáticos EN)"

### 3. URL de política vieja eliminada
expected: https://persano.github.io/GeoHist_Trivia_Privacy_Policy.html devuelve 404 y https://persano.github.io/geohist/privacy.html carga sin error
result: pass

### 4. Rich Results Test
expected: Rich Results Test detecta SoftwareApplication sin errores
result: pass

### 5. Sitemap y robots en vivo
expected: sitemap.xml con 5 URLs y robots.txt con allow-all + Sitemap
result: pass

### 6. Navegación solo teclado (sitio en vivo)
expected: tab-only con orden lógico, foco visible en nav/Play/FAQ/footer consent
result: pass

### 7. Formulario de contacto accesible
expected: envío vacío → error inline sin navegar; etiquetas anunciadas
result: pass

### 8. Cambio de idioma ES/pt-BR
expected: Cambiar a ES y pt-BR actualiza textos y el atributo lang del documento; teclado y contraste siguen correctos tras el cambio
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-05-1
  truth: "La galería de /geohist/ muestra 4 capturas limpias del juego (sin anuncios de prueba)"
  status: resolved
  resolved_by: 05-04-PLAN
  resolved_at: 2026-09-04
  reason: "User reported: looks horrible — banners de anuncio de PRUEBA de AdMob ('Anuncio de prueba' / 'You've loaded a test ad from AdMob' / 'AdMob Adaptive Banner') grabados en las capturas menu + map (y presumiblemente flags + timeline)"
  severity: major
  test: 1
  root_cause: "Las 4 capturas ADB se tomaron desde un build DEBUG de GeoHist-Trivia, que sirve determinísticamente el banner de PRUEBA público de AdMob (ca-app-pub-3940256099942544/9214589741, hardwired vía BuildConfig.DEBUG en AdBanner.kt:24,27; build.gradle.kts:117 fuerza TEST app ID en debug). Dispositivo no ad-free (isAdFree=false) → banner 'Anuncio de prueba' en cada pantalla capturada → horneado en los PNG crudos → make-webp.mjs los convirtió 1:1 (CROPS vacío, D-53 approved-as-framed) a los WebP desplegados. El código del sitio es correcto — el defecto es estado del dispositivo en captura propagado a assets."
  artifacts:
    - path: "geohist/screenshots/screenshot.menu.webp"
      issue: "banner de prueba AdMob horneado"
    - path: "geohist/screenshots/screenshot.map.webp"
      issue: "banner de prueba AdMob horneado"
    - path: "geohist/screenshots/screenshot.flags.webp"
      issue: "banner de prueba AdMob horneado"
    - path: "geohist/screenshots/screenshot.timeline.webp"
      issue: "banner de prueba AdMob horneado"
  missing:
    - "Owner (dispositivo): activar estado ad-free ('Quitar anuncios' IAP vía license testing sin cargo, o toggle debug ad-free / internal-testing-track install) → banner oculto en las 4 pantallas"
    - "Owner (dispositivo): recapturar las mismas 4 pantallas (menú, mapa, banderas, timeline) a 720x1600 con el mismo encuadre (D-52/D-53)"
    - "Sitio (repo): reemplazar los 4 PNG crudos con los mismos nombres → npm run convert:screenshots → verificar WebP limpios → commit + deploy (HTML/sitemap sin cambios)"
  debug_session: ".planning/debug/admob-test-ads-in-gallery-captures.md"
