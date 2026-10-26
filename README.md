# JS Bootcamp

An interactive, zero-install JavaScript course for absolute beginners:
14 lessons · live runnable examples · quizzes · 53 coding exercises with automatic tests.

## Run it
Just open `index.html` in a browser (double-click it). Or serve it:

    npm start        # prints the URL (http://localhost:8000) and opens your browser

Progress and your code are saved in the browser (localStorage).

## Course map
1 Hello JS · 2 Variables & types · 3 Numbers & strings · 4 Decisions · 5 Functions ·
6 Arrays · 7 Loops · 8 Objects · 9 map/filter/reduce · 10 Scope & closures ·
11 Errors & debugging · 12 The DOM · 13 Async/await · 14 Final challenges

## Check the course itself
    npm test         # node tests/verify.js

Verifies that every exercise's reference solution passes all its tests, that no starter
code passes by accident, and that quizzes are well-formed. (DOM exercises need a browser
and are skipped in Node.)

## Layout
    index.html          page shell
    css/style.css       styling (light + dark)
    js/engine.js        runs learner code + test assertions (browser & Node)
    js/lessons-*.js     the course content: text, examples, quizzes, exercises, tests
    js/content.js       assembles lessons
    js/app.js           UI, routing, progress

## Adding an exercise
Add to a lesson's `exercises` array:

    { id, title, prompt, starter, expose: ['fnName'], hint, solution,
      tests: [ T('name', (e, { expect }) => expect(e.fnName(2)).toBe(4)) ] }

`expose` lists the names your code must define; tests receive them as `e`.
In lesson text, `¶` stands for a backtick and `$_{` for `${`.
