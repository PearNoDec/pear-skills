# Media, Loading and Discoverability Standard

For CORPORATE and SAAS-marketing surfaces, the page is judged by search engines and link previews before a human sees it, and by the first paint before they read it. This file is the engineering that makes a public page production-grade: how media loads, what the document says about itself, and what must be in the HTML rather than in the JavaScript.

## Images

The LCP element on most marketing pages is an image. Get these right and most of the performance budget takes care of itself:

```html
<!-- Hero: eager, high priority, sized, modern format with fallback. -->
<picture>
  <source type="image/avif" srcset="/hero-800.avif 800w, /hero-1600.avif 1600w, /hero-2400.avif 2400w">
  <source type="image/webp" srcset="/hero-800.webp 800w, /hero-1600.webp 1600w, /hero-2400.webp 2400w">
  <img src="/hero-1600.jpg" srcset="/hero-800.jpg 800w, /hero-1600.jpg 1600w, /hero-2400.jpg 2400w"
       sizes="(min-width: 1024px) 60vw, 100vw"
       width="1600" height="1000"
       alt="Order timeline showing a delay detected 31 hours before the customer email"
       fetchpriority="high" decoding="async">
</picture>

<!-- Everything below the fold: lazy, still sized. -->
<img src="…" width="1200" height="800" loading="lazy" decoding="async" alt="…">
```

- `width` and `height` (or `aspect-ratio` in CSS) on **every** image, or the page shifts as each one loads. This is the single largest CLS cause.
- `fetchpriority="high"` on the LCP image, and **only** on it. `loading="lazy"` never on the hero — a lazy hero is a slow hero.
- `sizes` must match the layout. `sizes="100vw"` on an image that renders at 400px downloads four times the pixels.
- `alt` describes what the image *shows in context*, or is empty (`alt=""`) for decoration. `alt="hero image"` and `alt="Dashboard"` are worse than empty.
- Framework image components (`next/image`, `nuxt/image`, `@unpic/*`) do the resizing and format negotiation — use them, and still set `priority` / `fetchpriority` on the hero and `sizes` everywhere.
- Art-direct with `<picture media="…">` when the mobile crop is a different image, not a squashed one.
- SVG for logos, icons and diagrams; never rasterize them. Inline SVG for anything that changes color with the theme.
- Screenshots of a light UI on a dark page need a dark asset or an inset frame (`standards/theming-dark-mode.md`).

## Video and animation

- Background video: `muted playsinline autoplay loop preload="metadata"` with a `poster` that is the LCP-quality first frame. Under `prefers-reduced-motion` and on `(prefers-reduced-data)`, show the poster only. Cap at ~1.5 MB per 10 seconds; if the video is the product, it deserves a click, not autoplay.
- Product demos: real screen recordings, not renders. Show controls; do not loop a 40-second demo silently.
- Lottie / animated SVG for illustration only when the motion explains something; a 400 KB Lottie for a decorative blob is the wrong trade.
- Anything WebGL / Canvas / 3D: a static fallback image at the same size, rendered first; the effect enhances it. The CTA is never inside the canvas.

## Fonts

- Self-host; `font-display: swap`; `<link rel="preload" as="font" crossorigin>` for the one or two faces used above the fold — not for six weights.
- Subset. Latin subsets are ~20–40 KB per weight; a full CJK face is 3–10 MB and must be split by `unicode-range` (`standards/cjk-typography.md`).
- Variable fonts collapse multiple weights into one file; use one if the family offers it.
- Match fallback metrics (`size-adjust`, `ascent-override`) so the swap from system font to webfont does not shift layout — or use the system stack and skip the problem.

## The critical path

Order of the first bytes, and why each is where it is:

1. `<meta charset>`, `<meta name="viewport">` — before any content.
2. The theme script (`standards/theming-dark-mode.md`) — before any paint, or the flash happens.
3. Critical CSS — inline for the above-the-fold layout on a marketing page; a single stylesheet `<link>` for a product.
4. Font preloads — the hero faces only.
5. `<link rel="preconnect">` to the one or two origins the page will fetch from (image CDN, analytics).
6. Content.
7. Scripts: `type="module"` (deferred by default) or `defer`. Nothing synchronous in `<head>` except the theme script.

