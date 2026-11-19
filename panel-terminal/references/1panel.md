# 1Panel terminal internals

Read this before injecting into a 1Panel terminal page.

## How it works

- 1Panel v2 renders xterm with the **DOM renderer**: `.xterm-rows` holds plain text (it is not a canvas).
- Terminal WebSocket: `ws://HOST/api/v1/terminals?cols=80&rows=24&id=1`.
- The protocol is **JSON + base64**, identical in both directions:

```json
// send (every keystroke / full line goes out like this)
{"type":"cmd","data":"<base64(text)>"}
// receive (server echo, contains ANSI)
{"type":"cmd","data":"<base64(output stream)>"}
// plus {"type":"heartbeat","timestamp":"..."} every 10s
```

- **Both the Terminal instance and the socket live inside a bundled module closure** — they are not reachable from the Vue component tree or Pinia (GlobalState/MenuState/TabsStore). So the injector patches `WebSocket.prototype.send`, then sends a pair of **left/right arrow keys** (`poke`) to make xterm fire `onData` once, which captures the socket instance.
- Read: DOM `.xterm-rows` (visible screen) + the ws output stream maintained by the script (includes history since injection).

## Injection

Read `scripts/inject-1panel.js` and pass its entire contents as the `function` argument of `evaluate_script`. It installs `window.__term` (and keeps `window.__t1p` as an alias).

The script exposes:

| Method | Returns |
|---|---|
| `tabs()` | live sockets: `{ id, url, readyState, chars, types }` |
| `status()` | `{ page, sockets, url }` |
| `read(id?)` | visible screen of the focused tab, plain text |
| `stream(id?)` | full output since injection, ANSI stripped |
| `send(cmd, opts?)` | sends a command, does not wait |
| `run(cmd, opts?)` | sends + waits for prompt → `{ ok, id, delta, tail, ms }` |
| `frames()` | last 20 raw send payloads and received frame types (protocol debugging) |
| `poke()` | fires the arrow-key pair manually |

## Usage

```js
// cold start is fine: run() pokes internally to discover the socket
async () => await window.__term.run('hostname; whoami; df -h / | tail -1')

// read the visible screen only
() => window.__term.read()

// multiple tabs: list ids first, then target one (id comes from the ws URL's ?id=)
() => window.__term.tabs()
async () => await window.__term.run('uptime', { id: '2' })

// is the socket actually ready?
() => window.__term.status()
```

## Pitfalls (field-tested)

1. **Patch before poking**: `WebSocket.prototype.send` only captures sends that happen *after* the patch, so the first cold-start `run()` pokes the arrow keys first. At a zsh/bash prompt the net effect is zero; if vim/htop is running, the poke sends arrow keys (usually harmless, but don't do it inside a TUI).
2. **btoa cannot encode non-Latin1**: Chinese/emoji must go `TextEncoder → binary string → btoa`; calling `btoa('café')` directly throws.
3. **The server echoes `{"type":"cmd","data":base64}` too**, and the decoded payload is a raw stream with ANSI (`\x1b[?2004l`, `\r\n`, etc.). Strip it before showing anything to the user.
4. **Resource timing keeps only 250 entries**: on a long-lived page the xterm chunks get evicted from `performance.getEntriesByType('resource')` — don't count on recovering xterm source from the bundle.
5. **`.xterm-rows` renders only the visible screen**: once history scrolls off you cannot read it. For history use `__term.stream()` (output since injection) or `run()`'s `delta`.
6. **Multiple tabs**: one ws per tab (`?id=1/2/...`); `poke` only affects the focused tab. To operate a specific tab, click it first, then inject/call.
7. **10s heartbeat**: even without poking, the heartbeat reveals the socket within 10s, but poke takes milliseconds.
