# Overlays and Navigation Standard

Dialogs, drawers, popovers, menus, tooltips, toasts, tabs and the command palette are where a product's interaction quality is actually judged — and where keyboard and screen-reader users are most often locked out. This file is the contract each one has to meet. Like `standards/data-grid.md`, it is framework-neutral: Radix, Headless UI, Ark, Ant Design, Element Plus and a hand-rolled `<dialog>` all have to satisfy the same rows.

**If the project already uses a headless or component library, use its primitives.** They have solved focus management, scroll locking and positioning; re-implementing them is how the bugs below come back. The contract still applies — verify the library actually meets it in your configuration.

## Layer selection

| Need | Layer | Not |
|---|---|---|
| A decision that blocks the task (confirm delete, unsaved changes) | Modal dialog | A toast, a drawer |
| A record's detail or an edit form, while the list stays in context | Drawer (side sheet) | A dialog that hides the list; a new page for a two-field edit |
| A small choice anchored to a control | Popover / menu | A dialog |
| Explaining an icon or a truncated value | Tooltip | Anything that requires a click to read |
| The outcome of an action just taken | Toast | A dialog that interrupts |
| A long operation the user should keep working through | Inline progress or a status bar | A blocking spinner |
| Fast navigation across a large product | Command palette | A five-level mega menu |

**Do not stack dialogs.** A confirmation on top of an edit dialog is a smell; put the confirmation inline in the dialog footer, or make the edit a drawer so the confirmation can be a dialog.

## The overlay contract

Every row applies to dialog and drawer; most apply to popover and menu.

| Requirement | Detail |
|---|---|
| **Focus moves in** | On open, focus the first meaningful control — or the heading, or the close button if the content is read-only. Not the body; not nothing |
| **Focus is trapped** | `Tab` cycles inside the overlay. `<dialog>.showModal()` does this natively; custom overlays need a trap |
| **Focus returns** | On close, focus goes back to the element that opened it. Store it on open; do not rely on the browser |
| **`Escape` closes** | Except mid-operation (submitting) or when closing would lose data — then `Escape` asks |
| **Outside click** | Closes a popover or menu. For a dialog: closes only if there is nothing to lose. A dialog with a form does not dismiss on backdrop click |
| **Scroll is locked** | The page behind a modal must not scroll. Lock the body **without** shifting layout — see `assets/app-shell-baseline.css` for the `scrollbar-gutter` approach |
| **`aria-modal` and a name** | `role="dialog" aria-modal="true" aria-labelledby="<heading id>"`. A dialog with no accessible name announces as "dialog" |
| **Background is inert** | Content behind a modal is `inert` (or `aria-hidden` plus focus trap on older targets) |
| **It fits small screens** | A dialog becomes a bottom sheet or full-screen below `md`; a drawer becomes full-width. Test at 375 with the keyboard open |
| **Respects safe areas** | Bottom sheets and drawers pad `env(safe-area-inset-bottom)` |
| **Close is reachable** | A visible close button, ≥ 44px on touch, in the same place every time |

Native `<dialog>` with `showModal()` satisfies the first four and the inert row for free in every current browser, and is the right default when there is no component library.

## Dialog

- Title states the decision, in the user's words: "Delete 12 orders?" not "Confirm".
- One primary action, labeled with the outcome ("Delete 12 orders"), one cancel. Destructive primary uses the destructive variant and is **not** the default-focused control — focus the cancel button so `Enter` does not destroy.
- The body states scope and reversibility. See `standards/content-copy.md`.
- Width by content: a confirmation is narrow (~28rem); a form dialog is wider but capped (~40rem). Content taller than the viewport scrolls inside the dialog body, with the header and footer fixed.
- Sizing: never `height: 100vh` — use `100dvh` with a max, or the keyboard on mobile hides the footer.

## Drawer

- Slides from the inline-end side (right in LTR, left in RTL) for detail/edit; from the bottom on mobile.
- Width: ~32–40rem for a record; wider only if the content is genuinely wide (a table, a diff). Never a drawer that covers the whole desktop — that is a page.
- Header: title, the record's identifier, state, and the close button. Sticky.
- The list behind it stays visible and, for navigation between records, **the drawer stays open while the selection changes** — closing and reopening on every row is the common failure.
- The URL reflects the open record (`?order=SO-40881`) so refresh and share work.

## Popover and menu

- Positioned by the library's engine (Floating UI, CSS anchor positioning where supported). It flips when it would overflow the viewport, and it does not get clipped by an `overflow: hidden` ancestor — portal it to the body if so.
- Menu: `role="menu"`, items `role="menuitem"`; `↑`/`↓` move, `Home`/`End` jump, typing a letter jumps, `Enter`/`Space` activates, `Escape` closes and returns focus to the trigger. A menu that only works by mouse is a defect.
- Trigger has `aria-expanded` and `aria-haspopup`. Icon-only triggers have an `aria-label`.
- Destructive items sit last, separated, in the destructive color, and never adjacent to a frequently used item.
- Submenus open on hover *and* on `→`; close on `←`. Beyond one level of submenu the navigation is wrong.

