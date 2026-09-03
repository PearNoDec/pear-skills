#!/usr/bin/env node
/**
 * lint-design.mjs — static scan for the defects the standards in this skill name.
 *
 * Zero dependencies. Node 18+.
 *
 *   node scripts/lint-design.mjs [paths...] [--cjk] [--json] [--strict]
 *                                [--token-files <glob-ish substrings, comma-separated>]
 *
 * Scans .css .scss .less .tsx .jsx .ts .js .vue .svelte .astro .html .mdx
 * Ignores node_modules, dist, build, .next, .nuxt, .output, .git, coverage, storybook-static
 *
 * Exit code 1 when any ERROR is found (or any WARN with --strict). Every finding
 * names the rule and the reference file in the skill that explains the fix.
 *
 * This is a *smell detector*, not a proof. A clean run does not mean the work
 * is finished; a dirty run means it certainly is not.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative, basename } from 'node:path';

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--') && !a.includes('=')));
const kv = Object.fromEntries(
  argv.filter((a) => a.startsWith('--') && a.includes('=')).map((a) => a.slice(2).split('=')),
);
const roots = argv.filter((a) => !a.startsWith('--'));
if (roots.length === 0) roots.push('.');

const CJK = flags.has('--cjk');
const JSON_OUT = flags.has('--json');
const STRICT = flags.has('--strict');
const TOKEN_FILE_HINTS = (kv['token-files'] ?? 'token,tokens,theme,globals.css,app.css,preset,palette,variables,colors')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const EXT = new Set(['.css', '.scss', '.less', '.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte', '.astro', '.html', '.mdx']);
const STYLE_EXT = new Set(['.css', '.scss', '.less']);
const MARKUP_EXT = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.astro', '.html', '.mdx']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'build', '.next', '.nuxt', '.output', '.git', 'coverage', 'storybook-static', '.svelte-kit', '.turbo', 'out']);

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------
const BANNED_EN = [
  'empower', 'revolutioni[sz]e', 'seamless(?:ly)?', 'unlock', 'elevate', 'supercharge', 'unleash',
  'transform your workflow', 'take (?:it|your \\w+) to the next level', 'game-changing', 'cutting-edge',
  'best-in-class', 'harness the power', 'reimagine', 'effortlessly', 'the future of \\w+',
];
const BANNED_ZH = ['赋能', '一站式', '全方位', '极致', '无缝', '颠覆', '引领', '行业领先', '助力', '重新定义', '开启.{0,4}新时代'];
const PLACEHOLDER = ['lorem ipsum', '\\[company name\\]', 'feature (?:one|two|three|1|2|3)\\b', 'your company', 'acme corp', '\\bTODO copy\\b'];

// Emoji used as UI iconography — only flag inside markup text/attributes.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;

const RULES = [
  // ---- Tokens / theming ---------------------------------------------------
  {
    id: 'hardcoded-color',
    level: 'error',
    ref: 'standards/design-system.md § two layers',
    applies: (f) => (STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext)) && !f.isTokenFile,
    test: (line) => {
      // hex, rgb(a), hsl(a), oklch — but not inside a var() fallback or a comment
      if (/\/\/|\/\*|<!--/.test(line.trimStart().slice(0, 2))) return null;
      const m = line.match(/(?<![\w-])(#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|(?:rgba?|hsla?|oklch|oklab)\([^)]*\))/i);
      if (!m) return null;
      if (/currentColor|transparent/i.test(line) && !m[1]) return null;
      // Allow inside a var() default: var(--x, #fff)
      if (new RegExp(`var\\([^)]*${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(line)) return null;
      // Allow #id anchors in href / url(#gradient)
      if (/href=["']#|url\(#/.test(line) && !/(background|color|border|fill|stroke|shadow)/i.test(line)) return null;
      return `raw color ${m[1]} — components read semantic roles (var(--surface), var(--primary))`;
    },
  },
  {
    id: 'raw-z-index',
    level: 'error',
    ref: 'standards/design-system.md § z-index',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line) => {
      const m = line.match(/z-index\s*:\s*(-?\d+)|\bz-\[?(\d{2,})\]?|\bzIndex\s*:\s*(-?\d+)/);
      if (!m) return null;
      const n = m[1] ?? m[2] ?? m[3];
      if (n === '0' || n === '-1' || n === '1') return null;
      return `z-index ${n} — use the named scale (--z-header, --z-dialog, …)`;
    },
  },
  {
    id: 'tailwind-arbitrary-color',
    level: 'warn',
    ref: 'standards/stack-adapters.md § Tailwind',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => {
      const m = line.match(/\b(?:bg|text|border|ring|fill|stroke|from|to|via)-\[(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([^\]]*\))\]/i);
      return m ? `arbitrary color utility ${m[0]} — register the role in @theme and use bg-primary etc.` : null;
    },
  },
  {
    id: 'tailwind-default-palette-color',
    level: 'warn',
    ref: 'standards/design-system.md § where identity lives',
    applies: (f) => MARKUP_EXT.has(f.ext) && !f.isTokenFile,
    test: (line) => {
      const m = line.match(/\b(?:bg|text|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/);
      return m ? `default palette utility ${m[0]} — brand and status hues belong to the token layer, not to Tailwind's stock ramp` : null;
    },
  },

  // ---- Accessibility --------------------------------------------------------
  {
    id: 'outline-none',
    level: 'error',
    ref: 'assets/a11y-baseline.css § focus',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line, _file, i, lines) => {
      if (!/outline\s*:\s*(none|0)\b|\boutline-none\b|focus:outline-none/.test(line)) return null;
      const near = [lines[i - 2] ?? '', lines[i - 1] ?? '', line].join(' ');
      if (/:focus:not\(:focus-visible\)|focus-visible:/.test(near)) return null;
      return 'focus outline removed — only remove for :focus:not(:focus-visible), and replace with an equally visible ring';
    },
  },
  {
    id: 'viewport-no-zoom',
    level: 'error',
    ref: 'standards/responsive-accessibility-performance.md',
    applies: (f) => MARKUP_EXT.has(f.ext) || f.ext === '.ts' || f.ext === '.js',
    test: (line) => (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(line) ? 'viewport blocks pinch-zoom — WCAG 1.4.4 failure' : null),
  },
  {
    id: 'img-no-alt',
    level: 'error',
    ref: 'standards/media-seo.md § images',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => {
      const tags = line.match(/<img\b[^>]*>/gi);
      if (!tags) return null;
      for (const t of tags) if (!/\balt\s*=/.test(t) && !/\{\.\.\./.test(t)) return '<img> without alt — describe it, or alt="" if decorative';
      return null;
    },
  },
  {
    id: 'alt-generic',
    level: 'warn',
    ref: 'standards/media-seo.md § images',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => {
      const m = line.match(/\balt\s*=\s*["'](image|photo|picture|hero|dashboard|screenshot|icon|logo|banner|img)["']/i);
      return m ? `alt="${m[1]}" says nothing — describe what it shows in context` : null;
    },
  },
  {
    id: 'div-button',
    level: 'warn',
    ref: 'standards/responsive-accessibility-performance.md § where a11y breaks',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => (/<(div|span)\b[^>]*\b(onClick|@click|on:click|v-on:click)=/.test(line) && !/role=["']button["']|tabindex/i.test(line)
      ? 'click handler on a div/span — use <button>, or add role, tabindex and key handling'
      : null),
  },
  {
    id: 'icon-only-button',
    level: 'warn',
    ref: 'standards/overlays-navigation.md § popover and menu',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => {
      const m = line.match(/<button\b([^>]*)>\s*<(?:svg|[A-Z][\w.]*Icon|Icon\b|i\s)[^>]*\/?>\s*<\/button>/);
      if (!m) return null;
      return /aria-label|aria-labelledby|title=/.test(m[1]) ? null : 'icon-only button with no aria-label';
    },
  },
  {
    id: 'placeholder-as-label',
    level: 'warn',
    ref: 'standards/forms.md § field anatomy',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => (/<input\b[^>]*placeholder=/i.test(line) && !/<label|aria-label|aria-labelledby|id=/.test(line)
      ? 'input has a placeholder but no id / aria-label on the same line — confirm a visible <label for> exists'
      : null),
  },
  {
    id: 'number-input',
    level: 'info',
    ref: 'standards/forms.md § input types',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => (/type=["']number["']/.test(line) ? 'type="number" — fine for quantities; for ids, phones, postcodes use type="text" inputmode="numeric"' : null),
  },
  {
    id: 'emoji-as-icon',
    level: 'warn',
    ref: 'SKILL.md §7.2',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => (EMOJI.test(line) && !/\/\/|\/\*/.test(line) ? 'emoji in markup — not UI iconography; use the icon system' : null),
  },
  {
    id: 'transition-all',
    level: 'warn',
    ref: 'standards/motion-interaction.md § the states that matter',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line) => (/transition\s*:\s*all\b|\btransition-all\b/.test(line) ? '`transition: all` — animates outline (focus ring must not fade) and layout properties; list the properties' : null),
  },
  {
    id: 'layout-animation',
    level: 'warn',
    ref: 'standards/motion-interaction.md § what to animate',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line) => {
      const m = line.match(/transition(?:-property)?\s*:\s*[^;]*\b(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*|max-height)\b/);
      return m ? `transition on \`${m[1]}\` triggers layout every frame — use transform/opacity or grid-template-rows` : null;
    },
  },
  {
    id: 'focus-ring-transition',
    level: 'warn',
    ref: 'assets/a11y-baseline.css § focus',
    applies: (f) => STYLE_EXT.has(f.ext),
    test: (line) => (/transition\s*:[^;]*\boutline\b/.test(line) ? 'outline is transitioned — the focus ring must appear on the frame focus lands' : null),
  },

  // ---- Typography / layout ---------------------------------------------------
  {
    id: 'tiny-font-size',
    level: 'error',
    ref: CJK ? 'standards/cjk-typography.md § font size floor' : 'standards/anti-patterns.md § visual defaults',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line) => {
      const floorPx = CJK ? 12 : 11;
      const m = line.match(/font-size\s*:\s*(\d+(?:\.\d+)?)px|\btext-\[(\d+(?:\.\d+)?)px\]/);
      if (!m) return null;
      const px = parseFloat(m[1] ?? m[2]);
      if (px < floorPx) return `${px}px text — below the readable floor (${CJK ? '12px labels / 14px body for CJK' : '11px'})`;
      if (CJK && px < 14 && /body|p\b|paragraph|content/i.test(line)) return `${px}px body-ish text in a CJK product — floor is 14px`;
      return null;
    },
  },
  {
    id: 'word-break-all',
    level: 'warn',
    ref: 'standards/cjk-typography.md § line breaking',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line) => (/word-break\s*:\s*break-all|\bbreak-all\b/.test(line) ? '`break-all` shatters Latin words and URLs — use overflow-wrap: anywhere, and line-break: strict for CJK' : null),
  },
  {
    id: 'vh-100',
    level: 'warn',
    ref: 'standards/app-shell.md § three rules',
    applies: (f) => STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext),
    test: (line, _file, i, lines) => {
      if (!/\b100vh\b|\bh-screen\b|\bmin-h-screen\b/.test(line)) return null;
      const near = [lines[i - 1] ?? '', line, lines[i + 1] ?? ''].join(' ');
      if (/dvh|svh|lvh/.test(near)) return null;   // a vh fallback next to a dvh declaration is correct
      return '100vh / h-screen — taller than the visible mobile viewport; use 100dvh (h-dvh / min-h-dvh) with a vh fallback';
    },
  },
  {
    id: 'left-right-physical',
    level: 'info',
    ref: 'standards/responsive-accessibility-performance.md § logical properties',
    applies: (f) => STYLE_EXT.has(f.ext),
    test: (line) => {
      const m = line.match(/\b(padding|margin|border)-(left|right)\s*:|\btext-align\s*:\s*(left|right)\b/);
      return m ? `physical property \`${m[0].replace(/\s*:.*/, '')}\` — prefer the logical (-inline-start / -inline-end / start) form` : null;
    },
  },
  {
    id: 'important',
    level: 'info',
    ref: 'standards/stack-adapters.md',
    applies: (f) => STYLE_EXT.has(f.ext),
    test: (line, file, i) => {
      if (!/!important/.test(line)) return null;
      const ctx = `${file.media[i]} ${line}`;
      if (/prefers-reduced-motion|forced-colors|print|prefers-contrast/.test(ctx)) return null;
      return '!important outside a11y/print overrides — usually a specificity or library-fighting smell';
    },
  },
  {
    id: 'negative-tracking-cjk',
    level: CJK ? 'warn' : 'info',
    ref: 'standards/cjk-typography.md § letter spacing',
    applies: (f) => CJK && (STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext)),
    test: (line) => (/letter-spacing\s*:\s*-|\btracking-tight(?:er)?\b/.test(line) ? 'negative letter-spacing in a CJK product — collides glyphs; set 0 for CJK display type' : null),
  },
  {
    id: 'italic-cjk',
    level: CJK ? 'warn' : 'info',
    ref: 'standards/cjk-typography.md § font stack',
    applies: (f) => CJK && (STYLE_EXT.has(f.ext) || MARKUP_EXT.has(f.ext)),
    test: (line) => (/font-style\s*:\s*italic|\bitalic\b(?!-)|<em\b|<i\b/.test(line) ? 'italic in a CJK product — no CJK italic cuts exist; the browser synthesises an oblique' : null),
  },

  // ---- Copy ----------------------------------------------------------------
  {
    id: 'placeholder-copy',
    level: 'error',
    ref: 'standards/content-copy.md § never ship placeholder text',
    applies: (f) => MARKUP_EXT.has(f.ext) || f.ext === '.ts' || f.ext === '.js',
    test: (line) => {
      const m = line.match(new RegExp(PLACEHOLDER.join('|'), 'i'));
      return m ? `placeholder copy "${m[0]}"` : null;
    },
  },
  {
    id: 'banned-vocabulary',
    level: 'warn',
    ref: 'standards/content-copy.md § banned vocabulary',
    applies: (f) => MARKUP_EXT.has(f.ext) || f.ext === '.ts' || f.ext === '.js' || f.ext === '.json',
    test: (line) => {
      if (/^\s*(import|export|const|let|function|\/\/|\*)/.test(line) && !/["'`]/.test(line)) return null;
      const m = line.match(new RegExp(`\\b(?:${BANNED_EN.join('|')})\\b|(?:${BANNED_ZH.join('|')})`, 'i'));
      return m ? `"${m[0]}" — says nothing a competitor could not also say; replace with the specific mechanism or number` : null;
    },
  },
  {
    id: 'template-chrome',
    level: 'info',
    ref: 'standards/anti-patterns.md § second-generation tells',
    applies: (f) => MARKUP_EXT.has(f.ext),
    test: (line) => {
      if (/>\s*[^<]*\s·\s[^<]*·\s[^<]*</.test(line)) return 'middle-dot meta string (A · B · C) — template chrome; structure it instead';
      if (/[→»]\s*<\/(a|button)>|<\/(a|button)>\s*→/.test(line) || />[^<]*\s→\s*</.test(line)) return '"→" appended to a label — template chrome; use a real icon only when direction is the meaning';
      if (/uppercase\s+tracking-(?:wide|wider|widest)|text-transform\s*:\s*uppercase[^;]*;[^}]*letter-spacing\s*:\s*0\.\d/.test(line)) return 'tracked ALL-CAPS label — the most common eyebrow tell; ask whether a sentence-case line would say more';
      return null;
    },
  },

  // ---- CJK / IME -----------------------------------------------------------
  {
    id: 'enter-without-ime-guard',
    level: 'warn',
    ref: 'standards/forms.md § IME composition',
    applies: (f) => MARKUP_EXT.has(f.ext) || f.ext === '.ts' || f.ext === '.js',
    fileLevel: true,
    test: (_line, file) => {
      if (!/['"]Enter['"]/.test(file.text)) return null;
      if (/isComposing|229|compositionend|compositionstart/.test(file.text)) return null;
      return 'handles the Enter key without an IME guard — submits mid-composition for Chinese/Japanese/Korean input';
    },
  },
];

// ---------------------------------------------------------------------------
// Comment stripping — a rule quoted in a comment is not a defect.
// Block comments are replaced with newlines so line numbers survive.
// ---------------------------------------------------------------------------
function stripComments(text, ext) {
  let out = text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''))
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
  if (!STYLE_EXT.has(ext)) {
    // Line comments: only when the line starts with // (avoids URLs).
    out = out.replace(/^(\s*)\/\/.*$/gm, '$1');
    // JSX comments {/* … */} are already handled by the block rule.
  }
  return out;
}

