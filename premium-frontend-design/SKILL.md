---
name: premium-frontend-design
description: Production-grade frontend design and implementation for corporate websites, SaaS marketing sites and product UIs, dashboards, and admin/CRM/ERP/CMS internal tools (企业官网 / 落地页 / SaaS / 中后台 / 管理系统 / 数据看板 / 组件库). Use this skill whenever the user wants to design, redesign, build, restyle, polish, audit or review any web UI — a page, a component, a form, a table, a chart, a dashboard, a design system, or "make it look better / 美化 / 优化界面" — in React, Vue, Next.js, Nuxt, Tailwind, shadcn/ui, Ant Design, Element Plus or plain HTML/CSS, even if they do not say "design". Classifies the surface into CORPORATE / SAAS / ADMIN / GENERAL mode, matches effort to a tier from one-line fix to full design system, derives tokens from the brand instead of shipping defaults, applies component contracts for grids, forms, overlays, charts and the app shell, handles CJK typography and IME input, and verifies in a real browser with bundled scripts. Not for backend/API work or copy with no layout change.
license: MIT
metadata:
  author: pearno
  version: "2.0.0"
---

# Premium Frontend Design

Treat frontend work as the coordinated design and engineering of a complete digital product, not as decoration applied to markup.

The quality target is a production-ready product with the intentionality of a strong brand studio, a senior product-design team and a senior frontend team working together — the kind of studio a client hires because its work is never mistaken for anyone else's.

This file is the router. It carries the decisions that must happen before any code is written and the rules that apply everywhere. The depth lives in the reference files, and **those files are not optional** — see section 2.

---

## 1. Scope and tier

**Stand down for:** backend/API/infra work with no visual surface · pure copywriting with no layout change · a JS bug with no design dimension · refactoring with no user-visible outcome.

Everything else with a visual surface is in scope — including the one-property fix. Match effort to tier, then run only that tier's workflow. Applying an eleven-phase process to a two-line change wastes the user's time; applying a two-line fix to a page that needs a direction wastes the product.

| Tier | Trigger | Workflow |
|---|---|---|
| **T1 Quick fix** | One property, one element, one obvious defect | Fix it. Do not introduce a new default while you are there (a raw hex, a raw z-index). Spot-check in the browser |
| **T2 Component** | One component or one section | Mode check → design-system alignment → the component's contract (§7.4) → all states → responsive → a11y → verify |
| **T3 Page** | A full page or view | Full workflow, scoped to that page, direction card included |
| **T4 System** | Multi-page site, application shell, or design-system work | Full workflow including direction, tokens and stack adapter |

When in doubt between two tiers, ask the user rather than silently escalating.

---

## 2. Mandatory reading gates

Do not write code for a T2 or higher task until the matching files are read. Read them; do not rely on the summaries in this file.

| Situation | Read before writing code |
|---|---|
| CORPORATE mode | `modes/corporate.md` |
| SAAS mode (either surface) | `modes/saas.md` |
| ADMIN mode | `modes/admin.md` |
| GENERAL / creative mode | `modes/general.md` |
| **Any T2+ task** | `standards/anti-patterns.md` — both generations of tells, and where a signature comes from |
| Any token, color, type-scale or component-variant decision | `standards/design-system.md` + `assets/tokens.schema.css` |
| **The project has Tailwind, shadcn, Ant Design, Element Plus, Arco, Naive, MUI or Vuetify** | `standards/stack-adapters.md` |
| Any layout, grid, rhythm or typography decision | `standards/layout-typography.md` |
| **The product ships Chinese, Japanese or Korean** | `standards/cjk-typography.md` |
| Any animation or interaction decision | `standards/motion-interaction.md` |
| Any responsive, accessibility, performance or i18n decision | `standards/responsive-accessibility-performance.md` |
| Light/dark theming or surface elevation | `standards/theming-dark-mode.md` |
| Writing any user-facing text | `standards/content-copy.md` |
| Any table, data grid or list of records | `standards/data-grid.md` |
| Any form, input, search box or inline edit | `standards/forms.md` |
| Any dialog, drawer, menu, tooltip, toast, tabs, command palette, header, sidebar | `standards/overlays-navigation.md` |
| Any chart, KPI or dashboard | `standards/data-visualization.md` |
| An authenticated product shell — sidebar, header, scrolling content | `standards/app-shell.md` + `assets/app-shell-baseline.css` |
| A public page — images, fonts, metadata, SEO, LCP | `standards/media-seo.md` |
| Reviewing, auditing or before declaring done | `workflow/design-review.md` |
| T3 / T4 execution order | `workflow/design-process.md` |
| Verifying the result | `workflow/browser-verification.md` + `scripts/` |
| Unsure what "not generic" looks like in code | `examples/before-after-hero.md` (marketing) · `examples/before-after-admin.md` (中后台, Chinese) |

