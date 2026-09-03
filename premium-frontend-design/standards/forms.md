# Forms Standard

Forms are where a product either earns trust or loses it. In an ADMIN product the form is the second most important component after the data grid, and it is the one most often shipped as "some inputs in a column". This file is the contract a production form has to meet, framework-neutral: the rules are identical in React Hook Form, Vue + VeeValidate, Ant Design `Form`, Element Plus `el-form` or a plain `<form>`.

## Layout

**One column by default.** Multi-column forms make the eye zig-zag and break the tab order's relationship to the visual order. Go to two columns only for pairs that are semantically one thing — first / last name, city / postcode, start / end date — and keep them on one row.

**Width matches the expected input.** A postcode field as wide as an address field tells the user nothing about what goes in it. Size by content: 2-digit → ~6ch, date → ~12ch, email → ~30ch, free text → full width. Full-width everything is the default failure.

**Group, then section.** Related fields sit closer to each other than to unrelated ones (`standards/layout-typography.md` § proximity). Once a form exceeds one screen, give it information architecture: sections with headings, an accordion, tabs, a stepper, or side navigation with progress. An endless unstructured column is the most common admin form defect.

**Label placement by mode.**

| Mode | Placement | Why |
|---|---|---|
| Marketing, onboarding, mobile | Above the field | Fastest to scan, survives long labels and narrow screens |
| ADMIN with many short fields | Left-aligned label column (fixed width, right-aligned text is the 中后台 convention) | Vertical density — twice as many fields per screen |
| Inline edit, table cells | Visually hidden label, still in the DOM | Space; the label is the column header |

Never placeholder-as-label. It vanishes on the first keystroke and never existed for a screen reader.

**Actions.** Primary action at the end of the form, aligned with the fields' start edge (or the label column in a left-label layout), secondary action beside it and visibly quieter. Destructive actions separated from both. In a long form, the actions sit in a sticky footer so the user never scrolls to find "Save".

## The field anatomy

Every field has, in this order: label → optional description → control → helper or error text. Each piece has a job:

- **Label** — what the value is. Visible, associated with `for`/`id`, never removed.
- **Description** — the expectation, when it is not obvious ("Used for invoice delivery only").
- **Placeholder** — the *format*, never the instruction: `MM/YY`, `+86 138 0000 0000`. Placeholder contrast must still pass.
- **Helper text** — the rule, stated *before* the mistake ("At least 8 characters, one number").
- **Error** — what happened and the fix, replacing the helper text, not stacking under it.
- **Required / optional** — mark whichever is rarer on this form. Asterisks on every field communicate nothing.

## Validation timing

The rule that matters most: **do not shout at a user who has not finished.** Live validation while typing produces "Invalid email" after the first character.

| Moment | Behavior |
|---|---|
| While typing | Nothing, except lifting an existing error as soon as the input becomes valid |
| On blur | Validate this field; show the error if it fails |
| On submit | Validate everything; focus the first invalid field; show an error summary at the top of long forms |
| After first submit | Switch to validate-on-change for fields that have errored, so the user sees the fix land |

Server-side errors arrive after submit and must land on the field they belong to, not only in a toast. A toast that says "Validation failed" with no field highlighted is a defect.

## Accessibility contract

Each item is a defect people actually ship:

```html
<div class="field">
  <label for="email">Work email</label>
  <p id="email-desc">We send the invoice here.</p>
  <input id="email" type="email" inputmode="email" autocomplete="email"
         aria-describedby="email-desc email-err"
         aria-invalid="true" required>
  <p id="email-err" class="field-error" role="alert">Enter an email with an @ — "sam.chen" is missing the domain.</p>
</div>
```

- `aria-describedby` lists description **and** error ids. Screen readers read both; sighted users see both.
- `aria-invalid="true"` on the failing control, removed when it passes. Not `aria-invalid="false"` on every field.
- The error element is `role="alert"` on first appearance so it announces; **not** on the description.
- Groups of radios and checkboxes are a `<fieldset>` with a `<legend>`. A heading is not a legend.
- Error summary at the top of a long form: `role="alert"`, heading, a link per error that focuses the field.
- `required` (native) plus the visible marker; not one without the other.
- Disabled submit until valid is a defect: the user cannot learn *why* it is disabled. Enable it and validate on submit.

## Input types and attributes — free correctness

Native attributes fix mobile keyboards, autofill and validation without JavaScript. Missing them is the most common "it works on desktop" form bug.

