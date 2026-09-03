# Application Shell Standard

The shell is the frame every product screen lives in: header, sidebar, content region, optional secondary panel, and the overlay layers on top. It is invisible when it works and the source of the most-reported bugs when it does not — the page that scrolls behind the drawer, the table that overflows the sidebar, the footer hidden by the iOS keyboard, the dropdown behind the sticky header.

Almost all of these are one CSS rule. This file names them. `assets/app-shell-baseline.css` is the working CSS and, like the a11y baseline, is meant to be copied close to verbatim.

## The scroll model — decide it first

There are two valid models and mixing them is the root of most shell bugs:

| Model | The document scrolls | The content region scrolls |
|---|---|---|
| **Page** (marketing, docs, simple product) | Yes — `body` is the scroller | No |
| **Shell** (admin, workspace, anything with a sidebar) | No — `html, body { height: 100%; overflow: hidden }` | Yes — one `overflow: auto` region |

In the shell model, the header and sidebar never move, the content region is the only scroller, and every sticky element is sticky *inside* that region. In the page model, `position: sticky` works against the document and `scroll-margin` handles anchors.

The failure is the hybrid: a fixed header with a body scroller and a content region that also scrolls, so the wheel behaves differently depending on where the pointer is.

## The three rules that fix most shell bugs

**1. `min-height: 0` (and `min-width: 0`) on every flex/grid child that contains a scroller.** Flex and grid children default to `min-size: auto`, which means they refuse to shrink below their content — so the scroll region grows to fit its content and the *page* overflows instead. This one rule explains "why does the table push the footer off screen".

```css
.shell        { display: grid; grid-template-rows: auto 1fr; height: 100dvh; }
.shell-main   { min-height: 0; overflow: auto; }          /* the only scroller */
.shell-body   { display: grid; grid-template-columns: auto 1fr; min-height: 0; }
.shell-content{ min-width: 0; }                            /* tables do not widen the shell */
```

**2. `100dvh`, not `100vh`.** On mobile browsers `100vh` is the height with the address bar hidden, so a `100vh` shell is taller than the visible screen and the bottom 60–100px — usually the actions — sits behind the browser chrome. `dvh` tracks the visible viewport. Provide the `vh` fallback for old engines.

**3. Sticky needs a scrolling ancestor with no `overflow: hidden` in between.** A sticky table header inside `overflow-x: auto` wrapper stops being sticky, because the wrapper is now its scroll container. Fix: make the *wrapper* the vertical scroller too (`overflow: auto; max-height`), or use `overflow: clip` on the axis you need to clip — `clip` does not create a scroll container.

## Header

- Height is a single variable, `--header-height`, read by: `scroll-margin-top` on anchor targets, the sticky offset of anything below it, and the content region's top padding in the page model.
- Sticky headers gain a bottom border or shadow *only when scrolled*, so the boundary appears when there is content behind it and disappears at the top. One `IntersectionObserver` on a sentinel, or `animation-timeline: scroll()` where supported.
- Nothing in the header wraps: the logo, nav and actions collapse into an overflow menu before they wrap to two rows.
- z-index from the scale: `--z-header`. A dropdown from the header is `--z-popover`, which is why the scale has popover above header.

## Sidebar

- Width is a variable (`--sidebar-width`, `--sidebar-width-collapsed`); collapse animates `width` on the sidebar *only* — 200px is an acceptable layout animation for a once-per-session action. Content reflows; do not animate the content.
- Collapsed state persists per user. Collapsed items show a tooltip with the label on hover and focus.
- The sidebar has its own scroller when navigation is long; the header of the sidebar (workspace switcher) and its footer (user menu) stay fixed.
- Below `lg` the sidebar becomes a drawer (`standards/overlays-navigation.md`) — not a permanently open 240px column on a 375px phone.
- Active item: `aria-current="page"`, indicated by a bar or background *and* weight, never color alone.

## Content region

- Padding from `--gutter`; the content column has `min-width: 0` so wide tables scroll inside their own wrapper instead of widening the page.
- Page header (breadcrumb, title, state, primary action) is compact and sits at the top of the content region — sticky if the page has a long form or table below it, otherwise not.
- Max width: forms and reading content constrain to `--container-text` / `--container-max` even inside a wide shell; tables and dashboards use the full region. One region, two rules.
- `scrollbar-gutter: stable` on the scroller so content does not jump horizontally when the scrollbar appears.

## Secondary panel and drawers

- A persistent secondary panel (filters, properties, preview) is part of the grid (`auto 1fr auto`) and resizes the content region. A drawer overlays it. Do not use a drawer for something the user keeps open all day.
- Resizable panels: a real `<div role="separator" aria-orientation="vertical" tabindex="0">` handle with arrow-key support, min/max widths, and persisted size.

## Overlay layers

The z-index scale in `assets/tokens.schema.css` is the whole answer. Two implementation notes:

- **Portals escape `overflow` and `transform` ancestors.** A `transform` on an ancestor creates a new containing block for `position: fixed`, so a "fixed" dialog inside an animated panel is positioned relative to the panel. Render overlays at the body root.
- **Lock body scroll without layout shift.** Setting `overflow: hidden` on `body` removes the scrollbar and shifts everything 15px. Either reserve the gutter permanently (`scrollbar-gutter: stable` on `html`) or add `padding-right: <scrollbar width>` while locked. In the shell model this is moot — the body never scrolled.

## Mobile platform

- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` — `viewport-fit=cover` is what makes `env(safe-area-inset-*)` return non-zero values.
- Bottom bars and sheets pad `env(safe-area-inset-bottom)`; the header pads `env(safe-area-inset-top)` when it sits under the status bar.
- Inputs ≥ 16px so iOS does not zoom on focus (`standards/forms.md`).
- `overscroll-behavior: contain` on internal scrollers so a scroll at the end of a drawer does not bounce the page or trigger pull-to-refresh.
- `-webkit-tap-highlight-color: transparent` **only** if you provide your own `:active` state; the default grey flash is feedback, not a bug.
- `touch-action: manipulation` on buttons removes the 300ms click delay in engines that still have one and prevents double-tap zoom on controls.
- Sticky headers on iOS: a `position: sticky` header inside a `-webkit-overflow-scrolling` region works; a `position: fixed` header inside a transformed ancestor does not.

## Performance notes for shells

- The shell renders once; route changes replace the content region only. A shell that re-mounts on navigation (full-page transition on every click) is the reason an admin tool feels slow.
- Skeleton the content region at its final layout during navigation; do not skeleton the shell.
- Long sidebars, long tables and long lists inside the shell virtualize independently; each is its own scroller.
- `content-visibility: auto` on long, below-fold sections in the page model; not on anything inside a scroller whose height matters.

## Checklist

- [ ] Scroll model decided and consistent: one scroller, everything else fixed
- [ ] `min-height: 0` / `min-width: 0` on every flex/grid child that contains a scroller or a wide table
- [ ] `100dvh` with a `100vh` fallback; nothing critical hides behind mobile browser chrome
- [ ] `--header-height` drives anchor offsets and sticky offsets
- [ ] Sticky elements have a valid scrolling ancestor; `overflow: clip` where clipping was needed
- [ ] Sidebar collapses with tooltips, persists, and becomes a drawer on small screens
- [ ] Overlays are portaled; body scroll lock does not shift layout
- [ ] `viewport-fit=cover` and safe-area padding on bottom bars and sheets
- [ ] `overscroll-behavior: contain` on internal scrollers
- [ ] `scrollbar-gutter: stable` on the main scroller
- [ ] Route changes swap the content region only; the shell does not re-mount
