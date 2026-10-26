/* app.js — UI: routing, lesson rendering, editors, quizzes, progress. */
(function () {
  'use strict';

  const STORE_KEY = 'js-bootcamp-v1';
  const $ = (sel, root = document) => root.querySelector(sel);
  const main = $('#main');
  const sidebar = $('#sidebar');

  // ───────────── progress (localStorage, but the app works without it) ─────────────
  let state = { passed: {}, code: {}, quiz: {}, playground: '' };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) state = Object.assign(state, saved);
  } catch (e) { /* private mode etc. */ }
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
  // `code` and **bold** — everything else is escaped, so lesson text can never inject HTML.
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

  const exerciseCount = (l) => l.exercises.length;
  const lessonDone = (l) => l.exercises.every((e) => state.passed[e.id]);
  const lessonPassedCount = (l) => l.exercises.filter((e) => state.passed[e.id]).length;

  function updateProgress() {
    const total = LESSONS.reduce((n, l) => n + exerciseCount(l), 0);
    const done = LESSONS.reduce((n, l) => n + lessonPassedCount(l), 0);
    const pct = total ? Math.round((done / total) * 100) : 0;
    $('#overallFill').style.width = pct + '%';
    $('#overallText').textContent = pct + '%';
    renderSidebar();
  }

  // ───────────── sidebar ─────────────
  function renderSidebar() {
    const current = currentRoute().id;
    sidebar.innerHTML = '';
    sidebar.append(
      el('a', { class: 'nav-item' + (current === 'home' ? ' active' : ''), href: '#/home' }, el('span', { class: 'nav-num' }, '⌂'), 'Start here')
    );
    sidebar.append(el('h4', {}, 'Lessons'));
    LESSONS.forEach((l, i) => {
      sidebar.append(
        el(
          'a',
          { class: 'nav-item' + (current === l.id ? ' active' : '') + (lessonDone(l) ? ' done' : ''), href: '#/lesson/' + l.id },
          el('span', { class: 'nav-num' }, lessonDone(l) ? '✓' : String(i + 1)),
          l.title.split(':')[0],
          el('small', {}, lessonPassedCount(l) + '/' + exerciseCount(l))
        )
      );
    });
    sidebar.append(el('h4', {}, 'Tools'));
    sidebar.append(
      el('a', { class: 'nav-item' + (current === 'playground' ? ' active' : ''), href: '#/playground' }, el('span', { class: 'nav-num' }, '▶'), 'Free playground')
    );
  }

  // ───────────── running code ─────────────
  function renderOutput(box, res) {
    box.innerHTML = '';
    if (res.logs.length) box.append(el('div', {}, res.logs.join('\n')));
    if (res.error) box.append(el('div', { class: 'err' }, '✖ ' + res.error));
    if (!res.logs.length && !res.error) box.append(el('div', { class: 'dim' }, '(no console output — run finished without errors)'));
  }

  function autosize(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(70, Math.min(ta.scrollHeight + 4, 520)) + 'px';
  }

  function makeEditor(initial, onRun, onChange) {
    const ta = el('textarea', { class: 'editor', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Code editor' });
    ta.value = initial;
    ta.addEventListener('input', () => { autosize(ta); onChange && onChange(ta.value); });
    ta.addEventListener('keydown', (ev) => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        const { selectionStart: s, selectionEnd: e } = ta;
        ta.setRangeText('  ', s, e, 'end');
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
  function runnableExample(block) {
    const output = el('div', { class: 'output' });
    const playground = block.dom ? el('div', { class: 'dom-playground' }) : null;
    const original = block.run;
    let editor;
    async function run() {
      if (playground) playground.innerHTML = '';
      output.textContent = '';
      const res = await Engine.runExercise(editor.value, { expose: [], tests: [] }, { playground });
      renderOutput(output, res);
    }
    editor = makeEditor(original, run);
    const reset = el('button', { class: 'btn ghost', onclick: () => { editor.value = original; autosize(editor); output.textContent = ''; if (playground) playground.innerHTML = ''; } }, 'Reset');
    return el(
      'div',
      { class: 'example' },
      el('div', { class: 'ex-head' }, '▶ Try it — edit the code, then run', el('span', { class: 'spacer' }), reset, el('button', { class: 'btn primary', onclick: run }, 'Run ▶')),
      editor,
      output,
      playground
    );
  }

  // Exercise card with tests
  function exerciseCard(ex, index) {
    const card = el('div', { class: 'exercise' + (state.passed[ex.id] ? ' passed' : ''), id: 'ex-' + ex.id });
    const badge = el('span', { class: 'badge' }, state.passed[ex.id] ? '✓ passed' : 'not passed yet');
    const resultBox = el('div');
    const outputBox = el('div', { class: 'output' });
    const hintBox = el('div');
    const playground = ex.browser ? el('div', { class: 'dom-playground' }) : null;

    const startCode = state.code[ex.id] != null ? state.code[ex.id] : ex.starter;

    async function runTests() {
      resultBox.innerHTML = '';
      outputBox.textContent = '';
      if (playground) playground.innerHTML = '';
      runBtn.disabled = true;
      let res;
      try {
        res = await Engine.runExercise(editor.value, ex, { playground });
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
        el(
          'p',
          { class: 'summary ' + (res.passed ? 'good' : 'bad') },
          res.passed ? '🎉 All ' + res.results.length + ' tests passed!' : passedN + ' of ' + res.results.length + ' tests passed — keep going, read the failures below.'
        ),
        el(
          'ul',
          { class: 'results' },
          res.results.map((r) =>
            el(
              'li',
              { class: r.pass ? 'pass' : 'fail' },
              el('span', { class: 'mark' }, r.pass ? '✓' : '✗'),
              el('span', {}, r.name, r.message ? el('span', { class: 'msg' }, r.message) : null)
            )
          )
        )
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

    const hintBtn = el(
      'button',
      {
        class: 'btn',
        onclick: () => {
          hintBox.innerHTML = '';
          hintBox.append(el('div', { class: 'hintbox' }, '💡 ', el('strong', {}, 'Hint'), el('pre', {}, ex.hint)));
        },
      },
      '💡 Hint'
    );
    const solBtn = el(
      'button',
      {
        class: 'btn ghost',
        onclick: () => {
          if (!confirm('Try for a bit longer first! You learn most when you struggle a little.\n\nShow the solution anyway?')) return;
          hintBox.innerHTML = '';
          hintBox.append(el('div', { class: 'hintbox' }, '🔑 ', el('strong', {}, 'One possible solution'), el('pre', {}, ex.solution)));
        },
      },
      'Show solution'
    );
    const resetBtn = el(
      'button',
      {
        class: 'btn ghost',
        onclick: () => {
          editor.value = ex.starter;
          autosize(editor);
          onChange(ex.starter);
          resultBox.innerHTML = '';
          outputBox.textContent = '';
          hintBox.innerHTML = '';
          if (playground) playground.innerHTML = '';
        },
      },
      'Reset code'
    );

    card.append(
      el('div', { class: 'ex-head' }, el('span', { class: 'ex-title' }, 'Exercise ' + (index + 1) + ' · ' + ex.title), el('span', { class: 'spacer' }), badge),
      el('div', { class: 'body', html: para(ex.prompt) }),
      editor,
      el('div', { class: 'actions' }, runBtn, hintBtn, solBtn, resetBtn, el('span', { class: 'spacer' }), el('small', { class: 'dim' }, 'Ctrl/Cmd + Enter to run')),
      hintBox,
      outputBox,
      ...(playground ? [playground] : []),
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
      const buttons = q.options.map((text, oi) =>
        el('button', { class: 'opt', onclick: () => choose(oi) }, text)
      );
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
  function renderBlock(b) {
    if (b.h) return el('h3', {}, b.h);
    if (b.p) return el('div', { html: para(b.p) });
    if (b.list) return el('ul', { class: 'list' }, b.list.map((t) => el('li', { html: inline(t) })));
    if (b.code) return el('pre', { class: 'static' }, b.code);
    if (b.run) return runnableExample(b);
    if (b.tip) return el('div', { class: 'callout tip', html: '💡 ' + inline(b.tip) });
    if (b.warn) return el('div', { class: 'callout warn', html: '⚠️ ' + inline(b.warn) });
    return null;
  }

  function lessonPage(lesson) {
    const idx = LESSONS.indexOf(lesson);
    const page = el('article');
    page.append(
      el('div', { class: 'meta' }, 'Lesson ' + (idx + 1) + ' of ' + LESSONS.length + ' · about ' + lesson.time),
      el('h1', {}, lesson.title)
    );
    lesson.blocks.forEach((b) => page.append(renderBlock(b)));

    page.append(el('h2', {}, '🧠 Quick quiz'), quizSection(lesson));
    page.append(
      el('h2', {}, '🛠 Exercises'),
      el('p', { class: 'lead', html: inline('Write code in each editor and press **Run tests**. Green means done. Stuck? Use the hint.') })
    );
    lesson.exercises.forEach((ex, i) => page.append(exerciseCard(ex, i)));

    if (lesson.outro) lesson.outro.forEach((b) => page.append(renderBlock(b)));

    const prev = LESSONS[idx - 1];
    const next = LESSONS[idx + 1];
    page.append(
      el(
        'div',
        { class: 'pager' },
        prev ? el('a', { href: '#/lesson/' + prev.id }, el('span', { class: 'btn' }, '← ' + prev.title.split(':')[0])) : el('span'),
        next ? el('a', { href: '#/lesson/' + next.id }, el('span', { class: 'btn primary' }, next.title.split(':')[0] + ' →')) : el('a', { href: '#/home' }, el('span', { class: 'btn primary' }, 'Back to start'))
      )
    );
    return page;
  }

  function homePage() {
    const total = LESSONS.reduce((n, l) => n + exerciseCount(l), 0);
    const done = LESSONS.reduce((n, l) => n + lessonPassedCount(l), 0);
    const firstUnfinished = LESSONS.find((l) => !lessonDone(l)) || LESSONS[0];
    const page = el('article', { class: 'hero' });
    page.append(
      el('h1', {}, 'Learn JavaScript. Fast. From zero.'),
      el('p', { class: 'lead' }, 'No experience needed. 14 short lessons, ' + total + ' coding exercises, and automatic tests that tell you exactly what is right and wrong.'),
      el(
        'p',
        {},
        el('a', { href: '#/lesson/' + firstUnfinished.id }, el('span', { class: 'btn primary', style: 'padding:10px 20px;font-size:1rem' }, done === 0 ? 'Start lesson 1 →' : done === total ? 'Review lessons' : 'Continue: ' + firstUnfinished.title.split(':')[0] + ' →'))
      ),
      el('h2', {}, 'How this works'),
      el(
        'div',
        { class: 'steps' },
        el('div', { class: 'step', html: '<b>1 · Read</b>Short, plain-English explanations. No jargon without a definition.' }),
        el('div', { class: 'step', html: '<b>2 · Try</b>Every example is live. Edit it, break it, run it again.' }),
        el('div', { class: 'step', html: '<b>3 · Quiz</b>A few quick questions to lock in the ideas.' }),
        el('div', { class: 'step', html: '<b>4 · Build</b>Exercises with real tests. Pass them all to complete a lesson.' })
      ),
      el('h3', {}, 'Rules of fast learning'),
      el('ul', { class: 'list' }, [
        '**Type the code yourself** — never copy-paste. Your fingers learn too.',
        '**Predict** what an example prints *before* you press Run.',
        '**Break things on purpose.** Errors are information, not failure.',
        'Stuck 10 minutes? Use the hint. Stuck 20? Look at the solution, then **close it and write it again from memory**.',
        'Your code and progress are saved automatically in this browser.',
      ].map((t) => el('li', { html: inline(t) }))),
      el('h2', {}, 'The roadmap'),
      el(
        'div',
        { class: 'cards' },
        LESSONS.map((l, i) =>
          el(
            'a',
            { class: 'card' + (lessonDone(l) ? ' done' : ''), href: '#/lesson/' + l.id },
            el('span', { class: 'n' }, 'LESSON ' + (i + 1) + (lessonDone(l) ? ' ✓' : '')),
            el('strong', {}, l.title),
            el('small', {}, l.time + ' · ' + lessonPassedCount(l) + '/' + exerciseCount(l) + ' exercises')
          )
        )
      ),
      el(
        'p',
        { style: 'margin-top:40px' },
        el('button', {
          class: 'btn ghost',
          onclick: () => {
            if (confirm('Erase all your progress and saved code?')) {
              state = { passed: {}, code: {}, quiz: {}, playground: '' };
              save();
              route();
            }
          },
        }, 'Reset all progress')
      )
    );
    return page;
  }

  function playgroundPage() {
    const output = el('div', { class: 'output' });
    const playground = el('div', { class: 'dom-playground' });
    const starter = '// Your free playground. Anything you write is saved.\nconst words = ["fast", "track", "to", "JavaScript"];\nconsole.log(words.map((w) => w.toUpperCase()).join(" "));\n';
    async function run() {
      playground.innerHTML = '';
      output.textContent = '';
      renderOutput(output, await Engine.runExercise(editor.value, { expose: [], tests: [] }, { playground }));
    }
    const editor = makeEditor(state.playground || starter, run, (v) => { state.playground = v; save(); });
    return el(
      'article',
      {},
      el('h1', {}, 'Free playground'),
      el('p', { class: 'lead', html: inline('Experiment with anything. Use `console.log` to print. The box below the output is a page area available as `playground` for DOM experiments (`await` works at the top level too).') }),
      el('div', { class: 'example' }, el('div', { class: 'ex-head' }, 'Editor', el('span', { class: 'spacer' }), el('button', { class: 'btn primary', onclick: run }, 'Run ▶')), editor, output, playground)
    );
  }

  // ───────────── routing ─────────────
  function currentRoute() {
    const hash = location.hash.replace(/^#\/?/, '');
    const [kind, id] = hash.split('/');
    if (kind === 'lesson' && LESSONS.some((l) => l.id === id)) return { kind, id };
    if (kind === 'playground') return { kind, id: 'playground' };
    return { kind: 'home', id: 'home' };
  }

  function route() {
    const r = currentRoute();
    main.innerHTML = '';
    if (r.kind === 'lesson') {
      const lesson = LESSONS.find((l) => l.id === r.id);
      main.append(lessonPage(lesson));
      document.title = lesson.title + ' — JS Bootcamp';
    } else if (r.kind === 'playground') {
      main.append(playgroundPage());
      document.title = 'Playground — JS Bootcamp';
    } else {
      main.append(homePage());
      document.title = 'JS Bootcamp — Learn JavaScript Fast';
    }
    document.body.classList.remove('menu-open');
    window.scrollTo(0, 0);
    updateProgress();
  }

  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  window.addEventListener('hashchange', route);
  route();
})();
