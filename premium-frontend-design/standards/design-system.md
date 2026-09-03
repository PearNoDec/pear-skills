# Design System Standard

A polished frontend is a system, not a collection of individually styled screens.

**Start from `assets/tokens.schema.css`.** It defines the roles a token layer needs and the rules each role must satisfy. It contains almost no values, on purpose — a schema that ships a working palette gets copied verbatim, and every project built from it ends up looking the same. That is the failure `SKILL.md` §7.3 exists to prevent; a shared default just relocates the template.

`assets/token-presets.css` holds three mutually incompatible starting points (Editorial / Technical / Soft) if you need a push. Take one, then diverge.

If the project already has a token layer — or a component library that *is* one (shadcn, Ant Design, Element Plus, Arco, Naive, MUI, Vuetify) — extend that one. Do not introduce a second. `standards/stack-adapters.md` shows where each library keeps its tokens and how to map the roles onto it in one file.

## The two layers

**Primitives** are raw values — ramps, scales, families. No component ever references them.
**Semantic roles** are the only layer components may touch: `--surface`, `--muted-foreground`, `--border-strong`, `--primary-hover`.

The rule this buys you: *if a component needs a value with no semantic name, the system is missing a role.* Add the role. Do not reach past the semantic layer for a primitive, and never hard-code a raw value in a component.

This is what makes dark mode, density switching, per-tenant theming and a rebrand into variable edits rather than component refactors.

## Where identity actually lives

Four decisions carry most of an interface's character. They are the ones to make deliberately rather than accept:

| Decision | Range | What it signals |
|---|---|---|
| **Radius scale** | 0px → 24px | Near-zero reads editorial and serious; large reads soft and consumer |
| **Type ratio** | ~1.2 → ~1.5 between steps | Tight reads technical and dense; wide reads editorial |
| **Motion duration** | 60ms → 500ms | Fast reads industrial; slow reads deliberate and expensive |
| **Neutral temperature** | warm → cool | Warm reads printed; cool reads screen; pure gray reads undesigned |

Landing on 8px radius, a 1.25 ratio, 200ms and pure gray is the specific combination that reads as first-generation generic. Landing on 0px radius, a 1.5 ratio, a serif display, 400ms and a warm cream is the combination that reads as *second*-generation generic — see `standards/anti-patterns.md` §2. Any position is defensible with a reason that comes from this brand; a position that comes from "what premium looks like" is the tell either way.

## Typography roles

Define at minimum: Display, H1–H4, Title, Body, Body Small, Label, Caption, Data/Numeric. For each, control size, weight, line height, letter spacing and measure.

Marketing surfaces can carry large scale contrast. Operational surfaces need a tighter, scan-friendly hierarchy where weight and color do the work that size does on a landing page.

For any product shipping Chinese, Japanese or Korean, set leading, weight and the font stack from `standards/cjk-typography.md` before anything else here — Latin defaults produce cramped, blurred CJK.

## Borders and elevation

Build depth from surface contrast, borders, transparency, blur and lighting — not from stacking shadows. Heavy black shadows and five elevation layers are a substitute for hierarchy, not an expression of it.

In dark mode elevation inverts: a raised surface is *lighter*, not more shadowed. See `standards/theming-dark-mode.md`.

## Component variants

Components take controlled variants. Call sites pass **meaning**, never styling.

```jsx
<Button intent="destructive" size="sm">Delete</Button>   // yes
<Button className="bg-red-500 h-8 px-3">Delete</Button>  // no
```

Enumerate the axes of variation and express each as a named variant — for a button that is typically *intent* (primary / secondary / ghost / destructive / link), *size*, *shape*, *block* and *loading*. Loading is a variant, not a separate component; keeping it in the API is what makes "never ship only the happy path" cheap to obey.

Three rules that make this hold up:

1. **Sizes derive from `--control-h-*`,** never hard-coded heights. One density attribute then resizes every control in the product at once.
2. **Focus lives in the base,** not per variant. A focus ring added variant by variant is a focus ring that will be missing from one of them.
3. **The second time a call site overrides styling, the system has a missing variant.** Add the variant; do not add the override. A component whose appearance can only be changed via `className` is not a system component.

The pattern is stack-independent — CVA, CSS Modules, vanilla-extract, data attributes, or Vue/Svelte props all express it. Adopt whatever the project already uses.

## Chart roles

If the product has charts, series colors are token roles too: `--chart-1` … `--chart-6`, tuned separately per theme, never reusing a status hue. The rules are in `standards/data-visualization.md`; the slots are in the schema.

## Z-index

Ad-hoc z-index values are the root cause of most "the dropdown renders behind the sticky header" bugs. Use the named scale in the schema and never write a raw number:

`base → raised → sticky → header → drawer → overlay → dialog → popover → tooltip → toast`

## Density

Enterprise tools benefit from a user-selectable density. Make it a **multiplier** that control heights derive from, so switching resizes every control at once rather than one component at a time. See `--density` and `--control-h-*` in the schema.

## Theming

A token layer that supports only one theme is not finished. Decide before building — retrofitting a theme onto hard-coded colors is one of the most expensive frontend refactors there is. See `standards/theming-dark-mode.md`.
