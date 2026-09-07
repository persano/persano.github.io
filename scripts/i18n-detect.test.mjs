/**
 * i18n detect() unit vectors (zero-dependency — node:test built-in).
 *
 * Tests the REAL detect() from the browser IIFE via the test-only
 * export hook (in-IIFE, inert in browsers) plus a minimal document
 * stub, so init() silently no-ops on require (its own try/catch
 * swallows the missing DOM APIs).
 *
 * Semantics locked here:
 * - D-32: EN is the terminal fallback, never a returning table entry
 *   (['en-US','es'] must still detect es — EN primary must not stop
 *   the preference-list scan).
 * - INTENTIONAL behavior change vs the hardcoded pt/es era: with zh
 *   now supported, ['zh','pt'] detects zh (first supported match wins
 *   in candidate order). Documented in the engine-wave commit; do not
 *   "fix" this vector back to pt-BR.
 * - Legacy folds: 'in'/'in-*' -> id; 'zh-*' variants -> zh.
 * - Empty/degenerate input never crashes: unknown tags (xx-YY,
 *   fil-PH) and unknown primaries return 'en'.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

globalThis.document = {
  readyState: 'complete',
  addEventListener() {},
  querySelectorAll() { return []; }
};
const require = createRequire(import.meta.url);
const { detect } = require('../js/i18n.js');

const VECTORS = [
  [['in-ID', 'en'], 'id'], [['in'], 'id'], [['zh'], 'zh'], [['zh-TW'], 'zh'],
  [['zh-Hant-CN', 'en'], 'zh'], [['zh-HK'], 'zh'],
  [['pt'], 'pt-BR'], [['pt-PT'], 'pt-BR'], [['pt-BR'], 'pt-BR'],
  [['es'], 'es'], [['es-419'], 'es'], [['de-AT'], 'de'], [['ur-PK'], 'ur'],
  [['ar-EG'], 'ar'], [['bn-BD'], 'bn'], [['fr'], 'fr'],
  [['en'], 'en'], [['en-US'], 'en'], [['xx-YY'], 'en'], [['fil-PH'], 'en'],
  [['en-US', 'es'], 'es'],   // D-32: EN primary must not stop the scan
  [['fr', 'de'], 'fr'], [['zh', 'pt'], 'zh'], // intentional change: zh now supported, first supported match wins
];

for (const [langs, expected] of VECTORS) {
  test(`detect(${JSON.stringify(langs)}) → ${expected}`, () => {
    assert.equal(detect(langs), expected);
  });
}
