# Frontend Design and Implementation Workflow

Use this workflow for substantial design, redesign or optimization work.

## Phase 1 - Context

Understand:

- Product type
- Target audience
- Business objective
- Primary user task
- Existing brand direction
- Technical stack
- Existing component system
- Constraints

If the codebase is available, inspect it rather than assuming structure.

## Phase 2 - Mode selection

Choose:

- CORPORATE
- SAAS Marketing
- SAAS Product
- ADMIN
- GENERAL
- Hybrid combination

Record the priority order implied by that mode.

## Phase 3 - Audit

Review the current experience for:

- Value proposition clarity
- Information architecture
- Hierarchy
- Typography
- Spacing
- Grid
- Brand distinctiveness
- Navigation
- CTA priority
- Repeated layout patterns
- State completeness
- Responsive problems
- Accessibility
- Performance concerns

Identify the highest-impact issues first.

## Phase 4 - Direction

Define a compact design direction before detailed implementation.

Specify:

- Product mode
- Visual personality
- Type direction
- Color roles
- Grid behavior
- Radius philosophy
- Surface / border philosophy
- Signature visual language
- Motion intensity
- Information density

Do not produce a random collection of fashionable effects.

## Phase 5 - Information architecture

Fix structural issues before visual polish.

Determine:

- Main message
- Content sequence
- Navigation hierarchy
- Primary and secondary actions
- Trust placement
- Product explanation
- Workflow hierarchy
- Critical states

## Phase 6 - Design system

Normalize:

- Tokens
- Typography
- Spacing
- Radius
- Buttons
- Forms
- Navigation
- Surfaces
- Icons
- Motion

## Phase 7 - Implementation

Implement in this order where possible:

1. Structure and semantic markup
2. Layout and responsive rules
3. Typography
4. Core components
5. Content hierarchy
6. States
7. Visual signatures
8. Motion
9. Polish

Do not start with decorative effects while the information architecture is still weak.

## Phase 8 - Responsive pass

Test each major breakpoint and specifically inspect:

- Heading wraps
- Navigation behavior
- Section order
- Grid collapse
- Table strategy
- Form usability
- CTA visibility
- Sticky behavior
- Dialog and drawer sizing
- Overflow

## Phase 9 - Accessibility pass

Check:

- Keyboard navigation
- Focus
- Semantic controls
- Labels
- Dialog behavior
- Contrast
- Reduced motion
- Status messages

## Phase 10 - Performance pass

Check:

- Hero media weight
- Fonts
- Image sizing
- Animation cost
- Client-side JavaScript
- Layout shift
- Scroll performance
- WebGL / Canvas fallback

## Phase 11 - Design review

Use `workflow/design-review.md`.

## Phase 12 - Final polish

Inspect the product at real viewport sizes, not only isolated components.

Look for small inconsistencies that make an otherwise good product feel unfinished.
