/*
 * Self-check for the course itself:  node tests/verify.js
 *  1. every exercise's reference solution must pass ALL its tests
 *  2. every exercise's starter code must NOT pass (otherwise it's a free win)
 *  3. every quiz has a valid answer index; ids are unique
 * Exercises marked `browser: true` need a real DOM and are skipped here.
 */
const path = require('path');
const Engine = require(path.join(__dirname, '../js/engine.js'));
['lessons-1', 'lessons-2', 'lessons-3'].forEach((f) => require(path.join(__dirname, '../js/' + f + '.js')));
const LESSONS = require(path.join(__dirname, '../js/content.js'));

(async () => {
  let ok = 0, bad = 0, skipped = 0;
  const problems = [];
  const ids = new Set();

  for (const lesson of LESSONS) {
    if (ids.has(lesson.id)) problems.push('duplicate lesson id ' + lesson.id);
    ids.add(lesson.id);

    lesson.quiz.forEach((q, i) => {
      if (!(q.answer >= 0 && q.answer < q.options.length)) problems.push(`${lesson.id} quiz ${i}: bad answer index`);
      if (!q.why) problems.push(`${lesson.id} quiz ${i}: missing explanation`);
    });

    for (const ex of lesson.exercises) {
      if (ids.has(ex.id)) problems.push('duplicate exercise id ' + ex.id);
      ids.add(ex.id);
      if (ex.browser) { skipped++; continue; }

      const sol = await Engine.runExercise(ex.solution, ex);
      if (sol.error) problems.push(`${ex.id}: solution crashed — ${sol.error}`);
      else if (!sol.passed) {
        const failed = sol.results.filter((r) => !r.pass).map((r) => `${r.name} (${r.message})`);
        problems.push(`${ex.id}: solution fails: ${failed.join('; ')}`);
      } else ok++;

      const start = await Engine.runExercise(ex.starter, ex);
      if (start.passed) problems.push(`${ex.id}: STARTER ALREADY PASSES (should fail)`);
    }
  }

  const total = LESSONS.reduce((n, l) => n + l.exercises.length, 0);
  console.log(`${LESSONS.length} lessons, ${total} exercises (${skipped} browser-only skipped)`);
  console.log(`✓ ${ok} solutions pass all their tests`);
  if (problems.length) {
    console.log(`✗ ${problems.length} problem(s):`);
    problems.forEach((p) => console.log('  - ' + p));
    process.exit(1);
  }
  console.log('All good.');
})();
