#!/usr/bin/env node
// scripts/a11y-audit.mjs — Phase 05 WCAG 2.1 AA automated gate (A11Y-01).
//
// Battery design (05-03-PLAN.md Task 1, discretion: single script):
//   1. Spawns a static file server bound to 127.0.0.1 on an ephemeral port,
//      serving the REPO ROOT — pages use absolute /css and /js paths, so a
//      file-scheme scan would break (Pitfall 7). Never scans file:// URLs.
//   2. For each of the 5 content URLs runs:
//        - axe via @axe-core/webdriverjs 4.13.0 (local pinned devDep, same
//          engine @axe-core/cli wraps) driving headless Chrome over the
//          local URL, returning the raw axe JSON. The @axe-core/cli spawn
//          path hangs on this machine (chromedriver/Chrome launch — see
//          05-03 SUMMARY deviation); the webdriverjs API produces the
//          identical axe results object, gated here on critical/serious.
//        - lighthouse (local pinned devDep CLI) with
//          --only-categories=accessibility; JSON report under reports/.
//          The JSON report file is the source of truth — Lighthouse can
//          exit non-zero after a successful run on Windows (temp-dir
//          cleanup EPERM race after Chrome kill), so only a missing or
//          unparseable report is a hard error.
//   3. Gate per page: axe critical == 0 AND serious == 0 AND
//      Lighthouse accessibility score >= 95.
//   4. Writes reports/a11y-summary.json (per-page impact counts + LH score
//      + pass/fail), prints a human-readable table, exits non-zero if any
//      page fails. reports/ is gitignored (generated evidence).

import http from 'node:http';
import os from 'node:os';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webdriver from 'selenium-webdriver';
import chromeDriverApi from 'selenium-webdriver/chrome.js';
import { AxeBuilder } from '@axe-core/webdriverjs';

// IPv4-first DNS for any network resolution inside this process tree
// (machine quirk: IPv6 stalls — see 05-01 deviation).
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '--dns-result-order=ipv4first';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORTS_DIR = path.join(ROOT, 'reports');
const LH_MIN = 95;
const LH_TIMEOUT_MS = 150000;

// System Chrome (Pitfall 7 fallback path; axe's Chrome + Lighthouse both use it).
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(CHROME)) {
  console.error(`FATAL: Chrome not found at ${CHROME} (needed by axe + Lighthouse)`);
  process.exit(2);
}

const LH_CLI = path.join(ROOT, 'node_modules', 'lighthouse', 'cli', 'index.js');
if (!fs.existsSync(LH_CLI)) {
  console.error(`FATAL: pinned lighthouse CLI missing: ${LH_CLI}`);
  process.exit(2);
}

const PAGES = [
  { url: '/', slug: 'root' },
  { url: '/geohist/', slug: 'geohist' },
  { url: '/geohist/guide.html', slug: 'geohist-guide' },
  { url: '/geohist/contact.html', slug: 'geohist-contact' },
  { url: '/geohist/privacy.html', slug: 'geohist-privacy' },
];

// --- static file server (repo root) --------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8',
};

function serveFile(res, absPath) {
  const ext = path.extname(absPath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(absPath).pipe(res);
}

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
      const resolved = path.resolve(ROOT, rel);
      if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
        res.writeHead(403);
        res.end('forbidden');
        return;
      }
      let target = resolved;
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        target = path.join(target, 'index.html');
      }
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
        return;
      }
      serveFile(res, target);
    } catch (err) {
      res.writeHead(500);
      res.end('server error');
    }
  });
  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
    server.on('error', reject);
  });
}

// --- headless Chrome session (axe driver) ---------------------------------

