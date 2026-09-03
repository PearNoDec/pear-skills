# Example — Before / After: A Generic Hero

The mode files describe *direction*. This one shows the actual difference, because "avoid generic AI aesthetics" only becomes useful when you can see what changes.

Subject: the hero of a B2B logistics-visibility product. Mode: **SAAS marketing**.

---

## Before

The default output. Nothing here is broken; that is the problem.

```html
<section class="bg-gradient-to-br from-purple-600 to-blue-500 py-24 text-center">
  <div class="mx-auto max-w-4xl px-4">
    <span class="mb-4 inline-block rounded-full bg-white/20 px-4 py-1
                 text-sm text-white backdrop-blur-md">
      ✨ Powered by AI
    </span>
    <h1 class="mb-6 text-5xl font-bold text-white">
      Empower Your Supply Chain
    </h1>
    <p class="mx-auto mb-8 max-w-2xl text-xl text-white/80">
      Seamlessly transform your logistics operations with our cutting-edge
      platform. Unlock powerful insights and take your business to the
      next level.
    </p>
    <div class="flex justify-center gap-4">
      <button class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500
                     px-8 py-3 font-semibold text-white">
        Get Started
      </button>
      <button class="rounded-full border border-white/30 bg-white/10 px-8 py-3
                     text-white backdrop-blur-md">
        Learn More
      </button>
    </div>
  </div>
  <div class="mt-16 rounded-3xl bg-white/10 p-8 backdrop-blur-xl">
    <img src="/dashboard-mockup.png" alt="Dashboard" />
  </div>
</section>
```

### What is actually wrong

| Problem | Reference |
|---|---|
| Purple-blue gradient with no brand basis | `standards/anti-patterns.md` |
| Emoji used as UI iconography | `SKILL.md` §7.2 |
| Badge that carries no information | `standards/anti-patterns.md` |
| "Empower / seamlessly / cutting-edge / unlock / next level" — five banned words in two sentences | `standards/content-copy.md` |
| The headline could belong to any logistics company, or any company | `SKILL.md` §7.3 |
| Nothing says what the product does | `modes/saas.md` |
| Everything centered, everything a pill, everything glassy | `standards/anti-patterns.md` |
| Gradient button — decoration standing in for hierarchy | `standards/anti-patterns.md` |
| "Get Started" / "Learn More" — outcome-free labels | `standards/content-copy.md` |
| Generic screenshot in a floating glass card | `modes/saas.md` |
| `alt="Dashboard"` — no information | `standards/responsive-accessibility-performance.md` |
| Hard-coded utility colors, no token layer | `standards/design-system.md` |
| Would pass `scripts/lint-design.mjs`? No — 9 errors before a human looks at it | `scripts/` |

The specificity test: swap "Supply Chain" for "Marketing Workflow" and this hero ships unchanged for a different company in a different industry. That is the failure.

---

## After

Same component, same framework, same effort budget.

