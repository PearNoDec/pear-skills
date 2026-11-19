# BT Panel terminal internals

Read this before injecting into a BT Panel terminal page.

## How it works

- BT renders xterm on a **canvas**; there is no text in the DOM.
- But the terminal instance and WebSocket live in **Vue Pinia**:

```
#root.__vue_app__
  → provides[Symbol]  (Pinia, _s is a Map)
    → store "TERM-STORE".$state
        terminalList   : [{id, hostInfo:{ps,host}}]
        terminalRefs   : { "terminal-xxxx": refObj }
            refObj.useTerminal()        → xterm.js Terminal (buffer is readable)
            refObj.socketInfo().socket  → { send(), status(OPEN), ws }
```

- Read: `term.buffer.active.getLine(i).translateToString(true)`.
- Write: `socket.send('cmd\r')` — a text frame, equivalent to typing + Enter.

## Injection

Read `scripts/inject-bt.js` and pass its entire contents as the `function` argument of `evaluate_script`. It installs `window.__btTerm` and the unified `window.__term`.

The injector first walks the common Pinia shape (`store.$state.<dict> = { 'terminal-xxx': refObj }`). If that misses, it shallow-scans every store's state (depth 4) for objects with `write` + `buffer` — that recursive scan is the resilience you keep it for.

The script exposes:

| Method | Returns |
|---|---|
| `tabs()` | `{ id, cols, rows, scrollback, status, hasSocket }` per terminal |
| `read(id?)` | visible screen + scrollback as plain text |
| `send(cmd, id?, opts?)` | waits for OPEN (reconnecting if needed), sends a text frame |
| `run(cmd, opts?)` | sends + polls until stable and back at a prompt → `{ ok, id, via, delta, tail }` |
| `raw(on)` | toggles raw `ws.onmessage` capture (including ANSI) |
| `rawText()` | accumulated raw frames |

## Usage

```js
() => window.__term.ids()
() => window.__term.read()
async () => await window.__term.run('systemctl status php-fpm-84 --no-pager')
```

## Pitfalls

1. **Text frames only**: sending `Uint8Array`/`ArrayBuffer` makes the server drop the connection immediately.
2. **Check `ws.readyState === 1` before sending**: BT's `socket.send` silently enqueues and returns false when the socket is not OPEN.
3. **Do not use `term.paste()` to execute commands**: it echoes locally, but `\r` does not trigger execution.
4. **Reconnects redraw the MOTD**: `run()`'s length-based delta can miss, so treat `tail` as the source of truth.
5. **A page reload / route change rebuilds the store**: injection stops working; just re-inject.
6. **Multiple tabs**: keys look like `terminal-FAsAxbfF`; the first one is used by default.
7. **Interactive programs** (vim/htop/top): content never settles → use `read()` to look at the screen, not `run()`.
