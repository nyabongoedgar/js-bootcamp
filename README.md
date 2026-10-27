# JS Bootcamp

Interactive, zero-install courses for absolute beginners. When the app starts you choose a track:

| Track | Lessons | Exercises | What runs your code |
|---|---|---|---|
| 🟨 **JavaScript** | 14 | 53 | your browser |
| ⚛️ **React** | 10 | 32 | real React + JSX (bundled in `vendor/`, no internet needed) |
| 📱 **React Native** | 9 | 24 | a built-in phone simulator that mirrors React Native's components and layout rules |

Every lesson has live runnable examples, a quiz, coding exercises and automatic tests.
Progress and your code are saved in the browser (localStorage).

## Run it
    npm start        # prints the URL (http://localhost:8000) and opens your browser

Or just double-click `index.html`.

## Check the course itself
    npm test         # JavaScript track + structure of all tracks, in Node

For the React and React Native tracks (they need a real DOM) open
`tests/browser-verify.html` through `npm start`, i.e. `http://localhost:8000/tests/browser-verify.html`.
It runs **every** exercise's reference solution (must pass) and starter code (must not pass) and
shows `109/109 solutions pass`.

## Layout
    index.html          page shell
    css/style.css       styling (light + dark)
    js/engine.js        runs learner code + test assertions (browser & Node)
    js/react-runtime.js JSX/hooks runtime and test helpers (mount, click, type…)
    js/rn-shim.js       the React Native simulator (View, Text, Pressable, FlatList…)
    vendor/             React 18, ReactDOM 18, Babel (MIT licensed) — loaded only for React tracks
    js/lessons-*.js     the course content: text, examples, quizzes, exercises, tests
                        (lessons-1/2/3 = JavaScript, lessons-react, lessons-native)
    js/content.js       assembles lessons
    js/app.js           UI, routing, progress

## Adding an exercise
Add to a lesson's `exercises` array:

    { id, title, prompt, starter, expose: ['fnName'], hint, solution,
      tests: [ T('name', (e, { expect }) => expect(e.fnName(2)).toBe(4)) ] }

`expose` lists the names your code must define; tests receive them as `e`.
In lesson text, `¶` stands for a backtick and `$_{` for `${`.
