# Stack Adapters

`SKILL.md` §6 says the host codebase's design system wins, and §7.1 says every component reads semantic roles. This file is how those two rules meet the stacks that actually ship: what to detect, where the library keeps its tokens, and how to map the roles in `assets/tokens.schema.css` onto it **once**, in one file, so the library's components and your own components move together.

The principle in every section: **there is exactly one source of truth for a color, and it is wherever the library already reads it.** A second token layer next to a component library is the most common way an integration produces two blues.

## Detect before deciding

Read, in this order: `package.json` dependencies · the CSS entry file (`globals.css`, `app.css`, `main.scss`) · the framework config (`tailwind.config.*`, `vite.config.*`, `nuxt.config.*`, `next.config.*`) · `components/ui/` or `src/components/` for a generated component set · a `ConfigProvider` / `ThemeProvider` / `createTheme` call near the app root. Then state what you found before proposing anything.

| Signal | Stack |
|---|---|
| `tailwindcss` ^4 + `@import "tailwindcss"` + `@theme` | Tailwind v4 |
| `tailwind.config.js` with `theme.extend` | Tailwind v3 |
| `components/ui/button.tsx` + `class-variance-authority` + `--background` / `--foreground` in CSS | shadcn/ui |
| `antd` + `<ConfigProvider theme=…>` | Ant Design v5 |
| `element-plus` + `--el-color-primary` or `el-config-provider` | Element Plus |
| `@arco-design/web-react` / `web-vue` + `arco-theme` | Arco Design |
| `naive-ui` + `themeOverrides` | Naive UI |
| `@mui/material` + `createTheme` | MUI |
| `vuetify` + `createVuetify` | Vuetify |
| None of the above; CSS Modules, vanilla-extract, UnoCSS, plain CSS | Adopt the schema directly |

## Tailwind v4

Tokens live in CSS. `@theme` declares them **and** generates the utilities; there is no config file.

