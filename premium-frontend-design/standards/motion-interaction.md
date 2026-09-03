# Motion and Interaction Standard

Motion is either feedback or it is decoration. Feedback is not optional; decoration has to earn its place, and how much it can earn is set by the product mode.

Most bad motion is not the wrong idea — it is the right idea at the wrong duration. Read that section first.

## Duration

Duration and distance are coupled. An element that moves 8px and one that moves 400px cannot share a value: the same number reads as instant on one and sluggish on the other.

| What | Duration | Token |
|---|---|---|
| Hover, active, focus color change | 60–120ms | `--duration-instant` |
| Tooltip, small popover | 100–160ms | `--duration-fast` |
| Dropdown, tab, accordion, row expand | 140–240ms | `--duration-normal` |
| Dialog, drawer, sheet | 200–320ms | `--duration-slow` |
| Page or section transition | 300–450ms | — |
| Marketing reveal, scroll storytelling | 400–800ms | `--duration-slower` |

Above roughly 150ms a hover response stops reading as response and starts reading as lag.

Two rules follow from the table:

- **Exit is faster than enter** — typically 60–80% of it. The user has already decided; making them wait to leave is the most common reason an interface "feels slow" while its performance numbers look fine.
- **A repeated action takes the short end of every range.** An operator who opens the same dropdown two hundred times a day pays that duration two hundred times.

`assets/token-presets.css` sets these roughly 6× apart between Editorial (380ms normal) and Technical (140ms normal), because motion duration is one of the four decisions that carry an interface's identity — see `standards/design-system.md`.

## Easing

| Situation | Curve | Why |
|---|---|---|
| Entering — appear, expand, slide in | `ease-out` | Fast start, gentle settle; reads as arriving |
| Exiting — dismiss, collapse | `ease-in` | Accelerates away; pair with the shorter duration |
| Moving between two visible states | `ease-in-out` | Symmetric, because both ends are on screen |
| Continuous — spinner, progress, marquee | `linear` | The only correct use of linear |

Never use `linear` for a discrete transition; nothing physical starts and stops at constant speed, so it reads mechanical. The CSS default `ease` is a weak curve — the presets ship real ones.

**Overshoot and spring** are for things that should feel physical, on actions a user takes occasionally: a toast landing, a card picked up, a first-run moment. Overshoot on a control that opens hundreds of times a day is not delightful, it is nauseating. `--ease-spring` exists; it is not the default.

## Intensity by mode

| Mode | Allowed | Ruled out |
|---|---|---|
| **CORPORATE** | Scroll storytelling, typographic reveal, image masks, controlled parallax, section transitions | Anything that delays the value proposition |
| **SAAS marketing** | Product demonstration, staged reveals, interaction that explains the product | Motion that fires before the user has read the headline |
| **SAAS product** | Menus, popovers, dialogs, drawers, nav and tab state, success feedback, row expansion | Marketing reveals, scroll-linked effects, staggered entrances |
| **ADMIN** | The same set, faster and smaller | Anything a repeated task has to wait for |

Set intensity from the token layer, not per component. `[data-surface="admin"]` in `assets/tokens.schema.css` cuts every duration in one place; removing animations one at a time guarantees one gets missed.

Never let marketing intensity leak into a dense workflow — `SKILL.md` §5.

## What to animate

`transform` and `opacity` only, on anything expected to hold 60fps. Both are composited. `width`, `height`, `top`, `margin` and `padding` trigger layout on every frame.

That leaves the case everyone actually hits: expanding a panel to its natural height.

| Approach | Cost |
|---|---|
| `grid-template-rows: 0fr → 1fr` on a wrapper with `overflow: hidden` | Animates layout, but only one subtree. The standard modern answer |
| `max-height` to a guessed cap | Cheap; the guess is wrong for long content and the timing is visibly off |
| `scaleY` plus a counter-scale on the child | Composited, but distorts borders, radius and text |
| `interpolate-size: allow-keywords`, then animate to `height: auto` | Correct where supported — Chromium only today, so layer it over one of the above as progressive enhancement |

Two more that cost frames without touching layout: animating `filter: blur()`, and large `box-shadow` spreads. `backdrop-filter` on an element that scrolls is the single most common cause of a page that drops frames while everything else looks fine.

## Hover

`scale(1.1)` on every card is the tell. The problem is not the scale — it is that the motion carries no information. The card said exactly the same thing before and after.

A hover should **reveal** something: a border gaining contrast, a background lifting one surface step, an icon moving in the direction the link goes, a media crop shifting, secondary metadata fading in, text gaining hierarchy.

Two constraints:

- **Hover is never the only path.** Anything reachable only on hover is unreachable by touch and by keyboard. Row actions especially — see `standards/data-grid.md`.
- **Whatever hover reveals, `:focus-visible` reveals too.** A card whose action appears on hover but not on focus is broken for keyboard users, and it is broken silently.

## Entrance and scroll animation

Every section fading up on scroll is the generated-marketing-page default. It costs more than it returns.

**One orchestrated moment beats scattered effects.** A single page-load sequence or one reveal at the point where the product explains itself lands; fade-and-slide on every section and a hover transition on every card reads as a page that was told to "add polish". Spend the motion budget in one place, the way the visual budget is spent in one place (`standards/anti-patterns.md` §3, move 4).

- **Never animate above-the-fold content on load.** The user is already looking at it, and an opacity transition on the hero delays the LCP paint the browser was ready to make.
- **Content must be visible if the script never runs.** `opacity: 0` in CSS plus an IntersectionObserver that adds a class produces an invisible page whenever the observer fails, the element starts in view, or JS is blocked. Set the hidden state *from* the script, or use `animation-timeline` where it is supported.
- **Animate once.** Re-triggering on every scroll-direction change turns a page into a slideshow.
- **Stagger only inside a real group** — 40–80ms apart, capped around five items. Twelve staggered cards means the last one arrives a second late for no reason.

## The states that matter more than page motion

- **The focus ring must not animate.** It has to appear on the frame the element receives focus; a 200ms fade makes fast tabbing lose the ring entirely. `assets/a11y-baseline.css` deliberately declares no transition on it.
- **Skeleton → content must not shift layout.** A skeleton whose height differs from the content it stands in for is a layout shift wearing a costume. See `standards/data-grid.md`.
- **Optimistic updates need a visible rollback.** A row that silently reverts reads as a bug; a row that reverts with an error reads as a system that noticed.
- **A destructive confirmation should arrive fast.** Speed here is safety — a dialog that lands after the pointer has already moved gets dismissed by accident.

## Reduced motion

Honor `prefers-reduced-motion`. **Reduce; do not delete** — a user who asked for less motion still needs to know their action registered, so opacity and color feedback stay.

What to strip is what causes discomfort: parallax, scroll-linked effects, large transforms, non-essential autoplay. Working implementation, including the `[data-parallax]` / `[data-scroll-linked]` hooks that make this a one-line opt-in per effect, is in `assets/a11y-baseline.css`.

## Checklist

- [ ] Duration matches the distance travelled and the product mode
- [ ] Exit transitions are shorter than their entrances
- [ ] `linear` appears only on continuous animation
- [ ] No overshoot on anything used repeatedly
- [ ] Only `transform` and `opacity` animate in a 60fps path
- [ ] Height animation uses a chosen strategy, not `max-height` guesswork
- [ ] Everything hover reveals is also revealed on `:focus-visible`
- [ ] Above-the-fold content is not animated on load
- [ ] Content is visible with JavaScript disabled
- [ ] The focus ring has no transition
- [ ] `prefers-reduced-motion` reduces feedback rather than deleting it