// For each line, the text of the innermost enclosing @media/@supports rule
// (or ''). Lets rules distinguish `!important` inside `@media print` from the
// same declaration in normal flow.
function mediaContext(lines) {
  const ctx = new Array(lines.length).fill('');
  const stack = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    ctx[i] = stack.length ? stack[stack.length - 1].name : '';
    for (const ch of line) {
      if (ch === '{') {
        const at = line.match(/@(media|supports|container)[^{]*/);
        stack.push({ name: at && stack.every((s) => s.pending !== at[0]) ? at[0] : (stack[stack.length - 1]?.name ?? '') });
      } else if (ch === '}') stack.pop();
    }
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Walk
// ---------------------------------------------------------------------------
function* walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name) || e.name.startsWith('.')) continue;
      yield* walk(join(dir, e.name));
    } else if (EXT.has(extname(e.name))) {
      yield join(dir, e.name);
    }
  }
}

const findings = [];
let fileCount = 0;

for (const root of roots) {
  let st;
  try { st = statSync(root); } catch { console.error(`No such path: ${root}`); process.exit(2); }
  const files = st.isDirectory() ? [...walk(root)] : [root];
  for (const path of files) {
    let text;
    try { text = readFileSync(path, 'utf8'); } catch { continue; }
    fileCount++;
    const ext = extname(path);
    const lower = path.toLowerCase();
    const isTokenFile = TOKEN_FILE_HINTS.some((h) => lower.includes(h)) || /\.(tokens?|theme)\./.test(basename(lower));
    const lines = stripComments(text, ext).split('\n');
    const file = { path, ext, text, isTokenFile, media: mediaContext(lines) };
    for (const rule of RULES) {
      if (!rule.applies(file)) continue;
      if (rule.fileLevel) {
        const msg = rule.test(null, file);
        if (msg) findings.push({ rule: rule.id, level: rule.level, ref: rule.ref, path, line: 0, msg });
        continue;
      }
      lines.forEach((line, i) => {
        const msg = rule.test(line, file, i, lines);
        if (msg) findings.push({ rule: rule.id, level: rule.level, ref: rule.ref, path, line: i + 1, msg });
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const order = { error: 0, warn: 1, info: 2 };
findings.sort((a, b) => order[a.level] - order[b.level] || a.rule.localeCompare(b.rule) || a.path.localeCompare(b.path) || a.line - b.line);

const counts = { error: 0, warn: 0, info: 0 };
for (const f of findings) counts[f.level]++;

if (JSON_OUT) {
  console.log(JSON.stringify({ files: fileCount, counts, findings }, null, 2));
} else {
  const cwd = process.cwd();
  let currentRule = null;
  for (const f of findings) {
    if (f.rule !== currentRule) {
      currentRule = f.rule;
      const n = findings.filter((x) => x.rule === f.rule).length;
      console.log(`\n${f.level.toUpperCase().padEnd(5)} ${f.rule}  (${n})  → ${f.ref}`);
    }
    console.log(`  ${relative(cwd, f.path)}:${f.line || '-'}  ${f.msg}`);
  }
  console.log(`\n${fileCount} files · ${counts.error} errors · ${counts.warn} warnings · ${counts.info} notes${CJK ? ' · CJK floors applied' : ''}`);
  if (findings.length === 0) console.log('No smells found. This is not proof of quality — run the review checklist and verify in a browser.');
}

process.exit(counts.error > 0 || (STRICT && counts.warn > 0) ? 1 : 0);