```css
@import "tailwindcss";

/* 1. Primitives and semantic roles exactly as in tokens.schema.css. */
:root { --neutral-0: …; --brand-500: …; --background: var(--neutral-0); … }
:root[data-theme="dark"] { … }

/* 2. Expose roles to Tailwind. `inline` makes utilities read the *current*
      value of the variable, so dark mode and density work without extra classes. */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-muted-foreground: var(--muted-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-success: var(--success);

  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --ease-out: var(--ease-out);
  --animate-fade-in: fade-in var(--duration-normal) var(--ease-out);
}

/* 3. Dark mode keyed on the attribute the theme script sets. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

Then `bg-background text-foreground border-border rounded-md` work, and `bg-[var(--surface)]` is never needed. Breakpoints: `--breakpoint-md: 48rem` in `@theme` (not `inline`; media queries need static values). Spacing: leave Tailwind's `--spacing` base alone and derive the scale from it, or replace it with the schema's scale — not both.

**Traps.** `@theme` without `inline` snapshots the value at build time, so `--color-primary: var(--primary)` inside a plain `@theme` produces a utility that does not respond to `[data-theme]`. `theme()` function calls and `tailwind.config.js` are v3 idioms; do not add them. `@apply` inside component CSS is fine but defeats tree-shaking if used for whole component styles — prefer the variant pattern in `standards/design-system.md`.

## Tailwind v3

Mirror the roles into `theme.extend` as `rgb(var(--x) / <alpha-value>)` if the primitives are stored as channel triplets, or as `var(--x)` if opacity utilities are not needed on them. Dark mode `darkMode: ['selector', '[data-theme="dark"]']`. Breakpoints in `theme.screens`. Nothing else changes.

## shadcn/ui

shadcn's CSS variables **are** the semantic layer, and its names overlap the schema on purpose: `--background`, `--foreground`, `--muted-foreground`, `--primary`, `--primary-foreground`, `--destructive`, `--border`, `--ring` are identical. Do not rename them and do not add a parallel set.

| Schema role | shadcn variable |
|---|---|
| `--surface` | `--card` |
| `--surface-elevated` | `--popover` |
| `--surface-secondary` | `--muted` |
| `--surface-hover` / `--surface-active` | `--accent` |
| `--border-strong` | `--input` |
| `--primary-subtle` | *(add)* |
| `--success`, `--warning`, `--info` (+ `-subtle`, `-foreground`) | *(add — shadcn ships only `destructive`)* |
| `--chart-1…5` | already present — tune per theme |
| `--sidebar-*` | already present |

Work in `globals.css`: retune the `:root` / `.dark` blocks (shadcn generates them in `oklch`; keep that), add the missing roles beside them, and register additions in the same `@theme inline` block shadcn already has. Radius: shadcn derives `--radius-sm/md/lg/xl` from one `--radius` — set that one value from the direction, not four.

Components: extend via `cva` variants in `components/ui/*`, never via `className` overrides at call sites (`standards/design-system.md` § variants). Dark mode class is `.dark` by default; if the theme script sets `data-theme`, either switch shadcn's variant to the attribute or have the script set both.

## Ant Design v5 (中后台 React default)

Theme is a JS object; the library reads **design tokens**, not CSS variables, unless `cssVar` is on. Turn it on — it is what lets your own components share the values.

```tsx
<ConfigProvider
  theme={{
    cssVar: { key: 'app' },             // emits --ant-* variables for custom components
    hashed: false,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    // add theme.compactAlgorithm to the array for the compact density
    token: {
      colorPrimary: BRAND_500,
      colorSuccess: GREEN_500, colorWarning: AMBER_500, colorError: RED_500, colorInfo: BLUE_500,
      colorTextBase: NEUTRAL_900, colorBgBase: NEUTRAL_0,
      borderRadius: 4,                   // from the direction — AntD's default 6 is a choice, not a law
      fontFamily: 'var(--font-sans)',
      fontSize: 14,                      // CJK floor
      lineHeight: 1.75,                  // CJK body leading; see standards/cjk-typography.md
      controlHeight: 32,
      motionDurationMid: '0.14s',
    },
    components: { Table: { cellPaddingBlock: 8 }, Button: { fontWeight: 500 } },
  }}
>
```

Map the schema's roles onto AntD's seed tokens in **one** module; your own components then read `var(--ant-color-primary)`, `var(--ant-color-border)`, `var(--ant-color-bg-container)` rather than a second variable set. Dark mode is the algorithm, not a CSS override — never override AntD colors with `[data-theme="dark"] .ant-btn` selectors. Density: `size="small"` on `ConfigProvider` plus `compactAlgorithm`; wire it to the same `data-density` attribute the schema uses.

**Do not** fight AntD's component API with global CSS. If a component cannot be themed through `components.<Name>` tokens, that is the signal to wrap it, not to `!important` it.

## Element Plus (中后台 Vue default)

Element Plus reads CSS variables at runtime, so the mapping is CSS:

```css
:root {
  --el-color-primary: var(--primary);
  --el-color-success: var(--success);
  --el-color-warning: var(--warning);
  --el-color-danger:  var(--destructive);
  --el-color-info:    var(--info);
  --el-bg-color:      var(--background);
  --el-bg-color-overlay: var(--surface-elevated);
  --el-fill-color-light: var(--surface-secondary);
  --el-text-color-primary:   var(--foreground);
  --el-text-color-regular:   var(--foreground-secondary);
  --el-text-color-secondary: var(--muted-foreground);
  --el-border-color:         var(--border);
  --el-border-color-light:   var(--border-subtle);
  --el-border-radius-base:   var(--radius-md);
  --el-font-size-base:       var(--text-body);
  --el-transition-duration:  var(--duration-normal);
}
```

Element Plus derives `--el-color-primary-light-3/5/7/8/9` and `-dark-2` from the base at build time via SCSS, **not** at runtime — so overriding only `--el-color-primary` leaves hover and subtle tints on the old hue. Either generate those too (with `color-mix()`, as the library's own dark theme does) or set the palette through the SCSS `@forward … with ($colors: …)` entry. Dark mode: `html.dark` plus `element-plus/theme-chalk/dark/css-vars.css`; point the theme script at the `dark` class or set both. Density: `<el-config-provider :size="'small'">` wired to `data-density`.

## Arco Design

Arco exposes `--primary-1…10`, `--color-bg-1…5`, `--color-text-1…4`, `--color-border-1…4`, `--radius-small/medium/large`, `--color-fill-1…4`. Map roles onto those in one stylesheet loaded after Arco's. Dark mode is `document.body.setAttribute('arco-theme', 'dark')` — have the theme script set it alongside `data-theme`. Palettes are generated from a base via `@arco-design/color`; use it for the brand ramp rather than hand-picking ten stops.

## Naive UI

Everything goes through `themeOverrides` on `<n-config-provider>`: `common.primaryColor`, `common.borderRadius`, `common.fontFamily`, `common.fontSize`, `common.lineHeight`, plus per-component keys. Dark is `:theme="darkTheme"`. Naive does not emit CSS variables for your own components by default — build the `themeOverrides` object *from* the schema variables (read them with `getComputedStyle` once at boot, or generate both from one TS constant) so there is still one source.

## MUI

`createTheme({ cssVariables: { colorSchemeSelector: 'data-theme' }, colorSchemes: { light: {…}, dark: {…} }, shape: { borderRadius }, typography: { fontFamily, fontSize } })`. With `cssVariables` on, MUI emits `--mui-palette-primary-main` etc.; your components read those. Density: `components.MuiButton.defaultProps.size` and `MuiTable.size="small"`; there is no global multiplier, so wire `data-density` to the `size` props at the provider.

## Vuetify

`createVuetify({ theme: { defaultTheme, themes: { light: { colors: { primary, surface, background, error, success, warning, info } } } }, defaults: { VBtn: { density: 'comfortable' } } })`. Vuetify emits `--v-theme-primary` as RGB channels — read as `rgb(var(--v-theme-primary))`. Density is a first-class prop (`compact | comfortable | default`); map `data-density` to it.

## No component library

Copy the schema structure, fill it from the direction, load `assets/a11y-baseline.css` and `assets/app-shell-baseline.css`, and build variants per `standards/design-system.md`. Overlays: use native `<dialog>` and `popover`/anchor positioning where supported before reaching for a library; if a headless library is needed, Radix / Headless UI / Ark are all fine and all still have to pass `standards/overlays-navigation.md`.

## The theme script, per framework

`standards/theming-dark-mode.md` shows the before-first-paint script for Next.js App Router. The same script, other hosts:

- **Nuxt** — `useHead({ script: [{ innerHTML: THEME_SCRIPT, tagPosition: 'head' }] })` in `app.vue`, or `app.head.script` in `nuxt.config`. Do not put it in a `<script setup>` — that runs after hydration.
- **Vite SPA (React/Vue)** — inline `<script>` in `index.html` `<head>`, before the module script.
- **Astro** — `<script is:inline>` in the layout `<head>`.
- **Plain HTML / server templates** — inline `<script>` in `<head>`, first.
- Library-specific: the same script also sets `.dark` (shadcn, Element Plus), `arco-theme` (Arco), or nothing extra (AntD, Naive, MUI, Vuetify read state from JS — sync their provider from the same stored value).

## Checklist

- [ ] Stack detected from files, stated before proposing
- [ ] One source of truth per value; no parallel token layer beside a component library
- [ ] Library components and custom components read the same variables
- [ ] Dark mode goes through the library's own mechanism (algorithm, class, attribute) and the theme script sets it
- [ ] Density wired to the library's size/density mechanism from the same `data-density` attribute
- [ ] Radius, font, motion set from the direction, not left at the library default
- [ ] CJK products set the library's `fontSize` / `lineHeight` from `standards/cjk-typography.md`
- [ ] No `!important` overrides of library components; unthemeable components are wrapped
