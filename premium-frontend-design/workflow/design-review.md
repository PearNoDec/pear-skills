# Final Design Review Checklist

Use this before declaring a frontend complete.

Items marked **[V]** must be confirmed against a rendered browser, not from reading the code. See `workflow/browser-verification.md`.

## Product comprehension

- [ ] The main purpose is clear.
- [ ] The primary user or customer is understandable.
- [ ] The primary value is visible early.
- [ ] The next action is obvious.
- [ ] Trust or operational state is communicated where necessary.

## Brand and visual quality

- [ ] The design does not look like a generic AI template — first generation (gradient / glass / pill) **or** second (cream + serif + terracotta, black + acid accent, broadsheet rules, the SaaS card kit). See `standards/anti-patterns.md` §2.
- [ ] No template chrome: no tracked ALL-CAPS eyebrows, middle-dot meta strings, `WORD — fragment` labels, `→` glued to labels, mono for every metadata line, or a single accented word in a headline.
- [ ] I would not have produced roughly this for a different brief in the same category.
- [ ] There is a coherent visual language.
- [ ] Typography hierarchy is strong.
- [ ] Spacing is consistent, and gaps inside a group are visibly smaller than gaps between groups.
- [ ] Long-form text is set to a reading measure, not to the full container width.
- [ ] Grid alignment is intentional.
- [ ] Color usage is consistent and semantic.
- [ ] Radius is controlled.
- [ ] Shadows are restrained.
- [ ] One icon system — the project's own if it has one, otherwise Lucide — at consistent size, stroke and baseline.
- [ ] No emoji is used as UI iconography.
- [ ] Long pages have clear rhythm and visual pacing.
- [ ] At least one memorable visual or interaction idea exists when appropriate.
- [ ] **[V]** Dark theme is complete and correct, if the project has one.
- [ ] **[V]** Elevation reads correctly in both themes — no grey shadow smears in dark.

## Content and copy

- [ ] No placeholder text, lorem ipsum or invented statistics remain.
- [ ] No banned filler vocabulary (empower / seamless / revolutionize / unlock).
- [ ] Headlines read on their own and communicate without the body copy.
- [ ] Button labels state the outcome, not "Submit" or "Confirm".
- [ ] Error messages say what happened and what to do next.
- [ ] Empty states teach the next action.
- [ ] Destructive confirmations state scope and reversibility.
- [ ] Nothing was fabricated — no invented customer, logo, quote or metric.
- [ ] One name per action through the whole flow (button → confirmation → toast → status).
- [ ] Chinese copy: 你 / 您 used consistently; no 赋能 / 一站式 / 全方位 filler.

## UX

- [ ] Navigation hierarchy is clear.
- [ ] Primary and secondary actions are differentiated.
- [ ] Important actions are discoverable.
- [ ] Forms have labels and clear feedback.
- [ ] Dangerous actions are protected.
- [ ] **[V]** Loading state exists and was rendered, not assumed.
- [ ] **[V]** Empty state exists and was rendered.
- [ ] **[V]** Error state exists and was rendered.
- [ ] **[V]** Permission-restricted state exists where relevant.
- [ ] "Nothing exists yet" and "filters exclude everything" are distinct states.
- [ ] Search and filters communicate their current state.
- [ ] Row and item actions are reachable without hover.
- [ ] If the product has a data grid, its checklist in `standards/data-grid.md` passes.

## Forms

See `standards/forms.md`. Skip only if the surface has no form.

- [ ] Labels visible and associated; field widths match expected input; one column except for true pairs.
- [ ] Validation on blur then on submit; the first invalid field is focused; long forms have an error summary.
- [ ] `aria-describedby` / `aria-invalid` / `role="alert"` wired; groups use `fieldset` / `legend`.
- [ ] `type`, `inputmode`, `autocomplete` set; identifiers are not `type="number"`.
- [ ] **[V]** `Enter` and live filtering ignore IME composition (type Chinese into it).
- [ ] Autosave *or* an unsaved-changes guard, chosen deliberately.
- [ ] **[V]** Submitting state keeps layout stable; success state says what is next.

## Overlays and navigation

See `standards/overlays-navigation.md`.

- [ ] **[V]** Dialogs and drawers: focus moves in, is trapped, returns to the trigger; `Escape` behaves; background is inert.
- [ ] Destructive confirmations focus Cancel, not the destructive action.
- [ ] **[V]** Body scroll is locked behind modals without a layout shift.
- [ ] Menus, tabs and the command palette are fully keyboard-operable; icon-only triggers are labeled.
- [ ] Tooltips open on focus too, and are never the only place a value lives.
- [ ] Toasts: one live region, ≤ 3 visible, errors persist, vocabulary matches the action.
- [ ] **[V]** Overlays fit 375px with the keyboard open; bottom sheets respect the safe area.
- [ ] Drawer / tab / record state is in the URL where users would share or refresh.

## Application shell

See `standards/app-shell.md`. Product surfaces only.

- [ ] One scroll model; exactly one scroller; `min-height: 0` / `min-width: 0` where scrollers live.
- [ ] `100dvh` with fallback; nothing critical behind mobile browser chrome.
- [ ] **[V]** Sticky header, sticky table header and sticky page header all actually stick.
- [ ] Sidebar collapses with tooltips, persists, and becomes a drawer on small screens.
- [ ] `viewport-fit=cover`, safe-area padding, `overscroll-behavior: contain`, `scrollbar-gutter: stable`.
- [ ] Route changes swap the content region only.

