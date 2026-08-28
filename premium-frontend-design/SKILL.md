---
name: premium-frontend-design
description: Enterprise-grade frontend design and implementation skill for corporate websites, SaaS products, dashboards, admin systems, landing pages and digital products. Automatically chooses the appropriate visual, UX, information-density, motion, responsive, accessibility and engineering strategy for the product surface, then audits, implements and polishes the result to a premium production standard.
version: 1.0.0
author: pearno
---

# Premium Frontend Design Master Skill

## Purpose

Use this skill whenever a task involves designing, implementing, redesigning, reviewing or polishing a frontend experience.

This is not a "make it prettier" skill. It treats frontend work as the coordinated design and engineering of a complete digital product across:

- Information architecture
- Brand expression
- UX and interaction design
- Layout and visual hierarchy
- Design systems
- Typography
- Component architecture
- Motion and micro-interaction
- Responsive behavior
- Accessibility
- Performance
- Conversion and trust, when relevant
- Frontend maintainability

The quality target is a production-ready product with the intentionality of a strong brand studio, senior product-design team and senior frontend team working together.

Use Awwwards, FWA and CSS Design Awards as a visual-quality reference for appropriate surfaces, never as permission to sacrifice clarity, usability, conversion, accessibility or performance.

---

# 1. Activation Rules

Apply this skill for requests such as:

- Design a website or page
- Build a landing page
- Improve or optimize a frontend
- Redesign an existing UI
- Make this interface more premium
- Implement a supplied design
- Build a corporate website
- Build a SaaS website or SaaS application
- Build a dashboard
- Build an admin panel, CRM, ERP, CMS or internal tool
- Improve responsive design
- Improve visual hierarchy, motion or UX
- Review frontend quality

For an existing codebase, inspect the current implementation before making large design decisions whenever repository access is available.

---

# 2. Operate as a Multidisciplinary Team

Act simultaneously as:

- Creative Director
- Brand Designer
- Senior Product Designer
- UX Architect
- Design System Designer
- Creative Developer
- Senior Frontend Engineer
- Accessibility Specialist
- Performance Engineer

Do not optimize one discipline while ignoring the others.

A visually impressive page with confusing UX is a failed design.
A usable page with generic template aesthetics is unfinished.
A polished interface that is fragile, inaccessible or slow is not production quality.

---

# 3. Determine the Product Mode Before Designing

Classify the target surface before choosing the visual language.

## MODE A - CORPORATE

Use for:

- Enterprise websites
- Corporate websites
- Brand websites
- Technology-company websites
- Organization websites
- Official company websites
- High-end agency or studio sites

Priority order:

**Brand -> Trust -> Story -> Differentiation -> Conversion**

Allow stronger typography, visual storytelling, editorial composition and motion.

Read: `modes/corporate.md`

## MODE B - SAAS

Use for:

- SaaS marketing websites
- SaaS applications
- AI products
- B2B software
- Developer tools
- Productivity tools
- Workflow products

Marketing-surface priority:

**Value Clarity -> Product Understanding -> Trust -> Activation -> Conversion**

Authenticated-product priority:

**Task Success -> Clarity -> Speed -> Consistency -> Discoverability**

Read: `modes/saas.md`

## MODE C - ADMIN

Use for:

- Admin panels
- CMS
- ERP
- CRM
- Internal tools
- Enterprise dashboards
- Operations software
- Data-management platforms

Priority order:

**Efficiency -> Clarity -> Density -> Reliability -> Error Prevention -> Consistency**

Experimental aesthetics must be restrained.

Read: `modes/admin.md`

## MODE D - GENERAL / CREATIVE

Use when no specialist mode clearly dominates.

Balance:

**Identity -> UX -> Hierarchy -> Interaction -> Engineering**

Read: `modes/general.md`

---

# 4. Hybrid Products

Real products often require multiple modes.

Examples:

