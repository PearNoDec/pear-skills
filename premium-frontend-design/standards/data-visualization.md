# Data Visualization Standard

Dashboards (数据看板) are a core surface for this skill, and charts are the component most often added for looks. A chart is a sentence: it makes one claim, to one reader, who then does something. If you cannot write that sentence, do not draw the chart.

This file is library-neutral. ECharts, Recharts, Chart.js, D3, Vega-Lite and AntV all have to satisfy the same rows; the choice of library is an engineering decision that comes *after* the chart is chosen.

## Every chart answers one question

Write the question first. It is one of a small set:

| Question | Chart | Not |
|---|---|---|
| How has this changed over time? | Line (continuous), bar (discrete periods) | Area stacked to look "full"; a pie per month |
| How do these compare? | Horizontal bar, sorted by value | Radar, 3D bar, a pie with nine slices |
| What is the composition of a whole? | Stacked bar, treemap, or a **table**. Pie/donut only for 2–4 parts where one is the point | A donut with a number in the middle as decoration |
| Is this within limits? | Bullet chart, gauge with a target, or a number with a threshold color | A speedometer |
| Where are the outliers? | Scatter, box plot, distribution | A line chart with 40 series |
| What is the flow between states? | Sankey, funnel (for a real conversion sequence) | A funnel for anything that is not a sequence |
| What does one number look like right now? | A KPI figure with context | A chart with one bar |

If the question is "how is the business doing", that is a dashboard, not a chart — decompose it.

## The KPI figure

The most common dashboard element and the one most often reduced to a large number in a card. Anatomy, in priority order:

1. **The value** — `tabular-nums`, one unit of precision, formatted for the locale (`Intl.NumberFormat`), abbreviated only when the exact figure does not matter (¥1.24M vs ¥1,238,412).
2. **The label** — what it measures, unambiguous: "Orders shipped, last 7 days", not "Orders".
3. **The comparison** — versus what, and the direction: "+12% vs previous 7 days". Direction by arrow *and* color; sign always written.
4. **The period** — visible, not implied. A number with no period is decoration.
5. Optionally a sparkline — for trend, not decoration; no axes, no tooltip, same period as the comparison.

Four identical KPI cards is the tell. If four numbers matter equally, a single row with a shared baseline reads better than four boxes; if they do not, size them by importance.

## Series color is a token role

Chart palettes are the most common thing to break in dark mode and the most common place a hard-coded hex slips back into a tokenized product.

- Define `--chart-1` … `--chart-6` as semantic roles in the token layer, tuned separately for light and dark. Six is the ceiling for distinguishable series; past that, group or facet.
- **Status hues keep their meaning.** If the product uses red for error, red is not available as "series 3". Reserve it for a series that *is* an error state.
- **Order matters more than hue.** Series 1 is the brand or the most important line; comparison series are lower contrast, not just different.
- **Never color alone.** Series differ by line style or marker as well; stacked segments are labeled; a legend is not a substitute for a direct label where there is room.
- Sequential data (low → high) uses a single-hue ramp; diverging data (below / above a center) uses a two-hue ramp with a neutral center. Do not use a rainbow for either.

## Axes, scales, labels

- **The y-axis starts at zero for bars.** A bar chart that starts at 90 turns a 2% difference into a 200% one. Lines may truncate the axis — then say so.
- Gridlines are quiet (`--border-subtle`), horizontal only, and fewer than six. Vertical gridlines on a time series are noise.
- Axis labels are formatted for the reader: `Jan`, `Feb` — not `2026-01-01T00:00:00Z`; `¥12k` — not `12000`. Rotated labels mean the chart is too narrow: reduce ticks or go horizontal.
- Every chart has a title that states the claim, a unit, and a period. "Revenue" is a label; "Revenue by month, FY2026, ¥" is a title.
- Direct labeling beats a legend: label the last point of each line, the top of each bar. Legends are for when there is genuinely no room.
- Annotate the event the reader will ask about — the launch, the outage, the policy change. A chart that shows a spike without explaining it generates a question instead of answering one.

