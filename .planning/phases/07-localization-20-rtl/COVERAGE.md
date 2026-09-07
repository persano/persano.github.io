# API Coverage

No external API integration: localization-only phase (20-locale dictionaries + RTL for static HTML), no third-party surface — Firebase and Play Store integrations untouched this phase.

Detector signal override: keyword matches in phase docs are false positives —

- `07-01-PLAN.md` — prose *about* the coverage gate itself ("detector returned detected=false").
- `07-03-SUMMARY.md` — "Android 7.0（API 24）" is an Android API level inside a translated string value, not a service surface.
- `07-CONTEXT.md` — "Integration Points" is a standard context-doc section heading.
- `07-RESEARCH.md` — "TMS integration" is research prose about translation-memory tooling, not an integration built here.
