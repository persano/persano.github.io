# API Coverage

External-API phase — the GitHub Pages REST API is a real integration surface this phase (D-12: agent applies Pages domain config + HTTPS enforce via `gh api`). Matrix below; default is INTEGRATE.

| capability | decision | reason |
|------------|----------|--------|
| GitHub Pages REST API — `GET`/`PUT /repos/persano/persano.github.io/pages` | INTEGRATE | Core mechanism for HOST-01 HTTPS enforce + domain state reads (D-12); PUT is the current documented verb (PATCH is deprecated) |
| `gh` CLI as API transport (`gh api`) | INTEGRATE | Already-authenticated transport for the Pages API in the deploy context; no new auth surface |
| DNS probes (`Resolve-DnsName` A/AAAA/CNAME/TXT) | INTEGRATE | HOST-01 DNS-shape verification surface recommended by GitHub docs for Windows |
| HTTP probes via `curl` (status/redirect/headers) | INTEGRATE | 301/cert/enforce verification + `smoke-check.sh` runtime — the D-09 green gate |
| Firebase console — Auth authorized domains + API-key HTTP-referrer restriction | OPT-OUT — owner console UI only | D-11 assigns console steps to the owner via 08-RUNBOOK.md; no programmatic Firebase Admin/API call exists in this phase's scope and none should be built (zero new deps) |
| Google Search Console — Domain property, sitemap resubmit, Change of Address | OPT-OUT — owner console UI only | D-07/D-09/D-10 are owner console flows; GSC API is not integrated and the phase boundary keeps it that way |
| Registrar zone editing (Spaceship) — AAAA×4 add | OPT-OUT — owner registrar UI | Zone lives at the owner's registrar account (Architectural Responsibility Map); agent verifies via DNS probes only |
