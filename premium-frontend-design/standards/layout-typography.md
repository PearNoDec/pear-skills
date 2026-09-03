# Layout and Typography Standard

Hierarchy comes from structure and type before it comes from color or decoration. A page that reads as generic usually does not have a color problem — it has one container width, one section shape and one type step repeated down the page.

This file covers the decisions. The values live in `assets/tokens.schema.css`, and the four that carry the most identity — radius, type ratio, motion duration, neutral temperature — are argued in `standards/design-system.md`.

## Containers: one width is not a system

The default failure is a single `--container-max` used for everything. Long-form prose then spans 1200px and becomes unreadable, while a data table gets squeezed into a column it does not fit.

| Token | Job | Typical |
|---|---|---|
| `--container-text` | Long-form reading | 60–75 characters Latin · 30–40 characters CJK |
| `--container-max` | The main content column | 1100–1440px |
| `--container-wide` | Full-bleed media, workspace shells | 1600px → `100%` |

**Pick the measure first, then the container.** A container width chosen before the measure is a number, not a decision.

Gutters are fluid (`clamp()`), so content never touches the edge on a phone and never sticks to it on a wide screen.

**Wide desktop is a design problem, not a scaling problem.** Stretching to fill 1920px is one failure; a 1200px column marooned between two 360px voids is the other. Choose deliberately: widen the container, add a persistent sidebar or table of contents, or make the margins part of the composition — rules, marginal notes, a section index.

## Grid

A 12-column grid is a default, not a decision. It earns its place when a page genuinely needs halves, thirds and quarters together. If every section splits 7:5 and 1:1, twelve columns is ceremony.

What matters more than the column count:

- **One asymmetric ratio, held everywhere,** reads as art direction. Varying it section by section reads as indecision — `standards/anti-patterns.md` § *Where a signature actually comes from*, move 3.
- **Grid gap derives from the spacing scale.** A gap that is an independent number is the first crack in the system.
- **`minmax()` floors are the most common source of 375px overflow.** A `minmax(320px, 1fr)` track plus a gutter overflows a 375px viewport. Write `minmax(min(320px, 100%), 1fr)`.

## Choose the pattern from the shape of the content

| The content is | Pattern | Not |
|---|---|---|
| A sequence where order matters | Numbered steps, connected timeline, horizontal sequence | A three-column grid — it erases the order |
| A comparison across the same attributes | Aligned columns or a real table | Cards — they destroy comparability |
| Items of genuinely unequal importance | Asymmetric grid, bento | Equal cards — equal size asserts equal weight |
| One deep idea with several facets | Sticky media with scrolling text | Four cards summarising it |
| A narrative: problem → solution → result | Alternating editorial sections | A feature grid |
| A flat list of true peers | Modular grid, or a list | (First ask whether a list is better) |
| Long-form reading | A single measured column, full-bleed media as punctuation | Multi-column body text on screen |
| A workspace | Shell — nav, toolbar, content, optional panel | Any marketing layout |

The test: **if two adjacent sections have different content shapes and the same layout, one of them is wrong.**

## Rhythm

The failure is easy to state and easy to miss: a long page where every section is *full width → centered heading → three-column grid* has no rhythm, regardless of how good each section is on its own.

**Rule: no more than two consecutive sections may share the same combination of width, alignment and background.** Change at least one at every boundary.

Write the rhythm down before building. It looks like this:

```
full-bleed hero → narrow centered proof → wide asymmetric split →
narrow long-form → full-bleed media → dense comparison table →
narrow CTA → wide branded footer
```

That is an example, not a formula. The point is that a page whose rhythm can be written in one line has one, and a page whose rhythm cannot be written down does not.

## Vertical rhythm and proximity

The rule that catches the most spacing bugs: **the gap inside a group must be visibly smaller than the gap between groups.** If a heading sits as far from its own paragraph as from the section above it, grouping is invisible and the reader has to reconstruct it from meaning.

- Heading → its own body: one or two steps down the scale
- Between sibling items in a group: the same step every time
- Between groups and sections: `--section-y`
- ADMIN overrides `--section-y` down. A workspace does not need marketing breathing room — see `[data-surface="admin"]` in `assets/tokens.schema.css`.

Every gap comes from the spacing scale. A value off the scale needs a reason you can say out loud.

## Type scale

Define the roles once (`standards/design-system.md`), then hold the scale. Two ways it fails:

- **Too many steps.** A scale with fourteen sizes has no hierarchy, because nothing is clearly larger than anything else.
- **No floor.** 11px labels sprinkled through a layout are not communicating. The CJK floor is 14px — see `standards/cjk-typography.md`.

Line height moves opposite to size:

| | Latin |
|---|---|
| Display, H1 | 1.0 – 1.15 |
| H2–H4 | 1.2 – 1.35 |
| Body | 1.5 – 1.6 |
| Long-form | 1.6 – 1.75 |
| Dense table rows | 1.35 – 1.45 |

Every CJK value is looser than its Latin counterpart; the table for that is in `standards/cjk-typography.md`. One `line-height` applied to the whole page is a tell in either script.

## Fluid type: the clamp trap

```css
/* Trap — the middle term is pure vw */
font-size: clamp(2.75rem, 6vw, 7rem);
```

Two problems. Pure `vw` ignores the user's default font-size setting, which `rem` respects. And the curve is steep, so the type sits at its minimum across the entire phone range and then races to the maximum — the two ends are tuned and everything between them is accidental.

```css
/* Better — a rem base plus a shallower vw term */
font-size: clamp(2.75rem, 1.5rem + 4.2vw, 7rem);
```

The `rem` term keeps the value tied to the user's setting; the shallower `vw` term gives a usable size at every width. This is the form `assets/token-presets.css` uses throughout.

`clamp()` on `line-height` is almost always wrong — use a unitless ratio so it tracks whatever size the element resolves to.

## Typographic tells

Four treatments read as generated regardless of the typeface, because they appear whatever the subject is (`standards/anti-patterns.md` §2):

- A tracked-out ALL-CAPS label above every heading
- One word or phrase in a headline set in a second color, italic or a different weight
- A monospace face for every small metadata line
- Title Case On Every Label And Button

Type carries the personality of a page; use it as an active element — scale contrast, a display face with real character, a measure that changes with the content — not as chrome. One family, or two clearly distinct ones. Serif body text takes a slightly longer measure and slightly more leading than sans.

## Numeric typography

- **`tabular-nums` on anything that updates or aligns in a column.** Proportional digits jitter as values change. Already available as `.numeric` in `assets/tokens.schema.css`.
- **Align decimals, not just right edges,** in a currency or measurement column.
- **Unit and context are subordinate to the value.** "31 hours" sets *hours* a step down in size or color, not at the same weight as the number.
- **Check the display face before using it for KPIs.** A face chosen for a headline frequently has no tabular figures.
- **A large number with no label is decoration.** See `standards/content-copy.md`.

## Optical detail

The last-mile items that separate "works" from "finished":

- Icon and text baselines align optically, not just their bounding boxes
- Cards in a grid align on their first line of text, not only on their top edge — varying heading lengths break this and it is visible
- Text set against the edge of a container reads as misaligned even when it is mathematically correct; trust the eye over the number
- `text-wrap: balance` on headings and `pretty` on paragraphs are already in `assets/a11y-baseline.css`, Latin only — `balance` has little effect on CJK, which has no word boundaries for the browser to balance at
