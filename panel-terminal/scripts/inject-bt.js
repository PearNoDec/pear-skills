() => {
  // BT Panel xterm terminal controller: injects window.__btTerm
  // Usage: chrome-devtools MCP → evaluate_script({ pageId, function: <contents of this file> })
  // v3: socket state is re-read live with recursive unref; fixes the false "UNKNOWN" after BT reconnects
  if (window.__btTerm && window.__btTerm.version >= 3) {
    return { already: true, tabs: window.__btTerm.tabs() };
  }
  delete window.__btTerm; delete window.__term;

  const VERSION = 3;

  const isTerm = v => v && typeof v === 'object' &&
    typeof v.write === 'function' && typeof v.onData === 'function' &&
    v.buffer && v.buffer.active && typeof v.buffer.active.getLine === 'function';

  // Recursively unwrap Vue refs / proxies carrying _value / _rawValue until a bare WebSocket with readyState
  const unref = (v, n) => {
    n = n || 0;
    while (v && typeof v === 'object' && n++ < 5) {
      if (v.readyState !== undefined) return v;
      if (v.value !== undefined && v.value !== v) { v = v.value; continue; }
      if (v._value !== undefined && v._value !== v) { v = v._value; continue; }
      if (v._rawValue !== undefined && v._rawValue !== v) { v = v._rawValue; continue; }
      break;
    }
    return v;
  };

  const findApp = () => {
    const cands = [document.getElementById('root')];
    for (const el of document.querySelectorAll('[data-v-app]')) cands.push(el);
    cands.push(document.body, document.documentElement);
    for (const el of cands) if (el && el.__vue_app__) return el.__vue_app__;
    for (const el of document.querySelectorAll('div')) if (el && el.__vue_app__) return el.__vue_app__;
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
        if (s && typeof s.send === 'function' && s.ws) return s;
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
    tabs.push({ id: String(id), ref, term, sock: asSock(ref) });
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

  const pick = id => (id === undefined || id === null) ? tabs[0]
    : (tabs.find(t => t.id === String(id)) || (typeof id === 'number' ? tabs[id] : null) || tabs[0]);

  // Re-read the socket on every call: after a BT reconnect the store wrapper may be replaced wholesale,
  // so the socket cached at injection time goes stale
  const sockOf = t => {
    if (!t) return null;
    if (t.ref) { const s = asSock(t.ref); if (s) return s; }
    return t.sock;
  };

  const rawWs = t => {
    const s = sockOf(t);
    if (!s) return null;
    const w = unref(s.ws);
    return w && typeof w.send === 'function' ? w : null;
  };

  const statusOf = t => {
    const ws = rawWs(t);
    if (ws) {
      if (ws.readyState === 1) return 'OPEN';
      if (ws.readyState === 0) return 'CONNECTING';
      if (ws.readyState === 2) return 'CLOSING';
      if (ws.readyState === 3) return 'CLOSED';
    }
    const s = sockOf(t);
    const sv = unref(s && s.status);
    if (sv) return String(sv);
    const wv = unref(s && s.ws);
    if (wv && typeof wv.readyState === 'number') return 'readyState=' + wv.readyState;
    return 'UNKNOWN';
  };

  const waitOpen = async (t, ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (statusOf(t) === 'OPEN') return true;
      const s = sockOf(t);
      if (s && typeof s.open === 'function') { try { s.open(); } catch (e) {} }
      await new Promise(z => setTimeout(z, 250));
    }
    return statusOf(t) === 'OPEN';
  };

  const api = {
    version: VERSION,

    tabs: () => tabs.map(t => ({
      id: t.id,
      cols: t.term.cols,
      rows: t.term.rows,
      scrollback: t.term.buffer.active.baseY,
      status: statusOf(t),
      hasSocket: !!sockOf(t)
    })),

    // read: visible screen + scrollback as plain text (ANSI already consumed by xterm)
    read: (id) => { const t = pick(id); return t ? text(t.term) : null; },

    // send: wait for OPEN (triggering a reconnect if needed) → send a text frame; fall back to raw ws.send
    send: async (cmd, id, opts) => {
      const o = Object.assign({ wait: 8000 }, opts || {});
      const t = pick(id);
      if (!t) return { ok: false, reason: 'no terminal' };
      const line = String(cmd).replace(/\r/g, '').replace(/\n/g, '\r') + '\r';

      const opened = await waitOpen(t, o.wait);
      const s = sockOf(t);
      if (s && (opened || statusOf(t) === 'OPEN')) {
        for (let i = 0; i < 3; i++) {
          try { if (s.send(line)) return { ok: true, id: t.id, via: 'sock' }; } catch (e) {}
          await new Promise(z => setTimeout(z, 250));
        }
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
      const t = pick(null), ws = t && rawWs(t);
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
      const t = pick(null), ws = t && rawWs(t);
      return ws && ws.__btRaw ? ws.__btRaw.buf.join('') : '';
    }
  };

  window.__btTerm = api;
  window.__term = api;   // unified entry point: both 1Panel and BT use __term
  return { installed: true, version: VERSION, panel: 'bt', tabs: api.tabs() };
}
