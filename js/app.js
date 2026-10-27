/* app.js — UI: track picker, routing, lesson rendering, editors, quizzes, progress. */
(function () {
  'use strict';

  const STORE_KEY = 'js-bootcamp-v1';
  const $ = (sel, root = document) => root.querySelector(sel);
  const main = $('#main');
  const sidebar = $('#sidebar');

  // ───────────── progress (localStorage, but the app works without it) ─────────────
  let state = { passed: {}, code: {}, quiz: {}, playground: {}, track: null };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) state = Object.assign(state, saved);
  } catch (e) { /* private mode etc. */ }
  if (typeof state.playground === 'string') state.playground = { js: state.playground }; // old format
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ───────────── tiny helpers ─────────────
  function el(tag, props, ...kids) {
    const node = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
    });
    kids.flat().forEach((k) => k != null && node.append(k));
    return node;
  }
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // `code`, **bold**, *italic* — everything else is escaped, so lesson text can never inject HTML.
  const inline = (s) =>
    escapeHtml(s)
      .split(/(`[^`]+`)/)
      .map((part, i) =>
        i % 2
          ? '<code>' + part.slice(1, -1) + '</code>'
          : part.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\s][^*]*)\*/g, '<em>$1</em>')
      )
      .join('');
  const para = (s) => s.split('\n\n').map((p) => '<p>' + inline(p).replace(/\n/g, '<br>') + '</p>').join('');

  // ───────────── tracks ─────────────
  const trackById = (id) => TRACKS.find((t) => t.id === id);
  const trackOfLesson = (lessonId) => TRACKS.find((t) => t.lessons.some((l) => l.id === lessonId));
  const lessonHref = (t, l) => '#/' + t.id + '/' + l.id;

  const exerciseCount = (l) => l.exercises.length;
  const lessonDone = (l) => l.exercises.every((e) => state.passed[e.id]);
  const lessonPassedCount = (l) => l.exercises.filter((e) => state.passed[e.id]).length;
  const trackTotals = (t) => ({
    total: t.lessons.reduce((n, l) => n + exerciseCount(l), 0),
    done: t.lessons.reduce((n, l) => n + lessonPassedCount(l), 0),
  });
  const trackPercent = (t) => {
    const { total, done } = trackTotals(t);
    return total ? Math.round((done / total) * 100) : 0;
  };
  const shortTitle = (l) => l.title.split(':')[0];

  // ───────────── loading React lazily (only when a React track is opened) ─────────────
  const scriptPromises = {};
  function loadScript(src) {
    if (!scriptPromises[src]) {
      scriptPromises[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Could not load ' + src));
        document.head.append(s);
      });
    }
    return scriptPromises[src];
  }
  async function ensureRuntime(kind) {
    if (!kind) return;
    await loadScript('vendor/react.development.js');
    await loadScript('vendor/react-dom.development.js');
    await loadScript('vendor/babel.min.js');
  }

  // Run learner code (and tests) with the right runtime for the track.
  async function runCode(code, exercise, track, playground, outputBox) {
    let runtime = null;
    if (track.runtime) {
      if (outputBox && !window.Babel) outputBox.textContent = 'Loading React…';
      try {
        await ensureRuntime(track.runtime);
      } catch (e) {
        return { logs: [], error: e.message + ' (are the files in vendor/ present?)', results: [], passed: false };
      }
      runtime = ReactRT.create(track.runtime);
    }
    return Engine.runExercise(code, exercise, { playground, runtime });
  }

  // A preview area: plain box for JS/React, a phone frame for React Native.
  function makePreview(track) {
    if (track.runtime === 'native') {
      const screen = el('div', { class: 'phone-screen' });
      const wrap = el('div', { class: 'phone' }, el('div', { class: 'phone-notch' }), screen);
      return { wrap, target: screen };
    }
    const box = el('div', { class: 'dom-playground' });
    return { wrap: box, target: box };
  }
  function clearPreview(target) {
    if (!target) return;
    if (window.ReactRT) ReactRT.resetPreview(target);
    else target.innerHTML = '';
  }

  // ───────────── sidebar & progress bar ─────────────
  function renderSidebar(r) {
    sidebar.innerHTML = '';
    if (r.view === 'choose') return;
    const t = trackById(r.track);
    sidebar.append(
      el('a', { class: 'nav-item switch', href: '#/choose' }, el('span', { class: 'nav-num' }, '⇄'), 'Switch track'),
      el('div', { class: 'track-title' }, t.icon + ' ' + t.title),
      el('a', { class: 'nav-item' + (r.view === 'home' ? ' active' : ''), href: '#/' + t.id }, el('span', { class: 'nav-num' }, '⌂'), 'Start here')
    );
    sidebar.append(el('h4', {}, 'Lessons'));
    t.lessons.forEach((l, i) => {
      sidebar.append(
        el(
          'a',
          { class: 'nav-item' + (r.view === 'lesson' && r.id === l.id ? ' active' : '') + (lessonDone(l) ? ' done' : ''), href: lessonHref(t, l) },
          el('span', { class: 'nav-num' }, lessonDone(l) ? '✓' : String(i + 1)),
          shortTitle(l),
          el('small', {}, lessonPassedCount(l) + '/' + exerciseCount(l))
        )
      );
    });
    sidebar.append(el('h4', {}, 'Tools'));
    sidebar.append(el('a', { class: 'nav-item' + (r.view === 'playground' ? ' active' : ''), href: '#/' + t.id + '/playground' }, el('span', { class: 'nav-num' }, '▶'), 'Free playground'));
  }

  function updateProgress() {
    const r = currentRoute();
    document.body.classList.toggle('picker', r.view === 'choose');
    if (r.view !== 'choose') {
      const pct = trackPercent(trackById(r.track));
      $('#overallFill').style.width = pct + '%';
      $('#overallText').textContent = pct + '%';
    }
    renderSidebar(r);
  }

  // ───────────── running examples ─────────────
  function renderOutput(box, res) {
    box.innerHTML = '';
    if (res.logs.length) box.append(el('div', {}, res.logs.join('\n')));
    if (res.error) box.append(el('div', { class: 'err' }, '✖ ' + res.error));
    if (!res.logs.length && !res.error) box.append(el('div', { class: 'dim' }, '(no console output — run finished without errors)'));
  }

  function autosize(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(70, Math.min(ta.scrollHeight + 4, 560)) + 'px';
  }

  function makeEditor(initial, onRun, onChange) {
    const ta = el('textarea', { class: 'editor', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Code editor' });
    ta.value = initial;
    ta.addEventListener('input', () => { autosize(ta); onChange && onChange(ta.value); });
    ta.addEventListener('keydown', (ev) => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      } else if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        onRun();
      }
    });
    requestAnimationFrame(() => autosize(ta));
    return ta;
  }

  // Runnable example inside a lesson
  function runnableExample(block, track) {
    const output = el('div', { class: 'output' });
    const wantsPreview = !!track.runtime || !!block.dom;
    const preview = wantsPreview ? makePreview(track.runtime ? track : { runtime: null }) : null;
    const original = block.run;
    const split = track.runtime === 'native';
    let editor;
    async function run() {
      if (preview) clearPreview(preview.target);
      output.textContent = '';
      const res = await runCode(editor.value, { expose: [], tests: [] }, track, preview && preview.target, output);
      renderOutput(output, res);
    }
    editor = makeEditor(original, run);
    const reset = el('button', { class: 'btn ghost', onclick: () => { editor.value = original; autosize(editor); output.textContent = ''; if (preview) clearPreview(preview.target); } }, 'Reset');
    const head = el('div', { class: 'ex-head' }, '▶ Try it — edit the code, then run', el('span', { class: 'spacer' }), reset, el('button', { class: 'btn primary', onclick: run }, 'Run ▶'));
    const body = split ? el('div', { class: 'split' }, el('div', { class: 'split-left' }, editor, output), preview.wrap) : null;
    return el('div', { class: 'example' }, head, body || editor, body ? null : output, !split && preview ? preview.wrap : null);
  }

  // Exercise card with tests
  function exerciseCard(ex, index, track) {
    const card = el('div', { class: 'exercise' + (state.passed[ex.id] ? ' passed' : ''), id: 'ex-' + ex.id });
    const badge = el('span', { class: 'badge' }, state.passed[ex.id] ? '✓ passed' : 'not passed yet');
    const resultBox = el('div');
    const outputBox = el('div', { class: 'output' });
    const hintBox = el('div');
    const wantsPreview = !!track.runtime || !!ex.browser;
    const preview = wantsPreview ? makePreview(track.runtime ? track : { runtime: null }) : null;
    const split = track.runtime === 'native';

    const startCode = state.code[ex.id] != null ? state.code[ex.id] : ex.starter;

    async function runTests() {
      resultBox.innerHTML = '';
      outputBox.textContent = '';
      if (preview) clearPreview(preview.target);
      runBtn.disabled = true;
      let res;
      try {
        res = await runCode(editor.value, ex, track, preview && preview.target, outputBox);
      } finally {
        runBtn.disabled = false;
      }
      renderOutput(outputBox, res);
      if (res.error) {
        resultBox.append(el('p', { class: 'summary bad' }, 'Your code has an error — read the red message above, fix it, and run again.'));
        return;
      }
      const passedN = res.results.filter((r) => r.pass).length;
      resultBox.append(
        el('p', { class: 'summary ' + (res.passed ? 'good' : 'bad') },
          res.passed ? '🎉 All ' + res.results.length + ' tests passed!' : passedN + ' of ' + res.results.length + ' tests passed — keep going, read the failures below.'),
        el('ul', { class: 'results' },
          res.results.map((r) =>
            el('li', { class: r.pass ? 'pass' : 'fail' },
              el('span', { class: 'mark' }, r.pass ? '✓' : '✗'),
              el('span', {}, r.name, r.message ? el('span', { class: 'msg' }, r.message) : null))
          ))
      );
      if (res.passed) {
        state.passed[ex.id] = true;
        card.classList.add('passed');
        badge.textContent = '✓ passed';
      }
      save();
      updateProgress();
    }

    function onChange(value) {
      state.code[ex.id] = value;
      save();
    }

    const editor = makeEditor(startCode, runTests, onChange);
    const runBtn = el('button', { class: 'btn primary', onclick: runTests }, 'Run tests ▶');

    const hintBtn = el('button', {
      class: 'btn',
      onclick: () => {
        hintBox.innerHTML = '';
        hintBox.append(el('div', { class: 'hintbox' }, '💡 ', el('strong', {}, 'Hint'), el('pre', {}, ex.hint)));
      },
    }, '💡 Hint');
    const solBtn = el('button', {
      class: 'btn ghost',
      onclick: () => {
        if (!confirm('Try for a bit longer first! You learn most when you struggle a little.\n\nShow the solution anyway?')) return;
        hintBox.innerHTML = '';
        hintBox.append(el('div', { class: 'hintbox' }, '🔑 ', el('strong', {}, 'One possible solution'), el('pre', {}, ex.solution)));
      },
    }, 'Show solution');
    const resetBtn = el('button', {
      class: 'btn ghost',
      onclick: () => {
        editor.value = ex.starter;
        autosize(editor);
        onChange(ex.starter);
        resultBox.innerHTML = '';
        outputBox.textContent = '';
        hintBox.innerHTML = '';
        if (preview) clearPreview(preview.target);
      },
    }, 'Reset code');

    card.append(
      el('div', { class: 'ex-head' }, el('span', { class: 'ex-title' }, 'Exercise ' + (index + 1) + ' · ' + ex.title), el('span', { class: 'spacer' }), badge),
      el('div', { class: 'body', html: para(ex.prompt) }),
      split ? el('div', { class: 'split' }, editor, preview.wrap) : editor,
      el('div', { class: 'actions' }, runBtn, hintBtn, solBtn, resetBtn, el('span', { class: 'spacer' }), el('small', {}, 'Ctrl/Cmd + Enter to run')),
      hintBox,
      outputBox,
      !split && preview ? preview.wrap : null,
      resultBox
    );
    return card;
  }

  // Quiz
  function quizSection(lesson) {
    const wrap = el('div');
    state.quiz[lesson.id] = state.quiz[lesson.id] || {};
    lesson.quiz.forEach((q, qi) => {
      const box = el('div', { class: 'quiz-q' }, el('p', { html: inline(q.q) }));
      const opts = el('div', { class: 'opts' });
      const why = el('p', { class: 'why' });
      const buttons = q.options.map((text, oi) => el('button', { class: 'opt', onclick: () => choose(oi) }, text));
      function choose(oi) {
        state.quiz[lesson.id][qi] = oi;
        save();
        paint();
      }
      function paint() {
        const chosen = state.quiz[lesson.id][qi];
        buttons.forEach((b, oi) => {
          b.classList.remove('right', 'wrong');
          if (chosen === oi) b.classList.add(oi === q.answer ? 'right' : 'wrong');
          b.disabled = chosen === q.answer; // lock once solved; allow retry otherwise
        });
        why.textContent = chosen == null ? '' : chosen === q.answer ? '✓ Correct! ' + q.why : '✗ Not quite — try another answer.';
      }
      buttons.forEach((b) => opts.append(b));
      box.append(opts, why);
      paint();
      wrap.append(box);
    });
    return wrap;
  }

  // ───────────── pages ─────────────
  function renderBlock(b, track) {
    if (b.h) return el('h3', {}, b.h);
    if (b.p) return el('div', { html: para(b.p) });
    if (b.list) return el('ul', { class: 'list' }, b.list.map((t) => el('li', { html: inline(t) })));
    if (b.code) return el('pre', { class: 'static' }, b.code);
    if (b.run) return runnableExample(b, track);
    if (b.tip) return el('div', { class: 'callout tip', html: '💡 ' + inline(b.tip) });
    if (b.warn) return el('div', { class: 'callout warn', html: '⚠️ ' + inline(b.warn) });
    return null;
  }

  function lessonPage(track, lesson) {
    const idx = track.lessons.indexOf(lesson);
    const page = el('article');
    page.append(
      el('div', { class: 'meta' }, track.icon + ' ' + track.title + ' · Lesson ' + (idx + 1) + ' of ' + track.lessons.length + ' · about ' + lesson.time),
      el('h1', {}, lesson.title)
    );
    lesson.blocks.forEach((b) => page.append(renderBlock(b, track)));

    page.append(el('h2', {}, '🧠 Quick quiz'), quizSection(lesson));
    page.append(
      el('h2', {}, '🛠 Exercises'),
      el('p', { class: 'lead', html: inline('Write code in each editor and press **Run tests**. Green means done. Stuck? Use the hint.') })
    );
    lesson.exercises.forEach((ex, i) => page.append(exerciseCard(ex, i, track)));

    if (lesson.outro) lesson.outro.forEach((b) => page.append(renderBlock(b, track)));

    const prev = track.lessons[idx - 1];
    const next = track.lessons[idx + 1];
    const nextTrack = TRACKS[TRACKS.indexOf(track) + 1];
    let nextLink;
    if (next) nextLink = el('a', { href: lessonHref(track, next) }, el('span', { class: 'btn primary' }, shortTitle(next) + ' →'));
    else if (nextTrack) nextLink = el('a', { href: '#/' + nextTrack.id }, el('span', { class: 'btn primary' }, '🎓 Track complete! Next: ' + nextTrack.title + ' →'));
    else nextLink = el('a', { href: '#/choose' }, el('span', { class: 'btn primary' }, 'Back to tracks'));
    page.append(
      el('div', { class: 'pager' },
        prev ? el('a', { href: lessonHref(track, prev) }, el('span', { class: 'btn' }, '← ' + shortTitle(prev))) : el('a', { href: '#/' + track.id }, el('span', { class: 'btn' }, '← Track start')),
        nextLink)
    );
    return page;
  }

  const PREREQ = {
    react: 'Comfortable with JavaScript functions, arrays (`map`, `filter`), objects and arrow functions? Great. If not, do the **JavaScript** track lessons 1–9 first — it only takes a few hours.',
    native: 'You should know JavaScript and the React basics (components, props, state, `useEffect`). New to those? Finish the **React** track lessons 1–8 first, then come back.',
  };

  function trackHome(track) {
    const { total, done } = trackTotals(track);
    const firstUnfinished = track.lessons.find((l) => !lessonDone(l)) || track.lessons[0];
    const page = el('article', { class: 'hero' });
    page.append(
      el('div', { class: 'meta' }, track.icon + ' ' + track.title + ' track'),
      el('h1', {}, track.id === 'js' ? 'Learn JavaScript. Fast. From zero.' : track.id === 'react' ? 'Learn React. Step by step.' : 'Build mobile apps with React Native.'),
      el('p', { class: 'lead' }, track.lessons.length + ' short lessons, ' + total + ' coding exercises, and automatic tests that tell you exactly what is right and wrong.'),
      el('p', {}, el('a', { href: lessonHref(track, firstUnfinished) },
        el('span', { class: 'btn primary big' }, done === 0 ? 'Start lesson 1 →' : done === total ? 'Review lessons' : 'Continue: ' + shortTitle(firstUnfinished) + ' →')))
    );
    if (PREREQ[track.id]) page.append(el('div', { class: 'callout tip', html: '🧭 **Before you start.** ' + inline(PREREQ[track.id]) }));
    if (track.runtime === 'native') {
      page.append(el('div', { class: 'callout warn', html: '📱 **How it runs here.** Your code runs in a built-in phone simulator. It uses the same components and props as real React Native, so your skills transfer. The final lesson shows how to run on your own phone with Expo.' }));
    }
    page.append(
      el('h2', {}, 'How this works'),
      el('div', { class: 'steps' },
        el('div', { class: 'step', html: '<b>1 · Read</b>Short, plain-English explanations. No jargon without a definition.' }),
        el('div', { class: 'step', html: '<b>2 · Try</b>Every example is live. Edit it, break it, run it again.' }),
        el('div', { class: 'step', html: '<b>3 · Quiz</b>A few quick questions to lock in the ideas.' }),
        el('div', { class: 'step', html: '<b>4 · Build</b>Exercises with real tests. Pass them all to complete a lesson.' })),
      el('h3', {}, 'Rules of fast learning'),
      el('ul', { class: 'list' }, [
        '**Type the code yourself** — never copy-paste. Your fingers learn too.',
        '**Predict** what an example does *before* you press Run.',
        '**Break things on purpose.** Errors are information, not failure.',
        'Stuck 10 minutes? Use the hint. Stuck 20? Look at the solution, then **close it and write it again from memory**.',
        'Your code and progress are saved automatically in this browser.',
      ].map((t) => el('li', { html: inline(t) }))),
      el('h2', {}, 'The roadmap'),
      el('div', { class: 'cards' },
        track.lessons.map((l, i) =>
          el('a', { class: 'card' + (lessonDone(l) ? ' done' : ''), href: lessonHref(track, l) },
            el('span', { class: 'n' }, 'LESSON ' + (i + 1) + (lessonDone(l) ? ' ✓' : '')),
            el('strong', {}, l.title),
            el('small', {}, l.time + ' · ' + lessonPassedCount(l) + '/' + exerciseCount(l) + ' exercises')))),
      el('p', { style: 'margin-top:40px' },
        el('button', {
          class: 'btn ghost',
          onclick: () => {
            if (!confirm('Erase your progress and saved code for the ' + track.title + ' track?')) return;
            track.lessons.forEach((l) => l.exercises.forEach((ex) => { delete state.passed[ex.id]; delete state.code[ex.id]; }));
            save();
            route();
          },
        }, 'Reset ' + track.title + ' progress'))
    );
    return page;
  }

  function choosePage() {
    const page = el('article', { class: 'choose' });
    const resume = TRACKS.find((t) => t.id === state.track);
    page.append(
      el('h1', {}, 'What do you want to learn?'),
      el('p', { class: 'lead' }, 'Pick a track. Each one is a complete, beginner-friendly course with live examples, quizzes, coding exercises and automatic tests. You can switch any time.')
    );
    const cards = el('div', { class: 'tracks' });
    TRACKS.forEach((t, i) => {
      const { total, done } = trackTotals(t);
      const pct = trackPercent(t);
      cards.append(
        el('a', { class: 'track-card' + (resume && resume.id === t.id ? ' resume' : ''), href: '#/' + t.id, onclick: () => { state.track = t.id; save(); } },
          el('span', { class: 'track-icon' }, t.icon),
          el('span', { class: 'track-step' }, 'TRACK ' + (i + 1) + (i === 0 ? ' · START HERE' : '')),
          el('strong', {}, t.title),
          el('span', { class: 'track-tag' }, t.tagline),
          el('span', { class: 'track-meta' }, t.lessons.length + ' lessons · ' + total + ' exercises'),
          el('span', { class: 'track-level' }, t.level),
          el('span', { class: 'bar wide' }, el('span', { class: 'bar-fill', style: 'width:' + pct + '%' })),
          el('span', { class: 'btn primary track-cta' }, done === 0 ? 'Start ' + t.title + ' →' : done === total ? 'Review ' + t.title : 'Continue · ' + pct + '%'))
      );
    });
    page.append(cards, el('p', { class: 'hint' }, '🧭 Complete beginner? Take the tracks in order: JavaScript → React → React Native.'));
    return page;
  }

  const PLAYGROUND_STARTER = {
    js: '// Your free playground. Anything you write is saved.\nconst words = ["fast", "track", "to", "JavaScript"];\nconsole.log(words.map((w) => w.toUpperCase()).join(" "));\n',
    react: '// Free React playground — components, hooks and JSX all work.\nfunction App() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Clicked {n} times</button>;\n}\n\nrender(<App />);\n',
    native: '// Free React Native playground.\nfunction App() {\n  const [n, setN] = useState(0);\n  return (\n    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>\n      <Text style={{ fontSize: 32 }}>{n}</Text>\n      <Button title="Tap" onPress={() => setN(n + 1)} />\n    </View>\n  );\n}\n\nrender(<App />);\n',
  };

  function playgroundPage(track) {
    const output = el('div', { class: 'output' });
    const preview = makePreview(track.runtime ? track : { runtime: null });
    const split = track.runtime === 'native';
    async function run() {
      clearPreview(preview.target);
      output.textContent = '';
      renderOutput(output, await runCode(editor.value, { expose: [], tests: [] }, track, preview.target, output));
    }
    const editor = makeEditor(state.playground[track.id] || PLAYGROUND_STARTER[track.id], run, (v) => { state.playground[track.id] = v; save(); });
    const head = el('div', { class: 'ex-head' }, 'Editor', el('span', { class: 'spacer' }), el('button', { class: 'btn primary', onclick: run }, 'Run ▶'));
    const intro =
      track.id === 'js'
        ? 'Experiment with anything. Use `console.log` to print. The box below the output is a page area available as `playground` for DOM experiments (`await` works at the top level too).'
        : track.id === 'react'
          ? 'Write components with JSX and call `render(<App />)`. All the hooks (`useState`, `useEffect`, …) are available without importing.'
          : 'Write React Native components and call `render(<App />)`. `View`, `Text`, `Pressable`, `TextInput`, `FlatList`, `StyleSheet` and friends are all available.';
    return el('article', {}, el('h1', {}, track.title + ' playground'), el('p', { class: 'lead', html: inline(intro) }),
      el('div', { class: 'example' }, head, split ? el('div', { class: 'split' }, el('div', { class: 'split-left' }, editor, output), preview.wrap) : editor, split ? null : output, split ? null : preview.wrap));
  }

  // ───────────── routing ─────────────
  function currentRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const first = parts[0];
    if (!first || first === 'choose' || first === 'home') return { view: 'choose' };
    // old links: #/lesson/<id> and #/playground
    if (first === 'lesson') {
      const t = trackOfLesson(parts[1]);
      return t ? { view: 'lesson', track: t.id, id: parts[1] } : { view: 'choose' };
    }
    if (first === 'playground') return { view: 'playground', track: 'js' };
    const t = trackById(first);
    if (!t) return { view: 'choose' };
    if (parts.length === 1) return { view: 'home', track: t.id };
    if (parts[1] === 'playground') return { view: 'playground', track: t.id };
    if (t.lessons.some((l) => l.id === parts[1])) return { view: 'lesson', track: t.id, id: parts[1] };
    return { view: 'home', track: t.id };
  }

  function route() {
    const r = currentRoute();
    main.innerHTML = '';
    let title = 'JS Bootcamp — JavaScript, React & React Native';
    if (r.view === 'choose') {
      main.append(choosePage());
    } else {
      const t = trackById(r.track);
      state.track = t.id;
      if (r.view === 'lesson') {
        const lesson = t.lessons.find((l) => l.id === r.id);
        main.append(lessonPage(t, lesson));
        title = lesson.title + ' — ' + t.title;
      } else if (r.view === 'playground') {
        main.append(playgroundPage(t));
        title = t.title + ' playground';
      } else {
        main.append(trackHome(t));
        title = t.title + ' track — JS Bootcamp';
      }
    }
    document.title = title;
    document.body.classList.remove('menu-open');
    window.scrollTo(0, 0);
    updateProgress();
  }

  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  window.addEventListener('hashchange', route);
  route();
})();