- SaaS public homepage: CORPORATE + SAAS Marketing
- SaaS authenticated application: SAAS Product
- SaaS organization settings or operations console: ADMIN
- Documentation: GENERAL + Product
- Investor or company pages: CORPORATE

Do not force every surface into one visual intensity.

Keep shared brand tokens while changing:

- Information density
- Motion intensity
- Layout conventions
- Decorative complexity
- Navigation patterns
- Component ergonomics

Marketing surfaces may be expressive.
Product surfaces should be efficient.
Operational surfaces should be highly predictable.

---

# 5. Existing Product Protection

Before redesigning an existing project, understand as much as available about:

- Framework and build system
- Routing
- Styling approach
- Existing component library
- Design tokens
- State management
- Business logic
- API boundaries
- Authentication and permissions
- Responsive behavior
- Current dependencies

Do not unnecessarily:

- Replace the framework
- Rewrite working business logic
- Change API contracts
- Replace state management
- Introduce large dependencies
- Remove existing features
- Break analytics, forms, SEO or accessibility

Integrate visual improvements into the existing architecture whenever reasonable.

---

# 6. Required Workflow

For meaningful redesign or implementation work, follow this sequence:

1. Understand the product and target users.
2. Identify the product mode.
3. Inspect the existing interface and code when available.
4. Audit the current hierarchy, layout, UX and responsive behavior.
5. Identify the highest-impact design problems.
6. Define a visual direction and design-system rules.
7. Define page or application information architecture.
8. Implement structural improvements before decorative polish.
9. Add states, responsive behavior and accessibility.
10. Add appropriate motion and micro-interaction.
11. Validate performance implications.
12. Run a final visual and UX polish pass.
13. Run the acceptance checklist before considering the work complete.

Full workflow: `workflow/design-process.md`
Review checklist: `workflow/design-review.md`

---

# 7. Core Design Philosophy

Every major decision should be intentional.

The design should be:

- Premium
- Distinctive
- Coherent
- Readable
- Responsive
- Accessible
- Performant
- Maintainable

Every important visual element should support at least one of:

- Brand
- Hierarchy
- Navigation
- Understanding
- Storytelling
- Interaction
- Trust
- Conversion
- Feedback

Remove decoration that serves none of these.

---

# 8. Icon Policy

Use Lucide Icons consistently across the interface unless the existing product has a deliberate, coherent icon system that must be preserved.

The default rule is:

- Use Lucide Icons
- Do not use emoji in interface design
- Do not use Unicode symbols as icon substitutes
- Do not mix unrelated icon libraries
- Keep size, stroke width, baseline and optical weight consistent

Icons are functional communication tools, not random decoration.

---

# 9. Reject Generic AI UI

Actively avoid interfaces that look like an unedited AI template.

Do not default to:

- Purple-blue gradient everywhere
- Random glowing spheres
- Excessive glassmorphism
- Every element inside a rounded card
- Excessive pill controls
- Generic text-left / mockup-right hero
- Repeated title + paragraph + three-card sections
- Gradient buttons everywhere
- Meaningless badges
- Decorative blobs without purpose
- Excessively large radii
- Center-aligned everything
- Identical section heights and rhythms
- Generic Tailwind demo styling
- Generic component-library demo styling
- Low-information dashboards designed only for screenshots

Ask during review:

"Could I replace the company name and use this exact page for any startup?"

If yes, the design is not specific enough.

Read: `standards/anti-patterns.md`

---

# 10. Design System First

Do not style each component independently.

Establish a shared system for:

- Color
- Typography
- Spacing
- Radius
- Borders
- Elevation
- Motion
- Breakpoints
- Component states
- Density

Prefer semantic tokens over arbitrary hard-coded values.

Read: `standards/design-system.md`

---

# 11. Layout System

Use a deliberate responsive layout system.

Recommended foundations:

- 12-column desktop grid when appropriate
- Fluid container widths
- Consistent gutters
- Clear content max-width rules
- Strong vertical rhythm
- Responsive grid behavior
- Controlled readable line lengths

Available composition patterns include:

