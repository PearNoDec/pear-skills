#!/usr/bin/env node
/**
 * verify-browser.mjs — render the page and collect the evidence that
 * workflow/browser-verification.md asks for, as files you can look at.
 *
 * Requires Playwright (any recent 1.x) with Chromium:
 *   npm i -D playwright && npx playwright install chromium
 * or a global install. The script imports 'playwright' and fails loudly if absent.
 *
 *   node scripts/verify-browser.mjs <url> [options]
 *
 * Options
 *   --out=<dir>            output directory            (default: ./verify-out)
 *   --widths=375,768,1440,1920                          (default: those four)
 *   --themes=light,dark    themes to render            (default: light,dark)
 *   --theme-attr=data-theme  attribute set on <html>   (default: data-theme; use "class" for .dark)
 *   --tabs=40              how many Tab stops to walk  (default: 40)
 *   --wait=<ms>            extra settle time per view  (default: 400)
 *   --no-full-page         viewport-only screenshots
 *   --reduced-motion       emulate prefers-reduced-motion: reduce
 *   --axe                  run axe-core if it is installed locally (npm i -D axe-core)
 *
 * Output: <out>/report.md, <out>/report.json, and one PNG per width × theme.
 *
 * What it checks
 *   console errors/warnings, failed requests, horizontal overflow per width,
 *   heading outline (one h1, no skipped levels), landmarks, images without alt,
 *   form controls without a label, focus visibility along the Tab path,
 *   LCP / CLS from the performance timeline, viewport meta pinch-zoom,
 *   <html lang>, and (optional) axe-core violations.
 *
 * It does NOT tell you whether the design is good. Open the screenshots.
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const url = argv.find((a) => !a.startsWith('--'));
if (!url) {
  console.error('Usage: node scripts/verify-browser.mjs <url> [--out=dir] [--widths=375,768,1440,1920] [--themes=light,dark] [--theme-attr=data-theme] [--axe]');
  process.exit(2);
}
const opt = (k, d) => {
  const hit = argv.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.slice(k.length + 3) : d;
};
const has = (k) => argv.includes(`--${k}`);

const OUT = resolve(opt('out', 'verify-out'));
const WIDTHS = opt('widths', '375,768,1440,1920').split(',').map(Number).filter(Boolean);
const THEMES = opt('themes', 'light,dark').split(',').map((s) => s.trim()).filter(Boolean);
const THEME_ATTR = opt('theme-attr', 'data-theme');
const TABS = Number(opt('tabs', 40));
const WAIT = Number(opt('wait', 400));
const FULL_PAGE = !has('no-full-page');
const REDUCED = has('reduced-motion');
const AXE = has('axe');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright not found. Install it:\n  npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------------------
// In-page probes (run via page.evaluate — keep them dependency-free)
// ---------------------------------------------------------------------------
const PROBES = {
  overflow: () => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' && cs.visibility === 'hidden') continue;
        bad.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          cls: typeof el.className === 'string' ? el.className.slice(0, 80) : undefined,
          left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
        });
        if (bad.length >= 25) break;
      }
    }
    return { vw, scrollWidth: document.documentElement.scrollWidth, bad };
  },

  document: () => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
    }));
    const skips = [];
    let prev = 0;
    for (const h of hs) {
      if (prev && h.level > prev + 1) skips.push(`h${prev} → h${h.level} "${h.text}"`);
      prev = h.level;
    }
    const q = (s) => document.querySelectorAll(s).length;
    const imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src).slice(0, 10);
    const controls = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')];
    const unlabeled = controls.filter((c) => {
      if (c.getAttribute('aria-label') || c.getAttribute('aria-labelledby') || c.getAttribute('title')) return false;
      if (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`)) return false;
      return !c.closest('label');
    }).map((c) => `${c.tagName.toLowerCase()}${c.id ? '#' + c.id : ''}${c.name ? '[name=' + c.name + ']' : ''}`).slice(0, 10);
    const vp = document.querySelector('meta[name=viewport]')?.getAttribute('content') || '';
    return {
      lang: document.documentElement.getAttribute('lang') || null,
      title: document.title,
      h1Count: q('h1'),
      headingSkips: skips,
      landmarks: { main: q('main'), nav: q('nav'), header: q('header'), footer: q('footer') },
      imgsNoAlt,
      unlabeledControls: unlabeled,
      viewportBlocksZoom: /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(vp),
      dialogs: q('dialog, [role=dialog]'),
      liveRegions: q('[aria-live], [role=status], [role=alert]'),
    };
  },

  focusState: () => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: 'body', visible: false, indicator: null };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const onScreen = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0;
    const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
    const shadow = cs.boxShadow && cs.boxShadow !== 'none';
    const border = cs.borderStyle !== 'none' && cs.borderColor; // weak signal; only counted with :focus-visible below
    let fv = false;
    try { fv = el.matches(':focus-visible'); } catch {}
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      onScreen,
      focusVisible: fv,
      indicator: outline ? 'outline' : shadow ? 'box-shadow' : null,
      visible: onScreen && (outline || shadow),
    };
  },

  vitals: () => new Promise((resolveP) => {
    const out = { lcp: null, cls: 0 };
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) out.lcp = Math.round(e.startTime); })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    } catch {}
    setTimeout(() => resolveP({ lcp: out.lcp, cls: Number(out.cls.toFixed(3)) }), 300);
  }),

  setTheme: ([attr, theme]) => {
    const html = document.documentElement;
    if (attr === 'class') { html.classList.remove('light', 'dark'); html.classList.add(theme); }
    else html.setAttribute(attr, theme);
    html.style.colorScheme = theme;
  },
};

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const report = { url, startedAt: new Date().toISOString(), console: [], failedRequests: [], views: [], document: null, focusWalk: null, axe: null };

const browser = await chromium.launch();
const context = await browser.newContext({
  reducedMotion: REDUCED ? 'reduce' : 'no-preference',
  deviceScaleFactor: 1,
});
const page = await context.newPage();

page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') report.console.push({ type: m.type(), text: m.text().slice(0, 300) });
});
page.on('pageerror', (e) => report.console.push({ type: 'pageerror', text: String(e).slice(0, 300) }));
page.on('requestfailed', (r) => report.failedRequests.push({ url: r.url().slice(0, 200), reason: r.failure()?.errorText }));
page.on('response', (r) => { if (r.status() >= 400) report.failedRequests.push({ url: r.url().slice(0, 200), reason: `HTTP ${r.status()}` }); });

await page.setViewportSize({ width: WIDTHS[WIDTHS.length - 1], height: 900 });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForTimeout(WAIT);

report.document = await page.evaluate(PROBES.document);
report.vitals = await page.evaluate(PROBES.vitals);

for (const theme of THEMES) {
  await page.evaluate(PROBES.setTheme, [THEME_ATTR, theme]);
  await page.waitForTimeout(150);
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
    await page.waitForTimeout(WAIT);
    const file = `${theme}-${width}.png`;
    await page.screenshot({ path: join(OUT, file), fullPage: FULL_PAGE });
    const overflow = await page.evaluate(PROBES.overflow);
    report.views.push({ theme, width, screenshot: file, overflow });
  }
}

// Focus walk at the primary width, first theme.
await page.evaluate(PROBES.setTheme, [THEME_ATTR, THEMES[0]]);
await page.setViewportSize({ width: WIDTHS.includes(1440) ? 1440 : WIDTHS[WIDTHS.length - 1], height: 900 });
await page.waitForTimeout(150);
await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
const stops = [];
const seen = new Set();
for (let i = 0; i < TABS; i++) {
  await page.keyboard.press('Tab');
  const s = await page.evaluate(PROBES.focusState);
  const key = `${s.tag}|${s.text}`;
  if (s.tag === 'body' || (seen.has(key) && i > 3)) break;
  seen.add(key);
  stops.push(s);
}
report.focusWalk = {
  stops: stops.length,
  firstStopIsSkipLink: /skip/i.test(stops[0]?.text || ''),
  withoutVisibleIndicator: stops.filter((s) => s.focusVisible && !s.visible).map((s) => `${s.tag} "${s.text}"`).slice(0, 15),
  offScreen: stops.filter((s) => !s.onScreen).map((s) => `${s.tag} "${s.text}"`).slice(0, 10),
};

// Optional axe
if (AXE) {
  try {
    const axePath = require.resolve('axe-core/axe.min.js');
    await page.addScriptTag({ path: axePath });
    const res = await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
    });
    report.axe = res;
  } catch (e) {
    report.axe = { skipped: `axe-core not resolvable (${String(e.message || e).slice(0, 80)}). npm i -D axe-core` };
  }
}

await browser.close();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const problems = [];
const errors = report.console.filter((c) => c.type !== 'warning');
if (errors.length) problems.push(`${errors.length} console error(s)`);
if (report.failedRequests.length) problems.push(`${report.failedRequests.length} failed request(s)`);
for (const v of report.views) if (v.overflow.bad.length) problems.push(`horizontal overflow at ${v.width}px (${v.theme})`);
const d = report.document;
if (d.h1Count !== 1) problems.push(`${d.h1Count} <h1> elements (expected 1)`);
if (d.headingSkips.length) problems.push(`heading levels skip: ${d.headingSkips.join('; ')}`);
if (!d.landmarks.main) problems.push('no <main> landmark');
if (d.imgsNoAlt.length) problems.push(`${d.imgsNoAlt.length} <img> without alt`);
if (d.unlabeledControls.length) problems.push(`${d.unlabeledControls.length} unlabeled form control(s)`);
if (d.viewportBlocksZoom) problems.push('viewport meta blocks pinch-zoom');
if (!d.lang) problems.push('<html> has no lang attribute');
if (report.focusWalk.withoutVisibleIndicator.length) problems.push(`${report.focusWalk.withoutVisibleIndicator.length} focus stop(s) with no visible indicator`);
if (report.vitals?.lcp && report.vitals.lcp > 2500) problems.push(`LCP ${report.vitals.lcp}ms (> 2500)`);
if (report.vitals?.cls > 0.1) problems.push(`CLS ${report.vitals.cls} (> 0.1)`);
if (Array.isArray(report.axe) && report.axe.length) problems.push(`${report.axe.length} axe violation type(s)`);

const md = [];
md.push(`# Browser verification — ${url}`, '', `Rendered ${new Date().toLocaleString()} · widths ${WIDTHS.join('/')} · themes ${THEMES.join(', ')}${REDUCED ? ' · reduced motion' : ''}`, '');
md.push(problems.length ? `## ${problems.length} problem(s) found` : '## No automated problems found');
for (const p of problems) md.push(`- ${p}`);
md.push('', 'A clean automated pass is not a finished design. Open every screenshot and look at it.', '');

md.push('## Screenshots');
for (const v of report.views) md.push(`- \`${v.screenshot}\` — ${v.theme} @ ${v.width}px${v.overflow.bad.length ? ` — **overflow**: scrollWidth ${v.overflow.scrollWidth} > viewport ${v.overflow.vw}` : ''}`);
md.push('');

const ov = report.views.filter((v) => v.overflow.bad.length);
if (ov.length) {
  md.push('## Horizontal overflow');
  for (const v of ov) {
    md.push(`### ${v.theme} @ ${v.width}px`);
    for (const b of v.overflow.bad.slice(0, 10)) md.push(`- \`${b.tag}${b.id ? '#' + b.id : ''}${b.cls ? '.' + b.cls.split(' ')[0] : ''}\` width ${b.width}, right edge ${b.right} (viewport ${v.overflow.vw})`);
  }
  md.push('');
}

md.push('## Console');
if (!report.console.length) md.push('Clean.');
for (const c of report.console.slice(0, 30)) md.push(`- **${c.type}** ${c.text}`);
md.push('');
if (report.failedRequests.length) {
  md.push('## Failed requests');
  for (const r of report.failedRequests.slice(0, 30)) md.push(`- ${r.reason} — ${r.url}`);
  md.push('');
}

md.push('## Document', `- lang: \`${d.lang}\` · title: "${d.title}"`, `- h1: ${d.h1Count} · heading skips: ${d.headingSkips.length ? d.headingSkips.join('; ') : 'none'}`,
  `- landmarks: main ${d.landmarks.main}, nav ${d.landmarks.nav}, header ${d.landmarks.header}, footer ${d.landmarks.footer}`,
  `- images without alt: ${d.imgsNoAlt.length}${d.imgsNoAlt.length ? ' — ' + d.imgsNoAlt.join(', ') : ''}`,
  `- unlabeled controls: ${d.unlabeledControls.length}${d.unlabeledControls.length ? ' — ' + d.unlabeledControls.join(', ') : ''}`,
  `- dialogs: ${d.dialogs} · live regions: ${d.liveRegions} · viewport blocks zoom: ${d.viewportBlocksZoom}`, '');

md.push('## Keyboard path', `- Tab stops walked: ${report.focusWalk.stops} · first stop is a skip link: ${report.focusWalk.firstStopIsSkipLink}`,
  `- stops with :focus-visible but no visible outline/box-shadow: ${report.focusWalk.withoutVisibleIndicator.length}${report.focusWalk.withoutVisibleIndicator.length ? ' — ' + report.focusWalk.withoutVisibleIndicator.join(', ') : ''}`,
  `- focused elements off screen: ${report.focusWalk.offScreen.length}${report.focusWalk.offScreen.length ? ' — ' + report.focusWalk.offScreen.join(', ') : ''}`, '');

md.push('## Vitals (lab, single load)', `- LCP: ${report.vitals?.lcp ?? 'n/a'} ms · CLS: ${report.vitals?.cls ?? 'n/a'}`, '');

if (report.axe) {
  md.push('## axe-core');
  if (Array.isArray(report.axe)) {
    if (!report.axe.length) md.push('No violations.');
    for (const v of report.axe) md.push(`- **${v.impact}** ${v.id} — ${v.help} (${v.nodes} node(s): ${v.targets.join(' | ')})`);
  } else md.push(report.axe.skipped);
  md.push('');
}

md.push('## Not verified by this script', '- Whether the design is distinctive, coherent or on-brand — look at the screenshots',
  '- Empty / loading / error / permission states — force them and screenshot again',
  '- Screen-reader announcement order, real-device touch, Safari and Firefox',
  '- Contrast of every text/background pair — run axe (`--axe`) or a contrast tool', '');

writeFileSync(join(OUT, 'report.md'), md.join('\n'));
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));

console.log(md.slice(0, 4 + problems.length).join('\n'));
console.log(`\nFull report: ${join(OUT, 'report.md')}`);
process.exit(problems.length ? 1 : 0);
