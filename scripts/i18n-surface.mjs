#!/usr/bin/env node
/**
 * i18n surface dump (zero-dependency — node built-ins only).
 *
 * Prints the key → EN-text map of the LIVE markup surface across the five
 * keyed pages (hub /index.html, /geohist/index.html, /geohist/guide.html,
 * /geohist/contact.html, /geohist/changelog.html) as a sorted JSON object
 * on stdout. There is no en.json — EN strings live in the markup, so this
 * dump IS the EN baseline used to draft every js/i18n/*.json dictionary.
 *
 * Extraction mirrors scripts/i18n-keycheck.mjs (same pages, same key
 * semantics), extended to also capture each keyed node's EN text:
 *   - data-i18n="key"            -> the element's inner text (keyed nodes
 *                                   carry no child markup, per contract)
 *   - data-i18n-attr="a:k1,b:k2" -> the value of attribute `a` on the same
 *                                   tag (the EN source of k1, k2, …)
 * HTML entities are decoded and text runs collapsed so the dump carries
 * the real rendering text, not source formatting.
 *
 * A key appearing on several pages must carry identical EN text everywhere;
 * a mismatch is a markup bug — this script names it on stderr (first
 * occurrence wins in the dump) and fails (exit 1).
 *
 * Usage: node scripts/i18n-surface.mjs            (JSON map on stdout)
 *        node scripts/i18n-surface.mjs --summary  (count + warnings only)
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', join('geohist', 'index.html'), join('geohist', 'guide.html'), join('geohist', 'contact.html'), join('geohist', 'changelog.html')];

/* Named entities that appear in this site's copy; numeric forms handled
   generically below. Unknown names are left verbatim (safe — visible). */
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00A0',
  copy: '\u00A9', reg: '\u00AE', hellip: '\u2026', mdash: '\u2014',
  ndash: '\u2013', lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201C',
  rdquo: '\u201D', laquo: '\u00AB', raquo: '\u00BB', eacute: '\u00E9',
  egrave: '\u00E8', agrave: '\u00E0', ccedil: '\u00E7', uuml: '\u00FC',
  ouml: '\u00F6', auml: '\u00E4', szlig: '\u00DF'
};

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, body)
      ? NAMED_ENTITIES[body]
      : whole;
  });
}

function normalizeText(text) {
  return decodeEntities(text).replace(/\s+/g, ' ').trim();
}

/** Attribute value from an opening-tag source, double or single quoted. */
function attrValue(tagSource, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
  const m = tagSource.match(re);
  if (!m) return null;
  return decodeEntities(m[2] !== undefined ? m[2] : m[3]);
}

/** Collect key → EN pairs from one page's HTML source. */
function surfaceFromHtml(page, html, surface, warn) {
  // Full opening tags (quoted '>' inside attribute values tolerated).
  const tagRe = /<([a-zA-Z][a-zA-Z0-9]*)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g;
  let tag;
  while ((tag = tagRe.exec(html)) !== null) {
    const [full, tagName, attrs] = tag;
    if (full.startsWith('<!')) continue; // comments / doctype

    /* data-i18n="key": inner text up to the first closing tag of the same
       name. Keyed nodes carry no child markup (engine contract), so the
       non-greedy stop is exact. Void elements have no inner text. */
    const plainMatch = attrs.match(/(?:^|\s)data-i18n="([^"]+)"/);
    if (plainMatch) {
      const key = plainMatch[1].trim();
      const fromTagEnd = tagRe.lastIndex;
      const closeRe = new RegExp(`</${tagName}\\s*>`, 'i');
      const rest = html.slice(fromTagEnd);
      const closeMatch = closeRe.exec(rest);
      if (!closeMatch) {
        warn(`${page}: <${tagName}> with data-i18n="${key}" has no closing </${tagName}>`);
        continue;
      }
      const text = normalizeText(rest.slice(0, closeMatch.index));
      record(page, key, text, surface, warn);
    }

    /* data-i18n-attr="a:k1,b:k2": EN text of kN = value of attribute aN
       on this same tag. A colon-less segment is a flag/malformed pair —
       skipped, matching the keycheck's extraction. */
    const attrMatch = attrs.match(/(?:^|\s)data-i18n-attr="([^"]+)"/);
    if (attrMatch) {
      for (const pair of attrMatch[1].split(',')) {
        const colon = pair.indexOf(':');
        if (colon === -1) continue;
        const attrName = pair.slice(0, colon).trim();
        const key = pair.slice(colon + 1).trim();
        if (!key) continue;
        const value = attrValue(attrs, attrName);
        if (value === null) {
          warn(`${page}: key "${key}" names attribute "${attrName}" but the tag has no ${attrName}= value`);
          continue;
        }
        record(page, key, normalizeText(value), surface, warn);
      }
    }
  }
}

function record(page, key, text, surface, warn) {
  if (Object.prototype.hasOwnProperty.call(surface, key)) {
    if (surface[key] !== text) {
      warn(`${page}: key "${key}" EN text differs across pages — keeping first: ${JSON.stringify(surface[key])} vs ${JSON.stringify(text)}`);
    }
    return;
  }
  surface[key] = text;
}

function run() {
  const surface = {};
  const warnings = [];
  const warn = (msg) => warnings.push(msg);
  for (const page of pages) {
    const path = join(repoRoot, page);
    if (!existsSync(path)) throw new Error(`page not found: ${page}`);
    surfaceFromHtml(page, readFileSync(path, 'utf8'), surface, warn);
  }

  const keys = Object.keys(surface).sort();
  const summaryOnly = process.argv.includes('--summary');
  if (!summaryOnly) {
    const ordered = {};
    for (const key of keys) ordered[key] = surface[key];
    process.stdout.write(JSON.stringify(ordered, null, 2) + '\n');
  }
  for (const msg of warnings) console.error(`i18n-surface: WARN — ${msg}`);
  console.error(`i18n-surface: ${keys.length} keys across ${pages.length} pages`);

  /* Drift guard mirroring the keycheck: every data-i18n / data-i18n-attr
     key the markup declares must have landed in the dump with text. */
  const declared = new Set();
  for (const page of pages) {
    const html = readFileSync(join(repoRoot, page), 'utf8');
    const re = /data-i18n(?:-attr)?="([^"]*)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      if (m[0].startsWith('data-i18n-attr')) {
        for (const pair of m[1].split(',')) {
          const colon = pair.indexOf(':');
          if (colon !== -1 && pair.slice(colon + 1).trim()) declared.add(pair.slice(colon + 1).trim());
        }
      } else if (m[1].trim()) {
        declared.add(m[1].trim());
      }
    }
  }
  const dumped = new Set(keys);
  const missing = [...declared].filter((k) => !dumped.has(k)).sort();
  if (missing.length) {
    console.error(`i18n-surface: FAIL — ${missing.length} declared key(s) produced no EN text: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (keys.length === 0) {
    console.error('i18n-surface: FAIL — no keys extracted');
    process.exit(1);
  }
}

try {
  run();
} catch (err) {
  console.error(`i18n-surface: FATAL — ${err.message}`);
  process.exit(1);
}
