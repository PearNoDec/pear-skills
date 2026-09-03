# Data Grid Standard

The data grid is the most important component in an admin product and the one most often shipped as the happy path only. This file is the contract it has to meet.

It is deliberately framework-neutral. What matters here — the state matrix, the accessibility contract, the copy requirements — is identical in React, Vue, Svelte or server-rendered HTML. The snippets are illustrative; the checklists are the standard.

## The five states are five different screens

Collapsing any two of these is the defect. Each one tells the user what happened **and** what to do next.

| State | Renders | Message must say | Primary action |
|---|---|---|---|
| `loading` | Skeleton rows, not a centered spinner | — | none |
| `error` | Error block, `role="alert"` | What failed, in real terms | Retry |
| `empty` | Empty block | Nothing exists yet | Create the first record |
| `no-results` | Empty block | Filters exclude everything | Clear filters |
| `idle` | The table | — | — |

**`empty` and `no-results` are not the same state.** "Nothing here yet" offers creation; "no matches for these filters" offers clearing them. Offering "Create record" to someone whose filter is simply too narrow is the most common version of this mistake.

Loading must use **skeleton rows matching the page size**, so the layout does not shift when data lands. Vary the skeleton bar widths — uniform bars read as a progress indicator, not as incoming content.

```jsx
{/* Widths vary per column so the block reads as text, not as a loading bar. */}
<span style={{ inlineSize: `${8 + ((i * 7 + col) % 9)}ch` }} className="skeleton-bar" />
```

Error copy shows the real reason. "Something went wrong" is not a message — see `standards/content-copy.md`.

## Accessibility contract

Non-negotiable, and each item is a defect people actually ship:

**Sorting must be perceivable non-visually.** `aria-sort` goes on the `<th>`, set to `ascending` / `descending` on the active column and `none` on other sortable columns. Omit it entirely on non-sortable ones.

```html
<th scope="col" aria-sort="ascending">
  <button type="button">Order date <svg aria-hidden="true">…</svg></button>
</th>
```

**Every row checkbox needs a name a human can act on.** `aria-label="Select row"` repeated fifty times is useless — but so is `aria-label="Select row 7f3a-9c21-…"`. Use the row's meaningful identifier, the same string a person would use to refer to it out loud.

```html
<!-- Not the internal id. The order number, the customer name, the filename. -->
<input type="checkbox" aria-label="Select order SO-40881, Acme Logistics">
```

**Select-all is tri-state.** `indeterminate` is a DOM property, not an HTML attribute — setting it in markup does nothing. It must be assigned on the element (a `ref` in React, a directive elsewhere). Label it honestly: "Select all rows on this page", because that is what it does.

**The horizontal scroll container must be keyboard-reachable.** A scrollable region with no focusable child cannot be scrolled by keyboard at all. Give the wrapper `tabindex="0"`, an accessible name, and a visible focus style.

```html
<div tabindex="0" role="group" aria-label="Orders" class="overflow-x-auto">
  <table>…</table>
</div>
```

**`<caption>` must be the first child of `<table>`.** Placing it after `<thead>` or `<tbody>` is invalid; HTML parsing relocates it but DOM-building frameworks do not, so it silently ends up in the wrong place. If the caption is visually redundant, keep it and hide it with `.sr-only`.

**Live regions announce the result, not the request.** Put `aria-live="polite"` on a status element that reports the outcome ("42 results"), and `aria-busy="true"` on the table body while loading. An error block is `role="alert"`, not `role="status"` — errors interrupt, status does not.

## Selection and bulk actions

- The bulk bar appears **in flow above the table**, not as a floating overlay — an overlay covers the rows being acted on.
- It states the count in words the user can verify: "12 selected", not a bare badge.
- `Escape` clears the selection. `Shift+click` extends a range. Both are expected in an operations tool and both are usually missing.
- Selection survives sorting; it does not survive changing filters or pages unless the product explicitly supports cross-page selection — and if it does, say so ("12 selected across 3 pages").

## Permission gating

Disabled with a reason beats hidden. A hidden button reads as a bug to the user who expected it, and generates a support ticket instead of an understanding.

```html
<button disabled aria-describedby="del-why">Delete</button>
<span id="del-why" class="sr-only">Only workspace admins can delete orders</span>
```

Never surface a permission failure as a backend error after the click. See `standards/content-copy.md` for the message shape.

## Destructive actions

Scope and reversibility, in the button and in the confirmation:

> **Delete 12 orders?** This cannot be undone. — not "Are you sure?"

Separate destructive actions from routine ones spatially, and give them a distinct focus ring so a mis-tab onto Delete is obvious.

## Small screens

Pick a strategy deliberately; do not squeeze desktop columns into a phone.

| Strategy | Use when |
|---|---|
| Priority columns — low-priority columns drop out at each breakpoint | The table has an obvious primary column and a long tail |
| Row-detail drawer — tap a row, open the full record | Users act on one record at a time |
| Horizontal scroll with a pinned first column | Comparison across columns is the actual task |
| A different mobile view entirely | Mobile users have a different job from desktop users |

Priority columns are the cheapest and belong in CSS, not JavaScript — a `hidden md:table-cell` class per priority level. Do not also filter the column array in code: the CSS already did it, and a filter that always returns everything is dead code that reads as a bug.

Row actions must be **persistently visible or in an always-present overflow menu**. Hover-only row actions are unreachable by touch and by keyboard — see `standards/anti-patterns.md`.

## Required at scale

Not needed for a first version; required once the product is real. Decide explicitly rather than discovering them in production:

- Virtualization once rows exceed ~200 — and it must not break `Ctrl+F`, selection or `aria-rowcount`
- Column resize, reorder, pin and visibility, persisted per user
- Saved views, which are what actually make an operations tool fast
- Inline edit with optimistic update and rollback on failure
- Pagination or infinite loading with a stable scroll position on return
- Export that respects the current filter and column set, not the raw table

## Checklist

- [ ] All five states implemented and **rendered**, not assumed
- [ ] `empty` and `no-results` are distinct, with different actions
- [ ] Loading uses skeletons sized to the page; no layout shift on load
- [ ] `aria-sort` on sortable headers, updated on change
- [ ] Row checkboxes named with a meaningful identifier
- [ ] Select-all is tri-state via the DOM property
- [ ] Scroll container is focusable and named
- [ ] `<caption>` is the first child of `<table>`
- [ ] Error block is `role="alert"`; body is `aria-busy` while loading
- [ ] Bulk bar sits in flow, states its count, `Escape` clears
- [ ] Permission-blocked actions are disabled with a reason, not hidden
- [ ] Destructive confirmations state scope and reversibility
- [ ] Row actions are reachable without hover
- [ ] Small-screen strategy is chosen deliberately
