# Anti-Patterns and AI-Template Detection

A prohibition is weak guidance. "Do not use a purple gradient" leaves the next choice unmade, and the fallback is usually another default. Every entry here pairs the tell with the replacement.

There are now **two generations** of tells. The first is the purple-gradient / glass-card / pill-button kit. The second is what generated interfaces converged on *after* learning to avoid the first — and it is the one you are more likely to produce today, because it feels like the correct answer. Read §2 before deciding you have escaped §1.

---

## 1. First-generation tells

### Visual defaults

| Instead of | Do |
|---|---|
| Purple-to-blue gradient with no brand basis | One brand color, used with intent. If a gradient is right, derive it from the brand and use it in one place as a signature |
| Glowing orbs and blurred blobs in the background | A background that carries meaning: a grid derived from the product, real data, typographic texture, or nothing at all |
| Glassmorphism on every panel | Solid surfaces with a considered border. Reserve blur for layers that genuinely float above content |
| Every block wrapped in a rounded card | Typography, spacing and rules to signal grouping. See the card test below |
| Pill-shaped buttons everywhere | One radius scale applied consistently. Full-round for avatars and true tags only |
| Gradient fills on every button | One solid primary. Let hierarchy come from color weight, not from decoration |
| Extreme corner radii (`24px+` on small elements) | A radius that scales with the element. Large radii on small controls read as toylike |
| Body text in low-contrast grey | A muted role that still passes 4.5:1. Hierarchy from size and weight, not from making text hard to read |
| Everything centered | A deliberate alignment system. Center for short focal statements; left-align anything longer than two lines |
| Identical section heights and rhythms down the page | Deliberate pacing — see the rhythm section of `standards/layout-typography.md` |
| Decorative badges and labels with no informational role | Remove them, or make them carry real state |
| 11px labels sprinkled through the layout | A type scale with a real floor. If it is too small to read, it is not communicating |
| `scale(1.05)` on hover for every card, fade-up on scroll for every section | Motion that reveals information. See `standards/motion-interaction.md` |

### Marketing / SaaS page patterns

| Instead of | Do |
|---|---|
| Text-left / dashboard-screenshot-right hero, again | A hero built from what the product actually does: a real workflow, a live artifact, an interactive demo, or editorial typography |
| A fabricated dashboard mockup | The real UI. If it is not ready, show a real output, a real document, a real result |
| A wall of feature cards | Sequential storytelling — sticky product showcase, tabbed demo, alternating editorial sections, before/after |
| Four identical statistic cards | Two or three numbers treated as editorial content, each with context that makes it mean something |
| Three-column grid used for every section | Vary the structure by content type. A comparison, a sequence and a list are not the same shape |
| A pricing table that hides the differences | Explicit limits, a recommended plan, and a comparison a buyer can actually decide from |
| Marketing-grade animation inside the authenticated product | Marketing intensity on marketing surfaces only. See `modes/saas.md` |
| Generic stock photography of a diverse team at a laptop | Product imagery, real customer material, illustration built on the brand system, or no image |

### Admin / operations patterns

| Instead of | Do |
|---|---|
| Structured data converted into cards | A real data grid. Cards destroy comparability, which is the entire point of tabular data |
| A large hero-style page header in a workspace | A compact header: breadcrumb, title, state, primary action |
| Charts that fill space without answering a question | Charts tied to a decision. See `standards/data-visualization.md` |
| Consumer-app whitespace in a dense tool | Density appropriate to the work, ideally user-selectable. See `--density` in `assets/tokens.schema.css` |
| Row actions revealed only on hover | Persistently visible actions, or an always-present overflow menu. Hover-only is unreachable by touch and keyboard |
| A filter bar that does not show what is filtered | Visible active filters with a count and a clear-all |
| `Are you sure?` on a bulk delete | The scope and the consequence: "Delete 12 orders? This cannot be undone" |
| Permission failures surfaced as backend errors | Permission states designed into the UI. Disabled with a reason beats hidden |
| A form that is one endless column of inputs | Sectioned, grouped, with widths matched to expected input. See `standards/forms.md` |

---

## 2. Second-generation tells — the anti-template that became the template

These are legitimate choices for some briefs. The problem is that generated work reaches for them **regardless of the brief**, so they now read as "an AI avoided the purple gradient" rather than as art direction. If the user's brief asks for one of these looks, follow the brief. If the brief leaves the axis free, do not spend that freedom here.

