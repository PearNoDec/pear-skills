# Design System Standard

## Principle

A polished frontend is a system, not a collection of individually styled screens.

## Semantic color tokens

Prefer semantic variables such as:

```css
--background
--foreground
--surface
--surface-secondary
--surface-elevated
--muted
--muted-foreground
--border
--border-strong
--primary
--primary-foreground
--secondary
--secondary-foreground
--accent
--success
--warning
--destructive
```

Use brand-specific values behind these semantic roles.

Avoid scattering raw hex values throughout components.

## Typography roles

Define at minimum:

- Display
- H1
- H2
- H3
- H4
- Title
- Body
- Body Small
- Label
- Caption
- Data / Numeric

Control:

- Size
- Weight
- Line height
- Letter spacing
- Measure

Marketing surfaces can have larger scale contrast.
Operational surfaces should have tighter, more scan-friendly hierarchy.

## Spacing

Use a consistent scale such as:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
- 80
- 96
- 128

The exact values may vary, but the system should be predictable.

## Radius

Use a limited scale, for example:

- sm
- md
- lg
- xl

Not every component needs rounded corners.

## Borders and elevation

Build depth through a combination of:

- Surface contrast
- Borders
- Transparency
- Blur
- Lighting
- Shadow

Avoid heavy black shadows and excessive elevation layers.

## Component variants

Components should use controlled variants rather than copy-pasted styling.

Example dimensions:

- Visual intent
- Size
- Density
- State
- Theme

## State design

Important components should consider:

- Default
- Hover
- Focus
- Active
- Selected
- Disabled
- Loading
- Error
- Success

## Icon system

Default to Lucide Icons.

Keep:

- Shared icon sizes
- Shared stroke width
- Consistent optical alignment
- Predictable icon-button dimensions

Do not use emoji as interface icons.
