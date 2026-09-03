# SaaS Mode

A SaaS system contains two different design surfaces: the **marketing surface** and the **authenticated product surface**. They share a brand system. They must not share visual intensity.

---

# SaaS Marketing Surface

**Priority: value clarity → product understanding → proof → activation → conversion.**

## Section selection

A visitor needs to learn: what the product does, who it is for, what problem it solves, how the workflow works, why it is different, what outcome it creates, and how to start. Assign each to a section; drop sections that answer nothing.

Candidates — header, hero, product preview, social proof, problem framing, solution, core workflow, feature stories, integrations, use cases, metrics, testimonials, security, pricing, FAQ, final CTA, footer — but including all seventeen because a template expects them is exactly the failure mode. Most strong SaaS pages run **seven to ten**.

## Product-first storytelling

The real product should usually be one of the primary visual assets: real UI, real workflows, real states, real outputs, interactive demonstrations, annotated flows. Do not hide the product behind abstract illustrations.

If the product is not ready to show, show a real *output* — a document, a result, a report — rather than a fabricated dashboard mockup.

## Feature communication

The user should understand *how* a feature works, not merely that it exists. That rules out the repeated three-card grid, because a card can only assert.

Pick the form from the content's shape: a sticky product showcase for a single deep capability, a tabbed demo for parallel ones, a step-by-step workflow for a sequence, alternating editorial sections for a narrative, before/after for a transformation. **A comparison, a sequence and a list are three different shapes; giving them all a three-column grid erases the difference.**

## Pricing

Pricing exists to reduce decision friction. It needs explicit limits, a recommended plan, a comparison a buyer can actually decide from, and an enterprise path if one exists. A monthly/annual toggle and an FAQ placed at the point of friction both help.

Do not obscure real pricing for decorative reasons unless the business model genuinely requires a sales conversation.

---

# SaaS Authenticated Product Surface

**Priority: task success → speed → clarity → consistency → discoverability.**

Marketing-surface effects come down hard here. Set `[data-surface="admin"]`-style motion overrides from the token layer rather than removing animations one at a time.

## Navigation

Choose from top nav, sidebar, hybrid, workspace switcher and command palette — based on **product complexity, not fashion**. The decision that matters is hierarchy: workspace, project, modules, notifications, search, help, settings, account. Flattening every feature into one navigation level is the failure; so is nesting three levels deep when there are nine destinations.

## Onboarding

Design first-use deliberately: a setup wizard, a checklist, sample data, a product tour, contextual hints, progressive disclosure, template selection, or a guided first task.

The rule: **an empty dashboard with no direction is a failed first run.** The first session is the single best onboarding moment the product will ever get, and an empty state that says "No data" wastes it.

## Dashboard and data visualization

A dashboard prioritizes important KPIs, trends, anomalies, action items and next best actions. Do not fill space with charts to look analytical.

**Every chart answers a question** — what happened, is this improving, what is abnormal, which segment is responsible, what should I do now. A chart nobody acts on should be removed.

Chart selection, KPI anatomy, series color roles, chart states and the table fallback are in `standards/data-visualization.md`. The short version: series colors are semantic roles tuned per theme, status hues keep their meaning, no series is color-alone, and a chart palette tuned on white is the most common thing to break in dark mode.

## Tables

Tables are usually more important than cards in a serious SaaS product. The full state matrix, accessibility contract and small-screen strategy are in `standards/data-grid.md` — read it rather than re-deriving the feature list.

## Shell, overlays, forms

The application shell (`standards/app-shell.md`), the dialog / drawer / toast / command-palette contracts (`standards/overlays-navigation.md`) and the form contract (`standards/forms.md`) apply to the product surface in full. The command palette is usually the single most valuable feature to add to a SaaS product that lacks one.

## Motion and states

Routine component feedback lands around 100–250ms. Use motion for menus, popovers, dialogs, drawers, navigation state, success feedback, loading and row expansion. Never make a productivity workflow wait for an animation.

The required states for an application surface are in `SKILL.md` §7.4. Product-specific additions worth designing here: partial error, offline, upgrade-required, processing, and archived/draft where the domain has them.

## Worked example

> **Brief:** "Build an AI meeting assistant website and dashboard."
>
> **Mode:** hybrid — public site SAAS Marketing, authenticated app SAAS Product.
> **Marketing direction:** show the actual transformation — meeting → transcript → structured decisions → assigned tasks → searchable knowledge. That pipeline is the product's own data structure, so it becomes the hero and the recurring signature, instead of a decorative AI orb.
> **Product IA:** Meetings · Search · Tasks · Shared knowledge · Workspace settings.
> **Dashboard:** recent meetings, unresolved actions, searchable knowledge — not decorative analytics.
> **Motion:** marketing medium, product low.
> **States that must exist:** first meeting not yet recorded, transcript processing, transcription failed, empty search, no workspace permission.
