# Premium Frontend Design Skill

A reusable frontend design and implementation skill for AI coding agents.

It supports four primary modes:

- Corporate / enterprise websites
- SaaS marketing and product surfaces
- Admin / enterprise operations systems
- General / creative frontend work

The main entry point is `SKILL.md`.

## Recommended package structure

```text
premium-frontend-design-skill/
├── SKILL.md
├── README.md
├── VERSION
├── manifest.txt
├── modes/
│   ├── corporate.md
│   ├── saas.md
│   ├── admin.md
│   └── general.md
├── standards/
│   ├── design-system.md
│   ├── layout-typography.md
│   ├── motion-interaction.md
│   ├── responsive-accessibility-performance.md
│   └── anti-patterns.md
├── workflow/
│   ├── design-process.md
│   └── design-review.md
├── templates/
│   ├── project-brief.md
│   ├── implementation-plan.md
│   └── design-review-report.md
└── examples/
    ├── corporate-example.md
    ├── saas-example.md
    └── admin-example.md
```

## How to use

### As an agent skill

Install or copy the full folder into the skill/rules location supported by your coding agent. Keep the relative directory structure intact so `SKILL.md` can reference specialist files.

### As a project rule

If the agent does not support modular skills, use `SKILL.md` as the primary rule. The supporting files are expanded references for deeper work.

### Per-task override

When necessary, explicitly tell the agent which mode to use:

```text
Use premium-frontend-design in CORPORATE mode.
```

or:

```text
Use premium-frontend-design. The public site is SAAS Marketing; the authenticated workspace is SAAS Product; the organization console is ADMIN.
```

## Design policy highlights

- Lucide Icons by default
- No emoji as UI iconography
- Avoid generic AI-template styling
- Respect existing application architecture
- Structure and UX before decorative polish
- Responsive, accessibility and performance are part of design quality
- Strong visual experimentation is appropriate on selected marketing surfaces, not every application surface

## Author

**pearno**

## Version

See `VERSION`.