| The tell | Why it reads generated | Instead |
|---|---|---|
| Warm cream background (≈ `#F4F1EA`) + high-contrast serif display + terracotta / warm-clay accent (≈ `#D97757`) | The single most common "premium" cluster today. The accent is also a well-known AI assistant's own brand color, so on a client's site it reads as borrowed | Derive the neutral temperature and the accent from *this* brand. If the brand is warm, find its warmth in its own materials, not in the cream-and-clay default |
| Near-black page + one acid-green or vermilion accent | The "dev-tool" cluster. Every AI-generated developer product looks like this | Dark is a theme, not an identity. If dark is right, the identity still has to come from type, structure and the product's own data |
| Broadsheet layout: hairline rules everywhere, zero radius, dense newspaper columns | The "editorial" cluster. Rules and zero radius are a costume unless the content is actually editorial | Borrow editorial *pacing* (measure, rhythm, scale contrast) without the costume. Rules only where they separate things a reader would otherwise confuse |
| The SaaS card kit: identical rounded cards, one radius on everything, the same `rgba(0,0,0,.1)` shadow under each, gradient washes as decoration | Hierarchy is flat because every container is the same container | Radius and elevation that *scale with importance*. Most content needs no container at all |
| Tracked-out ALL-CAPS eyebrow label above every heading | Template chrome. It appears whatever the subject, which is the definition of a template | A heading that does its own job. If context is needed, a sentence-case line that says something specific |
| Meta strings joined with middle dots: `Design · Engineering · 2025` | Same — chrome that decorates instead of structuring | A real sentence, a list, or a table. If items are peers, separate them with the layout, not with a glyph |
| Labels built as `WORD — fragment` with a spaced em dash | Same | Plain labels. The em dash is a punctuation mark, not a design system |
| A `→` appended to every link and button label | Same | The label carries the meaning. A directional icon only when direction *is* the meaning (next step, external link), and then as a real icon, not a character |
| A monospace face for every small data label and metadata line | Mono signals "technical" without earning it | Mono for code, identifiers and tabular data only. Everything else in the body face with `tabular-nums` |
| Tinted near-black (`#0B0B0B`, `#111`) standing in for black in a light theme | Reads as an unexamined default | Choose the darkest neutral from the ramp *with* its hue. If the brand is neutral, pure `#000` text on white is not a crime |
| One word in a headline set in italic, bold, or a second color | The "accent one phrase" tell — it was a workaround for headlines that had no real hierarchy | A headline strong enough to need no highlighted word. Emphasis through the sentence, not the styling |
| Numbered markers `01 / 02 / 03` on content that is not a sequence | Structure applied to content that has none | Number only real sequences: steps, timelines, ranked lists. Otherwise, no number |
| Fade-and-slide-up on every section, hover transition on every card | Scattered motion reads as a page that was told to "add polish" | One orchestrated moment, plus motion that answers user actions. See `standards/motion-interaction.md` |

The way to catch these in your own work: **ask what you would have produced for a different brief in the same category.** If the answer is "roughly this", the choice came from the category, not from the brief.

---

## 3. Where a signature actually comes from

Every table above replaces a tell with a direction, but a direction is only useful if you know where to look for one. "Make it meaningful" is not executable. These five moves are.

**1. Use the product's own data structure as the brand element.** A logistics product has a shipment timeline. A CI product has a commit graph. An accounting product has a ledger. A database tool has a query plan. Render that structure as real markup and use it as the recurring visual — it is unavailable to any competitor by definition, it is responsive, translatable, indexable and accessible for free, and it explains the product while decorating it. This is the single highest-yield move available, and it usually costs less than the screenshot-in-a-glass-card it replaces.

**2. Borrow from the domain's real artifacts, not from other websites.** A boarding pass, a lab report, a spec sheet, a schematic, a shipping manifest, a prescription, a 报关单, a 检验报告. Industries have centuries of visual convention that no landing-page template has absorbed.

**3. Hold one structural constraint everywhere.** A single asymmetric ratio used for every section. One rule weight, one indent, one grid offset. Repetition of a single deliberate rule reads as art direction; variety reads as indecision.

**4. Make one real material choice — and then spend your boldness in exactly one place.** A display face with genuine character. A specific neutral temperature that comes from the brand's own materials. One accent, permitted once per screen. Let one element be the memorable thing and keep everything around it disciplined. Before finishing, remove one thing.

**5. Let real data be the ornament.** Actual numbers, actual records, actual output. A real value with context is more visually interesting than an abstract shape, and it cannot be lifted onto a competitor's site.

The test for any of these: **does it recur in more than one section?** A signature that appears once is a decoration. `examples/before-after-hero.md` works move 1 end-to-end in real code; `examples/before-after-admin.md` works moves 3 and 5 in a 中后台 context.

---

## 4. The tests

### The brand-specificity test

Ask, in order:

1. Could the company name be swapped for a random competitor with no other change? If yes, the design has no identity.
2. Would I have produced roughly this for a different brief in the same category? If yes, see §2.
3. Is there a recurring visual signature that appears in more than one section?
4. Does the composition reflect this company's actual value proposition, or a generic one?
5. Are the colors doing something beyond following a trend — including the current one?
6. Do the visuals relate to the actual content, or decorate around it?

A design fails this test far more often than it fails a usability test, and it is the failure that makes work read as AI-generated.

### The card test

Before wrapping anything in a card, ask:

- Does this information need a bounded container?
- Does the container communicate grouping, interactivity or hierarchy that is not already obvious?
- Would typography, spacing, a rule, or the layout itself communicate the structure better?

Cards are the default answer to every layout problem and are usually the wrong one. A page where everything is a card has no hierarchy, because a container that surrounds everything distinguishes nothing.

### The decoration test

For each non-content visual element, name which of these it serves: brand, hierarchy, navigation, understanding, storytelling, interaction, trust, conversion, feedback.

If none applies, delete it. If the answer is "it fills the space", the layout is the problem.

### The chrome test

For each label, eyebrow, divider, glyph or marker that is not content: **would it survive a change of subject?** If the same eyebrow, the same middle-dot string and the same arrow would appear on a page about a different product, they are template chrome, not design. Remove them or make them specific.

---

## 5. Worked examples

`examples/before-after-hero.md` takes a hero that hits eleven first-generation tells and rebuilds it with the same framework and the same effort budget — and then shows the second-generation trap the first rebuild fell into.

`examples/before-after-admin.md` does the same for a Chinese-language order-operations screen: filter bar, grid, bulk actions, and the CJK typography that most rebuilds get wrong.
