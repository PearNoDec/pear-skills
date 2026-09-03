# Example — Before / After: A 中后台 Order List

`examples/before-after-hero.md` shows a marketing surface. This one is the other half of what this skill is for: an operations screen in Chinese, where the failures are quieter and cost more. Mode: **ADMIN**. Stack: framework-neutral HTML on the token layer; the same decisions map onto Element Plus or Ant Design through `standards/stack-adapters.md`.

Subject: the order list of an e-commerce operations console. Operators live in it eight hours a day.

---

## Before

Nothing here throws an error. It also cannot be used for a shift.

```html
<div class="p-8">
  <h1 class="text-4xl font-bold mb-2">订单管理</h1>
  <p class="text-gray-400 text-sm mb-8">在这里管理您的所有订单，轻松掌控业务全局</p>

  <div class="flex gap-2 mb-6">
    <input placeholder="搜索..." class="rounded-full border px-4 py-2 text-xs">
    <select class="rounded-full border px-4 py-2 text-xs"><option>全部状态</option></select>
    <button class="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 text-white text-xs">筛选</button>
  </div>

  <div class="grid grid-cols-3 gap-4">
    <div class="rounded-2xl shadow-lg p-6 hover:scale-105 transition-all group">
      <div class="text-xs text-gray-400">SO-40881</div>
      <div class="text-lg font-bold">杭州云帆科技有限公司</div>
      <div class="text-xs text-gray-400 mt-2">¥12,480 · 2026-03-04 · <span class="text-green-500">●</span></div>
      <div class="hidden group-hover:flex gap-2 mt-4">
        <button class="text-xs">查看</button><button class="text-xs text-red-500">删除</button>
      </div>
    </div>
    <!-- × 20 -->
  </div>
</div>
```

### What is actually wrong

| Problem | Reference |
|---|---|
| Hero-scale `text-4xl` title eating working space; a tagline nobody reads ("轻松掌控业务全局" — banned vocabulary) | `modes/admin.md`, `standards/content-copy.md` |
| Orders rendered as cards — comparison across rows is impossible | `standards/anti-patterns.md` § admin |
| 12px (`text-xs`) Chinese body text; Latin line-height; no `lang` | `standards/cjk-typography.md` |
| Status carried by a green dot alone, with no text | `SKILL.md` §7.5 |
| Row actions appear only on hover — unreachable by keyboard and touch | `standards/data-grid.md` |
| Filter bar shows nothing about what is currently filtered | `modes/admin.md` § filters |
| No selection, no bulk actions — the reason the screen exists | `modes/admin.md` |
| "删除" with no scope, no confirmation, no permission state | `standards/content-copy.md` |
| `hover:scale-105 transition-all` — motion with no information, on a repeated action | `standards/motion-interaction.md` |
| Gradient pill buttons, `rounded-2xl` on everything, `shadow-lg` per card | `standards/anti-patterns.md` § visual defaults |
| No loading, empty, no-results or error state | `standards/data-grid.md` |
| `scripts/lint-design.mjs --cjk`: 6 errors, 9 warnings | `scripts/` |

---

## After

Same page, same effort budget. What changed is the decisions.