**Read them as the decision arrives, not all at once.** The mode file and `standards/anti-patterns.md` come first because they shape everything after. The rest load when you reach the decision they govern.

`assets/` holds the token schema, three deliberately incompatible presets, the accessibility baseline and the app-shell baseline. Read §7.1 before using any of them. `templates/artifacts.md` has the direction card (required for T3/T4) and three optional formats.

---

## 3. Operate as a multidisciplinary team

Act simultaneously as Creative Director, Product Designer, UX Architect, Design System Designer, Senior Frontend Engineer, Accessibility Specialist and Performance Engineer. Do not optimize one discipline while ignoring the others:

- A visually impressive page with confusing UX is a failed design.
- A usable page with generic template aesthetics is unfinished.
- A polished interface that is fragile, inaccessible or slow is not production quality.
- A beautiful component that fights the host codebase is a liability.

---

## 4. Classify the product mode

Answer three questions before choosing a visual language.

1. **Is the user authenticated?** No → marketing surface. Yes → product surface.
2. **What is the primary job?** Persuade and convert → marketing. Complete a task → product. Operate a system at volume → operations.
3. **What is the information density?** Editorial and sparse → expressive. Moderate → balanced. Dense tabular data → efficient.

Then select:

| Mode | Use for | Priority order |
|---|---|---|
| **A · CORPORATE** | Enterprise, brand, company and agency websites | Brand → Trust → Story → Differentiation → Conversion |
| **B · SAAS** (marketing) | SaaS/AI/B2B/devtool marketing sites, landing pages | Value clarity → Product understanding → Trust → Activation → Conversion |
| **B · SAAS** (product) | Authenticated SaaS application UI | Task success → Clarity → Speed → Consistency → Discoverability |
| **C · ADMIN** | Admin, CMS, ERP, CRM, internal tools, operations consoles, 中后台 | Efficiency → Clarity → Density → Reliability → Error prevention → Consistency |
| **D · GENERAL** | Nothing above clearly dominates | Identity → UX → Hierarchy → Interaction → Engineering |

Tie-breaks: a marketing site for an operations product → **SAAS marketing**. An authenticated dashboard whose job is monitoring, not operating → **SAAS product**. Anything where a mistake destroys or exposes real data → **ADMIN**, regardless of how it looks.

State the selected mode explicitly before designing. If the user disagrees, their call wins.

**If the brief does not say what the product is or who it is for, decide, say it, and confirm.** Distinctive work comes from the subject — its industry, its materials, its vocabulary. A design made without a subject is a template by definition.

---

## 5. Hybrid products

Real products need multiple modes. A SaaS company typically has all three:

| Surface | Mode |
|---|---|
| Public homepage | CORPORATE + SAAS marketing |
| Authenticated workspace | SAAS product |
| Organization settings, billing, admin console | ADMIN |
| Documentation | GENERAL + product |
| Investor / careers / company pages | CORPORATE |

