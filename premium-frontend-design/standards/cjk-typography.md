# CJK Typography Standard

Read this before setting type on any product that ships Chinese, Japanese or Korean — which, for the 企业官网 / SaaS / 中后台 / 管理系统 surfaces this skill targets, is most of them.

Latin typography defaults are not neutral. Applied to CJK they produce text that is cramped, blurred and badly broken, and the failure is quiet: it looks *almost* right to someone reading in English.

## Line height

CJK glyphs are square, full-height and dense. They have no ascender/descender rhythm to create optical space between lines, so a leading that is comfortable in English reads as a wall in Chinese.

| | Latin | CJK |
|---|---|---|
| Body | 1.5 – 1.6 | **1.75 – 1.9** |
| Long-form reading | 1.6 – 1.7 | **1.9 – 2.0** |
| Headings (large) | 1.05 – 1.2 | **1.2 – 1.35** |
| Dense table rows | 1.4 | **1.5 – 1.6** |

Set `--leading-normal` from the primary script, not from the design tool's default. If the product is bilingual, set the looser CJK value globally and tighten Latin-only blocks with `:lang(en)` rather than the reverse — cramped CJK is a worse failure than slightly loose English.

## Font size floor

Chinese glyphs carry far more strokes per em than Latin letters. 12px Latin is small but legible; 12px Chinese loses stroke separation entirely at normal viewing distance.

- Body text floor: **14px**, 15–16px preferred
- Secondary / label floor: **12px**, and only for short strings
- Never put 11px captions in a Chinese interface — `standards/anti-patterns.md` bans them generally, and in CJK they are simply unreadable

## Font weight — the fake-bold trap

Most CJK families ship far fewer weights than their Latin counterparts. Ask for a weight the family does not have and the browser **synthesises** it by dilating the glyphs. On a 30-stroke character at body size this is not "bolder", it is blur — and it is one of the most common reasons a Chinese interface looks cheap next to its English mockup.

```css
/* Let it fall back to the nearest real weight instead of smearing. */
:lang(zh), :lang(ja), :lang(ko) { font-synthesis-weight: none; }
```

Already in `assets/a11y-baseline.css`. Then:

- Verify which weights the chosen family actually ships. Source Han Sans / Noto Sans SC have seven; most system CJK faces have two or three.
- If only 400 and 700 exist, do not design a hierarchy that needs 500 and 600. Carry that hierarchy with **size, color and spacing** instead.
- `font-weight: 600` on a family with only 400/700 will round to one of them — inconsistently across browsers. Pick the real value.

## Font stack order

The Latin face must come **first** so that Latin glyphs and digits resolve to it, with the CJK face behind it as fallback for characters the Latin font does not contain. Reversing this renders English words in the CJK font's Latin glyphs, which are usually mediocre and always mismatched.

```css
--font-sans:
  "Inter",                                  /* Latin, digits, punctuation */
  "PingFang SC", "Microsoft YaHei",         /* macOS / Windows CJK */
  "Source Han Sans SC", "Noto Sans SC",     /* webfont fallback */
  ui-sans-serif, system-ui, sans-serif;
```

Two consequences worth designing around:

- **No italic.** CJK has no italic tradition and no italic cuts; browsers synthesise an oblique that looks like a rendering bug. Use weight, color, a background, or 着重号 instead.
- **Digits and Latin come from the Latin face**, so the numeric styling that matters — `tabular-nums` for tables and dashboards — behaves normally.

## Letter spacing

Negative tracking is a Latin display-type technique. Applied to CJK it collides the glyphs, because CJK characters are already set on a fixed full-width body with no side bearings to absorb it.

- Never apply `--tracking-tight` to CJK headlines. Set `letter-spacing: 0` for CJK display type.
- Small *positive* tracking (`0.02em`–`0.05em`) on short CJK labels and headings is a real technique (疏排) and reads as deliberate.
- `--tracking-wide` for uppercase Latin labels does not transfer — there is no CJK uppercase.

## Mixed CJK / Latin spacing

Chinese text with embedded English words or numbers needs a quarter-em of space at each boundary. Historically this was done by inserting spaces in the copy — which corrupts the string for search, translation and screen readers. Do it in CSS instead:

