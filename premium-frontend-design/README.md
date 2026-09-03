# Premium Frontend Design Skill

A production-grade frontend design and implementation skill for AI coding agents. It covers four product modes:

- **CORPORATE** — enterprise, brand and company websites
- **SAAS** — marketing sites and authenticated product UIs
- **ADMIN** — admin panels, CRM, ERP, CMS, internal tools (中后台)
- **GENERAL** — creative work where none of the above dominates

The entry point is `SKILL.md`. It is deliberately a router: it carries the decisions that must happen before any code is written, plus the rules that apply everywhere, and routes to the reference files for the depth. Those routes are mandatory reading gates, and they fire **as each decision arrives**, not all at once.

## What changed in 2.0

Version 3 taught the agent to avoid the first generation of generated-UI tells — purple gradients, glass cards, pill buttons. Version 4 is built on the observation that **the escape route became the next template**: cream + serif + terracotta, black + one acid accent, hairline broadsheet rules, tracked ALL-CAPS eyebrows, middle-dot meta strings, `→` glued to every label. Version 3's own Editorial preset and hero example sat squarely inside that cluster. Both are retuned, `standards/anti-patterns.md` §2 names the cluster, and the direction phase now includes a review step that asks *"would I have produced this for any brief in this category?"* before code exists.

The other half of 2.0 is the engineering that separates a design that demos from a product that ships:

| New | What it covers |
|---|---|
| `standards/forms.md` | Layout, validation timing, a11y contract, input attributes, **IME composition** for CJK input, autosave vs unsaved-changes |
| `standards/overlays-navigation.md` | Dialog / drawer / popover / menu / tooltip / toast / tabs / command palette / header / sidebar / breadcrumb contracts |
| `standards/data-visualization.md` | Chart selection by question, KPI anatomy, series color roles, chart states, table fallback, dashboard composition |
| `standards/app-shell.md` + `assets/app-shell-baseline.css` | The scroll model, `min-height: 0`, `100dvh`, sticky, safe areas, iOS input zoom, scroll lock, print |
| `standards/stack-adapters.md` | Tailwind v4 / v3, shadcn, **Ant Design, Element Plus, Arco, Naive**, MUI, Vuetify — where their tokens live and how to map the schema onto them with one source of truth |
| `standards/media-seo.md` | Responsive images, LCP hero, fonts, the critical path, metadata / OG / hreflang / structured data, document outline, what to measure |
| `examples/before-after-admin.md` | A Chinese 中后台 order list, before and after, with every CJK and data-grid decision annotated |
| `scripts/lint-design.mjs` | Zero-dependency static scan for the mechanical defects the standards name |
| `scripts/verify-browser.mjs` | Playwright: screenshots × widths × themes, overflow, console, heading outline, focus walk, LCP/CLS, axe |

Plus: `--chart-*` roles in the schema, AA-verified brand colors in all three presets (two previously failed under white button text), a direction card template, Chinese banned-vocabulary and 你/您 rules, and a polish pass that ends with "remove one thing".

## Package structure

```text
premium-frontend-design/
├── SKILL.md                  # Router: scope, tiers, mode classification, hard rules, gates
├── README.md
├── agents/
│   └── openai.yaml           # OpenAI/Codex packaging metadata
├── assets/
│   ├── tokens.schema.css     # Token ROLES and rules — structure, not values
│   ├── token-presets.css     # Three incompatible starting points (Editorial / Technical / Soft)
│   ├── a11y-baseline.css     # Focus, reduced motion, skip link, forced colors, CJK — copy verbatim
│   └── app-shell-baseline.css# Scroll model, dvh, safe areas, dialog, toast, print — copy verbatim
├── modes/
│   ├── corporate.md · saas.md · admin.md · general.md
├── standards/
│   ├── anti-patterns.md      # Both generations of tells; where a signature comes from; the tests
│   ├── design-system.md
│   ├── stack-adapters.md     # Tailwind, shadcn, AntD, Element Plus, Arco, Naive, MUI, Vuetify
│   ├── layout-typography.md
│   ├── cjk-typography.md
│   ├── motion-interaction.md
│   ├── responsive-accessibility-performance.md
│   ├── theming-dark-mode.md
│   ├── content-copy.md
│   ├── data-grid.md          # Contract, framework-neutral
│   ├── forms.md              # Contract, incl. IME
│   ├── overlays-navigation.md# Contract
│   ├── data-visualization.md # Contract
│   ├── app-shell.md          # Engineering
│   └── media-seo.md          # Public-page engineering
├── workflow/
│   ├── design-process.md     # Execution order for T3/T4
│   ├── design-review.md      # Final checklist; [V] items need browser evidence
│   └── browser-verification.md
├── scripts/
│   ├── lint-design.mjs       # node scripts/lint-design.mjs src --cjk
│   └── verify-browser.mjs    # node scripts/verify-browser.mjs http://localhost:3000 --axe
├── templates/
│   └── artifacts.md          # Direction card (required T3/T4) + optional brief / plan / report
└── examples/
    ├── before-after-hero.md  # Generic → art-directed → and the second trap
    └── before-after-admin.md # 中后台 order list, Chinese
```