Keep shared brand tokens across all surfaces. Change information density, motion intensity, layout conventions, decorative complexity, navigation patterns and component ergonomics. Never let marketing visual intensity leak into a dense workflow.

---

## 6. Protect the existing product

Before redesigning anything that exists, inspect the codebase rather than assuming: framework, build system, routing, styling approach, component library, design tokens, state management, business logic, API boundaries, auth and permissions, dependencies. `standards/stack-adapters.md` § detect lists what to read and in what order. **State what you found before proposing anything.**

Do not — without a reason the user has accepted — replace the framework, build system or state management; rewrite working business logic; change API contracts; add a large dependency; remove features; or break analytics, forms, SEO, routing or existing accessibility work.

**When the project already has a design system, that system wins.** A component library *is* a design system: shadcn, Ant Design, Element Plus, Arco, Naive, MUI, Vuetify all keep their tokens somewhere, and the roles in `assets/tokens.schema.css` map onto them in one file — never as a parallel layer. Extend, adopt, match. A skill that fights the host codebase produces a worse result than one that yields to it.

---

## 7. Non-negotiable rules

These apply in every mode and every tier.

### 7.1 Design system before components — and derive its values

Never style components one at a time. Establish or adopt a shared system for color, typography, spacing, radius, borders, elevation, motion, breakpoints, component states and density first. Components read semantic roles; they never see a raw value.

Start from `assets/tokens.schema.css` unless the project already has a token layer. **The schema is structure, not style.** Copy the two-layer split, the role names, the density multiplier and the z-index scale verbatim; derive every `TODO` from *this* brand, and say in your reply what you chose and why. `assets/token-presets.css` offers three incompatible starting points — take one and diverge. A preset shipped unchanged is the same failure as a default shipped unchanged, one level up.

### 7.2 Icons — priority order

1. **The project's existing icon system**, if it is coherent and deliberate. Never add a second icon library.
2. **Lucide Icons**, when the project has no icon system and the stack supports it.
3. Any other library only when 1 and 2 are impossible.

In all cases: no emoji as UI iconography, no Unicode symbols as icon substitutes, no mixed libraries; consistent size, stroke width, baseline and optical weight; `aria-hidden` on decorative icons and a label on icon-only controls.

### 7.3 The specificity test — against both generations

Ask: *"Could I replace the company name and use this exact page for any other company?"* Then ask the harder one: *"Would I have produced roughly this for a different brief in the same category?"*

The second question catches what the first misses. Generated work that has learned to avoid the purple gradient converges on a second cluster — cream + serif + terracotta, black + one acid accent, hairline broadsheet rules, the SaaS card kit, tracked ALL-CAPS eyebrows, middle-dot meta strings, `→` glued to labels — and that cluster now reads as generated just as reliably. Both lists, with replacements and the five moves that produce a signature a competitor could not reuse, are in `standards/anti-patterns.md`. Read it before any T2+ work, and spend your boldness in exactly one place.

### 7.4 Every component has a contract

Nothing meaningful ships as the happy path only. Every component needs: default, hover, focus, active, selected, disabled, loading, empty, success, error. Applications add: first-run, no-results, offline, processing, permission-restricted, unsaved-changes. `empty` and `no-results` are different states with different actions.

Beyond states, the core components have written contracts that the design is measured against: data grid (`standards/data-grid.md`), forms (`standards/forms.md`), overlays and navigation (`standards/overlays-navigation.md`), charts (`standards/data-visualization.md`), the shell (`standards/app-shell.md`). An interface that breaks when data is empty, slow, missing, typed through an IME, or reached by keyboard is not done.

### 7.5 Accessibility floor

Semantic HTML, keyboard operability, visible focus, sufficient contrast, labeled controls, ARIA only where native semantics fall short, meaningful alt text, accessible dialogs and menus, `prefers-reduced-motion` support, pinch-zoom never disabled.

Never remove a focus outline without replacing it with something equally visible. Never communicate state through color alone. `assets/a11y-baseline.css` is this floor as working CSS and is meant to be copied close to verbatim.

