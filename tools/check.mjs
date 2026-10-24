#!/usr/bin/env node
// External judge for harness-probe.
// Usage: node tools/check.mjs <path/to/index.html> [--out <dir>] [--json <file>]
// Opens the file in headless Chromium (Playwright), waits 8 s, collects console.error
// and uncaught page errors, screenshots at t=0 / 3 s / 8 s (1280x720), prints JSON.
// It deliberately does nothing else: no key presses, no clicks. Interaction checks are
// the builder's job; this script only answers "does it run, and what does it look like".

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

function loadPlaywright() {
  const candidates = [
    () => createRequire(import.meta.url)('playwright'),
    () => createRequire(path.join(process.cwd(), '/'))('playwright'),
    () => createRequire('/opt/node-tools/node_modules/')('playwright'),
  ];
  for (const c of candidates) { try { return c(); } catch {} }
  throw new Error('playwright not found; set NODE_PATH or install it');
}

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
if (!file) { console.error('usage: check.mjs <index.html> [--out dir] [--json file]'); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const abs = path.resolve(file);
const outDir = path.resolve(opt('--out', path.dirname(abs)));
const jsonOut = opt('--json', path.join(outDir, 'check.json'));
fs.mkdirSync(outDir, { recursive: true });

const src = fs.readFileSync(abs, 'utf8');
const result = {
  file: path.relative(process.cwd(), abs),
  checked_at: new Date().toISOString(),
  file_lines: src.split('\n').length,
  file_kb: +(Buffer.byteLength(src, 'utf8') / 1024).toFixed(1),
  console_error_count: 0,
  runs_without_console_error: false,
  errors: [],
  warnings: [],
  failed_requests: [],
  screenshots: {},
};

const { chromium } = loadPlaywright();
const launch = { args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] };
if (process.env.HTTPS_PROXY) launch.proxy = { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' };
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

page.on('console', m => {
  const t = m.type();
  if (t === 'error') result.errors.push({ kind: 'console.error', text: m.text() });
  else if (t === 'warning') result.warnings.push(m.text());
});
page.on('pageerror', e => result.errors.push({ kind: 'pageerror', text: String(e.message || e) }));
page.on('requestfailed', r => result.failed_requests.push({ url: r.url(), reason: r.failure()?.errorText }));

const t0 = Date.now();
await page.goto('file://' + abs, { waitUntil: 'load', timeout: 30000 });
const shot = async (name) => {
  const p = path.join(outDir, name);
  await page.screenshot({ path: p });
  result.screenshots[name.replace('.png', '')] = path.relative(process.cwd(), p);
};
await shot('t0.png');
await page.waitForTimeout(Math.max(0, 3000 - (Date.now() - t0)));
await shot('t3s.png');
await page.waitForTimeout(Math.max(0, 8000 - (Date.now() - t0)));
await shot('t8s.png');

result.console_error_count = result.errors.length;
result.runs_without_console_error = result.errors.length === 0;
await browser.close();
fs.writeFileSync(jsonOut, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
process.exit(result.runs_without_console_error ? 0 : 1);
