# Admin / Enterprise Operations Mode

## Mission

Admin products are working environments. Optimize for **efficiency → clarity → density → reliability → error prevention → consistency.**

Visual sophistication comes from hierarchy, spacing, typography, state design and interaction quality — never from decorative spectacle. The user is here for eight hours and knows this software better than you do.

## Application shell

A conventional shell is a feature, not a failure of imagination: sidebar, topbar, breadcrumb, page header, context actions, filter/search area, main workspace, secondary panel, drawer, dialog, toast layer. Predictability *is* the design goal — an operator who has to relearn navigation loses more than a novel layout ever gains.

**Sidebar.** Grouped navigation with a clear active state, collapse support, tenant/workspace context, and permission-aware items. Avoid icon-only navigation in a complex product unless the labels stay discoverable.

**Page header.** Compact, answering four questions: where am I, what is this, what is its state, what is the primary action. A hero-scale header inside a workspace steals working space — see `standards/anti-patterns.md`.

## Density

Do not force consumer-app whitespace onto a professional tool. Dense CRM, ERP, BI and operations products benefit from a **user-selectable** density (compact / default / comfortable), implemented as the `--density` multiplier in `assets/tokens.schema.css` so one attribute resizes every control at once.

Set density from the work, not from taste: how many rows does the operator need to see without scrolling to make a decision?

## Data grid

The most important component in the product. Its state matrix, accessibility contract, selection and bulk-action rules, permission gating and small-screen strategy are in **`standards/data-grid.md`**.

Two decisions belong here rather than there:

- **Never convert structured data into cards** because cards look more modern. Cards destroy comparability, which is the entire point of tabular data.
- **Choose the feature set by need, not by catalog.** Sort, filter, search and pagination are table stakes. Column resize/pin/reorder, saved views, inline edit, virtualization and export are each a real cost — add the ones this operator's workflow actually requires.

## Filters

The rule: **the current filter state must always be readable from the screen.** Visible active filters, a count, and a clear-all. A filter bar that does not show what is filtered produces support tickets about "missing" data.

Beyond that, scale to the work: quick filters for the common cases, advanced multi-condition rules where the domain needs them, and saved views for anything an operator does daily. Saved views are usually the highest-value feature in an operations tool and the most often omitted.

## Forms

The contract — layout, validation timing, accessibility, input attributes, IME handling, autosave versus unsaved-changes — is in **`standards/forms.md`**. The two decisions that belong here:

Complex forms need information architecture, not just fields. Group into sections; use tabs, an accordion, a stepper or side navigation once the form exceeds a screen. An endless unstructured column of inputs is the default failure.

Every field needs a visible label, a description where the expectation is not obvious, an explicit required/optional signal (mark whichever is rarer), and validation that names the field and the fix. Dependent fields, autosave where it is safe, and unsaved-change warnings where it is not.

Copy rules — helper text before the mistake, errors that state the fix — are in `standards/content-copy.md`.

## Bulk and destructive actions

Design bulk workflows explicitly: select all, bulk edit, assign, export, status change, archive, delete. These are why the product exists; treating them as an afterthought on top of a single-row UI is the most common admin design failure.

Destructive operations state **scope and reversibility** in the button and the confirmation: "Delete 12 orders? This cannot be undone." Not "Are you sure?"

## Permission states

Design read-only, no-access, partial-access, role-restricted and feature-restricted states into the UI. **Disabled with a reason beats hidden** — a hidden control reads as a bug to the user who expected it.

Never let a permission failure arrive as a backend error after the click.

## Dashboard

An operations dashboard surfaces critical KPIs, anomalies, risks, work requiring attention, trends and actionable queues. Every widget answers a business question; a widget that only occupies grid space should be removed. Chart selection, KPI anatomy, series color roles and chart states: `standards/data-visualization.md`.

## Shell

The sidebar / header / content-region engineering — one scroller, `min-height: 0`, `100dvh`, sticky offsets, portaled overlays — is `standards/app-shell.md`. Dialog, drawer, menu, toast and command-palette contracts are `standards/overlays-navigation.md`. In a Chinese 中后台 the stack is usually Ant Design or Element Plus; `standards/stack-adapters.md` maps the token layer onto them without a second source of truth.

## Color and motion

Color carries brand, hierarchy, status, risk and selection — nothing else. Keep success/warning/error/info semantics rigidly consistent, and make sure the brand hue does not collide with a status hue (see the note in `assets/token-presets.css`). Do not turn the application into a rainbow of competing states.

Motion is fast and restrained: dropdowns, drawers, dialogs, toasts, tabs, row expansion, navigation. Nothing that makes a repeated action wait.

## Efficiency features

Keyboard shortcuts, a command palette, quick search, saved views, recent items, favorites, bulk actions, inline edit and context menus routinely create more product value than any visual work on the same screen. If there is budget for one "impressive" feature in an admin tool, spend it here.

## Responsive strategy

Decide explicitly which the product is — fully mobile capable, tablet optimized, mobile limited to critical tasks, or desktop first — and design to that answer. Do not squeeze every desktop column into a phone viewport. Table strategies for small screens are in `standards/data-grid.md`.

## Worked example

> **Brief:** "Redesign our order operations admin system."
>
> **Mode:** ADMIN. Efficiency and error prevention over visual novelty.
> **Key surfaces:** order data grid · saved filters · bulk state update · detail drawer · exception queue · refund workflow · permission-aware actions.
> **Strategy:** compact, highly legible table with rigid status-color semantics. Destructive actions separated spatially from routine ones. Saved views for the workflows operators run daily. Detail drawer as the small-screen strategy rather than horizontal scroll.
>
> Rejected: orders rendered as cards, dashboard gradients, a large title area eating working space, multiple dialogs for a common repetitive action.

`examples/before-after-admin.md` shows this brief as code, in Chinese.
