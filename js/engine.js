/*
 * engine.js — runs the learner's code and the tests against it.
 * Works in the browser AND in Node (used by tests/verify.js).
 */
(function (root) {
  'use strict';

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  // ---------- formatting ----------
  function fmt(v) {
    if (typeof v === 'string') return v;
    return show(v);
  }

  function show(v) {
    if (typeof v === 'string') return JSON.stringify(v);
    if (typeof v === 'function') return '[Function ' + (v.name || 'anonymous') + ']';
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (v === undefined) return 'undefined';
    if (typeof v === 'number' || typeof v === 'bigint' || typeof v === 'symbol') return String(v);
    try {
      const s = JSON.stringify(v);
      return s === undefined ? String(v) : s;
    } catch (e) {
      return String(v);
    }
  }

  // ---------- assertions ----------
  class AssertionError extends Error {}

  function deepEqual(a, b) {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
  }

  function expect(actual) {
    const fail = (msg) => {
      throw new AssertionError(msg);
    };
    return {
      toBe(expected) {
        if (!Object.is(actual, expected)) fail('Expected ' + show(expected) + ' but got ' + show(actual));
      },
      toEqual(expected) {
        if (!deepEqual(actual, expected)) fail('Expected ' + show(expected) + ' but got ' + show(actual));
      },
      toBeTruthy() {
        if (!actual) fail('Expected a truthy value but got ' + show(actual));
      },
      toBeFalsy() {
        if (actual) fail('Expected a falsy value but got ' + show(actual));
      },
      toBeType(type) {
        if (typeof actual !== type) fail('Expected a ' + type + ' but got a ' + typeof actual + ' (' + show(actual) + ')');
      },
      toBeCloseTo(expected, digits) {
        const d = digits === undefined ? 2 : digits;
        if (typeof actual !== 'number' || Math.abs(actual - expected) > Math.pow(10, -d) / 2) {
          fail('Expected about ' + expected + ' but got ' + show(actual));
        }
      },
      toBeGreaterThan(n) {
        if (!(actual > n)) fail('Expected ' + show(actual) + ' to be greater than ' + n);
      },
      toContain(item) {
        const ok = typeof actual === 'string' ? actual.includes(item) : Array.isArray(actual) && actual.includes(item);
        if (!ok) fail('Expected ' + show(actual) + ' to contain ' + show(item));
      },
      toThrow(message) {
        let threw = false;
        let err;
        try {
          actual();
        } catch (e) {
          threw = true;
          err = e;
        }
        if (!threw) fail('Expected the function to throw an error, but it did not');
        if (message !== undefined && !(err && String(err.message).includes(message))) {
          fail('Expected error message to include ' + show(message) + ' but got ' + show(err && err.message));
        }
      },
    };
  }

  // ---------- helpers ----------
  function withTimeout(promise, ms, label) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label || 'Timed out after ' + ms + 'ms')), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  // Cheap safety net so a forgotten i++ doesn't freeze the page forever.
  function guardLoops(code) {
    const trap = 'if(++__g>2e6)throw new Error("Infinite loop? A loop ran too many times.");';
    return 'let __g=0;' + code.replace(/\b(while|for)\s*\([^()]*\)\s*\{/g, (m) => m + trap);
  }

  function makeConsole(logs) {
    const push = (prefix) =>
      function () {
        const text = Array.prototype.map.call(arguments, fmt).join(' ');
        logs.push(prefix ? prefix + ' ' + text : text);
      };
    return {
      log: push(''),
      info: push(''),
      debug: push(''),
      table: push(''),
      warn: push('Warning:'),
      error: push('Error:'),
    };
  }

  /**
   * Run learner code, then (optionally) the exercise's tests.
   * exercise = { expose: [names], tests: [{name, fn}] }
   * returns { logs, error, results, passed }
   */
  async function runExercise(code, exercise, opts) {
    opts = opts || {};
    const logs = [];
    const names = exercise.expose || [];
    const out = { logs, error: null, results: [], passed: false };

    let env = {};
    try {
      const tail =
        '\n;return {' +
        names.map((n) => JSON.stringify(n) + ': (typeof ' + n + ' === "undefined" ? undefined : ' + n + ')').join(',') +
        '};';
      const fn = new AsyncFunction('console', 'playground', guardLoops(code) + tail);
      env = await withTimeout(fn(makeConsole(logs), opts.playground), 4000, 'Your code took longer than 4 seconds to finish.');
    } catch (e) {
      out.error = (e && e.name ? e.name : 'Error') + ': ' + (e && e.message ? e.message : e);
      return out;
    }

    const tests = exercise.tests || [];
    if (!tests.length) return out;

    const missing = names.filter((n) => env[n] === undefined);
    const ctx = { logs, code, playground: opts.playground, expect, show };

    for (const t of tests) {
      if (missing.length) {
        out.results.push({
          name: t.name,
          pass: false,
          message: "I can't find " + missing.map((m) => '`' + m + '`').join(', ') + ' — is it named exactly like that?',
        });
        continue;
      }
      try {
        await withTimeout(Promise.resolve(t.fn(env, ctx)), 4000, 'This test timed out (4s).');
        out.results.push({ name: t.name, pass: true });
      } catch (e) {
        out.results.push({ name: t.name, pass: false, message: e && e.message ? e.message : String(e) });
      }
    }
    out.passed = out.results.length > 0 && out.results.every((r) => r.pass);
    return out;
  }

  const Engine = { runExercise, expect, show, deepEqual };
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
  else root.Engine = Engine;
})(typeof globalThis !== 'undefined' ? globalThis : this);