- Editorial layout
- Bento grid
- Split layout
- Asymmetric grid
- Full-bleed visual
- Sticky storytelling
- Horizontal sequence
- Layered composition
- Modular grid
- Data workspace layout

Do not repeat the same composition for every section.

Read: `standards/layout-typography.md`

---

# 12. Typography

Typography should establish hierarchy before decoration is added.

Define roles such as:

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

- Font size
- Font weight
- Line height
- Letter spacing
- Measure
- Contrast
- Responsive scaling

Use fluid typography such as `clamp()` where appropriate.

Corporate and marketing surfaces may use oversized or editorial typography.
Product and admin surfaces should prioritize scanability and operational efficiency.

---

# 13. Page Rhythm

A premium page should feel composed rather than stacked.

Vary:

- Density
- Whitespace
- Text scale
- Media scale
- Grid structure
- Background treatment
- Motion intensity

Think in narrative stages:

**Intro -> Build-up -> Proof -> Exploration -> Visual Peak -> Resolution -> CTA**

Not every page requires all stages, but long pages should have deliberate pacing.

---

# 14. Motion Strategy

Use motion as part of the design language, not decoration added at the end.

Preferred techniques when appropriate:

- Natural easing
- Spring motion
- Stagger
- Fade / translate
- Blur reveal
- Mask reveal
- Clip reveal
- Scroll-linked motion
- Parallax
- Magnetic interaction
- Cursor interaction
- SVG motion

Intensity by surface:

- Corporate / campaign: medium to high when justified
- SaaS marketing: medium
- SaaS application: low to medium
- Admin: low

Avoid:

- Bounce everywhere
- Constant motion
- Slow interaction-blocking transitions
- Large hover zooms
- Unnecessary page transitions
- Animation on every visible element

Always support reduced-motion preferences.

Read: `standards/motion-interaction.md`

---

# 15. State Completeness

Never design only the ideal state.

For important components consider:

- Default
- Hover
- Focus
- Active
- Selected
- Disabled
- Loading
- Empty
- Success
- Warning
- Error
- Partial / degraded
- Permission-restricted when relevant

For applications also consider:

- First-run
- Offline
- No results
- Archived
- Draft
- Processing
- Unsaved changes

---

# 16. Responsive Design

Design explicitly for:

- Wide desktop
- Desktop
- Laptop
- Tablet
- Mobile

Mobile is not a scaled desktop page.

Re-evaluate on smaller screens:

- Content order
- Navigation
- Typography
- Grid
- Visual hierarchy
- CTA placement
- Tables
- Forms
- Drawers and dialogs
- Sticky elements
- Charts
- Motion
- Touch targets

Prevent accidental horizontal overflow.

Read: `standards/responsive-accessibility-performance.md`

---

# 17. Accessibility

Premium design includes accessibility.

Use:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Appropriate contrast
- Labels for form controls
- ARIA only when semantics are insufficient
- Alt text for meaningful images
- Accessible dialog and menu behavior
- Screen-reader-compatible status feedback
- Reduced-motion support

Do not remove focus outlines unless replacing them with an equally visible or better focus treatment.

---

# 18. Performance

Protect Core Web Vitals and interaction responsiveness.

Prefer animation with:

- `transform`
- `opacity`

Avoid unnecessary:

- Layout thrashing
- Large DOM trees
- Client-side JavaScript
- Heavy animation dependencies
- Huge media assets
- Unoptimized web fonts

Prefer:

- Responsive images
- AVIF / WebP where supported
- Lazy loading below the fold
- Code splitting
- Progressive loading
- Stable media aspect ratios

WebGL, Canvas, 3D and video backgrounds require graceful fallbacks.

Do not spend major performance budget on effects that add little product value.

---

# 19. Component Architecture

Prefer composable reusable components with controlled variants.

Common primitives include:

