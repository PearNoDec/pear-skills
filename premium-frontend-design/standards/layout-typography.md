# Layout and Typography Standard

## Grid

Use a deliberate layout foundation.

For wide layouts, a 12-column grid is often useful, but do not force it where a simpler system is more appropriate.

Define:

- Max content width
- Wide-media width
- Page gutter
- Column gap
- Section spacing
- Reading measure

Use fluid gutters where appropriate.

## Layout composition

Available patterns:

- Editorial layout
- Bento grid
- Asymmetric grid
- Split screen
- Full bleed
- Layered composition
- Sticky storytelling
- Modular grid
- Horizontal sequence
- Workspace layout

Choose patterns based on information structure.

## Rhythm

Avoid identical section structures throughout a long page.

Use variation in:

- Width
- Density
- Alignment
- Background
- Media scale
- Type scale
- Motion

## Text measure

Long-form body text should not span an unnecessarily wide viewport.

Use readable line lengths and maintain sufficient line height.

## Fluid type

When suitable, use `clamp()` to produce smooth scaling.

Example:

```css
font-size: clamp(2.75rem, 6vw, 7rem);
```

Avoid extreme mobile type sizes that force every phrase into many awkward lines.

## Numeric typography

For dashboards and metrics:

- Align digits consistently
- Consider tabular numerals when useful
- Make units and context visually subordinate to the main value
- Preserve semantic meaning, not just visual impact