// Deterministic chromedriver: prefer SeleniumManager's cached driver (offline,
// version-matched at first resolution) over its runtime re-resolution, which
// can stall on this machine's network. Bundled npm chromedriver is the last
// resort (may be a minor-version mismatch — logged).
function resolveCachedChromedriver() {
  const driverDirs = process.platform === 'win32'
    ? ['chromedriver\\win64', 'chromedriver\\win32']
    : ['chromedriver/linux64', 'chromedriver/mac-arm64'];
  for (const rel of driverDirs) {
    const dir = path.join(os.homedir(), '.cache', 'selenium', rel);
    try {
      const versions = fs.readdirSync(dir)
        .filter((d) => /^\d/.test(d))
        .sort((a, b) => b.localeCompare(a));
      for (const v of versions) {
        const exe = path.join(dir, v, process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver');
        if (fs.existsSync(exe)) return exe;
      }
    } catch { /* dir missing — try next */ }
  }
  const bundled = path.join(ROOT, 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');
  if (fs.existsSync(bundled)) return bundled;
  return null; // let SeleniumManager resolve
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)),
  ]);
}

async function startDriver() {
  const cached = resolveCachedChromedriver();
  console.log(`chromedriver: ${cached || 'SeleniumManager auto-resolve (network — flaky on this machine)'}`);
  const service = cached ? new chromeDriverApi.ServiceBuilder(cached) : new chromeDriverApi.ServiceBuilder();
  const options = new chromeDriverApi.Options();
  options.setBinaryPath(CHROME);
  options.addArguments('--headless=new', '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check');
  const driver = await withTimeout(
    new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build(),
    90000,
    'chrome driver launch'
  );
  await driver.manage().setTimeouts({ script: 90000, pageLoad: 60000 });
  return driver;
}

async function runAxe(driver, url) {
  try {
    await driver.get(url);
    await driver.sleep(500); // let the consent banner / i18n default settle (shipped default state)
    const results = await new AxeBuilder(driver).analyze();
    const counts = { critical: 0, serious: 0, moderate: 0, minor: 0, incomplete: 0 };
    for (const v of results.violations) {
      const impact = v.impact || 'minor';
      if (impact in counts) counts[impact] += v.nodes ? v.nodes.length : 0;
    }
    counts.incomplete = Array.isArray(results.incomplete)
      ? results.incomplete.reduce((n, v) => n + (v.nodes ? v.nodes.length : 0), 0)
      : 0;
    const rules = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes ? v.nodes.length : 0,
      help: v.help,
    }));
    const incompleteRules = (results.incomplete || []).map((v) => v.id);
    return { ok: true, counts, rules, incompleteRules };
  } catch (e) {
    return {
      ok: false,
      error: `axe analysis failed: ${e && e.message}`,
      counts: { critical: 0, serious: 0, moderate: 0, minor: 0, incomplete: 0 },
      rules: [],
      incompleteRules: [],
    };
  }
}

// --- Lighthouse -------------------------------------------------------------

function runLighthouse(url, slug) {
  return new Promise((resolve) => {
    const outPath = path.join(REPORTS_DIR, `${slug}-lh.json`);
    const chromeFlags = '--headless=new --disable-dev-shm-usage --no-first-run --no-default-browser-check';
    const args = [
      LH_CLI,
      url,
      '--only-categories=accessibility',
      '--output=json',
      `--output-path=${outPath}`,
      `--chrome-flags=${chromeFlags}`,
      '--max-wait-for-load=60000',
      '--quiet',
    ];
    // stdio:ignore avoids the Windows pipe-inheritance hang where lingering
    // Chrome handles keep spawnSync's pipes open after Lighthouse exits.
    const child = spawn(process.execPath, args, {
      cwd: ROOT,
      stdio: 'ignore',
      env: { ...process.env, CHROME_PATH: CHROME },
    });
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch { /* already gone */ }
      resolve({ ok: false, error: `lighthouse timed out after ${LH_TIMEOUT_MS / 1000}s (no report written)`, score: 0, failed: [] });
    }, LH_TIMEOUT_MS);
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, error: `lighthouse spawn error: ${err.message}`, score: 0, failed: [] });
    });
    child.on('exit', () => {
      clearTimeout(timer);
      if (!fs.existsSync(outPath)) {
        resolve({ ok: false, error: 'lighthouse wrote no report', score: 0, failed: [] });
        return;
      }
      let report;
      try {
        report = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      } catch (e) {
        resolve({ ok: false, error: `lighthouse report unparseable: ${e.message}`, score: 0, failed: [] });
        return;
      }
      if (report.runtimeError) {
        resolve({ ok: false, error: `lighthouse runtime error: ${report.runtimeError.message}`, score: 0, failed: [] });
        return;
      }
      const cat = report.categories && report.categories.accessibility;
      if (!cat || typeof cat.score !== 'number') {
        resolve({ ok: false, error: 'lighthouse accessibility category missing', score: 0, failed: [] });
        return;
      }
      const failed = [];
      for (const ref of cat.auditRefs || []) {
        const a = report.audits[ref.id];
        if (a && a.score !== null && a.score < 1) {
          failed.push({ id: a.id, score: a.score, displayValue: a.displayValue || '' });
        }
      }
      resolve({ ok: true, score: Math.round(cat.score * 100), failed });
    });
  });
}