## Tooltip

- Appears on hover **and** on focus; disappears on blur, `Escape`, and mouse-out. Delay ~300ms on hover, none on focus.
- Content is plain text, never interactive. If it needs a link or a button, it is a popover.
- Never the only place a value lives: a truncated cell has its full value in the DOM (`title` alone is not accessible); an icon-only button has an `aria-label` and the tooltip merely repeats it.
- Tooltips do not open on touch. Do not put information users need behind them.

## Toast

- `aria-live="polite"` region, mounted once at the app root. Errors that block work are `role="alert"` — or better, a dialog or an inline error, because a toast disappears.
- Duration by content: success 3–5s; anything with an action (Undo) ≥ 8s; errors do not auto-dismiss. Pause the timer on hover and on focus.
- Maximum three visible; older ones collapse. A stack of eight toasts is a bug report.
- Say what happened using the same vocabulary as the action: the button said "Publish", the toast says "Published", not "Success".
- Position bottom-inline-start on desktop, bottom-center above safe-area on mobile. Never over the primary action of the screen.
- Toasts are not a place for content the user must act on later. A toast that says "Export ready — download" and disappears has lost the export.

## Tabs

- `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected` and `aria-controls`; arrow keys move between tabs, `Tab` moves into the panel.
- Automatic activation (arrow = switch) when switching is cheap; manual (arrow moves focus, `Enter` switches) when a panel is expensive to load.
- The active tab reads from position and contrast, not from color alone. The indicator animates along the *x* axis with `transform`, not by re-laying out.
- The selected tab is in the URL when the tabs are page-level navigation.
- More than ~7 tabs is a list, a select, or a sidebar.

## Command palette

The highest-leverage efficiency feature in a SAAS product or ADMIN tool (`modes/admin.md`). Contract:

- `⌘K` / `Ctrl+K`, and a visible way in for users who do not know the shortcut.
- Combobox semantics: input with `role="combobox"`, results as `role="listbox"`/`role="option"`, `aria-activedescendant` tracking the highlighted item.
- Results are grouped (Navigate / Actions / Records), ranked, and show the shortcut for actions that have one.
- Recent items appear before the user types. Empty query is not an empty state.
- Search must ignore IME composition — `standards/forms.md` § IME.
- Selecting an item closes the palette and returns focus to where the user was, or to the new destination.

## Navigation structures

**Header (marketing).** Logo, 4–7 primary items, one primary CTA, one quiet secondary. A mega menu only for a genuinely complex organization, and on mobile the hierarchy is redesigned, not collapsed into a 30-item accordion. Sticky headers lose their bottom border or gain a shadow on scroll so the boundary reads; height is a CSS variable (`--header-height`) so anchors and sticky offsets can use it.

**Sidebar (product / admin).** Grouped items with labels, a clear active state (not color alone — a bar, weight, or background), collapse to icons **with tooltips** on collapse, and a persistent way to expand. Keyboard: the sidebar is a `<nav>` with a list; arrow keys are optional, `Tab` must work. The current page has `aria-current="page"`.

**Breadcrumb.** `<nav aria-label="Breadcrumb">` with an ordered list; the last item is the current page and not a link. Truncate the middle on narrow screens, never the ends.

**Bottom navigation (mobile product).** 3–5 items, labels visible, active item unambiguous, padded above `env(safe-area-inset-bottom)`. Content scrolls above it, never behind it.

**Pagination.** Current page, total, previous/next as real buttons with labels, and page size visible. Keep scroll position on return. Infinite scroll only when the user never needs to reach the end — and never on a page with a footer.

## Checklist

- [ ] The right layer for the job — no dialog for a detail, no toast for a decision
- [ ] Focus moves in, is trapped, and returns to the trigger
- [ ] `Escape` and outside-click behave per the table; nothing loses data on dismiss
- [ ] Scroll behind a modal is locked without layout shift
- [ ] Dialog/drawer has an accessible name; background is `inert`
- [ ] Destructive confirmations focus Cancel, not Delete
- [ ] Menus and tabs are fully keyboard-operable; icon-only triggers are labeled
- [ ] Tooltips also open on focus and are never the only place a value lives
- [ ] Toasts: one live region, ≤ 3 visible, errors do not auto-dismiss, vocabulary matches the action
- [ ] Overlays fit 375px with the keyboard open and respect safe areas
- [ ] Drawer/tab/record state is reflected in the URL where users would share or refresh
- [ ] Active navigation state is `aria-current` and not color-only
