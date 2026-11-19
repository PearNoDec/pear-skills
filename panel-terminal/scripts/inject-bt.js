() => {
  // BT Panel xterm terminal controller: injects window.__btTerm
  // Usage: chrome-devtools MCP → evaluate_script({ pageId, function: <contents of this file> })
  if (window.__btTerm && window.__btTerm.version >= 2) {
    return { already: true, tabs: window.__btTerm.tabs() };
  }

  const VERSION = 2;

  const isTerm = v => v && typeof v === 'object' &&
    typeof v.write === 'function' && typeof v.onData === 'function' &&
    v.buffer && v.buffer.active && typeof v.buffer.active.getLine === 'function';

  const findApp = () => {
    const cands = [document.getElementById('root')];
    for (const el of document.querySelectorAll('[data-v-app]')) cands.push(el);
    cands.push(document.body, document.documentElement);
    for (const el of cands) if (el && el.__vue_app__) return el.__vue_app__;
    for (const el of document.querySelectorAll('div')) if (el.__vue_app__) return el.__vue_app__;
    return null;
  };

  const findPinia = app => {
    const p = app && app._context && app._context.provides;
    if (!p) return null;
    for (const s of Object.getOwnPropertySymbols(p)) {
      const v = p[s];
      if (v && v._s instanceof Map) return v;
    }
    return null;
  };

  const asTerm = ref => {
    if (!ref || typeof ref !== 'object') return null;
    for (const k of ['useTerminal', 'getTerminal', 'terminal', 'term']) {
      try {
        const v = typeof ref[k] === 'function' ? ref[k]() : ref[k];
        if (isTerm(v)) return v;
      } catch (e) {}
    }
    return null;
  };

  const asSock = ref => {
    if (!ref || typeof ref !== 'object') return null;
    for (const k of ['socketInfo', 'getSocket', 'socket']) {
      try {
        const s = typeof ref[k] === 'function' ? ref[k]() : ref[k];
        if (s && typeof s.send === 'function') return s;
        if (s && s.socket && typeof s.socket.send === 'function') return s.socket;
      } catch (e) {}
    }
    return null;
  };

  const app = findApp();
  const pinia = findPinia(app);
  if (!pinia) return { error: 'no vue app / pinia — not a BT Panel page?' };

  const tabs = [];
  const seen = new Set();
  const add = (id, ref) => {
    if (!ref || typeof ref !== 'object' || seen.has(ref)) return;
    const term = asTerm(ref);
    if (!term) return;
    seen.add(ref);
    tabs.push({ id: String(id), term, sock: asSock(ref) });
  };

  // 1) Common shape: some store.$state.<dict> = { 'terminal-xxx': refObj }
  for (const [, store] of pinia._s) {
    let st;
    try { st = store.$state; } catch (e) { continue; }
    if (!st || typeof st !== 'object') continue;
    for (const k of Object.keys(st)) {
      const bag = st[k];
      if (!bag || typeof bag !== 'object' || Array.isArray(bag) || bag.__v_isRef) continue;
      const keys = Object.keys(bag);
      if (!keys.length) continue;
      let hit = false;
      for (const kk of keys) if (asTerm(bag[kk])) { hit = true; break; }
      if (hit) for (const kk of keys) add(kk, bag[kk]);
    }
  }

  // 2) Fallback: shallow-scan every store's state (depth 4) for objects with write + buffer
  if (!tabs.length) {
    const walk = (v, path, d) => {
      if (!v || typeof v !== 'object' || d > 4) return;
      if (isTerm(v)) { add(path, v); return; }
      if (v.__v_isRef) { walk(v.value, path, d + 1); return; }
      let ks = [];
      try { ks = Object.keys(v).slice(0, 60); } catch (e) { return; }
      for (const k of ks) { try { walk(v[k], path + '.' + k, d + 1); } catch (e) {} }
    };
    for (const [sid, store] of pinia._s) { try { walk(store.$state, String(sid), 0); } catch (e) {} }
  }

  const text = t => {
    const b = t.buffer.active, a = [];
    for (let i = 0; i < b.length; i++) { const l = b.getLine(i); a.push(l ? l.translateToString(true) : ''); }
    while (a.length && a[a.length - 1] === '') a.pop();
    return a.join('\n');
  };

  const pick = id => {
    if (id === undefined || id === null) return tabs[0];
    return tabs.find(t => t.id === String(id)) || (typeof id === 'number' ? tabs[id] : null) || tabs[0];
  };

  // sock.ws may be a Vue ref in some BT versions, or a bare WebSocket
  const rawWs = t => {
    const w = t && t.sock && t.sock.ws;
    if (!w) return null;
    if (typeof w.send === 'function') return w;          // bare WebSocket
    return w.value && typeof w.value.send === 'function' ? w.value : null;
  };
  const statusOf = t => {
    const ws = rawWs(t);
    if (ws && ws.readyState === 1) return 'OPEN';
    const s = t && t.sock && t.sock.status;
    const sv = s && (s.value !== undefined ? s.value : s);
    if (sv) return String(sv);
    return 'UNKNOWN';
  };

  const waitOpen = async (t, ms) => {
    const t0 = Date.now();
    let opened = false;
    while (Date.now() - t0 < ms) {
      if (statusOf(t) === 'OPEN') { opened = true; break; }
      if (t && t.sock && typeof t.sock.open === 'function') { try { t.sock.open(); } catch (e) {} }
      await new Promise(z => setTimeout(z, 250));
    }
    return opened;
  };

  const api = {
    version: VERSION,

    tabs: () => tabs.map(t => ({
      id: t.id,
      cols: t.term.cols,
      rows: t.term.rows,
      scrollback: t.term.buffer.active.baseY,
      status: statusOf(t),
      hasSocket: !!t.sock
    })),

    // read: visible screen + scrollback as plain text (ANSI already consumed by xterm)
    read: (id) => { const t = pick(id); return t ? text(t.term) : null; },

    // send: wait for OPEN (triggering a reconnect if needed) → send a text frame; fall back to raw ws.send
    send: async (cmd, id, opts) => {
      const o = Object.assign({ wait: 8000 }, opts || {});
      const t = pick(id);
      if (!t) return { ok: false, reason: 'no terminal' };
      if (!t.sock) return { ok: false, reason: 'no socket' };
      const line = String(cmd).replace(/\r/g, '').replace(/\n/g, '\r') + '\r';

      if (!(await waitOpen(t, o.wait))) return { ok: false, reason: 'socket not OPEN: ' + statusOf(t) };

      for (let i = 0; i < 3; i++) {
        try { if (t.sock.send(line)) return { ok: true, id: t.id, via: 'sock' }; } catch (e) {}
        await new Promise(z => setTimeout(z, 250));
      }
      // fallback: hit the bare WebSocket directly (field-tested: the server accepts text frames)
      const ws = rawWs(t);
      if (ws && ws.readyState === 1) {
        try { ws.send(line); return { ok: true, id: t.id, via: 'raw-ws' }; } catch (e) {}
      }
      return { ok: false, reason: 'send failed: ' + statusOf(t) };
    },

    // run: send → poll until the content is stable and back at a prompt → return the new output
    run: async (cmd, opts) => {
      const o = Object.assign({ timeout: 25000, settle: 600, id: null, wait: 8000 }, opts || {});
      const t = pick(o.id);
      if (!t) return { ok: false, reason: 'no terminal' };
      const before = text(t.term);
      const r = await api.send(cmd, o.id, { wait: o.wait });
      if (!r.ok) return r;

      const t0 = Date.now();
      let last = '', stableAt = Date.now();
      while (Date.now() - t0 < o.timeout) {
        await new Promise(z => setTimeout(z, 200));
        const cur = text(t.term);
        if (cur !== last) { last = cur; stableAt = Date.now(); }
        else if (Date.now() - stableAt >= o.settle && /[#$%>] ?$/.test(cur)) break;
      }
      const out = text(t.term);
      return {
        ok: true,
        id: t.id,
        via: r.via,
        delta: out.length > before.length ? out.slice(before.length) : out.slice(-4000),
        tail: out.split('\n').slice(-60).join('\n')
      };
    },

    // Capture raw ws frames (including ANSI); fallback when the store shape drifts
    raw: (on) => {
      const t = pick(null);
      if (!t || !t.sock) return { ok: false, reason: 'no socket' };
      const ws = rawWs(t);
      if (!ws) return { ok: false, reason: 'no raw ws' };
      if (!on) {
        if (ws.__btRaw) { ws.onmessage = ws.__btRaw.orig; delete ws.__btRaw; }
        return { ok: true, off: true };
      }
      if (!ws.__btRaw) {
        const orig = ws.onmessage;
        ws.__btRaw = { orig, buf: [] };
        ws.onmessage = function (ev) {
          let d = ev.data;
          try { if (d instanceof ArrayBuffer) d = new TextDecoder().decode(new Uint8Array(d)); } catch (e) {}
          ws.__btRaw.buf.push(String(d));
          if (ws.__btRaw.buf.length > 2000) ws.__btRaw.buf.shift();
          return orig ? orig.call(this, ev) : undefined;
        };
      }
      return { ok: true, frames: ws.__btRaw.buf.length };
    },

    rawText: () => {
      const t = pick(null);
      if (!t || !t.sock) return '';
      const ws = rawWs(t);
      return (ws && ws.__btRaw) ? ws.__btRaw.buf.join('') : '';
    }
  };

  window.__btTerm = api;
  window.__term = api;   // unified entry point: both 1Panel and BT use __term
  return { installed: true, version: VERSION, panel: 'bt', tabs: api.tabs() };
}
