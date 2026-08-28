# Final Design Review Checklist

Use this before declaring a frontend complete.

## Product comprehension

- [ ] The main purpose is clear.
- [ ] The primary user or customer is understandable.
- [ ] The primary value is visible early.
- [ ] The next action is obvious.
- [ ] Trust or operational state is communicated where necessary.

## Brand and visual quality

- [ ] The design does not look like a generic AI template.
- [ ] There is a coherent visual language.
- [ ] Typography hierarchy is strong.
- [ ] Spacing is consistent.
- [ ] Grid alignment is intentional.
- [ ] Color usage is consistent and semantic.
- [ ] Radius is controlled.
- [ ] Shadows are restrained.
- [ ] Lucide icons are used consistently by default.
- [ ] No emoji is used as UI iconography.
- [ ] Long pages have clear rhythm and visual pacing.
- [ ] At least one memorable visual or interaction idea exists when appropriate.

## UX

- [ ] Navigation hierarchy is clear.
- [ ] Primary and secondary actions are differentiated.
- [ ] Important actions are discoverable.
- [ ] Forms have labels and clear feedback.
- [ ] Dangerous actions are protected.
- [ ] Loading state exists where needed.
- [ ] Empty state exists where needed.
- [ ] Error state exists where needed.
- [ ] Permission state exists where needed.
- [ ] Search and filters communicate their current state.

## Responsive

- [ ] Wide desktop layout is intentional.
- [ ] Laptop layout works.
- [ ] Tablet layout works.
- [ ] Mobile is redesigned rather than merely scaled.
- [ ] No accidental horizontal overflow exists.
- [ ] Headings wrap naturally.
- [ ] Touch targets are usable.
- [ ] Tables have a deliberate small-screen strategy.
- [ ] Dialogs and drawers fit small screens.
- [ ] Sticky elements do not cover important content.

## Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Native semantic elements are used where possible.
- [ ] Forms are labeled.
- [ ] Contrast is adequate.
- [ ] Important state is not color-only.
- [ ] Reduced-motion behavior exists for significant animation.

## Motion

- [ ] Motion intensity matches the product mode.
- [ ] Animation does not block task completion.
- [ ] Hover motion is subtle and purposeful.
- [ ] Scroll motion is stable.
- [ ] No constant distracting movement exists.

## Performance

- [ ] Hero media is appropriately optimized.
- [ ] Images have stable dimensions.
- [ ] Below-fold media is lazy-loaded when appropriate.
- [ ] Fonts are controlled.
- [ ] Animation avoids unnecessary layout work.
- [ ] Advanced rendering has a fallback.
- [ ] Layout shift is minimized.

## Engineering

- [ ] Components are reasonably reusable.
- [ ] Tokens are centralized.
- [ ] Repeated markup or styling is minimized.
- [ ] No unnecessary dependency was added.
- [ ] Business logic was preserved unless change was required.
- [ ] No fragile viewport-specific hack is carrying the layout.

## Final anti-template questions

- [ ] Could this interface belong unchanged to any random startup? If yes, redesign.
- [ ] Are cards being used because they are actually useful? If no, simplify.
- [ ] Are decorative effects tied to brand or comprehension? If no, remove them.
- [ ] Is the strongest visual element also an important content element? If no, reconsider hierarchy.
