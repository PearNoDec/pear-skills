# Responsive, Accessibility and Performance Standard

`SKILL.md` §7.5 and §7.6 state the floor. This file is about how to *hit* it — the failure modes, and how to detect each one. Do not treat it as a second copy of the requirements list.

## Responsive design

Design explicitly for wide desktop, desktop, laptop, tablet and mobile. Mobile is a redesign, not a shrunken desktop.

The failures cluster in predictable places, and tablet is where most of them hide — it is the width nobody opens. Check content order, navigation, heading wraps, grid collapse, CTA placement, forms, tables, charts, sticky elements, drawers and dialogs, media cropping, motion, and touch targets.

Two rules that prevent most of it:

- **Never fix the width of a text container** to fit its current string.
- **Let content choose the breakpoint.** A grid that collapses at 768px because that is a standard number, rather than because the cards became unreadable at 790px, will look wrong at both.

Horizontal overflow is the single most common defect and it is directly measurable — see the snippet in `workflow/browser-verification.md` §4, or run `scripts/verify-browser.mjs`, which checks every width.

The engineering that makes a product shell hold together at every size — the scroll model, `min-height: 0`, `100dvh`, safe areas, iOS input zoom — is in `standards/app-shell.md` with working CSS in `assets/app-shell-baseline.css`.

## Internationalization and text robustness

Layouts tested only with short English strings break in production. This is a responsive problem, not a translation problem.

**Length variance.** German, Finnish and Russian commonly run 30–40% longer than English. Chinese and Japanese run 30–50% *shorter*, which breaks layouts in the opposite direction — see `standards/cjk-typography.md`. Design navigation labels, buttons, table headers and headlines to survive a 40% increase without truncating or wrapping into an unreadable shape, and to not look under-filled when they shrink.

- Never rely on a label fitting on one line
- Truncate with a tooltip or an accessible full value, never silently

**Logical properties.** Use `padding-inline`, `margin-inline-start`, `border-inline-end`, `inset-inline` and `text-align: start` instead of their left/right equivalents. The layout then supports RTL with no additional work, and costs nothing if it never needs to.

```css
/* Breaks in Arabic and Hebrew */
padding-left: 1rem;  border-left: 2px solid;  text-align: left;

/* Works in every direction */
padding-inline-start: 1rem;  border-inline-start: 2px solid;  text-align: start;
```

Directional icons — chevrons, arrows, back buttons, progress indicators — must mirror in RTL. Logos, media controls and numerals must not.

**Formatting is locale-dependent.** Dates, numbers, currency, name order and address structure all vary. Use `Intl` rather than manual string assembly, and never hard-code `MM/DD/YYYY`.

**Fonts.** Confirm the chosen face actually covers the required scripts. A display font with no CJK coverage silently falls back and destroys the typography it was chosen for.

## Accessibility — where it actually breaks

The requirements are in `SKILL.md` §7.5 and the working CSS is `assets/a11y-baseline.css`. These are the recurring failure modes:

| Failure | How it happens | Detection |
|---|---|---|
| Invisible focus | `outline: none` added to "clean up" a design | Tab the primary flow on every background |
| Muted text below 4.5:1 | Passed in the design tool, fails in the browser, fails again in the other theme | Compute contrast on rendered text, both themes |
| Placeholder-as-label | Looks tidy in the mockup; the label vanishes on first keystroke | Every control has a visible, associated label |
| Color-only state | Status shown by a colored dot alone | Read the screen in grayscale |
| Div-as-button | No keyboard, no role, no focus, no Enter/Space | Tab reaches every interactive element |
| Broken dialog | Focus not trapped, `Escape` dead, focus not returned | Open, tab, escape, check where focus landed |
| Motion with no opt-out | `prefers-reduced-motion` never wired | Toggle the OS setting and reload |

ARIA only where native semantics fall short. A native `<button>` you did not have to make accessible beats a `<div role="button">` you did.

## Performance

For public pages, the full treatment — responsive images, the critical path, fonts, metadata, what to measure — is `standards/media-seo.md`. The summary:

Protect LCP, CLS and INP. Prefer stable image dimensions, responsive media, AVIF/WebP, lazy loading below the fold, font optimization, code splitting, deferred noncritical work, and `transform`/`opacity` for motion.

Avoid large uncompressed video, excessive client-side rendering, heavy libraries for small effects, layout thrashing, scroll listeners doing synchronous work, and huge DOM trees.

The disproportionate costs, roughly in order of how often they matter:

1. **An unsubsetted CJK webfont — 3 to 10 MB.** For a Chinese product this is usually the single largest item in the budget. See `standards/cjk-typography.md`.
2. An unoptimized hero image, frequently a 2 MB PNG that should be a 90 KB AVIF.
3. A render-blocking font with no `font-display: swap`.
4. Layout shift from images with no intrinsic dimensions.
5. An animation library pulled in for one fade.

Fix what is disproportionate. A 2 MB hero is worth fixing; a 30 ms difference is not.

## Advanced visual fallback

WebGL, 3D, Canvas and heavy video need a static or lightweight fallback, reduction on constrained devices, reduced-motion support, and no blocking of primary content or the CTA. Do not spend a large performance budget on an effect with small product value.