```css
/* Progressive enhancement: Chromium ships both; elsewhere they are ignored
   and you simply get today's rendering. Neither is worth a JS polyfill. */
body {
  text-autospace: normal;      /* space between CJK and Latin/digits */
  text-spacing-trim: trim-start; /* 标点挤压 — removes the gap left by
                                    full-width opening punctuation */
}
```

`text-spacing-trim` matters more than it sounds: full-width CJK punctuation carries built-in half-em padding, so a paragraph opening with 「 or （ starts visibly indented and a line ending in 。 has a ragged gap. Trimming it is the difference between typeset and pasted.

## Line breaking

CJK wraps between any two characters, so overflow is rarer — but unconstrained wrapping violates 禁则 (kinsoku): a line must not *begin* with a closing bracket, a comma or a full stop, and must not *end* with an opening bracket.

```css
:lang(zh), :lang(ja), :lang(ko) {
  line-break: strict;   /* applies the kinsoku rules */
  word-break: normal;   /* NOT break-all — that breaks Latin words mid-word */
  hyphens: none;        /* CJK does not hyphenate */
}
```

`word-break: break-all` is a frequent copy-paste fix for CJK overflow. It works, and it also shatters every English word and URL in the same block. Use `overflow-wrap: break-word` for the overflow case instead.

`text-wrap: balance` has little effect on CJK — it balances at word boundaries, and CJK has none that the browser can see. Harmless, but do not count on it to fix a ragged headline; adjust the measure instead.

## Length: the opposite problem

`standards/responsive-accessibility-performance.md` warns that German and Finnish run 30–40% *longer* than English. Chinese runs 30–50% **shorter**, and this breaks layouts in the other direction:

- Buttons sized for "Get started" look empty and unbalanced holding 开始使用. Size controls by padding, not by a fixed width tuned to the English string.
- Navigation labels collapse to 2–4 characters; a mega-menu laid out for English wordmarks becomes sparse and hard to scan.
- Headlines lose their line breaks. A three-line English hero becomes one dense line — re-tune `--text-display` and the measure per locale rather than shipping the English composition.
- Table columns need re-measuring, not re-scaling. Chinese is denser per character but shorter overall, so column widths tuned for English are usually too wide.

## Performance: subsetting is not optional

A full Chinese webfont is **3–10 MB** — one to two orders of magnitude larger than a Latin face. Shipping one unsubsetted destroys LCP on exactly the surfaces this skill cares about.

- Prefer the **system stack** (PingFang SC / Microsoft YaHei / Noto Sans CJK) unless the brand genuinely requires a custom face. It costs zero bytes and is what users already read.
- If a custom CJK face is required, split it by `unicode-range` into many small subsets so the browser downloads only the ranges a page actually uses. Build tools: `fonttools pyftsubset`, `cn-font-split`.
- Static marketing pages can subset to the exact glyphs used on the page — often under 50 KB.
- Always `font-display: swap` and preload only the subset containing the hero copy.

This belongs in the performance budget in `SKILL.md` §7.6. For a Chinese product it is usually the single largest item in it.

## Input: the IME

Chinese, Japanese and Korean are typed through an IME, and `Enter` confirms a candidate rather than submitting. A search box that filters on every keystroke or a form that submits on `Enter` breaks for every CJK user. The `compositionstart` / `compositionend` / `isComposing` handling is in `standards/forms.md` § IME composition; `scripts/lint-design.mjs` flags `Enter` handlers that lack the guard.

Two more input details: `maxLength` counts UTF-16 code units, not the characters a user sees; and Chinese punctuation is full-width (，。：；？！「」), so a validator that expects ASCII `,` in a list will reject correct input.

## Review additions

These are in the CJK section of `workflow/design-review.md`; they are repeated here so the file is self-contained:

- [ ] Body line-height is ≥ 1.75, not the Latin default
- [ ] No synthesised bold — every weight used exists in the family
- [ ] Latin face precedes CJK face in the stack; digits render in the Latin face
- [ ] No italic anywhere in CJK text
- [ ] No negative letter-spacing on CJK
- [ ] Buttons and nav do not look under-filled with short Chinese labels
- [ ] Custom CJK webfont is subsetted, or the system stack is used
- [ ] Body text is ≥ 14px
