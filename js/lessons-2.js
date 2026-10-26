/*
 * Lessons 7–10. Same text conventions as lessons-1.js (¶ = backtick, $_{ = ${).
 */
(function () {
  const T = (name, fn) => ({ name, fn });

  (globalThis.LESSON_PARTS = globalThis.LESSON_PARTS || []).push(
    // ───────────────────────────────────────── 7
    {
      id: 'loops',
      title: 'Loops',
      time: '20 min',
      blocks: [
        { p: 'Computers are great at repetition. A **loop** repeats a block of code so you do not have to copy-paste it.' },
        { h: 'The for loop' },
        { run: 'for (let i = 0; i < 5; i++) {\n  console.log("Round " + i);\n}' },
        { p: 'Read the three parts inside the brackets:' },
        { list: ['`let i = 0` — **start**: runs once before the loop.', '`i < 5` — **condition**: checked before every round; stops when false.', '`i++` — **step**: runs after every round (`i` grows by 1).'] },
        { h: 'Looping over an array: for…of' },
        { run: 'const colours = ["red", "green", "blue"];\nfor (const colour of colours) {\n  console.log("I like " + colour);\n}' },
        { h: 'Building up a result (the accumulator pattern)' },
        { p: 'Most loops follow one pattern: start with an empty result, update it each round, return it at the end.' },
        { run: 'const numbers = [4, 8, 15, 16];\nlet total = 0;                // 1. start\nfor (const n of numbers) {\n  total += n;                 // 2. update\n}\nconsole.log(total);           // 3. use: 43' },
        { h: 'while, break and continue' },
        { run: 'let count = 0;\nwhile (count < 3) {\n  console.log("count is", count);\n  count++;                // forget this and the loop never ends!\n}\n\nfor (let i = 0; i < 10; i++) {\n  if (i === 2) continue;  // skip this round\n  if (i === 5) break;     // leave the loop entirely\n  console.log(i);\n}' },
        { warn: 'An **infinite loop** (a condition that never becomes false) freezes your program. This site stops runaway loops after ~2 million rounds and shows an error — but in normal programs you must make sure the loop can end.' },
        { tip: 'Looping over a string works too: `for (const ch of "hello") { … }` visits each letter.' },
      ],
      quiz: [
        { q: 'How many times does for (let i = 0; i < 3; i++) run its body?', options: ['2', '3', '4', 'Forever'], answer: 1, why: 'i takes the values 0, 1, 2 — three rounds.' },
        { q: 'What does break do inside a loop?', options: ['Skips this round', 'Exits the loop completely', 'Restarts the loop', 'Pauses'], answer: 1, why: 'continue skips a round; break leaves the loop.' },
        { q: 'Which loop is best to visit every item of an array?', options: ['for…of', 'while(true)', 'if', 'function'], answer: 0, why: 'for…of hands you each item in turn.' },
      ],
      exercises: [
        {
          id: 'loop-1',
          title: 'Sum',
          prompt: 'Write `sum(numbers)` returning the total of all numbers in the array. Use a loop (an empty array gives `0`).',
          starter: 'function sum(numbers) {\n  \n}\n',
          expose: ['sum'],
          hint: 'let total = 0;\nfor (const n of numbers) { total += n; }\nreturn total;',
          solution: 'function sum(numbers) {\n  let total = 0;\n  for (const n of numbers) {\n    total += n;\n  }\n  return total;\n}',
          tests: [
            T('[1,2,3] → 6', (e, { expect }) => expect(e.sum([1, 2, 3])).toBe(6)),
            T('[] → 0', (e, { expect }) => expect(e.sum([])).toBe(0)),
            T('[-1, 1] → 0', (e, { expect }) => expect(e.sum([-1, 1])).toBe(0)),
            T('[10] → 10', (e, { expect }) => expect(e.sum([10])).toBe(10)),
          ],
        },
        {
          id: 'loop-2',
          title: 'Count vowels',
          prompt: 'Write `countVowels(text)` returning how many vowels (`a e i o u`, upper or lower case) are in the text.',
          starter: 'function countVowels(text) {\n  \n}\n',
          expose: ['countVowels'],
          hint: 'Loop over text.toLowerCase(); for each letter check "aeiou".includes(letter).',
          solution: 'function countVowels(text) {\n  let count = 0;\n  for (const ch of text.toLowerCase()) {\n    if ("aeiou".includes(ch)) count++;\n  }\n  return count;\n}',
          tests: [
            T('"hello" → 2', (e, { expect }) => expect(e.countVowels('hello')).toBe(2)),
            T('"XYZ" → 0', (e, { expect }) => expect(e.countVowels('XYZ')).toBe(0)),
            T('"AEIOU" → 5', (e, { expect }) => expect(e.countVowels('AEIOU')).toBe(5)),
            T('"" → 0', (e, { expect }) => expect(e.countVowels('')).toBe(0)),
          ],
        },
        {
          id: 'loop-3',
          title: 'Range',
          prompt: 'Write `range(start, end)` returning an array of every whole number from `start` to `end` **inclusive**. `range(1, 5)` → `[1,2,3,4,5]`. If `start > end`, return `[]`.',
          starter: 'function range(start, end) {\n  \n}\n',
          expose: ['range'],
          hint: 'const result = [];\nfor (let i = start; i <= end; i++) result.push(i);\nreturn result;',
          solution: 'function range(start, end) {\n  const result = [];\n  for (let i = start; i <= end; i++) {\n    result.push(i);\n  }\n  return result;\n}',
          tests: [
            T('range(1, 5)', (e, { expect }) => expect(e.range(1, 5)).toEqual([1, 2, 3, 4, 5])),
            T('range(3, 3) → [3]', (e, { expect }) => expect(e.range(3, 3)).toEqual([3])),
            T('range(5, 1) → []', (e, { expect }) => expect(e.range(5, 1)).toEqual([])),
            T('range(-2, 1)', (e, { expect }) => expect(e.range(-2, 1)).toEqual([-2, -1, 0, 1])),
          ],
        },
        {
          id: 'loop-4',
          title: 'Factorial',
          prompt: 'Write `factorial(n)`: the product of all whole numbers from 1 to n. `factorial(5)` = 5×4×3×2×1 = **120**. `factorial(0)` is `1`.',
          starter: 'function factorial(n) {\n  \n}\n',
          expose: ['factorial'],
          hint: 'let result = 1;\nfor (let i = 2; i <= n; i++) result *= i;\nreturn result;',
          solution: 'function factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}',
          tests: [
            T('5 → 120', (e, { expect }) => expect(e.factorial(5)).toBe(120)),
            T('0 → 1', (e, { expect }) => expect(e.factorial(0)).toBe(1)),
            T('1 → 1', (e, { expect }) => expect(e.factorial(1)).toBe(1)),
            T('10 → 3628800', (e, { expect }) => expect(e.factorial(10)).toBe(3628800)),
          ],
        },
        {
          id: 'loop-5',
          title: 'Reverse a string',
          prompt: 'Write `reverse(text)` returning the text backwards, **using a loop** (no `.reverse()`!). `reverse("abc")` → `"cba"`.',
          starter: 'function reverse(text) {\n  \n}\n',
          expose: ['reverse'],
          hint: 'let out = "";\nfor (const ch of text) { out = ch + out; }  // put each new letter at the FRONT\nreturn out;',
          solution: 'function reverse(text) {\n  let out = "";\n  for (const ch of text) {\n    out = ch + out;\n  }\n  return out;\n}',
          tests: [
            T('"abc" → "cba"', (e, { expect }) => expect(e.reverse('abc')).toBe('cba')),
            T('"" → ""', (e, { expect }) => expect(e.reverse('')).toBe('')),
            T('"racecar" → "racecar"', (e, { expect }) => expect(e.reverse('racecar')).toBe('racecar')),
            T('"Hello World"', (e, { expect }) => expect(e.reverse('Hello World')).toBe('dlroW olleH')),
            T('no .reverse() used', (e, { code, expect }) => expect(/\.reverse\s*\(/.test(code)).toBe(false)),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 8
    {
      id: 'objects',
      title: 'Objects',
      time: '20 min',
      blocks: [
        { p: 'Arrays are lists. **Objects** are *labelled* collections: pairs of **key → value**, perfect for describing one "thing" like a person, product or settings.' },
        { run: 'const person = {\n  name: "Ada",\n  age: 36,\n  languages: ["English", "French"],\n};\n\nconsole.log(person.name);          // dot notation\nconsole.log(person["age"]);        // bracket notation\nconsole.log(person.languages[1]);  // objects & arrays nest\n\nperson.age = 37;                   // change\nperson.city = "London";            // add\ndelete person.languages;           // remove\nconsole.log(person);' },
        { tip: 'Even a `const` object can have its contents changed. `const` only means the *variable* cannot point at a different object.' },
        { h: 'Dynamic keys & looping' },
        { run: 'const prices = { apple: 1.2, bread: 2.5, milk: 0.9 };\n\nconst item = "bread";\nconsole.log(prices[item]);   // bracket notation uses a variable as key\n\nconsole.log(Object.keys(prices));    // ["apple","bread","milk"]\nconsole.log(Object.values(prices));  // [1.2, 2.5, 0.9]\n\nfor (const [name, price] of Object.entries(prices)) {\n  console.log(name + " costs " + price);\n}\n\nconsole.log("milk" in prices);       // true\nconsole.log(prices.cheese);          // undefined' },
        { h: 'Methods and this' },
        { p: 'A function stored in an object is called a **method**. Inside it, `this` means "the object I was called on".' },
        { run: 'const dog = {\n  name: "Rex",\n  bark() {\n    return this.name + " says woof";\n  },\n};\nconsole.log(dog.bark());' },
        { h: 'Shortcuts you will see daily' },
        { run: 'const name = "Ada", age = 36;\nconst p = { name, age };          // shorthand: { name: name, age: age }\nconsole.log(p);\n\nconst { name: n, age: a } = p;    // destructuring: pull values out\nconsole.log(n, a);\n\nconst older = { ...p, age: 37 };  // copy with one change\nconsole.log(older, p);\n\nconst text = JSON.stringify(p);   // object → string (to send/save)\nconsole.log(text);\nconsole.log(JSON.parse(text));    // string → object' },
        { warn: 'Reading a property of `undefined` crashes: `user.address.city` throws if `address` is missing. The safe version is optional chaining: `user.address?.city` gives `undefined` instead of an error.' },
      ],
      quiz: [
        { q: 'How do you read the "name" property of an object called user?', options: ['user(name)', 'user.name', 'user->name', 'name.user'], answer: 1, why: 'Dot notation: object.property.' },
        { q: 'What does Object.keys({a:1,b:2}) return?', options: ['[1,2]', '["a","b"]', '{a,b}', '2'], answer: 1, why: 'keys gives the property names.' },
        { q: 'Inside a method, what does this refer to?', options: ['The window', 'The object the method was called on', 'Nothing', 'The previous line'], answer: 1, why: 'dog.bark() → this is dog.' },
      ],
      exercises: [
        {
          id: 'obj-1',
          title: 'Build a person',
          prompt: 'Write `makePerson(name, age)` returning an object `{ name, age, isAdult }` where `isAdult` is `true` when age is 18 or more.',
          starter: 'function makePerson(name, age) {\n  \n}\n',
          expose: ['makePerson'],
          hint: 'return { name, age, isAdult: age >= 18 };',
          solution: 'function makePerson(name, age) {\n  return { name, age, isAdult: age >= 18 };\n}',
          tests: [
            T('adult', (e, { expect }) => expect(e.makePerson('Ana', 30)).toEqual({ name: 'Ana', age: 30, isAdult: true })),
            T('child', (e, { expect }) => expect(e.makePerson('Tim', 12)).toEqual({ name: 'Tim', age: 12, isAdult: false })),
            T('18 is an adult (boundary)', (e, { expect }) => expect(e.makePerson('Zed', 18).isAdult).toBe(true)),
          ],
        },
        {
          id: 'obj-2',
          title: 'Describe with destructuring',
          prompt: 'Write `describe(person)` taking `{ name, age }` and returning `"<name> is <age> years old"`. Try destructuring in the parameter: `function describe({ name, age })`.',
          starter: 'function describe(person) {\n  \n}\n',
          expose: ['describe'],
          hint: 'const { name, age } = person;\nreturn ¶$_{name} is $_{age} years old¶;',
          solution: 'function describe({ name, age }) {\n  return ¶$_{name} is $_{age} years old¶;\n}',
          tests: [
            T('Ana, 30', (e, { expect }) => expect(e.describe({ name: 'Ana', age: 30 })).toBe('Ana is 30 years old')),
            T('ignores extra keys', (e, { expect }) => expect(e.describe({ name: 'Bo', age: 5, city: 'X' })).toBe('Bo is 5 years old')),
          ],
        },
        {
          id: 'obj-3',
          title: 'Word counter',
          prompt: 'Write `countWords(sentence)` returning an object that counts each word, ignoring upper/lower case. `countWords("the cat and the hat")` → `{ the: 2, cat: 1, and: 1, hat: 1 }`. An empty sentence gives `{}`.',
          starter: 'function countWords(sentence) {\n  \n}\n',
          expose: ['countWords'],
          hint: 'const counts = {};\nconst words = sentence.toLowerCase().split(" ").filter(Boolean);\nfor (const w of words) {\n  counts[w] = (counts[w] || 0) + 1;\n}\nreturn counts;',
          solution: 'function countWords(sentence) {\n  const counts = {};\n  const words = sentence.toLowerCase().split(" ").filter(Boolean);\n  for (const w of words) {\n    counts[w] = (counts[w] || 0) + 1;\n  }\n  return counts;\n}',
          tests: [
            T('the cat and the hat', (e, { expect }) => expect(e.countWords('the cat and the hat')).toEqual({ the: 2, cat: 1, and: 1, hat: 1 })),
            T('ignores case', (e, { expect }) => expect(e.countWords('Hi hi HI')).toEqual({ hi: 3 })),
            T('empty → {}', (e, { expect }) => expect(e.countWords('')).toEqual({})),
          ],
        },
        {
          id: 'obj-4',
          title: 'A wallet with methods',
          prompt: 'Write `makeWallet(initial)` returning an object with:\n- `balance` (starts at `initial`)\n- `deposit(n)` — adds `n` to the balance\n- `spend(n)` — if there is enough money subtract it and return `true`; otherwise change nothing and return `false`.\n\nUse `this.balance` inside the methods.',
          starter: 'function makeWallet(initial) {\n  return {\n    balance: initial,\n    // deposit(n) { ... },\n    // spend(n) { ... },\n  };\n}\n',
          expose: ['makeWallet'],
          hint: 'deposit(n) { this.balance += n; },\nspend(n) {\n  if (n > this.balance) return false;\n  this.balance -= n;\n  return true;\n},',
          solution: 'function makeWallet(initial) {\n  return {\n    balance: initial,\n    deposit(n) {\n      this.balance += n;\n    },\n    spend(n) {\n      if (n > this.balance) return false;\n      this.balance -= n;\n      return true;\n    },\n  };\n}',
          tests: [
            T('starts with the initial balance', (e, { expect }) => expect(e.makeWallet(10).balance).toBe(10)),
            T('deposit adds money', (e, { expect }) => {
              const w = e.makeWallet(10);
              w.deposit(5);
              expect(w.balance).toBe(15);
            }),
            T('spend succeeds when affordable', (e, { expect }) => {
              const w = e.makeWallet(10);
              expect(w.spend(4)).toBe(true);
              expect(w.balance).toBe(6);
            }),
            T('spend fails when too expensive', (e, { expect }) => {
              const w = e.makeWallet(10);
              expect(w.spend(20)).toBe(false);
              expect(w.balance).toBe(10);
            }),
            T('wallets are independent', (e, { expect }) => {
              const a = e.makeWallet(1);
              const b = e.makeWallet(1);
              a.deposit(100);
              expect(b.balance).toBe(1);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 9
    {
      id: 'array-methods',
      title: 'Array Superpowers: map, filter, reduce',
      time: '25 min',
      blocks: [
        { p: 'Loops work, but professionals reach for **array methods** that express intent: "transform each", "keep some", "combine all". They take a function as an argument (remember: functions are values!).' },
        { h: 'forEach — do something with each' },
        { run: '["a", "b", "c"].forEach((letter, index) => {\n  console.log(index, letter);\n});' },
        { h: 'map — transform every item → new array of the same length' },
        { run: 'const nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2);\nconsole.log(doubled);   // [2,4,6,8]\nconsole.log(nums);      // [1,2,3,4] — original untouched\n\nconst names = ["ada", "bob"];\nconsole.log(names.map((s) => s.toUpperCase()));' },
        { h: 'filter — keep only items that pass a test' },
        { run: 'const nums2 = [1, 2, 3, 4, 5, 6];\nconsole.log(nums2.filter((n) => n % 2 === 0));  // [2,4,6]\nconsole.log(nums2.filter((n) => n > 4));        // [5,6]' },
        { h: 'reduce — boil everything down to ONE value' },
        { run: 'const prices = [10, 5, 20];\nconst total = prices.reduce((sum, price) => sum + price, 0);\n//                              ^ running total  ^ item      ^ start value\nconsole.log(total);   // 35\n\nconst longest = ["hi", "hello", "hey"].reduce((best, w) => (w.length > best.length ? w : best), "");\nconsole.log(longest);' },
        { h: 'find, some, every, sort' },
        { run: 'const people = [\n  { name: "Ada", age: 36 },\n  { name: "Bob", age: 17 },\n  { name: "Cy", age: 25 },\n];\nconsole.log(people.find((p) => p.age < 18));   // first match (or undefined)\nconsole.log(people.some((p) => p.age < 18));   // true  — at least one?\nconsole.log(people.every((p) => p.age > 10));  // true  — all of them?\n\n// sort: return negative → a first, positive → b first\nconst byAge = [...people].sort((a, b) => a.age - b.age);\nconsole.log(byAge.map((p) => p.name));' },
        { warn: '`sort()` **mutates** the array, and without a compare function it sorts as *text* (`[10, 9, 1].sort()` → `[1, 10, 9]`). Always copy first with `[...arr]` and pass `(a, b) => a - b` for numbers.' },
        { h: 'Chaining' },
        { run: 'const total2 = [5, 12, 8, 3, 20]\n  .filter((n) => n >= 8)   // [12, 8, 20]\n  .map((n) => n * 2)       // [24, 16, 40]\n  .reduce((a, b) => a + b, 0);\nconsole.log(total2);       // 80' },
      ],
      quiz: [
        { q: 'Which method returns an array of the SAME length with each item changed?', options: ['filter', 'map', 'reduce', 'find'], answer: 1, why: 'map transforms every item one-to-one.' },
        { q: 'What does [1,2,3,4].filter(n => n > 2) return?', options: ['[3,4]', '[1,2]', '[true,true]', '2'], answer: 0, why: 'filter keeps only the items for which the test is true.' },
        { q: 'What does reduce produce?', options: ['Always an array', 'A single combined value', 'Nothing', 'A boolean'], answer: 1, why: 'It folds the whole array into one result (a number, string, object…).' },
        { q: 'Why copy an array before sort()?', options: ['It is faster', 'sort mutates the original', 'sort needs a copy to run', 'No reason'], answer: 1, why: 'sort changes the array in place.' },
      ],
      exercises: [
        {
          id: 'am-1',
          title: 'map: doubleAll',
          prompt: 'Write `doubleAll(nums)` that returns a new array with every number doubled. Use `.map`.',
          starter: 'function doubleAll(nums) {\n  \n}\n',
          expose: ['doubleAll'],
          hint: 'return nums.map((n) => n * 2);',
          solution: 'function doubleAll(nums) {\n  return nums.map((n) => n * 2);\n}',
          tests: [
            T('[1,2,3]', (e, { expect }) => expect(e.doubleAll([1, 2, 3])).toEqual([2, 4, 6])),
            T('[] → []', (e, { expect }) => expect(e.doubleAll([])).toEqual([])),
            T('does not mutate input', (e, { expect }) => {
              const a = [1, 2];
              e.doubleAll(a);
              expect(a).toEqual([1, 2]);
            }),
            T('uses .map', (e, { code, expect }) => expect(/\.map\s*\(/.test(code)).toBe(true)),
          ],
        },
        {
          id: 'am-2',
          title: 'filter + map: adult names',
          prompt: 'Write `adultNames(people)`. Each person is `{ name, age }`. Return an array of just the **names** of people aged **18 or older**, in the original order.',
          starter: 'function adultNames(people) {\n  \n}\n',
          expose: ['adultNames'],
          hint: 'return people.filter((p) => p.age >= 18).map((p) => p.name);',
          solution: 'function adultNames(people) {\n  return people.filter((p) => p.age >= 18).map((p) => p.name);\n}',
          tests: [
            T('mixed ages', (e, { expect }) =>
              expect(e.adultNames([{ name: 'A', age: 20 }, { name: 'B', age: 10 }, { name: 'C', age: 18 }])).toEqual(['A', 'C'])),
            T('nobody is an adult', (e, { expect }) => expect(e.adultNames([{ name: 'B', age: 10 }])).toEqual([])),
            T('empty list', (e, { expect }) => expect(e.adultNames([])).toEqual([])),
          ],
        },
        {
          id: 'am-3',
          title: 'reduce: cart total',
          prompt: 'Write `cartTotal(cart)`. Each cart item is `{ price, qty }`. Return the sum of `price × qty` for all items (`0` for an empty cart). Use `.reduce`.',
          starter: 'function cartTotal(cart) {\n  \n}\n',
          expose: ['cartTotal'],
          hint: 'return cart.reduce((sum, item) => sum + item.price * item.qty, 0);',
          solution: 'function cartTotal(cart) {\n  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);\n}',
          tests: [
            T('two items', (e, { expect }) => expect(e.cartTotal([{ price: 2.5, qty: 2 }, { price: 10, qty: 1 }])).toBe(15)),
            T('empty cart → 0', (e, { expect }) => expect(e.cartTotal([])).toBe(0)),
            T('single item', (e, { expect }) => expect(e.cartTotal([{ price: 3, qty: 3 }])).toBe(9)),
          ],
        },
        {
          id: 'am-4',
          title: 'sort without side effects',
          prompt: 'Write `sortByAge(people)` returning a **new** array sorted from youngest to oldest. The original must not change.',
          starter: 'function sortByAge(people) {\n  \n}\n',
          expose: ['sortByAge'],
          hint: 'return [...people].sort((a, b) => a.age - b.age);',
          solution: 'function sortByAge(people) {\n  return [...people].sort((a, b) => a.age - b.age);\n}',
          tests: [
            T('sorts ascending', (e, { expect }) => {
              const r = e.sortByAge([{ name: 'A', age: 30 }, { name: 'B', age: 5 }, { name: 'C', age: 12 }]);
              expect(r.map((p) => p.name)).toEqual(['B', 'C', 'A']);
            }),
            T('does not mutate original', (e, { expect }) => {
              const orig = [{ name: 'A', age: 30 }, { name: 'B', age: 5 }];
              e.sortByAge(orig);
              expect(orig.map((p) => p.name)).toEqual(['A', 'B']);
            }),
            T('handles numbers >= 10 correctly', (e, { expect }) => {
              const r = e.sortByAge([{ name: 'x', age: 100 }, { name: 'y', age: 9 }]);
              expect(r[0].name).toBe('y');
            }),
          ],
        },
        {
          id: 'am-5',
          title: 'Chain it: sum of squares of evens',
          prompt: 'Write `sumEvenSquares(nums)`: keep the even numbers, square each, add them up. `[1,2,3,4]` → 2² + 4² = **20**.',
          starter: 'function sumEvenSquares(nums) {\n  \n}\n',
          expose: ['sumEvenSquares'],
          hint: 'nums.filter(...).map(...).reduce(...)',
          solution: 'function sumEvenSquares(nums) {\n  return nums\n    .filter((n) => n % 2 === 0)\n    .map((n) => n * n)\n    .reduce((a, b) => a + b, 0);\n}',
          tests: [
            T('[1,2,3,4] → 20', (e, { expect }) => expect(e.sumEvenSquares([1, 2, 3, 4])).toBe(20)),
            T('all odd → 0', (e, { expect }) => expect(e.sumEvenSquares([1, 3, 5])).toBe(0)),
            T('[] → 0', (e, { expect }) => expect(e.sumEvenSquares([])).toBe(0)),
            T('[6] → 36', (e, { expect }) => expect(e.sumEvenSquares([6])).toBe(36)),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 10
    {
      id: 'scope-closures',
      title: 'Scope & Closures',
      time: '15 min',
      blocks: [
        { p: '**Scope** answers: "where can I see this variable?" Variables declared with `let`/`const` live only inside the nearest pair of `{ }` (a **block**).' },
        { run: 'const outside = "I am global";\n\nfunction demo() {\n  const inside = "I live in demo";\n  console.log(outside);   // ✔ inner code can see outer variables\n  console.log(inside);\n}\ndemo();\n\ntry {\n  console.log(inside);    // ✘ outer code cannot see inner variables\n} catch (e) {\n  console.log("Error:", e.message);\n}' },
        { run: 'if (true) {\n  let secret = 42;\n  console.log(secret);\n}\n// console.log(secret);  // ReferenceError: secret is not defined\n\nfor (let i = 0; i < 2; i++) {}\n// i does not exist out here either' },
        { h: 'Closures: functions remember where they were born' },
        { p: 'A function keeps access to the variables around it **even after the outer function has finished**. That is a *closure*, and it is how you create private, remembered state.' },
        { run: 'function makeCounter() {\n  let count = 0;            // private: nobody outside can touch it\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst a = makeCounter();\nconst b = makeCounter();   // a separate counter with its own count\nconsole.log(a(), a(), a()); // 1 2 3\nconsole.log(b());           // 1' },
        { h: 'Function factories' },
        { run: 'function multiplier(factor) {\n  return (n) => n * factor;   // remembers factor\n}\nconst double = multiplier(2);\nconst tenX = multiplier(10);\nconsole.log(double(7), tenX(7));' },
        { warn: 'Shadowing: an inner variable with the same name hides the outer one. It is legal but confusing — prefer different names.' },
        { tip: 'Rule of thumb: declare variables in the **smallest scope** that needs them, and prefer `const`. Fewer places a variable can be touched = fewer bugs.' },
      ],
      quiz: [
        { q: 'Where is a let variable declared inside an if { } block visible?', options: ['Everywhere', 'Only inside that block', 'Only in the next line', 'Nowhere'], answer: 1, why: 'let and const are block-scoped.' },
        { q: 'What is a closure?', options: ['A closed file', 'A function that remembers variables from where it was created', 'A loop', 'A syntax error'], answer: 1, why: 'Functions carry their surrounding variables with them.' },
        { q: 'If counter1 and counter2 both come from makeCounter(), do they share the count?', options: ['Yes', 'No — each call creates its own count', 'Only if const', 'Randomly'], answer: 1, why: 'Every call to makeCounter creates a fresh scope.' },
      ],
      exercises: [
        {
          id: 'cl-1',
          title: 'makeCounter',
          prompt: 'Write `makeCounter()` that returns a function. Each time that function is called it returns the next number: `1, 2, 3 …`. Two counters must be independent.',
          starter: 'function makeCounter() {\n  \n}\n',
          expose: ['makeCounter'],
          hint: 'let count = 0;\nreturn function () { count++; return count; };',
          solution: 'function makeCounter() {\n  let count = 0;\n  return function () {\n    count++;\n    return count;\n  };\n}',
          tests: [
            T('counts 1, 2, 3', (e, { expect }) => {
              const c = e.makeCounter();
              expect([c(), c(), c()]).toEqual([1, 2, 3]);
            }),
            T('counters are independent', (e, { expect }) => {
              const a = e.makeCounter();
              const b = e.makeCounter();
              a();
              a();
              expect(b()).toBe(1);
              expect(a()).toBe(3);
            }),
          ],
        },
        {
          id: 'cl-2',
          title: 'makeAdder',
          prompt: 'Write `makeAdder(n)` which returns a function that adds `n` to whatever it receives. `makeAdder(5)(3)` → `8`.',
          starter: 'function makeAdder(n) {\n  \n}\n',
          expose: ['makeAdder'],
          hint: 'return (x) => x + n;',
          solution: 'function makeAdder(n) {\n  return (x) => x + n;\n}',
          tests: [
            T('makeAdder(5)(3) = 8', (e, { expect }) => expect(e.makeAdder(5)(3)).toBe(8)),
            T('makeAdder(-1)(1) = 0', (e, { expect }) => expect(e.makeAdder(-1)(1)).toBe(0)),
            T('adders are independent', (e, { expect }) => {
              const add2 = e.makeAdder(2);
              const add10 = e.makeAdder(10);
              expect([add2(1), add10(1)]).toEqual([3, 11]);
            }),
          ],
        },
        {
          id: 'cl-3',
          title: 'once',
          prompt: 'Write `once(fn)` returning a new function that calls `fn` **only the first time**. Later calls do not run `fn` again but return the **first result**.',
          starter: 'function once(fn) {\n  \n}\n',
          expose: ['once'],
          hint: 'let called = false;\nlet result;\nreturn function (...args) {\n  if (!called) { called = true; result = fn(...args); }\n  return result;\n};',
          solution: 'function once(fn) {\n  let called = false;\n  let result;\n  return function (...args) {\n    if (!called) {\n      called = true;\n      result = fn(...args);\n    }\n    return result;\n  };\n}',
          tests: [
            T('runs fn only once', (e, { expect }) => {
              let calls = 0;
              const f = e.once(() => ++calls);
              f();
              f();
              f();
              expect(calls).toBe(1);
            }),
            T('returns the first result every time', (e, { expect }) => {
              const f = e.once((x) => x * 2);
              expect(f(5)).toBe(10);
              expect(f(100)).toBe(10);
            }),
          ],
        },
      ],
    }
  );
})();
