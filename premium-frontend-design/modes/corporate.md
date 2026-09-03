# Corporate / Enterprise Website Mode

## Mission

Brand authority, business clarity, trust and conversion, simultaneously. The site may be visually ambitious, but a visitor must still understand the company quickly.

## The five-second test drives the section set

Within roughly five seconds the page must communicate: **what this company is · what it provides · its differentiated value · why it is credible · what to do next.**

Build the page by assigning each of those five to a section, then stop. Sections beyond that set need to earn their place by answering a question a real visitor is actually asking.

| The visitor asks | Candidate sections |
|---|---|
| What is this? | Hero, brand statement |
| What do you provide? | Core value, product/company introduction, solutions, capabilities |
| Why is it different? | Technology, differentiators, product showcase |
| Why should I believe you? | Metrics, customers, case studies, certifications, security, media |
| What now? | Final CTA, contact path, footer |

A corporate site typically needs **six to nine** sections, not eighteen. If two sections answer the same question, merge them — the duplicate is usually a feature grid that exists because a template had one.

## Hero

The hero is a brand stage, not a template slot. Whatever form it takes, it must carry a clear brand or value statement, useful supporting context, a primary CTA, and — if there is a secondary CTA at all — a visibly lower-priority one.

Choose the form from what the company actually has: oversized editorial typography, a full-screen product visualization, an animated brand graphic, cinematic media, an interactive data visualization, a spatial or layered composition, a product-in-context shot. Pick based on which asset is genuinely strong. A company with no compelling visual asset should use typography, not a stock photograph.

The defaults to avoid — text-left/mockup-right, centered headline over a gradient blob, "future of X" over stock imagery — and what to do instead are in `standards/anti-patterns.md`.

## Brand signature

Establish **one to three** recurring visual signatures that continue past the hero: a typographic treatment, a grid, a shape language, an image-cropping rule, a motion grammar, a line system, a data-visualization grammar.

The test is recurrence. A treatment used once in the hero is a decoration; the same treatment appearing in the hero, a case study and the footer is an identity. `standards/anti-patterns.md` § *Where a signature actually comes from* covers how to find one that a competitor could not also use.

## Editorial composition

Corporate pages can borrow from high-end editorial design, architecture publications, annual reports and technology launch sites — strong type-scale contrast, asymmetry, large whitespace, full-bleed media, text/image overlap, sticky storytelling, large numeric typography, section indexing.

The constraint that makes it work: **vary the rhythm.** A long page where every section is a centered heading over a three-column grid has no pacing, regardless of how good the individual sections are. Change width, density, alignment, background and media scale between sections. See `standards/layout-typography.md`.

## Trust

Trust is designed, not dumped. The rule is placement: **evidence sits adjacent to the claim it supports.** A logo wall at the bottom of the page proves nothing about the capability described at the top.

Choose signals the company can actually substantiate — customers, partners, quantified outcomes, case studies, certifications, security standards, media coverage, history, scale. Never invent one; if the user has not supplied it, mark the slot and say so.

**Metrics are editorial content.** Two or three numbers with context beat six stat cards. "98% retention" is decoration; "98% net revenue retention across 340 enterprise accounts, FY2025" is evidence.

**Case studies work as narrative,** not as cards: problem → solution → result, a metric-led outcome, a before/after, or a sticky visual with scrolling text.

## Navigation and footer

Desktop may use a mega menu for a genuinely complex organization — product groups with one-line descriptions, featured resources, a clear CTA. On mobile, redesign the hierarchy rather than shrinking the desktop menu into an accordion.

Treat the footer as a final brand chapter rather than a sitemap dump: a brand statement, the navigation that matters, legal and regional information, and often a large closing typographic or graphic element.

## Engineering the public page

A corporate page is judged by crawlers and link previews before a person reads it. Responsive images with dimensions, the LCP hero, the critical path, `<title>` / description / OG image / `hreflang`, one `h1`, structured data: `standards/media-seo.md`. A page that looks finished and ships a 2 MB PNG hero with no `alt` is not finished.

## Motion

Corporate pages tolerate higher motion intensity than application surfaces — hero and typographic reveals, image masks, scroll storytelling, section transitions, controlled parallax. It should read as refined, not as a technical demo. Set intensity from the tokens rather than per-component; see `standards/motion-interaction.md`.

## Worked example

> **Brief:** "Redesign our cybersecurity company's homepage. It looks generic; we want it to feel enterprise-grade."
>
> **Mode:** CORPORATE with technology-product characteristics.
> **Direction:** authoritative, precise, technical. Medium density, medium motion.
> **Hero:** strong typography plus a live security-network visualization — move 1 from the signature list, using the product's own data structure.
> **Signature:** a scanning-line/grid system recurring in the hero, the architecture section and the footer.
> **Trust:** compliance marks and customer scale placed next to the specific claims they support, not in a bottom logo wall.
> **Rhythm:** hero → proof → problem landscape → solution architecture → product visualization → outcomes → customer story → security standards → CTA → branded footer.
>
> Rejected: hacker stock imagery, neon-green-on-black, repeated three-column security cards, futuristic slogans with no concrete value.