### 7.6 Performance budget

Animate `transform` and `opacity`. Protect LCP, CLS and INP. Every image has dimensions; the hero is never lazy. WebGL, Canvas, 3D and video backgrounds require a graceful fallback. Do not spend a large performance budget on an effect with small product value.

For a CJK product, the largest item in the budget is almost always an unsubsetted Chinese webfont — 3 to 10 MB. Prefer the system stack or subset by `unicode-range`.

### 7.7 Write real copy

No lorem ipsum, no invented statistics, no "Empower your workflow with AI", no 赋能 / 一站式 / 全方位. Placeholder copy is the fastest tell that an interface was generated. Never invent a customer, logo, testimonial, certification or metric — mark the slot and say so. One name per action through the whole flow. See `standards/content-copy.md`.

### 7.8 Say what is unverified

Never describe a property as working that was not rendered and looked at. Never describe a preset value as "the brand color" or a placeholder as "final". The report at the end of the work lists what was verified, how, and what was not.

---

## 8. Workflow

Four phases, in order. The step-level detail is in `workflow/design-process.md` — follow it for T3 and T4.

1. **Understand** — product, users, business goal; classify the mode and state it; inspect the existing code and name the stack.
2. **Direct** — audit and rank problems by impact; write the direction card (`templates/artifacts.md` §0); **review it against the brief** and revise any line you would have written for any brief in the category; define tokens and information architecture.
3. **Build** — structure and semantics, then layout, then components against their contracts, then all states, then motion, then polish. Run `scripts/lint-design.mjs` after components and after polish.
4. **Verify** — §9, then `workflow/design-review.md`, then remove one thing.

The ordering constraint that matters most: **never begin decorative work while the information architecture is still weak.** Most frontend redesigns fail here, not in the visuals.

---

## 9. Verify in a real browser

A checklist the model ticks for itself is not evidence.

Two scripts ship with the skill. Neither replaces looking:

- `node scripts/lint-design.mjs <paths> [--cjk]` — static scan for raw colors, raw z-index, removed focus outlines, tiny type, `transition: all`, `100vh`, placeholder and banned copy, emoji icons, missing `alt`, unlabeled inputs, `Enter` handlers with no IME guard, template chrome. Zero dependencies.
- `node scripts/verify-browser.mjs <url> [--axe]` — Playwright: screenshots at 375/768/1440/1920 in both themes, horizontal-overflow report, console and failed requests, heading outline, unlabeled controls, a Tab walk that flags invisible focus, lab LCP/CLS, axe violations. Writes `report.md` with what it checked **and what it did not**.

When browser tooling is available — the script, Chrome DevTools MCP, Playwright MCP, or a dev server — **render the result and look at it before claiming it works.** At minimum: console clean, screenshots at four widths, no horizontal overflow, keyboard path walked, both themes checked, and the empty/loading/error states forced into view rather than assumed.

If no browser tooling is available, say so and label the work **unverified**.

---

## 10. Acceptance gate

Do not report the work as complete until all four hold.

| Dimension | Requirement |
|---|---|
| **Visual** | Distinctive, premium, coherent, intentional — and not the category default of either generation |
| **UX** | Clear, fast, predictable, accessible; every component meets its contract |
| **Engineering** | Reusable, maintainable, responsive, performant; one source of truth per value; fits the host stack |
| **Product** | Clear value, clear hierarchy, clear state, clear next action |

Then run `workflow/design-review.md`. The four questions that catch the most:

- Would this design belong unchanged to any competitor, or to any brief in this category? → strengthen the direction.
- Does it still work when data is empty, loading, broken, or typed in Chinese? → finish the states.
- Can a keyboard user complete the primary workflow? → fix it before shipping.
- Is there one thing that could be removed? → remove it.

The target result should feel art-directed, product-designed, engineered and polished by an experienced multidisciplinary team — not generated from a template, and not generated from the anti-template either.
