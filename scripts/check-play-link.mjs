#!/usr/bin/env node
/**
 * check-play-link.mjs — permanent CI gate pinning every Google Play URL to
 * the canonical package form (Phase 14, LKIT-03). Zero-dependency: node
 * built-ins only (node:fs / node:path).
 *
 * Purpose: every URL-shaped play.google.com URL in the walked tree must
 * carry the package id in the canonical parameter form:
 *
 *   https://play.google.com/store/apps/details?id=com.persano.geohisttrivia
 *
 * The needle is URL-SHAPED: the host must be followed by a slash-path
 * (play.google.com/<path>). Bare-domain mentions carry no path and are
 * NOT hits — the `--skip "play.google.com"` linkinator flag in
 * package.json and comment prose like "ratings live on play.google.com"
 * stay green. A naive substring gate would red the tree on those bare
 * mentions; this gate does not.
 *
 * A matched URL FAILS iff (a) after HTML-ampersand normalization
 * (&amp;/&#38; -> &amp-entities unescaped) it does not contain
 * details?id=com.persano.geohisttrivia, or (b) it uses the insecure
 * http:// scheme for this host (canonical form is https only —
 * .planning/research/PITFALLS.md row 163). Non-canonical id-bearing
 * forms (store/apps/download?id=... etc.) fail too: the details?id=
 * form is the only sanctioned one.
 *
 * SCOPE — DO NOT "FIX" THIS EXCLUSION: .planning/ is allowlisted, so
 * historical planning records are OUT of gate scope ON PURPOSE. Those
 * records are verbatim-immutable (supersession policy: original text
 * stays verbatim; only dated bracketed corrections may append) and
 * legitimately contain id-less Play URLs (v1 badge-asset intl URLs,
 * illustrative details?id=...&hl= forms). Extending the gate over
 * .planning/ would force a FAIL on the current tree (vacuous gate) or
 * forbidden edits of historical records. README.md / .git /
 * node_modules follow the check-no-old-domain.mjs allowlist precedent.
 * The protection target is the served site tree plus root docs and
 * scripts (AGENTS.md is NOT allowlisted — a Play URL added there must
 * carry the id too).
 *
 * Self-scan note: the walk scans this script's own source. Every
 * URL-shaped literal in this file spells the full canonical package URL
 * (id included) and therefore self-passes; other comments stay
 * prose-only, and the needle regex literal is backslash-escaped source
 * text that cannot match itself.
 *
 * Hidden directories (entries starting with ".") are skipped wholesale —
 * tooling state, never site content. Binary safety: a NUL byte in the
 * first 8 KiB marks a binary file (images) which is skipped.
 *
 * Exit codes: 0 = zero failing Play URLs ("check-play-link: OK" — the
 * acceptance is a ZERO-hit set, never a magic ref count; a tree with no
 * URL-shaped Play URLs is trivially OK). 1 = at least one hit
 * (file:line + match list printed to stderr).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';

const PACKAGE_ID = 'com.persano.geohisttrivia';
const REQUIRED = `details?id=${PACKAGE_ID}`;
const HTTP_SCHEME = 'http://';
const NEEDLE = /play\.google\.com\/[^\s"'<>\\)]+/g;
const ALLOW = new Set(['.planning', 'README.md', '.git', 'node_modules']);

// Repo root = parent of scripts/ (process.argv[1] is the executed
// script's resolved path) — cwd-independent, identical to
// check-no-old-domain.mjs.
const repoRoot = process.argv[1]
  ? join(dirname(process.argv[1]), '..')
  : process.cwd();

const hits = [];

function displayPath(absPath) {
  return absPath.slice(repoRoot.length + 1).split(sep).join('/');
}

function scanFile(absPath) {
  let buf;
  try {
    buf = readFileSync(absPath);
  } catch (err) {
    console.error(`check-play-link: WARN — unreadable ${displayPath(absPath)}: ${err.message}`);
    return;
  }
  const probeEnd = Math.min(buf.length, 8192);
  for (let i = 0; i < probeEnd; i++) {
    if (buf[i] === 0) return; // binary-ish (NUL byte in first chunk) — skip
  }
  const lines = buf.toString('utf8').split(/\r\n|\n|\r/);
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(NEEDLE)) {
      // Belt-and-suspenders normalization: HTML-escaped ampersands must
      // not false-fail a URL whose later params are escaped. The id
      // param is first in the canonical form and its value never
      // escapes, so the id token survives either way.
      const norm = m[0].replace(/&amp;/g, '&').replace(/&#38;/g, '&');
      // Scheme check reads the LINE PREFIX before the match: the needle
      // match itself always begins at the host, so the insecure-scheme
      // verdict lives in the characters immediately preceding it — a URL
      // written as http://play.google.com followed by a slash-path has
      // the prefix http://.
      const isHttp = lines[i].slice(0, m.index).toLowerCase().endsWith(HTTP_SCHEME);
      if (!norm.includes(REQUIRED) || isHttp) {
        hits.push(`${displayPath(absPath)}:${i + 1} — ${m[0]}`);
      }
    }
  }
}

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`check-play-link: WARN — cannot read ${displayPath(dir)}: ${err.message}`);
    return;
  }
  for (const entry of entries) {
    if (ALLOW.has(entry.name)) continue;
    if (entry.name.startsWith('.')) continue; // hidden = tooling state (see header)
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs);
    else if (entry.isFile()) scanFile(abs);
  }
}

walk(repoRoot);

if (hits.length > 0) {
  console.error('Play URLs missing package id:');
  for (const hit of hits) console.error(`  ${hit}`);
  console.error('check-play-link: FAIL — every URL-shaped play.google.com URL must use the canonical form');
  console.error('  https://play.google.com/store/apps/details?id=com.persano.geohisttrivia');
  process.exit(1);
}
console.log('check-play-link: OK');
