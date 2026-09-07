#!/usr/bin/env node
/**
 * i18n key-coverage + value-quality gate (zero-dependency — node built-ins only).
 *
 * 1. Key parity: extracts the live data-i18n / data-i18n-attr key surface
 *    from the five keyed pages (hub /index.html, /geohist/index.html,
 *    /geohist/guide.html, /geohist/contact.html, /geohist/changelog.html),
 *    then asserts that EVERY js/i18n/*.json dictionary's key set EQUALS
 *    that surface exactly — zero missing keys, zero extra keys (Pitfall 8
 *    defense). Exact code-point string-set equality; the gate covers
 *    whatever dictionaries exist.
 *
 * 2. Value-quality hardening (Phase 7, I18N-09):
 *    a. Empty-value rejection — a value that is NOT a string or whose
 *       trim is the empty string fails the gate, in EVERY dictionary,
 *       naming the file and key.
 *    b. CJK half-width punctuation — a value containing ASCII
 *       , ! ? : ; ( ) " fails in ja.json and zh.json ONLY. Korean
 *       (ko.json) is EXEMPT: half-width punctuation is common, accepted
 *       Korean usage (documented per Phase-7 CONTEXT discretion).
 *       Exception to the rule: an ASCII period is allowed when it sits
 *       between two digits (decimals/versions like "0.88", "3.0") — all
 *       \d.\d occurrences are stripped first, then any remaining "."
 *       fails. Red-gate proven in both directions (Phase 6 precedent).
 *
 * The gate covers whatever dictionaries exist: adding a new .json file
 * extends coverage with no edits to this script.
 *
 * Exit codes: 0 = every dictionary matches exactly and passes the value
 * checks; 1 = any mismatch or unreadable/invalid input (printed with
 * missing/extra keys per file).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];
const dictDir = join(repoRoot, 'js', 'i18n');

// CJK half-width punctuation scope (see header): ja + zh only; ko exempt.
const PUNCT_LANGS = new Set(['ja.json', 'zh.json']);
// ASCII half-width punctuation never legal in zh/ja copy.
const CJK_PUNCT = /[,!?:;()"]/;
// A period is legal only between two digits (decimals/versions "0.88",
// "3.0"): strip every digit.digit run, then any remaining "." fails.
const PERIOD_BETWEEN_DIGITS = /\d\.\d/g;
function hasLoosePeriod(value) {
  return value.replace(PERIOD_BETWEEN_DIGITS, '').includes('.');
}

/**
 * Extract the key set from one page's HTML.
 * - data-i18n="key"            -> key
 * - data-i18n-attr="a:k1,b:k2" -> k1, k2 (pairs split on comma, each pair
 *   split on its FIRST colon, key side trimmed)
 * - data-i18n-attr-only yields nothing (it is a flag, not a pair)
 */
export function extractKeys(html) {
  const keys = new Set();
  const re = /data-i18n(?:-attr)?="([^"]*)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const raw = match[0];
    const value = match[1];
    if (raw.startsWith('data-i18n-attr')) {
      for (const pair of value.split(',')) {
        const colon = pair.indexOf(':');
        if (colon === -1) continue; // flag or malformed pair -> nothing
        const key = pair.slice(colon + 1).trim();
        if (key) keys.add(key);
      }
    } else {
      const key = value.trim();
      if (key) keys.add(key);
    }
  }
  return keys;
}

function main() {
  try {
    run();
  } catch (err) {
    console.error(`i18n-keycheck: FATAL — ${err.message}`);
    process.exit(1);
  }
}

function run() {
  // 1. Live key surface from markup
  const surface = new Set();
  for (const page of pages) {
    const path = join(repoRoot, page);
    if (!existsSync(path)) {
      throw new Error(`page not found: ${page}`);
    }
    for (const key of extractKeys(readFileSync(path, 'utf8'))) surface.add(key);
  }

  // 2. Dictionaries on disk
  if (!existsSync(dictDir)) {
    throw new Error(`dictionary directory missing: ${dictDir}`);
  }
  const dictFiles = readdirSync(dictDir).filter((f) => f.endsWith('.json')).sort();
  if (dictFiles.length === 0) {
    throw new Error(`no js/i18n/*.json dictionaries found (markup has ${surface.size} keys)`);
  }

  // 3. Exact set equality per dictionary
  let failed = false;
  for (const file of dictFiles) {
    let dict;
    try {
      dict = JSON.parse(readFileSync(join(dictDir, file), 'utf8'));
    } catch (err) {
      console.error(`i18n-keycheck: FAIL — ${file} is not valid JSON: ${err.message}`);
      failed = true;
      continue;
    }
    if (!dict || typeof dict !== 'object' || Array.isArray(dict)) {
      console.error(`i18n-keycheck: FAIL — ${file} is not a flat JSON object`);
      failed = true;
      continue;
    }
    // Value-quality checks (I18N-09 — see header for rules + exceptions).
    for (const [key, value] of Object.entries(dict)) {
      if (typeof value !== 'string' || value.trim() === '') {
        console.error(`i18n-keycheck: FAIL — ${file}: empty/non-string value for "${key}"`);
        failed = true;
        continue;
      }
      if (PUNCT_LANGS.has(file) && (CJK_PUNCT.test(value) || hasLoosePeriod(value))) {
        console.error(`i18n-keycheck: FAIL — ${file}: "${key}" contains half-width punctuation (${value.slice(0, 40)}…)`);
        failed = true;
      }
    }
    const dictKeys = new Set(Object.keys(dict));
    const missing = [...surface].filter((k) => !dictKeys.has(k)).sort();
    const extra = [...dictKeys].filter((k) => !surface.has(k)).sort();
    if (missing.length === 0 && extra.length === 0) {
      console.log(`i18n-keycheck: PASS — ${file} exactly covers the ${surface.size}-key live surface`);
    } else {
      failed = true;
      console.error(`i18n-keycheck: FAIL — ${file} (surface ${surface.size} keys, dictionary ${dictKeys.size} keys)`);
      if (missing.length) console.error(`  missing keys (${missing.length}): ${missing.join(', ')}`);
      if (extra.length) console.error(`  extra keys   (${extra.length}): ${extra.join(', ')}`);
    }
  }

  if (failed) {
    console.error('i18n-keycheck: dictionaries and markup have DRIFTED — fix the key surface above');
    process.exit(1);
  }
  console.log('i18n-keycheck: OK');
}

main();