| Field | `type` | `inputmode` | `autocomplete` |
|---|---|---|---|
| Email | `email` | `email` | `email` |
| Phone | `tel` | `tel` | `tel` |
| Numeric code (OTP, postcode) | `text` | `numeric` | `one-time-code` / `postal-code` |
| Amount, quantity | `text` | `decimal` / `numeric` | — |
| URL | `url` | `url` | `url` |
| Name | `text` | — | `name` / `given-name` / `family-name` |
| Password | `password` | — | `current-password` / `new-password` |
| Search | `search` | `search` | — |

Two traps:

- **`type="number"` is not for identifiers.** It strips leading zeros, allows `e`, and spins on scroll. Order numbers, phone numbers and postcodes are `type="text"` with `inputmode="numeric"`.
- **iOS zooms into any input whose font-size is below 16px.** Set inputs to `1rem` at the touch breakpoint, or the whole layout jumps on focus. `assets/app-shell-baseline.css` does this.

## Selects, dates, numbers

- A `<select>` with fewer than five options is usually a radio group — the options are then visible, which is the point.
- A select with more than ~15 options needs search (combobox). A select with hundreds needs async search and must show what is already chosen.
- Date input: a real date picker for choosing, but **typing must also work**, with the format shown as placeholder. Use `Intl` for display; store ISO.
- Number formatting is locale-dependent: `1,234.56` vs `1.234,56` vs `1 234,56`. Format on blur, parse on submit; never format while the user types.
- Currency and quantity inputs use `tabular-nums` and right-align in tables, left-align in forms.

## CJK: IME composition

This is the production bug every Chinese-language form eventually ships. A Chinese, Japanese or Korean user types through an IME: keystrokes produce candidate characters, and `Enter` **confirms the candidate**, it does not submit. If the form listens for `Enter` on `keydown`, it submits half-typed text; if a search box filters on every `input` event, it filters on the raw pinyin and flickers.

```js
// Ignore keys while an IME composition is in progress.
input.addEventListener('keydown', (e) => {
  if (e.isComposing || e.keyCode === 229) return;   // 229: Safari, older Chromium
  if (e.key === 'Enter') submit();
});

// Debounced search: do not fire mid-composition.
let composing = false;
input.addEventListener('compositionstart', () => { composing = true; });
input.addEventListener('compositionend', (e) => { composing = false; search(e.target.value); });
input.addEventListener('input', (e) => { if (!composing) search(e.target.value); });
```

In React, the same applies to `onKeyDown` (`e.nativeEvent.isComposing`) and controlled inputs that filter on `onChange`. Vue's `v-model` on text inputs already waits for `compositionend`; `v-model.lazy` or a manual `@input` handler does not.

Also for CJK forms: **maxLength counts code units, not characters** a user perceives — a limit of 10 lets a Chinese user type 10 characters but an emoji user 5. State limits in the user's unit and count with `Intl.Segmenter` or `[...str].length`.

## Autosave and unsaved changes

Decide explicitly, per form:

- **Autosave** where a partial save is harmless (drafts, settings, notes). Show the state: *Saving… → Saved 12:04 → Could not save, retrying*. Never autosave a form whose partial state could be acted on by someone else.
- **Unsaved-changes guard** where autosave is unsafe. `beforeunload` for the tab, a route guard for in-app navigation, and a dialog that names what is unsaved: "Discard changes to *Order SO-40881*?"
- **Never both**: a form that autosaves and also warns about unsaved changes has a bug in one of them.

## States

Beyond the field states, the form itself has: `idle`, `submitting` (controls disabled, button shows progress and keeps its width), `success` (say what happened and what is next — do not just clear the fields), `error` (server error lands on the field or on a summary; the submit re-enables), `read-only` (permission), `locked` (someone else is editing — show who).

`submitting` must keep the button's label width stable; a button that shrinks to a spinner shifts the layout on every submit.

## Checklist

- [ ] One column; paired fields only on shared rows
- [ ] Field widths match expected input
- [ ] Forms longer than a screen have sections or steps, and a sticky action footer
- [ ] Labels visible and associated; no placeholder-as-label
- [ ] Helper text states the rule before the error does
- [ ] Validation: on blur, then on submit; live only after a first error
- [ ] Submit focuses the first invalid field; long forms get an error summary
- [ ] `aria-describedby`, `aria-invalid`, `role="alert"` on errors; `fieldset`/`legend` on groups
- [ ] `type`, `inputmode`, `autocomplete` set; identifiers are not `type="number"`
- [ ] Inputs are ≥ 16px on touch devices
- [ ] `Enter` and live filtering ignore IME composition
- [ ] Autosave *or* unsaved-changes guard — chosen deliberately, not both
- [ ] `submitting` state keeps layout stable; `success` state says what is next
