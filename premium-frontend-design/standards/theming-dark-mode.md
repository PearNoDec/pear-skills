# Theming and Dark Mode Standard

Dark mode is not an inverted stylesheet. It is a second complete design that shares one semantic token layer.

Role definitions and the dark-mode override pattern: `assets/tokens.schema.css`.

## When dark mode is required

- **ADMIN / operations tools**: effectively mandatory. Operators sit in these products for eight hours.
- **SaaS product surfaces**: expected. Developer tools especially.
- **Corporate and marketing sites**: optional. A single well-executed theme beats two mediocre ones. Do not ship a half-finished dark mode to look thorough.

Decide before building. Retrofitting a theme onto hard-coded colors is one of the most expensive frontend refactors there is.

## The rule that makes theming possible

Components reference **semantic roles**, never primitives and never raw values.

```css
/* Wrong — the component now knows about brand values */
.card { background: #ffffff; border: 1px solid #e0e2e6; }

/* Right — the component knows about roles */
.card { background: var(--surface); border: 1px solid var(--border); }
```

If a component needs a color with no semantic name, the system is missing a role. Add the role.

## Depth works differently in the dark

In light mode, elevation comes from shadow. On a dark background a shadow is nearly invisible, so elevation must come from **surface lightness** instead.

| | Light | Dark |
|---|---|---|
| Base page | `--background` white | `--background` near-black |
| Resting card | Same as page + border | **Lighter** than page |
| Elevated (dialog, popover) | Same + stronger shadow | **Lighter still** |
| Shadow role | Primary depth signal | Cast shadow on overlays only |

Layering shadows harder in dark mode produces muddy grey smears. Raise the surface instead.

## Colors that must be re-tuned, not inverted

**Never pure black or pure white.** `#000` backgrounds with `#fff` text cause halation — the text appears to vibrate. Use a near-black around `#0d0e11` and a near-white around `#eeeff1`.

**Saturated brand colors get lighter, not darker.** A brand blue that reads confidently on white will vibrate and look neon on near-black. In dark mode, step *up* the ramp: light mode uses `--brand-500`, dark mode uses `--brand-300`.

**Status colors need their own dark values.** A success green tuned for a white background usually fails contrast on a dark one. Mix the hue into the dark surface rather than reusing the light-mode subtle tone:

```css
--success-subtle: color-mix(in oklab, var(--green-500) 20%, var(--neutral-900));
```

**Images and illustrations need a plan.** Screenshots of a light UI on a dark page look like holes. Provide a dark asset, or a container with a light-neutral inset frame that reads as intentional.

## Contrast must be verified in both themes

Passing in light mode says nothing about dark mode. Muted text is where this fails most often — a grey that is 4.6:1 on white is frequently below 4.5:1 when the relationship inverts.

Verify: body text, muted text, placeholder text, disabled text, link color, text on brand-colored buttons, status badges, borders that carry meaning, focus ring against every surface it can land on.

## Implementation

Use a `data-theme` attribute or a class on the root, plus `color-scheme` so native form controls, scrollbars and the caret follow.

```css
:root { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
```

Honor `prefers-color-scheme` as the default, and let an explicit user choice override it. Persist the choice, and apply it **before first paint** or the user sees a white flash on every load. That flash is the most-reported dark-mode bug and it is entirely an ordering problem: the server does not know the user's stored preference, so anything that waits for hydration is already too late.

The fix is a synchronous inline script that runs before the body paints. In a Next.js App Router layout it goes in `<head>`, and it must be `beforeInteractive` or a raw `<script>` — a normal `<Script>` or a `useEffect` both run after the first paint and do nothing for the flash.

```tsx
// app/layout.tsx — suppressHydrationWarning is required, because this script
// mutates <html> before React attaches and the markup will not match.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t = localStorage.getItem('theme');
              if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.dataset.theme = t;
              document.documentElement.style.colorScheme = t;
            }catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Three details this depends on, each of which is a separate bug when missed:

- **`suppressHydrationWarning` on `<html>`,** or React logs a mismatch on every load.
- **Set `colorScheme` in the same script,** not only in CSS — native form controls, scrollbars and the caret follow the property, and they flash independently of your backgrounds.
- **Wrap in `try/catch`.** `localStorage` throws in Safari private mode and in sandboxed iframes, and an uncaught throw here blocks the rest of the document.

Set `<meta name="theme-color">` per theme so the mobile browser chrome matches.

The same script for Nuxt, Vite SPAs, Astro and plain HTML — and what it must additionally set for shadcn (`.dark`), Element Plus (`html.dark`) and Arco (`arco-theme`) — is in `standards/stack-adapters.md` § the theme script. Charts need their own dark values: `standards/data-visualization.md`.

## Beyond light and dark

If the product also needs a high-contrast theme, brand-tenant theming or per-workspace accent colors, the same token layer carries all of them. This is the payoff for keeping components on semantic roles — a new theme is a new block of variable declarations, not a component refactor.

Also support `forced-colors` mode, where the OS replaces the palette entirely. See `assets/a11y-baseline.css`.