```html
<!--
  Direction: predictability over novelty. The signature (move 3 in
  standards/anti-patterns.md §3) is one held structural rule — a 4px status
  bar on the inline-start edge of every row, drawer and toast — plus real
  data as the ornament (move 5): the order numbers, amounts and company
  names are the visual texture; nothing decorates around them.

  Tokens: Technical preset, retuned. Density: compact by default for this
  operator group. CJK: body 14px, leading 1.75, Latin face first in the stack.
-->
<main lang="zh-CN" data-surface="admin" data-density="compact" class="min-w-0">

  <!-- Compact page header: where am I, what state, what is the primary action. -->
  <header class="sticky top-0 z-[var(--z-sticky)] flex items-center justify-between
                 gap-[var(--space-4)] border-b border-[var(--border)]
                 bg-[var(--background)] px-[var(--gutter)] py-[var(--space-3)]">
    <div class="min-w-0">
      <nav aria-label="面包屑" class="text-[length:var(--text-label)] text-[var(--muted-foreground)]">
        <ol class="flex gap-[var(--space-2)]">
          <li><a href="/ops">运营</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">订单</li>
        </ol>
      </nav>
      <h1 class="text-[length:var(--text-h3)] font-[var(--weight-semibold)] leading-[var(--leading-snug)]">
        订单 <span class="numeric text-[var(--muted-foreground)] font-[var(--weight-regular)]">1,204</span>
      </h1>
    </div>
    <a href="/orders/new"
       class="inline-flex h-[var(--control-h-md)] items-center rounded-[var(--radius-md)]
              bg-[var(--primary)] px-[var(--space-4)] text-[var(--primary-foreground)]
              hover:bg-[var(--primary-hover)]">
      新建订单
    </a>
  </header>

  <!-- Filter bar. The current filter state is always readable from the screen. -->
  <section aria-label="筛选" class="px-[var(--gutter)] pt-[var(--space-4)]">
    <form role="search" class="flex flex-wrap items-end gap-[var(--space-3)]">
      <div class="flex flex-col gap-[var(--space-1)]">
        <label for="q" class="text-[length:var(--text-label)] text-[var(--foreground-secondary)]">搜索</label>
        <!-- inputmode left default: order numbers are mixed. type=search, not number. -->
        <input id="q" type="search" placeholder="订单号、公司名或联系人"
               class="h-[var(--control-h-md)] w-[32ch] rounded-[var(--radius-md)]
                      border border-[var(--border-strong)] bg-[var(--surface)] px-[var(--space-3)]">
      </div>
      <fieldset class="flex flex-col gap-[var(--space-1)]">
        <legend class="text-[length:var(--text-label)] text-[var(--foreground-secondary)]">状态</legend>
        <!-- Five options → visible segmented control, not a select. -->
        <div class="flex rounded-[var(--radius-md)] border border-[var(--border-strong)]">
          <label class="px-[var(--space-3)] h-[var(--control-h-md)] inline-flex items-center
                        has-[:checked]:bg-[var(--surface-selected)]">
            <input type="radio" name="status" value="" checked class="sr-only"> 全部
          </label>
          <label class="…"><input type="radio" name="status" value="pending" class="sr-only"> 待发货</label>
          <label class="…"><input type="radio" name="status" value="shipped" class="sr-only"> 已发货</label>
          <label class="…"><input type="radio" name="status" value="exception" class="sr-only"> 异常</label>
        </div>
      </fieldset>
      <button type="submit" class="h-[var(--control-h-md)] rounded-[var(--radius-md)]
                                   border border-[var(--border-strong)] px-[var(--space-4)]">
        应用筛选
      </button>
    </form>

    <!-- Active filters, count, clear-all. Announced when results change. -->
    <p aria-live="polite" class="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-2)]
                                text-[length:var(--text-body-sm)] text-[var(--foreground-secondary)]">
      <span>已筛选 <b class="numeric text-[var(--foreground)]">86</b> 条：</span>
      <span class="inline-flex items-center gap-1 rounded-[var(--radius-sm)]
                   bg-[var(--surface-secondary)] px-[var(--space-2)] py-0.5">
        状态：异常
        <button type="button" aria-label="移除筛选：状态 异常" class="hit-area">
          <svg aria-hidden="true" class="size-3.5"><!-- lucide x --></svg>
        </button>
      </span>
      <button type="button" class="underline">清除全部</button>
    </p>
  </section>

  <!-- Bulk bar: in flow, above the table, states its count in words. -->
  <div hidden data-bulk-bar
       class="mx-[var(--gutter)] mt-[var(--space-3)] flex items-center gap-[var(--space-3)]
              border-s-4 border-[var(--primary)] bg-[var(--surface-selected)]
              px-[var(--space-4)] py-[var(--space-2)]">
    <span>已选择 <b class="numeric">12</b> 条订单</span>
    <button type="button">批量发货</button>
    <button type="button">导出所选</button>
    <!-- Permission-gated: disabled with a reason, not hidden. -->
    <button type="button" disabled aria-describedby="bulk-del-why"
            class="ms-auto text-[var(--destructive)]">删除</button>
    <span id="bulk-del-why" class="sr-only">仅运营主管可删除订单</span>
    <button type="button" aria-label="取消选择（Esc）">取消</button>
  </div>

  <!-- The grid. Wrapper is keyboard-reachable; caption first; aria-sort on the header. -->
  <div tabindex="0" role="group" aria-label="订单列表"
       class="scroll-x mx-[var(--gutter)] mt-[var(--space-3)] border border-[var(--border)]
              rounded-[var(--radius-md)]">
    <table class="w-full text-[length:var(--text-body-sm)] leading-[var(--leading-normal)]">
      <caption class="sr-only">订单列表，共 86 条，按创建时间倒序</caption>
      <thead class="bg-[var(--surface-secondary)] text-[var(--foreground-secondary)]">
        <tr class="h-[var(--row-h)]">
          <th scope="col" class="w-10 px-[var(--space-3)]">
            <input type="checkbox" aria-label="选择本页全部订单" data-select-all>
          </th>
          <th scope="col" aria-sort="none" class="text-start px-[var(--space-3)]">
            <button type="button" class="inline-flex items-center gap-1">订单号</button>
          </th>
          <th scope="col" class="text-start px-[var(--space-3)]">客户</th>
          <th scope="col" aria-sort="descending" class="text-start px-[var(--space-3)]">
            <button type="button" class="inline-flex items-center gap-1">
              创建时间 <svg aria-hidden="true" class="size-3.5"><!-- lucide arrow-down --></svg>
            </button>
          </th>
          <th scope="col" class="text-end px-[var(--space-3)]">金额</th>
          <th scope="col" class="text-start px-[var(--space-3)]">状态</th>
          <th scope="col" class="px-[var(--space-3)]"><span class="sr-only">操作</span></th>
        </tr>
      </thead>
      <tbody aria-busy="false" class="divide-y divide-[var(--border-subtle)]">
        <!-- The signature: a 4px status bar on the start edge, held everywhere. -->
        <tr class="h-[var(--row-h)] border-s-4 border-[var(--warning)] hover:bg-[var(--surface-hover)]">
          <td class="px-[var(--space-3)]">
            <label class="hit-area">
              <input type="checkbox" aria-label="选择订单 SO-40881，杭州云帆科技">
            </label>
          </td>
          <td class="px-[var(--space-3)] numeric">
            <a href="?order=SO-40881" class="underline-offset-2 hover:underline">SO-40881</a>
          </td>
          <td class="px-[var(--space-3)] max-w-[24ch] truncate" title="杭州云帆科技有限公司">杭州云帆科技有限公司</td>
          <td class="px-[var(--space-3)] numeric text-[var(--muted-foreground)]">
            <time datetime="2026-03-04T06:12">03-04 06:12</time>
          </td>
          <td class="px-[var(--space-3)] numeric text-end">¥12,480.00</td>
          <td class="px-[var(--space-3)]">
            <!-- Status by text AND color, never the dot alone. -->
            <span class="inline-flex items-center gap-1.5 text-[var(--warning-foreground)]">
              <span aria-hidden="true" class="size-1.5 rounded-full bg-[var(--warning)]"></span>
              地址异常
            </span>
          </td>
          <td class="px-[var(--space-3)] text-end">
            <!-- Always-present actions. Overflow menu, not hover reveal. -->
            <button type="button" aria-label="订单 SO-40881 更多操作" aria-haspopup="menu"
                    class="hit-area inline-flex size-7 items-center justify-center rounded-[var(--radius-sm)]
                           hover:bg-[var(--surface-active)]">
              <svg aria-hidden="true" class="size-4"><!-- lucide more-horizontal --></svg>
            </button>
          </td>
        </tr>
        <!-- … -->
      </tbody>
    </table>
  </div>

  <!-- The states this table must be able to render. Each is a different screen. -->
  <template data-state="loading">
    <!-- 20 skeleton rows at --row-h, bar widths varied per column; tbody aria-busy="true" -->
  </template>
  <template data-state="empty">
    <p>还没有订单。</p><a href="/orders/new">新建第一个订单</a>
  </template>
  <template data-state="no-results">
    <p>没有符合当前筛选的订单。</p><button type="button">清除筛选</button>
  </template>
  <template data-state="error">
    <p role="alert">订单列表加载失败：网络超时。</p><button type="button">重试</button>
  </template>

  <!-- Destructive confirmation: scope and reversibility, Cancel focused. -->
  <dialog aria-labelledby="del-title">
    <h2 id="del-title">删除 12 条订单？</h2>
    <p>此操作不可撤销，相关发货记录将一并删除。</p>
    <form method="dialog" class="flex justify-end gap-[var(--space-2)]">
      <button autofocus value="cancel">取消</button>
      <button value="confirm" class="bg-[var(--destructive)] text-[var(--destructive-foreground)]">删除 12 条订单</button>
    </form>
  </dialog>
</main>
```

