/*
 * Lessons 11–14. Same text conventions (¶ = backtick, $_{ = ${).
 * Exercises flagged `browser: true` need a real DOM and are skipped by tests/verify.js.
 */
(function () {
  const T = (name, fn) => ({ name, fn });

  // Shared starter for the async exercises.
  const GET_USER = [
    '// A pretend server. It answers after 10ms.',
    'function getUser(id) {',
    '  return new Promise((resolve, reject) => {',
    '    setTimeout(() => {',
    '      if (id > 0) resolve({ id, name: "User " + id });',
    '      else reject(new Error("Invalid id"));',
    '    }, 10);',
    '  });',
    '}',
    '',
  ].join('\n');

  (globalThis.LESSON_PARTS = globalThis.LESSON_PARTS || []).push(
    // ───────────────────────────────────────── 11
    {
      id: 'errors',
      title: 'Errors & Debugging',
      time: '15 min',
      blocks: [
        { p: 'Every programmer writes bugs all day long. The skill is **finding** and **handling** them calmly.' },
        { h: 'The three kinds of problems' },
        { list: ['**Syntax errors** — broken grammar (missing bracket). The code will not even start.', '**Runtime errors** — the code starts, then crashes (`undefined.name`).', '**Logic errors** — no error at all, just the wrong answer. The sneakiest kind.'] },
        { h: 'Reading an error message' },
        { run: 'const user = undefined;\nconsole.log(user.name);' },
        { p: '`TypeError: Cannot read properties of undefined (reading \'name\')` — "you asked `undefined` for its `name`". The fix is to find out why `user` is `undefined`.' },
        { h: 'try / catch — handle failures gracefully' },
        { run: 'function parse(text) {\n  try {\n    return JSON.parse(text);\n  } catch (error) {\n    console.log("Could not parse:", error.message);\n    return null;\n  }\n}\nconsole.log(parse(\'{"ok": true}\'));\nconsole.log(parse("not json"));' },
        { h: 'throw — raise your own errors' },
        { run: 'function setAge(age) {\n  if (age < 0) {\n    throw new Error("Age cannot be negative");\n  }\n  return age;\n}\n\ntry {\n  setAge(-5);\n} catch (e) {\n  console.log(e.message);\n}' },
        { h: 'Debugging toolkit' },
        { list: ['**console.log** values at several points: "what is this variable *really*?"', 'Check the **type** with `typeof`. A "number" that is secretly a string causes endless pain.', 'Shrink the problem: delete code until the bug disappears, then you know where it hides.', 'Read the code **aloud**, line by line, as the computer would — not as you wish it behaved.', 'In a real browser, press **F12** → Console tab and Sources tab (breakpoints). It is your best friend.'] },
        { tip: 'Never ignore the **first** error in a list. Later errors are often just consequences of the first.' },
      ],
      quiz: [
        { q: 'Which kind of bug gives the wrong answer without any error message?', options: ['Syntax error', 'Runtime error', 'Logic error', 'None'], answer: 2, why: 'Logic errors run fine but do the wrong thing.' },
        { q: 'What does throw new Error("x") do?', options: ['Prints x', 'Stops normal flow and raises an error', 'Ignores x', 'Restarts'], answer: 1, why: 'Execution jumps to the nearest catch (or crashes if none).' },
        { q: 'Code in the catch block runs when…', options: ['Always', 'Never', 'The try block throws an error', 'The loop ends'], answer: 2, why: 'catch only runs when something in try failed.' },
      ],
      exercises: [
        {
          id: 'err-1',
          title: 'safeParse',
          prompt: 'Write `safeParse(text)` that tries `JSON.parse(text)` and returns the result. If the text is invalid JSON return `null` instead of crashing.',
          starter: 'function safeParse(text) {\n  \n}\n',
          expose: ['safeParse'],
          hint: 'try { return JSON.parse(text); } catch (e) { return null; }',
          solution: 'function safeParse(text) {\n  try {\n    return JSON.parse(text);\n  } catch (e) {\n    return null;\n  }\n}',
          tests: [
            T('valid object', (e, { expect }) => expect(e.safeParse('{"a":1}')).toEqual({ a: 1 })),
            T('valid array', (e, { expect }) => expect(e.safeParse('[1,2]')).toEqual([1, 2])),
            T('invalid → null', (e, { expect }) => expect(e.safeParse('nope')).toBe(null)),
            T('empty string → null', (e, { expect }) => expect(e.safeParse('')).toBe(null)),
          ],
        },
        {
          id: 'err-2',
          title: 'divide (throwing)',
          prompt: 'Write `divide(a, b)` returning `a / b`. If `b` is `0`, **throw** `new Error("Cannot divide by zero")`.',
          starter: 'function divide(a, b) {\n  \n}\n',
          expose: ['divide'],
          hint: 'if (b === 0) throw new Error("Cannot divide by zero");\nreturn a / b;',
          solution: 'function divide(a, b) {\n  if (b === 0) {\n    throw new Error("Cannot divide by zero");\n  }\n  return a / b;\n}',
          tests: [
            T('10 / 2 = 5', (e, { expect }) => expect(e.divide(10, 2)).toBe(5)),
            T('1 / 4 = 0.25', (e, { expect }) => expect(e.divide(1, 4)).toBe(0.25)),
            T('throws on zero', (e, { expect }) => expect(() => e.divide(1, 0)).toThrow('Cannot divide by zero')),
          ],
        },
        {
          id: 'err-3',
          title: 'Validate an age',
          prompt: 'Write `parseAge(input)` that turns text into a number, or throws:\n- not a number (or empty) → `Error("Age must be a number")`\n- below 0 or above 120 → `Error("Age must be between 0 and 120")`\n- otherwise → return the number.',
          starter: 'function parseAge(input) {\n  \n}\n',
          expose: ['parseAge'],
          hint: 'const n = Number(input);\nif (input === "" || Number.isNaN(n)) throw new Error("Age must be a number");\nif (n < 0 || n > 120) throw …\nreturn n;',
          solution: 'function parseAge(input) {\n  const n = Number(input);\n  if (input === "" || Number.isNaN(n)) {\n    throw new Error("Age must be a number");\n  }\n  if (n < 0 || n > 120) {\n    throw new Error("Age must be between 0 and 120");\n  }\n  return n;\n}',
          tests: [
            T('"42" → 42', (e, { expect }) => expect(e.parseAge('42')).toBe(42)),
            T('"0" → 0 (valid!)', (e, { expect }) => expect(e.parseAge('0')).toBe(0)),
            T('"abc" throws "must be a number"', (e, { expect }) => expect(() => e.parseAge('abc')).toThrow('Age must be a number')),
            T('"" throws "must be a number"', (e, { expect }) => expect(() => e.parseAge('')).toThrow('Age must be a number')),
            T('"150" throws range error', (e, { expect }) => expect(() => e.parseAge('150')).toThrow('between 0 and 120')),
            T('"-5" throws range error', (e, { expect }) => expect(() => e.parseAge('-5')).toThrow('between 0 and 120')),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 12
    {
      id: 'dom',
      title: 'The DOM: Making Web Pages Alive',
      time: '25 min',
      blocks: [
        { p: 'In a browser, JavaScript\'s superpower is controlling the page. The browser turns HTML into a tree of objects called the **DOM** (Document Object Model), and you can find, change, create and remove those objects.' },
        { p: 'The examples below run against a little **playground** box (shown under each example) — it is a real piece of web page that your code can change using the variable `playground`. In a normal page you would use `document` instead.' },
        { h: 'Finding and changing elements' },
        { run: 'playground.innerHTML = "<h3 id=\'title\'>Hello</h3><p class=\'note\'>Some text</p>";\n\nconst title = playground.querySelector("#title");  // find by CSS selector\nconsole.log(title.textContent);\n\ntitle.textContent = "Changed by JavaScript!";\ntitle.style.color = "crimson";\nplayground.querySelector(".note").classList.add("big");', dom: true },
        { list: ['`querySelector("css selector")` → first match; `querySelectorAll` → all matches.', '`textContent` — the text inside; `innerHTML` — the HTML inside.', '`element.style.color = …` — inline CSS; `classList.add/remove/toggle` — CSS classes.', '`getAttribute` / `setAttribute` — things like `href` and `src`.'] },
        { h: 'Creating elements' },
        { run: 'const list = document.createElement("ul");\nfor (const fruit of ["apple", "banana", "cherry"]) {\n  const li = document.createElement("li");\n  li.textContent = fruit;\n  list.appendChild(li);   // attach it to the page\n}\nplayground.innerHTML = "";\nplayground.appendChild(list);', dom: true },
        { tip: 'Inside these examples you can write `document.createElement` as normal — only the *searching* is scoped to `playground`. In a real page you would attach elements to `document.body`.' },
        { h: 'Events: reacting to the user' },
        { p: 'An **event listener** says: "when X happens to this element, run this function."' },
        { run: 'playground.innerHTML = "";\nconst button = document.createElement("button");\nbutton.textContent = "Clicked 0 times";\nlet clicks = 0;\n\nbutton.addEventListener("click", () => {\n  clicks++;\n  button.textContent = "Clicked " + clicks + " times";\n});\nplayground.appendChild(button);', dom: true },
        { p: 'Common events: `click`, `input` (typing), `submit` (forms), `keydown`, `mouseover`, `change`.' },
        { h: 'A full page needs three files' },
        { code: '<!-- index.html -->\n<h1 id="title">Hi</h1>\n<button id="btn">Press me</button>\n<script src="app.js"></script>   <!-- put it LAST -->\n\n// app.js\nconst btn = document.querySelector("#btn");\nbtn.addEventListener("click", () => {\n  document.querySelector("#title").textContent = "You pressed it!";\n});' },
        { warn: 'Do not use `innerHTML` with text typed by users — it can inject malicious code. Use `textContent`, which treats everything as plain text.' },
      ],
      quiz: [
        { q: 'Which is safer for showing user-typed text?', options: ['innerHTML', 'textContent', 'Both', 'Neither'], answer: 1, why: 'textContent never interprets text as HTML.' },
        { q: 'What does querySelector(".card") find?', options: ['All elements with class card', 'The first element with class card', 'An element with id card', 'Nothing'], answer: 1, why: 'A dot means class; querySelector returns the first match.' },
        { q: 'To run code when a button is clicked you use…', options: ['button.onrun()', 'button.addEventListener("click", fn)', 'button = click', 'if (button)'], answer: 1, why: 'addEventListener attaches a handler for an event.' },
      ],
      exercises: [
        {
          id: 'dom-1',
          title: 'Create a heading',
          browser: true,
          prompt: 'Using `document.createElement`, make an **h2** whose text is `Hello DOM` and add it to `playground`.',
          starter: '// "playground" is an element on the page.\n// Create the <h2> and add it to playground.\n',
          expose: [],
          hint: 'const h = document.createElement("h2");\nh.textContent = "Hello DOM";\nplayground.appendChild(h);',
          solution: 'const h = document.createElement("h2");\nh.textContent = "Hello DOM";\nplayground.appendChild(h);',
          tests: [
            T('there is an <h2> inside playground', (e, { playground }) => {
              if (!playground.querySelector('h2')) throw new Error('No <h2> found inside playground.');
            }),
            T('its text is "Hello DOM"', (e, { playground, expect }) => expect(playground.querySelector('h2').textContent).toBe('Hello DOM')),
          ],
        },
        {
          id: 'dom-2',
          title: 'Click counter',
          browser: true,
          prompt: 'Create a **button** in `playground`. It starts with the text `Clicked 0 times`, and every click updates it to `Clicked 1 times`, `Clicked 2 times`, …',
          starter: 'let clicks = 0;\n\n',
          expose: [],
          hint: 'Create the button, set textContent, add a "click" listener that increments clicks and updates the text, then append it to playground.',
          solution: 'let clicks = 0;\nconst button = document.createElement("button");\nbutton.textContent = "Clicked 0 times";\nbutton.addEventListener("click", () => {\n  clicks++;\n  button.textContent = "Clicked " + clicks + " times";\n});\nplayground.appendChild(button);',
          tests: [
            T('a button exists', (e, { playground }) => {
              if (!playground.querySelector('button')) throw new Error('No <button> found inside playground.');
            }),
            T('starts at "Clicked 0 times"', (e, { playground, expect }) => expect(playground.querySelector('button').textContent).toBe('Clicked 0 times')),
            T('after 3 clicks says "Clicked 3 times"', (e, { playground, expect }) => {
              const b = playground.querySelector('button');
              b.click();
              b.click();
              b.click();
              expect(b.textContent).toBe('Clicked 3 times');
            }),
          ],
        },
        {
          id: 'dom-3',
          title: 'Render a list',
          browser: true,
          prompt: 'Write `renderList(items)`: it empties `playground`, then adds a `<ul>` with one `<li>` per item (the item as text).',
          starter: 'function renderList(items) {\n  \n}\n',
          expose: ['renderList'],
          hint: 'playground.innerHTML = "";\nconst ul = document.createElement("ul");\nfor (const item of items) { const li = document.createElement("li"); li.textContent = item; ul.appendChild(li); }\nplayground.appendChild(ul);',
          solution: 'function renderList(items) {\n  playground.innerHTML = "";\n  const ul = document.createElement("ul");\n  for (const item of items) {\n    const li = document.createElement("li");\n    li.textContent = item;\n    ul.appendChild(li);\n  }\n  playground.appendChild(ul);\n}',
          tests: [
            T('renders 3 items', (e, { playground, expect }) => {
              e.renderList(['a', 'b', 'c']);
              expect(playground.querySelectorAll('li').length).toBe(3);
            }),
            T('item text is correct', (e, { playground, expect }) => {
              e.renderList(['x', 'y']);
              expect([...playground.querySelectorAll('li')].map((li) => li.textContent)).toEqual(['x', 'y']);
            }),
            T('calling again replaces the old list', (e, { playground, expect }) => {
              e.renderList(['1', '2', '3']);
              e.renderList(['only']);
              expect(playground.querySelectorAll('li').length).toBe(1);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 13
    {
      id: 'async',
      title: 'Async: Promises & async/await',
      time: '25 min',
      blocks: [
        { p: 'Some things take time: loading data from a server, waiting for a timer, reading a file. JavaScript does not freeze while waiting — it starts the job, carries on, and comes back when the answer arrives. This is **asynchronous** code.' },
        { h: 'setTimeout — the simplest async' },
        { run: 'console.log("1. start");\nsetTimeout(() => {\n  console.log("3. runs after 500 ms");\n}, 500);\nconsole.log("2. runs immediately, without waiting!");' },
        { p: 'Notice the order: 1, 2, 3. The timer callback is scheduled for later while the rest of the code continues.' },
        { h: 'Promises' },
        { p: 'A **Promise** is an object meaning "a value will arrive later". It ends in one of two states: **fulfilled** (success) or **rejected** (error).' },
        { run: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nwait(300)\n  .then(() => console.log("300ms later"))\n  .catch((err) => console.log("error", err))\n  .finally(() => console.log("always runs"));' },
        { h: 'async / await — promises that read like normal code' },
        { run: 'const wait2 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nasync function main() {\n  console.log("preparing…");\n  await wait2(400);          // pause THIS function, not the whole program\n  console.log("…done!");\n  return "result";\n}\n\nconst value = await main();  // (top-level await works in these examples)\nconsole.log(value);' },
        { list: ['`async` before a function → it always returns a **Promise**.', '`await` can only be used inside an `async` function (or at the top level of a module).', '`await promise` gives you the resolved value.', 'Errors: wrap in `try / catch`, just like normal code.'] },
        { h: 'Handling errors' },
        { run: 'function failing() {\n  return new Promise((_, reject) => setTimeout(() => reject(new Error("Server down")), 100));\n}\n\ntry {\n  await failing();\n} catch (err) {\n  console.log("Caught:", err.message);\n}' },
        { h: 'Several things at once: Promise.all' },
        { run: 'const sleep = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));\n\nconst start = Date.now();\nconst results = await Promise.all([sleep(300, "A"), sleep(300, "B"), sleep(300, "C")]);\nconsole.log(results, "in about", Date.now() - start, "ms (not 900!)");' },
        { h: 'fetch — talking to the internet' },
        { code: 'async function loadJoke() {\n  const response = await fetch("https://official-joke-api.appspot.com/random_joke");\n  if (!response.ok) throw new Error("Request failed: " + response.status);\n  const data = await response.json();   // 2nd await: reading the body\n  console.log(data.setup, data.punchline);\n}\nloadJoke();' },
        { tip: 'Real apps use `fetch` constantly: you await the response, check `response.ok`, then await `response.json()`. The exercises use a *fake* server so they work anywhere, offline.' },
      ],
      quiz: [
        { q: 'What order will 1, 2, 3 print?  console.log(1); setTimeout(()=>console.log(2), 0); console.log(3);', options: ['1 2 3', '1 3 2', '2 1 3', '3 2 1'], answer: 1, why: 'Even with 0ms the callback waits until the current code finishes.' },
        { q: 'An async function always returns…', options: ['undefined', 'A Promise', 'A string', 'Nothing'], answer: 1, why: 'The returned value is wrapped in a Promise.' },
        { q: 'What does await do?', options: ['Freezes the browser', 'Pauses the async function until the promise settles', 'Cancels a promise', 'Creates a promise'], answer: 1, why: 'Other code keeps running; only this function waits.' },
      ],
      exercises: [
        {
          id: 'as-1',
          title: 'wait',
          prompt: 'Write `wait(ms)` that **returns a Promise** which resolves (with no value) after `ms` milliseconds. Use `setTimeout`.',
          starter: 'function wait(ms) {\n  \n}\n',
          expose: ['wait'],
          hint: 'return new Promise((resolve) => setTimeout(resolve, ms));',
          solution: 'function wait(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}',
          tests: [
            T('returns a Promise', (e, { expect }) => expect(e.wait(1) instanceof Promise).toBe(true)),
            T('waits about the right time', async (e, { expect }) => {
              const start = Date.now();
              await e.wait(80);
              const elapsed = Date.now() - start;
              expect(elapsed >= 70).toBe(true);
              expect(elapsed < 1000).toBe(true);
            }),
          ],
        },
        {
          id: 'as-2',
          title: 'async: delayedDouble',
          prompt: 'The helper `wait` is provided. Write an **async** function `delayedDouble(n)` that waits 20 ms and then returns `n * 2`.',
          starter: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nasync function delayedDouble(n) {\n  \n}\n',
          expose: ['delayedDouble'],
          hint: 'await wait(20);\nreturn n * 2;',
          solution: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nasync function delayedDouble(n) {\n  await wait(20);\n  return n * 2;\n}',
          tests: [
            T('returns a promise', (e, { expect }) => expect(e.delayedDouble(1) instanceof Promise).toBe(true)),
            T('resolves to 42 for 21', async (e, { expect }) => expect(await e.delayedDouble(21)).toBe(42)),
            T('resolves to -6 for -3', async (e, { expect }) => expect(await e.delayedDouble(-3)).toBe(-6)),
          ],
        },
        {
          id: 'as-3',
          title: 'Handle a failing server',
          prompt: '`getUser(id)` is a fake server call: it resolves `{ id, name }` for ids above 0 and **rejects** otherwise.\n\nWrite `async function safeGetUserName(id)` returning the user\'s `name`, or `"Unknown"` if the call fails.',
          starter: GET_USER + '\nasync function safeGetUserName(id) {\n  \n}\n',
          expose: ['safeGetUserName'],
          hint: 'try {\n  const user = await getUser(id);\n  return user.name;\n} catch (error) {\n  return "Unknown";\n}',
          solution: GET_USER + '\nasync function safeGetUserName(id) {\n  try {\n    const user = await getUser(id);\n    return user.name;\n  } catch (error) {\n    return "Unknown";\n  }\n}',
          tests: [
            T('id 3 → "User 3"', async (e, { expect }) => expect(await e.safeGetUserName(3)).toBe('User 3')),
            T('id 0 → "Unknown"', async (e, { expect }) => expect(await e.safeGetUserName(0)).toBe('Unknown')),
            T('id -5 → "Unknown"', async (e, { expect }) => expect(await e.safeGetUserName(-5)).toBe('Unknown')),
          ],
        },
        {
          id: 'as-4',
          title: 'Promise.all',
          prompt: 'Using the same fake `getUser`, write `async function loadNames(ids)` returning an array of the users\' names **in the same order**. Request them all at the same time with `Promise.all`.',
          starter: GET_USER + '\nasync function loadNames(ids) {\n  \n}\n',
          expose: ['loadNames'],
          hint: 'const users = await Promise.all(ids.map((id) => getUser(id)));\nreturn users.map((u) => u.name);',
          solution: GET_USER + '\nasync function loadNames(ids) {\n  const users = await Promise.all(ids.map((id) => getUser(id)));\n  return users.map((u) => u.name);\n}',
          tests: [
            T('[1,2,3]', async (e, { expect }) => expect(await e.loadNames([1, 2, 3])).toEqual(['User 1', 'User 2', 'User 3'])),
            T('[] → []', async (e, { expect }) => expect(await e.loadNames([])).toEqual([])),
            T('uses Promise.all', (e, { code, expect }) => expect(code.includes('Promise.all')).toBe(true)),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 14
    {
      id: 'boss',
      title: 'Final Challenges & What Next',
      time: '30 min',
      blocks: [
        { p: 'You now know the core of JavaScript: values, variables, decisions, functions, arrays, loops, objects, array methods, closures, errors, the DOM and async. These challenges mix everything. They are harder — **struggling is how it sticks**. Use the hint button after you have really tried.' },
        { h: 'A problem-solving recipe' },
        { list: ['**Restate** the problem in your own words.', 'Work one tiny **example by hand** on paper.', 'Write the steps as **comments** first.', 'Turn each comment into code, running often.', 'Test the **edge cases**: empty input, one item, negatives, duplicates.'] },
        { h: 'Quick cheat sheet' },
        { code: 'const x = 1; let y = 2;                 // variables\n`Hi ${name}`                            // template string\nif (a && b) {} else if (c || d) {} else {}\nfor (const item of arr) {}             // loop\nconst f = (a, b = 0) => a + b;          // arrow function\narr.map(fn)  arr.filter(fn)  arr.reduce(fn, start)\narr.find(fn) arr.some(fn)    arr.every(fn)\n[...arr, 1]  { ...obj, key: 1 }        // copy & extend\nconst { a, b } = obj;  const [x, y] = arr;\ntry { } catch (err) { }  throw new Error("msg")\nel.addEventListener("click", fn)\nconst data = await fetch(url).then(r => r.json())' },
      ],
      quiz: [
        { q: 'You get an error you do not understand. First step?', options: ['Delete everything', 'Read the message carefully and note the line number', 'Restart the computer', 'Ignore it'], answer: 1, why: 'Error messages almost always tell you what and where.' },
        { q: 'Which is the best way to test your function?', options: ['Only the happy path', 'Also edge cases like empty input and negatives', 'Never', 'Only once'], answer: 1, why: 'Bugs hide at the edges.' },
      ],
      exercises: [
        {
          id: 'boss-1',
          title: 'Palindrome',
          prompt: 'Write `isPalindrome(text)`: true if the text reads the same backwards, **ignoring case, spaces and punctuation**.\n`"A man, a plan, a canal: Panama"` → `true`',
          starter: 'function isPalindrome(text) {\n  \n}\n',
          expose: ['isPalindrome'],
          hint: 'Clean first: text.toLowerCase().replace(/[^a-z0-9]/g, "")\nThen compare with the reversed version: cleaned.split("").reverse().join("")',
          solution: 'function isPalindrome(text) {\n  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return cleaned === cleaned.split("").reverse().join("");\n}',
          tests: [
            T('"racecar"', (e, { expect }) => expect(e.isPalindrome('racecar')).toBe(true)),
            T('"hello" → false', (e, { expect }) => expect(e.isPalindrome('hello')).toBe(false)),
            T('ignores punctuation and case', (e, { expect }) => expect(e.isPalindrome('A man, a plan, a canal: Panama')).toBe(true)),
            T('"No lemon, no melon"', (e, { expect }) => expect(e.isPalindrome('No lemon, no melon')).toBe(true)),
            T('"" → true', (e, { expect }) => expect(e.isPalindrome('')).toBe(true)),
          ],
        },
        {
          id: 'boss-2',
          title: 'uniq',
          prompt: 'Write `uniq(arr)` returning a new array with duplicates removed, keeping the **first** occurrence order. `[1,2,2,3,1]` → `[1,2,3]`.',
          starter: 'function uniq(arr) {\n  \n}\n',
          expose: ['uniq'],
          hint: 'A Set stores unique values: [...new Set(arr)]  — or use filter with indexOf.',
          solution: 'function uniq(arr) {\n  return [...new Set(arr)];\n}',
          tests: [
            T('numbers', (e, { expect }) => expect(e.uniq([1, 2, 2, 3, 1])).toEqual([1, 2, 3])),
            T('strings', (e, { expect }) => expect(e.uniq(['a', 'a', 'b'])).toEqual(['a', 'b'])),
            T('empty', (e, { expect }) => expect(e.uniq([])).toEqual([])),
            T('does not mutate', (e, { expect }) => {
              const a = [1, 1];
              e.uniq(a);
              expect(a).toEqual([1, 1]);
            }),
          ],
        },
        {
          id: 'boss-3',
          title: 'chunk',
          prompt: 'Write `chunk(arr, size)` splitting an array into groups of `size`. `chunk([1,2,3,4,5], 2)` → `[[1,2],[3,4],[5]]`.',
          starter: 'function chunk(arr, size) {\n  \n}\n',
          expose: ['chunk'],
          hint: 'Loop i from 0 in steps of size: result.push(arr.slice(i, i + size))',
          solution: 'function chunk(arr, size) {\n  const result = [];\n  for (let i = 0; i < arr.length; i += size) {\n    result.push(arr.slice(i, i + size));\n  }\n  return result;\n}',
          tests: [
            T('uneven split', (e, { expect }) => expect(e.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])),
            T('exact split', (e, { expect }) => expect(e.chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])),
            T('empty', (e, { expect }) => expect(e.chunk([], 3)).toEqual([])),
            T('size bigger than array', (e, { expect }) => expect(e.chunk([1, 2], 5)).toEqual([[1, 2]])),
          ],
        },
        {
          id: 'boss-4',
          title: 'groupBy',
          prompt: 'Write `groupBy(arr, keyFn)` returning an object whose keys are `keyFn(item)` and whose values are arrays of matching items.\n`groupBy(["apple","avocado","banana"], s => s[0])` → `{ a: ["apple","avocado"], b: ["banana"] }`',
          starter: 'function groupBy(arr, keyFn) {\n  \n}\n',
          expose: ['groupBy'],
          hint: 'const groups = {};\nfor (const item of arr) {\n  const key = keyFn(item);\n  if (!groups[key]) groups[key] = [];\n  groups[key].push(item);\n}\nreturn groups;',
          solution: 'function groupBy(arr, keyFn) {\n  const groups = {};\n  for (const item of arr) {\n    const key = keyFn(item);\n    if (!groups[key]) groups[key] = [];\n    groups[key].push(item);\n  }\n  return groups;\n}',
          tests: [
            T('groups words by first letter', (e, { expect }) =>
              expect(e.groupBy(['apple', 'avocado', 'banana'], (s) => s[0])).toEqual({ a: ['apple', 'avocado'], b: ['banana'] })),
            T('groups numbers with Math.floor', (e, { expect }) => expect(e.groupBy([1.2, 2.3, 1.9], Math.floor)).toEqual({ 1: [1.2, 1.9], 2: [2.3] })),
            T('empty → {}', (e, { expect }) => expect(e.groupBy([], (x) => x)).toEqual({})),
          ],
        },
        {
          id: 'boss-5',
          title: 'flatten',
          prompt: 'Write `flatten(arr)` that turns an array of arrays (any depth!) into one flat array. `[1, [2, [3, [4]]]]` → `[1,2,3,4]`. (Hint: a function that calls itself is called *recursion*.)',
          starter: 'function flatten(arr) {\n  \n}\n',
          expose: ['flatten'],
          hint: 'Loop over arr. If an item is an array (Array.isArray), push ...flatten(item); otherwise push the item.',
          solution: 'function flatten(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      result.push(...flatten(item));\n    } else {\n      result.push(item);\n    }\n  }\n  return result;\n}',
          tests: [
            T('one level', (e, { expect }) => expect(e.flatten([1, [2, 3]])).toEqual([1, 2, 3])),
            T('deeply nested', (e, { expect }) => expect(e.flatten([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4])),
            T('already flat', (e, { expect }) => expect(e.flatten([1, 2])).toEqual([1, 2])),
            T('empty', (e, { expect }) => expect(e.flatten([])).toEqual([])),
          ],
        },
      ],
      outro: [
        { h: '🎓 Where to go next' },
        { list: ['**Build things.** A to-do list, a quiz app, a weather widget using `fetch`. Projects teach more than lessons.', '**MDN Web Docs** (developer.mozilla.org) — the best free JavaScript reference.', '**javascript.info** — a deeper free tutorial for everything covered here.', 'Learn **HTML & CSS** properly if you have not; JS manipulates them.', 'Then: **Git**, **Node.js**, a framework like **React**, and **TypeScript**.', 'Code a little **every day**. 30 minutes daily beats 5 hours once a week.'] },
      ],
    }
  );
})();
