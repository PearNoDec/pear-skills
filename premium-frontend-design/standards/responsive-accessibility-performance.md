# Responsive, Accessibility and Performance Standard

## Responsive design

Explicitly design for:

- Wide desktop
- Desktop
- Laptop
- Tablet
- Mobile

Do not treat mobile as a shrunken desktop.

Review:

- Content order
- Navigation
- Heading wrapping
- Grid collapse
- CTA placement
- Forms
- Tables
- Charts
- Sticky elements
- Drawers and dialogs
- Media cropping
- Motion
- Touch targets

## Accessibility

Target strong WCAG-aligned behavior.

Require:

- Semantic HTML
- Keyboard-operable controls
- Visible focus states
- Sufficient text contrast
- Form labels
- Clear validation and error associations
- Accessible modal focus management
- Alt text for meaningful images
- Appropriate ARIA only where native semantics are insufficient
- Reduced-motion support

Do not communicate important state through color alone.

## Performance

Protect:

- LCP
- CLS
- INP

Prefer:

- Stable image dimensions
- Responsive media
- AVIF / WebP
- Lazy loading below the fold
- Font optimization
- Code splitting
- Deferred noncritical features
- `transform` and `opacity` for motion

Avoid:

- Large uncompressed video
- Excessive client-side rendering
- Heavy libraries for small effects
- Layout thrashing
- Scroll listeners doing expensive synchronous work
- Huge DOM trees

## Advanced visual fallback

For WebGL, 3D, Canvas or heavy video:

- Provide static or lightweight fallback
- Disable or reduce on constrained devices when necessary
- Respect reduced motion
- Avoid blocking primary content or CTA
