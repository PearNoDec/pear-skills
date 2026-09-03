# Content and Copy Standard

Copy is the fastest tell that an interface was generated rather than designed. A page can have flawless typography, a custom grid and a signature visual, and still read as template output because the headline says "Empower your workflow with AI".

Visual polish cannot rescue empty copy. Treat text as a design material.

## Never ship placeholder text

No `lorem ipsum`. No "Feature One / Feature Two / Feature Three". No `[Company Name]`. No invented statistics.

If the real content is unknown, write **plausible specific** content for the actual business and flag it clearly as needing review. "Cut invoice reconciliation from 3 days to 4 hours" is a useful placeholder. "Streamline your business processes" is not, because nobody will ever notice it needs replacing.

## Banned vocabulary

These words survive in a draft because they sound like business writing while committing to nothing:

> empower · revolutionize · seamless · unlock · elevate · supercharge · unleash · transform your workflow · take it to the next level · game-changing · cutting-edge · best-in-class · robust · leverage · harness the power of · reimagine · effortlessly · in seconds · the future of X

The Chinese list is shorter and worse, because these words are on every 官网 already:

> 赋能 · 一站式 · 全方位 · 极致 · 无缝 · 颠覆 · 引领 · 行业领先 · 助力 · 重新定义 · 智能化升级 · 开启新时代 · 让…更简单

The test: **could a competitor put this sentence on their site unchanged?** If yes, it says nothing. `scripts/lint-design.mjs` flags both lists.

| Instead of | Write |
|---|---|
| "Empower your team with seamless collaboration" | "Your team stops losing decisions in Slack threads" |
| "Cutting-edge AI technology" | "Transcribes a 60-minute call in 90 seconds" |
| "Robust enterprise-grade security" | "SOC 2 Type II. Data stays in your region." |
| "Streamline your workflow" | "One approval step instead of four" |
| "Trusted by industry leaders" | "Used by 340 logistics teams across 12 countries" |
| "Get started in seconds" | "Connect a repo — no config file needed" |
| "赋能企业数字化转型" | "把对账从 3 天压缩到 4 小时" |
| "一站式智能运营平台" | "订单、库存、售后在同一个工作台里处理，不用切系统" |

## Specificity beats superlatives

Concrete numbers, real constraints, and named things are what make copy credible. A number with context outperforms an adjective every time.

- Name the actual integrations, not "connects to your favorite tools"
- Name the actual limit, not "generous limits"
- Name the actual outcome, not "better results"
- If a metric appears, say what it measures and over what period — a large number with no context is decoration

Never invent a customer name, a logo, a testimonial, a certification or a statistic. If the user has not supplied it, mark the slot and say so.

## Headline hierarchy

Every section headline should be readable on its own and still communicate. If a visitor read nothing but the H2s top to bottom, they should understand the product.

- **Headline**: the claim, in the user's language, not the company's
- **Subhead**: the mechanism — *how* the claim is true
- **Body**: the evidence

Avoid a headline that only makes sense once you have read the paragraph below it.

## Template chrome is copy too

The second-generation tells in `standards/anti-patterns.md` §2 are mostly *text* decisions:

- **No tracked ALL-CAPS eyebrow** above every heading. If the heading needs context, write a sentence-case line that says something specific — or make the heading carry it.
- **No middle-dot strings** (`Design · Engineering · 2025`) as a substitute for structure. If items are peers, lay them out as a list; if they are a sentence, write one.
- **No `WORD — fragment` labels.** Plain labels.
- **No `→` glued to link and button text.** The label carries the meaning. A directional icon only when direction *is* the meaning, and then a real icon.
- **No single word in a headline set in a second color or italic** to fake emphasis. Rewrite the sentence so the emphasis is in the words.
- **Sentence case** for headings, labels and buttons. Title Case Everywhere reads as a template; ALL CAPS reads as shouting.

Each of these would survive a change of subject unchanged. That is the definition of chrome.

## Vocabulary is a system

An action keeps its name through the whole flow. The button says "发布", the confirmation says "发布这篇文章？", the toast says "已发布", the status column says "已发布". "Publish" → "Submit" → "Success" → "Live" is four names for one thing, and the user has to learn all four.

Name things by what the user does with them, not by how the system stores them: a user manages *notifications*, not *webhook config*; *members*, not *user_roles*. Build a short glossary for the product — one term per concept — and use it in code, copy and the design file alike.

## Microcopy carries the UX

The small strings are where product quality actually shows.

**Buttons** state the outcome, not the mechanism. "Create project" beats "Submit". "Delete 12 orders" beats "Confirm" — the label should be readable out of context, because a confirmation dialog is exactly where a user is not reading carefully.

**Errors** state what happened, why, and what to do next. Never expose a raw exception or a status code alone.

> Bad: "Error: request failed"
> Bad: "Something went wrong"
> Good: "Could not save — you're offline. Your changes are kept locally and will sync automatically."

**Empty states** teach the next action. An empty state that only says "No data" wastes the single best onboarding moment in the product. Distinguish *nothing exists yet* (offer creation) from *filters exclude everything* (offer to clear filters).

**Loading states** say what is happening when it takes more than about two seconds. "Analyzing 1,204 rows" beats an unlabeled spinner.

**Destructive confirmations** state the scope and whether it is reversible. "Delete 12 orders? This cannot be undone." Not "Are you sure?"

**Permission messages** explain the restriction and the path forward: "Only workspace admins can change billing. Ask [admin] to update it." Not "Access denied".

## Labels and form text

- Labels are always visible. Placeholder-as-label fails the moment the user starts typing, and fails permanently for screen readers.
- Placeholders show format, not instruction: `MM/YY`, not `Enter expiry date`.
- Helper text goes under the field, before the user makes the mistake — not only in the error after.
- Validation errors name the field and the fix: "Password needs at least one number", not "Invalid input".
- Required and optional: mark whichever is rarer. Marking every field with an asterisk communicates nothing.

## Tone

Tone follows the mode:

- **CORPORATE**: confident, precise, specific. Authority comes from concreteness, not from adjectives.
- **SAAS marketing**: direct and useful. Speak the user's job, not the product's architecture.
- **SAAS product / ADMIN**: neutral, short, unambiguous. No jokes in a destructive confirmation. No personality in an error a user hits at 2am during an incident.

Address the user as "you" — in Chinese, 你 for consumer and SaaS products, 您 only where the brand is formal *and* consistent about it; mixing the two on one screen is the most common tone defect in Chinese interfaces. Refer to the product by name, not as "we", when describing what it does.

Errors do not apologize and do not joke. "抱歉，出错了" says nothing; "保存失败：网络已断开，修改已保留在本地" says what happened and what the product did about it.

## Length discipline

Cut every sentence that survives only because it fills space. A hero with three lines of subhead copy usually has one line of actual content in it.

If a paragraph exists to balance a layout, that is a layout problem. Fix the layout.

## Internationalization

If the product ships in more than one language, copy decisions become layout decisions: length variance in `standards/responsive-accessibility-performance.md`, and CJK-specific behavior in `standards/cjk-typography.md`.
