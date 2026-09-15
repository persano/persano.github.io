---
phase: 14-launch-kit
plan: 01
subsystem: ci-gates
tags: [lkit-03, ci-gate, play-urls, red-gate-proof, zero-dependency]
requires:
  - "Phase 13 close state (root landing, 3 canonical Play URLs in index.html)"
provides:
  - "scripts/check-play-link.mjs — URL-shaped Play-URL package-id gate (LKIT-03)"
  - "package.json validate:play-links stage between validate:domain and validate:links (6-stage chain)"
  - ".planning/phases/14-launch-kit/red-gate-proof.md — 6 cycles + EA-05 addendum, both directions"
affects:
  - "14-02 (runbook/UAT/RECORDS) — references this gate name and its red-gate-proof closing hashes"
tech-stack:
  added: []
  patterns: ["repo-walk allowlist gate (check-no-old-domain.mjs pattern)", "URL-shaped needle regex + package-id requirement", "snapshot-copy red-gate restore with sha256 verification"]
key-files:
  created:
    - scripts/check-play-link.mjs
    - .planning/phases/14-launch-kit/red-gate-proof.md
  modified:
    - package.json
decisions:
  - "Gate scope = tracked-text walk with ALLOW {'.planning','README.md','.git','node_modules'} (EA-01) — .planning/ historical records verbatim-immutable, exclusion documented in the script header as do-not-fix"
  - "http:// scheme Play URLs FAIL (EA-05, PITFALLS.md:163 adopted in full) — verified by post-fix addendum cycle A"
  - "Scheme verdict reads the line prefix before the needle match (match starts at the host; scheme lives before it)"
  - "Deferred-commit mode honored: code pair stays uncommitted for /gsd-ship; planned subjects recorded in the ledger below"
metrics:
  duration: 17min
  completed: 2026-09-15
  tasks: 2
  files: 3
status: complete
deferred_commit: true
actuals:
  tokens: 5200
  tasks: 2
  commits: 0
---

# Phase 14 Plan 01: Play Package-ID Gate Summary

**One-liner:** LKIT-03 CI gate (`check-play-link.mjs`) — every URL-shaped play.google.com URL in the walked tree must carry `details?id=com.persano.geohisttrivia`; wired as the 3rd of 6 validate stages; proven in both directions with 6 red-gate cycles + an EA-05 http-scheme addendum.

## What Was Built

### Task 1 — Tracer: gate + validate-chain slot (positive control green)