Above-the-fold content must be in the HTML. A hero that is rendered client-side after a JS bundle is a hero that search engines and link previews may never see and that users see late.

## Document metadata

Every public page, in the HTML (server-rendered or static), not injected after load:

```html
<title>Freight visibility for 40+ carriers — Company</title>        <!-- unique per page, ≤ 60 chars -->
<meta name="description" content="…">                                <!-- specific, ≤ 155 chars, written for a human -->
<link rel="canonical" href="https://example.com/product">
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/product">
<link rel="alternate" hreflang="en" href="https://example.com/product">
<meta property="og:title" content="…"> <meta property="og:description" content="…">
<meta property="og:image" content="https://example.com/og/product.png">   <!-- 1200×630, absolute URL, real image -->
<meta property="og:type" content="website"> <meta property="og:url" content="…">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#…" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#…" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

- The OG image is designed, not a screenshot of the hero at the wrong ratio. One template per page type, with the page's real title.
- `<html lang="zh-CN">` (or `en`, `ja`) — it drives hyphenation, `:lang()` rules, font fallback and screen-reader pronunciation. A CJK site with `lang="en"` renders CJK punctuation with the wrong font.
- Structured data (`application/ld+json`): `Organization` on the home page, `Product` / `SoftwareApplication` on product pages, `FAQPage` where there is a real FAQ, `BreadcrumbList` on deep pages. Only claims that are true and visible on the page.

## Document structure

The heading outline is the page's table of contents to a machine:

- Exactly one `<h1>`, and it is the page's claim — not the company name, not "Welcome".
- Levels do not skip. `h2` for sections, `h3` inside them. Visual size is set by CSS, not by choosing `h4` because it is smaller.
- Landmarks: `<header>`, `<nav aria-label>`, `<main>`, `<footer>`, `<aside>` where a sidebar exists. One `<main>`.
- Links have destinations in their text: "See pricing", not "Click here". A link that opens a new tab says so (`aria-label` or visible icon) and uses `rel="noopener"`.
- The 404 page exists, is styled, and offers a way back. It is part of the site.

## What to measure

For a marketing page, run Lighthouse or a trace (`workflow/browser-verification.md` §9) and look at exactly these:

| Metric | Target | Usual cause when missed |
|---|---|---|
| LCP | < 2.5 s | Unoptimized hero, lazy hero, client-rendered hero, render-blocking font |
| CLS | < 0.1 | Images without dimensions, font swap without metric override, late-injected banners |
| INP | < 200 ms | Heavy hydration, scroll listeners doing layout, animation on `filter`/`box-shadow` |
| Transfer | < 1 MB for the first view | Unsubsetted CJK font, 2 MB PNG, an animation library for one fade |

Fix what is disproportionate. A 2 MB hero is worth fixing; a 30 ms difference is not.

## Checklist

- [ ] Every image has dimensions; hero has `fetchpriority="high"` and is not lazy; `sizes` matches layout
- [ ] Modern formats with fallback; SVG for vector; dark-mode plan for screenshots
- [ ] Background video has a poster, is muted/playsinline, and yields to reduced motion / data
- [ ] Fonts self-hosted, subset, swapped, preloaded only above the fold
- [ ] Theme script first; nothing render-blocking after it except critical CSS
- [ ] Above-the-fold content is in the HTML
- [ ] Unique `<title>` and description; canonical; hreflang where multilingual; OG image designed at 1200×630
- [ ] `<html lang>` correct for the page's language
- [ ] One `h1`, no skipped levels, landmarks present
- [ ] Structured data only for true, visible claims
- [ ] 404 exists and is styled
- [ ] LCP / CLS / INP / transfer measured, and the disproportionate item fixed
