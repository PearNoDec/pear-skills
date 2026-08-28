# Admin / Enterprise Operations Mode

## Mission

Admin products are working environments.

Optimize for:

**Efficiency -> clarity -> information density -> reliability -> error prevention -> consistency.**

Visual sophistication should come from hierarchy, spacing, typography, state design and interaction quality rather than decorative spectacle.

## Application shell

Typical structure may include:

- Sidebar
- Topbar
- Breadcrumb
- Page header
- Context actions
- Filter / search area
- Main workspace
- Secondary panel
- Drawer
- Dialog
- Toast / notification layer

Use conventional patterns when they increase speed and predictability.

## Sidebar

Support when relevant:

- Grouped navigation
- Active state
- Nested navigation
- Collapsed mode
- Workspace or tenant context
- Permission-aware items
- Compact mode

Avoid icon-only navigation for complex products unless labels remain easily discoverable.

## Page header

A page header should answer:

- Where am I?
- What does this page represent?
- What is the relevant state?
- What is the primary action?

Possible elements:

- Breadcrumb
- Title
- Description
- Status
- Primary action
- Secondary actions
- Context menu

## Information density

Do not force consumer-app whitespace onto professional enterprise tools.

Possible density modes:

- Comfortable
- Default
- Compact

Dense CRM, ERP, BI and operations products may benefit from user-selectable density.

## Table / Data Grid

Treat the data grid as a first-class component.

Consider:

- Sort
- Filter
- Search
- Resize
- Pin
- Hide
- Reorder
- Select
- Select all
- Bulk action
- Inline edit
- Row action
- Pagination
- Infinite loading
- Virtualization
- Export
- Saved views
- Loading
- Empty
- Error
- Permission

Do not convert structured data into cards merely because cards appear more modern.

## Filters

Professional filtering may require:

- Quick filters
- Advanced filters
- Multi-condition rules
- Saved views
- Date range
- Status
- Owner
- Tag
- Search
- Active-filter count
- Clear all

Current filter state should always be understandable.

## Forms

Complex forms require information architecture.

Support:

- Labels
- Supporting descriptions
- Required state
- Validation
- Error state
- Success state
- Disabled state
- Dependent fields
- Autosave where safe
- Unsaved-change warnings
- Grouped sections

Long forms may use:

- Sections
- Tabs
- Accordion
- Stepper
- Side navigation

Avoid an endless unstructured column of fields.

## Bulk actions

Design bulk workflows explicitly.

Examples:

- Select all
- Bulk edit
- Bulk assign
- Bulk export
- Bulk status change
- Bulk archive
- Bulk delete

Destructive operations should clearly communicate scope and require appropriate confirmation.

## Permission states

Design for:

- Read-only
- No access
- Partial access
- Role restrictions
- Feature restrictions

Do not rely solely on backend errors to explain permission problems.

## Dashboard

An operations dashboard should emphasize:

- Critical KPI
- Anomalies
- Risks
- Work requiring attention
- Trends
- Actionable queues

A widget should answer a business question rather than merely occupy grid space.

## Color

Use color primarily for:

- Brand recognition
- Hierarchy
- Status
- Risk
- Selection

Keep semantic status colors consistent:

- Success
- Warning
- Error
- Info

Do not turn the application into a rainbow of competing states.

## Motion

Routine transitions should generally be fast and restrained.

Use for:

- Dropdowns
- Drawers
- Dialogs
- Toasts
- Tabs
- Row expansion
- Navigation

Avoid large scroll animation, WebGL, cinematic transitions or heavy parallax in normal operations workflows.

## Professional efficiency tools

Consider when appropriate:

- Keyboard shortcuts
- Command palette
- Quick search
- Saved views
- Recent items
- Favorites
- Bulk actions
- Inline edit
- Context menus

These often create more product value than decorative visuals.

## Responsive strategy

Determine whether the product is:

- Fully mobile capable
- Tablet optimized
- Mobile limited to critical tasks
- Desktop first

For tables on small screens, consider:

- Horizontal scrolling
- Priority columns
- Responsive detail rows
- Detail drawer
- Alternate task-specific mobile layout

Do not squeeze every desktop column into a phone viewport.

## Avoid

- Awwwards-style experimental navigation in critical workflows
- Heavy gradients
- WebGL dashboards
- Excessive whitespace
- All-card layouts
- Giant headings inside workspaces
- Hidden important actions
- High-motion UI
- Weak destructive-action safeguards
- Missing loading / empty / error states
