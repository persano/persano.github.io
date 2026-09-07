#!/usr/bin/env node
/**
 * check-no-old-domain.mjs — permanent CI gate against legacy-host
 * regression (Phase 8, HOST-02 / D-06). Zero-dependency: node built-ins
 * only (node:fs / node:path).
 *
 * Walks the repo from its root and fails the validate job if ANY line of
 * any text file still references the legacy GitHub Pages host — the host
 * string is assembled at runtime (["persano","github","io"].join("."))
 * so this script's own source never contains the literal and cannot
 * self-trip after the rewrite; the source must stay grep-clean like
 * every other tracked file.
 *
 * Allowlist (exact, readable — grow only via a visible diff and only for
 * factual-identifier surfaces):
 *   .planning    historical planning docs (publicly served, out of scope)
 *   README.md    repo-name heading is a factual identifier
 *   AGENTS.md    hosting documentation
 *   .git         repository metadata
 *   node_modules npm tooling
 *
 * Hidden directories (any entry starting with ".") are additionally
 * skipped wholesale: they are tooling state (.git, .planning, .serena
 * cache, agent runtimes), never site content. This mirrors the rg
 * acceptance, which ignores gitignored/untracked tooling paths.
 *
 * Binary safety: any file whose first 8 KiB contain a NUL byte is
 * treated as binary and skipped (og-image.png, .webp screenshots, ...)
 * so the walk never crashes or mis-reports on media assets.
 *
 * Exit codes: 0 = no legacy-host line found; 1 = at least one hit
 * (file:line list printed to stderr — the acceptance is a ZERO-hit set,
 * never a magic ref count).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';

const LEGACY_HOST = ['persano', 'github', 'io'].join('.');
const ALLOW = new Set(['.planning', 'README.md', 'AGENTS.md', '.git', 'node_modules']);

// Repo root = parent of scripts/ (process.argv[1] is the executed
// script's resolved path) — cwd-independent, no node:url import needed.
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
    console.error(`check-no-old-domain: WARN — unreadable ${displayPath(absPath)}: ${err.message}`);
    return;
  }
  const probeEnd = Math.min(buf.length, 8192);
  for (let i = 0; i < probeEnd; i++) {
    if (buf[i] === 0) return; // binary-ish (NUL byte in first chunk) — skip
  }
  const lines = buf.toString('utf8').split(/\r\n|\n|\r/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(LEGACY_HOST)) {
      hits.push(`${displayPath(absPath)}:${i + 1}`);
    }
  }
}

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`check-no-old-domain: WARN — cannot read ${displayPath(dir)}: ${err.message}`);
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
  console.error('Old-domain refs found:');
  for (const hit of hits) console.error(`  ${hit}`);
  console.error('check-no-old-domain: FAIL — rewrite every legacy-host line to the apex (same path) or, only for factual-identifier surfaces, extend ALLOW via a visible diff.');
  process.exit(1);
}
console.log('check-no-old-domain: OK');