## Data visualization

See `standards/data-visualization.md`. Skip only if there are no charts.

- [ ] Every chart has a title that states the claim, with unit and period; chart type matches the question.
- [ ] KPI figures carry label, comparison with sign and direction, and period.
- [ ] Series colors are token roles tuned per theme; no status hue reused; nothing color-only.
- [ ] Bar axes start at zero; direct labels where possible; ≤ 6 series.
- [ ] **[V]** All chart states render at the final size; no empty axis frame.
- [ ] A table fallback exists; canvas charts have an accessible name.
- [ ] **[V]** Row baselines align; one time-range control; data timestamp visible.

## Responsive

- [ ] **[V]** Wide desktop (1920) layout is intentional, not stretched.
- [ ] **[V]** Laptop (1440) layout works.
- [ ] **[V]** Tablet (768) layout works — the awkward middle is handled.
- [ ] **[V]** Mobile (375) is redesigned rather than merely scaled.
- [ ] **[V]** No accidental horizontal overflow exists at any width.
- [ ] Headings wrap naturally.
- [ ] Touch targets are usable.
- [ ] Tables have a deliberate small-screen strategy.
- [ ] Dialogs and drawers fit small screens.
- [ ] Sticky elements do not cover important content.

## Internationalization

- [ ] Text containers survive a 40% string-length increase.
- [ ] Logical properties are used instead of left/right, if RTL is in scope.
- [ ] Dates, numbers and currency are locale-formatted, not hand-assembled.
- [ ] The chosen font covers every script the product ships in.

## CJK typography

Skip only if the product will never ship Chinese, Japanese or Korean. See `standards/cjk-typography.md`.

- [ ] Body line-height is ≥ 1.75 — not the Latin default.
- [ ] Body text is ≥ 14px.
- [ ] Every weight used exists in the family; no synthesised bold.
- [ ] The Latin face precedes the CJK face in the stack; digits render in the Latin face.
- [ ] No italic in CJK text.
- [ ] No negative letter-spacing on CJK.
- [ ] `line-break: strict`; `word-break` is not `break-all`.
- [ ] Buttons and navigation do not look under-filled with short Chinese labels.
- [ ] **[V]** Any custom CJK webfont is subsetted, or the system stack is used.

## Accessibility

- [ ] **[V]** Keyboard navigation completes the primary flow.
- [ ] **[V]** Focus states are visible on every surface they land on.
- [ ] Native semantic elements are used where possible.
- [ ] Forms are labeled — visible labels, not placeholder-as-label.
- [ ] **[V]** Contrast is adequate, verified in every theme.
- [ ] Important state is not color-only.
- [ ] Reduced-motion behavior exists for significant animation.
- [ ] **[V]** Console is free of errors and warnings.

## Motion

See `standards/motion-interaction.md`.

- [ ] Motion intensity matches the product mode.
- [ ] Duration matches the distance travelled; exits are shorter than entrances.
- [ ] Only `transform` and `opacity` animate in any 60fps path.
- [ ] Everything hover reveals is also revealed on `:focus-visible`.
- [ ] Above-the-fold content is not animated on load.
- [ ] **[V]** Content is visible with JavaScript disabled — no `opacity: 0` waiting on an observer.
- [ ] The focus ring has no transition.
- [ ] Animation does not block task completion; no constant distracting movement.
- [ ] Reduced motion reduces feedback rather than deleting it.

## Performance and discoverability

See `standards/media-seo.md` for public pages.

- [ ] **[V]** Hero image has dimensions and `fetchpriority="high"`, is not lazy, and has a `sizes` that matches the layout.
- [ ] Every image has dimensions; below-fold media is lazy.
- [ ] Fonts self-hosted, subset, `font-display: swap`, preloaded only above the fold.
- [ ] Theme script is first in `<head>`; nothing else render-blocking.
- [ ] Above-the-fold content is in the HTML.
- [ ] Animation avoids layout work; advanced rendering has a fallback.
- [ ] **[V]** LCP < 2.5 s, CLS < 0.1, first-view transfer < 1 MB — or the disproportionate item is named and fixed.
- [ ] Public pages: unique `<title>` and description, canonical, `hreflang` where multilingual, designed OG image, correct `<html lang>`, one `h1`, landmarks, styled 404.
- [ ] `scripts/lint-design.mjs` runs clean of errors (`--cjk` for CJK products).

## Engineering

- [ ] Components are reasonably reusable.
- [ ] Tokens are centralized.
- [ ] Repeated markup or styling is minimized.
- [ ] No unnecessary dependency was added.
- [ ] Business logic was preserved unless change was required.
- [ ] No fragile viewport-specific hack is carrying the layout.

## Final anti-template questions

- [ ] Could this interface belong unchanged to any random startup? If yes, redesign.
- [ ] Would I have made roughly these choices for a different brief in the same category? If yes, the choices came from the category — see `standards/anti-patterns.md` §2.
- [ ] Are cards being used because they are actually useful? If no, simplify.
- [ ] Are decorative effects tied to brand or comprehension? If no, remove them.
- [ ] Is the strongest visual element also an important content element? If no, reconsider hierarchy.
- [ ] Is the boldness spent in exactly one place, with everything else disciplined? If it is spread across five effects, cut four.
- [ ] Has one thing been removed since the last pass? If nothing could be removed, look harder.
