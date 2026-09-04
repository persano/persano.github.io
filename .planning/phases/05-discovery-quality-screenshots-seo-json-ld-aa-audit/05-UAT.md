---
status: complete
phase: 05-discovery-quality-screenshots-seo-json-ld-aa-audit
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md]
started: 2026-09-04T15:05:00Z
updated: 2026-09-04T16:51:22Z
---


## Current Test

[testing complete]

## Tests

### 1. Galería con capturas reales
expected: Abre https://persano.github.io/geohist/ — galería muestra 4 capturas reales del juego con captions, sin placeholders SVG, lazy-load al hacer scroll
result: issue
reported: "looks horrible — las capturas muestran banners de anuncios de PRUEBA de AdMob ('Anuncio de prueba' / test ad) grabados en las pantallas de la app"
severity: major

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
result: [pending]

## Summary

total: 8
passed: 7
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-05-1
  truth: "La galería de /geohist/ muestra 4 capturas limpias del juego (sin anuncios de prueba)"
  status: failed
  reason: "User reported: looks horrible — banners de anuncio de PRUEBA de AdMob ('Anuncio de prueba' / 'You've loaded a test ad from AdMob' / 'AdMob Adaptive Banner') grabados en las capturas menu + map (y presumiblemente flags + timeline)"
  severity: major
  test: 1
  artifacts: []
  missing: []
