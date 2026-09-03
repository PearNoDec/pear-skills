# Written Artifacts

Three optional formats, for when a written artifact genuinely helps: a brief before starting, a plan before a large build, a report after a review.

**Default to not producing these.** Paperwork the user did not ask for is cost without benefit, and a filled-in template is not evidence that the thinking happened. Use them when the user asks for one, when the work spans multiple sessions, or when a decision needs to be recorded for someone who is not in this conversation.

---

## 0 · Direction card — the one artifact that is not optional for T3/T4

Ten lines, written before code, reviewed against the brief, and shown to the user. This is not paperwork; it is the decision record that makes the review possible.

```
Mode:           SAAS marketing (public) + SAAS product (app)
Subject:        Freight visibility for mid-size importers; buyer is an ops lead, user is a dispatcher
Personality:    precise, calm, evidence-led — the product is about knowing, not about speed
Type:           one grotesque family; hierarchy from weight and measure, not a display face
Color roles:    stone neutrals (cool), one signal red for exceptions only, brand blue reserved for actions
Radius:         2 / 4 / 6 — small, because the product is an instrument
Type ratio:     ~1.25 — dense, because the app is tabular
Motion:         140 ms normal, 60 ms instant; one reveal on the marketing hero, none in the app
Neutral temp:   cool — screen, not paper
Signature:      the shipment timeline as real markup, recurring in hero, feature sections, footer, and the app's row detail
Density:        compact default in the app; user-selectable
Reviewed:       "one accent + serif + cream" rejected as the category default; timeline chosen because it is this product's own structure
```

If a line reads like the answer you would give any brief in this category, revise it before building.

---

## 1 · Project brief — before a substantial design task

**Product** — product/company · surface being designed · product mode · target audience · primary user goal · business goal

**Current problems** — the top three, ranked by impact rather than by ease of fixing

**Design direction** — visual personality · brand keywords · information density · motion intensity · primary layout strategy · signature visual idea

For the four decisions that carry the most identity — radius scale, type ratio, motion duration, neutral temperature — state a position and a reason. See `standards/design-system.md`.

**Technical context** — framework · styling system · existing component library · existing animation library · constraints

**Success criteria** — what the user should understand · what they should be able to do · how the brand should feel · the performance and accessibility requirement

---

## 2 · Implementation plan — before a large build

**Mode** — selected mode, and why

**Highest-impact problems** — ranked. If the top three are all cosmetic, the audit was too shallow.

**Structural changes** — information architecture · navigation · layout · content hierarchy

**Design-system changes** — colors · typography · spacing · radius · icons · components. Note explicitly whether this extends an existing token layer or establishes a new one.

**Interaction changes** — motion · hover and focus · loading · empty · error

**Responsive strategy** — desktop · tablet · mobile, with the small-screen strategy for any data table named explicitly

**Accessibility** — keyboard · focus · semantics · contrast · reduced motion

**Performance** — media · fonts (including CJK subsetting, if applicable) · animation · JS and dependency impact

**Validation** — run `workflow/design-review.md` before completion

---

## 3 · Design review report — after a review

**Overall** — mode · current quality · target quality

**Critical issues** — for each: the issue, its impact, the recommendation. Ranked.

**By dimension** — visual system (typography, spacing, color, grid, iconography, brand distinction) · UX (navigation, actions, forms, states, data presentation) · responsive · accessibility · performance

**Verification status** — what was rendered and confirmed, and what was not. Do not describe an unverified property as working; see `workflow/browser-verification.md`.

**Priority** — P0 / P1 / P2