- **`scripts/check-play-link.mjs` (NEW, zero-dependency — node:fs/node:path only):** structurally mirrors `scripts/check-no-old-domain.mjs` (same walk, ALLOW set `{'.planning','README.md','.git','node_modules'}`, hidden-entry skip, NUL-byte binary skip in first 8 KiB, cwd-independent repo root from `process.argv[1]`). Per-line URL-shaped needle `/play\.google\.com\/[^\s"'<>\\)]+/g` — the slash-path requirement keeps the two bare-domain mentions (package.json `--skip "play.google.com"` flag, index.html:23 comment prose) as NON-hits. A match fails iff, after `&amp;`/`&#38;` normalization, it lacks `details?id=com.persano.geohisttrivia`, or its line prefix (before the match) ends with `http://`. Hits print `file:line — match` to stderr, exit 1; clean tree prints `check-play-link: OK`, exit 0. Header documents the `.planning/` exclusion as DO-NOT-FIX (verbatim-immutable historical records legitimately carry id-less Play URLs — EA-01) and the self-pass contract (the script's own URL-shaped literals spell the full canonical package URL).
- **`package.json` (exactly 2 hunks):** new script key `"validate:play-links": "node scripts/check-play-link.mjs"` immediately after `validate:domain`; `validate` chain extended 5 → 6 stages in the order html, domain, play-links, links, i18n-detect, i18n. `validate:links` value byte-unchanged (linkinator Play skip preserved — prohibition 1).
- Positive control: `check-play-link: OK` on the current tree; full `npm run validate` exit 0; `git diff -- index.html` empty.

### Task 2 — Red-gate proof (6 cycles + addendum, both directions)

Recorded in `.planning/phases/14-launch-kit/red-gate-proof.md` (snapshot-copy restore only, sha256-verified, per-cycle distinct snapshot names under `C:/Users/Familia/AppData/Local/Temp/opencode/redgate14/`, temp dir removed at close):

| Cycle | Mutation | Result |
|-------|----------|--------|
| 1 | none (positive control) | PASS — bare mentions do not trip |
| 2 | index.html:83 id → `com.example.wrong` | FAIL at `index.html:83` → restore `425f1fde144f5ef8` → PASS |
| 3 | index.html:87 href → bare `store/apps/` path | FAIL at `index.html:87` → restore → PASS |
| 4 | index.html:83 + `&hl=en` | PASS (id mandatory, params allowed) → restore → PASS |
| 5 | index.html:83 escaped `&amp;hl=en` | PASS (normalization) → restore → PASS |
| 6 | scratch `geohist/gate-probe.html` with `download?id=` form | FAIL at `geohist/gate-probe.html:4` → deleted → PASS; `Test-Path` False |
| A (addendum, EA-05) | index.html:83 scheme `https` → `http` (id intact) | FAIL at `index.html:83` → restore → PASS |

Closing state: `scripts/check-play-link.mjs` `25d033fbd4f1f260…` (post-fix), `package.json` `095a9ca607414c79…`, `index.html` `425f1fde144f5ef8…` (byte-identical to the Phase 13 close-state prefix); `npm run validate` exit 0; zero git-restore mentions in the proof (`rg -c` → 0); scratch probe absent.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Dead http-scheme check (would have made EA-05 silently false)**
- **Found during:** Task 2 (addendum-cycle preparation)
- **Issue:** the Task 1 script tested `m[0].startsWith('http://…')`, but the needle match itself always begins at `play.google.com` — the condition was unreachable, so an insecure-scheme Play URL would have shipped green.
- **Fix:** scheme verdict reads the line prefix before the match (`lines[i].slice(0, m.index)` lowercased, `endsWith('http://')`); scheme constant narrowed to the bare literal. Two intermediate script hashes (`3815bd97…` → `8c29448f…` → `25d033fb…`) honestly recorded in red-gate-proof.md; positive control re-run green at the final bytes; addendum cycle A proves the FAIL direction. Cycles 2–6 evidence unaffected (missing-id logic untouched).
- **Bonus proof:** the first fix's explanatory comment briefly contained a URL-shaped literal without the id — the gate's self-scan caught its own source (`scripts/check-play-link.mjs:100`); comment rewritten prose-only.
- **Files modified:** scripts/check-play-link.mjs

**2. [Execution-mode note] Per-task code commits not made (deferred-commit mode)**
- The execution prompt asked for atomic per-task commits, but this plan, AGENTS.md, and the project's deferred-commit mode all specify: code changes stay uncommitted during plan execution and /gsd-ship lands them. Planned subjects are preserved in the Deferred Commits ledger below (Phase 13 precedent: docs commit at plan close, code commit at ship).

### Tooling lesson (no file damage)

PowerShell .NET file APIs must receive ABSOLUTE paths in this harness: a relative-path `[System.IO.File]::ReadAllText('index.html')` silently read nothing useful (split count collapsed); the cycle-2 throw fired before any write, hash verified intact (`425f1fde144f5ef8`), and all subsequent I/O used absolute paths + `.Split([char]10)` / `Join` to preserve LF endings. No restore needed; recorded here for future plans.

## Known Stubs

None — no stub patterns introduced (gate is a complete zero-dependency implementation; no placeholder data paths).

## Threat Flags

None new — the gate is a read-only text scanner (no network endpoints, auth paths, or schema at trust boundaries); red-gate-proof.md is public-by-design and contains only gate outputs, hashes, and the public-by-design package id (T-14-01/02/03 mitigations all verified).

## Verification Evidence (verbatim, closing run)

```
node scripts/check-play-link.mjs
check-play-link: OK
GATE_EXIT=0
```

`npm run validate` — 6 stages (html, domain, play-links, links, i18n-detect, i18n), last 30 lines:

```
ℹ pass 23
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 82.4739

> validate:i18n
> node scripts/i18n-keycheck.mjs

i18n-keycheck: PASS — ar.json exactly covers the 178-key live surface
i18n-keycheck: PASS — bn.json exactly covers the 178-key live surface
i18n-keycheck: PASS — de.json exactly covers the 178-key live surface
i18n-keycheck: PASS — el.json exactly covers the 178-key live surface
i18n-keycheck: PASS — es.json exactly covers the 178-key live surface
i18n-keycheck: PASS — fr.json exactly covers the 178-key live surface
i18n-keycheck: PASS — hi.json exactly covers the 178-key live surface
i18n-keycheck: PASS — id.json exactly covers the 178-key live surface
i18n-keycheck: PASS — it.json exactly covers the 178-key live surface
i18n-keycheck: PASS — ja.json exactly covers the 178-key live surface
i18n-keycheck: PASS — ko.json exactly covers the 178-key live surface
i18n-keycheck: PASS — nl.json exactly covers the 178-key live surface
i18n-keycheck: PASS — pl.json exactly covers the 178-key live surface
i18n-keycheck: PASS — pt-BR.json exactly covers the 178-key live surface
i18n-keycheck: PASS — ru.json exactly covers the 178-key live surface
i18n-keycheck: PASS — tr.json exactly covers the 178-key live surface
i18n-keycheck: PASS — ur.json exactly covers the 178-key live surface
i18n-keycheck: PASS — vi.json exactly covers the 178-key live surface
i18n-keycheck: PASS — zh.json exactly covers the 178-key live surface
i18n-keycheck: OK
VALIDATE_EXIT=0
```

## Deferred Commits

All code changes uncommitted — will be committed by /gsd-ship. Planned subjects + files:

- `feat(launch-kit): play package-id CI gate wired into validate chain (check-play-link.mjs)` — files: `scripts/check-play-link.mjs` (new), `package.json` (2 hunks)
- `docs(14): red-gate proof — play package-id gate, 6 cycles both directions` — files: `.planning/phases/14-launch-kit/red-gate-proof.md`

(The plan's docs bookkeeping — this SUMMARY, STATE.md, ROADMAP.md, REQUIREMENTS.md — rides the plan-close docs commit per the Phase 13 precedent.)

## Self-Check: PASSED

- `scripts/check-play-link.mjs` exists (hash `25d033fbd4f1f26066f51ad3c35a68fdb9fcada5fe023af3e5be472657392996`)
- `package.json` carries the 2 planned hunks (hash `095a9ca607414c79be1c1b85682c32a3487c2ab20a320f89f3ba7e7ba1f49626`); `validate:links` byte-unchanged
- `index.html` byte-untouched (hash `425f1fde144f5ef8eb609fc29242533cdf922b8e423404f8d672270a44834782`)
- `.planning/phases/14-launch-kit/red-gate-proof.md` exists with 6 cycles + addendum A, hash pairs equal, zero git-restore mentions
- `node scripts/check-play-link.mjs` → OK exit 0; `npm run validate` → exit 0; `geohist/gate-probe.html` absent