## The assets are structure, not style

**`tokens.schema.css` ships almost no values.** A token file with a working palette gets copied verbatim, and every project built from it ends up with the same ramp, the same radius and the same transition — the template relocated one level up.

| File | Copy verbatim? |
|---|---|
| `tokens.schema.css` | The **structure** yes — two-layer split, role names, density multiplier, z-index scale, chart slots, dark-mode override pattern. The **values** no; every `TODO` is derived from the project's brand. |
| `token-presets.css` | No. Three deliberately incompatible starting points. Pick one, then diverge. None of them is the cream-and-terracotta cluster, and none of them is your brand either. |
| `a11y-baseline.css` | **Yes.** Correctness, not opinion. |
| `app-shell-baseline.css` | **Yes** for product shells; §1, §5, §6 for marketing pages. |

When the project already has a component library, none of the token files are copied — `standards/stack-adapters.md` maps the roles onto the library's own tokens instead.

## The scripts

Both are optional and neither replaces looking at the result.

```bash
# Static smells. Zero dependencies. --cjk raises the type floors to the CJK values.
node scripts/lint-design.mjs src --cjk

# Render and collect evidence. Needs Playwright with Chromium.
npm i -D playwright axe-core && npx playwright install chromium
node scripts/verify-browser.mjs http://localhost:3000/ --out=verify-out --axe
```

`verify-browser.mjs` writes `report.md` with what it found and, as importantly, what it did not check — the design's quality, the non-happy states, screen readers, real devices. Those still need a person, or the agent, to look.

## How to use

### As an agent skill

Copy the whole folder into your agent's skill directory. Keep the relative structure intact — `SKILL.md` routes to the other files by path.

### As a project rule

If your agent does not support modular skills, use `SKILL.md` as the primary rule file and the rest as deep references.

### Per-task override

```text
Use premium-frontend-design in ADMIN mode. Stack is Vue 3 + Element Plus; the product is zh-CN only.
```

```text
Use premium-frontend-design. The public site is SAAS Marketing; the authenticated
workspace is SAAS Product; the org console is ADMIN. Design system is shadcn — extend it.
```

## Design policy

- Existing icon system first, Lucide second; never emoji as UI iconography
- Semantic design tokens before component styling — with values derived, not inherited
- One source of truth per value; a component library's tokens are that source when it has one
- Structure and information architecture before decorative polish
- Every component ships its loading, empty, error and permission states, and meets its written contract
- Responsive, accessibility, i18n and performance are design quality, not a later pass
- CJK typography is set from the script; CJK input is designed for the IME
- Visual experimentation belongs on selected marketing surfaces, not in dense workflows
- Boldness is spent in one place; the last step is removing one thing
- The specificity test is asked against both generations of generated-UI tells
- Verify in a real browser, or report the work as unverified

## Scope tiers

| Tier | Trigger | Workflow |
|---|---|---|
| T1 | One property or one obvious defect | Fix without introducing a new default; spot-check |
| T2 | One component or section | Mode check → design-system alignment → contract → states → responsive → a11y → verify |
| T3 | A page or view | Full workflow, page-scoped, direction card required |
| T4 | Multi-page site or design system | Full workflow including direction, tokens and stack adapter |

## Author

**pearno** · MIT licensed

The version lives in one place — `metadata.version` in the `SKILL.md` frontmatter.