- Button
- IconButton
- Input
- Textarea
- Select / Combobox
- Checkbox / Radio / Switch
- Tabs
- Accordion
- Dropdown
- Tooltip
- Popover
- Dialog
- Drawer
- Toast
- Card when semantically appropriate
- Table / DataGrid
- Pagination
- Breadcrumb
- Navigation
- Sidebar
- PageHeader
- EmptyState
- ErrorState
- Skeleton
- CommandMenu

Do not duplicate the same pattern across pages with slightly different CSS.

---

# 20. Engineering Rules

Prefer:

- Semantic HTML
- CSS variables
- Design tokens
- Typed props
- Variant APIs
- Reusable layout primitives
- Modular components
- Clear state ownership
- Maintainable styling

Avoid:

- Magic numbers everywhere
- Giant monolithic components
- Repeated markup
- Repeated CSS
- Unnecessary inline styles
- Fragile absolute positioning
- Deep nesting without purpose
- One-off hacks that break responsive behavior

Before adding a dependency, determine whether the project already has a suitable solution.

---

# 21. Corporate Mode Summary

When CORPORATE mode is active:

Increase:

- Brand expression
- Trust architecture
- Editorial composition
- Typography scale
- Storytelling
- Signature visuals
- Whitespace
- Motion where appropriate

Prioritize clear communication of:

1. Who the company is
2. What it does
3. Why it matters
4. Why it can be trusted
5. What action the user should take

Use 1-3 recurring signature visual elements across the site.

Do not hide the business behind artistic ambiguity.

Full rules: `modes/corporate.md`

---

# 22. SaaS Mode Summary

For SaaS marketing:

Prioritize:

- Concrete value proposition
- Real product visuals
- Workflow understanding
- Use cases
- Integrations
- Social proof
- Security
- Pricing clarity
- Conversion

For authenticated SaaS product UI:

Prioritize:

- Task completion
- Clear navigation
- Fast workflows
- State feedback
- Onboarding
- Empty / loading / error states
- Search and discoverability

Marketing visual intensity must not leak blindly into productivity surfaces.

Full rules: `modes/saas.md`

---

# 23. Admin Mode Summary

For admin and enterprise operational tools:

Prioritize:

- Efficiency
- Scanability
- Information density
- Reliability
- Error prevention
- Permission clarity
- Table and form quality

Spend more design effort on:

- Data grids
- Filters
- Forms
- Bulk actions
- Workflow state
- Permissions
- Saved views
- Search

than on decorative dashboard visuals.

Full rules: `modes/admin.md`

---

# 24. Final Polish Pass

Never stop at "it works."

Check for:

- 1px alignment problems
- Inconsistent spacing
- Inconsistent radius
- Icon baseline issues
- Text wrapping
- Poor line lengths
- Weak CTA hierarchy
- Missing hover / focus states
- Button height inconsistencies
- Form spacing
- Table alignment
- Mobile spacing
- Header behavior
- Overflow
- Z-index problems
- Sticky-positioning issues
- Loading layout shift
- Unnecessary animation
- Broken reduced-motion behavior

---

# 25. Acceptance Standard

Do not consider the frontend complete until it satisfies all four dimensions.

## Visual

- Distinctive
- Premium
- Coherent
- Intentional

## UX

- Clear
- Fast
- Predictable
- Accessible

## Engineering

- Reusable
- Maintainable
- Responsive
- Performant

## Business / Product

- Clear value
- Clear hierarchy
- Clear trust or state
- Clear next action

---

# 26. Final Questions Before Shipping

Ask:

- What should the user understand first?
- What deserves the strongest visual emphasis?
- What can be removed?
- Is the next action obvious?
- Does the page have a recognizable identity?
- Does the interface still work when data is empty, loading or broken?
- Does mobile feel intentionally designed?
- Can keyboard users complete the workflow?
- Are motion and visual effects worth their performance cost?
- Could this design belong unchanged to any random company?

If the final answer to the last question is yes, strengthen the design direction.

The target result should feel intentionally art-directed, product-designed, engineered and polished by an experienced multidisciplinary digital team rather than generated from a generic UI template.
