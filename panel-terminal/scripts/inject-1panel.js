() => {
  // 1Panel terminal controller: injects window.__term (also keeps the window.__t1p alias)
  // Usage: chrome-devtools MCP → evaluate_script({ pageId, function: <contents of this file> })
  //
  // How it works:
  //   - 1Panel v2 renders xterm.js with the DOM renderer → .xterm-rows holds plain text
  //   - Terminal WebSocket: ws://host/api/v1/terminals?cols=80&rows=24&id=1
  //   - Protocol is JSON: send/receive are both {"type":"cmd","data":"<base64>"}, plus a heartbeat
  //   - The instance hides in a bundled module closure, absent from Vue/Pinia → patch WebSocket.prototype.send,
  //     send one left/right arrow key poke so xterm fires onData → capture the socket instance

  const VERSION = 1;

  const b64e = s => {
    const u8 = new TextEncoder().encode(s);
    let bin = '';
    for (const b of u8) bin += String.fromCharCode(b);
    return btoa(bin);
  };
  const b64d = s => {
    const bin = atob(s);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(u8);
  };
  const strip = t => t
    .replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g, '')   // OSC
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')          // CSI
    .replace(/\x1b[@-Z\\-_]/g, '')                      // other ESC sequences
    .replace(/\r(?!\n)/g, '')                           // lone CR
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');  // control characters
  const sleep = ms => new Promise(z => setTimeout(z, ms));

  // ---- socket capture ----
  const H = window.__termHook = window.__termHook || { seen: [], frames: [], patched: false };
  if (!H.patched) {
    H.patched = true;
    H.origSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (d) {
      try {
        H.seen.push(this);
        H.frames.push(typeof d === 'string' ? d.slice(0, 240) : '[bin]');
        if (H.frames.length > 400) H.frames.shift();
        if (H.seen.length > 24) H.seen = H.seen.slice(-24);
      } catch (e) {}
      return H.origSend.apply(this, arguments);
    };
  }

  const attach = ws => {
    if (!ws || ws.__pt) return;
    ws.__pt = { out: [], types: [] };
    ws.addEventListener('message', ev => {
      try {
        const d = typeof ev.data === 'string' ? ev.data : '';
        if (!d) return;
        const m = JSON.parse(d);
        if (m.type === 'cmd' && m.data) {
          ws.__pt.out.push(b64d(m.data));
          if (ws.__pt.out.length > 5000) ws.__pt.out.shift();
        } else if (m.type) {
          ws.__pt.types.push(m.type);
          if (ws.__pt.types.length > 100) ws.__pt.types.shift();
        }
      } catch (e) {}
    });
  };
  const live = () => Array.from(new Set(H.seen)).filter(w => w.readyState === 1);
  live().forEach(attach);
  const idOf = ws => { try { return new URL(ws.url).searchParams.get('id') || '1'; } catch (e) { return '?'; } };
  const pick = id => {
    const list = live();
    list.forEach(attach);            // attach listeners to newly discovered sockets too
    if (!list.length) return null;
    if (id === undefined || id === null) return list[0];
    return list.find(w => idOf(w) === String(id)) || list[0];
  };

  // Send a pair of left/right arrow keys: net effect is zero at a shell prompt, only triggers one ws.send
  const poke = () => {
    const ta = document.querySelector('.xterm-helper-textarea');
    if (!ta) return false;
    try { ta.focus(); } catch (e) {}
    const fire = (key, keyCode) => ta.dispatchEvent(new KeyboardEvent('keydown', {
      key, code: key, keyCode, which: keyCode, bubbles: true, cancelable: true
    }));
    fire('ArrowLeft', 37);
    fire('ArrowRight', 39);
    return true;
  };

  const visibleRows = () => {
    const panes = [...document.querySelectorAll('.el-tab-pane')].filter(p => p.offsetParent !== null);
    for (const p of panes) {
      const r = p.querySelector('.xterm-rows');
      if (r) return r;
    }
    return document.querySelector('.xterm-rows');
  };
  const streamOf = ws => (ws && ws.__pt) ? strip(ws.__pt.out.join('')) : '';
  const isTermPage = () => location.pathname.indexOf('terminal') >= 0 || !!document.querySelector('.xterm');

  const api = {
    version: VERSION,
    panel: '1panel',

    tabs: () => live().map(w => ({
      id: idOf(w),
      url: w.url,
      readyState: w.readyState,
      chars: w.__pt ? w.__pt.out.join('').length : 0,
      types: w.__pt ? w.__pt.types.slice(-3) : []
    })),

    // Check whether this is a terminal page / whether the socket is ready
    status: () => ({ page: isTermPage(), sockets: live().length, url: location.href }),

    // read: visible screen of the focused tab (plain text from the DOM renderer)
    read: id => {
      const r = visibleRows();
      if (r && r.innerText.trim()) return r.innerText;
      const ws = pick(id);
      return ws ? streamOf(ws).split('\n').slice(-60).join('\n') : '';
    },

    // read: full output stream received since injection (ANSI stripped)
    stream: id => streamOf(pick(id)),

    // send: text command, appends \r automatically; pokes and waits first when there is no socket
    send: async (cmd, opts) => {
      const o = Object.assign({ id: null, poke: true, wait: 2500 }, opts || {});
      let ws = pick(o.id);
      if (!ws && o.poke) { poke(); ws = pick(o.id); }
      const t0 = Date.now();
      while (!ws && Date.now() - t0 < o.wait) { await sleep(120); ws = pick(o.id); }
      if (!ws) return { ok: false, reason: 'no live websocket (page not connected, or re-inject after reload)' };
      const line = String(cmd).replace(/\r/g, '').replace(/\n/g, '\r') + '\r';
      try {
        ws.send(JSON.stringify({ type: 'cmd', data: b64e(line) }));
        return { ok: true, id: idOf(ws) };
      } catch (e) {
        return { ok: false, reason: 'ws send failed: ' + String(e) };
      }
    },

    // run: send → poll the output stream until stable and back at a prompt → return the delta
    run: async (cmd, opts) => {
      const o = Object.assign({ id: null, timeout: 15000, settle: 500 }, opts || {});
      let ws = pick(o.id);
      if (!ws) {
        const r = await api.send(cmd, { id: o.id, poke: true, wait: 2500 });
        if (!r.ok) return r;
        ws = pick(o.id);
      } else {
        ws.send(JSON.stringify({ type: 'cmd', data: b64e(String(cmd).replace(/\r/g, '').replace(/\n/g, '\r') + '\r') }));
      }
      const rawBefore = ws.__pt ? ws.__pt.out.join('').length : 0;
      const t0 = Date.now();
      let last = '', stableAt = Date.now();
      while (Date.now() - t0 < o.timeout) {
        await sleep(150);
        const cur = streamOf(ws);
        if (cur !== last) { last = cur; stableAt = Date.now(); }
        else if (Date.now() - stableAt >= o.settle && /[#$%>]\s*$/.test(cur)) break;
      }
      const ws2 = pick(o.id) || ws;
      const rawFull = ws2.__pt ? ws2.__pt.out.join('') : '';
      const delta = rawFull.length > rawBefore ? strip(rawFull.slice(rawBefore)) : streamOf(ws2).slice(-2000);
      const dom = (visibleRows() || {}).innerText || '';
      return {
        ok: true,
        id: idOf(ws2),
        delta,
        tail: dom ? dom.split('\n').slice(-60).join('\n') : streamOf(ws2).split('\n').slice(-60).join('\n'),
        ms: Date.now() - t0
      };
    },

    // raw frames: for protocol debugging (send payloads + received types)
    frames: () => H.frames.slice(-20),
    poke: () => poke()
  };

  window.__term = api;
  window.__t1p = api;
  return { installed: true, version: VERSION, panel: '1panel', page: isTermPage(), tabs: api.tabs() };
}