// --- main -------------------------------------------------------------------

function pad(s, n) {
  return (s.length >= n ? s.slice(0, n - 1) + ' ' : s + ' '.repeat(n - s.length));
}

(async () => {
  fs.rmSync(REPORTS_DIR, { recursive: true, force: true });
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const { server, port } = await startServer();
  console.log(`Serving repo root at http://127.0.0.1:${port}/ (no file-scheme scans — Pitfall 7)`);

  let driver;
  const results = [];
  try {
    driver = await startDriver();
    for (const page of PAGES) {
      const url = `http://127.0.0.1:${port}${page.url}`;
      console.log(`\nScanning ${page.url}`);
      const axe = await runAxe(driver, url);
      const lh = await runLighthouse(url, page.slug);
      const axePass = axe.ok && axe.counts.critical === 0 && axe.counts.serious === 0;
      const lhPass = lh.ok && lh.score >= LH_MIN;
      results.push({
        url: page.url,
        axe: axe.ok ? axe.counts : { ...axe.counts, error: axe.error },
        axeRules: axe.ok ? axe.rules : [],
        axeIncompleteRules: axe.ok ? axe.incompleteRules : [],
        lighthouse: lh.ok ? lh.score : 0,
        lhFailedAudits: lh.ok ? lh.failed : [{ id: 'lighthouse', displayValue: lh.error }],
        pass: axePass && lhPass,
      });
      console.log(`  axe: critical=${axe.counts.critical} serious=${axe.counts.serious} moderate=${axe.counts.moderate} minor=${axe.counts.minor} incomplete=${axe.counts.incomplete}`);
      console.log(`  lighthouse a11y: ${lh.ok ? lh.score : 'ERROR ' + lh.error}`);
      if (axe.ok && axe.rules.length) {
        for (const r of axe.rules) console.log(`  axe rule ${r.id} [${r.impact}] nodes=${r.nodes}`);
      }
      if (lh.ok && lh.failed.length) {
        for (const f of lh.failed) console.log(`  lh fail: ${f.id} ${f.displayValue}`);
      }
    }
  } finally {
    if (driver) { try { await driver.quit(); } catch { /* best effort */ } }
    server.close();
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    server: 'http://127.0.0.1 (ephemeral port, repo root)',
    gate: { axe: 'critical == 0 && serious == 0', lighthouseAccessibilityMin: LH_MIN },
    pages: results,
    allPass: results.every((p) => p.pass),
  };
  fs.writeFileSync(path.join(REPORTS_DIR, 'a11y-summary.json'), JSON.stringify(summary, null, 2));

  console.log('\n===== A11Y AA BATTERY =====');
  console.log(pad('page', 26) + pad('axe crit/ser', 14) + pad('LH a11y', 10) + 'pass');
  for (const p of results) {
    console.log(
      pad(p.url, 26) +
        pad(`${p.axe.critical || 0}/${p.axe.serious || 0}`, 14) +
        pad(String(p.lighthouse), 10) +
        (p.pass ? 'PASS' : 'FAIL')
    );
  }
  console.log('===========================');
  console.log(summary.allPass ? 'BATTERY: ALL PASS' : 'BATTERY: FAILED');
  process.exit(summary.allPass ? 0 : 1);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(2);
});
