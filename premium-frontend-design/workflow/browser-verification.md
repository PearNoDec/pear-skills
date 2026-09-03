# Browser Verification Loop

A checklist ticked by the agent that wrote the code is not evidence. This file turns "check the responsive behavior" into something with an artifact attached.

**Rule: if browser tooling is available, look at the result before claiming it works. If it is not available, say the work is unverified rather than implying it was checked.**

## Available tooling

In rough order of preference:

1. **Chrome DevTools MCP** — screenshots, console, network, Lighthouse, performance traces, emulation. Best coverage.
2. **Playwright MCP** — snapshots, screenshots, interaction, console. Accessibility snapshots are especially useful.
3. **A dev server plus the user** — start it, tell the user the URL and exactly what to look at. Slower, still far better than nothing.
4. **Nothing** — state this explicitly and label the result unverified.

Never start a long-running dev server in the foreground; run it in the background and poll for readiness.

## The script

`scripts/verify-browser.mjs` runs steps 2, 3, 4, part of 5 and part of 8 in one command and writes the evidence to disk:

```bash
node scripts/verify-browser.mjs http://localhost:3000/ --out=verify-out \
  --widths=375,768,1440,1920 --themes=light,dark --theme-attr=data-theme --axe
```

It produces one screenshot per width × theme, an overflow report per width, the console and failed-request log, the heading outline, unlabeled controls, images without `alt`, a Tab walk that flags stops with no visible focus indicator, lab LCP/CLS, and axe-core violations if `axe-core` is installed. `report.md` lists what it found and — just as important — what it did not check. `--theme-attr=class` for a `.dark`-based theme; `--reduced-motion` to render the reduced-motion variant.

Run it, then **open the screenshots.** The script finds mechanical defects; it has no opinion about whether the page is any good.

## The loop

### 1. Get it rendering

Build or serve the page. A build error found here is cheaper than one found by the user.

### 2. Read the console first

Before looking at anything visual, read the console. Hydration mismatches, missing keys, failed asset loads and CSP violations all explain visual bugs that would otherwise take much longer to diagnose. Zero console errors is the baseline.

### 3. Screenshot the breakpoints

Capture at minimum:

| Width | Represents | What to look for |
|---|---|---|
| **375** | Small phone | Overflow, cramped tap targets, stacked order, truncation |
| **768** | Tablet portrait | The awkward middle — grids that collapse badly, orphaned columns |
| **1440** | Standard laptop | The primary design target |
| **1920** | Wide desktop | Over-stretched measure, content stranded in the center, empty gutters |

Take a **full-page** screenshot, not just the viewport. Most layout failures are below the fold.

Then actually examine each image. The point is to see the bug, not to produce the file.

### 4. Check for horizontal overflow

The most common responsive defect, and it is directly measurable:

```js
// Returns every element wider than the viewport
Array.from(document.querySelectorAll('*'))
  .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
  .map(el => ({ tag: el.tagName, cls: el.className, w: Math.round(el.getBoundingClientRect().width) }))
```

Anything returned at 375px is a bug. Usual causes: a fixed `width`, an unconstrained image, a long unbroken string, a negative margin, or a grid whose `minmax()` floor exceeds the viewport.

### 5. Walk the keyboard path

The script's Tab walk checks that each stop has a visible outline or box-shadow. It cannot check *order* or *meaning*. Tab through the primary flow yourself and confirm:

- Focus is visible at every stop, on every background it lands on
- Tab order follows visual order
- No focus trap outside a modal, and a correct trap inside one
- `Escape` closes overlays and returns focus to the trigger
- Nothing interactive is unreachable
- Skip link appears on the first Tab

### 6. Check both themes

If the project has light and dark modes, screenshot both at 1440. Look specifically for: invisible borders, text that lost contrast, images that became holes, shadows that turned into grey smears, and status colors that stopped reading as status. See `standards/theming-dark-mode.md`.

### 7. Verify the non-happy states

Render them rather than assuming they exist. Empty, loading, error, no-results, permission-restricted; for forms, the submitting and server-error states; for charts, the partial-data state. If a state can only be reached with real backend conditions, temporarily force it in the component and screenshot it — or expose a `?state=empty` query parameter in development so the script can capture each one (`--out=verify-empty` per run).

This step catches more real defects than any other in this file, and the script cannot do it for you.

### 8. Contrast and semantics

Run an accessibility snapshot or audit. Check computed contrast on: body text, muted text, placeholders, disabled text, links, text on colored buttons, and status badges. Confirm there is exactly one `h1`, that heading levels do not skip, that landmarks exist, and that every form control has an associated label.

### 9. Performance sanity check

For marketing and public pages, run Lighthouse or a performance trace. Look at LCP, CLS and total transferred bytes.

Specifically hunt for: an unoptimized hero image, a font that blocks render, layout shift from images with no dimensions, and an animation library pulled in for one fade.

Fix what is disproportionate. A 2 MB hero PNG is worth fixing; a 30 ms difference is not.

### 10. Fix and re-verify

Fix what the evidence showed, then re-run the affected steps. One pass finds bugs; the second pass confirms the fixes did not introduce new ones.

## Reporting

Report what was actually verified and what was not:

> Verified in Chrome at 375/768/1440/1920, light and dark. Console clean. No horizontal overflow. Keyboard path through checkout works, focus visible throughout. Empty and error states rendered and screenshotted.
> **Not verified:** Safari and Firefox, real-device touch behavior, screen-reader announcement order.

Do not describe an unverified property as working. If a step was skipped, say which and why.

## Minimum bar by tier

| Tier | Required |
|---|---|
| **T1 Quick fix** | Console clean + one screenshot of the changed area |
| **T2 Component** | Steps 2–5, 7 |
| **T3 Page** | Steps 1–8 |
| **T4 System** | All steps, on every representative page type |
