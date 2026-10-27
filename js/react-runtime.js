/*
 * react-runtime.js — lets learner code use JSX, React hooks and (optionally) a
 * simulated React Native, and gives tests helpers to render components and click/type.
 * Needs vendor/react, vendor/react-dom and vendor/babel to be loaded first (browser only).
 */
(function (root) {
  'use strict';

  // Remove import/export lines (keeping line numbers) so learners can write them like in a real project.
  function stripModules(code) {
    const blank = (m) => m.replace(/[^\n]/g, '');
    return code
      .replace(/^[ \t]*import\s[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, blank)
      .replace(/^[ \t]*import\s+['"][^'"]+['"];?[ \t]*$/gm, blank)
      .replace(/\bexport\s+default\s+/g, '')
      .replace(/^([ \t]*)export\s+/gm, '$1');
  }

  function formatReactWarning(args) {
    const [fmt, ...rest] = args;
    if (typeof fmt !== 'string') return args.map(String).join(' ');
    let i = 0;
    const text = fmt.replace(/%[sdo]/g, () => (i < rest.length ? String(rest[i++]) : ''));
    // keep only the first meaningful line (React appends long component stacks)
    return text.split('\n').find((l) => l.trim()) || text;
  }

  function create(kind) {
    const React = root.React;
    const ReactDOM = root.ReactDOM;
    const native = kind === 'native';
    const state = {
      logs: null,
      origError: null,
      roots: [], // roots created by tests (cleaned up afterwards)
      containers: [],
      alerts: [],
      shim: native ? root.RNShim.create(React, { alert: (t, m, b) => alertHook(t, m, b) }) : null,
      playground: null,
    };

    function alertHook(title, message, buttons) {
      state.alerts.push({ title, message, buttons: buttons || [] });
      const host = state.playground;
      if (!host || !host.isConnected) return;
      const box = document.createElement('div');
      box.className = 'rn-alert-overlay';
      const card = document.createElement('div');
      card.className = 'rn-alert';
      card.innerHTML = '<b></b><p></p>';
      card.firstChild.textContent = title == null ? '' : String(title);
      card.lastChild.textContent = message == null ? '' : String(message);
      const list = buttons && buttons.length ? buttons : [{ text: 'OK' }];
      list.forEach((b) => {
        const btn = document.createElement('button');
        btn.textContent = b.text || 'OK';
        btn.onclick = () => {
          box.remove();
          if (b.onPress) b.onPress();
        };
        card.appendChild(btn);
      });
      box.appendChild(card);
      host.appendChild(box);
    }

    function makeRoot(container, track) {
      const r = ReactDOM.createRoot(container);
      if (track) state.roots.push(r);
      return r;
    }

    // ---- what learner code can use without importing ----
    function scope(playground) {
      state.playground = playground;
      const hooks = {};
      ['useState', 'useEffect', 'useLayoutEffect', 'useRef', 'useMemo', 'useCallback', 'useReducer', 'useContext', 'createContext', 'Fragment', 'memo', 'StrictMode'].forEach((n) => {
        hooks[n] = React[n];
      });
      function render(element) {
        if (!playground) throw new Error('There is no preview area to render into here.');
        if (!playground._reactRoot) playground._reactRoot = ReactDOM.createRoot(playground);
        ReactDOM.flushSync(() => playground._reactRoot.render(element));
      }
      return Object.assign({ React, ReactDOM, render }, hooks, state.shim ? state.shim.components : {});
    }

    // ---- helpers handed to tests ----
    function ctx() {
      const h = React.createElement;
      const tick = (ms) => new Promise((r) => setTimeout(r, ms == null ? 30 : ms));

      function mount(element) {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;left:-9999px;top:0;width:320px';
        document.body.appendChild(container);
        state.containers.push(container);
        const r = makeRoot(container, true);
        ReactDOM.flushSync(() => r.render(element));
        const view = {
          container,
          h,
          text: () => container.textContent,
          html: () => container.innerHTML,
          $: (sel) => container.querySelector(sel),
          $$: (sel) => Array.from(container.querySelectorAll(sel)),
          getByText(text) {
            const all = Array.from(container.querySelectorAll('*'));
            const exact = all.filter((n) => n.textContent.trim() === text);
            const pool = exact.length ? exact : all.filter((n) => n.textContent.includes(text));
            // deepest match
            const deepest = pool.filter((n) => !pool.some((m) => m !== n && n.contains(m)));
            return deepest[0] || null;
          },
          el(target) {
            let node = target;
            if (typeof target === 'string') {
              const bySelector = () => {
                try {
                  return container.querySelector(target);
                } catch (e) {
                  return null;
                }
              };
              // "input", ".card", "[data-rn=…]" look like selectors; everything else is visible text
              const selectorLike = /^[a-z][a-z0-9]*$|[\[.#>:]/.test(target);
              node = selectorLike ? bySelector() || view.getByText(target) : view.getByText(target) || bySelector();
            }
            if (!node) throw new Error('Could not find ' + (typeof target === 'string' ? '"' + target + '"' : 'that element') + ' on the screen.');
            return node;
          },
          click(target) {
            const node = view.el(target);
            ReactDOM.flushSync(() => node.click());
          },
          type(target, value) {
            const node = view.el(target);
            const proto = node.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
            ReactDOM.flushSync(() => {
              setter.call(node, value);
              node.dispatchEvent(new Event('input', { bubbles: true }));
            });
          },
          key(target, key) {
            const node = view.el(target);
            ReactDOM.flushSync(() => node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })));
            ReactDOM.flushSync(() => node.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true })));
          },
          rerender(next) {
            ReactDOM.flushSync(() => r.render(next));
          },
          unmount() {
            ReactDOM.flushSync(() => r.unmount());
          },
          tick,
        };
        return view;
      }

      return { h, mount, tick, React, alerts: state.alerts };
    }

    return {
      transform(code) {
        try {
          return root.Babel.transform(stripModules(code), { presets: ['react'], sourceType: 'script' }).code;
        } catch (e) {
          const first = String(e.message || e).split('\n')[0].replace(/^unknown:\s*/, '');
          const err = new SyntaxError(first);
          throw err;
        }
      },
      scope,
      ctx,
      // route React's own warnings (missing keys etc.) into the learner's output panel
      attach(logs) {
        state.logs = logs;
        state.origError = console.error;
        console.error = function () {
          const msg = formatReactWarning(Array.prototype.slice.call(arguments));
          if (state.logs) state.logs.push('⚠ ' + msg.replace(/^Warning:\s*/, ''));
        };
      },
      finish() {
        if (state.origError) console.error = state.origError;
        state.origError = null;
        state.roots.forEach((r) => {
          try {
            r.unmount();
          } catch (e) {
            /* already gone */
          }
        });
        state.roots = [];
        state.containers.forEach((c) => c.remove());
        state.containers = [];
      },
    };
  }

  // Unmount whatever the learner rendered into a preview element (used before re-running).
  function resetPreview(el) {
    if (!el) return;
    if (el._reactRoot) {
      try {
        el._reactRoot.unmount();
      } catch (e) {
        /* ignore */
      }
      el._reactRoot = null;
    }
    el.innerHTML = '';
  }

  const api = { create, resetPreview, stripModules };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReactRT = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