## Interaction

- Tooltip on hover **and** on keyboard focus of the data point; shows the full-precision value, the series name and the exact period.
- Crosshair on time series so the reader can compare series at the same x.
- Click-through when a drill-down exists: a bar you can click looks clickable (cursor, hover state) and says where it goes.
- Zoom and brush only on charts with enough data to need them, with a visible reset.
- Legend items toggle series where there are more than three; toggled-off state is visible and persists per session.
- Charts on touch: tap for tooltip, no hover-only information, targets ≥ 24px.

## States

Charts have the same five states as a data grid (`standards/data-grid.md`), and skip them just as often:

| State | Renders |
|---|---|
| `loading` | A skeleton at the chart's exact final size — a grey block with the axis area, not a spinner. No layout shift when data lands |
| `error` | The error and a retry, inside the chart's box |
| `empty` | "No orders in this period" plus the action that would create data or widen the period |
| `partial` | Data that exists is drawn; the missing range is shaded and labeled ("Data from Mar 12 not yet available") |
| `idle` | The chart |

A chart that renders an empty axis frame with no data is the most common dashboard defect.

## Accessibility

- The chart has an accessible name (`aria-label` or `aria-labelledby` to its title) and a text summary of the claim — the one sentence the chart makes — in the DOM, visually hidden if it is redundant.
- **Provide the data as a table.** A `<table>` (visually hidden, or behind a "View as table" toggle) is the only reliable screen-reader path for most libraries. It also gives users copy/paste and search for free.
- SVG charts: `role="img"` on the root when the chart is a single statement; `role="group"` with focusable points when interaction matters.
- Canvas charts (ECharts default): the canvas itself is inaccessible — the table fallback is mandatory, and `aria-label` on the container.
- Contrast: series against the plot background ≥ 3:1 (non-text contrast); labels ≥ 4.5:1. Verify in dark mode.
- Reduced motion: no entrance animation on load; transitions on data change may stay if short.

## Dashboard composition

- **Answer the operator's first question at the top-left.** Reading order is a design decision; the dashboard has one primary claim and it goes where the eye lands first.
- Group charts by question, not by chart type. A row of "all the pies" is a component inventory, not a dashboard.
- Fix chart heights per row so gridlines and baselines align across the row. Misaligned baselines are the first thing that reads as unfinished.
- One time range control governs the dashboard; per-chart overrides are explicit and visible.
- Refresh: show *when* the data is from ("Updated 12:04") and auto-refresh only where the operator expects it; never re-animate on refresh.
- A dashboard is not a landing page: no hero, no decorative gradients, no chart added to fill a grid cell. If a cell has nothing to answer, remove the cell.
- On mobile, a dashboard is a stacked list of the KPIs and one or two charts, not a shrunk grid. Decide which charts survive.

## CJK notes

- Chinese axis labels are shorter than English ones; column widths tuned for English leave the chart under-filled — re-measure.
- Numeric abbreviations follow the locale: 万 / 亿 for zh-CN, not k / M. `Intl.NumberFormat('zh-CN', { notation: 'compact' })` produces them.
- Digits still render in the Latin face (`standards/cjk-typography.md`), so `tabular-nums` behaves.

## Checklist

- [ ] Every chart states its question in a title with unit and period
- [ ] Chart type matches the question; no pie beyond four parts, no 3D, no rainbow
- [ ] KPI figures carry label, comparison with direction and sign, and period
- [ ] Series colors are token roles, tuned for both themes; status hues are not reused as series
- [ ] No series or segment is distinguished by color alone
- [ ] Bar axes start at zero; truncated axes are labeled as such
- [ ] Direct labels where room allows; ≤ 6 series
- [ ] Tooltips also work on keyboard and touch
- [ ] All five states implemented at the chart's final size; no layout shift
- [ ] A table fallback exists; canvas charts have an accessible name
- [ ] Row baselines align; one time-range control; data timestamp visible
- [ ] Mobile dashboard is a deliberate subset, not a shrunk grid
