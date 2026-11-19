---
name: panel-terminal
description: Screenshot-free read/write channel for hosting-panel terminals (BT Panel / 1Panel) — read xterm text directly and send commands over the panel's own WebSocket. Route here when the user says "BT terminal", "BT panel terminal", "1Panel terminal", "panel terminal", "read the terminal", "run this on the server", "execute it in the terminal", or the Chinese equivalents 宝塔终端、宝塔面板终端、bt面板终端、bt终端、1Panel终端、面板终端、读一下终端、读终端、在服务器上跑、在服务器上执行、终端里执行, or whenever output must be read from or commands run in a panel xterm page.
license: MIT
metadata:
  author: pearno
  version: "1.0.0"
---

# panel-terminal · Direct terminal read/write (BT Panel + 1Panel)

**Purpose**: replace "screenshot → read it by eye" with "read text → send commands". Both panels expose the same API: `window.__term`.

```js
__term.tabs()        // available terminal sockets / tabs
__term.read()        // current visible screen (plain text)
__term.stream()      // full output stream received since injection (ANSI stripped)
__term.send(cmd)     // send a command, do not wait for the result
__term.run(cmd)      // send + wait for the prompt → { delta, tail, ms }
```

## Panel detection

| Signal | Panel | Reference | Injector |
|---|---|---|---|
| URL contains `/xterm`, DOM `#root.__vue_app__` | BT Panel | `references/bt-panel.md` | `scripts/inject-bt.js` |
| URL contains `/hosts/terminal`, DOM `#app.__vue_app__` | 1Panel | `references/1panel.md` | `scripts/inject-1panel.js` |

Both injectors install `window.__term` (BT also keeps `__btTerm`; 1Panel also keeps `__t1p`).

## Standard workflow (chrome-devtools MCP)

1. `list_pages` → select the page whose URL contains `/xterm` (BT) or `/hosts/terminal` (1Panel) → `select_page`
2. Read the panel's reference file — it carries the protocol, the discovery trick and the pitfalls:
   - 1Panel → `references/1panel.md`
   - BT Panel → `references/bt-panel.md`
3. Read the matching injector file in full, then pass its entire contents as the `function` argument of `evaluate_script`. **Re-inject after a page reload or route change**; injection is idempotent and only overwrites `__term`.
4. Call `__term.run()` / `__term.read()`.

```js
// cold start is fine: run() discovers the socket internally
async () => await window.__term.run('hostname; whoami; df -h / | tail -1')

// read the visible screen only
() => window.__term.read()
```

## Structure

```text
panel-terminal/
├── SKILL.md                  # Entry: API, detection, workflow, fallback ladder
├── references/
│   ├── 1panel.md             # 1Panel protocol, discovery, usage, pitfalls
│   └── bt-panel.md           # BT Panel Pinia internals, usage, pitfalls
└── scripts/
    ├── inject-1panel.js      # Full 1Panel injector
    └── inject-bt.js          # Full BT Panel injector
```

## Fallback ladder (in order)

1. Inject the matching script → use it if it works
2. Structural drift: probe stores/globals, print the keys of every suspicious object, then look for one with `buffer.active.getLine` (xterm) or `readyState` (ws)
3. 1Panel: `WebSocket.prototype.send` patch + poke to capture the socket; BT: the recursive scan in `scripts/inject-bt.js`
4. Still failing: wrap `ws.onmessage` to capture raw frames; or patch the `WebSocket` constructor via `navigate_page`'s `initScript` before page load (cost: full reload, session reconnect)
5. Screenshot only as the last resort — when you genuinely need colors or TUI layout

## Output conventions

- Show the user the **raw terminal text**, not a screenshot
- For long output, `tail` / `grep` first; never dump the whole buffer
- Destructive commands (rm/kill/service restarts) touch the target machine — state the blast radius in one line before running them; this skill only provides the channel
