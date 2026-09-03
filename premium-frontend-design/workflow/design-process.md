# Frontend Design and Implementation Workflow

Execution **order** for T3 and T4 work. It deliberately does not restate requirements — each phase points at the file that owns them. If you find yourself reading a requirement list here, it has drifted; the list belongs in `standards/`.

## 1 · Context

Product type, audience, business objective, primary user task, existing brand direction, stack, existing component system, constraints. **Inspect the codebase rather than assuming its structure** — see `SKILL.md` §6 for what must not be broken, and `standards/stack-adapters.md` § detect for what to read and in what order. State the stack you found before proposing anything.

If the brief does not say what the product is or who it is for, decide a concrete answer, say it, and confirm with the user before designing. Distinctive choices come from the subject — its industry, its materials, its vocabulary — and a design made without a subject is a template by definition.

## 2 · Mode

Classify per `SKILL.md` §4 and state the choice. Record the priority order it implies, and note the surfaces if the product is hybrid.

## 3 · Audit

Rank the current experience by impact, not by ease of fixing. Look at value-proposition clarity, information architecture, hierarchy, brand distinctiveness, navigation, CTA priority, repeated layout patterns, state completeness — then responsive, accessibility and performance.

Output an ordered list. The top three items should be structural; if they are all cosmetic, the audit was too shallow.

## 4 · Direction

Define a compact direction **before** touching implementation. Ten decisions, each stated in one line:

mode · visual personality · type direction · color roles · grid behavior · radius philosophy · surface & border philosophy · signature visual language · motion intensity · information density

The four that carry the most identity — radius, type ratio, motion duration, neutral temperature — are discussed in `standards/design-system.md`. Choose a position on each and be able to say why. A direction that is a list of fashionable effects is not a direction.

**Then review the direction against the brief before building.** For each line, ask: *would I have written roughly this for a different brief in the same category?* If yes, that line came from the category, not the brief — revise it and say what changed. This is the step that catches the second-generation tells (`standards/anti-patterns.md` §2) before they are in code, where they are ten times more expensive to remove. Write the direction down in the compact form in `templates/artifacts.md` § direction card — ten lines, not a document.

## 5 · Information architecture

Fix structure before any visual polish: main message, content sequence, navigation hierarchy, primary and secondary actions, trust placement, product explanation, workflow hierarchy, critical states.

**This is the phase most redesigns skip, and skipping it is why they fail.** Decorative work on a weak IA produces an attractive page that does not work.

## 6 · Design system

Establish or extend the token layer — `assets/tokens.schema.css`, then `standards/design-system.md`, mapped onto the host stack per `standards/stack-adapters.md`. Load `assets/a11y-baseline.css`, and for product surfaces `assets/app-shell-baseline.css`. Normalize tokens, typography, spacing, radius, surfaces, buttons, forms, navigation, icons and motion before building components.

For a CJK product, set leading, weights and font stack from `standards/cjk-typography.md` at this point. Retrofitting them later means re-checking every layout.

## 7 · Implementation

In this order, because each step constrains the next:

1. Structure and semantic markup
2. Layout and responsive rules
3. Typography
4. Core components — data grid (`standards/data-grid.md`), forms (`standards/forms.md`), overlays and navigation (`standards/overlays-navigation.md`), charts (`standards/data-visualization.md`), the shell (`standards/app-shell.md`), each against its contract
5. Content hierarchy — real copy, per `standards/content-copy.md`
6. All states, not the happy path
7. Visual signatures
8. Motion
9. Polish

Never start at step 7 while step 1 is still weak. Run `scripts/lint-design.mjs` (with `--cjk` for a CJK product) after step 4 and again after step 9; it is cheap and it catches the mechanical defects before the review has to.

## 8 · Quality passes

Run these against the sections of `workflow/design-review.md` that own them, rather than working from memory:

| Pass | Checklist section | Reference |
|---|---|---|
| Responsive | *Responsive* | `standards/responsive-accessibility-performance.md`, `standards/app-shell.md` |
| Internationalization | *Internationalization* | same file, plus `standards/cjk-typography.md` |
| Accessibility | *Accessibility* | `assets/a11y-baseline.css`, the contracts in `standards/forms.md` and `standards/overlays-navigation.md` |
| Performance | *Performance* | `standards/media-seo.md` for public pages |
| Discoverability | *Document* | `standards/media-seo.md` — public pages only |

## 9 · Browser verification

Render it and look at it. Screenshot every breakpoint, read the console, walk the keyboard path, check both themes, force the non-happy states into view.

`scripts/verify-browser.mjs <url>` produces the screenshots, the overflow report, the console log, the heading outline, the focus-visibility walk and lab LCP/CLS as files. It does not judge the design — open the screenshots. Procedure and per-tier minimums: `workflow/browser-verification.md`. Work that was never rendered is reported as **unverified**.

## 10 · Design review

Run `workflow/design-review.md` in full. Items marked **[V]** require evidence from phase 9.

## 11 · Final polish

Inspect at real viewport sizes, not isolated components. Hunt the small inconsistencies that make an otherwise good product feel unfinished:

- 1px misalignments; borders that double up where two bordered elements meet
- Inconsistent spacing, radius or control heights between components that sit side by side
- Icon baselines that sit above or below the text they accompany; icon stroke weight that does not match the text weight
- Awkward wraps: a heading that orphans one word, a button label on two lines, a truncated value with no full-value path
- Weak CTA hierarchy — two buttons of equal weight
- Numbers that do not align in a column; currency without `tabular-nums`
- Focus rings clipped by an `overflow: hidden` ancestor
- Layout shift on load — fonts, images, late banners, skeletons that are the wrong height
- The scrollbar appearing and shifting content; the page jumping when a modal opens
- z-index conflicts, sticky overlap, a dropdown behind the header
- Browser-default `::selection` blue, default focus ring color, default form control styling in one place and custom in another
- Text set against the very edge of its container
- Dark mode: a border that vanished, a shadow that became a smear, a screenshot that became a hole

Then remove one thing. A finished screen has nothing left that was added for safety.