### What changed, and why it matters

**The screen is now a working environment.** A compact sticky header answers where-am-I / what-state / what-next in one line. The table is a table: rows compare, columns sort, digits align in the Latin face with `tabular-nums`, money is right-aligned. Twenty rows fit where six cards did.

**The filter state is on the screen.** Chips for active filters, a live count, a clear-all. The status filter is a segmented control because five options do not need a dropdown — and the current one is visible without opening anything.

**Selection and bulk actions exist.** Tri-state select-all with an honest label, a bulk bar in flow that states its count in words, `Escape` to clear, and the destructive action disabled *with a reason* for operators who lack the permission.

**Status is never color alone.** Every state has a word next to its dot, and the 4px start-edge bar repeats the same hue — which is the signature: one held structural rule across rows, drawer and toasts, instead of twenty gradient cards.

**Every non-happy state is a distinct screen.** Skeleton rows at the real row height, "还没有订单" versus "没有符合当前筛选的订单", an error that says what failed and offers retry.

**The CJK typography is set from the script.** 14px body, 1.75 leading, Latin face first so `SO-40881` and `¥12,480.00` render in it, `lang="zh-CN"` on the region so `line-break: strict` and `font-synthesis-weight: none` from the a11y baseline apply, no italic, no negative tracking. The truncated company name keeps its full value in `title` and in the DOM.

**The copy states scope.** "删除 12 条订单？此操作不可撤销" instead of "确定吗？"; the confirm button repeats the scope; Cancel is focused so `Enter` cannot destroy.

**Motion is fast and informational.** Row hover lifts one surface step; nothing scales, nothing transitions `all`, `[data-surface="admin"]` cuts every duration from the token layer.

None of this required a component library. With Element Plus or Ant Design it requires less — `el-table` and AntD `Table` already implement `aria-sort`, selection and sticky headers — but every row in this checklist still has to be verified in the configured result, because the library defaults (12px CJK text in compact AntD, hover-only row actions in most templates) violate several of them.