```html
<!--
  Direction: this product's value is that a shipment stops being a black box.
  The hero states the actual number, and the signature visual is a timeline —
  the product's own data structure, used as the brand element. That timeline
  then recurs in the feature sections, the case study and the footer.
-->
<section class="border-b border-[var(--border)] bg-[var(--background)]">
  <div class="mx-auto grid max-w-[var(--container-max)] gap-[var(--space-7)]
              px-[var(--gutter)] py-[var(--section-y)]
              lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">

    <!-- Left: the claim. Left-aligned, because it is longer than two lines. -->
    <div>
      <!--
        No eyebrow. The first draft had "FREIGHT VISIBILITY · 40+ CARRIERS" in
        tracked small caps above the headline — that is template chrome
        (standards/anti-patterns.md §2). The carrier count belongs in the
        sentence where it means something, so it moved to the subhead.

        Fluid display type from the token scale. text-wrap:balance stops the
        headline from leaving an orphan word at any width. The whole headline
        is one color: highlighting the second half in grey was the "accent one
        phrase" tell, and it was doing the work a stronger sentence should do.
      -->
      <h1 class="text-[length:var(--text-display)] font-[var(--weight-semibold)]
                 leading-[var(--leading-tight)]
                 tracking-[var(--tracking-tight)] text-[var(--foreground)]
                 [text-wrap:balance]">
        Know where the container is before the customer asks.
      </h1>

      <!-- The mechanism, not adjectives. Measure constrained for readability. -->
      <p class="mt-[var(--space-5)] max-w-[52ch]
                text-[length:var(--text-body)] leading-[var(--leading-normal)]
                text-[var(--foreground-secondary)]">
        We pull directly from 40+ carriers' EDI feeds, port terminals and
        telematics, then reconcile the conflicts. Median delay detection:
        <strong class="font-[var(--weight-semibold)] text-[var(--foreground)]
                       [font-variant-numeric:tabular-nums]">
          31 hours
        </strong>
        earlier than a customer email.
      </p>

      <!-- Outcome-labeled actions with real hierarchy: one solid, one quiet. -->
      <div class="mt-[var(--space-6)] flex flex-wrap items-center
                  gap-[var(--space-3)]">
        <a href="/trial"
           class="inline-flex h-[var(--control-h-lg)] items-center
                  rounded-[var(--radius-md)] bg-[var(--primary)]
                  px-[var(--space-5)] font-[var(--weight-medium)]
                  text-[var(--primary-foreground)]
                  transition-colors duration-[var(--duration-instant)]
                  hover:bg-[var(--primary-hover)]
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[var(--ring)]">
          Track a live shipment
        </a>
        <a href="/how-it-works"
           class="inline-flex h-[var(--control-h-lg)] items-center gap-2
                  rounded-[var(--radius-md)] px-[var(--space-4)]
                  text-[var(--foreground-secondary)]
                  transition-colors duration-[var(--duration-instant)]
                  hover:text-[var(--foreground)]
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[var(--ring)]">
          See how the data is sourced
          <!-- Lucide arrow-right; mirrors correctly under RTL. -->
          <svg class="size-4 rtl:-scale-x-100" aria-hidden="true"><!-- … --></svg>
        </a>
      </div>
    </div>

    <!--
      Right: the signature visual. Not a screenshot in a glass card — the
      product's own timeline structure, rendered as real markup so it is
      readable, translatable, responsive and indexable.
    -->
    <div class="relative">
      <ol class="space-y-0 border-l border-[var(--border)] ps-[var(--space-5)]">
        <li class="relative pb-[var(--space-5)]">
          <span class="absolute -start-[calc(var(--space-5)+4px)] top-1.5
                       size-2 rounded-full bg-[var(--success)]"></span>
          <p class="text-[length:var(--text-label)] text-[var(--muted-foreground)]
                    [font-variant-numeric:tabular-nums]">
            <time datetime="2026-03-04T06:12">Mar 4, 06:12</time>
          </p>
          <p class="text-[length:var(--text-body-sm)] text-[var(--foreground)]">
            Departed Ningbo on <span class="text-[var(--muted-foreground)]">MSC Isabella</span>
          </p>
        </li>
        <li class="relative pb-[var(--space-5)]">
          <span class="absolute -start-[calc(var(--space-5)+4px)] top-1.5
                       size-2 rounded-full bg-[var(--warning)]"></span>
          <p class="text-[length:var(--text-label)] text-[var(--muted-foreground)]
                    [font-variant-numeric:tabular-nums]">
            <time datetime="2026-03-19T14:40">Mar 19, 14:40</time>
          </p>
          <p class="text-[length:var(--text-body-sm)] text-[var(--foreground)]">
            Berth congestion at Rotterdam
          </p>
          <!-- Status is not carried by color alone. -->
          <p class="text-[length:var(--text-label)] text-[var(--warning-foreground)]">
            ETA slipped 2 days; customer notified automatically
          </p>
        </li>
        <li class="relative">
          <span class="absolute -start-[calc(var(--space-5)+4px)] top-1.5
                       size-2 rounded-full border border-[var(--border-strong)]
                       bg-[var(--background)]"></span>
          <p class="text-[length:var(--text-label)] text-[var(--muted-foreground)]
                    [font-variant-numeric:tabular-nums]">
            <time datetime="2026-03-27">Mar 27, projected</time>
          </p>
          <p class="text-[length:var(--text-body-sm)] text-[var(--muted-foreground)]">
            Arrival Felixstowe
          </p>
        </li>
      </ol>
    </div>
  </div>
</section>
```

### What changed, and why it matters

**Copy carries the product.** The headline names the customer's actual fear. The subhead names the mechanism and a real number with context. Neither sentence could be lifted onto a competitor's site.

**The signature visual is the product's own data structure.** A shipment timeline, not a screenshot. It recurs across the site as the brand element — which is what "1–3 recurring signature visuals" in `modes/corporate.md` means in practice. Because it is real markup rather than a PNG, it is responsive, translatable, indexable and accessible for free.

**Hierarchy comes from structure, not decoration.** An asymmetric 7:5 grid instead of centered stacking. One solid primary action, one quiet secondary. No gradient doing the work that contrast should do.

**Everything references tokens.** The same file works in dark mode with no changes, and a density or brand change is a variable edit rather than a component edit.

**The details that mark the difference between "works" and "finished":** `tabular-nums` on the timestamps so they align, `[text-wrap:balance]` so the headline never orphans a word, `ps-*` and `-start-*` logical properties so RTL works, a real `<time datetime>` for machines, `rtl:-scale-x-100` on the directional icon, a focus ring on both actions, and warning state communicated by text as well as color.

None of this cost more effort than the "before". It cost different decisions.

---

## The second trap

The first rebuild of this hero was not the one above. It looked like this, and it read as art-directed for about a week:

```html
<p class="uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
  <span class="h-px w-8 bg-[var(--border-strong)]"></span>
  Freight visibility · 40+ carriers
</p>
<h1>Know where the container is
  <span class="text-[var(--muted-foreground)]">before the customer asks.</span></h1>
…
<time>Mar 4 · 06:12</time>
```

Tracked small caps with a hairline. A middle-dot meta string. Half the headline dimmed for "emphasis". Timestamps joined with dots. Each of those was chosen to avoid the purple gradient — and each is now on the list in `standards/anti-patterns.md` §2, because every generated page that avoids the purple gradient arrives at exactly these four moves.

The fix was to ask, for each piece of chrome, *would this survive a change of subject?* The eyebrow would. The dimmed phrase would. The dots would. So they went, and the information they carried — the carrier count — moved into a sentence where it does work. What remains is specific to this product: the number, the timeline, the vessel name, the reconciled feeds.

That is the test to run on your own rebuild before calling it finished.
